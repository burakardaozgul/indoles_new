"use client";

import { useId } from "react";
import Link from "next/link";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { track } from "@/lib/analytics/ga";
import { localeHref } from "@/lib/i18n/locale-href";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";
import type {
  BenchmarkComparison,
  DiagnooReport as DiagnooReportData,
  RangeValue,
  RoadmapItem,
} from "@/lib/tools/diagnoo/schema";

/**
 * Kilidi açılmış tam rapor — altı bölüm, hepsi `aria-labelledby` taşıyan
 * ayrı `<section>`.
 *
 * GRAFİK KÜTÜPHANESİ YOK (spec §4): gauge tek bir `<svg>` yay, skor karnesi
 * ve kıyas satırları token'lı `div` bar'ları. Bir chart paketi bu sayfaya
 * ~40 KB getirir ve karşılığında dört yatay çubuk çizerdi.
 *
 * ARALIK DİSİPLİNİ: para her yerde "düşük – yüksek" olarak basılır; nokta
 * tahmin (`expected`) TEK BAŞINA hiçbir yerde görünmez. Model belirsizliği
 * gerçek, tek rakam göstermek onu gizlerdi (docs/04 §10 içerik dürüstlüğü).
 *
 * "use client": yol haritası açılışları (`tool_roadmap_item_expanded`) ve
 * hizmet linkleri (`tool_service_cta_clicked`) ölçülüyor; sunucu bileşeni
 * bunları yazamaz.
 */

