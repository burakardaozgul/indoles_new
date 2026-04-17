import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { getArticleBySlug, ARTICLES } from "@/lib/content/articles";
import { getConsultantBySlug } from "@/lib/content/consultants";

export async function generateStaticParams() {
  return ARTICLES.flatMap((a) =>
    (["tr", "en"] as const).map((locale) => ({
      locale,
      slug: a.slug[locale],
    }))
  );
}

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

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const a = getArticleBySlug(slug, loc);
  if (!a) notFound();

  const author = getConsultantBySlug(a.authorSlug);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const related = ARTICLES.filter(
    (x) => x.slug[loc] !== a.slug[loc] && x.category === a.category
  ).slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.articles"), href: `/${locale}/yazilar` },
          { label: CATEGORY_LABELS[a.category]![loc] },
        ]}
        eyebrow={`${CATEGORY_LABELS[a.category]![loc]} — ${a.readingMinutes} ${
          loc === "tr" ? "dk okuma" : "min read"
        }`}
        title={a.title[loc]}
        lede={a.excerpt[loc]}
      />

      {/* Meta strip */}
      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-6 flex flex-wrap items-center gap-4 typography-caption text-ink-500">
          {author && (
            <>
              <Link
                href={`/${locale}/danismanlar/${author.slug}`}
                className="hover:text-ink-900"
              >
                {author.name}
              </Link>
              <span className="w-px h-3 bg-surface-3" aria-hidden />
            </>
          )}
          <span>{formatDate(a.publishedAt, loc)}</span>
          <span className="w-px h-3 bg-surface-3" aria-hidden />
          <span>
            {a.readingMinutes} {loc === "tr" ? "dakika okuma" : "min read"}
          </span>
        </div>
      </section>

      {/* Body */}
      <article className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-24">
          <div className="mx-auto max-w-[680px]">
            {a.body[loc].map((para, i) => (
              <p
                key={i}
                className="typography-body-lg text-ink-900 mb-7 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Author card */}
      {author && (
        <section className="bg-surface-1 border-t border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-20">
            <div className="max-w-[680px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3">
                <div className="w-20 h-20 rounded-full bg-ink-900 text-paper grid place-items-center typography-h2">
                  {author.name.charAt(0)}
                </div>
              </div>
              <div className="md:col-span-9">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Yazar" : "Author"}
                </span>
                <Link
                  href={`/${locale}/danismanlar/${author.slug}`}
                  className="block typography-h2 mt-2 text-ink-900 hover:text-brand-800"
                >
                  {author.name}
                </Link>
                <p className="typography-body-sm text-ink-500 mt-1">
                  {author.title[loc]}
                </p>
                <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
                  {author.shortBio[loc]}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper border-t border-surface-2">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-20 md:py-24">
            <h2 className="typography-display-lg text-ink-900">
              {loc === "tr" ? "İlgili yazılar" : "Related articles"}
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug[loc]}
                  href={`/${locale}/yazilar/${r.slug[loc]}`}
                  className="group bg-surface-1 border border-surface-2 rounded-2xl p-8 hover:bg-surface-2/60 transition-colors"
                >
                  <span className="typography-label uppercase tracking-widest text-brand-700">
                    {CATEGORY_LABELS[r.category]![loc]}
                  </span>
                  <h3 className="typography-h2 mt-4 text-ink-900 group-hover:text-brand-800">
                    {r.title[loc]}
                  </h3>
                  <p className="typography-caption text-ink-500 mt-4">
                    {r.readingMinutes}{" "}
                    {loc === "tr" ? "dk okuma" : "min read"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCallout locale={loc} />
    </>
  );
}
