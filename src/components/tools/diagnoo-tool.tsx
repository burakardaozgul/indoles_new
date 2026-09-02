"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * GEÇİŞLERİN ERİŞİLEBİLİRLİĞİ (WCAG 2.2 AA, SC 4.1.3 + 2.4.3). Ekran her
 * geçişte tamamen değişiyor ve eski ekranın odaklanmış öğesi DOM'dan
 * kalkıyor. İki mekanizma bunu karşılar:
 *
 * 1. KALICI canlı bölge: her geçişte metni değişen tek bir `aria-live`
 *    düğümü. Kalıcı olması şart — canlı bölge içeriğiyle AYNI anda DOM'a
 *    girerse ekran okuyucular değişimi çoğu kez kaçırır.
 * 2. Odak taşıma: yeni ekranın başlığı `tabIndex={-1}` taşır ve geçişten
 *    sonra odaklanır. Aksi hâlde odak `<body>`ye düşer ve bir sonraki Tab
 *    ziyaretçiyi sayfanın en başına atar.
 *
 * Başlık `sr-only`: sayfanın görsel başlık düzeni kasıtlı (araç kutusunun
 * üstünde görünür başlık yok, `page.tsx`) — buraya görünür bir başlık koymak
 * o kararı bozardı. Ekran okuyucu yine de nerede olduğunu duyar.
 */

/** Rapor adresinin iç yolu — `routing.ts`'te `rapor ↔ report` çevirili. */
const REPORT_PATHNAME = "/araclar/diagnoo/rapor/[id]";

type Phase = "idle" | "running" | "snapshot" | "unlocked" | "failed";

const COPY = {
  tr: {
    failedScrape:
      "Bu adres taranamadı. Site yanıt vermiyor veya taramaya kapalı olabilir; adresi kontrol edip yeniden deneyin.",
    failedNotFound:
      "Bu teşhis bulunamadı. Yeni bir tarama başlatabilirsiniz.",
    failedGeneric:
      "Tarama tamamlanamadı. Adresi kontrol edip yeniden başlatın.",
    retry: "Yeni tarama başlat",
    phaseIdle: "yeni tarama",
    phaseRunning: "tarama sürüyor",
    phaseSnapshot: "anlık görünüm",
    phaseUnlocked: "rapor",
    phaseFailed: "tarama tamamlanamadı",
    liveIdle: "Yeni tarama için adres alanı hazır.",
    liveRunning: "Tarama başlatıldı.",
    liveSnapshot: "Tarama tamamlandı. Anlık görünüm hazır.",
    liveUnlocked: "Tarama tamamlandı. Rapor açık.",
  },
  en: {
    failedScrape:
      "This address could not be fetched. The site may not be responding or may be closed to scanning; check the address and try again.",
    failedNotFound: "This diagnostic was not found. You can start a new scan.",
    failedGeneric: "The scan could not finish. Check the address and start it again.",
    retry: "Start a new scan",
    phaseIdle: "new scan",
    phaseRunning: "scan running",
    phaseSnapshot: "snapshot",
    phaseUnlocked: "report",
    phaseFailed: "scan could not finish",
    liveIdle: "The address field is ready for a new scan.",
    liveRunning: "The scan has started.",
    liveSnapshot: "The scan is complete. The snapshot is ready.",
    liveUnlocked: "The scan is complete. The report is open.",
  },
} as const;

/** Aşama → `sr-only` başlık eki. Araç adıyla birleşir. */
const PHASE_LABEL: Record<Phase, Record<"tr" | "en", string>> = {
  idle: { tr: COPY.tr.phaseIdle, en: COPY.en.phaseIdle },
  running: { tr: COPY.tr.phaseRunning, en: COPY.en.phaseRunning },
  snapshot: { tr: COPY.tr.phaseSnapshot, en: COPY.en.phaseSnapshot },
  unlocked: { tr: COPY.tr.phaseUnlocked, en: COPY.en.phaseUnlocked },
  failed: { tr: COPY.tr.phaseFailed, en: COPY.en.phaseFailed },
};

