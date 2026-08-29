import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { CaseMetricBand } from "@/components/marketing/case-metric-band";
import { CaseGallery, CaseHeroMedia } from "@/components/marketing/case-media";
import { CaseFlowDiagram } from "@/components/marketing/case-flow";
import { CaseCard } from "@/components/marketing/case-card";
import { ArticleCard } from "@/components/marketing/article-card";
import { getCaseBySlug, CASES } from "@/lib/content/cases";
import { getPillar } from "@/lib/content/pillars";
import { SERVICES } from "@/lib/content/services";
import { relatedArticlesForCase } from "@/lib/content/related-articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { TrackView } from "@/components/analytics/track-view";
import { caseViewEvent } from "@/lib/analytics/view-events";
import { localeHref } from "@/lib/i18n/locale-href";
import {
  breadcrumbLd,
  caseStudyLd,
  faqLd,
  organizationLd,
  webPageLd,
} from "@/lib/seo/json-ld";
import type { Locale } from "@/lib/content/types";

/**
 * hreflang çifti: segment de slug da locale başına farklı. Slug 2026-08-29'da
 * lokalize edildi — hreflang artık iki ayrı adresi eşler, self-canonical
 * her locale'de kendi slug'ını gösterir.
 */
function casePaths(c: CaseStudy) {
  return {
    tr: `/tr/vakalar/${c.slug.tr}`,
    en: `/en/case-studies/${c.slug.en}`,
  };
}

export async function generateStaticParams() {
  return CASES.flatMap((c) =>
    (["tr", "en"] as const).map((locale) => ({
      locale,
      slug: c.slug[locale],
    }))
  );
}

type CaseStudy = NonNullable<ReturnType<typeof getCaseBySlug>>;

/**
 * Arama başlığı — sayfada görünen "müşteri + başlık" bileşiminden ayrı
 * (`CaseStudyContent.seo`).
 *
 * Fallback `clientName — title`: alanı doldurulmamış vaka eski davranışını
 * korur. `seo.title` müşteri adını kendi içinde taşır — birleştirme
 * yapılmaz, çünkü 50 karakterlik bütçeyi yazan kişi yönetir.
 */
function seoTitle(c: CaseStudy, loc: Locale): string {
  return c.seo?.title?.[loc] ?? `${c.clientName[loc]} — ${c.title[loc]}`;
}

/** Fallback `lead`: 185-399 karakter olabilir, `seo.description` 140-160. */
function seoDescription(c: CaseStudy, loc: Locale): string {
  return c.seo?.description?.[loc] ?? c.lead[loc];
}

/**
 * Hero medya çözümleyici — 9 vakadan bir kısmında `heroMedia` hiç
 * doldurulmamış: sayfa başlıktan doğrudan koyu metrik bandına düşüyor,
 * görsel çapa yok. `heroMedia` varsa aynen kullanılır (dokunulmaz). Yoksa
 * kart kapağı (`cover`) hero konumuna taşınır — ikisi de aynı `CaseMedia`
 * şeklini taşıdığı için dönüşüm yalnız kopyalamadır; `alt`/`caption`
 * cover'dan olduğu gibi akar, `CaseHeroMedia`'nın FIG.00 altyazısı
 * `item.caption` üzerinden zaten koşullu kalır. `cases.ts` verisine
 * dokunmaz — yalnız render zamanında seçim yapar.
 */
export function resolveHeroMedia(
  c: Pick<CaseStudy, "heroMedia" | "cover">,
): CaseStudy["heroMedia"] {
  if (c.heroMedia) return c.heroMedia;
  if (!c.cover) return undefined;
  return { ...c.cover };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const c = getCaseBySlug(slug, loc);
  if (!c) return {};

  return buildMetadata({
    title: seoTitle(c, loc),
    description: seoDescription(c, loc),
    paths: casePaths(c),
    locale: loc,
  });
}

