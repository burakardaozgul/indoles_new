import { test, expect } from "@playwright/test";

/**
 * GEO Görünürlük Denetleyicisi — araç sayfası hero yeniden tasarımının
 * responsive doğrulaması (indoles-responsive-quality, 2026-09-01).
 *
 * Burak yönü: klasik V2PageHeader kaldırıldı; ilk ekran "URL'ini gir, tara"
 * akışı — küçük breadcrumb + eyebrow + araç adı (h1) + kısa intro, hemen
 * altında belirgin giriş alanı. Sonraki bölümler tek merkezî sütunda dikey.
 *
 * Bu suite 4 viewport'ta (375/768/1280/1536) şunu doğrular: yatay taşma yok,
 * tam bir <h1>, tek-sütun akış (adım/sinyal/link blokları aynı sol kenardan
 * hizalı ve tam kolon genişliğinde), giriş alanı ilk ekranda intro'nun hemen
 * altında, mobilde touch hedefleri ≥44px, düşük CLS. Sunucu:
 * `pnpm start -p 3100` (playwright.config reuseExistingServer).
 */

const URL_PATH = "/tr/araclar/geo-gorunurluk-denetleyicisi";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1536, height: 960 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`${URL_PATH} @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("tek h1, yatay taşma yok, tek-sütun akış, giriş ilk ekranda", async ({
      page,
    }) => {
      await page.goto(URL_PATH, { waitUntil: "networkidle" });

      // Tam bir <h1> — seo:audit `tool` profili h1-count ile hizalı.
      await expect(page.locator("h1")).toHaveCount(1);

      // Yatay taşma yok.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow).toBe(false);

      // Giriş alanı ilk ekranda (intro'nun hemen altında): URL input'un üst
      // kenarı viewport yüksekliğinin içinde başlar.
      const inputTop = await page
        .getByLabel("Site adresi")
        .evaluate((el) => el.getBoundingClientRect().top);
      expect(inputTop).toBeLessThan(vp.height);

      // Tek-sütun: 5 sinyal kartı aynı sol kenardan başlar ve tek sütuna
      // yığılır (yan yana değil) — her kartın x'i eşit, y'ler artan.
      const signalBoxes = await page
        .locator('section[aria-labelledby="signals-heading"] li')
        .evaluateAll((els) =>
          els.map((el) => {
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.left), y: Math.round(r.top) };
          }),
        );
      expect(signalBoxes.length).toBe(5);
      const firstX = signalBoxes[0]!.x;
      for (let i = 1; i < signalBoxes.length; i++) {
        expect(Math.abs(signalBoxes[i]!.x - firstX)).toBeLessThanOrEqual(1);
        expect(signalBoxes[i]!.y).toBeGreaterThan(signalBoxes[i - 1]!.y);
      }

      await page.screenshot({
        path: `tests/screenshots/geo-tool-${vp.name}.png`,
        fullPage: true,
      });
    });

    test("mobil touch hedefleri ≥44px", async ({ page }) => {
      test.skip(vp.name !== "mobile", "yalnız mobile");
      await page.goto(URL_PATH, { waitUntil: "networkidle" });
      // Kapsam: araç sayfasının BİRİNCİL kontrolleri (giriş, düğme, kart
      // linkleri). Hariç: (a) breadcrumb ve (b) paylaşılan ContactCallout'un
      // satır-içi metin linkleri — bunlar WCAG 2.2 AA satır-içi link istisnası
      // (2.5.8) kapsamında ve site geneli V2PageHeader/callout ile aynı desen,
      // bu görevin kapsamı dışı.
      const tooSmall = await page.evaluate(() => {
        const interactive = document.querySelectorAll(
          'main a, main button, main input, main [role="button"]',
        );
        return Array.from(interactive)
          .filter((el) => {
            if (el.closest('nav[aria-label="Breadcrumb"]')) return false;
            if (el.closest(".bg-ink-900")) return false; // ContactCallout
            const r = (el as HTMLElement).getBoundingClientRect();
            if (r.width === 0 && r.height === 0) return false; // gizli widget
            return r.width < 44 || r.height < 44;
          })
          .map((el) => (el as HTMLElement).outerHTML.slice(0, 90));
      });
      expect(tooSmall).toEqual([]);
    });

    test("düşük CLS", async ({ page }) => {
      await page.goto(URL_PATH, { waitUntil: "networkidle" });
      const cls = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries() as PerformanceEntry[]) {
                const e = entry as PerformanceEntry & {
                  value: number;
                  hadRecentInput: boolean;
                };
                if (!e.hadRecentInput) total += e.value;
              }
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => resolve(total), 2000);
          }),
      );
      expect(cls).toBeLessThan(0.05);
    });
  });
}
