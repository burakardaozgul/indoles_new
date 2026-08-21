import type { Metadata } from "next";
import type { Locale } from "@/lib/content/types";
import { buildAlternates, type LocalizedPath } from "./alternates";

export type PageSeoInput = {
  /** `layout.tsx`'teki "%s — INDOLES" şablonuna girer; markayı tekrarlama. */
  title: string;
  /** ≤160 karakter. Kesme yapılmaz — çağıran doğru uzunlukta verir. */
  description: string;
  paths: LocalizedPath;
  locale: Locale;
  ogType?: "website" | "article";
};

const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
const ALT_LOCALE: Record<Locale, string> = { tr: "en_US", en: "tr_TR" };

/**
 * Sayfa metadata'sı — tek giriş noktası.
 *
 * `openGraph.url` bilinçli olarak canonical ile aynı: ikisi ayrıştığında
 * sosyal paylaşım ve arama motoru farklı sayfayı kanonik sayar.
 */
export function buildMetadata({
  title,
  description,
  paths,
  locale,
  ogType = "website",
}: PageSeoInput): Metadata {
  const alternates = buildAlternates(paths, locale);
  const canonical = paths[locale];

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: ogType,
      siteName: "INDOLES",
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: ALT_LOCALE[locale],
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      site: "@indoles",
      title,
      description,
    },
  };
}
