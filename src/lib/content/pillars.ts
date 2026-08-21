import type { PillarContent } from "./types";

export const PILLARS: PillarContent[] = [
  {
    key: "growth",
    name: { tr: "Growth", en: "Growth" },
    tagline: {
      industrial: {
        tr: "Sanayi markası için yapısal büyüme.",
        en: "Structural growth for industrial brands.",
      },
      commerce: {
        tr: "Büyümeyi sisteme bağlayan disiplin.",
        en: "The discipline that turns growth into a system.",
      },
    },
    heroLede: {
      tr: "Marka, performans ve deneyimi tek bir büyüme makinesinde birleştirir. Kampanya değil; sistem. Trafik değil; dönüşüm.",
      en: "Brand, performance and experience unified into one growth engine. Not a campaign — a system. Not traffic — conversion.",
    },
    description: {
      industrial: {
        tr: "Marka konumlandırması, B2B müşteri edinimi ve performans kanallarını tek bir büyüme sisteminde birleştirir. İhracat hedefi veya yurt içi pazar payı — strateji veriye dayanır, uygulama yanında durur.",
        en: "Brand positioning, B2B customer acquisition and performance channels unified in one growth system. Export target or domestic market share — strategy is grounded in data, execution stays alongside.",
      },
      commerce: {
        tr: "CAC düşer, ROAS yükselir, LTV uzar — marka, performans ve dönüşüm aynı anda çalışınca. Kampanya çıkarmıyoruz; büyüme motorunu birlikte inşa ediyoruz.",
        en: "CAC drops, ROAS lifts, LTV extends — when brand, performance and conversion work in sync. We don't run campaigns; we build the growth engine together.",
      },
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
      industrial: {
        tr: "Verimle büyüyen operasyonlar için dönüşüm.",
        en: "Transformation for operations that grow through efficiency.",
      },
      commerce: {
        tr: "E-ticaret operasyonu hızlanır, ölçeklenir.",
        en: "E-commerce operations, faster and ready to scale.",
      },
    },
    heroLede: {
      tr: "Süreç, veri ve otomasyonu işin hızına eşler. Verim ölçülebilir artar, maliyet görünür düşer.",
      en: "Process, data and automation matched to business speed. Efficiency rises measurably; cost drops visibly.",
    },
    description: {
      industrial: {
        tr: "Üretim hattından ERP'ye, tedarik zincirinden iş zekası sistemine — süreç analizi, otomasyon tasarımı ve uygulama tek elde. Her adımda yatırım getirisi (ROI) hesaplanır, maliyet düşüşü ölçülür.",
        en: "From production line to ERP, from supply chain to business intelligence — process analysis, automation design and implementation under one roof. ROI calculated at every step; cost reduction measured.",
      },
      commerce: {
        tr: "Sipariş akışı, envanter senkronizasyonu, müşteri segmentasyonu — operasyonel darboğazlar tespit edilir, otomasyon devreye alınır. Elle iş azalır, büyüme engeli kalkar.",
        en: "Order flow, inventory sync, customer segmentation — operational bottlenecks identified, automation deployed. Less manual work; growth blockers removed.",
      },
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
      industrial: {
        tr: "Firmaya ait yazılım ve altyapı inşası.",
        en: "Software and infrastructure the firm owns.",
      },
      commerce: {
        tr: "Hızlı, piyasaya hazır ürün inşası.",
        en: "Fast, market-ready product engineering.",
      },
    },
    heroLede: {
      tr: "Özel yazılım, mobil uygulama ve altyapı. Dış danışmanlığı değil — sahiplikli, kod teslimli yapım.",
      en: "Custom software, mobile apps and infrastructure. Not outside advisory — ownership-led, code-delivered construction.",
    },
    description: {
      industrial: {
        tr: "Akıllı ERP modülü, iş yönetim yazılımı veya iç araç — bağımlılıksız, sahiplikli mühendislik. Kaynak kodu ve altyapı kontrolü firmada kalır; sistem büyüdükçe genişler.",
        en: "Custom ERP module, business management system or internal tool — dependency-free, ownership-led engineering. Source code and infrastructure control stays with the firm; the system grows as the business does.",
      },
      commerce: {
        tr: "Mobile uygulama, headless storefront veya custom e-ticaret altyapısı — 8-12 haftada piyasaya açık. Dış bağımlılık yok; kod ve altyapı kontrolü sizde.",
        en: "Mobile app, headless storefront or custom e-commerce infrastructure — market-ready in 8-12 weeks. No external dependency; code and infrastructure control stays with you.",
      },
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
