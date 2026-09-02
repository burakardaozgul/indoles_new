import { z } from "zod";

export const PageTypeSchema = z.enum(["homepage", "category", "product", "checkout"]);
export type PageType = z.infer<typeof PageTypeSchema>;

export const ScrapedPageSchema = z.object({
  url: z.string().url(), pageType: PageTypeSchema,
  title: z.string().default(""), metaDescription: z.string().default(""),
  h1: z.string().default(""), headings: z.array(z.string()).default([]),
  bodyText: z.string().default(""), rawHtml: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
});
export type ScrapedPage = z.infer<typeof ScrapedPageSchema>;

const score01 = z.number().min(0).max(1);

export const SemanticResultSchema = z.object({
  uvpDetected: z.string(), toneOfVoice: z.string(), messageCohesionScore: score01,
  alignmentIssues: z.array(z.string()), seoKeywordIssues: z.array(z.string()),
});
export type SemanticResult = z.infer<typeof SemanticResultSchema>;

export const VisionResultSchema = z.object({
  cognitiveLoadScore: score01, ctaVisibilityScore: score01,
  mobileIssues: z.array(z.string()), desktopIssues: z.array(z.string()),
  aboveFoldAssessment: z.string(),
});
export type VisionResult = z.infer<typeof VisionResultSchema>;

export const PageSpeedSchema = z.object({
  url: z.string().url(), lcpMs: z.number().min(0), cls: z.number().min(0),
  ttfbMs: z.number().min(0), inpMs: z.number().min(0).nullable(),
});
export type PageSpeed = z.infer<typeof PageSpeedSchema>;

export const FunnelResultSchema = z.object({
  pageSpeeds: z.array(PageSpeedSchema), avgLcpMs: z.number().min(0),
  checkoutFrictionPoints: z.array(z.string()),
  pixelCoverage: z.record(z.boolean()), missingTrackingEvents: z.array(z.string()),
});
export type FunnelResult = z.infer<typeof FunnelResultSchema>;

export const KnownMetricsSchema = z.object({
  monthlyTraffic: z.number().int().positive().optional(),
  aov: z.number().positive().optional(),
  conversionRate: z.number().gt(0).lt(1).optional(),
  monthlyAdSpend: z.number().positive().optional(),
});
export type KnownMetrics = z.infer<typeof KnownMetricsSchema>;

export const RangeValueSchema = z
  .object({ low: z.number().min(0), expected: z.number().min(0), high: z.number().min(0) })
  .refine((r) => r.low <= r.expected && r.expected <= r.high, { message: "low<=expected<=high olmalı" });
export type RangeValue = z.infer<typeof RangeValueSchema>;

export type InputSource = "measured" | "estimated";
const InputSourceSchema = z.enum(["measured", "estimated"]);

export const MethodologyNoteSchema = z.object({
  constant: z.string(), value: z.number(), source: z.string(), note: z.string(),
});
export type MethodologyNote = z.infer<typeof MethodologyNoteSchema>;

export const FinancialProjectionSchema = z.object({
  inputs: z.object({
    monthlyTraffic: z.number().min(0), aov: z.number().min(0),
    conversionRate: z.number().min(0).max(1), avgDelaySeconds: z.number().min(0),
    monthlyAdSpend: z.number().min(0).nullable(), messageCohesionScore: score01,
  }),
  inputSources: z.object({
    monthlyTraffic: InputSourceSchema, aov: InputSourceSchema,
    conversionRate: InputSourceSchema, monthlyAdSpend: InputSourceSchema,
  }),
  lostRevenueSpeed: RangeValueSchema, adWaste: RangeValueSchema.nullable(),
  totalRecoverable: RangeValueSchema, methodology: z.array(MethodologyNoteSchema),
  // Hangi girdinin GERÇEKTEN ölçülebildiği. PSI hiçbir sayfa için değer
  // döndürmediğinde `avgLcpMs` 0 gelir; 0'ı "çok hızlı site" saymak yerine
  // rapor bu alanı okuyup kalemi hesaplanmamış gösterir. `default` eski
  // kayıtları bozmaz: 0005 öncesi yazılmış raporlar `measured` sayılır.
  dataQuality: z.object({
    speed: z.enum(["measured", "missing"]).default("measured"),
  }).default({ speed: "measured" }),
});
export type FinancialProjection = z.infer<typeof FinancialProjectionSchema>;

export const RoadmapItemSchema = z.object({
  title: z.string().min(1), description: z.string(),
  category: z.enum(["speed", "semantic", "ux", "tracking", "funnel"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  impactMonthly: RangeValueSchema.nullable(), effortDays: z.number().int().min(1),
  dataReference: z.string(),
});
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;

export const BenchmarkComparisonSchema = z.object({
  metric: z.string(), label: z.string(), value: z.number(), median: z.number(),
  top10: z.number(), unit: z.enum(["ms", "ratio", "count"]),
  betterIs: z.enum(["lower", "higher"]),
});
export type BenchmarkComparison = z.infer<typeof BenchmarkComparisonSchema>;

export const DiagnooReportSchema = z.object({
  id: z.string().min(1), url: z.string().url(), locale: z.enum(["tr", "en"]),
  healthScore: z.number().min(0).max(100),
  semantic: SemanticResultSchema, vision: VisionResultSchema,
  funnel: FunnelResultSchema, financial: FinancialProjectionSchema,
  roadmap: z.array(RoadmapItemSchema), benchmarks: z.array(BenchmarkComparisonSchema),
  createdAt: z.string(),
});
export type DiagnooReport = z.infer<typeof DiagnooReportSchema>;

const PRIORITY_ORDER: Record<RoadmapItem["priority"], number> = { critical: 0, high: 1, medium: 2, low: 3 };

export type SnapshotView = {
  healthScore: number;
  topGaps: { title: string; teaser: string; category: RoadmapItem["category"]; priority: RoadmapItem["priority"] }[];
  opportunityRange: RangeValue;
  benchmarks: BenchmarkComparison[];
};

export function toSnapshot(report: DiagnooReport): SnapshotView {
  const topGaps = [...report.roadmap]
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3)
    .map((g) => ({ title: g.title, teaser: g.description, category: g.category, priority: g.priority }));
  return {
    healthScore: report.healthScore,
    topGaps,
    opportunityRange: report.financial.totalRecoverable,
    benchmarks: report.benchmarks,
  };
}
