import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { ARTICLES } from "@/lib/content/articles";
import { getConsultantBySlug } from "@/lib/content/consultants";

const CATEGORY_LABELS: Record<string, { tr: string; en: string }> = {
  growth: { tr: "Büyüme", en: "Growth" },
  transform: { tr: "Dönüşüm", en: "Transform" },
  build: { tr: "Yapım", en: "Build" },
  industry: { tr: "Endüstri", en: "Industry" },
};

function formatDate(iso: string, locale: "tr" | "en") {
  return new Date(iso).toLocaleDateString(
    locale === "tr" ? "tr-TR" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

export default async function ArticlesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const sorted = [...ARTICLES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const featured = sorted[0]!;
  const rest = sorted.slice(1);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.articles") },
        ]}
        eyebrow={loc === "tr" ? "Yazılar" : "Journal"}
        title={
          loc === "tr"
            ? "Danışman kaleminden."
            : "From the consultant's desk."
        }
        lede={
          loc === "tr"
            ? "Teşhis, metot, sonuç — kampanya değil. Okuması 3-5 dakika."
            : "Diagnosis, method, outcome — not campaigns. 3-5 minute reads."
        }
      />

      {/* Featured article */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-20 md:py-28">
          <Link
            href={`/${locale}/yazilar/${featured.slug[loc]}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-3">
              <span className="typography-label uppercase tracking-widest text-brand-700">
                {CATEGORY_LABELS[featured.category]![loc]}
              </span>
              <p className="typography-caption text-ink-500 mt-4">
                {formatDate(featured.publishedAt, loc)}
              </p>
              <p className="typography-caption text-ink-500 mt-1">
                {featured.readingMinutes}{" "}
                {loc === "tr" ? "dk okuma" : "min read"}
              </p>
            </div>
            <div className="md:col-span-9">
              <h2 className="typography-display-xl text-ink-900 max-w-[24ch] group-hover:text-brand-800 transition-colors">
                {featured.title[loc]}
              </h2>
              <p className="typography-body-lg text-ink-700 mt-6 max-w-prose-editorial">
                {featured.excerpt[loc]}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Other articles list */}
      <section className="bg-surface-1">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-20 md:py-28">
          <ol className="border-t border-surface-2">
            {rest.map((a) => {
              const author = getConsultantBySlug(a.authorSlug);
              return (
                <li key={a.slug[loc]} className="border-b border-surface-2">
                  <Link
                    href={`/${locale}/yazilar/${a.slug[loc]}`}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-10 md:py-12 hover:bg-paper transition-colors px-0 md:px-4 -mx-0 md:-mx-4 rounded-lg"
                  >
                    <div className="md:col-span-2 typography-label uppercase tracking-widest text-brand-700">
                      {CATEGORY_LABELS[a.category]![loc]}
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="typography-h1 text-ink-900 group-hover:text-brand-800 transition-colors">
                        {a.title[loc]}
                      </h3>
                      <p className="typography-body-md text-ink-700 mt-3 max-w-prose-editorial">
                        {a.excerpt[loc]}
                      </p>
                    </div>
                    <div className="md:col-span-3 md:text-right typography-caption text-ink-500 space-y-1">
                      <div>{formatDate(a.publishedAt, loc)}</div>
                      <div>
                        {a.readingMinutes}{" "}
                        {loc === "tr" ? "dk okuma" : "min read"}
                      </div>
                      {author && <div>{author.name}</div>}
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
