import { setRequestLocale, getTranslations } from "next-intl/server";
import { EditorialHero } from "@/components/marketing/editorial-hero";
import { ClientLogosMarquee } from "@/components/marketing/client-logos-marquee";
import { PersonaAxes } from "@/components/marketing/persona-axes";
import { PillarsSection } from "@/components/marketing/pillars-section";
import { ProofSection } from "@/components/marketing/proof-section";
import { PackagesSection } from "@/components/marketing/packages-section";
import { ManifestoSection } from "@/components/marketing/manifesto-section";
import { FinalCTASection } from "@/components/marketing/final-cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tHero, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "home.hero" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const loc = locale as "tr" | "en";

  return (
    <>
      <EditorialHero
        eyebrow={tHero("eyebrow")}
        headlineBefore={tHero("editorial.before")}
        headlineEmphasisA={tHero("editorial.emphasisA")}
        headlineMiddle={tHero("editorial.middle")}
        headlineEmphasisB={tHero("editorial.emphasisB")}
        headlineAfter={tHero("editorial.after")}
        supportingCopy={tHero("support")}
        ctaLabel={tCommon("cta.bookConsultation")}
        ctaHref={`/${locale}/iletisim`}
        secondaryCtaLabel={tCommon("cta.viewServices")}
        secondaryCtaHref={`/${locale}/hizmetler`}
      />
      <ClientLogosMarquee locale={loc} />
      <PersonaAxes
        locale={loc}
        industrial={{
          eyebrow: tHero("axis.industrial.eyebrow"),
          label: tHero("axis.industrial.label"),
          description: tHero("axis.industrial.description"),
          topics: tHero.raw("axis.industrial.topics") as string[],
          pillar: tHero("axis.industrial.pillar"),
          duration: tHero("axis.industrial.duration"),
          cta: tHero("axis.industrial.cta"),
        }}
        commerce={{
          eyebrow: tHero("axis.commerce.eyebrow"),
          label: tHero("axis.commerce.label"),
          description: tHero("axis.commerce.description"),
          topics: tHero.raw("axis.commerce.topics") as string[],
          pillar: tHero("axis.commerce.pillar"),
          duration: tHero("axis.commerce.duration"),
          cta: tHero("axis.commerce.cta"),
        }}
      />
      <PillarsSection locale={loc} />
      <ProofSection locale={loc} />
      <PackagesSection locale={loc} />
      <ManifestoSection locale={loc} />
      <FinalCTASection locale={loc} />
    </>
  );
}
