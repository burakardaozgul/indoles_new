import type { ServiceContent } from "../types";

/**
 * Dönüşüm oranı optimizasyonu (CRO) — Growth.
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
  /**
   * H1 hedef kelimeyi taşır (Burak kararı, 2026-09-19).
   *
   * "dönüşüm oranı optimizasyonu" kümenin en güçlü tohum sorgusu — GSC'de
   * 192 gösterim, poz. 15 (`docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md`
   * §2 CRO kümesi). H1 şimdiye dek yalnız kısaltmayı ve kısa formu
   * ("dönüşüm optimizasyonu") taşıyordu; tam form yalnız lede ve `seo.title`
   * yüzeylerindeydi. Parantezdeki "CRO" hem "cro" sorgusunu hem kısaltmayı
   * korur, yani kazanç kayıpsız.
   *
   * "ajansı" H1'e GİRMEZ — yerleşim kuralı sürüyor; `seo.title` istisnası
   * yalnız title yüzeyinde geçerli (strateji v1.16, `keyword-coverage.test.ts`).
   */
  name: {
    tr: "Dönüşüm oranı optimizasyonu (CRO)",
    en: "Conversion rate optimisation (CRO)",
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

  /**
   * "CRO ajansı" ifadesi burada üçüncü taraf tanımı olarak geçer — kendimizi
   * adlandırmak için değil, o ajanstan beklenmesi gereken tek çıktıyı
   * adlandırmak için (yerleşim kuralı: `keyword-coverage.test.ts`). Kelime
   * daha önce yalnız kapanış SSS'inde yaşıyordu; tek yüzey sorguyu
   * taşımıyordu (Keyword-Onceliklendirme U-3).
   */
  lede: {
    tr: "Dönüşüm oranı optimizasyonu, siteye gelen mevcut ziyaretçiden daha fazla satış veya teklif talebi çıkarma işidir; bir CRO ajansından beklenecek tek şey de ölçülmüş bir artıştır. INDOLES yeni trafik satın almaz; halihazırda gelen insanların nerede vazgeçtiğini bulur ve o noktaları tek tek düzeltir.",
    en: "Conversion rate optimisation is the work of getting more sales or enquiries from the visitors you already have; a measured lift is the only thing worth expecting from a CRO agency. INDOLES does not buy new traffic; it finds where the people already arriving give up, and fixes those points one by one.",
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
          // "arttırma" varyanti burada; "artırma" varyanti SSS cevabinda.
          // GSC ikisine de gosterim veriyor (strateji §2 CRO satiri), ikisi
          // ayri cumlede duruyor — yan yana yazmak kelime doldurma olurdu.
          tr: "E-ticaret sitelerinde dönüşüm oranı arttırma çoğu zaman burada başlar: gereksiz alanlar, belirsiz hata mesajları ve zorunlu üyelik tek tek çıkarılır.",
          en: "On an e-commerce site conversion is often won here: unnecessary fields, vague error messages, forced sign-up and other completion blockers are listed one by one.",
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

  /**
   * SSS sırası anlam sırasıdır ve FAQPage şemasına aynen akar: kısaltmanın
   * ne olduğu, sonra kimden satın alındığı, sonra uygulama soruları.
   *
   * Karşı-konumlandırma sorusu 2026-09-18'de son sıradan ikinciye alındı —
   * "cro ajansı" sorgusunun hedef sayfası burasıdır ve on ikinci sıradaki bir
   * cevap ne sayfada ne şemada ilk üçe giriyordu (Rakip-Analizi §4: rakibin
   * gücü FAQ'ın kendisi değil, sorunun görünür yerde durması).
   */
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
      // Karsi-konumlandirma sorusu (strateji §2, Rakip-Analizi §1-2).
      // Ticari niteleyici kelime H1'e girmez; kendimizi adlandirmak icin
      // degil, ayristigimiz seyi adlandirmak icin kullanilir.
      question: {
        tr: "CRO ajansı ile dönüşüm optimizasyonu danışmanlığı arasındaki fark nedir?",
        en: "What is the difference between a CRO agency and conversion optimisation consulting?",
      },
      answer: {
        tr: "CRO ajansı çoğunlukla test kurar ve rapor teslim eder; dönüşüm optimizasyonu danışmanlığı kaybın nerede olduğunu bulup o noktanın düzeltilmesini üstlenir. INDOLES ikinci yolu izler: önce ölçüm altyapısı onarılır, sonra kayıp noktaları oturum kaydı ve ısı haritasıyla saptanır, her düzeltme A/B testiyle doğrulanır. Fark teslim edilen şeyde görünür — rapor değil, ölçülmüş bir dönüşüm artışı.",
        en: "A CRO agency typically sets up tests and delivers a report; conversion optimisation consulting takes on finding where the loss happens and fixing that point. INDOLES follows the second path: the measurement setup is repaired first, drop-off points are located through session recordings and heatmaps, and each fix is validated with an A/B test. The difference shows in what gets delivered — a measured conversion lift rather than a report.",
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
        tr: "Dönüşüm oranı artırma çalışmasında önceden rakam vermek dürüst olmaz; sonuç mevcut sorunların büyüklüğüne ve trafiğe bağlıdır. INDOLES bunun yerine her testi öncesi ve sonrası ölçümüyle raporlar: hangi değişiklik yüzde kaç fark yarattı, hangisi yaratmadı. Söz verilen şey rakam değil yöntemdir — ölçmeden iddia etmeyiz, kaybeden testi de saklamayız.",
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
    {
      question: {
        tr: "A/B testi nedir ve ne zaman kurulur?",
        en: "What is an A/B test and when do you run one?",
      },
      answer: {
        tr: "A/B testi, aynı sayfanın iki versiyonunu eşzamanlı yayınlayıp hangisinin daha çok dönüşüm getirdiğini ölçen yöntemdir. INDOLES her testi önce hipoteze çevirir — neyi, neden değiştiriyoruz, hangi sonucu bekliyoruz — sonra kurar. Test yeterli veri toplanana kadar çalışır; kazanan varyant yayına alınır, kaybeden kayda geçer.",
        en: "An A/B test publishes two versions of the same page at once and measures which one converts better. INDOLES turns every test into a hypothesis first — what are we changing, why, and what result do we expect — then builds it. The test runs until it has enough data; the winning variant goes live and the losing one is recorded.",
      },
    },
    {
      question: {
        tr: "Sepet terk oranını düşürmek bu hizmete dahil mi?",
        en: "Is reducing cart abandonment part of this service?",
      },
      answer: {
        tr: "Evet, sepet terk analizi ve checkout optimizasyonu kapsamın içinde. Form ve checkout denetiminde gereksiz alanlar, belirsiz hata mesajları ve zorunlu üyelik gibi tamamlamayı düşüren engeller tek tek çıkarılır. Trafiğin çoğu mobilden geliyorsa mobil akış ayrı ele alınır, çünkü dönüşümün kazanılacağı yer orasıdır.",
        en: "Yes — cart abandonment analysis and checkout optimisation sit inside the scope. The form and checkout audit lists completion blockers one by one: unnecessary fields, vague error messages, forced sign-up. If most traffic is mobile, the mobile flow is handled separately, because that is where conversion has to be won.",
      },
    },
    {
      question: {
        tr: "Isı haritası analizi neyi gösterir?",
        en: "What does heatmap analysis show?",
      },
      answer: {
        tr: "Isı haritası, ziyaretçinin sayfada nereye tıkladığını ve nereye kadar indiğini gösterir; analitik sayıların söylemediği davranışı ortaya koyar. INDOLES bunu gerçek ziyaretçi kayıtlarıyla birlikte okur, çünkü tek başına tıklama haritası niyeti açıklamaz. Çıkan bulgular vazgeçme noktaları listesine ve her noktanın tahmini kayıp payına dönüşür.",
        en: "A heatmap shows where visitors click and how far down the page they scroll — the behaviour that analytics numbers leave out. INDOLES reads it alongside real session recordings, because a click map on its own does not explain intent. The findings become the drop-off list and the estimated loss at each point.",
      },
    },
    {
      question: {
        tr: "Bizim ekibimizden kim, ne kadar zaman ayırır?",
        en: "Who from our side is involved, and how much of their time?",
      },
      answer: {
        tr: "Siteye ve ölçüm araçlarına erişim verebilecek bir teknik kişi ile karar alabilecek bir iş sahibi yeterli. Teknik kişi test kurulumu ve yayına alma adımlarında, iş sahibi hipotez sıralaması ve sonuç kararlarında devreye girer. Devir oturumunda test kurma, okuma ve karar verme düzeni iç ekibe aktarılır.",
        en: "One technical person who can grant access to the site and the measurement tools, plus one decision-maker on the business side. The technical person is needed at setup and release; the decision-maker joins hypothesis prioritisation and the result calls. At the handover session the in-house team learns to set up, read and decide on tests.",
      },
    },
    {
      question: {
        tr: "Hangi durumda dönüşüm optimizasyonu yanlış tercih olur?",
        en: "When is conversion optimisation the wrong choice?",
      },
      answer: {
        tr: "Site neredeyse hiç ziyaretçi almıyorsa sıra yanlış başlamış demektir; önce trafik gerekir ve o iş performans pazarlama hizmetinde. Sayfalar saniyelerce açılmıyorsa sorun ikna değil altyapıdır, hız çalışması teknoloji ve altyapı hizmetinde ele alınır. Ürün ya da fiyat pazara oturmamışsa test yanlış soruya doğru cevap verir.",
        en: "If the site barely gets visitors, the order is wrong — traffic comes first, and that sits with performance marketing. If pages take seconds to load, the problem is infrastructure rather than persuasion, and speed work belongs to technology and infrastructure. If the product or the price has not found its market, a test answers the wrong question well.",
      },
    },
    {
      question: {
        tr: "Çalışma bittiğinde ne kalıyor, testleri kim sürdürür?",
        en: "What is left when the work ends, and who keeps testing?",
      },
      answer: {
        tr: "Geriye çalışır hâlde bir A/B test kurulumu, doğrulanmış dönüşüm ölçümü, sıraya dizilmiş test listesi ve test takvimi şablonu kalır. Sonuç raporu hangi testin ne getirdiğini, hangisinin getirmediğini kayda geçirir. Devir oturumundan sonra döngüyü iç ekip yürütür; amaç tek seferlik iyileştirme değil, çalışan bir düzen bırakmak.",
        en: "You keep a working A/B testing setup, validated conversion measurement, a prioritised test backlog and a testing calendar template. The results report records which test delivered and which did not. After the handover session the in-house team runs the loop; the aim is a running routine, not a one-off improvement.",
      },
    },
  ],

  /**
   * Sayfa 2026-09-19'da gerçekten değişti: H1 (`name`) hedef kelimeyi taşımaya
   * başladı. Bir önceki dokunuş 2026-09-18'di (SSS sırası, lede, arama yüzeyi).
   * `lastmod` ve `WebPage.dateModified` buradan beslenir — tarih sayfaya
   * dokunulmadan ileri alınmaz (bkz. `types.ts`, denetim T-05).
   */
  updatedAt: "2026-09-19",

  seo: {
    /**
     * Hedef kelime ("cro ajansı") başlığa GİRER — bu sayfaya özel istisna
     * (Burak, 2026-09-18, "bu seferlik"; strateji v1.16).
     *
     * Genel kural değişmedi: `ajansı`/`firmaları` ailesi `name` ve `seo.title`
     * yüzeylerinde yasaklı (v1.4 karar 3, `keyword-coverage.test.ts`). İstisna
     * yalnız `cro` kaydının `seo.title`ı için açıldı; gerekçe iki tane:
     * kelime P0 müşteri kelimesi ve rakip eşiği Poligon Interactive'in
     * birebir "CRO Ajansı" taşıyan title'ı (`Rakip-Analizi-P0-SERP.md` §4).
     * H1 (`name`) bu kelimeyi ALMAZ — kendimizi sayfada "ajans" diye
     * adlandırmıyoruz. (H1 2026-09-19'da ayrı bir kararla değişti; taşıdığı
     * kelime "dönüşüm oranı optimizasyonu", "ajansı" değil.)
     */
    title: {
      tr: "CRO ajansı: dönüşüm oranı optimizasyonu",
      en: "CRO agency: conversion rate optimisation",
    },
    description: {
      tr: "Bir CRO ajansından beklenen tek şey ölçülmüş artıştır. Dönüşüm oranı optimizasyonunda sepet terk ve form vazgeçme noktaları ölçülür, A/B testiyle düzeltilir.",
      en: "The only thing worth expecting from a CRO agency is a measured lift. Cart and form drop-off is located on recordings, then fixed one by one with A/B testing.",
    },
    entities: {
      tr: [
        "INDOLES",
        "dönüşüm oranı optimizasyonu",
        "CRO ajansı",
        "A/B test",
        "checkout",
        "Google Analytics",
      ],
      en: [
        "INDOLES",
        "conversion rate optimisation",
        "CRO agency",
        "A/B test",
        "checkout",
        "Google Analytics",
      ],
    },
  },

  /**
   * Kanıt şeridinin iki vakası elle seçildi (Burak kararı, 2026-09-18).
   *
   * İkisi de künyesinde `cro` taşır, yani otomatik eşleme de ikisini bulurdu;
   * seçimin yaptığı iş sıralamayı ve üçüncü adayı belirlemek. GYMWOLVES
   * dönüşüm hunisinin yeniden kurulmasının rakamı (12× satış), OdorGo ise
   * tüketiciye satan bir e-ticaret markasında ciro metriğiyle duruyor —
   * ikisi birlikte CRO alıcısının iki sorusunu (oran ve ciro) karşılıyor.
   *
   * Künyede `cro` taşıyan üçüncü vaka MKComputer bilinçli olarak dışarıda:
   * anlatısı stok/fiyat senkronu ve sipariş otomasyonu, yani kanıtı CRO
   * kanıtı değil. Künye doğru (arayüz ve CRO işi yapıldı), kanıt anlatısı
   * bu sayfaya uymuyor.
   */
  featuredCaseSlugs: ["gymwolves-12-kat-satis", "odorgo-kategori-yaratma"],

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["performans-pazarlama", "e-ticaret", "ui-ux-tasarim"],
};
