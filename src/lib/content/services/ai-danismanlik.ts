import type { ServiceContent } from "../types";

/**
 * AI danışmanlığı — Transform.
 *
 * Bu hizmetin ton riski en yüksek olanı: alan hype'la dolu. Metin bilinçli
 * olarak "AI her derde deva" iddiasının karşısında duruyor — "nerede AI,
 * nerede klasik otomasyon, nerede hiçbiri" ayrımı `pillars.ts`teki onaylı
 * kart metninden geliyor ve sayfanın omurgası yapıldı.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const aiDanismanlik: ServiceContent = {
  slug: { tr: "ai-danismanlik", en: "ai-consulting" },
  pillar: "transform",
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

  lede: {
    tr: "AI danışmanlığı, yapay zekânın nerede gerçekten para kazandırdığını, nerede pahalı bir oyuncak olduğunu ayırma işidir. INDOLES işe teknolojiyle değil, hangi işin ne kadar zaman ve para yediğini ölçerek başlar.",
    en: "AI advisory is the work of separating where artificial intelligence genuinely pays off from where it is an expensive toy. INDOLES starts not with the technology but by measuring which tasks consume how much time and money.",
  },

  signals: {
    tr: [
      "Herkes yapay zekâdan bahsediyor, nereden başlanacağı belli değil.",
      "Aynı işi her gün elle yapan bir ekip var ve iş hacmiyle birlikte büyüyor.",
      "Elinizde yıllardır biriken veri var ama karar alırken kullanılmıyor.",
    ],
    en: [
      "Everyone talks about AI and no one knows where to start.",
      "A team does the same task by hand every day, and it grows with volume.",
      "Years of data have piled up but none of it informs decisions.",
    ],
  },

  scope: {
    includes: [
      {
        title: { tr: "Aday iş listesi", en: "Candidate task list" },
        description: {
          tr: "Hangi işler tekrarlı, kurallı ve veriye dayalı? Yapay zekâya aday olabilecek işler somut isimleriyle çıkarılır.",
          en: "Which tasks are repetitive, rule-bound and data-driven? Candidate tasks are listed by their concrete names.",
        },
      },
      {
        title: { tr: "Fayda ve maliyet hesabı", en: "Cost-benefit calculation" },
        description: {
          tr: "Her aday iş için kazanılacak zaman, kurulum maliyeti ve aylık işletme gideri karşılaştırılır. Getirmeyen liste dışı kalır.",
          en: "For each candidate, time saved, setup cost and monthly running cost are compared. What does not return gets dropped.",
        },
      },
      {
        title: { tr: "Veri hazırlığı denetimi", en: "Data readiness check" },
        description: {
          tr: "Elinizdeki veri yeterli mi, temiz mi, erişilebilir mi? Yapay zekâ projelerinin çoğu bu adımda tıkanır.",
          en: "Is your data sufficient, clean and accessible? Most AI projects stall at exactly this step.",
        },
      },
      {
        title: { tr: "Yöntem seçimi", en: "Method selection" },
        description: {
          tr: "Hazır servis mi, kural tabanlı otomasyon mu, özel model mi — her iş için en ucuz çalışan yöntem seçilir.",
          en: "Off-the-shelf service, rule-based automation or a custom model — the cheapest thing that works is chosen per task.",
        },
      },
      {
        title: { tr: "Pilot uygulama", en: "Pilot build" },
        description: {
          tr: "Tek bir iş üzerinde gerçek veriyle çalışan pilot kurulur; sonuç mevcut yöntemle yan yana ölçülür.",
          en: "A pilot runs on one task with real data, and the result is measured side by side with the current method.",
        },
      },
      {
        title: { tr: "Doğruluk ve risk ölçümü", en: "Accuracy and risk measurement" },
        description: {
          tr: "Sistem ne sıklıkla yanılıyor, yanıldığında ne oluyor? Hata payı kabul edilebilir mi, kararı veri veriyor.",
          en: "How often does the system get it wrong, and what happens when it does? Data decides whether the error rate is acceptable.",
        },
      },
      {
        title: { tr: "Yaygınlaştırma kararı", en: "Rollout decision" },
        description: {
          tr: "Pilot sonucuna göre devam, düzelt veya durdur kararı verilir. Karar hevesle değil ölçümle alınır.",
          en: "Continue, adjust or stop is decided on the pilot result — by measurement, not by enthusiasm.",
        },
      },
    ],
    excludes: {
      tr: [
        "Sıfırdan model eğitimi ve akademik araştırma çalışmaları",
        "Veri etiketleme operasyonunun sürekli yürütülmesi",
        "GPU sunucu tedariki ve donanım işletmesi",
        "Üçüncü taraf yapay zekâ servislerinin aylık kullanım bedelleri",
      ],
      en: [
        "Training models from scratch and academic research work",
        "Running an ongoing data labelling operation",
        "GPU server procurement and hardware operations",
        "Monthly usage fees for third-party AI services",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "İş envanteri", en: "Task inventory" },
      description: {
        tr: "Ekiplerin zamanının nereye gittiği çıkarılır. Tekrarlı, kurallı ve veriye dayalı işler aday listesine alınır.",
        en: "Where team time actually goes is mapped. Repetitive, rule-bound and data-driven tasks enter the candidate list.",
      },
      output: {
        tr: "Aday iş listesi ve her birinin harcadığı tahmini zaman.",
        en: "A candidate task list with the estimated time each consumes.",
      },
    },
    {
      step: "02",
      title: { tr: "Eleme", en: "Filtering" },
      description: {
        tr: "Her aday fayda, maliyet ve veri hazırlığı açısından elenir. Çoğu fikir bu adımda listeden çıkar — amaç budur.",
        en: "Each candidate is filtered on benefit, cost and data readiness. Most ideas drop out here — that is the point.",
      },
      output: {
        tr: "Elenmiş kısa liste ve her iş için beklenen getiri hesabı.",
        en: "A filtered shortlist with an expected return calculation per task.",
      },
    },
    {
      step: "03",
      title: { tr: "Pilot", en: "Pilot" },
      description: {
        tr: "Kısa listenin ilk sırasındaki iş gerçek veriyle kurulur. Sonuç mevcut yöntemle karşılaştırılarak ölçülür.",
        en: "The top item on the shortlist is built with real data, and the result is measured against the current method.",
      },
      output: {
        tr: "Çalışan pilot ve doğruluk-maliyet ölçüm raporu.",
        en: "A working pilot and an accuracy-and-cost measurement report.",
      },
    },
    {
      step: "04",
      title: { tr: "Karar ve devir", en: "Decision and handover" },
      description: {
        tr: "Pilot getiriyorsa canlıya alınır ve iç ekibe devredilir; getirmiyorsa neden getirmediği yazılır ve durdurulur.",
        en: "If the pilot delivers it goes live and moves to the in-house team; if it does not, why is written down and it stops.",
      },
      output: {
        tr: "Canlı sistem ve işletme kılavuzu, ya da gerekçeli durdurma kararı.",
        en: "A live system with an operating guide, or a documented decision to stop.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "İş envanteri raporu", en: "Task inventory report" },
      description: {
        tr: "Tekrarlı işler ve her birinin ekipten aldığı zaman, ölçümle birlikte.",
        en: "Repetitive tasks and the time each takes from the team, measured.",
      },
    },
    {
      kind: "document",
      title: { tr: "Fizibilite hesabı", en: "Feasibility calculation" },
      description: {
        tr: "Aday iş başına kurulum maliyeti, aylık gider ve beklenen kazanç.",
        en: "Setup cost, monthly running cost and expected gain per candidate.",
      },
    },
    {
      kind: "document",
      title: { tr: "Veri hazırlık raporu", en: "Data readiness report" },
      description: {
        tr: "Mevcut verinin yeterliliği, eksikleri ve tamamlanması gerekenler.",
        en: "Whether current data suffices, what is missing and what to complete.",
      },
    },
    {
      kind: "system",
      title: { tr: "Çalışan pilot", en: "Working pilot" },
      description: {
        tr: "Gerçek veriyle çalışan, sonucu ölçülmüş tek iş üzerinde uygulama.",
        en: "A single-task application running on real data with measured results.",
      },
    },
    {
      kind: "document",
      title: { tr: "Ölçüm raporu", en: "Measurement report" },
      description: {
        tr: "Doğruluk oranı, hata durumları ve mevcut yöntemle karşılaştırma.",
        en: "Accuracy rate, failure modes and comparison with the current method.",
      },
    },
    {
      kind: "training",
      title: { tr: "İşletme eğitimi", en: "Operating training" },
      description: {
        tr: "İç ekibe sistemi izleme, hata durumunu tanıma ve müdahale eğitimi.",
        en: "The in-house team learns to monitor, spot failures and intervene.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Yapay zekâ bizim işimize gerçekten uyar mı?",
        en: "Would AI actually suit our business?",
      },
      answer: {
        tr: "Yapay zekâ her işe uymaz ve INDOLES bu hizmette önce uymadığı yerleri eler. Tekrarlı, kurallı ve yeterli veriye sahip işlerde yapay zekâ karşılığını verir; tek seferlik, yargı gerektiren veya verisi olmayan işlerde vermez. Envanter çalışmasının sonunda hangi işin aday olduğunu ve hangisinin olmadığını gerekçesiyle görürsünüz.",
        en: "AI does not suit every business, and in this service INDOLES first rules out where it does not. It pays off on repetitive, rule-bound tasks with enough data behind them, and does not on one-off work, judgement calls or tasks with no data. At the end of the inventory you see which tasks qualify and which do not, with the reasoning.",
      },
    },
    {
      question: {
        tr: "Yeterli verimiz var mı, nasıl anlarız?",
        en: "Do we have enough data, and how do we know?",
      },
      answer: {
        tr: "Veri hazırlığı denetimi tam olarak bunu cevaplar: mevcut kayıtların miktarı, kalitesi ve erişilebilirliği incelenir. Yapay zekâ projelerinin çoğu model yüzünden değil veri yüzünden tıkanır, o yüzden bu adım pilotdan önce gelir. Veri yetersizse INDOLES önce toplama düzenini kurmayı önerir; eksik veriyle pilot başlatmaz.",
        en: "The data readiness check answers exactly this: the volume, quality and accessibility of existing records are examined. Most AI projects stall on data rather than models, which is why this step comes before any pilot. If data is insufficient, INDOLES proposes building the collection routine first and does not start a pilot on incomplete data.",
      },
    },
    {
      question: {
        tr: "Kendi modelimizi mi eğitiyorsunuz?",
        en: "Do you train a custom model for us?",
      },
      answer: {
        tr: "Çoğu iş için sıfırdan model eğitmek gereksiz ve pahalıdır; hazır servisler veya kural tabanlı otomasyon aynı sonucu çok daha ucuza verir. INDOLES yöntem seçiminde en ucuz çalışan yolu tercih eder ve gerekçesini yazar. Sıfırdan model eğitimi ve akademik araştırma bu hizmetin kapsamı dışındadır.",
        en: "For most tasks, training a model from scratch is unnecessary and expensive; off-the-shelf services or rule-based automation give the same result far more cheaply. In method selection INDOLES picks the cheapest thing that works and writes down why. Training models from scratch and academic research sit outside this service.",
      },
    },
    {
      question: {
        tr: "Pilot işe yaramazsa ne olur?",
        en: "What if the pilot does not work?",
      },
      answer: {
        tr: "Pilot getirisini gösteremezse durdurulur ve neden gösteremediği yazılı olarak kayda geçer. Bu bir başarısızlık değil, ucuza alınmış bir karardır: aynı fikir pilot yapılmadan yaygınlaştırılsaydı maliyeti kat kat büyük olurdu. INDOLES pilot aşamasını tam da bu riski küçültmek için kurgular ve sonucu olduğu gibi raporlar.",
        en: "If a pilot cannot show its return, it is stopped and the reason is put in writing. That is not a failure but a cheaply bought decision: rolling the same idea out without a pilot would have cost many times more. INDOLES structures the pilot stage precisely to shrink that risk, and reports the outcome as it is.",
      },
    },
    {
      question: {
        tr: "Verilerimiz dışarı çıkar mı?",
        en: "Does our data leave our systems?",
      },
      answer: {
        tr: "Veri işleme yöntemi seçilirken hangi verinin nereye gittiği baştan konuşulur ve yazılı hâle gelir. Hassas veri söz konusuysa kendi altyapınızda çalışan çözümler değerlendirilir; hazır servis kullanılacaksa hangi bilginin gönderildiği açıkça belirtilir. KVKK uyumu yöntem seçiminin bir girdisidir, sonradan eklenen bir kontrol değil.",
        en: "When choosing the processing method, which data goes where is discussed up front and written down. Where sensitive data is involved, solutions running on your own infrastructure are evaluated; if a third-party service is used, exactly what gets sent is stated explicitly. Data protection compliance is an input to method selection, not a check added afterwards.",
      },
    },
  ],

  seo: {
    title: {
      tr: "AI danışmanlığı ve pilot uygulama",
      en: "AI advisory and pilot builds",
    },
    description: {
      tr: "Yapay zekânın nerede kazandırdığını ölçen AI danışmanlığı. Aday iş listesi, fayda-maliyet hesabı ve gerçek veriyle pilot uygulama.",
      en: "AI advisory that measures where artificial intelligence actually pays off. Candidate tasks, cost-benefit analysis and a pilot on real data.",
    },
    entities: {
      tr: [
        "INDOLES",
        "AI danışmanlığı",
        "yapay zekâ",
        "pilot",
        "veri hazırlığı",
      ],
      en: [
        "INDOLES",
        "AI advisory",
        "artificial intelligence",
        "pilot",
        "data readiness",
      ],
    },
  },

  relatedPackages: ["ai-pilot"],
  relatedServices: ["is-otomasyonlari", "is-zekasi", "dijital-donusum"],
};
