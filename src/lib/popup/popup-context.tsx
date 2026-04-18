"use client";

import * as React from "react";
import { EntryPopup } from "@/components/marketing/entry-popup/EntryPopup";
import { shouldShowPopup, readPopupCookie } from "./cookie";
import type { PopupStage, PersonaSlug, ProblemSlug } from "./types";

const TRIGGER_DELAY_MS = 4000;

type PopupInitial = {
  stage: PopupStage;
  persona: PersonaSlug | null;
  problems: ProblemSlug[];
  bookingSlot?: { date: string; time: string };
};

const DEFAULT_INITIAL: PopupInitial = { stage: "stage1", persona: null, problems: [] };

type PopupContextValue = {
  open: boolean;
  openPopup: () => void;
  closePopup: () => void;
};

const PopupContext = React.createContext<PopupContextValue | null>(null);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [initial, setInitial] = React.useState<PopupInitial>(DEFAULT_INITIAL);

  React.useEffect(() => {
    if (!shouldShowPopup()) return;
    const t = setTimeout(() => setOpen(true), TRIGGER_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const openPopup = React.useCallback(() => {
    const cookie = readPopupCookie();
    let next: PopupInitial = DEFAULT_INITIAL;
    if (cookie) {
      if (cookie.outcome === "completed" && cookie.submissionType === "booking") {
        next = {
          stage: "existing-booking",
          persona: cookie.persona,
          problems: cookie.problems,
          ...(cookie.bookingSlot ? { bookingSlot: cookie.bookingSlot } : {}),
        };
      } else if (cookie.persona && cookie.problems.length === 3) {
        next = { stage: "stage3", persona: cookie.persona, problems: cookie.problems };
      }
    }
    setInitial(next);
    setKey((k) => k + 1);
    setOpen(true);
  }, []);

  const closePopup = React.useCallback(() => setOpen(false), []);

  return (
    <PopupContext.Provider value={{ open, openPopup, closePopup }}>
      {children}
      <EntryPopup
        key={key}
        open={open}
        onClose={closePopup}
        initialStage={initial.stage}
        initialPersona={initial.persona}
        initialProblems={initial.problems}
        {...(initial.bookingSlot ? { initialBookingSlot: initial.bookingSlot } : {})}
      />
    </PopupContext.Provider>
  );
}

export function usePopup(): PopupContextValue {
  const ctx = React.useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within PopupProvider");
  return ctx;
}
