import type { ServiceContent } from "../types";

/**
 * Özel yazılım ve mobil uygulama — Build.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı. Kart metnindeki
 * "TypeScript monolit varsayılan" teknik iddiası korunuyor ama sayfa
 * gövdesinde KOBİ diline çevriliyor — alıcı stack tartışmasına girmek
 * zorunda değil, kararın gerekçesini anlaması yeterli.
 */
export const ozelYazilimVeMobil: ServiceContent = {
  slug: { tr: "ozel-yazilim-ve-mobil", en: "custom-software-development" },
  pillar: "build",
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

  lede: {
    tr: "Özel yazılım, hazır programların karşılamadığı bir ihtiyacı sıfırdan kurmaktır. INDOLES bu işe her zaman aynı soruyla başlar: bu gerçekten yazılmalı mı, yoksa mevcut bir araçla çözülebilir mi?",
    en: "Custom software means building from scratch what off-the-shelf products cannot cover. INDOLES always starts with the same question: does this genuinely need to be built, or can an existing tool solve it?",
  },

  signals: {
    tr: [
      "İşin can damarı Excel dosyalarında yürüyor ve tek kişi biliyor.",
      "Hazır programlar denendi ama hiçbiri sizin çalışma şeklinize uymadı.",
      "Müşteriye vermek istediğiniz bir hizmet var, altyapısı yok.",
    ],
    en: [
      "The core of the business runs on spreadsheets only one person understands.",
      "Off-the-shelf tools were tried and none fit how you actually work.",
      "There is a service you want to offer customers and no system behind it.",
    ],
  },

  platforms: ["Vercel", "Figma"],

  scope: {
    includes: [
      {
        title: { tr: "İhtiyaç netleştirme", en: "Requirement definition" },
        description: {
          tr: "Sistemin hangi işi çözeceği ve hangi işi çözmeyeceği yazılır. Kapsam baştan çizilmezse proje büyümeye devam eder.",
          en: "What the system will and will not solve gets written down. Without a drawn boundary, scope keeps growing.",
        },
      },
      {
        title: { tr: "Yapmadan önce eleme", en: "Build-or-buy check" },
        description: {
          tr: "Hazır bir ürün bu işi çözüyor mu? Çözüyorsa INDOLES yazmamayı önerir — yazılan her satırın bakım maliyeti vardır.",
          en: "Does an existing product solve this? If it does, INDOLES recommends not building — every line written carries maintenance cost.",
        },
      },
      {
        title: { tr: "Ekran tasarımı", en: "Screen design" },
        description: {
          tr: "Kullanıcının göreceği ekranlar kodlamadan önce çizilir ve onaylanır; değişiklik kâğıt üzerinde ucuzdur.",
          en: "The screens users will see are drawn and approved before coding; changes are cheap on paper.",
        },
      },
      {
        title: { tr: "Geliştirme", en: "Development" },
        description: {
          tr: "Sistem parça parça kurulur ve her parça çalışır hâlde teslim edilir. İlerleme aylık değil haftalık görünür.",
          en: "The system is built piece by piece, each delivered working. Progress is visible weekly rather than monthly.",
        },
      },
      {
        title: { tr: "Mevcut sistemlere bağlantı", en: "Integration with existing systems" },
        description: {
          tr: "Muhasebe, ERP veya e-ticaret altyapısıyla veri alışverişi kurulur; yeni sistem ada olarak kalmaz.",
          en: "Data exchange with accounting, ERP or the e-commerce platform is set up so the new system is not an island.",
        },
      },
      {
        title: { tr: "Test ve hata ayıklama", en: "Testing and hardening" },
        description: {
          tr: "Gerçek verilerle test edilir, kritik akışlar için otomatik test yazılır. Hata canlıda değil testte bulunur.",
          en: "Tested with real data, with automated tests for critical flows. Bugs get found in testing, not in production.",
        },
      },
      {
        title: { tr: "Canlıya alma ve devir", en: "Launch and handover" },
        description: {
          tr: "Sistem yayına alınır, kullanıcı eğitimi verilir ve kaynak kod dokümantasyonuyla birlikte teslim edilir.",
          en: "The system goes live, users are trained, and the source code is handed over with its documentation.",
        },
      },
    ],
    excludes: {
      tr: [
        "Uygulama mağazası reklamı ve indirme kampanyaları — performans pazarlama hizmetinde",
        "Süresiz bakım ve 7/24 destek — ayrı sözleşmeyle tanımlanır",
        "Üçüncü taraf servis ve API kullanım bedelleri",
        "Donanım, sunucu ve cihaz tedariki",
      ],
      en: [
        "App store advertising and install campaigns — covered by performance marketing",
        "Open-ended maintenance and 24/7 support — defined in a separate agreement",
        "Third-party service and API usage fees",
        "Hardware, server and device procurement",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Kapsam çizimi", en: "Drawing the scope" },
      description: {
        tr: "Sistemin çözeceği iş ve sınırları yazılır. Bu adımda çoğu zaman kapsamın bir kısmı hazır araçlarla çözülüp listeden düşer.",
        en: "What the system solves and where it stops is written down. Often part of the scope gets solved with existing tools and drops off the list here.",
      },
      output: {
        tr: "Kapsam dokümanı ve hazır araçla çözülecek işlerin listesi.",
        en: "A scope document and a list of what existing tools will cover.",
      },
    },
    {
      step: "02",
      title: { tr: "Ekranlar ve plan", en: "Screens and plan" },
      description: {
        tr: "Kullanıcı ekranları çizilir, geliştirme parçalara bölünür ve her parçanın teslim tarihi belirlenir.",
        en: "User screens are drawn, development is split into pieces and each piece gets a delivery date.",
      },
      output: {
        tr: "Onaylanmış ekran tasarımları ve parça bazlı teslim takvimi.",
        en: "Approved screen designs and a piece-by-piece delivery schedule.",
      },
    },
    {
      step: "03",
      title: { tr: "Parça parça geliştirme", en: "Incremental development" },
      description: {
        tr: "Her parça bitince gösterilir ve kullanılabilir hâlde teslim edilir. Geri bildirim sonda değil, yolda alınır.",
        en: "Each piece is demonstrated and delivered usable as it completes. Feedback comes along the way, not at the end.",
      },
      output: {
        tr: "Haftalık çalışan sürümler ve ilerleme kaydı.",
        en: "Weekly working builds and a progress record.",
      },
    },
    {
      step: "04",
      title: { tr: "Canlı ve devir", en: "Launch and handover" },
      description: {
        tr: "Sistem yayına alınır, ilk hafta yakından izlenir. Kaynak kod, doküman ve hesaplar firmaya devredilir.",
        en: "The system goes live and the first week is watched closely. Source code, documentation and accounts transfer to the company.",
      },
      output: {
        tr: "Canlı sistem, teknik doküman ve devredilmiş kaynak kod.",
        en: "A live system, technical documentation and transferred source code.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Kapsam dokümanı", en: "Scope document" },
      description: {
        tr: "Sistemin çözdüğü işler, sınırları ve kapsam dışı bırakılanlar.",
        en: "What the system solves, its boundaries and what stays out of scope.",
      },
    },
    {
      kind: "document",
      title: { tr: "Ekran tasarımları", en: "Screen designs" },
      description: {
        tr: "Kullanıcının göreceği ekranlar, kodlamadan önce onaylanmış hâlde.",
        en: "The screens users will see, approved before any coding started.",
      },
    },
    {
      kind: "system",
      title: { tr: "Çalışan sistem", en: "Working system" },
      description: {
        tr: "Canlıda, gerçek veriyle test edilmiş ve kullanıma açılmış uygulama.",
        en: "The application live, tested with real data and open for use.",
      },
    },
    {
      kind: "system",
      title: { tr: "Entegrasyonlar", en: "Integrations" },
      description: {
        tr: "Muhasebe, ERP veya e-ticaret altyapısıyla kurulmuş veri bağlantıları.",
        en: "Data connections to accounting, ERP or the e-commerce platform.",
      },
    },
    {
      kind: "document",
      title: { tr: "Teknik doküman", en: "Technical documentation" },
      description: {
        tr: "Sistemin nasıl çalıştığı, nerede durduğu ve nasıl geliştirileceği.",
        en: "How the system works, where it runs and how to extend it.",
      },
    },
    {
      kind: "training",
      title: { tr: "Kullanıcı eğitimi", en: "User training" },
      description: {
        tr: "Sistemi kullanacak ekibe verilen, kayıt altına alınmış eğitim oturumu.",
        en: "A recorded training session for the team who will use the system.",
      },
    },
    {
      kind: "access",
      title: { tr: "Kaynak kod sahipliği", en: "Source code ownership" },
      description: {
        tr: "Kaynak kod, depo ve sunucu hesapları firmanın adına devredilir.",
        en: "Source code, repository and server accounts transfer to the company.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Hazır bir program yerine neden özel yazılım?",
        en: "Why custom software instead of an off-the-shelf product?",
      },
      answer: {
        tr: "Özel yazılım yalnız hazır ürünlerin karşılamadığı ihtiyaçta anlamlıdır ve INDOLES bunu her projede baştan sorgular. Hazır bir program işi yüzde seksen çözüyorsa genellikle onu kullanmak daha doğrudur, çünkü yazılan her satırın yıllara yayılan bakım maliyeti vardır. Kapsam çizimi aşamasında hangi parçanın hazır araçla çözüleceği açıkça listelenir.",
        en: "Custom software only makes sense where off-the-shelf products fall short, and INDOLES questions that at the start of every project. If an existing product covers eighty per cent of the job, using it is usually the better call, because every line written carries maintenance cost for years. During scope definition, which parts existing tools will cover is listed explicitly.",
      },
    },
    {
      question: {
        tr: "Proje ne kadar sürer ve maliyeti nasıl belirlenir?",
        en: "How long does a project take and how is cost set?",
      },
      answer: {
        tr: "Orta ölçekli bir iç araç veya modül genellikle sekiz ila on iki hafta sürer; mobil uygulama ve entegrasyon sayısı arttıkça süre uzar. INDOLES maliyeti kapsam dokümanı netleştikten sonra parça bazlı verir, açık uçlu saat faturası kesmez. Kapsam sonradan büyürse fark ayrıca konuşulur ve yazılı onay alınmadan çalışılmaz.",
        en: "A mid-sized internal tool or module usually takes eight to twelve weeks; mobile apps and additional integrations extend that. INDOLES quotes piece by piece once the scope document is settled, rather than billing open-ended hours. If scope grows later, the difference is discussed separately and no work proceeds without written approval.",
      },
    },
    {
      question: {
        tr: "Kaynak kod bizde mi kalır?",
        en: "Do we own the source code?",
      },
      answer: {
        tr: "Kaynak kod, kod deposu ve sunucu hesapları proje sonunda firmanın adına devredilir; INDOLES hiçbir parçayı kendi mülkiyetinde tutmaz. Teknik doküman da birlikte teslim edilir, böylece başka bir geliştirici devam edebilir. Kodun ajansta kaldığı düzenler firmayı kalıcı olarak bağladığı için kurulmaz.",
        en: "Source code, the repository and server accounts transfer to the company at the end of the project; INDOLES keeps no part in its own ownership. Technical documentation is delivered alongside so another developer can pick it up. Arrangements where code stays with the agency lock the company in permanently and are not set up.",
      },
    },
    {
      question: {
        tr: "Teslimden sonra hata çıkarsa ne olur?",
        en: "What happens if bugs appear after delivery?",
      },
      answer: {
        tr: "Teslim sonrası bir stabilizasyon dönemi tanımlanır ve bu dönemde çıkan hatalar ek ücret olmadan giderilir. Sürenin ardından bakım isteğe bağlı ayrı bir sözleşmeyle sürdürülür; zorunlu tutulmaz, çünkü kaynak kod ve doküman sizde olduğu için başka bir ekip de devam edebilir. Kritik akışlar için yazılan otomatik testler hata riskini baştan düşürür.",
        en: "A stabilisation period is defined after delivery, and bugs surfacing within it are fixed at no extra charge. After that, maintenance continues under an optional separate agreement rather than being mandatory — since you hold the source code and documentation, another team can take over. Automated tests written for critical flows lower the risk of bugs from the outset.",
      },
    },
    {
      question: {
        tr: "Mobil uygulama mı web mi yaptırmalıyız?",
        en: "Should we build a mobile app or a web app?",
      },
      answer: {
        tr: "Mobil uygulama yalnız telefona özgü bir ihtiyaç varsa gerekir: bildirim gönderme, kamera veya konum kullanımı, internetsiz çalışma gibi. Bu ihtiyaçlar yoksa mobil uyumlu bir web uygulaması hem daha ucuz hem de mağaza onayı beklemeden güncellenebilir olur. INDOLES kararı kullanım senaryosuna göre verir ve gerekçesini maliyet karşılaştırmasıyla sunar.",
        en: "A mobile app is only necessary when something genuinely needs the phone: push notifications, camera or location use, offline operation. Without those, a mobile-friendly web application is both cheaper and updatable without waiting for store approval. INDOLES decides from the usage scenario and presents the reasoning with a cost comparison.",
      },
    },
  ],

  seo: {
    title: {
      tr: "Özel yazılım ve mobil uygulama geliştirme",
      en: "Custom software and mobile app development",
    },
    description: {
      tr: "İhtiyaca özel yazılım ve mobil uygulama geliştirme. Önce hazır çözüm elenir, kaynak kod ve doküman firmaya devredilir.",
      en: "Custom software and mobile app development. Off-the-shelf options ruled out first; source code and documentation handed to you.",
    },
    entities: {
      tr: [
        "INDOLES",
        "özel yazılım",
        "mobil uygulama",
        "kaynak kod",
        "entegrasyon",
      ],
      en: [
        "INDOLES",
        "custom software",
        "mobile app",
        "source code",
        "integration",
      ],
    },
  },

  relatedPackages: ["mvp-build"],
  relatedServices: ["teknoloji-ve-altyapi", "ui-ux-tasarim", "e-ticaret"],
};
