/**
 * Kurumsal künye — tek kaynak.
 *
 * TopBar, footer, iletişim sayfası, JSON-LD ve e-posta şablonları buradan okur.
 *
 * DİKKAT — doğrulanmamış alanlar:
 *   `phone` ve `locations` değerleri Claude Studio tasarım dosyasından geldi ve
 *   gerçek veriyle teyit edilmedi. Telefon numarası placeholder desenindedir
 *   (111 22 33). Canlıya çıkmadan önce Burak'ın onaylaması gerekir.
 */
export const COMPANY = {
  legalName: "İndoles Yazılım A.Ş.",
  brand: "INDOLES",
  /** TODO(burak): gerçek numarayla değiştir — bu placeholder. */
  phone: "+90 212 111 22 33",
  email: "hello@indoles.com.tr",
  careersEmail: "career@indoles.com.tr",
  /** TODO(burak): Londra/Dubai varlığını teyit et. */
  locations: ["Levent, İstanbul", "London", "Dubai"],
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
