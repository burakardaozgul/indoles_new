import type { Locale } from "@/lib/content/types";

/** Paylaşım metadata yardımcıları — başlık ve (Görev 12) OG yolu tek yerde. */
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
