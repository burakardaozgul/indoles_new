import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Görev 9 fix turu 1, bulgu 1 — dört adımın (silme, completed'e çekme, öksüz
 * raporu, canlılık) birbirinden İZOLE olduğunu doğrular. Denetçi mutasyonla
 * kanıtladı: izolasyon olmadan `deleteBookingsOlderThan` veya
 * `listOrphanedBookings` fırlayınca canlılık sorgusu (`fetchBusy`) HİÇ
 * çalışmıyordu — bu tam olarak OAuth refresh token'ının sessizce ölmesini
 * önleyen tek mekanizma (bkz. `cron-job.ts` adım 4 yorumu).
 *
 * `repository.ts` fonksiyonları burada MOCK'lanıyor (gerçek SQLite değil):
 * asıl kanıtlanması gereken şey orkestrasyon mantığı — "bir adım fırlarsa
 * diğerleri yine çalışır mı" — SQL'in kendisi değil. SQL doğruluğu zaten
 * `repository.test.ts`'te gerçek SQLite ile kanıtlanıyor.
 */

vi.mock("../repository", () => ({
  deleteBookingsOlderThan: vi.fn(),
  completePastBookings: vi.fn(),
  listOrphanedBookings: vi.fn(),
}));

vi.mock("../google-calendar", async (importActual) => ({
  ...(await importActual<typeof import("../google-calendar")>()),
  getAccessToken: vi.fn(),
  fetchBusy: vi.fn(),
}));

vi.mock("@/lib/mail/client", async (importActual) => ({
  sendMailWithRetry: vi.fn(),
  recipients: (await importActual<typeof import("@/lib/mail/client")>())
    .recipients,
}));

vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

import { runDailyCronJob, type CronEnv } from "../cron-job";
import {
  deleteBookingsOlderThan,
  completePastBookings,
  listOrphanedBookings,
} from "../repository";
import { getAccessToken, fetchBusy } from "../google-calendar";
import { sendMailWithRetry } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";

const fakeEnv: CronEnv = {
  BOOKINGS_DB: {} as D1Database,
  BOOKING_CALENDAR_IDS: "digital@indoles.com.tr",
  GOOGLE_OAUTH_CLIENT_ID: "cid",
  GOOGLE_OAUTH_CLIENT_SECRET: "csec",
  GOOGLE_OAUTH_REFRESH_TOKEN: "rtok",
};

const orphanRow = {
  id: "b1",
  cancelToken: "tok",
  calendarEventId: null,
  meetUrl: null,
  consultantId: "burak",
  startsAtUtc: "2026-10-01T10:00:00.000Z",
  endsAtUtc: "2026-10-01T11:30:00.000Z",
  visitorTimezone: "Europe/Istanbul",
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  locale: "tr" as const,
  status: "confirmed" as const,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(deleteBookingsOlderThan).mockResolvedValue(0);
  vi.mocked(completePastBookings).mockResolvedValue(0);
  vi.mocked(listOrphanedBookings).mockResolvedValue([]);
  vi.mocked(getAccessToken).mockResolvedValue("tok");
  vi.mocked(fetchBusy).mockResolvedValue([]);
  vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
});

describe("runDailyCronJob — adım izolasyonu (Görev 9 fix turu 1, bulgu 1)", () => {
  it("SİLME adımı patlarsa completed'e çekme, öksüz raporu VE canlılık sorgusu YİNE ÇALIŞIR", async () => {
    // Denetçinin tam kanıtladığı senaryo: "silme patlar, canlılık yine koşar".
    vi.mocked(deleteBookingsOlderThan).mockRejectedValue(
      new Error("SIMULATED DB FAILURE in DELETE step")
    );

    const result = await runDailyCronJob(fakeEnv, "http");

    expect(completePastBookings).toHaveBeenCalledTimes(1);
    expect(listOrphanedBookings).toHaveBeenCalledTimes(1);
    expect(fetchBusy).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ route: "cron", step: "retention-delete" })
    );
    // Fonksiyon fırlamaz, patlayan adım için güvenli varsayılan döner.
    expect(result.deletedCount).toBe(0);
  });

  it("COMPLETED'e ÇEKME adımı patlarsa silme, öksüz raporu VE canlılık sorgusu YİNE ÇALIŞIR", async () => {
    vi.mocked(completePastBookings).mockRejectedValue(
      new Error("SIMULATED DB FAILURE in complete-past step")
    );

    const result = await runDailyCronJob(fakeEnv, "http");

    expect(deleteBookingsOlderThan).toHaveBeenCalledTimes(1);
    expect(listOrphanedBookings).toHaveBeenCalledTimes(1);
    expect(fetchBusy).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ route: "cron", step: "complete-past" })
    );
    expect(result.completedCount).toBe(0);
  });

  it("ÖKSÜZ RAPORU sorgusu patlarsa silme, completed'e çekme VE canlılık sorgusu YİNE ÇALIŞIR", async () => {
    vi.mocked(listOrphanedBookings).mockRejectedValue(
      new Error("SIMULATED DB FAILURE in orphan query")
    );

    const result = await runDailyCronJob(fakeEnv, "http");

    expect(deleteBookingsOlderThan).toHaveBeenCalledTimes(1);
    expect(completePastBookings).toHaveBeenCalledTimes(1);
    expect(fetchBusy).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ route: "cron", step: "orphan-report-query" })
    );
    // Sorgu patladı — gönderecek veri yok, mail denenmemeli.
    expect(sendMailWithRetry).not.toHaveBeenCalled();
    expect(result.orphanCount).toBe(0);
  });

  it("ÖKSÜZ RAPORU maili patlarsa (sorgu başarılı) canlılık sorgusu YİNE ÇALIŞIR", async () => {
    // Sorgu adımı ile mail gönderim adımı ayrı hata sınırlarında — sorgu
    // başarılı olup mail patlasa bile orphanCount doğru dönmeli.
    vi.mocked(listOrphanedBookings).mockResolvedValue([orphanRow]);
    vi.mocked(sendMailWithRetry).mockRejectedValue(new Error("SMTP down"));

    const result = await runDailyCronJob(fakeEnv, "http");

    expect(fetchBusy).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ route: "cron", step: "orphan-report-mail" })
    );
    expect(result.orphanCount).toBe(1);
  });

  it("CANLILIK sorgusu patlarsa (CalendarAuthError DIŞINDA bir hata) fonksiyon yine de tamamlanır", async () => {
    // Diğer üç adım zaten canlılıktan ÖNCE çalıştığı için asıl doğrulanması
    // gereken şey: 4. adımın hatası runDailyCronJob'u fırlatmaz, sonucu
    // döndürür (route.ts ve scheduled-cron.ts'in ikisi de bu sözleşmeye
    // güveniyor).
    vi.mocked(fetchBusy).mockRejectedValue(new Error("network blip"));

    await expect(runDailyCronJob(fakeEnv, "http")).resolves.toMatchObject({
      deletedCount: 0,
      completedCount: 0,
      orphanCount: 0,
    });

    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ route: "cron", step: "liveness" })
    );
  });
});

