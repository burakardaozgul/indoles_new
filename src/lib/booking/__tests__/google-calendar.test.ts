import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getAccessToken, fetchBusy, createEvent, deleteEvent, patchEventTime, CalendarAuthError,
} from "../google-calendar";

const env = {
  GOOGLE_OAUTH_CLIENT_ID: "cid",
  GOOGLE_OAUTH_CLIENT_SECRET: "csec",
  GOOGLE_OAUTH_REFRESH_TOKEN: "rtok",
} as const;

beforeEach(() => { vi.restoreAllMocks(); });

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok, status, json: async () => body, text: async () => JSON.stringify(body),
  });
}

describe("getAccessToken", () => {
  it("refresh token ile access token alır", async () => {
    const f = mockFetchOnce({ access_token: "ya29.test" });
    vi.stubGlobal("fetch", f);
    expect(await getAccessToken(env)).toBe("ya29.test");
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("oauth2.googleapis.com/token");
    expect(String(init.body)).toContain("grant_type=refresh_token");
  });

  it("invalid_grant CalendarAuthError olarak fırlatılır", async () => {
    // Sessiz bozulmanın tek görünür anı burası; çağıran bu tipe bakarak
    // uyarı maili gönderiyor (spec §8).
    vi.stubGlobal("fetch", mockFetchOnce({ error: "invalid_grant" }, false, 400));
    await expect(getAccessToken(env)).rejects.toBeInstanceOf(CalendarAuthError);
  });
});

describe("fetchBusy", () => {
  it("birden fazla takvimin dolu aralıklarını birleştirir", async () => {
    // Müsaitlik tek takvimden değil kimlik listesinden okunuyor (spec §2.1b).
    vi.stubGlobal("fetch", mockFetchOnce({
      calendars: {
        "digital@indoles.com.tr": { busy: [{ start: "2026-09-07T10:00:00Z", end: "2026-09-07T11:00:00Z" }] },
        "b.a.ozgul@gmail.com": { busy: [{ start: "2026-09-07T13:00:00Z", end: "2026-09-07T14:00:00Z" }] },
      },
    }));
    const busy = await fetchBusy("tok", ["digital@indoles.com.tr", "b.a.ozgul@gmail.com"],
      "2026-09-01T00:00:00Z", "2026-09-30T00:00:00Z");
    expect(busy).toHaveLength(2);
  });

  it("erişilemeyen takvim hatası tüm sorguyu düşürmez", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({
      calendars: {
        "digital@indoles.com.tr": { busy: [{ start: "2026-09-07T10:00:00Z", end: "2026-09-07T11:00:00Z" }] },
        "yok@example.com": { errors: [{ reason: "notFound" }] },
      },
    }));
    const busy = await fetchBusy("tok", ["digital@indoles.com.tr", "yok@example.com"],
      "2026-09-01T00:00:00Z", "2026-09-30T00:00:00Z");
    expect(busy).toHaveLength(1);
  });

  it("401 durumunda CalendarAuthError fırlatır", async () => {
    // Yetkinin koptuğu tek görünür an burada da geçerli: fetchBusy'nin
    // genel Error fırlatması uyarı mekanizmasının hiç tetiklenmemesi
    // demekti.
    vi.stubGlobal("fetch", mockFetchOnce({ error: "unauthorized" }, false, 401));
    await expect(
      fetchBusy("tok", ["digital@indoles.com.tr"], "2026-09-01T00:00:00Z", "2026-09-30T00:00:00Z"),
    ).rejects.toBeInstanceOf(CalendarAuthError);
  });

  it("istenen takvimlerin TAMAMI hatalıysa sessiz boş kutu yerine fırlatır", async () => {
    // Kısmi hata yok sayılır ama hepsi hatalıysa boş dizi "müsait"
    // anlamına gelir ve dolu saatler satılır (spec §4).
    vi.stubGlobal("fetch", mockFetchOnce({
      calendars: {
        "digital@indoles.com.tr": { errors: [{ reason: "notFound" }] },
        "yok@example.com": { errors: [{ reason: "notFound" }] },
      },
    }));
    await expect(
      fetchBusy("tok", ["digital@indoles.com.tr", "yok@example.com"],
        "2026-09-01T00:00:00Z", "2026-09-30T00:00:00Z"),
    ).rejects.toThrow();
  });
});

