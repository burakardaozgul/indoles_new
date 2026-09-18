/**
 * Eski WordPress sitesinden gelen kalıcı yönlendirmeler — tek kaynak.
 *
 * Önceden `next.config.ts` içinde gömülüydü. Buraya taşınma sebebi
 * `/sitemap-eski.xml` (indeks denetimi 2026-09-18): cutover'dan 20 gün
 * sonra Google eski hizmet URL'lerini hâlâ indeksli tutuyor ve hiçbirini
 * yeniden taramamıştı (son tarama 21-27 Ağu) — 301'leri görmediği için yeni
 * sayfalar "bilinmiyor" durumundaydı. Google'ın site taşıma kılavuzu eski
 * URL'leri geçici bir sitemap'te sunmayı öneriyor; o sitemap bu listeden
 * türetilir ki iki liste birbirinden kopmasın.
 *
 * Bu dosya `next.config.ts` tarafından import edilir: yalnız düz veri ve
 * import'suz `segments.ts` (göreli yol) — `@/` alias'ı config yükleme
 * bağlamında çözülmediği için alias'lı import eklenmemelidir.
 *
 * `indoles_eski/` altındaki bu sayfalar hâlâ link equity taşıyor;
 * yönlendirilmezlerse 12 yeni hizmet sayfası sıfırdan başlar.
 * Eşleşmeyen eski sayfalar bilinçli olarak `/hizmetler`e yönlendirilmiyor —
 * konu dışı yönlendirme Google tarafından soft-404 sayılıyor.
 */
import { LOCALE_SEGMENTS } from "../i18n/segments";

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