const COPY = {
  tr: {
    summaryHeading: "Yönetici özeti",
    summaryLede: (url: string, score: number, items: number, critical: number) =>
      `${url} adresi 100 üzerinden ${score} puan aldı. Yol haritasında ${items} madde var, bunların ${critical} tanesi kritik öncelikte. Aşağıdaki bölümler her puanın nereden geldiğini ve hangi ölçümün hangi maddeyi doğurduğunu gösterir.`,
    healthScore: "Sağlık skoru",
    outOf: "100 üzerinden",
    recoverable: "Aylık geri kazanılabilir gelir",
    roadmapCount: "Yol haritası maddesi",
    dataQualityNone:
      "Finansal hesabın dört girdisi de sektör medyanından geldi. Kendi rakamlarınızı girerseniz aralık daralır.",
    dataQualityAll: "Finansal hesabın dört girdisi de sizin verinizden geldi.",
    dataQualityMixed: (measured: number, estimated: number) =>
      `Finansal hesabın ${measured} girdisi sizin verinizden, ${estimated} girdisi sektör medyanından geldi.`,

    scoreHeading: "Skor karnesi",
    scoreLede:
      "Dört boyut, her biri 0 ile 100 arasında. Değerler taramanın ham ölçümlerinden türer; hesabın nasıl yapıldığı her satırın altında yazar.",
    benchmarkYou: "Siz",
    benchmarkMedian: "Sektör medyanı",
    benchmarkTop: "En iyi %10",
    benchmarkOther: "Diğer kıyas ölçümleri",

    gapsHeading: "Kritik boşluklar",
    gapsLede:
      "Öncelik sırasına dizilmiş maddeler. Her kartın son satırı, maddeyi doğuran ölçümü gösterir.",
    impactLabel: "Aylık etki",
    impactUnknown: "Veri yetersiz",
    effortLabel: "Tahmini emek",
    days: "gün",
    evidenceLabel: "Dayanak",

    financialHeading: "Finansal projeksiyon",
    financialLede:
      "Hesabın girdileri ve çıktıları. Her girdinin yanında verinin ölçülmüş mü yoksa sektör medyanından mı geldiği yazar.",
    inputLabel: "Girdi",
    valueLabel: "Değer",
    sourceLabel: "Kaynak",
    measured: "Ölçüldü",
    estimated: "Tahmin",
    inputTraffic: "Aylık ziyaretçi",
    inputAov: "Ortalama sepet tutarı",
    inputCr: "Dönüşüm oranı",
    inputDelay: "Ortalama gecikme",
    inputAdSpend: "Aylık reklam bütçesi",
    inputCohesion: "Mesaj tutarlılığı",
    seconds: "sn",
    notEntered: "Girilmedi",
    lostSpeed: "Hız kaynaklı gelir kaybı",
    adWaste: "Reklam bütçesi israfı",
    adWasteNone: "Reklam bütçesi girilmedi; bu kalem hesaplanmadı.",
    totalRecoverable: "Toplam geri kazanılabilir",
    methodology: "Metodoloji",
    methodologyLede:
      "Hesapta kullanılan katsayılar, değerleri ve kaynakları.",
    sourceColumn: "Kaynak",

    roadmapHeading: "Yol haritası",
    roadmapLede:
      "Tüm maddeler öncelik sırasında. Bir satırı açtığınızda maddenin ne yaptığı ve dayanağı görünür.",

    nextHeading: "Sonraki adım",
    nextLede:
      "Bu maddeleri kendi ekibinizle önceliklendirebilirsiniz. Birlikte okumak isterseniz bir görüşme kurun.",
    nextCta: "Görüşme planlayın",
    servicesLede: "İlgili hizmetler:",
  },
  en: {
    summaryHeading: "Executive summary",
    summaryLede: (url: string, score: number, items: number, critical: number) =>
      `${url} scored ${score} out of 100. The roadmap holds ${items} items, ${critical} of them at critical priority. The sections below show where each point comes from and which measurement produced which item.`,
    healthScore: "Health score",
    outOf: "out of 100",
    recoverable: "Recoverable revenue per month",
    roadmapCount: "Roadmap items",
    dataQualityNone:
      "All four financial inputs come from sector medians. Entering your own figures narrows the range.",
    dataQualityAll: "All four financial inputs come from your own data.",
    dataQualityMixed: (measured: number, estimated: number) =>
      `${measured} of the financial inputs come from your own data, ${estimated} from sector medians.`,

    scoreHeading: "Score card",
    scoreLede:
      "Four dimensions, each between 0 and 100. The values derive from the raw measurements of the scan; how each one is calculated is stated under the row.",
    benchmarkYou: "You",
    benchmarkMedian: "Sector median",
    benchmarkTop: "Top 10%",
    benchmarkOther: "Other benchmark measurements",

    gapsHeading: "Critical gaps",
    gapsLede:
      "Items ordered by priority. The last line of each card names the measurement behind it.",
    impactLabel: "Monthly impact",
    impactUnknown: "Not enough data",
    effortLabel: "Estimated effort",
    days: "days",
    evidenceLabel: "Evidence",

    financialHeading: "Financial projection",
    financialLede:
      "The inputs and outputs of the calculation. Each input states whether the figure was measured or taken from a sector median.",
    inputLabel: "Input",
    valueLabel: "Value",
    sourceLabel: "Source",
    measured: "Measured",
    estimated: "Estimated",
    inputTraffic: "Monthly visitors",
    inputAov: "Average order value",
    inputCr: "Conversion rate",
    inputDelay: "Average delay",
    inputAdSpend: "Monthly ad budget",
    inputCohesion: "Message consistency",
    seconds: "s",
    notEntered: "Not entered",
    lostSpeed: "Revenue lost to speed",
    adWaste: "Ad budget waste",
    adWasteNone: "No ad budget was entered, so this line was not calculated.",
    totalRecoverable: "Total recoverable",
    methodology: "Methodology",
    methodologyLede: "The constants used in the calculation, their values and their sources.",
    sourceColumn: "Source",

    roadmapHeading: "Roadmap",
    roadmapLede:
      "Every item in priority order. Opening a row shows what the item does and the evidence behind it.",

    nextHeading: "Next step",
    nextLede:
      "You can prioritise these items with your own team. If you would rather read them together, book a call.",
    nextCta: "Book a call",
    servicesLede: "Related services:",
  },
} as const;

const CATEGORY_LABELS: Record<RoadmapItem["category"], Record<"tr" | "en", string>> = {
  speed: { tr: "Hız", en: "Speed" },
  semantic: { tr: "Mesaj", en: "Messaging" },
  ux: { tr: "Arayüz", en: "Interface" },
  tracking: { tr: "Ölçüm", en: "Tracking" },
  funnel: { tr: "Satın alma akışı", en: "Purchase flow" },
};

const PRIORITY_LABELS: Record<RoadmapItem["priority"], Record<"tr" | "en", string>> = {
  critical: { tr: "Kritik", en: "Critical" },
  high: { tr: "Yüksek", en: "High" },
  medium: { tr: "Orta", en: "Medium" },
  low: { tr: "Düşük", en: "Low" },
};

