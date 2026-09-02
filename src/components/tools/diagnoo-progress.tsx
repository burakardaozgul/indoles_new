"use client";

/**
 * Tarama sürerken görünen ilerleme listesi — altı adım.
 *
 * Adım adları pipeline'ın kendi adımlarıdır (`pipeline.ts`: scraping →
 * semantic → vision → funnel → financial → report); burada ikinci bir sıra
 * icat edilmez, `setProgress` ne yazdıysa o okunur. Bilinmeyen bir adım adı
 * gelirse liste hiçbir satırı "geçildi" saymaz — uydurma ilerleme yerine
 * yalnız yüzde çubuğu konuşur.
 *
 * Yüzde SUNUCUDAN gelir (`progressPct`); istemci tarafında animasyonlu sahte
 * bir sayaç çalıştırmak ziyaretçiye olmayan bir ilerleme gösterirdi.
 */

export const DIAGNOO_STEPS = [
  "scraping",
  "semantic",
  "vision",
  "funnel",
  "financial",
  "report",
] as const;

export type DiagnooStep = (typeof DIAGNOO_STEPS)[number];

const COPY = {
  tr: {
    heading: "Tarama sürüyor",
    lede: "İki ile dört dakika sürer. Sayfayı açık tutun; sonuç hazır olduğunda burada görünür.",
    progressLabel: "Tarama ilerlemesi",
    queued: "Tarama sıraya alındı",
    steps: {
      scraping: "Sayfalar taranıyor",
      semantic: "Metinler okunuyor",
      vision: "Ekran görüntüleri değerlendiriliyor",
      funnel: "Hız ve satın alma akışı ölçülüyor",
      financial: "Finansal etki hesaplanıyor",
      report: "Rapor derleniyor",
    },
  },
  en: {
    heading: "The scan is running",
    lede: "It takes two to four minutes. Keep the page open; the result appears here once it is ready.",
    progressLabel: "Scan progress",
    queued: "The scan is queued",
    steps: {
      scraping: "Scanning the pages",
      semantic: "Reading the copy",
      vision: "Assessing the screenshots",
      funnel: "Measuring speed and the purchase flow",
      financial: "Calculating the financial impact",
      report: "Assembling the report",
    },
  },
} as const;

export function DiagnooProgress({
  currentStep,
  progressPct,
  locale,
}: {
  /** `null` = kuyrukta, henüz ilk adım başlamadı. */
  currentStep: string | null;
  progressPct: number;
  locale: "tr" | "en";
}) {
  const c = COPY[locale];
  const activeIndex = DIAGNOO_STEPS.indexOf(currentStep as DiagnooStep);
  const pct = Math.round(Math.min(100, Math.max(0, progressPct)));
  const activeLabel =
    activeIndex >= 0 ? c.steps[DIAGNOO_STEPS[activeIndex]!] : c.queued;

  return (
    <div>
      <h2 className="typography-h2 text-ink-900">{c.heading}</h2>
      <p className="typography-body-md text-ink-700 mt-3 max-w-prose-editorial">
        {c.lede}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={c.progressLabel}
          className="h-2 flex-1 rounded-full bg-ink-100"
        >
          <div
            className="h-2 rounded-full bg-teal-700 transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="mono tabular typography-body-sm text-ink-700 shrink-0">
          {pct}%
        </span>
      </div>

      {/* Adım değişimi ekran okuyucuya duyurulur; çubuk tek başına sessizdir. */}
      <p role="status" aria-live="polite" className="sr-only">
        {activeLabel}
      </p>

      <ol className="mt-8 flex flex-col gap-3">
        {DIAGNOO_STEPS.map((step, i) => {
          const done = activeIndex >= 0 && i < activeIndex;
          const active = i === activeIndex;
          return (
            <li
              key={step}
              aria-current={active ? "step" : undefined}
              className="flex items-baseline gap-4"
            >
              <span
                aria-hidden="true"
                className={`mono tabular shrink-0 ${done || active ? "text-teal-700" : "text-ink-300"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={
                  active
                    ? "typography-body-md text-ink-900"
                    : done
                      ? "typography-body-md text-ink-600"
                      : "typography-body-md text-ink-400"
                }
              >
                {c.steps[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
