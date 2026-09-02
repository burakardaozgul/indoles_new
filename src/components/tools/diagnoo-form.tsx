"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics/ga";
import { TURNSTILE_ENABLED, useTurnstileToken } from "@/components/tools/use-turnstile";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";

/**
 * Teşhis başlatma formu — `POST /api/tools/diagnoo-start` (spec §9).
 *
 * `GeoScanForm` deseninin aynısı: görünmez Turnstile, token gelene dek kilitli
 * gönderim, rota hata kodunun kullanıcı cümlesine çözülmesi. Fark, yanıtın
 * SONUÇ değil KİMLİK taşıması — teşhis Workflows'ta arka planda koşar, form
 * kimliği yukarı verir ve yoklamayı `DiagnooTool` üstlenir.
 *
 * `tool_used` yanıt BEKLENMEDEN atılır (GEO ile aynı gerekçe): huninin giriş
 * adımı, tamamlanma oranının paydası.
 */

const COPY = {
  tr: {
    urlLabel: "Mağazanızın adresi",
    urlPlaceholder: "https://magazaniz.com.tr",
    urlHint: "Ana sayfanın adresi yeterli; kategori, ürün ve ödeme sayfalarını araç kendisi bulur.",
    submit: "Taramayı başlat",
    submitting: "Başlatılıyor…",
    turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
    turnstileUnavailable:
      "Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.",
    errors: {
      invalid: "Geçerli bir site adresi girin.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      rateLimited: "Günlük tarama sınırına ulaşıldı. Yarın tekrar deneyin.",
      unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
      generic: "Tarama başlatılamadı, birazdan tekrar deneyin.",
    },
  },
  en: {
    urlLabel: "Your store's address",
    urlPlaceholder: "https://yourstore.com",
    urlHint:
      "The home page address is enough; the tool finds the category, product and checkout pages itself.",
    submit: "Start the scan",
    submitting: "Starting…",
    turnstileLoading: "Loading the security check…",
    turnstileUnavailable:
      "The security check did not load. Refresh the page and try again.",
    errors: {
      invalid: "Enter a valid site address.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      rateLimited: "The daily scan limit has been reached. Try again tomorrow.",
      unavailable: "The tool cannot respond right now. Try again shortly.",
      generic: "The scan could not be started. Try again shortly.",
    },
  },
} as const;

type ErrorKind = keyof (typeof COPY)["tr"]["errors"];

// `misconfigured` araç tarafı config eksikliğidir, kullanıcının hatası değil —
// nötr "yanıt veremiyor" cümlesine düşer.
const ERROR_MAP: Record<string, ErrorKind> = {
  invalid: "invalid",
  "turnstile-failed": "turnstile",
  "rate-limited": "rateLimited",
  misconfigured: "unavailable",
};

export function DiagnooForm({
  locale,
  onStarted,
}: {
  locale: "tr" | "en";
  /** 202 yanıtındaki teşhis kimliği; yoklamayı çağıran başlatır. */
  onStarted: (id: string) => void;
}) {
  const uid = useId();
  const c = COPY[locale];

  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");

  const {
    token: turnstileToken,
    containerRef: turnstileRef,
    reset: clearTurnstileToken,
    error: turnstileError,
  } = useTurnstileToken({ enabled: TURNSTILE_ENABLED });

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    track({ name: "tool_used", properties: { slug: DIAGNOO_SLUG, locale } });

    try {
      const res = await fetch("/api/tools/diagnoo-start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          locale,
          turnstileToken: TURNSTILE_ENABLED ? turnstileToken : "",
        }),
      });

      if (res.ok) {
        const body = (await res.json().catch(() => null)) as { id?: string } | null;
        if (!body?.id) {
          setErrorKind("generic");
          setState("error");
          clearTurnstileToken();
          return;
        }
        // `reused: true` de aynı yoldan geçer — o kayıt zaten `completed`,
        // ilk yoklama anında sonucu döndürür.
        onStarted(body.id);
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

  const urlId = `${uid}-url`;
  const hintId = `${uid}-url-hint`;
  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;

  let hint: string | null = null;
  if (!submitting && turnstileError === "unavailable") hint = c.turnstileUnavailable;
  else if (!submitting && turnstileError === "loading") hint = c.turnstileLoading;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor={urlId} className="typography-label text-ink-700">
          {c.urlLabel}
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Input
            id={urlId}
            type="url"
            inputMode="url"
            autoComplete="url"
            required
            placeholder={c.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={state === "error" ? true : undefined}
            aria-describedby={hintId}
            className="flex-1"
          />
          <Button
            type="submit"
            size="lg"
            disabled={submitting || tokenBlocking || url.trim().length === 0}
            className="shrink-0"
          >
            {submitting ? c.submitting : c.submit}
          </Button>
        </div>
        <p id={hintId} className="typography-caption text-ink-500 mt-2">
          {c.urlHint}
        </p>
      </div>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}

      <div role="status" aria-live="polite">
        {hint ? <p className="typography-caption text-ink-500">{hint}</p> : null}
      </div>

      {state === "error" ? (
        <p role="alert" className="typography-caption text-danger-700">
          {c.errors[errorKind]}
        </p>
      ) : null}
    </form>
  );
}
