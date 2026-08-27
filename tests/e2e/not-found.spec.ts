import { test, expect } from "@playwright/test";

/**
 * 404 yüzeyinin **ham HTML** regresyonu (denetim T-08b / T-15).
 *
 * `page.goto` yerine `request.get` kullanılıyor: JavaScript çalıştırmayan
 * istemcilerin (GPTBot, ClaudeBot, PerplexityBot, CCBot) gördüğü ilk baytları
 * denetliyoruz. Hata tam olarak burada gizlenmişti — tarayıcıda hidrasyon
 * sonrası her şey doğru görünüyordu, ilk HTML'de ise EN adreslerde Türkçe
 * gövde, ana sayfanın başlığı ve iki çelişik `robots` etiketi vardı.
 *
 * Bilinen ve kod tarafından kapatılamayan kısıt: `notFound()` fırlatıldığında
 * Next 15.5 kök `layout.tsx`'i render etmiyor, kendi `<html id="__next_error__">`
 * kabuğunu kuruyor — bu yüzden ilk HTML'de `lang` özniteliği yok. Bu test o
 * eksiği iddia ETMİYOR; kapatılabilir olanları kilitliyor.
 */

/**
 * Karşılaştırma metinleri bilinçli olarak `[locale]/not-found.tsx`'in
 * **lede**'sinden seçildi: kök `not-found.tsx` iki dilli olduğu için başlık
 * cümlesi ("Bu adreste bir sayfa yok." / "There is no page…") her iki gövdede
 * de geçiyor ve ayırt edici değil. Lede yalnız locale gövdesinde var.
 */
const CASES = [
  {
    path: "/tr/olmayan-sayfa",
    title: "Sayfa bulunamadı",
    body: "Aradığınız içerik büyük olasılıkla aşağıdaki başlıklardan birinde duruyor",
    foreignBody:
      "What you are looking for is most likely under one of the headings below",
  },
  {
    path: "/en/does-not-exist",
    title: "Page not found",
    body: "What you are looking for is most likely under one of the headings below",
    foreignBody:
      "Aradığınız içerik büyük olasılıkla aşağıdaki başlıklardan birinde duruyor",
  },
] as const;

test.describe("404 — ham HTML (JS'siz istemci)", () => {
  for (const c of CASES) {
    test(`${c.path}: 404 döner, kendi dilinde başlık ve gövde taşır`, async ({
      request,
    }) => {
      const res = await request.get(c.path);
      expect(res.status()).toBe(404);

      const html = await res.text();

      // Başlık o dilde ve ana sayfanın başlığı DEĞİL.
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      expect(title).toContain(c.title);
      expect(title).not.toContain("Dönüşüm ve büyüme stüdyosu");

      // Gövde kendi dilinde; karşı dilin gövdesi ilk HTML'e sızmıyor.
      expect(html).toContain(c.body);
      expect(html).not.toContain(c.foreignBody);

      // Tek robots etiketi ve noindex (önceden `noindex` + `index, follow`
      // aynı anda basılıyordu).
      const robots = html.match(/<meta name="robots" content="[^"]*"/g) ?? [];
      expect(robots).toHaveLength(1);
      expect(robots[0]).toContain("noindex");

      // 404 kendini ana sayfaya kanonikleştirmiyor (T-15).
      expect(html).not.toContain('rel="canonical"');
      expect(html).not.toContain('hreflang="x-default"');
    });
  }

  test("bilinçli kapatılan slug da 404 döner", async ({ request }) => {
    // `hipnoz` ofis köpeği kaydı: sitemap dışı, sayfa almıyor.
    const res = await request.get("/tr/danismanlar/hipnoz");
    expect(res.status()).toBe(404);
  });
});
