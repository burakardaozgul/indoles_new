import { describe, it, expect, vi } from "vitest";
import { CASES } from "@/lib/content/cases";
import type { CaseStudyContent } from "@/lib/content/types";
import { SERVICES } from "@/lib/content/services";

const LOCALES = ["tr", "en"] as const;

/**
 * Vaka slug'ı 2026-08-29'da lokalize edildi (ADR-019 revizyonu): denetim
 * bulgusu "EN vaka slug'ları Türkçe, 9 URL". Buradaki kural o düzeltmenin
 * geri kaymasını engeller — EN slug Türkçe kelime taşırsa test düşer.
 */
describe("CASES.slug — locale başına ayrı", () => {
  it("her vakanın iki dilde de slug'ı var ve URL'e uygun", () => {
    for (const c of CASES) {
      for (const loc of LOCALES) {
        expect(c.slug[loc], `${c.slug.tr}/${loc} slug boş`).toBeTruthy();
        // Küçük harf, rakam ve tire; Türkçe harf (ı, ş, ğ, ü, ö, ç) yok.
        expect(
          c.slug[loc],
          `${c.slug.tr}/${loc}: "${c.slug[loc]}" URL'e uygun değil`,
        ).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      }
    }
  });

  it("EN slug TR slug'dan farklı — EN URL Türkçe kelime taşımaz", () => {
    for (const c of CASES) {
      expect(
        c.slug.en,
        `${c.slug.tr}: EN slug TR ile aynı, EN URL hâlâ Türkçe`,
      ).not.toBe(c.slug.tr);
    }
  });

  it("slug'lar locale içinde tekil — iki vaka aynı URL'i paylaşmaz", () => {
    for (const loc of LOCALES) {
      const all = CASES.map((c) => c.slug[loc]);
      expect(new Set(all).size, `${loc} slug tekrarı`).toBe(all.length);
    }
  });

  /**
   * Çapraz locale çakışması: bir vakanın TR slug'ı başka bir vakanın EN
   * slug'ı olursa `/en/case-studies/<x>` için hem 301 kuralı hem gerçek sayfa
   * doğar ve eski URL yanlış vakaya iner.
   */
  it("TR ve EN slug havuzları kesişmez — 301 kuralları yanlış vakaya inmez", () => {
    const en = new Set(CASES.map((c) => c.slug.en));
    for (const c of CASES) {
      expect(en, `"${c.slug.tr}" hem TR hem EN slug olarak kullanılıyor`).not.toContain(
        c.slug.tr,
      );
    }
  });
});

/**
 * L-01: vaka künyesindeki disiplinler hizmet sayfalarına bağlanır.
 *
 * Vaka detay sayfası çözülemeyen slug'ı sessizce eler — kırık bağlantı yerine
 * eksik bağlantı üretir. Kaybın sessiz olması denetimde görünmez; kural bu
 * yüzden testte tutuluyor.
 */
describe("CASES.serviceSlugs", () => {
  it("her slug gerçek bir hizmete çözülür", () => {
    const known = new Set(SERVICES.map((s) => s.slug.tr));
    for (const c of CASES) {
      for (const slug of c.serviceSlugs ?? []) {
        expect(known, `${c.slug.tr} → bilinmeyen hizmet "${slug}"`).toContain(slug);
      }
    }
  });

  it("aynı vaka içinde slug tekrarlanmaz", () => {
    for (const c of CASES) {
      const slugs = c.serviceSlugs ?? [];
      expect(new Set(slugs).size, `${c.slug.tr} slug tekrarı`).toBe(slugs.length);
    }
  });

  it("her vaka en az bir hizmete bağlanır — kanıt sayfası çıkışsız kalmaz", () => {
    for (const c of CASES) {
      expect(c.serviceSlugs?.length ?? 0, `${c.slug.tr} hiçbir hizmete bağlanmıyor`)
        .toBeGreaterThan(0);
    }
  });

  it("bağlanan hizmetin iki dilde de slug'ı var — EN URL kurulabiliyor", () => {
    for (const c of CASES) {
      for (const slug of c.serviceSlugs ?? []) {
        const service = SERVICES.find((s) => s.slug.tr === slug)!;
        for (const loc of LOCALES) {
          expect(service.slug[loc], `${slug} → ${loc}`).toBeTruthy();
        }
      }
    }
  });
});

/**
 * Sayı biçimi dile bağlıdır: TR binlik ayracı nokta, ondalık virgül, para
 * birimi sayıdan sonra; EN'de tersi. Tek dizge tutulduğunda Türkçe biçim EN
 * sayfalarda görünüyordu.
 */
