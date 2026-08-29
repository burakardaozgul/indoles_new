import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EntryPopup } from "../EntryPopup";

/**
 * `EntryPopup`in `booking` dalını `POST /api/booking`e bağlayan davranışı
 * kapsar (Görev 8, bağlayıcı kural 3): 409 "bu saat az önce alındı" hem
 * mesaj gösterip müsaitliği yeniden yüklemeli hem de ziyaretçi bilgilerini
 * KORUMALI; mutlu yolda ise `cancelToken`/`meetUrl` `SuccessState`e gitmeli.
 *
 * Turnstile burada bilinçli KAPALI (env değişkeni set edilmiyor) —
 * `submit-guards.test.tsx` ile aynı yaklaşım, widget mock'u bu testin
 * konusu değil.
 */
vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = () => [];
    return t;
  },
  useLocale: () => "tr",
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
  vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
});

describe("EntryPopup — rezervasyon gönderme akışı", () => {
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

    render(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="booking"
        initialPersona="donusum-teknoloji"
        initialProblems={["p1", "p2", "p3"]}
      />,
    );

    await selectFirstSlot();
    fillLeadFields();

    const availabilityCallsBefore = fetchMock.mock.calls.filter((c) =>
      String(c[0]).includes("/api/booking/availability"),
    ).length;

    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/slotTakenError/i));

    // Form içeriği korunur — ziyaretçi bilgilerini tekrar yazmaz (kural 3).
    expect(screen.getByLabelText(/firstName/i)).toHaveValue("Ali");
    expect(screen.getByLabelText(/email/i)).toHaveValue("ali@veli.com");

    // Hâlâ booking aşamasındayız (success'e geçmedi).
    expect(screen.queryByText(/success\.bookingTitle/i)).toBeNull();

    // Müsaitlik yeniden yüklendi: en az bir GET /api/booking/availability daha yapıldı.
    await waitFor(() => {
      const after = fetchMock.mock.calls.filter((c) =>
        String(c[0]).includes("/api/booking/availability"),
      ).length;
      expect(after).toBeGreaterThan(availabilityCallsBefore);
    });
  });

  it("başarılı rezervasyon: SuccessState'e geçer, Meet ve iptal linkini alır", async () => {
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (u === "/api/booking" && init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        expect(body.startsAtUtc).toBe("2026-09-07T10:00:00.000Z");
        expect(body.lead.email).toBe("ali@veli.com");
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

    render(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="booking"
        initialPersona="donusum-teknoloji"
        initialProblems={["p1", "p2", "p3"]}
      />,
    );

    await selectFirstSlot();
    fillLeadFields();
    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await screen.findByText(/success\.bookingTitle/i);
    const link = screen.getByRole("link", { name: /meetLink/i });
    expect(link).toHaveAttribute("href", "https://meet.google.com/xyz");
  });

  it("degraded rezervasyon: sahte Meet linki göstermez, dürüst mesaj basar", async () => {
    const fetchMock = vi.fn((url: unknown, init?: RequestInit) => {
      const u = String(url);
      if (u.includes("/api/booking/availability")) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true, days }) });
      }
      if (u === "/api/booking" && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ ok: true, cancelToken: "tok_abc", meetUrl: null, degraded: true }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="booking"
        initialPersona="donusum-teknoloji"
        initialProblems={["p1", "p2", "p3"]}
      />,
    );

    await selectFirstSlot();
    fillLeadFields();
    fireEvent.click(screen.getByRole("button", { name: /submitCta/i }));

    await screen.findByText(/success\.bookingTitle/i);
    expect(screen.getByText(/degradedNotice/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /meetLink/i })).toBeNull();
  });
});
