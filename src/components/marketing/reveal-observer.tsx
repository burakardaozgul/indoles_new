"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * `.reveal` sınıfı taşıyan her elemana tek bir IntersectionObserver bağlar.
 * Görünür olduğunda `.in` eklenir ve eleman gözlemden çıkarılır.
 *
 * Layout seviyesinde bir kez mount edilir; her bölüm kendi observer'ını
 * kurmaz. Route değiştiğinde yeniden tarar.
 */
export function RevealObserver() {
  const pathname = usePathname();

  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (nodes.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((n) => {
      if (!n.classList.contains("in")) io.observe(n);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
