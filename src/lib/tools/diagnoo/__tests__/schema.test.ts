import { describe, it, expect } from "vitest";
import { DiagnooReportSchema, toSnapshot, RangeValueSchema } from "../schema";
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
