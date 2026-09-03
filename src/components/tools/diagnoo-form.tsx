"use client";

import { useId, useRef, useState } from "react";
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
 *
 * TURNSTILE ADR-028 DESENİNE TAŞINDI (Görev 17.1): Turnstile artık ADR-028
 * bayrağına (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_ENABLED`) göre
 * KOŞULLU — bayrak kapalıyken (launch konfigürasyonu) widget hiç render
 * edilmez, YERİNE `GeoScanForm`/`ContactForm` ile BİREBİR aynı görünmez bal
 * küpü (`website`) + süre tuzağı (`elapsedMs`) gönderilir; rota tarafında
 * `spamSignal` bunları değerlendirir. Bayrak kapalıyken "Turnstile
 * hazırlanıyor" gibi bir ipucu GÖSTERİLMEZ — `useTurnstileToken` zaten
 * `enabled: false` iken `error`i hep `null` döndürür (use-turnstile.ts).
 */

const COPY = {
  tr: {
    urlLabel: "Mağazanızın adresi",
    urlPlaceholder: "https://magazaniz.com.tr",
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
      // Lansman düzeltme dalgası madde A: motor anahtarları (Gemini/
      // Firecrawl) üretimde henüz tanımlı değil — Burak'ın kararı "kullanıma
      // sonra açarız". Suç ziyaretçinin sitesine atılmaz, tarih vaat edilmez.
      notConfigured:
        "Diagnoo'nun tarama motoru henüz kullanıma açılmadı. Aracı yakında devreye alıyoruz.",
      generic: "Tarama başlatılamadı, birazdan tekrar deneyin.",
    },
  },
  en: {
    urlLabel: "Your store's address",
    urlPlaceholder: "https://yourstore.com",
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
      notConfigured:
        "Diagnoo's scanning engine is not switched on yet. We will bring the tool online shortly.",
      generic: "The scan could not be started. Try again shortly.",
    },
  },
} as const;

type ErrorKind = keyof (typeof COPY)["tr"]["errors"];

// `misconfigured` araç tarafı config eksikliğidir, kullanıcının hatası değil —
// nötr "yanıt veremiyor" cümlesine düşer. `not-configured` (Lansman düzeltme
// dalgası madde A) AYRI bir durum: araç arızalı değil, kullanıma HENÜZ
// açılmadı — kendi dürüst cümlesine düşer, "unavailable"a karıştırılmaz.
const ERROR_MAP: Record<string, ErrorKind> = {
  invalid: "invalid",
  "turnstile-failed": "turnstile",
  "rate-limited": "rateLimited",
  misconfigured: "unavailable",
  "not-configured": "notConfigured",
};

export function DiagnooForm({
  locale,
  inputHelp,
  onStarted,
}: {
  locale: "tr" | "en";
  /**
   * Giriş alanının yardım satırı — `tools.ts`teki `inputHelp` kaydından gelir
   * (GEO'nun `geo-tool.tsx`te izlediği desenin aynısı). Kapsam ve sınır
   * cümlesi bileşene kopyalanmaz: araç sayfasının anlattığıyla aynı kaynaktan
   * okunur, ikisi ayrışamaz.
   */
  inputHelp: string;
  /** 202 yanıtındaki teşhis kimliği; yoklamayı çağıran başlatır. */
  onStarted: (id: string) => void;
}) {
  const uid = useId();
  const c = COPY[locale];

  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  /** Bal küpü + süre tuzağı (ADR-028, Görev 17.1). mountedAt: form ekrana
   * geldiği an — `ContactForm`/`GeoScanForm` ile BİREBİR aynı desen. */
  const [website, setWebsite] = useState("");
  const mountedAtRef = useRef<number>(Date.now());

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
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
          ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
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
  const errorId = `${uid}-url-error`;
  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;
  // Tek alanlı form — ama `aria-invalid` yine de yalnız "invalid" kodunda
  // basılır. Diğer hata türleri (rate limit, turnstile, sunucu arızası)
  // alan HATASI değil; ziyaretçinin doğru yazdığı adresi hatalı gösterirdi.
  const urlInvalid = state === "error" && errorKind === "invalid";

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
            aria-invalid={urlInvalid ? true : undefined}
            aria-describedby={urlInvalid ? `${hintId} ${errorId}` : hintId}
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
        {/* `ink-600`, `ink-500` değil (Faz 2 Görev 3): form artık hero
            akışında, yani blobun sıcak gövdesinin üstünde duruyor. Ölçümde
            `ink-500` krem üstünde 4.34, blob üstünde 2.89'a iniyordu
            (2026-09-02, docs/04 §12.10) — GEO'nun `inputHelp` satırı da aynı
            gerekçeyle `ink-600`. */}
        <p id={hintId} className="typography-caption text-ink-600 mt-2">
          {inputHelp}
        </p>
      </div>

      {/* Bal küpü: görsel olarak gizli, klavye/okuyucu erişiminden çıkarılmış
          — `ContactForm`/`GeoScanForm`'daki desenin birebir aynısı (metin
          bilerek lokalize edilmez, hiçbir kullanıcıya hiç görünmez). İnsan
          dolduramaz; dolduran bot rota tarafında sahte başarıya düşer. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Web sitesi (boş bırak)
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}

      <div role="status" aria-live="polite">
        {hint ? <p className="typography-caption text-ink-500">{hint}</p> : null}
      </div>

      {state === "error" ? (
        <p id={errorId} role="alert" className="typography-caption text-danger-700">
          {c.errors[errorKind]}
        </p>
      ) : null}
    </form>
  );
}
