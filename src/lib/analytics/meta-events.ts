import type { AnalyticsEvent } from "./events";

/**
 * Site taksonomisi → Meta standart olayı eşlemesi (ADR-033).
 *
 * NEDEN AYRI VE SAF
 * -----------------
 * Eşleme `track()` içine gömülseydi test edilebilmesi için `window.fbq`
 * gerekirdi. Burada saf bir fonksiyon: girdi tipli olay, çıktı Meta
 * yükü. `ga.ts` yalnız sonucu Pixel'e verir.
 *
 * NEDEN STANDART OLAYLAR
 * ----------------------
 * `ViewContent` ve `Lead` Meta'nın tanıdığı adlar; özel olay adları da
 * kitle kurmaya yarar ama standart olanlar reklam optimizasyonunda
 * doğrudan kullanılabiliyor ve Events Manager'da hazır raporları var.
 *
 * NEDEN HER OLAY EŞLENMİYOR
 * -------------------------
 * Yalnız retargeting segmenti üretebilecek olanlar eşlendi. `faq_opened`
 * ya da `persona_axis_clicked` gibi mikro etkileşimler Meta'ya taşınsa
 * kitleleri seyreltir, reklam tarafında karar değiştirmez.
 */

export type MetaEventPayload = {
  name: "ViewContent" | "Lead";
  params?: Record<string, string | number | readonly string[]>;
};

/** Meta tarafında "Lead" sayılan dönüşümler. */
const LEAD_EVENTS: ReadonlySet<string> = new Set([
  "contact_form_submitted",
  "contact_booking_submitted",
  "popup_booking_submitted",
  "popup_contact_submitted",
  "tool_report_requested",
]);

/**
 * Bir taksonomi olayının Meta karşılığını üretir; karşılığı yoksa `null`.
 *
 * `content_ids` her zaman TR slug'ı taşır — `view-events.ts`teki kararla
 * aynı gerekçe: dile göre ayrışan kimlik aynı varlığı iki kitleye böler.
 */
export function toMetaEvent(event: AnalyticsEvent): MetaEventPayload | null {
  if (LEAD_EVENTS.has(event.name)) return { name: "Lead" };

  const p = event.properties as Record<string, unknown> | undefined;

  switch (event.name) {
    case "service_viewed":
      return {
        name: "ViewContent",
        params: {
          content_type: "service",
          content_ids: [String(p?.slug ?? "")],
          content_category: String(p?.pillar ?? ""),
        },
      };

    case "package_viewed":
      return {
        name: "ViewContent",
        params: {
          content_type: "package",
          content_ids: [String(p?.packageSlug ?? "")],
          content_category: String(p?.pillar ?? ""),
          // Paket fiyatı Meta'ya değer olarak gider: değer bazlı kitleler
          // ve ROAS raporları bunu kullanır.
          value: Number(p?.price ?? 0),
          currency: String(p?.currency ?? "TRY"),
        },
      };

    case "case_study_viewed":
      return {
        name: "ViewContent",
        params: {
          content_type: "case_study",
          content_ids: [String(p?.slug ?? "")],
          content_category: String(p?.problemType ?? ""),
        },
      };

    case "tool_scan_completed":
      // Araç taramasını bitiren ziyaretçi en sıcak retargeting segmenti:
      // sorunu ölçtü, sonucu gördü, henüz rapor istemedi.
      return {
        name: "ViewContent",
        params: {
          content_type: "tool",
          content_ids: [String(p?.slug ?? "")],
          content_category: String(p?.band ?? ""),
        },
      };

    default:
      return null;
  }
}
