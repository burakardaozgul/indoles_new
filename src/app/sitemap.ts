import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { CASES } from "@/lib/content/cases";
import { ARTICLES } from "@/lib/content/articles";
import { PACKAGES } from "@/lib/content/packages";
import { BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import type { CaseStudyContent } from "@/lib/content/types";

/**
 * Build anı — veri taşımayan statik sayfaların `lastmod`u.
 *
 * Tek bir sabit üzerinden geçer: her girdide ayrı `new Date()` çağrılırsa aynı
 * build içinde milisaniye farkı oluşur ve sitemap gereksiz yere "her sayfa
 * ayrı zamanda değişti" der.
 */
const BUILD_TIME = new Date();

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
  lastModified: Date = BUILD_TIME,
): MetadataRoute.Sitemap[number] {
  const baseUrl = SITE_URL;
  return {
    url: `${baseUrl}${path[locale]}`,
    lastModified,
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

const EN_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/**
 * Vakanın `lastmod`u — künyedeki dönemin bitişi.
 *
 * Vaka içeriğinde makine okunur bir tarih alanı yok; tek tarih bilgisi
 * `period` (ör. "November 2024 – February 2026"). EN varyantı ay adlarıyla
 * yazıldığı için ondan okunur, TR varyantı ("Kasım") ayrı bir sözlük
 * gerektirirdi. Dönemi olmayan vaka build anına düşer — uydurulmuş tarih
 * yazmaktansa "bilmiyoruz" demek doğru sinyal.
 */
function caseLastModified(c: CaseStudyContent): Date {
  const period = c.period?.en;
  if (!period) return BUILD_TIME;

  const end = period.split(/[–—-]/).pop()?.trim().toLowerCase() ?? "";
  const match = end.match(/^([a-z]+)\s+(\d{4})$/);
  if (!match) return BUILD_TIME;

  const month = EN_MONTHS.indexOf(match[1]!);
  if (month < 0) return BUILD_TIME;

  return new Date(Date.UTC(Number(match[2]), month, 1));
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

  // Paket detayları — sabit kapsam/fiyat taşıyan ticari sayfalar. Hizmet
  // detayının (0.8) altında: küme girişi hizmet sayfası, paket onun altındaki
  // teklif. Danışman profillerinin (0.6) üstünde: satın alma niyetine daha
  // yakın. Fiyat ve kapsam yılda birkaç kez güncellenir → monthly.
  for (const pkg of PACKAGES) {
    const path = {
      tr: `/tr/paketler/${pkg.slug.tr}`,
      en: `/en/packages/${pkg.slug.en}`,
    };
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.7, "monthly"));
    }
  }

  // Danışman profilleri — kaynak `BOOKABLE_CONSULTANTS`; kadroda pillar'ı
  // olmayan kayıt (`hipnoz`) detay sayfası üretmiyor, sitemap de üretmemeli.
  // 0.6: E-E-A-T kanıtı olarak indekslenmeli ama ticari niyet taşımıyor.
  for (const c of BOOKABLE_CONSULTANTS) {
    const path = {
      tr: `/tr/danismanlar/${c.slug}`,
      en: `/en/consultants/${c.slug}`,
    };
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.6, "yearly"));
    }
  }

  // Vaka detayları — slug locale başına farklı (2026-08-29, ADR-019 revizyonu:
  // `/en/case-studies/...` artık EN kelimeler taşır). hreflang çifti
  // `entry()` içinde iki ayrı adresi eşler; eski TR-slug'lı EN adresler
  // `next.config.ts`'te 301 ile buraya taşınır.
  for (const c of CASES) {
    const path = {
      tr: `/tr/vakalar/${c.slug.tr}`,
      en: `/en/case-studies/${c.slug.en}`,
    };
    const lastModified = caseLastModified(c);
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.8, "monthly", lastModified));
    }
  }

  // Journal yazıları — slug locale başına farklı (ADR-020).
  // `lastmod` içerikten gelir: güncellenen yazı `updatedAt`, diğerleri
  // `publishedAt`. Her deploy'da tüm yazıların değiştiğini söylemek, tarama
  // bütçesini gerçekten değişen sayfadan çalıyordu (denetim T-05).
  for (const article of ARTICLES) {
    const path = {
      tr: `/tr/yazilar/${article.slug.tr}`,
      en: `/en/articles/${article.slug.en}`,
    };
    const lastModified = new Date(article.updatedAt ?? article.publishedAt);
    for (const locale of ["tr", "en"] as const) {
      entries.push(entry(path, locale, 0.7, "monthly", lastModified));
    }
  }

  return entries;
}
