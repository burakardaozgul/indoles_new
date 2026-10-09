import type { Locale } from "./types";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/**
 * ISO 8601 yıl ("YYYY"). schema.org `foundingDate` bir `Date` bekler; yalnız
 * yıl bilindiği için gün/ay uydurulmaz — "2018-01-01" gibi bir değer tipte
 * reddedilir.
 */
export type IsoYear = `${"1" | "2"}${Digit}${Digit}${Digit}`;

/**
 * Posta adresi — alan adları schema.org `PostalAddress` ile birebir, böylece
 * JSON-LD dönüştürmeden okur. `display` aynı adresin görünür satırı: TR biçimi
 * dizin profillerine (Google İşletme Profili, Clutch, Sortlist) girilen
 * yazımla aynı; EN biçimi kısaltmalı ve "Istanbul" noktasız.
 */
export type CompanyAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: "TR";
  display: Record<Locale, string>;
};

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
 * `address` ve `foundingDate` 2026-10-09'da eklendi (Burak) — dizin
 * profilleri (Clutch, Sortlist) aynı gün bu değerlerle açıldı; site ile
 * dizinler aynı kimliği taşısın diye.
 */
export const COMPANY = {
  legalName: "İndoles Yazılım A.Ş.",
  brand: "INDOLES",
  /**
   * Kuruluş yılı (Burak, 2026-10-09). Şirket 2018'de kuruldu; INDOLES adını
   * 2021'den beri taşıyor (`brandSince`). Şemaya yalnız `foundingDate` girer
   * — `brandSince`in schema.org karşılığı yok, metinde "2018'den beri,
   * 2021'den beri INDOLES adıyla" biçiminde kullanılır.
   */
  foundingDate: "2018" satisfies IsoYear,
  brandSince: "2021" satisfies IsoYear,
  phone: "+90 536 247 60 12",
  /**
   * Kamuya açık adres — sitede, şemada ve dizin profillerinin görünür
   * iletişim alanında yalnız bu yazılır. Dizin hesaplarının giriş e-postası
   * (contact@) ayrı tutulur ve hiçbir yerde yayımlanmaz
   * (docs/strateji/Dis-Profil-Kiti-2026-09.md §1).
   */
  email: "digital@indoles.com.tr",
  careersEmail: "career@indoles.com.tr",
  /**
   * Açık adres (Burak, 2026-10-09; profiller aynı gün açıldı). Kolektif House
   * Levent ortak çalışma alanı — Esentepe Mahallesi Şişli ilçesinde, bu yüzden
   * `addressLocality` "Şişli", il `addressRegion`da.
   */
  address: {
    streetAddress: "Kolektif House Levent, Esentepe Mah., Ecza Sok. No:5/1",
    addressLocality: "Şişli",
    addressRegion: "İstanbul",
    postalCode: "34394",
    addressCountry: "TR",
    display: {
      tr: "Kolektif House | Levent — Esentepe Mahallesi, Ecza Sokak No: 5/1, 34394 Şişli / İstanbul",
      en: "Kolektif House Levent, Esentepe Mah., Ecza Sok. No:5/1, 34394 Şişli, Istanbul",
    },
  } satisfies CompanyAddress,
  /**
   * Yalnız doğrulanmış lokasyon. Londra ve Dubai künyede duruyordu ama
   * teyit edilemedi (Burak, 2026-08-24) — doğrulanmamış lokasyon hem yanlış
   * veri hem Google'ın yerel spam politikasına aykırı, hem de premium
   * konumlandırmanın dayandığı güveni aşındırıyor.
   *
   * Bu, açık adresin (`address`) kısa semt etiketi — yalnız sığmayan dar
   * yüzeylerde (üst bar) kullanılır. Adresin göründüğü her yer (iletişim,
   * footer, hakkımızda) `address.display`i basar.
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
   *
   * `clutch`, `sortlist`: B2B dizin profilleri (Burak, 2026-10-09; profiller
   * aynı gün açıldı ve yayında). Ad, adres, telefon ve kuruluş yılı bu
   * künyeyle aynı girildi — `sameAs` ancak iki taraf aynı kimliği
   * taşıdığında bağ kurar.
   *
   * GoodFirms onaylanınca eklenecek: profil 2026-10-09'da incelemede
   * (Pending), henüz yayımlanmış bir URL yok — var olmayan sayfa `sameAs`a
   * girmez.
   */
  profiles: {
    googleBusiness: "https://www.google.com/search?kgmid=/g/11lfqvny97",
    clutch: "https://clutch.co/profile/indoles",
    sortlist: "https://www.sortlist.com/agency/indoles-growth",
  },
  /**
   * Şehir merkezi koordinatı (İstanbul geneli), adresin binası değil.
   * Açık adres 2026-10-09'da geldi; bina koordinatı henüz doğrulanmadı
   * (Google İşletme Profili pininden alınmalı). Uydurulmuş hassasiyet
   * yerine bilinen kaba değer duruyor.
   */
  geo: {
    lat: "41.0082° N",
    lon: "28.9784° E",
    timeZone: "Europe/Istanbul",
  },
} as const;
