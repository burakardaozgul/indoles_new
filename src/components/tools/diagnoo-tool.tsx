"use client";

import { useState } from "react";
import { DiagnooForm } from "@/components/tools/diagnoo-form";
import { DiagnooProgress } from "@/components/tools/diagnoo-progress";
import { DiagnooReport } from "@/components/tools/diagnoo-report";
import { DiagnooSnapshot } from "@/components/tools/diagnoo-snapshot";
import { useDiagnooStatus } from "@/components/tools/use-diagnoo-status";
import { getPathname } from "@/lib/i18n/navigation";
import type { ToolContent } from "@/lib/content/tools";

/**
 * Diagnoo giriş yüzeyinin durum makinesi:
 *
 *   idle (URL formu) → running (ilerleme) → snapshot (kilitli) → unlocked
 *
 * Geçişleri sunucu belirler, istemci varsaymaz: form 202 ile bir kimlik alır,
 * `useDiagnooStatus` o kimliği yoklar, gelen `status` hangi ekranın
 * basılacağını söyler. Kilit açma adımı `DiagnooSnapshot`in içinde yaşar —
 * rapor kilidi açılınca görünüm aynı yerde rapora döner.
 *
 * SAYFA GEÇİŞİ YOK (`GeoScanForm` kararının aynısı): 202 alındığında URL
 * çubuğu `history.replaceState` ile rapor adresine güncellenir. `router.push`
 * tam bir sayfa geçişi olurdu ve elimizdeki durumu atıp sunucudan yeniden
 * isterdi; rapor rotası (`rapor/[id]/page.tsx`) zaten yalnız doğrudan
 * ziyaret/paylaşım için var.
 *
 * `reused: true` ayrı bir yol değil: o kayıt zaten `completed`, ilk yoklama
 * anlık görünümü hemen döndürür.
 */

/** Rapor adresinin iç yolu — `routing.ts`'te `rapor ↔ report` çevirili. */
const REPORT_PATHNAME = "/araclar/diagnoo/rapor/[id]";

const COPY = {
  tr: {
    failedScrape:
      "Bu adres taranamadı. Site yanıt vermiyor veya taramaya kapalı olabilir; adresi kontrol edip yeniden deneyin.",
    failedNotFound:
      "Bu teşhis bulunamadı. Yeni bir tarama başlatabilirsiniz.",
    failedGeneric:
      "Tarama tamamlanamadı. Adresi kontrol edip yeniden başlatın.",
    retry: "Yeni tarama başlat",
  },
  en: {
    failedScrape:
      "This address could not be fetched. The site may not be responding or may be closed to scanning; check the address and try again.",
    failedNotFound: "This diagnostic was not found. You can start a new scan.",
    failedGeneric: "The scan could not finish. Check the address and start it again.",
    retry: "Start a new scan",
  },
} as const;

/** Dürüst hata metni: sebep neyse o söylenir, genel bir cümleye sarılmaz. */
function failureMessage(reason: string | null, locale: "tr" | "en"): string {
  const c = COPY[locale];
  if (reason === "scrape_failed") return c.failedScrape;
  if (reason === "not_found") return c.failedNotFound;
  return c.failedGeneric;
}

export function DiagnooTool({
  locale,
  tool,
}: {
  locale: "tr" | "en";
  tool: ToolContent;
}) {
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const status = useDiagnooStatus(diagnosticId);

  function onStarted(id: string): void {
    setDiagnosticId(id);
    window.history.replaceState(
      null,
      "",
      getPathname({ href: { pathname: REPORT_PATHNAME, params: { id } }, locale }),
    );
  }

  function onRetry(): void {
    setDiagnosticId(null);
    window.history.replaceState(
      null,
      "",
      getPathname({ href: "/araclar/diagnoo", locale }),
    );
  }

  return (
    <div>
      {diagnosticId === null ? <DiagnooForm locale={locale} onStarted={onStarted} /> : null}

      {diagnosticId !== null && status.status === "failed" ? (
        <div>
          <p role="alert" className="typography-body-md text-ink-700 max-w-prose-editorial">
            {failureMessage(status.failReason, locale)}
          </p>
          <button type="button" onClick={onRetry} className="btn btn-primary mt-6">
            {COPY[locale].retry}
          </button>
        </div>
      ) : null}

      {/* `status === null` de ilerleme ekranıdır: ilk yoklama yanıtı henüz
          gelmedi, ama tarama başlatıldı — form'a geri dönmek yanlış olurdu. */}
      {diagnosticId !== null &&
      (status.status === null ||
        status.status === "queued" ||
        status.status === "running") ? (
        <DiagnooProgress
          currentStep={status.currentStep}
          progressPct={status.progressPct}
          locale={locale}
        />
      ) : null}

      {diagnosticId !== null && status.status === "completed" ? (
        status.report ? (
          // Kilit zaten açık (aynı tarayıcıdan ikinci ziyaret, `leadCaptured`).
          <DiagnooReport report={status.report} locale={locale} />
        ) : status.snapshot ? (
          <DiagnooSnapshot
            snapshot={status.snapshot}
            diagnosticId={diagnosticId}
            locale={locale}
          />
        ) : (
          <p role="alert" className="typography-body-md text-ink-700">
            {failureMessage(null, locale)}
          </p>
        )
      ) : null}
    </div>
  );
}
