import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";
import {
  EN_CASE_SLUG_REDIRECTS,
  EN_SEGMENT_REDIRECTS,
  LEGACY_REDIRECTS,
} from "./src/lib/seo/legacy-redirects";

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
   * Kalıcı yönlendirmeler — üç liste, hepsi `src/lib/seo/legacy-redirects.ts`te.
   *
   * `LEGACY_REDIRECTS` eski WordPress sitesinden gelir; `/sitemap-eski.xml`
   * aynı kaynaktan üretilir (indeks denetimi 2026-09-18). Gerekçe ve kurallar
   * (soft-404, portfolyo eşlemesi, EN vaka slug'ları) o dosyanın yorumlarında.
   *
   * Sıra anlamlıdır: `EN_CASE_SLUG_REDIRECTS` tam eşleşmeli EN vaka
   * adreslerini taşır, `EN_SEGMENT_REDIRECTS` ise joker segment kurallarıdır
   * (ADR-039) — spesifik olan önce gelir.
   */
  async redirects() {
    return [
      ...LEGACY_REDIRECTS,
      ...EN_CASE_SLUG_REDIRECTS,
      ...EN_SEGMENT_REDIRECTS,
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
