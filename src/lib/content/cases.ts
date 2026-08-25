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
    serviceSlugs: [
      "performans-pazarlama",
    ],
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
        value: { tr: "1,5M $", en: "$1.5M" },
        label: { tr: "Gelir", en: "Revenue" },
        context: {
          tr: "Kampanyanın ilk 6 günü",
          en: "First 6 days of the campaign",
        },
      },
      {
        value: { tr: "~1:1000", en: "~1:1000" },
        label: { tr: "Reklam getirisi", en: "Return on ad spend" },
        context: {
          tr: "İlk 30 gün, reklam harcaması bazında",
          en: "First 30 days, on ad spend basis",
        },
      },
      {
        value: { tr: "+%150", en: "+150%" },
        label: { tr: "Toplam trafik", en: "Total traffic" },
        context: {
          tr: "Organik + ücretli, segmentasyon sonrası",
          en: "Organic + paid, after segmentation",
        },
      },
      {
        value: { tr: "+%70", en: "+70%" },
        label: { tr: "Organik trafik", en: "Organic traffic" },
        context: {
          tr: "İçerik pazarlaması programıyla",
          en: "Through the content marketing programme",
        },
      },
    ],
    durationWeeks: 10,
    seo: {
      title: {
        tr: "SOYLU AVM: 6 günde 1,5 milyon dolar gelir",
        en: "SOYLU AVM: $1.5M e-commerce revenue in 6 days",
      },
      description: {
        tr: "SOYLU AVM'nin ölçüm altyapısını yeniden kurduk, sonra kampanyayı açtık: ilk 6 günde 1,5 milyon dolar gelir ve %150 trafik artışı. E-ticaret büyüme vakası.",
        en: "We rebuilt SOYLU AVM's measurement stack, then launched the campaign: $1.5M revenue in the first 6 days and +150% traffic. An e-commerce growth case.",
      },
    },
    faq: [
      {
        question: {
          tr: "1,5 milyon dolarlık gelir ne kadar sürede geldi?",
          en: "How long did the $1.5M in revenue take?",
        },
        answer: {
          tr: "Gelir, kampanyanın altıncı gününde 1,5 milyon dolara ulaştı. SOYLU AVM çalışmasının tamamı Mayıs – Temmuz 2024 arasında on hafta sürdü ve bu on haftanın ilk bölümü ölçüm altyapısına gitti. Rakam kampanya açıldıktan sonraki ilk altı günün toplamıdır; reklam getirisi ise ayrı bir pencerede, ilk 30 gün üzerinden ölçüldü.",
          en: "Revenue reached $1.5M on day six of the campaign. The SOYLU AVM engagement ran ten weeks in total between May and July 2024, and the first part of those ten weeks went to the measurement stack. The figure is the total for the first six days after launch, while return on ad spend was measured separately over the first 30 days.",
        },
      },
      {
        question: {
          tr: "Kampanyadan önce hangi adım atıldı?",
          en: "What was done before the campaign launched?",
        },
        answer: {
          tr: "Kampanyadan önce ölçüm altyapısı sıfırdan kuruldu. SOYLU AVM'de piksel kurulumları eksikti, trafiğin kaynağı ve dönüşümün yolu izlenemiyordu. Piksel ile dönüşüm izleme yeniden kurulup trafik kaynakları segmentlere ayrılmadan hiçbir reklam seti açılmadı. Reklam metinleri de aynı hazırlık döneminde yeniden yazıldı, böylece kampanya doğru ölçülen bir zeminde başladı.",
          en: "The measurement stack was rebuilt from scratch before any campaign ran. At SOYLU AVM the pixel setups were incomplete, so neither traffic sources nor conversion paths could be tracked. No ad set opened until pixels and conversion tracking were rebuilt and traffic sources segmented. Ad copy was rewritten in the same preparation window, so the campaign started on ground that could be measured.",
        },
      },
      {
        question: {
          tr: "Ölçüm neden kampanyadan önce geldi?",
          en: "Why did measurement come before the campaign?",
        },
        answer: {
          tr: "Yanlış ölçüm, harcanan bütçeyi görünmez kılıyordu. SOYLU AVM'nin ROI raporları yanıltıcıydı ve reklam bütçesi hangi ürünün sattığını göstermeden harcanıyordu. Veri doğru aktığında hangi reklam setinin kazandığı ilk günden okunabilir hale geldi; kapatma ve bütçe kaydırma kararları da tahminle değil kayıtla verildi. Sıra tersine çevrilseydi altı günlük gelir açıklanamazdı.",
          en: "Faulty measurement was making the spend invisible. At SOYLU AVM the ROI reports were misleading and ad budget went out without showing which product sold. Once data flowed correctly, the winning ad set could be read from day one, and decisions to pause or shift budget came from records rather than guesses. Reversed, the six-day revenue figure could not have been explained.",
        },
      },
      {
        question: {
          tr: "Reklam getirisi 1:1000 nasıl ölçüldü?",
          en: "How was the 1:1000 return on ad spend measured?",
        },
        answer: {
          tr: "Oran, ilk 30 gün boyunca reklam harcaması bazında ölçüldü. Hesap, o dönemde harcanan reklam bütçesi ile aynı dönemde kaydedilen gelirin karşılaştırılmasından çıktı; ürün maliyeti, lojistik veya operasyon gibi başka kalemler bu orana dahil değil. Ölçüm çerçevesi bilerek dar tutuldu, çünkü kampanya kararlarını doğrudan etkileyen değişken reklam harcamasıydı.",
          en: "The ratio was measured over the first 30 days on an ad spend basis. It compares the ad budget spent in that window with the revenue recorded in the same window; product cost, logistics and operations are not included in it. The frame was deliberately kept narrow, because ad spend was the variable that directly drove campaign decisions.",
        },
      },
      {
        question: {
          tr: "Organik trafik neden %70 arttı?",
          en: "Why did organic traffic grow 70%?",
        },
        answer: {
          tr: "Organik artış, içerik pazarlaması programından geldi. İçerik üretimi reklam kampanyasının yanında yürüdü ve ücretli trafiğin dışında kalan bir taban oluşturdu. Toplam trafik %150 artarken bu artışın bir bölümü organik kanaldan geldi. Ayrım önemli: ücretli trafik bütçe durduğunda düşer, organik taban ise yayımlanan içerik durdukça yerinde kalmaya devam eder.",
          en: "The organic lift came from the content marketing programme. Content production ran alongside the ad campaign and built a base that sits outside paid traffic. Total traffic grew 150%, and part of that growth arrived through the organic channel. The distinction matters: paid traffic drops when the budget stops, while an organic base holds as long as the published content stands.",
        },
      },
      {
        question: {
          tr: "Satış tek kategoriye sıkışmışken çeşitlendirme nasıl yapıldı?",
          en: "How was the category mix widened when sales sat in one category?",
        },
        answer: {
          tr: "Çeşitlendirme, kampanya planının doğrudan kategori hedefine bağlanmasıyla yapıldı. SOYLU AVM'de mevsimsel talebi izleyen reklam setleri, stokta karşılıksız bekleyen ürün gruplarına yönlendirildi. Stok fazlası ürünler kategori kampanyalarıyla satıldı ve gelir tek bir ürün grubuna bağlı olmaktan çıktı. Segmentasyon burada belirleyiciydi: hangi kitlenin hangi kategoriye yanıt verdiği ölçülebilir hale gelmişti.",
          en: "Diversification came from tying the campaign plan directly to a category goal. At SOYLU AVM, ad sets tracking seasonal demand were pointed at the product groups sitting unsold in stock. Overstock moved through category campaigns and revenue stopped depending on a single product group. Segmentation was decisive here: which audience responded to which category had become measurable.",
        },
      },
      {
        question: {
          tr: "Yapay zeka bu işin neresinde kullanıldı?",
          en: "Where was AI used in this project?",
        },
        answer: {
          tr: "Yapay zeka, reklam setlerinin mevsimsel talebe göre ayarlanmasında kullanıldı. Destekli setler talep hareketini izleyerek hangi kategoriye ne zaman ağırlık verileceğini besledi. Reklam metinleri ise elle yeniden yazıldı; makine üretimi metin bu vakada kullanılmadı. Ayrım bilinçli: hangi kitleye ne zaman gösterileceği veri işiydi, ne söyleneceği ise marka kararıydı.",
          en: "AI was used to tune ad sets to seasonal demand. The assisted sets tracked demand movement and fed the decision on which category to weight and when. Ad copy itself was rewritten by hand; no machine-written copy was used in this case. The split was deliberate: when to show something to whom is a data job, while what to say remains a brand decision.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmet kapsamına giriyor?",
          en: "Which service does this work fall under?",
        },
        answer: {
          tr: "Çalışma performans pazarlama hizmetinin kapsamına giriyor. Ölçüm altyapısı, kampanya yönetimi, içerik programı ve kategori planı aynı işin parçalarıydı; künyede ayrı ayrı yazılan disiplinler bu hizmetin altında toplanıyor. Ayrı bir yazılım geliştirme kalemi yok — mevcut e-ticaret altyapısı korunarak yalnız ölçüm katmanı ve kampanya tarafı yeniden kuruldu.",
          en: "The work falls under performance marketing. Measurement setup, campaign management, the content programme and the category plan were parts of one engagement, and the disciplines listed separately in the credits sit under that service. There is no separate software line: the existing e-commerce stack stayed in place while the measurement layer and the campaign side were rebuilt.",
        },
      },
      {
        question: {
          tr: "Aynı yaklaşım başka bir e-ticaret markasında işe yarar mı?",
          en: "Would the same approach work for another e-commerce brand?",
        },
        answer: {
          tr: "Yaklaşım, ölçüm kırıksa ve katalog derinliği varsa işe yarar. SOYLU AVM'de iki koşul da vardı: izleme yanlış kuruluydu ve stokta satılmayı bekleyen kategoriler duruyordu. Tek kategoriye bağımlı, dar bir katalogda aynı kaldıraç bu ölçekte çalışmaz. Ölçüm zaten sağlamsa da kazanç bu kadar büyük olmaz; öncelik o zaman dönüşüm tarafına kayar.",
          en: "The approach works where measurement is broken and the catalogue has depth. Both conditions held at SOYLU AVM: tracking was misconfigured and whole categories sat waiting in stock. On a narrow catalogue dependent on a single category, the same lever does not pull at this scale. Where measurement is already sound the gain is smaller too, and priority shifts to the conversion side.",
        },
      },
      {
        question: {
          tr: "Benzer bir iş için nereden başlanır?",
          en: "Where would a similar project start?",
        },
        answer: {
          tr: "Başlangıç noktası ölçüm denetimidir. Piksel kurulumu, dönüşüm olayları ve trafik kaynaklarının doğru ayrışıp ayrışmadığı kontrol edilir; tablo görülmeden kampanya bütçesi konuşulmaz. Denetim çıktısı hangi kaldıracın önce çekileceğini de gösterir. İkinci adım katalog tarafıdır: hangi kategorilerin stokta beklediği ve hangilerinin mevsimsel talebe karşılık verdiği çıkarılır.",
          en: "The starting point is a measurement audit. Pixel setup, conversion events and whether traffic sources separate correctly all get checked, and no budget conversation happens before that picture exists. The audit output also shows which lever to pull first. The second step is the catalogue: which categories sit waiting in stock and which ones answer seasonal demand.",
        },
      },
    ],
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
    serviceSlugs: [
      "performans-pazarlama",
      "cro",
    ],
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
      en: ["Measurement stack", "Segmentation", "Campaign optimisation", "Social proof"],
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
        value: { tr: "12×", en: "12×" },
        label: { tr: "Satış", en: "Sales" },
        context: {
          tr: "3 ayda; e-ticaret satış ve gelir verisi bazında",
          en: "In 3 months; on e-commerce sales and revenue data",
        },
      },
      {
        value: { tr: "8×", en: "8×" },
        label: { tr: "Etkileşim", en: "Engagement" },
        context: { tr: "Hedef 2 kattı", en: "The target was 2×" },
      },
      {
        value: { tr: "3×", en: "3×" },
        label: { tr: "Oturum süresi", en: "Session duration" },
        context: {
          tr: "Ürün sayfası iyileştirmeleri sonrası",
          en: "After product page improvements",
        },
      },
    ],
    durationWeeks: 12,
    seo: {
      title: {
        tr: "GYMWOLVES: spor giyimde 3 ayda 12 kat satış",
        en: "GYMWOLVES: 12× sportswear sales in 3 months",
      },
      description: {
        tr: "GYMWOLVES'in veri akışını onardık, dönüşüm hunisini yeniden kurduk: üç ayda satış 12 katına, etkileşim 8 katına çıktı. Spor giyim e-ticareti vakası.",
        en: "We repaired GYMWOLVES' data flow and rebuilt the conversion funnel: sales up 12× and engagement up 8× in three months. A sportswear e-commerce case.",
      },
    },
    faq: [
      {
        question: {
          tr: "12 kat satış ne kadar sürede alındı?",
          en: "How long did the 12× sales increase take?",
        },
        answer: {
          tr: "Satış üç ayda 12 katına çıktı. GYMWOLVES çalışması 12 hafta sürdü ve artış üçüncü ayın sonunda ölçüldü. Kurucunun aynı süre için koyduğu hedef iki kattı; sonuç hedefin altı katı çıktı. Ölçüm e-ticaret satış ve gelir verisi üzerinden yapıldı, raporlar da her hafta müşteriyle birlikte okundu.",
          en: "Sales rose 12× in three months. The GYMWOLVES engagement ran 12 weeks and the increase was measured at the end of month three. The founder's target for that same period was 2×, so the result landed at six times the goal. Measurement ran on e-commerce sales and revenue data, and the reports were read with the client every week.",
        },
      },
      {
        question: {
          tr: "Hedef iki katken sonuç neden 12 kat çıktı?",
          en: "Why did the result land at 12× when the target was 2×?",
        },
        answer: {
          tr: "Sonucun hedefi aşmasının nedeni darboğazın tek olmamasıydı. Veri akışı, ürün sayfası deneyimi ve reklam hedeflemesi aynı dönemde düzeltildi. Üç kaldıraç birlikte çalıştığı için etki, tek kanaldaki iyileşmenin toplamından büyük çıktı: doğru ölçülen bir kampanya, dönüşen bir sayfaya trafik gönderdi ve kazanan setler hızla bulundu.",
          en: "The result overshot the target because there was more than one bottleneck. Data flow, product page experience and ad targeting were all corrected in the same window. With three levers moving together the effect exceeded the sum of any single-channel gain: a properly measured campaign was sending traffic to a page that now converted, and winning ad sets surfaced quickly.",
        },
      },
      {
        question: {
          tr: "Başlangıçtaki en büyük engel neydi?",
          en: "What was the biggest obstacle at the start?",
        },
        answer: {
          tr: "En büyük engel kırık veri akışıydı. GYMWOLVES'te piksel ve veri akışı hatalıydı, dolayısıyla reklam kararları eksik veriyle alınıyordu. Yazılım altyapısı ile piksel kurulumu yenilendi ve veri akışı uçtan uca doğrulandı; optimizasyon ancak bundan sonra başladı. İkinci engel segmentasyon ve yeniden hedeflemenin hiç kurulmamış olmasıydı.",
          en: "The biggest obstacle was broken data flow. At GYMWOLVES the pixels and the data pipeline were faulty, so ad decisions ran on incomplete data. The software stack and pixel setup were rebuilt and the flow was verified end to end; only then did optimisation begin. The second obstacle was that neither segmentation nor retargeting existed at all.",
        },
      },
      {
        question: {
          tr: "Ürün sayfalarında ne değişti?",
          en: "What changed on the product pages?",
        },
        answer: {
          tr: "Ürün sayfalarında dönüşümü aşağı çeken arayüz ve deneyim hataları giderildi. Değişikliğin ölçülen etkisi oturum süresinde üç kat artış oldu. Ziyaretçi sayfada daha uzun kaldıkça yeniden hedefleme için daha iyi bir sinyal de oluştu, çünkü ilgi gösteren kitle artık davranışıyla ayrışabiliyordu. Arayüz işi kampanyayla aynı sprintte yürüdü.",
          en: "The UI and UX flaws dragging conversion down were fixed on the product pages. The measured effect was session duration tripling. Longer sessions also produced a better retargeting signal, because an interested audience could now be separated by behaviour rather than assumption. The interface work ran in the same sprint as the campaign.",
        },
      },
      {
        question: {
          tr: "Reklam bütçesi nasıl yönetildi?",
          en: "How was the ad budget managed?",
        },
        answer: {
          tr: "Bütçe sürekli olarak kazanan setlere kaydırıldı. Hedef kitle segmentlere ayrıldı, düşük performanslı reklam setleri kapatıldı ve harcama kazananlara aktarıldı. Karar haftalık raporda müşteriyle birlikte okundu; kurucunun ifadesiyle raporlar her hafta birlikte incelendi. Böylece hangi setin neden kapandığı da kayda geçti ve karar tek kişinin sezgisine bağlı kalmadı.",
          en: "Spend was continuously shifted toward the winning sets. The audience was segmented, underperforming ad sets were closed and money moved to what worked. The decision was read with the client in a weekly report; in the founder's words, the reports were reviewed together every week. That also put on record why each set was closed, rather than leaving the call to one person's instinct.",
        },
      },
      {
        question: {
          tr: "Yeniden hedefleme ne işe yaradı?",
          en: "What did retargeting achieve?",
        },
        answer: {
          tr: "Yeniden hedefleme, çapraz satış ve üst satış adımlarını açtı. Segmentasyondan sonra kurulan yapı, siteye daha önce gelmiş kitleyi ayrı ele aldı ve bu kitleye ikinci bir teklif sunulabilir hale geldi. Spor giyimde tekrar satın alma davranışı güçlü olduğu için bu adım, yeni müşteri edinme maliyetini artırmadan gelir eklemenin yolu oldu.",
          en: "Retargeting opened cross-sell and upsell. Built after segmentation, it treated previous visitors as their own audience, making a second offer possible for that group. Because repeat purchase behaviour is strong in sportswear, this step added revenue without raising the cost of acquiring new customers.",
        },
      },
      {
        question: {
          tr: "Tıklama maliyeti nasıl düşürüldü?",
          en: "How was cost per click reduced?",
        },
        answer: {
          tr: "Tıklama maliyeti, SEO çalışması ve yapay zeka destekli dinamik reklamlarla düşürüldü. İki kaldıraç birlikte yürüdü: arama tarafında organik görünürlük, reklam tarafında kreatif ile kitle eşleşmesinin otomatik ayarlanması. Dinamik reklamlar, elle test edilmesi haftalar alacak kombinasyonları kısa sürede eledi ve bütçe daha az denemeyle doğru eşleşmeye ulaştı.",
          en: "Cost per click came down through SEO work and AI-assisted dynamic ads. Two levers ran together: organic visibility on the search side, and automatic creative-to-audience matching on the ad side. The dynamic ads eliminated combinations that would have taken weeks to test by hand, so the budget reached the right match after fewer attempts.",
        },
      },
      {
        question: {
          tr: "Sosyal kanıt nasıl üretildi?",
          en: "How was social proof produced?",
        },
        answer: {
          tr: "Sosyal kanıt, sporcular ve içerik üreticileriyle çekilen videolarla üretildi. Pist, tribün ve salon serilerinden çıkan kareler hem reklam kreatifini hem sosyal kanalları besledi. Marka, ürününü gerçekten kullanan sporcularla göründü; stok görsel kullanılmadı. Tek çekim programından çıkan içerik, kampanya boyunca farklı kanallarda farklı kurgularla yeniden kullanıldı.",
          en: "Social proof was produced through video shot with athletes and creators. Frames from the track, stadium and gym series fed both ad creative and social channels. The brand appeared with athletes actually using the product, and no stock imagery was used. Content from a single shoot programme was recut and reused across different channels throughout the campaign.",
        },
      },
      {
        question: {
          tr: "Marka küresel rakiplerden nasıl ayrıştı?",
          en: "How did the brand separate from global competitors?",
        },
        answer: {
          tr: "Ayrışma, markanın kendi görsel dilini kurmasıyla geldi. Başlangıçta GYMWOLVES küresel rakiplerle karıştırılıyordu; kampanya kreatifi, çekim yönü ve iletişim dili tek bir çizgide toplanınca karışıklık ortadan kalktı. Sporcularla yapılan saha çekimleri bu çizginin taşıyıcısı oldu, çünkü rakiplerin stüdyo ağırlıklı diline karşı yerel ve tanınabilir bir kadraj sundu.",
          en: "The separation came from the brand building its own visual language. GYMWOLVES was being confused with global competitors; once campaign creative, art direction and tone of voice converged on one line, the confusion cleared. Field shoots with athletes carried that line, offering a local, recognisable frame against the studio-heavy language of the competition.",
        },
      },
      {
        question: {
          tr: "Sonuç kalıcı mı, müşteri sonrasında ne yaptı?",
          en: "Did the result hold, and what did the client do next?",
        },
        answer: {
          tr: "Müşteri, yeni bir fiziksel mağaza açmak yerine çevrimiçi perakendeye yatırım kararı aldı. Karar, çevrimiçi kanalın ölçülebilir hale gelmesinin sonucudur: büyümenin nereden geldiği artık haftalık raporda görünüyordu. Sermayenin nereye gideceği sorusu böylece tahminle değil kayıtla cevaplandı ve kurulan ölçüm düzeni markanın kendi elinde kaldı.",
          en: "The client chose to invest in online retail instead of opening another physical store. That decision followed from the online channel becoming measurable: the weekly report now showed where growth came from. The question of where capital should go was answered from records rather than guesswork, and the measurement setup stayed in the brand's own hands.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma performans pazarlama ile dönüşüm optimizasyonu hizmetlerinin kapsamına giriyor. Veri altyapısı, içerik üretimi ve sporcularla yürütülen çekim programı bu iki hizmetin içinde yürüdü. Künyede ayrı yazılan disiplinler ikisinin altında toplanıyor; ayrı bir marka kimliği projesi açılmadı, görsel dil kampanya kreatifi üzerinden kuruldu.",
          en: "The work falls under performance marketing and conversion optimisation. The data infrastructure, content production and the shoot programme with athletes all ran inside those two. The disciplines listed separately in the credits sit under them; no separate brand identity project was opened, and the visual language was built through campaign creative.",
        },
      },
    ],
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
    serviceSlugs: [
      "ozel-yazilim-ve-mobil",
      "e-ticaret",
      "is-otomasyonlari",
      "cro",
    ],
    title: {
      tr: "5 dakikada 200.000 ürün senkronu.",
      en: "200,000 products synced every 5 minutes.",
    },
    lead: {
      tr: "MKComputer, SYNAXON kataloğundaki 200.000'den fazla ürünü Avrupa'ya dropshipping ile satmak istiyordu; stok ve fiyat elle yönetilemezdi. Magento 2 üzerinde stok, fiyat ve tedarikçiyi 5 dakikada bir senkronlayan otomasyon platformunu kurduk.",
      en: "MKComputer wanted to dropship 200,000+ products from the SYNAXON catalogue across Europe; stock and pricing couldn't be managed by hand. We built an automation platform on Magento 2 that syncs stock, price and supplier every 5 minutes.",
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
        "A dedicated server architecture was configured to carry the 5-minute sync load; database and frontend optimised.",
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
        value: { tr: "200.000+", en: "200,000+" },
        label: { tr: "Senkronlanan ürün", en: "Products synced" },
        context: {
          tr: "Stok, fiyat, tedarikçi, görsel ve açıklama",
          en: "Stock, price, supplier, image and description",
        },
      },
      {
        value: { tr: "5 dk", en: "5 min" },
        label: { tr: "Güncelleme aralığı", en: "Update interval" },
        context: {
          tr: "Tam katalog, 7/24 otomatik",
          en: "Full catalogue, automatic 24/7",
        },
      },
      {
        value: { tr: "0", en: "0" },
        label: { tr: "Manuel sipariş adımı", en: "Manual order steps" },
        context: {
          tr: "Sipariş en uygun tedarikçiye otomatik gider",
          en: "Orders route automatically to the best supplier",
        },
      },
    ],
    // TODO(burak): proje süresi doğrulanacak.
    durationWeeks: 16,
    seo: {
      title: {
        tr: "MKComputer: 200.000 ürün, 5 dakikada senkron",
        en: "MKComputer: 200,000 products synced in 5 minutes",
      },
      description: {
        tr: "MKComputer için Magento 2 üzerinde stok, fiyat ve tedarikçiyi 5 dakikada bir senkronlayan otomasyon: 200.000+ ürün, sıfır manuel sipariş adımı.",
        en: "An automation platform on Magento 2 syncing stock, price and supplier every 5 minutes for MKComputer: 200,000+ products, zero manual order steps.",
      },
    },
    faq: [
      {
        question: {
          tr: "200.000 ürün nasıl her 5 dakikada bir güncelleniyor?",
          en: "How do 200,000 products refresh every 5 minutes?",
        },
        answer: {
          tr: "Güncelleme, SYNAXON'un XML veri akışını okuyan özel bir Magento 2 modülüyle yapılıyor. Modül stok, fiyat, tedarikçi, görsel ve açıklama alanlarını çekip katalogla eşleştiriyor; döngü 7/24 otomatik çalışıyor. Beş dakikalık aralık keyfi değil: dropshipping modelinde stok bilgisi eskirse satılan ürün tedarikçide bulunamaz ve sipariş iptale döner.",
          en: "The refresh runs through a custom Magento 2 module reading SYNAXON's XML feed. The module pulls stock, price, supplier, image and description fields and matches them against the catalogue, and the loop runs automatically around the clock. The five-minute interval is not arbitrary: in a dropshipping model, stale stock data means a sold product is missing at the supplier and the order turns into a cancellation.",
        },
      },
      {
        question: {
          tr: "Hangi teknolojiler kullanıldı?",
          en: "Which technologies were used?",
        },
        answer: {
          tr: "Platform Magento 2 üzerine kuruldu; veri hattı SOAP, XML ve PHP ile yazıldı. Bileşenler uçtan uca tek bir akış oluşturuyor ve üzerine senkron yükünü taşıyacak özel bir sunucu mimarisi yapılandırıldı. Veritabanı ile ön yüz ayrıca optimize edildi, çünkü sürekli yazma işlemi ile ziyaretçi trafiği aynı sistem üzerinde çalışıyor.",
          en: "The platform was built on Magento 2, with the data pipeline written in SOAP, XML and PHP. Those components form one end-to-end flow, and a dedicated server architecture was configured to carry the sync load on top of it. Database and frontend were optimised separately, because continuous writes and visitor traffic run on the same system.",
        },
      },
      {
        question: {
          tr: "Neden hazır bir eklenti yerine özel modül yazıldı?",
          en: "Why a custom module instead of an off-the-shelf extension?",
        },
        answer: {
          tr: "Hacim ve tazelik aralığı birlikte özel bir hat gerektirdi. 200.000'den fazla ürünün beş dakikada bir güncellenmesi, tedarikçinin kendi veri biçimine göre yazılmış bir modülle mümkün oldu; genel amaçlı bir içe aktarma eklentisi iki koşulu aynı anda karşılamıyor. Sipariş yönlendirme mantığı da aynı modülün içinde yaşıyor.",
          en: "Volume and refresh interval together demanded a purpose-built pipeline. Updating more than 200,000 products every five minutes was only possible with a module written against the supplier's own data format; a general-purpose import extension does not meet both conditions at once. The order routing logic also lives inside that same module.",
        },
      },
      {
        question: {
          tr: "Sipariş tedarikçiye nasıl ulaşıyor?",
          en: "How does an order reach the supplier?",
        },
        answer: {
          tr: "Sipariş, uygun tedarikçiye otomatik olarak yönleniyor ve süreçte manuel adım kalmadı. Önceki durumda her sipariş için doğru tedarikçiyi bulmak elle yapılıyor, bu da yanıt süresini kişiye bağlı kılıyordu. MKComputer'da artık ürün, fiyat ve tedarikçi eşleşmesi senkronla güncel tutulduğu için yönlendirme kararı sistemin elinde.",
          en: "Each order routes automatically to the right supplier, with no manual step left in the process. Previously, finding that supplier was done by hand for every order, which made response time depend on individuals. At MKComputer the product, price and supplier match is kept current by the sync, so the routing decision now sits with the system.",
        },
      },
      {
        question: {
          tr: "Yüz binlerce ürün içinde arama nasıl çalışıyor?",
          en: "How does search work across hundreds of thousands of products?",
        },
        answer: {
          tr: "Arama, spesifikasyon bazlı filtrelerle çalışıyor. Alıcı 8, 16 veya 32 GB bellek gibi teknik ölçütlerle daraltma yapabiliyor; önceki altyapıda bu mümkün değildi ve yüz binlerce ürün pratikte gezilemiyordu. Filtre akışı dönüşüm odaklı arayüzle birlikte tasarlandı, böylece daraltma adımı doğrudan satın alma adımına bağlandı.",
          en: "Search works through specification-based filters. Buyers narrow by technical criteria such as 8, 16 or 32 GB of memory, which the previous stack could not do — hundreds of thousands of products were effectively unbrowsable. The filter flow was designed together with a conversion-focused interface, so narrowing leads straight into the purchase step.",
        },
      },
      {
        question: {
          tr: "Dropshipping modeli maliyeti nasıl değiştiriyor?",
          en: "How does the dropshipping model change costs?",
        },
        answer: {
          tr: "Model, stok, depo ve lojistik maliyetini ortadan kaldırıyor. Ürün tedarikçide duruyor, satış MKComputer üzerinden yapılıyor ve sipariş doğrudan tedarikçiye yönleniyor. Kazanç yalnız veri güncelse gerçekleşir; eskimiş fiyat marjı yer, eskimiş stok siparişi iptale götürür. İşin merkezinde bu yüzden senkron var, arayüz değil.",
          en: "The model removes stock, warehouse and logistics cost. Product stays with the supplier, the sale happens through MKComputer and the order routes straight back. The saving only holds while the data is current: a stale price eats the margin and stale stock turns an order into a cancellation. That is why sync, not the interface, sits at the centre of the build.",
        },
      },
      {
        question: {
          tr: "Platform şu anda nerede çalışıyor?",
          en: "Where does the platform run today?",
        },
        answer: {
          tr: "Platform Avrupa genelinde canlı. Katalog, spesifikasyon araması, satın alma ve sipariş yönlendirme akışının tamamı bu kurulum üzerinden yürüyor. Almanya merkezli bir teknoloji perakendecisi olarak MKComputer, tek bir kurulumdan birden çok pazara satış yapıyor ve ürün verisi her pazarda aynı senkron döngüsünden besleniyor.",
          en: "The platform is live across Europe. Catalogue, specification search, purchase and order routing all run on this setup. As a Germany-based technology retailer, MKComputer sells into several markets from a single installation, and product data in every market is fed by the same sync loop.",
        },
      },
      {
        question: {
          tr: "Aynı kurgu başka bir katalog için işe yarar mı?",
          en: "Would the same setup work for another catalogue?",
        },
        answer: {
          tr: "Kurgu, tedarikçi yapılandırılmış bir veri akışı veriyorsa işe yarar. MKComputer'da SYNAXON'un XML akışı vardı; akış yoksa ya da alanlar tutarsızsa iş önce veri kalitesine döner ve otomasyon ikinci adıma kayar. Ürün sayısı arttıkça senkron aralığı ile sunucu mimarisi birlikte tasarlanır, çünkü ikisi birbirinin sınırını belirler.",
          en: "The setup works when the supplier provides a structured feed. SYNAXON's XML feed existed at MKComputer; without a feed, or with inconsistent fields, the work turns first to data quality and automation moves to the second step. As product counts rise, sync interval and server architecture get designed together, because each sets the other's limit.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma özel yazılım ve mobil uygulama, e-ticaret, iş otomasyonları ve dönüşüm optimizasyonu hizmetlerinin kapsamına giriyor. Modül geliştirme, sunucu mimarisi ve arayüz çalışması aynı projede yürüdü. Dört hizmetin tek işte birleşmesi tesadüf değil: veri hattı olmadan arayüz boş kalıyor, arayüz olmadan da güncel veri satışa dönüşmüyor.",
          en: "The work falls under custom software and mobile apps, e-commerce, business automation and conversion optimisation. Module development, server architecture and interface work ran inside the same project. Four services meeting in one job is not a coincidence: without the pipeline the interface stays empty, and without the interface current data never turns into sales.",
        },
      },
      {
        question: {
          tr: "Benzer bir iş için nereden başlanır?",
          en: "Where would a similar project start?",
        },
        answer: {
          tr: "Başlangıç noktası tedarikçi veri akışının denetimidir. Hangi alanlar geliyor, ne sıklıkla değişiyor ve hangi biçimde yazılıyor sorularının cevabı hem senkron aralığını hem sunucu ihtiyacını belirler. Denetim tamamlanmadan Magento, sunucu veya arayüz kararı verilmez; mimari, veri akışının hacmine ve düzensizliğine göre şekillenir.",
          en: "The starting point is an audit of the supplier feed. Which fields arrive, how often they change and in what format together determine both the sync interval and the server requirement. No decision on Magento, servers or interface is taken before that audit closes; the architecture is shaped by the volume and irregularity of the feed.",
        },
      },
    ],
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
        en: "Desktop storefront — spec-filtered catalogue and campaign areas",
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
    serviceSlugs: [
      "ui-ux-tasarim",
      "performans-pazarlama",
    ],
    title: {
      tr: "Biyonik protezde ilk 3, ayda 10 yeni hasta.",
      en: "Top 3 for bionic prosthetics, 10 new patients a month.",
    },
    lead: {
      tr: "İstanbul Ortez Protez'in dijital varlığını sıfırdan kurduk: mobil öncelikli site, yenilenen marka kimliği, arama ve AI motorları için optimize içerik. 15 ayda öncelikli anahtar kelimelerde ilk 3'e çıktık; toplam 50'den fazla korse ve protez hastası kazandırdık.",
      en: "We rebuilt İstanbul Ortez Protez's digital presence from the ground up: a mobile-first site, a renewed brand identity, and content optimised for both search and AI engines. In 15 months we reached the top 3 for priority keywords and won more than 50 brace and prosthetics patients.",
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
        value: { tr: "İlk 3", en: "Top 3" },
        label: { tr: "Google sıralaması", en: "Google ranking" },
        context: {
          tr: "Biyonik protez ve öncelikli kelimeler, organik",
          en: "Bionic prosthetics and priority keywords, organic",
        },
      },
      {
        value: { tr: "10 / ay", en: "10 / mo" },
        label: { tr: "Yeni hasta", en: "New patients" },
        context: {
          tr: "Skolyoz korsesi gibi kelimelerde Google Ads ile",
          en: "Via Google Ads on terms like scoliosis brace",
        },
      },
      {
        value: { tr: "50+", en: "50+" },
        label: { tr: "Toplam hasta", en: "Total patients" },
        context: {
          tr: "15 ayda; korse ve protez birlikte",
          en: "Over 15 months; braces and prosthetics combined",
        },
      },
    ],
    durationWeeks: 65,
    seo: {
      title: {
        tr: "İstanbul Ortez Protez: ilk 3 sıra, ayda 10 hasta",
        en: "İstanbul Ortez Protez: top 3, 10 patients a month",
      },
      description: {
        tr: "İstanbul Ortez Protez'in sitesini, marka kimliğini ve içeriğini sıfırdan kurduk: 15 ayda öncelikli kelimelerde ilk 3, ayda 10 yeni hasta, toplam 50+ hasta.",
        en: "We rebuilt İstanbul Ortez Protez's site, brand identity and content from zero: top 3 for priority keywords in 15 months, 10 new patients a month, 50+ total.",
      },
    },
    faq: [
      {
        question: {
          tr: "İlk 3 sıraya ne kadar sürede çıkıldı?",
          en: "How long did reaching the top 3 take?",
        },
        answer: {
          tr: "Çalışma Kasım 2024'te başladı ve Şubat 2026'ya kadar 15 ay sürdü. Öncelikli anahtar kelimelerde organik ilk 3 sıra bu süre içinde alındı. Sağlık alanında sıralama tek bir kampanyayla değil, içeriğin birikmesiyle geliyor; hasta güveni gerektiren aramalarda arama motoru da yeni bir kaynağı hemen öne almıyor.",
          en: "The engagement started in November 2024 and ran 15 months to February 2026. The organic top 3 on priority keywords was reached inside that window. In healthcare, ranking comes from content accumulating rather than from a single campaign; on searches that require patient trust, a search engine does not promote a new source quickly either.",
        },
      },
      {
        question: {
          tr: "Başlangıçta durum neydi?",
          en: "What was the starting point?",
        },
        answer: {
          tr: "Hasta kazanımı tamamen tavsiyeye bağlıydı. İstanbul Ortez Protez'in sitesi ne mobilde ne aramada rekabet edebiliyordu ve ölçülebilir, tekrarlanabilir bir kanal yoktu. Biyonik protez ve skolyoz korsesi gibi yüksek niyetli aramalarda marka görünmüyordu. Tıbbi alanda güven veren bir dijital kimlik de bulunmuyordu, bu yüzden iş görünürlükten önce kimliği kapsadı.",
          en: "Patient acquisition depended entirely on referrals. The İstanbul Ortez Protez site could compete neither on mobile nor in search, and there was no measurable, repeatable channel. The brand was invisible for high-intent searches such as bionic prosthetics and scoliosis brace. There was also no digital identity that built trust in a medical field, so the work covered identity before visibility.",
        },
      },
      {
        question: {
          tr: "Hangi anahtar kelimeler hedeflendi?",
          en: "Which keywords were targeted?",
        },
        answer: {
          tr: "Hedef listesi, biyonik protez ve skolyoz korsesi başta olmak üzere yüksek niyetli kelimelerden ve uzun kuyruklu aramalardan oluştu. Rakip analizinde büyük oyuncuların atladığı uzun kuyruklu fırsatlar haritalandı; öncelik ham hacimden değil, niyet ile rekabet dengesinden çıktı. Hacmi yüksek ama niyeti belirsiz kelimeler bilinçli olarak listenin dışında bırakıldı.",
          en: "The target list was built from high-intent terms led by bionic prosthetics and scoliosis brace, alongside long-tail searches. Competitor analysis mapped the long-tail openings the big players had skipped, and priority came from the balance of intent and competition rather than raw volume. High-volume terms with unclear intent were deliberately left off the list.",
        },
      },
      {
        question: {
          tr: "Organik çalışma ile reklam nasıl bölündü?",
          en: "How was the split made between organic work and ads?",
        },
        answer: {
          tr: "Organik taraf bilgi arayan hastayı, reklam tarafı satın alma niyeti belirgin olanı karşıladı. Biyonik protezde organik ilk 3 sıra alındı; skolyoz korsesi gibi ticari niyetli kelimelerde Google Ads yürütüldü. Yüksek rekabetli kelimelerde manuel teklif, uzun kuyruklu hedeflemeyle dengelendi ve bütçe pahalı kelimelerin tamamına yayılmadı.",
          en: "Organic served patients looking for information, while ads served those with clear purchase intent. Bionic prosthetics reached the organic top 3, and Google Ads ran on commercially intent terms such as scoliosis brace. On high-competition terms, manual bidding was balanced with long-tail targeting so the budget was not spread across every expensive keyword.",
        },
      },
      {
        question: {
          tr: "Ayda 10 yeni hasta nereden geliyor?",
          en: "Where do the 10 new patients a month come from?",
        },
        answer: {
          tr: "Aylık rakam Google Ads'ten geliyor. Ölçü, skolyoz korsesi gibi ticari niyetli kelimelerde yürütülen reklamların aylık ortalamasıdır; tek bir ayın zirvesi değil, çalışma boyunca tutulan ortalamadır. 15 aylık toplam ise korse ve protez birlikte 50'den fazla hastadır ve iki ürün grubu ayrı ayrı raporlanır.",
          en: "The monthly figure comes from Google Ads. It is the monthly average from ads on commercially intent terms such as scoliosis brace — an average held across the engagement, not the peak of a single month. The 15-month total is more than 50 patients across braces and prosthetics combined, with the two product groups reported separately.",
        },
      },
      {
        question: {
          tr: "İçerikte yapay zeka motorları için ne farklı yapıldı?",
          en: "What was done differently in the content for AI engines?",
        },
        answer: {
          tr: "İçerik, soru-cevap yapısı ve kendine yeten pasajlarla yazıldı. Metin hem klasik arama hem yapay zeka motorları düşünülerek kuruldu: her bölüm tek başına okunduğunda tam bir cevap veriyor ve teknik derinlik cümlenin içinde kalıyor. Yapı alıntılanmayı kolaylaştırıyor, çünkü motor pasajı bağlamından kopardığında anlam kaybı olmuyor.",
          en: "Content was written with a Q&A structure and self-contained passages. The text was built for classic search and AI engines alike: each section gives a complete answer when read on its own, with the technical depth kept inside the sentence. That structure makes citation easier, because nothing is lost when an engine lifts a passage out of its context.",
        },
      },
      {
        question: {
          tr: "Mobil neden öncelikliydi?",
          en: "Why was mobile the priority?",
        },
        answer: {
          tr: "Trafiğin çoğunluğu mobilden geliyordu, bu yüzden tasarım mobil öncelikli kuruldu. Arayüz hız ve okunabilirlik üzerine yapılandırıldı; hasta, ürünü tanıyacak bilgiyi telefon ekranında uzun uzun kaydırmadan bulabiliyor. Tıbbi ürün aramalarında karar süreci kısa ve endişeli olduğu için, yavaş açılan bir sayfa sıralamadan önce hastayı kaybettiriyor.",
          en: "Most traffic arrived on mobile, so the design was built mobile-first. The interface was structured around speed and readability, letting a patient find what they need to understand the product without long scrolling on a phone. In medical product searches the decision is short and anxious, so a slow page loses the patient before ranking ever matters.",
        },
      },
      {
        question: {
          tr: "Marka kimliği neden bu işin parçası oldu?",
          en: "Why was brand identity part of this project?",
        },
        answer: {
          tr: "Tıbbi alanda güven, görünürlükten önce geliyor. İlk sayfaya çıkmak, ziyaretçi siteye girdiğinde güven bulamıyorsa hasta kazandırmaz. Kimlik logodan basılı malzemeye kadar yenilendi ve dijital ile fiziksel temas noktaları aynı dili konuşur hale geldi. Ürün broşürü de aynı çalışmanın parçasıydı; 3D korse üretiminin teknik hikayesi orada anlatıldı.",
          en: "In a medical field, trust precedes visibility. Reaching the first page wins no patients if the visitor finds nothing trustworthy on arrival. The identity was renewed from logo to print, bringing digital and physical touchpoints into one language. The product brochure was part of the same work, carrying the technical story of 3D brace production.",
        },
      },
      {
        question: {
          tr: "Sonuç sürdürülebilir mi?",
          en: "Is the result sustainable?",
        },
        answer: {
          tr: "Aylık ortalama 15 ay boyunca korundu, yani sonuç tek seferlik bir sıçrama değil. Organik sıralama içerik birikimine, reklam tarafı sürekli yönetime bağlı; ikisi birlikte yürüdüğü sürece hasta akışı düzenli kalıyor. Kurucunun ifadesiyle hastalar artık tavsiyeyle değil arayarak buluyor ve gelen yeni hasta sayısı her ay düzenli.",
          en: "The monthly average held across 15 months, so the result is not a one-off spike. Organic ranking rests on accumulated content and the ad side on continuous management, and while both run the patient flow stays steady. In the founder's words, patients now find them by searching rather than by referral, and the flow of new patients is steady every month.",
        },
      },
      {
        question: {
          tr: "Aynı yaklaşım başka bir sağlık işletmesinde işe yarar mı?",
          en: "Would the same approach work for another healthcare business?",
        },
        answer: {
          tr: "Yaklaşım, rakiplerin boş bıraktığı uzun kuyruklu alan varsa işe yarar. İstanbul Ortez Protez vakasında büyük oyuncular teknik ve niş aramaları atlamıştı; boşluk oradaydı. Alan doluysa ilk 3 sıra aynı sürede gelmez ve öncelik reklam ile dönüşüm tarafına kayar. İkinci koşul içerik üretebilecek bir uzmanlığın firmada bulunmasıdır.",
          en: "The approach works where competitors have left long-tail ground open. In the İstanbul Ortez Protez case the big players had skipped technical and niche searches, and that was the opening. Where the ground is taken, the top 3 does not arrive on the same timeline and priority shifts to ads and conversion. The second condition is in-house expertise deep enough to feed the content.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma UI/UX tasarım ile performans pazarlama hizmetlerinin kapsamına giriyor. Marka kimliği, arama içeriği ve reklam yönetimi bu iki hizmetin altında yürüdü. Site geliştirme tasarım tarafıyla aynı ekipte ilerledi; arama ve reklam tarafı ise 15 ay boyunca sürekli yönetim olarak devam etti, tek seferlik bir kurulum olarak değil.",
          en: "The work falls under UI/UX design and performance marketing. Brand identity, search content and ad management all ran under those two. Site development moved with the design side in one team, while search and advertising continued as ongoing management across 15 months rather than a one-off setup.",
        },
      },
    ],
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
    serviceSlugs: [
      "marka-stratejisi",
      "ui-ux-tasarim",
      "performans-pazarlama",
    ],
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
        value: { tr: "100.000 $", en: "$100,000" },
        label: { tr: "Ciro", en: "Revenue" },
        context: {
          tr: "İlk 3 ayda; 12 aylık hedefin tamamı",
          en: "In the first 3 months; the full 12-month target",
        },
      },
      {
        value: { tr: "20×", en: "20×" },
        label: { tr: "ROAS", en: "ROAS" },
        context: {
          tr: "Üzerinde seyretti; lüks dekorasyon kategorisinde",
          en: "Held above; in the luxury decor category",
        },
      },
      {
        value: { tr: "3.000+", en: "3,000+" },
        label: { tr: "Sipariş", en: "Orders" },
        context: {
          tr: "4 aylık çalışma boyunca",
          en: "Across the 4-month engagement",
        },
      },
    ],
    durationWeeks: 17,
    seo: {
      title: {
        tr: "FYR Luxury: 12 aylık ciro hedefi 3 ayda aşıldı",
        en: "FYR Luxury: a 12-month target passed in 3 months",
      },
      description: {
        tr: "FYR Luxury'nin marka konumunu, arayüzünü ve kreatif üretimini kurduk: doygun bir kategoride 3 ayda 100.000 dolar ciro, 20× ROAS ve 3.000+ sipariş.",
        en: "We built FYR Luxury's positioning, interface and creative production: $100,000 revenue, 20× ROAS and 3,000+ orders in three months in a saturated category.",
      },
    },
    faq: [
      {
        question: {
          tr: "12 aylık hedef gerçekten 3 ayda mı aşıldı?",
          en: "Was the 12-month target really passed in 3 months?",
        },
        answer: {
          tr: "Hedef ilk üç ayda aşıldı: ciro 100.000 doları geçti ve rakam markanın 12 aylık hedefinin tamamıydı. FYR çalışmasının toplamı dört ay sürdü ve bu sürede 3.000'den fazla sipariş çıktı. İki rakam farklı pencereleri ölçtüğü için doğrudan bölünmez; ciro ilk üç aya, sipariş sayısı dört ayın tamamına ait.",
          en: "The target was passed in the first three months: revenue exceeded $100,000, which was the brand's entire 12-month goal. The FYR engagement ran four months in total, and more than 3,000 orders shipped in that time. The two figures measure different windows and should not be divided into one another — revenue covers the first three months, order count the full four.",
        },
      },
      {
        question: {
          tr: "Marka sıfırdan başlarken ilk adım ne oldu?",
          en: "What was the first step for a brand starting from zero?",
        },
        answer: {
          tr: "İlk adım konumlandırma oldu. FYR'nin bilinirliği, müşteri verisi ve satış geçmişi yoktu; bu yüzden önce markanın üst segmentteki yeri ve hedef kitlenin satın alma anı tanımlandı. Arayüz, çekim ve kampanya kararları bu tanımdan sonra alındı. Sıfırdan başlayan bir markada konum yazılmadan verilen her karar sonradan geri alınır.",
          en: "The first step was positioning. FYR had no awareness, no customer data and no sales history, so the brand's place at the high end and the audience's purchase moment were defined first. Interface, photography and campaign decisions all followed from that definition. For a brand starting from zero, every decision taken before the position is written gets reversed later.",
        },
      },
      {
        question: {
          tr: "Doygun bir kategoride nasıl ayrışıldı?",
          en: "How did the brand stand out in a saturated category?",
        },
        answer: {
          tr: "Ayrışma algı üzerinden kuruldu. Lüks ev dekorasyonunda üst segment alıcı fiyattan değil algıdan satın alıyor; ürün fotoğrafı ve arayüz kalitesi bu algının taşıyıcısı oluyor. Çekimler sabit bir renk paletiyle planlandı, böylece ürün, mekan ve ambalaj kareleri aynı marka dünyasını anlattı ve marka tek bir görsel imzayla tanınır hale geldi.",
          en: "The separation was built on perception. In luxury home decor the high-end buyer purchases on perception rather than price, and product photography and interface quality carry that perception. Shoots were planned around a fixed colour palette, so product, interior and packaging frames all told the same brand world and the brand became recognisable through one visual signature.",
        },
      },
      {
        question: {
          tr: "Reklam getirisi 20 katın üzerinde nasıl tutuldu?",
          en: "How was return on ad spend held above 20×?",
        },
        answer: {
          tr: "Getiri, test-öğren döngüsüyle bu seviyede tutuldu. Kampanyalar sürekli ölçüldü ve bütçe kazanan kreatif ile kitleye kaydırıldı; kaybeden kombinasyonlar hızla kapatıldı. Oran çalışma süresince 20 katın üzerinde seyretti. Yüksek sepet değeri de payı büyüttü: lüks segmentte tek satış, aynı tıklama maliyetiyle daha fazla gelir üretiyor.",
          en: "The return was held at that level through a test-and-learn loop. Campaigns were measured continuously and budget shifted to the winning creative and audience, while losing combinations were closed quickly. The ratio stayed above 20× across the engagement. High basket value widened the margin too: in the luxury segment a single sale produces more revenue at the same cost per click.",
        },
      },
      {
        question: {
          tr: "Kreatif prodüksiyon neden bu kadar merkezdeydi?",
          en: "Why was creative production so central?",
        },
        answer: {
          tr: "Kreatif merkezdeydi, çünkü fiyat konumlandırması doğrudan görsel kaliteye bağlı. Ürün fotoğrafı ve arayüz lüks standardının altında kalırsa fiyat savunulamaz hale gelir ve konumlandırma çöker. FYR'de ürün ve mekan çekimleri, ambalaj ile etiket detayına kadar tek bir görsel dilde üretildi; her kare aynı ışık, doku ve palet kararını taşıdı.",
          en: "Creative was central because price positioning depends directly on visual quality. If product photography and the interface fall below the luxury standard, the price becomes indefensible and the positioning collapses. At FYR, product and interior shoots were produced in a single visual language down to packaging and tag detail, with every frame carrying the same decisions on light, texture and palette.",
        },
      },
      {
        question: {
          tr: "Arayüzde ne yapıldı?",
          en: "What was done on the interface?",
        },
        answer: {
          tr: "Arayüz lüks, sade ve hızlı kuruldu; satın alma akışını kısaltan yazılım geliştirmeleri eklendi. Amaç, ziyaretçinin ürünü gördüğü an ile ödeme adımı arasındaki mesafeyi azaltmaktı. Lüks segmentte fazladan her adım tereddüt üretiyor, çünkü alıcı fiyatı sorguladığı anda satın alma niyeti zayıflıyor. Hız da aynı nedenle ayrı bir ölçüt olarak izlendi.",
          en: "The interface was built luxurious, plain and fast, with software work that shortened the purchase flow. The goal was to reduce the distance between seeing the product and reaching the payment step. In the luxury segment every extra step produces hesitation, because the moment a buyer starts questioning the price the intent weakens. Speed was tracked as its own metric for the same reason.",
        },
      },
      {
        question: {
          tr: "3.000 sipariş hangi sürede çıktı?",
          en: "Over what period did the 3,000 orders ship?",
        },
        answer: {
          tr: "Sipariş sayısı dört aylık çalışmanın tamamına ait. Ciro rakamı ise ilk üç ayın toplamıdır; iki rakam farklı pencereleri ölçtüğü için doğrudan bölünüp ortalama sepet çıkarılmaz. Sipariş adedi ayrı raporlanıyor, çünkü ciro tek başına hacmi göstermiyor: yüksek fiyatlı bir kategoride aynı ciro çok farklı sipariş sayılarından çıkabilir.",
          en: "The order count covers the full four-month engagement, while the revenue figure is the total for the first three months. The two measure different windows, so dividing one by the other does not give an average basket. Order volume is reported separately because revenue alone does not show volume: in a high-priced category the same revenue can come from very different order counts.",
        },
      },
      {
        question: {
          tr: "Bütçe kampanyalar arasında nasıl dağıtıldı?",
          en: "How was budget distributed across campaigns?",
        },
        answer: {
          tr: "Dağıtım sonuca göre yapıldı. Her kreatif ve kitle kombinasyonu ayrı ölçüldü, kaybedenler kapatıldı ve harcama kazananlara aktarıldı. Sıfırdan başlayan bir markada bu döngü, doğru mesajı tahminle değil ölçümle bulmanın yolu. Geçmiş müşteri verisi olmadığı için ilk haftalar bilinçli olarak öğrenme bütçesi kabul edildi ve kazanan bulunduktan sonra ölçek büyütüldü.",
          en: "Distribution followed results. Each creative and audience combination was measured separately, losers were closed and spend moved to the winners. For a brand starting from zero, that loop is how the right message is found by measurement rather than assumption. With no historical customer data, the first weeks were deliberately treated as learning budget, and scale followed once a winner emerged.",
        },
      },
      {
        question: {
          tr: "Aynı yaklaşım başka bir lüks markada işe yarar mı?",
          en: "Would the same approach work for another luxury brand?",
        },
        answer: {
          tr: "Yaklaşım, ürün ve ambalaj kadrajı taşıyorsa işe yarar. FYR'de iş, var olan bir kaliteyi görünür kılmaktı; ürünün kendisi lüks algısını taşımıyorsa kreatif bunu telafi etmez. İkinci koşul fiyat disiplinidir: indirimle büyüyen bir markada üst segment konumu tutmaz, çünkü indirim algıyı fiyata geri indirger.",
          en: "The approach works when the product and its packaging can carry the frame. At FYR the job was making an existing quality visible; where the product itself does not hold a luxury read, creative cannot compensate. The second condition is price discipline: a brand that grows on discounts cannot hold a high-end position, because discounting pulls perception back down to price.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma marka stratejisi ve pazarlama danışmanlığı, UI/UX tasarım ile performans pazarlama hizmetlerinin kapsamına giriyor. Fotoğraf ve video prodüksiyonu marka stratejisinin uygulama tarafı olarak aynı projede yürüdü. Üç hizmet aynı takvimde ilerledi, çünkü konumlandırma kararı hem çekim yönünü hem arayüz kurgusunu hem kampanya hedefini birlikte belirledi.",
          en: "The work falls under brand strategy and marketing advisory, UI/UX design and performance marketing. Photo and video production ran inside the same project as the execution arm of brand strategy. The three services moved on one schedule, because the positioning decision set art direction, interface structure and campaign goals at the same time.",
        },
      },
      {
        question: {
          tr: "Benzer bir lansman için nereden başlanır?",
          en: "Where would a similar launch start?",
        },
        answer: {
          tr: "Başlangıç noktası konumlandırma ve satın alma anının tanımıdır. Kimin, hangi anda ve hangi gerekçeyle satın aldığı yazılmadan ne kreatif yönü ne kampanya hedefi kurulabilir. İkinci adım görsel dilin palet ve doku düzeyinde sabitlenmesidir; sabit olmayan bir palet, her kampanyada markayı yeniden tanıtmak zorunda bırakır.",
          en: "The starting point is positioning and a definition of the purchase moment. Until who buys, at what moment and for what reason is written down, neither art direction nor campaign goals can be set. The second step is fixing the visual language at the level of palette and texture; an unfixed palette forces the brand to introduce itself again with every campaign.",
        },
      },
    ],
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
    serviceSlugs: [
      "marka-stratejisi",
      "ui-ux-tasarim",
    ],
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
    seo: {
      title: {
        tr: "Feruza Elegance: klasik çizgiden lüks perakendeye",
        en: "Feruza Elegance: from classic to luxury retail",
      },
      description: {
        tr: "Feruza Elegance'ı modern-lüks çizgiye taşıdık; görsel dilini ve web varlığını yeniden kurduk. Süreç tanınmış bir butik perakende zinciriyle anlaşmayla bitti.",
        en: "We moved Feruza Elegance to a modern-luxury line and rebuilt its visual language and web presence. The work ended in a deal with a boutique retail chain.",
      },
    },
    faq: [
      {
        question: {
          tr: "Bu vakada sonuç nasıl ölçüldü?",
          en: "How was the outcome measured in this case?",
        },
        answer: {
          tr: "Feruza Elegance çalışmasında sayısal metrik yayımlanmıyor. Ölçülebilir çıktı, Türkiye'nin tanınmış butik perakende zincirlerinden biriyle imzalanan anlaşma ve ürünlerin o zincirin raflarına girmesiydi. Satış rakamlarını paylaşma iznimiz yok; doğrulayamadığımız bir rakamı da yazmıyoruz. Sayfadaki ölçüm bandının boş olması bu yüzden bir eksiklik değil, bilinçli bir karar.",
          en: "No numeric metrics are published for the Feruza Elegance engagement. The measurable outcome was a distribution agreement with one of Türkiye's best-known boutique retail chains and the products reaching that chain's shelves. We do not have permission to share sales figures, and we do not publish numbers we cannot verify. The empty metrics band on this page is a deliberate choice rather than an omission.",
        },
      },
      {
        question: {
          tr: "Perakende anlaşması nasıl geldi?",
          en: "How did the retail agreement come about?",
        },
        answer: {
          tr: "Anlaşma, markanın raf değerini gösterebilir hale gelmesiyle geldi. Perakende ortağı arayan bir markada eksik olan şey çoğu zaman ürün değil, o ürünün hangi segmentte durduğunu anlatan dildir. Feruza'da konum, görsel dil ve web varlığı bu anlatıyı kurdu; el yapımı üretimin kalitesi ilk kez fotoğrafta ve sitede görünür oldu.",
          en: "The agreement followed from the brand becoming able to show its shelf value. What a brand seeking a retail partner usually lacks is not the product but the language that says which segment it belongs to. At Feruza, positioning, visual language and web presence built that account, and the quality of handcrafted production became visible in photography and on the site for the first time.",
        },
      },
      {
        question: {
          tr: "Neden yeniden konumlandırma gerekti?",
          en: "Why was repositioning necessary?",
        },
        answer: {
          tr: "Marka klasik ve geleneksel bir çizgide duruyordu; lüks demografi bu dili satın almıyordu. Ürün el yapımıydı ama konumlandırma bu değeri karşılamıyordu, dolayısıyla üretim kalitesi fiyata ve rafa dönüşmüyordu. Marka klasik-geleneksel çizgiden modern-lüks çizgiye taşındı ve içerik stratejisi doğrudan bu yeni konuma bağlandı.",
          en: "The brand sat in a classic, traditional line that the luxury demographic was not buying. The product was handcrafted, but the positioning did not match that value, so production quality never converted into price or shelf space. The brand was moved from a classic-traditional line to a modern-luxury one, and the content strategy was tied directly to that new position.",
        },
      },
      {
        question: {
          tr: "Pazar araştırması neyi ortaya çıkardı?",
          en: "What did the market research reveal?",
        },
        answer: {
          tr: "Araştırma, hedef kitlenin tüketim alışkanlıklarını ve lüks segmentin satın alma kodlarını ortaya çıkardı. Kodlar hem çekim yönünü hem web sitesinin kurgusunu belirledi; konumlandırma kararı tahminle değil bu veriyle alındı. Ayakkabı ve moda kategorisinde alıcının neye baktığı, hangi detayı kalite işareti saydığı ve hangi fiyat aralığını hangi anlatıyla kabul ettiği yazıya geçirildi.",
          en: "The research surfaced the audience's consumption habits and the purchase codes of the luxury segment. Those codes set both art direction and the structure of the website, and the positioning decision came from that data rather than assumption. In footwear and fashion, what the buyer looks at, which detail reads as a quality signal and which narrative justifies which price band were all written down.",
        },
      },
      {
        question: {
          tr: "El işçiliği görsel dile nasıl taşındı?",
          en: "How was the craftsmanship carried into the visual language?",
        },
        answer: {
          tr: "Kadraj sadeleştirilerek taşındı. Kampanya ve ürün çekimleri tek bir görsel dilde üretildi; stüdyo kareleri monogramlı topuk ve iç taban gibi işçilik detaylarını öne aldı. Ürünün değeri fotoğrafta görünmediği sürece fiyatı da savunulamıyordu. Kampanya serisi ise ürünü bağlam içinde gösterdi, böylece detay ile yaşam tarzı aynı dilde buluştu.",
          en: "It was carried by simplifying the frame. Campaign and product shoots were produced in one visual language, and studio frames brought craft details such as the monogrammed heel and the insole forward. As long as the product's value stayed invisible in photography, its price could not be defended. The campaign series then showed the product in context, meeting detail and lifestyle in the same language.",
        },
      },
      {
        question: {
          tr: "Web sitesinde ne önceliklendirildi?",
          en: "What was prioritised on the website?",
        },
        answer: {
          tr: "Sitede satın alma güveni önceliklendirildi. Lüks segmentte tereddüt fiyattan değil güvenden çıkıyor: alıcı ürünün gerçekten anlatıldığı kalitede olup olmadığını bilmek istiyor. Site bu yüzden ürün anlatımı, görsel kalite ve akış netliği üzerine kuruldu. Tasarım ile geliştirme aynı ekipte yürüdü, böylece görsel dil kod tarafında bozulmadan yayına çıktı.",
          en: "Purchase confidence was the priority on the site. In the luxury segment hesitation comes from trust rather than price: the buyer wants to know whether the product is really the quality being described. The site was therefore built around product narrative, visual quality and clarity of flow. Design and development ran in one team, so the visual language reached production without degrading in code.",
        },
      },
      {
        question: {
          tr: "Sosyal medya bu işte ne rol oynadı?",
          en: "What role did social media play?",
        },
        answer: {
          tr: "Sosyal medya, yeni konumun günlük taşıyıcısı oldu. Operasyon strateji doğrultusunda yürütüldü ve kampanya serisinden çıkan görseller aynı çizgide kullanıldı. Böylece modern-lüks konum tek bir kampanyada kalmadı, sürekli görünen bir dile dönüştü. Perakende görüşmelerinde de markanın canlı bir kitleye sahip olduğu bu kanaldan görülebiliyordu.",
          en: "Social media became the daily carrier of the new position. The operation ran in line with the strategy and imagery from the campaign series was used on the same line. That kept the modern-luxury position from being confined to a single campaign, turning it into a language on continuous display. In retail conversations, this channel also showed that the brand had a live audience.",
        },
      },
      {
        question: {
          tr: "Anlaşma hangi zincirle imzalandı?",
          en: "Which chain was the agreement signed with?",
        },
        answer: {
          tr: "Zincirin adını yayımlamıyoruz. Anlaşma, Türkiye'nin tanınmış butik perakende zincirlerinden biriyle moda ve giyim alanında imzalandı ve ürünler bu zincirin raflarında satışa çıktı. İsim paylaşımı hem müşterinin hem zincirin onayına bağlı; onay olmadan marka adı yazmıyoruz. Vaka kayıtlarımızda müşteri adları açık, üçüncü taraflar ise onaya tabi.",
          en: "We do not publish the chain's name. The agreement was signed with one of Türkiye's best-known boutique retail chains in fashion and apparel, and the products went on sale on that chain's shelves. Naming depends on approval from both the client and the chain, and without it we do not print a brand name. In our case records client names are open, while third parties require consent.",
        },
      },
      {
        question: {
          tr: "Aynı yaklaşım başka bir üretici markada işe yarar mı?",
          en: "Would the same approach work for another manufacturer brand?",
        },
        answer: {
          tr: "Yaklaşım, üretim kalitesi varken anlatım eksikse işe yarar. Feruza'da ürün zaten iyiydi; eksik olan konum ve görsel dildi. Kalite sorunu olan bir üründe yeniden konumlandırma sorunu büyütür, çünkü beklentiyi ürünün karşılayamayacağı yere taşır ve ilk satın alma sonrası güven kaybı yaşanır. Ön koşul her zaman ürünün kendisidir.",
          en: "The approach works where production quality exists but the account of it is missing. At Feruza the product was already good; what was missing was position and visual language. On a product with quality problems, repositioning makes things worse, raising expectations the product cannot meet and costing trust after the first purchase. The precondition is always the product itself.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma marka stratejisi ve pazarlama danışmanlığı ile UI/UX tasarım hizmetlerinin kapsamına giriyor. Fotoğraf ile video prodüksiyonu ve sosyal medya yönetimi bu iki hizmetin uygulama tarafı olarak aynı projede yürüdü. Ayrı bir performans pazarlama kalemi açılmadı; işin hedefi reklam ölçeği değil, perakende ortağına gidebilecek bir marka konumuydu.",
          en: "The work falls under brand strategy and marketing advisory and UI/UX design. Photo and video production and social media management ran inside the same project as the execution arm of those two. No separate performance marketing line was opened, because the goal was not advertising scale but a brand position that could go to a retail partner.",
        },
      },
      {
        question: {
          tr: "Benzer bir iş için nereden başlanır?",
          en: "Where would a similar project start?",
        },
        answer: {
          tr: "Başlangıç noktası mevcut konumun denetimidir. Markanın kendini nerede gördüğü ile alıcının onu nerede gördüğü arasındaki fark ölçülür; yeniden konumlandırmanın kapsamı bu farkın büyüklüğüne göre belirlenir. Fark küçükse iş görsel dille sınırlı kalır, büyükse ürün adlandırmasından fiyat mimarisine kadar uzanır ve takvim buna göre yazılır.",
          en: "The starting point is an audit of the current position. The gap between where the brand sees itself and where the buyer sees it gets measured, and the scope of repositioning is set by the size of that gap. A small gap keeps the work within visual language; a large one stretches from product naming to price architecture, and the schedule is written accordingly.",
        },
      },
    ],
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
    serviceSlugs: [
      "ozel-yazilim-ve-mobil",
    ],
    title: {
      tr: "WordPress'ten Next.js'e: 15 kat organik trafik.",
      en: "WordPress to Next.js: 15× organic traffic.",
    },
    lead: {
      tr: "SIM Baskı Malzemeleri 1983'ten beri matbaa sektöründe üretim yapıyor; ancak WordPress altyapısı ne ihracat hedefini ne de teknik içerik derinliğini taşıyabiliyordu. Siteyi beş dilli bir Next.js uygulaması olarak yeniden kurduk ve içerik programını SEO ile GEO'yu birlikte gözeterek tasarladık. Altı ayda organik trafik 15 katına çıktı; AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı.",
      en: "SIM Printing Suppliers has manufactured for the press industry since 1983, but its WordPress stack carried neither the export ambition nor the depth of its technical content. We rebuilt the site as a five-language Next.js application and designed the content programme for SEO and GEO together. In six months organic traffic grew 15×, and visibility in AI engines went from zero to 40,000.",
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
        "We built the strategy from scratch, mapping the product catalogue, the search language of target markets and the technical topics competitors had left empty.",
        "The site was rebuilt as a Next.js web application; five languages were designed simultaneously, not bolted on as a later translation layer.",
        "We wrote deep content in technical guide format — tables of contents, Q&A sections and self-contained passages AI engines can cite.",
        "Performance was chased by measurement: page load was brought under one second and held there after launch.",
      ],
    },
    approachFlow: {
      tr: ["Strateji ve analiz", "Next.js webapp", "İçerik programı", "SEO ve GEO"],
      en: ["Strategy & analysis", "Next.js webapp", "Content programme", "SEO & GEO"],
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
        value: { tr: "15×", en: "15×" },
        label: { tr: "Organik trafik", en: "Organic traffic" },
        context: {
          tr: "6 ayda; yeniden platform ve içerik programıyla",
          en: "In 6 months; via replatforming and the content programme",
        },
      },
      {
        value: { tr: "40.000", en: "40,000" },
        label: { tr: "GEO görünürlüğü", en: "GEO visibility" },
        context: {
          tr: "Sıfırdan; AI motorlarında görünürlük",
          en: "From zero; visibility across AI engines",
        },
      },
      {
        value: { tr: "İlk 5", en: "Top 5" },
        label: { tr: "Google sıralaması", en: "Google ranking" },
        context: {
          tr: "Matbaa malzemeleri ve ana anahtar kelimeler",
          en: "Printing supplies and core keywords",
        },
      },
      {
        value: { tr: "<1 sn", en: "<1 s" },
        label: { tr: "Açılma süresi", en: "Load time" },
        context: {
          tr: "Beş dilli Next.js uygulaması",
          en: "Five-language Next.js application",
        },
      },
    ],
    durationWeeks: 26,
    seo: {
      title: {
        tr: "SIM Baskı: WordPress'ten Next.js'e, 15× organik",
        en: "SIM Printing: WordPress to Next.js, 15× organic",
      },
      description: {
        tr: "SIM Baskı Malzemeleri'nin sitesini beş dilli bir Next.js uygulaması olarak kurduk: altı ayda organik trafik 15 katına, GEO görünürlüğü 40.000'e çıktı.",
        en: "We rebuilt SIM Printing Suppliers' site as a five-language Next.js application: organic traffic grew 15× in six months and GEO visibility reached 40,000.",
      },
    },
    faq: [
      {
        question: {
          tr: "Organik trafik 15 kata ne kadar sürede çıktı?",
          en: "How long did organic traffic take to grow 15×?",
        },
        answer: {
          tr: "Artış altı ayda gerçekleşti. SIM Baskı Malzemeleri çalışmasının toplamı 26 hafta sürdü ve trafik artışı yeniden platform kurulumu ile içerik programının birlikte yürütülmesinden geldi. Tek başına platform değişikliği bu sonucu vermezdi; hızlanan bir sitede yayımlanacak içerik yoksa sıralama da değişmez. İki iş aynı takvimde ilerledi.",
          en: "The growth happened over six months. The SIM Printing Suppliers engagement ran 26 weeks in total, and the traffic increase came from replatforming and the content programme running together. Replatforming alone would not have produced it: a faster site with nothing new to publish does not move rankings. The two workstreams advanced on one schedule.",
        },
      },
      {
        question: {
          tr: "WordPress neden bırakıldı?",
          en: "Why was WordPress left behind?",
        },
        answer: {
          tr: "WordPress altyapısı hız ve çok dillilik yükünü taşımıyordu. Site yavaştı ve beş dilli bir ihracat sitesinin gereksinimlerini karşılamıyordu; her yeni dil mevcut kurulumun üstüne yama olarak biniyordu. Yeni kurulumda sayfa açılışı bir saniyenin altına indirildi ve eşik yayın sonrası da korundu, çünkü performans ölçülmeye devam etti.",
          en: "The WordPress stack could not carry the load of speed and multiple languages. The site was slow and did not meet the requirements of a five-language export site, with each new language landing as a patch on the existing install. On the new build page load was brought under one second and the threshold held after launch, because performance kept being measured.",
        },
      },
      {
        question: {
          tr: "Neden Next.js seçildi?",
          en: "Why was Next.js chosen?",
        },
        answer: {
          tr: "Seçimi iki gereklilik belirledi: beş dilin aynı mimaride yaşaması ve açılış süresinin ölçülebilir biçimde kontrol edilmesi. Site bir web uygulaması olarak yeniden inşa edildi; dil yapısı, içerik modeli ve performans bütçesi aynı kararın parçalarıydı. Teknoloji önce değil sonra seçildi — önce ihracat hedefi ve içerik derinliği yazıldı, araç ona göre belirlendi.",
          en: "Two requirements drove the choice: five languages living in one architecture, and load time under measurable control. The site was rebuilt as a web application, with language structure, content model and performance budget all part of the same decision. The technology was picked last, not first — the export goal and the depth of content were written down before the tool was named.",
        },
      },
      {
        question: {
          tr: "Beş dil sonradan mı eklendi?",
          en: "Were the five languages added later?",
        },
        answer: {
          tr: "Diller sonradan eklenmedi; beşi aynı anda tasarlandı. Çeviri katmanı mevcut bir yapının üstüne bindirilmedi, her dil kendi içerik yapısıyla baştan kuruldu. Yaklaşım, talebin Türkiye dışından gelmesinin önünü açtı ve yerel arama dillerinin birbirinden farklı olduğu gerçeğini yapının içine yerleştirdi. Sonradan eklenen dil, çoğu sitede yarım kalır.",
          en: "The languages were not added later; all five were designed at once. No translation layer was bolted onto an existing structure — each language was built from the start with its own content structure. The approach opened the door to demand from outside Türkiye and wrote the fact that local search languages differ into the architecture itself. A language added afterwards usually stays half-finished.",
        },
      },
      {
        question: {
          tr: "GEO görünürlüğü 40.000 ne anlama geliyor?",
          en: "What does 40,000 in GEO visibility mean?",
        },
        answer: {
          tr: "Ölçü, markanın yapay zeka motorlarındaki görünürlüğünü ifade ediyor ve sıfırdan 40 bine çıktı. Klasik arama sıralamasından ayrı bir göstergedir; aynı içeriğin arama motoru ile yapay zeka motoru tarafındaki karşılığı ayrı ayrı izleniyor. Sıfırdan başlaması önemli: marka daha önce bu motorlarda kaynak olarak hiç görünmüyordu, çünkü alıntılanacak yazılı içerik yoktu.",
          en: "The measure expresses the brand's visibility across AI engines, and it went from zero to 40,000. It is a separate indicator from classic search ranking; the same content is tracked separately on the search engine side and the AI engine side. Starting from zero matters: the brand had never appeared as a source in those engines, because there was no written content to cite.",
        },
      },
      {
        question: {
          tr: "İçeriğin alıntılanabilir olması için ne yapıldı?",
          en: "What made the content citable?",
        },
        answer: {
          tr: "İçerik, içindekiler yapısı, soru-cevap bölümleri ve kendine yeten pasajlarla yazıldı. Teknik rehber formatında her bölüm tek başına okunduğunda tam bir cevap veriyor; yapay zeka motorunun alıntıladığı birim de bu pasaj oluyor. Baskı kimyasalları gibi teknik konular, ürün kataloğunun diliyle değil okuyanın sorusuyla başlayacak şekilde kurgulandı.",
          en: "Content was written with a table of contents, Q&A sections and self-contained passages. In the technical guide format, each section gives a complete answer when read alone, and that passage is the unit an AI engine cites. Technical topics such as printing chemicals were structured to open with the reader's question rather than with the language of a product catalogue.",
        },
      },
      {
        question: {
          tr: "Kırk yıllık teknik bilgi içeriğe nasıl dönüştü?",
          en: "How did forty years of technical knowledge become content?",
        },
        answer: {
          tr: "Bilgi yazıya geçirilerek içeriğe dönüştü. 1983'ten beri süren üretimin birikimi hiçbir yerde yazılı değildi; ne arama motorunun ne yapay zeka motorunun alıntılayacağı bir kaynak vardı. Ürün kataloğu, hedef pazarların arama dili ve rakiplerin boş bıraktığı teknik konular haritalandı, içerik programı da doğrudan bu haritaya göre yazıldı.",
          en: "The knowledge became content by being written down. The accumulation from production running since 1983 existed nowhere in writing, so there was no source for a search engine or an AI engine to cite. The product catalogue, the search language of target markets and the technical topics competitors had left empty were mapped, and the content programme was written straight against that map.",
        },
      },
      {
        question: {
          tr: "Açılış süresi neden ayrı bir ölçüt oldu?",
          en: "Why was load time treated as its own metric?",
        },
        answer: {
          tr: "Performans yayın günü değil, sonrasında kaybediliyor. Sayfa açılışı bir saniyenin altına indirildi ve eşik yayın sonrası da korundu; ölçüm sürdüğü için gerileme fark edildiği anda düzeltiliyor. Beş dilli bir sitede bu ayrıca bir ihracat meselesi: yavaş bağlantıdan giren yurt dışı ziyaretçi, sayfa açılmadan siteyi terk ediyor.",
          en: "Performance is lost after launch day rather than on it. Page load was brought under one second and the threshold held after launch, and because measurement continues, any regression is corrected as soon as it appears. On a five-language site this is also an export question: an overseas visitor on a slow connection leaves before the page renders.",
        },
      },
      {
        question: {
          tr: "Beş dilli yapı ihracata ne kattı?",
          en: "What did the five-language structure add for exports?",
        },
        answer: {
          tr: "Yapı, talebin Türkiye dışından da gelmesini sağladı. Kurucunun ifadesiyle, kırk yılı aşkın süredir aynı işi yapan firma ilk kez dünyanın dört bir yanından talep almaya başladı. Her dilin kendi arama diliyle kurulmuş olması burada belirleyici: aynı ürün farklı pazarlarda farklı adla aranıyor ve çeviri bu farkı tek başına kapatmıyor.",
          en: "The structure opened demand from outside Türkiye. In the founder's words, a company doing the same work for over forty years began receiving requests from all over the world for the first time. Building each language around its own search vocabulary was decisive here: the same product is searched under different names in different markets, and translation alone does not close that gap.",
        },
      },
      {
        question: {
          tr: "Aynı yaklaşım başka bir üretici için işe yarar mı?",
          en: "Would the same approach work for another manufacturer?",
        },
        answer: {
          tr: "Yaklaşım, yazıya dökülmemiş teknik bilgi varsa işe yarar. SIM'de kaldıraç firmanın zaten sahip olduğu bilgiydi; içerik yalnız onu bulunabilir hale getirdi. Anlatacak teknik derinliği olmayan bir katalogda aynı program bu ölçekte sonuç vermez. İkinci koşul içeriği besleyecek bir uzmanın firmada bulunması — dışarıdan yazılan teknik metin bu derinliği taşımıyor.",
          en: "The approach works where technical knowledge exists but has never been written down. At SIM the lever was knowledge the company already held; content only made it findable. On a catalogue with no technical depth to explain, the same programme does not deliver at this scale. The second condition is an in-house expert to feed the content — technical text written from outside does not carry that depth.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmet kapsamına giriyor?",
          en: "Which service does this work fall under?",
        },
        answer: {
          tr: "Çalışma özel yazılım ve mobil uygulama hizmetinin kapsamına giriyor. Beş dilli mimari, içerik programı ve arama tarafı aynı çalışmanın parçaları olarak yürüdü. Ayrı bir hazır platform kurulumu yapılmadı; site sıfırdan bir uygulama olarak yazıldı, çünkü hedef yalnız yeni bir tasarım değil, ölçülebilir hız ile çok dilli içerik yapısıydı.",
          en: "The work falls under custom software and mobile apps. The five-language architecture, the content programme and the search side ran as parts of one engagement. No off-the-shelf platform was installed; the site was written from scratch as an application, because the goal was not simply a new design but measurable speed together with a multilingual content structure.",
        },
      },
    ],
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
          en: "Content programme — the table of contents and Q&A structure were built for GEO citability",
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
          en: "Product shoot — every product in the catalogue gained its own content",
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
    pillar: "transform",
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
    serviceSlugs: [
      "ozel-yazilim-ve-mobil",
      "ai-danismanlik",
      "is-otomasyonlari",
    ],
    title: {
      tr: "AI teknik danışmanla teklif talebinde 10 kat artış.",
      en: "10× more quote requests, driven by an AI technical advisor.",
    },
    lead: {
      tr: "Meccanotecnica Umbra, mekanik salmastranın dünya ölçeğindeki üreticilerinden birinin Türkiye markası; ancak yerel pazardaki teknik bilinirliği global konumunun gerisinde kalmıştı. Ürün kataloğunu, fabrikasını anlatan mühendise uygun donanımı çıkaran bir AI danışmana ve teklif portalına bağladık. Teklif talebi 10 katına çıktı, yanıt süresi yüzde doksan kısaldı.",
      en: "Meccanotecnica Umbra is the Türkiye arm of one of the world's leading mechanical seal manufacturers, yet its technical visibility in the local market lagged behind its global standing. We connected the product catalogue to an AI advisor that lays out the right equipment for an engineer describing their plant, and to a quote portal. Quote requests rose tenfold and response time dropped by ninety percent.",
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
        "We built the product catalogue with e-commerce depth: every product live with its technical description, imagery and a downloadable CAD file (STEP/DWG).",
        "We placed an AI technical advisor in a chat interface: the engineer describes their plant and the system lays out equipment for the whole facility in a single form.",
        "A command-palette search lets engineers find what they need in seconds, tying discovery straight to the quote step.",
        "In the quote portal buyers add multiple products to a list and send one form; the request lands in CRM automation, with data reaching the brand and a response reaching the customer automatically.",
        "The SEO and GEO architecture was built from scratch in four languages (TR, EN, AR, RU), positioning target and adjacent-market keywords in one structure.",
      ],
    },
    approachFlow: {
      tr: ["Katalog mimarisi", "AI teknik danışman", "Teklif portalı ve CRM", "SEO ve GEO"],
      en: ["Catalogue architecture", "AI technical advisor", "Quote portal & CRM", "SEO & GEO"],
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
        value: { tr: "10×", en: "10×" },
        label: { tr: "Teklif talebi", en: "Quote requests" },
        context: {
          tr: "Portal ve AI danışman devreye girdikten sonra",
          en: "After the portal and AI advisor went live",
        },
      },
      {
        value: { tr: "%90", en: "90%" },
        label: { tr: "Yanıt süresi kısalması", en: "Faster response" },
        context: {
          tr: "Talep–yanıt adımı CRM otomasyonunda",
          en: "The request-to-response step runs in CRM automation",
        },
      },
      {
        value: { tr: "15.000", en: "15,000" },
        label: { tr: "Aylık organik gösterim", en: "Monthly organic impressions" },
        context: {
          tr: "Sürekli artıyor; sıfırdan kurulan mimariyle",
          en: "Still climbing; on an architecture built from scratch",
        },
      },
      {
        value: { tr: "İlk 5", en: "Top 5" },
        label: { tr: "Google sıralaması", en: "Google ranking" },
        context: {
          tr: "Mekanik salmastra dahil tüm hedef anahtar kelimeler",
          en: "Every target keyword, mechanical seals included",
        },
      },
    ],
    durationWeeks: 22,
    seo: {
      title: {
        tr: "Meccanotecnica Umbra: teklif talebi 10 katına",
        en: "Meccanotecnica Umbra: 10× more quote requests",
      },
      description: {
        tr: "Meccanotecnica Umbra'nın ürün kataloğunu yapay zeka teknik danışmana ve teklif portalına bağladık: teklif talebi 10 katına çıktı, yanıt süresi %90 kısaldı.",
        en: "We connected Meccanotecnica Umbra's catalogue to an AI technical advisor and a quote portal: quote requests rose 10× and response time dropped by 90%.",
      },
    },
    faq: [
      {
        question: {
          tr: "Yapay zeka teknik danışman ne yapıyor?",
          en: "What does the AI technical advisor do?",
        },
        answer: {
          tr: "Danışman, mühendisin anlattığı tesise uygun donanımı çıkarıyor. Alıcı sohbet arayüzünde fabrikasını tarif ediyor ve sistem tüm tesis için uygun ürünleri tek bir form içinde listeliyor. Önceden bu seçim uzman desteği olmadan yapılamıyordu; her soru bir telefon görüşmesine dönüşüyordu. Mekanik salmastrada doğru seçim, çalışma basıncı ve akışkan gibi değişkenlere bağlı.",
          en: "The advisor lays out the equipment that fits the plant an engineer describes. The buyer describes their facility in a chat interface and the system lists suitable products for the whole site in a single form. Previously that selection could not be made without expert support, and every question turned into a phone call. In mechanical seals the right choice depends on variables such as operating pressure and the fluid handled.",
        },
      },
      {
        question: {
          tr: "Teklif talebi neden 10 katına çıktı?",
          en: "Why did quote requests rise tenfold?",
        },
        answer: {
          tr: "Artışın nedeni, mühendisin artık kendi listesini kurabilmesi. Ürün bulma akışı doğrudan teklif adımına bağlandı; alıcı birden çok ürünü listesine ekleyip tek formla gönderiyor. Öncesinde süreç telefon ve e-postaya bağlıydı ve her talep bir insan takibi gerektiriyordu. Sürtünme kalkınca talep sayısı arttı, çünkü sormanın maliyeti düştü.",
          en: "The rise came from engineers now being able to build their own list. The discovery flow was tied straight to the quote step, so a buyer adds several products to a list and sends one form. Before that the process ran on phone and email, and every request needed human follow-up. Once the friction went, request volume rose, because asking had become cheap.",
        },
      },
      {
        question: {
          tr: "Yanıt süresi %90 nasıl kısaldı?",
          en: "How did response time fall by 90%?",
        },
        answer: {
          tr: "Kısalma, talep-yanıt adımının CRM otomasyonuna geçmesiyle geldi. Gelen talep otomatik olarak sisteme düşüyor; markaya veri, müşteriye yanıt aynı anda gidiyor. Önceden bu adım elle işleniyordu ve hem süre hem takip kişiye bağlı kalıyordu. Otomasyon burada yalnız hız değil tutarlılık da kazandırdı: her talep aynı biçimde kaydediliyor.",
          en: "The drop came from the request-to-response step moving into CRM automation. An incoming request lands in the system automatically, with data reaching the brand and a reply reaching the customer at the same moment. Previously the step was handled by hand and both timing and follow-up depended on individuals. Automation added consistency as well as speed: every request is now recorded the same way.",
        },
      },
      {
        question: {
          tr: "Mühendis aradığı ürünü nasıl buluyor?",
          en: "How does an engineer find the product they need?",
        },
        answer: {
          tr: "Mühendis, komut paleti aramasıyla ve e-ticaret derinliğinde kurulmuş katalogla arıyor. Her ürün kendi teknik açıklaması ve görseliyle yayında; arama saniyeler içinde sonuca gidiyor. Öncesinde ürün çevrimiçi bulunup karşılaştırılamıyordu. Katalog mimarisi bilerek e-ticaret standardında kuruldu, çünkü endüstriyel alıcı da artık tüketici arayüzlerinin hızını bekliyor.",
          en: "Discovery runs through command-palette search and a catalogue built to e-commerce depth. Every product is live with its technical description and imagery, and search reaches a result in seconds. Before, products could neither be found nor compared online. The catalogue architecture was deliberately built to an e-commerce standard, because industrial buyers now expect the speed of consumer interfaces.",
        },
      },
      {
        question: {
          tr: "CAD dosyaları neden sitede yayında?",
          en: "Why are CAD files published on the site?",
        },
        answer: {
          tr: "Dosyalar, mühendis seçimini doğrulayabilsin diye yayında. Her ürünün STEP veya DWG dosyası indirilebiliyor; alıcı parçayı kendi tasarımında deneyip teklif adımına ondan sonra geçiyor. Endüstriyel satın almada doğrulama adımı satın alma kararından önce geliyor ve bu adım siteden yapılamadığında süreç tedarikçi değiştirmeye kadar gidebiliyor.",
          en: "The files are published so an engineer can verify their choice. A STEP or DWG file is downloadable for every product, letting a buyer test the part in their own design before moving to the quote step. In industrial purchasing, verification comes before the buying decision, and when that step cannot be done on the site the process can end in a change of supplier.",
        },
      },
      {
        question: {
          tr: "Neden dört dil seçildi?",
          en: "Why were four languages chosen?",
        },
        answer: {
          tr: "Diller hedef ve yan pazarların diline göre seçildi: Türkçe, İngilizce, Arapça ve Rusça. SEO ve GEO mimarisi dördünde de sıfırdan kuruldu ve anahtar kelimeler tek bir yapı içinde konumlandı. Dört dilli yapı yan pazarları da kapsadı; çalışmanın sonunda Türkiye arayüzü markanın global sitelerinin önüne geçti.",
          en: "The languages were chosen against the target and adjacent markets: Turkish, English, Arabic and Russian. The SEO and GEO architecture was built from scratch in all four, positioning keywords inside a single structure. The four-language build also covered adjacent markets, and by the end of the engagement the Türkiye interface had moved ahead of the brand's global sites.",
        },
      },
      {
        question: {
          tr: "Global bir markanın yerel sitesi neden sıfırdan kuruldu?",
          en: "Why was a global brand's local site built from scratch?",
        },
        answer: {
          tr: "Yerel teknik bilinirlik global konumun gerisindeydi. Meccanotecnica Umbra dünya ölçeğinde lider bir üreticinin Türkiye markası, ancak yerel pazarda ürün çevrimiçi bulunup karşılaştırılamıyordu ve teklif süreci telefona bağlıydı. Global sitelerin yerel arama diline ve alıcı alışkanlığına uyum sağlaması beklenmedi; yapı Türkiye pazarının kendi soruları üzerine kuruldu.",
          en: "Local technical visibility lagged behind the global position. Meccanotecnica Umbra is the Türkiye arm of a world-leading manufacturer, yet in the local market products could neither be found nor compared online and the quote process ran on the phone. Rather than waiting for global sites to adapt to local search language and buyer habits, the structure was built on the questions of the Türkiye market.",
        },
      },
      {
        question: {
          tr: "Arama tarafında ne ölçüldü?",
          en: "What was measured on the search side?",
        },
        answer: {
          tr: "Ölçüm aylık organik gösterim ve sıralama üzerinden yapıldı. Gösterim 15 bine ulaştı ve artmaya devam ediyor; hedef anahtar kelimelerin tamamında ilk 5 sırada yer alınıyor, mekanik salmastra dahil. Gösterim tıklamadan önce gelen göstergedir ve sıfırdan kurulan bir mimaride ilk sinyali o veriyor, çünkü sıralama daha oturmadan görünürlük ölçülebiliyor.",
          en: "Measurement ran on monthly organic impressions and ranking. Impressions reached 15,000 and keep climbing, and the brand ranks in the top 5 for every target keyword, mechanical seals included. Impressions are the indicator that arrives before clicks, and on an architecture built from scratch they give the first signal, because visibility can be measured before ranking settles.",
        },
      },
      {
        question: {
          tr: "Proje ne kadar sürdü?",
          en: "How long did the project take?",
        },
        answer: {
          tr: "Proje 22 hafta, yaklaşık beş ay sürdü. Süreye katalog mimarisi, yapay zeka teknik danışmanı, teklif portalı, CRM bağlantısı ve dört dilli arama yapısı birlikte girdi. Parçalar ayrı ayrı teslim edilmedi; teklif akışı ancak katalog ve danışman birlikte çalıştığında anlam taşıdığı için üçü aynı sürümde yayına alındı.",
          en: "The project ran 22 weeks, roughly five months. That span covered the catalogue architecture, the AI technical advisor, the quote portal, the CRM connection and the four-language search structure together. The pieces were not delivered separately: since the quote flow only means something once catalogue and advisor work together, all three went live in the same release.",
        },
      },
      {
        question: {
          tr: "Aynı kurgu başka bir endüstriyel üretici için işe yarar mı?",
          en: "Would the same setup work for another industrial manufacturer?",
        },
        answer: {
          tr: "Kurgu, teknik bir katalog ve seçim zorluğu varsa işe yarar. Kaldıraç ürün sayısı değil, alıcının doğru ürünü tek başına seçememesi. Seçim basitse yapay zeka danışmanı ek yük olur; asıl kazanç o zaman teklif portalı ile CRM otomasyonunda kalır. Ön koşul ürün verisinin yapılandırılmış olması — dağınık katalog önce düzenlenir.",
          en: "The setup works where there is a technical catalogue and a selection problem. The lever is not the number of products but the buyer's inability to choose the right one alone. Where selection is simple, an AI advisor becomes overhead and the real gain sits in the quote portal and CRM automation. The precondition is structured product data — a scattered catalogue gets organised first.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma özel yazılım ve mobil uygulama, yapay zeka danışmanlığı ile iş otomasyonları hizmetlerinin kapsamına giriyor. Üçü tek bir uygulamada birleşti ve dört dilli arama mimarisi de aynı yapının parçası olarak kuruldu. Vaka Transform disiplininde duruyor, çünkü asıl kazanç yeni bir ürün değil, var olan satış sürecinin ölçülebilir biçimde hızlanmasıydı.",
          en: "The work falls under custom software and mobile apps, AI advisory and business automation. The three converged in a single application, with the four-language search architecture built as part of the same structure. The case sits in the Transform discipline, because the real gain was not a new product but an existing sales process measurably speeding up.",
        },
      },
    ],
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
    serviceSlugs: [
      "marka-stratejisi",
      "e-ticaret",
      "cro",
      "performans-pazarlama",
    ],
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
        value: { tr: "10M ₺", en: "₺10M" },
        label: { tr: "Ciro", en: "Revenue" },
        context: {
          tr: "8 ayda; e-ticaret, pazaryeri, perakende ve stand",
          en: "In 8 months; e-commerce, marketplaces, retail and stands",
        },
      },
      {
        value: { tr: "İlk 3", en: "Top 3" },
        label: { tr: "Organik sıralama", en: "Organic ranking" },
        context: {
          tr: "Tüm hedef anahtar kelimeler; kategori sıfırdan kuruldu",
          en: "Every target keyword; the category was built from zero",
        },
      },
      {
        value: { tr: "3 zincir", en: "3 chains" },
        label: { tr: "Ulusal perakende", en: "National retail" },
        context: {
          tr: "MacroCenter, Migros ve Happy Center rafları",
          en: "MacroCenter, Migros and Happy Center shelves",
        },
      },
      {
        value: { tr: "10M+", en: "10M+" },
        label: { tr: "Film izlenmesi", en: "Film views" },
        context: {
          tr: "Dört filmin dijital kanallardaki toplamı",
          en: "Four films, total across digital channels",
        },
      },
    ],
    durationWeeks: 35,
    seo: {
      title: {
        tr: "OdorGo: olmayan bir kategoride 8 ayda 10 milyon TL",
        en: "OdorGo: ₺10M in 8 months in a category from zero",
      },
      description: {
        tr: "OdorGo'ya önce kategoriyi, sonra talebi kurduk: marka stratejisi, reklam filmleri ve CRO odaklı e-ticaret. Sekiz ayda 10 milyon TL ciro, üç ulusal zincir.",
        en: "We built OdorGo's category first, then its demand: brand strategy, TV commercials and CRO-led e-commerce. ₺10M revenue in eight months, three national chains.",
      },
    },
    faq: [
      {
        question: {
          tr: "Arama hacmi olmayan bir üründe pazarlama nasıl kurulur?",
          en: "How do you market a product with no search volume?",
        },
        answer: {
          tr: "Talep önce üretilir, sonra yakalanır. Koku giderici Türkiye'de fiilen bir kategori değildi ve kimse böyle bir ürünü aramıyordu; performans pazarlaması tek başına yakalayacağı hacmi bulamazdı. OdorGo'da bu yüzden önce kategori anlatıldı, arama hacmi kampanyayla birlikte oluştu ve ancak sonra arama tarafı devreye alındı.",
          en: "Demand is created first and captured afterwards. Odor elimination was effectively not a category in Türkiye and nobody was searching for such a product, so performance marketing had no volume to capture on its own. At OdorGo the category was explained first, search volume was created alongside the campaign, and only then did the search side come into play.",
        },
      },
      {
        question: {
          tr: "10 milyon TL ciro ne kadar sürede ve hangi kanallardan geldi?",
          en: "Over what period and through which channels did the ₺10M come?",
        },
        answer: {
          tr: "Ciro sekiz ayda ulaşıldı ve e-ticaret, pazaryeri, perakende ile stand satışlarının toplamıdır. Çalışma Temmuz 2025'te başladı, Şubat 2026'da devirle tamamlandı. Dört kanal aynı ölçüm çerçevesinde yönetildiği için hangi filmin hangi kanalda satışa dönüştüğü izlenebildi ve bütçe kanal başına ayrı ayrı değil, toplam getiriye göre dağıtıldı.",
          en: "The revenue was reached in eight months and is the total across e-commerce, marketplaces, retail and stand sales. The engagement began in July 2025 and closed with handover in February 2026. Because the four channels were managed in one measurement frame, which film converted on which channel could be tracked, and budget was allocated on total return rather than per channel.",
        },
      },
      {
        question: {
          tr: "Reklam filmleri neden gündelik senaryolar üzerine kuruldu?",
          en: "Why were the commercials built on everyday scenarios?",
        },
        answer: {
          tr: "Senaryolar, kategoriyi soyut anlatmamak için gündelik hayattan seçildi. Kedi kumu, genç erkek odası ve evde balık pişirmek tüketiciye kendi evindeki anı gösterdi. Var olmayan bir kategoride ürünün ne işe yaradığını tarif etmek yerine, sorunun nerede yaşandığını göstermek daha kısa yol. Dört film dijital kanallarda 10 milyondan fazla izlendi.",
          en: "The scenarios were taken from daily life so the category would not be explained in the abstract. Cat litter, a teenage boy's room and cooking fish at home showed consumers a moment from their own household. In a category that does not exist, showing where the problem is felt is a shorter route than describing what the product does. The four films were viewed more than 10 million times across digital channels.",
        },
      },
      {
        question: {
          tr: "Animasyon neden gerekliydi?",
          en: "Why was the animation necessary?",
        },
        answer: {
          tr: "Animasyon, ürünün ne yaptığını anlatmak için gerekliydi. Koku molekülünü yok etmek, kokuyu bastırmakla aynı şey değil ve ayrım anlaşılmadan kategori de anlaşılmıyor. Kategori farkındalığı bu anlatımla başladı. Piyasadaki oda spreyleriyle karıştırılan bir ürün, mekanizmasını gösteremediği sürece fiyatını ve raf yerini de savunamıyor.",
          en: "The animation was needed to explain what the product does. Eliminating an odor molecule is not the same as masking it, and without that distinction the category itself is not understood. Category awareness started with that explanation. A product being confused with air fresheners cannot defend its price or its shelf space until it can show its mechanism.",
        },
      },
      {
        question: {
          tr: "Hacim yokken organik ilk 3 sıra nasıl alındı?",
          en: "How was an organic top 3 achieved with no search volume?",
        },
        answer: {
          tr: "Sıralama, hacmin kampanyayla birlikte oluşmasıyla geldi. İnsanlar filmleri gördükten sonra ürünü adıyla aramaya başladı ve içerik ile site yapısı bu aramaları karşılayacak şekilde önceden hazırdı. Hedef anahtar kelimelerin tamamında organik ilk 3 sıraya yerleşildi. Sıra tersine olsaydı, oluşan talep rakiplerin ya da pazaryerlerinin sayfalarına giderdi.",
          en: "The ranking came from volume being created alongside the campaign. People started searching for the product by name after seeing the films, and the content and site structure were already prepared to meet those searches. The brand reached the organic top 3 for every target keyword. Reversed, the demand created would have landed on competitors' or marketplaces' pages instead.",
        },
      },
      {
        question: {
          tr: "Ulusal raflara nasıl girildi?",
          en: "How did the product reach national retail shelves?",
        },
        answer: {
          tr: "Ürün MacroCenter, Migros ve Happy Center raflarına girdi. Perakende, kategori anlatısının tüketici tarafında karşılık bulmasının ardından geldi; raf tek başına bir kanal olmanın yanında kategori iddiasını da doğruladı. E-ticaret, pazaryeri, perakende ve stand satışları birlikte 10 milyon TL ciroya ulaştı ve hiçbir kanal tek başına belirleyici olmadı.",
          en: "The product reached MacroCenter, Migros and Happy Center shelves. Retail followed once the category narrative found an answer on the consumer side; shelf space is a channel in its own right and also a validation of the category claim. E-commerce, marketplaces, retail and stand sales together reached ₺10M, with no single channel decisive on its own.",
        },
      },
      {
        question: {
          tr: "E-ticaret tarafında ne yapıldı?",
          en: "What was done on the e-commerce side?",
        },
        answer: {
          tr: "Site, İKAS ortaklığıyla dönüşüm odağında kuruldu. Ziyaretçi hangi kanaldan hangi sayfaya girerse girsin ikna edici bilgiyi alıp satın alma adımına gidiyor; ödeme akışı aynı mantıkla sadeleştirildi. Yeni bir kategoride her giriş sayfası aynı zamanda bir açıklama sayfası olmak zorunda, çünkü ziyaretçi ürünü ilk kez görüyor olabilir.",
          en: "The site was built around conversion in partnership with İKAS. Whichever channel and page a visitor lands on, they get the convincing information and move to the purchase step, and the checkout flow was simplified on the same logic. In a new category every landing page also has to be an explanation page, because the visitor may be seeing the product for the first time.",
        },
      },
      {
        question: {
          tr: "Kanallar nasıl birlikte yönetildi?",
          en: "How were the channels managed together?",
        },
        answer: {
          tr: "Kanallar tek bir ölçüm çerçevesinde yönetildi. Sosyal medya, e-posta, organik arama ve Google Ads aynı tabloya raporladı; Trendyol ile Hepsiburada mağazaları da bu çerçevenin içindeydi. Kanal başına ayrı okuma yapıldığında hangi filmin hangi satışı getirdiği görünmüyor, çünkü kategori kampanyasında etki gördüğü kanalda değil satın aldığı kanalda kaydediliyor.",
          en: "The channels were managed in one measurement frame. Social, email, organic search and Google Ads reported to the same table, and the Trendyol and Hepsiburada storefronts sat inside that frame too. Reading channel by channel hides which film drove which sale, because in a category campaign the effect is recorded on the channel where the purchase happens, not where it was seen.",
        },
      },
      {
        question: {
          tr: "Reklam filmlerinden çıkan içerikler nasıl kullanıldı?",
          en: "How was the footage from the commercials reused?",
        },
        answer: {
          tr: "Tek çekimden onlarca kanala içerik çıktı. Filmlerden kesilen parçalar sosyal medya ile dijital pazarlamayı besledi; prodüksiyon maliyeti tek bir kampanyaya değil, sekiz aylık iletişimin tamamına yayıldı. Kategori kurmak uzun bir anlatım gerektirdiği için aynı senaryoların farklı kurgularla tekrar görünmesi, mesajın yerleşmesine de yardımcı oldu.",
          en: "One shoot produced content for dozens of channels. Cuts from the films fed social media and digital marketing, spreading the production cost across eight months of communication rather than a single campaign. Because building a category takes long-form explanation, seeing the same scenarios return in different edits also helped the message settle.",
        },
      },
      {
        question: {
          tr: "Çalışma bittikten sonra ne oldu?",
          en: "What happened after the engagement ended?",
        },
        answer: {
          tr: "Operasyon Şubat 2026'da markanın kendi ekibine devredildi. Kurulan sistem sahibiyle çalışmaya devam ediyor ve devir, çalışmanın planlı son adımıydı. Kategori kurma işinde devir özellikle önemli: anlatım tutarlılığı yıllara yayılan bir iş ve markanın kendi ekibi bunu sürdüremezse kazanılan farkındalık rakiplere yarar.",
          en: "The operation was handed to the brand's own team in February 2026. The system built keeps running with its owner, and handover was the planned final step of the engagement. In category-building work handover matters especially: narrative consistency is a multi-year job, and if the brand's own team cannot sustain it, the awareness gained benefits competitors.",
        },
      },
      {
        question: {
          tr: "Aynı yaklaşım kategori yaratmayı gerektiren başka bir üründe işe yarar mı?",
          en: "Would the same approach work for another product that needs a category?",
        },
        answer: {
          tr: "Yaklaşım, ürün gerçekten yeni bir işi yapıyorsa işe yarar. OdorGo'da anlatılacak somut bir fark vardı: molekülü yok etmek ile bastırmak arasındaki ayrım. Fark yoksa kategori anlatısı da kurulamaz ve iş mevcut kategoride konumlanmaya döner. İkinci koşul bütçe sabrı — talep üretmek, var olan talebi yakalamaktan daha uzun sürüyor.",
          en: "The approach works when the product genuinely does something new. At OdorGo there was a concrete difference to explain: eliminating a molecule versus masking it. Without that difference no category narrative can be built and the work returns to positioning inside an existing category. The second condition is budget patience — creating demand takes longer than capturing it.",
        },
      },
      {
        question: {
          tr: "Bu iş hangi hizmetlerin kapsamına giriyor?",
          en: "Which services does this work fall under?",
        },
        answer: {
          tr: "Çalışma marka stratejisi ve pazarlama danışmanlığı, e-ticaret, dönüşüm optimizasyonu ile performans pazarlama hizmetlerinin kapsamına giriyor. Kreatif yönetim ve reklam filmi prodüksiyonu marka stratejisinin uygulama tarafı olarak yürüdü. Dört hizmet aynı takvimde ilerledi, çünkü kategori anlatısı film, site ve reklam tarafında aynı anda kurulmadan tüketiciye tek bir mesaj olarak ulaşmıyor.",
          en: "The work falls under brand strategy and marketing advisory, e-commerce, conversion optimisation and performance marketing. Creative direction and commercial production ran as the execution arm of brand strategy. The four services moved on one schedule, because a category narrative only reaches the consumer as a single message if film, site and advertising are built at the same time.",
        },
      },
    ],
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
          en: "Ingredient storytelling — the natural formulation at the centre of the trust argument",
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
