import { describe, it, expect } from "vitest";
import { generateMetadata as localeLayoutMetadata } from "@/app/(marketing)/[locale]/layout";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * OG görselinin alt metni her iki metadata yolunda da sayfanın dilinde
 * olmalı.
 *
 * Site iki ayrı yoldan OG kuruyor: iç sayfalar `buildMetadata` üzerinden,
 * ana sayfa ise `[locale]/layout.tsx` içinde elle. İlk düzeltme yalnız
 * `buildMetadata`ya uygulandı ve ana sayfa gözden kaçtı — EN ana sayfada
 * `og:image:alt` Türkçe kaldı. En çok paylaşılan sayfa da orası.
 */
function altOf(meta: { openGraph?: unknown }): string {
  const og = meta.openGraph as { images: Array<{ alt: string }> };
  return og.images[0]!.alt;
}

describe("og:image:alt — iç sayfalar (buildMetadata)", () => {
  it("EN'de İngilizce", () => {
    const meta = buildMetadata({
      title: "T", description: "d",
      paths: { tr: "/tr/x", en: "/en/x" }, locale: "en",
    });
    expect(altOf(meta)).not.toMatch(/İş geliştirme/);
  });
});

describe("og:image:alt — ana sayfa (locale layout)", () => {
  it("TR ana sayfada Türkçe", async () => {
    const meta = await localeLayoutMetadata({ params: Promise.resolve({ locale: "tr" }) });
    expect(altOf(meta)).toMatch(/İş geliştirme/);
  });

  it("EN ana sayfada İngilizce", async () => {
    const meta = await localeLayoutMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(altOf(meta)).toMatch(/[Bb]usiness/);
    expect(altOf(meta)).not.toMatch(/İş geliştirme/);
  });
});
