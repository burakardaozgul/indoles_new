import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { CONSULTANTS_ORDERED, BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import { getPillar } from "@/lib/content/pillars";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbLd, organizationLd, webPageLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import type { Locale } from "@/lib/content/types";


const PATHS = { tr: "/tr/danismanlar", en: "/en/consultants" };

const META = {
  tr: {
    title: "Danışman kadrosu — davetle kurulmuş ekip",
    description:
      `${BOOKABLE_CONSULTANTS.length} kişilik iç ekip: marka stratejisi, dijital dönüşüm, yapay zeka, tasarım ve prodüksiyon. Açık marketplace değil; projeye sizinle birlikte giren danışmanlar.`,
  },
  en: {
    title: "Consultants — an invitation-only team",
    description:
      `A ${BOOKABLE_CONSULTANTS.length}-person internal team covering brand strategy, digital transformation, AI, design and production. Not a marketplace: people who join the project with you.`,
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

export default async function ConsultantsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

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
            { name: tCommon("nav.consultants") },
          ]),
          {
            "@type": "ItemList",
            name: META[loc].title,
            numberOfItems: BOOKABLE_CONSULTANTS.length,
            itemListElement: BOOKABLE_CONSULTANTS.map((k, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: k.name,
              url: absoluteUrl(
                `/${loc}/${loc === "tr" ? "danismanlar" : "consultants"}/${k.slug}`
              ),
            })),
          },
        ]}
      />
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.consultants") },
        ]}
        eyebrow={loc === "tr" ? "Danışmanlar" : "Consultants"}
        title={
          loc === "tr"
            ? "İç ekip. Küratörlü."
            : "Internal team. Curated."
        }
        lede={
          loc === "tr"
            ? "Açık marketplace değil. Freelance platformu değil. Seçilmiş, davet-temelli ekip."
            : "Not an open marketplace. Not a freelance platform. A selected, invitation-only team."
        }
      />

      <section >
        <div className="ds-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSULTANTS_ORDERED.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/danismanlar/${c.slug}`}
                className="group flex min-h-[340px] flex-col rounded-xl border border-ink-200 v2-surface p-10 shadow-sm transition-shadow hover:shadow-md md:p-12"
              >
                <header className="flex items-center gap-6">
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-lg font-display text-2xl font-light text-white"
                    style={{
                      background: `linear-gradient(140deg, ${c.portraitTone}, var(--color-teal-900))`,
                    }}
                    aria-hidden="true"
                  >
                    {c.initials}
                  </div>
                  <div>
                    <h2 className="typography-h2 text-ink-900 group-hover:text-brand-800 transition-colors">
                      {c.name}
                    </h2>
                    <p className="typography-body-sm text-ink-500 mt-1">
                      {c.title[loc]}
                    </p>
                  </div>
                </header>
                <p className="typography-body-md text-ink-700 mt-8 max-w-prose-editorial">
                  {c.shortBio[loc]}
                </p>
                <div className="mt-auto pt-8 flex flex-wrap gap-2">
                  {c.pillars.map((p) => {
                    const pillar = getPillar(p);
                    return (
                      <span
                        key={p}
                        className="mono rounded-md border border-ink-200 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-teal-700"
                      >
                        {pillar?.name[loc]}
                      </span>
                    );
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
