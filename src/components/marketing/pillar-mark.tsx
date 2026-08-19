import * as React from "react";
import type { Pillar } from "@/lib/content/types";

/**
 * Pillar imzaları — Growth · Transform · Build.
 *
 * `service-illustration.tsx` ve `package-diagram.tsx` ile aynı dil: teal +
 * gold, stroke sabit, dekoratif. Fark ölçek: bunlar tek bir hizmetin veya
 * paketin değil, bir **disiplinin** şeklini anlatır.
 *
 *   Growth    — tek gövdeden dışa açılan yelpaze (aynı kaynaktan çoğalan kanal)
 *   Transform — iç içe geçen iki sistem (eskisi ve yenisi birbirine kenetlenir)
 *   Build     — katman katman yükselen yapı (her katman altındakine dayanır)
 *
 * Üçü **aynı renk ailesinden** ayrışır: teal skalasının üç kademesi. ADR-015'in
 * tek accent kuralı bozulmuyor — ikinci bir marka rengi eklenmiyor, aynı
 * skalanın içinde kalınıyor. Renk yalnız çizime uygulanır; metin her zaman
 * `ink` kalır, aksi hâlde `teal-300` kontrast eşiğini geçemezdi.
 */

/** teal-700 · teal-500 · teal-400 — üç kademe, hepsi aynı skalada */
const TONE: Record<Pillar, string> = {
  growth: "#2C5566",
  transform: "#4F8294",
  build: "#6E9FAF",
};

/** gold-500 — her imzada tek bir vurgu noktası */
const G = "#B8956A";

const SHAPES: Record<Pillar, (c: string) => React.ReactElement> = {
  // Growth — tek gövde, dışa açılan yelpaze
  growth: (c) => (
    <g stroke={c} fill="none" strokeWidth="1.2">
      <path d="M18 60 H 46" strokeWidth="1.6" />
      {[
        "M46 60 C 70 60, 78 22, 104 22 H 122",
        "M46 60 C 70 60, 78 41, 104 41 H 118",
        "M46 60 C 70 60, 78 79, 104 79 H 118",
        "M46 60 C 70 60, 78 98, 104 98 H 122",
      ].map((d, i) => (
        <path key={d} d={d} opacity={0.35 + i * 0.12} />
      ))}
      <path d="M46 60 H 116" strokeWidth="1.6" />
      <circle cx="46" cy="60" r="3.5" fill={c} stroke="none" />
      <circle cx="116" cy="60" r="4" fill={G} stroke="none" />
    </g>
  ),

  // Transform — iç içe geçen iki sistem
  transform: (c) => (
    <g stroke={c} fill="none" strokeWidth="1.2">
      <circle cx="54" cy="60" r="30" opacity="0.8" />
      <circle cx="90" cy="60" r="30" opacity="0.45" />
      {/* kenetlenme bölgesi */}
      <path
        d="M72 34 A 30 30 0 0 0 72 86 A 30 30 0 0 0 72 34"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <circle cx="54" cy="60" r="3" fill={c} stroke="none" />
      <circle cx="90" cy="60" r="3" fill={c} stroke="none" />
      <circle cx="72" cy="60" r="4" fill={G} stroke="none" />
      <circle cx="72" cy="60" r="42" strokeDasharray="2 5" opacity="0.25" />
    </g>
  ),

  // Build — katman katman yükselen yapı
  build: (c) => (
    <g stroke={c} fill="none" strokeWidth="1.2">
      {[
        [26, 92, 92],
        [36, 74, 72],
        [46, 56, 52],
        [56, 38, 32],
      ].map(([x, y, w], i) => (
        <rect
          key={y}
          x={x}
          y={y}
          width={w}
          height="14"
          rx="2"
          opacity={0.35 + i * 0.2}
          strokeWidth={i === 3 ? 1.6 : 1.2}
        />
      ))}
      {/* taşıyıcı eksen: her katman altındakine dayanır */}
      <path d="M72 106 V 38" strokeDasharray="2 4" opacity="0.35" />
      <path d="M20 110 H 124" opacity="0.4" />
      <circle cx="72" cy="45" r="4" fill={G} stroke="none" />
    </g>
  ),
};

export function PillarMark({
  pillar,
  className,
}: {
  pillar: Pillar;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 140 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES[pillar](TONE[pillar])}
    </svg>
  );
}

/** Pillar'ın teal kademesi — ince ayraç ve hairline gibi dekoratif yerlerde. */
export function pillarTone(pillar: Pillar): string {
  return TONE[pillar];
}
