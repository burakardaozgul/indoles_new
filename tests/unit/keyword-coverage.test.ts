import { describe, it, expect } from "vitest";
import { SERVICES } from "@/lib/content/services";
import { TOOLS } from "@/lib/content/tools";
import type { ToolContent } from "@/lib/content/tools";
import type { ServiceContent } from "@/lib/content/types";

/**
 * Dar kapsamlı ticari kelimelerin hedef sayfasında geçtiğini garanti eder.
 *
 * Bağlam: 2026-08-24 denetimi, keyword haritasındaki 245 kelimenin yalnız
 * %20'sinin hedef sayfasında geçtiğini ölçtü. Karar 2 (dar kapsam) yalnız
 * stratejide adıyla geçen kelimeleri sayfalara aldı ve bir yerleşim kuralı
 * koydu: `ajansı`/`firmaları` ailesi kendimizi adlandırmak için değil,
 * **ayrıştığımız şeyi adlandırmak için** kullanılır — yani karşı-konumlandırma
 * SSS'inde. `danışmanlığı`/`tasarımı` ailesi başlık ve açıklamaya girebilir.
 *
 * Bu test o yerleşimin sökülmemesini sağlar. Bir kelime kaybolursa sessizce
 * değil, kırmızı testle fark edilir.
 */

/** Türkçe-güvenli normalize: İ/I/ı ayrımını katlar, noktalamayı boşluğa çevirir. */
function norm(s: string): string {
  return s
    .replace(/[İIı]/g, "i")
    .toLowerCase()
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u")
    .replace(/[^0-9a-zçğıöşü]+/g, " ")
    .trim();
}

function searchSurface(s: ServiceContent): string {
  return norm(
    [
      s.name.tr,
      s.seo.title.tr,
      s.seo.description.tr,
      s.lede.tr,
      ...s.signals.tr,
      ...s.scope.includes.flatMap((i) => [i.title.tr, i.description.tr]),
      ...s.scope.excludes.tr,
      ...s.method.flatMap((m) => [m.title.tr, m.description.tr, m.output.tr]),
      ...s.deliverables.flatMap((d) => [d.title.tr, d.description.tr]),
      ...s.faq.flatMap((f) => [f.question.tr, f.answer.tr]),
    ].join(" ")
  );
}

/**
 * Strateji §2'de adıyla geçen ticari kelimeler → hedef hizmet (TR slug).
 *
 * Son iki çift Keyword-Onceliklendirme-2026-08-27 §1.5'ten ("ucuz kazançlar —
 * yazım/varyant boşlukları") geliyor: `e ticaret dönüşüm oranı artırma` GSC'de
 * gösterim alıyor ama C-07 yalnız kısa formları CRO sayfasına dağıtmıştı,
 * `e-ticaret` önekli tam form hiçbir yüzeyde yoktu; `performance marketing`
 * CSV'de TR kelimesi olarak listeli, sitede yalnız EN metinlerde geçiyordu.
 * İkisi de 2026-08-28'de tek cümleyle hedef sayfasına yerleşti.
 */
const TARGETS: Array<[slug: string, keyword: string]> = [
  ["cro", "cro ajansı"],
  ["cro", "dönüşüm oranı optimizasyonu"],
  ["e-ticaret", "e ticaret danışmanlığı"],
  ["e-ticaret", "e ticaret danışmanı"],
  ["e-ticaret", "e ticaret ajansı"],
  ["performans-pazarlama", "performans pazarlama ajansı"],
  ["ui-ux-tasarim", "ui ux tasarım ajansı"],
  ["ui-ux-tasarim", "ux ajansı"],
  ["ui-ux-tasarim", "ux tasarımı"],
  ["ui-ux-tasarim", "ui tasarımı"],
  ["ai-danismanlik", "yapay zeka danışmanlığı"],
  ["ai-danismanlik", "yapay zeka ajansı"],
  ["ai-danismanlik", "yapay zeka danışmanı"],
  ["ai-danismanlik", "yapay zeka firmaları"],
  ["e-ticaret", "e ticaret dönüşüm oranı artırma"],
  ["performans-pazarlama", "performance marketing"],
];

