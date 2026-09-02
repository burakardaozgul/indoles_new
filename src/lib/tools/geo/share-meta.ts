import type { Locale } from "@/lib/content/types";

/** Paylaşım metadata yardımcıları — başlık ve OG yolu tek yerde. */
export function shareHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function shareTitle(score: number, url: string, locale: Locale): string {
  const label = locale === "tr" ? "GEO skoru" : "GEO score";
  return `${label} ${score}/100 · ${shareHost(url)}`;
}

/**
 * Skor bazlı OG kart yolu (ADR-031). Kartlar derleme zamanında üretilir
 * (`pnpm og:geo`, `scripts/generate-og-geo.ts`) ve `public/og/geo/`e girer —
 * 0-100 arası her tam sayı için bir dosya, locale başına. Skor kırpılır ve
 * yuvarlanır: yolun her zaman gerçekten var olan bir dosyaya işaret etmesi
 * için (örn. 101 veya 54.6 gibi ara/taşan değerler).
 */
export function ogImagePath(score: number, locale: Locale): string {
  const n = Math.max(0, Math.min(100, Math.round(score)));
  return `/og/geo/${locale}/${n}.png`;
}

/** Araç sayfasının (henüz taranmamış) sabit OG kartı — `ToolCard`. */
export function toolOgImagePath(locale: Locale): string {
  return `/og/geo/${locale}/tool.png`;
}

/** Skor kartının alt metni — `fill(OG_GEO_ALT[locale], { score })`. */
export const OG_GEO_ALT: Record<Locale, string> = {
  tr: "GEO hazırlık skoru {score}/100",
  en: "GEO readiness score {score}/100",
};
