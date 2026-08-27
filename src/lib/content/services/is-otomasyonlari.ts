import type { ServiceContent } from "../types";

/**
 * İş otomasyonları — Transform.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const isOtomasyonlari: ServiceContent = {
  slug: { tr: "is-otomasyonlari", en: "business-automation" },
  pillar: "transform",
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

  lede: {
    tr: "İş otomasyonu, her gün elle yapılan tekrarlı işleri sistemin kendisinin yapmasıdır. INDOLES yeni bir yazılım satmak yerine mevcut araçlarınızı birbirine bağlar; kopyala-yapıştır işi ortadan kalkar.",
    en: "Business automation is the system doing the repetitive work someone does by hand every day. Instead of selling new software, INDOLES connects the tools you already have — and the copy-paste work disappears.",
  },

  signals: {
    tr: [
      "Bir kişinin günü rapor hazırlamak ve veri kopyalamakla geçiyor.",
      "Onaylar e-posta zincirinde kayboluyor, kimin sırada olduğu bilinmiyor.",
      "Sipariş arttıkça ekip büyütmekten başka çare kalmıyor.",
    ],
    en: [
      "Someone's whole day goes on preparing reports and copying data.",
      "Approvals get lost in email chains and no one knows whose turn it is.",
      "As orders grow, hiring more people is the only answer left.",
    ],
  },

  scope: {
    includes: [
      {
        title: { tr: "Tekrarlı iş envanteri", en: "Repetitive task inventory" },
        description: {
          tr: "Hangi işler her gün, her hafta tekrarlanıyor ve kaç saat yiyor? Otomasyon adayları ölçümle belirlenir.",
          en: "Which tasks repeat daily or weekly and how many hours do they eat? Automation candidates are chosen by measurement.",
        },
      },
      {
        title: { tr: "Akış tasarımı", en: "Flow design" },
        description: {
          tr: "İşin adımları, karar noktaları ve istisnaları çizilir. İstisnalar baştan tanımlanmazsa otomasyon ilk ay tıkanır.",
          en: "Steps, decision points and exceptions get drawn. Undefined exceptions jam an automation within its first month.",
        },
      },
      {
        title: { tr: "Sistemler arası bağlantı", en: "System-to-system links" },
        description: {
          tr: "Mevcut yazılımlar birbirine bağlanır; veri bir yere girilince diğerlerine kendiliğinden gider.",
          en: "Existing software gets connected so data entered once reaches everywhere else on its own.",
        },
      },
      {
        title: { tr: "Onay akışları", en: "Approval flows" },
        description: {
          tr: "Satın alma, izin veya fiyat onayı sıraya girer; kimin sırada olduğu ve ne kadar beklediği görünür olur.",
          en: "Purchase, leave or pricing approvals get queued, with whose turn it is and how long it has waited made visible.",
        },
      },
      {
        title: { tr: "Otomatik raporlama", en: "Automated reporting" },
        description: {
          tr: "Günlük ve haftalık raporlar kendiliğinden üretilip ilgili kişiye gider; elle hazırlama işi biter.",
          en: "Daily and weekly reports generate themselves and reach the right person; manual preparation ends.",
        },
      },
      {
        title: { tr: "Bildirim ve uyarılar", en: "Notifications and alerts" },
        description: {
          tr: "Stok azaldığında, sipariş geciktiğinde veya onay beklediğinde ilgili kişi haberdar edilir.",
          en: "When stock runs low, an order is late or an approval waits, the right person gets told.",
        },
      },
      {
        title: { tr: "Hata yönetimi", en: "Failure handling" },
        description: {
          tr: "Otomasyon takıldığında ne olacağı tanımlanır: kim haberdar edilir, iş nereye düşer, elle nasıl devam edilir.",
          en: "What happens when an automation stalls is defined: who is alerted, where the task lands, how to continue manually.",
        },
      },
    ],
    excludes: {
      tr: [
        "Fiziksel robot ve üretim hattı donanımı kurulumu",
        "Üçüncü taraf yazılım lisans bedelleri ve abonelikleri",
        "Otomasyonu günlük işletecek sürekli personel",
        "Mevcut sistemlerin sıfırdan yeniden yazılması — özel yazılım hizmetinde",
      ],
      en: [
        "Physical robots and production line hardware installation",
        "Third-party software licence fees and subscriptions",
        "Permanent staff to run the automation day to day",
        "Rewriting existing systems from scratch — covered by custom software",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "İş envanteri", en: "Task inventory" },
      description: {
        tr: "Ekiplerin tekrarlı işleri listelenir ve her birinin harcadığı süre ölçülür. Otomasyon adayları buradan çıkar.",
        en: "The team's repetitive tasks are listed and the time each consumes is measured. Automation candidates come from here.",
      },
      output: {
        tr: "Tekrarlı iş listesi ve haftalık saat kaybı ölçümü.",
        en: "A list of repetitive tasks with weekly hours lost.",
      },
    },
    {
      step: "02",
      title: { tr: "Akış çizimi", en: "Drawing the flow" },
      description: {
        tr: "Seçilen işin adımları, kararları ve istisnaları çizilir. İş sahibiyle birlikte doğrulanmadan kodlamaya geçilmez.",
        en: "Steps, decisions and exceptions of the chosen task get drawn. No build starts before the task owner confirms them.",
      },
      output: {
        tr: "Onaylanmış akış şeması ve istisna listesi.",
        en: "An approved flow diagram and exception list.",
      },
    },
    {
      step: "03",
      title: { tr: "Kurulum ve pilot", en: "Build and pilot" },
      description: {
        tr: "Akış kurulur ve bir süre elle yapılan işle paralel çalışır. İki sonuç karşılaştırılarak doğruluk teyit edilir.",
        en: "The flow is built and runs in parallel with the manual work for a period, with both results compared to confirm accuracy.",
      },
      output: {
        tr: "Çalışan otomasyon ve paralel dönem karşılaştırma raporu.",
        en: "A working automation and a parallel-period comparison report.",
      },
    },
    {
      step: "04",
      title: { tr: "Devir", en: "Handover" },
      description: {
        tr: "İç ekibe akışın nasıl izleneceği, hata durumunda ne yapılacağı ve nasıl değiştirileceği öğretilir.",
        en: "The in-house team learns how to monitor the flow, what to do when it fails and how to change it.",
      },
      output: {
        tr: "İşletme kılavuzu ve eğitilmiş iç ekip.",
        en: "An operating guide and a trained in-house team.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "İş envanteri", en: "Task inventory" },
      description: {
        tr: "Tekrarlı işler ve her birinin haftalık saat maliyeti, ölçümle.",
        en: "Repetitive tasks with the weekly hours each costs, measured.",
      },
    },
    {
      kind: "document",
      title: { tr: "Akış şemaları", en: "Flow diagrams" },
      description: {
        tr: "Otomatikleştirilen her işin adımları, kararları ve istisnaları.",
        en: "Steps, decisions and exceptions for each automated task.",
      },
    },
    {
      kind: "system",
      title: { tr: "Çalışan otomasyonlar", en: "Working automations" },
      description: {
        tr: "Canlıda çalışan akışlar; paralel dönemde doğruluğu teyit edilmiş.",
        en: "Flows live in production, accuracy confirmed in the parallel period.",
      },
    },
    {
      kind: "system",
      title: { tr: "Bildirim düzeni", en: "Notification setup" },
      description: {
        tr: "Uyarı ve hata bildirimleri; kimin neyi ne zaman öğreneceği tanımlı.",
        en: "Alerts and failure notices, with who learns what and when defined.",
      },
    },
    {
      kind: "document",
      title: { tr: "İşletme kılavuzu", en: "Operating guide" },
      description: {
        tr: "Akışın izlenmesi, hata durumunda müdahale ve değişiklik yordamı.",
        en: "How to monitor the flow, intervene on failure and make changes.",
      },
    },
    {
      kind: "training",
      title: { tr: "Ekip eğitimi", en: "Team training" },
      description: {
        tr: "İç ekibe otomasyonu izleme ve basit değişiklikleri yapma eğitimi.",
        en: "The in-house team learns to monitor and make simple changes.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Otomasyon için yeni yazılım almamız gerekir mi?",
        en: "Do we need to buy new software to automate?",
      },
      answer: {
        tr: "Çoğu durumda yeni yazılım gerekmez; iş otomasyonu mevcut araçlarınızı birbirine bağlayarak kurulur. INDOLES önce elinizdekiyle ne kadar yol alınabileceğine bakar, ancak gerçekten gerekiyorsa yeni bir araç önerir; gerekçesi ve aylık maliyeti teklifte açıkça yazar. Amaç yazılım sayısını artırmak değil, elle yapılan tekrarlı işi azaltmaktır.",
        en: "In most cases no new software is needed; business automation is built by connecting the tools you already have. INDOLES first looks at how far your existing stack can go, and proposes a new tool only if genuinely required — with the reasoning and cost in writing. The aim is less manual work, not more software.",
      },
    },
    {
      question: {
        tr: "Otomasyon yanlış çalışırsa ne olur?",
        en: "What happens if the automation goes wrong?",
      },
      answer: {
        tr: "Hata yönetimi akış tasarımının parçasıdır: otomasyon takıldığında iş kaybolmaz, tanımlı bir kişiye düşer ve bildirim gider. Ayrıca her otomasyon canlıya alınmadan önce elle yapılan işle paralel çalıştırılır, iki sonuç karşılaştırılır. Doğruluk teyit edilmeden eski yöntem kapatılmaz — geri dönüş yolu her zaman açık kalır.",
        en: "Failure handling is part of the flow design: when an automation stalls the task is not lost but lands with a defined person and a notification goes out. Every automation also runs in parallel with the manual process before going live, with both results compared. The old method is never switched off before accuracy is confirmed — the way back stays open.",
      },
    },
    {
      question: {
        tr: "İlk otomasyon ne kadar sürede devreye girer?",
        en: "How soon does the first automation go live?",
      },
      answer: {
        tr: "İlk akış genellikle iki ila dört haftada canlıya alınır: bir hafta envanter ve akış çizimi, bir iki hafta kurulum, ardından elle yapılan işle paralel doğrulama dönemi. Süreyi belirleyen en büyük etken bağlanacak sistemlerin entegrasyona ne kadar açık olduğudur. INDOLES bu yüzden ilk otomasyonu bilerek küçük seçer — erken kazanım, düzenin geri kalanına güven kazandırır.",
        en: "The first flow usually goes live in two to four weeks: a week for the inventory and flow drawing, one or two for the build, then a parallel verification period alongside the manual work. The biggest factor in the timeline is how open the connected systems are to integration. INDOLES deliberately picks a small first automation — an early win builds confidence for the rest of the routine.",
      },
    },
    {
      question: {
        tr: "Çalışanlarımızın işini mi elinden alacak?",
        en: "Will it take our employees' jobs?",
      },
      answer: {
        tr: "Otomasyon genellikle işin en sevilmeyen kısmını alır: veri kopyalama, rapor hazırlama, onay kovalama. INDOLES envanter aşamasında hangi işin ne kadar zaman yediğini ölçer ve kazanılan zamanın nereye aktarılacağı yönetimle konuşulur. Uygulamada bu zaman çoğunlukla müşteriyle ilgilenmeye ve kontrol işlerine kayar.",
        en: "Automation usually takes the least-liked part of the job: copying data, preparing reports, chasing approvals. During the inventory INDOLES measures how much time each task consumes, and where the freed time goes is discussed with management. In practice that time mostly shifts towards customer work and oversight.",
      },
    },
    {
      question: {
        tr: "Kurduğunuz akışları sonra biz değiştirebilir miyiz?",
        en: "Can we change the flows yourselves afterwards?",
      },
      answer: {
        tr: "Akışlar iç ekibin kendi değiştirebileceği araçlarla kurulur ve devir oturumunda nasıl düzenleneceği adım adım öğretilir. İşletme kılavuzu her akışın nerede durduğunu, hangi sistemlere bağlandığını ve neyin nasıl değiştirileceğini yazılı olarak içerir. Basit bir değişiklik için INDOLES'e dönmek gerekmez; amaç bağımlılık değil, çalışır bir düzen bırakmaktır.",
        en: "Flows are built with tools the in-house team can edit, and the handover session covers how to change them. The operating guide documents where each flow lives and how to modify it. Coming back to INDOLES for a simple change is not necessary — the aim is a working routine, not dependency.",
      },
    },
    {
      question: {
        tr: "İş süreçleri otomasyonu nedir, bir iş nasıl aday oluyor?",
        en: "What is business process automation, and how does a task qualify?",
      },
      answer: {
        tr: "İş süreçleri otomasyonu, her gün elle yapılan tekrarlı işleri sistemin kendisinin yapmasıdır. Bir iş aday olabilmek için tekrarlı olmalı, adımları ve karar noktaları tanımlanabilmeli ve ölçülebilir bir saat kaybı yaratmalı. Envanter aşamasında her tekrarlı işin haftalık saat maliyeti ölçülür; sıralama tahminle değil bu ölçümle yapılır.",
        en: "Automating a business process means handing the repetitive work people do by hand every day over to the system. To qualify, a task has to repeat, have definable steps and decision points, and cost a measurable number of hours. During the inventory, the weekly hour cost of each repetitive task is measured, and the ranking follows that measurement rather than a guess.",
      },
    },
    {
      question: {
        tr: "Onay akışları nasıl kuruluyor?",
        en: "How are approval flows set up?",
      },
      answer: {
        tr: "Satın alma, izin veya fiyat onayı tanımlı bir sıraya bağlanır; kimin sırada olduğu ve ne kadar beklediği herkese görünür olur. Akış çizilirken karar noktalarının yanı sıra istisnalar da baştan tanımlanır, çünkü istisnası yazılmamış bir onay akışı ilk ay tıkanır. Onay geciktiğinde ilgili kişiye bildirim gider, iş e-posta zincirinde kaybolmaz.",
        en: "Purchase, leave or pricing approvals are tied to a defined queue, and whose turn it is and how long it has waited become visible to everyone. When the flow is drawn, exceptions are defined alongside the decision points, because an approval flow with no written exceptions jams in its first month. If an approval stalls, a notification goes out and the request does not disappear into an email chain.",
      },
    },
    {
      question: {
        tr: "Yapay zeka otomasyonu ile bu hizmet aynı şey mi?",
        en: "Is this the same as AI automation?",
      },
      answer: {
        tr: "Aynı şey değil. Bu hizmet kuralları belli, adımları tanımlanabilen işleri otomatikleştirir; sonuç her seferinde aynı ve öngörülebilir olur. İş tahmin, sınıflandırma ya da metin yorumu gerektiriyorsa devreye yapay zeka danışmanlığı girer ve orada önce veri hazırlığı ile fayda-maliyet hesabı yapılır. Kural tabanlı bir akış aynı sonucu veriyorsa ucuz olan seçilir.",
        en: "No. This service automates work with clear rules and definable steps, so the outcome is the same and predictable every time. If the task needs prediction, classification or interpreting text, AI advisory takes over, and there the data readiness check and cost-benefit calculation come first. Where a rule-based flow produces the same result, the cheaper option wins.",
      },
    },
    {
      question: {
        tr: "Bizim ekibimizden kim, ne kadar zaman ayırır?",
        en: "Who from our team is involved, and for how long?",
      },
      answer: {
        tr: "İşi bugün elle yapan kişi ve o işin sahibi gerekir; akış şeması iş sahibiyle doğrulanmadan kodlamaya geçilmez. Paralel dönemde aynı iş bir süre hem elle hem otomatik yürür, bu da ekipten kısa süreli ek bir kontrol eforu ister. Devir oturumunda akışı izleyecek ve basit değişiklikleri yapacak kişiler eğitilir.",
        en: "You need the person who does the task by hand today and the owner of that task; no code is written before the flow diagram is confirmed with the owner. During the parallel period the same work runs both manually and automatically for a while, which asks a short stretch of extra checking from the team. At the handover session, the people who will monitor the flow and make simple changes are trained.",
      },
    },
    {
      question: {
        tr: "Otomasyonun işe yaradığını nasıl ölçeriz?",
        en: "How do we know the automation worked?",
      },
      answer: {
        tr: "Ölçü baştan konur: envanterde o işin haftalık kaç saat yediği yazılır, kurulumdan sonra aynı sayı yeniden ölçülür. Paralel dönem karşılaştırma raporu ayrıca doğruluğu gösterir — elle çıkan sonuçla otomatik çıkan sonuç yan yana konur. İki sayı da yazılı kaldığı için otomasyonun getirisi tartışmaya değil kayda dayanır.",
        en: "The measure is set up front: the inventory records how many hours a week the task consumes, and the same number is measured again after the build. The parallel-period comparison report also shows accuracy, placing the manual result next to the automated one. Both numbers stay on record, so the return is settled by evidence rather than argument.",
      },
    },
    {
      question: {
        tr: "Hangi durumda iş otomasyonu yanlış tercih olur?",
        en: "When is business automation the wrong choice?",
      },
      answer: {
        tr: "İşin nasıl yürüdüğü henüz tanımlı değilse otomasyon erken gelir; tanımsız bir süreç otomatikleştirilince yalnızca daha hızlı karışır. Mevcut sistemler baştan yazılmak zorundaysa iş özel yazılım hizmetine geçer, çünkü bu kapsam yeniden yazmayı içermez. Fiziksel robot ve üretim hattı donanımı da kapsam dışı kalır.",
        en: "If how the work runs is not yet defined, automation comes too early — an undefined process only gets confused faster once automated. If the existing systems have to be rewritten, the work moves to custom software, because this scope does not include rewriting. Physical robots and production line hardware also fall outside it.",
      },
    },
  ],

  seo: {
    title: {
      tr: "İş otomasyonu danışmanlığı",
      en: "Business process automation consulting",
    },
    description: {
      tr: "Elle yapılan tekrarlı işleri sistemin yapmasını sağlayan iş süreçleri otomasyonu. Onay akışları kurulur, mevcut araçlar bağlanır, düzen iç ekibe geçer.",
      en: "Business process automation that hands repetitive manual work to the system. Approval flows built, existing tools connected, the routine given to your team.",
    },
    entities: {
      tr: [
        "INDOLES",
        "iş otomasyonu",
        "onay akışları",
        "raporlama",
        "iç ekip",
      ],
      en: [
        "INDOLES",
        "business automation",
        "approval flow",
        "reporting",
        "in-house team",
      ],
    },
  },

  relatedPackages: [],
  relatedServices: ["dijital-donusum", "ai-danismanlik", "is-zekasi"],
};