describe("CASES metrikleri", () => {
  it("her metriğin değeri iki dilde de dolu", () => {
    for (const c of CASES) {
      for (const m of c.metrics) {
        for (const loc of LOCALES) {
          expect(
            m.value[loc]?.length ?? 0,
            `${c.slug.tr} / ${m.label.tr} → ${loc} değeri boş`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("her metriğin etiketi ve varsa bağlamı iki dilde de dolu", () => {
    for (const c of CASES) {
      for (const m of c.metrics) {
        for (const loc of LOCALES) {
          expect(m.label[loc]?.length ?? 0).toBeGreaterThan(0);
          if (m.context) {
            expect(m.context[loc]?.length ?? 0).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("EN değerinde Türkçe sayı biçimi kalmaz", () => {
    // Yakalananlar: önekli yüzde ("%90", "+%150"), noktalı binlik ayracı
    // ("200.000") ve TR birim sözcükleri. Virgül aranmaz — EN'de binlik
    // ayracıdır ve "200,000+" doğru biçimdir.
    const trFormat = /^\+?%|\d\.\d{3}|İlk|\b(dk|sn|ay|zincir)\b/;
    for (const c of CASES) {
      for (const m of c.metrics) {
        expect(
          trFormat.test(m.value.en),
          `${c.slug.tr} / ${m.label.tr} → EN değeri Türkçe biçimde: ${m.value.en}`,
        ).toBe(false);
      }
    }
  });
});

/**
 * Vaka SSS'i (GEO).
 *
 * 16 yazı ve 12 hizmet sayfası trafiği bu dokuz sayfaya yönlendiriyor; varılan
 * yerde soru-cevap yapısı yoksa alıntılanacak bir şey de yok. Kurallar hizmet
 * sayfalarınınkiyle aynı tutuluyor (`services-content.test.ts`): site geneli
 * tek bir SSS kalite eşiği taşır.
 */
describe("CASES SSS", () => {
  it("her vakada en az 10 soru var", () => {
    for (const c of CASES) {
      expect(c.faq?.length ?? 0, `${c.slug.tr} SSS eksik`).toBeGreaterThanOrEqual(10);
    }
  });

  it("soru ve cevaplar iki dilde de dolu — TR/EN paritesi", () => {
    for (const c of CASES) {
      for (const f of c.faq ?? []) {
        for (const loc of LOCALES) {
          expect(f.question[loc]?.trim().length ?? 0, `${c.slug.tr}/${loc} soru boş`)
            .toBeGreaterThan(0);
          expect(
            f.answer[loc]?.trim().length ?? 0,
            `${c.slug.tr}/${loc}: "${f.question.tr}" cevabı boş`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("soru tekrarı yok — aynı vakada aynı soru iki kez sorulmaz", () => {
    for (const c of CASES) {
      const qs = (c.faq ?? []).map((f) => f.question.tr);
      expect(new Set(qs).size, `${c.slug.tr} soru tekrarı`).toBe(qs.length);
    }
  });

  it("cevaplar kendine yeter — anafora ile başlamaz", () => {
    // GEO: pasaj bağlamından koparıldığında anlamını korumalı (docs/08 §8.1).
    // Vakada bunun karşılığı müşteriyi veya işi adıyla anmaktır.
    const anaphora = /^(bu|bunu|bunlar|o |onu |yukarıda|ayrıca|ancak)/i;
    for (const c of CASES) {
      for (const f of c.faq ?? []) {
        for (const loc of LOCALES) {
          expect(
            anaphora.test(f.answer[loc].trim()),
            `${c.slug.tr}/${loc}: "${f.question[loc]}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("cevaplar en az 40 kelimedir", () => {
    for (const c of CASES) {
      for (const f of c.faq ?? []) {
        for (const loc of LOCALES) {
          const words = f.answer[loc].trim().split(/\s+/).length;
          expect(
            words,
            `${c.slug.tr}/${loc}: "${f.question[loc]}" (${words} kelime)`,
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });
});

/**
 * Arama yüzeyi (`CaseStudyContent.seo`).
 *
 * Vaka `<title>`ı "müşteri — başlık" olarak kuruluyor, `<meta description>`
 * ham `lead` metnini basıyordu: ilk tam `seo:audit` koşusunda 18 vaka
 * URL'inin tamamı düştü (description 185-399 karakter). Sayfadaki başlık ve
 * giriş paragrafı değişmez; kısalan yalnız SERP'e giden dizgedir.
 */
describe("CASES arama yüzeyi", () => {
  /** `[locale]/layout.tsx` şablonu: "%s — INDOLES". */
  const TEMPLATE_SUFFIX = " — INDOLES";

  it("her vaka iki dilde arama başlığı ve açıklaması taşır", () => {
    for (const c of CASES) {
      for (const loc of LOCALES) {
        expect(c.seo?.title?.[loc]?.trim(), `${c.slug.tr}/${loc}`).toBeTruthy();
        expect(
          c.seo?.description?.[loc]?.trim(),
          `${c.slug.tr}/${loc}`
        ).toBeTruthy();
      }
    }
  });

  it("arama başlığı şablonla birlikte 15-60 karakter", () => {
    for (const c of CASES) {
      for (const loc of LOCALES) {
        const rendered = `${c.seo!.title![loc]}${TEMPLATE_SUFFIX}`;
        expect(
          rendered.length,
          `${c.slug.tr}/${loc}: "${rendered}"`
        ).toBeGreaterThanOrEqual(15);
        expect(
          rendered.length,
          `${c.slug.tr}/${loc}: "${rendered}"`
        ).toBeLessThanOrEqual(60);
      }
    }
  });

  it("arama açıklaması 80-160 karakter", () => {
    for (const c of CASES) {
      for (const loc of LOCALES) {
        const d = c.seo!.description![loc];
        expect(d.length, `${c.slug.tr}/${loc}: "${d}"`).toBeGreaterThanOrEqual(80);
        expect(d.length, `${c.slug.tr}/${loc}: "${d}"`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("arama başlığı müşteri adıyla açar", () => {
    // Fallback "müşteri — başlık" biçimindeydi; kısaltılmış başlık marka
    // aramasını (`OdorGo vaka`) kaybetmemeli. Uzun künye adları 50 karakterlik
    // bütçeye sığmadığı için kısaltılabilir ("SIM Baskı Malzemeleri" →
    // "SIM Baskı"), ama iki nokta öncesi kalan parça adın başlangıcı olmalı —
    // başka bir marka adı yazılamaz.
    for (const c of CASES) {
      for (const loc of LOCALES) {
        const title = c.seo!.title![loc];
        const brand = title.split(":")[0]!.trim();
        expect(
          c.clientName[loc].startsWith(brand),
          `${c.slug.tr}/${loc}: "${brand}" müşteri adı "${c.clientName[loc]}" ile başlamıyor`
        ).toBe(true);
      }
    }
  });

  it("arama açıklamasındaki her rakam vakanın kendi metninde geçer", () => {
    // İçerik dürüstlüğü (docs/04 §10): SERP'e giden özet, vakada olmayan bir
    // rakam üretemez. Kaynak metin = başlık, lede, metrikler, anlatı blokları.
    for (const c of CASES) {
      for (const loc of LOCALES) {
        const corpus = [
          c.title[loc],
          c.lead[loc],
          ...c.challenge[loc],
          ...c.approach[loc],
          ...c.outcome[loc],
          ...c.metrics.flatMap((m) => [m.value[loc], m.label[loc], m.context?.[loc] ?? ""]),
        ].join(" | ");
        const numbers = c.seo!.description![loc].match(/\d[\d.,]*/g) ?? [];
        for (const n of numbers) {
          const token = n.replace(/[.,]$/, "");
          expect(
            corpus.includes(token),
            `${c.slug.tr}/${loc}: "${token}" vaka metninde geçmiyor`
          ).toBe(true);
        }
      }
    }
  });

  it("generateMetadata arama başlığını ve açıklamasını basar", async () => {
    const { generateMetadata } = await import(
      "@/app/(marketing)/[locale]/vakalar/[slug]/page"
    );
    for (const c of CASES) {
      for (const loc of LOCALES) {
        const meta = await generateMetadata({
          // Slug locale başına ayrı (2026-08-29): her locale kendi slug'ıyla
          // çağrılır, çapraz locale zaten çözülmez.
          params: Promise.resolve({ locale: loc, slug: c.slug[loc] }),
        });
        expect(meta.title, `${c.slug.tr}/${loc}`).toBe(c.seo!.title![loc]);
        expect(meta.description, `${c.slug.tr}/${loc}`).toBe(
          c.seo!.description![loc]
        );
      }
    }
  });

  it("seo alanı olmayan vaka müşteri adı + başlık bileşimine düşer", async () => {
    vi.resetModules();
    const actual = await vi.importActual<typeof import("@/lib/content/cases")>(
      "@/lib/content/cases"
    );
    const stripped = actual.CASES.map(
      ({ seo: _seo, ...rest }) => rest as CaseStudyContent
    );
    vi.doMock("@/lib/content/cases", () => ({
      CASES: stripped,
      getCaseBySlug: (slug: string, locale: "tr" | "en") =>
        stripped.find((c) => c.slug[locale] === slug) ?? null,
    }));
    try {
      const { generateMetadata } = await import(
        "@/app/(marketing)/[locale]/vakalar/[slug]/page"
      );
      const sample = stripped[0]!;
      const meta = await generateMetadata({
        params: Promise.resolve({ locale: "tr", slug: sample.slug.tr }),
      });
      expect(meta.title).toBe(
        `${sample.clientName.tr} — ${sample.title.tr}`
      );
      expect(meta.description).toBe(sample.lead.tr);
    } finally {
      vi.doUnmock("@/lib/content/cases");
      vi.resetModules();
    }
  });
});
