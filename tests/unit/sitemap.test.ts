import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
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

  it("x-default her zaman TR'yi gösterir", () => {
    for (const e of entries) {
      expect(e.alternates?.languages?.["x-default"], e.url).toBe(
        e.alternates?.languages?.tr,
      );
    }
  });
});
