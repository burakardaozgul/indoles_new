import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { PACKAGES } from "@/lib/content/packages";
import { CONSULTANTS, BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import { ARTICLES } from "@/lib/content/articles";
import { SITE_URL } from "@/lib/seo/site";

const entries = sitemap();
const urls = entries.map((e) => e.url);

describe("sitemap", () => {
  it("12 hizmetin TR ve EN URL'ini içerir", () => {
    for (const s of SERVICES) {
      expect(urls).toContain(`${SITE_URL}/tr/hizmetler/${s.slug.tr}`);
      expect(urls).toContain(`${SITE_URL}/en/services/${s.slug.en}`);
    }
  });

  it("3 pillar'ın iki dildeki URL'ini içerir", () => {
    for (const p of PILLARS) {
      expect(urls).toContain(`${SITE_URL}/tr/hizmetler/${p.key}`);
      expect(urls).toContain(`${SITE_URL}/en/services/${p.key}`);
    }
  });

  it("her girdide hreflang alternatifleri vardır", () => {
    for (const e of entries) {
      expect(e.alternates?.languages?.tr, e.url).toBeTruthy();
      expect(e.alternates?.languages?.en, e.url).toBeTruthy();
      expect(e.alternates?.languages?.["x-default"], e.url).toBeTruthy();
    }
  });

  it("hizmet detayına 0.8, pillar'a 0.9 priority verir", () => {
    const svc = entries.find((e) => e.url.endsWith("/tr/hizmetler/cro"));
    const pil = entries.find((e) => e.url.endsWith("/tr/hizmetler/growth"));
    expect(svc?.priority).toBe(0.8);
    expect(pil?.priority).toBe(0.9);
  });

  it("URL'ler benzersizdir", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("4 paketin iki dildeki detay URL'ini içerir", () => {
    for (const p of PACKAGES) {
      expect(urls).toContain(`${SITE_URL}/tr/paketler/${p.slug.tr}`);
      expect(urls).toContain(`${SITE_URL}/en/packages/${p.slug.en}`);
    }
  });

  it("rezervasyona açık danışmanların detay URL'ini içerir", () => {
    expect(BOOKABLE_CONSULTANTS.length).toBeGreaterThan(0);
    for (const c of BOOKABLE_CONSULTANTS) {
      expect(urls).toContain(`${SITE_URL}/tr/danismanlar/${c.slug}`);
      expect(urls).toContain(`${SITE_URL}/en/consultants/${c.slug}`);
    }
  });

  it("pillar'ı olmayan kadro kaydı sitemap'e girmez", () => {
    // `generateStaticParams` de `BOOKABLE_CONSULTANTS`ten üretiliyor: sitemap
    // orada olmayan bir profili verirse doğrudan 404'e link vermiş olur.
    const excluded = CONSULTANTS.filter((c) => c.pillars.length === 0);
    expect(excluded.length).toBeGreaterThan(0);
    for (const c of excluded) {
      expect(urls).not.toContain(`${SITE_URL}/tr/danismanlar/${c.slug}`);
      expect(urls).not.toContain(`${SITE_URL}/en/consultants/${c.slug}`);
    }
  });

  it("paket detayına 0.7, danışman detayına 0.6 priority verir", () => {
    const pkg = entries.find((e) => e.url.endsWith("/tr/paketler/mvp-build"));
    const person = entries.find((e) =>
      e.url.endsWith("/tr/danismanlar/burak-ozgul"),
    );
    expect(pkg?.priority).toBe(0.7);
    expect(person?.priority).toBe(0.6);
  });

  it("lastmod tek bir build anına sabitlenmiş değildir", () => {
    const stamps = new Set(
      entries.map((e) => new Date(e.lastModified as Date).toISOString()),
    );
    expect(stamps.size).toBeGreaterThan(1);
  });

  it("makale lastmod'u updatedAt, yoksa publishedAt'tir", () => {
    for (const a of ARTICLES) {
      const e = entries.find(
        (x) => x.url === `${SITE_URL}/tr/yazilar/${a.slug.tr}`,
      );
      expect(e, a.slug.tr).toBeTruthy();
      expect(new Date(e!.lastModified as Date).toISOString()).toBe(
        new Date(a.updatedAt ?? a.publishedAt).toISOString(),
      );
    }
  });

  it("yazı URL'lerinin tamamı yayında olan bir makaleye karşılık gelir", () => {
    // Silinen demo yazıların izi kalmasın: sitemap yalnız içerik katmanından
    // türetildiği sürece bu doğru kalır, sabit liste eklenirse düşer.
    const live = new Set([
      ...ARTICLES.map((a) => `${SITE_URL}/tr/yazilar/${a.slug.tr}`),
      ...ARTICLES.map((a) => `${SITE_URL}/en/articles/${a.slug.en}`),
    ]);
    const found = urls.filter(
      (u) => u.includes("/yazilar/") || u.includes("/articles/"),
    );
    expect(found.length).toBe(ARTICLES.length * 2);
    for (const u of found) expect(live.has(u)).toBe(true);
  });

  it("Diagnoo araç sayfasının iki dildeki URL'ini içerir", () => {
    expect(urls).toContain(`${SITE_URL}/tr/araclar/diagnoo`);
    expect(urls).toContain(`${SITE_URL}/en/tools/diagnoo`);
  });

  it("Diagnoo rapor sayfası sitemap'e girmez", () => {
    // Rapor tek bir teşhise bağlı, kişiye özel ve `noindex` — kanonik bir
    // arama yüzeyi değil (GEO paylaşım sonucuyla aynı gerekçe).
    expect(urls.some((u) => u.includes("/araclar/diagnoo/rapor"))).toBe(false);
    expect(urls.some((u) => u.includes("/tools/diagnoo/report"))).toBe(false);
  });

  it("x-default her zaman TR'yi gösterir", () => {
    for (const e of entries) {
      expect(e.alternates?.languages?.["x-default"], e.url).toBe(
        e.alternates?.languages?.tr,
      );
    }
  });
});
