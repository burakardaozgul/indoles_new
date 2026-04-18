import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PersonaText } from "@/components/marketing/persona-text";
import { getPillar, PILLARS } from "@/lib/content/pillars";
import { PACKAGES } from "@/lib/content/packages";
import { CASES } from "@/lib/content/cases";

export async function generateStaticParams() {
  return PILLARS.flatMap((p) =>
    (["tr", "en"] as const).map((locale) => ({ slug: p.key, locale }))
  );
}

export default async function PillarDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tProof = await getTranslations({ locale, namespace: "home.proof" });

  const relatedPackages = PACKAGES.filter((p) => p.pillar === pillar.key);
  const relatedCase = CASES.find((c) => c.pillar === pillar.key);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.services"), href: `/${locale}/hizmetler` },
          { label: pillar.name[loc] },
        ]}
        eyebrow={pillar.tagline.industrial[loc]}
        title={pillar.name[loc]}
        lede={pillar.heroLede[loc]}
      />

      {/* Metrics strip */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-20">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {pillar.metrics.map((m) => (
              <div key={m.label[loc]}>
                <dt className="typography-label uppercase tracking-widest text-ink-500">
                  {m.label[loc]}
                </dt>
                <dd
                  className="typography-display-xl mt-4 text-ink-900"
                  style={{ fontVariationSettings: '"opsz" 9' }}
                >
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Methodology */}
      <section
        aria-labelledby="methodology-heading"
        className="bg-surface-1 border-b border-surface-2"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {loc === "tr" ? "Yöntem" : "Method"}
          </span>
          <h2
            id="methodology-heading"
            className="typography-display-lg mt-4 max-w-[22ch] text-ink-900"
          >
            {loc === "tr"
              ? "Teşhis olmadan reçete yok."
              : "No prescription without diagnosis."}
          </h2>
          <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
            {pillar.description.industrial[loc]}
          </p>

          <ol className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-px bg-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
            {pillar.methodology.map((m) => (
              <li
                key={m.step}
                className="bg-paper p-8 md:p-10 flex flex-col min-h-[240px]"
              >
                <span className="typography-label uppercase tracking-widest text-brand-700">
                  {m.step}
                </span>
                <h3 className="typography-h2 mt-6 text-ink-900">
                  {m.title[loc]}
                </h3>
                <p className="typography-body-sm text-ink-700 mt-4">
                  {m.description[loc]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services */}
      <section
        aria-labelledby="services-heading"
        className="bg-paper border-b border-surface-2"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Hizmetler" : "Services"}
              </span>
              <h2
                id="services-heading"
                className="typography-display-lg mt-4 text-ink-900"
              >
                {loc === "tr"
                  ? "İşin merkezindeki uzmanlık."
                  : "The expertise at the core."}
              </h2>
            </div>
            <div className="md:col-span-8">
              <ol className="border-t border-surface-2">
                {pillar.services.map((s, idx) => (
                  <li key={s.slug} className="border-b border-surface-2">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
                      <div className="md:col-span-1 typography-label uppercase tracking-widest text-ink-500 self-start">
                        0{idx + 1}
                      </div>
                      <div className="md:col-span-4">
                        <h3 className="typography-h2 text-ink-900">
                          {s.name[loc]}
                        </h3>
                      </div>
                      <div className="md:col-span-7">
                        <p className="typography-body-md text-ink-700">
                          {s.shortDescription.industrial[loc]}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      {relatedPackages.length > 0 && (
        <section className="bg-surface-1 border-b border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Paketler" : "Packages"}
                </span>
                <h2 className="typography-display-lg mt-4 max-w-[22ch] text-ink-900">
                  {loc === "tr"
                    ? "Hızlı giriş kapıları."
                    : "Fast entry doors."}
                </h2>
              </div>
              <Link
                href={`/${locale}/paketler`}
                className="typography-body-md text-brand-700"
              >
                <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                  {tCommon("cta.viewAll")}
                </span>{" "}
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPackages.map((pkg) => (
                <Link
                  key={pkg.slug[loc]}
                  href={`/${locale}/paketler/${pkg.slug[loc]}`}
                  className="group bg-paper border border-surface-2 rounded-2xl p-8 md:p-10 flex flex-col min-h-[260px] hover:bg-surface-2/60 transition-colors"
                >
                  <header className="flex items-center justify-between">
                    <span className="typography-label uppercase tracking-widest text-brand-700">
                      {pillar.name[loc]}
                    </span>
                    <span className="typography-caption text-ink-500">
                      {pkg.durationWeeks} {loc === "tr" ? "hafta" : "weeks"}
                    </span>
                  </header>
                  <h3 className="typography-h1 mt-8 text-ink-900">
                    {pkg.name[loc]}
                  </h3>
                  <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
                    <PersonaText
                      industrial={pkg.outcome.industrial[loc]}
                      commerce={pkg.outcome.commerce[loc]}
                    />
                  </p>
                  <span className="mt-auto pt-8 inline-flex items-center gap-2 typography-body-sm text-brand-700">
                    <span className="underline underline-offset-4 decoration-brand-300 group-hover:decoration-brand-500">
                      {tCommon("cta.view")}
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured case */}
      {relatedCase && (
        <section className="bg-paper border-b border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {tProof("featured.clientLabel")}
            </span>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-7">
                <h2 className="typography-display-xl text-ink-900 max-w-[20ch]">
                  {relatedCase.title[loc]}
                </h2>
                <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
                  {relatedCase.lead[loc]}
                </p>
                <Link
                  href={`/${locale}/vakalar/${relatedCase.slug}`}
                  className="inline-flex items-center gap-2 text-brand-700 typography-body-md mt-10"
                >
                  <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                    {tCommon("cta.view")}
                  </span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="md:col-span-5">
                <dl className="grid grid-cols-1 gap-px bg-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
                  {relatedCase.metrics.map((m) => (
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
            </div>
          </div>
        </section>
      )}

      <ContactCallout locale={loc} />
    </>
  );
}
