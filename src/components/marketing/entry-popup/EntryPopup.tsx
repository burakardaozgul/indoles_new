"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import type { PersonaSlug, ProblemSlug, PopupLeadForm, PopupStage } from "../../../lib/popup/types";
import { Stage1Persona } from "./Stage1Persona";
import { Stage2Problems } from "./Stage2Problems";
import { Stage3Actions } from "./Stage3Actions";
import { QuickBookForm } from "./QuickBookForm";
import { ContactForm } from "./ContactForm";
import { SuccessState } from "./SuccessState";
import { ProgressIndicator } from "./ProgressIndicator";
import { writePopupCookie, computeExpiresAt } from "../../../lib/popup/cookie";
import { trackPopupEvent } from "../../../lib/popup/analytics";
import { trpc } from "@/lib/trpc/react";

export type EntryPopupProps = {
  open: boolean;
  onClose: (outcome: "completed" | "skipped" | "dismissed") => void;
};

function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let v = window.sessionStorage.getItem("indoles_session_id");
  if (!v) {
    v = typeof crypto !== "undefined" && crypto.randomUUID
      ? `sess_${crypto.randomUUID()}`
      : `sess_${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem("indoles_session_id", v);
  }
  return v;
}

export function EntryPopup({ open, onClose }: EntryPopupProps) {
  const t = useTranslations("popup");
  const locale = useLocale() as "tr" | "en";
  const submit = trpc.popup.submit.useMutation();

  const [stage, setStage] = React.useState<PopupStage>("stage1");
  const [persona, setPersona] = React.useState<PersonaSlug | null>(null);
  const [problems, setProblems] = React.useState<ProblemSlug[]>([]);
  const [stageStart, setStageStart] = React.useState<number>(Date.now());
  const [bookingUrl, setBookingUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      trackPopupEvent("popup_shown", { trigger_source: "initial" });
      setStageStart(Date.now());
    }
  }, [open]);

  const handleDismiss = React.useCallback(
    (atStage: "stage1" | "stage2" | "stage3") => {
      trackPopupEvent("popup_dismissed", {
        at_stage: atStage,
        ...(persona ? { persona } : {}),
        ...(problems.length ? { problems } : {}),
      });
      const outcome: "skipped" | "dismissed" = persona ? "dismissed" : "skipped";
      writePopupCookie({
        version: 1,
        lastShownAt: new Date().toISOString(),
        outcome,
        persona,
        problems,
        expiresAt: computeExpiresAt(outcome),
      });
      if (persona && problems.length === 3) {
        submit
          .mutateAsync({
            sessionId: sessionId(),
            persona,
            problems: problems as [string, string, string],
            submissionType: outcome,
            locale,
          } as any)
          .catch(() => {});
      }
      onClose(outcome);
    },
    [persona, problems, onClose, submit, locale]
  );

  const handleStage1 = (p: PersonaSlug) => {
    trackPopupEvent("popup_stage1_selected", { persona: p, time_on_stage_ms: Date.now() - stageStart });
    setPersona(p);
    setStage("stage2");
    setStageStart(Date.now());
  };

  const handleStage2 = (selected: ProblemSlug[]) => {
    trackPopupEvent("popup_stage2_submitted", {
      persona: persona!,
      problems: selected,
      time_on_stage_ms: Date.now() - stageStart,
    });
    setProblems(selected);
    setStage("stage3");
    setStageStart(Date.now());
    trackPopupEvent("popup_stage3_viewed", { persona: persona!, problems: selected });
  };

  const handleBack = () => {
    if (stage === "stage2") setStage("stage1");
    if (stage === "stage3") setStage("stage2");
    if (stage === "booking" || stage === "contact") setStage("stage3");
  };

  const handleSubmitForm = async (form: PopupLeadForm, type: "booking" | "contact") => {
    if (!persona || problems.length !== 3) return;
    const res = await submit.mutateAsync({
      sessionId: sessionId(),
      persona,
      problems: problems as [string, string, string],
      submissionType: type,
      locale,
      lead: { ...form, kvkkConsent: true as const },
    });
    trackPopupEvent(type === "booking" ? "popup_booking_submitted" : "popup_contact_submitted", {
      persona,
      problems,
      lead_id: res.submissionId,
      locale,
    });
    trackPopupEvent("popup_kvkk_consent_given", { stage: type });
    writePopupCookie({
      version: 1,
      lastShownAt: new Date().toISOString(),
      outcome: "completed",
      persona,
      problems,
      expiresAt: computeExpiresAt("completed"),
    });
    setBookingUrl(res.bookingUrl);
    setStage(type === "booking" ? "success-booking" : "success-contact");
  };

  const progress: Record<PopupStage, { current: number; total: number } | null> = {
    stage1: { current: 1, total: 3 },
    stage2: { current: 2, total: 3 },
    stage3: { current: 3, total: 3 },
    booking: null,
    contact: null,
    "success-booking": null,
    "success-contact": null,
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o && (stage === "success-booking" || stage === "success-contact")) {
          onClose("completed");
        } else if (!o) {
          const atStage = stage === "stage1" ? "stage1" : stage === "stage2" ? "stage2" : "stage3";
          handleDismiss(atStage);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-md z-50" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:inset-auto w-full md:max-w-[560px] bg-white rounded-t-2xl md:rounded-lg shadow-xl p-6 md:p-8 z-50 max-h-[90vh] overflow-y-auto focus:outline-none"
        >
          <Dialog.Title className="sr-only">{t("stage1.title")}</Dialog.Title>
          <Dialog.Description className="sr-only">{t("stage1.subtitle")}</Dialog.Description>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {progress[stage] ? <ProgressIndicator {...progress[stage]!} /> : null}

              {stage === "stage1" && <Stage1Persona onSelect={handleStage1} />}
              {stage === "stage2" && persona && (
                <Stage2Problems persona={persona} onBack={handleBack} onSubmit={handleStage2} />
              )}
              {stage === "stage3" && persona && (
                <Stage3Actions
                  onBack={handleBack}
                  onBooking={() => setStage("booking")}
                  onContact={() => setStage("contact")}
                  onKeepBrowsing={() => handleDismiss("stage3")}
                />
              )}
              {stage === "booking" && (
                <QuickBookForm
                  onBack={handleBack}
                  onSubmit={(form) => handleSubmitForm(form, "booking")}
                  loading={submit.isPending}
                />
              )}
              {stage === "contact" && (
                <ContactForm
                  onBack={handleBack}
                  onSubmit={(form) => handleSubmitForm(form, "contact")}
                  loading={submit.isPending}
                />
              )}
              {(stage === "success-booking" || stage === "success-contact") && (
                <SuccessState
                  variant={stage === "success-booking" ? "booking" : "contact"}
                  bookingUrl={bookingUrl}
                  onClose={() => onClose("completed")}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t("meta.close")}
              className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-900 text-xl leading-none"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
