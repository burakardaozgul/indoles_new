import type { CaseStudyContent } from "./types";

/**
 * Gerçek vaka çalışmaları (ADR-019).
 *
 * Kaynak: eski site portfolyosu (`indoles_eski/sayfalar/portfolyo__*`).
 * Eski anlatısal içerik, yeni yapılandırılmış şemaya (problem → yaklaşım →
 * sonuç + bağlamlı metrik) dönüştürülerek taşınır. Launch'taki 4 anonim vaka
 * Burak'ın 2026-08-20 kararıyla silindi; müşteri adları açık yazılır.
 *
 * İçerik dürüstlüğü (docs/04 §10): her metrik `context` alanıyla ölçüm
 * çerçevesini söyler. Kaynağı doğrulanamayan alanlar TODO(burak) taşır.
 *
 * Kalan 6 vaka (GYMWOLVES, MKComputer, İstanbul Ortez Protez, FYR, Feruza,
 * SIM) tasarım onayından sonra aynı şemayla eklenecek.
 */
export const CASES: CaseStudyContent[] = [
  {
    slug: "soylu-avm-e-ticaret-buyume",
    clientName: { tr: "SOYLU AVM", en: "SOYLU AVM" },
    clientSector: { tr: "E-ticaret ve perakende", en: "E-commerce & retail" },
    problemType: "customer_acquisition",
    pillar: "growth",
    period: { tr: "Mayıs – Temmuz 2024", en: "May – July 2024" },
    clientLogo: "/work/soylu-avm/logo.png",
    services: {
      tr: [
        "Veri ve ölçüm altyapısı",
        "Performans pazarlama",
        "İçerik pazarlaması",
        "Kampanya yönetimi",
      ],
      en: [
        "Data & measurement infrastructure",
        "Performance marketing",
        "Content marketing",
        "Campaign management",
      ],
    },
    title: {
      tr: "E-ticarette 6 günde 1,5 milyon dolar gelir.",
      en: "$1.5M revenue in 6 days, e-commerce.",
    },
    lead: {
      tr: "SOYLU AVM'nin trafiği ölçülemiyordu ve satış tek kategoriye sıkışmıştı. Önce ölçüm altyapısını yeniden kurduk, sonra kampanyayı açtık. İlk 6 günde 1,5 milyon dolar gelir kaydettik.",
      en: "SOYLU AVM couldn't measure its traffic, and sales were stuck in a single category. We rebuilt the measurement stack first, then launched the campaign. The first 6 days recorded $1.5M in revenue.",
    },
    challenge: {
      tr: [
        "Piksel kurulumları eksikti; trafiğin kaynağı ve dönüşümün yolu izlenemiyordu.",
        "ROI raporları yanıltıcıydı; reklam bütçesi hangi ürünün sattığını göstermeden harcanıyordu.",
        "Satış tek ürün kategorisinde yoğunlaşmıştı; mevsimsel talep stokta karşılıksız bekliyordu.",
      ],
      en: [
        "Pixel setups were incomplete; neither traffic sources nor conversion paths could be tracked.",
        "ROI reports were misleading; ad budget was spent without knowing which product sold.",
        "Sales were concentrated in one product category; seasonal demand sat unanswered in stock.",
      ],
    },
    approach: {
      tr: [
        "Tüm piksel ve dönüşüm izleme sıfırdan kuruldu; trafik kaynakları segmentlere ayrıldı.",
        "Reklam metinleri yeniden yazıldı; mevsimsel talebi izleyen AI destekli reklam setleri devreye alındı.",
        "İçerik pazarlamasıyla organik kanal büyütüldü; kampanya planı kategori çeşitlendirmesine bağlandı.",
      ],
      en: [
        "All pixel and conversion tracking rebuilt from scratch; traffic sources segmented.",
        "Ad copy rewritten; AI-assisted ad sets tracking seasonal demand went live.",
        "Organic channel grown through content marketing; the campaign plan tied to category diversification.",
      ],
    },
    outcome: {
      tr: [
        "Kampanyanın 6. gününde toplam gelir 1,5 milyon dolara ulaştı.",
        "İlk 30 günün sonunda reklam harcamasının getirisi yaklaşık 1:1000 olarak ölçüldü.",
        "Toplam trafik %150, organik trafik %70 arttı; stok fazlası ürünler kategori kampanyalarıyla satıldı.",
      ],
      en: [
        "Total revenue reached $1.5M on day 6 of the campaign.",
        "Return on ad spend measured at roughly 1:1000 after the first 30 days.",
        "Total traffic grew 150%, organic traffic 70%; overstocked products sold through category campaigns.",
      ],
    },
    approachFlow: {
      tr: ["Ölçüm altyapısı", "Segmentasyon", "Kampanya", "Kategori çeşitlendirme"],
      en: ["Measurement stack", "Segmentation", "Campaign", "Category diversification"],
    },
    approachFlowIcons: ["measure", "segment", "broadcast", "grid"],
    metrics: [
      {
        value: "1,5M $",
        label: { tr: "Gelir", en: "Revenue" },
        context: {
          tr: "Kampanyanın ilk 6 günü",
          en: "First 6 days of the campaign",
        },
      },
      {
        value: "~1:1000",
        label: { tr: "Reklam getirisi", en: "Return on ad spend" },
        context: {
          tr: "İlk 30 gün, reklam harcaması bazında",
          en: "First 30 days, on ad spend basis",
        },
      },
      {
        value: "+%150",
        label: { tr: "Toplam trafik", en: "Total traffic" },
        context: {
          tr: "Organik + ücretli, segmentasyon sonrası",
          en: "Organic + paid, after segmentation",
        },
      },
      {
        value: "+%70",
        label: { tr: "Organik trafik", en: "Organic traffic" },
        context: {
          tr: "İçerik pazarlaması programıyla",
          en: "Through the content marketing program",
        },
      },
    ],
    durationWeeks: 10,
    cover: {
      type: "image",
      src: "/work/soylu-avm/mobil-vitrin.jpg",
      width: 2048,
      height: 2560,
      alt: {
        tr: "SOYLU AVM mobil vitrini bir telefon ekranında — kampanya sayfası",
        en: "SOYLU AVM mobile storefront on a phone screen — campaign page",
      },
    },
    heroMedia: {
      type: "image",
      src: "/work/soylu-avm/vitrin.jpg",
      width: 2400,
      height: 1368,
      alt: {
        tr: "SOYLU AVM e-ticaret vitrini — kampanya odaklı ana sayfa tasarımı",
        en: "SOYLU AVM e-commerce storefront — campaign-led homepage design",
      },
      caption: {
        tr: "Masaüstü vitrin — kampanya ve kategori odaklı ana sayfa",
        en: "Desktop storefront — campaign and category-led homepage",
      },
    },
  },
  {
    slug: "gymwolves-12-kat-satis",
    clientName: { tr: "GYMWOLVES", en: "GYMWOLVES" },
    clientSector: { tr: "Spor giyim e-ticareti", en: "Sportswear e-commerce" },
    problemType: "customer_acquisition",
    pillar: "growth",
    clientLogo: "/work/gymwolves/logo.png",
    services: {
      tr: [
        "Veri ve ölçüm altyapısı",
        "Performans pazarlama",
        "CRO ve arayüz iyileştirme",
        "İçerik ve influencer pazarlaması",
      ],
      en: [
        "Data & measurement infrastructure",
        "Performance marketing",
        "CRO & interface improvements",
        "Content & influencer marketing",
      ],
    },
    title: {
      tr: "Spor giyimde 3 ayda 12 kat satış.",
      en: "12× sales in 3 months, sportswear.",
    },
    lead: {
      tr: "GYMWOLVES'in hedefi 3 ayda satışı ikiye katlamaktı. Veri akışını onardık, dönüşüm hunisini yeniden kurduk, kampanyayı sporcularla çekilen sosyal kanıtla besledik. Üçüncü ayın sonunda satış 12 katına çıktı.",
      en: "GYMWOLVES aimed to double sales in 3 months. We repaired the data flow, rebuilt the conversion funnel and fed the campaign with athlete-shot social proof. By the end of month three, sales were up 12×.",
    },
    challenge: {
      tr: [
        "Piksel ve veri akışı hatalıydı; reklam kararları eksik veriyle alınıyordu.",
        "Ürün sayfalarındaki arayüz ve deneyim hataları dönüşümü aşağı çekiyordu.",
        "Segmentasyon ve yeniden hedefleme yoktu; marka küresel rakipleriyle karıştırılıyordu.",
      ],
      en: [
        "Pixels and data flow were broken; ad decisions ran on incomplete data.",
        "UI and UX flaws on product pages dragged conversion down.",
        "No segmentation or retargeting; the brand was confused with global competitors.",
      ],
    },
    approach: {
      tr: [
        "Yazılım altyapısı ve piksel kurulumu yenilendi; veri akışı uçtan uca doğrulandı.",
        "Hedef kitle segmentlere ayrıldı; düşük performanslı reklam setleri kapatılıp bütçe kazananlara kaydırıldı; yeniden hedeflemeyle çapraz ve üst satış kuruldu.",
        "SEO ve AI destekli dinamik reklamlarla tıklama maliyeti düşürüldü; sporcular ve influencer'larla video odaklı sosyal kanıt üretildi.",
      ],
      en: [
        "Software stack and pixel setup rebuilt; data flow verified end to end.",
        "Audience segmented; underperforming ad sets closed and budget shifted to winners; retargeting set up for cross- and upsell.",
        "Cost per click reduced with SEO and AI-assisted dynamic ads; video-led social proof produced with athletes and influencers.",
      ],
    },
    approachFlow: {
      tr: ["Ölçüm altyapısı", "Segmentasyon", "Kampanya optimizasyonu", "Sosyal kanıt"],
      en: ["Measurement stack", "Segmentation", "Campaign optimization", "Social proof"],
    },
    approachFlowIcons: ["measure", "segment", "broadcast", "content"],
    outcome: {
      tr: [
        "Hedef 2 kattı; üçüncü ayın sonunda satış 12 katına çıktı.",
        "Oturum süresi 3, etkileşim 8 katına yükseldi.",
        "Marka kimliği küresel rakiplerden ayrıştı; müşteri yeni fiziksel mağaza yerine çevrimiçi perakendeye yatırım kararı aldı.",
      ],
      en: [
        "The target was 2×; by the end of month three sales were up 12×.",
        "Session duration tripled; engagement rose 8×.",
        "The brand identity separated from global competitors; the client chose to invest in online retail over a new physical store.",
      ],
    },
    metrics: [
      {
        value: "12×",
        label: { tr: "Satış", en: "Sales" },
        context: {
          tr: "3 ayda; e-ticaret satış ve gelir verisi bazında",
          en: "In 3 months; on e-commerce sales and revenue data",
        },
      },
      {
        value: "8×",
        label: { tr: "Etkileşim", en: "Engagement" },
        context: { tr: "Hedef 2 kattı", en: "The target was 2×" },
      },
      {
        value: "3×",
        label: { tr: "Oturum süresi", en: "Session duration" },
        context: {
          tr: "Ürün sayfası iyileştirmeleri sonrası",
          en: "After product page improvements",
        },
      },
    ],
    durationWeeks: 12,
    cover: {
      type: "image",
      src: "/work/gymwolves/kampanya-kapak.jpg",
      width: 1190,
      height: 1487,
      alt: {
        tr: "GYMWOLVES kampanya kapağı — logolu görsel, atlet pistte",
        en: "GYMWOLVES campaign cover — logo visual, athlete on track",
      },
    },
    media: [
      {
        type: "image",
        src: "/work/gymwolves/pist-sicrama.jpg",
        width: 1284,
        height: 1284,
        alt: {
          tr: "GYMWOLVES kampanya çekimi — atlet mavi atletizm pistinde sıçrama anında",
          en: "GYMWOLVES campaign shoot — athlete mid-leap on a blue running track",
        },
        caption: {
          tr: "Kampanya ana görseli — atletizm serisi",
          en: "Main campaign visual — track series",
        },
      },
      {
        type: "image",
        src: "/work/gymwolves/tribun-kosu.jpg",
        width: 1284,
        height: 1284,
        alt: {
          tr: "GYMWOLVES kampanya çekimi — sporcu tribün basamaklarında koşuyor",
          en: "GYMWOLVES campaign shoot — athlete running up stadium steps",
        },
        caption: {
          tr: "Sosyal kanıt içerikleri — sporcularla saha çekimi",
          en: "Social proof content — field shoot with athletes",
        },
      },
      {
        type: "image",
        src: "/work/gymwolves/salon.jpg",
        width: 1284,
        height: 1284,
        alt: {
          tr: "GYMWOLVES kampanya çekimi — sporcu salonda antrenman arasında",
          en: "GYMWOLVES campaign shoot — athlete between sets in the gym",
        },
        caption: {
          tr: "Yaşam tarzı çekimi — salon serisi",
          en: "Lifestyle shoot — gym series",
        },
      },
    ],
    // Alıntı Onur Keş tarafından onaylandı (2026-08-20).
    testimonial: {
      quote: {
        tr: "Hedefimiz üç ayda satışı ikiye katlamaktı. Raporları her hafta birlikte okuduk; üçüncü ayın sonunda 12 katı gördük.",
        en: "Our goal was to double sales in three months. We read the reports together every week; by the end of month three we saw twelve times.",
      },
      authorRole: {
        tr: "Onur Keş — Kurucu, GYMWOLVES",
        en: "Onur Keş — Founder, GYMWOLVES",
      },
    },
  },
  {
    slug: "mkcomputer-dropshipping-otomasyonu",
    clientName: { tr: "MKComputer", en: "MKComputer" },
    clientSector: {
      tr: "Teknoloji e-ticareti (Almanya)",
      en: "Technology e-commerce (Germany)",
    },
    problemType: "efficiency_loss",
    pillar: "build",
    clientLogo: "/work/mkcomputer/logo.png",
    services: {
      tr: [
        "Özel yazılım geliştirme",
        "E-ticaret altyapısı",
        "Sistem entegrasyonu",
        "Arayüz ve CRO",
      ],
      en: [
        "Custom software development",
        "E-commerce infrastructure",
        "Systems integration",
        "Interface & CRO",
      ],
    },
    title: {
      tr: "5 dakikada 200.000 ürün senkronu.",
      en: "200,000 products synced every 5 minutes.",
    },
    lead: {
      tr: "MKComputer, SYNAXON kataloğundaki 200.000'den fazla ürünü Avrupa'ya dropshipping ile satmak istiyordu; stok ve fiyat elle yönetilemezdi. Magento 2 üzerinde stok, fiyat ve tedarikçiyi 5 dakikada bir senkronlayan otomasyon platformunu kurduk.",
      en: "MKComputer wanted to dropship 200,000+ products from the SYNAXON catalog across Europe; stock and pricing couldn't be managed by hand. We built an automation platform on Magento 2 that syncs stock, price and supplier every 5 minutes.",
    },
    challenge: {
      tr: [
        "200.000 ürünün stok, fiyat ve tedarikçi bilgisi elle güncellenemeyecek hız ve hacimde değişiyordu.",
        "Sipariş yönlendirme manueldi; her sipariş için uygun tedarikçiyi bulmak zaman alıyordu.",
        "Yüz binlerce ürün içinde spesifikasyon bazlı arama (örneğin 8, 16 veya 32 GB RAM) mevcut altyapıyla yapılamıyordu.",
      ],
      en: [
        "Stock, price and supplier data for 200,000 products changed too fast and too broadly to update by hand.",
        "Order routing was manual; finding the right supplier for each order took time.",
        "Specification-based search (e.g. 8, 16 or 32 GB RAM) across hundreds of thousands of products wasn't possible on the existing stack.",
      ],
    },
    approach: {
      tr: [
        "SYNAXON'un XML veri akışı için özel Magento 2 modülü geliştirildi; SOAP, XML ve PHP ile uçtan uca veri hattı kuruldu.",
        "5 dakikalık senkron yükünü taşıyacak özel sunucu mimarisi yapılandırıldı; veritabanı ve ön yüz optimize edildi.",
        "Spesifikasyon bazlı akıllı filtreleme ve dönüşüm odaklı arayüz tasarlandı; her sipariş en uygun tedarikçiye otomatik yönlendirildi.",
      ],
      en: [
        "A custom Magento 2 module was built for SYNAXON's XML feed; an end-to-end data pipeline with SOAP, XML and PHP.",
        "A dedicated server architecture was configured to carry the 5-minute sync load; database and frontend optimized.",
        "Specification-based smart filtering and a conversion-focused interface were designed; each order routes automatically to the best supplier.",
      ],
    },
    approachFlow: {
      tr: ["Veri entegrasyonu", "Sunucu mimarisi", "Senkron otomasyonu", "Arayüz ve CRO"],
      en: ["Data integration", "Server architecture", "Sync automation", "Interface & CRO"],
    },
    approachFlowIcons: ["build", "server", "sync", "design"],
    outcome: {
      tr: [
        "200.000'den fazla ürünün stok, fiyat, tedarikçi, görsel ve açıklama bilgisi her 5 dakikada bir otomatik güncelleniyor.",
        "Siparişler insan müdahalesi olmadan tedarikçiye yönlendiriliyor; stok, depo ve lojistik maliyeti olmadan satış yapılıyor.",
        "Platform Avrupa genelinde canlı; ürün arama ve satın alma spesifikasyon filtreleriyle çalışıyor.",
      ],
      en: [
        "Stock, price, supplier, image and description data for 200,000+ products updates automatically every 5 minutes.",
        "Orders route to suppliers without human intervention; sales run with no stock, warehouse or logistics cost.",
        "The platform is live across Europe; search and purchase work on specification filters.",
      ],
    },
    metrics: [
      {
        value: "200.000+",
        label: { tr: "Senkronlanan ürün", en: "Products synced" },
        context: {
          tr: "Stok, fiyat, tedarikçi, görsel ve açıklama",
          en: "Stock, price, supplier, image and description",
        },
      },
      {
        value: "5 dk",
        label: { tr: "Güncelleme aralığı", en: "Update interval" },
        context: {
          tr: "Tam katalog, 7/24 otomatik",
          en: "Full catalog, automatic 24/7",
        },
      },
      {
        value: "0",
        label: { tr: "Manuel sipariş adımı", en: "Manual order steps" },
        context: {
          tr: "Sipariş en uygun tedarikçiye otomatik gider",
          en: "Orders route automatically to the best supplier",
        },
      },
    ],
    // TODO(burak): proje süresi doğrulanacak.
    durationWeeks: 16,
    cover: {
      type: "image",
      src: "/work/mkcomputer/kapak.jpg",
      width: 2048,
      height: 2560,
      alt: {
        tr: "MKComputer tanıtım görseli — telefonda mkcomputer.de mobil mağaza, masada dizüstü bilgisayar",
        en: "MKComputer promo visual — mkcomputer.de mobile store on a phone, laptop on desk",
      },
    },
    heroMedia: {
      type: "image",
      src: "/work/mkcomputer/vitrin.jpg",
      width: 1665,
      height: 1040,
      alt: {
        tr: "mkcomputer.de vitrini — marka bandı, kampanya alanı ve PC/notebook ürün listeleri",
        en: "mkcomputer.de storefront — brand strip, campaign area and PC/notebook product listings",
      },
      caption: {
        tr: "Masaüstü vitrin — spesifikasyon filtreli katalog ve kampanya alanları",
        en: "Desktop storefront — spec-filtered catalog and campaign areas",
      },
    },
  },
  {
    slug: "istanbul-ortez-protez-arama-gorunurlugu",
    clientName: { tr: "İstanbul Ortez Protez", en: "İstanbul Ortez Protez" },
    clientSector: {
      tr: "Tıbbi ürün ve sağlık",
      en: "Medical devices & healthcare",
    },
    problemType: "customer_acquisition",
    pillar: "growth",
    period: { tr: "Kasım 2024 – Şubat 2026", en: "November 2024 – February 2026" },
    clientLogo: "/work/istanbul-ortez-protez/logo.png",
    services: {
      tr: [
        "UI/UX tasarım ve web geliştirme",
        "Marka kimliği",
        "SEO ve GEO",
        "Google Ads",
      ],
      en: [
        "UI/UX design & web development",
        "Brand identity",
        "SEO & GEO",
        "Google Ads",
      ],
    },
    title: {
      tr: "Biyonik protezde ilk 3, ayda 10 yeni hasta.",
      en: "Top 3 for bionic prosthetics, 10 new patients a month.",
    },
    lead: {
      tr: "İstanbul Ortez Protez'in dijital varlığını sıfırdan kurduk: mobil öncelikli site, yenilenen marka kimliği, arama ve AI motorları için optimize içerik. 15 ayda öncelikli anahtar kelimelerde ilk 3'e çıktık; toplam 50'den fazla korse ve protez hastası kazandırdık.",
      en: "We rebuilt İstanbul Ortez Protez's digital presence from the ground up: a mobile-first site, a renewed brand identity, and content optimized for both search and AI engines. In 15 months we reached the top 3 for priority keywords and won more than 50 brace and prosthetics patients.",
    },
    challenge: {
      tr: [
        "Site ne mobilde ne aramada rekabet edebiliyordu; tıbbi alanda güven veren bir dijital kimlik yoktu.",
        "\"Biyonik protez\", \"skolyoz korsesi\" gibi yüksek niyetli aramalarda marka görünmüyordu.",
        "Hasta kazanımı tavsiyeye bağlıydı; ölçülebilir ve tekrarlanabilir bir kanal yoktu.",
      ],
      en: [
        "The site could compete neither on mobile nor in search; there was no digital identity that built trust in a medical field.",
        "The brand was invisible for high-intent searches like \"bionic prosthetics\" and \"scoliosis brace\".",
        "Patient acquisition depended on referrals; there was no measurable, repeatable channel.",
      ],
    },
    approach: {
      tr: [
        "Rakip ve anahtar kelime analiziyle başladık; büyük oyuncuların atladığı uzun kuyruklu fırsatları haritaladık.",
        "Mobil öncelikli, hız ve okunabilirlik odaklı bir arayüz tasarladık; marka kimliğini logodan basılı malzemeye yeniledik.",
        "İçeriği hem klasik SEO hem GEO için yazdık — soru-cevap yapısı, teknik derinlik ve AI motorlarının alıntılayabileceği kendine yeten pasajlar.",
        "Google Ads'te uzun kuyruklu hedefleme ile yüksek rekabetli kelimelerde manuel teklifi dengeledik.",
      ],
      en: [
        "We started with competitor and keyword analysis, mapping long-tail opportunities the big players had skipped.",
        "We designed a mobile-first interface built around speed and readability, and renewed the brand identity from logo to print.",
        "Content was written for classic SEO and GEO alike — Q&A structure, technical depth, and self-contained passages AI engines can cite.",
        "In Google Ads we balanced manual bidding on high-competition terms with long-tail targeting.",
      ],
    },
    approachFlow: {
      tr: ["Anahtar kelime analizi", "Mobil öncelikli tasarım", "SEO ve GEO içeriği", "Google Ads"],
      en: ["Keyword analysis", "Mobile-first design", "SEO & GEO content", "Google Ads"],
    },
    approachFlowIcons: ["search", "design", "content", "broadcast"],
    outcome: {
      tr: [
        "Biyonik protez başta olmak üzere öncelikli anahtar kelimelerde organik ilk 3 sıraya çıktık.",
        "Skolyoz korsesi gibi ticari niyetli kelimelerde Ads ile her ay ortalama 10 yeni hasta geldi.",
        "15 ay boyunca toplam 50'den fazla korse ve protez hastası kazandırdık.",
      ],
      en: [
        "We reached the organic top 3 for priority keywords, bionic prosthetics first among them.",
        "Ads on commercially intent terms like scoliosis brace brought an average of 10 new patients a month.",
        "Over 15 months we won more than 50 brace and prosthetics patients in total.",
      ],
    },
    metrics: [
      {
        value: "İlk 3",
        label: { tr: "Google sıralaması", en: "Google ranking" },
        context: {
          tr: "Biyonik protez ve öncelikli kelimeler, organik",
          en: "Bionic prosthetics and priority keywords, organic",
        },
      },
      {
        value: "10 / ay",
        label: { tr: "Yeni hasta", en: "New patients" },
        context: {
          tr: "Skolyoz korsesi gibi kelimelerde Google Ads ile",
          en: "Via Google Ads on terms like scoliosis brace",
        },
      },
      {
        value: "50+",
        label: { tr: "Toplam hasta", en: "Total patients" },
        context: {
          tr: "15 ayda; korse ve protez birlikte",
          en: "Over 15 months; braces and prosthetics combined",
        },
      },
    ],
    durationWeeks: 65,
    cover: {
      type: "image",
      src: "/work/istanbul-ortez-protez/kapak.jpg",
      width: 1920,
      height: 1080,
      alt: {
        tr: "Yenilenen İstanbul Ortez Protez sitesi bir dizüstü bilgisayar ekranında, ev ortamında",
        en: "The redesigned İstanbul Ortez Protez site on a laptop screen at home",
      },
    },
    heroMedia: {
      type: "image",
      src: "/work/istanbul-ortez-protez/web-tasarim.jpg",
      width: 1920,
      height: 1080,
      alt: {
        tr: "İstanbul Ortez Protez web tasarımının sayfa dizilimi — ana sayfa, ürün bölümleri, sık sorulan sorular ve iletişim formu",
        en: "Page layout of the İstanbul Ortez Protez site — homepage, product sections, FAQ and contact form",
      },
      caption: {
        tr: "Mobil öncelikli arayüz — soru-cevap yapısı arama ve AI motorları için kuruldu",
        en: "Mobile-first interface — the Q&A structure was built for search and AI engines",
      },
    },
    media: [
      {
        type: "image",
        src: "/work/istanbul-ortez-protez/mobil.jpg",
        width: 1920,
        height: 1080,
        alt: {
          tr: "Sitenin mobil görünümü bir telefon ekranında — ürün ve hizmetler bölümü",
          en: "The site's mobile view on a phone screen — products and services section",
        },
        caption: {
          tr: "Mobil görünüm — trafiğin çoğunluğunun geldiği yüzey",
          en: "Mobile view — where most traffic lands",
        },
      },
      {
        type: "image",
        src: "/work/istanbul-ortez-protez/kimlik-tisort.jpg",
        width: 1920,
        height: 1080,
        alt: {
          tr: "Yenilenen İstanbul Ortez Protez logosu beyaz tişört üzerinde",
          en: "The renewed İstanbul Ortez Protez logo on a white t-shirt",
        },
        caption: {
          tr: "Marka kimliği — logo ve uygulama alanları",
          en: "Brand identity — logo and applications",
        },
      },
      {
        type: "image",
        src: "/work/istanbul-ortez-protez/urun-brosuru.jpg",
        width: 1810,
        height: 2560,
        alt: {
          tr: "3D korse tanıtım sayfası — üretim yaklaşımı, marka değerleri ve satış noktaları haritası",
          en: "3D brace brochure page — production approach, brand values and a map of sales points",
        },
        caption: {
          tr: "Ürün anlatımı — 3D korse üretiminin teknik hikayesi",
          en: "Product narrative — the technical story of 3D brace production",
        },
      },
    ],
    // Alıntı Sinan Uysal onayıyla yayınlanır (Burak, 2026-08-20).
    testimonial: {
      quote: {
        tr: "Hastalarımız artık bizi tavsiyeyle değil, arayarak buluyor. Biyonik protezde ilk sayfadayız ve her ay gelen yeni hasta sayısı düzenli.",
        en: "Our patients now find us by searching, not by referral. We're on the first page for bionic prosthetics, and the flow of new patients is steady every month.",
      },
      authorRole: {
        tr: "Sinan Uysal — Kurucu, İstanbul Ortez Protez",
        en: "Sinan Uysal — Founder, İstanbul Ortez Protez",
      },
    },
  },
  {
    slug: "fyr-luks-dekorasyon-lansmani",
    clientName: { tr: "FYR Luxury", en: "FYR Luxury" },
    clientSector: {
      tr: "Lüks ev dekorasyonu",
      en: "Luxury home decor",
    },
    problemType: "market_expansion",
    pillar: "growth",
    clientLogo: "/work/fyr/logo.png",
    services: {
      tr: [
        "Marka stratejisi ve konumlandırma",
        "UI/UX tasarım",
        "Fotoğraf ve video prodüksiyonu",
        "Performans pazarlama",
      ],
      en: [
        "Brand strategy & positioning",
        "UI/UX design",
        "Photo & video production",
        "Performance marketing",
      ],
    },
    title: {
      tr: "12 aylık hedef, 3 ayda 100.000 dolar.",
      en: "A 12-month target hit in 3 months: $100K.",
    },
    lead: {
      tr: "FYR lüks mum ve ateş objeleriyle sıfırdan pazara giriyordu; doygun bir kategoride üst segment alıcıya ulaşması gerekiyordu. Marka konumunu, arayüzü ve kreatif üretimi tek elden kurduk. 12 aylık ciro hedefini ilk 3 ayda geçtik.",
      en: "FYR was entering a saturated category from zero with luxury candles and fire objects, and had to reach a high-end buyer. We built the positioning, the interface and the creative production as one system. The 12-month revenue target was passed in the first 3 months.",
    },
    challenge: {
      tr: [
        "Marka sıfırdan başlıyordu: ne bilinirlik ne müşteri verisi ne de satış geçmişi vardı.",
        "Lüks ev dekorasyonu doygun bir kategori; üst segment alıcı fiyattan değil, algıdan satın alıyor.",
        "Ürün fotoğrafı ve arayüz kalitesi lüks algısının altında kalırsa fiyat konumlandırması çöker.",
      ],
      en: [
        "The brand started from zero: no awareness, no customer data, no sales history.",
        "Luxury home decor is a saturated category; high-end buyers purchase on perception, not price.",
        "If product photography and interface quality fall below the luxury standard, the price positioning collapses.",
      ],
    },
    approach: {
      tr: [
        "Markayı üst segmentte konumlandırdık; hedef kitlenin satın alma anını ve ritüelini tanımladık.",
        "Arayüzü lüks, minimal ve hızlı kurduk; satın alma akışını sadeleştiren yazılım geliştirmeleri ekledik.",
        "Ürün ve mekan çekimlerini sabit bir renk paletiyle planladık — her kare aynı marka dünyasını anlatıyor.",
        "Kampanyaları test-öğren döngüsüyle yürüttük; kazanan kreatif ve kitleye bütçeyi kaydırdık.",
      ],
      en: [
        "We positioned the brand at the high end and defined the target audience's purchase moment and ritual.",
        "The interface was built luxurious, minimal and fast, with software work that simplified the purchase flow.",
        "Product and interior shoots were planned around a fixed color palette — every frame tells the same brand world.",
        "Campaigns ran on a test-and-learn loop, shifting budget to the winning creative and audience.",
      ],
    },
    approachFlow: {
      tr: ["Marka konumlandırma", "Lüks arayüz", "Kreatif prodüksiyon", "Performans kampanyası"],
      en: ["Brand positioning", "Luxury interface", "Creative production", "Performance campaign"],
    },
    approachFlowIcons: ["search", "design", "content", "broadcast"],
    outcome: {
      tr: [
        "12 aylık ciro hedefi ilk 3 ayda aşıldı; ciro 100.000 doları geçti.",
        "Reklam harcamasının getirisi 20 katın üzerinde seyretti.",
        "4 aylık çalışmada 3.000'den fazla sipariş çıktı ve marka, hedef kitlesinin çevresinde konuşulur hale geldi.",
      ],
      en: [
        "The 12-month revenue target was passed in the first 3 months; revenue exceeded $100K.",
        "Return on ad spend held above 20×.",
        "Over 4 months the brand shipped more than 3,000 orders and became a name its audience heard from people they know.",
      ],
    },
    metrics: [
      {
        value: "100.000 $",
        label: { tr: "Ciro", en: "Revenue" },
        context: {
          tr: "İlk 3 ayda; 12 aylık hedefin tamamı",
          en: "In the first 3 months; the full 12-month target",
        },
      },
      {
        value: "20×",
        label: { tr: "ROAS", en: "ROAS" },
        context: {
          tr: "Üzerinde seyretti; lüks dekorasyon kategorisinde",
          en: "Held above; in the luxury decor category",
        },
      },
      {
        value: "3.000+",
        label: { tr: "Sipariş", en: "Orders" },
        context: {
          tr: "4 aylık çalışma boyunca",
          en: "Across the 4-month engagement",
        },
      },
    ],
    durationWeeks: 17,
    cover: {
      type: "image",
      src: "/work/fyr/kapak.jpg",
      width: 2048,
      height: 2560,
      alt: {
        tr: "FYR Luxury ürün çekimi — siyah seramik ateş kabında yanan alev, üstte fyr luxury logosu",
        en: "FYR Luxury product shot — flame burning in a black ceramic fire bowl with the fyr luxury logo above",
      },
    },
    media: [
      {
        type: "image",
        src: "/work/fyr/mekan.jpg",
        width: 2048,
        height: 2560,
        alt: {
          tr: "Spiral dokulu siyah ateş kabı ahşap konsolda yanıyor; arkada gümüş dekoratif objeler ve beyaz mumlar",
          en: "A ribbed black fire bowl burning on a wooden console; silver decorative objects and white candles behind",
        },
        caption: {
          tr: "Mekan çekimi — ürünün yaşadığı ortam",
          en: "Interior shoot — the setting the product lives in",
        },
      },
      {
        type: "image",
        src: "/work/fyr/mum.jpg",
        width: 2048,
        height: 2560,
        alt: {
          tr: "FYR Luxury kokulu mum, cam kapta ahşap fitille yanıyor; jüt dokuma üzerinde",
          en: "FYR Luxury scented candle burning with a wooden wick in a glass vessel on jute weave",
        },
        caption: {
          tr: "Ürün çekimi — sabit palet, doku ve ışık",
          en: "Product shoot — fixed palette, texture and light",
        },
      },
      {
        type: "image",
        src: "/work/fyr/vazo.jpg",
        width: 2000,
        height: 2500,
        alt: {
          tr: "Elde tutulan seramik vazo ve üzerinde ipe asılı FYR Luxury ürün etiketi",
          en: "A ceramic vase held in hand with the FYR Luxury product tag hanging from twine",
        },
        caption: {
          tr: "Ambalaj ve etiket — lüks algısının detayı",
          en: "Packaging and tag — the detail that carries the luxury read",
        },
      },
    ],
    // Alıntı Begüm Mina Özgül onayıyla yayınlanır (Burak, 2026-08-21).
    testimonial: {
      quote: {
        tr: "Markayı sıfırdan kurduk ve bir yıllık hedefimizi ilk sezonda geçtik. Artık müşterilerimiz bizi tanıdıklarından duyarak geliyor.",
        en: "We built the brand from zero and passed our full-year target in the first season. Now customers arrive because someone they know told them about us.",
      },
      authorRole: {
        tr: "Begüm Mina Özgül — Kurucu Ortak, FYR Luxury",
        en: "Begüm Mina Özgül — Co-founder, FYR Luxury",
      },
    },
  },
  {
    slug: "feruza-luks-perakende-anlasmasi",
    clientName: { tr: "Feruza Elegance", en: "Feruza Elegance" },
    clientSector: { tr: "Ayakkabı ve moda", en: "Footwear & fashion" },
    problemType: "market_expansion",
    pillar: "growth",
    clientLogo: "/work/feruza/logo.png",
    services: {
      tr: [
        "Marka konumlandırma",
        "Fotoğraf ve video prodüksiyonu",
        "Web tasarımı ve geliştirme",
        "Sosyal medya ve dijital pazarlama",
      ],
      en: [
        "Brand positioning",
        "Photo & video production",
        "Web design & development",
        "Social media & digital marketing",
      ],
    },
    title: {
      tr: "Klasik çizgiden lüks segmente, raflara giden yol.",
      en: "From classic to luxury — and onto the shelves.",
    },
    lead: {
      tr: "Feruza Elegance el yapımı ayakkabı üretiyordu ama klasik bir çizgide konumlanmıştı ve lüks perakendeye giremiyordu. Markayı modern-lüks bir çizgiye taşıdık, görsel dilini ve web varlığını yeniden kurduk. Süreç Türkiye'nin tanınmış butik perakende zincirlerinden biriyle imzalanan anlaşmayla sonuçlandı.",
      en: "Feruza Elegance made handcrafted footwear but sat in a classic positioning that kept it out of luxury retail. We moved the brand to a modern-luxury line and rebuilt its visual language and web presence. The work ended with a distribution agreement with one of Türkiye's best-known boutique retail chains.",
    },
    challenge: {
      tr: [
        "Marka klasik ve geleneksel bir çizgide konumlanmıştı; lüks demografi bu dili satın almıyordu.",
        "El yapımı üretim kalitesi görsel dile yansımıyordu; ürünün değeri fotoğrafta görünmüyordu.",
        "Perakende ortağı bulmak için markanın raf değerini kanıtlayan bir sunum yoktu.",
      ],
      en: [
        "The brand sat in a classic, traditional positioning; the luxury demographic wasn't buying that language.",
        "The quality of handcrafted production didn't carry into the visual language; the product's value wasn't visible in photography.",
        "There was no presentation proving the brand's shelf value to potential retail partners.",
      ],
    },
    approach: {
      tr: [
        "Pazar araştırmasıyla başladık; hedef kitlenin tüketim alışkanlıklarını ve lüks segmentin satın alma kodlarını çıkardık.",
        "Markayı klasik-geleneksel çizgiden modern-lüks çizgiye taşıdık; içerik stratejisini bu konuma bağladık.",
        "Kampanya ve ürün çekimlerini tek bir görsel dilde ürettik; ürünün el işçiliğini kadraja soktuk.",
        "Web sitesini satın alma güvenini önceleyecek şekilde tasarladık ve sosyal medya operasyonunu strateji doğrultusunda yürüttük.",
      ],
      en: [
        "We started with market research, mapping the audience's consumption habits and the purchase codes of the luxury segment.",
        "We moved the brand from a classic-traditional line to a modern-luxury one and tied the content strategy to that position.",
        "Campaign and product shoots were produced in a single visual language that put the craftsmanship in frame.",
        "The website was designed around purchase confidence, and social media ran in line with the strategy.",
      ],
    },
    approachFlow: {
      tr: ["Pazar araştırması", "Yeniden konumlandırma", "Kreatif prodüksiyon", "Web ve sosyal medya"],
      en: ["Market research", "Repositioning", "Creative production", "Web & social"],
    },
    approachFlowIcons: ["search", "design", "content", "broadcast"],
    outcome: {
      tr: [
        "Marka lüks demografiye hitap eden yeni bir görsel dile ve konuma kavuştu.",
        "Türkiye'nin tanınmış butik perakende zincirlerinden biriyle moda ve giyim alanında anlaşma imzalandı.",
        "Ürünler bu zincirin raflarında satışa çıktı; marka kendi kanalının dışına taşındı.",
      ],
      en: [
        "The brand gained a new visual language and position that speaks to the luxury demographic.",
        "An agreement was signed with one of Türkiye's best-known boutique retail chains in fashion and apparel.",
        "Products went on sale on that chain's shelves, taking the brand beyond its own channel.",
      ],
    },
    // TODO(burak): süre doğrulanacak; eski sitede yazmıyor.
    durationWeeks: 12,
    metrics: [],
    cover: {
      type: "image",
      src: "/work/feruza/kapak.jpg",
      width: 1230,
      height: 1537,
      alt: {
        tr: "Feruza Elegance kampanya çekimi — havuz kenarında yürüyen model, solda marka logosu",
        en: "Feruza Elegance campaign shoot — a model walking beside a pool, brand logo at left",
      },
    },
    media: [
      {
        type: "image",
        src: "/work/feruza/urun-stiletto.jpg",
        width: 1230,
        height: 1537,
        alt: {
          tr: "Siyah burunlu beyaz deri stiletto, altın metal topukta marka monogramı",
          en: "White leather stiletto with a black cap toe and the brand monogram on a gold metal heel",
        },
        caption: {
          tr: "Ürün çekimi — monogramlı topuk, markanın imzası",
          en: "Product shoot — the monogrammed heel, the brand's signature",
        },
      },
      {
        type: "image",
        src: "/work/feruza/urun-sandalet.jpg",
        width: 1245,
        height: 1556,
        alt: {
          tr: "Beyaz deri topuklu sandalet çifti, altın tokalı bant ve iç tabanda Feruza logosu",
          en: "A pair of white leather heeled sandals with a gold buckle strap and the Feruza logo on the insole",
        },
        caption: {
          tr: "Stüdyo çekimi — el işçiliğini gösteren sade kadraj",
          en: "Studio shoot — a plain frame that shows the craftsmanship",
        },
      },
      {
        type: "image",
        src: "/work/feruza/kampanya-takim.jpg",
        width: 1223,
        height: 1529,
        alt: {
          tr: "Pembe saten takım giyen model, arkada şehir manzarasına bakan cam cephe; altta marka logosu",
          en: "A model in a pink satin suit before a glass facade overlooking the city; brand logo below",
        },
        caption: {
          tr: "Kampanya serisi — modern-lüks konumun görsel dili",
          en: "Campaign series — the visual language of the modern-luxury position",
        },
      },
    ],
  },
  {
    slug: "sim-baski-ihracat-icerigi",
    clientName: { tr: "SIM Baskı Malzemeleri", en: "SIM Printing Suppliers" },
    clientSector: {
      tr: "Baskı ve matbaa malzemeleri",
      en: "Printing & press supplies",
    },
    problemType: "market_expansion",
    pillar: "build",
    clientLogo: "/work/sim/logo.png",
    services: {
      tr: [
        "Next.js web uygulaması",
        "Çok dilli mimari (5 dil)",
        "SEO ve GEO stratejisi",
        "İçerik pazarlaması",
      ],
      en: [
        "Next.js web application",
        "Multilingual architecture (5 languages)",
        "SEO & GEO strategy",
        "Content marketing",
      ],
    },
    title: {
      tr: "WordPress'ten Next.js'e: 15 kat organik trafik.",
      en: "WordPress to Next.js: 15× organic traffic.",
    },
    lead: {
      tr: "SIM Baskı Malzemeleri 1983'ten beri matbaa sektöründe üretim yapıyor; ancak WordPress altyapısı ne ihracat hedefini ne de teknik içerik derinliğini taşıyabiliyordu. Siteyi beş dilli bir Next.js uygulaması olarak yeniden kurduk ve içerik programını SEO ile GEO'yu birlikte gözeterek tasarladık. Altı ayda organik trafik 15 katına çıktı; AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı.",
      en: "SIM Printing Suppliers has manufactured for the press industry since 1983, but its WordPress stack carried neither the export ambition nor the depth of its technical content. We rebuilt the site as a five-language Next.js application and designed the content program for SEO and GEO together. In six months organic traffic grew 15×, and visibility in AI engines went from zero to 40,000.",
    },
    challenge: {
      tr: [
        "WordPress altyapısı yavaştı ve çok dilli bir ihracat sitesinin yükünü taşımıyordu.",
        "Kırk yıllık teknik üretim bilgisi hiçbir yerde yazılı değildi; arama motorunun da AI motorunun da alıntılayacağı içerik yoktu.",
        "Marka, matbaa malzemeleri gibi ana anahtar kelimelerde ilk sayfada görünmüyordu.",
      ],
      en: [
        "The WordPress stack was slow and couldn't carry the load of a multilingual export site.",
        "Forty years of technical production knowledge existed nowhere in writing; there was nothing for a search engine or an AI engine to cite.",
        "The brand was invisible on the first page for core keywords like printing supplies.",
      ],
    },
    approach: {
      tr: [
        "Sıfırdan strateji kurduk: ürün kataloğu, hedef pazarların arama dili ve rakiplerin boş bıraktığı teknik konular haritalandı.",
        "Siteyi Next.js tabanlı bir web uygulaması olarak yeniden inşa ettik; beş dil aynı anda tasarlandı, tek bir çeviri katmanına sonradan eklenmedi.",
        "Teknik rehber formatında derin içerikler yazdık — içindekiler yapısı, soru-cevap bölümleri ve AI motorlarının alıntılayabileceği kendine yeten pasajlarla.",
        "Performansı ölçüyle kovaladık: sayfa açılışı bir saniyenin altına indirildi ve bu eşik yayın sonrası da korundu.",
      ],
      en: [
        "We built the strategy from scratch, mapping the product catalog, the search language of target markets and the technical topics competitors had left empty.",
        "The site was rebuilt as a Next.js web application; five languages were designed simultaneously, not bolted on as a later translation layer.",
        "We wrote deep content in technical guide format — tables of contents, Q&A sections and self-contained passages AI engines can cite.",
        "Performance was chased by measurement: page load was brought under one second and held there after launch.",
      ],
    },
    approachFlow: {
      tr: ["Strateji ve analiz", "Next.js webapp", "İçerik programı", "SEO ve GEO"],
      en: ["Strategy & analysis", "Next.js webapp", "Content program", "SEO & GEO"],
    },
    approachFlowIcons: ["search", "build", "content", "broadcast"],
    outcome: {
      tr: [
        "Organik trafik 6 ayda 15 katına çıktı.",
        "Matbaa malzemeleri ve alternatif ana anahtar kelimelerde ilk 5 sıraya girildi.",
        "AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı; marka artık sorulduğunda kaynak gösterilen taraf.",
        "Beş dilli yapı, talebin Türkiye dışından da gelmesinin önünü açtı.",
      ],
      en: [
        "Organic traffic grew 15× in six months.",
        "The brand entered the top 5 for printing supplies and alternative core keywords.",
        "Visibility in AI engines went from zero to 40,000; the brand is now the source that gets cited.",
        "The five-language structure opened the door to demand from outside Türkiye.",
      ],
    },
    metrics: [
      {
        value: "15×",
        label: { tr: "Organik trafik", en: "Organic traffic" },
        context: {
          tr: "6 ayda; yeniden platform ve içerik programıyla",
          en: "In 6 months; via replatforming and the content program",
        },
      },
      {
        value: "40.000",
        label: { tr: "GEO görünürlüğü", en: "GEO visibility" },
        context: {
          tr: "Sıfırdan; AI motorlarında görünürlük",
          en: "From zero; visibility across AI engines",
        },
      },
      {
        value: "İlk 5",
        label: { tr: "Google sıralaması", en: "Google ranking" },
        context: {
          tr: "Matbaa malzemeleri ve ana anahtar kelimeler",
          en: "Printing supplies and core keywords",
        },
      },
      {
        value: "<1 sn",
        label: { tr: "Açılma süresi", en: "Load time" },
        context: {
          tr: "Beş dilli Next.js uygulaması",
          en: "Five-language Next.js application",
        },
      },
    ],
    durationWeeks: 26,
    cover: {
      type: "image",
      src: "/work/sim/kapak.jpg",
      width: 1600,
      height: 1002,
      alt: {
        tr: "simlimited.net ana sayfası — koyu temalı hero, metalik yaldız mürekkep üretimi başlığı ve dil seçici",
        en: "simlimited.net homepage — dark hero with a metallic ink production headline and language switcher",
      },
    },
    heroMedia: {
      type: "image",
      src: "/work/sim/vitrin.jpg",
      width: 1600,
      height: 1002,
      alt: {
        tr: "simlimited.net uzmanlık alanları bölümü — mürekkep teknolojileri listesi ve seçili çözümün açıklaması",
        en: "simlimited.net solutions section — a list of ink technologies with the selected solution's description",
      },
      caption: {
        tr: "Ürün mimarisi — teknoloji ailelerinin gezinilebilir yapısı, sol kolonda beş dil",
        en: "Product architecture — a navigable structure of technology families, five languages in the left column",
      },
    },
    media: [
      {
        type: "image",
        src: "/work/sim/blog.jpg",
        width: 1600,
        height: 1002,
        alt: {
          tr: "Blog yazısı — Baskı Kimyasalları Nelerdir başlıklı teknik rehber, sağda içindekiler listesi",
          en: "Blog article — a technical guide titled What Are Printing Chemicals, with a table of contents at right",
        },
        caption: {
          tr: "İçerik programı — içindekiler ve soru-cevap yapısı GEO alıntılanabilirliği için kuruldu",
          en: "Content program — the table of contents and Q&A structure were built for GEO citability",
        },
      },
      {
        type: "image",
        src: "/work/sim/renk-uretimi.jpg",
        width: 1920,
        height: 1200,
        alt: {
          tr: "Elde tutulan Pantone renk kataloğu, mavi tonlarının bulunduğu sayfa açık",
          en: "A Pantone color guide held open at the page of blue tones",
        },
        caption: {
          tr: "Özel renk üretimi — içeriğin dayandığı teknik uzmanlık",
          en: "Custom color production — the technical expertise the content rests on",
        },
      },
      {
        type: "image",
        src: "/work/sim/urun-evcolor.jpg",
        width: 1000,
        height: 667,
        alt: {
          tr: "EVCOLOR floresan ofset mürekkep kutuları — etiketlerde renk kodu ve parti numarası",
          en: "EVCOLOR fluorescent offset ink tins — color codes and batch numbers on the labels",
        },
        caption: {
          tr: "Ürün çekimi — katalogdaki her ürün kendi içeriğine kavuştu",
          en: "Product shoot — every product in the catalog gained its own content",
        },
      },
    ],
    // Alıntı Yakup Albayrak onayıyla yayınlanır (Burak, 2026-08-21).
    testimonial: {
      quote: {
        tr: "Kırk yılı aşkın süredir bu işi yapıyoruz ama ilk kez dünyanın dört bir yanından talep alıyoruz. Müşterilerimiz artık bizi yapay zekaya sorarak buluyor.",
        en: "We have been in this business for over forty years, yet this is the first time demand reaches us from all over the world. Our customers now find us by asking AI.",
      },
      authorRole: {
        tr: "Yakup Albayrak — Kurucu, SIM Baskı Malzemeleri",
        en: "Yakup Albayrak — Founder, SIM Printing Suppliers",
      },
    },
  },
  {
    slug: "meccanotecnica-umbra-teklif-portali",
    clientName: {
      tr: "Meccanotecnica Umbra Türkiye",
      en: "Meccanotecnica Umbra Türkiye",
    },
    clientSector: {
      tr: "Endüstriyel üretim — mekanik salmastra",
      en: "Industrial manufacturing — mechanical seals",
    },
    problemType: "customer_acquisition",
    pillar: "build",
    clientLogo: "/work/meccanotecnica/logo.svg",
    services: {
      tr: [
        "AI-native web uygulaması",
        "AI teknik danışman",
        "Teklif portalı ve CRM otomasyonu",
        "SEO ve GEO — TR, EN, AR, RU",
      ],
      en: [
        "AI-native web application",
        "AI technical advisor",
        "Quote portal & CRM automation",
        "SEO & GEO — TR, EN, AR, RU",
      ],
    },
    title: {
      tr: "AI teknik danışmanla teklif talebinde 10 kat artış.",
      en: "10× more quote requests, driven by an AI technical advisor.",
    },
    lead: {
      tr: "Meccanotecnica Umbra, mekanik salmastranın dünya ölçeğindeki üreticilerinden birinin Türkiye markası; ancak yerel pazardaki teknik bilinirliği global konumunun gerisinde kalmıştı. Ürün kataloğunu, fabrikasını anlatan mühendise uygun donanımı çıkaran bir AI danışmana ve teklif portalına bağladık. Teklif talebi 10 katına çıktı, yanıt süresi yüzde doksan kısaldı.",
      en: "Meccanotecnica Umbra is the Türkiye arm of one of the world's leading mechanical seal manufacturers, yet its technical visibility in the local market lagged behind its global standing. We connected the product catalog to an AI advisor that lays out the right equipment for an engineer describing their plant, and to a quote portal. Quote requests rose tenfold and response time dropped by ninety percent.",
    },
    challenge: {
      tr: [
        "Global ölçekte lider bir marka, Türkiye pazarında teknik ve pazar bilinirliği açısından geride kalmıştı.",
        "Mühendis alıcı hangi donanımın kendi tesisine uygun olduğunu tek başına çıkaramıyordu; her seçim uzman desteği gerektiriyordu.",
        "Ürün çevrimiçi bulunup karşılaştırılamıyordu; teklif süreci telefon ve e-postaya bağlıydı.",
        "Teklif talepleri elle işleniyordu; yanıt süresi ve takip kişiye bağlı kalıyordu.",
      ],
      en: [
        "A globally leading brand had fallen behind on technical and market visibility in Türkiye.",
        "Engineers couldn't work out which equipment suited their own plant; every choice needed expert support.",
        "Products couldn't be found or compared online; the quote process ran on phone calls and email.",
        "Quote requests were handled manually; response time and follow-up depended on individuals.",
      ],
    },
    approach: {
      tr: [
        "Ürün kataloğunu e-ticaret derinliğinde kurduk: her ürün kendi teknik açıklaması, görseli ve indirilebilir CAD dosyasıyla (STEP/DWG) yayında.",
        "AI teknik danışmanı sohbet arayüzüne yerleştirdik: mühendis tesisini anlatıyor, sistem tüm fabrikaya uygun donanımı tek bir form içinde çıkarıyor.",
        "Mühendisin aradığını saniyede bulması için komut paleti araması ekledik; ürün bulma akışı doğrudan teklif adımına bağlandı.",
        "Teklif portalında alıcı birden çok ürünü listesine ekliyor ve tek formla talebini gönderiyor; talep CRM otomasyonuna düşüyor, markaya veri ve müşteriye yanıt otomatik gidiyor.",
        "SEO ve GEO mimarisini dört dilde (TR, EN, AR, RU) sıfırdan kurduk; hedef ve yan pazar anahtar kelimeleri aynı yapıda konumlandı.",
      ],
      en: [
        "We built the product catalog with e-commerce depth: every product live with its technical description, imagery and a downloadable CAD file (STEP/DWG).",
        "We placed an AI technical advisor in a chat interface: the engineer describes their plant and the system lays out equipment for the whole facility in a single form.",
        "A command-palette search lets engineers find what they need in seconds, tying discovery straight to the quote step.",
        "In the quote portal buyers add multiple products to a list and send one form; the request lands in CRM automation, with data reaching the brand and a response reaching the customer automatically.",
        "The SEO and GEO architecture was built from scratch in four languages (TR, EN, AR, RU), positioning target and adjacent-market keywords in one structure.",
      ],
    },
    approachFlow: {
      tr: ["Katalog mimarisi", "AI teknik danışman", "Teklif portalı ve CRM", "SEO ve GEO"],
      en: ["Catalog architecture", "AI technical advisor", "Quote portal & CRM", "SEO & GEO"],
    },
    approachFlowIcons: ["grid", "advise", "sync", "broadcast"],
    outcome: {
      tr: [
        "Teklif talebi 10 katına çıktı; mühendis artık ürünü bulup listesini kendisi kuruyor.",
        "Talep ile yanıt arasındaki süre yüzde doksan kısaldı — adım CRM otomasyonuna geçti.",
        "Aylık organik gösterim 15 bine ulaştı ve artmaya devam ediyor; hedef anahtar kelimelerin tamamında ilk 5 sıradayız.",
        "Dört dilli yapı yan pazarları da kapsadı; Türkiye arayüzü markanın global sitelerinin önüne geçti.",
      ],
      en: [
        "Quote requests rose tenfold; engineers now find products and build their own lists.",
        "The time between request and response fell by ninety percent — the step moved into CRM automation.",
        "Monthly organic impressions reached 15,000 and keep climbing; the brand ranks top 5 for every target keyword.",
        "The four-language structure covered adjacent markets, and the Türkiye interface moved ahead of the brand's global sites.",
      ],
    },
    metrics: [
      {
        value: "10×",
        label: { tr: "Teklif talebi", en: "Quote requests" },
        context: {
          tr: "Portal ve AI danışman devreye girdikten sonra",
          en: "After the portal and AI advisor went live",
        },
      },
      {
        value: "%90",
        label: { tr: "Yanıt süresi kısalması", en: "Faster response" },
        context: {
          tr: "Talep–yanıt adımı CRM otomasyonunda",
          en: "The request-to-response step runs in CRM automation",
        },
      },
      {
        value: "15.000",
        label: { tr: "Aylık organik gösterim", en: "Monthly organic impressions" },
        context: {
          tr: "Sürekli artıyor; sıfırdan kurulan mimariyle",
          en: "Still climbing; on an architecture built from scratch",
        },
      },
      {
        value: "İlk 5",
        label: { tr: "Google sıralaması", en: "Google ranking" },
        context: {
          tr: "Mekanik salmastra dahil tüm hedef anahtar kelimeler",
          en: "Every target keyword, mechanical seals included",
        },
      },
    ],
    durationWeeks: 22,
    cover: {
      type: "image",
      src: "/work/meccanotecnica/kapak.jpg",
      width: 1600,
      height: 1009,
      alt: {
        tr: "meccanotecnica.com.tr ana sayfası — üretim hattı görseli üzerinde Sıfır Sızıntı başlığı, teknik kütüphane ve teklif portalı bağlantıları",
        en: "meccanotecnica.com.tr homepage — a Zero Leakage headline over a production line image, with technical library and quote portal links",
      },
    },
    media: [
      {
        type: "image",
        src: "/work/meccanotecnica/teklif-portali.jpg",
        width: 1600,
        height: 1039,
        alt: {
          tr: "Teklif İste paneli — seçilen ürün listesi ve iletişim formu, altta Teklif İste düğmesi",
          en: "Request a quote panel — the selected product list and contact form with a submit button below",
        },
        caption: {
          tr: "Teklif portalı — mühendis ürünleri listeye ekliyor, talep CRM'e otomatik düşüyor",
          en: "Quote portal — engineers add products to a list; the request lands in CRM automatically",
        },
      },
    ],
    // Alıntı Kaan Atan onayıyla yayınlanır (Burak, 2026-08-21).
    testimonial: {
      quote: {
        tr: "Müşterimiz fabrikasını anlatıyor, sistem uygun donanımı çıkarıyor. Teklif taleplerimiz on katına çıktı, yanıt için beklenen süre neredeyse kalmadı.",
        en: "Our customer describes their plant and the system lays out the right equipment. Quote requests are up tenfold, and the wait for a response has all but disappeared.",
      },
      authorRole: {
        tr: "Kaan Atan — Teknik Sorumlu ve İş Geliştirme Uzmanı, Meccanotecnica Umbra Türkiye",
        en: "Kaan Atan — Technical Lead & Business Development Specialist, Meccanotecnica Umbra Türkiye",
      },
    },
  },
  {
    slug: "odorgo-kategori-yaratma",
    clientName: { tr: "OdorGo", en: "OdorGo" },
    clientSector: {
      tr: "Ev bakım ürünleri — koku giderici",
      en: "Home care products — odor eliminator",
    },
    problemType: "market_expansion",
    pillar: "growth",
    period: { tr: "Temmuz 2025 – Şubat 2026", en: "July 2025 – February 2026" },
    clientLogo: "/work/odorgo/logo.png",
    services: {
      tr: [
        "Kategori ve marka stratejisi",
        "Kreatif yönetim ve reklam filmi",
        "E-ticaret sitesi ve CRO",
        "Performans pazarlama ve kanal yönetimi",
      ],
      en: [
        "Category & brand strategy",
        "Creative direction & TV commercial",
        "E-commerce site & CRO",
        "Performance marketing & channel management",
      ],
    },
    title: {
      tr: "Olmayan bir kategoride 8 ayda 10 milyon TL.",
      en: "₺10M in 8 months, in a category that didn't exist.",
    },
    lead: {
      tr: "OdorGo bize elinde yalnızca ürünle geldi. Koku giderici, Türkiye'de P&G'nin ve Unilever'ın bile girmekte tereddüt ettiği bir kategoriydi; tüketici farkındalığı sıfırdı. Önce kategoriyi anlattık, sonra talebi kurduk: marka stratejisi, reklam filmleri, CRO odaklı e-ticaret ve çok kanallı satış. Sekiz ayın sonunda marka kendi kategorisinin sahibiydi ve 10 milyon TL ciroya ulaştı.",
      en: "OdorGo came to us with nothing but the product. Odor elimination was a category that even P&G and Unilever hesitated to enter in Türkiye, and consumer awareness was zero. We explained the category first, then built the demand: brand strategy, TV commercials, CRO-led e-commerce and multichannel distribution. Eight months later the brand owned its category and had reached ₺10M in revenue.",
    },
    challenge: {
      tr: [
        "Kategori Türkiye'de fiilen yoktu; küresel devler bile bu alana girmekte tereddüt ediyordu.",
        "Tüketici farkındalığı sıfırdı — kimse böyle bir ürünü aramıyordu, dolayısıyla yakalanacak arama hacmi de yoktu.",
        "Arama hacmi olmayan bir üründe performans pazarlaması tek başına çalışmaz; önce talebin kendisi üretilmeliydi.",
        "Markanın elinde yalnız ürün vardı: kimlik, içerik, satış kanalı ve raf yoktu.",
      ],
      en: [
        "The category effectively didn't exist in Türkiye; even global giants hesitated to enter it.",
        "Consumer awareness was zero — nobody was searching for such a product, so there was no search volume to capture.",
        "Performance marketing alone doesn't work on a product with no search volume; demand itself had to be created first.",
        "The brand had only the product: no identity, no content, no sales channel, no shelf.",
      ],
    },
    approach: {
      tr: [
        "Kategoriyi ve markayı birlikte kurduk: ürünün ne yaptığını, neden gerektiğini ve neyle yapıldığını anlatan bir dil tanımladık.",
        "Reklam filmlerini gündelik koku senaryoları üzerine kurduk — kedi kumu, genç erkek odası, evde balık pişirmek. Kategoriyi soyut anlatmak yerine tüketiciye kendi evindeki anı gösterdik.",
        "Ürünün nasıl çalıştığını anlatan bir animasyon ürettik: koku molekülünü yok etmek, bastırmakla aynı şey değil — kategori farkındalığı buradan başladı.",
        "Filmlerden çıkan içeriklerle sosyal medya ve dijital pazarlamayı besledik — tek çekim, onlarca kanal.",
        "İKAS ortaklığıyla e-ticaret sitesini CRO odağında kurduk: ziyaretçi hangi kanaldan hangi sayfaya girerse girsin ikna edici bilgiyi alıp satış adımına gidiyor.",
        "Sosyal medya, e-posta, organik arama ve Google Ads'i tek ölçüm çerçevesinde yönettik; Trendyol ve Hepsiburada mağazalarını açtık.",
      ],
      en: [
        "We built the category and the brand together, defining a language that explains what the product does, why it's needed and what it's made of.",
        "We built the commercials around everyday odor scenarios — cat litter, a teenage boy's room, cooking fish at home. Instead of explaining the category in the abstract, we showed consumers a moment from their own home.",
        "We produced an animation explaining how the product works: eliminating an odor molecule is not the same as masking it — category awareness started there.",
        "Content cut from those films fed social media and digital marketing — one shoot, dozens of channels.",
        "With İKAS we built the e-commerce site around CRO: whichever channel and page a visitor lands on, they get the convincing information and move to the purchase step.",
        "Social, email, organic search and Google Ads were managed in one measurement frame; Trendyol and Hepsiburada storefronts were opened.",
      ],
    },
    approachFlow: {
      tr: ["Kategori stratejisi", "Marka ve kreatif", "Reklam filmi", "CRO ve satış kanalları"],
      en: ["Category strategy", "Brand & creative", "TV commercial", "CRO & sales channels"],
    },
    approachFlowIcons: ["search", "design", "film", "grid"],
    outcome: {
      tr: [
        "Sekiz ayda sıfır farkındalıktan kategori sahibi markaya geçildi.",
        "Hedef anahtar kelimelerin tamamında organik ilk 3 sıraya yerleşildi — arama hacmi kampanyayla birlikte oluştu.",
        "Reklam filmleri 10 milyonun üzerinde izlendi ve kategori dilini tüketiciye taşıdı.",
        "Ürün MacroCenter, Migros ve Happy Center raflarına girdi; e-ticaret, pazaryeri, perakende ve stand satışları birlikte 10 milyon TL ciroya ulaştı.",
        "Operasyon Şubat 2026'da markanın kendi ekibine devredildi — kurulan sistem sahibiyle çalışmaya devam ediyor.",
      ],
      en: [
        "In eight months the brand went from zero awareness to owning its category.",
        "It reached the organic top 3 for every target keyword — the search volume itself was created by the campaign.",
        "The films were viewed more than 10 million times, carrying the category language to consumers.",
        "The product reached MacroCenter, Migros and Happy Center shelves; e-commerce, marketplaces, retail and stand sales together reached ₺10M in revenue.",
        "In February 2026 the operation was handed over to the brand's own team — the system runs on with its owner.",
      ],
    },
    metrics: [
      {
        value: "10M ₺",
        label: { tr: "Ciro", en: "Revenue" },
        context: {
          tr: "8 ayda; e-ticaret, pazaryeri, perakende ve stand",
          en: "In 8 months; e-commerce, marketplaces, retail and stands",
        },
      },
      {
        value: "İlk 3",
        label: { tr: "Organik sıralama", en: "Organic ranking" },
        context: {
          tr: "Tüm hedef anahtar kelimeler; kategori sıfırdan kuruldu",
          en: "Every target keyword; the category was built from zero",
        },
      },
      {
        value: "3 zincir",
        label: { tr: "Ulusal perakende", en: "National retail" },
        context: {
          tr: "MacroCenter, Migros ve Happy Center rafları",
          en: "MacroCenter, Migros and Happy Center shelves",
        },
      },
      {
        value: "10M+",
        label: { tr: "Film izlenmesi", en: "Film views" },
        context: {
          tr: "Dört filmin dijital kanallardaki toplamı",
          en: "Four films, total across digital channels",
        },
      },
    ],
    durationWeeks: 35,
    cover: {
      type: "image",
      src: "/work/odorgo/icindekiler.png",
      width: 2160,
      height: 2700,
      alt: {
        tr: "OdorGo içindekiler infografiği — misket limonu, sedir, çam, anason ve karanfil yağları, ortada vegan işareti",
        en: "OdorGo ingredients infographic — lime, cedar, pine, anise and clove oils around a vegan mark",
      },
    },
    media: [
      {
        type: "youtube",
        src: "bG3j6Xr6yhI",
        poster: "/work/odorgo/yt-bG3j6Xr6yhI.jpg",
        width: 16,
        height: 9,
        alt: {
          tr: "Reklam filmi: Kedi kumu evde koku yapmaz — oturma odasında kanepede oturan kadın",
          en: "Commercial: cat litter doesn't make the home smell — a woman on a living room sofa",
        },
        caption: {
          tr: "Reklam filmi — kedi kumu senaryosu",
          en: "Commercial — the cat litter scenario",
        },
      },
      {
        type: "youtube",
        src: "qkyX6FobNhQ",
        poster: "/work/odorgo/yt-qkyX6FobNhQ.jpg",
        width: 16,
        height: 9,
        alt: {
          tr: "Reklam filmi: Genç erkek odası kokmaz — spor kıyafetli genç, odasında",
          en: "Commercial: a teenage boy's room doesn't smell — a young man in his room in sportswear",
        },
        caption: {
          tr: "Reklam filmi — genç odası senaryosu",
          en: "Commercial — the teenage room scenario",
        },
      },
      {
        type: "youtube",
        src: "I_DCDpjK_ZQ",
        poster: "/work/odorgo/yt-I_DCDpjK_ZQ.jpg",
        width: 16,
        height: 9,
        alt: {
          tr: "Reklam filmi: Evde balık pişirmek koku yapmaz — mutfakta balık hazırlayan kadın",
          en: "Commercial: cooking fish at home doesn't leave a smell — a woman preparing fish in the kitchen",
        },
        caption: {
          tr: "Reklam filmi — evde balık senaryosu",
          en: "Commercial — the fish at home scenario",
        },
      },
      {
        type: "youtube",
        src: "X63UngybxKA",
        poster: "/work/odorgo/yt-X63UngybxKA.jpg",
        width: 16,
        height: 9,
        alt: {
          tr: "Bilgilendirici animasyon — koku molekülleri ve OdorGo ürün ailesi çizimi",
          en: "Explainer animation — odor molecules and an illustration of the OdorGo product family",
        },
        caption: {
          tr: "Bilgilendirici animasyon — kategori farkındalığının başladığı yer",
          en: "Explainer animation — where category awareness started",
        },
      },
      {
        type: "image",
        src: "/work/odorgo/odeme-sayfasi.jpg",
        width: 1600,
        height: 906,
        alt: {
          tr: "OdorGo e-ticaret ödeme sayfası — sepet özeti ve teslimat adımı",
          en: "OdorGo e-commerce checkout page — cart summary and delivery step",
        },
        caption: {
          tr: "CRO odaklı ödeme akışı — her kanaldan gelen ziyaretçi aynı adıma iniyor",
          en: "CRO-led checkout flow — visitors from every channel land on the same step",
        },
      },
      {
        type: "image",
        src: "/work/odorgo/icindekiler.png",
        width: 2160,
        height: 2700,
        alt: {
          tr: "OdorGo içindekiler infografiği — misket limonu, sedir, çam, anason ve karanfil yağları, ortada vegan işareti",
          en: "OdorGo ingredients infographic — lime, cedar, pine, anise and clove oils around a vegan mark",
        },
        caption: {
          tr: "İçerik anlatımı — doğal formülasyon güven argümanının merkezinde",
          en: "Ingredient storytelling — the natural formulation at the center of the trust argument",
        },
      },
    ],
    // Alıntı Şebnem Oğuz onayıyla yayınlanır (Burak, 2026-08-21).
    testimonial: {
      quote: {
        tr: "Elimizde yalnızca ürün vardı, kategori bile yoktu. Sekiz ayda marketlerin rafına girdik ve insanlar ürünü adıyla aramaya başladı.",
        en: "All we had was the product — the category didn't even exist. In eight months we reached supermarket shelves and people started searching for the product by name.",
      },
      authorRole: {
        tr: "Şebnem Oğuz — Kurucu, OdorGo",
        en: "Şebnem Oğuz — Founder, OdorGo",
      },
    },
  },
];

export function getCaseBySlug(slug: string): CaseStudyContent | null {
  return CASES.find((c) => c.slug === slug) ?? null;
}
