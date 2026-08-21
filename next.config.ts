import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
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
      { source: "/donusum-optimizasyonu-yontemleri", destination: "/tr/hizmetler/cro", permanent: true },
      { source: "/e-ticaret-danismanligi", destination: "/tr/hizmetler/e-ticaret", permanent: true },
      { source: "/kreatif-hizmetler", destination: "/tr/hizmetler/ui-ux-tasarim", permanent: true },
      { source: "/mobil-uygulama-ve-yazilim-cozumleri", destination: "/tr/hizmetler/ozel-yazilim-ve-mobil", permanent: true },
      { source: "/our-services", destination: "/en/services", permanent: true },
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

export default withSentryConfig(withNextIntl(nextConfig), {
  silent: true,
  disableLogger: true,
});
