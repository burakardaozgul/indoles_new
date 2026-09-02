import type { Locale, Localized } from "@/lib/content/types";
import type { GeoBand, GeoCheckStatus } from "@/lib/tools/geo/types";

/**
 * Araç yüzeyinin UI kopyası — tek kaynak (spec §3-7). İçerik (`tools.ts`)
 * aracı anlatır; burası düğme, etiket, hata ve durum metinleridir. TR/EN
 * anahtar ağacı `copy.test.ts` ile eşitlenir.
 */
export type ScanErrorKind =
  | "invalidUrl" | "rateLimited" | "unreachable" | "blocked" | "turnstile" | "unavailable" | "generic";
export type ReportErrorKind =
  | "rateLimited" | "notFound" | "turnstile" | "mailFailed" | "unavailable" | "generic";

export const SCAN_ERROR_MAP: Record<string, ScanErrorKind> = {
  "invalid-url": "invalidUrl",
  "invalid-request": "generic",
  "rate-limited": "rateLimited",
  "target-unreachable": "unreachable",
  "target-blocked": "blocked",
  "turnstile-failed": "turnstile",
  misconfigured: "unavailable",
};

export const REPORT_ERROR_MAP: Record<string, ReportErrorKind> = {
  "rate-limited": "rateLimited",
  "not-found": "notFound",
  "turnstile-failed": "turnstile",
  "mail-failed": "mailFailed",
  misconfigured: "unavailable",
  invalid: "generic",
};

export const BAND_LABELS: Record<GeoBand, Localized<string>> = {
  zayif: { tr: "Zayıf", en: "Weak" },
  "gelismeye-acik": { tr: "Gelişmeye açık", en: "Developing" },
  iyi: { tr: "İyi", en: "Good" },
  oncu: { tr: "Öncü", en: "Leading" },
};

export const STATUS_LABELS: Record<GeoCheckStatus, Localized<string>> = {
  pass: { tr: "Geçti", en: "Pass" },
  partial: { tr: "Kısmen", en: "Partial" },
  fail: { tr: "Kaldı", en: "Fail" },
};

