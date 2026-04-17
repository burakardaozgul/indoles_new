"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Brand watermark — büyük logo silüet, section'da dikey ortalı.
 * Scroll ilerledikçe logo kenardan ortaya doğru kayar (parallax).
 *
 * Başlangıç (section viewport dışında) → logo kenardan yarı çıkmış
 * Section viewport ortasında           → logo içeri kaymış
 *
 * side="right" → logo sağ kenardan yarı dışarıda
 * side="left"  → logo sol kenardan yarı dışarıda
 *
 * Reduced-motion: statik yarı pozisyon.
 */
export function BrandWatermark({
  tone = "light",
  side = "right",
  opacity = 0.03,
  className,
}: {
  tone?: "light" | "dark";
  side?: "right" | "left";
  opacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setProgress(0); // statik: başlangıç pozisyonunda (yarı dışarı)
      return;
    }

    const compute = () => {
      const rect = el.getBoundingClientRect();
      // Section'ın üst kenarı viewport tepesini geçtiği andan itibaren
      // scroll ilerledikçe progress artar.
      // rect.top = 0 iken (section tam viewport başında) → p = 0 (başlangıç: yarı dışarı)
      // rect.top = -rect.height iken (section tamamen geçti) → p = 1 (içeri kaymış)
      const scrolled = Math.max(0, -rect.top);
      const range = Math.max(1, rect.height);
      const p = Math.min(1, scrolled / range);
      setProgress(p);
    };

    compute();
    const onScroll = () => compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const logoSrc =
    tone === "dark"
      ? "/brand/indoles-logo-light.png"
      : "/brand/indoles-logo-dark.png";

  // Başlangıç: 48% kenardan dışarı (yarıdan biraz az → görünür yarı belirgin)
  // Bitiş (ortada): -12% (kenardan biraz içeri)
  const startOffset = 48;
  const endOffset = -12;
  const offsetPct = startOffset + (endOffset - startOffset) * progress;
  const translateX =
    side === "right" ? `${offsetPct}%` : `${-offsetPct}%`;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-1/2",
          side === "right" ? "right-0" : "left-0"
        )}
        style={{
          transform: `translate(${translateX}, -50%)`,
          transition: "transform 0.12s linear",
          width: "min(115vw, 2000px)",
          opacity,
        }}
      >
        <Image
          src={logoSrc}
          alt=""
          width={1280}
          height={420}
          priority={false}
          className="w-full h-auto"
          style={{
            filter:
              tone === "dark" ? "brightness(0) invert(1)" : "brightness(0)",
          }}
        />
      </div>
    </div>
  );
}
