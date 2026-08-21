import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { CASES } from "@/lib/content/cases";

const STATIC_ROUTES: Array<{
  path: { tr: string; en: string };
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  {
    path: { tr: "/tr", en: "/en" },
    priority: 1.0,
    changeFrequency: "weekly",
  },
  {
    path: { tr: "/tr/hizmetler", en: "/en/services" },
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: { tr: "/tr/paketler", en: "/en/packages" },
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: { tr: "/tr/vakalar", en: "/en/case-studies" },
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: { tr: "/tr/danismanlar", en: "/en/consultants" },
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: { tr: "/tr/yazilar", en: "/en/articles" },
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    path: { tr: "/tr/iletisim", en: "/en/contact" },
    priority: 0.5,
    changeFrequency: "yearly",
  },
  {
    path: { tr: "/tr/hakkimizda", en: "/en/about" },
    priority: 0.5,
    changeFrequency: "yearly",
  },
  {
    path: { tr: "/tr/gizlilik-kvkk", en: "/en/privacy" },
    priority: 0.3,
    changeFrequency: "yearly",
  },
];

/**
 * Tek girdi kurucusu — hem statik hem dinamik route'lar buradan geçer.
 *
 * hreflang üçlüsü her girdide zorunlu: eksik alternatif, iki dilli sayfanın
 * yalnız bir dilinin indekslenmesine yol açıyor.
 */
function entry(
  path: { tr: string; en: string },
  locale: "tr" | "en",
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap[number] {
  const baseUrl = SITE_URL;
  return {
    url: `${baseUrl}${path[locale]}`,
    lastModified: new Date(),
    priority,
    changeFrequency,
    alternates: {
      languages: {
        tr: `${baseUrl}${path.tr}`,
        en: `${baseUrl}${path.en}`,
        "x-default": `${baseUrl}${path.tr}`,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of ["tr", "en"] as const) {
      entries.push(
        entry(route.path, locale, route.priority, route.changeFrequency),
      );
    }
  }

  // Pillar sayfaları — kümenin tepesi, hizmet detaylarından bir kademe önde.
  for (const pillar of PILLARS) {
    const path = {
      tr: `/tr/hizmetler/${pillar.key}`,
      en: `/en/services/${pillar.key}`,
    };
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.9, "weekly"));
    }
  }

  // 12 hizmet detayı — slug locale başına farklı (docs/08 §2).
  for (const service of SERVICES) {
    const path = {
      tr: `/tr/hizmetler/${service.slug.tr}`,
      en: `/en/services/${service.slug.en}`,
    };
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.8, "monthly"));
    }
  }

  // Vaka detayları — slug locale'den bağımsız, segment çevrilir (ADR-019).
  for (const c of CASES) {
    const path = {
      tr: `/tr/vakalar/${c.slug}`,
      en: `/en/case-studies/${c.slug}`,
    };
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.8, "monthly"));
    }
  }

  return entries;
}
