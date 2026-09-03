import { SemanticResultSchema, type ScrapedPage, type SemanticResult } from "../schema";
import { geminiJson } from "../services/gemini";
import type { DiagnooEnv } from "../services/firecrawl";

export async function analyzeSemantic(
  env: DiagnooEnv, pages: ScrapedPage[], locale: "tr" | "en",
): Promise<SemanticResult> {
  const corpus = pages.map((p) =>
    `--- [${p.pageType}] ${p.url}\nTitle: ${p.title}\nH1: ${p.h1}\nBaşlıklar: ${p.headings.join(" | ")}\nİçerik:\n${p.bodyText.slice(0, 3000)}`,
  ).join("\n\n");
  const lang = locale === "tr" ? "Türkçe" : "İngilizce";
  return geminiJson(env, {
    system: `Kıdemli bir CRO ve marka mesajı analistisin. Bir e-ticaret sitesinin sayfaları arasındaki mesaj tutarlılığını değerlendirirsin. Bulguları ${lang} yaz. YALNIZCA JSON döndür.`,
    user: [
      "Aşağıdaki sayfaları analiz et:",
      corpus,
      `Şema: {"uvpDetected": "sitenin tespit edilen benzersiz değer önerisi", "toneOfVoice": "tek kelimelik ton etiketi", "messageCohesionScore": 0-1 arası sayı (anasayfa vaadinin kategori/ürün/checkout sayfalarında ne kadar tutarlı sürdürüldüğü; 1 = tam tutarlı), "alignmentIssues": ["somut tutarsızlık bulguları — hangi sayfada ne eksik"], "seoKeywordIssues": ["başlık/H1 hiyerarşisindeki anahtar kelime sorunları"]}`,
      "Her bulguda sayfa URL'sini an. Genel geçer laf yok; kanıt göster.",
    ].join("\n\n"),
    schema: SemanticResultSchema,
  });
}
