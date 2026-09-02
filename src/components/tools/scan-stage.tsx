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

/**
 * Kendini tekrarlayan, hedefe ulaşınca kendini durduran kademeli sayaç —
 * giriş ve çözülme kadansı tek yardımcıda (Ruling R6). Sayım React
 * state'inden bağımsız bir ref'te tutulur; böylece sahte zamanlayıcıda tek
 * `advanceTimersByTime` çağrısı içinde birden fazla tık, render/commit
 * döngüsünü beklemeden doğru sırayla işlenir. `clearInterval` zamanlayıcı
 * geri çağrısında, `setCount`'a verilen değerin DIŞINDA çağrılır — state
 * güncellemesi her zaman saf bir değer ataması kalır.
 */
function startStaggeredCounter(
  setCount: React.Dispatch<React.SetStateAction<number>>,
  countRef: React.MutableRefObject<number>,
  total: number,
  stepMs: number,
): () => void {
  const id = setInterval(() => {
    if (countRef.current >= total) {
      clearInterval(id);
      return;
    }
    countRef.current += 1;
    setCount(countRef.current);
  }, stepMs);
  return () => clearInterval(id);
}

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
  const enteredCountRef = React.useRef(entered);
  const resolvedCountRef = React.useRef(0);
  const resolvedRef = React.useRef(false);
  const onResolvedRef = React.useRef(onResolved);

  // `onResolved` her render'da tazelenir ama hiçbir efektin bağımlılık
  // listesinde YER ALMAZ (Ruling R6) — aksi halde üst bileşen morph
  // beklerken `checks`/`onResolved` referansını değiştirirse zamanlayıcı
  // efekt yeniden kurulurken iptal edilir ve tamamlanmış-sayılır guard'ı
  // yüzünden bir daha planlanmaz; sonuç sahne taramada asılı kalır.
  React.useEffect(() => {
    onResolvedRef.current = onResolved;
  });

  // Giriş kadansı
  React.useEffect(() => {
    if (reduced) return;
    return startStaggeredCounter(setEntered, enteredCountRef, total, TOOL_SCAN.enterStaggerMs);
  }, [reduced, total]);

  // Çözülme kadansı — yalnız gerçek yanıt geldikten sonra başlar.
  React.useEffect(() => {
    if (!checks) return;
    enteredCountRef.current = total;
    setEntered(total);
    if (reduced) {
      resolvedCountRef.current = total;
      setResolved(total);
      return;
    }
    return startStaggeredCounter(setResolved, resolvedCountRef, total, TOOL_SCAN.resolveStaggerMs);
  }, [checks, total, reduced]);

  // Morph → onResolved, tüm satırlar çözülünce tam olarak bir kez. Guard
  // (`resolvedRef`) zamanlayıcı ATEŞLENDİĞİNDE set edilir — kurulmadan önce
  // değil (Ruling R6): böylece `checks`/`onResolved` değişip bu efekt
  // yeniden kurulursa (cleanup bekleyen zamanlayıcıyı iptal etse bile),
  // guard hâlâ false'tur ve zamanlayıcı yeniden planlanır; en güncel
  // `onResolved` ref üzerinden tam olarak bir kez çağrılır.
  React.useEffect(() => {
    if (!checks || resolved < total) return;
    if (resolvedRef.current) return;
    const t = setTimeout(() => {
      resolvedRef.current = true;
      onResolvedRef.current();
    }, reduced ? 0 : TOOL_SCAN.morphMs);
    return () => clearTimeout(t);
  }, [checks, resolved, total, reduced]);

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
