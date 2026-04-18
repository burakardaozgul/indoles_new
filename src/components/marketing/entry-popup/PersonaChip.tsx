"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PersonaSlug } from "../../../lib/popup/types";

type Props = {
  persona: PersonaSlug | null;
  onReopen: () => void;
};

export function PersonaChip({ persona, onReopen }: Props) {
  const t = useTranslations("popup");
  if (!persona) return null;
  const label = t(`persona.${persona}.label`);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:gap-2.5 md:px-4 md:py-2 rounded-full border border-ink-300 bg-paper typography-caption md:typography-body-sm">
      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-600 shrink-0" />
      <span className="text-ink-700">{t("chip.current", { personaLabel: label })}</span>
      <button
        type="button"
        onClick={onReopen}
        className="underline text-ink-500 hover:text-ink-900 transition-colors"
        aria-label={t("chip.change")}
      >
        {t("chip.change")}
      </button>
    </div>
  );
}
