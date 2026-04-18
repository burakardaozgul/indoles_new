"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Calendar, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  onBack: () => void;
  onBooking: () => void;
  onContact: () => void;
  onKeepBrowsing: () => void;
};

export function Stage3Actions({ onBack, onBooking, onContact, onKeepBrowsing }: Props) {
  const t = useTranslations("popup");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">{t("stage3.title")}</h2>
      <p className="text-sm text-ink-500 mt-2">{t("stage3.subtitle")}</p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onBooking}
          aria-label={t("stage3.bookingCta")}
          className="w-full text-left p-4 rounded-md bg-brand-700 text-paper hover:bg-brand-800 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2 font-medium">
            <Calendar size={18} aria-hidden />
            {t("stage3.bookingCta")}
          </div>
          <div className="text-xs opacity-80 mt-1 ml-6">{t("stage3.bookingHelper")}</div>
        </button>
        <button
          type="button"
          onClick={onContact}
          aria-label={t("stage3.contactCta")}
          className="w-full text-left p-4 rounded-md border border-neutral-200 hover:border-brand-600 transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2 font-medium text-ink-900">
            <MessageSquare size={18} className="text-brand-600" aria-hidden />
            {t("stage3.contactCta")}
          </div>
          <div className="text-xs text-ink-500 mt-1 ml-6">{t("stage3.contactHelper")}</div>
        </button>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 underline underline-offset-2 transition"
        >
          <ArrowLeft size={14} aria-hidden />
          {t("meta.back")}
        </button>
        <button
          type="button"
          onClick={onKeepBrowsing}
          aria-label={t("meta.keepBrowsing")}
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 underline underline-offset-2 transition"
        >
          {t("meta.keepBrowsing")}
          <ArrowRight size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
