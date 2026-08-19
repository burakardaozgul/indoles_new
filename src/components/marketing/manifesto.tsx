"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

/**
 * Manifesto — scroll ilerledikçe kelime kelime mürekkeplenen büyük metin.
 * Erişilebilirlik: renk geçişi tamamen dekoratif; metin her zaman DOM'da ve
 * okunabilir kontrastta biter. `prefers-reduced-motion` altında hepsi koyu başlar.
 */
export function Manifesto() {
  const t = useTranslations("home.manifesto");
  const ref = React.useRef<HTMLElement | null>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.9;
      const end = -rect.height * 0.3;
      setProgress(Math.max(0, Math.min(1, (start - rect.top) / (start - end))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quote = t("quote");
  const words = quote.split(" ");

  return (
    <section id="approach" className="bg-bg py-[120px] md:py-[160px]" ref={ref}>
      <div className="ds-container">
        <span className="eyebrow mb-12 block">Manifesto · 01</span>

        <p className="manifesto-text" aria-label={quote}>
          {words.map((w, i) => {
            const active = progress > i / words.length + 0.05;
            return (
              <span
                key={`${w}-${i}`}
                className="mf-word"
                aria-hidden="true"
                style={{ color: active ? "var(--color-ink-900)" : "rgb(26 43 52 / 0.22)" }}
              >
                {w}{" "}
              </span>
            );
          })}
        </p>

        <p className="mono mt-12 text-[11px] tracking-[0.18em] text-ink-500">
          — {t("attribution")}
        </p>
      </div>
    </section>
  );
}
