"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "@/components/brand/brand-logo";

type NavLink = { href: string; label: string };

export function FloatingNav({
  locale,
  links,
  ctaLabel,
  ctaHref,
}: {
  locale: "tr" | "en";
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const pathname = usePathname();
  const heroMode = pathname === `/${locale}` || pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!heroMode) {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroMode]);

  const onHero = heroMode && !scrolled;
  const other = locale === "tr" ? "en" : "tr";

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "w-[min(calc(100vw-24px),1100px)]"
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-between gap-2",
          "rounded-2xl border backdrop-blur-xl",
          "pl-3 pr-2 py-2 transition-all duration-500 ease-out",
          onHero
            ? "bg-white/[0.05] border-white/[0.10] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"
            : "bg-paper/80 border-surface-2 shadow-[0_4px_16px_-4px_rgba(26,31,36,0.08)]"
        )}
        style={{ backdropFilter: "blur(18px) saturate(160%)" }}
      >
        {/* Brand */}
        <Link
          href={`/${locale}`}
          className={cn(
            "flex items-center shrink-0 rounded-xl px-3 py-1.5 transition-opacity",
            onHero ? "hover:bg-white/[0.06]" : "hover:bg-surface-1"
          )}
          aria-label="INDOLES anasayfa"
        >
          <BrandLogo
            variant={onHero ? "dark-bg" : "light-bg"}
            height={26}
            priority
          />
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 typography-body-sm">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl transition-all duration-300",
                  onHero
                    ? "text-[color:var(--color-hero-paper)]/80 hover:text-[color:var(--color-hero-paper)] hover:bg-white/[0.06]"
                    : "text-ink-700 hover:text-ink-900 hover:bg-surface-1",
                  active &&
                    (onHero
                      ? "text-[color:var(--color-hero-paper)] bg-white/[0.08]"
                      : "text-ink-900 bg-surface-1")
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-4 right-4 -bottom-[1px] h-[1px]",
                      onHero
                        ? "bg-[color:var(--color-hero-paper)]/40"
                        : "bg-brand-500/50"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={`/${other}`}
            className={cn(
              "typography-label uppercase tracking-widest rounded-lg px-3 py-2 transition-colors",
              onHero
                ? "text-[color:var(--color-hero-paper)]/60 hover:text-[color:var(--color-hero-paper)] hover:bg-white/[0.06]"
                : "text-ink-500 hover:text-ink-900 hover:bg-surface-1"
            )}
            aria-label={`Switch to ${other.toUpperCase()}`}
          >
            {other}
          </a>
          <Link
            href={ctaHref}
            className={cn(
              "hidden md:inline-flex items-center gap-2 h-10 pl-4 pr-3 rounded-xl typography-body-sm font-medium transition-all duration-300",
              onHero
                ? "bg-[color:var(--color-hero-paper)] text-[color:var(--color-hero-deep)] hover:bg-[color:var(--color-hero-paper)]/90"
                : "bg-ink-900 text-paper hover:bg-ink-700"
            )}
          >
            <span>{ctaLabel}</span>
            <span
              aria-hidden
              className={cn(
                "w-6 h-6 rounded-md grid place-items-center transition-transform group-hover:translate-x-0.5",
                onHero
                  ? "bg-[color:var(--color-hero-deep)] text-[color:var(--color-hero-paper)]"
                  : "bg-paper/15 text-paper"
              )}
            >
              →
            </span>
          </Link>

          {/* Mobile burger placeholder */}
          <button
            type="button"
            className={cn(
              "md:hidden w-10 h-10 grid place-items-center rounded-lg transition-colors",
              onHero
                ? "text-[color:var(--color-hero-paper)] hover:bg-white/[0.06]"
                : "text-ink-900 hover:bg-surface-1"
            )}
            aria-label="Menü"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
