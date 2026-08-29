"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { RefreshCw } from "lucide-react";

type Props = {
  bookingSlot?: { date: string; time: string };
  onClose: () => void;
  onReschedule: () => void;
};

/**
 * `bookingSlot.time` çerezde saklanan değer — Görev 8 öncesi "HH:MM" gibi
 * sabit bir gösterim string'iydi, artık `CalendarPicker`in verdiği UTC ISO
 * zaman damgası. Bu bileşen yalnız gösteriyor; ISO ise ziyaretçinin yerel
 * saatine (ve dilimi farklıysa İstanbul saatine) çeviriyor, tanımadığı bir
 * biçim gelirse (eski çerez, geriye dönük uyum) olduğu gibi basıyor.
 */
function formatTime(value: string, locale: "tr" | "en"): { local: string; istanbul: string | null } {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return { local: value, istanbul: null };
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { local: value, istanbul: null };
  const intlLocale = locale === "tr" ? "tr-TR" : "en-GB";
  const local = new Intl.DateTimeFormat(intlLocale, { hour: "2-digit", minute: "2-digit" }).format(d);
  const visitorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (visitorTimeZone === "Europe/Istanbul") return { local, istanbul: null };
  const istanbul = new Intl.DateTimeFormat(intlLocale, {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return { local, istanbul: istanbul !== local ? istanbul : null };
}

export function ExistingBookingState({ bookingSlot, onClose, onReschedule }: Props) {
  const t = useTranslations("popup");
  const locale = useLocale() as "tr" | "en";
  const time = bookingSlot ? formatTime(bookingSlot.time, locale) : null;

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h2 className="typography-h1 text-ink-900">{t("existingBooking.title")}</h2>
        {bookingSlot && time ? (
          <p className="typography-body-md text-ink-500 mt-3">
            {bookingSlot.date} · {time.local}
            {time.istanbul && (
              <span className="block typography-body-sm text-ink-500 mt-1">
                {t("booking.istanbulTimeLabel", { time: time.istanbul })}
              </span>
            )}
          </p>
        ) : (
          <p className="typography-body-md text-ink-500 mt-3">{t("existingBooking.body")}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onReschedule}
        className="w-full text-left border border-surface-2 rounded-xl p-6 hover:bg-surface-1 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <RefreshCw size={18} className="text-ink-500 group-hover:text-ink-900 transition-colors" aria-hidden />
          <div>
            <p className="typography-body-md font-medium text-ink-900">
              {t("existingBooking.reschedule")}
            </p>
            <p className="typography-body-sm text-ink-500 mt-0.5">
              {t("existingBooking.rescheduleHelper")}
            </p>
          </div>
        </div>
      </button>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onClose}
          className="typography-body-sm text-ink-500 hover:text-ink-900 underline underline-offset-4 transition-colors"
        >
          {t("meta.close")}
        </button>
      </div>
    </div>
  );
}
