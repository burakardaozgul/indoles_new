"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePersonaState } from "@/lib/hooks/use-persona";

const KEYS = ["growth", "transform", "build"] as const;

/**
 * Üç pillar — tek satır, üç kolon, hover'da üst çizgi dolar.
 * Persona-aware (ADR-014): başlık, lede ve her pillar'ın tagline/description'ı
 * `home.pillars._personas.<persona>` altından okunur.
 */
export function PillarsSection({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.pillars");
  const { persona, ready } = usePersonaState();
  const [hovered, setHovered] = React.useState<number | null>(null);

  const p = (key: string) => t(`_personas.${persona}.${key}` as never);

  return (
    <section id="pillars" className="bg-bg pb-[140px] pt-10">
      <div className="ds-container">
        <div
          className="reveal mb-20 grid items-end gap-6 md:grid-cols-[1fr_2fr] md:gap-20"
          style={{ opacity: ready ? undefined : 0.95 }}
        >
          <span className="eyebrow">{p("eyebrow")}</span>
          <h2 className="typography-display-lg">
            {p("headline")
              .split("\n")
              .map((line, i) => (
                <React.Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
          </h2>
        </div>

        <p className="reveal mb-16 max-w-[70ch] text-lg leading-relaxed text-ink-600">
          {p("lede")}
        </p>

        <div className="pillars-grid">
          {KEYS.map((key, i) => (
            <article
              key={key}
              className={`pillar${hovered === i ? " is-active" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocusCapture={() => setHovered(i)}
              onBlurCapture={() => setHovered(null)}
            >
              <div className="mb-10 flex items-center justify-between text-ink-400">
                <span className="mono text-xs tracking-[0.16em]">
                  0{i + 1}
                </span>
                <span className="pillar-dot" aria-hidden="true" />
              </div>

              <h3 className="typography-h2 mb-1.5">{t(`${key}.name`)}</h3>
              <p className="mono mb-6 text-[11px] uppercase tracking-[0.14em] text-teal-700">
                {p(`${key}.tagline`)}
              </p>
              <p className="mb-7 max-w-[34ch] text-[15px] leading-relaxed text-ink-600">
                {p(`${key}.description`)}
              </p>

              <ul className="flex flex-col gap-2.5 border-t border-dashed border-ink-200 pt-6">
                {(t.raw(`${key}.services`) as string[]).map((s) => (
                  <li key={s} className="flex gap-3 text-[13px] font-medium text-ink-700">
                    <span className="text-teal-500" aria-hidden="true">
                      ·
                    </span>
                    {s}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/hizmetler/${key}`}
                className="pillar-arrow"
                aria-label={`${t(`${key}.name`)} — ${locale === "tr" ? "hizmetleri gör" : "view services"}`}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M5 19 L19 5 M9 5 H19 V15" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
