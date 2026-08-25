/**
 * Çerez onayının hangi ülkelerde zorunlu olduğunun tek kaynağı.
 *
 * Karar bölgesel (docs/14 §3): analitik çerezleri EEA ve Birleşik Krallık
 * ziyaretçileri için opt-in, diğer bölgelerde varsayılan açık. Türkiye
 * birincil pazar ve orada ölçümün tamamını görmek Dalga 2+ işlerinin
 * etkisini değerlendirmenin tek yolu.
 *
 * Liste iki yerde kullanılır ve ikisi de buradan okur:
 *   1. `gtag('consent','default',{ …denied…, region: CONSENT_REGIONS })`
 *      — Google tarafındaki bölgesel varsayılan.
 *   2. `isConsentRequired()` — banner'ın gösterilip gösterilmeyeceği.
 * İkisi ayrışırsa banner çıkmadığı hâlde ölçüm kapalı kalır (ya da tersi);
 * tek liste bunu yapısal olarak engeller.
 */

/** AB üyesi 27 ülke. */
const EU = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

/** AB üyesi olmayan EEA ülkeleri. */
const EEA_NON_EU = ["IS", "LI", "NO"] as const;

/**
 * Birleşik Krallık AB'den ayrıldı ama UK GDPR ve PECR aynı onay eşiğini
 * koruyor — ayrı satırda tutuluyor ki gerekçesi görünsün.
 */
const UK = ["GB"] as const;

/** `gtag` `region` parametresine giden ISO 3166-1 alpha-2 kodları. */
export const CONSENT_REGIONS: readonly string[] = [...EU, ...EEA_NON_EU, ...UK];

const REGION_SET = new Set<string>(CONSENT_REGIONS);

/**
 * Ülke kodu onay gerektiren bölgede mi?
 *
 * Ülke bilinmiyorsa (`null`/boş — Vercel geo başlığı yok, lokal geliştirme,
 * proxy arkası) **false** döner. Bilinmeyeni EEA saymak güvenli tarafta
 * durmak gibi görünür ama değil: banner Türkiye'deki her ziyaretçiye çıkar
 * ve bölgesel kararın tamamı boşa gider. Google tarafındaki `region`
 * varsayılanı zaten IP'den bağımsız çalışır — yani bu fonksiyon yanılsa
 * bile EEA ziyaretçisinin ölçümü açılmaz, yalnız banner görünmez.
 */
export function isConsentRequired(country: string | null | undefined): boolean {
  if (!country) return false;
  return REGION_SET.has(country.toUpperCase());
}
