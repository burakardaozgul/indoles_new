import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/v2/sections/Hero";
import { Statement } from "@/components/v2/sections/Statement";
import { About } from "@/components/v2/sections/About";
import { WhyNow } from "@/components/v2/sections/WhyNow";
import { Pillars } from "@/components/v2/sections/Pillars";
import { ServicesScroll } from "@/components/v2/sections/ServicesScroll";
import { FeaturedWork } from "@/components/v2/sections/FeaturedWork";
import { Outro } from "@/components/v2/sections/Outro";
import { JsonLd } from "@/lib/seo/JsonLd";
import { organizationLd, webSiteLd, webPageLd } from "@/lib/seo/json-ld";

/**
 * Grafiğin insan-okur alanları.
 *
 * `layout.tsx`teki `generateMetadata` META sabiti export edilmiyor; şema
 * metni oradaki `title.default` ve `description` ile birebir aynı tutulmalı.
 * Ayrışırsa sayfanın görünen vaadi ile makine-okur vaadi çelişir.
 */
const LD_META = {
  tr: {
    name: "INDOLES — Dönüşüm ve büyüme stüdyosu, İstanbul",
    description:
      "Sanayiye teknoloji dönüşümü, ticarete agresif büyüme. Teşhis olmadan reçete yazmayız — iş önce anlaşılır, teknoloji sonra çağrılır.",
  },
  en: {
    name: "INDOLES — Business transformation studio, Istanbul",
    description:
      "Strategy, design and engineering under one roof: digital transformation for manufacturers, growth systems for commerce brands. Fixed-scope packages from 3 weeks.",
  },
} as const;

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
      {/* Ana sayfa en çok bağlantı alan sayfa: marka varlığının (Organization)
          ve yayının (WebSite) tanımlandığı yer burası (docs/17 §4.2 [G-05]). */}
      <JsonLd
        graph={[
          organizationLd(),
          webSiteLd(),
          webPageLd({
            name: LD_META[loc].name,
            description: LD_META[loc].description,
            path: `/${loc}`,
            locale: loc,
          }),
        ]}
      />

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
