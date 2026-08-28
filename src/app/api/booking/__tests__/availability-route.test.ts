import { describe, expect, it, vi } from "vitest";
import { GET } from "../availability/route";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listSoldSlots } from "@/lib/booking/repository";
import { getAccessToken, fetchBusy, CalendarAuthError } from "@/lib/booking/google-calendar";

// `getCloudflareContext` Worker çalışma zamanı dışında anlamsız; env'i
// testten enjekte etmek için tamamen sahteleniyor.
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

// Rota yalnız `listSoldSlots` kullanıyor — tam sahtelemek yeterli.
vi.mock("@/lib/booking/repository", () => ({ listSoldSlots: vi.fn() }));

// `CalendarAuthError` GERÇEK kalmalı: rota `err instanceof CalendarAuthError`
// ile ayrım yapıyor, sahte bir sınıf bu kontrolü kırardı. Yalnız ağ çağrısı
// yapan iki fonksiyon sahteleniyor.
vi.mock("@/lib/booking/google-calendar", async (importActual) => {
  const actual = await importActual<typeof import("@/lib/booking/google-calendar")>();
  return { ...actual, getAccessToken: vi.fn(), fetchBusy: vi.fn() };
});

const baseEnv = {
  BOOKING_CALENDAR_IDS: "digital@indoles.com.tr,b.a.ozgul@gmail.com",
  GOOGLE_OAUTH_CLIENT_ID: "cid",
  GOOGLE_OAUTH_CLIENT_SECRET: "csec",
  GOOGLE_OAUTH_REFRESH_TOKEN: "rtok",
  // `listSoldSlots` sahte olduğu için gerçek bir D1Database gerekmiyor.
  BOOKINGS_DB: {} as unknown,
};

function mockEnv(env: Record<string, unknown>): void {
  vi.mocked(getCloudflareContext).mockReturnValue({ env } as never);
}

describe("GET /api/booking/availability", () => {
  it("getAccessToken CalendarAuthError fırlatınca 200 + unavailable + authExpired döner", async () => {
    mockEnv(baseEnv);
    vi.mocked(getAccessToken).mockRejectedValue(new CalendarAuthError("invalid_grant"));

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: false, unavailable: true, authExpired: true, days: [] });
  });

  it("fetchBusy genel hata fırlatınca 200 + unavailable + authExpired:false döner", async () => {
    mockEnv(baseEnv);
    vi.mocked(getAccessToken).mockResolvedValue("token");
    vi.mocked(fetchBusy).mockRejectedValue(
      new Error("freeBusy: istenen takvimlerin hiçbirinden müsaitlik alınamadı"),
    );

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: false, unavailable: true, authExpired: false, days: [] });
  });

  it("BOOKING_CALENDAR_IDS env eksikken 500 değil 200 + unavailable döner (Bulgu 1 regresyonu)", async () => {
    // Ayrıştırma try bloğunun dışına taşınırsa bu env'de `.split()`
    // yakalanmadan fırlar ve Next 500 döner. Düzeltme kalıcı olduğu sürece
    // bu test 200 + unavailable görmeli.
    const { BOOKING_CALENDAR_IDS: _drop, ...envWithoutCalendarIds } = baseEnv;
    mockEnv(envWithoutCalendarIds);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.unavailable).toBe(true);
    expect(body.days).toEqual([]);
  });

  it("mutlu yol: 200 + ok:true + 28 günlük days döner", async () => {
    mockEnv(baseEnv);
    vi.mocked(getAccessToken).mockResolvedValue("token");
    vi.mocked(fetchBusy).mockResolvedValue([]);
    vi.mocked(listSoldSlots).mockResolvedValue([]);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.days).toHaveLength(28);
  });
});
