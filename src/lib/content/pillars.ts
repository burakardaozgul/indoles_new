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
    services: [
      {
        slug: "marka-stratejisi",
        name: {
          tr: "Marka stratejisi ve pazarlama danışmanlığı",
          en: "Brand strategy & marketing advisory",
        },
        shortDescription: {
          industrial: {
            tr: "Pazar konumlandırması, ton ve mesaj mimarisi. İhracat pazarından saha satış ekibine tutarlı marka anlatısı — marka değeri ölçülebilir kılınır.",
            en: "Market positioning, tone and message architecture. A consistent brand narrative from export markets to the field sales team — brand value made measurable.",
          },
          commerce: {
            tr: "Marka konumlandırması, ses ve ton sistemi. Funnel'ın her adımında — reklamdan landing page'e, e-postadan ürün sayfasına — tutarlı mesaj.",
            en: "Brand positioning, voice and tone system. Consistent messaging across every funnel step — ad to landing page, email to product page.",
          },
        },
      },
      {
        slug: "performans-pazarlama",
        name: { tr: "Performans pazarlama", en: "Performance marketing" },
        shortDescription: {
          industrial: {
            tr: "Google, LinkedIn, sektörel medya — B2B alıcıya ulaşan kanallar. Her bütçe satırı iş hedefiyle eşleşir; ihracat pazarı için ayrı strateji.",
            en: "Google, LinkedIn, trade media — channels that reach B2B buyers. Every budget line mapped to a business outcome; separate strategy for export markets.",
          },
          commerce: {
            tr: "Google, Meta, TikTok — her kanalda CAC hedefi, ROAS takibi, bütçe optimizasyonu. Audience segmentasyonu ve creative testi birlikte yürür.",
            en: "Google, Meta, TikTok — CAC target, ROAS tracking, budget optimisation on every channel. Audience segmentation and creative testing run in parallel.",
          },
        },
      },
      {
        slug: "cro",
        name: {
          tr: "CRO — dönüşüm optimizasyonu",
          en: "CRO — conversion optimization",
        },
        shortDescription: {
          industrial: {
            tr: "Kurumsal alıcı davranışı analizi, A/B testi, ısı haritası. Mevcut trafik içinden teklif ve fiyat talebi dönüşümünü artırır.",
            en: "Corporate buyer behaviour analysis, A/B testing, heatmaps. Increases quote and price request conversion from existing traffic.",
          },
          commerce: {
            tr: "Sepet terk analizi, checkout optimizasyonu, ürün sayfası A/B testi. Aynı trafik, daha yüksek dönüşüm oranı ve ortalama sipariş değeri.",
            en: "Cart abandonment analysis, checkout optimisation, product page A/B testing. Same traffic — higher conversion rate and average order value.",
          },
        },
      },
      {
        slug: "e-ticaret",
        name: { tr: "E-ticaret", en: "E-commerce" },
        shortDescription: {
          industrial: {
            tr: "B2B e-ihracat platformu, tedarikçi portalı veya distribütör ağı. ERP entegrasyonu ve toplu sipariş akışı dahil — kurumsal satın almaya hazır sistem.",
            en: "B2B e-export platform, supplier portal or distributor network. ERP integration and bulk order flow included — system ready for corporate procurement.",
          },
          commerce: {
            tr: "Shopify, headless veya custom storefront — dönüşüm odaklı kurulum. Ödeme, lojistik ve envanter entegrasyonu büyüme için ölçeklenebilir şekilde yapılandırılır.",
            en: "Shopify, headless or custom storefront — conversion-led setup. Payment, logistics and inventory integration structured to scale with growth.",
          },
        },
      },
      {
        slug: "ui-ux-tasarim",
        name: { tr: "UI/UX tasarım", en: "UI/UX design" },
        shortDescription: {
          industrial: {
            tr: "Kurumsal kimliği taşıyan, B2B alıcıda güven inşa eden tasarım dili. Her sayfa marka anlatısıyla tutarlı — stok şablonun ötesinde.",
            en: "A design language that carries corporate identity and builds trust with B2B buyers. Every page consistent with the brand narrative — beyond stock templates.",
          },
          commerce: {
            tr: "Dönüşüm odaklı sayfa tasarımı ve kullanıcı akışı. Marka kimliği ile UI tutarlılığı aynı anda — ürün sayfasından checkout'a kadar.",
            en: "Conversion-led page design and user flow. Brand identity and UI consistency together — from product page to checkout.",
          },
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
    services: [
      {
        slug: "ai-danismanlik",
        name: { tr: "AI danışmanlığı", en: "AI advisory" },
        shortDescription: {
          industrial: {
            tr: "Üretim kalite kontrolü, talep tahmini veya bakım planlaması — nerede AI, nerede klasik otomasyon, nerede hiçbiri. Teşhis + pilot, maliyet ve verim etkisi ölçülür.",
            en: "Production quality control, demand forecasting or maintenance scheduling — where AI fits, where it doesn't. Diagnosis and pilot; cost and efficiency impact measured.",
          },
          commerce: {
            tr: "Ürün öneri motoru, sepet terk tahmini, müşteri segmentasyonu — dönüşüm ve LTV etkisi ölçülen AI. Teşhis + pilot + canlı sistem.",
            en: "Product recommendation engine, cart abandonment prediction, customer segmentation — AI with measurable conversion and LTV impact. Diagnosis, pilot, production.",
          },
        },
      },
      {
        slug: "dijital-donusum",
        name: { tr: "Dijital dönüşüm", en: "Digital transformation" },
        shortDescription: {
          industrial: {
            tr: "ERP modernizasyonu, üretim planlama, tedarik zinciri — hangi sistemin hangi sırayla kurulacağı ROI projeksiyonuyla belirlenir. Hepsi değil, doğrusu.",
            en: "ERP modernisation, production planning, supply chain — which system to build in which order is determined by ROI projection. Not all of it; the right part.",
          },
          commerce: {
            tr: "Sipariş-ERP-envanter senkronizasyonu, OMS kurulumu, lojistik entegrasyonu — operasyonel sürtünme kaldırılır, sipariş hacmi büyümeyi kesmez.",
            en: "Order-ERP-inventory sync, OMS setup, logistics integration — operational friction removed so order volume no longer caps growth.",
          },
        },
      },
      {
        slug: "is-otomasyonlari",
        name: { tr: "İş otomasyonları", en: "Business automation" },
        shortDescription: {
          industrial: {
            tr: "Üretim raporlama, satın alma onayı, kalite kontrol akışı — KVKK ve denetim uyumlu, kalıcı iş akışları. Pilot sonrası iç ekibe teslim edilir.",
            en: "Production reporting, procurement approval, quality control flow — permanent workflows, audit-ready and compliant. Handed over to the internal team after pilot.",
          },
          commerce: {
            tr: "Sipariş işleme, iade akışı, müşteri bildirimi, kampanya tetikleyicileri — elle iş sıfırlanır, operasyon sipariş hacmiyle birlikte büyür.",
            en: "Order processing, returns flow, customer notifications, campaign triggers — manual work eliminated, operations scale with order volume.",
          },
        },
      },
      {
        slug: "is-zekasi",
        name: { tr: "İş zekası", en: "Business intelligence" },
        shortDescription: {
          industrial: {
            tr: "Üretim KPI'ları, maliyet analizi, tedarik zinciri görünürlüğü — tek gösterge panelinde. Yönetim her hafta aynı verilere bakarak karar verir.",
            en: "Production KPIs, cost analysis, supply chain visibility — in one dashboard. Leadership makes decisions from the same data every week.",
          },
          commerce: {
            tr: "Kanal bazlı ROAS ve CAC, ürün marjı analizi, müşteri segmenti performansı — büyüme kararları veriyle desteklenir, tahminle değil.",
            en: "Channel-level ROAS and CAC, product margin analysis, customer segment performance — growth decisions backed by data, not guesswork.",
          },
        },
      },
      {
        slug: "isletme-muhendisligi",
        name: { tr: "İşletme mühendisliği", en: "Operations engineering" },
        shortDescription: {
          industrial: {
            tr: "Fabrika süreç haritalama ve darboğaz analizi. Kapasite yatırımı yapmadan verim kazanımı için önce akış diyagramı, sonra araç.",
            en: "Factory process mapping and bottleneck analysis. Flowchart before tooling — efficiency gains without capacity investment.",
          },
          commerce: {
            tr: "Fulfillment sürecinden müşteri iletişimine — operasyonel darboğaz tespit edilir, büyüme öncesi altyapı hazır hale getirilir.",
            en: "From fulfilment process to customer communication — operational bottleneck identified, infrastructure readied before scaling.",
          },
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
    services: [
      {
        slug: "ozel-yazilim-ve-mobil",
        name: {
          tr: "Özel yazılım ve mobil uygulama",
          en: "Custom software & mobile apps",
        },
        shortDescription: {
          industrial: {
            tr: "Özel ERP modülü, üretim takip sistemi veya iç araç. TypeScript monolit varsayılan — erken karmaşıklık borcu almadan, iç ekibe teslim edilebilir.",
            en: "Custom ERP module, production tracking system or internal tool. TypeScript monolith by default — no early complexity debt, built to hand over to the internal team.",
          },
          commerce: {
            tr: "Müşteri mobil uygulaması, headless storefront veya özel e-ticaret backend. Kullanıcıya hızlı çıkış, ölçüme hazır altyapı.",
            en: "Customer mobile app, headless storefront or custom e-commerce backend. Fast to market, wired for measurement from the start.",
          },
        },
      },
      {
        slug: "teknoloji-ve-altyapi",
        name: {
          tr: "Teknoloji ve altyapı danışmanlığı",
          en: "Technology & infrastructure advisory",
        },
        shortDescription: {
          industrial: {
            tr: "On-premise, cloud veya hibrit — veri egemenliği, KVKK uyumu ve uzun vadeli bakım maliyeti birlikte değerlendirilir. Bağımlılık riski önceden tartışılır.",
            en: "On-premise, cloud or hybrid — data sovereignty, regulatory compliance and long-term maintenance cost evaluated together. Dependency risk discussed upfront.",
          },
          commerce: {
            tr: "AWS, Vercel, self-host — büyüme hedefine ve trafiğe göre doğru seçim. Ölçeklendirme maliyeti ve lock-in riski önceden açılır.",
            en: "AWS, Vercel, self-host — the right pick for your growth target and traffic. Scale cost and lock-in risk discussed before any commitment.",
          },
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
