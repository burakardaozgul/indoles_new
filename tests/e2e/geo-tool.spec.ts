import { test, expect } from "@playwright/test";

/**
 * GEO Görünürlük Denetleyicisi — uçtan uca akış (Görev 13a, araç UI v2).
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
 * task-16-report.md). Mock, `GeoTool` adasının (`ScanBar`/`ScanStage`/
 * `ScoreCard`/`ReportGate`) İSTEMCİ mantığını (durum makinesi, rıza kapısı,
 * paylaşım URL'i) gerçek ağ bağımlılığından ayrıştırıp test eder — sunucu
 * tarafı zaten ayrı `route.test.ts` dosyalarında (vitest, D1/Turnstile
 * mock'lu) kapsanıyor.
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
    findingsCount: 1,
  },
  {
    id: "llms-txt",
    score: 10,
    max: 15,
    status: "partial",
    summary: { tr: "llms.txt kısmen dolu.", en: "llms.txt is partially filled." },
    findings: [],
    findingsCount: 1,
  },
  {
    id: "json-ld",
    score: 20,
    max: 20,
    status: "pass",
    summary: { tr: "Yapısal veri eksiksiz.", en: "Structured data is complete." },
    findings: [],
    findingsCount: 1,
  },
  {
    id: "lang-signals",
    score: 15,
    max: 15,
    status: "pass",
    summary: { tr: "Dil sinyalleri net.", en: "Language signals are clear." },
    findings: [],
    findingsCount: 1,
  },
  {
    id: "question-h2",
    score: 15,
    max: 25,
    status: "partial",
    summary: { tr: "Soru başlıkları kısmen var.", en: "Question headings partially present." },
    findings: [],
    findingsCount: 1,
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

test("tarama → sahne → skor kartı: URL güncellenir, kart görünür alana kayar, bağlantı kopyalanır", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("indoles.com.tr");
  await page.waitForTimeout(2100); // süre tuzağı: çubuk 2 sn'ye kadar bekler
  await page.getByRole("button", { name: "Denetle" }).click();

  // Tarama sahnesi satırları göründü (yanıt mock'lu olsa da satırlar
  // sırayla "okunuyor"a girip çözülerek geçer).
  await expect(page.locator(".tool-stage-row").first()).toBeVisible();

  const score = page.locator("[data-part='score']");
  await expect(score).toHaveText(`${TOTAL_SCORE}`, { timeout: 10_000 });
  await expect(page.getByText("İyi", { exact: true })).toBeVisible();
  await expect(page.locator("section[aria-labelledby='score-heading']")).toBeInViewport();
  await expect(page).toHaveURL(new RegExp(`${SHARE_PATH}$`));

  // Sinyal başlıkları `.signal-row` içindeki `h3`'lerdir (SignalRows) —
  // aynı 5 başlık sayfada AYRICA "Ölçülen 5 sinyal" statik bölümünde de
  // `h3` olarak durur; kapsamsız `getByRole` strict-mode'da iki eşleşmeyle
  // çakışırdı.
  for (const title of ["AI erişimi", "llms.txt", "Yapısal veri", "Dil sinyalleri", "Soru başlıkları"]) {
    await expect(
      page.locator(".signal-row").getByRole("heading", { name: title, level: 3 }),
    ).toBeVisible();
  }

  await page.getByRole("button", { name: "Bağlantıyı kopyala" }).click();
  await expect(page.getByRole("button", { name: "Kopyalandı" })).toBeVisible();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText.endsWith(SHARE_PATH)).toBe(true);
});

test("kilit kartı: rızasız gönderim uyarır, rızalı gönderim düzeltme listesini açar — kalanlar önce", async ({ page }) => {
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("https://www.indoles.com.tr/tr");
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Denetle" }).click();
  await expect(page.locator("[data-part='score']")).toHaveText(`${TOTAL_SCORE}`, { timeout: 10_000 });

  await expect(page.getByText("Kilitli")).toBeVisible();
  const reportSubmit = page.getByRole("button", { name: "Raporu gönder" });
  await page.getByLabel("E-posta adresi", { exact: true }).fill("burak@indoles.com.tr");

  // Kilit/kilit-açık bölgesi TEK `<section aria-label="Düzeltme listesi">`
  // (implicit `region`) — hem hata satırını hem sonraki `<ol>`u sayfanın
  // geri kalanından (özellikle Next.js'in her sayfada duran görünmez
  // `role="alert"` rota anons div'i, `__next-route-announcer__`) ayırmak
  // için kapsamlanır.
  const gate = page.getByRole("region", { name: "Düzeltme listesi" });

  let reportRequests = 0;
  page.on("request", (req) => { if (req.url().includes("/api/tools/geo-report")) reportRequests += 1; });
  await reportSubmit.click();
  await expect(gate.getByRole("alert")).toContainText("KVKK onayını işaretleyin");
  expect(reportRequests).toBe(0);

  await page.getByLabel(/KVKK kapsamında verilerimin işlenmesini kabul ediyorum/).check();
  await reportSubmit.click();
  await expect(page.getByRole("heading", { name: "Düzeltme listesi" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Düzeltme listesi" })).toBeFocused();
  // Aynı metin artık İKİ düğümde: `gate` içindeki görünür lede VE kilit
  // açılınca duyurulan kalıcı `sr-only` canlı bölge (bölümün DIŞINDA, spec
  // §4) — `page.getByText` kapsamsız kalırsa strict-mode ihlaline düşer;
  // `gate` içine kapsamlamak görünür olanı tek başına hedefler.
  await expect(gate.getByText("Raporun kopyası e-postanızda.")).toBeVisible();

  // İlk madde en çok puan kaybettiren kalem: question-h2 (15/25 → 10 kayıp).
  // `getByRole("list").filter({ hasText: "01" })` kırılgan (padStart metni
  // her satırda tekrarlanır, DOM sırasına güvenmez) — bunun yerine kilit
  // açık bölgesinin TEK `<ol>`ı (geçen sinyaller `<ul>`de, `<ol>`de değil)
  // doğrudan hedeflenir.
  const first = gate.locator("ol > li").first();
  await expect(first).toContainText("Soru başlıkları");
  await expect(page.getByText("question-h2 için öncelikli aksiyon.")).toBeVisible();
  expect(reportRequests).toBe(1);
});

test("engellenen site: target-blocked mesajı, kullanıcıyı suçlamaz", async ({ page }) => {
  await page.route("**/api/tools/geo-scan", (route) =>
    route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "target-blocked" }) }),
  );
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("hepsiburada.com");
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Denetle" }).click();
  // Next.js'in her sayfada duran görünmez rota anons div'i de `role="alert"`
  // taşır (`__next-route-announcer__`) — giriş çubuğu formuna (`name="scan-bar"`)
  // kapsamlanır.
  await expect(page.locator('form[name="scan-bar"]').getByRole("alert")).toContainText(
    "otomatik istekleri engelliyor",
  );
  await expect(page.getByLabel("Site adresi")).toBeEnabled();
});

test("araç rotasında persona popup'ı otomatik açılmaz", async ({ page }) => {
  await page.goto(TOOL_PATH);
  await page.waitForTimeout(6000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
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
