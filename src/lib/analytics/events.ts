/**
 * Typed event taksonomisi.
 * Detay: docs/12-analytics-measurement.md §2.
 */

export type Persona = "industrial" | "commerce" | "unknown";
export type Pillar = "growth" | "transform" | "build";
export type Budget = "small" | "medium" | "large";
export type Timeline = "urgent" | "normal" | "flexible";

/**
 * Görüşme CTA'sının basıldığı yüzey.
 *
 * Kapalı birleşim: yeni bir CTA eklendiğinde adını buraya yazmak zorunlu,
 * yoksa derlenmez. `openPopup` bunu parametre olarak istediği için olayın
 * atlanması da mümkün değil — CTA'yı açan tek yol o fonksiyon.
 *
 * Sayfa kimliği burada TAŞINMAZ: GA4 her olaya `page_location` ekliyor,
 * yani "hangi sayfadaki iletişim şeridi" sorusu zaten cevaplı. Burada
 * yalnız yerleşim adı durur; `contact-callout` beş sayfa tipinde
 * göründüğü hâlde tek kaynak adı yeterli.
 */
export type BookingCtaSource =
  | "nav"
  | "nav-mobile"
  | "contact-callout"
  | "service-detail"
  | "package-detail"
  | "consultant-detail";

/** SSS bloğunun bulunduğu sayfa tipi. */
export type FaqSurface = "service" | "pillar" | "package" | "case" | "article";

/**
 * GA4 metin parametresi üst sınırı. Aşan değer sessizce kırpılır — kırpmayı
 * kendimiz yaparsak neyin kaybolduğunu biliriz.
 */
export const EVENT_PARAM_MAX = 100;

export function truncateParam(value: string): string {
  return value.length <= EVENT_PARAM_MAX ? value : value.slice(0, EVENT_PARAM_MAX);
}

/**
 * Olay adlarının çalışma zamanındaki listesi.
 *
 * Birleşim tipi tek başına yeterdi ama tip çalışma zamanında yok — GA4'ün
 * "snake_case, ≤40 karakter" kuralı (docs/12 §2) bu yüzden hiçbir şey
 * tarafından zorlanmıyordu. Liste değer olarak durunca kural teste bağlanır.
 * `AnalyticsEvent["name"]` ile bağı derleyici kontrol eder (aşağıda).
 */
export const EVENT_NAMES = [
  "homepage_hero_viewed",
  "persona_axis_clicked",
  "pillar_viewed",
  "service_viewed",
  "package_viewed",
  "case_study_viewed",
  "faq_opened",
  "booking_cta_clicked",
  "brief_submitted",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export type AnalyticsEvent =
  | { name: "homepage_hero_viewed"; properties: { persona: Persona } }
  | {
      name: "persona_axis_clicked";
      properties: { axis: "industrial" | "commerce" };
    }
  | {
      name: "pillar_viewed";
      properties: { pillar: Pillar; locale: "tr" | "en" };
    }
  | {
      /**
       * 12 para sayfasının görüntülenmesi. `page_view` yolu biliyor ama
       * pillar kırılımını bilmiyor; keyword işinin (Dalga 3) karşılığı
       * ancak bu kırılımla okunur.
       */
      name: "service_viewed";
      properties: { slug: string; pillar: Pillar; locale: "tr" | "en" };
    }
  | {
      name: "package_viewed";
      properties: {
        packageSlug: string;
        pillar: Pillar;
        price: number;
        currency: string;
      };
    }
  | {
      name: "case_study_viewed";
      properties: { slug: string; problemType: string; pillar: Pillar };
    }
  | {
      /**
       * 44 SSS yüzeyinin gerçekten okunup okunmadığı — GEO yatırımının
       * (~700 soru-cevap) tek doğrudan ölçüsü.
       */
      name: "faq_opened";
      properties: { surface: FaqSurface; question: string };
    }
  | { name: "booking_cta_clicked"; properties: { source: BookingCtaSource; pillar?: Pillar } }
  | {
      name: "brief_submitted";
      properties: {
        briefId: string;
        pillar?: Pillar;
        budget: Budget;
        timeline: Timeline;
      };
    };

/**
 * Birleşimdeki her adın `EVENT_NAMES`te bulunduğunu derleyiciye doğrulatır.
 * Yeni bir olay eklenip listeye yazılmazsa burada derleme hatası çıkar.
 */
type AssertNamesCovered = AnalyticsEvent["name"] extends EventName ? true : never;
const _namesCovered: AssertNamesCovered = true;
void _namesCovered;
