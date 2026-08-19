import { CASES } from "@/lib/content/cases";
import type { Locale } from "@/lib/content/types";

/**
 * Featured Work kartlarının veri katmanı.
 *
 * Vaka bilgisi (başlık, sektör, metrik, süre) `src/lib/content/cases.ts`'ten
 * gelir — tek kaynak orasıdır. Bu dosya yalnızca v2 kartının ihtiyaç duyduğu
 * iki ek alanı ekler: görsel ve disiplin etiketleri.
 *
 * GÖRSELLER GEÇİCİ — Unsplash stok. Burak orijinalleri verdiğinde tek
 * yapılacak: `image` alanlarını `/work/<dosya>.jpg` ile değiştirmek ve
 * `next.config.ts`'teki `images.unsplash.com` remote pattern'ını kaldırmak.
 *
 * ERİŞİLEBİLİRLİK: geçici görseller `alt=""` ile dekoratif işaretlenir.
 * İçerikleri doğrulanmadığı için betimleyici bir alt metin yazmak yanlış bilgi
 * üretirdi; kartın erişilebilir adı zaten vaka başlığından geliyor. Orijinal
 * görseller gelince her birine gerçek alt metin yazılmalı.
 */
export type WorkTag = {
  /** Disiplin işareti — ● marka, △ geliştirme, ◇ veri/AI */
  glyph: "●" | "△" | "◇";
  label: Record<Locale, string>;
};

export type WorkCard = {
  slug: string;
  /** TODO(burak): orijinal görselle değiştir. */
  image: string;
  tags: WorkTag[];
};

const TAG = {
  brand: { glyph: "●", label: { tr: "Marka ve tasarım", en: "Brand & design" } },
  growth: { glyph: "●", label: { tr: "Büyüme sistemi", en: "Growth system" } },
  dev: { glyph: "△", label: { tr: "Geliştirme", en: "Development" } },
  data: { glyph: "◇", label: { tr: "Veri ve iş zekâsı", en: "Data & BI" } },
  ai: { glyph: "◇", label: { tr: "AI ve otomasyon", en: "AI & automation" } },
  ops: { glyph: "△", label: { tr: "Operasyon", en: "Operations" } },
} as const satisfies Record<string, WorkTag>;

/** `cases.ts` slug'larıyla eşleşir; eşleşmeyen vaka karta çıkmaz. */
const CARD_META: Record<string, Omit<WorkCard, "slug">> = {
  "uretim-planlama-dijitallestirme": {
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=70&w=1200",
    tags: [TAG.data, TAG.ai, TAG.ops],
  },
  "e-ticaret-organik-trafik": {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=70&w=1200",
    tags: [TAG.brand, TAG.growth, TAG.dev],
  },
  "perakende-envanter-gorunurlugu": {
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=70&w=1200",
    tags: [TAG.data, TAG.ops, TAG.dev],
  },
  "isletme-maliyeti-optimizasyonu": {
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=70&w=1200",
    tags: [TAG.ai, TAG.data, TAG.ops],
  },
};

export type FeaturedWork = ReturnType<typeof getFeaturedWork>[number];

export function getFeaturedWork(locale: Locale) {
  return CASES.filter((c) => CARD_META[c.slug]).map((c) => {
    const meta = CARD_META[c.slug]!;
    const metric = c.metrics[0];
    return {
      slug: c.slug,
      title: c.title[locale],
      sector: c.clientSector[locale],
      client: c.clientName[locale],
      durationWeeks: c.durationWeeks,
      metricValue: metric?.value ?? "",
      metricLabel: metric?.label[locale] ?? "",
      image: meta.image,
      tags: meta.tags.map((t) => ({ glyph: t.glyph, label: t.label[locale] })),
    };
  });
}
