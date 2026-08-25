"use client";

import * as React from "react";
import { usePopup } from "@/lib/popup/popup-context";
import type { BookingCtaSource, Pillar } from "@/lib/analytics/events";

/**
 * Görüşme CTA'sının paylaşılan düğmesi.
 *
 * `source` zorunlu: bu düğme dört farklı sayfa tipinde görünüyor ve hangi
 * yüzeyin dönüştürdüğü ancak çağıran tarafından bilinir. Olayın kendisi
 * `openPopup` içinde yazılır — burada yalnız etiket taşınır.
 */
export function PopupCTAButton({
  children,
  className,
  source,
  pillar,
}: {
  children: React.ReactNode;
  className?: string;
  source: BookingCtaSource;
  pillar?: Pillar;
}) {
  const { openPopup } = usePopup();
  return (
    <button type="button" onClick={() => openPopup(source, pillar)} className={className}>
      {children}
    </button>
  );
}
