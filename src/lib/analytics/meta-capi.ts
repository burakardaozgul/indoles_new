/**
 * Meta Conversions API — sunucu tarafı olay gönderimi (ADR-033).
 *
 * NEDEN SUNUCUDAN DA GÖNDERİYORUZ
 * -------------------------------
 * Tarayıcı Pixel'i tek başına eksik ölçüyor: Safari ITP çerezleri kısaltıyor,
 * reklam engelleyiciler `connect.facebook.net`i kesiyor, iOS'ta sinyal
 * daralıyor. CAPI aynı olayı sunucudan bir kez daha bildirir; Meta iki kaydı
 * `event_id` üzerinden birleştirir (deduplication) — bu yüzden `eventId`
 * Pixel çağrısındaki `eventID` ile BİREBİR aynı olmak zorunda, aksi halde
 * dönüşüm iki kez sayılır.
 *
 * KİŞİSEL VERİ
 * ------------
 * E-posta ve telefon Meta'ya ham gönderilmez; SHA-256 ile hash'lenir ve
 * normalize edilir (Meta'nın eşleştirme kuralı: küçük harf, kırpılmış
 * e-posta; yalnız rakamlardan oluşan telefon). Hash geri döndürülemez ama
 * KVKK açısından yine kişisel veri işlemesidir — bu yüzden yalnız pazarlama
 * rızası varsa çağrılır ve `docs/14`te açıkça belirtilir.
 */

const GRAPH_VERSION = "v21.0";

export type MetaUserData = {
  email?: string;
  phone?: string;
  /** İstek başlıklarından gelir; Meta eşleştirmeyi bunlarla güçlendirir. */
  clientIpAddress?: string;
  clientUserAgent?: string;
  /** Pixel'in yazdığı tarayıcı kimliği çerezleri — varsa eşleştirmeyi belirgin artırır. */
  fbp?: string;
  fbc?: string;
};

export type MetaCapiEvent = {
  eventName: string;
  /** Pixel'deki `eventID` ile aynı olmalı — deduplication buna bağlı. */
  eventId: string;
  eventSourceUrl?: string;
  /** Saniye cinsinden; verilmezse şimdi. Meta 7 günden eski olayı reddeder. */
  eventTime?: number;
  customData?: Record<string, unknown>;
  userData?: MetaUserData;
};

/** Meta'nın eşleştirme kuralına göre normalize eder, sonra SHA-256'lar. */
export async function hashForMeta(raw: string): Promise<string> {
  const bytes = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Telefondan rakam dışı her şey atılır. Başında `00` varsa (uluslararası
 * arama öneki) atılır; `0` ile başlayan yerel numaralara Türkiye ülke kodu
 * eklenir — Meta ülke kodsuz numarayı eşleştiremiyor.
 */
export function normalizePhone(phone: string): string {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = `90${d.slice(1)}`;
  else if (!d.startsWith("90") && d.length === 10) d = `90${d}`;
  return d;
}

/** Meta'nın beklediği `user_data` nesnesini üretir; boş alanlar hiç konmaz. */
export async function buildUserData(u: MetaUserData): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  if (u.email) out.em = [await hashForMeta(normalizeEmail(u.email))];
  if (u.phone) out.ph = [await hashForMeta(normalizePhone(u.phone))];
  // IP ve User-Agent hash'lenmez — Meta bunları ham bekliyor.
  if (u.clientIpAddress) out.client_ip_address = u.clientIpAddress;
  if (u.clientUserAgent) out.client_user_agent = u.clientUserAgent;
  if (u.fbp) out.fbp = u.fbp;
  if (u.fbc) out.fbc = u.fbc;
  return out;
}

export type SendResult = { ok: true; received: number } | { ok: false; error: string };

/**
 * Olayı Meta'ya iletir. Ağ hatası yükseltilmez: ölçüm sinyali kaybolabilir
 * ama ziyaretçinin akışı bundan etkilenmemeli.
 */
export async function sendCapiEvent(
  cfg: { pixelId: string; accessToken: string; testEventCode?: string },
  event: MetaCapiEvent,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_id: event.eventId,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: "website",
        ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
        ...(event.customData ? { custom_data: event.customData } : {}),
        user_data: event.userData ? await buildUserData(event.userData) : {},
      },
    ],
    access_token: cfg.accessToken,
  };
  if (cfg.testEventCode) body.test_event_code = cfg.testEventCode;

  try {
    const res = await fetchImpl(
      `https://graph.facebook.com/${GRAPH_VERSION}/${cfg.pixelId}/events`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = (await res.json()) as { events_received?: number; error?: { message?: string } };
    if (!res.ok) return { ok: false, error: data.error?.message ?? `HTTP ${res.status}` };
    return { ok: true, received: data.events_received ?? 0 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "bilinmeyen hata" };
  }
}
