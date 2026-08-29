import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { CalendarPicker } from "../CalendarPicker";

/**
 * Denetim bulgusu (Görev 8 fix turu 1, Bulgu 1): bu ortamın (ve muhtemelen
 * CI'ın) varsayılan sistem saat dilimi zaten Europe/Istanbul olduğu için
 * `showIstanbul` dalı hiçbir testte render EDİLMEMİŞTİ — sıfır coverage.
 * Bu dosya diğer `CalendarPicker.test.tsx`'ten AYRI: `process.env.TZ`'yi
 * kasıtlı olarak Istanbul-DIŞI bir dilime kurup o dalı gerçekten çalıştırır.
 * Ortamın varsayılanına güvenilmiyor — TZ burada açıkça America/New_York.
 */

vi.mock("next-intl", () => ({
  useTranslations: () => {
    // Gerçek next-intl'in basit bir taklidi: parametre varsa anahtar +
    // parametreleri birlikte döndürür, böylece testte hem "hangi metin"
    // hem "hangi parametrelerle" doğrulanabilir.
    const t = (key: string, params?: Record<string, string>) =>
      params ? `${key}(${JSON.stringify(params)})` : key;
    return t;
  },
}));

const days = [
  {
    date: "2026-09-07",
    slots: [
      { startUtc: "2026-09-07T10:00:00.000Z", endUtc: "2026-09-07T11:30:00.000Z" },
      { startUtc: "2026-09-07T17:00:00.000Z", endUtc: "2026-09-07T18:30:00.000Z" },
    ],
  },
];

/**
 * `CalendarPicker` tamamen kontrollü (selectedDate/selectedTime kendi
 * state'i değil, prop) — gün tıklaması sonrası saat listesinin açılmasını
 * görebilmek için `BookingScreen`in yaptığı gibi stateful bir sarmalayıcı
 * gerekiyor (bkz. `CalendarPicker.test.tsx`, aynı desen).
 */
function ControlledCalendar({ locale }: { locale: "tr" | "en" }) {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  return (
    <CalendarPicker
      locale={locale}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onSlotChange={(d, t) => {
        setSelectedDate(d);
        setSelectedTime(t);
      }}
    />
  );
}

let originalTz: string | undefined;

beforeEach(() => {
  vi.restoreAllMocks();
  originalTz = process.env.TZ;
  // 2026-09-07 10:00Z ve 17:00Z, New York'ta (EDT, UTC-4) 06:00 ve 13:00 —
  // İstanbul'dan (UTC+3) açıkça farklı, dolayısıyla `showIstanbul` dalı
  // tetiklenir. Auditörün ad-hoc kanıtıyla aynı senaryo.
  process.env.TZ = "America/New_York";
  vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
});

afterEach(() => {
  // Süreç genelinde `process.env.TZ` başka test dosyalarını etkilemesin —
  // bu değişken process-level, dosyalar aynı worker'da art arda koşabilir.
  process.env.TZ = originalTz;
});

describe("CalendarPicker — İstanbul saati (TZ != Europe/Istanbul)", () => {
  it("buton erişilebilir adı YALNIZ saat kalır, İstanbul notu adı kirletmez", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<ControlledCalendar locale="tr" />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7 Eylül" }));

    // İki slot da tam olarak "HH:MM" desenine uyan bir isimle bulunabilmeli.
    // Ad kirlenmiş olsaydı (İstanbul notu isme karışsaydı) regex eşleşmezdi.
    const slotButtons = await screen.findAllByRole("button", { name: /^\d{2}:\d{2}$/ });
    expect(slotButtons).toHaveLength(2);

    // Doğrudan da doğrula: "06:00" adında bir buton var, "06:00 ..." gibi
    // uzatılmış bir ad YOK.
    expect(screen.getByRole("button", { name: "06:00" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /06:00.+/ })).toBeNull();
  });

  it("İstanbul saati DOM'da GÖRÜNÜR (sr-only değil), listenin altında bir kez", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<ControlledCalendar locale="tr" />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7 Eylül" }));
    await screen.findAllByRole("button", { name: /^\d{2}:\d{2}$/ });

    const note = screen.getByText(/istanbulRangeNote/);
    expect(note).toBeInTheDocument();
    // Görünür olmalı: sr-only sınıfı TAŞIMAMALI (aksi halde ekran
    // okuyucuya duyurulur ama gören ziyaretçi hiç görmez — bulgu 1(b)).
    expect(note.className).not.toMatch(/sr-only/);
    expect(note.getAttribute("aria-hidden")).toBeNull();

    // Tek bir yerde: sekiz saat butonu içinde AYRI AYRI tekrar basılmıyor.
    expect(screen.getAllByText(/istanbulRangeNote/)).toHaveLength(1);
  });

  it("İstanbul diliminde (visitor tz === Europe/Istanbul) ikinci satır hiç basılmaz", async () => {
    process.env.TZ = "Europe/Istanbul";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<ControlledCalendar locale="tr" />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7 Eylül" }));
    await screen.findAllByRole("button", { name: /^\d{2}:\d{2}$/ });

    expect(screen.queryByText(/istanbulRangeNote/)).toBeNull();
    expect(screen.queryByText(/istanbulTimeLabel/)).toBeNull();
  });
});
