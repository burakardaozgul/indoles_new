import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyTurnstile } from "@/lib/security/turnstile";
import {
  getScan,
  insertLead,
  countLeadsSince,
  hashClientIp,
} from "@/lib/tools/geo/repository";
import { sendMailWithRetry } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import type { GeoCheckResult } from "@/lib/tools/geo/types";
import GeoReportEmail from "../../../../../../emails/GeoReportEmail";
import { POST } from "../route";

// Satış e-postasının locale'ini `GeoReportEmail` çağrısından doğrulamak
// istiyoruz (Görev 12b: audience:"sales" HER ZAMAN tr render) — component'i
// mock'luyoruz, gerçek JSX render'ına gerek yok (contact route testinin
// deseni: I/O ve çağrı argümanı mock'tan doğrulanır).
vi.mock("../../../../../../emails/GeoReportEmail", () => ({
  default: vi.fn(() => null),
}));

// D1 binding'i testten enjekte etmek için — geo-scan/booking route testinin
// AYNI deseni.
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));
vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: vi.fn() }));

// `hashClientIp` sabit bir değere mock'lanıyor (geo-scan route testiyle aynı
// gerekçe: WebCrypto çözünürlüğü determinizmi bozuyor); `getScan`/`insertLead`/
// `countLeadsSince` I/O, hepsi mock.
vi.mock("@/lib/tools/geo/repository", () => ({
  getScan: vi.fn(),
  insertLead: vi.fn(),
  countLeadsSince: vi.fn(),
  hashClientIp: vi.fn(),
}));

// `recipients` gerçek uygulamasıyla — alıcı listesinin diziye çevrildiğini
// doğrulamak istiyoruz (contact route testinin deseni). `sendMailWithRetry`
// I/O, mock.
vi.mock("@/lib/mail/client", async (importActual) => ({
  sendMailWithRetry: vi.fn(),
  recipients: (await importActual<typeof import("@/lib/mail/client")>()).recipients,
}));

vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

const checks: GeoCheckResult[] = (
  ["ai-access", "llms-txt", "json-ld", "lang-signals", "question-h2"] as const
).map((id, i) => ({
  id,
  score: i * 4,
  max: 20,
  status: "partial",
  summary: { tr: `${id} özeti`, en: `${id} summary` },
  findings: [{ tr: `${id} bulgu`, en: `${id} finding` }],
}));

const scanRecord = {
  url: "https://ornek.com.tr/",
  totalScore: 65,
  band: "gelismeye-acik" as const,
  checks,
  scannedAt: "2026-09-01T00:00:00.000Z",
};

function mockEnv(env: Record<string, unknown>): void {
  vi.mocked(getCloudflareContext).mockReturnValue({ env } as never);
}

const SCAN_ID = "11111111-1111-4111-8111-111111111111";
const validBody = {
  scanId: SCAN_ID,
  email: "lead@ornek.com.tr",
  kvkkConsent: true,
  turnstileToken: "tkn",
  locale: "tr",
};

