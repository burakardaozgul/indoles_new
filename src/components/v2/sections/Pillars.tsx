"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTIONS } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { PersonaText } from "@/components/marketing/persona-text";

const KEYS = ["growth", "transform", "build"] as const;

/**
 * Üç pillar — v2 uyarlaması.
 *
 * v1'de kenarlıklı üç karttı. Burada kart yok: hücreler yalnız hairline'larla
 * ayrışıyor ve kesişimlere logo grid'iyle aynı crosshair'ler oturuyor. Böylece
 * iki bölüm tek bir ızgara diline bağlanıyor — v2'nin "teknik-editorial"
 * ekseni bu tekrarla kuruluyor.
 *
 * İçerik ve persona davranışı v1 ile aynı kaynaktan (ADR-014): başlık, lede ve
 * her pillar'ın tagline/description'ı `home.pillars._personas.<persona>`
 * altından okunuyor. İki varyant da render edilir, görüneni CSS seçer —
 * gerekçe `components/marketing/persona-text.tsx` başında.
 */
export function Pillars({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.pillars");
  const reduced = usePrefersReducedMotion();
  const rootRef = React.useRef<HTMLElement>(null);
  const [active, setActive] = React.useState<number | null>(null);

  const p = (persona: "industrial" | "commerce", key: string) =>
    t(`_personas.${persona}.${key}` as never) as string;
  const both = (key: string) => ({
    industrial: p("industrial", key),
    commerce: p("commerce", key),
  });

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>("[data-pillar-reveal]"),
        { ...SECTIONS.revealFrom },
        {
          y: 0,
          opacity: 1,
          duration: SECTIONS.revealDuration,
          stagger: SECTIONS.revealStagger,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: SECTIONS.revealStart },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced, locale]);

  return (
    <section id="v2-pillars" className="v2-section v2-pillars" ref={rootRef}>
      <div className="v2-pillars-inner">
        <header className="v2-pillars-head" data-pillar-reveal>
          <span className="v2-eyebrow">
            <PersonaText {...both("eyebrow")} />
          </span>
          <h2 className="v2-pillars-title">
            {(["industrial", "commerce"] as const).map((persona) => (
              <span key={persona} data-persona-variant={persona}>
                {p(persona, "headline")
                  .split("\n")
                  .map((line, i) => (
                    <React.Fragment key={line}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
              </span>
            ))}
          </h2>
          <p className="v2-pillars-lede">
            <PersonaText {...both("lede")} />
          </p>
        </header>

        <div className="v2-pillar-grid" onMouseLeave={() => setActive(null)}>
          {/* Kesişim işaretleri — logo grid'iyle aynı dil */}
          <div className="v2-crosshair-layer" aria-hidden="true">
            {[0, 1].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <span
                  key={`${row}-${col}`}
                  className="v2-crosshair"
                  style={{ left: `${(col / 3) * 100}%`, top: `${row * 100}%` }}
                />
              )),
            )}
          </div>

          {KEYS.map((key, i) => (
            <article
              key={key}
              className={`v2-pillar${active === i ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocusCapture={() => setActive(i)}
              data-pillar-reveal
            >
              <span className="v2-pillar-rule" aria-hidden="true" />

              <div className="v2-pillar-top mono">
                <span>0{i + 1}</span>
                <span className="v2-pillar-dot" aria-hidden="true" />
              </div>

              <h3 className="v2-pillar-title">{t(`${key}.name`)}</h3>
              <p className="v2-pillar-tagline mono">
                <PersonaText {...both(`${key}.tagline`)} />
              </p>
              <p className="v2-pillar-desc">
                <PersonaText {...both(`${key}.description`)} />
              </p>

              <ul className="v2-pillar-list">
                {(t.raw(`${key}.services`) as string[]).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <Link
                href={`/${locale}/hizmetler/${key}`}
                className="v2-pillar-link"
                data-cursor="hover"
              >
                <span>{t(`${key}.name`)}</span>
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                  <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
