import type React from "react";
import { cn } from "@/lib/utils/cn";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { WaveCanvas } from "./wave-canvas";

/**
 * İç sayfa başlığı — anasayfa hero'sunun sakin karşılığı.
 *
 * Sabit TopBar + Nav'ın altında kalmaması için üst boşluk `.page-hero`
 * sınıfından gelir (bkz. `sections.css`). Dalga zemin hero ile aynı ailedendir
 * ama tek katman ve düşük yoğunlukta çalışır — iç sayfa başlığı içeriği
 * bastırmaz.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  wave = true,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: Crumb[];
  /** Dalga zeminini kapat — çok uzun başlıklarda okunabilirlik için. */
  wave?: boolean;
}) {
  return (
    <section className="page-hero">
      {wave ? (
        <div className="absolute inset-0 opacity-60" aria-hidden="true">
          <WaveCanvas intensity={0.5} tone="light" layers={3} />
        </div>
      ) : null}

      <div className={cn("ds-container relative z-10")}>
        {breadcrumbs ? (
          <div className="mb-10">
            <Breadcrumbs crumbs={breadcrumbs} />
          </div>
        ) : null}

        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}

        <h1 className="typography-display-lg mt-6 max-w-[20ch] text-ink-900">
          {title}
        </h1>

        {lede ? (
          <p className="typography-body-lg mt-8 max-w-[62ch] text-ink-600">
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  );
}
