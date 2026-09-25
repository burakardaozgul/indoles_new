import type { Locale, Pillar, ServiceContent } from "../types";
import { markaStratejisi } from "./marka-stratejisi";
import { performansPazarlama } from "./performans-pazarlama";
import { cro } from "./cro";
import { eTicaret } from "./e-ticaret";
import { uiUxTasarim } from "./ui-ux-tasarim";
import { geoDanismanligi } from "./geo-danismanligi";
import { aiDanismanlik } from "./ai-danismanlik";
import { dijitalDonusum } from "./dijital-donusum";
import { isOtomasyonlari } from "./is-otomasyonlari";
import { isZekasi } from "./is-zekasi";
import { isletmeMuhendisligi } from "./isletme-muhendisligi";
import { ozelYazilimVeMobil } from "./ozel-yazilim-ve-mobil";
import { teknolojiVeAltyapi } from "./teknoloji-ve-altyapi";

/**
 * Hizmetlerin kanonik sırası — 13 hizmetin tamamı.
 *
 * Sabit ve tam liste. İçerik dosyaları sırayla yazılıyor ama sıra onlarla
 * birlikte büyümez: "kaç hizmetten kaçıncısı" göstergesi ve ana sayfa
 * kaydırıcısının kart sırası buradan gelir. Liste `SERVICES`ten
 * türetilseydi her yeni hizmet dosyasında yazılmış olan sayfaların numarası
 * sessizce kayardı.
 *
 * Sıra pillar'a göre bitişiktir (Growth → Transform → Build). 13. hizmet
 * `geo-danismanligi` (ADR-040, 2026-09-25) Growth'un sonuna girdi; ondan
 * sonraki yedi hizmetin numarası bilinçli olarak bir kaydı. Diyagram
 * ataması numaradan ayrıldı (`SERVICE_DIAGRAM_ORDER`) — hiçbir sayfanın
 * diyagramı değişmedi.
 */
export const SERVICE_ORDER: string[] = [
  "marka-stratejisi",
  "performans-pazarlama",
  "cro",
  "e-ticaret",
  "ui-ux-tasarim",
  "geo-danismanligi",
  "ai-danismanlik",
  "dijital-donusum",
  "is-otomasyonlari",
  "is-zekasi",
  "isletme-muhendisligi",
  "ozel-yazilim-ve-mobil",
  "teknoloji-ve-altyapi",
];

/** Yazılmış içerik dosyaları. `SERVICE_ORDER`ın bir alt kümesidir. */
export const SERVICES: ServiceContent[] = [
  markaStratejisi,
  performansPazarlama,
  cro,
  eTicaret,
  uiUxTasarim,
  geoDanismanligi,
  aiDanismanlik,
  dijitalDonusum,
  isOtomasyonlari,
  isZekasi,
  isletmeMuhendisligi,
  ozelYazilimVeMobil,
  teknolojiVeAltyapi,
];

/**
 * Slug'ı verilen locale'e göre çözer.
 *
 * Yalnız çağıran locale'in slug'ıyla eşleşir: EN sayfada TR slug gelirse
 * `null` döner ve 404 olur. İki URL'in aynı içeriği sunması canonical
 * sinyalini bölerdi.
 */
export function getService(slug: string, locale: Locale): ServiceContent | null {
  return SERVICES.find((s) => s.slug[locale] === slug) ?? null;
}

/**
 * Pillar'ın yazılmış hizmetleri, `SERVICE_ORDER` sırasında.
 *
 * Henüz yazılmamış slug'lar elenir — sıra tam liste, `SERVICES` alt küme.
 */
export function getServicesByPillar(pillar: Pillar): ServiceContent[] {
  return SERVICE_ORDER.map((slug) =>
    SERVICES.find((s) => s.slug.tr === slug),
  ).filter((s): s is ServiceContent => s !== undefined && s.pillar === pillar);
}

/** `SERVICE_ORDER` içindeki konum — "kaçıncı hizmet" numarası. -1 = bilinmeyen. */
export function serviceOrderIndex(slug: string): number {
  return SERVICE_ORDER.indexOf(slug);
}

/**
 * Diyagram ataması — `ServiceIllustration` varyantının indeksi.
 *
 * 2026-09-25'e kadar diyagram `SERVICE_ORDER` indeksinden seçiliyordu.
 * 13. hizmet Growth'un sonuna (6. sıra) girince o bağ yedi sayfanın
 * diyagramını kaydıracaktı; atama bu yüzden sıradan ayrıldı. İlk 12 kayıt
 * eski sıranın birebir kopyasıdır — her mevcut hizmet kendi diyagramını
 * korur. Yeni hizmet listenin SONUNA eklenir ve yeni varyantını alır;
 * araya eklemek bir sayfanın görselini sessizce değiştirir.
 */
export const SERVICE_DIAGRAM_ORDER: string[] = [
  "marka-stratejisi",
  "performans-pazarlama",
  "cro",
  "e-ticaret",
  "ui-ux-tasarim",
  "ai-danismanlik",
  "dijital-donusum",
  "is-otomasyonlari",
  "is-zekasi",
  "isletme-muhendisligi",
  "ozel-yazilim-ve-mobil",
  "teknoloji-ve-altyapi",
  "geo-danismanligi",
];

/** Hizmetin diyagram varyantı. -1 = bilinmeyen (diyagram basılmaz). */
export function serviceDiagramIndex(slug: string): number {
  return SERVICE_DIAGRAM_ORDER.indexOf(slug);
}
