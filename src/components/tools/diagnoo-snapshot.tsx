import type { SnapshotView } from "@/lib/tools/diagnoo/schema";

/**
 * Ücretsiz anlık görünüm — Görev 14'te YALNIZ imza ve sağlık skoru.
 *
 * Görev 15 buraya en yüksek etkili üç boşluğu, kıyas çubuklarını ve kilit
 * açma formunu ekler; imza (`snapshot` + `diagnosticId` + `locale`) o iş için
 * gereken üç girdinin tamamıdır, bu yüzden rapor sayfası bir daha
 * düzenlenmez. `diagnosticId` kilit açma çağrısının (`diagnoo-unlock`) hedef
 * kaydıdır.
 *
 * Sunucu bileşeni: hook ve tarayıcı API'si taşımaz (`GeoResult` deseni);
 * istemci tarafı yalnız kilit açma formunda gerekecek.
 */

const COPY = {
  tr: { heading: "Sağlık skoru", caption: "100 üzerinden" },
  en: { heading: "Health score", caption: "out of 100" },
} as const;

export function DiagnooSnapshot({
  snapshot,
  diagnosticId,
  locale,
}: {
  snapshot: SnapshotView;
  diagnosticId: string;
  locale: "tr" | "en";
}) {
  const c = COPY[locale];
  return (
    <div data-diagnostic-id={diagnosticId}>
      <h2 className="typography-h2 text-ink-900">{c.heading}</h2>
      <p className="mono tabular text-ink-900 mt-4">
        <span className="typography-display-lg">{snapshot.healthScore}</span>{" "}
        <span className="typography-caption text-ink-500">{c.caption}</span>
      </p>
    </div>
  );
}
