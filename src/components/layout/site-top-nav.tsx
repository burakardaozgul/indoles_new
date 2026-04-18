"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "@/components/brand/brand-logo";

type NavLink = { href: string; label: string };

/**
 * Non-floating üst nav — sayfa akışının bir parçası, sticky değil.
 * Paper zeminle bütünleşir, sadece scroll sonrası ince bir alt sınır çizer.
 * Anthropic sitesindeki model.
 */
export function SiteTopNav({
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const other = locale === "tr" ? "en" : "tr";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-paper transition-shadow duration-300",
        scrolled ? "border-b border-surface-2" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 h-20 md:h-24 flex items-center justify-between gap-6">
        {/* Left — brand */}
        <Link
          href={`/${locale}`}
          className="flex items-center rounded-md py-1 shrink-0"
          aria-label="INDOLES anasayfa"
        >
          <BrandLogo variant="light-bg" height={62} priority />
        </Link>

        {/* Center — links */}
        <nav className="hidden md:flex items-center gap-8 typography-body-sm">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 transition-colors",
                  active
                    ? "text-ink-900"
                    : "text-ink-700 hover:text-ink-900"
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-ink-900"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right — locale + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`/${other}`}
            className="typography-label uppercase tracking-widest text-ink-500 hover:text-ink-900 transition-colors px-2 py-1"
            aria-label={`Switch to ${other.toUpperCase()}`}
          >
            {other}
          </a>
          <Link
            href={ctaHref}
            className="hidden md:inline-flex items-center gap-2 h-10 px-5 rounded-md bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-sm font-medium"
          >
            <Phone size={16} aria-hidden />
            {ctaLabel}
          </Link>
          {/* Mobile burger */}
          <button
            type="button"
            className="md:hidden w-10 h-10 grid place-items-center rounded-md hover:bg-surface-1 transition-colors"
            aria-label="Menü"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-ink-900"
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
