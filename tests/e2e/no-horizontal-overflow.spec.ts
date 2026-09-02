import { test, expect } from "@playwright/test";

/**
 * Yatay taşma regresyonu.
 *
 * Tek bir elemanın viewport'u aşması bütün sayfayı iOS Safari'de sağa-sola
 * kaydırılabilir yapıyor: `overflow-x: hidden` body'de olsa bile WebKit
 * belgeyi yine de yatay kaydırıyor. Bu spec her ana route'ta belge
 * genişliğinin viewport'u aşmadığını doğrular — kaynağı ne olursa olsun
 * (grid min-content şişmesi, negatif margin, vw hesabı) burada yakalanır.
 *
 * İlk yakalanan vaka: `.ind-grid` sütunları `repeat(2, 1fr)` iken item
 * min-content'i track'i şişiriyordu (/tr/hizmetler, 390px'te 451px belge).
 */

const ROUTES = [
  "/tr",
  "/tr/hizmetler",
  "/tr/hizmetler/performans-pazarlama",
  "/tr/vakalar",
  "/tr/vakalar/gymwolves-12-kat-satis",
  "/tr/hakkimizda",
  "/tr/paketler",
  "/tr/yazilar",
  "/tr/danismanlar",
  "/tr/iletisim",
  "/tr/araclar",
  "/tr/araclar/geo-gorunurluk-denetleyicisi",
  "/en",
  "/en/services",
];

for (const route of ROUTES) {
  test(`yatay taşma yok: ${route}`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    // Font yüklenmesi ve ilk layout otursun — genişlik ölçümü stabil olsun.
    await page.waitForLoadState("networkidle");

    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));

    // 1px tolerans: subpixel yuvarlama farkları taşma sayılmaz.
    expect(
      scrollW,
      `${route} belge genişliği viewport'u aşıyor (${scrollW} > ${clientW})`
    ).toBeLessThanOrEqual(clientW + 1);
  });
}
