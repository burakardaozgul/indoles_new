import type React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "./section-header";
import { PersonaText } from "./persona-text";
import { BrandWatermark } from "@/components/brand/brand-watermark";
import { FinalCTABookingCard } from "./FinalCTABookingCard";

type PathKey = "chat" | "booking" | "brief";

type Path = {
  commitment: string;
  label: string;
  description: React.ReactNode;
  meta: string;
  cta: React.ReactNode;
};

export async function FinalCTASection({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "home.finalCta" });

  const pathKeys: PathKey[] = ["chat", "booking", "brief"];

  const paths: Array<{ key: PathKey; path: Path; href: string }> = pathKeys.map(
    (key) => ({
      key,
      path: {
        commitment: t(`paths.${key}.commitment` as const),
        label: t(`paths.${key}.label` as const),
        meta: t(`paths.${key}.meta` as const),
        description: (
          <PersonaText
            industrial={
              t.raw(`_personas.industrial.paths.${key}.description`) as string
            }
            commerce={
              t.raw(`_personas.commerce.paths.${key}.description`) as string
            }
          />
        ),
        cta: (
          <PersonaText
            industrial={t.raw(`_personas.industrial.paths.${key}.cta`) as string}
            commerce={t.raw(`_personas.commerce.paths.${key}.cta`) as string}
          />
        ),
      },
      href:
        key === "chat"
          ? `/${locale}#chat`
          : key === "booking"
            ? `/${locale}/iletisim`
            : `/app/brief/yeni`,
    })
  );

  return (
    <section
      id="section-baslayin"
      data-nav-label={locale === "tr" ? "Başlayın" : "Get Started"}
      aria-labelledby="final-cta-heading"
      className="relative bg-surface-1 overflow-hidden"
      style={{
        borderTop: "1px solid rgba(107, 115, 128, 0.12)",
      }}
    >
      <BrandWatermark tone="light" side="left" opacity={0.03} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 py-28 md:py-36">
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

        <div
          id="final-cta-heading"
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {paths.map(({ key, path, href }) => {
            if (key === "booking") {
              return <FinalCTABookingCard key={key} path={path} />;
            }
            return (
              <Link
                key={key}
                href={href}
                className="group relative flex flex-col rounded-2xl p-10 md:p-12 min-h-[380px] border transition-colors bg-paper text-ink-900 border-surface-2 hover:bg-surface-2/60"
              >
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {path.commitment}
                </span>
                <div className="mt-10">
                  <h3 className="typography-h1 text-ink-900">{path.label}</h3>
                  <p className="typography-body-md mt-5 max-w-prose-editorial text-ink-700">
                    {path.description}
                  </p>
                </div>
                <div className="mt-auto pt-10 space-y-5">
                  <div className="typography-caption text-ink-500">
                    {path.meta}
                  </div>
                  <div className="inline-flex items-center gap-3 typography-body-md text-brand-700">
                    <span className="underline underline-offset-4 decoration-brand-300 group-hover:decoration-brand-500">
                      {path.cta}
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