/** `{n}` biçimli yer tutucuları doldurur. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}

export type ToolUiCopy = {
  urlLabel: string;
  urlPlaceholder: string;
  submit: string;
  submitting: string;
  emptyUrl: string;
  turnstileLoading: string;
  turnstileUnavailable: string;
  stage: { reading: string; waiting: string; done: string; live: string; completed: string };
  result: {
    eyebrow: string; scannedAddress: string; caption: string; outOf: string;
    newScan: string; copyLink: string; copied: string; scaleAria: string;
  };
  signals: { points: string; details: string };
  gate: {
    title: string; locked: string; findingsCount: string; passedNotes: string;
    formTitle: string; formLede: string; emailLabel: string; emailPlaceholder: string;
    submit: string; submitting: string; kvkkPrefix: string; kvkkLink: string; kvkkHref: string;
    consentRequired: string; unlockedLede: string; passedGroup: string; showNotes: string;
    ctaLede: string; ctaButton: string;
    errors: Record<ReportErrorKind, string>;
  };
  errors: Record<ScanErrorKind, string>;
  share: { banner: string; scanOwn: string };
};

export const TOOL_UI: Record<Locale, ToolUiCopy> = {
  tr: {
    urlLabel: "Site adresi",
    urlPlaceholder: "sirketiniz.com.tr",
    submit: "Denetle",
    submitting: "Taranıyor…",
    emptyUrl: "Denetlemek istediğiniz adresi yazın.",
    turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
    turnstileUnavailable: "Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.",
    stage: {
      reading: "okunuyor…",
      waiting: "bekliyor",
      done: "tamam",
      live: "Tarama sürüyor",
      completed: "Tarama tamamlandı, skor {score}",
    },
    result: {
      eyebrow: "Sonuç",
      scannedAddress: "Taranan adres",
      caption: "GEO hazırlık skoru",
      outOf: "/100",
      newScan: "Yeni tarama",
      copyLink: "Bağlantıyı kopyala",
      copied: "Kopyalandı",
      scaleAria: "Skor ölçeği: {score} / 100, {band} bandında",
    },
    signals: { points: "puan", details: "Ayrıntı" },
    gate: {
      title: "Düzeltme listesi",
      locked: "Kilitli",
      findingsCount: "{n} bulgu",
      passedNotes: "Geçen {n} sinyalin notları",
      formTitle: "Raporu e-postayla alın",
      formLede: "Kalem kalem bulgular ve öncelikli aksiyonlar e-postanıza gelsin; liste hemen burada da açılır.",
      emailLabel: "E-posta adresi",
      emailPlaceholder: "siz@sirketiniz.com.tr",
      submit: "Raporu gönder",
      submitting: "Gönderiliyor…",
      kvkkPrefix: "KVKK kapsamında verilerimin işlenmesini kabul ediyorum.",
      kvkkLink: "Aydınlatma metni",
      kvkkHref: "/tr/gizlilik-kvkk",
      consentRequired: "Devam etmek için KVKK onayını işaretleyin.",
      unlockedLede: "Raporun kopyası e-postanızda.",
      passedGroup: "Geçen sinyaller ({n})",
      showNotes: "Notları göster",
      ctaLede: "Bu listeyi uzmanımızla birlikte önceliklendirin.",
      ctaButton: "Görüşme planlayın",
      errors: {
        rateLimited: "Çok fazla talep gönderildi. Bir süre sonra tekrar deneyin.",
        notFound: "Bu tarama bulunamadı. Yeni bir tarama başlatıp tekrar deneyin.",
        turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
        mailFailed: "Rapor şu an gönderilemedi, birazdan tekrar deneyin.",
        unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
        generic: "Bir sorun oluştu, birazdan tekrar deneyin.",
      },
    },
    errors: {
      invalidUrl: "Geçerli bir site adresi girin (örneğin sirketiniz.com.tr).",
      rateLimited: "Çok fazla tarama yapıldı. Bir süre sonra tekrar deneyin.",
      unreachable: "Bu adrese ulaşılamadı. Adresi kontrol edip tekrar deneyin.",
      blocked: "Bu site otomatik istekleri engelliyor. Bu koruma büyük ihtimalle GPTBot ve ClaudeBot'u da engelliyor; başlı başına bir GEO bulgusu.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
      generic: "Tarama şu an tamamlanamadı, birazdan tekrar deneyin.",
    },
    share: { banner: "Paylaşılan sonuç", scanOwn: "Kendi sitenizi tarayın" },
  },
  en: {
    urlLabel: "Site address",
    urlPlaceholder: "yourcompany.com",
    submit: "Audit",
    submitting: "Scanning…",
    emptyUrl: "Type the address you want to audit.",
    turnstileLoading: "Loading the security check…",
    turnstileUnavailable: "The security check did not load. Refresh the page and try again.",
    stage: {
      reading: "reading…",
      waiting: "waiting",
      done: "done",
      live: "Scan in progress",
      completed: "Scan complete, score {score}",
    },
    result: {
      eyebrow: "Result",
      scannedAddress: "Scanned address",
      caption: "GEO readiness score",
      outOf: "/100",
      newScan: "New scan",
      copyLink: "Copy link",
      copied: "Copied",
      scaleAria: "Score scale: {score} out of 100, in the {band} band",
    },
    signals: { points: "points", details: "Details" },
    gate: {
      title: "Fix list",
      locked: "Locked",
      findingsCount: "{n} findings",
      passedNotes: "Notes on the {n} passing signals",
      formTitle: "Get the report by email",
      formLede: "Item-by-item findings and priority actions land in your inbox; the list also opens right here.",
      emailLabel: "Email address",
      emailPlaceholder: "you@yourcompany.com",
      submit: "Send the report",
      submitting: "Sending…",
      kvkkPrefix: "I consent to processing my data per KVKK.",
      kvkkLink: "Privacy notice",
      kvkkHref: "/en/privacy",
      consentRequired: "Tick the KVKK consent to continue.",
      unlockedLede: "A copy of the report is in your inbox.",
      passedGroup: "Passing signals ({n})",
      showNotes: "Show notes",
      ctaLede: "Prioritise this list with one of our specialists.",
      ctaButton: "Book a call",
      errors: {
        rateLimited: "Too many requests for now. Please try again later.",
        notFound: "This scan was not found. Start a new scan and try again.",
        turnstile: "The security check did not pass; refresh the page and try again.",
        mailFailed: "The report could not be sent right now. Try again shortly.",
        unavailable: "The tool cannot respond right now. Try again shortly.",
        generic: "Something went wrong. Try again shortly.",
      },
    },
    errors: {
      invalidUrl: "Enter a valid site address (for example yourcompany.com).",
      rateLimited: "Too many scans for now. Please try again later.",
      unreachable: "We could not reach that address. Check it and try again.",
      blocked: "This site blocks automated requests. That protection most likely blocks GPTBot and ClaudeBot too; a GEO finding in itself.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      unavailable: "The tool cannot respond right now. Try again shortly.",
      generic: "The scan could not finish right now. Try again shortly.",
    },
    share: { banner: "Shared result", scanOwn: "Scan your own site" },
  },
};
