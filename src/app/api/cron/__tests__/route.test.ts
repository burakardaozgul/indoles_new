import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createBooking, attachCalendarResult } from "@/lib/booking/repository";

// `getCloudflareContext` Worker çalışma zamanı dışında anlamsız; env'i
// testten enjekte etmek için sahteleniyor (mevcut booking rotalarıyla aynı
// desen, bkz. src/app/api/booking/__tests__/route.test.ts).
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

// Yalnız ağa çıkan iki fonksiyon sahteleniyor; geri kalanı (CalendarAuthError
// dahil) GERÇEK kalıyor — rota `instanceof` ile ayrım yapıyor. `vi.fn()`
// doğrudan factory İÇİNDE üretiliyor: dışarıda bir `const` tanımlayıp
// faktöre referans vermek `vi.mock` hoisting'iyle TDZ hatası veriyor (yalnız
// "mock" önekiyle başlayan değişkenler istisna) — bu, mevcut booking
// rotalarındaki testlerin de izlediği desen.
vi.mock("@/lib/booking/google-calendar", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/booking/google-calendar")>()),
  getAccessToken: vi.fn(),
  fetchBusy: vi.fn(),
}));

vi.mock("@/lib/mail/client", async (importActual) => ({
  sendMailWithRetry: vi.fn(),
  recipients: (await importActual<typeof import("@/lib/mail/client")>())
    .recipients,
}));

import { getAccessToken, fetchBusy } from "@/lib/booking/google-calendar";
import { sendMailWithRetry } from "@/lib/mail/client";
import { GET } from "../route";

/**
 * D1 SQLite üzerine kurulu — repository.test.ts ile aynı gerekçe: asıl
 * kanıtlanması gereken şey "geçmiş confirmed satır gerçekten completed'e
 * dönüyor mu ve gerçekten silinen satır sayısı doğru mu" — mock bir depo bunu
 * kanıtlayamaz. İki göç de sırayla uygulanıyor: 0002 olmadan 'completed'
 * durumu CHECK kısıtını ihlal eder.
 */
function makeDb() {
  const sqlite = new Database(":memory:");
  sqlite.exec(readFileSync("migrations/0001_bookings.sql", "utf-8"));
  sqlite.exec(readFileSync("migrations/0002_completed_status.sql", "utf-8"));
  return {
    prepare(sql: string) {
      const stmt = sqlite.prepare(sql);
      let bound: unknown[] = [];
      const api = {
        bind: (...args: unknown[]) => {
          bound = args;
          return api;
        },
        run: async () => {
          const info = stmt.run(...bound);
          return { success: true, meta: { changes: info.changes } };
        },
        first: async () => stmt.get(...bound) ?? null,
        all: async () => ({ results: stmt.all(...bound) }),
      };
      return api;
    },
  } as unknown as D1Database;
}

const CRON_SECRET = "test-cron-secret";

function req(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/cron", { headers });
}

function mockEnv(
  db: D1Database,
  overrides: Record<string, unknown> = {}
): void {
  vi.mocked(getCloudflareContext).mockReturnValue({
    env: {
      BOOKINGS_DB: db,
      BOOKING_CALENDAR_IDS: "digital@indoles.com.tr",
      GOOGLE_OAUTH_CLIENT_ID: "cid",
      GOOGLE_OAUTH_CLIENT_SECRET: "csec",
      GOOGLE_OAUTH_REFRESH_TOKEN: "rtok",
      ...overrides,
    },
  } as never);
}

const base = {
  consultantId: "burak",
  visitorTimezone: "Europe/Istanbul",
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  locale: "tr" as const,
};

// Sabit takvim yılı yerine gerçek "şimdi"ye göreli tarihler: cron-job.ts
// `getCloudflareContext()` gibi enjekte edilebilir bir "now" almıyor, gerçek
// `new Date()` kullanıyor (spec §8'deki canlılık sorgusuyla aynı gerekçe —
// bu iki farklı çağıranı, ikisi de kendi gerçek zamanında, desteklemek
// zorunda). Sabit bir yıl (ör. "2026-01-01") test ileride çalıştırıldığında
// "90 günden eski" ile "geçmiş ama 90 günden yeni" ayrımını sessizce bozardı.
const dayMs = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * dayMs).toISOString();
const daysFromNow = (n: number) =>
  new Date(Date.now() + n * dayMs).toISOString();

let originalCronSecret: string | undefined;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAccessToken).mockResolvedValue("tok");
  vi.mocked(fetchBusy).mockResolvedValue([]);
  vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
  originalCronSecret = process.env.CRON_SECRET;
  process.env.CRON_SECRET = CRON_SECRET;
});

afterEach(() => {
  process.env.CRON_SECRET = originalCronSecret;
});

