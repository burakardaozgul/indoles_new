"use client";

import { useEffect, useRef, useState } from "react";
import { DiagnooForm } from "@/components/tools/diagnoo-form";
import { DiagnooProgress } from "@/components/tools/diagnoo-progress";
import { DiagnooReport } from "@/components/tools/diagnoo-report";
import { DiagnooSnapshot } from "@/components/tools/diagnoo-snapshot";
import { RobotsMeta } from "@/components/tools/robots-meta";
import { ToolHero } from "@/components/tools/tool-hero";
import { TOOL_UI } from "@/components/tools/copy";
import { useDiagnooStatus } from "@/components/tools/use-diagnoo-status";
import { getPathname } from "@/lib/i18n/navigation";
import { diagnooFailureMessage } from "@/lib/tools/diagnoo/fail-copy";
import type { ToolContent } from "@/lib/content/tools";
import type { HealthScoreBucket } from "@/lib/analytics/events";

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
 * Odak başlığı `sr-only`: görünür başlık düzenini `ToolHero` kuruyor (tek h1,
 * araç adı). Buraya ikinci bir görünür başlık koymak o düzeni bozardı; ekran
 * okuyucu yine de hangi araçta ve hangi aşamada olduğunu duyar.
 *
 * HERO PARİTESİ (Faz 2 Görev 3). Sayfa artık kendi hero'sunu yazmıyor, ada
 * `ToolHero`yu kendisi basıyor — GEO'nun (`geo-tool.tsx`) kalıbı: boşta `full`
 * (eyebrow + h1 + lede), tarama başlar başlamaz `compact` (lede düşer, h1
 * kalır). Kanıt şeridi de yalnız boştaki ekranda durur: tarama sürerken
 * ilerleme listesiyle aynı dikey alanda yarışırdı.
 */

/** Rapor adresinin iç yolu — `routing.ts`'te `rapor ↔ report` çevirili. */
const REPORT_PATHNAME = "/araclar/diagnoo/rapor/[id]";

type Phase = "idle" | "running" | "snapshot" | "unlocked" | "failed";

const COPY = {
  tr: {
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

export function DiagnooTool({
  locale,
  tool,
}: {
  locale: "tr" | "en";
  /** Diagnoo kaydı — bant cümlesi anlık görünüme aktarıldığı için kova tipi korunur. */
  tool: ToolContent<HealthScoreBucket>;
}) {
  const c = COPY[locale];
  const ui = TOOL_UI[locale];
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

      {/* Robots meta senkronu (Faz 2 madde 5, final review F6 düzeltmesi):
          `onStarted` URL'i rapor yoluna `running` fazının BAŞINDA yazıyor
          (aşağıdaki `history.replaceState` çağrısı) — tarama süren 2-4
          dakika boyunca adres çubuğu rapor URL'ini gösterirken DOM'daki
          meta etiketi de aynı anda güncellenmezse landing'in (indekslenebilir)
          direktifi kalır, bu bileşenin kapatmak için var olduğu delik yeniden
          açılır. Bu yüzden koşul `running`i de kapsar. `phase` idle'a
          dönünce (yeni tarama) unmount olur, eski değer geri gelir. */}
      {phase === "running" ||
      phase === "snapshot" ||
      phase === "unlocked" ||
      phase === "failed" ? (
        <RobotsMeta content="noindex, follow" />
      ) : null}

      <ToolHero tool={tool} locale={locale} variant={phase === "idle" ? "full" : "compact"} />

      {/* Geçiş sonrası odağın indiği başlık. Araç adı burada geçer: ziyaretçi
          odak taşındığında hangi araçta ve hangi aşamada olduğunu duyar. */}
      <h2 ref={headingRef} tabIndex={-1} className="sr-only">
        {tool.name[locale]} — {phaseLabel}
      </h2>

      {/* `.tool-hero` kolonu ortalı (v2.css); form, ilerleme ve rapor gövdesi
          okuma metnidir ve sola hizalı kalır — GEO'da `ScanBar`in kendi
          `text-left`i ve `.tool-stage`in aynı kuralı bu işi yapıyor. */}
      <div className="mt-10 text-left">
        {phase === "idle" ? (
          <DiagnooForm locale={locale} inputHelp={tool.inputHelp[locale]} onStarted={onStarted} />
        ) : null}

        {phase === "failed" ? (
          <div>
            {/* Görev 17.3: eşleme `fail-copy.ts`te — rapor sayfası (sunucu,
                D1'den tek anlık görüntü) AYNI kaynaktan okur, kopya tekrarı
                yok. `network_error` yalnız burada gerçekleşir: `useDiagnooStatus`
                üç ardışık yoklama hatasında bu sebebi yazar — tarama başarısız
                OLMADI, durumunu okuyamıyoruz; "adresi kontrol edin" demek
                yanlış yere yönlendirirdi. */}
            <p role="alert" className="typography-body-md text-ink-700">
              {diagnooFailureMessage(status.failReason, locale)}
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
            bands={tool.bands}
            diagnosticId={diagnosticId!}
            locale={locale}
          />
        ) : null}
      </div>

      {/* Kanıt şeridi — GEO hero'sundaki desenin birebir aynısı: ortalı, dört
          kısa öğe, hepsi motorun gerçek davranışı. `ink-600`, `ink-500` değil:
          şerit blobun sıcak gövdesinin üstünde duruyor ve `ink-500` orada AA
          eşiğinin altına iniyor (geo-tool.tsx'teki 2026-09-02 ölçümü). */}
      {phase === "idle" ? (
        <ul
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-ink-600 typography-label"
          aria-label={ui.proofLabel}
        >
          {tool.proof.map((item) => (
            <li key={item.tr}>{item[locale]}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
