import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { GeoResult } from "@/components/tools/geo-result";
import { getToolBySlug } from "@/lib/content/tools";
import { getScan } from "@/lib/tools/geo/repository";
import { stripFindings } from "@/lib/tools/geo/findings";
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

const COPY = {
  tr: {
    tools: "Araçlar",
    resultCrumb: "Sonuç",
    eyebrow: "Paylaşılan sonuç",
    title: "Tarama sonucu",
    lede: "Bu, girilen adres için ölçülen GEO hazırlık skorudur. Kendi siteniz için yeni bir tarama başlatabilirsiniz.",
    ctaLede: "Kendi sitenizi tarayın:",
  },
  en: {
    tools: "Tools",
    resultCrumb: "Result",
    eyebrow: "Shared result",
    title: "Scan result",
    lede: "This is the measured GEO readiness score for the entered address. You can start a new scan for your own site.",
    ctaLede: "Scan your own site:",
  },
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
    title: `${tool.name[loc]} — ${result.totalScore}/100`,
    description: tool.seo.description[loc],
    paths: resultPaths(id),
    locale: loc,
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

  return (
    <>
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: c.tools, href: "/araclar" },
          { label: tool.name[loc], href: "/araclar/geo-gorunurluk-denetleyicisi" },
          { label: c.resultCrumb },
        ]}
        eyebrow={c.eyebrow}
        title={c.title}
        lede={c.lede}
      />

      <section aria-label={c.title} className="ds-container pb-16">
        <GeoResult result={result} signals={tool.signals} locale={loc} />

        <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 mt-12 flex flex-col items-start gap-4">
          <p className="typography-body-md text-ink-700">{c.ctaLede}</p>
          <Link href={TOOL_PATH[loc]} className="btn btn-primary">
            {tool.name[loc]}
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 11 L11 3 M5 3 H11 V9"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
