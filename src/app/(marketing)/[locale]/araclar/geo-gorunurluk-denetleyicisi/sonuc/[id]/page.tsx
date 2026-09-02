import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { GeoTool } from "@/components/tools/geo-tool";
import { TOOL_UI, fill } from "@/components/tools/copy";
import { OG_GEO_ALT, ogImagePath, shareTitle } from "@/lib/tools/geo/share-meta";
import { getToolBySlug } from "@/lib/content/tools";
import { getScan } from "@/lib/tools/geo/repository";
import { stripFindings } from "@/lib/tools/geo/findings";
import { localeHref } from "@/lib/i18n/locale-href";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/content/types";
import type { GeoScanResult } from "@/lib/tools/geo/types";

/**
 * Paylaşım sonucu sayfası — spec §4 "Sayfalar ve akış": `noindex, follow` +
 * sunucuda D1'den okuma + araca güçlü link. Görev 11.
 *
 * NEDEN `noindex`: sayfa içeriği (bir URL + skoru) ince ve tekilleştirilemez
 * — binlerce taramanın her biri ayrı bir sayfa olurdu, hiçbiri arama
 * niyetini karşılamaz. Paylaşım linkinden gelen ziyaretçi ve otorite,
 * `follow` sayesinde aşağıdaki güçlü linkle indekslenebilir araç sayfasına
 * akar (araç sayfası kendi `buildMetadata`'sıyla indekslenir, Görev 10).
 *
 * `id` build-time bilinmiyor (`generateStaticParams` yok) — sayfa istek
 * anında D1'den okunur, bu yüzden `force-dynamic` + `nodejs` runtime
 * (booking route'larının deseni, D1 binding'i yalnız bu runtime'da çalışır).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOOL_SLUG = "geo-gorunurluk-denetleyicisi";

/**
 * Kararlı yol çiftleri — `sonuc ↔ result` çevirisi `routing.ts` ile birebir.
 *
 * TR taraf `${TOOL_SLUG}` ile İNTERPOLE EDİLMEZ (bilinçli): tam segment
 * zincirini elle yazar. `page-metadata.test.ts` her sayfa kaynağını
 * regex'le tarayıp `tr: "/tr/..."` değerinin benzersiz olduğunu doğruluyor;
 * regex `$` karakterinde durduğu için `${TOOL_SLUG}` kullanılsaydı yakalanan
 * alt dize üst araç sayfasının (`../page.tsx`) kendi kısaltılmış
 * `/tr/araclar/` değeriyle çakışırdı (ikisi de aynı önekte kesilir).
 */
function resultPaths(id: string) {
  return {
    tr: `/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/${id}`,
    en: `/en/tools/geo-visibility-checker/result/${id}`,
  };
}

const TOOL_PATH: Record<Locale, string> = {
  tr: "/tr/araclar/geo-gorunurluk-denetleyicisi",
  en: "/en/tools/geo-visibility-checker",
};

// `getCloudflareContext`/`BOOKINGS_DB` cast deseni `geo-scan/route.ts`
// (Görev 9) ve booking route'larıyla birebir — `cloudflare-env.d.ts` yerel,
// repoya girmiyor.
type GeoScanEnv = { BOOKINGS_DB: D1Database };

/**
 * `generateMetadata` ve sayfa bileşeni bunu AYRI AYRI çağırır — istek başına
 * iki D1 SELECT anlamına gelir. Bilinçli: bu sayfa `noindex` ve düşük
 * trafikli (yalnız paylaşım linkinden gelinir), tek satırlık indeksli bir
 * sorgunun ikinci çağrısı ölçülür bir maliyet değil; `React.cache` gibi bir
 * istek-içi önbellek eklemek bu ölçekte kod karmaşıklığını haklı çıkarmaz.
 */
async function loadScan(id: string): Promise<GeoScanResult | null> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as GeoScanEnv).BOOKINGS_DB;
  const record = await getScan(db, id);
  if (!record) return null;
  // Görev 12b: D1'deki kayıt TAM findings taşır — bu sayfa `noindex` olsa da
  // SSR HTML'i herkese açık (paylaşım linki), findings mail kapısının
  // arkasında kalmalı. `stripFindings` public yüzey/rapor yüzeyi ayrımının
  // TEK tanımı (`src/lib/tools/geo/findings.ts`).
  return { id, ...record, checks: stripFindings(record.checks) };
}

/**
 * Sayfa chrome'u — araca özgü metin `TOOL_UI`de (`share.banner`,
 * `share.scanOwn`); bu yalnız breadcrumb'ın iki sabit etiketi.
 */
const COPY = {
  tr: { tools: "Araçlar", resultCrumb: "Sonuç" },
  en: { tools: "Tools", resultCrumb: "Result" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const loc = locale as Locale;
  const tool = getToolBySlug(TOOL_SLUG, "tr");
  const result = await loadScan(id);
  if (!tool || !result) return {};

  const base = buildMetadata({
    title: shareTitle(result.totalScore, result.url, loc),
    description: tool.seo.description[loc],
    paths: resultPaths(id),
    locale: loc,
    image: {
      url: ogImagePath(result.totalScore, loc),
      alt: fill(OG_GEO_ALT[loc], { score: result.totalScore }),
    },
  });
  return {
    ...base,
    // Spec §4: ince, tekilleşemeyen içerik indekslenmez; `follow` otoritenin
    // aşağıdaki güçlü linkle araç sayfasına akmasını sağlar.
    robots: { index: false, follow: true },
  };
}

export default async function GeoScanResultPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = COPY[loc];

  const tool = getToolBySlug(TOOL_SLUG, "tr");
  if (!tool) notFound();

  const result = await loadScan(id);
  if (!result) notFound();

  const ui = TOOL_UI[loc];

  return (
    <section aria-label={ui.share.banner} className="tool-hero">
      <div className="ds-container">
        <div className="mx-auto max-w-tool">
          <nav aria-label="Breadcrumb" className="v2-crumbs">
            <ol>
              <li>
                <Link href={`/${loc}`}>INDOLES</Link>
                <span aria-hidden="true">/</span>
              </li>
              <li>
                <Link href={localeHref("/araclar", loc)}>{c.tools}</Link>
                <span aria-hidden="true">/</span>
              </li>
              <li>
                <Link href={TOOL_PATH[loc]}>{tool.name[loc]}</Link>
                <span aria-hidden="true">/</span>
              </li>
              <li>
                <span aria-current="page">{c.resultCrumb}</span>
              </li>
            </ol>
          </nav>
          <div className="v2-surface-3 rounded-xl px-4 py-3 mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow-bare mono text-ink-500 uppercase tracking-widest">
              {ui.share.banner}
            </span>
            <Link href={TOOL_PATH[loc]} className="btn btn-ghost">
              {ui.share.scanOwn}
              <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            </Link>
          </div>
          <GeoTool locale={loc} tool={tool} mode="share" initialResult={result} />
        </div>
      </div>
    </section>
  );
}
