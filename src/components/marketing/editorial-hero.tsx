import * as React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BrandWatermark } from "@/components/brand/brand-watermark";

/**
 * Editorial hero — Anthropic sitesindeki model.
 * Paper zemin, büyük bold left headline (altı çizili emphasis), sağda supporting body.
 * Canvas/motion yok; statik, disiplinli editorial.
 */
export function EditorialHero({
  eyebrow,
  headlineBefore,
  headlineEmphasisA,
  headlineMiddle,
  headlineEmphasisB,
  headlineAfter,
  supportingCopy,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  personaChip,
}: {
  eyebrow?: string;
  headlineBefore: string;
  headlineEmphasisA: string;
  headlineMiddle: string;
  headlineEmphasisB: string;
  headlineAfter: string;
  supportingCopy: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  personaChip?: React.ReactNode;
}) {
  return (
    <section
      aria-label="Hero"
      className="relative bg-paper overflow-hidden"
    >
      <BrandWatermark tone="light" side="right" opacity={0.03} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 pt-12 md:pt-20 pb-20 md:pb-32">
        {eyebrow ? (
          <p className="typography-label uppercase tracking-widest text-ink-500 mb-4 md:mb-6">
            {eyebrow}
          </p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
          {/* Headline + chip */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <h1
              className={cn(
                "typography-display-2xl",
                "text-ink-900",
                "leading-[1.05]"
              )}
              style={{
                fontFamily: "var(--font-heading-serif), Georgia, serif",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                fontVariationSettings: '"opsz" 9',
              }}
            >
              {headlineBefore}
              <Emphasis>{headlineEmphasisA}</Emphasis>
              {headlineMiddle}
              <Emphasis>{headlineEmphasisB}</Emphasis>
              {headlineAfter}
            </h1>
            {personaChip ? (
              <div>{personaChip}</div>
            ) : null}
          </div>

          {/* Supporting copy */}
          <div className="md:col-span-5 md:pb-2">
            <p className="typography-body-lg text-ink-700 max-w-prose-editorial">
              {supportingCopy}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-sm font-medium"
              >
                <Phone size={16} aria-hidden />
                {ctaLabel}
              </Link>
              {secondaryCtaLabel && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center gap-2 typography-body-sm text-ink-900"
                >
                  <span className="underline underline-offset-4 decoration-ink-300 hover:decoration-ink-900 transition-all">
                    {secondaryCtaLabel}
                  </span>
                  <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Altı çizili editorial emphasis — headline içinde anahtar kelimeler için.
 * Anthropic'deki altı çizili "research" ve "products" gibi.
 */
function Emphasis({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="relative whitespace-nowrap"
      style={{
        backgroundImage:
          "linear-gradient(transparent 88%, var(--color-ink-900) 88%, var(--color-ink-900) 96%, transparent 96%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </span>
  );
}
