/**
 * GEO kontrolü — LLMs.txt erişimi: LLMs.txt dosyasının varlığını ve
 * biçimini ölçer. Spec §2, Görev 3.
 *
 * Çözüm kuralı: null veya boş/whitespace-only → 0 fail. Metin var + en az bir
 * markdown bağlantı satırı (`- [text](url)`) → 15 pass. Var ama biçimsiz →
 * 10 partial.
 *
 * Satır satır taranır, TEK bir `/m` regex'iyle BÜTÜN gövde üzerinde
 * DEĞİL (final review C2b — ReDoS). `/^.../m` yalnız boşluk/yeni-satır içeren
 * büyük bir gövdede kuadratik davranıyordu — ölçüldü (Node 20): 50 KB
 * tamamen-newline gövde 1,6 ms, 100 KB 6,3 ms, 200 KB 25,3 ms, 400 KB
 * 104,2 ms (`MAX_BODY_BYTES` 2 MB olduğu için üst sınır çok daha yüksek —
 * public bir uç noktada kontrolsüz CPU tüketimi). `split("\n")` + satır
 * başına ANKORLANMIŞ (`/m` yok) regex ile davranış AYNEN korunurken maliyet
 * doğrusala iner; satır sayısı ayrıca `MAX_LINES_SCANNED` ile sınırlanır.
 */

import { Localized } from "@/lib/content/types";
import { GeoCheckResult, statusFor } from "@/lib/tools/geo/types";

const MAX_SCORE = 15;

/** Markdown link satırı regex'i: `- [text](url)` — satır başına test edilir. */
const MARKDOWN_LINK_LINE_REGEX = /^\s*-\s*\[[^\]]+\]\([^)]+\)/;

/**
 * Taranacak satır tavanı (final review C2b). `MAX_BODY_BYTES` (2 MB,
 * safe-fetch.ts) tek karakterlik satırlarla (yalnız `\n`) milyonlarca satıra
 * ulaşabilir; bu tavan taramayı gerçekçi bir üst sınırda tutar.
 */
const MAX_LINES_SCANNED = 20_000;

/** Gövdeyi satır satır tarar, ilk eşleşen markdown link satırında durur. */
function hasMarkdownLinkLine(text: string): boolean {
  const lines = text.split("\n");
  const limit = Math.min(lines.length, MAX_LINES_SCANNED);
  for (let i = 0; i < limit; i++) {
    if (MARKDOWN_LINK_LINE_REGEX.test(lines[i] as string)) return true;
  }
  return false;
}

export function checkLlmsTxt(llmsTxt: string | null): GeoCheckResult {
  if (llmsTxt === null || llmsTxt.trim() === "") {
    const summary: Localized<string> = {
      tr: "llms.txt bulunamadı; üretken arama sistemleri kuralları tanımlanmamış.",
      en: "No llms.txt was found; generative search systems rules are not defined.",
    };
    const findings: Array<Localized<string>> = [
      {
        tr: "llms.txt yok: üretken arama sistemlerine yönelik niyet belgelenmemiş.",
        en: "No llms.txt exists to state your intent toward generative search systems.",
      },
    ];
    return {
      id: "llms-txt",
      score: 0,
      max: MAX_SCORE,
      status: statusFor(0, MAX_SCORE),
      summary,
      findings,
    };
  }

  // Metin varsa, markdown bağlantı satırı kontrol et
  const hasMarkdownLink = hasMarkdownLinkLine(llmsTxt);

  if (hasMarkdownLink) {
    const summary: Localized<string> = {
      tr: "llms.txt bulundu ve biçimli markdown bağlantılar içeriyor.",
      en: "llms.txt was found and contains properly formatted markdown links.",
    };
    const findings: Array<Localized<string>> = [
      {
        tr: "Doküman: üretken arama sistemlerine erişim izinleri tanımlanmış.",
        en: "Document: access permissions for generative search systems are defined.",
      },
    ];
    return {
      id: "llms-txt",
      score: MAX_SCORE,
      max: MAX_SCORE,
      status: statusFor(MAX_SCORE, MAX_SCORE),
      summary,
      findings,
    };
  }

  // Biçimsiz: metin var ama markdown bağlantı yok
  const summary: Localized<string> = {
    tr: "llms.txt bulundu ama markdown bağlantı satırları eksik.",
    en: "llms.txt was found but lacks properly formatted markdown link lines.",
  };
  const findings: Array<Localized<string>> = [
    {
      tr: "Doküman: metin var ama üretken arama sistemi referansı biçimsiz.",
      en: "Document: text exists but generative search systems references lack proper formatting.",
    },
  ];
  return {
    id: "llms-txt",
    score: 10,
    max: MAX_SCORE,
    status: statusFor(10, MAX_SCORE),
    summary,
    findings,
  };
}
