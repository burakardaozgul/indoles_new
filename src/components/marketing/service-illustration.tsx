import * as React from "react";

/** teal-700 */
const T = "#2C5566";
/** gold-500 — yalnızca vurgu elemanı */
const G = "#B8956A";

/**
 * Hizmet kartlarının geometrik illüstrasyonları.
 *
 * Fotoğraf veya ikon seti değil: her biri hizmetin mekaniğini anlatan tek bir
 * diyagram. Yalnızca teal + gold kullanır, stroke ağırlığı 1–1.5px sabittir.
 * Tamamı dekoratif — `aria-hidden` ile sunulur.
 */
export function ServiceIllustration({ index }: { index: number }) {
  const variants: React.ReactElement[] = [
    // 01 — eş merkezli halkalar: kimlik
    <g key="1" stroke={T} fill="none" strokeWidth="1">
      {[10, 25, 40, 55, 70].map((r, i) => (
        <circle key={r} cx="100" cy="70" r={r} opacity={0.7 - i * 0.1} />
      ))}
      <circle cx="100" cy="70" r="3" fill={T} />
      <circle cx="100" cy="70" r="82" strokeDasharray="2 4" opacity="0.3" />
    </g>,
    // 02 — yeni pazar rotası
    <g key="2" stroke={T} fill="none" strokeWidth="1">
      <path d="M20 100 Q 60 40, 100 70 T 180 40" strokeWidth="1.4" />
      <path d="M20 120 Q 70 80, 110 95 T 180 70" opacity="0.5" />
      <circle cx="100" cy="70" r="4" fill={G} />
      <circle cx="180" cy="40" r="3" fill={T} />
    </g>,
    // 03 — ses dalgaları
    <g key="3" stroke={T} fill="none" strokeWidth="1">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M20 70 Q 100 ${30 + i * 5}, 180 70`} opacity={0.15 + i * 0.12} />
      ))}
    </g>,
    // 04 — grid + bağlantı
    <g key="4" stroke={T} fill="none">
      {[0, 1, 2, 3].map((x) =>
        [0, 1, 2].map((y) => (
          <circle key={`${x}-${y}`} cx={40 + x * 40} cy={30 + y * 35} r="2.5" fill={T} opacity="0.5" />
        )),
      )}
      <path d="M40 30 L 160 100 M 40 100 L 160 30" strokeWidth="1.2" />
      <path d="M80 65 L 120 65 L 120 100" strokeWidth="1.4" stroke={G} />
    </g>,
    // 05 — yol haritası
    <g key="5" stroke={T} strokeWidth="1" fill="none">
      <line x1="10" y1="70" x2="190" y2="70" strokeDasharray="2 3" opacity="0.4" />
      {[20, 60, 100, 140, 180].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="70" r={i === 2 ? 6 : 4} fill={i === 2 ? G : T} />
          <line x1={x} y1="70" x2={x} y2={i % 2 ? "50" : "90"} />
        </g>
      ))}
    </g>,
    // 06 — mimari katmanlar
    <g key="6" stroke={T} fill="none">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={40 + i * 5}
          y={30 + i * 16}
          width={120 - i * 10}
          height="14"
          opacity={0.9 - i * 0.2}
          fill={i === 0 ? T : "#FFFFFF"}
          stroke={T}
        />
      ))}
    </g>,
    // 07 — sinir ağı
    <g key="7" stroke={T} fill="none" strokeWidth="0.8" opacity="0.6">
      {[0, 1, 2].map((c) =>
        [0, 1, 2, 3].map((r) => (
          <circle key={`${c}-${r}`} cx={40 + c * 60} cy={25 + r * 30} r="3" fill={T} />
        )),
      )}
      {[0, 1, 2, 3].map((i) =>
        [0, 1, 2, 3].map((j) => (
          <line key={`a-${i}-${j}`} x1="40" y1={25 + i * 30} x2="100" y2={25 + j * 30} />
        )),
      )}
      {[0, 1, 2, 3].map((i) =>
        [0, 1, 2, 3].map((j) => (
          <line key={`b-${i}-${j}`} x1="100" y1={25 + i * 30} x2="160" y2={25 + j * 30} />
        )),
      )}
    </g>,
    // 08 — sütun + trend
    <g key="8">
      {[30, 50, 35, 70, 55, 85, 65].map((h, i) => (
        <rect key={i} x={20 + i * 22} y={110 - h} width="12" height={h} fill={T} opacity={0.25 + i * 0.08} />
      ))}
      <path
        d="M26 90 L 48 70 L 70 85 L 92 50 L 114 65 L 136 35 L 158 55"
        stroke={G}
        strokeWidth="1.5"
        fill="none"
      />
    </g>,
    // 09 — çark + insan
    <g key="9" stroke={T} fill="none" strokeWidth="1">
      <circle cx="75" cy="70" r="30" />
      <circle cx="75" cy="70" r="10" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={75 + Math.cos(a) * 30}
            y1={70 + Math.sin(a) * 30}
            x2={75 + Math.cos(a) * 38}
            y2={70 + Math.sin(a) * 38}
          />
        );
      })}
      <circle cx="140" cy="55" r="8" fill={G} stroke="none" />
      <path d="M125 105 Q 140 75, 155 105" fill={G} stroke="none" />
    </g>,
    // 10 — dijital ikiz
    <g key="10" stroke={T} fill="none">
      <rect x="30" y="40" width="50" height="60" />
      <rect x="30" y="40" width="50" height="60" transform="translate(8 -8)" opacity="0.4" />
      <rect x="120" y="40" width="50" height="60" strokeDasharray="3 3" />
      <path d="M80 70 L 120 70" strokeDasharray="2 2" stroke={G} />
      <circle cx="100" cy="70" r="3" fill={G} stroke="none" />
    </g>,
    // 11 — büyüme ağacı
    <g key="11" stroke={T} fill="none" strokeWidth="1">
      <line x1="100" y1="120" x2="100" y2="70" />
      <line x1="100" y1="90" x2="60" y2="60" />
      <line x1="100" y1="80" x2="140" y2="50" />
      <line x1="60" y1="60" x2="40" y2="40" />
      <line x1="60" y1="60" x2="70" y2="30" />
      <line x1="140" y1="50" x2="160" y2="30" />
      <circle cx="40" cy="40" r="4" fill={T} />
      <circle cx="70" cy="30" r="4" fill={T} />
      <circle cx="160" cy="30" r="5" fill={G} />
      <circle cx="100" cy="120" r="4" fill={T} />
    </g>,
    // 12 — gömülü ekip (kesişim)
    <g key="12" stroke={T} fill="none">
      <circle cx="80" cy="70" r="34" fill="rgba(44,85,102,0.08)" />
      <circle cx="120" cy="70" r="34" fill="rgba(184,149,106,0.12)" />
      <line x1="92" y1="70" x2="108" y2="70" strokeWidth="1.4" />
    </g>,
    // 13 — kaynak gösterilme: üç sayfa tek cevaba akar, biri alıntılanır (GEO)
    <g key="13" stroke={T} fill="none" strokeWidth="1">
      {[35, 70, 105].map((y, i) => (
        <g key={y} opacity={i === 1 ? 1 : 0.5}>
          <rect x="22" y={y - 9} width="44" height="18" />
          <line x1="28" y1={y - 2} x2="58" y2={y - 2} opacity="0.5" />
          <line x1="28" y1={y + 3} x2="50" y2={y + 3} opacity="0.5" />
        </g>
      ))}
      <path d="M66 35 C 100 35, 110 60, 128 64" strokeDasharray="2 3" opacity="0.45" />
      <path d="M66 105 C 100 105, 110 80, 128 76" strokeDasharray="2 3" opacity="0.45" />
      <line x1="66" y1="70" x2="128" y2="70" stroke={G} strokeWidth="1.4" />
      <circle cx="66" cy="70" r="3" fill={G} stroke="none" />
      <rect x="128" y="44" width="52" height="52" rx="10" strokeWidth="1.4" />
      <line x1="138" y1="60" x2="170" y2="60" opacity="0.6" />
      <line x1="138" y1="70" x2="164" y2="70" opacity="0.6" />
      <line x1="138" y1="80" x2="168" y2="80" opacity="0.6" />
    </g>,
  ];

  return (
    <svg viewBox="0 0 200 140" width="100%" height="100%" aria-hidden="true" focusable="false">
      {variants[index % variants.length]}
    </svg>
  );
}
