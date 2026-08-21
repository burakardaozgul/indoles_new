import type { ServiceContent } from "../types";

/**
 * Performans pazarlama — Growth.
 *
 * Ton: orta (docs/03 §2c), KOBİ alıcısına göre ayarlı (Burak, 2026-08-20):
 * kısa cümle, para ve satış diliyle somutluk, jargon en aza indirilmiş —
 * kalan teknik terim ilk geçtiği yerde günlük dille açıklanır.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı — onaylanmış kart
 * metni, yeniden yazılmadı.
 */
export const performansPazarlama: ServiceContent = {
  slug: { tr: "performans-pazarlama", en: "performance-marketing" },
  pillar: "growth",
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

  lede: {
    tr: "Performans pazarlama, reklam bütçesinin nereye gidip ne getirdiğini netleştiren düzendir. INDOLES her kanalı tek tek ölçer: kazandıran kanal büyür, kazandırmayan kapanır.",
    en: "Performance marketing is the discipline of knowing where every lira of ad spend goes and what it brings back. INDOLES measures each channel on its own: winners scale, losers get cut.",
  },

  signals: {
    tr: [
      "Reklam harcaması her ay artıyor, satışlar aynı yerde sayıyor.",
      "Raporlar tıklama ve gösterim dolu; kasada karşılığı görünmüyor.",
      "Hangi kanal kazandırıyor, hangisi bütçeyi eritiyor — kimse net söyleyemiyor.",
    ],
    en: [
      "Ad spend grows every month while sales stay where they are.",
      "Reports are full of clicks and impressions; the till shows nothing to match.",
      "Which channel earns and which one burns budget — nobody can say for sure.",
    ],
  },

  platforms: ["Google Ads", "Meta", "LinkedIn", "TikTok", "Google Analytics"],

  scope: {
    includes: [
      {
        title: {
          tr: "Reklam hesaplarının denetimi",
          en: "Ad account audit",
        },
        description: {
          tr: "Google, Meta ve LinkedIn hesaplarına girer; boşa giden harcamayı, çakışan kampanyaları ve yanlış hedeflemeyi tek tek çıkarırız.",
          en: "We go into the Google, Meta and LinkedIn accounts and list wasted spend, overlapping campaigns and mistargeted ads one by one.",
        },
      },
      {
        title: {
          tr: "Kanal karnesi",
          en: "Channel scorecard",
        },
        description: {
          tr: "Her kanal için aynı soruyu cevaplarız: bir müşteri kazanmak kaça mal oluyor, harcanan bütçe kaç lira satış getiriyor?",
          en: "For every channel we answer the same question: what does one customer cost, and how much revenue does the budget bring back?",
        },
      },
      {
        title: {
          tr: "Satışın izini süren ölçüm",
          en: "Tracking that follows the sale",
        },
        description: {
          tr: "Hangi satışın hangi reklamdan geldiğini gösteren dönüşüm takibini kurarız. Ölçüm doğru değilse hiçbir rapor doğru değildir.",
          en: "We set up conversion tracking that shows which sale came from which ad. If measurement is wrong, no report is right.",
        },
      },
      {
        title: {
          tr: "Doğru kitleye doğru mesaj",
          en: "Right message, right audience",
        },
        description: {
          tr: "Sizi hiç duymamış kitle, siteyi gezmiş kitle ve mevcut müşteri ayrı ayrı hedeflenir — üçüne aynı reklamı göstermek bütçe yakar.",
          en: "Cold audiences, site visitors and existing customers are targeted separately — showing all three the same ad burns budget.",
        },
      },
      {
        title: {
          tr: "Reklam testi düzeni",
          en: "Ad testing routine",
        },
        description: {
          tr: "Hangi görsel, hangi mesaj, hangi teklif? Her test için süre ve karar kuralı baştan yazılır; sonuçsuz test dönemi biter.",
          en: "Which visual, which message, which offer? Every test gets a duration and a decision rule up front; open-ended testing ends.",
        },
      },
      {
        title: {
          tr: "Bütçe planı ve tavanlar",
          en: "Budget plan and ceilings",
        },
        description: {
          tr: "Kanal başına aylık tavan, artırma ve durdurma kuralları. Bütçe içgüdüye göre değil, karneye göre dağılır.",
          en: "A monthly ceiling per channel with scale-up and stop rules. Budget follows the scorecard, not gut feeling.",
        },
      },
      {
        title: {
          tr: "Haftalık rapor ritmi",
          en: "Weekly reporting rhythm",
        },
        description: {
          tr: "Beş temel sayı, tek sayfa. Her hafta neye bakılacağı ve hangi eşikte karar verileceği bellidir — rapor okumak iş olmaktan çıkar.",
          en: "Five core numbers, one page. What to look at each week and at what threshold to act is fixed — reading reports stops being a job.",
        },
      },
    ],
    excludes: {
      tr: [
        "Reklam görseli ve video prodüksiyonu — üretim ayrı kapsamdır",
        "Google'da organik sıralama (SEO) çalışması",
        "Marka kimliği ve logo tasarımı — marka stratejisi hizmetinde",
        "Influencer anlaşmalarının yönetimi",
      ],
      en: [
        "Ad creative and video production — a separate scope",
        "Organic search (SEO) work",
        "Brand identity and logo design — covered by brand strategy",
        "Managing influencer deals",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Hesap denetimi", en: "Account audit" },
      description: {
        tr: "Mevcut reklam hesaplarına girer, neyin çalışıp neyin çalışmadığını sayılarla ortaya koyarız.",
        en: "We go into the existing ad accounts and show, in numbers, what works and what does not.",
      },
      output: {
        tr: "Boşa giden harcama listesi ve kanal başına mevcut durum raporu.",
        en: "A list of wasted spend and a current-state report per channel.",
      },
    },
    {
      step: "02",
      title: { tr: "Bütçe planı", en: "Budget plan" },
      description: {
        tr: "Hangi kanala ne kadar bütçe, hangi hedefle — 90 günlük plan yazılır. Dağılım tahmine değil, denetim bulgularına dayanır.",
        en: "How much budget to which channel, against which target — written as a 90-day plan grounded in the audit, not in guesswork.",
      },
      output: {
        tr: "Kanal başına hedef, bütçe tavanı ve 90 günlük takvim.",
        en: "A target, budget ceiling and 90-day calendar per channel.",
      },
    },
    {
      step: "03",
      title: { tr: "Test düzeni", en: "Testing routine" },
      description: {
        tr: "Reklamlar küçük bütçeyle yarıştırılır; kazananı sayılar seçer. Her testin süresi ve karar kuralı baştan yazılıdır.",
        en: "Ads compete on small budgets and the numbers pick the winner. Every test has its duration and decision rule written up front.",
      },
      output: {
        tr: "Test takvimi ve her testin karar kuralı.",
        en: "A testing calendar with a decision rule for every test.",
      },
    },
    {
      step: "04",
      title: { tr: "Büyütme ve devir", en: "Scale and handover" },
      description: {
        tr: "Kazandıran kanal kurallı şekilde büyütülür, kazandırmayan kapatılır. Düzen iç ekibe öğretilir ve devredilir.",
        en: "Winning channels scale under rules, losing ones close. The routine is taught to the in-house team and handed over.",
      },
      output: {
        tr: "Büyütme kuralları ve iç ekibe devredilmiş işleyiş.",
        en: "Scaling rules and a routine handed over to the in-house team.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Denetim raporu", en: "Audit report" },
      description: {
        tr: "Hesap yapısı, harcama dağılımı ve boşa giden bütçe — tespitlerle birlikte.",
        en: "Account structure, spend distribution and wasted budget, with findings.",
      },
    },
    {
      kind: "system",
      title: { tr: "Dönüşüm takibi", en: "Conversion tracking" },
      description: {
        tr: "Hangi satışın hangi reklamdan geldiğini gösteren ölçüm kurulumu.",
        en: "Measurement setup showing which sale came from which ad.",
      },
    },
    {
      kind: "document",
      title: { tr: "Kanal karnesi", en: "Channel scorecard" },
      description: {
        tr: "Kanal başına müşteri maliyeti, getiri ve bütçe tavanı — tek tabloda.",
        en: "Customer cost, return and budget ceiling per channel, in one table.",
      },
    },
    {
      kind: "document",
      title: { tr: "Test takvimi", en: "Testing calendar" },
      description: {
        tr: "Sıraya dizilmiş test listesi; her testin süresi ve karar kuralı.",
        en: "A prioritised list of tests, each with its duration and decision rule.",
      },
    },
    {
      kind: "system",
      title: { tr: "Haftalık panel", en: "Weekly dashboard" },
      description: {
        tr: "Beş temel sayıyı tek sayfada gösteren panel, yorumlama kılavuzuyla.",
        en: "A one-page dashboard of the five core numbers, with a reading guide.",
      },
    },
    {
      kind: "training",
      title: { tr: "Devir oturumu", en: "Handover session" },
      description: {
        tr: "İç ekibe panelin okunması ve karar kurallarının uygulanması öğretilir.",
        en: "The in-house team learns to read the dashboard and apply the rules.",
      },
    },
    {
      kind: "access",
      title: { tr: "Hesap sahipliği", en: "Account ownership" },
      description: {
        tr: "Reklam hesapları ve veriler baştan sona sizin adınıza kayıtlıdır.",
        en: "Ad accounts and data stay registered in your name, start to finish.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Ne kadar sürede sonuç görülür?",
        en: "How long before results show?",
      },
      answer: {
        tr: "Performans pazarlama çalışmasında ilk somut değişim üçüncü haftada görülür: boşa giden harcama kalemleri kapanır ve mevcut bütçe daha doğru yerlere akmaya başlar. Satış tarafındaki artış ise müşterinizin karar süresine bağlıdır; genellikle iki ila üç ay içinde netleşir. INDOLES bu süreyi kanal kanal ayrı söyler, tek bir genel söz vermez.",
        en: "In a performance marketing engagement the first tangible change shows in week three: wasted spend gets shut off and the existing budget starts flowing to better places. Growth on the sales side depends on how long your customers take to decide; it usually becomes clear within two to three months. INDOLES states this channel by channel instead of making one blanket promise.",
      },
    },
    {
      question: {
        tr: "Reklam bütçesi hizmet bedeline dahil mi?",
        en: "Is ad spend included in the fee?",
      },
      answer: {
        tr: "Reklam bütçesi hizmet bedelinden ayrıdır ve doğrudan Google ile Meta gibi platformlara, sizin kartınızdan ödenir. INDOLES yalnızca kurgu, yönetim ve raporlama için ücret alır. Böylece paranın nereye gittiğini her an kendi hesabınızdan görürsünüz; ajansa toplu para gönderip karşılığını sormak zorunda kalmazsınız.",
        en: "Ad spend sits outside the service fee and is paid straight to platforms like Google and Meta from your own card. INDOLES charges only for strategy, management and reporting. That way you can see where the money goes in your own account at any time, instead of wiring a lump sum to an agency and having to ask what it bought.",
      },
    },
    {
      question: {
        tr: "Mevcut ajansımızla birlikte çalışabilir misiniz?",
        en: "Can you work alongside our current agency?",
      },
      answer: {
        tr: "Mevcut ajansla birlikte çalışmak mümkündür ve sık kurulan bir düzendir. Böyle bir kurguda INDOLES ölçümü, bütçe kararlarını ve karneyi üstlenir; günlük kampanya operasyonu ajansta kalabilir. Tek şart rollerin baştan yazılı ayrılmasıdır — iki taraf aynı hesapta farklı hedeflerle çalışırsa bütçe kararları çakışır ve sorumlu bulunamaz.",
        en: "Working alongside your current agency is possible and common. In that setup INDOLES owns measurement, budget decisions and the scorecard, while day-to-day campaign operations can stay with the agency. The one condition is splitting roles in writing from the start — two parties working the same account against different goals produce clashing budget calls and no one accountable.",
      },
    },
    {
      question: {
        tr: "Hangi kanallarda çalışıyorsunuz?",
        en: "Which channels do you work across?",
      },
      answer: {
        tr: "INDOLES performans pazarlamayı Google Ads, Meta, LinkedIn, TikTok ve sektörel yayınlar üzerinde yürütür. Kanal seçimi müşterinizin nerede karar verdiğine bakılarak yapılır: sanayi alıcısı için Google araması ve LinkedIn öne çıkar, tüketiciye satan markada Meta ve TikTok ağırlık kazanır. Liste baştan sabitlenmez; denetim ne gösterirse o çalışılır.",
        en: "INDOLES runs performance marketing across Google Ads, Meta, LinkedIn, TikTok and trade publications. Channel choice follows where your customer actually decides: Google search and LinkedIn lead for industrial buyers, Meta and TikTok carry more weight for consumer brands. The list is not fixed up front; we work what the audit shows.",
      },
    },
    {
      question: {
        tr: "Reklam hesaplarının sahibi kim olur?",
        en: "Who owns the ad accounts?",
      },
      answer: {
        tr: "Reklam hesapları ve bütün veriler her zaman sizin adınıza açılır ve sizde kalır. INDOLES hesaplara yönetici erişimiyle bağlanır; çalışma bittiğinde erişim kapatılır, hesap geçmişi ve platformların öğrendiği her şey sizde kalır. Hesabın ajans adına açıldığı düzenler ayrılığı pahalı hâle getirir; bu yüzden hiç kurulmaz.",
        en: "Ad accounts and all data are always opened in your name and stay with you. INDOLES connects with administrator access; when the engagement ends the access is closed, and the account history along with everything the platforms have learned remains yours. Setups where the agency owns the account make leaving expensive — so we never build them.",
      },
    },
  ],

  seo: {
    title: {
      tr: "Performans pazarlama yönetimi",
      en: "Performance marketing management",
    },
    description: {
      tr: "Google Ads, Meta ve LinkedIn reklamlarını tek düzende yöneten performans pazarlama hizmeti. Kazandıran kanal büyür, boşa giden harcama kapanır.",
      en: "Performance marketing across Google Ads, Meta and LinkedIn run as one accountable budget. Winning channels scale; wasted spend gets shut off.",
    },
    entities: {
      tr: [
        "INDOLES",
        "performans pazarlama",
        "Google Ads",
        "Meta",
        "LinkedIn",
        "reklam bütçesi",
        "dönüşüm takibi",
      ],
      en: [
        "INDOLES",
        "performance marketing",
        "Google Ads",
        "Meta",
        "LinkedIn",
        "ad spend",
        "conversion tracking",
      ],
    },
  },

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["cro", "marka-stratejisi", "e-ticaret"],
};
