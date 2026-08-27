/**
 * Sitenin mutlak adresi — tek kaynak.
 *
 * Önceden üç yerde ayrı ayrı türetiliyordu ve varsayılanları uyuşmuyordu:
 * `robots.ts` ve `sitemap.ts` production adresine düşerken `layout.tsx`
 * `metadataBase`i `localhost:3000`e düşürüyordu. `NEXT_PUBLIC_APP_URL`
 * tanımsız bir production build'de sitemap doğru adresi gösterir, sayfaların
 * canonical ve OG etiketleri `localhost`u — sessiz ve ağır bir SEO hatası.
 * Varsayılan tek yerde duruyor.
 */
/**
 * Kanonik host **www** (karar: 2026-08-27, Burak — ADR-024).
 *
 * Önceki varsayım apex'ti; canlı DNS ise apex'i zaten www'ye 301'liyordu.
 * Yanlış yöndeki bir launch, 124 URL'lik sitemap'in tamamını kalıcı bir
 * yönlendirmenin arkasına koyar ve eski sitenin biriktirdiği sinyali
 * seyreltirdi. Bu sabit değişirse canonical, hreflang, sitemap, robots ve
 * llms.txt'in tamamı birlikte değişir — tek kaynak olmasının sebebi bu.
 */
const FALLBACK = "https://www.indoles.com.tr";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK).replace(
  /\/+$/,
  "",
);

/** Göreli yolu mutlak URL'e çevirir. Baştaki slash'ı garanti eder. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}
