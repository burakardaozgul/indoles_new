"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FeaturedWork } from "@/lib/v2/work-content";
import { localeHref } from "@/lib/i18n/locale-href";
import { WORK } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";

/**
 * Proje kartı.
 *
 * - Görsel container'dan %15 taşacak şekilde büyük; scroll'da içeride kayar
 * - Hover'da `+` ikonu 90° dönerek çıkar, yerine `→` soldan girer
 * - Hover'da disiplin etiketleri 0.04s arayla soldan açılır
 */
export function WorkCard({
  item,
  locale,
  readLabel,
  weeksLabel,
}: {
  item: FeaturedWork;
  locale: "tr" | "en";
  readLabel: string;
  weeksLabel: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const imgRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Görselin kart içindeki parallax'ı
  React.useEffect(() => {
    const el = ref.current;
    const img = imgRef.current;
    if (!el || !img || reduced) return;
    if (window.innerWidth < 900) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -WORK.imageParallax },
        {
          yPercent: WORK.imageParallax,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <article className="v2-card" ref={ref}>
      {/* Segment locale'e göre çevrilir (`/vakalar` ↔ `/case-studies`).
          Ham TR segmenti EN'de 307 zinciri üretiyordu: `/en/vakalar/...` →
          `/en/case-studies/...`. `item.slug` zaten okunan locale'in slug'ıdır
          (`getFeaturedWork(locale)`), o yüzden `localeHref`in yalnız ilk
          segmenti çevirmesi burada tam doğru sonucu verir. */}
      <Link
        href={localeHref(`/vakalar/${item.slug}`, locale)}
        className="v2-card-link"
        data-cursor="hover"
      >
        <div className="v2-card-media">
          <div className="v2-card-img" ref={imgRef}>
            {/* Dekoratif: kapak görseli vakayı adlandırmıyor, aynı link
                içindeki `v2-card-title` + `v2-card-sector` zaten adlandırıyor.
                `item.title`ı alt'a kopyalamak ekran okuyucuda başlığı iki kez
                okuturdu; boş `alt` + `aria-hidden` görseli erişilebilirlik
                ağacından çıkarıp bağlantı adını tek satırda bırakıyor. */}
            <Image
              src={item.image}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <span className="v2-card-duration mono">
            {item.durationWeeks} {weeksLabel}
          </span>

          <div className="v2-card-bar">
            <div className="v2-card-bar-text">
              <span className="v2-card-title">{item.title}</span>
              <span className="v2-card-sector mono">{item.sector}</span>

              <span className="v2-card-tags" aria-hidden="true">
                {item.tags.map((t, i) => (
                  <span
                    key={t.label}
                    className="v2-card-tag mono"
                    style={{ transitionDelay: `${i * WORK.tagStagger}s` }}
                  >
                    <span className="v2-card-tag-glyph">{t.glyph}</span>
                    {t.label}
                  </span>
                ))}
              </span>
            </div>

            <span className="v2-card-icon" aria-label={readLabel}>
              <svg className="v2-icon-plus" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <svg className="v2-icon-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M3 8h10M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="v2-card-metric">
          <span className="v2-card-metric-value">{item.metricValue}</span>
          <span className="v2-card-metric-label">{item.metricLabel}</span>
        </div>
      </Link>
    </article>
  );
}
