import { describe, it, expect, vi } from "vitest";
import { ARTICLES } from "@/lib/content/articles";
import type { ArticleContent } from "@/lib/content/types";

const LOCALES = ["tr", "en"] as const;

describe("ARTICLES SSS bütünlüğü", () => {
  it("her makalenin SSS'i en az 10 sorudur", () => {
    // Alt sınır 10: makale SSS'i tek başına bir cevap yüzeyi olarak çalışmalı
    // (uzun kuyruk sorgular + FAQPage şeması). Hizmet sayfalarıyla aynı eşik —
    // services-content.test.ts ile hizalı.
    for (const a of ARTICLES) {
      expect(a.faq?.length ?? 0, a.slug.tr).toBeGreaterThanOrEqual(10);
    }
  });

  it("her SSS kalemi iki dilde de soru ve cevap taşır", () => {
    for (const a of ARTICLES) {
      for (const f of a.faq ?? []) {
        for (const loc of LOCALES) {
          expect(f.question[loc]?.trim(), `${a.slug.tr}/${loc}`).toBeTruthy();
          expect(f.answer[loc]?.trim(), `${a.slug.tr}/${loc}`).toBeTruthy();
        }
      }
    }
  });

  it("SSS cevapları kendine yeter — anafora ile başlamaz", () => {
    // GEO: pasaj bağlamından koparıldığında anlamını korumalı (spec §8.1).
    // Zamir grubu kelime sınırı ister — "Business" İngilizce bir cevabı
    // "bu" ile başlatmaz; zarf/bağlaç grubu önek olarak kalır (yukarıdaki vb.).
    const anaphora = /^(bu|bunu|bunun|bunlar|o|onu)[\s,.;:!?']|^(yukarıda|ayrıca|ancak)/i;
    for (const a of ARTICLES) {
      for (const f of a.faq ?? []) {
        for (const loc of LOCALES) {
          expect(
            anaphora.test(f.answer[loc].trim()),
            `${a.slug.tr}/${loc}: "${f.question[loc]}"`
          ).toBe(false);
        }
      }
    }
  });

  it("SSS cevapları en az 40 kelimedir", () => {
    for (const a of ARTICLES) {
      for (const f of a.faq ?? []) {
        for (const loc of LOCALES) {
          const words = f.answer[loc].trim().split(/\s+/).length;
          expect(
            words,
            `${a.slug.tr}/${loc}: "${f.question[loc]}" (${words} kelime)`
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  it("makale içinde aynı soru iki kez sorulmaz", () => {
    const norm = (s: string) =>
      s
        .toLocaleLowerCase("tr")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        const qs = (a.faq ?? []).map((f) => norm(f.question[loc]));
        expect(new Set(qs).size, `${a.slug.tr}/${loc} soru tekrarı`).toBe(
          qs.length
        );
      }
    }
  });

  it("SSS soruları makale gövdesindeki başlıkları tekrar etmez", () => {
    // Aynı soruyu hem h2 hem SSS olarak sormak sayfayı kendi içinde kanibalize
    // eder; SSS gövdenin cevaplamadığı ekseni açmalı.
    const norm = (s: string) =>
      s
        .toLocaleLowerCase("tr")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
    for (const a of ARTICLES) {
      const headings = new Set(
        a.blocks
          .filter((b) => b.type === "h2" || b.type === "h3")
          .flatMap((b) => {
            const text = (b as { text?: Record<string, string> }).text;
            return text ? LOCALES.map((loc) => norm(text[loc] ?? "")) : [];
          })
      );
      for (const f of a.faq ?? []) {
        for (const loc of LOCALES) {
          expect(
            headings.has(norm(f.question[loc])),
            `${a.slug.tr}/${loc}: "${f.question[loc]}" gövdedeki bir başlıkla birebir aynı`
          ).toBe(false);
        }
      }
    }
  });
});

/**
 * Arama yüzeyi (`ArticleContent.seo`).
 *
 * Görünen H1 editoryaldır ve 61-109 karakter olabilir; SERP 60'ta keser. İlk
 * tam `seo:audit` koşusunda 32 yazı URL'inin 29'u `title-length` kuralından
 * düştü. `seo.title` bu iki yüzeyi ayırır — sayfadaki başlık değişmez.
 */
describe("ARTICLES arama yüzeyi", () => {
  /** `[locale]/layout.tsx` şablonu: "%s — INDOLES". */
  const TEMPLATE_SUFFIX = " — INDOLES";

  it("her makale iki dilde arama başlığı taşır", () => {
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        expect(a.seo?.title?.[loc]?.trim(), `${a.slug.tr}/${loc}`).toBeTruthy();
      }
    }
  });

  it("arama başlığı şablonla birlikte 15-60 karakter", () => {
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        const rendered = `${a.seo!.title![loc]}${TEMPLATE_SUFFIX}`;
        expect(
          rendered.length,
          `${a.slug.tr}/${loc}: "${rendered}"`
        ).toBeGreaterThanOrEqual(15);
        expect(
          rendered.length,
          `${a.slug.tr}/${loc}: "${rendered}"`
        ).toBeLessThanOrEqual(60);
      }
    }
  });

  it("her makale iki dilde arama açıklaması taşır", () => {
    // Tip alanı opsiyonel kalır (fallback sözleşmesi korunsun diye), ama
    // yayımlanmış 16 yazının hepsi doldurulmuş olmalı: doldurulmayan yazı
    // `excerpt`in 160'ta kör kırpımına düşer ve SERP'e cümle ortasından
    // kesilmiş metin gider.
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        expect(
          a.seo?.description?.[loc]?.trim(),
          `${a.slug.tr}/${loc}`
        ).toBeTruthy();
      }
    }
  });

  it("arama açıklaması 140-160 karakter", () => {
    // Üst sınır 160: Google'ın kırpma eşiği. Alt sınır 140: eşiğin altında
    // kalan açıklama SERP'te boşluk bırakır ve Google kendi snippet'ini
    // üretmeyi tercih eder. Audit'in `description-length` kuralından dar —
    // orada 80 taban var, burada yazılmış içerik için sıkı band uygulanır.
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        const d = a.seo!.description![loc];
        expect(
          d.length,
          `${a.slug.tr}/${loc}: ${d.length} karakter`
        ).toBeGreaterThanOrEqual(140);
        expect(
          d.length,
          `${a.slug.tr}/${loc}: ${d.length} karakter`
        ).toBeLessThanOrEqual(160);
      }
    }
  });

  it("arama açıklaması excerpt veya arama başlığının kopyası değil", () => {
    // Kopyala-yapıştır koruması. `title` kancayı kurar, `description` "bu
    // sayfada ne var" sorusunu cevaplar; ikisi SERP'te yan yana okunur.
    // `excerpt` liste kartının metnidir ve 12 yazıda 160'ı aşar — kopyalanırsa
    // sorunun kendisi geri gelir.
    const norm = (s: string) =>
      s
        .toLocaleLowerCase("tr")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        const d = norm(a.seo!.description![loc]);
        expect(d, `${a.slug.tr}/${loc}: excerpt kopyası`).not.toBe(
          norm(a.excerpt[loc])
        );
        expect(d, `${a.slug.tr}/${loc}: seo.title kopyası`).not.toBe(
          norm(a.seo!.title![loc])
        );
        expect(
          norm(a.excerpt[loc]).startsWith(d),
          `${a.slug.tr}/${loc}: excerpt'in kırpılmış hâli`
        ).toBe(false);
      }
    }
  });

  it("arama açıklamasındaki her sayı yazının kendi metninde geçer", () => {
    // Uydurma koruması. Açıklamadaki "%25 dönüşüm artışı" gibi bir rakam
    // yazının gövdesinde karşılığı yoksa SERP okura yazıda olmayan bir vaat
    // eder. Sayı gövdenin iki dilinden birinde geçmesi yeterli — TR "12 kat"
    // EN'de "twelvefold" yazılabilir, rakam yalnız bir tarafta durur.
    //
    // Muafiyet: dört haneli yıllar. Bir açıklama yazının yayın/güncelleme
    // yılını takvim çerçevesi olarak anabilir ("2026 trendleri"), gövde aynı
    // yılı "bu yıl" diye yazmış olsa bile. Muafiyet yalnız yılları kapsar;
    // metrikler ve adım sayıları koşulsuz gövdeden doğrulanır.
    const YEAR = /^(19|20)\d{2}$/;
    const collect = (a: ArticleContent) => {
      const parts: string[] = [];
      for (const loc of LOCALES) {
        parts.push(a.title[loc]);
        for (const b of a.blocks) {
          const withText = b as { text?: Record<string, string> };
          if (withText.text) parts.push(withText.text[loc] ?? "");
          const withItems = b as { items?: Array<Record<string, string>> };
          if (withItems.items)
            for (const i of withItems.items) parts.push(i[loc] ?? "");
        }
        for (const f of a.faq ?? []) {
          parts.push(f.question[loc], f.answer[loc]);
        }
      }
      return new Set(parts.join(" ").match(/\d+/g) ?? []);
    };
    for (const a of ARTICLES) {
      const inBody = collect(a);
      for (const loc of LOCALES) {
        const used = a.seo!.description![loc].match(/\d+/g) ?? [];
        for (const n of used) {
          if (YEAR.test(n)) continue;
          expect(
            inBody.has(n),
            `${a.slug.tr}/${loc}: "${n}" açıklamada var, gövdede yok`
          ).toBe(true);
        }
      }
    }
  });

  it("generateMetadata arama başlığını basar, açıklamayı 160'ta tutar", async () => {
    const { generateMetadata } = await import(
      "@/app/(marketing)/[locale]/yazilar/[slug]/page"
    );
    for (const a of ARTICLES) {
      for (const loc of LOCALES) {
        const meta = await generateMetadata({
          params: Promise.resolve({ locale: loc, slug: a.slug[loc] }),
        });
        expect(meta.title, `${a.slug.tr}/${loc}`).toBe(a.seo!.title![loc]);
        expect(
          (meta.description ?? "").length,
          `${a.slug.tr}/${loc}`
        ).toBeLessThanOrEqual(160);
      }
    }
  });

  it("seo alanı olmayan makale görünen başlığa düşer", async () => {
    // Fallback sözleşmesi: alan opsiyonel olduğu için doldurulmamış içerik
    // eski davranışını korumalı — boş `<title>` üretmemeli.
    vi.resetModules();
    const actual = await vi.importActual<typeof import("@/lib/content/articles")>(
      "@/lib/content/articles"
    );
    const stripped = actual.ARTICLES.map(({ seo: _seo, ...rest }) => rest as ArticleContent);
    vi.doMock("@/lib/content/articles", () => ({
      ARTICLES: stripped,
      getArticleBySlug: (slug: string, loc: "tr" | "en") =>
        stripped.find((a) => a.slug[loc] === slug) ?? null,
    }));
    try {
      const { generateMetadata } = await import(
        "@/app/(marketing)/[locale]/yazilar/[slug]/page"
      );
      const sample = stripped[0]!;
      const meta = await generateMetadata({
        params: Promise.resolve({ locale: "tr", slug: sample.slug.tr }),
      });
      expect(meta.title).toBe(sample.title.tr);
      expect(meta.description).toBeTruthy();
      expect((meta.description ?? "").length).toBeLessThanOrEqual(160);
    } finally {
      vi.doUnmock("@/lib/content/articles");
      vi.resetModules();
    }
  });
});
