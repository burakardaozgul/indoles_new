import { test, expect } from "@playwright/test";

/**
 * GEO Görünürlük Denetleyicisi — uçtan uca akış (Görev 16).
 *
 * Desen `contact-form.spec.ts` ile birebir: görünmez Turnstile widget'ı
 * `window.turnstile` stub'ıyla anında token üretir, backend rotaları
 * `page.route` ile mock'lanır (gerçek Turnstile secret'i / D1 / SMTP
 * gerektirmez — bu üç bağımlılık üretimde `wrangler secret put` ile
 * girilir, yerel e2e'de hiç dokunulmaz).
 *
 * NEDEN gerçek `/api/tools/geo-scan` ve `/api/tools/geo-report` yerine mock:
 * (1) Turnstile — `verifyTurnstile` gerçek secret olmadan HER ZAMAN false
 * döner (`src/lib/security/turnstile.ts`), gerçek çağrı yerelde imkansız.
 * (2) `TOOL_IP_SALT` fail-closed — yerelde `.dev.vars` yoksa 500 döner.
 * (3) D1 (`BOOKINGS_DB`) — `next dev` (bu suite'in `webServer`'ı,
 * `playwright.config.ts`) `initOpenNextCloudflareForDev()` ÇAĞIRMIYOR;
 * `getCloudflareContext()` bu modda senkron olarak fırlatır (doğrulandı:
 * 2026-09-01, yerel `next dev`'e karşı elle `curl` — hem
 * `POST /api/tools/geo-scan` hem `GET /sonuc/[id]` 500 verdi, ayrıntı
 * task-16-report.md). Mock, `GeoScanForm`/`GeoReportForm`in İSTEMCİ
 * mantığını (state makinesi, rıza kapısı, paylaşım URL'i) gerçek ağ
 * bağımlılığından ayrıştırıp test eder — sunucu tarafı zaten ayrı
 * `route.test.ts` dosyalarında (vitest, D1/Turnstile mock'lu) kapsanıyor.
 */

const TOOL_PATH = "/tr/araclar/geo-gorunurluk-denetleyicisi";
const SCAN_ID = "e2e0000-0000-4000-8000-000000000001";
const SHARE_PATH = `${TOOL_PATH}/sonuc/${SCAN_ID}`;

const SCAN_CHECKS = [
  {
    id: "ai-access",
    score: 20,
    max: 25,
    status: "partial",
    summary: { tr: "AI botları çoğunlukla erişebiliyor.", en: "AI bots can mostly access." },
    findings: [] as Array<{ tr: string; en: string }>,
  },
  {
    id: "llms-txt",
    score: 10,
    max: 15,
    status: "partial",
    summary: { tr: "llms.txt kısmen dolu.", en: "llms.txt is partially filled." },
    findings: [],
  },
  {
    id: "json-ld",
    score: 20,
    max: 20,
    status: "pass",
    summary: { tr: "Yapısal veri eksiksiz.", en: "Structured data is complete." },
    findings: [],
  },
  {
    id: "lang-signals",
    score: 15,
    max: 15,
    status: "pass",
    summary: { tr: "Dil sinyalleri net.", en: "Language signals are clear." },
    findings: [],
  },
  {
    id: "question-h2",
    score: 15,
    max: 25,
    status: "partial",
    summary: { tr: "Soru başlıkları kısmen var.", en: "Question headings partially present." },
    findings: [],
  },
];

const TOTAL_SCORE = SCAN_CHECKS.reduce((sum, c) => sum + c.score, 0); // 80 → "iyi"

const SCAN_RESULT = {
  id: SCAN_ID,
  url: "https://www.indoles.com.tr/tr",
  totalScore: TOTAL_SCORE,
  band: "iyi",
  scannedAt: "2026-09-01T09:00:00.000Z",
  checks: SCAN_CHECKS,
};

/** Rapor kilidini açan yanıt — AYNI kalemler ama `findings` DOLU. */
const REPORT_CHECKS = SCAN_CHECKS.map((c) => ({
  ...c,
  findings: [
    { tr: `${c.id} için öncelikli aksiyon.`, en: `Priority action for ${c.id}.` },
  ],
}));

test.beforeEach(async ({ page }) => {
  // Görünmez Turnstile widget'ı anında token üretir (contact-form.spec.ts
  // deseni) — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` yerelde boşsa widget zaten
  // render edilmez (`TURNSTILE_ENABLED`), stub her iki durumda da zararsız.
  await page.addInitScript(() => {
    (
      window as unknown as {
        turnstile: {
          render: (
            el: Element,
            opts: { callback: (t: string) => void },
          ) => void;
        };
      }
    ).turnstile = {
      render: (_el, opts) => {
        opts.callback("e2e-test-token");
      },
    };
  });

  await page.route("**/api/tools/geo-scan", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: SCAN_ID, result: SCAN_RESULT }),
    }),
  );

  await page.route("**/api/tools/geo-report", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, checks: REPORT_CHECKS }),
    }),
  );
});

