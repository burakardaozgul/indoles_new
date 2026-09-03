import * as React from "react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { V2Nav, type V2NavLink } from "../V2Nav";

/**
 * Araç girişi — header'ın ikincil vurgu kademesi (Burak 2026-09-03,
 * docs/04 §12.11).
 *
 * Burada kilitlenen sözleşme: `/araclar` header'da HEM masaüstü satırında HEM
 * çekmecede var, sıradan `.v2-nav-link` / `.v2-nav-drawer-link` sınıflarını
 * ALMIYOR, iki dilde de doğrudan nihai adrese (307 atlamasız) gidiyor ve
 * `/araclar` ile alt yollarında `aria-current="page"` taşıyor. Ayrıca giriş
 * animasyonunun ölçüm kümesi (`[data-nav-item]`) büyümüyor — büyüseydi stagger
 * sırası ve nav'ın grid şablonu sessizce değişirdi.
 */

// next-intl `Link`'i gerçek kalıyor (adres çözümü test edilenin kendisi);
// yalnız route bağlamı taklit ediliyor.
const pathnameRef = { current: "/" };
vi.mock("@/lib/i18n/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/i18n/navigation")>();
  return { ...actual, usePathname: () => pathnameRef.current };
});

vi.mock("@/lib/popup/popup-context", () => ({
  usePopup: () => ({ openPopup: vi.fn() }),
}));

const LINKS: V2NavLink[] = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/hizmetler", label: "Hizmetler" },
];

const LABEL = { tr: "Ücretsiz Araçlar", en: "Free Tools" } as const;

function renderNav(locale: "tr" | "en", pathname = "/") {
  pathnameRef.current = pathname;
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <V2Nav
        locale={locale}
        links={LINKS}
        ctaLabel="Görüşme rezerve et"
        toolsLabel={LABEL[locale]}
        menuLabel="Menü"
      />
    </NextIntlClientProvider>
  );
}

/** Araç girişinin iki örneği: masaüstü aksiyon şeridi + çekmece. */
function toolsEntries(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLAnchorElement>(".v2-nav-tools")
  );
}

beforeAll(() => {
  // jsdom'da yok; hareket kısıtı açık raporlanınca GSAP giriş efekti hiç
  // kurulmaz ve test saf DOM üzerinde kalır.
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe("V2Nav — araç girişi", () => {
  it("masaüstü aksiyon şeridinde ve çekmecede birer kez bulunur", () => {
    const { container } = renderNav("tr");
    const entries = toolsEntries(container);
    expect(entries).toHaveLength(2);

    const actions = container.querySelector(".v2-nav-actions");
    expect(actions).not.toBeNull();
    expect(
      within(actions as HTMLElement).getByText(LABEL.tr)
    ).toBeInTheDocument();

    const drawer = container.querySelector("#v2-nav-drawer");
    expect(drawer).not.toBeNull();
    expect(
      within(drawer as HTMLElement).getByText(LABEL.tr)
    ).toBeInTheDocument();
  });

  it("masaüstünde dil değiştirici ile birincil CTA arasında durur", () => {
    const { container } = renderNav("tr");
    const actions = container.querySelector(".v2-nav-actions") as HTMLElement;
    const order = Array.from(actions.children).map((el) => el.className);
    expect(order).toEqual(["v2-nav-locale", "v2-nav-tools", "v2-nav-cta"]);
  });

  it("çekmecede link listesinin üstünde durur", () => {
    const { container } = renderNav("tr");
    const main = container.querySelector(".v2-nav-drawer-main") as HTMLElement;
    expect(main.children[0]).toHaveClass("v2-nav-tools");
    expect(main.children[1]?.tagName).toBe("UL");
  });

  it("sıradan nav/çekmece link sınıflarını almaz", () => {
    const { container } = renderNav("tr");
    for (const el of toolsEntries(container)) {
      expect(el).not.toHaveClass("v2-nav-link");
      expect(el).not.toHaveClass("v2-nav-drawer-link");
    }
    // Liste öğesi de değil: `<ul>` içindeki maddelerden biri olmamalı.
    expect(container.querySelectorAll("li .v2-nav-tools")).toHaveLength(0);
  });

  it("gerçek bağlantıdır — uydurma role veya buton değil", () => {
    const { container } = renderNav("tr");
    for (const el of toolsEntries(container)) {
      expect(el.tagName).toBe("A");
      expect(el.getAttribute("role")).toBeNull();
    }
  });

  it("TR'de /tr/araclar, EN'de /en/tools adresine gider (307 atlamasız)", () => {
    const tr = renderNav("tr");
    for (const el of toolsEntries(tr.container)) {
      expect(el.getAttribute("href")).toBe("/tr/araclar");
    }
    tr.unmount();

    const en = renderNav("en");
    for (const el of toolsEntries(en.container)) {
      expect(el.getAttribute("href")).toBe("/en/tools");
    }
  });

  it("/araclar ve alt yollarında aria-current=page taşır", () => {
    for (const path of ["/araclar", "/araclar/diagnoo"]) {
      const { container, unmount } = renderNav("tr", path);
      for (const el of toolsEntries(container)) {
        expect(el.getAttribute("aria-current"), path).toBe("page");
      }
      unmount();
    }
  });

  it("başka bir sayfada aria-current taşımaz", () => {
    const { container } = renderNav("tr", "/hizmetler");
    for (const el of toolsEntries(container)) {
      expect(el.getAttribute("aria-current")).toBeNull();
    }
  });

  it("giriş animasyonunun ölçüm kümesini büyütmez", () => {
    const { container } = renderNav("tr");
    const measured = container.querySelectorAll("[data-nav-item]");
    // logo · link listesi · aksiyonlar · burger — dördü, fazlası değil.
    expect(measured).toHaveLength(4);
    for (const el of toolsEntries(container)) {
      expect(el.hasAttribute("data-nav-item")).toBe(false);
    }
  });

  it("etiket iki dilde de mesaj katmanından gelir", () => {
    const tr = renderNav("tr");
    expect(tr.getAllByText(LABEL.tr)).toHaveLength(2);
    tr.unmount();
    const en = renderNav("en");
    expect(en.getAllByText(LABEL.en)).toHaveLength(2);
  });
});
