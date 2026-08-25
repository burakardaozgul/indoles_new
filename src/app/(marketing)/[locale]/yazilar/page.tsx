import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import {
  ArticleLibrary,
  type ArticleRow,
  type TopicChip,
} from "@/components/marketing/article-library";
import { ARTICLES } from "@/lib/content/articles";
import { TOPICS, getTopic } from "@/lib/content/topics";
import { localeHref } from "@/lib/i18n/locale-href";
import { getConsultantBySlug } from "@/lib/content/consultants";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbLd, organizationLd, webPageLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import type { Locale } from "@/lib/content/types";

function formatDate(iso: string, locale: "tr" | "en") {
  return new Date(iso).toLocaleDateString(
    locale === "tr" ? "tr-TR" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

const PATHS = { tr: "/tr/yazilar", en: "/en/articles" };

/**
 * Yazı sayısı `ARTICLES.length`ten okunur: sabit yazılan "16 yazı" on yedinci
 * yazıda bayatlıyordu. Konu listesi de beşten üçe indi — açıklama 160
 * karakterin altında kalmalı (SERP kesimi) ve kalan konular sayfadaki filtre
 * çipinde zaten görünüyor.
 */
const META = {
  tr: {
    title: "Yazılar — teşhis, metot, sonuç",
    description: `Danışman kaleminden ${ARTICLES.length} yazı, konusuna göre süzülüyor: dönüşüm optimizasyonu, performans pazarlama, yapay zeka aramaları (GEO). Kampanya değil metot.`,
  },
  en: {
    title: "Articles — diagnosis, method, outcome",
    description: `${ARTICLES.length} pieces by the consultants who do the work, filterable by topic: conversion optimisation, performance marketing, AI search (GEO). Method, not campaigns.`,
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return buildMetadata({
    title: META[loc].title,
    description: META[loc].description,
    paths: PATHS,
    locale: loc,
  });
}

export default async function ArticlesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const t = await getTranslations({ locale, namespace: "pages.articles" });

  const sorted = [...ARTICLES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  // Yazısı olmayan konu çipi basılmaz (ADR-021): boş filtre gösterilmiyor.
  // Sıra `TOPICS`'ten gelir — alfabetik değil, strateji önceliği bazlı.
  const counts = new Map<string, number>();
  for (const a of sorted) counts.set(a.topic, (counts.get(a.topic) ?? 0) + 1);

  const topics: TopicChip[] = TOPICS.filter((tp) => (counts.get(tp.id) ?? 0) > 0).map(
    (tp) => ({
      id: tp.id,
      label: tp.label[loc],
      blurb: tp.blurb[loc],
      count: counts.get(tp.id)!,
    })
  );

  const rows: ArticleRow[] = sorted.map((a) => {
    const author = getConsultantBySlug(a.authorSlug);
    return {
      key: a.slug[loc],
      href: localeHref(`/yazilar/${a.slug[loc]}`, loc),
      title: a.title[loc],
      excerpt: a.excerpt[loc],
      topic: a.topic,
      topicLabel: getTopic(a.topic).label[loc],
      publishedLabel: formatDate(a.publishedAt, loc),
      // Yayın günü güncellenmiş sayılmaz; rozet yalnız gerçek revizyonda çıkar.
      updatedLabel:
        a.updatedAt && a.updatedAt !== a.publishedAt
          ? formatDate(a.updatedAt, loc)
          : null,
      readingMinutes: a.readingMinutes,
      authorName: author?.name ?? null,
    };
  });

  return (
    <>
      {/* Koleksiyon sayfası ajanlara tek düğümden okunsun: hangi
          öğeler var, kaç tane ve nereye gidiyorlar. */}
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: META[loc].title,
            description: META[loc].description,
            path: PATHS[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            { name: tCommon("nav.articles") },
          ]),
          {
            "@type": "ItemList",
            name: META[loc].title,
            numberOfItems: ARTICLES.length,
            itemListElement: ARTICLES.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: a.title[loc],
              url: absoluteUrl(
                `/${loc}/${loc === "tr" ? "yazilar" : "articles"}/${a.slug[loc]}`
              ),
            })),
          },
        ]}
      />
      <V2PageHeader
        compact
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.articles") },
        ]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        lede={t("lede")}
      />

      <ArticleLibrary
        rows={rows}
        topics={topics}
        locale={loc}
        labels={{
          groupLabel: t("filter.groupLabel"),
          all: t("filter.all"),
          allBlurb: t("filter.allBlurb"),
          // `{count}` istemcide dolduruluyor (filtre değiştikçe değişir),
          // bu yüzden ham şablon geçiyor.
          resultCount: t.raw("filter.resultCount") as string,
          empty: t("filter.empty"),
          clear: t("filter.clear"),
          minRead: t("list.minRead"),
          updated: t("list.updated"),
        }}
      />

      <ContactCallout locale={loc} />
    </>
  );
}
