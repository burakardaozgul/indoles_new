import { chromium, devices } from "@playwright/test";

async function run(label, cookieState) {
  const browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  const calls = [];
  page.on("response", async r => { if (r.url().includes("/api/")) {
    let b=""; try{b=await r.text();}catch{}; calls.push(`${r.status()} -> ${b.slice(0,90)}`); } });

  await ctx.addCookies([{
    name: "indoles_popup_state",
    value: encodeURIComponent(JSON.stringify(cookieState)),
    domain: "www.indoles.com.tr", path: "/",
  }]);
  await page.goto("https://www.indoles.com.tr/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);

  // Hamburger → menü içindeki rezerve CTA
  await page.locator("header button, nav button").last().click().catch(()=>{});
  await page.waitForTimeout(900);
  const cta = page.getByRole("button", { name: /rezerve|görüşme/i }).first();
  await cta.click().catch(()=>{});
  await page.waitForTimeout(1500);

  const dlg = page.locator('[role="dialog"]');
  const firstText = (await dlg.innerText().catch(()=>"(yok)")).split("\n").filter(Boolean).slice(0,4).join(" | ");
  console.log(`\n### ${label}`);
  console.log("  açılan ekran:", firstText.slice(0,120));

  // "Yeniden planla" varsa tıkla
  const resched = dlg.getByRole("button", { name: /yeniden|planla|değiştir/i }).first();
  if (await resched.isVisible().catch(()=>false)) {
    await resched.click(); await page.waitForTimeout(1200);
    console.log("  yeniden planla -> tıklandı");
  }

  // Gün + saat + form
  await dlg.locator("button").filter({ hasText: /^31$/ }).first().click().catch(()=>{});
  await page.waitForTimeout(900);
  const slots = dlg.locator("button").filter({ hasText: /^\d{2}:\d{2}$/ });
  if (await slots.count()) await slots.first().click().catch(()=>{});
  await page.waitForTimeout(500);
  const setIf = async (s,v)=>{ const l=dlg.locator(s); if(await l.count()) await l.first().fill(v).catch(()=>{}); };
  await setIf("#firstName","Yeniden"); await setIf("#lastName","Planla");
  await setIf("#phone","+905550001122"); await setIf("#email","digital@indoles.com.tr");
  await setIf("#company","INDOLES"); await setIf("#title","Kurucu");
  await dlg.locator('input[type="checkbox"]').last().check({force:true}).catch(()=>{});
  await page.waitForTimeout(400);

  const submit = dlg.getByRole("button", { name: /talebini ilet|gönder|planla/i }).last();
  const dis = await submit.isDisabled().catch(()=>"?");
  console.log("  submit kilidi:", dis);
  await submit.click().catch(()=>{});
  await page.waitForTimeout(8000);
  const after = (await dlg.innerText().catch(()=>"(kapandı)")).split("\n").filter(Boolean).slice(0,3).join(" | ");
  console.log("  sonuç ekranı:", after.slice(0,100));
  console.log("  api:", calls.length ? calls : "(HİÇ ÇAĞRI YOK — sessiz düşüş)");
  await browser.close();
}

const base = { version:1, lastShownAt:new Date().toISOString(),
  expiresAt:new Date(Date.now()+180*864e5).toISOString() };

await run("B) tamamlanmış booking AMA problems eksik", {
  ...base, outcome:"completed", submissionType:"booking",
  persona:"donusum-teknoloji", problems:[],
  bookingSlot:{date:"2026-08-31", time:"14:00"} });
