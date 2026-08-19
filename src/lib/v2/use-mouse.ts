"use client";

import * as React from "react";

export type MouseState = {
  /** Normalize edilmiş viewport konumu, -1 … +1 (NDC). */
  ndc: { x: number; y: number };
  /** Piksel konumu. */
  px: { x: number; y: number };
  /** Son frame'deki hareket büyüklüğü (NDC birimi). */
  velocity: number;
  /** Pointer sayfa içinde mi. */
  active: boolean;
};

/**
 * Global pointer takibi — konum, NDC ve hız.
 *
 * React state kullanmaz: değer bir ref'te tutulur ve render döngüsü her frame
 * okur. 60fps'te setState maliyeti kabul edilemez.
 *
 * `touchmove` de dinlenir — mobilde blob etkileşimi aynı yoldan çalışır
 * (spec §10).
 */
export function useMouse() {
  const ref = React.useRef<MouseState>({
    ndc: { x: 0, y: 0 },
    px: { x: 0, y: 0 },
    velocity: 0,
    active: false,
  });
  const prev = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const update = (clientX: number, clientY: number) => {
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = -((clientY / window.innerHeight) * 2 - 1);
      const s = ref.current;
      s.velocity = Math.hypot(nx - prev.current.x, ny - prev.current.y);
      prev.current = { x: nx, y: ny };
      s.ndc.x = nx;
      s.ndc.y = ny;
      s.px.x = clientX;
      s.px.y = clientY;
      s.active = true;
    };

    const onMove = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    };
    const onLeave = () => {
      ref.current.active = false;
      ref.current.velocity = 0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
}

/** `prefers-reduced-motion: reduce` — SSR güvenli. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Dokunmatik / kaba işaretçi tespiti — custom cursor bu cihazlarda kapalı. */
export function useFinePointer(): boolean {
  const [fine, setFine] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
}