describe("Dar kapsam keyword yerleşimi (strateji §2, Karar 2)", () => {
  it.each(TARGETS)("%s sayfası '%s' kelimesini taşıyor", (slug, keyword) => {
    const service = SERVICES.find((s) => s.slug.tr === slug);
    expect(service, `hizmet bulunamadı: ${slug}`).toBeDefined();
    expect(searchSurface(service!)).toContain(norm(keyword));
  });

  it("'ajansı' ve 'firmaları' kelimeleri H1'e girmiyor", () => {
    // Yerleşim kuralı: kendimizi "ajans" diye adlandırmıyoruz. Görünen
    // başlık (`name`) ve arama başlığı (`seo.title`) bu kelimeleri taşımaz;
    // yalnız karşı-konumlandırma SSS'i taşır.
    //
    // `\b` KULLANILMAZ: JavaScript'in kelime sınırı `\w` = [A-Za-z0-9_]
    // tanımına dayanıyor ve `ı`, `ş`, `ğ` bu kümede değil. `/\bajansı\b/`
    // hiçbir zaman eşleşmiyor — bu test önce sessizce geçiyordu.
    for (const s of SERVICES) {
      for (const surface of [s.name.tr, s.seo.title.tr]) {
        const n = norm(surface);
        expect(n.includes("ajansi"), `${s.slug.tr}: "${surface}"`).toBe(false);
        expect(n.includes("firmalari"), `${s.slug.tr}: "${surface}"`).toBe(false);
      }
    }
  });

  it("her karşı-konumlandırma sorusu bir farkı tanımlıyor", () => {
    // Kelimeyi soruya sıkıştırıp cevabı boş bırakmak, kelime doldurmadır.
    // Cevap gerçekten bir ayrım kurmalı; en ucuz ölçüt INDOLES'in adının
    // geçmesi — yani cevabın kendi konumumuzu tarif etmesi.
    const counterPositioning = SERVICES.flatMap((s) =>
      s.faq
        .filter((f) => {
          const q = norm(f.question.tr);
          return q.includes("ajansi") || q.includes("firmalari");
        })
        .map((f) => ({ slug: s.slug.tr, f }))
    );

    expect(counterPositioning.length).toBeGreaterThanOrEqual(5);
    for (const { slug, f } of counterPositioning) {
      expect(f.answer.tr, `${slug}: "${f.question.tr}"`).toContain("INDOLES");
    }
  });
});

/**
 * EN yerleşim koruması (docs/19 bulgu C-13).
 *
 * Bağlam: 2026-08-27 denetimi, yukarıdaki `searchSurface()`'in yalnız `.tr`
 * alanlarını taradığını, dolayısıyla hiçbir EN hedef kelimenin regresyon
 * koruması altında olmadığını tespit etti. Aynı gün iki EN kelime sayfalara
 * yerleşti (`business process automation consulting`, `mvp development
 * agency` — v1.6 changelog); koruma olmadan bir sonraki içerik
 * düzenlemesinde ikisi de sessizce düşebilirdi.
 *
 * `norm()` EN için de doğru: Türkçe'ye özgü `toLocaleLowerCase("tr")`
 * tuzağından (İ/I/ı karışması) kaçınmak için zaten locale'siz manuel bir
 * karakter eşlemesi kullanıyor — `İ`, `I`, `ı` üçü de `i`'ye düşüyor, ki bu
 * ASCII `I` için `toLowerCase()`'in üreteceği sonuçla birebir aynı. EN
 * metninde Türkçe'ye özgü harf yok, o yüzden aynı fonksiyon iki dilde de
 * güvenli; ayrı bir `normEn()` gerekmiyor.
 *
 * Kapsam bilinçli olarak dar: yalnız stratejinin (§2.0 karar 6, v1.5/v1.6
 * changelog) adıyla andığı ve bugün gerçekten bir `SERVICES` sayfasında
 * geçtiği doğrulanmış 8 kelime. GEO/makale hedefleri (`generative engine
 * optimization`, `answer engine optimization` vb.) bu testin kapsamı
 * dışıdır — onlar `ArticleContent` yüzeyinde yaşar, `SERVICES` üzerinden
 * okunmaz; kapsamı oraya genişletmek ayrı bir iştir.
 */
function searchSurfaceEn(s: ServiceContent): string {
  return norm(
    [
      s.name.en,
      s.seo.title.en,
      s.seo.description.en,
      s.lede.en,
      ...s.signals.en,
      ...s.scope.includes.flatMap((i) => [i.title.en, i.description.en]),
      ...s.scope.excludes.en,
      ...s.method.flatMap((m) => [m.title.en, m.description.en, m.output.en]),
      ...s.deliverables.flatMap((d) => [d.title.en, d.description.en]),
      ...s.faq.flatMap((f) => [f.question.en, f.answer.en]),
    ].join(" ")
  );
}

