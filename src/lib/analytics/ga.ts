import { EVENT_PARAM_NAMES, type AnalyticsEvent, type EventParamName } from "./events";
import { trackMetaStandardEvent } from "./meta-pixel";
import { toMetaEvent } from "./meta-events";

/**
 * GA4 olay katmanı (ADR-021 → ADR-033 → ADR-034).
 *
 * SAHİPLİK: GA4'ü GTM taşır (ADR-034). Site `dataLayer`a yazar; konteynerdeki
 * tek GA4 olay etiketi (`GA4 - Olay Koprusu`) okur ve mülke gönderir.
 *
 * NEDEN `gtag('event')` ARTIK ÇAĞRILMIYOR
 * ---------------------------------------
 * Önceden olay iki biçimde yazılıyordu: `gtag('event', ...)` (bu, `dataLayer`a
 * bir **arguments** nesnesi düşürür) ve ayrıca açık bir `{event: ...}` push'u.
 * İkinci push'un gerekçesi GTM'in Custom Event tetikleyicisinin yalnız
 * `{event: ...}` biçimini gördüğü varsayımıydı. Varsayım yanlıştı: GTM
 * gtag'in arguments push'unu DA olay olarak tanıyor.
 *
 * Sonuç canlıda ölçüldü (2026-09-09): tek bir kullanıcı eylemi GA4'e İKİ olay
 * gönderiyordu ve ilki, `dataLayer`ın üst düzey anahtarları henüz
 * güncellenmediği için parametresiz gidiyordu:
 *
 *     en=tool_roadmap_item_expanded                                  ← parametresiz
 *     en=tool_roadmap_item_expanded&ep.slug=…&ep.category=…&ep.locale=…
 *
 * Yani tüm olay sayıları ~2×, ve her özel boyut kırılımının yarısı `(not set)`.
 * Tek yazım bunu kökten bitirir: bir eylem → bir `dataLayer` kaydı → bir olay.
 *
 * Consent Mode komutları (`consent default/update`) hâlâ `gtag()` ile
 * basılıyor — onlar `ga-bootstrap.ts`te ve olay değil, sinyal.
 */

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Bir olayın taşıyabileceği parametreler.
 *
 * NEDEN SERBEST `Record<string, …>` DEĞİL
 * ---------------------------------------
 * Kapalı olmasaydı `EVENT_PARAM_NAMES`te bulunmayan bir ad yazılabilirdi ve
 * o ad hem sıfırlamadan kaçar (sonraki olaylara sızar) hem GA4'te kayıtlı
 * bir özel boyuta düşmediği için raporlarda hiç görünmezdi. İkisi de sessiz.
 * Gerçek bir örnek yakalandı: `popup_booking_submitted` `preferred_slot`
 * gönderiyordu; ne listede, ne GTM'de, ne GA4'te vardı (2026-09-09).
 *
 * Kapalı tip bunu derleme hatasına çevirir: yeni parametre eklemek isteyen
 * önce `EVENT_PARAM_NAMES`e yazmak zorunda, oradan da GTM ve GA4 kurulumu
 * `docs/12` §2.3'teki listeyle senkron tutuluyor.
 */
export type EventParams = Partial<Record<EventParamName, string | number | boolean | undefined>>;

/**
 * Önceki olaydan kalan parametreleri temizleyen taban nesne.
 * Gerekçesi `EVENT_PARAM_NAMES`in başında — GTM değişkenleri push'lar arası
 * kalıcı olduğu için her olay öncekinin parametrelerini miras alıyordu.
 */
function resetParams(): Record<string, undefined> {
  const out: Record<string, undefined> = {};
  for (const name of EVENT_PARAM_NAMES) out[name] = undefined;
  return out;
}

/**
 * Serbest biçimli GA4 olayı — taksonomi dışı, sayfa içi etkileşimler için.
 *
 * `gtag` hazır olup olmaması artık önemli değil: yazılan şey `dataLayer`
 * kaydı, ve GTM konteyner yüklendiğinde kendisinden önce birikmiş kayıtları
 * da işler. Görüntüleme olaylarının hydration'da kaybolma sorunu (2026-09-09)
 * bu yüzden geri gelmez.
 */
export function gaEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...resetParams(), ...(params ?? {}) });

  /*
   * META — TEK KAPI BURASI (ADR-036)
   * --------------------------------
   * Meta çağrısı önce `track()` içindeydi ve yorumu "track her dönüşümün
   * geçtiği tek kapı" diyordu. Değildi: `gaEvent` de dışa açık ve beş Meta
   * dönüşümünün ÜÇÜ onu doğrudan kullanıyor (`contact_form_submitted`,
   * `popup_booking_submitted`, `popup_contact_submitted` — ikincisi ve
   * üçüncüsü `trackPopupEvent` üzerinden). O üçü `LEAD_EVENTS` listesinde
   * yazılı, eşleme onları doğru çeviriyor, birim testleri de geçiyordu — ama
   * kimse onlar için eşlemeyi çağırmıyordu. Meta reklam optimizasyonu gerçek
   * lead'lerin ~%40'ıyla çalışıyordu (denetim, 2026-09-09).
   *
   * Çağrı buraya inince kapı gerçekten tek oldu: `track` de zaten buradan
   * geçiyor, serbest olaylar da.
   */
  const meta = toMetaEvent(name, params as Record<string, unknown> | undefined);
  // `server` kanallı olaylar (Lead) tarayıcıdan GÖNDERİLMEZ — kimliği olan
  // kopyayı form handler'ı yollar (`meta-lead.ts`). Gerekçe `MetaChannel`de.
  if (meta && meta.channel === "browser") {
    trackMetaStandardEvent(meta.name, meta.params);
  }
}

/**
 * Tipli taksonomi olayı (`events.ts`).
 *
 * Artık yalnız bir tip sarmalayıcısı: Meta dahil tüm yan etkiler `gaEvent`te.
 */
export function track<E extends AnalyticsEvent>(event: E): void {
  gaEvent(event.name, event.properties as EventParams);
}
