/**
 * GEO motoru kontrat türleri — taşınabilir, değişmez sözleşme.
 *
 * Sonraki TÜM GEO görevleri bu tip koleksiyonu üzerine inşa edilir; her yeni
 * görev bu tanımları tüketir. Kontratın sabitliği, çeşitli araçların
 * interop'unu mümkün kılar: ai-access, llms-txt, json-ld motorları aynı
 * tarama girdisini okur, aynı çıktı şemasına yazar. Spec §2.
 */

import { Localized } from "@/lib/content/types";

export type GeoCheckId = "ai-access" | "llms-txt" | "json-ld" | "lang-signals" | "question-h2";
export type GeoCheckStatus = "pass" | "partial" | "fail";
export type GeoBand = "zayif" | "gelismeye-acik" | "iyi" | "oncu";

export type GeoCheckResult = {
  id: GeoCheckId;
  score: number;
  max: number;
  status: GeoCheckStatus;
  summary: Localized<string>;
  findings: Array<Localized<string>>;
  /**
   * `findings.length` — public yüzeyde (`stripFindings` sonrası) metin
   * silinir ama SAYI kalır: kilit kartı "n bulgu" önizlemesi için. İsteğe
   * bağlı: D1'deki eski kayıtlar alanı taşımaz; `stripFindings` o durumda
   * `findings.length`ten türetir.
   */
  findingsCount?: number | undefined;
};

export type GeoScanInput = {
  url: string;
  pageHtml: string;
  robotsTxt: string | null;
  llmsTxt: string | null;
};

export type GeoScanResult = {
  id: string;
  url: string;
  totalScore: number;
  band: GeoBand;
  checks: GeoCheckResult[];
  scannedAt: string;
};

/** Bant sırası — ölçek ve OG kartı bu sırayla çizer. */
export const BAND_ORDER: readonly GeoBand[] = ["zayif", "gelismeye-acik", "iyi", "oncu"];

/**
 * Bant alt eşikleri (dahil). `zayif` 0'dan başlar. `bandFor`, ölçek
 * (`BandScale`) ve OG şablonu TEK kaynaktan okur — eşik burada değişirse
 * hepsi birlikte değişir.
 */
export const BAND_THRESHOLDS = {
  "gelismeye-acik": 40,
  iyi: 70,
  oncu: 90,
} as const;

/**
 * Toplam skoru skor bandına dönüştür.
 * 0-39 → zayif · 40-69 → gelismeye-acik · 70-89 → iyi · 90+ → oncu
 */
export function bandFor(total: number): GeoBand {
  if (total < BAND_THRESHOLDS["gelismeye-acik"]) return "zayif";
  if (total < BAND_THRESHOLDS.iyi) return "gelismeye-acik";
  if (total < BAND_THRESHOLDS.oncu) return "iyi";
  return "oncu";
}

/**
 * Kontrol puanını duruma dönüştür.
 * 0 → fail · ==max → pass · arası → partial
 */
export function statusFor(score: number, max: number): GeoCheckStatus {
  if (score === 0) return "fail";
  if (score === max) return "pass";
  return "partial";
}
