"use client";

import * as React from "react";

/**
 * Vaka sayfasının ölçüm bandı (ADR-019).
 *
 * Sitedeki tek koyu iç sayfa bölümü — gerekçesi kontrast: vakanın kanıtı
 * sayfanın tek vurgu anıdır (docs/04 §12.10). Vizyon bölümüyle aynı malzemeyi
 * kullanır: teal-950 zemin, gold eyebrow, sayaç animasyonu.
 *
 * Sayaç, `value` içindeki ilk sayıyı bulup 0'dan hedefe sayar; sayı dışındaki
 * önek/sonek ("+%", "M $", "~1:") sabit basılır. Sayı bulunamazsa değer
 * animasyonsuz görünür. `prefers-reduced-motion` hedefe atlar.
 */

type Metric = {
  value: string;
  label: string;
  context?: string | undefined;
};

/** "1,5M $" → { prefix: "", num: 1.5, decimals: 1, suffix: "M $" } */
function parseValue(value: string) {
  const m = value.match(/^(.*?)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const raw = m[2]!;
  const decimalSep = raw.includes(",") ? "," : ".";
  const num = Number(raw.replace(",", "."));
  const decimals = raw.includes(",") || raw.includes(".")
    ? raw.split(/[.,]/)[1]!.length
    : 0;
  return { prefix: m[1]!, num, decimals, decimalSep, suffix: m[3]! };
}

function CountUp({ value, start }: { value: string; start: boolean }) {
  const parsed = React.useMemo(() => parseValue(value), [value]);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!start || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, parsed]);

  if (!parsed) return <span className="tabular">{value}</span>;

  const current = (parsed.num * progress).toFixed(parsed.decimals);
  return (
    <span className="tabular">
      {parsed.prefix}
      {current.replace(".", parsed.decimalSep)}
      {parsed.suffix}
    </span>
  );
}

export function CaseMetricBand({
  eyebrow,
  metrics,
}: {
  eyebrow: string;
  metrics: Metric[];
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label={eyebrow}
      className="bg-teal-950"
      style={{ colorScheme: "dark" }}
    >
      <div className="ds-container py-20 md:py-24">
        <span className="eyebrow eyebrow-gold">{eyebrow}</span>
        {/* 3 metrikli vaka geniş ekranda 3 kolona oturur; 4+ metrik 4 kolon */}
        <dl
          className={`mt-12 grid grid-cols-2 gap-y-12 ${
            metrics.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {metrics.map((m, i) => (
            <div
              key={m.label}
              // Enstrüman paneli ayracı: teal-800 hairline. Mobil 2 kolonda
              // yalnız sağ hücreler, geniş ekranda ilk hücre hariç hepsi.
              // DOM sırası dt → dd (geçerli dl); görsel sıra CSS order ile
              // değer → etiket → bağlam.
              className={`flex flex-col lg:px-8 lg:first:pl-0 lg:last:pr-0 ${
                i % 2 === 1 ? "border-l border-teal-800 pl-6 lg:pl-8" : ""
              } ${i > 0 ? "lg:border-l lg:border-teal-800" : ""}`}
            >
              <dt className="typography-label order-2 mt-4 uppercase tracking-widest text-gold-400">
                {m.label}
              </dt>
              <dd
                className="typography-h1 order-1 text-white"
                style={{ fontVariationSettings: '"opsz" 9' }}
              >
                <CountUp value={m.value} start={inView} />
              </dd>
              {m.context ? (
                <dd className="typography-caption mono order-3 mt-2 text-teal-300">
                  {m.context}
                </dd>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
