import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroTitleLayer } from "@/components/v2/hero/HeroTitleLayer";
import { TITLE_ROWS } from "@/components/v2/hero/title-content";
import {
  PersonaText,
  PersonaSeparator,
} from "@/components/marketing/persona-text";
import { localeHref } from "@/lib/i18n/locale-href";

const SRC = join(process.cwd(), "src");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf8");

/**
 * Ana sayfanın EN kopyası TR segmentini hardcode ettiği için her iç link
 * `/en/vakalar/...` → 307 → `/en/case-studies/...` zinciri kuruyordu. Segment
 * çevirisi `localeHref` üzerinden yapılır; burada hem üretilen adres hem de
 * kalıbın geri gelmemesi doğrulanır.
 */
describe("v2 ana sayfa — locale'e göre segment çevirisi", () => {
  it("vaka ve hizmet adresleri EN'de çevrilmiş segmentle üretilir", () => {
    expect(localeHref("/vakalar", "en")).toBe("/en/case-studies");
    expect(localeHref("/vakalar/odorgo-kategori-yaratma", "en")).toBe(
      "/en/case-studies/odorgo-kategori-yaratma",
    );
    expect(localeHref("/hizmetler/growth", "en")).toBe("/en/services/growth");
  });

  it("TR tarafı değişmez", () => {
    expect(localeHref("/vakalar", "tr")).toBe("/tr/vakalar");
    expect(localeHref("/vakalar/odorgo-kategori-yaratma", "tr")).toBe(
      "/tr/vakalar/odorgo-kategori-yaratma",
    );
    expect(localeHref("/hizmetler/growth", "tr")).toBe("/tr/hizmetler/growth");
  });

  it("hiçbir v2 bölümü locale ön ekine TR segmenti yapıştırmaz", () => {
    const files = [
      "components/v2/sections/WorkCard.tsx",
      "components/v2/sections/FeaturedWork.tsx",
      "components/v2/sections/Pillars.tsx",
      "components/v2/sections/ServicesScroll.tsx",
    ];
    // `/${locale}/vakalar`, `/${locale}/hizmetler`, `/${locale}/paketler`…
    const hardcoded = /\$\{locale\}\/(vakalar|hizmetler|paketler|yazilar|danismanlar)/;
    for (const f of files) {
      expect(read(f), `${f} TR segmentini hardcode ediyor`).not.toMatch(
        hardcoded,
      );
    }
  });
});

/**
 * Hero başlığı görsel katmanlama için iki kez basılır (ink + accent). İki
 * `h1` üretmesi belge anahat yapısını bozuyordu; ikinci katman semantiksiz.
 */
describe("HeroTitleLayer — tek h1", () => {
  const rows = TITLE_ROWS.tr;
  const offsets = rows.map(() => 0);

  it("ink katmanı h1 basar", () => {
    const { container } = render(
      <HeroTitleLayer rows={rows} variant="ink" indexOffsets={offsets} />,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("accent katmanı h1 basmaz ve aria-hidden'dır", () => {
    const { container } = render(
      <HeroTitleLayer rows={rows} variant="accent" indexOffsets={offsets} />,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(0);
    expect(
      container.querySelector('[data-title-layer="accent"]'),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("iki katman birlikte basıldığında sayfada tek h1 kalır", () => {
    const { container } = render(
      <>
        <HeroTitleLayer rows={rows} variant="ink" indexOffsets={offsets} />
        <HeroTitleLayer rows={rows} variant="accent" indexOffsets={offsets} />
      </>,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("görsel katmanlama korunur — iki katman aynı harf ve indeks yapısını üretir", () => {
    const grab = (variant: "ink" | "accent") => {
      const { container } = render(
        <HeroTitleLayer rows={rows} variant={variant} indexOffsets={offsets} />,
      );
      const el = container.querySelector(".v2-title")!;
      return {
        className: el.className,
        rows: el.querySelectorAll(".v2-title-row").length,
        letters: [...el.querySelectorAll<HTMLElement>(".v2-letter")].map(
          (l) => `${l.dataset.i}:${l.textContent}`,
        ),
      };
    };
    const ink = grab("ink");
    const accent = grab("accent");
    expect(accent.className).toBe(ink.className);
    expect(accent.rows).toBe(ink.rows);
    expect(accent.letters).toEqual(ink.letters);
  });
});

/**
 * Persona metinleri iki varyantı da DOM'a basar, seçimi CSS yapar. CSS
 * çalıştırmayan istemciler (GPTBot, ClaudeBot, PerplexityBot) iki cümleyi
 * bitişik okuyordu. Mimari korunuyor; yalnız ayırıcı ekleniyor.
 */
describe("PersonaText — CSS'siz istemcide varyantlar ayrı okunur", () => {
  const props = {
    industrial: "Rekabet edemez olmak demek.",
    commerce: "Bedava büyüme dönemi bitti.",
  };

  it("ham metinde iki varyant bitişmez", () => {
    const { container } = render(<PersonaText {...props} />);
    expect(container.textContent).not.toContain("demek.Bedava");
    expect(container.textContent).toMatch(/demek\.\s+Bedava/);
  });

  it("iki varyant da DOM'da kalır — mimari değişmedi", () => {
    const { container } = render(<PersonaText {...props} />);
    expect(
      container.querySelector('[data-persona-variant="industrial"]')
        ?.textContent,
    ).toBe(props.industrial);
    expect(container.textContent).toContain(props.commerce);
  });

  it("ayırıcı boşluktur — görünür metne karakter eklemez", () => {
    const { container } = render(<PersonaSeparator />);
    expect(container.textContent?.trim()).toBe("");
  });

  it("ayırıcı her iki personada da mevcut CSS kuralıyla gizlenir", () => {
    // Kural: aktif olmayan varyant `display:none`. Ayırıcı `commerce`
    // kabının içinde ama `industrial` işareti taşır — persona ne olursa
    // olsun kaplardan biri onu gizler. Yeni CSS kuralı gerekmez.
    const { container } = render(<PersonaText {...props} />);
    const sep = container.querySelector("[data-persona-sep]")!;
    expect(sep.getAttribute("data-persona-variant")).toBe("industrial");
    expect(sep.closest('[data-persona-variant="commerce"]')).not.toBeNull();
  });

  it("iki versiyon aynıysa ne varyant ne ayırıcı basılır", () => {
    const { container } = render(
      <PersonaText industrial="Aynı" commerce="Aynı" />,
    );
    expect(container.querySelectorAll("[data-persona-variant]")).toHaveLength(
      0,
    );
    expect(container.textContent).toBe("Aynı");
  });

  it("persona ayırıcısı gerçekten kullanılıyor — CSS kuralı yerinde", () => {
    const css = read("styles/globals.css");
    expect(css).toMatch(/\[data-persona-variant="industrial"\]/);
    expect(css).toMatch(/\[data-persona-variant="commerce"\]/);
  });
});
