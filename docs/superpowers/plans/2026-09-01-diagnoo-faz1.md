# Diagnoo Faz 0+1 (Çekirdek Ürün) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** URL girilen e-ticaret sitesine AI destekli GAP analizi yapıp ücretsiz Health Snapshot + lead-unlock'lu tam rapor üreten Diagnoo aracının çekirdeğini indoles-web içinde canlıya hazır hale getirmek.

**Architecture:** Analiz hattı Cloudflare Workflow olarak mevcut `custom-worker.ts` içinden export edilir (ayrı wrangler projesi YOK); tüm iş mantığı `src/lib/tools/diagnoo/` altında env-parametreli saf modüllerdedir. İlerleme ve rapor D1'e (`BOOKINGS_DB`, yeni `diagnoo_*` tabloları) yazılır; Next.js route handler'ları start/status/unlock uçlarını sunar; frontend 2 sn'de bir status poll eder.

**Tech Stack:** Next.js 15 (App Router, mevcut), TypeScript strict, Zod ^3, Cloudflare Workflows + D1, Gemini REST (`gemini-3.5-flash` → fallback `gemini-3.1-flash-lite`), Firecrawl REST, PageSpeed Insights REST, vitest 2 + better-sqlite3 D1 adaptörü. Yeni grafik kütüphanesi YOK (özel SVG/CSS).

**Spec:** `docs/superpowers/specs/2026-09-01-diagnoo-design.md`

**Revizyon R1 (2026-09-01 23:10):** GEO aracı dalı (`feat/geo-gorunurluk-denetleyicisi`) araç portföyü altyapısını kurdu; bu plan o dalın üzerine hizalandı (yerleşim `src/lib/tools/diagnoo/`, `api/tools/diagnoo-*`, `components/tools/`, migration 0004, `tool_*` GA4 taksonomisi, `hashClientIp`/`TOOL_IP_SALT` fail-closed, koşulsuz Turnstile, `TOOLS` kayıt defteri). Rulings: `.superpowers/sdd/2026-09-01-diagnoo-faz1/progress.md`.

**Spec'ten bilinçli sapmalar** (keşifte repo gerçeğiyle çakışan noktalar):
1. §9.1 `workers/diagnoo-pipeline/` yerine Workflow sınıfı `custom-worker.ts`'e eklenir — repo tek wrangler projesi (`wrangler.jsonc`), DO sınıfları da oradan export ediliyor; ikinci proje gereksiz karmaşıklık.
2. §9.5'teki GSC + Meta Ads servisleri Faz 3'e ertelendi: herkese açık URL aracı, rastgele ziyaretçinin GSC/Meta hesabına erişemez (eski Python kodu odorgo pilotuna özeldi). Formül B'nin `semantic_similarity` girdisi, sitenin 7 sayfası arasındaki **mesaj tutarlılığı skoru** (LLM) ile; `ad_spend` girdisi unlock formundaki opsiyonel "aylık reklam bütçesi" alanı ile karşılanır. Rakip/Mesaj bölümü (spec §6.5) Faz 3'e kalır; rapor Faz 1'de 6 bölümdür.
3. Grafikler: recharts/@nivo repoya EKLENMEZ (mevcut değil, bundle maliyeti); gauge/bar/funnel görselleştirmeleri design-token uyumlu özel SVG/CSS. Kurtarılan chart bileşenleri yalnız referans.
4. Yeni D1 veritabanı açılmaz; `BOOKINGS_DB`'ye `0004_diagnoo.sql` migration'ı ile `diagnoo_*` tabloları eklenir.

## Global Constraints

