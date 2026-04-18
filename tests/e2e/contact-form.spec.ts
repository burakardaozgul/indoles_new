import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Stub Turnstile so the submit button is not disabled
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

  // Mock /api/contact — no real mail sent during tests
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    })
  );
});

test("contact form submit — happy path", async ({ page }) => {
  await page.goto("/tr/iletisim");

  // Fields use react-hook-form register(name) which sets the name attribute
  await page.locator('input[name="firstName"]').fill("Burak");
  await page.locator('input[name="lastName"]').fill("Özgül");
  await page.locator('input[name="email"]').fill("test@indoles.com.tr");
  await page.locator('input[name="phone"]').fill("+905551112233");
  await page.locator('input[name="company"]').fill("INDOLES");
  await page.locator('input[name="subject"]').fill("Proje");
  await page
    .locator('textarea[name="message"]')
    .fill("Uzun bir mesaj, 20 karakterden fazla elbette yazıyoruz.");

  await page.locator('select[name="budgetRange"]').selectOption("100k-250k");
  await page.locator('select[name="timeline"]').selectOption("1-3-months");

  // KVKK consent checkbox
  await page.locator('input[name="kvkkConsent"]').check();

  await page.getByRole("button", { name: /gönder/i }).click();

  // Success state renders the confirmation heading
  await expect(
    page.getByText(/mesajın elimizde|we got your message/i)
  ).toBeVisible();
});
