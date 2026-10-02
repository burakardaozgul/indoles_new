import type { ServiceContent } from "../types";

/**
 * E-ticaret danışmanlığı — Growth.
 *
 * 2026-10-02 yeniden konumlandırma (Burak): sayfa mağaza KURULUMU değil,
 * e-ticarette BÜYÜME DANIŞMANLIĞI olarak konuşur. Dört eksen:
 *   (a) platform — hangi altyapı, kalmak mı geçmek mi;
 *   (b) reklam kanalları — kanal karması, bütçe dağılımı, optimizasyon
 *       KARARI ve ölçümü (hesapların günlük yönetimi `performans-pazarlama`
 *       hizmetinin işi; burada çakışma yok, bağ var);
 *   (c) çalışma sistemi — ödeme, stok, muhasebe/ERP, kargo ve bayi akışı;
 *       eski sayfanın güçlü kısmı, "kurulum" değil "sistem kararı ve
 *       kurulumu" çerçevesinde korunur;
 *   (d) büyüme — ölçüm, dönüşüm oranı, kıyasa göre öncelik (sürekli test
 *       programı `cro` hizmetinin işi).
 * Kurulum ve entegrasyon danışmanlığın bir ayağı olarak kalır, başlık değil.
 *
 * Kapasite yalnız repodaki doğrulanabilir içerikten: (a) ve (c) eski
 * `e-ticaret.ts` kapsamı ve SSS'leri; (b) ve (d) Büyüme Sprinti kapsamı
 * (`packages.ts` — kanal başına ROAS/CAC/dönüşüm kıyası, 90 günlük kanal
 * hipotezi ve bütçe dağılımı, A/B test planı, haftalık panel, "ajans
 * değişikliği önermez"); operasyon teşhisi Dijital Dönüşüm Teşhisi
 * (`packages.ts`). Ortaklık, sertifika, platform bayiliği iddiası yok.
 *
 * İki farklı alıcıya konuşur: sanayi tarafında B2B e-ihracat ve bayi ağı,
 * ticaret tarafında tüketici mağazası. Orta ton (docs/03 §2c).
 *
 * `shortDescription` artık `pillars.ts`te kopyası olmayan tek kaynak alan;
 * liste kartı ve anasayfa kartı buradan okur.
 */
