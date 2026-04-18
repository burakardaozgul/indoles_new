"use client";

import * as React from "react";
import { usePopup } from "@/lib/popup/popup-context";

export function PopupCTAButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openPopup } = usePopup();
  return (
    <button type="button" onClick={openPopup} className={className}>
      {children}
    </button>
  );
}
