import type {
  CaseStudyContent,
  Locale,
  PackageContent,
  PillarContent,
  ServiceContent,
} from "@/lib/content/types";
import type { AnalyticsEvent } from "./events";

/**
 * Görüntüleme olaylarının içerikten türetilmesi.
 *
 * NEDEN AYRI VE SAF
 * -----------------
 * Bu eşlemeler sayfa JSX'inin içine yazılabilirdi ama orada test edilemezler:
 * sayfalar RSC ve vitest'te render edilemiyorlar. Saf fonksiyona çıkınca
 * yanlış eşleme (paketin fiyatı, vakanın problem tipi, hizmetin pillar'ı)
 * teste bağlanır; JSX yalnız sonucu taşır.
 *
 * KİMLİK HER ZAMAN TR SLUG'I
 * --------------------------
 * Hizmet ve paket slug'ları dile göre ayrışıyor (`cro`/`cro` ama
 * `ozel-yazilim-ve-mobil`/`custom-software-development`). Olayda görünen
 * slug EN sayfada `slug.en` olsaydı aynı varlık GA4'te iki satıra bölünür
 * ve hizmet bazlı toplam okunamazdı. Dil ayrı bir boyut olarak taşınır.
 */

export function serviceViewEvent(
  service: ServiceContent,
  locale: Locale,
): Extract<AnalyticsEvent, { name: "service_viewed" }> {
  return {
    name: "service_viewed",
    properties: { slug: service.slug.tr, pillar: service.pillar, locale },
  };
}

export function pillarViewEvent(
  pillar: PillarContent,
  locale: Locale,
): Extract<AnalyticsEvent, { name: "pillar_viewed" }> {
  return {
    name: "pillar_viewed",
    properties: { pillar: pillar.key, locale },
  };
}

export function packageViewEvent(
  pkg: PackageContent,
): Extract<AnalyticsEvent, { name: "package_viewed" }> {
  return {
    name: "package_viewed",
    properties: {
      packageSlug: pkg.slug.tr,
      pillar: pkg.pillar,
      // Fiyat içerikten okunur: `packages.ts` değişince olay da değişir.
      price: pkg.pricing.TRY,
      currency: "TRY",
    },
  };
}

export function caseViewEvent(
  study: CaseStudyContent,
): Extract<AnalyticsEvent, { name: "case_study_viewed" }> {
  return {
    name: "case_study_viewed",
    // Olay kimliği HER ZAMAN TR slug: vaka slug'ı 2026-08-29'da lokalize
    // edildi, ama EN sayfa aynı varlığın ikinci satırını açmamalı — hizmet ve
    // paket olaylarındaki kuralın aynısı (yukarı bkz.). Locale boyutu da
    // gerekmiyor: kimlik tek, dil kırılımı GA4'te sayfa yolundan okunur.
    properties: {
      slug: study.slug.tr,
      problemType: study.problemType,
      pillar: study.pillar,
    },
  };
}
