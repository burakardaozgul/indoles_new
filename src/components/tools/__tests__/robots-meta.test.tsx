import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { RobotsMeta } from "../robots-meta";

/**
 * Faz 2 madde 5 — robots meta senkronu.
 *
 * Diagnoo/GEO araçları sayfa geçişi yapmadan (`history.replaceState`) rapor/
 * sonuç fazına geçer; sunucunun ilk render'da bastığı `<meta name="robots">`
 * DOM'da kalır. Bu bileşen mount'ta etiketi günceller, unmount'ta eski
 * değere döner (ya da kendi oluşturduysa etiketi tamamen kaldırır).
 */
describe("RobotsMeta", () => {
  afterEach(() => {
    cleanup();
    document.head.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove());
  });

  it("etiket yoksa oluşturur ve content'i basar", () => {
    const { unmount } = render(<RobotsMeta content="noindex, follow" />);

    const tag = document.querySelector('meta[name="robots"]');
    expect(tag).not.toBeNull();
    expect(tag).toHaveAttribute("content", "noindex, follow");

    unmount();
    // Kendi oluşturduğu etiketi unmount'ta tamamen kaldırır — sayfanın
    // ORİJİNALDE hiç robots etiketi yoktu.
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("etiket zaten varsa eski değeri unmount'ta geri yazar", () => {
    const existing = document.createElement("meta");
    existing.name = "robots";
    existing.content = "index, follow";
    document.head.appendChild(existing);

    const { unmount } = render(<RobotsMeta content="noindex, follow" />);

    const tag = document.querySelector('meta[name="robots"]');
    expect(tag).toHaveAttribute("content", "noindex, follow");

    unmount();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
  });

  it("faz değişince (content prop değişince) etiket içeriği güncellenir", () => {
    const existing = document.createElement("meta");
    existing.name = "robots";
    existing.content = "index, follow";
    document.head.appendChild(existing);

    const { rerender, unmount } = render(<RobotsMeta content="noindex, follow" />);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );

    rerender(<RobotsMeta content="noindex, nofollow" />);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );

    unmount();
    // İlk mount'ta yakalanan orijinal değere döner, ara değere değil.
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
  });
});
