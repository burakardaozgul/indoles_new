"use client";

import * as React from "react";
import { CURSOR } from "@/lib/v2/anim-config";
import { useFinePointer } from "@/lib/v2/use-mouse";

/**
 * Gecikmeli takip eden nokta cursor.
 *
 * Konum her frame lerp'lenir (rAF), boyut/opaklık CSS transition ile değişir.
 * `pointer: fine` olmayan cihazlarda hiç mount edilmez ve OS cursor'a
 * dokunulmaz (spec §5).
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const dotRef = React.useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    if (!fine) return;

    document.documentElement.classList.add("v2-hide-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      setHovering(Boolean(el?.closest?.(CURSOR.interactiveSelector)));
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * CURSOR.lerp;
      pos.y += (target.y - pos.y) * CURSOR.lerp;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("v2-hide-cursor");
    };
  }, [fine]);

  if (!fine) return null;

  const size = hovering ? CURSOR.hoverSize : CURSOR.size;
  const opacity = hovering ? CURSOR.hoverOpacity : CURSOR.opacity;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      // z-60: dialog portal'ı z-50'de; cursor onun altında kalırsa popup içinde
      // fare tamamen kaybolur (`cursor:none` global). Katman sözleşmesi v2.css'te.
      // Beyaz + `difference`: nokta zeminin tersini alır. Sabit `bg-ink-900`
      // koyu yüzeylerde (siyah topbar, footer) siyah üstüne siyah kalıyor ve
      // imleç tamamen kayboluyordu. Fark harmanı açık zeminde koyu, koyu
      // zeminde açık nokta üretir; yeni koyu bölüm eklendikçe bakım da
      // gerektirmez. Opaklıklar (0.7 / hover 0.25) korunuyor — yumuşak nokta
      // ve hover'da büyüyüp silikleşme davranışı aynı kalsın.
      className="pointer-events-none fixed left-0 top-0 z-60 rounded-full bg-white will-change-transform"
      style={{
        mixBlendMode: "difference",
        width: size,
        height: size,
        opacity,
        transition: `width ${CURSOR.transition}s ease, height ${CURSOR.transition}s ease, opacity ${CURSOR.transition}s ease`,
      }}
    />
  );
}