- pnpm 10.33.0, Node >= 22, TypeScript ^5.7.2 strict, alias `@` → `./src`.
- Zod **^3.23.8** (v3 API — `z.enum([...])`, `schema.safeParse`).
- Test: `pnpm test` (vitest run), tipler: `pnpm typecheck`, SEO: `pnpm seo:audit`. Her task sonunda üçü de yeşil kalmalı (seo:audit yalnız route task'larından itibaren etkilenir).
- Test yerleşimi: kod yanında `__tests__/`; sayfa/içerik testleri `tests/unit/`.
- D1 erişimi: rota içinde `getCloudflareContext()` + dar cast; SQL yalnız repository modülünde; testte better-sqlite3 adaptörü + `vi.mock("@opennextjs/cloudflare")`.
- E-posta: `sendMailWithRetry({ to, subject, react })` (`src/lib/mail/client.ts`); şablonlar `emails/*.tsx`.
- Anti-spam (araç rotaları): GEO kalıbı — `verifyTurnstile(token, ip)` KOŞULSUZ (`turnstileToken` şemada zorunlu; ADR-028 bayrağı araçları kapsamaz), `TOOL_IP_SALT` yoksa fail-closed `500 {error:"misconfigured"}`, D1 tabanlı IP/global sayım. Honeypot/elapsedMs kullanılmaz.
- GA4: `events.ts`'te ayrımlı birleşim + `EVENT_NAMES` listesi birlikte güncellenir; string param'lar `truncateParam` (EVENT_PARAM_MAX=100).
- Kullanıcıya görünen TR/EN metinler execution sırasında `indoles-brand-voice` skill'inden geçirilir; UI stilleri `indoles-design-tokens` skill'ine tabidir. Plandaki metinler işlevsel taslaktır.
- Migration yorumları Türkçe ve gerekçeli; dosya adı `NNNN_snake_case.sql`.
- Yeni secrets: `GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY` (wrangler secret + `.dev.vars`); koda anahtar yazılmaz.
- `custom-worker.ts` tsconfig `exclude`'unda kalır; `DOQueueHandler, DOShardedTagCache, BucketCachePurge` re-export'ları silinmez.

---

### Task 1: Faz 0 — Diagnoo arşiv deposu ve hijyen

**Files:**
- Create: `../Diagnoo/.gitignore`
- (git init `../Diagnoo` içinde — indoles-web repo'suna dokunmaz)

**Interfaces:**
- Consumes: —
- Produces: Kurtarılan Python/TSX dosyaları güvenli bir arşiv commit'inde; sonraki task'lar bunları salt referans olarak okur.

- [ ] **Step 1: .gitignore yaz**

`/Users/burakardaozgul/Development/AA - Claude Code/INDOLES - Yeni/Diagnoo/.gitignore`:

```gitignore
# Sırlar — service account / API anahtarları asla commit edilmez
*.json
!frontend/package.json
!frontend/package-lock.json
!frontend/tsconfig.json
.venv/
node_modules/
__pycache__/
.DS_Store
.env
```

- [ ] **Step 2: git init + arşiv commit**

```bash
cd "/Users/burakardaozgul/Development/AA - Claude Code/INDOLES - Yeni/Diagnoo"
git init -b main
git add -A
git status --short   # odorgo-*.json LİSTEDE OLMAMALI (gitignore doğrulaması)
git commit -m "arşiv: Drive kazasından kurtarılan Diagnoo v0 dosyaları (referans)"
```

- [ ] **Step 3: Kullanıcı aksiyonu notu**

Burak'a hatırlat (plan yürütücüsü yapamaz): GCP konsolunda eski `odorgo-e89f3b5caca7` service-account key'i iptal et; GSC entegrasyonu Faz 3'te yeni key ile kurulacak.

---

### Task 2: D1 migration — diagnoo tabloları

**Files:**
- Create: `migrations/0004_diagnoo.sql` (0003 GEO aracının `tool_scans`/`tool_leads` migration'ıdır)

**Interfaces:**
- Consumes: mevcut `BOOKINGS_DB` (indoles-bookings); GEO kalıbı `tool_scans.client_ip_hash` + `(client_ip_hash, created_at)` indeksi.
- Produces: `diagnoo_diagnostics`, `diagnoo_leads` tabloları; repository (Task 6) bu şemaya yazar. Ayrı rate-limit tablosu YOK — sayım `diagnoo_diagnostics.client_ip_hash/created_at` üzerinden.

- [ ] **Step 1: Migration dosyasını yaz**

```sql
-- Diagnoo GAP analizi aracı (spec: docs/superpowers/specs/2026-09-01-diagnoo-design.md §9.4)
-- Rapor tek JSON kolonda tutulur: pipeline çıktısı atomik yazılır, şema evrimi
-- uygulama katmanındaki Zod'da yönetilir (ayrı kolonlara normalize etmek YAGNI).
-- IP hash: tool_scans ile aynı kalıp (TOOL_IP_SALT ile SHA-256); ham IP asla yazılmaz (docs/14).

CREATE TABLE diagnoo_diagnostics (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'tr',
  status TEXT NOT NULL DEFAULT 'queued',       -- queued|running|completed|failed
  current_step TEXT,                            -- scraping|semantic|vision|funnel|financial|report
  progress_pct INTEGER NOT NULL DEFAULT 0,
  report_json TEXT,                             -- DiagnooReport (Zod ile doğrulanmış)
  fail_reason TEXT,
  client_ip_hash TEXT,
  demo_mode INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Aynı URL için 24 saat içinde tamamlanmış rapor varsa yeniden koşulmaz (maliyet koruması).
CREATE INDEX idx_diagnoo_url_completed
  ON diagnoo_diagnostics (url, created_at) WHERE status = 'completed';

-- IP başına günlük analiz limiti ve global günlük tavan bu indeksle sayılır.
CREATE INDEX idx_diagnoo_ip ON diagnoo_diagnostics (client_ip_hash, created_at);
CREATE INDEX idx_diagnoo_time ON diagnoo_diagnostics (created_at);

CREATE TABLE diagnoo_leads (
  id TEXT PRIMARY KEY,
  diagnostic_id TEXT NOT NULL REFERENCES diagnoo_diagnostics(id),
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  full_name TEXT,
  kvkk_consent INTEGER NOT NULL CHECK (kvkk_consent = 1),  -- tool_leads kalıbı: onaysız satır yazılamaz
  known_metrics_json TEXT,                      -- KnownMetrics (opsiyonel gerçek veriler)
  client_ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Bir teşhise en fazla bir lead: unlock idempotent olmalı.
CREATE UNIQUE INDEX idx_diagnoo_leads_diagnostic ON diagnoo_leads (diagnostic_id);
```

- [ ] **Step 2: Lokal migration'ı uygula ve doğrula**

```bash
pnpm wrangler d1 migrations apply indoles-bookings --local
pnpm wrangler d1 execute indoles-bookings --local --command "SELECT name FROM sqlite_master WHERE name LIKE 'diagnoo_%'"
```
Expected: iki tablo adı listelenir.

- [ ] **Step 3: Commit**

```bash
git add migrations/0004_diagnoo.sql
git commit -m "feat(diagnoo): D1 şeması — diagnostics ve leads tabloları"
```

---

### Task 3: Zod şeması (`schema.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/schema.ts`
- Test: `src/lib/tools/diagnoo/__tests__/schema.test.ts`

**Interfaces:**
- Consumes: zod ^3.
- Produces (sonraki tüm task'lar bunları import eder):
  - `PageTypeSchema`, `type PageType = "homepage"|"category"|"product"|"checkout"`
  - `ScrapedPageSchema`, `type ScrapedPage = { url: string; pageType: PageType; title: string; metaDescription: string; h1: string; headings: string[]; bodyText: string; rawHtml?: string; screenshotUrl?: string }`
  - `SemanticResultSchema`, `type SemanticResult = { uvpDetected: string; toneOfVoice: string; messageCohesionScore: number; alignmentIssues: string[]; seoKeywordIssues: string[] }`
  - `VisionResultSchema`, `type VisionResult = { cognitiveLoadScore: number; ctaVisibilityScore: number; mobileIssues: string[]; desktopIssues: string[]; aboveFoldAssessment: string }`
  - `PageSpeedSchema`, `type PageSpeed = { url: string; lcpMs: number; cls: number; ttfbMs: number; inpMs: number | null }`
  - `FunnelResultSchema`, `type FunnelResult = { pageSpeeds: PageSpeed[]; avgLcpMs: number; checkoutFrictionPoints: string[]; pixelCoverage: Record<string, boolean>; missingTrackingEvents: string[] }`
  - `KnownMetricsSchema`, `type KnownMetrics = { monthlyTraffic?: number; aov?: number; conversionRate?: number; monthlyAdSpend?: number }`
  - `RangeValueSchema`, `type RangeValue = { low: number; expected: number; high: number }`
  - `type InputSource = "measured" | "estimated"`
  - `MethodologyNoteSchema`, `type MethodologyNote = { constant: string; value: number; source: string; note: string }`
  - `FinancialProjectionSchema`, `type FinancialProjection = { inputs: { monthlyTraffic: number; aov: number; conversionRate: number; avgDelaySeconds: number; monthlyAdSpend: number | null; messageCohesionScore: number }; inputSources: Record<"monthlyTraffic"|"aov"|"conversionRate"|"monthlyAdSpend", InputSource>; lostRevenueSpeed: RangeValue; adWaste: RangeValue | null; totalRecoverable: RangeValue; methodology: MethodologyNote[] }`
  - `RoadmapItemSchema`, `type RoadmapItem = { title: string; description: string; category: "speed"|"semantic"|"ux"|"tracking"|"funnel"; priority: "critical"|"high"|"medium"|"low"; impactMonthly: RangeValue | null; effortDays: number; dataReference: string }`
  - `BenchmarkComparisonSchema`, `type BenchmarkComparison = { metric: string; label: string; value: number; median: number; top10: number; unit: "ms"|"ratio"|"count"; betterIs: "lower"|"higher" }`
  - `DiagnooReportSchema`, `type DiagnooReport = { id: string; url: string; locale: "tr"|"en"; healthScore: number; semantic: SemanticResult; vision: VisionResult; funnel: FunnelResult; financial: FinancialProjection; roadmap: RoadmapItem[]; benchmarks: BenchmarkComparison[]; createdAt: string }`
  - `type SnapshotView = { healthScore: number; topGaps: { title: string; teaser: string; category: RoadmapItem["category"]; priority: RoadmapItem["priority"] }[]; opportunityRange: RangeValue; benchmarks: BenchmarkComparison[] }`
  - `toSnapshot(report: DiagnooReport): SnapshotView`

- [ ] **Step 1: Failing test yaz**

```ts
// src/lib/tools/diagnoo/__tests__/schema.test.ts
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
```

Fixture (`src/lib/tools/diagnoo/__tests__/fixtures.ts`) — diğer test dosyaları da kullanır:

```ts
import type { DiagnooReport } from "../schema";

export function sampleReport(): DiagnooReport {
  return {
    id: "d-test-1", url: "https://ornek-magaza.com", locale: "tr", healthScore: 54,
    semantic: { uvpDetected: "Hızlı teslimatlı butik kozmetik", toneOfVoice: "samimi",
      messageCohesionScore: 0.62, alignmentIssues: ["Anasayfa vaadi ürün sayfasında yok"], seoKeywordIssues: [] },
    vision: { cognitiveLoadScore: 0.7, ctaVisibilityScore: 0.4,
      mobileIssues: ["Sepete ekle butonu fold altında"], desktopIssues: [], aboveFoldAssessment: "Kampanya bandı CTA'yı gölgeliyor" },
    funnel: { pageSpeeds: [{ url: "https://ornek-magaza.com", lcpMs: 4200, cls: 0.18, ttfbMs: 900, inpMs: 250 }],
      avgLcpMs: 4200, checkoutFrictionPoints: ["Zorunlu üyelik"], pixelCoverage: { gtag: true, meta_pixel: false },
      missingTrackingEvents: ["add_to_cart"] },
    financial: {
      inputs: { monthlyTraffic: 120000, aov: 850, conversionRate: 0.015, avgDelaySeconds: 1.7,
        monthlyAdSpend: null, messageCohesionScore: 0.62 },
      inputSources: { monthlyTraffic: "estimated", aov: "estimated", conversionRate: "estimated", monthlyAdSpend: "estimated" },
      lostRevenueSpeed: { low: 74000, expected: 114000, high: 154000 },
      adWaste: null,
      totalRecoverable: { low: 74000, expected: 114000, high: 154000 },
      methodology: [{ constant: "SPEED_LOSS_PER_SECOND", value: 0.044,
        source: "Portent (2019), sayfa hızı-dönüşüm analizi", note: "İlk 5 saniyede saniye başına ~%4,4 dönüşüm kaybı" }],
    },
    roadmap: [
      { title: "LCP'yi 2,5 sn altına indir", description: "Görsel optimizasyonu ve önbellekleme",
        category: "speed", priority: "critical", impactMonthly: { low: 60000, expected: 90000, high: 120000 },
        effortDays: 5, dataReference: "Anasayfa LCP 4200 ms (PSI)" },
      { title: "Mobilde CTA'yı fold üstüne al", description: "Sepete ekle görünürlüğü",
        category: "ux", priority: "high", impactMonthly: { low: 10000, expected: 18000, high: 26000 },
        effortDays: 2, dataReference: "Vision: cta_visibility 0.40" },
      { title: "Meta Pixel kur", description: "Remarketing kitlesi kaçıyor",
        category: "tracking", priority: "high", impactMonthly: null, effortDays: 1,
        dataReference: "pixel_coverage.meta_pixel = false" },
      { title: "Checkout'ta misafir akışı", description: "Zorunlu üyelik sürtünmesi",
        category: "funnel", priority: "medium", impactMonthly: { low: 4000, expected: 6000, high: 8000 },
        effortDays: 3, dataReference: "Checkout friction: zorunlu üyelik" },
    ],
    benchmarks: [{ metric: "lcp_ms", label: "LCP (anasayfa)", value: 4200, median: 3200, top10: 1800, unit: "ms", betterIs: "lower" }],
    createdAt: "2026-09-01T09:00:00Z",
  };
}
```

- [ ] **Step 2: Testin FAIL ettiğini gör**

Run: `pnpm vitest run src/lib/tools/diagnoo --reporter=dot`
Expected: FAIL — `Cannot find module '../schema'`

- [ ] **Step 3: schema.ts'i yaz**

```ts
// src/lib/tools/diagnoo/schema.ts
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
```

- [ ] **Step 4: Testler PASS**

Run: `pnpm vitest run src/lib/tools/diagnoo --reporter=dot` → PASS. Ardından `pnpm typecheck`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/schema.ts src/lib/tools/diagnoo/__tests__/
git commit -m "feat(diagnoo): Zod veri modeli + snapshot türetici"
```

---

### Task 4: Finansal motor v2 (`financial.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/financial.ts`
- Test: `src/lib/tools/diagnoo/__tests__/financial.test.ts`

**Interfaces:**
- Consumes: `RangeValue`, `KnownMetrics`, `FinancialProjection`, `MethodologyNote` (Task 3).
- Produces:
  - `computeFinancialProjection(input: FinancialInput): FinancialProjection` — saf, deterministik.
  - `type FinancialInput = { avgLcpMs: number; messageCohesionScore: number; known: KnownMetrics; benchmarkDefaults: { monthlyTraffic: number; aov: number; conversionRate: number } }`
  - `METHODOLOGY_CONSTANTS` (export — rapor dipnotları ve testler için).

- [ ] **Step 1: Failing test yaz**

```ts
// src/lib/tools/diagnoo/__tests__/financial.test.ts
import { describe, it, expect } from "vitest";
import { computeFinancialProjection, METHODOLOGY_CONSTANTS } from "../financial";

const base = {
  avgLcpMs: 4500, messageCohesionScore: 0.6,
  known: {}, benchmarkDefaults: { monthlyTraffic: 100000, aov: 800, conversionRate: 0.018 },
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
});
```

- [ ] **Step 2: FAIL doğrula** — `pnpm vitest run src/lib/tools/diagnoo/__tests__/financial.test.ts`

- [ ] **Step 3: financial.ts'i yaz**

```ts
// src/lib/tools/diagnoo/financial.ts
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
  methodology.push(estimatedRatio > 0 ? C.RANGE_WIDTH_ESTIMATED : C.RANGE_WIDTH_MEASURED);

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
```

- [ ] **Step 4: PASS doğrula** — `pnpm vitest run src/lib/tools/diagnoo` + `pnpm typecheck`

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/financial.ts src/lib/tools/diagnoo/__tests__/financial.test.ts
git commit -m "feat(diagnoo): finansal motor v2 — aralıklı projeksiyon + metodoloji dipnotları"
```

---

### Task 5: Benchmark seti (`benchmarks.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/benchmarks.ts`
- Test: `src/lib/tools/diagnoo/__tests__/benchmarks.test.ts`

**Interfaces:**
- Consumes: `BenchmarkComparison` (Task 3).
- Produces:
  - `BENCHMARKS_VERSION: string` (örn. `"2026-09"`)
  - `BENCHMARK_DEFAULTS: { monthlyTraffic: number; aov: number; conversionRate: number }` — finansal motorun tahmini girdileri (Task 4 `benchmarkDefaults` buradan beslenir).
  - `compareBenchmarks(input: { avgLcpMs: number; cls: number; conversionRate: number | null }): BenchmarkComparison[]`

- [ ] **Step 1: Failing test yaz**

```ts
// src/lib/tools/diagnoo/__tests__/benchmarks.test.ts
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
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: benchmarks.ts yaz**

```ts
// src/lib/tools/diagnoo/benchmarks.ts
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

export function compareBenchmarks(input: {
  avgLcpMs: number; cls: number; conversionRate: number | null;
}): BenchmarkComparison[] {
  const out: BenchmarkComparison[] = [
    { metric: "lcp_ms", value: input.avgLcpMs, ...ROWS.lcp_ms! },
    { metric: "cls", value: input.cls, ...ROWS.cls! },
  ];
  if (input.conversionRate != null) {
    out.push({ metric: "conversion_rate", value: input.conversionRate, ...ROWS.conversion_rate! });
  }
  return out;
}
```

- [ ] **Step 4: PASS + typecheck** — `pnpm vitest run src/lib/tools/diagnoo && pnpm typecheck`

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/benchmarks.ts src/lib/tools/diagnoo/__tests__/benchmarks.test.ts
git commit -m "feat(diagnoo): versiyonlu statik benchmark seti"
```

---

### Task 6: D1 repository (`repository.ts`) + paylaşılan IP hash

**Files:**
- Create: `src/lib/tools/shared/ip-hash.ts` (GEO repository'deki `hashClientIp` buraya taşınır)
- Modify: `src/lib/tools/geo/repository.ts` (`hashClientIp` gövdesi silinir; `export { hashClientIp } from "../shared/ip-hash"` ile yeniden export edilir — GEO rotaları/testleri değişmez)
- Create: `src/lib/tools/diagnoo/repository.ts`
- Test: `src/lib/tools/diagnoo/__tests__/d1-helper.ts`, `src/lib/tools/diagnoo/__tests__/repository.test.ts`, `src/lib/tools/shared/__tests__/ip-hash.test.ts`

**Interfaces:**
- Consumes: `D1Database` (global tip, `src/lib/booking/d1.d.ts`), `DiagnooReport`, `KnownMetrics` (Task 3). Booking testlerindeki better-sqlite3 adaptör kalıbı.
- Produces (route ve pipeline task'ları kullanır):
  - `hashClientIp(ip: string, salt: string): Promise<string>` — SHA-256 hex (`src/lib/tools/shared/ip-hash.ts`; GEO'daki mevcut gövde birebir).
  - `createDiagnostic(db: D1Database, input: { id: string; url: string; locale: "tr"|"en"; clientIpHash: string }): Promise<void>`
  - `findFreshCompleted(db: D1Database, url: string, maxAgeHours: number): Promise<DiagnosticRow | null>`
  - `setProgress(db: D1Database, id: string, step: string, pct: number): Promise<void>`
  - `markFailed(db: D1Database, id: string, reason: string): Promise<void>`
  - `saveReport(db: D1Database, id: string, report: DiagnooReport): Promise<void>`
  - `getDiagnostic(db: D1Database, id: string): Promise<DiagnosticRow | null>` — `type DiagnosticRow = { id: string; url: string; locale: "tr"|"en"; status: "queued"|"running"|"completed"|"failed"; currentStep: string | null; progressPct: number; report: DiagnooReport | null; failReason: string | null }`
  - `createLead(db: D1Database, input: { id: string; diagnosticId: string; email: string; company: string; fullName: string | null; knownMetrics: KnownMetrics | null; clientIpHash: string }): Promise<{ ok: true } | { ok: false; reason: "duplicate" }>`
  - `hasLead(db: D1Database, diagnosticId: string): Promise<boolean>`
  - `countDiagnosticsSince(db: D1Database, ipHash: string | null, sinceIso: string): Promise<number>` — `ipHash` null ise global sayım (GEO `countScansSince` kalıbı).

- [ ] **Step 1: Paylaşılan D1 test yardımcısı + failing testler**

```ts
// src/lib/tools/diagnoo/__tests__/d1-helper.ts
// better-sqlite3'ü D1Database arayüzüne saran test adaptörü (booking test kalıbından).
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";

export function d1(db: Database.Database): D1Database {
  return {
    prepare(query: string) {
      const stmt = db.prepare(query);
      let params: unknown[] = [];
      const api = {
        bind(...args: unknown[]) { params = args; return api; },
        async first() { return stmt.get(...params) ?? null; },
        async run() { stmt.run(...params); return { success: true }; },
        async all() { return { results: stmt.all(...params) }; },
      };
      return api;
    },
  } as unknown as D1Database;
}

export function freshDiagnooDb(): D1Database {
  const raw = new Database(":memory:");
  raw.exec(readFileSync("migrations/0003_tool_scans.sql", "utf8"));
  raw.exec(readFileSync("migrations/0004_diagnoo.sql", "utf8"));
  return d1(raw);
}
```

```ts
// src/lib/tools/shared/__tests__/ip-hash.test.ts
import { describe, it, expect } from "vitest";
import { hashClientIp } from "../ip-hash";

describe("hashClientIp", () => {
  it("64 karakter hex üretir ve deterministiktir", async () => {
    const a = await hashClientIp("1.2.3.4", "tuz");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashClientIp("1.2.3.4", "tuz")).toBe(a);
  });
  it("tuz değişince hash değişir", async () => {
    expect(await hashClientIp("1.2.3.4", "a")).not.toBe(await hashClientIp("1.2.3.4", "b"));
  });
});
```

```ts
// src/lib/tools/diagnoo/__tests__/repository.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  createDiagnostic, findFreshCompleted, setProgress, saveReport, getDiagnostic,
  createLead, hasLead, countDiagnosticsSince, markFailed,
} from "../repository";
import { sampleReport } from "./fixtures";
import { freshDiagnooDb } from "./d1-helper";

let db: D1Database;
beforeEach(() => { db = freshDiagnooDb(); });
const base = { url: "https://a.com", locale: "tr" as const, clientIpHash: "h1" };

describe("diagnoo repository", () => {
  it("teşhis oluşturur ve okur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const row = await getDiagnostic(db, "d1");
    expect(row?.status).toBe("queued");
    expect(row?.report).toBeNull();
  });

  it("progress ve rapor yazımı", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await setProgress(db, "d1", "vision", 40);
    await saveReport(db, "d1", sampleReport());
    const row = await getDiagnostic(db, "d1");
    expect(row?.status).toBe("completed");
    expect(row?.progressPct).toBe(100);
    expect(row?.report?.healthScore).toBe(54);
  });

  it("markFailed durumu ve nedeni yazar", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await markFailed(db, "d1", "scrape_failed");
    const row = await getDiagnostic(db, "d1");
    expect(row?.status).toBe("failed");
    expect(row?.failReason).toBe("scrape_failed");
  });

  it("findFreshCompleted 24 saatlik tamamlanmış raporu bulur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await saveReport(db, "d1", sampleReport());
    expect(await findFreshCompleted(db, "https://a.com", 24)).not.toBeNull();
    expect(await findFreshCompleted(db, "https://baska.com", 24)).toBeNull();
  });

  it("lead: ikinci kayıt duplicate döner, hasLead true olur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "cmo@firma.com", company: "Firma",
      fullName: null, knownMetrics: null, clientIpHash: "h1" };
    expect(await createLead(db, input)).toEqual({ ok: true });
    expect(await createLead(db, { ...input, id: "l2" })).toEqual({ ok: false, reason: "duplicate" });
    expect(await hasLead(db, "d1")).toBe(true);
  });

  it("countDiagnosticsSince: IP bazlı ve global sayım", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await createDiagnostic(db, { id: "d2", ...base, url: "https://b.com" });
    await createDiagnostic(db, { id: "d3", ...base, clientIpHash: "h2" });
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    expect(await countDiagnosticsSince(db, "h1", since)).toBe(2);
    expect(await countDiagnosticsSince(db, null, since)).toBe(3);
    expect(await countDiagnosticsSince(db, "h1", new Date(Date.now() + 60_000).toISOString())).toBe(0);
  });
});
```

- [ ] **Step 2: FAIL doğrula** — `pnpm vitest run src/lib/tools/diagnoo src/lib/tools/shared`

- [ ] **Step 3: ip-hash.ts'i çıkar, geo repository'yi yeniden export'a çevir, repository.ts'i yaz**

`src/lib/tools/shared/ip-hash.ts`: GEO `repository.ts`'teki `hashClientIp` gövdesi (`crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + salt))` → hex) birebir taşınır. GEO dosyasında gövde silinir, `export { hashClientIp } from "../shared/ip-hash";` eklenir; `pnpm vitest run src/lib/tools/geo src/app/api/tools` yeşil kalmalı.

```ts
// src/lib/tools/diagnoo/repository.ts
// SQL yalnız burada yaşar; rotalar ve pipeline bu fonksiyonları çağırır (booking/geo repository kalıbı).
import { DiagnooReportSchema, type DiagnooReport, type KnownMetrics } from "./schema";

export type DiagnosticRow = {
  id: string; url: string; locale: "tr" | "en";
  status: "queued" | "running" | "completed" | "failed";
  currentStep: string | null; progressPct: number;
  report: DiagnooReport | null; failReason: string | null;
};

type Raw = {
  id: string; url: string; locale: string; status: string; current_step: string | null;
  progress_pct: number; report_json: string | null; fail_reason: string | null;
};

function toRow(r: Raw): DiagnosticRow {
  let report: DiagnooReport | null = null;
  if (r.report_json) {
    const parsed = DiagnooReportSchema.safeParse(JSON.parse(r.report_json));
    report = parsed.success ? parsed.data : null;
  }
  return {
    id: r.id, url: r.url, locale: r.locale as "tr" | "en",
    status: r.status as DiagnosticRow["status"], currentStep: r.current_step,
    progressPct: r.progress_pct, report, failReason: r.fail_reason,
  };
}

export async function createDiagnostic(
  db: D1Database, input: { id: string; url: string; locale: "tr" | "en"; clientIpHash: string },
): Promise<void> {
  await db.prepare("INSERT INTO diagnoo_diagnostics (id, url, locale, client_ip_hash) VALUES (?, ?, ?, ?)")
    .bind(input.id, input.url, input.locale, input.clientIpHash).run();
}

export async function findFreshCompleted(
  db: D1Database, url: string, maxAgeHours: number,
): Promise<DiagnosticRow | null> {
  const row = await db.prepare(
    `SELECT * FROM diagnoo_diagnostics
     WHERE url = ? AND status = 'completed' AND created_at >= datetime('now', ?)
     ORDER BY created_at DESC LIMIT 1`,
  ).bind(url, `-${maxAgeHours} hours`).first();
  return row ? toRow(row as Raw) : null;
}

export async function setProgress(db: D1Database, id: string, step: string, pct: number): Promise<void> {
  await db.prepare(
    "UPDATE diagnoo_diagnostics SET status='running', current_step=?, progress_pct=?, updated_at=datetime('now') WHERE id=?",
  ).bind(step, pct, id).run();
}

export async function markFailed(db: D1Database, id: string, reason: string): Promise<void> {
  await db.prepare(
    "UPDATE diagnoo_diagnostics SET status='failed', fail_reason=?, updated_at=datetime('now') WHERE id=?",
  ).bind(reason, id).run();
}

export async function saveReport(db: D1Database, id: string, report: DiagnooReport): Promise<void> {
  await db.prepare(
    "UPDATE diagnoo_diagnostics SET status='completed', progress_pct=100, report_json=?, updated_at=datetime('now') WHERE id=?",
  ).bind(JSON.stringify(report), id).run();
}

export async function getDiagnostic(db: D1Database, id: string): Promise<DiagnosticRow | null> {
  const row = await db.prepare("SELECT * FROM diagnoo_diagnostics WHERE id = ? LIMIT 1").bind(id).first();
  return row ? toRow(row as Raw) : null;
}

export async function createLead(
  db: D1Database,
  input: { id: string; diagnosticId: string; email: string; company: string; fullName: string | null;
    knownMetrics: KnownMetrics | null; clientIpHash: string },
): Promise<{ ok: true } | { ok: false; reason: "duplicate" }> {
  try {
    await db.prepare(
      `INSERT INTO diagnoo_leads (id, diagnostic_id, email, company, full_name, kvkk_consent, known_metrics_json, client_ip_hash)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    ).bind(
      input.id, input.diagnosticId, input.email.trim().toLowerCase(), input.company,
      input.fullName, input.knownMetrics ? JSON.stringify(input.knownMetrics) : null, input.clientIpHash,
    ).run();
    return { ok: true };
  } catch (err) {
    if (String(err).includes("UNIQUE")) return { ok: false, reason: "duplicate" };
    throw err;
  }
}

export async function hasLead(db: D1Database, diagnosticId: string): Promise<boolean> {
  const row = await db.prepare("SELECT id FROM diagnoo_leads WHERE diagnostic_id = ? LIMIT 1")
    .bind(diagnosticId).first();
  return row != null;
}

export async function countDiagnosticsSince(
  db: D1Database, ipHash: string | null, sinceIso: string,
): Promise<number> {
  const stmt = ipHash === null
    ? db.prepare("SELECT COUNT(*) AS n FROM diagnoo_diagnostics WHERE created_at >= ?").bind(sinceIso)
    : db.prepare("SELECT COUNT(*) AS n FROM diagnoo_diagnostics WHERE client_ip_hash = ? AND created_at >= ?").bind(ipHash, sinceIso);
  const row = (await stmt.first()) as { n: number } | null;
  return row?.n ?? 0;
}
```

Not: `created_at` D1'de `datetime('now')` → `YYYY-MM-DD HH:MM:SS` biçimi; `sinceIso` karşılaştırması için rotalar `since.toISOString().slice(0, 19).replace("T", " ")` biçimini geçirir (GEO `countScansSince` ile aynı sözleşme — GEO rotasındaki `sinceIso` üretimini birebir kopyala; testte de aynı biçimi kullan).

- [ ] **Step 4: PASS + typecheck** — `pnpm vitest run src/lib/tools && pnpm typecheck` (geo testleri de yeşil)

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/shared/ src/lib/tools/geo/repository.ts src/lib/tools/diagnoo/repository.ts src/lib/tools/diagnoo/__tests__/
git commit -m "feat(diagnoo): D1 repository + paylaşılan IP hash yardımcısı"
```

---

### Task 7: Dış servis istemcileri (`services/firecrawl.ts`, `services/gemini.ts`, `services/psi.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/services/firecrawl.ts`, `src/lib/tools/diagnoo/services/gemini.ts`, `src/lib/tools/diagnoo/services/psi.ts`
- Test: `src/lib/tools/diagnoo/__tests__/services.test.ts`

**Interfaces:**
- Consumes: global `fetch`; env değerleri parametre olarak (rota/pipeline geçirir — `getCloudflareContext` burada ÇAĞRILMAZ, cron-job kalıbı).
- Produces:
  - `type DiagnooEnv = { GEMINI_API_KEY: string; FIRECRAWL_API_KEY: string; PSI_API_KEY?: string }`
  - `scrapePage(env: DiagnooEnv, url: string, opts?: { screenshot?: boolean; rawHtml?: boolean }): Promise<FirecrawlPage>` — `type FirecrawlPage = { markdown: string; rawHtml: string | null; links: string[]; screenshotUrl: string | null; title: string; description: string }`. Hata: `throw new ScrapeError(url, status)`.
  - `class ScrapeError extends Error { constructor(public url: string, public status: number) }`
  - `geminiJson<T>(env: DiagnooEnv, opts: { system: string; user: string; schema: ZodType<T>; imagesBase64?: string[] }): Promise<T>` — JSON mode; Zod doğrulaması geçmezse hata mesajını ekleyip 1 onarım denemesi; `gemini-3.5-flash` 429/5xx verirse `gemini-3.1-flash-lite`'a düşer.
  - `fetchCwv(env: DiagnooEnv, url: string): Promise<{ lcpMs: number; cls: number; ttfbMs: number; inpMs: number | null } | null>` — PSI hatasında `null` (pipeline "veri yetersiz" yolunu kullanır).

- [ ] **Step 1: Failing test yaz** (fetch mock ile; ağa çıkılmaz)

```ts
// src/lib/tools/diagnoo/__tests__/services.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import { scrapePage, ScrapeError } from "../services/firecrawl";
import { geminiJson } from "../services/gemini";
import { fetchCwv } from "../services/psi";

const env = { GEMINI_API_KEY: "g-key", FIRECRAWL_API_KEY: "f-key", PSI_API_KEY: "p-key" };
const fetchMock = vi.fn();
beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
afterEach(() => { vi.unstubAllGlobals(); });

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("scrapePage", () => {
  it("markdown/links/screenshot döndürür", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      success: true,
      data: { markdown: "# Mağaza", links: ["https://a.com/urun"], screenshot: "https://cdn/ss.png",
        metadata: { title: "Mağaza", description: "Açıklama" } },
    }));
    const page = await scrapePage(env, "https://a.com", { screenshot: true });
    expect(page.markdown).toContain("Mağaza");
    expect(page.links).toHaveLength(1);
    expect(page.screenshotUrl).toBe("https://cdn/ss.png");
    const [reqUrl, init] = fetchMock.mock.calls[0]!;
    expect(String(reqUrl)).toContain("firecrawl");
    expect((init as RequestInit).headers).toMatchObject({ Authorization: "Bearer f-key" });
  });
  it("hata durumunda ScrapeError fırlatır", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: false }, 402));
    await expect(scrapePage(env, "https://a.com")).rejects.toBeInstanceOf(ScrapeError);
  });
});

describe("geminiJson", () => {
  const schema = z.object({ score: z.number() });
  const geminiBody = (text: string) => ({ candidates: [{ content: { parts: [{ text }] } }] });

  it("geçerli JSON'u Zod'dan geçirip döndürür", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(geminiBody('{"score": 0.7}')));
    const out = await geminiJson(env, { system: "s", user: "u", schema });
    expect(out.score).toBe(0.7);
    expect(String(fetchMock.mock.calls[0]![0])).toContain("gemini-3.5-flash");
  });
  it("bozuk JSON'da bir onarım denemesi yapar", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(geminiBody("skor: yüksek")))
      .mockResolvedValueOnce(jsonResponse(geminiBody('{"score": 0.5}')));
    const out = await geminiJson(env, { system: "s", user: "u", schema });
    expect(out.score).toBe(0.5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("429'da fallback modele düşer", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(jsonResponse(geminiBody('{"score": 0.9}')));
    const out = await geminiJson(env, { system: "s", user: "u", schema });
    expect(out.score).toBe(0.9);
    expect(String(fetchMock.mock.calls[1]![0])).toContain("gemini-3.1-flash-lite");
  });
});

describe("fetchCwv", () => {
  it("PSI cevabından metrikleri çıkarır", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      lighthouseResult: { audits: {
        "largest-contentful-paint": { numericValue: 4123 },
        "cumulative-layout-shift": { numericValue: 0.15 },
        "server-response-time": { numericValue: 820 },
        "interaction-to-next-paint": { numericValue: 240 },
      } },
    }));
    const cwv = await fetchCwv(env, "https://a.com");
    expect(cwv).toEqual({ lcpMs: 4123, cls: 0.15, ttfbMs: 820, inpMs: 240 });
  });
  it("PSI hatasında null döner (fırlatmaz)", async () => {
    fetchMock.mockResolvedValueOnce(new Response("err", { status: 500 }));
    expect(await fetchCwv(env, "https://a.com")).toBeNull();
  });
});
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: Üç servis dosyasını yaz**

```ts
// src/lib/tools/diagnoo/services/firecrawl.ts
export type DiagnooEnv = { GEMINI_API_KEY: string; FIRECRAWL_API_KEY: string; PSI_API_KEY?: string };

export type FirecrawlPage = {
  markdown: string; rawHtml: string | null; links: string[];
  screenshotUrl: string | null; title: string; description: string;
};

export class ScrapeError extends Error {
  constructor(public url: string, public status: number) {
    super(`Firecrawl scrape failed (${status}): ${url}`);
  }
}

export async function scrapePage(
  env: DiagnooEnv, url: string, opts: { screenshot?: boolean; rawHtml?: boolean } = {},
): Promise<FirecrawlPage> {
  const formats = ["markdown", "links", ...(opts.screenshot ? ["screenshot"] : []), ...(opts.rawHtml ? ["rawHtml"] : [])];
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ url, formats, timeout: 30000 }),
  });
  const body = (await res.json().catch(() => null)) as {
    success?: boolean;
    data?: { markdown?: string; rawHtml?: string; links?: string[]; screenshot?: string;
      metadata?: { title?: string; description?: string } };
  } | null;
  if (!res.ok || !body?.success || !body.data) throw new ScrapeError(url, res.status);
  return {
    markdown: body.data.markdown ?? "",
    rawHtml: body.data.rawHtml ?? null,
    links: body.data.links ?? [],
    screenshotUrl: body.data.screenshot ?? null,
    title: body.data.metadata?.title ?? "",
    description: body.data.metadata?.description ?? "",
  };
}
```

```ts
// src/lib/tools/diagnoo/services/gemini.ts
import type { ZodType } from "zod";
import type { DiagnooEnv } from "./firecrawl";

