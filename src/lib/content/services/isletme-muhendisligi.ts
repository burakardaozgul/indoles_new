import type { ServiceContent } from "../types";

/**
 * İşletme mühendisliği — Transform.
 *
 * EN adı `pillars.ts`te "Operations engineering" — birebir korundu.
 * `shortDescription` de aynı dosyadan kopyalandı.
 */
export const isletmeMuhendisligi: ServiceContent = {
  slug: { tr: "isletme-muhendisligi", en: "business-engineering" },
  pillar: "transform",
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

  lede: {
    tr: "İşletme mühendisliği, mevcut kapasiteden daha fazlasını çıkarma işidir. INDOLES yeni makine veya yeni personel önermeden önce işin nerede beklediğini ölçer — çoğu şirkette kayıp kapasitede değil, akıştadır.",
    en: "Operations engineering is the work of getting more out of the capacity you already have. Before proposing new machines or new hires, INDOLES measures where work waits — in most companies the loss is in the flow, not the capacity.",
  },

  signals: {
    tr: [
      "Kapasite yeterli görünüyor ama teslim süreleri sürekli uzuyor.",
      "Bir bölüm sürekli bekliyor, diğeri yetişemiyor.",
      "Yeni makine veya yeni personel konuşuluyor ama gerekli olup olmadığı belirsiz.",
    ],
    en: [
      "Capacity looks sufficient but lead times keep stretching.",
      "One department is always waiting while another cannot keep up.",
      "New machines or new hires are on the table with no clarity on whether they are needed.",
    ],
  },

  scope: {
    includes: [
      {
        title: { tr: "Süreç haritalama", en: "Process mapping" },
        description: {
          tr: "İşin ilk temastan teslimata kadar geçtiği her adım sahada izlenerek çizilir; yazılı prosedür değil gerçek akış esas alınır.",
          en: "Every step from first contact to delivery is drawn by observing on site — the real flow, not the written procedure.",
        },
      },
      {
        title: { tr: "Süre ölçümü", en: "Time measurement" },
        description: {
          tr: "Her adımın ne kadar sürdüğü ve arada ne kadar beklendiği ölçülür. Bekleme süresi çoğu zaman işlem süresinden uzundur.",
          en: "How long each step takes and how long work waits between them is measured. Waiting usually exceeds processing time.",
        },
      },
      {
        title: { tr: "Darboğaz analizi", en: "Bottleneck analysis" },
        description: {
          tr: "Akışı hangi adım sınırlıyor? Tüm hattın hızı o adımın hızıdır; iyileştirme başka yerde yapılırsa sonuç değişmez.",
          en: "Which step limits the flow? The whole line runs at that step's pace; improving elsewhere changes nothing.",
        },
      },
      {
        title: { tr: "Kapasite hesabı", en: "Capacity calculation" },
        description: {
          tr: "Mevcut kurulumla teorik ve gerçek kapasite arasındaki fark hesaplanır. Aradaki boşluk yatırımsız kazanç alanıdır.",
          en: "The gap between theoretical and actual capacity is calculated. That gap is the gain available without investment.",
        },
      },
      {
        title: { tr: "İyileştirme senaryoları", en: "Improvement scenarios" },
        description: {
          tr: "Her darboğaz için iki üç çözüm önerilir: maliyeti, uygulama süresi ve beklenen kazancıyla karşılaştırmalı.",
          en: "Two or three options per bottleneck, compared on cost, implementation time and expected gain.",
        },
      },
      {
        title: { tr: "Yerleşim ve iş akışı düzeni", en: "Layout and workflow design" },
        description: {
          tr: "Malzemenin ve bilginin gereksiz dolaşması azaltılır; adımlar birbirine yakınlaştırılır.",
          en: "Unnecessary movement of material and information is reduced and steps are brought closer together.",
        },
      },
      {
        title: { tr: "Takip göstergeleri", en: "Tracking metrics" },
        description: {
          tr: "İyileştirmenin kalıcı olup olmadığını gösteren birkaç sayı belirlenir ve ölçüm düzeni kurulur.",
          en: "A handful of numbers showing whether the improvement holds are defined, with a measurement routine set up.",
        },
      },
    ],
    excludes: {
      tr: [
        "Fabrika yerleşimi projelendirmesi ve inşaat işleri",
        "İş sağlığı ve güvenliği danışmanlığı",
        "Kalite belgelendirme denetimi ve sertifikasyon süreçleri",
        "Makine ve ekipman tedariki",
      ],
      en: [
        "Factory layout engineering and construction work",
        "Occupational health and safety consulting",
        "Quality certification audits and certification processes",
        "Machinery and equipment procurement",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Sahada izleme", en: "On-site observation" },
      description: {
        tr: "Süreç yerinde izlenir ve adım adım çizilir. Sahada görülen akış, prosedür dokümanındakinden düzenli olarak farklı çıkar.",
        en: "The process is observed in place and drawn step by step. What happens on the floor regularly differs from the procedure document.",
      },
      output: {
        tr: "Gerçek akış diyagramı ve adım listesi.",
        en: "A diagram of the real flow and the step list.",
      },
    },
    {
      step: "02",
      title: { tr: "Ölçüm", en: "Measurement" },
      description: {
        tr: "Her adımın işlem ve bekleme süresi ölçülür. Sayı olmadan hangi adımın sorun olduğu tartışma konusu olmaktan çıkmaz.",
        en: "Processing and waiting time are measured for each step. Without numbers, which step is the problem stays a matter of opinion.",
      },
      output: {
        tr: "Adım bazlı süre ölçümü ve bekleme haritası.",
        en: "Step-level timing data and a waiting map.",
      },
    },
    {
      step: "03",
      title: { tr: "Senaryo çalışması", en: "Scenario work" },
      description: {
        tr: "Darboğaz için çözümler maliyet ve kazanç karşılaştırmasıyla sunulur. Yatırımsız seçenekler her zaman önce değerlendirilir.",
        en: "Solutions for the bottleneck are presented with a cost-and-gain comparison. Zero-investment options are always considered first.",
      },
      output: {
        tr: "İyileştirme senaryoları ve karşılaştırma tablosu.",
        en: "Improvement scenarios with a comparison table.",
      },
    },
    {
      step: "04",
      title: { tr: "Uygulama ve doğrulama", en: "Implementation and verification" },
      description: {
        tr: "Seçilen senaryo uygulanır ve süreler yeniden ölçülür. İyileşme sayıyla gösterilmeden iş tamamlanmış sayılmaz.",
        en: "The chosen scenario is implemented and times are measured again. The work is not done until the improvement is shown in numbers.",
      },
      output: {
        tr: "Öncesi-sonrası ölçüm karşılaştırması ve takip düzeni.",
        en: "A before-and-after measurement comparison and a tracking routine.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Süreç akış diyagramı", en: "Process flow diagram" },
      description: {
        tr: "İşin gerçek akışı; her adım, karar noktası ve bekleme yeriyle.",
        en: "The real flow of work, with every step, decision point and wait.",
      },
    },
    {
      kind: "document",
      title: { tr: "Süre ölçüm raporu", en: "Timing report" },
      description: {
        tr: "Adım başına işlem ve bekleme süresi; toplam çevrim süresi dökümü.",
        en: "Processing and waiting time per step, with total cycle time broken out.",
      },
    },
    {
      kind: "document",
      title: { tr: "Darboğaz analizi", en: "Bottleneck analysis" },
      description: {
        tr: "Akışı sınırlayan adım, sebebi ve kaybettirdiği kapasite hesabı.",
        en: "The limiting step, its cause and the capacity it costs.",
      },
    },
    {
      kind: "document",
      title: { tr: "İyileştirme senaryoları", en: "Improvement scenarios" },
      description: {
        tr: "Her darboğaz için seçenekler; maliyet, süre ve kazanç karşılaştırmalı.",
        en: "Options per bottleneck, compared on cost, time and gain.",
      },
    },
    {
      kind: "system",
      title: { tr: "Takip göstergeleri", en: "Tracking metrics" },
      description: {
        tr: "İyileşmenin kalıcılığını gösteren ölçüm düzeni, çalışır hâlde.",
        en: "A measurement routine showing whether the gain holds, up and running.",
      },
    },
    {
      kind: "training",
      title: { tr: "Ekip oturumu", en: "Team session" },
      description: {
        tr: "Saha ve planlama ekibine akış okuma ve ölçüm sürdürme aktarımı.",
        en: "Floor and planning teams learn to read the flow and keep measuring.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Bu iş yalın üretim danışmanlığı mı?",
        en: "Is this lean manufacturing consulting?",
      },
      answer: {
        tr: "İşletme mühendisliği yalın üretimle aynı ölçüm mantığını paylaşır ama tek bir metodolojiye bağlı kalmaz. INDOLES sahada ne ölçülüyorsa ona göre yöntem seçer; bazı durumlarda akış düzenlemesi, bazılarında planlama değişikliği veya bilgi akışının düzeltilmesi yeterli olur. Amaç bir metodolojiyi uygulamak değil, teslim süresini kısaltmaktır.",
        en: "Operations engineering shares the measurement logic of lean manufacturing but is not tied to a single methodology. INDOLES picks the method from what the floor data shows; sometimes flow rearrangement is enough, sometimes a planning change or fixing the information flow. The aim is shorter lead times, not applying a methodology.",
      },
    },
    {
      question: {
        tr: "Yeni makine almadan verim artırmak mümkün mü?",
        en: "Can efficiency rise without buying new machines?",
      },
      answer: {
        tr: "Çoğu şirkette teorik kapasite ile gerçekleşen kapasite arasında belirgin bir fark bulunur ve bu fark yatırımsız kazanç alanıdır. Kayıp genellikle makinenin hızında değil bekleme, kurulum ve yeniden işleme sürelerindedir. INDOLES ölçümü tam da bunun için yapar: yatırım gerçekten gerekiyorsa gerekçesi sayıyla gösterilir, gerekmiyorsa boşuna harcanmaz.",
        en: "In most companies there is a clear gap between theoretical and realised capacity, and that gap is gain available without investment. The loss usually sits in waiting, setup and rework rather than machine speed. INDOLES measures precisely for this: if investment is genuinely needed the case is shown in numbers, and if it is not, the money is not spent.",
      },
    },
    {
      question: {
        tr: "Üretim yapmıyoruz, e-ticaret şirketiyiz. Uygun mu?",
        en: "We are e-commerce, not manufacturing. Does this apply?",
      },
      answer: {
        tr: "Aynı yöntem sipariş hazırlama, paketleme, iade ve müşteri iletişimi akışlarına da uygulanır. Depoda paketlemenin beklemesiyle üretim hattında bir istasyonun beklemesi arasında ölçüm açısından fark yoktur. INDOLES e-ticaret tarafında genellikle sipariş kabulünden kargoya kadar geçen süreyi haritalar ve büyümeden önce tıkanacak adımı işaretler.",
        en: "The same method applies to order preparation, packing, returns and customer communication flows. From a measurement standpoint, packing waiting in a warehouse is no different from a station waiting on a production line. On the e-commerce side INDOLES usually maps the time from order acceptance to dispatch and marks the step that will jam before growth arrives.",
      },
    },
    {
      question: {
        tr: "Sahada ne kadar kalıyorsunuz, işi aksatır mı?",
        en: "How long are you on site, and does it disrupt work?",
      },
      answer: {
        tr: "Saha gözlemi genellikle bir ila iki hafta sürer ve iş akışına karışmadan yapılır: INDOLES ekibi izler, ölçer, soru sorar ama sürece müdahale etmez. Toplam çalışma, senaryoların sunulmasına kadar dört ila altı haftayı bulur. Üretimi durduran tek an yoktur; ölçüm cihaz kurulumu gerektirirse vardiya arasında yapılır ve planı sizinle birlikte çizilir.",
        en: "On-site observation usually lasts one to two weeks and stays out of the way: the INDOLES team watches, measures and asks questions without stepping into the process. The full engagement runs four to six weeks up to the scenario presentation. Nothing stops production at any point; if measurement requires installing anything, it happens between shifts on a plan drawn up with you.",
      },
    },
    {
      question: {
        tr: "Çalışmanın sonucu nasıl doğrulanıyor?",
        en: "How is the result verified?",
      },
      answer: {
        tr: "Doğrulama, uygulamadan önceki ve sonraki ölçümün karşılaştırılmasıyla yapılır; iyileşme aynı yöntemle ölçülüp sayıyla gösterilmeden çalışma tamamlanmış sayılmaz. INDOLES ayrıca birkaç takip göstergesi bırakır, böylece kazancın birkaç ay sonra da sürüp sürmediği görülür. Kalıcı olmayan bir iyileştirme, hiç yapılmamış iyileştirmeyle aynı yere çıkar.",
        en: "Verification comes from comparing before-and-after measurements; the work is not complete until the improvement shows in numbers. INDOLES also leaves a few tracking metrics so you can see whether the gain still holds months later. An improvement that does not last amounts to the same thing as none at all.",
      },
    },
  ],

  seo: {
    title: {
      tr: "İşletme mühendisliği ve süreç analizi",
      en: "Operations engineering and process analysis",
    },
    description: {
      tr: "Mevcut kapasiteden fazlasını çıkaran işletme mühendisliği. Süreç haritalanır, darboğaz ölçülür, yatırımsız kazanç önce değerlendirilir.",
      en: "Operations engineering that gets more from existing capacity. Processes mapped, bottlenecks measured, zero-investment gains considered first.",
    },
    entities: {
      tr: [
        "INDOLES",
        "işletme mühendisliği",
        "darboğaz",
        "süreç haritalama",
        "kapasite",
      ],
      en: [
        "INDOLES",
        "operations engineering",
        "bottleneck",
        "process mapping",
        "capacity",
      ],
    },
  },

  relatedPackages: [],
  relatedServices: ["dijital-donusum", "is-zekasi", "is-otomasyonlari"],
};
