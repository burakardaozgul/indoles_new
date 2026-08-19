import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { MethodSection } from "@/components/marketing/method-section";
import { TeamSlider } from "@/components/marketing/team-slider";
import { VisionSection } from "@/components/marketing/vision-section";
import { CONSULTANTS } from "@/lib/content/consultants";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const values = [
    {
      key: "diagnosis",
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
      title: {
        tr: "İki eksen, bir disiplin.",
        en: "Two axes, one discipline.",
      },
      description: {
        tr: "Sanayi ve ticaret — farklı müşteri, aynı soru: işi nasıl büyütürüz? Aynı disiplin, farklı dil.",
        en: "Industry and commerce — different customers, same question: how do we grow the business? Same discipline, different language.",
      },
    },
  ];

  return (
    <>
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
              <ol className="border-t border-surface-2">
                {values.map((v, i) => (
                  <li
                    key={v.key}
                    className="border-b border-surface-2 py-8 grid grid-cols-1 md:grid-cols-12 gap-4"
                  >
                    <div className="md:col-span-1 typography-label uppercase tracking-widest text-brand-700">
                      0{i + 1}
                    </div>
                    <div className="md:col-span-11">
                      <h3 className="typography-h1 text-ink-900">
                        {v.title[loc]}
                      </h3>
                      <p className="typography-body-md text-ink-700 mt-3 max-w-prose-editorial">
                        {v.description[loc]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
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

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSULTANTS.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/danismanlar/${c.slug}`}
                className="group border border-surface-2 rounded-2xl p-10 flex flex-col min-h-[240px] hover:v2-surface-2/60 transition-colors"
              >
                <header className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-ink-900 text-paper grid place-items-center typography-h2">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="typography-h1 text-ink-900 group-hover:text-brand-800">
                      {c.name}
                    </h3>
                    <p className="typography-body-sm text-ink-500 mt-1">
                      {c.title[loc]}
                    </p>
                  </div>
                </header>
                <p className="typography-body-md text-ink-700 mt-8">
                  {c.shortBio[loc]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Eski anasayfadan taşındı (ADR-017): yöntem, kadro ve vizyon
          anasayfanın ritmini bozuyordu; kurumsal anlatının doğal yeri burası. */}
      <MethodSection locale={loc} />
      <TeamSlider locale={loc} />
      <VisionSection locale={loc} />

      <ContactCallout locale={loc} />
    </>
  );
}
