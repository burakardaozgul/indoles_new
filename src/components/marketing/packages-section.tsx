import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "./section-header";
import { PersonaText } from "./persona-text";
import { PACKAGES } from "@/lib/content/packages";

type PackageItem = {
  slug: string;
  name: string;
  pillar: string;
  duration: string;
  priceFrom?: string;
};

export async function PackagesSection({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "home.packages" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const items = t.raw("items") as PackageItem[];
  const priceSuffix = t("priceFromSuffix");

  return (
    <section
      id="section-paketler"
      data-nav-label={locale === "tr" ? "Paketler" : "Packages"}
      aria-labelledby="packages-heading"
      className="bg-surface-1"
      style={{
        borderTop: "1px solid rgba(107, 115, 128, 0.12)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-28 md:py-36">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-8">
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
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Link
              href={`/${locale}/paketler`}
              className="inline-flex items-center gap-2 text-brand-700 typography-body-md"
            >
              <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                {tc("cta.viewAll")}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <ol id="packages-heading" className="mt-20 border-t border-surface-2">
          {items.map((item, idx) => {
            const pkgData = PACKAGES.find((p) => p.slug[locale] === item.slug);
            const outcomeI = pkgData?.outcome.industrial[locale] ?? "";
            const outcomeC = pkgData?.outcome.commerce[locale] ?? "";
            return (
              <li key={item.slug} className="border-b border-surface-2">
                <Link
                  href={`/${locale}/paketler/${item.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-12 transition-colors hover:bg-paper px-0 md:px-4 mx-0 md:-mx-4 rounded-lg"
                >
                  <div className="md:col-span-1 typography-label uppercase tracking-widest text-ink-500 self-start md:self-center">
                    0{idx + 1}
                  </div>
                  <div className="md:col-span-4">
                    <h3
                      className="text-ink-900 group-hover:text-brand-800 transition-colors"
                      style={{
                        fontFamily:
                          "var(--font-heading-serif), Georgia, serif",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        lineHeight: 1.3,
                        fontVariationSettings: '"opsz" 72',
                      }}
                    >
                      {item.name}
                    </h3>
                    <div
                      className="mt-2 typography-caption text-ink-500"
                      style={{ fontWeight: 500, letterSpacing: "0.02em" }}
                    >
                      <span>{item.duration}</span>
                      {item.priceFrom ? (
                        <>
                          <span className="mx-2" aria-hidden>
                            ·
                          </span>
                          <span>
                            {item.priceFrom} {priceSuffix}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <div
                      className="mt-1 typography-caption text-brand-700"
                      style={{ fontWeight: 500, letterSpacing: "0.02em" }}
                    >
                      {item.pillar}
                    </div>
                  </div>
                  <div className="md:col-span-6 flex items-center">
                    <p className="typography-body-md text-ink-700 max-w-prose-editorial">
                      <PersonaText industrial={outcomeI} commerce={outcomeC} />
                    </p>
                  </div>
                  <div className="md:col-span-1 flex items-center md:justify-end">
                    <span
                      aria-hidden
                      className="text-xl text-ink-500 group-hover:text-brand-500 group-hover:translate-x-1 transition-all"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
