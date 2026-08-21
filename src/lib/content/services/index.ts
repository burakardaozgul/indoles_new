import type { Locale, Pillar, ServiceContent } from "../types";
import { markaStratejisi } from "./marka-stratejisi";
import { performansPazarlama } from "./performans-pazarlama";
import { cro } from "./cro";
import { eTicaret } from "./e-ticaret";
import { uiUxTasarim } from "./ui-ux-tasarim";
import { aiDanismanlik } from "./ai-danismanlik";
import { dijitalDonusum } from "./dijital-donusum";
import { isOtomasyonlari } from "./is-otomasyonlari";
import { isZekasi } from "./is-zekasi";
import { isletmeMuhendisligi } from "./isletme-muhendisligi";
import { ozelYazilimVeMobil } from "./ozel-yazilim-ve-mobil";
import { teknolojiVeAltyapi } from "./teknoloji-ve-altyapi";

/**
 * Hizmetlerin kanonik sırası — 12 hizmetin tamamı.
 *
 * Sabit ve tam liste. İçerik dosyaları sırayla yazılıyor ama sıra onlarla
 * birlikte büyümez: `ServiceIllustration` diyagramını bu dizideki indeksle
 * seçiyor ve "kaç hizmetten kaçıncısı" göstergesi uzunluğunu buradan alıyor.
 * Liste `SERVICES`ten türetilseydi her yeni hizmet dosyasında yazılmış olan
 * sayfaların diyagramı ve numarası sessizce kayardı.
 *
 * Sıra `pillars.ts`teki hizmet sırasıyla birebir aynıdır.
 */
export const SERVICE_ORDER: string[] = [
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
];

/** Yazılmış içerik dosyaları. `SERVICE_ORDER`ın bir alt kümesidir. */
export const SERVICES: ServiceContent[] = [
  markaStratejisi,
  performansPazarlama,
  cro,
  eTicaret,
  uiUxTasarim,
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

/** `SERVICE_ORDER` içindeki konum — diyagramı seçer. -1 = bilinmeyen. */
export function serviceOrderIndex(slug: string): number {
  return SERVICE_ORDER.indexOf(slug);
}
