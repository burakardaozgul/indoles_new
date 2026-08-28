import { chromium, devices } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
const calls = [];
page.on("response", async (r) => {
  if (r.url().includes("/api/")) { let b=""; try{b=await r.text();}catch{}
    calls.push(`${r.status()} ${r.url().split("/api/")[1]} -> ${b.slice(0,150)}`); }
});
const errs = [];
page.on("console", m => { if (m.type()==="error") errs.push(m.text().slice(0,160)); });

await page.goto("https://www.indoles.com.tr/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);
const dlg = page.locator('[role="dialog"]');

async function show(tag) {
  const txt = await dlg.innerText().catch(()=>"(dialog yok)");
  console.log(`\n--- ${tag} ---\n` + txt.split("\n").filter(Boolean).slice(0,10).join(" | "));
}
await show("STAGE 1");

// Stage 1: persona seç (ilk seçenek kartı)
const opts1 = dlg.locator('button, [role="button"]');
const n1 = await opts1.count();
for (let i = 0; i < n1; i++) {
  const t = (await opts1.nth(i).innerText().catch(()=>"" )).trim();
  if (t && !/close|kapat|geç|atla/i.test(t) && t.length > 8) { await opts1.nth(i).click(); break; }
}
await page.waitForTimeout(1200);
await show("STAGE 2");

// Stage 2: 3 problem seç — checkbox'lar label içinde
const boxes = dlg.locator('input[type="checkbox"]');
const nb = await boxes.count();
for (let i = 0; i < Math.min(3, nb); i++) { await boxes.nth(i).check({ force: true }).catch(()=>{}); await page.waitForTimeout(200); }
console.log(`\ncheckbox sayısı: ${nb} · işaretlenen: ${Math.min(3, nb)}`);
await dlg.getByRole("button", { name: /devam|ileri|sonraki/i }).first().click().catch(()=>{});
await page.waitForTimeout(1200);
await show("STAGE 3");

// Booking CTA
await dlg.getByRole("button", { name: /rezerve|görüşme|randevu/i }).first().click().catch(e=>console.log("booking CTA:", String(e).slice(0,70)));
await page.waitForTimeout(1500);
await show("BOOKING EKRANI");
await page.screenshot({ path: "/tmp/bk-booking.png" });

// Gün seç: 31 (ilk müsait gün)
await dlg.getByRole("button", { name: "31", exact: true }).click().catch(async () => {
  await dlg.locator("button").filter({ hasText: /^31$/ }).first().click().catch(e=>console.log("gün:", String(e).slice(0,60)));
});
await page.waitForTimeout(1200);
await show("GÜN SEÇİLDİ");

// Saat seç
const slotBtns = dlg.locator("button").filter({ hasText: /^\d{2}:\d{2}$/ });
const ns = await slotBtns.count();
console.log(`\nsaat düğmesi: ${ns}`);
if (ns > 0) { await slotBtns.first().click().catch(()=>{}); await page.waitForTimeout(800); }
await page.screenshot({ path: "/tmp/bk-slot.png", fullPage: true });

// Form doldur
// NOT: inputlarda name yok, id var (LeadFieldsForm).
const setIf = async (sel, val) => { const l = dlg.locator(sel); if (await l.count()) await l.first().fill(val).catch(()=>{}); };
await setIf("#firstName", "Mobil");
await setIf("#lastName", "Booking");
await setIf("#phone", "+905550001122");
await setIf("#email", "digital@indoles.com.tr");
await setIf("#company", "INDOLES");
await setIf("#title", "Kurucu");
const kv = dlg.locator('input[type="checkbox"]').last();
await kv.check({ force: true }).catch(()=>{});
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/bk-form.png", fullPage: true });

const submit = dlg.getByRole("button", { name: /talebini ilet|gönder|planla/i }).last();
console.log("\nsubmit kilidi:", await submit.isDisabled().catch(()=>"?"));
const scrollBefore = await page.evaluate(() => window.scrollY);
await submit.click().catch(e => console.log("submit hata:", String(e).slice(0,70)));
await page.waitForTimeout(9000);
const scrollAfter = await page.evaluate(() => ({ y: window.scrollY, h: document.body.scrollHeight }));
await show("SONUÇ");
console.log(`\nscroll: ${scrollBefore} -> ${scrollAfter.y} (sayfa yüksekliği ${scrollAfter.h})`);
console.log("api:", calls.length ? calls : "(yok)");
if (errs.length) console.log("konsol:", errs.slice(0,3));
await page.screenshot({ path: "/tmp/bk-result.png" });
await browser.close();
