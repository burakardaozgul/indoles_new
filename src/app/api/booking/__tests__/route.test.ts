import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createBooking, attachCalendarResult, markFailed } from "@/lib/booking/repository";
import { createEvent, getAccessToken } from "@/lib/booking/google-calendar";
import { sendMailWithRetry } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import { POST } from "../route";

// `getCloudflareContext` Worker çalışma zamanı dışında anlamsız; env'i
// testten enjekte etmek için sahteleniyor. Statik değil `vi.fn()`: Fix C
// testi env'i test başına değiştirmek zorunda (ilk takvim kimliği boş).
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

// `hasActiveBooking` mock'lanmıyor: rota onu hiç çağırmaz. Aktif randevu
// garantisi Görev 2'de kısmi unique indekse taşındı; rota yalnız
// `createBooking`'in dönüş `reason`'ına güvenir (bkz. "ikinci aktif randevu"
// testi altta).
vi.mock("@/lib/booking/repository", () => ({
  createBooking: vi.fn(),
  attachCalendarResult: vi.fn(),
  markFailed: vi.fn(),
}));

vi.mock("@/lib/booking/google-calendar", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/booking/google-calendar")>()),
  getAccessToken: vi.fn(),
  createEvent: vi.fn(),
}));

// `recipients` gerçek uygulamasıyla mock'lanıyor: rotanın alıcı listesini
// diziye çevirdiğini doğrulamak istiyoruz, o davranışı sahteleyip atlamak değil.
vi.mock("@/lib/mail/client", async (importActual) => ({
  sendMailWithRetry: vi.fn(),
  recipients: (await importActual<typeof import("@/lib/mail/client")>()).recipients,
}));

vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

const baseEnv = {
  BOOKINGS_DB: {},
  BOOKING_CALENDAR_IDS: "cal@x.com",
};

function mockEnv(env: Record<string, unknown>): void {
  vi.mocked(getCloudflareContext).mockReturnValue({ env } as never);
}

const validBody = {
  startsAtUtc: "2026-09-07T10:00:00.000Z", // Pazartesi 13:00 yerel — meşru slot #1
  visitorTimezone: "Europe/Istanbul",
  locale: "tr",
  lead: {
    firstName: "Ayşe",
    lastName: "Yılmaz",
    phone: "+905550001122",
    email: "ayse@example.com",
    company: "Acme",
    title: "CTO",
  },
  persona: "donusum-teknoloji",
  problems: ["a", "b", "c"],
  kvkkConsent: true,
  website: "",
  elapsedMs: 9000,
};

