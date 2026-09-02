"use client";

import type { ToolContent } from "@/lib/content/tools";

/**
 * Diagnoo giriş yüzeyinin yuvası — Görev 14'te YALNIZ imza sabitlenir.
 *
 * Prop imzası burada nihai: Görev 15 form mantığını (URL girişi, Turnstile,
 * `POST /api/tools/diagnoo-start`, ilerleme yoklaması) bu dosyanın İÇİNE
 * yazar; `araclar/diagnoo/page.tsx` bir daha düzenlenmez. `tool` içeriği
 * dışarıdan geçer — metin kaynağı `tools.ts`, bileşen kendi kopyasını
 * tutmaz (`GeoScanForm` deseni).
 *
 * "use client": form durumu ve yoklama tarayıcıda çalışacak; sınırı şimdiden
 * doğru yere koymak, Görev 15'te sayfanın sunucu tarafını hiç değiştirmemeyi
 * garanti eder.
 */

const COPY = {
  tr: { pending: "Tarama giriş alanını hazırlıyoruz." },
  en: { pending: "We are preparing the scan field." },
} as const;

export function DiagnooTool({
  locale,
  tool,
}: {
  locale: "tr" | "en";
  tool: ToolContent;
}) {
  return (
    <div aria-label={tool.name[locale]}>
      <p className="typography-body-md text-ink-700">{COPY[locale].pending}</p>
    </div>
  );
}
