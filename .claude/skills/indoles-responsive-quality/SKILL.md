---
name: indoles-responsive-quality
description: >
  INDOLES UI'sının mobil ve masaüstü tasarım kalitesinin "şahane, son derece şık ve akıcı"
  standardına uyumunu Playwright + Chrome canlı test ile doğrular. Bir component, page veya
  layout tamamlandığında, push veya merge öncesi, ya da bir UI bug raporunda ZORUNLU çağrılır.
  4 viewport (375 mobile, 768 tablet, 1280 desktop, 1536 wide) üzerinde gerçek ekran
  görüntüsü alır, layout shift'i, fluid tipografinin akıcılığını, motion smoothness'i,
  touch target boyutlarını, hover→active state'leri, focus ring'leri, klavye navigasyonunu,
  scroll perf'ı ve cross-browser uyumu kontrol eder. Hem Playwright (otomatize, headless)
  hem claude-in-chrome MCP (canlı browser, gerçek user gözünden) kullanır. Çıktı: viewport
  bazlı geçer/düşer raporu + screenshot + iyileştirme listesi. Tetikleyici: "mobile/desktop
  test et", "responsive kontrol", "viewport test", "tasarım kalitesi", "UX audit", "screenshot
  al ve göster", "browser'da test et", veya bir UI tamamlama anı.
---

# INDOLES Responsive Quality Skill

INDOLES web'in mobil ve masaüstünde "editorial-minimalist, şahane, akıcı" hedefini gerçek browser ortamında doğrular. Code-level statik analiz değil — gerçek viewport, gerçek render, gerçek interaksiyon.

## Çift Test Hattı

| Hat | Araç | Amaç | Ne Zaman |
|-----|------|------|----------|
| **Otomatize hat** | Playwright (`@playwright/test`, `playwright.config.ts`) | Tekrarlanabilir, regression-resistant, CI'da çalışır | Her UI değişikliği, PR öncesi |
| **Canlı hat** | claude-in-chrome MCP (`mcp__claude-in-chrome__*`) | Gerçek user gözünden interaktif test, hover/scroll/focus akışları, görsel "his" değerlendirmesi | Önemli UI release'leri, kalite review |

İkisi de çalıştırılır — biri eksik geldiğinde diğeri tamamlar.

## Viewport Matrisi (docs/04 breakpoint token'ları)

| Viewport | Genişlik | Yükseklik | Cihaz Profili | DPR |
|----------|----------|-----------|---------------|-----|
| Mobile | 375px | 812px | iPhone 13/14 baseline | 3 |
| Tablet | 768px | 1024px | iPad portrait | 2 |
| Desktop | 1280px | 800px | Laptop standard | 1 |
| Wide | 1536px | 960px | External monitor | 1 |

Bonus: 360x640 (Android dar), 1920x1080 (full HD) — opsiyonel ek viewport'lar.

## Adım 0 — Test Ortamını Hazırla

```bash
# Dev server başlat (background)
pnpm dev

# Veya production build için
pnpm build && pnpm start
```

Test edilecek URL'i tanımla. Playwright config'in `baseURL`'ini ve claude-in-chrome'un navigate target'ını eşitle.

## Adım 1 — Playwright Otomatize Test

Playwright spec generator pattern'i:

