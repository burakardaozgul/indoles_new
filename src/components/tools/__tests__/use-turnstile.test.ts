import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * `TURNSTILE_ENABLED` doc yorumunun ADR-028 gerçeğiyle tutarlılığı — Cila A
 * madde 6. Eski yorum iki noktada yanlıştı: (1) bayrağın launch'ta kapalı
 * oluşunu "geliştirme ortamı" kısayolu gibi gösteriyordu — asıl neden
 * Cloudflare challenge host'unun IPv4 A kaydı taşımaması (ADR-028); (2) araç
 * rotalarının (`DiagnooForm`, `DiagnooUnlockForm`) bayrağı ATLADIĞINI
 * söylüyordu, oysa hepsi AYNI `TURNSTILE_ENABLED` sabitini okur
 * (diagnoo-form.tsx, diagnoo-unlock-form.tsx, report-gate.tsx, scan-bar.tsx).
 * Kod davranışı değişmiyor; yalnız yorum gerçeğe dönüyor, bu yüzden içerik
 * kaynaktan okunup doğrulanıyor.
 */
describe("useTurnstileToken doc yorumu", () => {
  const source = readFileSync(
    join(process.cwd(), "src/components/tools/use-turnstile.ts"),
    "utf8",
  );

  it("bayrağın kapalı oluşunu 'geliştirme ortamı' diye göstermez", () => {
    expect(source).not.toMatch(/geliştirme ortamı/);
  });

  it("araç rotalarının bayrağı atladığı yanlış iddiasını taşımaz", () => {
    expect(source).not.toMatch(/bu rotaları kapsamaz/);
  });

  it("ADR-028'e ve gerçek kapsam alanına (tüm formlar) referans verir", () => {
    expect(source).toMatch(/ADR-028/);
    expect(source).toMatch(/TURNSTILE_ENABLED/);
  });
});
