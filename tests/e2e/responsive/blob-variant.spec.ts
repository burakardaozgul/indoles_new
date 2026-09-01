import { test, expect, type Page } from "@playwright/test";

/**
 * Blob varyant seçimi ve araç hero'sunun okunabilirliği (docs/04 §12.10).
 *
 * Araç sayfası hero'su bilinçli bir istisnadır: blob orada merkezî, büyük ve
 * belirgin durur (`tool-hero`), scroll edildikçe sessiz eşlikçiye (`page`)
 * çekilir. Bu suite'in ASIL işi istisnanın SIZMADIĞINI kanıtlamak — hizmet,
 * paket, yazı ve araç indeksi sayfaları eski `page` davranışını korumalı,
 * anasayfa da 7 duraklı koreografisini.
 *
 * `data-blob-variant` production build'de de okunur; `__blobState` yalnız
 * dev'de tanımlıdır, o yüzden sayısal doğrulama koşullu yapılır.
 */

const TOOL_TR = "/tr/araclar/geo-gorunurluk-denetleyicisi";
const TOOL_EN = "/en/tools/geo-visibility-checker";

/**
 * anim-config.ts değerleri. Dar ekranda her iki varyantın da `mobile`
 * override'ı devreye girer (eşik `BREAKPOINT.mobile` = 768).
 */
const PAGE_REST = {
  wide: { x: 0.88, scale: 0.4, opacity: 0.26 },
  mobile: { x: 0.6, scale: 0.3, opacity: 0.18 },
};
const TOOL_REST = {
  wide: { x: 0, scale: 0.78, opacity: 0.55 },
  mobile: { x: 0, scale: 0.62, opacity: 0.4 },
};

const tierOf = (page: Page) =>
  (page.viewportSize()?.width ?? 1280) < 768 ? "mobile" : "wide";

type BlobState = {
  x: number;
  y: number;
  scale: number;
  noiseAmp: number;
  opacity: number;
};

async function blobState(page: Page): Promise<BlobState | null> {
  return page.evaluate(() => {
    const s = (window as unknown as { __blobState?: BlobState }).__blobState;
    return s ? { ...s } : null;
  });
}

async function variantOf(page: Page): Promise<string | null> {
  return page.locator("[data-blob-canvas]").getAttribute("data-blob-variant");
}

test.describe("blob varyant seçimi", () => {
  test("araç sayfası (TR + EN) tool-hero alır", async ({ page }) => {
    for (const path of [TOOL_TR, TOOL_EN]) {
      await page.goto(path, { waitUntil: "networkidle" });
      expect(await variantOf(page), path).toBe("tool-hero");
    }
  });

  test("diğer iç sayfalar page davranışını korur (regresyon)", async ({
    page,
  }) => {
    const routes = [
      "/tr/araclar",
      "/tr/hizmetler",
      "/tr/hizmetler/ai-danismanlik",
      "/tr/paketler",
      "/tr/vakalar",
      "/tr/yazilar",
      "/tr/hakkimizda",
      "/en/tools",
      "/en/services",
    ];
    for (const path of routes) {
      await page.goto(path, { waitUntil: "networkidle" });
      expect(await variantOf(page), path).toBe("page");
    }
  });

  test("anasayfa home koreografisini korur", async ({ page }) => {
    await page.goto("/tr", { waitUntil: "networkidle" });
    expect(await variantOf(page)).toBe("home");

    const s = await blobState(page);
    test.skip(s === null, "__blobState yalnız dev build'de tanımlı");

    // Koreografi canlı: scroll ilerledikçe durum DEĞİŞİR (sabit kalmaz).
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
    await page.waitForTimeout(2500);
    const mid = await blobState(page);
    expect(mid).not.toBeNull();
    expect(mid!.scale).not.toBeCloseTo(s!.scale, 2);
  });
});