```typescript
// tests/e2e/responsive/{page-name}.spec.ts
import { test, expect, devices } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 812,  dpr: 3 },
  { name: 'tablet',  width: 768,  height: 1024, dpr: 2 },
  { name: 'desktop', width: 1280, height: 800,  dpr: 1 },
  { name: 'wide',    width: 1536, height: 960,  dpr: 1 },
];

const URL_PATH = '/tr/{ROUTE}'; // değişken: test edilecek route

for (const vp of VIEWPORTS) {
  test.describe(`${URL_PATH} @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr });

    test('renders without layout shift', async ({ page }) => {
      await page.goto(URL_PATH, { waitUntil: 'networkidle' });
      // CLS ölçümü
      const cls = await page.evaluate(async () => {
        let total = 0;
        await new Promise<void>((resolve) => {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(resolve, 2000);
        });
        return total;
      });
      expect(cls).toBeLessThan(0.05);
    });

    test('full-page screenshot', async ({ page }) => {
      await page.goto(URL_PATH, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: `tests/screenshots/${URL_PATH.replace(/\//g, '_')}-${vp.name}.png`,
        fullPage: true,
      });
    });

    test('touch targets >= 44px on mobile', async ({ page }) => {
      if (vp.name !== 'mobile') return;
      await page.goto(URL_PATH);
      const tooSmall = await page.evaluate(() => {
        const interactive = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
        return Array.from(interactive).filter((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          return r.width < 44 || r.height < 44;
        }).map((el) => (el as HTMLElement).outerHTML.slice(0, 80));
      });
      expect(tooSmall).toEqual([]);
    });

    test('keyboard tab order reaches CTA', async ({ page }) => {
      await page.goto(URL_PATH);
      const ctaSelector = '[data-testid="primary-cta"]'; // veya page-spesifik
      let reached = false;
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate((sel) => document.activeElement?.matches(sel), ctaSelector);
        if (focused) { reached = true; break; }
      }
      expect(reached).toBe(true);
    });

    test('no horizontal scroll', async ({ page }) => {
      await page.goto(URL_PATH);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    });
  });
}
```

Çalıştırma:

```bash
pnpm exec playwright test tests/e2e/responsive/{page-name}.spec.ts
```

## Adım 2 — Performance + Web Vitals Ölçümü

```typescript
test('Core Web Vitals (LCP, CLS, INP)', async ({ page }) => {
  await page.goto(URL_PATH, { waitUntil: 'networkidle' });
  const vitals = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const result: any = { lcp: 0, cls: 0, inp: 0 };
      new PerformanceObserver((l) => { for (const e of l.getEntries() as any[]) result.lcp = e.startTime; })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries() as any[]) if (!e.hadRecentInput) result.cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => resolve(result), 3000);
    });
  });
  // docs/05 §10 hedefleri
  expect((vitals as any).lcp).toBeLessThan(1800);
  expect((vitals as any).cls).toBeLessThan(0.05);
});
```

## Adım 3 — claude-in-chrome Canlı Test

Otomatize testler geçtikten sonra canlı browser'da kullanıcı gözünden bak. Her viewport için:

```
1. ToolSearch ile load: select:mcp__claude-in-chrome__tabs_context_mcp,
   mcp__claude-in-chrome__tabs_create_mcp, mcp__claude-in-chrome__navigate,
   mcp__claude-in-chrome__resize_window, mcp__claude-in-chrome__computer,
   mcp__claude-in-chrome__find, mcp__claude-in-chrome__read_page,
   mcp__claude-in-chrome__gif_creator, mcp__claude-in-chrome__read_console_messages,
   mcp__claude-in-chrome__javascript_tool

