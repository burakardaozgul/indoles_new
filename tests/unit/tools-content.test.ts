import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/content/tools";

const LOCALES = ["tr", "en"] as const;

/**
 * Araç içerik katmanı bütünlüğü (Görev 10).
 *
 * `/araclar` ailesinin tek içerik kaynağı `tools.ts`. Araç sayfası SSS'i tek
 * başına bir cevap yüzeyi olarak çalışmalı (GEO): pasajdan koparıldığında
 * anlamını koruyan, ≥40 kelimelik cevaplar. Arama yüzeyi (`seo`) sayfadaki
 * H1'den ayrı — `<title>` SERP'te kesilmemeli, açıklama Google'ın kırpma
 * bandında durmalı. Eşikler `articles-content.test.ts` ile hizalı.
 */
describe("TOOLS içerik bütünlüğü", () => {
  it("en az bir araç kaydı vardır", () => {
    expect(TOOLS.length).toBeGreaterThanOrEqual(1);
  });

  it("her araç iki dilde slug ve ad taşır", () => {
    for (const t of TOOLS) {
      for (const loc of LOCALES) {
        expect(t.slug[loc]?.trim(), `${t.slug.tr}/${loc} slug`).toBeTruthy();
        expect(t.name[loc]?.trim(), `${t.slug.tr}/${loc} name`).toBeTruthy();
      }
    }
  });

  it("her araç iki dilde eyebrow, lede ve footnote taşır", () => {
    for (const t of TOOLS) {
      for (const loc of LOCALES) {
        expect(t.eyebrow[loc]?.trim(), `${t.slug.tr}/${loc} eyebrow`).toBeTruthy();
        expect(t.lede[loc]?.trim(), `${t.slug.tr}/${loc} lede`).toBeTruthy();
        expect(t.footnote[loc]?.trim(), `${t.slug.tr}/${loc} footnote`).toBeTruthy();
      }
    }
  });
});

describe("TOOLS SSS bütünlüğü", () => {
  it("her araç en az 6 SSS taşır", () => {
    // Brief: en az 6 soru. Alt yüzey olarak çalışması için taban sayı.
    for (const t of TOOLS) {
      expect(t.faq.length, t.slug.tr).toBeGreaterThanOrEqual(6);
    }
  });

  it("her SSS kalemi iki dilde de soru ve cevap taşır", () => {
    for (const t of TOOLS) {
      for (const f of t.faq) {
        for (const loc of LOCALES) {
          expect(f.question[loc]?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
          expect(f.answer[loc]?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
        }
      }
    }
  });

  it("SSS cevapları kendine yeter — anafora ile başlamaz", () => {
    // GEO: pasaj bağlamından koparıldığında anlamını korumalı. Regex
    // `articles-content.test.ts`'in güncel hâlinden birebir kopyalandı.
    const anaphora =
      /^(bu|bunu|bunun|bunlar|o|onu)[\s,.;:!?']|^(yukarıda|ayrıca|ancak)/i;
    for (const t of TOOLS) {
      for (const f of t.faq) {
        for (const loc of LOCALES) {
          expect(
            anaphora.test(f.answer[loc].trim()),
            `${t.slug.tr}/${loc}: "${f.question[loc]}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("SSS cevapları en az 40 kelimedir", () => {
    for (const t of TOOLS) {
      for (const f of t.faq) {
        for (const loc of LOCALES) {
          const words = f.answer[loc].trim().split(/\s+/).length;
          expect(
            words,
            `${t.slug.tr}/${loc}: "${f.question[loc]}" (${words} kelime)`,
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  it("araç içinde aynı soru iki kez sorulmaz", () => {
    const norm = (s: string) =>
      s.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    for (const t of TOOLS) {
      for (const loc of LOCALES) {
        const qs = t.faq.map((f) => norm(f.question[loc]));
        expect(new Set(qs).size, `${t.slug.tr}/${loc} soru tekrarı`).toBe(
          qs.length,
        );
      }
    }
  });
});

describe("TOOLS arama yüzeyi", () => {
  it("arama başlığı iki dilde dolu ve ≤50 karakter", () => {
    // Brief: `seo.title` ≤50. Layout "%s — INDOLES" (10 kr) eklese bile SERP
    // 60 bandında kalır.
    for (const t of TOOLS) {
      for (const loc of LOCALES) {
        const title = t.seo.title[loc];
        expect(title?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
        expect(
          title.length,
          `${t.slug.tr}/${loc}: "${title}" (${title.length} kr)`,
        ).toBeLessThanOrEqual(50);
      }
    }
  });

  it("arama açıklaması 140-160 karakter", () => {
    for (const t of TOOLS) {
      for (const loc of LOCALES) {
        const d = t.seo.description[loc];
        expect(d?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
        expect(
          d.length,
          `${t.slug.tr}/${loc}: ${d.length} karakter`,
        ).toBeGreaterThanOrEqual(140);
        expect(
          d.length,
          `${t.slug.tr}/${loc}: ${d.length} karakter`,
        ).toBeLessThanOrEqual(160);
      }
    }
  });
});
