/**
 * Hero başlığı — INDOLES'in kanonik konumlandırması
 * ("Rapor değil sonuç, kampanya değil sistem." — docs/01 §3d), tamamı.
 *
 * Üç satırlık ilk hâl cümlenin yalnız ilk kolunu taşıyordu: "rapor değil
 * sonuç" INDOLES'i danışmanlıktan ayırır ve sanayi alıcısına konuşur, ajanstan
 * ayıran "kampanya değil sistem" kolu ise hiç görünmüyordu — ticaret alıcısı
 * sitenin açılış cümlesinde kendini bulamıyordu (docs/15-content-audit.md §D3).
 * Dört satır iki kolu simetrik kurar: tek sayılı satırlar olumsuzlama, çift
 * sayılılar karşılığı.
 *
 * `accentRange`, satırın hangi harf aralığının ön katmanda vurgu rengi
 * alacağını söyler. Aralıklar blob'un hero'daki yolu ölçülerek belirlendi:
 * gövdenin örttüğü bölge renge alınıyor, dışarıda kalan kısım siyah kalıyor.
 * Aralık bir harf dar kalınca "RAPOR" → "RAPO" gibi eksik okunuyordu.
 */
export type TitleRow = {
  /** Tek sayılar sola, çiftler sağa yaslı; her satır bir öncekinden içeride. */
  row: 1 | 2 | 3 | 4;
  text: string;
  /** [başlangıç, bitiş) harf indeksi — bu aralık accent rengini alır. */
  accentRange: [number, number];
  accentVar: "--accent-a" | "--accent-b" | "--accent-c";
};

export const TITLE_ROWS: Record<"tr" | "en", TitleRow[]> = {
  tr: [
    { row: 1, text: "RAPOR DEĞİL", accentRange: [4, 11], accentVar: "--accent-b" },
    { row: 2, text: "SONUÇ", accentRange: [0, 3], accentVar: "--accent-a" },
    { row: 3, text: "KAMPANYA DEĞİL", accentRange: [3, 14], accentVar: "--accent-c" },
    { row: 4, text: "SİSTEM", accentRange: [0, 4], accentVar: "--accent-a" },
  ],
  en: [
    { row: 1, text: "NOT REPORTS", accentRange: [2, 11], accentVar: "--accent-b" },
    { row: 2, text: "RESULTS", accentRange: [0, 3], accentVar: "--accent-a" },
    { row: 3, text: "NOT CAMPAIGNS", accentRange: [4, 13], accentVar: "--accent-c" },
    { row: 4, text: "SYSTEMS", accentRange: [0, 4], accentVar: "--accent-a" },
  ],
};

/** Nav ve CTA buradan kaldırıldı: chrome artık layout'ta (`V2Nav`). */
export const HERO_COPY = {
  tr: { scroll: "Kaydır" },
  en: { scroll: "Scroll" },
} as const;

/**
 * Deterministik saçılma vektörü.
 *
 * Her harf index'inden seed'lenir; aynı harf her render'da aynı yöne gider.
 * `Math.random()` kullanılamaz — scrub geri sarıldığında harflerin aynı yoldan
 * dönmesi gerekiyor (spec §4.3).
 */
export function scatterFor(
  index: number,
  cfg: { xRange: [number, number]; yRange: [number, number]; rotateRange: number },
) {
  const s = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  const r1 = s - Math.floor(s);
  const s2 = Math.sin(index * 39.3468 + 11.135) * 24634.6345;
  const r2 = s2 - Math.floor(s2);
  const s3 = Math.sin(index * 93.9898 + 4.1414) * 15731.743;
  const r3 = s3 - Math.floor(s3);

  const sign1 = r1 > 0.5 ? 1 : -1;
  const sign2 = r2 > 0.5 ? 1 : -1;

  const [xMin, xMax] = cfg.xRange;
  const [yMin, yMax] = cfg.yRange;

  return {
    x: sign1 * (xMin + r1 * (xMax - xMin)),
    y: sign2 * (yMin + r2 * (yMax - yMin)),
    rotate: (r3 * 2 - 1) * cfg.rotateRange,
  };
}
