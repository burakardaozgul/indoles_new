"use client";
import * as React from "react";
import { useTranslations } from "next-intl";

type Props = {
  variant: "booking" | "contact";
  onClose: () => void;
  /**
   * ADR-025'te kaldırılan bağlantı alanı (o zaman hep `null` geçiliyordu),
   * gerçek rezervasyonla (Görev 8) birlikte geri geldi. Yalnız `booking`
   * varyantında anlamlı; `contact` bunları hiç okumaz.
   */
  meetUrl?: string | null;
  cancelUrl?: string | null;
  /**
   * Calendar/Meet oluşturma başarısız olduğunda satır `failed` işaretlenir
   * ama randevu geçerli kalır (spec §4). Sahte bir Meet linki BASILMAZ —
   * dürüst bir "bağlantı ayrıca iletilecek" mesajı gösterilir.
   */
  degraded?: boolean;
};

export function SuccessState({ variant, onClose, meetUrl = null, cancelUrl = null, degraded = false }: Props) {
  const t = useTranslations("popup");
  const title = variant === "booking" ? t("success.bookingTitle") : t("success.contactTitle");
  const body = variant === "booking" ? t("success.bookingBody") : t("success.contactBody");

  return (
    <div className="text-center py-6">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-600 mt-3">{body}</p>

      {variant === "booking" && degraded && (
        <p className="text-sm text-neutral-600 mt-4">{t("success.degradedNotice")}</p>
      )}

      {variant === "booking" && !degraded && meetUrl && (
        <p className="text-sm mt-4">
          <a href={meetUrl} className="underline">
            {t("success.meetLink")}
          </a>
        </p>
      )}

      {variant === "booking" && cancelUrl && (
        <p className="text-xs text-neutral-600 mt-2">
          <a href={cancelUrl} className="underline">
            {t("success.manageLink")}
          </a>
        </p>
      )}

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