/**
 * Strateji §2.0 karar 6 + v1.6 changelog'da adıyla geçen EN ticari kelimeler
 * → hedef hizmet (TR slug — `SERVICES` tek kaynak TR slug'ıyla indeksleniyor,
 * yukarıdaki TR desenle aynı). Kaynak: `keyword-hacim-birlesik.csv` EN
 * satırları (EN-AI, EN-Yazılım kümeleri).
 *
 * Bilinçli olarak DIŞARIDA bırakılan üç kelime (v1.5/v1.6 changelog):
 * `ai transformation consulting`, `ai implementation services`,
 * `geo optimization` — doğal yeri olmadan yerleştirmek kelime doldurma
 * olurdu, kod tarafında hiçbir sayfaya eklenmediler.
 *
 * `mvp development agency`'nin CSV'deki kanonik hedefi "MVP Build paketi
 * (EN)"dir — bir `PackageContent`, bu testin taradığı `SERVICES` yüzeyinin
 * dışında. Kelime bugün fiilen `ozel-yazilim-ve-mobil` SSS'inde de geçiyor
 * (v1.6 changelog); bu test yalnız o ikincil yerleşimi korur, paket
 * sayfasındaki asıl hedef bu dosyanın kapsamı dışında kalır.
 */
const TARGETS_EN: Array<[slug: string, keyword: string]> = [
  ["ai-danismanlik", "ai consultancy"],
  ["ai-danismanlik", "artificial intelligence consulting"],
  ["ai-danismanlik", "ai consulting firm"],
  ["dijital-donusum", "digital transformation consultancy"],
  ["ozel-yazilim-ve-mobil", "custom software development company"],
  ["ozel-yazilim-ve-mobil", "software development agency"],
  ["ozel-yazilim-ve-mobil", "mobile app development company"],
  ["ozel-yazilim-ve-mobil", "mvp development agency"],
  ["is-otomasyonlari", "business process automation consulting"],
];

describe("EN keyword yerleşimi (strateji §2.0 karar 6, docs/19 C-13)", () => {
  it.each(TARGETS_EN)("%s sayfası '%s' kelimesini taşıyor (EN)", (slug, keyword) => {
    const service = SERVICES.find((s) => s.slug.tr === slug);
    expect(service, `hizmet bulunamadı: ${slug}`).toBeDefined();
    expect(searchSurfaceEn(service!)).toContain(norm(keyword));
  });

  it("'agency' kelimesi name.en ve seo.title.en içinde geçmiyor", () => {
    // TR yerleşim kuralının ("ajansı"/"firmaları" H1 ve seo.title'a girmez,
    // v1.4 karar 3 — ticari niteleyici aile kendimizi adlandırmak için
    // kullanılmaz) EN eşleniği. 2026-08-27 doğrulaması: 12 hizmetin
    // hiçbirinde name.en/seo.title.en içinde "agency" yok — kelime yalnız
    // SSS'lerde (karşı-konumlandırma veya üçüncü taraf tanımı olarak)
    // geçiyor. Bu test o durumu dondurur.
    for (const s of SERVICES) {
      for (const surface of [s.name.en, s.seo.title.en]) {
        expect(norm(surface).includes("agency"), `${s.slug.tr}: "${surface}"`).toBe(false);
      }
    }
  });
});

/**
 * Dalga 1 makale yüzeyi (Keyword-Onceliklendirme-2026-08-27 §2 + §5).
 *
 * 2026-08-28 içerik partisi: 7 yeni yazı + derinleştirilen GEO kanonik
 * rehberi, takvimin 1-4. hafta slotlarını doldurdu. Her yazının hedef
 * kelimesi arama yüzeyinde (başlık, seo, gövde, SSS) geçmek zorunda —
 * özellikle GSC'de gösterim alıp sitede karşılığı olmayan `yapay zeka
 * optimizasyonu` (136 gösterim) ve yazım varyantı `ab testi` bu partiyle
 * yerleşti; bu test o yerleşimlerin sökülmemesini sağlar (alarm A-7).
 */
import { ARTICLES } from "@/lib/content/articles";
import type { ArticleContent } from "@/lib/content/types";