const PRIMARY = "gemini-3.5-flash";
const FALLBACK = "gemini-3.1-flash-lite";

function endpoint(model: string, key: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

async function callOnce(env: DiagnooEnv, model: string, system: string, user: string, imagesBase64: string[]): Promise<{ ok: true; text: string } | { ok: false; status: number }> {
  const parts: unknown[] = [{ text: user }];
  for (const img of imagesBase64) parts.push({ inlineData: { mimeType: "image/png", data: img } });
  const res = await fetch(endpoint(model, env.GEMINI_API_KEY), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });
  if (!res.ok) return { ok: false, status: res.status };
  const body = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  return { ok: true, text: body.candidates?.[0]?.content?.parts?.[0]?.text ?? "" };
}

export async function geminiJson<T>(
  env: DiagnooEnv,
  opts: { system: string; user: string; schema: ZodType<T>; imagesBase64?: string[] },
): Promise<T> {
  const images = opts.imagesBase64 ?? [];
  let result = await callOnce(env, PRIMARY, opts.system, opts.user, images);
  if (!result.ok && (result.status === 429 || result.status >= 500)) {
    result = await callOnce(env, FALLBACK, opts.system, opts.user, images);
  }
  if (!result.ok) throw new Error(`Gemini error: ${result.status}`);

  const tryParse = (text: string): T | null => {
    try {
      const parsed = opts.schema.safeParse(JSON.parse(text));
      return parsed.success ? parsed.data : null;
    } catch { return null; }
  };

  const first = tryParse(result.text);
  if (first !== null) return first;

  // Tek onarım denemesi: bozuk çıktıyı şema hatırlatmasıyla geri gönder.
  const repair = await callOnce(env, PRIMARY, opts.system,
    `${opts.user}\n\nÖnceki cevabın geçerli JSON değildi:\n${result.text}\nYALNIZCA şemaya uyan geçerli JSON döndür.`, []);
  if (repair.ok) {
    const second = tryParse(repair.text);
    if (second !== null) return second;
  }
  throw new Error("Gemini output failed schema validation after repair attempt");
}
```

```ts
// src/lib/tools/diagnoo/services/psi.ts
import type { DiagnooEnv } from "./firecrawl";

