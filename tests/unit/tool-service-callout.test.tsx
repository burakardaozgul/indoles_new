import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolServiceCallout } from "@/components/tools/tool-service-callout";

/**
 * Üçgenin hizmet→araç ayağı (Faz 2 Görev 1).
 *
 * `ToolServiceCallout` hizmet sayfasında yayınlanmış aracı tanıtır.
 * Yayınlanmamış araç (Diagnoo) hiçbir hizmette görünmemeli — lansman
 * kapısı (`published`) burada da geçerli, aksi hâlde araç erken teşhir
 * olurdu (ADR-032).
 */
describe("ToolServiceCallout", () => {
  it("yayınlanmış aracı olan hizmette kart basar (TR)", () => {
    render(<ToolServiceCallout serviceSlugTr="ai-danismanlik" locale="tr" />);
    expect(screen.getByRole("link", { name: /GEO Görünürlük Denetleyicisi/ })).toHaveAttribute(
      "href", "/tr/araclar/geo-gorunurluk-denetleyicisi",
    );
  });
  it("EN'de EN yolunu kullanır", () => {
    render(<ToolServiceCallout serviceSlugTr="ai-danismanlik" locale="en" />);
    expect(screen.getByRole("link", { name: /GEO Visibility Checker/ })).toHaveAttribute(
      "href", "/en/tools/geo-visibility-checker",
    );
  });
  it("yayınlanmış aracı olmayan hizmette hiçbir şey basmaz", () => {
    const { container } = render(<ToolServiceCallout serviceSlugTr="cro" locale="tr" />);
    expect(container).toBeEmptyDOMElement();
  });
});
