import { test, expect } from "@playwright/test";

/**
 * Diagnoo e-ticaret teşhis aracı — uçtan uca duman testi (Görev 16).
 *
 * `geo-tool.spec.ts`teki desenden BİLEREK ayrılıyor: GEO testleri
 * `page.route` ile backend'i mock'lar ve varsayılan harness'te (`next dev`,
 * `playwright.config.ts`) koşar. Bu dosyadaki TÜM testler gerçek ağ isteği
 * atıyor, mock YOK — ve BİLEREK yalnız `pnpm cf:preview`ye (wrangler,
 * gerçek Miniflare D1, önceden derlenmiş worker) karşı koşacak şekilde
 * gate'lendi. İki ayrı gerekçe var:
 *
 * 1. **D1 gereksinimi** — rapor sayfası (`rapor/[id]/page.tsx`) ve durum ucu
 *    (`diagnoo-status/[id]/route.ts`) `getCloudflareContext()` çağırıyor;
 *    `next dev` `initOpenNextCloudflareForDev()`i BAŞLATMIYOR, bu çağrı o
 *    modda senkron fırlıyor (geo-tool.spec.ts'teki AYNI belgelenmiş boşluk).
 * 2. **Gözlemlenen `next dev` kararsızlığı (task-16, 2026-09-02)** — sayfa
 *    testleri D1'e hiç dokunmasa da (`/araclar/diagnoo` içeriği statik
 *    TS'ten gelir), bu makinede aynı anda birden çok `next-server` süreci
 *    koşarken chromium+mobile projelerinin AYNI ağır sayfaya (`diagnoo-
 *    report.tsx` tek başına 34 KB) eşzamanlı ilk isteği Turbopack'in soğuk
 *    derleme yarışında ara sıra sunucu tarafı istisnaya (`error.tsx`
 *    sınırı) düşüyordu — tek başına, ısınmış sunucuya karşı `curl` HER
 *    SEFERİNDE 200 döndü, yani D1 veya kod hatası değil, dev-harness'e özgü
 *    bir yarış durumu. `cf:preview`de (önceden derlenmiş worker, derleme
 *    yarışı yok) hiç görülmedi — 10/10 koşu, iki proje, tek seferde yeşil.
 *
 * Koşum:
 *
 *   pnpm wrangler d1 migrations apply indoles-bookings --local
 *   pnpm cf:preview                                   # http://localhost:8787
 *   CI=1 PLAYWRIGHT_BASE_URL=http://localhost:8787 \
 *     npx playwright test tests/e2e/diagnoo-tool.spec.ts
 *
 * `PLAYWRIGHT_BASE_URL` tanımsızken (varsayılan `pnpm test:e2e`, `next dev`)
 * dosyadaki HER test dürüstçe atlanır — mock DEĞİL, yukarıdaki gerçek
 * dev-harness boşluğu/kararsızlığı (task-16-report.md'de ayrıntılı kayıt).
 */

const TR_PATH = "/tr/araclar/diagnoo";
const EN_PATH = "/en/tools/diagnoo";

const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_BASE_URL;
const SKIP_REASON =
  "Yalnız cf:preview'a karşı koşar — PLAYWRIGHT_BASE_URL=http://localhost:8787 " +
  "ile çalıştırın (dosya başı not: D1 + gözlemlenen next-dev derleme yarışı).";

function randomUuid(): string {
  return (
    "e2e0000-0000-4000-8000-" +
    Math.random().toString(16).slice(2).padEnd(12, "0").slice(0, 12)
  );
}

test.beforeEach(() => {
  test.skip(!PREVIEW_BASE_URL, SKIP_REASON);
});

