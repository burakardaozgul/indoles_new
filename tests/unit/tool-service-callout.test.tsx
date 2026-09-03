import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolServiceCallout } from "@/components/tools/tool-service-callout";

/**
 * Üçgenin hizmet→araç ayağı (Faz 2 Görev 1).
 *
 * `ToolServiceCallout` hizmet sayfasında yayınlanmış aracı tanıtır ve
 * `toolsForService` → `publishedTools()` zincirini olduğu gibi kullanır;
 * bileşen ikinci bir `published` kontrolü tekrarlamaz. Bileşenin kendisi
 * test için `tools` enjeksiyonu almadığından (page.tsx'teki gerçek
 * kullanımla birebir), lansman kapısının DIŞLAMA yönü burada değil
 * `tools-content.test.ts`teki enjekte-fixture testlerinde kanıtlanır — o
 * dosya `publishedTools()`in ta kendisini, gerçek Diagnoo bayrağından
 * bağımsız bir sahte kayıtla test eder. Burada yalnız "hiç aracı olmayan
 * bir hizmette blok basılmaz" davranışı kalır; `dijital-donusum`un
 * `relatedServices`i hiçbir araçta yok, gerçek veriyle bunu kanıtlar
 * (2026-09-03 lansmanından önce bu rol `cro`daydı — Diagnoo artık `cro`ya
 * bağlı olduğundan o slug bu testi geçemiyor).
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
  it("Diagnoo lansmanından sonra cro hizmetinde de kart basar", () => {
    // 2026-09-03: `DIAGNOO_TOOL.published: true`, `relatedServices` içinde
    // `cro` var — üçgenin hizmet→araç ayağı bu hizmette de canlı.
    render(<ToolServiceCallout serviceSlugTr="cro" locale="tr" />);
    expect(screen.getByRole("link", { name: /Diagnoo/ })).toHaveAttribute(
      "href", "/tr/araclar/diagnoo",
    );
  });
  it("hiçbir araca bağlı olmayan hizmette hiçbir şey basmaz", () => {
    const { container } = render(
      <ToolServiceCallout serviceSlugTr="dijital-donusum" locale="tr" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
