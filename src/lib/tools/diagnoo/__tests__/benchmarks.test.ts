import { describe, it, expect } from "vitest";
import { compareBenchmarks, BENCHMARK_DEFAULTS, BENCHMARKS_VERSION } from "../benchmarks";

describe("benchmarks", () => {
  it("versiyon damgası YYYY-MM biçiminde", () => {
    expect(BENCHMARKS_VERSION).toMatch(/^\d{4}-\d{2}$/);
  });
  it("varsayılanlar makul aralıkta", () => {
    expect(BENCHMARK_DEFAULTS.conversionRate).toBeGreaterThan(0.005);
    expect(BENCHMARK_DEFAULTS.conversionRate).toBeLessThan(0.05);
  });
  it("LCP ve CLS karşılaştırması döner; CR null ise CR satırı yok", () => {
    const rows = compareBenchmarks({ avgLcpMs: 4000, cls: 0.2, conversionRate: null });
    const metrics = rows.map((r) => r.metric);
    expect(metrics).toContain("lcp_ms");
    expect(metrics).toContain("cls");
    expect(metrics).not.toContain("conversion_rate");
    const lcp = rows.find((r) => r.metric === "lcp_ms")!;
    expect(lcp.betterIs).toBe("lower");
    expect(lcp.top10).toBeLessThan(lcp.median);
  });
  it("LCP ve CLS null ise o satırlar hiç üretilmez", () => {
    // PSI ölçümü dönmediğinde "Siz 0 ms" satırı basmak, ölçülmemiş bir değeri
    // sektör medyanının yanına ölçülmüş gibi koymak olurdu.
    const rows = compareBenchmarks({ avgLcpMs: null, cls: null, conversionRate: 0.02 });
    expect(rows.map((r) => r.metric)).toEqual(["conversion_rate"]);
  });

  it("yalnız CLS null ise LCP satırı kalır", () => {
    const rows = compareBenchmarks({ avgLcpMs: 4000, cls: null, conversionRate: null });
    expect(rows.map((r) => r.metric)).toEqual(["lcp_ms"]);
  });

  it("CR verilirse karşılaştırmaya girer (betterIs: higher)", () => {
    const rows = compareBenchmarks({ avgLcpMs: 3000, cls: 0.05, conversionRate: 0.02 });
    const cr = rows.find((r) => r.metric === "conversion_rate")!;
    expect(cr.betterIs).toBe("higher");
    expect(cr.value).toBe(0.02);
  });
});
