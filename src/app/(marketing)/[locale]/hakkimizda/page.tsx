import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { MethodSection } from "@/components/marketing/method-section";
import { VisionSection } from "@/components/marketing/vision-section";
import {
  BOOKABLE_CONSULTANTS,
  CONSULTANTS_ORDERED,
} from "@/lib/content/consultants";
import { COMPANY } from "@/lib/content/company";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbLd, organizationLd, webPageLd } from "@/lib/seo/json-ld";
import type { Locale } from "@/lib/content/types";


const PATHS = { tr: "/tr/hakkimizda", en: "/en/about" };

/**
 * TR başlığı kelime hedefi taşımıyor: "iş geliştirme danışmanlığı" ana sayfa
 * ve `/tr/hizmetler` title'larıyla birlikte üç TR sayfasını aynı sorguya
 * sokuyordu (denetim C-05, strateji §2 cannibalization yasağı). Kelimenin tek
 * hedef sayfası `/tr/hizmetler`. Bu sayfanın işi kimliği anlatmak: başlık
 * görünen H1 ("İki eksen. Bir disiplin.") ile aynı çerçeveyi kurar ve EN'deki
 * "About — one discipline, two axes" ile aynı niyeti taşır. Gövdedeki şirket
 * tanımı bilinçli olarak değişmedi.
 */
