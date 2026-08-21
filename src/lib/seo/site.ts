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
const FALLBACK = "https://indoles.com.tr";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK).replace(
  /\/+$/,
  "",
);

/** Göreli yolu mutlak URL'e çevirir. Baştaki slash'ı garanti eder. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}