2. tabs_context_mcp ile mevcut tab'ları öğren
3. tabs_create_mcp ile yeni tab → URL'e navigate
4. resize_window ile her viewport'a sırayla geç
5. read_page ile DOM/visible content snapshot al
6. computer ile scroll, hover, click akışları test et
7. gif_creator ile önemli interaksiyon akışlarını kaydet
8. read_console_messages ile error/warning yakala
```

### Canlı Test Checklist

Her viewport'ta gözle ve doğrula:

| Kategori | Kontrol |
|----------|---------|
| **İlk izlenim** | Editorial-minimalist hissi var mı? Generic AI template gibi mi görünüyor? |
| **Tipografi akıcılığı** | Fraunces opsz aksi büyük başlıklarda doğru render? clamp() geçişi smooth mu? |
| **Renk** | Sıcak kağıt arka plan, ink-900 mürekkep — saf beyaz/siyah hissi var mı? |
| **Spacing ritmi** | Whitespace nefes aldırıyor mu, sıkışık mı? |
| **Hairline rule'lar** | Editorial detay (1px ayraç, marginalia) doğru görünüyor mu? |
| **Hover state'ler** | Smooth, ne donuk ne agresif? |
| **Focus ring** | Klavye ile gezinince ring görünüyor mu? brand-500 ile mi? |
| **Mobile menü** | Hamburger açılışı akıcı, full-screen overlay temiz |
| **Sticky CTA** | Mobile'da sticky bottom bar diğer öğelerle çakışıyor mu? |
| **Chatbot widget** | Sağ alt, CTA bar ile çakışmıyor (mobile'da sol tarafa kayar) |
| **Scroll perf** | 60fps, jank yok |
| **Motion** | Framer Motion animasyonları smooth, ease curve token'dan |
| **Image** | LQIP veya skeleton var mı? CLS sıfır mı? |
| **Form** | Touch target uygun, error state net |
| **Persona switch** | Hero'daki audience switch animasyonu akıcı, içerik adapte oluyor |

## Adım 4 — Cross-Browser Smoke Test

Playwright matrisi:

```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
],
```

Webkit'te özellikle:
- `font-variation-settings` (Fraunces opsz) doğru render?
- Container query desteği?
- CSS @supports fallback'leri?

## Adım 5 — Reduced Motion Test

```typescript
test('respects prefers-reduced-motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(URL_PATH);
  // Animasyonlu element'lerin animation/transition durumunu doğrula
});
```

## Adım 6 — Çıktı Raporu

```markdown
## Responsive Quality Report — {ROUTE}

### Otomatize (Playwright)

| Viewport | CLS | LCP | Touch Targets | H-scroll | Tab Order | Status |
|----------|-----|-----|---------------|----------|-----------|--------|
| mobile   | 0.02 | 1.4s | OK | OK | OK | PASS |
| tablet   | ... | ... | ... | ... | ... | ... |
| desktop  | ... | ... | ... | ... | ... | ... |
| wide     | ... | ... | ... | ... | ... | ... |

### Canlı (claude-in-chrome)

| Kategori | Mobile | Tablet | Desktop | Wide |
|----------|--------|--------|---------|------|
| Editorial his | OK | OK | OK | OK |
| Tipografi akıcılığı | ... | ... | ... | ... |
| Hover/focus | NA | OK | OK | OK |
| Scroll perf | ... | ... | ... | ... |
| Motion smoothness | ... | ... | ... | ... |

### Konsol/Network

- {error/warning listesi}
- {failed request listesi}

### Screenshot/GIF Çıktıları

- tests/screenshots/{path}-mobile.png
- tests/screenshots/{path}-desktop.png
- tests/screenshots/{path}-flow.gif

### İyileştirme Listesi (Önceliklendirilmiş)

1. **[HIGH]** {konu} — {önerilen fix} ({dosya:satır})
2. **[MED]** ...
3. **[LOW]** ...

### Açık Sorular
- {bağımsız değerlendirme gerekene yer}
```

## Notlar

- Bir test çakılırsa, tekrar çalıştırmadan önce **kök sebebi** tespit et — flaky test'i normalize etme
- Screenshot'lar `tests/screenshots/` altında, gitignore'dan hariç (PR review için)
- claude-in-chrome'da dialog tetiklemeyecek interaksiyon seç — tetiklerse oturum kilitlenir (system prompt notu)
- "Üzgün viewport" varsa (ör. 360px Android), o viewport'u da matrise eklemeyi öner

## Subagent Kullanımı

`indoles-design-craftsman` ajanı UI tamamlandığında bu skill'i otomatik çağırır. Ajan, raporu Burak'a iletir; HIGH bulgu varsa fix uygular ve test'i tekrarlar.