/**
 * Künyedeki disiplinlerin hizmet sayfası bağlantıları (denetim L-01).
 *
 * `serviceSlugs` TR slug tutar; URL locale'e göre `SERVICES` kaydından
 * çözülür — iki dilli yol elle kurulmaz. Bilinmeyen slug elenir; sessiz
 * kaybı `cases-content.test.ts` yakalar.
 */
function caseServiceLinks(slugs: string[] | undefined, loc: Locale) {
  if (!slugs) return [];
  const root = loc === "tr" ? "hizmetler" : "services";
  return slugs.flatMap((slug) => {
    const service = SERVICES.find((s) => s.slug.tr === slug);
    if (!service) return [];
    return [
      {
        name: service.name[loc],
        href: `/${loc}/${root}/${service.slug[loc]}`,
      },
    ];
  });
}

/**
 * Künye — başlığın sağ kolonu. Müşteri logosu + projenin ölçülebilir
 * kimliği (yıl, süre, disiplinler). Mono etiketler docs/04 "ölçü görünür"
 * kuralını taşır.
 */
function CaseFacts({
  c,
  loc,
  labels,
}: {
  c: NonNullable<ReturnType<typeof getCaseBySlug>>;
  loc: Locale;
  labels: {
    period: string;
    duration: string;
    weeks: string;
    months: string;
    services: string;
  };
}) {
  // Bir yılı aşan işler haftayla anlatılmaz: "65 hafta" okunmuyor, "15 ay"
  // okunuyor. Eşik 16 hafta (~4 ay); altı hafta, üstü ay.
  const long = c.durationWeeks >= 16;
  const durationValue = long
    ? `${Math.round(c.durationWeeks / 4.345)} ${labels.months}`
    : `${c.durationWeeks} ${labels.weeks}`;
  const serviceLinks = caseServiceLinks(c.serviceSlugs, loc);
  return (
    <div className="flex flex-col gap-6">
      {c.clientLogo ? (
        <Image
          src={c.clientLogo}
          alt={c.clientName[loc]}
          width={240}
          height={120}
          className="h-14 w-auto self-start object-contain md:h-16"
        />
      ) : null}
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
        {c.period ? (
          <div>
            <dt className="typography-label uppercase tracking-widest text-ink-500">
              {labels.period}
            </dt>
            <dd className="typography-body-sm mono mt-1 text-ink-700">
              {c.period[loc]}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="typography-label uppercase tracking-widest text-ink-500">
            {labels.duration}
          </dt>
          <dd className="typography-body-sm mono mt-1 text-ink-700">
            {durationValue}
          </dd>
        </div>
        {c.services ? (
          <div className="col-span-2">
            <dt className="typography-label uppercase tracking-widest text-ink-500">
              {labels.services}
            </dt>
            <dd className="typography-body-sm mt-1 text-ink-700">
              {/* Hizmet karşılığı yazılmış vakada künye hizmet sayfalarına
                  bağlanır; yazılmamışsa serbest metin listesi kalır. */}
              {serviceLinks.length > 0
                ? serviceLinks.map((s, i) => (
                    <span key={s.href}>
                      {i > 0 ? " · " : null}
                      <Link
                        href={s.href}
                        className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                      >
                        {s.name}
                      </Link>
                    </span>
                  ))
                : c.services[loc].join(" · ")}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

export default async function CaseDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = getCaseBySlug(slug, loc);
  if (!c) notFound();

  const pillar = getPillar(c.pillar);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  /**
   * Önce aynı pillar, sonra diğerleri. Katı pillar filtresi tek vakası olan
   * bir disiplinde bölümü tamamen boşaltıyordu (transform'da tek vaka var):
   * kanıt sayfası hiçbir yere link vermeden bitiyordu. Sıralama korunur,
   * boşluk diğer vakalarla doldurulur.
   */
  // Kimlik karşılaştırması TR slug üzerinden: locale'den bağımsız tek anahtar.
  const others = CASES.filter((x) => x.slug.tr !== c.slug.tr);
  const related = [
    ...others.filter((x) => x.pillar === c.pillar),
    ...others.filter((x) => x.pillar !== c.pillar),
  ].slice(0, 3);

  /**
   * Vaka → yazı köprüsü (denetim C-09, vaka yönü). Künyedeki hizmetleri
   * (`serviceSlugs`) konu eden yazılar — hiçbiri hedeflemezse blok hiç
   * basılmaz (`relatedArticlesForCase`).
   */
  const relatedArticles = relatedArticlesForCase(c.serviceSlugs);

  const tr = loc === "tr";

  /**
   * Şema görseli: kart kapağı önce gelir — 4:3 kırpımı için seçildiği için
   * merkezinde okunabilir kompozisyon garantili. Kapak yoksa sayfa başındaki
   * geniş görsele düşülür; video/youtube'da poster karesi kullanılır çünkü
   * `Article.image` durağan bir görsel bekler.
   */
  const ldImage =
    (c.cover?.type === "image" ? c.cover.src : c.cover?.poster) ??
    (c.heroMedia?.type === "image" ? c.heroMedia.src : c.heroMedia?.poster);

  const heroMedia = resolveHeroMedia(c);

  return (
    <>
      <TrackView event={caseViewEvent(c)} />
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: seoTitle(c, loc),
            description: seoDescription(c, loc),
            path: casePaths(c)[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            {
              name: tCommon("nav.caseStudies"),
              path: tr ? "/tr/vakalar" : "/en/case-studies",
            },
            // Son kırıntı yol taşımaz — mevcut sayfa kendine link olmaz
            // (`breadcrumbLd` sözleşmesi, seo-json-ld.test.ts).
            { name: c.clientName[loc] },
          ]),
          caseStudyLd({
            // `headline` görünen başlık kalır — şema sayfadaki içerikle
            // eşleşmek zorunda; kısaltma yalnız arama yüzeyine uygulanır.
            headline: c.title[loc],
            description: seoDescription(c, loc),
            path: casePaths(c)[loc],
            locale: loc,
            clientName: c.clientName[loc],
            clientSector: c.clientSector[loc],
            imagePath: ldImage,
          }),
          // Şema yalnız sayfada basılan sorulardan üretilir; `faqLd` boş
          // listede null döner ve `JsonLd` onu grafikten eler.
          faqLd(
            (c.faq ?? []).map((f) => ({
              question: f.question[loc],
              answer: f.answer[loc],
            })),
          ),
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.caseStudies"), href: "/vakalar" },
          { label: c.clientName[loc] },
        ]}
        eyebrow={`${c.clientSector[loc]} — ${pillar?.name[loc]}`}
        title={c.title[loc]}
        lede={c.lead[loc]}
        aside={
          <CaseFacts
            c={c}
            loc={loc}
            labels={{
              period: tr ? "Dönem" : "Period",
              duration: tr ? "Süre" : "Duration",
              weeks: tr ? "hafta" : "weeks",
              months: tr ? "ay" : "months",
              services: tr ? "Disiplinler" : "Disciplines",
            }}
          />
        }
      />

      {heroMedia ? <CaseHeroMedia item={heroMedia} locale={loc} /> : null}

      {/* Ölçüm bandı yalnız sayısal metriği olan vakada basılır — boş bir
          band "ölçmedik" demenin en gürültülü yoludur (docs/04 §10). */}
      {c.metrics.length > 0 ? (
        <CaseMetricBand
          eyebrow={tr ? "Ölçüm kaydı" : "Measured results"}
          metrics={c.metrics.map((m) => ({
            value: m.value[loc],
            label: m.label[loc],
            context: m.context?.[loc],
          }))}
        />
      ) : null}

      {/* Problem / Yaklaşım / Sonuç */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                01 — {tr ? "Problem" : "Challenge"}
              </span>
            </div>
            <ul className="md:col-span-9 space-y-4">
              {c.challenge[loc].map((p, i) => (
                <li
                  key={i}
                  className="typography-body-lg text-ink-700 max-w-prose-editorial flex gap-4"
                >
                  {/* Kırık ölçüm işareti — problem maddeleri "çalışmayan şey"dir */}
                  <svg
                    aria-hidden
                    viewBox="0 0 14 14"
                    width="14"
                    height="14"
                    className="mt-2.5 shrink-0 text-danger-500"
                  >
                    <path
                      d="M3 3l8 8M11 3l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-surface-2 my-16 md:my-24" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                02 — {tr ? "Yaklaşım" : "Approach"}
              </span>
            </div>
            <div className="md:col-span-9">
              <ol className="space-y-6">
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

              {/* Mekanizma diyagramı — yaklaşımın iş sırası tek bakışta */}
              {c.approachFlow ? (
                <CaseFlowDiagram
                  steps={c.approachFlow[loc]}
                  icons={c.approachFlowIcons}
                  label={tr ? "İş sırası" : "Sequence of work"}
                />
              ) : null}
            </div>
          </div>

          <hr className="border-surface-2 my-16 md:my-24" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                03 — {tr ? "Sonuç" : "Outcome"}
              </span>
            </div>
            <ul className="md:col-span-9 space-y-4">
              {c.outcome[loc].map((p, i) => (
                <li
                  key={i}
                  className="typography-body-lg text-ink-700 max-w-prose-editorial flex gap-4"
                >
                  {/* Onay işareti — sonuç maddeleri ölçülmüş kayıttır */}
                  <svg
                    aria-hidden
                    viewBox="0 0 14 14"
                    width="14"
                    height="14"
                    className="mt-2.5 shrink-0 text-success-500"
                  >
                    <path
                      d="M2.5 7.5 6 11l5.5-8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {c.media && c.media.length > 0 ? (
        <CaseGallery
          items={c.media}
          locale={loc}
          heading={tr ? "Saha kaydı" : "Field record"}
        />
      ) : null}

      {/* Testimonial */}
      {c.testimonial && (
        <section className="v2-surface-2">
          <div className="ds-container py-24 md:py-32">
            {/* Geniş kolon + h2 ölçeği: alıntı en fazla ~3 satırda kalır */}
            <figure className="mx-auto max-w-4xl text-center">
              <blockquote className="typography-h2 text-ink-900 leading-[1.3]">
                {c.testimonial.quote[loc]}
              </blockquote>
              <figcaption className="typography-label uppercase tracking-widest text-ink-500 mt-10">
                {c.testimonial.authorRole[loc]}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* SSS — vakanın kendi anlatısından çıkan sorular. Render
          `FaqAccordion`'da tekilleşti. Bölüm "Benzer vakalar"dan önce durur:
          sayfanın gezinti başlığı olmayan tek H2'si burada. */}
      {c.faq && c.faq.length > 0 ? (
        <section aria-labelledby="sss" className="v2-surface border-t border-surface-2">
          <div className="ds-container py-20 md:py-24">
            <h2 id="sss" className="typography-h2 scroll-mt-32 text-ink-900">
              {tr ? "Sık sorulan sorular" : "Frequently asked questions"}
            </h2>
            <FaqAccordion
              surface="case"
              className="mt-10 max-w-prose-editorial"
              items={c.faq.map((f) => ({
                question: f.question[loc],
                answer: f.answer[loc],
              }))}
            />
          </div>
        </section>
      ) : null}

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-surface-2">
          <div className="ds-container py-20 md:py-24">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="typography-h2 text-ink-900">
                {tr ? "Benzer vakalar" : "Related cases"}
              </h2>
              <Link
                href={localeHref("/vakalar", loc)}
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
                <CaseCard key={r.slug.tr} c={r} locale={loc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* İlgili yazılar — künyedeki hizmetleri konu eden yazılar (C-09) */}
      {relatedArticles.length > 0 && (
        <section
          aria-labelledby="related-articles-heading"
          className="v2-surface border-t border-surface-2"
        >
          <div className="ds-container py-20 md:py-24">
            <h2
              id="related-articles-heading"
              className="typography-h2 text-ink-900"
            >
              {tr ? "İlgili yazılar" : "Related articles"}
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug[loc]} article={a} locale={loc} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCallout locale={loc} />
    </>
  );
}
