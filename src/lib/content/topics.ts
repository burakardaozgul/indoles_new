import type { ArticleTopic, Localized } from "./types";

/**
 * Yazı konu kaydı (ADR-021).
 *
 * Bilgi kütüphanesi filtresinin tek ekseni. Konular uydurulmadı —
 * `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` §2'deki niyet-bazlı
 * keyword kümelerinin birebir karşılığı. Bu yüzden her konunun bir hedef
 * hizmet sayfası var: strateji "her kümenin tek hedef sayfası olur, iç
 * rekabet yasak" diyor, eşleme o kuralı yazı tarafında da uygulanabilir kılıyor.
 *
 * Sıra editoryaldir; filtre şeridi bu sırayı korur (alfabetik değil, öncelik
 * bazlı: P0 kümeler önde).
 */
export type TopicDef = {
  id: ArticleTopic;
  label: Localized<string>;
  /** Filtre seçiliyken başlık altına düşen tek cümlelik açıklama. */
  blurb: Localized<string>;
  /**
   * Kümenin hedef hizmet sayfası (TR slug). `null` ise hizmet sayfası yok —
   * `geo` kümesinde hedef yazıların kendisi, `video-kreatif`te sayfa henüz
   * açılmadı (ADR-021 açık iş).
   */
  serviceSlug: string | null;
};

export const TOPICS: TopicDef[] = [
  {
    id: "yapay-zeka",
    label: { tr: "Yapay Zeka ve Dijital Dönüşüm", en: "AI & Digital Transformation" },
    blurb: {
      tr: "Yapay zekayı işin içine sokmanın yolu: pilot proje, süreç otomasyonu, geri dönüş hesabı.",
      en: "Putting AI to work: pilot projects, process automation, return on investment.",
    },
    serviceSlug: "ai-danismanlik",
  },
  {
    id: "geo",
    label: { tr: "Yapay Zeka Aramaları (GEO)", en: "AI Search (GEO)" },
    blurb: {
      tr: "ChatGPT, Gemini ve AI Overviews cevap verirken sizi neden anmıyor — ve nasıl anar.",
      en: "Why ChatGPT, Gemini and AI Overviews don't cite you yet — and how they start.",
    },
    serviceSlug: null,
  },
  {
    id: "cro",
    label: { tr: "Dönüşüm Optimizasyonu", en: "Conversion Optimisation" },
    blurb: {
      tr: "Aynı trafikten daha fazla satış: test disiplini, sepet terki, sosyal kanıt.",
      en: "More sales from the same traffic: testing discipline, cart abandonment, social proof.",
    },
    serviceSlug: "cro",
  },
  {
    id: "performans-pazarlama",
    label: { tr: "Performans Pazarlama", en: "Performance Marketing" },
    blurb: {
      tr: "Reklam bütçesinin hesabını verme sanatı: ROAS, CAC, kanal karması, talep yaratma.",
      en: "Holding ad spend accountable: ROAS, CAC, channel mix, demand generation.",
    },
    serviceSlug: "performans-pazarlama",
  },
  {
    id: "musteri-elde-tutma",
    label: { tr: "Müşteri Elde Tutma", en: "Retention & LTV" },
    blurb: {
      tr: "Yeni müşteri pahalı, mevcut müşteri bedava değil: RFM, LTV, sadakat matematiği.",
      en: "New customers cost; existing ones aren't free either: RFM, LTV, loyalty maths.",
    },
    serviceSlug: "performans-pazarlama",
  },
  {
    id: "e-ticaret",
    label: { tr: "E-Ticaret", en: "E-commerce" },
    blurb: {
      tr: "Mağaza kurmakla mağaza büyütmek ayrı işler — ikincisinin metodu.",
      en: "Opening a store and growing one are different jobs — this is the second one's method.",
    },
    serviceSlug: "e-ticaret",
  },
  {
    id: "ui-ux",
    label: { tr: "UI/UX ve Web Tasarım", en: "UI/UX & Web Design" },
    blurb: {
      tr: "Arayüz güzel olduğu için değil, doğru kararı kolaylaştırdığı için işe yarar.",
      en: "An interface works because it makes the right decision easy, not because it looks good.",
    },
    serviceSlug: "ui-ux-tasarim",
  },
  {
    id: "is-gelistirme",
    label: { tr: "İş Geliştirme", en: "Business Building" },
    blurb: {
      tr: "Kampanya değil iş inşası: büyüme stratejisi, doğru ortağı seçmek, ölçeklenme kararları.",
      en: "Building businesses, not campaigns: growth strategy, choosing a partner, scaling decisions.",
    },
    serviceSlug: null,
  },
  {
    id: "marka-hikaye",
    label: { tr: "Marka ve Hikâye", en: "Brand & Storytelling" },
    blurb: {
      tr: "İnsanlar ürün satın almadan önce bir hikâyeye inanır — o hikâyenin mühendisliği.",
      en: "People believe a story before they buy a product — the engineering of that story.",
    },
    serviceSlug: "marka-stratejisi",
  },
  {
    id: "video-kreatif",
    label: { tr: "Video ve Kreatif", en: "Video & Creative" },
    blurb: {
      tr: "Prodüksiyon kalitesi bir maliyet kalemi değil, algı kaldıracı.",
      en: "Production quality isn't a cost line, it's a perception lever.",
    },
    serviceSlug: null,
  },
];

const BY_ID = new Map(TOPICS.map((t) => [t.id, t]));

export function getTopic(id: ArticleTopic): TopicDef {
  const t = BY_ID.get(id);
  // Union kapalı olduğu için bu dal tipte erişilemez; runtime'da içerik
  // dosyası elle bozulursa sessizce yanlış etiket basmaktansa patlaması iyi.
  if (!t) throw new Error(`Bilinmeyen yazı konusu: ${id}`);
  return t;
}
