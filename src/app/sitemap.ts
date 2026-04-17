import type { MetadataRoute } from "next";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://indoles.com.tr";

  const entries: MetadataRoute.Sitemap = [];
  for (const route of STATIC_ROUTES) {
    for (const locale of ["tr", "en"] as const) {
      entries.push({
        url: `${baseUrl}${route.path[locale]}`,
        lastModified: new Date(),
        priority: route.priority,
        changeFrequency: route.changeFrequency,
        alternates: {
          languages: {
            tr: `${baseUrl}${route.path.tr}`,
            en: `${baseUrl}${route.path.en}`,
            "x-default": `${baseUrl}${route.path.tr}`,
          },
        },
      });
    }
  }
  return entries;
}
