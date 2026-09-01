import { z } from "zod";
import {
  RoadmapItemSchema, type DiagnooReport, type FunnelResult, type KnownMetrics,
  type RangeValue, type RoadmapItem, type SemanticResult, type VisionResult,
} from "./schema";
import { computeFinancialProjection, type FinancialInput } from "./financial";
import { BENCHMARK_DEFAULTS, compareBenchmarks } from "./benchmarks";
import { geminiJson } from "./services/gemini";
import type { DiagnooEnv } from "./services/firecrawl";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function computeHealthScore(input: {
  semantic: SemanticResult; vision: VisionResult; funnel: FunnelResult;
}): number {
  const speedScore = input.funnel.avgLcpMs === 0
    ? 0.5 // hız verisi alınamadı — nötr
    : clamp01(1 - Math.max(0, input.funnel.avgLcpMs - 2500) / 4000);
  const pixelValues = Object.values(input.funnel.pixelCoverage);
  const trackingScore = pixelValues.length > 0
    ? pixelValues.filter(Boolean).length / pixelValues.length : 0.5;
  const score =
    input.semantic.messageCohesionScore * 25 +
    (1 - input.vision.cognitiveLoadScore) * 12.5 +
    input.vision.ctaVisibilityScore * 12.5 +
    speedScore * 30 +
    trackingScore * 20;
  return Math.round(score);
}

export function scaleRoadmapImpacts(roadmap: RoadmapItem[], total: RangeValue): RoadmapItem[] {
  const sum = roadmap.reduce((s, r) => s + (r.impactMonthly?.expected ?? 0), 0);
  if (sum <= total.expected || sum === 0) return roadmap;
  const factor = total.expected / sum;
  return roadmap.map((r) => r.impactMonthly === null ? r : {
    ...r,
    impactMonthly: {
      low: Math.round(r.impactMonthly.low * factor),
      expected: Math.round(r.impactMonthly.expected * factor),
      high: Math.round(r.impactMonthly.high * factor),
    },
  });
}

const RoadmapListSchema = z.object({ roadmap: z.array(RoadmapItemSchema).min(3).max(8) });

export async function buildRoadmap(
  env: DiagnooEnv,
  input: { semantic: SemanticResult; vision: VisionResult; funnel: FunnelResult;
    financial: ReturnType<typeof computeFinancialProjection>; locale: "tr" | "en" },
): Promise<RoadmapItem[]> {
  const lang = input.locale === "tr" ? "Türkçe" : "İngilizce";
  const out = await geminiJson(env, {
    system: `Kıdemli bir CRO danışmanısın. Bulgulardan önceliklendirilmiş, kanıta bağlı bir yol haritası çıkarırsın. ${lang} yaz. YALNIZCA JSON döndür.`,
    user: [
      `Semantik: ${JSON.stringify(input.semantic)}`,
      `Vision: ${JSON.stringify(input.vision)}`,
      `Funnel: ${JSON.stringify({ avgLcpMs: input.funnel.avgLcpMs, checkoutFrictionPoints: input.funnel.checkoutFrictionPoints, pixelCoverage: input.funnel.pixelCoverage })}`,
      `Aylık kurtarılabilir toplam (expected): ${input.financial.totalRecoverable.expected}`,
      `Şema: {"roadmap": [{"title": "...", "description": "1-2 cümle", "category": "speed|semantic|ux|tracking|funnel", "priority": "critical|high|medium|low", "impactMonthly": {"low": n, "expected": n, "high": n} veya null, "effortDays": n, "dataReference": "hangi bulgudan geldiği — somut metrik/alıntı"}]}`,
      "5-8 madde. impactMonthly'lerin expected toplamı kurtarılabilir toplamı aşmasın. dataReference boş olamaz.",
    ].join("\n\n"),
    schema: RoadmapListSchema,
  });
  return scaleRoadmapImpacts(out.roadmap, input.financial.totalRecoverable);
}

export async function assembleReport(
  env: DiagnooEnv,
  input: { id: string; url: string; locale: "tr" | "en";
    semantic: SemanticResult; vision: VisionResult; funnel: FunnelResult; known: KnownMetrics },
): Promise<DiagnooReport> {
  const financialInput: FinancialInput = {
    avgLcpMs: input.funnel.avgLcpMs,
    messageCohesionScore: input.semantic.messageCohesionScore,
    known: input.known, benchmarkDefaults: BENCHMARK_DEFAULTS,
  };
  const financial = computeFinancialProjection(financialInput);
  const roadmap = await buildRoadmap(env, { ...input, financial });
  const cls = input.funnel.pageSpeeds[0]?.cls ?? 0;
  return {
    id: input.id, url: input.url, locale: input.locale,
    healthScore: computeHealthScore(input),
    semantic: input.semantic, vision: input.vision, funnel: input.funnel,
    financial, roadmap,
    benchmarks: compareBenchmarks({
      avgLcpMs: input.funnel.avgLcpMs, cls,
      conversionRate: input.known.conversionRate ?? null,
    }),
    createdAt: new Date().toISOString(),
  };
}

export function recomputeWithKnownMetrics(report: DiagnooReport, known: KnownMetrics): DiagnooReport {
  const financial = computeFinancialProjection({
    avgLcpMs: report.funnel.avgLcpMs,
    messageCohesionScore: report.semantic.messageCohesionScore,
    known, benchmarkDefaults: BENCHMARK_DEFAULTS,
  });
  const oldTotal = report.financial.totalRecoverable.expected;
  const factor = oldTotal > 0 ? financial.totalRecoverable.expected / oldTotal : 1;
  const roadmap = report.roadmap.map((r) => r.impactMonthly === null ? r : {
    ...r,
    impactMonthly: {
      low: Math.round(r.impactMonthly.low * factor),
      expected: Math.round(r.impactMonthly.expected * factor),
      high: Math.round(r.impactMonthly.high * factor),
    },
  });
  const cls = report.funnel.pageSpeeds[0]?.cls ?? 0;
  return {
    ...report, financial, roadmap,
    benchmarks: compareBenchmarks({
      avgLcpMs: report.funnel.avgLcpMs, cls,
      conversionRate: known.conversionRate ?? null,
    }),
  };
}
