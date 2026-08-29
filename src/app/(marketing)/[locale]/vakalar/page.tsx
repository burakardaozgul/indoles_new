import Link from "next/link";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PersonaText } from "@/components/marketing/persona-text";
import { PersonaSwitch } from "@/components/marketing/persona-switch";
import { CASES } from "@/lib/content/cases";
import { PROBLEM_LABELS } from "@/components/marketing/case-card";
import { CaseFilter } from "@/components/marketing/case-filter";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbLd, organizationLd, webPageLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import { localeHref } from "@/lib/i18n/locale-href";
import type { Locale } from "@/lib/content/types";


const PATHS = { tr: "/tr/vakalar", en: "/en/case-studies" };

/**
 * Sayı içerikten türer. "On iş" elle yazılmıştı ve gerçek sayı dokuzdu —
 * vaka eklendikçe/çıktıkça sessizce eskiyen bir iddia. `docs/04` §10:
 * sayfada görünen her rakam doğrulanabilir olmalı.
 */
const META = {
  tr: {
    title: "Vaka çalışmaları — ölçülen sonuçlar",
    description: `${CASES.length} iş, rakamlarıyla birlikte: 20× ROAS, 1,5 milyon dolar ciro, ilk sayfa sıralaması. Her vakada problem, izlenen yöntem ve ölçülen sonuç yazılı.`,
  },
  en: {
    title: "Case studies — measured outcomes",
    description: `${CASES.length} engagements with the numbers attached: 20× ROAS, $1.5M in revenue, first-page rankings. Every case records the problem, the method and what changed.`,
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

export default async function CaseIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tPage = await getTranslations({ locale, namespace: "pages.cases" });

  const featured = CASES[0]!;
  const others = CASES.slice(1);

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
            { name: tCommon("nav.caseStudies") },
          ]),
          {
            "@type": "ItemList",
            name: META[loc].title,
            numberOfItems: CASES.length,
            itemListElement: CASES.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.title[loc],
              url: absoluteUrl(
                `/${loc}/${loc === "tr" ? "vakalar" : "case-studies"}/${c.slug[loc]}`
              ),
            })),
          },
        ]}
      />
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.caseStudies") },
        ]}
        eyebrow={loc === "tr" ? "Vakalar" : "Case studies"}
        title={
          <PersonaText
            industrial={tPage("industrial.title")}
            commerce={tPage("commerce.title")}
          />
        }
        lede={
          <PersonaText
            industrial={tPage("industrial.lede")}
            commerce={tPage("commerce.lede")}
          />
        }
        aside={<PersonaSwitch locale={loc} />}
      />

      {/* Featured */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-20 md:py-28">
          <Link
            href={localeHref(`/vakalar/${featured.slug[loc]}`, loc)}
            className="group grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center gap-4">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Seçilmiş vaka" : "Selected case"}
                </span>
                <span className="w-px h-4 v2-surface-3" aria-hidden />
                <span className="typography-label uppercase tracking-widest text-teal-700">
                  {PROBLEM_LABELS[featured.problemType]![loc]}
                </span>
              </div>
              <h2 className="typography-h1 mt-6 text-ink-900 max-w-[22ch] group-hover:text-teal-800 transition-colors">
                {featured.title[loc]}
              </h2>
              <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
                {featured.lead[loc]}
              </p>
              {/* Sol sütunu sağdaki 4'lü metrik yığınıyla dikey dengeye getirir
                  (denetim: metinden sonra büyük boş alan kalıyordu). Grid'in
                  varsayılan `align-items: stretch`'i bu sütunu satır
                  yüksekliğine uzatır; içerideki `flex-1` görsel o boşluğu
                  doldurur. Mobilde sabit 4:3 oranına düşer. */}
              {featured.cover ? (
                <div className="relative mt-8 md:mt-10 overflow-hidden rounded-2xl aspect-4/3 md:aspect-auto md:flex-1 md:min-h-70">
                  <Image
                    src={featured.cover.src}
                    alt={featured.cover.alt[loc]}
                    fill
                    sizes="(max-width: 768px) 100vw, 620px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {featured.clientLogo ? (
                    <span className="absolute left-4 top-4 flex items-center rounded-lg bg-surface-1 px-4 py-3 shadow-md">
                      <Image
                        src={featured.clientLogo}
                        alt={featured.clientName[loc]}
                        width={176}
                        height={88}
                        className="h-9 w-auto object-contain"
                      />
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="md:col-span-5">
              <dl className="grid grid-cols-2 md:grid-cols-1 gap-px v2-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
                {featured.metrics.map((m) => (
                  <div key={m.label[loc]} className="v2-surface p-5 md:p-8">
                    <dt className="typography-label uppercase tracking-widest text-ink-500">
                      {m.label[loc]}
                    </dt>
                    <dd
                      className="typography-h2 mt-3 text-ink-900"
                      style={{ fontVariationSettings: '"opsz" 9' }}
                    >
                      {m.value[loc]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Link>
        </div>
      </section>

      {/* Diğer vakalar — problem tipine göre filtrelenebilir (lede'nin
          vaadi). `others` her zaman sunucu HTML'inde tam basılır; filtre
          yalnız hidrasyon sonrası görünürlüğü CSS ile yönetir. */}
      <section
        className="v2-surface"
        aria-label={loc === "tr" ? "Diğer vakalar" : "Other cases"}
      >
        <div className="ds-container py-24 md:py-32">
          <CaseFilter
            cases={others}
            locale={loc}
            labels={{
              groupLabel: tPage("filter.groupLabel"),
              all: tPage("filter.all"),
              resultCount: tPage.raw("filter.resultCount") as string,
            }}
          />
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
