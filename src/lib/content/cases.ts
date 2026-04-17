import type { CaseStudyContent } from "./types";

export const CASES: CaseStudyContent[] = [
  {
    slug: "uretim-planlama-dijitallestirme",
    clientName: { tr: "Sanayi Şirketi A", en: "Industrial Company A" },
    clientSector: { tr: "Metal üretimi", en: "Metal manufacturing" },
    problemType: "digital_transformation",
    pillar: "transform",
    title: {
      tr: "Üretim planlamada 42% süre kısalması.",
      en: "42% shorter production planning cycle.",
    },
    lead: {
      tr: "Excel-tabanlı üretim planlamayı uçtan uca dijitalleştirdik. Kaynak tahsis hatası neredeyse sıfırlandı, sevkiyat güvenilirliği iki katına çıktı.",
      en: "We digitized spreadsheet-based production planning end to end. Resource allocation errors dropped to near zero; shipping reliability doubled.",
    },
    challenge: {
      tr: [
        "Üç fabrika aynı Excel şablonuna bakıyordu ama her fabrikanın kendi sürümü vardı.",
        "Kaynak tahsis hataları haftada 5-7 sipariş gecikmesine neden oluyordu.",
        "Sevkiyat tarihleri 'söz' ile veriliyor, gerçekle tutmuyordu.",
      ],
      en: [
        "Three factories looked at the same Excel template, but each had its own version.",
        "Resource allocation errors caused 5-7 order delays per week.",
        "Shipment dates were given on \"word\" and didn't match reality.",
      ],
    },
    approach: {
      tr: [
        "Sahada iki haftalık gözlem; her fabrikanın gerçek iş akışını çıkardık.",
        "Pilot olarak tek fabrikada prototip; haftalık demo + planlama sorumlularıyla iterasyon.",
        "Üç fabrika için ortak plan, yerel varyasyon — tek kaynak, üç görünüm.",
      ],
      en: [
        "Two weeks of on-site observation; mapped the real workflow of each factory.",
        "Prototype in one factory as pilot; weekly demo + iteration with planners.",
        "Common plan across three factories with local variations — one source, three views.",
      ],
    },
    outcome: {
      tr: [
        "Planlama süresi günlerden saatlere indi.",
        "Sevkiyat güvenilirliği %48'den %96'ya çıktı.",
        "İç ekip kendi başına operasyona devraldı; danışman 30 günde çıktı.",
      ],
      en: [
        "Planning time dropped from days to hours.",
        "Shipment reliability rose from 48% to 96%.",
        "The internal team took over operations; the consultant exited in 30 days.",
      ],
    },
    metrics: [
      { value: "-%42", label: { tr: "Planlama süresi", en: "Planning time" } },
      { value: "2×", label: { tr: "Sevkiyat güvenilirliği", en: "Shipping reliability" } },
      { value: "8 hafta", label: { tr: "Uygulama süresi", en: "Time to deploy" } },
    ],
    durationWeeks: 8,
    testimonial: {
      quote: {
        tr: "İlk kez üç fabrika aynı pano etrafında aynı dilde konuşuyor.",
        en: "For the first time, three factories speak the same language around the same dashboard.",
      },
      authorRole: {
        tr: "Üretim Direktörü, sanayi şirketi",
        en: "Production Director, industrial company",
      },
    },
  },
  {
    slug: "e-ticaret-organik-trafik",
    clientName: { tr: "D2C Markası B", en: "D2C Brand B" },
    clientSector: { tr: "Moda perakendesi", en: "Fashion retail" },
    problemType: "customer_acquisition",
    pillar: "growth",
    title: {
      tr: "E-ticarette 3.2× organik trafik, 6 ay.",
      en: "3.2× organic traffic in 6 months, e-commerce.",
    },
    lead: {
      tr: "Performans pazarlamanın tek başına tıkandığı noktada SEO + CRO ile kanal dengesini kurduk. CAC düştü, kalıcı büyüme geldi.",
      en: "At the point where performance marketing alone stalled, we balanced the channels with SEO + CRO. CAC dropped; sustainable growth followed.",
    },
    challenge: {
      tr: [
        "Performance kanallarda CPA sürekli tırmanıyordu.",
        "Organik trafik marka aramasından ibaretti.",
        "Ürün sayfalarında dönüşüm ortalamanın altındaydı.",
      ],
      en: [
        "CPA was constantly rising on performance channels.",
        "Organic traffic was limited to brand search.",
        "Product page conversion was below average.",
      ],
    },
    approach: {
      tr: [
        "Ürün kategorisi bazlı SEO content planı.",
        "Ürün sayfalarına A/B test programı (aylık 3 test).",
        "Performans bütçesinin %30'u marka araması dışına kaydırıldı.",
      ],
      en: [
        "Category-based SEO content plan.",
        "A/B testing program on product pages (3 tests/month).",
        "30% of performance budget shifted away from brand search.",
      ],
    },
    outcome: {
      tr: [
        "Organik trafik 6 ayda 3.2× arttı.",
        "CAC %34 düştü.",
        "Ürün sayfalarında dönüşüm %2.1 → %4.6.",
      ],
      en: [
        "Organic traffic grew 3.2× in 6 months.",
        "CAC dropped 34%.",
        "Product page conversion 2.1% → 4.6%.",
      ],
    },
    metrics: [
      { value: "3.2×", label: { tr: "Organik trafik", en: "Organic traffic" } },
      { value: "-%34", label: { tr: "CAC", en: "CAC" } },
      { value: "%4.6", label: { tr: "Ürün sayfası conversion", en: "Product page conversion" } },
    ],
    durationWeeks: 24,
  },
  {
    slug: "perakende-envanter-gorunurlugu",
    clientName: { tr: "Perakende Zinciri C", en: "Retail Chain C" },
    clientSector: { tr: "FMCG perakende", en: "FMCG retail" },
    problemType: "digital_transformation",
    pillar: "transform",
    title: {
      tr: "Perakendede envanter görünürlüğü tek panoda.",
      en: "Retail inventory visibility in a single dashboard.",
    },
    lead: {
      tr: "120 mağazanın envanteri 3 farklı sistemde tutuluyordu. Tek panoya topladık; stok kaybı yarıya indi.",
      en: "120 stores kept inventory in 3 different systems. Consolidated into one panel; stock-out dropped by half.",
    },
    challenge: {
      tr: [
        "Merkezi görünürlük yoktu; raporlar haftalık Excel'le geliyordu.",
        "Stok kaybı ve fazlası paralel olarak büyüyordu.",
      ],
      en: [
        "No central visibility; reports came weekly via Excel.",
        "Stock-outs and overstock grew in parallel.",
      ],
    },
    approach: {
      tr: [
        "ETL pipeline ile 3 sistemi gecelik birleştirme.",
        "Mağaza müdürlerine mobil dashboard.",
        "Merkezi yönetim için haftalık exception raporu.",
      ],
      en: [
        "ETL pipeline consolidating 3 systems nightly.",
        "Mobile dashboard for store managers.",
        "Weekly exception report for central management.",
      ],
    },
    outcome: {
      tr: [
        "Stok kaybı yarıya indi.",
        "Fazla stok maliyeti %22 düştü.",
        "Haftalık toplantı süresi 2 saatten 45 dakikaya.",
      ],
      en: [
        "Stock-outs halved.",
        "Overstock cost dropped 22%.",
        "Weekly meeting cut from 2 hours to 45 minutes.",
      ],
    },
    metrics: [
      { value: "-%50", label: { tr: "Stok kaybı", en: "Stock-outs" } },
      { value: "-%22", label: { tr: "Fazla stok maliyeti", en: "Overstock cost" } },
      { value: "10 hafta", label: { tr: "Uygulama süresi", en: "Time to deploy" } },
    ],
    durationWeeks: 10,
  },
  {
    slug: "isletme-maliyeti-optimizasyonu",
    clientName: { tr: "Sanayi Şirketi D", en: "Industrial Company D" },
    clientSector: { tr: "Gıda üretimi", en: "Food manufacturing" },
    problemType: "cost_optimization",
    pillar: "transform",
    title: {
      tr: "İşletme maliyetinde %28 tasarruf, 12 ay.",
      en: "28% operational cost reduction, 12 months.",
    },
    lead: {
      tr: "12 aylık sistematik bakış — hangi süreç ne kadar yiyor? Önceliklendirilmiş 5 müdahale ile toplam maliyet %28 düştü.",
      en: "A 12-month systematic look — which process costs how much? Five prioritized interventions cut total cost 28%.",
    },
    challenge: {
      tr: [
        "Yıllık maliyet raporu vardı ama süreç bazında dağılımı yoktu.",
        "Her müdahale kampanya havasında: bu ay \"enerji\", gelecek ay \"personel\".",
      ],
      en: [
        "There was an annual cost report but no breakdown by process.",
        "Each intervention felt like a campaign: this month \"energy\", next month \"staff\".",
      ],
    },
    approach: {
      tr: [
        "Faaliyet-temelli maliyetlendirme (ABC) ile süreç başına maliyet.",
        "ROI potansiyeli yüksek 5 süreçte ardışık pilot.",
        "Yıllık karar döngüsü kurumsal ritme bağlandı.",
      ],
      en: [
        "Activity-based costing per process.",
        "Sequential pilots in 5 processes with highest ROI potential.",
        "Annual decision cycle tied to corporate rhythm.",
      ],
    },
    outcome: {
      tr: [
        "Toplam operasyonel maliyet %28 düştü.",
        "Yönetim her çeyrek aynı panoya bakıyor.",
      ],
      en: [
        "Total operational cost reduced 28%.",
        "Leadership reviews the same dashboard each quarter.",
      ],
    },
    metrics: [
      { value: "-%28", label: { tr: "Operasyonel maliyet", en: "Operational cost" } },
      { value: "5", label: { tr: "Pilot süreç", en: "Pilot processes" } },
      { value: "12 ay", label: { tr: "Program süresi", en: "Program duration" } },
    ],
    durationWeeks: 52,
  },
];

export function getCaseBySlug(slug: string): CaseStudyContent | null {
  return CASES.find((c) => c.slug === slug) ?? null;
}