/**
 * Aşama → canlı bölgede okunacak cümle.
 *
 * `failed` BİLEREK boş: o yolda görünen hata paragrafı `role="alert"` taşıyor
 * ve `role="alert"` zaten bir canlı bölgedir (`aria-live="assertive"`
 * eşdeğeri). İkisini birden yayınlamak hatayı ekran okuyucuya iki kez
 * okuturdu. Odak taşıma bu aşamada da çalışır — duyuruyu alert yapar,
 * yönlendirmeyi odak.
 */
const PHASE_LIVE: Record<Phase, Record<"tr" | "en", string>> = {
  idle: { tr: COPY.tr.liveIdle, en: COPY.en.liveIdle },
  running: { tr: COPY.tr.liveRunning, en: COPY.en.liveRunning },
  snapshot: { tr: COPY.tr.liveSnapshot, en: COPY.en.liveSnapshot },
  unlocked: { tr: COPY.tr.liveUnlocked, en: COPY.en.liveUnlocked },
  failed: { tr: "", en: "" },
};

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
  const c = COPY[locale];
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const status = useDiagnooStatus(diagnosticId);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousPhase = useRef<Phase>("idle");

  // Ekran seçimi tek yerden türer: aşağıdaki üç dal da bu değeri okur, yani
  // "hangi ekran görünüyor" ile "hangi geçiş duyuruldu" ayrışamaz.
  let phase: Phase = "idle";
  if (diagnosticId !== null) {
    if (status.status === "failed") phase = "failed";
    else if (status.status === "completed") {
      // Tamamlandı ama ne rapor ne anlık görünüm var: kayıt bozuk, dürüst
      // davranıp hata ekranına düşülür.
      phase = status.report ? "unlocked" : status.snapshot ? "snapshot" : "failed";
    } else phase = "running";
  }

  // İkisi de düz metin: aynı aşama + aynı dil her render'da AYNI dizeyi verir,
  // dolayısıyla efektin bağımlılık listesi eksiksiz olabilir (disable yok).
  const phaseLabel = PHASE_LABEL[phase][locale];
  const liveText = PHASE_LIVE[phase][locale];

  useEffect(() => {
    // İlk render bir GEÇİŞ değil: sayfa yeni açıldı, ne duyurulacak bir şey
    // var ne de odağı ziyaretçiden almak doğru olur (SC 3.2.5).
    if (previousPhase.current === phase) return;
    previousPhase.current = phase;
    setAnnouncement(liveText);
    headingRef.current?.focus();
  }, [phase, liveText]);

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
      {/* Kalıcı canlı bölge — yalnız metni değişir, düğümün kendisi hep DOM'da. */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Geçiş sonrası odağın indiği başlık. Araç adı burada geçer: ziyaretçi
          odak taşındığında hangi araçta ve hangi aşamada olduğunu duyar. */}
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        {tool.name[locale]} — {phaseLabel}
      </h2>

      {phase === "idle" ? <DiagnooForm locale={locale} onStarted={onStarted} /> : null}

      {phase === "failed" ? (
        <div>
          <p role="alert" className="typography-body-md text-ink-700 max-w-prose-editorial">
            {failureMessage(status.failReason, locale)}
          </p>
          <button type="button" onClick={onRetry} className="btn btn-primary mt-6">
            {c.retry}
          </button>
        </div>
      ) : null}

      {/* `status === null` de ilerleme ekranıdır: ilk yoklama yanıtı henüz
          gelmedi, ama tarama başlatıldı — form'a geri dönmek yanlış olurdu. */}
      {phase === "running" ? (
        <DiagnooProgress
          currentStep={status.currentStep}
          progressPct={status.progressPct}
          locale={locale}
        />
      ) : null}

      {/* Kilit zaten açık: durum uç noktası tam raporu YALNIZ bu tarayıcının
          kilit çerezi lead'e eşleşirse döndürür (`leadCaptured`). Varsayım
          istemcide değil sunucuda doğrulanıyor — başka bir ziyaretçinin aynı
          teşhis için açtığı kilit buraya düşmez. */}
      {phase === "unlocked" && status.report ? (
        <DiagnooReport report={status.report} locale={locale} />
      ) : null}

      {phase === "snapshot" && status.snapshot ? (
        <DiagnooSnapshot
          snapshot={status.snapshot}
          diagnosticId={diagnosticId!}
          locale={locale}
        />
      ) : null}
    </div>
  );
}
