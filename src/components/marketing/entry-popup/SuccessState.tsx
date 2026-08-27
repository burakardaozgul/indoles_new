"use client";
import * as React from "react";
import { useTranslations } from "next-intl";

type Props = {
  variant: "booking" | "contact";
  onClose: () => void;
};

/**
 * Cal.com bağlantı dalı kaldırıldı (ADR-025): rezervasyon INDOLES'in kendi
 * takvim sistemine taşınıyor; slot daveti başvuru sonrası e-postayla gider.
 */
export function SuccessState({ variant, onClose }: Props) {
  const t = useTranslations("popup");
  const title = variant === "booking" ? t("success.bookingTitle") : t("success.contactTitle");
  const body = variant === "booking" ? t("success.bookingBody") : t("success.contactBody");

  return (
    <div className="text-center py-6">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-600 mt-3">{body}</p>

      <div className="mt-6">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
        >
          {t("success.close")}
        </button>
      </div>
    </div>
  );
}
