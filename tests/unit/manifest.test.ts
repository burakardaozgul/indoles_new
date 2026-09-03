import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import manifest from "@/app/manifest";

/**
 * Faz 2 madde 6 — manifest ikon yolları.
 *
 * `src/app/icon.png`/`apple-icon.png` Next'in dosya-tabanlı ikon
 * konvansiyonuyla derleniyor; derlenmiş çıktı uzantıyı KORUR
 * (`.next/server/app/icon.png`), uzantısız `/icon` yolu 404 verir.
 * `manifest.ts` önceden uzantısız yol yazıyordu — tarayıcı hiçbir zaman
 * gerçek bir ikon indirmiyordu. Bu test, manifest'in bastığı her `src`in
 * `src/app/` veya `public/` altında GERÇEK bir dosyaya karşılık geldiğini
 * doğrular.
 */
const ROOT = path.resolve(__dirname, "../..");

describe("manifest", () => {
  it("her ikon src'i src/app veya public altında gerçek bir dosyaya işaret eder", () => {
    const { icons } = manifest();
    expect(icons?.length).toBeGreaterThan(0);

    for (const icon of icons ?? []) {
      const src = typeof icon.src === "string" ? icon.src : String(icon.src);
      const rel = src.replace(/^\//, "");
      const inApp = existsSync(path.join(ROOT, "src/app", rel));
      const inPublic = existsSync(path.join(ROOT, "public", rel));
      expect(inApp || inPublic, `${src} src/app veya public altında yok`).toBe(true);
    }
  });

  it("ikon src'leri uzantı taşır — Next'in derlediği rota uzantısız DEĞİL", () => {
    const { icons } = manifest();
    for (const icon of icons ?? []) {
      const src = typeof icon.src === "string" ? icon.src : String(icon.src);
      expect(src).toMatch(/\.(png|svg|ico|jpg|jpeg)$/);
    }
  });
});
