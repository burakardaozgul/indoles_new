import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { CASES } from "@/lib/content/cases";
import { getPillar } from "@/lib/content/pillars";

const PROBLEM_LABELS: Record<string, { tr: string; en: string }> = {
  efficiency_loss: { tr: "Verim kaybı", en: "Efficiency loss" },
  cost_optimization: { tr: "Maliyet optimizasyonu", en: "Cost optimization" },
  market_expansion: { tr: "Pazara açılma", en: "Market expansion" },
  digital_transformation: {
    tr: "Dijital dönüşüm",
    en: "Digital transformation",
  },
  customer_acquisition: { tr: "Müşteri edinimi", en: "Customer acquisition" },
};

export default async function CaseIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const featured = CASES[0]!;
  const others = CASES.slice(1);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.caseStudies") },
        ]}
        eyebrow={loc === "tr" ? "Vakalar" : "Case studies"}
        title={
          loc === "tr"
            ? "Problem tipine göre, sektöre değil."
            : "By problem type, not industry."
        }
        lede={
          loc === "tr"
            ? "Benzer senaryoyu gör, kendi ihtimalini değerlendir."
            : "See the similar scenario, evaluate your own odds."
        }
      />

      {/* Featured */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-20 md:py-28">
          <Link
            href={`/${locale}/vakalar/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-7">
              <div className="flex items-center gap-4">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Seçilmiş vaka" : "Selected case"}
                </span>
                <span className="w-px h-4 bg-surface-3" aria-hidden />
                <span className="typography-label uppercase tracking-widest text-brand-700">
                  {PROBLEM_LABELS[featured.problemType]![loc]}
                </span>
              </div>
              <h2 className="typography-display-xl mt-6 text-ink-900 max-w-[22ch] group-hover:text-brand-800 transition-colors">
                {featured.title[loc]}
              </h2>
              <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
                {featured.lead[loc]}
              </p>
            </div>
            <div className="md:col-span-5">
              <dl className="grid grid-cols-1 gap-px bg-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
                {featured.metrics.map((m) => (
                  <div key={m.label[loc]} className="bg-surface-1 p-8">
                    <dt className="typography-label uppercase tracking-widest text-ink-500">
                      {m.label[loc]}
                    </dt>
                    <dd
                      className="typography-display-lg mt-3 text-ink-900"
                      style={{ fontVariationSettings: '"opsz" 9' }}
                    >
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Link>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-surface-1">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((c) => {
              const pillar = getPillar(c.pillar);
              return (
                <Link
                  key={c.slug}
                  href={`/${locale}/vakalar/${c.slug}`}
                  className="group bg-paper border border-surface-2 rounded-2xl p-8 md:p-10 flex flex-col min-h-[340px] hover:bg-surface-2/40 transition-colors"
                >
                  <header className="flex items-center justify-between">
                    <span className="typography-label uppercase tracking-widest text-ink-500">
                      {PROBLEM_LABELS[c.problemType]![loc]}
                    </span>
                    <span className="typography-caption text-brand-700">
                      {pillar?.name[loc]}
                    </span>
                  </header>
                  <h3 className="typography-h2 mt-8 text-ink-900 group-hover:text-brand-800 transition-colors">
                    {c.title[loc]}
                  </h3>
                  <p className="typography-body-sm text-ink-500 mt-4 line-clamp-3">
                    {c.lead[loc]}
                  </p>
                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <span className="typography-caption text-ink-500">
                      {c.clientSector[loc]}
                    </span>
                    <span
                      aria-hidden
                      className="text-ink-500 group-hover:text-brand-700 group-hover:translate-x-1 transition-all"
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
