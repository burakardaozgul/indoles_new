import { describe, it, expect } from "vitest";
import { GET } from "@/app/sitemap-eski.xml/route";
import {
  LEGACY_REDIRECTS,
  EN_CASE_SLUG_REDIRECTS,
  legacySitemapPaths,
} from "@/lib/seo/legacy-redirects";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Eski-URL sitemap'i (indeks denetimi 2026-09-18). Amaç Googlebot'u eski
 * adreslere götürüp 301'leri gördürmek; listede yönlendirmesi olmayan bir
 * adres 404'e götürür ve tam tersini yapar.
 */
describe("sitemap-eski.xml", () => {
  const xml = new Response(GET().body).text();
  const locs = async () =>
    [...(await xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

  it("her adres yönlendirme listesindeki bir kaynağa karşılık gelir", async () => {
    const sources = new Set(
      LEGACY_REDIRECTS.map((r) => `${SITE_URL}${r.source}/`)
    );
    const list = await locs();
    expect(list.length).toBeGreaterThan(30);
    for (const loc of list) expect(sources.has(loc), loc).toBe(true);
  });

  it("joker desenler ve EN vaka slug yönlendirmeleri listeye girmez", async () => {
    const list = await locs();
    for (const loc of list) {
      const path = loc.slice(SITE_URL.length);
      expect(path, loc).not.toContain(":");
      expect(path, loc).not.toContain("/en/");
    }
    for (const r of EN_CASE_SLUG_REDIRECTS) {
      expect(list).not.toContain(`${SITE_URL}${r.source}/`);
    }
  });

  it("eski sitenin indekslediği biçimi kullanır: eğik çizgili, tekrarsız", () => {
    const paths = legacySitemapPaths();
    for (const p of paths) expect(p.endsWith("/"), p).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("indeks denetimindeki dört eski hizmet URL'ini içerir", async () => {
    const list = await locs();
    for (const p of [
      "/cro-donusum-orani-optimizasyonu/",
      "/e-ticaret-danismanligi/",
      "/sosyal-medya-pazarlama/",
      "/web-tasarim-ui-ux-tasarimi/",
    ]) {
      expect(list).toContain(`${SITE_URL}${p}`);
    }
  });

  it("geçerli XML zarfı ve doğru içerik türü döner", async () => {
    const body = await xml;
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(body).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(body.trimEnd().endsWith("</urlset>")).toBe(true);
    expect(GET().headers.get("content-type")).toContain("application/xml");
  });
});
