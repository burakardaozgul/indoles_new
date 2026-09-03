// Küratörlü, versiyonlu statik benchmark seti (spec §5). Canlı rakip scraping YOK.
//
// KÜNYE SATIRIN KENDİSİNDE YAŞAR: her kıyas satırı ve her varsayılan değer
// `source` + `asOf` taşır ve rapor bunları basar. Kaynağı yalnız kod yorumunda
// tutmak, okuyucunun rakamı doğrulamasını imkânsız kılıyordu (içerik
// dürüstlüğü, docs/04 §10). Değerler güncellenirse `BENCHMARKS_VERSION` de
// güncellenir — versiyon damgası raporda görünür.
import type { BenchmarkComparison } from "./schema";

export const BENCHMARKS_VERSION = "2026-09";

/**
 * Setin ortak künyesi. "INDOLES kürasyonu" ibaresi bilinçli: değerler
 * yayımlanmış dağılımlardan derlenmiş yaklaşık bantlardır, tek bir yayının
 * birebir alıntısı değil — bunu kaynak diye göstermek fazla iddia olurdu.
 */
const CURATION = "INDOLES kürasyonlu kıyas seti";

// Finansal motorun "estimated" girdileri: kurumsal e-ticaret medyanları.
export const BENCHMARK_DEFAULTS = {
  monthlyTraffic: 100_000,      // orta-büyük TR e-ticaret organik+paid ayı
  aov: 800,                     // TL — karma sektör medyanı
  conversionRate: 0.018,        // %1,8 — e-ticaret medyanı (Dynamic Yield/IRP karması)
  source: `${CURATION} (${BENCHMARKS_VERSION})`,
} as const;

type BenchmarkRow = {
  label: string; median: number; top10: number;
  unit: BenchmarkComparison["unit"]; betterIs: BenchmarkComparison["betterIs"];
  source: string;
};

const ROWS: Record<string, BenchmarkRow> = {
  lcp_ms: {
    label: "LCP (ms)", median: 3200, top10: 1800, unit: "ms", betterIs: "lower",
    source: `Chrome UX Report mobil LCP dağılımı — ${CURATION}`,
  },
  cls: {
    label: "CLS", median: 0.12, top10: 0.04, unit: "ratio", betterIs: "lower",
    source: `Chrome UX Report mobil CLS dağılımı — ${CURATION}`,
  },
  conversion_rate: {
    label: "Dönüşüm oranı", median: 0.018, top10: 0.032, unit: "ratio", betterIs: "higher",
    source: `Dynamic Yield ve IRP Commerce dönüşüm medyanları — ${CURATION}`,
  },
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
    out.push({ metric: "lcp_ms", value: input.avgLcpMs, asOf: BENCHMARKS_VERSION, ...ROWS.lcp_ms! });
  }
  if (input.cls != null) {
    out.push({ metric: "cls", value: input.cls, asOf: BENCHMARKS_VERSION, ...ROWS.cls! });
  }
  if (input.conversionRate != null) {
    out.push({
      metric: "conversion_rate", value: input.conversionRate,
      asOf: BENCHMARKS_VERSION, ...ROWS.conversion_rate!,
    });
  }
  return out;
}
