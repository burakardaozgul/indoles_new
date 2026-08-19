import type { Localized, Pillar } from "./types";

export type IndustryContent = {
  slug: string;
  name: Localized<string>;
  /** Bu sektörde ağırlıklı çalışılan pillar — filtreleme ve renklendirme için. */
  pillar: Pillar;
  /** Sektörün INDOLES'e getirdiği tipik problem — tek cümle. */
  problem: Localized<string>;
};

/**
 * Faaliyet gösterilen sektörler.
 *
 * Not: tasarım dosyasında her sektörün yanında bir proje sayacı vardı
 * ("31 proje" vb.). Bu sayılar doğrulanamadığı için taşınmadı; yerine
 * sektörün getirdiği tipik problem yazılıyor — kanıt-odaklı dile daha uygun
 * ve doğrulanabilir. Gerçek proje sayıları netleştiğinde alan eklenebilir.
 */
export const INDUSTRIES: IndustryContent[] = [
  {
    slug: "uretim-otomotiv",
    name: { tr: "Üretim ve otomotiv", en: "Manufacturing & automotive" },
    pillar: "transform",
    problem: {
      tr: "Hat verisi toplanıyor ama karara dönüşmüyor.",
      en: "Line data is collected but never turns into decisions.",
    },
  },
  {
    slug: "perakende-eticaret",
    name: { tr: "Perakende ve e-ticaret", en: "Retail & e-commerce" },
    pillar: "growth",
    problem: {
      tr: "Reklam harcaması artıyor, büyüme aynı oranda gelmiyor.",
      en: "Ad spend rises; growth does not follow at the same rate.",
    },
  },
  {
    slug: "gida-icecek",
    name: { tr: "Gıda ve içecek", en: "Food & beverage" },
    pillar: "growth",
    problem: {
      tr: "Marka bilinirliği raf payına dönüşmüyor.",
      en: "Brand awareness is not converting into shelf share.",
    },
  },
  {
    slug: "tekstil-hazir-giyim",
    name: { tr: "Tekstil ve hazır giyim", en: "Textile & apparel" },
    pillar: "transform",
    problem: {
      tr: "İhracat pazarında maliyet rekabeti marjı eritiyor.",
      en: "Cost competition in export markets is eroding margin.",
    },
  },
  {
    slug: "telekom-teknoloji",
    name: { tr: "Telekom ve teknoloji", en: "Telecom & technology" },
    pillar: "build",
    problem: {
      tr: "Legacy sistem yeni ürün hızını kesiyor.",
      en: "Legacy systems are throttling new product velocity.",
    },
  },
  {
    slug: "kozmetik-kisisel-bakim",
    name: { tr: "Kozmetik ve kişisel bakım", en: "Cosmetics & personal care" },
    pillar: "growth",
    problem: {
      tr: "Kanal çeşitliliği var, tek bir büyüme sistemi yok.",
      en: "Channels are many; a single growth system is missing.",
    },
  },
  {
    slug: "lojistik-tedarik",
    name: { tr: "Lojistik ve tedarik zinciri", en: "Logistics & supply chain" },
    pillar: "transform",
    problem: {
      tr: "Tedarik ve üretim verisi birbirinden kopuk.",
      en: "Supply and production data live in separate worlds.",
    },
  },
  {
    slug: "hizmet-danismanlik",
    name: { tr: "Hizmet ve profesyonel danışmanlık", en: "Services & professional advisory" },
    pillar: "build",
    problem: {
      tr: "Süreçler kişiye bağlı, ölçeklenmiyor.",
      en: "Processes depend on individuals and refuse to scale.",
    },
  },
];
