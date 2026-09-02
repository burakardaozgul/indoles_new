"use client";

import * as React from "react";
import { STATUS_LABELS, TOOL_UI } from "@/components/tools/copy";
import { TOOL_SCAN } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * Tarama sahnesi (spec §4). Satırlar sırayla "okunuyor"a girer; `checks`
 * (gerçek yanıt) gelince sırayla çözülür. Yanıt gelmeden hiçbir satır
 * sonuç göstermez. Süreler `TOOL_SCAN`; reduced-motion'da hepsi sıfır.
 */
type RowState = "waiting" | "reading" | "done";

export function ScanStage({
  signals,
  locale,
  checks,
  onResolved,
}: {
  signals: ToolSignal[];
  locale: Locale;
  checks: GeoCheckResult[] | null;
  onResolved: () => void;
}) {
  const c = TOOL_UI[locale];
  const reduced = usePrefersReducedMotion();
  const total = signals.length;
  const [entered, setEntered] = React.useState(reduced ? total : 1);
  const [resolved, setResolved] = React.useState(0);
  const resolvedRef = React.useRef(false);

  // Giriş kadansı — tek, kendini tekrarlayan zamanlayıcı: bir sonraki adım
  // React'in render/commit döngüsüne değil, zamanlayıcının kendi periyoduna
  // bağlıdır (efekt-içi `setTimeout` zinciri, testte sahte zamanlayıcının
  // tek `act()` çağrısı içinde birden fazla commit beklemesine yol açardı).
  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setEntered((n) => {
        if (n >= total) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TOOL_SCAN.enterStaggerMs);
    return () => clearInterval(id);
  }, [reduced, total]);

  // Çözülme kadansı — yalnız gerçek yanıt geldikten sonra başlar.
  React.useEffect(() => {
    if (!checks) return;
    setEntered(total);
    if (reduced) {
      setResolved(total);
      return;
    }
    const id = setInterval(() => {
      setResolved((n) => {
        if (n >= total) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TOOL_SCAN.resolveStaggerMs);
    return () => clearInterval(id);
  }, [checks, total, reduced]);

  // Morph → onResolved, tüm satırlar çözülünce tam olarak bir kez.
  React.useEffect(() => {
    if (!checks || resolved < total) return;
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    const t = setTimeout(onResolved, reduced ? 0 : TOOL_SCAN.morphMs);
    return () => clearTimeout(t);
  }, [checks, resolved, total, reduced, onResolved]);

  return (
    <div className="mt-6">
      <p role="status" aria-live="polite" className="sr-only">{c.stage.live}</p>
      <ol className="tool-stage" aria-hidden="true">
        {signals.map((signal, i) => {
          const state: RowState = i < resolved ? "done" : i < entered ? "reading" : "waiting";
          const check = checks?.find((ch) => ch.id === signal.id);
          return (
            <li key={signal.id} className="tool-stage-row" data-state={state}>
              <span className="tool-stage-dot" />
              <span className="typography-body-md">{signal.title[locale]}</span>
              <span className="mono tabular text-ink-500">
                {state === "done" && check
                  ? `${check.score} / ${check.max} · ${STATUS_LABELS[check.status][locale]}`
                  : state === "reading"
                    ? c.stage.reading
                    : c.stage.waiting}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
