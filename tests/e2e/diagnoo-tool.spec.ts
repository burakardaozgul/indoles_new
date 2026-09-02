import { test, expect } from "@playwright/test";

/**
 * Diagnoo e-ticaret teşhis aracı — uçtan uca duman testi (Görev 16).
 *
 * Bu dosyadaki testler gerçek ağ isteği atıyor, mock YOK. Üç testin
 * (TR sayfa, EN sayfa, form gönderimi) D1'e hiç ihtiyacı yok — sayfa içeriği
 * statik TS'ten gelir, form gönderimi ise boş `turnstileToken` yüzünden Zod
 * şemasında (`diagnooStartSchema`, `turnstileToken: z.string().min(1)`)
 * `getCloudflareContext()`e HİÇ ULAŞMADAN 400 ile dönüyor (aşağıdaki test içi
 * not). Bu üçü `geo-tool.spec.ts`nin çoğu testi gibi varsayılan `pnpm
 * test:e2e` harness'inde (`next dev`, `playwright.config.ts`) da koşar.
 *
 * Yalnız İKİ test (rapor sayfası 404, durum ucu 404) gerçekten D1'e ihtiyaç
 * duyuyor: `rapor/[id]/page.tsx` ve `diagnoo-status/[id]/route.ts`
 * `getCloudflareContext()` çağırıyor; `next dev`
 * `initOpenNextCloudflareForDev()`i BAŞLATMIYOR, bu çağrı o modda senkron
 * fırlıyor (`geo-tool.spec.ts`teki AYNI belgelenmiş boşluk — orada da tek bir
 * test `test.skip(...)` ile bu yüzden atlanıyor). Bu ikisi burada da aynı
 * desenle, test gövdesi içinde `test.skip(!PREVIEW_BASE_URL, ...)` ile
 * atlanıyor — `PLAYWRIGHT_BASE_URL` (örn. `pnpm cf:preview`, gerçek
 * Miniflare D1) tanımlıyken çalışıyor:
 *
 *   pnpm wrangler d1 migrations apply indoles-bookings --local
 *   pnpm cf:preview                                   # http://localhost:8787
 *   PLAYWRIGHT_BASE_URL=http://localhost:8787 pnpm test:e2e -- tests/e2e/diagnoo-tool.spec.ts
 *
 * SOĞUK DERLEME / ESKİMİŞ SUNUCU DUYARLILIĞI (task-16, 2026-09-02): `next dev`
 * (Turbopack) bu sayfaları İLK istekte derliyor — `diagnoo-report.tsx` tek
 * başına 34 KB kaynak taşıyor. Görev sırasında bu makinede saatlerdir açık
 * kalmış, birçok dosya değişikliği ve HMR döngüsü görmüş bir `next dev`
 * sürecine karşı testler tekrarlanır biçimde `error.tsx` sınırına
 * ("Bir şeyler ters gitti.") düşüyordu — ama AYNI sunucuya karşı tek başına
 * `curl` HER SEFERİNDE 200 döndü, yani D1 veya ürün kodu hatası değil.
 * Sunucu süreci sonlandırılıp `next dev` SIFIRDAN başlatıldığında sorun
 * tamamen kayboldu: art arda üç koşu da 6/6 geçti (task-16-report.md §"Ruling
 * fix"). Kesin mekanizma (uzun ömürlü bir dev sürecinin modül önbelleğinin
 * bir noktada bozulması mı, yoksa yalnızca ilk-istek derleme yarışı mı)
 * kesinleşmedi — ama gözlem net: taze bir `next dev` + aşağıdaki iki önlem
 * yeterli. Testleri gate'lemek yerine (o zaman default harness'te 0 test
 * koşardı — yanlış), her worker için `test.beforeAll`de sayfaları BİR KEZ
 * ısıtıyoruz; ilk `page.goto` da derleme süresine tolerans tanıyan bir zaman
 * aşımı alıyor. `cf:preview`de (önceden derlenmiş worker, derleme yok) bu
 * hiç görülmüyor — ısınmaya ihtiyaç yok, hepsi hızlı geçiyor.
 */

const TR_PATH = "/tr/araclar/diagnoo";
const EN_PATH = "/en/tools/diagnoo";

const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_BASE_URL;
const D1_SKIP_REASON =
  "D1 gerektirir — next dev getCloudflareContext()'i başlatmıyor; " +
  "PLAYWRIGHT_BASE_URL=http://localhost:8787 ile cf:preview'a karşı koşulmalı " +
  "(geo-tool.spec.ts'teki aynı belgelenmiş boşluk).";

// İlk isteğin soğuk derlemeyle (bkz. dosya başı not) uzun sürmesine tolerans.
const COLD_COMPILE_TIMEOUT_MS = 60_000;

function randomUuid(): string {
  return (
    "e2e0000-0000-4000-8000-" +
    Math.random().toString(16).slice(2).padEnd(12, "0").slice(0, 12)
  );
}

// Her worker için bir kez: iki sayfayı önceden ısıtıp `page.goto`ların
// derleme yarışına yakalanma ihtimalini düşürüyor. `cf:preview`ye karşı
// (önceden derlenmiş worker) bu istekler zaten anında döner, zararsız.
test.beforeAll(async ({ request }) => {
  await Promise.allSettled([
    request.get(TR_PATH, { timeout: 120_000 }),
    request.get(EN_PATH, { timeout: 120_000 }),
  ]);
});

test.describe("Diagnoo araç sayfası — form, SSS, JSON-LD", () => {
  test("TR sayfası form, SSS ve yapısal veri içerir", async ({ page }) => {
    await page.goto(TR_PATH, {
      timeout: COLD_COMPILE_TIMEOUT_MS,
      waitUntil: "domcontentloaded",
    });

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
    await page.goto(EN_PATH, {
      timeout: COLD_COMPILE_TIMEOUT_MS,
      waitUntil: "domcontentloaded",
    });

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

    // `waitUntil: "domcontentloaded"` BİLEREK kullanılmıyor (render
    // testlerinden farklı): bu test forma yazıp gönderiyor, `url` React'ın
    // kontrol ettiği bir state — `.fill()` hydration bitmeden DOM'a yazarsa
    // hydration state'i ""'a geri sıfırlıyor ve gönder düğmesi kalıcı olarak
    // devre dışı kalıyor (görüldü: 2026-09-02, "element is not enabled",
    // 30 sn boyunca retry). Varsayılan `waitUntil: "load"` hydration için
    // yeterli tampon veriyor; yalnız zaman aşımı soğuk derlemeye tolerans
    // için uzatıldı.
    await page.goto(TR_PATH, { timeout: COLD_COMPILE_TIMEOUT_MS });
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

test.describe("Diagnoo D1 uçları — cf:preview gerektirir", () => {
  test("bilinmeyen id için rapor sayfası 404 döner (500 değil)", async ({ page }) => {
    test.skip(!PREVIEW_BASE_URL, D1_SKIP_REASON);

    const res = await page.goto(`${TR_PATH}/rapor/${randomUuid()}`);
    expect(res?.status()).toBe(404);
  });

  test("GET diagnoo-status bilinmeyen id için { error: 'not-found' } / 404 döner", async ({
    request,
  }) => {
    test.skip(!PREVIEW_BASE_URL, D1_SKIP_REASON);

    const res = await request.get(`/api/tools/diagnoo-status/${randomUuid()}`);
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: "not-found" });
  });
});
