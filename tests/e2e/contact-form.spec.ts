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

  // `/tr/iletisim` also renders the footer newsletter signup, which has its
  // own `input[name="email"]` (`id="v2-newsletter-email"`) — an unscoped
  // locator resolves to two elements and Playwright's strict mode throws
  // (confirmed live: "strict mode violation ... resolved to 2 elements").
  // The `<form>` here carries no accessible name/data-testid to key off of,
  // so scope on a field unique to this specific business form (`subject` —
  // budget/timeline/subject only exist on the contact form, never on the
  // newsletter or booking-widget forms).
  const form = page.locator("form").filter({ has: page.locator('input[name="subject"]') });

  // Fields use react-hook-form register(name) which sets the name attribute
  await form.locator('input[name="firstName"]').fill("Burak");
  await form.locator('input[name="lastName"]').fill("Özgül");
  await form.locator('input[name="email"]').fill("test@indoles.com.tr");
  await form.locator('input[name="phone"]').fill("+905551112233");
  await form.locator('input[name="company"]').fill("INDOLES");
  await form.locator('input[name="subject"]').fill("Proje");
  await form
    .locator('textarea[name="message"]')
    .fill("Uzun bir mesaj, 20 karakterden fazla elbette yazıyoruz.");

  await form.locator('select[name="budgetRange"]').selectOption("100k-250k");
  await form.locator('select[name="timeline"]').selectOption("1-3-months");

  // KVKK consent checkbox
  await form.locator('input[name="kvkkConsent"]').check();

  await form.getByRole("button", { name: /gönder/i }).click();

  // Success state renders the confirmation heading
  await expect(
    page.getByText(/mesajın elimizde|we got your message/i)
  ).toBeVisible();
});
