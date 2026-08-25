import type { ServiceContent } from "../types";

/**
 * İş zekası — Transform.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const isZekasi: ServiceContent = {
  slug: { tr: "is-zekasi", en: "business-intelligence" },
  pillar: "transform",
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

  lede: {
    tr: "İş zekası, şirketin dağınık verilerini yönetimin her hafta baktığı tek bir tabloya indirmektir. INDOLES yeni rapor üretmez; hangi beş sayının gerçekten karar değiştirdiğini bulur ve gerisini kaldırır.",
    en: "Business intelligence is reducing a company's scattered data to one table leadership looks at every week. INDOLES does not add reports; it finds which five numbers actually change decisions and removes the rest.",
  },

  signals: {
    tr: [
      "Aynı soruya iki ayrı rapordan iki farklı cevap çıkıyor.",
      "Ay sonu raporu hazırlamak günler alıyor, hazır olduğunda geçerliliğini yitiriyor.",
      "Kârın hangi üründen veya hangi müşteriden geldiği net bilinmiyor.",
    ],
    en: [
      "The same question gets two different answers from two different reports.",
      "The month-end report takes days to prepare and is stale by the time it lands.",
      "Which product or which customer actually drives profit is not clear.",
    ],
  },

  platforms: ["SAP", "Google Analytics"],

  scope: {
    includes: [
      {
        title: { tr: "Karar sorusu listesi", en: "Decision question list" },
        description: {
          tr: "Yönetim hangi soruları soruyor ve hangi cevaplar karar değiştiriyor? Panel bu sorulardan geriye doğru tasarlanır.",
          en: "Which questions does leadership ask, and which answers change a decision? The dashboard is designed backwards from these.",
        },
      },
      {
        title: { tr: "Veri kaynaklarının bağlanması", en: "Connecting data sources" },
        description: {
          tr: "Muhasebe, satış, üretim ve reklam verileri tek yerde toplanır. Elle dosya birleştirme işi ortadan kalkar.",
          en: "Accounting, sales, production and advertising data land in one place. Manual file merging disappears.",
        },
      },
      {
        title: { tr: "Tanım birliği", en: "Definition alignment" },
        description: {
          tr: "\"Ciro\", \"aktif müşteri\", \"teslim süresi\" ne demek — herkesin aynı şeyi anlaması için tanımlar yazılı hâle gelir.",
          en: "What \"revenue\", \"active customer\" or \"lead time\" mean gets written down so everyone reads the same thing.",
        },
      },
      {
        title: { tr: "Gösterge paneli", en: "Dashboard" },
        description: {
          tr: "Karar değiştiren sayılar tek ekranda toplanır; detay isteyene alt kırılım, istemeyene özet gösterilir.",
          en: "Decision-changing numbers sit on one screen, with breakdowns for those who want detail and a summary for those who do not.",
        },
      },
      {
        title: { tr: "Veri kalitesi kontrolleri", en: "Data quality checks" },
        description: {
          tr: "Eksik veya tutarsız kayıt panele düştüğünde uyarı verir. Yanlış veriyle alınan karar, karar yokluğundan kötüdür.",
          en: "Missing or inconsistent records raise a warning on arrival. A decision from wrong data is worse than none.",
        },
      },
      {
        title: { tr: "Otomatik yenileme", en: "Automatic refresh" },
        description: {
          tr: "Panel kendi kendine güncellenir ve periyodik raporlama e-postayla gider; kimse dosya yükleyip yenilemek zorunda kalmaz.",
          en: "The dashboard refreshes itself and periodic reporting goes out by email; nobody has to upload a file to update it.",
        },
      },
      {
        title: { tr: "Okuma kılavuzu", en: "Reading guide" },
        description: {
          tr: "Hangi sayı hangi eşiği geçince ne yapılır — panel yalnız göstermez, karar kuralını da taşır.",
          en: "What to do when a number crosses a threshold — the dashboard carries the decision rule, not just the figure.",
        },
      },
    ],
    excludes: {
      tr: [
        "Veri ambarı donanımı ve sunucu tedariki",
        "Kaynak sistemlerdeki hatalı verinin geçmişe dönük temizlenmesi",
        "Günlük rapor hazırlama ve yorumlama operasyonu",
        "Analiz sonuçlarına göre karar alma sorumluluğu",
      ],
      en: [
        "Data warehouse hardware and server procurement",
        "Retroactive cleaning of bad data in source systems",
        "Day-to-day report preparation and commentary",
        "Responsibility for the decisions taken from the analysis",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Soruların toplanması", en: "Collecting the questions" },
      description: {
        tr: "Yönetim ve bölüm sorumlularıyla konuşulur: hangi soruya cevap arıyorlar, cevap gelince ne değişecek?",
        en: "Leadership and department heads are asked: which questions are you trying to answer, and what changes when the answer arrives?",
      },
      output: {
        tr: "Karar sorusu listesi ve her sorunun sahibi.",
        en: "A list of decision questions with an owner for each.",
      },
    },
    {
      step: "02",
      title: { tr: "Veri ve tanım denetimi", en: "Data and definition audit" },
      description: {
        tr: "Soruların cevabı hangi veride var, o veri güvenilir mi? Aynı kavramın farklı tanımları bu adımda birleştirilir.",
        en: "Which data answers the questions, and is it reliable? Conflicting definitions of the same concept get reconciled here.",
      },
      output: {
        tr: "Veri kaynağı haritası ve yazılı tanım sözlüğü.",
        en: "A data source map and a written definition glossary.",
      },
    },
    {
      step: "03",
      title: { tr: "Panel kurulumu", en: "Building the dashboard" },
      description: {
        tr: "Veri kaynakları bağlanır, panel kurulur ve sayılar bilinen bir dönemle karşılaştırılarak doğrulanır.",
        en: "Sources are connected, the dashboard is built and the figures are validated against a known period.",
      },
      output: {
        tr: "Çalışan panel ve doğrulama karşılaştırması.",
        en: "A working dashboard and its validation comparison.",
      },
    },
    {
      step: "04",
      title: { tr: "Ritmin kurulması", en: "Establishing the rhythm" },
      description: {
        tr: "Haftalık toplantı panelin üzerinden yürütülmeye başlanır. Panel kullanılmadığı sürece kurulmuş sayılmaz.",
        en: "The weekly meeting starts running off the dashboard. A dashboard nobody uses is not finished.",
      },
      output: {
        tr: "Okuma kılavuzu ve panele bağlanmış haftalık toplantı düzeni.",
        en: "A reading guide and a weekly meeting routine anchored on the dashboard.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Karar sorusu listesi", en: "Decision question list" },
      description: {
        tr: "Yönetimin cevap aradığı sorular ve her birinin karar karşılığı.",
        en: "The questions leadership needs answered and the decision behind each.",
      },
    },
    {
      kind: "document",
      title: { tr: "Tanım sözlüğü", en: "Definition glossary" },
      description: {
        tr: "Ciro, müşteri, marj gibi kavramların şirket içinde tek tanımı.",
        en: "A single company-wide definition for revenue, customer, margin and the rest.",
      },
    },
    {
      kind: "system",
      title: { tr: "Gösterge paneli", en: "Dashboard" },
      description: {
        tr: "Karar değiştiren sayılar tek ekranda, otomatik yenilenir hâlde.",
        en: "Decision-changing numbers on one screen, refreshing automatically.",
      },
    },
    {
      kind: "system",
      title: { tr: "Veri bağlantıları", en: "Data connections" },
      description: {
        tr: "Muhasebe, satış ve üretim kaynaklarının panele otomatik akışı.",
        en: "Accounting, sales and production sources flowing into the dashboard.",
      },
    },
    {
      kind: "document",
      title: { tr: "Okuma kılavuzu", en: "Reading guide" },
      description: {
        tr: "Hangi sayı hangi eşikte ne anlama gelir ve ne yapılması gerekir.",
        en: "What each number means at which threshold, and what to do about it.",
      },
    },
    {
      kind: "training",
      title: { tr: "Yönetim oturumu", en: "Leadership session" },
      description: {
        tr: "Haftalık toplantının panel üzerinden nasıl yürütüleceği aktarılır.",
        en: "How to run the weekly meeting off the dashboard is walked through.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Verilerimiz dağınık, önce onları mı düzeltmeliyiz?",
        en: "Our data is messy — should we fix that first?",
      },
      answer: {
        tr: "Bütün veriyi düzeltmeyi beklemek iş zekası projelerini yıllarca erteletir. INDOLES bunun yerine karar sorularından başlar: yalnız o soruların cevabı için gereken veri incelenir ve gerekiyorsa o kadarı düzeltilir. Kalan dağınıklık panelin dışında bırakılır; kapsam soruya göre daralır, veri kalitesi bahane olmaktan çıkar.",
        en: "Waiting to fix all the data postpones business intelligence projects for years. INDOLES starts from the decision questions instead: only the data needed to answer those is examined and, where necessary, cleaned. The remaining mess is left outside the dashboard, so scope narrows to the question and data quality stops being an excuse.",
      },
    },
    {
      question: {
        tr: "Hangi panel aracını kullanıyorsunuz?",
        en: "Which dashboard tool do you use?",
      },
      answer: {
        tr: "Araç seçimi mevcut altyapınıza, veri hacmine ve ekibin alışkanlığına göre yapılır; INDOLES tek bir ürüne bağlı çalışmaz. Şirkette zaten kullanılan bir araç varsa önce onunla ne kadar yol alınabileceğine bakılır. Karar gerekçesi ve lisans maliyeti yazılı olarak sunulur, seçim sizin onayınızla kesinleşir.",
        en: "Tool choice follows your existing stack, data volume and what the team is used to; INDOLES is not tied to a single product. If a tool is already in use, the first question is how far it can go. The reasoning and licence cost are presented in writing, and the choice is confirmed with your approval.",
      },
    },
    {
      question: {
        tr: "Kaç gösterge olmalı?",
        en: "How many metrics should there be?",
      },
      answer: {
        tr: "Yönetim panelinde beş ila yedi sayı, çoğu şirket için yeterlidir ve fazlası kararı kolaylaştırmak yerine zorlaştırır. INDOLES göstergeleri karar sorularından türetir: bir sayı hiçbir kararı değiştirmiyorsa panele girmez, detay ekranında kalır. Panelin işi bilgi göstermek değil, o hafta neye bakılacağını söylemektir.",
        en: "Five to seven numbers on a leadership dashboard is enough for most companies, and more makes decisions harder rather than easier. INDOLES derives metrics from the decision questions: if a number changes no decision it stays off the dashboard and lives in the detail view. A dashboard's job is not to show information but to say what to look at this week.",
      },
    },
    {
      question: {
        tr: "Panel ne kadar sürede kurulur?",
        en: "How long does the dashboard take to build?",
      },
      answer: {
        tr: "Karar sorularından çalışan panele kadar geçen süre genellikle dört ila altı haftadır: bir hafta soru toplama, bir iki hafta veri ve tanım denetimi, kalanı kurulum ve doğrulama. Veri kaynakları entegrasyona kapalıysa süre uzar; bu risk denetim adımında ortaya çıkar ve takvim o noktada güncellenir. İlk panel bilerek dar tutulur — beş sayı, tek ekran, çalışır hâlde.",
        en: "From decision questions to a working dashboard usually takes four to six weeks: a week collecting questions, one or two auditing data and definitions, the rest for the build and validation. Closed-off data sources stretch the timeline; that risk surfaces during the audit step and the schedule is updated there. The first dashboard is kept deliberately narrow — five numbers, one screen, working.",
      },
    },
    {
      question: {
        tr: "Panel kurulduktan sonra kim bakacak?",
        en: "Who maintains the dashboard afterwards?",
      },
      answer: {
        tr: "Panel otomatik yenilenecek şekilde kurulur, günlük bakım gerektirmez. Veri kaynağı değişirse veya yeni soru eklenmek istenirse iç ekip okuma kılavuzu ve devir oturumundaki bilgiyle çoğu değişikliği kendi yapabilir. INDOLES kalıcı operasyon üstlenmez; panel kurulduğu gibi sizde kalır ve her ay fatura üreten bir ilişkiye dönüşmez.",
        en: "The dashboard is built to refresh automatically and needs no daily maintenance. If a source changes or a new question is added, the in-house team can make most changes using the reading guide and the handover session. INDOLES does not take on ongoing operations; the goal is a working routine, not a monthly invoice.",
      },
    },
    {
      question: {
        tr: "İş zekası nedir?",
        en: "What is business intelligence?",
      },
      answer: {
        tr: "İş zekası, şirketin dağınık verilerini yönetimin her hafta baktığı tek bir tabloya indirmektir. Muhasebe, satış, üretim ve reklam verileri tek yerde toplanır; karar değiştiren sayılar bir ekranda, detay ise alt kırılımda durur. Panel yeni rapor üretmek için değil, o hafta neye bakılacağını söylemek için kurulur.",
        en: "The work of business intelligence is bringing a company's scattered data down to one table that management looks at every week. Accounting, sales, production and advertising data are gathered in one place; the numbers that change decisions sit on one screen, with detail one level below. The dashboard exists to say what to look at this week, not to produce more reports.",
      },
    },
    {
      question: {
        tr: "Raporlama otomasyonu bu hizmetin içinde mi?",
        en: "Is automated reporting part of this service?",
      },
      answer: {
        tr: "Evet, panel kendi kendine güncellenir ve periyodik raporlar e-postayla ilgili kişilere gider. Kimse dosya yükleyip yenilemek zorunda kalmaz, ay sonu raporu hazırlamak günler almaz. Günlük rapor hazırlama ve yorumlama operasyonunu sürekli yürütmek ise kapsam dışında; kurulan düzen bu işi zaten gereksiz kılar.",
        en: "Yes — the dashboard refreshes itself and periodic reports go out by email to the people who need them. Nobody has to upload a file and rebuild it, and the month-end report no longer takes days. Running a permanent day-to-day reporting and commentary operation stays outside the scope; the setup makes that work unnecessary in the first place.",
      },
    },
    {
      question: {
        tr: "Aynı soruya iki raporda iki farklı cevap çıkıyor, bu nasıl düzelir?",
        en: "Two reports give two different answers to the same question — how is that fixed?",
      },
      answer: {
        tr: "Fark neredeyse her zaman tanımdan doğar: iki rapor \"ciro\" ya da \"aktif müşteri\" derken farklı şeyi sayar. Tanım birliği adımında bu kavramlar şirket içinde tek anlama indirilir ve yazılı bir sözlüğe geçer. Panel bu sözlükten beslendiği için aynı soru bir daha iki cevap vermez.",
        en: "The gap almost always comes from definitions: two reports counting different things while both say \"revenue\" or \"active customer\". In the definition alignment step those terms are reduced to one meaning across the company and written into a glossary. The dashboard is built on that glossary, so the same question stops returning two answers.",
      },
    },
    {
      question: {
        tr: "Veri odaklı karar almaya nasıl geçiliyor?",
        en: "How does a company move to data-driven decisions?",
      },
      answer: {
        tr: "Geçiş panelle değil ritimle olur: haftalık toplantı panelin üzerinden yürütülmeye başlanır ve panel kullanılmadığı sürece kurulmuş sayılmaz. Okuma kılavuzu her sayının hangi eşikte ne anlama geldiğini ve ne yapılması gerektiğini yazar, böylece toplantı yorum tartışmasına dönmez. Yönetim oturumunda bu düzenin nasıl sürdürüleceği aktarılır.",
        en: "The shift comes from rhythm, not from the dashboard: the weekly meeting starts running off the dashboard, and until it is used the build does not count as finished. The reading guide states what each number means at each threshold and what to do about it, so the meeting does not turn into a debate over interpretation. The leadership session passes on how to keep that rhythm going.",
      },
    },
    {
      question: {
        tr: "Bizim tarafımızdan kim katılır?",
        en: "Who takes part from our side?",
      },
      answer: {
        tr: "Soru toplama adımında yönetim ve bölüm sorumluları katılır; her karar sorusunun bir sahibi olur. Veri ve tanım denetiminde muhasebe, satış ve üretim tarafından kaynaklara erişim verecek kişiler gerekir. Kurulum sonrasında haftalık toplantıyı yürütecek yönetim ekibi oturuma girer, çünkü paneli kullanacak olan onlar.",
        en: "At the question-gathering step, management and department heads take part, and every decision question gets an owner. During the data and definition audit you need people who can grant access to the accounting, sales and production sources. After the build, the management team that will run the weekly meeting joins the session, because they are the ones who will use it.",
      },
    },
    {
      question: {
        tr: "Hangi durumda iş zekası yanlış tercih olur?",
        en: "When is business intelligence the wrong choice?",
      },
      answer: {
        tr: "Yönetimin cevap aradığı net bir soru yoksa panel kurmak yalnız ekran sayısını artırır; önce karar sorularının yazılması gerekir. Kaynak sistemlerdeki hatalı verinin geçmişe dönük temizlenmesi bu kapsamın dışında, dolayısıyla beklenti buysa iş yanlış yerde başlar. Panel kararı da vermez; analiz sonucuna göre karar alma sorumluluğu şirkette kalır.",
        en: "If management has no clear question it wants answered, a dashboard only adds another screen — the decision questions have to be written first. Retroactively cleaning bad data in source systems sits outside this scope, so if that is the expectation, the work starts in the wrong place. The dashboard also does not decide; responsibility for the decisions stays with the company.",
      },
    },
  ],

  seo: {
    title: {
      tr: "İş zekası ve raporlama danışmanlığı",
      en: "Business intelligence consulting",
    },
    description: {
      tr: "Dağınık veriyi yönetimin haftalık baktığı tek panele indiren iş zekası ve raporlama otomasyonu. Karar sorularından başlanır, tanımlar sözlükte birleşir.",
      en: "Business intelligence and reporting automation that reduce scattered data to one weekly dashboard. Starts from decision questions, aligns every definition.",
    },
    entities: {
      tr: [
        "INDOLES",
        "iş zekası",
        "gösterge paneli",
        "veri kaynağı",
        "raporlama",
      ],
      en: [
        "INDOLES",
        "business intelligence",
        "dashboard",
        "data source",
        "reporting",
      ],
    },
  },

  relatedPackages: [],
  relatedServices: ["is-otomasyonlari", "ai-danismanlik", "isletme-muhendisligi"],
};
