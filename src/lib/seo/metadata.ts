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

/**
 * Varsayılan OG görseli — kaynağı `src/app/opengraph-image.tsx`.
 *
 * Burada açıkça verilmesi gerekiyor: bir sayfa `openGraph` alanını tanımladığı
 * anda kök segmentteki dosya-tabanlı görsel devralınmıyor. Sonuç, her sayfada
 * `twitter:card=summary_large_image` olmasına rağmen hiçbir sayfada `og:image`
 * bulunmaması — paylaşımlar görselsiz boş kart olarak render ediliyordu.
 * `metadataBase` bu göreli yolu mutlaklaştırır.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "INDOLES — İş geliştirme danışmanlığı",
} as const;

/**
 * Görselin alt metni sayfanın dilinde olmalı.
 *
 * `OG_IMAGE.alt` her sayfada Türkçeydi; EN paylaşımlarda ve ekran
 * okuyucularda yanlış dilde okunuyordu. Görselin kendisi tek (marka kartı),
 * değişen yalnız açıklaması.
 */
const OG_ALT: Record<Locale, string> = {
  tr: "INDOLES — İş geliştirme danışmanlığı",
  en: "INDOLES — Business development consultancy",
};

export function ogImage(locale: Locale) {
  return { ...OG_IMAGE, alt: OG_ALT[locale] };
}

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
      images: [ogImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      images: [OG_IMAGE.url],
      site: "@indoles",
      title,
      description,
    },
  };
}
