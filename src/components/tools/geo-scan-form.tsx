"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPathname } from "@/lib/i18n/navigation";
import { track } from "@/lib/analytics/ga";
import { GeoResult } from "@/components/tools/geo-result";
import type { ToolSignal } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

/**
 * GEO Görünürlük Denetleyicisi giriş formu — `POST /api/tools/geo-scan`.
 *
 * Desen `ContactForm`'un Turnstile entegrasyonunu izler: görünmez widget geç
 * yüklenebildiği için kısa aralıkla yoklanır, token gelene dek gönderim
 * kilitlenir, token tek kullanımlıktır ve başarısız denemede sıfırlanır.
 *
 * FARK: bu araçta Turnstile rota tarafında KOŞULSUZ zorunlu (`geoScanSchema`,
 * spec §5) — ADR-028 bayrağı bu rotayı kapsamaz. İstemci yine de bayrağa
 * bakar: site anahtarı build'de yoksa widget render edilmez (geliştirme
 * ortamı), üretimde anahtar `wrangler secret` ile girilidir.
 *
 * SAYFA GEÇİŞİ YOK (Görev 11): başarıda `GeoResult` AYNI sayfada basılır —
 * `router.push` ile paylaşım rotasına gitmek bir tam sayfa geçişi anlamına
 * gelirdi ve o an sonucu zaten elimizdeki veriyi atıp sunucudan yeniden
 * isteyen gereksiz bir round-trip olurdu. Onun yerine URL çubuğu
 * `history.replaceState` ile paylaşım linkine güncellenir (spec §4 adım 3);
 * paylaşım rotası (`sonuc/[id]/page.tsx`) yalnız doğrudan ziyaret/paylaşım
 * durumunda sunucuda `getScan` ile aynı sonucu üretir.
 */

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const TURNSTILE_POLL_MS = 300;
const TURNSTILE_POLL_LIMIT = 60;
const TURNSTILE_TOKEN_TIMEOUT_MS = 25_000;

/** Kararlı TR slug — içerik kaydının kimliği (`tools.ts`, `page.tsx` ile aynı). */
const SLUG = "geo-gorunurluk-denetleyicisi";

/** Paylaşım linkine giden statik iç yol (`routing.ts` — `sonuc ↔ result`). */
const RESULT_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]";