function req(body: unknown): Request {
  return new Request("http://localhost/api/booking", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const row = {
  id: "b1",
  cancelToken: "tok123",
  startsAtUtc: validBody.startsAtUtc,
  endsAtUtc: "2026-09-07T11:30:00.000Z",
  email: validBody.lead.email,
  name: "Ayşe Yılmaz",
  locale: "tr",
  status: "confirmed",
};

describe("POST /api/booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Vitest'te sahte zamanlayıcı açılmadan `setSystemTime` etkisizdir —
    // Görev 5 planındaki hata buydu. Görev 4'ün rotası
    // (`availability-route.test.ts`) doğru deseni kullanıyor: `useFakeTimers()`
    // + `afterEach`'te `useRealTimers()`.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
    mockEnv(baseEnv);
    vi.mocked(createBooking).mockResolvedValue({ ok: true, row } as never);
    vi.mocked(getAccessToken).mockResolvedValue("tok");
    vi.mocked(createEvent).mockResolvedValue({ eventId: "evt_1", meetUrl: "https://meet.google.com/x" });
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mutlu yol: D1 yazılır, Calendar açılır, iki mail gider", async () => {
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, meetUrl: "https://meet.google.com/x" });
    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(createEvent).toHaveBeenCalledTimes(1);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
    // Spec §3.2 adım 5: `calendar_event_id` ve `meet_url` satıra işlenir.
    expect(attachCalendarResult).toHaveBeenCalledWith(
      expect.anything(),
      "b1",
      "evt_1",
      "https://meet.google.com/x",
    );
  });

  it("D1 Calendar'DAN ÖNCE yazılır", async () => {
    // Ters sıra, kaydı olmayan takvim etkinliği bırakırdı (spec §3.2).
    const order: string[] = [];
    vi.mocked(createBooking).mockImplementation(async () => {
      order.push("db");
      return { ok: true, row } as never;
    });
    vi.mocked(createEvent).mockImplementation(async () => {
      order.push("calendar");
      return { eventId: "e", meetUrl: null };
    });
    await POST(req(validBody));
    expect(order).toEqual(["db", "calendar"]);
  });

  it("slot az önce dolduysa 409 ve sebep döner", async () => {
    vi.mocked(createBooking).mockResolvedValue({ ok: false, reason: "slot_taken" });
    const res = await POST(req(validBody));
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ reason: "slot_taken" });
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("aynı e-postadan ikinci aktif randevu 409 + duplicate_email döner (Fix E)", async () => {
    // Garanti kısmi unique indekste yaşıyor (Görev 2); rota yalnız
    // `createBooking`'in döndürdüğü `reason`'a güveniyor, kendi kontrolünü
    // icat etmiyor.
    vi.mocked(createBooking).mockResolvedValue({ ok: false, reason: "duplicate_email" });
    const res = await POST(req(validBody));
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ ok: false, reason: "duplicate_email" });
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("Calendar düşerse satır confirmed KALIR (markFailed çağrılmaz) AMA bildirim maili yine gider (ADR-029)", async () => {
    // Lead kaybolmamalı: manuel dönülebilsin (spec §4). Mekanizma ADR-029 ile
    // değişti: `failed` işaretlemek `idx_bookings_slot` ve
    // `idx_bookings_active_email` kısmi indekslerinden satırı düşürüp slotu
    // aynı anda yeniden satılabilir kılıyordu — tam da niyetin (lead kaybolmaz,
    // manuel dönülebilir) karşısında bir davranış. Artık satır `confirmed`
    // kalıyor, işaret `calendar_event_id IS NULL`.
    vi.mocked(createEvent).mockRejectedValue(new Error("calendar down"));
    const res = await POST(req(validBody));
    expect(markFailed).not.toHaveBeenCalled();
    expect(attachCalendarResult).not.toHaveBeenCalled();
    expect(sendMailWithRetry).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, degraded: true });
  });

  it("Calendar düşmüş bir rezervasyondan sonra AYNI slota ikinci POST 409 alır (ADR-029 mutasyon kanıtı)", async () => {
    // Kusurun tam karşılığı: satır `failed`e düşseydi `idx_bookings_slot`
    // kısmi unique indeksten çıkar, slot anında yeniden satılabilir olurdu.
    // `createBooking`/`markFailed` burada BİRLİKTE, gerçekçi kuruluyor: ortak
    // bir "sahte satır durumu" tutuyorlar, tıpkı D1'deki kısmi indeksin
    // yalnız `status = 'confirmed'` satırları kapsaması gibi. Eğer rota hâlâ
    // `markFailed` çağırsaydı, bu sahte durum 'failed'e döner, ikinci POST
    // slotu boş bulup 200 dönerdi — test o regresyonu yakalamak için var.
    let slotStatus: "confirmed" | "failed" | null = null;
    vi.mocked(createBooking).mockImplementation(async () => {
      if (slotStatus === "confirmed") return { ok: false, reason: "slot_taken" };
      slotStatus = "confirmed";
      return { ok: true, row } as never;
    });
    vi.mocked(markFailed).mockImplementation(async () => {
      slotStatus = "failed";
    });
    vi.mocked(createEvent).mockRejectedValue(new Error("calendar down"));

    const first = await POST(req(validBody));
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({ ok: true, degraded: true });
    // Doğru davranış: satır hâlâ `confirmed`, ikinci istek aynı slota çarpar.
    expect(markFailed).not.toHaveBeenCalled();

    const second = await POST(req(validBody));
    expect(second.status).toBe(409);
    expect(await second.json()).toMatchObject({ ok: false, reason: "slot_taken" });
  });

  it("24 saatten yakın slot sunucuda reddedilir", async () => {
    // İstemci zaten göstermiyor ama tek koruma istemci olamaz (spec §3.1b).
    vi.setSystemTime(new Date("2026-09-07T00:00:00.000Z"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(422);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it("geçmiş slot reddedilir", async () => {
    vi.setSystemTime(new Date("2026-09-08T00:00:00.000Z"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(422);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it("bal küpü doluysa sahte başarı döner ve hiçbir şey yazılmaz", async () => {
    const res = await POST(req({ ...validBody, website: "http://spam" }));
    expect(res.status).toBe(200);
    expect(createBooking).not.toHaveBeenCalled();
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it("KVKK: D1'e yalnız ad ve e-posta gider", async () => {
    await POST(req(validBody));
    const arg = vi.mocked(createBooking).mock.calls[0]![1] as Record<string, unknown>;
    expect(Object.keys(arg).sort()).toEqual([
      "consultantId",
      "email",
      "endsAtUtc",
      "locale",
      "name",
      "startsAtUtc",
      "visitorTimezone",
    ]);
  });

  // --- Fix A: sunucu slotun MEŞRU olduğunu doğrulamalı ------------------
  // Tek koruma olarak `isSlotBookable` yalnız 24 saat kuralını kapatıyordu.
  // Kapalı gün, ızgara dışı bir an ve `firstAvailableDate` öncesi bir tarih
  // hepsi o kontrolden geçerdi. Üç senaryoda da "now" kasıtlı olarak slotun
  // günlerce ÖNCESİNDE tutuluyor — yani 24 saat kuralı TEK BAŞINA bu
  // istekleri geçirirdi. Reddin nedeni yalnız slot-meşruluk kontrolü olmalı.
  describe("Fix A — slot meşruluk kontrolü", () => {
    it("kapalı gün (Pazar) reddedilir, D1'e hiçbir şey yazılmaz", async () => {
      // 2026-09-13 Pazar, 13:00 yerel — ızgaraya ve saate uygun ama gün kapalı.
      // "now" 2026-09-01: ~12 gün lead var, yalnız 24 saat kuralı olsaydı geçerdi.
      const res = await POST(req({ ...validBody, startsAtUtc: "2026-09-13T10:00:00.000Z" }));
      expect(res.status).toBe(422);
      expect(await res.json()).toMatchObject({ ok: false, reason: "slot_unavailable" });
      expect(createBooking).not.toHaveBeenCalled();
    });

    it("ızgara dışı an (13:17 yerel) reddedilir, D1'e hiçbir şey yazılmaz", async () => {
      // Aynı gün (2026-09-07, açık), ama slot başlangıcı 10:00/11:45/13:30/15:15
      // UTC ızgarasına hizalı değil. "now" 2026-09-01: ~6 gün lead var.
      const res = await POST(req({ ...validBody, startsAtUtc: "2026-09-07T10:17:00.000Z" }));
      expect(res.status).toBe(422);
      expect(await res.json()).toMatchObject({ ok: false, reason: "slot_unavailable" });
      expect(createBooking).not.toHaveBeenCalled();
    });

    it("firstAvailableDate (2026-08-31) öncesi bir tarih reddedilir, D1'e hiçbir şey yazılmaz", async () => {
      // 2026-08-25 Salı, 13:00 yerel — hafta günü ve saat ızgaraya uygun ama
      // tek seferlik başlangıçtan önce. "now" bu test için 2026-08-20'ye
      // çekiliyor: ~5 gün lead var, yalnız 24 saat kuralı olsaydı geçerdi.
      vi.setSystemTime(new Date("2026-08-20T09:00:00.000Z"));
      const res = await POST(req({ ...validBody, startsAtUtc: "2026-08-25T10:00:00.000Z" }));
      expect(res.status).toBe(422);
      expect(await res.json()).toMatchObject({ ok: false, reason: "slot_unavailable" });
      expect(createBooking).not.toHaveBeenCalled();
    });
  });

  // --- Fix C: BOOKING_CALENDAR_IDS'in ilk elemanı boş olabilir -----------
  describe("Fix C — boş ilk takvim kimliği", () => {
    it("BOOKING_CALENDAR_IDS tamamen boşsa açık hata fırlatılır, createEvent çağrılmaz", async () => {
      mockEnv({ ...baseEnv, BOOKING_CALENDAR_IDS: "" });
      const res = await POST(req(validBody));
      expect(createEvent).not.toHaveBeenCalled();
      // Aynı catch bloğu — ADR-029 sonrası burada da satır confirmed kalır.
      expect(markFailed).not.toHaveBeenCalled();
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("BOOKING_CALENDAR_IDS") }),
        expect.anything(),
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ ok: true, degraded: true });
    });

    it("BOOKING_CALENDAR_IDS baştan virgülle başlıyorsa (ilk eleman boş) açık hata fırlatılır", async () => {
      // "" .split(",")[0] === "" ama burada ikinci bir kimlik de var —
      // yalnız `.length === 0` kontrolü bunu yakalamaz, İLK elemana bakılmalı.
      mockEnv({ ...baseEnv, BOOKING_CALENDAR_IDS: ",ikinci@x.com" });
      const res = await POST(req(validBody));
      expect(createEvent).not.toHaveBeenCalled();
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("BOOKING_CALENDAR_IDS") }),
        expect.anything(),
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ ok: true, degraded: true });
    });
  });
});
