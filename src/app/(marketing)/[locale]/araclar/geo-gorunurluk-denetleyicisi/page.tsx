import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { GeoScanForm } from "@/components/tools/geo-scan-form";
import { getToolBySlug } from "@/lib/content/tools";
import { ARTICLES } from "@/lib/content/articles";
import { SERVICES } from "@/lib/content/services";
import { localeHref } from "@/lib/i18n/locale-href";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  breadcrumbLd,
  faqLd,
  organizationLd,
  softwareApplicationLd,
  webPageLd,
} from "@/lib/seo/json-ld";
import type { Locale } from "@/lib/content/types";

/** Kararlı TR slug — içerik kaydının kimliği. */
const SLUG = "geo-gorunurluk-denetleyicisi";

const PATHS = {
  tr: `/tr/araclar/${SLUG}`,
  en: "/en/tools/geo-visibility-checker",
};

/** Sayfa chrome'u — araca özgü metin `tools.ts`'te; bunlar bölüm başlıkları. */
const COPY = {
  tr: {
    toolsRoot: "araclar",
    tools: "Araçlar",
    formTitle: "Sitenizi tarayın",
    stepsEyebrow: "Nasıl çalışır",
    stepsTitle: "Üç adım, saniyeler içinde skor.",
    signalsEyebrow: "Ne ölçüyoruz",
    signalsTitle: "Yüz puana dağılan beş sinyal.",
    weight: "puan",
    faqEyebrow: "Sıkça sorulanlar",
    faqTitle: "Denetimden önce en çok sorulanlar.",
    relatedEyebrow: "Devamı",
    relatedTitle: "Skorunuzu yükseltmek için.",
    serviceLink: "AI danışmanlığı hizmeti",
    articlesLabel: "GEO rehber yazıları",
    read: "Oku",
  },
  en: {
    toolsRoot: "tools",
    tools: "Tools",
    formTitle: "Scan your site",
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps, a score within seconds.",
    signalsEyebrow: "What we measure",
    signalsTitle: "Five signals across one hundred points.",
    weight: "points",
    faqEyebrow: "Frequently asked",
    faqTitle: "The questions asked most before an audit.",
    relatedEyebrow: "Next",
    relatedTitle: "To lift your score.",
    serviceLink: "AI consulting service",
    articlesLabel: "GEO guide articles",
    read: "Read",
  },
} as const;

