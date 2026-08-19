"use client";

import * as React from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT } from "@/lib/v2/section-content";
import { SECTIONS } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { TrustedGrid } from "./TrustedGrid";

/**
 * About bloğu + altında referans logo grid'i.
 *
 * İkisi tek `#v2-about` bölümünde: koreografi tablosu bu bölüm için tek bir
 * blob hedefi tanımlıyor (sağda, hafif yukarıda, soluk).
 */
export function About({ locale }: { locale: "tr" | "en" }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const copy = ABOUT[locale];

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
        root.querySelectorAll<HTMLElement>("[data-about-reveal]"),
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
    <section id="v2-about" className="v2-section v2-about" ref={rootRef}>
      <div className="v2-about-grid">
        <div className="v2-about-left" data-about-reveal>
          <span className="v2-eyebrow">{copy.eyebrow}</span>
          <p className="v2-about-lead">{copy.lead}</p>
          <Link href={`/${locale}/hakkimizda`} className="v2-textlink">
            {copy.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="v2-about-right" data-about-reveal>
          {copy.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <TrustedGrid locale={locale} />
    </section>
  );
}
