import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Logo dosya adları iki bileşende elle yazılıyor ve `public/` ile eşleşmek
 * zorunda. Eşleşmediğinde Next image optimizer 400 döner ve logo sessizce
 * kaybolur — konsolu açmayan kimse fark etmez. Bu iki logo Türkçe karakterli
 * (`Taç.png`, `TurkTelekım-Logo.png`) yazıldığı için canlıda aylarca boş
 * kalmıştı; test o sınıf hatayı bir daha geçirmez.
 *
 * Karşılaştırma NFC ile normalize edilir: macOS dosya adlarını NFD saklar,
 * kaynak dosyadaki dizge NFC gelir; ham eşitlik yanlış negatif üretirdi.
 */
const LOGO_DIR = join(process.cwd(), "public", "musteri_logolari");
const SOURCES = [
  join(process.cwd(), "src", "components", "v2", "sections", "TrustedGrid.tsx"),
  join(process.cwd(), "src", "components", "marketing", "client-marquee.tsx"),
];

const onDisk = new Set(
  readdirSync(LOGO_DIR).map((f) => f.normalize("NFC")),
);

describe("müşteri logoları", () => {
  it.each(SOURCES)("%s içindeki her dosya adı public/ altında var", (src) => {
    const refs = [...readFileSync(src, "utf8").matchAll(/file:\s*"([^"]+)"/g)].map(
      (m) => m[1]!,
    );
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) {
      expect(onDisk.has(ref.normalize("NFC")), `${src} → ${ref}`).toBe(true);
    }
  });
});
