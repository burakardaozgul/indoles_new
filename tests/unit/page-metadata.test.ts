import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { DIAGNOO_TOOL } from "@/lib/content/tools";

/**
 * Sayfa başına metadata regresyon koruması.
 *
 * Hata: 10 sayfa tipinde `generateMetadata` yoktu. Next bu durumda
 * `[locale]/layout.tsx`'in metadata'sını miras verir — ~24 URL aynı başlığı
 * taşıyıp canonical olarak ana sayfayı gösteriyordu. Kanonik çakışması,
 * Google'ın bu sayfaları hiç dizine almamasıyla sonuçlanır.
 *
 * Kaynak taraması yapılır çünkü sayfa modülleri server component: jsdom
 * altında `getTranslations()` request context'i olmadan içe aktarılamaz.
 * Aranan şey zaten kaynakta görülebilir — kendi `generateMetadata` fonksiyonu
 * ve kendi iki dilli path eşlemesi.
 *
 * Ana sayfa (`[locale]/page.tsx`) bilinçli olarak dışarıda: canonical'ı
 * `/tr` ve `/en`, yani layout'un metadata'sı zaten doğru olan tek sayfa.
 */

const MARKETING_ROOT = path.join(
  process.cwd(),
  "src",
  "app",
  "(marketing)",
  "[locale]",
);

const HOME_PAGE = path.join(MARKETING_ROOT, "page.tsx");

function collectPages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectPages(full);
    return entry.name === "page.tsx" ? [full] : [];
  });
}

/**
 * Yakalayıcı rota (`[...rest]/page.tsx`) da dışarıda: içerik döndürmüyor,
 * `notFound()` fırlatıyor. Canonical ve hreflang beyanı olmaması bilinçli —
 * 404'ün karşı dilde eşdeğeri yok, `noindex` veriyor (denetim T-08).
 */
const PAGES = collectPages(MARKETING_ROOT).filter(
  (p) => p !== HOME_PAGE && !p.includes("[..."),
);

const cases = PAGES.map(
  (file) => [path.relative(MARKETING_ROOT, file), file] as const,
);

describe("marketing sayfalarının metadata'sı", () => {
  it("ana sayfa dışındaki her sayfa taranır", () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(13);
  });

  it.each(cases)("%s kendi generateMetadata'sını dışa aktarır", (_n, file) => {
    const src = readFileSync(file, "utf8");
    expect(src).toMatch(/export async function generateMetadata\s*\(/);
    expect(src).toContain("buildMetadata");
  });

  it.each(cases)("%s iki dilli path eşlemesi kurar", (_n, file) => {
    const src = readFileSync(file, "utf8");
    // Statik sayfada `PATHS` sabiti, detay sayfasında `*Paths()` yardımcısı;
    // ikisi de `tr:` / `en:` anahtarlarını `/tr/` ve `/en/` ile yazar.
    expect(src).toMatch(/tr:\s*['\`"]\/tr\//);
    expect(src).toMatch(/en:\s*['\`"]\/en\//);
  });

  it("hiçbir sayfa başka bir sayfanın canonical'ını kullanmaz", () => {
    const trPaths = PAGES.flatMap((file) => {
      const src = readFileSync(file, "utf8");
      const match = src.match(/tr:\s*['\`"](\/tr\/[^'\`"$]*)/);
      return match?.[1] ? [match[1]] : [];
    });
    expect(trPaths).toHaveLength(PAGES.length);
    expect(new Set(trPaths).size).toBe(trPaths.length);
  });

  it("Diagnoo araç sayfası taranan sayfalar arasındadır", () => {
    const target = path.join(MARKETING_ROOT, "araclar", "diagnoo", "page.tsx");
    expect(PAGES).toContain(target);
  });

  it("Diagnoo araç sayfası lansmandan sonra artık noindex döndürmez", () => {
    // 2026-09-03: `DIAGNOO_TOOL.published: true` (Faz 2 Görev 10). Sayfanın
    // `generateMetadata`'sı bayrağa göre dallanır — `published` iken
    // `robots: { index:false, follow:false }` bloğu hiç dönmez, sayfa
    // `buildMetadata`'nın varsayılan `index:true, follow:true` metadata'sını
    // kullanır. Dallanmanın kendisi (`if (tool.published) return base;`)
    // koddan kaldırılmadı — sırlar/migration gelene kadar bayrak `false`ya
    // dönerse aynı kapı yeniden devreye girer.
    const src = readFileSync(
      path.join(MARKETING_ROOT, "araclar", "diagnoo", "page.tsx"),
      "utf8",
    );
    expect(src).toMatch(/if\s*\(\s*tool\.published\s*\)\s*return\s*base;/);
    expect(src).toMatch(/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
    // Bayrağın kendisi de burada doğrulanır: mekanizma (dallanma) koddan
    // kaldırılmadı, ama bugün gerçekten `true` olduğu için dal hiç işlemez.
    expect(DIAGNOO_TOOL.published).toBe(true);
  });

  it("Diagnoo rapor sayfası dizine girmez", () => {
    // Rapor tek bir teşhise bağlı ve kişiye özel; `follow` otoritenin araç
    // sayfasına akmasını sürdürür (GEO paylaşım sonucuyla aynı kalıp).
    const src = readFileSync(
      path.join(MARKETING_ROOT, "araclar", "diagnoo", "rapor", "[id]", "page.tsx"),
      "utf8",
    );
    expect(src).toMatch(/robots:\s*\{\s*index:\s*false/);
    expect(src).toMatch(/follow:\s*true/);
  });

  it("gizlilik sayfası dizine girmez", () => {
    const src = readFileSync(
      path.join(MARKETING_ROOT, "gizlilik-kvkk", "page.tsx"),
      "utf8",
    );
    expect(src).toMatch(/robots:\s*\{\s*index:\s*false/);
  });
});
