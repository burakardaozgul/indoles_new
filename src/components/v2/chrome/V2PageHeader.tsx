"use client";

import * as React from "react";
import { gsap } from "gsap";
import { Link } from "@/lib/i18n/navigation";
import { SECTIONS } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";

export type V2Crumb = { label: string; href?: React.ComponentProps<typeof Link>["href"] };

/**
 * İç sayfa başlığı — anasayfa hero'sunun sakin karşılığı.
 *
 * Anasayfada başlık iki katmanlı ve blob'un içinden geçiyor; iç sayfada bu
 * gösteri gereksiz. Aynı tipografik ölçek ve krem zemin korunur, dekor
 * kaldırılır: okuma buradan başlıyor.
 *
 * Blob arkada `variant="page"` modunda sessizce duruyor (bkz. `BlobCanvas`),
 * bu yüzden başlığın kendi zemini yok.
 */
export function V2PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  aside,
  compact,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: V2Crumb[];
  /** Başlığın sağındaki ikincil sütun — sayı, etiket veya kısa not. */
  aside?: React.ReactNode;
  /**
   * Liste sayfaları için kısaltılmış ölçek (ADR-021). Başlığın hemen altında
   * filtre/araç şeridi varsa açılır — ilk ekran gezinmeye ayrılır.
   */
  compact?: boolean;
}) {
  const rootRef = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    // fromTo — StrictMode'un ikinci geçişinde `from` gizli hâli doğal hâl
    // sanıyor (bkz. Hero, Outro).
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>("[data-ph-reveal]"),
        { ...SECTIONS.revealFrom },
        {
          y: 0,
          opacity: 1,
          duration: SECTIONS.revealDuration,
          stagger: SECTIONS.revealStagger,
          ease: "power3.out",
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className="v2-pagehead"
      data-compact={compact ? "true" : undefined}
      ref={rootRef}
    >
      <div className="v2-pagehead-inner">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="v2-crumbs" data-ph-reveal>
            <ol>
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={`${c.label}-${i}`}>
                    {c.href && !last ? (
                      <Link href={c.href}>{c.label}</Link>
                    ) : (
                      <span aria-current={last ? "page" : undefined}>{c.label}</span>
                    )}
                    {!last ? <span aria-hidden="true">/</span> : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div className="v2-pagehead-body">
          <div>
            {eyebrow ? (
              <span className="v2-eyebrow" data-ph-reveal>
                {eyebrow}
              </span>
            ) : null}
            <h1 className="v2-pagehead-title" data-ph-reveal>
              {title}
            </h1>
          </div>

          <div className="v2-pagehead-side">
            {lede ? (
              <p className="v2-pagehead-lede" data-ph-reveal>
                {lede}
              </p>
            ) : null}
            {aside ? <div data-ph-reveal>{aside}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
