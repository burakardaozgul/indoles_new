"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "@/components/brand/brand-logo";
import { usePopup } from "@/lib/popup/popup-context";

export type NavLink = { href: string; label: string };

/**
 * Ana navigasyon — sabit, ortalanmış liquid-glass pill.
 *
 * Cam etkisi dört katmandan oluşur (bkz. `sections.css` → `.glass-*`):
 * mercek (SVG displacement + backdrop-filter), ton, parlama, kenar.
 * Bu, ADR-002'nin genel glassmorphism reddine karşı tek istisnadır ve
 * yalnızca nav yüzeyinde geçerlidir — ADR-015 §Kabul edilen istisnalar.
 */
export function SiteNav({
  locale,
  links,
  ctaLabel,
}: {
  locale: "tr" | "en";
  links: NavLink[];
  ctaLabel: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { openPopup } = usePopup();
  const other = locale === "tr" ? "en" : "tr";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route değişince çekmece kapanır
  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={cn("nav", scrolled && "nav-scrolled", menuOpen && "nav-open")} aria-label={locale === "tr" ? "Ana navigasyon" : "Main navigation"}>
      {/* Sıvı cam için displacement filtresi */}
      <svg className="nav-svg-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="nav-liquid" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="2" seed="9" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.5" result="blurredNoise" />
            <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="40" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="nav-inner">
        <div className="glass-lens" aria-hidden="true" />
        <div className="glass-tint" aria-hidden="true" />
        <div className="glass-shine" aria-hidden="true" />
        <div className="glass-edge" aria-hidden="true" />

        <Link href={`/${locale}`} className="nav-brand" aria-label={locale === "tr" ? "INDOLES anasayfa" : "INDOLES home"}>
          <BrandLogo variant="light-bg" height={44} priority className="nav-logo" />
        </Link>

        <div className="nav-links">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== `/${locale}` && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className="nav-link" aria-current={active ? "page" : undefined}>
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="nav-cta">
          <Link href={`/${other}`} className="nav-locale mono" hrefLang={other}>
            {locale.toUpperCase()} / {other.toUpperCase()}
          </Link>
          <button type="button" onClick={openPopup} className="btn btn-primary nav-btn">
            {ctaLabel}
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="nav-burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="nav-drawer"
          aria-label={locale === "tr" ? "Menü" : "Menu"}
        >
          <span />
          <span />
        </button>

        {menuOpen && (
          <div className="nav-drawer" id="nav-drawer">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <div className="nav-drawer-foot">
              <Link href={`/${other}`} className="nav-locale mono" hrefLang={other}>
                {locale.toUpperCase()} / {other.toUpperCase()}
              </Link>
              <button type="button" onClick={openPopup} className="btn btn-primary nav-btn">
                {ctaLabel}
                <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
