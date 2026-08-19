"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PersonaText } from "@/components/marketing/persona-text";
import { PersonaSwitch } from "@/components/marketing/persona-switch";
import { SECTIONS } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";

const PERSONAS = ["industrial", "commerce"] as const;

type Metric = { value: string; label: string; sublabel: string };

/**
 * "Neden şimdi?" — zamanlama argümanı.
 *
 * Metin `home.unlockPotential` altında iki persona için yazılmıştı ama hiçbir
 * bileşen okumuyordu: v2 geçişinde bölüm düştü, copy dosyada kaldı
 * (docs/15-content-audit.md §C1). Kaynağı `docs/01-vision-positioning.md` §2
 * timing argümanlarıdır ve sitedeki en persona-spesifik metindir.
 *
 * Yeri bilinçli: manifesto "kim olduğumuz", About "nerede durduğumuz", bu
 * bölüm "neden şimdi", Pillars "nasıl". Persona-aware akış buradan başlıyor,
 * bu yüzden mercek anahtarı da burada duruyor.
 */
export function WhyNow({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.unlockPotential");
  const rootRef = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const read = (persona: string, key: string) =>
    t(`_personas.${persona}.${key}` as never) as string;
  const both = (key: string) => ({
    industrial: read("industrial", key),
    commerce: read("commerce", key),
  });
  const metrics = (persona: string) =>
    t.raw(`_personas.${persona}.metrics` as never) as Metric[];

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // fromTo — StrictMode'un ikinci geçişi `from`un bıraktığı gizli hâli
      // doğal hâl sanıyor (bkz. About, Outro).
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>("[data-why-reveal]"),
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
    <section
      id="v2-whynow"
      className="v2-section v2-whynow"
      ref={rootRef}
      aria-labelledby="v2-whynow-title"
    >
      <div className="v2-whynow-inner">
        <div className="v2-whynow-left" data-why-reveal>
          <span className="v2-eyebrow">
            <PersonaText {...both("eyebrow")} />
          </span>
          <h2 id="v2-whynow-title" className="v2-whynow-title">
            <PersonaText {...both("headline")} />
          </h2>
          <p className="v2-whynow-body">
            <PersonaText {...both("description")} />
          </p>
          <Link href={`/${locale}/iletisim`} className="v2-textlink">
            <PersonaText {...both("cta")} />
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="v2-whynow-right" data-why-reveal>
          <PersonaSwitch locale={locale} className="v2-whynow-switch" />
          {PERSONAS.map((persona) => (
            <dl key={persona} data-persona-variant={persona} className="v2-whynow-metrics">
              {metrics(persona).map((m) => (
                <div key={m.label}>
                  <dd className="v2-whynow-value">{m.value}</dd>
                  <dt className="v2-whynow-label">{m.label}</dt>
                  <p className="v2-whynow-sub">{m.sublabel}</p>
                </div>
              ))}
            </dl>
          ))}
        </div>
      </div>
    </section>
  );
}
