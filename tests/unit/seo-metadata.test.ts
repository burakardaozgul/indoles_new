import { describe, it, expect } from "vitest";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * `Metadata["openGraph"]` bir union ve `type`/`url` alanları yalnız bazı
 * varyantlarda tanımlı. Test iddiaları için tek yerde daraltıyoruz —
 * her assertion'a ayrı `@ts-expect-error` koymak yerine.
 */
function og(m: Metadata): Record<string, unknown> {
  return m.openGraph as unknown as Record<string, unknown>;
}

/** `Metadata["twitter"]` de union; `card` yalnız bazı varyantlarda tanımlı. */
function tw(m: Metadata): Record<string, unknown> {
  return m.twitter as unknown as Record<string, unknown>;
}

const BASE = {
  title: "Performans pazarlama",
  description:
    "Google, LinkedIn ve Meta kanallarında B2B ve e-ticaret alıcısına ulaşan performans pazarlama yönetimi.",
  paths: {
    tr: "/tr/hizmetler/performans-pazarlama",
    en: "/en/services/performance-marketing",
  },
  locale: "tr" as const,
};

describe("buildMetadata", () => {
  it("title ve description'ı aynen taşır", () => {
    const m = buildMetadata(BASE);
    expect(m.title).toBe("Performans pazarlama");
    expect(m.description).toBe(BASE.description);
  });

  it("canonical'ı çağıran locale'e bağlar", () => {
    expect(buildMetadata(BASE).alternates?.canonical).toBe(
      "/tr/hizmetler/performans-pazarlama",
    );
  });

  it("OG locale'ini TR için tr_TR, EN için en_US yapar", () => {
    expect(buildMetadata(BASE).openGraph?.locale).toBe("tr_TR");
    expect(buildMetadata({ ...BASE, locale: "en" }).openGraph?.locale).toBe(
      "en_US",
    );
  });

  it("OG url'ini canonical ile aynı tutar — çelişen sinyal vermez", () => {
    const m = buildMetadata(BASE);
    expect(og(m).url).toBe(m.alternates?.canonical);
  });

  it("twitter kartını summary_large_image yapar", () => {
    expect(tw(buildMetadata(BASE)).card).toBe("summary_large_image");
  });

  it("varsayılan og:type website'tır", () => {
    expect(og(buildMetadata(BASE)).type).toBe("website");
  });

  it("article tipi istendiğinde onu kullanır", () => {
    expect(og(buildMetadata({ ...BASE, ogType: "article" })).type).toBe(
      "article",
    );
  });
});

describe("OG görselinin alt metni", () => {
  it("TR sayfada Türkçe", () => {
    const meta = buildMetadata({
      title: "X",
      description: "d",
      paths: { tr: "/tr/x", en: "/en/x" },
      locale: "tr",
    });
    const image = (meta.openGraph as { images: Array<{ alt: string }> }).images[0]!;
    expect(image.alt).toMatch(/İş geliştirme/);
  });

  it("EN sayfada İngilizce", () => {
    // Alt metin her sayfada Türkçe sabitti; EN paylaşımlarda ve ekran
    // okuyucularda yanlış dilde görünüyordu.
    const meta = buildMetadata({
      title: "X",
      description: "d",
      paths: { tr: "/tr/x", en: "/en/x" },
      locale: "en",
    });
    const image = (meta.openGraph as { images: Array<{ alt: string }> }).images[0]!;
    expect(image.alt).toMatch(/[Bb]usiness/);
    expect(image.alt).not.toMatch(/İş geliştirme/);
  });
});
