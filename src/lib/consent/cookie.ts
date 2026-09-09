/**
 * Onay ve bölge çerezleri.
 *
 * `src/lib/popup/cookie.ts` ile aynı biçimi izler (path=/, SameSite=Lax,
 * `document.cookie`) ama ayrı modüldür: popup çerezleri funnel durumunu
 * tutar, bunlar hukuki durumu. İkisini aynı yere yazmak, popup çerezi
 * süresi dolduğunda onayın da sessizce sıfırlanması demekti.
 *
 * KATEGORİLİ ONAY (ADR-033)
 * -------------------------
 * Onay tek bir evet/hayır olmaktan çıktı: analitik ve pazarlama ayrı
 * kararlar. Gerekçe hukuki — KVKK ve GDPR pazarlama çerezinde açık rıza
 * istiyor ve bunu analitik için öne sürülebilen meşru menfaat kapsamına
 * sokmuyor. İkisi tek kutuda toplanırsa pazarlama rızası analitiğin
 * arkasına saklanmış olur.
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

/** Ziyaretçinin ayrı ayrı karar verdiği çerez kategorileri. */
export type ConsentCategory = "analytics" | "marketing";
export type ConsentState = Record<ConsentCategory, ConsentValue>;

const REGION_VALUES: readonly string[] = ["eea", "other"];

/**
 * Çerez biçimi: iki karakter, sırayla analitik ve pazarlama; `g` granted,
 * `d` denied. Örnek: `gd` = analitik açık, pazarlama kapalı.
 *
 * Kısa tutulmasının nedeni okunabilirlik değil dayanıklılık: JSON ya da
 * `a:granted,m:denied` gibi biçimler virgül ve süslü parantez taşır, bunlar
 * çerez ayrıştırıcılarında kaçış gerektirir ve bir ara katman kaçışı
 * bozarsa onay sessizce okunamaz hâle gelir. İki harf hiçbir kaçış istemez.
 */
const CODE: Record<ConsentValue, string> = { granted: "g", denied: "d" };

function decodeValue(ch: string | undefined): ConsentValue | null {
  if (ch === "g") return "granted";
  if (ch === "d") return "denied";
  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * Onay durumu. Tanımadığı değer `null` sayılır — elle kurcalanmış bir çerez
 * "onay verilmiş" okunamaz.
 *
 * GERİYE UYUMLULUK: ADR-033 öncesi çerezler tek kelimeydi (`granted` /
 * `denied`) ve yalnız analitiği kapsıyordu. O değerler hâlâ tarayıcılarda
 * duruyor; analitik kararı olarak korunur, pazarlama ise `denied` sayılır.
 * Aksi hâlde eski ziyaretçilere hiç sorulmamış bir pazarlama rızası
 * atfedilirdi.
 */
export function readConsentCookie(): ConsentState | null {
  const raw = readCookie(CONSENT_COOKIE_NAME);
  if (!raw) return null;

  if (raw === "granted" || raw === "denied") {
    return { analytics: raw, marketing: "denied" };
  }

  const analytics = decodeValue(raw[0]);
  const marketing = decodeValue(raw[1]);
  if (!analytics || !marketing || raw.length !== 2) return null;
  return { analytics, marketing };
}

/**
 * Onayı kaydeder. Ret de kaydedilir: kaydedilmezse banner her sayfada
 * yeniden çıkar ve "hayır" demek işe yaramaz.
 */
export function writeConsentCookie(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + CONSENT_TTL_MS).toUTCString();
  const value = `${CODE[state.analytics]}${CODE[state.marketing]}`;
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

/** Middleware'in yazdığı bölge. İstemci yalnız okur. */
export function readRegionCookie(): RegionValue | null {
  const raw = readCookie(REGION_COOKIE_NAME);
  return raw && REGION_VALUES.includes(raw) ? (raw as RegionValue) : null;
}