const SCAN_FORM_LABELS = {
  tr: {
    urlLabel: "Site adresi",
    urlPlaceholder: "https://ornek.com.tr",
    submit: "Denetle",
    submitting: "Taranıyor…",
    turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
    turnstileUnavailable:
      "Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.",
    errors: {
      invalidUrl: "Geçerli bir site adresi girin (örneğin https://ornek.com.tr).",
      rateLimited: "Çok fazla tarama yapıldı. Bir süre sonra tekrar deneyin.",
      unreachable: "Bu adrese ulaşılamadı. Adresi kontrol edip tekrar deneyin.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      generic: "Bir sorun oluştu, tekrar deneyin.",
    },
  },
  en: {
    urlLabel: "Site address",
    urlPlaceholder: "https://example.com",
    submit: "Audit",
    submitting: "Scanning…",
    turnstileLoading: "Loading the security check…",
    turnstileUnavailable:
      "The security check did not load. Refresh the page and try again.",
    errors: {
      invalidUrl: "Enter a valid site address (for example https://example.com).",
      rateLimited: "Too many scans for now. Please try again later.",
      unreachable: "We could not reach that address. Check it and try again.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      generic: "Something went wrong, please retry.",
    },
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const tool = getToolBySlug(SLUG, "tr");
  if (!tool) return {};
  return buildMetadata({
    title: tool.seo.title[loc],
    description: tool.seo.description[loc],
    paths: PATHS,
    locale: loc,
  });
}

export default async function GeoVisibilityCheckerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = COPY[loc];

  const tool = getToolBySlug(SLUG, "tr");
  if (!tool) notFound();

  const aiService = SERVICES.find((s) => s.slug.tr === "ai-danismanlik");
  const geoArticles = ARTICLES.filter((a) => a.topic === "geo").slice(0, 3);

  const faqItems = tool.faq.map((f) => ({
    question: f.question[loc],
    answer: f.answer[loc],
  }));

  return (
    <>
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: tool.name[loc],
            description: tool.seo.description[loc],
            path: PATHS[loc],
            locale: loc,
          }),
          softwareApplicationLd({
            name: tool.name[loc],
            description: tool.seo.description[loc],
            path: PATHS[loc],
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            { name: c.tools, path: localeHref("/araclar", loc) },
            { name: tool.name[loc] },
          ]),
          faqLd(
            tool.faq.map((f) => ({
              question: f.question[loc],
              answer: f.answer[loc],
            })),
          ),
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: c.tools, href: "/araclar" },
          { label: tool.name[loc] },
        ]}
        eyebrow={tool.eyebrow[loc]}
        title={tool.name[loc]}
        lede={tool.lede[loc]}
      />

      {/* Form — sayfanın birincil aksiyonu, hemen ilk ekranda. */}
      <section aria-labelledby="scan-heading" className="ds-container pb-16">
        <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 max-w-prose-editorial">
          <h2 id="scan-heading" className="typography-h3 text-ink-900">
            {c.formTitle}
          </h2>
          <div className="mt-6">
            <GeoScanForm locale={loc} labels={SCAN_FORM_LABELS[loc]} />
          </div>
          <p className="typography-caption text-ink-500 mt-6">{tool.footnote[loc]}</p>
        </div>
      </section>

      {/* Nasıl çalışır — 3 adım. */}
      <section aria-labelledby="steps-heading" className="ds-container py-16 border-t border-surface-2">
        <span className="eyebrow">{c.stepsEyebrow}</span>
        <h2 id="steps-heading" className="typography-h2 text-ink-900 mt-4">
          {c.stepsTitle}
        </h2>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {tool.steps.map((step, i) => (
            <li key={step.title[loc]}>
              <span className="mono text-ink-500" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="typography-h3 text-ink-900 mt-3">{step.title[loc]}</h3>
              <p className="typography-body-md text-ink-700 mt-2">
                {step.description[loc]}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Ölçülen 5 sinyal. */}
      <section aria-labelledby="signals-heading" className="ds-container py-16 border-t border-surface-2">
        <span className="eyebrow">{c.signalsEyebrow}</span>
        <h2 id="signals-heading" className="typography-h2 text-ink-900 mt-4">
          {c.signalsTitle}
        </h2>
        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {tool.signals.map((signal) => (
            <li
              key={signal.id}
              className="v2-surface border border-surface-2 rounded-xl p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="typography-h3 text-ink-900">{signal.title[loc]}</h3>
                <span className="mono tabular text-ink-500 shrink-0">
                  {signal.weight} {c.weight}
                </span>
              </div>
              <p className="typography-body-md text-ink-700 mt-3">
                {signal.description[loc]}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* SSS — native <details>. */}
      <section aria-labelledby="faq-heading" className="ds-container py-16 border-t border-surface-2">
        <span className="eyebrow">{c.faqEyebrow}</span>
        <h2 id="faq-heading" className="typography-h2 text-ink-900 mt-4">
          {c.faqTitle}
        </h2>
        <FaqAccordion items={faqItems} surface="tool" className="mt-8" />
      </section>

      {/* Üçgen linkler: hizmet + üç GEO yazısı. */}
      <section aria-labelledby="related-heading" className="ds-container py-16 border-t border-surface-2">
        <span className="eyebrow">{c.relatedEyebrow}</span>
        <h2 id="related-heading" className="typography-h2 text-ink-900 mt-4">
          {c.relatedTitle}
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {aiService ? (
            <Link
              href={localeHref(`/hizmetler/${aiService.slug[loc]}`, loc)}
              className="group block v2-surface border border-surface-2 rounded-xl p-6"
            >
              <span className="eyebrow-bare mono text-ink-500">
                {COPY[loc].serviceLink}
              </span>
              <h3 className="typography-h3 text-ink-900 mt-3">
                {aiService.name[loc]}
              </h3>
              <span
                aria-hidden="true"
                className="arrow text-ink-900 mt-4 inline-block"
              >
                →
              </span>
            </Link>
          ) : null}

          <div className="v2-surface border border-surface-2 rounded-xl p-6">
            <span className="eyebrow-bare mono text-ink-500">
              {c.articlesLabel}
            </span>
            <ul className="mt-3 divide-y divide-surface-2">
              {geoArticles.map((a) => (
                <li key={a.slug[loc]} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={localeHref(`/yazilar/${a.slug[loc]}`, loc)}
                    className="group flex items-start justify-between gap-4"
                  >
                    <span className="typography-body-md text-ink-800 group-hover:text-ink-900">
                      {a.title[loc]}
                    </span>
                    <span
                      aria-hidden="true"
                      className="arrow text-ink-500 shrink-0"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
