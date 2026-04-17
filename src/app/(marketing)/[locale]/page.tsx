import { setRequestLocale } from "next-intl/server";
import { HomeHeroSection } from "@/components/marketing/home-hero-section";
import { ClientLogosMarquee } from "@/components/marketing/client-logos-marquee";
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
  const loc = locale as "tr" | "en";

  return (
    <>
      <HomeHeroSection locale={loc} />
      <ClientLogosMarquee locale={loc} />
      <PillarsSection locale={loc} />
      <ProofSection locale={loc} />
      <PackagesSection locale={loc} />
      <ManifestoSection locale={loc} />
      <FinalCTASection locale={loc} />
    </>
  );
}
