import type { Locale } from "@/lib/content/types";

/**
 * v2 bölüm metinleri.
 *
 * Kaynak: `docs/01-vision-positioning.md` — manifesto (§1c) ve konumlandırma
 * (§3d). Yeni copy uydurulmadı; mevcut kanonik metinler bu düzene uyarlandı.
 *
 * Statement satırları maskeli reveal için TEK TEK sarmalanır, bu yüzden
 * satırlara bölünmüş halde tutuluyorlar. `accent` alanı, o satırda vurgu
 * rengi alacak kelimeleri söyler.
 *
 * Üç satır: beş satırda maskeli reveal uzuyor ve ekranı dolduruyordu; aynı
 * argüman üç vuruşa indirildiğinde hem ritim toparlanıyor hem cümleler
 * sertleşiyor. İçerik kaynağı değişmedi (docs/01 §1c manifesto).
 */

export type StatementLine = {
  text: string;
  /** Bu satırda accent rengi alacak kelimeler (birebir eşleşme). */
  accent: string[];
};

export const STATEMENT: Record<Locale, { eyebrow: string; lines: StatementLine[] }> = {
  tr: {
    eyebrow: "Manifesto · 01",
    lines: [
      { text: "Danışmanlık rapor teslim eder, ajans kampanya bitince çıkar.", accent: ["rapor"] },
      { text: "Biz sahada durur, sonuç üretiriz.", accent: ["sahada", "sonuç"] },
      { text: "İş modelini dönüştürür, yıllarca yanında kalırız.", accent: ["dönüştürür,"] },
    ],
  },
  en: {
    eyebrow: "Manifesto · 01",
    lines: [
      { text: "Consultancies hand over a report; agencies leave when the campaign ends.", accent: ["report;"] },
      { text: "We stay on the floor and produce outcomes.", accent: ["floor", "outcomes."] },
      { text: "We rebuild the business model and stay for years.", accent: ["rebuild"] },
    ],
  },
};

export const ABOUT: Record<
  Locale,
  { eyebrow: string; lead: string; body: string[]; cta: string }
> = {
  tr: {
    eyebrow: "Hakkımızda",
    lead: "Sanayiye dönüşüm, ticarete büyüme inşa eden bir iş geliştirme stüdyosu.",
    body: [
      "Türkiye'de iş geliştirme iki kutba ayrışmış durumda: metodik ama sahada kimsenin olmadığı büyük danışmanlıklar, hızlı ama iş modeline dokunmayan ajanslar.",
      "INDOLES bu iki kutbun arasında değil, üstünde duruyor. Büyük firmanın metodolojisini, ajansın hızını ve mühendislik stüdyosunun teknik derinliğini tek yapıda birleştiriyoruz.",
      "Buna iş inşası diyoruz: müşterinin altyapısını, büyüme motorunu veya ikisini birden inşa etmek.",
    ],
    cta: "Hakkımızda",
  },
  en: {
    eyebrow: "About",
    lead: "A business-building studio: transformation for industry, growth for commerce.",
    body: [
      "Business development in Turkey has split into two poles: large consultancies that are methodical but never on the floor, and agencies that move fast but never touch the business model.",
      "INDOLES does not sit between those poles — it sits above them. We combine the methodology of a large firm, the speed of an agency and the technical depth of an engineering studio in one structure.",
      "We call it business building: constructing the client's infrastructure, their growth engine, or both.",
    ],
    cta: "About us",
  },
};

export const TRUSTED: Record<Locale, { eyebrow: string; defaultLabel: string }> = {
  tr: { eyebrow: "Güvenilen iş ortağı", defaultLabel: "Liderler" },
  en: { eyebrow: "Trusted partner", defaultLabel: "Leaders" },
};

export const WORK_SECTION: Record<
  Locale,
  { eyebrow: string; countLabel: string; cta: string; readCase: string; weeks: string }
> = {
  tr: {
    eyebrow: "Seçilmiş çalışmalar",
    countLabel: "vaka",
    cta: "Tüm çalışmalar",
    readCase: "Vakayı oku",
    weeks: "hafta",
  },
  en: {
    eyebrow: "Featured work",
    countLabel: "cases",
    cta: "All work",
    readCase: "Read the case",
    weeks: "weeks",
  },
};

export const OUTRO: Record<
  Locale,
  { eyebrow: string; headline: string[]; lead: string; primary: string; secondary: string }
> = {
  tr: {
    eyebrow: "Başlayalım",
    headline: ["Dönüşüm bir", "karardır."],
    lead: "1 saatlik bir keşif görüşmesi. Gündeminizi dinler, ilk çerçeveyi birlikte çizeriz.",
    primary: "Görüşme planla",
    secondary: "Brief gönder",
  },
  en: {
    eyebrow: "Let's begin",
    headline: ["Transformation is", "a decision."],
    lead: "A one-hour discovery call. We listen to your agenda and draw the first frame together.",
    primary: "Book a call",
    secondary: "Send a brief",
  },
};