describe("GET /api/cron — yetkilendirme", () => {
  // Cloudflare'in kendi Cron Trigger'ı Worker'ın `scheduled()` olayını
  // çağırıyor, bu HTTP rotasını DEĞİL — yani bu rota internetten HERKES
  // tarafından çağrılabilir. Tek koruma bu sır kontrolü.
  it("sır başlığı eksikse 401 döner, hiçbir iş yapılmaz", async () => {
    const db = makeDb();
    mockEnv(db);
    const res = await GET(req());
    expect(res.status).toBe(401);
    expect(vi.mocked(fetchBusy)).not.toHaveBeenCalled();
  });

  it("yanlış sır 401 döner", async () => {
    const db = makeDb();
    mockEnv(db);
    const res = await GET(req({ "x-cron-secret": "yanlis" }));
    expect(res.status).toBe(401);
  });

  it("CRON_SECRET yapılandırılmamışsa (undefined) HER İSTEK reddedilir — güvenli tarafta kal", async () => {
    process.env.CRON_SECRET = "";
    const db = makeDb();
    mockEnv(db);
    const res = await GET(req({ "x-cron-secret": "" }));
    expect(res.status).toBe(401);
  });

  it("doğru sır 200 döner", async () => {
    const db = makeDb();
    mockEnv(db);
    const res = await GET(req({ "x-cron-secret": CRON_SECRET }));
    expect(res.status).toBe(200);
  });
});

describe("GET /api/cron — günlük temizlik", () => {
  it("90 günden eski satırları siler", async () => {
    const db = makeDb();
    const created = await createBooking(db, {
      ...base,
      startsAtUtc: daysAgo(100),
      endsAtUtc: daysAgo(100), // yalnız cutoff'la kıyaslanıyor, bitiş saati testte önemsiz
    });
    if (!created.ok) throw new Error("kurulum başarısız");
    mockEnv(db);

    const res = await GET(req({ "x-cron-secret": CRON_SECRET }));
    const json = (await res.json()) as { deletedCount: number };
    expect(json.deletedCount).toBe(1);
  });

  // --- MUTASYON KANITI: bu test `completePastBookings` çağrısı cron-job.ts'ten
  // geçici kaldırıldığında FAIL etmeli (bkz. teslim raporu madde 4). ---
  it("başlangıcı geçmiş confirmed satırı completed'e çeker — aktif randevu kilidini serbest bırakır", async () => {
    // TARİH BİLİNÇLİ SEÇİLDİ: geçmişte ama 90 GÜNDEN YENİ olmalı, yoksa
    // yukarıdaki retention silmesi satırı zaten kaldırır ve test "completed"
    // adımına hiç ihtiyaç duymadan geçer.
    const db = makeDb();
    const created = await createBooking(db, {
      ...base,
      startsAtUtc: daysAgo(10),
      endsAtUtc: daysAgo(10),
    });
    if (!created.ok) throw new Error("kurulum başarısız");
    mockEnv(db);

    await GET(req({ "x-cron-secret": CRON_SECRET }));

    // Kilit gerçekten serbest mi: aynı e-postayla YENİ bir randevu artık kurulabilmeli.
    const second = await createBooking(db, {
      ...base,
      startsAtUtc: daysFromNow(30),
      endsAtUtc: daysFromNow(30),
    });
    expect(second.ok).toBe(true);
  });

  it("canlılık sorgusu çalışır", async () => {
    const db = makeDb();
    mockEnv(db);
    await GET(req({ "x-cron-secret": CRON_SECRET }));
    expect(vi.mocked(fetchBusy)).toHaveBeenCalled();
  });

  it("yetki koptuysa uyarı maili gider", async () => {
    const db = makeDb();
    mockEnv(db);
    const { CalendarAuthError } = await import("@/lib/booking/google-calendar");
    vi.mocked(fetchBusy).mockRejectedValue(
      new CalendarAuthError("invalid_grant")
    );

    await GET(req({ "x-cron-secret": CRON_SECRET }));

    expect(vi.mocked(sendMailWithRetry)).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/yeniden yetkilendirme/i),
      })
    );
  });
});

describe("GET /api/cron — öksüz randevu raporu (Görev 9 Ek 2)", () => {
  it("öksüz randevu YOKSA mail GÖNDERİLMEZ", async () => {
    const db = makeDb();
    const created = await createBooking(db, {
      ...base,
      startsAtUtc: daysFromNow(30),
      endsAtUtc: daysFromNow(30),
    });
    if (!created.ok) throw new Error("kurulum başarısız");
    await attachCalendarResult(
      db,
      created.row.id,
      "evt_1",
      "https://meet.google.com/abc"
    ); // öksüz değil
    mockEnv(db);

    await GET(req({ "x-cron-secret": CRON_SECRET }));

    // Bu kritik: "her şey yolunda" maili her gün gelirse gerçek uyarı gömülür.
    expect(vi.mocked(sendMailWithRetry)).not.toHaveBeenCalled();
  });

  it("öksüz randevu VARSA tek özet mail gönderilir", async () => {
    const db = makeDb();
    const created = await createBooking(db, {
      ...base,
      startsAtUtc: daysFromNow(30), // gelecekte, calendar_event_id hiç dolmadı
      endsAtUtc: daysFromNow(30),
    });
    if (!created.ok) throw new Error("kurulum başarısız");
    mockEnv(db);

    await GET(req({ "x-cron-secret": CRON_SECRET }));

    expect(vi.mocked(sendMailWithRetry)).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/1 randevu takvime düşmedi/),
      })
    );
  });
});
