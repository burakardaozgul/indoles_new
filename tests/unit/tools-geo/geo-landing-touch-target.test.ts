import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Faz 2 madde 10 — GEO landing "ilgili" bloğunun dokunma hedefi.
 *
 * `diagnoo` araç sayfasında (Faz 2 Görev 3) aynı kalıp tespit edilip
 * düzeltilmişti: `py-3` `<li>`de durursa dikey boşluk hedefe (bağlantının
 * KENDİSİne) sayılmaz — mobilde dokunma hedefi WCAG 2.2 AA SC 2.5.8'in
 * altına (~26 px) düşer. GEO landing'in "ilgili yazılar" bloğu AYNI kusuru
 * taşıyordu. Bu statik kaynak testi gerçek DOM render'ı gerektirmeden
 * (`RootLayout`/next-intl bağımlılığı ağır) kusurun geri gelmesini engeller.
 */
const ROOT = path.resolve(__dirname, "../../..");
const source = readFileSync(
  path.join(
    ROOT,
    "src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/page.tsx",
  ),
  "utf8",
);

describe("GEO landing — ilgili yazılar dokunma hedefi", () => {
  it("`py-3` <li>de DEĞİL, iç <Link>in className'inde durur", () => {
    const liMatch = source.match(/<li key=\{a\.slug\[loc\]\}([^>]*)>/);
    expect(liMatch).not.toBeNull();
    expect(liMatch![1]).not.toContain("py-3");

    const linkClassMatch = source.match(
      /href=\{localeHref\(`\/yazilar\/\$\{a\.slug\[loc\]\}`, loc\)\}\s*\n\s*className="([^"]*)"/,
    );
    expect(linkClassMatch).not.toBeNull();
    expect(linkClassMatch![1]).toContain("py-3");
  });
});
