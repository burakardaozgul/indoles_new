import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { IndustriesSection } from "@/components/marketing/industries-section";
import { PersonaText } from "@/components/marketing/persona-text";
import { PersonaSwitch } from "@/components/marketing/persona-switch";
import { PILLARS } from "@/lib/content/pillars";
import { SERVICES, getServicesByPillar, serviceOrderIndex } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { breadcrumbLd, organizationLd, webPageLd } from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import type { Locale } from "@/lib/content/types";

const PATHS = { tr: "/tr/hizmetler", en: "/en/services" };

/**
 * Başlık "Hizmetler" değil: bu sayfa keyword haritasında (docs/strateji/
 * Keyword-Planner) "iş geliştirme" kümesinin hedefi ve o kelime 1B-10B
 * bandında, rekabeti düşük — TR setindeki en büyük alınabilir hacim.
 * Görünen sayfa başlığı ("Hizmetler") V2PageHeader'da olduğu gibi kalır;
 * değişen yalnız arama yüzeyi.
 */
const META = {
  tr: {
    title: "İş geliştirme danışmanlığı — 12 uzmanlık",
    description:
      "Growth, Transform ve Build disiplinlerinde 12 uzmanlık: marka stratejisinden yapay zeka danışmanlığına, e-ticaretten altyapıya. Kapsamı yazılı.",
  },
  en: {
    title: "Business development consultancy — 12 disciplines",
    description:
      "Twelve areas of expertise across Growth, Transform and Build: brand strategy, AI advisory, e-commerce, custom software, infrastructure. Scope in writing.",
  },
} as const;

/** Sayfa üstünde görünen başlık — arama başlığından ayrı tutulur. */
const HEADING = { tr: "Hizmetler", en: "Services" } as const;

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
import { PillarMark } from "@/components/marketing/pillar-mark";
import { ServiceIllustration } from "@/components/marketing/service-illustration";

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tPage = await getTranslations({ locale, namespace: "pages.services" });

  const servicesRoot = loc === "tr" ? "hizmetler" : "services";

  return (
    <>
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: HEADING[loc],
            description: META[loc].description,
            path: PATHS[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            { name: HEADING[loc] },
          ]),
          {
            // Kümenin tepesi yapraklarını sayar: ajan 12 hizmetin
            // tamamını tek düğümden görebiliyor.
            "@type": "ItemList",
            name: HEADING[loc],
            numberOfItems: SERVICES.length,
            itemListElement: SERVICES.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.name[loc],
              url: absoluteUrl(`/${loc}/${servicesRoot}/${s.slug[loc]}`),
            })),
          },
        ]}
      />
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.services") },
        ]}
        eyebrow={loc === "tr" ? "Hizmetler" : "Services"}
        title={
          <PersonaText
            industrial={tPage("industrial.title")}
            commerce={tPage("commerce.title")}
          />
        }
        lede={
          <PersonaText
            industrial={tPage("industrial.lede")}
            commerce={tPage("commerce.lede")}
          />
        }
        aside={<PersonaSwitch locale={loc} />}
      />

      <section >
        <div className="ds-container py-24 md:py-32">
          <div className="space-y-24 md:space-y-32">
            {PILLARS.map((p, idx) => (
              <article
                key={p.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16"
              >
                <div className="md:col-span-4">
                  {/* İmza geometrisi — üç pillar'ı birbirinden ayıran şey.
                      Renk değil geometri (ADR-015 tek accent). */}
                  <PillarMark
                    pillar={p.key}
                    className="w-[132px] h-auto mb-8 opacity-90"
                  />
                  <span className="typography-label uppercase tracking-widest text-ink-500">
                    0{idx + 1} — {loc === "tr" ? "Disiplin" : "Discipline"}
                  </span>
                  <h2 className="typography-h1 mt-4 text-ink-900">
                    {p.name[loc]}
                  </h2>
                  <p className="typography-body-lg text-ink-700 mt-4">
                    <PersonaText
                      industrial={p.tagline.industrial[loc]}
                      commerce={p.tagline.commerce[loc]}
                    />
                  </p>
                  <Link
                    href={`/${locale}/hizmetler/${p.key}`}
                    className="inline-flex items-center gap-2 mt-8 text-brand-700 typography-body-md"
                  >
                    <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                      {tCommon("cta.explore")}
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
                <div className="md:col-span-8">
                  <p className="typography-body-lg text-ink-700 max-w-prose-editorial">
                    <PersonaText
                      industrial={p.description.industrial[loc]}
                      commerce={p.description.commerce[loc]}
                    />
                  </p>
                  <ul className="mt-10 border-t border-surface-2">
                    {getServicesByPillar(p.key).map((s) => (
                      <li key={s.slug.tr} className="border-b border-surface-2">
                        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-6">
                          {/* Diyagramlar zaten yazılmıştı ama yalnız anasayfada
                              görünüyordu (ADR-017 sonrası denetim bulgusu). */}
                          <div className="md:col-span-2">
                            {/* `ServiceIllustration` %100 genişlik/yükseklik
                                veriyor — ölçüsü olan bir kap gerekiyor. */}
                            <div className="w-[92px] aspect-[200/140] opacity-75">
                              <ServiceIllustration index={serviceOrderIndex(s.slug.tr)} />
                            </div>
                          </div>
                          <div className="md:col-span-4">
                            {/* Ad artık hizmet sayfasına link — topikal
                                kümenin tepesi yapraklarına bağlanıyor. */}
                            <h3 className="typography-h3 text-ink-900">
                              <Link
                                href={`/${locale}/${loc === "tr" ? "hizmetler" : "services"}/${s.slug[loc]}`}
                                className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                              >
                                {s.name[loc]}
                              </Link>
                            </h3>
                          </div>
                          <div className="md:col-span-6">
                            <p className="typography-body-sm text-ink-700">
                              <PersonaText
                                industrial={s.shortDescription.industrial[loc]}
                                commerce={s.shortDescription.commerce[loc]}
                              />
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Eski anasayfadan taşındı (ADR-017): hangi sektörlerde çalıştığımız,
          hizmet listesinin hemen ardından okunması gereken bilgi. */}
      <IndustriesSection locale={loc} />

      <ContactCallout locale={loc} />
    </>
  );
}
