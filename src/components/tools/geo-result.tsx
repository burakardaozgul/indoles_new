import { cn } from "@/lib/utils/cn";
import type { ToolSignal } from "@/lib/content/tools";
import type { GeoBand, GeoCheckStatus, GeoScanResult } from "@/lib/tools/geo/types";
import type { Locale } from "@/lib/content/types";

/**
 * Tarama sonucunun basit görünümü — spec §4 "Basit sonuç": toplam skor +
 * bant + 5 kalem rozeti + kalem başına `summary` cümlesi.
 *
 * `findings` (detaylı bulgu listesi) BİLİNÇLİ OLARAK render edilmez — o
 * e-posta karşılığı rapora ait (Görev 12, spec §3 "Detaylı rapor"). Bu
 * ayrım MOFU lead akışının temeli: ücretsiz ekran teşhis eder, rapor kilidi
 * e-postayla açılır.
 *
 * Sunucu (paylaşım sayfası) ve istemci (`GeoScanForm` başarı sonrası) her
 * ikisinde de aynı biçimde kullanılır — bileşenin kendisi hook/tarayıcı
 * API'si taşımaz, "use client" gerekmez.
 *
 * Kalem başlıkları `tools.ts`'teki `ToolSignal[]`'den okunur (`id` eşleşmesi)
 * — motorun kontrol kimlikleriyle sayfa tanıtımı senkron kalır (Görev 10
 * kararının aynısı); rozet metni burada ikinci kez yazılmaz.
 */

const BAND_LABELS: Record<GeoBand, Record<Locale, string>> = {
  zayif: { tr: "Zayıf", en: "Weak" },
  "gelismeye-acik": { tr: "Gelişmeye açık", en: "Developing" },
  iyi: { tr: "İyi", en: "Good" },
  oncu: { tr: "Öncü", en: "Leading" },
};

// TR etiketler `tools.ts` FAQ'ünde ("durumu (geçti, kısmen, kaldı)") zaten
// onaylı; burada ikinci bir kelime seçilmez, aynen tekrar edilir.
const STATUS_LABELS: Record<GeoCheckStatus, Record<Locale, string>> = {
  pass: { tr: "Geçti", en: "Pass" },
  partial: { tr: "Kısmen", en: "Partial" },
  fail: { tr: "Kaldı", en: "Fail" },
};

const POINTS_LABEL: Record<Locale, string> = { tr: "puan", en: "points" };
const SCANNED_URL_LABEL: Record<Locale, string> = {
  tr: "Taranan adres",
  en: "Scanned address",
};
const SCORE_CAPTION: Record<Locale, string> = {
  tr: "GEO hazırlık skoru",
  en: "GEO readiness score",
};

const BAND_TONE: Record<GeoBand, string> = {
  zayif: "border-danger-500 bg-danger-50 text-danger-700",
  "gelismeye-acik": "border-warning-500 bg-warning-50 text-warning-700",
  iyi: "border-success-500 bg-success-50 text-success-700",
  oncu: "border-teal-500 bg-teal-50 text-teal-700",
};

const STATUS_TONE: Record<GeoCheckStatus, string> = {
  pass: "text-success-700",
  partial: "text-warning-700",
  fail: "text-danger-700",
};

export function GeoResult({
  result,
  signals,
  locale,
}: {
  result: GeoScanResult;
  /** Kalem tanıtım kartları — `TOOLS[0].signals` (Görev 10 içerik katmanı). */
  signals: ToolSignal[];
  locale: Locale;
}) {
  return (
    <div>
      <p className="typography-caption text-ink-500">{SCANNED_URL_LABEL[locale]}</p>
      <p className="typography-body-md text-ink-700 mt-1 break-all">{result.url}</p>

      <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-3">
        <div className="flex items-baseline gap-2">
          <span className="typography-display-lg mono tabular text-ink-900">
            {result.totalScore}
          </span>
          <span className="typography-body-md text-ink-500">/ 100</span>
        </div>
        <span
          className={cn(
            "typography-label inline-flex items-center rounded-full border px-3 py-1 uppercase tracking-widest",
            BAND_TONE[result.band],
          )}
        >
          {BAND_LABELS[result.band][locale]}
        </span>
      </div>
      <p className="typography-caption text-ink-500 mt-2">{SCORE_CAPTION[locale]}</p>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {result.checks.map((check) => {
          const signal = signals.find((s) => s.id === check.id);
          return (
            <li
              key={check.id}
              className="v2-surface border border-surface-2 rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="typography-h3 text-ink-900">
                  {signal ? signal.title[locale] : check.id}
                </h3>
                <span
                  className={cn(
                    "typography-label shrink-0 uppercase tracking-widest",
                    STATUS_TONE[check.status],
                  )}
                >
                  {STATUS_LABELS[check.status][locale]}
                </span>
              </div>
              <p className="mono tabular text-ink-500 mt-2">
                {check.score} / {check.max} {POINTS_LABEL[locale]}
              </p>
              <p className="typography-body-md text-ink-700 mt-3">
                {check.summary[locale]}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
