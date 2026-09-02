import type { DiagnooReport as DiagnooReportData } from "@/lib/tools/diagnoo/schema";

/**
 * Kilidi açılmış tam rapor — Görev 14'te YALNIZ imza ve sağlık skoru.
 *
 * Görev 15 buraya yol haritasını, TL aralıklarını, ölçüldü/tahmin rozetlerini
 * ve yöntem ekini ekler. `report` tek girdidir: rapor sayfası kaydı D1'den
 * zaten çözülmüş hâlde geçirir, bileşen ikinci bir sorgu açmaz.
 *
 * Tip adı `DiagnooReportData` olarak içe aktarılır: dışa aktarılan bileşenin
 * adıyla (`DiagnooReport`) çakışmasın diye — ad seçimi Görev 15'in beklediği
 * imzayla sabit.
 */

const COPY = {
  tr: { heading: "Sağlık skoru", caption: "100 üzerinden" },
  en: { heading: "Health score", caption: "out of 100" },
} as const;

export function DiagnooReport({
  report,
  locale,
}: {
  report: DiagnooReportData;
  locale: "tr" | "en";
}) {
  const c = COPY[locale];
  return (
    <div>
      <h2 className="typography-h2 text-ink-900">{c.heading}</h2>
      <p className="mono tabular text-ink-900 mt-4">
        <span className="typography-display-lg">{report.healthScore}</span>{" "}
        <span className="typography-caption text-ink-500">{c.caption}</span>
      </p>
    </div>
  );
}
