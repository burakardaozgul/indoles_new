/* Taksonomi tipine bağımlı DEĞİL: serbest olaylar (`contact_form_submitted`,
   `popup_*`) da bu eşlemeden geçmek zorunda — gerekçe aşağıda. */

/**
 * Site taksonomisi → Meta standart olayı eşlemesi (ADR-033).
 *
 * NEDEN AYRI VE SAF
 * -----------------
 * Eşleme `track()` içine gömülseydi test edilebilmesi için `window.fbq`
 * gerekirdi. Burada saf bir fonksiyon: girdi olay adı + parametreler, çıktı
 * Meta yükü. `ga.ts` yalnız sonucu Pixel'e verir.
 *
 * NEDEN TİPLİ OLAY DEĞİL, AD + PARAMETRE (ADR-036)
 * ------------------------------------------------
 * Girdi önce `AnalyticsEvent` idi, yani yalnız `track()` çağırabiliyordu.
 * Ama beş Meta dönüşümünün ÜÇÜ taksonomi dışı ve `gaEvent` ile atılıyor
 * (`contact_form_submitted`, `popup_booking_submitted`,
 * `popup_contact_submitted`). Sonuç: bu üçü `LEAD_EVENTS` listesinde
 * yazıyordu, eşleme onları doğru çeviriyordu, birim testleri de geçiyordu —
 * ama hiç kimse onlar için bu fonksiyonu çağırmıyordu. Meta reklam
 * optimizasyonu gerçek lead'lerin ~%40'ıyla çalışıyordu (denetim, 2026-09-09).
 *
 * Girdi ada indirilince `gaEvent` tek kapı olabildi ve "yeni dönüşümde Meta
 * çağrısını unutmak" ihtimali yapısal olarak kapandı.
 *
 * NEDEN STANDART OLAYLAR
 * ----------------------
 * `ViewContent` ve `Lead` Meta'nın tanıdığı adlar; özel olay adları da
 * kitle kurmaya yarar ama standart olanlar reklam optimizasyonunda
 * doğrudan kullanılabiliyor ve Events Manager'da hazır raporları var.
 *
 * NEDEN HER OLAY EŞLENMİYOR
 * -------------------------
 * Yalnız retargeting segmenti üretebilecek olanlar eşlendi. `faq_opened`
 * ya da `persona_axis_clicked` gibi mikro etkileşimler Meta'ya taşınsa
 * kitleleri seyreltir, reklam tarafında karar değiştirmez.
 */

/**
 * Olayın Meta'ya hangi yoldan gittiği.
 *
 * `browser` — tarayıcı Pixel'i gönderir (`fbq('track', …)`), CAPI kopyası
 * `meta-pixel.ts` içinden çıkar. Kimlik verisi yoktur, olamaz: ViewContent
 * anonim yüzeylerde tetikleniyor (hizmet/paket/vaka/tarama) ve sitede login
 * yok (ADR-008), DB yok (ADR-010).
 *
 * `server` — YALNIZ sunucu gönderir. Lead böyle: e-posta, telefon, ad ve
 * soyad ancak form handler'ında var ve orada zaten doğrulanmış. Tarayıcıdan
 * gönderilmemesinin iki sebebi:
 *   1. Eşleştirme kalitesi — sunucu kopyası kimlik taşır, tarayıcı taşımaz.
 *   2. Teslim — reklam engelleyici tarayıcı Pixel'ini kesebilir, sunucu
 *      çağrısını kesemez. Dönüşüm en kritik olay, en dayanıklı yoldan gider.
 * Tek yol olması aynı zamanda `event_id` koordinasyonunu tamamen ortadan
 * kaldırıyor: iki taraf farklı kimlik üretirse dönüşüm iki kez sayılır ve bu
 * denetimin tamamı tam olarak o sınıf hatayla geçti.
 */
export type MetaChannel = "browser" | "server";

export type MetaEventPayload = {
  name: "ViewContent" | "Lead";
  channel: MetaChannel;
  params?: Record<string, string | number | readonly string[]>;
};

/**
 * Meta tarafında "Lead" sayılan dönüşümler.
 *
 * Her biri sunucudan gönderilir; karşılık gelen handler `sendMetaLead`
 * çağırır (`meta-lead.ts`). Listeye ad eklemek yetmez — handler'a da
 * eklenmezse olay Meta'ya hiç ulaşmaz.
 */
export const LEAD_EVENTS: ReadonlySet<string> = new Set([
  "contact_form_submitted",
  "contact_booking_submitted",
  "popup_booking_submitted",
  "popup_contact_submitted",
  "tool_report_requested",
]);

/**
 * Bir taksonomi olayının Meta karşılığını üretir; karşılığı yoksa `null`.
 *
 * `content_ids` her zaman TR slug'ı taşır — `view-events.ts`teki kararla
 * aynı gerekçe: dile göre ayrışan kimlik aynı varlığı iki kitleye böler.
 */
export function toMetaEvent(
  name: string,
  properties?: Record<string, unknown>,
): MetaEventPayload | null {
  // Lead'in tarayıcı karşılığı YOK: sunucu gönderir (bkz. `MetaChannel`).
  // Yine de burada döndürülüyor ki `ga.ts` "bu olayın Meta karşılığı var ama
  // benim işim değil" ayrımını yapabilsin ve test bunu kilitleyebilsin.
  if (LEAD_EVENTS.has(name)) return { name: "Lead", channel: "server" };

  const p = properties;

  switch (name) {
    case "service_viewed":
      return {
        name: "ViewContent",
        channel: "browser",
        params: {
          content_type: "service",
          content_ids: [String(p?.slug ?? "")],
          content_category: String(p?.pillar ?? ""),
        },
      };

    case "package_viewed":
      return {
        name: "ViewContent",
        channel: "browser",
        params: {
          content_type: "package",
          content_ids: [String(p?.packageSlug ?? "")],
          content_category: String(p?.pillar ?? ""),
          // Paket fiyatı Meta'ya değer olarak gider: değer bazlı kitleler
          // ve ROAS raporları bunu kullanır.
          value: Number(p?.price ?? 0),
          currency: String(p?.currency ?? "TRY"),
        },
      };

    case "case_study_viewed":
      return {
        name: "ViewContent",
        channel: "browser",
        params: {
          content_type: "case_study",
          content_ids: [String(p?.slug ?? "")],
          content_category: String(p?.problemType ?? ""),
        },
      };

    case "tool_scan_completed":
      // Araç taramasını bitiren ziyaretçi en sıcak retargeting segmenti:
      // sorunu ölçtü, sonucu gördü, henüz rapor istemedi.
      return {
        name: "ViewContent",
        channel: "browser",
        params: {
          content_type: "tool",
          content_ids: [String(p?.slug ?? "")],
          content_category: String(p?.band ?? ""),
        },
      };

    default:
      return null;
  }
}
