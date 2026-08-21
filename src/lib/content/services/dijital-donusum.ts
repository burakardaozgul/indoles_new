import type { ServiceContent } from "../types";

/**
 * Dijital dönüşüm — Transform.
 *
 * EN slug `digital-transformation`; pillar anahtarı `transform` ile
 * çakışmıyor (test doğruluyor).
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const dijitalDonusum: ServiceContent = {
  slug: { tr: "dijital-donusum", en: "digital-transformation" },
  pillar: "transform",
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

  lede: {
    tr: "Dijital dönüşüm, şirketin hangi sistemi hangi sırayla kuracağına karar vermektir. INDOLES her şeyi birden değiştirmeyi önermez; en çok sıkışan yeri bulur, oradan başlar ve bir sonraki adımı ancak öncekinin karşılığı görülünce atar.",
    en: "Digital transformation is deciding which system to build in which order. INDOLES does not propose changing everything at once; it finds the tightest bottleneck, starts there, and moves to the next step only once the previous one has paid off.",
  },

  signals: {
    tr: [
      "Aynı bilgi üç ayrı yere elle giriliyor ve hangisinin doğru olduğu bilinmiyor.",
      "Yazılım satıcıları teklif veriyor ama hangisinin gerçekten gerektiği belirsiz.",
      "Bir sipariş veya iş emri şirket içinde kaybolabiliyor.",
    ],
    en: [
      "The same information is typed into three places and no one knows which is right.",
      "Software vendors keep sending proposals and it is unclear which is actually needed.",
      "An order or work request can get lost inside the company.",
    ],
  },

  platforms: ["SAP", "Shopify"],

  scope: {
    includes: [
      {
        title: { tr: "Mevcut durum haritası", en: "Current state map" },
        description: {
          tr: "Hangi iş hangi sistemde yürüyor, veriler nerede duruyor ve nerede elle taşınıyor — sahada gözlemle çıkarılır.",
          en: "Which work runs in which system, where data sits and where it is carried by hand — mapped through on-site observation.",
        },
      },
      {
        title: { tr: "Darboğaz tespiti", en: "Bottleneck identification" },
        description: {
          tr: "En çok zaman kaybı, hata ve bekleme hangi adımda oluyor? Tahminle değil, ölçümle belirlenir.",
          en: "Which step causes the most lost time, errors and waiting? Determined by measurement, not assumption.",
        },
      },
      {
        title: { tr: "Sistem ihtiyaç listesi", en: "System requirements list" },
        description: {
          tr: "Hangi yazılım gerçekten gerekli, hangisi mevcut araçlarla çözülebilir. Satıcı teklifleri bu listeye göre değerlendirilir.",
          en: "Which software is genuinely needed and which need can be met with existing tools. Vendor proposals get judged against this list.",
        },
      },
      {
        title: { tr: "Yatırım getirisi projeksiyonu", en: "ROI projection" },
        description: {
          tr: "Her adım için kurulum maliyeti, kazanılacak süre ve geri dönüş süresi hesaplanır. Sıralama bu hesaba göre yapılır.",
          en: "Setup cost, time saved and payback period are calculated for each step, and the ordering follows that calculation.",
        },
      },
      {
        title: { tr: "Yol haritası", en: "Roadmap" },
        description: {
          tr: "12-24 aylık plan: hangi sistem ne zaman, hangi bütçeyle. Her aşama kendi başına işe yarar hâlde biter.",
          en: "A 12-24 month plan: which system when, on what budget. Each stage ends in a state that works on its own.",
        },
      },
      {
        title: { tr: "Tedarikçi seçim desteği", en: "Vendor selection support" },
        description: {
          tr: "Şartname yazımı, teklif karşılaştırması ve sözleşme kontrolü — satıcı sunumuna değil ihtiyaç listesine bakılır.",
          en: "Writing specifications, comparing proposals and reviewing contracts — judged on the requirements list, not the vendor's pitch.",
        },
      },
      {
        title: { tr: "İlk aşamanın yürütülmesi", en: "Running the first stage" },
        description: {
          tr: "Yol haritasının ilk adımı INDOLES gözetiminde kurulur; sonraki adımlar iç ekip veya tedarikçiyle devam eder.",
          en: "The roadmap's first step is delivered under INDOLES oversight; later steps continue with the in-house team or a vendor.",
        },
      },
    ],
    excludes: {
      tr: [
        "ERP ve yazılım lisanslarının satışı — INDOLES satıcı değildir",
        "Donanım, sunucu ve ağ ekipmanı tedariki",
        "Kurum içi değişim yönetimi ve insan kaynakları danışmanlığı",
        "Günlük sistem yöneticiliği ve son kullanıcı destek hattı",
      ],
      en: [
        "Selling ERP and software licences — INDOLES is not a reseller",
        "Hardware, server and network equipment procurement",
        "Internal change management and HR consulting",
        "Day-to-day system administration and an end-user help desk",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Sahada gözlem", en: "On-site observation" },
      description: {
        tr: "İşin nasıl yürüdüğü yerinde izlenir. Yazılı prosedürle gerçek uygulama arasındaki fark ancak sahada görülür.",
        en: "How the work actually runs is observed on site. The gap between written procedure and real practice only shows there.",
      },
      output: {
        tr: "Mevcut durum haritası ve elle yapılan işlerin listesi.",
        en: "A current-state map and a list of the manual steps.",
      },
    },
    {
      step: "02",
      title: { tr: "Önceliklendirme", en: "Prioritisation" },
      description: {
        tr: "Darboğazlar getiriye göre sıralanır. En çok kaybettiren adım ilk sıraya alınır, en modern teknoloji olan değil.",
        en: "Bottlenecks are ranked by return. The step losing the most goes first — not the one with the newest technology.",
      },
      output: {
        tr: "Sıralanmış darboğaz listesi ve yatırım getirisi projeksiyonu.",
        en: "A ranked bottleneck list with an ROI projection.",
      },
    },
    {
      step: "03",
      title: { tr: "Yol haritası", en: "Roadmap" },
      description: {
        tr: "Hangi sistem ne zaman kurulacak, hangi bütçeyle — 12-24 aylık plan yazılır ve yönetime sunulur.",
        en: "Which system gets built when and on what budget — a 12-24 month plan written and presented to management.",
      },
      output: {
        tr: "Yol haritası dokümanı ve aşama bazlı bütçe.",
        en: "The roadmap document and a stage-by-stage budget.",
      },
    },
    {
      step: "04",
      title: { tr: "İlk adımın kurulumu", en: "Building the first step" },
      description: {
        tr: "Plandaki ilk aşama hayata geçirilir ve sonucu ölçülür. Kâğıt üzerinde kalan dönüşüm planı işe yaramaz.",
        en: "The first stage of the plan is delivered and its result measured. A transformation plan that stays on paper is worthless.",
      },
      output: {
        tr: "Çalışır durumda ilk aşama ve ölçülmüş sonucu.",
        en: "A working first stage with its result measured.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Mevcut durum haritası", en: "Current state map" },
      description: {
        tr: "Sistemler, veri akışı ve elle taşınan işler tek şemada.",
        en: "Systems, data flow and hand-carried work in one diagram.",
      },
    },
    {
      kind: "document",
      title: { tr: "Darboğaz raporu", en: "Bottleneck report" },
      description: {
        tr: "En çok kaybettiren adımlar, ölçülmüş süre ve hata payıyla.",
        en: "The steps losing most, with measured time and error rates.",
      },
    },
    {
      kind: "document",
      title: { tr: "Yatırım getirisi projeksiyonu", en: "ROI projection" },
      description: {
        tr: "Aşama başına maliyet, kazanç ve geri dönüş süresi hesabı.",
        en: "Cost, gain and payback period calculated for each stage.",
      },
    },
    {
      kind: "document",
      title: { tr: "Yol haritası", en: "Roadmap" },
      description: {
        tr: "12-24 aylık sistem kurulum planı, bütçe ve sıralama gerekçesiyle.",
        en: "A 12-24 month build plan with budget and ordering rationale.",
      },
    },
    {
      kind: "document",
      title: { tr: "Tedarikçi şartnamesi", en: "Vendor specification" },
      description: {
        tr: "Teklif toplarken kullanılacak ihtiyaç listesi ve karşılaştırma tablosu.",
        en: "A requirements list and comparison table for collecting proposals.",
      },
    },
    {
      kind: "system",
      title: { tr: "İlk aşama kurulumu", en: "First stage build" },
      description: {
        tr: "Yol haritasının ilk adımı, çalışır ve sonucu ölçülmüş hâlde.",
        en: "The roadmap's first step, working and with results measured.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Dijital dönüşüm ERP almak mı demek?",
        en: "Does digital transformation mean buying an ERP?",
      },
      answer: {
        tr: "Dijital dönüşüm yazılım satın almak değil, hangi işin nasıl yürüyeceğine karar vermektir. INDOLES bazı durumlarda ERP önerir, bazı durumlarda mevcut araçların doğru bağlanmasının yeterli olduğunu söyler. Karar mevcut durum haritası ve darboğaz ölçümünden çıkar; satıcı teklifiyle değil, sizin kaybettiğiniz zamanla belirlenir.",
        en: "Digital transformation is not buying software but deciding how work should run. In some cases INDOLES recommends an ERP, and in others says that connecting existing tools properly is enough. The decision comes from the current-state map and bottleneck measurement — driven by the time you lose, not by a vendor's proposal.",
      },
    },
    {
      question: {
        tr: "Yazılım satıyor musunuz?",
        en: "Do you sell software?",
      },
      answer: {
        tr: "INDOLES yazılım veya lisans satmaz ve hiçbir tedarikçiden komisyon almaz. Bu bağımsızlık önerinin işe yaraması için şart: satıştan pay alan bir danışman her zaman daha çok yazılım önerir. Tedarikçi seçiminde INDOLES sizin tarafınızda durur — şartnameyi yazar, teklifleri karşılaştırır ve sözleşmeyi kontrol eder.",
        en: "INDOLES does not sell software or licences and takes no commission from any vendor. That independence is what makes the advice usable: a consultant earning a share of the sale always recommends more software. In vendor selection INDOLES stands on your side — writing the specification, comparing proposals and reviewing the contract.",
      },
    },
    {
      question: {
        tr: "Her şeyi aynı anda değiştirmek zorunda mıyız?",
        en: "Do we have to change everything at once?",
      },
      answer: {
        tr: "Aynı anda her şeyi değiştirmek dijital dönüşüm projelerinin en sık başarısızlık sebebidir: ekip yeni sistemi öğrenirken iş durur ve geri dönüş yolu kalmaz. INDOLES yol haritasını aşamalara böler ve her aşama kendi başına işe yarar hâlde biter. Bir sonraki adıma ancak öncekinin karşılığı ölçülünce geçilir.",
        en: "Changing everything at once is the most common cause of failure in transformation projects: work stops while the team learns the new system, and there is no way back. INDOLES splits the roadmap into stages, each ending in a state that works on its own. The next step only starts once the previous one's return has been measured.",
      },
    },
    {
      question: {
        tr: "Yol haritası çalışması ne kadar sürer?",
        en: "How long does the roadmap work take?",
      },
      answer: {
        tr: "Gözlemden yol haritasına kadar olan teşhis bölümü orta ölçekli bir şirkette genellikle üç ila beş hafta sürer; sahada geçirilen süre bunun bir ila iki haftasıdır. İlk aşamanın kurulumu ise seçilen adıma göre değişir ve yol haritasında kendi takvimiyle yazılır. INDOLES teşhis bitmeden kurulum süresi için söz vermez — süre tahmini de teşhisin bir çıktısıdır.",
        en: "The diagnostic part, from observation to roadmap, usually takes three to five weeks in a mid-sized company, one to two of them spent on site. How long the first stage takes to build depends on which step is chosen, and it gets its own schedule in the roadmap. INDOLES does not commit to a build timeline before the diagnosis is done — the estimate itself is one of its outputs.",
      },
    },
    {
      question: {
        tr: "Üretim durmadan bu iş yapılabilir mi?",
        en: "Can this be done without stopping production?",
      },
      answer: {
        tr: "Gözlem ve haritalama aşamaları üretimi hiç durdurmaz; INDOLES ekibi sahada izler, işi kesmez. Sistem geçişlerinde ise paralel çalışma yöntemi kullanılır: yeni sistem eskisiyle bir süre birlikte çalışır, doğruluğu teyit edildikten sonra eski kapatılır. Geçiş takvimi üretim planına göre belirlenir, tersi değil.",
        en: "The observation and mapping stages never stop production; the INDOLES team watches on site without interrupting work. For system transitions, parallel running is used: the new system runs alongside the old for a period and the old one is retired only once accuracy is confirmed. The transition schedule follows the production plan, not the other way round.",
      },
    },
  ],

  seo: {
    title: {
      tr: "Dijital dönüşüm danışmanlığı",
      en: "Digital transformation consulting",
    },
    description: {
      tr: "Hangi sistemin hangi sırayla kurulacağını yatırım getirisiyle belirleyen dijital dönüşüm danışmanlığı. Bağımsız — yazılım satışı yok.",
      en: "Digital transformation consulting that decides which system to build in which order, by ROI. Independent — no software sales.",
    },
    entities: {
      tr: [
        "INDOLES",
        "dijital dönüşüm",
        "ERP",
        "darboğaz",
        "yol haritası",
      ],
      en: [
        "INDOLES",
        "digital transformation",
        "ERP",
        "bottleneck",
        "roadmap",
      ],
    },
  },

  relatedPackages: [],
  relatedServices: ["is-otomasyonlari", "isletme-muhendisligi", "teknoloji-ve-altyapi"],
};
