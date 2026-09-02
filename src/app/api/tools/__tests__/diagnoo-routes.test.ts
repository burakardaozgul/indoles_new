import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";

vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));
vi.mock("@/lib/mail/client", () => ({ sendMailWithRetry: vi.fn(), recipients: () => ["satis@indoles.com.tr"] }));
vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: vi.fn().mockResolvedValue(true) }));
vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

import { POST as startPOST } from "../diagnoo-start/route";
import { GET as statusGET } from "../diagnoo-status/[id]/route";
import { POST as unlockPOST } from "../diagnoo-unlock/route";
import { saveReport, createDiagnostic, getDiagnostic } from "@/lib/tools/diagnoo/repository";
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

const post = (url: string, body: unknown, ip = "1.2.3.4") => new Request(`http://localhost${url}`, {
  method: "POST",
  headers: { "content-type": "application/json", "cf-connecting-ip": ip },
  body: JSON.stringify(body),
});
const get = (url: string, cookie?: string) => new Request(`http://localhost${url}`, {
  headers: cookie ? { cookie } : {},
});
const startBody = (url: string) => ({ url, locale: "tr", turnstileToken: "tok" });

/**
 * Unlock yanıtındaki kilit çerezi. Kilit ziyaretçiye bağlı: token yalnız
 * `Set-Cookie` ile taşınır, URL'ye hiç girmez (C1).
 */
function unlockCookie(res: Response): string {
  const raw = res.headers.get("set-cookie") ?? "";
  const pair = raw.split(";")[0] ?? "";
  expect(pair.startsWith(`diagnoo_unlock_${ID}=`), `set-cookie: ${raw}`).toBe(true);
  return pair;
}

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

  it("Cache-Control: no-store — kilitli rapor ara katmanda önbelleklenmez", async () => {
    await createDiagnostic(db, { id: ID, ...base });
    await saveReport(db, ID, sampleReport());
    const res = await statusGET(get(`/api/tools/diagnoo-status/${ID}`), { params: Promise.resolve({ id: ID }) });
    expect(res.headers.get("cache-control")).toBe("no-store");
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
  it("kilit çerezi HttpOnly/Secure/SameSite=Lax ve 30 gün ömürlü set edilir", async () => {
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    const raw = res.headers.get("set-cookie") ?? "";
    expect(raw).toContain(`diagnoo_unlock_${ID}=`);
    expect(raw.toLowerCase()).toContain("httponly");
    expect(raw.toLowerCase()).toContain("secure");
    expect(raw.toLowerCase()).toContain("samesite=lax");
    expect(raw).toContain("Max-Age=2592000");
    expect(raw).toContain("Path=/");
  });
  it("knownMetrics ile finansal recompute edilir ve kendi çereziyle status'ta açılır", async () => {
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ knownMetrics: { monthlyTraffic: 500000 } })));
    const cookie = unlockCookie(res);
    const status = await statusGET(get(`/api/tools/diagnoo-status/${ID}`, cookie), { params: Promise.resolve({ id: ID }) });
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
  it("ikinci unlock idempotent (200, tek lead, ikinci mail yok)", async () => {
    await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    vi.mocked(sendMailWithRetry).mockClear();
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    expect(res.status).toBe(200);
    // Aynı e-posta = aynı kişi: satış kutusuna ikinci bir bildirim düşmez.
    expect(sendMailWithRetry).not.toHaveBeenCalled();
    // Yeni token yazıldı: aynı ziyaretçi ikinci sekmede de raporunu görür.
    const cookie = unlockCookie(res);
    const status = await statusGET(get(`/api/tools/diagnoo-status/${ID}`, cookie), { params: Promise.resolve({ id: ID }) });
    expect(((await status.json()) as { leadCaptured: boolean }).leadCaptured).toBe(true);
  });
  it("aynı IP saatte 4. unlock'ta 429 rate-limited", async () => {
    // GEO `LEAD_HOURLY_LIMIT` paritesi: kilit açma da lead yazma yüzeyidir,
    // sınırsız çağrı satış kutusunu ve D1'i doldurur.
    for (const email of ["a@firma.com", "b@firma.com", "c@firma.com"]) {
      const ok = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ email })));
      expect(ok.status).toBe(200);
    }
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ email: "d@firma.com" })));
    expect(res.status).toBe(429);
    expect(((await res.json()) as { error: string }).error).toBe("rate-limited");
  });

  it("limit IP başına — başka IP'den unlock açılmaya devam eder", async () => {
    for (const email of ["a@firma.com", "b@firma.com", "c@firma.com"]) {
      await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ email })));
    }
    const res = await unlockPOST(
      post("/api/tools/diagnoo-unlock", unlockBody({ email: "d@firma.com" }), "9.9.9.9"),
    );
    expect(res.status).toBe(200);
  });

  it("teşhis tamam değilse 409", async () => {
    const other = "22222222-2222-4222-8222-222222222222";
    await createDiagnostic(db, { id: other, ...base, url: "https://b.com" });
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ diagnosticId: other })));
    expect(res.status).toBe(409);
  });
});

