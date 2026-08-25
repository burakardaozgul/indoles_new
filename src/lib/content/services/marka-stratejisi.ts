import type { ServiceContent } from "../types";

/**
 * Marka stratejisi ve pazarlama danışmanlığı — Growth.
 *
 * Ton: orta (docs/03 §2c), KOBİ alıcısına göre ayarlı. `shortDescription`
 * `pillars.ts`ten birebir kopyalandı.
 *
 * `platforms` yok: marka stratejisinin somut bir araç seti yok, uydurma
 * logo şeridi koymak yerine alan boş bırakıldı.
 */
export const markaStratejisi: ServiceContent = {
  slug: { tr: "marka-stratejisi", en: "brand-strategy" },
  pillar: "growth",
  name: {
    tr: "Marka stratejisi ve pazarlama danışmanlığı",
    en: "Brand strategy & marketing advisory",
  },

  shortDescription: {
    industrial: {
      tr: "Pazar konumlandırması, ton ve mesaj mimarisi. İhracat pazarından saha satış ekibine tutarlı marka anlatısı — marka değeri ölçülebilir kılınır.",
      en: "Market positioning, tone and message architecture. A consistent brand narrative from export markets to the field sales team — brand value made measurable.",
    },
    commerce: {
      tr: "Marka konumlandırması, ses ve ton sistemi. Funnel'ın her adımında — reklamdan landing page'e, e-postadan ürün sayfasına — tutarlı mesaj.",
      en: "Brand positioning, voice and tone system. Consistent messaging across every funnel step — ad to landing page, email to product page.",
    },
  },

  lede: {
    tr: "Marka stratejisi, şirketin ne sattığını değil neden tercih edildiğini netleştiren çalışmadır. INDOLES bunu logo işi olarak değil, satış ekibinin de reklamın da aynı cümleyi kurmasını sağlayan bir sistem olarak kurar.",
    en: "Brand strategy is the work of clarifying not what a company sells but why it gets chosen. INDOLES treats it as a system that makes the sales team and the advertising say the same sentence — not as a logo exercise.",
  },

  signals: {
    tr: [
      "Şirketi anlatan herkes farklı bir şey söylüyor; ortak bir cümle yok.",
      "Fiyat dışında bir tercih sebebi anlatılamıyor, pazarlık hep indirime dönüyor.",
      "Rakiplerden farkınız var ama müşteri bunu satın alma anında göremiyor.",
    ],
    en: [
      "Everyone who describes the company says something different; there is no shared sentence.",
      "No reason to choose beyond price gets across, so every negotiation turns into a discount.",
      "You differ from competitors, but the customer cannot see it at the moment of purchase.",
    ],
  },

  scope: {
    includes: [
      {
        title: { tr: "Pazar ve rakip okuması", en: "Market and competitor read" },
        description: {
          tr: "Rakiplerin ne vaat ettiği, hangi boşluğun açık kaldığı ve sizin nereye oturduğunuz somut örneklerle çıkarılır.",
          en: "What competitors promise, which gap stays open and where you fit are mapped out with concrete examples.",
        },
      },
      {
        title: { tr: "Müşteri görüşmeleri", en: "Customer interviews" },
        description: {
          tr: "Mevcut müşterilerle konuşuruz: sizi neden seçtiler, neyi anlatırken zorlandılar, hangi kelimeleri kullanıyorlar?",
          en: "We talk to existing customers: why did they choose you, what was hard to explain, which words do they use?",
        },
      },
      {
        title: { tr: "Konumlandırma cümlesi", en: "Positioning statement" },
        description: {
          tr: "Şirketin kim için, hangi işi, hangi farkla yaptığını söyleyen tek cümle. Her metnin çıkış noktası burasıdır.",
          en: "One sentence saying who the company serves, which job it does and with what difference. Every piece of copy starts here.",
        },
      },
      {
        title: { tr: "Mesaj mimarisi", en: "Message architecture" },
        description: {
          tr: "Ana vaat ve onu destekleyen üç kanıt. Teklif sunumundan reklam metnine kadar herkesin kullanacağı ortak çerçeve.",
          en: "The core promise and three proofs behind it — a shared frame everyone uses, from proposals to ad copy.",
        },
      },
      {
        title: { tr: "Ses ve ton kılavuzu", en: "Voice and tone guide" },
        description: {
          tr: "Nasıl konuştuğunuz yazılı hâle gelir: hangi kelimeler kullanılır, hangileri kullanılmaz, örnek cümlelerle.",
          en: "How you speak gets written down: which words are used, which are avoided, with example sentences.",
        },
      },
      {
        title: { tr: "Pazarlama önceliklendirmesi", en: "Marketing priorities" },
        description: {
          tr: "Hangi kanal, hangi mesajla, hangi sırayla. Bütçeyi her yere değil, en çok getirene yönlendiren plan.",
          en: "Which channel, with which message, in which order — a plan that sends budget to what returns most, not everywhere.",
        },
      },
      {
        title: { tr: "Satış ekibi devri", en: "Sales team handover" },
        description: {
          tr: "Saha ekibi ve bayiler yeni anlatıyı kullanabilsin diye kısa bir sunum ve tek sayfalık başvuru dokümanı hazırlanır.",
          en: "A short deck and a one-page reference so the field team and dealers can actually use the new narrative.",
        },
      },
    ],
    excludes: {
      tr: [
        "Logo ve kurumsal kimlik tasarımı — ayrı bir kreatif kapsamdır",
        "Reklam yayını ve bütçe yönetimi — performans pazarlama hizmetinde",
        "Web sitesi arayüz tasarımı — UI/UX tasarım hizmetinde",
        "Basılı materyal ve matbaa üretimi",
      ],
      en: [
        "Logo and corporate identity design — a separate creative scope",
        "Running ads and managing budget — covered by performance marketing",
        "Website interface design — covered by the UI/UX design service",
        "Print materials and production",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Dinleme", en: "Listening" },
      description: {
        tr: "Yönetim, satış ekibi ve müşterilerle konuşuruz. Şirketin kendini nasıl anlattığı ile müşterinin nasıl anladığı arasındaki fark ortaya çıkar.",
        en: "We talk to management, the sales team and customers. The gap between how the company describes itself and how customers hear it comes out.",
      },
      output: {
        tr: "Görüşme bulguları ve tespit edilen anlatım farkları.",
        en: "Interview findings and the narrative gaps identified.",
      },
    },
    {
      step: "02",
      title: { tr: "Konumlandırma", en: "Positioning" },
      description: {
        tr: "Rakip haritası üzerinde açık alan bulunur ve şirketin duracağı yer seçilir. Seçim gerekçesiyle birlikte yazılır.",
        en: "An open space is found on the competitor map and the company's place is chosen — written down with the reasoning.",
      },
      output: {
        tr: "Konumlandırma cümlesi ve rakip haritası.",
        en: "The positioning statement and competitor map.",
      },
    },
    {
      step: "03",
      title: { tr: "Dil kurulumu", en: "Building the language" },
      description: {
        tr: "Ana vaat, destekleyici kanıtlar ve ton kuralları yazılır. Soyut sıfat yerine somut cümle; her biri kullanıma hazır.",
        en: "The core promise, supporting proofs and tone rules get written — concrete sentences rather than abstract adjectives, ready to use.",
      },
      output: {
        tr: "Mesaj mimarisi ve ses-ton kılavuzu.",
        en: "The message architecture and voice-and-tone guide.",
      },
    },
    {
      step: "04",
      title: { tr: "Sahaya taşıma", en: "Taking it to the field" },
      description: {
        tr: "Yeni dil satış sunumuna, web sitesine ve reklam metnine uygulanır. Ekip kullanmaya başlamadan iş bitmiş sayılmaz.",
        en: "The new language is applied to the sales deck, the website and ad copy. The work is not done until the team is using it.",
      },
      output: {
        tr: "Güncellenmiş satış sunumu ve ekibe devir oturumu.",
        en: "An updated sales deck and a handover session with the team.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "Konumlandırma dokümanı", en: "Positioning document" },
      description: {
        tr: "Kim için, hangi iş, hangi fark — gerekçesi ve rakip haritasıyla.",
        en: "Who for, which job, what difference — with reasoning and competitor map.",
      },
    },
    {
      kind: "document",
      title: { tr: "Mesaj mimarisi", en: "Message architecture" },
      description: {
        tr: "Ana vaat ve üç destekleyici kanıt; her biri kullanıma hazır cümle.",
        en: "The core promise and three proofs, each a ready-to-use sentence.",
      },
    },
    {
      kind: "document",
      title: { tr: "Ses ve ton kılavuzu", en: "Voice and tone guide" },
      description: {
        tr: "Kullanılacak ve kaçınılacak kelimeler, örnek cümle çiftleriyle.",
        en: "Words to use and to avoid, with paired example sentences.",
      },
    },
    {
      kind: "document",
      title: { tr: "Pazarlama önceliklendirmesi", en: "Marketing priorities" },
      description: {
        tr: "Kanal sırası, her kanalın mesajı ve önerilen bütçe dağılımı.",
        en: "Channel order, the message for each and a suggested budget split.",
      },
    },
    {
      kind: "document",
      title: { tr: "Satış sunumu", en: "Sales deck" },
      description: {
        tr: "Yeni anlatıyla güncellenmiş, saha ekibinin doğrudan kullanacağı sunum.",
        en: "Updated with the new narrative, ready for the field team to use.",
      },
    },
    {
      kind: "training",
      title: { tr: "Devir oturumu", en: "Handover session" },
      description: {
        tr: "Satış ve pazarlama ekibine yeni dilin nasıl kullanılacağı anlatılır.",
        en: "The sales and marketing teams learn how to use the new language.",
      },
    },
  ],

  faq: [
    {
      question: {
        tr: "Marka stratejisi logo yenileme demek mi?",
        en: "Does brand strategy mean a logo refresh?",
      },
      answer: {
        tr: "Marka stratejisi logo işi değildir; şirketin neden tercih edildiğini netleştirme çalışmasıdır. INDOLES bu hizmette konumlandırma, mesaj mimarisi ve ton kurallarını üretir — görsel kimlik tasarımı ayrı bir kreatif kapsamdır. Strateji önce gelir: logo, strateji netleşmeden yenilenirse yalnızca eski karışıklığın yeni bir görüntüsü olur.",
        en: "Brand strategy is not a logo exercise; it is the work of clarifying why a company gets chosen. In this service INDOLES produces positioning, message architecture and tone rules — visual identity design is a separate creative scope. Strategy comes first: a logo refreshed before the strategy is clear only gives the old confusion a new appearance.",
      },
    },
    {
      question: {
        tr: "Küçük bir şirket için marka stratejisi gerekli mi?",
        en: "Does a small company need brand strategy?",
      },
      answer: {
        tr: "Küçük şirketlerde marka stratejisi genellikle daha hızlı karşılık verir, çünkü karar alan kişi sayısı az ve uygulama hemen başlayabilir. Ortak bir anlatı yoksa her teklif sıfırdan yazılır, satış ekibi farklı şeyler söyler ve reklam bütçesi dağınık mesajlara harcanır. INDOLES ölçeğe göre kapsamı daraltır; küçük şirkette çalışma genellikle üç haftada tamamlanır.",
        en: "Brand strategy often pays back faster in small companies, because fewer people make decisions and execution can start immediately. Without a shared narrative every proposal is written from scratch, the sales team says different things and ad budget goes to scattered messages. INDOLES narrows the scope to the company's size; in a small company the work usually completes in three weeks.",
      },
    },
    {
      question: {
        tr: "Mevcut müşterilerimizle görüşmek şart mı?",
        en: "Do you have to interview our existing customers?",
      },
      answer: {
        tr: "Müşteri görüşmeleri çalışmanın en değerli girdisidir ve atlanması sonucu zayıflatır. Şirketin kendini nasıl anlattığı ile müşterinin neden satın aldığı çoğu zaman farklı çıkar; bu fark ancak müşteriyle konuşulunca görülür. Görüşmeler kısa tutulur, genellikle beş ila sekiz müşteri yeterlidir ve INDOLES bu görüşmeleri sizin adınıza yürütür.",
        en: "Customer interviews are the most valuable input in the work, and skipping them weakens the result. How a company describes itself and why customers actually buy usually differ — and that difference only shows when you talk to them. The interviews are kept short, five to eight customers is normally enough, and INDOLES runs them on your behalf.",
      },
    },
    {
      question: {
        tr: "Çalışma bittikten sonra ne değişir?",
        en: "What changes once the work is done?",
      },
      answer: {
        tr: "Çalışma sonunda teklif, web sitesi, reklam ve satış sunumu aynı cümleyi kurar. Somut fark şurada görülür: satış ekibi fiyat dışında bir gerekçe anlatabilir, pazarlama her kampanyada mesajı yeniden icat etmez ve yeni işe alınan biri şirketi bir günde doğru anlatabilir. INDOLES bu çıktıları yazılı bırakır, sözlü aktarıma bağlamaz.",
        en: "By the end, proposals, the website, advertising and the sales deck all make the same case. The concrete difference shows here: the sales team can give a reason beyond price, marketing stops reinventing the message each campaign, and a new hire can describe the company correctly within a day. INDOLES leaves these outputs in writing rather than relying on word of mouth.",
      },
    },
    {
      question: {
        tr: "Sanayi şirketiyiz, marka bize göre mi?",
        en: "We are an industrial company — is branding for us?",
      },
      answer: {
        tr: "Sanayi şirketlerinde marka, reklam değil güven meselesidir: alıcı milyonluk bir tedarik kararını kiminle çalışacağına bakarak verir. INDOLES bu tarafta konumlandırmayı referans, kapasite ve teslim güvencesi üzerinden kurar; ihracat pazarında ise aynı anlatının farklı dilde tutarlı kalmasını sağlar. Tüketici markalarındaki dil bu işe uygulanmaz.",
        en: "In industrial companies branding is a question of trust rather than advertising: a buyer awarding a million-lira supply contract is choosing who to work with. On that side INDOLES builds positioning on references, capacity and delivery assurance, and in export markets keeps the same narrative consistent across languages. The vocabulary used for consumer brands is not applied here.",
      },
    },
    {
      question: {
        tr: "Marka konumlandırma nedir?",
        en: "What is brand positioning?",
      },
      answer: {
        tr: "Marka konumlandırma, şirketin kim için, hangi işi, hangi farkla yaptığını söyleyen tek cümledir. INDOLES bu cümleyi rakip haritası üzerinde açık alan bularak seçer ve seçimin gerekçesini yazılı bırakır. Konumlandırma cümlesi sonrasında yazılan her metnin — teklif, reklam, satış sunumu — çıkış noktası olur.",
        en: "Brand positioning is the single sentence that states who a company serves, which job it does and with what difference. INDOLES picks that sentence by finding open ground on a competitor map, and writes down the reasoning behind the choice. Every text produced afterwards — proposal, ad, sales deck — starts from it.",
      },
    },
    {
      question: {
        tr: "Rebranding düşünüyoruz, bu hizmet onu kapsıyor mu?",
        en: "We are considering a rebrand — does this service cover it?",
      },
      answer: {
        tr: "Rebranding'in strateji tarafı bu hizmetin içinde, görsel tarafı dışında. Konumlandırma, mesaj mimarisi ve ses-ton kılavuzu üretilir; logo ve kurumsal kimlik tasarımı ayrı bir kreatif kapsamdır. Sıra önemlidir: görsel kimlik strateji netleşmeden yenilenirse eski karışıklık yeni bir görüntüyle devam eder. Yeni anlatı satış sunumuna ve web sitesine uygulanmadan da iş bitmiş sayılmaz.",
        en: "This service covers the strategy side of a rebrand, not the visual side. It produces positioning, message architecture and a voice and tone guide; logo and corporate identity design are a separate creative scope. Order matters: refreshing the visuals before the strategy is settled carries the old confusion into a new look.",
      },
    },
    {
      question: {
        tr: "Bizim tarafımızdan kimler katılıyor?",
        en: "Who takes part from our side?",
      },
      answer: {
        tr: "Dinleme adımında yönetim, satış ekibi ve mevcut müşteriler katılır; üçü de farklı bir gerçeği anlatır. Yönetim ne sattığını, satış ekibi sahada neyin tuttuğunu, müşteri ise neden satın aldığını söyler ve aradaki fark çalışmanın malzemesi olur. Devir oturumunda satış ve pazarlama ekibi yeni dili kullanmayı öğrenir.",
        en: "The listening step involves management, the sales team and existing customers; each of the three tells a different truth. Management says what the company sells, the sales team says what actually lands in the field, and the customer says why they bought — and the gap between them is the raw material. At the handover session sales and marketing learn to use the new language.",
      },
    },
    {
      question: {
        tr: "Pazarlama ajansımız varken bu hizmet nasıl çalışır?",
        en: "How does this work when we already have a marketing agency?",
      },
      answer: {
        tr: "Ajansla çakışma olmaz, çünkü bu hizmet reklam yayını ve bütçe yönetimi yapmaz. INDOLES konumlandırmayı, mesaj mimarisini ve ton kurallarını üretir; ajans bunları kampanya metnine uygular. Ortak çerçeve yazılı olduğu için ajans her kampanyada mesajı yeniden icat etmek zorunda kalmaz. Ajans değişse bile çerçeve şirkette kaldığından anlatı sıfırdan kurulmaz.",
        en: "There is no overlap, because this service does not run ads or manage budget. INDOLES produces the positioning, the message architecture and the tone rules; the agency applies them in campaign copy. With the shared frame written down, the agency stops reinventing the message for every campaign.",
      },
    },
    {
      question: {
        tr: "Pazarlama önceliklendirmesi neye göre yapılıyor?",
        en: "How are marketing priorities decided?",
      },
      answer: {
        tr: "Öncelik, her kanalın hangi mesajı hangi alıcıya taşıdığına ve beklenen getirisine göre belirlenir. Çıktı bir sıralamadır: hangi kanal, hangi mesajla, hangi sırayla — ve önerilen bütçe dağılımı. Amaç bütçeyi her yere yaymak değil, en çok getiren kanala yönlendirmek. Sıralama pazar ve rakip okumasında bulunan açık alana dayanır, kanal modasına değil.",
        en: "Priority follows which message each channel carries to which buyer, and what return it is expected to bring. The output is an ordered list: which channel, with which message, in what sequence — plus a suggested budget split. The point is not to spread budget everywhere but to send it where it returns most.",
      },
    },
    {
      question: {
        tr: "Hangi durumda marka stratejisi yanlış tercih olur?",
        en: "When is brand strategy the wrong choice?",
      },
      answer: {
        tr: "Sorun anlatıda değil üründe veya teslimatta ise marka stratejisi yanlış sırada gelir; net bir anlatı, tutmayan bir vaadi daha görünür kılar. Şirket kime sattığını henüz denemediyse müşteri görüşmesi yapacak malzeme de yoktur, önce satış denemesi gerekir. Yalnızca logo veya basılı materyal yenilenecekse bu iş kreatif tarafa aittir.",
        en: "If the problem sits in the product or the delivery rather than the story, brand strategy comes in the wrong order — a clear story only makes a broken promise more visible. If the company has not yet tested who it sells to, there is nothing to interview customers about, and selling comes first. If only a logo or print material needs refreshing, that work belongs to the creative side.",
      },
    },
  ],

  seo: {
    title: {
      tr: "Marka stratejisi danışmanlığı",
      en: "Brand strategy consulting",
    },
    description: {
      tr: "Müşteri görüşmeleriyle başlayan marka stratejisi ve marka danışmanlığı. Konumlandırma, mesaj mimarisi ve ton kılavuzu; satış ile reklam aynı cümleyi kurar.",
      en: "Brand strategy and brand positioning consulting built on customer interviews. Positioning, message architecture and a tone guide sales and advertising share.",
    },
    entities: {
      tr: [
        "INDOLES",
        "marka stratejisi",
        "konumlandırma",
        "mesaj mimarisi",
        "satış ekibi",
      ],
      en: [
        "INDOLES",
        "brand strategy",
        "positioning",
        "message architecture",
        "sales team",
      ],
    },
  },

  relatedPackages: ["buyume-sprinti"],
  relatedServices: ["performans-pazarlama", "ui-ux-tasarim", "e-ticaret"],
};
