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
    {
      question: {
        tr: "Performans pazarlama nedir?",
        en: "What is performance marketing?",
      },
      answer: {
        // Terimin ilk-geçiş açıklaması: "performance marketing" TR yüzeyde
        // yalnız buradan geçiyor (strateji §1.5 — CSV kelimeyi TR sorgusu
        // olarak listeliyor, Türk kullanıcı İngilizce terimi aratıyor).
        // Kalıp `articles.ts`teki "İngilizcesi business building" glosunun
        // aynısı; EN karşılığı da aynı yerde Türkçe terimi anıyor.
        tr: "Performans pazarlama, her reklam harcamasının ne getirdiğini ölçen ve bütçeyi bu ölçüme göre dağıtan çalışma biçimidir. Terimin İngilizce karşılığı performance marketing; reklam panellerinde ve sektör yayınlarında aynı iş bu adla geçer. Gösterim ve tıklama sayısı yerine tek soru sorulur: bu kanal kaç müşteri kazandırdı ve kaça mal oldu. INDOLES her kanalı bu soruyla tek tek ölçer; kazandıran kanal büyür, kazandırmayan kapanır.",
        en: "Performance marketing measures what every unit of ad spend returns and allocates budget according to that measurement. In Turkish the same discipline is called performans pazarlama; the vocabulary differs across the two markets, the measure does not. Instead of impressions and clicks, one question is asked: how many customers did this channel win, and at what cost. INDOLES measures each channel against that question; the ones that earn grow, the ones that do not are closed.",
      },
    },
    {
      question: {
        tr: "ROAS nedir ve nasıl takip ediliyor?",
        en: "What is ROAS and how do you track it?",
      },
      answer: {
        tr: "ROAS, harcanan reklam bütçesinin kaç lira satış getirdiğini gösteren orandır. INDOLES bunu kanal karnesinde tutar ve hangi satışın hangi reklamdan geldiğini gösteren dönüşüm takibiyle besler; ölçüm doğru kurulmazsa rapordaki ROAS de doğru olmaz. Oran haftalık panelde beş temel sayıdan biri olarak izlenir ve bütçe tavanı kararlarını bu sayı belirler.",
        en: "ROAS is the ratio showing how much revenue each unit of ad spend returns. INDOLES keeps it in the channel scorecard and feeds it with conversion tracking that ties each sale to the ad that produced it; if the measurement is wrong, so is the reported ROAS. The ratio sits among the five core numbers on the weekly dashboard, and budget ceiling decisions follow it.",
      },
    },
    {
      question: {
        tr: "Müşteri edinme maliyeti nasıl hesaplanıyor?",
        en: "How do you calculate customer acquisition cost?",
      },
      answer: {
        tr: "Müşteri edinme maliyeti, bir kanalın harcaması o kanaldan gelen müşteri sayısına bölünerek çıkar. INDOLES bu sayıyı kanal başına ayrı tutar, çünkü toplam ortalama pahalı kanalın ucuz kanalın arkasına saklanmasına izin verir. Hesabın dayandığı dönüşüm takibi önce doğrulanır; yanlış eşleşen bir satış kanal karnesinin tamamını bozar.",
        en: "Customer acquisition cost is a channel's spend divided by the customers that channel produced. INDOLES keeps the figure per channel, because a blended average lets an expensive channel hide behind a cheap one. The conversion tracking behind the calculation is validated first; one wrongly attributed sale distorts the whole scorecard.",
      },
    },
    {
      question: {
        tr: "Reklam bütçesi artırma ve durdurma kararını kim veriyor?",
        en: "Who decides to raise or stop ad budget?",
      },
      answer: {
        tr: "Kararı kural verir, içgüdü değil. Kanal başına aylık tavan, artırma eşiği ve durdurma koşulu bütçe planında baştan yazılır; kanal karnesi eşiği geçtiğinde bütçe artar, altına düştüğünde durur. Kural yazılı olduğu için her ay yeniden tartışma açılmaz ve harcama kararı tek bir kişinin sezgisine bağlı kalmaz.",
        en: "Rules decide, not instinct. The monthly ceiling per channel, the threshold for scaling up and the condition for stopping are written into the budget plan up front; when the scorecard clears the threshold, budget rises, and when it drops below, spend stops. Because the rule is written down, the argument does not reopen every month and the decision does not rest on one person's judgement.",
      },
    },
    {
      question: {
        tr: "Reklam görsellerini ve videolarını siz mi üretiyorsunuz?",
        en: "Do you produce the ad creative and video?",
      },
      answer: {
        tr: "Görsel ve video prodüksiyonu bu hizmetin kapsamı dışında, ayrı bir üretim işidir. INDOLES hangi görselin, hangi mesajın ve hangi teklifin test edileceğini kurgular, testi yürütür ve kazananı sayılarla seçer. Üretimi kendi ekibiniz ya da çalıştığınız yapımcı üstlenir; test düzeni ne üretileceğini de netleştirir.",
        en: "Image and video production sits outside this scope; it is a separate production job. INDOLES designs which visual, which message and which offer gets tested, runs the test and picks the winner on the numbers. Your own team or your production partner makes the assets, and the testing routine tells them what to make.",
      },
    },
    {
      question: {
        tr: "Hangi durumda performans pazarlama yanlış tercih olur?",
        en: "When is performance marketing the wrong choice?",
      },
      answer: {
        tr: "Site gelen ziyaretçiyi satışa çeviremiyorsa reklam bütçesi kayıp noktalarını büyütmekten başka bir işe yaramaz; önce dönüşüm optimizasyonu gerekir. Şirket kime, hangi farkla sattığını anlatamıyorsa reklam metni de anlatamaz ve o iş marka stratejisinde başlar. Organik sıralama hedefleniyorsa bu hizmet o alanı kapsamaz, çünkü kapsam ücretli kanallarla sınırlı.",
        en: "If the site cannot turn arriving visitors into sales, ad budget only enlarges the leaks — conversion optimisation comes first. If the company cannot say who it sells to and with what difference, the ad copy cannot say it either, and that work starts with brand strategy. If the goal is organic ranking, this service does not cover it, because the scope stays on paid channels.",
      },
    },
    {
      // Karsi-konumlandirma sorusu (strateji §2, Rakip-Analizi §1-2).
      // Ticari niteleyici kelime H1'e girmez; kendimizi adlandirmak icin
      // degil, ayristigimiz seyi adlandirmak icin kullanilir.
      question: {
        tr: "Performans pazarlama ajansı ile danışmanlık arasındaki fark nedir?",
        en: "What is the difference between a performance marketing agency and consulting?",
      },
      answer: {
        tr: "Performans pazarlama ajansı reklam hesabını yönetir ve harcamayı büyütür; danışmanlık hangi kanalın ne kadar bütçeyi hak ettiğine veriyle karar verir. INDOLES ikisini ayırmaz ama sırayı sabitler: dönüşüm takibi kurulmadan hiçbir kampanya ölçeklenmez, çünkü ölçülmeyen harcamayı büyütmek kaybı da büyütür. Kanal kararı ROAS ve CAC kıyaslamasından çıkar, tercihten değil.",
        en: "A performance marketing agency manages the ad account and grows the spend; consulting decides with data how much budget each channel deserves. INDOLES does not separate the two but fixes the order: no campaign scales before conversion tracking is in place, because growing unmeasured spend grows the loss as well. The channel decision comes out of ROAS and CAC benchmarking rather than preference.",
      },
    },
  ],

  seo: {
    title: {
      tr: "Performans pazarlama yönetimi",
      en: "Performance marketing management",
    },
    description: {
      tr: "Google Ads danışmanlığından Meta ve TikTok'a, reklam hesaplarını tek karneyle yöneten performans pazarlama. Dönüşüm takibi kurulur, boşa giden harcama kapanır.",
      en: "Performance marketing across Google Ads, Meta, LinkedIn and TikTok, run as one accountable budget. Conversion tracking fixed first, then wasted spend shut off.",
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

  /**
   * Aylık yönetim planları — eski sitedeki fiyat listesinin (₺45/75/90 bin,
   * Burak onayı 2026-08-27) merdiven modeliyle taşınmış hâli. Kapsam kalemleri
   * eski listeyle birebir; yalnız adlandırma sadeleşti ("PPC (TBM) Bazlı"
   * öneki düştü, GOOGLE → Google Ads, sentence case). Standart, Giriş'in;
   * Profesyonel, Standart'ın üstkümesidir — üst planlar yalnız fark kalemlerini
   * listeler, seviye atlayan kalemler "…kapsama çıkar" diliyle yazılır.
   */
  retainerPlans: {
    title: {
      tr: "Performans pazarlama yönetiminde üç plan.",
      en: "Three plans for performance marketing management.",
    },
    lede: {
      tr: "Kapsam bütçeyle değil, üretim derinliği ve yönetim yoğunluğuyla büyür. Üç planda da aynı ekip çalışır; fark kapsamda.",
      en: "Scope grows with production depth and management intensity, not with budget alone. The same team works on all three plans; the difference is scope.",
    },
    note: {
      tr: "Fiyatlar aylıktır; KDV dahil değildir.",
      en: "Prices are monthly and exclude VAT.",
    },
    plans: [
      {
        key: "giris",
        name: { tr: "Giriş", en: "Starter" },
        monthlyTRY: 45000,
        summary: {
          tr: "Sosyal medya yönetimi, temel içerik ve sınırlı SEO'yu tek yönetim ritminde toplar.",
          en: "Brings social media management, core content and limited-scope SEO into one management rhythm.",
        },
        audience: {
          tr: "Reklamı yeni sistemleştiren, tek ekiple yönetilebilir kapsam isteyen işletmeler için.",
          en: "For businesses systemising their advertising for the first time, with a scope one team can run.",
        },
        spotlight: {
          title: { tr: "Ayda 1 gün çekim", en: "One shoot day a month" },
          description: {
            tr: "Reels, ürün çekimi, kısa tanıtım ve UGC gibi kreatif ihtiyaçlar için ayda 1 günlük çekim planlamasını içerir.",
            en: "Includes one shoot day a month, planned around creative needs such as Reels, product shots, short promos and UGC.",
          },
        },
        features: [
          { tr: "Sosyal medya yönetimi", en: "Social media management" },
          {
            tr: "Sosyal medya reklam yönetimi",
            en: "Social media ad management",
          },
          { tr: "Google Ads yönetimi", en: "Google Ads management" },
          { tr: "Temel içerik üretimi", en: "Core content production" },
          { tr: "SEO — sınırlı kapsam", en: "SEO — limited scope" },
          {
            tr: "Aylık analiz ve raporlama",
            en: "Monthly analysis and reporting",
          },
          {
            tr: "Dönüşüm odaklı UI/UX iyileştirmeleri",
            en: "Conversion-focused UI/UX improvements",
          },
        ],
      },
      {
        key: "standart",
        name: { tr: "Standart", en: "Standard" },
        monthlyTRY: 75000,
        featured: true,
        summary: {
          tr: "Bütçe dönüşüm verisiyle yönetilir; içerik ve SEO kapsamı genişler.",
          en: "Budget is managed on conversion data; content and SEO scope widen.",
        },
        audience: {
          tr: "Birden fazla reklam kanalı çalışan ve bütçeyi dönüşüm verisiyle yönetmek isteyen işletmeler için.",
          en: "For businesses running more than one ad channel and managing budget on conversion data.",
        },
        baseline: {
          tr: "Giriş'teki her şey, artı:",
          en: "Everything in Starter, plus:",
        },
        spotlight: {
          title: { tr: "Ayda 1 gün çekim", en: "One shoot day a month" },
          description: {
            tr: "Reels, ürün çekimi, kısa tanıtım ve UGC gibi kreatif ihtiyaçlar için ayda 1 günlük çekim planlamasını içerir.",
            en: "Includes one shoot day a month, planned around creative needs such as Reels, product shots, short promos and UGC.",
          },
        },
        features: [
          {
            tr: "Yatırım getirisi odaklı bütçe ve kanal planı",
            en: "Return-on-investment-led budget and channel plan",
          },
          {
            tr: "İçerik üretimi gelişmiş kapsama çıkar",
            en: "Content production moves up to advanced scope",
          },
          { tr: "SEO temel kapsama çıkar", en: "SEO moves up to core scope" },
          {
            tr: "Analiz ve raporlama detaylanır",
            en: "Analysis and reporting gain detail",
          },
        ],
      },
      {
        key: "profesyonel",
        name: { tr: "Profesyonel", en: "Professional" },
        monthlyTRY: 90000,
        summary: {
          tr: "Kreatif direktörlükten prodüksiyona, pazarlamanın tamamını tek ekipte toplar.",
          en: "Brings all of marketing into one team, from creative direction to production.",
        },
        audience: {
          tr: "Üretim ihtiyacı sürekli olan, pazarlamayı tek merkezden yürütmek isteyen köklü markalar için.",
          en: "For established brands with a constant production need that want marketing run from one centre.",
        },
        baseline: {
          tr: "Standart'taki her şey, artı:",
          en: "Everything in Standard, plus:",
        },
        spotlight: {
          title: { tr: "Ayda 2 gün çekim", en: "Two shoot days a month" },
          description: {
            tr: "Reels, ürün çekimi, kısa tanıtım ve UGC gibi kreatif ihtiyaçlar için ayda 2 günlük çekim planlamasını içerir.",
            en: "Includes two shoot days a month, planned around creative needs such as Reels, product shots, short promos and UGC.",
          },
        },
        features: [
          { tr: "Kreatif direktörlük", en: "Creative direction" },
          {
            tr: "Sanat yönetimi ve varlık yönetimi",
            en: "Art direction and asset management",
          },
          {
            tr: "Çok kanallı pazarlama yönetimi",
            en: "Multi-channel marketing management",
          },
          { tr: "E-posta pazarlaması", en: "Email marketing" },
          {
            tr: "Veri odaklı potansiyel müşteri üretimi",
            en: "Data-led lead generation",
          },
          {
            tr: "Yeniden pazarlama ve yeniden hedefleme",
            en: "Remarketing and retargeting",
          },
          {
            tr: "Blog ve içerik pazarlaması",
            en: "Blog and content marketing",
          },
          {
            tr: "SEO gelişmiş kapsama çıkar",
            en: "SEO moves up to advanced scope",
          },
          {
            tr: "Detaylı web sitesi tasarımı ve geliştirilmesi",
            en: "Detailed website design and development",
          },
          {
            tr: "Satış ve potansiyel müşteri takibi",
            en: "Sales and lead tracking",
          },
          {
            tr: "Film ve prodüksiyon işlerinde %15 plan indirimi",
            en: "15% plan discount on film and production work",
          },
        ],
      },
    ],
  },

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["cro", "marka-stratejisi", "e-ticaret"],
};
