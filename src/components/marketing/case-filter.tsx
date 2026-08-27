"use client";

import * as React from "react";
import { CaseCard, PROBLEM_LABELS } from "@/components/marketing/case-card";
import type { CaseStudyContent, Locale, ProblemType } from "@/lib/content/types";

/**
 * Vaka listesinin problem-tipi filtresi.
 *
 * Sayfa lede'si ("Vakaları sektöre göre değil problem tipine göre
 * diziyoruz") bir vaat kuruyordu ama karşılığında filtre yoktu. Bu bileşen
 * o vaadi karşılar — ama SEO/GEO kısıtı sabit: her vaka sunucu HTML'inde
 * render edilmeye devam etmeli. Bu yüzden filtreleme veri katmanında
 * (`.filter()`) değil, hidrasyon sonrası CSS/JS'le görünürlük yönetiminde
 * yaşıyor (`CaseCard`'ın `hidden` prop'u → native `hidden` attribute).
 * JS kapalıyken veya bir crawler'da her kart görünür kalır.
 *
 * Vakası olmayan problem tipinin çipi hiç basılmaz — `yazilar` sayfasının
 * konu filtresiyle aynı disiplin (ADR-021: "boş filtre gösterilmiyor").
 * Elde bulunan 9 vakanın problem tipi dağılımı dengesiz (customer_acquisition
 * ve market_expansion çoğunlukta, cost_optimization ve digital_transformation
 * hiç yok); dolanmayan bir çipi tıklanabilir ama sonuçsuz bırakmak yerine
 * kendisini hiç göstermemek, hem daha dürüst hem daha az karar yükü.
 */

export type CaseFilterLabels = {
  /** Çip grubunun ekran okuyucu adı. */
  groupLabel: string;
  all: string;
  /** `{count}` yer tutucusu. */
  resultCount: string;
};

export function CaseFilter({
  cases,
  locale,
  labels,
}: {
  cases: CaseStudyContent[];
  locale: Locale;
  labels: CaseFilterLabels;
}) {
  const [active, setActive] = React.useState<ProblemType | null>(null);

  const counts = React.useMemo(() => {
    const map = new Map<ProblemType, number>();
    for (const c of cases) {
      map.set(c.problemType, (map.get(c.problemType) ?? 0) + 1);
    }
    return map;
  }, [cases]);

  const types = React.useMemo(
    () =>
      (Object.keys(PROBLEM_LABELS) as ProblemType[]).filter(
        (t) => (counts.get(t) ?? 0) > 0
      ),
    [counts]
  );

  const visibleCount = active ? (counts.get(active) ?? 0) : cases.length;

  return (
    <div>
      <div
        role="group"
        aria-label={labels.groupLabel}
        className="flex flex-wrap gap-2"
      >
        <Chip
          label={labels.all}
          count={cases.length}
          pressed={active === null}
          onSelect={() => setActive(null)}
        />
        {types.map((t) => (
          <Chip
            key={t}
            label={PROBLEM_LABELS[t]![locale]}
            count={counts.get(t)!}
            pressed={active === t}
            onSelect={() => setActive(t)}
          />
        ))}
      </div>

      <p
        className="typography-caption text-ink-600 mt-4"
        aria-live="polite"
      >
        {labels.resultCount.replace("{count}", String(visibleCount))}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 md:mt-10">
        {cases.map((c) => (
          <CaseCard
            key={c.slug}
            c={c}
            locale={locale}
            hidden={active !== null && active !== c.problemType}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  count,
  pressed,
  onSelect,
}: {
  label: string;
  count: number;
  pressed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={[
        // 44px dokunma hedefi (WCAG 2.2 target size)
        "min-h-11 inline-flex items-center gap-2 rounded-full border px-4 py-2",
        "typography-label transition-colors",
        pressed
          ? "border-teal-700 bg-teal-700 text-white"
          : "border-ink-200 bg-surface-1 text-ink-700 hover:border-teal-400 hover:text-teal-800",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={pressed ? "text-teal-200" : "text-ink-400"}
        aria-hidden="true"
      >
        {count}
      </span>
    </button>
  );
}
