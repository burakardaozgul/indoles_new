import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * `custom-worker.ts`'in `scheduled()` olayı bu modülü çağırır, ama
 * `custom-worker.ts`'in kendisi `.open-next/worker.js`'e bağımlı olduğu
 * için (yalnız `pnpm cf:build` sonrası var olur) doğrudan test edilemez.
 *
 * Bu dosyanın kanıtlamak zorunda olduğu şey: `scheduled()` yolu (bu modül)
 * ile HTTP yolu (`src/app/api/cron/route.ts`'teki `GET`) AYNI
 * `runDailyCronJob`'u çağırıyor — iki kopya mantık yok. Bunu tek bir
 * `vi.mock` ile ikisinin de aynı sahte fonksiyonu tetiklediğini göstererek
 * kanıtlıyoruz.
 */

vi.mock("@/lib/booking/cron-job", () => ({
  runDailyCronJob: vi
    .fn()
    .mockResolvedValue({ deletedCount: 0, completedCount: 0, orphanCount: 0 }),
}));
vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

import { runDailyCronJob } from "@/lib/booking/cron-job";
import { reportError } from "@/lib/observability/report";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { runForScheduledEvent } from "../scheduled-cron";
import { GET } from "@/app/api/cron/route";
import type { CronEnv } from "../cron-job";

const fakeEnv: CronEnv = {
  BOOKINGS_DB: {} as D1Database,
  BOOKING_CALENDAR_IDS: "digital@indoles.com.tr",
  GOOGLE_OAUTH_CLIENT_ID: "cid",
  GOOGLE_OAUTH_CLIENT_SECRET: "csec",
  GOOGLE_OAUTH_REFRESH_TOKEN: "rtok",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(runDailyCronJob).mockResolvedValue({
    deletedCount: 0,
    completedCount: 0,
    orphanCount: 0,
  });
});

describe("runForScheduledEvent — scheduled() giriş noktasının mantığı", () => {
  it("env'i argümandan aldığı gibi, olduğu gibi runDailyCronJob'a geçirir", async () => {
    await runForScheduledEvent(fakeEnv);
    expect(runDailyCronJob).toHaveBeenCalledTimes(1);
    expect(runDailyCronJob).toHaveBeenCalledWith(fakeEnv);
  });

  it("runDailyCronJob reddederse fırlatmaz — reportError'a düşer", async () => {
    vi.mocked(runDailyCronJob).mockRejectedValueOnce(new Error("boom"));

    await expect(runForScheduledEvent(fakeEnv)).resolves.toBeUndefined();

    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ route: "cron-scheduled", step: "run" })
    );
  });
});

describe("scheduled() ve GET /api/cron aynı runDailyCronJob'u çağırır", () => {
  it("iki giriş noktası da aynı fonksiyon referansını tetikler — iki kopya mantık yok", async () => {
    const originalSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    vi.mocked(getCloudflareContext).mockReturnValue({ env: fakeEnv } as never);

    try {
      await runForScheduledEvent(fakeEnv);
      await GET(
        new Request("http://localhost/api/cron", {
          headers: { "x-cron-secret": "test-secret" },
        })
      );

      expect(runDailyCronJob).toHaveBeenCalledTimes(2);
      expect(runDailyCronJob).toHaveBeenNthCalledWith(1, fakeEnv);
      expect(runDailyCronJob).toHaveBeenNthCalledWith(2, fakeEnv);
    } finally {
      process.env.CRON_SECRET = originalSecret;
    }
  });
});