export const eTicaret: ServiceContent = {
  slug: { tr: "e-ticaret", en: "e-commerce" },
  pillar: "growth",
  name: { tr: "E-ticaret", en: "E-commerce" },

  shortDescription: {
    industrial: {
      tr: "B2B e-ihracat platformu, tedarikçi portalı veya bayi ağı için danışmanlık: hangi altyapı, hangi ERP bağlantısı, hangi sipariş düzeni. Karar veriyle verilir; kurulum ve entegrasyon da kapsamda.",
      en: "Consulting for a B2B e-export platform, supplier portal or dealer network: which platform, which ERP connection, which order routine. Decisions are made on data; build and integration are in scope too.",
    },
    commerce: {
      tr: "Hangi platform, hangi reklam kanalı, nasıl bir sistem, büyümek için önce ne? E-ticarette dört karar veriyle verilir; dönüşüm, ölçüm ve kanal bütçesi tek planda okunur.",
      en: "Which platform, which ad channels, what operating system, what to fix first to grow? Four e-commerce decisions made on data, with conversion, measurement and channel budget read in one plan.",
    },
  },

  /**
   * Dört eksen tek cümlede, karar sırası ikinci cümlede. "Kurar" fiili
   * ikinci cümlenin sonuna indi: kurulum danışmanlığın ayağıdır, vaadi değil.
   */
  lede: {
    tr: "E-ticaret danışmanlığı, mağazanın hangi platformda çalışacağına, reklam bütçesinin hangi kanallara gideceğine, siparişin nasıl bir sistemde akacağına ve büyümek için önce hangi kaybın kapatılacağına veriyle karar verme işidir. INDOLES bu dört kararı yazılı gerekçeyle verir; kurulumu, entegrasyonu ve ölçümü de kararların sırasıyla uygular.",
    en: "E-commerce consulting is the work of deciding, on data, which platform the store runs on, which channels the ad budget goes to, what system orders flow through and which loss to close first in order to grow. INDOLES makes those four decisions with written reasoning, then puts the build, the integrations and the measurement in place in the order they were decided.",
  },

  signals: {
    tr: [
      "Reklam bütçesi artıyor ama satış aynı hızla büyümüyor; hangi kanalın gerçekten getirdiği bilinmiyor.",
      "Siparişler geliyor ama stok, fatura ve kargo elle takip ediliyor; bayi siparişi hâlâ telefonla alınıyor.",
      "Platform ya da ajans değiştirmek gündemde, ama kararın dayanağı bir özellik listesi ya da bir his.",
    ],
    en: [
      "The ad budget keeps rising but sales do not grow at the same pace; nobody knows which channel really delivers.",
      "Orders come in but stock, invoicing and shipping are tracked by hand; dealer orders still arrive by phone.",
      "Changing platform or agency is on the table, but the decision rests on a feature list or a hunch.",
    ],
  },

  platforms: [
    "İKAS",
    "Ticimax",
    "İdeaSoft",
    "Shopify",
    "WooCommerce",
    "WordPress",
    "SAP",
  ],

  scope: {
    /**
     * Sıra dört eksenin sırası: platform, kanal, büyüme (dönüşüm + ölçüm),
     * çalışma sistemi (ödeme, stok/ERP/kargo, bayi), en sonda mağazanın
     * kendisi ve devir.
     */
    includes: [
      {
        title: { tr: "Platform ve altyapı kararı", en: "Platform decision" },
        description: {
          tr: "Hazır altyapı, mevcut altyapıyı iyileştirmek ya da özel geliştirme: ürün sayısı, sipariş hacmi ve entegrasyon ihtiyacına göre, elenen seçenekleriyle birlikte yazılı gerekçe.",
          en: "An off-the-shelf platform, improving the current one or a custom build: decided on catalogue size, order volume and integration needs, with written reasoning that includes the options ruled out.",
        },
      },
      {
        title: { tr: "Reklam kanalı ve bütçe kararı", en: "Ad channel and budget decision" },
        description: {
          tr: "Google, Meta, TikTok, SEO ve e-posta kanalları ROAS, CAC ve dönüşüm oranı üzerinden denetlenir; 90 günlük kanal hipotezi ve bütçe dağılımı, mevcut ajansınızın da uygulayabileceği biçimde yazılır.",
          en: "Google, Meta, TikTok, SEO and email are audited on ROAS, CAC and conversion rate; a 90-day channel hypothesis and budget split is written in a form your current agency can also execute.",
        },
      },
      {
        title: { tr: "Dönüşüm önceliği ve test planı", en: "Conversion priorities and test plan" },
        description: {
          tr: "Dönüşüm oranı sektör kıyaslarıyla okunur, hunideki kayıplar büyüklüğüne göre sıralanır ve en kritik adım için en az üç hipotezli bir A/B test planı çıkar.",
          en: "The conversion rate is read against sector benchmarks, funnel losses are ranked by size, and an A/B test plan with at least three hypotheses is drawn up for the most critical step.",
        },
      },
      {
        title: { tr: "Ölçüm kurulumu", en: "Measurement setup" },
        description: {
          // Tam form "e-ticaret dönüşüm oranı artırma" burada (strateji
          // §1.5 ucuz kazançlar). C-07 kısa formları CRO sayfasına
          // dağıtmıştı — "arttırma" scope metnine, "artırma" SSS'e; önekli
          // tam form hiçbir yüzeyde yoktu. Ölçüm kalemi doğal yeri, çünkü
          // oranı artırma işi bu panelden okunan sayılarla başlıyor.
          tr: "Hangi ürün ne kadar satıyor, sepet nerede terk ediliyor, hangi kanal getiriyor — panelden okunur hâle gelir. E-ticaret dönüşüm oranı artırma çalışması da bu ölçümden başlar: hangi adımda kaç ziyaretçinin düştüğü görünmeden hangi düzeltmenin işe yarayacağı bilinmez.",
          en: "Which products sell, where carts are abandoned, which channel delivers — all readable from one dashboard. Raising the conversion rate of an online store starts from the same measurement: until the drop-off at each step is visible, a fix is only a guess.",
        },
      },
      {
        title: { tr: "Ödeme ve fatura akışı", en: "Payment and invoicing flow" },
        description: {
          tr: "Sanal POS, taksit, havale ve kurumsal alıcı için vadeli ödeme; e-fatura ve e-arşiv bağlantısı dahil.",
          en: "Card payment, instalments, bank transfer and terms for corporate buyers, including e-invoice integration.",
        },
      },
      {
        title: { tr: "Stok, ERP ve kargo bağlantısı", en: "Stock, ERP and shipping links" },
        description: {
          tr: "Sipariş düşünce stok otomatik iner, muhasebeye tek kayıt gider, kargo gönderisi kendiliğinden oluşur ve takip bilgisi müşteriye gider. Sipariş nereden gelirse gelsin aynı akışta işlenir.",
          en: "Stock drops automatically on order, a single record reaches accounting, the shipment is created on its own and tracking reaches the customer. Every order is processed in the same flow, wherever it comes from.",
        },
      },
      {
        title: { tr: "Toptan ve bayi akışı", en: "Wholesale and dealer flow" },
        description: {
          tr: "Bayiye özel fiyat listesi, toplu sipariş ekranı ve cari hesap görünürlüğü — B2B satış telefondan siteye taşınır.",
          en: "Dealer-specific price lists, bulk order screens and account visibility — B2B sales move from phone to site.",
        },
      },
      {
        title: { tr: "Mağaza kurulumu ve devir", en: "Store build and handover" },
        description: {
          tr: "Karar kurulum gerektiriyorsa kategori yapısı, ürün sayfaları ve arama kurulur; ekip ürün ekleme, sipariş yönetimi ve rapor okuma konusunda eğitilir ve düzen devredilir.",
          en: "Where the decision calls for a build, category structure, product pages and search are set up; the team is trained to add products, manage orders and read reports, and the routine is handed over.",
        },
      },
    ],
    excludes: {
      tr: [
        "Reklam hesaplarının günlük yönetimi ve trafik satın alma — performans pazarlama hizmetinde",
        "Sürekli A/B test programının yürütülmesi — dönüşüm oranı optimizasyonu hizmetinde",
        "Depo operasyonu, fiziksel lojistik ve pazaryeri hesaplarının günlük yönetimi",
        "Ürün fotoğrafı, video ve içerik prodüksiyonu",
      ],
      en: [
        "Day-to-day ad account management and buying traffic — covered by performance marketing",
        "Running a continuous A/B testing programme — covered by conversion rate optimisation",
        "Warehouse operations, physical logistics and day-to-day marketplace account management",
        "Product photography, video and content production",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Teşhis", en: "Diagnosis" },
      description: {
        tr: "Siparişin girişten teslimata akışı, kanal başına ROAS, CAC ve dönüşüm oranı ve ölçümün sağlığı okunur. Elle yapılan işler, kopma noktaları ve hunideki kayıplar işaretlenir.",
        en: "The order flow from entry to delivery, ROAS, CAC and conversion rate per channel, and the health of the measurement are read. Manual work, break points and funnel losses get marked.",
      },
      output: {
        tr: "Sipariş akışı şeması, kanal karnesi ve kayıp noktaları listesi.",
        en: "An order flow map, a channel scorecard and a list of loss points.",
      },
    },
    {
      step: "02",
      title: { tr: "Karar", en: "Decision" },
      description: {
        tr: "Platform, kanal ve sistem kararları; maliyet, süre ve büyüme senaryosu karşılaştırılarak, elenen seçenekleriyle birlikte yazılı gerekçeyle verilir.",
        en: "Platform, channel and system decisions are made in writing, comparing cost, timeline and growth scenario, with the options ruled out stated alongside.",
      },
      output: {
        tr: "Altyapı kararı, 90 günlük kanal ve bütçe planı, entegrasyon listesi ve maliyet karşılaştırması.",
        en: "The platform decision, a 90-day channel and budget plan, the integration list and a cost comparison.",
      },
    },
    {
      step: "03",
      title: { tr: "Kurulum ve entegrasyon", en: "Build and integration" },
      description: {
        tr: "Gereken kurulum yapılır; ödeme, stok, muhasebe ve kargo bağlanır, her entegrasyon gerçek siparişle test edilir. Ölçüm doğrulanır, en kritik huni adımının test planı devreye girer.",
        en: "Whatever needs building is built; payment, stock, accounting and shipping are connected, and each integration is tested with a real order. Measurement is validated and the test plan for the most critical funnel step goes live.",
      },
      output: {
        tr: "Çalışan sistem, test edilmiş entegrasyonlar ve doğrulanmış ölçüm.",
        en: "A working system, tested integrations and validated measurement.",
      },
    },
    {
      step: "04",
      title: { tr: "Ölçüm ve devir", en: "Measurement and handover" },
      description: {
        tr: "Sonuçlar haftalık panelden okunur; ilk siparişler ve kanal verisi izlenir. Ekip ürün ekleme, sipariş yönetme ve rapor okuma konusunda eğitilir, düzen devredilir.",
        en: "Results are read from a weekly dashboard; the first orders and channel data are watched. The team is trained to add products, manage orders and read reports, and the routine is handed over.",
      },
      output: {
        tr: "Haftalık gösterge paneli, kullanım kılavuzu ve eğitilmiş iç ekip.",
        en: "A weekly dashboard, a usage guide and a trained in-house team.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Teşhis ve karar raporu", en: "Diagnosis and decision report" },
      description: {
        tr: "Sipariş akışı şeması, kanal karnesi, altyapı kararı ve elenen seçenekler — gerekçesiyle ve sorumlusuyla.",
        en: "Order flow map, channel scorecard, the platform decision and the options ruled out — with reasoning and owners.",
      },
    },
    {
      kind: "document",
      title: { tr: "90 günlük kanal ve bütçe planı", en: "90-day channel and budget plan" },
      description: {
        tr: "Hangi kanalda ne kadar, hangi metrik hedefiyle; reklamı kim yönetirse yönetsin uygulanabilir biçimde.",
        en: "How much on which channel, against which metric target — executable whoever runs the ads.",
      },
    },
    {
      kind: "document",
      title: { tr: "Test listesi", en: "Test backlog" },
      description: {
        tr: "Hunideki en kritik adım için hipotezler, öncelik sırası ve beklenen etki aralığı.",
        en: "Hypotheses for the most critical funnel step, their priority order and expected impact range.",
      },
    },
    {
      kind: "system",
      title: { tr: "Bağlı çalışan mağaza", en: "Connected working store" },
      description: {
        tr: "Ödeme, stok, muhasebe ve kargo entegrasyonları gerçek siparişle test edilmiş hâlde canlıda.",
        en: "Payment, stock, accounting and shipping integrations live, each tested with a real order.",
      },
    },
    {
      kind: "system",
      title: { tr: "Haftalık gösterge paneli", en: "Weekly dashboard" },
      description: {
        tr: "Beş temel metrik ve yorumlama kılavuzu; iç ekibe devre hazır.",
        en: "Five core metrics with an interpretation guide, ready to hand to the in-house team.",
      },
    },
    {
      kind: "training",
      title: { tr: "Ekip eğitimi", en: "Team training" },
      description: {
        tr: "Ürün ekleme, sipariş yönetimi ve rapor okuma; kayıt altına alınmış oturum.",
        en: "Adding products, managing orders and reading reports — a recorded session.",
      },
    },
    {
      kind: "access",
      title: { tr: "Sistem sahipliği", en: "System ownership" },
      description: {
        tr: "Altyapı hesapları, alan adı ve varsa kaynak kod firmanın adına kayıtlıdır.",
        en: "Platform accounts, domain and any source code registered to the company.",
      },
    },
  ],

  /**
   * SSS sırası anlam sırasıdır ve FAQPage şemasına aynen akar: önce ne
   * satın alındığı (kapsam), sonra kimden (karşı-konumlandırma — CRO
   * emsali: 2. sıra), sonra neye mal olduğu, sonra dört eksenin soruları,
   * en sonda süre ve sınır. Cevaplar satır içi link taşımaz (`faqLd` ham
   * metin alır); yazılara bağ "İlgili yazılar" bloğundan kurulur — konu
   * `e-ticaret` olan en yeni üç yazı karar kümesinin üçlüsüdür.
   */
  faq: [
    {
      question: {
        tr: "E-ticaret danışmanlığı neleri kapsar?",
        en: "What does e-commerce consulting cover?",
      },
      answer: {
        tr: "E-ticaret danışmanlığı dört kararı kapsar: mağaza hangi altyapıda çalışacak, reklam bütçesi hangi kanallara hangi oranda gidecek, sipariş, stok, muhasebe ve kargo nasıl bir sistemde akacak, büyümek için önce hangi kayıp kapatılacak. INDOLES bu kararları teşhisten sonra yazılı gerekçeyle verir; kurulum, entegrasyon ve ölçüm de kapsamın içindedir. Reklam hesaplarının günlük yönetimi ve sürekli test programı ilgili hizmetlerde yürür.",
        en: "E-commerce consulting covers four decisions: which platform the store runs on, which channels the ad budget goes to and in what proportion, what system orders, stock, accounting and shipping flow through, and which loss to close first in order to grow. INDOLES makes these decisions after a diagnosis, with written reasoning; build, integration and measurement are inside the scope too. Day-to-day ad account management and a continuous testing programme run under their own services.",
      },
    },
    {
      // Karşı-konumlandırma sorusu (strateji §2, Rakip-Analizi §1-2) —
      // 2026-10-02'de son sıradan ikinciye alındı (CRO emsali). Ticari
      // niteleyici kelime H1'e girmez; kendimizi adlandırmak için değil,
      // ayrıştığımız şeyi adlandırmak için kullanılır.
      question: {
        tr: "E-ticaret ajansı ile e-ticaret danışmanı arasındaki fark nedir?",
        en: "What is the difference between an e-commerce agency and an e-commerce consultant?",
      },
      answer: {
        tr: "E-ticaret ajansı genellikle mağazayı kurar ve reklamı yönetir; e-ticaret danışmanı hangi platformun, hangi reklam kanallarının, nasıl bir çalışma sisteminin ve hangi büyüme önceliğinin işe yarayacağına karar verir. INDOLES kurulumu da yapar ama kararı önce verir: sipariş akışı ve kanal verisi okunmadan platform seçilmez, bütçe dağıtılmaz. Yanlış platform ya da kanal kararı ilk ayda değil sonraki aylarda pahalıya patlar, o yüzden sıra tersine çevrilmez.",
        en: "An e-commerce agency usually builds the store and runs the ads; an e-commerce consultant decides which platform, which ad channels, what operating system and which growth priority will actually work. INDOLES does the build as well, but the decision comes first: no platform is chosen and no budget is split before the order flow and channel data have been read. A wrong platform or channel decision costs in the months after rather than the first, so the sequence is never reversed.",
      },
    },
    {
      question: {
        tr: "E-ticaret danışmanlığı ne kadar tutar?",
        en: "How much does e-commerce consulting cost?",
      },
      answer: {
        tr: "Karar aşaması için yayımlı fiyatlarımız KDV hariç 180.000 ile 240.000 TL arasında: sipariş ve operasyon kısıtı için üç haftalık Dijital Dönüşüm Teşhisi 180.000 TL, reklam kanalı ve dönüşüm kısıtı için dört haftalık Büyüme Sprinti 240.000 TL. Mağaza kurulumu ve entegrasyon, akış haritasından sonra entegrasyon sayısına göre ayrıca fiyatlanır; platform lisansı ve reklam bütçesi hiçbir pakete dahil değildir.",
        en: "Our published prices for the decision stage run from €5,500 to €7,500 excluding VAT: the three-week Digital Transformation Audit at €5,500 for an order and operations constraint, the four-week Growth Sprint at €7,500 for an ad channel and conversion constraint. Store build and integration are priced separately after the flow map, according to the number of integrations; platform licences and ad budget are not included in any package.",
      },
    },
    {
      question: {
        tr: "Reklam kanallarımızı da siz mi yönetiyorsunuz?",
        en: "Do you also run our ad channels?",
      },
      answer: {
        tr: "E-ticaret danışmanlığında verilen şey kanal ve bütçe kararıdır: Google, Meta, TikTok, SEO ve e-posta kanalları ROAS, CAC ve dönüşüm oranı üzerinden denetlenir, 90 günlük kanal hipotezi ve bütçe dağılımı yazılır. INDOLES ajans değişikliği önermez; plan mevcut ajansınızın ya da iç ekibinizin uygulayabileceği biçimde teslim edilir. Reklam hesaplarının günlük yönetimini bize vermek isterseniz o iş performans pazarlama hizmetinin kapsamındadır.",
        en: "What this service delivers is the channel and budget decision: Google, Meta, TikTok, SEO and email are audited on ROAS, CAC and conversion rate, and a 90-day channel hypothesis and budget split is written. INDOLES does not propose changing agencies; the plan is delivered in a form your current agency or in-house team can execute. If you want us to run the ad accounts day to day, that work sits within the performance marketing service.",
      },
    },
    {
      question: {
        tr: "Dönüşüm oranını artırmak bu danışmanlığın parçası mı?",
        en: "Is raising the conversion rate part of this consulting?",
      },
      answer: {
        tr: "Evet, büyüme ekseninin merkezinde dönüşüm oranı var. Önce ölçüm doğrulanır, oran sektör kıyaslarıyla okunur ve hunideki kayıplar büyüklüğüne göre sıralanır; en kritik adım için en az üç hipotezli bir A/B test planı çıkar. Testlerin aylar boyunca sürekli yürütülmesi ayrı bir iştir ve dönüşüm oranı optimizasyonu hizmetinde yapılır; bu hizmet önceliği ve planı verir, programı devreder.",
        en: "Yes — the conversion rate sits at the centre of the growth axis. Measurement is validated first, the rate is read against sector benchmarks and funnel losses are ranked by size; an A/B test plan with at least three hypotheses is drawn up for the most critical step. Running tests continuously over months is separate work done under the conversion rate optimisation service; this service sets the priorities and the plan, then hands the programme over.",
      },
    },
    {
      question: {
        tr: "Shopify mi yoksa özel yazılım mı?",
        en: "Shopify or a custom build?",
      },
      answer: {
        tr: "Shopify standart ürün satışında hızlı ve düşük bakım yükü sunar; özel geliştirme ise karmaşık fiyatlandırma, bayi hiyerarşisi veya ağır ERP entegrasyonu gerektiğinde anlam kazanır. INDOLES bu kararı ürün sayısı, sipariş hacmi ve entegrasyon ihtiyacına bakarak verir ve gerekçesini maliyet karşılaştırmasıyla yazılı sunar. Karar baştan değil, akış haritası çıkarıldıktan sonra alınır.",
        en: "Shopify is fast and low-maintenance for standard product sales, while a custom build earns its place when pricing is complex, there is a dealer hierarchy or heavy ERP integration is needed. INDOLES makes this call by looking at catalogue size, order volume and integration needs, and presents the reasoning in writing with a cost comparison. The decision comes after the flow mapping, not before.",
      },
    },
    {
      question: {
        tr: "İKAS, Ticimax veya İdeaSoft gibi hazır altyapılarla çalışıyor musunuz?",
        en: "Do you work with ready-made platforms like Shopify or WooCommerce?",
      },
      answer: {
        tr: "Evet, İKAS, Ticimax, İdeaSoft, Shopify ve WooCommerce kurulumları bu hizmetin içinde. Altyapı kararı marka tercihiyle değil ürün sayısı, sipariş hacmi ve entegrasyon ihtiyacıyla verilir, gerekçesi maliyet karşılaştırmasıyla yazılı sunulur. Mevcut altyapınız bu listedeyse kurulum sıfırdan değil, akış haritasında çıkan kopma noktalarından başlar.",
        en: "Yes — İKAS, Ticimax, İdeaSoft, Shopify and WooCommerce builds all sit inside this service. The platform decision follows product count, order volume and integration needs rather than brand preference, and the reasoning is presented with a cost comparison. If your current platform is on that list, the work starts from the breakpoints found in the flow map rather than from scratch.",
      },
    },
    {
      question: {
        tr: "Mevcut muhasebe programımızla çalışır mı?",
        en: "Will it work with our current accounting software?",
      },
      answer: {
        tr: "Türkiye'de yaygın kullanılan muhasebe ve ERP programlarının çoğu entegrasyona açıktır ve INDOLES bağlantıyı bu hizmet kapsamında kurar. Programın entegrasyon imkânı yoksa bu durum akış haritası aşamasında tespit edilir ve alternatif yol maliyetiyle birlikte sunulur — sonradan sürpriz çıkmaz. Amaç aynı veriyi iki yere elle girmeyi tamamen bitirmektir.",
        en: "Most accounting and ERP systems in common use in Turkey are open to integration, and INDOLES builds that connection within this service. If a system has no integration path, that is identified during flow mapping and an alternative is presented with its cost — no surprises later. The aim is to end double manual entry entirely.",
      },
    },
    {
      question: {
        tr: "Bayi, toptan ve e-ihracat satışı da kapsamda mı?",
        en: "Are dealer, wholesale and export sales in scope too?",
      },
      answer: {
        tr: "Evet. B2B tarafı ayrı bir mağaza olarak değil, aynı kurulumun içinde bayi akışı olarak çalışır: bayiye ve distribütöre özel fiyat listesi, toplu sipariş ekranı ve cari hesap görünürlüğü kurulur, kurumsal alıcı için vadeli ödeme ve e-fatura bağlantısı eklenir. Her bayi giriş yaptığında kendi fiyatını ve limitini görür; toptan sipariş telefondan ve e-postadan siteye taşınır, satış ekibi sipariş yazmak yerine ilişki yönetir.",
        en: "Yes. The B2B side runs not as a separate store but as a dealer flow inside the same build: dealer- and distributor-specific price lists, a bulk order screen and account balance visibility are set up, with deferred payment and e-invoicing added for corporate buyers. Each dealer sees their own pricing and limit on login; wholesale ordering moves off the phone and out of email onto the site, and the sales team manages relationships instead of typing orders.",
      },
    },
    {
      question: {
        tr: "Trendyol ve benzeri pazaryerleri kapsama giriyor mu?",
        en: "Are marketplaces like Trendyol part of the scope?",
      },
      answer: {
        tr: "Pazaryeri hesaplarının günlük yönetimi ve ürün girişi bu hizmetin kapsamı dışında; pazaryeri kararı ise içinde. Kendi site ile pazaryerlerinin nasıl birlikte çalışacağı, pazaryeri siparişlerinin stok, fatura ve kargo tarafında aynı akışa nasıl bağlanacağı ve kanalın bütçe planındaki yeri danışmanlığın konusudur. Günlük pazaryeri operasyonunu iç ekibiniz ya da bu işe bakan bir ajans yürütür.",
        en: "Day-to-day marketplace account management and product entry sit outside this service; the marketplace decision sits inside it. How your own site and marketplaces work together, how marketplace orders connect to the same stock, invoicing and shipping flow, and where the channel sits in the budget plan are all part of the consulting. Daily marketplace operations stay with your in-house team or an agency that handles them.",
      },
    },
    {
      question: {
        tr: "Danışmanlık ve kurulum ne kadar sürer?",
        en: "How long do the consulting and the build take?",
      },
      answer: {
        tr: "Karar aşaması üç ila dört hafta sürer: operasyon teşhisi üç, kanal ve huni teşhisi dört hafta. Hazır altyapı üzerine standart bir mağaza kurulumu genellikle altı ila sekiz hafta sürer; ERP entegrasyonu ve bayi akışı eklendiğinde süre üç aya kadar çıkabilir. INDOLES süreyi entegrasyon sayısına göre tahmin eder; mağaza tek seferde açılmak zorunda değildir, kritik akış önce yayına alınabilir.",
        en: "The decision stage takes three to four weeks: three for the operations audit, four for the channel and funnel diagnosis. A standard store on an off-the-shelf platform usually takes six to eight weeks to build; adding ERP integration and dealer flows can extend that to three months. INDOLES estimates by the number of integrations, and the store does not have to open all at once — the critical flow can go live first.",
      },
    },
    {
      question: {
        tr: "Hangi durumda e-ticaret danışmanlığı yanlış tercih olur?",
        en: "When is e-commerce consulting the wrong choice?",
      },
      answer: {
        tr: "Depo ve sevkiyat tarafı henüz oturmadıysa yeni bir sistem sorunu büyütür; eksik stoğu ve gecikmeyi yalnızca daha hızlı görünür kılar. Reklam harcaması henüz başlamamışsa kanal kararı veriye değil hipoteze dayanır. Ürün ya da fiyat pazara oturmamışsa dönüşüm testi yanlış soruya doğru cevap verir; o durumda iş marka ve ürün tarafında başlar. Ürün fotoğrafı ve içerik hazır değilse mağaza kurulur, ama satış beklemek erken olur.",
        en: "If warehouse and dispatch are not yet in order, a new system makes the problem bigger — it simply surfaces missing stock and delays faster. If ad spend has not started yet, the channel decision rests on hypothesis rather than data. If the product or the price has not found its market, a conversion test answers the wrong question well; then the work starts on the brand and product side. If product photography and content are not ready, the store can be built, but expecting sales from it is early.",
      },
    },
  ],

  seo: {
    title: {
      tr: "E-ticaret danışmanlığı ve kurulumu",
      en: "E-commerce build and consulting",
    },
    description: {
      tr: "Stok, muhasebe ve kargo entegre çalışan e-ticaret danışmanlığı ve kurulumu. İKAS, Ticimax, Shopify veya özel geliştirme; bayi ve toptan sipariş akışı dahil.",
      en: "E-commerce consultancy and builds with stock, accounting and shipping integrated. Shopify, local platforms or custom code, plus dealer and wholesale flows.",
    },
    entities: {
      tr: [
        "INDOLES",
        "e-ticaret",
        "Shopify",
        "ERP",
        "stok",
        "bayi",
      ],
      en: [
        "INDOLES",
        "e-commerce",
        "Shopify",
        "ERP",
        "stock",
        "dealer",
      ],
    },
  },

  /**
   * Giriş paketleri dört eksenle eşleşir (2026-10-02): Büyüme Sprinti
   * reklam kanalı ve büyüme eksenini (kanal denetimi, bütçe dağılımı, A/B
   * test planı), Dijital Dönüşüm Teşhisi çalışma sistemi eksenini (sipariş
   * akışı, envanter, otomasyon ve araç seçimi) karşılar — ikisinin de
   * ticaret personası metni e-ticaret için yazılmış (`packages.ts`). SSS'teki
   * fiyat bandı (180-240 bin TL) bu ikisinden kurulur; `Service` şemasına iki
   * `Offer` akar.
   */
  relatedPackages: ["buyume-sprinti", "dijital-donusum-teshisi"],
  relatedServices: ["cro", "performans-pazarlama", "ozel-yazilim-ve-mobil"],

  // 2026-10-02: sayfa gerçekten değişti — dört eksenli danışmanlık
  // konumlandırması (Burak). Önceki dokunuş 2026-09-18: kanıt şeridi
  // MKComputer'dan SOYLU AVM'ye geçti (`cases.ts` künyesi; gerekçe
  // `docs/strateji/Indeks-Denetimi-2026-09-18.md`). `lastmod` ve
  // `WebPage.dateModified` buradan beslenir.
  updatedAt: "2026-10-02",
};
