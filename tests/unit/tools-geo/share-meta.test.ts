import { describe, expect, it } from "vitest";
import { ogImagePath, shareHost, shareTitle, toolOgImagePath } from "@/lib/tools/geo/share-meta";

describe("share-meta", () => {
  it("host www. olmadan, şemasız", () => {
    expect(shareHost("https://www.migros.com.tr/tr/kampanya")).toBe("migros.com.tr");
    expect(shareHost("http://ornek.com")).toBe("ornek.com");
    expect(shareHost("bozuk")).toBe("bozuk");
  });
  it("başlık iki dilde skor ve host taşır", () => {
    expect(shareTitle(55, "https://www.migros.com.tr", "tr")).toBe("GEO skoru 55/100 · migros.com.tr");
    expect(shareTitle(55, "https://www.migros.com.tr", "en")).toBe("GEO score 55/100 · migros.com.tr");
  });
});

describe("ogImagePath", () => {
  it("skoru 0-100'e kırpıp tam sayıya yuvarlar, locale klasörüne gider", () => {
    expect(ogImagePath(55, "tr")).toBe("/og/geo/tr/55.png");
    expect(ogImagePath(54.6, "en")).toBe("/og/geo/en/55.png");
    expect(ogImagePath(101, "tr")).toBe("/og/geo/tr/100.png");
    expect(ogImagePath(-3, "tr")).toBe("/og/geo/tr/0.png");
    expect(toolOgImagePath("en")).toBe("/og/geo/en/tool.png");
  });
});
