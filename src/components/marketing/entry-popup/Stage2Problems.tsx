"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Settings2, TrendingUp, Code2, ArrowLeft } from "lucide-react";
import type { PersonaSlug, ProblemSlug, Pillar } from "../../../lib/popup/types";
import { getProblemsForPersona } from "../../../lib/popup/problems";

const PILLAR_ICONS: Record<Pillar, React.ReactNode> = {
  transform: <Settings2 size={16} className="text-brand-500 flex-shrink-0" aria-hidden />,
  growth: <TrendingUp size={16} className="text-brand-500 flex-shrink-0" aria-hidden />,
  build: <Code2 size={16} className="text-brand-500 flex-shrink-0" aria-hidden />,
};

function getPillarIcon(pillars: readonly Pillar[]): React.ReactNode {
  const primary = pillars[0];
  return primary ? PILLAR_ICONS[primary] : null;
}

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
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">{t("stage2.title")}</h2>
      <p className="text-sm text-ink-500 mt-2">{t("stage2.subtitle")}</p>

      <ul
        className="mt-4 grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto pr-1"
        style={{ scrollbarGutter: "stable" }}
      >
        {problems.map((p) => {
          const checked = selected.includes(p.slug);
          return (
            <li key={p.slug}>
              <label
                className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition ${
                  checked
                    ? "border-brand-600 bg-brand-50"
                    : "border-neutral-200 hover:border-brand-400"
                }`}
              >
                <input
                  type="checkbox"
                  data-slug={p.slug}
                  checked={checked}
                  onChange={() => toggle(p.slug)}
                  className="mt-0.5 accent-brand-700"
                />
                <span className="flex items-center gap-2 text-sm text-ink-700">
                  {getPillarIcon(p.pillars)}
                  {t(`problems.${p.slug}`)}
                </span>
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
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 underline underline-offset-2 transition"
        >
          <ArrowLeft size={14} aria-hidden />
          {t("meta.back")}
        </button>
        <button
          type="button"
          disabled={selected.length !== 3}
          onClick={() => onSubmit(selected)}
          className="px-4 py-2 bg-brand-700 text-paper rounded-md text-sm font-medium hover:bg-brand-800 transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          {t("meta.next")}
        </button>
      </div>
    </div>
  );
}
