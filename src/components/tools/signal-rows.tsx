import type { CSSProperties } from "react";
import { STATUS_LABELS, TOOL_UI } from "@/components/tools/copy";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoCheckResult, GeoCheckStatus } from "@/lib/tools/geo/types";

/**
 * Sinyal satırları (spec §5): çubuk uzunluğu ağırlığı, dolgusu puanı
 * gösterir; 25 puanlık sinyal 15 puanlıktan uzun. Saf bileşen — dolgu
 * animasyonu CSS'te (`@starting-style`), reduced-motion CSS'te kapanır.
 * Sıra `signals` sırasıdır ("Ne ölçüyoruz" bölümüyle aynı).
 */
const FILL_TONE: Record<GeoCheckStatus, string> = {
  pass: "bg-success-500",
  partial: "bg-warning-500",
  fail: "bg-danger-500",
};
const PILL_TONE: Record<GeoCheckStatus, string> = {
  pass: "bg-success-50 text-success-700",
  partial: "bg-warning-50 text-warning-700",
  fail: "bg-danger-50 text-danger-700",
};

export function barWidthPercent(max: number, heaviest: number): number {
  return heaviest > 0 ? Math.round((max / heaviest) * 100) : 0;
}

export function fillPercent(score: number, max: number): number {
  return max > 0 ? Math.round((score / max) * 10000) / 100 : 0;
}

export function SignalRows({
  checks,
  signals,
  locale,
}: {
  checks: GeoCheckResult[];
  signals: ToolSignal[];
  locale: Locale;
}) {
  const c = TOOL_UI[locale];
  const heaviest = Math.max(...checks.map((ch) => ch.max), 0);
  const ordered = signals
    .map((s) => checks.find((ch) => ch.id === s.id))
    .filter((ch): ch is GeoCheckResult => Boolean(ch));

  return (
    <ul className="mt-8 flex flex-col">
      {ordered.map((check) => {
        const signal = signals.find((s) => s.id === check.id);
        return (
          <li key={check.id}>
            <details className="group">
              <summary className="signal-row cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 data-part="name" className="typography-body-md font-medium text-ink-900">
                  {signal ? signal.title[locale] : check.id}
                </h3>
                <div data-part="bar" className="signal-bar" style={{ width: `${barWidthPercent(check.max, heaviest)}%` }}>
                  <div
                    className={`signal-bar-fill ${FILL_TONE[check.status]}`}
                    style={{ "--fill": `${fillPercent(check.score, check.max)}%` } as CSSProperties}
                  />
                </div>
                <span data-part="points" className="mono tabular text-ink-500 whitespace-nowrap">
                  {check.score} / {check.max} {c.signals.points}
                </span>
                <span data-part="status" className={`typography-label rounded-full px-2.5 py-1 uppercase tracking-widest ${PILL_TONE[check.status]}`}>
                  {STATUS_LABELS[check.status][locale]}
                </span>
              </summary>
              <div className="signal-detail pb-4">
                <span className="typography-caption text-ink-500">{c.signals.details}</span>
                <p className="typography-body-md text-ink-700 mt-1">{check.summary[locale]}</p>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
