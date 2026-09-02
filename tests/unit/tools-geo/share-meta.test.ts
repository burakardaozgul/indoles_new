import { describe, expect, it } from "vitest";
import { shareHost, shareTitle } from "@/lib/tools/geo/share-meta";

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
