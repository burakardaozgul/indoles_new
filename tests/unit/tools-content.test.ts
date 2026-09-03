import { describe, it, expect } from "vitest";
import {
  TOOLS,
  publishedTools,
  DIAGNOO_TOOL,
  GEO_TOOL,
  toolsForService,
  bridgesForArticle,
} from "@/lib/content/tools";
import type { ToolContent } from "@/lib/content/tools";
import { SERVICES } from "@/lib/content/services";
import { ARTICLES } from "@/lib/content/articles";

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

describe("TOOLS sinyal bütünlüğü", () => {
  it("her aracın sinyal ağırlıkları 100 puana toplanır", () => {
    // Sinyal kartları skorun dağılımını ilan eder; toplam 100 değilse sayfa
    // motorun puanlamadığı bir dağılım anlatıyor demektir.
    for (const t of TOOLS) {
      const total = t.signals.reduce((sum, s) => sum + s.weight, 0);
      expect(total, t.slug.tr).toBe(100);
    }
  });

  it("her sinyal iki dilde başlık ve açıklama taşır", () => {
    for (const t of TOOLS) {
      for (const s of t.signals) {
        for (const loc of LOCALES) {
          expect(s.title[loc]?.trim(), `${t.slug.tr}/${s.id}/${loc}`).toBeTruthy();
          expect(
            s.description[loc]?.trim(),
            `${t.slug.tr}/${s.id}/${loc}`,
          ).toBeTruthy();
        }
      }
    }
  });

  it("araç içinde sinyal kimliği tekrar etmez", () => {
    for (const t of TOOLS) {
      const ids = t.signals.map((s) => s.id);
      expect(new Set(ids).size, t.slug.tr).toBe(ids.length);
    }
  });
});

describe("Diagnoo kaydı", () => {
  const diagnoo = TOOLS.find((t) => t.slug.tr === "diagnoo");

  it("TOOLS içinde yer alır ve iki dilde aynı slug'ı taşır", () => {
    expect(diagnoo, "diagnoo kaydı yok").toBeDefined();
    expect(diagnoo!.slug.en).toBe("diagnoo");
  });

  it("dört skor boyutunu 25/25/30/20 ağırlığıyla tanıtır", () => {
    // Ağırlıklar `computeHealthScore` ile birebir (semantik 25, UX 12,5+12,5,
    // hız 30, ölçüm 20) — sayfadaki tanıtım motordan sapamaz.
    const byId = new Map(diagnoo!.signals.map((s) => [s.id, s.weight]));
    expect([...byId.keys()].sort()).toEqual([
      "semantic",
      "speed-funnel",
      "tracking",
      "ux",
    ]);
    expect(byId.get("semantic")).toBe(25);
    expect(byId.get("ux")).toBe(25);
    expect(byId.get("speed-funnel")).toBe(30);
    expect(byId.get("tracking")).toBe(20);
  });

  it("tam 3 adım anlatır", () => {
    expect(diagnoo!.steps.length).toBe(3);
  });

  it("lansman kapısı kapalı: published false", () => {
    // Araç, sırlar ve uzak migration hazır olana kadar arama yüzeylerine
    // (sitemap, llms.txt, /araclar listesi) girmez — yalnız doğrudan URL ile
    // erişilir. Bayrak `true` olduğunda bu test bilinçli olarak güncellenir.
    expect(diagnoo!.published).toBe(false);
  });
});

describe("publishedTools filtresi", () => {
  it("yalnız published araçları döner", () => {
    const geo = TOOLS.find((t) => t.slug.tr === "geo-gorunurluk-denetleyicisi");
    expect(geo!.published).toBe(true);
    const slugs = publishedTools().map((t) => t.slug.tr);
    expect(slugs).toContain("geo-gorunurluk-denetleyicisi");
    expect(slugs).not.toContain("diagnoo");
  });

  it("bayrak true olduğunda araç listeye girer", () => {
    // Lansman senaryosu: Diagnoo yayına alındığında filtre onu geçirmeli.
    const launched: ToolContent[] = TOOLS.map((t) => ({ ...t, published: true }));
    expect(publishedTools(launched).map((t) => t.slug.tr)).toContain("diagnoo");
  });

  it("her araç bayrağını açıkça taşır", () => {
    for (const t of TOOLS) {
      expect(typeof t.published, t.slug.tr).toBe("boolean");
    }
  });
});

