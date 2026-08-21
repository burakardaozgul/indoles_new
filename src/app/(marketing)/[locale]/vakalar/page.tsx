import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { CasesSection } from "@/components/marketing/cases-section";
import { PersonaText } from "@/components/marketing/persona-text";
import { PersonaSwitch } from "@/components/marketing/persona-switch";
import { CASES } from "@/lib/content/cases";
import { CaseCard, PROBLEM_LABELS } from "@/components/marketing/case-card";

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
            href={`/${locale}/vakalar/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-7">
              <div className="flex items-center gap-4">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Seçilmiş vaka" : "Selected case"}
                </span>
                <span className="w-px h-4 v2-surface-3" aria-hidden />
                <span className="typography-label uppercase tracking-widest text-brand-700">
                  {PROBLEM_LABELS[featured.problemType]![loc]}
                </span>
              </div>
              <h2 className="typography-h1 mt-6 text-ink-900 max-w-[22ch] group-hover:text-brand-800 transition-colors">
                {featured.title[loc]}
              </h2>
              <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
                {featured.lead[loc]}
              </p>
            </div>
            <div className="md:col-span-5">
              <dl className="grid grid-cols-1 gap-px v2-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
                {featured.metrics.map((m) => (
                  <div key={m.label[loc]} className="v2-surface p-8">
                    <dt className="typography-label uppercase tracking-widest text-ink-500">
                      {m.label[loc]}
                    </dt>
                    <dd
                      className="typography-h2 mt-3 text-ink-900"
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
      <section className="v2-surface">
        <div className="ds-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((c) => (
              <CaseCard key={c.slug} c={c} locale={loc} />
            ))}
          </div>
        </div>
      </section>

      {/* Eski anasayfadan taşındı (ADR-017): problem tipine göre filtreli
          vaka gezinmesi. Yukarıdaki liste kronolojik, bu bölüm problem odaklı. */}
      <CasesSection locale={loc} />

      <ContactCallout locale={loc} />
    </>
  );
}
