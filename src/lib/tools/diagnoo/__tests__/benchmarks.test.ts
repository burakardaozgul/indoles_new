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
  it("CR verilirse karşılaştırmaya girer (betterIs: higher)", () => {
    const rows = compareBenchmarks({ avgLcpMs: 3000, cls: 0.05, conversionRate: 0.02 });
    const cr = rows.find((r) => r.metric === "conversion_rate")!;
    expect(cr.betterIs).toBe("higher");
    expect(cr.value).toBe(0.02);
  });
});
