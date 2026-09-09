import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { TrackView } from "../track-view";

type W = { dataLayer?: Record<string, unknown>[] };

beforeEach(() => {
  (window as unknown as W).dataLayer = [];
});

afterEach(() => {
  delete (window as unknown as W).dataLayer;
});

/**
 * Olaylar ADR-034'ten beri `dataLayer`a yaziliyor, `gtag`e degil — GA4'u
 * GTM tasiyor. Kayit bicimi: `{event: ad, ...parametreler}`.
 */
function events(name: string): Record<string, unknown>[] {
  return ((window as unknown as W).dataLayer ?? []).filter((e) => e.event === name);
}

describe("TrackView", () => {
  it("bağlandığında olayı yazar", () => {
    render(
      <TrackView
        event={{ name: "pillar_viewed", properties: { pillar: "growth", locale: "tr" } }}
      />,
    );
    expect(events("pillar_viewed")).toEqual([
      { event: "pillar_viewed", pillar: "growth", locale: "tr" },
    ]);
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
    expect(events("pillar_viewed")).toHaveLength(1);
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
    expect(events("package_viewed")).toEqual([
      {
        event: "package_viewed",
        packageSlug: "ai-pilot",
        pillar: "transform",
        price: 480000,
        currency: "TRY",
      },
    ]);
  });

  it("dataLayer henüz yokken sessizce düşer", () => {
    delete (window as unknown as W).dataLayer;
    expect(() =>
      render(
        <TrackView
          event={{ name: "pillar_viewed", properties: { pillar: "growth", locale: "tr" } }}
        />,
      ),
    ).not.toThrow();
  });
});