function req(
  body: unknown,
  headers: Record<string, string> = { "cf-connecting-ip": "1.2.3.4" },
): Request {
  return new Request("http://localhost/api/tools/geo-report", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

let originalToolIpSalt: string | undefined;

describe("POST /api/tools/geo-report", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv({ BOOKINGS_DB: {} });
    originalToolIpSalt = process.env.TOOL_IP_SALT;
    process.env.TOOL_IP_SALT = "test-salt";
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(hashClientIp).mockResolvedValue("hash_abc");
    vi.mocked(countLeadsSince).mockResolvedValue(0);
    vi.mocked(getScan).mockResolvedValue(scanRecord);
    vi.mocked(insertLead).mockResolvedValue(undefined);
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
  });

  afterEach(() => {
    if (originalToolIpSalt === undefined) delete process.env.TOOL_IP_SALT;
    else process.env.TOOL_IP_SALT = originalToolIpSalt;
  });

  it("KVKK rızası verilmemişse (kvkkConsent false) → 400, insertLead HİÇ çağrılmaz", async () => {
    const res = await POST(req({ ...validBody, kvkkConsent: false }));
    expect(res.status).toBe(400);
    expect(insertLead).not.toHaveBeenCalled();
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it("kvkkConsent alanı eksikse → 400, insertLead HİÇ çağrılmaz", async () => {
    const { kvkkConsent, ...withoutConsent } = validBody;
    void kvkkConsent;
    const res = await POST(req(withoutConsent));
    expect(res.status).toBe(400);
    expect(insertLead).not.toHaveBeenCalled();
  });

  it("scanId geçerli uuid değilse → 400", async () => {
    const res = await POST(req({ ...validBody, scanId: "not-a-uuid" }));
    expect(res.status).toBe(400);
    expect(getScan).not.toHaveBeenCalled();
  });

  it("Turnstile düşerse → 400 turnstile-failed, insertLead çağrılmaz", async () => {
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(req(validBody));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "turnstile-failed" });
    expect(insertLead).not.toHaveBeenCalled();
  });

  it("TOOL_IP_SALT yoksa → 500 misconfigured, hash/insertLead hiç çağrılmaz", async () => {
    delete process.env.TOOL_IP_SALT;
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "misconfigured" });
    expect(hashClientIp).not.toHaveBeenCalled();
    expect(insertLead).not.toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledTimes(1);
  });

  it("TOOL_IP_SALT boş dizgeyse → 500 misconfigured", async () => {
    process.env.TOOL_IP_SALT = "";
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "misconfigured" });
    expect(hashClientIp).not.toHaveBeenCalled();
    expect(insertLead).not.toHaveBeenCalled();
  });

  it("IP başına saatlik lead limiti (3) aşılırsa → 429 rate-limited", async () => {
    vi.mocked(countLeadsSince).mockResolvedValueOnce(3);
    const res = await POST(req(validBody));
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "rate-limited" });
    expect(insertLead).not.toHaveBeenCalled();
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it("tarama bulunamazsa (getScan null) → 404 not-found, insertLead çağrılmaz", async () => {
    vi.mocked(getScan).mockResolvedValueOnce(null);
    const res = await POST(req(validBody));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not-found" });
    expect(insertLead).not.toHaveBeenCalled();
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it("mutlu yol → 200 {ok:true}, lead yazılır, iki mail gider", async () => {
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });

    expect(insertLead).toHaveBeenCalledTimes(1);
    const leadArg = vi.mocked(insertLead).mock.calls[0]?.[1];
    expect(leadArg).toMatchObject({
      scanId: SCAN_ID,
      email: "lead@ornek.com.tr",
    });
    expect(typeof leadArg?.clientIpHash).toBe("string");
    expect(leadArg?.clientIpHash.length).toBeGreaterThan(0);

    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it("lead insert, mail'den ÖNCE yapılır (rıza kapısı akış sırası)", async () => {
    const order: string[] = [];
    vi.mocked(insertLead).mockImplementationOnce(async () => {
      order.push("insert");
    });
    vi.mocked(sendMailWithRetry).mockImplementation(async () => {
      order.push("mail");
    });
    await POST(req(validBody));
    expect(order[0]).toBe("insert");
  });

  it("satış bildirimi (birincil mail) düşerse → 500, ikinci mail denenmez", async () => {
    vi.mocked(sendMailWithRetry).mockRejectedValueOnce(new Error("smtp"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "mail-failed" });
    expect(sendMailWithRetry).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalled();
  });

  it("kullanıcı rapor maili düşse de lead satışa ulaştıysa 200 döner", async () => {
    vi.mocked(sendMailWithRetry)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("smtp"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it("satış bildirimi virgüllü SALES_INBOX_EMAIL listesinin hepsine gider", async () => {
    const previous = process.env.SALES_INBOX_EMAIL;
    process.env.SALES_INBOX_EMAIL = "digital@indoles.com.tr, burak@indoles.com.tr";
    try {
      await POST(req(validBody));
      expect(vi.mocked(sendMailWithRetry).mock.calls[0]?.[0]).toMatchObject({
        to: ["digital@indoles.com.tr", "burak@indoles.com.tr"],
      });
    } finally {
      if (previous === undefined) delete process.env.SALES_INBOX_EMAIL;
      else process.env.SALES_INBOX_EMAIL = previous;
    }
  });

  it("kullanıcı raporu lead'in e-postasına gider", async () => {
    await POST(req(validBody));
    // İkinci çağrı kullanıcının raporu.
    expect(vi.mocked(sendMailWithRetry).mock.calls[1]?.[0]).toMatchObject({
      to: "lead@ornek.com.tr",
    });
  });

  // Görev 12b: rapor akışı ZATEN KVKK rızalı — bu yüzden 200 yanıtı
  // `checks`i (findings dahil) taşır. Public yüzeyin (geo-scan/paylaşım
  // sayfası) aksine burada strip YOK: form kilidi açılınca `GeoReportForm`
  // bu yanıttan render eder (başlangıç prop'undan değil).
  it("mutlu yol 200 yanıtı `checks` içerir ve findings DOLU", async () => {
    const res = await POST(req(validBody));
    const body = (await res.json()) as { ok: boolean; checks: GeoCheckResult[] };
    expect(body.checks).toHaveLength(5);
    for (const check of body.checks) {
      expect(check.findings.length).toBeGreaterThan(0);
    }
  });

  // Görev 12b controller ruling: satış e-postası HER ZAMAN Türkçe render
  // edilir — ziyaretçinin locale'i ne olursa olsun (ContactNotification
  // emsali: iç ekip Türkçe okur). Kullanıcı maili ziyaretçi locale'inde kalır.
  it("ziyaretçi locale'i 'en' olsa bile satış e-postası (audience:sales) locale:'tr' ile render edilir", async () => {
    await POST(req({ ...validBody, locale: "en" }));

    expect(GeoReportEmail).toHaveBeenCalledTimes(2);
    const salesCallArg = vi.mocked(GeoReportEmail).mock.calls[0]?.[0];
    expect(salesCallArg).toMatchObject({ audience: "sales", locale: "tr" });

    const userCallArg = vi.mocked(GeoReportEmail).mock.calls[1]?.[0];
    expect(userCallArg).toMatchObject({ audience: "user", locale: "en" });
  });

  it("ziyaretçi locale'i 'tr' iken de satış e-postası locale:'tr' ile render edilir (davranış görünmez şekilde aynı kalır)", async () => {
    await POST(req({ ...validBody, locale: "tr" }));
    const salesCallArg = vi.mocked(GeoReportEmail).mock.calls[0]?.[0];
    expect(salesCallArg).toMatchObject({ audience: "sales", locale: "tr" });
  });
});
