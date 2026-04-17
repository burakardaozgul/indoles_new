import type { ProblemDef, ProblemSlug, PersonaSlug } from "./types";

export const PROBLEMS: readonly ProblemDef[] = [
  // DÖNÜŞÜM VE TEKNOLOJİ (sanayici persona) — 10 problem
  { slug: "manuel-surec-yavaslatiyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.manuel-surec-yavaslatiyor", services: ["business-automation"], pillars: ["transform"], weight: 1.0 },
  { slug: "verimsizlik-goremiyorum", persona: "donusum-teknoloji", i18nKey: "popup.problems.verimsizlik-goremiyorum", services: ["business-engineering", "business-intelligence"], pillars: ["transform"], weight: 1.0 },
  { slug: "ai-uygulama-bilmiyorum", persona: "donusum-teknoloji", i18nKey: "popup.problems.ai-uygulama-bilmiyorum", services: ["ai-consulting"], pillars: ["transform"], weight: 1.0 },
  { slug: "veri-karar-verdirmiyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.veri-karar-verdirmiyor", services: ["business-intelligence"], pillars: ["transform"], weight: 1.0 },
  { slug: "dijitalesme-rafta", persona: "donusum-teknoloji", i18nKey: "popup.problems.dijitalesme-rafta", services: ["digital-transformation"], pillars: ["transform"], weight: 1.0 },
  { slug: "legacy-sistem-engelliyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.legacy-sistem-engelliyor", services: ["custom-software", "tech-infrastructure"], pillars: ["build"], weight: 1.0 },
  { slug: "ekip-teknoloji-takip-edemiyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.ekip-teknoloji-takip-edemiyor", services: ["ai-consulting", "digital-transformation"], pillars: ["transform"], weight: 1.0 },
  { slug: "ihracat-hazirlik-eksik", persona: "donusum-teknoloji", i18nKey: "popup.problems.ihracat-hazirlik-eksik", services: ["business-engineering", "brand-strategy"], pillars: ["transform", "growth"], weight: 1.0 },
  { slug: "tedarik-uretim-veri-kopuk", persona: "donusum-teknoloji", i18nKey: "popup.problems.tedarik-uretim-veri-kopuk", services: ["business-intelligence", "custom-software"], pillars: ["transform", "build"], weight: 1.0 },
  { slug: "oncelik-karmasasi", persona: "donusum-teknoloji", i18nKey: "popup.problems.oncelik-karmasasi", services: ["business-engineering", "digital-transformation"], pillars: ["transform"], weight: 1.0 },

  // BÜYÜME VE YENİ PAZARLAR (ticaret persona) — 10 problem
  { slug: "reklam-maliyeti-artisi", persona: "buyume-pazarlar", i18nKey: "popup.problems.reklam-maliyeti-artisi", services: ["performance-marketing", "cro"], pillars: ["growth"], weight: 1.0 },
  { slug: "trafik-satisa-donmuyor", persona: "buyume-pazarlar", i18nKey: "popup.problems.trafik-satisa-donmuyor", services: ["cro", "uiux-design"], pillars: ["growth"], weight: 1.0 },
  { slug: "siparis-hacmi-platoda", persona: "buyume-pazarlar", i18nKey: "popup.problems.siparis-hacmi-platoda", services: ["performance-marketing", "brand-strategy"], pillars: ["growth"], weight: 1.0 },
  { slug: "yeni-pazar-kanal", persona: "buyume-pazarlar", i18nKey: "popup.problems.yeni-pazar-kanal", services: ["brand-strategy", "ecommerce"], pillars: ["growth"], weight: 1.0 },
  { slug: "marka-bilinirlik-yetersiz", persona: "buyume-pazarlar", i18nKey: "popup.problems.marka-bilinirlik-yetersiz", services: ["brand-strategy"], pillars: ["growth"], weight: 1.0 },
  { slug: "churn-yuksek", persona: "buyume-pazarlar", i18nKey: "popup.problems.churn-yuksek", services: ["cro", "business-intelligence"], pillars: ["growth", "transform"], weight: 1.0 },
  { slug: "cac-ltv-makas", persona: "buyume-pazarlar", i18nKey: "popup.problems.cac-ltv-makas", services: ["performance-marketing", "business-intelligence"], pillars: ["growth"], weight: 1.0 },
  { slug: "kanal-yonetim-eksik", persona: "buyume-pazarlar", i18nKey: "popup.problems.kanal-yonetim-eksik", services: ["brand-strategy", "performance-marketing"], pillars: ["growth"], weight: 1.0 },
  { slug: "altyapi-yuk-kaldirmiyor", persona: "buyume-pazarlar", i18nKey: "popup.problems.altyapi-yuk-kaldirmiyor", services: ["ecommerce", "tech-infrastructure"], pillars: ["growth", "build"], weight: 1.0 },
  { slug: "rekabet-geride-his", persona: "buyume-pazarlar", i18nKey: "popup.problems.rekabet-geride-his", services: ["brand-strategy", "cro"], pillars: ["growth"], weight: 1.0 },
] as const;

export function getProblemsForPersona(persona: PersonaSlug): readonly ProblemDef[] {
  return PROBLEMS.filter((p) => p.persona === persona);
}

export function getProblemBySlug(slug: ProblemSlug): ProblemDef | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}

export function getAllProblemSlugs(): ProblemSlug[] {
  return PROBLEMS.map((p) => p.slug);
}
