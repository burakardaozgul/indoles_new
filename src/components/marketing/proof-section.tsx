import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "./section-header";
import { PersonaText } from "./persona-text";

type Metric = { value: string; label: string };
type OtherCase = { problemType: string; title: string; pillar: string };

function MetricsPanel({
  metrics,
  caseHref,
  readCaseLabel,
}: {
  metrics: Metric[];
  caseHref: string;
  readCaseLabel: string;
}) {
  return (
    <dl className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-3 border border-surface-2 rounded-2xl overflow-hidden">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-surface-2 p-8 flex flex-col justify-between min-h-[240px]"
        >
          <dd
            className="typography-display-xl text-brand-700"
            style={{
              fontVariationSettings: '"opsz" 9',
              fontSize: "clamp(3rem, 4vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            {m.value}
          </dd>
          <div className="mt-8 space-y-3">
            <dt className="typography-body-md text-ink-500">{m.label}</dt>
            <Link
              href={caseHref}
              className="inline-flex items-center gap-1.5 typography-caption text-brand-700 hover:text-brand-500 transition-colors"
            >
              <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                {readCaseLabel}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      ))}
    </dl>
  );
}

export async function ProofSection({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "home.proof" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const featured = {
    clientLabel: t("featured.clientLabel"),
    title: t("featured.title"),
    pillar: t("featured.pillar"),
    metrics: t.raw("featured.metrics") as Metric[],
  };
  const others = t.raw("others") as OtherCase[];
  const featuredCaseSlug = "uretim-planlama-dijitallestirme";
  const featuredCaseHref = `/${locale}/vakalar/${featuredCaseSlug}`;
  const readCaseLabel = locale === "tr" ? "Vakayı oku" : "Read case";
  const disclaimer =
    locale === "tr"
      ? "Temsili veriler. Gerçek vaka çalışmaları yakında yayınlanacak."
      : "Illustrative data. Real case studies coming soon.";

  return (
    <section
      id="section-basarilar"
      data-nav-label={locale === "tr" ? "Başarılar" : "Results"}
      aria-labelledby="proof-heading"
      className="bg-paper"
      style={{
        borderTop: "1px solid rgba(107, 115, 128, 0.12)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-28 md:py-36">
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

        <article
          id="proof-heading"
          className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start"
        >
          <div className="md:col-span-4 max-w-[420px]">
            <div className="flex items-center gap-4 flex-wrap">
              <span
                className="typography-label uppercase text-brand-500"
                style={{ fontWeight: 600, letterSpacing: "0.08em" }}
              >
                {featured.clientLabel}
              </span>
              <span className="w-px h-4 bg-surface-3" aria-hidden />
              <span className="typography-label uppercase tracking-widest text-brand-700">
                {featured.pillar}
              </span>
            </div>
            <h3 className="typography-display-lg mt-6 text-ink-900">
              {featured.title}
            </h3>
            <p className="typography-body-md text-ink-700 mt-6">
              <PersonaText
                industrial={t("_personas.industrial.featured.summary")}
                commerce={t("_personas.commerce.featured.summary")}
              />
            </p>
            <Link
              href={`/${locale}/vakalar`}
              className="inline-flex items-center gap-2 text-brand-700 typography-body-md mt-8"
            >
              <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                {tc("cta.viewAll")}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="md:col-span-8">
            <MetricsPanel
              metrics={featured.metrics}
              caseHref={featuredCaseHref}
              readCaseLabel={readCaseLabel}
            />
            <p
              className="mt-4 typography-caption text-ink-300"
              style={{ fontSize: "0.75rem" }}
            >
              {disclaimer}
            </p>
          </div>
        </article>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {others.map((o) => (
            <article
              key={o.title}
              className="group bg-paper border border-surface-2 rounded-2xl p-8 md:p-10 flex flex-col min-h-[280px] hover:bg-surface-1 transition-colors"
            >
              <header className="flex items-center justify-between">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {o.problemType}
                </span>
                <span className="typography-caption text-brand-700">
                  {o.pillar}
                </span>
              </header>
              <h3 className="typography-h2 mt-8 text-ink-900">{o.title}</h3>
              <div className="mt-auto pt-8">
                <span className="typography-body-sm text-ink-500 group-hover:text-brand-700 transition-colors inline-flex items-center gap-2">
                  <span>{tc("cta.view")}</span>
                  <span aria-hidden>→</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
