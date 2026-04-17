import Link from "next/link";
import { CinematicHeroBackground } from "./cinematic-hero-background";

/**
 * Anasayfa cinematic hero — 100vh.
 * Detay: docs/decisions/ADR-003-cinematic-hero-zone.md
 * - Background: canvas wave (mouse-interactive, reduced-motion fallback)
 * - Layout: wordmark bottom-left, tagline right-middle, CTA left-middle
 */
export function CinematicHero({
  wordmark = "INDOLES",
  taglineLine1,
  taglineLine2,
  ctaLabel,
  ctaHref,
  eyebrow,
}: {
  wordmark?: string;
  taglineLine1: string;
  taglineLine2: string;
  ctaLabel: string;
  ctaHref: string;
  eyebrow: string;
}) {
  return (
    <section
      aria-label="Hero"
      className="relative w-full h-screen min-h-[640px] overflow-hidden text-[color:var(--color-hero-paper)]"
      style={{
        backgroundColor: "var(--color-hero-void)",
      }}
    >
      <CinematicHeroBackground />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between">
        {/* Top padding for floating nav */}
        <div aria-hidden className="h-24 md:h-28" />

        {/* Middle — CTA left, tagline right */}
        <div className="flex-1 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-3 rounded-full border border-[color:var(--color-hero-paper)]/30 bg-[color:var(--color-hero-paper)] text-[color:var(--color-hero-deep)] hover:bg-[color:var(--color-hero-paper)]/90 transition-colors h-12 pl-5 pr-6 typography-body-sm font-medium"
              >
                <span>{ctaLabel}</span>
                <span
                  className="w-7 h-7 rounded-full bg-[color:var(--color-hero-deep)] text-[color:var(--color-hero-paper)] flex items-center justify-center text-xs"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </div>

            <div className="order-1 md:order-2 md:text-right md:justify-self-end">
              <p className="typography-label uppercase tracking-widest opacity-60">
                {eyebrow}
              </p>
              <p className="typography-body-lg mt-4 max-w-[32ch] md:ml-auto">
                {taglineLine1}
                <br />
                {taglineLine2}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom — massive wordmark */}
        <div className="relative">
          <h1
            className="px-6 md:px-12 pb-6 md:pb-10 select-none"
            style={{
              color: "var(--color-hero-paper)",
              fontFamily: "var(--font-heading-serif), Georgia, serif",
              fontWeight: 500,
              letterSpacing: "-0.04em",
              fontSize: "clamp(5rem, 12vw, 12rem)",
              lineHeight: 0.85,
              fontVariationSettings: '"opsz" 9',
            }}
          >
            {wordmark}
          </h1>
        </div>
      </div>

      {/* Hero alt sınırı — keskin cut (ADR-003 §13.6) */}
    </section>
  );
}
