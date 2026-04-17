/**
 * Typed event taksonomisi.
 * Detay: docs/12-analytics-measurement.md §2.
 */

export type Persona = "industrial" | "commerce" | "unknown";
export type Pillar = "growth" | "transform" | "build";
export type Budget = "small" | "medium" | "large";
export type Timeline = "urgent" | "normal" | "flexible";

export type AnalyticsEvent =
  | { name: "homepage_hero_viewed"; properties: { persona: Persona } }
  | {
      name: "persona_axis_clicked";
      properties: { axis: "industrial" | "commerce" };
    }
  | {
      name: "pillar_viewed";
      properties: { pillar: Pillar; locale: "tr" | "en" };
    }
  | {
      name: "package_viewed";
      properties: {
        packageSlug: string;
        pillar: Pillar;
        price: number;
        currency: string;
      };
    }
  | {
      name: "case_study_viewed";
      properties: { slug: string; problemType: string; pillar: Pillar };
    }
  | { name: "booking_cta_clicked"; properties: { source: string; pillar?: Pillar } }
  | {
      name: "brief_submitted";
      properties: {
        briefId: string;
        pillar?: Pillar;
        budget: Budget;
        timeline: Timeline;
      };
    }
  | {
      name: "chatbot_opened";
      properties: { page: string; persona: Persona };
    }
  | {
      name: "chatbot_message_sent";
      properties: {
        role: "user" | "assistant";
        conversationId: string;
        persona: Persona;
      };
    };
