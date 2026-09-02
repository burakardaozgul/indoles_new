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
    const funnel = await step.do("funnel", () => analyzeFunnel(env, pages, row.locale));

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
