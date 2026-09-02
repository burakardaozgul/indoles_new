"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics/ga";
import { healthScoreBucket } from "@/lib/analytics/events";
import { localeHref } from "@/lib/i18n/locale-href";
import { TURNSTILE_ENABLED, useTurnstileToken } from "@/components/tools/use-turnstile";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";
import type { DiagnooReport, KnownMetrics } from "@/lib/tools/diagnoo/schema";

/**
 * Kilit açma formu — `POST /api/tools/diagnoo-unlock` (spec §10).
 *
 * MOFU lead kapısı: ücretsiz anlık görünüm skoru ve üç boşluğun BAŞLIĞINI
 * verir; yol haritası, TL aralıkları ve yöntem eki bu formun arkasındadır.
 * Rapor sunucudan bu isteğin 200 gövdesiyle gelir — durum uç noktası kilit
 * açılmadan tam raporu hiç taşımaz.
 *
 * OPSİYONEL METRİKLER, BOŞSA HİÇ GÖNDERİLMEZ: boş bir alanı `0` olarak
 * göndermek finansal motora "ölçülmüş sıfır" der ve projeksiyonu uydurma bir
 * rakamla yeniden hesaplatırdı. Dolu olanlar `knownMetrics`e girer, girenler
 * raporda "Ölçüldü" rozetiyle görünür.
 *
 * DÖNÜŞÜM ORANI BİRİMİ: ziyaretçi yüzde girer (%1,5), şema 0-1 oranı ister
 * (`z.number().gt(0).lt(1)`). Çevrim burada yapılır; alan etiketi birimi
 * açıkça yazar.
 */

const COPY = {
  tr: {
    heading: "Tam raporu açın",
    lede: "İş e-postanızı bırakın; yol haritası, TL aralıkları ve yöntem eki bu sayfada açılır. Raporun kopyası ekibimize de düşer.",
    emailLabel: "İş e-postanız",
    emailPlaceholder: "siz@sirketiniz.com.tr",
    companyLabel: "Şirket adı",
    companyPlaceholder: "Örnek Mağaza",
    fullNameLabel: "Ad soyad",
    fullNameHint: "İsteğe bağlı.",
    metricsSummary: "Daha isabetli bir hesap için gerçek verilerinizi girin",
    metricsLede:
      "Boş bıraktığınız alanlar sektör medyanıyla hesaplanır. Girdiğiniz her rakam raporda ölçülmüş veri olarak işaretlenir.",
    trafficLabel: "Aylık ziyaretçi sayısı",
    aovLabel: "Ortalama sepet tutarı (TL)",
    conversionLabel: "Dönüşüm oranı (%)",
    conversionHint: "Yüzde olarak yazın; örneğin 1,5.",
    adSpendLabel: "Aylık reklam bütçesi (TL)",
    kvkkPrefix: "KVKK kapsamında verilerimin işlenmesini kabul ediyorum.",
    kvkkLink: "Aydınlatma metni",
    submit: "Raporu açın",
    submitting: "Açılıyor…",
    consentRequired: "Devam etmek için KVKK onayını işaretleyin.",
    turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
    turnstileUnavailable:
      "Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.",
    errors: {
      invalid: "Girilen bilgileri kontrol edip yeniden deneyin.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      rateLimited: "Çok fazla talep gönderildi. Bir süre sonra tekrar deneyin.",
      notFound: "Bu teşhis bulunamadı. Yeni bir tarama başlatıp tekrar deneyin.",
      notReady: "Tarama henüz bitmedi. Sonuç hazır olduğunda yeniden deneyin.",
      unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
      generic: "Bir sorun oluştu, birazdan tekrar deneyin.",
    },
  },
  en: {
    heading: "Open the full report",
    lede: "Leave your work e-mail and the roadmap, the lira ranges and the methodology appendix open on this page. A copy also reaches our team.",
    emailLabel: "Your work e-mail",
    emailPlaceholder: "you@yourcompany.com",
    companyLabel: "Company name",
    companyPlaceholder: "Example Store",
    fullNameLabel: "Full name",
    fullNameHint: "Optional.",
    metricsSummary: "Enter your real figures for a more accurate calculation",
    metricsLede:
      "Fields you leave empty are calculated with sector medians. Every figure you enter is marked as measured data in the report.",
    trafficLabel: "Monthly visitors",
    aovLabel: "Average order value (TRY)",
    conversionLabel: "Conversion rate (%)",
    conversionHint: "Write it as a percentage, for example 1.5.",
    adSpendLabel: "Monthly ad budget (TRY)",
    kvkkPrefix: "I consent to processing my data per KVKK.",
    kvkkLink: "Privacy notice",
    submit: "Open the report",
    submitting: "Opening…",
    consentRequired: "Tick the KVKK consent to continue.",
    turnstileLoading: "Loading the security check…",
    turnstileUnavailable:
      "The security check did not load. Refresh the page and try again.",
    errors: {
      invalid: "Check the details you entered and try again.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      rateLimited: "Too many requests for now. Please try again later.",
      notFound: "This diagnostic was not found. Start a new scan and try again.",
      notReady: "The scan has not finished yet. Try again once the result is ready.",
      unavailable: "The tool cannot respond right now. Try again shortly.",
      generic: "Something went wrong. Try again shortly.",
    },
  },
} as const;

