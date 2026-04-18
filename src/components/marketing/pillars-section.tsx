import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "./section-header";
import { PersonaText } from "./persona-text";

type Locale = "tr" | "en";
type PillarKey = "growth" | "transform" | "build";

function PillarMark({ pillar }: { pillar: PillarKey }) {
  const stroke = "var(--color-brand-300)";
  const fill = "var(--color-brand-300)";

  if (pillar === "growth") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="w-12 h-12"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="square"
      >
        <line x1="10" y1="40" x2="10" y2="30" stroke={stroke} />
        <line x1="24" y1="40" x2="24" y2="22" stroke={stroke} />
        <line x1="38" y1="40" x2="38" y2="10" stroke={stroke} />
        <line x1="6" y1="40" x2="42" y2="40" stroke={stroke} opacity="0.6" />
      </svg>
    );
  }
  if (pillar === "transform") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="w-12 h-12"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M 8 20 A 12 12 0 0 1 32 20" stroke={stroke} />
        <path d="M 40 28 A 12 12 0 0 1 16 28" stroke={stroke} />
        <circle cx="32" cy="20" r="1.5" fill={stroke} />
        <circle cx="16" cy="28" r="1.5" fill={stroke} />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="w-12 h-12"
      fill={fill}
      fillOpacity="0.4"
    >
      <rect x="6" y="34" width="36" height="6" rx="1" />
      <rect x="10" y="22" width="28" height="6" rx="1" />
      <rect x="14" y="10" width="20" height="6" rx="1" />
    </svg>
  );
}

export async function PillarsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.pillars" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const pillars: PillarKey[] = ["growth", "transform", "build"];

  return (
    <section
      id="section-hizmetler"
      data-nav-label={locale === "tr" ? "Hizmetler" : "Services"}
      aria-labelledby="pillars-heading"
      className="bg-surface-1"
      style={{
        borderTop: "1px solid rgba(107, 115, 128, 0.12)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-28 md:py-40">
        <SectionHeader
          eyebrow={
            <PersonaText
              industrial={t("_personas.industrial.eyebrow")}
              commerce={t("_personas.commerce.eyebrow")}
            />
          }
          headline={
            <PersonaText
              industrial={t("_personas.industrial.headline")}
              commerce={t("_personas.commerce.headline")}
            />
          }
          lede={
            <PersonaText
              industrial={t("_personas.industrial.lede")}
              commerce={t("_personas.commerce.lede")}
            />
          }
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
          {pillars.map((key, idx) => {
            const services = t.raw(`${key}.services`) as string[];
            const featured = services[0];
            const rest = services.slice(1);
            const pillarName = t(`${key}.name` as const);
            const iDesc = t.raw(`_personas.industrial.${key}.description`) as string;
            const cDesc = t.raw(`_personas.commerce.${key}.description`) as string;
            return (
              <article
                key={key}
                className="relative bg-paper p-10 md:p-12 flex flex-col min-h-[680px]"
              >
                <header>
                  <PillarMark pillar={key} />
                  <span
                    className="mt-8 inline-block typography-caption text-ink-500 uppercase"
                    style={{ letterSpacing: "0.08em", fontWeight: 500 }}
                  >
                    0{idx + 1} / {pillarName.toUpperCase()}
                  </span>
                </header>

                <h3
                  id={idx === 0 ? "pillars-heading" : undefined}
                  className="typography-display-lg mt-2 text-ink-900"
                >
                  {pillarName}
                </h3>

                <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
                  <PersonaText industrial={iDesc} commerce={cDesc} />
                </p>

                <div className="mt-10">
                  <span className="typography-label uppercase tracking-widest text-ink-500">
                    {locale === "tr" ? "Öne çıkan" : "Featured"}
                  </span>
                  {featured ? (
                    <h4
                      className="typography-h3 text-ink-900 mt-4"
                      style={{ fontWeight: 500 }}
                    >
                      {featured}
                    </h4>
                  ) : null}

                  {rest.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {rest.map((service) => (
                        <li
                          key={service}
                          className="typography-body-sm text-ink-500"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="mt-auto pt-10">
                  <Link
                    href={`/${locale}/hizmetler/${key}`}
                    className="inline-flex items-center gap-2 text-brand-700 typography-body-md"
                  >
                    <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                      {tc("cta.explore")}
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
