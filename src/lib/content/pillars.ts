import type { PillarContent } from "./types";

export const PILLARS: PillarContent[] = [
  {
    key: "growth",
    name: { tr: "Growth", en: "Growth" },
    tagline: {
      tr: "Ticaret için agresif büyüme.",
      en: "Aggressive growth for commerce.",
    },
    heroLede: {
      tr: "Marka, performans ve deneyimi tek bir büyüme makinesinde birleştirir. Kampanya değil; sistem. Trafik değil; dönüşüm.",
      en: "Brand, performance and experience unified into one growth engine. Not a campaign — a system. Not traffic — conversion.",
    },
    description: {
      tr: "Growth pillar, ticaret ve perakende markaları için kanıt-temelli büyüme disiplinidir. Strateji ve uygulamayı ayırmayız — birlikte kurar, birlikte ölçeriz.",
      en: "Growth is an evidence-based growth discipline for commerce and retail brands. We don't split strategy from execution — we build and measure together.",
    },
    methodology: [
      {
        step: "01",
        title: { tr: "Teşhis", en: "Diagnose" },
        description: {
          tr: "Funnel'ın neresinde kayıp var? Data + kullanıcı görüşmesi + kanal analitiği ile sızıntıyı bul.",
          en: "Where is the leak in the funnel? Find it with data, user interviews and channel analytics.",
        },
      },
      {
        step: "02",
        title: { tr: "Strateji", en: "Strategy" },
        description: {
          tr: "Hangi kanala ne kadar, hangi mesajla, hangi hedefle. Net önceliklendirme, net bütçe.",
          en: "How much to which channel, with what message, to what goal. Clear prioritization, clear budget.",
        },
      },
      {
        step: "03",
        title: { tr: "Uygulama", en: "Execute" },
        description: {
          tr: "Performance, CRO, e-ticaret ve UI/UX ekipleri tek sprint ritminde çalışır.",
          en: "Performance, CRO, e-commerce and UI/UX teams work in one sprint cadence.",
        },
      },
      {
        step: "04",
        title: { tr: "Ölçek", en: "Scale" },
        description: {
          tr: "Çalışan kanal ikiye katlanır, çalışmayan kapanır. Haftalık review, aylık karar.",
          en: "What works gets doubled, what doesn't gets cut. Weekly review, monthly decision.",
        },
      },
    ],
    services: [
      {
        slug: "marka-stratejisi",
        name: {
          tr: "Marka stratejisi ve pazarlama danışmanlığı",
          en: "Brand strategy & marketing advisory",
        },
        shortDescription: {
          tr: "Konumlandırma, ton, mesaj mimarisi. Satış ekibinden sosyal medyaya kadar tutarlı marka.",
          en: "Positioning, tone, message architecture. Consistent brand from sales to social.",
        },
      },
      {
        slug: "performans-pazarlama",
        name: { tr: "Performans pazarlama", en: "Performance marketing" },
        shortDescription: {
          tr: "Google, Meta, TikTok, LinkedIn — kanalların değil, iş hedeflerinin dili.",
          en: "Google, Meta, TikTok, LinkedIn — speaking the language of outcomes, not channels.",
        },
      },
      {
        slug: "cro",
        name: {
          tr: "CRO — dönüşüm optimizasyonu",
          en: "CRO — conversion optimization",
        },
        shortDescription: {
          tr: "A/B test, ısı haritası, funnel analizi. Var olan trafiği daha çok sat.",
          en: "A/B testing, heatmaps, funnel analysis. Sell more from existing traffic.",
        },
      },
      {
        slug: "e-ticaret",
        name: { tr: "E-ticaret", en: "E-commerce" },
        shortDescription: {
          tr: "Shopify, Magento veya custom — katalog, ödeme, lojistik dahil uçtan uca.",
          en: "Shopify, Magento or custom — catalogue, checkout, logistics end-to-end.",
        },
      },
      {
        slug: "ui-ux-tasarim",
        name: { tr: "UI/UX tasarım", en: "UI/UX design" },
        shortDescription: {
          tr: "Editorial-minimal, markaya özel. Stok şablonlardan bir gömlek üstü.",
          en: "Editorial, brand-specific. A notch above stock templates.",
        },
      },
    ],
    metrics: [
      {
        value: "3.2×",
        label: { tr: "Ortalama ROAS artışı", en: "Average ROAS lift" },
      },
      {
        value: "-%34",
        label: { tr: "Müşteri edinim maliyeti", en: "Customer acquisition cost" },
      },
      {
        value: "12 hafta",
        label: { tr: "Ortalama etki süresi", en: "Average time to impact" },
      },
    ],
  },
  {
    key: "transform",
    name: { tr: "Transform", en: "Transform" },
    tagline: {
      tr: "Dijital ve işletme dönüşümü.",
      en: "Digital and business transformation.",
    },
    heroLede: {
      tr: "Süreç, veri ve otomasyonu işin hızına eşler. Verim ölçülebilir artar, maliyet görünür düşer.",
      en: "Process, data and automation matched to business speed. Efficiency rises measurably; cost drops visibly.",
    },
    description: {
      tr: "Transform pillar, sanayi ve kurumsal KOBİ'ler için dijital dönüşüm ve süreç iyileştirme disiplinidir. Teknoloji satmıyoruz; işi anlayıp teknolojiyi çağırıyoruz.",
      en: "Transform is a digital transformation and process improvement discipline for industry and enterprise SMBs. We don't sell technology; we understand the business and then call for technology.",
    },
    methodology: [
      {
        step: "01",
        title: { tr: "Süreç haritalama", en: "Process mapping" },
        description: {
          tr: "As-is durum. Sahada gözlem, süreç sahipleriyle görüşme, veri akış şeması.",
          en: "As-is state. On-site observation, process owner interviews, data flow map.",
        },
      },
      {
        step: "02",
        title: { tr: "Audit ve önceliklendirme", en: "Audit & prioritization" },
        description: {
          tr: "En yüksek getiri sağlayacak 3-5 süreç. Her biri için ROI projeksiyonu.",
          en: "The 3-5 processes with highest ROI potential. Projection for each.",
        },
      },
      {
        step: "03",
        title: { tr: "Pilot", en: "Pilot" },
        description: {
          tr: "Tek bir süreçte 4-8 haftalık pilot. Hipotezi gerçekle ölç.",
          en: "4-8 week pilot on a single process. Test the hypothesis against reality.",
        },
      },
      {
        step: "04",
        title: { tr: "Ölçek + bilgi aktarımı", en: "Scale + knowledge transfer" },
        description: {
          tr: "Pilot çalışırsa iç ekibe teslim. Danışmanın gitmesi başarının parçasıdır.",
          en: "If the pilot works, hand off to the internal team. The consultant leaving is part of success.",
        },
      },
    ],
    services: [
      {
        slug: "ai-danismanlik",
        name: { tr: "AI danışmanlığı", en: "AI advisory" },
        shortDescription: {
          tr: "Nerede gerçekten LLM, nerede klasik ML, nerede hiçbiri. Teşhis + pilot + canlı sistem.",
          en: "Where it's truly LLM, where classical ML, where neither. Diagnosis, pilot, production.",
        },
      },
      {
        slug: "dijital-donusum",
        name: { tr: "Dijital dönüşüm", en: "Digital transformation" },
        shortDescription: {
          tr: "ERP, üretim planlama, CRM, envanter — paralel değil sıralı, hepsi değil doğrusu.",
          en: "ERP, production planning, CRM, inventory — sequenced, not parallel; right, not all.",
        },
      },
      {
        slug: "is-otomasyonlari",
        name: { tr: "İş otomasyonları", en: "Business automation" },
        shortDescription: {
          tr: "Excel makroları değil; kalıcı, denetlenebilir, ölçeklenebilir akışlar.",
          en: "Not Excel macros; permanent, auditable, scalable workflows.",
        },
      },
      {
        slug: "is-zekasi",
        name: { tr: "İş zekası", en: "Business intelligence" },
        shortDescription: {
          tr: "Rapor fabrikası değil, karar panoları. Yönetim her Pazartesi aynı panoya bakar.",
          en: "Not a report factory — decision dashboards. Leadership reviews the same panel every Monday.",
        },
      },
      {
        slug: "isletme-muhendisligi",
        name: { tr: "İşletme mühendisliği", en: "Operations engineering" },
        shortDescription: {
          tr: "Süreçleri iyileştirmek için kod değil, önce akış diyagramı.",
          en: "Flow diagrams before code when improving processes.",
        },
      },
    ],
    metrics: [
      {
        value: "-%42",
        label: { tr: "Ortalama süreç süresi", en: "Average process time" },
      },
      {
        value: "-%28",
        label: { tr: "Operasyonel maliyet", en: "Operational cost" },
      },
      {
        value: "6-12 hafta",
        label: { tr: "Pilot → ölçek süresi", en: "Pilot to scale" },
      },
    ],
  },
  {
    key: "build",
    name: { tr: "Build", en: "Build" },
    tagline: {
      tr: "Teknoloji ve ürün inşası.",
      en: "Technology and product engineering.",
    },
    heroLede: {
      tr: "Özel yazılım, mobil uygulama ve altyapı. Dış danışmanlığı değil — sahiplikli, kod teslimli yapım.",
      en: "Custom software, mobile apps and infrastructure. Not outside advisory — ownership-led, code-delivered construction.",
    },
    description: {
      tr: "Build pillar, ürün veya iç araç geliştirmeyi kendi danışmanlığımızla birleştirir. Teknolojiyi yalnız seçmez, inşa ederiz.",
      en: "Build combines product and internal tool engineering with our own advisory. We don't just pick technology — we build it.",
    },
    methodology: [
      {
        step: "01",
        title: { tr: "Scoping", en: "Scoping" },
        description: {
          tr: "Problem, kısıt ve başarı kriterleri. Teknoloji seçimi en sonda.",
          en: "Problem, constraints and success criteria. Tech choice comes last.",
        },
      },
      {
        step: "02",
        title: { tr: "Mimari", en: "Architecture" },
        description: {
          tr: "ADR disiplini ile her seçim yazılır. Kod başladığında kararlar şeffaf.",
          en: "Every choice written down via ADR. When code starts, decisions are transparent.",
        },
      },
      {
        step: "03",
        title: { tr: "Build", en: "Build" },
        description: {
          tr: "Haftalık demo. Küçük adımlar, görünür ilerleme, düzenli müşteri onayı.",
          en: "Weekly demos. Small steps, visible progress, regular customer sign-off.",
        },
      },
      {
        step: "04",
        title: { tr: "Go-live + devir", en: "Go-live + handover" },
        description: {
          tr: "Observability baştan bağlı. Deploy sonrası 30 gün stabilizasyon. Sonra ekibe teslim.",
          en: "Observability wired from day one. 30 days of post-deploy stabilization. Then handover.",
        },
      },
    ],
    services: [
      {
        slug: "ozel-yazilim-ve-mobil",
        name: {
          tr: "Özel yazılım ve mobil uygulama",
          en: "Custom software & mobile apps",
        },
        shortDescription: {
          tr: "Web, mobil, iç araç. TypeScript monolit varsayılan — erken mikroservis borcu almadan.",
          en: "Web, mobile, internal tools. TypeScript monolith by default — no premature microservice debt.",
        },
      },
      {
        slug: "teknoloji-ve-altyapi",
        name: {
          tr: "Teknoloji ve altyapı danışmanlığı",
          en: "Technology & infrastructure advisory",
        },
        shortDescription: {
          tr: "AWS, Vercel, self-host — bağlama göre doğru seçim. Lock-in önce tartışılır.",
          en: "AWS, Vercel, self-host — the right pick per context. Lock-in is discussed first.",
        },
      },
    ],
    metrics: [
      {
        value: "8 hafta",
        label: { tr: "Ortalama MVP süresi", en: "Average MVP time" },
      },
      {
        value: "30 gün",
        label: { tr: "Post-launch stabilizasyon", en: "Post-launch stabilization" },
      },
      {
        value: "%100",
        label: { tr: "Source code teslimi", en: "Source code handover" },
      },
    ],
  },
];

export function getPillar(key: string): PillarContent | null {
  return PILLARS.find((p) => p.key === key) ?? null;
}
