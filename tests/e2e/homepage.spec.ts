import { test, expect } from "@playwright/test";

test("TR anasayfa yüklenir ve hero render olur", async ({ page }) => {
  await page.goto("/tr");
  await expect(page.locator("h1")).toContainText("teknoloji dönüşümü");
});

test("EN anasayfa yüklenir", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("h1")).toContainText("Technology transformation");
});

test("health endpoint çalışır", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json.status).toBe("ok");
});
