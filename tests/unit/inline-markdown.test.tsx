import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderInline } from "@/components/marketing/inline-markdown";
import { ARTICLES } from "@/lib/content/articles";
import { CASES } from "@/lib/content/cases";
import { PACKAGES } from "@/lib/content/packages";
import { PILLARS } from "@/lib/content/pillars";
import { SERVICES } from "@/lib/content/services";
import { TOOLS } from "@/lib/content/tools";
import { localizedHref, type SegmentKind } from "@/lib/i18n/segments";

/**
 * Yazı gövdesindeki satır içi bağlantıların locale çözümü.
 *
 * Külliyat kuralı: gövdede her iki dilde de kanonik TR yol yazılır
 * (`/paketler/buyume-sprinti`); EN slug'a çeviri `renderInline`in işidir.
 * Paket dalı 2026-09-25'te eklendi — öncesinde EN'de TR slug'lı
 * `/en/packages/buyume-sprinti` üretiliyordu ve bir yazı bu yüzden EN
 * gövdeye elle EN slug yazmıştı.
 */

type Loc = "tr" | "en";

function hrefOf(text: string, loc: Loc): string | null {
  const { container, unmount } = render(<>{renderInline(text, loc)}</>);
  const href = container.querySelector("a")?.getAttribute("href") ?? null;
  unmount();
  return href;
}

describe("renderInline — locale başına slug çözümü", () => {
  const svc = SERVICES.find((s) => s.slug.tr !== s.slug.en)!;
  const art = ARTICLES.find((a) => a.slug.tr !== a.slug.en)!;
  const cas = CASES.find((c) => c.slug.tr !== c.slug.en)!;
  const tool = TOOLS.find((t) => t.slug.tr !== t.slug.en) ?? TOOLS[0]!;
  const pkg = PACKAGES.find((p) => p.slug.tr !== p.slug.en)!;

  it.each([
    ["hizmet", "hizmetler", "services", svc.slug],
    ["yazı", "yazilar", "articles", art.slug],
    ["vaka", "vakalar", "cases", cas.slug],
    ["araç", "araclar", "tools", tool.slug],
    ["paket", "paketler", "packages", pkg.slug],
  ] as const)(
    "%s: TR yol iki dilde doğru adrese çözülür",
    (_label, trSegment, kind, slug) => {
      const text = `bkz. [bağlantı](/${trSegment}/${slug.tr}) burada`;
      expect(hrefOf(text, "tr")).toBe(localizedHref("tr", kind, slug.tr));
      expect(hrefOf(text, "en")).toBe(localizedHref("en", kind, slug.en));
    },
  );

  it("paket: Büyüme Sprinti EN'de growth-sprint adresine gider", () => {
    render(<>{renderInline("[Growth Sprint](/paketler/buyume-sprinti)", "en")}</>);
    expect(screen.getByRole("link", { name: "Growth Sprint" })).toHaveAttribute(
      "href",
      "/en/packages/growth-sprint",
    );
  });

  it("kayıtta olmayan slug segment çevirisine düşer", () => {
    expect(hrefOf("[x](/paketler/olmayan-paket)", "en")).toBe(
      "/en/packages/olmayan-paket",
    );
  });
});

/**
 * Külliyat koruması: yazı gövdelerindeki her slug'lı iç bağlantı, iki dilde
 * de mevcut bir kaydın TR slug'ını taşır. EN gövdeye elle yazılmış EN slug
 * ya da yazım hatalı slug burada kırmızıya düşer — renderer onu sessizce
 * 404'e çevirirdi.
 */
describe("yazı gövdesi bağlantıları kanonik TR yol taşır", () => {
  const TR_SLUGS: Record<string, { kind: SegmentKind; slugs: Set<string> }> = {
    hizmetler: {
      kind: "services",
      slugs: new Set([
        ...SERVICES.map((s) => s.slug.tr),
        ...PILLARS.map((p) => p.key),
      ]),
    },
    yazilar: { kind: "articles", slugs: new Set(ARTICLES.map((a) => a.slug.tr)) },
    vakalar: { kind: "cases", slugs: new Set(CASES.map((c) => c.slug.tr)) },
    araclar: { kind: "tools", slugs: new Set(TOOLS.map((t) => t.slug.tr)) },
    paketler: { kind: "packages", slugs: new Set(PACKAGES.map((p) => p.slug.tr)) },
  };

  const links: Array<[string, Loc, string, string]> = [];
  for (const a of ARTICLES) {
    for (const loc of ["tr", "en"] as const) {
      for (const b of a.blocks) {
        const texts =
          b.type === "list"
            ? b.items.map((i) => i[loc])
            : "text" in b
              ? [b.text[loc]]
              : [];
        for (const t of texts) {
          for (const m of t.matchAll(/\]\((\/[^)]+)\)/g)) {
            const parts = m[1]!.split("/").filter(Boolean);
            if (parts.length >= 2 && parts[0]! in TR_SLUGS) {
              links.push([a.slug.tr, loc, parts[0]!, parts[1]!]);
            }
          }
        }
      }
    }
  }

  it("taranacak bağlantı var", () => {
    expect(links.length).toBeGreaterThan(100);
  });

  it("her slug o türün TR slug'ıdır", () => {
    for (const [article, loc, segment, slug] of links) {
      expect(
        TR_SLUGS[segment]!.slugs.has(slug),
        `${article}/${loc}: /${segment}/${slug}`,
      ).toBe(true);
    }
  });

  it("paket bağlantıları iki dilde paketin kendi slug'ına çözülür", () => {
    const pkgLinks = links.filter(([, , segment]) => segment === "paketler");
    expect(pkgLinks.length).toBeGreaterThan(0);
    for (const [article, loc, , slug] of pkgLinks) {
      const pkg = PACKAGES.find((p) => p.slug.tr === slug)!;
      expect(hrefOf(`[p](/paketler/${slug})`, loc), `${article}/${loc}`).toBe(
        localizedHref(loc, "packages", pkg.slug[loc]),
      );
    }
  });
});
