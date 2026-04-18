import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("entry popup happy path", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();

    // Stub Turnstile before any page script runs
    await page.addInitScript(() => {
      (
        window as unknown as {
          turnstile: {
            render: (
              el: Element,
              opts: { callback: (t: string) => void }
            ) => void;
          };
        }
      ).turnstile = {
        render: (_el, opts) => {
          opts.callback("e2e-test-token");
        },
      };
    });

    // Mock /api/visitor-profile so the popup submit works without a live server
    await page.route("**/api/visitor-profile", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          calComEmbedUrl: "https://cal.com/indoles/gorusme?mock=1",
        }),
      })
    );
  });

  test("Stage 1 → 2 → 3 → contact submit", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /dönüşüm ve teknoloji/i }).click();

    const checkboxes = page.getByRole("checkbox");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();
    await page.getByRole("button", { name: /devam/i }).click();

    await page.getByRole("button", { name: /bize anlatın/i }).click();

    await page.locator("#firstName").fill("Ali");
    await page.locator("#lastName").fill("Veli");
    await page.locator("#phone").fill("+905551234567");
    await page.locator("#email").fill("ali@ornek.com");
    await page.locator("#company").fill("Test AŞ");
    await page.locator("#title").fill("CTO");
    await page.getByRole("checkbox", { name: /kvkk/i }).check();

    await page.getByRole("button", { name: /bize anlatın/i }).last().click();

    await expect(page.getByText(/teşekkürler/i)).toBeVisible();
  });

  test("skip → popup kapanır", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await page.getByRole("button", { name: /kapat/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("PersonaChip → popup yeniden açılır", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await page.getByRole("button", { name: /büyüme ve yeni pazarlar/i }).click();
    await page.getByRole("checkbox").nth(0).check();
    await page.getByRole("checkbox").nth(1).check();
    await page.getByRole("checkbox").nth(2).check();
    await page.getByRole("button", { name: /devam/i }).click();
    await page.getByRole("button", { name: /şimdilik gezinmeye/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.getByRole("button", { name: /değiştir/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