/**
 * Gözlemlenebilirlik özeti: cron'un temiz bir turda Cloudflare Workers
 * Observability'de HİÇBİR iz bırakmadığı sorununu kapatır. Bu satır
 * olmadan "cron dün gece çalıştı mı" hiç cevaplanamıyor (bkz. görev
 * özeti) — dolayısıyla hem başarı hem hata yollarında çıktığını, hem de
 * `trigger` alanının çağırana göre doğru geldiğini kanıtlamak gerekiyor.
 */
describe("runDailyCronJob — gözlemlenebilirlik özeti (console.log)", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  function lastSummary(): Record<string, unknown> {
    const call = logSpy.mock.calls.at(-1);
    if (!call) throw new Error("console.log hiç çağrılmadı");
    return JSON.parse(call[0] as string) as Record<string, unknown>;
  }

  it("başarılı turda tek özet satırı yazar; sabit etiket, sayaçlar ve süre içerir", async () => {
    vi.mocked(deleteBookingsOlderThan).mockResolvedValue(3);
    vi.mocked(completePastBookings).mockResolvedValue(2);
    vi.mocked(listOrphanedBookings).mockResolvedValue([]);

    await runDailyCronJob(fakeEnv, "http");

    expect(logSpy).toHaveBeenCalledTimes(1);
    const summary = lastSummary();
    expect(summary).toMatchObject({
      tag: "cron:daily",
      trigger: "http",
      deletedCount: 3,
      completedCount: 2,
      orphanCount: 0,
      steps: {
        retentionDelete: "ok",
        completePast: "ok",
        orphanReportQuery: "ok",
        orphanReportMail: "skipped",
        liveness: "ok",
      },
    });
    expect(typeof summary.durationMs).toBe("number");
    expect(summary.durationMs as number).toBeGreaterThanOrEqual(0);
  });

  it('`trigger: "scheduled"` geçilirse özet satırında aynen görünür — HTTP çağrısıyla karışmaz', async () => {
    await runDailyCronJob(fakeEnv, "scheduled");

    expect(lastSummary()).toMatchObject({ trigger: "scheduled" });
  });

  it('`trigger: "http"` geçilirse özet satırında aynen görünür', async () => {
    await runDailyCronJob(fakeEnv, "http");

    expect(lastSummary()).toMatchObject({ trigger: "http" });
  });

  it("bir adım fırlarsa özet satırı YİNE yazılır ve o adımı hatalı gösterir — sessiz kalmaz", async () => {
    vi.mocked(deleteBookingsOlderThan).mockRejectedValue(
      new Error("SIMULATED DB FAILURE")
    );

    await runDailyCronJob(fakeEnv, "scheduled");

    expect(logSpy).toHaveBeenCalledTimes(1);
    const summary = lastSummary();
    expect(summary).toMatchObject({
      tag: "cron:daily",
      trigger: "scheduled",
      deletedCount: 0,
      steps: expect.objectContaining({ retentionDelete: "error" }),
    });
  });

  it('canlılık adımı fırlarsa özet satırı yine yazılır ve `liveness: "error"` gösterir', async () => {
    vi.mocked(fetchBusy).mockRejectedValue(new Error("network blip"));

    await runDailyCronJob(fakeEnv, "http");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(lastSummary()).toMatchObject({
      steps: expect.objectContaining({ liveness: "error" }),
    });
  });

  it('öksüz raporu maili patlarsa özet satırında `orphanReportMail: "error"` görünür', async () => {
    vi.mocked(listOrphanedBookings).mockResolvedValue([orphanRow]);
    vi.mocked(sendMailWithRetry).mockRejectedValue(new Error("SMTP down"));

    await runDailyCronJob(fakeEnv, "http");

    expect(lastSummary()).toMatchObject({
      orphanCount: 1,
      steps: expect.objectContaining({ orphanReportMail: "error" }),
    });
  });
});
