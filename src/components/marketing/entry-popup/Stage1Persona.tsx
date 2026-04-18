"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Cpu, TrendingUp } from "lucide-react";
import type { PersonaSlug } from "../../../lib/popup/types";
import { PERSONAS } from "../../../lib/popup/personas";

const PERSONA_ICONS: Record<PersonaSlug, React.ReactNode> = {
  "donusum-teknoloji": <Cpu size={20} className="text-brand-600" aria-hidden />,
  "buyume-pazarlar": <TrendingUp size={20} className="text-brand-600" aria-hidden />,
};

export function Stage1Persona({ onSelect }: { onSelect: (p: PersonaSlug) => void }) {
  const t = useTranslations("popup");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">{t("stage1.title")}</h2>
      <p className="text-sm text-ink-500 mt-2">{t("stage1.subtitle")}</p>

      <div className="grid grid-cols-1 gap-3 mt-6">
        {PERSONAS.map((p) => {
          const points = t.raw(`persona.${p.slug}.descriptionPoints`) as string[];
          return (
            <button
              type="button"
              key={p.slug}
              data-persona={p.slug}
              onClick={() => onSelect(p.slug)}
              aria-label={t(`persona.${p.slug}.label`)}
              className="text-left p-4 border border-neutral-200 rounded-lg hover:border-brand-600 hover:shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <div className="mb-2">
                {PERSONA_ICONS[p.slug]}
              </div>
              <div className="font-semibold text-base text-ink-900 leading-snug">
                {t(`persona.${p.slug}.label`)}
              </div>
              <ul className="mt-2 space-y-1">
                {points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-500 leading-relaxed">
                    <span className="mt-1 w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink-300 mt-4">{t("stage1.helper")}</p>
    </div>
  );
}
