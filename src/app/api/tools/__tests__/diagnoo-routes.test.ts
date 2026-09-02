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
