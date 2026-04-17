"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PersonaSlug, ProblemSlug } from "../../../lib/popup/types";
import { getProblemsForPersona } from "../../../lib/popup/problems";

type Props = {
  persona: PersonaSlug;
  onBack: () => void;
  onSubmit: (selected: ProblemSlug[]) => void;
};

export function Stage2Problems({ persona, onBack, onSubmit }: Props) {
  const t = useTranslations("popup");
  const problems = React.useMemo(() => getProblemsForPersona(persona), [persona]);
  const [selected, setSelected] = React.useState<ProblemSlug[]>([]);
  const [fifoHint, setFifoHint] = React.useState(false);

  const toggle = (slug: ProblemSlug) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length < 3) return [...prev, slug];
      setFifoHint(true);
      setTimeout(() => setFifoHint(false), 2000);
      return [...prev.slice(1), slug];
    });
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{t("stage2.title")}</h2>
      <p className="text-sm text-neutral-600 mt-2">{t("stage2.subtitle")}</p>

      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
        {problems.map((p) => {
          const checked = selected.includes(p.slug);
          return (
            <li key={p.slug}>
              <label
                className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition ${
                  checked ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <input
                  type="checkbox"
                  data-slug={p.slug}
                  checked={checked}
                  onChange={() => toggle(p.slug)}
                  className="mt-1"
                />
                <span className="text-sm text-neutral-800">{t(`problems.${p.slug}`)}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {fifoHint ? <p className="text-xs text-amber-700 mt-3">{t("stage2.fifoHint")}</p> : null}

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
        >
          ← {t("meta.back")}
        </button>
        <button
          type="button"
          disabled={selected.length !== 3}
          onClick={() => onSubmit(selected)}
          className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("meta.next")}
        </button>
      </div>
    </div>
  );
}
