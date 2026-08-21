import type { ServiceContent } from "../types";

/**
 * Teknoloji ve altyapı danışmanlığı — Build.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı. Kart metnindeki
 * "lock-in riski" vurgusu sayfanın omurgası: bu hizmetin ayrıştırıcı iddiası,
 * bağımlılığın sözleşmeden önce konuşulması.
 */
export const teknolojiVeAltyapi: ServiceContent = {
  slug: { tr: "teknoloji-ve-altyapi", en: "technology-infrastructure" },
  pillar: "build",
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

  lede: {
    tr: "Teknoloji ve altyapı danışmanlığı, sistemlerin nerede çalışacağına ve bunun yıllık kaça mal olacağına karar vermektir. INDOLES seçimi bugünkü fiyata göre değil, üç yıl sonra çıkmak istediğinizde ödeyeceğiniz bedele göre yapar.",
    en: "Technology and infrastructure advisory is deciding where systems will run and what that costs per year. INDOLES makes the choice not on today's price but on what you would pay to leave in three years.",
  },

  signals: {
    tr: [
      "Sunucu ve servis faturaları artıyor, hangi kalemin ne olduğu bilinmiyor.",
      "Sistem yoğun günlerde yavaşlıyor veya duruyor.",
      "Her şey tek bir sağlayıcıya bağlı ve çıkmanın maliyeti hesaplanmamış.",
    ],
    en: [
      "Server and service bills keep rising and nobody knows what each line is.",
      "The system slows down or stops on busy days.",
      "Everything sits with one provider and the cost of leaving was never calculated.",
    ],
  },

  platforms: ["Vercel", "SAP"],

  scope: {
    includes: [
      {
        title: { tr: "Mevcut altyapı envanteri", en: "Infrastructure inventory" },
        description: {
          tr: "Hangi sistem nerede çalışıyor, kim yönetiyor ve aylık ne kadar tutuyor — dağınık faturalar tek tabloda toplanır.",
          en: "Which system runs where, who manages it and what it costs monthly — scattered bills gathered into one table.",
        },
      },
      {
        title: { tr: "Maliyet analizi", en: "Cost analysis" },
        description: {
          tr: "Gereksiz kaynak, kullanılmayan servis ve yanlış boyutlandırma tespit edilir; çoğu kurulumda hemen düşürülecek kalem çıkar.",
          en: "Idle resources, unused services and wrong sizing are identified; most setups have costs that can drop immediately.",
        },
      },
      {
        title: { tr: "Kapasite ve dayanıklılık kontrolü", en: "Capacity and resilience check" },
        description: {
          tr: "Sistem yoğun günde ne kadar yükü kaldırır, bir parça çöktüğünde ne olur? Sınırlar tahminle değil testle bulunur.",
          en: "How much load the system holds on a busy day and what happens when a part fails — limits found by testing, not assumption.",
        },
      },
      {
        title: { tr: "Bulut, şirket içi veya karma kararı", en: "Cloud, on-premise or hybrid decision" },
        description: {
          tr: "Veri nerede durmalı, hangi mevzuat geçerli, hangi seçenek üç yılda ne kadar tutar — üçü birlikte değerlendirilir.",
          en: "Where data should sit, which regulations apply and what each option costs over three years — weighed together.",
        },
      },
      {
        title: { tr: "Bağımlılık riski hesabı", en: "Lock-in risk assessment" },
        description: {
          tr: "Sağlayıcıdan çıkmak isterseniz ne kadar sürer ve kaça mal olur? Bu soru sözleşmeden önce cevaplanır.",
          en: "If you wanted to leave the provider, how long would it take and what would it cost? Answered before signing.",
        },
      },
      {
        title: { tr: "Yedekleme ve kurtarma planı", en: "Backup and recovery plan" },
        description: {
          tr: "Yedekler alınıyor mu, geri yüklendiği test edildi mi? Denenmemiş yedek, yedek sayılmaz.",
          en: "Are backups running, and has restoring one been tested? An untested backup is not a backup.",
        },
      },
      {
        title: { tr: "Güvenlik temel denetimi", en: "Baseline security review" },
        description: {
          tr: "Erişim yetkileri, açık portlar ve güncelleme durumu gözden geçirilir; temel açıklar önceliklendirilerek listelenir.",
          en: "Access permissions, open ports and patch status are reviewed, with baseline gaps listed by priority.",
        },
      },
    ],
    excludes: {
      tr: [
        "7/24 yönetilen hizmet ve sistem yöneticiliği operasyonu",
        "Sunucu, ağ ekipmanı ve donanım tedariki",
        "Bulut sağlayıcı lisans ve kullanım bedelleri",
        "Sızma testi ve derinlemesine güvenlik sertifikasyonu",
      ],
      en: [
        "24/7 managed services and system administration",
        "Server, network equipment and hardware procurement",
        "Cloud provider licence and usage fees",
        "Penetration testing and in-depth security certification",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Envanter", en: "Inventory" },
      description: {
        tr: "Çalışan tüm sistemler, sağlayıcılar ve faturalar çıkarılır. Çoğu şirkette bu liste ilk kez tek yerde görülür.",
        en: "Every running system, provider and invoice is listed. In most companies this is the first time it appears in one place.",
      },
      output: {
        tr: "Altyapı envanteri ve aylık maliyet dökümü.",
        en: "An infrastructure inventory and a monthly cost breakdown.",
      },
    },
    {
      step: "02",
      title: { tr: "Ölçüm ve test", en: "Measurement and testing" },
      description: {
        tr: "Yük testi yapılır, kaynak kullanımı ölçülür ve yedekten geri dönüş denenir. Varsayımlar burada doğrulanır veya çürür.",
        en: "Load tests are run, resource usage is measured and a restore from backup is attempted. Assumptions get confirmed or broken here.",
      },
      output: {
        tr: "Kapasite raporu ve yedekten geri dönüş test sonucu.",
        en: "A capacity report and the result of the restore test.",
      },
    },
    {
      step: "03",
      title: { tr: "Seçenek karşılaştırması", en: "Comparing the options" },
      description: {
        tr: "Bulut, şirket içi ve karma seçenekler üç yıllık maliyet, mevzuat ve çıkış maliyetiyle karşılaştırılır.",
        en: "Cloud, on-premise and hybrid are compared on three-year cost, regulation and the cost of exit.",
      },
      output: {
        tr: "Karşılaştırma tablosu ve gerekçeli öneri.",
        en: "A comparison table and a recommendation with reasoning.",
      },
    },
    {
      step: "04",
      title: { tr: "Uygulama planı", en: "Implementation plan" },
      description: {
        tr: "Karar verilen yapıya geçiş adımlara bölünür; hangi adım ne zaman, kesinti riski nasıl yönetilecek yazılır.",
        en: "The move to the chosen setup is split into steps: which step when, and how downtime risk gets managed.",
      },
      output: {
        tr: "Geçiş planı ve kesinti riski değerlendirmesi.",
        en: "A migration plan and a downtime risk assessment.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Altyapı envanteri", en: "Infrastructure inventory" },
      description: {
        tr: "Çalışan sistemler, sağlayıcılar ve aylık maliyetleri tek tabloda.",
        en: "Running systems, providers and their monthly costs in one table.",
      },
    },
    {
      kind: "document",
      title: { tr: "Maliyet analizi", en: "Cost analysis" },
      description: {
        tr: "Gereksiz harcama kalemleri ve hemen düşürülebilecek maliyetler.",
        en: "Wasted line items and costs that can be cut immediately.",
      },
    },
    {
      kind: "document",
      title: { tr: "Kapasite raporu", en: "Capacity report" },
      description: {
        tr: "Yük testi sonuçları, sistemin sınırları ve zayıf halkaları.",
        en: "Load test results, the system's limits and its weak links.",
      },
    },
    {
      kind: "document",
      title: { tr: "Seçenek karşılaştırması", en: "Options comparison" },
      description: {
        tr: "Bulut, şirket içi ve karma; üç yıllık maliyet ve çıkış bedeliyle.",
        en: "Cloud, on-premise and hybrid, with three-year cost and exit cost.",
      },
    },
    {
      kind: "system",
      title: { tr: "Yedekleme düzeni", en: "Backup routine" },
      description: {
        tr: "Çalışan yedekleme ve geri dönüşü test edilmiş kurtarma yordamı.",
        en: "Working backups and a recovery procedure verified by restore test.",
      },
    },
    {
      kind: "document",
      title: { tr: "Geçiş planı", en: "Migration plan" },
      description: {
        tr: "Adım adım geçiş takvimi, sorumlular ve kesinti riski yönetimi.",
        en: "A step-by-step migration schedule, owners and downtime management.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Bulut mu, kendi sunucumuz mu daha ucuz?",
        en: "Is cloud or our own server cheaper?",
      },
      answer: {
        tr: "Cevap trafiğin ne kadar değişken olduğuna ve verinin nerede durması gerektiğine bağlıdır; tek bir doğru yoktur. Yükü dalgalanan sistemlerde bulut genellikle ucuza gelir, sabit ve öngörülebilir yükte kendi sunucunuz üç yılda daha az tutabilir. INDOLES iki seçeneği de üç yıllık toplam maliyetle hesaplar ve çıkış bedelini de tabloya koyar.",
        en: "The answer depends on how variable your traffic is and where the data has to sit; there is no single right choice. For fluctuating loads cloud usually works out cheaper, while for steady and predictable loads your own server can cost less over three years. INDOLES calculates both on three-year total cost and puts the exit cost in the table too.",
      },
    },
    {
      question: {
        tr: "Lock-in riski ne demek, neden önemli?",
        en: "What is lock-in risk and why does it matter?",
      },
      answer: {
        tr: "Bağımlılık riski, bir sağlayıcıdan ayrılmak istediğinizde ödeyeceğiniz bedeldir: veri taşıma, yeniden yazma ve kesinti süresi. Sözleşme imzalarken kimse bunu sormaz, ayrılmak gerektiğinde ise pazarlık gücü kalmaz. INDOLES bu hesabı karar aşamasında yapar ve öneriye çıkış maliyeti dahil edilmeden seçim kesinleşmez.",
        en: "Lock-in risk is what you would pay to leave a provider: migrating data, rewriting systems and downtime. Nobody asks about it when signing, and by the time leaving is necessary there is no negotiating power left. INDOLES calculates it at the decision stage, and no choice is finalised without exit cost included in the recommendation.",
      },
    },
    {
      question: {
        tr: "Sistemi durdurmadan geçiş yapabilir miyiz?",
        en: "Can we migrate without downtime?",
      },
      answer: {
        tr: "Çoğu geçiş kesintisiz veya çok kısa kesintiyle yapılabilir; yöntem sistemin yapısına göre seçilir ve geçiş planında yazılı hâle gelir. Kritik sistemlerde yeni ve eski kurulum bir süre paralel çalıştırılır, doğruluk teyit edildikten sonra eski kapatılır. Geri dönüş yolu her adımda açık tutulur, tek yönlü geçiş yapılmaz.",
        en: "Most migrations can be done with no downtime or a very short window; the method follows the system's structure and is written into the migration plan. For critical systems the new and old setups run in parallel for a period and the old one is retired only once accuracy is confirmed. A way back stays open at every step — no one-way moves.",
      },
    },
    {
      question: {
        tr: "Verilerimizin Türkiye'de kalması gerekiyor — bulut yine de olur mu?",
        en: "Our data has to stay in Turkey — is cloud still an option?",
      },
      answer: {
        tr: "Verinin Türkiye'de kalması gereği bulutu otomatik olarak elemez; büyük sağlayıcıların bir kısmı Türkiye'de veri merkezi işletiyor ve karma kurulumda hassas veri şirket içinde tutulup gerisi buluta taşınabilir. INDOLES önce hangi verinin hangi mevzuata tabi olduğunu çıkarır, seçenekleri buna göre daraltır. KVKK uyumu karşılaştırma tablosunun bir sütunudur — sonradan eklenen bir kontrol değil.",
        en: "A data-residency requirement does not automatically rule out cloud; several major providers operate data centres in Turkey, and a hybrid setup can keep sensitive data in-house while the rest moves out. INDOLES first maps which data falls under which regulation and narrows the options from there. Compliance is a column in the comparison table, not a check bolted on afterwards.",
      },
    },
    {
      question: {
        tr: "Yedeklerimiz var, yine de kontrol gerekir mi?",
        en: "We have backups — is a check still needed?",
      },
      answer: {
        tr: "Yedeğin varlığı yeterli değil, geri yüklenebilir olması gerekir ve bu ancak denenerek anlaşılır. Uygulamada sıkça karşılaşılan durum şudur: yedekler aylardır alınıyor ama hiç geri dönülmemiş, dönüldüğünde eksik veya bozuk çıkıyor. INDOLES bu hizmette gerçek bir geri yükleme testi yapar ve sonucu raporlar.",
        en: "Having a backup is not enough; it has to be restorable, and that is only known by trying. A common finding in practice is this: backups have been running for months but never restored, and when they are, they come back incomplete or corrupted. In this service INDOLES performs a real restore test and reports the result.",
      },
    },
  ],

  seo: {
    title: {
      tr: "Teknoloji ve altyapı danışmanlığı",
      en: "Technology and infrastructure advisory",
    },
    description: {
      tr: "Bulut, şirket içi veya karma kararını üç yıllık maliyet ve çıkış bedeliyle veren altyapı danışmanlığı. Yedekler test edilerek doğrulanır.",
      en: "Infrastructure advisory deciding cloud, on-premise or hybrid on three-year cost and exit cost. Backups verified by real restore tests.",
    },
    entities: {
      tr: [
        "INDOLES",
        "altyapı",
        "bulut",
        "yedekleme",
        "maliyet",
      ],
      en: [
        "INDOLES",
        "infrastructure",
        "cloud",
        "backup",
        "cost",
      ],
    },
  },

  relatedPackages: [],
  relatedServices: ["ozel-yazilim-ve-mobil", "dijital-donusum", "is-otomasyonlari"],
};
