"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics/ga";
import { healthScoreBucket } from "@/lib/analytics/events";
import {
  BenchmarkRows,
  DiagnooReport as DiagnooReportView,
  formatRange,
} from "@/components/tools/diagnoo-report";
import { DiagnooUnlockForm } from "@/components/tools/diagnoo-unlock-form";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";
import type {
  DiagnooReport,
  RoadmapItem,
  SnapshotView,
} from "@/lib/tools/diagnoo/schema";

/**
 * Ücretsiz anlık görünüm — skor, kıyas, üç KİLİTLİ boşluk, fırsat aralığı ve
 * kilit açma formu.
 *
 * KİLİT SÖZLEŞMESİ: kartlarda aylık etki TUTARI yok. `SnapshotView` bu rakamı
 * zaten taşımıyor (`toSnapshot` düşürüyor, sunucu da kilit açılmadan tam
 * raporu göndermiyor) — görünüm bu boşluğu tahmini bir sayıyla DOLDURMAZ,
 * maskeli bir yer tutucu basar. Uydurma rakam içerik dürüstlüğünü bozar
 * (docs/04 §10) ve kilidin kendisini değersizleştirir.
 *
 * "use client": mount'ta `tool_scan_completed` atılıyor ve kilit açıldığında
 * görünüm AYNI yerde rapora dönüyor. Kilit açıldıktan sonra ikinci bir sayfa
 * yüklemesi yok — rapor unlock isteğinin 200 gövdesinden gelir.
 *
 * Rapor sayfası (`rapor/[id]/page.tsx`) bunu sunucudan render eder; prop'lar
 * düz veridir, sınır sorunsuz geçer.
 */

const COPY = {
  tr: {
    heading: "Sağlık skoru",
    caption: "100 üzerinden",
    gaugeLabel: (score: number) => `Sağlık skoru: ${score} / 100`,
    benchmarkHeading: "Sektör kıyası",
    gapsHeading: "En yüksek etkili üç boşluk",
    gapsLede:
      "Öncelik sırasına göre. Her boşluğun aylık etkisi ve kapatma adımları tam raporda açılır.",
    lockedImpact: "Aylık etki tutarı tam raporda açılır.",
    opportunityHeading: "Aylık geri kazanılabilir gelir",
    opportunityNote:
      "Aralık, taramanın ölçümleri ile sektör medyanlarından türetildi. Kendi rakamlarınızı girerseniz daralır.",
    reportHeading: "Tam rapor",
    liveUnlocked: "Rapor açıldı.",
  },
  en: {
    heading: "Health score",
    caption: "out of 100",
    gaugeLabel: (score: number) => `Health score: ${score} out of 100`,
    benchmarkHeading: "Sector benchmark",
    gapsHeading: "The three gaps with the highest impact",
    gapsLede:
      "In priority order. The monthly impact of each gap and the steps to close it open in the full report.",
    lockedImpact: "The monthly impact figure opens in the full report.",
    opportunityHeading: "Recoverable revenue per month",
    opportunityNote:
      "The range derives from the measurements of the scan and sector medians. Entering your own figures narrows it.",
    reportHeading: "Full report",
    liveUnlocked: "The report is open.",
  },
} as const;

const CATEGORY_LABELS: Record<
  RoadmapItem["category"],
  Record<"tr" | "en", string>
> = {
  speed: { tr: "Hız", en: "Speed" },
  semantic: { tr: "Mesaj", en: "Messaging" },
  ux: { tr: "Arayüz", en: "Interface" },
  tracking: { tr: "Ölçüm", en: "Tracking" },
  funnel: { tr: "Satın alma akışı", en: "Purchase flow" },
};

const PRIORITY_LABELS: Record<
  RoadmapItem["priority"],
  Record<"tr" | "en", string>
> = {
  critical: { tr: "Kritik", en: "Critical" },
  high: { tr: "Yüksek", en: "High" },
  medium: { tr: "Orta", en: "Medium" },
  low: { tr: "Düşük", en: "Low" },
};

/**
 * Yarım daire gösterge — tek `<svg>`, grafik kütüphanesi yok.
 *
 * Yay 180 derece: sol uçtan sağ uca. Dolgu `stroke-dasharray` ile kesilir,
 * skorun 0-100 aralığındaki payı kadar boyanır. Sayısal değer gösterge
 * YANINDA metin olarak da duruyor, bu yüzden svg `aria-hidden` DEĞİL ama
 * kendi `role="img"` ve etiketiyle tek bir anlam taşır.
 */