export async function fetchCwv(
  env: DiagnooEnv, url: string,
): Promise<{ lcpMs: number; cls: number; ttfbMs: number; inpMs: number | null } | null> {
  const key = env.PSI_API_KEY ? `&key=${env.PSI_API_KEY}` : "";
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE${key}`;
  try {
    const res = await fetch(api);
    if (!res.ok) return null;
    const body = (await res.json()) as { lighthouseResult?: { audits?: Record<string, { numericValue?: number }> } };
    const audits = body.lighthouseResult?.audits;
    if (!audits) return null;
    const lcp = audits["largest-contentful-paint"]?.numericValue;
    if (lcp == null) return null;
    return {
      lcpMs: lcp,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? 0,
      ttfbMs: audits["server-response-time"]?.numericValue ?? 0,
      inpMs: audits["interaction-to-next-paint"]?.numericValue ?? null,
    };
  } catch { return null; }
}
```

- [ ] **Step 4: PASS + typecheck**

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/services/
git add src/lib/tools/diagnoo/__tests__/services.test.ts
git commit -m "feat(diagnoo): Firecrawl, Gemini (JSON+fallback+onarım), PSI istemcileri"
```

---

### Task 8: Sayfa keşfi (`page-discovery.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/page-discovery.ts`
- Test: `src/lib/tools/diagnoo/__tests__/page-discovery.test.ts`

**Interfaces:**
- Consumes: `scrapePage`, `geminiJson`, `DiagnooEnv` (Task 7); `ScrapedPage`, `PageType` (Task 3).
- Produces: `discoverAndScrapePages(env: DiagnooEnv, rootUrl: string): Promise<ScrapedPage[]>` — anasayfayı scrape eder, linklerinden Gemini ile 2 kategori + 3 ürün + 1 checkout URL'i seçtirir, hepsini scrape edip 7'ye kadar `ScrapedPage` döndürür (checkout bulunamazsa 6 — hata değil). Anasayfa scrape edilemezse `ScrapeError` yukarı fırlar (pipeline dürüst hata verir).

- [ ] **Step 1: Failing test yaz**

```ts
// src/lib/tools/diagnoo/__tests__/page-discovery.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { discoverAndScrapePages } from "../page-discovery";

vi.mock("../services/firecrawl", async (importActual) => {
  const actual = await importActual<typeof import("../services/firecrawl")>();
  return { ...actual, scrapePage: vi.fn() };
});
vi.mock("../services/gemini", () => ({ geminiJson: vi.fn() }));

import { scrapePage } from "../services/firecrawl";
import { geminiJson } from "../services/gemini";

const env = { GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "f" };
const page = (over: Record<string, unknown> = {}) => ({
  markdown: "# Başlık\nMetin", rawHtml: "<html></html>", links: [],
  screenshotUrl: "https://cdn/ss.png", title: "T", description: "D", ...over,
});

beforeEach(() => { vi.mocked(scrapePage).mockReset(); vi.mocked(geminiJson).mockReset(); });

describe("discoverAndScrapePages", () => {
  it("anasayfa + sınıflandırılan 6 sayfayı scrape eder", async () => {
    vi.mocked(scrapePage).mockResolvedValue(page({
      links: ["https://a.com/k1", "https://a.com/k2", "https://a.com/p1", "https://a.com/p2", "https://a.com/p3", "https://a.com/sepet"],
    }) as never);
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://a.com/k2"],
      product: ["https://a.com/p1", "https://a.com/p2", "https://a.com/p3"],
      checkout: "https://a.com/sepet",
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    expect(pages).toHaveLength(7);
    expect(pages.filter((p) => p.pageType === "product")).toHaveLength(3);
    expect(pages[0]!.pageType).toBe("homepage");
  });

  it("checkout yoksa 6 sayfayla devam eder", async () => {
    vi.mocked(scrapePage).mockResolvedValue(page({ links: ["https://a.com/k1"] }) as never);
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://a.com/k2"],
      product: ["https://a.com/p1", "https://a.com/p2", "https://a.com/p3"],
      checkout: null,
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    expect(pages.filter((p) => p.pageType === "checkout")).toHaveLength(0);
  });

  it("tek tek sayfa scrape hataları yutulur (kısmi sonuç)", async () => {
    const { ScrapeError } = await vi.importActual<typeof import("../services/firecrawl")>("../services/firecrawl");
    vi.mocked(scrapePage)
      .mockResolvedValueOnce(page({ links: ["https://a.com/k1"] }) as never)  // homepage
      .mockRejectedValueOnce(new ScrapeError("https://a.com/k1", 500))        // k1 düşer
      .mockResolvedValue(page() as never);                                     // kalanlar
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://a.com/k2"],
      product: ["https://a.com/p1"], checkout: null,
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    expect(pages.some((p) => p.url === "https://a.com/k1")).toBe(false);
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: page-discovery.ts yaz**

```ts
// src/lib/tools/diagnoo/page-discovery.ts
import { z } from "zod";
import { scrapePage, type DiagnooEnv, type FirecrawlPage } from "./services/firecrawl";
import { geminiJson } from "./services/gemini";
import type { PageType, ScrapedPage } from "./schema";

const ClassificationSchema = z.object({
  category: z.array(z.string().url()).max(2),
  product: z.array(z.string().url()).max(3),
  checkout: z.string().url().nullable(),
});

function headings(markdown: string): string[] {
  return markdown.split("\n").filter((l) => /^#{1,3} /.test(l)).map((l) => l.replace(/^#+ /, "").trim()).slice(0, 20);
}

function toScraped(url: string, pageType: PageType, p: FirecrawlPage): ScrapedPage {
  return {
    url, pageType, title: p.title, metaDescription: p.description,
    h1: headings(p.markdown)[0] ?? "", headings: headings(p.markdown),
    bodyText: p.markdown.slice(0, 12000),
    ...(p.rawHtml ? { rawHtml: p.rawHtml.slice(0, 300_000) } : {}), // ücretsiz plan CPU bütçesi (regex taraması)
    ...(p.screenshotUrl ? { screenshotUrl: p.screenshotUrl } : {}),
  };
}

export async function discoverAndScrapePages(env: DiagnooEnv, rootUrl: string): Promise<ScrapedPage[]> {
  // Anasayfa: screenshot (vision) + rawHtml (pixel tespiti) ile. Hata yukarı fırlar.
  const home = await scrapePage(env, rootUrl, { screenshot: true, rawHtml: true });

  const classification = await geminiJson(env, {
    system: "Bir e-ticaret sitesinin link listesinden sayfa tiplerini seçen bir sınıflandırıcısın. YALNIZCA JSON döndür.",
    user: [
      `Site: ${rootUrl}`,
      `Linkler:\n${home.links.slice(0, 150).join("\n")}`,
      'Şu şemayla seç: {"category": [en fazla 2 kategori/koleksiyon URL], "product": [en fazla 3 ürün detay URL], "checkout": sepet/checkout URL veya null}. Aynı domain dışındakileri eleme.',
    ].join("\n\n"),
    schema: ClassificationSchema,
  });

  const targets: { url: string; pageType: PageType; screenshot: boolean; rawHtml: boolean }[] = [
    ...classification.category.map((u) => ({ url: u, pageType: "category" as const, screenshot: false, rawHtml: false })),
    ...classification.product.map((u) => ({ url: u, pageType: "product" as const, screenshot: true, rawHtml: false })),
    ...(classification.checkout
      ? [{ url: classification.checkout, pageType: "checkout" as const, screenshot: true, rawHtml: true }]
      : []),
  ];

  const pages: ScrapedPage[] = [toScraped(rootUrl, "homepage", home)];
  for (const t of targets) {
    try {
      const p = await scrapePage(env, t.url, { screenshot: t.screenshot, rawHtml: t.rawHtml });
      pages.push(toScraped(t.url, t.pageType, p));
    } catch {
      // Tek sayfa hatası pipeline'ı durdurmaz; kısmi külliyatla devam (spec §10).
    }
  }
  return pages;
}
```

- [ ] **Step 4: PASS + typecheck**

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/page-discovery.ts src/lib/tools/diagnoo/__tests__/page-discovery.test.ts
git commit -m "feat(diagnoo): sayfa keşfi — anasayfa linklerinden 7 kritik sayfa"
```

---

### Task 9: Analiz ajanları (`agents/semantic.ts`, `agents/vision.ts`, `agents/funnel.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/agents/semantic.ts`, `src/lib/tools/diagnoo/agents/vision.ts`, `src/lib/tools/diagnoo/agents/funnel.ts`
- Test: `src/lib/tools/diagnoo/__tests__/agents.test.ts`

**Interfaces:**
- Consumes: `geminiJson`, `fetchCwv`, `DiagnooEnv` (Task 7); şema tipleri (Task 3).
- Produces:
  - `analyzeSemantic(env: DiagnooEnv, pages: ScrapedPage[], locale: "tr"|"en"): Promise<SemanticResult>`
  - `analyzeVision(env: DiagnooEnv, pages: ScrapedPage[], locale: "tr"|"en"): Promise<VisionResult>` — screenshot'lı ilk 3 sayfanın görselini indirip base64'e çevirir (`fetch` + `arrayBuffer`), Gemini'ye multimodal gönderir; hiç screenshot yoksa görselsiz metin analiziyle devam eder.
  - `analyzeFunnel(env: DiagnooEnv, pages: ScrapedPage[]): Promise<FunnelResult>` — anasayfa+ürün sayfaları için `fetchCwv` (null'lar atlanır; hepsi null ise `avgLcpMs = 0` yerine `3000` varsayılan KULLANILMAZ — boş `pageSpeeds` + `avgLcpMs: 0` döner, finansal motor 0 gecikme sayar, rapor "hız verisi alınamadı" rozeti gösterir); pixel tespiti rawHtml regex: `gtag/js|googletagmanager` → gtag, `connect.facebook.net|fbq\(` → meta_pixel, `static.hotjar|clarity.ms` → session_analytics; checkout sürtünmesi checkout sayfası markdown'ı üzerinden `geminiJson` ile.

- [ ] **Step 1: Failing test yaz**

```ts
// src/lib/tools/diagnoo/__tests__/agents.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeSemantic } from "../agents/semantic";
import { analyzeVision } from "../agents/vision";
import { analyzeFunnel } from "../agents/funnel";
import type { ScrapedPage } from "../schema";

vi.mock("../services/gemini", () => ({ geminiJson: vi.fn() }));
vi.mock("../services/psi", () => ({ fetchCwv: vi.fn() }));
import { geminiJson } from "../services/gemini";
import { fetchCwv } from "../services/psi";

const env = { GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "f" };
const mkPage = (over: Partial<ScrapedPage>): ScrapedPage => ({
  url: "https://a.com", pageType: "homepage", title: "T", metaDescription: "D",
  h1: "H", headings: ["H"], bodyText: "içerik", ...over,
});

beforeEach(() => { vi.mocked(geminiJson).mockReset(); vi.mocked(fetchCwv).mockReset(); });

describe("analyzeSemantic", () => {
  it("Gemini çıktısını SemanticResult olarak döndürür ve prompt tüm sayfa tiplerini içerir", async () => {
    vi.mocked(geminiJson).mockResolvedValue({
      uvpDetected: "u", toneOfVoice: "t", messageCohesionScore: 0.5,
      alignmentIssues: [], seoKeywordIssues: [],
    } as never);
    const out = await analyzeSemantic(env, [mkPage({}), mkPage({ pageType: "product", url: "https://a.com/p" })], "tr");
    expect(out.messageCohesionScore).toBe(0.5);
    const call = vi.mocked(geminiJson).mock.calls[0]![1];
    expect(call.user).toContain("homepage");
    expect(call.user).toContain("product");
  });
});

describe("analyzeVision", () => {
  it("screenshot'ları base64 olarak Gemini'ye iletir", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]))));
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.3, ctaVisibilityScore: 0.8,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "ok",
    } as never);
    const out = await analyzeVision(env, [mkPage({ screenshotUrl: "https://cdn/ss.png" })], "tr");
    expect(out.ctaVisibilityScore).toBe(0.8);
    expect(vi.mocked(geminiJson).mock.calls[0]![1].imagesBase64?.length).toBe(1);
    vi.unstubAllGlobals();
  });
  it("screenshot yoksa görselsiz devam eder", async () => {
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.5, ctaVisibilityScore: 0.5,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "metin bazlı",
    } as never);
    const out = await analyzeVision(env, [mkPage({})], "tr");
    expect(out.aboveFoldAssessment).toBe("metin bazlı");
  });
});

