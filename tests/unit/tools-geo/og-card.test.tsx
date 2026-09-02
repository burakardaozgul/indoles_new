import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GeoCard, ToolCard } from "../../../scripts/og/geo-card";

describe("OG kart şablonu", () => {
  it("skor kartı: skor, bant etiketi, ölçek ve işaretçi; adres YOK", () => {
    const html = renderToStaticMarkup(<GeoCard score={55} locale="tr" />);
    expect(html).toContain(">55<");
    expect(html).toContain("Gelişmeye açık");
    expect((html.match(/data-band=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-part="marker"');
    expect(html).toContain("GEO Görünürlük Denetleyicisi");
    expect(html).not.toContain("http");
    expect(html).toContain("width:1200px");
  });

  it("araç kartı: ad, lede, kanıt şeridi; işaretçi yok", () => {
    const html = renderToStaticMarkup(<ToolCard locale="en" />);
    expect(html).toContain("GEO Visibility Checker");
    expect(html).toContain("5 signals");
    expect(html).not.toContain('data-part="marker"');
  });
});
