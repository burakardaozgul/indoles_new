"use client";

import * as React from "react";

/**
 * Canvas tabanlı dalga deseni — hero, CTA ve vizyon bölümlerinin zemini.
 *
 * Tasarım disiplini notu: bu bir "particle effect" değil, teal skalasından
 * türetilmiş düşük opaklıkta kontur katmanıdır. Dikkat çalmaz; yüzeye derinlik
 * verir. `prefers-reduced-motion` altında tek kare çizilir ve döngü kurulmaz.
 */
export function WaveCanvas({
  intensity = 1,
  tone = "light",
  layers = 5,
  className,
}: {
  intensity?: number;
  tone?: "light" | "dark";
  layers?: number;
  className?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const mouseRef = React.useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = (e.clientX - rect.left) / rect.width;
      mouseRef.current.ty = (e.clientY - rect.top) / rect.height;
    };
    if (!reduced) window.addEventListener("mousemove", onMove, { passive: true });

    // teal-700 / teal-500 / teal-400 / teal-300 + gold-500 — tokens.ts ile senkron
    const fills =
      tone === "light"
        ? [
            "rgba(44,85,102,0.08)",
            "rgba(79,130,148,0.07)",
            "rgba(122,164,179,0.07)",
            "rgba(174,199,209,0.09)",
            "rgba(184,149,106,0.05)",
          ]
        : [
            "rgba(44,85,102,0.18)",
            "rgba(79,130,148,0.14)",
            "rgba(122,164,179,0.10)",
            "rgba(184,149,106,0.08)",
            "rgba(44,85,102,0.12)",
          ];

    let t = 0;

    /**
     * Görünürlük kapısı + 30 fps tavan (2026-08-28 performans çalışması).
     *
     * Döngü kapısızdı: canvas ekran dışındayken bile her rAF karesinde tam
     * genişlik sinüs katmanları çiziliyordu — sayfada birden fazla dalga
     * varken boştaki yükün görünmez payı. Ekran dışında döngü tamamen durur,
     * görünürken yavaş ambient hareket için 30 fps yeter.
     */
    let visible = true;
    let lastFrame = 0;
    const io = new IntersectionObserver((entries) => {
      const was = visible;
      visible = Boolean(entries[0]?.isIntersecting);
      if (visible && !was && rafRef.current === null && !reduced) {
        rafRef.current = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    const draw = (now: number = performance.now()) => {
      if (!visible) {
        rafRef.current = null;
        return;
      }
      if (now - lastFrame < 1000 / 30 - 1) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      t += 0.003 * intensity;
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < layers; i++) {
        ctx.beginPath();
        const amplitude = 60 + i * 25;
        const frequency = 0.002 + i * 0.0005;
        const speed = t * (1 + i * 0.2);
        const yOffset =
          h * (0.3 + i * 0.15) + (mouseRef.current.y - 0.5) * 30 * (i + 1);

        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 6) {
          const y =
            yOffset +
            Math.sin(x * frequency + speed) * amplitude +
            Math.sin(x * frequency * 2.3 + speed * 1.4) * amplitude * 0.4 +
            Math.cos(
              x * frequency * 0.5 + speed * 0.7 + mouseRef.current.x * 2,
            ) *
              amplitude *
              0.25;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = fills[i % fills.length] as string;
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const amplitude = 40 + i * 20;
        const frequency = 0.003 + i * 0.0008;
        const yOffset =
          h * (0.2 + i * 0.22) + (mouseRef.current.y - 0.5) * 20 * (i + 1);
        for (let x = 0; x <= w; x += 4) {
          const y =
            yOffset +
            Math.sin(x * frequency + t * (1 + i * 0.3)) * amplitude +
            Math.cos(x * frequency * 1.7 + t * 0.8) * amplitude * 0.3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          tone === "light"
            ? `rgba(44, 85, 102, ${0.06 + i * 0.02})`
            : `rgba(184, 149, 106, ${0.18 - i * 0.04})`;
        ctx.stroke();
      }

      if (!reduced) rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [intensity, tone, layers]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * Bağlantılı nokta alanı — metodoloji bölümünün zemini.
 * Ağ/sistem metaforu taşır, dekoratif parçacık yağmuru değildir.
 */
export function ParticleField({
  density = 40,
  color = "rgba(44,85,102,0.35)",
}: {
  density?: number;
  color?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf: number | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.6 + 0.4,
      o: Math.random() * 0.6 + 0.2,
    }));

    const withAlpha = (a: number) => color.replace(/[\d.]+\)$/, `${a})`);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(p.o);
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = withAlpha(0.08 * (1 - d / 120));
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
