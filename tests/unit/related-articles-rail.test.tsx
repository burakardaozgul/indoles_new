import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { RelatedArticlesRail } from "@/components/marketing/related-articles-rail";

/**
 * Şeridin istemci davranışı. jsdom düzen hesaplamaz; taşma, kart genişliği
 * ve kaydırma konumu prototip üzerinden taklit ediliyor. Ölçüler 1440'taki
 * gerçek düzene yakın: 1308px görünür alan, 402px kart.
 */
const articles = Array.from({ length: 5 }, (_, i) => ({
  href: `/tr/yazilar/yazi-${i + 1}`,
  title: `Yazı ${i + 1}`,
  excerpt: `Özet ${i + 1}`,
  meta: "6 dk okuma",
}));

const props = {
  heading: "İlgili yazılar",
  regionLabel: "Bu hizmetle ilgili yazılar",
  roleDescription: "karusel",
  prevLabel: "Önceki yazılar",
  nextLabel: "Sonraki yazılar",
  articles,
};

type Layout = { scrollWidth: number; clientWidth: number; card: number };

function mockLayout(layout: Layout) {
  const proto = HTMLElement.prototype;
  const restore: Array<() => void> = [];
  const define = (key: string, get: (el: HTMLElement) => number) => {
    const original = Object.getOwnPropertyDescriptor(proto, key);
    Object.defineProperty(proto, key, {
      configurable: true,
      get() {
        return get(this as HTMLElement);
      },
    });
    // `scrollWidth`/`clientWidth` jsdom'da `Element.prototype`ta durur;
    // HTMLElement'te kendi tanımı yoksa taklit silinir, kalıtım geri gelir.
    restore.push(() => {
      if (original) Object.defineProperty(proto, key, original);
      else delete (proto as unknown as Record<string, unknown>)[key];
    });
  };
  define("scrollWidth", (el) => (el.tagName === "UL" ? layout.scrollWidth : 0));
  define("clientWidth", (el) => (el.tagName === "UL" ? layout.clientWidth : 0));
  define("offsetWidth", (el) => (el.tagName === "LI" ? layout.card : 0));
  define("offsetLeft", (el) =>
    el.tagName === "LI"
      ? Array.from(el.parentElement!.children).indexOf(el) * layout.card
      : 0,
  );
  return () => restore.forEach((r) => r());
}

describe("RelatedArticlesRail", () => {
  let scrollBy: ReturnType<typeof vi.fn>;
  let restoreLayout: (() => void) | null = null;

  beforeEach(() => {
    scrollBy = vi.fn();
    (Element.prototype as unknown as { scrollBy: unknown }).scrollBy = scrollBy;
  });

  afterEach(() => {
    restoreLayout?.();
    restoreLayout = null;
    vi.unstubAllGlobals();
  });

  it("bölge carousel rolüyle ve anlamlı adla basılır, tüm kartlar DOM'da", () => {
    render(<RelatedArticlesRail {...props} />);
    const region = screen.getByRole("region", {
      name: "Bu hizmetle ilgili yazılar",
    });
    expect(region).toHaveAttribute("aria-roledescription", "karusel");
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(
      screen.getByRole("link", { name: /Yazı 3/ }),
    ).toHaveAttribute("href", "/tr/yazilar/yazi-3");
  });

  it("taşma yoksa düğmeler gizli kalır — ölü düğme çifti basılmaz", () => {
    restoreLayout = mockLayout({ scrollWidth: 1308, clientWidth: 1308, card: 402 });
    render(<RelatedArticlesRail {...props} articles={articles.slice(0, 1)} />);
    expect(screen.queryByRole("button", { name: "Önceki yazılar" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Sonraki yazılar" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Sonraki yazılar", hidden: true }),
    ).toBeInTheDocument();
  });

  it("taşma varken düğmeler görünür; başta 'önceki' aria-disabled, odaklanabilir kalır", () => {
    restoreLayout = mockLayout({ scrollWidth: 2085, clientWidth: 1308, card: 402 });
    render(<RelatedArticlesRail {...props} />);
    const prev = screen.getByRole("button", { name: "Önceki yazılar" });
    const next = screen.getByRole("button", { name: "Sonraki yazılar" });
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).not.toBeDisabled();
    expect(next).not.toHaveAttribute("aria-disabled");
  });

  it("'sonraki' sığan tam kart sayısı kadar kaydırır; uçtaki düğme tıklaması yok sayılır", () => {
    restoreLayout = mockLayout({ scrollWidth: 2085, clientWidth: 1308, card: 402 });
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q }));
    render(<RelatedArticlesRail {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Önceki yazılar" }));
    expect(scrollBy).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Sonraki yazılar" }));
    // 1308px alana 402px'lik üç kart sığar → 3 × 402.
    expect(scrollBy).toHaveBeenCalledWith({ left: 1206, behavior: "smooth" });
  });

  it("prefers-reduced-motion altında adım anlık (behavior: auto)", () => {
    restoreLayout = mockLayout({ scrollWidth: 2085, clientWidth: 1308, card: 402 });
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("reduce"),
      media: q,
    }));
    render(<RelatedArticlesRail {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Sonraki yazılar" }));
    expect(scrollBy).toHaveBeenCalledWith({ left: 1206, behavior: "auto" });
  });

  it("klavyeyle yarım görünen karta gelinince şerit onu görünür alana alır", () => {
    restoreLayout = mockLayout({ scrollWidth: 2085, clientWidth: 1308, card: 402 });
    const scrollIntoView = vi.fn();
    (Element.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView =
      scrollIntoView;
    render(<RelatedArticlesRail {...props} />);

    // Üçüncü kart (0–1206 arası) tam görünür: kaydırma yok.
    fireEvent.focus(screen.getByRole("link", { name: /Yazı 3/ }));
    expect(scrollIntoView).not.toHaveBeenCalled();

    // Dördüncü kart (1206–1608) kenardan taşıyor.
    fireEvent.focus(screen.getByRole("link", { name: /Yazı 4/ }));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(
      screen.getAllByRole("listitem")[3],
    );
  });

  it("sona gelince 'sonraki' aria-disabled olur, 'önceki' açılır", async () => {
    restoreLayout = mockLayout({ scrollWidth: 2085, clientWidth: 1308, card: 402 });
    render(<RelatedArticlesRail {...props} />);
    const list = screen.getByRole("list");
    list.scrollLeft = 777;
    await act(async () => {
      fireEvent.scroll(list);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(
      screen.getByRole("button", { name: "Sonraki yazılar" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByRole("button", { name: "Önceki yazılar" }),
    ).not.toHaveAttribute("aria-disabled");
  });
});
