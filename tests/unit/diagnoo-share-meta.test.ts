import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/(marketing)/[locale]/araclar/diagnoo/page";
import { diagnooOgImagePath } from "@/lib/tools/diagnoo/share-meta";

/**
 * Diagnoo paylaşım kartı (ADR-031 kalıbı).
 *
 * GEO ile aynı yol: kart derleme zamanında Playwright ile üretilir
 * (`pnpm og:diagnoo`, `scripts/generate-og-diagnoo.ts`) ve `public/`e girer;
 * Worker'da istek başına üretim yok (ADR-024 paket sınırı). GEO'dan tek fark
 * kart SAYISI: Diagnoo'nun rapor sayfaları özel ve noindex, paylaşılan tek
 * yüzey araç sayfasıdır — skor başına kart üretmek karşılığı olmayan bir
 * varlık yığını olurdu (kova kartı YAGNI).
 */
const LOCALES = ["tr", "en"] as const;

/** ADR-031 §Sonuçlar: statik varlık boyutu gözetilir; GEO kartları 40 KB bandında. */
const MAX_BYTES = 150 * 1024;

describe("diagnooOgImagePath", () => {
  it("locale klasöründeki tek araç kartına işaret eder", () => {
    expect(diagnooOgImagePath("tr")).toBe("/og/diagnoo/tr/tool.png");
    expect(diagnooOgImagePath("en")).toBe("/og/diagnoo/en/tool.png");
  });
});

describe("üretilmiş kart dosyaları", () => {
  it.each(LOCALES)("%s kartı repoda duruyor ve 150 KB altında", (locale) => {
    const file = path.join(
      process.cwd(),
      "public",
      diagnooOgImagePath(locale).replace(/^\//, ""),
    );
    expect(existsSync(file), `${file} yok — 'pnpm og:diagnoo' çalıştırılmadı`).toBe(
      true,
    );
    const { size } = statSync(file);
    expect(size, `${file}: ${size} bayt`).toBeLessThanOrEqual(MAX_BYTES);
  });
});

describe("Diagnoo sayfası metadata'sı", () => {
  it.each(LOCALES)("%s: openGraph görseli araç kartıdır", async (locale) => {
    const meta = await generateMetadata({ params: Promise.resolve({ locale }) });
    const og = meta.openGraph as { images: Array<{ url: string; alt: string }> };
    expect(og.images[0]!.url).toContain(diagnooOgImagePath(locale));
    // Alt metin sayfanın dilinde olmalı (og-image-alt.test.ts ile aynı kural).
    expect(og.images[0]!.alt?.trim()).toBeTruthy();
  });

  it.each(LOCALES)("%s: twitter kartı da aynı görseli taşır", async (locale) => {
    const meta = await generateMetadata({ params: Promise.resolve({ locale }) });
    const tw = meta.twitter as { images: string[] };
    expect(tw.images[0]).toContain(diagnooOgImagePath(locale));
  });
});
