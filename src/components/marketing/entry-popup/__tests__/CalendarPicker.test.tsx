import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CalendarPicker } from "../CalendarPicker";

/**
 * `CalendarPicker` tamamen kontrollü bir bileşen: `selectedDate`/`selectedTime`
 * kendi state'i değil, prop. Gerçek kullanımda bunu `BookingScreen` sağlıyor.
 * Gün tıklaması → saat listesi akışını test etmek için statik `onSlotChange={() => {}}`
 * yeterli değil (prop hiç güncellenmez, saat bölümü hiç açılmaz) — bu yüzden
 * `BookingScreen`in yaptığı gibi küçük, stateful bir sarmalayıcı kullanıyoruz.
 */
function ControlledCalendar({
  locale,
  onSlotChange,
}: {
  locale: "tr" | "en";
  onSlotChange: (date: string | null, time: string | null) => void;
}) {
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
        onSlotChange(d, t);
      }}
    />
  );
}

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (k: string) => k;
    return t;
  },
}));

/**
 * `days` server contract'ı `computeAvailability`'nin ürettiği şekille aynı
 * (bkz. `src/lib/booking/availability.ts`): her gün bir tarih + o gün için
 * gerçekten satılabilir UTC slot listesi taşır. "2026-09-07" pazartesi iki
 * slotla geliyor, "2026-09-08" (salı) hiç slotsuz — kapalı gün de olabilir,
 * dolu gün de; bileşenin bunu ayırt etmesine gerek yok, ikisi de disabled.
 */
const days = [
  {
    date: "2026-09-07",
    slots: [
      { startUtc: "2026-09-07T10:00:00.000Z", endUtc: "2026-09-07T11:30:00.000Z" },
      { startUtc: "2026-09-07T13:30:00.000Z", endUtc: "2026-09-07T15:00:00.000Z" },
    ],
  },
  { date: "2026-09-08", slots: [] },
];

const baseProps = {
  locale: "tr" as const,
  onSlotChange: vi.fn(),
  selectedDate: null,
  selectedTime: null,
};

beforeEach(() => {
  vi.restoreAllMocks();
  // Takvim her testte aynı ayı (Eylül 2026) açsın diye sistem saatini
  // sabitliyoruz — aksi halde "7" günü ay navigasyonunun neresinde
  // olduğuna bağlı olur ve test tarihe göre kırılıp düzelir.
  vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
});

describe("CalendarPicker — sunucudan müsaitlik", () => {
  it("geçerli ayı render eder", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<CalendarPicker {...baseProps} />);
    await waitFor(() => expect(screen.getByRole("grid")).toBeInTheDocument());
  });

  it("SABİT saat listesi ÜRETMEZ, sunucudan geleni gösterir", async () => {
    // Eski davranış sekiz sabit saat basıyordu ve dolu saatleri müsait
    // gösteriyordu; bu testin varlık sebebi o regresyonu engellemek.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<ControlledCalendar locale="tr" onSlotChange={vi.fn()} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7 Eylül" }));
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: /^\d{2}:\d{2}$/ })).toHaveLength(2),
    );
    expect(screen.queryByRole("button", { name: "09:00" })).toBeNull();
  });

  it("slotu olmayan gün seçilemez", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<CalendarPicker {...baseProps} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "8 Eylül" })).toBeDisabled());
  });

  it("veri gelene kadar hiçbir gün seçilebilir görünmez (sahte müsaitlik yok)", async () => {
    // Sunucu cevabı gelmeden ÖNCE hiçbir gün "müsait" gibi tıklanabilir
    // olmamalı — eski davranış hafta içi günleri anında ve koşulsuz açardı.
    let resolveFetch!: (v: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise((res) => { resolveFetch = res; })),
    );
    render(<CalendarPicker {...baseProps} />);
    expect(screen.getByRole("button", { name: "7 Eylül" })).toBeDisabled();
    resolveFetch({ ok: true, json: async () => ({ ok: true, days }) });
    await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
  });

  it("yükleme sırasında 'müsaitlik yükleniyor' duyurusu var, gün 'uygun saat yok' YALANI söylemez", async () => {
    // Denetim bulgusu (Bulgu 3): müsaitlik gelene kadar her gün disabled +
    // title="disabledDayHint" basılıyordu — bu o an için YANLIŞ bir iddia
    // (slot olup olmadığı henüz bilinmiyor). Sessiz de değildi ("uygun saat
    // yok" görünüyordu) ama YANLIŞ bir mesajdı.
    let resolveFetch!: (v: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise((res) => { resolveFetch = res; })),
    );
    render(<CalendarPicker {...baseProps} />);

    // Yükleniyor duyurusu DOM'da.
    expect(screen.getByRole("status")).toHaveTextContent("loadingAvailability");
    // Disabled gün henüz "uygun saat yok" demiyor — title basılmıyor.
    expect(screen.getByRole("button", { name: "7 Eylül" })).not.toHaveAttribute("title");

    resolveFetch({ ok: true, json: async () => ({ ok: true, days }) });
    // Veri geldikten sonra yükleniyor duyurusu kalkar.
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
    // Gerçekten slotsuz bir gün için artık doğru mesaj görünür.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "8 Eylül" })).toHaveAttribute(
        "title",
        "disabledDayHint",
      ),
    );
  });

  it("sistem bozuksa iletişim formuna yönlendiren mesaj gösterir", async () => {
    // Sessiz boş kutu gösterilmiyor (spec §4).
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: false, unavailable: true, days: [] }) }),
    );
    render(<CalendarPicker {...baseProps} />);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("systemUnavailable"));
    // Takvim ızgarası bile basılmıyor — dolu-görünen ama işe yaramaz bir
    // ızgara "sessiz boş kutu"nun kendisi olurdu.
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("ağ hatasında da aynı dürüst mesaja düşer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    render(<CalendarPicker {...baseProps} />);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("systemUnavailable"));
  });

  it("seçim UTC olarak yukarı iletilir", async () => {
    const onSlotChange = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<ControlledCalendar locale="tr" onSlotChange={onSlotChange} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7 Eylül" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7 Eylül" }));
    const slotBtn = (await screen.findAllByRole("button", { name: /^\d{2}:\d{2}$/ }))[0]!;
    fireEvent.click(slotBtn);
    expect(onSlotChange).toHaveBeenCalledWith("2026-09-07", "2026-09-07T10:00:00.000Z");
  });

  it("ay navigasyonu çalışır", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, days }) }),
    );
    render(<CalendarPicker {...baseProps} />);
    await waitFor(() => expect(screen.getByRole("grid")).toBeInTheDocument());
    const nextBtn = screen.getByRole("button", { name: /sonraki ay/i });
    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
