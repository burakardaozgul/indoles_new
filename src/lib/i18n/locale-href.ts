import { translateSegment } from "./segments";

/**
 * Dil değiştirici için hedef URL üretir.
 *
 * Segment çevirisi yapıldığı için (`/hizmetler` ↔ `/services`) dil değiştirmek
 * locale ön ekini değiştirmekten ibaret değildir. Ham `/${locale}` linki
 * kullanıcıyı her seferinde ana sayfaya atıyordu.
 *
 * Burada yalnız **ilk segment** çevrilir, kalanı olduğu gibi taşınır.
 *
 * Bu bir FALLBACK'tir: lokalize slug'lı dinamik sayfalarda
 * (`/tr/hizmetler/performans-pazarlama` ↔ `/en/services/performance-marketing`)
 * doğru karşılığı yalnız sayfanın kendisi bilir ve `hreflang` alternate
 * link'iyle beyan eder — dil değiştirici önce onu okur (`V2Nav`,
 * `useAlternateHref`). Alternate etiketi olmayan sayfalar buraya düşer;
 * haritada olmayan segmentler çevrilmeden geçer.
 *
 * Sözlük artık `routing.pathnames`ten türetilmiyor, `segments.ts`ten okunuyor
 * (ADR-039): `routing.ts` da aynı kaynağın türevi, ikisi birbirinden sapamaz.
 */

/**
 * @param pathname locale ön eki olmayan iç yol — `next-intl`'in
 *   `usePathname()`'i bunu döndürür (ör. `/hizmetler/veri-altyapisi`).
 */
export function localeHref(pathname: string, target: "tr" | "en"): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${target}`;

  parts[0] = translateSegment(parts[0]!, target);

  return `/${target}/${parts.join("/")}`;
}
