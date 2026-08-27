import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { PersonaText, PersonaListItems } from "@/components/marketing/persona-text";
import { getPackageBySlug, PACKAGES } from "@/lib/content/packages";
import { getPillar } from "@/lib/content/pillars";
import { CASES } from "@/lib/content/cases";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { TrackView } from "@/components/analytics/track-view";
import { packageViewEvent } from "@/lib/analytics/view-events";
import {
  breadcrumbLd,
  faqLd,
  organizationLd,
  serviceLd,
  webPageLd,
} from "@/lib/seo/json-ld";
import type { Metadata } from "next";
import type { Locale } from "@/lib/content/types";

export async function generateStaticParams() {
  return PACKAGES.flatMap((p) =>
    (["tr", "en"] as const).map((locale) => ({
      locale,
      slug: p.slug[locale],
    }))
  );
}


function packagePaths(pkg: NonNullable<ReturnType<typeof getPackageBySlug>>) {
  return {
    tr: `/tr/paketler/${pkg.slug.tr}`,
    en: `/en/packages/${pkg.slug.en}`,
  };
}

/**
 * Sayfanın başlığı ve tanımı — `generateMetadata` ile `WebPage` düğümünün
 * ortak kaynağı. İkisi ayrı yazıldığında SERP snippet'i ile şemadaki
 * `description` ayrışıyordu; AI motorları bu iki alanı çapraz okuyor.
 */
