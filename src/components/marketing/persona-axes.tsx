import Link from "next/link";

export type Axis = {
  eyebrow: string;
  label: string;
  description: string;
  topics: string[];
  pillar: string;
  duration: string;
  cta: string;
};

export function PersonaAxes({
  locale,
  industrial,
  commerce,
}: {
  locale: "tr" | "en";
  industrial: Axis;
  commerce: Axis;
}) {
  const industrialHref =
    locale === "tr" ? "/tr/hizmetler/transform" : "/en/services/transform";
  const commerceHref =
    locale === "tr" ? "/tr/hizmetler/growth" : "/en/services/growth";

  return (
    <section
      aria-labelledby="persona-axes-heading"
      className="mx-auto max-w-[1120px] px-6 md:px-12 pt-6 pb-24"
    >
      <h2 id="persona-axes-heading" className="sr-only">
        Persona
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
        <AxisCard axis={industrial} href={industrialHref} tone="industrial" />
        <AxisCard axis={commerce} href={commerceHref} tone="commerce" />
      </div>
    </section>
  );
}

function AxisCard({
  axis,
  href,
  tone,
}: {
  axis: Axis;
  href: string;
  tone: "industrial" | "commerce";
}) {
  const isA = tone === "industrial";
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between bg-paper hover:bg-surface-1 transition-colors duration-300 ease-out p-10 md:p-14 min-h-[440px] focus-visible:outline-none"
    >
      {/* A / B badge — köşeye yapışık quarter-circle, ink-900 zemin, paper harf */}
      <span
        aria-hidden
        className={`absolute top-0 ${isA ? "left-0" : "right-0"} w-24 h-24 md:w-28 md:h-28 bg-ink-900 text-paper flex items-center justify-center group-hover:bg-ink-700 transition-colors`}
        style={{
          borderBottomRightRadius: isA ? "100%" : "0",
          borderBottomLeftRadius: isA ? "0" : "100%",
          fontFamily: "var(--font-heading-serif), Georgia, serif",
          fontSize: "2.5rem",
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontVariationSettings: '"opsz" 9',
          paddingBottom: "0.75rem",
          paddingRight: isA ? "0.75rem" : "0",
          paddingLeft: isA ? "0" : "0.75rem",
        }}
      >
        {isA ? "A" : "B"}
      </span>

      <div className="mt-28 md:mt-32">
        <p className="typography-label uppercase tracking-widest text-ink-500">
          {axis.eyebrow}
        </p>
        <h3 className="typography-display-lg text-ink-900 max-w-[22ch] mt-4">
          {axis.label}
        </h3>
        <p className="typography-body-md text-ink-700 mt-5 max-w-prose-editorial">
          {axis.description}
        </p>

        {/* Topics — dot-separated inline */}
        <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 typography-caption text-ink-500">
          {axis.topics.map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              <span>{t}</span>
              {i < axis.topics.length - 1 ? (
                <span aria-hidden className="text-ink-300">
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer strip — meta + CTA */}
      <div className="mt-10 pt-6 border-t border-surface-2 flex items-center justify-between gap-4">
        <div
          className="typography-caption text-ink-500"
          style={{ fontWeight: 500, letterSpacing: "0.02em" }}
        >
          <span className="text-brand-700">{axis.pillar}</span>
          <span className="mx-2" aria-hidden>
            ·
          </span>
          <span>{axis.duration}</span>
        </div>
        <span className="inline-flex items-center gap-2 text-brand-700 typography-body-sm">
          <span className="underline underline-offset-4 decoration-brand-300 group-hover:decoration-brand-500">
            {axis.cta}
          </span>
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
