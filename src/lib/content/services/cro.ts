import type { ServiceContent } from "../types";

/**
 * CRO — dönüşüm optimizasyonu — Growth.
 *
 * Slug iki dilde de `cro`: kısaltma her iki pazarda da arama hacmine sahip.
 * Sayfa metninde açık adı ("dönüşüm oranı optimizasyonu") ilk paragrafta
 * geçer — kısaltmayı bilmeyen alıcı da ne olduğunu anlar.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const cro: ServiceContent = {
  slug: { tr: "cro", en: "cro" },
  pillar: "growth",
  name: {
    tr: "CRO — dönüşüm optimizasyonu",
    en: "CRO — conversion optimization",
  },

  shortDescription: {
    industrial: {
      tr: "Kurumsal alıcı davranışı analizi, A/B testi, ısı haritası. Mevcut trafik içinden teklif ve fiyat talebi dönüşümünü artırır.",
      en: "Corporate buyer behaviour analysis, A/B testing, heatmaps. Increases quote and price request conversion from existing traffic.",
    },
    commerce: {
      tr: "Sepet terk analizi, checkout optimizasyonu, ürün sayfası A/B testi. Aynı trafik, daha yüksek dönüşüm oranı ve ortalama sipariş değeri.",
      en: "Cart abandonment analysis, checkout optimisation, product page A/B testing. Same traffic — higher conversion rate and average order value.",
    },
  },

  lede: {
    tr: "Dönüşüm oranı optimizasyonu, siteye gelen mevcut ziyaretçiden daha fazla satış veya teklif talebi çıkarma işidir. INDOLES yeni trafik satın almaz; halihazırda gelen insanların nerede vazgeçtiğini bulur ve o noktaları tek tek düzeltir.",
    en: "Conversion rate optimisation is the work of getting more sales or enquiries from the visitors you already have. INDOLES does not buy new traffic; it finds where the people already arriving give up, and fixes those points one by one.",
  },

  signals: {
    tr: [
      "Ziyaretçi sayısı iyi ama satış ya da teklif talebi buna göre gelmiyor.",
      "Sepete ekleyen veya formu açan çok, tamamlayan az.",
      "Reklam bütçesini artırmak dışında büyüme fikri kalmadı.",
    ],
    en: [
      "Visitor numbers look fine but sales or enquiries do not follow.",
      "Plenty of people add to cart or open the form; few finish.",
      "No growth idea is left except raising the ad budget.",
    ],
  },

  /**
   * E-ticaret altyapıları + ölçüm araçları. Ticimax ve İdeaSoft bilinçli
   * olarak listede: logoları `simple-icons`ta yok ve elle çizilmedikleri
   * için metin rozetiyle görünüyorlar (bkz. `platform-icons.tsx`). Marka
   * dosyaları geldiğinde yalnız kayıt güncellenecek.
   */
  platforms: [
    "İKAS",
    "Ticimax",
    "İdeaSoft",
    "Shopify",
    "WooCommerce",
    "WordPress",
    "Google Analytics",
    "Google Tag Manager",
    "Hotjar",
    "Microsoft Clarity",
  ],

  scope: {
    includes: [
      {
        title: { tr: "Vazgeçme noktası analizi", en: "Drop-off analysis" },
        description: {
          tr: "Ziyaretçinin hangi adımda ve hangi oranda vazgeçtiği ölçülür; en çok kaybın olduğu üç nokta önceliklendirilir.",
          en: "Where and at what rate visitors give up is measured; the three points losing the most are prioritised.",
        },
      },
      {
        title: { tr: "Kayıt ve ısı haritası izleme", en: "Session and heatmap review" },
        description: {
          tr: "Gerçek ziyaretçi kayıtları ve tıklama haritaları izlenir. Sayıların söylemediğini davranış söyler.",
          en: "Real session recordings and click maps are reviewed. Behaviour tells what the numbers cannot.",
        },
      },
      {
        title: { tr: "Form ve checkout denetimi", en: "Form and checkout audit" },
        description: {
          tr: "Gereksiz alanlar, belirsiz hata mesajları, zorunlu üyelik gibi tamamlamayı düşüren engeller tek tek çıkarılır.",
          en: "Unnecessary fields, vague error messages, forced sign-up and other completion blockers are listed one by one.",
        },
      },
      {
        title: { tr: "Test hipotezleri", en: "Test hypotheses" },
        description: {
          tr: "Her düzeltme fikri ölçülebilir bir hipoteze çevrilir: neyi, neden değiştiriyoruz, hangi sonucu bekliyoruz?",
          en: "Every fix idea becomes a measurable hypothesis: what are we changing, why, and what result do we expect?",
        },
      },
      {
        title: { tr: "A/B testlerinin yürütülmesi", en: "Running A/B tests" },
        description: {
          tr: "Testler kurulur, yeterli veri toplanana kadar bekletilir ve kazanan varyant yayına alınır. Erken karar verilmez.",
          en: "Tests are set up, held until enough data accrues, and the winning variant goes live. No early calls.",
        },
      },
      {
        title: { tr: "Mobil deneyim düzeltmeleri", en: "Mobile experience fixes" },
        description: {
          tr: "Trafiğin çoğu mobilden geliyorsa dönüşümün de orada kazanılması gerekir; mobil akış ayrı ele alınır.",
          en: "If most traffic is mobile, conversion has to be won there; the mobile flow is handled separately.",
        },
      },
      {
        title: { tr: "Ölçüm doğrulaması", en: "Measurement validation" },
        description: {
          tr: "Dönüşüm tanımları kontrol edilir. Yanlış kurulmuş bir ölçüm, test sonuçlarını olduğu gibi geçersiz kılar.",
          en: "Conversion definitions are checked. A wrongly configured measurement invalidates every test result outright.",
        },
      },
    ],
    excludes: {
      tr: [
        "Trafik satın alma ve reklam yönetimi — performans pazarlama hizmetinde",
        "Sıfırdan yeniden tasarım projesi — UI/UX tasarım hizmetinde",
        "Sunucu ve site hızı altyapı çalışması — teknoloji ve altyapı hizmetinde",
        "Ürün fotoğrafı ve içerik üretimi",
      ],
      en: [
        "Buying traffic and managing ads — covered by performance marketing",
        "A full redesign project — covered by the UI/UX design service",
        "Server and site speed infrastructure work — covered by technology and infrastructure",
        "Product photography and content production",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Kayıp noktalarının bulunması", en: "Finding the leaks" },
      description: {
        tr: "Analitik veri, ziyaretçi kayıtları ve ısı haritaları birlikte okunur. Ziyaretçinin nerede vazgeçtiği sayıyla ortaya konur.",
        en: "Analytics, session recordings and heatmaps are read together. Where visitors give up is established with numbers.",
      },
      output: {
        tr: "Vazgeçme noktaları listesi ve her birinin tahmini kayıp payı.",
        en: "A list of drop-off points with the estimated loss at each.",
      },
    },
    {
      step: "02",
      title: { tr: "Hipotez sıralaması", en: "Prioritising hypotheses" },
      description: {
        tr: "Fikirler beklenen etkiye ve uygulama zorluğuna göre sıralanır. Kolay ve etkili olan önce denenir.",
        en: "Ideas are ranked by expected impact and effort. The easy and effective ones get tried first.",
      },
      output: {
        tr: "Öncelik sırasına dizilmiş test listesi.",
        en: "A prioritised list of tests.",
      },
    },
    {
      step: "03",
      title: { tr: "Test ve ölçüm", en: "Test and measure" },
      description: {
        tr: "Her test yeterli veri toplanana kadar çalışır. Kazanan yayına alınır, kaybeden kayda geçer — ikisi de öğrenmedir.",
        en: "Each test runs until it has enough data. Winners go live, losers get recorded — both are learning.",
      },
      output: {
        tr: "Test sonuçları ve yayına alınan değişiklikler.",
        en: "Test results and the changes taken live.",
      },
    },
    {
      step: "04",
      title: { tr: "Düzenin kurulması", en: "Establishing the routine" },
      description: {
        tr: "Test etme alışkanlığı iç ekibe aktarılır. Amaç tek seferlik iyileştirme değil, sürekli çalışan bir döngü bırakmaktır.",
        en: "The testing habit moves to the in-house team. The aim is a running loop, not a one-off improvement.",
      },
      output: {
        tr: "Test takvimi şablonu ve ekibe devredilmiş işleyiş.",
        en: "A testing calendar template and the routine handed over.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Kayıp analizi raporu", en: "Drop-off analysis report" },
      description: {
        tr: "Ziyaretçinin nerede vazgeçtiği, hangi adımda ne kadar kayıp olduğu.",
        en: "Where visitors give up and how much is lost at each step.",
      },
    },
    {
      kind: "document",
      title: { tr: "Test listesi", en: "Test backlog" },
      description: {
        tr: "Sıraya dizilmiş hipotezler; her biri beklenen etki ve efor notuyla.",
        en: "Prioritised hypotheses, each with expected impact and effort noted.",
      },
    },
    {
      kind: "system",
      title: { tr: "Test kurulumu", en: "Testing setup" },
      description: {
        tr: "A/B test aracı ve doğrulanmış dönüşüm ölçümü, çalışır hâlde.",
        en: "A/B testing tool and validated conversion measurement, up and running.",
      },
    },
    {
      kind: "system",
      title: { tr: "Yayına alınan düzeltmeler", en: "Shipped fixes" },
      description: {
        tr: "Testi kazanan değişiklikler canlıda; her biri sonuç kaydıyla birlikte.",
        en: "Winning changes live on site, each with its result on record.",
      },
    },
    {
      kind: "document",
      title: { tr: "Sonuç raporu", en: "Results report" },
      description: {
        tr: "Hangi test ne getirdi, hangisi getirmedi — öğrenilenlerle birlikte.",
        en: "Which test delivered, which did not — with what was learned.",
      },
    },
    {
      kind: "training",
      title: { tr: "Devir oturumu", en: "Handover session" },
      description: {
        tr: "İç ekibe test kurma, okuma ve karar verme düzeni öğretilir.",
        en: "The in-house team learns to set up, read and decide on tests.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "CRO ne demek?",
        en: "What does CRO mean?",
      },
      answer: {
        tr: "CRO, dönüşüm oranı optimizasyonunun kısaltmasıdır ve siteye gelen ziyaretçilerin daha büyük bölümünün satın alması ya da teklif istemesi için yapılan çalışmayı anlatır. INDOLES bu işte yeni ziyaretçi getirmez; mevcut ziyaretçinin hangi adımda vazgeçtiğini ölçer ve o adımı düzeltir. Trafik aynı kalırken satış artar.",
        en: "CRO stands for conversion rate optimisation and describes the work of getting a larger share of existing visitors to buy or enquire. In this service INDOLES does not bring new visitors; it measures which step people abandon and fixes that step. Traffic stays the same while sales go up.",
      },
    },
    {
      question: {
        tr: "Ne kadar trafiğimiz olmalı?",
        en: "How much traffic do we need?",
      },
      answer: {
        tr: "A/B testinin güvenilir sonuç vermesi için genellikle ayda birkaç bin ziyaretçi ve düzenli dönüşüm gerekir. Trafiği bunun altındaki sitelerde INDOLES test yerine doğrudan denetim yolunu izler: form, checkout ve mobil akıştaki bariz engeller ölçüm beklemeden düzeltilir. Yöntem trafiğe göre seçilir, her müşteriye aynı reçete uygulanmaz.",
        en: "For an A/B test to give a reliable answer you usually need a few thousand visitors a month and steady conversions. On sites below that, INDOLES takes the audit route instead of testing: obvious blockers in forms, checkout and the mobile flow get fixed without waiting for data. Method follows traffic; the same prescription is not applied to everyone.",
      },
    },
    {
      question: {
        tr: "Test sonuçları ne kadar sürede çıkar?",
        en: "How long do test results take?",
      },
      answer: {
        tr: "Tek bir A/B testi güvenilir sonuç için genellikle iki ila dört hafta çalışır; süre trafiğe ve mevcut dönüşüm oranına bağlıdır. Erken bakılan test yanıltır, çünkü küçük veri kümesinde rastlantı gerçek fark gibi görünür. INDOLES her test için gereken süreyi ve karar eşiğini baştan yazar, sonuçtan önce yorum yapmaz.",
        en: "A single A/B test usually runs two to four weeks to give a reliable answer, depending on traffic and current conversion rate. Reading a test early misleads, because in a small sample chance looks like a real difference. INDOLES writes down the required duration and decision threshold for each test up front and does not comment before the result.",
      },
    },
    {
      question: {
        tr: "Dönüşüm oranımız ne kadar artar?",
        en: "How much will our conversion rate improve?",
      },
      answer: {
        tr: "Dönüşüm artışı için önceden rakam vermek dürüst olmaz; sonuç mevcut sorunların büyüklüğüne ve trafiğe bağlıdır. INDOLES bunun yerine her testi öncesi ve sonrası ölçümüyle raporlar: hangi değişiklik yüzde kaç fark yarattı, hangisi yaratmadı. Söz verilen şey rakam değil yöntemdir — ölçmeden iddia etmeyiz, kaybeden testi de saklamayız.",
        en: "Quoting an improvement figure up front would not be honest; the result depends on how large the current problems are and on traffic. Instead, INDOLES reports every test with its before-and-after measurement: which change moved the number by how much, and which did not. What is promised is the method, not a figure — no claims without measurement, and losing tests are not hidden.",
      },
    },
    {
      question: {
        tr: "Sitemizi baştan tasarlamamız gerekir mi?",
        en: "Do we need to redesign the site?",
      },
      answer: {
        tr: "Dönüşüm optimizasyonu baştan tasarım gerektirmez ve çoğu durumda gerektirmemesi tercih edilir. Yeniden tasarım tek seferde çok şeyi değiştirdiği için neyin işe yaradığı ölçülemez hâle gelir. INDOLES mevcut site üzerinde adım adım ilerler; eğer analiz yapısal bir sorun gösterirse yeniden tasarım ayrı bir iş olarak, gerekçesiyle önerilir.",
        en: "Conversion optimisation does not require a redesign, and in most cases it is better that it does not. A redesign changes too much at once, which makes it impossible to measure what actually worked. INDOLES works step by step on the existing site; if the analysis does show a structural problem, a redesign is proposed separately, with its reasoning.",
      },
    },
  ],

  seo: {
    title: {
      tr: "CRO — dönüşüm oranı optimizasyonu",
      en: "CRO — conversion rate optimisation",
    },
    description: {
      tr: "Mevcut trafikten daha fazla satış çıkaran dönüşüm oranı optimizasyonu. Vazgeçme noktaları ölçülür, A/B testiyle tek tek düzeltilir.",
      en: "Conversion rate optimisation that gets more sales from existing traffic. Drop-off points measured, then fixed one by one with A/B testing.",
    },
    entities: {
      tr: [
        "INDOLES",
        "dönüşüm oranı optimizasyonu",
        "A/B test",
        "checkout",
        "Google Analytics",
      ],
      en: [
        "INDOLES",
        "conversion rate optimisation",
        "A/B test",
        "checkout",
        "Google Analytics",
      ],
    },
  },

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["performans-pazarlama", "e-ticaret", "ui-ux-tasarim"],
};
