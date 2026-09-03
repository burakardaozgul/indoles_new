import type { ReactNode } from "react";
import type { RoadmapItem } from "@/lib/tools/diagnoo/schema";

/**
 * Kategori/öncelik etiketleri ve rozet — tek kaynak.
 *
 * Faz 2 cila: `diagnoo-snapshot.tsx` (ücretsiz anlık görünüm) ve
 * `diagnoo-report.tsx` (tam rapor) AYNI üç sabiti ayrı ayrı tanımlıyordu —
 * iki kopya senkronize kalmak zorunda kalıyordu, biri güncellenip diğeri
 * unutulursa iki yüzey farklı dil konuşurdu. Artık ikisi de buradan okur.
 *
 * Dosya `.tsx`: `Chip` JSX döndürüyor — TypeScript `.ts` dosyasında JSX
 * ayrıştırmaz (açı ayracını tip iddiası sanar), bu yüzden bileşen taşıyan
 * dosya `.tsx` uzantısı ister.
 */

export const CATEGORY_LABELS: Record<
  RoadmapItem["category"],
  Record<"tr" | "en", string>
> = {
  speed: { tr: "Hız", en: "Speed" },
  semantic: { tr: "Mesaj", en: "Messaging" },
  ux: { tr: "Arayüz", en: "Interface" },
  tracking: { tr: "Ölçüm", en: "Tracking" },
  funnel: { tr: "Satın alma akışı", en: "Purchase flow" },
};

export const PRIORITY_LABELS: Record<
  RoadmapItem["priority"],
  Record<"tr" | "en", string>
> = {
  critical: { tr: "Kritik", en: "Critical" },
  high: { tr: "Yüksek", en: "High" },
  medium: { tr: "Orta", en: "Medium" },
  low: { tr: "Düşük", en: "Low" },
};

/** Kategori/öncelik rozeti — tek biçim, her kullanan aynı görünümü paylaşır. */
export function Chip({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span
      className={`typography-label inline-flex items-center rounded-full border px-3 py-1 uppercase tracking-widest ${tone ?? "border-ink-200 text-ink-600"}`}
    >
      {children}
    </span>
  );
}
