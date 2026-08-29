import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactBookingScreen } from "../ContactBookingScreen";

/**
 * `/iletisim`in gömülü rezervasyon yüzeyi (Görev 10, spec §5): popup'ta
 * modal olarak kullanılan AYNI `BookingScreen` bileşeni burada modalsız,
 * doğrudan sayfada render ediliyor. Bu dosya iki şeyi kanıtlıyor:
 *
 * 1) Bileşen gerçekten "gömülü" — `BookingScreen` hiçbir stage/tıklama
 *    olmadan ilk render'da görünür (popup'ta 3 aşama sonra açılırdı) ve
 *    hiçbir `role="dialog"` yok.
 * 2) Rezervasyon gönderme davranışı `EntryPopup`in booking dalıyla AYNI:
 *    409 mesajı + müsaitlik yenileme + form korunumu, mutlu yolda
 *    `SuccessState`e geçiş. (`BookingSubmit.test.tsx` ile bilinçli paralel.)
 *
 * `bookingSchema` (`@/lib/schemas/booking.ts`) `persona`yı yalnız
 * `source: "popup"` için zorunlu tutuyor; `problems` kısıtı da `source`a
 * bağlı (superRefine) — `/iletisim`de Stage1/Stage2 seçimi YOK, bu yüzden
 * `source: "contact"` + `problems: []` gönderiliyor. Bu testler gönderilen
 * değerlerin şemaya uyduğunu ve uydurma olmadığını (persona: sitenin var
 * olan persona merceği doluysa o, boşsa alan hiç gönderilmiyor; problems:
 * gerçekten boş, üç uydurma dize DEĞİL) kilitliyor.
 */
vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = () => [];
    return t;
  },
}));

const personaState = vi.hoisted(() => ({ slug: null as string | null }));
vi.mock("@/lib/hooks/use-persona", () => ({
  usePersonaState: () => ({ slug: personaState.slug, ready: true }),
}));

const trackMock = vi.fn();
vi.mock("@/lib/analytics/ga", () => ({
  track: (...args: unknown[]) => trackMock(...args),
}));

const days = [
  {
    date: "2026-09-07",
    slots: [{ startUtc: "2026-09-07T10:00:00.000Z", endUtc: "2026-09-07T11:30:00.000Z" }],
  },
];

function fillLeadFields() {
  fireEvent.change(screen.getByLabelText(/firstName/i), { target: { value: "Ali" } });
  fireEvent.change(screen.getByLabelText(/lastName/i), { target: { value: "Veli" } });
  fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+905551234567" } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ali@veli.com" } });
  fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "Test AŞ" } });
  fireEvent.change(screen.getByLabelText(/title/i, { selector: "input" }), {
    target: { value: "CTO" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /kvkk/i }));
}

async function selectFirstSlot() {
  await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "7 Eylül" }));
  const slotBtn = await screen.findByRole("button", { name: /^\d{2}:\d{2}$/ });
  fireEvent.click(slotBtn);
}

beforeEach(() => {
  vi.restoreAllMocks();
  trackMock.mockClear();
  personaState.slug = null;
  vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
});

describe("ContactBookingScreen — gömülü rezervasyon (spec §5)", () => {
  it("BookingScreen'i modal olmadan, ilk render'da doğrudan gösterir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days: [] }) }),
    );
    render(<ContactBookingScreen locale="tr" />);

    // LeadFieldsForm hiçbir tıklama olmadan görünür — popup'ta 3 aşama sonra açılırdı.
    expect(screen.getByLabelText(/firstName/i)).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();

    // Müsaitlik cevabı (mock fetch) act() dışında çözülmesin diye bekleniyor.
    await waitFor(() => expect(screen.queryByText(/loadingAvailability/i)).toBeNull());
  });

  it("409 'slot_taken': mesaj gösterir, müsaitliği yeniden yükler, form içeriği korunur", async () => {
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (u === "/api/booking" && init?.method === "POST") {
        return Promise.resolve({
          ok: false,
          status: 409,
          json: async () => ({ ok: false, reason: "slot_taken" }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactBookingScreen locale="tr" />);
    await selectFirstSlot();
    fillLeadFields();

    const availabilityCallsBefore = fetchMock.mock.calls.filter((c) =>
      String(c[0]).includes("/api/booking/availability"),
    ).length;

    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/slotTakenError/i));
    expect(screen.getByLabelText(/firstName/i)).toHaveValue("Ali");
    expect(screen.getByLabelText(/email/i)).toHaveValue("ali@veli.com");
    expect(screen.queryByText(/success\.bookingTitle/i)).toBeNull();

    await waitFor(() => {
      const after = fetchMock.mock.calls.filter((c) =>
        String(c[0]).includes("/api/booking/availability"),
      ).length;
      expect(after).toBeGreaterThan(availabilityCallsBefore);
    });
  });

  it("başarılı rezervasyon: SuccessState'e geçer, Meet ve iptal linkini alır, brief_submitted yazılır", async () => {
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (u === "/api/booking" && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            ok: true,
            cancelToken: "tok_abc",
            meetUrl: "https://meet.google.com/xyz",
            degraded: false,
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactBookingScreen locale="tr" />);
    await selectFirstSlot();
    fillLeadFields();
    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await screen.findByText(/success\.bookingTitle/i);
    const link = screen.getByRole("link", { name: /meetLink/i });
    expect(link).toHaveAttribute("href", "https://meet.google.com/xyz");
    expect(trackMock).toHaveBeenCalledWith({
      name: "brief_submitted",
      properties: { briefId: expect.any(String) },
    });
  });

  it("persona merceği boşsa alanı hiç göndermez — site varsayılanı uydurulmaz, problems gerçekten boş kalır", async () => {
    personaState.slug = null;
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (u === "/api/booking" && init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        // `personaSlug` null iken `persona` anahtarı JSON gövdesinde hiç
        // yer almamalı — daha önce burada site geneli varsayılan
        // (`donusum-teknoloji`) uyduruluyordu (denetim bulgusu).
        expect(body).not.toHaveProperty("persona");
        expect(body.source).toBe("contact");
        expect(Array.isArray(body.problems)).toBe(true);
        expect(body.problems).toHaveLength(0);
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ ok: true, cancelToken: null, meetUrl: null, degraded: false }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactBookingScreen locale="tr" />);
    await selectFirstSlot();
    fillLeadFields();
    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await screen.findByText(/success\.bookingTitle/i);
  });

  it("persona merceği ticaret ise onu gönderir — site genelindeki mevcut mercek kullanılır, uydurulmaz", async () => {
    personaState.slug = "buyume-pazarlar";
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (u === "/api/booking" && init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        expect(body.persona).toBe("buyume-pazarlar");
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ ok: true, cancelToken: null, meetUrl: null, degraded: false }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactBookingScreen locale="tr" />);
    await selectFirstSlot();
    fillLeadFields();
    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await screen.findByText(/success\.bookingTitle/i);
  });
});
