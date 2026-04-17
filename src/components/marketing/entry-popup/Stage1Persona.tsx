"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PersonaSlug } from "../../../lib/popup/types";
import { PERSONAS } from "../../../lib/popup/personas";

export function Stage1Persona({ onSelect }: { onSelect: (p: PersonaSlug) => void }) {
  const t = useTranslations("popup");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{t("stage1.title")}</h2>
      <p className="text-sm text-neutral-600 mt-2">{t("stage1.subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {PERSONAS.map((p) => (
          <button
            type="button"
            key={p.slug}
            data-persona={p.slug}
            onClick={() => onSelect(p.slug)}
            aria-label={p.slug}
            className="text-left p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div className="font-medium text-neutral-900">{t(`persona.${p.slug}.label`)}</div>
            <div className="text-xs text-neutral-600 mt-2 leading-relaxed">
              {t(`persona.${p.slug}.description`)}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-500 mt-4">{t("stage1.helper")}</p>
    </div>
  );
}
