import * as React from "react";
import { BandScale } from "@/components/tools/band-scale";
import { BAND_LABELS } from "@/components/tools/copy";
import { TOOLS } from "@/lib/content/tools";
import { neutral, teal } from "@/lib/design/tokens";
import { BAND_ORDER, bandFor, type GeoBand } from "@/lib/tools/geo/types";
import type { Locale } from "@/lib/content/types";

/**
 * OG kartı şablonu (ADR-031) — 1200×630, satır içi stil (Tailwind yok;
 * Playwright boş bir sayfada basar). Taranan adres kartta YOK: `og:title`
 * taşır, böylece 101 kart yeter. Renkler tokens.ts'ten.
 */
const W = 1200;
const H = 630;
const DISPLAY = "'Lexend', 'Inter', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: W, height: H, background: neutral.bg, color: neutral.ink[900], fontFamily: DISPLAY, padding: 64, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
      {children}
      <div style={{ position: "absolute", left: 64, bottom: 56, fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: neutral.ink[500] }}>
        INDOLES · indoles.com.tr
      </div>
    </div>
  );
}

export function GeoCard({ score, locale }: { score: number; locale: Locale }) {
  const tool = TOOLS[0]!;
  const band: GeoBand = bandFor(score);
  const labels = Object.fromEntries(BAND_ORDER.map((b) => [b, BAND_LABELS[b][locale]])) as Record<GeoBand, string>;
  return (
    <Shell>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: teal[700] }}>
        {tool.name[locale]}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 32 }}>
        <div style={{ fontSize: 260, fontWeight: 600, lineHeight: 0.85, letterSpacing: -12 }}>{score}</div>
        <div style={{ paddingBottom: 18 }}>
          <div style={{ fontSize: 44, color: neutral.ink[500] }}>/100</div>
          <div style={{ marginTop: 16, display: "inline-block", padding: "10px 22px", borderRadius: 999, border: `2px solid ${teal[700]}`, fontFamily: MONO, fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>
            {BAND_LABELS[band][locale]}
          </div>
        </div>
      </div>
      <div style={{ width: 1072, marginBottom: 48 }}>
        <BandScale score={score} labels={labels} ariaLabel="" />
      </div>
    </Shell>
  );
}

export function ToolCard({ locale }: { locale: Locale }) {
  const tool = TOOLS[0]!;
  const labels = Object.fromEntries(BAND_ORDER.map((b) => [b, BAND_LABELS[b][locale]])) as Record<GeoBand, string>;
  return (
    <Shell>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: teal[700] }}>{tool.eyebrow[locale]}</div>
      <div>
        <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>{tool.name[locale]}</div>
        <div style={{ marginTop: 20, fontSize: 30, lineHeight: 1.35, color: neutral.ink[700], maxWidth: 960, fontFamily: "'Inter', system-ui, sans-serif" }}>{tool.lede[locale]}</div>
        <div style={{ marginTop: 28, display: "flex", gap: 36, fontFamily: MONO, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: neutral.ink[500] }}>
          {tool.proof.map((p) => <span key={p.tr}>{p[locale]}</span>)}
        </div>
      </div>
      <div style={{ width: 1072, marginBottom: 48 }}>
        <BandScale score={null} labels={labels} ariaLabel="" />
      </div>
    </Shell>
  );
}
