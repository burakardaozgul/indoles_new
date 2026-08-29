/**
 * Rezervasyon parametreleri — tek doğruluk kaynağı (spec §3.1b).
 *
 * Bu değerler koda gömülmez çünkü değişmeleri kod değişikliği değil değer
 * değişikliği olmalı; çoklu danışmana geçilirse her danışman kendi
 * penceresini taşıyacak.
 */
export const BOOKING_CONFIG = {
  /** Takvimde kapanan blok. Ziyaretçiye verilen vaat 1 saattir — fark kasıtlı. */
  slotMinutes: 90,
  /** Görüşmeler arası tampon: uzayan görüşme sonrakini kaydırmasın. */
  bufferMinutes: 15,
  windowStart: "13:00",
  /** Görüşme bu saatte BİTMİŞ olmalı, başlamış değil. */
  windowEnd: "20:00",
  /** 1=Pazartesi … 6=Cumartesi. Pazar kapalı. */
  openDays: [1, 2, 3, 4, 5, 6],
  /** Tek seferlik başlangıç; bundan önceki günler hiç gösterilmez. */
  firstAvailableDate: "2026-08-31",
  /** Sürekli kural: başlangıcına bu kadar saatten az kalan slot gösterilmez. */
  minLeadHours: 24,
  timezone: "Europe/Istanbul",
  /** Launch'ta tek danışman; alan çoklu danışman için bugünden var. */
  consultantId: "burak",
} as const;
