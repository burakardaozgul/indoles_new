import type { Localized } from "./types";

export type MethodStep = {
  no: string;
  /** İngilizce aşama adı — her iki dilde de sabit, marka terminolojisi. */
  frame: "Discover" | "Design" | "Build" | "Grow" | "Evolve";
  title: Localized<string>;
  description: Localized<string>;
  artifacts: Localized<string[]>;
};

/**
 * INDOLES Frame — firma seviyesinde 5 aşamalı dönüşüm metodolojisi.
 *
 * Kaynak: Claude Studio `INDOLES` tasarım projesi (components/Method.jsx).
 * Pillar'ların kendi 4 adımlı metodolojilerinden (bkz. `pillars.ts`) farklıdır:
 * bunlar bir pillar içindeki uygulama döngüsü, bu ise tüm angajmanın çatısı.
 * Footer imzasındaki "Evolve · Build · Grow" bu çerçevenin kısaltmasıdır.
 */
export const METHOD_STEPS: MethodStep[] = [
  {
    no: "01",
    frame: "Discover",
    title: { tr: "Keşfet", en: "Discover" },
    description: {
      tr: "Derin saha, kültür ve karar mimarisi analizi. Dönüşüm çoğu zaman bir teknoloji değil, bir bakış problemidir.",
      en: "Deep field, culture and decision-architecture analysis. Transformation is usually not a technology problem but a problem of perspective.",
    },
    artifacts: {
      tr: ["Paydaş haritası", "Kültür teşhisi", "Değer akış analizi"],
      en: ["Stakeholder map", "Culture diagnosis", "Value stream analysis"],
    },
  },
  {
    no: "02",
    frame: "Design",
    title: { tr: "Tasarla", en: "Design" },
    description: {
      tr: "Marka, sistem, deneyim ve organizasyonu birlikte tasarlarız. Parçalar değil, tek bir mimari çıkarırız.",
      en: "We design brand, system, experience and organisation together. The output is one architecture, not a set of parts.",
    },
    artifacts: {
      tr: ["Marka mimarisi", "Sistem şeması", "Hedef işletme modeli"],
      en: ["Brand architecture", "System blueprint", "Target operating model"],
    },
  },
  {
    no: "03",
    frame: "Build",
    title: { tr: "İnşa et", en: "Build" },
    description: {
      tr: "Pilot, MVP ve ilk dalga uygulamalar. Prototip, üretimin en dürüst şeklidir.",
      en: "Pilot, MVP and first-wave rollouts. A prototype is the most honest form of production.",
    },
    artifacts: {
      tr: ["Pilot devreye alma", "AI ve veri ürünleri", "Marka uygulaması"],
      en: ["Pilot launch", "AI & data products", "Brand rollout"],
    },
  },
  {
    no: "04",
    frame: "Grow",
    title: { tr: "Büyüt", en: "Grow" },
    description: {
      tr: "Ölçeklendirilmiş dönüşüm — hem operasyonda hem pazarda.",
      en: "Transformation at scale — in operations and in the market alike.",
    },
    artifacts: {
      tr: ["Operasyon ölçekleme", "Pazar genişlemesi", "Kategori büyümesi"],
      en: ["Operations scale-up", "Market expansion", "Category growth"],
    },
  },
  {
    no: "05",
    frame: "Evolve",
    title: { tr: "Evir", en: "Evolve" },
    description: {
      tr: "Sürekli öğrenen bir kurum inşa ederiz. Dönüşüm bir proje değil; bir yetenek olur.",
      en: "We build an organisation that keeps learning. Transformation stops being a project and becomes a capability.",
    },
    artifacts: {
      tr: ["Mükemmeliyet merkezi", "Öğrenme döngüleri", "Yetenek haritası"],
      en: ["Centre of excellence", "Learning loops", "Capability map"],
    },
  },
];
