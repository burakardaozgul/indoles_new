import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { DiagnooTool } from "@/components/tools/diagnoo-tool";
import { DIAGNOO_TOOL } from "@/lib/content/tools";
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
import type { Locale, ServiceContent } from "@/lib/content/types";

/**
 * Diagnoo araç sayfası — `/araclar` ailesinin ikinci elemanı.
 *
 * Kabuk GEO Görünürlük Denetleyicisi sayfasıyla BİREBİR (Faz 2 Görev 3): aynı
 * 760px kolon (`max-w-tool`), aynı bölüm sırası (hero + üç adım + sinyaller +
 * SSS + devamı + JSON-LD grafiği), aynı bölüm ritmi. İki araç aynı kalıpta
 * okunmalı, ikinci araç kendi düzenini icat etmemeli. Metin kaynağı
 * `tools.ts`; burada yalnız bölüm başlıkları yaşar.
 *
 * Hero'yu ve giriş alanını bu dosya BASMAZ: `DiagnooTool` `ToolHero`yu kendi
 * aşamasına göre (`full` / `compact`) render eder ve form da o akışın içinde
 * durur — GEO'da `GeoTool`un `ScanBar` ile yaptığının aynısı. `footnote` de
 * GEO ile aynı şekilde sayfada BASILMAZ: iddia dipnotu SSS'te yaşıyor, hero
 * altına ikinci bir kapsam paragrafı girmez.
 */
const PATHS = {
  tr: "/tr/araclar/diagnoo",
  en: "/en/tools/diagnoo",
};

/** Sayfa chrome'u — araca özgü metin `tools.ts`'te; bunlar bölüm başlıkları. */
const COPY = {
  tr: {
    tools: "Araçlar",
    stepsEyebrow: "Nasıl çalışır",
    stepsTitle: "Üç adım, iki ile dört dakika.",
    signalsEyebrow: "Ne ölçüyoruz",
    signalsTitle: "Yüz puana dağılan dört boyut.",
    weight: "puan",
    faqEyebrow: "Sıkça sorulanlar",
    faqTitle: "Taramadan önce en çok sorulanlar.",
    relatedEyebrow: "Devamı",
    relatedTitle: "Boşlukları kapatmak için.",
    servicesLabel: "Danışmanlık hizmetleri",
    articlesLabel: "Dönüşüm ve e-ticaret yazıları",
  },
  en: {
    tools: "Tools",
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps, two to four minutes.",
    signalsEyebrow: "What we measure",
    signalsTitle: "Four dimensions across one hundred points.",
    weight: "points",
    faqEyebrow: "Frequently asked",
    faqTitle: "The questions asked most before a scan.",
    relatedEyebrow: "Next",
    relatedTitle: "To close the gaps.",
    servicesLabel: "Consultancy services",
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
  const tool = DIAGNOO_TOOL;
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

  const tool = DIAGNOO_TOOL;

  // Üçgen çift yönlü link (ADR-030 deseni): araç → hizmet → yazı. Hizmet
  // ayağı artık `tools.ts`teki `relatedServices` kaydından okunur (Faz 2
  // Görev 1) — hizmet sayfasındaki araç bloğu da AYNI diziyi okuyor, iki yön
  // tek kaynaktan türediği için ayrışamaz. Sıra kaydın sırasıdır;
  // `SERVICES` dizisinin sırası değil.
  const relatedServices = tool.relatedServices
    .map((slug) => SERVICES.find((s) => s.slug.tr === slug))
    .filter((s): s is ServiceContent => s !== undefined);
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

      {/* Araç hero + giriş — GEO ile aynı kabuk (`geo-gorunurluk-denetleyicisi`):
          hero, giriş formu, ilerleme ve rapor tek adada (`DiagnooTool`). Sayfa
          geçişi yok: ada 202 alınca URL'i `history.replaceState` ile rapor
          adresine çeker. */}
      <section aria-labelledby="tool-h1" className="tool-hero">
        <div className="ds-container">
          <div className="mx-auto max-w-tool">
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
            <DiagnooTool locale={loc} tool={tool} />
          </div>
        </div>
      </section>

      {/* Nasıl çalışır — 3 adım, tek sütunda dikey liste. */}
      <section aria-labelledby="steps-heading" className="ds-container">
        <div className="mx-auto max-w-tool pt-24 pb-16 border-t border-surface-2">
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
        <div className="mx-auto max-w-tool py-16 border-t border-surface-2">
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
        <div className="mx-auto max-w-tool py-16 border-t border-surface-2">
          <span className="eyebrow">{c.faqEyebrow}</span>
          <h2 id="faq-heading" className="typography-h2 text-ink-900 mt-4">
            {c.faqTitle}
          </h2>
          <FaqAccordion items={faqItems} surface="tool" className="mt-8" />
        </div>
      </section>

      {/* Devamı: üç hizmet + üç yazı, tek sütunda iki kart. */}
      <section aria-labelledby="related-heading" className="ds-container">
        <div className="mx-auto max-w-tool py-16 border-t border-surface-2">
          <span className="eyebrow">{c.relatedEyebrow}</span>
          <h2 id="related-heading" className="typography-h2 text-ink-900 mt-4">
            {c.relatedTitle}
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {/* Hizmet ayağı GEO'da tek kart tek hizmettir; Diagnoo üç hizmete
                bağlanıyor (`relatedServices`), o yüzden aynı kart yazı
                listesiyle aynı dizilime düşer: bir mono etiket + bölmeli
                liste. Üç kez tekrarlanan blok-link kartı hem etiketi hem
                hizmet adını iki kez okuturdu. */}
            {relatedServices.length > 0 ? (
              <div className="v2-surface border border-surface-2 rounded-xl p-6">
                <span className="eyebrow-bare mono text-ink-500">
                  {c.servicesLabel}
                </span>
                {/* Dikey ritim `<li>`de DEĞİL `<a>`de: dokunma hedefi bağlantının
                    KENDİSİDİR, `<li>`nin padding'i hedefe sayılmaz (WCAG 2.2 AA
                    SC 2.5.8). Hizmet adları tek satır — `py-3` ile satır 49 px'e
                    çıkar; padding dışarıda kalsaydı hedef 26 px olurdu (2026-09-03
                    `diagnoo-tool-responsive` ölçümü). `first:pt-0`/`last:pb-0`
                    kırpması bu yüzden düştü, üstteki boşluk `mt-1`den geliyor. */}
                <ul className="mt-1 divide-y divide-surface-2">
                  {relatedServices.map((service) => (
                    <li key={service.slug.tr}>
                      <Link
                        href={localeHref(`/hizmetler/${service.slug[loc]}`, loc)}
                        className="group flex items-start justify-between gap-4 py-3"
                      >
                        <span className="typography-body-md text-ink-800 group-hover:text-ink-900">
                          {service.name[loc]}
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
            ) : null}

            <div className="v2-surface border border-surface-2 rounded-xl p-6">
              <span className="eyebrow-bare mono text-ink-500">
                {c.articlesLabel}
              </span>
              {/* Padding yukarıdakiyle aynı gerekçeyle bağlantının içinde:
                  başlıklar bugün mobilde iki satıra sarıp hedefi tesadüfen 44
                  px'in üstüne çıkarıyor, ama kısa başlıklı bir yazı eklendiği
                  gün sessizce düşerdi. */}
              <ul className="mt-1 divide-y divide-surface-2">
                {relatedArticles.map((a) => (
                  <li key={a.slug[loc]}>
                    <Link
                      href={localeHref(`/yazilar/${a.slug[loc]}`, loc)}
                      className="group flex items-start justify-between gap-4 py-3"
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
