import Link from "next/link";
import type { ArticleContent, Locale } from "@/lib/content/types";
import { getTopic } from "@/lib/content/topics";
import { localeHref } from "@/lib/i18n/locale-href";

/**
 * Yazı kartı — konu etiketi + başlık + okuma süresi.
 *
 * Yazı detayının "İlgili yazılar" ızgarasından tek kaynağa çıkarıldı
 * (`yazilar/[slug]/page.tsx`). Vaka detayının "İlgili yazılar" bloğu
 * (`relatedArticlesForCase`, denetim C-09) aynı kartı kullanır — iki
 * bağlamda ayrı kart icat edilmez.
 */
export function ArticleCard({
  article,
  locale,
}: {
  article: ArticleContent;
  locale: Locale;
}) {
  const tr = locale === "tr";
  return (
    <Link
      href={localeHref(`/yazilar/${article.slug[locale]}`, locale)}
      className="group v2-surface border border-surface-2 rounded-2xl p-8 hover:bg-surface-2/60 transition-colors"
    >
      <span className="typography-label uppercase tracking-widest text-teal-700">
        {getTopic(article.topic).label[locale]}
      </span>
      <h3 className="typography-h2 mt-4 text-ink-900 group-hover:text-teal-800">
        {article.title[locale]}
      </h3>
      <p className="typography-caption text-ink-500 mt-4">
        {article.readingMinutes} {tr ? "dk okuma" : "min read"}
      </p>
    </Link>
  );
}
