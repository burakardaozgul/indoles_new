import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { getConsultantBySlug, CONSULTANTS } from "@/lib/content/consultants";
import { getPillar } from "@/lib/content/pillars";
import { ARTICLES } from "@/lib/content/articles";

export async function generateStaticParams() {
  return CONSULTANTS.flatMap((c) =>
    (["tr", "en"] as const).map((locale) => ({ locale, slug: c.slug }))
  );
}

export default async function ConsultantDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const c = getConsultantBySlug(slug);
  if (!c) notFound();

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const authoredArticles = ARTICLES.filter((a) => a.authorSlug === c.slug);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.consultants"), href: `/${locale}/danismanlar` },
          { label: c.name },
        ]}
        eyebrow={c.title[loc]}
        title={c.name}
        lede={c.shortBio[loc]}
      />

      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <aside className="md:col-span-4">
            <div className="bg-surface-1 rounded-2xl p-8 sticky top-24">
              <div className="w-20 h-20 rounded-full bg-ink-900 text-paper grid place-items-center typography-h1">
                {c.name.charAt(0)}
              </div>
              <h2 className="typography-h1 text-ink-900 mt-6">{c.name}</h2>
              <p className="typography-body-sm text-ink-500 mt-1">
                {c.title[loc]}
              </p>
              <dl className="mt-8 space-y-4">
                <div>
                  <dt className="typography-label uppercase tracking-widest text-ink-500">
                    Pillar
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
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
                  </dd>
                </div>
                <div>
                  <dt className="typography-label uppercase tracking-widest text-ink-500">
                    {loc === "tr" ? "Uzmanlık" : "Expertise"}
                  </dt>
                  <dd className="mt-2 typography-body-sm text-ink-700">
                    {c.expertise.join(" · ")}
                  </dd>
                </div>
                {c.linkedinUrl && (
                  <div>
                    <a
                      href={c.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="typography-body-sm text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                    >
                      LinkedIn →
                    </a>
                  </div>
                )}
              </dl>
              <PopupCTAButton className="mt-8 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-sm w-full">
                <Phone size={16} aria-hidden />
                {tCommon("cta.bookConsultation")}
              </PopupCTAButton>
            </div>
          </aside>

          <div className="md:col-span-8">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Biyografi" : "Biography"}
            </span>
            <div className="mt-6 space-y-6 max-w-prose-editorial">
              {c.longBio[loc].map((p, i) => (
                <p key={i} className="typography-body-lg text-ink-700">
                  {p}
                </p>
              ))}
            </div>

            {authoredArticles.length > 0 && (
              <div className="mt-16">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Yazıları" : "Articles"}
                </span>
                <ol className="mt-6 border-t border-surface-2">
                  {authoredArticles.map((a) => (
                    <li key={a.slug[loc]} className="border-b border-surface-2">
                      <Link
                        href={`/${locale}/yazilar/${a.slug[loc]}`}
                        className="group block py-6 hover:bg-surface-1 transition-colors -mx-4 px-4 rounded-lg"
                      >
                        <h3 className="typography-h3 text-ink-900 group-hover:text-brand-800">
                          {a.title[loc]}
                        </h3>
                        <p className="typography-caption text-ink-500 mt-2">
                          {a.readingMinutes}{" "}
                          {loc === "tr" ? "dk okuma" : "min read"}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
