import type { ArticleContent } from "./types";

/**
 * Journal yazıları (ADR-020).
 *
 * İki kaynak: launch'ta yazılan kısa yazılar + eski WordPress blogundan
 * taşınan arşiv. Eski yazılar migrasyonda zenginleştirilir (docs/03 §Journal:
 * orta-editorial, yazarın sesi ön planda — eski blogun samimi, hikâye
 * anlatıcı tonu korunur) ve SEO/GEO yapısına oturtulur: h2 çapaları,
 * kendine yeten pasajlar, soru-cevap blokları.
 *
 * Güncelleme disiplini: eski tarihli bilgi güncellenmeden yeniden
 * yayımlanmaz. Güncellenen yazı `updatedAt` + `updateNote` taşır; okur da
 * arama motoru da neyin ne zaman değiştiğini görür.
 */
export const ARTICLES: ArticleContent[] = [
  {
    slug: {
      tr: "dijital-donusum-nereden-baslar",
      en: "where-digital-transformation-begins",
    },
    title: {
      tr: "Dijital dönüşüm nereden başlar?",
      en: "Where does digital transformation begin?",
    },
    excerpt: {
      tr: "ERP'den değil. AI'dan değil. Sürecinden başlar. Üç soru, bir yol.",
      en: "Not with ERP. Not with AI. With process. Three questions, one path.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Şirketlerin büyük çoğunluğu dijital dönüşümü yanlış yerden başlatır. \"ERP alalım\" veya \"AI yapalım\" cümleleri çözüm değil; teşhis eksikliğinin semptomudur.",
          en: "Most companies start digital transformation in the wrong place. Phrases like \"let's get an ERP\" or \"let's do AI\" aren't solutions — they're symptoms of missing diagnosis.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Doğru başlangıç üç soruyla olur: Hangi süreç bize en çok para kaybettiriyor? Hangi süreçte veri zaten var ama kullanılmıyor? Hangi süreci ölçmezsek şirket olarak ne olduğunu anlayamıyoruz?",
          en: "The right starting point is three questions: Which process costs us the most money? Which process already has data that isn't being used? Which process, if we don't measure it, leaves us blind as a company?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu üç sorunun cevabını yan yana koyarsan, dijitalleştirilecek ilk süreci bulmuşsun demektir. Gerisi seçim değil, sıralama meselesidir.",
          en: "Put the answers side by side, and you've found the first process to digitize. The rest is sequencing, not choice.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dijital dönüşüm bir kampanya değildir. Yıllardır aynı iş akışını süren bir şirket, tek bir teknoloji projesiyle değişmez. İlk süreç pilot olur, ikinci ve üçüncü süreç bu pilotun öğrettiği yöntemle hızlanır, dördüncüden itibaren şirket dönüşmüş sayılır.",
          en: "Digital transformation isn't a campaign. A company running the same workflow for years won't change through a single technology project. The first process is the pilot; the second and third accelerate using what the pilot taught; by the fourth, the company has transformed.",
        },
      },
      {
        type: "p",
        text: {
          tr: "INDOLES'ın Transform pillar'ında izlediğimiz yol tam budur: Teşhis → Audit → Pilot → Ölçek + bilgi aktarımı. Her adım bir öncekinin üzerine kurulur; atlanmaz.",
          en: "That's exactly the path we follow in INDOLES's Transform pillar: Diagnose → Audit → Pilot → Scale + knowledge transfer. Each step builds on the previous; no skipping.",
        },
      },
    ],
    category: "transform",
    tags: ["dijital-donusum", "metodoloji", "sanayi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-03-18",
    readingMinutes: 3,
  },
  {
    slug: {
      tr: "buyume-sadece-reklamla-olmaz",
      en: "growth-is-more-than-ads",
    },
    title: {
      tr: "Büyüme sadece reklamla olmaz.",
      en: "Growth is more than ads.",
    },
    excerpt: {
      tr: "Performans bütçesini ikiye katlayıp büyüyemeyen e-ticaretçiler için dört test.",
      en: "Four tests for e-commerce brands who doubled their performance budget and still didn't grow.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Performans pazarlama bütçesini her ay biraz daha artıran ama büyümeyen e-ticaretçiler bir noktada aynı soruya takılır: başka ne yapmalıyız?",
          en: "E-commerce brands raising their performance budget month after month without growing eventually arrive at the same question: what else should we do?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevap genellikle bütçede değil, funnel'da. Dört hızlı test:",
          en: "The answer is usually not in the budget but in the funnel. Four quick tests:",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Ürün sayfasındaki dönüşüm oranı sektör ortalamasının altındaysa, trafik değil sayfa problemidir.",
            en: "If product page conversion is below industry average, it's a page problem, not a traffic problem.",
          },
          {
            tr: "Marka aramasından gelen trafik toplamın %60'ının üstündeyse, görünürlük değil marka bilinirliği problemidir.",
            en: "If brand search is above 60% of total traffic, the issue is awareness, not visibility.",
          },
          {
            tr: "Tekrarlayan müşteri oranı %15'in altındaysa, edinim değil tutma problemidir.",
            en: "If repeat customer rate is below 15%, it's retention, not acquisition.",
          },
          {
            tr: "Kanal dağılımında tek kanal %50'nin üstündeyse, o kanal düştüğünde iş düşer. Dağılım şarttır.",
            en: "If one channel holds above 50% of the mix, the business falls when the channel does. Diversification is required.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu dört testin herhangi birine \"evet\" diyorsan, performans bütçesini artırmak kaybı büyütür. Önce sorunu bul.",
          en: "If the answer is \"yes\" to any of these, increasing the performance budget magnifies the loss. Find the problem first.",
        },
      },
    ],
    category: "growth",
    tags: ["buyume", "e-ticaret", "funnel"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-02-24",
    readingMinutes: 3,
  },
  {
    slug: {
      tr: "ai-pilot-neden-basarisiz-olur",
      en: "why-ai-pilots-fail",
    },
    title: {
      tr: "AI pilotu neden başarısız olur?",
      en: "Why AI pilots fail.",
    },
    excerpt: {
      tr: "Model değil. Veri değil. Çoğunlukla: kullanıcı.",
      en: "Not the model. Not the data. Usually: the user.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "AI pilot projelerinin büyük çoğunluğu prototip aşamasında durur. Sebep model kalitesi değil, kullanıcı adaptasyonu.",
          en: "Most AI pilot projects stall at the prototype stage. The reason isn't model quality — it's user adoption.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Model mükemmel çalışır ama kimse günlük iş akışının bir parçası olarak kullanmıyorsa pilot başarısızdır. Teknoloji problemi çözüldüğünde, değişim problemi başlamış olur.",
          en: "The model may work perfectly, but if no one uses it as part of their daily workflow, the pilot has failed. Once the technology problem is solved, the change-management problem begins.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Başarılı AI pilot için üç kural: (1) tek kullanım senaryosu, (2) kullanıcıyla birlikte tasarım, (3) gerçek saha testi — demo değil.",
          en: "Three rules for a successful AI pilot: (1) single use case, (2) design together with the user, (3) real field test — not a demo.",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Çalışıyor\" cümlesi ile \"kullanılıyor\" cümlesi arasında bir uçurum var. Pilot başarılıysa, ikincisi olduğu kesindir.",
          en: "There's a chasm between \"it works\" and \"it's used\". A successful pilot is firmly on the second side.",
        },
      },
    ],
    category: "transform",
    tags: ["ai", "pilot", "degisim-yonetimi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-01-30",
    readingMinutes: 3,
  },
  {
    // Eski blogdan taşındı (2024-07-27); Ağustos 2026'da AI çağı bölümü ve
    // SSS eklenerek güncellendi. TR slug eski URL ile aynı — redirect tek
    // adımda çözülür (next.config.ts).
    slug: {
      tr: "dijital-cagda-gerilla-pazarlama-evrimi",
      en: "guerrilla-marketing-in-the-digital-age",
    },
    title: {
      tr: "Gerilla pazarlama dijital çağda nasıl evriliyor?",
      en: "How is guerrilla marketing evolving in the digital age?",
    },
    excerpt: {
      tr: "Alışılmadık, düşük maliyetli taktikleriyle bilinen gerilla pazarlama dijital çağa uyum sağladı. Değişmeyen iki şey: hikâye anlatımı ve gerçek içgörü.",
      en: "Known for unconventional, low-cost tactics, guerrilla marketing has adapted to the digital age. Two things haven't changed: storytelling and real insight.",
    },
    updatedAt: "2026-08-22",
    updateNote: {
      tr: "Bu yazı ilk olarak 27 Temmuz 2024'te yayımlandı. 22 Ağustos 2026'da gözden geçirildi: \"AI çağında gerilla pazarlama\" bölümü ve sık sorulan sorular eklendi.",
      en: "First published on 27 July 2024. Revised on 22 August 2026: the \"Guerrilla marketing in the AI age\" section and the FAQ were added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Çok kolay… Ne derler bilirsiniz: \"Gerilla pazarlama, yaratıcılığın etkiyle buluştuğu yer.\"",
          en: "Easy one… You know what they say: \"Guerrilla marketing is where creativity meets impact.\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dijital pazarlamanın hızlı dünyasında markalar dikkat çekmek, kitlesinin aklını başından almak ve etkileşim yaratmak için sürekli yeni — bazen de alışılmadık — yollar arar. Zamanın testinden geçmiş ve hâlâ evrilen bir strateji var: gerilla pazarlama. Geleneksel olmayan, düşük maliyetli taktikleriyle bilinen bu yaklaşım dijital çağa uyum sağladı; ama iki şeyi hiç bırakmadı: hikâye anlatımı ve gerçek içgörü.",
          en: "In the fast world of digital marketing, brands constantly look for new — sometimes unconventional — ways to grab attention, sweep their audience off their feet and create engagement. One strategy has stood the test of time and keeps evolving: guerrilla marketing. Known for its untraditional, low-cost tactics, it has adapted to the digital age without ever letting go of two things: storytelling and real insight.",
        },
      },
      {
        type: "h2",
        id: "gerilla-pazarlamanin-evrimi",
        text: {
          tr: "Gerilla pazarlamanın evrimi",
          en: "The evolution of guerrilla marketing",
        },
      },
      {
        type: "p",
        text: {
          tr: "Gerilla pazarlama, 1980'lerde geleneksel ve pahalı reklam yöntemlerine bir tepki olarak doğdu; terimi 1984'te Jay Conrad Levinson aynı adlı kitabıyla literatüre soktu. Bazı \"kafa yoran\" adamlar daha fazlası olması gerektiğini biliyor olmalıydı… Yöntemin özü, unutulmaz marka deneyimleri yaratmak için yaratıcılığa, sürprize ve alışılmadık yaklaşımlara dayanmaktı.",
          en: "Guerrilla marketing was born in the 1980s as a reaction to traditional, expensive advertising; Jay Conrad Levinson coined the term with his 1984 book of the same name. Some \"deep thinkers\" must have known there had to be more… At its core, the method relied on creativity, surprise and unconventional approaches to create unforgettable brand experiences.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugünün ortamında gerilla pazarlama dijital araçları, sosyal medyayı ve veri analitiğini içerecek şekilde evrildi. Sonuç: her zamankinden daha etkili ve — sokak pazarlamasının tarihinde ilk kez — gerçekten ölçülebilir.",
          en: "In today's landscape it has evolved to include digital tools, social media and data analytics. The result: more effective than ever and — for the first time in the history of street marketing — genuinely measurable.",
        },
      },
      {
        type: "h2",
        id: "dijital-araclarin-rolu",
        text: {
          tr: "Dijital araçların rolü",
          en: "The role of digital tools",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dijital araçlar, markaların daha geniş kitlelere ulaşmasını ve kampanya başarısını doğru ölçmesini sağlayarak gerilla pazarlamada devrim yarattı. Sosyal medya platformları, artırılmış gerçeklik (AR), sanal gerçeklik (VR) ve veri analitiği, sürükleyici deneyimler için yeni yollar açıyor. Bir şehirde kurgulanan AR tabanlı bir hazine avı, katılımcıları hem sahada hem çevrimiçi meşgul ederek kampanyanın erişimini katlayabilir.",
          en: "Digital tools revolutionized guerrilla marketing by letting brands reach wider audiences and measure campaign success properly. Social platforms, augmented reality (AR), virtual reality (VR) and data analytics open new paths for immersive experiences. An AR treasure hunt staged across a city can engage participants both on the street and online, multiplying a campaign's reach.",
        },
      },
      {
        type: "p",
        text: {
          tr: "2026 itibarıyla bu listeye üretken AI de eklendi: kampanya fikri saatler içinde prototiplenebiliyor, görsel ve senaryo üretimi ucuzladı. Ama araç bolluğu fikrin değerini düşürmedi — tam tersine artırdı. Herkesin aynı araçlara sahip olduğu yerde fark, hâlâ fikirde.",
          en: "As of 2026, generative AI has joined that list: a campaign idea can be prototyped in hours, and visual and script production got cheap. But the abundance of tools didn't devalue the idea — it did the opposite. Where everyone holds the same tools, the difference is still the idea.",
        },
      },
      {
        type: "h2",
        id: "hikaye-anlatiminin-gucu",
        text: {
          tr: "Hikâye anlatımının gücü",
          en: "The power of storytelling",
        },
      },
      {
        type: "p",
        text: {
          tr: "Başarılı gerilla kampanyalarının kalbinde ilgi çekici hikâye anlatımı yatar. Belki bilmiyorsunuzdur ama hikâye anlatımı, insanlığın icat ettiği ilk meslektir. Bir düşünün.",
          en: "At the heart of every successful guerrilla campaign lies compelling storytelling. You may not know this, but storytelling is the first profession humanity ever invented. Think about it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Tüketicinin bilgi bombardımanına tutulduğu bir çağda hikâyeler, markaların gürültüyü aşmasına ve kitleleriyle duygusal bağ kurmasına yardımcı olur. İyi kurgulanmış bir anlatı, basit bir pazarlama numarasını tüketicide derinden yankı uyandıran bir marka deneyimine dönüştürür.",
          en: "In an age of information bombardment, stories help brands cut through the noise and build emotional bonds with their audience. A well-built narrative turns a simple marketing stunt into a brand experience that resonates deeply.",
        },
      },
      {
        type: "p",
        text: {
          tr: "ALS Ice Bucket Challenge'ı düşünün. O kampanya insanların başından aşağı buzlu su dökmesiyle ilgili değildi; ALS'den etkilenenlerin kişisel hikâyelerini paylaşmak ve başkalarını davaya katılmaya çağırmakla ilgiliydi. Meydan okumanın viral doğası, paylaşılan hikâyelerin duygusal gücüyle birleşince ortaya dijital çağın en başarılı gerilla kampanyalarından biri çıktı.",
          en: "Think of the ALS Ice Bucket Challenge. That campaign wasn't about people pouring ice water over their heads; it was about sharing the personal stories of those affected by ALS and calling others to join the cause. The viral nature of the challenge, combined with the emotional power of the shared stories, produced one of the digital age's most successful guerrilla campaigns.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Gerçek içgörü toplamak",
          en: "Gathering real insight",
        },
      },
      {
        type: "p",
        text: {
          tr: "Etkili bir gerilla kampanyası için markanın, kitlesinin davranışları ve tercihleri hakkında gerçek içgörü toplaması gerekir. Bu, temel demografinin ötesine geçmek demektir: tüketici eylemini yönlendiren motivasyonu, duyguyu ve deneyimi anlamak. Veri analitiği ve sosyal dinleme araçları tam burada devreye girer — sosyal medya konuşmaları, çevrimiçi yorumlar ve müşteri geri bildirimi analiz edildiğinde trendler, karşılanmamış ihtiyaçlar ve kampanyanın konuşacağı gerçek dert ortaya çıkar.",
          en: "An effective guerrilla campaign requires real insight into the audience's behavior and preferences. That means going beyond basic demographics: understanding the motivation, emotion and experience driving consumer action. Data analytics and social listening tools come in exactly here — analyze social conversations, online reviews and customer feedback, and the trends, unmet needs and the real pain the campaign should speak to come to the surface.",
        },
      },
      {
        type: "h2",
        id: "vaka-share-a-coke",
        text: {
          tr: "Vaka: Coca-Cola \"Share a Coke\"",
          en: "Case: Coca-Cola's \"Share a Coke\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Hikâye anlatımını ve içgörü toplamayı başarıyla birleştiren modern örneklerden biri, Coca-Cola'nın 2011'de başlattığı \"Share a Coke\" kampanyasıdır. Şişelerin üzerindeki ikonik logo yaygın isimlerle değiştirildi; tüketiciler arkadaşlarıyla ve aileleriyle \"bir kola paylaşmaya\" çağrıldı.",
          en: "One modern example that successfully combined storytelling with insight gathering is Coca-Cola's \"Share a Coke\" campaign, launched in 2011. The iconic logo on the bottles was replaced with common first names, and consumers were invited to \"share a Coke\" with friends and family.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kampanyanın dehası, deneyimi kişiselleştirmesindeydi. Şişede kendi adını gören her tüketiciyle kişisel bir bağ kuruldu; anlatı basit ama güçlüydü: bir kola paylaşmak, sevdiklerinle bağ kurmak ve anı özel kılmak demek. İçgörü tarafında Coca-Cola her pazardaki en popüler isimleri veri analitiğiyle seçti, sosyal dinlemeyle kampanyanın etkisini gerçek zamanlı izledi ve gerektiğinde ayar yaptı. Sonuç rakamlara da yansıdı: satış artışı, yaygın sosyal medya etkileşimi ve markayla tüketici arasında yenilenen duygusal bağ.",
          en: "The genius of the campaign was personalization. Every consumer who saw their own name on a bottle formed a personal connection; the narrative was simple but strong: sharing a Coke means bonding with the people you love and making the moment special. On the insight side, Coca-Cola picked the most popular names in each market through data analytics, tracked the campaign's impact in real time through social listening, and adjusted as needed. The results showed in the numbers: a lift in sales, widespread social engagement and a renewed emotional bond between brand and consumer.",
        },
      },
      {
        type: "h2",
        id: "ai-caginda-gerilla-pazarlama",
        text: {
          tr: "2026 güncellemesi: AI çağında gerilla pazarlama",
          en: "2026 update: guerrilla marketing in the AI age",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıyı 2024 yazında yayımladığımızda üretken AI henüz pazarlama ekiplerinin gündemine yeni giriyordu. Aradan geçen iki yılda dikkat ekonomisi yeniden şekillendi — ve gerilla pazarlamanın eli güçlendi.",
          en: "When we first published this piece in the summer of 2024, generative AI was just entering marketing teams' agendas. In the two years since, the attention economy has been reshaped — and guerrilla marketing's hand got stronger.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Birincisi: feed'ler AI üretimi içerikle doldu. Herkes sınırsız içerik üretebildiğinde, gerçek dünyada gerçekten yaşanmış sahici bir an bin üretilmiş görselden daha değerli hale geldi. İyi bir gerilla işi tam da budur — sahnelenemez görünen, paylaşmadan duramadığınız an. AI içerik bolluğu gerilla pazarlamanın değerini düşürmedi; ayrışma gücünü artırdı.",
          en: "First: the feeds filled up with AI-generated content. When everyone can produce unlimited content, an authentic moment that actually happened in the real world became worth more than a thousand generated visuals. That is exactly what a good guerrilla stunt is — the moment that looks unstageable and that you can't help sharing. The abundance of AI content didn't devalue guerrilla marketing; it sharpened its power to stand out.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkincisi: kampanyanın ikinci hayatı artık AI motorlarında geçiyor. İnsanlar \"en iyi gerilla kampanyaları\" sorusunu Google'a olduğu kadar ChatGPT'ye, Gemini'ye ve Perplexity'ye de soruyor. Bu motorlar hakkında yazılan, konuşulan, kaynak gösterilen işleri anlatıyor. Yani denklem netleşti: konuşulmaya değer iş, alıntılanabilir iştir. Kampanyanız hakkında haber yazdırıyor, sözlük girdisi açtırıyor, video çektiriyorsa — AI cevaplarında yıllarca yaşamaya devam eder. Buna bugün GEO (Generative Engine Optimization) diyoruz; gerilla pazarlama, GEO'nun en doğal beslenme kaynağıdır.",
          en: "Second: a campaign's second life now plays out inside AI engines. People ask \"the best guerrilla campaigns\" not only to Google but to ChatGPT, Gemini and Perplexity. These engines retell the work that got written about, talked about, cited. The equation is now clear: work worth talking about is work worth citing. If your campaign gets articles written, entries opened, videos shot — it keeps living inside AI answers for years. Today we call this GEO (Generative Engine Optimization), and guerrilla marketing is its most natural feedstock.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üçüncüsü: dağıtımın omurgası değişti. Stunt'ı çekip paylaşan kitle, kampanyanın medya bütçesidir. Kısa video (Reels, TikTok, Shorts) ve mikro-influencer'lar, 2024'te tamamlayıcıydı; bugün ana kanal. Sahada yüz kişinin yaşadığı bir an, doğru kurgulanırsa milyonlarca kişinin izlediği bir hikâyeye dönüşüyor.",
          en: "Third: the backbone of distribution changed. The crowd that films and shares the stunt is the campaign's media budget. Short video (Reels, TikTok, Shorts) and micro-influencers were complementary in 2024; today they're the main channel. A moment lived by a hundred people on the street becomes, with the right framing, a story watched by millions.",
        },
      },
      {
        type: "h2",
        id: "etkili-kampanya-icin-5-ipucu",
        text: {
          tr: "Etkili kampanya için 5 ipucu",
          en: "5 tips for an effective campaign",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Teknolojiden yararlanın: AR, kısa video ve üretken AI araçları erişiminizi katlar — ama aracı değil, fikri merkeze koyun.",
            en: "Use technology: AR, short video and generative AI tools multiply your reach — but put the idea at the center, not the tool.",
          },
          {
            tr: "İlgi çekici bir hikâye anlatın: kitlenizde duygusal düzeyde yankı uyandıran bir anlatı, kampanyayı unutulmaz kılar ve paylaşımı tetikler.",
            en: "Tell a compelling story: a narrative that resonates emotionally makes the campaign unforgettable and triggers sharing.",
          },
          {
            tr: "Gerçek içgörü toplayın: veri analitiği ve sosyal dinlemeyle kitlenizin motivasyonunu, tercihlerini ve acı noktalarını anlayın.",
            en: "Gather real insight: use data analytics and social listening to understand your audience's motivations, preferences and pain points.",
          },
          {
            tr: "Otantik olun: gerilla pazarlamada sahicilik anahtardır. Kampanya marka değerlerinizle uyumlu olmalı, kitleyle samimi konuşmalı.",
            en: "Be authentic: in guerrilla marketing, authenticity is key. The campaign must align with your brand values and speak to the audience sincerely.",
          },
          {
            tr: "Ölçün ve uyarlayın: performansı sürekli izleyin — 2026'da buna AI motorlarındaki görünürlüğünüz de dahil. Geri bildirime göre ayar yapmaya hazır olun.",
            en: "Measure and adapt: track performance continuously — in 2026 that includes your visibility inside AI engines. Be ready to adjust based on feedback.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Gerilla pazarlama, yaratıcılık ve sürpriz gibi temel ilkelerine sadık kalarak köklerinden bu yana uzun bir yol katetti. Dijital çağda en başarılı kampanyalar, hikâye anlatımının gücünü gerçek içgörüyle birleştirenler. Araçlar değişiyor, kanallar değişiyor, motorlar değişiyor — ama bir şey kesin: iyi bir hikâyenin ve samimi bir içgörünün yerini hiçbir şey almıyor.",
          en: "Guerrilla marketing has come a long way from its roots while staying true to its core principles of creativity and surprise. The most successful campaigns of the digital age combine the power of storytelling with real insight. Tools change, channels change, engines change — but one thing is certain: nothing replaces a good story and a sincere insight.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Gerilla pazarlama nedir?",
          en: "What is guerrilla marketing?",
        },
        answer: {
          tr: "Gerilla pazarlama; büyük medya bütçesi yerine yaratıcılığa, sürprize ve alışılmadık mecralara dayanan pazarlama yaklaşımıdır. Amaç, hedef kitlenin beklemediği bir yerde ve anda unutulmaz bir marka deneyimi yaratmaktır. Terim, Jay Conrad Levinson'ın 1984 tarihli \"Guerrilla Marketing\" kitabıyla yaygınlaştı.",
          en: "Guerrilla marketing is an approach that relies on creativity, surprise and unconventional channels instead of a big media budget. The goal is to create an unforgettable brand experience where and when the audience least expects it. The term spread with Jay Conrad Levinson's 1984 book \"Guerrilla Marketing\".",
        },
      },
      {
        question: {
          tr: "Gerilla pazarlama küçük işletmeler için uygun mu?",
          en: "Is guerrilla marketing suitable for small businesses?",
        },
        answer: {
          tr: "Evet — hatta yöntem tam olarak bunun için doğdu. Gerilla pazarlamanın girdisi bütçe değil fikirdir: yerel bir stunt, doğru kurgulanmış bir kısa video ve paylaşan bir topluluk, küçük bir işletmeye büyük medya bütçelerinin satın alamayacağı bir görünürlük kazandırabilir.",
          en: "Yes — in fact, the method was born for exactly this. The input of guerrilla marketing is the idea, not the budget: a local stunt, a well-framed short video and a community that shares can give a small business visibility that big media budgets can't buy.",
        },
      },
      {
        question: {
          tr: "Gerilla pazarlamanın riskleri nelerdir?",
          en: "What are the risks of guerrilla marketing?",
        },
        answer: {
          tr: "Üç ana risk: yanlış anlaşılma (kampanyanın amacının ters okunması), izin ve hukuk (kamusal alan kullanımı, marka ve telif hakları) ve marka güvenliği (stunt'ın markanın değerleriyle çelişmesi). Üçü de aynı yöntemle yönetilir: kampanyayı küçük ölçekte test etmek, hukuki kontrolü baştan yapmak ve anlatının markanın sesiyle uyumunu kontrol etmek.",
          en: "Three main risks: misreading (the campaign's intent being taken the wrong way), permits and legal (use of public space, trademark and copyright) and brand safety (the stunt contradicting the brand's values). All three are managed the same way: test the campaign at small scale, do the legal check upfront, and verify the narrative matches the brand's voice.",
        },
      },
      {
        question: {
          tr: "2026'da gerilla pazarlama hâlâ işe yarıyor mu?",
          en: "Does guerrilla marketing still work in 2026?",
        },
        answer: {
          tr: "Her zamankinden daha iyi çalışıyor. Feed'ler AI üretimi içerikle dolduğu için gerçek dünyada yaşanmış sahici bir deneyim daha kolay ayrışıyor. Ek kazanım: konuşulmaya değer bir kampanya hakkında yazılan her içerik, AI motorlarının (ChatGPT, Gemini, Perplexity) cevaplarında markayı yıllarca yaşatıyor — gerilla pazarlama, GEO'nun en doğal kaynağıdır.",
          en: "Better than ever. With feeds full of AI-generated content, an authentic experience lived in the real world stands out more easily. The bonus: everything written about a campaign worth talking about keeps the brand alive for years inside AI engines' answers (ChatGPT, Gemini, Perplexity) — guerrilla marketing is GEO's most natural source.",
        },
      },
    ],
    category: "growth",
    tags: ["gerilla-pazarlama", "hikaye-anlaticiligi", "growth-hacking"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-07-27",
    readingMinutes: 6,
  },

  {
    // Eski blogdan taşındı (2024-07-30). Orijinalin sonuç bölümü yayımlanmamış
    // bir taslak talimatıydı ("...özetleyin, ...vurgulayın") — migrasyonda
    // gerçek bir kapanış yazıldı; cevapsız "dikkate alınacak sorular" blokları
    // SSS'ye taşındı. TR slug eski URL ile aynı.
    slug: {
      tr: "basarili-pazarlama-icin-insan-psikolojisinde-ustalasmak",
      en: "marketing-for-a-roman-emperor",
    },
    title: {
      tr: "Bir Roma imparatoru için pazarlama: hikâye, içgörü ve insan psikolojisi",
      en: "Marketing for a Roman emperor: story, insight and human psychology",
    },
    excerpt: {
      tr: "Sezar'ın toprakları ve kalpleri fethettiği ilkeler bugün de geçerli: hikâye anlatımı, gerçek içgörü ve insan psikolojisi. Roma'dan modern pazarlamaya bir rehber.",
      en: "The principles Caesar used to conquer lands and hearts still hold: storytelling, real insight and human psychology. A guide from Rome to modern marketing.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 30 Temmuz 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: sonuç bölümü yeniden yazıldı, \"Sezar'dan dil modellerine\" notu ve sık sorulan sorular eklendi.",
      en: "First published on 30 July 2024. Revised on 23 August 2026: the conclusion was rewritten, and the \"From Caesar to language models\" note and the FAQ were added.",
    },
    blocks: [
      {
        type: "quote",
        text: {
          tr: "\"Savaşta önemli olaylar, önemsiz nedenlerin sonucudur.\" — Julius Caesar",
          en: "\"In war, events of importance are the result of trivial causes.\" — Julius Caesar",
        },
      },
      {
        type: "p",
        text: {
          tr: "Roma'da pazarlama dünyası mı? Bir an için antik Roma'nın kalbinde durduğunuzu hayal edin. Yıl milattan önce 44; hareketli sokaklar tüccarlar, askerler ve vatandaşlarla dolu. Kalabalığın üzerinde, gücün belirgin nişanlarını taşıyan Gaius Julius Caesar yükseliyor — bir strateji ve nüfuz ustası. Peki ya size Sezar'ın toprakları ve kalpleri fethetmek için kullandığı ilkelerin modern pazarlamaya da uygulanabileceğini söylesem?",
          en: "Marketing in Rome? Picture yourself, for a moment, in the heart of ancient Rome. The year is 44 BC; the bustling streets are full of merchants, soldiers and citizens. Rising above the crowd, wearing the unmistakable insignia of power, stands Gaius Julius Caesar — a master of strategy and influence. Now, what if I told you the very principles Caesar used to conquer lands and hearts apply to modern marketing too?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Hikâye anlatımının eskimeyen sanatını, içgörünün gücünü ve insan psikolojisinin inceliklerini incelediğimiz bu bölüme hoş geldiniz. İster deneyimli bir CMO, ister pazarlama yöneticisi, ister işletme sahibi olun — ikna edici bir marka anlatısı kurmak için bu üç unsuru anlamak, dijital çağda işinizi ileri taşımanın ön koşulu.",
          en: "Welcome to the chapter where we examine the timeless art of storytelling, the power of insight and the subtleties of human psychology. Whether you're a seasoned CMO, a marketing manager or a business owner — understanding these three elements is the precondition for building a persuasive brand narrative and moving your business forward in the digital age.",
        },
      },
      {
        type: "h2",
        id: "hikaye-anlatiminin-gucu",
        text: {
          tr: "Pazarlamada hikâye anlatımının gücü",
          en: "The power of storytelling in marketing",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Hikâyenizi bir Sezar gibi anlatın!",
          en: "Tell your story like a Caesar!",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sezar'ın Roma Senatosu önünde durup Galya'daki zaferlerini anlattığını hayal edin. Sözleri savaşların kuru bir dökümü değil; canlı cesaret, strateji ve zafer hikâyeleridir. Bu hikâyeler dinleyicilerini büyüler, sadakatlerini ve desteklerini güvence altına alır. Sezar, gerçeklerin tek başına insanlara ilham veremeyeceğini biliyordu: kelimeleriyle resimler çizdi, sıradan raporları epik destanlara dönüştürdü.",
          en: "Imagine Caesar standing before the Roman Senate, recounting his victories in Gaul. His words are not a dry tally of battles; they are vivid stories of courage, strategy and triumph. These stories captivate his listeners and secure their loyalty and support. Caesar knew facts alone don't inspire people: he painted pictures with words and turned ordinary reports into epic sagas.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı teknik pazarlamada da geçerli. Kitleniz her gün bilgi bombardımanına tutuluyor; bu gürültüyü yalnızca ilgi çekici hikâyeler aşabilir. Apple, Nike ve Coca-Cola bu sanatta ustalaştı: Apple'ın hikâyesi teknolojiyle değil, statükoya meydan okumakla ilgilidir. Nike'ın \"Just Do It\" kampanyası sporla değil, insan ruhu ve zorlukların üstesinden gelmekle ilgilidir. Steve Jobs iPhone'u tanıttığında özelliklerini saymadı; iletişimin geleceği hakkında bir hikâye anlattı — ve o anlatı, iPhone'u bir statü sembolüne dönüştürdü.",
          en: "The same technique holds in marketing. Your audience is bombarded with information every day; only compelling stories cut through that noise. Apple, Nike and Coca-Cola mastered this art: Apple's story isn't about technology, it's about defying the status quo. Nike's \"Just Do It\" isn't about sports, it's about the human spirit overcoming odds. When Steve Jobs introduced the iPhone he didn't list features; he told a story about the future of communication — and that narrative turned the iPhone into a status symbol.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Sahada nasıl uygulanır",
          en: "How to apply it in the field",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Kitlenizi tanıyın: Sezar'ın konuşmasını dinleyicisine göre uyarlaması gibi, hikâyeniz de kitlenizin acı noktalarına, arzularına ve değerlerine doğrudan hitap etmeli.",
            en: "Know your audience: just as Caesar tailored his speech to his listeners, your story must speak directly to your audience's pain points, desires and values.",
          },
          {
            tr: "Karakter yaratın: insanlar insanlarla bağ kurar. Marka hikâyenizde müşteriler, çalışanlar, hatta markanın kendisi karakter olabilir.",
            en: "Create characters: people bond with people. In your brand story the characters can be customers, employees, even the brand itself.",
          },
          {
            tr: "Anlatı yayı kurun: başlangıç, çatışma, çözüm. Sahneyi hazırlayın, zorluğu ortaya koyun, nasıl çözüldüğünü gösterin.",
            en: "Build a narrative arc: beginning, conflict, resolution. Set the scene, present the challenge, show how it resolves.",
          },
          {
            tr: "Görsel kullanın: Sezar'ın betimleyici dili neyse, bugünün infografiği, videosu ve fotoğrafı odur.",
            en: "Use visuals: what Caesar's descriptive language was then, today's infographics, video and photography are now.",
          },
          {
            tr: "Özgün olun ve duyguyu harekete geçirin: kararları duygular yönetir; neşe, nostalji, heyecan veya empati uyandıran samimi anlatılar güven kurar.",
            en: "Be authentic and move emotion: decisions are driven by feelings; sincere narratives that evoke joy, nostalgia, excitement or empathy build trust.",
          },
        ],
      },
      {
        type: "h2",
        id: "icgoru-kitlenizi-anlamak",
        text: {
          tr: "İçgörü: kitlenizi anlamak",
          en: "Insight: understanding your audience",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sezar'ın Roma Forumu'nda yürüdüğünü, insanların seslerini dinlediğini, endişelerini anladığını ve duygularını ölçtüğünü hayal edin. Halkın zihnine dair bu keskin içgörü, stratejilerini uyarlamasına ve gücünü korumasına yardımcı oldu. Kitlelerin desteği olmadan gücünün geçici olacağını biliyordu; danışmanlarından, halka açık forumlardan, hatta düşmanlarından içgörü topladı.",
          en: "Picture Caesar walking the Roman Forum, listening to people's voices, understanding their worries, gauging their emotions. That sharp insight into the public mind helped him adapt his strategies and hold his power. He knew that without the crowd's support his power would be fleeting; he gathered insight from advisers, public forums, even his enemies.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün aynı işi veri analitiği, sosyal dinleme ve müşteri geri bildirimi yapıyor. Netflix'in başarısı izleme alışkanlıklarını okuyup içeriği kişiye uyarlamasına dayanır; Amazon kişiselleştirilmiş öneriden özel reklama kadar her adımı müşteri içgörüsüyle kurar. Ölçek değişti, ilke değişmedi: kitlenizi derinden tanımadan etkili strateji kuramazsınız.",
          en: "Today the same job is done by data analytics, social listening and customer feedback. Netflix's success rests on reading viewing habits and tailoring content to the person; Amazon builds every step, from personalized recommendations to targeted ads, on customer insight. The scale changed, the principle didn't: you can't build an effective strategy without knowing your audience deeply.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Segmentlere ayırın: kitlenizi davranış, demografi ve psikografiye göre bölün; strateji segment başına netleşir.",
            en: "Segment: divide your audience by behavior, demographics and psychographics; strategy sharpens per segment.",
          },
          {
            tr: "Kişiselleştirin: içgörüyü, her segment için daha alakalı mesajlar kurmak üzere kullanın.",
            en: "Personalize: use insight to build more relevant messages for each segment.",
          },
          {
            tr: "İzleyin ve ayarlayın: kampanya performansını sürekli izleyin; gerçek zamanlı veriye ve geri bildirime göre düzeltin.",
            en: "Monitor and adjust: track campaign performance continuously; correct based on real-time data and feedback.",
          },
        ],
      },
      {
        type: "h2",
        id: "insan-psikolojisi",
        text: {
          tr: "İnsan psikolojisi: karar vermeyi etkilemek",
          en: "Human psychology: influencing decisions",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sezar hem müttefiklerinin hem rakiplerinin zihinlerini etkilemekte ustaydı. İnsanları neyin motive ettiğini anlıyor, stratejilerini doğrudan arzulara ve korkulara hitap edecek şekilde kuruyordu. İnsan doğasına dair bu derin anlayış, bugünün pazarlamasında antik Roma'daki kadar geçerli.",
          en: "Caesar was a master at influencing the minds of allies and rivals alike. He understood what motivates people and shaped his strategies to speak directly to desires and fears. That deep understanding of human nature is as valid in today's marketing as it was in ancient Rome.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Modern karşılıkları biliyorsunuz: kıtlık, sosyal kanıt, karşılıklılık, otorite. Lüks markalar sınırlı üretim ve süreli tekliflerle aciliyet yaratır; çevrimiçi yorumlar ve kullanıcı içerikleri satın alma kararını sosyal kanıtla döndürür. Bunlar numara değil, insan davranışının sabitleridir — doğru kullanıldığında güven kurar, yanlış kullanıldığında markayı yakar.",
          en: "You know the modern counterparts: scarcity, social proof, reciprocity, authority. Luxury brands create urgency with limited runs and timed offers; online reviews and user content turn purchase decisions on social proof. These are not tricks but constants of human behavior — used right they build trust, used wrong they burn the brand.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Kıtlık: sınırlı bulunabilirliği veya zamana duyarlı teklifleri vurgulayın — ama gerçek olduğunda.",
            en: "Scarcity: highlight limited availability or time-sensitive offers — but only when they're real.",
          },
          {
            tr: "Sosyal kanıt: referanslar, yorumlar ve kullanıcı içeriğiyle güvenilirlik kurun.",
            en: "Social proof: build credibility with testimonials, reviews and user-generated content.",
          },
          {
            tr: "Karşılıklılık: e-kitap veya ücretsiz deneme gibi gerçek bir değer sunun; karşılık kendiliğinden gelir.",
            en: "Reciprocity: offer real value like an e-book or a free trial; the return follows on its own.",
          },
          {
            tr: "Etik kalın: taktikleriniz manipüle etmemeli. Kitlenizi eğitin, otoritenizi bilgiyle kurun, markanız etrafında topluluk inşa edin.",
            en: "Stay ethical: your tactics must not manipulate. Educate your audience, build authority with knowledge, grow a community around your brand.",
          },
        ],
      },
      {
        type: "h2",
        id: "sezardan-dil-modellerine",
        text: {
          tr: "2026 notu: Sezar'dan dil modellerine",
          en: "2026 note: from Caesar to language models",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıyı 2024 yazında yayımladık. Aradan geçen iki yılda değişen şey ilkeler değil, ölçek oldu. Üretken AI ile herkes sınırsız içerik üretebiliyor — ve tam bu yüzden iyi hikâye daha da kıymetlendi. Bin tane kusursuz ama ruhsuz metnin arasında, gerçek bir karakteri ve gerçek bir çatışması olan anlatı anında ayrışıyor.",
          en: "We published this piece in the summer of 2024. In the two years since, what changed is not the principles but the scale. With generative AI everyone can produce unlimited content — and precisely for that reason, a good story became more valuable. Among a thousand flawless but soulless texts, a narrative with a real character and a real conflict stands out instantly.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İçgörü tarafında Netflix ve Amazon'un veri oyunu artık KOBİ'lerin de elinde: AI destekli analiz araçları segmentasyonu ve kişiselleştirmeyi ölçekledi. Ve yeni bir dinleyici geldi: dil modelleri. İnsanlar markaları artık ChatGPT'ye, Gemini'ye ve Perplexity'ye soruyor; bu motorlar da hikâyesi net anlatılmış, hakkında tutarlı konuşulan markaları aktarıyor. Sezar'ın Senato'su bugün kısmen bir dil modelinin cevabı — hikâyeniz orada da anlatılmaya değer olmalı.",
          en: "On the insight side, the data game of Netflix and Amazon is now in the hands of SMBs too: AI-assisted analytics scaled segmentation and personalization. And a new listener arrived: language models. People now ask ChatGPT, Gemini and Perplexity about brands, and these engines relay the brands whose stories are told clearly and spoken about consistently. Caesar's Senate today is partly a language model's answer — your story has to be worth telling there too.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir uyarıyla: psikolojik ilkeler AI hedeflemeyle birleşince güç katlanır — sorumluluk da. Kıtlığı uydurmak, sosyal kanıtı satın almak, kişiselleştirmeyi manipülasyona çevirmek her zamankinden kolay ve her zamankinden görünür. Sezar'ın sonunu hatırlayın: güveni kaybetmenin bedeli ağırdır.",
          en: "One warning: when psychological principles meet AI targeting, the power multiplies — and so does the responsibility. Faking scarcity, buying social proof, turning personalization into manipulation is easier than ever and more visible than ever. Remember how Caesar ended: losing trust carries a heavy price.",
        },
      },
      {
        type: "h2",
        id: "sonuc-eskimeyen-uclu",
        text: {
          tr: "Sonuç: eskimeyen üçlü",
          en: "Conclusion: the timeless trio",
        },
      },
      {
        type: "p",
        text: {
          tr: "Hikâye anlatımı, içgörü ve insan psikolojisi — Sezar'ın Roma'sından bugünün dijital pazarına, etkili pazarlamanın temeli hep aynı üçlü oldu. Araçlar değişti: forum yerine sosyal medya, danışman yerine veri paneli, senato yerine arama motoru. Değişmeyen tek şey insan. Kitlenizi tanıyın, onlara gerçek bir hikâye anlatın ve karar veren zihnin nasıl çalıştığını asla unutmayın.",
          en: "Storytelling, insight and human psychology — from Caesar's Rome to today's digital market, effective marketing has always rested on the same trio. The tools changed: social media instead of the forum, a data dashboard instead of an adviser, a search engine instead of the senate. The one thing that hasn't changed is the human. Know your audience, tell them a true story, and never forget how the deciding mind works.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Peki sizde en çok yankı uyandıran marka hikâyesi hangisi? Bir düşünün — cevabınız, kendi markanızın anlatması gereken hikâyeyi de söylüyor olabilir.",
          en: "So which brand story resonates with you the most? Think about it — your answer may be telling you the story your own brand should be telling.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Pazarlamada hikâye anlatımı neden bu kadar etkili?",
          en: "Why is storytelling so effective in marketing?",
        },
        answer: {
          tr: "Çünkü insan beyni gerçekleri değil, anlatıları hatırlar. Bilgi bombardımanı altındaki bir kitlede duygusal bağ kuran tek format hikâyedir: karakteri, çatışması ve çözümü olan bir anlatı, ürün özelliklerinin asla ulaşamayacağı bir hatırlanırlık ve sadakat üretir.",
          en: "Because the human brain remembers narratives, not facts. For an audience under information bombardment, story is the only format that builds emotional connection: a narrative with character, conflict and resolution produces recall and loyalty that product features can never reach.",
        },
      },
      {
        question: {
          tr: "Marka hikâyesi nasıl kurulur?",
          en: "How do you build a brand story?",
        },
        answer: {
          tr: "Üç adımda: kitlenizin acı noktalarını ve değerlerini tanıyın, hikâyeye bağ kurulabilir karakterler koyun (müşteri, çalışan veya markanın kendisi) ve bir anlatı yayı kurun — başlangıç, çatışma, çözüm. Hikâye markanın değil, müşterinin dönüşümünü anlatmalıdır.",
          en: "In three steps: know your audience's pain points and values, put relatable characters in the story (a customer, an employee or the brand itself) and build a narrative arc — beginning, conflict, resolution. The story should tell the customer's transformation, not the brand's.",
        },
      },
      {
        question: {
          tr: "Pazarlamada psikolojik ilkeleri kullanmak etik mi?",
          en: "Is using psychological principles in marketing ethical?",
        },
        answer: {
          tr: "İlkenin kendisi nötr; kullanım biçimi etik ya da değil. Gerçek bir stok azlığını duyurmak bilgilendirmedir, uydurma bir kıtlık sayacı manipülasyondur. Ölçüt şu: taktik, müşterinin daha iyi karar vermesine mi yardım ediyor, yoksa kararını çarpıtıyor mu? İlki güven kurar, ikincisi er ya da geç markayı yakar.",
          en: "The principle itself is neutral; the way it's used is ethical or not. Announcing a real stock shortage is information; a fabricated scarcity timer is manipulation. The test: does the tactic help the customer decide better, or does it distort their decision? The first builds trust; the second burns the brand sooner or later.",
        },
      },
      {
        question: {
          tr: "Bu ilkeler AI çağında hâlâ geçerli mi?",
          en: "Do these principles still hold in the AI age?",
        },
        answer: {
          tr: "Her zamankinden daha geçerli. Üretken AI içerik üretimini sınırsızlaştırdı; ayrışma artık iyi hikâyede ve gerçek içgörüde. Üstelik yeni bir dinleyici var: insanlar markaları dil modellerine soruyor ve bu motorlar hikâyesi net, hakkında tutarlı konuşulan markaları aktarıyor. İlkeler aynı, sahne büyüdü.",
          en: "More than ever. Generative AI made content production unlimited; differentiation now lives in the good story and the real insight. And there's a new listener: people ask language models about brands, and those engines relay the brands with clear stories that are spoken about consistently. Same principles, bigger stage.",
        },
      },
    ],
    category: "growth",
    tags: ["hikaye-anlatimi", "pazarlama-psikolojisi", "marka-yonetimi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-07-30",
    readingMinutes: 5,
  },

  {
    // Eski blogdan taşındı (2024-08-01). Orijinaldeki "BONUS" bölümü taslak
    // talimatı formatındaydı ("...gösterin, ...vurgulayın") — düzyazıya
    // çevrildi; sondaki "yorumlarda paylaşın" çağrısı kaldırıldı (yeni
    // sitede yorum yok). TR slug eski URL ile aynı.
    slug: {
      tr: "isa-ilk-pazarlama-marka-muhendisi",
      en: "the-first-brand-engineer",
    },
    title: {
      tr: "İsa Peygamber: ilk pazarlama ve marka mühendisi",
      en: "The first brand engineer: lessons from Jesus of Nazareth",
    },
    excerpt: {
      tr: "İnternet yok, sosyal medya yok, posta sistemi bile yok — ama mesaj iki bin yıldır yayılıyor. Net vizyon, topluluk, meseller ve ağlar üzerine eskimeyen bir marka dersi.",
      en: "No internet, no social media, not even a reliable postal system — yet the message has spread for two thousand years. A timeless brand lesson on vision, community, parables and networks.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 1 Ağustos 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: bonus bölümü metne işlendi; kampanya listesine 2020'lerden Barbie ve Spotify Wrapped eklendi; \"Gutenberg'den dil modellerine\" notu ve sık sorulan sorular eklendi.",
      en: "First published on 1 August 2024. Revised on 23 August 2026: the bonus section was woven into the text; Barbie and Spotify Wrapped joined the campaign list from the 2020s; the \"From Gutenberg to language models\" note and the FAQ were added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Antik Kudüs yakınlarındaki küçük bir köyden gelen bir marangozun oğlunun, insanlık tarihinin en etkili figürlerinden biri haline nasıl geldiğini hiç merak ettiniz mi? İnternetin, sosyal medyanın ve hatta güvenilir bir posta sisteminin bile olmadığı bir sahneyi gözünüzde canlandırın. Yine de Nasıralı İsa, mesajını her yere yaymayı başardı ve insanlık üzerinde silinmez bir iz bıraktı.",
          en: "Have you ever wondered how a carpenter's son from a small village near ancient Jerusalem became one of the most influential figures in human history? Picture a world with no internet, no social media, not even a reliable postal system. And yet Jesus of Nazareth managed to spread his message everywhere and left an indelible mark on humanity.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıda, bu yöntemlerin modern pazarlama ilkeleriyle nasıl örtüştüğünü ve dünya çapında sevilen bir marka kurmak için bu eskimeyen stratejilerin nasıl uygulanabileceğini inceliyoruz.",
          en: "In this piece we examine how those methods map onto modern marketing principles, and how these timeless strategies can be applied to build a brand loved worldwide.",
        },
      },
      {
        type: "h2",
        id: "mutevazi-baslangiclar-net-vizyon",
        text: {
          tr: "Mütevazı başlangıçlar, net vizyon",
          en: "Humble beginnings, clear vision",
        },
      },
      {
        type: "p",
        text: {
          tr: "Küçük, sıradan bir köyde, elinizde hiçbir kaynak olmadan doğduğunuzu — ama sarsılmaz bir vizyona sahip olduğunuzu hayal edin. İsa Peygamber'in net bir misyonu vardı: sevgi, şefkat ve kurtuluş mesajını yaymak. Bu vizyon netliği onun yol gösterici ışığı oldu; odaklanmasını ve tutarlı kalmasını sağladı.",
          en: "Imagine being born in a small, ordinary village with no resources at hand — but with an unshakable vision. Jesus had a clear mission: to spread a message of love, compassion and salvation. That clarity of vision became his guiding light, keeping him focused and consistent.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pazarlamada bu tür bir netlik hayati önem taşır. Bir garajda başlayan ama teknolojiyi erişilebilir kılma vizyonuna sahip Apple'ı düşünün. Ya da dünyanın en müşteri odaklı şirketi olma vizyonuyla çevrimiçi bir kitapçı olarak yola çıkan Amazon'u. Bu markalar da hedef kitleleriyle samimi bağlar kurmak için mütevazı başlangıçlarından faydalandı.",
          en: "In marketing, that kind of clarity is vital. Think of Apple, started in a garage with a vision of making technology accessible. Or Amazon, launched as an online bookstore with the vision of becoming the world's most customer-centric company. These brands, too, drew on their humble beginnings to build sincere bonds with their audiences.",
        },
      },
      {
        type: "h2",
        id: "topluluk-olusturmak",
        text: {
          tr: "İlişki kurmak, topluluk oluşturmak",
          en: "Building relationships, building community",
        },
      },
      {
        type: "p",
        text: {
          tr: "Amaç yalnızca bir mesaj yaymak değildi; bir topluluk kurmaktı. Öğrencileri takipçiden fazlasıydı: arkadaştı, sırdaştı, elçiydi. Bu derin ve kişisel bağ, marka inşasının iki temel unsurunu besledi — sadakat ve güven.",
          en: "The goal was never just to spread a message; it was to build a community. The disciples were more than followers: they were friends, confidants, envoys. That deep, personal bond fed the two core elements of brand building — loyalty and trust.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Harley-Davidson'ı düşünün: bir Harley'e sahip olmak motosiklete sahip olmaktan fazlasıdır, bir kabileye ait olmaktır. Lego, nesillere yayılan bir inşacı ve meraklı topluluğu yarattı. Bu markalar topluluğun ve kişisel bağın gücünü anlıyor.",
          en: "Think of Harley-Davidson: owning a Harley is more than owning a motorcycle, it's belonging to a tribe. Lego created a community of builders and enthusiasts spanning generations. These brands understand the power of community and personal connection.",
        },
      },
      {
        type: "h2",
        id: "hikayelerin-gucu-meseller",
        text: {
          tr: "Hikâyelerin gücü: meseller",
          en: "The power of stories: parables",
        },
      },
      {
        type: "p",
        text: {
          tr: "İsa Peygamber usta bir hikâye anlatıcısıydı. Basit ve bağ kurulabilir hikâyeler olan meseller, karmaşık fikirleri anlaşılır kılıyordu. Akılda kalıcı ve paylaşımı kolay olan bu hikâyeler, mesajın her yere yayılmasına yardımcı oldu. Bugün de değişen bir şey yok: hikâye anlatımı, markaların kitleleriyle duygusal bağ kurmasını sağlayan en güçlü araç.",
          en: "Jesus was a master storyteller. Parables — simple, relatable stories — made complex ideas understandable. Memorable and easy to share, they helped the message travel everywhere. Nothing has changed today: storytelling remains the most powerful tool brands have for building emotional bonds with their audiences.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Akılda kalıcı dokuz kampanya",
          en: "Nine unforgettable campaigns",
        },
      },
      {
        type: "p",
        text: {
          tr: "Mesel gücünde iş çıkaran kampanyalara bakalım — her biri, iyi anlatılmış bir hikâyenin medya bütçesinden daha uzağa taşıdığının kanıtı.",
          en: "Let's look at campaigns that worked with the force of a parable — each one proof that a well-told story travels farther than a media budget.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Blair Cadısı Projesi (1999): film karakterlerini gerçekten kaybolmuş insanlar gibi gösteren \"kanıt\" dolu bir site, kurmaca ile gerçeğin çizgisini bulanıklaştırdı. 60.000 dolarlık film, dünya çapında yaklaşık 250 milyon dolar hasılat yaptı.",
            en: "The Blair Witch Project (1999): a website full of \"evidence\" presenting the film's characters as genuinely missing people blurred the line between fiction and reality. A $60,000 film grossed roughly $250 million worldwide.",
          },
          {
            tr: "IKEA \"Hayatın Yaşandığı Yer\" (Norveç): gerçek ailelerin gerçek yaşam durumlarını belgesel tarzında anlatan reklamlar, IKEA'yı günlük hayatı anlayan marka olarak konumlandırdı.",
            en: "IKEA \"Where Life Happens\" (Norway): documentary-style ads following real families through real life situations positioned IKEA as the brand that understands everyday life.",
          },
          {
            tr: "Old Spice \"Erkeğinizin Kokabileceği Adam\" (2010): mizah, gerçeküstücülük ve doğrudan hitap, modası geçmiş bir markayı viral bir fenomene ve çağdaş bir seçeneğe dönüştürdü.",
            en: "Old Spice \"The Man Your Man Could Smell Like\" (2010): humor, surrealism and direct address turned a dated brand into a viral phenomenon and a contemporary choice.",
          },
          {
            tr: "Dove \"Gerçek Güzellik\" (2004): modeller yerine gerçek kadınlar. Kampanya güzellik standartları hakkında küresel bir tartışma başlattı ve satışlarla birlikte marka sadakatini kalıcı olarak yükseltti.",
            en: "Dove \"Real Beauty\" (2004): real women instead of models. The campaign started a global conversation about beauty standards and lifted sales and brand loyalty for good.",
          },
          {
            tr: "Red Bull Stratos (2012): Felix Baumgartner'ın stratosferden atlayışı — canlı yayında milyonlar izledi; marka, ekstrem sporla bağını bir dünya rekoruyla mühürledi.",
            en: "Red Bull Stratos (2012): Felix Baumgartner's jump from the stratosphere — watched live by millions, sealing the brand's bond with extreme sports through a world record.",
          },
          {
            tr: "Always #KızGibi (2014): \"kız gibi\" ifadesinin olumsuz çağrışımını tersine çeviren kampanya milyonlarca izlenme aldı, ödülleri topladı ve cinsiyet kalıpları hakkında küresel bir konuşma açtı.",
            en: "Always #LikeAGirl (2014): reversing the negative connotation of \"like a girl\", the campaign drew millions of views, swept awards and opened a global conversation on gender stereotypes.",
          },
          {
            tr: "Airbnb \"Kabul Ediyoruz\" (2017): Super Bowl'da yayınlanan kapsayıcılık mesajı, markayı değerleriyle hizaladı ve genç, bilinçli tüketicilerde kalıcı sadakat kurdu.",
            en: "Airbnb \"We Accept\" (2017): an inclusion message aired during the Super Bowl aligned the brand with its values and built lasting loyalty among young, conscious consumers.",
          },
          {
            tr: "Barbie (2023): Mattel ve Warner Bros. filmi bir kültürel olaya çevirdi — pembe dalga, yüzü aşkın marka işbirliği, Airbnb'de kiralanabilir Malibu Rüya Evi ve kendiliğinden doğan \"Barbenheimer\" mizahı. Film 1,4 milyar doları aşan hasılatla yılın en büyük gişesi oldu; 64 yaşındaki marka yeniden kültürün merkezine oturdu.",
            en: "Barbie (2023): Mattel and Warner Bros. turned the film into a cultural event — a pink wave, over a hundred brand collaborations, a bookable Malibu DreamHouse on Airbnb and the self-born \"Barbenheimer\" meme. The film topped $1.4 billion as the year's biggest box office, putting a 64-year-old brand back at the center of culture.",
          },
          {
            tr: "Spotify Wrapped (her aralık): kullanıcının kendi yıllık dinleme verisini paylaşılabilir bir hikâyeye çeviren kampanya, her yıl sosyal medyayı tek başına domine ediyor. Mesel gücü kişiselleştirmede: herkes kendi hikâyesinin kahramanı olduğu için milyonlarca kişi markanın reklamını gönüllü yapıyor.",
            en: "Spotify Wrapped (every December): by turning each user's own listening data into a shareable story, the campaign single-handedly dominates social media every year. Its parable power lies in personalization: everyone is the hero of their own story, so millions volunteer to advertise the brand.",
          },
        ],
      },
      {
        type: "h2",
        id: "aglardan-faydalanmak",
        text: {
          tr: "Mevcut ağlardan faydalanmak",
          en: "Leveraging existing networks",
        },
      },
      {
        type: "p",
        text: {
          tr: "Mesaj yalnız yayılmadı. Sinagoglar, meydanlar, festivaller — insanlara bulundukları yerde ulaşıldı; öğretinin yayılmasını zamanın kanaat önderleri, havariler taşıdı. Bugünün karşılığını biliyorsunuz: markalar değerleriyle örtüşen influencer'larla çalışarak var olan ağlardan güvenilirlik ödünç alıyor. Glossier, sadık bir müşteri tabanını tam olarak bu yolla kurdu.",
          en: "The message didn't spread on its own. Synagogues, squares, festivals — people were reached where they already were, and the era's opinion leaders, the apostles, carried the teaching outward. You know today's equivalent: brands borrow credibility from existing networks by working with influencers who match their values. Glossier built its loyal customer base exactly this way.",
        },
      },
      {
        type: "h2",
        id: "uyarlanabilirlik-ve-dayaniklilik",
        text: {
          tr: "Uyarlanabilirlik ve dayanıklılık",
          en: "Adaptability and resilience",
        },
      },
      {
        type: "p",
        text: {
          tr: "Çiftçiyle, balıkçıyla ve din bilginiyle aynı dilde konuşulmadı; yaklaşım her grupta yankı uyandıracak şekilde uyarlandı. Mesajın güncel ve erişilebilir kalmasının sırrı buydu. Modern markalar için ders aynı: donanımcı IBM yazılım ve danışmanlığa, DVD kiralayan Netflix yayıncılığa geçti. Uyum sağlayamayan mesaj, ne kadar doğru olursa olsun, kaybolur.",
          en: "Farmers, fishermen and scholars were not spoken to in the same language; the approach was adapted to resonate with each group. That was the secret of the message staying current and accessible. The lesson for modern brands is the same: IBM the hardware maker moved to software and consulting, Netflix the DVD renter moved to streaming. A message that can't adapt gets lost, no matter how true it is.",
        },
      },
      {
        type: "h2",
        id: "kadim-dunyadan-dort-paralel",
        text: {
          tr: "Kadim dünyadan dört paralel",
          en: "Four parallels from the ancient world",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aristoteles iknayı üçe ayırmıştı: ethos (güvenilirlik), pathos (duygu), logos (mantık). Meseller üçünü aynı anda taşır — anlatıcının yaşamıyla tutarlılığı ethos'u, hikâyenin insani çekirdeği pathos'u, çıkarılacak ders logos'u kurar. Mesajın coğrafi yayılımını ise Roma İmparatorluğu'nun yol ağı taşıdı: havariler o yollarda yürüdü. Bugünün yol ağı internettir; yarınki bölümünü birazdan konuşacağız.",
          en: "Aristotle split persuasion in three: ethos (credibility), pathos (emotion), logos (logic). Parables carry all three at once — the teller's consistency with his own life builds ethos, the story's human core builds pathos, the lesson builds logos. The geographic spread of the message, meanwhile, ran on the Roman Empire's road network: the apostles walked those roads. Today's road network is the internet; we'll get to tomorrow's in a moment.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İki paralel daha: Gutenberg'in matbaası, mesajın ölçeklenmesindeki ilk büyük teknoloji sıçramasıydı — el yazması çağında yüzlerle sınırlı erişim, bir anda yüz binlere çıktı. Ve iki kadim felsefe, iki marka ilkesini özetler: Japonların İkigai'si net vizyonun (varoluş nedeninin), Afrika'nın Ubuntu'su topluluğun ve birbirine bağlılığın önemini anlatır. Kadim dünya, marka mühendisliğinin ders kitabını çoktan yazmış.",
          en: "Two more parallels: Gutenberg's press was the first great technology leap in scaling a message — reach limited to hundreds in the manuscript age jumped to hundreds of thousands overnight. And two ancient philosophies summarize two brand principles: the Japanese concept of Ikigai speaks to clear vision (a reason for being), and Africa's Ubuntu to community and interconnection. The ancient world wrote the textbook of brand engineering long ago.",
        },
      },
      {
        type: "h2",
        id: "gutenbergden-dil-modellerine",
        text: {
          tr: "2026 notu: Gutenberg'den dil modellerine",
          en: "2026 note: from Gutenberg to language models",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıyı 2024'te yayımladık. Geçen iki yılda, mesaj yayılımının üçüncü büyük sıçraması netleşti: matbaa çoğaltmayı, internet dağıtımı, üretken AI ise anlatımı ölçekledi. Mesajınız artık yalnızca insanlar arasında değil, motorlar arasında da dolaşıyor — insanlar markaları ChatGPT'ye, Gemini'ye, Perplexity'ye soruyor ve bu motorlar hikâyesi net, hakkında tutarlı konuşulan markaları anlatıyor.",
          en: "We published this piece in 2024. In the two years since, the third great leap in message propagation has come into focus: the press scaled reproduction, the internet scaled distribution, and generative AI scales narration. Your message now travels not only between people but between engines — people ask ChatGPT, Gemini and Perplexity about brands, and those engines retell the brands whose stories are clear and consistently spoken of.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İki bin yıl dayanan mesajın sırrı format değil, özdü: net vizyon, gerçek topluluk, iyi hikâye. Bu üçlüsü sağlam olan marka, kanal her değiştiğinde — yol, matbaa, internet, dil modeli — yeniden yayılır. Kalıcılık, anlatılmaya değer olmaktır.",
          en: "The secret of a message that lasted two thousand years was never the format but the substance: clear vision, real community, good story. A brand solid on those three spreads again every time the channel changes — road, press, internet, language model. Endurance is being worth retelling.",
        },
      },
      {
        type: "h2",
        id: "sonuc-iki-bin-yillik-ders",
        text: {
          tr: "Sonuç: iki bin yıllık ders",
          en: "Conclusion: a two-thousand-year lesson",
        },
      },
      {
        type: "p",
        text: {
          tr: "Net bir vizyona sahip olmak, derin ilişkiler kurmak, hikâye anlatımını kullanmak, ağlardan faydalanmak ve uyarlanabilir kalmak — bu beş strateji, modern pazarlamacıya eskimeyen dersler sunuyor. Bu ilkeleri markanıza uygulayarak, küresel yankı uyandıran ve zamanın testinden geçen bir mesaj yaratabilirsiniz.",
          en: "Holding a clear vision, building deep relationships, using storytelling, leveraging networks and staying adaptable — these five strategies offer the modern marketer timeless lessons. Apply these principles to your brand and you can create a message that resonates globally and stands the test of time.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ve merak ediyoruz: vizyonunuz ne kadar net? Müşterilerinizle bağlarınız ne kadar derin? Hikâye anlatımını gerçekten kullanıyor musunuz? Bu üç sorunun cevabı, markanızın önümüzdeki on yılını belirleyecek.",
          en: "And we're curious: how clear is your vision? How deep are your bonds with your customers? Are you truly using storytelling? The answers to those three questions will shape your brand's next decade.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Viral kampanyaların ortak özellikleri nelerdir?",
          en: "What do viral campaigns have in common?",
        },
        answer: {
          tr: "Blair Witch'ten Barbie'ye, incelediğimiz dokuz kampanyanın ortak paydası üç şey: gerçeklik hissi (belgesel dili, gerçek insanlar, gerçek veri, canlı olay), paylaşmayı tetikleyen bir duygu (merak, mizah, gurur, aidiyet) ve markanın değerleriyle tutarlılık. Bütçe listede yok — Blair Witch 60.000 dolarla yaklaşık 250 milyon dolarlık sonuç aldı; Spotify Wrapped'in medyası ise kullanıcının kendisi.",
          en: "From Blair Witch to Barbie, the nine campaigns we examined share three things: a sense of reality (documentary language, real people, real data, live events), an emotion that triggers sharing (curiosity, humor, pride, belonging) and consistency with the brand's values. Budget isn't on the list — Blair Witch turned $60,000 into roughly $250 million, and Spotify Wrapped's media channel is the user themselves.",
        },
      },
      {
        question: {
          tr: "Marka vizyonu neden bu kadar önemli?",
          en: "Why does brand vision matter so much?",
        },
        answer: {
          tr: "Çünkü vizyon, her kararın filtresi olarak çalışır: hangi ürün, hangi kanal, hangi ton. Net vizyonu olan marka tutarlı kalır; tutarlılık zamanla güvene, güven sadakate dönüşür. Vizyonu bulanık marka ise her trende savrulur ve kitlesi onu tarif edemez hale gelir.",
          en: "Because vision works as the filter for every decision: which product, which channel, which tone. A brand with a clear vision stays consistent; consistency becomes trust over time, and trust becomes loyalty. A brand with a blurry vision drifts with every trend until its audience can no longer describe it.",
        },
      },
      {
        question: {
          tr: "Küçük bir marka topluluk nasıl kurar?",
          en: "How does a small brand build a community?",
        },
        answer: {
          tr: "Takipçi saymayı bırakıp ilişki kurarak. İlk yüz müşterinizle birebir konuşun, onları kararlarınıza ortak edin, katkılarını görünür kılın. Harley'nin kabilesi de Lego'nun inşacıları da böyle başladı: topluluk, kitleye yayın yapmakla değil, az sayıda insana derinden bağlanmakla kurulur.",
          en: "By dropping follower counts and building relationships. Talk one-on-one with your first hundred customers, involve them in your decisions, make their contributions visible. Harley's tribe and Lego's builders both started this way: community is built by bonding deeply with a few people, not by broadcasting to a crowd.",
        },
      },
      {
        question: {
          tr: "Influencer pazarlaması gerçekten işe yarıyor mu?",
          en: "Does influencer marketing actually work?",
        },
        answer: {
          tr: "Doğru kurulduğunda evet — çünkü mekanizma iki bin yıldır aynı: mesaj, güvenilen seslerin taşıdığı mevcut ağlarda yayılır. Kritik koşul değer uyumudur; kitlesi ne kadar küçük olursa olsun markanın değerleriyle örtüşen bir ses, uyumsuz bir mega-influencer'dan daha fazla güven taşır.",
          en: "When set up right, yes — because the mechanism has been the same for two thousand years: messages spread through existing networks carried by trusted voices. The critical condition is value alignment; a voice that matches the brand's values, however small its audience, carries more trust than a mismatched mega-influencer.",
        },
      },
    ],
    category: "growth",
    tags: ["hikaye-anlatimi", "markalasma", "viral-pazarlama"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-08-01",
    readingMinutes: 6,
  },

  {
    // Eski blogdan taşındı (2024-08-06). Başlık Burak'ın onayıyla anekdot
    // merkezli yeniden kuruldu; 2024'te anonim verilen örnekler artık sitede
    // yayımlanmış gerçek vakalara bağlanıyor. Sondaki kırık "buraya tıklayın"
    // CTA'ları kaldırıldı. TR slug eski URL ile aynı.
    slug: {
      tr: "gercek-e-ticaret-ajansinin-etkisi",
      en: "what-a-real-ecommerce-agency-changes",
    },
    title: {
      tr: "Sabah 05.00 satış bildirimleri: gerçek bir e-ticaret ajansı ne değiştirir?",
      en: "Sales notifications at 5 a.m.: what does a real e-commerce agency change?",
    },
    excerpt: {
      tr: "Telefonu sessize almadan yattığınız ve satış bildirimleriyle uyandığınız bir sabah. Bu sahneyi yaşadım — sıfırdan üç ay sürdü. Bu yazı, o üç ayda nelerin doğru yapıldığının rehberi.",
      en: "A morning where you go to bed without silencing your phone and wake to sales notifications. I lived that scene — it took three months from zero. This is the guide to what was done right in those three months.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 6 Ağustos 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlık yenilendi, o gün anonim anlattığımız örnekler bugün sitede yayımlanan gerçek vakalarımıza bağlandı, platform listesi ve sık sorulan sorular güncellendi.",
      en: "First published on 6 August 2024. Revised on 23 August 2026: the title was renewed, the examples we once told anonymously are now linked to the real case studies published on this site, and the platform list and FAQ were updated.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Geceleri telefonunuzu sessize almadan yatağa girdiğinizi hayal edin. Sabah 05.00 sularında, e-ticaret mağazanızdan gelen satış bildirimleriyle uyanıyorsunuz. Ve eşiniz, yarı uykulu, şunu söylüyor: \"Hayatım, sanırım zengin oluyoruz… Yarın yeni bir ev veya araba mı baksak? Yoksa güzel bir tatil mi planlasak?\"",
          en: "Imagine going to bed without silencing your phone. Around 5 a.m. you wake to sales notifications coming in from your e-commerce store. And your partner, half asleep, says: \"Honey, I think we're getting rich… Should we look at a new house or a car tomorrow? Or plan a nice holiday?\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Evet, bu sahneyi ben yaşadım. Ve sıfırdan bu noktaya gelmek yalnızca üç ayımı aldı. O üç ayın rakamlı hikâyesini bugün sitede açıkça anlatıyoruz: [FYR vakası — 12 aylık hedef, 3 ayda 100.000 dolar](/vakalar/fyr-luks-dekorasyon-lansmani).",
          en: "Yes, I lived that scene. And getting there from zero took me only three months. The numbers behind those three months are now told openly on this site: [the FYR case — a 12-month target hit in 3 months, $100K](/vakalar/fyr-luks-dekorasyon-lansmani).",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dijital dünya geliştikçe bu rüya, e-ticarete girmek isteyen herkes için ulaşılabilir hale geliyor. Ama dürüst olalım: çevrimiçi milyonlara giden yol, bir web sitesi kurup en iyisini ummaktan ibaret değil. Stratejik planlama, uzman rehberliği ve dijital pazarın derinlemesine anlaşılması gerekiyor. İşte tam bu noktada gerçek bir e-ticaret ajansı devreye giriyor.",
          en: "As the digital world matures, this dream becomes reachable for anyone entering e-commerce. But let's be honest: the road to online millions is not building a website and hoping for the best. It takes strategic planning, expert guidance and a deep understanding of the digital market. That is exactly where a real e-commerce agency comes in.",
        },
      },
      {
        type: "h2",
        id: "e-ticaret-dunyasini-anlamak",
        text: {
          tr: "E-ticaret dünyasını anlamak",
          en: "Understanding the e-commerce world",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticaret son on yılda katlanarak büyüdü — buna büyük patlama diyelim. Ve bugünlerde büyüme doğrusal değil, parabolik. Bir zamanlar küçük bir çevrimiçi kitapçı olan Amazon, bugün e-ticaret dünyasını yönetiyor. Bu sıçramayı mümkün kılan şey, pazar eğilimlerinin ve tüketici davranışının doğru okunmasıydı.",
          en: "E-commerce has grown exponentially over the past decade — call it the big bang. And these days the growth is not linear but parabolic. Amazon, once a small online bookstore, now runs the e-commerce world. What made that leap possible was reading market trends and consumer behavior correctly.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Tıpkı bir denizcinin beklenmedik bir yolculuğa hazırlanmak için denizi sürekli incelemesi gibi, başarılı bir e-ticaret macerası da derinlemesine pazar araştırmasıyla başlar: rakipleri analiz etmek, tüketici ihtiyacını anlamak, içgörü toplamak ve trendlerle güncel kalmak.",
          en: "Just as a sailor studies the sea constantly to be ready for an unexpected voyage, a successful e-commerce venture starts with deep market research: analyzing competitors, understanding consumer needs, gathering insight and staying current with trends.",
        },
      },
      {
        type: "h2",
        id: "ajansin-etkisi",
        text: {
          tr: "Bir e-ticaret ajansının etkisi",
          en: "The impact of an e-commerce agency",
        },
      },
      {
        type: "p",
        text: {
          tr: "Peki bir e-ticaret danışmanlığı tam olarak nedir ve neden çoğu durumda başarının kilit faktörüdür? Farklı markaların ve sektörlerin birbirine referans olamayacağını düşünebilirsiniz. Ama konu e-ticaret olduğunda, bir gerçek her sektörde aynıdır:",
          en: "So what exactly is an e-commerce consultancy, and why is it the key success factor in most cases? You might think different brands and industries can't serve as references for one another. But when it comes to e-commerce, one truth holds in every industry:",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Müşteriye ulaşmak ile o müşteriden para kazanmak arasındaki tüm süreçler, sektörden bağımsız olarak aynıdır.",
          en: "Every process between reaching a customer and earning from that customer is the same, regardless of industry.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yüzden gerçek bir ajans, her projeden edindiği stratejiyi ve tecrübeyi bir sonrakine aktarır. 2024'te bu yazıda \"çevrimiçi tutunmaya çalışan küçük bir moda markası\" diye anonim bir örnek vermiştik. Bugün adını verebiliyoruz: [GYMWOLVES, üç ayda satışını 12 katına çıkardı](/vakalar/gymwolves-12-kat-satis) — veri akışı onarıldı, huni yeniden kuruldu, kampanya sosyal kanıtla beslendi. Doğru danışmanlık, masaya en değerli şeyi getirir: uzmanlığı ve içgörüyü. Afiyet olsun!",
          en: "That's why a real agency carries the strategy and experience gained in each project into the next. In 2024 this article used an anonymous example — \"a small fashion brand struggling to hold on online\". Today we can name it: [GYMWOLVES grew its sales 12× in three months](/vakalar/gymwolves-12-kat-satis) — the data flow was repaired, the funnel rebuilt, the campaign fed with social proof. The right consultancy brings the most valuable thing to the table: expertise and insight. Bon appétit!",
        },
      },
      {
        type: "h2",
        id: "teknoloji-ve-altyapi",
        text: {
          tr: "Teknoloji ve yazılım altyapısı",
          en: "Technology and software infrastructure",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticaret platformunuzu bir gökdelenin temeli olarak düşünün: büyümeyi taşıyacak kadar güçlü, esnek ve ölçeklenebilir olmalı. Sunucu, yazılım, eklenti ve özel geliştirme seçimleri çevrimiçi işinizi vezir de eder, rezil de. Deneyimli bir ajans, hedeflerinize göre doğru platformu seçmenize yardım eder — Shopify, İKAS, WooCommerce, Magento veya özel bir çözüm.",
          en: "Think of your e-commerce platform as the foundation of a skyscraper: it must be strong, flexible and scalable enough to carry growth. The choice of server, software, plugins and custom development can make or break your online business. An experienced agency helps you choose the right platform for your goals — Shopify, İKAS, WooCommerce, Magento or a custom build.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Sunucu: güvenilir barındırma (AWS, Google Cloud veya özel sunucu), sitenizin yüksek trafiği sorunsuz kaldırmasını sağlar.",
            en: "Servers: reliable hosting (AWS, Google Cloud or dedicated servers) keeps your site smooth under heavy traffic.",
          },
          {
            tr: "Platform: iş hedefinize uygun e-ticaret altyapısı ve içerik yönetimi — özellik seti kadar ölçeklenme yolu da kıyaslanmalı.",
            en: "Platform: e-commerce infrastructure and content management matched to your goals — compare the scaling path, not just the feature set.",
          },
          {
            tr: "Eklenti ve araçlar: SEO, analitik, ödeme ve müşteri desteği entegrasyonları; doğru kurulan bir canlı destek bile dönüşümü ölçülebilir artırır.",
            en: "Plugins and tools: SEO, analytics, payment and support integrations; even a well-set-up live chat measurably lifts conversion.",
          },
          {
            tr: "Özel geliştirme: kişiselleştirilmiş öneri, dinamik fiyatlama, otomatik pazarlama akışları — rekabet avantajının kodla kurulan kısmı.",
            en: "Custom development: personalized recommendations, dynamic pricing, automated marketing flows — the part of your competitive edge built in code.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Altyapının sınırı zorlandığında ne olacağını da gördük: Almanya'daki müşterimiz [MKComputer için 200.000 ürünü 5 dakikada senkronlayan](/vakalar/mkcomputer-dropshipping-otomasyonu) bir dropshipping platformu kurduk — sipariş yönlendirme dahil, insan müdahalesi olmadan. Doğru temel atılınca ölçek bir korku değil, plan olur.",
          en: "We've also seen what happens when infrastructure is pushed to its limit: for our German client [MKComputer we built a dropshipping platform syncing 200,000 products every 5 minutes](/vakalar/mkcomputer-dropshipping-otomasyonu) — order routing included, no human touch. With the right foundation, scale is a plan, not a fear.",
        },
      },
      {
        type: "h2",
        id: "dijital-pazarlama-plani",
        text: {
          tr: "Dijital pazarlama planı: senfoni",
          en: "The digital marketing plan: a symphony",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sağlam bir dijital pazarlama planı; SEO, içerik, sosyal medya, e-posta ve reklam kampanyalarını kapsar. Bunu iyi yönetilen bir senfoni gibi düşünün: her enstrüman uyum içinde çalmalı. Ajans, orkestra şefidir — her unsurun birlikte çalışmasını sağlar. \"Bir ev dekorasyon markası\" örneği vermiştik 2024'te; bugün biliyorsunuz: [o marka FYR'dı](/vakalar/fyr-luks-dekorasyon-lansmani) ve reklam getirisi 20 katın üzerinde seyretti.",
          en: "A solid digital marketing plan covers SEO, content, social media, email and ad campaigns. Think of it as a well-conducted symphony: every instrument must play in harmony. The agency is the conductor, keeping every element working together. In 2024 we cited \"a home decor brand\"; now you know: [that brand was FYR](/vakalar/fyr-luks-dekorasyon-lansmani), with return on ad spend holding above 20×.",
        },
      },
      {
        type: "h2",
        id: "mevcut-kurulumu-denetlemek",
        text: {
          tr: "Mevcut kurulumu denetlemek",
          en: "Auditing your current setup",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yeni stratejilere girişmeden önce elinizdekini değerlendirin: kullanıcı deneyimi, site hızı, mobil uyum, güvenlik — ve en önemlisi ölçüm. Bir bahçıvanın bahçesine bakması gibi: toprağın sağlığını bilmeden ekim planı yapılmaz. [SOYLU AVM vakamız](/vakalar/soylu-avm-e-ticaret-buyume) bunun kanıtı: kampanyadan önce piksel ve dönüşüm izleme sıfırdan kuruldu; 6 günde 1,5 milyon dolarlık sonucu mümkün kılan şey önce ölçümün onarılmasıydı.",
          en: "Before diving into new strategies, assess what you have: user experience, site speed, mobile fit, security — and above all, measurement. Like a gardener tending a garden: you don't plan the planting without knowing the soil. [Our SOYLU AVM case](/vakalar/soylu-avm-e-ticaret-buyume) is the proof: pixels and conversion tracking were rebuilt from scratch before the campaign; what made the $1.5M-in-6-days result possible was fixing measurement first.",
        },
      },
      {
        type: "h2",
        id: "yaraticilik-kitle-marka",
        text: {
          tr: "Yaratıcılık, kitle ve marka kimliği",
          en: "Creativity, audience and brand identity",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kalabalık e-ticaret dünyasında yaratıcılık rekabet avantajınızdır — gösterişli tasarım değil, kitlenizde yankı uyandıran deneyim. Kullanıcı içeriği ve hikâye anlatımıyla topluluk kuran cilt bakım markaları, influencer'la fitness topluluğuna ulaşan gıda markaları… Aynı mantığın bizdeki karşılığı [Feruza Elegance](/vakalar/feruza-luks-perakende-anlasmasi): klasik çizgiden modern-lüks kimliğe taşınan marka, Türkiye'nin tanınmış butik perakende zincirlerinden birinin raflarına girdi. Markanızı bir hikâye kitabı gibi düşünün — her temas noktası aynı anlatıyı sürdürmeli.",
          en: "In the crowded e-commerce world creativity is your competitive edge — not flashy design, but experiences that resonate with your audience. Skincare brands building community with user content and storytelling, food brands reaching the fitness crowd through influencers… Our own version of that logic is [Feruza Elegance](/vakalar/feruza-luks-perakende-anlasmasi): repositioned from a classic line to a modern-luxury identity, the brand reached the shelves of one of Türkiye's best-known boutique retail chains. Think of your brand as a storybook — every touchpoint must continue the same narrative.",
        },
      },
      {
        type: "h2",
        id: "geliri-ve-gorunurlugu-buyutmek",
        text: {
          tr: "Geliri ve görünürlüğü büyütmek",
          en: "Growing revenue and visibility",
        },
      },
      {
        type: "p",
        text: {
          tr: "Gelir tarafında iş, iyi yağlanmış bir makinedir: ürün sayfasından ödemeye her parça sorunsuz çalışmalı. Dönüşüm oranı optimizasyonu, üst satış ve çapraz satış bu makinenin dişlileridir. [OdorGo vakamızda](/vakalar/odorgo-kategori-yaratma) siteyi tam bu mantıkla kurduk: ziyaretçi hangi kanaldan hangi sayfaya girerse girsin, ikna edici bilgiyi alıp doğrudan satış adımına iner. Görünürlük tarafında ise SEO ve reklam, fırtınalı denizdeki deniz feneriniz — gemileri kıyıya o ışık çağırır.",
          en: "On the revenue side the business is a well-oiled machine: every part from product page to checkout must run smoothly. Conversion rate optimization, upselling and cross-selling are the gears. In [our OdorGo case](/vakalar/odorgo-kategori-yaratma) we built the site on exactly this logic: whichever channel and page a visitor lands on, they get the convincing information and descend straight to the purchase step. On the visibility side, SEO and ads are your lighthouse in a stormy sea — that light is what calls the ships to shore.",
        },
      },
      {
        type: "h2",
        id: "dogru-danismanligi-secmek",
        text: {
          tr: "Doğru danışmanlığı seçmek",
          en: "Choosing the right consultancy",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir e-ticaret danışmanı seçmek, kişisel bir koç tutmak gibidir: sizi hedefe taşıyacak bilgiye, deneyime ve özveriye sahip biri gerekir. Karar vermeden önce şu üçünü mutlaka isteyin: geçmiş işlerin rakamlı kanıtı, benzer ölçekte müşteri referansı ve size özel bir yol haritası taslağı. \"Her şeyi yaparız\" diyen ajanstan değil, neyi yapmayacağını da söyleyen ajanstan güven duyun.",
          en: "Choosing an e-commerce consultant is like hiring a personal coach: you need someone with the knowledge, experience and dedication to carry you to the goal. Before deciding, always ask for three things: numbered proof of past work, references from clients at a similar scale, and a draft roadmap specific to you. Trust the agency that tells you what it won't do — not the one that claims to do everything.",
        },
      },
      {
        type: "h2",
        id: "sonuc-ruyanin-muhendisligi",
        text: {
          tr: "Sonuç: rüyanın mühendisliği",
          en: "Conclusion: engineering the dream",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticarette başarı bir varış noktası değil, sürekli büyüme ve yenilenme sürecidir. Pazarı anlayarak, doğru uzmanlıktan yararlanarak ve stratejik optimizasyonu düzenli uygulayarak işinizin tam potansiyelini ortaya çıkarabilirsiniz. Sabah 05.00 bildirimleri bir şans değil, mühendislik işidir — ve bu yazıdaki her örnek, artık adıyla ve rakamıyla [vaka sayfalarımızda](/vakalar) duruyor.",
          en: "Success in e-commerce is not a destination but a continuous process of growth and renewal. Understand the market, draw on the right expertise, apply strategic optimization consistently, and you can unlock your business's full potential. Those 5 a.m. notifications are not luck but engineering — and every example in this article now stands, named and numbered, on [our case pages](/vakalar).",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticaret hikâyeniz daha yeni başlıyor. İlk adım için [e-ticaret danışmanlığı hizmetimize](/hizmetler/e-ticaret) göz atın — ya da doğrudan bir görüşme planlayın; üç ayın neler değiştirebileceğini yukarıda okudunuz.",
          en: "Your e-commerce story is just beginning. For the first step, take a look at [our e-commerce consultancy service](/hizmetler/e-ticaret) — or book a call directly; you've read above what three months can change.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "E-ticaret ajansı tam olarak ne yapar?",
          en: "What exactly does an e-commerce agency do?",
        },
        answer: {
          tr: "Çevrimiçi işin her katmanını tek çatı altında optimize eder: pazar araştırması ve strateji, platform ve yazılım altyapısı, ölçüm kurulumu, dijital pazarlama kanallarının yönetimi, dönüşüm optimizasyonu ve marka kimliği. Değerinin kaynağı, farklı sektörlerden edindiği tecrübeyi projenize aktarmasıdır — müşteriye ulaşmakla müşteriden kazanmak arasındaki süreçler her sektörde aynıdır.",
          en: "It optimizes every layer of an online business under one roof: market research and strategy, platform and software infrastructure, measurement setup, digital marketing channels, conversion optimization and brand identity. Its value comes from carrying experience across industries into your project — the processes between reaching a customer and earning from one are the same in every industry.",
        },
      },
      {
        question: {
          tr: "E-ticaret ajansıyla çalışmak ne zaman mantıklı?",
          en: "When does working with an e-commerce agency make sense?",
        },
        answer: {
          tr: "Üç durumda: sıfırdan başlıyorsanız ve ilk kurulumun pahalı hatalarını yaşamak istemiyorsanız; büyüme durdu ve nedenini veriyle teşhis edemiyorsanız; ya da reklam bütçeniz artarken getiri artmıyorsa. Ortak payda şudur: problem tek kanalda değil sistemdeyse, tek uzman yerine sistemi kuran bir ekip gerekir.",
          en: "In three situations: you're starting from zero and don't want to live through the expensive mistakes of a first setup; growth has stalled and you can't diagnose why with data; or your ad budget grows while returns don't. The common denominator: when the problem is in the system rather than a single channel, you need a team that builds systems, not a single specialist.",
        },
      },
      {
        question: {
          tr: "Hangi e-ticaret platformunu seçmeliyim?",
          en: "Which e-commerce platform should I choose?",
        },
        answer: {
          tr: "Özellik listesine değil üç kritere bakın: bugünkü operasyonunuzu taşıyor mu, iki yıl sonraki ölçeğinizi kaldırır mı, ekosistemi (ödeme, kargo, pazaryeri entegrasyonları) pazarınıza uygun mu? Türkiye'de satan bir marka için İKAS ve Shopify güçlü başlangıçlardır; büyük katalog ve özel iş akışı gerektiren işlerde WooCommerce, Magento veya özel geliştirme devreye girer. Platform kararı geri dönüşü en pahalı karardır — kurulumdan önce verilmelidir.",
          en: "Look past the feature list at three criteria: does it carry your operation today, will it hold your scale two years from now, and does its ecosystem (payments, shipping, marketplace integrations) fit your market? For a brand selling in Türkiye, İKAS and Shopify are strong starting points; large catalogs and custom workflows call for WooCommerce, Magento or custom development. The platform decision is the most expensive one to reverse — make it before the build.",
        },
      },
      {
        question: {
          tr: "Ajans seçerken hangi soruları sormalıyım?",
          en: "What questions should I ask when choosing an agency?",
        },
        answer: {
          tr: "Üç soru yeterli: \"Benzer ölçekte hangi işleri yaptınız, rakamları görebilir miyim?\" (kanıt), \"Benim işim için ilk 90 günün planı ne olurdu?\" (yaklaşım) ve \"Neyi yapmazsınız?\" (dürüstlük). Rakam gösteremeyen, plana başlamadan fiyat veren ve her şeyi yaparız diyen ajanstan uzak durun.",
          en: "Three questions are enough: \"What have you done at a similar scale, and can I see the numbers?\" (proof), \"What would the first 90 days look like for my business?\" (approach) and \"What won't you do?\" (honesty). Walk away from any agency that can't show numbers, prices before planning, or claims to do everything.",
        },
      },
    ],
    category: "growth",
    tags: ["e-ticaret", "e-ticaret-danismanligi", "donusum-optimizasyonu"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-08-06",
    readingMinutes: 6,
  },

  {
    // Eski blogdan taşındı (2024-10-07). Başlıktaki yıllar güncellendi (espri
    // korunarak), mobil istatistiği yıl iddiasından arındırıldı, kırık
    // "buraya tıklayın" CTA'sı hizmet bağlantısına çevrildi. HATA 4'teki bir
    // cümle marka çizgisi için yumuşatıldı (Burak'a raporlandı).
    slug: {
      tr: "7-onemli-performans-pazarlama-hatasi",
      en: "7-performance-marketing-mistakes",
    },
    title: {
      tr: "2026'da hâlâ yaptığınız (muhtemelen 2027'de de yapacağınız) 7 performans pazarlama hatası",
      en: "7 performance marketing mistakes you still make in 2026 (and probably will in 2027)",
    },
    excerpt: {
      tr: "En büyük markalar bile kampanyalara milyonlar yatırıp önlenebilir hatalarla raydan çıkar. KPI'sızlıktan elde tutmayı unutmaya, yedi tuzak ve her birinin çıkış yolu.",
      en: "Even the biggest brands pour millions into campaigns and derail on preventable mistakes. From missing KPIs to forgotten retention — seven traps and the way out of each.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 7 Ekim 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlıktaki yıllar güncellendi (liste maalesef eskimedi), mobil istatistikleri tazelendi, örnekler yayımlanmış vakalarımıza bağlandı, \"2026'da değişen ne?\" bölümü ve sık sorulan sorular eklendi.",
      en: "First published on 7 October 2024. Revised on 23 August 2026: the years in the title were updated (sadly, the list hasn't aged), the mobile statistics were refreshed, the examples now link to our published case studies, and the \"What changed in 2026?\" section and FAQ were added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Performans pazarlaması mı? Şöyle hayal edin: devasa bir geminin dümenindesiniz. Dijital dünyanın denizleri engin ve tehlikeli; etkileyici bir strateji filosuyla yola çıkmış olsanız da, bir yerde geminin rotadan saptığını fark ediyorsunuz. Bu, en büyük markaların bile başına gelir — kampanyalara milyonlar yatırır, sonra bunların önlenebilir hatalar yüzünden raydan çıktığını görürler.",
          en: "Performance marketing? Picture this: you're at the helm of a massive ship. The seas of the digital world are vast and dangerous; you may have set sail with an impressive fleet of strategies, yet somewhere along the way you notice the ship drifting off course. It happens to the biggest brands — they pour millions into campaigns, then watch them derail on preventable mistakes.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Başarılı performans pazarlaması ayrıntılara hakim olmaya bağlıdır. Mesele bütçe değildir; pazarlama makinenizdeki her dişliyi iyileştirmek, tüm bileşenlerin uyum içinde çalışmasını sağlamaktır. Bu yazı, yapıyor olabileceğiniz en önemli yedi hatayı ve her birinin nasıl düzeltileceğini inceliyor.",
          en: "Successful performance marketing depends on mastering the details. It's not about budget; it's about improving every gear in your marketing machine and keeping all components working in harmony. This article examines the seven most important mistakes you may be making — and how to fix each one.",
        },
      },
      {
        type: "h2",
        id: "hata-1-net-kpi-belirlememek",
        text: {
          tr: "Hata 1: Net KPI belirlememek",
          en: "Mistake 1: No clear KPIs",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir tatil planladığınızı düşünün: uçaklar, oteller, turlar, restoranlar — hepsi rezerve. Ama nihai varış noktanızı bilmiyorsunuz. Tropik bir plaj için mi toplanacaksınız, karlı bir dağ için mi? İyi tanımlanmış KPI'lar olmadan performans pazarlaması tam olarak budur: bitiş noktası olmayan ayrıntılı bir seyahat planı.",
          en: "Imagine planning a holiday: flights, hotels, tours, restaurants — all booked. But you don't know your final destination. Do you pack for a tropical beach or a snowy mountain? Performance marketing without well-defined KPIs is exactly that: a detailed itinerary with no endpoint.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Birçok büyük marka \"bilinirliği artırmak\" veya \"trafiği yükseltmek\" gibi geniş hedeflerle kampanya başlatır. Kulağa iyi gelir ama ölçülemez. Lüks bir perakende markası, yüksek profilli bir influencer kampanyasına milyonlar aktarmış, sonradan dönüşüm için ölçülebilir KPI belirlemediklerini fark etmişti. Sonuç: etkileyici etkileşim oranları, ama ölçülebilir satış artışı yok.",
          en: "Many big brands launch campaigns with broad goals like \"raise awareness\" or \"increase traffic\". Sounds nice, measures nothing. A luxury retail brand once poured millions into a high-profile influencer campaign, only to realize afterwards they had set no measurable conversion KPIs. The result: impressive engagement rates, no measurable lift in sales.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Spesifik olun: \"satışta %10 artış\" veya \"5 kat ROAS\" — ne istediğinizi açıkça yazın.",
            en: "Be specific: \"10% sales lift\" or \"5× ROAS\" — write down exactly what you want.",
          },
          {
            tr: "Ölçülebilir olun: CTR, dönüşüm oranı, CAC gibi metrikler izlenecek somut rakam verir.",
            en: "Be measurable: metrics like CTR, conversion rate and CAC give you concrete numbers to track.",
          },
          {
            tr: "Zamana bağlayın: son tarih koyun; uzun vadeli hedefi kısa vadeli kıyas noktalarına bölün.",
            en: "Be time-bound: set deadlines; split long-term goals into short-term benchmarks.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Nike'ın \"Just Do It\" kampanyası büyük bir bilinirlik başarısıydı; ama aynı zamanda dijital etkileşim ve satış dönüşümü için spesifik KPI'lara sahipti. Marka yalnız reklamı kaç kişinin gördüğünü değil, kaç kişinin harekete geçtiğini de ölçtü — ve kampanyaya gerçek zamanlı ince ayar yapabildi.",
          en: "Nike's \"Just Do It\" was a huge awareness success — but it also had specific KPIs for digital engagement and sales conversion. The brand measured not just how many people saw the ad, but how many acted — and could fine-tune the campaign in real time.",
        },
      },
      {
        type: "h2",
        id: "hata-2-mobil-optimizasyonu-ihmal",
        text: {
          tr: "Hata 2: Mobil optimizasyonu ihmal etmek",
          en: "Mistake 2: Neglecting mobile optimization",
        },
      },
      {
        type: "p",
        text: {
          tr: "Mobil trafiğin toplam trafiğin %70'inin üzerinde seyrettiği bir çağda, mobili ihmal etmek pazarlama hattınızın yarıdan fazlasını kapatmaya benzer. Önde gelen bir teknoloji markası, hantal ve yavaş mobil sitesi yüzünden mobil dönüşümünün masaüstünün çok gerisinde kaldığını görmüştü. Çözüm: mobil öncelikli tasarım, hızlanan sayfa yüklemeleri, sadeleşen gezinme ve küçük ekranda sorunsuz ödeme.",
          en: "In an age where mobile holds above 70% of total traffic, neglecting mobile is like shutting down more than half your marketing pipeline. A leading tech brand once found its mobile conversion far behind desktop because its mobile site was clunky and slow. The fix: mobile-first design, faster page loads, simplified navigation and a checkout that works on a small screen.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Duyarlı tasarım kullanın; site her cihazda hem iyi görünmeli hem hızlı çalışmalı.",
            en: "Use responsive design; the site must look good and run fast on every device.",
          },
          {
            tr: "Yükleme hızını optimize edin: Google'ın klasik araştırmasına göre mobil ziyaretçilerin %53'ü, üç saniyeden uzun yüklenen siteyi terk ediyor.",
            en: "Optimize load speed: per Google's classic research, 53% of mobile visitors abandon a site that takes longer than three seconds.",
          },
          {
            tr: "Mobil deneyimi düzenli test edin — gerçek cihazlarda, gerçek bağlantı hızlarında.",
            en: "Test the mobile experience regularly — on real devices, at real connection speeds.",
          },
        ],
      },
      {
        type: "h2",
        id: "hata-3-veri-analitigini-atlamak",
        text: {
          tr: "Hata 3: Veri analitiğini atlamak",
          en: "Mistake 3: Skipping data analytics",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yolu görmeden araba kullandığınızı hayal edin. Markalar veriyi görmezden geldiğinde olan tam budur. Çok uluslu bir moda markası, analitiği izlemeden küresel kampanyalar yürütüyordu: yoğun harcıyor ama hangi kampanyanın sattırdığını, hangisinin para yaktığını bilmiyordu. Bu hatanın bizdeki kanıtı [SOYLU AVM vakası](/vakalar/soylu-avm-e-ticaret-buyume): kampanyadan önce piksel ve dönüşüm izleme sıfırdan kuruldu — 6 günde 1,5 milyon dolarlık sonucu mümkün kılan ilk adım ölçümdü.",
          en: "Imagine driving without seeing the road. That's exactly what happens when brands ignore data. A multinational fashion brand ran global campaigns without watching analytics: spending heavily, not knowing which campaign sold and which burned money. Our proof of this mistake is [the SOYLU AVM case](/vakalar/soylu-avm-e-ticaret-buyume): pixels and conversion tracking were rebuilt from scratch before the campaign — measurement was the first step that made $1.5M in 6 days possible.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Güçlü bir analitik kurulumuna yatırım yapın; veri incelemesini rutine bağlayın.",
            en: "Invest in a solid analytics setup; make data review a routine.",
          },
          {
            tr: "Kalıp ve anomali arayın, varyasyon test edin, bütçeyi bulguya göre kaydırın.",
            en: "Look for patterns and anomalies, test variations, shift budget to what the findings say.",
          },
          {
            tr: "Ölçemediğiniz kampanyayı büyütmeyin — önce izlemeyi onarın.",
            en: "Never scale a campaign you can't measure — fix tracking first.",
          },
        ],
      },
      {
        type: "h2",
        id: "hata-4-kisisellestirmemek",
        text: {
          tr: "Hata 4: Kampanyaları kişiselleştirmemek",
          en: "Mistake 4: Not personalizing campaigns",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir zamanlar reklam sadece açık hava panosuydu, sonra gazete, sonra televizyon geldi. O çağda reklamın işe yaramasını yalnızca umut edebilirdik. Bugünse hedef kitlemize günün her anında ulaşabiliyoruz — ve tüketici de bu anlaşmanın farkında: karşılığında kişiselleştirilmiş, alakalı içerik bekliyor. Tanınmış bir kozmetik markası, tüm tabanına aynı genel bülteni gönderdiği için etkileşimde sert bir düşüş yaşadı; segmentasyona ve tercihe göre uyarlanmış dinamik içeriğe geçince tıklama oranı %20 arttı, sadakat gözle görülür yükseldi.",
          en: "Advertising was once just a billboard, then newspapers, then television. In that era you could only hope the ad worked. Today we can reach our audience at any moment of the day — and consumers know the deal: in return they expect personalized, relevant content. A well-known cosmetics brand saw engagement drop sharply after sending the same generic newsletter to its whole base; switching to segmentation and preference-driven dynamic content lifted click-through by 20% and visibly raised loyalty.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kişiselleştirmenin ileri vitesi yeniden hedeflemedir: [GYMWOLVES vakasında](/vakalar/gymwolves-12-kat-satis) kitle segmentlere ayrıldı, düşük performanslı setler kapatıldı ve yeniden hedeflemeyle çapraz satış kuruldu — üç ayda 12 kat satışın dişlilerinden biri buydu.",
          en: "The higher gear of personalization is retargeting: in [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis) the audience was segmented, underperforming sets were closed and cross-selling was built on retargeting — one of the gears behind 12× sales in three months.",
        },
      },
      {
        type: "h2",
        id: "hata-5-ucretli-reklama-asiri-guven",
        text: {
          tr: "Hata 5: Ücretli reklama aşırı güvenmek",
          en: "Mistake 5: Over-relying on paid ads",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ücretli reklam trafik getirir; ama organik strateji olmadan ona yaslanmak, ısınmadan sürat koşusu yapmaya benzer — buharınız hızla tükenir. Büyük bir e-ticaret platformu, yalnız ücretli reklama odaklanıp içerik ve SEO'yu ihmal ettiği için büyümesinin durduğunu görmüştü. Tersi de mümkün: [SIM Baskı Malzemeleri](/vakalar/sim-baski-ihracat-icerigi) içerik programı ve yeniden kurulan altyapıyla organik trafiğini 6 ayda 15 katına çıkardı. Denge şart: ücretli hız verir, organik kalıcılık.",
          en: "Paid ads bring traffic; but leaning on them without an organic strategy is like sprinting without a warm-up — you run out of steam fast. A large e-commerce platform once watched its growth stall after focusing only on paid and neglecting content and SEO. The reverse is also possible: [SIM Printing Suppliers](/vakalar/sim-baski-ihracat-icerigi) grew organic traffic 15× in 6 months through a content program and a rebuilt stack. Balance is mandatory: paid buys speed, organic buys permanence.",
        },
      },
      {
        type: "h2",
        id: "hata-6-tutarsiz-marka-mesaji",
        text: {
          tr: "Hata 6: Tutarsız marka mesajı",
          en: "Mistake 6: Inconsistent brand messaging",
        },
      },
      {
        type: "p",
        text: {
          tr: "Apple, Coca-Cola, Starbucks — ortak noktaları ne? Tutarlı mesaj. Marka sesiniz kanaldan kanala dalgalandığında müşterinin kafası karışır ve kimliğiniz zayıflar. Çözüm mekanik: tonu, sesi ve mesajı tanımlayan bir marka stil rehberi yazın ve her departmanı ona bağlayın. Dijitalde, basılıda ve mağazada tek bir marka deneyimi kalsın.",
          en: "Apple, Coca-Cola, Starbucks — what do they share? Consistent messaging. When your brand voice fluctuates from channel to channel, customers get confused and your identity weakens. The fix is mechanical: write a brand style guide defining tone, voice and message, and bind every department to it. One brand experience across digital, print and store.",
        },
      },
      {
        type: "h2",
        id: "hata-7-elde-tutmayi-ihmal",
        text: {
          tr: "Hata 7: Müşteriyi elde tutmayı ihmal etmek",
          en: "Mistake 7: Neglecting retention",
        },
      },
      {
        type: "p",
        text: {
          tr: "Markalar yeni müşteri edinmeye o kadar odaklanır ki eldekini beslemeyi unutur. Oysa sadakat programı, satın alma sonrası takip ve kişiye özel teklif; tek seferlik bir alışverişle ömür boyu müşteri arasındaki farktır. Mutlu ve tekrar eden müşteri, zamanla markanın savunucusuna dönüşür — en ucuz pazarlama kanalınız odur.",
          en: "Brands get so focused on acquiring new customers that they forget to nurture the ones they have. Yet loyalty programs, post-purchase follow-up and personal offers are the difference between a one-off purchase and a lifetime customer. A happy repeat customer becomes the brand's advocate over time — your cheapest marketing channel.",
        },
      },
      {
        type: "h2",
        id: "2026da-degisen-ne",
        text: {
          tr: "2026'da değişen ne?",
          en: "What changed in 2026?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıyı 2024'te yayımladık ve dürüst olalım: yedi hatanın yedisi de hâlâ sahada. Değişen, hataların maliyeti oldu. Kampanya yönetimi büyük ölçüde AI'ya devredildi — Performance Max ve Advantage+ tarzı otomasyonlar bütçeyi kendisi optimize ediyor. Kulağa güvenli geliyor; değil. Yanlış KPI verilen bir otomasyon, yanlış hedefe kusursuz bir hızla koşar. Hata 1 artık daha pahalı.",
          en: "We published this piece in 2024 and let's be honest: all seven mistakes are still in the field. What changed is their cost. Campaign management has largely been handed to AI — Performance Max and Advantage+ style automations optimize budgets on their own. Sounds safe; it isn't. An automation fed the wrong KPI runs toward the wrong target with flawless speed. Mistake 1 is now more expensive.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkincisi: üçüncü taraf çerezlerin çöküşüyle ölçüm, birinci taraf veriye taşındı — Hata 3'ü yapan marka artık yalnızca kör değil, geride de. Üçüncüsü: keşif artık yalnız arama motorunda değil, AI motorlarında da başlıyor. \"Organik strateji\" 2026'da SEO + GEO demek — markanız ChatGPT'nin, Gemini'nin, Perplexity'nin cevaplarında da görünür olmalı. Hata 5'in organik ayağı büyüdü.",
          en: "Second: with the collapse of third-party cookies, measurement moved to first-party data — a brand making Mistake 3 is no longer just blind, it's behind. Third: discovery now starts not only in search engines but in AI engines. \"Organic strategy\" in 2026 means SEO + GEO — your brand must also be visible in the answers of ChatGPT, Gemini and Perplexity. The organic leg of Mistake 5 got bigger.",
        },
      },
      {
        type: "h2",
        id: "hatalari-ivmeye-donusturmek",
        text: {
          tr: "Hataları ivmeye dönüştürmek",
          en: "Turning mistakes into momentum",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu tuzaklara düşmek kolay; fark edip düzeltmekse stratejinizi dağınık bir çaba yığınından iyi yağlanmış bir makineye çevirir. Net KPI, mobil öncelik, veri disiplini, kişiselleştirme, ücretli-organik dengesi, tutarlı mesaj ve elde tutma — yedisi birden çalıştığında pazarlama bütçesi gider olmaktan çıkar, motor olur. Sonuçta mesele oyunda olmak değil, oyunu kazanmaktır.",
          en: "Falling into these traps is easy; spotting and fixing them turns your strategy from a scattered pile of effort into a well-oiled machine. Clear KPIs, mobile first, data discipline, personalization, the paid-organic balance, consistent messaging and retention — when all seven run together, the marketing budget stops being a cost and becomes an engine. In the end, the game isn't about playing; it's about winning.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Rotanızı birlikte düzeltmek isterseniz [performans pazarlama hizmetimize](/hizmetler/performans-pazarlama) göz atın — yedi hatanın denetimi, işimizin ilk adımıdır.",
          en: "If you'd like to correct course together, take a look at [our performance marketing service](/hizmetler/performans-pazarlama) — auditing these seven mistakes is the first step of our work.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Performans pazarlaması nedir?",
          en: "What is performance marketing?",
        },
        answer: {
          tr: "Sonucu ölçülebilir dijital pazarlama disiplinidir: bütçe; tıklama, dönüşüm, satış gibi izlenebilir çıktılara bağlanır ve kampanyalar bu veriye göre sürekli optimize edilir. Marka bilinirliği reklamcılığından farkı, her liranın hangi sonucu ürettiğinin bilinmesidir.",
          en: "It's the discipline of digital marketing with measurable outcomes: budget is tied to trackable results — clicks, conversions, sales — and campaigns are continuously optimized against that data. The difference from awareness advertising is knowing what result every unit of spend produces.",
        },
      },
      {
        question: {
          tr: "Yedi hatanın en kritiği hangisi?",
          en: "Which of the seven mistakes is the most critical?",
        },
        answer: {
          tr: "Ölçüm zinciri: net KPI (Hata 1) + veri analitiği (Hata 3). Çünkü diğer beş hata, ölçüm sağlamsa verinin içinde görünür ve düzeltilir; ölçüm yoksa hiçbiri teşhis edilemez. AI otomasyonları çağında bu ikili daha da kritikleşti — yanlış hedefe kusursuz optimizasyon yapılır.",
          en: "The measurement chain: clear KPIs (Mistake 1) plus data analytics (Mistake 3). Because if measurement is solid, the other five mistakes show up in the data and get fixed; without it, none can be diagnosed. In the age of AI automations this pair became even more critical — the wrong target gets optimized flawlessly.",
        },
      },
      {
        question: {
          tr: "İyi bir KPI nasıl belirlenir?",
          en: "How do you set a good KPI?",
        },
        answer: {
          tr: "Üç özellik arayın: spesifik (\"satışta %10 artış\", \"5 kat ROAS\"), ölçülebilir (CTR, dönüşüm oranı, CAC gibi izlenebilir metrikler) ve zamana bağlı (net son tarih, uzun vadeli hedefte kısa vadeli kıyas noktaları). \"Bilinirliği artırmak\" bir KPI değil, dilektir.",
          en: "Look for three properties: specific (\"10% sales lift\", \"5× ROAS\"), measurable (trackable metrics like CTR, conversion rate, CAC) and time-bound (a clear deadline, with short-term benchmarks for long-term goals). \"Raising awareness\" is not a KPI; it's a wish.",
        },
      },
      {
        question: {
          tr: "Ücretli ve organik arasındaki denge ne olmalı?",
          en: "What should the balance between paid and organic be?",
        },
        answer: {
          tr: "Sabit bir oran yok; işlev ayrımı var. Ücretli kanal hız ve test imkânı satın alır, organik kanal (SEO, içerik ve 2026'da GEO) kalıcılık ve biriken varlık kurar. Sağlıklı işaret şudur: ücretli reklamı bir ay kapattığınızda gelir sıfıra düşüyorsa, organik ayağınız yok demektir — denge kurulmamıştır.",
          en: "There's no fixed ratio; there's a division of labor. Paid buys speed and testing capacity; organic (SEO, content and, in 2026, GEO) builds permanence and compounding assets. The healthy test: if turning paid off for a month drops revenue to zero, you have no organic leg — the balance doesn't exist.",
        },
      },
    ],
    category: "growth",
    tags: ["performans-pazarlama", "dijital-pazarlama", "kpi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-10-07",
    readingMinutes: 6,
  },

  {
    // Eski blogdan taşındı (2024-10-13). Orijinal 7 kuralı iki kez anlatıyordu
    // ("Kural 1-7" özetleri + "Kilit Nokta 1-7" detayları — Elementor şablon
    // kalıntısı); teke indirildi. Kişisel anekdotlar ve rakamları korundu.
    // Sondaki iki kırık CTA hizmet bağlantısına çevrildi. TR slug eski URL
    // ile aynı.
    slug: {
      tr: "donusum-optimizasyonu-yontemleri",
      en: "landing-page-optimization-guide",
    },
    title: {
      tr: "Maksimum dönüşüm için açılış sayfanızı nasıl optimize edersiniz?",
      en: "How do you optimize your landing page for maximum conversion?",
    },
    excerpt: {
      tr: "Reklam mükemmel, trafik tavan — ama dönüşüm yok. Sorun çoğu zaman trafikte değil, açılış sayfasında. Yedi kural, gerçek rakamlarla: başlık değişiminden %25, CTA'dan %30, sadelikten %40.",
      en: "The ads are perfect, traffic is peaking — but nothing converts. The problem is usually the landing page, not the traffic. Seven rules with real numbers: 25% from a headline, 30% from a CTA, 40% from simplicity.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 13 Ekim 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: tekrar eden kural özetleri sadeleştirildi, hız ölçütleri güncellendi, \"2026'da CRO\" bölümü ve sık sorulan sorular eklendi.",
      en: "First published on 13 October 2024. Revised on 23 August 2026: the duplicated rule summaries were consolidated, the speed benchmarks were updated, and the \"CRO in 2026\" section and FAQ were added.",
    },
    blocks: [
      {
        type: "quote",
        text: {
          tr: "İyi tasarım, iyi bir sohbet gibidir: mesele yalnızca ne söylendiği değil, nasıl algılandığı ve anlaşıldığıdır.",
          en: "Good design is like a good conversation: it's not only what is said, but how it is perceived and understood.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Şunu hayal edin: mükemmel reklam kampanyasını hazırladınız, kitleyi ince ince segmentlere ayırdınız, en iyi senaryoyla en iyi kreatifleri ürettiniz. Tıklamalar gelmeye başlar, siteye gelen trafik tavan yapar. Ama sonra — hiçbir şey olmaz. Ziyaretçileriniz dönüşüm sağlamadan ince bir sis gibi kaybolur. \"Nerede yanlış yaptım?\" diye sorarsınız.",
          en: "Picture this: you've built the perfect ad campaign, segmented the audience in fine detail, produced the best creatives with the best script. The clicks start coming, traffic peaks. And then — nothing happens. Your visitors vanish like thin fog without converting. \"Where did I go wrong?\" you ask.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Çoğu durumda sorun trafik kaynağınız değil, açılış sayfanızdır. Bunu bir ev gibi düşünün: en güzel dekorasyona sahip olabilirsiniz, ama temel çürükse — kötü UX ve CRO — her şey çöker. Bu yazı, en küçük ince ayarın bile nasıl büyük etki yaratabileceğini yedi kural ve gerçek rakamlarla anlatıyor. Hadi dalalım mı?",
          en: "In most cases the problem is your landing page, not your traffic source. Think of it as a house: you can have the most beautiful decoration, but if the foundation is rotten — poor UX and CRO — everything collapses. This article shows how even the smallest tweak can have an outsized impact, in seven rules with real numbers. Shall we dive in?",
        },
      },
      {
        type: "h2",
        id: "kural-1-net-deger-onerisi",
        text: {
          tr: "Kural 1: Açık ve ikna edici değer önerisi",
          en: "Rule 1: A clear, compelling value proposition",
        },
      },
      {
        type: "p",
        text: {
          tr: "Değer önerisi, işletmenizin vaadi ve kitlenizle ilk temasıdır: sizi neyin farklı kıldığını ve neden rakipleriniz yerine sizi seçmeleri gerektiğini saniyeler içinde anlatmalıdır. Araştırmalar ilk izlenim için yaklaşık 50 milisaniyeniz olduğunu gösteriyor.",
          en: "The value proposition is your business's promise and the first touch with your audience: it must explain within seconds what makes you different and why they should choose you over your competitors. Research shows you have roughly 50 milliseconds to make a first impression.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir keresinde, benzersiz satış noktasını iletmekte zorlanan küçük bir e-ticaret işletmesiyle çalışmıştım. Başlıkları şuydu: \"ABC Ürünlerine Hoş Geldiniz.\" Genel bir ifadeydi ve hiçbir şey söylemiyordu. Kitle araştırmasından sonra başlığı temel güçlerine odakladık: \"Parlak, Sağlıklı Bir Cilt için El Yapımı, Organik Cilt Bakımı.\" Sonuç: dönüşümde %25 artış.",
          en: "I once worked with a small e-commerce business struggling to communicate its unique selling point. Their headline read: \"Welcome to ABC Products.\" It was generic and said nothing. After audience research we focused the headline on their core strength: \"Handmade, Organic Skincare for Bright, Healthy Skin.\" The result: a 25% lift in conversions.",
        },
      },
      {
        type: "h2",
        id: "kural-2-guclu-cta",
        text: {
          tr: "Kural 2: Güçlü ve görünür eylem çağrısı",
          en: "Rule 2: A strong, visible call to action",
        },
      },
      {
        type: "p",
        text: {
          tr: "CTA ana olaydır — dönüşüme açılan kapı. Ziyaretçi nereye gideceğini bilmeli ve yol davetkar olmalı. Kötü tasarlanmış ya da belirsiz bir CTA, size sessizce dönüşüm kaybettirir.",
          en: "The CTA is the main event — the door to conversion. The visitor must know where to go, and the path must be inviting. A poorly designed or vague CTA silently costs you conversions.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Netlik her şeyden önce: \"Gönder\" veya \"Buraya Tıkla\" değil; \"Ücretsiz Denemenizi Başlatın\", \"Rehberi İndirin\" gibi eylem odaklı ifadeler.",
            en: "Clarity above all: not \"Submit\" or \"Click Here\" — action-driven phrases like \"Start Your Free Trial\" or \"Download the Guide\".",
          },
          {
            tr: "Görünürlük: düğme belirgin, kaydırmadan görünen alanda ve zıt renkte olmalı.",
            en: "Visibility: the button should be prominent, above the fold and in a contrasting color.",
          },
          {
            tr: "Test edin: \"Ücretsiz E-kitabımı Al\" yerine \"Ücretsiz E-kitabınızı Alın\" gibi küçücük bir değişiklik bile tıklamayı artırabilir.",
            en: "Test it: even a change as tiny as \"Get My Free E-book\" versus \"Get Your Free E-book\" can lift clicks.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Çalıştığım yerel bir SaaS şirketi, CTA'sını \"Kaydol\"dan \"Ücretsiz Demonuzu Alın\"a çevirdi — daha net, daha ikna edici bir eylem. Sonuç: dönüşümde %30 artış.",
          en: "A local SaaS company I worked with changed its CTA from \"Sign Up\" to \"Get Your Free Demo\" — a clearer, more persuasive action. The result: a 30% lift in conversions.",
        },
      },
      {
        type: "h2",
        id: "kural-3-sade-duzen",
        text: {
          tr: "Kural 3: Minimalist, dikkat dağıtmayan düzen",
          en: "Rule 3: A minimalist, distraction-free layout",
        },
      },
      {
        type: "p",
        text: {
          tr: "Web tasarımında az, çoktur. Dağınık bir sayfa ziyaretçinin kafasını karıştırır ve dönüşmek yerine hemen çıkmasına neden olur. Sayfadaki her öğe dönüşüm hedefini desteklemeli; dikkati CTA'dan uzaklaştıran gereksiz bağlantılar ve dev metin blokları gitmeli. Boşluktan korkmayın — boşluk, en önemli içeriğinize dikkat çeker. Görsel hiyerarşiyle ziyaretçinin gözüne rehberlik edin ve sahici hissettirmeyen stok fotoğraflardan uzak durun.",
          en: "In web design, less is more. A cluttered page confuses visitors and makes them bounce instead of convert. Every element must support the conversion goal; unnecessary links and giant text blocks that pull attention from the CTA must go. Don't fear whitespace — it draws attention to what matters most. Guide the visitor's eye with visual hierarchy, and stay away from stock photos that don't feel authentic.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir B2B yazılım şirketi sayfasını sadeleştirdi, form alanlarını azalttı ve büyük, gerçek ürün görselleri kullandı. Sonuç: potansiyel müşteri gönderimlerinde %40 artış. Aynı prensibin bizdeki karşılığı [GYMWOLVES vakası](/vakalar/gymwolves-12-kat-satis): ürün sayfalarındaki arayüz hataları tek tek ayıklandı — dönüşümü aşağı çeken şey çoğu zaman trafik değil, sayfanın kendisiydi.",
          en: "A B2B software company simplified its page, cut form fields and used large, real product visuals. The result: a 40% lift in lead submissions. Our own version of the same principle is [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis): the UI flaws on product pages were picked out one by one — what dragged conversion down was usually the page itself, not the traffic.",
        },
      },
      {
        type: "h2",
        id: "kural-4-sosyal-kanit",
        text: {
          tr: "Kural 4: Sosyal kanıtla güven inşa edin",
          en: "Rule 4: Build trust with social proof",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dönüşümde güven her şeydir. Müşteri yorumları, vaka çalışmaları, güven rozetleri ve müşteri logoları üçüncü taraf doğrulaması işlevi görür — potansiyel müşterinin zihnindeki şüpheyi eritir. Çalıştığım bir e-öğrenme platformu, iş birliği yaptığı saygın üniversitelerin logolarını sergiledi; bu basit ekleme bile dönüşümde %15 artış sağladı.",
          en: "In conversion, trust is everything. Customer reviews, case studies, trust badges and client logos act as third-party validation — they dissolve the doubt in a prospect's mind. An e-learning platform I worked with displayed the logos of the respected universities it partnered with; even that simple addition lifted conversions by 15%.",
        },
      },
      {
        type: "h2",
        id: "kural-5-hizli-yukleme",
        text: {
          tr: "Kural 5: Hızlı yükleme süresi",
          en: "Rule 5: Fast load time",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sayfanız ne kadar ikna edici olursa olsun, geç yükleniyorsa ziyaretçi onu hiç görmeden gider. İnsanlığın dikkat süresi yıldan yıla kısalıyor; bir tavşan yarışındasınız ve belki bir saniyeden biraz fazla zamanınız var. Ve bu saniye rakiplerinizi yenmek için değil — yarışta kalabilmek için.",
          en: "However persuasive your page is, if it loads late the visitor leaves without ever seeing it. Humanity's attention span shrinks year after year; you're in a hare race with maybe a bit more than one second. And that second isn't for beating your competitors — it's for staying in the race.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Görselleri sıkıştırın ve WEBP kullanın — büyük dosyalar en yaygın hız katilidir.",
            en: "Compress images and use WEBP — oversized files are the most common speed killer.",
          },
          {
            tr: "Yönlendirmeleri azaltın; her yönlendirme yükleme süresine eklenir.",
            en: "Cut redirects; every redirect adds to load time.",
          },
          {
            tr: "Tarayıcı önbelleğini açın ve CDN kullanın — dönen ziyaretçi ve uzak coğrafya hızlanır.",
            en: "Enable browser caching and use a CDN — returning visitors and distant geographies speed up.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Yerel bir perakendecinin sayfası, görsel optimizasyonu ve eklenti temizliğiyle 7 saniyeden 2,5 saniyeye indi: hemen çıkma %20 azaldı, dönüşüm %15 arttı. Çıtanın 2026 hali için [SIM vakamıza](/vakalar/sim-baski-ihracat-icerigi) bakın: beş dilli sitenin açılışı bir saniyenin altında.",
          en: "A local retailer's page dropped from 7 seconds to 2.5 through image optimization and plugin cleanup: bounce fell 20%, conversion rose 15%. For the 2026 version of the bar, see [our SIM case](/vakalar/sim-baski-ihracat-icerigi): a five-language site loading in under a second.",
        },
      },
      {
        type: "h2",
        id: "kural-6-ab-testi",
        text: {
          tr: "Kural 6: Süregelen A/B testleri",
          en: "Rule 6: Continuous A/B testing",
        },
      },
      {
        type: "p",
        text: {
          tr: "Hepimiz insanız — ben hep en iyi senaryonun ne olabileceğini merak ederim. Açıklayayım: diyelim 800 ROAS ile reklam veriyorum. Aman Tanrım, değil mi? Müthiş olmalı. Ama bu skorla kutlama yemeğine çıkmadan önce bile ilk sorum şudur: 800'ü yakalayabiliyorken neden 1800 olmasın? Hangi kreatif daha fazla kâr getirirdi, hangi kitle daha kârlıydı?",
          en: "We're all human — I always wonder what the best-case scenario could have been. Let me explain: say I'm running ads at an 800 ROAS. Oh my, right? Must be fantastic. But even before going out for the celebration dinner, my first question is always: if 800 is reachable, why not 1800? Which creative would have brought more profit, which audience was more profitable?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Hiçbir açılış sayfası mükemmel değildir; A/B testi bu yüzden vazgeçilmezdir. Başlık varyasyonları, farklı CTA'lar, renk şemaları, düzen değişiklikleri, yorumlu ve yorumsuz sürümler — sürekli test, zaman içinde sayfayı veriyle yontar.",
          en: "No landing page is perfect; that's why A/B testing is indispensable. Headline variations, different CTAs, color schemes, layout changes, versions with and without testimonials — continuous testing carves the page with data over time.",
        },
      },
      {
        type: "h2",
        id: "kural-7-mobil-optimizasyon",
        text: {
          tr: "Kural 7: Mobil optimizasyon tartışmaya kapalı",
          en: "Rule 7: Mobile optimization is non-negotiable",
        },
      },
      {
        type: "p",
        text: {
          tr: "Trafiğin yarıdan fazlası mobilden geliyor; telefonda gezinmesi zor bir sayfa terk edilir. Üç zorunluluk: her ekrana uyum sağlayan duyarlı tasarım, parmakla rahat dokunulan düğmeler ve alan sayısı azaltılmış formlar. Mobil form ne kadar kısaysa, tamamlanma o kadar yüksek.",
          en: "More than half of traffic comes from mobile; a page that's hard to navigate on a phone gets abandoned. Three musts: responsive design that adapts to every screen, buttons comfortable to tap with a finger, and forms with fewer fields. The shorter the mobile form, the higher the completion.",
        },
      },
      {
        type: "h2",
        id: "2026da-cro",
        text: {
          tr: "2026'da CRO: neler değişti?",
          en: "CRO in 2026: what changed?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıyı 2024'te yayımladık; yedi kural yerinde duruyor ama üç çıta yükseldi. Birincisi hız: \"3 saniyenin altı\" artık taban, hedef Core Web Vitals'ın yeşil bandı — biz kendi projelerimizde bir saniyenin altını kovalıyoruz. İkincisi test: AI, varyant üretimini ve trafiğin dağıtımını otomatikleştirdi; ama neyi test edeceğinize dair hipotez hâlâ insan işi — makine, sorulmayan sorunun cevabını veremez.",
          en: "We published this piece in 2024; the seven rules still stand, but three bars have risen. First, speed: \"under 3 seconds\" is now the floor, the target is Core Web Vitals' green band — on our own projects we chase sub-second loads. Second, testing: AI automated variant production and traffic allocation; but the hypothesis of what to test is still human work — a machine can't answer a question that was never asked.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üçüncüsü ve en yenisi: sayfanıza artık yalnız insanlar bakmıyor. Trafik AI motorlarından da geliyor ve bu motorlar sayfanızı özetleyip kullanıcıya anlatıyor. Değer önerisi görselin içine gömülüyse AI onu okuyamaz; açık metin olarak sayfada durmalı. [OdorGo vakamızda](/vakalar/odorgo-kategori-yaratma) siteyi tam bu mantıkla kurduk: hangi kanaldan hangi sayfaya girilirse girilsin, ikna edici bilgi metin olarak orada — ziyaretçi de, onu özetleyen motor da aynı netliği görüyor.",
          en: "Third and newest: humans are no longer the only ones looking at your page. Traffic also arrives from AI engines, and those engines summarize your page to the user. If the value proposition is buried inside an image, AI can't read it; it must live on the page as plain text. In [our OdorGo case](/vakalar/odorgo-kategori-yaratma) we built the site on exactly this logic: whichever channel and page a visitor enters from, the convincing information is there as text — seen with the same clarity by the visitor and by the engine summarizing it.",
        },
      },
      {
        type: "h2",
        id: "surekli-optimizasyon",
        text: {
          tr: "Sonuç: sürekli optimizasyon",
          en: "Conclusion: continuous optimization",
        },
      },
      {
        type: "p",
        text: {
          tr: "Açılış sayfası optimizasyonu bir proje değil, süreçtir. Her ince ayar, her A/B testi ve her içgörü sizi daha yüksek dönüşüme ve daha iyi ROI'ye yaklaştırır. Sayfanıza evrilen bir varlık gibi yaklaşın: kullanıcı davranışına ve pazar trendlerine göre sürekli iyileştirin. CTA dilini ayarlamak veya düzeni sadeleştirmek gibi küçük değişiklikler bile önemli iyileştirmeler sağlar — yukarıdaki rakamlar bunun kanıtı.",
          en: "Landing page optimization is not a project but a process. Every tweak, every A/B test and every insight moves you toward higher conversion and better ROI. Treat your page as an evolving asset: keep improving it against user behavior and market trends. Even small changes like adjusting CTA language or simplifying the layout deliver real gains — the numbers above are the proof.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sayfanız doldurdukça sızan bir kovaya dönüştüyse, delikleri birlikte kapatalım: [CRO hizmetimiz](/hizmetler/cro), tam olarak bu denetimle başlar.",
          en: "If your page has become a bucket that leaks as fast as you fill it, let's plug the holes together: [our CRO service](/hizmetler/cro) starts with exactly this audit.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Dönüşüm oranı optimizasyonu (CRO) nedir?",
          en: "What is conversion rate optimization (CRO)?",
        },
        answer: {
          tr: "Siteye gelen mevcut trafiğin daha büyük bir bölümünü hedeflenen eyleme (satın alma, form, kayıt) dönüştürme disiplinidir. Trafik satın almanın aksine CRO, elinizdeki ziyaretçiden daha fazla değer üretir — bu yüzden reklam bütçesi büyümeden geliri büyütebilen tek kaldıraçtır.",
          en: "It's the discipline of converting a larger share of existing traffic into the targeted action (purchase, form, signup). Unlike buying traffic, CRO produces more value from the visitors you already have — which makes it the one lever that can grow revenue without growing ad budget.",
        },
      },
      {
        question: {
          tr: "Açılış sayfasında ilk neyi düzeltmeliyim?",
          en: "What should I fix first on a landing page?",
        },
        answer: {
          tr: "Sırasıyla üç şeyi kontrol edin: sayfa hızı (yavaşsa gerisinin önemi yok), değer önerisinin netliği (ilk saniyelerde ne sattığınız anlaşılıyor mu) ve CTA'nın görünürlüğü. Bu üçü sağlamsa gerisi — sosyal kanıt, düzen, form — A/B testiyle sırayla iyileştirilir.",
          en: "Check three things in order: page speed (if it's slow, nothing else matters), the clarity of the value proposition (is it obvious within seconds what you sell) and the visibility of the CTA. With those three solid, the rest — social proof, layout, forms — gets improved in sequence through A/B testing.",
        },
      },
      {
        question: {
          tr: "A/B testine nereden başlamalıyım?",
          en: "Where do I start with A/B testing?",
        },
        answer: {
          tr: "Dönüşüme en yakın öğeden: önce başlık ve CTA metni, sonra sayfa düzeni ve sosyal kanıt varlığı. Tek seferde tek değişken test edin, anlamlı trafik toplanmadan karar vermeyin ve kazanan varyantı yeni taban kabul edip döngüyü sürdürün. Yanlış başlangıç, aynı anda beş şeyi değiştirip hangisinin işe yaradığını bilememektir.",
          en: "From the element closest to conversion: headline and CTA copy first, then layout and the presence of social proof. Test one variable at a time, don't decide before meaningful traffic accumulates, and treat the winning variant as the new baseline to continue the loop. The wrong start is changing five things at once and never knowing which one worked.",
        },
      },
      {
        question: {
          tr: "İyi bir dönüşüm oranı yüzde kaçtır?",
          en: "What is a good conversion rate?",
        },
        answer: {
          tr: "Sektöre, trafiğin kaynağına ve eylemin ağırlığına göre değişir: e-ticarette %2-4 bandı yaygın ortalamadır, iyi optimize edilmiş sayfalar %5'in üzerine çıkar; form tabanlı B2B sayfalarında %10 üzeri görülebilir. Asıl ölçüt sektör tablosu değil, kendi geçmişinizdir: bu ayın oranı geçen aydan yüksekse doğru yoldasınız.",
          en: "It varies by industry, traffic source and the weight of the action: 2-4% is the common average in e-commerce, well-optimized pages exceed 5%, and form-based B2B pages can go above 10%. The real benchmark isn't an industry table but your own history: if this month's rate beats last month's, you're on the right path.",
        },
      },
    ],
    category: "growth",
    tags: ["donusum-optimizasyonu", "cro", "ui-ux"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-10-13",
    readingMinutes: 6,
  },

  {
    // Eski blogdan taşındı (2024-11-14; Aralık 2025'te kısmen güncellenmişti).
    // 2025/2026 yıl tutarsızlıkları giderildi, üç ayrı "Düşünce Soruları"
    // bloğu tek bölümde toplandı, kırık CTA yazılar sayfasına bağlandı.
    // TR slug eski URL ile aynı.
    slug: {
      tr: "ugc-kullanimi-ve-sosyal-kanit",
      en: "ugc-and-social-proof",
    },
    title: {
      tr: "Yeni müttefik UGC: sosyal kanıt neden her reklamdan güçlü?",
      en: "The new ally, UGC: why is social proof stronger than any ad?",
    },
    excerpt: {
      tr: "Doomscroll'da dikkatinizi çeken şey cilalı bir reklam değil, sizin gibi birinin samimi videosu. UGC'nin arkasındaki nörobilim, GoPro ve Airbnb örnekleri ve markanızı kamp ateşinin başına indirmenin yolu.",
      en: "What catches your eye mid-doomscroll isn't a polished ad but a sincere video from someone like you. The neuroscience behind UGC, the GoPro and Airbnb examples, and how to bring your brand down to the campfire.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 14 Kasım 2024'te yayımlandı ve Aralık 2025'te kısmen güncellenmişti. 23 Ağustos 2026'da gözden geçirildi: yıl tutarsızlıkları giderildi, düşünce soruları tek bölümde toplandı, \"AI çağında sahicilik\" bölümü ve sık sorulan sorular eklendi.",
      en: "First published on 14 November 2024 and partially updated in December 2025. Revised on 23 August 2026: year inconsistencies were fixed, the reflection questions were gathered into one section, and the \"Authenticity in the AI age\" section and FAQ were added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Hiç kendinizi elinizde telefon, saatlerce aşağı kaydırırken buldunuz mu? Biz buna DOOMSCROLL diyoruz. Alışıldık markalı gönderilerin arasında dikkatinizi çeken bir şey görürsünüz: merak ettiğiniz bir ürünün paketini açan, hissini, ağırlığını, kalitesini anlatan samimi bir video. Çeken kişi cilalı bir aktör ya da yüksek takipçili bir influencer değil — sizin gibi, deneyimini paylaşan sıradan biri. İçgüdüsel olarak bir bağ hissedersiniz. Bu bağ yalnız ürünle değil; geleneksel reklamcılığın çoğu zaman eksik bıraktığı güven, ilişkilenebilirlik ve topluluk duygusuyladır.",
          en: "Ever found yourself phone in hand, scrolling down for hours? We call it DOOMSCROLL. Among the usual branded posts, something catches your eye: a sincere video of someone unboxing a product you're curious about, describing its feel, weight, quality. The person filming isn't a polished actor or a big-following influencer — they're an ordinary person like you, sharing their experience. Instinctively you feel a bond. And that bond isn't only with the product; it's with the trust, relatability and sense of community that traditional advertising so often leaves out.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yıllardır markalar bu samimi bağı özenle kurgulanmış kampanyalarla yakalamaya çalıştı; ama en etkili içerikleri hâlâ UGC'lerden görüyoruz. Bugünün ve kesinlikle yarının kitleleri, mesafeli veya aşırı parlak reklamlardan eskisi kadar etkilenmiyor; gerçek insanlardan gerçek hikâyeler — yani özgünlük — arıyor. UGC tam burada devreye giriyor: markanın kitleye ulaşmasını değil, onunla eski bir arkadaş gibi konuşmasını sağlıyor. Bu, özellikle KOBİ'ler için büyük bir fırsat.",
          en: "For years brands tried to capture that sincere bond with carefully crafted campaigns; yet the most effective content still comes from UGC. Today's audiences — and certainly tomorrow's — are less moved by distant or overly polished ads; they look for real stories from real people, in a word: authenticity. This is exactly where UGC comes in: it lets a brand not just reach its audience but talk with it like an old friend. For SMBs especially, that's a huge opportunity.",
        },
      },
      {
        type: "h2",
        id: "ugc-mi-cilali-icerik-mi",
        text: {
          tr: "UGC mi, cilalı içerik mi?",
          en: "UGC or polished content?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Doğru cevap: ikisi birden. UGC ilişkilenebilir, özgün bağı kurmada öne çıkar; ama geleneksel, parlak içeriğin yerini tutmaz. Profesyonel fotoğraf, özenli infografik, tanıtım filmi ve görsel olarak çarpıcı kampanyalar marka güvenilirliğini kurar, kaliteyi gösterir, iyi bir tanışma sunar. En yüksek kalitedeki geleneksel içerik bir gereklilik olmayı sürdürüyor — UGC'nin etrafında dönebileceği yapıyı ve otoriteyi o sağlar. UGC, iyi kurulmuş bir varlığa eklenen özgünlük katmanıdır; stratejinin yerine geçen değil, onu tamamlayan güç.",
          en: "The right answer: both. UGC excels at building the relatable, authentic bond; but it doesn't replace traditional, polished content. Professional photography, careful infographics, promo films and visually striking campaigns build brand credibility, demonstrate quality, make a good introduction. Top-quality traditional content remains a necessity — it provides the structure and authority UGC can orbit around. UGC is the authenticity layer added onto a well-built presence; not a replacement for the strategy but its amplifier.",
        },
      },
      {
        type: "h2",
        id: "ugc-neden-ise-yariyor",
        text: {
          tr: "Sosyal etkinin bilimi: UGC neden işe yarıyor?",
          en: "The science of social influence: why does UGC work?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İnsan davranışı, modern dijital çağda bile en eski atalarımıza dayanan içgüdülerden etkilenir. Nörobilim ve psikoloji araştırmaları, sosyal onaylanma ve aidiyetin temel insani ihtiyaçlar olduğunu gösteriyor. Başkalarının bir ürünü kullandığını veya onayladığını gördüğümüzde, hayatta kalma içgüdüsüne dayanan bilinçaltı bir tepki tetiklenir: popüler ve güvenilen şeyin güvenli olduğunu hissetmeye meyilliyiz. \"Sürü etkisi\" üzerine çalışmalar, başkalarının bir şeyi onayladığını gözlemlediğimizde beynin ödül kimyasalı dopamini salgıladığını ortaya koyuyor.",
          en: "Human behavior, even in the modern digital age, is shaped by instincts that go back to our earliest ancestors. Neuroscience and psychology research shows social approval and belonging are fundamental human needs. When we see others using or endorsing a product, a subconscious response rooted in survival instinct fires: we tend to feel that what is popular and trusted is safe. Studies of the \"herd effect\" show the brain releases dopamine — its reward chemical — when we observe others endorsing something.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Journal of Consumer Research'te yayımlanan bilinen bir çalışma, akran onayının satın alma davranışını nasıl etkilediğini vurguladı: ürüne otantik kullanıcı geri bildirimi eşlik ettiğinde, araştırmacıların \"benim gibi\" önyargısı dediği zihinsel kısayol devreye girer. Bize benzeyen insanlara güvenme ve onların seçimlerinin bizimle alakalı olduğuna inanma olasılığımız daha yüksektir. UGC'nin başarılı olduğu yer tam burası: gerçek insanları, gerçek durumlarda, gerçek seçimler yaparken gösterir — ve bu, psikolojik düzeyde yankı bulur.",
          en: "A well-known study published in the Journal of Consumer Research highlighted how peer endorsement shapes purchase behavior: when authentic user feedback accompanies a product, a mental shortcut researchers call the \"like-me\" bias kicks in. We are more likely to trust people who resemble us and to believe their choices are relevant to ours. This is exactly where UGC succeeds: it shows real people, in real situations, making real choices — and that resonates at a psychological level.",
        },
      },
      {
        type: "h2",
        id: "kamp-atesi-gopro",
        text: {
          tr: "Kürsüden kamp ateşine: GoPro örneği",
          en: "From the podium to the campfire: the GoPro example",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Geçmişte markalar kürsüden konuşurdu — parlak, mükemmel ve mesafeli. UGC'yi benimseyen markalar sahneden iniyor, kitleleriyle kamp ateşinin başına oturuyor ve konuştukları kadar dinliyorlar.",
          en: "Brands used to speak from a podium — polished, perfect and distant. Brands that embrace UGC step off the stage, sit down at the campfire with their audience, and listen as much as they speak.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yaklaşımda ustalaşmış şirket GoPro'dur. Daha emekleme aşamasındayken kendini bir \"kamera markası\" olarak pazarlamadı; kullanıcılarının yakaladığı macera dolu anları sergileyen bir hikâye platformu oldu. Hava dalışından sörfe, aile toplantılarına kadar her kullanıcı içeriği yalnız bir onay değil, bir hikâye ve topluluğa katılma davetiydi. GoPro kullanıcılarını paylaşmaya aktif teşvik etti, en iyi içerikler için yarışmalar düzenledi. Kitle izlemiyordu — katılıyordu.",
          en: "The company that mastered this approach is GoPro. Even in its infancy it didn't market itself as a \"camera brand\"; it became a storytelling platform showcasing the adventurous moments its users captured. From skydiving to surfing to family gatherings, every piece of user content was not just an endorsement but a story and an invitation to join a community. GoPro actively encouraged sharing and ran contests for the best content. The audience wasn't watching — it was participating.",
        },
      },
      {
        type: "h2",
        id: "sosyal-kanitla-guven",
        text: {
          tr: "Sosyal kanıtla güven inşa etmek",
          en: "Building trust through social proof",
        },
      },
      {
        type: "p",
        text: {
          tr: "Şu senaryoyu hayal edin: benzer ürünler sunan iki marka arasında karar veriyorsunuz. Birinin yüzlerce müşteri yorumu ve gerçek kullanıcı fotoğrafı var, diğerinde birkaç tane. İçgüdüsel olarak sosyal kanıtı çok olana yönelirsiniz — tesadüf değil, iş başındaki psikolojik ilke. Seçeneklerle bunalan kitleler için sosyal kanıt, karar yorgunluğunu hafifletir ve aranan güvenceyi verir.",
          en: "Picture this scenario: you're deciding between two brands with similar products. One has hundreds of customer reviews and real user photos; the other has a handful. Instinctively you lean toward the one with more social proof — not a coincidence but a psychological principle at work. For audiences overwhelmed by options, social proof eases decision fatigue and provides the reassurance they're looking for.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Hikâye odaklı referanslar: yıldız puanının ötesine geçin — ürünün bir hayatı nasıl etkilediğini anlatan ayrıntılı müşteri hikâyeleri kullanın.",
            en: "Story-driven testimonials: go beyond star ratings — use detailed customer stories that tell how the product affected a life.",
          },
          {
            tr: "Kullanıcı fotoğraf ve videoları: Instagram, TikTok ve YouTube'daki görsel hikâye anlatımı, ürünün gerçek bir yaşam tarzına nasıl oturduğunu gösterir.",
            en: "User photos and videos: visual storytelling on Instagram, TikTok and YouTube shows how the product fits a real lifestyle.",
          },
          {
            tr: "Mikro-influencer'lar: küçük ama yüksek etkileşimli kitleler, dev takipçili isimlerden daha ilişkilenebilir — niş topluluklar ve paylaşılan kimlik kurar.",
            en: "Micro-influencers: small but highly engaged audiences feel more relatable than mega-followings — they build niche communities and shared identity.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Airbnb'yi düşünün: pazarlamasını olanaklara veya fiyata değil, kullanıcı hikâyelerine kurar — dünyanın dört bir yanında benzersiz yerlerde yaşayan gezginlerin, ailelerin, yalnız maceracıların hikâyelerine. Gerçek yorumlar ve görsellerle potansiyel müşteriyi, başkalarının deneyimlerinin rehberliğinde kendi yolculuğunu hayal etmeye davet eder. Aynı mekanizmayı [GYMWOLVES vakasında](/vakalar/gymwolves-12-kat-satis) biz de kullandık: sporcular ve influencer'larla üretilen sosyal kanıt, üç ayda 12 kat satışın kaldıraçlarından biriydi.",
          en: "Think of Airbnb: it builds its marketing not on amenities or price but on user stories — travelers, families and solo adventurers living in unique places around the world. With real reviews and visuals it invites prospects to imagine their own journey guided by others' experiences. We used the same mechanism in [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis): social proof produced with athletes and influencers was one of the levers behind 12× sales in three months.",
        },
      },
      {
        type: "h2",
        id: "marka-dostlugu",
        text: {
          tr: "Markanızı ilişkilenebilir kılmak: \"marka dostluğu\"",
          en: "Making your brand relatable: \"brand friendship\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugünün pazarında markanın kimliksiz veya mesafeli olma lüksü yok. Kazanan markalar, birlikte kahve içmekten çekinmeyeceğiniz bir arkadaş gibi hissettirenler. \"Marka dostluğu\" profesyonellikten ödün vermek değildir; marka sesinin sıcak, ilişkilenebilir ve insani olmasıdır. Duolingo'yu düşünün: sosyal medyadaki esprili yaklaşımıyla, eğitici içerik sunarken bile davetkar bir kimlik kurdu — kullanıcıları ürüne değil, paylaşılan bir deneyime bağlı hisseden sadık bir topluluğa dönüştü.",
          en: "In today's market no brand can afford to be faceless or distant. The winning brands feel like a friend you wouldn't hesitate to grab a coffee with. \"Brand friendship\" is not a compromise on professionalism; it's a brand voice that is warm, relatable and human. Think of Duolingo: with its witty social media approach it built an inviting identity even while delivering educational content — its users became a loyal community attached not to a product but to a shared experience.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Gündelik, dostça bir dil kullanın: doğrudan bir arkadaşınızla konuşur gibi yazın — kurumsal jargon yerine net, samimi cümleler.",
            en: "Use casual, friendly language: write as if talking directly to a friend — clear, sincere sentences instead of corporate jargon.",
          },
          {
            tr: "Kamera arkasını gösterin: ekip, süreç ve günlük operasyondan kesitler engelleri yıkar; müşteri markanın arkasındaki insanları görür.",
            en: "Show behind the scenes: glimpses of the team, the process and daily operations break down walls; customers see the people behind the brand.",
          },
          {
            tr: "Sohbete katılın: yorumlara yanıt verin, soru sorun, tartışmayı teşvik edin — her etkileşim bir işlem değil, ilişki kurma fırsatıdır.",
            en: "Join the conversation: reply to comments, ask questions, invite discussion — every interaction is a chance to build a relationship, not a transaction.",
          },
        ],
      },
      {
        type: "h2",
        id: "ai-caginda-sahicilik",
        text: {
          tr: "2026 notu: AI çağında sahicilik",
          en: "2026 note: authenticity in the AI age",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazının ilk halinden bu yana üretken AI, içerik üretimini sınırsızlaştırdı — ve UGC'nin değerini beklenmedik bir yönden katladı. AI her şeyi üretebilir; üretemediği tek şey \"benim gibi biri\"dir. Kitleler sentetik içeriği ayırt etmeyi hızla öğrendi ve AI avatarlarla çekilmiş sahte-UGC denemeleri, yakalandığı anda markaya sahicilik borcu olarak geri döndü. Ders net: UGC'nin gücü formatında değil, gerçekliğindedir — kamera kalitesi düşük olabilir, güven yüksek olmalı.",
          en: "Since this article's first version, generative AI has made content production unlimited — and multiplied UGC's value from an unexpected direction. AI can produce anything; the one thing it cannot produce is \"someone like me\". Audiences quickly learned to spot synthetic content, and fake-UGC experiments shot with AI avatars came back as an authenticity debt the moment they were caught. The lesson is clear: UGC's power lies not in its format but in its truth — the camera quality can be low; the trust must be high.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkinci gelişme: sosyal kanıt artık AI motorlarına da konuşuyor. İnsanlar \"X ürünü iyi mi?\" sorusunu ChatGPT'ye ve Perplexity'ye soruyor; bu motorlar da cevabı gerçek kullanıcı yorumlarından, tartışmalardan ve bağımsız içerikten damıtıyor. Hakkında sahici konuşulan marka, AI cevaplarında da güvenle anılıyor. [OdorGo kampanyasında](/vakalar/odorgo-kategori-yaratma) reklam filmlerinden doğan kullanıcı içerikleri tam bu yüzden kampanyanın medya bütçesine dönüştü — sahicilik, hem insana hem motora aynı dilden konuşur.",
          en: "The second development: social proof now speaks to AI engines too. People ask ChatGPT and Perplexity \"is product X any good?\", and those engines distill their answers from real user reviews, discussions and independent content. A brand spoken about sincerely gets cited with confidence in AI answers as well. In [the OdorGo campaign](/vakalar/odorgo-kategori-yaratma) the user content born from the commercials became the campaign's media budget for exactly this reason — authenticity speaks the same language to humans and to engines.",
        },
      },
      {
        type: "h2",
        id: "markaniz-icin-dokuz-soru",
        text: {
          tr: "Markanız için dokuz soru",
          en: "Nine questions for your brand",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Kitlemizin kendi hikâyelerini paylaşması için hangi fırsatları yaratabiliriz?",
            en: "What opportunities can we create for our audience to share their own stories?",
          },
          {
            tr: "Ne tür içerikler markamızı daha kişisel ve ilişkilenebilir kılar?",
            en: "What kinds of content make our brand feel more personal and relatable?",
          },
          {
            tr: "Hangi sosyal kanıt türü ürünümüzle en iyi uyumu sağlar?",
            en: "Which type of social proof fits our product best?",
          },
          {
            tr: "Sosyal kanıtı duygusal bağ kuracak şekilde nasıl toplar, düzenler ve sunarız?",
            en: "How do we collect, curate and present social proof so it builds emotional connection?",
          },
          {
            tr: "Kitlemizin bu kanıtı görmesi için en etkili platformlar hangileri?",
            en: "Which platforms are most effective for our audience to see that proof?",
          },
          {
            tr: "Profesyonellikten ödün vermeden iletişimimizi nasıl daha ulaşılabilir kılarız?",
            en: "How do we make our communication more approachable without compromising professionalism?",
          },
          {
            tr: "Hangi kamera arkası hikâyeleri kitlemizi markaya yaklaştırır?",
            en: "Which behind-the-scenes stories bring our audience closer to the brand?",
          },
          {
            tr: "Kitlemizin karşısına yalnız bir işletme olarak değil, onları önemseyen bir marka olarak hangi yollarla çıkarız?",
            en: "In what ways do we show up not just as a business but as a brand that cares?",
          },
          {
            tr: "Ve en önemlisi: kitlemizi kamp ateşinin başına davet etmeye hazır mıyız?",
            en: "And most importantly: are we ready to invite our audience to the campfire?",
          },
        ],
      },
      {
        type: "h2",
        id: "kalici-bag-kurmak",
        text: {
          tr: "Sonuç: kalıcı bağ kurmak",
          en: "Conclusion: building a lasting bond",
        },
      },
      {
        type: "p",
        text: {
          tr: "UGC ve sosyal kanıt, içerik stratejisindeki dönüşümün merkezinde. Müşterisini dinleyen, paylaşan ve onunla arkadaş gibi bağ kuran markalar; pasif tüketicilerden değil, sadık savunuculardan oluşan bir topluluk kazanıyor. Markanızın mesajı şu olsun: sizi görüyoruz, sizi duyuyoruz ve sizinle birlikte büyümek için buradayız. Markalar ve kitleler arkadaş olarak bağ kurduğunda pazarlama yalnız başarılı olmaz — anlamlı hale gelir.",
          en: "UGC and social proof sit at the center of the transformation in content strategy. Brands that listen to their customers, share with them and bond with them like friends earn a community of loyal advocates rather than passive consumers. Let your brand's message be: we see you, we hear you, and we're here to grow with you. When brands and audiences bond as friends, marketing doesn't just succeed — it becomes meaningful.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pazarlama bilginizi tamamlamak veya reklam stratejinizi yeniden düşünmek için [tüm yazılarımıza](/yazilar) göz atabilirsiniz.",
          en: "To round out your marketing knowledge or rethink your ad strategy, browse [all our articles](/yazilar).",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "UGC (kullanıcı tarafından oluşturulan içerik) nedir?",
          en: "What is UGC (user-generated content)?",
        },
        answer: {
          tr: "Markanın değil, gerçek kullanıcıların ürettiği içeriktir: paket açılış videoları, yorumlar, fotoğraflar, deneyim hikâyeleri. Gücü prodüksiyon kalitesinden değil sahiciliğinden gelir — izleyen kişi ekranda kendine benzeyen birini görür ve \"benim gibi\" önyargısı devreye girer.",
          en: "Content produced by real users rather than the brand: unboxing videos, reviews, photos, experience stories. Its power comes from authenticity, not production quality — the viewer sees someone like themselves on screen, and the \"like-me\" bias kicks in.",
        },
      },
      {
        question: {
          tr: "UGC geleneksel içeriğin yerini tutar mı?",
          en: "Does UGC replace traditional content?",
        },
        answer: {
          tr: "Hayır — ikisi farklı iş görür. Profesyonel içerik marka güvenilirliğini ve kaliteyi kurar; UGC bu yapının üzerine özgünlük katmanını ekler. Yalnız cilalı içerik mesafeli, yalnız UGC ise otoritesiz kalır. Doğru strateji ikisini birlikte çalıştırır.",
          en: "No — they do different jobs. Professional content builds brand credibility and quality; UGC adds the authenticity layer on top of that structure. Polished content alone feels distant; UGC alone lacks authority. The right strategy runs both together.",
        },
      },
      {
        question: {
          tr: "Sosyal kanıt neden bu kadar etkili?",
          en: "Why is social proof so effective?",
        },
        answer: {
          tr: "Çünkü nörolojik temeli var: başkalarının bir şeyi onayladığını gözlemlemek beynin ödül kimyasalı dopamini tetikler ve \"popüler olan güvenlidir\" içgüdüsünü harekete geçirir. Seçenek bolluğunda sosyal kanıt karar yorgunluğunu azaltır — yüzlerce yorumu olan ürün, içgüdüsel olarak daha az riskli hissettirir.",
          en: "Because it has a neurological basis: observing others endorse something triggers dopamine — the brain's reward chemical — and activates the instinct that what is popular is safe. Amid an abundance of options, social proof reduces decision fatigue — a product with hundreds of reviews instinctively feels less risky.",
        },
      },
      {
        question: {
          tr: "Küçük bir marka UGC'yi nasıl başlatır?",
          en: "How does a small brand get UGC started?",
        },
        answer: {
          tr: "İstemekle başlar: satın alma sonrası e-postayla deneyim paylaşımı rica edin, paketin içine paylaşımı davet eden küçük bir not koyun, en iyi içerikleri kendi kanallarınızda görünür kılın ve paylaşanı ödüllendirin (yarışma, tekrar paylaşım, indirim). İlk on sahici içerik, yüz cilalı gönderiden daha fazla güven üretir.",
          en: "It starts with asking: request an experience share in the post-purchase email, put a small note inviting sharing inside the package, feature the best content on your own channels and reward contributors (contests, reshares, discounts). The first ten authentic pieces produce more trust than a hundred polished posts.",
        },
      },
    ],
    category: "growth",
    tags: ["ugc", "sosyal-kanit", "noropazarlama"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-11-14",
    readingMinutes: 6,
  },
  {
    // Eski blogdan taşındı (2024-08-03). "8 soru" formatı yazının kimliği —
    // korundu; sorular 4 tematik h2 altında h3 olarak kuruldu, TOC şişmesin
    // diye. Her sorunun altına "cevapta ne aranacağı" eklendi. 2024'te anonim
    // anlatılan örnekler yayımlanmış vakalara bağlandı; 3. sorunun 2026 hali
    // ("AI'yı nerede kullanıyorsunuz, nerede kullanmıyorsunuz?") ayrı bölüm
    // oldu. Kırık "buraya tıklayın" CTA'sı kaldırıldı. TR slug eski URL ile aynı.
    slug: {
      tr: "dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru",
      en: "8-questions-to-ask-an-agency-before-you-sign",
    },
    title: {
      tr: "Sözleşmeyi imzalamadan önce ajansa sorulacak 8 soru",
      en: "8 questions to ask an agency before you sign",
    },
    excerpt: {
      tr: "Doğru ajans markanın rotasını değiştirir; yanlış ajans bütçeyi ve bir yılı götürür. Farkı ilk görüşmede görmenin bir yolu var: sekiz soru ve her birinin cevabında ne aranacağı.",
      en: "The right agency changes a brand's course; the wrong one costs you a budget and a year. There's a way to tell them apart in the first meeting: eight questions, and what to listen for in each answer.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 3 Ağustos 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: sekiz soru korundu, her sorunun altına \"cevapta ne aranacağı\" eklendi, 2024'te anonim anlattığım örnekler bugün sitede yayımlanan vakalarımıza bağlandı, üçüncü sorunun 2026 hali (\"AI'yı nerede kullanıyorsunuz, nerede kullanmıyorsunuz?\") ayrı bir bölüm olarak yazıldı ve dört soruluk bir SSS eklendi.",
      en: "First published on 3 August 2024. Revised on 23 August 2026: the eight questions were kept, each one now says what to listen for in the answer, the examples I once told anonymously are linked to the case studies published on this site, the 2026 version of the third question (\"where do you use AI, and where do you refuse to?\") became its own section, and a four-question FAQ was added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Ajans seçmek, seyrüsefer uzmanı seçmeye benzer. Rotayı siz çiziyorsunuz; ama pusulayı okuyan, akıntıyı hesaplayan ve fırtına bastırdığında dümeni hangi tarafa kıracağını bilen kişi o. Bir CMO, pazarlama müdürü, girişimci ya da işletme sahibi olarak riski zaten biliyorsunuz: doğru ajans markanın gidişatını değiştirir, yanlış olanı bütçeyi ve bir yılı götürür.",
          en: "Choosing an agency is like choosing a navigator. You set the course; but the one who reads the compass, calculates the current and knows which way to turn the wheel when the storm hits is them. As a CMO, marketing director, founder or business owner you already know the stakes: the right agency changes a brand's course, the wrong one costs you a budget and a year.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Zor olan seçmek değil, ayırt etmek. Sunum dosyaları birbirine benziyor. Referans listeleri birbirine benziyor. İlk görüşmedeki cümleler bile birbirine benziyor. Ayrım, ajansın verdiği ilk cevapta değil, o cevabın bir kat altına inildiğinde ortaya çıkıyor.",
          en: "The hard part isn't choosing, it's telling them apart. The decks look alike. The client lists look alike. Even the sentences in the first meeting look alike. The difference doesn't show up in an agency's first answer — it shows up one layer beneath it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aşağıdaki sekiz soru bunun için var. Her birinin altına, verilen cevapta neyi aramanız gerektiğini de yazdım. Çünkü asıl bilgi soruda değil, ajansın nerede duraksadığında saklı.",
          en: "That's what the following eight questions are for. Under each one I've also written what to listen for in the answer — because the real information isn't in the question, it's in where the agency hesitates.",
        },
      },
      {
        type: "h2",
        id: "sekiz-soru-tek-bakista",
        text: {
          tr: "Sekiz soru, tek bakışta",
          en: "The eight questions at a glance",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Karar verirken veriyi ve ölçümü nasıl kullanıyorsunuz?",
            en: "How do you use data and measurement when you make decisions?",
          },
          {
            tr: "Hangi hedef kitle içgörülerine sahipsiniz ve bunlar stratejiyi nasıl değiştiriyor?",
            en: "What audience insights do you hold, and how do they change the strategy?",
          },
          {
            tr: "Yapay zekayı nerede kullanıyorsunuz ve uzun vadeli planınız ne?",
            en: "Where do you use AI, and what's your long-term plan for it?",
          },
          {
            tr: "Çok kanallı pazarlamaya nasıl yaklaşıyorsunuz?",
            en: "How do you approach multi-channel marketing?",
          },
          {
            tr: "Başarıyı nasıl ölçüyor, sonucu nasıl raporluyorsunuz?",
            en: "How do you measure success and report the results?",
          },
          {
            tr: "Benzer ölçekte veya benzer sektörde deneyiminiz ne?",
            en: "What experience do you have at a similar scale or in a similar sector?",
          },
          {
            tr: "Yaratıcılığı ekipte nasıl besliyorsunuz?",
            en: "How do you keep creativity alive inside the team?",
          },
          {
            tr: "Kriz yönetimini ve acil durum planlamasını nasıl ele alıyorsunuz?",
            en: "How do you handle crisis management and contingency planning?",
          },
        ],
      },
      {
        type: "h2",
        id: "veri-ve-hedef-kitle",
        text: {
          tr: "Önce kanıt: veri ve hedef kitle",
          en: "First, evidence: data and audience",
        },
      },
      {
        type: "h3",
        text: {
          tr: "1. Karar verirken veriyi ve ölçümü nasıl kullanıyorsunuz?",
          en: "1. How do you use data and measurement when you make decisions?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Uzun bir sefere çıkmak üzeresiniz. Tahmine değil, hassas haritaya ve düzgün çalışan bir cihaza güvenen bir seyrüsefer uzmanı istemez miydiniz? Pazarlamada o cihaz veridir. Ajansın tahmine dayalı analitikten gerçek zamanlı kampanya optimizasyonuna kadar net bir yaklaşımı olmalı — ve bu yaklaşım sizin işinize göre uyarlanmış olmalı, sunumda hazır duran genel bir şema değil.",
          en: "You're about to set out on a long voyage. Wouldn't you want a navigator who trusts a precise chart and a working instrument rather than a guess? In marketing, that instrument is data. The agency should have a clear approach from predictive analytics to real-time campaign optimization — and that approach should be shaped around your business, not a generic diagram already sitting in the deck.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir keresinde, önceki ajansı verilere değil büyük ölçüde sezgiye dayanan bir müşteriyle çalıştım; sonuç, beklenen netlikte sonuç vermeyen kampanyalardı. Veri odaklı bir ajansa geçtikten sonra altı ay içinde yatırım getirisinde yüzde kırklık bir artış gördüler. Bizim tarafımızdaki en açık örnek [SOYLU AVM](/vakalar/soylu-avm-e-ticaret-buyume): kampanyadan önce piksel ve dönüşüm izleme sıfırdan kuruldu, altı günde 1,5 milyon dolarlık sonucu mümkün kılan şey önce ölçümün onarılmasıydı.",
          en: "I once worked with a client whose previous agency ran largely on intuition rather than data; the result was campaigns that never reached the clarity expected of them. After moving to a data-driven agency, they saw a forty percent lift in return on investment within six months. The clearest example on our side is [SOYLU AVM](/vakalar/soylu-avm-e-ticaret-buyume): pixels and conversion tracking were rebuilt from scratch before the campaign, and what made the $1.5M-in-six-days result possible was repairing measurement first.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta şunu arayın: ajans hangi veriyi nereden okuduğunu, hangi kararı hangi eşikte değiştirdiğini somut anlatabiliyor mu? \"Veriyle çalışıyoruz\" cümlesi tek başına bir taahhüt değil, bir nezaket ifadesidir.",
          en: "Listen for this: can the agency tell you concretely which data it reads, where it reads it from, and which decision changes at which threshold? \"We work with data\" on its own isn't a commitment, it's a courtesy.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "2. Hangi hedef kitle içgörülerine sahipsiniz ve bunlar stratejiyi nasıl değiştiriyor?",
          en: "2. What audience insights do you hold, and how do they change the strategy?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Hedef kitleyi anlamak, denize açılmadan önce gelgiti ve akıntıyı bilmek gibidir. Ajansa hedef kitle analizinde ne yaptığını değil, o analizin hangi cümleyi, hangi görseli, hangi kanal kararını değiştirdiğini sorun. Geçmiş performans verisini stratejiyi iyileştirmek için nasıl kullandıklarını gösterebilmeliler.",
          en: "Understanding your audience is like knowing the tide and the current before you leave port. Don't ask the agency what it does in audience analysis — ask which sentence, which visual, which channel decision that analysis changed. They should be able to show how past performance data feeds back into the strategy.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Lüks bir perakendeci olan eski bir müşterim tam bu noktada zorlanıyordu; yerelleştirilmiş kitle içgörüsünde iyi olan bir ajansla çalışmaya başlayınca farklı pazarlarda etkileşim ve satış belirgin biçimde arttı. Aynı mantığın bizdeki karşılığı [Feruza Elegance](/vakalar/feruza-luks-perakende-anlasmasi): klasik çizgiden modern-lüks kimliğe taşınan marka, kitlesi yeniden tanımlandığı için Türkiye'nin tanınmış butik perakende zincirlerinden birinin raflarına girdi.",
          en: "A former client of mine, a luxury retailer, struggled at exactly this point; once they started working with an agency strong in localized audience insight, engagement and sales rose markedly across markets. Our own version of that logic is [Feruza Elegance](/vakalar/feruza-luks-perakende-anlasmasi): repositioned from a classic line to a modern-luxury identity, the brand reached the shelves of one of Türkiye's best-known boutique retail chains precisely because its audience was redefined first.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta şunu arayın: ajans kitleyi demografiyle mi tarif ediyor, davranışla mı? \"25-45 yaş, kadın, büyükşehir\" bir hedefleme ayarıdır. \"Satın almadan önce üç kez fiyat karşılaştırıp yorum okuyor\" bir içgörüdür.",
          en: "Listen for this: does the agency describe the audience by demographics or by behavior? \"Women, 25-45, metro areas\" is a targeting setting. \"They compare prices three times and read reviews before buying\" is an insight.",
        },
      },
      {
        type: "h2",
        id: "yapay-zeka-ve-kanallar",
        text: {
          tr: "Sonra makine: yapay zeka ve kanal bütünlüğü",
          en: "Then the machine: AI and channel coherence",
        },
      },
      {
        type: "h3",
        text: {
          tr: "3. Yapay zekayı nerede kullanıyorsunuz ve uzun vadeli planınız ne?",
          en: "3. Where do you use AI, and what's your long-term plan for it?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka stratejinin, uygulamanın ve optimizasyonun her katmanına girdi; ajansın hem bugün hem önümüzdeki iki yıl için net bir çerçevesi olmalı. Bir danışmanlık projesinde, müşteri segmentasyonu ve kişiselleştirme için yapay zekayı işin içine gömen bir ajans gözlemledim: hedefleme isabeti arttı, müşteri deneyimi düzeldi, dönüşüm oranı bunu takip etti.",
          en: "AI has entered every layer of strategy, execution and optimization; the agency should have a clear framework both for today and for the next two years. On one consulting project I watched an agency embed AI into customer segmentation and personalization: targeting accuracy improved, the customer experience improved, and the conversion rate followed.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu soru 2024'te yeterliydi. 2026'da yeterli değil — nedenini aşağıda ayrı bir bölümde anlattım, çünkü artık ayrım \"kullanıyor musunuz\"da değil.",
          en: "In 2024 this question was enough. In 2026 it isn't — I've explained why in a separate section below, because the dividing line is no longer \"do you use it\".",
        },
      },
      {
        type: "h3",
        text: {
          tr: "4. Çok kanallı pazarlamaya nasıl yaklaşıyorsunuz?",
          en: "4. How do you approach multi-channel marketing?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Başarılı bir sefer, farklı cihazların birbirini doğrulamasıyla yürür. Pazarlamada da öyle: sosyal medya, e-posta, arama ve görüntülü reklam ayrı ayrı iyi olabilir ama birbirini tanımıyorsa toplam sıfırdır. Ajansa kanalların hangi noktada birbirine veri verdiğini sorun.",
          en: "A successful voyage runs on instruments that confirm one another. Marketing is the same: social, email, search and display can each be good on their own, but if they don't know about each other the sum is zero. Ask the agency at which point the channels hand data to one another.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Orta ölçekli bir e-ticaret müşterim tam bu kopuklukla boğuşuyordu; yeni ajansı bütünleşik bir kanal stratejisi kurdu ve müşteriyi elde tutma oranı yüzde yirmi beş arttı. Bizim tarafımızda aynı bütünlüğün sonucu [GYMWOLVES](/vakalar/gymwolves-12-kat-satis): veri akışı onarıldı, huni yeniden kuruldu, kampanya sosyal kanıtla beslendi ve satış üç ayda on iki katına çıktı.",
          en: "A mid-sized e-commerce client of mine was wrestling with exactly this disconnect; their new agency built an integrated channel strategy and customer retention rose twenty-five percent. On our side, the result of that same coherence is [GYMWOLVES](/vakalar/gymwolves-12-kat-satis): the data flow was repaired, the funnel rebuilt, the campaign fed with social proof — and sales grew twelvefold in three months.",
        },
      },
      {
        type: "h2",
        id: "raporlama-ve-deneyim",
        text: {
          tr: "Sonra hesap: raporlama ve sektör deneyimi",
          en: "Then the ledger: reporting and sector experience",
        },
      },
      {
        type: "h3",
        text: {
          tr: "5. Başarıyı nasıl ölçüyor, sonucu nasıl raporluyorsunuz?",
          en: "5. How do you measure success and report the results?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Şeffaf raporlama, ajansın performansını değerlendirebilmenizin tek yoludur. Neyi takip ediyorlar? Hangi metriğe öncelik veriyorlar? Raporu ne sıklıkla ve hangi formatta alacaksınız? Kötü haber geldiğinde onu kim, ne zaman söylüyor?",
          en: "Transparent reporting is the only way you can assess an agency's performance. What do they track? Which metric takes priority? How often and in what format will you receive the report? And when bad news arrives, who tells you, and when?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Önceki ajansının belirsiz raporlamasından bıkmış bir müşterimi hatırlıyorum. Ayrıntılı ve eyleme dönüşebilir bulgular veren bir ajansla çalışmaya başladıklarında değişen şey rakamlar değildi — kararlardı. Ne olduğunu gördükleri anda ne yapacaklarını da bilir hale geldiler.",
          en: "I remember a client worn down by the vague reporting of their previous agency. When they moved to an agency that gave detailed, actionable findings, what changed wasn't the numbers — it was the decisions. The moment they could see what was happening, they knew what to do about it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta şunu arayın: raporun içinde ajansın kendi hatasını yazdığı bir bölüm var mı? Yalnız iyi haber taşıyan rapor, rapor değildir.",
          en: "Listen for this: is there a section in the report where the agency writes down its own mistakes? A report that carries only good news isn't a report.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "6. Benzer ölçekte veya benzer sektörde deneyiminiz ne?",
          en: "6. What experience do you have at a similar scale or in a similar sector?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Deneyim, tanıdık sularda gezinmeyi kolaylaştırır. Bir fintech girişimi olan müşterim, finans tarafını derinlemesine bilen bir ajansla çalışmaktan çok kazandı; sektöre özgü kısıtları baştan bilmek strateji süresini yarıya indirdi. Derinliğin ne demek olduğunu bizde en iyi anlatan iş [İstanbul Ortez Protez](/vakalar/istanbul-ortez-protez-arama-gorunurlugu): hastanın nasıl arama yaptığını anlamadan yazılan hiçbir sayfa ilk üçe çıkmıyordu; anlaşıldığında ayda on yeni hasta başvurusu geldi.",
          en: "Experience makes familiar waters easier to navigate. A fintech startup I worked with gained a great deal from an agency that knew finance deeply; knowing the sector's constraints up front halved the time spent on strategy. The work that best shows what depth means for us is [İstanbul Ortez Protez](/vakalar/istanbul-ortez-protez-arama-gorunurlugu): no page written without understanding how a patient actually searches was reaching the top three — once that was understood, ten new patient enquiries arrived per month.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta şunu arayın: ajans sizin sektörünüzü bilmiyorsa bunu söylüyor mu, yoksa \"her sektörde çalışırız\" mı diyor? İkincisi çoğu zaman doğrudur ama tek başına söylendiğinde bir şey ifade etmez. Bilmediğini söyleyen ve nasıl öğreneceğini anlatan ajans, her şeyi bildiğini söyleyenden daha güvenlidir.",
          en: "Listen for this: if the agency doesn't know your sector, does it say so — or does it say \"we work in every sector\"? The latter is often true but means nothing on its own. An agency that admits what it doesn't know and explains how it will learn is safer than one that claims to know everything.",
        },
      },
      {
        type: "h2",
        id: "yaraticilik-ve-kriz",
        text: {
          tr: "En son karakter: yaratıcılık ve kriz anı",
          en: "Finally, character: creativity and the moment of crisis",
        },
      },
      {
        type: "h3",
        text: {
          tr: "7. Yaratıcılığı ekipte nasıl besliyorsunuz?",
          en: "7. How do you keep creativity alive inside the team?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yaratıcılık, gemiyi ileri iten rüzgardır. Bir keresinde düzenli olarak yenilik atölyeleri ve hackathon düzenleyen bir ajansla çalıştım; o kültür, brief'te olmayan fikirleri ortaya çıkardı. Sorun şu ki yaratıcılık bir sunum başlığı olarak kolayca taklit edilir. Bu yüzden soruyu takvime bağlayın: son üç ayda ekip hangi denemeyi yaptı, hangisi tutmadı, ondan ne çıktı?",
          en: "Creativity is the wind that pushes the ship forward. I once worked with an agency that ran innovation workshops and hackathons on a regular cadence; that culture surfaced ideas the brief never asked for. The trouble is that creativity is easy to imitate as a slide title. So tie the question to a calendar: in the last three months, what did the team try, what failed, and what came out of it?",
        },
      },
      {
        type: "h3",
        text: {
          tr: "8. Kriz yönetimini ve acil durum planlamasını nasıl ele alıyorsunuz?",
          en: "8. How do you handle crisis management and contingency planning?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Her sefer bir noktada sert denizle karşılaşır. Ciddi bir itibar kriziyle karşılaşan bir müşterimi hatırlıyorum: ajansın hızlı ve soğukkanlı müdahalesi durumu yönetmekle kalmadı, markanın şeffaflık tarafını güçlendiren bir ana dönüştürdü. Krizde ortaya çıkan şey ajansın yeteneği değil, refleksidir.",
          en: "Every voyage meets rough water at some point. I remember a client facing a serious reputation crisis: the agency's fast, level-headed response didn't just manage the situation, it turned it into a moment that strengthened the brand's transparency. What a crisis reveals isn't an agency's talent, it's its reflex.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta şunu arayın: ajansın gece yarısı ulaşılabilen bir sorumlusu var mı, kim onay veriyor ve ilk yirmi dört saatte hangi adımlar sabittir? Kriz planı yazılı değilse yoktur.",
          en: "Listen for this: does the agency have someone reachable at midnight, who signs off, and which steps are fixed in the first twenty-four hours? If the crisis plan isn't written down, it doesn't exist.",
        },
      },
      {
        type: "h2",
        id: "2026-guncellemesi-ai-sorusu",
        text: {
          tr: "2026 güncellemesi: AI'yı nasıl kullanıyorsunuz?",
          en: "2026 update: how do you use AI?",
        },
      },
      {
        type: "p",
        text: {
          tr: "2024'te üçüncü soru bir ayrıştırıcıydı: \"Yapay zeka kullanıyor musunuz?\" diye sorduğunuzda odadaki ajansların yarısı duraksıyordu. Bugün kimse duraksamıyor. Herkes kullanıyor, herkes kullandığını söylüyor ve bu yüzden soru artık hiçbir şey ayırt etmiyor. 2026'da ajansa sorulacak yeni soru şu: AI'yı nerede kullanıyorsunuz — ve nerede kullanmıyorsunuz?",
          en: "In 2024 the third question was a separator: ask \"do you use AI?\" and half the agencies in the room would pause. Today nobody pauses. Everyone uses it, everyone says so, and that's exactly why the question no longer separates anything. The new question to ask an agency in 2026 is this: where do you use AI — and where do you refuse to?",
        },
      },
      {
        type: "quote",
        text: {
          tr: "AI'yı üretimde kullanan ajansla stratejide kullanan ajans aynı şey değildir. İlkinden hız alırsınız, ikincisinden ortalama.",
          en: "An agency that uses AI in production is not the same as one that uses it in strategy. The first gives you speed; the second gives you the average.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ayrım şurada: AI görseli hızlandırabilir, metnin ilk taslağını çıkarabilir, kampanya verisini saatler yerine dakikalarda tarayabilir. Bunlar üretim işleridir ve hızlanmaları iyidir. Ama markanın hangi kategoride oynayacağı, hangi müşteriden vazgeçeceği, hangi fiyat konumunu savunacağı — bunlar üretim değil karardır. Bu kararları modele devreden ajans, size rakiplerinizin ortalamasını satar.",
          en: "Here's the dividing line: AI can speed up a visual, draft the first version of a text, scan campaign data in minutes instead of hours. Those are production tasks, and speeding them up is good. But which category a brand plays in, which customer it walks away from, which price position it defends — those aren't production, they're decisions. An agency that hands those decisions to a model is selling you the average of your competitors.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İki işimiz bu ayrımı yan yana gösteriyor. [Meccanotecnica Umbra](/vakalar/meccanotecnica-umbra-teklif-portali) için kurduğumuz AI teknik danışman, fabrikasını anlatan mühendise uygun salmastrayı çıkarıyor ve teklif talebi on katına çıktı — ama o danışmanın hangi soruyu sorup hangi ürünü önereceğini belirleyen mantığı mühendislerle birlikte biz kurduk. [OdorGo](/vakalar/odorgo-kategori-yaratma) tarafında ise iş tamamen kararla başladı: var olmayan bir kategoriyi yaratmak, hiçbir modelin veri setinde bulunmayan bir hamledir. Sekiz ayda 10 milyon TL ciro ve 10 milyonun üzerinde film izlenmesi, o kararın sonucudur.",
          en: "Two of our projects show this line side by side. The AI technical advisor we built for [Meccanotecnica Umbra](/vakalar/meccanotecnica-umbra-teklif-portali) works out the right seal for an engineer describing their plant, and quote requests rose tenfold — but the logic deciding which question it asks and which product it proposes was built by us, together with engineers. With [OdorGo](/vakalar/odorgo-kategori-yaratma) the work began with a decision instead: creating a category that didn't exist is a move no model has in its training data. The 10 million TL in revenue over eight months and more than 10 million video views are the result of that decision.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pratik testi şu: \"Son üç ayda AI'yı hangi işi hızlandırmak için kullandınız, ve hangi kararı bilerek insana bıraktınız?\" İkinci kısma cevap veremeyen ajans, size kendi süreçlerini değil, bir aracın çıktısını satıyor.",
          en: "The practical test: \"In the last three months, which task did you use AI to speed up — and which decision did you deliberately keep with a human?\" An agency that can't answer the second half is selling you a tool's output, not its own process.",
        },
      },
      {
        type: "h2",
        id: "sonuc-tedarikci-mi-ortak-mi",
        text: {
          tr: "Sonuç: tedarikçi mi, ortak mı?",
          en: "In closing: supplier or partner?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sekiz sorunun tamamı tek bir ayrımı ölçmek için var: karşınızdaki iş yapan bir tedarikçi mi, yoksa işin sonucundan sorumlu hisseden bir ortak mı? İyi ortakların ortak tarafı şudur:",
          en: "All eight questions exist to measure one distinction: is the party across the table a supplier who does work, or a partner who feels accountable for the outcome? Good partners share a few traits:",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Sizin özel kısıtlarınızı anlarlar — sektörü değil, sizin işinizi.",
            en: "They understand your specific constraints — not the sector, your business.",
          },
          {
            tr: "Veriden ve yapay zekadan yararlanır, ama kararı sahiplenirler.",
            en: "They draw on data and AI, but they own the decision.",
          },
          {
            tr: "Verinin ve gizliliğin sorumluluğunu ciddiye alırlar.",
            en: "They take responsibility for data and privacy seriously.",
          },
          {
            tr: "Yaratıcılığı brief'in dışına taşırlar.",
            en: "They carry creativity beyond the brief.",
          },
          {
            tr: "Krize hazırdırlar; planı görüşmede değil, dosyada dururlar.",
            en: "They're ready for a crisis; the plan lives in a file, not in a meeting.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bir not: bu sekiz soru genel ajans seçimi içindir. İşiniz e-ticaretse listeye platform, ödeme altyapısı ve entegrasyon soruları da biner — [yazılar bölümünde](/yazilar) gerçek bir e-ticaret ajansının neyi değiştirdiğini ayrı bir yazıda anlattım.",
          en: "One note: these eight questions are for choosing an agency in general. If your business is e-commerce, questions about platform, payment infrastructure and integrations sit on top of the list — in [the journal](/yazilar) I've written separately about what a real e-commerce agency changes.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu soruları bize de sorun. Rakamlı cevapları [vaka sayfalarımızda](/vakalar) açıkta duruyor; nasıl çalıştığımızı görmek isterseniz [performans pazarlama hizmetimiz](/hizmetler/performans-pazarlama) işin ilk adımını, yani denetimi anlatıyor.",
          en: "Ask us these questions too. The answers, with their numbers, sit in the open on [our case pages](/vakalar); and if you want to see how we work, [our performance marketing service](/hizmetler/performans-pazarlama) describes the first step of the job — the audit.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Ajansla mı çalışmalıyım, kendi ekibimi mi kurmalıyım?",
          en: "Should I work with an agency or build my own in-house team?",
        },
        answer: {
          tr: "Karar bütçeyle değil, ihtiyacın süresiyle verilir. Aynı işi her ay tekrarlıyorsanız (içerik üretimi, kampanya bakımı, müşteri hizmetleri) iç ekip zamanla ucuzlar. Buna karşılık ölçüm altyapısı kurmak, yeni bir kanala girmek, marka konumunu yeniden yazmak gibi bir kez yapılan ve uzmanlık yoğun işlerde ajans daha ucuzdur — çünkü o uzmanlığı yılın tamamı için istihdam etmezsiniz. Yaygın ve sağlıklı model karma olanıdır: strateji ve kurulum ajansta, günlük operasyon içeride. Ajansın işi kendini vazgeçilmez kılmak değil, ekibinizi çalışır hale getirmektir.",
          en: "The decision follows the duration of the need, not the budget. If you repeat the same work every month (content production, campaign upkeep, customer service), an in-house team gets cheaper over time. For one-off, expertise-heavy work — building measurement infrastructure, entering a new channel, rewriting a brand position — an agency is cheaper, because you don't employ that expertise for a full year. The common and healthy model is hybrid: strategy and setup at the agency, daily operations in-house. An agency's job is not to make itself indispensable but to get your team running.",
        },
      },
      {
        question: {
          tr: "Ajans görüşmesinde hangi kırmızı bayraklara dikkat etmeliyim?",
          en: "What red flags should I watch for in an agency meeting?",
        },
        answer: {
          tr: "Beş tanesi güvenilirdir. Bir: sonuç garantisi vermek (\"ilk ayda şu kadar satış\") — kimse pazarın davranışını garanti edemez. İki: işi anlamadan fiyat vermek. Üç: geçmiş işleri yalnızca görsel olarak göstermek, rakamı ve süreyi atlamak. Dört: sunumda çalışacak ekibi değil sadece kurucuları göstermek; işi kimin yapacağı sözleşmeden önce bilinmeli. Beş: \"neyi yapmazsınız?\" sorusuna cevap verememek. Buna bir de altıncısını ekleyin: hesapların, reklam paneli ve analitik mülkiyetinin kimde kalacağı sorusundan kaçınmak.",
          en: "Five are reliable. One: guaranteeing outcomes (\"this many sales in the first month\") — nobody can guarantee how a market behaves. Two: quoting a price before understanding the business. Three: showing past work only as visuals, skipping the numbers and the timeline. Four: presenting the founders rather than the team that will actually do the work; you should know who does the work before you sign. Five: being unable to answer \"what won't you do?\". Add a sixth: dodging the question of who ends up owning the accounts, the ad panels and the analytics.",
        },
      },
      {
        question: {
          tr: "Ajans sözleşmesinde neye dikkat etmeliyim?",
          en: "What should I look out for in an agency contract?",
        },
        answer: {
          tr: "Dört madde ötekilerden önemlidir. Mülkiyet: reklam hesapları, analitik mülkiyeti, alan adı, tasarım kaynak dosyaları ve kod sizin adınıza mı açılıyor? Kapsam: aylık hangi işin ne kadarı dahil, ek iş nasıl fiyatlanıyor? Çıkış: fesih bildirimi kaç gün, devir teslim neleri kapsıyor, hesap erişimleri hangi sürede aktarılıyor? Ölçüm: başarının tanımı sözleşmede yazıyor mu, yoksa sunumda mı kaldı? Bu dördü netse sözleşmenin geri kalanı büyük ölçüde standarttır.",
          en: "Four clauses matter more than the rest. Ownership: are ad accounts, analytics properties, the domain, design source files and code registered in your name? Scope: how much of what work is included monthly, and how is extra work priced? Exit: how many days of termination notice, what does handover cover, and how quickly are account accesses transferred? Measurement: is the definition of success written into the contract, or did it stay in the deck? If those four are clear, the rest of the contract is largely standard.",
        },
      },
      {
        question: {
          tr: "Ajans değiştirme zamanının geldiğini nasıl anlarım?",
          en: "How do I know it's time to change agencies?",
        },
        answer: {
          tr: "Üç sinyal birlikte geldiyse. Bir: raporlar üç ay üst üste aynı metrikleri aynı yorumla tekrar ediyor, öneri gelmiyor. İki: kötü haberi siz keşfediyorsunuz, ajans söylemiyor. Üç: yeni bir fikir sizden çıkıyor, ajans yalnızca uyguluyor. Tek başına düşen bir performans sebep değildir; sezon, pazar ve rekabet dalgalanır. Ama üç sinyal aynı çeyrekte varsa mesele kampanya değil ilişkidir. Değiştirmeden önce beklentiyi yazılı olarak yenileyin ve bir çeyrek daha bakın — çünkü ajans değişiminin bir devir maliyeti vardır: brief, erişimler ve öğrenme eğrisi sıfırdan başlar. Bu maliyeti plana koymadan karar vermeyin.",
          en: "When three signals arrive together. One: reports repeat the same metrics with the same commentary three months running, with no recommendations. Two: you discover the bad news yourself; the agency doesn't raise it. Three: new ideas come from you and the agency only executes. A single drop in performance isn't a reason — seasons, markets and competitors all fluctuate. But if all three signals appear in the same quarter, the issue is the relationship, not the campaign. Before switching, restate your expectations in writing and watch one more quarter — because changing agencies carries a handover cost: the brief, the access and the learning curve all restart from zero. Don't decide without putting that cost in the plan.",
        },
      },
    ],
    category: "growth",
    tags: ["ajans-secimi", "performans-pazarlama", "ai"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-08-03",
    readingMinutes: 9,
  },
  // Eski blogdan taşındı (indoles_eski/wp-icerik/yazilar/2026-web-tasarim-trendleri.md,
// 2025-12-04). "Buraya tıklayın" kırık CTA'ları ve ":)" suratları temizlendi;
// tekrarlanan hız/minimalizm anlatımları tek bölüme indirildi. Arama ve komut
// deneyimi trendi eklendi; örnekler SIM Baskı Malzemeleri ve Meccanotecnica
// Umbra vakalarına bağlandı. Yıl ortası gerçeklik kontrolü bölümü ve 4 soruluk
// SSS eklendi.
{
  slug: {
    tr: "2026-web-tasarim-trendleri",
    en: "2026-web-design-trends",
  },
  title: {
    tr: "2026 Web Tasarım Trendleri: Minimalizm, Hız ve Mobil Öncelik",
    en: "2026 Web Design Trends: Minimalism, Speed and Mobile-First",
  },
  excerpt: {
    tr: "Web siteniz reklam bütçenizi mi tüketiyor? Vitrini ışıl ışıl bir mağaza düşünün: kapı ağırsa müşteri içeri girmeden gider. 2026'nın ikinci yarısında web tasarımı da aynı kapı meselesi — hız, kod hijyeni ve mobil zorunluluk üzerine kuruluyor.",
    en: "Is your website draining your ad budget? Picture a dazzling storefront with a door too heavy to open — the customer leaves before ever stepping in. In the second half of 2026, web design faces the same door problem: it now rests on speed, code hygiene and mobile necessity.",
  },
  updatedAt: "2026-08-23",
  updateNote: {
    tr: "Bu yazı ilk olarak 4 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: yıl ortası gerçeklik kontrolü bölümü eklendi, tekrarlanan hız ve minimalizm anlatımları tek bölüme indirildi, arama ve komut deneyimi trendi eklendi, örnekler SIM Baskı Malzemeleri ve Meccanotecnica Umbra vakalarına bağlandı, kırık iç bağlantılar ve taslak kalıntıları temizlendi, dört soruluk SSS eklendi.",
    en: "First published on 4 December 2025. Revised on 23 August 2026: added a mid-year reality-check section, consolidated the repeated speed and minimalism narratives into one section, added the search-and-command-experience trend, tied the examples to our SIM Printing Suppliers and Meccanotecnica Umbra case studies, cleaned up broken internal links and leftover draft text, and added a four-question FAQ.",
  },
  blocks: [
    {
      type: "p",
      text: {
        tr: "Bir an için dijital dünyadan çıkın ve fiziksel bir mağaza hayal edin. Vitrin ışıl ışıl, içerideki ürünler harika, tabela caddenin en iyi noktasında parlıyor. Müşteri heyecanla kapıya yöneliyor, kolu indiriyor ama kapı o kadar ağır ki açılmıyor. Bir saniye, iki saniye, üç saniye… Müşteri zorluyor ama nafile; sonunda omuz silkip yandaki rakip mağazaya giriyor.",
        en: "For a moment, step out of the digital world and picture a physical store. The window display gleams, the products inside are excellent, the sign shines on the best spot of the street. A customer walks up eagerly, pulls the handle, but the door is so heavy it won't budge. One second, two, three… They push, it's no use, and with a shrug they walk into the rival store next door.",
      },
    },
    {
      type: "p",
      text: {
        tr: "İşte web sitenizin hızı — ya da yavaşlığı — o ağır kapıdır. Dijital vitrininiz bir sanat eseri gibi görünebilir; peki ya bir satış makinesi gibi çalışıyor mu?",
        en: "That's what your website's speed — or lack of it — is: the heavy door. Your digital storefront might look like a work of art. But does it work like a sales machine?",
      },
    },
    {
      type: "p",
      text: {
        tr: "2026'nın ikinci yarısına girerken \"iyi web tasarımı\" tanımı kökten değişti. Reklam bütçesi yöneten işletmeler ve büyüyen KOBİ'ler için web sitesi artık kurumsal bir kartvizit değil. Google'ın algoritmaları ve kullanıcıların milisaniyelerle ölçülen sabrı, tasarımın artık sadece \"göz zevki\" değil, doğrudan hız, teknik altyapı ve dönüşüm meselesi olduğunu kanıtlıyor. Bu yazıda, tasarım trendlerinin neden süslü animasyonlardan uzaklaşıp Core Web Vitals ve SEO odaklı minimalist bir yapıya evrildiğini; yavaş bir sitenin reklam bütçesini sessizce nasıl erittiğini ele alıyoruz.",
        en: "Heading into the second half of 2026, the definition of \"good web design\" has changed at the root. For businesses running ad budgets and for growing SMEs, a website is no longer a corporate business card. Google's algorithms and users' patience — now measured in milliseconds — prove that design is no longer just about \"eye appeal\"; it's directly about speed, technical foundation and conversion. This article looks at why design trends have moved away from ornate animation toward a minimalist structure built around Core Web Vitals and SEO, and how a slow site quietly drains an ad budget.",
      },
    },
    {
      type: "h2",
      id: "hiz-yeni-estetiktir",
      text: {
        tr: "Yeni minimalizm: hız, gerçek estetiktir",
        en: "The new minimalism: speed is the real aesthetic",
      },
    },
    {
      type: "p",
      text: {
        tr: "Minimalizm yıllardır tasarım gündeminde. Ama 2026 minimalizmi sadece beyaz alanı artırmak veya fontları sadeleştirmek değil; sitenin kod yükünü hafifleterek Google'ın performans metriklerine tam uyum sağlamak. Kreatif hizmetlerle yazılımın kesiştiği noktada basit bir gerçek yatıyor: hız, yeni estetiktir.",
        en: "Minimalism has been on the design agenda for years. But 2026's minimalism isn't just more white space or simpler fonts — it's lightening a site's code load so it fully aligns with Google's performance metrics. At the intersection of creative work and software sits a simple truth: speed is the new aesthetic.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Google, kullanıcı deneyimini üç metrikle ölçüyor: LCP, sayfanın ana içeriğinin ekrana geldiği anı işaretleyerek algılanan yükleme hızını gösterir; INP, sayfanın kullanıcı etkileşimlerine ne kadar hızlı yanıt verdiğini ölçer; CLS ise sayfa yüklenirken öğelerin ne kadar yerinden oynadığını, yani görsel kararlılığı gösterir. Görsel olarak büyüleyici ama yüklenmesi üç saniyeyi bulan bir site, Google botları tarafından hantal olarak etiketleniyor.",
        en: "Google measures user experience with three metrics: LCP marks the moment a page's main content appears, capturing perceived load speed; INP measures how quickly the page responds to user interaction; CLS tracks how much elements shift while the page loads — visual stability, in other words. A site that's visually stunning but takes three seconds to load gets tagged sluggish by Google's crawlers.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Tasarım sürecinde sorulması gereken tek soru şu: bu animasyon kullanıcının satın alma kararına mı hizmet ediyor, yoksa sunucuya yük mü bindiriyor? 2026'da kazanan tasarımlar, görsel yükü azaltılmış, temiz kod yapısına sahip ve kullanıcıyı hedefe — form ya da satış — en kısa yoldan taşıyan arayüzler.",
        en: "There's really one question worth asking during design: does this animation serve the user's buying decision, or is it just weight on the server? The interfaces winning in 2026 carry a lighter visual load, sit on clean code, and take the user to the goal — a form, a sale — by the shortest path.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Kullanıcılar artık estetik hazzı bekleme süresiyle takas etmiyor. Kısa video platformlarının çağında dikkat süreleri saniyenin altına inerken, yavaş yüklenen \"sanatsal\" bir site, kullanıcı için bozuk bir üründen farksız hale geliyor. Bir butona basıldığında sitenin \"düşünmesini\" bekleyen kimse yok — tepkinin anlık olmasını istiyorlar. Geciken her milisaniye markaya duyulan güveni zedeliyor. En güzel tasarım, kullanıcının varlığını hissetmediği tasarımdır; hız, tasarımın görünmez ama en güçlü makyajıdır.",
        en: "Users no longer trade aesthetic pleasure for wait time. In the age of short-video platforms, attention spans have dropped below a second, and a slow-loading \"artistic\" site starts to feel like a broken product. Nobody wants the site to \"think\" after they tap a button — they want the response to be instant. Every delayed millisecond chips away at trust in the brand. The best design is the one whose presence the user never feels; speed is design's invisible, most powerful makeup.",
      },
    },
    {
      type: "h2",
      id: "yavas-sitenin-faturasi",
      text: {
        tr: "Yavaş sitenin faturası: reklam bütçesi ve Google cezası",
        en: "The slow site's bill: ad budget and Google's penalty",
      },
    },
    {
      type: "p",
      text: {
        tr: "Performans pazarlama ekibiniz harika kampanyalar kurgulayabilir; web siteniz bu hıza ayak uyduramıyorsa bütçe boşa gidiyor demektir. Web tasarım performansı ile reklam maliyeti arasında doğrudan bir ilişki var ve bu ilişki iki yönden işliyor.",
        en: "Your performance marketing team can build brilliant campaigns; if your website can't keep pace, the budget is being wasted. There's a direct relationship between web design performance and ad cost, and it works two ways.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Birincisi kalite puanı. Google Ads, açılış sayfası yavaş açılan reklamların kalite puanını düşürür — bu da aynı sıralama için rakiplerinizden daha yüksek tıklama başına maliyet (CPC) ödemeniz anlamına gelir. İkincisi dönüşüm kaybı: Amazon verilerine göre, sayfa yüklemesindeki her 100 milisaniyelik gecikme satışlarda yüzde birlik bir kayba yol açıyor. Yüksek cirolu bir e-ticaret sitesi için bu, yıl sonunda devasa bir kayıp demek.",
        en: "First, quality score. Google Ads lowers the quality score of ads whose landing page loads slowly — which means paying a higher cost-per-click (CPC) than competitors for the same ranking. Second, lost conversions: according to Amazon's own data, every 100-millisecond delay in page load costs about 1% in sales. For a high-turnover e-commerce site, that adds up to a massive loss by year end.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Google, dijital dünyanın en katı yargıcı; duygusal karar vermez. Sitenizin ne kadar \"havalı\" göründüğüyle değil, kullanıcıyı ne kadar memnun ettiğiyle ilgilenir. LCP veya CLS skorları düşük bir site, Google'ın gözünde bozuk bir kullanıcı deneyimi sunuyor demektir — sonuç, arama sonuçlarında gerilere düşmek. Ve ceza organik tarafla sınırlı kalmıyor: yavaş sitelerin reklamlarını göstermek için Google daha yüksek CPC talep ediyor. Yani Core Web Vitals skorunuz kötüyse, rakiplerinizle aynı sonucu almak için daha fazla para harcıyorsunuz.",
        en: "Google is the digital world's strictest judge, and it doesn't make emotional calls. It doesn't care how \"cool\" your site looks — only how satisfied it leaves the user. A site with weak LCP or CLS scores is, in Google's eyes, delivering a broken experience, and the result is falling behind in search rankings. The penalty isn't confined to organic either: Google charges a higher CPC to show ads for slow sites. So if your Core Web Vitals scores are poor, you spend more money to get the same result as your competitors.",
      },
    },
    {
      type: "quote",
      text: {
        tr: "Yavaş bir web sitesine yüksek bütçeli reklam vermek, deposu delik bir spor arabaya benzin doldurmak gibidir: araç ne kadar güçlü olursa olsun, yakıtı tutamazsınız.",
        en: "Pouring a high ad budget into a slow website is like fueling a sports car with a leaking tank: however powerful the engine, you can't hold onto the fuel.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Bu çıtanın 2026'da neye benzediğini soyut bırakmayalım. [SIM Baskı Malzemeleri'nin sitesini](/vakalar/sim-baski-ihracat-icerigi) WordPress'ten beş dilli bir Next.js uygulamasına taşıdık; açılış süresi bir saniyenin altına indi ve yayın sonrasında da orada kaldı. Sonuç sadece hız değildi — altı ayda organik trafik 15 katına çıktı, AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı. Tasarım kararı burada teknik bir ayrıntı değildi; büyüme stratejisinin kendisiydi.",
        en: "Let's not leave that bar abstract. We moved [SIM Printing Suppliers' site](/vakalar/sim-baski-ihracat-icerigi) from WordPress to a five-language Next.js application; load time dropped under one second and stayed there after launch. The result wasn't just speed — organic traffic grew 15× in six months, and visibility in AI engines went from zero to 40,000. The design decision here wasn't a technical footnote; it was the growth strategy itself.",
      },
    },
    {
      type: "h2",
      id: "kod-hijyeni",
      text: {
        tr: "Kod hijyeni: sitenizin görünmeyen sağlık raporu",
        en: "Code hygiene: your site's invisible health report",
      },
    },
    {
      type: "p",
      text: {
        tr: "Minimalizm denince akla genelde bol beyaz alan ve sade fontlar gelir — bu işin vitrin kısmı. Asıl tehlike, bu sade görüntünün arkasına saklanan dijital obezitedir. Bir site ön yüzünde ne kadar sade görünürse görünsün, arka planda gereksiz JavaScript kütüphaneleri, optimize edilmemiş devasa görseller ve şişirilmiş hazır temalar taşıyorsa o site kirlidir.",
        en: "Minimalism usually brings to mind plenty of white space and simple fonts — that's the storefront of it. The real danger hides behind that plain surface: digital obesity. However clean a site looks up front, if it's carrying unnecessary JavaScript libraries, giant unoptimized images and a bloated off-the-shelf theme underneath, that site is dirty.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Görsel sadelik, kod yapısındaki sadelikle desteklenmediği sürece sadece makyajdır — ve makyaj aktığında (site yavaşladığında ya da çöktüğünde) altındaki kusurlar ortaya çıkar. Temiz kodlanmamış bir site gelecekte sürekli bakım maliyeti çıkarır; kod hijyeni, sitenizin sadece bugün hızlı çalışmasını değil, gelecekteki güncellemelere de kolayca adapte olmasını sağlar. Biz buna sürdürülebilir yazılım mimarisi diyoruz.",
        en: "Visual simplicity is only makeup unless it's backed by simplicity in the code — and when the makeup runs (the site slows down or crashes), the flaws underneath show. A site that isn't cleanly coded keeps generating maintenance costs down the line; code hygiene ensures not just that your site runs fast today, but that it adapts easily to whatever gets built on it tomorrow. We call that sustainable software architecture.",
      },
    },
    {
      type: "h2",
      id: "mobil-zorunlu-donem",
      text: {
        tr: "Mobil öncelikli değil, mobil zorunlu dönem",
        en: "Not mobile-first anymore — mobile-mandatory",
      },
    },
    {
      type: "p",
      text: {
        tr: "Yıllardır \"mobil öncelikli\" tasarımı konuşuyoruz. Ama 2026'da masaüstü artık mobilin bir uzantısı; trafiğin büyük çoğunluğu — birçok sektörde yüzde 80'i aşan bir payla — mobil cihazlardan geliyor. Bu dünyada tasarım süreçleri başparmak dostu navigasyon üzerine kurulmalı. Responsive tasarım artık yeterli değil — kullanıcının mobildeki davranış psikolojisi, masaüstünden tamamen farklı.",
        en: "We've talked about \"mobile-first\" design for years. But in 2026, desktop is the extension of mobile, not the other way around; the vast majority of traffic — well over 80% in many industries — arrives from mobile devices. In this world, design has to be built on thumb-friendly navigation from the start. Responsive design alone isn't enough anymore — user behavior on mobile is a different psychology from desktop, not a smaller version of it.",
      },
    },
    {
      type: "list",
      items: [
        {
          tr: "Sürtünmesiz deneyim: mobil ödeme ve form doldurma sürecindeki her fazladan adım, potansiyel müşteriyi kaybetme riskini artırır.",
          en: "Frictionless flow: every extra step in a mobile checkout or form raises the risk of losing the customer right there.",
        },
        {
          tr: "Mobil SEO: Google'ın indeksleme önceliği tamamen mobilde; masaüstünde harika görünen bir site mobilde yavaşsa arama sonuçlarında görünmez.",
          en: "Mobile SEO: Google's indexing priority is entirely mobile — a site that looks great on desktop but runs slow on mobile disappears from search results.",
        },
        {
          tr: "Başparmak bölgesi tasarımı: birincil eylemler (satın al, teklif iste, ara) ekranın alt yarısında, tek elle rahatça ulaşılabilecek noktada durmalı.",
          en: "Thumb-zone design: primary actions (buy, request a quote, call) should sit in the lower half of the screen, within easy reach of a single hand.",
        },
      ],
    },
    {
      type: "h2",
      id: "arama-ve-komut-deneyimi",
      text: {
        tr: "Fonksiyonel arayüzler: arama ve komut deneyimi",
        en: "Functional interfaces: search and command experience",
      },
    },
    {
      type: "p",
      text: {
        tr: "2026'nın bir başka trendi menüde değil, arama kutusunda gizli. Linear, Vercel veya Stripe gibi ürünlerin popülerleştirdiği komut paleti (command palette) deneyimi — bir kısayolla açılan, yazdıkça daralan arama katmanı — artık kurumsal ve teknik sitelerde de standart haline geliyor. Mantık basit: kullanıcı menüde gezinmek değil, aradığını doğrudan bulmak istiyor.",
        en: "Another 2026 trend hides not in the menu but in the search box. The command-palette experience — a search layer that opens with a keyboard shortcut and narrows as you type, popularized by products like Linear, Vercel and Stripe — is becoming standard on corporate and technical sites too. The logic is simple: users don't want to navigate a menu, they want to find what they're looking for directly.",
      },
    },
    {
      type: "p",
      text: {
        tr: "[Meccanotecnica Umbra Türkiye'nin teklif portalında](/vakalar/meccanotecnica-umbra-teklif-portali) bunu tam bu ihtiyaç için kurduk. Alıcı bir mühendis; kataloğu gezmek değil, kendi tesisine uygun salmastrayı saniyeler içinde bulmak istiyor. Komut paleti araması, ürün bulma akışını doğrudan teklif adımına bağladı — sonuç, teklif taleplerinde 10 kat artış oldu. Fonksiyonel güzellik dediğimiz şey tam olarak bu: kullanıcının varlığını hissetmediği, onu hedefine en kısa yoldan taşıyan arayüz.",
        en: "We built exactly this into [Meccanotecnica Umbra Türkiye's quote portal](/vakalar/meccanotecnica-umbra-teklif-portali). The buyer here is an engineer; they don't want to browse a catalog, they want to find the seal that fits their own plant in seconds. Command-palette search tied product discovery straight to the quote step — the result was a 10× increase in quote requests. That's what we mean by functional beauty: an interface whose presence you never feel, one that carries you to your goal by the shortest path.",
      },
    },
    {
      type: "h2",
      id: "yil-ortasi-gerceklik-kontrolu",
      text: {
        tr: "Yıl ortası gerçeklik kontrolü: 2026'nın ikinci yarısında ne değişti?",
        en: "Mid-year reality check: what changed in the second half of 2026?",
      },
    },
    {
      type: "p",
      text: {
        tr: "Bu yazıyı 2025'in sonunda yayımladık. Sekiz ay sonra, trendlerin çoğu yerinde duruyor — ama iki gözlem netleşti.",
        en: "We published this article at the end of 2025. Eight months on, most of the trends still hold — but two observations have sharpened.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Birincisi: hız artık bir \"trend\" değil, giriş bileti. 2025 sonunda \"üç saniyenin altı\" iddialı bir hedefti; 2026 ortasında rakip sitelerin çoğu zaten bu bandın altında ve fark milisaniyelerde ölçülüyor — kendi projelerimizde bir saniyenin altını hedefliyoruz, tesadüfen değil.",
        en: "First: speed is no longer a \"trend\" — it's the entry ticket. \"Under three seconds\" was an ambitious target at the end of 2025; by mid-2026 most competing sites are already under that bar, and the difference is measured in milliseconds — we chase sub-second loads on our own projects, and not by accident.",
      },
    },
    {
      type: "p",
      text: {
        tr: "İkincisi: minimalizmin kendisi bir risk haline geldi. AI destekli site oluşturucular aynı bileşen kütüphanelerinden, aynı font çiftlerinden, aynı beyaz alan formülünden üretim yaptıkça, \"temiz ve sade\" tasarım herkesin sitesi gibi görünmeye başladı. Performans zorunlu kaldı ama estetik ayrışma yeniden değerli hale geldi — hız artık bir farklılaşma noktası değil, bir hijyen faktörü; asıl fark, o hızlı altyapının üzerine neyi ve nasıl kurduğunuzda.",
        en: "Second: minimalism itself has become a risk. As AI-assisted site builders churn out sites from the same component libraries, the same font pairings, the same white-space formula, \"clean and simple\" design started looking like everyone else's site. Performance stayed mandatory, but aesthetic distinctiveness became valuable again — speed is no longer a point of differentiation, it's a hygiene factor; the real difference is what you build on top of that fast foundation, and how.",
      },
    },
    {
      type: "h2",
      id: "sonuc-yatirim-araci",
      text: {
        tr: "Sonuç: tasarımı yatırım aracı olarak görün",
        en: "Conclusion: treat design as an investment",
      },
    },
    {
      type: "p",
      text: {
        tr: "Evet, bir Ferrari her zaman güzel görünür. Ama saatte 300 kilometrenin üzerinde giderken daha da güzel görünür.",
        en: "Yes, a Ferrari always looks good. But it looks even better doing over 300 kilometers an hour.",
      },
    },
    {
      type: "p",
      text: {
        tr: "2026 web tasarım trendleri sadece göze hoş gelen renk paletleri veya modern fontlar değil. Trend; milisaniyelerle yarışan, SEO uyumlu, dönüşüm oranı yüksek ve reklam bütçesini koruyan stratejik bir altyapı inşası. İşletmenizi büyütmek istiyorsanız, web tasarımını \"görsel bir iş\" olarak görmeyi bırakıp performans ve teknoloji stratejinizin merkezine koymanız gerekiyor.",
        en: "2026's web design trends aren't just pleasing color palettes or modern fonts. The trend is building a strategic foundation that races against milliseconds, is SEO-aligned, converts well and protects the ad budget. If you want to grow the business, web design needs to stop being \"a visual job\" and move to the center of your performance and technology strategy.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Siteniz reklam bütçenizi destekliyor mu, yoksa tüketiyor mu? Cevabı bilmiyorsanız, [UI/UX tasarım hizmetimizle](/hizmetler/ui-ux-tasarim) başlayan bir teknik ve tasarım denetimi bunu netleştirir — ya da doğrudan [vaka çalışmalarımıza](/vakalar) göz atıp benzer ölçekteki bir markanın rakamlarını görün.",
        en: "Is your site supporting your ad budget, or draining it? If you don't know the answer, a technical and design audit starting with [our UI/UX design service](/hizmetler/ui-ux-tasarim) will make it clear — or go straight to [our case studies](/vakalar) and see the numbers from a brand at a similar scale.",
      },
    },
  ],
  faq: [
    {
      question: {
        tr: "2026'da web tasarımda en önemli trend ne?",
        en: "What's the most important web design trend in 2026?",
      },
      answer: {
        tr: "Tek bir trend yok, ama hepsinin ortak paydası performans. Core Web Vitals (LCP, INP, CLS) artık bir tavsiye değil eşik; görsel olarak en iyi site bile bu eşiği geçemiyorsa arama sonuçlarında ve reklam maliyetinde cezalandırılıyor. Bir saniyenin altına inen bir site, hem organik trafiği hem AI motorlarındaki görünürlüğü aynı anda büyütebiliyor — [SIM Baskı Malzemeleri vakamızda](/vakalar/sim-baski-ihracat-icerigi) olduğu gibi.",
        en: "There isn't one single trend — the common thread across all of them is performance. Core Web Vitals (LCP, INP, CLS) are no longer advice, they're a threshold; even the most visually striking site gets penalized in search rankings and ad cost if it can't clear that bar. A site that loads in under a second can grow both organic traffic and AI-engine visibility at the same time — as it did in [our SIM Printing Suppliers case](/vakalar/sim-baski-ihracat-icerigi).",
      },
    },
    {
      question: {
        tr: "Site yenileme ne zaman gerekir?",
        en: "When does a website actually need a redesign?",
      },
      answer: {
        tr: "Üç sinyal net: sayfa açılışı üç saniyeyi buluyorsa, mobilde masaüstünden gözle görülür biçimde kötü çalışıyorsa veya küçük bir içerik güncellemesi bile geliştirici müdahalesi gerektiriyorsa. Buna bir de iş tarafından bir sinyal ekleyin: site artık markanızın bugünkü konumunu yansıtmıyorsa, tasarım borcu teknik borçla birleşmiş demektir. Yenileme takvimi sektöre göre değişir; belirleyici olan bu sinyallerin kaçının aynı anda işaretli olduğudur.",
        en: "Three signals are clear: load time hits three seconds, mobile performs noticeably worse than desktop, or even a small content update needs a developer's help. Add one signal from the business side: if the site no longer reflects where your brand stands today, design debt has merged with technical debt. The timing varies by industry — what matters is how many of these signals are flagged at once.",
      },
    },
    {
      question: {
        tr: "Şablon tema mı özel tasarım mı?",
        en: "Template theme or custom design?",
      },
      answer: {
        tr: "İkisi de doğru cevap olabilir, koşula bağlı. Hazır bir tema, düşük trafikli ve standart ihtiyaçlı bir site için hızlı ve ucuzdur — ama şişirilmiş kod ve gereksiz eklenti riski taşır, bu da ileride hız ve bakım maliyetine dönüşür. Trafiği yüksek, dönüşümü kritik veya marka kimliği rakiplerden net biçimde ayrışması gereken bir site için özel tasarımın başlangıç maliyeti uzun vadede kendini öder. Karar trafik hacmine, büyüme hedefine ve markanın ne kadar farklılaşması gerektiğine göre verilir.",
        en: "Either can be the right answer, depending on the situation. A ready-made theme is fast and cheap for a low-traffic site with standard needs — but it carries the risk of bloated code and unnecessary plugins, which later turns into a speed and maintenance bill. For a site with high traffic, conversion-critical pages, or a brand identity that needs to stand clearly apart from competitors, a custom build's higher upfront cost pays for itself over time. The decision comes down to traffic volume, growth goals and how much the brand needs to differentiate.",
      },
    },
    {
      question: {
        tr: "2026 tasarım trendlerine uymak zorunda mıyım?",
        en: "Do I have to follow 2026's design trends?",
      },
      answer: {
        tr: "Hayır — ve bu net bir cevap. Performans ve erişilebilirlik temelli olanlar (hız, mobil uyum, okunabilirlik) evrensel bir zorunluluktur; bunlardan vazgeçmek doğrudan bir ceza getirir. Ama renk paleti, layout modası veya o ayın popüler animasyon tarzı gibi estetik trendler marka kimliğinizin önüne geçmemeli. Herkes aynı bileşen kütüphanesinden aynı \"temiz\" siteyi kurduğunda, trendi olduğu gibi takip etmek sizi rakiplerinizden ayırmaz — tam tersini yapar. Marka kimliği, trendden önce gelir.",
        en: "No — and that's a firm answer. The performance- and accessibility-based trends (speed, mobile fit, readability) are a universal requirement; skipping them brings a direct penalty. But aesthetic trends — a color palette, a layout fashion, this month's popular animation style — should never come before your brand identity. When everyone builds the same \"clean\" site from the same component library, following the trend as-is doesn't set you apart from competitors — it does the opposite. Brand identity comes before trend.",
      },
    },
  ],
  category: "growth",
  tags: ["web-tasarim", "core-web-vitals", "mobil-tasarim"],
  authorSlug: "burak-ozgul",
  publishedAt: "2025-12-04",
  readingMinutes: 8,
},
  {
    // Eski blogdan taşındı (2025-12-08). "2026 trendleri" yazısı 2026'nın
    // ağustosunda yeniden ele alındı: "yıl ortası gerçeklik kontrolü" bölümü
    // eklendi (hangi öngörü tuttu, hangisi hızlandı, hangisi yavaş kaldı).
    // Kırık "buraya tıklayın" CTA'ları vaka/hizmet bağlantılarına çevrildi;
    // Mehmet Bey anekdotu, delik kova metaforu ve espriler korundu.
    slug: {
      tr: "sadece-trafik-degil-ciro-isteyenler-icin-2026-performans-pazarlama-trendleri",
      en: "not-just-traffic-revenue-2026-performance-marketing-trends",
    },
    title: {
      tr: "Sadece trafik değil, ciro: 2026 performans pazarlama trendlerinin yıl ortası karnesi",
      en: "Not just traffic, revenue: a mid-year report card on 2026's performance marketing trends",
    },
    excerpt: {
      tr: "Aralık 2025'te tek bir tez kurmuştum: 2026'nın kazananı en çok trafiği alan değil, aldığı trafikten en çok ciroyu çıkaran olacak. Ağustos 2026 — tezin karnesi, delik kovanın matematiği ve kovayı tamir etme sırası.",
      en: "In December 2025 I made one claim: the winner of 2026 wouldn't be whoever bought the most traffic, but whoever squeezed the most revenue out of it. It's August 2026 — here's the report card, the math of the leaky bucket, and the order in which you fix it.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 8 Aralık 2025'te \"2026 trendleri\" başlığıyla yayımlandı. 23 Ağustos 2026'da yıl ortası gerçeklik kontrolüyle güncellendi: hangi öngörünün tuttuğunu, hangisinin beklediğimizden hızlı geldiğini ve hangisinin yavaş kaldığını anlatan yeni bir bölüm eklendi. Örnekler yayımlanmış vakalarımıza bağlandı, kırık bağlantılar temizlendi, dört soruluk SSS eklendi.",
      en: "First published on 8 December 2025 under the title \"2026 trends\". Revised on 23 August 2026 with a mid-year reality check: a new section on which prediction held, which arrived faster than expected and which lagged. The examples now link to our published case studies, broken links were cleaned up, and a four-question FAQ was added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Mehmet Bey'in her Pazartesi sabahı aynı ritüelle başlar: sert bir kahve ve karşısında parlayan e-ticaret yönetim paneli.",
          en: "Every Monday morning starts the same way for Mehmet: a strong coffee and the glow of an e-commerce dashboard.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ekrandaki sayılar ilk bakışta hipnotize edicidir. Hafta sonu boyunca kampanyalar çalışmış, site trafiği %20 artmıştır. Telefonuna düşen her \"yeni sipariş\" bildirimi beyninde küçük bir zafer yaratır. Ofiste hava iyidir: pazarlama ekibi lead sayılarını kutlar, depo paketleme telaşındadır.",
          en: "At first glance the numbers hypnotize. The campaigns ran all weekend, site traffic is up 20%. Every \"new order\" notification on his phone fires off a small victory in his brain. The mood in the office is good: marketing celebrates the lead count, the warehouse is buried in packing.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ay sonu gelip Mehmet Bey finans masasına oturduğunda o tatlı rüya yerini soğuk bir gerçeğe bırakır. Ciro artmıştır ama kârlılık yerinde saymaktadır. Reklam maliyetleri o kadar yükselmiştir ki kârın büyük kısmı Google'a ve Meta'ya geri ödenmiştir.",
          en: "Then the month ends, he sits down with finance, and the sweet dream turns into a cold fact. Revenue is up but profitability hasn't moved. Ad costs have climbed so high that most of the profit has been paid straight back to Google and Meta.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Mehmet Bey'in göremediği, daha doğrusu bakmayı unuttuğu yer şurası: işletmesi delik kova sendromu yaşıyor. Büyük bir eforla kovaya sürekli yeni su (yeni müşteri) taşıyor, ama kovanın altındaki deliklerden sızıp gideni (terk eden müşteriyi) fark etmiyor.",
          en: "What Mehmet can't see — or rather, forgot to look at — is this: his business has leaky bucket syndrome. He hauls fresh water into the bucket with enormous effort (new customers) while never noticing what seeps out of the holes underneath (the customers leaving).",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazıyı 2025'in aralık ayında \"2026 trendleri\" başlığıyla yazdım ve tek bir tez kurdum: 2026'nın kazananı en çok trafiği alan değil, aldığı trafikten en çok ciroyu çıkaran olacak. Şimdi ağustostayız. Tezi kontrol etme vakti geldi — önce kovayı, sonra karneyi konuşalım.",
          en: "I wrote this piece in December 2025 under the title \"2026 trends\", and I made exactly one claim: the winner of 2026 wouldn't be whoever bought the most traffic, but whoever squeezed the most revenue out of it. It's August now. Time to check the claim — first the bucket, then the report card.",
        },
      },
      {
        type: "h2",
        id: "delik-kova-sendromu",
        text: {
          tr: "Delik kova sendromu: neden hep \"daha fazla yeni müşteri\" istiyoruz?",
          en: "Leaky bucket syndrome: why do we always want \"more new customers\"?",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticaret yöneticilerinin bu tuzağa düşmesi tesadüf değil; tamamen insan psikolojisinin bir oyunu. Davranış biliminde buna hedonik adaptasyon diyoruz. Beynimiz yeni uyaranlara ve ödüllere büyük bir dopamin salgılar. Siteye gelen yeni bir ziyaretçinin ilk siparişi, işletme sahibi için heyecan kaynağıdır. Sizi zaten tanıyan sadık bir müşterinin sessiz ve düzenli alışverişi ise aynı heyecanı yaratmaz.",
          en: "It's no accident that e-commerce managers fall into this trap; it's a trick of human psychology. In behavioral science we call it hedonic adaptation. Our brains release a burst of dopamine for novel stimuli and rewards. A first-time visitor's first order thrills the business owner. The quiet, regular purchase of a loyal customer who already knows you produces nothing of the sort.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yüzden işletmeler içgüdüsel olarak avcı moduna girer: sürekli yeni avın peşinde koşarken elindeki çiftliği, yani mevcut müşteri tabanını kuraklığa terk eder. Oysa e-ticaretin acımasız matematiği şunu söyler:",
          en: "So businesses slip instinctively into hunter mode: forever chasing the next kill while leaving the farm they already own — the existing customer base — to the drought. Yet the brutal math of e-commerce says this:",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Ön kapıdan giren müşteriyi içeri almanın maliyeti her geçen gün artarken, arka kapıdan çıkıp giden müşteriyi tutmamanın bedeli iflastır.",
          en: "The cost of bringing a customer through the front door rises every day; the price of not holding the one walking out the back is bankruptcy.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Reklam bütçenizin karşılığını alamadığınızı düşünüyorsanız, sorun trafiğinizde olmayabilir. Trafik kovaya su taşır; deliği kapatmaz.",
          en: "If you feel your ad budget isn't paying for itself, the problem may not be your traffic. Traffic carries water to the bucket; it doesn't plug the hole.",
        },
      },
      {
        type: "h2",
        id: "yil-ortasi-gerceklik-kontrolu",
        text: {
          tr: "Yıl ortası gerçeklik kontrolü: aralıkta ne dedik, ağustosta ne oldu?",
          en: "Mid-year reality check: what we said in December, what happened by August",
        },
      },
      {
        type: "p",
        text: {
          tr: "Trend yazılarının çoğu ocak ayında yazılır ve bir daha açılmaz. Bu yazıyı sekiz ay sonra açtım, çünkü bir öngörünün değeri yazıldığı gün değil, denendiği gün ölçülür. Sahada gördüklerimiz şöyle:",
          en: "Most trend pieces get written in January and never opened again. I opened this one eight months later, because a prediction is worth what it's worth on the day it's tested, not the day it's written. Here's what we saw in the field:",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Tuttu — edinme ucuzlamadı. Yıl boyunca yönettiğimiz hesaplarda yeni müşteri maliyeti aşağı gelmedi; aynı bütçe aynı kişiye daha pahalıya ulaştı. Tez buradan doğrulandı: büyüme, harcamanın değil elde tutmanın işi.",
            en: "Held — acquisition didn't get cheaper. Across the accounts we ran this year, the cost of a new customer never came down; the same budget reached the same person for more money. That's where the claim was confirmed: growth is a retention job, not a spending job.",
          },
          {
            tr: "Hızlandı — bütçe dağıtımı algoritmaya geçti. Performance Max ve Advantage+ tarzı otomasyonlar bütçeyi kendi paylaştırıyor. Buradaki tuzak ince: algoritmaya \"ciro\" değil \"dönüşüm adedi\" öğretirseniz, size bol miktarda ucuz ve kârsız sipariş getirir. Kusursuz bir hızla yanlış hedefe koşar.",
            en: "Accelerated — budget allocation moved to the algorithm. Performance Max and Advantage+ style automations now split the budget themselves. The trap is subtle: teach the algorithm \"number of conversions\" instead of \"revenue\" and it will hand you a mountain of cheap, unprofitable orders. It runs toward the wrong target at flawless speed.",
          },
          {
            tr: "Beklediğimizden hızlı geldi — keşif AI motorlarında başlıyor. Müşteri markanızı ilk kez bir arama sonucunda değil, bir cevabın içinde duyuyor ve siteye çoktan karar vermiş geliyor. Bu ilk siparişi kolaylaştırdı; ikinci siparişi değil. Kova metaforu bu yüzden 2026'da daha da geçerli.",
            en: "Arrived faster than expected — discovery now starts in AI engines. Customers hear about your brand inside an answer rather than a search result, and land on your site with the decision already made. That made the first order easier; it did nothing for the second. Which is exactly why the bucket metaphor got more relevant in 2026, not less.",
          },
          {
            tr: "Yavaş kaldı — birinci taraf veri. Herkes konuştu, azı kurdu. Oysa elde tutmanın yakıtı bu: kendi verinizi toplamıyorsanız kimi tuttuğunuzu, kimi kaybettiğinizi bilemezsiniz. Yılın ikinci yarısında bu açık büyüyecek.",
            en: "Lagged — first-party data. Everyone talked about it, few built it. Yet this is retention's fuel: if you're not collecting your own data, you can't know who you're keeping and who you're losing. That gap will widen in the second half of the year.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Dört maddenin ortak paydası ölçüm. Sırayı doğru kurduğunuzda ne olduğunu [SOYLU AVM vakasında](/vakalar/soylu-avm-e-ticaret-buyume) anlattık: önce piksel ve dönüşüm izlemeyi sıfırdan kurduk, kampanyayı sonra açtık. Altıncı günde 1,5 milyon dolar gelir kaydedildi. Sıra tersine olsaydı aynı bütçe aynı sonucu vermezdi; kimse paranın nereye gittiğini bilemezdi.",
          en: "All four come down to measurement. We told the story of getting the order right in [the SOYLU AVM case](/vakalar/soylu-avm-e-ticaret-buyume): we rebuilt pixel and conversion tracking from scratch first, and only then opened the campaign. Day six recorded $1.5M in revenue. Reverse the order and the same budget wouldn't have produced the same result — nobody would have known where the money went.",
        },
      },
      {
        type: "h2",
        id: "retention-matematigi",
        text: {
          tr: "Matematik: neden elde tutma, edinmeden değerli?",
          en: "The math: why retention beats acquisition",
        },
      },
      {
        type: "p",
        text: {
          tr: "Metafor size mantıklı geldiyse mutfağa inelim. Pazarlamada duygular kararı tetikler, veriler doğrular. Çoğu e-ticaret işletmesi bütçesinin yaklaşık %80'ini yeni müşteri bulmaya, %20'sini eldekini tutmaya harcar. Ticaretin istatistiği bize tam tersini fısıldar.",
          en: "If the metaphor lands, let's go into the kitchen. In marketing, emotion triggers the decision and data confirms it. Most e-commerce businesses spend roughly 80% of the budget finding new customers and 20% keeping the ones they have. The statistics of commerce whisper the opposite.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Altın yumurtlayan tavuğu tanıyor musunuz?",
          en: "Have you met the goose that lays the golden eggs?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İtalyan ekonomist Vilfredo Pareto'nun 19. yüzyılda ortaya attığı 80/20 kuralı e-ticarette acımasızca işler: gelecekteki gelirinizin büyük kısmı, mevcut müşteri tabanınızın küçük bir diliminden gelir. Tüm enerjinizi o devasa yeni kitleyi kovalamaya harcıyorsanız, aslında cironun küçük bir parçası için savaşıyorsunuz demektir.",
          en: "The 80/20 rule Vilfredo Pareto proposed in the 19th century applies mercilessly in e-commerce: most of your future revenue comes from a small slice of your existing customer base. If you spend all your energy chasing that vast new audience, you're fighting for the smaller piece of the revenue.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Asıl hazine veritabanınızda sessizce duruyor. O dilim markanızı tanır, kart bilgisini çoktan kaydetmiştir ve ürününüzü arkadaşına anlatmaya hazırdır. Onlara ulaşmanın maliyeti bir e-postadır; yeni bir müşteriye ulaşmanın maliyeti bir açık artırmadır.",
          en: "The real treasure sits quietly in your database. That slice knows your brand, has already saved its card details and is ready to tell a friend about your product. Reaching them costs one email; reaching a new customer costs an auction.",
        },
      },
      {
        type: "h2",
        id: "segmentasyon-muhendisligi",
        text: {
          tr: "Segmentasyon mühendisliği: her müşteri eşit değildir",
          en: "Segmentation engineering: not every customer is equal",
        },
      },
      {
        type: "p",
        text: {
          tr: "Matematiği anladık. Peki kim bu sadık müşteriler? Veritabanınızdaki binlerce kişi arasında şampiyonları uyuyan güzellerden nasıl ayıracaksınız? Çoğu işletme listeyi tek bir kitle olarak görür ve herkese aynı mesajı gönderir: \"Tüm ürünlerde %10 indirim.\" 45 numara erkek botu alan bir müşteriye yazlık kadın sandaleti indirimi yollamak, ona \"seni tanımıyorum ve umursamıyorum\" demektir. Sonuç: abonelikten çık butonuna basan öfkeli parmaklar.",
          en: "We've got the math. But who are these loyal customers? Among the thousands in your database, how do you tell the champions from the sleeping beauties? Most businesses treat the list as one audience and send everyone the same message: \"10% off everything.\" Sending a summer sandal promotion to a man who just bought size-45 boots tells him \"I don't know you and I don't care.\" The result: angry fingers on the unsubscribe button.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "RFM analizi: müşterinin röntgenini çekmek",
          en: "RFM analysis: taking the customer's X-ray",
        },
      },
      {
        type: "p",
        text: {
          tr: "Müşterilerinizi duygularınızla değil RFM modeliyle kategorize edin. Üç sütun, veritabanınızdaki karmaşayı berrak bir stratejiye çevirir:",
          en: "Categorize your customers with the RFM model, not with your feelings. Three columns turn the mess in your database into a clear strategy:",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Recency (yenilik): en son ne zaman alışveriş yaptı? Dün gelen, bir yıl önce gelenden değerlidir.",
            en: "Recency: when did they last buy? Yesterday's customer is worth more than last year's.",
          },
          {
            tr: "Frequency (sıklık): ne kadar sık alışveriş yapıyor?",
            en: "Frequency: how often do they buy?",
          },
          {
            tr: "Monetary (parasal değer): size ne kadar kazandırdı?",
            en: "Monetary: how much have they earned you?",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Üç veriyi birleştirdiğinizde müşteriler şampiyonlar (sık gelen, çok harcayan), sadıklar ve riskli grup (eskiden sık gelen ama artık gelmeyen) olarak ayrışır. Yaklaşımınız her gruba farklı olmalı: şampiyona teşekkür edilir, riskli gruba \"seni özledik\" denir, ikisine aynı indirim kuponu gönderilmez. RFM'nin adım adım kurulumunu ayrı bir yazıda anlattık; [yazılar arşivinde](/yazilar) bulabilirsiniz.",
          en: "Combine the three and your customers separate into champions (frequent, high-spending), loyalists and the at-risk group (once frequent, now gone). Your approach must differ for each: you thank a champion, you tell the at-risk group you've missed them, and you don't send both the same coupon. We've covered how to build RFM step by step in a separate piece; you'll find it in [the articles archive](/yazilar).",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Kişiselleştirme paradoksu ve RAS etkisi",
          en: "The personalization paradox and the RAS effect",
        },
      },
      {
        type: "p",
        text: {
          tr: "Beynimizde retiküler aktivasyon sistemi (RAS) adı verilen bir filtre var. Bu filtre yalnız bizimle ilgili bilgiyi — ismimizi, ilgilendiğimiz bir konuyu — fark etmemizi sağlar. Bir e-ticaret müşterisi için en tatlı görüntü, kendi adını ve geçmiş tercihini görmektir.",
          en: "Our brains carry a filter called the reticular activating system (RAS). It makes us notice only what concerns us — our name, a subject we care about. For an e-commerce customer, the sweetest sight is their own name and their own past choices.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Yanlış: \"Sayın müşterimiz, yeni ürünlerimize göz atın.\" Beyin bunu reklam olarak etiketler ve görmezden gelir.",
            en: "Wrong: \"Dear customer, take a look at our new products.\" The brain files this under advertising and skips it.",
          },
          {
            tr: "Doğru: \"Merhaba Ayşe, geçen ay aldığın kahve makinesinden memnun kaldın mı? Yanına en çok yakışan üç filtre kahveyi senin için seçtik.\"",
            en: "Right: \"Hi Ayşe, how's the coffee machine you bought last month? We picked the three filter coffees that suit it best.\"",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "İkinci yaklaşım müşteride bilişsel kolaylık yaratır. Müşteri düşünmek zorunda kalmaz, çünkü siz onun yerine düşünüp seçenekleri daraltmışsınızdır. Kişiselleştirme bir nezaket değil, bir yük azaltma tekniğidir.",
          en: "The second approach creates cognitive ease. The customer doesn't have to think, because you thought for them and narrowed the options. Personalization isn't a courtesy; it's a technique for removing load.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Davranışsal tetikleyiciler: sepette unutulan ürün değil, kaçan fırsat",
          en: "Behavioral triggers: not a forgotten cart, a missed opportunity",
        },
      },
      {
        type: "p",
        text: {
          tr: "Otomasyonlarınızı kurarken psikolojik tetikleyicileri kullanın. Standart bir \"sepette ürün unuttun\" mesajı sıkıcıdır. Bunun yerine kıtlık ilkesini deneyin: \"Ayşe, sepetindeki ürünler seni bekliyor ama stoklarımız hızla azalıyor.\" Mesaj, hafif bir kaybetme korkusu yaratarak eyleme geçme ihtimalini artırır. Dikkat: stok gerçekten azalmıyorsa bu cümleyi kurmayın — bir kez yakalanan blöf, sadakatin kendisini bitirir.",
          en: "Use psychological triggers when you build your automations. A standard \"you left something in your cart\" message is boring. Try the scarcity principle instead: \"Ayşe, the items in your cart are waiting, but stock is running low.\" The message creates a mild fear of loss and raises the odds of action. One caveat: don't write that sentence if stock isn't actually running low — a bluff caught once kills loyalty itself.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Mesela: Amazon'un \"bunu alanlar şunu da aldı\" taktiği",
          en: "Case in point: Amazon's \"customers who bought this also bought\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Amazon, sıkça aktarılan bir rakama göre cirosunun yaklaşık %35'ini öneri motoruna borçlu. Size asla rastgele ürün göstermez: gezdiğiniz sayfalara, tıkladığınız ürünlere bakar ve \"bunu inceleyenler şunları da aldı\" diyerek sosyal kanıt ilkesini çalıştırır. Netflix'in kapak görselleri bile kişiye özeldir; romantik film sevene aynı filmi romantik bir kareyle, aksiyon sevene patlama sahnesiyle sunar. Müşteriye ne satıldığı kadar nasıl sunulduğu da önemlidir.",
          en: "By a widely cited figure, Amazon owes around 35% of its revenue to its recommendation engine. It never shows you a random product: it reads the pages you browsed and the items you clicked, then fires the social proof principle with \"customers who viewed this also bought\". Even Netflix's cover art is personal — the same film gets a romantic frame for one viewer and an explosion for another. How something is presented matters as much as what is sold.",
        },
      },
      {
        type: "h2",
        id: "kutu-acma-deneyimi",
        text: {
          tr: "Peak-End kuralı: deneyim kutu açılırken biter",
          en: "The peak-end rule: the experience ends when the box opens",
        },
      },
      {
        type: "quote",
        text: {
          tr: "İnsan beyni bir deneyimi süresine veya ortalamasına göre değil; en yoğun hissedildiği ana ve nasıl bittiğine göre hatırlar.",
          en: "The human brain remembers an experience not by its length or its average, but by its most intense moment and how it ended.",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticarette \"son\", müşterinin kapıyı açıp kargoyu teslim aldığı ve kutuyu açtığı andır. O an sıradansa tüm alışveriş sıradan olarak kodlanır. O an büyüleyiciyse müşteri markanıza bağlanır. Kutu, pazarlama bütçesinin en ucuz ve en ihmal edilen kalemidir.",
          en: "In e-commerce, the \"end\" is the moment the customer opens the door, takes the parcel and opens the box. If that moment is ordinary, the whole purchase gets filed as ordinary. If it's captivating, the customer bonds with your brand. The box is the cheapest and most neglected line in the marketing budget.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Kahverengi koli hatası",
          en: "The plain brown box mistake",
        },
      },
      {
        type: "p",
        text: {
          tr: "İnternetten alışverişin en büyük eksikliği dokunma duyusudur. Müşteri ürüne dokunamaz, koklayamaz. Ürün eline ulaştığı ilk an bu açlığı gidermek için tek fırsattır. Alelade bantlanmış kahverengi bir koli, müşteriye \"seninle işim bitti, parayı aldım\" der. Markalı bir kutu, içinden çıkan hışırdayan pelur kâğıt, hafif bir koku ise \"sen önemlisin\" der. Dokunsal deneyim güçlendikçe algılanan değer artar.",
          en: "The great shortcoming of buying online is touch. The customer can't hold the product or smell it. The first moment it reaches their hands is the only chance to feed that hunger. A plain taped-up brown box says \"we're done here, I got the money\". A branded box, the rustle of tissue paper inside it, a faint scent — those say \"you matter\". The stronger the tactile experience, the higher the perceived value.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Karşılıklılık ilkesi: küçük bir şekerin gücü",
          en: "Reciprocity: the power of a small sweet",
        },
      },
      {
        type: "p",
        text: {
          tr: "Robert Cialdini'nin meşhur karşılıklılık ilkesi, birinin bize yaptığı iyiliğe karşı kendimizi borçlu hissetmemizdir. Kutudan sipariş edilmemiş küçük bir hediye çıkması — bir avuç jelibon, bir sticker, bir tester ürün ya da elle yazılmış bir teşekkür notu — müşteride pozitif bir şok yaratır. Bu jest zihinde bir borçluluk hissi bırakır ve müşteri o borcu iki şekilde öder: markayı tekrar tercih ederek ve kutunun fotoğrafını paylaşarak. İkincisi bedava reklamdır.",
          en: "Robert Cialdini's famous reciprocity principle is our sense of owing something to whoever did us a favor. An unordered little gift falling out of the box — a handful of jelly beans, a sticker, a tester, a handwritten thank-you note — creates a positive shock. That gesture leaves a sense of debt, and the customer settles it in two ways: by choosing the brand again, and by photographing the box and sharing it. The second one is free advertising.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Beklenti yönetimi: süreci şeffaflaştırmak",
          en: "Expectation management: making the process transparent",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kutu gelene kadar geçen süre kaygı doludur. \"Kargom nerede?\", \"Acaba dolandırıldım mı?\" soruları arka planda çalışır. Yalnızca \"kargoya verildi\" demek yerine \"Ayşe, paketini özenle hazırladık, yola çıktı\" gibi insani bir bildirim, beklemeyi işkenceden heyecanlı bir geri sayıma çevirir. Aynı bilgi, farklı duygu.",
          en: "The wait before the box arrives is full of anxiety. \"Where's my parcel?\", \"Have I been scammed?\" run in the background. Instead of a bare \"shipped\", a human notification — \"Ayşe, we packed your order with care and it's on its way\" — turns waiting from torture into an exciting countdown. Same information, different emotion.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Apple bu işin ustasıdır. Bir iPhone kutusunu açarken kapağın hemen düşmediğini, birkaç saniye vakumla direnç gösterip yavaşça kaydığını fark ettiniz mi? Tesadüf değil, mühendislik. O birkaç saniyelik gecikme beklentiyi zirveye taşır. Sephora ve L'Occitane gibi markalar da sipariş ne kadar küçük olursa olsun içine attıkları tester ürünlerle müşteriye her seferinde kazançlı çıktığını hissettirir.",
          en: "Apple is the master of this. Opening an iPhone box, did you ever notice the lid doesn't just drop — it resists for a couple of seconds against the vacuum, then slides down slowly? That's not a coincidence, it's engineering. Those seconds of delay push anticipation to its peak. Brands like Sephora and L'Occitane do the same with testers dropped into every order, however small, so the customer always feels they came out ahead.",
        },
      },
      {
        type: "h2",
        id: "kovayi-tamir-etmek",
        text: {
          tr: "Kovayı tamir etmek: 90 günlük sıra",
          en: "Fixing the bucket: the 90-day order",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yıl ortası karnesinin özeti şu: trendler değişti, tez değişmedi. Sırayı doğru kurmak hâlâ en ucuz büyüme kaldıracı. Önerdiğimiz sıra dört adım:",
          en: "The mid-year report card in one line: the trends changed, the claim didn't. Getting the order right is still the cheapest growth lever there is. The order we recommend has four steps:",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Ölçümü doğrulayın. Hangi kanalın hangi siparişi getirdiğini göremiyorsanız geri kalan üç adım tahmindir.",
            en: "Verify measurement. If you can't see which channel produced which order, the other three steps are guesswork.",
          },
          {
            tr: "Reklam hedefini ciroya bağlayın. Otomasyona dönüşüm adedi değil gelir ve marj öğretin; algoritma neyi ödüllendirirseniz onu üretir.",
            en: "Tie the ad objective to revenue. Teach the automation income and margin, not conversion counts; the algorithm produces whatever you reward.",
          },
          {
            tr: "Müşteriyi RFM ile bölün ve her segmente ayrı bir cümle yazın. Tek bir kampanya mesajı, tek bir sonuç verir.",
            en: "Split customers with RFM and write a different sentence for each segment. One campaign message produces one result.",
          },
          {
            tr: "İkinci siparişi tasarlayın: kutu, teşekkür notu, teslimat bildirimi ve satın alma sonrası akış. En ucuz büyüme kalemi burada saklı.",
            en: "Design the second order: the box, the thank-you note, the delivery notification and the post-purchase flow. The cheapest growth line hides here.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Kova sağlamsa edinme yatırımı katlanarak geri döner. [OdorGo vakasında](/vakalar/odorgo-kategori-yaratma) Türkiye'de fiilen olmayan bir kategoride sekiz ayda 10 milyon TL ciroya ulaştık; reklam filmleri, CRO odaklı e-ticaret sitesi, e-posta, organik arama ve pazaryeri mağazaları tek ölçüm çerçevesinde çalıştı. Hedef trafik değil ciroydu, ölçüm de buna göre kuruldu.",
          en: "When the bucket holds, acquisition pays back many times over. In [the OdorGo case](/vakalar/odorgo-kategori-yaratma) we reached ₺10M in revenue in eight months in a category that effectively didn't exist in Türkiye; the commercials, the CRO-led e-commerce site, email, organic search and marketplace storefronts all ran inside one measurement frame. The target was revenue, not traffic, and the measurement was built accordingly.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yeni müşteri edinmeyi bırakın demiyorum. [FYR lansmanında](/vakalar/fyr-luks-dekorasyon-lansmani) üç ayda 100 bin dolar ciroya ulaştık ve reklam getirisi 20 katın üzerinde seyretti — edinme çalışır. Ama çalıştığı yerde kova sağlamdır. Deliği kapatmadan su taşımak, bütçeyi Google'ın ve Meta'nın açık artırmasına bağışlamaktır.",
          en: "I'm not telling you to stop acquiring customers. In [the FYR launch](/vakalar/fyr-luks-dekorasyon-lansmani) we reached $100K in three months with return on ad spend holding above 20× — acquisition works. But where it works, the bucket holds. Hauling water without plugging the hole is donating your budget to Google's and Meta's auctions.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ürününüz müşterinin eline ulaştığında hissettiği duygu \"sonunda geldi, işim bitti\" mi, yoksa \"kendimi özel hissediyorum, bunu paylaşmalıyım\" mı? İnsanlar satın aldıkları ürünü unutabilir; o ürünü alırken ve açarken nasıl hissettiklerini unutmaz. Kovanızın deliklerini birlikte bulmak isterseniz [CRO hizmetimize](/hizmetler/cro) ve [performans pazarlama](/hizmetler/performans-pazarlama) tarafına bakın — ikisinin kesiştiği yer tam olarak burasıdır.",
          en: "When your product reaches the customer's hands, is the feeling \"finally, that's done\" or \"I feel special, I should share this\"? People forget the product they bought; they don't forget how they felt buying it and opening it. If you'd like to find the holes in your bucket together, look at [our CRO service](/hizmetler/cro) and the [performance marketing](/hizmetler/performans-pazarlama) side — where those two meet is exactly this.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "2026'da performans pazarlamada en önemli değişiklik ne?",
          en: "What is the most important change in performance marketing in 2026?",
        },
        answer: {
          tr: "Bütçe dağıtımının büyük ölçüde algoritmaya geçmesi. Performance Max ve Advantage+ tarzı otomasyonlar hangi kanala, hangi kitleye, ne kadar harcanacağına kendisi karar veriyor. Bu, reklamcının işini kaldırmadı; işin yerini değiştirdi. Artık kritik karar, algoritmaya hangi hedefi öğrettiğinizdir. \"Dönüşüm adedi\" verirseniz ucuz ve kârsız sipariş üretir; gelir ve marj verirseniz kârlı müşteriyi arar. Yani 2026'nın değişimi teknik değil, tanımsal: neyi başarı saydığınızı yazmak, kampanyayı kurmaktan daha belirleyici hale geldi.",
          en: "Budget allocation has largely moved to the algorithm. Performance Max and Advantage+ style automations decide for themselves which channel, which audience and how much. That didn't remove the marketer's job; it moved it. The critical decision now is which objective you teach the algorithm. Feed it \"conversion count\" and it produces cheap, unprofitable orders; feed it revenue and margin and it hunts for profitable customers. So the 2026 shift isn't technical but definitional: writing down what counts as success matters more than building the campaign.",
        },
      },
      {
        question: {
          tr: "Küçük bütçeyle bu trendlere nasıl uyum sağlanır?",
          en: "How do you adapt to these trends on a small budget?",
        },
        answer: {
          tr: "Küçük bütçenin avantajı, en pahalı kalemin (reklam) değil en ucuz kalemin (elde tutma) üzerinde çalışabilmesidir. Üç adım neredeyse bedavadır: ölçümü doğrulamak, müşteri listesini bir hesap tablosunda RFM ile üç segmente ayırmak ve satın alma sonrası tek bir e-posta akışı yazmak. Kutu deneyimi de öyle: elle yazılmış bir teşekkür notunun maliyeti kâğıt parasıdır, etkisi bir reklam gösteriminden büyüktür. Bütçe büyümeden önce sıra düzeltilir; büyüyen bütçe düzensiz sırayı yalnızca daha pahalı hale getirir.",
          en: "The advantage of a small budget is that it lets you work on the cheapest line (retention) rather than the most expensive one (advertising). Three steps are nearly free: verify your measurement, split your customer list into three RFM segments in a spreadsheet, and write a single post-purchase email flow. The box experience is the same: a handwritten thank-you note costs the price of paper and outperforms an ad impression. Fix the order before growing the budget; a bigger budget only makes a broken order more expensive.",
        },
      },
      {
        question: {
          tr: "RFM analizine başlamak için hangi veriye ihtiyacım var?",
          en: "What data do I need to start an RFM analysis?",
        },
        answer: {
          tr: "Dört sütun yeterli: müşteri kimliği (e-posta veya telefon), son sipariş tarihi, toplam sipariş adedi ve toplam harcama. Bu dördünü her e-ticaret paneli ve çoğu muhasebe yazılımı dışa aktarır. Her sütunu 1-5 arası puanlayıp birleştirdiğinizde şampiyonlar, sadıklar ve riskli grup kendiliğinden ayrışır. Ayrı bir yazılım satın almadan, bir hesap tablosuyla bir öğleden sonrada kurulur; asıl iş analiz değil, her segmente ne söyleyeceğinize karar vermektir.",
          en: "Four columns are enough: a customer identifier (email or phone), last order date, total number of orders and total spend. Every e-commerce dashboard and most accounting software exports those four. Score each column from 1 to 5, combine them, and the champions, loyalists and at-risk group separate on their own. You can build it in a spreadsheet in an afternoon without buying software; the real work isn't the analysis but deciding what to say to each segment.",
        },
      },
      {
        question: {
          tr: "Elde tutmaya yaptığım yatırımın getirisini ne zaman görürüm?",
          en: "When will I see a return on retention investment?",
        },
        answer: {
          tr: "Ürününüzün doğal satın alma döngüsüne bağlı. Kozmetik veya gıda gibi haftalarla ölçülen kategorilerde ilk sinyalleri bir-iki ay içinde görürsünüz; mobilya veya beyaz eşya gibi yılla ölçülen kategorilerde etkiyi görmek bir döngü kadar sürer. Genel kural şu: elde tutma yatırımının geri dönüşü en az bir satın alma döngüsüdür, ama reklam harcamasının aksine birikimlidir — durdurduğunuzda etkisi anında bitmez. Sektöre ve sepet büyüklüğüne göre değiştiği için tek bir rakam vermek doğru olmaz; kendi verinizde tekrar satın alma oranını üç ayda bir ölçün.",
          en: "It depends on your product's natural purchase cycle. In categories measured in weeks — cosmetics, food — you'll see the first signals within one or two months; in categories measured in years, like furniture or appliances, seeing the effect takes a full cycle. The general rule: retention investment takes at least one purchase cycle to return, but unlike ad spend it compounds — the effect doesn't stop the moment you stop. Since it varies by industry and basket size, quoting a single number would be misleading; measure your own repeat purchase rate every quarter.",
        },
      },
    ],
    category: "growth",
    tags: ["retention", "rfm-analizi", "musteri-deneyimi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2025-12-08",
    readingMinutes: 10,
  },
  // Kaynak: indoles_eski/wp-icerik/yazilar/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi.md (2025-12-16)
// Değişiklik: h2/h3 hiyerarşisi ve 4 liste bloğu eklendi (segment kodları,
// R-F-M tanımları, psikolojik taktikler); sondaki kırık "buraya tıklayın"
// CTA'sı kaldırılıp /hizmetler/cro + /yazilar bağlantılarıyla değiştirildi;
// SOYLU AVM (segmentasyon) ve GYMWOLVES (sosyal kanıt) vakalarına 1'er bağ
// eklendi; 4 soruluk SSS eklendi. Selim Bey anekdotu ve parantez-içi
// psikolojik notlar (imza üslup) aynen korundu.
  {
    slug: {
      tr: "kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi",
      en: "rfm-analysis-for-small-businesses",
    },
    title: {
      tr: "Küçük İşletmeler İçin RFM Analizi ile Satışları Artırma Rehberi",
      en: "RFM Analysis for Small Businesses: A Practical Guide to Selling More",
    },
    excerpt: {
      tr: "Selim Bey, butik kahve dükkanına uğrayan herkese aynı indirimi gönderiyor — ve kârının büyük kısmını sırtlayan sadık müşterisini fark etmeden kaybediyor. RFM, üç harfle (Recency-Frequency-Monetary) bu körlüğü çözer; tek ihtiyacınız bir Excel tablosu.",
      en: "Selim Bey sends the same discount to everyone who walks into his boutique coffee shop — and loses the loyal customer carrying most of his margin without ever noticing. RFM fixes that blind spot with three letters (Recency, Frequency, Monetary) and nothing more than a spreadsheet.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 16 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlık hiyerarşisi ve liste blokları eklendi, sondaki kırık \"tüm makalelerimizi okuyun\" bağlantısı kaldırılıp ilgili vaka ve hizmet sayfalarına gerçek bağlantılarla değiştirildi, sık sorulan sorular bölümü eklendi.",
      en: "First published on 16 December 2025. Revised on 23 August 2026: heading hierarchy and list blocks were added, the broken \"read all our articles\" link at the end was removed and replaced with real links to relevant case studies and service pages, and an FAQ section was added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Butik bir kahve dükkanı işleten Selim Bey'i hayal edin. İşine aşık, kapıdan giren herkese aynı sıcaklıkla \"Hoş geldiniz\" diyen bir esnaf. Bayramlarda da tüm müşteri listesine aynı mesajı atıyor: \"Tüm kahvelerde %10 indirim.\"",
          en: "Picture Selim Bey, who runs a boutique coffee shop. He loves the business and greets everyone who walks in with the same warmth — \"Welcome\" — and on holidays sends his entire customer list the same message: \"10% off all coffees.\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kulağa hoş geliyor, değil mi? Aslında değil.",
          en: "Sounds nice, doesn't it? It isn't.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Selim Bey'in fark etmediği acı bir gerçek var — çünkü verisine hiç bakmıyor: her sabah uğrayıp tek bir filtre kahve alan Ayşe Hanım ile ayda bir gelip tüm ofise ısmarlayan Mehmet Bey'e tamamen aynı muameleyi yapıyor.",
          en: "There's a painful truth Selim Bey misses — because he never looks at his data: he treats Ayşe Hanım, who stops by every morning for a single filter coffee, exactly the same as Mehmet Bey, who comes once a month and orders for the whole office.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir gün Mehmet Bey gelmeyi bırakıyor. Selim Bey bunu fark bile etmiyor; yüzlerce işlemin arasında kaybolmuş bir \"görünmez müşteri\" o. Oysa kârın büyük kısmını sırtlayan kişiydi — istediği tek şey biraz \"özel\" hissetmekti: ismine hitap eden bir teşekkür, sırada beklemeden sipariş alma ayrıcalığı.",
          en: "One day Mehmet Bey stops coming. Selim Bey doesn't even notice — he's just one \"invisible customer\" lost among hundreds of transactions. Yet he was carrying a large share of the profit, and all he wanted was to feel a little \"special\": a thank-you addressed to him by name, the privilege of skipping the line.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Küçük işletmelerin en büyük tuzağı budur: her müşteriyi eşit sanmak. Bu yazıda, pahalı bir yazılıma ihtiyaç duymadan — bir Excel tablosu ve üç harfle (R-F-M) — işletmenizin gizli kahramanlarını nasıl bulacağınızı ve onları nasıl sadık hayranlara dönüştüreceğinizi anlatıyoruz.",
          en: "This is the biggest trap for small businesses: treating every customer as equal. In this guide — with nothing more expensive than a spreadsheet and three letters, R-F-M — you'll learn how to find your business's hidden heroes and turn them into loyal fans.",
        },
      },
      {
        type: "h2",
        id: "rfm-nedir",
        text: {
          tr: "RFM Nedir?",
          en: "What Is RFM?",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Bir Matematik Dersi Değil, Müşteri Empatisidir",
          en: "Not a Math Lesson — Customer Empathy",
        },
      },
      {
        type: "p",
        text: {
          tr: "RFM analizi kulağa karmaşık bir veri bilimi terimi gibi gelebilir ama aslında pazar esnafının yüzyıllardır içgüdüsel yaptığı şeyin dijitalleşmiş hali: müşterileri üç davranışa göre puanlamak.",
          en: "RFM analysis can sound like a complicated data-science term, but it's really the digitized version of something market vendors have done by instinct for centuries: scoring customers on three behaviors.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Recency — Yenilik (R): Müşteri en son ne zaman alışveriş yaptı? Son 30 günde alışveriş yapan birinin tekrar satın alma ihtimali, bir yıl önce yapana göre çok daha yüksektir; markanız zihninde hâlâ taze.",
            en: "Recency (R): When did the customer last buy? Someone who bought in the last 30 days is far more likely to buy again than someone who bought a year ago — your brand is still fresh in their mind.",
          },
          {
            tr: "Frequency — Sıklık (F): Ne kadar sık alışveriş yapıyor? Sık gelen müşteri markanızı hayatının bir parçası yapmıştır; onu kaybetmek yalnızca ciro değil, bir marka elçisi kaybetmektir.",
            en: "Frequency (F): How often do they buy? A customer who comes often has made your brand part of their life; losing them costs more than revenue — it costs a brand advocate.",
          },
          {
            tr: "Monetary — Parasal Değer (M): Toplamda ne kadar harcadı? Cironuzu sırtlayan \"büyük balıklar\" bu grupta.",
            en: "Monetary (M): How much have they spent in total? This is where your \"big fish\" live — the group carrying your revenue.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu üç veriyi yan yana koyduğunuzda elinizde sadece rakamlar değil, müşterilerinizin duygusal haritası olur.",
          en: "Put these three numbers side by side and what you get isn't just data — it's an emotional map of your customers.",
        },
      },
      {
        type: "h2",
        id: "neden-herkese-ayni-mesaj-para-kaybettirir",
        text: {
          tr: "Neden Herkese Aynı Mesajı Atmak Paranızı Çöpe Atar?",
          en: "Why Sending Everyone the Same Message Burns Your Budget",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pazarlamada Pareto İlkesi diye bir gerçek var: cironuzun %80'i müşterilerinizin sadece %20'sinden gelir. Kısıtlı bütçenizle herkese aynı %10 indirim kuponunu gönderdiğinizde iki şey birden olur.",
          en: "Marketing has its own version of the Pareto Principle: 80% of your revenue comes from just 20% of your customers. Send that same 10%-off coupon to everyone with a limited budget, and two things happen at once.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Zaten yarın da gelecek sadık müşteriye (o %20'lik dilim) boşuna para harcarsınız — onların ihtiyacı indirim değil, takdirdir.",
            en: "You spend money on the loyal customer who was coming back tomorrow anyway (that 20%) — what they need isn't a discount, it's recognition.",
          },
          {
            tr: "Sizi çoktan unutmuş müşteriye ise %10 yetmez — onların ihtiyacı çok daha büyük bir dürtmedir.",
            en: "You fail to move the customer who's already forgotten you — 10% isn't enough; they need a much bigger nudge.",
          },
        ],
      },
      {
        type: "quote",
        text: {
          tr: "RFM analizi, karanlığa kurşun sıkmayı (spray and pray) bırakıp lazer odaklı atış yapmanızı sağlar.",
          en: "RFM replaces spray-and-pray marketing with a laser-focused shot.",
        },
      },
      {
        type: "h2",
        id: "adim-adim-rfm-analizi",
        text: {
          tr: "Adım Adım RFM Analizi: Excel Yeterli",
          en: "Step by Step RFM: A Spreadsheet Is Enough",
        },
      },
      {
        type: "p",
        text: {
          tr: "Korkmayın, kodlama bilmenize gerek yok. Müşteri listenizi — satış tarihi ve tutarıyla — bir tabloya dökmeniz yeterli. Elinizde bir CRM veya e-ticaret paneli varsa çoğu bu hesaplamayı zaten otomatik raporlar; ama küçük bir işletme için Excel fazlasıyla yeterli.",
          en: "Don't worry, you don't need to code. Put your customer list — purchase dates and amounts — into a table, and you're set. If you run a CRM or e-commerce platform, many already generate this automatically; but for a small business, a spreadsheet is more than enough.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Puanlama (Skorlama)",
          en: "Scoring",
        },
      },
      {
        type: "p",
        text: {
          tr: "Müşterilerinizi R, F ve M kriterlerinin her birinde 1'den 5'e kadar puanlarsınız: 5 puan en iyileri (en son gelen, en sık gelen, en çok harcayan) gösterir; 1 puan en zayıfları (en eskiden gelmiş, tek sefer gelmiş, az harcamış).",
          en: "Score every customer from 1 to 5 on each of the three criteria: a 5 marks the best (most recent, most frequent, highest spender), a 1 marks the weakest (long gone, one-time buyer, low spender).",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Segmentasyon (Gruplama)",
          en: "Segmentation",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üç puanı yan yana getirdiğinizde ortaya bir segment kodu çıkar. Birkaç örnek:",
          en: "Line up the three scores and you get a segment code. A few examples:",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "5-5-5 (Şampiyonlar): Dün gelmiş, her gün geliyor, çok harcıyor.",
            en: "5-5-5 (Champions): bought yesterday, buys every day, spends a lot.",
          },
          {
            tr: "1-5-5 (Risk Grubu): Eskiden çok sık gelir ve harcardı ama artık gelmiyor — hemen müdahale edilmeli.",
            en: "1-5-5 (At Risk): used to buy often and spend a lot, but has gone quiet — step in immediately.",
          },
          {
            tr: "1-1-1 (Kayıp): Çok eskiden bir kez gelmiş ve gitmiş; bütçe harcamaya değmeyebilir.",
            en: "1-1-1 (Lost): bought once, long ago, and never came back — may not be worth the budget.",
          },
        ],
      },
      {
        type: "h2",
        id: "musteri-segmentlerine-gore-psikolojik-taktikler",
        text: {
          tr: "Müşteri Segmentlerine Göre Psikolojik Taktikler",
          en: "Psychological Tactics by Segment",
        },
      },
      {
        type: "p",
        text: {
          tr: "Analizi yaptınız — peki şimdi ne yapacaksınız? Davranışsal psikolojiyi kullanarak her segmente farklı bir dille konuşma zamanı.",
          en: "You've run the analysis — now what? Time to use behavioral psychology and speak to each segment in its own language.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Şampiyonlar (R=5, F=5, M=5): Onlara satış yapmaya çalışmayın; statü ve ödül verin. İndirim değil ayrıcalık sunun — yeni ürünleri ilk onlar görsün, özel bir teşekkür notu veya küçük bir hediye gönderin. Bu, karşılıklılık ilkesini tetikler ve markanızı başkalarına anlatmalarını sağlar.",
            en: "Champions (R=5, F=5, M=5): Don't try to sell to them — give them status and reward. Offer privilege, not discount: let them see new products first, send a personal thank-you note or a small gift. This triggers reciprocity and turns them into people who talk about your brand.",
          },
          {
            tr: "Sadık Müşteriler (F=5, M=yüksek): Düzenli gelirler ama henüz şampiyon kadar taze veya yüksek harcamalı değiller. Onlardan yorum veya referans isteyin; \"fikriniz bizim için değerli\" diyerek işin içine katın — sosyal kanıt burada en güçlü aracınız. [GYMWOLVES vakamızda](/vakalar/gymwolves-12-kat-satis) kampanyayı tam bu mantıkla, sporculardan toplanan sosyal kanıtla besledik; üç ayda satış 12 katına çıktı.",
            en: "Loyal Customers (F=5, M=high): They buy regularly but aren't yet as recent or high-spending as Champions. Ask them for a review or referral; \"your opinion matters to us\" pulls them in — social proof is your strongest tool here. In [our GYMWOLVES case](/vakalar/gymwolves-12-kat-satis) we fed the campaign with exactly this kind of social proof, gathered from athletes; sales grew 12x in three months.",
          },
          {
            tr: "Uykudakiler (R=2 veya 3): Eskiden geliyorlardı ama arayı açtılar. \"Sizi özledik\" temalı samimi bir hatırlatma yeterli olabilir; amaç alışkanlığı yeniden canlandırmak.",
            en: "Sleepers (R=2 or 3): They used to come, then drifted away. A warm \"we've missed you\" message can be enough — the goal is reviving the habit.",
          },
          {
            tr: "Risk Grubundakiler (R=1, F=4 veya 5): Kırmızı alarm bölgesi — eskiden en iyi müşterinizdi, şimdi sizi terk etti (Selim Bey'in kaybettiği Mehmet Bey burada). Süreli ve gerçekten cazip bir teklif sunun; kaybedilmiş sadık bir müşteriyi geri kazanmak, yeni bir müşteri bulmaktan çok daha ucuzdur.",
            en: "At Risk (R=1, F=4 or 5): The red-alert zone — they used to be your best customers and now they're gone (this is where Selim Bey lost Mehmet Bey). Offer something genuinely appealing and time-limited; winning back a lost loyal customer is far cheaper than finding a new one.",
          },
        ],
      },
      {
        type: "h2",
        id: "veriyi-eyleme-donusturme-zamani",
        text: {
          tr: "Veriyi Eyleme Dönüştürme Zamanı",
          en: "Time to Turn Data Into Action",
        },
      },
      {
        type: "p",
        text: {
          tr: "Veri, yalnızca büyük şirketlerin tekelinde soğuk bir rakamlar yığını değildir. Küçük bir işletme için veri, müşterinin sesidir.",
          en: "Data isn't a cold pile of numbers reserved for big companies. For a small business, data is the customer's voice.",
        },
      },
      {
        type: "quote",
        text: {
          tr: "RFM analizi yapmak, müşterilerinizi Excel satırları olarak görmek değil; her birinin hikayesini, ihtiyacını ve beklentisini anlamak demektir.",
          en: "Doing RFM analysis isn't about seeing your customers as spreadsheet rows — it's about understanding each one's story, needs and expectations.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Segmentasyonun gücünü daha büyük ölçekte de gördük: [SOYLU AVM vakamızda](/vakalar/soylu-avm-e-ticaret-buyume) trafiği segmentlere ayırıp önce ölçüm altyapısını kurduk, sonra kampanyayı açtık — ilk 6 günde 1,5 milyon dolarlık gelir geldi. Mantık aynı: kime, ne zaman, ne söylediğiniz; kaç kişiye ulaştığınızdan daha çok şey değiştiriyor.",
          en: "We've seen the power of segmentation at a larger scale too: in [our SOYLU AVM case](/vakalar/soylu-avm-e-ticaret-buyume) we split traffic into segments, rebuilt the measurement stack first, then launched the campaign — the first 6 days brought in $1.5M in revenue. The logic is the same: who you talk to and when changes more than how many people you reach.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sizin için küçük bir görev: hemen şimdi son 100 siparişinizi açın ve yalnızca \"en son ne zaman alışveriş yaptı?\" (Recency) sütununa bakın. Uzun süredir görmediğiniz tanıdık isimleri orada bulacaksınız — muhtemelen şaşırtıcı sayıda. Onlara bugün bir \"Merhaba\" demek, atacağınız en kârlı pazarlama adımı olabilir.",
          en: "Here's a small task for you: open your last 100 orders right now and look only at the \"when did they last buy\" (Recency) column. You'll find familiar names you haven't seen in a while — probably more than you expect. Saying \"hello\" to them today might be the most profitable marketing move you make this month.",
        },
      },
      {
        type: "p",
        text: {
          tr: "RFM tek başına küçük bir egzersiz gibi görünür ama dönüşüm oranınızı büyütmenin sistematik yoludur. [CRO hizmetimize](/hizmetler/cro) göz atabilir ya da [diğer pazarlama yazılarımızı](/yazilar) okumaya devam edebilirsiniz.",
          en: "RFM looks like a small exercise on its own, but it's a systematic way to grow your conversion rate. Take a look at [our CRO service](/hizmetler/cro), or keep reading on [our other marketing articles](/yazilar).",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "RFM analizi nedir?",
          en: "What is RFM analysis?",
        },
        answer: {
          tr: "RFM, müşterileri üç davranışa göre puanlayan bir segmentasyon yöntemidir: Recency (en son ne zaman alışveriş yaptı), Frequency (ne sıklıkla alışveriş yapıyor) ve Monetary (toplamda ne kadar harcadı). Her kritere 1-5 arası puan verilir; üç puan yan yana geldiğinde \"5-5-5 Şampiyonlar\" veya \"1-1-1 Kayıp\" gibi anlamlı müşteri segmentleri ortaya çıkar.",
          en: "RFM is a segmentation method that scores customers on three behaviors: Recency (when they last bought), Frequency (how often they buy) and Monetary value (how much they've spent in total). Each criterion gets a score from 1 to 5; lined up together, the three scores produce meaningful segments like \"5-5-5 Champions\" or \"1-1-1 Lost\".",
        },
      },
      {
        question: {
          tr: "RFM analizi için hangi araçlar gerekir?",
          en: "What tools does RFM analysis require?",
        },
        answer: {
          tr: "Küçük bir işletme için satış tarihi ve tutarını içeren bir Excel veya Google Sheets tablosu yeterlidir; sıralama ve gruplama elle de yapılabilir. Bir CRM veya e-ticaret paneli kullanıyorsanız çoğu bunu otomatik raporlar. Yapay zeka araçları işlemi hızlandırabilir ama zorunlu değildir — mantık Excel'de de birebir çalışır.",
          en: "For a small business, a spreadsheet with purchase dates and amounts is enough — sorting and grouping can be done by hand. If you run a CRM or e-commerce platform, many generate this automatically. AI tools can speed things up, but they're not required — the logic works exactly the same in a spreadsheet.",
        },
      },
      {
        question: {
          tr: "RFM analizi kaç müşteriyle anlamlı olur?",
          en: "How many customers do you need for RFM to be meaningful?",
        },
        answer: {
          tr: "Kesin bir eşik yok; sektöre ve satış sıklığına göre değişir. Çok az müşteride (birkaç düzine) her müşteri neredeyse kendi segmenti gibi görünür ve gruplar dengesiz çıkar. Pratikte segment farkları genellikle birkaç yüz aktif müşteriden itibaren belirginleşmeye başlar; sipariş sıklığı yüksek işletmelerde bu eşiğe daha erken ulaşılır.",
          en: "There's no fixed threshold — it depends on your industry and how often customers buy. With very few customers (a few dozen), each one looks like its own segment and the groups come out unbalanced. In practice, segment differences tend to become clear from a few hundred active customers onward; businesses with frequent repeat purchases reach that point sooner.",
        },
      },
      {
        question: {
          tr: "RFM analizi ne sıklıkla yenilenmeli?",
          en: "How often should RFM analysis be refreshed?",
        },
        answer: {
          tr: "Sipariş sıklığınıza bağlı. Haftalık alışveriş yapılan bir e-ticaret için ayda bir yenileme mantıklıdır; yılda birkaç kez satın alınan bir ürün veya hizmet için üç-altı ayda bir yeterli olabilir. Sabit bir takvimden çok, segmentlerin fark edilir ölçüde değiştiği anları (bir kampanya veya sezon sonrası gibi) yakalamak önemlidir.",
          en: "It depends on your purchase frequency. For an e-commerce business bought from weekly, refreshing monthly makes sense; for a product or service bought a few times a year, every three to six months may be enough. What matters more than a fixed calendar is catching the moments when segments visibly shift — after a campaign or a season, for instance.",
        },
      },
    ],
    category: "growth",
    tags: ["rfm-analizi", "musteri-segmentasyonu", "kucuk-isletmeler"],
    authorSlug: "burak-ozgul",
    publishedAt: "2025-12-16",
    readingMinutes: 6,
  },
  // Eski blogdan taşındı (2025-12-16). "Delik kova sendromu" bu yazının
  // kimliği olarak merkeze alındı: yeni h2 + quote bloğu (temasal akraba —
  // CRO yazısının kapanışındaki "sızan kova" imgesiyle aynı aile, metin
  // kopyalanmadı, bu yazı metaforun ana evi). Kırık "buraya tıklayın" CTA'sı
  // GYMWOLVES vakası (retargeting + çapraz satış) ve performans pazarlama
  // hizmet bağlantısına çevrildi. 4 soruluk SSS eklendi.
  {
    slug: {
      tr: "reklam-maliyetleri-artarken-buyumenin-sirri-ltv-optimizasyonu",
      en: "ltv-optimization-secret-to-growth",
    },
    title: {
      tr: "Reklam maliyetleri artarken büyümenin sırrı: LTV optimizasyonu",
      en: "As ad costs climb, growth's secret is LTV optimization",
    },
    excerpt: {
      tr: "Reklam panelinde harcama yukarı, karlılıkta çizgi aşağı — e-ticaret yöneticilerinin ortak kâbusu bu. Çare daha fazla reklam değil: müşteriyi bir kez kazanıp bırakmak yerine, yaşam boyu değerini (LTV) büyütmek.",
      en: "Spend climbing on the ad dashboard, profit sliding on the P&L — the shared nightmare of e-commerce managers. The fix isn't more ad spend: it's growing what a customer is worth over a lifetime (LTV) instead of winning them once and letting go.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 16 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: \"delik kova sendromu\" merkezi bir bölüm ve alıntı olarak eklendi, kırık CTA'lar GYMWOLVES vakası ve hizmet bağlantısına çevrildi, LTV:CAC oranı \"kesin kural\" değil \"yaygın kıyaslama\" olarak yeniden çerçevelendi, sık sorulan sorular eklendi.",
      en: "First published on 16 December 2025. Revised on 23 August 2026: the \"leaky bucket syndrome\" was added as its own section and pull quote, broken CTAs were replaced with a link to the GYMWOLVES case and a service page, the LTV:CAC ratio was reframed from a \"hard rule\" to a \"common benchmark\", and an FAQ was added.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "E-ticaret yöneticilerinin ortak kâbusu şu: reklam panelindeki harcama grafiği yukarı gidiyor, karlılık grafiği aşağı. Meta ve Google'da müşteri kazanım maliyeti (CAC) her geçen yıl katlanarak artıyor.",
          en: "E-commerce managers share one nightmare: the spend line on the ad dashboard climbs while the profit line falls. Customer acquisition cost (CAC) on Meta and Google keeps compounding, year after year.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Eskiden parayı reklam musluğuna açıp ciroyu izlemek yeterliydi. Artık oyunun kuralları değişti: sadece \"yeni müşteri\" peşinde koşmak, pahalı bir hobiye dönüştü. Bu yazı reklam bütçesini yakmadan büyümenin mühendisliğini anlatıyor — müşteri yaşam boyu değerini (LTV) optimize etmeyi.",
          en: "It used to be enough to open the ad tap and watch revenue follow. The rules changed: chasing only \"new customers\" turned into an expensive hobby. This piece is about the engineering of growth that doesn't burn the ad budget — optimizing customer lifetime value (LTV).",
        },
      },
      {
        type: "h2",
        id: "ilk-bulusma-ve-evlilik",
        text: {
          tr: "Pazarlama bir ilk buluşmaysa, retention evliliktir",
          en: "If marketing is a first date, retention is the marriage",
        },
      },
      {
        type: "p",
        text: {
          tr: "Durumu şöyle düşünün: harika bir ilk buluşma için servet harcıyorsunuz — en şık restoran, en iyi kıyafet. Karşı taraf (müşteri) etkileniyor ve \"evet\" diyor (satın alma). Ama buluşma bitince bir daha aramıyorsunuz. İkinci buluşma yok, ilişki yok. Ertesi gün yeniden sıfırdan başlıyor, yine dünyanın parasını harcayarak başka birini etkilemeye çalışıyorsunuz. Yorucu değil mi?",
          en: "Picture this: you spend a fortune on a spectacular first date — the finest restaurant, your best outfit. The other side (the customer) is impressed and says \"yes\" (a purchase). But once the date ends, you never call again. No second date, no relationship. The next day you start from zero again, spending a fortune to impress someone else. Exhausting, isn't it?",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticarette sadece CAC'e odaklanmak tam olarak budur: sürekli pahalı ilk buluşmalara çıkıp asla uzun vadeli bir ilişki kurmamak. Kâr ilk buluşmada değil, o ilişkinin yıllara yayılan güveninde saklıdır.",
          en: "Focusing on CAC alone in e-commerce is exactly this: an endless string of expensive first dates that never turn into a relationship. Profit doesn't live in the first date — it lives in the trust a relationship builds over years.",
        },
      },
      {
        type: "h2",
        id: "ltv-cac-orani",
        text: {
          tr: "Matematik yalan söylemez: LTV:CAC oranı",
          en: "The math doesn't lie: the LTV:CAC ratio",
        },
      },
      {
        type: "p",
        text: {
          tr: "Duygusal kararları bir kenara bırakıp rakamlara bakalım. E-ticarette kârlı büyümenin formülü aslında basit: LTV:CAC oranı. Bir müşteriyi kazanmak için harcadığınız para (CAC) ile o müşterinin sizinle kaldığı süre boyunca bıraktığı para (LTV) arasındaki ilişki, işin kaderini belirler.",
          en: "Set emotion aside and look at the numbers. Profitable growth in e-commerce comes down to one formula: LTV:CAC — what you spend to win a customer (CAC) against what they leave behind over the relationship's life (LTV) decides the business's fate.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "1:1 — müşteriye harcadığınızı geri alıyorsunuz; büyüme değil, yerinde saymak.",
            en: "1:1 — you get back what you spent on the customer; not growth, just standing still.",
          },
          {
            tr: "3:1 — yaygın kabul gören sağlıklı bölge: müşteriye 1 harcayıp yaşam döngüsü boyunca 3 kazanmak.",
            en: "3:1 — the commonly accepted healthy zone: spend 1 on a customer, earn 3 back over their lifecycle.",
          },
          {
            tr: "4:1 ve üzeri — pazarın dominant oyuncusu olma yolundasınız.",
            en: "4:1 and above — you're on track to dominate the market.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "3:1 kesin bir kural değil; sektöre ve nakit akışı ihtiyacına göre değişen yaygın bir kıyaslama noktası. Ama yön hep aynı: müşteri ikinci siparişi vermiyorsa LTV düşük kalır ve artan reklam maliyetleri altında ezilirsiniz. İlk siparişte kâr etme devri kapandı — kâr artık ikinci, üçüncü, onuncu siparişte gizli.",
          en: "3:1 isn't a hard rule — it's a benchmark that shifts with industry and cash-flow needs. But the direction stays the same: no second order means low LTV, and rising ad costs grind you down. Profiting on the first order is over — profit now hides in the second, third, tenth.",
        },
      },
      {
        type: "h2",
        id: "delik-kova-sendromu",
        text: {
          tr: "Delik kova sendromu",
          en: "Leaky bucket syndrome",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu tabloyu \"delik kova sendromu\" diye adlandıralım. Her ay CAC'e daha fazla su döküyorsunuz ama kovadaki seviye yükselmiyor. Sorun musluk değil — kovanın dibindeki delik.",
          en: "Let's give this picture a name: leaky bucket syndrome. Every month you pour more water into CAC, but the level in the bucket never rises. The problem isn't the tap — it's the hole in the bottom of the bucket.",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Retention yoksa her yeni müşteri, bir öncekinin boşalttığı yeri dolduruyor. Delikleri kapatmadan kovayı doldurmak, reklam bütçesini büyütmenin değil, tüketmenin garantisidir.",
          en: "Without retention, every new customer just refills the space the last one left empty. Filling the bucket without plugging the holes doesn't grow your ad budget — it guarantees you'll burn through it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yüzden delikleri kapatmak — müşteriyi ikinci, üçüncü siparişe taşımak — reklam bütçesini büyütmekten daha ucuz ve daha kalıcı bir büyüme kaldıracı. Kovayı büyütmeden önce dibine bakmak gerekir.",
          en: "That's why plugging the holes — moving a customer to their second and third order — is a cheaper, more durable growth lever than growing the ad budget. Before you make the bucket bigger, you have to check its bottom.",
        },
      },
      {
        type: "h2",
        id: "davranis-bilimiyle-sadakat",
        text: {
          tr: "Davranış bilimiyle sadakat inşası",
          en: "Building loyalty with behavioral science",
        },
      },
      {
        type: "p",
        text: {
          tr: "Müşteriler yalnızca ürününüz \"iyi\" olduğu için sadık kalmaz. İnsan beyni alışkanlığı ve ödülü sever; davranışsal ekonomi prensipleriyle müşteriyi markaya bağlayabilirsiniz.",
          en: "Customers don't stay loyal just because your product is \"good.\" The human brain loves habit and reward — behavioral economics gives you the levers to bond a customer to your brand.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Alışkanlık döngüsü",
          en: "The habit loop",
        },
      },
      {
        type: "p",
        text: {
          tr: "Müşterinizin hayatında bir tetikleyici oluştuğunda — \"kahvem bitti\", \"cildim kurudu\" — akla gelen ilk çözüm markanız olmalı. Başarılı markalar ürünlerini bir \"tercih\" olmaktan çıkarıp \"refleks\" haline getirir. Abonelik modelleri bu yüzden en güçlü LTV artırıcısı: müşteri satın alma kararını bir kez verir, gerisi otomatikleşir.",
          en: "When a trigger fires in a customer's life — \"I'm out of coffee,\" \"my skin feels dry\" — your brand should be the first thing that comes to mind. Successful brands turn the product from a \"choice\" into a \"reflex.\" That's why subscriptions are the strongest LTV lever: one buying decision, then autopilot.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Kişiselleştirme yanılgısı",
          en: "The personalization fallacy",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Merhaba Ahmet\" diye başlayan e-posta artık kişiselleştirme sayılmıyor. Gerçek kişiselleştirme, davranışı analiz edip ihtiyaç oluşmadan çözüm sunmaktır. Müşteri üç ay önce bir koşu ayakkabısı aldıysa, bugün ona yeni bir ayakkabı satmaya çalışmak yerine koşu çorabı veya beslenme jeli önermek \"seni tanıyorum\" mesajı verir.",
          en: "An email opening with \"Hi John\" isn't personalization anymore. Real personalization reads behavior and answers a need before it's felt. A customer who bought running shoes three months ago doesn't need another pair pitched today — running socks or an energy gel says \"I know you\" instead.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kişiselleştirilmiş çapraz satış teoride kolay, kurulumu zor: [GYMWOLVES vakasında](/vakalar/gymwolves-12-kat-satis) kitle segmentlere ayrıldı, düşük performanslı reklam setleri kapatıldı ve yeniden hedeflemeyle çapraz satış kuruldu — üç ayda satışın 12 katına çıktığı sonucun dişlilerinden biri buydu.",
          en: "Personalized cross-sell is simple in theory, hard to build: in [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis) the audience was segmented, underperforming ad sets were closed, and retargeting was used to build cross-sell — one of the gears behind sales going up 12× in three months.",
        },
      },
      {
        type: "h2",
        id: "retention-muhendisligi",
        text: {
          tr: "Retention mühendisliği: veriyi aksiyona dönüştürmek",
          en: "Retention engineering: turning data into action",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Müşterilerimizi seviyoruz\" demek romantik bir yaklaşımdır. Retention mühendisliği ise analitiktir.",
          en: "Saying \"we love our customers\" is a romantic stance. Retention engineering is an analytical one.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "RFM analizi kullanın: müşterileri ne zaman (recency), ne sıklıkla (frequency) ve ne kadar (monetary) alışveriş yaptıklarına göre ayırın. VIP müşterinizle kaybetmek üzere olduğunuz müşteriye aynı mesajı atmayın.",
            en: "Use RFM analysis: split customers by when they last bought (recency), how often (frequency) and how much (monetary). Don't send the same message to your VIP and to the customer you're about to lose.",
          },
          {
            tr: "Sürtünmeyi yok edin: müşteri tutmanın en kolay yolu, gitmelerine sebep olan engelleri kaldırmaktır. İade süreci zor mu, müşteri hizmetlerine ulaşmak imkânsız mı? Kötü bir satış sonrası deneyim, en iyi pazarlama kampanyasını bile siler.",
            en: "Remove friction: the easiest way to retain customers is to remove whatever pushes them to leave. Is the return process hard? Is support impossible to reach? A bad post-sale experience erases even the best marketing campaign.",
          },
        ],
      },
      {
        type: "h2",
        id: "avci-degil-ciftci-olun",
        text: {
          tr: "Avcı değil, çiftçi olun",
          en: "Be a farmer, not a hunter",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticarette büyüme stratejinizi değiştirmenin vakti geldi. Müşteri edinimi avcılıktır — heyecanlıdır ama her gün yeniden ava çıkmanız gerekir. Müşteri tutma ise çiftçiliktir — tohumu eker, sularsınız ve yıllarca hasat alırsınız.",
          en: "It's time to change your growth strategy. Customer acquisition is hunting — exciting, but you have to go out and hunt again every day. Customer retention is farming — you plant, you water, and you harvest for years.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Reklam maliyetlerinin arttığı bu dönemde işletmenizin hayatta kalması avcılık yeteneğinize değil, çiftçilik sabrınıza ve mühendisliğinize bağlı. LTV optimizasyonu bir metrik değil, işletmenizin sigortası.",
          en: "In a period of rising ad costs, your business's survival depends less on hunting skill and more on farming patience and engineering. LTV optimization isn't a metric — it's your business's insurance policy.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İlk adım genelde bütçenin nereye gittiğini görmek: [performans pazarlama hizmetimiz](/hizmetler/performans-pazarlama) kanal karnesiyle başlar, LTV tarafını RFM segmentasyonuyla besleriz. Retention'ı erken kurmuş markaların neye benzediğini görmek isterseniz [vaka çalışmalarımıza](/vakalar) göz atabilirsiniz.",
          en: "The first step is seeing where the budget actually goes: [our performance marketing service](/hizmetler/performans-pazarlama) starts with a channel scorecard, then feeds the LTV side with RFM segmentation. Want to see what early retention looks like in practice? Browse [our case studies](/vakalar).",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "LTV nedir ve nasıl hesaplanır?",
          en: "What is LTV and how is it calculated?",
        },
        answer: {
          tr: "LTV (müşteri yaşam boyu değeri), bir müşterinin sizinle ilişkisi süresince bıraktığı toplam kârı ifade eder. En basit hesaplama: ortalama sipariş değeri × yılda ortalama satın alma sıklığı × müşterinin ortalama ilişki süresi (yıl). Örneğin 500 TL'lik ortalama sepet, yılda 4 sipariş ve 2 yıllık ortalama müşteri ömrü kabaca 4.000 TL LTV verir. Daha gelişmiş modeller kâr marjını ve müşteri kaybetme (churn) oranını da hesaba katar.",
          en: "LTV (customer lifetime value) is the total profit a customer leaves behind over the life of their relationship with you. The simplest formula: average order value × average purchases per year × average customer lifespan in years. A 500 TL average basket, 4 orders a year and a 2-year average lifespan works out to roughly 4,000 TL of LTV. More advanced models also factor in profit margin and churn rate.",
        },
      },
      {
        question: {
          tr: "LTV/CAC oranı kaç olmalı?",
          en: "What should the LTV/CAC ratio be?",
        },
        answer: {
          tr: "Sektörde yaygın kabul gören bölge 3:1 — bir müşteriye harcanan her 1 birime karşılık yaşam boyu değerde 3 birim geri gelmesi. Bu kesin bir kural değil, bir kıyaslama noktası: nakit akışı sıkışık büyüyen işletmeler daha düşük oranla da sağlıklı ilerleyebilir, sermayesi güçlü işletmeler 4:1 ve üzerini hedefler. Oran 1:1'e yaklaşıyorsa büyüme değil, yerinde sayma vardır.",
          en: "The commonly accepted zone is 3:1 — every 1 unit spent acquiring a customer comes back as 3 units of lifetime value. It's not a hard rule but a benchmark: cash-constrained, fast-growing businesses can be healthy at a lower ratio, while well-capitalized ones target 4:1 or higher. A ratio drifting toward 1:1 means you're standing still, not growing.",
        },
      },
      {
        question: {
          tr: "LTV'yi artırmanın en hızlı yolu nedir?",
          en: "What's the fastest way to increase LTV?",
        },
        answer: {
          tr: "Yeni müşteri kazanmaktan daha hızlı ve ucuz olan yol, elinizdeki müşteriyi harekete geçirmektir. RFM analiziyle \"ikinci siparişe yakın\" segmenti çıkarın, onlara hedefli bir teklif veya hatırlatma gönderin; iade ve destek süreçlerindeki sürtünmeyi azaltın. Bu iki adım genelde haftalar içinde ölçülebilir sonuç verir — yeni bir sadakat programı kurmak ise aylar alabilir.",
          en: "The fastest, cheapest lever is activating the customers you already have, not chasing new ones. Use RFM analysis to isolate the segment sitting just before a second order, send them a targeted offer or reminder, and strip friction out of returns and support. Those two moves usually show measurable results within weeks — building a new loyalty program from scratch can take months.",
        },
      },
      {
        question: {
          tr: "LTV optimizasyonu hangi işletmeler için kritik?",
          en: "Which businesses is LTV optimization critical for?",
        },
        answer: {
          tr: "Tekrar satın alma döngüsü olan her işletme için — e-ticaret, abonelik/SaaS modelleri ve D2C markalar başta gelir. Reklam maliyetleri arttıkça önemi büyüyor, çünkü CAC'i karşılayan tek şey LTV. Tek seferlik yüksek bilet satışlarında (örneğin bir kereye mahsus büyük yatırım ürünlerinde) LTV'nin ağırlığı azalır, ama tavsiye ve referans değeri üzerinden yine de hesaba katılmalıdır.",
          en: "Any business with a repeat-purchase cycle — e-commerce, subscription/SaaS models and D2C brands lead the list. Its importance grows as ad costs rise, because LTV is the only thing that offsets CAC. For one-off, high-ticket sales (a single large investment purchase, for example) LTV carries less weight, but it should still be counted through referral and word-of-mouth value.",
        },
      },
    ],
    category: "growth",
    tags: ["ltv-optimizasyonu", "musteri-sadakati", "cac"],
    authorSlug: "burak-ozgul",
    publishedAt: "2025-12-16",
    readingMinutes: 5,
  },
  // Kaynak: indoles_eski/wp-icerik/yazilar/dijitalde-olceklenmek-isteyen-kobiler-icin-5-adimli-yeni-yil-stratejisi.md (2025-12-21).
// Değişiklik: "yeni yıl stratejisi" çerçevesi (Aralık 2025'e bağlı, 2026'nın
// 8. ayında eskimiş) kaldırıldı; başlık ve giriş "önümüzdeki 12 ay" / "ne
// zaman başlarsanız başlayın" çerçevesine taşındı. slug.tr eski URL olarak
// korundu (redirect). Kaynaksız genel "vaka örnekleri" (mobilya markası %40,
// kahve markası 8x) sitede yayımlanmış gerçek vakalara (FYR, İstanbul Ortez
// Protez) bağlandı; Google'da ilk çıkmanın "%70 kapatır" gibi kaynaksız
// iddiası kaldırıldı. Kırık "buraya tıklayın" CTA'sı gerçek bağlantılara
// çevrildi. 1 liste bloğu, 1 alıntı bloğu ve 4 soruluk SSS eklendi.
{
  slug: {
    tr: "dijitalde-olceklenmek-isteyen-kobiler-icin-5-adimli-yeni-yil-stratejisi",
    en: "5-steps-for-smes-to-scale-digitally",
  },
  title: {
    tr: "Dijitalde ölçeklenmek isteyen KOBİ'ler için önümüzdeki 12 ayın 5 adımı",
    en: "5 steps for SMEs that want to scale digitally over the next 12 months",
  },
  excerpt: {
    tr: "İstanbul'da otuz yıldır tekstil üreten Ahmet Bey'i hayal edin: işçiliği özenli ama yan binadaki genç girişimci, deposu bile yokken dünyaya satış yapıyor. Fark bütçede değil stratejide. Dijitalde ölçeklenmek isteyen KOBİ'ler için 5 adımlı yol haritası.",
    en: "Picture Ahmet Bey, thirty years into the textile trade in Istanbul: his craftsmanship is careful, but the young founder next door sells to the world without owning a warehouse. The difference isn't budget — it's strategy. A 5-step roadmap for SMEs that want to scale digitally.",
  },
  updatedAt: "2026-08-23",
  updateNote: {
    tr: "Bu yazı ilk olarak 21 Aralık 2025'te \"yeni yıl stratejisi\" çerçevesiyle yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlık ve giriş takvime bağlı \"yeni yıl\" vurgusundan çıkarılıp \"önümüzdeki 12 ay\" çerçevesine taşındı — adımların sırası ne zaman başlarsanız başlayın aynı kalıyor. Kaynaksız genel örnekler (isimsiz bir mobilya markası, isimsiz bir kahve markası) sitede yayımlanan gerçek vakalara (FYR, İstanbul Ortez Protez) bağlandı, kırık CTA'lar gerçek bağlantılara çevrildi ve 4 soruluk SSS eklendi.",
    en: "First published on 21 December 2025 under a \"new year strategy\" framing. Revised on 23 August 2026: the title and opening moved from the calendar-bound \"new year\" framing to a \"next 12 months\" framing — the order of the steps holds regardless of when you start. The unsourced generic examples (an unnamed furniture brand, an unnamed coffee brand) were replaced with real published cases (FYR, İstanbul Ortez Protez), broken CTAs became real links, and a 4-question FAQ was added.",
  },
  blocks: [
    {
      type: "p",
      text: {
        tr: "İstanbul'un kalbinde, otuz yıldır tekstil sektöründe olan Ahmet Bey'i hayal edin. Ürünleri kusursuz, işçiliği özenli. Ama Ahmet Bey'in bir derdi var: yan binadaki genç girişimci, deposu bile yokken dijitalden dünyaya mal satıyor. Ahmet Bey geçen yıl \"dijitalleşmek\" için bir miktar reklam bütçesi ayırdı, sonuç koca bir hüsran oldu. Neden? Çünkü Ahmet Bey sadece \"var olmaya\" çalıştı, \"ölçeklenmeye\" değil.",
        en: "Picture Ahmet Bey, thirty years into the textile trade in the heart of Istanbul. His products are flawless, his craftsmanship careful. But he has a problem: the young founder next door sells to the world through digital channels without even owning a warehouse. Last year Ahmet Bey set aside some ad budget to \"go digital\", and the result was a complete letdown. Why? Because he tried to merely \"exist\" online, not to scale.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Çoğu KOBİ için dijital dünya, içine para atılan ama karşılığı alınmayan bir kara delik gibi görünebilir. Oysa fark harcanan parada değil, o paranın arkasındaki stratejinin insan psikolojisiyle ne kadar uyumlu olduğunda saklı. İşte önümüzdeki 12 ayda işletmenizi dijitalin devler ligine taşıyacak 5 adımlı yol haritası — ne zaman başlarsanız başlayın, adımların sırası aynı kalır.",
        en: "For most SMEs the digital world can look like a black hole: money goes in, nothing measurable comes back. The real difference isn't the money spent — it's how closely the strategy behind it matches human psychology. Here's the 5-step roadmap that moves your business into the digital big leagues over the next 12 months — whenever you start, the order of the steps stays the same.",
      },
    },
    {
      type: "h2",
      id: "musteriyi-veriyle-taniyin",
      text: {
        tr: "1. Müşterinizi veriyle yeniden tanıyın",
        en: "1. Get to know your customer through data",
      },
    },
    {
      type: "p",
      text: {
        tr: "Çoğu işletme \"Müşteriniz kim?\" sorusuna \"25-45 yaş arası, İstanbul'da yaşayan kadınlar\" gibi demografik bir cevap verir. Bu, buzdağının yalnızca görünen kısmı. Dijitalde ölçeklenmek için psikografik analiz gerekir — müşterinizi ilgi alanlarına, değer yargılarına ve yaşam tarzına göre tanımak.",
        en: "Most businesses answer \"who is your customer?\" with a demographic like \"women aged 25-45 in Istanbul\". That's only the visible tip of the iceberg. Scaling digitally takes psychographic analysis — knowing your customer through their interests, values and lifestyle, not just their age bracket.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Müşteri bir ürünü yalnızca ihtiyacı olduğu için almaz; o ürüne sahip olduğunda hissedeceği duygu için alır. İnsan beyni burada kayıptan kaçınma içgüdüsüyle hareket eder: bir şeyi kazanmanın mutluluğundan çok, elindekini kaybetme korkusuna tepki verir.",
        en: "A customer doesn't buy a product only because they need it; they buy it for the feeling they'll get from owning it. Here the human brain runs on loss aversion: it reacts more strongly to the fear of losing something than to the joy of gaining it.",
      },
    },
    {
      type: "quote",
      text: {
        tr: "Reklamınız \"bunu kazanın\" değil, \"bunu kaybetmeyin\" diye konuştuğunda çoğu zaman daha çok satar.",
        en: "Your ad often sells more when it says \"don't lose this\" instead of \"gain this\".",
      },
    },
    {
      type: "p",
      text: {
        tr: "Algıya dayalı satın alma en çok doygun, üst segment kategorilerde görünür. [FYR vakamızda](/vakalar/fyr-luks-dekorasyon-lansmani) marka sıfırdan başlıyordu ve hedef kitle bir mumu değil, o objenin taşıdığı hissi satın alıyordu; konumlandırmayı bu duyguya göre kurduğumuzda 12 aylık ciro hedefi ilk 3 ayda geçildi. KOBİ ölçeğinde de mantık aynı: ürününüzü değil, müşterinin o üründen ne beklediğini satıyorsunuz.",
        en: "Perception-driven buying shows up most clearly in saturated, high-end categories. In [our FYR case](/vakalar/fyr-luks-dekorasyon-lansmani) the brand started from zero, and its audience wasn't buying a candle — they were buying the feeling the object carried. Once we built the positioning around that feeling, the 12-month revenue target was passed in the first 3 months. At SME scale the logic is identical: you're not selling the product, you're selling what the customer expects from it.",
      },
    },
    {
      type: "h2",
      id: "bilissel-yuku-azaltin",
      text: {
        tr: "2. Dijital mağazadaki bilişsel yükü azaltın",
        en: "2. Cut the cognitive load in your digital storefront",
      },
    },
    {
      type: "p",
      text: {
        tr: "Müşteriniz web sitenize veya sosyal medya hesabınıza girdiğinde kendini bir labirentte hissetmemeli. Bilişsel yük — bir görevi tamamlamak için harcanan zihinsel çaba — ne kadar yüksekse, satıştan vazgeçme oranı o kadar artar.",
        en: "When a customer lands on your site or your social page, they shouldn't feel like they've walked into a maze. The higher the cognitive load — the mental effort it takes to complete a task — the higher the drop-off rate.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Hick Yasası bunu net biçimde açıklar: seçenek sayısı arttıkça karar verme süresi de uzar. Sitenizde binlerce kategori yerine, müşteriyi en hızlı çözüme götüren \"en çok tercih edilenler\" veya \"sizin için seçtik\" gibi kısayollar tanımlayın. Ödeme sayfasında zorunlu üyelik veya on beş aşamalı bir form varsa, o müşteriyi rakibinize hediye ediyorsunuz demektir.",
        en: "Hick's Law explains this cleanly: the more options there are, the longer it takes to decide. Instead of thousands of categories, define shortcuts that carry the customer to the fastest answer — \"most popular\" or \"picked for you\". If checkout demands a mandatory account or a fifteen-step form, you're handing that customer to your competitor.",
      },
    },
    {
      type: "list",
      ordered: false,
      items: [
        {
          tr: "Sitenize girdiğinizde 3 saniye içinde ne iş yaptığınızı ve nasıl satın alınacağını anlayabiliyor musunuz?",
          en: "Within 3 seconds of landing on your site, can a visitor tell what you do and how to buy?",
        },
        {
          tr: "Sepete ürün eklemekten ödemeyi tamamlamaya kaç adım var — 4'ten fazlaysa, hangi adım gerçekten gerekli?",
          en: "How many steps run from adding a product to completing checkout — if it's more than 4, which step actually earns its place?",
        },
        {
          tr: "Ödeme için üyelik zorunlu mu, yoksa misafir olarak alışveriş mümkün mü?",
          en: "Is account creation mandatory at checkout, or can customers buy as guests?",
        },
      ],
    },
    {
      type: "h2",
      id: "icerik-otoritesiyle-guven-insa-edin",
      text: {
        tr: "3. İçerik otoritesiyle güven inşa edin",
        en: "3. Build trust through content authority",
      },
    },
    {
      type: "p",
      text: {
        tr: "Dijitalde ölçeklenmenin yakıtı güvendir. İnsanlar tanımadıkları ve uzmanlığına inanmadıkları markalardan alışveriş yapmaz. Ürün paylaşmak tek başına yetmez; sektörünüzle ilgili \"nasıl yapılır\" içerikleri ve rehber yazılarla sizi sadece bir satıcı değil, sorunu gerçekten çözen taraf konumuna taşıyan bir otorite kurmalısınız.",
        en: "Trust is the fuel of digital scale. People don't buy from brands they don't recognize or trust. Sharing product photos isn't enough on its own — \"how to\" content and guides in your field build you into an authority, not just a seller but the party that actually solves the problem.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Sosyal kanıt da bu otoritenin parçasıdır: başkalarının sizin hakkınızda söylediği, sizin söylediğinizden daha ağır basar. Müşteri yorumlarını ve gerçek sonuçları stratejinizin merkezine koyun.",
        en: "Social proof is part of that authority too: what others say about you carries more weight than what you say about yourself. Put customer reviews and real results at the center of your strategy.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Bu mantığın en somut kanıtı arama sonuçlarında görünür. [İstanbul Ortez Protez vakamızda](/vakalar/istanbul-ortez-protez-arama-gorunurlugu) içeriği hem klasik SEO hem GEO (AI arama motorları için optimizasyon) için kurduk — soru-cevap yapısı, teknik derinlik, AI motorlarının doğrudan alıntılayabileceği kendine yeten pasajlar. On beş ayda öncelikli aramalarda ilk 3'e çıktık; reklamla desteklenen kelimelerde ayda ortalama 10 yeni hasta geldi. Küçük bir işletme için bu, büyük bir reklam bütçesinden daha ucuz ve daha kalıcı bir görünürlük kanalıdır.",
        en: "The most concrete proof of this logic shows up in search results. In [our İstanbul Ortez Protez case](/vakalar/istanbul-ortez-protez-arama-gorunurlugu) we built content for classic SEO and GEO (optimization for AI search engines) alike — Q&A structure, technical depth, self-contained passages AI engines can cite directly. In fifteen months we reached the top 3 for priority searches; ad-supported terms brought an average of 10 new patients a month. For a small business, that's a cheaper and more durable visibility channel than a large ad budget.",
      },
    },
    {
      type: "h2",
      id: "reklam-butcesini-yatirima-cevirin",
      text: {
        tr: "4. Reklam bütçesini bir yatırım aracı olarak görün",
        en: "4. Treat your ad budget as an investment",
      },
    },
    {
      type: "p",
      text: {
        tr: "KOBİ'lerin en sık yaptığı hata, reklamı bir gider kalemi sayıp satışlar düştüğünde ilk ondan vazgeçmektir. Oysa doğru kurulmuş bir reklam sistemi, içine koyduğunuzdan fazlasını geri veren bir makinedir.",
        en: "The most common SME mistake is treating advertising as an expense and cutting it first when sales dip. A properly built ad system does the opposite: it's a machine that returns more than you put in.",
      },
    },
    {
      type: "p",
      text: {
        tr: "ROAS'a (reklam harcamasının getirisi) odaklanın — reklamın ne kadar harcadığına değil, ne kadar kazandırdığına bakın. LTV'yi (müşterinin yaşam boyu değeri) de hesaba katın: bir müşterinin yalnızca ilk alışverişte değil, önümüzdeki 12 ay boyunca size ne kazandıracağını bilirseniz, ilk reklam maliyetinizi buna göre belirleyebilirsiniz.",
        en: "Focus on ROAS (return on ad spend) — not how much the ad costs, but how much it returns. Factor in LTV (customer lifetime value) too: once you know what a customer earns you over the next 12 months, not just on their first order, you can set your acceptable first-purchase ad cost accordingly.",
      },
    },
    {
      type: "p",
      text: {
        tr: "[FYR vakamızda](/vakalar/fyr-luks-dekorasyon-lansmani) reklam getirisi 20 katın üzerinde seyretti; 12 aylık ciro hedefi 3 ayda geçildi. Bu tesadüf değildi — bütçe her hafta kazanan kreatife ve kazanan kitleye kaydırıldı, kaybeden hızla kapatıldı. KOBİ ölçeğinde bile aynı disiplin işler: küçük bütçeyle test edin, kazananı büyütün.",
        en: "In [our FYR case](/vakalar/fyr-luks-dekorasyon-lansmani), return on ad spend held above 20×; the 12-month revenue target was passed in 3 months. That wasn't luck — budget shifted every week toward the winning creative and audience, and losing ones were cut fast. The same discipline works at SME scale: test small, scale the winner.",
      },
    },
    {
      type: "h2",
      id: "otomasyon-ve-ai-ile-zaman-kazanin",
      text: {
        tr: "5. Otomasyon ve AI ile zaman kazanın",
        en: "5. Buy back time with automation and AI",
      },
    },
    {
      type: "p",
      text: {
        tr: "Ölçeklenmek, iş sahibinin her şeye yetişmesi değil, sistemin iş sahibi olmadan da dönmesidir. AI ve otomasyon araçları küçük bir işletmeye koca bir departman gibi çalışma gücü veriyor — ama araç seçimi ekip büyüklüğünüze uygun olmalı: on kişilik bir işletmenin kuracağı otomasyon, yüz kişilik bir işletmeninkiyle aynı olmaz.",
        en: "Scaling doesn't mean the owner keeps up with everything — it means the system keeps running without the owner. AI and automation tools give a small business the working capacity of a much larger department, but the tooling has to fit your team's size: what a ten-person business automates isn't what a hundred-person business automates.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Gece geç saatte gelen bir soruya anında yanıt veren bir sohbet sistemi müşteri sadakatini artırır. Müşterinin son alışverişinden belli bir süre sonra \"ürününüz bitmiş olabilir mi?\" diye hatırlatan bir CRM (müşteri ilişkileri yönetim sistemi), manuel iş yükünü ciddi oranda azaltır. Ekibiniz her gün aynı e-postaları elle yazıyorsa, vaktinizi ve paranızı çöpe atıyorsunuzdur.",
        en: "A chat system that answers instantly at midnight builds customer loyalty. A CRM (customer relationship management system) that nudges \"running low on this?\" a set number of days after the last order cuts manual workload sharply. If your team writes the same emails by hand every day, you're burning both time and money.",
      },
    },
    {
      type: "h2",
      id: "olceklenme-bir-sistemdir",
      text: {
        tr: "Sonuç: ölçeklenme bir sıçrama değil, bir sistem",
        en: "Conclusion: scaling isn't a leap, it's a system",
      },
    },
    {
      type: "p",
      text: {
        tr: "Dijitalde ölçeklenmek bir gecede gerçekleşen bir mucize değil, doğru psikolojik temellere oturtulmuş sistematik bir süreçtir. Ahmet Bey örneğine dönecek olursak: bugün o artık yalnızca kumaş satmıyor; kurduğu dijital sistemle hızlı moda ve kalite arayan binlerce kişiye aynı anda ulaşıyor.",
        en: "Scaling digitally isn't an overnight miracle — it's a systematic process built on the right psychological foundations. Back to Ahmet Bey: today he no longer just sells fabric; the digital system he built reaches thousands of people looking for fast fashion and quality, all at once.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Siz de reklam harcamalarınızı bir piyango olmaktan çıkarıp, veriye ve insan davranışına dayanan bir büyüme motoruna dönüştürebilirsiniz. Nereden başlayacağınızdan emin değilseniz, [vaka çalışmalarımıza](/vakalar) göz atın ya da [dijital dönüşüm hizmetimize](/hizmetler/dijital-donusum) bakın — hangi adımın işiniz için öncelik olduğunu birlikte belirleriz.",
        en: "You too can turn ad spend from a lottery ticket into a growth engine built on data and human behavior. If you're not sure where to start, take a look at [our case studies](/vakalar) or [our digital transformation service](/hizmetler/dijital-donusum) — together we'll work out which step is the priority for your business.",
      },
    },
  ],
  faq: [
    {
      question: {
        tr: "KOBİ dijitalleşmeye nereden başlamalı?",
        en: "Where should an SME start with digitalization?",
      },
      answer: {
        tr: "Kanaldan değil, ölçümden. Önce sitenizde ve reklam hesaplarınızda dönüşüm izleme sağlıklı çalışıyor mu kontrol edin — izlemeden gelen veriye güvenemezseniz hiçbir adım doğru sıralanmaz. Sonra tek bir darboğazı seçin: trafik mi az, dönüşüm mü düşük, yoksa tekrar eden müşteri mi yok. Beş adımı aynı anda değil, bu darboğaza göre sırayla uygulayın.",
        en: "Not with a channel — with measurement. First check whether conversion tracking on your site and ad accounts actually works; if you can't trust the data, no step gets sequenced correctly. Then pick a single bottleneck: too little traffic, low conversion, or no repeat customers. Apply the five steps in order against that bottleneck, not all at once.",
      },
    },
    {
      question: {
        tr: "Dijitalleşme için bütçe ne kadar olmalı?",
        en: "How big should the digitalization budget be?",
      },
      answer: {
        tr: "Kesin bir rakam yok, bir aralık var. Çoğu KOBİ için yıllık cironun tek haneli bir yüzdesi (kabaca %3-8 arası) dijital pazarlama ve altyapıya ayrılan makul bir başlangıç noktasıdır; kategori rekabeti ve büyüme hedefiniz bu oranı yukarı çeker. Rakamdan önce gelmesi gereken şey, hangi kanalın hangi sonucu getirdiğini ölçebiliyor olmanızdır — ölçemediğiniz bir bütçe, ne kadar büyük olursa olsun boşa gider.",
        en: "There's no fixed figure, only a range. For most SMEs, a single-digit share of annual revenue (roughly 3-8%) is a reasonable starting point for digital marketing and infrastructure; category competition and your growth target push that share up. What matters more than the number is being able to measure which channel produces which result — an unmeasured budget goes to waste no matter its size.",
      },
    },
    {
      question: {
        tr: "Ajansla mı çalışmalıyım, içeride ekip mi kurmalıyım?",
        en: "Should I work with an agency or build an in-house team?",
      },
      answer: {
        tr: "İkisi de yanlış değil, soru ölçek ve hız sorusu. Sonuç almanız gereken süre kısaysa ve konu tek seferlik bir kurulumsa (site, marka kimliği, ilk reklam sistemi), dışarıdan uzmanlık daha hızlı sonuç verir. Dijital operasyon işinizin sürekli bir parçası haline geldiğinde içeride bir ekip kurmak mantıklı hale gelir. Çoğu KOBİ ikisini birlikte kullanır: kurulumu dışarıyla yapar, günlük işletmeyi içeride devralır.",
        en: "Neither choice is wrong — it's a question of scale and speed. If you need results fast and the work is a one-time build (a site, a brand identity, a first ad system), outside expertise moves faster. Once digital operations become a permanent part of the business, an in-house team starts to make sense. Most SMEs use both: build with outside help, run the day-to-day in-house.",
      },
    },
    {
      question: {
        tr: "Sonuç ne zaman görülür?",
        en: "When do results show up?",
      },
      answer: {
        tr: "Kanala göre değişir. Reklam ve içerik ilk sinyalleri haftalar içinde verir; arama motoru görünürlüğü ve marka bilinirliği aylar ister — İstanbul Ortez Protez vakamızda öncelikli kelimelerde ilk 3'e çıkmak on beş ay sürdü. Erken sonuç bekleyen KOBİ'ler genellikle doğru kanalı zamanından önce terk eder; sabır burada bir strateji hatasını düzeltmekten daha ucuzdur.",
        en: "It depends on the channel. Ads and content give their first signals within weeks; search visibility and brand awareness take months — in our İstanbul Ortez Protez case, reaching the top 3 for priority keywords took fifteen months. SMEs expecting early results often abandon the right channel too soon; patience is cheaper here than fixing a strategy mistake later.",
      },
    },
  ],
  category: "growth",
  tags: ["kobi-dijitallesme", "buyume-stratejisi", "musteri-edinimi"],
  authorSlug: "burak-ozgul",
  publishedAt: "2025-12-21",
  readingMinutes: 6,
},
  // Eski blogdan taşındı (2025-12-22, WP kaynağı: satis-ekibinizin-vaktini-harcamayin-b2bde-...).
// SLA açıklaması ve MQL/SQL/ICP terimlerine ilk-kullanımda parantez açıklaması eklendi;
// Meccanotecnica Umbra vakası (teklif portalı + CRM otomasyonu) tezi kanıtlayan yeni bir
// h2 bölümü olarak eklendi. Kırık "yorumlarda paylaşın" kapanışı kaldırıldı, 4 soruluk SSS eklendi.
  {
    slug: {
      tr: "satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi",
      en: "b2b-lead-quality-guide",
    },
    title: {
      tr: "Satış ekibinizin vaktini harcamayın: B2B'de kaliteli lead toplama rehberi",
      en: "Stop wasting your sales team's time: a guide to quality B2B lead generation",
    },
    excerpt: {
      tr: "Pazarlama 1.000 yeni lead girdi diye kutluyor, satış ekibi hepsini arayıp sıfıra yakın sonuç alıyor. Bu rehber sayıyı değil alıcıyı büyütmenin yolunu anlatıyor: ICP daraltma, smarketing uyumu, lead scoring ve formda bilinçli sürtünme.",
      en: "Marketing celebrates 1,000 new leads while sales calls all of them for close to nothing. This guide is about growing the buyer, not the count: narrowing your ICP, smarketing alignment, lead scoring and deliberate form friction.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 22 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: sürtünme ve puanlama tavsiyelerini gerçek bir uygulamada gösteren Meccanotecnica Umbra vakası eklendi, smarketing bölümüne SLA açıklaması getirildi, MQL/SQL/ICP terimleri ilk geçtikleri yerde açıklandı ve dört soruluk SSS eklendi.",
      en: "First published on 22 December 2025. Revised on 23 August 2026: added the Meccanotecnica Umbra case showing the friction and scoring advice in a real deployment, added an SLA explanation to the smarketing section, defined MQL/SQL/ICP on first use, and added a four-question FAQ.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Pazarlama ekibi ofiste küçük bir kutlama yapıyor: bu ay sisteme tam 1.000 yeni lead girdi. Rakamlar harika görünüyor. Yan odada ise Satış Müdürü öfkeli — ekibi geçen haftayı bu 1.000 kişiyi aramakla geçirdi, sonuç sıfıra yakın. Listedekilerin çoğu ya stajyer ya da bütçesi olmayan meraklı. Şirket klasik bir tuzağa düşmüş: \"daha fazla lead\" hedefi. Biz buna Kibir Metrikleri (Vanity Metrics) diyoruz — rakam büyüyor, gelir büyümüyor. Ve o 1.000 aramanın her biri, satışçının başka bir yerde harcayabileceği gerçek zamandı.",
          en: "Marketing is celebrating in the next room: 1,000 new leads landed in the system this month. The numbers look great. Down the hall, the Sales Director is furious — the team spent last week calling all 1,000 of them for close to nothing. Most of the list was interns or curious visitors with no budget. The company has fallen into a classic trap: chasing \"more leads\". We call this Vanity Metrics — the number grows, the revenue doesn't. And every one of those 1,000 calls was real time a salesperson could have spent elsewhere.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Çok sayıda kalitesiz lead, hiç lead olmamasından daha kötüdür. Zamanınızı çalar, ekibin moralini bozar ve pazarlama ile satış arasındaki güveni aşındırır. Şirketler bu tuzağa çoğunlukla art niyetle değil, ölçüm alışkanlığıyla düşer: lead sayısı toplantıda gösterilmesi kolay bir rakamdır, gelir dönüşümü ise haftalar sonra ve dolaylı görünür. Bu rehberde sayıya değil alıcıya odaklanıyoruz: satışa dönmeyen kalabalığı elemenin ve gerçek alıcıyı erken teşhis etmenin pratik yollarına.",
          en: "A pile of low-quality leads is worse than no leads at all. It steals your time, drains the team's morale and erodes the trust between marketing and sales. Companies usually fall into this trap not out of bad intent but out of measurement habit: lead count is an easy number to show in a meeting, while revenue conversion shows up weeks later and indirectly. This guide focuses on the buyer, not the count — practical ways to filter out the crowd that never converts and spot the real buyer early.",
        },
      },
      {
        type: "h2",
        id: "ideal-musteri-profilini-daraltin",
        text: {
          tr: "İdeal müşteri profilini (ICP) daraltın",
          en: "Narrow your Ideal Customer Profile (ICP)",
        },
      },
      {
        type: "p",
        text: {
          tr: "Satış hunisini temizlemenin ilk adımı \"hayır\" demektir. Herkes sizin müşteriniz değildir; geniş tanımlardan kaçının. \"Lojistik firmalarına satıyoruz\" demek yetmez — hangi lojistik firması, hangi ciro aralığında, hangi bütçeyle?",
          en: "The first step in cleaning up your sales funnel is learning to say no. Not everyone is your customer; avoid broad definitions. Saying \"we sell to logistics companies\" isn't enough — which logistics companies, at what revenue range, with what budget?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İdeal Müşteri Profili (ICP — Ideal Customer Profile), demografik değil firmografik verilerle çizilir. Kişiyi değil şirketi tanımlayan üç soru:",
          en: "An Ideal Customer Profile (ICP) is drawn from firmographic data, not demographic data. Three questions that describe the company, not the person:",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Ciro büyüklüğü nedir?",
            en: "What's the revenue size?",
          },
          {
            tr: "Teknoloji veya dış hizmet bütçesi var mı?",
            en: "Is there a technology or outside-services budget?",
          },
          {
            tr: "Çalışan sayısı ne kadar, satın alma kararını kim veriyor?",
            en: "How many employees are there, and who actually makes the purchase decision?",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Ödeme gücü olmayan bir firmayla görüşmek, satış ekibine yapılan bir haksızlıktır. Genelde \"kimi istiyoruz\" diye sorarsınız; asıl faydalı soru şudur: \"kimi istemiyoruz?\" Stajyerler ve araştırma amaçlı gezinenler, rakip firma çalışanları, sektör dışı meraklılar — bu istenmeyenler listesini pazarlama ekibine verin, reklam hedeflemesi ve form filtreleri buna göre kurulsun. Çöp lead'in sisteme girişini kapıda engelleyin. İyi çizilmiş bir ICP'nin faydası aşağıdaki iki bölümde de görünür: hem MQL'den SQL'e geçiş oranı yükselir hem de puanlama sistemi daha az gürültülü çalışır — çünkü puanlanan kitle zaten doğru kitledir.",
          en: "Meeting with a company that can't afford you is unfair to your sales team. You usually ask \"who do we want\"; the more useful question is \"who don't we want?\" Interns and casual researchers, employees of competing firms, curious people outside your industry — hand that exclusion list to marketing, and let ad targeting and form filters be built around it. Keep junk leads from entering the system at the door. A well-drawn ICP pays off in the next two sections too: the MQL-to-SQL conversion rate rises, and the scoring system runs with less noise — because the audience being scored is already the right one.",
        },
      },
      {
        type: "h2",
        id: "mql-sql-smarketing",
        text: {
          tr: "Smarketing uyumu: MQL ve SQL savaşı bitsin",
          en: "Smarketing alignment: end the MQL vs. SQL war",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pazarlama ve satış ekipleri genelde birbirini suçlar: \"lead'ler kötü\" der satışçı, \"siz satamıyorsunuz\" der pazarlamacı. Bu kavgayı bitirmenin yolu, iki ekibin aynı dili konuşmasından geçer — buna smarketing (satış + pazarlama uyumu) denir.",
          en: "Marketing and sales tend to blame each other: \"the leads are bad,\" says sales; \"you can't sell,\" says marketing. Ending that fight means getting both teams to speak the same language — that's what's called smarketing (sales + marketing alignment).",
        },
      },
      {
        type: "p",
        text: {
          tr: "MQL (Pazarlama Nitelikli Lead — Marketing Qualified Lead), içeriğinizi okuyan, bilgi toplayan ama henüz satın almaya hazır olmayan kişidir. SQL (Satış Nitelikli Lead — Sales Qualified Lead) ise satın alma niyeti gösteren, hemen aranması gereken kişidir. Pazarlama ekibi her e-kitap indireni satışa göndermemeli; bu yalnızca gürültü yaratır.",
          en: "An MQL (Marketing Qualified Lead) is someone reading your content, gathering information, but not yet ready to buy. An SQL (Sales Qualified Lead) shows buying intent and needs to be called right away. Marketing shouldn't hand every ebook download to sales — that only creates noise.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu uyumu resmiyete bağlayan araç SLA'dır (Service Level Agreement — hizmet seviyesi anlaşması): pazarlama belirli sürede kaç MQL üretmeyi, satış ise ilk temasını kaç saat içinde kurmayı taahhüt eder. İletişim çift yönlü olmalı — satış ekibi, gelen lead'lerin kalitesini pazarlamaya raporlamalı, \"geçen haftaki elli lead çok kötüydü\" diyebilmeli. Veriye dayalı bu geri bildirim egoları devre dışı bırakır ve hedeflemeyi düzeltir. Zamanla iki ekip birbirinin dilini kullanmaya başlar; toplantılar \"kim haklıydı\" tartışmasından \"eşiği nereye çekelim\" konuşmasına döner.",
          en: "The tool that formalizes this alignment is an SLA (Service Level Agreement): marketing commits to producing a certain number of MQLs in a given period, sales commits to making first contact within a set number of hours. Communication has to run both ways — sales should report lead quality back to marketing, able to say \"last week's fifty leads were bad\". Data-driven feedback like that takes egos out of the room and corrects targeting. Over time both teams start speaking the same language; meetings shift from \"who was right\" to \"where do we set the threshold\".",
        },
      },
      {
        type: "h2",
        id: "lead-puanlama-sistemi",
        text: {
          tr: "Puanlama (lead scoring) sistemi kurun",
          en: "Build a lead scoring system",
        },
      },
      {
        type: "p",
        text: {
          tr: "Satışçınız sabah kimi arayacağına nasıl karar veriyor — rastgele mi? Bunu şansa bırakmayın. Davranışlara puan verin, yalnızca eşiği geçenleri arayın.",
          en: "How does your salesperson decide who to call first thing in the morning — at random? Don't leave it to chance. Score behavior, and only call the ones who clear the threshold.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Fiyat sayfasını gezdi: +20 puan.",
            en: "Visited the pricing page: +20 points.",
          },
          {
            tr: "Ürün demosunu izledi: +15 puan.",
            en: "Watched the product demo: +15 points.",
          },
          {
            tr: "Blog yazılarına baktı: +5 puan.",
            en: "Read a few blog posts: +5 points.",
          },
          {
            tr: "Kariyer sayfasına tıkladı: −50 puan (iş arıyor).",
            en: "Clicked the careers page: −50 points (job hunting).",
          },
          {
            tr: "Hizmet vermediğiniz bir ülkeden giriş yaptı: −100 puan.",
            en: "Visited from a country you don't serve: −100 points.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Sistemi otomatize edin. Bir lead eşiğe — örneğin 70 puana — ulaştığında satışçıya bildirim gitsin: \"sıcak lead, hemen ara.\" Bu tür bir uyarı kapanış oranını gözle görülür şekilde artırır. Puanlama sabit kalmaz: çeyrek başına gözden geçirilir, çünkü hangi davranışın gerçekten satın almayı öngördüğü zamanla değişir.",
          en: "Automate the system. When a lead crosses a threshold — say, 70 points — a notification should reach the salesperson: \"hot lead, call now.\" That kind of alert visibly lifts close rates. Scoring isn't static: review it every quarter, because which behaviors actually predict a purchase shifts over time.",
        },
      },
      {
        type: "h2",
        id: "formlarda-bilincli-surtunme",
        text: {
          tr: "Formlarda bilinçli sürtünme yaratın",
          en: "Create deliberate friction in your forms",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pazarlamacılar kısa formu sever — \"daha çok kişi doldursun\" ister. Ama B2B'de bu çoğu zaman yanlıştır. Formu bilerek zorlaştırın; buna bilişsel sürtünme denir.",
          en: "Marketers love short forms — they want more people to fill them in. In B2B that's often the wrong instinct. Make the form deliberately harder; this is called cognitive friction.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sadece isim ve e-posta yetmez. \"Bütçeniz nedir?\", \"Projeyi ne zaman başlatacaksınız?\" gibi sorular görüldüğünde meraklılar formu terk eder, gerçek alıcılar doldurur — çünkü çözüme gerçekten ihtiyaçları vardır. Kurumsal e-posta zorunluluğu getirin, Gmail veya Hotmail adresini engelleyin; bu basit kural lead kalitesini anında yükseltir. Sürtünmeyi tek bir uzun forma sıkıştırmak da zorunlu değil: kademeli profil oluşturma (progressive profiling) ile ilk temasta kısa form yeterli, derinleşen sorular ikinci ve üçüncü temasta gelir.",
          en: "Name and email aren't enough. Questions like \"what's your budget?\" or \"when are you starting the project?\" make the curious abandon the form — real buyers fill it in, because they actually need the solution. Require a company email, block Gmail and Hotmail addresses; that one simple rule lifts lead quality instantly. You don't have to cram all the friction into one long form, either: with progressive profiling, a short form is enough for the first touch, and the deeper questions arrive on the second or third.",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Çok sayıda kalitesiz lead, hiç lead olmamasından daha kötüdür.",
          en: "A pile of low-quality leads is worse than no leads at all.",
        },
      },
      {
        type: "h2",
        id: "sistemi-kanitlayan-vaka",
        text: {
          tr: "Sistemi kanıtlayan vaka: teklif portalı ve CRM otomasyonu",
          en: "The case that proves the system: a quote portal and CRM automation",
        },
      },
      {
        type: "p",
        text: {
          tr: "Teoride kolay duruyor: nitelik nicelikten önce gelir. Ama pratikte \"daha az ama iyi lead\" çoğu zaman \"daha az gelir\" korkusuyla karışır. [Meccanotecnica Umbra vakamız](/vakalar/meccanotecnica-umbra-teklif-portali) bu korkunun gerekçesiz olduğunu gösteriyor.",
          en: "In theory this is easy: quality comes before quantity. In practice, \"fewer but better leads\" often gets confused with \"less revenue\". [Our Meccanotecnica Umbra case](/vakalar/meccanotecnica-umbra-teklif-portali) shows that fear is unfounded.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Mekanik salmastra üreticisinin Türkiye kolu, teklif sürecini telefon ve e-postaya bağlı, elle yürütülen bir işten AI destekli teknik danışmana ve teklif portalına taşıdı. Mühendis kendi tesisini tarif ediyor — bu tarif, formdaki \"zor soru\"nun karşılığı: meraklı değil gerçek ihtiyaç sahibi doldurur. Talep doğrudan CRM otomasyonuna düşüyor, yanıt insan beklemeden gidiyor — yukarıda tarif ettiğimiz SLA mantığı burada yazılıma gömülü.",
          en: "The Türkiye arm of a mechanical seal manufacturer moved its quote process from phone calls and email — handled by hand — to an AI-powered technical advisor and a quote portal. The engineer describes their own plant — that description is the equivalent of the \"hard question\" in a form: the curious don't fill it in, someone with a real need does. The request lands straight in CRM automation, and a response goes out without waiting on a person — the SLA logic described above, built directly into software.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sonuç, nitelik-nicelik ikilemini bozuyor: teklif talebi 10 katına çıktı, talep ile yanıt arasındaki süre yüzde doksan kısaldı. Sürtünme lead'i azaltmadı — yanlış lead'i eledi, doğru lead'e otomatik hız kazandırdı. Nitelik ve nicelik birbirinin düşmanı değil; doğru kurulan sistemde ikisi birlikte gelir. Buradaki fark bir pazarlama numarası değil, mühendislik kararıydı: hangi soru sorulacak, hangi cevap otomasyonu tetikleyecek, kim ne zaman devreye girecek — hepsi baştan tasarlandı.",
          en: "The result breaks the quality-versus-quantity dilemma: quote requests rose tenfold, and the time between request and response fell by ninety percent. Friction didn't shrink lead volume — it filtered out the wrong leads and gave the right ones automatic speed. Quality and quantity aren't enemies; in a properly built system they arrive together. The difference here wasn't a marketing trick but an engineering decision: which question to ask, which answer triggers automation, who steps in and when — all of it designed upfront.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Nitelik yeni niceliktir",
          en: "Quality is the new quantity",
        },
      },
      {
        type: "p",
        text: {
          tr: "Büyük rakamlar egoyu tatmin eder, kaliteli rakamlar cüzdanı doldurur. Satış ekibinizin vaktini koruyun; onları \"hayır\" diyecek insanlarla görüştürmeyin, enerjilerini \"evet\"e yakın olanlara saklayın.",
          en: "Big numbers satisfy the ego; quality numbers fill the wallet. Protect your sales team's time — don't put them in front of people who'll say no, save their energy for the ones close to a yes.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün küçük bir temizlik yapın: lead listenize bakın, son üç ayda sonuçlanmayan kalabalığı silin. Odağı daraltın, geliri büyütün — sistem doğru kurulduğunda ikisi aynı anda gelir.",
          en: "Do a small cleanup today: look at your lead list, remove the crowd that went nowhere in the last three months. Narrow the focus, grow the revenue — with the system built right, both arrive together.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İlk adım için genellikle iki yer kontrol edilir: reklamın hangi lead'i çektiği ve formun onu nasıl elediği. [Performans pazarlama hizmetimize](/hizmetler/performans-pazarlama) göz atabilir ya da doğrudan bir görüşme planlayabilirsiniz.",
          en: "The first step usually means checking two things: which leads your ads are pulling in, and how your form filters them. Take a look at [our performance marketing service](/hizmetler/performans-pazarlama), or book a call directly.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "MQL ve SQL arasındaki fark nedir?",
          en: "What's the difference between an MQL and an SQL?",
        },
        answer: {
          tr: "MQL (Marketing Qualified Lead — Pazarlama Nitelikli Lead), içeriğinizi tüketen ama henüz satın almaya hazır olmayan kişidir; e-kitap indirmiş veya birkaç blog yazısı okumuş olabilir. SQL (Sales Qualified Lead — Satış Nitelikli Lead) ise fiyat sorması veya demo talep etmesi gibi somut satın alma niyeti gösteren kişidir. Ayrımı net tutmak satış ekibinin yalnızca hazır olanlarla vakit geçirmesini sağlar; olgunlaşmamış bir MQL'i satışa göndermek her iki ekibin de güvenini yıpratır.",
          en: "An MQL (Marketing Qualified Lead) is someone who has engaged with your content but isn't ready to buy yet — they might have downloaded an ebook or read a few articles. An SQL (Sales Qualified Lead) shows concrete buying intent: asking about pricing, requesting a demo. Keeping the line clear lets sales spend time only on people who are ready; pushing an MQL to sales before it matures erodes trust on both sides.",
        },
      },
      {
        question: {
          tr: "Lead kalitesi nasıl ölçülür?",
          en: "How do you measure lead quality?",
        },
        answer: {
          tr: "Üç göstergeye birlikte bakılır: ICP uyumu (firma doğru profile giriyor mu), davranışsal puan (lead scoring — hangi sayfaları gezdi, hangi eylemleri yaptı) ve satışın geri bildirimi (SQL'den fırsata, fırsattan kapanışa geçiş oranı). Tek bir 'doğru' eşik yoktur; sektöre ve satış döngüsünün uzunluğuna göre değişir. Önemli olan bu üç göstergeyi ayrı ayrı değil, birlikte ve düzenli olarak izlemektir.",
          en: "Three signals matter together: ICP fit (does the company match your ideal profile), behavioral score (lead scoring — which pages they visited, what actions they took), and sales feedback (the conversion rate from SQL to opportunity, and opportunity to close). There's no single 'right' threshold — it depends on your industry and sales cycle length. What matters is tracking all three signals together, consistently, not in isolation.",
        },
      },
      {
        question: {
          tr: "Form mu, doğrudan görüşme talebi mi daha iyi çalışır?",
          en: "Does a form work better than a direct meeting request?",
        },
        answer: {
          tr: "İkisi farklı işler görür. Kısa ama zor sorular içeren bir form, huninin üstünde meraklıyı eler ve ölçeklenir. Doğrudan görüşme talebi ise zaten ısınmış, SQL'e yakın kişi için sürtünmeyi azaltır ve satış döngüsünü hızlandırır. Sağlıklı bir B2B sitesinde ikisi birlikte durur: form erken aşamayı filtreler, görüşme talebi geç aşamayı hızlandırır.",
          en: "They do different jobs. A short form with hard questions filters out the curious at the top of the funnel and scales well. A direct meeting request removes friction for someone already warm, close to an SQL, and speeds up the sales cycle. On a healthy B2B site both sit side by side: the form filters the early stage, the meeting request accelerates the late one.",
        },
      },
      {
        question: {
          tr: "B2B'de kaç temas noktası normaldir?",
          en: "How many touchpoints are normal in B2B?",
        },
        answer: {
          tr: "Kesin bir sayı vermek yanıltıcı olur; B2B satış döngüsü genellikle tüketici satışından uzundur ve karar birden fazla kişiden geçer. Yaygın gözlem, genellikle altı ile on arasında değişen birden fazla temas noktasından bahseder — ama karar komitesinin büyüklüğü ve ürünün karmaşıklığı bu sayıyı ciddi şekilde değiştirir; kısacası sektöre göre değişir. Pratik çıkarım şu: tek seferde arayıp ulaşamadığınız kişiyi 'kötü lead' saymak yerine, davranışını lead scoring ile zaman içinde izlemek daha doğru sonuç verir.",
          en: "A precise number would be misleading — B2B sales cycles usually run longer than consumer ones, and the decision passes through more than one person. The common observation cites multiple touchpoints, often somewhere around six to ten, but committee size and product complexity shift that number considerably — in short, it depends on the industry. The practical takeaway: instead of writing off someone you couldn't reach in one call as a \"bad lead\", track their behavior over time with lead scoring.",
        },
      },
    ],
    category: "growth",
    tags: ["b2b-lead-kalitesi", "lead-scoring", "smarketing"],
    authorSlug: "burak-ozgul",
    publishedAt: "2025-12-22",
    readingMinutes: 6,
  },
  // Eski blogdan taşındı (2026-01-14, "yapay-zeka-aramalarinda-nasil-one-cikarsiniz").
  // Emre anlatısı ve kıtlık çerçevesi aynen korundu. Eklenenler: GEO tanım bölümü
  // (açılım + "AI SEO"/"LLM optimizasyonu" eş anlamlıları), sahadan kanıt bölümü
  // (SIM, İstanbul Ortez Protez, Meccanotecnica) ve 4 soruluk SSS. Çıkarılanlar:
  // "Case Study Önerisi" etiketli, kaynağı doğrulanamayan HubSpot rakamları;
  // "2. Temel Noktalar" numaralandırması; kırık "buraya tıklayın" CTA'sı ve ":)".
  // Tablo, blok modelinde prose+listeye çevrildi. TR slug eski URL ile aynı.
  {
    slug: {
      tr: "yapay-zeka-aramalarinda-nasil-one-cikarsiniz",
      en: "how-to-stand-out-in-ai-search",
    },
    title: {
      tr: "Algoritma sonrası çağ: ChatGPT ve Gemini sizi neden kaynak göstermiyor?",
      en: "The post-algorithm era: why don't ChatGPT and Gemini cite you?",
    },
    excerpt: {
      tr: "Emre'nin trafiği birkaç haftada %70 eridi; sitesinde bozulan hiçbir şey yoktu. Değişen, insanların arama yapmayı bırakıp soru sormaya başlamasıydı. GEO — üretken motor optimizasyonu — bu yeni düzende kaynak gösterilme işidir. Nasıl kurulduğunu sahadan üç vakayla anlatıyorum.",
      en: "Emre's traffic fell 70% in a few weeks with nothing broken on his site. What changed was that people stopped searching and started asking. GEO — generative engine optimization — is the work of getting cited in that new order. Here is how it gets built, told through three cases from the field.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 14 Ocak 2026'da yayımlandı. 23 Ağustos 2026'da gözden geçirildi: GEO'nun açık tanımını veren bölüm ve dört soruluk sık sorulan sorular eklendi, anlatılan yöntemin sahadaki karşılığı SIM Baskı, İstanbul Ortez Protez ve Meccanotecnica Umbra vakalarına bağlandı. Kaynağı doğrulanamayan üçüncü taraf örneği çıkarıldı — yerine kendi ölçtüğümüz rakamlar kondu.",
      en: "First published on 14 January 2026. Revised on 23 August 2026: a section defining GEO plainly and a four-question FAQ were added, and the method described here was tied to the SIM Printing, İstanbul Ortez Protez and Meccanotecnica Umbra cases. A third-party example whose source could not be verified was removed and replaced with numbers we measured ourselves.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Google'da ilk sırada olmak artık tek başına yetmiyor. Gemini, ChatGPT ve Perplexity kullanıcıya on mavi link vermiyor; tek bir yanıt veriyor ve o yanıtın içinde birkaç markayı kaynak gösteriyor. O listede yoksanız sıralamanız kaç olursa olsun konuşmanın dışındasınız — üstelik bunu size kimse haber vermiyor.",
          en: "Ranking first on Google is no longer enough on its own. Gemini, ChatGPT and Perplexity don't hand the user ten blue links; they hand over one answer, and inside that answer they cite a handful of brands. If you're not on that shortlist, your ranking is irrelevant — you are outside the conversation, and nobody sends you a notice about it.",
        },
      },
      {
        type: "h2",
        id: "ai-aramalarinda-var-misiniz",
        text: {
          tr: "Arama motorlarında varsınız, peki AI aramalarında?",
          en: "You exist in search engines — but do you exist in AI search?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Soğuk bir Ocak sabahı, e-ticaret yöneticisi Emre için beklenmedik bir sessizlikle başladı. Kahvesini alıp her sabah yaptığı gibi performans paneline tıkladı. Ekrandaki grafik bir başarı hikâyesini değil, sessiz bir çöküşü anlatıyordu: iki yıldır her ay düzenli artan trafik, birkaç hafta içinde %70 erimişti.",
          en: "A cold January morning began with an unexpected silence for Emre, an e-commerce manager. He picked up his coffee and opened the performance dashboard, the way he did every morning. The chart on the screen told no success story but a quiet collapse: traffic that had risen steadily every month for two years had melted by 70% in a matter of weeks.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Emre önce hatayı kendinde aradı. Sitede teknik bir sorun mu vardı? Google bir ceza mı kesmişti? Hayır, her şey yolundaydı. Sadece dünya değişmişti. Müşterileri artık \"en iyi kahve makinesi\" yazıp ilk sıradaki blog yazısına tıklamıyordu. Perplexity'yi ya da Gemini'yi açıp şunu soruyorlardı:",
          en: "Emre looked for the fault in himself first. Was something technically broken? Had Google issued a penalty? No — everything was fine. The world had simply changed. His customers no longer typed \"best coffee machine\" and clicked the top-ranked blog post. They opened Perplexity or Gemini and asked this:",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Mutfak tezgâhım dar, sabahları çok hızlı uyanmam lazım ve acı tatları sevmiyorum. Bana en uygun üç makineyi fiyatlarıyla karşılaştırıp birini önerir misin?",
          en: "My kitchen counter is narrow, I need to wake up fast in the mornings and I don't like bitter flavors. Could you compare the three machines that suit me best, with prices, and recommend one?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka bu soruyu anında yanıtladı. Emre'nin sitesini değil, içeriğini bu yeni nesil yanıt asistanlarına göre kurgulayan rakibini kaynak gösterdi. Emre binlerce kelimelik içeriğiyle internetin derinliklerinde görünmez hale gelmişti. Emre'yi bu yazı için kurguladım; sorduğu soruyu kurgulamadım. O soruyu bugün bir yanıt asistanına yazan gerçek alıcılar var — ve onların sorusu her ay biraz daha uzuyor.",
          en: "The AI answered instantly. It cited not Emre's site but the competitor who had shaped their content for this new generation of answer assistants. With thousands of words to his name, Emre had become invisible in the depths of the internet. I invented Emre for this article; I did not invent his question. There are real buyers typing that question into an answer assistant today — and their questions get a little longer every month.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Arama çubuğundan yanıt asistanına",
          en: "From the search bar to the answer assistant",
        },
      },
      {
        type: "p",
        text: {
          tr: "Geleneksel SEO linkleri listeler. Büyük dil modelleri (LLM) ise doğrudan kararı etkiler: kullanıcı artık bilgi aramıyor, doğru kararı satın almak istiyor. Bu, markalar için aynı anda hem tehdit hem fırsat. İçeriğiniz yapay zekanın ikna mekanizmasına veri sağlamıyorsa, listede yoksunuz. Kıt olan bilgi değil — o bilgiyi kullanılabilir hâle getiren bağlam. Geleceğin bilgi mimarisini bugünden kuran azınlık, bu kıtlığın karşılığını topluyor.",
          en: "Traditional SEO lists links. Large language models (LLMs) shape the decision itself: the user is no longer looking for information, they are buying the right decision. For brands that is a threat and an opening at once. If your content feeds nothing into the AI's mechanism of persuasion, you're not on the list. What is scarce isn't information — it's the context that makes information usable. The minority building tomorrow's information architecture today is the one collecting on that scarcity.",
        },
      },
      {
        type: "h2",
        id: "geo-nedir",
        text: {
          tr: "GEO nedir, SEO'dan nerede ayrılır?",
          en: "What is GEO, and where does it part ways with SEO?",
        },
      },
      {
        type: "p",
        text: {
          tr: "GEO (Generative Engine Optimization — üretken motor optimizasyonu), içeriği ChatGPT, Gemini, Perplexity ve Google AI Overviews gibi üretken arama sistemlerinin okuyup alıntılayabileceği biçimde kurma işidir. SEO'nun hedefi sıralamadır: kullanıcıyı sitenize tıklatmak. GEO'nun hedefi kaynak gösterilmektir: kullanıcı hiç tıklamasa bile yanıtın içinde markanızın adının, verinizin ve tavsiyenizin geçmesi. İkisi rakip değil, katmanlıdır — GEO, SEO'nun yerine geçmez, üstüne kurulur.",
          en: "GEO (generative engine optimization) is the work of shaping content so that generative search systems — ChatGPT, Gemini, Perplexity, Google AI Overviews — can read and cite it. SEO aims at ranking: getting the user to click through to your site. GEO aims at citation: getting your brand's name, your data and your recommendation into the answer even when the user never clicks. The two are layered rather than rival — GEO doesn't replace SEO, it is built on top of it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Alanın adı henüz oturmadı: kimi \"AI SEO\" diyor, kimi \"LLM optimizasyonu\". Üçü de aynı işi tarif ediyor. Biz GEO demeyi tercih ediyoruz, çünkü optimize ettiğimiz şey artık arama motoru değil, yanıtı üreten motorun kendisi.",
          en: "The field hasn't settled on a name: some say \"AI SEO\", others \"LLM optimization\". All three describe the same work. We prefer GEO, because what we optimize for is no longer the search engine but the engine that generates the answer.",
        },
      },
      {
        type: "h2",
        id: "sorgu-psikolojisi",
        text: {
          tr: "Sorgu psikolojisi: üç kelimeden yirmi üç kelimeye",
          en: "Query psychology: from three words to twenty-three",
        },
      },
      {
        type: "p",
        text: {
          tr: "Eski dünyada üç kelime yeterliydi. \"Spor ayakkabı modelleri\" yazar, sonuçları tarardık. Bugün zihin farklı çalışıyor: kullanıcı yapay zekayı bir araç değil, bir asistan sayıyor — ve asistanına derdini olduğu gibi anlatıyor. \"Diz kapağımda ağrı var, her gün 5 kilometre koşuyorum, hangi taban teknolojisi beni korur?\" Bu artık bir sorgu değil; yirmi üç kelimelik bir brief.",
          en: "In the old world three words did the job. You typed \"running shoe models\" and scanned the results. Today the mind works differently: the user treats AI not as a tool but as an assistant — and tells that assistant the whole problem. \"My knee hurts, I run 5 kilometers a day, which sole technology will protect me?\" That is no longer a query; it is a twenty-three-word brief.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Sorgu artık bağlam taşıyor: bütçe, kısıt, kullanım senaryosu ve itiraz aynı cümlenin içinde geliyor.",
            en: "The query now carries context: budget, constraint, use case and objection all arrive inside one sentence.",
          },
          {
            tr: "Yanıt asistanı bu bağlamı karşılayan içeriği seçiyor, karşılamayanı elemek için ikinci bir tıklamaya ihtiyaç duymuyor.",
            en: "The answer assistant picks the content that meets that context, and needs no second click to discard the content that doesn't.",
          },
          {
            tr: "Kazanan içerik, anahtar kelimeyi en çok tekrarlayan değil, kısıtı en net karşılayan oluyor.",
            en: "The winning content isn't the one repeating the keyword most often, it's the one answering the constraint most clearly.",
          },
          {
            tr: "Bu yüzden ürün sayfası tek başına yetmiyor: müşterinin kısıtını konuşan bir içeriğiniz yoksa model sizi bilmiyor.",
            en: "This is why a product page alone falls short: if you have no content that speaks to the customer's constraint, the model doesn't know you exist.",
          },
        ],
      },
      {
        type: "quote",
        text: {
          tr: "Müşteriniz markanızı bir yapay zekaya nasıl tarif ederdi? Sadece ürün adıyla mı, yoksa çözdüğünüz o kritik problemle mi?",
          en: "How would your customer describe your brand to an AI? By the product name alone, or by the critical problem you solve?",
        },
      },
      {
        type: "h2",
        id: "yanit-oncelikli-mimari",
        text: {
          tr: "Yanıt-öncelikli mimari: içeriği makinenin alabileceği hâle getirmek",
          en: "Answer-first architecture: making content the machine can pick up",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka modelleri makale girişindeki uzun ve süslü cümlelerle vakit kaybetmez; içerikteki en net cevabı saniyeler içinde ayıklar. Biz buna yanıt-öncelikli mimari diyoruz ve dört kuralı var.",
          en: "AI models don't linger over the long, decorative opening of an article; they extract the clearest answer inside it within seconds. We call this answer-first architecture, and it has four rules.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Başlıklar soru olsun. Makineler H2'leri doğrudan kullanıcı sorgularıyla eşleştirir — \"Hizmetlerimiz\" hiçbir sorgunun karşılığı değildir, \"GEO çalışması ne kadar sürer?\" bir sorunun tam karşılığıdır.",
            en: "Make headings questions. Machines match H2s straight to user queries — \"Our services\" answers no query, \"How long does GEO work take?\" answers one exactly.",
          },
          {
            tr: "İlk elli kelime kuralı. Başlıktan sonraki ilk paragraf net ve kesin bilgiyi versin; hikâyeyi sonraya saklayın.",
            en: "The first-fifty-words rule. Let the first paragraph after the heading deliver the plain, precise information; save the story for later.",
          },
          {
            tr: "Modüler yazın. Her bölüm tek başına okunduğunda anlamlı olsun — bağlamını bir üstteki paragrafa yaslayan cümle alıntılanamaz.",
            en: "Write in modules. Every section should stand up when read alone — a sentence that leans on the paragraph above it for context cannot be quoted.",
          },
          {
            tr: "Kanıtı metnin içine koyun. Rakam, tarih, kısıt ve kaynak cümlenin içinde geçsin; modelin doğrulayacak başka bir yeri yok.",
            en: "Put the proof inside the text. Numbers, dates, constraints and sources belong in the sentence itself; the model has nowhere else to verify them.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Değişimi üç satırda özetlemek gerekirse: anahtar kelime yoğunluğunun yerini yanıt doğruluğu aldı, uzun ve dolaylı girişlerin yerini doğrudan çözüm paragrafı, tıklama avcısı başlıkların yerini sorgu yanıtlayan modüler başlıklar. Kural sert ama basit — bilginiz parçalara ayrılamıyorsa referans da gösterilemez.",
          en: "The shift in three lines: keyword density gave way to answer accuracy, long indirect introductions to direct solution paragraphs, click-bait headlines to modular headings that answer queries. The rule is blunt but simple — if your knowledge can't be broken into parts, it can't be cited either.",
        },
      },
      {
        type: "h2",
        id: "sahadan-kanit",
        text: {
          tr: "Sahadan kanıt: bunu müşterilerimizde nasıl uyguladık",
          en: "Proof from the field: how we applied this with our clients",
        },
      },
      {
        type: "p",
        text: {
          tr: "Buraya kadarı çerçeve. Bu çerçeveyi yazabilmemizin sebebi, aynı yapıyı üç ayrı sektörde kurup sonucunu ölçmüş olmamız.",
          en: "Everything so far is the frame. The reason we can write it is that we've built the same structure in three different industries and measured what came out.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[SIM Baskı Malzemeleri](/vakalar/sim-baski-ihracat-icerigi) 1983'ten beri matbaa sektörüne üretim yapıyor, ama kırk yıllık teknik bilgisi hiçbir yerde yazılı değildi: ne arama motorunun ne de AI motorunun alıntılayacağı tek bir cümle vardı. Siteyi beş dilli bir Next.js uygulaması olarak yeniden kurduk ve içerikleri tam bu yazıdaki mimariyle yazdık — içindekiler yapısı, soru-cevap bölümleri, kendine yeten pasajlar. Altı ayda organik trafik 15 katına çıktı; AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı. Marka artık sorulduğunda kaynak gösterilen taraf.",
          en: "[SIM Printing Suppliers](/vakalar/sim-baski-ihracat-icerigi) has manufactured for the press industry since 1983, yet forty years of technical knowledge existed nowhere in writing: there wasn't a single sentence for a search engine or an AI engine to cite. We rebuilt the site as a five-language Next.js application and wrote the content on exactly the architecture described here — tables of contents, Q&A sections, self-contained passages. In six months organic traffic grew 15×, and visibility across AI engines went from zero to 40,000. The brand is now the source that gets cited.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[İstanbul Ortez Protez'de](/vakalar/istanbul-ortez-protez-arama-gorunurlugu) aynı içerik yapısını güvenin en pahalı olduğu alanda kurduk: tıbbi ürünlerde soru-cevap mimarisi, teknik derinlik ve alıntılanabilir pasajlar. Kasım 2024'te başladık; on beş ayda \"biyonik protez\" başta olmak üzere öncelikli kelimelerde organik ilk 3'e çıktık ve ayda ortalama 10 yeni hasta geldi. Buradaki ders şu: GEO yalnız e-ticaretin işi değil. Alıcı ne kadar çok soru soruyorsa, yanıt asistanı o kadar belirleyici oluyor.",
          en: "At [İstanbul Ortez Protez](/vakalar/istanbul-ortez-protez-arama-gorunurlugu) we built the same content structure in the field where trust is most expensive: Q&A architecture, technical depth and quotable passages for medical devices. We started in November 2024; within fifteen months we reached the organic top 3 for priority terms, \"bionic prosthetics\" first among them, and an average of 10 new patients arrived each month. The lesson: GEO is not an e-commerce concern alone. The more questions a buyer asks, the more decisive the answer assistant becomes.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[Meccanotecnica Umbra'da](/vakalar/meccanotecnica-umbra-teklif-portali) bir adım öteye gittik. İçeriği yalnız dışarıdaki modelin okuması için değil, sitenin kendi modelinin kullanması için kurduk: mühendis tesisini anlatıyor, AI teknik danışman tüm fabrikaya uygun donanımı tek formda çıkarıyor. SEO ve GEO mimarisi dört dilde (TR, EN, AR, RU) aynı anda kuruldu. Teklif talebi 10 katına çıktı, yanıt süresi yüzde doksan kısaldı. AI-native yaklaşımın tarifi budur: yapay zekaya görünmekle yetinmeyip yapay zekayı kendi satış sürecinizin içine koymak — bu da artık [AI danışmanlığı](/hizmetler/ai-danismanlik) tarafının işi.",
          en: "At [Meccanotecnica Umbra](/vakalar/meccanotecnica-umbra-teklif-portali) we went a step further. We structured the content not only for the model outside to read but for the site's own model to use: the engineer describes their plant and an AI technical advisor lays out equipment for the whole facility in a single form. The SEO and GEO architecture was built in four languages (TR, EN, AR, RU) at once. Quote requests rose tenfold and response time fell by ninety percent. That is what AI-native means in practice: not settling for being visible to AI, but placing AI inside your own sales process — which is where [AI advisory](/hizmetler/ai-danismanlik) takes over.",
        },
      },
      {
        type: "h2",
        id: "bu-hafta-nereden-baslanir",
        text: {
          tr: "Bu hafta nereden başlanır?",
          en: "Where do you start this week?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kimseyi beklemeden yapabileceğiniz bir teşhis var. Kendi kategorinizin üç zor sorusunu ChatGPT'ye, Gemini'ye ve Perplexity'ye sorun — müşterinizin soracağı gibi, bütün bağlamıyla. Yanıtta kimin adı geçiyor? Kaynak olarak hangi sayfa gösteriliyor? O üç ekran görüntüsü, elinizdeki en dürüst rekabet analizidir ve hiçbir araca para vermeden alınır.",
          en: "There's a diagnosis you can run without waiting for anyone. Ask the three hardest questions in your category to ChatGPT, Gemini and Perplexity — phrased the way your customer would, with the full context. Whose name appears in the answer? Which page is cited as the source? Those three screenshots are the most honest competitive analysis you'll get, and they cost nothing.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sonra kendi sitenize dönün ve tek bir soru sorun: bu sayfadan rastgele bir paragraf kesip alsam, tek başına anlamlı ve alıntılanabilir olur mu? Cevap hayırsa, sıralamanız kaç olursa olsun yeni düzende görünmezsiniz. Cevabı evete çevirmek bir yeniden yazma işi — ve rakiplerinizin çoğu bu işe henüz başlamadı.",
          en: "Then return to your own site and ask one question: if I cut a paragraph out of this page at random, would it stand alone and be quotable? If the answer is no, your ranking won't save you in the new order. Turning that no into a yes is a rewriting job — and most of your competitors haven't started it yet.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yapının kurulmuş hâlini rakamlarıyla görmek isterseniz [vaka sayfalarımız](/vakalar) açık duruyor. Emre'nin paneli gerçek olmayabilir; oradaki eğri fazlasıyla gerçek.",
          en: "If you'd like to see this structure built, with the numbers attached, [our case pages](/vakalar) are open. Emre's dashboard may not be real; the curve on it very much is.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "GEO nedir?",
          en: "What is GEO?",
        },
        answer: {
          tr: "GEO, Generative Engine Optimization'ın kısaltmasıdır; Türkçesi üretken motor optimizasyonu. ChatGPT, Gemini, Perplexity ve Google AI Overviews gibi üretken arama sistemleri bir soruya tek bir yanıt üretir ve o yanıtın içinde birkaç kaynağı gösterir. GEO, içeriği bu sistemlerin okuyup güvenle alıntılayabileceği biçimde kurma işidir: soru formatında başlıklar, kendine yeten pasajlar, metnin içine yerleştirilmiş rakam ve kaynaklar, makine tarafından okunabilir yapısal işaretleme. Sektörde aynı iş için \"AI SEO\" ve \"LLM optimizasyonu\" terimleri de kullanılıyor.",
          en: "GEO stands for generative engine optimization. Generative search systems — ChatGPT, Gemini, Perplexity, Google AI Overviews — produce a single answer to a question and cite a handful of sources inside it. GEO is the work of shaping content so those systems can read it and cite it with confidence: headings in question form, self-contained passages, figures and sources placed inside the text, and machine-readable structured markup. The same work also travels under the terms \"AI SEO\" and \"LLM optimization\".",
        },
      },
      {
        question: {
          tr: "GEO ile SEO'nun farkı ne?",
          en: "What is the difference between GEO and SEO?",
        },
        answer: {
          tr: "Hedefleri farklı. SEO sıralama için çalışır: amaç, kullanıcının sonuç listesinde sizi görüp sitenize tıklamasıdır. GEO alıntılanma için çalışır: amaç, kullanıcı hiç tıklamasa bile üretilen yanıtın içinde markanızın adının, verinizin ve tavsiyenizin geçmesidir. Ölçüleri de farklıdır — SEO'da sıra ve tıklama, GEO'da yanıtlarda anılma sıklığı ve kaynak gösterilme oranı izlenir. İkisi rakip değil katmanlıdır: teknik sağlık, hız ve indekslenebilirlik olmadan bir AI motoru sizi zaten okuyamaz, dolayısıyla GEO sağlam bir SEO temelinin üstüne kurulur.",
          en: "They aim at different outcomes. SEO works for ranking: the goal is that the user sees you in the result list and clicks through. GEO works for citation: the goal is that your brand's name, data and recommendation appear inside the generated answer even if the user never clicks. Their measures differ too — SEO tracks position and clicks, GEO tracks how often you're mentioned in answers and how often you're cited as a source. The two are layered rather than rival: without technical health, speed and indexability an AI engine can't read you at all, so GEO is built on a solid SEO foundation.",
        },
      },
      {
        question: {
          tr: "AI aramalarında kaynak olarak nasıl gösterilirim?",
          en: "How do I get cited as a source in AI search?",
        },
        answer: {
          tr: "Dört şart var. Birincisi yapı: başlıkları müşterinizin sorduğu soru biçiminde yazın ve her başlığın altındaki ilk paragrafta net cevabı verin. İkincisi kendine yetme: bir paragraf tek başına kesilip alındığında anlamlı olmalı, bağlamını bir üst paragrafa yaslamamalı. Üçüncüsü kanıt: rakam, tarih, kısıt ve kaynak cümlenin içinde geçmeli — modelin doğrulayacak başka yeri yok. Dördüncüsü teknik zemin: hızlı açılan, taranabilir, yapısal işaretleme (Article, FAQPage) taşıyan ve içeriği JavaScript arkasına saklamayan sayfalar. Başlamak için en dürüst adım, kategorinizin üç zor sorusunu bugün bir yanıt asistanına sorup kimin gösterildiğine bakmaktır.",
          en: "Four conditions. First, structure: write headings the way your customer phrases the question, and give the plain answer in the first paragraph beneath each one. Second, self-containment: a paragraph must make sense when cut out on its own, without leaning on the one above it for context. Third, proof: figures, dates, constraints and sources belong inside the sentence — the model has nowhere else to verify them. Fourth, technical ground: pages that load fast, can be crawled, carry structured markup (Article, FAQPage) and don't hide their content behind JavaScript. The most honest first step is to ask the three hardest questions in your category to an answer assistant today and see who gets cited.",
        },
      },
      {
        question: {
          tr: "GEO çalışması ne kadar sürede sonuç verir?",
          en: "How long does GEO work take to show results?",
        },
        answer: {
          tr: "Süre sektöre, rekabete ve sitenin mevcut teknik durumuna göre değişir; kesin bir takvim veren herkese temkinli yaklaşın. Kendi ölçtüğümüz iki uç şöyle: SIM Baskı Malzemeleri'nde site yeniden kurulup içerik programı yürütüldükten sonra altı ayda organik trafik 15 katına çıktı ve AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı. İstanbul Ortez Protez'de ise tıbbi alanın rekabeti ve güven eşiği nedeniyle öncelikli kelimelerde ilk 3'e çıkmak on beş ay sürdü. Pratikte ilk sinyaller (yanıtlarda anılma, uzun kuyruklu sorularda görünme) genellikle 2-3 ay içinde okunmaya başlar; kalıcı konum için altı aydan uzun bir içerik programı gerekir.",
          en: "It depends on the sector, the competition and the site's current technical state; be wary of anyone who gives you a fixed calendar. Two ends of our own measured range: at SIM Printing Suppliers, after the site was rebuilt and the content program ran, organic traffic grew 15× in six months and visibility across AI engines went from zero to 40,000. At İstanbul Ortez Protez, the competition and trust threshold of a medical field meant reaching the top 3 for priority terms took fifteen months. In practice the first signals — being mentioned in answers, surfacing on long-tail questions — usually become readable within 2-3 months; a durable position takes a content program running longer than six.",
        },
      },
    ],
    category: "growth",
    tags: ["geo", "ai-seo", "icerik-stratejisi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-01-14",
    readingMinutes: 7,
  },
  // Kaynak: indoles_eski/wp-icerik/yazilar/neden-profesyonel-video-sart.md
  // ("Abi Telefonla Çekeriz Demeyin: Neden Profesyonel Video Şart?", 2026-01-15, ~560 kelime).
  // Golden ifade ("Abi Telefonla Çekeriz Demeyin") başlıkta ve metinde aynen korundu. Tez tek
  // kanıtsız iddiadan somut vaka kanıtına taşındı: OdorGo (10M+ film izlenmesi, olmayan
  // kategoride 8 ayda 10M TL), GYMWOLVES ve FYR Luxury bağlandı; UGC yazısının "ikisi birden"
  // teziyle çelişkisiz denge kuran bölüm ve 4 soruluk SSS eklendi. Kırık "buraya tıklayın" CTA'sı
  // kaldırıldı, /vakalar bağlantısıyla değiştirildi.
  {
    slug: {
      tr: "neden-profesyonel-video-sart",
      en: "why-professional-video-is-non-negotiable",
    },
    title: {
      tr: "\"Abi Telefonla Çekeriz\" Demeyin: Neden Profesyonel Video Şart?",
      en: "Don't Say \"Abi, We'll Just Shoot It on a Phone\": Why Professional Video Is Non-Negotiable",
    },
    excerpt: {
      tr: "Bir dostum yeni koleksiyonunu \"bizim çocuklarla ofiste çekeriz\" diyerek telefonla çekti. Sonuç hüsran oldu. Bu yazı o hüsranın neden kaçınılmaz olduğunu ve OdorGo'nun aynı kararı tersten alıp olmayan bir kategoride nasıl 10 milyon TL'ye ulaştığını anlatıyor.",
      en: "A friend of mine shot his new collection himself, saying \"we'll just film it in the office.\" It was a disaster. This piece explains why — and how OdorGo made the opposite call and built a ₺10M category that didn't exist.",
    },
    updatedAt: "2026-08-23",
    updateNote: {
      tr: "Bu yazı ilk olarak 15 Ocak 2026'da yayımlandı. 23 Ağustos 2026'da gözden geçirildi: teze somut kanıt olarak OdorGo, GYMWOLVES ve FYR Luxury vakalarına bağlantı eklendi, UGC ile çelişmeyen bir denge bölümü ve 4 soruluk SSS eklendi, kırık CTA kaldırıldı.",
      en: "First published on 15 January 2026. Revised on 23 August 2026: added links to the OdorGo, GYMWOLVES and FYR Luxury cases as concrete proof, a section balancing the argument against UGC, a 4-question FAQ, and removed a broken CTA.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Geçenlerde bir iş yemeğinde eski bir dostumun başına gelenleri dinledim. Kendisi tekstil sektöründe yılların deneyimine sahip, ürününe sonuna kadar güvenen bir iş insanı. Yeni koleksiyonu için bir tanıtım filmi hazırlatmak istemiş. Bütçe toplantısında bir anlık refleksle şunu söylemiş: \"Abi, en son model telefonum var, bizim çocuklarla ofiste çekeriz, boşuna masraf yapmayalım.\"",
          en: "I heard what happened to an old friend at a business dinner recently. He has years of experience in textiles and full confidence in his product, and wanted a promo film for his new collection. In the budget meeting, on reflex, he said: \"Abi, I've got the latest phone — we'll shoot it in the office, no need to waste money.\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sonuç tam bir hüsran olmuş. O kadar güvendiği ipek kumaşlar, kötü ışık ve amatör kadraj yüzünden sıradan bir pazaryeri ürünü gibi görünmüş. Reklam yayına girdiğinde beklediği \"premium\" etkiyi yaratamadığı gibi, sadık müşterilerinden \"Kaliteyi mi düşürdünüz?\" telefonları almış. O an anlamış: profesyonellik yalnızca bir cihaz meselesi değil, bir algı yönetimi meselesiymiş.",
          en: "It was a disaster. The silk fabrics he trusted so much looked like a generic marketplace product, undone by bad lighting and amateur framing. The ad missed the \"premium\" effect he wanted, and loyal customers started calling to ask \"Did you lower your quality?\" That's when he understood: professionalism isn't about equipment. It's about managing perception.",
        },
      },
      {
        type: "h2",
        id: "produksiyondan-bahsedelim",
        text: {
          tr: "Peki, prodüksiyondan bahsedelim",
          en: "Now, let's talk about production",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pazarlama dünyasında herkesin bildiği ama sık göz ardı ettiği bir kural var.",
          en: "There's a rule everyone in marketing knows and routinely ignores.",
        },
      },
      {
        type: "quote",
        text: {
          tr: "İçerik kraldır — ama kıyafeti kirliyse kimse onun kral olduğuna inanmaz.",
          en: "Content is king — but if its clothes are dirty, nobody believes it's royalty.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün telefonlar gerçekten harika görüntü çekiyor. Ama o cihazı kimin, hangi stratejiyle kullandığı asıl farkı yaratıyor. Ekipman iyileşti; fark kapanmadı, yer değiştirdi — artık lensin kalitesinde değil, bakışın kalitesinde.",
          en: "Phones genuinely shoot great footage today. But who's using the device, and with what strategy, is what makes the difference. The equipment improved; the gap didn't close, it moved — from the lens's quality to the eye behind it.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Beynimiz kaliteyi güvenle eşleştirir",
          en: "Your brain equates quality with trust",
        },
      },
      {
        type: "p",
        text: {
          tr: "Psikolojide buna \"halo etkisi\" deniyor: izleyici, videonun teknik kalitesini doğrudan ürünün kalitesiyle özdeşleştirir. Görüntüdeki parazit veya kötü ışık, bilinçaltında \"bu marka detaya önem vermiyor\" mesajını tetikler. Profesyonel bir prodüksiyon ise tam tersini fısıldar: \"İşimizi ciddiye alıyoruz.\"",
          en: "Psychology calls this the \"halo effect\": the viewer maps a video's technical quality directly onto the product's quality. Noise or bad lighting in the frame quietly triggers \"this brand doesn't care about detail.\" A professional production whispers the opposite: \"We take this seriously.\"",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Kulak, gözden daha az affeder",
          en: "The ear forgives less than the eye",
        },
      },
      {
        type: "p",
        text: {
          tr: "Görüntüdeki küçük bir bulanıklığı izleyici genelde tolere eder. Cızırtılı veya yankılı bir sesi etmez — konuşmacının güvenilirliği sesle birlikte düşer. Profesyonel bir ekibin görüntü kadar sese de yatırım yapmasının sebebi bu: reklamı izleyenin kulağı, gözünden daha eleştirmen.",
          en: "Viewers usually forgive a soft image. They don't forgive crackling or echoing audio — the speaker's credibility drops with the sound quality. That's why a professional crew invests as much in sound as in image: the ear judging your ad is harsher than the eye.",
        },
      },
      {
        type: "h2",
        id: "icerik-ve-kalite-12den-vurma-sanati",
        text: {
          tr: "İçerik ve kalite: 12'den vurma sanatı",
          en: "Content and quality: the art of the bullseye",
        },
      },
      {
        type: "p",
        text: {
          tr: "İçerik videonun ruhu, kalite ise bedenidir. Yüksek çözünürlük tek başına yetmez — harika bir fikir kötü bir uygulama yüzünden harcanıp gidebilir. Telefonla çekim yapmak mümkün, ama ne yaptığını bilen ellerde anlam kazanır. Hem güçlü bir senaryo hem kristal netliğinde bir görüntü sunduğunuzda kitlenizi 12'den vurursunuz; bu ikisi ayrı ayrı değil birlikte çalıştığında marka sizi rakiplerin fersah fersah önüne taşır.",
          en: "Content is the video's soul, quality is its body. High resolution alone isn't enough — a great idea can be wasted on poor execution. Shooting on a phone is possible, but it only means something in hands that know what they're doing. Pair a strong script with crystal-clear footage and you hit the bullseye — together, not separately, is what pulls a brand miles ahead of the competition.",
        },
      },
      {
        type: "h2",
        id: "guclu-kanit-odorgo",
        text: {
          tr: "Güçlü kanıt: OdorGo nasıl on milyon TL'lik bir kategori kurdu",
          en: "The hard evidence: how OdorGo built a ₺10M category that didn't exist",
        },
      },
      {
        type: "p",
        text: {
          tr: "Teoriyi bir kenara bırakıp rakama bakalım. [OdorGo](/vakalar/odorgo-kategori-yaratma) bize elinde yalnızca ürünle geldi — koku giderici, Türkiye'de büyük oyuncuların bile girmekte tereddüt ettiği, tüketici farkındalığı sıfır bir kategoriydi. Arama hacmi yoktu çünkü kimse böyle bir ürünü aramıyordu; performans pazarlaması tek başına işe yaramazdı, önce talebin kendisi kurulmalıydı.",
          en: "Let's set theory aside and look at the numbers. [OdorGo](/vakalar/odorgo-kategori-yaratma) came to us with nothing but a product — an odor eliminator, in a category even Türkiye's biggest players hesitated to enter, with zero consumer awareness. There was no search volume, because nobody was searching for it; performance marketing alone couldn't work — demand itself had to be built first.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kategoriyi anlattığımız yer reklam filmleriydi: kedi kumu, genç erkek odası, evde balık pişirmek — soyut bir kategori tanımı yerine izleyiciye kendi evindeki bir anı gösterdik. Bu filmler dijital kanallarda 10 milyonun üzerinde izlendi ve kategori dilini tek başına taşıdı. Tek çekimden çıkan içerik onlarca kanalı besledi: sosyal medya, e-ticaret sitesi, pazaryeri vitrinleri. Sekiz ay sonunda marka, olmayan bir kategoride 10 milyon TL ciroya ulaştı ve MacroCenter, Migros, Happy Center raflarına girdi.",
          en: "The films explained the category: cat litter, a teenage boy's room, cooking fish at home — instead of defining it in the abstract, we showed viewers a moment from their own homes. Viewed more than 10 million times across digital channels, they carried the category's language on their own. Content cut from a single shoot fed dozens of channels — social, the e-commerce site, marketplace listings. Eight months later the brand had reached ₺10M in revenue in a category that hadn't existed, and its product sat on the shelves of MacroCenter, Migros and Happy Center.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu bir \"telefonla da olurdu\" hikâyesi değil. Sıfır farkındalıklı bir kategoriyi tüketicinin gözünde var etmek, kırık ışıkla veya amatör kadrajla yapılabilecek bir iş değildi — güven, ürün mesajı kadar görüntünün kendisinden de kuruldu.",
          en: "This isn't a \"the phone would've worked too\" story. Making a zero-awareness category real in a consumer's mind was never a job for broken lighting or amateur framing — trust here was built by the image as much as by the message.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı mantık farklı ölçeklerde tekrar ediyor. [GYMWOLVES](/vakalar/gymwolves-12-kat-satis)'te sporcularla çekilen görsel kanıt kampanyayı besledi ve satış üç ayda 12 katına çıktı. [FYR Luxury](/vakalar/fyr-luks-dekorasyon-lansmani)'de lüks segmentte fotoğraf ve video prodüksiyonu marka pozisyonunu tek elden kurdu; 12 aylık ciro hedefi 3 ayda geçildi. Üç vaka, üç farklı sektör, tek ortak payda: görüntünün kalitesi markanın vaadiyle aynı seviyede durdu.",
          en: "The same logic repeats at different scales. At [GYMWOLVES](/vakalar/gymwolves-12-kat-satis), visual proof shot with real athletes fed the campaign and sales rose 12× in three months. At [FYR Luxury](/vakalar/fyr-luks-dekorasyon-lansmani), photo and video production built the luxury brand's position as one system; a 12-month target was passed in 3 months. Three cases, three industries, one thread: the image's quality matched the brand's promise.",
        },
      },
      {
        type: "h2",
        id: "ugc-ile-celismez",
        text: {
          tr: "UGC ile çelişmez: ikisi birden çalışır",
          en: "It doesn't compete with UGC — both work together",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bunu UGC'ye karşı bir yazı sanmayın. Kullanıcı içeriği gerçek bir güç — ilişkilenebilir, samimi, güven kurar. Ama ikisi aynı işi yapmıyor: UGC markanın etrafına özgünlük katmanı ekler, profesyonel prodüksiyon ise o katmanın üzerine oturacağı yapıyı ve otoriteyi kurar. Biri diğerinin yerine geçmez; sırayla değil, birlikte çalışırlar. OdorGo'da da böyleydi — reklam filmi kategoriyi kurdu, kullanıcı yorumları ve paylaşımları o kategorinin üzerine bindi.",
          en: "Don't read this as a piece against UGC. User-generated content is a real force — relatable, sincere, trust-building. But the two don't do the same job: UGC adds a layer of authenticity around the brand; professional production builds the structure that layer sits on. Neither replaces the other — they work together, not in turns. It was the same at OdorGo: the commercials built the category, and user reviews rode on top of it.",
        },
      },
      {
        type: "h2",
        id: "telefon-cekimi-ne-zaman-yeterli",
        text: {
          tr: "Telefon çekimi ne zaman yeterli?",
          en: "When is a phone shoot actually enough?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dürüst olalım: her çekim reklam filmi olmak zorunda değil. Telefonla çekim gerçek bir araçtır — doğru yerde kullanıldığında.",
          en: "Let's be honest: not every shoot needs to be a commercial. A phone is a real tool — when it's used in the right place.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Kamera arkası ve günlük içerik: ekibi, süreci, atölyeyi gösteren sosyal medya paylaşımları.",
            en: "Behind-the-scenes and day-to-day content: social posts showing the team, the process, the workshop.",
          },
          {
            tr: "Hızlı test içeriği: bir reklam fikrinin işe yarayıp yaramadığını düşük bütçeyle ölçmek.",
            en: "Quick test content: gauging whether an ad idea works, on a low budget, before committing further.",
          },
          {
            tr: "Anlık, zamana bağlı paylaşım: bir fuar standı, bir lansman gecesi — o anın samimiyeti asıl değeriyse.",
            en: "Time-bound, in-the-moment posts: a trade fair booth, a launch night — when the sincerity of the moment is the whole point.",
          },
          {
            tr: "UGC ve müşteri deneyimi içeriği: samimiyetin kendisi mesajsa, cila o mesajı bozar.",
            en: "UGC and customer-experience content: when sincerity itself is the message, polish undermines it.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Ama markanın en görünür yüzü — ana reklam filmi, lansman videosu, satış ekibinin teklif sunumunda oynattığı içerik — bu listede değil. Orası ilk izlenimin tek şansta kurulduğu yer; ilk izlenim ikinci bir çekimle telafi edilmez.",
          en: "But a brand's most visible face — the flagship commercial, the launch video, the reel sales plays in a pitch — isn't on this list. The first impression gets exactly one shot there, and a reshoot doesn't fix it.",
        },
      },
      {
        type: "h2",
        id: "markanizin-gelecegini-sansa-birakmayin",
        text: {
          tr: "Markanızın geleceğini şansa bırakmayın",
          en: "Don't leave your brand's future to chance",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Telefonla hallederiz\" yaklaşımı kısa vadede tasarruf gibi görünür. Uzun vadede marka itibarına mal olur — dostumun tekstil markasında olduğu gibi. Profesyonel bir video yalnızca bir tanıtım aracı değil; markanızın dijital dünyadaki imzasıdır.",
          en: "The \"we'll handle it on a phone\" approach looks like savings short-term. Long-term, it costs you brand reputation — as it did for my friend's textile brand. A professional video isn't just a promotional tool; it's your brand's signature in the digital world.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Doğru prodüksiyon ortağını seçerken üç şeyi sorun: geçmiş işlerin gerçek rakamı, benzer ölçekte bir referans, tek çekimden kaç farklı içerik çıkacağının net bir planı. \"Her şeyi yaparız\" diyenden değil, bunu somut cevaplayandan güven duyun.",
          en: "When choosing a production partner, ask three things: real numbers from past work, a reference at a similar scale, and a clear plan for how many pieces of content one shoot will produce. Trust whoever answers that concretely — not whoever claims to do everything.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Doğru prodüksiyon kararının markaya ne kazandırdığını rakamlarıyla görmek isterseniz, [vaka sayfalarımıza](/vakalar) göz atın — her biri adı ve rakamıyla orada duruyor.",
          en: "If you want the numbers behind what the right production decision earns a brand, look at [our case pages](/vakalar) — each one stands there, named and numbered.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Profesyonel video maliyeti neye göre belirlenir?",
          en: "What determines the cost of a professional video?",
        },
        answer: {
          tr: "Kesin bir rakam vermek mümkün değil — maliyet çekim süresine, ekip büyüklüğüne, lokasyon ve stüdyo ihtiyacına, oyuncu/talent kullanımına ve post-prodüksiyonun kapsamına (renk düzenleme, ses tasarımı, motion graphics, kaç farklı format ve süre kesildiği) göre değişir. Doğru soru \"ne kadar tutar\" değil, \"bu bütçe kaç farklı içerik üretecek\" olmalı; tek çekimden çıkan içerik sayısı birim maliyeti aşağı çeker.",
          en: "There's no fixed figure — cost depends on shoot length, crew size, location and studio needs, whether talent is used, and the scope of post-production (grading, sound design, motion graphics, how many formats and cuts). The right question isn't \"how much\" but \"how many pieces of content will this budget produce\" — more assets per shoot means lower cost per piece.",
        },
      },
      {
        question: {
          tr: "Telefon çekimi ne zaman yeterli?",
          en: "When is a phone shoot actually enough?",
        },
        answer: {
          tr: "Kamera arkası paylaşımlar, düşük bütçeli test içerikleri, fuar veya lansman gibi anlık paylaşımlar ve UGC tarzı müşteri deneyimi içeriklerinde telefon gerçek bir araçtır — hatta bazen cila fazla bile olur. Markanın en görünür yüzü olan ana reklam filmi veya lansman videosu için önerilmez; orada ilk izlenim tek şansta kurulur.",
          en: "For behind-the-scenes posts, low-budget test content, in-the-moment shares like a trade fair or launch night, and UGC-style customer content, a phone is a real tool — polish can even work against you there. It's not the answer for a brand's most visible face, the flagship commercial or launch video, where the first impression gets exactly one shot.",
        },
      },
      {
        question: {
          tr: "Reklam filmi kaç saniye olmalı?",
          en: "How long should a commercial be?",
        },
        answer: {
          tr: "Sabit bir kural yok — süre platforma ve mecraya göre değişir. YouTube pre-roll veya TV için 15-30-60 saniyelik versiyonlar, sosyal medya için 6-15 saniyelik kesitler yaygındır. Doğru yaklaşım, tek bir profesyonel çekimden bu farklı sürelerin tamamını planlayarak çıkarmaktır; süre kararını çekim öncesinde, hangi kanalda nasıl kullanılacağına bakarak vermek gerekir.",
          en: "There's no fixed rule — length depends on platform and placement. 15-, 30- and 60-second versions are common for YouTube pre-roll or TV, 6- to 15-second cuts for social media. The right approach is to plan all these lengths out of one professional shoot, deciding beforehand where and how each cut will run.",
        },
      },
      {
        question: {
          tr: "Tek çekimden kaç içerik çıkar?",
          en: "How many pieces of content come out of a single shoot?",
        },
        answer: {
          tr: "Kapsam ve planlamaya bağlı, ama profesyonel bir çekim genelde tek bir filmden fazlasını verir: ana reklam filmi, platforma göre kısaltılmış versiyonlar, sosyal medya kesitleri ve fotoğraf karesi çıktıları aynı günde üretilebilir. OdorGo'da olduğu gibi tek çekim onlarca kanalı besleyebiliyorsa, birim maliyet tek bir video için değil, o çekimden çıkan tüm içerik ailesi için hesaplanmalı.",
          en: "It depends on scope and planning, but a professional shoot usually yields more than one film: the flagship commercial, platform-specific cuts, social edits and stills can all come from the same day. When one shoot feeds dozens of channels, as it did at OdorGo, the per-unit cost should be measured against the whole family of content it produces — not against a single video.",
        },
      },
    ],
    category: "growth",
    tags: ["video-produksiyon", "reklam-filmi", "marka-algisi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-01-15",
    readingMinutes: 6,
  },
];

export function getArticleBySlug(
  slug: string,
  locale: "tr" | "en"
): ArticleContent | null {
  // Çapraz locale slug'ı bilerek çözülmez (ADR-018 kuralı): /en altında TR
  // slug 404 döner. İki URL'in aynı içeriği sunması canonical sinyalini böler.
  return ARTICLES.find((a) => a.slug[locale] === slug) ?? null;
}
