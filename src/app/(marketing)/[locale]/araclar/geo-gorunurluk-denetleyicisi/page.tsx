import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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
    share: "Sonucu paylaş",
    shareCopied: "Bağlantı kopyalandı",
    errors: {
      invalidUrl: "Geçerli bir site adresi girin (örneğin https://ornek.com.tr).",
      rateLimited: "Çok fazla tarama yapıldı. Bir süre sonra tekrar deneyin.",
      unreachable: "Bu adrese ulaşılamadı. Adresi kontrol edip tekrar deneyin.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
      generic: "Tarama şu an tamamlanamadı, birazdan tekrar deneyin.",
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
    share: "Share result",
    shareCopied: "Link copied",
    errors: {
      invalidUrl: "Enter a valid site address (for example https://example.com).",
      rateLimited: "Too many scans for now. Please try again later.",
      unreachable: "We could not reach that address. Check it and try again.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      unavailable: "The tool cannot respond right now. Try again shortly.",
      generic: "The scan could not finish right now. Try again shortly.",
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

      {/* Araç hero — klasik V2PageHeader yerine araç-özel hafif giriş: küçük
          breadcrumb + eyebrow + araç adı (h1) + bilgilendirici intro. Tek
          merkezî sütun; giriş alanı hemen altındaki bölümde. */}
      <section aria-labelledby="tool-h1" className="tool-hero">
        <div className="ds-container">
          <div className="mx-auto max-w-prose-editorial">
            <nav aria-label="Breadcrumb" className="v2-crumbs">
              <ol>
                <li>
                  <Link href={`/${loc}`}>INDOLES</Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li>
                  <Link href={localeHref("/araclar", loc)}>{c.tools}</Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li>
                  <span aria-current="page">{tool.name[loc]}</span>
                </li>
              </ol>
            </nav>

            <span className="eyebrow">{tool.eyebrow[loc]}</span>
            <h1 id="tool-h1" className="typography-h1 text-ink-900 mt-4">
              {tool.name[loc]}
            </h1>
            <p className="typography-body-lg text-ink-700 mt-5">{tool.lede[loc]}</p>
          </div>
        </div>
      </section>

      {/* Giriş alanı — sayfanın birincil aksiyonu, ilk ekranda intro'nun hemen
          altında. Başlık sr-only: intro'yla giriş arasına görsel bir başlık
          girmez (Burak yönü) ama başlık düzeni ve `scan-heading` sabit kalır. */}
      <section aria-labelledby="scan-heading" className="ds-container pt-8 pb-16 md:pb-24">
        <div className="mx-auto max-w-prose-editorial">
          <h2 id="scan-heading" className="sr-only">
            {c.formTitle}
          </h2>
          <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10">
            <GeoScanForm
              locale={loc}
              labels={SCAN_FORM_LABELS[loc]}
              signals={tool.signals}
            />
            <p className="typography-caption text-ink-500 mt-6">
              {tool.footnote[loc]}
            </p>
          </div>
        </div>
      </section>

      {/* Nasıl çalışır — 3 adım, tek sütunda dikey liste. */}
      <section aria-labelledby="steps-heading" className="ds-container">
        <div className="mx-auto max-w-prose-editorial py-16 border-t border-surface-2">
          <span className="eyebrow">{c.stepsEyebrow}</span>
          <h2 id="steps-heading" className="typography-h2 text-ink-900 mt-4">
            {c.stepsTitle}
          </h2>
          <ol className="mt-10 flex flex-col gap-8">
            {tool.steps.map((step, i) => (
              <li key={step.title[loc]} className="flex gap-5">
                <span className="mono text-ink-500 shrink-0" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="typography-h3 text-ink-900">{step.title[loc]}</h3>
                  <p className="typography-body-md text-ink-700 mt-2">
                    {step.description[loc]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ölçülen 5 sinyal — tek sütunda dikey kart yığını. */}
      <section aria-labelledby="signals-heading" className="ds-container">
        <div className="mx-auto max-w-prose-editorial py-16 border-t border-surface-2">
          <span className="eyebrow">{c.signalsEyebrow}</span>
          <h2 id="signals-heading" className="typography-h2 text-ink-900 mt-4">
            {c.signalsTitle}
          </h2>
          <ul className="mt-10 flex flex-col gap-4">
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
        </div>
      </section>

      {/* SSS — native <details>. */}
      <section aria-labelledby="faq-heading" className="ds-container">
        <div className="mx-auto max-w-prose-editorial py-16 border-t border-surface-2">
          <span className="eyebrow">{c.faqEyebrow}</span>
          <h2 id="faq-heading" className="typography-h2 text-ink-900 mt-4">
            {c.faqTitle}
          </h2>
          <FaqAccordion items={faqItems} surface="tool" className="mt-8" />
        </div>
      </section>

      {/* Devamı: hizmet + üç GEO yazısı, tek sütunda dikey. */}
      <section aria-labelledby="related-heading" className="ds-container">
        <div className="mx-auto max-w-prose-editorial py-16 border-t border-surface-2">
          <span className="eyebrow">{c.relatedEyebrow}</span>
          <h2 id="related-heading" className="typography-h2 text-ink-900 mt-4">
            {c.relatedTitle}
          </h2>
          <div className="mt-8 flex flex-col gap-6">
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
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
