"use client";

import * as React from "react";
import { FindingsList, orderForFixList } from "@/components/tools/findings-list";
import { REPORT_ERROR_MAP, TOOL_UI, fill, type ReportErrorKind } from "@/components/tools/copy";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics/ga";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoBand, GeoCheckResult } from "@/lib/tools/geo/types";

const SLUG = "geo-gorunurluk-denetleyicisi";

// Turnstile sabitleri ve turnstileApi() — scan-bar.tsx'teki eşdeğeriyle
// birebir. İki dosya arasında bilinçli olarak yinelenir (paylaşılan bir
// Turnstile modülü bu görev kapsamı dışında).
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

/**
 * Kilit kartı (spec §6): solda değer (kilitli önizleme — bulgu SAYILARI,
 * metin yok), sağda e-posta + KVKK formu. 200 yanıtındaki `checks` (tam
 * findings) ile `FindingsList` açılır; başlangıç `checks` prop'u public
 * yüzeydir ve findings taşımaz (Görev 12b).
 */
export function ReportGate({
  scanId,
  band,
  locale,
  checks,
  signals,
}: {
  scanId: string;
  band: GeoBand;
  locale: Locale;
  checks: GeoCheckResult[];
  signals: ToolSignal[];
}) {
  const c = TOOL_UI[locale];
  const uid = React.useId();
  const headingId = `${uid}-fix-list-heading`;
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [state, setState] = React.useState<"idle" | "submitting" | "error" | "unlocked">("idle");
  const [errorKind, setErrorKind] = React.useState<ReportErrorKind | "consent">("generic");
  const [unlocked, setUnlocked] = React.useState<GeoCheckResult[]>(checks);
  const [website, setWebsite] = React.useState("");
  const mountedAtRef = React.useRef<number>(Date.now());

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

  React.useEffect(() => {
    if (turnstileStatus !== "pending") return;
    const id = setTimeout(() => {
      setTurnstileStatus((cur) => (cur === "pending" ? "unavailable" : cur));
    }, TURNSTILE_TOKEN_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [turnstileStatus]);

  // Kilit açılınca odak düzeltme listesi başlığına taşınır (spec §4) — kart
  // görsel olarak yeniden akıyor, klavye/ekran okuyucu kullanıcısı formda
  // asılı kalmasın.
  React.useEffect(() => {
    if (state !== "unlocked") return;
    document.getElementById(headingId)?.focus();
  }, [state, headingId]);

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

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (state === "submitting") return;
    if (!consent) {
      setErrorKind("consent");
      setState("error");
      return;
    }
    setState("submitting");
    try {
      const res = await fetch("/api/tools/geo-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scanId,
          email: email.trim(),
          kvkkConsent: true,
          locale,
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
          ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
        }),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => null)) as { ok?: boolean; checks?: GeoCheckResult[] } | null;
        if (body?.checks) setUnlocked(body.checks);
        track({ name: "tool_report_requested", properties: { slug: SLUG, band, locale } });
        setState("unlocked");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setErrorKind(REPORT_ERROR_MAP[body?.error ?? ""] ?? "generic");
      setState("error");
      clearTurnstileToken();
    } catch {
      setErrorKind("generic");
      setState("error");
      clearTurnstileToken();
    }
  }

  // Kalıcı canlı bölge (spec §4): kilit açıldığında `gate.unlockedLede`
  // duyurulur; kilitliyken boş — odak taşıması zaten metnin görünür halini
  // (`FindingsList`teki `<p>`) ekrana getirir, anons burada yalnız ekran
  // okuyucu içindir.
  const statusText = state === "unlocked" ? c.gate.unlockedLede : "";

  if (state === "unlocked") {
    return (
      <>
        <p role="status" aria-live="polite" className="sr-only">{statusText}</p>
        <section aria-label={c.gate.title} className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 mt-8">
          <FindingsList
            checks={unlocked}
            signals={signals}
            locale={locale}
            headingId={headingId}
            ctaSlot={<PopupCTAButton source="tool-geo-report" className="btn btn-primary">{c.gate.ctaButton}</PopupCTAButton>}
          />
        </section>
      </>
    );
  }

  const { todo, passed } = orderForFixList(checks, signals);
  const passedCount = passed.length;
  const emailId = `${uid}-email`;
  const kvkkId = `${uid}-kvkk`;
  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;
  const message = state === "error" ? (errorKind === "consent" ? c.gate.consentRequired : c.gate.errors[errorKind]) : null;
  let hint: string | null = null;
  if (!submitting && TURNSTILE_ENABLED) {
    if (turnstileStatus === "unavailable") hint = c.turnstileUnavailable;
    else if (!turnstileToken) hint = c.turnstileLoading;
  }

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">{statusText}</p>
      <section aria-label={c.gate.title} className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 mt-8 grid gap-8 md:grid-cols-2 text-left">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="typography-h3 text-ink-900">{c.gate.title}</h3>
            <span className="typography-label inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-2.5 py-1 uppercase tracking-widest text-ink-500">
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor" /><path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
              {c.gate.locked}
            </span>
          </div>
          <ul className="mt-6 flex flex-col gap-4">
            {todo.map((check) => {
              const n = check.findingsCount ?? check.findings.length;
              if (n === 0) return null;
              return (
                <li key={check.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="typography-body-md text-ink-900">{signals.find((s) => s.id === check.id)?.title[locale] ?? check.id}</span>
                    <span className="mono text-ink-500">{fill(c.gate.findingsCount, { n })}</span>
                  </div>
                  <div className="gate-skeleton mt-2" style={{ width: `${Math.min(100, 55 + n * 15)}%` }} />
                </li>
              );
            })}
            {passedCount > 0 ? (
              <li>
                <span className="typography-body-sm text-ink-500">{fill(c.gate.passedNotes, { n: passedCount })}</span>
                <div className="gate-skeleton mt-2" style={{ width: "40%" }} />
              </li>
            ) : null}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <h3 className="typography-h3 text-ink-900">{c.gate.formTitle}</h3>
            <p className="typography-body-md text-ink-700 mt-2">{c.gate.formLede}</p>
          </div>
          <div>
            <label htmlFor={emailId} className="typography-label text-ink-700">{c.gate.emailLabel}</label>
            <Input
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder={c.gate.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={state === "error" ? true : undefined}
              className="mt-2"
            />
          </div>
          <label htmlFor={kvkkId} className="flex items-start gap-3 typography-body-sm text-ink-700 cursor-pointer py-2">
            <input id={kvkkId} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-required className="h-5 w-5 mt-0.5 shrink-0 accent-teal-700 cursor-pointer" />
            <span>
              {c.gate.kvkkPrefix}{" "}
              <a href={c.gate.kvkkHref} onClick={(e) => e.stopPropagation()} className="underline decoration-teal-300 hover:decoration-teal-500">{c.gate.kvkkLink}</a>
            </span>
          </label>
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label>
              Web sitesi (boş bırak)
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>
          {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}
          <button type="submit" className="btn btn-primary" aria-busy={submitting ? "true" : undefined} disabled={submitting || tokenBlocking || email.trim().length === 0}>
            {submitting ? c.gate.submitting : c.gate.submit}
          </button>
          <div role="status" aria-live="polite">{hint ? <p className="typography-caption text-ink-500">{hint}</p> : null}</div>
          {message ? <p role="alert" className="typography-body-sm text-danger-700">{message}</p> : null}
        </form>
      </section>
    </>
  );
}
