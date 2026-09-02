import { describe, expect, it } from "vitest";
import { stripFindings } from "../findings";
import type { GeoCheckResult } from "../types";

/**
 * `stripFindings` — public yüzey (ücretsiz tarama yanıtı + paylaşım sayfası)
 * ile rapor yüzeyi (mail kapısı sonrası) arasındaki AYNI ayrımı TEK yerde
 * tanımlayan saf fonksiyon (Görev 12b brief). D1'deki TAM kayıt asla
 * mutasyona uğramaz — bu fonksiyon her zaman YENİ bir dizi/obje döndürür.
 */
describe("stripFindings", () => {
  const checks: GeoCheckResult[] = [
    {
      id: "ai-access",
      score: 12,
      max: 20,
      status: "partial",
      summary: { tr: "ai-access özeti", en: "ai-access summary" },
      findings: [{ tr: "ai-access bulgu 1", en: "ai-access finding 1" }],
    },
    {
      id: "llms-txt",
      score: 20,
      max: 20,
      status: "pass",
      summary: { tr: "llms-txt özeti", en: "llms-txt summary" },
      findings: [],
    },
  ];

  it("her check'in findings'ini boşaltır", () => {
    const result = stripFindings(checks);
    expect(result.every((c) => c.findings.length === 0)).toBe(true);
  });

  it("score/status/summary/id/max korunur", () => {
    const result = stripFindings(checks);
    expect(result[0]).toMatchObject({
      id: "ai-access",
      score: 12,
      max: 20,
      status: "partial",
      summary: { tr: "ai-access özeti", en: "ai-access summary" },
    });
  });

  it("girdi dizisini/objelerini MUTASYONA uğratmaz (D1 tam kaydı taşımaya devam eder)", () => {
    const result = stripFindings(checks);
    expect(checks[0]?.findings).toHaveLength(1);
    expect(result).not.toBe(checks);
    expect(result[0]).not.toBe(checks[0]);
  });

  it("boş dizi verilirse boş dizi döner", () => {
    expect(stripFindings([])).toEqual([]);
  });

  it("findings boşalır ama findingsCount SAYIYI korur (kilit önizlemesi)", () => {
    const result = stripFindings(checks);
    expect(result[0]?.findings).toEqual([]);
    expect(result[0]?.findingsCount).toBe(1);
    expect(result[1]?.findingsCount).toBe(0);
  });

  it("kayıt zaten findingsCount taşıyorsa (D1 eski kayıt: taşımaz) findings.length'ten türetir", () => {
    const legacy: GeoCheckResult[] = [{ ...checks[0]!, findingsCount: undefined }];
    expect(stripFindings(legacy)[0]?.findingsCount).toBe(1);
  });
});
