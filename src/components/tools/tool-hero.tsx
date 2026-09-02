import type { ToolContent } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";

/**
 * Araç hero'su (spec §3): eyebrow + h1 + tek cümle lede. `compact` tarama
 * sırasında lede'i gizler; `hidden` sonuç durumunda başlığı sr-only bırakır
 * (sayfada her durumda tam olarak bir h1).
 */
export function ToolHero({
  tool,
  locale,
  variant = "full",
}: {
  tool: ToolContent;
  locale: Locale;
  variant?: "full" | "compact" | "hidden";
}) {
  if (variant === "hidden") {
    return <h1 id="tool-h1" className="sr-only">{tool.name[locale]}</h1>;
  }
  return (
    <div>
      <span className="eyebrow">{tool.eyebrow[locale]}</span>
      <h1 id="tool-h1" className="typography-h1 text-ink-900 mt-4">{tool.name[locale]}</h1>
      {variant === "full" ? (
        <p className="typography-body-lg text-ink-700 mt-5 mx-auto max-w-[40ch]">{tool.lede[locale]}</p>
      ) : null}
    </div>
  );
}
