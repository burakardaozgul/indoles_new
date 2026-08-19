import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/v2/sections/Hero";
import { Statement } from "@/components/v2/sections/Statement";
import { About } from "@/components/v2/sections/About";
import { WhyNow } from "@/components/v2/sections/WhyNow";
import { Pillars } from "@/components/v2/sections/Pillars";
import { ServicesScroll } from "@/components/v2/sections/ServicesScroll";
import { FeaturedWork } from "@/components/v2/sections/FeaturedWork";
import { Outro } from "@/components/v2/sections/Outro";

/**
 * Anasayfa — ADR-016 ile onaylanan sürekli-sahne kurgusu.
 *
 * Bölüm id'leri (`v2-hero`, `v2-statement`, `v2-about`, `v2-whynow`,
 * `v2-pillars`, `v2-services`, `v2-work`, `v2-outro`) blob koreografisinin
 * çapalarıdır — değiştirilirse `components/v2/webgl/choreography.ts` de
 * güncellenmelidir.
 *
 * `v2-whynow` sonradan eklendi: zamanlama argümanı iki persona için yazılmış
 * ama hiç yayınlanmamıştı (docs/15-content-audit.md §C1).
 *
 * Eski 11 bölümlük kurgunun v2'de karşılığı olmayan parçaları iç sayfalara
 * dağıtıldı (yöntem ve vizyon → /hakkimizda, sektörler → /hizmetler,
 * vakalar → /vakalar). Bkz. ADR-017.
 */
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
      <Hero locale={loc} />
      <Statement locale={loc} />
      <About locale={loc} />
      <WhyNow locale={loc} />
      <Pillars locale={loc} />
      <ServicesScroll locale={loc} />
      <FeaturedWork locale={loc} />
      <Outro locale={loc} />
    </>
  );
}
