import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { fetchScanTargets } from "@/lib/tools/geo/safe-fetch";
import { runGeoScan } from "@/lib/tools/geo/engine";
import { insertScan, countScansSince, hashClientIp } from "@/lib/tools/geo/repository";
import { reportError } from "@/lib/observability/report";
import type { GeoCheckResult } from "@/lib/tools/geo/types";
import { POST } from "../route";

// `getCloudflareContext` Worker çalışma zamanı dışında anlamsız — booking
// route testinin AYNI deseni (D1 binding'i testten enjekte etmek için).
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: vi.fn() }));

// `@/lib/security/anti-spam` (`spamSignal`/`turnstileEnabled`) BİLEREK mock'lanmıyor
// — contact route testinin izlediği AYNI desen (src/app/api/contact/__tests__/route.test.ts):
// bayrak `vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", ...)` ile kontrol edilir,
// `spamSignal` gerçek (saf) hesaplamasıyla çalışır.

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
  // Motor gerçek taramada findings DOLU döner (Görev 6) — bilerek dolu tutuyoruz:
  // aşağıdaki "findings kapılama" testi yanıtın BOŞALTILDIĞINI, D1 yazımının
  // TAM kaldığını bu sabit girdiyle kanıtlar.
  findings: [{ tr: `${id} bulgu`, en: `${id} finding` }],
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

// İnsan davranışı (final review C1): bal küpü boş, doldurma süresi eşiğin
// (2000ms, anti-spam.ts) üstünde — contact route testinin AYNI deseni.
// Turnstile bayrağı VARSAYILAN KAPALI (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` env'i
// stub'lanmadıkça) — `turnstileToken` bu durumda rota tarafından hiç okunmaz.
const validBody = {
  url: "https://example.com/",
  turnstileToken: "tkn",
  website: "",
  elapsedMs: 5000,
};

