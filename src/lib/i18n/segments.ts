/**
 * Locale segment sözlüğü — tüm iç link üretiminin tek kaynağı (ADR-039).
 *
 * Sözlük daha önce en az yedi yerde ayrı ayrı yazılıydı: `routing.ts`
 * pathnames tablosu, `locale-href.ts`, `service-detail.tsx` kök haritası,
 * `llms.ts` ve `llms-full.txt` kökleri, `sitemap.ts` yolları ve sayfa
 * dosyalarındaki `loc === "tr" ? "hizmetler" : "services"` üçlüleri. Bir de
 * segment çevirisini hiç yapmayan `` `/${locale}/hizmetler/...` `` şablonları
 * vardı: EN sayfalarda TR segmentli href üretiyorlardı (`/en/hizmetler/build`,
 * `/en/danismanlar/mert-kaplan`, `/en/yazilar/<slug>`) ve GSC'de gösterim
 * alıyorlardı — 307 ile doğru adrese düşseler de her tıklama bir atlama
 * kaybediyor, canonical sinyali bölünüyordu (indeks denetimi 2026-09-18).
 *
 * Bu dosya `next.config.ts` yükleme bağlamından da çözülür
 * (`legacy-redirects.ts` → `EN_SEGMENT_REDIRECTS`): bu yüzden **import
 * içermez** ve yalnız düz veri ile saf fonksiyon barındırır. `@/` alias'ı
 * config yüklenirken çözülmediği için buraya alias'lı import eklenmemelidir.
 */

/** Sözlüğün dilleri. `Locale` ile aynı küme; bağımsızlık için burada yazılır. */
export type SegmentLocale = "tr" | "en";

/**
 * Sözlük. Anahtar locale'den bağımsız "tür" adıdır; değer o türün her
 * dildeki ilk yol segmentidir.
 *
 * `as const`: `routing.ts` pathnames tablosunu buradan türetiyor ve next-intl
 * literal tiplere ihtiyaç duyuyor — genişletilmiş `string` tipi `Link href`
 * çıkarımını bozar.
 */
export const LOCALE_SEGMENTS = {
  services: { tr: "hizmetler", en: "services" },
  packages: { tr: "paketler", en: "packages" },
  cases: { tr: "vakalar", en: "case-studies" },
  articles: { tr: "yazilar", en: "articles" },
  tools: { tr: "araclar", en: "tools" },
  consultants: { tr: "danismanlar", en: "consultants" },
  contact: { tr: "iletisim", en: "contact" },
  about: { tr: "hakkimizda", en: "about" },
  privacy: { tr: "gizlilik-kvkk", en: "privacy" },
} as const satisfies Record<string, Record<SegmentLocale, string>>;

/** Sözlükteki tür anahtarları. */
export type SegmentKind = keyof typeof LOCALE_SEGMENTS;

/** `/tr/hizmetler`, `/en/services` — locale ön ekli kök yol. */
export function segmentRoot(locale: SegmentLocale, kind: SegmentKind): string {
  return `/${locale}/${LOCALE_SEGMENTS[kind][locale]}`;
}

/**
 * İç link üretiminin tek girişi.
 *
 * @param locale hedef dil
 * @param kind sözlük anahtarı (`"services"`, `"cases"`, …)
 * @param segments slug ve varsa alt yollar — **o dilin** slug'ı verilmelidir
 *   (`slug[locale]`). Çapraz locale slug çözümü yoktur: `/en` altında TR slug
 *   404 döner (ADR-018).
 *
 * @example localizedHref("en", "services", service.slug.en) // /en/services/build
 */
export function localizedHref(
  locale: SegmentLocale,
  kind: SegmentKind,
  ...segments: string[]
): string {
  const root = segmentRoot(locale, kind);
  return segments.length > 0 ? `${root}/${segments.join("/")}` : root;
}

/**
 * Ters arama: bir yol segmenti hangi türe ait?
 *
 * Hem TR hem EN yazımını tanır — `locale-href.ts` dil değiştirirken elindeki
 * segmentin hangi dilde yazıldığını bilmez.
 */
export function segmentKindOf(segment: string): SegmentKind | null {
  for (const key of Object.keys(LOCALE_SEGMENTS) as SegmentKind[]) {
    const pair = LOCALE_SEGMENTS[key];
    if (pair.tr === segment || pair.en === segment) return key;
  }
  return null;
}

/**
 * Bir segmenti hedef dile çevirir; sözlükte yoksa olduğu gibi döndürür
 * (araç slug'ları, `rezervasyon/<token>` gibi çevrilmeyen yollar).
 */
export function translateSegment(
  segment: string,
  target: SegmentLocale
): string {
  const kind = segmentKindOf(segment);
  return kind ? LOCALE_SEGMENTS[kind][target] : segment;
}
