import Link from "next/link";
import {
  Activity,
  BookOpen,
  ChartNoAxesColumn,
  Compass,
  FileText,
  GraduationCap,
  KeyRound,
  Package,
  Settings2,
} from "lucide-react";
import { PlatformBadge } from "@/lib/design/platform-icons";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { ScopeColumns } from "@/components/marketing/scope-columns";
import { ServicePricing } from "@/components/marketing/service-pricing";
import { ServiceCaseProof } from "@/components/marketing/service-case-proof";
import { ServiceIllustration } from "@/components/marketing/service-illustration";
import { PILLARS } from "@/lib/content/pillars";
import { PACKAGES } from "@/lib/content/packages";
import { CASES } from "@/lib/content/cases";
import { ARTICLES } from "@/lib/content/articles";
import { TOPICS } from "@/lib/content/topics";
import {
  SERVICE_ORDER,
  getService,
  serviceOrderIndex,
} from "@/lib/content/services";
import type {
  ArticleContent,
  CaseStudyContent,
  Locale,
  Pillar,
  ServiceContent,
} from "@/lib/content/types";
import { JsonLd } from "@/lib/seo/JsonLd";
import { TrackView } from "@/components/analytics/track-view";
import { serviceViewEvent } from "@/lib/analytics/view-events";
import {
  breadcrumbLd,
  faqLd,
  organizationLd,
  serviceLd,
  webPageLd,
} from "@/lib/seo/json-ld";

const COPY = {
  tr: {
    servicesRoot: "hizmetler",
    packagesRoot: "paketler",
    casesRoot: "vakalar",
    articlesRoot: "yazilar",
    services: "Hizmetler",
    service: "Hizmet",
    diagram: "Şema",
    platforms: "Çalıştığımız platformlar",
    signals: "Tanıdık mı?",
    signalsTitle: "Bu hizmet şu üç durumda devreye girer.",
    scope: "Kapsam",
    scopeTitle: "Neyi kapsar, neyi kapsamaz.",
    method: "Nasıl çalışırız",
    methodTitle: "Dört adım, her adımda elinize geçen bir şey.",
    output: "Elinize geçen",
    deliverables: "Teslim listesi",
    deliverablesTitle: "Çalışma bitince elinizde ne olur.",
    faq: "Sıkça sorulanlar",
    faqTitle: "Karar vermeden önce en çok sorulanlar.",
    related: "Devamı",
    relatedPackages: "Bu hizmete giriş paketi",
    relatedCase: "İlgili vaka çalışması",
    caseProof: "Bu işin sonucu",
    caseProofSource: "Kaynak",
    relatedServices: "Komşu hizmetler",
    relatedArticles: "İlgili yazılar",
    bookCall: "Görüşme planla",
    viewPackage: "Paketi incele",
    readCase: "Vakayı oku",
    weeks: "hafta",
    kinds: {
      document: "Döküman",
      system: "Sistem",
      training: "Eğitim",
      access: "Erişim",
    },
  },
  en: {
    servicesRoot: "services",
    packagesRoot: "packages",
    casesRoot: "case-studies",
    articlesRoot: "articles",
    services: "Services",
    service: "Service",
    diagram: "Diagram",
    platforms: "Platforms and tools we work with",
    signals: "Sound familiar?",
    signalsTitle: "This service steps in when one of these is true.",
    scope: "Scope",
    scopeTitle: "What it covers, and what it does not.",
    method: "How we work",
    methodTitle: "Four steps, each leaving something in your hands.",
    output: "You get",
    deliverables: "Deliverables",
    deliverablesTitle: "What you hold when the work is done.",
    faq: "Frequently asked",
    faqTitle: "The questions asked most before deciding.",
    related: "Next",
    relatedPackages: "The entry package for this service",
    relatedCase: "Related case study",
    caseProof: "What the work produced",
    caseProofSource: "Source",
    relatedServices: "Neighbouring services",
    relatedArticles: "Related reading",
    bookCall: "Book a call",
    viewPackage: "View the package",
    readCase: "Read the case",
    weeks: "weeks",
    kinds: {
      document: "Document",
      system: "System",
      training: "Training",
      access: "Access",
    },
  },
} as const;

