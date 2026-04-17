"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic hero background — Canvas 2D shader.
 *
 * 3 radial-gradient blob (2 sinüs-based drift, 1 mouse-tracked), downsampled
 * canvas + CSS blur → metallic blue wave. prefers-reduced-motion + mobil
 * viewport'ta motion kapanır, statik gradient gösterilir.
 *
 * Detay: docs/04-design-system-principles.md §13.3,
 *        docs/decisions/ADR-003-cinematic-hero-zone.md
 */
export function CinematicHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({
    // Hedef konum (0-1 normalize)
    tx: 0.7,
    ty: 0.35,
    // Aktif konum (lerp'li)
    x: 0.7,
    y: 0.35,
    touched: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const smallViewport = window.matchMedia("(max-width: 767px)").matches;
    const animated = !reducedMotion && !smallViewport;

    // Downsampled render (0.5x), CSS filter: blur(40px) ile metallic yumuşama
    const SCALE = 0.5;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * SCALE));
      canvas.height = Math.max(1, Math.floor(rect.height * SCALE));
    };
    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(container);

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current.tx = (e.clientX - rect.left) / rect.width;
      pointerRef.current.ty = (e.clientY - rect.top) / rect.height;
      pointerRef.current.touched = true;
    };
    container.addEventListener("pointermove", onPointer, { passive: true });

    // Hero zone viewport dışına çıkınca loop'u durdur (perf)
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);

    let raf = 0;
    let t0 = performance.now();

    const draw = (now: number) => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = (now - t0) / 1000; // seconds

      const w = canvas.width;
      const h = canvas.height;

      // Base gradient: hero.void → hero.deep
      const base = ctx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, "#0a1628");
      base.addColorStop(1, "#05080f");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Lerp pointer (smooth follow)
      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;

      // 3 blob (render order: metal → light → accent)
      ctx.globalCompositeOperation = "lighter";

      const blobs = animated
        ? [
            // Drift blob A — slow horizontal sine
            {
              x: (0.25 + 0.15 * Math.sin(t * 0.15)) * w,
              y: (0.55 + 0.08 * Math.cos(t * 0.12)) * h,
              r: Math.max(w, h) * 0.55,
              color: "rgba(27, 58, 92, 0.85)", // hero.metal
            },
            // Drift blob B — counter-sine
            {
              x: (0.75 + 0.12 * Math.cos(t * 0.1)) * w,
              y: (0.25 + 0.1 * Math.sin(t * 0.17)) * h,
              r: Math.max(w, h) * 0.4,
              color: "rgba(59, 111, 160, 0.55)", // hero.light
            },
            // Mouse-tracked highlight (brighter)
            {
              x: p.x * w,
              y: p.y * h,
              r: Math.max(w, h) * 0.35,
              color: "rgba(168, 190, 206, 0.45)", // hero.accent
            },
          ]
        : [
            // Static fallback
            {
              x: 0.3 * w,
              y: 0.55 * h,
              r: Math.max(w, h) * 0.55,
              color: "rgba(27, 58, 92, 0.85)",
            },
            {
              x: 0.75 * w,
              y: 0.3 * h,
              r: Math.max(w, h) * 0.4,
              color: "rgba(59, 111, 160, 0.55)",
            },
            {
              x: 0.7 * w,
              y: 0.5 * h,
              r: Math.max(w, h) * 0.28,
              color: "rgba(168, 190, 206, 0.35)",
            },
          ];

      for (const b of blobs) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "rgba(10, 22, 40, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.globalCompositeOperation = "source-over";

      // Vignette — kenarları koyu tut, orta parlak kalsın
      const vignette = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.4,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.75
      );
      vignette.addColorStop(0, "rgba(5, 8, 15, 0)");
      vignette.addColorStop(1, "rgba(5, 8, 15, 0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      if (animated) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (animated) {
      raf = requestAnimationFrame(draw);
    } else {
      draw(performance.now());
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      io.disconnect();
      container.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{
        // CSS fallback gradient — canvas ilk frame'e kadar görünen renk
        background:
          "radial-gradient(120% 80% at 70% 35%, #1b3a5c 0%, #0a1628 45%, #05080f 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          // Downsampled canvas'ı üst viewport'a yumuşak şekilde büyüt
          filter: "blur(40px) saturate(130%)",
          transform: "scale(1.05)",
          transformOrigin: "center",
        }}
      />
      {/* İnce film grain overlay — metallic doku kırmak için */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