test.describe("Diagnoo araç sayfası — form, SSS, JSON-LD", () => {
  test("TR sayfası form, SSS ve yapısal veri içerir", async ({ page }) => {
    await page.goto(TR_PATH);

    await expect(page.getByRole("heading", { name: "Diagnoo", level: 1 })).toBeVisible();
    await expect(page.getByLabel("Mağazanızın adresi")).toBeVisible();
    await expect(page.getByRole("button", { name: "Taramayı başlat" })).toBeVisible();

    // SSS — native <details>, tıklamadan DOM'da (faq-accordion.tsx notu).
    await expect(page.getByText("Diagnoo neyi ölçer?")).toBeVisible();

    // JSON-LD tek `@graph` altında (JsonLd.tsx) — SoftwareApplication +
    // FAQPage ikisi de aynı `<script>` düğümünde.
    const ld = await page.locator('script[type="application/ld+json"]').innerHTML();
    expect(ld).toContain('"@type":"SoftwareApplication"');
    expect(ld).toContain('"@type":"FAQPage"');
  });

  test("EN sayfası form, SSS ve yapısal veri içerir", async ({ page }) => {
    await page.goto(EN_PATH);

    await expect(page.getByRole("heading", { name: "Diagnoo", level: 1 })).toBeVisible();
    await expect(page.getByLabel("Your store's address")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start the scan" })).toBeVisible();
    await expect(page.getByText("What does Diagnoo measure?")).toBeVisible();

    const ld = await page.locator('script[type="application/ld+json"]').innerHTML();
    expect(ld).toContain('"@type":"SoftwareApplication"');
    expect(ld).toContain('"@type":"FAQPage"');
  });
});

test.describe("Diagnoo form gönderimi — Turnstile yerelde yapılandırılmamış", () => {
  test("gönderim dürüst bir hata gösterir, sayfa çökmez", async ({ page }) => {
    // `NEXT_PUBLIC_TURNSTILE_SITE_KEY` yerelde YOK → `TURNSTILE_ENABLED` build
    // anında `false`e gömülür (`use-turnstile.ts`) → widget hiç render
    // edilmez, form `turnstileToken: ""` yollar. `diagnooStartSchema`
    // (`turnstileToken: z.string().min(1)`) bunu `getCloudflareContext()`e
    // ULAŞMADAN reddeder — rota `{ error: "invalid" }` / 400 döner (GEO'nun
    // `geoScanSchema`sıyla BİREBİR aynı boşluk: boş token şema hatasına
    // düşüyor, `turnstile-failed`e değil). `DiagnooForm` bunu `errors.invalid`
    // ("Geçerli bir site adresi girin.") cümlesine çevirir — teknik olarak
    // yanıltıcı bir metin ama YENİ bir davranış değil, GEO'da da aynı;
    // task 16'nın kapsamı bunu düzeltmek değil, dürüst/çökmesiz olduğunu
    // doğrulamak. 500 YOK, framework hata sayfası YOK, mesaj TR kopyası.
    const responses: number[] = [];
    page.on("response", (res) => {
      if (res.url().includes("/api/tools/diagnoo-start")) responses.push(res.status());
    });

    await page.goto(TR_PATH);
    await page.getByLabel("Mağazanızın adresi").fill("https://www.indoles.com.tr");
    await page.getByRole("button", { name: "Taramayı başlat" }).click();

    // `getByRole("alert")` tek başına Next.js'in kendi route-announcer
    // düğümüyle (`#__next-route-announcer__`, o da `role="alert"` taşıyor)
    // strict-mode çakışması yaratır — form içindeki `<p role="alert">`e
    // daraltılır.
    const formAlert = page.locator('form p[role="alert"]');
    await expect(formAlert).toBeVisible();
    await expect(formAlert).toHaveText("Geçerli bir site adresi girin.");

    // Form ekranında kalındı (idle) — running/snapshot'a geçilmedi.
    await expect(page.getByLabel("Mağazanızın adresi")).toBeVisible();

    expect(responses).toEqual([400]);
  });
});

test.describe("Diagnoo D1 uçları", () => {
  test("bilinmeyen id için rapor sayfası 404 döner (500 değil)", async ({ page }) => {
    const res = await page.goto(`${TR_PATH}/rapor/${randomUuid()}`);
    expect(res?.status()).toBe(404);
  });

  test("GET diagnoo-status bilinmeyen id için { error: 'not-found' } / 404 döner", async ({
    request,
  }) => {
    const res = await request.get(`/api/tools/diagnoo-status/${randomUuid()}`);
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: "not-found" });
  });
});