/** Mono etiketli küçük rozet — teslim türleri ve yöntem çıktıları. */
function Chip({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border border-surface-3 typography-label text-ink-500 whitespace-nowrap shrink-0">
      {icon}
      {children}
    </span>
  );
}

/**
 * Teslim türünün ikonu — tür gerçek bir kategori, ikon onu kelimeden önce
 * okunur kılıyor. Stroke 1.5: `service-illustration.tsx` çizgi diliyle aynı.
 */
const KIND_ICON = {
  document: FileText,
  system: Settings2,
  training: GraduationCap,
  access: KeyRound,
} as const;

/**
 * Hizmete ait yazılar — konu ekseninden (ADR-021).
 *
 * Eski kural `a.category === service.pillar` idi ve yanlıştı: 16 yazının
 * 16'sı `category: "growth"` (ADR-021 bağlam tablosu). Sonuç, beş growth
 * hizmetinin aynı üç alakasız yazıyı göstermesi — CRO sayfası marka
 * hikâyesi yazısına link veriyordu — ve yedi transform/build hizmetinde
 * bloğun hiç basılmaması. Pillar bir yazı ekseni değil; ADR-021 zaten
 * `topics.ts`'e her kümenin **tek hedef hizmet sayfasını** (`serviceSlug`)
 * yazmıştı, kodda okunmuyordu. Artık okunuyor.
 *
 * Bir hizmete birden fazla konu bağlanabilir (`performans-pazarlama` hem
 * kendi kümesini hem `musteri-elde-tutma`yı hedefler); hepsi havuza girer,
 * en yeni üçü basılır.
 *
 * Yazı detayındaki kalıptan (`yazilar/[slug]/page.tsx`) bilinçli sapma:
 * orada konu üç yazıyı doldurmazsa kalan **en yeni yazılarla tamamlanıyor**.
 * Burada doldurma yok. Yazı okuyan okur "şunu da oku" önerisine toleranslı;
 * hizmet sayfasındaki blok ise satış bağlamında bir yetkinlik iddiası —
 * CRO sayfasında konuyla ilgisiz bir yazı göstermek iddianın kendisini
 * çürütür. Hizmete bağlı konu ya da yazı yoksa `ServiceDetail` bloğu hiç
 * basmaz (`relatedArticles.length > 0` koşulu).
 *
 * Bugünkü içerikle kapsama: `cro` 1, `e-ticaret` 1, `ui-ux-tasarim` 1,
 * `marka-stratejisi` 3, `performans-pazarlama` 3 yazı; `ai-danismanlik`
 * ve altı transform/build hizmeti 0 — `yapay-zeka` kümesinde henüz yazı
 * yok (ADR-021'in işaret ettiği içerik boşluğu), diğerlerinin konusu yok.
 */
export function relatedArticlesForService(
  serviceSlugTr: string,
): ArticleContent[] {
  const topicIds = TOPICS.filter((t) => t.serviceSlug === serviceSlugTr).map(
    (t) => t.id,
  );
  if (topicIds.length === 0) return [];

  return ARTICLES.filter((a) => topicIds.includes(a.topic))
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
}

/**
 * İlgili vaka çalışması — künye (`serviceSlugs`) birincil, pillar fallback
 * (denetim bulgusu C-03).
 *
 * Eski kural `CASES.find((c) => c.pillar === service.pillar)` idi: dizideki
 * ilk pillar eşleşmesini alıyordu, künyeye hiç bakmıyordu. Sonuç, beş growth
 * hizmetinin tamamının aynı vakayı (SOYLU AVM) göstermesiydi — CRO sayfası
 * bile künyesinde `cro` hiç geçmeyen bir vakaya işaret ediyordu.
 *
 * `serviceSlugs` tam olarak bunun için var: bir vakanın anlatısında gerçekten
 * karşılığı olan hizmetleri taşır (bkz. `types.ts`
 * `CaseStudyContent.serviceSlugs`) ve bilinçli olarak pillar sınırını
 * gözetmez — tek bir vaka birden çok pillar'daki hizmete karşılık gelebilir
 * (ör. MKComputer `build` pillar'ında durur ama künyesinde `e-ticaret` ve
 * `is-otomasyonlari` geçer, ikisi de `growth`/`transform` hizmetidir). Bu
 * yüzden eşleme önce künye üzerinden aranır; pillar eşitliği aranmaz.
 *
 * Pillar eşlemesi yalnız künyede bu hizmeti taşıyan hiçbir vaka yoksa
 * devreye giren fallback'tir (bugünkü içerikle: dijital-donusum, is-zekasi,
 * isletme-muhendisligi, teknoloji-ve-altyapi — künyesinde bu dört hizmeti
 * taşıyan vaka henüz yok). Fallback kaldırılmaz: kaldırılırsa bu dört hizmet
 * kanıt şeridini tümden kaybeder.
 *
 * Birden fazla vaka aynı hizmeti künyesinde taşırsa (ör. `performans-
 * pazarlama` beş vakada geçer) dizideki ilk eşleşme seçilir — `CASES`
 * sırası sabit olduğu için sonuç build'ler arasında değişmez, rastgelelik
 * yoktur.
 */
