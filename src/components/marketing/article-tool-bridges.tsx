import { bridgesForArticle } from "@/lib/content/tools";
import type { ToolContent } from "@/lib/content/tools";
import { renderInline } from "@/components/marketing/inline-markdown";
import type { Locale } from "@/lib/content/types";

/**
 * Makale → araç köprüsü (Faz 2 Görev 2, üçgenin araç→makale ayağı).
 *
 * Yayın kapılı: `bridgesForArticle` yalnız `publishedTools()`ten geçen
 * araçları döner (ADR-032 ile aynı bayrak, ikinci bir kontrol tekrarlanmaz).
 * Diagnoo `published: false` olduğu sürece bu bileşen makale sayfasında
 * hiçbir şey basmaz — bugünkü makale sayfalarında görsel değişiklik yoktur.
 *
 * Paragraf `renderInline` ile aynı çözücüden geçer (makale gövdesi ile
 * paylaşılan tek fonksiyon, `@/components/marketing/inline-markdown`):
 * köprüdeki `[Diagnoo](/araclar/diagnoo)` linki, gövdedeki satır içi
 * linklerle birebir aynı davranışla `/tr/araclar/diagnoo` ↔
 * `/en/tools/diagnoo`e çözülür.
 *
 * `tools` parametresi yalnız test içindir (`bridgesForArticle`in kendi
 * ikinci parametresiyle aynı gerekçe) — gerçek sayfa hiç geçmez, `TOOLS`e
 * düşer.
 */
export function ArticleToolBridges({
  articleSlugTr,
  locale,
  tools,
}: {
  articleSlugTr: string;
  locale: Locale;
  tools?: ToolContent[];
}) {
  const bridges = bridgesForArticle(articleSlugTr, tools);
  if (bridges.length === 0) return null;

  return (
    <>
      {bridges.map(({ tool, paragraph }) => (
        <p
          key={tool.slug.tr}
          className="tool-bridge typography-body-lg text-ink-900 mb-7"
        >
          {renderInline(paragraph[locale], locale)}
        </p>
      ))}
    </>
  );
}
