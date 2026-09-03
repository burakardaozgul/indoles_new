import { VisionResultSchema, type ScrapedPage, type VisionResult } from "../schema";
import { geminiJson } from "../services/gemini";
import type { DiagnooEnv } from "../services/firecrawl";

/**
 * Ekran görüntüsü üst sınırı (~1,5 MB). Üçüncü tarafın döndürdüğü görsel
 * boyutsuz güvenilir değil: sınırsız bir gövdeyi base64'e çevirmek hem adımın
 * bellek bütçesini hem `btoa` maliyetiyle CPU bütçesini aşabilir. Sınırı aşan
 * görsel ATLANIR, analiz durmaz — `analyzeVision` görselsiz metin yoluna
 * zaten düşebiliyor.
 */
const MAX_SCREENSHOT_BYTES = 1_500_000;

/**
 * SINIR AKIŞTA UYGULANIR. `await res.arrayBuffer()` sonrası ölçmek, tam olarak
 * sınırlamak istediğimiz işi (gövdenin tamamını belleğe almak) zaten yaptırmış
 * olurdu; `content-length` ise yalan söyleyebilir veya hiç gelmeyebilir, o
 * yüzden yalnız ucuz bir ön eleme. Gerçek koruma sayaç: her parçadan sonra
 * toplam kontrol edilir, sınır aşıldığı anda istek `abort` edilir ve okuma
 * durur — kalan baytlar hiç indirilmez.
 */
async function toBase64(url: string): Promise<string | null> {
  const controller = new AbortController();
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;

    const declared = Number(res.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_SCREENSHOT_BYTES) {
      controller.abort();
      return null;
    }

    const body = res.body;
    if (!body) return null;

    const reader = body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        total += value.byteLength;
        if (total > MAX_SCREENSHOT_BYTES) {
          controller.abort();
          return null;
        }
        chunks.push(value);
      }
    } finally {
      // Akış hatalıysa (abort) kilidi bırakmak da hata verebilir; görselin
      // atlanması zaten kabul edilmiş sonuç, dıştaki catch onu yakalar.
      reader.releaseLock();
    }

    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    // Native latin1 decode + btoa: karakter döngüsü ücretsiz plan adım CPU bütçesini (~10 ms) aşar.
    return btoa(new TextDecoder("latin1").decode(bytes));
  } catch { return null; }
}

export async function analyzeVision(
  env: DiagnooEnv, pages: ScrapedPage[], locale: "tr" | "en",
): Promise<VisionResult> {
  const withShots = pages.filter((p) => p.screenshotUrl).slice(0, 3);
  const images = (await Promise.all(withShots.map((p) => toBase64(p.screenshotUrl!))))
    .filter((s): s is string => s !== null);
  const lang = locale === "tr" ? "Türkçe" : "İngilizce";
  const pageList = withShots.map((p, i) => `Görsel ${i + 1}: [${p.pageType}] ${p.url}`).join("\n");
  return geminiJson(env, {
    system: `Kıdemli bir UI/UX denetçisisin. E-ticaret ekran görüntülerinde bilişsel yük ve CTA görünürlüğünü değerlendirirsin. Bulguları ${lang} yaz. YALNIZCA JSON döndür.`,
    user: [
      images.length > 0 ? `Ekran görüntüleri sırayla:\n${pageList}` : "Ekran görüntüsü alınamadı; sayfa metin yapısından çıkarım yap:",
      images.length === 0 ? pages.map((p) => `[${p.pageType}] H1: ${p.h1} | Başlıklar: ${p.headings.join(", ")}`).join("\n") : "",
      `Şema: {"cognitiveLoadScore": 0-1 (0=sade, 1=aşırı kalabalık), "ctaVisibilityScore": 0-1 (fold üstünde ana CTA ne kadar baskın), "mobileIssues": ["somut mobil sorunlar"], "desktopIssues": ["somut masaüstü sorunlar"], "aboveFoldAssessment": "fold üstünde ne görünüyor, tek paragraf"}`,
      "Her bulgu hangi sayfaya/görsele aitse belirt.",
    ].filter(Boolean).join("\n\n"),
    schema: VisionResultSchema,
    imagesBase64: images,
  });
}
