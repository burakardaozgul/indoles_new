import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "./section-header";
import { BrandWatermark } from "@/components/brand/brand-watermark";

type Path = {
  commitment: string;
  label: string;
  description: string;
  meta: string;
  cta: string;
};

export async function FinalCTASection({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "home.finalCta" });

  const chat = t.raw("paths.chat") as Path;
  const booking = t.raw("paths.booking") as Path;
  const brief = t.raw("paths.brief") as Path;

  const paths: Array<{
    key: "chat" | "booking" | "brief";
    path: Path;
    href: string;
    tone: "accent" | "primary";
  }> = [
    { key: "chat", path: chat, href: `/${locale}#chat`, tone: "accent" },
    {
      key: "booking",
      path: booking,
      href: `/${locale}/iletisim`,
      tone: "primary",
    },
    { key: "brief", path: brief, href: `/app/brief/yeni`, tone: "accent" },
  ];

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative bg-surface-1 overflow-hidden"
      style={{
        borderTop: "1px solid rgba(107, 115, 128, 0.12)",
      }}
    >
      <BrandWatermark tone="light" side="left" opacity={0.03} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 py-28 md:py-36">
        <SectionHeader
          eyebrow={t("eyebrow")}
          headline={t("headline")}
          lede={t("lede")}
        />

        <div
          id="final-cta-heading"
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {paths.map(({ key, path, href, tone }) => {
            const primary = tone === "primary";
            return (
              <Link
                key={key}
                href={href}
                className={`group relative flex flex-col rounded-2xl p-10 md:p-12 min-h-[380px] border transition-colors ${
                  primary
                    ? "bg-ink-900 text-paper border-ink-900 hover:bg-ink-700"
                    : "bg-paper text-ink-900 border-surface-2 hover:bg-surface-2/60"
                }`}
              >
                {/* Commitment label */}
                <span
                  className={`typography-label uppercase tracking-widest ${
                    primary ? "text-brand-200" : "text-ink-500"
                  }`}
                >
                  {path.commitment}
                </span>

                {/* Title + body */}
                <div className="mt-10">
                  <h3
                    className={`typography-h1 ${
                      primary ? "text-paper" : "text-ink-900"
                    }`}
                  >
                    {path.label}
                  </h3>
                  <p
                    className={`typography-body-md mt-5 max-w-prose-editorial ${
                      primary ? "text-paper/75" : "text-ink-700"
                    }`}
                  >
                    {path.description}
                  </p>
                </div>

                {/* Meta + CTA bottom */}
                <div className="mt-auto pt-10 space-y-5">
                  <div
                    className={`typography-caption ${
                      primary ? "text-brand-200" : "text-ink-500"
                    }`}
                  >
                    {path.meta}
                  </div>
                  <div
                    className={`inline-flex items-center gap-3 typography-body-md ${
                      primary ? "" : "text-brand-700"
                    }`}
                  >
                    {primary ? (
                      <span className="inline-flex items-center h-10 px-5 rounded-md bg-paper text-ink-900 font-medium group-hover:bg-paper/90 transition-colors">
                        {path.cta}
                      </span>
                    ) : (
                      <span className="underline underline-offset-4 decoration-brand-300 group-hover:decoration-brand-500">
                        {path.cta}
                      </span>
                    )}
                    {!primary && (
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    )}
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
