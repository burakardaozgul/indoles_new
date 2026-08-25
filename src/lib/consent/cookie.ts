/**
 * Onay ve bölge çerezleri.
 *
 * `src/lib/popup/cookie.ts` ile aynı biçimi izler (path=/, SameSite=Lax,
 * `document.cookie`) ama ayrı modüldür: popup çerezleri funnel durumunu
 * tutar, bunlar hukuki durumu. İkisini aynı yere yazmak, popup çerezi
 * süresi dolduğunda onayın da sessizce sıfırlanması demekti.
 */

export const CONSENT_COOKIE_NAME = "indoles_consent";

/** Middleware'in coğrafi başlıktan türetip yazdığı çerez. */
export const REGION_COOKIE_NAME = "indoles_region";

/**
 * 12 ay. EDPB rehberi onayın süresiz sayılmamasını, makul aralıkla
 * yenilenmesini bekliyor; 12 ay yaygın ve savunulabilir üst sınır.
 */
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export type ConsentValue = "granted" | "denied";
export type RegionValue = "eea" | "other";

const CONSENT_VALUES: readonly string[] = ["granted", "denied"];
const REGION_VALUES: readonly string[] = ["eea", "other"];

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * Onay durumu. Tanımadığı değer `null` sayılır — elle kurcalanmış ya da
 * eski şemadan kalmış bir çerez "onay verilmiş" okunamaz.
 */
export function readConsentCookie(): ConsentValue | null {
  const raw = readCookie(CONSENT_COOKIE_NAME);
  return raw && CONSENT_VALUES.includes(raw) ? (raw as ConsentValue) : null;
}

/**
 * Onayı kaydeder. Ret de kaydedilir: kaydedilmezse banner her sayfada
 * yeniden çıkar ve "hayır" demek işe yaramaz.
 */
export function writeConsentCookie(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + CONSENT_TTL_MS).toUTCString();
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

/** Middleware'in yazdığı bölge. İstemci yalnız okur. */
export function readRegionCookie(): RegionValue | null {
  const raw = readCookie(REGION_COOKIE_NAME);
  return raw && REGION_VALUES.includes(raw) ? (raw as RegionValue) : null;
}
