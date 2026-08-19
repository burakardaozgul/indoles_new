"use client";

import * as React from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS } from "./anim-config";
import { usePrefersReducedMotion } from "./use-mouse";

let registered = false;
function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
  }
  registered = true;
}

/**
 * Lenis + GSAP ScrollTrigger senkronu.
 *
 * - `lenis.on("scroll", ScrollTrigger.update)` ile ScrollTrigger Lenis'in
 *   sanal scroll pozisyonundan beslenir.
 * - rAF döngüsü `gsap.ticker`'a devredilir; iki ayrı rAF çakışmaz.
 * - `prefers-reduced-motion` altında Lenis hiç kurulmaz; sayfa native scroll
 *   ile çalışır ve scrub'lı animasyonlar anında son duruma oturur (spec §6).
 */
export function useLenis(): { reduced: boolean; ready: boolean } {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    registerGsap();

    if (reduced && LENIS.disableOnReducedMotion) {
      ScrollTrigger.refresh();
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      lerp: LENIS.lerp,
      wheelMultiplier: LENIS.wheelMultiplier,
      smoothWheel: LENIS.smoothWheel,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Dev'de tune ve doğrulama için: konsoldan `__lenis.scrollTo(y, {immediate:true})`
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    ScrollTrigger.refresh();
    setReady(true);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return { reduced, ready };
}

/** Debounce'lu resize — kamera, dünya koordinatı ve ScrollTrigger tazelemesi. */
export function useDebouncedResize(fn: () => void, delay: number) {
  const saved = React.useRef(fn);
  saved.current = fn;

  React.useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => saved.current(), delay);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [delay]);
}
