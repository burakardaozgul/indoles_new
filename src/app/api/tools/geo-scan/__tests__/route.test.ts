import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { fetchScanTargets } from "@/lib/tools/geo/safe-fetch";
import { runGeoScan } from "@/lib/tools/geo/engine";
import { insertScan, countScansSince, hashClientIp } from "@/lib/tools/geo/repository";
import type { GeoCheckResult } from "@/lib/tools/geo/types";
import { POST } from "../route";

// `getCloudflareContext` Worker çalışma zamanı dışında anlamsız — booking
// route testinin AYNI deseni (D1 binding'i testten enjekte etmek için).
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: vi.fn() }));

// `validateTargetUrl` GERÇEK uygulamasıyla mock'lanıyor: SSRF matrisi saf
// hesaplama, testten atlanacak bir I/O değil — rotanın onunla gerçekten
// doğru bağlandığını (localhost reddi → invalid-url 400) kanıtlamak
// istiyoruz. `fetchScanTargets` ağ I/O'su, o mock'lanıyor.
vi.mock("@/lib/tools/geo/safe-fetch", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/tools/geo/safe-fetch")>()),
  fetchScanTargets: vi.fn(),
}));

vi.mock("@/lib/tools/geo/engine", () => ({ runGeoScan: vi.fn() }));

// Üçü de mock'lanıyor. `hashClientIp` saf WebCrypto hesaplaması olsa da
// (zaten repository.test.ts'te ayrı birim testli) gerçek haliyle bırakmak,
// zaman-bütçesi testindeki sahte zamanlayıcıyla (`vi.useFakeTimers`) etkileşip
// testi kararsızlaştırıyordu — gerçek `crypto.subtle.digest` çözünürlüğü
// libuv thread pool'undan geçiyor, sahte saat bu tamamlanmayı YAKALAYAMIYOR.
// Sabit bir hash döndürmek testi hem daha hızlı hem daha belirleyici kılıyor.
vi.mock("@/lib/tools/geo/repository", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/tools/geo/repository")>()),
  insertScan: vi.fn(),
  countScansSince: vi.fn(),
  hashClientIp: vi.fn(),
}));

vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

const checks: GeoCheckResult[] = (
  ["ai-access", "llms-txt", "json-ld", "lang-signals", "question-h2"] as const
).map((id) => ({
  id,
  score: 15,
  max: 20,
  status: "partial",
  summary: { tr: `${id} özeti`, en: `${id} summary` },
  findings: [],
}));

const geoScanResult = {
  url: "https://example.com/",
  totalScore: 72,
  band: "iyi",
  checks,
};

function mockEnv(env: Record<string, unknown>): void {
  vi.mocked(getCloudflareContext).mockReturnValue({ env } as never);
}

const validBody = { url: "https://example.com/", turnstileToken: "tkn" };

function req(body: unknown, headers: Record<string, string> = { "cf-connecting-ip": "1.2.3.4" }): Request {
  return new Request("http://localhost/api/tools/geo-scan", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/tools/geo-scan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv({ BOOKINGS_DB: {} });
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(hashClientIp).mockResolvedValue("hash_abc");
    vi.mocked(countScansSince).mockResolvedValue(0);
    vi.mocked(fetchScanTargets).mockResolvedValue({
      pageHtml: "<html></html>",
      robotsTxt: null,
      llmsTxt: null,
    });
    vi.mocked(runGeoScan).mockReturnValue(geoScanResult as never);
    vi.mocked(insertScan).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("geçersiz URL gövdesi (şema başarısız) → 400 invalid-url", async () => {
    const res = await POST(req({ url: "boyle-bir-url-yok", turnstileToken: "tkn" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-url" });
  });

  it("SSRF matrisince reddedilen hedef (localhost) → 400 invalid-url", async () => {
    const res = await POST(req({ url: "http://localhost/panel", turnstileToken: "tkn" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-url" });
    // SSRF reddi Turnstile'dan SONRA kontrol edilir (akış: Turnstile → IP hash
    // → limitler → validateTargetUrl) — buraya varılmışsa Turnstile zaten geçti.
    expect(verifyTurnstile).toHaveBeenCalledTimes(1);
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("Turnstile düşerse → 400 turnstile-failed", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(req(validBody));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "turnstile-failed" });
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("IP başına saatlik limit (10) aşılırsa → 429 rate-limited", async () => {
    vi.mocked(countScansSince).mockImplementation(async (_db, ipHash) =>
      ipHash === null ? 0 : 10,
    );
    const res = await POST(req(validBody));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate-limited" });
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("global günlük tavan (500) aşılırsa → 429 rate-limited", async () => {
    vi.mocked(countScansSince).mockImplementation(async (_db, ipHash) =>
      ipHash === null ? 500 : 0,
    );
    const res = await POST(req(validBody));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate-limited" });
  });

  it("hedef ulaşılamaz (fetchScanTargets fırlatır) → 502 target-unreachable", async () => {
    vi.mocked(fetchScanTargets).mockRejectedValueOnce(new Error("target-unreachable"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "target-unreachable" });
    expect(insertScan).not.toHaveBeenCalled();
  });

  it("genel istek zaman bütçesi (~20sn) aşılırsa → 502 target-unreachable (per-hop redirect birikmesi G7 gözlemi)", async () => {
    vi.useFakeTimers();
    // Asla çözülmeyen bir promise — per-hop redirect'lerin (3×10sn taze
    // zaman aşımı) teorik olarak 40sn'ye kadar birikebildiği senaryonun
    // durumunu taklit ediyor. Rota kendi ~20sn üst sınırını uygulamalı.
    vi.mocked(fetchScanTargets).mockImplementation(() => new Promise(() => {}));
    const resPromise = POST(req(validBody));
    await vi.advanceTimersByTimeAsync(20_000);
    const res = await resPromise;
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "target-unreachable" });
  });

  it("mutlu yol → 200, D1'e yazılır, checks 5 kalem döner", async () => {
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: string; result: typeof geoScanResult & { id: string; scannedAt: string } };
    expect(typeof body.id).toBe("string");
    expect(body.id.length).toBeGreaterThan(0);
    expect(body.result.checks).toHaveLength(5);
    expect(body.result.totalScore).toBe(72);
    expect(body.result.band).toBe("iyi");
    expect(body.result.id).toBe(body.id);
    expect(typeof body.result.scannedAt).toBe("string");

    expect(insertScan).toHaveBeenCalledTimes(1);
    const call = vi.mocked(insertScan).mock.calls[0]?.[1];
    expect(call).toMatchObject({
      id: body.id,
      url: "https://example.com/",
      totalScore: 72,
      band: "iyi",
    });
    expect(JSON.parse(call?.checksJson ?? "[]")).toHaveLength(5);
    expect(typeof call?.clientIpHash).toBe("string");
    expect(call?.clientIpHash.length).toBeGreaterThan(0);
  });

  it("cf-connecting-ip yoksa 'unknown' ile devam eder (isteği düşürmez)", async () => {
    const res = await POST(req(validBody, {}));
    expect(res.status).toBe(200);
  });
});
