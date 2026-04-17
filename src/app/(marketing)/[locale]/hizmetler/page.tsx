import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PILLARS } from "@/lib/content/pillars";

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.services") },
        ]}
        eyebrow={loc === "tr" ? "Hizmetler" : "Services"}
        title={
          loc === "tr" ? "Üç pillar, 12 hizmet." : "Three pillars, 12 services."
        }
        lede={
          loc === "tr"
            ? "Growth, Transform ve Build. Farklı ekipler değil, birbirini besleyen aynı disiplin."
            : "Growth, Transform and Build. Not separate teams — one discipline feeding itself."
        }
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <div className="space-y-24 md:space-y-32">
            {PILLARS.map((p, idx) => (
              <article
                key={p.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16"
              >
                <div className="md:col-span-4">
                  <span className="typography-label uppercase tracking-widest text-ink-500">
                    0{idx + 1} — Pillar
                  </span>
                  <h2 className="typography-display-xl mt-4 text-ink-900">
                    {p.name[loc]}
                  </h2>
                  <p className="typography-body-lg text-ink-700 mt-4">
                    {p.tagline[loc]}
                  </p>
                  <Link
                    href={`/${locale}/hizmetler/${p.key}`}
                    className="inline-flex items-center gap-2 mt-8 text-brand-700 typography-body-md"
                  >
                    <span className="underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500">
                      {tCommon("cta.explore")}
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
                <div className="md:col-span-8">
                  <p className="typography-body-lg text-ink-700 max-w-prose-editorial">
                    {p.description[loc]}
                  </p>
                  <ul className="mt-10 border-t border-surface-2">
                    {p.services.map((s) => (
                      <li key={s.slug} className="border-b border-surface-2">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6">
                          <div className="md:col-span-5">
                            <h3 className="typography-h3 text-ink-900">
                              {s.name[loc]}
                            </h3>
                          </div>
                          <div className="md:col-span-7">
                            <p className="typography-body-sm text-ink-700">
                              {s.shortDescription[loc]}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