describe("analyzeFunnel", () => {
  it("CWV toplar, pixel'leri rawHtml'den tespit eder, checkout sürtünmesini LLM'e sorar", async () => {
    vi.mocked(fetchCwv).mockResolvedValue({ lcpMs: 4000, cls: 0.1, ttfbMs: 800, inpMs: 200 });
    vi.mocked(geminiJson).mockResolvedValue({ checkoutFrictionPoints: ["Zorunlu üyelik"] } as never);
    const pages = [
      mkPage({ rawHtml: '<script src="https://www.googletagmanager.com/gtag/js"></script>' }),
      mkPage({ pageType: "checkout", url: "https://a.com/c", rawHtml: "<html></html>", bodyText: "checkout" }),
    ];
    const out = await analyzeFunnel(env, pages);
    expect(out.avgLcpMs).toBe(4000);
    expect(out.pixelCoverage.gtag).toBe(true);
    expect(out.pixelCoverage.meta_pixel).toBe(false);
    expect(out.checkoutFrictionPoints).toContain("Zorunlu üyelik");
    expect(out.missingTrackingEvents).toContain("meta_pixel");
  });
  it("tüm PSI çağrıları null ise boş pageSpeeds ve avgLcpMs 0", async () => {
    vi.mocked(fetchCwv).mockResolvedValue(null);
    const out = await analyzeFunnel(env, [mkPage({ rawHtml: "<html></html>" })]);
    expect(out.pageSpeeds).toHaveLength(0);
    expect(out.avgLcpMs).toBe(0);
  });
});
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: Üç ajan dosyasını yaz**

```ts
// src/lib/tools/diagnoo/agents/semantic.ts
import { SemanticResultSchema, type ScrapedPage, type SemanticResult } from "../schema";
import { geminiJson } from "../services/gemini";
import type { DiagnooEnv } from "../services/firecrawl";

export async function analyzeSemantic(
  env: DiagnooEnv, pages: ScrapedPage[], locale: "tr" | "en",
): Promise<SemanticResult> {
  const corpus = pages.map((p) =>
    `--- [${p.pageType}] ${p.url}\nTitle: ${p.title}\nH1: ${p.h1}\nBaşlıklar: ${p.headings.join(" | ")}\nİçerik:\n${p.bodyText.slice(0, 3000)}`,
  ).join("\n\n");
  const lang = locale === "tr" ? "Türkçe" : "İngilizce";
  return geminiJson(env, {
    system: `Kıdemli bir CRO ve marka mesajı analistisin. Bir e-ticaret sitesinin sayfaları arasındaki mesaj tutarlılığını değerlendirirsin. Bulguları ${lang} yaz. YALNIZCA JSON döndür.`,
    user: [
      "Aşağıdaki sayfaları analiz et:",
      corpus,
      `Şema: {"uvpDetected": "sitenin tespit edilen benzersiz değer önerisi", "toneOfVoice": "tek kelimelik ton etiketi", "messageCohesionScore": 0-1 arası sayı (anasayfa vaadinin kategori/ürün/checkout sayfalarında ne kadar tutarlı sürdürüldüğü; 1 = tam tutarlı), "alignmentIssues": ["somut tutarsızlık bulguları — hangi sayfada ne eksik"], "seoKeywordIssues": ["başlık/H1 hiyerarşisindeki anahtar kelime sorunları"]}`,
      "Her bulguda sayfa URL'sini an. Genel geçer laf yok; kanıt göster.",
    ].join("\n\n"),
    schema: SemanticResultSchema,
  });
}
```

```ts
// src/lib/tools/diagnoo/agents/vision.ts
import { VisionResultSchema, type ScrapedPage, type VisionResult } from "../schema";
import { geminiJson } from "../services/gemini";
import type { DiagnooEnv } from "../services/firecrawl";

async function toBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    // Native latin1 decode + btoa: karakter döngüsü ücretsiz plan adım CPU bütçesini (~10 ms) aşar.
    const bytes = new Uint8Array(await res.arrayBuffer());
    return btoa(new TextDecoder("latin1").decode(bytes));
  } catch { return null; }
}

export async function analyzeVision(
  env: DiagnooEnv, pages: ScrapedPage[], locale: "tr" | "en",
): Promise<VisionResult> {
  const withShots = pages.filter((p) => p.screenshotUrl).slice(0, 3);
  const images = (await Promise.all(withShots.map((p) => toBase64(p.screenshotUrl!))))
    .filter((s): s is string => s !== null);
  const lang = locale === "tr" ? "Türkçe" : "İngilizce";
  const pageList = withShots.map((p, i) => `Görsel ${i + 1}: [${p.pageType}] ${p.url}`).join("\n");
  return geminiJson(env, {
    system: `Kıdemli bir UI/UX denetçisisin. E-ticaret ekran görüntülerinde bilişsel yük ve CTA görünürlüğünü değerlendirirsin. Bulguları ${lang} yaz. YALNIZCA JSON döndür.`,
    user: [
      images.length > 0 ? `Ekran görüntüleri sırayla:\n${pageList}` : "Ekran görüntüsü alınamadı; sayfa metin yapısından çıkarım yap:",
      images.length === 0 ? pages.map((p) => `[${p.pageType}] H1: ${p.h1} | Başlıklar: ${p.headings.join(", ")}`).join("\n") : "",
      `Şema: {"cognitiveLoadScore": 0-1 (0=sade, 1=aşırı kalabalık), "ctaVisibilityScore": 0-1 (fold üstünde ana CTA ne kadar baskın), "mobileIssues": ["somut mobil sorunlar"], "desktopIssues": ["somut masaüstü sorunlar"], "aboveFoldAssessment": "fold üstünde ne görünüyor, tek paragraf"}`,
      "Her bulgu hangi sayfaya/görsele aitse belirt.",
    ].filter(Boolean).join("\n\n"),
    schema: VisionResultSchema,
    imagesBase64: images,
  });
}
```

```ts
// src/lib/tools/diagnoo/agents/funnel.ts
import { z } from "zod";
import type { FunnelResult, PageSpeed, ScrapedPage } from "../schema";
import { geminiJson } from "../services/gemini";
import { fetchCwv } from "../services/psi";
import type { DiagnooEnv } from "../services/firecrawl";

const PIXEL_PATTERNS: Record<string, RegExp> = {
  gtag: /gtag\/js|googletagmanager\.com/i,
  meta_pixel: /connect\.facebook\.net|fbq\(/i,
  session_analytics: /static\.hotjar|clarity\.ms/i,
};

const FrictionSchema = z.object({ checkoutFrictionPoints: z.array(z.string()) });

export async function analyzeFunnel(env: DiagnooEnv, pages: ScrapedPage[]): Promise<FunnelResult> {
  // CWV: anasayfa + ürün sayfaları (en fazla 3 PSI çağrısı — kota koruması).
  const speedTargets = pages.filter((p) => p.pageType === "homepage" || p.pageType === "product").slice(0, 3);
  const pageSpeeds: PageSpeed[] = [];
  for (const p of speedTargets) {
    const cwv = await fetchCwv(env, p.url);
    if (cwv) pageSpeeds.push({ url: p.url, ...cwv });
  }
  const avgLcpMs = pageSpeeds.length > 0
    ? Math.round(pageSpeeds.reduce((s, p) => s + p.lcpMs, 0) / pageSpeeds.length)
    : 0;

  // Pixel tespiti: rawHtml'i olan tüm sayfalarda ara.
  const html = pages.map((p) => p.rawHtml ?? "").join("\n");
  const pixelCoverage = Object.fromEntries(
    Object.entries(PIXEL_PATTERNS).map(([k, re]) => [k, re.test(html)]),
  );
  const missingTrackingEvents = Object.entries(pixelCoverage)
    .filter(([, present]) => !present).map(([k]) => k);

  // Checkout sürtünmesi: checkout sayfası varsa LLM değerlendirir.
  const checkout = pages.find((p) => p.pageType === "checkout");
  let checkoutFrictionPoints: string[] = [];
  if (checkout) {
    const out = await geminiJson(env, {
      system: "E-ticaret checkout akışı denetçisisin. YALNIZCA JSON döndür.",
      user: `Checkout sayfası içeriği:\n${checkout.bodyText.slice(0, 4000)}\n\nŞema: {"checkoutFrictionPoints": ["somut sürtünme noktaları: zorunlu üyelik, gizli kargo ücreti, fazla form alanı vb."]}`,
      schema: FrictionSchema,
    });
    checkoutFrictionPoints = out.checkoutFrictionPoints;
  }

  return { pageSpeeds, avgLcpMs, checkoutFrictionPoints, pixelCoverage, missingTrackingEvents };
}
```

- [ ] **Step 4: PASS + typecheck**

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/agents/ src/lib/tools/diagnoo/__tests__/agents.test.ts
git commit -m "feat(diagnoo): semantik, vision ve funnel ajanları"
```

---

### Task 10: Rapor birleştirici (`report.ts`)

**Files:**
- Create: `src/lib/tools/diagnoo/report.ts`
- Test: `src/lib/tools/diagnoo/__tests__/report.test.ts`

**Interfaces:**
- Consumes: tüm ajan çıktı tipleri, `computeFinancialProjection` (Task 4), `compareBenchmarks`/`BENCHMARK_DEFAULTS` (Task 5), `geminiJson` (Task 7).
- Produces:
  - `computeHealthScore(input: { semantic: SemanticResult; vision: VisionResult; funnel: FunnelResult }): number` — deterministik 0–100: `semantic.messageCohesionScore*25 + (1-vision.cognitiveLoadScore)*12.5 + vision.ctaVisibilityScore*12.5 + speedScore*30 + trackingScore*20`; `speedScore = clamp01(1 - max(0, avgLcpMs-2500)/4000)` (avgLcpMs 0 ise 0.5 nötr), `trackingScore = mevcut pixel oranı`.
  - `buildRoadmap(env: DiagnooEnv, input: { semantic; vision; funnel; financial: FinancialProjection; locale: "tr"|"en" }): Promise<RoadmapItem[]>` — Gemini'den 5–8 madde ister; her maddenin `dataReference`'ı ajan bulgularından birine işaret etmeli; `impactMonthly` toplamlarının `financial.totalRecoverable.expected`'i aşmaması sonradan `scaleRoadmapImpacts` ile normalize edilir.
  - `scaleRoadmapImpacts(roadmap: RoadmapItem[], total: RangeValue): RoadmapItem[]` — impact'li maddelerin expected toplamı `total.expected`'i aşarsa oransal küçültür.
  - `assembleReport(env, input: { id: string; url: string; locale: "tr"|"en"; semantic; vision; funnel; known: KnownMetrics }): Promise<DiagnooReport>` — financial + benchmarks + roadmap + healthScore'u birleştirir.
  - `recomputeWithKnownMetrics(report: DiagnooReport, known: KnownMetrics): DiagnooReport` — saf; finansal projeksiyonu yeni girdilerle yeniden hesaplar, roadmap impact'lerini eski/yeni toplam oranıyla ölçekler, benchmarks CR satırını günceller.

- [ ] **Step 1: Failing test yaz**

```ts
// src/lib/tools/diagnoo/__tests__/report.test.ts
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
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: report.ts yaz**

```ts
// src/lib/tools/diagnoo/report.ts
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
```

