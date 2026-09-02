"use client";

import * as React from "react";
import { TOOL_UI, type ScanErrorKind } from "@/components/tools/copy";
import { MIN_FILL_MS } from "@/lib/security/anti-spam";
import type { Locale } from "@/lib/content/types";

/**
 * Giriş çubuğu (spec §3): sayfanın en büyük öğesi. Anti-spam sözleşmesi
 * `ContactForm` ile birebir (ADR-028): bayrak açıksa Turnstile, her zaman
 * bal küpü + süre tuzağı. Yenilik: süre tuzağına takılacak hızlı gönderim
 * SUNUCUYA GİTMEDEN çubukta bekletilir (kalan süre `aria-busy` içinde
 * geçer), sonra gerçek `elapsedMs` ile gönderilir — tuzak bozulmaz, hızlı
 * insan "tamamlanamadı" görmez.
 */
export type ScanSubmission = {
  url: string;
  website: string;
  elapsedMs: number;
  turnstileToken?: string;
};

export function normalizeUrlInput(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === "") return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Turnstile sabitleri ve turnstileApi() — geo-scan-form.tsx'ten birebir.
// O dosya Görev 10'da silinene dek burada bilinçli olarak yinelenir.
const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const TURNSTILE_POLL_MS = 300;
const TURNSTILE_POLL_LIMIT = 60;
const TURNSTILE_TOKEN_TIMEOUT_MS = 25_000;

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

export function ScanBar({
  locale,
  value,
  onChange,
  onSubmit,
  busy,
  error,
}: {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (submission: ScanSubmission) => void;
  busy: boolean;
  error: ScanErrorKind | null;
}) {
  const c = TOOL_UI[locale];
  const uid = React.useId();
  const [localError, setLocalError] = React.useState<"emptyUrl" | null>(null);
  const [waiting, setWaiting] = React.useState(false);
  const [website, setWebsite] = React.useState("");
  const mountedAtRef = React.useRef<number>(Date.now());
  const waitTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [turnstileToken, setTurnstileToken] = React.useState("");
  const [turnstileStatus, setTurnstileStatus] = React.useState<
    "pending" | "ready" | "unavailable"
  >(TURNSTILE_ENABLED ? "pending" : "ready");
  const turnstileRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | undefined>(undefined);
  const renderedRef = React.useRef(false);

  React.useEffect(() => {
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
  React.useEffect(() => {
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

  React.useEffect(() => () => {
    if (waitTimer.current !== undefined) clearTimeout(waitTimer.current);
  }, []);

  // Sunucu bir hata bildirdiğinde (`error` prop'u dolduğunda) kullanılmış
  // token geçersizleşmiş sayılır — `geo-scan-form.tsx`'teki her başarısız
  // dal `clearTurnstileToken()` çağırırdı; burada eşdeğeri tek noktadan.
  React.useEffect(() => {
    if (error) clearTurnstileToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  function fire(): void {
    onSubmit({
      url: normalizeUrlInput(value),
      website,
      elapsedMs: Date.now() - mountedAtRef.current,
      ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
    });
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (busy || waiting) return;
    if (normalizeUrlInput(value) === "") {
      setLocalError("emptyUrl");
      return;
    }
    setLocalError(null);
    const remaining = MIN_FILL_MS - (Date.now() - mountedAtRef.current);
    if (remaining > 0) {
      setWaiting(true);
      waitTimer.current = setTimeout(() => {
        setWaiting(false);
        fire();
      }, remaining);
      return;
    }
    fire();
  }

  const inputId = `${uid}-url`;
  const isBusy = busy || waiting;
  // Spec §3: "kalan süreyi 'Taranıyor…' içinde bekler, sonra yollar" — süre
  // tuzağının görünmez beklemesi de düğmeyi gerçek ağ isteğiyle aynı şekilde
  // "Taranıyor…" gösterir; `aria-busy`/`disabled` de aynı birleşik durumu
  // (`isBusy`) izler (Ruling R5).
  const submitLabel = isBusy ? c.submitting : c.submit;
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;
  const message = localError ? c.emptyUrl : error ? c.errors[error] : null;
  let hint: string | null = null;
  if (!isBusy && TURNSTILE_ENABLED) {
    if (turnstileStatus === "unavailable") hint = c.turnstileUnavailable;
    else if (!turnstileToken) hint = c.turnstileLoading;
  }

  return (
    <form onSubmit={handleSubmit} noValidate name="scan-bar" className="text-left">
      <label htmlFor={inputId} className="sr-only">{c.urlLabel}</label>
      <div className="scan-bar" data-invalid={message ? "true" : undefined}>
        <input
          id={inputId}
          className="scan-bar-input"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder={c.urlPlaceholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); if (localError) setLocalError(null); }}
          disabled={isBusy}
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? `${uid}-msg` : undefined}
        />
        <button
          type="submit"
          className="btn btn-primary scan-bar-submit"
          aria-label={submitLabel}
          aria-busy={isBusy ? "true" : undefined}
          disabled={isBusy || tokenBlocking}
        >
          <span className="scan-bar-submit-label">{submitLabel}</span>
          <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
        </button>
      </div>

      {/* Bal küpü — ContactForm ile birebir; kullanıcıya hiç görünmez. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Web sitesi (boş bırak)
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}

      <div role="status" aria-live="polite">
        {hint ? <p className="typography-caption text-ink-500 mt-3">{hint}</p> : null}
      </div>

      {message ? (
        <p id={`${uid}-msg`} role="alert" className="typography-body-sm text-danger-700 mt-3 flex items-start gap-2">
          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 4.5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{message}</span>
        </p>
      ) : null}
    </form>
  );
}
