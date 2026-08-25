"use client";

import { usePersonaState, setPersonaSlug } from "@/lib/hooks/use-persona";
import type { PersonaSlug } from "@/lib/popup/types";
import { track } from "@/lib/analytics/ga";

const OPTIONS: Array<{
  slug: PersonaSlug;
  persona: "industrial" | "commerce";
  label: { tr: string; en: string };
  full: { tr: string; en: string };
}> = [
  {
    slug: "donusum-teknoloji",
    persona: "industrial",
    label: { tr: "Sanayi", en: "Industry" },
    full: { tr: "Sanayi ve üretim", en: "Industry & manufacturing" },
  },
  {
    slug: "buyume-pazarlar",
    persona: "commerce",
    label: { tr: "Ticaret", en: "Commerce" },
    full: { tr: "Ticaret ve perakende", en: "Commerce & retail" },
  },
];

/**
 * Persona merceği — sayfa içinde, popup'tan bağımsız.
 *
 * Persona-aware metin sitenin en pahalı içerik yatırımı (ADR-014) ama tek
 * giriş kapısı entry popup'tı: popup'ı kapatan ziyaretçi varsayılan olarak
 * sanayi tonunda kalıyordu ve geri dönüşü yoktu. Bu anahtar seçimi görünür ve
 * geri alınabilir kılar (docs/15-content-audit.md §A1).
 *
 * Aktif durum CSS'ten okunur (`:root[data-persona]`), React state'inden değil:
 * sunucu persona'yı bilmediği için state'e bağlansaydı hidrasyondan sonra
 * düğme bir kare yanlış görünürdü. `aria-pressed` hidrasyondan sonra
 * düzeltilir — görünüm ilk boyamada zaten doğrudur.
 */
export function PersonaSwitch({
  locale,
  className,
}: {
  locale: "tr" | "en";
  className?: string;
}) {
  const { persona } = usePersonaState();
  const isTr = locale === "tr";

  return (
    <div className={`v2-persona-switch${className ? ` ${className}` : ""}`}>
      <span className="v2-persona-switch-label mono">
        {isTr ? "Okuma açısı" : "Reading lens"}
      </span>
      <div className="v2-persona-switch-group" role="group">
        {OPTIONS.map((o) => (
          <button
            key={o.slug}
            type="button"
            data-persona-option={o.persona}
            aria-pressed={persona === o.persona}
            aria-label={isTr ? o.full.tr : o.full.en}
            onClick={() => {
              // Eksen adı arayüz dilinden bağımsız (`o.persona`): dile bağlı
              // olsaydı TR ve EN raporları birleştirilemezdi.
              track({ name: "persona_axis_clicked", properties: { axis: o.persona } });
              setPersonaSlug(o.slug);
            }}
          >
            {isTr ? o.label.tr : o.label.en}
          </button>
        ))}
      </div>
    </div>
  );
}
