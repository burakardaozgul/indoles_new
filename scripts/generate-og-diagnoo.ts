/**
 * Diagnoo OG kartı — derleme zamanı üretim (ADR-031). Kalıp
 * `generate-og-geo.ts` ile birebir: Worker'da üretim yok, çünkü `@vercel/og`
 * paketi 3 MB plan sınırını aşıyordu (ADR-024). Script geliştirme makinesinde
 * çalışır, çıktı repoya girer; şablon değişmedikçe yeniden çalıştırılmaz.
 * Çalıştırma: `pnpm og:diagnoo`
 *
 * GEO'dan tek fark üretilen kart sayısı: locale başına TEK araç kartı. Rapor
 * sayfaları özel ve `noindex` olduğu için kova başına kart üretmenin karşılığı
 * yok (bkz. `src/lib/tools/diagnoo/share-meta.ts`).
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DiagnooToolCard } from "./og/diagnoo-card";

const OUT = path.join(process.cwd(), "public", "og", "diagnoo");
const LOCALES = ["tr", "en"] as const;
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=block";
/** `tests/unit/diagnoo-share-meta.test.ts` ile aynı tavan — kırmızı test yerine burada uyarı. */
const SIZE_LIMIT_BYTES = 150 * 1024;

function shell(body: string, locale: (typeof LOCALES)[number]): string {
  // `lang` olmadan CSS `text-transform: uppercase` Türkçe kural bilmeden
  // çalışır ve "YEDI" gibi bozuk büyük harfler basar — aynı hata kök
  // layout'ta da vardı (bkz. src/app/layout.tsx:95).
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT_LINK}"><style>html,body{margin:0;padding:0;background:#FAFAF7}</style></head><body>${body}</body></html>`;
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  let oversized = 0;

  for (const locale of LOCALES) {
    const file = path.join(OUT, locale, "tool.png");
    const markup = renderToStaticMarkup(createElement(DiagnooToolCard, { locale }));
    await page.setContent(shell(markup, locale), { waitUntil: "networkidle" });
    await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<void> } }).fonts.ready);
    const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, png);
    const { size } = statSync(file);
    if (size > SIZE_LIMIT_BYTES) oversized += 1;
    console.log(`[og:diagnoo] ${locale}: tool.png yazıldı (${Math.round(size / 1024)} KB)`);
  }

  await browser.close();
  if (oversized > 0) {
    console.warn(`[og:diagnoo] ${oversized} kart 150 KB üstünde — ADR-031: JPEG kalite 85 değerlendirilir`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