export function relatedCaseForService(
  serviceSlugTr: string,
  pillar: Pillar,
): CaseStudyContent | undefined {
  return (
    CASES.find((c) => c.serviceSlugs?.includes(serviceSlugTr)) ??
    CASES.find((c) => c.pillar === pillar)
  );
}

/**
 * Hizmet detay şablonu — sekiz blok.
 *
 * Tek sesli: persona bileşenleri bilinçli olarak kullanılmıyor (docs/03 §1,
 * ADR-014 — hizmet detay orta ton, tek versiyon).
 *
 * Hero, `V2PageHeader`ın "lede sağ sütunda, end hizalı" düzenini kullanmaz:
 * o düzen bu sayfada başlık, breadcrumb ve açıklamayı birbirinden koparıyordu
 * (Burak, 2026-08-20). Burada okuma tek kolondan akar — breadcrumb, eyebrow,
 * başlık, lede, CTA — ve illüstrasyon sağda "teşhis föyü" olarak durur:
 * köşe işaretli çerçeve, mono altyazı. Föy, sayfanın tek imza öğesidir.
 *
 * Başlık hiyerarşisi: tek `h1`, blok başlıkları `h2`, kart başlıkları `h3`
 * ve `h4`. Atlama yok — audit script'i doğruluyor.
 */