function packageMeta(
  pkg: NonNullable<ReturnType<typeof getPackageBySlug>>,
  loc: Locale
) {
  const price =
    loc === "tr"
      ? `₺ ${pkg.pricing.TRY.toLocaleString("tr-TR")}`
      : `€ ${pkg.pricing.EUR.toLocaleString("en-US")}`;

  const head =
    loc === "tr"
      ? `${pkg.descriptor.tr}. ${pkg.durationWeeks} haftada sabit kapsam ve sabit fiyat: ${price}.`
      : `${pkg.descriptor.en}. Fixed scope and a fixed price in ${pkg.durationWeeks} weeks: ${price}.`;

  // Paket adları ve tanımları farklı uzunlukta; tek bir sabit kuyruk kimi
  // pakette 160'ı aşıyordu. Uzun kuyruk sığmazsa kısası kullanılır.
  const tails =
    loc === "tr"
      ? [
          "Teslimler, haftalık plan ve devir sırası önden yazılı.",
          "Teslimler ve devir planı önden yazılı.",
        ]
      : [
          "Deliverables, the weekly plan and the handover order are written up front.",
          "Deliverables and handover are written up front.",
        ];
  const tail = tails.find((t) => `${head} ${t}`.length <= 160);

  return {
    title: `${pkg.name[loc]} — ${pkg.durationWeeks} ${
      loc === "tr" ? "hafta" : "weeks"
    }`,
    description: tail ? `${head} ${tail}` : head,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const pkg = getPackageBySlug(slug, loc);
  if (!pkg) return {};

  const { title, description } = packageMeta(pkg, loc);

  return buildMetadata({
    title,
    description,
    paths: packagePaths(pkg),
    locale: loc,
  });
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

  const paths = packagePaths(pkg);
  const meta = packageMeta(pkg, loc);

  return (
    <>
      {/* Sayfa sabit fiyat, sabit süre ve on bir soruluk bir SSS taşıyor;
          üçü de şemayla ifade edilebilir bilgi. `Service.hasOfferCatalog`
          fiyatı `packages.ts`ten birebir okur, ikinci bir kaynak tutulmaz. */}
      <TrackView event={packageViewEvent(pkg)} />
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: meta.title,
            description: meta.description,
            path: paths[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            {
              name: tCommon("nav.packages"),
              path: loc === "tr" ? "/tr/paketler" : "/en/packages",
            },
            { name: pkg.name[loc], path: paths[loc] },
          ]),
          serviceLd({
            name: pkg.name[loc],
            description: pkg.descriptor[loc],
            serviceType: pillar?.name[loc] ?? pkg.name[loc],
            path: paths[loc],
            offers: [
              {
                name: pkg.name[loc],
                priceTRY: pkg.pricing.TRY,
                durationWeeks: pkg.durationWeeks,
                path: paths[loc],
              },
            ],
          }),
          // Şema artık sayfada görünen metnin aynısını taşıyor (ADR-022).
          // Persona-aware olduğu dönemde yalnız sanayici varyantı basılıyordu
          // ve ticaret merceğindeki ziyaretçi ekranda başka bir cevap
          // okuyordu — Google'ın FAQ kuralı bu ayrışmayı kabul etmiyor.
          faqLd(
            pkg.faq.map((f) => ({
              question: f.question[loc],
              answer: f.answer[loc],
            }))
          ),
        ]}
      />
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.packages"), href: "/paketler" },
          { label: pkg.name[loc] },
        ]}
        eyebrow={`${pillar?.name[loc]} — ${pkg.durationWeeks} ${
          loc === "tr" ? "hafta" : "weeks"
        }`}
        title={pkg.name[loc]}
        lede={
          <PersonaText
            industrial={pkg.outcome.industrial[loc]}
            commerce={pkg.outcome.commerce[loc]}
          />
        }
      />

      {/* Price + summary */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <p className="typography-body-lg text-ink-700 max-w-prose-editorial">
              <PersonaText
                industrial={pkg.summary.industrial[loc]}
                commerce={pkg.summary.commerce[loc]}
              />
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PopupCTAButton
                source="package-detail"
                pillar={pkg.pillar}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-md"
              >
                <Phone size={16} aria-hidden />
                {tCommon("cta.bookConsultation")}
              </PopupCTAButton>
              <Link
                href={`/${locale}/iletisim`}
                className="inline-flex items-center h-12 px-6 rounded-full border border-surface-3 text-ink-900 hover:bg-surface-1/60 transition-colors typography-body-md"
              >
                {tCommon("cta.submitBrief")}
              </Link>
            </div>
          </div>
          <aside className="md:col-span-4">
            <div className="v2-surface rounded-2xl p-8">
              <div className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Başlangıç fiyatı" : "Starting from"}
              </div>
              <div
                className="typography-h2 mt-4 text-ink-900"
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
      <section className="v2-surface border-b border-surface-2">
        <div className="ds-container py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Kapsam" : "Scope"}
            </span>
            <h2 className="typography-h2 mt-4 text-ink-900">
              {loc === "tr" ? "Ne dahil?" : "What's included?"}
            </h2>
          </div>
          <div className="md:col-span-8">
            <ul className="divide-y divide-surface-2 border-y border-surface-2">
              <PersonaListItems
                industrial={pkg.scope.industrial[loc]}
                commerce={pkg.scope.commerce[loc]}
                variant="scope"
              />
            </ul>
          </div>
        </div>
      </section>

      {/* Deliverables + Who for */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Teslim edilenler" : "Deliverables"}
            </span>
            <h3 className="typography-h1 mt-4 text-ink-900">
              {loc === "tr" ? "Teslim edilenler." : "What you get."}
            </h3>
            <ol className="mt-8 space-y-4">
              <PersonaListItems
                industrial={pkg.deliverables.industrial[loc]}
                commerce={pkg.deliverables.commerce[loc]}
                variant="numbered"
              />
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
              <PersonaListItems
                industrial={pkg.whoFor.industrial[loc]}
                commerce={pkg.whoFor.commerce[loc]}
                variant="bullet"
              />
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {pkg.faq.length > 0 && (
        <section
          aria-labelledby="paket-sss"
          className="v2-surface border-b border-surface-2"
        >
          <div className="ds-container py-24 md:py-32">
            <div className="max-w-[720px]">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                FAQ
              </span>
              <h2
                id="paket-sss"
                className="typography-h2 mt-4 scroll-mt-32 text-ink-900"
              >
                {loc === "tr" ? "Sık sorulan." : "Frequently asked."}
              </h2>
              {/* Cevaplar persona-aware: `FaqAccordion` `answer`ı ReactNode
                  aldığı için `PersonaText` doğrudan geçebiliyor. */}
              <FaqAccordion
              surface="package"
                className="mt-12"
                items={pkg.faq.map((f) => ({
                  question: f.question[loc],
                  answer: f.answer[loc],
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Related case */}
      {relatedCase && (
        <section className="border-b border-surface-2">
          <div className="ds-container py-24 md:py-32">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "İlgili vaka" : "Related case"}
            </span>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-7">
                <h2 className="typography-h1 text-ink-900 max-w-[20ch]">
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
