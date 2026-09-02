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
import type { DiagnooReport, RoadmapItem, SnapshotView } from "@/lib/tools/diagnoo/schema";

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
  },
} as const;

const CATEGORY_LABELS: Record<RoadmapItem["category"], Record<"tr" | "en", string>> = {
  speed: { tr: "Hız", en: "Speed" },
  semantic: { tr: "Mesaj", en: "Messaging" },
  ux: { tr: "Arayüz", en: "Interface" },
  tracking: { tr: "Ölçüm", en: "Tracking" },
  funnel: { tr: "Satın alma akışı", en: "Purchase flow" },
};

const PRIORITY_LABELS: Record<RoadmapItem["priority"], Record<"tr" | "en", string>> = {
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
    <svg viewBox="0 0 128 72" role="img" aria-label={label} className="w-40 shrink-0">
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
  const trackedRef = useRef(false);

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

  // Kilit açıldı: aynı yerde tam rapora dönülür, ikinci sayfa yüklemesi yok.
  if (report) {
    return <DiagnooReportView report={report} locale={locale} />;
  }

  return (
    <div className="flex flex-col gap-12" data-diagnostic-id={diagnosticId}>
      <div>
        <h2 className="typography-h2 text-ink-900">{c.heading}</h2>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <ScoreGauge score={snapshot.healthScore} label={c.gaugeLabel(snapshot.healthScore)} />
          <p className="mono tabular text-ink-900">
            <span className="typography-display-lg">{snapshot.healthScore}</span>{" "}
            <span className="typography-caption text-ink-500">{c.caption}</span>
          </p>
        </div>
      </div>

      {snapshot.benchmarks.length > 0 ? (
        <div>
          <h3 className="typography-h3 text-ink-900">{c.benchmarkHeading}</h3>
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
        <p className="typography-body-md text-ink-700 mt-2 max-w-prose-editorial">
          {c.gapsLede}
        </p>

        <ul className="mt-6 flex flex-col gap-5">
          {snapshot.topGaps.map((gap) => (
            <li
              key={gap.title}
              className="v2-surface border border-surface-2 rounded-xl p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="typography-label inline-flex items-center rounded-full border border-ink-200 px-3 py-1 uppercase tracking-widest text-ink-600">
                  {CATEGORY_LABELS[gap.category][locale]}
                </span>
                <span className="typography-label inline-flex items-center rounded-full border border-ink-200 px-3 py-1 uppercase tracking-widest text-ink-600">
                  {PRIORITY_LABELS[gap.priority][locale]}
                </span>
              </div>
              <h4 className="typography-h3 text-ink-900 mt-4">{gap.title}</h4>
              <p className="typography-body-md text-ink-700 mt-2">{gap.teaser}</p>
              {/* Maskeli yer tutucu — gerçek rakam BURADA YOK, uydurulmuş bir
                  rakam da basılmaz. Maske süs değil, kilidin kendisi. */}
              <p className="typography-caption text-ink-500 mt-4">
                <span className="mono tabular text-ink-300" aria-hidden="true">
                  ₺ ——— – ₺ ———
                </span>{" "}
                {c.lockedImpact}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="v2-surface border border-surface-2 rounded-xl p-6">
        <h3 className="typography-h3 text-ink-900">{c.opportunityHeading}</h3>
        <p className="typography-display-lg mono tabular text-ink-900 mt-3">
          {formatRange(snapshot.opportunityRange, locale)}
        </p>
        <p className="typography-caption text-ink-500 mt-3 max-w-prose-editorial">
          {c.opportunityNote}
        </p>
      </div>

      <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10">
        <DiagnooUnlockForm
          diagnosticId={diagnosticId}
          locale={locale}
          onUnlocked={setReport}
        />
      </div>
    </div>
  );
}
