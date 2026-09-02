import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { DiagnooTool } from "@/components/tools/diagnoo-tool";
import { getToolBySlug } from "@/lib/content/tools";
import { ARTICLES } from "@/lib/content/articles";
import { SERVICES } from "@/lib/content/services";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";
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

/**
 * Diagnoo araç sayfası — `/araclar` ailesinin ikinci elemanı.
 *
 * Yapı GEO Görünürlük Denetleyicisi sayfasıyla birebir (hero + giriş alanı +
 * üç adım + sinyaller + SSS + devamı + JSON-LD grafiği): iki araç aynı
 * kalıpta okunmalı, ikinci araç kendi düzenini icat etmemeli. Metin kaynağı
 * `tools.ts`; burada yalnız bölüm başlıkları yaşar.
 *
 * Giriş yüzeyi `DiagnooTool` yuvasında: Görev 15 form ve ilerleme mantığını
 * o bileşenin içine yazar, bu dosya bir daha düzenlenmez.
 */
const PATHS = {
  tr: "/tr/araclar/diagnoo",
  en: "/en/tools/diagnoo",
};

/** Sayfa chrome'u — araca özgü metin `tools.ts`'te; bunlar bölüm başlıkları. */
const COPY = {
  tr: {
    tools: "Araçlar",
    formTitle: "Mağazanızı tarayın",
    stepsEyebrow: "Nasıl çalışır",
    stepsTitle: "Üç adım, iki ile dört dakika.",
    signalsEyebrow: "Ne ölçüyoruz",
    signalsTitle: "Yüz puana dağılan dört boyut.",
    weight: "puan",
    faqEyebrow: "Sıkça sorulanlar",
    faqTitle: "Taramadan önce en çok sorulanlar.",
    relatedEyebrow: "Devamı",
    relatedTitle: "Boşlukları kapatmak için.",
    serviceLink: "E-ticaret danışmanlığı hizmeti",
    articlesLabel: "Dönüşüm ve e-ticaret yazıları",
  },
  en: {
    tools: "Tools",
    formTitle: "Scan your store",
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps, two to four minutes.",
    signalsEyebrow: "What we measure",
    signalsTitle: "Four dimensions across one hundred points.",
    weight: "points",
    faqEyebrow: "Frequently asked",
    faqTitle: "The questions asked most before a scan.",
    relatedEyebrow: "Next",
    relatedTitle: "To close the gaps.",
    serviceLink: "E-commerce consultancy service",
    articlesLabel: "Conversion and e-commerce articles",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const tool = getToolBySlug(DIAGNOO_SLUG, "tr");
  if (!tool) return {};
  const base = buildMetadata({
    title: tool.seo.title[loc],
    description: tool.seo.description[loc],
    paths: PATHS,
    locale: loc,
  });
  // Lansman kapısı (`published`, `tools.ts`): araç sırlar ve uzak migration
  // hazır olmadan gerçek veri üretemez. Sayfa iç doğrulama ve paylaşılan
  // bağlantı için erişilebilir kalır, ama arama motoruna ilan edilmez —
  // `follow: false` da bilinçli: sayfa henüz bir otorite kaynağı değil,
  // linklerini taratmanın karşılığı yok. Bayrak `true` olduğunda bu blok
  // düşer ve sayfa sitemap'le birlikte dizine girer.
  if (tool.published) return base;
  return { ...base, robots: { index: false, follow: false } };
}

export default async function DiagnooPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = COPY[loc];

  const tool = getToolBySlug(DIAGNOO_SLUG, "tr");
  if (!tool) notFound();

  // Üçgen çift yönlü link (ADR-030 deseni): araç → hizmet → yazı. Diagnoo
  // e-ticaret teşhisi olduğu için hizmet ayağı e-ticaret danışmanlığı,
  // yazı ayağı dönüşüm ve e-ticaret kümesi.
  const ecommerceService = SERVICES.find((s) => s.slug.tr === "e-ticaret");
  const relatedArticles = ARTICLES.filter(
    (a) => a.topic === "cro" || a.topic === "e-ticaret",
  ).slice(0, 3);

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
          faqLd(faqItems),
        ]}
      />

      {/* Araç hero — GEO sayfasıyla aynı hafif giriş: küçük breadcrumb +
          eyebrow + araç adı (h1) + bilgilendirici intro. */}
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

      {/* Giriş alanı — sayfanın birincil aksiyonu, intro'nun hemen altında.
          Başlık sr-only (GEO kararı): intro ile giriş arasına görsel bir
          başlık girmez, başlık düzeni korunur. */}
      <section aria-labelledby="scan-heading" className="ds-container pt-8 pb-16 md:pb-24">
        <div className="mx-auto max-w-prose-editorial">
          <h2 id="scan-heading" className="sr-only">
            {c.formTitle}
          </h2>
          <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10">
            <DiagnooTool locale={loc} tool={tool} />
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

      {/* Ölçülen dört boyut — ağırlıklar `computeHealthScore` ile birebir. */}
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

      {/* Devamı: hizmet + üç yazı, tek sütunda dikey. */}
      <section aria-labelledby="related-heading" className="ds-container">
        <div className="mx-auto max-w-prose-editorial py-16 border-t border-surface-2">
          <span className="eyebrow">{c.relatedEyebrow}</span>
          <h2 id="related-heading" className="typography-h2 text-ink-900 mt-4">
            {c.relatedTitle}
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {ecommerceService ? (
              <Link
                href={localeHref(`/hizmetler/${ecommerceService.slug[loc]}`, loc)}
                className="group block v2-surface border border-surface-2 rounded-xl p-6"
              >
                <span className="eyebrow-bare mono text-ink-500">
                  {c.serviceLink}
                </span>
                <h3 className="typography-h3 text-ink-900 mt-3">
                  {ecommerceService.name[loc]}
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
                {relatedArticles.map((a) => (
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