describe("createEvent", () => {
  it("conferenceDataVersion=1 ile Meet bağlantısı ister", async () => {
    const f = mockFetchOnce({
      id: "evt_1",
      hangoutLink: "https://meet.google.com/abc-defg-hij",
      conferenceData: { conferenceId: "abc" },
    });
    vi.stubGlobal("fetch", f);
    const res = await createEvent("tok", "digital@indoles.com.tr", {
      summary: "INDOLES görüşmesi",
      description: "detay",
      startUtc: "2026-09-07T10:00:00.000Z",
      endUtc: "2026-09-07T11:30:00.000Z",
      attendeeEmail: "ayse@example.com",
    });
    expect(res).toEqual({ eventId: "evt_1", meetUrl: "https://meet.google.com/abc-defg-hij" });
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("conferenceDataVersion=1");
    expect(String(init.body)).toContain("hangoutsMeet");
  });

  it("Meet linki hazır gelmezse events.get ile teyit eder", async () => {
    // Google konferansı asenkron üretebilir; insert yanıtı linki henüz
    // taşımayabilir (spec §8: status.statusCode success değilse teyit).
    const f = vi.fn()
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: async () => ({ id: "evt_1", conferenceData: { createRequest: { status: { statusCode: "pending" } } } }),
        text: async () => "",
      })
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: async () => ({ id: "evt_1", hangoutLink: "https://meet.google.com/xyz" }),
        text: async () => "",
      });
    vi.stubGlobal("fetch", f);
    const res = await createEvent("tok", "cal", {
      summary: "s", description: "d",
      startUtc: "2026-09-07T10:00:00.000Z", endUtc: "2026-09-07T11:30:00.000Z",
      attendeeEmail: "a@b.com",
    });
    expect(res.meetUrl).toBe("https://meet.google.com/xyz");
    expect(f).toHaveBeenCalledTimes(2);
  });

  it("teyit çağrısı da başarısız olursa etkinlik yine döner, hata fırlatmaz", async () => {
    const f = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: "evt_1" }), text: async () => "" })
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}), text: async () => "" });
    vi.stubGlobal("fetch", f);
    const res = await createEvent("tok", "cal", {
      summary: "s", description: "d",
      startUtc: "2026-09-07T10:00:00.000Z", endUtc: "2026-09-07T11:30:00.000Z",
      attendeeEmail: "a@b.com",
    });
    expect(res).toEqual({ eventId: "evt_1", meetUrl: null });
  });
});

describe("deleteEvent", () => {
  // Spec §7 test stratejisi: "İptal linki ikinci tıklamada hata vermiyor
  // mu (idempotent)". 404/410 zaten silinmiş anlamına gelir, hata değil.
  it("404 başarı sayılır (zaten yok)", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}, false, 404));
    await expect(deleteEvent("tok", "cal", "evt_1")).resolves.toBeUndefined();
  });

  it("410 başarı sayılır (zaten silinmiş — iptal idempotent)", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}, false, 410));
    await expect(deleteEvent("tok", "cal", "evt_1")).resolves.toBeUndefined();
  });

  it("500 genel hata olarak fırlatır", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}, false, 500));
    await expect(deleteEvent("tok", "cal", "evt_1")).rejects.toThrow();
  });

  it("401 CalendarAuthError olarak fırlatır", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}, false, 401));
    await expect(deleteEvent("tok", "cal", "evt_1")).rejects.toBeInstanceOf(CalendarAuthError);
  });
});

describe("patchEventTime", () => {
  it("conferenceData'ya DOKUNMAZ — Meet bağlantısı korunur", async () => {
    // conferenceDataVersion gönderilmezse Google mevcut konferansı koruyor.
    const f = mockFetchOnce({ id: "evt_1" });
    vi.stubGlobal("fetch", f);
    await patchEventTime("tok", "cal", "evt_1", "2026-09-08T10:00:00.000Z", "2026-09-08T11:30:00.000Z");
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain("conferenceDataVersion");
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(["end", "start"]);
  });
});
