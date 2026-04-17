"use client";
import * as React from "react";
import { useTranslations } from "next-intl";

type Props = {
  variant: "booking" | "contact";
  bookingUrl: string | null;
  onClose: () => void;
};

export function SuccessState({ variant, bookingUrl, onClose }: Props) {
  const t = useTranslations("popup");
  const title = variant === "booking" ? t("success.bookingTitle") : t("success.contactTitle");
  const body = variant === "booking" ? t("success.bookingBody") : t("success.contactBody");

  return (
    <div className="text-center py-6">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-600 mt-3">{body}</p>

      {variant === "booking" && bookingUrl ? (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm"
        >
          Cal.com
        </a>
      ) : null}

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
