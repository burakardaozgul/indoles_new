import type { ServiceContent } from "../types";

/**
 * E-ticaret — Growth.
 *
 * İki farklı alıcıya aynı anda konuşan zor hizmetlerden biri: sanayi
 * tarafında B2B tedarikçi portalı, ticaret tarafında tüketici storefront'u.
 * Orta ton (docs/03 §2c) her iki kurulumu da kapsayan kelimelerle yazıldı;
 * somut örnekler ikisinden de veriliyor.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const eTicaret: ServiceContent = {
  slug: { tr: "e-ticaret", en: "e-commerce" },
  pillar: "growth",
  name: { tr: "E-ticaret", en: "E-commerce" },

  shortDescription: {
    industrial: {
      tr: "B2B e-ihracat platformu, tedarikçi portalı veya distribütör ağı. ERP entegrasyonu ve toplu sipariş akışı dahil — kurumsal satın almaya hazır sistem.",
      en: "B2B e-export platform, supplier portal or distributor network. ERP integration and bulk order flow included — system ready for corporate procurement.",
    },
    commerce: {
      tr: "Shopify, headless veya custom storefront — dönüşüm odaklı kurulum. Ödeme, lojistik ve envanter entegrasyonu büyüme için ölçeklenebilir şekilde yapılandırılır.",
      en: "Shopify, headless or custom storefront — conversion-led setup. Payment, logistics and inventory integration structured to scale with growth.",
    },
  },

  lede: {
    tr: "E-ticaret, ürünü internete koymaktan ibaret değil; siparişin ödemeden sevkiyata kadar kendi kendine akmasıdır. INDOLES mağazayı satış tarafıyla değil, arkadaki stok ve muhasebe düzeniyle birlikte kurar.",
    en: "E-commerce is not putting products online; it is an order flowing on its own from payment through to dispatch. INDOLES builds the store together with the stock and accounting behind it, not just the sales front.",
  },

  signals: {
    tr: [
      "Siparişler geliyor ama stok, fatura ve kargo hâlâ elle takip ediliyor.",
      "Mevcut altyapı ürün sayısı veya kampanya yoğunluğu artınca tıkanıyor.",
      "Bayi ve toptan müşteri hâlâ telefon ve e-posta ile sipariş veriyor.",
    ],
    en: [
      "Orders come in but stock, invoicing and shipping are still tracked by hand.",
      "The current setup jams when product count or campaign volume rises.",
      "Dealers and wholesale buyers still order by phone and email.",
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
    includes: [
      {
        title: { tr: "Altyapı seçimi", en: "Platform selection" },
        description: {
          tr: "Shopify, hazır altyapı veya özel geliştirme — ürün sayısı, sipariş hacmi ve entegrasyon ihtiyacına göre gerekçeli seçim.",
          en: "Shopify, an off-the-shelf platform or custom build — chosen with reasoning based on catalogue size, order volume and integration needs.",
        },
      },
      {
        title: { tr: "Mağaza kurulumu", en: "Store setup" },
        description: {
          tr: "Kategori yapısı, ürün sayfaları ve arama. Müşterinin aradığını üç tıkta bulmasını hedefleyen kurulum.",
          en: "Category structure, product pages and search — set up so a customer finds what they want in three clicks.",
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
        title: { tr: "Stok ve ERP bağlantısı", en: "Stock and ERP integration" },
        description: {
          tr: "Sipariş düşünce stok otomatik iner, muhasebeye tek kayıt gider. Elle giriş ve iki sistem arasında tutarsızlık biter.",
          en: "Stock drops automatically on order and a single record reaches accounting. Manual entry and mismatch between two systems end.",
        },
      },
      {
        title: { tr: "Kargo ve lojistik", en: "Shipping and logistics" },
        description: {
          tr: "Kargo firmalarıyla entegrasyon, otomatik gönderi oluşturma ve müşteriye takip bilgisinin kendiliğinden gitmesi.",
          en: "Carrier integration, automatic shipment creation and tracking information reaching the customer on its own.",
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
    ],
    excludes: {
      tr: [
        "Reklam yönetimi ve trafik satın alma — performans pazarlama hizmetinde",
        "Depo operasyonu ve fiziksel lojistik yönetimi",
        "Ürün fotoğrafı, video ve içerik prodüksiyonu",
        "Pazaryeri hesap yönetimi ve günlük ürün girişi",
      ],
      en: [
        "Ad management and buying traffic — covered by performance marketing",
        "Warehouse operations and physical logistics management",
        "Product photography, video and content production",
        "Marketplace account management and daily product entry",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Akış haritası", en: "Flow mapping" },
      description: {
        tr: "Siparişin girişten teslimata kadar geçtiği her adım çıkarılır. Elle yapılan işler ve kopma noktaları işaretlenir.",
        en: "Every step an order passes through, from entry to delivery, is mapped. Manual work and break points get marked.",
      },
      output: {
        tr: "Mevcut sipariş akışı şeması ve elle yapılan işlerin listesi.",
        en: "A map of the current order flow and a list of the manual steps.",
      },
    },
    {
      step: "02",
      title: { tr: "Altyapı kararı", en: "Platform decision" },
      description: {
        tr: "Hazır altyapı mı özel geliştirme mi — maliyet, süre ve büyüme senaryosu karşılaştırılarak yazılı gerekçeyle seçilir.",
        en: "Off-the-shelf or custom — chosen with written reasoning, comparing cost, timeline and growth scenario.",
      },
      output: {
        tr: "Altyapı kararı, maliyet karşılaştırması ve kurulum planı.",
        en: "The platform decision, a cost comparison and the build plan.",
      },
    },
    {
      step: "03",
      title: { tr: "Kurulum ve entegrasyon", en: "Build and integration" },
      description: {
        tr: "Mağaza kurulur; ödeme, stok, muhasebe ve kargo bağlanır. Her entegrasyon gerçek siparişle test edilir.",
        en: "The store is built and payment, stock, accounting and shipping are connected. Each integration is tested with a real order.",
      },
      output: {
        tr: "Çalışan mağaza ve test edilmiş entegrasyonlar.",
        en: "A working store with tested integrations.",
      },
    },
    {
      step: "04",
      title: { tr: "Canlıya alma ve devir", en: "Go-live and handover" },
      description: {
        tr: "Yayına alınır, ilk siparişler izlenir. Ekip ürün ekleme, sipariş yönetme ve raporları okuma konusunda eğitilir.",
        en: "It goes live and the first orders are watched. The team is trained to add products, manage orders and read reports.",
      },
      output: {
        tr: "Canlı mağaza, kullanım kılavuzu ve eğitilmiş iç ekip.",
        en: "A live store, a usage guide and a trained in-house team.",
      },
    },
  ],

  deliverables: [
    {
      kind: "system",
      title: { tr: "Çalışan mağaza", en: "Working store" },
      description: {
        tr: "Ürün, kategori ve arama kurulu; sipariş alacak durumda canlıda.",
        en: "Products, categories and search in place, live and taking orders.",
      },
    },
    {
      kind: "system",
      title: { tr: "Ödeme ve fatura bağlantısı", en: "Payment and invoicing" },
      description: {
        tr: "Sanal POS, taksit seçenekleri ve e-fatura entegrasyonu çalışır hâlde.",
        en: "Card payment, instalment options and e-invoice integration running.",
      },
    },
    {
      kind: "system",
      title: { tr: "Stok ve muhasebe entegrasyonu", en: "Stock and accounting sync" },
      description: {
        tr: "Sipariş düştüğünde stok ve muhasebe kaydı otomatik güncellenir.",
        en: "Stock and accounting records update automatically when an order lands.",
      },
    },
    {
      kind: "system",
      title: { tr: "Kargo entegrasyonu", en: "Shipping integration" },
      description: {
        tr: "Otomatik gönderi oluşturma ve müşteriye giden takip bildirimi.",
        en: "Automatic shipment creation and tracking notifications to customers.",
      },
    },
    {
      kind: "document",
      title: { tr: "Sipariş akışı şeması", en: "Order flow map" },
      description: {
        tr: "Siparişin girişten teslime kadar izlediği yol, sorumlusuyla birlikte.",
        en: "The path an order takes from entry to delivery, with owners marked.",
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

  faq: [
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
        tr: "Bayilerimize özel fiyat gösterebilir miyiz?",
        en: "Can we show dealer-specific pricing?",
      },
      answer: {
        tr: "Bayiye özel fiyat listesi, toplu sipariş ekranı ve cari hesap görünürlüğü bu hizmetin kapsamındadır. Her bayi giriş yaptığında kendi fiyatını ve limitini görür; toptan sipariş telefondan siteye taşınır. Kurulum sonrası satış ekibi sipariş almak yerine ilişki yönetmeye vakit ayırır, sipariş hataları da belirgin şekilde azalır.",
        en: "Dealer-specific price lists, bulk order screens and account visibility are part of this service. Each dealer sees their own pricing and limit on login, and wholesale ordering moves from phone to site. After setup the sales team spends its time on relationships rather than order-taking, and order errors drop noticeably.",
      },
    },
    {
      question: {
        tr: "Kurulum ne kadar sürer?",
        en: "How long does the build take?",
      },
      answer: {
        tr: "Hazır altyapı üzerine standart bir mağaza kurulumu genellikle altı ila sekiz hafta sürer; ERP entegrasyonu ve bayi akışı eklendiğinde süre üç aya kadar çıkabilir. INDOLES süreyi entegrasyon sayısına göre tahmin eder ve akış haritası aşamasından sonra netleştirir. Mağaza tek seferde açılmak zorunda değildir; kritik akış önce yayına alınabilir.",
        en: "A standard store on an off-the-shelf platform usually takes six to eight weeks; adding ERP integration and dealer flows can extend that to three months. INDOLES estimates by the number of integrations and firms up the figure after flow mapping. The store does not have to open all at once — the critical flow can go live first.",
      },
    },
    {
      question: {
        tr: "Sistem bizim adımıza mı kayıtlı olur?",
        en: "Will the system be registered to us?",
      },
      answer: {
        tr: "Altyapı hesapları, alan adı ve özel geliştirme yapıldıysa kaynak kod baştan firmanın adına kayıtlıdır. INDOLES bu hesaplara yalnızca yönetici erişimiyle bağlanır ve çalışma bittiğinde erişim kaldırılır; veriler, sipariş geçmişi ve müşteri listesi sizde kalır. Sistemin ajans adına açıldığı düzenler ayrılma maliyetini yükselttiği ve firmayı bağımlı bıraktığı için hiç kurulmaz.",
        en: "Platform accounts, the domain and — where custom development happened — the source code are registered to the company. INDOLES connects with administrator access and that access is removed when the work ends. Arrangements where the system sits in the agency's name raise the cost of leaving and create dependency, so they are never set up.",
      },
    },
    {
      question: {
        tr: "Trendyol ve benzeri pazaryerleri kapsama giriyor mu?",
        en: "Are marketplaces like Trendyol part of the scope?",
      },
      answer: {
        tr: "Pazaryeri hesap yönetimi ve günlük ürün girişi bu hizmetin kapsamı dışında. Kapsam kendi mağazanızın kurulumu ve arkasındaki stok, muhasebe ve kargo bağlantısı üzerine kurulu; sipariş nereden gelirse gelsin tek akışta işlensin diye önce bu düzen kurulur. Pazaryeri operasyonunu iç ekibiniz ya da bu işe bakan bir ajans yürütür.",
        en: "Marketplace account management and daily product entry sit outside this scope. The scope covers your own store and the stock, accounting and shipping links behind it; that order flow is built first so any order lands in one process, wherever it comes from. Marketplace operations stay with your in-house team or an agency that handles them.",
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
        tr: "E-ihracat ve distribütör ağı için ayrı bir kurulum gerekiyor mu?",
        en: "Does export selling or a distributor network need a separate build?",
      },
      answer: {
        tr: "Ayrı bir mağaza gerekmez; B2B tarafı aynı kurulumun içinde bayi akışı olarak çalışır. Distribütöre özel fiyat listesi, toplu sipariş ekranı ve cari hesap görünürlüğü kurulur, kurumsal alıcı için vadeli ödeme ve e-fatura bağlantısı eklenir. Böylece toptan sipariş telefondan ve e-postadan siteye taşınır, satış ekibi sipariş yazmak yerine ilişki yönetir.",
        en: "A separate store is not needed; the B2B side runs inside the same build as the dealer flow. Distributor-specific price lists, a bulk order screen and account balance visibility are set up, with deferred payment and e-invoicing added for corporate buyers. Wholesale ordering moves off the phone and out of email onto the site, and the sales team manages relationships instead of typing orders.",
      },
    },
    {
      question: {
        tr: "Sipariş geldiğinde stok ve muhasebe nasıl güncelleniyor?",
        en: "How do stock and accounting update when an order arrives?",
      },
      answer: {
        tr: "Sipariş düştüğü anda stok otomatik iner ve muhasebeye tek kayıt gider; aynı veriyi iki yere elle girmek biter. Bağlantı kurulduktan sonra kargo gönderisi de kendiliğinden oluşur ve takip bilgisi müşteriye gider. Her entegrasyon yayına alınmadan önce gerçek siparişle test edilir, çünkü kağıt üzerinde çalışan bağlantı canlıda çalışmayabilir.",
        en: "The moment an order lands, stock drops automatically and a single record goes to accounting; entering the same data twice by hand ends. Once the link is in place the shipment is created on its own and the tracking notice reaches the customer. Every integration is tested with a real order before go-live, because a link that works on paper can still fail in production.",
      },
    },
    {
      question: {
        tr: "Bizim ekibimizden kim, hangi aşamada katılır?",
        en: "Who from our side is involved, and at which stage?",
      },
      answer: {
        tr: "Akış haritası aşamasında siparişi bugün elle takip eden kişiler katılır; kopma noktalarını en iyi onlar bilir. Entegrasyon aşamasında muhasebe ya da ERP tarafından erişim verecek bir sorumlu gerekir. Canlıya alma sonrasında mağazayı işletecek ekip ürün ekleme, sipariş yönetimi ve rapor okuma eğitimine girer; oturum kayıt altına alınır.",
        en: "At the flow mapping stage, the people who track orders by hand today take part — they know the breakpoints best. At the integration stage you need someone who can grant access on the accounting or ERP side. After go-live, the team that will run the store is trained on adding products, managing orders and reading reports, and the session is recorded.",
      },
    },
    {
      question: {
        tr: "Hangi durumda e-ticaret kurulumu yanlış tercih olur?",
        en: "When is an e-commerce build the wrong choice?",
      },
      answer: {
        tr: "Depo ve sevkiyat tarafı henüz oturmadıysa mağaza kurmak sorunu büyütür; sistem eksik stoğu ve gecikmeyi hızlandırarak görünür kılar. Sorun sipariş akışında değil trafikte ise iş performans pazarlamada, gelen ziyaretçinin satın almamasında ise dönüşüm optimizasyonunda başlar. Ürün fotoğrafı ve içerik hazır değilse mağaza kurulur ama satış beklemek erken olur.",
        en: "If warehouse and dispatch are not yet in order, a store makes the problem bigger — the system simply surfaces missing stock and delays faster. If the issue is traffic rather than order flow, the work starts with performance marketing; if visitors arrive but do not buy, it starts with conversion optimisation. If product photography and content are not ready, the store can be built, but expecting sales from it is early.",
      },
    },
    {
      // Karsi-konumlandirma sorusu (strateji §2, Rakip-Analizi §1-2).
      // Ticari niteleyici kelime H1'e girmez; kendimizi adlandirmak icin
      // degil, ayristigimiz seyi adlandirmak icin kullanilir.
      question: {
        tr: "E-ticaret ajansı ile e-ticaret danışmanı arasındaki fark nedir?",
        en: "What is the difference between an e-commerce agency and an e-commerce consultant?",
      },
      answer: {
        tr: "E-ticaret ajansı genellikle mağazayı kurar ve reklamı yönetir; e-ticaret danışmanı hangi altyapının, hangi entegrasyonun ve hangi sıranın işe yarayacağına karar verir. INDOLES kurulumu da yapar ama kararı önce verir: stok, muhasebe ve kargo akışı çizilmeden platform seçilmez. Yanlış platform seçimi ilk yılda değil ikinci yılda pahalıya patlar, o yüzden sıralama tersine çevrilmez.",
        en: "An e-commerce agency usually builds the store and runs the ads; an e-commerce consultant decides which infrastructure, which integrations and which order will actually work. INDOLES does the build as well, but the decision comes first: no platform is chosen before the stock, accounting and shipping flows are drawn. A wrong platform choice costs in the second year rather than the first, so the sequence is never reversed.",
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

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["cro", "performans-pazarlama", "ozel-yazilim-ve-mobil"],
};
