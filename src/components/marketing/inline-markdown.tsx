import Link from "next/link";
import { ARTICLES } from "@/lib/content/articles";
import { CASES } from "@/lib/content/cases";
import { PACKAGES } from "@/lib/content/packages";
import { SERVICES } from "@/lib/content/services";
import { TOOLS } from "@/lib/content/tools";
import { localeHref } from "@/lib/i18n/locale-href";
import { localizedHref } from "@/lib/i18n/segments";
import type { Locale } from "@/lib/content/types";

/**
 * Satır içi bağlantı: `[metin](/vakalar/slug)` markdown-lite sözdizimi.
 *
 * Yazılar vaka ve hizmet sayfalarına iç bağlantı verir (ADR-020) — SEO iç
 * link ağı ve okurun kanıta tek tıkla ulaşması için. Href locale'siz kanonik
 * TR segmentiyle yazılır (`/vakalar/...`); `localeHref` EN'de segmenti
 * çevirir (`/en/case-studies/...`). Yalnız `/` ile başlayan iç yollar link
 * olur; dış URL düz metin kalır.
 *
 * Makale sayfasından (`ArticleDetail`) makale→araç köprüsüne
 * (`ArticleToolBridges`, Faz 2 Görev 2) taşındı — iki yüzey de aynı
 * çözücüyü paylaşır, link davranışı birbirinden sapamaz.
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
      return localizedHref(loc, "services", svc.slug[loc]);
    }
  }
  // Yazıdan yazıya link, hizmetlerle aynı sorunu taşır: slug locale başına
  // farklıdır (`/tr/yazilar/llms-txt-nedir` ↔ `/en/articles/what-is-llms-txt`),
  // `localeHref` yalnız ilk segmenti çevirdiği için EN'de TR slug 404 olurdu.
  // İçerikte kanonik TR yol yazılır, burada gerçek EN slug'a çözülür.
  if (parts[0] === "yazilar" && parts[1]) {
    const art = ARTICLES.find((a) => a.slug.tr === parts[1]);
    if (art) {
      return localizedHref(loc, "articles", art.slug[loc]);
    }
  }
  // Yazıdan vakaya link (2026-08-29): vaka slug'ı da locale başına ayrıldı,
  // yani hizmet ve yazı dallarıyla aynı sorun burada da doğdu — `localeHref`
  // yalnız `/vakalar` → `/case-studies` segmentini çevirirdi ve EN'de TR slug
  // 404 olurdu. İçerikte kanonik TR yol yazılır (`articles.ts` gövdeleri
  // değişmedi), gerçek EN slug burada çözülür.
  if (parts[0] === "vakalar" && parts[1]) {
    const study = CASES.find((c) => c.slug.tr === parts[1]);
    if (study) {
      return localizedHref(loc, "cases", study.slug[loc]);
    }
  }
  // Yazıdan araca link (Görev 13, üçgen linkler): araç slug'ı da locale
  // başına ayrık (`/tr/araclar/geo-gorunurluk-denetleyicisi` ↔
  // `/en/tools/geo-visibility-checker`, `routing.ts`) — hizmet/yazı/vaka
  // dallarıyla aynı sorun. İçerikte kanonik TR yol yazılır (üç GEO yazısının
  // köprü paragrafı, Diagnoo köprü paragrafları), gerçek EN slug burada
  // çözülür.
  if (parts[0] === "araclar" && parts[1]) {
    const tool = TOOLS.find((t) => t.slug.tr === parts[1]);
    if (tool) {
      return localizedHref(loc, "tools", tool.slug[loc]);
    }
  }
  // Yazıdan pakete link (2026-09-25): paket slug'ı da locale başına ayrık
  // (`/tr/paketler/buyume-sprinti` ↔ `/en/packages/growth-sprint`). Bu dal
  // yokken `localeHref` yalnız segmenti çeviriyor, EN'de TR slug'lı
  // `/en/packages/buyume-sprinti` üretiyordu; bir yazı bu yüzden EN gövdeye
  // elle EN slug yazmıştı. Artık gövdede hep kanonik TR yol yazılır.
  if (parts[0] === "paketler" && parts[1]) {
    const pkg = PACKAGES.find((p) => p.slug.tr === parts[1]);
    if (pkg) {
      return localizedHref(loc, "packages", pkg.slug[loc]);
    }
  }
  return localeHref(href, loc);
}

/**
 * Markdown-lite satır içi metni React düğümüne çevirir: `[metin](/yol)`
 * bir `<Link>` olur, geri kalan düz metin kalır. Makale gövdesi
 * (`BlockRenderer`) ve makale→araç köprü paragrafları (`ArticleToolBridges`)
 * bu fonksiyonu paylaşır.
 */
export function renderInline(text: string, loc: Locale): React.ReactNode {
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
