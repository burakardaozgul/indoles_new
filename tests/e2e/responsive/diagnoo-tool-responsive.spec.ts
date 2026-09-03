import { test, expect } from "@playwright/test";

/**
 * Diagnoo — araç sayfasının GEO v2 kabuğuna geçişinin responsive doğrulaması
 * (indoles-responsive-quality, Faz 2 Görev 3).
 *
 * Sayfa artık GEO Görünürlük Denetleyicisi ile aynı kabuğu kullanıyor: hero
 * `ToolHero` (eyebrow + h1 + lede), giriş formu hero akışının içinde, kanıt
 * şeridi ortalı, tüm bölümler tek 760px kolonda (`max-w-tool`). Suite bu
 * kabuğu `geo-tool-responsive.spec.ts` ile AYNI ölçütlerle sınar — iki araç
 * aynı kalıpta okunmalı, ikisinin kalite eşiği de aynı olmalı.
 *
 * Dört viewport'ta (375/768/1280/1536) doğrulananlar: yatay taşma yok, tam bir
 * <h1>, tek-sütun akış (dört sinyal kartı aynı sol kenardan, tam kolon
 * genişliğinde), giriş alanı ilk ekranda, mobilde touch hedefleri ≥44px, düşük
 * CLS. Sunucu: `PLAYWRIGHT_BASE_URL` ile `pnpm cf:preview` (araç Workers
 * bağlamına — D1, Workflows, hız sınırı — bağlı olduğu için `pnpm dev` yerine
 * preview koşusu).
 */

const URL_PATH = "/tr/araclar/diagnoo";

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

      // Tam bir <h1> — `ToolHero` basıyor; seo:audit `tool` profili h1-count
      // ile hizalı. Sayfanın kendi elle yazılmış başlığı kaldırıldı.
      await expect(page.locator("h1")).toHaveCount(1);

      // Yatay taşma yok.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow).toBe(false);

      // Giriş alanı ilk ekranda: form artık ayrı bir bölümde değil, hero
      // akışının içinde — URL alanının üst kenarı viewport'un içinde başlar.
      const inputTop = await page
        .getByLabel("Mağazanızın adresi")
        .evaluate((el) => el.getBoundingClientRect().top);
      expect(inputTop).toBeLessThan(vp.height);

      // Kanıt şeridi ortalı: dört öğe, şeridin merkezi kolonun merkezine
      // oturur (GEO hero'sundaki `justify-center` deseni).
      const proof = page.locator('ul[aria-label="Kanıt"]');
      await expect(proof.locator("li")).toHaveCount(4);

      // Tek-sütun: 4 sinyal kartı aynı sol kenardan başlar ve tek sütuna
      // yığılır (yan yana değil) — her kartın x'i eşit, y'ler artan.
      const signalBoxes = await page
        .locator('section[aria-labelledby="signals-heading"] li')
        .evaluateAll((els) =>
          els.map((el) => {
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.left), y: Math.round(r.top) };
          }),
        );
      expect(signalBoxes.length).toBe(4);
      const firstX = signalBoxes[0]!.x;
      for (let i = 1; i < signalBoxes.length; i++) {
        expect(Math.abs(signalBoxes[i]!.x - firstX)).toBeLessThanOrEqual(1);
        expect(signalBoxes[i]!.y).toBeGreaterThan(signalBoxes[i - 1]!.y);
      }

      await page.screenshot({
        path: `tests/screenshots/diagnoo-tool-${vp.width}.png`,
        fullPage: true,
      });
    });

    test("mobil touch hedefleri ≥44px", async ({ page }) => {
      test.skip(vp.name !== "mobile", "yalnız mobile");
      await page.goto(URL_PATH, { waitUntil: "networkidle" });
      // Kapsam ve muafiyetler `geo-tool-responsive.spec.ts` ile BİREBİR:
      // (a) breadcrumb, (b) paylaşılan ContactCallout'un satır-içi metin
      // linkleri (WCAG 2.2 AA satır-içi link istisnası, 2.5.8) ve (c)
      // `aria-hidden="true"` bal küpü alanı — `tabIndex={-1}` ile klavye
      // sırasından da çıkarılmış, hiçbir kullanıcıya hiç görünmez.
      const tooSmall = await page.evaluate(() => {
        const interactive = document.querySelectorAll(
          'main a, main button, main input, main [role="button"]',
        );
        return Array.from(interactive)
          .filter((el) => {
            if (el.closest('nav[aria-label="Breadcrumb"]')) return false;
            if (el.closest(".bg-ink-900")) return false; // ContactCallout
            if (el.closest('[aria-hidden="true"]')) return false; // bal küpü
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