export function ServiceDetail({
  service,
  locale,
}: {
  service: ServiceContent;
  locale: Locale;
}) {
  const t = COPY[locale];

  const pillar = PILLARS.find((p) => p.key === service.pillar)!;
  const servicesRoot = `/${locale}/${t.servicesRoot}`;
  const paths = {
    tr: `/tr/hizmetler/${service.slug.tr}`,
    en: `/en/services/${service.slug.en}`,
  };

  /** Açıkça belirtilmemişse pillar eşlemesine düşülür. */
  const relatedPackages =
    service.relatedPackages.length > 0
      ? PACKAGES.filter((p) => service.relatedPackages.includes(p.slug.tr))
      : PACKAGES.filter((p) => p.pillar === service.pillar);

  const relatedCase = relatedCaseForService(service.slug.tr, service.pillar);

  /**
   * Vakanın ölçülmüş sonucundan en fazla üçü hizmet sayfasının gövdesine
   * girer (denetim bulgusu K-02). Metriksiz vaka — dizi boş olabilir —
   * eski metin bağlantılı hâle düşer; rakam uydurulmaz (ADR-018).
   */
  const caseProofMetrics = (relatedCase?.metrics ?? []).slice(0, 3);

  /** Komşu hizmetler — henüz yazılmamış olanlar elenir (404 önlenir). */
  const siblings = service.relatedServices
    .map((slug) => getService(slug, "tr"))
    .filter((s): s is ServiceContent => s !== null);

  const relatedArticles = relatedArticlesForService(service.slug.tr);

  const orderIndex = serviceOrderIndex(service.slug.tr);
  const displayNo = String(orderIndex + 1).padStart(2, "0");

  return (
    <>
      <TrackView event={serviceViewEvent(service, locale)} />
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: service.name[locale],
            description: service.seo.description[locale],
            path: paths[locale],
            locale,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${locale}` },
            { name: t.services, path: servicesRoot },
            { name: pillar.name[locale], path: `${servicesRoot}/${pillar.key}` },
            { name: service.name[locale] },
          ]),
          serviceLd({
            name: service.name[locale],
            description: service.seo.description[locale],
            serviceType: service.seo.title[locale],
            path: paths[locale],
            offers: [
              ...relatedPackages.map((p) => ({
                name: p.name[locale],
                priceTRY: p.pricing.TRY,
                durationWeeks: p.durationWeeks,
                path: `/${locale}/${t.packagesRoot}/${p.slug[locale]}`,
              })),
              /* Aylık planların Offer URL'i hizmetin kendisidir — planların
                 ayrı sayfası yok, tablo bu sayfada yaşar. */
              ...(service.retainerPlans?.plans ?? []).map((p) => ({
                name: `${service.name[locale]} — ${p.name[locale]}`,
                priceTRY: p.monthlyTRY,
                monthly: true,
                path: paths[locale],
              })),
            ],
          }),
          faqLd(
            service.faq.map((f) => ({
              question: f.question[locale],
              answer: f.answer[locale],
            })),
          ),
        ]}
      />

      {/* 01 — Hero: tek kolon okuma akışı + teşhis föyü.
          Üst boşluk sabit chrome'u (topbar 36 + nav 84 = 120px) elle hesaba
          katar: breadcrumb nav'ın 45px altında, sola yaslı (Burak, 2026-08-20).
          Masaüstünde section 36px'te başlar; pt-32 (128px) breadcrumb'ı
          y≈164'e koyar → nav altı boşluk ≈ 44px. */}
      <section className="relative z-20 border-b border-surface-2 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="ds-container">
          <nav
            aria-label="Breadcrumb"
            className="typography-body-sm text-ink-500"
          >
            <ol className="flex flex-wrap items-center gap-3">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-ink-700 hover:text-ink-900 transition-colors"
                >
                  INDOLES
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-500/60">
                /
              </li>
              <li>
                <Link
                  href={servicesRoot}
                  className="text-ink-700 hover:text-ink-900 transition-colors"
                >
                  {t.services}
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-500/60">
                /
              </li>
              <li>
                <span aria-current="page" className="text-ink-900 font-medium">
                  {service.name[locale]}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <span className="typography-label uppercase tracking-widest text-brand-700">
                {pillar.name[locale]} · {t.service} {displayNo} /{" "}
                {SERVICE_ORDER.length}
              </span>
              <h1 className="typography-display-lg mt-5 text-ink-900 max-w-[16ch]">
                {service.name[locale]}
              </h1>
              <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
                {service.lede[locale]}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <PopupCTAButton
                  source="service-detail"
                  pillar={service.pillar}
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-md"
                >
                  {t.bookCall}
                </PopupCTAButton>
                {relatedPackages[0] ? (
                  <Link
                    href={`/${locale}/${t.packagesRoot}/${relatedPackages[0].slug[locale]}`}
                    className="inline-flex items-center h-12 px-6 rounded-full border border-surface-3 text-ink-900 hover:bg-surface-1/60 transition-colors typography-body-md"
                  >
                    {t.viewPackage}
                  </Link>
                ) : null}
              </div>

              {service.platforms && service.platforms.length > 0 ? (
                <div className="mt-12">
                  <span className="typography-label uppercase tracking-widest text-ink-500">
                    {t.platforms}
                  </span>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {service.platforms.map((name) => (
                      <li key={name}>
                        <PlatformBadge name={name} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Teşhis föyü — imza öğesi */}
            <figure className="lg:col-span-5 relative v2-surface border border-surface-2 rounded-2xl p-6 md:p-8">
              <span
                aria-hidden="true"
                className="absolute top-3 left-3 w-3 h-3 border-t border-l border-surface-3"
              />
              <span
                aria-hidden="true"
                className="absolute top-3 right-3 w-3 h-3 border-t border-r border-surface-3"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-surface-3"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-surface-3"
              />
              <div className="aspect-[200/140]">
                <ServiceIllustration index={orderIndex} />
              </div>
              <figcaption className="mt-5 pt-4 border-t border-surface-2 flex items-center justify-between typography-label text-ink-500">
                <span>
                  {t.diagram} — {service.name[locale]}
                </span>
                <span className="tabular">
                  {displayNo}/{SERVICE_ORDER.length}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 02 — Tanıdık mı: 3 durum kartı */}
      <section
        aria-labelledby="signals-heading"
        className="v2-surface border-b border-surface-2"
      >
        <div className="ds-container py-20 md:py-28">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {t.signals}
          </span>
          <h2
            id="signals-heading"
            className="typography-h2 mt-4 max-w-[26ch] text-ink-900"
          >
            {t.signalsTitle}
          </h2>
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {service.signals[locale].map((signal) => (
              <li
                key={signal}
                className="rounded-2xl border border-surface-2 bg-paper p-7 md:p-8 border-l-4 border-l-brand-500"
              >
                <Activity
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.5}
                  className="text-brand-700"
                />
                <p className="typography-h3 text-ink-900 mt-4">{signal}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — Kapsam */}
      <section
        aria-labelledby="scope-heading"
        className="border-b border-surface-2"
      >
        <div className="ds-container py-20 md:py-28">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {t.scope}
          </span>
          <h2
            id="scope-heading"
            className="typography-h2 mt-4 mb-12 max-w-[22ch] text-ink-900"
          >
            {t.scopeTitle}
          </h2>
          <ScopeColumns
            includes={service.scope.includes.map((item) => ({
              title: item.title[locale],
              description: item.description[locale],
            }))}
            excludes={service.scope.excludes[locale]}
            locale={locale}
          />
        </div>
      </section>

      {/* 04 — Yöntem: gerçek sıra, numara burada anlamlı */}
      <section
        aria-labelledby="method-heading"
        className="v2-surface border-b border-surface-2"
      >
        <div className="ds-container py-20 md:py-28">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {t.method}
          </span>
          <h2
            id="method-heading"
            className="typography-h2 mt-4 max-w-[26ch] text-ink-900"
          >
            {t.methodTitle}
          </h2>

          <ol className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.method.map((m) => (
              <li
                key={m.step}
                className="bg-paper border border-surface-2 rounded-2xl p-7 md:p-9 flex flex-col"
              >
                <div className="flex items-baseline gap-4">
                  <span className="typography-h2 text-brand-300 tabular">
                    {m.step}
                  </span>
                  <h3 className="typography-h3 text-ink-900">
                    {m.title[locale]}
                  </h3>
                </div>
                <p className="typography-body-md text-ink-700 mt-4">
                  {m.description[locale]}
                </p>
                <div className="mt-6 pt-5 border-t border-surface-2 flex items-start gap-3">
                  <Chip>{t.output}</Chip>
                  <p className="typography-body-sm text-ink-700 pt-0.5">
                    {m.output[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 — Teslim listesi */}
      <section
        aria-labelledby="deliverables-heading"
        className="border-b border-surface-2"
      >
        <div className="ds-container py-20 md:py-28">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {t.deliverables}
          </span>
          <h2
            id="deliverables-heading"
            className="typography-h2 mt-4 max-w-[22ch] text-ink-900"
          >
            {t.deliverablesTitle}
          </h2>
          <dl className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.deliverables.map((d) => (
              <div
                key={d.title[locale]}
                className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <dt className="typography-h3 text-ink-900">
                    {d.title[locale]}
                  </dt>
                  <Chip
                    icon={(() => {
                      const Icon = KIND_ICON[d.kind];
                      return (
                        <Icon aria-hidden="true" size={12} strokeWidth={1.5} />
                      );
                    })()}
                  >
                    {t.kinds[d.kind]}
                  </Chip>
                </div>
                <dd className="typography-body-sm text-ink-700 mt-3">
                  {d.description[locale]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 05b — Aylık yönetim planları (yalnız veri giren hizmette) */}
      {service.retainerPlans ? (
        <ServicePricing
          retainerPlans={service.retainerPlans}
          locale={locale}
        />
      ) : null}

      {/* 06 — SSS */}
      <section
        aria-labelledby="faq-heading"
        className="v2-surface border-b border-surface-2"
      >
        <div className="ds-container py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {t.faq}
            </span>
            <h2
              id="faq-heading"
              className="typography-h2 mt-4 max-w-[16ch] text-ink-900"
            >
              {t.faqTitle}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion
              surface="service"
              items={service.faq.map((f) => ({
                question: f.question[locale],
                answer: f.answer[locale],
              }))}
            />
          </div>
        </div>
      </section>

      {/* 07 — Devamı */}
      <section
        aria-labelledby="related-heading"
        className="border-b border-surface-2"
      >
        <div className="ds-container py-20 md:py-28">
          <h2
            id="related-heading"
            className="typography-label uppercase tracking-widest text-ink-500"
          >
            {t.related}
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {relatedCase && caseProofMetrics.length > 0 ? (
              <ServiceCaseProof
                heading={t.caseProof}
                lead={relatedCase.lead[locale]}
                sourceLabel={t.caseProofSource}
                clientName={relatedCase.clientName[locale]}
                caseTitle={relatedCase.title[locale]}
                href={`/${locale}/${t.casesRoot}/${relatedCase.slug[locale]}`}
                metrics={caseProofMetrics.map((m) => ({
                  value: m.value[locale],
                  label: m.label[locale],
                  ...(m.context ? { context: m.context[locale] } : {}),
                }))}
              />
            ) : null}

            {relatedPackages.length > 0 ? (
              <div>
                <h3 className="typography-h3 text-ink-900 flex items-center gap-2.5">
                  <Package aria-hidden="true" size={18} strokeWidth={1.5} className="text-brand-700 shrink-0" />
                  {t.relatedPackages}
                </h3>
                <ul className="mt-6 border-t border-surface-2">
                  {relatedPackages.map((p) => (
                    <li key={p.slug.tr} className="border-b border-surface-2 py-5">
                      <Link
                        href={`/${locale}/${t.packagesRoot}/${p.slug[locale]}`}
                        className="flex items-baseline justify-between gap-4 group"
                      >
                        <span className="typography-body-lg text-ink-900 underline underline-offset-4 decoration-brand-300 group-hover:decoration-brand-500">
                          {p.name[locale]}
                        </span>
                        <span className="typography-caption text-ink-500 shrink-0">
                          {p.durationWeeks} {t.weeks}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {siblings.length > 0 ? (
              <div>
                <h3 className="typography-h3 text-ink-900 flex items-center gap-2.5">
                  <Compass aria-hidden="true" size={18} strokeWidth={1.5} className="text-brand-700 shrink-0" />
                  {t.relatedServices}
                </h3>
                <ul className="mt-6 border-t border-surface-2">
                  {siblings.map((s) => (
                    <li key={s.slug.tr} className="border-b border-surface-2 py-5">
                      <Link
                        href={`/${locale}/${t.servicesRoot}/${s.slug[locale]}`}
                        className="typography-body-lg text-ink-900 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                      >
                        {s.name[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {relatedCase && caseProofMetrics.length === 0 ? (
              <div>
                <h3 className="typography-h3 text-ink-900 flex items-center gap-2.5">
                  <ChartNoAxesColumn aria-hidden="true" size={18} strokeWidth={1.5} className="text-brand-700 shrink-0" />{t.relatedCase}</h3>
                <p className="typography-body-md text-ink-700 mt-6 max-w-prose-editorial">
                  {relatedCase.lead[locale]}
                </p>
                <Link
                  href={`/${locale}/${t.casesRoot}/${relatedCase.slug[locale]}`}
                  className="inline-flex items-center gap-2 mt-6 text-brand-700 typography-body-md"
                >
                  <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                    {t.readCase}
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : null}

            {relatedArticles.length > 0 ? (
              <div>
                <h3 className="typography-h3 text-ink-900 flex items-center gap-2.5">
                  <BookOpen aria-hidden="true" size={18} strokeWidth={1.5} className="text-brand-700 shrink-0" />
                  {t.relatedArticles}
                </h3>
                <ul className="mt-6 border-t border-surface-2">
                  {relatedArticles.map((a) => (
                    <li key={a.slug.tr} className="border-b border-surface-2 py-5">
                      <Link
                        href={`/${locale}/${t.articlesRoot}/${a.slug[locale]}`}
                        className="typography-body-md text-ink-900 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                      >
                        {a.title[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 08 — CTA */}
      <ContactCallout locale={locale} />
    </>
  );
}
