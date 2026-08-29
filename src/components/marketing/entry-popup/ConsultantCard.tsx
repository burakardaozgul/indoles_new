"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BOOKING_CONSULTANT } from "../../../lib/content/consultant-burak";

type Props = {
  locale: "tr" | "en";
  selectedDate: string | null;
  selectedTime: string | null;
};

export function ConsultantCard({ locale, selectedDate, selectedTime }: Props) {
  const t = useTranslations("popup.booking");
  const [photoError, setPhotoError] = React.useState(false);

  const title = locale === "tr"
    ? BOOKING_CONSULTANT.titleTR
    : BOOKING_CONSULTANT.titleEN;

  const fullName = `${BOOKING_CONSULTANT.firstName} ${BOOKING_CONSULTANT.lastName}`;

  const slotDisplay = selectedDate && selectedTime
    ? `${formatDate(selectedDate, locale)} · ${formatTime(selectedTime, locale)}`
    : null;

  return (
    <div className="bg-surface-1 rounded-lg p-4">
      <p className="text-xs font-medium text-ink-500 mb-3 uppercase tracking-wide">
        {t("consultantCardTitle")}
      </p>

      <div className="flex items-center gap-3">
        {/* Profile photo or initials fallback */}
        {BOOKING_CONSULTANT.photoPath && !photoError ? (
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
            <Image
              src={BOOKING_CONSULTANT.photoPath}
              alt={fullName}
              fill
              sizes="56px"
              className="object-cover"
              onError={() => setPhotoError(true)}
            />
          </div>
        ) : (
          <div
            className="w-14 h-14 rounded-full bg-brand-600 text-paper
                       flex items-center justify-center text-sm font-semibold shrink-0"
            aria-label={fullName}
          >
            {BOOKING_CONSULTANT.initials}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900 truncate">{fullName}</p>
          <p className="text-xs text-ink-500 mt-0.5">{title}</p>
        </div>
      </div>

      {/* Selected slot display */}
      <div className="mt-3 pt-3 border-t border-surface-3">
        {slotDisplay ? (
          <p className="text-sm text-ink-700">{slotDisplay}</p>
        ) : (
          <p className="text-sm text-ink-300">{t("slotNotSelected")}</p>
        )}
      </div>
    </div>
  );
}

/**
 * `CalendarPicker` artık `onSlotChange`e "saat" olarak sabit bir "HH:MM"
 * string'i değil, UTC ISO zaman damgası veriyor (Görev 8 — seçim yukarı UTC
 * iletiliyor). Bu kart yalnız GÖSTERİM yapıyor; ISO gelirse ziyaretçinin
 * yerel saatine çeviriyor, tanımadığı bir biçim gelirse (savunma amaçlı)
 * olduğu gibi basıyor.
 */
function formatTime(value: string, locale: "tr" | "en"): string {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Minimal date formatter — no date-fns
function formatDate(isoDate: string, locale: "tr" | "en"): string {
  const parts = isoDate.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const d = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
  };

  try {
    return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", options).format(d);
  } catch {
    return isoDate;
  }
}
