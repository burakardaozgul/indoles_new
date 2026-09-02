// Küratörlü, versiyonlu statik benchmark seti (spec §5). Canlı rakip scraping YOK.
// Kaynak değerleri implementasyon sırasında güncel yayınlardan doğrulanır ve
// version damgasıyla birlikte güncellenir.
import type { BenchmarkComparison } from "./schema";

export const BENCHMARKS_VERSION = "2026-09";

// Finansal motorun "estimated" girdileri: kurumsal e-ticaret medyanları.
export const BENCHMARK_DEFAULTS = {
  monthlyTraffic: 100_000,      // orta-büyük TR e-ticaret organik+paid ayı
  aov: 800,                     // TL — karma sektör medyanı
  conversionRate: 0.018,        // %1,8 — e-ticaret medyanı (Dynamic Yield/IRP karması)
} as const;

type BenchmarkRow = { label: string; median: number; top10: number; unit: BenchmarkComparison["unit"]; betterIs: BenchmarkComparison["betterIs"] };

const ROWS: Record<string, BenchmarkRow> = {
  lcp_ms: { label: "LCP (ms)", median: 3200, top10: 1800, unit: "ms", betterIs: "lower" },
  cls: { label: "CLS", median: 0.12, top10: 0.04, unit: "ratio", betterIs: "lower" },
  conversion_rate: { label: "Dönüşüm oranı", median: 0.018, top10: 0.032, unit: "ratio", betterIs: "higher" },
};

/**
 * Ölçülemeyen metrik satır ÜRETMEZ. PSI dönmediğinde "Siz 0 ms" basmak,
 * ölçülmemiş bir değeri sektör medyanının yanına ölçülmüş gibi koymaktı.
 */
export function compareBenchmarks(input: {
  avgLcpMs: number | null; cls: number | null; conversionRate: number | null;
}): BenchmarkComparison[] {
  const out: BenchmarkComparison[] = [];
  if (input.avgLcpMs != null) {
    out.push({ metric: "lcp_ms", value: input.avgLcpMs, ...ROWS.lcp_ms! });
  }
  if (input.cls != null) {
    out.push({ metric: "cls", value: input.cls, ...ROWS.cls! });
  }
  if (input.conversionRate != null) {
    out.push({ metric: "conversion_rate", value: input.conversionRate, ...ROWS.conversion_rate! });
  }
  return out;
}
