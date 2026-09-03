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

/**
 * Görev 17.2 — Cloudflare Workflows'un GERÇEK davranışını taklit eder: bir
 * adımın retry'ları tükenince, adımın İÇİNDE fırlatılan hata Workflows'un
 * KENDİ sarmalayıcısıyla yeniden fırlatılır ("step failed: " + orijinal
 * mesaj) — orijinal hata SINIFI (`ScrapeError`) kaybolur. `runDiagnosticPipeline`
 * `instanceof ScrapeError` kontrolünü adımın DIŞINDA yaparsa bu sarmalamadan
 * sonra asla tutmaz; kontrol adımın İÇİNDE yapılmalı.
 */
const wrappingStep: StepRunner = {
  do: async (_name, fn) => {
    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error("step failed: " + message);
    }
  },
};
const env = { GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "f", BOOKINGS_DB: {} as D1Database };
const report = sampleReport();

beforeEach(() => {
  // Brief'in orijinal beforeEach'i mock çağrı geçmişini temizlemiyordu; testler
  // aynı dosyada koştuğu için "not.toHaveBeenCalled()" gibi assertion'lar önceki
  // testin çağrılarından kirleniyordu (test izolasyonu eksikti — davranış değil).
  vi.clearAllMocks();
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

  it("Görev 17.2 — Workflow adımı retry sonrası hatayı SARMALASA bile scrape_failed doğru sınıflandırılır", async () => {
    vi.mocked(discoverAndScrapePages).mockRejectedValue(new ScrapeError("https://a.com", 500));
    await expect(runDiagnosticPipeline(env, wrappingStep, "d1")).resolves.toBeUndefined();
    expect(markFailed).toHaveBeenCalledWith(env.BOOKINGS_DB, "d1", "scrape_failed");
    expect(markFailed).not.toHaveBeenCalledWith(env.BOOKINGS_DB, "d1", "pipeline_error");
    expect(saveReport).not.toHaveBeenCalled();
  });

  it("Görev 17.2 — sarmalayan adım runner'da ScrapeError DIŞINDAKİ hatalar yine rethrow edilir (retry çalışır)", async () => {
    vi.mocked(analyzeSemantic).mockRejectedValue(new Error("gemini down"));
    await expect(runDiagnosticPipeline(env, wrappingStep, "d1")).rejects.toThrow(
      "step failed: gemini down",
    );
    expect(markFailed).toHaveBeenCalledWith(env.BOOKINGS_DB, "d1", "pipeline_error");
  });

  it("kayıt yoksa hiçbir şey yapmaz", async () => {
    vi.mocked(getDiagnostic).mockResolvedValue(null);
    await runDiagnosticPipeline(env, step, "yok");
    expect(setProgress).not.toHaveBeenCalled();
  });
});
