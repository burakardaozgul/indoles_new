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
  /**
   * Görünür ikonu olan profiller — üst bar ve footer yalnız bunları basar.
   *
   * 2026-09-25 (Burak): LinkedIn ve Instagram adresleri yanlıştı; doğru
   * hesaplar `indoles-growth` ve `indolesgrowth`. X kaydı kaldırıldı —
   * INDOLES'in X hesabı yok; var olmayan bir hesabı `sameAs`ta ya da üst
   * barda göstermek yanlış veridir.
   */
  social: {
    linkedin: "https://www.linkedin.com/company/indoles-growth/",
    instagram: "https://www.instagram.com/indolesgrowth/",
  },
  /**
   * İkonsuz doğrulanmış kayıtlar — yalnız Organization `sameAs`a gider.
   *
   * `googleBusiness`: Google İşletme Profili / Bilgi Grafiği kaydı (`kgmid`).
   * Ziyaretçiye gösterilecek bir sosyal profil değil, varlık eşleştirmesi
   * için bir kimlik; bu yüzden `social`dan ayrı durur ve üst bar/footer onu
   * hiç okumaz.
   */
  profiles: {
    googleBusiness: "https://www.google.com/search?kgmid=/g/11lfqvny97",
  },
  geo: {
    lat: "41.0082° N",
    lon: "28.9784° E",
    timeZone: "Europe/Istanbul",
  },
} as const;