/** WordPress dönemi URL'leri (hizmet, kurumsal, portfolyo, blog, arşiv). */
// prettier-ignore — eşleme tablosu satır başına bir yönlendirme olarak okunur.
export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  {
    source: "/dijital-pazarlama-hizmetleri",
    destination: "/tr/hizmetler/performans-pazarlama",
    permanent: true,
  },
  {
    source: "/cro-donusum-orani-optimizasyonu",
    destination: "/tr/hizmetler/cro",
    permanent: true,
  },
  {
    source: "/donusum-optimizasyonu-yontemleri",
    destination: "/tr/yazilar/donusum-optimizasyonu-yontemleri",
    permanent: true,
  },
  {
    source: "/e-ticaret-danismanligi",
    destination: "/tr/hizmetler/e-ticaret",
    permanent: true,
  },
  {
    source: "/web-tasarim-ui-ux-tasarimi",
    destination: "/tr/hizmetler/ui-ux-tasarim",
    permanent: true,
  },
  {
    source: "/sosyal-medya-pazarlama",
    destination: "/tr/hizmetler/marka-stratejisi",
    permanent: true,
  },
  // Eski "kreatif hizmetler" tek bir hizmete değil Growth pillar'ının
  // tamamına karşılık geliyor (Ek A). UI/UX kendi eski URL'inden
  // (`/web-tasarim-ui-ux-tasarimi`) doğrudan hizmet sayfasına gidiyor.
  {
    source: "/kreatif-hizmetler",
    destination: "/tr/hizmetler/growth",
    permanent: true,
  },
  {
    source: "/mobil-uygulama-ve-yazilim-cozumleri",
    destination: "/tr/hizmetler/ozel-yazilim-ve-mobil",
    permanent: true,
  },
  { source: "/our-services", destination: "/en/services", permanent: true },
  // Eski kurumsal ve liste sayfaları. Konu eşleşmesi birebir: takım →
  // hakkımızda, bilgi kütüphanesi → yazılar, referans/müşteri listeleri →
  // vakalar. `/iletisim` middleware'in geçici yönlendirmesiyle de
  // çalışıyordu; kalıcı kural açık yazıldı ki link equity 301 aktarılsın.
  { source: "/takimimiz", destination: "/tr/hakkimizda", permanent: true },
  {
    source: "/bilgi-kutuphanemiz",
    destination: "/tr/yazilar",
    permanent: true,
  },
  { source: "/musterilerimiz", destination: "/tr/vakalar", permanent: true },
  { source: "/referanslarimiz", destination: "/tr/vakalar", permanent: true },
  { source: "/iletisim", destination: "/tr/iletisim", permanent: true },
  // Eski portfolyo → yeni vaka sayfaları (ADR-019). Vakalar taşındıkça
  // buraya birer satır eklenir; taşınmayanlar (Turkcell, CaffeBO) 404'te
  // kalır — konu dışı yönlendirme soft-404 sayılır.
  {
    source: "/portfolyo/buyume-stratejisi",
    destination: "/tr/vakalar/soylu-avm-e-ticaret-buyume",
    permanent: true,
  },
  {
    source:
      "/portfolyo/spor-giyim-markasiyla-dijital-pazarlama-basari-hikayesi",
    destination: "/tr/vakalar/gymwolves-12-kat-satis",
    permanent: true,
  },
  {
    source: "/portfolyo/akilli-urun-guncelleme-otomasyon-ve-yazilim-cozumleri",
    destination: "/tr/vakalar/mkcomputer-dropshipping-otomasyonu",
    permanent: true,
  },
  {
    source: "/portfolyo/istanbul-ortez-protezin-dijital-donusum-yolculugu",
    destination: "/tr/vakalar/istanbul-ortez-protez-arama-gorunurlugu",
    permanent: true,
  },
  {
    source: "/portfolyo/fyr-luks-ev-dekorasyon",
    destination: "/tr/vakalar/fyr-luks-dekorasyon-lansmani",
    permanent: true,
  },
  {
    source: "/portfolyo/luks-parekende-partnerleri-ile-marka-anlasmasi",
    destination: "/tr/vakalar/feruza-luks-perakende-anlasmasi",
    permanent: true,
  },
  {
    source: "/portfolyo/yapay-zeka-destekli-web-icerikleri",
    destination: "/tr/vakalar/sim-baski-ihracat-icerigi",
    permanent: true,
  },
  // Portfolyo kategori arşivleri tekil vakaya karşılık gelmiyor; konu
  // eşleşmesi korunduğu için vaka listesine gider, soft-404 sayılmaz.
  {
    source: "/portfolyo-kategori/:slug*",
    destination: "/tr/vakalar",
    permanent: true,
  },
  // Eski blog → journal (ADR-020). Yazı taşındıkça satır eklenir.
  {
    source: "/dijital-cagda-gerilla-pazarlama-evrimi",
    destination: "/tr/yazilar/dijital-cagda-gerilla-pazarlama-evrimi",
    permanent: true,
  },
  {
    source: "/basarili-pazarlama-icin-insan-psikolojisinde-ustalasmak",
    destination:
      "/tr/yazilar/basarili-pazarlama-icin-insan-psikolojisinde-ustalasmak",
    permanent: true,
  },
  {
    source: "/isa-ilk-pazarlama-marka-muhendisi",
    destination: "/tr/yazilar/isa-ilk-pazarlama-marka-muhendisi",
    permanent: true,
  },
  {
    source: "/gercek-e-ticaret-ajansinin-etkisi",
    destination: "/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi",
    permanent: true,
  },
  {
    source: "/7-onemli-performans-pazarlama-hatasi",
    destination: "/tr/yazilar/7-onemli-performans-pazarlama-hatasi",
    permanent: true,
  },
  {
    source: "/ugc-kullanimi-ve-sosyal-kanit",
    destination: "/tr/yazilar/ugc-kullanimi-ve-sosyal-kanit",
    permanent: true,
  },
  {
    source: "/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru",
    destination: "/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru",
    permanent: true,
  },
  {
    source: "/2026-web-tasarim-trendleri",
    destination: "/tr/yazilar/2026-web-tasarim-trendleri",
    permanent: true,
  },
  {
    source:
      "/sadece-trafik-degil-ciro-isteyenler-icin-2026-performans-pazarlama-trendleri",
    destination:
      "/tr/yazilar/sadece-trafik-degil-ciro-isteyenler-icin-2026-performans-pazarlama-trendleri",
    permanent: true,
  },
  {
    source: "/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi",
    destination:
      "/tr/yazilar/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi",
    permanent: true,
  },
  {
    source: "/reklam-maliyetleri-artarken-buyumenin-sirri-ltv-optimizasyonu",
    destination:
      "/tr/yazilar/reklam-maliyetleri-artarken-buyumenin-sirri-ltv-optimizasyonu",
    permanent: true,
  },
  {
    source:
      "/dijitalde-olceklenmek-isteyen-kobiler-icin-5-adimli-yeni-yil-stratejisi",
    destination:
      "/tr/yazilar/dijitalde-olceklenmek-isteyen-kobiler-icin-5-adimli-yeni-yil-stratejisi",
    permanent: true,
  },
  {
    source:
      "/satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi",
    destination:
      "/tr/yazilar/satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi",
    permanent: true,
  },
  {
    source: "/yapay-zeka-aramalarinda-nasil-one-cikarsiniz",
    destination: "/tr/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz",
    permanent: true,
  },
  {
    source: "/neden-profesyonel-video-sart",
    destination: "/tr/yazilar/neden-profesyonel-video-sart",
    permanent: true,
  },
  // Blog kategori arşivleri aynı mantıkla journal listesine gider.
  { source: "/category/:slug*", destination: "/tr/yazilar", permanent: true },
  // WordPress sitemap denetimi (2026-08-28): aşağıdaki 6 URL indekste
  // olduğu halde yönlendirilmiyordu. Turkcell ve CaffeBO portfolyo
  // kalemleri bilerek 404'te bırakıldı (yukarıdaki not) — bunlar farklı:
  // hepsinin yeni sitede konu karşılığı var.
  { source: "/servisler", destination: "/tr/hizmetler", permanent: true },
  { source: "/portfolyo", destination: "/tr/vakalar", permanent: true },
  // Eski SSS sayfası: içerik artık paket ve pillar sayfalarındaki native
  // <details> bloklarında yaşıyor (ADR-023), SSS yoğunluğu paketlerde.
  { source: "/faq", destination: "/tr/paketler", permanent: true },
  // Self-servis teşhis testleri: /araclar Faz 2'ye ertelendi (CLAUDE.md §6).
  // Niyet aynı — "nerede duruyorum" — ve ürünleşmiş teşhis paketi bunun
  // karşılığı, dolayısıyla konu eşleşmesi korunuyor.
  { source: "/markalasma-testi", destination: "/tr/paketler", permanent: true },
  { source: "/pazarlama-testi", destination: "/tr/paketler", permanent: true },
  // WP yazar arşivi → kadro sayfası.
  { source: "/author/:slug*", destination: "/tr/danismanlar", permanent: true },
];

