import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { findBookingByToken, cancelBooking, rescheduleBooking } from "@/lib/booking/repository";
import { deleteEvent, patchEventTime, getAccessToken } from "@/lib/booking/google-calendar";
import { sendMailWithRetry } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import { GET, DELETE, PATCH } from "../[token]/route";

// Fix D: `vi.mock` fabrikaları kendi `vi.fn()`'lerini üretir; referanslar
// statik import + `vi.mocked()` ile alınıyor. Üst düzeyde `const x = vi.fn()`
// tanımlayıp fabrika içinde referanslamak TDZ (`ReferenceError: Cannot access
// '...' before initialization`) verir — Görev 5 uygulayıcısı bu duvara çarptı,
// aynı hata burada tekrarlanmıyor (Fix E).
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));

vi.mock("@/lib/booking/repository", () => ({
  findBookingByToken: vi.fn(),
  cancelBooking: vi.fn(),
  rescheduleBooking: vi.fn(),
}));

vi.mock("@/lib/booking/google-calendar", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/booking/google-calendar")>()),
  getAccessToken: vi.fn(),
  deleteEvent: vi.fn(),
  patchEventTime: vi.fn(),
}));

vi.mock("@/lib/mail/client", async (importActual) => ({
  sendMailWithRetry: vi.fn(),
  recipients: (await importActual<typeof import("@/lib/mail/client")>()).recipients,
}));

vi.mock("@/lib/observability/report", () => ({ reportError: vi.fn() }));

const baseEnv = { BOOKINGS_DB: {}, BOOKING_CALENDAR_IDS: "cal@x.com" };

function mockEnv(env: Record<string, unknown>): void {
  vi.mocked(getCloudflareContext).mockReturnValue({ env } as never);
}

const row = {
  id: "b1",
  cancelToken: "tok123",
  calendarEventId: "evt_1",
  startsAtUtc: "2026-09-07T10:00:00.000Z", // Pazartesi 13:00 yerel — meşru slot
  endsAtUtc: "2026-09-07T11:30:00.000Z",
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  locale: "tr",
  status: "confirmed",
  meetUrl: "https://meet.google.com/x",
};

const ctx = { params: Promise.resolve({ token: "tok123" }) };

