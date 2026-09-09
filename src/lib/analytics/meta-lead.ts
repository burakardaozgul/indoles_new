import { reportError } from "@/lib/observability/report";
import { sendCapiEvent, type MetaUserData } from "./meta-capi";
import { FBCLID_COOKIE, VISITOR_ID_COOKIE } from "./visitor-id";

/**
 * Sunucu tarafından Meta `Lead` dönüşümü (ADR-036).
 *
 * NEDEN SUNUCUDAN, TARAYICIDAN DEĞİL
 * ----------------------------------
 * Lead'in eşleştirme anahtarları (e-posta, telefon, ad, soyad) yalnız form
 * handler'ında var ve orada zaten şemayla doğrulanmış. Tarayıcıya
 * gönderilmesi hem gereksiz hem riskli olurdu — herkese açık beacon uç
 * noktasına kişisel veri kabul etmek tam olarak bu oturumda kapatılan
 * açıktı (bkz. `lib/schemas/meta-capi.ts`).
 *
 * İkinci sebep teslim: reklam engelleyici tarayıcı Pixel'ini kesebilir,
 * sunucu çağrısını kesemez. Dönüşüm en kritik olay, en dayanıklı yoldan gider.
 *
 * Üçüncü sebep `event_id`: tek gönderici olduğu için paylaşılacak kimlik yok.
 * İki taraf farklı kimlik üretirse dönüşüm iki kez sayılır — bu denetimin
 * tamamı tam olarak o sınıf hatayla geçti.
 *
 * ÇAĞIRAN HANDLER'LAR
 * -------------------
 * `LEAD_EVENTS` (`meta-events.ts`) listesindeki beş dönüşümün her birinin
 * karşılığı bir handler:
 *   contact_form_submitted     → /api/contact
 *   popup_booking_submitted    → /api/booking     (source: popup)
 *   contact_booking_submitted  → /api/booking     (source: contact)
 *   popup_contact_submitted    → /api/visitor-profile
 *   tool_report_requested      → /api/tools/geo-report, /api/tools/diagnoo-unlock
 * Listeye ad eklenip handler'a çağrı eklenmezse olay Meta'ya HİÇ ulaşmaz —
 * üç dönüşüm tam olarak böyle kaybolmuştu (denetim 2026-09-09).
 */

/**
 * Meta'nın `_fbc` biçimi: `fb.<altAlanIndeksi>.<tıklamaZamanı>.<fbclid>`.
 *
 * İndeks Meta'nın kendi sayımı: `com` = 0, `facebook.com` = 1,
 * `www.facebook.com` = 2. Bizim ana makinemiz `www.indoles.com.tr` ve
 * `com.tr` bir public suffix, yani kayıtlanabilir alan `indoles.com.tr` —
 * dolayısıyla `www.facebook.com` ile aynı seviye, **2**.
 *
 * Bu tahmin değil, ölçüm: canlıda Pixel'in kendi yazdığı çerez
 * `fb.2.1788955835995.<fbclid>` (2026-09-09 doğrulaması). Yanlış indeks
 * yazmak yalnız Pixel'in HİÇ yazmadığı durumda etkili olurdu — yani tam da
 * bu yedek yolun devreye girdiği durumda — ve eşleştirmeyi zayıflatırdı.
 *
 * Alan adı değişirse burası da değişir.
 */
const FBC_SUBDOMAIN_INDEX = 2;

function cookieValue(cookieHeader: string, name: string): string | undefined {
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m?.[1] ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Reklam tıklama kimliğini çözer.
 *
 * Önce Pixel'in yazdığı `_fbc` — o varsa doğrusu odur. Yoksa kendi
 * yakaladığımız ham `fbclid`den kurulur (`visitor-id.ts` → `captureFbclid`).
 * İkinci yol iki boşluğu kapatıyor: Pixel yüklenmeden önce gerçekleşen
 * dönüşümler, ve reklam engelleyicinin Pixel'i hiç yüklemediği durumlar.
 */
export function resolveFbc(cookieHeader: string): string | undefined {
  const fromPixel = cookieValue(cookieHeader, "_fbc");
  if (fromPixel) return fromPixel;

  const raw = cookieValue(cookieHeader, FBCLID_COOKIE);
  if (!raw) return undefined;
  const sep = raw.indexOf(".");
  if (sep <= 0) return undefined;
  const ts = raw.slice(0, sep);
  const fbclid = raw.slice(sep + 1);
  if (!/^\d+$/.test(ts) || !fbclid) return undefined;
  return `fb.${FBC_SUBDOMAIN_INDEX}.${ts}.${fbclid}`;
}

/** İsteğin kendi başlıklarından okunan eşleştirme sinyalleri. */
export function requestMatchSignals(req: Request): MetaUserData {
  const cookies = req.headers.get("cookie") ?? "";
  const ip = req.headers.get("cf-connecting-ip");
  const ua = req.headers.get("user-agent");
  const fbp = cookieValue(cookies, "_fbp");
  const fbc = resolveFbc(cookies);
  const externalId = cookieValue(cookies, VISITOR_ID_COOKIE);
  return {
    ...(ip ? { clientIpAddress: ip } : {}),
    ...(ua ? { clientUserAgent: ua } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(externalId ? { externalId } : {}),
  };
}

/** Pazarlama rızası — beacon uç noktasındakiyle aynı biçim (`gd`, ikinci hane). */
export function hasMarketingConsent(req: Request): boolean {
  const raw = req.headers.get("cookie")?.match(/(?:^|;\s*)indoles_consent=([gd]{2})/)?.[1];
  return raw?.charAt(1) === "g";
}

export type LeadIdentity = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Meta'ya `Lead` gönderir. Hata YÜKSELTMEZ ve beklenmesi zorunlu değil:
 * ölçüm sinyali kaybolabilir, ziyaretçinin akışı bundan etkilenmemeli.
 * Çağıran `void sendMetaLead(...)` diyebilir.
 */
export async function sendMetaLead(
  req: Request,
  /** Hangi handler çağırdı — hata logunda teşhis için (`reportError`). */
  route: string,
  identity: LeadIdentity,
  customData?: Record<string, unknown>,
): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  // Yapılandırma eksikse sessizce devre dışı — lokal ve önizlemede normal.
  if (!pixelId || !accessToken) return;

  // Rıza yoksa kişisel veri hiç işlenmez. Bu, istemcideki kapıdan bağımsız
  // ikinci bir denetim: handler'lar herkese açık uç noktalar.
  if (!hasMarketingConsent(req)) return;

  const eventSourceUrl = req.headers.get("referer") ?? undefined;

  try {
    const result = await sendCapiEvent(
      {
        pixelId,
        accessToken,
        ...(process.env.META_CAPI_TEST_CODE
          ? { testEventCode: process.env.META_CAPI_TEST_CODE }
          : {}),
      },
      {
        eventName: "Lead",
        // Tek gönderici olduğu için kimlik burada üretilir; paylaşılacak
        // taraf yok (bkz. dosya başlığı).
        eventId: crypto.randomUUID(),
        ...(eventSourceUrl ? { eventSourceUrl } : {}),
        ...(customData ? { customData } : {}),
        userData: { ...requestMatchSignals(req), ...identity },
      },
    );
    if (!result.ok) {
      reportError(new Error(`meta_lead: ${result.error}`), { route, step: "capi_send" });
    }
  } catch (err) {
    reportError(err instanceof Error ? err : new Error("meta_lead: bilinmeyen hata"), {
      route,
      step: "capi_send",
    });
  }
}
