import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { getArticleBySlug, ARTICLES } from "@/lib/content/articles";
import { getConsultantBySlug } from "@/lib/content/consultants";
import { SERVICES } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  articleLd,
  breadcrumbLd,
  faqLd,
  organizationLd,
} from "@/lib/seo/json-ld";
import { localeHref } from "@/lib/i18n/locale-href";
import type { ArticleBlock, ArticleContent, Locale } from "@/lib/content/types";

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

function articlePaths(a: ArticleContent) {
  return {
    tr: `/tr/yazilar/${a.slug.tr}`,
    en: `/en/articles/${a.slug.en}`,
  };
}

/**
 * Excerpt sayfada lede olarak uzun yaşayabilir; meta description 160
 * karakterde kesilir (docs/08). Kesim kelime sınırında yapılır —
 * `buildMetadata` sözleşmesi gereği kırpma çağıranın işidir.
 */
function metaDescription(excerpt: string): string {
  if (excerpt.length <= 160) return excerpt;
  const cut = excerpt.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const a = getArticleBySlug(slug, loc);
  if (!a) return {};

  return buildMetadata({
    title: a.title[loc],
    description: metaDescription(a.excerpt[loc]),
    paths: articlePaths(a),
    locale: loc,
    ogType: "article",
  });
}

function formatDate(iso: string, locale: "tr" | "en") {
  return new Date(iso).toLocaleDateString(
    locale === "tr" ? "tr-TR" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

/**
 * Satır içi bağlantı: `[metin](/vakalar/slug)` markdown-lite sözdizimi.
 *
 * Yazılar vaka ve hizmet sayfalarına iç bağlantı verir (ADR-020) — SEO iç
 * link ağı ve okurun kanıta tek tıkla ulaşması için. Href locale'siz kanonik
 * TR segmentiyle yazılır (`/vakalar/...`); `localeHref` EN'de segmenti
 * çevirir (`/en/case-studies/...`). Yalnız `/` ile başlayan iç yollar link
 * olur; dış URL düz metin kalır.
 */
/**
 * Hizmet linklerinde slug locale başına farklıdır (ADR-018:
 * `/tr/hizmetler/e-ticaret` ↔ `/en/services/e-commerce`); `localeHref` yalnız
 * ilk segmenti çevirdiği için EN tarafında TR slug 404 olurdu. İçerikte
 * kanonik TR yol yazılır, burada gerçek EN slug'a çözülür. Pillar anahtarları
 * (growth/transform/build) locale'den bağımsızdır ve `localeHref`e düşer.
 */
function resolveInlineHref(href: string, loc: Locale): string {
  const parts = href.split("/").filter(Boolean);
  if (parts[0] === "hizmetler" && parts[1]) {
    const svc = SERVICES.find((s) => s.slug.tr === parts[1]);
    if (svc) {
      return loc === "tr"
        ? `/tr/hizmetler/${svc.slug.tr}`
        : `/en/services/${svc.slug.en}`;
    }
  }
  return localeHref(href, loc);
}

function renderInline(text: string, loc: Locale): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\(\/[^)]+\))/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\((\/[^)]+)\)$/);
    if (!m) return part;
    return (
      <Link
        key={i}
        href={resolveInlineHref(m[2]!, loc)}
        className="text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-500"
      >
        {m[1]}
      </Link>
    );
  });
}

/**
 * Blok gövde (ADR-020). Başlık çapaları `scroll-mt` taşır — sabit chrome
 * başlığı örtmesin. Uzun okuma kolonu 680px'te kalır (mevcut ölçü).
 */
