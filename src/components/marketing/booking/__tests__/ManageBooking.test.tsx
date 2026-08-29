import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ManageBooking } from "../ManageBooking";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = () => [];
    return t;
  },
}));

const activeBooking = {
  ok: true,
  booking: {
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    endsAtUtc: "2026-09-07T11:30:00.000Z",
    status: "confirmed",
    meetUrl: "https://meet.google.com/abc-defg-hij",
    locale: "tr",
  },
};

const days = [
  {
    date: "2026-09-14",
    slots: [{ startUtc: "2026-09-14T10:00:00.000Z", endUtc: "2026-09-14T11:30:00.000Z" }],
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
});

describe("ManageBooking — görüntüle / iptal et / ertele", () => {
  it("randevu bulunamazsa dürüst bir mesaj gösterir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({ ok: false, reason: "not_found" }) }),
    );
    render(<ManageBooking locale="tr" token="bad-token" />);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/notFoundTitle|notFoundBody/i));
  });

  it("aktif randevuyu görüntüler: tarih/saat ve Meet bağlantısı", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => activeBooking }));
    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByRole("link", { name: /meetLink/i })).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /meetLink/i })).toHaveAttribute(
      "href",
      "https://meet.google.com/abc-defg-hij",
    );
  });

  it("meetUrl yoksa sahte link basmaz, dürüst mesaj gösterir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, booking: { ...activeBooking.booking, meetUrl: null } }),
      }),
    );
    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByText(/noMeetYet/i)).toBeInTheDocument());
    expect(screen.queryByRole("link", { name: /meetLink/i })).toBeNull();
  });

  it("zaten iptal edilmiş randevuyu iptal mesajıyla gösterir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, booking: { ...activeBooking.booking, status: "cancelled" } }),
      }),
    );
    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByText(/cancelledTitle/i)).toBeInTheDocument());
    // İptal edilmiş bir randevu için ne iptal ne erteleme aksiyonu anlamlı.
    expect(screen.queryByRole("button", { name: /cancelCta/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /rescheduleCta/i })).toBeNull();
  });

  it("iptal: onay adımından geçer, DELETE çağırır, iptal görünümüne geçer", async () => {
    const fetchMock = vi.fn((_url: unknown, init?: RequestInit) => {
      if (init?.method === "DELETE") {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
      }
      return Promise.resolve({ ok: true, json: async () => activeBooking });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByRole("button", { name: /cancelCta/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /cancelCta/i }));
    // Tek tıkla iptal etmiyor: bir onay adımı var.
    const confirmBtn = await screen.findByRole("button", { name: /cancelConfirmYes/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(screen.getByText(/cancelledTitle/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/booking/tok123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("iptal ikinci kez tıklanırsa hata değil, 'zaten iptal edilmiş' gösterir (idempotent)", async () => {
    const fetchMock = vi.fn((_url: unknown, init?: RequestInit) => {
      if (init?.method === "DELETE") {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, alreadyCancelled: true }) });
      }
      return Promise.resolve({ ok: true, json: async () => activeBooking });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByRole("button", { name: /cancelCta/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /cancelCta/i }));
    fireEvent.click(await screen.findByRole("button", { name: /cancelConfirmYes/i }));

    await waitFor(() => expect(screen.getByText(/cancelledTitle/i)).toBeInTheDocument());
    // İdempotent: alreadyCancelled=true de aynı "iptal edildi" ekranına düşer, hata basmaz.
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("erteleme: aynı CalendarPicker'ı kullanır, yeni saat seçilince PATCH çağırır", async () => {
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (init?.method === "PATCH") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ ok: true, startsAtUtc: "2026-09-14T10:00:00.000Z", endsAtUtc: "2026-09-14T11:30:00.000Z" }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => activeBooking });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByRole("button", { name: /rescheduleCta/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /rescheduleCta/i }));

    // Takvim ızgarası göründü — yeni bir arayüz çizilmedi, mevcut CalendarPicker göründü.
    await waitFor(() => expect(screen.getByRole("grid")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole("button", { name: "14 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "14 Eylül" }));
    const slotBtn = await screen.findByRole("button", { name: /^\d{2}:\d{2}$/ });
    fireEvent.click(slotBtn);

    fireEvent.click(screen.getByRole("button", { name: /rescheduleConfirmCta/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/booking/tok123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ startsAtUtc: "2026-09-14T10:00:00.000Z" }),
        }),
      ),
    );
  });

  it("erteleme 409 (slot_taken) verirse hata gösterir ve müsaitliği yeniler", async () => {
    let patchCalls = 0;
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (init?.method === "PATCH") {
        patchCalls += 1;
        return Promise.resolve({ ok: false, status: 409, json: async () => ({ ok: false, reason: "slot_taken" }) });
      }
      return Promise.resolve({ ok: true, json: async () => activeBooking });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ManageBooking locale="tr" token="tok123" />);
    await waitFor(() => expect(screen.getByRole("button", { name: /rescheduleCta/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /rescheduleCta/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: "14 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "14 Eylül" }));
    const slotBtn = await screen.findByRole("button", { name: /^\d{2}:\d{2}$/ });
    fireEvent.click(slotBtn);
    fireEvent.click(screen.getByRole("button", { name: /rescheduleConfirmCta/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/rescheduleTakenError/i));
    expect(patchCalls).toBe(1);
  });
});
