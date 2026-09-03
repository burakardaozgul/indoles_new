import { describe, it, expect } from "vitest";
import { computeFinancialProjection, METHODOLOGY_CONSTANTS } from "../financial";

const base = {
  avgLcpMs: 4500, messageCohesionScore: 0.6, speedMeasured: true,
  known: {},
  benchmarkDefaults: {
    monthlyTraffic: 100000, aov: 800, conversionRate: 0.018,
    source: "INDOLES kürasyonlu kıyas seti (2026-09)",
  },
};

describe("computeFinancialProjection", () => {
  it("tüm girdiler tahminiyken geniş aralık (±%35) üretir", () => {
    const p = computeFinancialProjection(base);
    const { low, expected, high } = p.lostRevenueSpeed;
    expect(low).toBeCloseTo(expected * 0.65, 0);
    expect(high).toBeCloseTo(expected * 1.35, 0);
    expect(Object.values(p.inputSources).every((s) => s === "estimated")).toBe(true);
  });

  it("gerçek girdilerle aralık daralır ve measured işaretlenir", () => {
    const p = computeFinancialProjection({
      ...base, known: { monthlyTraffic: 200000, aov: 950, conversionRate: 0.021 },
    });
    expect(p.inputSources.monthlyTraffic).toBe("measured");
    expect(p.lostRevenueSpeed.low / p.lostRevenueSpeed.expected).toBeGreaterThan(0.65);
    expect(p.inputs.monthlyTraffic).toBe(200000);
  });

  it("Formül A: LCP eşik altındaysa hız kaybı 0", () => {
    const p = computeFinancialProjection({ ...base, avgLcpMs: 2000 });
    expect(p.lostRevenueSpeed.expected).toBe(0);
  });

  it("Formül A beklenen değer: traffic*aov*cr*lossRate*delaySn", () => {
    const p = computeFinancialProjection(base);
    const delay = (4500 - METHODOLOGY_CONSTANTS.LCP_THRESHOLD_MS.value) / 1000;
    const exp = 100000 * 800 * 0.018 * METHODOLOGY_CONSTANTS.SPEED_LOSS_PER_SECOND.value * delay;
    expect(p.lostRevenueSpeed.expected).toBeCloseTo(exp, 0);
  });

  it("PSI ölçümü yokken hız kaybı hesaplanmaz, dataQuality 'missing' olur", () => {
    // Tek bir PSI çağrısı bile dönmediğinde `avgLcpMs` 0 gelir. 0'ı "çok hızlı
    // site" gibi okumak dürüst değil: gecikme de kayıp da hesaplanmaz.
    const p = computeFinancialProjection({ ...base, avgLcpMs: 0, speedMeasured: false });
    expect(p.lostRevenueSpeed).toEqual({ low: 0, expected: 0, high: 0 });
    expect(p.inputs.avgDelaySeconds).toBe(0);
    expect(p.dataQuality.speed).toBe("missing");
    expect(p.totalRecoverable.expected).toBe(0);
  });

  it("ölçüm varken dataQuality 'measured' kalır", () => {
    expect(computeFinancialProjection(base).dataQuality.speed).toBe("measured");
  });

  it("PSI yokken reklam israfı hâlâ hesaplanır", () => {
    // Hız verisinin yokluğu mesaj uyumsuzluğu kalemini silmemeli.
    const p = computeFinancialProjection({
      ...base, avgLcpMs: 0, speedMeasured: false, known: { monthlyAdSpend: 50000 },
    });
    expect(p.adWaste?.expected).toBeGreaterThan(0);
    expect(p.totalRecoverable.expected).toBe(p.adWaste?.expected);
  });

  it("adWaste yalnız reklam bütçesi verildiğinde hesaplanır", () => {
    expect(computeFinancialProjection(base).adWaste).toBeNull();
    const p = computeFinancialProjection({ ...base, known: { monthlyAdSpend: 50000 } });
    const exp = 50000 * (1 - 0.6) * METHODOLOGY_CONSTANTS.WASTE_ATTRIBUTION_FACTOR.value;
    expect(p.adWaste?.expected).toBeCloseTo(exp, 0);
    expect(p.totalRecoverable.expected).toBeCloseTo(p.lostRevenueSpeed.expected + exp, 0);
  });

  it("methodology dipnotları kullanılan her sabiti içerir", () => {
    const p = computeFinancialProjection({ ...base, known: { monthlyAdSpend: 50000 } });
    const constants = p.methodology.map((m) => m.constant);
    expect(constants).toContain("SPEED_LOSS_PER_SECOND");
    expect(constants).toContain("WASTE_ATTRIBUTION_FACTOR");
    expect(p.methodology.every((m) => m.source.length > 5)).toBe(true);
  });

  it("tüm girdiler tahminiyken üç varsayılan da metodolojiye künyesiyle girer", () => {
    // Hesabın üç girdisi sektör medyanından geliyorsa, o medyanların değeri ve
    // kaynağı raporda görünmeli — yoksa okuyucu neyle çarpıldığını bilemez.
    const p = computeFinancialProjection(base);
    const byConstant = new Map(p.methodology.map((m) => [m.constant, m]));
    expect(byConstant.get("DEFAULT_MONTHLY_TRAFFIC")?.value).toBe(100000);
    expect(byConstant.get("DEFAULT_AOV")?.value).toBe(800);
    expect(byConstant.get("DEFAULT_CONVERSION_RATE")?.value).toBe(0.018);
    expect(byConstant.get("DEFAULT_AOV")?.source).toContain("2026-09");
  });

  it("tüm girdiler ölçülüyken varsayılan notu yazılmaz", () => {
    const p = computeFinancialProjection({
      ...base, known: { monthlyTraffic: 200000, aov: 950, conversionRate: 0.021 },
    });
    const constants = p.methodology.map((m) => m.constant);
    expect(constants).not.toContain("DEFAULT_MONTHLY_TRAFFIC");
    expect(constants).not.toContain("DEFAULT_AOV");
    expect(constants).not.toContain("DEFAULT_CONVERSION_RATE");
  });

  it("yalnız girilmeyen girdi için varsayılan notu yazılır", () => {
    const p = computeFinancialProjection({ ...base, known: { monthlyTraffic: 200000 } });
    const constants = p.methodology.map((m) => m.constant);
    expect(constants).not.toContain("DEFAULT_MONTHLY_TRAFFIC");
    expect(constants).toContain("DEFAULT_AOV");
    expect(constants).toContain("DEFAULT_CONVERSION_RATE");
  });

  it("karışık girdilerde her iki genişlik sabiti ve uygulanan genişlik dipnota girer", () => {
    const p = computeFinancialProjection({ ...base, known: { monthlyTraffic: 200000 } });
    const constants = p.methodology.map((m) => m.constant);
    expect(constants).toContain("RANGE_WIDTH_ESTIMATED");
    expect(constants).toContain("RANGE_WIDTH_MEASURED");
    expect(constants).toContain("APPLIED_RANGE_WIDTH");
    const appliedNote = p.methodology.find((m) => m.constant === "APPLIED_RANGE_WIDTH");
    expect(appliedNote?.value).toBeCloseTo(0.273, 2);
  });

  it("tüm ölçülen girdilerde RANGE_WIDTH_ESTIMATED yok, RANGE_WIDTH_MEASURED var", () => {
    const p = computeFinancialProjection({
      ...base,
      known: { monthlyTraffic: 200000, aov: 950, conversionRate: 0.021 },
    });
    const constants = p.methodology.map((m) => m.constant);
    expect(constants).toContain("RANGE_WIDTH_MEASURED");
    expect(constants).not.toContain("RANGE_WIDTH_ESTIMATED");
    expect(constants).toContain("APPLIED_RANGE_WIDTH");
    const appliedNote = p.methodology.find((m) => m.constant === "APPLIED_RANGE_WIDTH");
    expect(appliedNote?.value).toBeCloseTo(0.12, 2);
  });

  it("tüm tahminiyken RANGE_WIDTH_ESTIMATED var, RANGE_WIDTH_MEASURED yok", () => {
    const p = computeFinancialProjection(base);
    const constants = p.methodology.map((m) => m.constant);
    expect(constants).toContain("RANGE_WIDTH_ESTIMATED");
    expect(constants).not.toContain("RANGE_WIDTH_MEASURED");
    expect(constants).toContain("APPLIED_RANGE_WIDTH");
    const appliedNote = p.methodology.find((m) => m.constant === "APPLIED_RANGE_WIDTH");
    expect(appliedNote?.value).toBeCloseTo(0.35, 2);
  });
});
