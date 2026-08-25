---
name: indoles-responsive-quality
description: >
  INDOLES UI'sının mobil ve masaüstü tasarım kalitesinin "şahane, son derece şık ve akıcı"
  standardına uyumunu Playwright + Chrome canlı test ile doğrular. Bir component, page veya
  layout tamamlandığında, push veya merge öncesi, ya da bir UI bug raporunda ZORUNLU çağrılır.
  4 viewport (375 mobile, 768 tablet, 1280 desktop, 1536 wide) + 900px davranış eşiği
  üzerinde gerçek ekran görüntüsü alır; layout shift, fluid tipografi, scroll-bağlı
  mekanizmalar (sticky track, timeline, blob), touch target, hover/focus state, klavye
  navigasyonu, scroll perf ve cross-browser uyumu kontrol eder. Hem Playwright (otomatize,
  headless) hem chrome-devtools MCP (canlı browser) kullanır. Çıktı: viewport bazlı
  geçer/düşer raporu + screenshot + iyileştirme listesi. Tetikleyici: "mobile/desktop
  test et", "responsive kontrol", "viewport test", "tasarım kalitesi", "UX audit",
  "screenshot al", "browser'da test et", veya bir UI tamamlama anı.
---

# INDOLES Responsive Quality Skill

INDOLES web'in mobil ve masaüstünde "teknik-editorial, şahane, akıcı" (docs/04 v2) hedefini gerçek browser ortamında doğrular. Code-level statik analiz değil — gerçek viewport, gerçek render, gerçek interaksiyon.

## Çift Test Hattı

| Hat | Araç | Amaç | Ne Zaman |
|-----|------|------|----------|
| **Otomatize hat** | Playwright (`@playwright/test`, `playwright.config.ts`, `pnpm test:e2e`) | Tekrarlanabilir, regression-resistant, CI'da çalışır | Her UI değişikliği, PR öncesi |
| **Canlı hat** | chrome-devtools MCP (`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`) | Gerçek user gözünden interaktif test, hover/scroll/focus akışları, görsel "his" değerlendirmesi | Önemli UI release'leri, kalite review |

İkisi de çalıştırılır — biri eksik geldiğinde diğeri tamamlar.

## Viewport Matrisi (docs/04 breakpoint token'ları)

| Viewport | Genişlik | Yükseklik | Cihaz Profili | DPR |
|----------|----------|-----------|---------------|-----|
| Mobile | 375px | 812px | iPhone 13/14 baseline | 3 |
| Tablet | 768px | 1024px | iPad portrait | 2 |
| Desktop | 1280px | 800px | Laptop standard | 1 |
| Wide | 1536px | 960px | External monitor | 1 |

Ek zorunlu eşik: **900px** — sticky yatay hizmet track'i ve metodoloji timeline'ı bu
değerin altında kapanıp snap-slider/dikey düzene döner (docs/04 §4, §12.7). 899px ve
901px'te davranış farkını doğrula. Bonus: 360x640 (Android dar), 1920x1080 (full HD).

## Adım 0 — Test Ortamını Hazırla

```bash
# Dev server başlat (background)
pnpm dev

# Veya production build için
pnpm build && pnpm start
```

Test edilecek URL'i tanımla. Playwright config'in `baseURL`'ini ve chrome-devtools navigate target'ını eşitle.

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

## Adım 3 — chrome-devtools MCP Canlı Test

Otomatize testler geçtikten sonra canlı browser'da kullanıcı gözünden bak. Her viewport için:

```
1. ToolSearch ile load (chrome-devtools plugin):
   select:mcp__plugin_chrome-devtools-mcp_chrome-devtools__new_page,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__navigate_page,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__resize_page,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_screenshot,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__take_snapshot,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__evaluate_script,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__list_console_messages,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__hover,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__click,
   mcp__plugin_chrome-devtools-mcp_chrome-devtools__performance_start_trace

2. new_page → URL'e navigate_page
3. resize_page ile her viewport'a sırayla geç (900px eşiğini iki yönden test et)
4. take_snapshot ile DOM/a11y tree, take_screenshot ile görsel durum al
5. evaluate_script ile scroll, hover ve computed style kontrolleri
6. performance_start_trace ile scroll/motion akışında jank ölç
7. list_console_messages ile error/warning yakala

Alternatif: playwright plugin MCP (browser_navigate, browser_resize,
browser_take_screenshot, browser_snapshot) — chrome-devtools yoksa.
```

