"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { track } from "@/lib/analytics/ga";
import type { ToolSignal } from "@/lib/content/tools";
import type { GeoBand, GeoCheckResult, GeoCheckStatus } from "@/lib/tools/geo/types";

/**
 * GEO detaylı rapor formu — `POST /api/tools/geo-report` (Görev 12, spec §3).
 *
 * MOFU lead kapısı: ücretsiz ekran (`GeoResult`) skoru gösterir, ayrıntılı
 * `findings` gizlidir. Ziyaretçi e-posta + KVKK rızası verince (a) rapor
 * e-postayla gönderilir, (b) AYNI sayfada `findings` listesi açılır — çift
 * teslim (e-posta arşivi + anında ekran).
 *
 * Turnstile deseni `GeoScanForm` ile birebir: görünmez widget geç yüklenebildiği
 * için yoklanır, token gelene dek gönderim kilitli, token tek kullanımlık ve
 * başarısız denemede sıfırlanır. Rota tarafında Turnstile KOŞULSUZ zorunlu
 * (`geoReportSchema`) — ADR-028 bayrağı bu rotayı kapsamaz.
 */

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const TURNSTILE_POLL_MS = 300;
const TURNSTILE_POLL_LIMIT = 60;
const TURNSTILE_TOKEN_TIMEOUT_MS = 25_000;

const SLUG = "geo-gorunurluk-denetleyicisi";

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

const COPY = {
  tr: {
    heading: "Ayrıntılı raporu e-postayla alın",
    lede: "Kalem kalem bulgular, öncelikli aksiyonlar ve rehberler e-postanıza gelsin; sonuçlar hemen aşağıda da açılır.",
    emailLabel: "E-posta adresi",
    emailPlaceholder: "siz@sirketiniz.com.tr",
    submit: "Raporu gönder",
    submitting: "Gönderiliyor…",
    kvkkPrefix: "KVKK kapsamında verilerimin işlenmesini kabul ediyorum.",
    kvkkLink: "Aydınlatma metni",
    kvkkHref: "/tr/gizlilik-kvkk",
    turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
    turnstileUnavailable:
      "Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.",
    consentRequired: "Devam etmek için KVKK onayını işaretleyin.",
    unlockedTitle: "Ayrıntılı bulgular",
    unlockedLede: "Raporun bir kopyası e-postanıza gönderildi.",
    ctaLede: "Bu bulguları uzmanımızla birlikte önceliklendirin.",
    ctaButton: "Görüşme planlayın",
    errors: {
      rateLimited: "Çok fazla talep gönderildi. Bir süre sonra tekrar deneyin.",
      notFound: "Bu tarama bulunamadı. Yeni bir tarama başlatıp tekrar deneyin.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      generic: "Bir sorun oluştu, tekrar deneyin.",
    },
  },
  en: {
    heading: "Get the detailed report by email",
    lede: "Item-by-item findings, priority actions and guides land in your inbox; the results also unlock right below.",
    emailLabel: "Email address",
    emailPlaceholder: "you@yourcompany.com",
    submit: "Send the report",
    submitting: "Sending…",
    kvkkPrefix: "I consent to processing my data per KVKK.",
    kvkkLink: "Privacy notice",
    kvkkHref: "/en/privacy",
    turnstileLoading: "Loading the security check…",
    turnstileUnavailable:
      "The security check did not load. Refresh the page and try again.",
    consentRequired: "Tick the KVKK consent to continue.",
    unlockedTitle: "Detailed findings",
    unlockedLede: "A copy of the report has been sent to your email.",
    ctaLede: "Prioritise these findings with one of our specialists.",
    ctaButton: "Book a call",
    errors: {
      rateLimited: "Too many requests for now. Please try again later.",
      notFound: "This scan was not found. Start a new scan and try again.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      generic: "Something went wrong, please retry.",
    },
  },
} as const;

const STATUS_LABELS: Record<GeoCheckStatus, Record<"tr" | "en", string>> = {
  pass: { tr: "Geçti", en: "Pass" },
  partial: { tr: "Kısmen", en: "Partial" },
  fail: { tr: "Kaldı", en: "Fail" },
};

const STATUS_TONE: Record<GeoCheckStatus, string> = {
  pass: "text-success-700",
  partial: "text-warning-700",
  fail: "text-danger-700",
};

type ErrorKind = keyof (typeof COPY)["tr"]["errors"];