function articleSurface(a: ArticleContent): string {
  return norm(
    [
      a.title.tr,
      a.excerpt.tr,
      a.seo?.title?.tr ?? "",
      a.seo?.description?.tr ?? "",
      ...a.blocks.flatMap((b) => {
        if (b.type === "list") return b.items.map((i) => i.tr);
        if ("text" in b) return [b.text.tr];
        return [];
      }),
      ...(a.faq ?? []).flatMap((f) => [f.question.tr, f.answer.tr]),
    ].join(" ")
  );
}

/** Dalga 1 kelime → hedef yazı (TR slug). Kelimeler norm() sonrası biçimde. */
const TARGETS_ARTICLES: Array<[slug: string, keyword: string]> = [
  ["ai-donusumu-nedir", "ai dönüşümü"],
  ["ai-donusumu-nedir", "yapay zeka yol haritası"],
  ["ai-danismani-secerken-sorulacak-12-soru", "yapay zeka danışmanı"],
  ["ai-danismani-secerken-sorulacak-12-soru", "yapay zeka ajansı"],
  ["google-ai-overviews-da-yer-almak", "google ai overviews"],
  ["google-ai-overviews-da-yer-almak", "ai overview"],
  ["llms-txt-nedir", "llms txt"],
  ["cro-nedir", "cro nedir"],
  ["cro-nedir", "ab testi"],
  ["cro-nedir", "sepet terk"],
  ["cro-ajansi-nasil-secilir", "cro ajansı"],
  ["cro-ajansi-nasil-secilir", "cro danışmanlığı"],
  ["is-gelistirme-studyosu-nedir", "iş geliştirme stüdyosu"],
  ["is-gelistirme-studyosu-nedir", "iş inşası"],
  ["yapay-zeka-aramalarinda-nasil-one-cikarsiniz", "yapay zeka optimizasyonu"],
  ["yapay-zeka-aramalarinda-nasil-one-cikarsiniz", "geo optimizasyonu"],
];

describe("Dalga 1 makale keyword yerleşimi (2026-08-28 partisi)", () => {
  it.each(TARGETS_ARTICLES)("%s yazısı '%s' kelimesini taşıyor", (slug, keyword) => {
    const article = ARTICLES.find((a) => a.slug.tr === slug);
    expect(article, `yazı bulunamadı: ${slug}`).toBeDefined();
    expect(articleSurface(article!)).toContain(norm(keyword));
  });
});

/**
 * Araç yüzeyi keyword yerleşimi (Görev 13, SEO entegrasyonu).
 *
 * Kanibalizasyon kuralı (strateji A-6): `/araclar/geo-gorunurluk-denetleyicisi`
 * ARAÇ niyeti kelimelerini hedefler — "geo denetimi", "ai görünürlük testi",
 * "llms txt kontrolü". Bilgi niyeti ("geo optimizasyonu nedir") kanonik rehber
 * yazısında (`yapay-zeka-aramalarinda-nasil-one-cikarsiniz`) kalır, araç
 * yüzeyine eklenmez — bu test yalnız araç niyeti kelimelerini denetler.
 */
function toolSurface(t: ToolContent): string {
  return norm(
    [
      t.name.tr,
      t.lede.tr,
      ...t.steps.flatMap((s) => [s.title.tr, s.description.tr]),
      ...t.faq.flatMap((f) => [f.question.tr, f.answer.tr]),
      t.seo.title.tr,
      t.seo.description.tr,
    ].join(" ")
  );
}

/** Araç niyeti kelimesi → hedef araç (TR slug). */
const TARGETS_TOOLS: Array<[slug: string, keyword: string]> = [
  ["geo-gorunurluk-denetleyicisi", "geo denetimi"],
  ["geo-gorunurluk-denetleyicisi", "ai görünürlük testi"],
  ["geo-gorunurluk-denetleyicisi", "llms txt kontrolü"],
];

describe("Araç keyword yerleşimi (Görev 13, strateji A-6)", () => {
  it.each(TARGETS_TOOLS)("%s aracı '%s' kelimesini taşıyor", (slug, keyword) => {
    const tool = TOOLS.find((t) => t.slug.tr === slug);
    expect(tool, `araç bulunamadı: ${slug}`).toBeDefined();
    expect(toolSurface(tool!)).toContain(norm(keyword));
  });
});
