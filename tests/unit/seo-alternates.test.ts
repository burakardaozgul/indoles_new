import { describe, it, expect } from "vitest";
import { buildAlternates } from "@/lib/seo/alternates";
import { SITE_URL, absoluteUrl } from "@/lib/seo/site";

const PATHS = { tr: "/tr/hizmetler/cro", en: "/en/services/cro" };

describe("buildAlternates", () => {
  it("canonical'ı çağıran locale'e ayarlar", () => {
    expect(buildAlternates(PATHS, "tr").canonical).toBe("/tr/hizmetler/cro");
    expect(buildAlternates(PATHS, "en").canonical).toBe("/en/services/cro");
  });

  it("her iki locale'i de listeler — self-hreflang Google gereği", () => {
    const langs = buildAlternates(PATHS, "en").languages!;
    expect(langs.tr).toBe("/tr/hizmetler/cro");
    expect(langs.en).toBe("/en/services/cro");
  });

  it("x-default'u TR'ye bağlar — birincil pazar", () => {
    expect(buildAlternates(PATHS, "en").languages!["x-default"]).toBe(
      "/tr/hizmetler/cro",
    );
  });
});

describe("SITE_URL", () => {
  it("protokol içerir ve sonda slash bırakmaz", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("absoluteUrl göreli yolu tam URL'e çevirir", () => {
    expect(absoluteUrl("/tr/hizmetler")).toBe(`${SITE_URL}/tr/hizmetler`);
  });

  it("absoluteUrl çift slash üretmez", () => {
    expect(absoluteUrl("tr/hizmetler")).toBe(`${SITE_URL}/tr/hizmetler`);
  });
});
