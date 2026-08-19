import type { PersonaSlug, Pillar } from "./types";

export type PersonaDef = {
  slug: PersonaSlug;
  pillars: Pillar[];
  i18nKey: string;
  labelKey: string;
  descriptionKey: string;
};

/**
 * İki persona — eksen **kitle**dir, ihtiyaç değil.
 *
 * Slug'lar ilk kurguda ihtiyaç ekseninden geldi (`donusum-teknoloji` /
 * `buyume-pazarlar`) ve cookie ile e-posta bildirimlerinde yaşadığı için
 * korunuyor. Etiketler ve popup metni 2026-08-19'da kitle eksenine çevrildi:
 * otomasyon arayan bir e-ticaret markası "dönüşüm"ü seçtiğinde tüm site ona
 * sanayi dilinde konuşuyordu (bkz. docs/15-content-audit.md §A5).
 *
 * İçerik katmanındaki karşılıkları: `donusum-teknoloji` → `industrial`,
 * `buyume-pazarlar` → `commerce` (`lib/hooks/use-persona.ts`).
 */
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
    tr: "Sanayi ve üretim",
    en: "Industry & manufacturing",
  },
  "buyume-pazarlar": {
    tr: "Ticaret ve perakende",
    en: "Commerce & retail",
  },
};

/**
 * Returns the localized human-readable label for a persona.
 * Used in email subjects, lead notifications, and the hero PersonaChip indicator.
 */
export function getPersonaLocalizedLabel(slug: PersonaSlug, locale: "tr" | "en"): string {
  return PERSONA_LABELS[slug][locale];
}