function req(body?: unknown): Request {
  return new Request("http://localhost/api/booking/tok123", {
    method: "POST",
    headers: { "content-type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

describe("token rotası", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Fix D: Vitest'te sahte zamanlayıcı açılmadan `setSystemTime` etkisizdir.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
    mockEnv(baseEnv);
    vi.mocked(findBookingByToken).mockResolvedValue(row as never);
    vi.mocked(getAccessToken).mockResolvedValue("tok");
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("GET", () => {
    it("randevuyu döndürür", async () => {
      const res = await GET(req(), ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ ok: true, booking: { startsAtUtc: row.startsAtUtc } });
    });

    it("bilinmeyen token için 404", async () => {
      vi.mocked(findBookingByToken).mockResolvedValue(null);
      const res = await GET(req(), ctx);
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE", () => {
    it("iptal eder, Calendar etkinliğini siler, bildirim gönderir", async () => {
      vi.mocked(cancelBooking).mockResolvedValue("cancelled");
      const res = await DELETE(req(), ctx);
      expect(res.status).toBe(200);
      expect(deleteEvent).toHaveBeenCalledWith("tok", "cal@x.com", "evt_1");
      expect(sendMailWithRetry).toHaveBeenCalled();
    });

    it("ikinci kez çağrılınca hata DEĞİL, aynı sonucu döner (idempotent, spec §4)", async () => {
      vi.mocked(cancelBooking).mockResolvedValue("already_cancelled");
      const res = await DELETE(req(), ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ ok: true, alreadyCancelled: true });
      expect(deleteEvent).not.toHaveBeenCalled();
    });

    it("bilinmeyen token için 404", async () => {
      vi.mocked(findBookingByToken).mockResolvedValue(null);
      const res = await DELETE(req(), ctx);
      expect(res.status).toBe(404);
      expect(cancelBooking).not.toHaveBeenCalled();
    });

    it("Calendar silme başarısız olsa da iptal geçerli kalır (satır zaten iptal)", async () => {
      vi.mocked(cancelBooking).mockResolvedValue("cancelled");
      vi.mocked(deleteEvent).mockRejectedValue(new Error("calendar down"));
      const res = await DELETE(req(), ctx);
      expect(res.status).toBe(200);
      expect(reportError).toHaveBeenCalled();
    });

    it("mail hatası iptali geçersiz kılmaz — yakalanır, reportError çağrılır", async () => {
      vi.mocked(cancelBooking).mockResolvedValue("cancelled");
      vi.mocked(sendMailWithRetry).mockRejectedValue(new Error("smtp down"));
      const res = await DELETE(req(), ctx);
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ ok: true });
      expect(reportError).toHaveBeenCalled();
    });

    // --- Fix C: BOOKING_CALENDAR_IDS'in ilk elemanı boş olabilir -----------
    it("BOOKING_CALENDAR_IDS boşsa açık hata fırlatılır, iptal yine de başarılı olur", async () => {
      mockEnv({ ...baseEnv, BOOKING_CALENDAR_IDS: "" });
      vi.mocked(cancelBooking).mockResolvedValue("cancelled");
      const res = await DELETE(req(), ctx);
      expect(deleteEvent).not.toHaveBeenCalled();
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("BOOKING_CALENDAR_IDS") }),
        expect.anything(),
      );
      expect(res.status).toBe(200);
    });
  });

  describe("PATCH", () => {
    it("yeni saate taşır ve Meet bağlantısını korur (conferenceDataVersion GÖNDERMEZ)", async () => {
      vi.mocked(rescheduleBooking).mockResolvedValue({
        ok: true,
        row: { ...row, startsAtUtc: "2026-09-08T10:00:00.000Z", endsAtUtc: "2026-09-08T11:30:00.000Z" } as never,
      });
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(res.status).toBe(200);
      expect(patchEventTime).toHaveBeenCalledWith(
        "tok", "cal@x.com", "evt_1", "2026-09-08T10:00:00.000Z", "2026-09-08T11:30:00.000Z",
      );
      const body = await res.json();
      // Erteleme sonrası da blok 90 dakika (BOOKING_CONFIG.slotMinutes) —
      // spec §3.1b KİLİTLİ: vaat 1 saat, blok 90 dk.
      expect(body.endsAtUtc).toBe("2026-09-08T11:30:00.000Z");
    });

    it("dolu slota taşımayı 409 ile reddeder", async () => {
      vi.mocked(rescheduleBooking).mockResolvedValue({ ok: false, reason: "slot_taken" });
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(res.status).toBe(409);
      expect(patchEventTime).not.toHaveBeenCalled();
    });

    it("bulunamayan/iptal edilmiş randevu için 404", async () => {
      vi.mocked(rescheduleBooking).mockResolvedValue({ ok: false, reason: "not_found" });
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(res.status).toBe(404);
    });

    it("token bulunamazsa 404, rescheduleBooking çağrılmaz", async () => {
      vi.mocked(findBookingByToken).mockResolvedValue(null);
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(res.status).toBe(404);
      expect(rescheduleBooking).not.toHaveBeenCalled();
    });

    it("24 saat kuralını sunucuda uygular", async () => {
      vi.setSystemTime(new Date("2026-09-08T00:00:00.000Z"));
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(res.status).toBe(422);
      expect(rescheduleBooking).not.toHaveBeenCalled();
    });

    it("gövde eksikse 400", async () => {
      const res = await PATCH(req({}), ctx);
      expect(res.status).toBe(400);
      expect(rescheduleBooking).not.toHaveBeenCalled();
    });

    // --- Fix A: PATCH, Görev 5'e eklenen slot meşruluk kontrolünü ATLAMAMALI ---
    // Meşru bir slot rezerve edip sonra PATCH ile ızgara dışına ertelemek aynı
    // deliği yeniden açardı. "now" kasıtlı olarak hedef slotun günlerce
    // ÖNCESİNDE: yalnız 24 saat kuralı olsaydı bu istekler geçerdi.
    describe("Fix A — slot meşruluk kontrolü", () => {
      it("kapalı güne (Pazar) erteleme reddedilir, rescheduleBooking çağrılmaz", async () => {
        // 2026-09-13 Pazar, 13:00 yerel — ızgaraya ve saate uygun ama gün kapalı.
        const res = await PATCH(req({ startsAtUtc: "2026-09-13T10:00:00.000Z" }), ctx);
        expect(res.status).toBe(422);
        expect(await res.json()).toMatchObject({ ok: false, reason: "slot_unavailable" });
        expect(rescheduleBooking).not.toHaveBeenCalled();
      });

      it("ızgara dışı ana (13:17 yerel) erteleme reddedilir, rescheduleBooking çağrılmaz", async () => {
        // Aynı gün (2026-09-07, açık) ama başlangıç 10:00/11:45/13:30/15:15
        // UTC ızgarasına hizalı değil.
        const res = await PATCH(req({ startsAtUtc: "2026-09-07T10:17:00.000Z" }), ctx);
        expect(res.status).toBe(422);
        expect(await res.json()).toMatchObject({ ok: false, reason: "slot_unavailable" });
        expect(rescheduleBooking).not.toHaveBeenCalled();
      });
    });

    it("mail hatası ertelemeyi geçersiz kılmaz — yakalanır, reportError çağrılır", async () => {
      vi.mocked(rescheduleBooking).mockResolvedValue({
        ok: true,
        row: { ...row, startsAtUtc: "2026-09-08T10:00:00.000Z", endsAtUtc: "2026-09-08T11:30:00.000Z" } as never,
      });
      vi.mocked(patchEventTime).mockRejectedValue(new Error("calendar down"));
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(res.status).toBe(200);
      expect(reportError).toHaveBeenCalled();
    });

    // --- Fix C: BOOKING_CALENDAR_IDS'in ilk elemanı boş olabilir -----------
    it("BOOKING_CALENDAR_IDS boşsa açık hata fırlatılır, erteleme yine de başarılı olur", async () => {
      mockEnv({ ...baseEnv, BOOKING_CALENDAR_IDS: "" });
      vi.mocked(rescheduleBooking).mockResolvedValue({
        ok: true,
        row: { ...row, startsAtUtc: "2026-09-08T10:00:00.000Z", endsAtUtc: "2026-09-08T11:30:00.000Z" } as never,
      });
      const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
      expect(patchEventTime).not.toHaveBeenCalled();
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("BOOKING_CALENDAR_IDS") }),
        expect.anything(),
      );
      expect(res.status).toBe(200);
    });
  });
});
