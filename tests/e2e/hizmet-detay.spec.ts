import { test, expect } from "@playwright/test";
import { SERVICES } from "../../src/lib/content/services";

for (const service of SERVICES) {
  test(`TR hizmet sayfası açılır: ${service.slug.tr}`, async ({ page }) => {
    const res = await page.goto(`/tr/hizmetler/${service.slug.tr}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(service.name.tr);
  });

  test(`EN hizmet sayfası açılır: ${service.slug.en}`, async ({ page }) => {
    const res = await page.goto(`/en/services/${service.slug.en}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(service.name.en);
  });
}

test("bilinmeyen slug 404 döner", async ({ page }) => {
  const res = await page.goto("/tr/hizmetler/olmayan-hizmet");
  expect(res?.status()).toBe(404);
});

test("çapraz locale slug'ı 404 döner — çift içerik olmaz", async ({ page }) => {
  const res = await page.goto("/en/services/performans-pazarlama");
  expect(res?.status()).toBe(404);
});

test("pillar sayfası bozulmadı", async ({ page }) => {
  const res = await page.goto("/tr/hizmetler/growth");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("Growth");
});

test("anasayfa hizmet kartları hizmet sayfalarına gider", async ({ page }) => {
  // Bu testin varlık sebebi: kartlar eskiden pillar sayfasına gidiyordu ve
  // ziyaretçi "Performans pazarlama"ya tıklayıp beş hizmetlik bir disiplin
  // sayfasına düşüyordu (spec §1.1).
  await page.goto("/tr");

  // Anasayfa WebGL ve GSAP taşıyor; ilk derleme varsayılan 5sn'yi aşabiliyor.
  const track = page.locator(".v2-svc").first();
  await track.waitFor({ state: "attached", timeout: 30_000 });

  await expect(track.getByRole("link")).toHaveAttribute(
    "href",
    "/tr/hizmetler/marka-stratejisi",
  );

  // Tek kart değil, on ikisi birden hizmete gitmeli.
  const hrefs = await page.locator(".v2-svc-link").evaluateAll((els) =>
    els.map((e) => e.getAttribute("href")),
  );
  expect(hrefs).toHaveLength(12);
  for (const href of hrefs) {
    expect(href).toMatch(/^\/tr\/hizmetler\/[a-z-]+$/);
    expect(["growth", "transform", "build"]).not.toContain(
      href?.split("/").pop(),
    );
  }
});

test("SSS akordeonu tıklamayla açılır", async ({ page }) => {
  // Blob kanvası bir dönem tüm tıklamaları yutuyordu (docs/16, polish turu).
  await page.goto("/tr/hizmetler/performans-pazarlama");
  const first = page.locator("details").first();
  await expect(first).not.toHaveAttribute("open", "");
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
});

test("hizmet sayfasında persona varyantı sızmaz", async ({ page }) => {
  // Hizmet detay orta ton, tek versiyon (docs/03 §1, ADR-014).
  await page.goto("/tr/hizmetler/cro");
  await expect(page.locator("[data-persona-variant]")).toHaveCount(0);
});

test("eski WordPress URL'i kalıcı olarak yönlendirir", async ({ page }) => {
  await page.goto("/e-ticaret-danismanligi");
  expect(page.url()).toContain("/tr/hizmetler/e-ticaret");
});
