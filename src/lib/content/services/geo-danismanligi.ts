import type { ServiceContent } from "../types";

/**
 * GEO danışmanlığı — yapay zeka arama optimizasyonu, Growth (ADR-040).
 *
 * On üçüncü hizmet. Sitenin en büyük gösterim kümesi GEO-editoryal yazılar
 * ama kümenin ticari karşılığı yoktu (`topics.ts` → `geo.serviceSlug: null`).
 * Burak kararı (2026-09-25): SEO/GEO'nun amacı satın alma niyetli alıcının
 * önüne çıkmak. GSC'deki alıcı sorgusu ("şirketimi yapay zeka motorlarında
 * görünür kılacak bir danışman ya da ajans önerir misin") bu sayfanın
 * alıcısıdır; bugün bir AI danışmanlığı yazısına düşüyor.
 *
 * Kanibalizasyon sınırı: "yapay zeka arama optimizasyonu" ve "geo
 * optimizasyonu" BİLGİ sorgusu kanonik rehberde
 * (`yapay-zeka-aramalarinda-nasil-one-cikarsiniz`) kalır. Bu sayfa ticari
 * niteleyicileri taşır — "GEO danışmanlığı" arama başlığında, "GEO ajansı"
 * lede'de ve karşı-konumlandırma SSS'lerinde (yerleşim kuralı,
 * `keyword-coverage.test.ts`: "ajansı" `name` ve `seo.title`a girmez).
 *
 * Kapsam yalnız INDOLES'in bugün gerçekten yaptığı işlerden kuruldu: beş
 * sinyalli denetim (GEO Görünürlük Denetleyicisi'yle aynı çerçeve), teknik
 * zemin (kendi sitemizde çalışan robots/llms.txt/şema kurgusu), soru-cevap
 * içerik mimarisi, varlık tutarlılığı ve aylık 10 prompt × 3 motor ölçüm
 * turu (`docs/strateji/GEO-Olcum-Rutini.md`).
 *
 * Paketi ve fiyatı YOK — uydurulmadı. `relatedPackages: null` pillar
 * paketine düşmeyi engeller (Büyüme Sprinti GEO kapsamı taşımıyor);
 * fiyat sorusu SSS'te "kapsama göre, teşhisle başlar" diye cevaplanır.
 */
