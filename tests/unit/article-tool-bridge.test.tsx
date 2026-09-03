import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleToolBridges } from "@/components/marketing/article-tool-bridges";
import { DIAGNOO_TOOL, GEO_TOOL } from "@/lib/content/tools";
import type { ToolContent } from "@/lib/content/tools";

/**
 * Makale → araç köprüsü render testi (Faz 2 Görev 2, üçgenin araç→makale
 * ayağı).
 *
 * `ArticleToolBridges`, makale sayfasından (`ArticleDetail`) ayrı test
 * ediliyor: sayfa `setRequestLocale`/`getTranslations` gibi next-intl
 * sunucu çağrıları taşıyan async bir Server Component ve repo'da tam
 * sayfa render eden bir test kalıbı yok (`resolveHeroMedia` örneğinde
 * olduğu gibi, page.tsx'ten saf/dar bir birim çıkarıp onu test etmek
 * kurulu desen). Sayfadaki (`page.tsx`) değişiklik tek satırlık bir
 * kompozisyon: `<ArticleToolBridges articleSlugTr={a.slug.tr} locale={loc} />`.
 *
 * `tools` prop'u yalnız test içindir — `bridgesForArticle`in kendi ikinci
 * parametresiyle aynı gerekçe; gerçek sayfa hiç geçmez.
 */
describe("ArticleToolBridges", () => {
  const articleSlugTr = DIAGNOO_TOOL.bridges[0]!.articleSlugTr;
  const published: ToolContent[] = [
    GEO_TOOL,
    { ...DIAGNOO_TOOL, published: true },
  ];

  it("Diagnoo yayınlandığından beri (gerçek veri) köprü paragrafını basar", () => {
    // 2026-09-03 lansmanından önce bu test boş DOM bekliyordu (`published:
    // false`). Bayrak artık `true`, `tools` prop'u hiç verilmeden (gerçek
    // varsayılan) render bile köprüyü basar.
    render(<ArticleToolBridges articleSlugTr={articleSlugTr} locale="tr" />);
    expect(screen.getByRole("link", { name: "Diagnoo" })).toHaveAttribute(
      "href",
      "/tr/araclar/diagnoo",
    );
  });

  it("kapı mekanizması: enjekte edilmiş yayınlanmamış bir araç köprü basmaz", () => {
    // Dışlama yönü artık gerçek Diagnoo bayrağıyla gösterilemiyor — `tools`
    // prop'una enjekte edilmiş bir sahte `published: false` kaydı, bileşenin
    // hâlâ `bridgesForArticle`in filtresine bağlı olduğunu kanıtlar.
    const unpublished: ToolContent[] = [
      GEO_TOOL,
      { ...DIAGNOO_TOOL, published: false },
    ];
    const { container } = render(
      <ArticleToolBridges
        articleSlugTr={articleSlugTr}
        locale="tr"
        tools={unpublished}
      />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("link", { name: /diagnoo/i })).not.toBeInTheDocument();
  });

  it("Diagnoo yayınlandığında köprü paragrafını ve TR yolunu basar", () => {
    render(
      <ArticleToolBridges
        articleSlugTr={articleSlugTr}
        locale="tr"
        tools={published}
      />,
    );
    expect(screen.getByRole("link", { name: "Diagnoo" })).toHaveAttribute(
      "href",
      "/tr/araclar/diagnoo",
    );
  });

  it("EN'de EN araç yolunu kullanır", () => {
    render(
      <ArticleToolBridges
        articleSlugTr={articleSlugTr}
        locale="en"
        tools={published}
      />,
    );
    expect(screen.getByRole("link", { name: "Diagnoo" })).toHaveAttribute(
      "href",
      "/en/tools/diagnoo",
    );
  });

  it("köprüsü olmayan bir makale slug'ında hiçbir şey basmaz (yayınlanmış olsa bile)", () => {
    const { container } = render(
      <ArticleToolBridges
        articleSlugTr="ilgisiz-bir-yazi-slug"
        locale="tr"
        tools={published}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
