"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PersonaSlug, ProblemSlug, PopupLeadForm, PopupStage } from "../../../lib/popup/types";
import { Stage1Persona } from "./Stage1Persona";
import { Stage2Problems } from "./Stage2Problems";
import { Stage3Actions } from "./Stage3Actions";
import { BookingScreen } from "./BookingScreen";
import { ContactForm } from "./ContactForm";
import { SuccessState } from "./SuccessState";
import { ExistingBookingState } from "./ExistingBookingState";
import { ProgressIndicator } from "./ProgressIndicator";
import { BrandLogo } from "../../brand/brand-logo";
import { writePopupCookie, computeExpiresAt } from "../../../lib/popup/cookie";
import { setPersonaSlug } from "@/lib/hooks/use-persona";
import { trackPopupEvent } from "../../../lib/popup/analytics";
import { submitVisitorProfile } from "../../../lib/popup/api";
import { track } from "@/lib/analytics/ga";

export type EntryPopupProps = {
  open: boolean;
  onClose: (outcome: "completed" | "skipped" | "dismissed") => void;
  initialStage?: PopupStage;
  initialPersona?: PersonaSlug | null;
  initialProblems?: ProblemSlug[];
  initialBookingSlot?: { date: string; time: string };
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

export function EntryPopup({
  open,
  onClose,
  initialStage = "stage1",
  initialPersona = null,
  initialProblems = [],
  initialBookingSlot,
}: EntryPopupProps) {
  const t = useTranslations("popup");
  const locale = useLocale() as "tr" | "en";

  const [stage, setStage] = React.useState<PopupStage>(initialStage);
  const [persona, setPersona] = React.useState<PersonaSlug | null>(initialPersona);
  const [problems, setProblems] = React.useState<ProblemSlug[]>(initialProblems);
  const [stageStart, setStageStart] = React.useState<number>(Date.now());
  const [preferredSlot, setPreferredSlot] = React.useState<{ date: string; time: string } | null>(
    initialBookingSlot ?? null
  );
  const [turnstileToken, setTurnstileToken] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Tracks which stage booking was reached from (stage3 or existing-booking)
  const [bookingSource, setBookingSource] = React.useState<PopupStage>(
    initialStage === "existing-booking" ? "existing-booking" : "stage3"
  );

  const turnstileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      trackPopupEvent("popup_shown", { trigger_source: "initial" });
      setStageStart(Date.now());
    }
  }, [open]);

  React.useEffect(() => {
    if (stage !== "booking" && stage !== "contact") return;

    let cancelled = false;
    let widgetId: string | undefined;
    let attempts = 0;

    const tryRender = (): void => {
      if (cancelled) return;
      const w = window as unknown as {
        turnstile?: {
          render: (el: Element, opts: {
            sitekey: string | undefined;
            callback: (token: string) => void;
          }) => string;
          remove: (id: string) => void;
        };
      };
      if (w.turnstile && turnstileRef.current) {
        // Reset token when re-rendering (user came back to stage)
        setTurnstileToken("");
        widgetId = w.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
        });
      } else if (attempts < 30) {
        attempts += 1;
        setTimeout(tryRender, 100); // poll up to 3s
      }
    };

    tryRender();

    return () => {
      cancelled = true;
      const w = window as unknown as {
        turnstile?: { remove: (id: string) => void };
      };
      if (widgetId && w.turnstile) {
        try {
          w.turnstile.remove(widgetId);
        } catch {
          // widget already gone
        }
      }
    };
  }, [stage]);

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
      onClose(outcome);
    },
    [persona, problems, onClose]
  );

  const handleStage1 = (p: PersonaSlug) => {
    trackPopupEvent("popup_stage1_selected", { persona: p, time_on_stage_ms: Date.now() - stageStart });
    setPersona(p);
    // Merceği hemen kur: popup kapandığında sayfa doğru tonda olsun.
    setPersonaSlug(p);
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
    if (stage === "booking" || stage === "contact") setStage(bookingSource);
  };

  const handleSubmitForm = async (
    form: PopupLeadForm,
    type: "booking" | "contact",
    slot?: { date: string; time: string } | null,
  ) => {
    if (!persona || problems.length !== 3 || !turnstileToken) return;

    const { kvkkConsent: _kvkk, ...leadFields } = form;

    if (slot) setPreferredSlot(slot);

    setIsSubmitting(true);
    const result = await submitVisitorProfile({
      persona,
      problems: problems as [string, string, string],
      lead: leadFields,
      submissionType: type,
      kvkkConsent: true,
      locale,
      turnstileToken,
      ...(slot ? { preferredSlot: slot } : {}),
    });
    setIsSubmitting(false);

    if (!result.ok) {
      return;
    }

    /**
     * `brief_submitted` — huninin en değerli anı. Tek çağrı noktası burada:
     * `handleSubmitForm` yalnız kullanıcının submit tıklamasıyla (ve
     * `isSubmitting`/`disabled` guard'ı geçtikten sonra) bir kez çalışır.
     * Olayı `SuccessState`in render'ına bağlamadık — bileşenin
     * mount/re-mount'unda (StrictMode dahil) tetiklenip çift gönderime yol
     * açardı; burada olay zaten "tam olarak bir başarılı submit" ile
     * bire bir eşleşiyor.
     *
     * `briefId`: sunucu tarafında kalıcı DB yok (ADR-010), bu yüzden
     * sunucudan dönen bir kimlik yok. Bu popup oturumunu zaten benzersiz
     * biçimde etiketleyen `sessionId()`i (aşağıda tanımlı, aynı çağrı
     * sözleşmesiyle) yeniden kullanıyoruz.
     */
    track({ name: "brief_submitted", properties: { briefId: sessionId() } });

    trackPopupEvent(type === "booking" ? "popup_booking_submitted" : "popup_contact_submitted", {
      persona,
      problems,
      locale,
      ...(slot ? { preferred_slot: `${slot.date} ${slot.time}` } : {}),
    });
    trackPopupEvent("popup_kvkk_consent_given", { stage: type });
    writePopupCookie({
      version: 1,
      lastShownAt: new Date().toISOString(),
      outcome: "completed",
      persona,
      problems,
      expiresAt: computeExpiresAt("completed"),
      submissionType: type,
      ...(slot ? { bookingSlot: slot } : {}),
    });
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
    "existing-booking": null,
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o && (stage === "success-booking" || stage === "success-contact" || stage === "existing-booking")) {
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
          className={[
            "fixed inset-x-0 bottom-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
            "md:inset-auto w-full bg-paper rounded-t-2xl md:rounded-lg shadow-xl p-6 md:p-8",
            "z-50 max-h-[90vh] overflow-y-auto focus:outline-none transition-[max-width] duration-300",
            stage === "booking" ? "md:max-w-popup-wide" : "max-w-popup",
          ].join(" ")}
        >
          <Dialog.Title className="sr-only">{t("stage1.title")}</Dialog.Title>
          <Dialog.Description className="sr-only">{t("stage1.subtitle")}</Dialog.Description>

          <div className="flex flex-col items-center mb-5">
            <BrandLogo variant="light-bg" height={28} className="md:hidden" priority />
            <BrandLogo variant="light-bg" height={40} className="hidden md:block" priority />
          </div>

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
                  onBooking={() => { setBookingSource("stage3"); setStage("booking"); }}
                  onContact={() => setStage("contact")}
                  onKeepBrowsing={() => handleDismiss("stage3")}
                />
              )}
              {stage === "booking" && (
                <BookingScreen
                  locale={locale}
                  onBack={handleBack}
                  onSubmit={(form, slot) => handleSubmitForm(form, "booking", slot)}
                  loading={isSubmitting}
                  turnstileSlot={
                    <div
                      ref={turnstileRef}
                      className="cf-turnstile mt-3"
                      data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    />
                  }
                />
              )}
              {stage === "contact" && (
                <ContactForm
                  onBack={handleBack}
                  onSubmit={(form) => handleSubmitForm(form, "contact")}
                  loading={isSubmitting}
                />
              )}
              {stage === "contact" && (
                <div
                  ref={turnstileRef}
                  className="cf-turnstile mt-3"
                  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                />
              )}
              {(stage === "success-booking" || stage === "success-contact") && (
                <SuccessState
                  variant={stage === "success-booking" ? "booking" : "contact"}
                  bookingUrl={null}
                  onClose={() => onClose("completed")}
                />
              )}
              {stage === "existing-booking" && (
                <ExistingBookingState
                  {...(preferredSlot ? { bookingSlot: preferredSlot } : {})}
                  onClose={() => onClose("completed")}
                  onReschedule={() => {
                    setBookingSource("existing-booking");
                    setStage("booking");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t("meta.close")}
              className="absolute top-3 right-3 text-ink-500 hover:text-ink-900 p-1 rounded-md transition focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <X size={18} aria-hidden />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
