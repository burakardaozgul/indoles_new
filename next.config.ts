import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Streaming metadata KAPALI.
   *
   * Next 15 varsayılanı metadata'yı shell akışından sonra basar; etiketleri
   * `<head>`'e React istemcide taşır. Bloklayan (head'e basan) sürüm yalnız
   * `htmlLimitedBots` listesindeki botlara gider ve o listede Googlebot da,
   * hiçbir AI crawler'ı da yok — GPTBot/ClaudeBot/PerplexityBot JS
   * çalıştırmadığı için canonical, hreflang, title ve OG etiketlerini hiç
   * görmüyordu. GEO stratejisi (docs/strateji/) AI cevap motorlarında
   * alıntılanmayı ana kaldıraç saydığı için bu kabul edilemez.
   *
   * Buradaki kalıp tüm user-agent'ları bloklayan sürüme alır. Sayfalar SSG
   * olduğundan
   * maliyeti yok: metadata build anında zaten çözülüyor.
   */
  htmlLimitedBots: /.*/,

  reactStrictMode: true,
  typedRoutes: true,
  outputFileTracingRoot: path.join(__dirname),
  // Tüm vaka görselleri lokal (`public/work/`, ADR-019); remote pattern yok.
  /**
   * Eski WordPress sitesinden gelen kalıcı yönlendirmeler.
   *
   * `indoles_eski/` altındaki bu sayfalar hâlâ link equity taşıyor;
   * yönlendirilmezlerse 12 yeni hizmet sayfası sıfırdan başlar.
   * Eşleşmeyen eski sayfalar bilinçli olarak `/hizmetler`e yönlendirilmiyor —
   * konu dışı yönlendirme Google tarafından soft-404 sayılıyor.
   */
  async redirects() {
    return [
      { source: "/dijital-pazarlama-hizmetleri", destination: "/tr/hizmetler/performans-pazarlama", permanent: true },
      { source: "/cro-donusum-orani-optimizasyonu", destination: "/tr/hizmetler/cro", permanent: true },
      { source: "/donusum-optimizasyonu-yontemleri", destination: "/tr/yazilar/donusum-optimizasyonu-yontemleri", permanent: true },
      { source: "/e-ticaret-danismanligi", destination: "/tr/hizmetler/e-ticaret", permanent: true },
      { source: "/web-tasarim-ui-ux-tasarimi", destination: "/tr/hizmetler/ui-ux-tasarim", permanent: true },
      { source: "/sosyal-medya-pazarlama", destination: "/tr/hizmetler/marka-stratejisi", permanent: true },
      // Eski "kreatif hizmetler" tek bir hizmete değil Growth pillar'ının
      // tamamına karşılık geliyor (Ek A). UI/UX kendi eski URL'inden
      // (`/web-tasarim-ui-ux-tasarimi`) doğrudan hizmet sayfasına gidiyor.
      { source: "/kreatif-hizmetler", destination: "/tr/hizmetler/growth", permanent: true },
      { source: "/mobil-uygulama-ve-yazilim-cozumleri", destination: "/tr/hizmetler/ozel-yazilim-ve-mobil", permanent: true },
      { source: "/our-services", destination: "/en/services", permanent: true },
      // Eski kurumsal ve liste sayfaları. Konu eşleşmesi birebir: takım →
      // hakkımızda, bilgi kütüphanesi → yazılar, referans/müşteri listeleri →
      // vakalar. `/iletisim` middleware'in geçici yönlendirmesiyle de
      // çalışıyordu; kalıcı kural açık yazıldı ki link equity 301 aktarılsın.
      { source: "/takimimiz", destination: "/tr/hakkimizda", permanent: true },
      { source: "/bilgi-kutuphanemiz", destination: "/tr/yazilar", permanent: true },
      { source: "/musterilerimiz", destination: "/tr/vakalar", permanent: true },
      { source: "/referanslarimiz", destination: "/tr/vakalar", permanent: true },
      { source: "/iletisim", destination: "/tr/iletisim", permanent: true },
      // Eski portfolyo → yeni vaka sayfaları (ADR-019). Vakalar taşındıkça
      // buraya birer satır eklenir; taşınmayanlar (Turkcell, CaffeBO) 404'te
      // kalır — konu dışı yönlendirme soft-404 sayılır.
      { source: "/portfolyo/buyume-stratejisi", destination: "/tr/vakalar/soylu-avm-e-ticaret-buyume", permanent: true },
      { source: "/portfolyo/spor-giyim-markasiyla-dijital-pazarlama-basari-hikayesi", destination: "/tr/vakalar/gymwolves-12-kat-satis", permanent: true },
      { source: "/portfolyo/akilli-urun-guncelleme-otomasyon-ve-yazilim-cozumleri", destination: "/tr/vakalar/mkcomputer-dropshipping-otomasyonu", permanent: true },
      { source: "/portfolyo/istanbul-ortez-protezin-dijital-donusum-yolculugu", destination: "/tr/vakalar/istanbul-ortez-protez-arama-gorunurlugu", permanent: true },
      { source: "/portfolyo/fyr-luks-ev-dekorasyon", destination: "/tr/vakalar/fyr-luks-dekorasyon-lansmani", permanent: true },
      { source: "/portfolyo/luks-parekende-partnerleri-ile-marka-anlasmasi", destination: "/tr/vakalar/feruza-luks-perakende-anlasmasi", permanent: true },
      { source: "/portfolyo/yapay-zeka-destekli-web-icerikleri", destination: "/tr/vakalar/sim-baski-ihracat-icerigi", permanent: true },
      // Portfolyo kategori arşivleri tekil vakaya karşılık gelmiyor; konu
      // eşleşmesi korunduğu için vaka listesine gider, soft-404 sayılmaz.
      { source: "/portfolyo-kategori/:slug*", destination: "/tr/vakalar", permanent: true },
      // Eski blog → journal (ADR-020). Yazı taşındıkça satır eklenir.
      { source: "/dijital-cagda-gerilla-pazarlama-evrimi", destination: "/tr/yazilar/dijital-cagda-gerilla-pazarlama-evrimi", permanent: true },
      { source: "/basarili-pazarlama-icin-insan-psikolojisinde-ustalasmak", destination: "/tr/yazilar/basarili-pazarlama-icin-insan-psikolojisinde-ustalasmak", permanent: true },
      { source: "/isa-ilk-pazarlama-marka-muhendisi", destination: "/tr/yazilar/isa-ilk-pazarlama-marka-muhendisi", permanent: true },
      { source: "/gercek-e-ticaret-ajansinin-etkisi", destination: "/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi", permanent: true },
      { source: "/7-onemli-performans-pazarlama-hatasi", destination: "/tr/yazilar/7-onemli-performans-pazarlama-hatasi", permanent: true },
      { source: "/ugc-kullanimi-ve-sosyal-kanit", destination: "/tr/yazilar/ugc-kullanimi-ve-sosyal-kanit", permanent: true },
      { source: "/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru", destination: "/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru", permanent: true },
      { source: "/2026-web-tasarim-trendleri", destination: "/tr/yazilar/2026-web-tasarim-trendleri", permanent: true },
      { source: "/sadece-trafik-degil-ciro-isteyenler-icin-2026-performans-pazarlama-trendleri", destination: "/tr/yazilar/sadece-trafik-degil-ciro-isteyenler-icin-2026-performans-pazarlama-trendleri", permanent: true },
      { source: "/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi", destination: "/tr/yazilar/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi", permanent: true },
      { source: "/reklam-maliyetleri-artarken-buyumenin-sirri-ltv-optimizasyonu", destination: "/tr/yazilar/reklam-maliyetleri-artarken-buyumenin-sirri-ltv-optimizasyonu", permanent: true },
      { source: "/dijitalde-olceklenmek-isteyen-kobiler-icin-5-adimli-yeni-yil-stratejisi", destination: "/tr/yazilar/dijitalde-olceklenmek-isteyen-kobiler-icin-5-adimli-yeni-yil-stratejisi", permanent: true },
      { source: "/satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi", destination: "/tr/yazilar/satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi", permanent: true },
      { source: "/yapay-zeka-aramalarinda-nasil-one-cikarsiniz", destination: "/tr/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz", permanent: true },
      { source: "/neden-profesyonel-video-sart", destination: "/tr/yazilar/neden-profesyonel-video-sart", permanent: true },
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
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
