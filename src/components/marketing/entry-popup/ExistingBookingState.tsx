"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";

type Props = {
  bookingSlot?: { date: string; time: string };
  onClose: () => void;
  onReschedule: () => void;
};

export function ExistingBookingState({ bookingSlot, onClose, onReschedule }: Props) {
  const t = useTranslations("popup");

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h2 className="typography-h1 text-ink-900">{t("existingBooking.title")}</h2>
        {bookingSlot ? (
          <p className="typography-body-md text-ink-500 mt-3">
            {bookingSlot.date} · {bookingSlot.time}
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
