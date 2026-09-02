import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Kök layout ve metadata rotaları — statik regresyon koruması.
 *
 * Neden statik kaynak testi:
 * Gerçek etiket sırasını görmek için sayfanın Next runtime'ında render
 * edilmesi gerekir; `RootLayout` async bir server component ve `getLocale()`
 * üzerinden request context ister, jsdom altında izole render edilemez.
 * Tam doğrulama ancak `pnpm build && pnpm start` + bot user-agent'lı istek
 * ile yapılabilir (ağ + birkaç dakika build). Bu dosya, ağ gerektirmeden
 * hatanın tekrar etmesini engelleyecek kaynak-seviyesi iddiaları tutar;
 * uçtan uca doğrulama `tests/e2e/` işidir.
 *
 * ÖNEMLİ ölçüm notu: "canonical/title `<body>` içinde basılıyor" bulgusunun
 * sebebi manuel `<head>` DEĞİLDİ — A/B build'iyle doğrulandı. Sebep Next
 * 15.5'in varsayılan streaming metadata davranışıdır ve yalnızca
 * `next.config.ts` → `htmlLimitedBots` ile kapatılır. Buradaki `<head>`
 * yasağı yine de geçerli bir kural: head'i React yönetmeli.
 */

const ROOT = path.resolve(__dirname, "../..");
const layoutSource = readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf8");

/**
 * Yorumlar çıkarılır: dosyanın kendi açıklaması kuralı anlatmak için `<head>`
 * kelimesini geçirir, bu bir ihlal değildir. Yalnızca gerçek JSX aranır.
 */
const layoutCode = layoutSource
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");

describe("kök layout", () => {
  it("elle `<head>` elemanı render etmez", () => {
    expect(layoutCode).not.toMatch(/<head[\s>]/);
    expect(layoutCode).not.toMatch(/<\/head>/);
  });

  it("persona bootstrap script'i korunur ve `data-persona` yazar", () => {
    expect(layoutSource).toContain("indoles_persona");
    expect(layoutSource).toContain("setAttribute('data-persona'");
    expect(layoutSource).toContain("dangerouslySetInnerHTML");
  });

  it("persona script'i `<body>`nin ilk çocuğudur (senkron, boyamadan önce)", () => {
    const bodyStart = layoutCode.indexOf("<body>");
    const scriptStart = layoutCode.indexOf("<script dangerouslySetInnerHTML");
    const childrenStart = layoutCode.indexOf("{children}");
    expect(bodyStart).toBeGreaterThan(-1);
    expect(scriptStart).toBeGreaterThan(bodyStart);
    expect(scriptStart).toBeLessThan(childrenStart);
  });

  it("GA4 hem GA_ID hem production stage koşuluna bağlıdır", () => {
    expect(layoutSource).toContain("NEXT_PUBLIC_GA_ID");
    expect(layoutSource).toContain("googletagmanager.com/gtag/js");
    // Tek koşula düşerse preview trafiği production property'sine karışır.
    const gate = layoutSource.slice(
      layoutSource.indexOf("const GA_ENABLED"),
      layoutSource.indexOf("export default"),
    );
    expect(gate).toContain("Boolean(GA_ID)");
    expect(gate).toContain('NEXT_PUBLIC_APP_STAGE === "production"');
    // Render tek bir kapıdan geçmeli, `GA_ID` doğrudan koşul olmamalı.
    expect(layoutCode).toContain("{GA_ENABLED ?");
  });

  /**
   * Görev 17.4 — E2E'de her sayfa yüklemesinde `Uncaught TurnstileError`
   * gözlendi: script `?render=explicit` OLMADAN yükleniyor, sayfadaki
   * `.cf-turnstile` konteynerlerini (data-sitekey'siz, çünkü tüm tüketiciler
   * `turnstile.render()` ile İMPERATİF render ediyor — bkz. `use-turnstile.
   * ts`, `ContactForm.tsx`) otomatik (implicit) render etmeye çalışıyor ve
   * hata veriyor. Tüm tüketiciler explicit render kullandığı için düzeltme
   * script'in kendisine `?render=explicit` eklemek — hiçbir tüketici
   * kodunun değişmesi gerekmiyor (task-17-report.md'de gerekçelendirildi).
   */
  it("Turnstile script'i ?render=explicit taşır (implicit auto-render kapalı)", () => {
    expect(layoutSource).toContain(
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    );
  });
});

describe("metadata dosya rotaları", () => {
  const files = [
    // ADR-024: üç görsel `ImageResponse` üreticisiyken statik PNG'ye
    // çevrildi — üretici tek ve değişmeyen bir kart çiziyordu ama worker
    // paketine ~2,2 MB ekliyordu (@vercel/og + fontkit).
    "src/app/icon.png",
    "src/app/apple-icon.png",
    "src/app/opengraph-image.png",
    "src/app/manifest.ts",
  ];

  it.each(files)("%s mevcut", (rel) => {
    expect(existsSync(path.join(ROOT, rel))).toBe(true);
  });

  /**
   * Bu rotalar uzantı taşımadığı için next-intl matcher'ındaki `.*\..*`
   * elemesine takılmıyordu; `/icon` → `/tr/icon` 307 → 404 oluyordu, yani
   * favicon ve OG görseli hiç servis edilmiyordu.
   */
  it("middleware matcher'ı bu rotaları locale prefix'inden muaf tutar", () => {
    const mw = readFileSync(path.join(ROOT, "src/middleware.ts"), "utf8");
    const matcher = mw.slice(mw.indexOf("matcher:"));
    for (const route of ["icon$", "apple-icon$", "opengraph-image$"]) {
      expect(matcher).toContain(route);
    }
  });

  /**
   * Bir sayfa `openGraph` alanını tanımladığı anda kökteki
   * `opengraph-image.tsx` devralınmıyor. `twitter:card` her sayfada
   * `summary_large_image` olduğu için görselsiz kalması boş kart demekti.
   */
  it("buildMetadata her sayfaya varsayılan og:image verir", () => {
    /**
     * Önceden kaynak dizgesi aranıyordu (`images: [OG_IMAGE]`) ve alt metni
     * dile bağlama değişikliği testi kırdı — oysa davranış bozulmamıştı.
     * Test artık üretilen metadata'ya bakıyor: aranan şey görselin var
     * olması, nasıl yazıldığı değil.
     */
    for (const locale of ["tr", "en"] as const) {
      const meta = buildMetadata({
        title: "T",
        description: "d",
        paths: { tr: "/tr/x", en: "/en/x" },
        locale,
      });
      const og = meta.openGraph as { images: Array<{ url: string; alt: string }> };
      expect(og.images[0]?.url).toBe("/opengraph-image.png");
      expect(og.images[0]?.alt.length).toBeGreaterThan(0);

      const twitter = meta.twitter as { images: string[] };
      expect(twitter.images[0]).toBe("/opengraph-image.png");
    }
  });
});