### Canlı Test Checklist

Her viewport'ta gözle ve doğrula:

| Kategori | Kontrol |
|----------|---------|
| **İlk izlenim** | Teknik-editorial his var mı (mono etiket, numaralı bölüm, ölçü dili)? Generic AI template gibi mi görünüyor? |
| **Tipografi** | Lexend 600 başlıklar doğru ağırlıkta mı? `text-step-*` clamp geçişi viewport'lar arasında smooth mu? Sayfada tek h1, display ölçeği yalnız `V2PageHeader`'da mı? |
| **Renk** | Krem tuval (#FAFAF7) tek mi — bölüm seviyesinde yabancı zemin var mı? Teal-700 interaction, gold yalnız dark yüzeyde mi? Gövde metni saf siyah değil `ink-600` mı? |
| **Spacing ritmi** | 96/140/180px bölüm ritmi korunuyor mu? Tüm bölümler aynı sol kenardan mı başlıyor? |
| **Hairline/divider** | `.divider`, eyebrow çizgisi, shadow-3d hairline'ı doğru render? |
| **Hover state'ler** | `.btn-primary` translateY(-2px), `.arrow` translate(2px,-2px) imzası çalışıyor mu? |
| **Focus ring** | Klavye ile gezinince 2px teal-700 ring + 2px offset görünüyor mu? |
| **Mobile menü** | ≤960px hamburger + çekmece akıcı; kapalı çekmece `inert`, açıkken nav opak |
| **Sabit chrome** | TopBar + nav pill scroll'da sıkışıyor/opaklaşıyor mu? İçerik chrome'un altında kalmıyor mu (padding telafisi)? |
| **Scroll mekanizmaları** | Sticky yatay track ve timeline >900px'te scrub, ≤900px'te snap-slider/dikey mi? Blob okuma kolonuna giriyor mu? |
| **Scroll perf** | 60fps, jank yok (blob + Lenis aktifken de) |
| **Motion** | Süre/easing token'dan (`--ease-out`, anim-config.ts) — component'e gömülü değer var mı? |
| **Image** | CLS sıfır mı? Geçici görseller `alt=""` ile mi? |
| **Form** | Touch target ≥44px, error state net |
| **Persona chip** | Hero'daki persona seçimi akıcı; copy adapte oluyor, görsel dil sabit kalıyor mu? |

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
- Nav pill'in `backdrop-filter` + opaklık geçişi doğru mu?
- WebGL blob ve Canvas 2D (WaveCanvas/ParticleField) performansı kabul edilebilir mi?
- Lexend/Inter font render ve `text-step-*` clamp değerleri tutarlı mı?
- CSS @supports fallback'leri?

## Adım 5 — Reduced Motion Test

```typescript
test('respects prefers-reduced-motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(URL_PATH);
  // docs/04 §7 sözleşmesi: geçişler ~0.01ms, .reveal anında görünür,
  // canvas tek kare çizip durur, sayaç hedef değere atlar, Lenis kapalı
  // (native scroll), team slider otomatik dönmez, yatay track snap-slider.
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

### Canlı (chrome-devtools MCP)

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
- Mevcut e2e suite ile çakışan spec dosya adı üretme — önce `tests/e2e/` yapısını gör, varsa mevcut spec'e ekle
- Dialog açan interaksiyonlarda `handle_dialog` tool'unu hazır tut — beklenmeyen dialog akışı kilitler
- "Üzgün viewport" varsa (ör. 360px Android), o viewport'u da matrise eklemeyi öner

## Subagent Kullanımı

`indoles-design-craftsman` ajanı UI tamamlandığında bu skill'i otomatik çağırır. Ajan, raporu Burak'a iletir; HIGH bulgu varsa fix uygular ve test'i tekrarlar.
