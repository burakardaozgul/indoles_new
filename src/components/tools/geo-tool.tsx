"use client";

import * as React from "react";
import { ReportGate } from "@/components/tools/report-gate";
import { RobotsMeta } from "@/components/tools/robots-meta";
import { ScanBar, type ScanSubmission } from "@/components/tools/scan-bar";
import { ScanStage } from "@/components/tools/scan-stage";
import { ScoreCard } from "@/components/tools/score-card";
import { SignalRows } from "@/components/tools/signal-rows";
import { ToolHero } from "@/components/tools/tool-hero";
import { SCAN_ERROR_MAP, TOOL_UI, fill, type ScanErrorKind } from "@/components/tools/copy";
import { track } from "@/lib/analytics/ga";
import { getPathname } from "@/lib/i18n/navigation";
import { absoluteUrl } from "@/lib/seo/site";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import type { ToolContent } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoBand, GeoScanResult } from "@/lib/tools/geo/types";

/**
 * Araç adası — durum makinesi (spec §2):
 *   idle ──submit──▶ scanning ──200──▶ resolving ──sahne biter──▶ result
 *     ▲                 │
 *     └──── error ◀─────┘
 * Yanıt `pending`te bekler; sahne satırları çözülünce `scan` olur. Sayfa
 * geçişi yok; URL `history.replaceState` ile paylaşım linkine güncellenir.
 */
export const SLUG = "geo-gorunurluk-denetleyicisi";
export const TOOL_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi";
export const RESULT_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]";

export function resultPathname(id: string, locale: Locale): string {
  return getPathname({ href: { pathname: RESULT_PATHNAME, params: { id } }, locale });
}
export function toolPathname(locale: Locale): string {
  return getPathname({ href: TOOL_PATHNAME, locale });
}

type Phase = "idle" | "scanning" | "resolving" | "result";

