import type { PersonaSlug, ProblemSlug } from "./types";
import { posthog } from "../analytics/posthog";

export type PopupEventMap = {
  popup_shown: { trigger_source: "initial" | "hero_chip" | "manual"; time_to_show_ms?: number };
  popup_stage1_selected: { persona: PersonaSlug; time_on_stage_ms: number };
  popup_stage2_submitted: { persona: PersonaSlug; problems: ProblemSlug[]; time_on_stage_ms: number };
  popup_stage3_viewed: { persona: PersonaSlug; problems: ProblemSlug[] };
  popup_booking_submitted: { persona: PersonaSlug; problems: ProblemSlug[]; lead_id?: string; locale: "tr" | "en" };
  popup_contact_submitted: { persona: PersonaSlug; problems: ProblemSlug[]; lead_id?: string; locale: "tr" | "en" };
  popup_dismissed: { at_stage: "stage1" | "stage2" | "stage3"; persona?: PersonaSlug; problems?: ProblemSlug[] };
  popup_reopened: { from: "hero_chip" | "footer" | "manual"; previous_persona?: PersonaSlug };
  popup_cal_com_redirect: { booking_id: string };
  popup_kvkk_consent_given: { stage: "booking" | "contact" };
};

export function trackPopupEvent<K extends keyof PopupEventMap>(
  event: K,
  payload: PopupEventMap[K]
): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, payload as Record<string, unknown>);
}
