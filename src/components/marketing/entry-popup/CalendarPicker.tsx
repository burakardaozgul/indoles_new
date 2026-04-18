"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fixed time slots (Europe/Istanbul, no availability check — all shown as available)
const TIME_SLOTS = [
  "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
] as const;

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

  const handleTimeClick = (time: string) => {
    if (time === selectedTime) return;
    onSlotChange(selectedDate, time);
  };

  const isDayDisabled = (date: Date): boolean => {
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return true; // weekend
    if (startOfDay(date) < today) return true; // past
    return false;
  };

  const isDaySelected = (date: Date): boolean => isoDate(date) === selectedDate;
  const isDayToday = (date: Date): boolean => isoDate(date) === isoDate(today);

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
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleTimeClick(slot)}
                aria-pressed={slot === selectedTime}
                className={[
                  "px-2 py-2 rounded-md text-sm font-medium transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-brand-500",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                  slot === selectedTime
                    ? "bg-brand-700 text-paper"
                    : "bg-surface-1 text-ink-700 hover:bg-surface-2",
                ].join(" ")}
              >
                {slot}
              </button>
            ))}
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
