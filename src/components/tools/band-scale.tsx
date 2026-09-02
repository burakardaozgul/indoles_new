import { neutral, semantic, teal } from "@/lib/design/tokens";
import { BAND_ORDER, BAND_THRESHOLDS, bandFor, type GeoBand } from "@/lib/tools/geo/types";

/**
 * Dört bantlı skor ölçeği — SVG, satır içi renk ve geometri.
 *
 * Tailwind sınıfı BİLİNÇLİ olarak yok: aynı bileşen sayfada (`ScoreCard`) ve
 * OG kartı şablonunda (`scripts/og/geo-card.tsx`, `renderToStaticMarkup`)
 * çizilir; şablonun Tailwind CSS'i yoktur. Renkler `tokens.ts`'ten okunur —
 * ham hex burada da yazılmaz (docs/04 §11). Eşikler `BAND_THRESHOLDS`'tan
 * gelir; eşik değişirse ölçek ve kart birlikte değişir.
 */
export const BAND_COLORS: Record<GeoBand, { soft: string; strong: string }> = {
  zayif: { soft: semantic.danger[50], strong: semantic.danger[500] },
  "gelismeye-acik": { soft: semantic.warning[50], strong: semantic.warning[500] },
  iyi: { soft: semantic.success[50], strong: semantic.success[500] },
  oncu: { soft: teal[100], strong: teal[700] },
};

export function bandSegments(): Array<{ band: GeoBand; from: number; to: number }> {
  const starts = [0, BAND_THRESHOLDS["gelismeye-acik"], BAND_THRESHOLDS.iyi, BAND_THRESHOLDS.oncu];
  return BAND_ORDER.map((band, i) => ({ band, from: starts[i]!, to: starts[i + 1] ?? 100 }));
}

const VIEW_W = 1000;
const VIEW_H = 60;
const TRACK_Y = 10;
const TRACK_H = 12;
const GAP = 4;
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

export function BandScale({
  score,
  labels,
  ariaLabel,
}: {
  /** `null` — OG "araç kartı" (`ToolCard`): henüz taranmamış, işaretçi ve aktif bant yok. */
  score: number | null;
  labels: Record<GeoBand, string>;
  ariaLabel: string;
}) {
  const active = score === null ? null : bandFor(score);
  const cx = score === null ? 0 : Math.max(0, Math.min(100, score)) * (VIEW_W / 100);
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block", overflow: "visible" }}
    >
      {bandSegments().map(({ band, from, to }) => {
        const x = from * (VIEW_W / 100) + (from === 0 ? 0 : GAP / 2);
        const w = (to - from) * (VIEW_W / 100) - (from === 0 ? GAP / 2 : GAP) + (to === 100 ? GAP / 2 : 0);
        return (
          <g key={band}>
            <rect
              data-band={band}
              x={x}
              y={TRACK_Y}
              width={w}
              height={TRACK_H}
              rx={TRACK_H / 2}
              fill={band === active ? BAND_COLORS[band].strong : BAND_COLORS[band].soft}
            />
            <text
              x={x + w / 2}
              y={VIEW_H - 8}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={18}
              letterSpacing={1.5}
              fill={band === active ? neutral.ink[900] : neutral.ink[500]}
            >
              {labels[band].toLowerCase()}
            </text>
          </g>
        );
      })}
      {score !== null ? (
        <circle
          data-part="marker"
          cx={cx}
          cy={TRACK_Y + TRACK_H / 2}
          r={10}
          fill={neutral.ink[900]}
          stroke={neutral.bgPure}
          strokeWidth={3}
        />
      ) : null}
    </svg>
  );
}