export const geoDanismanligi: ServiceContent = {
  slug: { tr: "geo-danismanligi", en: "geo-consulting" },
  pillar: "growth",
  /**
   * H1 Burak'ın verdiği ad (2026-09-25). Bilgi sorgusunun tam biçimini
   * taşır ama arama başlığı ticari biçimi ("GEO danışmanlığı") başa alır;
   * kanonik rehberin `seo.title`ı ile aynı dizge değildir.
   */
  name: {
    tr: "Yapay zeka arama optimizasyonu (GEO)",
    en: "Generative engine optimization (GEO)",
  },

  shortDescription: {
    industrial: {
      tr: "İhracat alıcısı ve B2B karar verici tedarikçiyi artık ChatGPT'ye soruyor. Bot erişimi, yapısal veri ve soru-cevap içerikle cevabın kaynağı olmaya aday olursunuz; sonuç her ay ölçülür.",
      en: "Export buyers and B2B decision-makers now ask ChatGPT for suppliers. Crawler access, structured data and question-led content make you a candidate source for the answer, measured every month.",
    },
    commerce: {
      tr: "Müşteri ne alacağını ChatGPT, Gemini ve AI Overviews'a soruyor. Teknik zemin, alıntılanabilir içerik ve her ay 30 sorguluk ölçümle cevabın içinde anılan marka olmak için çalışılır.",
      en: "Customers ask ChatGPT, Gemini and AI Overviews what to buy. Technical groundwork, citable content and a 30-query monthly measurement go into becoming the brand the answer names.",
    },
  },

  /**
   * "GEO ajansı" burada üçüncü taraf tanımı olarak geçer — kendimizi
   * adlandırmak için değil, o ajanstan beklenmesi gereken çıktıyı
   * adlandırmak için (`cro.ts` lede'siyle aynı kalıp).
   */
  lede: {
    tr: "Yapay zeka arama optimizasyonu (GEO), ChatGPT, Gemini, Perplexity ve Google AI Overviews bir soruyu cevaplarken markanızın kaynak gösterilmesi için yapılan iştir; bir GEO ajansından beklenecek şey sıralama raporu değil, kaç cevapta hangi cümleyle anıldığınızın ölçümüdür. INDOLES aynı işi önce kendi sitesinde kurdu: botlara açık zemin, soru-cevap mimarisi ve her ay aynı 30 sorguyla tutulan kayıt.",
    en: "Generative engine optimization (GEO) is the work of getting your brand cited when ChatGPT, Gemini, Perplexity and Google AI Overviews answer a question; what a GEO agency owes you is not a ranking report but a measure of how many answers name you, and in which sentence. INDOLES built the same work on its own site first: crawler-open groundwork, a question-and-answer structure and a record kept with the same 30 queries every month.",
  },

  signals: {
    tr: [
      "Müşterileriniz kategorinizi ChatGPT'ye soruyor; cevapta rakipleriniz geçiyor, siz geçmiyorsunuz.",
      "Google'da ilk sayfadasınız ama AI Overviews çıkan sorgularda tıklama azalıyor.",
      "Sitenizin yapay zeka botlarına açık olup olmadığını ve llms.txt'in durumunu bilmiyorsunuz.",
    ],
    en: [
      "Your customers ask ChatGPT about your category; competitors appear in the answer and you do not.",
      "You rank on page one, yet clicks are falling on queries where an AI Overview appears.",
      "You don't know whether your site is open to AI crawlers or what state your llms.txt is in.",
    ],
  },

  /**
   * Ölçülen motorlar ve ölçüm kaynağı. Hiçbirinin `platform-icons` kaydı
   * yok; metin rozetiyle görünürler (kayıt politikası: logo elle çizilmez).
   */
  platforms: [
    "ChatGPT",
    "Gemini",
    "Perplexity",
    "Google AI Overviews",
    "Google Search Console",
  ],

  scope: {
    includes: [
      {
        title: { tr: "Beş sinyalli GEO denetimi", en: "Five-signal GEO audit" },
        description: {
          tr: "Site, GEO Görünürlük Denetleyicisi'nin çerçevesiyle taranır: AI erişimi, llms.txt, yapısal veri, dil sinyalleri ve soru başlıkları. Kritik sayfalar ayrı ayrı ölçülür; tek bir ana sayfa skoru siteyi temsil etmez.",
          en: "The site is scanned with the GEO Visibility Checker's frame: AI access, llms.txt, structured data, language signals and question headings. Key pages are measured one by one; a single home page score does not represent the site.",
        },
      },
      {
        title: { tr: "Yapay zeka botlarına erişim", en: "AI crawler access" },
        description: {
          tr: "robots.txt'te GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot ve Google-Extended gibi tarayıcıların durumu okunur. Bilinçsiz engel kalkar, yönetim ve uygulama yolları kapalı kalır.",
          en: "robots.txt is read for crawlers such as GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot and Google-Extended. Accidental blocks come off while admin and application paths stay closed.",
        },
      },
      {
        title: { tr: "llms.txt ve yapısal veri", en: "llms.txt and structured data" },
        description: {
          tr: "llms.txt içerik kayıtlarından üretilecek biçimde kurulur, elle yazılıp unutulmaz. Organization, Article, FAQPage ve Service şemaları görünen metinle birebir uyumlu basılır.",
          en: "llms.txt is set up to be generated from content records rather than written by hand and forgotten. Organization, Article, FAQPage and Service schemas are emitted to match the visible text exactly.",
        },
      },
      {
        title: { tr: "Sunucu tarafı render kontrolü", en: "Server-side rendering check" },
        description: {
          tr: "İçeriğin ham HTML'de durup durmadığı denetlenir. JavaScript çalıştırmayan bir okuyucu boş sayfa görüyorsa, içerik işinden önce render sorunu çözülür.",
          en: "We check whether the content is present in the raw HTML. If a reader that runs no JavaScript sees an empty page, rendering gets fixed before any content work.",
        },
      },
      {
        title: { tr: "Soru-cevap içerik mimarisi", en: "Question-led content structure" },
        description: {
          tr: "Başlıklar müşterinin gerçekten kurduğu cümlelerden çıkar; kaynak Search Console sorguları ve satış görüşmeleridir. Her başlığın ilk paragrafı bağlamından koparıldığında da ayakta kalan net bir cevap verir.",
          en: "Headings come from sentences customers actually type, sourced from Search Console queries and sales calls. The first paragraph under each heading gives a clear answer that still stands when lifted out of context.",
        },
      },
      {
        title: { tr: "Varlık tutarlılığı ve dış profiller", en: "Entity consistency across profiles" },
        description: {
          tr: "Marka sitede, LinkedIn'de, Google işletme kaydında ve sektör dizinlerinde aynı cümleyle tanımlanır. Tanım kaynaklar arasında tutarsızsa model emin olduğu rakibi yazar.",
          en: "The brand is described in the same sentence on the site, LinkedIn, its Google Business Profile and sector directories. When the description varies across sources, a model writes the competitor it is sure about.",
        },
      },
      {
        title: { tr: "Aylık ölçüm turu", en: "Monthly measurement round" },
        description: {
          tr: "Sabit 10 soru her ay ChatGPT, Gemini ve Perplexity'ye sorulur. Markanın kaç cevapta, hangi cümleyle ve hangi sayfayla kaynak gösterildiği elle kaydedilir.",
          en: "The same 10 questions go to ChatGPT, Gemini and Perplexity every month. How many answers name the brand, in which sentence and citing which page is recorded by hand.",
        },
      },
      {
        title: { tr: "Çok dilli görünürlük", en: "Multilingual visibility" },
        description: {
          tr: "İhracat yapan sitelerde html lang ve hreflang sinyalleri denetlenir; yabancı alıcının kendi dilinde sorduğu soruya cevap veren sayfalar önceliklendirilir.",
          en: "On export sites the html lang and hreflang signals are audited, and pages that answer a foreign buyer's question in their own language are prioritised.",
        },
      },
    ],
    excludes: {
      tr: [
        "Sıralama ya da yapay zeka cevabında anılma garantisi — hiçbir motor kaynak seçimini dışarıya açmıyor",
        "Reklam yönetimi, ChatGPT reklamları dahil — performans pazarlama hizmetinde",
        "Sıfırdan site yapımı ve platform taşıma — özel yazılım ve mobil uygulama hizmetinde",
        "Bağlantı satın alma ve yapay yorum üretimi",
      ],
      en: [
        "A ranking guarantee or a guaranteed mention in AI answers — no engine discloses how it picks sources",
        "Ad management, ChatGPT ads included — covered by performance marketing",
        "Building a site from scratch or replatforming — covered by custom software and mobile apps",
        "Buying links or manufacturing reviews",
      ],
    },
  },

  method: [
    {
      step: "01",
      title: { tr: "Teşhis ve başlangıç ölçümü", en: "Diagnosis and baseline" },
      description: {
        tr: "Site beş sinyalde taranır, kategorinizin 10 sorusu üç motora sorulur ve bugünkü durum kayda geçer. Promptlarda marka adı geçmez; geçerse model markayı zaten önünüze getirir.",
        en: "The site is scanned on five signals, your category's 10 questions go to three engines, and today's position is recorded. No prompt contains the brand name; if it did, the model would simply hand the brand back to you.",
      },
      output: {
        tr: "Denetim raporu ve 30 sorguluk başlangıç kaydı.",
        en: "An audit report and a 30-query baseline.",
      },
    },
    {
      step: "02",
      title: { tr: "Teknik zemin", en: "Technical groundwork" },
      description: {
        tr: "Bot izinleri, llms.txt, yapısal veri ve render sorunları öncelik sırasıyla kapatılır. Zemin oturmadan içerik yazılmaz; okunamayan sayfaya yazılan metin boşa gider.",
        en: "Crawler permissions, llms.txt, structured data and rendering issues are closed in priority order. No content is written before the ground is set; text on a page nobody can read is wasted.",
      },
      output: {
        tr: "Botlara açık, şeması doğrulanmış site.",
        en: "A site open to crawlers, with validated schema.",
      },
    },
    {
      step: "03",
      title: { tr: "İçerik mimarisi", en: "Content structure" },
      description: {
        tr: "Öncelikli sayfalar soru başlıkları ve kendine yeten paragraflarla yeniden yazılır, cevapsız kalan sorular için yeni sayfalar açılır. Marka tanımı dış profillerde aynı cümleye çekilir.",
        en: "Priority pages are rewritten with question headings and self-contained paragraphs, and new pages open for questions nobody answers yet. The brand description is aligned to one sentence across external profiles.",
      },
      output: {
        tr: "Soru haritası ve yayındaki yeniden yazılmış sayfalar.",
        en: "A question map and rewritten pages, live.",
      },
    },
    {
      step: "04",
      title: { tr: "Ölçüm ve devir", en: "Measure and hand over" },
      description: {
        tr: "Aynı 30 sorgu her ay tekrarlanır; kaynak gösterilen sayfanın yapısı sonraki içeriğin şablonu olur. Tur iç ekibe öğretilir, kayıt sizde kalır.",
        en: "The same 30 queries are repeated every month; the structure of whichever page gets cited becomes the template for the next piece. The round is taught to your team and the record stays with you.",
      },
      output: {
        tr: "Aylık ölçüm tablosu ve iç ekibe devredilmiş tur.",
        en: "A monthly measurement table and the round handed to your team.",
      },
    },
  ],

  deliverables: [
    {
      kind: "document",
      title: { tr: "GEO denetim raporu", en: "GEO audit report" },
      description: {
        tr: "Beş sinyal, sayfa sayfa bulgular ve etkisine göre sıralanmış düzeltme listesi.",
        en: "Five signals, page-by-page findings and a fix list ranked by impact.",
      },
    },
    {
      kind: "document",
      title: { tr: "Başlangıç ölçümü", en: "Baseline measurement" },
      description: {
        tr: "10 soru × 3 motor: geçtiğiniz cevaplar, anıldığınız cümle, kaynak gösterilen sayfa.",
        en: "10 questions × 3 engines: the answers you appear in, the sentence used, the page cited.",
      },
    },
    {
      kind: "system",
      title: { tr: "Teknik zemin", en: "Technical groundwork" },
      description: {
        tr: "Bot izinleri, içerikten üretilen llms.txt ve metinle uyumlu yapısal veri, canlıda.",
        en: "Crawler permissions, a content-generated llms.txt and structured data that matches the text, live.",
      },
    },
    {
      kind: "document",
      title: { tr: "Soru haritası", en: "Question map" },
      description: {
        tr: "Müşterinizin kurduğu cümlelerden çıkarılmış, sayfalara dağıtılmış soru listesi.",
        en: "Questions drawn from your customers' own sentences, assigned to pages.",
      },
    },
    {
      kind: "system",
      title: { tr: "Yeniden yazılmış sayfalar", en: "Rewritten pages" },
      description: {
        tr: "Öncelikli sayfalar soru başlıkları ve alıntılanabilir paragraflarla yayında.",
        en: "Priority pages live with question headings and citable paragraphs.",
      },
    },
    {
      kind: "document",
      title: { tr: "Aylık ölçüm tablosu", en: "Monthly measurement table" },
      description: {
        tr: "Ay ay geçiş sayısı, anılma cümlesi, kaynak sayfa ve rakiplerin durumu.",
        en: "Month by month: mentions, the sentence used, the page cited and where competitors stand.",
      },
    },
    {
      kind: "training",
      title: { tr: "Ölçüm turu devri", en: "Measurement round handover" },
      description: {
        tr: "İç ekip turu yürütmeyi, kaydı tutmayı ve sonucu okumayı öğrenir.",
        en: "Your team learns to run the round, keep the record and read the result.",
      },
    },
  ],

  /**
   * SSS sırası anlam sırasıdır ve FAQPage şemasına aynen akar. Alıcı sorusu
   * ("kimle çalışmalıyım") ve garanti sorusu ilk üçte — `cro.ts`teki
   * 2026-09-18 dersi: ticari sorgunun hedef cevabı görünür yerde durmalı.
   *
   * "ajansı" geçen iki soru karşı-konumlandırmadır ve cevapları INDOLES'in
   * kendi konumunu tarif eder (`keyword-coverage.test.ts`).
   */
  faq: [
    {
      question: {
        tr: "GEO danışmanlığı nedir, ne işe yarar?",
        en: "What is GEO consulting and what does it do?",
      },
      answer: {
        tr: "GEO danışmanlığı, bir markanın ChatGPT, Gemini, Perplexity ve Google AI Overviews cevaplarında doğru cümleyle ve kaynak olarak geçmesi için sitesini, içeriğini ve dış profillerini düzenleme işidir. SEO sıralama için çalışır; GEO, kullanıcı hiç tıklamasa bile cevabın içinde anılmak için. INDOLES'te iş dört adımda yürür: teşhis ve başlangıç ölçümü, teknik zemin, soru-cevap içerik mimarisi, aylık ölçüm ve devir.",
        en: "GEO consulting is the work of arranging a brand's site, content and external profiles so that ChatGPT, Gemini, Perplexity and Google AI Overviews name it in the right sentence and cite it as a source. SEO works for rankings; GEO works for being named inside the answer even when nobody clicks. At INDOLES the work runs in four steps: diagnosis and baseline, technical groundwork, question-led content structure, then monthly measurement and handover.",
      },
    },
    {
      // Alıcı sorusu (Yol-Haritasi-Satin-Alma-Niyeti §3, "kimle çalışmalıyım").
      // Ticari niteleyici kelime H1'e girmez; ayrıştığımız seçenekleri
      // adlandırmak için kullanılır.
      question: {
        tr: "GEO ajansıyla mı, danışmanla mı, iç ekiple mi çalışmalıyım?",
        en: "Should we work with a GEO agency, a consultant or our own team?",
      },
      answer: {
        tr: "Kararı işin nerede tıkandığı verir. Sorun yalnız teknik zeminse — kapalı bot izni, eksik şema, JavaScript arkasında kalan içerik — iyi bir geliştirici birkaç haftada kapatır. Sorun içerikteyse ve kimse her ay ölçmüyorsa, dışarıdan yöntem ve ölçüm disiplini getiren bir ekip gerekir. INDOLES melez modeli önerir: zemini ve ilk içerik dalgasını sizinle birlikte kurar, ölçüm turunu iç ekibinize devreder, dışarıda yalnız dönemsel denetim kalır.",
        en: "Where the work is stuck decides it. If the problem is only technical — a closed crawler rule, missing schema, content hidden behind JavaScript — a good developer can close it in a few weeks. If the problem is the content and nobody measures monthly, you need a team that brings method and measurement discipline from outside. INDOLES recommends a hybrid: it builds the groundwork and the first wave of content with you, hands the measurement round to your team, and stays on only for periodic review.",
      },
    },
    {
      question: {
        tr: "Bir GEO ajansı ChatGPT'de anılmayı garanti edebilir mi?",
        en: "Can a GEO agency guarantee a mention in ChatGPT?",
      },
      answer: {
        tr: "Hayır; hiçbir motor kaynak seçimini dışarıya açmadığı için anılma ya da sıralama garantisi dürüstçe verilemez. Garanti veren teklifte çoğu zaman neyin, hangi soruda ve hangi motorda ölçüleceği de yazılı değildir. INDOLES garanti yerine yöntemi ve ölçüyü yazılı verir: hangi 10 sorunun sorulduğu, hangi üç motora sorulduğu ve sonucun her ay nasıl kaydedildiği baştan belirlenir.",
        en: "No. Because no engine discloses how it picks sources, a mention or ranking guarantee cannot honestly be given. A proposal that guarantees one usually leaves unwritten what will be measured, on which questions and in which engine. Instead of a guarantee, INDOLES puts the method and the measure in writing: which 10 questions are asked, which three engines they go to and how the result is recorded each month are fixed up front.",
      },
    },
    {
      question: {
        tr: "GEO danışmanlığında ilk sonuç ne zaman görülür?",
        en: "When do the first results of GEO consulting show?",
      },
      answer: {
        tr: "Teknik zemin düzeltmeleri ilk haftalarda tamamlanır ve GEO Görünürlük Denetleyicisi skorunda hemen görünür. Cevaplarda anılma daha yavaş gelir: ilk sinyal genellikle uzun ve şartlı sorulardan, birkaç ay içinde okunur. SIM Baskı Malzemeleri'nde AI motorlarındaki görünürlük altı aylık içerik programının sonunda sıfırdan 40 bine çıktı; İstanbul Ortez Protez'de öncelikli kelimelerde ilk 3'e çıkmak on beş ay sürdü.",
        en: "Technical fixes land in the first weeks and show up straight away in the GEO Visibility Checker score. Being named in answers comes more slowly: the first signal usually appears within a few months, on long and conditional questions. At SIM Printing Suppliers, visibility in AI engines went from zero to 40,000 by the end of a six-month content programme; at İstanbul Ortez Protez, reaching the top 3 for priority keywords took fifteen months.",
      },
    },
    {
      // Fiyat uydurulmadı: bu hizmetin paketi ve liste fiyatı yok (ADR-040).
      question: {
        tr: "GEO danışmanlığı ne kadar tutar, fiyat neye göre belirlenir?",
        en: "What does GEO consulting cost, and what sets the price?",
      },
      answer: {
        tr: "Sabit bir paket fiyatı yok; fiyat kapsama göre belirlenir ve iş bir teşhisle başlar. Kapsamı dört şey büyütür ya da küçültür: sitenin teknik durumu, yeniden yazılacak sayfa sayısı, dil sayısı ve aylık ölçümün kaç ay süreceği. Teşhiste beş sinyallik denetim ve 30 sorguluk başlangıç ölçümü çıkar; teklif bu bulgulara göre yazılır. GEO Görünürlük Denetleyicisi ise ücretsizdir ve teşhisten önce kendi başınıza kullanılabilir.",
        en: "There is no fixed package price; the price follows the scope and the work starts with a diagnosis. Four things move the scope: the site's technical state, the number of pages to rewrite, the number of languages and how many months of measurement are planned. The diagnosis produces the five-signal audit and a 30-query baseline, and the proposal is written against those findings. The GEO Visibility Checker is free and can be used on your own before any diagnosis.",
      },
    },
    {
      question: {
        tr: "GEO ile SEO çalışması ayrı mı yürür?",
        en: "Does GEO run separately from SEO?",
      },
      answer: {
        tr: "Ayrı ekip gerektirmez ama ayrı ölçülür. GEO, SEO'nun üstüne kurulur: indekslenmeyen, yavaş açılan ya da içeriğini JavaScript arkasına saklayan bir sayfayı üretken motor da okuyamaz. Fark hedefte ve raporda görünür; SEO'da sıra ve tıklama izlenir, GEO'da kaç cevapta anıldığınız, hangi cümleyle anıldığınız ve hangi sayfanın kaynak gösterildiği. Sıralama raporu gösteren bir GEO teklifi aslında SEO satıyordur.",
        en: "It needs no separate team, but it is measured separately. GEO is built on top of SEO: a generative engine cannot read a page that is not indexed, loads slowly or hides its content behind JavaScript. The difference shows in the goal and the report; SEO tracks position and clicks, while GEO tracks how many answers name you, in which sentence and with which page cited. A GEO proposal that shows a ranking report is really selling SEO.",
      },
    },
    {
      question: {
        tr: "Hangi yapay zeka motorlarında ölçüm yapıyorsunuz?",
        en: "Which AI engines do you measure?",
      },
      answer: {
        tr: "Aylık tur ChatGPT, Gemini ve Perplexity'de yürür: 10 sabit soru, üç motor, ayda 30 sorgu. Sorular temiz oturumda ve marka adı geçmeden sorulur, yanıtlar elle kaydedilir; otomatik araç kullanılmaz, çünkü aynı soru aynı gün iki farklı yanıt üretebilir. Google AI Overviews Google'ın indeksine yaslandığı için ayrı bir turla değil, Search Console'daki sorgu ve sayfa verisiyle birlikte okunur.",
        en: "The monthly round runs on ChatGPT, Gemini and Perplexity: 10 fixed questions, three engines, 30 queries a month. Questions are asked in a clean session without the brand name and the answers are recorded by hand; no automated tool is used, because the same question can produce two different answers on the same day. Google AI Overviews rests on Google's index, so it is read through Search Console query and page data rather than a separate round.",
      },
    },
    {
      question: {
        tr: "Sitemize llms.txt eklemek yeterli mi?",
        en: "Is adding an llms.txt file to our site enough?",
      },
      answer: {
        tr: "Yeterli değil. llms.txt dil modellerine sitenizin haritasını sade metinle veren bir dosya önerisidir; eklemek ucuzdur ve zarar vermez, ama hiçbir motor onu kaynak gösterme koşulu olarak ilan etmedi. Asıl iş içeriktedir: soru biçiminde başlıklar, bağlamından koparıldığında ayakta kalan paragraflar ve metnin içinde geçen rakamlar. Yalnız llms.txt kurup çalışmayı bitiren teklif, işin dipnotunu satıyordur.",
        en: "It is not enough. llms.txt is a proposed file that gives language models a plain-text map of your site; adding one is cheap and harmless, but no engine has declared it a condition for citing a source. The real work is in the content: question headings, paragraphs that stand when lifted out of context and figures written inside the sentence. A proposal that installs llms.txt and calls the job done is selling the footnote.",
      },
    },
    {
      // Kendi sitemizin sonuçları — kaynak ve tarihle (Burak'ın kanıt şartı).
      // GSC: `Marketing/GSC-Data/haftalik-2026-09-22/sorgular.csv`
      // (2026-08-22 → 2026-09-19): "yerli geo aracı" poz. 1,22,
      // "türkçe geo aracı var mı" poz. 2,50. Perplexity atfı:
      // `Marketing/GEO-Olcum/ozet.md` Ay 1 (2026-09-01), 1/30.
      question: {
        tr: "INDOLES'in kendi sitesinde GEO sonucu var mı?",
        en: "Does INDOLES have GEO results on its own site?",
      },
      answer: {
        tr: "Var ve rakamıyla kayıtlı. Google Search Console'da 22 Ağustos – 19 Eylül 2026 döneminde \"yerli geo aracı\" sorgusunda ortalama pozisyonumuz 1,2, \"türkçe geo aracı var mı\" sorgusunda 2,5 oldu. 1 Eylül 2026 ölçüm turunda Perplexity, CRO ajansı seçimi üzerine bir soruya verdiği cevapta ajans seçim yazımızı kaynak gösterdi. Aynı tur bize dürüst bir ölçü de verdi: 30 sorgunun yalnız 1'inde geçiyoruz.",
        en: "Yes, and the figures are on record. In Google Search Console for 22 August – 19 September 2026, our average position was 1.2 for the query \"yerli geo aracı\" (local GEO tool) and 2.5 for \"türkçe geo aracı var mı\" (is there a Turkish GEO tool). In the 1 September 2026 measurement round, Perplexity cited our article on choosing a CRO agency when answering a question on that subject. The same round gave us an honest measure too: we appear in only 1 of the 30 queries.",
      },
    },
    {
      question: {
        tr: "Çalışma boyunca bizim tarafımızdan kim gerekiyor?",
        en: "Who do you need from our side during the work?",
      },
      answer: {
        tr: "Siteye, robots.txt'e ve Search Console'a erişim verebilecek bir teknik kişi ile ürünü ve müşteriyi tanıyan bir iş sahibi yeterli. Teknik kişi zemin düzeltmeleri yayına alınırken, iş sahibi soru haritası kurulurken ve yeniden yazılan sayfalar onaylanırken devreye girer. Müşterinin gerçekten kurduğu cümleler satış ve destek ekibinden gelir; o ekiple yarım saatlik bir görüşme soru haritasının en değerli girdisidir.",
        en: "One technical person who can grant access to the site, robots.txt and Search Console, plus one business owner who knows the product and the customer. The technical person comes in when groundwork fixes go live; the business owner joins while the question map is built and signs off rewritten pages. The sentences customers really use come from sales and support, and a half-hour conversation with that team is the most valuable input to the question map.",
      },
    },
    {
      question: {
        tr: "İhracat yapan bir sanayi şirketi için GEO neden önemli?",
        en: "Why does GEO matter for an exporting manufacturer?",
      },
      answer: {
        tr: "Yabancı alıcının tedarikçi araştırması giderek bir sohbetle başlıyor: \"Türkiye'de bu parçayı kim üretir\" gibi bir soruyla. Fuar, B2B rehberi ve aracı bu evreden sonra geliyor; cevapta adı geçmeyen üretici kısa listeye hiç girmiyor. Meccanotecnica Umbra'da SEO ve GEO mimarisi dört dilde (TR, EN, AR, RU) kuruldu; SIM Baskı Malzemeleri'nde beş dilli yapı, talebin Türkiye dışından da gelmesinin önünü açtı.",
        en: "A foreign buyer's supplier search increasingly starts as a conversation, with a question like \"who makes this part in Türkiye\". Trade fairs, B2B directories and intermediaries come after that stage, and a manufacturer missing from the answer never reaches the shortlist. At Meccanotecnica Umbra the SEO and GEO architecture was built in four languages (TR, EN, AR, RU); at SIM Printing Suppliers the five-language structure opened the door to demand from outside Türkiye.",
      },
    },
    {
      question: {
        tr: "Çalışma bittiğinde elimizde ne kalıyor?",
        en: "What do we keep when the engagement ends?",
      },
      answer: {
        tr: "Botlara açık ve şeması doğrulanmış bir site, içerik kayıtlarından üretilen llms.txt, soru haritası, yeniden yazılmış sayfalar ve ay ay tutulmuş ölçüm tablosu kalır. Ölçüm turu iç ekibinize öğretilir: aynı 10 soru, aynı üç motor, aynı kayıt biçimi. Promptlar değişmediği sürece seri kırılmaz ve sonraki ayları kendi başınıza kıyaslayabilirsiniz; dışarıda yalnız dönemsel denetim kalır.",
        en: "You keep a site open to crawlers with validated schema, an llms.txt generated from content records, the question map, the rewritten pages and a measurement table kept month by month. The measurement round is taught to your team: the same 10 questions, the same three engines, the same record format. As long as the prompts stay the same the series holds, so you can compare the following months yourselves; only periodic review stays outside.",
      },
    },
  ],

  updatedAt: "2026-09-25",

  seo: {
    /**
     * Ticari biçim başta: "GEO danışmanlığı". "ajansı" başlığa GİRMEZ —
     * `cro` istisnası yalnız o kayıt içindir (`keyword-coverage.test.ts`).
     */
    title: {
      tr: "GEO danışmanlığı: yapay zekada görünürlük",
      en: "GEO consulting: visibility in AI answers",
    },
    description: {
      tr: "GEO danışmanlığı: ChatGPT, Gemini ve Perplexity cevaplarında kaynak gösterilmek için teknik zemin, soru-cevap içerik ve her ay 30 sorguluk ölçüm turu.",
      en: "GEO consulting: technical groundwork, question-led content and a 30-query monthly measurement round to get cited in ChatGPT, Gemini and Perplexity answers.",
    },
    entities: {
      tr: [
        "INDOLES",
        "GEO danışmanlığı",
        "GEO ajansı",
        "yapay zeka arama optimizasyonu",
        "ChatGPT",
        "Perplexity",
        "llms.txt",
      ],
      en: [
        "INDOLES",
        "generative engine optimization",
        "GEO consulting",
        "GEO agency",
        "ChatGPT",
        "Perplexity",
        "llms.txt",
      ],
    },
  },

  /**
   * Kanıt şeridi elle seçildi: SIM Baskı'nın metrikleri doğrudan GEO
   * sonucu ("GEO görünürlüğü 40.000"); İstanbul Ortez Protez'in içeriği
   * SEO ve GEO için birlikte yazıldı. Künyesinde GEO taşıyan üçüncü vaka
   * Meccanotecnica Umbra bilinçli olarak şeritte değil: ölçülmüş sonucu
   * teklif talebi ve yanıt süresi, yani AI danışman ve portal işinin
   * sonucu (`cro.ts`teki MKComputer notuyla aynı ayrım).
   */
  featuredCaseSlugs: [
    "sim-baski-ihracat-icerigi",
    "istanbul-ortez-protez-arama-gorunurlugu",
  ],

  /** Paketi yok — pillar paketine düşülmez (ADR-040, `types.ts`). */
  relatedPackages: null,
  relatedServices: ["ai-danismanlik", "marka-stratejisi", "performans-pazarlama"],
};
