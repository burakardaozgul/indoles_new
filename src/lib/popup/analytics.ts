import type { PersonaSlug, ProblemSlug } from "./types";
import { gaEvent, type EventParams } from "../analytics/ga";
import type { EventParamName } from "../analytics/events";

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
    /** Secilen randevu slotu ("YYYY-MM-DD HH:mm"). EntryPopup gonderiyordu
     *  ama sozlesmede yoktu; kayitsiz oldugu icin GA4'te hic gorunmuyor ve
     *  sonraki olaylara siziyordu (2026-09-09). */
    preferred_slot?: string;
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
  const flat: EventParams = {};
  for (const [k, v] of Object.entries(payload as Record<string, unknown>)) {
    if (v === undefined || v === null) continue;
    flat[k as EventParamName] = Array.isArray(v) ? v.join(",") : (v as string | number | boolean);
  }
  gaEvent(event, flat);
}

/**
 * `PopupEventMap`teki HER parametre adinin `EVENT_PARAM_NAMES`te kayitli
 * oldugunu derleyiciye dogrulatir.
 *
 * Kayitsiz bir ad iki sessiz hata birden uretir: `gaEvent`in sifirlamasindan
 * kacar (sonraki olaylara sizar) ve GA4'te ozel boyutu olmadigi icin
 * raporlarda hic gorunmez. `preferred_slot` tam olarak boyle kacmisti.
 * Yeni bir popup parametresi eklenip `events.ts`e yazilmazsa burada
 * derleme hatasi cikar.
 */
type PopupParamName = {
  [K in keyof PopupEventMap]: keyof PopupEventMap[K];
}[keyof PopupEventMap];
type AssertPopupParamsRegistered = PopupParamName extends EventParamName ? true : never;
const _popupParamsRegistered: AssertPopupParamsRegistered = true;
void _popupParamsRegistered;