- [ ] **Step 4: PASS + typecheck**

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/diagnoo/report.ts src/lib/tools/diagnoo/__tests__/report.test.ts
git commit -m "feat(diagnoo): rapor birleştirici — health score, roadmap, recompute"
```

---

### Task 11: Pipeline + Workflow kaydı

**Files:**
- Create: `src/lib/tools/diagnoo/pipeline.ts`
- Modify: `custom-worker.ts` (Workflow sınıfı export'u), `wrangler.jsonc` (workflows binding)
- Test: `src/lib/tools/diagnoo/__tests__/pipeline.test.ts`

**Interfaces:**
- Consumes: Task 6–10'un tüm fonksiyonları.
- Produces:
  - `type StepRunner = { do<T>(name: string, fn: () => Promise<T>): Promise<T> }` — Cloudflare `WorkflowStep`'in yapısal alt kümesi; `src/` içinde `cloudflare:workers` import edilmez.
  - `type PipelineEnv = DiagnooEnv & { BOOKINGS_DB: D1Database }`
  - `runDiagnosticPipeline(env: PipelineEnv, step: StepRunner, diagnosticId: string): Promise<void>` — adımlar: `scraping(15%) → semantic(35%) → vision(55%) → funnel(70%) → financial+report(90%) → save(100%)`; her adım öncesi `setProgress`; `ScrapeError`'da `markFailed(db, id, "scrape_failed")` ve sessiz dönüş; diğer hatalarda `markFailed(..., "pipeline_error")` sonra rethrow (Workflows retry'ı devralır).
  - `custom-worker.ts` içinde: `export class DiagnooDiagnosticWorkflow extends WorkflowEntrypoint<Env, { diagnosticId: string }> { async run(event, step) { await runDiagnosticPipeline(this.env as unknown as PipelineEnv, step, event.payload.diagnosticId); } }`
  - `wrangler.jsonc`'ye: `"workflows": [{ "name": "diagnoo-diagnostic", "binding": "DIAGNOO_WORKFLOW", "class_name": "DiagnooDiagnosticWorkflow" }]`

- [ ] **Step 1: Failing test yaz** (tüm alt modüller mock; adım sırası ve hata yolları doğrulanır)

```ts
// src/lib/tools/diagnoo/__tests__/pipeline.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { runDiagnosticPipeline, type StepRunner } from "../pipeline";
import { sampleReport } from "./fixtures";

vi.mock("../page-discovery", () => ({ discoverAndScrapePages: vi.fn() }));
vi.mock("../agents/semantic", () => ({ analyzeSemantic: vi.fn() }));
vi.mock("../agents/vision", () => ({ analyzeVision: vi.fn() }));
vi.mock("../agents/funnel", () => ({ analyzeFunnel: vi.fn() }));
vi.mock("../report", async (importActual) => {
  const actual = await importActual<typeof import("../report")>();
  return { ...actual, assembleReport: vi.fn() };
});
vi.mock("../repository", () => ({
  getDiagnostic: vi.fn(), setProgress: vi.fn(), saveReport: vi.fn(), markFailed: vi.fn(),
}));

import { discoverAndScrapePages } from "../page-discovery";
import { analyzeSemantic } from "../agents/semantic";
import { analyzeVision } from "../agents/vision";
import { analyzeFunnel } from "../agents/funnel";
import { assembleReport } from "../report";
import { getDiagnostic, setProgress, saveReport, markFailed } from "../repository";
import { ScrapeError } from "../services/firecrawl";

const step: StepRunner = { do: (_name, fn) => fn() };
const env = { GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "f", BOOKINGS_DB: {} as D1Database };
const report = sampleReport();

beforeEach(() => {
  vi.mocked(getDiagnostic).mockResolvedValue({
    id: "d1", url: "https://a.com", locale: "tr", status: "queued",
    currentStep: null, progressPct: 0, report: null, failReason: null,
  });
  vi.mocked(discoverAndScrapePages).mockResolvedValue([]);
  vi.mocked(analyzeSemantic).mockResolvedValue(report.semantic);
  vi.mocked(analyzeVision).mockResolvedValue(report.vision);
  vi.mocked(analyzeFunnel).mockResolvedValue(report.funnel);
  vi.mocked(assembleReport).mockResolvedValue(report);
  vi.mocked(saveReport).mockResolvedValue();
  vi.mocked(setProgress).mockResolvedValue();
  vi.mocked(markFailed).mockResolvedValue();
});

