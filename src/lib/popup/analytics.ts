import type { PersonaSlug, ProblemSlug } from "./types";
import { gaEvent } from "../analytics/ga";

export type PopupEventMap = {
  popup_shown: {
    trigger_source: "initial" | "hero_chip" | "manual";
    time_to_show_ms?: number;
  };
  popup_stage1_selected: { persona: PersonaSlug; time_on_stage_ms: number };
  popup_stage2_submitted: {
    persona: PersonaSlug;
    problems: ProblemSlug[];
    time_on_stage_ms: number;
  };
  popup_stage3_viewed: { persona: PersonaSlug; problems: ProblemSlug[] };
  popup_booking_submitted: {
    persona: PersonaSlug;
    problems: ProblemSlug[];
    lead_id?: string;
    locale: "tr" | "en";
  };
  popup_contact_submitted: {
    persona: PersonaSlug;
    problems: ProblemSlug[];
    lead_id?: string;
    locale: "tr" | "en";
  };
  popup_dismissed: {
    at_stage: "stage1" | "stage2" | "stage3";
    persona?: PersonaSlug;
    problems?: ProblemSlug[];
  };
  popup_reopened: {
    from: "hero_chip" | "footer" | "manual";
    previous_persona?: PersonaSlug;
  };
  popup_kvkk_consent_given: { stage: "booking" | "contact" };
};

/**
 * Popup olayları GA4'e gider (ADR-021).
 *
 * GA4 parametre değerleri skaler olmak zorunda; dizi taşıyan alanlar
 * (`problems`) virgülle birleştirilir, `undefined` alanlar düşürülür.
 */
export function trackPopupEvent<K extends keyof PopupEventMap>(
  event: K,
  payload: PopupEventMap[K]
): void {
  if (typeof window === "undefined") return;
  const flat: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(payload as Record<string, unknown>)) {
    if (v === undefined || v === null) continue;
    flat[k] = Array.isArray(v) ? v.join(",") : (v as string | number | boolean);
  }
  gaEvent(event, flat);
}