export function GeoTool({
  locale,
  tool,
  initialResult,
  mode,
}: {
  locale: Locale;
  /** GEO kaydı — skor kartına aktarıldığı için bant tipi burada da korunur. */
  tool: ToolContent<GeoBand>;
  initialResult?: GeoScanResult;
  mode: "tool" | "share";
}) {
  const c = TOOL_UI[locale];
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = React.useState<Phase>(initialResult ? "result" : "idle");
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<ScanErrorKind | null>(null);
  const [pending, setPending] = React.useState<GeoScanResult | null>(null);
  const [scan, setScan] = React.useState<GeoScanResult | null>(initialResult ?? null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const shouldScrollRef = React.useRef(false);
  // Ruling R8: `pending`in en güncel değeri bir ref'te de tutulur —
  // `onResolved` bu ref'i OKUR, `setState` güncelleyicisinin İÇİNDE yan etki
  // çalıştırmaz. `reactStrictMode: true` (next.config.ts) dev'de her
  // güncelleyiciyi iki kez çağırır; yan etki (track/replaceState) güncelleyici
  // içindeyse iki kez tetiklenirdi. `pendingRef` her `setPending` çağrısıyla
  // birlikte, AYNI ANDA güncellenir.
  const pendingRef = React.useRef<GeoScanResult | null>(null);

  async function onSubmit(sub: ScanSubmission): Promise<void> {
    setError(null);
    setPhase("scanning");
    track({ name: "tool_used", properties: { slug: SLUG, locale } });
    try {
      const res = await fetch("/api/tools/geo-scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => null)) as { id?: string; result?: GeoScanResult } | null;
        if (!body?.id || !body.result) {
          setError("generic");
          setPhase("idle");
          return;
        }
        const next = { ...body.result, id: body.id };
        pendingRef.current = next;
        setPending(next);
        setPhase("resolving");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(SCAN_ERROR_MAP[body?.error ?? ""] ?? "generic");
      setPhase("idle");
    } catch {
      setError("generic");
      setPhase("idle");
    }
  }

  const onResolved = React.useCallback(() => {
    const p = pendingRef.current;
    if (!p) return;
    setScan(p);
    track({ name: "tool_scan_completed", properties: { slug: SLUG, band: p.band, locale } });
    window.history.replaceState(null, "", resultPathname(p.id, locale));
    shouldScrollRef.current = true;
    setPhase("result");
    pendingRef.current = null;
    setPending(null);
  }, [locale]);

  React.useEffect(() => {
    if (phase !== "result" || !shouldScrollRef.current) return;
    shouldScrollRef.current = false;
    cardRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    // Odak karta taşınır (spec §4): ekran okuyucu kullanıcısı için de scroll
    // ile aynı anda "buradasın" sinyali — `preventScroll` ikinci bir kaydırma
    // tetiklemez, üstteki `scrollIntoView` zaten konumu ayarladı.
    cardRef.current?.focus({ preventScroll: true });
  }, [phase, reduced]);

  function onNewScan(): void {
    setScan(null);
    pendingRef.current = null;
    setPending(null);
    setUrl("");
    setError(null);
    setPhase("idle");
    window.history.replaceState(null, "", toolPathname(locale));
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  const busy = phase === "scanning" || phase === "resolving";
  // Kalıcı canlı bölge (spec §4): tek `<p>`, üç fazda da monte kalır — ekran
  // okuyucu metin DEĞİŞİMİNİ duyurur; `ScanStage`in kendi durum düğümü
  // (kaldırıldı) ve bu düğüm arasında geçiş sırasında anons kaybolmaz.
  const statusText =
    phase === "result" && scan ? fill(c.stage.completed, { score: scan.totalScore }) : busy ? c.stage.live : "";

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">{statusText}</p>
      {phase === "result" && scan ? (
        // `scroll-mt-36` (144 px) sabit chrome'un altını temizler: v2 nav dört
        // viewport'ta da 120 px'te biter, 28 (112 px) kartın üst köşesini
        // navigasyonun arkasında bırakıyordu (2026-09-02 ölçüm). `outline-none`:
        // odak programatik (`.focus()`), fokus halkası kullanıcı niyetini
        // yansıtmaz — kart zaten `scrollIntoView` ile görünür durumda.
        <div ref={cardRef} tabIndex={-1} className="scroll-mt-36 outline-none">
          {/* Robots meta senkronu (Faz 2 madde 5): "tool" modunda sayfa
              geçişi yok, URL `history.replaceState` ile sonuç adresine döner
              ama DOM'daki meta etiketi araç sayfasının (indekslenebilir)
              değerinde kalırdı — `/sonuc/[id]` sayfasının `noindex, follow`u
              burada da uygulanır. `onNewScan` çağrılınca (madde: "result"
              fazından çıkış) unmount olur, eski değer geri gelir. */}
          <RobotsMeta content="noindex, follow" />
          <ToolHero tool={tool} locale={locale} variant="hidden" />
          <ScoreCard
            result={scan}
            tool={tool}
            locale={locale}
            shareUrl={absoluteUrl(resultPathname(scan.id, locale))}
            {...(mode === "tool" ? { onNewScan } : { newScanHref: toolPathname(locale) })}
          />
          <SignalRows checks={scan.checks} signals={tool.signals} locale={locale} />
          <ReportGate scanId={scan.id} band={scan.band} locale={locale} checks={scan.checks} signals={tool.signals} />
        </div>
      ) : (
        <div>
          <ToolHero tool={tool} locale={locale} variant={busy ? "compact" : "full"} />
          <div className="mt-10">
            <ScanBar locale={locale} value={url} onChange={setUrl} onSubmit={onSubmit} busy={busy} error={error} />
            {/* ink-600, ink-500 değil: bu iki satır blobun sıcak gövdesinin tam
                üstünde duruyor. Ölçümde ink-500 krem üstünde 4.34, blob üstünde
                2.89'a iniyordu (2026-09-02, docs/04 §12.10 tablosu); ink-600 en
                kötü pikselde bile AA eşiğinin üstünde kalır. */}
            {!busy ? (
              <p className="typography-caption text-ink-600 mt-3">{tool.inputHelp[locale]}</p>
            ) : (
              <ScanStage
                signals={tool.signals}
                locale={locale}
                checks={phase === "resolving" && pending ? pending.checks : null}
                onResolved={onResolved}
              />
            )}
          </div>
          {!busy ? (
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-ink-600 typography-label" aria-label={c.proofLabel}>
              {tool.proof.map((p) => (
                <li key={p.tr}>{p[locale]}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </>
  );
}
