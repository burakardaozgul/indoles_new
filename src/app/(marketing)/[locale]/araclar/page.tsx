import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { publishedTools } from "@/lib/content/tools";
import { localeHref } from "@/lib/i18n/locale-href";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbLd, organizationLd, webPageLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import type { Locale } from "@/lib/content/types";

const PATHS = { tr: "/tr/araclar", en: "/en/tools" };

/**
 * Açıklama araç SAYMAZ ve yayınlanmamış bir aracı adıyla anmaz. İki gerekçe:
 * sayısal iddia ("iki araç") üçüncü araçta sessizce bayatlar; `published`
 * kapısı kapalı bir aracın adı ise arama sonucunda erişilemeyen bir vaat
 * olurdu. Yayında olan aracın adı kalır — kendi arama niyetini taşıyor.
 * Uzunluk 140-160 bandında.
 */
const META = {
  tr: {
    title: "Araçlar — ücretsiz GEO denetim aracı",
    description:
      "Ücretsiz denetim araçları. GEO Görünürlük Denetleyicisi sitenizi cevap motorları için beş sinyalde ölçer; her araç 100 puanlık skor ve düzeltme listesi verir.",
  },
  en: {
    title: "Tools — free GEO audit tool",
    description:
      "Free audit tools. The GEO Visibility Checker measures your site for answer engines across five signals; every tool returns a score out of 100 and a fix list.",
  },
} as const;

const HEADER = {
  tr: {
    tools: "Araçlar",
    eyebrow: "İnteraktif araçlar",
    title: "Araçlar",
    lede: "Düşük taahhütle başlayın: sitenizi saniyeler içinde denetleyen araçlar, ne düzelteceğinizi somut bir listeyle söyler.",
    open: "Aracı aç",
  },
  en: {
    tools: "Tools",
    eyebrow: "Interactive tools",
    title: "Tools",
    lede: "Start with low commitment: tools that audit your site within seconds and tell you what to fix as a concrete list.",
    open: "Open the tool",
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

export default async function ToolsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const h = HEADER[loc];
  // Lansman kapısı: yayınlanmamış araç ne listede ne ItemList'te görünür.
  // Sayfası URL'den erişilebilir kalır, ama buradan linklenmez.
  const tools = publishedTools();

  return (
    <>
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: META[loc].title,
            description: META[loc].description,
            path: PATHS[loc],
            locale: loc,
          }),
          breadcrumbLd([{ name: "INDOLES", path: `/${loc}` }, { name: h.tools }]),
          {
            "@type": "ItemList",
            name: META[loc].title,
            numberOfItems: tools.length,
            itemListElement: tools.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name[loc],
              url: absoluteUrl(localeHref(`/araclar/${t.slug[loc]}`, loc)),
            })),
          },
        ]}
      />

      <V2PageHeader
        compact
        crumbs={[{ label: "INDOLES", href: "/" }, { label: h.tools }]}
        eyebrow={h.eyebrow}
        title={h.title}
        lede={h.lede}
      />

      <section aria-label={h.tools} className="ds-container py-16">
        {/* Tek araç yayındayken kart tam genişlikte durur (öne çıkan kart);
            ikinci araç yayına girdiğinde liste iki sütuna açılır. Sayım
            FİLTRELİ liste üzerinden — yayınlanmamış bir araç ne kartı ne
            sütun kararını etkiler. */}
        <ul className={tools.length === 1 ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
          {tools.map((t) => (
            <li key={t.slug.tr}>
              <Link
                href={localeHref(`/araclar/${t.slug[loc]}`, loc)}
                className="group block v2-surface border border-surface-2 rounded-2xl p-8 md:p-12 h-full"
              >
                <span className="eyebrow">{t.eyebrow[loc]}</span>
                <h2 className="typography-h2 text-ink-900 mt-4">{t.name[loc]}</h2>
                <p className="typography-body-lg text-ink-700 mt-3 max-w-prose-editorial">
                  {t.lede[loc]}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 typography-label mono text-ink-500 uppercase tracking-widest">
                  {t.proof.map((p) => (
                    <li key={p.tr}>{p[loc]}</li>
                  ))}
                </ul>
                <span className="btn btn-primary mt-8">
                  {h.open}
                  <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
