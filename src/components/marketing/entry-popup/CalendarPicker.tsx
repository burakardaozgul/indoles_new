"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Ertelemede (Görev 8) ve "bu saat az önce alındı" 409'unda (`EntryPopup`)
 * müsaitliğin yeniden yüklenmesi gerekiyor, ama bu bileşen `BookingScreen`
 * içinde iki seviye derinlikte ve o dosyaya (spec §5'te "değişmiyor" işaretli)
 * bir prop deliği açmadan tetiklenmesi lazım. `window` olayı bu iki
 * kısıtlamayı birden çözüyor: `ManageBooking` de aynı olayı dinleyerek
 * kendi CalendarPicker örneğini tazeleyebilir.
 */
export const BOOKING_AVAILABILITY_REFRESH_EVENT = "indoles:booking-availability-refresh";

type AvailabilitySlot = { startUtc: string; endUtc: string };
type AvailabilityDay = { date: string; slots: AvailabilitySlot[] };

// Minimal date helpers — no date-fns dependency
function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  // month: 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const cells: (Date | null)[] = [];

  // Leading nulls to align Sun-Sat
  for (let i = 0; i < startDow; i++) cells.push(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    cells.push(new Date(year, month, d));
  }

  // Trailing nulls to complete last week
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

const DAY_HEADERS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const DAY_HEADERS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Props = {
  locale: "tr" | "en";
  onSlotChange: (date: string | null, time: string | null) => void;
  selectedDate: string | null;
  selectedTime: string | null;
};

export function CalendarPicker({ locale, onSlotChange, selectedDate, selectedTime }: Props) {
  const t = useTranslations("popup.booking");

  const today = startOfDay(new Date());

  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());

  // `days === null` → sunucu cevabı henüz gelmedi. Bu durumda hiçbir gün
  // "müsait" görünmez (aşağıdaki `isDayDisabled`, boş haritada her günü
  // disabled sayar) — eski sabit takvim tam tersini yapıyordu: veri hiç
  // sorulmadan hafta içi her günü anında tıklanabilir gösteriyordu.
  const [days, setDays] = React.useState<AvailabilityDay[] | null>(null);
  const [unavailable, setUnavailable] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch("/api/booking/availability")
        .then((r) => r.json())
        .then((d: { ok: boolean; unavailable?: boolean; days?: AvailabilityDay[] }) => {
          if (cancelled) return;
          // `unavailable` "bugün uygun saat yok" ile "sistem bozuk"u ayırıyor;
          // ikisi aynı boş kutuya düşerse ziyaretçi çıkışsız kalır (spec §4).
          setUnavailable(Boolean(!d.ok && d.unavailable));
          setDays(d.days ?? []);
        })
        .catch(() => {
          if (!cancelled) {
            setUnavailable(true);
            setDays([]);
          }
        });
    };

    load();
    window.addEventListener(BOOKING_AVAILABILITY_REFRESH_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(BOOKING_AVAILABILITY_REFRESH_EVENT, load);
    };
  }, []);

  const slotsByDate = React.useMemo(() => {
    const m = new Map<string, AvailabilitySlot[]>();
    for (const d of days ?? []) m.set(d.date, d.slots);
    return m;
  }, [days]);

  const visitorTimeZone = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );
  const localTimeFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );
  const istanbulTimeFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
        timeZone: "Europe/Istanbul",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  const monthNames = locale === "tr" ? MONTH_NAMES_TR : MONTH_NAMES_EN;
  const dayHeaders = locale === "tr" ? DAY_HEADERS_TR : DAY_HEADERS_EN;

  const grid = getMonthGrid(viewYear, viewMonth);

  // Max navigation: current month + 2
  const maxMonth = today.getMonth() + 2;
  const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);
  const normalizedMaxMonth = maxMonth % 12;

  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());
  const canGoNext = !(viewYear === maxYear && viewMonth === normalizedMaxMonth);

  const handlePrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (date: Date) => {
    const iso = isoDate(date);
    if (iso === selectedDate) return;
    onSlotChange(iso, null);
  };

  const handleTimeClick = (startUtc: string) => {
    if (startUtc === selectedTime) return;
    // Yukarı UTC iletiliyor; ekranda ziyaretçinin dilimine çevrilen yalnız
    // GÖSTERİM (spec §3.3). `POST /api/booking` UTC ister, `Intl` gösterim
    // string'ini geri UTC'ye ayrıştırmak kırılgan olurdu.
    onSlotChange(selectedDate, startUtc);
  };

  const isDayDisabled = (date: Date): boolean => {
    if (startOfDay(date) < today) return true; // past — savunma amaçlı, sunucu zaten göstermez
    // Hafta sonu kuralı artık bileşende değil sunucuda (spec §3.1b): Cumartesi
    // açık, Pazar kapalı, ama ikisi de aynı yoldan geçer — bu bileşen hangi
    // günün neden kapalı olduğunu bilmez, yalnız slot sayısına bakar. Sunucu
    // cevabı gelmeden (`days === null`) harita boş olduğu için her gün
    // disabled kalır — sahte müsaitlik yok.
    return (slotsByDate.get(isoDate(date))?.length ?? 0) === 0;
  };

  const isDaySelected = (date: Date): boolean => isoDate(date) === selectedDate;
  const isDayToday = (date: Date): boolean => isoDate(date) === isoDate(today);

  if (unavailable) {
    // Sessiz boş kutu yok (spec §4): takvim ızgarası hiç basılmıyor, dürüst
    // bir mesaj ve iletişim formuna yönlendirme var. `role="status"` ekran
    // okuyucuya da duyurur.
    return (
      <div className="space-y-4">
        <p role="status" className="text-sm text-ink-700">
          {t("systemUnavailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month navigation header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label={locale === "tr" ? "Önceki ay" : "Previous month"}
          className="flex items-center justify-center w-8 h-8 rounded-md text-ink-500
                     hover:text-ink-900 hover:bg-surface-2 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed
                     focus-visible:ring-2 focus-visible:ring-brand-500
                     focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>

        <span className="text-sm font-medium text-ink-900">
          {monthNames[viewMonth]} {viewYear}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label={locale === "tr" ? "Sonraki ay" : "Next month"}
          className="flex items-center justify-center w-8 h-8 rounded-md text-ink-500
                     hover:text-ink-900 hover:bg-surface-2 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed
                     focus-visible:ring-2 focus-visible:ring-brand-500
                     focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-px text-center" role="row">
        {dayHeaders.map((h) => (
          <div key={h} className="text-xs font-medium text-ink-500 py-1" aria-label={h}>
            {h}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        className="grid grid-cols-7 gap-px"
        role="grid"
        aria-label={locale === "tr"
          ? `${monthNames[viewMonth]} ${viewYear} takvimi`
          : `${monthNames[viewMonth]} ${viewYear} calendar`}
      >
        {grid.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} aria-hidden />;
          }

          const disabled = isDayDisabled(date);
          const selected = isDaySelected(date);
          const isToday = isDayToday(date);

          return (
            <div key={isoDate(date)} className="flex items-center justify-center p-0.5">
              <button
                type="button"
                onClick={() => !disabled && handleDayClick(date)}
                disabled={disabled}
                aria-disabled={disabled}
                aria-selected={selected}
                aria-label={`${date.getDate()} ${monthNames[viewMonth]}`}
                title={disabled ? t("disabledDayHint") : undefined}
                className={[
                  "w-9 h-9 flex items-center justify-center rounded-md text-sm transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-brand-500",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                  selected
                    ? "bg-brand-700 text-paper font-medium"
                    : disabled
                    ? "text-ink-300 cursor-not-allowed"
                    : isToday
                    ? "text-ink-900 font-medium ring-1 ring-brand-500/40 hover:bg-surface-2"
                    : "text-ink-700 hover:bg-surface-2",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Time slots — shown after a day is selected */}
      {selectedDate && (
        <div className="pt-3 border-t border-surface-3">
          <p className="text-xs font-medium text-ink-500 mb-2">{t("selectTimePrompt")}</p>
          <div className="grid grid-cols-4 gap-2">
            {(slotsByDate.get(selectedDate) ?? []).map((s) => {
              const local = localTimeFormatter.format(new Date(s.startUtc));
              const istanbul = istanbulTimeFormatter.format(new Date(s.startUtc));
              // Ziyaretçi zaten İstanbul diliminde ise ikinci satır aynı
              // şeyi tekrar söyler, basılmaz (BookingConfirmation mailiyle
              // aynı kural — spec §3.3, kural 8).
              const showIstanbul = visitorTimeZone !== "Europe/Istanbul" && istanbul !== local;
              const descId = `ist-time-${s.startUtc}`;
              return (
                <button
                  key={s.startUtc}
                  type="button"
                  onClick={() => handleTimeClick(s.startUtc)}
                  aria-pressed={selectedTime === s.startUtc}
                  aria-describedby={showIstanbul ? descId : undefined}
                  className={[
                    "px-2 py-2 rounded-md text-sm font-medium transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-brand-500",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                    selectedTime === s.startUtc
                      ? "bg-brand-700 text-paper"
                      : "bg-surface-1 text-ink-700 hover:bg-surface-2",
                  ].join(" ")}
                >
                  {local}
                  {showIstanbul && (
                    <>
                      {/* Görünür ama isimlendirmeye katılmaz: buton adı yine
                          salt "HH:MM" kalır (klavye/ekran okuyucu testleri
                          bunu bekler), İstanbul saati `aria-describedby` ile
                          ayrıca duyurulur. */}
                      <span
                        aria-hidden="true"
                        className={[
                          "block text-xs font-normal",
                          selectedTime === s.startUtc ? "text-paper/70" : "text-ink-500",
                        ].join(" ")}
                      >
                        {t("istanbulTimeLabel", { time: istanbul })}
                      </span>
                      <span id={descId} className="sr-only">
                        {t("istanbulTimeLabel", { time: istanbul })}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar prompt when no date selected */}
      {!selectedDate && (
        <p className="text-xs text-ink-500 text-center pt-1">{t("selectDatePrompt")}</p>
      )}
    </div>
  );
}