/**
 * C1 — kilit ziyaretçiye bağlıdır, teşhise değil.
 *
 * `findFreshCompleted` maliyet koruması için aynı URL'nin 24 saatlik teşhisini
 * yeniden kullanıyor; kapı teşhis bazlı kalırsa A'nın açtığı kilit B'ye de
 * açılır ve A'nın ticari verileri B'nin ekranına düşer. Aşağıdaki üç test tam
 * olarak bunu kovalar.
 */
describe("Diagnoo kilit izolasyonu (aynı teşhis, iki ziyaretçi)", () => {
  const unlockBody = (over: Record<string, unknown> = {}) => ({
    diagnosticId: ID, email: "a@firma.com", company: "A Firma", kvkkConsent: true, turnstileToken: "tok", ...over,
  });
  beforeEach(async () => {
    await createDiagnostic(db, { id: ID, ...base });
    await saveReport(db, ID, sampleReport());
  });

  it("çerezi olmayan ziyaretçi yalnız anlık görünümü alır", async () => {
    await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody({ knownMetrics: { monthlyTraffic: 500000 } })));
    const status = await statusGET(get(`/api/tools/diagnoo-status/${ID}`), { params: Promise.resolve({ id: ID }) });
    const body = (await status.json()) as { snapshot: unknown; report: unknown; leadCaptured: boolean };
    expect(body.snapshot).toBeTruthy();
    expect(body.report).toBeNull();
    expect(body.leadCaptured).toBe(false);
  });

  it("A'nın metrikleri B'nin raporuna sızmaz; paylaşılan report_json değişmez", async () => {
    const before = await getDiagnostic(db, ID);

    const aRes = await unlockPOST(post("/api/tools/diagnoo-unlock",
      unlockBody({ knownMetrics: { monthlyTraffic: 500000, aov: 2500 } }), "1.2.3.4"));
    const aCookie = unlockCookie(aRes);

    const bRes = await unlockPOST(post("/api/tools/diagnoo-unlock",
      unlockBody({ email: "b@baska.com", company: "B Firma" }), "5.6.7.8"));
    const bCookie = unlockCookie(bRes);
    expect(bCookie).not.toBe(aCookie);

    const aStatus = await statusGET(get(`/api/tools/diagnoo-status/${ID}`, aCookie), { params: Promise.resolve({ id: ID }) });
    const aBody = (await aStatus.json()) as { report: { financial: { inputs: { monthlyTraffic: number; aov: number } } } };
    expect(aBody.report.financial.inputs.monthlyTraffic).toBe(500000);
    expect(aBody.report.financial.inputs.aov).toBe(2500);

    const bStatus = await statusGET(get(`/api/tools/diagnoo-status/${ID}`, bCookie), { params: Promise.resolve({ id: ID }) });
    const bBody = (await bStatus.json()) as {
      leadCaptured: boolean;
      report: { financial: { inputs: { monthlyTraffic: number; aov: number }; inputSources: Record<string, string> } };
    };
    expect(bBody.leadCaptured).toBe(true);
    // B kendi kilidini açtı ama A'nın rakamlarını GÖRMEZ: temel rapor döner.
    expect(bBody.report.financial.inputs.monthlyTraffic).toBe(120000);
    expect(bBody.report.financial.inputs.aov).toBe(850);
    expect(bBody.report.financial.inputSources.monthlyTraffic).toBe("estimated");

    // Paylaşılan satır unlock'tan hiç etkilenmez.
    const after = await getDiagnostic(db, ID);
    expect(after?.report).toEqual(before?.report);
  });

  it("başka bir teşhisin çerezi bu teşhisin kilidini açmaz", async () => {
    const res = await unlockPOST(post("/api/tools/diagnoo-unlock", unlockBody()));
    const cookie = unlockCookie(res);
    const token = cookie.split("=")[1] ?? "";

    const other = "33333333-3333-4333-8333-333333333333";
    await createDiagnostic(db, { id: other, ...base, url: "https://c.com" });
    await saveReport(db, other, sampleReport());

    const status = await statusGET(
      get(`/api/tools/diagnoo-status/${other}`, `diagnoo_unlock_${other}=${token}`),
      { params: Promise.resolve({ id: other }) },
    );
    const body = (await status.json()) as { report: unknown; leadCaptured: boolean };
    expect(body.report).toBeNull();
    expect(body.leadCaptured).toBe(false);
  });
});