describe("runDiagnosticPipeline", () => {
  it("mutlu yol: adımları sırayla koşar ve raporu kaydeder", async () => {
    await runDiagnosticPipeline(env, step, "d1");
    expect(saveReport).toHaveBeenCalledWith(env.BOOKINGS_DB, "d1", report);
    const steps = vi.mocked(setProgress).mock.calls.map((c) => c[2]);
    expect(steps).toEqual(["scraping", "semantic", "vision", "funnel", "financial", "report"]);
  });

  it("anasayfa scrape hatasında markFailed(scrape_failed) ve sessiz dönüş", async () => {
    vi.mocked(discoverAndScrapePages).mockRejectedValue(new ScrapeError("https://a.com", 500));
    await expect(runDiagnosticPipeline(env, step, "d1")).resolves.toBeUndefined();
    expect(markFailed).toHaveBeenCalledWith(env.BOOKINGS_DB, "d1", "scrape_failed");
    expect(saveReport).not.toHaveBeenCalled();
  });

  it("diğer hatalar markFailed sonrası rethrow edilir (Workflows retry)", async () => {
    vi.mocked(analyzeSemantic).mockRejectedValue(new Error("gemini down"));
    await expect(runDiagnosticPipeline(env, step, "d1")).rejects.toThrow("gemini down");
    expect(markFailed).toHaveBeenCalledWith(env.BOOKINGS_DB, "d1", "pipeline_error");
  });

  it("kayıt yoksa hiçbir şey yapmaz", async () => {
    vi.mocked(getDiagnostic).mockResolvedValue(null);
    await runDiagnosticPipeline(env, step, "yok");
    expect(setProgress).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: pipeline.ts yaz**

```ts
// src/lib/tools/diagnoo/pipeline.ts
// Workflow adım mantığı. cloudflare:workers burada import EDİLMEZ (cron-job kalıbı:
// entrypoint custom-worker.ts'te, mantık env-parametreli).
import { discoverAndScrapePages } from "./page-discovery";
import { analyzeSemantic } from "./agents/semantic";
import { analyzeVision } from "./agents/vision";
import { analyzeFunnel } from "./agents/funnel";
import { assembleReport } from "./report";
import { getDiagnostic, markFailed, saveReport, setProgress } from "./repository";
import { ScrapeError, type DiagnooEnv } from "./services/firecrawl";

export type StepRunner = { do<T>(name: string, fn: () => Promise<T>): Promise<T> };
export type PipelineEnv = DiagnooEnv & { BOOKINGS_DB: D1Database };

export async function runDiagnosticPipeline(
  env: PipelineEnv, step: StepRunner, diagnosticId: string,
): Promise<void> {
  const db = env.BOOKINGS_DB;
  const row = await getDiagnostic(db, diagnosticId);
  if (!row) return;

  try {
    await setProgress(db, diagnosticId, "scraping", 15);
    const pages = await step.do("scrape", () => discoverAndScrapePages(env, row.url));

    await setProgress(db, diagnosticId, "semantic", 35);
    const semantic = await step.do("semantic", () => analyzeSemantic(env, pages, row.locale));

    await setProgress(db, diagnosticId, "vision", 55);
    const vision = await step.do("vision", () => analyzeVision(env, pages, row.locale));

    await setProgress(db, diagnosticId, "funnel", 70);
    const funnel = await step.do("funnel", () => analyzeFunnel(env, pages));

    await setProgress(db, diagnosticId, "financial", 90);
    const report = await step.do("report", () =>
      assembleReport(env, { id: diagnosticId, url: row.url, locale: row.locale, semantic, vision, funnel, known: {} }),
    );

    await setProgress(db, diagnosticId, "report", 95);
    await saveReport(db, diagnosticId, report);
  } catch (err) {
    if (err instanceof ScrapeError) {
      // Dürüst hata: siteye erişilemedi — retry anlamsız (spec §10).
      await markFailed(db, diagnosticId, "scrape_failed");
      return;
    }
    await markFailed(db, diagnosticId, "pipeline_error");
    throw err; // Workflows adım retry mekanizması devralır.
  }
}
```

- [ ] **Step 4: PASS doğrula**, sonra `custom-worker.ts`'e Workflow sınıfını ekle

`custom-worker.ts` içine (mevcut DO re-export'larının YANINA — hiçbirini silmeden):

```ts
import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { runDiagnosticPipeline, type PipelineEnv } from "./src/lib/tools/diagnoo/pipeline";

export class DiagnooDiagnosticWorkflow extends WorkflowEntrypoint<unknown, { diagnosticId: string }> {
  async run(event: WorkflowEvent<{ diagnosticId: string }>, step: WorkflowStep): Promise<void> {
    await runDiagnosticPipeline(this.env as unknown as PipelineEnv, step, event.payload.diagnosticId);
  }
}
```

`wrangler.jsonc`'ye (üst seviyeye):

```jsonc
"workflows": [
  { "name": "diagnoo-diagnostic", "binding": "DIAGNOO_WORKFLOW", "class_name": "DiagnooDiagnosticWorkflow" }
],
```

- [ ] **Step 5: ADR-032 + sır dokümantasyonu**

`docs/decisions/ADR-032-diagnoo-workflow-ve-dis-api.md` yaz (ADR-030 biçiminde): Bağlam — ADR-030 Diagnoo'yu "Seçenek B — ertelendi" saymış ve ücretsiz plan / sıfır yeni altyapı disiplinini kural yapmıştı; spec (docs/superpowers/specs/2026-09-01-diagnoo-design.md, Burak onaylı) Workflows + dış API (Gemini, Firecrawl, PageSpeed Insights) kararını veriyor. Karar — Diagnoo mevcut Worker içinde Cloudflare Workflow (ücretsiz plan) olarak koşar; adım başına CPU bütçesi korunur (I/O-bound adımlar, native base64); yeni sırlar `GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY`; D1 aynı veritabanı (0004). Reddedilenler — ayrı Python servisi (ikinci platform), paid plan, regex-only motor (LLM analizi gerektiriyor). Sonuçlar — wrangler.jsonc'a ilk `workflows` binding'i; dış API maliyeti IP 3/gün + global 100/gün ile sınırlanır; ADR-030'un "yeniden değerlendirme tetikleyicisi" bu ADR ile tüketildi. `README.md`'deki ADR-030 sır uyarı bloğuna üç yeni sır eklenir; `.dev.vars.example` (yoksa oluştur) üç satır alır.

- [ ] **Step 6: Build doğrulaması**

Run: `pnpm typecheck && pnpm cf:build`
Expected: ikisi de temiz. (`custom-worker.ts` tsconfig dışı olduğundan typecheck onu görmez; cf:build worker'ı derleyerek doğrular.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/tools/diagnoo/pipeline.ts src/lib/tools/diagnoo/__tests__/pipeline.test.ts custom-worker.ts wrangler.jsonc docs/decisions/ADR-032-diagnoo-workflow-ve-dis-api.md README.md .dev.vars.example
git commit -m "feat(diagnoo): Workflow pipeline + ADR-032 (Workflows ve dış API kararı)"
```

---

### Task 12: API route'ları + lead e-postası

**Files:**
- Modify: `src/lib/schemas/tools.ts` (istek şemaları buraya — GEO kalıbı)
- Create: `src/app/api/tools/diagnoo-start/route.ts`, `src/app/api/tools/diagnoo-status/[id]/route.ts`, `src/app/api/tools/diagnoo-unlock/route.ts`, `emails/DiagnooLeadNotification.tsx`
- Test: `src/app/api/tools/__tests__/diagnoo-routes.test.ts`, `emails/__tests__/diagnoo-lead-notification.test.tsx`

**Interfaces:**
- Consumes: repository + `hashClientIp` (Task 6), `toSnapshot`/`KnownMetricsSchema` (Task 3), `recomputeWithKnownMetrics` (Task 10), `sendMailWithRetry`/`recipients` (`@/lib/mail/client`), `verifyTurnstile` (`@/lib/security/turnstile`), `reportError` (`@/lib/observability/report`), `getCloudflareContext` (`@opennextjs/cloudflare`). GEO rotaları `src/app/api/tools/geo-scan/route.ts` ve `geo-report/route.ts` yapı emsalidir (env cast, `errorResponse`, `cf-connecting-ip`, koşulsuz Turnstile, `TOOL_IP_SALT` fail-closed, `sinceIso` üretimi) — aynı sırayı izle.
- Produces:
  - `src/lib/schemas/tools.ts`'e:
    ```ts
    export const diagnooStartSchema = z.object({
      url: z.string().url().max(2048), locale: z.enum(["tr", "en"]), turnstileToken: z.string().min(1),
    });
    export type DiagnooStartPayload = z.infer<typeof diagnooStartSchema>;
    export const diagnooUnlockSchema = z.object({
      diagnosticId: z.string().uuid(), email: z.string().email(),
      company: z.string().min(2).max(120), fullName: z.string().max(120).optional(),
      knownMetrics: KnownMetricsSchema.optional(), kvkkConsent: z.literal(true),
      turnstileToken: z.string().min(1),
    });
    export type DiagnooUnlockPayload = z.infer<typeof diagnooUnlockSchema>;
    ```
    (`KnownMetricsSchema` `@/lib/tools/diagnoo/schema`'dan import edilir.)
  - `POST /api/tools/diagnoo-start` → `202 { id: string; reused: boolean }` | `400 {error:"invalid"}` | `403 {error:"turnstile-failed"}` | `500 {error:"misconfigured"}` (TOOL_IP_SALT yok / D1 hatası) | `429 {error:"rate-limited"}`. Sıra: json → `diagnooStartSchema.safeParse` → ip (`cf-connecting-ip`, yoksa `"0.0.0.0"`) → `verifyTurnstile(token, ip)` → `process.env.TOOL_IP_SALT` yoksa misconfigured → `hashClientIp` → `countDiagnosticsSince(db, ipHash, since24h) >= IP_DAILY_LIMIT (3)` → 429 → `countDiagnosticsSince(db, null, since24h) >= GLOBAL_DAILY_LIMIT (100)` → 429 → URL normalize (`const u = new URL(url); u.origin + u.pathname.replace(/\/$/, "")`) → `findFreshCompleted(db, normalized, 24)` varsa `{ id, reused: true }` → `crypto.randomUUID()` + `createDiagnostic` + `env.DIAGNOO_WORKFLOW.create({ params: { diagnosticId } })` → `202 { id, reused: false }`.
  - `GET /api/tools/diagnoo-status/[id]` (`type Ctx = { params: Promise<{ id: string }> }`) → `200 { status, currentStep, progressPct, failReason, snapshot: SnapshotView | null, report: DiagnooReport | null, leadCaptured: boolean }` — `snapshot` completed olunca dolu; `report` yalnız `leadCaptured` true iken (kilit sunucu sözleşmesi — ADR-030 carry-note 3 ile aynı ilke). `404 {error:"not-found"}`.
  - `POST /api/tools/diagnoo-unlock` → `200 { report: DiagnooReport }` | `400 invalid` | `403 turnstile-failed` | `500 misconfigured` | `404 not-found` | `409 {error:"not-ready"}`. Sıra: json → şema → ip → Turnstile → salt → hash → `getDiagnostic` (yok → 404; status ≠ completed veya report null → 409) → `createLead` (duplicate → devam, idempotent) → `knownMetrics` varsa `recomputeWithKnownMetrics` + `saveReport` → satış e-postası `try/catch` (hata: `reportError(err, { route: "diagnoo-unlock", step: "mail" })` + `console.error`, cevap ENGELLENMEZ — spec §10) → `200 { report }`.
  - Env cast: `type DiagnooRouteEnv = { BOOKINGS_DB: D1Database; DIAGNOO_WORKFLOW: { create(opts: { params: { diagnosticId: string } }): Promise<unknown> } }`; `export const runtime = "nodejs"`.
  - E-posta: `emails/DiagnooLeadNotification.tsx` — props `{ email: string; company: string; fullName: string | null; url: string; healthScore: number; totalRecoverable: RangeValue; hasRealMetrics: boolean; reportPath: string }`; alıcı `recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr")`; konu `Diagnoo lead — ${company} — ${healthScore}/100`; `reportPath` = `/tr/araclar/diagnoo/rapor/${id}`. Şablon `GeoReportEmail`'in `audience:"sales"` bloğunu emsal alır (React Email bileşenleri, TR metin).

- [ ] **Step 1: Failing testler yaz**

```ts
// src/app/api/tools/__tests__/diagnoo-routes.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";

vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));
vi.mock("@/lib/mail/client", () => ({ sendMailWithRetry: vi.fn(), recipients: () => ["satis@indoles.com.tr"] }));
vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: vi.fn().mockResolvedValue(true) }));
vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

import { POST as startPOST } from "../diagnoo-start/route";
import { GET as statusGET } from "../diagnoo-status/[id]/route";
import { POST as unlockPOST } from "../diagnoo-unlock/route";
import { saveReport, createDiagnostic } from "@/lib/tools/diagnoo/repository";
import { sampleReport } from "@/lib/tools/diagnoo/__tests__/fixtures";
import { freshDiagnooDb } from "@/lib/tools/diagnoo/__tests__/d1-helper";
import { sendMailWithRetry } from "@/lib/mail/client";
import { verifyTurnstile } from "@/lib/security/turnstile";

let db: D1Database;
const workflowCreate = vi.fn();
const ID = "11111111-1111-4111-8111-111111111111";
const base = { url: "https://a.com", locale: "tr" as const, clientIpHash: "h" };

beforeEach(() => {
  db = freshDiagnooDb();
  workflowCreate.mockReset();
  vi.stubEnv("TOOL_IP_SALT", "test-salt");
  vi.mocked(getCloudflareContext).mockReturnValue({
    env: { BOOKINGS_DB: db, DIAGNOO_WORKFLOW: { create: workflowCreate } },
  } as never);
});
afterEach(() => { vi.unstubAllEnvs(); });

const post = (url: string, body: unknown) => new Request(`http://localhost${url}`, {
  method: "POST",
  headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4" },
  body: JSON.stringify(body),
});
const get = (url: string) => new Request(`http://localhost${url}`);
const startBody = (url: string) => ({ url, locale: "tr", turnstileToken: "tok" });

describe("POST /api/tools/diagnoo-start", () => {
  it("teşhis oluşturur ve workflow başlatır", async () => {
    const res = await startPOST(post("/api/tools/diagnoo-start", startBody("https://a.com")));
    expect(res.status).toBe(202);
    const body = (await res.json()) as { id: string; reused: boolean };
    expect(body.reused).toBe(false);
    expect(workflowCreate).toHaveBeenCalledWith({ params: { diagnosticId: body.id } });
  });
  it("24 saatlik taze rapor varsa yeniden koşturmaz (normalize URL ile eşleşir)", async () => {
    await createDiagnostic(db, { id: ID, ...base });      // normalize form: sondaki / yok
    await saveReport(db, ID, sampleReport());
    const res = await startPOST(post("/api/tools/diagnoo-start", startBody("https://a.com/")));
    expect(((await res.json()) as { reused: boolean }).reused).toBe(true);
    expect(workflowCreate).not.toHaveBeenCalled();
  });
  it("aynı IP 4. istekte 429", async () => {
    for (let i = 0; i < 3; i++) await startPOST(post("/api/tools/diagnoo-start", startBody(`https://s${i}.com`)));
    const res = await startPOST(post("/api/tools/diagnoo-start", startBody("https://s4.com")));
    expect(res.status).toBe(429);
  });
  it("Turnstile başarısızsa 403", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await startPOST(post("/api/tools/diagnoo-start", startBody("https://a.com")));
    expect(res.status).toBe(403);
  });
  it("TOOL_IP_SALT yoksa 500 misconfigured (fail-closed)", async () => {
    vi.stubEnv("TOOL_IP_SALT", "");
    const res = await startPOST(post("/api/tools/diagnoo-start", startBody("https://a.com")));
    expect(res.status).toBe(500);
    expect(((await res.json()) as { error: string }).error).toBe("misconfigured");
  });
  it("geçersiz URL 400", async () => {
    const res = await startPOST(post("/api/tools/diagnoo-start", startBody("abc")));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/tools/diagnoo-status/[id]", () => {
  it("completed + lead yokken snapshot döner, report dönmez", async () => {
    await createDiagnostic(db, { id: ID, ...base });
    await saveReport(db, ID, sampleReport());
    const res = await statusGET(get(`/api/tools/diagnoo-status/${ID}`), { params: Promise.resolve({ id: ID }) });
    const body = (await res.json()) as { snapshot: unknown; report: unknown; leadCaptured: boolean };
    expect(body.snapshot).toBeTruthy();
    expect(body.report).toBeNull();
    expect(body.leadCaptured).toBe(false);
  });
  it("bilinmeyen id 404", async () => {
    const res = await statusGET(get("/api/tools/diagnoo-status/yok"), { params: Promise.resolve({ id: "yok" }) });
    expect(res.status).toBe(404);
  });
});

describe("POST /api/tools/diagnoo-unlock", () => {
  const unlockBody = (over: Record<string, unknown> = {}) => ({
    diagnosticId: ID, email: "cmo@firma.com", company: "Firma", kvkkConsent: true, turnstileToken: "tok", ...over,
  });
  beforeEach(async () => {
    await createDiagnostic(db, { id: ID, ...base });
    await saveReport(db, ID, sampleReport());
  });
  it("lead yazar, satış e-postası atar, tam raporu döner", async () => {
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    expect(res.status).toBe(200);
    expect(((await res.json()) as { report: { healthScore: number } }).report.healthScore).toBe(54);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(1);
  });
  it("knownMetrics ile finansal recompute edilir ve status'ta report açılır", async () => {
    await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ knownMetrics: { monthlyTraffic: 500000 } })));
    const status = await statusGET(get(`/api/tools/diagnoo-status/${ID}`), { params: Promise.resolve({ id: ID }) });
    const body = (await status.json()) as { report: { financial: { inputs: { monthlyTraffic: number } } }; leadCaptured: boolean };
    expect(body.leadCaptured).toBe(true);
    expect(body.report.financial.inputs.monthlyTraffic).toBe(500000);
  });
  it("kvkkConsent olmadan 400", async () => {
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ kvkkConsent: false })));
    expect(res.status).toBe(400);
  });
  it("e-posta hatası raporu engellemez", async () => {
    vi.mocked(sendMailWithRetry).mockRejectedValueOnce(new Error("smtp down"));
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    expect(res.status).toBe(200);
  });
  it("ikinci unlock idempotent (200, tek lead)", async () => {
    await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    expect(res.status).toBe(200);
  });
  it("teşhis tamam değilse 409", async () => {
    const other = "22222222-2222-4222-8222-222222222222";
    await createDiagnostic(db, { id: other, ...base, url: "https://b.com" });
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ diagnosticId: other })));
    expect(res.status).toBe(409);
  });
});
```

E-posta şablon testi (`emails/__tests__/diagnoo-lead-notification.test.tsx`): `render(<DiagnooLeadNotification ... />)` çıktısında e-posta, şirket, url, skor ve `reportPath` geçer; `hasRealMetrics` true iken "gerçek veri" ibaresi var (mevcut `geo-report-email.test.tsx` kalıbı).

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: Şemaları, rotaları ve şablonu yaz** — GEO rotalarının yapısını (runtime, `errorResponse`, sıra, `sinceIso` üretimi) aynen izle; Interfaces bloğundaki akış ve dönüş kodlarını uygula. Sabitler dosya başında: `IP_DAILY_LIMIT = 3`, `GLOBAL_DAILY_LIMIT = 100`, `FRESH_HOURS = 24`.

- [ ] **Step 4: PASS + typecheck** — `pnpm vitest run src/app/api/tools emails && pnpm typecheck` (GEO rota testleri de yeşil)

- [ ] **Step 5: Commit**

```bash
git add src/lib/schemas/tools.ts src/app/api/tools/diagnoo-start src/app/api/tools/diagnoo-status src/app/api/tools/diagnoo-unlock src/app/api/tools/__tests__/diagnoo-routes.test.ts emails/DiagnooLeadNotification.tsx emails/__tests__/diagnoo-lead-notification.test.tsx
git commit -m "feat(diagnoo): start/status/unlock rotaları + satış lead bildirimi"
```

---

### Task 13: GA4 event genişletmesi (tools taksonomisi)

**Files:**
- Modify: `src/lib/analytics/events.ts`
- Test: `src/lib/analytics/__tests__/events.test.ts` (mevcut dosyaya ekleme)

**Interfaces:**
- Consumes: mevcut `EVENT_NAMES`/`AnalyticsEvent` kalıbı ve GEO'nun `tool_used` / `tool_scan_completed` / `tool_report_requested` olayları (`band: GeoBand`), `BookingCtaSource`.
- Produces (spec §8'in `diagnostic_*` olayları GEO `tool_*` taksonomisine eşlendi — ledger ruling):
  - `export type HealthScoreBucket = "0-25" | "26-50" | "51-75" | "76-100"`; `export type ToolBand = GeoBand | HealthScoreBucket`; `tool_scan_completed` ve `tool_report_requested` property'lerindeki `band: GeoBand` → `band: ToolBand`.
  - `export function healthScoreBucket(score: number): HealthScoreBucket` (0–25 / 26–50 / 51–75 / 76–100).
  - Yeni varyantlar + `EVENT_NAMES` girdileri: `{ name: "tool_roadmap_item_expanded"; properties: { slug: string; category: "speed"|"semantic"|"ux"|"tracking"|"funnel"; locale: "tr"|"en" } }`, `{ name: "tool_service_cta_clicked"; properties: { slug: string; target_service: string; locale: "tr"|"en" } }`.
  - `BookingCtaSource`'a `| "tool-diagnoo-report"`.
  - Diagnoo eşlemesi (UI Task 15 uygular): URL gönderimi → `tool_used{slug:"diagnoo"}`; snapshot görünümü → `tool_scan_completed{slug:"diagnoo", band: healthScoreBucket(score)}`; unlock başarısı → `tool_report_requested{slug:"diagnoo", band}`; yol haritası `<details>` açılışı → `tool_roadmap_item_expanded`; rapor içi hizmet linki → `tool_service_cta_clicked`.

- [ ] **Step 1: Mevcut test dosyasına failing testler ekle**

```ts
it("diagnoo tools eventleri EVENT_NAMES'te kayıtlı", () => {
  for (const name of ["tool_roadmap_item_expanded", "tool_service_cta_clicked"]) expect(EVENT_NAMES).toContain(name);
});

it("healthScoreBucket sınırları doğru kovalar", () => {
  expect(healthScoreBucket(0)).toBe("0-25");
  expect(healthScoreBucket(25)).toBe("0-25");
  expect(healthScoreBucket(26)).toBe("26-50");
  expect(healthScoreBucket(54)).toBe("51-75");
  expect(healthScoreBucket(100)).toBe("76-100");
});