test("tarama → 5 rozetli skor ekranı, paylaşım URL'i günceller ve panoya kopyalar", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(TOOL_PATH);

  await page.getByLabel("Site adresi").fill("https://www.indoles.com.tr/tr");
  await page.getByRole("button", { name: "Denetle" }).click();

  // Skor ekranı AYNI sayfada basılır (Görev 11 tasarım kararı) — sayfa
  // geçişi yok, `router.push` değil `history.replaceState`.
  await expect(page.getByText(`${TOTAL_SCORE}`)).toBeVisible();
  await expect(page.getByText("İyi", { exact: true })).toBeVisible();

  // 5 kalem rozeti — `tools.ts` TR başlıkları. Sayfada başka bir statik
  // "Ölçülen 5 sinyal" tanıtım bölümü de AYNI başlıkları taşıyor
  // (`signals-heading`) — locator formun kendi bölümüyle (`scan-heading`)
  // sınırlanır, aksi halde strict-mode iki eşleşmeyle çakışır.
  const scanSection = page.locator('section[aria-labelledby="scan-heading"]');
  for (const title of [
    "AI erişimi",
    "llms.txt",
    "Yapısal veri",
    "Dil sinyalleri",
    "Soru başlıkları",
  ]) {
    await expect(scanSection.getByRole("heading", { name: title })).toBeVisible();
  }

  // URL çubuğu paylaşım linkine güncellendi (tam sayfa geçişi olmadan).
  await expect(page).toHaveURL(new RegExp(`${SHARE_PATH}$`));

  // Paylaşım düğmesi doğru linki panoya kopyalar.
  await page.getByRole("button", { name: "Sonucu paylaş" }).click();
  await expect(page.getByRole("button", { name: "Bağlantı kopyalandı" })).toBeVisible();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toBe(`${page.url().split(SHARE_PATH)[0]}${SHARE_PATH}`);
});

test("rapor formu rızasız gönderim reddeder, rızalı gönderim raporu açar", async ({ page }) => {
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("https://www.indoles.com.tr/tr");
  await page.getByRole("button", { name: "Denetle" }).click();
  await expect(page.getByText(`${TOTAL_SCORE}`)).toBeVisible();

  const reportSubmit = page.getByRole("button", { name: "Raporu gönder" });
  // `exact: true` — sayfanın altındaki bülten formu "E-posta adresiniz"
  // etiketiyle aynı önekle çakışır (strict-mode).
  await page.getByLabel("E-posta adresi", { exact: true }).fill("burak@indoles.com.tr");

  // KVKK rızası işaretlenmeden gönderim düğmesi devre dışı — rota
  // (`geoReportSchema`, `kvkkConsent: z.literal(true)`) zaten zorunlu
  // kılıyor, istemci burada rızasız isteği HİÇ ATMAZ (network call yok).
  await expect(reportSubmit).toBeDisabled();

  let reportRequests = 0;
  page.on("request", (req) => {
    if (req.url().includes("/api/tools/geo-report")) reportRequests += 1;
  });

  // Rıza verilince gönderim açılır.
  await page
    .getByLabel(/KVKK kapsamında verilerimin işlenmesini kabul ediyorum/)
    .check();
  await expect(reportSubmit).toBeEnabled();
  await reportSubmit.click();

  // Kilit açıldı: ayrıntılı bulgular AYNI sayfada render edilir — "rapor
  // gönderildi" durumu (e-postaya kopya + ekranda anında açılım).
  await expect(page.getByRole("heading", { name: "Ayrıntılı bulgular" })).toBeVisible();
  await expect(
    page.getByText("Raporun bir kopyası e-postanıza gönderildi."),
  ).toBeVisible();
  await expect(page.getByText("ai-access için öncelikli aksiyon.")).toBeVisible();

  expect(reportRequests).toBe(1);
});

/**
 * Paylaşım sayfasının DOĞRUDAN ziyareti (yeni sekme/`goto`) — brief
 * senaryosunun üçüncü adımı: "paylaşım URL'i açılır aynı skoru gösterir".
 *
 * Yerelde ATLANIYOR (mock DEĞİL, dürüst atlama): bu sayfa (`sonuc/[id]/
 * page.tsx`) sunucuda `getCloudflareContext()` ile D1 (`BOOKINGS_DB`) okur.
 * Bu suite'in `webServer`'ı düz `next dev`dir (`playwright.config.ts`) ve
 * proje `next.config.ts`'te `initOpenNextCloudflareForDev()` ÇAĞIRMIYOR —
 * `getCloudflareContext()` bu modda senkron çağrıldığında fırlıyor. Elle
 * doğrulandı (2026-09-01): `curl` ile gerçek `next dev`'e karşı hem
 * `POST /api/tools/geo-scan` hem `GET .../sonuc/<id>` 500 döndü, log satırı:
 * "ERROR: `getCloudflareContext` has been called without having called
 * `initOpenNextCloudflareForDev`". Bu bir SECRET eksikliği değil — D1
 * yerel/ücretsizdir (miniflare, hesap gerektirmez) — bir dev-harness
 * kablolama boşluğu; aynı boşluk rezervasyon (`/api/booking`) D1 okumalarını
 * da etkiler. Kapsam bu görevin dosya listesinde YOK (`next.config.ts`
 * değişikliği); düzeltme önerisi task-16-report.md'de.
 */
test.skip(
  "paylaşım URL'i doğrudan ziyaret edilince aynı skoru gösterir — D1 dev-harness eksik (next.config.ts initOpenNextCloudflareForDev çağrılmıyor), TOOL_IP_SALT/secret sorunu değil",
  async ({ page }) => {
    await page.goto(SHARE_PATH);
    await expect(page.getByText(`${TOTAL_SCORE}`)).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI erişimi" })).toBeVisible();
  },
);
