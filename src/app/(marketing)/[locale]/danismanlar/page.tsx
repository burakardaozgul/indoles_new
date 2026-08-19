import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { CONSULTANTS_ORDERED } from "@/lib/content/consultants";
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
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
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

      <section >
        <div className="ds-container py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSULTANTS_ORDERED.map((c) => (
              <Link
                key={c.slug}
                href={`/${locale}/danismanlar/${c.slug}`}
                className="group flex min-h-[340px] flex-col rounded-xl border border-ink-200 v2-surface p-10 shadow-sm transition-shadow hover:shadow-md md:p-12"
              >
                <header className="flex items-center gap-6">
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-lg font-display text-2xl font-light text-white"
                    style={{
                      background: `linear-gradient(140deg, ${c.portraitTone}, var(--color-teal-900))`,
                    }}
                    aria-hidden="true"
                  >
                    {c.initials}
                  </div>
                  <div>
                    <h2 className="typography-h2 text-ink-900 group-hover:text-brand-800 transition-colors">
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
                        className="mono rounded-md border border-ink-200 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-teal-700"
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
