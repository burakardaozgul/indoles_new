"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CASES } from "@/lib/content/cases";
import { localeHref } from "@/lib/i18n/locale-href";
import { usePersonaState } from "@/lib/hooks/use-persona";

const T = "#2C5566"; // teal-700
const G = "#B8956A"; // gold-500

/** Vaka görseli — pillar'a göre değişen teknik diyagram. Tamamen dekoratif. */
function CaseVisual({ pillar }: { pillar: "growth" | "transform" | "build" }) {
  if (pillar === "growth") {
    return (
      <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="cvg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#EAF1F4" />
            <stop offset="1" stopColor="#AEC7D1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#cvg)" />
        {[40, 70, 55, 110, 95, 150, 130].map((h, i) => (
          <rect key={i} x={40 + i * 46} y={230 - h} width="26" height={h} fill={T} opacity={0.22 + i * 0.08} />
        ))}
        <path
          d="M53 200 L 99 165 L 145 185 L 191 120 L 237 140 L 283 85 L 329 105"
          stroke={G}
          strokeWidth="2"
          fill="none"
        />
        <g fontFamily="monospace" fontSize="9" fill={T} opacity="0.7">
          <text x="24" y="280">FUNNEL · CAC ↓ · ROAS ↑</text>
        </g>
      </svg>
    );
  }
  if (pillar === "build") {
    return (
      <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="cvb" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#D4E2E8" />
            <stop offset="1" stopColor="#EAF1F4" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#cvb)" />
        <g stroke={T} fill="rgba(44,85,102,0.06)" strokeWidth="1.2">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={90 + i * 8} y={60 + i * 42} width={220 - i * 16} height="32" rx="3" />
          ))}
        </g>
        <path d="M200 92 L 200 226" stroke={G} strokeWidth="1.4" strokeDasharray="4 4" />
        <circle cx="200" cy="92" r="5" fill={G} />
        <g fontFamily="monospace" fontSize="9" fill={T} opacity="0.7">
          <text x="24" y="280">STACK · SHIP · OWN</text>
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cvt" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#AEC7D1" />
          <stop offset="1" stopColor="#D4E2E8" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#cvt)" />
      <g stroke={T} opacity="0.35" strokeWidth="0.6" fill="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
        ))}
      </g>
      {[
        [80, 80],
        [170, 60],
        [240, 120],
        [320, 70],
        [120, 180],
        [220, 200],
        [310, 210],
        [180, 250],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" fill="rgba(44,85,102,0.15)" />
          <circle cx={x} cy={y} r="5" fill={T} />
          {i % 3 === 0 && <circle cx={x} cy={y} r="22" fill="none" stroke={G} strokeWidth="1" opacity="0.6" />}
        </g>
      ))}
      <g fontFamily="monospace" fontSize="9" fill={T} opacity="0.7">
        <text x="24" y="280">PROCESS · DATA · DECISION</text>
      </g>
    </svg>
  );
}

function CaseItem({
  item,
  locale,
  index,
}: {
  item: (typeof CASES)[number];
  locale: "tr" | "en";
  index: number;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [offset, setOffset] = React.useState(0);
  const isTr = locale === "tr";

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      setOffset(Math.max(-1, Math.min(1, (p - 0.5) * 2)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const metrics = item.metrics.slice(0, 2);

  return (
    <article
      className="py-14"
      ref={ref}
      style={index > 0 ? { borderTop: "1px solid var(--color-ink-200)" } : undefined}
    >
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div className="case-media">
          <div className="case-image" style={{ transform: `translateY(${offset * -24}px) scale(1.08)` }}>
            <CaseVisual pillar={item.pillar} />
          </div>
          <span className="case-year mono">
            {item.durationWeeks} {isTr ? "hafta" : "weeks"}
          </span>
        </div>

        <div className="flex flex-col gap-4.5">
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-teal-700">
            {item.clientSector[locale]}
          </span>
          <span className="mono text-xs tracking-[0.08em] text-ink-500">
            {item.clientName[locale]}
          </span>
          <h3 className="typography-h1 max-w-[18ch]">{item.title[locale]}</h3>

          <dl className="my-3 grid grid-cols-2 gap-6 border-y border-ink-200 py-6">
            {metrics.map((m) => (
              <div key={m.label[locale]} className="flex flex-col gap-1">
                <dt className="sr-only">{m.label[locale]}</dt>
                <dd className="font-display text-step-4 font-medium tracking-[-0.03em] text-teal-700 tabular">
                  {m.value[locale]}
                </dd>
                <span className="text-xs text-ink-500">{m.label[locale]}</span>
              </div>
            ))}
          </dl>

          <Link
            href={localeHref(`/vakalar/${item.slug[locale]}`, locale)}
            className="case-link"
          >
            {isTr ? "Vakayı oku" : "Read the case"}
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Seçilmiş vakalar — persona-aware başlık, gerçek metriklerle. */
export function CasesSection({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.proof");
  const tCommon = useTranslations("common");
  const { persona } = usePersonaState();
  const isTr = locale === "tr";

  return (
    <section id="work" className="py-[120px] md:py-[160px]" aria-labelledby="cases-title">
      <div className="ds-container">
        <div className="mb-20 grid items-end gap-8 border-b border-ink-200 pb-10 md:grid-cols-[auto_1fr_auto] md:gap-12">
          <span className="eyebrow">{t(`_personas.${persona}.eyebrow` as never)}</span>
          <h2 id="cases-title" className="typography-display-lg">
            {t(`_personas.${persona}.headline` as never)}
          </h2>
          <Link href={localeHref("/vakalar", locale)} className="btn btn-ghost">
            {tCommon("cta.viewAll")}
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </Link>
        </div>

        <p className="mb-12 max-w-[70ch] text-lg leading-relaxed text-ink-600">
          {t(`_personas.${persona}.lede` as never)}
        </p>

        <div className="flex flex-col">
          {CASES.map((c, i) => (
            <CaseItem key={c.slug.tr} item={c} locale={locale} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
