import { STATUS_LABELS, TOOL_UI, fill } from "@/components/tools/copy";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * Düzeltme listesi (spec §6, kilit açık): önce kalanlar, kaybedilen puana
 * göre azalan — "öncelikli aksiyonlar" vaadinin karşılığı. Geçenler altta
 * katlı. Saf bileşen; bulgular rota yanıtından gelir.
 */
export function orderForFixList(
  checks: GeoCheckResult[],
  signals: ToolSignal[],
): { todo: GeoCheckResult[]; passed: GeoCheckResult[] } {
  const order = new Map(signals.map((s, i) => [s.id, i]));
  const byOrder = (a: GeoCheckResult, b: GeoCheckResult) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99);
  const todo = checks
    .filter((c) => c.status !== "pass")
    .sort((a, b) => (b.max - b.score) - (a.max - a.score) || byOrder(a, b));
  const passed = checks.filter((c) => c.status === "pass").sort(byOrder);
  return { todo, passed };
}

export function FindingsList({
  checks,
  signals,
  locale,
  ctaSlot,
  headingId,
}: {
  checks: GeoCheckResult[];
  signals: ToolSignal[];
  locale: Locale;
  ctaSlot?: React.ReactNode;
  /** Kilit açılınca `ReportGate`in odağı taşıdığı hedef (spec §4). */
  headingId?: string;
}) {
  const c = TOOL_UI[locale];
  const { todo, passed } = orderForFixList(checks, signals);
  const title = (check: GeoCheckResult) => signals.find((s) => s.id === check.id)?.title[locale] ?? check.id;

  return (
    <div className="text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id={headingId} tabIndex={-1} className="typography-h3 text-ink-900">{c.gate.title}</h3>
        <p className="typography-body-sm text-success-700">{c.gate.unlockedLede}</p>
      </div>

      <ol className="mt-6 flex flex-col gap-6">
        {todo.map((check, i) => (
          <li key={check.id} className="grid grid-cols-[2.5rem_1fr] gap-3">
            <span className="mono text-ink-400" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="typography-body-md font-medium text-ink-900">{title(check)}</h4>
                <span className="mono tabular text-ink-500">{check.score} / {check.max}</span>
                <span className="typography-label uppercase tracking-widest text-ink-500">{STATUS_LABELS[check.status][locale]}</span>
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {check.findings.map((f, j) => (
                  <li key={j} className="typography-body-sm text-ink-700">{f[locale]}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      {passed.length > 0 ? (
        <details className="mt-8 group">
          <summary className="cursor-pointer typography-body-md text-ink-700 list-none [&::-webkit-details-marker]:hidden">
            <span className="text-success-700 mr-2" aria-hidden="true">✓</span>
            {fill(c.gate.passedGroup, { n: passed.length })}
            <span className="ml-2 typography-caption text-ink-500">{c.gate.showNotes}</span>
          </summary>
          <ul className="mt-4 flex flex-col gap-4">
            {passed.map((check) => (
              <li key={check.id}>
                <h4 className="typography-body-md font-medium text-ink-900">{title(check)}</h4>
                {check.findings.length > 0 ? (
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {check.findings.map((f, j) => (
                      <li key={j} className="typography-body-sm text-ink-700">{f[locale]}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {ctaSlot ? (
        <div className="v2-surface-3 rounded-xl p-6 mt-10 flex flex-col items-start gap-4">
          <p className="typography-body-md text-ink-700">{c.gate.ctaLede}</p>
          {ctaSlot}
        </div>
      ) : null}
    </div>
  );
}
