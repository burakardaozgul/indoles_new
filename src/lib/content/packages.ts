import type { PackageContent } from "./types";

export const PACKAGES: PackageContent[] = [
  {
    slug: { tr: "buyume-sprinti", en: "growth-sprint" },
    name: { tr: "Büyüme Sprinti", en: "Growth Sprint" },
    pillar: "growth",
    durationWeeks: 4,
    pricing: { TRY: 240000, EUR: 7500, USD: 8200 },
    outcome: {
      tr: "Hangi kanalda parayı nereye koyacağını net bilmek.",
      en: "Know exactly which channel to put money into and where.",
    },
    summary: {
      tr: "Performans kanallarının hepsine dağılmak yerine, tek bir sprintle iki-üç kanalda net yön bulmak için. Marka tonundan medya planına, CRO'dan raporlamaya kadar.",
      en: "Instead of spreading thin across all performance channels, one sprint to find clear direction in two-three channels — brand tone to media plan, CRO to reporting.",
    },
    scope: {
      tr: [
        "Mevcut kanalların denetimi (Google, Meta, TikTok, SEO, e-mail)",
        "İlk 90 gün için kanal bazlı hipotez ve bütçe",
        "En kritik funnel adımının A/B test planı",
        "Marka ton ve mesaj mimarisi (tek sayfalık)",
        "Haftalık performans paneli kurulumu",
      ],
      en: [
        "Audit of current channels (Google, Meta, TikTok, SEO, email)",
        "First 90 days channel-level hypothesis and budget",
        "A/B test plan for the most critical funnel step",
        "Brand tone and message architecture (single page)",
        "Weekly performance dashboard setup",
      ],
    },
    deliverables: {
      tr: [
        "Sprint raporu (30+ sayfa) — teşhis, strateji, yol haritası",
        "Medya planı Q1",
        "Test backlog — ilk 8 hafta",
      ],
      en: [
        "Sprint report (30+ pages) — diagnosis, strategy, roadmap",
        "Media plan for Q1",
        "Test backlog — first 8 weeks",
      ],
    },
    whoFor: {
      tr: [
        "Yıllık cirosu 20M TL+ e-ticaret markaları",
        "D2C perakende",
        "Mass-market tüketici markaları",
      ],
      en: [
        "E-commerce brands with 20M TL+ annual revenue",
        "D2C retail",
        "Mass-market consumer brands",
      ],
    },
    faq: [
      {
        question: {
          tr: "4 hafta gerçekten yeterli mi?",
          en: "Is 4 weeks really enough?",
        },
        answer: {
          tr: "Strateji ve hipotez için yeterli. Uygulamanın tamamı için değil — sprint sonunda karar senindir; proje veya aylık retainer'a geçişe hazırız.",
          en: "For strategy and hypotheses, yes. Not for full execution — after the sprint you can transition to a project or monthly retainer.",
        },
      },
      {
        question: {
          tr: "Sprint sonrası bağlayıcı bir taahhüt var mı?",
          en: "Is there any commitment after the sprint?",
        },
        answer: {
          tr: "Yok. Sprint sonunda rapor teslim edilir, devam edip etmeme kararı senindir.",
          en: "No. The report is delivered; whether to continue is your call.",
        },
      },
    ],
  },
  {
    slug: {
      tr: "dijital-donusum-teshisi",
      en: "digital-transformation-audit",
    },
    name: {
      tr: "Dijital Dönüşüm Teşhisi",
      en: "Digital Transformation Audit",
    },
    pillar: "transform",
    durationWeeks: 3,
    pricing: { TRY: 180000, EUR: 5500, USD: 6000 },
    outcome: {
      tr: "Dijitalleşecek süreçleri ve sırasını sayfa sayfa yol haritası.",
      en: "Page-by-page roadmap of which processes to digitize first.",
    },
    summary: {
      tr: "Hangi süreç, hangi sırayla, hangi bütçeyle dijitalleşir? 3 haftada net cevap. ERP'ye dalmadan, AI abartısına kapılmadan.",
      en: "Which process, in what order, with what budget? A clear answer in 3 weeks — without diving into ERP or chasing AI hype.",
    },
    scope: {
      tr: [
        "Sahada 3-5 süreç gözlemi",
        "Süreç sahipleriyle yapılandırılmış görüşme (5-10 kişi)",
        "As-is süreç haritaları",
        "ROI projeksiyonu ile prioritize edilmiş 3-5 pilot önerisi",
        "6 aylık roadmap — kime ne zaman ne düşer",
      ],
      en: [
        "On-site observation of 3-5 processes",
        "Structured interviews with process owners (5-10 people)",
        "As-is process maps",
        "3-5 pilot proposals prioritized with ROI projection",
        "6-month roadmap — who does what when",
      ],
    },
    deliverables: {
      tr: [
        "Teşhis raporu (40+ sayfa)",
        "Pilot önerileri — her biri için ayrı spec dokümanı",
        "Roadmap Gantt chart (3 faz)",
      ],
      en: [
        "Diagnostic report (40+ pages)",
        "Pilot proposals — individual spec doc for each",
        "Roadmap Gantt chart (3 phases)",
      ],
    },
    whoFor: {
      tr: [
        "Üretim yapan sanayi şirketleri (100-5000 çalışan)",
        "Kurumsal KOBİ'ler",
        "Perakende zincirleri",
      ],
      en: [
        "Manufacturing companies (100-5000 employees)",
        "Enterprise SMBs",
        "Retail chains",
      ],
    },
    faq: [
      {
        question: {
          tr: "ERP satıyor musunuz?",
          en: "Do you sell ERP?",
        },
        answer: {
          tr: "Hayır. Bağımsız danışmanlık. Hangi ERP, hangi modül, hangi sırayla — kararı sen verirsin.",
          en: "No. Independent advisory. Which ERP, which module, in what order — your call.",
        },
      },
      {
        question: {
          tr: "AI projesi için uygun mu?",
          en: "Is this suitable for an AI project?",
        },
        answer: {
          tr: "Teşhis kapsamı AI dahil her dijital süreci kapsar. AI'a uygun olmadığını söylemek de sonuç.",
          en: "The scope covers every digital process including AI. Concluding AI is not the right fit is also an outcome.",
        },
      },
    ],
  },
  {
    slug: { tr: "ai-pilot", en: "ai-pilot" },
    name: { tr: "AI Pilot", en: "AI Pilot" },
    pillar: "transform",
    durationWeeks: 6,
    pricing: { TRY: 480000, EUR: 15000, USD: 16500 },
    outcome: {
      tr: "Somut bir iş problemine uçtan uca çalışan AI prototipi.",
      en: "An end-to-end working AI prototype for one concrete business problem.",
    },
    summary: {
      tr: "LLM abartısı değil. Senaryo, veri, model ve entegrasyon — 6 haftada uçtan uca çalışır hale gelir. Kullanıcı gerçekten kullanıyorsa pilot başarılı.",
      en: "Not LLM hype. Scenario, data, model, integration — end-to-end in 6 weeks. The pilot succeeds only if a real user is actually using it.",
    },
    scope: {
      tr: [
        "Use case seçimi ve değer doğrulaması",
        "Veri envanteri + kalite check",
        "Model seçimi (LLM / klasik ML / hibrit)",
        "Prototip + UI",
        "Gerçek kullanıcı ile 2 haftalık saha testi",
      ],
      en: [
        "Use case selection and value validation",
        "Data inventory + quality check",
        "Model choice (LLM / classical ML / hybrid)",
        "Prototype + UI",
        "2-week field test with real users",
      ],
    },
    deliverables: {
      tr: [
        "Çalışan prototip (source code dahil)",
        "Pilot raporu — metrikler, maliyet, scale önerisi",
        "Production'a geçiş yol haritası",
      ],
      en: [
        "Working prototype (source code included)",
        "Pilot report — metrics, cost, scale recommendation",
        "Roadmap to production",
      ],
    },
    whoFor: {
      tr: [
        "Spesifik bir AI fikri olan şirketler",
        "\"AI yapmalıyız ama nereden\" diyen liderlikler",
        "Data-zengin, süreç-yoğun organizasyonlar",
      ],
      en: [
        "Companies with a specific AI idea",
        "Leadership asking \"we should do AI, but where\"",
        "Data-rich, process-heavy organizations",
      ],
    },
    faq: [
      {
        question: {
          tr: "Pilot production'a hazır olur mu?",
          en: "Will the pilot be production-ready?",
        },
        answer: {
          tr: "Pilot demek — değil. Ama production'a hangi adımlarla, hangi maliyetle gideceği net olur.",
          en: "A pilot by definition — no. But the path and cost to production will be clear.",
        },
      },
    ],
  },
  {
    slug: { tr: "mvp-build", en: "mvp-build" },
    name: { tr: "MVP Build", en: "MVP Build" },
    pillar: "build",
    durationWeeks: 8,
    pricing: { TRY: 720000, EUR: 22500, USD: 24500 },
    outcome: {
      tr: "Piyasaya çıkmaya hazır mobil veya web uygulaması.",
      en: "Market-ready mobile or web application.",
    },
    summary: {
      tr: "İlk ürün versiyonunu 8 haftada canlıya çıkarırız. Tasarımdan canlıya almaya, gözlemden devre — kod sahiplikle birlikte teslim.",
      en: "Ship the first version in 8 weeks. From design to deploy, observability to handover — code delivered with ownership.",
    },
    scope: {
      tr: [
        "Ürün spec + user stories",
        "UI/UX tasarım",
        "Frontend + backend geliştirme",
        "Deploy + observability kurulumu",
        "30 gün stabilizasyon",
      ],
      en: [
        "Product spec + user stories",
        "UI/UX design",
        "Frontend + backend development",
        "Deploy + observability setup",
        "30 days of stabilization",
      ],
    },
    deliverables: {
      tr: [
        "Canlı uygulama",
        "Source code (tam sahiplikle)",
        "Operations runbook",
      ],
      en: ["Live application", "Source code (full ownership)", "Operations runbook"],
    },
    whoFor: {
      tr: [
        "Yeni bir dijital ürün çıkaran markalar",
        "İç operasyonu için custom tool geliştiren şirketler",
        "Founders — teknik co-founder yerine paketli bir ekip arayanlar",
      ],
      en: [
        "Brands launching a new digital product",
        "Companies building a custom internal tool",
        "Founders looking for a packaged team instead of a technical co-founder",
      ],
    },
    faq: [
      {
        question: { tr: "8 hafta gerçekçi mi?", en: "Is 8 weeks realistic?" },
        answer: {
          tr: "İlk değer getiren versiyon için evet. Her özellik için değil — kapsam, sprint'te hafta hafta koruma altında.",
          en: "For the first value-delivering version, yes. Not for every feature — scope is protected week by week in the sprint.",
        },
      },
    ],
  },
];

export function getPackageBySlug(
  slug: string,
  locale: "tr" | "en"
): PackageContent | null {
  return (
    PACKAGES.find((p) => p.slug[locale] === slug || p.slug.tr === slug) ?? null
  );
}
