import { posthog } from "../analytics/posthog";

export type PopupEventMap = {
  popup_shown: { trigger_source: "initial" | "hero_chip" | "manual"; time_to_show_ms?: number };
  popup_stage1_selected: { persona: string; time_on_stage_ms: number };
  popup_stage2_submitted: { persona: string; problems: string[]; time_on_stage_ms: number };
  popup_stage3_viewed: { persona: string; problems: string[] };
  popup_booking_submitted: { persona: string; problems: string[]; lead_id: string; locale: string };
  popup_contact_submitted: { persona: string; problems: string[]; lead_id: string; locale: string };
  popup_dismissed: { at_stage: "stage1" | "stage2" | "stage3"; persona?: string; problems?: string[] };
  popup_reopened: { from: "hero_chip" | "footer" | "manual"; previous_persona?: string };
  popup_cal_com_redirect: { booking_id: string };
  popup_kvkk_consent_given: { stage: "booking" | "contact" };
};

export function trackPopupEvent<K extends keyof PopupEventMap>(
  event: K,
  payload: PopupEventMap[K]
): void {
  posthog.capture(event, payload as Record<string, unknown>);
}