const ERROR_MAP: Record<string, ErrorKind> = {
  "rate-limited": "rateLimited",
  "not-found": "notFound",
  "turnstile-failed": "turnstile",
  invalid: "generic",
  misconfigured: "generic",
  "mail-failed": "generic",
};

export function GeoReportForm({
  scanId,
  band,
  locale,
  checks,
  signals,
}: {
  scanId: string;
  band: GeoBand;
  locale: "tr" | "en";
  checks: GeoCheckResult[];
  signals: ToolSignal[];
}) {
  const uid = useId();
  const c = COPY[locale];

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "submitting" | "error" | "unlocked">(
    "idle",
  );
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");

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

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (state === "submitting") return;
    if (!consent) {
      setErrorKind("generic");
      // Rıza kapısı istemci tarafında da: rota `z.literal(true)` ile zaten
      // zorunlu kılıyor ama gönderimden önce ziyaretçiye net geri bildirim.
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
          turnstileToken: TURNSTILE_ENABLED ? turnstileToken : "",
        }),
      });
      if (res.ok) {
        track({
          name: "tool_report_requested",
          properties: { slug: SLUG, band, locale },
        });
        setState("unlocked");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setErrorKind(ERROR_MAP[body?.error ?? ""] ?? "generic");
      setState("error");
      clearTurnstileToken();
    } catch {
      setErrorKind("generic");
      setState("error");
      clearTurnstileToken();
    }
  }

  if (state === "unlocked") {
    return (
      <div>
        <h3 className="typography-h3 text-ink-900">{c.unlockedTitle}</h3>
        <p className="typography-body-md text-ink-700 mt-2">{c.unlockedLede}</p>

        <ul className="mt-8 space-y-6">
          {checks.map((check) => {
            const signal = signals.find((s) => s.id === check.id);
            return (
              <li key={check.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="typography-label text-ink-900">
                    {signal ? signal.title[locale] : check.id}
                  </h4>
                  <span
                    className={`typography-label shrink-0 uppercase tracking-widest ${STATUS_TONE[check.status]}`}
                  >
                    {STATUS_LABELS[check.status][locale]}
                  </span>
                </div>
                {check.findings.length > 0 ? (
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {check.findings.map((finding, i) => (
                      <li key={i} className="typography-body-sm text-ink-700">
                        {finding[locale]}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="v2-surface border border-surface-2 rounded-2xl p-6 mt-10 flex flex-col items-start gap-4">
          <p className="typography-body-md text-ink-700">{c.ctaLede}</p>
          <PopupCTAButton source="tool-geo-report" className="btn btn-primary">
            {c.ctaButton}
          </PopupCTAButton>
        </div>
      </div>
    );
  }

  const emailId = `${uid}-email`;
  const kvkkId = `${uid}-kvkk`;
  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;

  let hint: string | null = null;
  if (!submitting && TURNSTILE_ENABLED) {
    if (turnstileStatus === "unavailable") hint = c.turnstileUnavailable;
    else if (!turnstileToken) hint = c.turnstileLoading;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <h3 className="typography-h3 text-ink-900">{c.heading}</h3>
        <p className="typography-body-md text-ink-700 mt-2">{c.lede}</p>
      </div>

      <div>
        <label htmlFor={emailId} className="typography-label text-ink-700">
          {c.emailLabel}
        </label>
        <Input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={c.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "error" ? true : undefined}
          className="mt-2"
        />
      </div>

      <label
        htmlFor={kvkkId}
        className="flex items-start gap-3 typography-body-sm text-ink-700 cursor-pointer py-3"
      >
        <input
          id={kvkkId}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-required
          className="h-5 w-5 mt-0.5 shrink-0 accent-teal-700 cursor-pointer"
        />
        <span>
          {c.kvkkPrefix}{" "}
          <a
            href={c.kvkkHref}
            onClick={(e) => e.stopPropagation()}
            className="underline decoration-teal-300 hover:decoration-teal-500"
          >
            {c.kvkkLink}
          </a>
        </span>
      </label>

      {TURNSTILE_ENABLED ? (
        <div ref={turnstileRef} className="cf-turnstile" />
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={submitting || tokenBlocking || email.trim().length === 0 || !consent}
      >
        {submitting ? c.submitting : c.submit}
      </Button>

      <div role="status" aria-live="polite">
        {hint ? <p className="typography-caption text-ink-500">{hint}</p> : null}
      </div>

      {state === "error" ? (
        <p role="alert" className="typography-caption text-danger-700">
          {consent ? c.errors[errorKind] : c.consentRequired}
        </p>
      ) : null}
    </form>
  );
}