/**
 * 2026-08-29 EN vaka slug lokalizasyonu — yeni sitenin kendi geçmişi,
 * WordPress kalıntısı değil; eski-URL sitemap'ine GİRMEZ.
 */
// prettier-ignore
export const EN_CASE_SLUG_REDIRECTS: LegacyRedirect[] = [
  // 2026-08-29 EN vaka slug lokalizasyonu — launch+1 gün, eski URL'ler
  // GSC/IndexNow'a bildirilmişti. Vaka slug'ı locale'den bağımsızdı
  // (ADR-019), yani 9 EN adresin tamamı Türkçe kelimelerden oluşuyordu;
  // slug lokalize edilince o adresler 404'e düşerdi. TR adresler
  // DEĞİŞMEDİ — burada yalnız `/en/case-studies/*` taşınır.
  { source: "/en/case-studies/soylu-avm-e-ticaret-buyume", destination: "/en/case-studies/soylu-avm-ecommerce-growth", permanent: true },
  { source: "/en/case-studies/gymwolves-12-kat-satis", destination: "/en/case-studies/gymwolves-12x-sales-growth", permanent: true },
  { source: "/en/case-studies/mkcomputer-dropshipping-otomasyonu", destination: "/en/case-studies/mkcomputer-dropshipping-automation", permanent: true },
  { source: "/en/case-studies/istanbul-ortez-protez-arama-gorunurlugu", destination: "/en/case-studies/istanbul-orthosis-prosthetics-search-visibility", permanent: true },
  { source: "/en/case-studies/fyr-luks-dekorasyon-lansmani", destination: "/en/case-studies/fyr-luxury-decor-launch", permanent: true },
  { source: "/en/case-studies/feruza-luks-perakende-anlasmasi", destination: "/en/case-studies/feruza-luxury-retail-deal", permanent: true },
  { source: "/en/case-studies/sim-baski-ihracat-icerigi", destination: "/en/case-studies/sim-printing-export-content", permanent: true },
  { source: "/en/case-studies/meccanotecnica-umbra-teklif-portali", destination: "/en/case-studies/meccanotecnica-umbra-quote-portal", permanent: true },
  { source: "/en/case-studies/odorgo-kategori-yaratma", destination: "/en/case-studies/odorgo-category-creation", permanent: true },
];

