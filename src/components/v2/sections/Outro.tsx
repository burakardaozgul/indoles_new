"use client";

import * as React from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OUTRO } from "@/lib/v2/section-content";
import { SECTIONS } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { COMPANY } from "@/lib/content/company";

/**
 * Kapanış — yalnız CTA. Blob koreografinin son adımında aşağı süzülerek bu
 * bölümün arkasından çıkar.
 *
 * Site footer'ı buradan alındı: footer artık layout seviyesinde (`V2Footer`),
 * çünkü tüm sayfalarda görünmesi gerekiyor.
 */
export function Outro({ locale }: { locale: "tr" | "en" }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const copy = OUTRO[locale];

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // gsap.from YERİNE fromTo: `from` bitiş değerini elemanın o anki
      // değerinden okur. React StrictMode efekti iki kez çalıştırdığı için
      // ikinci geçiş, birincinin bıraktığı gizli hâli "doğal hâl" sanıp
      // görünmez'den görünmez'e animasyon yapıyordu.
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>("[data-outro-reveal]"),
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
    }, root);

    return () => ctx.revert();
  }, [reduced, locale]);

  return (
    <section id="v2-outro" className="v2-section v2-outro" ref={rootRef}>
      <div className="v2-outro-inner">
        <span className="v2-eyebrow" data-outro-reveal>
          {copy.eyebrow}
        </span>

        <h2 className="v2-outro-title" data-outro-reveal>
          {copy.headline[0]}
          <br />
          <span className="v2-accent">{copy.headline[1]}</span>
        </h2>

        <p className="v2-outro-lead" data-outro-reveal>
          {copy.lead}
        </p>

        <div className="v2-outro-actions" data-outro-reveal>
          <Link href={`/${locale}/iletisim`} className="v2-btn v2-btn-primary">
            {copy.primary}
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </Link>
          <Link href={`/${locale}/iletisim`} className="v2-btn v2-btn-ghost">
            {copy.secondary}
          </Link>
        </div>

        <p className="v2-outro-contact mono" data-outro-reveal>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a>
        </p>
      </div>

    </section>
  );
}
