"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

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
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{t("stage3.title")}</h2>
      <p className="text-sm text-neutral-600 mt-2">{t("stage3.subtitle")}</p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onBooking}
          className="w-full text-left p-4 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition"
          aria-label={t("stage3.bookingCta")}
        >
          <div className="font-medium">{t("stage3.bookingCta")}</div>
          <div className="text-xs opacity-80 mt-1">{t("stage3.bookingHelper")}</div>
        </button>
        <button
          type="button"
          onClick={onContact}
          className="w-full text-left p-4 rounded-md border border-neutral-200 hover:border-neutral-900 transition"
          aria-label={t("stage3.contactCta")}
        >
          <div className="font-medium text-neutral-900">{t("stage3.contactCta")}</div>
          <div className="text-xs text-neutral-600 mt-1">{t("stage3.contactHelper")}</div>
        </button>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button type="button" onClick={onBack} className="text-sm text-neutral-600 hover:text-neutral-900 underline">
          ← {t("meta.back")}
        </button>
        <button
          type="button"
          onClick={onKeepBrowsing}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
          aria-label={t("meta.keepBrowsing")}
        >
          {t("meta.keepBrowsing")} →
        </button>
      </div>
    </div>
  );
}
