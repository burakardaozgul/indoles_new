import Link from "next/link";
import { toolsForService } from "@/lib/content/tools";
import { localeHref } from "@/lib/i18n/locale-href";
import type { Locale } from "@/lib/content/types";

/**
 * Hizmet sayfasındaki araç bloğu — üçgenin hizmet→araç ayağı (Faz 2 Görev 1).
 *
 * Sunucu bileşeni; state yok. `toolsForService` zaten `publishedTools()`
 * üzerinden filtreler, burada ikinci bir `published` kontrolü tekrarlanmaz.
 * Ton `docs/03-brand-voice-tone.md` §1'e göre ORTA (tools.ts ile aynı gerekçe):
 * araç yüzeyi persona-aware değil.
 */
const COPY = {
  tr: { eyebrow: "Ücretsiz araç", cta: "Aracı aç" },
  en: { eyebrow: "Free tool", cta: "Open the tool" },
} as const;

export function ToolServiceCallout({
  serviceSlugTr,
  locale,
}: {
  serviceSlugTr: string;
  locale: Locale;
}) {
  const tools = toolsForService(serviceSlugTr);
  if (tools.length === 0) return null;
  const c = COPY[locale];

  return (
    <aside
      aria-labelledby="tool-callout-heading"
      className="border-b border-surface-2"
    >
      <div className="ds-container py-20 md:py-28">
        <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-8">
          {/*
            Tek başlık, birden çok araç render edilse bile: `aria-labelledby`
            tek bir id'yi işaret etmeli, `<li>` başına tekrarlanamaz.
            Eyebrow zaten görsel bir etiket olduğu için sr-only bir kopyaya
            gerek yok — h2 aynı zamanda görünür etiketin kendisi.
          */}
          <h2 id="tool-callout-heading" className="eyebrow">
            {c.eyebrow}
          </h2>
          <ul className="mt-4 space-y-6">
            {tools.map((tool) => (
              <li key={tool.slug.tr}>
                <h3 className="typography-h3 text-ink-900">
                  {tool.name[locale]}
                </h3>
                <p className="mt-1 text-ink-600">{tool.lede[locale]}</p>
                <Link
                  href={localeHref(`/araclar/${tool.slug[locale]}`, locale)}
                  className="btn btn-ghost mt-4"
                >
                  {tool.name[locale]} — {c.cta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
