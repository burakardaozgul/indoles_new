/**
 * OG kartları — derleme zamanı üretim (ADR-031). Worker'da üretim yok:
 * `@vercel/og` paketi 3 MB plan sınırını aşıyordu (ADR-024). Bu script
 * geliştirme makinesinde çalışır, çıktı repoya girer; şablon değişmedikçe
 * yeniden çalıştırılmaz. Çalıştırma: `pnpm og:geo`
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GeoCard, ToolCard } from "./og/geo-card";

const OUT = path.join(process.cwd(), "public", "og", "geo");
const LOCALES = ["tr", "en"] as const;
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=block";
const SIZE_WARN_BYTES = 40 * 1024;

function shell(body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT_LINK}"><style>html,body{margin:0;padding:0;background:#FAFAF7}</style></head><body>${body}</body></html>`;
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  let oversized = 0;

  async function shoot(file: string, element: ReturnType<typeof createElement>): Promise<void> {
    await page.setContent(shell(renderToStaticMarkup(element)), { waitUntil: "networkidle" });
    await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<void> } }).fonts.ready);
    const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, png);
    if (statSync(file).size > SIZE_WARN_BYTES) oversized += 1;
  }

  for (const locale of LOCALES) {
    for (let score = 0; score <= 100; score += 1) {
      await shoot(path.join(OUT, locale, `${score}.png`), createElement(GeoCard, { score, locale }));
    }
    await shoot(path.join(OUT, locale, "tool.png"), createElement(ToolCard, { locale }));
    console.log(`[og:geo] ${locale}: 102 kart yazıldı`);
  }

  await browser.close();
  if (oversized > 0) {
    console.warn(`[og:geo] ${oversized} kart 40 KB üstünde — spec §12: JPEG kalite 85 değerlendirilir`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
