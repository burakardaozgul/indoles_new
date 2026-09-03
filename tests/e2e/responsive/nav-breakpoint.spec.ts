import { test, expect } from "@playwright/test";

/**
 * V2Nav kırılım eşiği regresyonu — Faz 2 lansman düzeltme dalgası madde B
 * (Task 11 review Important).
 *
 * Kırılım 1180 → 1280px'e taşındı (docs/04 §12.11, `src/styles/v2.css`
 * `@media (max-width: 1280px)`) — sistemin kanonik `desktop` token'ıyla
 * hizalanmak için (beşinci link + logo + dil değiştirici + araç girişi + CTA
 * 1180px'de artık sığmıyordu). Hiçbir test bu eşiği sabitlemiyordu; sonraki
 * bir nav düzenlemesi eşiği sessizce geri kaydırabilirdi. Bu suite iki uçtaki
 * (1279/1281px) davranışı kilitler.
 *
 * Sunucu: `pnpm dev` (playwright.config webServer, reuseExistingServer) —
 * `geo-tool-responsive.spec.ts`/`blob-variant.spec.ts` ile AYNI harness.
 */

const URL_PATH = "/tr";

test.describe("V2Nav kırılım eşiği (1280px) — 1279px", () => {
  test.use({ viewport: { width: 1279, height: 900 } });

  test("burger görünür, tam link satırı ve aksiyonlar gizli", async ({ page }) => {
    await page.goto(URL_PATH, { waitUntil: "networkidle" });

    await expect(page.locator(".v2-nav-burger")).toBeVisible();
    await expect(page.locator(".v2-nav-links")).toBeHidden();
    await expect(page.locator(".v2-nav-actions")).toBeHidden();
  });
});

test.describe("V2Nav kırılım eşiği (1280px) — 1281px", () => {
  test.use({ viewport: { width: 1281, height: 900 } });

  test("tam link satırı ve aksiyonlar görünür, burger gizli", async ({ page }) => {
    await page.goto(URL_PATH, { waitUntil: "networkidle" });

    await expect(page.locator(".v2-nav-links")).toBeVisible();
    await expect(page.locator(".v2-nav-actions")).toBeVisible();
    await expect(page.locator(".v2-nav-burger")).toBeHidden();
  });
});
