import { describe, it, expect } from "vitest";
import { DiagnooReportSchema, toSnapshot, RangeValueSchema, BenchmarkComparisonSchema } from "../schema";
import { sampleReport } from "./fixtures";

describe("DiagnooReportSchema", () => {
  it("geçerli raporu kabul eder", () => {
    expect(DiagnooReportSchema.safeParse(sampleReport()).success).toBe(true);
  });
  it("skor aralık dışıysa reddeder", () => {
    const bad = { ...sampleReport(), healthScore: 140 };
    expect(DiagnooReportSchema.safeParse(bad).success).toBe(false);
  });
  it("RangeValue low<=expected<=high zorunlu", () => {
    expect(RangeValueSchema.safeParse({ low: 5, expected: 3, high: 9 }).success).toBe(false);
  });
});

describe("BenchmarkComparisonSchema geriye dönük uyum", () => {
  it("source/asOf eksik eski (0007 öncesi) satırı varsayılanlarla ayrıştırır", () => {
    // Künye alanları sonradan eklendi; eski report_json satırlarında yok.
    // `benchmarks.ts` gerçek kaynak/tarihi HER ZAMAN yazar — bu yalnız
    // geriye dönük okunabilirlik, yeni satırlar hiç bu varsayılana düşmez.
    const old = {
      metric: "lcp_ms", label: "LCP (ms)", value: 4200, median: 3200,
      top10: 1800, unit: "ms", betterIs: "lower",
    };
    const parsed = BenchmarkComparisonSchema.safeParse(old);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.source).toBe("Kaynak belirtilmedi");
      expect(parsed.data.asOf).toBe("");
    }
  });

  it("source açıkça boş dize verilirse reddedilir (F2 final review)", () => {
    // `.min(1)` düşürülmüştü — spec §5'in zorunlu kıldığı kaynak künyesi
    // boş basılabiliyordu. `asOf` kasıtlı olarak `.default("")` KALIR, bu
    // testin konusu yalnız `source`.
    const withEmptySource = {
      metric: "lcp_ms", label: "LCP (ms)", value: 4200, median: 3200,
      top10: 1800, unit: "ms", betterIs: "lower", source: "", asOf: "2026-01-01",
    };
    const parsed = BenchmarkComparisonSchema.safeParse(withEmptySource);
    expect(parsed.success).toBe(false);
  });
});

describe("toSnapshot", () => {
  it("en fazla 3 gap döndürür ve rakam sızdırmaz", () => {
    const snap = toSnapshot(sampleReport());
    expect(snap.topGaps.length).toBeLessThanOrEqual(3);
    expect(JSON.stringify(snap.topGaps)).not.toContain("impactMonthly");
    expect(snap.opportunityRange.low).toBeLessThanOrEqual(snap.opportunityRange.high);
  });
  it("critical öncelik high'tan önce gelir", () => {
    const snap = toSnapshot(sampleReport());
    expect(snap.topGaps[0]!.priority).toBe("critical");
  });
});