test.describe("araç hero'su — belirgin sonra geri çekilen blob", () => {
  test("ilk ekranda merkezî ve belirgin, scroll sonrası page hâline yerleşir", async ({
    page,
  }) => {
    await page.goto(TOOL_TR, { waitUntil: "networkidle" });
    // Giriş tween'i (BLOB.intro, 1.2 sn) bitmeden ölçüm yarı yolda okunur.
    await page.waitForTimeout(2200);
    const top = await blobState(page);
    test.skip(top === null, "__blobState yalnız dev build'de tanımlı");

    const tier = tierOf(page);
    const hero = TOOL_REST[tier];
    const rest = PAGE_REST[tier];

    expect(top!.x).toBeCloseTo(hero.x, 2);
    expect(top!.scale).toBeCloseTo(hero.scale, 2);
    expect(top!.opacity).toBeCloseTo(hero.opacity, 2);
    // İç sayfadan belirgin biçimde daha büyük ve daha opak olmalı.
    expect(top!.scale).toBeGreaterThan(rest.scale * 1.5);
    expect(top!.opacity).toBeGreaterThan(rest.opacity * 1.5);

    // Okuma bölümlerine varıldığında istisna sona erer.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
    await page.waitForTimeout(2500);
    const settled = await blobState(page);
    expect(settled!.x).toBeCloseTo(rest.x, 2);
    expect(settled!.scale).toBeCloseTo(rest.scale, 2);
    expect(settled!.opacity).toBeCloseTo(rest.opacity, 2);
  });

  test("hero metni blob'un üstünde okunur kalır (WCAG 2.2 AA)", async ({
    page,
  }) => {
    await page.goto(TOOL_TR, { waitUntil: "networkidle" });
    // Blob giriş tween'i (1.2 sn) bitsin — ölçüm nihai opaklıkta yapılmalı.
    await page.waitForTimeout(2200);

    const boxes = await page.evaluate(() => {
      const pick = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      };
      return {
        // ink-900 · ink-700 · teal-700
        h1: { box: pick("#tool-h1"), rgb: [0, 0, 0] },
        lede: { box: pick("#tool-h1 + p"), rgb: [26, 26, 26] },
        eyebrow: { box: pick(".tool-hero .eyebrow"), rgb: [44, 85, 102] },
      };
    });

    // Metni ve imleç noktasını gizle: geriye krem + blob kompoziti kalır.
    // Custom cursor (mix-blend-difference, z-60) zemin değil imleçtir.
    await page.addStyleTag({
      content:
        ".tool-hero .ds-container { visibility: hidden } .z-60 { display: none !important }",
    });
    await page.waitForTimeout(300);
    const shot = (await page.screenshot()).toString("base64");

    const results = await page.evaluate(
      async ({ b64, boxes }) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext("2d")!;
        g.drawImage(img, 0, 0);
        const scale = img.width / window.innerWidth;

        const lin = (v: number) => {
          const n = v / 255;
          return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
        };
        const lum = (r: number, gg: number, b: number) =>
          0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);

        const out: Record<string, number> = {};
        for (const [name, v] of Object.entries(boxes)) {
          const entry = v as {
            box: null | { x: number; y: number; w: number; h: number };
            rgb: number[];
          };
          if (!entry.box) continue;
          const x0 = Math.max(0, Math.floor(entry.box.x * scale));
          const y0 = Math.max(0, Math.floor(entry.box.y * scale));
          const w = Math.min(c.width - x0, Math.ceil(entry.box.w * scale));
          const h = Math.min(c.height - y0, Math.ceil(entry.box.h * scale));
          if (w <= 0 || h <= 0) continue;
          const d = g.getImageData(x0, y0, w, h).data;
          let darkest = 1;
          for (let i = 0; i < d.length; i += 4) {
            const L = lum(d[i]!, d[i + 1]!, d[i + 2]!);
            if (L < darkest) darkest = L;
          }
          const textL = lum(entry.rgb[0]!, entry.rgb[1]!, entry.rgb[2]!);
          out[name] =
            (Math.max(textL, darkest) + 0.05) /
            (Math.min(textL, darkest) + 0.05);
        }
        return out;
      },
      { b64: shot, boxes },
    );

    expect(Object.keys(results).sort()).toEqual(["eyebrow", "h1", "lede"]);
    for (const [name, ratio] of Object.entries(results)) {
      expect(ratio, `${name} kontrastı`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

test("hareket kısıtında da varyant ve içerik erişimi korunur", async ({
  browser,
  baseURL,
}) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto((baseURL ?? "") + TOOL_TR, { waitUntil: "networkidle" });
  expect(await variantOf(page)).toBe("tool-hero");
  // İçeriğe erişim animasyona bağlı değil: başlık ve giriş alanı hazır.
  await expect(page.locator("#tool-h1")).toBeVisible();
  await expect(page.getByLabel("Site adresi")).toBeVisible();
  await ctx.close();
});