function BlockRenderer({ block, loc }: { block: ArticleBlock; loc: Locale }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="typography-h2 mt-14 mb-6 scroll-mt-32 text-ink-900"
        >
          {block.text[loc]}
        </h2>
      );
    case "h3":
      return (
        <h3 className="typography-h3 mt-10 mb-4 text-ink-900">
          {block.text[loc]}
        </h3>
      );
    case "list":
      return block.ordered ? (
        <ol className="mb-7 list-decimal space-y-3 pl-6">
          {block.items.map((item, i) => (
            <li key={i} className="typography-body-lg text-ink-900 pl-1">
              {renderInline(item[loc], loc)}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mb-7 list-disc space-y-3 pl-6 marker:text-teal-500">
          {block.items.map((item, i) => (
            <li key={i} className="typography-body-lg text-ink-900 pl-1">
              {renderInline(item[loc], loc)}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="mb-7 border-l-2 border-teal-700 pl-6 typography-body-lg italic text-ink-700">
          {renderInline(block.text[loc], loc)}
        </blockquote>
      );
    default:
      return (
        <p className="typography-body-lg text-ink-900 mb-7">
          {renderInline(block.text[loc], loc)}
        </p>
      );
  }
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const a = getArticleBySlug(slug, loc);
  if (!a) notFound();

  const author = getConsultantBySlug(a.authorSlug);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const related = ARTICLES.filter(
    (x) => x.slug[loc] !== a.slug[loc] && x.category === a.category
  ).slice(0, 3);

  const tr = loc === "tr";
  const paths = articlePaths(a);
  const headings = a.blocks.filter(
    (b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2"
  );
  // İçindekiler ancak gezinilecek kadar başlık varsa basılır; iki maddelik
  // bir kutu gürültüdür.
  const showToc = headings.length >= 3;
  const authorPath = author
    ? tr
      ? `/tr/danismanlar/${author.slug}`
      : `/en/consultants/${author.slug}`
    : undefined;

  return (
    <>
      <JsonLd
        graph={[
          organizationLd(),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            {
              name: tCommon("nav.articles"),
              path: tr ? "/tr/yazilar" : "/en/articles",
            },
            { name: a.title[loc], path: paths[loc] },
          ]),
          articleLd({
            headline: a.title[loc],
            description: a.excerpt[loc],
            path: paths[loc],
            locale: loc,
            datePublished: a.publishedAt,
            dateModified: a.updatedAt,
            authorName: author?.name,
            authorPath,
          }),
          a.faq
            ? faqLd(
                a.faq.map((f) => ({
                  question: f.question[loc],
                  answer: f.answer[loc],
                }))
              )
            : null,
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.articles"), href: "/yazilar" },
          { label: CATEGORY_LABELS[a.category]![loc] },
        ]}
        eyebrow={`${CATEGORY_LABELS[a.category]![loc]} — ${a.readingMinutes} ${
          tr ? "dk okuma" : "min read"
        }`}
        title={a.title[loc]}
        lede={a.excerpt[loc]}
      />

      {/* Meta strip */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-6 flex flex-wrap items-center gap-4 typography-caption text-ink-500">
          {author && (
            <>
              <Link
                href={localeHref(`/danismanlar/${author.slug}`, loc)}
                className="hover:text-ink-900"
              >
                {author.name}
              </Link>
              <span className="w-px h-3 v2-surface-3" aria-hidden />
            </>
          )}
          <span>{formatDate(a.publishedAt, loc)}</span>
          {a.updatedAt ? (
            <span className="mono rounded-md bg-teal-50 px-2.5 py-1 tracking-wide text-teal-800">
              {tr ? "Güncellendi" : "Updated"}: {formatDate(a.updatedAt, loc)}
            </span>
          ) : null}
          <span className="w-px h-3 v2-surface-3" aria-hidden />
          <span>
            {a.readingMinutes} {tr ? "dakika okuma" : "min read"}
          </span>
        </div>
      </section>

      {/* Body */}
      <article>
        <div className="ds-container py-16 md:py-24">
          <div className="mx-auto max-w-170">
            {/* Güncelleme notu — güncellenen yazı bunu okura açıkça söyler */}
            {a.updateNote ? (
              <aside
                className="mb-10 rounded-xl border border-teal-200 bg-teal-50 p-5"
                aria-label={tr ? "Güncelleme notu" : "Update note"}
              >
                <span className="typography-label mono uppercase tracking-widest text-teal-800">
                  {tr ? "Güncelleme notu" : "Update note"}
                </span>
                <p className="typography-body-sm mt-2 text-ink-700">
                  {a.updateNote[loc]}
                </p>
              </aside>
            ) : null}

            {/* İçindekiler — h2 çapaları; GEO için DOM'da açık metin */}
            {showToc ? (
              <nav
                aria-label={tr ? "İçindekiler" : "Table of contents"}
                className="mb-12 rounded-xl border border-surface-3 p-5"
              >
                <span className="typography-label mono uppercase tracking-widest text-ink-500">
                  {tr ? "İçindekiler" : "Contents"}
                </span>
                <ol className="mt-3 space-y-2">
                  {headings.map((h, i) => (
                    <li key={h.id} className="flex gap-3">
                      <span className="typography-caption mono text-teal-700">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${h.id}`}
                        className="typography-body-sm text-ink-700 hover:text-brand-800"
                      >
                        {h.text[loc]}
                      </a>
                    </li>
                  ))}
                  {a.faq ? (
                    <li className="flex gap-3">
                      <span className="typography-caption mono text-teal-700">
                        {String(headings.length + 1).padStart(2, "0")}
                      </span>
                      <a
                        href="#sss"
                        className="typography-body-sm text-ink-700 hover:text-brand-800"
                      >
                        {tr ? "Sık sorulan sorular" : "Frequently asked questions"}
                      </a>
                    </li>
                  ) : null}
                </ol>
              </nav>
            ) : null}

            {a.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} loc={loc} />
            ))}

            {/* SSS — açık metin; details/summary değil, AI motorları ve
                ekran okuyucular kapalı içeriği atlayabiliyor */}
            {a.faq ? (
              <section aria-labelledby="sss" className="mt-16">
                <h2
                  id="sss"
                  className="typography-h2 scroll-mt-32 text-ink-900"
                >
                  {tr ? "Sık sorulan sorular" : "Frequently asked questions"}
                </h2>
                <dl className="mt-8 space-y-8">
                  {a.faq.map((f, i) => (
                    <div
                      key={i}
                      className="border-b border-surface-2 pb-8 last:border-b-0"
                    >
                      <dt className="typography-h3 text-ink-900">
                        {f.question[loc]}
                      </dt>
                      <dd className="typography-body-lg mt-3 text-ink-700">
                        {f.answer[loc]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      {/* Author card */}
      {author && (
        <section className="v2-surface border-t border-surface-2">
          <div className="ds-container py-16 md:py-20">
            <div className="max-w-170 mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3">
                <div className="w-20 h-20 rounded-full bg-ink-900 text-paper grid place-items-center typography-h2">
                  {author.name.charAt(0)}
                </div>
              </div>
              <div className="md:col-span-9">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {tr ? "Yazar" : "Author"}
                </span>
                <Link
                  href={localeHref(`/danismanlar/${author.slug}`, loc)}
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
        <section className="border-t border-surface-2">
          <div className="ds-container py-20 md:py-24">
            <h2 className="typography-h2 text-ink-900">
              {tr ? "İlgili yazılar" : "Related articles"}
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug[loc]}
                  href={localeHref(`/yazilar/${r.slug[loc]}`, loc)}
                  className="group v2-surface border border-surface-2 rounded-2xl p-8 hover:v2-surface-2/60 transition-colors"
                >
                  <span className="typography-label uppercase tracking-widest text-brand-700">
                    {CATEGORY_LABELS[r.category]![loc]}
                  </span>
                  <h3 className="typography-h2 mt-4 text-ink-900 group-hover:text-brand-800">
                    {r.title[loc]}
                  </h3>
                  <p className="typography-caption text-ink-500 mt-4">
                    {r.readingMinutes} {tr ? "dk okuma" : "min read"}
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