function ScoreGauge({ score, label }: { score: number; label: string }) {
  // Yarım çember uzunluğu: π × yarıçap (yarıçap 54, viewBox koordinatı).
  const arcLength = Math.PI * 54;
  const filled = (Math.min(100, Math.max(0, score)) / 100) * arcLength;
  const path = "M 10 64 A 54 54 0 0 1 118 64";

  return (
    <svg
      viewBox="0 0 128 72"
      role="img"
      aria-label={label}
      className="w-40 shrink-0"
    >
      <path
        d={path}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        className="stroke-ink-100"
      />
      <path
        d={path}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${arcLength}`}
        className="stroke-teal-700"
      />
    </svg>
  );
}

export function DiagnooSnapshot({
  snapshot,
  diagnosticId,
  locale,
}: {
  snapshot: SnapshotView;
  diagnosticId: string;
  locale: "tr" | "en";
}) {
  const c = COPY[locale];
  const [report, setReport] = useState<DiagnooReport | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const trackedRef = useRef(false);
  const reportHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Bir kez: React 18+ geliştirme modunda efektler iki kez koşar, olay
    // sayacı bundan etkilenmemeli.
    if (trackedRef.current) return;
    trackedRef.current = true;
    track({
      name: "tool_scan_completed",
      properties: {
        slug: DIAGNOO_SLUG,
        band: healthScoreBucket(snapshot.healthScore),
        locale,
      },
    });
  }, [snapshot.healthScore, locale]);

  // GEÇİŞİN ERİŞİLEBİLİRLİĞİ (WCAG 2.2 AA, SC 4.1.3 + 2.4.3): kilit açılınca
  // form — ziyaretçinin AZ ÖNCE bastığı gönder düğmesi dahil — DOM'dan
  // kalkıyor ve odak `<body>`ye düşüyordu. Bu geçişin sahibi bu bileşendir:
  // hem araç sayfasındaki akışta hem doğrudan ziyaret edilen rapor
  // sayfasında (`rapor/[id]/page.tsx`) kilit BURADA açılır, dolayısıyla
  // duyuru ve odak da burada yaşamak zorunda.
  useEffect(() => {
    if (!report) return;
    setAnnouncement(c.liveUnlocked);
    reportHeadingRef.current?.focus();
  }, [report, c.liveUnlocked]);

  return (
    <div
      className={report ? undefined : "flex flex-col gap-12"}
      data-diagnostic-id={diagnosticId}
    >
      {/* Kalıcı canlı bölge: içeriğiyle aynı anda DOM'a giren bir canlı bölge
          ekran okuyucular tarafından çoğu kez kaçırılır. */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {report ? (
        <>
          {/* Odağın indiği başlık — görsel düzen değişmesin diye `sr-only`. */}
          <h2 ref={reportHeadingRef} tabIndex={-1} className="sr-only">
            {c.reportHeading}
          </h2>
          <DiagnooReportView report={report} locale={locale} />
        </>
      ) : (
        <>
          <div>
            <h2 className="typography-h2 text-ink-900">{c.heading}</h2>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <ScoreGauge
                score={snapshot.healthScore}
                label={c.gaugeLabel(snapshot.healthScore)}
              />
              <p className="mono tabular text-ink-900">
                <span className="typography-display-lg">
                  {snapshot.healthScore}
                </span>{" "}
                <span className="typography-caption text-ink-500">
                  {c.caption}
                </span>
              </p>
            </div>
          </div>

          {snapshot.benchmarks.length > 0 ? (
            <div>
              <h3 className="typography-h3 text-ink-900">
                {c.benchmarkHeading}
              </h3>
              {snapshot.benchmarks.map((benchmark) => (
                <BenchmarkRows
                  key={benchmark.metric}
                  benchmark={benchmark}
                  locale={locale}
                />
              ))}
            </div>
          ) : null}

          <div>
            <h3 className="typography-h3 text-ink-900">{c.gapsHeading}</h3>
            <p className="typography-body-md text-ink-700 max-w-prose-editorial mt-2">
              {c.gapsLede}
            </p>

            <ul className="mt-6 flex flex-col gap-5">
              {snapshot.topGaps.map((gap) => (
                <li
                  key={gap.title}
                  className="v2-surface border-surface-2 rounded-xl border p-6"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="typography-label border-ink-200 text-ink-600 inline-flex items-center rounded-full border px-3 py-1 tracking-widest uppercase">
                      {CATEGORY_LABELS[gap.category][locale]}
                    </span>
                    <span className="typography-label border-ink-200 text-ink-600 inline-flex items-center rounded-full border px-3 py-1 tracking-widest uppercase">
                      {PRIORITY_LABELS[gap.priority][locale]}
                    </span>
                  </div>
                  <h4 className="typography-h3 text-ink-900 mt-4">
                    {gap.title}
                  </h4>
                  <p className="typography-body-md text-ink-700 mt-2">
                    {gap.teaser}
                  </p>
                  {/* Maskeli yer tutucu — gerçek rakam BURADA YOK, uydurulmuş bir
                  rakam da basılmaz. Maske süs değil, kilidin kendisi. */}
                  <p className="typography-caption text-ink-500 mt-4">
                    <span
                      className="mono tabular text-ink-300"
                      aria-hidden="true"
                    >
                      ₺ ——— – ₺ ———
                    </span>{" "}
                    {c.lockedImpact}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="v2-surface border-surface-2 rounded-xl border p-6">
            <h3 className="typography-h3 text-ink-900">
              {c.opportunityHeading}
            </h3>
            <p className="typography-display-lg mono tabular text-ink-900 mt-3">
              {formatRange(snapshot.opportunityRange, locale)}
            </p>
            <p className="typography-caption text-ink-500 max-w-prose-editorial mt-3">
              {c.opportunityNote}
            </p>
          </div>

          <div className="v2-surface border-surface-2 rounded-2xl border p-6 md:p-10">
            <DiagnooUnlockForm
              diagnosticId={diagnosticId}
              locale={locale}
              onUnlocked={setReport}
            />
          </div>
        </>
      )}
    </div>
  );
}
