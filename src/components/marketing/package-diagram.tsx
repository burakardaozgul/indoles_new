import * as React from "react";

/** teal-700 */
const T = "#2C5566";
/** gold-500 — yalnızca vurgu elemanı */
const G = "#B8956A";

/**
 * Paketlerin geometrik şemaları.
 *
 * `service-illustration.tsx` ile aynı dil: teal + gold, stroke 1–1.5px,
 * dekoratif (`aria-hidden`). Fark, anlattıkları şey: hizmet diyagramları bir
 * disiplinin mekaniğini gösteriyor, bunlar bir **taahhüdün şeklini**.
 *
 * Dört şema, artan taahhüt sırasına göre okunacak biçimde çizildi:
 *
 *   teşhis  — dağınık noktalardan tek bir okunur çizgi çıkar
 *   sprint  — tek daldan üç kanal ayrılır, biri kalınlaşır
 *   pilot   — kapalı bir döngü: kur, ölç, karar ver
 *   inşa    — katman katman yükselen yapı
 *
 * Renkle ayrım yok (ADR-015 tek accent). Ayrım geometrinin kendisinde:
 * şemalar soldan sağa okununca taahhüt büyüyor.
 */
export type PackageDiagramKind = "diagnose" | "sprint" | "pilot" | "build";

const SHAPES: Record<PackageDiagramKind, React.ReactElement> = {
  // Teşhis — dağınık ölçüm noktaları, aralarından geçen tek okunur eğri
  diagnose: (
    <g stroke={T} fill="none" strokeWidth="1">
      {[
        [24, 74],
        [44, 52],
        [60, 80],
        [80, 44],
        [98, 66],
        [118, 38],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" opacity="0.45" />
      ))}
      <path
        d="M20 78 C 45 70, 55 56, 78 52 S 112 40, 132 34"
        strokeWidth="1.5"
      />
      <circle cx="132" cy="34" r="3.5" fill={G} stroke="none" />
      <path d="M20 92 H 132" strokeDasharray="2 4" opacity="0.3" />
    </g>
  ),

  // Sprint — tek gövdeden üç kanal, biri seçilip kalınlaşıyor
  sprint: (
    <g stroke={T} fill="none" strokeWidth="1">
      <path d="M20 64 H 52" strokeWidth="1.5" />
      <path d="M52 64 C 72 64, 78 34, 100 34 H 128" opacity="0.35" />
      <path d="M52 64 C 72 64, 78 64, 100 64 H 132" strokeWidth="1.8" />
      <path d="M52 64 C 72 64, 78 94, 100 94 H 124" opacity="0.35" />
      <circle cx="52" cy="64" r="3" fill={T} stroke="none" />
      <circle cx="132" cy="64" r="3.5" fill={G} stroke="none" />
    </g>
  ),

  // Pilot — kapalı döngü: kur → ölç → karar
  pilot: (
    <g stroke={T} fill="none" strokeWidth="1">
      <path
        d="M40 64 A 36 30 0 1 1 76 94"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M76 94 L 68 88 M76 94 L 70 100" strokeWidth="1.5" strokeLinecap="round" />
      {[
        [40, 64],
        [76, 34],
        [112, 64],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill={T} stroke="none" />
      ))}
      <rect x="96" y="80" width="36" height="24" rx="2" opacity="0.4" />
      <path d="M104 96 L 112 88 L 120 92 L 128 84" opacity="0.7" />
      <circle cx="76" cy="34" r="7" strokeDasharray="2 3" opacity="0.4" />
      <circle cx="128" cy="84" r="3" fill={G} stroke="none" />
    </g>
  ),

  // İnşa — katman katman yükselen yapı
  build: (
    <g stroke={T} fill="none" strokeWidth="1">
      {[
        [28, 96, 104],
        [40, 78, 80],
        [52, 60, 56],
        [64, 42, 32],
      ].map(([x, y, w], i) => (
        <rect
          key={y}
          x={x}
          y={y}
          width={w}
          height="14"
          rx="2"
          opacity={0.35 + i * 0.18}
          strokeWidth={i === 3 ? 1.5 : 1}
        />
      ))}
      <path d="M20 116 H 140" strokeDasharray="2 4" opacity="0.3" />
      <circle cx="80" cy="49" r="3.5" fill={G} stroke="none" />
    </g>
  ),
};

export function PackageDiagram({
  kind,
  className,
}: {
  kind: PackageDiagramKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 130"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES[kind]}
    </svg>
  );
}
