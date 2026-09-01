// Saf finansal motor: hem Workflow'un financial adımı hem unlock-recompute aynı fonksiyonu çağırır.
import type { FinancialProjection, InputSource, KnownMetrics, MethodologyNote, RangeValue } from "./schema";

// Sabit kaynakları rapora dipnot olarak taşınır; değer güncellenirse kaynak da güncellenir.
export const METHODOLOGY_CONSTANTS = {
  SPEED_LOSS_PER_SECOND: {
    constant: "SPEED_LOSS_PER_SECOND", value: 0.044,
    source: "Portent (2019), sayfa hızı-dönüşüm oranı analizi",
    note: "İlk 5 saniyede her ek saniye dönüşüm oranını ~%4,4 düşürür; muhafazakâr alt sınır alındı",
  },
  LCP_THRESHOLD_MS: {
    constant: "LCP_THRESHOLD_MS", value: 2500,
    source: "Google Core Web Vitals eşikleri",
    note: "2,5 sn altı LCP 'iyi' kabul edilir; kayıp yalnız eşiğin üzerindeki gecikme için hesaplanır",
  },
  WASTE_ATTRIBUTION_FACTOR: {
    constant: "WASTE_ATTRIBUTION_FACTOR", value: 0.5,
    source: "INDOLES metodolojisi — muhafazakâr atıf katsayısı",
    note: "Mesaj uyumsuzluğunun israfa dönüşme payı %50 ile sınırlandı; tamamını uyumsuzluğa atfetmek abartı olur",
  },
  RANGE_WIDTH_MEASURED: {
    constant: "RANGE_WIDTH_MEASURED", value: 0.12,
    source: "INDOLES metodolojisi",
    note: "Tüm girdiler ölçülmüşken projeksiyon belirsizliği ±%12",
  },
  RANGE_WIDTH_ESTIMATED: {
    constant: "RANGE_WIDTH_ESTIMATED", value: 0.35,
    source: "INDOLES metodolojisi",
    note: "Tüm girdiler tahminiyken projeksiyon belirsizliği ±%35",
  },
} as const satisfies Record<string, MethodologyNote>;

export type FinancialInput = {
  avgLcpMs: number;
  messageCohesionScore: number;
  known: KnownMetrics;
  benchmarkDefaults: { monthlyTraffic: number; aov: number; conversionRate: number };
};

function range(expected: number, width: number): RangeValue {
  return {
    low: Math.max(0, Math.round(expected * (1 - width))),
    expected: Math.round(expected),
    high: Math.round(expected * (1 + width)),
  };
}

export function computeFinancialProjection(input: FinancialInput): FinancialProjection {
  const C = METHODOLOGY_CONSTANTS;
  const { known, benchmarkDefaults: def } = input;

  const monthlyTraffic = known.monthlyTraffic ?? def.monthlyTraffic;
  const aov = known.aov ?? def.aov;
  const conversionRate = known.conversionRate ?? def.conversionRate;
  const monthlyAdSpend = known.monthlyAdSpend ?? null;

  const inputSources: Record<"monthlyTraffic" | "aov" | "conversionRate" | "monthlyAdSpend", InputSource> = {
    monthlyTraffic: known.monthlyTraffic != null ? "measured" : "estimated",
    aov: known.aov != null ? "measured" : "estimated",
    conversionRate: known.conversionRate != null ? "measured" : "estimated",
    monthlyAdSpend: known.monthlyAdSpend != null ? "measured" : "estimated",
  };

  // Aralık genişliği: measured oranına göre ±12% ile ±35% arasında lineer.
  const relevant: InputSource[] = [inputSources.monthlyTraffic, inputSources.aov, inputSources.conversionRate];
  const estimatedRatio = relevant.filter((s) => s === "estimated").length / relevant.length;
  const width = C.RANGE_WIDTH_MEASURED.value +
    (C.RANGE_WIDTH_ESTIMATED.value - C.RANGE_WIDTH_MEASURED.value) * estimatedRatio;

  // Formül A — hız kaynaklı kayıp (yalnız CWV eşiği üzerindeki gecikme).
  const avgDelaySeconds = Math.max(0, (input.avgLcpMs - C.LCP_THRESHOLD_MS.value) / 1000);
  const lostSpeedExpected = monthlyTraffic * aov * conversionRate * C.SPEED_LOSS_PER_SECOND.value * avgDelaySeconds;
  const lostRevenueSpeed = range(lostSpeedExpected, width);

  // Formül B — mesaj uyumsuzluğu israfı (yalnız reklam bütçesi biliniyorsa).
  const methodology: MethodologyNote[] = [C.SPEED_LOSS_PER_SECOND, C.LCP_THRESHOLD_MS];
  let adWaste: RangeValue | null = null;
  if (monthlyAdSpend != null) {
    const wasteExpected = monthlyAdSpend * (1 - input.messageCohesionScore) * C.WASTE_ATTRIBUTION_FACTOR.value;
    adWaste = range(wasteExpected, width);
    methodology.push(C.WASTE_ATTRIBUTION_FACTOR);
  }
  // Aralık genişliği sabitleri: karışık girdilerde her iki sabit, saf hallerde birer tane.
  if (estimatedRatio > 0) methodology.push(C.RANGE_WIDTH_ESTIMATED);
  if (estimatedRatio < 1) methodology.push(C.RANGE_WIDTH_MEASURED);
  // Gerçekten uygulanan genişlik dinamik olarak kaydedilir.
  methodology.push({
    constant: "APPLIED_RANGE_WIDTH",
    value: Number(width.toFixed(3)),
    source: "INDOLES metodolojisi",
    note: `Ölçülen girdi oranına göre ±%12 ile ±%35 arasında doğrusal harmanlandı; bu projeksiyonda ±%${Math.round(width * 100)} uygulandı`,
  });

  const totalRecoverable: RangeValue = {
    low: lostRevenueSpeed.low + (adWaste?.low ?? 0),
    expected: lostRevenueSpeed.expected + (adWaste?.expected ?? 0),
    high: lostRevenueSpeed.high + (adWaste?.high ?? 0),
  };

  return {
    inputs: { monthlyTraffic, aov, conversionRate, avgDelaySeconds,
      monthlyAdSpend, messageCohesionScore: input.messageCohesionScore },
    inputSources, lostRevenueSpeed, adWaste, totalRecoverable, methodology,
  };
}