type TurnstileApi = {
  render: (
    el: Element,
    opts: {
      sitekey: string | undefined;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string | undefined;
  reset?: (widgetId?: string) => void;
};

function turnstileApi(): TurnstileApi | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

export type GeoScanFormLabels = {
  urlLabel: string;
  urlPlaceholder: string;
  submit: string;
  submitting: string;
  turnstileLoading: string;
  turnstileUnavailable: string;
  /** "Sonucu paylaş" düğmesi — varsayılan durum. */
  share: string;
  /** Kopyalama başarılı olduğunda düğmenin geçici metni. */
  shareCopied: string;
  errors: {
    invalidUrl: string;
    rateLimited: string;
    unreachable: string;
    turnstile: string;
    generic: string;
  };
};

/** Rota `{ error }` sözlüğü → istemci mesaj anahtarı. */
type ScanErrorKind = keyof GeoScanFormLabels["errors"];

const ERROR_MAP: Record<string, ScanErrorKind> = {
  "invalid-url": "invalidUrl",
  "rate-limited": "rateLimited",
  "target-unreachable": "unreachable",
  "turnstile-failed": "turnstile",
  misconfigured: "generic",
};

export function GeoScanForm({
  locale,
  labels,
  signals,
}: {
  locale: "tr" | "en";
  labels: GeoScanFormLabels;
  /** Kalem tanıtım kartları — sonuç rozetlerinin başlığı için (`GeoResult`). */
  signals: ToolSignal[];
}) {
  const uid = useId();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "error" | "result">("idle");
  const [errorKind, setErrorKind] = useState<ScanErrorKind>("generic");
  const [scan, setScan] = useState<{ id: string; result: GeoScanResult } | null>(null);
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<
    "pending" | "ready" | "unavailable"
  >(TURNSTILE_ENABLED ? "pending" : "ready");

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;
    let attempts = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = (): void => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const tryRender = (): boolean => {
      if (renderedRef.current) return true;
      const api = turnstileApi();
      const el = turnstileRef.current;
      if (!api || !el) return false;
      renderedRef.current = true;
      widgetIdRef.current = api.render(el, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileStatus("ready");
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setTurnstileStatus("pending");
          try {
            turnstileApi()?.reset?.(widgetIdRef.current);
          } catch {
            /* widget kaldırılmış olabilir */
          }
        },
        "error-callback": () => {
          setTurnstileToken("");
          setTurnstileStatus("unavailable");
        },
      });
      return true;
    };

    if (!tryRender()) {
      timer = setInterval(() => {
        attempts += 1;
        if (tryRender()) {
          stop();
          return;
        }
        if (attempts >= TURNSTILE_POLL_LIMIT) {
          stop();
          setTurnstileStatus("unavailable");
        }
      }, TURNSTILE_POLL_MS);
    }

    return stop;
  }, []);

  // Bekçi: token `pending`de takılırsa ziyaretçiyi süresiz bekletme.
  useEffect(() => {
    if (turnstileStatus !== "pending") return;
    const id = setTimeout(() => {
      setTurnstileStatus((cur) => (cur === "pending" ? "unavailable" : cur));
    }, TURNSTILE_TOKEN_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [turnstileStatus]);

  function clearTurnstileToken(): void {
    if (!TURNSTILE_ENABLED) return;
    setTurnstileToken("");
    setTurnstileStatus("pending");
    try {
      turnstileApi()?.reset?.(widgetIdRef.current);
    } catch {
      /* reset yoksa yeni token beklenir */
    }
  }

  /** Paylaşım linkinin iç yolu — locale'e göre çevrilmiş tam segment zinciri. */
  function resultPathname(id: string): string {
    return getPathname({
      href: { pathname: RESULT_PATHNAME, params: { id } },
      locale,
    });
  }

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    // Tarama başlatıldı — sonuç beklenmeden atılır (spec §4 adım 4): huninin
    // giriş adımı, `tool_scan_completed`in payda kırılımına baz oluşturur.
    track({ name: "tool_used", properties: { slug: SLUG, locale } });
    try {
      const res = await fetch("/api/tools/geo-scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          ...(TURNSTILE_ENABLED ? { turnstileToken } : { turnstileToken: "" }),
        }),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => null)) as {
          id?: string;
          result?: GeoScanResult;
        } | null;
        if (!body?.id || !body.result) {
          setErrorKind("generic");
          setState("error");
          clearTurnstileToken();
          return;
        }
        track({
          name: "tool_scan_completed",
          properties: { slug: SLUG, band: body.result.band, locale },
        });
        setScan({ id: body.id, result: body.result });
        setState("result");
        window.history.replaceState(null, "", resultPathname(body.id));
        return;
      }
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setErrorKind(ERROR_MAP[body?.error ?? ""] ?? "generic");
      setState("error");
      clearTurnstileToken();
    } catch {
      setErrorKind("generic");
      setState("error");
      clearTurnstileToken();
    }
  }

  async function onShare(): Promise<void> {
    if (!scan) return;
    const shareUrl = `${window.location.origin}${resultPathname(scan.id)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* pano erişimi reddedilmiş olabilir — sessizce düş, düğme tekrar denenebilir */
    }
  }

  if (state === "result" && scan) {
    return (
      <div>
        <GeoResult result={scan.result} signals={signals} locale={locale} />
        {/* `aria-live` sarmalayıcının kendisinde: düğmenin metni değiştiğinde
            ekran okuyucu bunu anons eder — metni ikinci bir gizli düğümde
            tekrarlamaya gerek yok (`role="status"` içeriği düğmeyle aynı
            olurdu, çift anons). */}
        <div className="mt-8 flex items-center gap-4" aria-live="polite">
          <Button type="button" variant="secondary" onClick={onShare}>
            {copied ? labels.shareCopied : labels.share}
          </Button>
        </div>
      </div>
    );
  }

  const urlId = `${uid}-url`;
  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;

  let hint: string | null = null;
  if (!submitting && TURNSTILE_ENABLED) {
    if (turnstileStatus === "unavailable") hint = labels.turnstileUnavailable;
    else if (!turnstileToken) hint = labels.turnstileLoading;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor={urlId} className="typography-label text-ink-700">
          {labels.urlLabel}
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id={urlId}
            type="url"
            inputMode="url"
            autoComplete="url"
            required
            placeholder={labels.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={state === "error" ? true : undefined}
            className="flex-1"
          />
          <Button
            type="submit"
            size="lg"
            disabled={submitting || tokenBlocking || url.trim().length === 0}
            className="shrink-0"
          >
            {submitting ? labels.submitting : labels.submit}
          </Button>
        </div>
      </div>

      {TURNSTILE_ENABLED ? (
        <div ref={turnstileRef} className="cf-turnstile" />
      ) : null}

      <div role="status" aria-live="polite">
        {hint ? (
          <p className="typography-caption text-ink-500">{hint}</p>
        ) : null}
      </div>

      {state === "error" ? (
        <p role="alert" className="typography-caption text-danger-700">
          {labels.errors[errorKind]}
        </p>
      ) : null}
    </form>
  );
}
