import { describe, it, expect } from "vitest";
import { computeHealthScore, scaleImpact, scaleRoadmapImpacts, recomputeWithKnownMetrics } from "../report";
import { sampleReport } from "./fixtures";

describe("scaleImpact", () => {
  // `scaleRoadmapImpacts` ve `recomputeWithKnownMetrics` AYNI yuvarlama
  // kuralını iki yerde tekrarlıyordu; tek yardımcı ikisinin de tek kaynağı.
  it("low/expected/high'ı faktörle çarpıp en yakın tam sayıya yuvarlar", () => {
    expect(scaleImpact({ low: 10, expected: 20, high: 30 }, 0.5)).toEqual({ low: 5, expected: 10, high: 15 });
  });
  it("faktör 1 ise değerleri değiştirmez", () => {
    expect(scaleImpact({ low: 7, expected: 11, high: 13 }, 1)).toEqual({ low: 7, expected: 11, high: 13 });
  });
});

describe("computeHealthScore", () => {
  const base = sampleReport();
  it("0-100 aralığında deterministik skor", () => {
    const s = computeHealthScore({ semantic: base.semantic, vision: base.vision, funnel: base.funnel });
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
    expect(computeHealthScore({ semantic: base.semantic, vision: base.vision, funnel: base.funnel })).toBe(s);
  });
  it("daha hızlı site daha yüksek skor alır", () => {
    const slow = computeHealthScore({ semantic: base.semantic, vision: base.vision, funnel: { ...base.funnel, avgLcpMs: 6000 } });
    const fast = computeHealthScore({ semantic: base.semantic, vision: base.vision, funnel: { ...base.funnel, avgLcpMs: 2000 } });
    expect(fast).toBeGreaterThan(slow);
  });
});

describe("scaleRoadmapImpacts", () => {
  it("impact toplamı total.expected'i aşarsa oransal küçültür", () => {
    const roadmap = sampleReport().roadmap;
    const scaled = scaleRoadmapImpacts(roadmap, { low: 30000, expected: 57000, high: 80000 });
    const sum = scaled.reduce((s, r) => s + (r.impactMonthly?.expected ?? 0), 0);
    expect(sum).toBeLessThanOrEqual(57000 + 1);
    expect(scaled.find((r) => r.impactMonthly === null)).toBeTruthy(); // null'lar korunur
  });
  it("kurtarılabilir toplam 0 ise etkiler ₺0 değil 'veri yetersiz' olur", () => {
    // Katsayı 0 ile çarpmak her maddeyi "₺0 – ₺0" yapardı; bu, ölçülmüş bir
    // sıfır gibi okunur. Bilinmeyen bir etki `null` ile gösterilir.
    const scaled = scaleRoadmapImpacts(sampleReport().roadmap, { low: 0, expected: 0, high: 0 });
    expect(scaled.every((r) => r.impactMonthly === null)).toBe(true);
  });

  it("aşmıyorsa dokunmaz", () => {
    const roadmap = sampleReport().roadmap;
    const scaled = scaleRoadmapImpacts(roadmap, { low: 1, expected: 10_000_000, high: 2 });
    expect(scaled[0]!.impactMonthly!.expected).toBe(roadmap[0]!.impactMonthly!.expected);
  });
});

describe("recomputeWithKnownMetrics", () => {
  it("gerçek metriklerle finansalı yeniden hesaplar ve measured işaretler", () => {
    const updated = recomputeWithKnownMetrics(sampleReport(), { monthlyTraffic: 240000, aov: 1000, conversionRate: 0.02 });
    expect(updated.financial.inputSources.monthlyTraffic).toBe("measured");
    expect(updated.financial.inputs.monthlyTraffic).toBe(240000);
    expect(updated.financial.lostRevenueSpeed.expected).not.toBe(sampleReport().financial.lostRevenueSpeed.expected);
  });
  it("PSI verisi olmayan raporda etkiler null'a düşer, ₺0'a değil", () => {
    const noSpeed = sampleReport();
    noSpeed.funnel = { ...noSpeed.funnel, pageSpeeds: [], avgLcpMs: 0 };
    const updated = recomputeWithKnownMetrics(noSpeed, { monthlyTraffic: 500000 });
    expect(updated.financial.dataQuality.speed).toBe("missing");
    expect(updated.financial.totalRecoverable.expected).toBe(0);
    expect(updated.roadmap.every((r) => r.impactMonthly === null)).toBe(true);
    expect(updated.benchmarks.some((b) => b.metric === "lcp_ms")).toBe(false);
  });

  it("CR verilince benchmark'a conversion_rate satırı eklenir", () => {
    const updated = recomputeWithKnownMetrics(sampleReport(), { conversionRate: 0.02 });
    expect(updated.benchmarks.some((b) => b.metric === "conversion_rate")).toBe(true);
  });
});
