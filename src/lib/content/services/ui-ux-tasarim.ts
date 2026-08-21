import type { ServiceContent } from "../types";

/**
 * UI/UX tasarım — Growth.
 *
 * Ton: orta (docs/03 §2c). "UX" ve "wireframe" gibi terimler ilk geçtikleri
 * yerde günlük dille açıklanıyor — KOBİ alıcısı bu kısaltmaları bilmek
 * zorunda değil.
 *
 * `shortDescription` `pillars.ts`ten birebir kopyalandı.
 */
export const uiUxTasarim: ServiceContent = {
  slug: { tr: "ui-ux-tasarim", en: "ui-ux-design" },
  pillar: "growth",
  name: { tr: "UI/UX tasarım", en: "UI/UX design" },

  shortDescription: {
    industrial: {
      tr: "Kurumsal kimliği taşıyan, B2B alıcıda güven inşa eden tasarım dili. Her sayfa marka anlatısıyla tutarlı — stok şablonun ötesinde.",
      en: "A design language that carries corporate identity and builds trust with B2B buyers. Every page consistent with the brand narrative — beyond stock templates.",
    },
    commerce: {
      tr: "Dönüşüm odaklı sayfa tasarımı ve kullanıcı akışı. Marka kimliği ile UI tutarlılığı aynı anda — ürün sayfasından checkout'a kadar.",
      en: "Conversion-led page design and user flow. Brand identity and UI consistency together — from product page to checkout.",
    },
  },

  lede: {
    tr: "UI/UX tasarım, bir ekranın hem güzel görünmesi hem de kullanan kişiyi hedefine ulaştırmasıdır. INDOLES tasarımı görsel tercih olarak değil, satın alma yolundaki engelleri kaldıran bir karar dizisi olarak ele alır.",
    en: "UI/UX design is an interface that both looks right and gets the person using it where they intended to go. INDOLES treats design as a chain of decisions that remove obstacles on the path to purchase, not as visual preference.",
  },

  signals: {
    tr: [
      "Site güzel görünüyor ama ziyaretçi aradığını bulamıyor.",
      "Her yeni sayfa farklı görünüyor; ortak bir düzen yok.",
      "Mobilde kullanımı zor, müşteri işini telefondan bitiremiyor.",
    ],
    en: [
      "The site looks good but visitors cannot find what they came for.",
      "Every new page looks different; there is no shared system.",
      "It is hard to use on mobile and customers cannot finish on their phone.",
    ],
  },

  platforms: ["Figma"],

  scope: {
    includes: [
      {
        title: { tr: "Kullanıcı akışı çıkarımı", en: "User flow mapping" },
        description: {
          tr: "Ziyaretçinin hedefine ulaşmak için attığı adımlar çıkarılır; gereksiz adımlar ve çıkmaz sokaklar işaretlenir.",
          en: "The steps a visitor takes to reach their goal are mapped; extra steps and dead ends get marked.",
        },
      },
      {
        title: { tr: "Sayfa iskeleti", en: "Wireframes" },
        description: {
          tr: "Renk ve görsel girmeden önce içeriğin yerleşimi çizilir — neyin nerede duracağı erken kararlaştırılır.",
          en: "Content layout is drawn before colour and imagery enter — what sits where gets decided early.",
        },
      },
      {
        title: { tr: "Arayüz tasarımı", en: "Interface design" },
        description: {
          tr: "Tipografi, renk, boşluk ve buton düzeni marka diline uygun biçimde kurulur; her ekran aynı sistemden çıkar.",
          en: "Typography, colour, spacing and buttons are set in line with the brand language; every screen comes from one system.",
        },
      },
      {
        title: { tr: "Tasarım sistemi", en: "Design system" },
        description: {
          tr: "Tekrar eden parçalar (buton, kart, form) tek yerde tanımlanır. Yeni sayfa sıfırdan tasarlanmaz, sistemden kurulur.",
          en: "Repeating pieces (buttons, cards, forms) get defined in one place. New pages are assembled from the system, not designed from scratch.",
        },
      },
      {
        title: { tr: "Mobil tasarım", en: "Mobile design" },
        description: {
          tr: "Küçük ekran sonradan uyarlanan bir versiyon değil, ayrı tasarlanan bir düzen olarak ele alınır.",
          en: "The small screen is treated as its own layout, not a version adapted afterwards.",
        },
      },
      {
        title: { tr: "Erişilebilirlik kontrolü", en: "Accessibility check" },
        description: {
          tr: "Renk kontrastı, yazı boyutu ve klavye ile kullanım denetlenir — okunabilirlik herkes için çalışmalı.",
          en: "Colour contrast, type size and keyboard use are checked — readability has to work for everyone.",
        },
      },
      {
        title: { tr: "Geliştirici teslimi", en: "Developer handoff" },
        description: {
          tr: "Ölçüler, renk kodları ve davranışlar yazılı teslim edilir; geliştirici tahmin ederek kodlamaz.",
          en: "Dimensions, colour values and behaviours are handed over in writing so developers do not have to guess.",
        },
      },
    ],
    excludes: {
      tr: [
        "Frontend kodlama ve site geliştirme — özel yazılım hizmetinde",
        "Logo ve kurumsal kimlik oluşturma — marka stratejisi kapsamında ele alınır",
        "İllüstrasyon, animasyon ve video prodüksiyonu",
        "İçerik ve metin yazımı",
      ],
      en: [
        "Frontend coding and site development — covered by custom software",
        "Logo and corporate identity creation — handled under brand strategy",
        "Illustration, animation and video production",
        "Content and copywriting",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Anlama", en: "Understanding" },
      description: {
        tr: "Kullanıcının ne yapmaya geldiği ve şu an nerede zorlandığı çıkarılır. Mevcut ekranlar varsa üzerinden geçilir.",
        en: "What the user came to do and where they currently struggle is established. Existing screens are reviewed if there are any.",
      },
      output: {
        tr: "Kullanıcı akışı şeması ve mevcut engellerin listesi.",
        en: "A user flow map and a list of current obstacles.",
      },
    },
    {
      step: "02",
      title: { tr: "İskelet", en: "Wireframes" },
      description: {
        tr: "Renk ve görsel olmadan yerleşim çizilir. Tartışma bu aşamada içerik üzerinden yürür, estetik üzerinden değil.",
        en: "Layout is drawn without colour or imagery. At this stage the discussion is about content, not aesthetics.",
      },
      output: {
        tr: "Ana sayfa tiplerinin iskelet çizimleri.",
        en: "Wireframes for the main page types.",
      },
    },
    {
      step: "03",
      title: { tr: "Tasarım", en: "Design" },
      description: {
        tr: "İskelet marka diliyle giydirilir; tipografi, renk ve boşluk kararları verilir. Masaüstü ve mobil birlikte ilerler.",
        en: "Wireframes get dressed in the brand language, with decisions on typography, colour and spacing. Desktop and mobile advance together.",
      },
      output: {
        tr: "Tasarlanmış ekranlar ve tasarım sistemi bileşenleri.",
        en: "Designed screens and the design system components.",
      },
    },
    {
      step: "04",
      title: { tr: "Teslim", en: "Handoff" },
      description: {
        tr: "Tasarım dosyaları ölçü ve davranış notlarıyla geliştiriciye aktarılır; uygulama sırasında sorular yanıtlanır.",
        en: "Design files go to the developer with dimensions and behaviour notes, and questions get answered during implementation.",
      },
      output: {
        tr: "Teslim dosyaları ve uygulama sırasında destek.",
        en: "Handoff files and support during implementation.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Kullanıcı akışı şeması", en: "User flow map" },
      description: {
        tr: "Ziyaretçinin hedefe giden yolu; kaldırılan adımlar işaretli.",
        en: "The visitor's path to their goal, with removed steps marked.",
      },
    },
    {
      kind: "document",
      title: { tr: "Sayfa iskeletleri", en: "Wireframes" },
      description: {
        tr: "Ana sayfa tiplerinin yerleşim çizimleri, içerik hiyerarşisiyle.",
        en: "Layout drawings for the main page types, with content hierarchy.",
      },
    },
    {
      kind: "document",
      title: { tr: "Tasarlanmış ekranlar", en: "Designed screens" },
      description: {
        tr: "Masaüstü ve mobil için tamamlanmış arayüz tasarımları.",
        en: "Finished interface designs for desktop and mobile.",
      },
    },
    {
      kind: "system",
      title: { tr: "Tasarım sistemi", en: "Design system" },
      description: {
        tr: "Buton, form, kart gibi tekrar eden parçaların tek kaynaklı tanımı.",
        en: "A single source for repeating pieces like buttons, forms and cards.",
      },
    },
    {
      kind: "document",
      title: { tr: "Geliştirici teslim dosyası", en: "Developer handoff file" },
      description: {
        tr: "Ölçüler, renk kodları ve etkileşim davranışları yazılı hâlde.",
        en: "Dimensions, colour values and interaction behaviours in writing.",
      },
    },
    {
      kind: "access",
      title: { tr: "Kaynak dosya sahipliği", en: "Source file ownership" },
      description: {
        tr: "Tasarım kaynak dosyaları düzenlenebilir hâlde firmaya devredilir.",
        en: "Editable design source files are handed over to the company.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "UI ve UX arasındaki fark ne?",
        en: "What is the difference between UI and UX?",
      },
      answer: {
        tr: "UX, kullanıcının hedefine kaç adımda ve ne kadar kolay ulaştığıyla ilgilenir; UI ise o adımların ekranda nasıl göründüğüyle. İkisi ayrılmaz: kötü kurgulanmış bir akış güzel görünse de işe yaramaz, iyi kurgulanmış bir akış kötü görünürse güven vermez. INDOLES bu hizmette ikisini tek çalışma olarak yürütür.",
        en: "UX is about how many steps and how easily a user reaches their goal; UI is about how those steps look on screen. The two are inseparable: a poorly structured flow does not work however good it looks, and a well-structured flow that looks bad does not earn trust. INDOLES runs both as a single piece of work in this service.",
      },
    },
    {
      question: {
        tr: "Tasarımı siz mi kodluyorsunuz?",
        en: "Do you also code the design?",
      },
      answer: {
        tr: "Kodlama bu hizmetin kapsamı dışındadır; INDOLES tasarımı ölçü, renk kodu ve davranış notlarıyla birlikte geliştiriciye teslim eder. Kodlamayı da INDOLES yapacaksa özel yazılım hizmeti devreye girer ve iki iş tek takvimde birleştirilir, arada teslim kaybı yaşanmaz. Mevcut geliştiriciniz varsa teslim dosyaları doğrudan onun kullanabileceği biçimde hazırlanır ve uygulama sırasında soruları yanıtlanır.",
        en: "Coding sits outside this service; INDOLES hands the design over to a developer with dimensions and behaviour notes. If INDOLES is to build it as well, the custom software service comes in and the two are combined on one schedule. If you have your own developer, the handoff files are prepared in a form they can use directly.",
      },
    },
    {
      question: {
        tr: "Mevcut sitemizi baştan tasarlamak şart mı?",
        en: "Do we have to redesign our existing site?",
      },
      answer: {
        tr: "Baştan tasarım her zaman gerekmez. Sorun belirli sayfalarda yoğunlaşıyorsa yalnız o sayfalar ele alınır; sorun sayfalar arası tutarsızlıksa tasarım sistemi kurmak çoğu zaman yeniden tasarımdan daha kalıcı çözüm olur. INDOLES kararı kullanıcı akışı çıkarıldıktan sonra verir ve gerekçesini bulgularla birlikte sunar.",
        en: "A full redesign is not always needed. If problems cluster on particular pages, only those get addressed; if the problem is inconsistency between pages, building a design system is usually a more lasting fix than redesigning. INDOLES makes the call after mapping the user flow and presents the reasoning alongside the findings.",
      },
    },
    {
      question: {
        tr: "Tasarım süreci ne kadar sürer?",
        en: "How long does the design process take?",
      },
      answer: {
        tr: "Beş altı sayfa tipinden oluşan bir site tasarımı genellikle dört ila altı hafta sürer: bir hafta akış ve iskelet, iki üç hafta arayüz, kalanı teslim ve düzeltmeler. Süreyi en çok uzatan şey geri bildirimin gecikmesidir; INDOLES bu yüzden her aşamada tek toplu onay turu planlar. Kapsam büyürse takvim baştan konuşulur, sessizce uzamaz.",
        en: "Designing a site of five or six page types usually takes four to six weeks: one week for flows and wireframes, two or three for the interface, the rest for handoff and revisions. What stretches timelines most is delayed feedback, so INDOLES plans a single consolidated approval round per stage. If scope grows, the schedule is renegotiated openly rather than quietly slipping.",
      },
    },
    {
      question: {
        tr: "Tasarım dosyaları bizde kalır mı?",
        en: "Do we keep the design files?",
      },
      answer: {
        tr: "Tasarım kaynak dosyaları çalışma sonunda düzenlenebilir hâlde firmaya devredilir; hiçbir dosya INDOLES hesabında kilitli kalmaz. Böylece ileride başka bir tasarımcıyla çalışsanız da sıfırdan başlamak zorunda kalmazsınız, mevcut sistem üzerine devam edilir. Tasarım sistemi de aynı şekilde teslim edilir ve iç ekip yeni sayfaları kendisi kurabilir hâle gelir.",
        en: "Design source files are handed over in editable form at the end of the engagement; nothing stays locked in an INDOLES account. That way, if you work with another designer later, you do not have to start over. The design system is delivered the same way, so the in-house team can build new pages themselves.",
      },
    },
  ],

  seo: {
    title: {
      tr: "UI/UX tasarım hizmeti",
      en: "UI/UX design service",
    },
    description: {
      tr: "Kullanıcı akışından tasarım sistemine, dönüşüm odaklı UI/UX tasarım. Mobil ayrı tasarlanır, dosyalar düzenlenebilir hâlde teslim edilir.",
      en: "Conversion-led UI/UX design, from user flows to a design system. Mobile designed separately; files handed over fully editable.",
    },
    entities: {
      tr: [
        "INDOLES",
        "UI/UX tasarım",
        "kullanıcı akışı",
        "tasarım sistemi",
        "Figma",
      ],
      en: [
        "INDOLES",
        "UI/UX design",
        "user flow",
        "design system",
        "Figma",
      ],
    },
  },

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["marka-stratejisi", "cro", "ozel-yazilim-ve-mobil"],
};
