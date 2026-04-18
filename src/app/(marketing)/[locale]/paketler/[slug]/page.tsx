import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { getPackageBySlug, PACKAGES } from "@/lib/content/packages";
import { getPillar } from "@/lib/content/pillars";
import { CASES } from "@/lib/content/cases";

export async function generateStaticParams() {
  return PACKAGES.flatMap((p) =>
    (["tr", "en"] as const).map((locale) => ({
      locale,
      slug: p.slug[locale],
    }))
  );
}

export default async function PackageDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const pkg = getPackageBySlug(slug, loc);
  if (!pkg) notFound();

  const pillar = getPillar(pkg.pillar);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const relatedCase = CASES.find((c) => c.pillar === pkg.pillar);

  const priceFormatted =
    loc === "tr"
      ? `₺ ${pkg.pricing.TRY.toLocaleString("tr-TR")}`
      : `€ ${pkg.pricing.EUR.toLocaleString("en-US")}`;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.packages"), href: `/${locale}/paketler` },
          { label: pkg.name[loc] },
        ]}
        eyebrow={`${pillar?.name[loc]} — ${pkg.durationWeeks} ${
          loc === "tr" ? "hafta" : "weeks"
        }`}
        title={pkg.name[loc]}
        lede={pkg.outcome[loc]}
      />

      {/* Price + summary */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <p className="typography-body-lg text-ink-700 max-w-prose-editorial">
              {pkg.summary[loc]}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/iletisim`}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-md"
              >
                <Phone size={16} aria-hidden />
                {tCommon("cta.bookConsultation")}
              </Link>
              <Link
                href="/app/brief/yeni"
                className="inline-flex items-center h-12 px-6 rounded-full border border-surface-3 text-ink-900 hover:bg-surface-1 transition-colors typography-body-md"
              >
                {tCommon("cta.submitBrief")}
              </Link>
            </div>
          </div>
          <aside className="md:col-span-4">
            <div className="bg-surface-1 rounded-2xl p-8">
              <div className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Başlangıç fiyatı" : "Starting from"}
              </div>
              <div
                className="typography-display-lg mt-4 text-ink-900"
                style={{ fontVariationSettings: '"opsz" 9' }}
              >
                {priceFormatted}
              </div>
              <dl className="mt-8 space-y-4 typography-body-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">
                    {loc === "tr" ? "Süre" : "Duration"}
                  </dt>
                  <dd className="text-ink-900">
                    {pkg.durationWeeks} {loc === "tr" ? "hafta" : "weeks"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Pillar</dt>
                  <dd className="text-brand-700">{pillar?.name[loc]}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* Scope */}
      <section className="bg-surface-1 border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Kapsam" : "Scope"}
            </span>
            <h2 className="typography-display-lg mt-4 text-ink-900">
              {loc === "tr" ? "Ne dahil?" : "What's included?"}
            </h2>
          </div>
          <div className="md:col-span-8">
            <ul className="divide-y divide-surface-2 border-y border-surface-2">
              {pkg.scope[loc].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 py-4 typography-body-md text-ink-700"
                >
                  <span
                    aria-hidden
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Deliverables + Who for */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Teslim edilenler" : "Deliverables"}
            </span>
            <h3 className="typography-h1 mt-4 text-ink-900">
              {loc === "tr" ? "Teslim edilenler." : "What you get."}
            </h3>
            <ol className="mt-8 space-y-4">
              {pkg.deliverables[loc].map((d, i) => (
                <li key={d} className="flex gap-4">
                  <span className="typography-label text-ink-500 tracking-widest shrink-0">
                    0{i + 1}
                  </span>
                  <span className="typography-body-md text-ink-700">{d}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Kimler için" : "Who it's for"}
            </span>
            <h3 className="typography-h1 mt-4 text-ink-900">
              {loc === "tr" ? "Hangi profile uygun?" : "Who it fits."}
            </h3>
            <ul className="mt-8 space-y-4">
              {pkg.whoFor[loc].map((w) => (
                <li
                  key={w}
                  className="typography-body-md text-ink-700 flex items-start gap-4"
                >
                  <span
                    aria-hidden
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-ink-500 shrink-0"
                  />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {pkg.faq.length > 0 && (
        <section className="bg-surface-1 border-b border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
            <div className="max-w-[720px]">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                FAQ
              </span>
              <h2 className="typography-display-lg mt-4 text-ink-900">
                {loc === "tr" ? "Sık sorulan." : "Frequently asked."}
              </h2>
              <div className="mt-12 divide-y divide-surface-2 border-y border-surface-2">
                {pkg.faq.map((f) => (
                  <details
                    key={f.question[loc]}
                    className="group py-6"
                  >
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                      <span className="typography-h3 text-ink-900">
                        {f.question[loc]}
                      </span>
                      <span
                        aria-hidden
                        className="text-ink-500 typography-body-md transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
                      {f.answer[loc]}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related case */}
      {relatedCase && (
        <section className="bg-paper border-b border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "İlgili vaka" : "Related case"}
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
                  className="inline-flex items-center gap-2 text-brand-700 typography-body-md mt-8"
                >
                  <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                    {tCommon("cta.view")}
                  </span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <ContactCallout locale={loc} />
    </>
  );
}
