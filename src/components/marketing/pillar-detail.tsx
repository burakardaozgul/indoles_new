import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { PillarMark } from "@/components/marketing/pillar-mark";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PersonaText } from "@/components/marketing/persona-text";
import { PersonaSwitch } from "@/components/marketing/persona-switch";
import { PACKAGES } from "@/lib/content/packages";
import { CASES } from "@/lib/content/cases";
import { getServicesByPillar } from "@/lib/content/services";
import { JsonLd } from "@/lib/seo/JsonLd";
import { TrackView } from "@/components/analytics/track-view";
import { pillarViewEvent } from "@/lib/analytics/view-events";
import {
  breadcrumbLd,
  faqLd,
  organizationLd,
  serviceLd,
  webPageLd,
} from "@/lib/seo/json-ld";
import type { PillarContent } from "@/lib/content/types";

/**
 * Pillar detay şablonu.
 *
 * `hizmetler/[slug]/page.tsx`ten davranışı değiştirilmeden taşındı: route
 * artık hem pillar hem hizmet çözüyor ve iki şablonu tek dosyada tutmak
 * dosyayı 600 satıra çıkarıyordu.
 *
 * Hizmet listesi `getServicesByPillar`dan gelir ve adlar hizmet sayfasına
 * link olur. `PillarContent.services` alanı Task 9'da kaldırıldı — kart
 * metni artık tek kaynakta, `content/services/` altında duruyor.
 */
