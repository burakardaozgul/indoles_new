"use client";

import * as React from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedWork } from "@/lib/v2/work-content";
import { WORK_SECTION } from "@/lib/v2/section-content";
import { WORK, SECTIONS, BREAKPOINT } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { localeHref } from "@/lib/i18n/locale-href";
import { WorkCard } from "./WorkCard";

/**
 * Featured Work — sol sabit marj + iki kolonlu masonry.
 *
 * Sağ kolon sol kolondan `columnOffset` kadar aşağıdan başlar ve scroll'da
 * %13 daha hızlı akar. Bu hız farkı bölümün imzası; 900px altında kapanır ve
 * tek kolona döner (spec §10).
 */
export function FeaturedWork({ locale }: { locale: "tr" | "en" }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const rightRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const copy = WORK_SECTION[locale];

  const items = React.useMemo(() => getFeaturedWork(locale), [locale]);
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Kartların giriş reveal'ı
      // gsap.from YERİNE fromTo: `from` bitiş değerini elemanın o anki
      // değerinden okur. React StrictMode efekti iki kez çalıştırdığı için
      // ikinci geçiş, birincinin bıraktığı gizli hâli "doğal hâl" sanıp
      // görünmez'den görünmez'e animasyon yapıyordu.
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>(".v2-card"),
        { ...SECTIONS.revealFrom },
        {
          y: 0,
          opacity: 1,
          duration: SECTIONS.revealDuration,
          stagger: SECTIONS.revealStagger,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: SECTIONS.revealStart },
        },
      );

      // Kolon hız farkı — yalnız geniş ekranda
      const mm = gsap.matchMedia();
      mm.add(`(min-width: ${BREAKPOINT.reducedLayout}px)`, () => {
        if (!rightRef.current) return;
        gsap.to(rightRef.current, {
          yPercent: -WORK.parallaxDelta,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [reduced, locale]);

  return (
    <section id="v2-work" className="v2-section v2-work" ref={rootRef}>
      <div className="v2-work-grid">
        <aside className="v2-work-aside">
          <div className="v2-work-sticky">
            <span className="v2-eyebrow">{copy.eyebrow}</span>
            <span className="v2-work-count mono">
              {String(items.length).padStart(2, "0")} {copy.countLabel}
            </span>
            {/* `/en/vakalar` 307 ile `/en/case-studies`e gidiyordu. */}
            <Link href={localeHref("/vakalar", locale)} className="v2-textlink">
              {copy.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>

        <div className="v2-work-columns">
          <div className="v2-work-col">
            {left.map((item) => (
              <WorkCard
                key={item.slug}
                item={item}
                locale={locale}
                readLabel={copy.readCase}
                weeksLabel={copy.weeks}
              />
            ))}
          </div>

          <div className="v2-work-col v2-work-col-offset" ref={rightRef}>
            {right.map((item) => (
              <WorkCard
                key={item.slug}
                item={item}
                locale={locale}
                readLabel={copy.readCase}
                weeksLabel={copy.weeks}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
