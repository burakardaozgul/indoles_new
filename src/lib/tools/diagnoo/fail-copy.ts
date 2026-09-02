/**
 * Diagnoo başarısız durum kopyası — Görev 17.3, tek kaynak.
 *
 * İstemci (`diagnoo-tool.tsx`, canlı yoklamanın `failed` aşaması) ve sunucu
 * (rapor sayfası, `rapor/[id]/page.tsx`, D1'den tek anlık görüntü) AYNI
 * eşlemeyi paylaşır — önceden bu metinler `diagnoo-tool.tsx` içinde
 * tanımlıydı, rapor sayfası ayrı ve daha zayıf tek bir genel cümle
 * kullanıyordu (`failReason`e hiç bakmıyordu). Kopya tekrarı yok.
 *
 * `scrape_failed`/`pipeline_error` — `markFailed` ile D1'e yazılan İKİ
 * gerçek sebep (`pipeline.ts`). `not_found`/`network_error` yalnız istemci
 * tarafında `useDiagnooStatus`'un ürettiği SENTETİK sebepler (durum ucu
 * yoklaması sırasında oluşur) — sunucu tarafı `row.failReason` bu ikisini
 * hiç almaz, ama eşleme genel kalsın diye ikisi de burada tutulur.
 */
export type DiagnooLocale = "tr" | "en";

export const DIAGNOO_FAIL_COPY = {
  tr: {
    scrapeFailed:
      "Bu adres taranamadı. Site yanıt vermiyor veya taramaya kapalı olabilir; adresi kontrol edip yeniden deneyin.",
    notFound: "Bu teşhis bulunamadı. Yeni bir tarama başlatabilirsiniz.",
    generic: "Tarama tamamlanamadı. Adresi kontrol edip yeniden başlatın.",
    networkError:
      "Tarama durumuna ulaşılamıyor. Bağlantınızı kontrol edip sayfayı yenileyin; tarama sunucuda sürüyor olabilir.",
  },
  en: {
    scrapeFailed:
      "This address could not be fetched. The site may not be responding or may be closed to scanning; check the address and try again.",
    notFound: "This diagnostic was not found. You can start a new scan.",
    generic: "The scan could not finish. Check the address and start it again.",
    networkError:
      "The scan status cannot be reached. Check your connection and refresh the page; the scan may still be running on the server.",
  },
} as const;

/** Dürüst hata metni: sebep neyse o söylenir, genel bir cümleye sarılmaz. */
export function diagnooFailureMessage(reason: string | null, locale: DiagnooLocale): string {
  const c = DIAGNOO_FAIL_COPY[locale];
  if (reason === "scrape_failed") return c.scrapeFailed;
  if (reason === "not_found") return c.notFound;
  if (reason === "network_error") return c.networkError;
  return c.generic;
}
