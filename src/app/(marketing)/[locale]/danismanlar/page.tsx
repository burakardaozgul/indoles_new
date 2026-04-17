import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { CONSULTANTS } from "@/lib/content/consultants";
import { getPillar } from "@/lib/content/pillars";

export default async function ConsultantsIndex({
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
          { label: tCommon("nav.consultants") },
        ]}
        eyebrow={loc === "tr" ? "Danışmanlar" : "Consultants"}
        title={
          loc === "tr"
            ? "İç ekip. Küratörlü."
            : "Internal team. Curated."
        }
        lede={
          loc === "tr"
            ? "Açık marketplace değil. Freelance platformu değil. Seçilmiş, davet-temelli ekip."
            : "Not an open marketplace. Not a freelance platform. A selected, invitation-only team."
        }
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSULTANTS.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/danismanlar/${c.slug}`}
                className="group bg-surface-1 border border-surface-2 rounded-2xl p-10 md:p-12 flex flex-col min-h-[340px] hover:bg-surface-2/60 transition-colors"
              >
                <header className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-ink-900 text-paper grid place-items-center typography-h2">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="typography-h1 text-ink-900 group-hover:text-brand-800 transition-colors">
                      {c.name}
                    </h2>
                    <p className="typography-body-sm text-ink-500 mt-1">
                      {c.title[loc]}
                    </p>
                  </div>
                </header>
                <p className="typography-body-md text-ink-700 mt-8 max-w-prose-editorial">
                  {c.shortBio[loc]}
                </p>
                <div className="mt-auto pt-8 flex flex-wrap gap-2">
                  {c.pillars.map((p) => {
                    const pillar = getPillar(p);
                    return (
                      <span
                        key={p}
                        className="typography-caption text-brand-700 border border-surface-3 rounded-full px-3 py-1"
                      >
                        {pillar?.name[loc]}
                      </span>
                    );
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
