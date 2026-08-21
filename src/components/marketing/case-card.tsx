import Link from "next/link";
import Image from "next/image";
import type { CaseStudyContent, Locale } from "@/lib/content/types";
import { getPillar } from "@/lib/content/pillars";

/**
 * Vaka kartı (ADR-019) — kapak görselli tek kaynak.
 *
 * "Benzer vakalar" ve `/vakalar` listesinde aynı kart kullanılır. Kapak 4:3
 * kırpılır; hover'da görsel hafifçe büyür, başlık marka rengine döner. Kapak
 * verilmemişse kart metin düzeninde kalır — görselsiz vaka kart dışı kalmaz.
 */

export const PROBLEM_LABELS: Record<string, { tr: string; en: string }> = {
  efficiency_loss: { tr: "Verim kaybı", en: "Efficiency loss" },
  cost_optimization: { tr: "Maliyet optimizasyonu", en: "Cost optimization" },
  market_expansion: { tr: "Pazara açılma", en: "Market expansion" },
  digital_transformation: {
    tr: "Dijital dönüşüm",
    en: "Digital transformation",
  },
  customer_acquisition: { tr: "Müşteri edinimi", en: "Customer acquisition" },
};

export function CaseCard({
  c,
  locale,
}: {
  c: CaseStudyContent;
  locale: Locale;
}) {
  const pillar = getPillar(c.pillar);
  const metric = c.metrics[0];

  return (
    <Link
      href={`/${locale}/vakalar/${c.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-surface-2 v2-surface transition-colors hover:border-teal-300"
    >
      {c.cover ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={c.cover.src}
            alt={c.cover.alt[locale]}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* Marka logosu: beyaz rozet — müşteri logoları açık zemin için */}
          {c.clientLogo ? (
            <span className="absolute left-4 top-4 flex items-center rounded-lg bg-surface-1 px-4 py-3 shadow-md">
              <Image
                src={c.clientLogo}
                alt={c.clientName[locale]}
                width={176}
                height={88}
                className="h-9 w-auto object-contain"
              />
            </span>
          ) : null}
          {/* Kartın ölçüsü: ilk metrik görselin üstünde mono rozet */}
          {metric ? (
            <span className="typography-caption mono absolute bottom-3 left-3 rounded-md bg-ink-900/80 px-2.5 py-1.5 tracking-widest text-white">
              {metric.value} — {metric.label[locale]}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Kapaksız vakada logo metin bloğunun tepesinde taşınır */}
        {!c.cover && c.clientLogo ? (
          <Image
            src={c.clientLogo}
            alt={c.clientName[locale]}
            width={128}
            height={64}
            className="mb-6 h-8 w-auto self-start object-contain"
          />
        ) : null}
        <header className="flex items-center justify-between gap-4">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {PROBLEM_LABELS[c.problemType]?.[locale]}
          </span>
          <span className="typography-caption text-brand-700">
            {pillar?.name[locale]}
          </span>
        </header>
        <h3 className="typography-h3 mt-4 text-ink-900 transition-colors group-hover:text-brand-800">
          {c.title[locale]}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="typography-caption text-ink-500">
            {c.clientSector[locale]}
          </span>
          <span
            aria-hidden
            className="text-ink-500 transition-all group-hover:translate-x-1 group-hover:text-brand-700"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
