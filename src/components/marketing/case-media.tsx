import Image from "next/image";
import type { CaseMedia } from "@/lib/content/types";
import { YouTubeFacade } from "./case-video";
import type { Locale } from "@/lib/content/types";

/**
 * Vaka medyası (ADR-019): tek hero görseli ve "saha kaydı" galerisi.
 *
 * Galeri altyazıları figür numarası taşır (FIG.01) — teknik-editorial dilin
 * "ölçü görünür" kuralı: her görsel sayfada adreslenebilir bir kayıttır.
 * Video öğeleri `controls` ile basılır; otomatik oynatma yok.
 */

function MediaFrame({
  item,
  locale,
  sizes,
  priority = false,
}: {
  item: CaseMedia;
  locale: Locale;
  sizes: string;
  priority?: boolean;
}) {
  if (item.type === "youtube") {
    return (
      <YouTubeFacade
        videoId={item.src}
        poster={item.poster ?? ""}
        title={item.alt[locale]}
        width={item.width}
        height={item.height}
      />
    );
  }
  if (item.type === "video") {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption -- tanıtım filmi; konuşma içermeyen müzikli kurgu
      <video
        controls
        preload="metadata"
        poster={item.poster}
        className="w-full rounded-2xl border border-surface-2"
        width={item.width}
        height={item.height}
        aria-label={item.alt[locale]}
      >
        <source src={item.src} />
      </video>
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt[locale]}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      className="w-full rounded-2xl border border-surface-2 object-cover"
    />
  );
}

export function CaseHeroMedia({ item, locale }: { item: CaseMedia; locale: Locale }) {
  return (
    <section aria-label={item.alt[locale]} className="border-b border-surface-2">
      <div className="ds-container py-16 md:py-20">
        <figure>
          <MediaFrame item={item} locale={locale} sizes="(max-width: 1280px) 100vw, 1296px" priority />
          {item.caption ? (
            <figcaption className="typography-caption mono mt-4 flex gap-3 text-ink-500">
              <span aria-hidden className="text-brand-700">
                FIG.00
              </span>
              {item.caption[locale]}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

export function CaseGallery({
  items,
  locale,
  heading,
}: {
  items: CaseMedia[];
  locale: Locale;
  heading: string;
}) {
  return (
    <section aria-labelledby="case-gallery-title" className="border-b border-surface-2 v2-surface">
      <div className="ds-container py-24 md:py-32">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-3">
            <span
              id="case-gallery-title"
              className="typography-label uppercase tracking-widest text-ink-500"
            >
              {heading}
            </span>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 gap-10 md:grid-cols-2">
            {items.map((item, i) => {
              // Dikey ve kare görsel yarım kolon, yatay görsel tam satır
              // kaplar — karışık oranlı galeride satır ritmini bu kural
              // korur.
              const portrait = item.height >= item.width;
              // Yanında eş olmayan dikey görsel yarım satırı boş bırakır;
              // o durumda ortalanır. Eşi yoktur: tek öğeli galeride, ya da
              // bir önceki öğe tam satır kaplıyorsa (yatay) ve kendisi son
              // öğeyse.
              const prev = items[i - 1];
              const lone =
                portrait &&
                (items.length === 1 ||
                  (i === items.length - 1 && (!prev || prev.height < prev.width)));
              return (
                <figure
                  key={item.src}
                  className={
                    portrait
                      ? lone
                        ? "md:col-span-2 md:mx-auto md:w-120 md:max-w-full"
                        : ""
                      : "md:col-span-2"
                  }
                >
                  <MediaFrame
                    item={item}
                    locale={locale}
                    sizes={portrait ? "(max-width: 768px) 100vw, 480px" : "(max-width: 1280px) 100vw, 972px"}
                  />
                  <figcaption className="typography-caption mono mt-4 flex gap-3 text-ink-500">
                    <span aria-hidden className="text-brand-700">
                      FIG.{String(i + 1).padStart(2, "0")}
                    </span>
                    {item.caption?.[locale] ?? item.alt[locale]}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