describe("TOOLS hero alanları", () => {
  it("her araç 4 kanıt öğesini iki dilde taşır", () => {
    // Kanıt şeridi hero'da ve `/araclar` kartında aynı diziden okunuyor;
    // dört öğe tasarımın taşıdığı sayı (docs/04 §12.10).
    for (const t of TOOLS) {
      expect(t.proof.length, t.slug.tr).toBe(4);
      for (const p of t.proof) {
        for (const loc of LOCALES) {
          expect(p[loc]?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
        }
      }
    }
  });

  it("her araç giriş yardımını iki dilde taşır", () => {
    for (const t of TOOLS) {
      for (const loc of LOCALES) {
        expect(t.inputHelp[loc]?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
      }
    }
  });

  it("her araç dört bant cümlesini iki dilde taşır", () => {
    // Bant KÜMESİ araca özel (GEO `GeoBand`, Diagnoo `HealthScoreBucket`),
    // ama sayı ikisinde de dört: skor dört banda bölünür.
    for (const t of TOOLS) {
      const sentences = Object.values(t.bands);
      expect(sentences.length, t.slug.tr).toBe(4);
      for (const s of sentences) {
        for (const loc of LOCALES) {
          expect(s[loc]?.trim(), `${t.slug.tr}/${loc}`).toBeTruthy();
        }
      }
    }
  });

  it("bant anahtarları motorun kova/bant kimlikleriyle birebir", () => {
    // Kayıt tipli yazıldığı için eksik anahtar derlemede yakalanır; bu test
    // anahtar KÜMESİNİN motordan sapmadığını çalışma zamanında da tutar.
    expect(Object.keys(GEO_TOOL.bands).sort()).toEqual(
      ["gelismeye-acik", "iyi", "oncu", "zayif"],
    );
    expect(Object.keys(DIAGNOO_TOOL.bands).sort()).toEqual(
      ["0-25", "26-50", "51-75", "76-100"],
    );
  });
});

/**
 * Üçgenin hizmet→araç ayağı (Faz 2 Görev 1).
 *
 * Her aracın doğal bağlandığı hizmetleri TR slug'la taşıması gerekir —
 * hizmet sayfasındaki `ToolServiceCallout` bu listeyi okur. Slug hayali
 * olamaz: gerçek bir `SERVICES` kaydına karşılık gelmeli, yoksa hizmet
 * sayfası sessizce hiçbir şey basmaz ve blok kaybolur.
 */
describe("relatedServices", () => {
  it("her araç en az bir hizmete bağlanır ve slug'lar gerçek hizmetlerdir", () => {
    const serviceSlugs = new Set(SERVICES.map((s) => s.slug.tr));
    for (const t of TOOLS) {
      expect(t.relatedServices.length).toBeGreaterThan(0);
      for (const s of t.relatedServices) expect(serviceSlugs.has(s)).toBe(true);
    }
  });

  it("toolsForService yalnız yayınlanmış araçları döndürür", () => {
    expect(toolsForService("ai-danismanlik").map((t) => t.slug.tr)).toEqual([GEO_TOOL.slug.tr]);
    expect(DIAGNOO_TOOL.published).toBe(false);
    expect(toolsForService("cro")).toEqual([]);
  });
});

/**
 * Üçgenin araç→makale ayağı (Faz 2 Görev 2).
 *
 * Köprü paragrafı hayali bir makaleye işaret edemez (slug `ARTICLES`te
 * gerçekten var olmalı) ve aracın kendi TR yoluna bağlanmalıdır — hayali
 * bir slug ya da yanlış hedef, makale sayfasında sessizce kırık bir linke
 * ya da hiç basılmayan bir bloğa dönüşür. GEO'nun köprüleri zaten üç
 * yazının gövdesinde inline durduğu için (Görev 13) `bridges: []` bekleniyor.
 */
describe("bridges", () => {
  it("bridges gerçek makale slug'larına işaret eder ve paragraf aracın TR yolunu içerir", () => {
    const slugs = new Set(ARTICLES.map((a) => a.slug.tr));
    for (const t of TOOLS) {
      for (const b of t.bridges) {
        expect(slugs.has(b.articleSlugTr), b.articleSlugTr).toBe(true);
        expect(b.paragraph.tr).toContain(`](/araclar/${t.slug.tr})`);
        expect(b.paragraph.en).toContain(`](/araclar/${t.slug.tr})`);
        expect(
          b.paragraph.tr.split(/\s+/).length,
          `${t.slug.tr}/${b.articleSlugTr}`,
        ).toBeGreaterThanOrEqual(25);
      }
    }
  });

  it("aynı aracın köprüleri farklı makalelere işaret eder — tekrar yok", () => {
    for (const t of TOOLS) {
      const slugs = t.bridges.map((b) => b.articleSlugTr);
      expect(new Set(slugs).size, t.slug.tr).toBe(slugs.length);
    }
  });

  it("GEO'nun köprüsü boştur — linkler zaten yazı gövdesinde inline", () => {
    expect(GEO_TOOL.bridges).toEqual([]);
  });

  it("Diagnoo cro/performans-pazarlama/e-ticaret konulu 8 yazıdan 7'sine bağlanır", () => {
    // Kapsam dışı kalan tek yazı B2B lead toplama rehberi — konusu
    // Diagnoo'nun taradığı mağaza sayfalarıyla (ana + kategori + ürün +
    // ödeme) örtüşmüyor; gerekçe DIAGNOO_TOOL içindeki yorumda. Sekizinci
    // hedef yazı GAP analizi rehberidir (Faz 2 Görev 6): gövdesinde araç
    // linki taşımaz, köprüsü buradan gelir.
    const targetTopics = new Set(["cro", "performans-pazarlama", "e-ticaret"]);
    const targetSlugs = ARTICLES.filter((a) => targetTopics.has(a.topic)).map(
      (a) => a.slug.tr,
    );
    expect(targetSlugs.length).toBe(8);
    expect(DIAGNOO_TOOL.bridges.length).toBe(7);
    for (const b of DIAGNOO_TOOL.bridges) {
      expect(targetSlugs, b.articleSlugTr).toContain(b.articleSlugTr);
    }
  });
});

describe("bridgesForArticle", () => {
  it("Diagnoo yayınlanmamışken boş döner", () => {
    expect(bridgesForArticle(DIAGNOO_TOOL.bridges[0]!.articleSlugTr)).toEqual([]);
  });

  it("yayınlanmış araç için köprü döner (published bayrağı ile)", () => {
    const published: ToolContent = { ...DIAGNOO_TOOL, published: true };
    expect(
      bridgesForArticle(DIAGNOO_TOOL.bridges[0]!.articleSlugTr, [published]),
    ).toHaveLength(1);
  });

  it("ilgisiz bir makale slug'ında boş döner", () => {
    const published: ToolContent = { ...DIAGNOO_TOOL, published: true };
    expect(bridgesForArticle("olmayan-bir-yazi-slug", [published])).toEqual([]);
  });

  it("dönen paragraf ilgili aracın kendisidir", () => {
    const published: ToolContent = { ...DIAGNOO_TOOL, published: true };
    const [result] = bridgesForArticle(
      DIAGNOO_TOOL.bridges[0]!.articleSlugTr,
      [published],
    );
    expect(result!.tool.slug.tr).toBe(DIAGNOO_TOOL.slug.tr);
    expect(result!.paragraph).toEqual(DIAGNOO_TOOL.bridges[0]!.paragraph);
  });
});