const PRIORITY_TONE: Record<RoadmapItem["priority"], string> = {
  critical: "border-danger-500 text-danger-700",
  high: "border-warning-500 text-warning-700",
  medium: "border-teal-500 text-teal-700",
  low: "border-ink-300 text-ink-600",
};

const PRIORITY_ORDER: Record<RoadmapItem["priority"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/**
 * LCP eşiği — Core Web Vitals "iyi" sınırı. Skor karnesindeki hız çubuğu bu
 * eşiğe göre normalize edilir: 2500 ms ve altı tam puan.
 */
const LCP_TARGET_MS = 2500;

/** Oran biriminde yüzde olarak okunması doğru olan kıyas ölçümleri. */
const PERCENT_METRICS = new Set(["conversion_rate"]);

/**
 * Skor karnesi satırlarının kıyas eşleşmesi. Bugün yalnız hız satırının bir
 * karşılığı var; harita boş kalan satırların ileride bir kıyas kazanmasına
 * hazır ve eşleşmeyen ölçümler bölümün sonunda ayrıca listelenir — küratörlü
 * kıyas seti sessizce düşmez.
 */
const SCORE_BENCHMARKS: Record<string, readonly string[]> = {
  speed: ["lcp_ms", "cls"],
  semantic: [],
  ux: [],
  tracking: [],
};

// --- Biçimlendirme -----------------------------------------------------------

/** Para birimi TL; ondalık yok — aralıklarda kuruş bilgi taşımaz. */
export function moneyFormatter(locale: "tr" | "en"): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

/**
 * "₺74.000 – ₺154.000". Nokta tahmin (`expected`) BİLEREK dışarıda: modelin
 * belirsizliği gerçek, tek rakam onu gizler (spec §4).
 */
export function formatRange(range: RangeValue, locale: "tr" | "en"): string {
  const money = moneyFormatter(locale);
  return `${money.format(range.low)} – ${money.format(range.high)}`;
}

function formatCount(value: number, locale: "tr" | "en"): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(ratio: number, locale: "tr" | "en"): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);
}

function formatBenchmarkValue(
  value: number,
  benchmark: BenchmarkComparison,
  locale: "tr" | "en",
): string {
  if (benchmark.unit === "ms") return `${formatCount(value, locale)} ms`;
  if (benchmark.unit === "count") return formatCount(value, locale);
  if (PERCENT_METRICS.has(benchmark.metric)) return formatPercent(value, locale);
  // CLS gibi yüzdeye çevrilmesi YANLIŞ olan oranlar ham basılır.
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    maximumFractionDigits: 3,
  }).format(value);
}

/** 0-1 skorunu 0-100 tam sayıya çevirir — çubuk genişliği ve okunan değer. */
function toPct(score01: number): number {
  return Math.round(Math.min(1, Math.max(0, score01)) * 100);
}

// --- Paylaşılan küçük parçalar ----------------------------------------------

/**
 * Tek yatay çubuk. Çubuğun kendisi `aria-hidden`: değer zaten yanında METİN
 * olarak duruyor, çubuk aynı bilgiyi ikinci kez anons etmemeli.
 */