function req(body: unknown, headers: Record<string, string> = { "cf-connecting-ip": "1.2.3.4" }): Request {
  return new Request("http://localhost/api/tools/geo-scan", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

let originalToolIpSalt: string | undefined;

describe("POST /api/tools/geo-scan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv({ BOOKINGS_DB: {} });
    // Diğer tüm testler `TOOL_IP_SALT`'ın yapılandırılmış olduğu (üretim)
    // yolu kanıtlıyor — eksik-sır fail-closed davranışı ayrı, tek bir testte
    // (aşağıda) sırrı bilinçli olarak siliyor.
    originalToolIpSalt = process.env.TOOL_IP_SALT;
    process.env.TOOL_IP_SALT = "test-salt";
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
    vi.unstubAllEnvs();
    if (originalToolIpSalt === undefined) delete process.env.TOOL_IP_SALT;
    else process.env.TOOL_IP_SALT = originalToolIpSalt;
  });

  it("geçersiz URL gövdesi (şema başarısız) → 400 invalid-url", async () => {
    const res = await POST(req({ ...validBody, url: "boyle-bir-url-yok" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-url" });
  });

  // Final review C1 — hata mesajı güvenliği: `url` alanıyla İLGİLİ OLMAYAN
  // bir şema hatası "URL geçersiz" mesajına DÜŞMEMELİ.
  it("url ALANIYLA İLGİLİ OLMAYAN şema hatası → 400 invalid-request (URL'i suçlamaz)", async () => {
    const res = await POST(req({ ...validBody, elapsedMs: -5 }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-request" });
  });

  it("bozuk JSON gövdesi → 400 invalid-request (URL'i suçlamaz)", async () => {
    const res = await POST(
      new Request("http://localhost/api/tools/geo-scan", {
        method: "POST",
        headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4" },
        body: "{ bozuk json",
      }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-request" });
  });

  it("SSRF matrisince reddedilen hedef (localhost) → 400 invalid-url", async () => {
    const res = await POST(req({ ...validBody, url: "http://localhost/panel" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-url" });
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  // ---- Final review C1: Turnstile artık ADR-028'e göre KOŞULLU ----

  it("bayrak KAPALIYKEN (varsayılan, env stub yok) Turnstile hiç sorgulanmaz — mutlu yol yine 200", async () => {
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });

  it("bayrak AÇIKKEN Turnstile SSRF kontrolünden ÖNCE çalışır (akış sırası korunur)", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0xTESTKEY");
    const res = await POST(req({ ...validBody, url: "http://localhost/panel" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid-url" });
    expect(verifyTurnstile).toHaveBeenCalledTimes(1);
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("bayrak AÇIKKEN Turnstile düşerse → 400 turnstile-failed", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0xTESTKEY");
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(req(validBody));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "turnstile-failed" });
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("bayrak AÇIKKEN token boşsa (istemci hiç göndermemiş) → 400 turnstile-failed, verifyTurnstile'a HİÇ gidilmez", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0xTESTKEY");
    const { turnstileToken, ...withoutToken } = validBody;
    void turnstileToken;
    const res = await POST(req(withoutToken));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "turnstile-failed" });
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });

  it("bayrak AÇIKKEN Turnstile geçerse mevcut akış devam eder → 200", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0xTESTKEY");
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(verifyTurnstile).toHaveBeenCalledTimes(1);
  });

  // ---- Final review C1: bal küpü + süre tuzağı (contact route'un deseni) ----

  it("bal küpü doluysa → sahte başarı (200 ok:true), tarama HİÇ çalışmaz", async () => {
    const res = await POST(req({ ...validBody, website: "https://spam.example" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchScanTargets).not.toHaveBeenCalled();
    expect(insertScan).not.toHaveBeenCalled();
    expect(countScansSince).not.toHaveBeenCalled();
  });

  it("süre eşiğin (2 sn) altındaysa → sahte başarı, tarama çalışmaz", async () => {
    const res = await POST(req({ ...validBody, elapsedMs: 400 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("süre bilgisi hiç yoksa (doğrudan API botu) → sahte başarı, tarama çalışmaz", async () => {
    const { elapsedMs, ...withoutElapsed } = validBody;
    void elapsedMs;
    const res = await POST(req(withoutElapsed));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchScanTargets).not.toHaveBeenCalled();
  });

  it("bal küpü/süre tuzağı bayrak AÇIKKEN de çalışır (HER ZAMAN kontrol edilir)", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "0xTESTKEY");
    const res = await POST(req({ ...validBody, website: "https://spam.example" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(verifyTurnstile).not.toHaveBeenCalled();
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

  // Görev 12b: ücretsiz tarama yanıtı MOFU mail kapısını atlatmasın —
  // `findings` yalnız rapor route'unun (geo-report) 200 yanıtında görünür.
  it("200 yanıtındaki checks[*].findings HEPSİ boş; D1'e giden checksJson TAM findings taşır", async () => {
    const res = await POST(req(validBody));
    const body = (await res.json()) as {
      result: { checks: GeoCheckResult[] };
    };

    expect(body.result.checks).toHaveLength(5);
    for (const check of body.result.checks) {
      expect(check.findings).toEqual([]);
    }

    const call = vi.mocked(insertScan).mock.calls[0]?.[1];
    const persisted = JSON.parse(call?.checksJson ?? "[]") as GeoCheckResult[];
    expect(persisted).toHaveLength(5);
    for (const check of persisted) {
      expect(check.findings.length).toBeGreaterThan(0);
    }
  });

  it("cf-connecting-ip yoksa 'unknown' ile devam eder (isteği düşürmez)", async () => {
    const res = await POST(req(validBody, {}));
    expect(res.status).toBe(200);
  });

  // KVKK: `TOOL_IP_SALT` yoksa tuzsuz SHA-256(IP) 32-bit IPv4 uzayında
  // rainbow-table ile anında geri çevrilir — ham IP saklamakla eşdeğer.
  // Kod tabanı emsali fail-closed (`src/app/api/cron/route.ts` — sır yoksa
  // TÜM istekler reddedilir); bu rota da aynı duruşu izler. Sır eksikse
  // hash/insertScan'e HİÇ gidilmemeli.
  it("TOOL_IP_SALT sırrı yoksa (undefined) → 500 misconfigured, hash/insertScan hiç çağrılmaz", async () => {
    delete process.env.TOOL_IP_SALT;
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "misconfigured" });
    expect(hashClientIp).not.toHaveBeenCalled();
    expect(insertScan).not.toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledTimes(1);
  });

  it("TOOL_IP_SALT sırrı boş dizgeyse → 500 misconfigured, hash/insertScan hiç çağrılmaz", async () => {
    process.env.TOOL_IP_SALT = "";
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "misconfigured" });
    expect(hashClientIp).not.toHaveBeenCalled();
    expect(insertScan).not.toHaveBeenCalled();
  });

  it("D1 yazma hatası (insertScan fırlatır) → 500 misconfigured, sözleşme gövdesi bozulmaz", async () => {
    vi.mocked(insertScan).mockRejectedValueOnce(new Error("D1_ERROR"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "misconfigured" });
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});
