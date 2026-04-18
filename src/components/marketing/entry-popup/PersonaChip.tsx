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
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-200 bg-white typography-body-sm">
      <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
      <span className="text-neutral-700">{t("chip.current", { personaLabel: label })}</span>
      <button
        type="button"
        onClick={onReopen}
        className="underline text-neutral-600 hover:text-neutral-900 transition-colors"
        aria-label={t("chip.change")}
      >
        {t("chip.change")}
      </button>
    </div>
  );
}
