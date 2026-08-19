import { HERO } from "@/lib/v2/anim-config";

/**
 * Blob'u çevreleyen yörünge halkaları — hero'nun z-0 katmanında.
 *
 * Referansta bunlar blob'un merkezine oturan, gövdeden belirgin şekilde
 * büyük 2-3 ince kesik çemberdir; blob'un bir yörüngede asılı durduğu hissini
 * onlar kurar.
 *
 * Üç halka TEK bir SVG içinde: ayrı ayrı SVG'lerde her biri farklı ölçekle
 * render edildiği için aynı `stroke-dasharray` ekranda üç farklı kesik
 * boyutu üretiyordu. Tek viewBox → tek ölçek → tekdüze kesik.
 *
 * Tamamen dekoratif — `aria-hidden`.
 */
/**
 * Yarıçaplar viewBox birimindedir. Hero blob'unun yarıçapı bu ölçekte ~54
 * birim; halkalar gövdeye yakın ve birbirine sıkı yerleşir.
 */
const RINGS = [
  { rx: 66, ry: 66, opacity: 0.34 },
  { rx: 75, ry: 73, opacity: 0.26 },
  { rx: 84, ry: 79, opacity: 0.18 },
] as const;

/** Kesik deseni — kısa çizgi, dar boşluk. */
const DASH = "0.3 0.62";

export function DashedCircles() {
  return (
    <div className="v2-orbit-layer" aria-hidden="true">
      <svg
        className="v2-orbit"
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {RINGS.map((ring, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="0"
            rx={ring.rx}
            ry={ring.ry}
            stroke="currentColor"
            strokeOpacity={ring.opacity}
            strokeWidth="1"
            strokeDasharray={DASH}
            vectorEffect="non-scaling-stroke"
            className="v2-orbit-ring"
            style={{
              animationDuration: `${HERO.dashedCircleDurations[i] ?? 180}s`,
              animationDirection: i % 2 === 1 ? "reverse" : "normal",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
