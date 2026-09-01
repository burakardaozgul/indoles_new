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

/**
 * Toplam skoru skor bandına dönüştür.
 * 0-39 → zayif · 40-69 → gelismeye-acik · 70-89 → iyi · 90+ → oncu
 */
export function bandFor(total: number): GeoBand {
  if (total < 40) return "zayif";
  if (total < 70) return "gelismeye-acik";
  if (total < 90) return "iyi";
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
