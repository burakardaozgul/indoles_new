import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { TrackView } from "../track-view";

const gtag = vi.fn();

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
});

afterEach(() => {
  delete (window as unknown as { gtag?: unknown }).gtag;
});

describe("TrackView", () => {
  it("bağlandığında olayı yazar", () => {
    render(
      <TrackView
        event={{ name: "pillar_viewed", properties: { pillar: "growth", locale: "tr" } }}
      />,
    );
    expect(gtag).toHaveBeenCalledWith("event", "pillar_viewed", {
      pillar: "growth",
      locale: "tr",
    });
  });

  it("yeniden render'da olayı tekrarlamaz", () => {
    // Aynı sayfada iki kez sayılan görüntüleme funnel oranlarını bozar.
    const view = render(
      <TrackView
        event={{ name: "pillar_viewed", properties: { pillar: "build", locale: "en" } }}
      />,
    );
    view.rerender(
      <TrackView
        event={{ name: "pillar_viewed", properties: { pillar: "build", locale: "en" } }}
      />,
    );
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  it("hiçbir görünür çıktı üretmez", () => {
    const { container } = render(
      <TrackView
        event={{
          name: "case_study_viewed",
          properties: { slug: "odorgo-kategori-yaratma", problemType: "market_expansion", pillar: "growth" },
        }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("paket görüntülemesini fiyatıyla birlikte yazar", () => {
    render(
      <TrackView
        event={{
          name: "package_viewed",
          properties: { packageSlug: "ai-pilot", pillar: "transform", price: 480000, currency: "TRY" },
        }}
      />,
    );
    expect(gtag).toHaveBeenCalledWith("event", "package_viewed", {
      packageSlug: "ai-pilot",
      pillar: "transform",
      price: 480000,
      currency: "TRY",
    });
  });

  it("gtag yüklenmemişken sessizce düşer", () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(() =>
      render(
        <TrackView
          event={{ name: "pillar_viewed", properties: { pillar: "growth", locale: "tr" } }}
        />,
      ),
    ).not.toThrow();
  });
});