const META = {
  tr: {
    title: "Hakkımızda — iki eksen, bir disiplin",
    description:
      "INDOLES, sanayi şirketlerinin teknoloji ihtiyacıyla ticaret markalarının büyüme ihtiyacını tek disiplinde çözer. Teşhis olmadan reçete yok, sahiplikli teslim.",
  },
  en: {
    title: "About — one discipline, two axes",
    description:
      "INDOLES answers industrial technology needs and commerce growth needs inside one consulting discipline. No prescription without diagnosis, delivery you inherit.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return buildMetadata({
    title: META[loc].title,
    description: META[loc].description,
    paths: PATHS,
    locale: loc,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  /**
   * Değerler süreç değil iddiadır — sıralı bir akış anlatmazlar.
   * `01…04` mono indeksleri okura yanlış bir okuma sırası dayatıyordu; yerine
   * her değerin `key`ini karşılayan anahtar-kelime etiketi geçti. Etiket
   * `.eyebrow` diliyle aynı: mono, 11px, uppercase, 0.18em (`typography-label`).
   */
  const values = [
    {
      key: "diagnosis",
      label: { tr: "Teşhis", en: "Diagnosis" },
      title: {
        tr: "Teşhis olmadan reçete yok.",
        en: "No prescription without diagnosis.",
      },
      description: {
        tr: "Her engagement bir soruyla başlar. Teknoloji en sonda gelir. Yanlış problem için doğru çözüm değersizdir.",
        en: "Every engagement starts with a question. Technology comes last. The right solution to the wrong problem has no value.",
      },
    },
    {
      key: "ownership",
      label: { tr: "Sahiplik", en: "Ownership" },
      title: {
        tr: "Sahiplikli teslim.",
        en: "Ownership-led delivery.",
      },
      description: {
        tr: "Kod, rapor, süreç, pano — kimin elinde kalacak belli. Danışmanın çıkması başarının bir parçasıdır.",
        en: "Code, reports, process, dashboards — who inherits what is clear. The consultant leaving is part of success.",
      },
    },
    {
      key: "restraint",
      label: { tr: "Sadelik", en: "Restraint" },
      title: {
        tr: "Az ama doğru.",
        en: "Less but right.",
      },
      description: {
        tr: "Her sayfa, her pano, her cümle bir amaca hizmet eder. Süs değil; mühendislik.",
        en: "Every page, dashboard, sentence serves a purpose. Not decoration; engineering.",
      },
    },
    {
      key: "axis",
      label: { tr: "Eksen", en: "Axis" },
      /**
       * Başlık eskiden "İki eksen, bir disiplin." idi ve sayfanın H1'ini
       * ("İki eksen. Bir disiplin.") birebir tekrarlıyordu. Yeni başlık
       * gövdeden de bir cümle çalmıyor: gövdedeki "Aynı disiplin, farklı dil."
       * kapanışı, tekrarı önlemek için neyin sabit kaldığını sayan bir
       * cümleyle değişti.
       */
      title: {
        tr: "Tek yöntem, iki dil.",
        en: "One method, two languages.",
      },
      description: {
        tr: "Sanayi ve ticaret — farklı müşteri, aynı soru: işi nasıl büyütürüz? Teşhis, ölçüm ve teslim değişmez; terminoloji ve tempo müşteriye göre kurulur.",
        en: "Industry and commerce — different customers, same question: how do we grow the business? Diagnosis, measurement and delivery stay fixed; terminology and tempo are set by the customer.",
      },
    },
  ];

  return (
    <>
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: META[loc].title,
            description: META[loc].description,
            path: PATHS[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            { name: tCommon("nav.about") },
          ]),
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.about") },
        ]}
        eyebrow={loc === "tr" ? "Hakkımızda" : "About"}
        title={
          loc === "tr"
            ? "İki eksen. Bir disiplin."
            : "Two axes. One discipline."
        }
        lede={
          loc === "tr"
            ? "İndoles Yazılım A.Ş. — sanayi için teknoloji dönüşümü, ticaret için agresif büyüme sunan İstanbul merkezli iş geliştirme danışmanlık şirketi."
            : "İndoles Yazılım A.Ş. — an Istanbul-based business growth consultancy offering technology transformation for industry and aggressive growth for commerce."
        }
      />

      {/* Manifesto */}
      <section className="v2-surface border-b border-surface-2">
        <div className="ds-container py-24 md:py-32">
          <div className="max-w-[40ch] mx-auto text-center">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Manifesto" : "Manifesto"}
            </span>
            <blockquote className="typography-h1 mt-8 text-ink-900 leading-[1.15]">
              {loc === "tr"
                ? "Teşhis olmadan reçete yazmayız. İş önce anlaşılır, sonra teknoloji çağrılır."
                : "No prescription without diagnosis. Business is understood first; technology is called second."}
            </blockquote>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Değerler" : "Values"}
              </span>
              <h2 className="typography-h2 mt-4 text-ink-900">
                {loc === "tr"
                  ? "Nasıl çalıştığımız."
                  : "How we work."}
              </h2>
            </div>
            <div className="md:col-span-8">
              <ul className="border-t border-surface-2">
                {values.map((v) => (
                  <li
                    key={v.key}
                    className="border-b border-surface-2 py-8 grid grid-cols-1 md:grid-cols-12 gap-4"
                  >
                    <div className="md:col-span-3 typography-label text-teal-700 md:pt-2">
                      {v.label[loc]}
                    </div>
                    <div className="md:col-span-9">
                      <h3 className="typography-h1 text-ink-900">
                        {v.title[loc]}
                      </h3>
                      <p className="typography-body-md text-ink-700 mt-3 max-w-prose-editorial">
                        {v.description[loc]}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="v2-surface border-b border-surface-2">
        <div className="ds-container py-24 md:py-32">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {loc === "tr" ? "Ekip" : "Team"}
          </span>
          <h2 className="typography-h2 mt-4 text-ink-900">
            {loc === "tr"
              ? "İç ekip. Küratörlü."
              : "Internal team. Curated."}
          </h2>
          <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
            {loc === "tr"
              ? "Açık marketplace değil. Davet-temelli, uzmanlık-odaklı kadro. Büyüme Faz 2'de seçilmiş uzmanlarla devam eder."
              : "Not an open marketplace. An invitation-based, expertise-focused roster. Phase 2 expands with curated specialists."}
          </p>

          {/*
            Kadro tek bölümde. Önceki düzende aynı sayfada hem bu grid hem bir
            slider vardı: slider'ın taşıdığı üç değer (portre tonu, alıntı,
            künye satırı) buraya taşındı, slider kaldırıldı. Alıntı artık
            sunucu HTML'inde — slider client-only olduğu için on alıntı
            crawler'a hiç görünmüyordu.
          */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSULTANTS_ORDERED.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/danismanlar/${c.slug}`}
                className="group border border-surface-2 rounded-2xl p-10 flex flex-col hover:bg-teal-50 hover:border-teal-200 transition-colors"
              >
                <header className="flex items-center gap-6">
                  <div
                    className="team-avatar w-16 h-16 shrink-0 rounded-full text-ink-900 grid place-items-center typography-h3"
                    style={{ ["--tone" as string]: c.portraitTone }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="typography-h3 text-ink-900 group-hover:text-teal-800">
                      {c.name}
                    </h3>
                    <p className="typography-body-sm text-ink-500 mt-1">
                      {c.title[loc]}
                    </p>
                  </div>
                </header>
                <p className="typography-body-md text-ink-700 mt-6">
                  {c.shortBio[loc]}
                </p>
                <blockquote className="typography-body-sm text-ink-600 italic mt-auto pt-6">
                  <span aria-hidden="true">“</span>
                  {c.quote[loc]}
                  <span aria-hidden="true">”</span>
                </blockquote>
              </Link>
            ))}
          </div>

          {/* Slider künyesi buraya taşındı: sayı kadro listesinden türer,
              ofis köpeğini saymaz (bkz. consultants.ts). */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-surface-2 pt-8">
            <p className="typography-label text-ink-500 tabular">
              {BOOKABLE_CONSULTANTS.length} {loc === "tr" ? "kişi" : "people"} ·{" "}
              {COMPANY.locations.join(" · ")}
            </p>
            <a
              href={`mailto:${COMPANY.careersEmail}`}
              className="btn btn-primary"
            >
              {loc === "tr" ? "Aramıza katıl" : "Join the team"}
              <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M3 11 L11 3 M5 3 H11 V9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Eski anasayfadan taşındı (ADR-017): yöntem, kadro ve vizyon
          anasayfanın ritmini bozuyordu; kurumsal anlatının doğal yeri burası.
          Kadro sliderı kaldırıldı — ekip yukarıdaki tek bölümde. */}
      <MethodSection locale={loc} />
      <VisionSection locale={loc} />

      <ContactCallout locale={loc} />
    </>
  );
}
