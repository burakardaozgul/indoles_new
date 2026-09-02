"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { BandScale } from "@/components/tools/band-scale";
import { BAND_LABELS, TOOL_UI, fill } from "@/components/tools/copy";
import { TOOL_SCORE } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { BAND_ORDER } from "@/lib/tools/geo/types";
import type { ToolContent } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoBand, GeoScanResult } from "@/lib/tools/geo/types";

/**
 * Skor kartı (spec §5): sayı + bant + bant cümlesi + dört bantlı ölçek.
 * Sayaç `TOOL_SCORE.countMs`te 0'dan skora sayar; reduced-motion'da anında.
 * Ekran okuyucu ara değerleri duymaz: görünen sayı `aria-hidden`, gerçek
 * değer `sr-only`.
 */
const BAND_TONE: Record<GeoBand, string> = {
  zayif: "border-danger-500 bg-danger-50 text-danger-700",
  "gelismeye-acik": "border-warning-500 bg-warning-50 text-warning-700",
  iyi: "border-success-500 bg-success-50 text-success-700",
  oncu: "border-teal-500 bg-teal-50 text-teal-700",
};

/**
 * Skoru 0'dan hedefe sayar. `instant` (reduced-motion) durumunda ara adım
 * yok — doğrudan hedefe atlar. `requestAnimationFrame` tabanlı; jsdom bunu
 * destekler, testler gerçek kadansla bekler (bkz. score-card.test.tsx son
 * senaryo).
 */
function useCountUp(target: number, durationMs: number, instant: boolean): number {
  const [value, setValue] = React.useState(instant ? target : 0);
  React.useEffect(() => {
    if (instant) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, instant]);
  return value;
}

export function ScoreCard({
  result,
  tool,
  locale,
  shareUrl,
  onNewScan,
  newScanHref,
}: {
  result: GeoScanResult;
  tool: ToolContent;
  locale: Locale;
  shareUrl: string;
  onNewScan?: () => void;
  newScanHref?: string;
}) {
  const c = TOOL_UI[locale];
  const reduced = usePrefersReducedMotion();
  const shown = useCountUp(result.totalScore, TOOL_SCORE.countMs, reduced);
  const [copied, setCopied] = React.useState(false);
  const copyTimeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => {
    if (copyTimeout.current !== undefined) clearTimeout(copyTimeout.current);
  }, []);

  async function onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (copyTimeout.current !== undefined) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      /* pano reddedildi — düğme tekrar denenebilir */
    }
  }

  const labels = Object.fromEntries(BAND_ORDER.map((b) => [b, BAND_LABELS[b][locale]])) as Record<GeoBand, string>;

  return (
    <section aria-labelledby="score-heading" className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow-bare mono text-ink-500 min-w-0">
          <span className="uppercase tracking-widest">{c.result.eyebrow}</span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">{c.result.scannedAddress}: </span>
          <span className="break-all normal-case tracking-normal">{result.url}</span>
        </p>
        <div className="flex items-center gap-2">
          {newScanHref ? (
            <Link href={newScanHref} className="btn btn-ghost">{c.result.newScan}</Link>
          ) : onNewScan ? (
            <button type="button" onClick={onNewScan} className="btn btn-ghost">{c.result.newScan}</button>
          ) : null}
          <button type="button" onClick={onCopy} className="btn btn-ghost" aria-live="polite">
            {copied ? c.result.copied : c.result.copyLink}
          </button>
        </div>
      </div>

      <h2 id="score-heading" className="sr-only">{c.result.caption}</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr] md:items-end">
        <div className="flex items-baseline gap-2">
          <span data-part="score" aria-hidden="true" className="typography-display-xl mono tabular text-ink-900 leading-none">
            {shown}
          </span>
          <span className="sr-only">{result.totalScore}</span>
          <span className="typography-body-lg text-ink-500">{c.result.outOf}</span>
        </div>
        <div>
          <span className={cn("typography-label inline-flex items-center rounded-full border px-3 py-1 uppercase tracking-widest", BAND_TONE[result.band])}>
            {BAND_LABELS[result.band][locale]}
          </span>
          <p className="typography-body-lg text-ink-700 mt-3">{tool.bands[result.band][locale]}</p>
        </div>
      </div>

      {/* `tool-band-scale`: ölçek SVG'si viewBox'la küçüldüğü için etiketleri
          dar ekranda büyüten kural v2.css'te — bileşenin kendisi OG kartıyla
          ortak olduğu için oraya dokunulmaz. */}
      <div className="tool-band-scale mt-8">
        <BandScale
          score={result.totalScore}
          labels={labels}
          ariaLabel={fill(c.result.scaleAria, { score: result.totalScore, band: BAND_LABELS[result.band][locale] })}
        />
      </div>
      <p className="typography-caption text-ink-500 mt-3">{c.result.caption}</p>
    </section>
  );
}
