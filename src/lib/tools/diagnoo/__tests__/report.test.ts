import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeHealthScore, scaleRoadmapImpacts, recomputeWithKnownMetrics } from "../report";
import { sampleReport } from "./fixtures";

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
  it("CR verilince benchmark'a conversion_rate satırı eklenir", () => {
    const updated = recomputeWithKnownMetrics(sampleReport(), { conversionRate: 0.02 });
    expect(updated.benchmarks.some((b) => b.metric === "conversion_rate")).toBe(true);
  });
});
