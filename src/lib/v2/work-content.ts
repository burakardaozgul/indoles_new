import { CASES } from "@/lib/content/cases";
import type { Locale } from "@/lib/content/types";

/**
 * Featured Work kartlarının veri katmanı.
 *
 * Vaka bilgisi (başlık, sektör, metrik, süre) `src/lib/content/cases.ts`'ten
 * gelir — tek kaynak orasıdır. Bu dosya yalnızca v2 kartının ihtiyaç duyduğu
 * iki ek alanı ekler: görsel ve disiplin etiketleri.
 *
 * Görseller gerçek vaka medyasından gelir (`public/work/<slug>/`, ADR-019).
 * Anonim vakaların Unsplash geçiciydi; gerçek vakalarla birlikte kalktı.
 * Eski siteden kalan 6 vaka eklendikçe buraya kart kaydı da eklenir.
 */
export type WorkTag = {
  /** Disiplin işareti — ● marka, △ geliştirme, ◇ veri/AI */
  glyph: "●" | "△" | "◇";
  label: Record<Locale, string>;
};

export type WorkCard = {
  slug: string;
  /** `public/work/<slug>/` altındaki gerçek vaka görseli. */
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
  "soylu-avm-e-ticaret-buyume": {
    image: "/work/soylu-avm/vitrin.jpg",
    tags: [TAG.growth, TAG.data, TAG.brand],
  },
  "gymwolves-12-kat-satis": {
    image: "/work/gymwolves/kampanya-kapak.jpg",
    tags: [TAG.growth, TAG.brand, TAG.data],
  },
  "mkcomputer-dropshipping-otomasyonu": {
    image: "/work/mkcomputer/kapak.jpg",
    tags: [TAG.dev, TAG.ops, TAG.data],
  },
  "istanbul-ortez-protez-arama-gorunurlugu": {
    image: "/work/istanbul-ortez-protez/kapak.jpg",
    tags: [TAG.growth, TAG.brand, TAG.dev],
  },
  "fyr-luks-dekorasyon-lansmani": {
    image: "/work/fyr/kapak.jpg",
    tags: [TAG.brand, TAG.growth, TAG.dev],
  },
  "sim-baski-ihracat-icerigi": {
    image: "/work/sim/kapak.jpg",
    tags: [TAG.dev, TAG.growth, TAG.ai],
  },
  "meccanotecnica-umbra-teklif-portali": {
    image: "/work/meccanotecnica/kapak.jpg",
    tags: [TAG.dev, TAG.ops, TAG.growth],
  },
  "odorgo-kategori-yaratma": {
    image: "/work/odorgo/icindekiler.png",
    tags: [TAG.brand, TAG.growth, TAG.dev],
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
