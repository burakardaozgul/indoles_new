import type { DiagnooReport } from "../schema";

export function sampleReport(): DiagnooReport {
  return {
    id: "d-test-1", url: "https://ornek-magaza.com", locale: "tr", healthScore: 54,
    semantic: { uvpDetected: "Hızlı teslimatlı butik kozmetik", toneOfVoice: "samimi",
      messageCohesionScore: 0.62, alignmentIssues: ["Anasayfa vaadi ürün sayfasında yok"], seoKeywordIssues: [] },
    vision: { cognitiveLoadScore: 0.7, ctaVisibilityScore: 0.4,
      mobileIssues: ["Sepete ekle butonu fold altında"], desktopIssues: [], aboveFoldAssessment: "Kampanya bandı CTA'yı gölgeliyor" },
    funnel: { pageSpeeds: [{ url: "https://ornek-magaza.com", lcpMs: 4200, cls: 0.18, ttfbMs: 900, inpMs: 250 }],
      avgLcpMs: 4200, checkoutFrictionPoints: ["Zorunlu üyelik"], pixelCoverage: { gtag: true, meta_pixel: false },
      missingTrackingEvents: ["meta_pixel"] },
    financial: {
      inputs: { monthlyTraffic: 120000, aov: 850, conversionRate: 0.015, avgDelaySeconds: 1.7,
        monthlyAdSpend: null, messageCohesionScore: 0.62 },
      inputSources: { monthlyTraffic: "estimated", aov: "estimated", conversionRate: "estimated", monthlyAdSpend: "estimated" },
      lostRevenueSpeed: { low: 74000, expected: 114000, high: 154000 },
      adWaste: null,
      totalRecoverable: { low: 74000, expected: 114000, high: 154000 },
      methodology: [{ constant: "SPEED_LOSS_PER_SECOND", value: 0.044,
        source: "Portent (2019), sayfa hızı-dönüşüm analizi", note: "İlk 5 saniyede saniye başına ~%4,4 dönüşüm kaybı" }],
      dataQuality: { speed: "measured" },
    },
    roadmap: [
      { title: "LCP'yi 2,5 sn altına indir", description: "Görsel optimizasyonu ve önbellekleme",
        category: "speed", priority: "critical", impactMonthly: { low: 60000, expected: 90000, high: 120000 },
        effortDays: 5, dataReference: "Anasayfa LCP 4200 ms (PSI)" },
      { title: "Mobilde CTA'yı fold üstüne al", description: "Sepete ekle görünürlüğü",
        category: "ux", priority: "high", impactMonthly: { low: 10000, expected: 18000, high: 26000 },
        effortDays: 2, dataReference: "Vision: cta_visibility 0.40" },
      { title: "Meta Pixel kur", description: "Remarketing kitlesi kaçıyor",
        category: "tracking", priority: "high", impactMonthly: null, effortDays: 1,
        dataReference: "pixel_coverage.meta_pixel = false" },
      { title: "Checkout'ta misafir akışı", description: "Zorunlu üyelik sürtünmesi",
        category: "funnel", priority: "medium", impactMonthly: { low: 4000, expected: 6000, high: 8000 },
        effortDays: 3, dataReference: "Checkout friction: zorunlu üyelik" },
    ],
    benchmarks: [{ metric: "lcp_ms", label: "LCP (anasayfa)", value: 4200, median: 3200, top10: 1800,
      unit: "ms", betterIs: "lower",
      source: "Chrome UX Report mobil LCP dağılımı — INDOLES kürasyonlu kıyas seti", asOf: "2026-09" }],
    createdAt: "2026-09-01T09:00:00Z",
  };
}