export async function PillarDetail({
  pillar,
  locale,
}: {
  pillar: PillarContent;
  locale: "tr" | "en";
}) {
  const loc = locale;

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tProof = await getTranslations({ locale, namespace: "home.proof" });

  const relatedPackages = PACKAGES.filter((p) => p.pillar === pillar.key);
  const relatedCase = CASES.find((c) => c.pillar === pillar.key);

  const servicesRoot = `/${loc}/${loc === "tr" ? "hizmetler" : "services"}`;
  const pillarPath = `${servicesRoot}/${pillar.key}`;

  return (
    <>
      {/* `FAQPage` disiplin düzeyindeki SSS'ten üretilir. Sorular
          `pillars.ts`teki `faq` alanında durur ve aşağıda açık metin olarak
          da basılır — şema yalnız sayfada görünen soruyu taşır. Alan boşsa
          `faqLd` null döner ve `JsonLd` düğümü grafikten eler; boş şema
          Search Console'da uyarı üretiyor. */}
      <TrackView event={pillarViewEvent(pillar, loc)} />
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: pillar.name[loc],
            description: pillar.heroLede[loc],
            path: pillarPath,
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            { name: loc === "tr" ? "Hizmetler" : "Services", path: servicesRoot },
            { name: pillar.name[loc] },
          ]),
          serviceLd({
            name: pillar.name[loc],
            description: pillar.heroLede[loc],
            serviceType: pillar.name[loc],
            path: pillarPath,
            offers: relatedPackages.map((p) => ({
              name: p.name[loc],
              priceTRY: p.pricing.TRY,
              durationWeeks: p.durationWeeks,
              path: `/${loc}/${loc === "tr" ? "paketler" : "packages"}/${p.slug[loc]}`,
            })),
          }),
          faqLd(
            (pillar.faq ?? []).map((f) => ({
              question: f.question[loc],
              answer: f.answer[loc],
            })),
          ),
        ]}
      />
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.services"), href: "/hizmetler" },
          { label: pillar.name[loc] },
        ]}
        eyebrow={
          <PersonaText
            industrial={pillar.tagline.industrial[loc]}
            commerce={pillar.tagline.commerce[loc]}
          />
        }
        title={pillar.name[loc]}
        lede={pillar.heroLede[loc]}
        aside={
          /* Pillar'ın imza geometrisi — `/hizmetler` listesindekinin büyüğü.
             Sayfaya girildiğinde hangi disiplinde olunduğu okumadan belli.
             Altında persona merceği: bu sayfanın metni ona göre değişiyor. */
          <div className="flex flex-col gap-6">
            <PillarMark pillar={pillar.key} className="w-[200px] h-auto" />
            <PersonaSwitch locale={loc} />
          </div>
        }
      />

      {/* Metrics strip */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-16 md:py-20">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {pillar.metrics.map((m) => (
              <div key={m.label[loc]}>
                <dt className="typography-label uppercase tracking-widest text-ink-500">
                  {m.label[loc]}
                </dt>
                <dd
                  className="typography-h1 mt-4 text-ink-900"
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
        className="v2-surface border-b border-surface-2"
      >
        <div className="ds-container py-24 md:py-32">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {loc === "tr" ? "Yöntem" : "Method"}
          </span>
          <h2
            id="methodology-heading"
            className="typography-h2 mt-4 max-w-[22ch] text-ink-900"
          >
            {loc === "tr"
              ? "Teşhis olmadan reçete yok."
              : "No prescription without diagnosis."}
          </h2>
          <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
            <PersonaText
              industrial={pillar.description.industrial[loc]}
              commerce={pillar.description.commerce[loc]}
            />
          </p>

          <ol className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-px v2-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
            {pillar.methodology.map((m) => (
              <li
                key={m.step}
                className="p-8 md:p-10 flex flex-col min-h-[240px]"
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
        className="border-b border-surface-2"
      >
        <div className="ds-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Hizmetler" : "Services"}
              </span>
              <h2
                id="services-heading"
                className="typography-h2 mt-4 text-ink-900"
              >
                {loc === "tr"
                  ? "İşin merkezindeki uzmanlık."
                  : "The expertise at the core."}
              </h2>
            </div>
            <div className="md:col-span-8">
              <ol className="border-t border-surface-2">
                {getServicesByPillar(pillar.key).map((s, idx) => (
                  <li key={s.slug.tr} className="border-b border-surface-2">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8">
                      <div className="md:col-span-1 typography-label uppercase tracking-widest text-ink-500 self-start">
                        0{idx + 1}
                      </div>
                      <div className="md:col-span-4">
                        <h3 className="typography-h2 text-ink-900">
                          <Link
                            href={`/${loc}/${loc === "tr" ? "hizmetler" : "services"}/${s.slug[loc]}`}
                            className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                          >
                            {s.name[loc]}
                          </Link>
                        </h3>
                      </div>
                      <div className="md:col-span-7">
                        <p className="typography-body-md text-ink-700">
                          <PersonaText
                            industrial={s.shortDescription.industrial[loc]}
                            commerce={s.shortDescription.commerce[loc]}
                          />
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
        <section className="v2-surface border-b border-surface-2">
          <div className="ds-container py-24 md:py-32">
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Paketler" : "Packages"}
                </span>
                <h2 className="typography-h2 mt-4 max-w-[22ch] text-ink-900">
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
                  className="group border border-surface-2 rounded-2xl p-8 md:p-10 flex flex-col min-h-[260px] hover:v2-surface-2/60 transition-colors"
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

      {/* SSS — disiplin düzeyi. Render `FaqAccordion`'da tekilleşti; gerekçesi
          (native `<details>` crawler'a görünür kalır) o dosyada yazılı.
          Sorular hizmet sayfalarınınkini tekrarlamaz: burada "hangi disiplin
          bana uygun" seviyesi cevaplanır. */}
      {pillar.faq && pillar.faq.length > 0 && (
        <section
          aria-labelledby="sss"
          className="border-b border-surface-2"
        >
          <div className="ds-container py-24 md:py-32">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Sorular" : "Questions"}
            </span>
            <h2
              id="sss"
              className="typography-h2 mt-4 max-w-[22ch] scroll-mt-32 text-ink-900"
            >
              {loc === "tr"
                ? "Sık sorulan sorular"
                : "Frequently asked questions"}
            </h2>
            <FaqAccordion
              surface="pillar"
              className="mt-12 max-w-prose-editorial"
              items={pillar.faq.map((f) => ({
                question: f.question[loc],
                answer: f.answer[loc],
              }))}
            />
          </div>
        </section>
      )}

      {/* Featured case */}
      {relatedCase && (
        <section className="border-b border-surface-2">
          <div className="ds-container py-24 md:py-32">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {tProof("featured.clientLabel")}
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
                  className="inline-flex items-center gap-2 text-brand-700 typography-body-md mt-10"
                >
                  <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                    {tCommon("cta.view")}
                  </span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="md:col-span-5">
                <dl className="grid grid-cols-1 gap-px v2-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
                  {relatedCase.metrics.map((m) => (
                    <div key={m.label[loc]} className="v2-surface p-8">
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
            </div>
          </div>
        </section>
      )}

      <ContactCallout locale={loc} />
    </>
  );
}
