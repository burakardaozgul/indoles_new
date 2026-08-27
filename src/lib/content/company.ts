/**
 * Kurumsal künye — tek kaynak.
 *
 * TopBar, footer, iletişim sayfası, JSON-LD ve e-posta şablonları buradan okur.
 * Tek kaynak olması NAP tutarlılığının (lokal SEO'nun temeli) önkoşulu:
 * numara ya da adres iki yerde ayrı yazılsaydı Google iki farklı işletme
 * görürdü.
 *
 * `phone` ve `locations` 2026-08-24'te Burak tarafından doğrulandı; önceki
 * değerler tasarım dosyasından gelen yer tutuculardı ve canlıda duruyordu.
 */
export const COMPANY = {
  legalName: "İndoles Yazılım A.Ş.",
  brand: "INDOLES",
  phone: "+90 536 247 60 12",
  email: "digital@indoles.com.tr",
  careersEmail: "career@indoles.com.tr",
  /**
   * Yalnız doğrulanmış lokasyon. Londra ve Dubai künyede duruyordu ama
   * teyit edilemedi (Burak, 2026-08-24) — doğrulanmamış lokasyon hem yanlış
   * veri hem Google'ın yerel spam politikasına aykırı, hem de premium
   * konumlandırmanın dayandığı güveni aşındırıyor.
   */
  locations: ["Levent, İstanbul"],
  hours: {
    tr: "Pzt–Cum 09:00–18:00",
    en: "Mon–Fri 09:00–18:00",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/indoles",
    instagram: "https://www.instagram.com/indoles",
    x: "https://x.com/indoles",
  },
  geo: {
    lat: "41.0082° N",
    lon: "28.9784° E",
    timeZone: "Europe/Istanbul",
  },
} as const;
