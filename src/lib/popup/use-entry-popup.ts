"use client";

import { useEffect, useState } from "react";
import { shouldShowPopup, readPopupCookie } from "./cookie";

const TRIGGER_DELAY_MS = 4000;

export function useEntryPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldShowPopup()) return;
    const t = setTimeout(() => setOpen(true), TRIGGER_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return {
    open,
    forceOpen: () => setOpen(true),
    close: () => setOpen(false),
  };
}

export function readCurrentPersona() {
  return readPopupCookie()?.persona ?? null;
}
