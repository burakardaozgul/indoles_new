/**
 * Pazarlama tanımlayıcıları — kalıcı ziyaretçi kimliği ve reklam tıklama
 * kimliği (ADR-036).
 *
 * İkisi de yalnız **pazarlama rızası varken** yazılır: birer takip
 * tanımlayıcısı, yani KVKK açısından kişisel veri. Çağrı noktası
 * `loadMetaPixel` — Pixel'in kendisi de aynı rıza kapısından geçtiği için
 * kapıyı iki kez tanımlamak gerekmiyor.
 *
 * Sunucu ikisini de istek başlıklarındaki çerezlerden okur (`meta-lead.ts`,
 * `/api/meta/capi`); istemci hiçbirini gövdede göndermez. Bu bilinçli: beacon
 * uç noktası herkese açık, oradan gelen her alan saldırganın yazabileceği bir
 * alandır (bkz. `lib/schemas/meta-capi.ts`).
 */

/** Kalıcı, birinci taraf ziyaretçi kimliği — Meta'da `external_id`. */
export const VISITOR_ID_COOKIE = "indoles_vid";

/**
 * Reklam tıklama kimliği. Meta'nın kendi `_fbc` çerezine DOKUNMUYORUZ —
 * onu Pixel yönetiyor ve aynı çereze iki taraf yazarsa biri diğerini bozar.
 * Ham `fbclid`i ayrı bir çerezde tutup `_fbc` yokken sunucuda kuruyoruz.
 */
export const FBCLID_COOKIE = "indoles_fbclid";

/** 12 ay. Onay çerezinin ömrüyle aynı (bkz. `lib/consent/cookie.ts`). */
const VISITOR_ID_TTL_MS = 365 * 24 * 60 * 60 * 1000;

/** Meta'nın `_fbc` için kullandığı ömür. Daha uzun tutmak eşleşme üretmez. */
const FBCLID_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string, ttlMs: number): void {
  const expires = new Date(Date.now() + ttlMs).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function newId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

/**
 * Ziyaretçi kimliğini döndürür, yoksa üretip yazar.
 *
 * NEDEN `sessionId()` YETMEDİ
 * ---------------------------
 * `lib/analytics/session.ts` `sessionStorage` kullanıyor: sekme başına ayrı,
 * sekme kapanınca gidiyor. `external_id`in işi ise aynı kişinin AYRI
 * oturumlardaki olaylarını birbirine bağlamak — oturum kimliği bunu tanım
 * gereği yapamaz. Bu yüzden ayrı ve kalıcı bir çerez.
 *
 * Değer öneki (`v1.`) biçim değişirse eski değerleri ayırt etmek için:
 * hash'lenmiş bir kimliğin sürümü sonradan anlaşılamaz.
 */
export function visitorId(): string | null {
  if (typeof document === "undefined") return null;
  const existing = readCookie(VISITOR_ID_COOKIE);
  if (existing) return existing;
  const id = `v1.${newId()}`;
  writeCookie(VISITOR_ID_COOKIE, id, VISITOR_ID_TTL_MS);
  return id;
}

/**
 * URL'de `fbclid` varsa saklar — reklam tıklamasıyla dönüşümü bağlayan tek
 * sinyal ve yalnız iniş sayfasının adresinde bulunuyor.
 *
 * NEDEN SAKLAMAK GEREKİYOR
 * ------------------------
 * Dönüşüm (form gönderimi) neredeyse hiçbir zaman iniş sayfasında olmuyor;
 * ziyaretçi gezinince `fbclid` adresten kayboluyor. Pixel bunu `_fbc`
 * çerezine yazıyor ama iki boşluk var: Pixel yüklenmeden önce atılan
 * olaylar onu göremiyor, ve reklam engelleyici Pixel'i keserse hiç
 * yazılmıyor. Ham değeri kendimiz de tuttuğumuzda sunucu her iki durumda da
 * `fbc` üretebiliyor.
 *
 * Var olan değeri EZMEZ: ilk tıklama atfı korunur — sonraki bir organik
 * ziyarette `fbclid` gelmediği için zaten yazılmaz, ama ikinci bir reklam
 * tıklamasında yenisi gelir ve o zaman güncellenir (son tıklama kazanır,
 * Meta'nın atıf modeliyle aynı yönde).
 */
export function captureFbclid(): void {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  // Biçim: `<yakalamaZamanıMs>.<fbclid>` — sunucu `fb.1.<ts>.<fbclid>`i
  // bundan kurar. Zamanı burada saklıyoruz çünkü Meta tıklama anını istiyor,
  // dönüşüm anını değil.
  writeCookie(FBCLID_COOKIE, `${Date.now()}.${fbclid}`, FBCLID_TTL_MS);
}

/**
 * Pazarlama tanımlayıcılarını hazırlar. Rıza verilmişken çağrılır.
 * Tekrar çağrılması güvenli: ziyaretçi kimliği varsa dokunulmaz, `fbclid`
 * yalnız adreste varsa yazılır.
 */
export function ensureMarketingIdentifiers(): void {
  visitorId();
  captureFbclid();
}
