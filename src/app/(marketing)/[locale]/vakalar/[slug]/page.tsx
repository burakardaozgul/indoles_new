import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { getCaseBySlug, CASES } from "@/lib/content/cases";
import { getPillar } from "@/lib/content/pillars";

export async function generateStaticParams() {
  return CASES.flatMap((c) =>
    (["tr", "en"] as const).map((locale) => ({ locale, slug: c.slug }))
  );
}

export default async function CaseDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  const pillar = getPillar(c.pillar);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const related = CASES.filter(
    (x) => x.slug !== c.slug && x.pillar === c.pillar
  ).slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.caseStudies"), href: `/${locale}/vakalar` },
          { label: c.clientName[loc] },
        ]}
        eyebrow={`${c.clientSector[loc]} — ${pillar?.name[loc]}`}
        title={c.title[loc]}
        lede={c.lead[loc]}
      />

      {/* Metrics */}
      <section className="bg-surface-1 border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-20">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {c.metrics.map((m) => (
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

      {/* Challenge / Approach / Outcome */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                01 — {loc === "tr" ? "Problem" : "Challenge"}
              </span>
            </div>
            <ul className="md:col-span-9 space-y-4">
              {c.challenge[loc].map((p, i) => (
                <li
                  key={i}
                  className="typography-body-lg text-ink-700 max-w-prose-editorial flex gap-4"
                >
                  <span
                    aria-hidden
                    className="mt-3 w-1.5 h-1.5 rounded-full bg-danger-500 shrink-0"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-surface-2 my-16 md:my-24" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                02 — {loc === "tr" ? "Yaklaşım" : "Approach"}
              </span>
            </div>
            <ol className="md:col-span-9 space-y-6">
              {c.approach[loc].map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="typography-label tracking-widest text-brand-700 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="typography-body-lg text-ink-700 max-w-prose-editorial">
                    {p}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <hr className="border-surface-2 my-16 md:my-24" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                03 — {loc === "tr" ? "Sonuç" : "Outcome"}
              </span>
            </div>
            <ul className="md:col-span-9 space-y-4">
              {c.outcome[loc].map((p, i) => (
                <li
                  key={i}
                  className="typography-body-lg text-ink-700 max-w-prose-editorial flex gap-4"
                >
                  <span
                    aria-hidden
                    className="mt-3 w-1.5 h-1.5 rounded-full bg-success-500 shrink-0"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {c.testimonial && (
        <section className="bg-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
            <figure className="max-w-[36ch] mx-auto text-center">
              <blockquote className="typography-display-xl text-ink-900 leading-[1.15]">
                {c.testimonial.quote[loc]}
              </blockquote>
              <figcaption className="typography-label uppercase tracking-widest text-ink-500 mt-10">
                {c.testimonial.authorRole[loc]}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper border-t border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-20 md:py-24">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="typography-display-lg text-ink-900">
                {loc === "tr" ? "Benzer vakalar" : "Related cases"}
              </h2>
              <Link
                href={`/${locale}/vakalar`}
                className="typography-body-md text-brand-700"
              >
                <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                  {tCommon("cta.viewAll")}
                </span>{" "}
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/vakalar/${r.slug}`}
                  className="group bg-surface-1 border border-surface-2 rounded-2xl p-8 hover:bg-surface-2/60 transition-colors"
                >
                  <h3 className="typography-h2 text-ink-900 group-hover:text-brand-800">
                    {r.title[loc]}
                  </h3>
                  <p className="typography-caption text-ink-500 mt-4">
                    {r.clientSector[loc]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCallout locale={loc} />
    </>
  );
}
