import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { DiagnooReport } from "@/components/tools/diagnoo-report";
import { DiagnooSnapshot } from "@/components/tools/diagnoo-snapshot";
import { getToolBySlug } from "@/lib/content/tools";
import { getDiagnostic, hasLead } from "@/lib/tools/diagnoo/repository";
import { toSnapshot } from "@/lib/tools/diagnoo/schema";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/content/types";
import type { DiagnosticRow } from "@/lib/tools/diagnoo/repository";

/**
 * Diagnoo rapor sayfası — `noindex, follow` + sunucuda D1'den okuma.
 *
 * NEDEN `noindex`: sayfa tek bir teşhise bağlı, kişiye özel ve
 * tekilleştirilemez — her tarama ayrı bir adres üretir, hiçbiri bir arama
 * niyetini karşılamaz. `follow` sayesinde bağlantıyı açan ziyaretçi ve
 * otorite, aşağıdaki güçlü linkle indekslenebilir araç sayfasına akar. GEO
 * paylaşım sonucuyla (`geo-gorunurluk-denetleyicisi/sonuc/[id]`) aynı kalıp.
 *
 * `id` build anında bilinmiyor (`generateStaticParams` yok) — kayıt istek
 * anında D1'den okunur, bu yüzden `force-dynamic` + `nodejs` runtime (D1
 * binding'i yalnız bu runtime'da çalışır).
 *
 * Yoklama (polling) BURADA YOK: tamamlanmamış teşhiste sayfa yalnız durum
 * satırı basar. Canlı ilerleme istemci işidir ve Görev 15'in bileşenlerine
 * aittir; sunucu bileşeni her istekte tek bir anlık görüntü verir.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Kararlı yol çiftleri — `rapor ↔ report` çevirisi `routing.ts` ile birebir.
 *
 * TR taraf araç slug'ıyla İNTERPOLE EDİLMEZ (GEO sonuç sayfasıyla aynı
 * gerekçe): `page-metadata.test.ts` her sayfa kaynağını regex'le tarayıp TR
 * yolunun benzersiz olduğunu doğruluyor; regex `$` karakterinde durduğu için
 * interpolasyon, araç sayfasının kendi değeriyle çakışan bir alt dize
 * bırakırdı. Aynı sebeple bu yorum yolun kendisini örnek olarak YAZMAZ —
 * yorumdaki örnek de tarayıcının ilk eşleşmesi olur ve iki sayfa aynı
 * "yol"u ilan etmiş görünürdü.
 */
function reportPaths(id: string) {
  return {
    tr: `/tr/araclar/diagnoo/rapor/${id}`,
    en: `/en/tools/diagnoo/report/${id}`,
  };
}

const TOOL_PATH: Record<Locale, string> = {
  tr: "/tr/araclar/diagnoo",
  en: "/en/tools/diagnoo",
};

// `getCloudflareContext`/`BOOKINGS_DB` cast deseni Diagnoo rotaları ve GEO
// sonuç sayfasıyla birebir — `cloudflare-env.d.ts` yerel, repoya girmiyor.
type DiagnooDbEnv = { BOOKINGS_DB: D1Database };

/**
 * Kayıt + lead durumu. `generateMetadata` ve sayfa bileşeni bunu AYRI AYRI
 * çağırır; GEO sonuç sayfasındaki gerekçe burada da geçerli: sayfa `noindex`
 * ve yalnız bağlantıyla ziyaret ediliyor, tek satırlık indeksli sorgunun
 * ikinci çağrısı ölçülür bir maliyet değil.
 */
async function loadDiagnostic(
  id: string,
): Promise<{ row: DiagnosticRow; unlocked: boolean } | null> {
  const { env } = getCloudflareContext();
  const db = (env as unknown as DiagnooDbEnv).BOOKINGS_DB;
  const row = await getDiagnostic(db, id);
  if (!row) return null;
  const unlocked = await hasLead(db, id);
  return { row, unlocked };
}

const COPY = {
  tr: {
    tools: "Araçlar",
    reportCrumb: "Rapor",
    eyebrow: "Teşhis raporu",
    title: "Diagnoo raporu",
    lede: "Bu adres için ölçülen mağaza sağlığı. Kendi mağazanız için yeni bir tarama başlatabilirsiniz.",
    ctaLede: "Kendi mağazanızı tarayın:",
    pending: "Tarama sürüyor; sonuç hazır olduğunda sayfayı yenileyin.",
    failed: "Tarama tamamlanamadı. Adresi kontrol edip yeniden başlatın.",
  },
  en: {
    tools: "Tools",
    reportCrumb: "Report",
    eyebrow: "Diagnostic report",
    title: "Diagnoo report",
    lede: "The store health measured for this address. You can start a new scan for your own store.",
    ctaLede: "Scan your own store:",
    pending: "The scan is running; refresh the page once the result is ready.",
    failed: "The scan could not finish. Check the address and start it again.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const loc = locale as Locale;
  const tool = getToolBySlug(DIAGNOO_SLUG, "tr");
  const loaded = await loadDiagnostic(id);
  if (!tool || !loaded) return {};

  const base = buildMetadata({
    title: `${tool.name[loc]} — ${loaded.row.report?.healthScore ?? "…"}/100`,
    description: tool.seo.description[loc],
    paths: reportPaths(id),
    locale: loc,
  });
  return {
    ...base,
    // Kişiye özel, tekilleşemeyen içerik indekslenmez; `follow` otoritenin
    // araç sayfasına akmasını sağlar.
    robots: { index: false, follow: true },
  };
}

export default async function DiagnooReportPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const c = COPY[loc];

  const tool = getToolBySlug(DIAGNOO_SLUG, "tr");
  if (!tool) notFound();

  const loaded = await loadDiagnostic(id);
  if (!loaded) notFound();

  const { row, unlocked } = loaded;
  // Rapor yalnız tamamlanmış VE şeması doğrulanmış kayıtta vardır
  // (`repository.toRow` bozuk JSON'da `report`u `null` bırakır).
  const report = row.status === "completed" ? row.report : null;

  return (
    <>
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: c.tools, href: "/araclar" },
          { label: tool.name[loc], href: "/araclar/diagnoo" },
          { label: c.reportCrumb },
        ]}
        eyebrow={c.eyebrow}
        title={c.title}
        lede={c.lede}
      />

      <section aria-label={c.title} className="ds-container pb-16">
        {report ? (
          unlocked ? (
            <DiagnooReport report={report} locale={loc} />
          ) : (
            <DiagnooSnapshot
              snapshot={toSnapshot(report)}
              diagnosticId={row.id}
              locale={loc}
            />
          )
        ) : (
          <p className="typography-body-md text-ink-700">
            {row.status === "failed" ? c.failed : c.pending}
          </p>
        )}

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
