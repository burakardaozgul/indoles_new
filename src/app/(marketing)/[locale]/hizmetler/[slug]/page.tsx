import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPillar, PILLARS } from "@/lib/content/pillars";
import { getService, SERVICES } from "@/lib/content/services";
import { PillarDetail } from "@/components/marketing/pillar-detail";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale, ServiceContent } from "@/lib/content/types";

const LOCALES = ["tr", "en"] as const;

/** `/hizmetler` TR'de, `/services` EN'de — locale başına ayrı taban. */
function servicePaths(service: ServiceContent) {
  return {
    tr: `/tr/hizmetler/${service.slug.tr}`,
    en: `/en/services/${service.slug.en}`,
  };
}

/** Pillar anahtarları lokalize edilmez; yalnız taban segment değişir. */
function pillarPaths(key: string) {
  return { tr: `/tr/hizmetler/${key}`, en: `/en/services/${key}` };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => [
    ...PILLARS.map((p) => ({ locale, slug: p.key })),
    ...SERVICES.map((s) => ({ locale, slug: s.slug[locale] })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;

  // Çözüm sırası pillar-önce. Aynı adlı bir hizmet pillar'ı gölgelerdi;
  // `services-content.test.ts` bu çakışmayı build'den önce yakalıyor.
  const pillar = getPillar(slug);
  if (pillar) {
    // Görünen ad ("Growth") marka mimarisinin parçası ve sayfada değişmez;
    // arama başlığı ondan ayrı tutulur (denetim T-10). `seo` verilmemişse
    // eski davranışa düşülür.
    return buildMetadata({
      title: pillar.seo?.title[loc] ?? pillar.name[loc],
      description: pillar.seo?.description[loc] ?? pillar.heroLede[loc],
      paths: pillarPaths(pillar.key),
      locale: loc,
    });
  }

  const service = getService(slug, loc);
  if (!service) return {};

  return buildMetadata({
    title: service.seo.title[loc],
    description: service.seo.description[loc],
    paths: servicePaths(service),
    locale: loc,
  });
}

export default async function ServicesSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const pillar = getPillar(slug);
  if (pillar) return <PillarDetail pillar={pillar} locale={loc} />;

  const service = getService(slug, loc);
  if (service) return <ServiceDetail service={service} locale={loc} />;

  notFound();
}