/**
 * Karışık locale adresleri: `/en` altında TR segment (ADR-039).
 *
 * `/en/hizmetler/build`, `/en/danismanlar/mert-kaplan`,
 * `/en/yazilar/<slug>` — GSC'de gösterim alan bu adresler EN sayfalardaki
 * hatalı href'lerden doğdu. Href'ler düzeltildi ama adresler indekste ve
 * dış bağlantılarda yaşamaya devam ediyor.
 *
 * next-intl middleware'i bu yolları zaten çeviriyordu; sorun **geçici**
 * (307) olmasıydı: Google 307'yi imza saymaz, eski adresi indekste tutar ve
 * canonical sinyali bölünür. Burası aynı çeviriyi **kalıcı** (308) yapar —
 * config'teki `redirects()` middleware'den önce çalışır.
 *
 * Bu liste WordPress kalıntısı değil, yeni sitenin kendi geçmişidir:
 * eski-URL sitemap'ine GİRMEZ (`legacySitemapPaths` yalnız
 * `LEGACY_REDIRECTS` okur).
 *
 * Slug'lar çevrilmez: `/en/vakalar/<tr-slug>` önce `/en/case-studies/<tr-slug>`
 * olur, oradan `EN_CASE_SLUG_REDIRECTS` ikinci bir 308 ile EN slug'a taşır.
 * Eşleşmesi olmayan TR slug 404 kalır — çapraz locale çözüm yok (ADR-018).
 */
export const EN_SEGMENT_REDIRECTS: LegacyRedirect[] = [
  // Araç slug'ları sözlükte değil (`routing.ts` tam-yol çifti yazıyor);
  // joker kuraldan ÖNCE gelmeli, yoksa `/en/tools/<tr-slug>` 404'üne düşer.
  {
    source: `/en/${LOCALE_SEGMENTS.tools.tr}/geo-gorunurluk-denetleyicisi/:path*`,
    destination: `/en/${LOCALE_SEGMENTS.tools.en}/geo-visibility-checker/:path*`,
    permanent: true,
  },
  {
    source: `/en/${LOCALE_SEGMENTS.tools.en}/geo-gorunurluk-denetleyicisi/:path*`,
    destination: `/en/${LOCALE_SEGMENTS.tools.en}/geo-visibility-checker/:path*`,
    permanent: true,
  },
  // Sözlükteki her tür için tek kural. `:path*` sıfır segmenti de eşler,
  // yani `/en/hizmetler` ve `/en/hizmetler/build` aynı satırdan geçer.
  // Sözlükteki her çiftin TR ve EN yazımı farklıdır (birim test denetler),
  // dolayısıyla kendine yönlendiren kural üretilmez.
  ...Object.values(LOCALE_SEGMENTS).map<LegacyRedirect>((pair) => ({
    source: `/en/${pair.tr}/:path*`,
    destination: `/en/${pair.en}/:path*`,
    permanent: true,
  })),
];

/**
 * Eski-URL sitemap'inde listelenecek adresler: joker (`:slug*`) taşımayan
 * WordPress URL'leri, eski sitenin indekslediği biçimiyle (eğik çizgili).
 * Google'ın URL Inspection sonucu da bu biçimi kanonik gösteriyor.
 */
export function legacySitemapPaths(): string[] {
  return LEGACY_REDIRECTS.filter((r) => !r.source.includes(":")).map(
    (r) => `${r.source}/`
  );
}
