"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

const DOT_H = 40;
const DOT_SIZE = 6;       // fixed dot diameter; active uses scale
const MAX_SCALE = 1.45;
const MAGNIFY_RANGE = 110;

// SVG curve geometry
const SVG_W = 32;
const CURVE_RX = 26;      // curve x endpoint (from SVG left)
const BOW = 24;           // leftward bow depth in px

// Quadratic bezier: P0=(rx,0) P1=(rx-BOW, h/2) P2=(rx,h)
// x(t) = rx - 2·t·(1-t)·BOW
// For dot at row i of n: t=(i+0.5)/n, marginRight = (SVG_W-rx) + 2·t·(1-t)·BOW - DOT_SIZE/2
function dotMarginRight(i: number, n: number): number {
  const t = (i + 0.5) / n;
  return Math.max(1, SVG_W - CURVE_RX + 2 * t * (1 - t) * BOW - DOT_SIZE / 2);
}

type SectionEntry = { id: string; label: string };

function CurvedLine({ count }: { count: number }) {
  const h = count * DOT_H;
  return (
    <svg
      width={SVG_W}
      height={h}
      className="absolute right-0 top-0 pointer-events-none"
      viewBox={`0 0 ${SVG_W} ${h}`}
      aria-hidden
    >
      <path
        d={`M ${CURVE_RX} 0 Q ${CURVE_RX - BOW} ${h / 2} ${CURVE_RX} ${h}`}
        stroke="rgba(107,115,128,0.22)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotItem({
  section,
  isActive,
  mouseY,
  onClick,
  index,
  total,
}: {
  section: SectionEntry;
  isActive: boolean;
  mouseY: MotionValue<number>;
  onClick: () => void;
  index: number;
  total: number;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseY, (y) => {
    if (!ref.current || y === Infinity) return MAGNIFY_RANGE;
    const r = ref.current.getBoundingClientRect();
    return Math.abs(y - (r.top + r.height / 2));
  });

  const scale = useSpring(
    useTransform(distance, [0, MAGNIFY_RANGE], [MAX_SCALE, 1]),
    { stiffness: 220, damping: 22, mass: 0.3 }
  );

  const mr = dotMarginRight(index, total);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 focus-visible:outline-none cursor-pointer"
      style={{ height: DOT_H, scale, originX: 1, originY: 0.5 }}
      aria-label={section.label}
    >
      {/* Pill label */}
      <span
        className={[
          "rounded-md px-2.5 py-0.5 typography-caption whitespace-nowrap select-none pointer-events-none leading-none transition-colors",
          isActive ? "bg-brand-50 text-brand-700" : "bg-surface-1 text-ink-500",
        ].join(" ")}
      >
        {section.label}
      </span>

      {/* Dot — centered on the bezier curve */}
      <motion.span
        animate={{ scale: isActive ? 1.5 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={isActive ? "bg-brand-500" : "bg-ink-300"}
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          display: "block",
          flexShrink: 0,
          marginRight: mr,
        }}
      />
    </motion.button>
  );
}

export function SectionNavigator() {
  const pathname = usePathname();
  const [sections, setSections] = React.useState<SectionEntry[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const mouseY = useMotionValue(Infinity);

  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-label]"));
    const found = els
      .filter((el) => el.id)
      .map((el) => ({ id: el.id, label: el.getAttribute("data-nav-label")! }));
    setSections(found);
    setActiveId(found[0]?.id ?? "");
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (sections.length === 0) return;
    const update = () => {
      const threshold = window.innerHeight * 0.35;
      let bestId = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) bestId = s.id;
      }
      setActiveId(bestId);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  if (sections.length < 2) return null;

  return (
    <>
      {/* Desktop: curved line + dots */}
      <nav
        className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2 z-40"
        aria-label="Sayfa bölümleri"
        onMouseMove={(e) => mouseY.set(e.clientY)}
        onMouseLeave={() => mouseY.set(Infinity)}
      >
        <div className="relative flex flex-col items-end">
          <CurvedLine count={sections.length} />
          {sections.map((s, i) => (
            <DotItem
              key={s.id}
              section={s}
              isActive={activeId === s.id}
              mouseY={mouseY}
              onClick={() => scrollTo(s.id)}
              index={i}
              total={sections.length}
            />
          ))}
        </div>
      </nav>

      {/* Mobile: toggle button */}
      <button
        type="button"
        className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-8 h-10 bg-paper/90 border border-r-0 border-surface-2 rounded-l-lg shadow-md text-ink-500 backdrop-blur-sm"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Navigasyonu kapat" : "Sayfa bölümleri"}
        aria-expanded={mobileOpen}
      >
        <motion.span
          animate={{ rotate: mobileOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          <ChevronLeft size={14} />
        </motion.span>
      </button>

      {/* Mobile: slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-paper/95 border border-r-0 border-surface-2 rounded-l-xl shadow-xl px-5 py-4 backdrop-blur-md"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              aria-label="Sayfa bölümleri"
            >
              <ul className="flex flex-col gap-3 min-w-[140px]">
                {sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(s.id)}
                      className={[
                        "flex items-center gap-2.5 w-full text-left typography-body-sm transition-colors",
                        activeId === s.id
                          ? "text-brand-700 font-medium"
                          : "text-ink-500 hover:text-ink-900",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                          activeId === s.id ? "bg-brand-500" : "bg-ink-300",
                        ].join(" ")}
                      />
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
