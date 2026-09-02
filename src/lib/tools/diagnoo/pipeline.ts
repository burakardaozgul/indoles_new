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
    // Görev 17.2 — `ScrapeError` sınıf kontrolü Workflow adımının (`step.do`)
    // İÇİNDE yapılır: Cloudflare Workflows retry'ları tükenince orijinal
    // hatayı KENDİ sarmalayıcısıyla yeniden fırlatır ("step failed: " +
    // mesaj) — sınıf bilgisi kaybolur, adımın DIŞINDAKİ bir `instanceof
    // ScrapeError` kontrolü bu noktadan sonra asla tutmaz (E2E'de gözlendi).
    // `ScrapeError` burada YAKALANIR ve saf bir sonuç nesnesine çevrilir —
    // fırlatılmadığı için Workflows bu adımı retry'a hiç sokmaz (site zaten
    // erişilemez durumdaysa retry anlamsız, ADR-031). Diğer hatalar (ağ,
    // zaman aşımı) fırlatılmaya devam eder ki adım retry mekanizması çalışsın.
    const scraped = await step.do("scrape", async () => {
      try {
        const pages = await discoverAndScrapePages(env, row.url);
        return { ok: true as const, pages };
      } catch (err) {
        if (err instanceof ScrapeError) return { ok: false as const, reason: "scrape_failed" as const };
        throw err;
      }
    });
    if (!scraped.ok) {
      await markFailed(db, diagnosticId, "scrape_failed");
      return;
    }
    const pages = scraped.pages;

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
    // `ScrapeError` artık BURAYA hiç ulaşmaz — "scrape" adımının kendi
    // içinde yakalanıp `scraped.ok === false` olarak ele alınıyor (yukarı
    // bkz., Görev 17.2). Buraya düşen her şey pipeline_error'dır.
    await markFailed(db, diagnosticId, "pipeline_error");
    throw err; // Workflows adım retry mekanizması devralır.
  }
}
