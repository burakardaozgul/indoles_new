import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PACKAGES } from "@/lib/content/packages";
import { getPillar } from "@/lib/content/pillars";

export default async function PackagesIndex({
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
          { label: tCommon("nav.packages") },
        ]}
        eyebrow={loc === "tr" ? "Paketler" : "Packages"}
        title={
          loc === "tr"
            ? "Sabit kapsam. Sabit süre. Sabit fiyat."
            : "Fixed scope. Fixed time. Fixed price."
        }
        lede={
          loc === "tr"
            ? "Büyük iş birliklerinin giriş kapısı. Küçük taahhütle giriş, somut değerle devam."
            : "The front door to larger engagements. A small commitment in, concrete value out."
        }
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-24">
          <ol className="border-t border-surface-2">
            {PACKAGES.map((pkg, idx) => {
              const pillar = getPillar(pkg.pillar);
              const price =
                loc === "tr"
                  ? `₺ ${pkg.pricing.TRY.toLocaleString("tr-TR")}`
                  : `€ ${pkg.pricing.EUR.toLocaleString("en-US")}`;
              return (
                <li key={pkg.slug[loc]} className="border-b border-surface-2">
                  <Link
                    href={`/${locale}/paketler/${pkg.slug[loc]}`}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-14 px-0 md:px-4 -mx-0 md:-mx-4 rounded-lg hover:bg-surface-1 transition-colors"
                  >
                    <div className="md:col-span-1 typography-label uppercase tracking-widest text-ink-500">
                      0{idx + 1}
                    </div>
                    <div className="md:col-span-4">
                      <h2 className="typography-display-lg text-ink-900 group-hover:text-brand-800 transition-colors">
                        {pkg.name[loc]}
                      </h2>
                      <div className="mt-4 flex items-center gap-3 typography-caption">
                        <span className="text-brand-700">
                          {pillar?.name[loc]}
                        </span>
                        <span
                          className="w-px h-3 bg-surface-3"
                          aria-hidden
                        />
                        <span className="text-ink-500">
                          {pkg.durationWeeks}{" "}
                          {loc === "tr" ? "hafta" : "weeks"}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-5">
                      <p className="typography-body-lg text-ink-700 max-w-prose-editorial">
                        {pkg.outcome[loc]}
                      </p>
                    </div>
                    <div className="md:col-span-2 md:text-right">
                      <div
                        className="typography-h2 text-ink-900"
                        style={{ fontVariationSettings: '"opsz" 9' }}
                      >
                        {price}
                      </div>
                      <div className="typography-caption text-ink-500 mt-1">
                        {loc === "tr" ? "başlangıç" : "starting"}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
