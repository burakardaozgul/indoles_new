"use client";

import * as React from "react";
import { METHOD_STEPS } from "@/lib/content/method";
import { ParticleField } from "./wave-canvas";

/**
 * INDOLES Frame — 5 aşamalı metodoloji, sticky bölüm içinde scroll'a bağlı
 * timeline. Sol tarafta aktif aşamanın kartı, sağda ilerleme rayı.
 */
export function MethodSection({ locale }: { locale: "tr" | "en" }) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState(0);
  const isTr = locale === "tr";

  React.useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.max(0, -sec.getBoundingClientRect().top);
      const p = Math.max(0, Math.min(0.999, scrolled / total));
      setActive(Math.floor(p * METHOD_STEPS.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const step = METHOD_STEPS[active] ?? METHOD_STEPS[0]!;

  return (
    <section
      id="method"
      className="method-sec"
      ref={sectionRef}
      style={{ height: `${METHOD_STEPS.length * 90}vh` }}
      aria-labelledby="method-title"
    >
      <div className="method-sticky">
        <div className="absolute inset-0 opacity-70" aria-hidden="true">
          <ParticleField density={35} color="rgba(44,85,102,0.4)" />
        </div>

        <div className="ds-container relative z-10 grid w-full gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
          <div className="flex flex-col gap-7">
            <span className="eyebrow">
              {isTr ? "Metodoloji · INDOLES Frame" : "Methodology · INDOLES Frame"}
            </span>

            <h2 id="method-title" className="typography-display-lg">
              <span className="accent-em">Evolve</span> · <span className="accent-em">Build</span> ·{" "}
              <span className="accent-em">Grow</span>
              <span className="mt-4 block font-body text-step-1 font-normal tracking-[-0.005em] text-ink-500">
                {isTr
                  ? "5 aşamalı bütüncül dönüşüm sistemi"
                  : "A five-stage holistic transformation system"}
              </span>
            </h2>

            <div className="method-card mt-6">
              <div className="mono mb-3.5 flex justify-between text-[11px] uppercase tracking-[0.14em] text-teal-700">
                <span>{step.frame}</span>
                <span className="tabular">
                  {step.no} / {String(METHOD_STEPS.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="typography-h2 mb-3">{step.title[locale]}</h3>
              <p className="mb-5 text-[15px] leading-relaxed text-ink-600">
                {step.description[locale]}
              </p>
              <ul className="flex flex-col gap-2 border-t border-dashed border-ink-200 pt-4.5">
                {step.artifacts[locale].map((a) => (
                  <li key={a} className="flex gap-2.5 text-[13px] font-medium text-ink-700">
                    <span className="text-teal-700" aria-hidden="true">
                      ›
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid place-items-center">
            <ol className="timeline">
              <div className="timeline-rail" aria-hidden="true">
                <div
                  className="timeline-fill"
                  style={{ height: `${((active + 0.5) / METHOD_STEPS.length) * 100}%` }}
                />
              </div>
              {METHOD_STEPS.map((s, i) => (
                <li
                  key={s.no}
                  className={`tl-step${i === active ? " is-active" : ""}${i < active ? " is-passed" : ""}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="tl-dot" aria-hidden="true">
                    <span className="tl-ring" />
                    <span className="tl-inner" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="mono text-[10px] tracking-[0.14em] text-ink-500">
                      {s.no} · {s.frame}
                    </span>
                    <span
                      className={`font-display text-lg font-medium ${
                        i === active ? "text-teal-700" : "text-ink-800"
                      }`}
                    >
                      {s.title[locale]}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
