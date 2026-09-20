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
 *
 * 2026-09-20'den beri liste TR-slug'lı eski EN vaka adreslerini de taşır
 * (GSC hâlâ onları kanonik gösteriyordu). Biçim listeye göre değişir:
 * WordPress adresleri eğik çizgili, EN vaka adresleri çizgisiz.
 */
describe("sitemap-eski.xml", () => {
  const xml = new Response(GET().body).text();
  const locs = async () =>
    [...(await xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

  it("her adres iki yönlendirme listesinden birinin kaynağına karşılık gelir", async () => {
    const sources = new Set([
      ...LEGACY_REDIRECTS.map((r) => `${SITE_URL}${r.source}/`),
      ...EN_CASE_SLUG_REDIRECTS.map((r) => `${SITE_URL}${r.source}`),
    ]);
    const list = await locs();
    expect(list.length).toBeGreaterThan(30);
    for (const loc of list) expect(sources.has(loc), loc).toBe(true);
  });

  it("joker desenler girmez; EN vaka adresleri eğik çizgisiz girer", async () => {
    const list = await locs();
    for (const loc of list) {
      expect(loc.slice(SITE_URL.length), loc).not.toContain(":");
    }
    for (const r of EN_CASE_SLUG_REDIRECTS) {
      expect(list).toContain(`${SITE_URL}${r.source}`);
      expect(list).not.toContain(`${SITE_URL}${r.source}/`);
    }
    const legacyCount = LEGACY_REDIRECTS.filter(
      (r) => !r.source.includes(":")
    ).length;
    expect(legacyCount).toBe(41);
    expect(EN_CASE_SLUG_REDIRECTS.length).toBe(9);
    expect(list.length).toBe(legacyCount + EN_CASE_SLUG_REDIRECTS.length);
    expect(list.length).toBe(50);
  });

  it("her adres kanonik biçimindedir: WP eğik çizgili, EN vaka çizgisiz, tekrarsız", () => {
    const paths = legacySitemapPaths();
    const enSources = new Set(EN_CASE_SLUG_REDIRECTS.map((r) => r.source));
    for (const p of paths) {
      if (enSources.has(p)) expect(p.endsWith("/"), p).toBe(false);
      else expect(p.endsWith("/"), p).toBe(true);
    }
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