it("tool_scan_completed sağlık kovasını band olarak kabul eder (tip)", () => {
  const ev: AnalyticsEvent = { name: "tool_scan_completed", properties: { slug: "diagnoo", band: "51-75", locale: "tr" } };
  expect(ev.name).toBe("tool_scan_completed");
});
```

- [ ] **Step 2: FAIL doğrula** → **Step 3:** tipleri, varyantları, `EVENT_NAMES` girdilerini ve `healthScoreBucket`'ı ekle (dosyanın mevcut düzenine uyarak; `AssertNamesCovered` derleme güvencesi otomatik doğrular) → **Step 4: PASS + typecheck** (GEO bileşen testleri de yeşil — `band` genişlemesi geriye uyumlu) → **Step 5: Commit**

```bash
git add src/lib/analytics/events.ts src/lib/analytics/__tests__/events.test.ts
git commit -m "feat(diagnoo): GA4 tools taksonomisi — sağlık kovası bandı, roadmap ve hizmet CTA olayları"
```

---

### Task 14: Araç kaydı + route'lar — `/araclar/diagnoo` ve rapor sayfası

**Files:**
- Modify: `src/lib/content/tools.ts` (Diagnoo kaydı; `ToolSignal.id` tipi `GeoCheckId | DiagnooSignalId`), `src/lib/i18n/routing.ts` (pathnames: `"/araclar/diagnoo": { tr: "/araclar/diagnoo", en: "/tools/diagnoo" }`, `"/araclar/diagnoo/rapor/[id]": { tr: "/araclar/diagnoo/rapor/[id]", en: "/tools/diagnoo/report/[id]" }`), `src/app/(marketing)/[locale]/araclar/page.tsx` (META metni iki araca göre; `ItemList` zaten `TOOLS.length`), `src/components/v2/V2Chrome.tsx` (`TOOL_HERO_ROUTES`'a `"/araclar/diagnoo"`), `docs/02-information-architecture.md` (route satırları)
- Create: `src/lib/tools/diagnoo/signals.ts` (`export type DiagnooSignalId = "speed" | "semantic" | "ux" | "tracking" | "funnel"` + `DIAGNOO_SLUG = "diagnoo"`), `src/app/(marketing)/[locale]/araclar/diagnoo/page.tsx`, `src/app/(marketing)/[locale]/araclar/diagnoo/rapor/[id]/page.tsx`
- Test: `tests/unit/tools-content.test.ts` (otomatik kapsar), `tests/unit/sitemap.test.ts` + `tests/unit/seo-alternates.test.ts` + `tests/unit/page-metadata.test.ts`'e yeni URL beklentileri, `tests/unit/seo-audit.test.ts` (yol → `tool` profili)

**Interfaces:**
- Consumes: `ToolContent` şekli (`slug/name/eyebrow/lede` Localized, `steps` tam 3, `signals`, `faq` tam 6 — her cevap ≥40 kelime, anafora ile başlamaz, soru tekrarı yok —, `seo.title` ≤50, `seo.description` 140–160, `footnote`), GEO sayfası `araclar/geo-gorunurluk-denetleyicisi/page.tsx` iskeleti (hero + form + adımlar + sinyaller + SSS + JSON-LD grafiği `organizationLd/webPageLd/breadcrumbLd/softwareApplicationLd/faqLd`), `sonuc/[id]/page.tsx` noindex kalıbı (`runtime = "nodejs"`, `dynamic = "force-dynamic"`, `robots: { index: false, follow: true }`), `buildMetadata`, `getToolBySlug`, repository `getDiagnostic`/`hasLead` (Task 6), `toSnapshot` (Task 3).
- Produces: TR `/araclar/diagnoo` + EN `/tools/diagnoo` (indeks, sitemap, llms.txt `TOOLS`'tan otomatik); `<DiagnooTool locale tool={content} />` yuvası (Task 15 bileşeni; bu task'ta geçici olarak `null` render eden bir iskelet bileşen `src/components/tools/diagnoo-tool.tsx` oluşturulur — Task 15 doldurur); rapor sayfası `rapor/[id]`: teşhis yoksa `notFound()`; lead varsa `<DiagnooReport report />`, yoksa `<DiagnooSnapshot snapshot diagnosticId />` + unlock formu (Task 15 bileşenleri; bu task'ta iskelet).
- İçerik: metinler işlevsel taslak — execution'da `indoles-brand-voice` skill'i zorunlu; SSS soruları Diagnoo'nun ne ölçtüğü, verinin nereden geldiği, tahmini/gerçek veri farkı, süre, KVKK, ücret; `signals` beş kategori (`DiagnooSignalId`) ağırlıkları rapor skorlamasıyla (25/25/30/20 — semantik/UX/hız-funnel/ölçüm) uyumlu, `funnel` ağırlığı hız-funnel'ın içinde açıklanır.

- [ ] **Step 1:** Mevcut sitemap/alternates/metadata/seo-audit testlerine failing beklentiler ekle (`/tr/araclar/diagnoo` + `/en/tools/diagnoo` sitemap'te; `rapor/[id]` sitemap'te DEĞİL; hreflang çifti; `araclar/diagnoo` yolu `tool` profili)
- [ ] **Step 2:** FAIL doğrula (`pnpm vitest run tests/unit`)
- [ ] **Step 3:** `signals.ts`, `tools.ts` kaydı + tip genişletme, routing, indeks META, `TOOL_HERO_ROUTES`, iki sayfa, iskelet bileşen, docs/02 satırları
- [ ] **Step 4:** `pnpm test && pnpm typecheck && pnpm seo:audit` — üçü yeşil (`tools-content` testi 6 SSS/uzunluk kurallarını, `seo:audit` tool profilini doğrular: FAQPage + SoftwareApplication LD, ≥300 kelime, ≥4 iç link)
- [ ] **Step 5: Commit**

```bash
git add src/lib/content/tools.ts src/lib/tools/diagnoo/signals.ts src/lib/i18n/routing.ts "src/app/(marketing)/[locale]/araclar/" src/components/tools/diagnoo-tool.tsx src/components/v2/V2Chrome.tsx docs/02-information-architecture.md tests/unit/
git commit -m "feat(diagnoo): araç kaydı, /araclar/diagnoo ve noindex rapor sayfası"
```

---

### Task 15: Araç UI'ı (client bileşenleri)

**Files:**
- Create: `src/components/tools/use-turnstile.ts` (GEO `geo-scan-form.tsx` içindeki Turnstile render/poll/expire/clear mantığı `useTurnstileToken({ enabled }): { token, containerRef, reset, error }` hook'una çıkarılır — sabitler `TURNSTILE_POLL_MS=300`, `TURNSTILE_POLL_LIMIT=60`, `TURNSTILE_TOKEN_TIMEOUT_MS=25_000` korunur), `src/components/tools/diagnoo-tool.tsx` (Task 14 iskeleti doldurulur: durum makinesi idle → running → snapshot → unlocked; `useDiagnooStatus`), `src/components/tools/diagnoo-form.tsx` (`DiagnooForm`: URL + Turnstile; submit → `tool_used`), `src/components/tools/diagnoo-progress.tsx` (`DiagnooProgress`: 6 adım), `src/components/tools/diagnoo-snapshot.tsx` (`DiagnooSnapshot`: gauge SVG + benchmark rozeti + kilitli GAP kartları + fırsat aralığı; mount'ta `tool_scan_completed`), `src/components/tools/diagnoo-unlock-form.tsx` (`DiagnooUnlockForm`: e-posta, şirket, ad-soyad, KVKK onay kutusu, opsiyonel metrik alanları — trafik/AOV/CR/reklam bütçesi —, Turnstile; başarı → `tool_report_requested`), `src/components/tools/diagnoo-report.tsx` (`DiagnooReport`: 6 bölüm — özet, skor karnesi bar'ları, GAP kartları, finansal tablo + metodoloji `<details>`, yol haritası `<details>` satırları → `tool_roadmap_item_expanded`, INDOLES CTA `<PopupCTAButton source="tool-diagnoo-report">` + hizmet linkleri → `tool_service_cta_clicked`), `src/components/tools/use-diagnoo-status.ts`
- Modify: `src/components/tools/geo-scan-form.tsx` (hook'u kullanır; davranış aynı; `tests/unit/tools-geo/geo-scan-form.test.tsx` yeşil kalır)
- Test: `src/components/tools/__tests__/use-diagnoo-status.test.ts` (hook: 2 sn poll → completed'da durur; fetch mock; jsdom için `vitest.config.ts` `environmentMatchGlobs`'a bu dosya), `src/components/tools/__tests__/diagnoo-snapshot.test.tsx` (kilitli kartlarda ₺/`impactMonthly` rakamı render edilmez; skor ve 3 GAP başlığı görünür), `src/components/tools/__tests__/diagnoo-unlock-form.test.tsx` (KVKK işaretsiz submit engellenir; başarıda `onUnlocked(report)` çağrılır)

**Interfaces:**
- Consumes: Task 12 API sözleşmeleri (`diagnoo-start`/`diagnoo-status/[id]`/`diagnoo-unlock`), Task 13 olayları + `track()` + `healthScoreBucket`, `SnapshotView`/`DiagnooReport`/`RangeValue` tipleri, GEO bileşen kalıpları (`useState` formlar, `COPY` sabitleri, `ERROR_MAP` → kullanıcı mesajı, `history.replaceState` ile sonuç URL'i `getPathname({ href: { pathname: "/araclar/diagnoo/rapor/[id]", params: { id } }, locale })`), `indoles-design-tokens` skill'i (execution'da yüklenir), `PopupCTAButton`.
- Produces: `<DiagnooTool locale tool />` (Task 14 sayfası render eder); `useDiagnooStatus(id: string | null)` → `{ status, progressPct, currentStep, failReason, snapshot, report, leadCaptured, refetch }`.
- Görselleştirme: grafik kütüphanesi YOK — gauge tek `<svg>` arc, skor karnesi ve benchmark karşılaştırmaları token'lı div bar'ları, funnel yüzde bar listesi. Para biçimi `Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })`; aralık "₺74.000 – ₺154.000" biçiminde, nokta tahmin tek başına gösterilmez (spec §4).

- [ ] **Step 1:** `use-diagnoo-status` + `diagnoo-snapshot` + `diagnoo-unlock-form` failing testlerini yaz
- [ ] **Step 2:** FAIL doğrula
- [ ] **Step 3:** `use-turnstile.ts` çıkar (geo-scan-form refactor, testleri yeşil) → hook + bileşenler (design-token skill'i eşliğinde; metinler brand-voice skill'inden)
- [ ] **Step 4:** `pnpm test && pnpm typecheck` yeşil; `pnpm cf:preview` ile manuel duman: URL gir → adımlar ilerler → snapshot → unlock → rapor (`.dev.vars`'ta gerçek anahtarlar gerekir; yoksa pipeline `scrape_failed` ile dürüst hata verir — bu da doğrulanır)
- [ ] **Step 5: Commit**

```bash
git add src/components/tools/ vitest.config.ts
git commit -m "feat(diagnoo): araç UI — akış makinesi, snapshot, unlock, rapor görünümü; paylaşılan Turnstile hook'u"
```

---

### Task 16: Uçtan uca doğrulama + deploy hazırlığı

**Files:**
- Modify: `scripts/cf-smoke.sh` (varsa diagnoo smoke satırı), `docs/12-analytics-measurement.md` (araç tablosuna Diagnoo satırları + 2 yeni olay)
- Create: `docs/superpowers/runbooks/diagnoo-ga4-kurulum.md` (GA4 arayüz adımları: `tool_report_requested` (slug=diagnoo) key event işaretleme + funnel exploration tool_used → tool_scan_completed → tool_report_requested → tool_service_cta_clicked — spec §8)

**Interfaces:**
- Consumes: önceki tüm task'ların çıktısı.
- Produces: yeşil tam doğrulama + deploy edilebilir durum.

- [ ] **Step 1:** Tam doğrulama zinciri

```bash
pnpm typecheck && pnpm test && pnpm seo:audit && pnpm cf:build
```
Expected: hepsi temiz; test sayısı önceki yeşil sete +yeni testler.

- [ ] **Step 2:** Lokal uçtan uca duman testi

```bash
pnpm wrangler d1 migrations apply indoles-bookings --local
pnpm cf:preview
# Tarayıcı: /tr/araclar/diagnoo → gerçek bir URL ile akışı uçtan uca dene
# (.dev.vars'ta gerçek GEMINI/FIRECRAWL anahtarları gerekir)
```

- [ ] **Step 3:** GA4 runbook'unu yaz (key event + funnel exploration adımları, ekran ekran)

- [ ] **Step 4:** Sırları ve migration'ı üretime hazırla (deploy Burak onayıyla)

```bash
pnpm wrangler secret put GEMINI_API_KEY
pnpm wrangler secret put FIRECRAWL_API_KEY
pnpm wrangler secret put PSI_API_KEY
pnpm wrangler d1 migrations apply indoles-bookings --remote
```

- [ ] **Step 5: Commit**

```bash
git add scripts/cf-smoke.sh docs/12-analytics-measurement.md docs/superpowers/runbooks/diagnoo-ga4-kurulum.md
git commit -m "feat(diagnoo): e2e doğrulama, GA4 runbook, deploy hazırlığı"
```

---

## Kapsam Dışı (bu planda YOK — Faz 2/3 planlarına)

- Zengin SEO/GEO landing içeriği, `webApplicationLd`, iç link ağı, llms.txt, GEO ölçüm rutini, destek makalesi → **Faz 2 planı** (Faz 1 bitince yazılır).
- GSC/Meta Ads entegrasyonları, rakip analizi bölümü, GA4 OAuth, CRM push, PDF export, demo_mode odorgo senaryosu → **Faz 3**.
- Ana navigasyona "Araçlar" girişi → Faz 2 (landing içeriğiyle birlikte).
