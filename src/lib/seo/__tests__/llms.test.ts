import { describe, it, expect } from "vitest";
import { buildLlmsTxtRoot, buildLlmsTxtLocale } from "../llms";
import { SITE_URL } from "../site";

/**
 * Denetim G-11: `/tr/llms.txt` ve `/en/llms.txt` hiç yazılmamıştı, kök
 * `/llms.txt`'in iki dilli birleşimi tek route'ta duruyordu. Bu testler
 * paylaşılan üretim mantığının (`buildLlmsTxtLocale`) her locale için
 * yalnız kendi dilinin içeriğini ürettiğini, çapraz dil sızıntısı
 * olmadığını ve markdown bağlantı disiplinini (llmstxt.org biçimi,
 * `- [Ad](URL): açıklama`, hiç çıplak URL yok) koruduğunu doğrular.
 */

/** Metindeki tüm URL benzeri token'ları çıkarır. */
function allUrls(text: string): string[] {
  return text.match(/https?:\/\/[^)\s]+/g) ?? [];
}

/** Markdown bağlantı sözdizimine (`](url)`) sarılı URL'leri çıkarır. */
function markdownLinkedUrls(text: string): string[] {
  return text.match(/\]\(https?:\/\/[^)]+\)/g) ?? [];
}

/** Çıplak URL sayısı: toplam URL - markdown'a sarılı URL. */
function bareUrlCount(text: string): number {
  return allUrls(text).length - markdownLinkedUrls(text).length;
}

describe("buildLlmsTxtLocale", () => {
  it("tr: yalnızca Türkçe URL'leri ve başlıkları taşır", () => {
    const tr = buildLlmsTxtLocale("tr");

    expect(tr).toContain("# INDOLES");
    expect(tr).toContain("## Vaka çalışmaları");
    expect(tr).toContain("## İletişim");
    expect(tr).toContain("## Kaynaklar");
    expect(tr).toContain(`${SITE_URL}/tr/hizmetler`);

    // Çapraz dil sızıntısı yok: hiçbir `/en/` yolu geçmiyor, "(English)"
    // başlığı da yok (tek dilli dosyada bu ayrım gereksiz).
    expect(tr).not.toContain("/en/");
    expect(tr).not.toContain("(English)");
    expect(tr).not.toContain("## Resources");
    expect(tr).not.toContain("## Contact");
  });

  it("en: yalnızca İngilizce URL'leri ve başlıkları taşır", () => {
    const en = buildLlmsTxtLocale("en");

    expect(en).toContain("# INDOLES");
    expect(en).toContain("## Case studies");
    expect(en).toContain("## Contact");
    expect(en).toContain("## Resources");
    expect(en).toContain(`${SITE_URL}/en/services`);

    // Çapraz dil sızıntısı yok: hiçbir `/tr/` yolu geçmiyor.
    expect(en).not.toContain("/tr/");
    expect(en).not.toContain("## Vaka çalışmaları");
    expect(en).not.toContain("## İletişim");
  });

  it("tr ve en dosyaları birbirine hiç bağlantı vermez (kendi başına belge)", () => {
    // Görev kısıtı: per-locale dosyalar kök dosyanın aksine karşı dile
    // işaret eden "tek dilli sürüm" satırları taşımaz. Denetim bağlantı
    // hedefi üzerinden yapılır ("llms.txt)" bir markdown link hedefidir) —
    // düz metin "llms.txt" ve "/llms.txt" artık meşru içerik: aynı adlı
    // makalenin başlığı ve açıklaması listede geçiyor.
    expect(buildLlmsTxtLocale("tr")).not.toContain("llms.txt)");
    expect(buildLlmsTxtLocale("en")).not.toContain("llms.txt)");
  });

  it.each(["tr", "en"] as const)(
    "%s: markdown bağlantı sayısı > 0 ve çıplak URL sayısı 0",
    (locale) => {
      const text = buildLlmsTxtLocale(locale);
      expect(markdownLinkedUrls(text).length).toBeGreaterThan(0);
      expect(bareUrlCount(text)).toBe(0);
    },
  );

  it("iki locale de aynı sayıda bağlantı taşır (içerik parite kontrolü)", () => {
    const trLinks = markdownLinkedUrls(buildLlmsTxtLocale("tr")).length;
    const enLinks = markdownLinkedUrls(buildLlmsTxtLocale("en")).length;
    expect(trLinks).toBe(enLinks);
  });
});

describe("buildLlmsTxtRoot", () => {
  it("iki dili birlikte taşır ve her ikisine de tek dilli sürüm bağlantısı ekler", () => {
    const root = buildLlmsTxtRoot();

    expect(root).toContain("# INDOLES");
    expect(root).toContain("# INDOLES (English)");
    expect(root).toContain(`${SITE_URL}/tr/llms.txt`);
    expect(root).toContain(`${SITE_URL}/en/llms.txt`);
  });

  it("markdown bağlantı sayısı > 0 ve çıplak URL sayısı 0", () => {
    const root = buildLlmsTxtRoot();
    expect(markdownLinkedUrls(root).length).toBeGreaterThan(0);
    expect(bareUrlCount(root)).toBe(0);
  });

  it("kök dosyanın bağlantı sayısı iki per-locale dosyanın toplamından tam 4 fazladır", () => {
    // 4 = TR bölümüne 2 + EN bölümüne 2 eklenen "tek dilli sürüm" satırı.
    const rootLinks = markdownLinkedUrls(buildLlmsTxtRoot()).length;
    const trLinks = markdownLinkedUrls(buildLlmsTxtLocale("tr")).length;
    const enLinks = markdownLinkedUrls(buildLlmsTxtLocale("en")).length;
    expect(rootLinks).toBe(trLinks + enLinks + 4);
  });
});