type ErrorKind = keyof (typeof COPY)["tr"]["errors"];

// Rotanın her hata kodu anlamlı bir cümleye çözülür. `misconfigured` ve
// `not-ready` kullanıcının hatası değil — suçlamasız, ünlemsiz karşılık.
const ERROR_MAP: Record<string, ErrorKind> = {
  invalid: "invalid",
  "turnstile-failed": "turnstile",
  "rate-limited": "rateLimited",
  "not-found": "notFound",
  "not-ready": "notReady",
  misconfigured: "unavailable",
};

/**
 * Boş alan `undefined` döner — `0` veya `NaN` DEĞİL. Virgül ondalık ayırıcı
 * kabul edilir: TR klavyede "1,5" yazmak doğal, `Number("1,5")` ise `NaN`.
 */
function optionalNumber(raw: string): number | undefined {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

export function DiagnooUnlockForm({
  diagnosticId,
  locale,
  onUnlocked,
}: {
  diagnosticId: string;
  locale: "tr" | "en";
  /** Kilidi açılan rapor — çağıran görünümü rapora çevirir. */
  onUnlocked: (report: DiagnooReport) => void;
}) {
  const uid = useId();
  const c = COPY[locale];

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [traffic, setTraffic] = useState("");
  const [aov, setAov] = useState("");
  const [conversion, setConversion] = useState("");
  const [adSpend, setAdSpend] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  const [consentMissing, setConsentMissing] = useState(false);

  const {
    token: turnstileToken,
    containerRef: turnstileRef,
    reset: clearTurnstileToken,
    error: turnstileError,
  } = useTurnstileToken({ enabled: TURNSTILE_ENABLED });

  /** Yalnız DOLU alanlar taşınır; boş alan anahtarı hiç oluşmaz. */
  function buildKnownMetrics(): KnownMetrics | undefined {
    const metrics: KnownMetrics = {};
    const monthlyTraffic = optionalNumber(traffic);
    if (monthlyTraffic !== undefined) metrics.monthlyTraffic = Math.round(monthlyTraffic);
    const aovValue = optionalNumber(aov);
    if (aovValue !== undefined) metrics.aov = aovValue;
    const conversionPercent = optionalNumber(conversion);
    // Yüzde → 0-1 oranı. Şema `gt(0).lt(1)` istiyor; %100 ve üstü zaten
    // gerçekçi değil, sunucu 400 döner ve `invalid` mesajına çözülür.
    if (conversionPercent !== undefined) metrics.conversionRate = conversionPercent / 100;
    const spend = optionalNumber(adSpend);
    if (spend !== undefined) metrics.monthlyAdSpend = spend;
    return Object.keys(metrics).length > 0 ? metrics : undefined;
  }

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (state === "submitting") return;
    if (!consent) {
      // Rıza kapısının istemci ayağı: sunucu `z.literal(true)` ile zaten
      // zorunlu kılıyor, burada gönderimden önce net bir geri bildirim.
      setConsentMissing(true);
      setState("error");
      return;
    }
    setConsentMissing(false);
    setState("submitting");

    const knownMetrics = buildKnownMetrics();
    const trimmedName = fullName.trim();

    try {
      const res = await fetch("/api/tools/diagnoo-unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          diagnosticId,
          email: email.trim(),
          company: company.trim(),
          ...(trimmedName ? { fullName: trimmedName } : {}),
          ...(knownMetrics ? { knownMetrics } : {}),
          kvkkConsent: true,
          turnstileToken: TURNSTILE_ENABLED ? turnstileToken : "",
        }),
      });

      if (res.ok) {
        const body = (await res.json().catch(() => null)) as {
          report?: DiagnooReport;
        } | null;
        if (!body?.report) {
          setErrorKind("generic");
          setState("error");
          clearTurnstileToken();
          return;
        }
        track({
          name: "tool_report_requested",
          properties: {
            slug: DIAGNOO_SLUG,
            band: healthScoreBucket(body.report.healthScore),
            locale,
          },
        });
        onUnlocked(body.report);
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

  const emailId = `${uid}-email`;
  const companyId = `${uid}-company`;
  const nameId = `${uid}-name`;
  const nameHintId = `${uid}-name-hint`;
  const trafficId = `${uid}-traffic`;
  const aovId = `${uid}-aov`;
  const conversionId = `${uid}-conversion`;
  const conversionHintId = `${uid}-conversion-hint`;
  const adSpendId = `${uid}-adspend`;
  const kvkkId = `${uid}-kvkk`;

  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;

  let hint: string | null = null;
  if (!submitting && turnstileError === "unavailable") hint = c.turnstileUnavailable;
  else if (!submitting && turnstileError === "loading") hint = c.turnstileLoading;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <h3 className="typography-h3 text-ink-900">{c.heading}</h3>
        <p className="typography-body-md text-ink-700 mt-2 max-w-prose-editorial">
          {c.lede}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            aria-invalid={state === "error" && !consentMissing ? true : undefined}
            className="mt-2"
          />
        </div>

        <div>
          <label htmlFor={companyId} className="typography-label text-ink-700">
            {c.companyLabel}
          </label>
          <Input
            id={companyId}
            type="text"
            autoComplete="organization"
            required
            placeholder={c.companyPlaceholder}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor={nameId} className="typography-label text-ink-700">
          {c.fullNameLabel}
        </label>
        <Input
          id={nameId}
          type="text"
          autoComplete="name"
          aria-describedby={nameHintId}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-2"
        />
        <p id={nameHintId} className="typography-caption text-ink-500 mt-1">
          {c.fullNameHint}
        </p>
      </div>

      {/* Gerçek metrikler — kapalı açılır. Zorunlu değil, ama girilirse
          finansal projeksiyon sektör medyanı yerine bu rakamlarla kurulur. */}
      <details className="group border-t border-surface-2 pt-4">
        <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
          <span className="typography-label text-ink-700">{c.metricsSummary}</span>
          <span
            aria-hidden="true"
            className="text-ink-500 typography-body-md transition-transform duration-200 group-open:rotate-45 shrink-0 motion-reduce:transition-none"
          >
            +
          </span>
        </summary>

        <p className="typography-caption text-ink-500 mt-3 max-w-prose-editorial">
          {c.metricsLede}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={trafficId} className="typography-label text-ink-700">
              {c.trafficLabel}
            </label>
            <Input
              id={trafficId}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={traffic}
              onChange={(e) => setTraffic(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor={aovId} className="typography-label text-ink-700">
              {c.aovLabel}
            </label>
            <Input
              id={aovId}
              type="number"
              inputMode="decimal"
              min={1}
              step={1}
              value={aov}
              onChange={(e) => setAov(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor={conversionId} className="typography-label text-ink-700">
              {c.conversionLabel}
            </label>
            <Input
              id={conversionId}
              type="number"
              inputMode="decimal"
              min={0.01}
              max={99}
              step={0.01}
              aria-describedby={conversionHintId}
              value={conversion}
              onChange={(e) => setConversion(e.target.value)}
              className="mt-2"
            />
            <p id={conversionHintId} className="typography-caption text-ink-500 mt-1">
              {c.conversionHint}
            </p>
          </div>

          <div>
            <label htmlFor={adSpendId} className="typography-label text-ink-700">
              {c.adSpendLabel}
            </label>
            <Input
              id={adSpendId}
              type="number"
              inputMode="decimal"
              min={1}
              step={1}
              value={adSpend}
              onChange={(e) => setAdSpend(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </details>

      <label
        htmlFor={kvkkId}
        className="flex items-start gap-3 typography-body-sm text-ink-700 cursor-pointer py-3"
      >
        <input
          id={kvkkId}
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setConsentMissing(false);
          }}
          aria-required
          className="h-5 w-5 mt-0.5 shrink-0 accent-teal-700 cursor-pointer"
        />
        <span>
          {c.kvkkPrefix}{" "}
          <a
            href={localeHref("/gizlilik-kvkk", locale)}
            onClick={(e) => e.stopPropagation()}
            className="underline decoration-teal-300 hover:decoration-teal-500"
          >
            {c.kvkkLink}
          </a>
        </span>
      </label>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}

      <div>
        <Button
          type="submit"
          size="lg"
          disabled={
            submitting ||
            tokenBlocking ||
            email.trim().length === 0 ||
            company.trim().length === 0
          }
        >
          {submitting ? c.submitting : c.submit}
        </Button>
      </div>

      <div role="status" aria-live="polite">
        {hint ? <p className="typography-caption text-ink-500">{hint}</p> : null}
      </div>

      {state === "error" ? (
        <p role="alert" className="typography-caption text-danger-700">
          {consentMissing ? c.consentRequired : c.errors[errorKind]}
        </p>
      ) : null}
    </form>
  );
}
