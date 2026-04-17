import type { PersonaSlug, Pillar } from "./types";

export type PersonaDef = {
  slug: PersonaSlug;
  pillars: Pillar[];
  i18nKey: string;
  labelKey: string;
  descriptionKey: string;
};

export const PERSONAS: readonly PersonaDef[] = [
  {
    slug: "donusum-teknoloji",
    pillars: ["transform", "build"],
    i18nKey: "popup.persona.donusum-teknoloji",
    labelKey: "popup.persona.donusum-teknoloji.label",
    descriptionKey: "popup.persona.donusum-teknoloji.description",
  },
  {
    slug: "buyume-pazarlar",
    pillars: ["growth"],
    i18nKey: "popup.persona.buyume-pazarlar",
    labelKey: "popup.persona.buyume-pazarlar.label",
    descriptionKey: "popup.persona.buyume-pazarlar.description",
  },
] as const;

const PERSONA_SLUGS: PersonaSlug[] = PERSONAS.map((p) => p.slug);

export function isPersonaSlug(value: unknown): value is PersonaSlug {
  return typeof value === "string" && (PERSONA_SLUGS as string[]).includes(value);
}

export function getPersonaDef(slug: PersonaSlug): PersonaDef {
  const p = PERSONAS.find((p) => p.slug === slug);
  if (!p) throw new Error(`Unknown persona slug: ${slug}`);
  return p;
}

export function getPersonaLabel(slug: PersonaSlug): string {
  return getPersonaDef(slug).labelKey;
}

const PERSONA_LABELS: Record<PersonaSlug, { tr: string; en: string }> = {
  "donusum-teknoloji": {
    tr: "Dönüşüm ve Teknoloji",
    en: "Transformation & Technology",
  },
  "buyume-pazarlar": {
    tr: "Büyüme ve Yeni Pazarlar",
    en: "Growth & New Markets",
  },
};

/**
 * Returns the localized human-readable label for a persona.
 * Used in email subjects, chatbot system prompts, lead notifications,
 * and the hero PersonaChip indicator.
 */
export function getPersonaLocalizedLabel(slug: PersonaSlug, locale: "tr" | "en"): string {
  return PERSONA_LABELS[slug][locale];
}