function ScoreBar({ pct }: { pct: number }) {
  return (
    <div className="mt-3 h-2 w-full rounded-full bg-ink-100" aria-hidden="true">
      <div
        className="h-2 rounded-full bg-teal-700 transition-[width] duration-500 motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * "Siz / Sektör medyanı / En iyi %10" karşılaştırması. Üç değer ortak bir
 * ölçeğe (üçünün en büyüğü) normalize edilir; böylece çubukların boyu
 * birbiriyle karşılaştırılabilir kalır.
 */
export function BenchmarkRows({
  benchmark,
  locale,
}: {
  benchmark: BenchmarkComparison;
  locale: "tr" | "en";
}) {
  const c = COPY[locale];
  const rows = [
    { label: c.benchmarkYou, value: benchmark.value, own: true },
    { label: c.benchmarkMedian, value: benchmark.median, own: false },
    { label: c.benchmarkTop, value: benchmark.top10, own: false },
  ];
  const scale = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="mt-4">
      <p className="typography-caption text-ink-500">{benchmark.label}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3">
            <span className="typography-caption text-ink-600 w-28 shrink-0">
              {row.label}
            </span>
            <span
              className="h-1.5 rounded-full bg-ink-100 flex-1 min-w-0"
              aria-hidden="true"
            >
              <span
                className={`block h-1.5 rounded-full ${row.own ? "bg-teal-700" : "bg-ink-300"}`}
                style={{ width: `${Math.round((row.value / scale) * 100)}%` }}
              />
            </span>
            <span className="mono tabular typography-caption text-ink-700 shrink-0">
              {formatBenchmarkValue(row.value, benchmark, locale)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Kategori/öncelik rozeti — tek biçim, iki kullanım. */
function Chip({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <span
      className={`typography-label inline-flex items-center rounded-full border px-3 py-1 uppercase tracking-widest ${tone ?? "border-ink-200 text-ink-600"}`}
    >
      {children}
    </span>
  );
}

// --- İlgili hizmetler --------------------------------------------------------

/**
 * Rapordan hizmete giden üç bağlantı. Slug çiftleri BURADA sabit: içerik
 * katmanının tamamını (`SERVICES`, ~500 KB kaynak) bir istemci bileşenine
 * çekmek yalnız üç ad ve üç slug için ölçülür bir bundle bedeli olurdu.
 * `target_service` olay parametresi kararlı TR slug'ıdır.
 */
const RELATED_SERVICES = [
  {
    slug: "cro",
    path: { tr: "/hizmetler/cro", en: "/hizmetler/cro" },
    name: { tr: "CRO — dönüşüm optimizasyonu", en: "CRO — conversion optimisation" },
  },
  {
    slug: "performans-pazarlama",
    path: {
      tr: "/hizmetler/performans-pazarlama",
      en: "/hizmetler/performance-marketing",
    },
    name: { tr: "Performans pazarlama", en: "Performance marketing" },
  },
  {
    slug: "e-ticaret",
    path: { tr: "/hizmetler/e-ticaret", en: "/hizmetler/e-commerce" },
    name: { tr: "E-ticaret", en: "E-commerce" },
  },
] as const;

// --- Bileşen -----------------------------------------------------------------

export function DiagnooReport({
  report,
  locale,
}: {
  report: DiagnooReportData;
  locale: "tr" | "en";
}) {
  const c = COPY[locale];
  const uid = useId();
  const money = moneyFormatter(locale);

  const sorted = [...report.roadmap].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
  const criticalCount = sorted.filter((r) => r.priority === "critical").length;

  // Veri kalitesi: dört finansal girdinin kaçı gerçekten ölçüldü.
  const sources = Object.values(report.financial.inputSources);
  const measuredCount = sources.filter((s) => s === "measured").length;
  const estimatedCount = sources.length - measuredCount;
  const dataQuality =
    measuredCount === 0
      ? c.dataQualityNone
      : estimatedCount === 0
        ? c.dataQualityAll
        : c.dataQualityMixed(measuredCount, estimatedCount);

  // Skor karnesi — dört boyut, hepsi ham ölçümden türer.
  const pixels = Object.values(report.funnel.pixelCoverage);
  const scoreRows = [
    {
      id: "semantic",
      label: locale === "tr" ? "Mesaj tutarlılığı" : "Message consistency",
      pct: toPct(report.semantic.messageCohesionScore),
      basis:
        locale === "tr"
          ? "Ana sayfa, kategori ve ürün metinlerinin aynı vaadi söyleme oranı."
          : "How consistently the home, category and product copy state one promise.",
    },
    {
      id: "ux",
      label: locale === "tr" ? "Arayüz ve eylem çağrısı" : "Interface and call to action",
      pct: toPct(
        (1 - report.vision.cognitiveLoadScore + report.vision.ctaVisibilityScore) / 2,
      ),
      basis:
        locale === "tr"
          ? "Bilişsel yükün tersi ile eylem çağrısı görünürlüğünün ortalaması."
          : "The average of inverted cognitive load and call-to-action visibility.",
    },
    {
      id: "speed",
      label: locale === "tr" ? "Hız ve satın alma akışı" : "Speed and purchase flow",
      pct: toPct(
        report.funnel.avgLcpMs <= 0 ? 1 : LCP_TARGET_MS / report.funnel.avgLcpMs,
      ),
      basis:
        locale === "tr"
          ? `Ortalama LCP ${formatCount(report.funnel.avgLcpMs, locale)} ms; ${formatCount(LCP_TARGET_MS, locale)} ms eşiğine göre normalize edildi.`
          : `Average LCP is ${formatCount(report.funnel.avgLcpMs, locale)} ms, normalised against the ${formatCount(LCP_TARGET_MS, locale)} ms threshold.`,
    },
    {
      id: "tracking",
      label: locale === "tr" ? "Ölçüm altyapısı" : "Tracking setup",
      pct: toPct(
        pixels.length === 0 ? 0 : pixels.filter(Boolean).length / pixels.length,
      ),
      basis:
        locale === "tr"
          ? `Denetlenen ${pixels.length} pikselin ${pixels.filter(Boolean).length} tanesi kurulu.`
          : `${pixels.filter(Boolean).length} of the ${pixels.length} inspected pixels are installed.`,
    },
  ];

  const claimedMetrics = new Set(Object.values(SCORE_BENCHMARKS).flat());
  const unclaimedBenchmarks = report.benchmarks.filter(
    (b) => !claimedMetrics.has(b.metric),
  );

  // Finansal girdi tablosu. `avgDelaySeconds` ve `messageCohesionScore`
  // taramanın kendi ölçümleridir — kaynakları `inputSources`ta yer almaz
  // çünkü ziyaretçiden hiç istenmez; ikisi de her koşulda ölçülmüştür.
  const fin = report.financial;
  const inputRows = [
    {
      label: c.inputTraffic,
      value: formatCount(fin.inputs.monthlyTraffic, locale),
      source: fin.inputSources.monthlyTraffic,
    },
    {
      label: c.inputAov,
      value: money.format(fin.inputs.aov),
      source: fin.inputSources.aov,
    },
    {
      label: c.inputCr,
      value: formatPercent(fin.inputs.conversionRate, locale),
      source: fin.inputSources.conversionRate,
    },
    {
      label: c.inputAdSpend,
      value:
        fin.inputs.monthlyAdSpend === null
          ? c.notEntered
          : money.format(fin.inputs.monthlyAdSpend),
      source: fin.inputSources.monthlyAdSpend,
    },
    {
      label: c.inputDelay,
      value: `${new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", { maximumFractionDigits: 1 }).format(fin.inputs.avgDelaySeconds)} ${c.seconds}`,
      source: "measured" as const,
    },
    {
      label: c.inputCohesion,
      value: formatPercent(fin.inputs.messageCohesionScore, locale),
      source: "measured" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-16">
      {/* 1 — Yönetici özeti */}
      <section aria-labelledby={`${uid}-summary`}>
        <h2 id={`${uid}-summary`} className="typography-h2 text-ink-900">
          {c.summaryHeading}
        </h2>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          {c.summaryLede(report.url, report.healthScore, sorted.length, criticalCount)}
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="v2-surface border border-surface-2 rounded-xl p-6">
            <dt className="typography-caption text-ink-500">{c.healthScore}</dt>
            <dd className="mt-2">
              <span className="typography-display-lg mono tabular text-ink-900">
                {report.healthScore}
              </span>{" "}
              <span className="typography-caption text-ink-500">{c.outOf}</span>
            </dd>
          </div>
          <div className="v2-surface border border-surface-2 rounded-xl p-6">
            <dt className="typography-caption text-ink-500">{c.recoverable}</dt>
            <dd className="typography-h3 mono tabular text-ink-900 mt-2">
              {formatRange(fin.totalRecoverable, locale)}
            </dd>
          </div>
          <div className="v2-surface border border-surface-2 rounded-xl p-6">
            <dt className="typography-caption text-ink-500">{c.roadmapCount}</dt>
            <dd className="typography-h3 mono tabular text-ink-900 mt-2">
              {sorted.length}
            </dd>
          </div>
        </dl>

        <p className="typography-caption text-ink-500 mt-6 max-w-prose-editorial">
          {dataQuality}
        </p>
      </section>

      {/* 2 — Skor karnesi */}
      <section aria-labelledby={`${uid}-score`}>
        <h2 id={`${uid}-score`} className="typography-h2 text-ink-900">
          {c.scoreHeading}
        </h2>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          {c.scoreLede}
        </p>

        <ul className="mt-8 flex flex-col gap-8">
          {scoreRows.map((row) => {
            const matched = report.benchmarks.filter((b) =>
              (SCORE_BENCHMARKS[row.id] ?? []).includes(b.metric),
            );
            return (
              <li key={row.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="typography-h3 text-ink-900">{row.label}</h3>
                  <span className="mono tabular typography-body-md text-ink-900 shrink-0">
                    {row.pct}
                  </span>
                </div>
                <ScoreBar pct={row.pct} />
                <p className="typography-caption text-ink-500 mt-2">{row.basis}</p>
                {matched.map((b) => (
                  <BenchmarkRows key={b.metric} benchmark={b} locale={locale} />
                ))}
              </li>
            );
          })}
        </ul>

        {unclaimedBenchmarks.length > 0 ? (
          <div className="mt-10 border-t border-surface-2 pt-6">
            <h3 className="typography-h3 text-ink-900">{c.benchmarkOther}</h3>
            {unclaimedBenchmarks.map((b) => (
              <BenchmarkRows key={b.metric} benchmark={b} locale={locale} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 3 — Kritik boşluklar */}
      <section aria-labelledby={`${uid}-gaps`}>
        <h2 id={`${uid}-gaps`} className="typography-h2 text-ink-900">
          {c.gapsHeading}
        </h2>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          {c.gapsLede}
        </p>

        <ul className="mt-8 flex flex-col gap-6">
          {sorted.map((item) => (
            <li
              key={item.title}
              className="v2-surface border border-surface-2 rounded-xl p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Chip>{CATEGORY_LABELS[item.category][locale]}</Chip>
                <Chip tone={PRIORITY_TONE[item.priority]}>
                  {PRIORITY_LABELS[item.priority][locale]}
                </Chip>
              </div>
              <h3 className="typography-h3 text-ink-900 mt-4">{item.title}</h3>
              <p className="typography-body-md text-ink-700 mt-2">{item.description}</p>

              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                <div>
                  <dt className="typography-caption text-ink-500">{c.impactLabel}</dt>
                  <dd className="mono tabular typography-body-md text-ink-900 mt-1">
                    {item.impactMonthly
                      ? formatRange(item.impactMonthly, locale)
                      : c.impactUnknown}
                  </dd>
                </div>
                <div>
                  <dt className="typography-caption text-ink-500">{c.effortLabel}</dt>
                  <dd className="mono tabular typography-body-md text-ink-900 mt-1">
                    {item.effortDays} {c.days}
                  </dd>
                </div>
              </dl>

              <p className="typography-caption text-ink-500 mt-4">
                <span className="mono uppercase tracking-widest">
                  {c.evidenceLabel}
                </span>{" "}
                {item.dataReference}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — Finansal projeksiyon */}
      <section aria-labelledby={`${uid}-financial`}>
        <h2 id={`${uid}-financial`} className="typography-h2 text-ink-900">
          {c.financialHeading}
        </h2>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          {c.financialLede}
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-surface-2">
                <th scope="col" className="typography-caption text-ink-500 py-3 pr-4">
                  {c.inputLabel}
                </th>
                <th scope="col" className="typography-caption text-ink-500 py-3 pr-4">
                  {c.valueLabel}
                </th>
                <th scope="col" className="typography-caption text-ink-500 py-3">
                  {c.sourceLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {inputRows.map((row) => (
                <tr key={row.label} className="border-b border-surface-2">
                  <th
                    scope="row"
                    className="typography-body-sm text-ink-700 py-3 pr-4 font-normal"
                  >
                    {row.label}
                  </th>
                  <td className="mono tabular typography-body-sm text-ink-900 py-3 pr-4 whitespace-nowrap">
                    {row.value}
                  </td>
                  <td className="py-3">
                    <Chip
                      tone={
                        row.source === "measured"
                          ? "border-success-500 text-success-700"
                          : "border-ink-200 text-ink-600"
                      }
                    >
                      {row.source === "measured" ? c.measured : c.estimated}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="mt-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-surface-2 pb-4">
            <dt className="typography-body-md text-ink-700">{c.lostSpeed}</dt>
            <dd className="mono tabular typography-body-md text-ink-900">
              {formatRange(fin.lostRevenueSpeed, locale)}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-surface-2 pb-4">
            <dt className="typography-body-md text-ink-700">{c.adWaste}</dt>
            <dd
              className={
                fin.adWaste
                  ? "mono tabular typography-body-md text-ink-900"
                  : "typography-caption text-ink-500"
              }
            >
              {fin.adWaste ? formatRange(fin.adWaste, locale) : c.adWasteNone}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <dt className="typography-h3 text-ink-900">{c.totalRecoverable}</dt>
            <dd className="mono tabular typography-h3 text-ink-900">
              {formatRange(fin.totalRecoverable, locale)}
            </dd>
          </div>
        </dl>

        <details className="group mt-8 border-t border-surface-2 pt-6">
          <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
            <h3 className="typography-h3 text-ink-900">{c.methodology}</h3>
            <span
              aria-hidden="true"
              className="text-ink-500 typography-body-md transition-transform duration-200 group-open:rotate-45 shrink-0 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <p className="typography-body-sm text-ink-700 mt-4 max-w-prose-editorial">
            {c.methodologyLede}
          </p>
          <ul className="mt-4 flex flex-col gap-5">
            {fin.methodology.map((note) => (
              <li key={note.constant} className="border-t border-surface-2 pt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="mono typography-body-sm text-ink-900">
                    {note.constant}
                  </span>
                  <span className="mono tabular typography-body-sm text-ink-900">
                    {note.value}
                  </span>
                </div>
                <p className="typography-caption text-ink-600 mt-2">
                  <span className="mono uppercase tracking-widest">
                    {c.sourceColumn}
                  </span>{" "}
                  {note.source}
                </p>
                <p className="typography-body-sm text-ink-700 mt-1">{note.note}</p>
              </li>
            ))}
          </ul>
        </details>
      </section>

      {/* 5 — Yol haritası */}
      <section aria-labelledby={`${uid}-roadmap`}>
        <h2 id={`${uid}-roadmap`} className="typography-h2 text-ink-900">
          {c.roadmapHeading}
        </h2>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          {c.roadmapLede}
        </p>

        <div className="mt-8 border-t border-surface-2">
          {sorted.map((item) => (
            <details
              key={item.title}
              className="group border-b border-surface-2 py-5"
              onToggle={(e) => {
                // Yalnız açılış sayılır (FaqAccordion ile aynı gerekçe):
                // kapanış bir ilgi sinyali değil.
                if (!e.currentTarget.open) return;
                track({
                  name: "tool_roadmap_item_expanded",
                  properties: {
                    slug: DIAGNOO_SLUG,
                    category: item.category,
                    locale,
                  },
                });
              }}
            >
              <summary className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 cursor-pointer list-none">
                <span className="typography-body-md text-ink-900">{item.title}</span>
                <span className="mono tabular typography-body-sm text-ink-700 shrink-0">
                  {item.impactMonthly
                    ? formatRange(item.impactMonthly, locale)
                    : c.impactUnknown}
                </span>
              </summary>
              <div className="mt-3 max-w-prose-editorial">
                <p className="typography-body-sm text-ink-700">{item.description}</p>
                <p className="typography-caption text-ink-500 mt-2">
                  {CATEGORY_LABELS[item.category][locale]} ·{" "}
                  {PRIORITY_LABELS[item.priority][locale]} · {item.effortDays} {c.days}
                </p>
                <p className="typography-caption text-ink-500 mt-1">
                  <span className="mono uppercase tracking-widest">
                    {c.evidenceLabel}
                  </span>{" "}
                  {item.dataReference}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 6 — Sonraki adım */}
      <section aria-labelledby={`${uid}-next`}>
        <h2 id={`${uid}-next`} className="typography-h2 text-ink-900">
          {c.nextHeading}
        </h2>
        <div className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 mt-6 flex flex-col items-start gap-5">
          <p className="typography-body-md text-ink-700 max-w-prose-editorial">
            {c.nextLede}
          </p>
          <PopupCTAButton source="tool-diagnoo-report" className="btn btn-primary">
            {c.nextCta}
          </PopupCTAButton>

          <div className="border-t border-surface-2 pt-5 w-full">
            <p className="typography-caption text-ink-500">{c.servicesLede}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {RELATED_SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={localeHref(service.path[locale], locale)}
                    className="group inline-flex items-baseline gap-2 py-1 typography-body-md text-ink-800 hover:text-ink-900"
                    onClick={() =>
                      track({
                        name: "tool_service_cta_clicked",
                        properties: {
                          slug: DIAGNOO_SLUG,
                          target_service: service.slug,
                          locale,
                        },
                      })
                    }
                  >
                    {service.name[locale]}
                    <span aria-hidden="true" className="arrow text-ink-500">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
