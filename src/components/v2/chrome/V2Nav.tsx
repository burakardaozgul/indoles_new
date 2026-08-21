"use client";

import * as React from "react";
import { gsap } from "gsap";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { localeHref } from "@/lib/i18n/locale-href";

/**
 * Dil değiştiricinin hedef adresi.
 *
 * Birincil kaynak sayfanın kendi `hreflang` alternate link'i: lokalize
 * slug'lı dinamik sayfalarda (`/tr/hizmetler/performans-pazarlama` ↔
 * `/en/services/performance-marketing`) doğru karşılığı yalnız sayfa bilir
 * ve metadata'sıyla zaten beyan ediyor. next-intl'in `usePathname`'i burada
 * şablonu döndürür (`/hizmetler/[slug]`) — önceki kurgu bu yüzden
 * `/en/services/[slug]` gibi ölü linkler üretiyordu.
 *
 * Alternate etiketi olmayan sayfalarda (henüz metadata'sız route'lar)
 * `localeHref` segment çevirisine düşülür.
 */
function useAlternateHref(other: "tr" | "en", pathname: string): string | null {
  const [href, setHref] = React.useState<string | null>(null);
  React.useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${other}"]`,
    );
    setHref(link ? new URL(link.href).pathname : null);
  }, [other, pathname]);
  return href;
}
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { NAV } from "@/lib/v2/anim-config";
import { cn } from "@/lib/utils/cn";
import { usePopup } from "@/lib/popup/popup-context";

/** `routing.pathnames` anahtarlarından nav'da kullandıklarımız. */
export type V2NavHref =
  | "/"
  | "/hakkimizda"
  | "/hizmetler"
  | "/paketler"
  | "/vakalar"
  | "/yazilar"
  | "/iletisim";

export type V2NavLink = { href: V2NavHref; label: string };

/**
 * v2 navigasyonu — siyah şeridin altında, sayfa boyunca sabit.
 *
 * Zemin blob'un üstünde durduğu için nav sayfa tepesinde tamamen saydamdır;
 * scroll başlayınca krem bir yüzey ve hairline kazanır. Böylece hero'da
 * kompozisyona müdahale etmez, içerik bölümlerinde okunur kalır.
 *
 * Linkler `next-intl` `Link`'inden geçer: EN'de `/hizmetler` → `/en/services`
 * segment çevirisi otomatik olur, ham `<a>` ile oluşan 307 atlaması kalkar.
 */
export function V2Nav({
  locale,
  links,
  ctaLabel,
  menuLabel,
}: {
  locale: "tr" | "en";
  links: V2NavLink[];
  ctaLabel: string;
  menuLabel: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  // CTA sayfa değiştirmez, rezervasyon akışını açar — eski `SiteNav`'ın
  // davranışı buydu ve ADR-014 persona akışının giriş kapısı odur.
  const { openPopup } = usePopup();
  const other = locale === "tr" ? "en" : "tr";
  const alternateHref = useAlternateHref(other, pathname);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > NAV.surfaceAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route değişince çekmece kapanır
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Çekmece açıkken sayfa kaymaz + Esc kapatır
  React.useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Giriş animasyonu — `fromTo`, çünkü StrictMode'un ikinci geçişinde `from`
  // gizli hâli doğal hâl sanıp 0 → 0 animasyonu üretiyor (bkz. Hero).
  React.useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>("[data-nav-item]"),
        { ...NAV.entryFrom },
        {
          y: 0,
          opacity: 1,
          duration: NAV.entryDuration,
          stagger: NAV.entryStagger,
          ease: NAV.entryEase,
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const isActive = (href: V2NavHref) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      ref={rootRef}
      className={cn("v2-nav", scrolled && "is-scrolled", open && "is-open")}
    >
      <nav
        className="v2-nav-inner"
        aria-label={locale === "tr" ? "Ana navigasyon" : "Main navigation"}
      >
        <Link
          href="/"
          className="v2-nav-brand"
          data-nav-item
          aria-label={locale === "tr" ? "INDOLES anasayfa" : "INDOLES home"}
        >
          <BrandLogo variant="light-bg" height={56} priority className="v2-nav-logo" />
        </Link>

        <ul className="v2-nav-links" data-nav-item>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="v2-nav-link"
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="v2-nav-actions" data-nav-item>
          <a
            href={alternateHref ?? localeHref(pathname, other)}
            className="v2-nav-locale"
            hrefLang={other}
            aria-label={locale === "tr" ? "Switch to English" : "Türkçe'ye geç"}
          >
            <span aria-hidden="true" className="is-current">
              {locale.toUpperCase()}
            </span>
            <span aria-hidden="true" className="v2-nav-locale-sep">
              /
            </span>
            <span aria-hidden="true">{other.toUpperCase()}</span>
          </a>

          <button type="button" onClick={openPopup} className="v2-nav-cta">
            {ctaLabel}
            <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
              <path
                d="M3 11 L11 3 M5 3 H11 V9"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="v2-nav-burger"
          data-nav-item
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="v2-nav-drawer"
          aria-label={menuLabel}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* Çekmece her zaman DOM'da: açılış/kapanış geçişi ve odak sırası korunur.
          Kapalıyken `inert` ile klavye ve okuyucudan tamamen çıkar. */}
      <div
        id="v2-nav-drawer"
        className="v2-nav-drawer"
        inert={!open}
        aria-hidden={!open}
      >
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="v2-nav-drawer-link"
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="v2-nav-drawer-foot">
          <a href={alternateHref ?? localeHref(pathname, other)} className="v2-nav-locale" hrefLang={other}>
            <span aria-hidden="true" className="is-current">
              {locale.toUpperCase()}
            </span>
            <span aria-hidden="true" className="v2-nav-locale-sep">
              /
            </span>
            <span aria-hidden="true">{other.toUpperCase()}</span>
          </a>
          <button
            type="button"
            className="v2-nav-cta"
            onClick={() => {
              setOpen(false);
              openPopup();
            }}
          >
            {ctaLabel}
            <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
              <path
                d="M3 11 L11 3 M5 3 H11 V9"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
