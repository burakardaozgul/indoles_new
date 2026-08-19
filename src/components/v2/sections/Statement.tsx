"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATEMENT } from "@/lib/v2/section-content";
import { SECTIONS } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";

/**
 * Statement — maskeli satır reveal.
 *
 * Her satır `overflow: hidden` bir sarmalayıcı içinde durur; iç eleman
 * `y: 100% → 0` ile yukarı sürülür. Satırlar 0.08s arayla açılır.
 * Blob bu esnada koreografiye göre sağ kenara yapışık dev haldedir.
 */
export function Statement({ locale }: { locale: "tr" | "en" }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const copy = STATEMENT[locale];

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
        root.querySelectorAll<HTMLElement>("[data-line-inner]"),
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: SECTIONS.lineDuration,
          stagger: SECTIONS.lineStagger,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: SECTIONS.revealStart },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced, locale]);

  return (
    <section
      id="v2-statement"
      className="v2-section v2-statement"
      ref={rootRef}
      aria-label={copy.eyebrow}
    >
      <div className="v2-statement-inner">
        <span className="v2-eyebrow">{copy.eyebrow}</span>

        <p className="v2-statement-text">
          {copy.lines.map((line, i) => (
            <span key={i} className="v2-line-mask">
              <span data-line-inner className="v2-line-inner">
                {line.text.split(" ").map((word, wi) => (
                  <React.Fragment key={wi}>
                    {line.accent.includes(word) ? (
                      <span className="v2-accent">{word}</span>
                    ) : (
                      word
                    )}{" "}
                  </React.Fragment>
                ))}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
