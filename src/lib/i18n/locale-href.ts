import { routing } from "./routing";

/**
 * Dil değiştirici için hedef URL üretir.
 *
 * `routing.pathnames` segment çevirisi yaptığı için (`/hizmetler` ↔ `/services`)
 * dil değiştirmek locale ön ekini değiştirmekten ibaret değildir. Ham
 * `/${locale}` linki kullanıcıyı her seferinde ana sayfaya atıyordu.
 *
 * Burada yalnız **ilk segment** çevrilir, kalanı olduğu gibi taşınır: slug'lar
 * tek kaynaktan gelir ve iki dilde aynıdır (`/tr/hizmetler/veri-altyapisi` ↔
 * `/en/services/veri-altyapisi`). Haritada olmayan segmentler (ör. `/v2`)
 * çevrilmeden geçer — çevirisi olmayan route'lar için doğru davranış budur.
 */
const SEGMENTS: Record<string, { tr: string; en: string }> = (() => {
  const out: Record<string, { tr: string; en: string }> = {};
  for (const value of Object.values(routing.pathnames)) {
    if (typeof value === "string") continue;
    const tr = value.tr.split("/")[1];
    const en = value.en.split("/")[1];
    if (!tr || !en || tr.startsWith("[")) continue;
    out[tr] = { tr, en };
    out[en] = { tr, en };
  }
  return out;
})();

/**
 * @param pathname locale ön eki olmayan iç yol — `next-intl`'in
 *   `usePathname()`'i bunu döndürür (ör. `/hizmetler/veri-altyapisi`).
 */
export function localeHref(pathname: string, target: "tr" | "en"): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${target}`;

  const mapped = SEGMENTS[parts[0]!];
  if (mapped) parts[0] = mapped[target];

  return `/${target}/${parts.join("/")}`;
}
