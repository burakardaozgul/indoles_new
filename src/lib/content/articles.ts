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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 27 Temmuz 2024'te yayımlandı. 22 Ağustos 2026'da gözden geçirildi: \"AI çağında gerilla pazarlama\" bölümü ve sık sorulan sorular eklendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi ve ilgili hizmet, vaka ve yazı sayfalarına iç bağlantılar eklendi.",
      en: "First published on 27 July 2024. Revised on 22 August 2026: the \"Guerrilla marketing in the AI age\" section and the FAQ were added. On 28 August 2026 the section headings were rewritten as questions and internal links to the related service, case and article pages were added.",
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
          tr: "Gerilla pazarlama nereden doğdu?",
          en: "Where did guerrilla marketing come from?",
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
          tr: "Dijital araçlar gerilla pazarlamayı nasıl değiştirdi?",
          en: "How did digital tools change guerrilla marketing?",
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
          tr: "Hikâye anlatımı neden kampanyanın merkezinde?",
          en: "Why is storytelling at the centre of a campaign?",
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
          tr: "Tüketicinin bilgi bombardımanına tutulduğu bir çağda hikâyeler, markaların gürültüyü aşmasına ve kitleleriyle duygusal bağ kurmasına yardımcı olur. İyi kurgulanmış bir anlatı, basit bir pazarlama numarasını tüketicide derinden yankı uyandıran bir marka deneyimine dönüştürür; o anlatının omurgasını [marka stratejisi](/hizmetler/marka-stratejisi) kurar.",
          en: "In an age of information bombardment, stories help brands cut through the noise and build emotional bonds with their audience. A well-built narrative turns a simple marketing stunt into a brand experience that resonates deeply; the spine of that narrative comes from [brand strategy](/hizmetler/marka-stratejisi).",
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
          tr: "Etkili bir gerilla kampanyası için markanın, kitlesinin davranışları ve tercihleri hakkında gerçek içgörü toplaması gerekir. Bu, temel demografinin ötesine geçmek demektir: tüketici eylemini yönlendiren motivasyonu, duyguyu ve deneyimi anlamak. Veri analitiği ve sosyal dinleme araçları tam burada devreye girer — sosyal medya konuşmaları, çevrimiçi yorumlar ve müşteri geri bildirimi analiz edildiğinde trendler, karşılanmamış ihtiyaçlar ve kampanyanın konuşacağı gerçek dert ortaya çıkar. Kitlenin kendi ürettiği içerik bu dinlemenin en dürüst kaynağıdır; [sosyal kanıtın neden her reklamdan güçlü olduğunu](/yazilar/ugc-kullanimi-ve-sosyal-kanit) ayrı bir yazıda ele aldık.",
          en: "An effective guerrilla campaign requires real insight into the audience's behaviour and preferences. That means going beyond basic demographics: understanding the motivation, emotion and experience driving consumer action. Data analytics and social listening tools come in exactly here — analyse social conversations, online reviews and customer feedback, and the trends, unmet needs and the real pain the campaign should speak to come to the surface. The audience's own content is the most honest source in that listening; we covered [why social proof beats any ad](/yazilar/ugc-kullanimi-ve-sosyal-kanit) in a separate piece.",
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
          en: "The genius of the campaign was personalisation. Every consumer who saw their own name on a bottle formed a personal connection; the narrative was simple but strong: sharing a Coke means bonding with the people you love and making the moment special. On the insight side, Coca-Cola picked the most popular names in each market through data analytics, tracked the campaign's impact in real time through social listening, and adjusted as needed. The results showed in the numbers: a lift in sales, widespread social engagement and a renewed emotional bond between brand and consumer.",
        },
      },
      {
        type: "h2",
        id: "ai-caginda-gerilla-pazarlama",
        text: {
          tr: "2026 güncellemesi: AI çağında gerilla pazarlama neden güçlendi?",
          en: "2026 update: why did guerrilla marketing get stronger in the AI age?",
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
          tr: "İkincisi: kampanyanın ikinci hayatı artık AI motorlarında geçiyor. İnsanlar \"en iyi gerilla kampanyaları\" sorusunu Google'a olduğu kadar ChatGPT'ye, Gemini'ye ve Perplexity'ye de soruyor. Bu motorlar hakkında yazılan, konuşulan, kaynak gösterilen işleri anlatıyor. Yani denklem netleşti: konuşulmaya değer iş, alıntılanabilir iştir. Kampanyanız hakkında haber yazdırıyor, sözlük girdisi açtırıyor, video çektiriyorsa — AI cevaplarında yıllarca yaşamaya devam eder. Buna bugün [GEO (Generative Engine Optimization)](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) diyoruz; gerilla pazarlama, GEO'nun en doğal beslenme kaynağıdır.",
          en: "Second: a campaign's second life now plays out inside AI engines. People ask \"the best guerrilla campaigns\" not only to Google but to ChatGPT, Gemini and Perplexity. These engines retell the work that got written about, talked about, cited. The equation is now clear: work worth talking about is work worth citing. If your campaign gets articles written, entries opened, videos shot — it keeps living inside AI answers for years. Today we call this [GEO (Generative Engine Optimization)](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz), and guerrilla marketing is its most natural feedstock.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üçüncüsü: dağıtımın omurgası değişti. Stunt'ı çekip paylaşan kitle, kampanyanın medya bütçesidir. Kısa video (Reels, TikTok, Shorts) ve mikro-influencer'lar, 2024'te tamamlayıcıydı; bugün ana kanal. Sahada yüz kişinin yaşadığı bir an, doğru kurgulanırsa milyonlarca kişinin izlediği bir hikâyeye dönüşüyor. [OdorGo vakasında](/vakalar/odorgo-kategori-yaratma) bir kategori tam olarak bu mekanikle kuruldu.",
          en: "Third: the backbone of distribution changed. The crowd that films and shares the stunt is the campaign's media budget. Short video (Reels, TikTok, Shorts) and micro-influencers were complementary in 2024; today they're the main channel. A moment lived by a hundred people on the street becomes, with the right framing, a story watched by millions. In the [OdorGo case](/vakalar/odorgo-kategori-yaratma), an entire category was built on exactly this mechanic.",
        },
      },
      {
        type: "h2",
        id: "etkili-kampanya-icin-5-ipucu",
        text: {
          tr: "Etkili bir kampanya için hangi beş ilke geçerli?",
          en: "Which five principles make a campaign effective?",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Teknolojiden yararlanın: AR, kısa video ve üretken AI araçları erişiminizi katlar — ama aracı değil, fikri merkeze koyun.",
            en: "Use technology: AR, short video and generative AI tools multiply your reach — but put the idea at the centre, not the tool.",
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
          tr: "Gerilla pazarlama; büyük medya bütçesi yerine yaratıcılığa, sürprize ve alışılmadık mecralara dayanan pazarlama yaklaşımıdır. Amaç, hedef kitlenin beklemediği bir yerde ve anda unutulmaz bir marka deneyimi yaratmaktır. Terim, Jay Conrad Levinson'ın 1984 tarihli \"Guerrilla Marketing\" kitabıyla yaygınlaştı. Bugün yöntem dijital araçlarla birleşti; ölçülebilirlik de bu birleşmeyle geldi.",
          en: "Guerrilla marketing is an approach that relies on creativity, surprise and unconventional channels instead of a big media budget. The goal is to create an unforgettable brand experience where and when the audience least expects it. The term spread with Jay Conrad Levinson's 1984 book \"Guerrilla Marketing\".",
        },
      },
      {
        question: {
          tr: "Gerilla pazarlama küçük işletmeler için uygun mu?",
          en: "Is guerrilla marketing suitable for small businesses?",
        },
        answer: {
          tr: "Evet — hatta yöntem tam olarak bunun için doğdu. Gerilla pazarlamanın girdisi bütçe değil fikirdir: yerel bir stunt, doğru kurgulanmış bir kısa video ve paylaşan bir topluluk, küçük bir işletmeye büyük medya bütçelerinin satın alamayacağı bir görünürlük kazandırabilir. Belirleyici olan bütçe kalemi değil, fikrin paylaşılmaya değer olup olmadığıdır.",
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
      {
        question: {
          tr: "Gerilla pazarlama kampanyasına nereden başlanır?",
          en: "Where do you start a guerrilla marketing campaign?",
        },
        answer: {
          tr: "İçgörüden başlanır, fikirden değil. Önce veri analitiği ve sosyal dinlemeyle kitlenizin motivasyonunu, tercihlerini ve gerçek derdini çıkarın; kampanya fikri bu derdin üzerine kurulur. Mecra ve teknoloji seçimi en sona kalır, çünkü doğru fikir yanlış mecrada bile konuşulur, yanlış fikir doğru mecrada bile duyulmaz.",
          en: "Start with insight, not with the idea. Use analytics and social listening to surface what actually motivates your audience, what they prefer and what frustrates them; the campaign idea gets built on top of that. Channel and technology come last, because the right idea still gets talked about in the wrong channel, while the wrong idea stays silent in the right one.",
        },
      },
      {
        question: {
          tr: "Gerilla pazarlama ile geleneksel reklam arasındaki fark nedir?",
          en: "What is the difference between guerrilla marketing and traditional advertising?",
        },
        answer: {
          tr: "Geleneksel reklam dikkati satın alır, gerilla pazarlama dikkati kazanır. Birincisi erişimi medya bütçesiyle ölçekler ve mesajı tekrar ederek yerleştirir; ikincisi beklenmedik bir an kurar ve dağıtımın büyük kısmını paylaşan kitleye bırakır. İkisi rakip değil: gerilla işi konuşmayı başlatır, ücretli mecra o konuşmayı sürdürür.",
          en: "Traditional advertising buys attention; guerrilla marketing earns it. The first scales reach with a media budget and plants the message through repetition; the second builds an unexpected moment and hands most of the distribution to the people who share it. They are not rivals: a guerrilla stunt starts the conversation and paid media keeps it going.",
        },
      },
      {
        question: {
          tr: "Gerilla pazarlama kampanyasının başarısı nasıl ölçülür?",
          en: "How do you measure the success of a guerrilla campaign?",
        },
        answer: {
          tr: "Dijital araçlar sokak pazarlamasını tarihinde ilk kez ölçülebilir kıldı: erişim, paylaşım, marka adının arama hacmi ve kampanya sonrası satış eğrisi birlikte okunur. 2026'da listeye bir kalem daha eklendi — yapay zeka motorlarındaki görünürlük, yani kampanyanız sorulduğunda ChatGPT, Gemini ve Perplexity'nin markanızı anıp anmadığı. Tek bir metrik yetmez.",
          en: "Digital tools made street marketing measurable for the first time in its history: reach, shares, branded search volume and the post-campaign sales curve get read together. In 2026 one more line joined the list — visibility inside AI engines, meaning whether ChatGPT, Gemini and Perplexity name your brand when someone asks about the category. No single metric is enough on its own.",
        },
      },
      {
        question: {
          tr: "Gerilla pazarlamada en sık yapılan hata nedir?",
          en: "What is the most common mistake in guerrilla marketing?",
        },
        answer: {
          tr: "Aracı fikrin önüne koymak. Artırılmış gerçeklik, kısa video ve üretken yapay zeka erişimi katlar; ama herkesin aynı araçlara eriştiği bir ortamda fark hâlâ fikirde. İkinci sık hata sahicilikten kopmaktır: markanın değerleriyle çelişen bir stunt dikkat çeker ama arkasında güven bırakmaz, çoğu zaman da açıklama yapmak zorunda bırakır.",
          en: "Putting the tool ahead of the idea. Augmented reality, short video and generative AI multiply reach, but where everyone has the same tools the difference still comes from the idea. The second common mistake is losing authenticity: a stunt that contradicts the brand's values draws attention without leaving trust behind, and usually forces an apology afterwards.",
        },
      },
      {
        question: {
          tr: "Artırılmış gerçeklik ve kısa video bir kampanyaya ne katar?",
          en: "What do augmented reality and short video add to a campaign?",
        },
        answer: {
          tr: "Sahadaki anı ölçeğe bağlarlar. Bir şehirde kurgulanan artırılmış gerçeklik temelli hazine avı katılımcıyı hem sokakta hem çevrimiçi meşgul eder; kısa video ise o anı sahada bulunmayan milyonlara taşır. 2024'te tamamlayıcı olan kısa video ve mikro-influencer dağıtımı bugün ana kanal — stunt'ı çeken kitle, kampanyanın medya bütçesidir.",
          en: "They connect the moment on the ground to real scale. An AR-based treasure hunt staged across a city keeps participants engaged both on the street and online; short video then carries that moment to millions who were never there. What was a supporting channel in 2024 — short video and micro-influencers — is now the main one: the crowd filming the stunt is the campaign's media budget.",
        },
      },
      {
        question: {
          tr: "Kişiselleştirme bir gerilla kampanyasını nasıl büyütür?",
          en: "How does personalisation grow a guerrilla campaign?",
        },
        answer: {
          tr: "Kitleyi izleyicilikten katılımcılığa geçirerek. Coca-Cola'nın \"Share a Coke\" kampanyası şişedeki ikonik logoyu yaygın isimlerle değiştirdi; kendi adını gören her tüketici kampanyanın taşıyıcısına dönüştü. İsim seçimi duyguyla değil veriyle yapıldı — her pazardaki en popüler isimler analitikle belirlendi, etki sosyal dinlemeyle gerçek zamanlı izlendi ve kampanya gerektiğinde ayarlandı.",
          en: "By moving the audience from watching to taking part. Coca-Cola's \"Share a Coke\" swapped the iconic logo on the bottle for common first names, and every consumer who found their own name became a carrier of the campaign. The names were not picked on instinct — analytics selected the most popular ones per market, social listening tracked the effect in real time, and the campaign was adjusted as it ran.",
        },
      },
    ],
    category: "growth",
    topic: "marka-hikaye",
    tags: ["gerilla-pazarlama", "hikaye-anlaticiligi", "growth-hacking"],
    authorSlug: "cagri-erdogan",
    publishedAt: "2024-07-27",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "Gerilla pazarlama: dijital çağda ne değişti",
        en: "Guerrilla marketing in the digital age",
      },
      description: {
        tr: "Levinson'ın 1984'te adını koyduğu yöntem bugün growth hacking'in atası sayılıyor. Share a Coke örneği, yapay zeka çağının kuralları ve beş uygulama ipucu.",
        en: "Levinson named the tactic in 1984; today it underpins growth hacking. What the Share a Coke campaign proved, and five rules for running one in the AI era.",
      },
    },
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 30 Temmuz 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: sonuç bölümü yeniden yazıldı, \"Sezar'dan dil modellerine\" notu ve sık sorulan sorular eklendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi ve ilgili hizmet, vaka ve yazı sayfalarına iç bağlantılar eklendi.",
      en: "First published on 30 July 2024. Revised on 23 August 2026: the conclusion was rewritten, and the \"From Caesar to language models\" note and the FAQ were added. On 28 August 2026 the section headings were rewritten as questions and internal links to the related service, case and article pages were added.",
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
          tr: "Hikâyenizi bir Sezar gibi anlatın",
          en: "Tell your story like a Caesar",
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
          tr: "Aynı teknik pazarlamada da geçerli. Kitleniz her gün bilgi bombardımanına tutuluyor; bu gürültüyü yalnızca ilgi çekici hikâyeler aşabilir. Apple, Nike ve Coca-Cola bu sanatta ustalaştı: Apple'ın hikâyesi teknolojiyle değil, statükoya meydan okumakla ilgilidir. Nike'ın \"Just Do It\" kampanyası sporla değil, insan ruhu ve zorlukların üstesinden gelmekle ilgilidir. Steve Jobs iPhone'u tanıttığında özelliklerini saymadı; iletişimin geleceği hakkında bir hikâye anlattı — ve o anlatı, iPhone'u bir statü sembolüne dönüştürdü. Bu anlatıyı kuran iş [marka stratejisinin](/hizmetler/marka-stratejisi) kendisidir.",
          en: "The same technique holds in marketing. Your audience is bombarded with information every day; only compelling stories cut through that noise. Apple, Nike and Coca-Cola mastered this art: Apple's story isn't about technology, it's about defying the status quo. Nike's \"Just Do It\" isn't about sports, it's about the human spirit overcoming odds. When Steve Jobs introduced the iPhone he didn't list features; he told a story about the future of communication — and that narrative turned the iPhone into a status symbol. The work that builds such a narrative is [brand strategy](/hizmetler/marka-stratejisi) itself.",
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
          tr: "İçgörü: kitlenizi neden derinden tanımalısınız?",
          en: "Insight: why must you know your audience deeply?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Etkili strateji, kitlenin ne istediğini tahmin etmekle değil ölçmekle kurulur. Sezar'ın Roma Forumu'nda yürüdüğünü, insanların seslerini dinlediğini, endişelerini anladığını ve duygularını ölçtüğünü hayal edin. Halkın zihnine dair bu keskin içgörü, stratejilerini uyarlamasına ve gücünü korumasına yardımcı oldu. Kitlelerin desteği olmadan gücünün geçici olacağını biliyordu; danışmanlarından, halka açık forumlardan, hatta düşmanlarından içgörü topladı.",
          en: "Effective strategy is built by measuring what an audience wants, not by guessing it. Picture Caesar walking the Roman Forum, listening to people's voices, understanding their worries, gauging their emotions. That sharp insight into the public mind helped him adapt his strategies and hold his power. He knew that without the crowd's support his power would be fleeting; he gathered insight from advisers, public forums, even his enemies.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün aynı işi veri analitiği, sosyal dinleme ve müşteri geri bildirimi yapıyor. Netflix'in başarısı izleme alışkanlıklarını okuyup içeriği kişiye uyarlamasına dayanır; Amazon kişiselleştirilmiş öneriden özel reklama kadar her adımı müşteri içgörüsüyle kurar. Ölçek değişti, ilke değişmedi: kitlenizi derinden tanımadan etkili strateji kuramazsınız. Küçük bir işletmenin bunu tek tabloyla yapmasının yolu [RFM analizidir](/yazilar/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi).",
          en: "Today the same job is done by data analytics, social listening and customer feedback. Netflix's success rests on reading viewing habits and tailoring content to the person; Amazon builds every step, from personalised recommendations to targeted ads, on customer insight. The scale changed, the principle didn't: you can't build an effective strategy without knowing your audience deeply. For a small business, the way to do that in a single spreadsheet is [RFM analysis](/yazilar/kucuk-isletmeler-icin-rfm-analizi-ile-satislari-artirma-rehberi).",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Segmentlere ayırın: kitlenizi davranış, demografi ve psikografiye göre bölün; strateji segment başına netleşir.",
            en: "Segment: divide your audience by behaviour, demographics and psychographics; strategy sharpens per segment.",
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
          tr: "İnsan psikolojisi satın alma kararını nasıl etkiler?",
          en: "How does human psychology shape a buying decision?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Karar, ürün özelliklerinden önce dört sabit üzerinden verilir: kıtlık, sosyal kanıt, karşılıklılık ve otorite. Sezar hem müttefiklerinin hem rakiplerinin zihinlerini etkilemekte ustaydı. İnsanları neyin motive ettiğini anlıyor, stratejilerini doğrudan arzulara ve korkulara hitap edecek şekilde kuruyordu. İnsan doğasına dair bu derin anlayış, bugünün pazarlamasında antik Roma'daki kadar geçerli.",
          en: "A decision runs on four constants before it runs on product features: scarcity, social proof, reciprocity and authority. Caesar was a master at influencing the minds of allies and rivals alike. He understood what motivates people and shaped his strategies to speak directly to desires and fears. That deep understanding of human nature is as valid in today's marketing as it was in ancient Rome.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Modern karşılıkları biliyorsunuz: kıtlık, sosyal kanıt, karşılıklılık, otorite. Lüks markalar sınırlı üretim ve süreli tekliflerle aciliyet yaratır; çevrimiçi yorumlar ve [kullanıcı içerikleri](/yazilar/ugc-kullanimi-ve-sosyal-kanit) satın alma kararını sosyal kanıtla döndürür. Bunlar numara değil, insan davranışının sabitleridir — doğru kullanıldığında güven kurar, yanlış kullanıldığında markayı yakar.",
          en: "You know the modern counterparts: scarcity, social proof, reciprocity, authority. Luxury brands create urgency with limited runs and timed offers; online reviews and [user content](/yazilar/ugc-kullanimi-ve-sosyal-kanit) turn purchase decisions on social proof. These are not tricks but constants of human behaviour — used right they build trust, used wrong they burn the brand.",
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
          tr: "2026 notu: Sezar'dan dil modellerine ne değişti, ne değişmedi?",
          en: "2026 note: from Caesar to language models — what changed, what didn't?",
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
          tr: "İçgörü tarafında Netflix ve Amazon'un veri oyunu artık KOBİ'lerin de elinde: AI destekli analiz araçları segmentasyonu ve kişiselleştirmeyi ölçekledi. Ve yeni bir dinleyici geldi: dil modelleri. İnsanlar markaları artık ChatGPT'ye, Gemini'ye ve Perplexity'ye soruyor; bu motorlar da hikâyesi net anlatılmış, hakkında tutarlı konuşulan markaları aktarıyor. Sezar'ın Senato'su bugün kısmen bir dil modelinin cevabı — hikâyeniz orada da anlatılmaya değer olmalı. Bu motorlarda [nasıl öne çıkıldığını](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) ayrı bir yazıda ele aldık.",
          en: "On the insight side, the data game of Netflix and Amazon is now in the hands of SMBs too: AI-assisted analytics scaled segmentation and personalisation. And a new listener arrived: language models. People now ask ChatGPT, Gemini and Perplexity about brands, and these engines relay the brands whose stories are told clearly and spoken about consistently. Caesar's Senate today is partly a language model's answer — your story has to be worth telling there too. We covered [how to stand out inside those engines](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) in a separate piece.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir uyarıyla: psikolojik ilkeler AI hedeflemeyle birleşince güç katlanır — sorumluluk da. Kıtlığı uydurmak, sosyal kanıtı satın almak, kişiselleştirmeyi manipülasyona çevirmek her zamankinden kolay ve her zamankinden görünür. Sezar'ın sonunu hatırlayın: güveni kaybetmenin bedeli ağırdır.",
          en: "One warning: when psychological principles meet AI targeting, the power multiplies — and so does the responsibility. Faking scarcity, buying social proof, turning personalisation into manipulation is easier than ever and more visible than ever. Remember how Caesar ended: losing trust carries a heavy price.",
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
          tr: "Hikâye anlatımı, içgörü ve insan psikolojisi — Sezar'ın Roma'sından bugünün dijital pazarına, etkili pazarlamanın temeli hep aynı üçlü oldu. Araçlar değişti: forum yerine sosyal medya, danışman yerine veri paneli, senato yerine arama motoru. Değişmeyen tek şey insan. Kitlenizi tanıyın, onlara gerçek bir hikâye anlatın ve karar veren zihnin nasıl çalıştığını asla unutmayın. Üçlünün birlikte çalıştığında ne yaptığını [OdorGo vakasında](/vakalar/odorgo-kategori-yaratma) izleyebilirsiniz.",
          en: "Storytelling, insight and human psychology — from Caesar's Rome to today's digital market, effective marketing has always rested on the same trio. The tools changed: social media instead of the forum, a data dashboard instead of an adviser, a search engine instead of the senate. The one thing that hasn't changed is the human. Know your audience, tell them a true story, and never forget how the deciding mind works. You can watch the trio work together in the [OdorGo case](/vakalar/odorgo-kategori-yaratma).",
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
          tr: "Çünkü insan beyni gerçekleri değil, anlatıları hatırlar. Bilgi bombardımanı altındaki bir kitlede duygusal bağ kuran tek format hikâyedir: karakteri, çatışması ve çözümü olan bir anlatı, ürün özelliklerinin asla ulaşamayacağı bir hatırlanırlık ve sadakat üretir. Apple ürün özelliği saymaz, statükoya meydan okumayı anlatır; Nike spordan değil insan ruhundan söz eder.",
          en: "Because the human brain remembers narratives, not facts. For an audience under information bombardment, story is the only format that builds emotional connection: a narrative with character, conflict and resolution produces recall and loyalty that product features can never reach.",
        },
      },
      {
        question: {
          tr: "Marka hikâyesi nasıl kurulur?",
          en: "How do you build a brand story?",
        },
        answer: {
          tr: "Üç adımda: kitlenizin acı noktalarını ve değerlerini tanıyın, hikâyeye bağ kurulabilir karakterler koyun (müşteri, çalışan veya markanın kendisi) ve bir anlatı yayı kurun — başlangıç, çatışma, çözüm. Hikâye markanın değil, müşterinin dönüşümünü anlatmalıdır. Görseli de anlatının parçası sayın: Sezar'ın betimleyici dili neyse, bugünün videosu ve fotoğrafı odur.",
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
      {
        question: {
          tr: "Müşteri içgörüsü nasıl toplanır?",
          en: "How do you gather customer insight?",
        },
        answer: {
          tr: "Üç kaynaktan: veri analitiği, sosyal dinleme ve doğrudan müşteri geri bildirimi. Sezar içgörüyü danışmanlarından, halka açık forumlardan ve hatta düşmanlarından toplardı; bugünün karşılığı panel verisi, sosyal medya konuşmaları ve satın almayan müşteriyle yapılan görüşmedir. Toplanan veri işe yaramaz kalır, ta ki kitleyi davranış, demografi ve psikografiye göre segmentlere bölene kadar.",
          en: "From three sources: analytics, social listening and direct customer feedback. Caesar gathered insight from advisors, public forums and even his rivals; today that means dashboard data, social conversations and interviews with the customers who did not buy. Collected data stays useless until you split the audience into segments by behaviour, demographics and psychographics.",
        },
      },
      {
        question: {
          tr: "Segmentasyon ile kişiselleştirme arasındaki fark nedir?",
          en: "What is the difference between segmentation and personalisation?",
        },
        answer: {
          tr: "Segmentasyon kitleyi böler, kişiselleştirme mesajı o bölüme göre yazar. Önce davranışa, demografiye ve psikografiye göre gruplar çıkarılır; sonra her grup için ayrı bir cümle kurulur ve kampanya performansı segment bazında izlenir. Sıra ters çevrilirse ortaya kime söylendiği belirsiz, herkese aynı gelen ve hiç kimseye değmeyen bir mesaj çıkar.",
          en: "Segmentation splits the audience; personalisation writes the message for the split. First you group people by behaviour, demographics and psychographics, then you write a separate line for each group and track campaign performance per segment. Reverse that order and you end up with a message that reads the same to everyone and lands on no one.",
        },
      },
      {
        question: {
          tr: "Kıtlık ilkesi pazarlamada nasıl doğru kullanılır?",
          en: "How do you use the scarcity principle correctly?",
        },
        answer: {
          tr: "Yalnızca gerçek olduğunda. Sınırlı üretim, gerçekten azalan stok veya tarihi belli bir teklif duyurmak bilgilendirmedir ve müşterinin karar vermesini kolaylaştırır. Uydurma bir sayaç ise kısa vadede tıklama, uzun vadede güven kaybı üretir — bir kez yakalanan blöf, ilkeyi markanız için kalıcı olarak işlemez hale getirir.",
          en: "Only when it is real. Announcing a limited run, a genuinely depleting stock or an offer with a fixed end date is information, and it makes the decision easier for the customer. A fabricated countdown buys clicks now and costs trust later — once the bluff is caught, the principle stops working for your brand for good.",
        },
      },
      {
        question: {
          tr: "Bir marka otoritesini nasıl kurar?",
          en: "How does a brand build authority?",
        },
        answer: {
          tr: "Satarak değil, öğreterek. Kitlenizi gerçekten bilgilendiren içerik ürettiğinizde otorite ilkesi kendiliğinden çalışır; uzmanlığını göstermiş bir markanın tavsiyesi karar anında daha ağır basar. Karşılıklılık da aynı mantığın parçasıdır: gerçek değer taşıyan bir rehber veya ücretsiz deneme, karşılığını talep etmeden verildiği için geri döner.",
          en: "By teaching, not by selling. Publish content that genuinely informs your audience and the authority principle does its own work — advice from a brand that has shown its expertise carries more weight at the moment of decision. Reciprocity belongs to the same logic: a guide or free trial with real value comes back to you precisely because you did not demand anything for it.",
        },
      },
      {
        question: {
          tr: "Küçük bir işletme bu ilkeleri hangi bütçeyle uygular?",
          en: "What budget does a small business need to apply these principles?",
        },
        answer: {
          tr: "Fark artık bütçede değil, disiplinde. Netflix'in ve Amazon'un yıllarca ayrıcalığı olan veri oyunu bugün küçük işletmelerin de elinde: yapay zeka destekli analiz araçları segmentasyonu ve kişiselleştirmeyi ölçekledi ve ucuzlattı. Kalan iş insana ait — hangi segmentin hangi derdi olduğunu anlamak ve ona gerçek bir hikâye anlatmak para değil dikkat ister.",
          en: "The gap today is discipline, not budget. The data game that belonged to Netflix and Amazon for years is now within reach of small businesses: AI-assisted analysis tools scaled segmentation and personalisation and made them cheap. What is left is human work — understanding which segment carries which problem and telling it a real story costs attention, not money.",
        },
      },
      {
        question: {
          tr: "Pazarlamada hangi duygular karar vermeyi tetikler?",
          en: "Which emotions actually drive purchase decisions?",
        },
        answer: {
          tr: "Kararları duygular yönetir, gerekçeleri akıl sonradan yazar. Sahada en çok işe yarayan dörtlü neşe, nostalji, heyecan ve empatidir; hangisinin çalışacağını ürün değil, kitlenin o üründen beklediği his belirler. Duyguyu seçmeden önce tek bir soruyu cevaplayın: müşteri bu ürünü aldığında kendini nasıl hissetmek istiyor?",
          en: "Emotion drives the decision and reason writes the justification afterwards. The four that work most reliably are joy, nostalgia, excitement and empathy; which one lands is set by the feeling the audience expects from the product, not by the product itself. Before choosing an emotion, answer one question: how does the customer want to feel once they own it?",
        },
      },
    ],
    category: "growth",
    topic: "marka-hikaye",
    tags: ["hikaye-anlatimi", "pazarlama-psikolojisi", "marka-yonetimi"],
    authorSlug: "cagri-erdogan",
    publishedAt: "2024-07-30",
    readingMinutes: 5,
    seo: {
      title: {
        tr: "Pazarlama psikolojisi: Roma'dan üç kalıcı ders",
        en: "Marketing psychology: three lessons from Rome",
      },
      description: {
        tr: "Sezar'ın MÖ 44'te kullandığı üç kaldıraç hâlâ çalışıyor: hikâye anlatımı, gerçek müşteri içgörüsü ve karar anını yöneten psikoloji. Her birini örnekle açıyoruz.",
        en: "Caesar moved a republic in 44 BC with story, audience insight and decision psychology. The same three levers still decide whether marketing lands or bounces.",
      },
    },
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 1 Ağustos 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: bonus bölümü metne işlendi; kampanya listesine 2020'lerden Barbie ve Spotify Wrapped eklendi; \"Gutenberg'den dil modellerine\" notu ve sık sorulan sorular eklendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi ve ilgili hizmet, vaka ve yazı sayfalarına iç bağlantılar eklendi.",
      en: "First published on 1 August 2024. Revised on 23 August 2026: the bonus section was woven into the text; Barbie and Spotify Wrapped joined the campaign list from the 2020s; the \"From Gutenberg to language models\" note and the FAQ were added. On 28 August 2026 the section headings were rewritten as questions and internal links to the related service, case and article pages were added.",
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
          tr: "Net vizyon bir markayı nasıl odakta tutar?",
          en: "How does a clear vision keep a brand focused?",
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
          tr: "Topluluk neden takipçi sayısından değerli?",
          en: "Why is a community worth more than a follower count?",
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
          tr: "Harley-Davidson'ı düşünün: bir Harley'e sahip olmak motosiklete sahip olmaktan fazlasıdır, bir kabileye ait olmaktır. Lego, nesillere yayılan bir inşacı ve meraklı topluluğu yarattı. Bu markalar topluluğun ve kişisel bağın gücünü anlıyor; ikisini de kuran iş [marka stratejisidir](/hizmetler/marka-stratejisi).",
          en: "Think of Harley-Davidson: owning a Harley is more than owning a motorcycle, it's belonging to a tribe. Lego created a community of builders and enthusiasts spanning generations. These brands understand the power of community and personal connection; the work that builds both is [brand strategy](/hizmetler/marka-stratejisi).",
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
            en: "Barbie (2023): Mattel and Warner Bros. turned the film into a cultural event — a pink wave, over a hundred brand collaborations, a bookable Malibu DreamHouse on Airbnb and the self-born \"Barbenheimer\" meme. The film topped $1.4 billion as the year's biggest box office, putting a 64-year-old brand back at the centre of culture.",
          },
          {
            tr: "Spotify Wrapped (her aralık): kullanıcının kendi yıllık dinleme verisini paylaşılabilir bir hikâyeye çeviren kampanya, her yıl sosyal medyayı tek başına domine ediyor. Mesel gücü kişiselleştirmede: herkes kendi hikâyesinin kahramanı olduğu için milyonlarca kişi markanın reklamını gönüllü yapıyor.",
            en: "Spotify Wrapped (every December): by turning each user's own listening data into a shareable story, the campaign single-handedly dominates social media every year. Its parable power lies in personalisation: everyone is the hero of their own story, so millions volunteer to advertise the brand.",
          },
        ],
      },
      {
        type: "h2",
        id: "aglardan-faydalanmak",
        text: {
          tr: "Mevcut ağlardan nasıl faydalanılır?",
          en: "How do you leverage existing networks?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Mesaj yalnız yayılmadı. Sinagoglar, meydanlar, festivaller — insanlara bulundukları yerde ulaşıldı; öğretinin yayılmasını zamanın kanaat önderleri, havariler taşıdı. Bugünün karşılığını biliyorsunuz: markalar değerleriyle örtüşen influencer'larla çalışarak var olan ağlardan güvenilirlik ödünç alıyor. Glossier, sadık bir müşteri tabanını tam olarak bu yolla kurdu. [Kullanıcı içeriği ve sosyal kanıt](/yazilar/ugc-kullanimi-ve-sosyal-kanit) aynı ödünç alma mekaniğinin bugünkü hâlidir.",
          en: "The message didn't spread on its own. Synagogues, squares, festivals — people were reached where they already were, and the era's opinion leaders, the apostles, carried the teaching outward. You know today's equivalent: brands borrow credibility from existing networks by working with influencers who match their values. Glossier built its loyal customer base exactly this way. [User content and social proof](/yazilar/ugc-kullanimi-ve-sosyal-kanit) are today's version of the same borrowing mechanic.",
        },
      },
      {
        type: "h2",
        id: "uyarlanabilirlik-ve-dayaniklilik",
        text: {
          tr: "Bir marka mesajı değişen zamana nasıl uyum sağlar?",
          en: "How does a brand message adapt to changing times?",
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
          tr: "Kadim dünya marka mühendisliğine ne öğretir?",
          en: "What does the ancient world teach brand engineering?",
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
          tr: "Bu yazıyı 2024'te yayımladık. Geçen iki yılda, mesaj yayılımının üçüncü büyük sıçraması netleşti: matbaa çoğaltmayı, internet dağıtımı, üretken AI ise anlatımı ölçekledi. Mesajınız artık yalnızca insanlar arasında değil, motorlar arasında da dolaşıyor — insanlar markaları ChatGPT'ye, Gemini'ye, Perplexity'ye soruyor ve bu motorlar hikâyesi net, hakkında tutarlı konuşulan markaları anlatıyor. Bu motorlarda [nasıl öne çıkıldığı](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) artık ayrı bir disiplin.",
          en: "We published this piece in 2024. In the two years since, the third great leap in message propagation has come into focus: the press scaled reproduction, the internet scaled distribution, and generative AI scales narration. Your message now travels not only between people but between engines — people ask ChatGPT, Gemini and Perplexity about brands, and those engines retell the brands whose stories are clear and consistently spoken of. [Standing out inside those engines](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) is now a discipline of its own.",
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
          tr: "Net bir vizyona sahip olmak, derin ilişkiler kurmak, hikâye anlatımını kullanmak, ağlardan faydalanmak ve uyarlanabilir kalmak — bu beş strateji, modern pazarlamacıya eskimeyen dersler sunuyor. Bu ilkeleri markanıza uygulayarak, küresel yankı uyandıran ve zamanın testinden geçen bir mesaj yaratabilirsiniz. Beşinin birlikte çalıştığında ne kurduğunu [OdorGo vakasında](/vakalar/odorgo-kategori-yaratma) okuyabilirsiniz.",
          en: "Holding a clear vision, building deep relationships, using storytelling, leveraging networks and staying adaptable — these five strategies offer the modern marketer timeless lessons. Apply these principles to your brand and you can create a message that resonates globally and stands the test of time. You can read what the five build together in the [OdorGo case](/vakalar/odorgo-kategori-yaratma).",
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
          tr: "Çünkü vizyon, her kararın filtresi olarak çalışır: hangi ürün, hangi kanal, hangi ton. Net vizyonu olan marka tutarlı kalır; tutarlılık zamanla güvene, güven sadakate dönüşür. Vizyonu bulanık marka ise her trende savrulur ve kitlesi onu tarif edemez hale gelir. Apple'ın teknolojiyi erişilebilir kılma vizyonu bunun en bilinen örneğidir.",
          en: "Because vision works as the filter for every decision: which product, which channel, which tone. A brand with a clear vision stays consistent; consistency becomes trust over time, and trust becomes loyalty. A brand with a blurry vision drifts with every trend until its audience can no longer describe it.",
        },
      },
      {
        question: {
          tr: "Küçük bir marka topluluk nasıl kurar?",
          en: "How does a small brand build a community?",
        },
        answer: {
          tr: "Takipçi saymayı bırakıp ilişki kurarak. İlk yüz müşterinizle birebir konuşun, onları kararlarınıza ortak edin, katkılarını görünür kılın. Harley'nin kabilesi de Lego'nun inşacıları da böyle başladı: topluluk, kitleye yayın yapmakla değil, az sayıda insana derinden bağlanmakla kurulur. Sadakat ve güven ancak bu derinlikten sonra ölçeğe taşınır.",
          en: "By dropping follower counts and building relationships. Talk one-on-one with your first hundred customers, involve them in your decisions, make their contributions visible. Harley's tribe and Lego's builders both started this way: community is built by bonding deeply with a few people, not by broadcasting to a crowd.",
        },
      },
      {
        question: {
          tr: "Influencer pazarlaması gerçekten işe yarıyor mu?",
          en: "Does influencer marketing actually work?",
        },
        answer: {
          tr: "Doğru kurulduğunda evet — çünkü mekanizma iki bin yıldır aynı: mesaj, güvenilen seslerin taşıdığı mevcut ağlarda yayılır. Kritik koşul değer uyumudur; kitlesi ne kadar küçük olursa olsun markanın değerleriyle örtüşen bir ses, uyumsuz bir mega-influencer'dan daha fazla güven taşır. Glossier sadık müşteri tabanını tam olarak bu yolla kurdu.",
          en: "When set up right, yes — because the mechanism has been the same for two thousand years: messages spread through existing networks carried by trusted voices. The critical condition is value alignment; a voice that matches the brand's values, however small its audience, carries more trust than a mismatched mega-influencer.",
        },
      },
      {
        question: {
          tr: "Marka vizyonu nasıl yazılır?",
          en: "How do you write a brand vision?",
        },
        answer: {
          tr: "Tek cümlede, ürünü değil varoluş nedenini anlatarak. Apple'ın vizyonu teknolojiyi erişilebilir kılmaktı, Amazon'unki dünyanın en müşteri odaklı şirketi olmaktı — ikisi de ürün listesi değil. Japonların İkigai kavramı aynı soruyu sorar: neden varsınız? Cevabınız her ürün, kanal ve ton kararını süzecek kadar net değilse vizyon henüz yazılmamıştır.",
          en: "In one sentence, describing why you exist rather than what you sell. Apple's vision was making technology accessible; Amazon's was becoming the most customer-centric company on earth — neither is a product list. The Japanese idea of Ikigai asks the same question: why are you here? If the answer is not sharp enough to filter every product, channel and tone decision, the vision is not written yet.",
        },
      },
      {
        question: {
          tr: "Mesel nedir, markalar neden mesel anlatmalı?",
          en: "What is a parable and why should brands tell them?",
        },
        answer: {
          tr: "Mesel, karmaşık bir fikri basit ve bağ kurulabilir bir hikâyeye indiren anlatı biçimidir. Akılda kalır ve anlatılması kolaydır; matbaa öncesi bir çağda mesajı kıtalar arası taşıyan şey tam olarak buydu. Marka karşılığı nettir: kimse özellik listesi paylaşmaz, insanlar iyi anlatılmış bir hikâyeyi paylaşır.",
          en: "A parable is a narrative that compresses a complex idea into a simple, relatable story. It sticks and it is easy to retell, which is exactly how a message crossed continents in an age before printing. The brand equivalent is straightforward: nobody shares a feature list, people share a story that was told well.",
        },
      },
      {
        question: {
          tr: "Ethos, pathos ve logos pazarlamada ne işe yarar?",
          en: "What are ethos, pathos and logos good for in marketing?",
        },
        answer: {
          tr: "Aristoteles'in üç ikna kaldıracıdır: ethos güvenilirlik, pathos duygu, logos mantık. İyi bir mesel üçünü aynı anda taşır — anlatıcının yaşamıyla tutarlılığı ethos'u, hikâyenin insani çekirdeği pathos'u, çıkarılan ders logos'u kurar. Marka anlatısını denetlerken bu üçlüyü kontrol listesi gibi kullanın; eksik olan hangisiyse ikna orada kırılır.",
          en: "They are Aristotle's three levers of persuasion: ethos is credibility, pathos is emotion, logos is reason. A good parable carries all three at once — the teller's consistency builds ethos, the human core of the story builds pathos, and the lesson builds logos. Use the trio as a checklist when auditing brand narrative: whichever one is missing is where persuasion breaks.",
        },
      },
      {
        question: {
          tr: "Bir marka ne zaman kendini yeniden konumlandırmalı?",
          en: "When should a brand reposition itself?",
        },
        answer: {
          tr: "Mesaj doğru kaldığı hâlde kitleye ulaşmıyorsa. Donanım üreticisi IBM yazılım ve danışmanlığa, DVD kiralayan Netflix yayıncılığa geçti; ikisi de ürününü değil, kitlesinin bulunduğu yeri takip etti. Uyarlanabilirlik mesajı sulandırmak değildir — çiftçiyle, balıkçıyla ve din bilginiyle aynı öz farklı dillerde konuşulur.",
          en: "When the message is still right but no longer reaching anyone. IBM moved from hardware to software and consulting, Netflix moved from DVD rental to streaming; both followed where their audience was rather than what they used to sell. Adapting is not diluting — the same core gets spoken in different languages to the farmer, the fisherman and the scholar.",
        },
      },
      {
        question: {
          tr: "Spotify Wrapped neden her yıl çalışıyor?",
          en: "Why does Spotify Wrapped work every year?",
        },
        answer: {
          tr: "Kampanyanın kahramanı marka değil, kullanıcının kendisi olduğu için. Wrapped, kişinin kendi yıllık dinleme verisini paylaşılabilir bir hikâyeye çevirir ve milyonlarca kişi markanın reklamını gönüllü yapar. Mesel gücü buradadır: veri kişiselleştiğinde anlatıya dönüşür, anlatı paylaşıldığında medya bütçesi markadan kullanıcıya geçer. Her aralık tekrarlanması da tesadüf değil; ritüel hâline gelen kampanya beklenti üretir.",
          en: "Because the hero of the campaign is the user, not the brand. Wrapped turns a person's own year of listening into a shareable story, and millions advertise the brand voluntarily. That is the parable effect at work: personalised data becomes narrative, and once narrative is shared, the media budget moves from the brand to the audience.",
        },
      },
      {
        question: {
          tr: "Bir marka mesajı kanal değiştiğinde nasıl ayakta kalır?",
          en: "How does a brand message survive a change of channel?",
        },
        answer: {
          tr: "Formatı değil, özü sağlam tutarak. Mesaj yayılımı dört kez sıçradı — Roma'nın yol ağı, Gutenberg'in matbaası, internet ve şimdi üretken yapay zeka; her seferinde taşıyıcı değişti, taşınan şey değişmedi. Net vizyonu, gerçek topluluğu ve iyi hikâyesi olan marka her yeni kanalda yeniden yayılır, çünkü kalıcılık anlatılmaya değer olmaktır.",
          en: "By keeping the core intact rather than the format. The spread of messages has jumped four times — Rome's road network, Gutenberg's press, the internet and now generative AI; the carrier changed each time, what was carried did not. A brand with a clear vision, a real community and a good story spreads again on every new channel, because lasting means being worth retelling.",
        },
      },
    ],
    category: "growth",
    topic: "marka-hikaye",
    tags: ["hikaye-anlatimi", "markalasma", "viral-pazarlama"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-08-01",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "Marka mühendisliği: iki bin yıllık markalaşma",
        en: "Brand engineering: a two-thousand-year lesson",
      },
      description: {
        tr: "Net vizyon, topluluk, mesel ve ağ — dört ilke. Blair Cadısı'ndan Barbie'ye modern kampanyalar aynı iskeleti kullanıyor; marka stratejisi buradan okunur.",
        en: "Vision, community, parable, network — four principles. From Blair Witch to Barbie, modern campaigns reuse the same skeleton, and brand strategy follows it.",
      },
    },
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 6 Ağustos 2024'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlık yenilendi, o gün anonim anlattığımız örnekler bugün sitede yayımlanan gerçek vakalarımıza bağlandı, platform listesi ve sık sorulan sorular güncellendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi.",
      en: "First published on 6 August 2024. Revised on 23 August 2026: the title was renewed, the examples we once told anonymously are now linked to the real case studies published on this site, and the platform list and FAQ were updated. On 28 August 2026 the section headings were rewritten as questions.",
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
          tr: "E-ticaret dünyası son on yılda nasıl değişti?",
          en: "How has the e-commerce world changed in the past decade?",
        },
      },
      {
        type: "p",
        text: {
          tr: "E-ticaret son on yılda katlanarak büyüdü — buna büyük patlama diyelim. Ve bugünlerde büyüme doğrusal değil, parabolik. Bir zamanlar küçük bir çevrimiçi kitapçı olan Amazon, bugün e-ticaret dünyasını yönetiyor. Bu sıçramayı mümkün kılan şey, pazar eğilimlerinin ve tüketici davranışının doğru okunmasıydı.",
          en: "E-commerce has grown exponentially over the past decade — call it the big bang. And these days the growth is not linear but parabolic. Amazon, once a small online bookstore, now runs the e-commerce world. What made that leap possible was reading market trends and consumer behaviour correctly.",
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
          tr: "Teknoloji ve yazılım altyapısı neden belirleyici?",
          en: "Why is the technology and software foundation decisive?",
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
            en: "Custom development: personalised recommendations, dynamic pricing, automated marketing flows — the part of your competitive edge built in code.",
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
          tr: "Dijital pazarlama planı neleri kapsar?",
          en: "What does a digital marketing plan cover?",
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
          tr: "Mevcut kurulum nasıl denetlenir?",
          en: "How do you audit your current setup?",
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
          tr: "Yaratıcılık e-ticarette nasıl rekabet avantajına dönüşür?",
          en: "How does creativity become a competitive edge in e-commerce?",
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
          tr: "Gelir ve görünürlük nasıl birlikte büyür?",
          en: "How do revenue and visibility grow together?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Gelir tarafında iş, iyi yağlanmış bir makinedir: ürün sayfasından ödemeye her parça sorunsuz çalışmalı. Dönüşüm oranı optimizasyonu, üst satış ve çapraz satış bu makinenin dişlileridir. [OdorGo vakamızda](/vakalar/odorgo-kategori-yaratma) siteyi tam bu mantıkla kurduk: ziyaretçi hangi kanaldan hangi sayfaya girerse girsin, ikna edici bilgiyi alıp doğrudan satış adımına iner. Görünürlük tarafında ise SEO ve reklam, fırtınalı denizdeki deniz feneriniz — gemileri kıyıya o ışık çağırır.",
          en: "On the revenue side the business is a well-oiled machine: every part from product page to checkout must run smoothly. Conversion rate optimisation, upselling and cross-selling are the gears. In [our OdorGo case](/vakalar/odorgo-kategori-yaratma) we built the site on exactly this logic: whichever channel and page a visitor lands on, they get the convincing information and descend straight to the purchase step. On the visibility side, SEO and ads are your lighthouse in a stormy sea — that light is what calls the ships to shore.",
        },
      },
      {
        type: "h2",
        id: "dogru-danismanligi-secmek",
        text: {
          tr: "Doğru e-ticaret danışmanlığı nasıl seçilir?",
          en: "How do you choose the right e-commerce consultancy?",
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
          en: "Success in e-commerce is not a destination but a continuous process of growth and renewal. Understand the market, draw on the right expertise, apply strategic optimisation consistently, and you can unlock your business's full potential. Those 5 a.m. notifications are not luck but engineering — and every example in this article now stands, named and numbered, on [our case pages](/vakalar).",
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
          en: "It optimises every layer of an online business under one roof: market research and strategy, platform and software infrastructure, measurement setup, digital marketing channels, conversion optimisation and brand identity. Its value comes from carrying experience across industries into your project — the processes between reaching a customer and earning from one are the same in every industry.",
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
          en: "Look past the feature list at three criteria: does it carry your operation today, will it hold your scale two years from now, and does its ecosystem (payments, shipping, marketplace integrations) fit your market? For a brand selling in Türkiye, İKAS and Shopify are strong starting points; large catalogues and custom workflows call for WooCommerce, Magento or custom development. The platform decision is the most expensive one to reverse — make it before the build.",
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
      {
        question: {
          tr: "E-ticaret ajansı ile tek bir uzman arasında nasıl seçim yapılır?",
          en: "Agency or a single specialist: how do you choose?",
        },
        answer: {
          tr: "Sorunun tek kanalda mı sistemde mi olduğuna bakarak. Reklam hesabınız kötü yönetiliyorsa iyi bir uzman yeter; trafik geliyor ama satış gelmiyorsa sorun platform, ölçüm, huni ve marka arasında dağılmıştır ve tek kişi bu katmanları aynı anda tutamaz. Müşteriye ulaşmakla o müşteriden kazanmak arasındaki süreçler her sektörde aynı olduğu için, sistemi kuran ekip birikimini bir projeden diğerine taşır.",
          en: "By asking whether the problem sits in one channel or across the system. If the ad account is badly run, a good specialist is enough; if traffic arrives but sales do not, the problem is spread across platform, measurement, funnel and brand, and one person cannot hold those layers at once. Because the steps between reaching a customer and earning from that customer are the same in every sector, a team that builds systems carries its learning from one project to the next.",
        },
      },
      {
        question: {
          tr: "E-ticaret ajansıyla ilk 90 günde ne yapılır?",
          en: "What happens in the first 90 days with an e-commerce agency?",
        },
        answer: {
          tr: "Sıra bellidir: önce ölçüm, sonra altyapı, sonra kampanya. SOYLU AVM vakasında piksel ve dönüşüm izleme kampanyadan önce sıfırdan kuruldu; 6 günde 1,5 milyon dolarlık sonucu mümkün kılan ilk adım tam olarak buydu. Görüşmede ajanstan bunu isteyin — ilk 90 günün adım sırasını, fiyat konuşmasından önce.",
          en: "The order is fixed: measurement first, then infrastructure, then campaigns. In the SOYLU AVM case, pixel and conversion tracking were rebuilt from scratch before any campaign went live, and that first step is what made 1.5 million dollars in six days possible. Ask an agency for exactly this in the first meeting — the sequence of the first 90 days, before the price conversation.",
        },
      },
      {
        question: {
          tr: "Marka kimliği e-ticaret satışına gerçekten etki eder mi?",
          en: "Does brand identity really affect e-commerce sales?",
        },
        answer: {
          tr: "Doygun kategorilerde belirleyici olur. Feruza Elegance klasik çizgiden modern-lüks bir kimliğe taşındığında Türkiye'nin tanınmış butik perakende zincirlerinden birinin raflarına girdi — değişen ürün değil, ürünün nasıl konumlandığıydı. Kimlik her temas noktasında aynı anlatıyı sürdürdüğünde konuşma fiyat tartışmasından tercih tartışmasına kayar.",
          en: "In saturated categories it decides the outcome. When Feruza Elegance moved from a classic look to a modern-luxury identity, it earned shelf space in one of Turkey's well-known boutique retail chains — the product did not change, its positioning did. When identity carries the same story across every touchpoint, the conversation shifts from price to preference.",
        },
      },
      {
        question: {
          tr: "Büyük katalog ve otomasyon gerektiren e-ticarette ne değişir?",
          en: "What changes in e-commerce with a large catalogue and heavy automation?",
        },
        answer: {
          tr: "İşin merkezi pazarlamadan mühendisliğe kayar. Almanya'daki müşterimiz MKComputer için kurduğumuz dropshipping platformu 200.000 ürünü 5 dakikada senkronluyor ve sipariş yönlendirmeyi insan müdahalesi olmadan yapıyor. Bu ölçekte platform seçimi bir tercih değil kısıttır: stok, fiyat ve sipariş akışını taşıyamayan altyapı en iyi kampanyayı bile geri alınamaz hatalara çevirir.",
          en: "The centre of gravity shifts from marketing to engineering. The dropshipping platform we built for our German client MKComputer syncs 200,000 products in five minutes and routes orders without human intervention. At that scale the platform choice is a constraint rather than a preference: infrastructure that cannot carry stock, price and order flow turns even the best campaign into irreversible errors.",
        },
      },
      {
        question: {
          tr: "E-ticaret ajansı çalışması ne kadar sürede sonuç verir?",
          en: "How long before an e-commerce agency produces results?",
        },
        answer: {
          tr: "Ölçümün ne kadar sağlam olduğuna ve kategoriye göre değişir. FYR lansmanında 12 aylık ciro hedefi ilk 3 ayda geçildi; SOYLU AVM'de ölçüm önceden kurulduğu için sonuç 6 günde okundu. Buna karşılık organik görünürlük ve marka bilinirliği ay değil çeyrek ister — hızlı sonuç isteyen bütçeyi reklam tarafına, kalıcı sonuç isteyen bütçeyi içerik ve altyapı tarafına ayırın.",
          en: "It depends on how solid the measurement is and on the category. In the FYR launch a 12-month revenue target was passed in the first three months; at SOYLU AVM measurement was already in place, so results were readable within six days. Organic visibility and brand awareness, by contrast, take quarters rather than months — put the budget that needs speed into ads and the budget that needs durability into content and infrastructure.",
        },
      },
      {
        question: {
          tr: "E-ticaret ajansına ayrılan bütçe nasıl değerlendirilir?",
          en: "How should you judge the budget you give an e-commerce agency?",
        },
        answer: {
          tr: "Ücretin kendisine değil, getirdiği sonuca bakarak. Doğru soru \"aylık ne kadar\" değil, \"bu harcama hangi metriği ne kadar hareket ettirdi\" — FYR'de reklam getirisi 20 katın üzerinde seyretti ve bu rakam ajans ücretini gider kalemi olmaktan çıkardı. Ajans ücretini reklam bütçesinden ayrı izleyin; ikisi karıştığında hangisinin işe yaradığı görünmez olur.",
          en: "By looking at the result it produces, not at the fee. The right question is not \"how much per month\" but \"which metric did this spend move, and by how much\" — at FYR the return on ad spend held above 20x, which took the agency fee out of the cost column. Track the fee separately from the media budget; once the two are mixed, you can no longer see which one is working.",
        },
      },
    ],
    category: "growth",
    topic: "e-ticaret",
    tags: ["e-ticaret", "e-ticaret-danismanligi", "donusum-optimizasyonu"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-08-06",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "E-ticaret ajansı ne değiştirir? Üç aylık kanıt",
        en: "What a real e-commerce agency actually changes",
      },
      description: {
        tr: "Altyapı, ölçüm, yaratıcılık ve büyüme dört başlıkta. FYR'de 12 aylık ciro hedefi 3 ayda geçti; e-ticaret danışmanlığı seçerken hangi kanıtı istemelisiniz?",
        en: "Infrastructure, measurement, creative, growth. FYR cleared a 12-month revenue target in 3 months — what to demand from ecommerce consultancy before signing.",
      },
    },
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
          en: "Many big brands launch campaigns with broad goals like \"raise awareness\" or \"increase traffic\". Sounds nice, measures nothing. A luxury retail brand once poured millions into a high-profile influencer campaign, only to realise afterwards they had set no measurable conversion KPIs. The result: impressive engagement rates, no measurable lift in sales.",
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
          en: "Mistake 2: Neglecting mobile optimisation",
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
            en: "Optimise load speed: per Google's classic research, 53% of mobile visitors abandon a site that takes longer than three seconds.",
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
          en: "Advertising was once just a billboard, then newspapers, then television. In that era you could only hope the ad worked. Today we can reach our audience at any moment of the day — and consumers know the deal: in return they expect personalised, relevant content. A well-known cosmetics brand saw engagement drop sharply after sending the same generic newsletter to its whole base; switching to segmentation and preference-driven dynamic content lifted click-through by 20% and visibly raised loyalty.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kişiselleştirmenin ileri vitesi yeniden hedeflemedir: [GYMWOLVES vakasında](/vakalar/gymwolves-12-kat-satis) kitle segmentlere ayrıldı, düşük performanslı setler kapatıldı ve yeniden hedeflemeyle çapraz satış kuruldu — üç ayda 12 kat satışın dişlilerinden biri buydu.",
          en: "The higher gear of personalisation is retargeting: in [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis) the audience was segmented, underperforming sets were closed and cross-selling was built on retargeting — one of the gears behind 12× sales in three months.",
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
          en: "Paid ads bring traffic; but leaning on them without an organic strategy is like sprinting without a warm-up — you run out of steam fast. A large e-commerce platform once watched its growth stall after focusing only on paid and neglecting content and SEO. The reverse is also possible: [SIM Printing Suppliers](/vakalar/sim-baski-ihracat-icerigi) grew organic traffic 15× in 6 months through a content programme and a rebuilt stack. Balance is mandatory: paid buys speed, organic buys permanence.",
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
          en: "Brands get so focused on acquiring new customers that they forget to nurture the ones they have. Yet loyalty programmes, post-purchase follow-up and personal offers are the difference between a one-off purchase and a lifetime customer. A happy repeat customer becomes the brand's advocate over time — your cheapest marketing channel.",
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
          en: "We published this piece in 2024 and let's be honest: all seven mistakes are still in the field. What changed is their cost. Campaign management has largely been handed to AI — Performance Max and Advantage+ style automations optimise budgets on their own. Sounds safe; it isn't. An automation fed the wrong KPI runs toward the wrong target with flawless speed. Mistake 1 is now more expensive.",
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
          en: "Falling into these traps is easy; spotting and fixing them turns your strategy from a scattered pile of effort into a well-oiled machine. Clear KPIs, mobile first, data discipline, personalisation, the paid-organic balance, consistent messaging and retention — when all seven run together, the marketing budget stops being a cost and becomes an engine. In the end, the game isn't about playing; it's about winning.",
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
          tr: "Sonucu ölçülebilir dijital pazarlama disiplinidir: bütçe; tıklama, dönüşüm, satış gibi izlenebilir çıktılara bağlanır ve kampanyalar bu veriye göre sürekli optimize edilir. Marka bilinirliği reklamcılığından farkı, her liranın hangi sonucu ürettiğinin bilinmesidir. Kanal olarak arama, sosyal medya, görüntülü reklam ve e-posta kullanılır; ortak payda kanal değil, sonucun izlenebilir olmasıdır.",
          en: "It's the discipline of digital marketing with measurable outcomes: budget is tied to trackable results — clicks, conversions, sales — and campaigns are continuously optimised against that data. The difference from awareness advertising is knowing what result every unit of spend produces.",
        },
      },
      {
        question: {
          tr: "Yedi hatanın en kritiği hangisi?",
          en: "Which of the seven mistakes is the most critical?",
        },
        answer: {
          tr: "Ölçüm zinciri: net KPI (Hata 1) + veri analitiği (Hata 3). Çünkü diğer beş hata, ölçüm sağlamsa verinin içinde görünür ve düzeltilir; ölçüm yoksa hiçbiri teşhis edilemez. AI otomasyonları çağında bu ikili daha da kritikleşti — yanlış hedefe kusursuz optimizasyon yapılır.",
          en: "The measurement chain: clear KPIs (Mistake 1) plus data analytics (Mistake 3). Because if measurement is solid, the other five mistakes show up in the data and get fixed; without it, none can be diagnosed. In the age of AI automations this pair became even more critical — the wrong target gets optimised flawlessly.",
        },
      },
      {
        question: {
          tr: "İyi bir KPI nasıl belirlenir?",
          en: "How do you set a good KPI?",
        },
        answer: {
          tr: "Üç özellik arayın: spesifik (\"satışta %10 artış\", \"5 kat ROAS\"), ölçülebilir (CTR, dönüşüm oranı, CAC gibi izlenebilir metrikler) ve zamana bağlı (net son tarih, uzun vadeli hedefte kısa vadeli kıyas noktaları). \"Bilinirliği artırmak\" bir KPI değil, dilektir. Hedefi yazarken kime ait olduğunu da yazın; sahibi olmayan KPI takip edilmez.",
          en: "Look for three properties: specific (\"10% sales lift\", \"5× ROAS\"), measurable (trackable metrics like CTR, conversion rate, CAC) and time-bound (a clear deadline, with short-term benchmarks for long-term goals). \"Raising awareness\" is not a KPI; it's a wish. Write down who owns each target as well; a KPI without an owner never gets tracked.",
        },
      },
      {
        question: {
          tr: "Ücretli ve organik arasındaki denge ne olmalı?",
          en: "What should the balance between paid and organic be?",
        },
        answer: {
          tr: "Sabit bir oran yok; işlev ayrımı var. Ücretli kanal hız ve test imkânı satın alır, organik kanal (SEO, içerik ve 2026'da GEO) kalıcılık ve biriken varlık kurar. Sağlıklı işaret şudur: ücretli reklamı bir ay kapattığınızda gelir sıfıra düşüyorsa, organik ayağınız yok demektir — denge kurulmamıştır.",
          en: "There's no fixed ratio; there's a division of labour. Paid buys speed and testing capacity; organic (SEO, content and, in 2026, GEO) builds permanence and compounding assets. The healthy test: if turning paid off for a month drops revenue to zero, you have no organic leg — the balance doesn't exist.",
        },
      },
      {
        question: {
          tr: "ROAS nedir ve nasıl hesaplanır?",
          en: "What is ROAS and how is it calculated?",
        },
        answer: {
          tr: "ROAS (reklam harcamasının getirisi), reklamdan gelen geliri o reklama harcanan tutara bölerek bulunur; 5 kat ROAS, harcanan her 1 liranın 5 lira gelir ürettiği anlamına gelir. KPI olarak kullanışlıdır çünkü hem spesifik hem ölçülebilirdir. Tek başına yetmez: ROAS geliri ölçer, kârı değil — marj düşükse yüksek ROAS bile zarar gizleyebilir.",
          en: "ROAS (return on ad spend) is revenue from advertising divided by the amount spent on it; a 5x ROAS means every 1 lira spent produced 5 lira of revenue. It works well as a KPI because it is both specific and measurable. It is not sufficient on its own: ROAS measures revenue rather than profit, so with thin margins even a high ROAS can hide a loss.",
        },
      },
      {
        question: {
          tr: "Mobil optimizasyon reklam performansını ne kadar etkiler?",
          en: "How much does mobile optimisation affect ad performance?",
        },
        answer: {
          tr: "Doğrudan ve sert etkiler. Mobil trafik toplam trafiğin %70'inin üzerinde seyrederken mobili ihmal etmek, pazarlama hattınızın yarıdan fazlasını kapatmak demektir; Google'ın klasik araştırmasına göre mobil ziyaretçilerin %53'ü üç saniyeden uzun yüklenen siteyi terk ediyor. Reklam bütçesi tıklamayı satın alır, mobil sayfa o tıklamayı ya dönüşüme çevirir ya çöpe atar.",
          en: "Directly and hard. With mobile above 70% of total traffic, neglecting it means shutting down more than half of your marketing line; Google's well-known research found that 53% of mobile visitors abandon a page that takes longer than three seconds to load. The ad budget buys the click — the mobile page decides whether that click converts or is thrown away.",
        },
      },
      {
        question: {
          tr: "Kişiselleştirme ile yeniden hedefleme arasındaki fark nedir?",
          en: "What is the difference between personalisation and retargeting?",
        },
        answer: {
          tr: "Kişiselleştirme mesajı segmentin tercihine göre yazar, yeniden hedefleme ise mesajı davranışa göre zamanlar. Tanınmış bir kozmetik markası herkese aynı bülteni göndermeyi bırakıp segmente ve tercihe göre dinamik içeriğe geçtiğinde tıklama oranı %20 arttı. GYMWOLVES vakasında ikinci vitese geçildi: kitle segmentlere ayrıldı, düşük performanslı setler kapatıldı ve yeniden hedeflemeyle çapraz satış kuruldu.",
          en: "Personalisation writes the message around a segment's preferences; retargeting times the message around behaviour. When a well-known cosmetics brand stopped sending one newsletter to its whole base and moved to dynamic content by segment and preference, click-through rose 20%. The GYMWOLVES case shifted into the higher gear: the audience was segmented, weak ad sets were switched off and cross-selling was built through retargeting.",
        },
      },
      {
        question: {
          tr: "Tutarlı marka mesajı bir performans metriği midir?",
          en: "Is consistent brand messaging a performance metric?",
        },
        answer: {
          tr: "Doğrudan metrik değil, ama ölçtüğünüz her metriğin katsayısıdır. Marka sesi kanaldan kanala dalgalandığında müşterinin kafası karışır ve aynı bütçe aynı kitleye daha zayıf bir hatırlanırlıkla ulaşır. Çözümü mekaniktir: tonu, sesi ve mesajı tanımlayan bir marka stil rehberi yazın ve dijitalde, basılıda ve mağazada tek bir marka deneyimi bırakın.",
          en: "Not a metric in itself, but a multiplier on every metric you do measure. When brand voice drifts from channel to channel the customer gets confused, and the same budget reaches the same audience with weaker recall. The fix is mechanical: write a style guide that defines tone, voice and message, then hold one brand experience across digital, print and store.",
        },
      },
      {
        question: {
          tr: "Kendi hesabımda bu yedi hatayı nasıl denetlerim?",
          en: "How do I audit these seven mistakes in my own account?",
        },
        answer: {
          tr: "Ölçümden başlayıp yukarı doğru okuyun. Şu üç soruya yazılı cevap verin: her kampanyanın zamana bağlı bir KPI'ı var mı, dönüşüm izleme her kanalda doğru veri veriyor mu, reklamı bir ay kapatsanız gelir ayakta kalır mı? Bu üçü netleştiğinde kalan dört hata — mobil, kişiselleştirme, mesaj tutarlılığı ve elde tutma — verinin içinde kendiliğinden görünür hale gelir.",
          en: "Read it from measurement upward. Answer three questions in writing: does every campaign have a time-bound KPI, does conversion tracking return correct data on every channel, and would revenue survive a month with the ads switched off? Once those three are clear, the remaining four mistakes — mobile, personalisation, message consistency and retention — surface on their own inside the data.",
        },
      },
      {
        question: {
          tr: "Küçük bütçeli bir işletme hangi hatadan başlamalı?",
          en: "Which mistake should a small-budget business fix first?",
        },
        answer: {
          tr: "Ölçümden — çünkü küçük bütçede yanlış yere harcanan her lira oransal olarak daha pahalıdır. Net bir KPI ve çalışan bir dönüşüm izleme kurmak yazılım maliyeti değil karar disiplini işidir ve bir öğleden sonrada başlatılabilir. Bu ikisi ayakta değilken bütçeyi büyütmek, aynı hatayı yalnızca daha hızlı tekrarlamaktan başka bir şey yapmaz.",
          en: "With measurement — on a small budget, every lira spent in the wrong place costs proportionally more. Setting one clear KPI and getting conversion tracking to work is a matter of decision discipline rather than software spend, and it can be started in an afternoon. Until those two stand, raising the budget only repeats the same mistake faster.",
        },
      },
    ],
    category: "growth",
    topic: "performans-pazarlama",
    tags: ["performans-pazarlama", "dijital-pazarlama", "kpi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-10-07",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "Performans pazarlamada 7 pahalı hata",
        en: "7 costly performance marketing mistakes",
      },
      description: {
        tr: "Mobil trafiğin %70'i aşan payını ihmal etmekten ROAS hedefsiz bütçeye: her hatanın maliyeti, sahadan kanıtı ve çıkış yolu tek tek yazılı duruyor.",
        en: "From ignoring the 70% of traffic that arrives on mobile to spending without a ROAS target: what each mistake costs, and the exact way out of every one.",
      },
    },
  },

  {
    // Eski blogdan taşındı (2024-10-13). Orijinal 7 kuralı iki kez anlatıyordu
    // ("Kural 1-7" özetleri + "Kilit Nokta 1-7" detayları — Elementor şablon
    // kalıntısı); teke indirildi. Kişisel anekdotlar ve rakamları korundu.
    // Sondaki iki kırık CTA hizmet bağlantısına çevrildi. TR slug eski URL
    // ile aynı.
    slug: {
      tr: "donusum-optimizasyonu-yontemleri",
      en: "landing-page-optimisation-guide",
    },
    title: {
      tr: "Maksimum dönüşüm için açılış sayfanızı nasıl optimize edersiniz?",
      en: "How do you optimise your landing page for maximum conversion?",
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
          en: "A local retailer's page dropped from 7 seconds to 2.5 through image optimisation and plugin cleanup: bounce fell 20%, conversion rose 15%. For the 2026 version of the bar, see [our SIM case](/vakalar/sim-baski-ihracat-icerigi): a five-language site loading in under a second.",
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
          en: "Rule 7: Mobile optimisation is non-negotiable",
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
          en: "Conclusion: continuous optimisation",
        },
      },
      {
        type: "p",
        text: {
          tr: "Açılış sayfası optimizasyonu bir proje değil, süreçtir. Her ince ayar, her A/B testi ve her içgörü sizi daha yüksek dönüşüme ve daha iyi ROI'ye yaklaştırır. Sayfanıza evrilen bir varlık gibi yaklaşın: kullanıcı davranışına ve pazar trendlerine göre sürekli iyileştirin. CTA dilini ayarlamak veya düzeni sadeleştirmek gibi küçük değişiklikler bile önemli iyileştirmeler sağlar — yukarıdaki rakamlar bunun kanıtı.",
          en: "Landing page optimisation is not a project but a process. Every tweak, every A/B test and every insight moves you toward higher conversion and better ROI. Treat your page as an evolving asset: keep improving it against user behaviour and market trends. Even small changes like adjusting CTA language or simplifying the layout deliver real gains — the numbers above are the proof.",
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
          en: "What is conversion rate optimisation (CRO)?",
        },
        answer: {
          tr: "Siteye gelen mevcut trafiğin daha büyük bir bölümünü hedeflenen eyleme (satın alma, form, kayıt) dönüştürme disiplinidir. Trafik satın almanın aksine CRO, elinizdeki ziyaretçiden daha fazla değer üretir — bu yüzden reklam bütçesi büyümeden geliri büyütebilen tek kaldıraçtır. Ölçüsü nettir: aynı trafikte dönüşüm oranı yükseliyorsa çalışıyor demektir.",
          en: "It's the discipline of converting a larger share of existing traffic into the targeted action (purchase, form, signup). Unlike buying traffic, CRO produces more value from the visitors you already have — which makes it the one lever that can grow revenue without growing ad budget.",
        },
      },
      {
        question: {
          tr: "Açılış sayfasında ilk neyi düzeltmeliyim?",
          en: "What should I fix first on a landing page?",
        },
        answer: {
          tr: "Sırasıyla üç şeyi kontrol edin: sayfa hızı (yavaşsa gerisinin önemi yok), değer önerisinin netliği (ilk saniyelerde ne sattığınız anlaşılıyor mu) ve CTA'nın görünürlüğü. Bu üçü sağlamsa gerisi — sosyal kanıt, düzen, form — A/B testiyle sırayla iyileştirilir. Sıra önemli, çünkü yavaş açılan bir sayfada en iyi başlık bile okunmaz.",
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
          en: "It varies by industry, traffic source and the weight of the action: 2-4% is the common average in e-commerce, well-optimised pages exceed 5%, and form-based B2B pages can go above 10%. The real benchmark isn't an industry table but your own history: if this month's rate beats last month's, you're on the right path.",
        },
      },
      {
        question: {
          tr: "A/B testi nedir?",
          en: "What is an A/B test?",
        },
        answer: {
          tr: "A/B testi, bir sayfanın iki versiyonunu aynı anda gerçek trafiğe göstererek hangisinin daha çok dönüştürdüğünü ölçen yöntemdir. Değiştirilen tek bir öğe olur — başlık, buton metni, düzen — ve karar fikirle değil veriyle verilir. Hiçbir açılış sayfası ilk seferde doğru kurulmadığı için test bir proje değil, süregelen bir alışkanlıktır.",
          en: "An A/B test shows two versions of a page to live traffic at the same time and measures which one converts better. Only one element changes — a headline, a button label, a layout — and the decision comes from data rather than opinion. Because no landing page is right the first time, testing is a habit rather than a project.",
        },
      },
      {
        question: {
          tr: "Sayfa hızı dönüşümü ne kadar etkiler?",
          en: "How much does page speed affect conversion?",
        },
        answer: {
          tr: "Ölçülebilir biçimde etkiler. Çalıştığımız yerel bir perakendecinin sayfası görsel optimizasyonu ve eklenti temizliğiyle 7 saniyeden 2,5 saniyeye indi; hemen çıkma %20 azaldı, dönüşüm %15 arttı. 2026'da çıta daha yukarıda — üç saniyenin altı taban, hedef Core Web Vitals'ın yeşil bandı; SIM vakasında beş dilli sitenin açılışı bir saniyenin altında kaldı.",
          en: "Measurably. A local retailer we worked with brought page load from 7 seconds down to 2.5 through image optimisation and plugin cleanup; bounce fell 20% and conversion rose 15%. In 2026 the bar sits higher — under three seconds is the floor and the target is the green band of Core Web Vitals; in the SIM case a five-language site loads in under a second.",
        },
      },
      {
        question: {
          tr: "Form ve ödeme adımındaki terk nasıl azaltılır?",
          en: "How do you reduce form and checkout abandonment?",
        },
        answer: {
          tr: "Alan sayısını ve adım sayısını düşürerek. Bir B2B yazılım şirketi sayfasını sadeleştirip form alanlarını azalttığında potansiyel müşteri gönderimleri %40 arttı; aynı mantık ödeme akışında da işler, çünkü mobil form ne kadar kısaysa tamamlanma o kadar yüksektir. Kalan sürtünmeyi güven işaretleri kapatır — yorumlar, güven rozetleri ve müşteri logoları şüpheyi son adımda eritir.",
          en: "By cutting the number of fields and steps. When a B2B software company simplified its page and reduced form fields, lead submissions rose 40%; the same logic holds at checkout, because the shorter the mobile form, the higher the completion rate. Trust signals close the remaining friction — reviews, badges and customer logos dissolve doubt at the final step.",
        },
      },
      {
        question: {
          tr: "A/B testi için ne kadar trafik ve süre gerekir?",
          en: "How much traffic and time does an A/B test need?",
        },
        answer: {
          tr: "Anlamlı bir farkı okuyacak kadar. Sabit bir sayı vermek yanıltıcı olur; gereken trafik mevcut dönüşüm oranınıza ve beklediğiniz farkın büyüklüğüne göre değişir — dönüşüm oranı ne kadar düşükse o kadar çok ziyaretçi gerekir. Pratik kural şu: testi en az bir tam haftaya yayın ki gün içi ve hafta içi davranış farkları dengelensin, ve erken görünen bir fark için testi kapatmayın.",
          en: "Enough to read a real difference. A fixed number would be misleading; the traffic you need depends on your current conversion rate and on how large a difference you expect — the lower the rate, the more visitors it takes. A practical rule: run the test across at least one full week so daily and weekday patterns even out, and never stop it early because a gap looks promising.",
        },
      },
      {
        question: {
          tr: "Sosyal kanıt bir açılış sayfasına nasıl yerleştirilir?",
          en: "Where does social proof belong on a landing page?",
        },
        answer: {
          tr: "Karar anının yanına. Müşteri yorumları, vaka çalışmaları, güven rozetleri ve müşteri logoları üçüncü taraf doğrulaması olarak çalışır; çalıştığımız bir e-öğrenme platformu iş birliği yaptığı üniversitelerin logolarını eklediğinde dönüşüm %15 arttı. Kanıtı sayfanın en altına gömmeyin — CTA'nın hemen çevresinde, ziyaretçi güvenli olup olmadığını düşündüğü anda görünmeli.",
          en: "Next to the moment of decision. Reviews, case studies, trust badges and customer logos act as third-party verification; an e-learning platform we worked with added the logos of its partner universities and conversion rose 15%. Do not bury the proof at the bottom of the page — it belongs around the CTA, visible exactly when the visitor wonders whether this is safe.",
        },
      },
      {
        question: {
          tr: "Yapay zeka motorlarından gelen ziyaretçi için açılış sayfası nasıl kurulur?",
          en: "How do you build a landing page for visitors coming from AI engines?",
        },
        answer: {
          tr: "Değer önerisini açık metin olarak sayfaya yazarak. Trafik artık yapay zeka motorlarından da geliyor ve bu motorlar sayfanızı özetleyip kullanıcıya anlatıyor; vaadiniz bir görselin içine gömülüyse motor onu okuyamaz. OdorGo vakasında siteyi tam bu mantıkla kurduk: hangi kanaldan hangi sayfaya girilirse girilsin ikna edici bilgi metin olarak orada duruyor.",
          en: "By writing the value proposition into the page as plain text. Traffic now also arrives from AI engines, and those engines summarise your page back to the user; if your promise lives inside an image, the engine cannot read it. We built the OdorGo site on exactly this logic: whichever channel a visitor lands from, the persuasive information sits there as text.",
        },
      },
    ],
    category: "growth",
    topic: "cro",
    tags: ["donusum-optimizasyonu", "cro", "ui-ux"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-10-13",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "Landing page optimizasyonu: dönüşüm için 7 kural",
        en: "Landing page optimisation: 7 conversion rules",
      },
      description: {
        tr: "Değer önerisi, eylem çağrısı, sosyal kanıt, hız ve A/B testi. Ölçülmüş kazanımlar: başlıkta %25, çağrıda %30, form sadeliğinde %40 dönüşüm artışı.",
        en: "Value proposition, call to action, social proof, speed and A/B testing. Measured gains: 25% from a headline, 30% from a CTA, 40% from a simpler form.",
      },
    },
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 14 Kasım 2024'te yayımlandı ve Aralık 2025'te kısmen güncellenmişti. 23 Ağustos 2026'da gözden geçirildi: yıl tutarsızlıkları giderildi, düşünce soruları tek bölümde toplandı, \"AI çağında sahicilik\" bölümü ve sık sorulan sorular eklendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi.",
      en: "First published on 14 November 2024 and partially updated in December 2025. Revised on 23 August 2026: year inconsistencies were fixed, the reflection questions were gathered into one section, and the \"Authenticity in the AI age\" section and FAQ were added. On 28 August 2026 the section headings were rewritten as questions.",
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
          en: "Human behaviour, even in the modern digital age, is shaped by instincts that go back to our earliest ancestors. Neuroscience and psychology research shows social approval and belonging are fundamental human needs. When we see others using or endorsing a product, a subconscious response rooted in survival instinct fires: we tend to feel that what is popular and trusted is safe. Studies of the \"herd effect\" show the brain releases dopamine — its reward chemical — when we observe others endorsing something.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Journal of Consumer Research'te yayımlanan bilinen bir çalışma, akran onayının satın alma davranışını nasıl etkilediğini vurguladı: ürüne otantik kullanıcı geri bildirimi eşlik ettiğinde, araştırmacıların \"benim gibi\" önyargısı dediği zihinsel kısayol devreye girer. Bize benzeyen insanlara güvenme ve onların seçimlerinin bizimle alakalı olduğuna inanma olasılığımız daha yüksektir. UGC'nin başarılı olduğu yer tam burası: gerçek insanları, gerçek durumlarda, gerçek seçimler yaparken gösterir — ve bu, psikolojik düzeyde yankı bulur.",
          en: "A well-known study published in the Journal of Consumer Research highlighted how peer endorsement shapes purchase behaviour: when authentic user feedback accompanies a product, a mental shortcut researchers call the \"like-me\" bias kicks in. We are more likely to trust people who resemble us and to believe their choices are relevant to ours. This is exactly where UGC succeeds: it shows real people, in real situations, making real choices — and that resonates at a psychological level.",
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
          tr: "Sosyal kanıt güveni nasıl inşa eder?",
          en: "How does social proof build trust?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sosyal kanıt güveni en kısa yoldan kurar: kararı başkalarının deneyimiyle destekler. Şu senaryoyu hayal edin: benzer ürünler sunan iki marka arasında karar veriyorsunuz. Birinin yüzlerce müşteri yorumu ve gerçek kullanıcı fotoğrafı var, diğerinde birkaç tane. İçgüdüsel olarak sosyal kanıtı çok olana yönelirsiniz — tesadüf değil, iş başındaki psikolojik ilke. Seçeneklerle bunalan kitleler için sosyal kanıt, karar yorgunluğunu hafifletir ve aranan güvenceyi verir.",
          en: "Social proof builds trust by the shortest route: it backs a decision with other people's experience. Picture this scenario: you're deciding between two brands with similar products. One has hundreds of customer reviews and real user photos; the other has a handful. Instinctively you lean toward the one with more social proof — not a coincidence but a psychological principle at work. For audiences overwhelmed by options, social proof eases decision fatigue and provides the reassurance they're looking for.",
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
          tr: "Markanızı ilişkilenebilir kılmak: \"marka dostluğu\" nasıl kurulur?",
          en: "Making your brand relatable: how do you build \"brand friendship\"?",
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
          tr: "2026 notu: AI çağında sahicilik neden değerlendi?",
          en: "2026 note: why did authenticity gain value in the AI age?",
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
          en: "UGC and social proof sit at the centre of the transformation in content strategy. Brands that listen to their customers, share with them and bond with them like friends earn a community of loyal advocates rather than passive consumers. Let your brand's message be: we see you, we hear you, and we're here to grow with you. When brands and audiences bond as friends, marketing doesn't just succeed — it becomes meaningful.",
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
          tr: "Markanın değil, gerçek kullanıcıların ürettiği içeriktir: paket açılış videoları, yorumlar, fotoğraflar, deneyim hikâyeleri. Gücü prodüksiyon kalitesinden değil sahiciliğinden gelir — izleyen kişi ekranda kendine benzeyen birini görür ve \"benim gibi\" önyargısı devreye girer. Marka açısından işlevi, kendi anlatısını müşterinin ağzından doğrulatmak ve ürünü gerçek bir hayatın içinde göstermektir.",
          en: "Content produced by real users rather than the brand: unboxing videos, reviews, photos, experience stories. Its power comes from authenticity, not production quality — the viewer sees someone like themselves on screen, and the \"like-me\" bias kicks in. For the brand, its function is to have its own claims confirmed in the customer's words and to show the product inside a real life.",
        },
      },
      {
        question: {
          tr: "UGC geleneksel içeriğin yerini tutar mı?",
          en: "Does UGC replace traditional content?",
        },
        answer: {
          tr: "Hayır — ikisi farklı iş görür. Profesyonel içerik marka güvenilirliğini ve kaliteyi kurar; UGC bu yapının üzerine özgünlük katmanını ekler. Yalnız cilalı içerik mesafeli, yalnız UGC ise otoritesiz kalır. Doğru strateji ikisini birlikte çalıştırır. Pratikte sıra şudur: profesyonel içerik yapıyı kurar, kullanıcı içeriği o yapının üzerine biner.",
          en: "No — they do different jobs. Professional content builds brand credibility and quality; UGC adds the authenticity layer on top of that structure. Polished content alone feels distant; UGC alone lacks authority. The right strategy runs both together. In practice the order is simple: professional content builds the structure and user content sits on top of it.",
        },
      },
      {
        question: {
          tr: "Sosyal kanıt neden bu kadar etkili?",
          en: "Why is social proof so effective?",
        },
        answer: {
          tr: "Çünkü nörolojik temeli var: başkalarının bir şeyi onayladığını gözlemlemek beynin ödül kimyasalı dopamini tetikler ve \"popüler olan güvenlidir\" içgüdüsünü harekete geçirir. Seçenek bolluğunda sosyal kanıt karar yorgunluğunu azaltır — yüzlerce yorumu olan ürün, içgüdüsel olarak daha az riskli hissettirir. Etkisi kararı hızlandırmakla kalmaz, alıcının pişmanlık riskini de düşürür.",
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
      {
        question: {
          tr: "Hangi UGC türleri en çok işe yarar?",
          en: "Which types of UGC work best?",
        },
        answer: {
          tr: "Ürünün gerçek hayatta nasıl kullanıldığını gösterenler. Paket açılış videoları, kullanıcı fotoğrafları ve hikâye odaklı referanslar en güçlü üçlüdür; yıldız puanı bir özet verir ama ürünün bir hayatı nasıl etkilediğini anlatan ayrıntılı müşteri hikâyesi ikna eder. Format değil bağlam belirleyicidir: izleyen kişi kendini o sahnede görebiliyorsa içerik çalışır.",
          en: "The ones that show the product in real use. Unboxing videos, customer photos and story-driven testimonials are the strongest three; a star rating gives a summary, but a detailed customer story about how the product affected a life is what persuades. Context decides, not format: if the viewer can picture themselves in the scene, the content works.",
        },
      },
      {
        question: {
          tr: "Mikro-influencer ile büyük influencer arasında nasıl seçim yapılır?",
          en: "How do you choose between a micro-influencer and a big name?",
        },
        answer: {
          tr: "Takipçi sayısına değil, kitle uyumuna bakarak. Mikro-influencer'lar küçük ama yüksek etkileşimli kitleleriyle daha ilişkilenebilir dururlar ve niş topluluklarda paylaşılan bir kimlik kurarlar. Büyük isim erişim satın alır ama ilişkilenebilirliği satın alamaz — ürününüz bir topluluğun içinde konuşuluyorsa, o topluluğun kendi sesi daha uzağa gider.",
          en: "By audience fit rather than follower count. Micro-influencers hold small but highly engaged audiences, read as more relatable and build a shared identity inside niche communities. A big name buys reach but cannot buy relatability — if your product is discussed inside a community, that community's own voice travels further.",
        },
      },
      {
        question: {
          tr: "Yorumlar ve referanslar sitede nasıl sunulmalı?",
          en: "How should reviews and testimonials be presented on a site?",
        },
        answer: {
          tr: "Puanı değil, hikâyeyi öne çıkararak. Yıldız ortalaması bir eşik bilgisidir; asıl ikna, ürünün somut bir durumu nasıl değiştirdiğini anlatan ayrıntılı müşteri hikâyesinden gelir. Görsel kanıtı yanına koyun — gerçek kullanıcı fotoğrafı ve videosu, ürünün bir yaşam tarzına nasıl oturduğunu metnin anlatamayacağı hızda gösterir.",
          en: "By leading with the story rather than the score. An average rating is threshold information; the persuasion comes from a detailed customer account of how the product changed a concrete situation. Put visual proof beside it — real user photos and videos show how the product fits into a life faster than any paragraph can.",
        },
      },
      {
        question: {
          tr: "Yapay zeka ile üretilmiş sahte kullanıcı içeriği kullanılabilir mi?",
          en: "Can you use AI-generated fake user content?",
        },
        answer: {
          tr: "Kullanılmamalı. Yapay zeka her şeyi üretebilir; üretemediği tek şey \"benim gibi biri\"dir ve kitleler sentetik içeriği ayırt etmeyi hızla öğrendi. Yapay zeka avatarlarla çekilmiş sahte-UGC denemeleri, yakalandığı anda markaya sahicilik borcu olarak geri döndü — kamera kalitesi düşük olabilir, güven düşük olamaz.",
          en: "It should not be used. AI can generate anything except \"someone like me\", and audiences have learned to spot synthetic content quickly. Fake UGC shot with AI avatars has come back on brands as an authenticity debt the moment it was caught — the camera quality can be low, the trust cannot.",
        },
      },
      {
        question: {
          tr: "Marka dostluğu profesyonellikten ödün vermek midir?",
          en: "Does brand friendliness mean giving up professionalism?",
        },
        answer: {
          tr: "Hayır — ödün verilen şey mesafe, profesyonellik değil. Marka dostluğu, sesin sıcak, ilişkilenebilir ve insani olması demektir: kurumsal jargon yerine net cümleler, yorumlara verilen gerçek yanıtlar, ekibi ve süreci gösteren kamera arkası kesitleri. Duolingo eğitici içerik sunarken esprili bir kimlik kurdu ve kullanıcılarını ürüne değil paylaşılan bir deneyime bağladı.",
          en: "No — what gets dropped is distance, not professionalism. Brand friendship means a warm, relatable and human voice: plain sentences instead of corporate jargon, real replies in the comments, behind-the-scenes glimpses of the team and the process. Duolingo built a witty identity while still teaching, and tied its users to a shared experience rather than to a product.",
        },
      },
      {
        question: {
          tr: "Sosyal kanıt yapay zeka motorlarındaki görünürlüğü etkiler mi?",
          en: "Does social proof affect visibility in AI engines?",
        },
        answer: {
          tr: "Evet, doğrudan. İnsanlar bir ürünün iyi olup olmadığını artık ChatGPT'ye ve Perplexity'ye soruyor; bu motorlar cevabı gerçek kullanıcı yorumlarından, tartışmalardan ve bağımsız içerikten damıtıyor. Hakkında sahici konuşulan marka yanıtlarda da güvenle anılıyor — yani kullanıcı içeriği yalnızca reklam kreatifi değil, motorların okuduğu bir kanıt katmanıdır.",
          en: "Yes, directly. People now ask ChatGPT and Perplexity whether a product is any good, and those engines distil the answer from real reviews, discussions and independent content. A brand that people genuinely talk about gets named with confidence in those answers — which makes user content an evidence layer the engines read, not just ad creative.",
        },
      },
    ],
    category: "growth",
    topic: "marka-hikaye",
    tags: ["ugc", "sosyal-kanit", "noropazarlama"],
    authorSlug: "cagri-erdogan",
    publishedAt: "2024-11-14",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "UGC ve sosyal kanıt reklamdan neden güçlü?",
        en: "UGC and social proof: why they beat ads",
      },
      description: {
        tr: "Nörobilim, cilalı reklam yerine neden müşteri yorumuna güvendiğinizi açıklıyor. GoPro ve Airbnb örnekleri, yapay zeka çağında sahiciliğin yeni ölçüsü.",
        en: "Neuroscience explains why a customer review outweighs a polished ad. The GoPro and Airbnb playbooks, and what authenticity now costs brands in the AI age.",
      },
    },
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
          en: "You're about to set out on a long voyage. Wouldn't you want a navigator who trusts a precise chart and a working instrument rather than a guess? In marketing, that instrument is data. The agency should have a clear approach from predictive analytics to real-time campaign optimisation — and that approach should be shaped around your business, not a generic diagram already sitting in the deck.",
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
          en: "Listen for this: does the agency describe the audience by demographics or by behaviour? \"Women, 25-45, metro areas\" is a targeting setting. \"They compare prices three times and read reviews before buying\" is an insight.",
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
          en: "AI has entered every layer of strategy, execution and optimisation; the agency should have a clear framework both for today and for the next two years. On one consulting project I watched an agency embed AI into customer segmentation and personalisation: targeting accuracy improved, the customer experience improved, and the conversion rate followed.",
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
      {
        question: {
          tr: "Ajans görüşmesine nasıl hazırlanılır?",
          en: "How do you prepare for an agency meeting?",
        },
        answer: {
          tr: "Üç şeyi yazılı hale getirerek: bu yıl hangi iş sonucunu istediğinizi, elinizdeki kısıtları (bütçe, ekip, teknik borç) ve hangi kararı kimin verdiğini. Sekiz soruyu sormadan önce bunlar netse ajansın cevabı da somutlaşır; belirsiz bir brief genel bir sunumu davet eder. Görüşmeye reklam paneli ve analitik erişimlerinizi de hazırlayın — ajansın ilk teşhisi oradan çıkar.",
          en: "By putting three things in writing: the business result you want this year, the constraints you are working under (budget, team, technical debt) and who signs off on what. Get those clear before asking the eight questions and the agency's answers get concrete too; a vague brief invites a generic pitch. Bring access to your ad accounts and analytics as well — that is where the first real diagnosis comes from.",
        },
      },
      {
        question: {
          tr: "Ajans raporlaması nasıl olmalı?",
          en: "What should agency reporting look like?",
        },
        answer: {
          tr: "Şeffaf, düzenli ve karar üretebilir. Sıklığı, formatı ve hangi metriğe öncelik verildiğini sözleşmeden önce netleştirin; asıl ayırt edici soru şudur: kötü haberi kim, ne zaman söylüyor? Raporun içinde ajansın kendi hatasını yazdığı bir bölüm yoksa o rapor bir performans değerlendirmesi değil, bir vitrindir.",
          en: "Transparent, regular and capable of producing decisions. Settle the frequency, the format and which metrics take priority before signing; the real differentiator is a simpler question — who reports bad news, and when? If the report has no section where the agency writes down its own mistakes, it is not a performance review, it is a shop window.",
        },
      },
      {
        question: {
          tr: "Ajansın yapay zekayı doğru kullandığını nasıl anlarım?",
          en: "How do I tell whether an agency uses AI well?",
        },
        answer: {
          tr: "Tek bir soruyla: son üç ayda yapay zekayı hangi işi hızlandırmak için kullandınız ve hangi kararı bilerek insana bıraktınız? Üretimi hızlandırmak — görsel, ilk taslak, kampanya verisi taraması — iyidir. Ama hangi kategoride oynanacağı, hangi müşteriden vazgeçileceği ve hangi fiyat konumunun savunulacağı karardır; bu kararları modele devreden ajans size rakiplerinizin ortalamasını satar.",
          en: "With a single question: in the last three months, which task did you use AI to speed up, and which decision did you deliberately keep human? Speeding up production — visuals, first drafts, scanning campaign data — is good. But which category to play in, which customer to walk away from and which price position to defend are decisions; an agency that hands those to a model is selling you the average of your competitors.",
        },
      },
      {
        question: {
          tr: "Ajans sektörümü bilmiyorsa sorun olur mu?",
          en: "Is it a problem if the agency does not know my sector?",
        },
        answer: {
          tr: "Bilmemesi değil, bilmediğini saklaması sorundur. Sektöre özgü kısıtları baştan bilen bir ekip strateji süresini kısaltır — İstanbul Ortez Protez işinde hastanın nasıl arama yaptığını anlamadan yazılan hiçbir sayfa ilk üçe çıkmadı. Bilmediğini söyleyip nasıl öğreneceğini anlatan ajans, her sektörde çalıştığını söyleyenden daha güvenlidir.",
          en: "The problem is not the gap, it is hiding the gap. A team that already understands the sector's constraints shortens the strategy phase — in the İstanbul Ortez Protez project, no page reached the top three until we understood how patients actually search. An agency that admits what it does not know and explains how it will learn is safer than one that claims to work in every sector.",
        },
      },
      {
        question: {
          tr: "Kriz planı neden sözleşmeden önce sorulmalı?",
          en: "Why should you ask about the crisis plan before signing?",
        },
        answer: {
          tr: "Krizde ortaya çıkan şey ajansın yeteneği değil refleksidir, ve refleks kriz anında pazarlık edilmez. Görüşmede üç şeyi net sorun: gece yarısı ulaşılabilen sorumlu kim, onayı kim veriyor, ilk yirmi dört saatte hangi adımlar sabit? Kriz planı yazılı değilse yoktur; iyi yönetilen bir kriz ise markanın şeffaflık tarafını güçlendiren bir ana dönüşebilir.",
          en: "What shows up in a crisis is reflex, not talent, and reflexes cannot be negotiated mid-crisis. Ask three things directly: who is reachable at midnight, who approves, and which steps are fixed in the first twenty-four hours? If the crisis plan is not written down it does not exist; a well-handled crisis, on the other hand, can become the moment that strengthens a brand's transparency.",
        },
      },
      {
        question: {
          tr: "Ajansın verdiği kitle içgörüsü iyi mi, nasıl anlarım?",
          en: "How do I judge the quality of an agency's audience insight?",
        },
        answer: {
          tr: "Kitleyi demografiyle mi davranışla mı tarif ettiğine bakın. \"25-45 yaş, kadın, büyükşehir\" bir hedefleme ayarıdır; \"satın almadan önce üç kez fiyat karşılaştırıp yorum okuyor\" bir içgörüdür. İkinci cümle hangi sayfanın yazılacağını, hangi kanalın önceleneceğini ve hangi itirazın karşılanacağını değiştirir — içgörü stratejiyi değiştirmiyorsa içgörü değildir.",
          en: "Look at whether they describe the audience by demographics or by behaviour. \"Women, 25-45, metropolitan\" is a targeting setting; \"compares prices three times and reads reviews before buying\" is an insight. The second sentence changes which page gets written, which channel gets priority and which objection gets answered — if an insight does not change the strategy, it is not one.",
        },
      },
    ],
    category: "growth",
    topic: "is-gelistirme",
    tags: ["ajans-secimi", "performans-pazarlama", "ai"],
    authorSlug: "burak-ozgul",
    publishedAt: "2024-08-03",
    readingMinutes: 9,
    seo: {
      title: {
        tr: "Pazarlama ajansı seçimi: sorulacak 8 soru",
        en: "Choosing a marketing agency: 8 questions",
      },
      description: {
        tr: "Dijital reklam ajansı ile tedarikçi arasındaki fark ilk görüşmede duyulur: kanıt, hedefleme, yapay zeka kullanımı ve kriz anı. Her cevapta ne aranır?",
        en: "A digital advertising agency and a vendor sound different in the first meeting: evidence, targeting, AI use, crisis handling. What to listen for in each.",
      },
    },
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
    tr: "2026 web tasarım trendleri: minimalizm, hız ve mobil öncelik",
    en: "2026 web design trends: minimalism, speed and mobile-first",
  },
  excerpt: {
    tr: "Web siteniz reklam bütçenizi mi tüketiyor? Vitrini ışıl ışıl bir mağaza düşünün: kapı ağırsa müşteri içeri girmeden gider. 2026'nın ikinci yarısında web tasarımı da aynı kapı meselesi — hız, kod hijyeni ve mobil zorunluluk üzerine kuruluyor.",
    en: "Is your website draining your ad budget? Picture a dazzling storefront with a door too heavy to open — the customer leaves before ever stepping in. In the second half of 2026, web design faces the same door problem: it now rests on speed, code hygiene and mobile necessity.",
  },
  updatedAt: "2026-08-28",
  updateNote: {
    tr: "Bu yazı ilk olarak 4 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: yıl ortası gerçeklik kontrolü bölümü eklendi, tekrarlanan hız ve minimalizm anlatımları tek bölüme indirildi, arama ve komut deneyimi trendi eklendi, örnekler SIM Baskı Malzemeleri ve Meccanotecnica Umbra vakalarına bağlandı, kırık iç bağlantılar ve taslak kalıntıları temizlendi, dört soruluk SSS eklendi. 28 Ağustos 2026'da başlık ve ara başlıklar külliyatın cümle düzenine getirildi, ara başlıkların bir bölümü soru formuna çevrildi.",
    en: "First published on 4 December 2025. Revised on 23 August 2026: added a mid-year reality-check section, consolidated the repeated speed and minimalism narratives into one section, added the search-and-command-experience trend, tied the examples to our SIM Printing Suppliers and Meccanotecnica Umbra case studies, cleaned up broken internal links and leftover draft text, and added a four-question FAQ. On 28 August 2026 the title and headings were brought into the sentence case used across the journal, and several headings were rewritten as questions.",
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
        tr: "Yeni minimalizm: hız neden gerçek estetik?",
        en: "The new minimalism: why is speed the real aesthetic?",
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
        tr: "Mobil öncelikli dönem neden bitti?",
        en: "Why is the mobile-first era over?",
      },
    },
    {
      type: "p",
      text: {
        tr: "Yıllardır \"mobil öncelikli\" tasarımı konuşuyoruz. Ama 2026'da masaüstü artık mobilin bir uzantısı; trafiğin büyük çoğunluğu — birçok sektörde yüzde 80'i aşan bir payla — mobil cihazlardan geliyor. Bu dünyada tasarım süreçleri başparmak dostu navigasyon üzerine kurulmalı. Responsive tasarım artık yeterli değil — kullanıcının mobildeki davranış psikolojisi, masaüstünden tamamen farklı.",
        en: "We've talked about \"mobile-first\" design for years. But in 2026, desktop is the extension of mobile, not the other way around; the vast majority of traffic — well over 80% in many industries — arrives from mobile devices. In this world, design has to be built on thumb-friendly navigation from the start. Responsive design alone isn't enough anymore — user behaviour on mobile is a different psychology from desktop, not a smaller version of it.",
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
        tr: "Fonksiyonel arayüzler: arama ve komut deneyimi neyi değiştiriyor?",
        en: "Functional interfaces: what are search and command experiences changing?",
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
        en: "We built exactly this into [Meccanotecnica Umbra Türkiye's quote portal](/vakalar/meccanotecnica-umbra-teklif-portali). The buyer here is an engineer; they don't want to browse a catalogue, they want to find the seal that fits their own plant in seconds. Command-palette search tied product discovery straight to the quote step — the result was a 10× increase in quote requests. That's what we mean by functional beauty: an interface whose presence you never feel, one that carries you to your goal by the shortest path.",
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
        en: "2026's web design trends aren't just pleasing color palettes or modern fonts. The trend is building a strategic foundation that races against milliseconds, is SEO-aligned, converts well and protects the ad budget. If you want to grow the business, web design needs to stop being \"a visual job\" and move to the centre of your performance and technology strategy.",
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
    {
      question: {
        tr: "Core Web Vitals nedir?",
        en: "What are Core Web Vitals?",
      },
      answer: {
        tr: "Google'ın kullanıcı deneyimini ölçtüğü üç metriktir. LCP, sayfanın ana içeriğinin ekrana geldiği anı işaretleyerek algılanan yükleme hızını gösterir; INP, sayfanın kullanıcı etkileşimlerine ne kadar hızlı yanıt verdiğini ölçer; CLS ise yükleme sırasında öğelerin ne kadar yerinden oynadığını, yani görsel kararlılığı gösterir. Üçü birlikte artık bir tavsiye değil eşiktir.",
        en: "They are the three metrics Google uses to measure user experience. LCP marks the moment the page's main content appears, standing in for perceived load speed; INP measures how quickly the page responds to interaction; CLS shows how much elements shift during loading, meaning visual stability. Together they are a threshold rather than a recommendation.",
      },
    },
    {
      question: {
        tr: "Yavaş bir site reklam maliyetini nasıl artırır?",
        en: "How does a slow site raise your ad costs?",
      },
      answer: {
        tr: "İki yönden. Google Ads, açılış sayfası yavaş açılan reklamların kalite puanını düşürür; aynı sıralama için rakiplerinizden daha yüksek tıklama başına maliyet ödersiniz. İkincisi doğrudan gelir kaybıdır: Amazon verilerine göre sayfa yüklemesindeki her 100 milisaniyelik gecikme satışlarda yüzde birlik bir kayba yol açıyor. Yavaş siteye yüksek bütçeli reklam vermek, deposu delik bir arabaya benzin doldurmaktır.",
        en: "In two directions. Google Ads lowers the quality score of ads whose landing page loads slowly, so you pay a higher cost per click than competitors for the same position. The second is straight revenue loss: Amazon's data shows every 100 milliseconds of added load time costs about one percent of sales. Running a large budget against a slow site is filling a car with a leaking tank.",
      },
    },
    {
      question: {
        tr: "Site hızı nasıl ölçülür ve hedef ne olmalı?",
        en: "How do you measure site speed and what should the target be?",
      },
      answer: {
        tr: "Ölçüm Core Web Vitals üzerinden yapılır ve laboratuvar testi değil gerçek kullanıcı verisi esas alınır. 2025 sonunda üç saniyenin altı iddialı bir hedefti; 2026 ortasında rakip sitelerin çoğu zaten bu bandın altında ve fark milisaniyelerde ölçülüyor. Kendi projelerimizde bir saniyenin altını hedefliyoruz — SIM Baskı Malzemeleri'nin beş dilli sitesi yayın sonrasında da o bandın altında kaldı.",
        en: "You measure through Core Web Vitals, and field data from real users counts more than a lab test. At the end of 2025, under three seconds was an ambitious target; by mid-2026 most competing sites already sit below that band and the gap is measured in milliseconds. We target under one second in our own projects — SIM Printing Suppliers' five-language site stayed below that band after launch as well.",
      },
    },
    {
      question: {
        tr: "Mobil uyumlu tasarım ile mobil öncelikli tasarım arasındaki fark nedir?",
        en: "What is the difference between responsive and mobile-first design?",
      },
      answer: {
        tr: "Mobil uyumlu tasarım masaüstü sayfayı küçük ekrana sığdırır; mobil öncelikli tasarım kararı doğrudan küçük ekranda verir. 2026'da trafiğin büyük çoğunluğu — birçok sektörde yüzde 80'i aşan bir payla — mobilden geldiği için ikincisi zorunlu hale geldi. Pratik karşılığı başparmak bölgesidir: satın al, teklif iste ve ara gibi birincil eylemler ekranın alt yarısında, tek elle ulaşılabilecek noktada durmalı.",
        en: "Responsive design fits a desktop page onto a small screen; mobile-first design makes the decision on the small screen from the start. With the large majority of traffic now arriving from mobile — above 80% in many sectors — the second one became mandatory in 2026. In practice it means the thumb zone: primary actions like buy, request a quote and call belong in the lower half of the screen, reachable with one hand.",
      },
    },
    {
      question: {
        tr: "Kod hijyeni nedir, neden bakım maliyetini belirler?",
        en: "What is code hygiene and why does it drive maintenance cost?",
      },
      answer: {
        tr: "Kod hijyeni, sitenin görünmeyen tarafındaki sadeliktir: gereksiz JavaScript kütüphanelerinin, optimize edilmemiş devasa görsellerin ve şişirilmiş hazır temaların temizlenmesi. Bir site ön yüzünde ne kadar sade görünürse görünsün arka planda bu yükü taşıyorsa kirlidir ve görsel sadelik yalnızca makyaj kalır. Temiz kodlanmamış site her güncellemede yeniden ücret çıkarır.",
        en: "Code hygiene is simplicity on the invisible side of a site: clearing out unnecessary JavaScript libraries, unoptimised oversized images and bloated off-the-shelf themes. However clean the front end looks, a site carrying that weight underneath is dirty, and the visual simplicity is only makeup. A site that was not coded cleanly bills you again at every update.",
      },
    },
    {
      question: {
        tr: "Komut paleti her siteye gerekli mi?",
        en: "Does every site need a command palette?",
      },
      answer: {
        tr: "Hayır — katalog derinliği ve kullanıcının aceleciliği belirler. Linear, Vercel ve Stripe'ın popülerleştirdiği komut paleti, kullanıcı menüde gezinmek yerine aradığını doğrudan bulmak istediğinde işe yarar. Meccanotecnica Umbra'nın teklif portalında alıcı bir mühendisti ve kendi tesisine uygun salmastrayı saniyeler içinde bulmak istiyordu; arama katmanı ürün bulma akışını doğrudan teklif adımına bağladı ve teklif talepleri 10 katına çıktı.",
        en: "No — catalogue depth and how hurried the user is decide it. The command palette popularised by Linear, Vercel and Stripe pays off when people want to find something directly instead of navigating a menu. On Meccanotecnica Umbra's quote portal the buyer was an engineer who needed the right mechanical seal for their plant in seconds; the search layer wired product discovery straight into the quote step and requests rose tenfold.",
      },
    },
  ],
  category: "growth",
  topic: "ui-ux",
  tags: ["web-tasarim", "core-web-vitals", "mobil-tasarim"],
  authorSlug: "sude-albayrak",
  publishedAt: "2025-12-04",
  readingMinutes: 8,
  seo: {
    title: {
      tr: "2026 UI/UX tasarım trendleri: hız ve mobil",
      en: "2026 UI/UX design trends: speed and mobile",
    },
    description: {
      tr: "Amazon verisi net: her 100 milisaniyelik gecikme satışın yüzde birini götürüyor. Kod hijyeni, mobil zorunluluk ve arayüz tasarımında komut deneyimi.",
      en: "Amazon measured it: every 100 ms of load delay costs 1% of sales. Code hygiene, mobile as a requirement, and the command-driven interface design of 2026.",
    },
  },
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 8 Aralık 2025'te \"2026 trendleri\" başlığıyla yayımlandı. 23 Ağustos 2026'da yıl ortası gerçeklik kontrolüyle güncellendi: hangi öngörünün tuttuğunu, hangisinin beklediğimizden hızlı geldiğini ve hangisinin yavaş kaldığını anlatan yeni bir bölüm eklendi. Örnekler yayımlanmış vakalarımıza bağlandı, kırık bağlantılar temizlendi, dört soruluk SSS eklendi. 28 Ağustos 2026'da kalan ara başlıklar soru formuna getirildi.",
      en: "First published on 8 December 2025 under the title \"2026 trends\". Revised on 23 August 2026 with a mid-year reality check: a new section on which prediction held, which arrived faster than expected and which lagged. The examples now link to our published case studies, broken links were cleaned up, and a four-question FAQ was added. On 28 August 2026 the remaining section headings were rewritten as questions.",
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
          en: "It's no accident that e-commerce managers fall into this trap; it's a trick of human psychology. In behavioural science we call it hedonic adaptation. Our brains release a burst of dopamine for novel stimuli and rewards. A first-time visitor's first order thrills the business owner. The quiet, regular purchase of a loyal customer who already knows you produces nothing of the sort.",
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
          tr: "Segmentasyon mühendisliği: her müşteri neden eşit değil?",
          en: "Segmentation engineering: why isn't every customer equal?",
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
          en: "The personalisation paradox and the RAS effect",
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
          en: "The second approach creates cognitive ease. The customer doesn't have to think, because you thought for them and narrowed the options. Personalisation isn't a courtesy; it's a technique for removing load.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Davranışsal tetikleyiciler: sepette unutulan ürün değil, kaçan fırsat",
          en: "Behavioural triggers: not a forgotten cart, a missed opportunity",
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
          en: "Robert Cialdini's famous reciprocity principle is our sense of owing something to whoever did us a favour. An unordered little gift falling out of the box — a handful of jelly beans, a sticker, a tester, a handwritten thank-you note — creates a positive shock. That gesture leaves a sense of debt, and the customer settles it in two ways: by choosing the brand again, and by photographing the box and sharing it. The second one is free advertising.",
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
          tr: "Kovayı tamir etmek: 90 günde hangi sıra izlenir?",
          en: "Fixing the bucket: what order do you follow in 90 days?",
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
          en: "Most budget allocation has moved to the algorithm. Performance Max and Advantage+ style automations decide for themselves which channel, which audience and how much. That didn't remove the marketer's job; it moved it. The critical decision now is which objective you teach the algorithm. Feed it \"conversion count\" and it produces cheap, unprofitable orders; feed it revenue and margin and it hunts for profitable customers. So the 2026 shift isn't technical but definitional: writing down what counts as success matters more than building the campaign.",
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
      {
        question: {
          tr: "Delik kova sendromu nedir?",
          en: "What is the leaky bucket syndrome?",
        },
        answer: {
          tr: "Kovaya sürekli yeni su taşıyıp dibindeki delikten sızanı fark etmemektir: işletme yeni müşteri edinmeye büyük efor harcarken arka kapıdan çıkan müşteriyi görmez. Sonucu tabloda net görünür — ciro artar, kârlılık yerinde sayar, çünkü kârın büyük kısmı reklam açık artırmasına geri döner. Deliği kapatmadan bütçe büyütmek, aynı sonucu daha pahalıya almaktır.",
          en: "It means constantly carrying new water into the bucket while ignoring what leaks out of the bottom: the business spends heavily on acquiring customers and never sees the ones walking out the back door. The result is visible in the numbers — revenue grows while profitability stalls, because most of the margin flows back into the ad auction. Growing the budget before patching the hole just buys the same result at a higher price.",
        },
      },
      {
        question: {
          tr: "Edinme ve elde tutma arasında bütçe nasıl paylaştırılmalı?",
          en: "How should budget be split between acquisition and retention?",
        },
        answer: {
          tr: "Sabit bir oran seçmek yerine sırayı düzeltin. Çoğu e-ticaret işletmesi bütçesinin yaklaşık %80'ini yeni müşteri bulmaya, %20'sini eldekini tutmaya harcıyor; ticaretin matematiği bunun tersini fısıldıyor, çünkü mevcut müşteriye ulaşmanın maliyeti bir e-posta, yeni müşteriye ulaşmanın maliyeti bir açık artırmadır. Pratik kural: kova sağlamken edinmeye harcayın, delikken önce deliği kapatın.",
          en: "Fix the sequence instead of picking a fixed ratio. Most e-commerce businesses spend roughly 80% of the budget on finding new customers and 20% on keeping the ones they have; the maths of trade whispers the opposite, because reaching an existing customer costs an email while reaching a new one costs an auction. Practical rule: spend on acquisition while the bucket holds, and patch the hole first when it does not.",
        },
      },
      {
        question: {
          tr: "Peak-End kuralı e-ticarette ne işe yarar?",
          en: "What is the peak-end rule good for in e-commerce?",
        },
        answer: {
          tr: "İnsan beyni bir deneyimi süresine veya ortalamasına göre değil, en yoğun anına ve nasıl bittiğine göre hatırlar. E-ticarette son, müşterinin kargoyu teslim alıp kutuyu açtığı andır; o an sıradansa tüm alışveriş sıradan olarak kodlanır. Kutu bu yüzden pazarlama bütçesinin en ucuz ve en ihmal edilen kalemidir.",
          en: "The brain remembers an experience by its most intense moment and by how it ended, not by how long it lasted or how it averaged out. In e-commerce the ending is the moment the parcel arrives and the box opens; if that moment is ordinary, the whole purchase gets filed as ordinary. That makes packaging the cheapest and most neglected line in the marketing budget.",
        },
      },
      {
        question: {
          tr: "Satın alma sonrası deneyim nasıl tasarlanır?",
          en: "How do you design the post-purchase experience?",
        },
        answer: {
          tr: "Dört temas noktasını sırayla yazarak: teslimat bildirimi, kutunun kendisi, içinden çıkan küçük jest ve ilk hafta gönderilen takip mesajı. \"Kargoya verildi\" yerine \"paketini özenle hazırladık, yola çıktı\" demek aynı bilgiyi verir ama farklı bir duygu bırakır. Kutudan çıkan sipariş edilmemiş küçük bir hediye karşılıklılık ilkesini çalıştırır; müşteri o borcu tekrar sipariş vererek ve kutunun fotoğrafını paylaşarak öder.",
          en: "By writing out four touchpoints in order: the shipping notification, the box itself, the small gesture inside it and the follow-up message in the first week. Saying \"we packed your order with care, it is on its way\" instead of \"shipped\" delivers the same information but leaves a different feeling. An unordered little gift in the box triggers reciprocity, and the customer repays it by ordering again and by photographing the box.",
        },
      },
      {
        question: {
          tr: "Sepette unutulan ürün mesajı nasıl yazılır?",
          en: "How should an abandoned-cart message be written?",
        },
        answer: {
          tr: "Hatırlatma olarak değil, bir gerekçeyle. Standart \"sepette ürün unuttun\" cümlesi sıkıcıdır; kıtlık ilkesini kullanan \"sepetindeki ürünler seni bekliyor ama stoklarımız hızla azalıyor\" hafif bir kaybetme korkusu kurar ve eyleme geçme ihtimalini yükseltir. Tek koşul var: stok gerçekten azalmıyorsa bu cümleyi kurmayın — bir kez yakalanan blöf sadakatin kendisini bitirir.",
          en: "As a reason, not a reminder. The standard \"you left something in your cart\" is dull; a scarcity-based line such as \"the items in your cart are waiting, but stock is running low\" creates a mild fear of loss and raises the odds of action. One condition applies: do not write it unless stock really is running low — a bluff, once caught, ends loyalty itself.",
        },
      },
      {
        question: {
          tr: "Elde tutmanın çalıştığını hangi metrikle görürüm?",
          en: "Which metric shows that retention is working?",
        },
        answer: {
          tr: "Tekrar satın alma oranıyla — ve onu üç ayda bir ölçerek. Tek bir kampanyanın etkisine değil, aynı müşteri grubunun ikinci ve üçüncü siparişe geçiş oranına bakın; kova tamir edildiyse bu oran yükselir. Reklam harcamasının aksine elde tutma yatırımı birikimlidir: durdurduğunuzda etkisi anında bitmez, bu yüzden ölçüm de aylık değil çeyreklik okunur.",
          en: "With the repeat-purchase rate, measured every three months. Look at the share of the same customer cohort moving to a second and third order rather than at any single campaign; if the bucket is fixed, that share rises. Unlike ad spend, retention investment compounds — its effect does not stop the day you stop, which is why it should be read by quarter rather than by month.",
        },
      },
    ],
    category: "growth",
    topic: "performans-pazarlama",
    tags: ["retention", "rfm-analizi", "musteri-deneyimi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2025-12-08",
    readingMinutes: 10,
    seo: {
      title: {
        tr: "2026 performans pazarlama trendleri: yıl ortası",
        en: "2026 performance marketing trends at mid-year",
      },
      description: {
        tr: "E-ticarette bütçenin %80'i yeni müşteriye, %20'si eldekine gidiyor. Müşteri edinme maliyeti artarken kovayı tamir etmenin 90 günlük sırası burada.",
        en: "E-commerce spends about 80% of budget chasing new customers and 20% keeping them. As customer acquisition cost climbs, here is the 90-day repair order.",
      },
    },
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
      tr: "Küçük işletmeler için RFM analizi ile satışları artırma rehberi",
      en: "RFM analysis for small businesses: a practical guide to selling more",
    },
    excerpt: {
      tr: "Selim Bey, butik kahve dükkanına uğrayan herkese aynı indirimi gönderiyor — ve kârının büyük kısmını sırtlayan sadık müşterisini fark etmeden kaybediyor. RFM, üç harfle (Recency-Frequency-Monetary) bu körlüğü çözer; tek ihtiyacınız bir Excel tablosu.",
      en: "Selim Bey sends the same discount to everyone who walks into his boutique coffee shop — and loses the loyal customer carrying most of his margin without ever noticing. RFM fixes that blind spot with three letters (Recency, Frequency, Monetary) and nothing more than a spreadsheet.",
    },
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 16 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlık hiyerarşisi ve liste blokları eklendi, sondaki kırık \"tüm makalelerimizi okuyun\" bağlantısı kaldırılıp ilgili vaka ve hizmet sayfalarına gerçek bağlantılarla değiştirildi, sık sorulan sorular bölümü eklendi. 28 Ağustos 2026'da başlık ve ara başlıklar külliyatın cümle düzenine getirildi, ara başlıkların bir bölümü soru formuna çevrildi.",
      en: "First published on 16 December 2025. Revised on 23 August 2026: heading hierarchy and list blocks were added, the broken \"read all our articles\" link at the end was removed and replaced with real links to relevant case studies and service pages, and an FAQ section was added. On 28 August 2026 the title and headings were brought into the sentence case used across the journal, and several headings were rewritten as questions.",
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
          tr: "RFM nedir?",
          en: "What is RFM?",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Bir matematik dersi değil, müşteri empatisi",
          en: "Not a math lesson — customer empathy",
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
          tr: "Neden herkese aynı mesajı atmak paranızı çöpe atar?",
          en: "Why does sending everyone the same message burn your budget?",
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
          tr: "RFM analizi Excel'de adım adım nasıl yapılır?",
          en: "How do you run RFM step by step in a spreadsheet?",
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
          tr: "Puanlama (skorlama)",
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
          tr: "Segmentasyon (gruplama)",
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
          tr: "Hangi segmente hangi psikolojik taktik uygulanır?",
          en: "Which psychological tactic fits which segment?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Analizi yaptınız — peki şimdi ne yapacaksınız? Davranışsal psikolojiyi kullanarak her segmente farklı bir dille konuşma zamanı.",
          en: "You've run the analysis — now what? Time to use behavioural psychology and speak to each segment in its own language.",
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
          tr: "Veriyi eyleme dönüştürme zamanı",
          en: "Time to turn data into action",
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
      {
        question: {
          tr: "RFM puanlaması nasıl yapılır?",
          en: "How do you score customers with RFM?",
        },
        answer: {
          tr: "Her müşteriye üç kriterde 1'den 5'e puan verirsiniz. 5 puan en iyileri gösterir — en son gelen, en sık gelen, en çok harcayan; 1 puan en zayıfları — en eskiden gelmiş, tek sefer gelmiş, az harcamış. Puanları yan yana yazdığınızda 5-5-5 veya 1-1-1 gibi bir segment kodu çıkar ve müşteri listeniz sıralanabilir hale gelir.",
          en: "You score every customer from 1 to 5 on each of the three criteria. A 5 marks the best — the most recent, the most frequent, the highest spending; a 1 marks the weakest — longest absent, single purchase, low spend. Written side by side, the scores produce a segment code such as 5-5-5 or 1-1-1, and the customer list becomes sortable.",
        },
      },
      {
        question: {
          tr: "RFM segmentleri nelerdir?",
          en: "What are the RFM segments?",
        },
        answer: {
          tr: "Dört grup pratikte işin çoğunu görür. Şampiyonlar (5-5-5) dün gelmiş, sık geliyor ve çok harcıyor; sadıklar düzenli gelir ama henüz o kadar taze veya yüksek harcamalı değildir; uykudakiler (R=2 veya 3) eskiden geliyordu, arayı açtı; risk grubu (R=1, F=4 veya 5) eskiden en iyi müşterinizdi ve şimdi sizi terk etti. Bir de 1-1-1 kayıp grubu vardır.",
          en: "Four groups do most of the work in practice. Champions (5-5-5) bought recently, buy often and spend a lot; loyalists buy regularly but are not yet as recent or as high-spending; the sleeping ones (R=2 or 3) used to come and have drifted away; the at-risk group (R=1, F=4 or 5) used to be your best customer and has just left. There is also the 1-1-1 lost group.",
        },
      },
      {
        question: {
          tr: "Şampiyon müşterilere indirim gönderilmeli mi?",
          en: "Should champion customers get discounts?",
        },
        answer: {
          tr: "Hayır — onların ihtiyacı indirim değil takdirdir. Zaten yarın da gelecek bir müşteriye kupon göndermek marjınızı boşuna yakar; yerine statü ve ayrıcalık verin: yeni ürünleri ilk onlar görsün, özel bir teşekkür notu veya küçük bir hediye gönderin. Bu jest karşılıklılık ilkesini tetikler ve markanızı başkalarına anlatmalarını sağlar.",
          en: "No — what they need is recognition, not a discount. Sending a coupon to someone who was coming back tomorrow anyway just burns margin; give status and access instead: let them see new products first, send a thank-you note or a small gift. That gesture triggers reciprocity and turns them into people who talk about you.",
        },
      },
      {
        question: {
          tr: "Risk grubundaki müşteri nasıl geri kazanılır?",
          en: "How do you win back an at-risk customer?",
        },
        answer: {
          tr: "Süreli ve gerçekten cazip bir teklifle, gecikmeden. Risk grubu (R=1, F=4 veya 5) kırmızı alarm bölgesidir: eskiden en iyi müşterinizdi, şimdi gelmiyor ve genellikle bunu kimse fark etmiyor. Kaybedilmiş sadık bir müşteriyi geri kazanmak yeni bir müşteri bulmaktan çok daha ucuzdur; uykudakilere ise indirim yerine samimi bir hatırlatma çoğu zaman yeter.",
          en: "With a time-bound offer that is genuinely worth taking, and without delay. The at-risk group (R=1, F=4 or 5) is the red alert zone: they used to be your best customer, they have stopped coming, and usually nobody notices. Winning back a lapsed loyal customer costs far less than finding a new one; for the sleeping group, a warm reminder is often enough without any discount.",
        },
      },
      {
        question: {
          tr: "RFM ile 80/20 kuralının ilişkisi nedir?",
          en: "How does RFM relate to the 80/20 rule?",
        },
        answer: {
          tr: "RFM, Pareto ilkesinin kendi listenizdeki karşılığını görünür kılar. Cironuzun büyük kısmı müşterilerinizin küçük bir diliminden gelir; RFM o dilimi isimleriyle çıkarır. Herkese aynı %10 indirimi gönderdiğinizde iki yönlü kaybedersiniz: zaten gelecek olan sadık müşteriye boşuna para harcarsınız, sizi çoktan unutmuş müşteriye ise %10 yetmez.",
          en: "RFM makes the Pareto principle visible inside your own list. Most of your revenue comes from a small slice of your customers, and RFM puts names on that slice. Sending everyone the same 10% discount loses on both ends: you spend money on loyalists who were coming anyway, and 10% is nowhere near enough to wake up the ones who forgot you.",
        },
      },
      {
        question: {
          tr: "Hizmet veren bir işletme RFM kullanabilir mi?",
          en: "Can a service business use RFM?",
        },
        answer: {
          tr: "Evet — tek koşul, tarih ve tutar içeren bir işlem kaydı tutmanız. Yöntem ürünle değil davranışla ilgilenir: bir diş kliniği, bir muhasebe bürosu veya bir kuaför de son randevu tarihini, randevu sıklığını ve toplam harcamayı aynı 1-5 skalasında puanlayabilir. Randevu döngüsü uzun olan hizmetlerde yenilik eşiklerini kendi döngünüze göre esnetin; aksi hâlde herkes riskli görünür.",
          en: "Yes — the only requirement is a transaction record with dates and amounts. The method cares about behaviour rather than the product: a dental clinic, an accounting firm or a hair salon can score last visit, visit frequency and total spend on the same 1-5 scale. Where the service cycle is long, widen the recency thresholds to match that cycle, otherwise everyone will look at risk.",
        },
      },
    ],
    category: "growth",
    topic: "musteri-elde-tutma",
    tags: ["rfm-analizi", "musteri-segmentasyonu", "kucuk-isletmeler"],
    authorSlug: "can-aydinlik",
    publishedAt: "2025-12-16",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "RFM analizi: küçük işletmeler için satış rehberi",
        en: "RFM analysis: a sales guide for small businesses",
      },
      description: {
        tr: "Yenilik, sıklık ve harcama sütunlarını 1'den 5'e puanlayın; müşteri segmentasyonu tek tabloda çıksın. Şampiyonlar, uykudakiler ve risk grubu ayrışır.",
        en: "Score recency, frequency and monetary value from 1 to 5 and customer segmentation appears in one sheet: champions, sleepers and the at-risk group split.",
      },
    },
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
      en: "ltv-optimisation-secret-to-growth",
    },
    title: {
      tr: "Reklam maliyetleri artarken büyümenin sırrı: LTV optimizasyonu",
      en: "As ad costs climb, growth's secret is LTV optimisation",
    },
    excerpt: {
      tr: "Reklam panelinde harcama yukarı, karlılıkta çizgi aşağı — e-ticaret yöneticilerinin ortak kâbusu bu. Çare daha fazla reklam değil: müşteriyi bir kez kazanıp bırakmak yerine, yaşam boyu değerini (LTV) büyütmek.",
      en: "Spend climbing on the ad dashboard, profit sliding on the P&L — the shared nightmare of e-commerce managers. The fix isn't more ad spend: it's growing what a customer is worth over a lifetime (LTV) instead of winning them once and letting go.",
    },
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 16 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: \"delik kova sendromu\" merkezi bir bölüm ve alıntı olarak eklendi, kırık CTA'lar GYMWOLVES vakası ve hizmet bağlantısına çevrildi, LTV:CAC oranı \"kesin kural\" değil \"yaygın kıyaslama\" olarak yeniden çerçevelendi, sık sorulan sorular eklendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi.",
      en: "First published on 16 December 2025. Revised on 23 August 2026: the \"leaky bucket syndrome\" was added as its own section and pull quote, broken CTAs were replaced with a link to the GYMWOLVES case and a service page, the LTV:CAC ratio was reframed from a \"hard rule\" to a \"common benchmark\", and an FAQ was added. On 28 August 2026 the section headings were rewritten as questions.",
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
          en: "It used to be enough to open the ad tap and watch revenue follow. The rules changed: chasing only \"new customers\" turned into an expensive hobby. This piece is about the engineering of growth that doesn't burn the ad budget — optimising customer lifetime value (LTV).",
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
          tr: "Matematik yalan söylemez: LTV:CAC oranı ne anlatır?",
          en: "The math doesn't lie: what does the LTV:CAC ratio tell you?",
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
          tr: "Delik kova sendromu markaya ne kaybettirir?",
          en: "What does leaky bucket syndrome cost a brand?",
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
          tr: "Sadakat davranış bilimiyle nasıl inşa edilir?",
          en: "How do you build loyalty with behavioural science?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Müşteriler yalnızca ürününüz \"iyi\" olduğu için sadık kalmaz. İnsan beyni alışkanlığı ve ödülü sever; davranışsal ekonomi prensipleriyle müşteriyi markaya bağlayabilirsiniz.",
          en: "Customers don't stay loyal just because your product is \"good.\" The human brain loves habit and reward — behavioural economics gives you the levers to bond a customer to your brand.",
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
          en: "The personalisation fallacy",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Merhaba Ahmet\" diye başlayan e-posta artık kişiselleştirme sayılmıyor. Gerçek kişiselleştirme, davranışı analiz edip ihtiyaç oluşmadan çözüm sunmaktır. Müşteri üç ay önce bir koşu ayakkabısı aldıysa, bugün ona yeni bir ayakkabı satmaya çalışmak yerine koşu çorabı veya beslenme jeli önermek \"seni tanıyorum\" mesajı verir.",
          en: "An email opening with \"Hi John\" isn't personalisation anymore. Real personalisation reads behaviour and answers a need before it's felt. A customer who bought running shoes three months ago doesn't need another pair pitched today — running socks or an energy gel says \"I know you\" instead.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kişiselleştirilmiş çapraz satış teoride kolay, kurulumu zor: [GYMWOLVES vakasında](/vakalar/gymwolves-12-kat-satis) kitle segmentlere ayrıldı, düşük performanslı reklam setleri kapatıldı ve yeniden hedeflemeyle çapraz satış kuruldu — üç ayda satışın 12 katına çıktığı sonucun dişlilerinden biri buydu.",
          en: "Personalised cross-sell is simple in theory, hard to build: in [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis) the audience was segmented, underperforming ad sets were closed, and retargeting was used to build cross-sell — one of the gears behind sales going up 12× in three months.",
        },
      },
      {
        type: "h2",
        id: "retention-muhendisligi",
        text: {
          tr: "Retention mühendisliği: veri nasıl aksiyona dönüşür?",
          en: "Retention engineering: how does data become action?",
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
          en: "In a period of rising ad costs, your business's survival depends less on hunting skill and more on farming patience and engineering. LTV optimisation isn't a metric — it's your business's insurance policy.",
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
          en: "The fastest, cheapest lever is activating the customers you already have, not chasing new ones. Use RFM analysis to isolate the segment sitting just before a second order, send them a targeted offer or reminder, and strip friction out of returns and support. Those two moves usually show measurable results within weeks — building a new loyalty programme from scratch can take months.",
        },
      },
      {
        question: {
          tr: "LTV optimizasyonu hangi işletmeler için kritik?",
          en: "Which businesses is LTV optimisation critical for?",
        },
        answer: {
          tr: "Tekrar satın alma döngüsü olan her işletme için — e-ticaret, abonelik/SaaS modelleri ve D2C markalar başta gelir. Reklam maliyetleri arttıkça önemi büyüyor, çünkü CAC'i karşılayan tek şey LTV. Tek seferlik yüksek bilet satışlarında (örneğin bir kereye mahsus büyük yatırım ürünlerinde) LTV'nin ağırlığı azalır, ama tavsiye ve referans değeri üzerinden yine de hesaba katılmalıdır.",
          en: "Any business with a repeat-purchase cycle — e-commerce, subscription/SaaS models and D2C brands lead the list. Its importance grows as ad costs rise, because LTV is the only thing that offsets CAC. For one-off, high-ticket sales (a single large investment purchase, for example) LTV carries less weight, but it should still be counted through referral and word-of-mouth value.",
        },
      },
      {
        question: {
          tr: "CAC (müşteri edinme maliyeti) nedir ve nasıl hesaplanır?",
          en: "What is CAC (customer acquisition cost) and how is it calculated?",
        },
        answer: {
          tr: "CAC, bir yeni müşteri kazanmak için harcadığınız toplam tutardır: belirli bir dönemdeki pazarlama ve satış giderlerini o dönemde kazanılan yeni müşteri sayısına bölersiniz. Reklam harcaması tek kalem değildir — ajans ücreti, araç abonelikleri ve satış ekibinin maliyeti de hesaba girer, yoksa CAC olduğundan düşük görünür. Meta ve Google'da CAC her yıl arttığı için bu rakam tek başına değil, LTV ile birlikte okunur.",
          en: "CAC is the total you spend to win one new customer: take marketing and sales costs for a period and divide by the new customers gained in it. Ad spend is not the only line — agency fees, tool subscriptions and the cost of the sales team belong in there too, otherwise CAC looks lower than it is. Since CAC on Meta and Google rises every year, the number only means something read alongside LTV.",
        },
      },
      {
        question: {
          tr: "Churn oranı LTV'yi nasıl etkiler?",
          en: "How does churn affect LTV?",
        },
        answer: {
          tr: "Doğrudan ve sert. LTV'nin basit hesabı ortalama sipariş değerini, satın alma sıklığını ve müşteri ömrünü çarpar; müşteri kaybetme oranı bu üçüncü çarpanı kısaltarak LTV'yi aşağı çeker. Bunun pratik sonucu şu: sepet büyüklüğünü artırmadan da LTV yükseltebilirsiniz — müşteriyi bir sipariş daha elde tutmak, ortalama sepeti büyütmekten çoğu zaman daha ucuzdur.",
          en: "Directly and hard. The simple LTV formula multiplies average order value, purchase frequency and customer lifetime; churn shortens that third factor and pulls LTV down. The practical consequence is that you can raise LTV without raising basket size — holding a customer for one more order is usually cheaper than growing the average cart.",
        },
      },
      {
        question: {
          tr: "Abonelik modeli LTV'yi neden yükseltir?",
          en: "Why does a subscription model raise LTV?",
        },
        answer: {
          tr: "Satın alma kararını tekrar tekrar aldırmadığı için. Başarılı markalar ürünü bir tercih olmaktan çıkarıp refleks haline getirir; abonelikte müşteri kararı bir kez verir, gerisi otomatikleşir. Alışkanlık döngüsünün mantığı budur: müşterinin hayatında tetikleyici oluştuğunda — kahvem bitti, cildim kurudu — akla gelen ilk yer markanız olur.",
          en: "Because it stops the customer from having to decide again and again. Strong brands move a product from being a choice to being a reflex; with a subscription the decision is made once and the rest runs itself. That is the habit loop at work: when the trigger appears in the customer's life — I am out of coffee, my skin is dry — your brand is the first place that comes to mind.",
        },
      },
      {
        question: {
          tr: "İlk siparişte zarar etmek mantıklı mı?",
          en: "Does it make sense to lose money on the first order?",
        },
        answer: {
          tr: "LTV'yi biliyorsanız mantıklı, bilmiyorsanız tehlikeli. İlk siparişte kâr etme devri kapandı; kâr artık ikinci, üçüncü ve onuncu siparişte saklı. Ama bu hesabı yapabilmek için müşterinin yaşam boyu değerini ve ikinci sipariş oranını ölçüyor olmanız gerekir — ölçmeden ilk siparişte zarara razı olmak strateji değil temennidir.",
          en: "Sensible if you know your LTV, dangerous if you do not. The era of profiting on the first order is over; the profit now sits in the second, third and tenth. But making that calculation requires that you actually measure lifetime value and second-order rate — accepting a loss on the first order without measuring is a wish rather than a strategy.",
        },
      },
      {
        question: {
          tr: "Elde tutmayı artırmak için ilk hangi sürtünme kaldırılır?",
          en: "Which friction should you remove first to improve retention?",
        },
        answer: {
          tr: "Satın alma sonrası olanlar. Müşteri tutmanın en kolay yolu, gitmelerine sebep olan engelleri kaldırmaktır: iade süreci zor mu, müşteri hizmetlerine ulaşmak imkânsız mı, kargo durumu görünüyor mu? Kötü bir satış sonrası deneyim en iyi pazarlama kampanyasını bile siler; bu yüzden sürtünme temizliği yeni bir sadakat programı kurmaktan önce gelir.",
          en: "The friction that comes after the purchase. The easiest way to keep customers is removing the obstacles that make them leave: is returning an item hard, is customer service unreachable, is shipping status visible? A bad post-purchase experience erases even the best campaign, which is why clearing friction comes before building a loyalty programme.",
        },
      },
      {
        question: {
          tr: "Çapraz satış önerileri nasıl kurulur?",
          en: "How do you build cross-sell recommendations?",
        },
        answer: {
          tr: "Aynı ürünü tekrar satmaya çalışarak değil, bir sonraki ihtiyacı önceden görerek. Müşteri üç ay önce koşu ayakkabısı aldıysa bugün ona yeni bir ayakkabı önermek onu tanımadığınızı söyler; koşu çorabı veya beslenme jeli önermek tanıdığınızı söyler. Gerçek kişiselleştirme adla hitap etmek değil, davranışı okuyup ihtiyaç oluşmadan önce öneriyi masaya koymaktır.",
          en: "Not by selling the same product again, but by seeing the next need before it appears. If someone bought running shoes three months ago, offering another pair today says you do not know them; offering running socks or an energy gel says you do. Real personalisation is not using a first name — it is reading behaviour and putting the recommendation on the table before the need is felt.",
        },
      },
    ],
    category: "growth",
    topic: "musteri-elde-tutma",
    tags: ["ltv-optimizasyonu", "musteri-sadakati", "cac"],
    authorSlug: "can-aydinlik",
    publishedAt: "2025-12-16",
    readingMinutes: 5,
    seo: {
      title: {
        tr: "LTV optimizasyonu nedir, nasıl hesaplanır?",
        en: "LTV optimisation: what it is, how to grow it",
      },
      description: {
        tr: "Sağlıklı bölge 3:1 — CAC'a harcanan her birime karşılık yaşam boyu değerde üç birim. Hesabın adımları, kırılma noktaları ve tekrar satın almayı büyütmek.",
        en: "The healthy band is 3:1 — three units of lifetime value for every unit of customer acquisition cost. How to calculate it and how to grow repeat purchase.",
      },
    },
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
  updatedAt: "2026-08-28",
  updateNote: {
    tr: "Bu yazı ilk olarak 21 Aralık 2025'te \"yeni yıl stratejisi\" çerçevesiyle yayımlandı. 23 Ağustos 2026'da gözden geçirildi: başlık ve giriş takvime bağlı \"yeni yıl\" vurgusundan çıkarılıp \"önümüzdeki 12 ay\" çerçevesine taşındı — adımların sırası ne zaman başlarsanız başlayın aynı kalıyor. Kaynaksız genel örnekler (isimsiz bir mobilya markası, isimsiz bir kahve markası) sitede yayımlanan gerçek vakalara (FYR, İstanbul Ortez Protez) bağlandı, kırık CTA'lar gerçek bağlantılara çevrildi ve 4 soruluk SSS eklendi. 28 Ağustos 2026'da adım başlıkları soru formuna getirildi.",
    en: "First published on 21 December 2025 under a \"new year strategy\" framing. Revised on 23 August 2026: the title and opening moved from the calendar-bound \"new year\" framing to a \"next 12 months\" framing — the order of the steps holds regardless of when you start. The unsourced generic examples (an unnamed furniture brand, an unnamed coffee brand) were replaced with real published cases (FYR, İstanbul Ortez Protez), broken CTAs became real links, and a 4-question FAQ was added. On 28 August 2026 the step headings were rewritten as questions.",
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
        tr: "1. Müşterinizi veriyle nasıl yeniden tanırsınız?",
        en: "1. How do you get to know your customer through data?",
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
        tr: "2. Dijital mağaza neden bir labirente dönmemeli?",
        en: "2. Why must a digital storefront never feel like a maze?",
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
        tr: "3. İçerik otoritesi neden ölçeklenmenin yakıtı?",
        en: "3. Why is content authority the fuel of scale?",
      },
    },
    {
      type: "p",
      text: {
        tr: "Dijitalde ölçeklenmenin yakıtı güvendir. İnsanlar tanımadıkları ve uzmanlığına inanmadıkları markalardan alışveriş yapmaz. Ürün paylaşmak tek başına yetmez; sektörünüzle ilgili \"nasıl yapılır\" içerikleri ve rehber yazılarla sizi sadece bir satıcı değil, sorunu gerçekten çözen taraf konumuna taşıyan bir otorite kurmalısınız.",
        en: "Trust is the fuel of digital scale. People don't buy from brands they don't recognise or trust. Sharing product photos isn't enough on its own — \"how to\" content and guides in your field build you into an authority, not just a seller but the party that actually solves the problem.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Sosyal kanıt da bu otoritenin parçasıdır: başkalarının sizin hakkınızda söylediği, sizin söylediğinizden daha ağır basar. Müşteri yorumlarını ve gerçek sonuçları stratejinizin merkezine koyun.",
        en: "Social proof is part of that authority too: what others say about you carries more weight than what you say about yourself. Put customer reviews and real results at the centre of your strategy.",
      },
    },
    {
      type: "p",
      text: {
        tr: "Bu mantığın en somut kanıtı arama sonuçlarında görünür. [İstanbul Ortez Protez vakamızda](/vakalar/istanbul-ortez-protez-arama-gorunurlugu) içeriği hem klasik SEO hem GEO (AI arama motorları için optimizasyon) için kurduk — soru-cevap yapısı, teknik derinlik, AI motorlarının doğrudan alıntılayabileceği kendine yeten pasajlar. On beş ayda öncelikli aramalarda ilk 3'e çıktık; reklamla desteklenen kelimelerde ayda ortalama 10 yeni hasta geldi. Küçük bir işletme için bu, büyük bir reklam bütçesinden daha ucuz ve daha kalıcı bir görünürlük kanalıdır.",
        en: "The most concrete proof of this logic shows up in search results. In [our İstanbul Ortez Protez case](/vakalar/istanbul-ortez-protez-arama-gorunurlugu) we built content for classic SEO and GEO (optimisation for AI search engines) alike — Q&A structure, technical depth, self-contained passages AI engines can cite directly. In fifteen months we reached the top 3 for priority searches; ad-supported terms brought an average of 10 new patients a month. For a small business, that's a cheaper and more durable visibility channel than a large ad budget.",
      },
    },
    {
      type: "h2",
      id: "reklam-butcesini-yatirima-cevirin",
      text: {
        tr: "4. Reklam bütçesi neden gider değil yatırımdır?",
        en: "4. Why is an ad budget an investment, not an expense?",
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
        tr: "5. Otomasyon ve AI zamanı nasıl geri kazandırır?",
        en: "5. How do automation and AI buy back your time?",
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
        en: "You too can turn ad spend from a lottery ticket into a growth engine built on data and human behaviour. If you're not sure where to start, take a look at [our case studies](/vakalar) or [our digital transformation service](/hizmetler/dijital-donusum) — together we'll work out which step is the priority for your business.",
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
    {
      question: {
        tr: "Psikografik analiz nedir, demografiden farkı ne?",
        en: "What is psychographic analysis and how does it differ from demographics?",
      },
      answer: {
        tr: "Demografi müşterinin kim olduğunu, psikografi neden satın aldığını söyler. \"25-45 yaş arası, İstanbul'da yaşayan kadınlar\" buzdağının görünen kısmıdır; ilgi alanı, değer yargısı ve yaşam tarzı ise satın alma kararını gerçekten belirleyen kısımdır. Müşteri ürünü ihtiyacı olduğu için değil, o ürüne sahip olduğunda hissedeceği duygu için alır — reklam metni bu duyguya göre yazılır.",
        en: "Demographics tell you who the customer is; psychographics tell you why they buy. \"Women aged 25-45 living in Istanbul\" is the visible tip of the iceberg, while interests, values and lifestyle are what actually drive the purchase. People do not buy a product because they need it, they buy it for how owning it will feel — and that feeling is what the ad copy gets written around.",
      },
    },
    {
      question: {
        tr: "Bilişsel yük nedir, sitede nasıl azaltılır?",
        en: "What is cognitive load and how do you reduce it on a site?",
      },
      answer: {
        tr: "Bilişsel yük, bir görevi tamamlamak için harcanan zihinsel çabadır; yükseldikçe satın almaktan vazgeçme oranı artar. Hick Yasası nedenini açıklar: seçenek sayısı arttıkça karar verme süresi uzar. Pratik üç kontrol: siteye giren biri 3 saniyede ne sattığınızı anlıyor mu, sepetten ödemeye kaç adım var (4'ten fazlaysa hangisi gerçekten gerekli), ödeme için üyelik zorunlu mu?",
        en: "Cognitive load is the mental effort a task demands, and the higher it goes, the more people abandon the purchase. Hick's law explains why: the more options there are, the longer the decision takes. Three practical checks: can a first-time visitor tell what you sell within three seconds, how many steps run from cart to payment (if more than four, which ones are truly necessary), and is registration required to pay?",
      },
    },
    {
      question: {
        tr: "Kayıptan kaçınma ilkesi reklam metnine nasıl girer?",
        en: "How does loss aversion enter ad copy?",
      },
      answer: {
        tr: "Kazanç vaadini kayıp uyarısına çevirerek. İnsan beyni bir şeyi kazanmanın mutluluğundan çok elindekini kaybetme korkusuna tepki verir; \"bunu kazanın\" diye konuşan bir metin yerine \"bunu kaybetmeyin\" diye konuşan metin çoğu zaman daha çok satar. Koşul aynı kalır: kayıp gerçek olmalı — uydurulmuş bir kaçırma korkusu kısa vadede tıklama, uzun vadede güven kaybı üretir.",
        en: "By turning a promise of gain into a warning about loss. The brain reacts more strongly to losing what it already has than to gaining something new, so copy that says \"do not lose this\" often outsells copy that says \"win this\". The condition stays the same: the loss has to be real — a manufactured fear of missing out buys clicks now and costs trust later.",
      },
    },
    {
      question: {
        tr: "Küçük bir işletme içerik otoritesini nasıl kurar?",
        en: "How does a small business build content authority?",
      },
      answer: {
        tr: "Ürün paylaşmayı bırakıp soru cevaplayarak. Sektörünüzle ilgili nasıl yapılır içerikleri ve rehber yazılar sizi satıcı konumundan sorunu çözen taraf konumuna taşır; sosyal kanıt bu otoritenin ikinci ayağıdır, çünkü başkalarının söylediği sizin söylediğinizden ağır basar. İstanbul Ortez Protez vakasında içeriği hem klasik arama hem yapay zeka motorları için kurduk; on beş ayda öncelikli aramalarda ilk 3'e çıktık ve ayda ortalama 10 yeni hasta geldi.",
        en: "By answering questions instead of posting products. How-to content and guides in your field move you from seller to the party that solves the problem; social proof is the second leg, because what others say outweighs what you say. In the İstanbul Ortez Protez case we built content for classic search and AI engines at once; priority terms reached the top three in fifteen months and around 10 new patients arrived per month.",
      },
    },
    {
      question: {
        tr: "Bir KOBİ hangi işleri otomatikleştirmeli?",
        en: "Which tasks should an SME automate?",
      },
      answer: {
        tr: "Her gün elle tekrarlanan işleri. Gece geç saatte gelen soruya anında yanıt veren bir sohbet sistemi, müşterinin son alışverişinden bir süre sonra ürününün bitmiş olabileceğini hatırlatan bir CRM ve her gün elle yazılan tekrar e-postaları ilk sıradaki adaylardır. Araç seçimi ekip büyüklüğünüze uygun olmalı — on kişilik bir işletmenin kuracağı otomasyon, yüz kişilik bir işletmeninkiyle aynı olmaz.",
        en: "The ones your team repeats by hand every day. A chat system that answers a question arriving late at night, a CRM that reminds a customer some weeks after their last order that they may be running out, and the emails someone retypes daily are the first candidates. Match the tool to your team size — the automation a ten-person business needs is not the one a hundred-person business needs.",
      },
    },
    {
      question: {
        tr: "Satışlar düşünce reklam bütçesi kesilmeli mi?",
        en: "Should you cut the ad budget when sales drop?",
      },
      answer: {
        tr: "Kesmek yerine denetleyin. KOBİ'lerin en sık yaptığı hata reklamı bir gider kalemi sayıp daralma anında ilk ondan vazgeçmektir; oysa doğru kurulmuş bir reklam sistemi içine koyduğunuzdan fazlasını geri veren bir makinedir. Karar ROAS ve LTV ile verilir: bütçeyi her hafta kazanan kreatife ve kazanan kitleye kaydırın, kaybedeni hızla kapatın — FYR lansmanında reklam getirisi 20 katın üzerinde seyretti.",
        en: "Audit it instead of cutting it. The most common SME mistake is treating advertising as a cost line and dropping it first when things tighten, when a properly built ad system returns more than you put in. Decide with ROAS and LTV: move the budget weekly toward the winning creative and the winning audience and shut the losers down fast — in the FYR launch, return on ad spend held above 20x.",
      },
    },
  ],
  category: "growth",
  topic: "is-gelistirme",
  tags: ["kobi-dijitallesme", "buyume-stratejisi", "musteri-edinimi"],
  authorSlug: "can-aydinlik",
  publishedAt: "2025-12-21",
  readingMinutes: 6,
  seo: {
    title: {
      tr: "KOBİ'lerde dijital dönüşüm: 12 ayda 5 adım",
      en: "Digital transformation for SMEs: 5 steps",
    },
    description: {
      tr: "Veri, arayüz, içerik, bütçe ve yapay zeka otomasyonu — sırası değişmeyen adımlar. FYR'de 12 aylık ciro hedefi ilk 3 ayda geçildi; izlenen sıra buydu.",
      en: "Data, storefront, content, budget, AI automation — steps in a fixed order. FYR cleared a 12-month revenue target in its first 3 months on the same path.",
    },
  },
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 22 Aralık 2025'te yayımlandı. 23 Ağustos 2026'da gözden geçirildi: sürtünme ve puanlama tavsiyelerini gerçek bir uygulamada gösteren Meccanotecnica Umbra vakası eklendi, smarketing bölümüne SLA açıklaması getirildi, MQL/SQL/ICP terimleri ilk geçtikleri yerde açıklandı ve dört soruluk SSS eklendi. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi.",
      en: "First published on 22 December 2025. Revised on 23 August 2026: added the Meccanotecnica Umbra case showing the friction and scoring advice in a real deployment, added an SLA explanation to the smarketing section, defined MQL/SQL/ICP on first use, and added a four-question FAQ. On 28 August 2026 the section headings were rewritten as questions.",
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
          tr: "İdeal müşteri profilini (ICP) neden daraltmalısınız?",
          en: "Why should you narrow your Ideal Customer Profile (ICP)?",
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
          tr: "Smarketing uyumu: MQL ve SQL savaşı nasıl biter?",
          en: "Smarketing alignment: how does the MQL vs. SQL war end?",
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
          tr: "Puanlama (lead scoring) sistemi neyi çözer?",
          en: "What does a lead scoring system solve?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Satışçınız sabah kimi arayacağına nasıl karar veriyor — rastgele mi? Bunu şansa bırakmayın. Davranışlara puan verin, yalnızca eşiği geçenleri arayın.",
          en: "How does your salesperson decide who to call first thing in the morning — at random? Don't leave it to chance. Score behaviour, and only call the ones who clear the threshold.",
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
          tr: "Formda bilinçli sürtünme neden işe yarar?",
          en: "Why does deliberate friction in a form work?",
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
          en: "Three signals matter together: ICP fit (does the company match your ideal profile), behavioural score (lead scoring — which pages they visited, what actions they took), and sales feedback (the conversion rate from SQL to opportunity, and opportunity to close). There's no single 'right' threshold — it depends on your industry and sales cycle length. What matters is tracking all three signals together, consistently, not in isolation.",
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
          en: "A precise number would be misleading — B2B sales cycles usually run longer than consumer ones, and the decision passes through more than one person. The common observation cites multiple touchpoints, often somewhere around six to ten, but committee size and product complexity shift that number considerably — in short, it depends on the industry. The practical takeaway: instead of writing off someone you couldn't reach in one call as a \"bad lead\", track their behaviour over time with lead scoring.",
        },
      },
      {
        question: {
          tr: "ICP (ideal müşteri profili) nedir, nasıl çıkarılır?",
          en: "What is an ICP (ideal customer profile) and how do you define one?",
        },
        answer: {
          tr: "ICP, kişiyi değil şirketi tanımlayan profildir ve demografik değil firmografik verilerle çizilir. Üç soruyla başlar: ciro büyüklüğü nedir, teknoloji veya dış hizmet bütçesi var mı, çalışan sayısı ne kadar ve satın alma kararını kim veriyor? Asıl faydalı soru kimi istediğiniz değil kimi istemediğinizdir — istenmeyenler listesi reklam hedeflemesine ve form filtrelerine girdiğinde çöp lead kapıda kalır.",
          en: "An ICP describes the company rather than the person, and it is drawn with firmographic instead of demographic data. It starts with three questions: what is the revenue band, is there a budget for technology or outside services, how many employees are there and who signs off on the purchase? The more useful question is not who you want but who you do not want — once that list feeds ad targeting and form filters, junk leads stop at the door.",
        },
      },
      {
        question: {
          tr: "Lead scoring nasıl kurulur?",
          en: "How do you set up lead scoring?",
        },
        answer: {
          tr: "Davranışlara puan verip yalnızca eşiği geçenleri aratarak. Örnek bir tablo: fiyat sayfasını gezdi +20, ürün demosunu izledi +15, blog yazılarına baktı +5, kariyer sayfasına tıkladı −50, hizmet vermediğiniz bir ülkeden giriş yaptı −100. Eşiğe — örneğin 70 puana — ulaşan lead satışçıya otomatik bildirim olarak gitsin ve puanlamayı çeyrek başına gözden geçirin, çünkü hangi davranışın satın almayı öngördüğü zamanla değişir.",
          en: "By scoring behaviour and only calling the ones that clear the threshold. A sample table: visited the pricing page +20, watched the product demo +15, read blog posts +5, clicked the careers page −50, visited from a country you do not serve −100. When a lead crosses the threshold — say 70 points — send the salesperson an automatic alert, and review the scoring each quarter, because which behaviours predict a purchase changes over time.",
        },
      },
      {
        question: {
          tr: "Smarketing nedir?",
          en: "What is smarketing?",
        },
        answer: {
          tr: "Smarketing, satış ve pazarlama ekiplerinin aynı dili konuşmasıdır. Lead'lerin kötü olduğunu söyleyen satışçıyla satamadıklarını söyleyen pazarlamacı arasındaki kavgayı bitirmenin yolu, MQL ve SQL tanımlarını iki tarafın da imzaladığı bir metne bağlamaktan geçer. İletişim çift yönlü olmalı: satış ekibi gelen lead'lerin kalitesini pazarlamaya raporlayabilmeli, böylece toplantı kim haklıydı tartışmasından eşiği nereye çekelim konuşmasına döner.",
          en: "Smarketing is sales and marketing speaking the same language. Ending the fight between the rep who says the leads are bad and the marketer who says sales cannot close starts with definitions of MQL and SQL that both sides have signed off. The feedback has to run both ways: sales must be able to report lead quality back to marketing, so the meeting turns from who was right into where the threshold should sit.",
        },
      },
      {
        question: {
          tr: "SLA satış ve pazarlama arasında ne işe yarar?",
          en: "What does an SLA do between sales and marketing?",
        },
        answer: {
          tr: "Uyumun iyi niyetten çıkıp taahhüde dönmesini sağlar. SLA (hizmet seviyesi anlaşması) iki tarafa da sayı verir: pazarlama belirli sürede kaç MQL üreteceğini, satış ilk temasını kaç saat içinde kuracağını yazar. Yazılı bir eşik olmadığında hızlı dönüldüğü ve kaliteli lead gönderildiği iddiaları ölçülemez kalır ve suçlama döngüsü baştan başlar.",
          en: "It turns alignment from goodwill into commitment. An SLA (service level agreement) puts a number on both sides: marketing writes how many MQLs it will produce in a given period, sales writes how many hours it has to make first contact. Without a written threshold, claims about fast responses and good leads stay unmeasurable and the blame loop restarts.",
        },
      },
      {
        question: {
          tr: "B2B formunda kaç soru sorulmalı?",
          en: "How many questions should a B2B form ask?",
        },
        answer: {
          tr: "Meraklıyı eleyecek kadar, alıcıyı yormayacak kadar. B2B'de isim ve e-posta yetmez; bütçe ve başlangıç tarihi gibi sorular görüldüğünde meraklı formu terk eder, gerçek alıcı doldurur. Sürtünmeyi tek bir uzun forma sıkıştırmak zorunda değilsiniz — kademeli profil oluşturmayla ilk temasta kısa form yeterli, derinleşen sorular ikinci ve üçüncü temasta gelir.",
          en: "Enough to filter out browsers, not enough to tire a buyer. In B2B, name and email are not enough; questions about budget and start date make the merely curious leave while the real buyer completes the form. You do not have to compress the friction into one long form — with progressive profiling, a short form is fine at first contact and the deeper questions arrive on the second and third.",
        },
      },
      {
        question: {
          tr: "Kibir metrikleri (vanity metrics) nedir?",
          en: "What are vanity metrics?",
        },
        answer: {
          tr: "Kibir metrikleri, rakamı büyüyen ama geliri büyütmeyen ölçülerdir; B2B'de en yaygını toplam lead sayısıdır. Şirketler bu tuzağa art niyetle değil ölçüm alışkanlığıyla düşer: lead sayısı toplantıda gösterilmesi kolay bir rakamdır, gelir dönüşümü ise haftalar sonra ve dolaylı görünür. Panoda tutulacak doğru ölçüler ICP uyumu, MQL'den SQL'e geçiş oranı ve kapanış oranıdır.",
          en: "Vanity metrics are numbers that grow without growing revenue; in B2B the most common one is total lead count. Companies fall into it out of measurement habit rather than bad faith: lead count is easy to show in a meeting, while revenue conversion appears weeks later and indirectly. The right measures for the dashboard are ICP fit, MQL-to-SQL conversion and close rate.",
        },
      },
    ],
    category: "growth",
    topic: "performans-pazarlama",
    tags: ["b2b-lead-kalitesi", "lead-scoring", "smarketing"],
    authorSlug: "burak-ozgul",
    publishedAt: "2025-12-22",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "B2B lead kalitesi: ICP, lead scoring ve huni",
        en: "B2B lead quality: ICP, scoring and the funnel",
      },
      description: {
        tr: "Bin lead kutlanır, satış sıfıra yakın kapatır. Profili daraltın, davranışı puanlayın, 70 eşiğinde bildirim kurun; süreç otomasyonu teklifi 10 katına çıkardı.",
        en: "A thousand leads, almost no deals. Narrow the profile, score behaviour, alert sales at 70 points; process automation lifted quote requests tenfold here.",
      },
    },
  },
  // Eski blogdan taşındı (2026-01-14, "yapay-zeka-aramalarinda-nasil-one-cikarsiniz").
  // Emre anlatısı ve kıtlık çerçevesi aynen korundu. Eklenenler: GEO tanım bölümü
  // (açılım + "AI SEO"/"LLM optimizasyonu" eş anlamlıları), sahadan kanıt bölümü
  // (SIM, İstanbul Ortez Protez, Meccanotecnica) ve 4 soruluk SSS. Çıkarılanlar:
  // "Case Study Önerisi" etiketli, kaynağı doğrulanamayan HubSpot rakamları;
  // "2. Temel Noktalar" numaralandırması; kırık "buraya tıklayın" CTA'sı ve ":)".
  // Tablo, blok modelinde prose+listeye çevrildi. TR slug eski URL ile aynı.
  //
  // 2026-08-28 (K-3 kararı): GEO kümesinin kanonik rehberi bölünmedi, aynı
  // slug'da derinleştirildi — yazı Google'da poz. 38'de tohum taşıyor ve slug
  // değişimi o tohumu yakardı. Gövde 1.017 → 2.000+ TR kelimeye çıkarıldı;
  // dört yeni bölüm eklendi (terim ayrımı, atlanma sebepleri, taktik katmanı,
  // 10 promptluk ölçüm turu). Kelime hedefi: "yapay zeka optimizasyonu" (GSC
  // 136 gösterim, sitede hiç geçmiyordu) bir H2 ile sahiplenildi; "geo
  // optimizasyonu" tam formu ve AEO açılımı gövdeye girdi. AI Overviews ve
  // llms.txt kendi rehberlerine ayrıldı, buradan çapraz link verildi.
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
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 14 Ocak 2026'da yayımlandı ve 28 Ağustos 2026'da genişletildi: yapay zeka optimizasyonu, GEO ve AEO terimlerini birbirinden ayıran bölüm, bir modelin markayı neden atladığını anlatan teşhis listesi, alıntılanabilirliği dört müdahaleye indiren taktik bölümü ve GEO çalışmasını sabit 10 promptluk aylık turla ölçme yöntemimiz eklendi. Google AI Overviews ile llms.txt kendi rehberlerine ayrıldı; bu yazı ikisine de bağlanıyor.",
      en: "First published on 14 January 2026 and expanded on 28 August 2026: a section separating the terms AI optimisation, GEO and AEO, a diagnostic list of why a model skips a brand, a tactics section reducing quotability to four interventions, and the fixed 10-prompt monthly round we use to measure GEO work. Google AI Overviews and llms.txt moved into guides of their own, and this article links to both.",
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
          en: "The field hasn't settled on a name: some say \"AI SEO\", others \"LLM optimisation\". All three describe the same work. We prefer GEO, because what we optimise for is no longer the search engine but the engine that generates the answer.",
        },
      },
      {
        type: "h2",
        id: "yapay-zeka-optimizasyonu",
        text: {
          tr: "Yapay zeka optimizasyonu nedir, GEO ile aynı şey mi?",
          en: "What is AI optimisation, and is it the same as GEO?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka optimizasyonu, bir markanın üretken yapay zeka sistemlerinde doğru ve alıntılanabilir biçimde temsil edilmesi işidir — yani GEO'nun kendisi. İkisi arasında yöntem farkı yok; fark, kelimenin nereden geldiğinde. GEO adını optimize edilen yüzeyden alıyor: yanıtı üreten motor. Yapay zeka optimizasyonu ise bu işi arayan kişinin yazdığı kelime.",
          en: "AI optimisation is the work of making sure a brand is represented accurately and quotably inside generative AI systems — which is GEO itself. There is no difference of method between the two; the difference is where the word came from. GEO takes its name from the surface being optimised: the engine that generates the answer. AI optimisation is the phrase people type when they go looking for that work.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Terim kalabalığı gerçek bir sorun, çünkü aynı bütçeyi konuşan iki kişi farklı kelime kullanıyor. Sadeleştirelim: geo optimizasyonu ve yapay zeka arama optimizasyonu, yapay zeka optimizasyonunun daha dar iki adıdır — ilki yöntemi, ikincisi yüzeyi işaret eder. Answer engine optimization (AEO — yanıt motoru optimizasyonu), aynı disiplinin hedefinden adını alan İngilizce karşılığıdır. AI SEO ve LLM optimizasyonu ise sektörün geçici kısaltmaları. Beşi de tek bir soruyu soruyor: model bir cevabı kurarken sizi neden alsın?",
          en: "The crowd of terms is a real problem, because two people discussing the same budget reach for different words. To simplify: GEO optimisation and AI search optimisation are two narrower names for AI optimisation — the first points at the method, the second at the surface. Answer engine optimisation (AEO) is the same discipline named after what it targets: the answer. AI SEO and LLM optimisation are the industry's temporary shorthands. All five ask one question: when the model assembles an answer, why should it take yours?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ayrım terimlerde değil, yüzeylerde anlamlı. ChatGPT'de anılmak, Perplexity'de kaynak gösterilmek ve Google AI Overviews'da yer almak farklı mekanizmalara dayanır: ilk ikisi sohbet bağlamını ve kendi canlı arama katmanını kullanır, üçüncüsü Google'ın indeksine ve sıralama sinyallerine yaslanır. Bu yüzden AI Overviews'u ayrı bir başlıkta ele aldık — mekaniği ve ölçümü için [Google AI Overviews rehberi](/yazilar/google-ai-overviews-da-yer-almak).",
          en: "The meaningful distinction isn't between terms, it's between surfaces. Being named in ChatGPT, being cited in Perplexity and appearing in Google AI Overviews rest on different mechanisms: the first two draw on the conversation context and their own live search layer, the third leans on Google's index and ranking signals. That is why we treat AI Overviews under its own heading — the mechanics and the measurement are in the [Google AI Overviews guide](/yazilar/google-ai-overviews-da-yer-almak).",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pratik sonuç şu: hangi kelimeyi kullandığınız değil, hangi işi satın aldığınız belirleyici. Bir ajans size yapay zeka optimizasyonu satarken sıralama raporu gösteriyorsa, satılan şey SEO'dur. Bu işin raporu farklıdır — kaç yanıtta anıldığınızı, hangi cümleyle anıldığınızı ve hangi sayfanın kaynak gösterildiğini içerir. Ölçüsü tarif edilmemiş bir GEO teklifi, tanımı yapılmamış bir iştir.",
          en: "The practical consequence: what matters is not the word you use but the work you are buying. If an agency sells you AI optimisation and shows you a ranking report, what you bought is SEO. This work reports differently — how many answers named you, in which sentence you were named, and which page was cited as the source. A GEO proposal that never describes its measure is a job that was never defined.",
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
        id: "neden-atlaniyorsunuz",
        text: {
          tr: "Model sizi neden atlıyor?",
          en: "Why does the model skip you?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Atlanmanın çoğu zaman dramatik bir sebebi yok. Sayfa duruyor, indekste ve çoğu zaman iyi de sıralanıyor — ama yanıtın hammaddesi olmuyor. Sahada tekrar eden beş sebep var ve beşi de teknik değil, editoryal.",
          en: "Being skipped rarely has a dramatic cause. The page is there, it is indexed and it often ranks well — it simply never becomes raw material for the answer. Five causes repeat in the field, and all five are editorial rather than technical.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Sayfada cevap değil, davet var. Metin \"bizimle iletişime geçin\" diyor ama sorunun kendisini yanıtlamıyor; modelin alacağı cümle hiç yazılmamış.",
            en: "The page holds an invitation, not an answer. The text says \"get in touch\" but never answers the question itself; the sentence the model would lift was never written.",
          },
          {
            tr: "Rakam metnin dışında duruyor. Veri görselde, PDF'te veya bir tabloda kalmışsa model çoğu zaman göremez — cümlenin içinde geçmeyen rakam yok sayılır.",
            en: "The number sits outside the text. If the data stayed in an image, a PDF or a table, the model usually can't see it — a figure that isn't inside a sentence counts as absent.",
          },
          {
            tr: "İçerik JavaScript'in arkasında. Sayfa tarayıcıda dolu, ham HTML'de boş; kod çalıştırmayan bir okuyucu orada hiçbir şey bulmaz.",
            en: "The content hides behind JavaScript. The page is full in a browser and empty in the raw HTML; a reader that doesn't execute code finds nothing there.",
          },
          {
            tr: "Marka tanımı kaynaklar arasında tutarsız. Sitede bir, LinkedIn'de başka, dizinlerde üçüncü bir tanım varsa model hangisini yazacağına karar veremez ve emin olduğu rakibi yazar.",
            en: "The brand's definition contradicts itself across sources. One description on the site, another on LinkedIn, a third in the directories — the model can't decide which to use and writes the competitor it is sure about.",
          },
          {
            tr: "Sayfa tek bir uzun blok. Başlıksız üç bin kelime, alıntılanabilir tek bir parça üretmez; ne model için ne okur için.",
            en: "The page is one long block. Three thousand words without headings produce not a single quotable piece — for the model or for the reader.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu beşini düzeltmek bütçe değil karar gerektiriyor. Ama beşi dururken yürütülen bir yapay zeka arama optimizasyonu çalışması, oturmamış zemine kat çıkmaktır: kelime araştırması yapılır, içerik üretilir, sonuç yine okunmaz.",
          en: "Fixing these five takes a decision rather than a budget. Run an AI search optimisation programme while they stand and you are adding floors to unset ground: the keyword research happens, the content ships, and the result still doesn't read.",
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
        id: "alintilanabilir-sayfa",
        text: {
          tr: "Bir sayfa nasıl alıntılanabilir hâle gelir?",
          en: "How does a page become quotable?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yanıt-öncelikli mimari bir ilke; geo optimizasyonu dediğimizde sayfada yaptığımız şey dört müdahaledir. Sırayla uygularız, çünkü her adım bir öncekinin üstüne biner: yapısı bozuk bir sayfaya yapısal veri basmak, boş odaya tabela asmaktır.",
          en: "Answer-first architecture is a principle; what GEO optimisation actually does on a page is four interventions. We apply them in order, because each one sits on the one before it: stamping structured data onto a badly structured page is hanging a sign on an empty room.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Alıntılanabilir paragraf testi",
          en: "The quotable-paragraph test",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sayfadan rastgele bir paragraf kesin ve bağlamından kopuk okuyun. Öznesi belli mi? İddiası tek cümlede duruyor mu? Rakamı kendi içinde mi geçiyor? Üçünden birine hayır diyorsanız o paragraf alıntılanamaz: model onu bir yanıtın içine koyduğunda cümle anlamını kaybeder, dolayısıyla koymaz. Testi yazının tamamına değil, her H2'nin altındaki ilk paragrafa uygularız — alıntı çoğunlukla oradan çıkıyor. Testi geçen paragraf sayfanın en iyi paragrafı olmak zorunda değil; yalnızca tek başına ayakta durmak zorunda.",
          en: "Cut a paragraph out of the page at random and read it stripped of context. Is its subject clear? Does its claim stand in one sentence? Is its number inside the sentence? A no to any of the three means the paragraph can't be quoted: dropped into an answer it would lose its meaning, so the model leaves it. We run the test not on the whole article but on the first paragraph under every H2 — that is where the quote usually comes from. The paragraph that passes doesn't have to be the best one on the page; it only has to stand on its own.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Soru-H2 disiplini",
          en: "The question-heading discipline",
        },
      },
      {
        type: "p",
        text: {
          tr: "Başlıkları yazarken tek kısıt koyuyoruz: her H2, bir müşterinin gerçekten kurduğu cümle olmalı. Kaynağı uydurmuyoruz — Search Console'un sorgu raporu, satış görüşmelerinin ilk on dakikası ve destek kayıtları üç ayrı liste veriyor; başlık üçünün kesiştiği yerden çıkıyor. \"Hizmetlerimiz\" hiçbir listede yok, \"geo optimizasyonu ne kadar sürer\" üçünde de var. Bir yazıda beş-yedi H2'yi geçmiyoruz, çünkü kendi cevabını taşımayan başlık gürültüdür.",
          en: "We put one constraint on headings: every H2 must be a sentence a customer actually said. We don't invent the source — Search Console's query report, the first ten minutes of sales calls and the support tickets each produce a list, and the heading comes from where the three overlap. \"Our services\" appears on none of them; \"how long does GEO optimisation take\" appears on all three. We stay within five to seven H2s per article, because a heading carrying no answer of its own is noise.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Yapısal veri ve makinenin okuduğu katman",
          en: "Structured data and the layer the machine reads",
        },
      },
      {
        type: "p",
        text: {
          tr: "Görünen metnin altında bir de yalnız makinenin okuduğu katman var. Her yazıya Article, sık sorulan sorulara FAQPage, kuruma Organization şeması basıyoruz; yazar, yayın tarihi ve güncelleme tarihi buradan okunuyor. Şema tek başına sıralama getirmez, ama modelin \"bu cümleyi kim, ne zaman yazdı\" sorusunun cevabı burada duruyor. Aynı katmanın yeni ve tartışmalı üyesi llms.txt: içeriğinizin haritasını dil modellerine düz metinle veren bir dosya önerisi. Maliyeti düşük, garantisi yok — nasıl hazırlandığı [llms.txt rehberi](/yazilar/llms-txt-nedir) içinde.",
          en: "Beneath the visible text there is a layer only machines read. We stamp Article on every piece, FAQPage on the questions and Organisation on the company; author, publication date and update date are read from there. Schema alone brings no ranking, but it is where the model finds an answer to \"who wrote this sentence, and when\". The layer's newest and most disputed member is llms.txt: a proposed file that hands language models a plain-text map of your content. Cheap to add, guaranteed by nobody — how it gets built is in the [llms.txt guide](/yazilar/llms-txt-nedir).",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Güncellik sinyali",
          en: "The freshness signal",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üretken motorlar eski tarihli içeriğe temkinli yaklaşıyor, çünkü yanlış bilgiyi tekrarlamanın bedelini modelin kendisi ödüyor. Bu yüzden yayın tarihini saklamak yerine güncelleme tarihini açıkça yazıyor ve neyin değiştiğini okura söylüyoruz; bu yazının başındaki not tam olarak bu işi görüyor. Tarihi değiştirip metne dokunmamak ise ters teper — içerik aynı kalırken tazelik iddia eden sayfa, okurun da modelin de güvenini bir kez kaybeder. Güncelleme notunu yazarken kuralımız tek cümle: neyin eklendiğini, neyin çıkarıldığını ve niçin çıkarıldığını okura söyleriz.",
          en: "Generative engines treat old content warily, because the model itself pays for repeating something false. So instead of hiding the publication date we write the update date plainly and tell the reader what changed; the note at the top of this article does exactly that. Moving the date without touching the text backfires — a page claiming freshness while its content stands still loses the trust of the reader and of the model, once. Our rule for writing that note is a single line: say what was added, what was removed, and why it was removed.",
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
          tr: "[Meccanotecnica Umbra'da](/vakalar/meccanotecnica-umbra-teklif-portali) bir adım öteye gittik. İçeriği yalnız dışarıdaki modelin okuması için değil, sitenin kendi modelinin kullanması için kurduk: mühendis tesisini anlatıyor, AI teknik danışman tüm fabrikaya uygun donanımı tek formda çıkarıyor. SEO ve GEO mimarisi dört dilde (TR, EN, AR, RU) aynı anda kuruldu. Teklif talebi 10 katına çıktı, yanıt süresi yüzde doksan kısaldı. AI-native yaklaşımın tarifi budur: yapay zekaya görünmekle yetinmeyip yapay zekayı kendi satış sürecinizin içine koymak — bu da artık [yapay zeka danışmanlığı](/hizmetler/ai-danismanlik) tarafının işi.",
          en: "At [Meccanotecnica Umbra](/vakalar/meccanotecnica-umbra-teklif-portali) we went a step further. We structured the content not only for the model outside to read but for the site's own model to use: the engineer describes their plant and an AI technical advisor lays out equipment for the whole facility in a single form. The SEO and GEO architecture was built in four languages (TR, EN, AR, RU) at once. Quote requests rose tenfold and response time fell by ninety percent. That is what AI-native means in practice: not settling for being visible to AI, but placing AI inside your own sales process — which is where [AI advisory](/hizmetler/ai-danismanlik) takes over.",
        },
      },
      {
        type: "h2",
        id: "geo-nasil-olculur",
        text: {
          tr: "GEO çalışması nasıl ölçülür?",
          en: "How is GEO work measured?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka optimizasyonunun ölçüsü sıralama değil, anılma. Biz bunu sabit 10 promptluk aylık bir turla ölçüyoruz: her ay aynı 10 soruyu ChatGPT'ye, Gemini'ye ve Perplexity'ye soruyor, yanıtlarda markanın geçip geçmediğini elle sayıyoruz. Otomatik araç kullanmıyoruz, çünkü aynı soru aynı gün iki farklı yanıt üretebiliyor; tek bir ölçümün anlamı yok, anlamlı olan aynı soruların aylarca aynı biçimde sorulması.",
          en: "AI optimisation is measured by mentions, not by rank. We measure it with a fixed 10-prompt monthly round: every month we put the same 10 questions to ChatGPT, Gemini and Perplexity and count by hand whether the brand appears in the answers. We use no automated tool, because the same question can produce two different answers on the same day; a single reading means nothing, and what carries meaning is asking identical questions month after month.",
        },
      },
      {
        type: "p",
        text: {
          tr: "10 promptu üç kutuya bölüyoruz. Dördü kategori sorusu (\"bu işi yapan firmalar hangileri\"), üçü kısıt sorusu — müşterinin bütçesini, teslim süresini veya teknik şartını taşıyan hâli —, üçü karşılaştırma sorusu (\"X ile Y arasında hangisi\"). Promptlar bir kez yazılır ve değişmez; değişirse seri kırılır ve elinizde kıyaslayacak bir şey kalmaz. Marka adını prompta koymuyoruz: koyarsanız model markayı zaten önünüze getirir, ölçtüğünüz şey kendi sorunuz olur.",
          en: "We split the 10 prompts into three boxes. Four are category questions (\"which firms do this work\"), three are constraint questions — the version carrying the customer's budget, lead time or technical requirement — and three are comparison questions (\"between X and Y, which one\"). The prompts are written once and never change; change them and the series breaks, leaving nothing to compare. We keep the brand name out of the prompt: put it in and the model hands the brand straight back to you, and what you measured was your own question.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Her tur için üç şey kaydediyoruz: markanın kaç yanıtta geçtiği, hangi cümleyle geçtiği ve hangi sayfanın kaynak gösterildiği. İkincisi çoğu ekibin atladığı yer. Model sizi \"matbaa malzemesi satan firmalardan biri\" diye anıyorsa görünürlük var, konumlandırma yok; \"ihracat yapan matbaalara teknik malzeme üreten\" diye anıyorsa cümlenin kendisi kazançtır. Üçüncüsü içerik planının pusulası: kaynak gösterilen sayfa hangi yapıdaysa, bir sonraki yazıyı o yapıda kurarsınız.",
          en: "Each round records three things: how many answers named the brand, in which sentence it was named, and which page was cited. The second is where most teams look away. If the model calls you \"one of the firms selling printing supplies\" you have visibility but no position; if it calls you \"the maker of technical supplies for print houses that export\", the sentence itself is the gain. The third is the compass for the content plan: whatever structure the cited page has is the structure of your next article.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Turun ilk aylarında sonuç genellikle sıfıra yakın okunur ve bu normaldir. İlk sinyal kategori sorularından değil kısıt sorularından gelir: uzun ve şartlı bir soruda adınızın geçmesi, kategori sorusunda geçmesinden aylar önce olur. SIM Baskı Malzemeleri'nde AI motorlarındaki görünürlük altı aylık bir içerik programının sonunda sıfırdan 40 bine çıktı; o altı ayın büyük kısmı, dışarıdan bakan biri için hiçbir şeyin olmadığı bir dönem gibi görünürdü. Ölçmenin asıl faydası burada — eğriyi göremeyen ekip, işe yarayan programı üçüncü ayda kapatır.",
          en: "In the round's first months the result usually reads close to zero, and that is normal. The first signal comes from the constraint questions rather than the category ones: your name appears inside a long, conditional question months before it appears in the category answer. At SIM Printing Suppliers, visibility across AI engines went from zero to 40,000 at the end of a six-month content programme; for most of those six months, seen from outside, it looked like a period when nothing was happening. That is the real use of measuring — a team that can't see the curve shuts down the programme that works in month three.",
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
      {
        type: "p",
        text: {
          tr: "Bu beş sinyali kendi sitenizde elle saymak yerine [GEO Görünürlük Denetleyicisi](/araclar/geo-gorunurluk-denetleyicisi) ölçer: robots.txt'teki bot izinlerinden soru biçimli başlık oranına kadar aynı kalemleri tarar ve yüz puanlık bir skorla nereden başlayacağınızı gösterir.",
          en: "Rather than counting these five signals by hand, the [GEO Visibility Checker](/araclar/geo-gorunurluk-denetleyicisi) scans the same items — from robots.txt bot permissions to the ratio of question-phrased headings — and returns a score out of a hundred that shows where to start.",
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
          en: "GEO stands for generative engine optimization. Generative search systems — ChatGPT, Gemini, Perplexity, Google AI Overviews — produce a single answer to a question and cite a handful of sources inside it. GEO is the work of shaping content so those systems can read it and cite it with confidence: headings in question form, self-contained passages, figures and sources placed inside the text, and machine-readable structured markup. The same work also travels under the terms \"AI SEO\" and \"LLM optimisation\".",
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
          en: "It depends on the sector, the competition and the site's current technical state; be wary of anyone who gives you a fixed calendar. Two ends of our own measured range: at SIM Printing Suppliers, after the site was rebuilt and the content programme ran, organic traffic grew 15× in six months and visibility across AI engines went from zero to 40,000. At İstanbul Ortez Protez, the competition and trust threshold of a medical field meant reaching the top 3 for priority terms took fifteen months. In practice the first signals — being mentioned in answers, surfacing on long-tail questions — usually become readable within 2-3 months; a durable position takes a content programme running longer than six.",
        },
      },
      {
        question: {
          tr: "Google AI Overviews nedir?",
          en: "What is Google AI Overviews?",
        },
        answer: {
          tr: "AI Overviews, Google'ın arama sonuçlarının üstünde gösterdiği ve birden çok kaynaktan derlenen üretilmiş yanıttır. Kullanıcı on mavi link yerine tek bir cevap görür ve o cevabın içinde birkaç marka kaynak olarak anılır. Sonucu net: sıralamada birinci olmak yanıtın içinde anılmayı garanti etmiyor — yapay zeka arama optimizasyonu bu yüzden ayrı bir iş kalemi hâline geldi.",
          en: "AI Overviews is the generated answer Google shows above its search results, assembled from several sources. Instead of ten blue links the user sees a single answer, and a handful of brands get named inside it as sources. The consequence is clear: ranking first no longer guarantees being cited in the answer — which is why optimising for AI search became its own line of work.",
        },
      },
      {
        question: {
          tr: "GEO, yapay zeka SEO'su ve answer engine optimization aynı şey mi?",
          en: "Are GEO, AI SEO and answer engine optimisation the same thing?",
        },
        answer: {
          tr: "Büyük ölçüde evet — alanın adı henüz oturmadı. Yapay zeka optimizasyonu, geo optimizasyonu, yapay zeka SEO'su, answer engine optimization (AEO — yanıt motoru optimizasyonu) ve LLM optimizasyonu terimleri aynı işi tarif ediyor: içeriği üretken arama sistemlerinin okuyup alıntılayabileceği biçimde kurmak. Fark yöntemde değil, kelimenin nereye baktığında — kimi motoru, kimi yanıtı, kimi modeli adlandırıyor. Biz GEO demeyi tercih ediyoruz, çünkü optimize ettiğimiz şey artık arama motoru değil, yanıtı üreten motorun kendisi.",
          en: "Largely yes — the field has not settled on a name. AI optimisation, GEO optimisation, AI SEO, AI search optimisation, ChatGPT SEO, answer engine optimisation (AEO) and LLM optimisation all describe the same work: shaping content so generative search systems can read and cite it. The difference is not in the method but in what each word points at — some name the engine, some the answer, some the model. We prefer GEO, because what we optimise for is no longer the search engine but the engine generating the answer.",
        },
      },
      {
        question: {
          tr: "llms.txt nedir, sitemde olmalı mı?",
          en: "What is llms.txt and should my site have one?",
        },
        answer: {
          tr: "llms.txt, sitenin kökünde duran ve dil modellerine içeriğinizin haritasını sade metin olarak veren bir dosya önerisidir; robots.txt'nin üretken motorlar için düşünülmüş karşılığı gibi çalışır. Eklemek düşük maliyetlidir ve zarar vermez, ama tek başına kaynak gösterilmeyi sağlamaz — hiçbir motor bunu bir sıralama garantisi olarak ilan etmedi. Önce yapıyı kurun: soru biçiminde başlıklar, kendine yeten pasajlar, metnin içine yerleştirilmiş rakamlar.",
          en: "llms.txt is a proposed file that sits at the root of a site and hands language models a plain-text map of your content; it works roughly the way robots.txt does, but aimed at generative engines. Adding it is cheap and harmless, yet it will not get you cited on its own — no engine has declared it a ranking guarantee. Build the structure first: question-shaped headings, self-contained passages and numbers written into the text.",
        },
      },
      {
        question: {
          tr: "Yapay zeka motorlarındaki görünürlüğüm nasıl ölçülür?",
          en: "How do you measure visibility inside AI engines?",
        },
        answer: {
          tr: "Ölçünün birimi sıralama değil, anılma sıklığıdır. Kendi yöntemimiz sabit 10 promptluk aylık bir tur: her ay aynı 10 soruyu — dördü kategori, üçü kısıt, üçü karşılaştırma sorusu — ChatGPT'ye, Gemini'ye ve Perplexity'ye soruyor; markanın kaç yanıtta geçtiğini, hangi cümleyle geçtiğini ve hangi sayfanın kaynak gösterildiğini elle kaydediyoruz. Promptlar bir kez yazılır ve değişmez, marka adı prompta konmaz. İlk aylarda sonuç sıfıra yakın okunur ve ilk sinyal kısıt sorularından gelir; SIM Baskı Malzemeleri'nde bu sayı altı ayın sonunda sıfırdan 40 bine çıktı.",
          en: "The unit of measurement is how often you are named, not where you rank. Our own method is a fixed 10-prompt monthly round: each month the same 10 questions — four category, three constraint, three comparison — go to ChatGPT, Gemini and Perplexity, and we record by hand how many answers name the brand, in which sentence, and which page is cited. The prompts are written once and never change, and the brand name stays out of them. The first months read close to zero and the first signal arrives on the constraint questions; at SIM Printing Suppliers that number went from zero to 40,000 after six months.",
        },
      },
      {
        question: {
          tr: "Yapay zeka aramaları organik trafiği azaltıyor mu?",
          en: "Are AI searches reducing organic traffic?",
        },
        answer: {
          tr: "Bazı sitelerde sert biçimde azaltıyor. Kullanıcı cevabı yanıtın içinde aldığında tıklamaya ihtiyaç duymuyor; bu yazıdaki e-ticaret yöneticisinin panelinde iki yıldır düzenli artan trafik birkaç hafta içinde %70 eridi ve sitede bozulan hiçbir şey yoktu. Kaybı geri almanın yolu daha çok içerik üretmek değil, yanıtın içinde anılan taraf olmak — tıklama azalsa bile markanız cevabın içinde geçiyorsa konuşmanın içindesiniz.",
          en: "On some sites, sharply. When the answer arrives inside the response, the user has no reason to click; the e-commerce manager in this article watched two years of steady traffic drop 70% in a few weeks with nothing broken on the site. The way back is not publishing more content, it is becoming the party named inside the answer — even with fewer clicks, if your brand appears in the response you are still in the conversation.",
        },
      },
      {
        question: {
          tr: "Sorgular neden uzadı, bu içerik planını nasıl değiştirir?",
          en: "Why did queries get longer and how does that change a content plan?",
        },
        answer: {
          tr: "Kullanıcı yapay zekayı araç değil asistan saydığı ve derdini olduğu gibi anlattığı için. Eski dünyada spor ayakkabı modelleri üç kelimeydi; bugün diz ağrısı, günlük koşu mesafesi ve taban teknolojisini tek cümlede birleştiren yirmi üç kelimelik bir brief var. Sorgu bütçeyi, kısıtı ve itirazı aynı cümlede taşıdığı için kazanan içerik anahtar kelimeyi en çok tekrarlayan değil, kısıtı en net karşılayan oluyor.",
          en: "Because users treat AI as an assistant rather than a tool and describe their problem as it is. In the old world \"running shoe models\" was three words; today a single sentence combines knee pain, daily running distance and midsole technology into a twenty-three-word brief. Since the query carries budget, constraint and objection at once, the winning content is the one that answers the constraint most clearly rather than the one repeating the keyword most often.",
        },
      },
      {
        question: {
          tr: "GEO küçük işletmeler ve B2B için de geçerli mi?",
          en: "Does GEO apply to small businesses and B2B too?",
        },
        answer: {
          tr: "Evet — alıcı ne kadar çok soru soruyorsa yanıt asistanı o kadar belirleyici oluyor. İstanbul Ortez Protez'de aynı yapıyı güvenin en pahalı olduğu alanda kurduk: tıbbi ürünlerde soru-cevap mimarisi, teknik derinlik ve alıntılanabilir pasajlar. On beş ayda öncelikli kelimelerde organik ilk 3'e çıktık ve ayda ortalama 10 yeni hasta geldi; aynı mimari teknik satış yapan bir üretici için de çalışıyor.",
          en: "Yes — the more questions a buyer asks, the more decisive the answer assistant becomes. At İstanbul Ortez Protez we built the same structure in the field where trust is most expensive: a question-and-answer architecture for medical products, technical depth and quotable passages. Priority terms reached the organic top three in fifteen months and around 10 new patients arrived per month; the same architecture holds for a manufacturer selling technically.",
        },
      },
    ],
    category: "growth",
    topic: "geo",
    tags: ["geo", "ai-seo", "icerik-stratejisi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-01-14",
    readingMinutes: 14,
    seo: {
      title: {
        tr: "Yapay zeka arama optimizasyonu: GEO rehberi",
        en: "Generative engine optimization: AI search guide",
      },
      description: {
        tr: "Yapay zeka optimizasyonu, GEO ve AEO aynı işin üç adı. ChatGPT ile Gemini'nin kimi kaynak gösterdiğini 10 promptluk aylık turla nasıl ölçtüğümüzü anlatıyoruz.",
        en: "AI optimisation, GEO and AEO name one job. How ChatGPT and Gemini pick the sources they cite, and the fixed 10-prompt monthly round we run to measure it.",
      },
    },
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
      tr: "\"Abi telefonla çekeriz\" demeyin: neden profesyonel video şart?",
      en: "Don't say \"abi, we'll just shoot it on a phone\": why professional video is non-negotiable",
    },
    excerpt: {
      tr: "Bir dostum yeni koleksiyonunu \"bizim çocuklarla ofiste çekeriz\" diyerek telefonla çekti. Sonuç hüsran oldu. Bu yazı o hüsranın neden kaçınılmaz olduğunu ve OdorGo'nun aynı kararı tersten alıp olmayan bir kategoride nasıl 10 milyon TL'ye ulaştığını anlatıyor.",
      en: "A friend of mine shot his new collection himself, saying \"we'll just film it in the office.\" It was a disaster. This piece explains why — and how OdorGo made the opposite call and built a ₺10M category that didn't exist.",
    },
    updatedAt: "2026-08-28",
    updateNote: {
      tr: "Bu yazı ilk olarak 15 Ocak 2026'da yayımlandı. 23 Ağustos 2026'da gözden geçirildi: teze somut kanıt olarak OdorGo, GYMWOLVES ve FYR Luxury vakalarına bağlantı eklendi, UGC ile çelişmeyen bir denge bölümü ve 4 soruluk SSS eklendi, kırık CTA kaldırıldı. 28 Ağustos 2026'da ara başlıklar soru formuna getirildi.",
      en: "First published on 15 January 2026. Revised on 23 August 2026: added links to the OdorGo, GYMWOLVES and FYR Luxury cases as concrete proof, a section balancing the argument against UGC, a 4-question FAQ, and removed a broken CTA. On 28 August 2026 the section headings were rewritten as questions.",
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
          tr: "Güçlü kanıt: OdorGo on milyon TL'lik kategoriyi nasıl kurdu?",
          en: "The hard evidence: how did OdorGo build a ₺10M category from nothing?",
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
          tr: "Profesyonel video UGC ile çelişir mi?",
          en: "Does professional video compete with UGC?",
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
          tr: "Hangi içerikler telefonla çekilebilir?",
          en: "Which kinds of content can be shot on a phone?",
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
      {
        question: {
          tr: "Prodüksiyon ortağı seçerken nelere bakılmalı?",
          en: "What should you look for when choosing a production partner?",
        },
        answer: {
          tr: "Üç şeye: geçmiş işlerin gerçek rakamı, benzer ölçekte bir referans ve tek çekimden kaç farklı içerik çıkacağının net bir planı. Her şeyi yaptığını söyleyen ekipten değil, bu üçünü somut cevaplayandan güven duyun. Reel'i güzel olan her ekip sizin kategorinizi anlatmayı bilmez — benzer bir markada hangi iş sonucunu ürettiklerini sorun.",
          en: "Three things: real numbers from past work, a reference at a comparable scale and a clear plan for how many separate pieces one shoot will produce. Trust the team that answers those three concretely, not the one that says it does everything. A good showreel does not mean they can tell your category's story — ask which business result they produced for a comparable brand.",
        },
      },
      {
        question: {
          tr: "Halo etkisi nedir, videoyla ne ilgisi var?",
          en: "What is the halo effect and what does it have to do with video?",
        },
        answer: {
          tr: "Halo etkisi, izleyicinin tek bir özelliğe dair izlenimini bütüne yayması demektir; videoda bu, teknik kaliteyi doğrudan ürün kalitesiyle özdeşleştirmek olarak görünür. Görüntüdeki parazit veya kötü ışık, bilinçaltında markanın detaya önem vermediği mesajını tetikler. Tersi de doğru: profesyonel bir prodüksiyon tek kelime söylemeden işin ciddiye alındığını fısıldar.",
          en: "The halo effect is when an impression about one attribute spreads to the whole; in video it shows up as viewers equating technical quality with product quality. Noise in the image or bad lighting triggers a subconscious note that the brand does not care about detail. The reverse holds too: a professional production whispers that the work is taken seriously, without a word being spoken.",
        },
      },
      {
        question: {
          tr: "Ses kalitesi neden görüntüden daha az affediyor?",
          en: "Why is bad audio less forgivable than a soft image?",
        },
        answer: {
          tr: "İzleyici bulanık bir kareyi genelde tolere eder, cızırtılı bir sesi etmez. Yankılı veya parazitli ses konuşmacının güvenilirliğini birlikte aşağı çeker; söylenen doğru olsa bile inandırıcılığı azalır. Profesyonel ekiplerin bütçenin bir kısmını mikrofona, akustiğe ve ses tasarımına ayırmasının sebebi budur — reklamı izleyenin kulağı, gözünden daha eleştirmen.",
          en: "A viewer usually tolerates a slightly soft image but not a crackling soundtrack. Echoey or noisy audio drags the speaker's credibility down with it; even a true statement lands as less believable. That is why professional teams put part of the budget into microphones, acoustics and sound design — the ear watching an ad is a harsher critic than the eye.",
        },
      },
      {
        question: {
          tr: "Senaryo mu görüntü kalitesi mi önce gelir?",
          en: "Which comes first, the script or the image quality?",
        },
        answer: {
          tr: "İkisi ayrı ayrı değil birlikte çalışır; içerik videonun ruhu, kalite ise bedenidir. Harika bir fikir kötü bir uygulamayla harcanır, yüksek çözünürlük de zayıf bir fikri kurtarmaz. Telefonla çekim yapmak mümkün ama ne yaptığını bilen ellerde anlam kazanır — ekipman iyileşti, fark kapanmadı; lensin kalitesinden bakışın kalitesine taşındı.",
          en: "They do not work separately: content is the soul of a video and quality is its body. A great idea is wasted by poor execution, and high resolution will not rescue a weak idea. Shooting on a phone is possible but only means something in hands that know what they are doing — the gear got better, the gap did not close, it moved from the quality of the lens to the quality of the eye.",
        },
      },
      {
        question: {
          tr: "Video prodüksiyonu tek başına bir kategori kurabilir mi?",
          en: "Can video production create a category on its own?",
        },
        answer: {
          tr: "Kurabilir — OdorGo bunun kanıtı. Koku giderici, Türkiye'de tüketici farkındalığı sıfır olan bir kategoriydi; arama hacmi yoktu ve performans pazarlaması tek başına işe yaramazdı, önce talebin kendisi kurulmalıydı. Kategoriyi anlattığımız yer reklam filmleriydi; bu filmler dijital kanallarda 10 milyonun üzerinde izlendi ve sekiz ayın sonunda marka 10 milyon TL ciroya ulaşıp MacroCenter, Migros ve Happy Center raflarına girdi.",
          en: "It can — OdorGo is the proof. Odour eliminators were a category with zero consumer awareness in Turkey; there was no search volume and performance marketing alone would not have worked, because demand itself had to be built first. The films carried the category; they were watched more than 10 million times across digital channels, and after eight months the brand reached 10 million lira in revenue and shelf space at MacroCenter, Migros and Happy Center.",
        },
      },
      {
        question: {
          tr: "Video yatırımının geri dönüşü nasıl ölçülür?",
          en: "How do you measure the return on a video investment?",
        },
        answer: {
          tr: "İzlenme sayısıyla değil, videonun beslediği iş sonucuyla. OdorGo'da ölçüt 10 milyon izlenme değil, sekiz ayda kurulan kategori ve 10 milyon TL ciroydu; GYMWOLVES'te sporcularla çekilen görsel kanıt kampanyayı besledi ve satış üç ayda 12 katına çıktı; FYR Luxury'de prodüksiyon marka pozisyonunu kurdu ve 12 aylık ciro hedefi 3 ayda geçildi. Ölçümü doğru kurmanın yolu, çekimden önce videonun hangi adımı hızlandıracağını yazmaktır.",
          en: "Not by view count, but by the business result the video feeds. At OdorGo the measure was not 10 million views but a category built in eight months and 10 million lira in revenue; at GYMWOLVES visual proof shot with athletes fed the campaign and sales rose twelvefold in three months; at FYR Luxury production set the brand position and a 12-month revenue target was passed in three. The way to measure properly is to write down, before the shoot, which step the video is meant to accelerate.",
        },
      },
    ],
    category: "growth",
    topic: "video-kreatif",
    tags: ["video-produksiyon", "reklam-filmi", "marka-algisi"],
    authorSlug: "mert-kaplan",
    publishedAt: "2026-01-15",
    readingMinutes: 6,
    seo: {
      title: {
        tr: "Profesyonel video ve reklam filmi neden şart?",
        en: "Why professional video production is worth it",
      },
      description: {
        tr: "OdorGo, olmayan bir kategoride sekiz ayda 10 milyon TL ciroya ulaştı; filmler 10 milyonu aştı. Marka konumlandırma, prodüksiyon eşiği ve telefonun sınırı.",
        en: "OdorGo built a 10 million lira category in eight months and its films passed 10 million views. Brand positioning, production thresholds, phone-shoot limits.",
      },
    },
  },
  {
    slug: {
      tr: "ai-donusumu-nedir",
      en: "what-is-ai-transformation",
    },
    title: {
      tr: "AI dönüşümü nedir? Tedarikçi sunumunun cevaplamadığı soru",
      en: "What is AI transformation? The question the vendor deck skips",
    },
    excerpt: {
      tr: "Sanayi şirketlerinin masasındaki tedarikçi sunumu hangi sürecin kaç lira geri getireceğini yazmıyor. AI dönüşümünü dört aşamada kuruyorum — teşhis, veri, pilot, ölçekleme — ve hangi işlerde kazanç çıktığını, hangilerinde çıkmadığını sahadan ölçülmüş rakamlarla anlatıyorum.",
      en: "The vendor deck on the industrial buyer's desk never says which process returns how much money. Here I build AI transformation in four stages — diagnosis, data, pilot, scale — and set out where it pays off and where it does not, using numbers measured in the field.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Sanayi şirketlerinde AI dönüşümü konuşmak için masaya oturduğumuzda karşımıza çoğu zaman aynı doküman çıkıyor: bir tedarikçinin hazırladığı, onlarca sayfalık bir sunum. İçinde mimari şema var, kullanım senaryosu var, bir de bütçe var. Eksik olan tek şey, bu şirkette hangi sürecin o bütçeden kaç lira geri çıkaracağı. Patron dönüşüm liderine soruyu sorduğunda — yapay zeka ile ne yapıyoruz — cevabı o sunum vermiyor.",
          en: "When we sit down with an industrial company to talk about AI transformation, the same document tends to appear: a vendor deck running to dozens of pages. It carries architecture diagrams, use cases and a budget. The one thing missing is which process inside this particular company returns how much money on that budget. When the owner asks the transformation lead the question — what are we doing with AI — the deck has no answer.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazı o boşluğu doldurmak için var. AI dönüşümünün ne olduğunu, dijital dönüşümden nerede ayrıldığını, hangi işlerde kazanç çıkarıp hangilerinde çıkarmadığını ve dört aşamalı bir yapay zeka yol haritasının nasıl kurulduğunu anlatıyor. Buradaki rakamların hepsi kendi müşterilerimizde ölçüldü; sektör ortalaması ya da tedarikçi vaadi değil.",
          en: "This article exists to close that gap. It sets out what AI transformation is, where it parts ways with digital transformation, which kinds of work pay it back and which do not, and how a four-stage AI roadmap gets built. Every number here was measured on our own clients; none of it is an industry average or a vendor promise.",
        },
      },
      {
        type: "h2",
        id: "ai-donusumu-nedir",
        text: {
          tr: "AI dönüşümü nedir?",
          en: "What is AI transformation?",
        },
      },
      {
        type: "p",
        text: {
          tr: "AI dönüşümü, bir şirketin tekrar eden karar ve üretim işlerini yapay zekaya devrederek süre, maliyet ve kapasite yapısını kalıcı olarak değiştirmesidir. Teknoloji satın alma işi değil, süreç yeniden tasarlama işidir: modeli kurmak toplam işin en küçük parçasıdır. Dönüşüm kelimesi tek bir testle hak edilir — pilot bittikten sonra sürecin birim süresi eski hâline dönmüyorsa dönüşüm olmuştur, dönüyorsa deneme yapılmıştır.",
          en: "AI transformation is a company handing its repeated decision and production work over to artificial intelligence, and permanently changing its time, cost and capacity structure in doing so. It is process redesign rather than a technology purchase: building the model is the smallest part of the job. The word transformation earns itself through one test — if the unit time of the process does not creep back after the pilot ends, a transformation happened; if it does creep back, an experiment happened.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üç bileşeni var. Devredilecek bir süreç, o süreci besleyen bir veri kaydı ve sonucu ölçen bir kural. Üçünden biri eksikse ortaya çıkan şey dönüşüm değil, demo olur — demoların ortak kaderi ise ilk bütçe görüşmesinde kapanmaktır. Yapay zeka dönüşümü tabirini de aynı anlamda kullanıyorum; ikisi arasında kavramsal bir fark yok, yalnızca kimin hangi kelimeyi aradığı değişiyor.",
          en: "Three components hold it together. A process to hand over, a data record that feeds that process, and a rule that measures the outcome. With any one of the three missing, what you get is a demo rather than a transformation — and demos share a single fate: they close at the first budget review. Some people call the same thing an AI-driven business transformation; the concept does not change, only the phrase each buyer searches for.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir ayrım daha gerekiyor: yapay zeka kullanmak ile AI dönüşümü aynı şey değil. Ekibinizden on kişi metin üretmek için bir sohbet aracı açıyorsa şirket yapay zeka kullanıyordur, ama süreç değişmemiştir; iş hâlâ aynı kişide, aynı adımda ve aynı kuyrukta bekliyordur. Dönüşüm, aracın bireysel masada değil sürecin içinde durmasıdır — çıktısı ölçülür, sahibi bellidir ve o kişi ayrıldığında kaybolmaz.",
          en: "One more distinction is needed: using AI and transforming with it are not the same thing. If ten people on your team open a chat tool to draft text, the company is using AI, yet the process has not changed; the work still sits with the same person, at the same step, in the same queue. Transformation means the tool sits inside the process rather than on an individual desk — its output is measured, it has an owner, and it does not vanish when that person leaves.",
        },
      },
      {
        type: "h2",
        id: "ai-donusumu-dijital-donusum-farki",
        text: {
          tr: "AI dönüşümü ile dijital dönüşüm aynı şey mi?",
          en: "Are AI transformation and digital transformation the same thing?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı şey değil; biri diğerinin önkoşulu. Dijital dönüşüm, kâğıt üstünde ve insanların kafasında duran işi kayda geçirir: ERP (kurumsal kaynak planlama), formlar, izlenebilir iş akışları. AI dönüşümü o kaydın üstüne bir karar katmanı koyar — sınıflandırma, tahmin, metin ve teklif üretimi gibi işleri insandan alır.",
          en: "They are not the same, and one is the precondition of the other. Digital transformation turns work that lives on paper and in people's heads into a record: ERP (enterprise resource planning), forms, traceable workflows. AI transformation puts a decision layer on top of that record — it takes classification, prediction, drafting and quoting off the human's desk.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ölçüleri de ayrı. Dijital dönüşümün ölçüsü izlenebilirliktir: sürecin hangi adımda, kimde ve ne kadar beklediğini görebiliyor musunuz. AI dönüşümünün ölçüsü birim çıktıdır: bir teklifin, bir raporun, bir siparişin insan başına kaç dakika tuttuğu. Birincisi görünürlük kazandırır, ikincisi kapasite.",
          en: "Their measures differ too. Digital transformation is measured by traceability: can you see at which step, with whom and for how long the process is waiting. AI transformation is measured by unit output: how many minutes per person a quote, a report or an order consumes. The first buys you visibility, the second buys you capacity.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sıra bozulunca maliyet çıkar. ERP'si olmayan, siparişini telefonla alan bir fabrikada kurulan yapay zeka pilotu, modelin öğreneceği kaydı bulamaz ve proje sessizce bir veri toplama projesine dönüşür. Böyle bir tabloda doğru ilk adım yapay zeka değil, [dijital dönüşüm](/hizmetler/dijital-donusum) tarafındaki kayıt altyapısıdır. Sırayı atlamak kimsenin sermayesini kurtarmıyor.",
          en: "Reverse the order and you pay for it. An AI pilot set up in a plant with no ERP, taking its orders over the phone, finds no record for the model to learn from, and the project quietly becomes a data collection project instead. In that picture the correct first step is not AI but the record infrastructure on the [digital transformation](/hizmetler/dijital-donusum) side. Skipping the order has never saved anyone capital.",
        },
      },
      {
        type: "h2",
        id: "hangi-islerde-kazanc-cikar",
        text: {
          tr: "Hangi işlerde yapay zeka kazanç çıkarır, hangilerinde çıkarmaz?",
          en: "Which work does AI pay off on, and which does it not?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka; sık tekrarlanan, dijital iz bırakan ve hatası fark edilip düzeltilebilen işlerde kazanç çıkarır. Nadir yapılan, kaydı olmayan ve hatası sessizce ilerleyen kararlarda çıkarmaz. Aradaki farkı üç filtreyle ayırıyoruz ve bu filtre, işletmelerde yapay zeka kullanımı sorusunun en pratik cevabıdır.",
          en: "AI pays off on work that repeats often, leaves a digital trace, and fails in ways someone notices and can correct. It does not pay off on decisions made rarely, kept in nobody's records, and wrong in ways nobody sees. We separate the two with three filters, and those filters are the most practical answer to the question of where AI belongs in a business.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Tekrar: süreç ayda yüzlerce kez çalışıyor mu? Ayda üç kez yapılan bir iş, kurulum maliyetini hiçbir doğruluk oranıyla geri ödemez.",
            en: "Repetition: does the process run hundreds of times a month? Work done three times a month will not repay its setup cost at any level of model accuracy.",
          },
          {
            tr: "Kayıt: süreç bugün dijital bir iz bırakıyor mu — e-posta, ERP satırı, form, kayıt dosyası? İz yoksa modelin öğreneceği bir geçmiş de yok.",
            en: "Record: does the process leave a digital trace today — an email, an ERP row, a form, a log file? With no trace there is no history for the model to learn from.",
          },
          {
            tr: "Görünür hata: çıktı yanlış olduğunda birileri bunu aynı gün fark ediyor mu? Fark edilmeyen hata, otomasyonla birlikte ölçeklenir.",
            en: "Visible error: when the output is wrong, does somebody catch it the same day? An error nobody catches scales alongside the automation.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Filtrelerden düşen işler de en az geçenler kadar öğreticidir. Yılda üç kez verilen bir yatırım kararı, on beş yıllık bir ustanın sesle teşhis ettiği rulman arızası ya da darboğazı veri değil imza yetkisi olan bir onay süreci — bunların hiçbirinde yapay zeka kazanç çıkarmaz. Onay süreci yavaşsa sorun modelde değil, yetki matrisindedir ve orayı düzeltmek yazılım değil yönetim işidir.",
          en: "The work that fails the filters teaches as much as the work that passes. An investment decision taken three times a year, a bearing fault a fifteen-year machinist diagnoses by ear, an approval step whose bottleneck is signature authority rather than data — AI returns nothing on any of them. If approvals are slow, the fault sits in the authority matrix, not in the model, and fixing it is a management job rather than a software one.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dördüncü bir dışlama kuralı daha var: sonucu geri alınamayan kararlar. İş güvenliği, ürün uygunluğu ve yasal yükümlülük taşıyan adımlarda yapay zeka karar veren taraf olarak değil, hazırlayan taraf olarak kurulur. Modelin taslağı hazırlaması ile onayı vermesi arasındaki fark bir dönüşüm projesinin en pahalı ayrıntısıdır ve pilot kapsamına yazılmadan geçilmez.",
          en: "A fourth exclusion rule applies: decisions that cannot be undone. On steps carrying workplace safety, product conformity or legal liability, AI is set up as the party that prepares, never the party that decides. The distance between a model drafting and a model approving is the most expensive detail in a transformation project, and it never gets passed over without being written into the pilot scope.",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Bozuk bir süreci otomatikleştirirseniz, hatayı da otomatikleştirmiş olursunuz — yalnızca daha hızlı.",
          en: "Automate a broken process and you have automated the mistake along with it — only faster.",
        },
      },
      {
        type: "h2",
        id: "yapay-zeka-yol-haritasi",
        text: {
          tr: "Yapay zeka yol haritası kaç aşamadan oluşur?",
          en: "How many stages does an AI roadmap have?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dört aşamadan oluşur: teşhis ve süreç seçimi, veri hazırlığı, pilot, ölçekleme ve ROI. Sıra pazarlık konusu değildir, çünkü her aşama bir sonrakinin girdisini üretir — pilotun başarı ölçüsünü teşhis yazar, ölçeklemenin iş vakasını pilot yazar. Aşağıdaki süreler bizim kapsamlama tercihimizdir, bir sektör normu değil.",
          en: "It has four: diagnosis and process selection, data preparation, pilot, then scale and ROI. The order is not negotiable, because each stage produces the input for the next — diagnosis writes the pilot's success measure, and the pilot writes the business case for scaling. The durations below are how we scope the work, not an industry norm.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Aşama 1 — Teşhis ve süreç seçimi",
          en: "Stage 1 — Diagnosis and process selection",
        },
      },
      {
        type: "p",
        text: {
          tr: "Teşhis, şirketin yapay zekaya ne kadar hazır olduğunu değil, süreçlerinin sayısını ölçer. İki ile dört hafta içinde ilgili birimlerin tekrar eden işleri çıkarılır, her birinin yıllık insan-saati ve hata maliyeti yaklaşık olarak hesaplanır, üç filtreden geçenler kısa listeye alınır. Çıktı bir rapor değil, sıralanmış üç ile beş süreçtir; listenin ilk satırı pilot adayıdır.",
          en: "Diagnosis measures the number of a company's processes, not how ready it is for AI. Over two to four weeks the repeated work of the relevant units is listed, each item's annual person-hours and error cost are estimated, and whatever passes the three filters goes onto a short list. The output is not a report but three to five ranked processes; the first line of that list is the pilot candidate.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Aşama 2 — Veri hazırlığı",
          en: "Stage 2 — Data preparation",
        },
      },
      {
        type: "p",
        text: {
          tr: "Veri hazırlığı, seçilen sürecin kaydını görünür kılar: kayıt nerede duruyor, kim güncelliyor, hangi alanları boş, ne kadar geriye gidiyor. Çıkan tablo çoğu zaman rahatsız edicidir — teklif geçmişi üç ayrı klasörde, ürün verisi tedarikçi tablolarında, müşteri yazışması kişisel posta kutularında. Bu aşamayı atlayan projelerin pilotu veri temizliğine dönüşür ve takvim taşar.",
          en: "Data preparation makes the chosen process's record visible: where it sits, who updates it, which fields are empty, how far back it goes. The picture is usually uncomfortable — quote history spread across three folders, product data in supplier spreadsheets, customer correspondence in personal mailboxes. Projects that skip this stage watch their pilot turn into a data cleanup exercise, and the schedule slips.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Aşama 3 — Pilot",
          en: "Stage 3 — Pilot",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pilot tek süreçte, sekiz ile on iki hafta içinde ve tek bir başarı ölçüsüyle kurulur. Baştan bir de durdurma eşiği yazılır: hangi rakama ulaşılamazsa proje kapanır. Önce pilot yaklaşımının nedeni bütçe kısıtı değil, öğrenme hızıdır — bir süreçte on iki haftada öğrendiğinizi, beş süreçte on iki ayda öğrenirsiniz ve o sırada ilk varsayımınız çoktan eskimiş olur.",
          en: "The pilot runs on one process, inside eight to twelve weeks, against a single success measure. A stopping threshold is written at the start too: the number that, if unmet, closes the project. The reason for going pilot-first is not a tight budget but learning speed — what one process teaches you in twelve weeks, five processes teach you in twelve months, by which point your first assumption has already aged out.",
        },
      },
      {
        type: "h3",
        text: {
          tr: "Aşama 4 — Ölçekleme ve ROI",
          en: "Stage 4 — Scale and ROI",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ölçekleme, pilotun rakamını iş vakasına çevirmekle başlar. ROI (yatırım getirisi) hesabı üç kalemden kurulur: kazanılan insan-saatin parasal karşılığı, kaçırılmayan işin katkısı ve modelin çalıştırma maliyeti. Üçüncü kalemi hesaba katmayan iş vakaları ilk faturada çöker; kullanım ücreti, entegrasyon bakımı ve insan denetimi kalıcı gider kalemleridir. Bir de sahiplik sorusu var: pilotun bir süreç sahibi yoksa ölçeğe çıkmaz, çünkü kararı verecek kimse yoktur.",
          en: "Scaling starts by turning the pilot's number into a business case. The ROI (return on investment) calculation rests on three items: the monetary value of the person-hours recovered, the contribution of work no longer lost, and the running cost of the model. Business cases that ignore the third item collapse at the first invoice; usage fees, integration maintenance and human review are permanent line items. Then comes ownership: a pilot without a process owner never scales, because nobody is left to make the call.",
        },
      },
      {
        type: "h2",
        id: "isletmelerde-yapay-zeka-kullanimi",
        text: {
          tr: "İşletmelerde yapay zeka kullanımı sahada neye benziyor?",
          en: "What does AI in business look like on the ground?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sahada işleyen kurulumlar birbirine benzemiyor ama başlangıçları benziyor: hiçbiri yapay zeka stratejisiyle başlamadı, üçü de tek bir sürecin darboğazıyla başladı. Üç örnek, üç ayrı iş kolu.",
          en: "The installations that work in the field do not resemble one another, but their beginnings do: none started with an AI strategy, and all three started with the bottleneck of a single process. Three examples, three different lines of business.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[Meccanotecnica Umbra](/vakalar/meccanotecnica-umbra-teklif-portali) endüstriyel bir üretici ve darboğazı teklif süreciydi: bir mühendis tesisini anlatıyor, uygun donanımı çıkarmak günler alıyordu. Süreci bir AI teknik danışmanına devrettik — mühendis tesisini tek formda anlatıyor, sistem tüm fabrikaya uygun donanımı bir seferde çıkarıyor. Teklif talebi 10 katına çıktı, yanıt süresi %90 kısaldı. Değişen şey ürün değildi, alıcının cevap bekleme süresiydi.",
          en: "[Meccanotecnica Umbra](/vakalar/meccanotecnica-umbra-teklif-portali) is an industrial manufacturer, and its bottleneck was quoting: an engineer described the plant, and producing the right equipment list took days. We handed the process to an AI technical advisor — the engineer describes the plant in one form, and the system lays out equipment for the whole facility in a single pass. Quote requests rose tenfold and response time fell by 90%. The product did not change; the buyer's waiting time did.",
        },
      },
      {
        type: "p",
        text: {
          tr: "MKComputer'da darboğaz katalogdaydı. Tedarikçi verisiyle mağaza arasındaki eşleştirme elle yapıldığında binlerce ürün her zaman geriden geliyordu; kurduğumuz akış 200.000'den fazla ürünü beş dakikada senkronluyor ve süreçte sıfır manuel adım kalıyor. Bu iş bir model eğitmekle değil, [iş otomasyonları](/hizmetler/is-otomasyonlari) tarafındaki akış tasarımıyla çözüldü — her AI dönüşümü kaleminin bir model gerektirmediğinin en net örneği.",
          en: "At MKComputer the bottleneck sat in the catalogue. Matching supplier data to the storefront by hand left thousands of products permanently behind; the flow we built syncs more than 200,000 products in five minutes with zero manual steps left in the process. That was solved by flow design on the [business automation](/hizmetler/is-otomasyonlari) side rather than by training a model — the clearest proof that not every line of an AI transformation needs one.",
        },
      },
      {
        type: "p",
        text: {
          tr: "SIM Baskı Malzemeleri'nde dönüşüm görünürlük tarafındaydı: kırk yıllık teknik bilgi hiçbir yerde yazılı olmadığı için ne arama motoru ne de yanıt asistanı şirketi alıntılayabiliyordu. İçerik mimarisi yeniden kurulduktan sonra AI motorlarındaki görünürlük sıfırdan 40 bine çıktı. Üç vakanın ortak dersi şu: kazanç modelin zekasından değil, seçilen sürecin doğruluğundan geliyor.",
          en: "At SIM Printing Suppliers the transformation sat on the visibility side: forty years of technical knowledge existed nowhere in writing, so neither a search engine nor an answer assistant could cite the company. Once the content architecture was rebuilt, visibility across AI engines went from zero to 40,000. The shared lesson of all three cases: the gain comes from picking the right process, not from the intelligence of the model.",
        },
      },
      {
        type: "h2",
        id: "yapay-zeka-ile-verimlilik",
        text: {
          tr: "Yapay zeka ile verimlilik nasıl ölçülür?",
          en: "How do you measure productivity gains from AI?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka ile verimlilik, sürecin birim çıktısına düşen insan-saatiyle ölçülür — model doğruluğuyla değil. Üç sayı yeterlidir: pilottan önceki durum, pilottan sonraki durum ve ölçüm penceresi. Model doğruluğu bir mühendislik göstergesidir, iş göstergesi değil; yüksek doğruluk, çıktıyı hâlâ insan baştan yazıyorsa sıfır verimliliktir.",
          en: "Productivity from AI is measured in person-hours per unit of process output — not in model accuracy. Three numbers suffice: the state before the pilot, the state after it, and the measurement window. Model accuracy is an engineering indicator rather than a business one; high accuracy delivers zero productivity if a human still rewrites the output from scratch.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ölçmenin en zor kısmı başlangıç noktasını kaydetmektir ve bunun tek zamanı pilottan öncedir. Süreç bir kez değiştikten sonra eski hâlini kimse hatırlamıyor; hatırlayanlar da iyimser hatırlıyor. Teşhis aşamasında ölçülen insan-saat, ölçekleme aşamasında iş vakasının paydası olur — o yüzden teşhis raporu, yol haritasının en çok geri dönülen belgesidir.",
          en: "The hardest part of measuring is recording the starting point, and the only moment for that is before the pilot. Once a process has changed, nobody remembers its old shape; those who do remember it optimistically. The person-hours measured during diagnosis become the denominator of the business case at the scaling stage — which is why the diagnosis document is the one people return to most.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkinci bir gösterge daha var: sürecin kuyruğu. Teklif, rapor ya da sipariş kuyruğunda bekleyen iş sayısı düşmüyorsa kazanılan süre başka bir darboğaza gitmiş demektir. Meccanotecnica'daki %90'lık yanıt süresi kısalması bu yüzden anlamlı bir rakam — kuyruğun kendisi kısaldı, iş yalnızca yer değiştirmedi.",
          en: "A second indicator sits alongside it: the queue. If the number of items waiting in the quote, report or order queue does not fall, the time you saved has simply moved to another bottleneck. That is why the 90% cut in response time at Meccanotecnica counts — the queue itself got shorter rather than the work merely relocating.",
        },
      },
      {
        type: "h2",
        id: "ai-donusum-danismanligi-ne-zaman",
        text: {
          tr: "AI dönüşüm danışmanlığı ne zaman gerekir, ne zaman gerekmez?",
          en: "When do you need AI transformation consulting, and when do you not?",
        },
      },
      {
        type: "p",
        text: {
          tr: "AI dönüşüm danışmanlığı, şirkette süreç bilgisi olup dönüşüm tasarımı olmadığında gerekir. Tek bir aracın kurulması gerekiyorsa gerekmez — o iş satın alma işidir ve danışmanlıkla pahalılaştırılmamalıdır. Ayrım basit: sorunuz hangi ürünü alalım ise danışman gereksiz, hangi süreci devredelim ise gerekli.",
          en: "AI transformation consulting is needed when a company holds the process knowledge but not the design of the transformation. It is not needed when a single tool has to be installed — that is a procurement job and should not be made expensive by consulting. The distinction is simple: if your question is which product to buy, skip the consultant; if it is which process to hand over, you need one.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İyi bir yapay zeka dönüşüm danışmanlığı ilk toplantıda araç adı vermez; süreç sorar, kayıt sorar, kimin ölçtüğünü sorar. Bir tedarikçi sunumunu değerlendirirken hangi soruların ayırt edici olduğunu ayrı bir yazıda topladım: [AI danışmanı seçerken sorulacak 12 soru](/yazilar/ai-danismani-secerken-sorulacak-12-soru). Teşhisin ilk turunu kendi ekibinizle yapmanız da mümkün; aşağıdaki bir saatlik test tam olarak bunun için.",
          en: "Good AI transformation consulting names no tool in the first meeting; it asks about the process, the record, and who does the measuring. I have collected the questions that separate a serious partner from a deck in a separate piece: [12 questions to ask when choosing an AI consultant](/yazilar/ai-danismani-secerken-sorulacak-12-soru). Running the first round of diagnosis with your own team is entirely possible; the one-hour test below is built for exactly that.",
        },
      },
      {
        type: "h2",
        id: "pilottan-olcege-gecis",
        text: {
          tr: "Pilot neden çoğu şirkette ölçeğe çıkmıyor?",
          en: "Why do most pilots never reach scale?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üç neden görüyoruz. Başlangıç ölçüsü kaydedilmemiştir, dolayısıyla pilot başarılı olsa bile ispatlanamaz. Sahibi yoktur; proje bilgi işlemin sırtındadır ve süreci yöneten birim sonucu savunmaz. Kapsamı süreç değil departmandır — bir departmanın tamamını dönüştürmeye kalkan pilot, on iki haftada bitirilemeyecek kadar çok paydaşa bağlanır.",
          en: "We see three reasons. The starting measure was never recorded, so even a successful pilot cannot be proven. The pilot has no owner; it rides on the IT department's back while the unit that runs the process defends nothing. Its scope is a department rather than a process — a pilot that sets out to transform a whole department ties itself to more stakeholders than twelve weeks can carry.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dördüncü bir neden daha var, daha az konuşulanı: pilot çalıştı ama kimse süreci yeniden yazmadı. Model teklifi üretiyor, ancak onay adımları eski hâliyle duruyorsa kazanılan süre onay kuyruğunda eriyor. Dönüşüm, teknolojinin süreçle birlikte değişmesidir; yalnız teknoloji değişirse geriye pahalı bir eklenti kalır ve o eklenti bir sonraki bütçe döneminde kapatılır.",
          en: "A fourth reason gets less airtime: the pilot worked, but nobody rewrote the process. The model drafts the quote, yet if the approval steps stand exactly as they did, the time saved dissolves in the approval queue. Transformation means the technology and the process change together; when only the technology changes, what remains is an expensive add-on, and add-ons get cancelled in the next budget cycle.",
        },
      },
      {
        type: "h2",
        id: "bir-saatlik-teshis",
        text: {
          tr: "Yarın sabah yapabileceğiniz bir saatlik teşhis",
          en: "The one-hour diagnosis you can run tomorrow morning",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kimseyi beklemeden yapabileceğiniz bir test var. Ekibinizin son bir ayda en çok tekrarladığı beş işi bir kâğıda yazın. Her satırın yanına üç şey koyun: ayda kaç kez tekrarlandığı, kaydının nerede durduğu, hata olduğunda aynı gün fark edilip edilmediği. Üç sütunu birden dolduran ilk satır sizin pilot adayınızdır — ve o satırı bulmak için hiçbir tedarikçiye ihtiyacınız yok.",
          en: "There is a test you can run without waiting for anyone. Write down the five tasks your team repeated most in the past month. Beside each line put three things: how many times a month it runs, where its record sits, and whether a mistake gets caught the same day. The first line that fills all three columns is your pilot candidate — and finding it costs you nothing and no vendor.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sonra o satırın yıllık insan-saatini kabaca hesaplayın: kaç dakika sürüyor, ayda kaç kez, kaç kişi. Rakam tek bir kişinin yıllık maliyetinin altındaysa pilot beklemeye alınır; üstündeyse elinizde bir iş vakası vardır ve yol haritasının birinci aşamasını kendi başınıza tamamlamışsınız demektir.",
          en: "Then work out that line's annual person-hours roughly: how many minutes it takes, how many times a month, how many people. If the figure sits below the annual cost of one employee, the pilot waits; if it sits above, you are holding a business case and you have completed the roadmap's first stage on your own.",
        },
      },
      {
        type: "p",
        text: {
          tr: "AI dönüşümü bir teknoloji programı değil, doğru süreci seçme disiplinidir; kazanç modelin zekasından değil, seçimin isabetinden çıkar. Bu disiplinin nasıl kurulduğunu ve nerede durduğunu rakamlarıyla görmek isterseniz [yapay zeka danışmanlığı](/hizmetler/ai-danismanlik) sayfası ile vaka kayıtlarımız açık duruyor.",
          en: "AI transformation is not a technology programme but the discipline of choosing the right process; the gain comes from the accuracy of that choice, not the intelligence of the model. If you want to see how the discipline is built and where it stops, with the numbers attached, our [AI consulting](/hizmetler/ai-danismanlik) page and our case records are open.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "AI dönüşümü tek cümleyle nasıl tanımlanır?",
          en: "How is AI transformation defined in one sentence?",
        },
        answer: {
          tr: "AI dönüşümü, bir şirketin tekrar eden karar ve üretim işlerini yapay zekaya devrederek süre, maliyet ve kapasite yapısını kalıcı olarak değiştirmesidir. Teknoloji satın alma işi değil, süreç yeniden tasarlama işidir: modeli kurmak toplam işin en küçük parçasıdır. Üç bileşeni vardır — devredilecek bir süreç, o süreci besleyen bir veri kaydı ve sonucu ölçen bir kural. Üçünden biri eksikse ortaya çıkan şey dönüşüm değil, demodur.",
          en: "AI transformation is a company handing its repeated decision and production work to artificial intelligence, and permanently changing its time, cost and capacity structure in doing so. It is process redesign rather than a technology purchase: building the model is the smallest part of the job. Three components hold it together — a process to hand over, a data record feeding that process, and a rule that measures the outcome. Miss one of the three and what you have is a demo.",
        },
      },
      {
        question: {
          tr: "AI dönüşümü ile dijital dönüşüm arasındaki fark nedir?",
          en: "What is the difference between AI transformation and digital transformation?",
        },
        answer: {
          tr: "Dijital dönüşüm, kâğıt üstünde ve insanların kafasında duran işi kayda geçirir: ERP, formlar, izlenebilir iş akışları. AI dönüşümü o kaydın üstüne bir karar katmanı koyar; sınıflandırma, tahmin ve metin üretimi gibi işleri insandan alır. Ölçüleri de ayrıdır: dijital dönüşümün ölçüsü izlenebilirlik, AI dönüşümünün ölçüsü birim çıktının süresi ve maliyetidir. Sıra önemlidir — kaydı olmayan bir süreçte kurulan pilot, modelin öğreneceği geçmişi bulamaz.",
          en: "Digital transformation turns work living on paper and in people's heads into a record: ERP, forms, traceable workflows. AI transformation puts a decision layer on top of that record, taking classification, prediction and drafting off the human's desk. Their measures differ as well: digital transformation is measured by traceability, AI transformation by the time and cost of a unit of output. Order matters — a pilot built on a process with no record finds no history for the model to learn.",
        },
      },
      {
        question: {
          tr: "Yapay zeka yol haritası nasıl hazırlanır?",
          en: "How do you build an AI roadmap?",
        },
        answer: {
          tr: "Yol haritası dört aşamada kurulur: teşhis ve süreç seçimi, veri hazırlığı, pilot, ölçekleme ve ROI. Teşhis aşamasında tekrar eden işler çıkarılır ve üç filtreden geçenler sıralanır; veri hazırlığında seçilen sürecin kaydı görünür kılınır; pilot tek süreçte, sekiz ile on iki haftada ve tek başarı ölçüsüyle kurulur; ölçekleme aşamasında pilotun rakamı iş vakasına çevrilir. Sıra pazarlık konusu değildir, çünkü her aşama bir sonrakinin girdisini üretir.",
          en: "An AI roadmap is built in four stages: diagnosis and process selection, data preparation, pilot, then scale and ROI. Diagnosis lists the repeated work and ranks whatever passes the three filters; data preparation makes the chosen process's record visible; the pilot runs on one process, inside eight to twelve weeks, against a single success measure; scaling turns the pilot's number into a business case. The order is not negotiable, because each stage produces the input for the next.",
        },
      },
      {
        question: {
          tr: "AI pilot projesi ne kadar sürer?",
          en: "How long does an AI pilot take?",
        },
        answer: {
          tr: "Pilot süresini biz sekiz ile on iki hafta olarak kapsamlıyoruz ve tek bir sürece bağlıyoruz. Süre uzarsa neden genellikle model değil veri olur: kayıt dağınıksa pilot, veri temizleme projesine dönüşür ve takvim taşar. Veri hazırlığının ayrı bir aşama olmasının nedeni tam olarak budur. Pilotun başında bir durdurma eşiği yazmak da süreyi korur — hangi rakama ulaşılamazsa projenin kapanacağı baştan bellidir.",
          en: "We scope a pilot at eight to twelve weeks and tie it to a single process. When it runs long, the cause is usually the data rather than the model: a scattered record turns the pilot into a cleanup project and the schedule slips. That is precisely why data preparation is its own stage. Writing a stopping threshold at the start protects the timeline too — everyone knows from day one which number, if unmet, closes the project.",
        },
      },
      {
        question: {
          tr: "İşletmelerde yapay zeka kullanımı hangi süreçlerde kazanç çıkarır?",
          en: "Which business processes does AI actually pay off on?",
        },
        answer: {
          tr: "Kazanç; sık tekrarlanan, dijital iz bırakan ve hatası aynı gün fark edilebilen süreçlerden çıkar. Teklif hazırlama, katalog ve ürün verisi eşleştirme, teknik doküman üretimi, gelen müşteri yazışmasının sınıflandırılması bu tanıma uyar. Ayda üç kez yapılan işler, kaydı olmayan usta bilgisi ve darboğazı imza yetkisi olan onay süreçleri uymaz. Ölçüt sürecin şirket içindeki görünür önemi değil, tekrar sayısı ile kaydının varlığıdır.",
          en: "The gain comes from processes that repeat often, leave a digital trace, and fail in ways someone catches the same day. Quote preparation, catalogue and product data matching, technical document drafting, and classifying inbound customer correspondence all fit. Work done three times a month, undocumented craft knowledge, and approval steps bottlenecked on signature authority do not. The criterion is repetition and the existence of a record, not how important the process looks on the org chart.",
        },
      },
      {
        question: {
          tr: "Verimlilik kazancı hangi göstergelerle izlenir?",
          en: "Which indicators track a productivity gain?",
        },
        answer: {
          tr: "Verimlilik, sürecin birim çıktısına düşen insan-saatiyle ölçülür; model doğruluğu bir mühendislik göstergesidir, iş göstergesi değildir. Üç sayı yeterlidir: pilottan önceki durum, pilottan sonraki durum ve ölçüm penceresi. İkinci bir gösterge kuyruktur — teklif veya sipariş kuyruğunda bekleyen iş sayısı düşmüyorsa kazanılan süre başka bir darboğaza gitmiştir. Başlangıç noktası pilottan önce kaydedilmezse sonuç ispatlanamaz.",
          en: "Productivity is measured in person-hours per unit of process output; model accuracy is an engineering indicator rather than a business one. Three numbers suffice: the state before the pilot, the state after it, and the measurement window. A second indicator is the queue — if the number of items waiting in the quote or order queue does not fall, the time saved has moved to another bottleneck. Without a starting point recorded before the pilot, no result can be proven.",
        },
      },
      {
        question: {
          tr: "AI dönüşüm danışmanlığı ne iş yapar?",
          en: "What does AI transformation consulting actually do?",
        },
        answer: {
          tr: "AI dönüşüm danışmanlığı, süreç seçimi ile ölçüm çerçevesini kurar ve pilotu iş vakasına bağlar. Somut çıktıları şunlardır: tekrar eden süreçlerin envanteri, üç filtreden geçen kısa liste, veri kaydının durum tespiti, pilot kapsamı ile durdurma eşiği, ölçekleme için ROI hesabı. Araç seçimi bu işin sonucudur, başlangıcı değil. Tek bir aracın kurulumu gerekiyorsa danışmanlık değil, satın alma yeterlidir.",
          en: "AI transformation consulting sets up process selection and the measurement frame, then ties the pilot to a business case. Its concrete outputs are an inventory of repeated processes, a short list of those passing the three filters, an assessment of the data record, the pilot scope with its stopping threshold, and an ROI calculation for scaling. Tool selection is the result of that work, not its starting point. If a single tool needs installing, procurement is enough.",
        },
      },
      {
        question: {
          tr: "AI dönüşümü küçük ve orta ölçekli şirketler için mantıklı mı?",
          en: "Does AI transformation make sense for small and mid-sized companies?",
        },
        answer: {
          tr: "Ölçek değil, tekrar sayısı belirleyicidir. Elli kişilik bir şirkette ayda binlerce kez tekrarlanan bir katalog eşleştirme işi, beş yüz kişilik bir şirkette yılda üç kez verilen yatırım kararından çok daha iyi bir pilot adayıdır. MKComputer örneğinde 200.000'den fazla ürünün beş dakikada senkronlanması tam da bu tekrar hacminden çıktı. Küçük şirketin asıl dezavantajı bütçe değil, süreç sahibinin aynı anda üç işi yürütmesidir.",
          en: "Repetition decides this, not headcount. A catalogue matching task running thousands of times a month in a fifty-person company is a far better pilot candidate than an investment decision taken three times a year in a five-hundred-person one. At MKComputer, syncing more than 200,000 products in five minutes came out of exactly that volume of repetition. The real disadvantage for a smaller company is not budget but a process owner already running three jobs at once.",
        },
      },
      {
        question: {
          tr: "AI dönüşümü çalışanların işini elinden alır mı?",
          en: "Does AI transformation take jobs away from employees?",
        },
        answer: {
          tr: "Devredilen şey genellikle işin kendisi değil, işin tekrar eden parçasıdır. Meccanotecnica örneğinde teklif hazırlayan mühendisler ortadan kalkmadı; teklif talebi 10 katına çıktığı için aynı ekip çok daha fazla talebi karşıladı. Risk asıl şu noktada büyüyor: süreç yeniden yazılmadan model eklenirse insan, makinenin çıktısını baştan yazan bir düzeltmene dönüşür. Rol tasarımı, model tasarımı kadar planlanmalıdır.",
          en: "What gets handed over is usually the repeating part of a job rather than the job itself. At Meccanotecnica the engineers preparing quotes did not disappear; because quote requests rose tenfold, the same team served far more demand. The real risk grows elsewhere: if a model is bolted on without rewriting the process, the human becomes a proofreader retyping the machine's output. Role design deserves as much planning as model design.",
        },
      },
      {
        question: {
          tr: "Yapay zeka dönüşümünde en sık yapılan hata nedir?",
          en: "What is the most common mistake in AI transformation?",
        },
        answer: {
          tr: "En sık hata, süreç seçmeden araç seçmektir. Sunumla gelen bir platform satın alınır, sonra o platforma uyacak bir kullanım senaryosu aranır ve proje sahibini bulamadan durur. İkinci sık hata, bozuk bir süreci olduğu gibi otomatikleştirmektir; bozuk süreç otomatikleştiğinde hata da hızlanır. Üçüncüsü, başlangıç ölçüsünü kaydetmeden pilota başlamaktır — sonuç iyi olsa bile ispatlanamaz ve bütçe ikinci yıl yenilenmez.",
          en: "The most common mistake is choosing a tool before choosing a process. A platform arrives with a deck, gets bought, and then someone hunts for a use case that fits it until the project stalls without an owner. The second is automating a broken process as it stands; automate the break and the error speeds up too. The third is starting a pilot without recording the baseline — even a good result cannot be proven, and the budget is not renewed.",
        },
      },
      {
        question: {
          tr: "AI dönüşümünün ROI'si nasıl hesaplanır?",
          en: "How do you calculate ROI on AI transformation?",
        },
        answer: {
          tr: "ROI (yatırım getirisi) hesabı üç kalemden kurulur: kazanılan insan-saatin parasal karşılığı, kaçırılmayan işin katkısı ve modelin çalıştırma maliyeti. Üçüncü kalem çoğu iş vakasında unutulur; kullanım ücreti, entegrasyon bakımı ve insan denetimi kalıcı gider kalemleridir. Paydayı teşhis aşamasında ölçülen insan-saat oluşturur, payı ise pilot sonundaki fark. Aynı yapı ikinci sürece taşındığında ROI daha yüksek çıkar, çünkü kurulum maliyeti bir kez ödenir.",
          en: "ROI (return on investment) rests on three items: the monetary value of the person-hours recovered, the contribution of work no longer lost, and the running cost of the model. The third item goes missing from most business cases; usage fees, integration maintenance and human review are permanent costs. The denominator comes from the person-hours measured during diagnosis, the numerator from the difference at the end of the pilot. ROI improves on the second process, because setup is paid once.",
        },
      },
    ],
    category: "transform",
    topic: "yapay-zeka",
    tags: [
      "ai-donusumu",
      "yapay-zeka-yol-haritasi",
      "isletmelerde-yapay-zeka-kullanimi",
      "ai-pilot-projesi",
      "yapay-zeka-ile-verimlilik",
    ],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-08-28",
    readingMinutes: 11,
    seo: {
      title: {
        tr: "AI dönüşümü nedir? Uçtan uca rehber",
        en: "What is AI transformation? A pilot-first guide",
      },
      description: {
        tr: "AI dönüşümü nedir, dijital dönüşümden nerede ayrılır? Dört aşamalı yapay zeka yol haritası, önce pilot yaklaşımı ve teklif talebini 10 katına çıkaran vaka.",
        en: "What is AI transformation, and how does it differ from digital transformation? A four-stage AI roadmap, a pilot-first method, and quote requests grown tenfold.",
      },
    },
  },
  {
    slug: {
      tr: "ai-danismani-secerken-sorulacak-12-soru",
      en: "12-questions-to-ask-an-ai-consultant",
    },
    title: {
      tr: "Üç teklif, tek fark: yapay zeka danışmanına sorulacak 12 soru",
      en: "Three proposals, one difference: 12 questions to ask an AI consultant",
    },
    excerpt: {
      tr: "Üç teklif, aynı vaat, birbirine yakın fiyat. Farkı ilk görüşmede görmenin bir yolu var: on iki soru ve her birinin cevabında neyi aramanız gerektiği.",
      en: "Three proposals, the same promise, near-identical prices. There is a way to tell them apart in the first meeting: twelve questions, and what to listen for in each answer.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Bir üretim şirketinin toplantı odasında üç teklif yan yana duruyordu. Üçü de yapay zekayla verimlilik vaat ediyordu, üçünün de fiyatı birbirine yakındı. Genel müdür sonunda tek bir soru sordu: bu sistem kurulduktan sonra hangi rakam, ne kadar hareket edecek? İki sağlayıcı ekranı kaydırıp demoya döndü. Üçüncüsü şunu söyledi: bugünkü taban değerinizi ölçmedim, dolayısıyla bilmiyorum — önce onu ölçelim.",
          en: "Three proposals sat side by side in a manufacturer's meeting room. All three promised efficiency through AI, and all three cost about the same. The managing director finally asked one question: once this is live, which number moves, and by how much? Two providers scrolled back to the demo. The third said: I haven't measured your baseline yet, so I don't know — let's measure it first.",
        },
      },
      {
        type: "p",
        text: {
          tr: "O toplantıyı bu yazı için kurguladım; üç teklif arasındaki farkı kurgulamadım. Türkiye'de son iki yılda yapay zeka ajansı adıyla ortaya çıkan sağlayıcıların büyük kısmı aynı iki ürünü satıyor: bir sohbet botu ve bir içerik otomasyonu. İkisi de gerçek işlerdir. Ama ikisi de bir fabrikanın teklif sürecini, bir perakendecinin stok akışını veya bir servis ağının iş emri dağıtımını değiştirmez.",
          en: "I invented that meeting for this article; I did not invent the difference between the three proposals. Most providers that have appeared in Türkiye over the past two years under the label of an AI agency sell the same two products: a chatbot and a content automation. Both are real work. Neither one changes a factory's quoting process, a retailer's stock flow or a service network's work-order routing.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ayrım şurada başlıyor: bir yapay zeka danışmanı modeli kurmakla değil, o modelin bağlanacağı süreci ve ölçüyü kurmakla ilgilenir. Aşağıdaki on iki soru bu ayrımı ilk görüşmede yüzeye çıkarmak için yazıldı. Her sorunun altında, verilen cevapta neyi aramanız gerektiği de duruyor — çünkü asıl bilgi soruda değil, sağlayıcının duraksadığı yerde.",
          en: "The line starts here: an AI consultant is not in the business of installing a model but of building the process and the measure that model attaches to. The twelve questions below exist to bring that line to the surface in the first meeting. Under each one sits what to listen for in the answer — because the real information isn't in the question, it's in where the provider hesitates.",
        },
      },
      {
        type: "h2",
        id: "ajans-mi-danisman-mi",
        text: {
          tr: "Yapay zeka ajansı ile yapay zeka danışmanı arasındaki fark nedir?",
          en: "What is the difference between an AI agency and an AI consultant?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zeka ajansı çoğunlukla bir araç teslim eder: sohbet botu, içerik akışı, hazır bir modelin arayüzü. Yapay zeka danışmanı bir sonucu taahhüt eder — hangi süreçte hangi metriğin ne kadar iyileşeceğini önceden tanımlar, işe başlamadan ölçer ve sistemi o ölçünün etrafına kurar. İkisi rakip değil, farklı işlerdir; sorun, ikisinin de aynı sunum dosyasıyla satılmasıdır. Rolün adı da henüz oturmadı: kimi AI danışmanı diyor, kimi yapay zeka danışmanı — ikisi de aynı işi tarif ediyor.",
          en: "An AI agency usually delivers a tool: a chatbot, a content pipeline, an interface over an off-the-shelf model. An AI consultant commits to an outcome — naming in advance which metric in which process will improve and by how much, measuring it before the work starts, then building the system around that measure. They aren't rivals but different jobs; the trouble is that both get sold with the same deck. The title hasn't settled either: some say AI consultant, others AI transformation advisor — both describe the same work.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Fark akademik değil, faturaya yansıyan bir fark. Bir sohbet botu kurmak bugün birkaç gün süren bir iştir ve fiyatı da öyle olmalıdır. Bir teklif sürecinin tamamını mühendisin diline çevirmek, kataloğu, CRM'i ve yanıt akışını aynı sisteme bağlamak ise ay ölçeğinde bir mühendislik işidir — ve karşılığında ölçülebilir bir sayı verir. Bu yazının çerçevesi [yapay zeka danışmanlığı](/hizmetler/ai-danismanlik) tarafında kurduğumuz projelerden çıktı.",
          en: "The difference is not academic; it lands on the invoice. Standing up a chatbot takes a few days today, and the price should say so. Translating an entire quoting process into an engineer's language — wiring the catalogue, the CRM and the response flow into one system — is months of engineering work, and it returns a number you can measure. The frame in this article came out of the projects we run on the [AI advisory](/hizmetler/ai-danismanlik) side.",
        },
      },
      {
        type: "p",
        text: {
          tr: "On iki soru, tek bakışta:",
          en: "The twelve questions, at a glance:",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          { tr: "Model mi satıyorsunuz, sonuç mu?", en: "Are you selling a model or an outcome?" },
          { tr: "Verim iddianızı hangi vakayla ve hangi rakamla kanıtlarsınız?", en: "Which case and which number back your efficiency claim?" },
          { tr: "Bizim işimizde yapay zekayı nerede kullanmazsınız?", en: "Where in our business would you refuse to use AI?" },
          { tr: "İlk pilot için hangi süreci seçerdiniz, neden o süreç?", en: "Which process would you pick for the first pilot, and why that one?" },
          { tr: "Veri hazırlığını kim yapar, ne kadar sürer?", en: "Who does the data preparation, and how long does it take?" },
          { tr: "Projeden önce hangi taban ölçümü alırsınız?", en: "Which baseline do you measure before the project starts?" },
          { tr: "Pilot kaç haftada canlıya çıkar?", en: "How many weeks until the pilot is live?" },
          { tr: "Mevcut sistemlerimize nasıl bağlanırsınız?", en: "How do you connect to the systems we already run?" },
          { tr: "Model yanlış cevap verdiğinde ne oluyor?", en: "What happens when the model gets an answer wrong?" },
          { tr: "Verimiz nerede işlenir, KVKK sorumluluğu kimde?", en: "Where is our data processed, and who carries the compliance duty?" },
          { tr: "Hangi model sağlayıcısına bağımlı kalıyoruz?", en: "Which model provider are we locked into?" },
          { tr: "Proje bittiğinde sistemin sahibi kim, ekibimizden kim ne öğrenmiş olacak?", en: "When the project ends, who owns the system and who on our team has learned what?" },
        ],
      },
      {
        type: "h2",
        id: "model-mi-sonuc-mu",
        text: {
          tr: "1. Model mi satıyorsunuz, sonuç mu?",
          en: "1. Are you selling a model or an outcome?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sorunun amacı, karşınızdakinin kendini nasıl tarif ettiğini duymak. Model satan taraf konuşmaya teknolojiden başlar: hangi modeli kullandığını, hangi arayüzü kurduğunu, kaç entegrasyon yaptığını anlatır. Sonuç satan taraf konuşmaya sizin sayılarınızdan başlar — hangi süreçte kaç saat harcandığını, o saatin neye mal olduğunu, hangi eşikten sonra yatırımın kendini ödediğini sorar.",
          en: "The point of the question is to hear how the other side describes itself. A provider selling a model opens with technology: which model it uses, which interface it builds, how many integrations it has shipped. A provider selling an outcome opens with your numbers — how many hours a process consumes, what those hours cost, and past which threshold the investment pays for itself.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İlk beş dakika bu yüzden bilgi verir. Teknolojiyle açan cevap yanlış değildir, eksiktir: hangi modelin kullanıldığı bir uygulama detayıdır ve altı ay içinde değişebilir; hangi metriğin hareket edeceği ise sözleşmenin konusudur ve değişmemelidir.",
          en: "That is why the first five minutes tell you something. Opening with technology isn't wrong, it's incomplete: which model gets used is an implementation detail and may change within six months, whereas which metric moves is the subject of the contract and shouldn't.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: sağlayıcı sizin işinizin sayılarını mı soruyor, yoksa kendi araç setini mi anlatıyor?",
          en: "Listen for this: is the provider asking about the numbers in your business, or presenting its own toolkit?",
        },
      },
      {
        type: "h2",
        id: "kanit-hangi-vaka",
        text: {
          tr: "2. Verim iddianızı hangi vakayla ve hangi rakamla kanıtlarsınız?",
          en: "2. Which case and which number back your efficiency claim?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Doğru cevap üç bileşen taşır: bir iş, bir metrik, bir zaman aralığı. Müşterilerimizde ciddi verim artışı sağladık cümlesi kanıt değil nezakettir; sağlayıcının hangi işte, hangi sayıyı, ne kadar sürede hareket ettirdiğini duymadan bir sonraki gündem maddesine geçmeyin.",
          en: "A good answer carries three components: a piece of work, a metric and a time frame. \"We delivered serious efficiency gains for our clients\" is a courtesy, not evidence; don't move to the next agenda item before you hear which work, which number and over what period.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kendi tarafımızdan bir örnek vereyim, iddianın nasıl kurulması gerektiğini göstermek için. [Meccanotecnica Umbra Türkiye'de](/vakalar/meccanotecnica-umbra-teklif-portali) ürün kataloğunu, fabrikasını anlatan mühendise uygun donanımı çıkaran bir AI teknik danışmana ve teklif portalına bağladık: teklif talebi 10 katına çıktı, talep ile yanıt arasındaki süre yüzde doksan kısaldı. Cümlede iş de var (teklif süreci), metrik de (talep sayısı, yanıt süresi), yön ve büyüklük de.",
          en: "Here is one from our own side, to show how the claim should be built. At [Meccanotecnica Umbra Türkiye](/vakalar/meccanotecnica-umbra-teklif-portali) we connected the product catalogue to an AI technical advisor that works out the right equipment for an engineer describing their plant, and to a quote portal: quote requests rose tenfold and the time between request and response fell by ninety percent. The sentence names the work (quoting), the metrics (request volume, response time) and both direction and size.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: rakamın yanında taban değer var mı? Yüzde kırk arttı cümlesi neyin üstüne kırk arttığını söylemiyorsa ölçü değil, süstür.",
          en: "Listen for this: does the number come with a baseline? \"Up forty percent\" that never says forty percent of what is decoration rather than measurement.",
        },
      },
      {
        type: "h2",
        id: "nerede-kullanmazsiniz",
        text: {
          tr: "3. Bizim işimizde yapay zekayı nerede kullanmazsınız?",
          en: "3. Where in our business would you refuse to use AI?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Her yerde kullanırız diyen sağlayıcı, muhtemelen henüz hiçbir yerde ciddi biçimde kullanmamıştır. Deneyimli bir danışman size en az iki alan sayar: hatanın maliyeti yüksek olduğu için insan onayının kalması gereken kararlar ve geçmiş verisi bir modeli beslemeye yetmeyen süreçler.",
          en: "A provider who says \"everywhere\" has probably not yet used it seriously anywhere. An experienced consultant will name at least two areas: decisions where the cost of error keeps a human in the loop, and processes whose history is too thin to feed a model at all.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sınır çizmek somut bir iştir. Fiyat onayı, iş güvenliği kararı ve tek seferlik stratejik tercihler modelin işi değildir. Buna karşılık tekrar eden, kuralı yazılabilen ve geçmiş kaydı bulunan işler — teklif hazırlama, sipariş eşleştirme, teknik doküman arama — modelin ilk ve en kârlı alanıdır.",
          en: "Drawing that line is concrete work. Price approval, workplace safety calls and one-off strategic choices are not the model's job. Repetitive work with a writable rule and a record behind it — preparing quotes, matching orders, searching technical documents — is where the model pays first and pays most.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: neyi yapmayacağını söyleyebiliyor mu? Sınır çizemeyen sağlayıcı, sonucu da ölçemez.",
          en: "Listen for this: can they say what they won't do? A provider who can't draw the boundary can't measure the result either.",
        },
      },
      {
        type: "h2",
        id: "ilk-pilot-hangi-surec",
        text: {
          tr: "4. İlk pilot için hangi süreci seçerdiniz, neden o süreç?",
          en: "4. Which process would you pick for the first pilot, and why that one?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İyi cevap üç ölçüte dayanır: sürecin tekrar sıklığı, hatanın bugünkü maliyeti ve mevcut verinin durumu. Danışman bu üçünü sormadan bir süreç öneremez; öneriyorsa öneri sizin işinizden değil, elindeki hazır üründen geliyordur.",
          en: "A good answer rests on three criteria: how often the process repeats, what an error costs today, and what state the data is in. A consultant can't propose a process without asking all three; if they do, the proposal comes from their shelf, not from your business.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Seçimin mantığı sezgiye ters düşer. En kârlı ilk alan genellikle en görünür olan değil, en çok tekrar edenidir: günde otuz kez yapılan on dakikalık bir iş, ayda bir yapılan iki günlük işten daha büyük bir kaldıraçtır. Dönüşümün hangi sırayla ilerlediğini [AI dönüşümü nedir yazısında](/yazilar/ai-donusumu-nedir) uçtan uca anlattık.",
          en: "The logic of that choice runs against instinct. The most profitable first area is usually not the most visible one but the most repeated: a ten-minute task done thirty times a day is a bigger lever than a two-day task done once a month. We set out the full sequence of a transformation in [what AI transformation is](/yazilar/ai-donusumu-nedir).",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: önerilen süreç sizin anlattığınız bir darboğaz mı, yoksa sunumda zaten duran bir örnek mi?",
          en: "Listen for this: is the proposed process a bottleneck you described, or an example already sitting in the deck?",
        },
      },
      {
        type: "h2",
        id: "veri-hazirligini-kim-yapar",
        text: {
          tr: "5. Veri hazırlığını kim yapar, ne kadar sürer?",
          en: "5. Who does the data preparation, and how long does it take?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Projelerin çoğunda işin en büyük kısmı buradadır ve teklif dosyalarının çoğunda bu satır yoktur. Veri hazırlığı — kaynakların toplanması, temizlenmesi, etiketlenmesi ve erişim izinlerinin açılması — modelin kurulmasından uzun sürer, dolayısıyla kimin yapacağı sözleşmeden önce yazılmalıdır.",
          en: "In most projects this is the largest part of the work, and in most proposals it is the missing line. Data preparation — collecting sources, cleaning them, labelling them and opening access rights — takes longer than standing up the model, so who does it belongs in writing before the contract.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Veriyi siz verin, gerisi bizde cümlesi maliyetin yarısını sessizce size bırakır. Sağlıklı cevap paylaşımı isimlendirir: hangi kaynak sizden çıkar, hangi dönüşümü sağlayıcı yapar, her adım kaç hafta sürer ve gecikirse takvim nereden kayar.",
          en: "\"You supply the data, we'll handle the rest\" quietly leaves half the cost with you. A sound answer names the split: which source comes from you, which transformation the provider performs, how many weeks each step takes and where the schedule slips if one runs late.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: veri hazırlığına ayrılan süre, model kurulumuna ayrılan süreden kısa mı? Kısaysa ya nedenini anlatabiliyorlardır ya da bu işi hiç yapmamışlardır.",
          en: "Listen for this: is the time allotted to data preparation shorter than the time allotted to building the model? If it is, either they can explain why or they have never done this work.",
        },
      },
      {
        type: "h2",
        id: "taban-olcum",
        text: {
          tr: "6. Projeden önce hangi taban ölçümü alırsınız?",
          en: "6. Which baseline do you measure before the project starts?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ölçülmemiş bir sürecin iyileştiğini kimse kanıtlayamaz. Ciddi bir sağlayıcı işe başlamadan önce bugünkü değeri kaydeder: kaç dakika, kaç adım, kaç hata, kaç talep, kaç kişi.",
          en: "Nobody can prove that an unmeasured process improved. A serious provider records today's value before starting: how many minutes, how many steps, how many errors, how many requests, how many people.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu ölçüm sonradan alınamaz. Meccanotecnica Umbra'da yanıt süresinin yüzde doksan kısaldığını söyleyebilmemizin tek sebebi, kısalmadan önceki süreyi ölçmüş olmamız. Taban değerin sıfır çıkması da iyi bir başlangıçtır: SIM Baskı Malzemeleri'nde yapay zeka motorlarındaki görünürlük ilk ölçümde sıfırdı, program yürüdükten sonra 40 bine ulaştı — sıfırdan başlayan sonucu kimse yorumlamak zorunda kalmaz.",
          en: "You cannot take that measurement afterwards. The only reason we can say response time fell by ninety percent at Meccanotecnica Umbra is that we measured the time before it fell. A baseline of zero is a fine start too: at SIM Printing Suppliers, visibility across AI engines read zero at first measurement and reached 40,000 once the programme ran — a result that starts from zero needs no interpretation.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: taban ölçüm teklifin içinde bir kalem mi, yoksa sözlü bir niyet mi?",
          en: "Listen for this: is the baseline a line item in the proposal, or a verbal intention?",
        },
      },
      {
        type: "h2",
        id: "pilot-kac-haftada",
        text: {
          tr: "7. Pilot kaç haftada canlıya çıkar?",
          en: "7. How many weeks until the pilot is live?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kurumsal bir pilotun canlıya çıkma süresi haftalarla ölçülür, aylarla değil — ve bu süre sağlayıcının mühendislik derinliğini doğrudan gösterir. Altı ay sonra ilk çıktı diyen cevap bir pilotu değil bir programı tarif eder; iki günde ayağa kaldırırız diyen cevap ise bir pilotu değil bir demoyu.",
          en: "An enterprise pilot's time to live is measured in weeks, not months — and that number is a direct read on the provider's engineering depth. \"First output in six months\" describes a programme rather than a pilot; \"we'll have it up in two days\" describes a demo rather than a pilot.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aralık işin tipine göre değişir, mantık sabit kalır. Pilot, tek bir süreçte, tek bir ekiple ve gerçek veriyle çalışan en küçük çalışır sistemdir. Amacı etkilemek değil ölçmektir; çıktısı bir sunum değil bir karardır — yaygınlaştır ya da durdur.",
          en: "The range shifts with the type of work; the logic holds. A pilot is the smallest working system that runs in one process, with one team, on real data. Its purpose is to measure rather than to impress, and its output is a decision rather than a presentation — scale it or stop it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: pilotun bitiş kriteri tanımlı mı? Bitiş kriteri olmayan pilot bitmez, yalnızca bütçesi biter.",
          en: "Listen for this: is there a defined exit criterion? A pilot without one doesn't end; only its budget does.",
        },
      },
      {
        type: "h2",
        id: "mevcut-sistemlere-baglanti",
        text: {
          tr: "8. Mevcut sistemlerimize nasıl bağlanırsınız?",
          en: "8. How do you connect to the systems we already run?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapay zekanın değeri modelde değil, bağlandığı yerdedir. ERP'nizden, CRM'inizden veya üretim yazılımınızdan veri okuyamayan ve oraya yazamayan bir sistem çalışanlarınıza ikinci bir ekran ve üçüncü bir iş yükü ekler; altı ay içinde de kullanılmaz hale gelir.",
          en: "AI's value sits not in the model but in what it attaches to. A system that can't read from and write back to your ERP, CRM or production software hands your staff a second screen and a third workload — and falls out of use within six months.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bağlantı katmanı çoğu zaman projenin gerçek mühendisliğidir. Almanya'daki müşterimiz [MKComputer için kurduğumuz platform](/vakalar/mkcomputer-dropshipping-otomasyonu) 200 binden fazla ürünü beş dakikada senkronluyor ve sipariş yönlendirmesini sıfır manuel adımla yapıyor. Bu ölçekte soru hangi model değil; veri akışının hangi hızda, hangi hata payıyla ve hangi arıza senaryosunda taşındığıdır.",
          en: "The integration layer is usually where the real engineering happens. The platform we built for our German client [MKComputer](/vakalar/mkcomputer-dropshipping-otomasyonu) syncs more than 200,000 products in five minutes and routes orders with zero manual steps. At that scale the question isn't which model; it's at what speed, at what error rate and under which failure scenario the data moves.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: entegrasyonu kimin yazacağı belli mi? Sizin IT ekibiniz API'yi açar cümlesi bir plan değil, bir varsayımdır.",
          en: "Listen for this: is it settled who writes the integration? \"Your IT team opens the API\" is an assumption, not a plan.",
        },
      },
      {
        type: "h2",
        id: "model-yanlis-cevap",
        text: {
          tr: "9. Model yanlış cevap verdiğinde ne oluyor?",
          en: "9. What happens when the model gets an answer wrong?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Her model yanılır; ciddi sağlayıcı bunu siz sormadan söyler ve yanılmanın maliyetini sınırlayan bir tasarım gösterir. İyi cevap üç katman içerir: modelin cevabını dayandırdığı kaynak, güven eşiğinin altında işi insana devreden kural ve her cevabın geriye izlenebildiği bir kayıt.",
          en: "Every model gets things wrong; a serious provider says so before you ask and shows a design that caps the cost of being wrong. A good answer has three layers: the source each answer is grounded in, a rule that hands the task to a human below a confidence threshold, and a log that makes every answer traceable after the fact.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Teknik satış yapan bir üretici için bu şart pazarlık konusu değildir: yanlış donanım önerisi bir müşteri kaybından fazlasına mal olur. Modelin veri olmadan cevap uydurması — sektördeki adıyla halüsinasyon — tasarımla sınırlanabilir; cevabın kaynağı ürün verisine bağlandığında model kendi başına ürün icat etmez.",
          en: "For a manufacturer selling technically this is not negotiable: recommending the wrong equipment costs more than one lost customer. A model inventing answers where it has no data — hallucination, in the industry's term — can be bounded by design; once each answer is grounded in product data, the model stops inventing products of its own.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: hata konusu açıldığında savunmaya mı geçiyor, yoksa tasarımını mı anlatıyor?",
          en: "Listen for this: when errors come up, do they get defensive or do they describe the design?",
        },
      },
      {
        type: "h2",
        id: "veri-nerede-islenir",
        text: {
          tr: "10. Verimiz nerede işlenir, KVKK sorumluluğu kimde?",
          en: "10. Where is our data processed, and who carries the compliance duty?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevap tek cümlede verilebilmeli: veri hangi ülkedeki hangi sağlayıcının sunucusunda işleniyor, ne kadar saklanıyor ve model eğitiminde kullanılıyor mu. Kişisel veri söz konusuysa KVKK açısından veri sorumlusu sizsiniz, sağlayıcı ise veri işleyendir — bu ayrım sözleşmede yazılı olmalıdır.",
          en: "The answer should fit in one sentence: on whose servers and in which country the data is processed, how long it is retained, and whether it feeds model training. Where personal data is involved you are the data controller and the provider is the processor — and that distinction belongs in the contract in writing.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Pratik sonuç sert: sözleşmede veri işleyen sıfatı, saklama süresi ve alt yüklenici listesi yoksa sorumluluğun tamamı sizde kalır. Kurumsal alıcılar bu maddeyi fiyattan önce okur, çünkü fiyat pazarlık konusudur, sorumluluk değildir.",
          en: "The practical consequence is blunt: if the contract omits processor status, retention period and the list of sub-processors, the whole duty stays with you. Enterprise buyers read that clause before the price, because price is negotiable and liability is not.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: sağlayıcı kendi alt yüklenicilerini sayabiliyor mu? Sayamıyorsa veri zincirinin nerede bittiğini bilmiyor demektir.",
          en: "Listen for this: can the provider name its own sub-processors? If not, they don't know where the data chain ends.",
        },
      },
      {
        type: "h2",
        id: "model-saglayici-bagimliligi",
        text: {
          tr: "11. Hangi model sağlayıcısına bağımlı kalıyoruz?",
          en: "11. Which model provider are we locked into?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Model katmanı bu alanın en hızlı değişen ve en hızlı ucuzlayan parçasıdır; bugünün en iyi modeli altı ay sonra ikinci sırada olabilir. İyi kurulmuş bir sistem model sağlayıcısını değiştirilebilir bir bileşen olarak tutar — iş mantığı, veri akışı ve arayüz yerinde kalırken model değişebilir.",
          en: "The model layer is the fastest-moving and fastest-cheapening part of this field; today's best model can be second-best in six months. A well-built system keeps the model provider as a replaceable component — the business logic, the data flow and the interface stay put while the model changes.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sorunun ticari karşılığı nettir. Sağlayıcı fiyatını iki katına çıkardığında veya bir modeli kullanımdan kaldırdığında sisteminizin yeniden yazılması gerekiyorsa, o sistem sizin değil tedarikçinizin varlığıdır. Bağımlılık tamamen kaçınılabilir bir şey değil; ölçülebilir ve sınırlanabilir bir şeydir.",
          en: "The commercial translation is plain. If your system has to be rewritten when the provider doubles its price or retires a model, that system is your supplier's asset rather than yours. Dependency isn't something you avoid entirely; it's something you measure and bound.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: modeli değiştirmek ne kadar sürer sorusuna bir süre söyleyebiliyorlar mı?",
          en: "Listen for this: asked how long it takes to swap the model, can they name a duration?",
        },
      },
      {
        type: "h2",
        id: "sistemin-sahibi-kim",
        text: {
          tr: "12. Proje bittiğinde sistemin sahibi kim, ekibimizden kim ne öğrenmiş olacak?",
          en: "12. When the project ends, who owns the system and who on our team has learned what?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sahiplik dört kalemde tanımlanır: kaynak kodu, sistemin çalışma mantığını taşıyan kural ve komut setleri, üretilen veri ve hesapların mülkiyeti. Dördü birden sizde kalmıyorsa sistemi satın almadınız, kiraladınız — ve kirayı ne zaman artıracaklarını bilmiyorsunuz.",
          en: "Ownership is defined across four items: the source code, the rule and prompt sets that carry the system's operating logic, the data it produces, and title to the accounts. If all four don't end up with you, you didn't buy the system, you leased it — without knowing when the rent goes up.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkinci yarı devir işidir ve çoğu teklifte hiç geçmez. Sağlıklı bir danışmanlık ilişkisinde ekibinizden en az iki kişi sistemi günlük olarak çalıştırabilir hale gelir; bu bir eğitim sunumuyla değil, birlikte çalışılan haftalarla olur. Danışmanın hedefi kendini vazgeçilmez kılmak değil, sizi kendisi olmadan çalışır kılmaktır.",
          en: "The second half of the answer is handover, and most proposals never mention it. In a healthy advisory relationship at least two people on your team end up able to run the system day to day, and that comes from weeks worked side by side rather than a training deck. The consultant's aim is not to make themselves indispensable but to leave you running without them.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Cevapta arayın: teklifte devir ve eğitim için ayrılmış bir kalem var mı? Konuşulmayan devir gerçekleşmez.",
          en: "Listen for this: does the proposal carry a line for handover and training? A handover nobody discussed never happens.",
        },
      },
      {
        type: "h2",
        id: "sonuc-tek-olcu",
        text: {
          tr: "Sonuç: on iki sorunun ölçtüğü tek şey",
          en: "In closing: the one thing all twelve questions measure",
        },
      },
      {
        type: "p",
        text: {
          tr: "On iki sorunun tamamı aynı ayrımı ölçüyor: karşınızdaki taraf size bir araç mı kuruyor, yoksa bir sonucun sorumluluğunu mu alıyor? Araç kuran taraf teslimat gününde işini bitirir; sonucun sorumluluğunu alan taraf teslimat gününde işe başlar. Fiyat listesinde bu iki iş yan yana durur, faturanın karşılığında ise ayrı yerlere düşer.",
          en: "All twelve questions measure the same distinction: is the party across the table installing a tool, or taking responsibility for an outcome? The tool-installer finishes on delivery day; the one accountable for the outcome starts on delivery day. On a price list the two sit next to each other; in what you get back for the invoice they land far apart.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Türkiye'de yapay zeka firmaları hızla çoğaldı ve bu iyi haber — beş yıl önce bu soruları soracak kadar sağlayıcı yoktu. Kötü haber, aynı hızda çoğalan şeyin sunum dosyası olması. Ayrımı ilk görüşmede yapmanın yolu daha iyi bir sunum istemek değil, daha zor bir soru sormaktır.",
          en: "The number of AI companies in Türkiye has grown fast, and that is good news — five years ago there weren't enough providers to ask these questions of. The bad news is that decks multiplied at the same rate. The way to tell them apart in the first meeting isn't to ask for a better presentation but to ask a harder question.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün yapabileceğiniz bir test var ve on dakika sürüyor. Elinizdeki en yeni teklif dosyasını açın ve tek bir şey arayın: projeden önce ölçülecek bir taban değer yazıyor mu? Yazmıyorsa o belge bir sonuç taahhüdü değil, bir kurulum taahhüdüdür — ve iki belge arasındaki fark, projenin sonunda kimin haklı çıkacağını belirler.",
          en: "There is a test you can run today, and it takes ten minutes. Open the most recent proposal on your desk and look for one thing: does it name a baseline to be measured before the project starts? If it doesn't, that document commits to an installation rather than an outcome — and the gap between those two documents decides who turns out to be right at the end of the project.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı disiplinin pazarlama tarafındaki karşılığını [ajansa sorulacak sekiz soruda](/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru) yazmıştık; sorular farklı, mantık aynı. Bu on iki soruyu bize de sorun: ikinci ve sekizinci sorunun cevabı bu yazının içinde, rakamlarıyla duruyor.",
          en: "We wrote the marketing-side equivalent of this discipline in [eight questions to ask an agency](/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru); different questions, same logic. Ask us these twelve too: the answers to the second and the eighth already sit inside this article, with their numbers attached.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "Yapay zeka danışmanı ne iş yapar?",
          en: "What does an AI consultant actually do?",
        },
        answer: {
          tr: "Yapay zeka danışmanı, bir şirketin hangi sürecinde yapay zekanın ölçülebilir karşılık üreteceğini tespit eder, o süreci ölçer ve sistemi ölçünün etrafına kurar. İş üç katmanda yürür: süreç seçimi ve taban ölçüm, veri hazırlığı ve mevcut sistemlere entegrasyon, sonra pilotun canlıya alınması ve sonucun karşılaştırılması. Model seçimi bu işin en küçük ve en kolay değiştirilebilir parçasıdır; danışmanın asıl ürünü karar mimarisi ve devredilebilir bir sistemdir.",
          en: "An AI consultant identifies which process in a company will return a measurable result from AI, measures that process, then builds the system around the measure. The work runs in three layers: process selection and baseline measurement, data preparation and integration with existing systems, then taking a pilot live and comparing the outcome. Model selection is the smallest and most replaceable part of the job; the consultant's real product is a decision architecture and a system that can be handed over.",
        },
      },
      {
        question: {
          tr: "Yapay zeka ajansı ile yapay zeka danışmanlığı arasındaki fark nedir?",
          en: "What is the difference between an AI agency and AI consulting?",
        },
        answer: {
          tr: "Fark teslim edilen şeyde. Yapay zeka ajansı genellikle bir araç teslim eder — sohbet botu, içerik akışı, hazır bir modelin arayüzü — ve teslimatla işi biter. Yapay zeka danışmanlığı bir sonucu taahhüt eder: hangi metriğin ne kadar hareket edeceğini önceden tanımlar, işe başlamadan taban değeri ölçer, sistemi ERP ve CRM gibi mevcut yapılara bağlar ve proje sonunda sistemi ekibe devreder. İkisi rakip değil farklı işlerdir; sorun ikisinin de aynı fiyat bandında ve aynı sunumla satılmasıdır.",
          en: "The difference is in what gets delivered. An AI agency usually delivers a tool — a chatbot, a content pipeline, an interface over an off-the-shelf model — and its work ends at delivery. AI consulting commits to an outcome: it names which metric moves and by how much, measures the baseline before starting, wires the system into existing structures such as ERP and CRM, and hands the system to your team at the end. They are different jobs rather than rivals; the trouble is that both are sold at similar prices with similar decks.",
        },
      },
      {
        question: {
          tr: "Türkiye'deki yapay zeka şirketleri arasından nasıl seçim yapılır?",
          en: "How do you choose among AI companies in Türkiye?",
        },
        answer: {
          tr: "Seçim üç kanıt üzerinden yapılır. Birincisi rakamlı vaka: hangi işte, hangi metriği, ne kadar sürede hareket ettirdiklerini taban değeriyle birlikte anlatabilmeliler. İkincisi mühendislik derinliği: ERP, CRM veya üretim yazılımına bağlanan bir sistemi kimin yazacağı ve bu entegrasyonun kaç hafta süreceği belli olmalı. Üçüncüsü sahiplik: kod, kural setleri, veri ve hesaplar proje sonunda sizde kalmalı. Üçünü birden gösteremeyen sağlayıcı bir araç satıyordur, bir sonuç değil.",
          en: "Judge on three kinds of evidence. First, cases with numbers: they should be able to say which work, which metric and what time frame, with the baseline attached. Second, engineering depth: it should be clear who writes the integration into ERP, CRM or production software and how many weeks it takes. Third, ownership: code, rule sets, data and accounts should end up with you when the project closes. A provider who can't show all three is selling a tool rather than an outcome.",
        },
      },
      {
        question: {
          tr: "Yapay zeka pilot projesi ne kadar sürer?",
          en: "How long does an AI pilot project take?",
        },
        answer: {
          tr: "Kurumsal bir pilotun canlıya çıkma süresi haftalarla ölçülür, aylarla değil. Süre üç değişkene bağlıdır: sürecin karmaşıklığı, verinin mevcut durumu ve entegre olunacak sistemin erişilebilirliği. Altı ay sonra ilk çıktı vaadi bir pilotu değil bir programı tarif eder; iki günde kurarız iddiası ise bir demoyu. Sağlıklı pilot tek bir süreçte, tek bir ekiple ve gerçek veriyle çalışan en küçük sistemdir; bitiş kriteri baştan yazılır ve çıktısı yaygınlaştırma ya da durdurma kararıdır.",
          en: "An enterprise pilot's time to live is measured in weeks, not months. The duration depends on three variables: the complexity of the process, the state of the data, and how accessible the system it integrates with is. A promise of first output in six months describes a programme, not a pilot; a claim of two days describes a demo. A sound pilot is the smallest system running in one process, with one team, on real data; its exit criterion is written up front and its output is a decision to scale or to stop.",
        },
      },
      {
        question: {
          tr: "Yapay zeka projesinde veri hazırlığını kim yapar?",
          en: "Who prepares the data in an AI project?",
        },
        answer: {
          tr: "Paylaşım sözleşmede kalem kalem yazılır, yoksa maliyetin yarısı sessizce alıcıya kalır. Tipik dağılım şöyledir: kaynak sistemlere erişim ve alan bilgisi şirketten, toplama, temizleme, etiketleme ve dönüştürme sağlayıcıdan gelir. Veri hazırlığı çoğu projede modelin kurulmasından uzun sürer, dolayısıyla teklifte bu adıma ayrılan süre model kurulumundan kısaysa nedeni sorulmalıdır. Erişim izinlerinin açılması da ayrı bir takvim kalemidir ve genellikle en çok gecikmeyi burası üretir.",
          en: "The split belongs in the contract line by line; without it, half the cost quietly lands on the buyer. A typical division: access to source systems and domain knowledge come from the company, while collection, cleaning, labelling and transformation come from the provider. Data preparation takes longer than building the model in most projects, so if a proposal allots it less time than the model work, ask why. Opening access rights is its own schedule item and usually produces the largest delays.",
        },
      },
      {
        question: {
          tr: "Yapay zeka yatırımının geri dönüşü nasıl hesaplanır?",
          en: "How is the return on an AI investment calculated?",
        },
        answer: {
          tr: "Hesap taban değerle başlar, model seçimiyle değil. Önce bugünkü durum ölçülür — süreç kaç dakika sürüyor, kaç kişi çalışıyor, kaç hata çıkıyor, kaç talep kaçıyor — sonra pilot sonrası aynı ölçüm tekrarlanır ve fark yıllık tekrar sayısıyla çarpılır. Meccanotecnica Umbra'da yanıt süresinin yüzde doksan kısaldığını söyleyebilmemizin tek sebebi kısalmadan önceki süreyi ölçmüş olmamızdır. Taban değeri olmayan bir projenin geri dönüşü hesaplanamaz, yalnızca iddia edilir.",
          en: "The calculation starts from a baseline, not from a model choice. Measure today first — how many minutes the process takes, how many people it occupies, how many errors it produces, how many requests slip away — then repeat the same measurement after the pilot and multiply the difference by the annual frequency. The only reason we can say response time fell by ninety percent at Meccanotecnica Umbra is that we measured the time before it fell. Without a baseline, a project's return can't be calculated, only asserted.",
        },
      },
      {
        question: {
          tr: "Proje bittiğinde yapay zeka sisteminin sahibi kim olur?",
          en: "Who owns the AI system once the project ends?",
        },
        answer: {
          tr: "Sahiplik dört kalemde tanımlanır ve dördü de sözleşmede tek tek geçmelidir: kaynak kodu, sistemin çalışma mantığını taşıyan kural ve komut setleri, üretilen veri ve bulut hesaplarının mülkiyeti. Dördü birden alıcıda kalmıyorsa sistem satın alınmamış, kiralanmıştır. Devir ayrıca bir takvim kalemidir: ekipten en az iki kişinin sistemi günlük olarak çalıştırabilmesi eğitim sunumuyla değil, birlikte çalışılan haftalarla sağlanır.",
          en: "Ownership is defined across four items, and all four belong in the contract by name: the source code, the rule and prompt sets carrying the operating logic, the data produced, and title to the cloud accounts. If all four don't stay with the buyer, the system was leased rather than bought. Handover is a separate schedule item too: getting at least two people able to run the system day to day comes from weeks worked together, not from a training deck.",
        },
      },
      {
        question: {
          tr: "Yapay zeka danışmanı seçerken hangi kırmızı bayraklara dikkat etmeli?",
          en: "What red flags should you watch for when choosing an AI consultant?",
        },
        answer: {
          tr: "Beş tanesi güvenilir sinyaldir. Bir: taban ölçüm yapmadan sonuç yüzdesi vaat etmek. İki: veri hazırlığını teklifte hiç geçirmemek. Üç: her süreçte yapay zeka kullanırız demek, yani sınır çizememek. Dört: entegrasyonu sizin IT ekibinize bırakan varsayımlar. Beş: kod, kural setleri ve hesapların kimde kalacağı sorusundan kaçınmak. Altıncısını da ekleyin: modeli değiştirmek ne kadar sürer sorusuna süre söyleyememek, sistemin tek bir sağlayıcıya çivilendiğinin işaretidir.",
          en: "Five are reliable signals. One: promising a percentage improvement without measuring a baseline. Two: leaving data preparation out of the proposal entirely. Three: claiming AI fits every process, which means being unable to draw a boundary. Four: assumptions that quietly hand the integration to your IT team. Five: dodging the question of who ends up with the code, the rule sets and the accounts. Add a sixth: an inability to say how long swapping the model takes, which signals a system nailed to a single provider.",
        },
      },
      {
        question: {
          tr: "Yapay zeka projelerinde KVKK açısından neye dikkat edilir?",
          en: "What should you watch for on data protection in AI projects?",
        },
        answer: {
          tr: "Sözleşmede üç madde aranır: verinin hangi ülkede ve hangi sağlayıcının sunucusunda işlendiği, saklama süresi ve alt yüklenici listesi. Kişisel veri söz konusuysa KVKK açısından veri sorumlusu şirkettir, sağlayıcı ise veri işleyendir; bu ayrım yazılı değilse sorumluluğun tamamı alıcıda kalır. Verinin model eğitiminde kullanılıp kullanılmadığı da açıkça yazılmalıdır. Kurumsal alıcılar bu maddeleri fiyattan önce okur, çünkü fiyat pazarlık konusudur, sorumluluk değildir.",
          en: "Look for three clauses in the contract: in which country and on whose servers the data is processed, how long it is retained, and the list of sub-processors. Where personal data is involved the company is the data controller and the provider is the processor; if that split isn't written down, the whole duty stays with the buyer. Whether the data feeds model training belongs in writing as well. Enterprise buyers read these clauses before the price, because price is negotiable and liability is not.",
        },
      },
      {
        question: {
          tr: "Küçük ve orta ölçekli şirketler için yapay zeka danışmanlığı mantıklı mı?",
          en: "Does AI consulting make sense for small and mid-sized companies?",
        },
        answer: {
          tr: "Ölçek değil tekrar belirleyicidir. Günde otuz kez yapılan on dakikalık bir iş, ayda bir yapılan iki günlük işten daha büyük bir kaldıraçtır; dolayısıyla elli kişilik bir şirket de beş yüz kişilik bir şirket kadar iyi bir aday olabilir. Belirleyici olan üç şart şudur: sürecin tekrar sıklığı, hatanın bugünkü maliyeti ve geçmiş verinin varlığı. Üçü de varsa proje küçük ölçekte de kendini öder; üçünden biri yoksa bütçe büyüklüğü sonucu kurtarmaz.",
          en: "Repetition decides this, not headcount. A ten-minute task done thirty times a day is a bigger lever than a two-day task done once a month, so a fifty-person company can be as good a candidate as a five-hundred-person one. Three conditions decide it: how often the process repeats, what an error costs today, and whether historical data exists. With all three present a project pays for itself at small scale; with one missing, budget size won't rescue the result.",
        },
      },
      {
        question: {
          tr: "Yapay zeka projesinin sonucu nasıl ölçülür?",
          en: "How do you measure the result of an AI project?",
        },
        answer: {
          tr: "Ölçüm işe başlamadan kurulur ve iki kez okunur: bir kez pilottan önce, bir kez pilottan sonra. Metrik sürecin kendi diliyle seçilir — teklif sürecinde talep sayısı ve yanıt süresi, stok akışında senkron süresi ve manuel adım sayısı, görünürlükte anılma sayısı. Meccanotecnica Umbra'da teklif talebi 10 katına çıktı ve yanıt süresi yüzde doksan kısaldı; SIM Baskı Malzemeleri'nde yapay zeka motorlarındaki görünürlük sıfırdan 40 bine ulaştı. Her iki cümlenin de anlamlı olmasının sebebi, ölçümün önce alınmış olmasıdır.",
          en: "Measurement is set up before the work starts and read twice: once before the pilot and once after. The metric is chosen in the process's own language — request volume and response time in quoting, sync duration and manual step count in stock flow, mention count in visibility. At Meccanotecnica Umbra quote requests rose tenfold and response time fell by ninety percent; at SIM Printing Suppliers visibility across AI engines went from zero to 40,000. Both sentences mean something only because the measurement was taken first.",
        },
      },
    ],
    category: "transform",
    topic: "yapay-zeka",
    tags: ["yapay-zeka-danismanligi", "yapay-zeka-ajansi", "ai-donusumu", "tedarikci-secimi"],
    authorSlug: "can-aydinlik",
    publishedAt: "2026-08-28",
    readingMinutes: 13,
    seo: {
      title: {
        tr: "Yapay zeka danışmanı seçerken 12 soru",
        en: "How to choose an AI consultant: 12 questions",
      },
      description: {
        tr: "Chatbot satan yapay zeka ajansı mı, sistem kuran danışman mı? Pilot süresi, veri hazırlığı, taban ölçüm ve sistem sahipliği dahil 12 soruyla ayrımı görün.",
        en: "An AI agency selling chatbots, or a consultant building systems? Twelve questions covering pilot timelines, data prep, baselines and who owns the system.",
      },
    },
  },
  {
    slug: {
      tr: "google-ai-overviews-da-yer-almak",
      en: "google-ai-overviews-guide",
    },
    title: {
      tr: "Sıralamada varsınız, cevapta yoksunuz: Google AI Overviews'da yer almak",
      en: "Ranked, but not cited: how to appear in Google AI Overviews",
    },
    excerpt: {
      tr: "Google artık sonuçların üstünde kendi yanıtını yazıyor ve o yanıtın içinde üç dört kaynak anıyor; organik ikinci sıra bu listede olmanızı sağlamıyor. AI Overview'ın nasıl çalıştığını, Türkiye'deki durumunu ve yanıtın içine giren sayfaların paylaştığı koşulları anlatıyorum.",
      en: "Google now writes its own answer above the results and names three or four sources inside it; ranking second organically does not put you on that list. Here is how AI Overviews works, where it stands in Turkey, and what the pages inside the answer have in common.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Geçen aylarda bir görüşmede, karşımdaki pazarlama müdürü dizüstünü bana çevirdi. Ekranda kendi kategorisinin en değerli sorusu vardı ve sonuçların üstünde gri bir kutu duruyordu: Google'ın yazdığı bir yanıt, yanında üç kaynak bağlantısı. Üçü de rakipti. Kendi sayfası kutunun hemen altındaydı, organik ikinci sırada. Sıralamayı kazanmış, cevabı kaybetmişti. Görüşmeyi bu yazı için kurguladım; ekrandaki tabloyu kurgulamadım — aynı sahneyi son bir yılda farklı kategorilerde defalarca gördük.",
          en: "In a meeting a few months ago, a marketing director turned their laptop towards me. On the screen sat the most valuable question in their category, and above the results sat a grey box: an answer written by Google, with three source links beside it. All three were competitors. Their own page sat just below the box, second in the organic results. They had won the ranking and lost the answer. I invented the meeting for this article; I did not invent the screen — we have watched the same scene play out across categories over the past year.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Google AI Overviews, sonuçların üstündeki bu kutunun adı ve artık Türkçe sorgularda da düzenli olarak karşımıza çıkıyor. Bu yazı yalnız o kutuya bakıyor: ne olduğu, Google'ın açıkladığı kadarıyla nasıl çalıştığı, hangi sorgularda tetiklendiği, tıklamalarınıza ne yaptığı ve içine giren sayfaların paylaştığı koşullar. Yapay zeka aramalarının bütününü — ChatGPT, Perplexity, Gemini uygulaması — [ayrı bir rehberde](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) anlattım; genel çerçeve orada duruyor.",
          en: "Google AI Overviews is the name of that box above the results, and it now appears regularly on Turkish queries too. This article looks at that box alone: what it is, how it works as far as Google has explained it, which queries trigger it, what it does to your clicks, and what the pages inside it have in common. The wider picture of AI search — ChatGPT, Perplexity, the Gemini app — sits in [a separate guide](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz); the general framework lives there.",
        },
      },
      {
        type: "h2",
        id: "ai-overview-nedir",
        text: {
          tr: "AI Overview nedir?",
          en: "What is an AI Overview?",
        },
      },
      {
        type: "p",
        text: {
          tr: "AI Overview, Google'ın arama sonuçlarının en üstünde gösterdiği, birden çok kaynaktan derlenmiş ve bir dil modeli tarafından yazılmış özet yanıttır. Tekil kutunun adı AI Overview, özelliğin bütününün adı Google AI Overviews; kutunun içinde veya yanında yanıtı besleyen sayfalara bağlantı verilir. Kullanıcı on mavi linkten önce bir paragraf okuyor ve çoğu zaman aradığı şeyi orada buluyor.",
          en: "An AI Overview is the summarised answer Google shows at the very top of its search results — assembled from several sources and written by a language model. The single box is called an AI Overview; the feature as a whole is Google AI Overviews, and links to the pages feeding the answer sit inside or beside the box. The user reads a paragraph before reaching ten blue links, and usually finds what they came for right there.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bunu daha eskiden tanıdığınız öne çıkan snippet (featured snippet) ile karıştırmayın. Öne çıkan snippet tek bir sayfadan bir pasajı olduğu gibi alıntılar; alıntılanan cümleleri sitenizde bulabilirsiniz. AI Overview ise birkaç sayfayı okuyup sentezliyor ve yeni bir metin yazıyor. Fark küçük görünüyor, sonucu büyük: snippet'te tek bir yer vardır ve onu kazanırsınız, AI Overview'da üç dört yer vardır ve orada anılmak için o kısa listeye girmeniz gerekir.",
          en: "Don't confuse it with the featured snippet you already know. A featured snippet quotes one passage from one page verbatim, and you can find those exact sentences on the site. An AI Overview reads several pages, synthesises them and writes new text. The difference looks small and isn't: a snippet has one slot you either win or lose, while an AI Overview carries three or four, and being named means getting onto that short list.",
        },
      },
      {
        type: "h2",
        id: "nasil-calisiyor",
        text: {
          tr: "Google AI Overviews nasıl çalışıyor?",
          en: "How does Google AI Overviews work?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Google, AI Overviews'un arkasında Gemini modelinin arama için özelleştirilmiş bir sürümünün çalıştığını açıkladı. Sistem sorunuzu tek bir arama gibi ele almıyor: soruyu alt sorulara bölüyor, aynı anda birden çok arama çalıştırıyor ve dönen sayfaları tek bir yanıtta birleştiriyor — Google bu tekniğe sorgu dallanması (query fan-out) diyor.",
          en: "Google has said that a version of Gemini customised for Search sits behind AI Overviews. The system doesn't treat your question as one search: it breaks the question into sub-questions, runs several searches at once and merges what comes back into a single answer — Google calls this technique query fan-out.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Google'ın dokümantasyonunda yazdığı ikinci nokta da en az o kadar önemli: aramanın içindeki yapay zeka özellikleri aynı temel sıralama sistemlerini kullanıyor ve bağlantılar aynı indeksten geliyor. Yani ayrı bir \"AI Overviews sıralaması\" yayımlanmış değil. Pratik karşılığı iki cümle: Googlebot sayfanızı okuyamıyorsa kutuda hiç şansınız yok, okuyabiliyorsa da kendiliğinden bir hakkınız doğmuyor.",
          en: "A second point in Google's documentation matters just as much: the AI features inside Search use the same core ranking systems, and the links come from the same index. No separate \"AI Overviews ranking\" has been published. That comes down to two sentences in practice: if Googlebot can't read your page you have no chance in the box, and if it can, you still hold no automatic claim to a place in it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Google'ın açıklamadığı şey, hangi sayfanın neden seçildiği. Buradan sonrası gözlem: aynı sorguyu farklı günlerde sorduğumuzda kaynaklar değişiyor, aynı sorgu masaüstünde kutu üretip mobilde üretmiyor, kutu bazen tamamen kayboluyor. Bu alanda kesin iddiada bulunan herkese temkinli yaklaşın — elimizde algoritma değil, örüntü var.",
          en: "What Google has not explained is why a given page gets picked. Everything past that point is observation: ask the same query on different days and the sources change, the same query produces a box on desktop and none on mobile, and sometimes the box disappears altogether. Treat anyone making firm claims here with caution — what we hold is a pattern, not an algorithm.",
        },
      },
      {
        type: "h2",
        id: "hangi-sorgularda-cikiyor",
        text: {
          tr: "Hangi sorgularda AI Overview çıkıyor, hangilerinde çıkmıyor?",
          en: "Which queries trigger an AI Overview, and which don't?",
        },
      },
      {
        type: "p",
        text: {
          tr: "AI Overview her sorguda çıkmıyor ve bu, içerik planınızın en kullanışlı girdisi. Gözlemlenen örüntü şu: açıklama isteyen, karşılaştırma içeren ve birden çok adımı olan sorular kutuyu tetikliyor; marka aramaları, gezinme sorguları ve tek kesin cevabı olan kısa sorgular çoğunlukla tetiklemiyor.",
          en: "An AI Overview does not appear for every query, and that is the most useful input to your content plan. The observed pattern: questions asking for an explanation, a comparison or several steps tend to trigger the box, while brand searches, navigational queries and short questions with one definite answer usually don't.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Tanım ve açıklama soruları: \"nedir\", \"nasıl yapılır\", \"neden olur\" ile açılan her şey.",
            en: "Definition and explanation questions: anything opening with \"what is\", \"how do I\", \"why does\".",
          },
          {
            tr: "Karşılaştırmalar: \"X mi Y mi\", \"arasındaki fark ne\", \"hangisi daha iyi\".",
            en: "Comparisons: \"X or Y\", \"what is the difference between\", \"which one is better\".",
          },
          {
            tr: "Kısıtlı ve uzun sorular: bütçeyi, süreyi, ölçüyü ve kullanım senaryosunu aynı cümlede taşıyanlar.",
            en: "Long, constrained questions: the ones carrying budget, timeline, dimension and use case in a single sentence.",
          },
          {
            tr: "Hassas alanlar tersine çalışıyor: sağlık, finans ve hukuk sorgularında kutu daha seyrek çıkıyor — Google bu alanlarda daha temkinli davrandığını söylüyor.",
            en: "Sensitive fields run the other way: health, finance and legal queries produce the box less often — Google says it is deliberately more cautious there.",
          },
          {
            tr: "Marka ve gezinme sorguları: \"marka adı + giriş\" biçimindeki aramalarda kutu genelde yok, çünkü kullanıcının istediği adres zaten belli.",
            en: "Brand and navigational searches: a query shaped like \"brand name + login\" rarely produces a box, because the user already knows the address they want.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bunun içerik planına etkisi doğrudan. Size para kazandıran ticari kelime muhtemelen hiç kutu üretmiyor; kutuyu üreten, o kelimenin etrafındaki sorular. Alıcınızın satın almadan önce sorduğu on soruyu bir yere yazın — Google AI Overviews'da yer almak için çalışacağınız alan tam olarak orası, ürün sayfanız değil.",
          en: "The effect on a content plan is direct. The commercial keyword that pays your bills probably never produces a box; the questions around it do. Write down the ten questions your buyer asks before buying — that list, not your product page, is where the work of appearing in Google AI Overviews actually happens.",
        },
      },
      {
        type: "h2",
        id: "turkiyede-durum",
        text: {
          tr: "AI Overviews Türkiye'de nerede duruyor?",
          en: "Where does AI Overviews stand in Turkey?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Türkçe sorgularda AI Overview düzenli olarak çıkıyor, ama kapsamı İngilizce kadar geniş değil. Google özelliği Mayıs 2024'te duyurdu, önce ABD'de açtı, ardından kapsamı yüzden fazla ülkeye ve çok sayıda dile genişlettiğini açıkladı; Türkçe de bu genişlemenin içindeydi. Sahadaki hâli şu: aynı soruyu iki dilde sorduğunuzda İngilizce tarafta kutu daha sık çıkıyor ve daha fazla kaynak anıyor.",
          en: "AI Overviews appear regularly on Turkish queries, though coverage is narrower than in English. Google announced the feature in May 2024, opened it in the United States first, then said it had extended it to more than a hundred countries and a long list of languages, Turkish among them. On the ground the gap shows: ask the same question in both languages and the English side produces a box more often, naming more sources inside it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kendi Search Console verimizde bunun ilginç bir sinyali var. Ağustos 2026 itibarıyla son üç ayda \"google yapay zeka optimizasyonu\" sorgusu sitemize 32 gösterim getirdi, \"yapay zeka arama optimizasyonu\" 99, \"yapay zeka optimizasyonu\" 136. Üçü de küçük rakam. Ama üçünün ortak özelliği, Türkçe sonuç sayfasında bu soruların karşılığının hâlâ zayıf olması — kimse bu sorulara doğru dürüst cevap yazmamış. AI Overviews Türkiye tarafında henüz doymuş bir alan değil; İngilizce tarafta yıllar önce kapanmaya başlayan pencere burada hâlâ aralık.",
          en: "Our own Search Console data carries an interesting signal here. Over the three months to August 2026 the query \"google yapay zeka optimizasyonu\" brought our site 32 impressions, \"yapay zeka arama optimizasyonu\" 99 and \"yapay zeka optimizasyonu\" 136. All three are small numbers. What they share is more telling: the Turkish results page still answers those questions poorly — nobody has written a proper answer to them. AI Overviews in Turkey is not a saturated field yet; the window that started closing on the English side years ago is still open here.",
        },
      },
      {
        type: "h2",
        id: "tiklama-trafigi",
        text: {
          tr: "AI Overview çıktığında tıklamalarınıza ne oluyor?",
          en: "What happens to your clicks when an AI Overview appears?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kısa cevap: gösterim aynı kalırken tıklama düşüyor. Kullanıcı cevabı kutunun içinde bulduğunda alta inmiyor, dolayısıyla kutu çıkan sorgularda tıklama oranınız geriliyor — sıfır tıklama (zero-click) denen düzen tam olarak bu. Kaybın büyüklüğü sorgunun tipine bağlı: bilgi soruları en çok, satın alma ve marka soruları en az etkileniyor.",
          en: "The short answer: impressions hold and clicks fall. When the user finds the answer inside the box they don't scroll down, so your click-through rate drops on queries that produce one — this is exactly what the term zero-click describes. How much you lose depends on query type: informational questions lose the most, purchase and brand queries the least.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bunu kendi verinizde ölçmek mümkün ama dolaylı. Google, AI Overviews'dan gelen gösterim ve tıklamaları Search Console'un genel arama raporuna katıyor ve ayrı bir kırılım vermiyor; yani \"kutuda kaç kere göründüm\" diye bir ekran yok. Yapabileceğiniz şu: kutu ürettiğini elle doğruladığınız sorguları listeleyin, o sorguların tıklama oranını altı ay önceki aynı dönemle karşılaştırın. Eğri aşağı bakıyorsa ve pozisyonunuz sabitse, farkı büyük olasılıkla kutu yaratıyor.",
          en: "You can measure this in your own data, but only indirectly. Google folds AI Overview impressions and clicks into the general Search performance report in Search Console and gives no separate breakdown; there is no screen telling you how often you appeared inside a box. What you can do: list by hand the queries you have confirmed produce one, then compare their click-through rate against the same period six months earlier. If the curve points down while your position holds, the box is the likeliest explanation.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dürüst olalım: kaybı tamamen telafi eden bir taktik yok. Doğru olan şu — kutuya girmezseniz hem tıklamayı hem anılmayı kaybediyorsunuz, girerseniz en azından anılmayı koruyorsunuz. Markanın adının cevabın içinde geçmesi tıklama kadar ölçülebilir değil, ama satın alma anına kadar taşınıyor: alıcı görüşmeye geldiğinde sizi nereden duyduğunu çoğu zaman hatırlamıyor, adınızı hatırlıyor.",
          en: "Let's be honest: no tactic fully replaces what you lose. What is true is narrower — stay out of the box and you lose both the click and the mention; get in and you keep the mention. A brand name inside the answer is harder to measure than a click, yet it travels all the way to the purchase: buyers arriving at a meeting often can't say where they heard of you, but they remember the name.",
        },
      },
      {
        type: "h2",
        id: "yer-almanin-kosullari",
        text: {
          tr: "Yanıtın içinde anılmak için hangi koşullar biliniyor?",
          en: "Which conditions are known to get you named inside the answer?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Google'ın resmi konumu net: AI Overviews için ayrı bir optimizasyon yöntemi yok, aramanın temel kuralları geçerli. Bunun sahadaki karşılığı, kutunun içine giren sayfaların paylaştığı beş özellik — hiçbiri garanti değil, hepsi olasılığı artırıyor.",
          en: "Google's official position is plain: there is no separate optimisation method for AI Overviews, and the basic rules of Search apply. What that translates to in the field is five properties shared by the pages that end up inside the box — none of them a guarantee, all of them a shift in the odds.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "İndekslenebilirlik. Googlebot sayfayı çekebilmeli ve metni sunucudan gelen HTML'de görebilmeli. Google, noindex, nosnippet ve max-snippet işaretlerinin AI Overviews için de geçerli olduğunu açıkça yazıyor.",
            en: "Indexability. Googlebot has to fetch the page and see the text in the HTML the server sends. Google states plainly that the noindex, nosnippet and max-snippet directives apply to AI Overviews as well.",
          },
          {
            tr: "Alıntılanabilir paragraflar. Her paragraf sayfadan kesilip alındığında tek başına anlamlı olmalı; bağlamını bir üstteki cümleye yaslayan paragraf alıntılanamıyor.",
            en: "Quotable paragraphs. Each paragraph has to stand on its own when cut out of the page; a paragraph leaning on the sentence above it for context cannot be quoted.",
          },
          {
            tr: "Soru-cevap yapısı. Başlık müşterinizin kurduğu cümle olmalı, altındaki ilk iki cümle de o sorunun net cevabı. Hikâye sonraya kalır.",
            en: "Question-and-answer structure. The heading should be the sentence your customer says, and the first two beneath it should answer that question plainly. The story comes later.",
          },
          {
            tr: "Güncellik sinyali. Yayın ve güncelleme tarihi görünür olmalı, güncellenen içerik neyin değiştiğini söylemeli. Kutuda anılan sayfalar arasında bayat içerik görmek zor.",
            en: "A freshness signal. Publication and revision dates should be visible, and revised content should say what changed. Stale pages are rare among those named inside the box.",
          },
          {
            tr: "Doğrulanabilir kanıt. Rakam, tarih, ölçü ve kaynak cümlenin içinde geçmeli; modelin doğrulayacak başka bir yeri yok.",
            en: "Verifiable proof. Numbers, dates, measurements and sources belong inside the sentence; the model has nowhere else to check them.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu listeyi bir kontrol listesi gibi işaretleyip kutuya gireceğinizi kimse söyleyemez. Doğru cümle şu: garantisi yok, ama olasılığı sistematik olarak artırılabilir. Aynı sorguda beş rakibiniz varsa ve beşinin de sayfası ikinci maddede kalıyorsa, öne geçme ihtimaliniz teknik bir üstünlükten değil biçimsel bir farktan geliyor.",
          en: "Nobody can tell you that ticking this list gets you into the box. The accurate sentence is this: there is no guarantee, but the probability can be raised systematically. If five competitors compete for the same query and all five fail on the second condition, your advantage comes from a difference in form, not in technology.",
        },
      },
      {
        type: "h2",
        id: "alintilanabilir-paragraf",
        text: {
          tr: "Bir paragraf ne zaman alıntılanabilir olur?",
          en: "When is a paragraph actually quotable?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir paragraf, sayfadan kesilip alındığında hâlâ anlamlıysa alıntılanabilir. Testi kırk saniye sürüyor: paragrafı bağlamından koparın ve okuyun; \"bu\", \"o\", \"yukarıda anlattığımız\" gibi geri dönüşlü ifadeler yüzünden anlam kayboluyorsa makine de o paragrafı kullanamaz.",
          en: "A paragraph is quotable when it still makes sense after being cut out of the page. The test takes forty seconds: lift the paragraph out of its context and read it; if it collapses because of back-references like \"this\", \"that\" or \"as we explained above\", the machine can't use it either.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Somut bir örnek. Bir üreticinin ürün sayfasında şu cümle duruyordu: \"Yukarıda anlattığımız avantajları sayesinde bu seri, sektörde en çok tercih edilen modellerden biri.\" Cümle tek başına hiçbir şey söylemiyor — hangi seri, hangi avantaj, hangi sektör, ne kadar çok. Aynı bilgiyi şöyle yazdık: \"Solvent bazlı seri, esnek ambalaj baskısında su bazlı alternatiflere göre daha hızlı kuruduğu için saatte 300 metrenin üzerinde çalışan hatlarda tercih ediliyor.\" İkinci cümle kesilip alındığında hâlâ bir şey öğretiyor. Aradaki fark bilgi farkı değil, biçim farkı.",
          en: "A concrete example. A manufacturer's product page carried this sentence: \"Thanks to the advantages described above, this series is one of the most preferred in the sector.\" On its own it says nothing — which series, which advantages, which sector, how preferred. We rewrote the same information as: \"The solvent-based series dries faster than water-based alternatives in flexible packaging print, which is why it is chosen on lines running above 300 metres per hour.\" The second sentence still teaches something after being cut out. The gap between the two is form, not knowledge.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkinci kural yerleşimle ilgili. Cevabı başlığın hemen altına koyun; ısınma cümleleri ve \"bu yazıda şunları anlatacağız\" tarzı açılışlar hem okuyucuyu hem modeli oyalıyor. Hikâyeyi silmeyin, aşağı alın.",
          en: "The second rule is about placement. Put the answer directly under the heading; warm-up sentences and \"in this article we will cover\" openings stall the reader and the model alike. Don't delete the story — move it further down.",
        },
      },
      {
        type: "h2",
        id: "yapisal-veri-ve-indekslenebilirlik",
        text: {
          tr: "Yapısal veri ve indekslenebilirlik: makinenin okuduğu zemin",
          en: "Structured data and indexability: the ground a machine reads",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yapısal veri (structured data) AI Overviews'a giriş bileti değil; Google ek bir şema şartı olmadığını açıkça söylüyor. Yine de Article ve FAQPage işaretlemesi metnin makine tarafından ayrıştırılmasını kolaylaştırıyor ve maliyeti neredeyse sıfır — bir sayfa yayımlarken zaten doldurduğunuz alanların JSON-LD karşılığını basmaktan ibaret.",
          en: "Structured data is not a ticket into AI Overviews; Google states plainly that no extra schema is required. Article and FAQPage markup still make the text easier for a machine to parse, and the cost is close to zero — it amounts to printing the JSON-LD equivalent of fields you already fill in when publishing a page.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Beklentiyi doğru kurun: Google 2023'te soru-cevap zengin sonuçlarını çoğu site için kapattı, yani sonuç sayfasında rozet görmeyeceksiniz. İşaretlemeyi görsel kazanç için değil, sayfanın yapısını makineye açık etmek için koyuyorsunuz. Bizim kendi sitemizdeki karar da bu: her yazının soru-cevap bölümü sayfada düz metin olarak duruyor, JSON-LD ise aynı metni işaretliyor — iki ayrı sürüm yok.",
          en: "Set the expectation correctly: Google restricted FAQ rich results for most sites in 2023, so you will not see a badge on the results page. You add the markup to declare the page's structure to a machine, not to win pixels. That is the call we made on our own site: the question-and-answer section of every article sits on the page as plain text, and the JSON-LD marks up that same text — there are never two versions.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İndekslenebilirlik tarafında üç şeyi kontrol edin. Birincisi robots.txt: yapay zeka botlarını topluca engelleyen bir kural varsa ne yaptığını bilin — Google-Extended'ı engellemek AI Overviews'u etkilemiyor, çünkü Google onu Gemini uygulaması ve model eğitimi için tanımladı; Googlebot'u engellemek ise hem organik aramayı hem kutuyu bitiriyor. İkincisi render: içerik yalnız tarayıcıda JavaScript çalıştıktan sonra oluşuyorsa risk büyür, metin sunucudan gelen HTML'de görünmeli. Üçüncüsü snippet sınırı: max-snippet ile karakter kısıtı koyduysanız, modelin alabileceği pasajı kendi elinizle daraltıyorsunuz. Bu zeminin bir parçası olan [llms.txt dosyasını ayrı bir yazıda](/yazilar/llms-txt-nedir) ele aldım; faydalı, ama tek başına kutuya sokmuyor.",
          en: "On the indexability side, check three things. First, robots.txt: if a rule blocks AI crawlers wholesale, know what it actually does — blocking Google-Extended does not affect AI Overviews, because Google defined it for the Gemini app and model training, while blocking Googlebot ends both your organic presence and the box. Second, rendering: content that only exists after JavaScript runs in the browser is at risk, and the text should be visible in the HTML the server sends. Third, snippet limits: a max-snippet character cap narrows the passage a model can take, by your own hand. [llms.txt](/yazilar/llms-txt-nedir), one more piece of this ground, has an article of its own; it is useful, and it will not get you into the box on its own.",
        },
      },
      {
        type: "h2",
        id: "sahadan-kanit",
        text: {
          tr: "Sahadan kanıt: bir üreticinin altı ayında ne değişti",
          en: "Proof from the field: what changed in a manufacturer's six months",
        },
      },
      {
        type: "p",
        text: {
          tr: "Buraya kadarki koşulları tek bir sitede aynı anda kurduk. [SIM Baskı Malzemeleri](/vakalar/sim-baski-ihracat-icerigi) 1983'ten beri matbaa sektörüne üretim yapıyor; kırk yıllık teknik bilgisi kimsenin okuyamayacağı bir yerdeydi, satış ekibinin kafasında. Siteyi WordPress'ten Next.js'e taşıdık, beş dilli kurduk ve teknik içeriği baştan soru-cevap düzeninde yazdık: her başlık müşterinin kendi cümlesi, her başlığın altındaki ilk paragraf net cevap, her cevabın içinde ölçü ve rakam.",
          en: "We built every condition above into a single site at once. [SIM Printing Suppliers](/vakalar/sim-baski-ihracat-icerigi) has manufactured for the press industry since 1983, and forty years of technical knowledge lived where nobody could read it: in the heads of the sales team. We moved the site from WordPress to Next.js, built it in five languages and rewrote the technical content in a question-and-answer order from scratch — every heading the customer's own sentence, the first paragraph beneath it a plain answer, every answer carrying a measurement and a number.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Altı ayın sonunda organik trafik 15 katına çıktı, hedef kelimelerde ilk 5'e girdik ve AI motorlarındaki görünürlük sıfırdan 40 bine ulaştı. Rakamdan çok yapının kendisi öğretici: 40 bin, kategori sorulduğunda markanın adının geçtiği yerlerin sayısıydı ve sıfırdan başlamıştı — çünkü öncesinde ortada alıntılanacak tek bir cümle yoktu. Bilgi zaten vardı; yazılı değildi.",
          en: "Six months later organic traffic had grown 15×, priority keywords sat inside the top five, and visibility across AI engines went from zero to 40,000. The structure teaches more than the number: 40,000 counted the places the brand's name appeared when the category came up, and it started at zero — because before that there wasn't a single sentence to cite. The knowledge existed; it just wasn't written down.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sınırı da çizelim. Bu bir garanti değil, bir örüntü: aynı yapıyı kuran her site aynı hızda ilerlemiyor, sektörün rekabeti ve sitenin teknik durumu hızı belirliyor. Ölçülmüş başka örnekleri rakamlarıyla görmek isterseniz [vaka sayfalarımız](/vakalar) açık duruyor.",
          en: "Let's draw the boundary too. This is a pattern, not a guarantee: not every site building the same structure moves at the same speed, and the competition in a sector plus the technical state of the site set the pace. If you want to see other measured examples with their numbers attached, [our case pages](/vakalar) are open.",
        },
      },
      {
        type: "h2",
        id: "nereden-baslanir",
        text: {
          tr: "Google yapay zeka optimizasyonu nereden başlar?",
          en: "Where does optimising for Google's AI answers begin?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Başlangıç noktası içerik üretmek değil, ölçmek. Kendi kategorinizde kutunun hangi sorularda çıktığını ve orada kimin anıldığını bilmeden hangi sayfayı yeniden yazacağınıza karar veremezsiniz. İyi haber şu: bu ölçüm bir araca ihtiyaç duymuyor, kırk dakika sürüyor.",
          en: "The starting point isn't producing content, it's measuring. Until you know which questions produce a box in your category and who gets named inside it, you can't decide which page to rewrite. The good news: that measurement needs no tool and takes about forty minutes.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Alıcınızın satın almadan önce sorduğu on soruyu yazın — sizin kelimelerinizle değil, onların kelimeleriyle. Satış ekibinize son bir ayda en çok neyin sorulduğunu sorun; liste oradan çıkar.",
            en: "Write down the ten questions your buyer asks before buying — in their words, not yours. Ask your sales team what came up most over the last month; the list writes itself.",
          },
          {
            tr: "Her soruyu Google'a sorun ve iki şeyi not edin: kutu çıktı mı, çıktıysa hangi kaynaklar anıldı. On sorunun kaçında kutu çıktığı, kategorinizin yapay zeka aramalarında öne çıkma potansiyelini doğrudan gösterir.",
            en: "Put each question to Google and note two things: did a box appear, and if so, which sources were named. How many of the ten produce a box tells you directly how much your category has riding on AI search.",
          },
          {
            tr: "Kutudaki cümleleri kendi sayfanızdaki karşılığıyla yan yana koyun. Genellikle bilgi eksiği görmezsiniz, biçim farkı görürsünüz: onlarda cevap ilk iki cümlede duruyor, sizde beşinci paragrafta.",
            en: "Place the sentences inside the box next to their equivalent on your own page. You rarely find missing knowledge; you find a difference in form — their answer sits in the first two sentences, yours in the fifth paragraph.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu testin sonunda elinizde bir liste olur ve o liste bir içerik takviminden daha dürüsttür. Tezi tekrar edeyim: Google AI Overviews'da yer almanın garantisi yok, ama olasılığı sistematik olarak artırılabilir — indekslenebilir bir zemin, kesilip alındığında ayakta kalan paragraflar, müşterinin cümlesiyle yazılmış başlıklar ve metnin içine yerleştirilmiş kanıt. Yapay zeka aramalarının bütün resmi — ChatGPT, Perplexity ve ölçüm tarafı — [kanonik GEO rehberinde](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) duruyor. Bu yazı yalnız Google'ın kutusuna baktı, çünkü Türkiye'de alıcınızın hâlâ en çok açtığı arama kutusu o.",
          en: "At the end of that test you hold a list, and that list is more honest than a content calendar. To restate the thesis: there is no guarantee of appearing in Google AI Overviews, but the probability can be raised systematically — an indexable foundation, paragraphs that survive being cut out, headings written in the customer's sentence, and proof placed inside the text. The whole picture of AI search — ChatGPT, Perplexity and the measurement side — sits in [the canonical GEO guide](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz). This article looked at Google's box alone, because in Turkey that is still the search box your buyer opens most.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu test Google'ın kutusuna bakar. Sayfanızın kendisinin AI botlarına açık olup olmadığını, yapısal veri taşıyıp taşımadığını ve soru biçimli başlık oranını [GEO Görünürlük Denetleyicisi](/araclar/geo-gorunurluk-denetleyicisi) ölçer — beş sinyali saniyeler içinde tarayıp yüz puanlık bir skora çevirir.",
          en: "That test looks at Google's box. Whether the page itself is open to AI crawlers, carries structured data and uses question-phrased headings is measured by the [GEO Visibility Checker](/araclar/geo-gorunurluk-denetleyicisi) — it scans five signals within seconds and turns them into a score out of a hundred.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "AI Overview en kısa tanımıyla nedir?",
          en: "What is an AI Overview, in short?",
        },
        answer: {
          tr: "AI Overview, Google'ın arama sonuçlarının en üstünde gösterdiği, birden çok kaynaktan derlenmiş ve bir dil modeli tarafından yazılmış özet yanıttır. Kutunun içinde veya yanında yanıtı besleyen sayfalara bağlantı verilir. Google, özelliğin arkasında Gemini modelinin arama için özelleştirilmiş bir sürümünün çalıştığını açıkladı. Tekil kutuya AI Overview, özelliğin bütününe Google AI Overviews deniyor; her sorguda çıkmaz, açıklama ve karşılaştırma isteyen sorularda çok daha sık görülür.",
          en: "An AI Overview is the summarised answer Google shows at the very top of its search results, assembled from several sources and written by a language model. Links to the pages feeding that answer sit inside or beside the box. Google has said a version of Gemini customised for Search powers the feature. The single box is an AI Overview and the feature as a whole is Google AI Overviews; it does not appear on every query, and explanation or comparison questions trigger it far more often.",
        },
      },
      {
        question: {
          tr: "AI Overview ile öne çıkan snippet arasındaki fark ne?",
          en: "What is the difference between an AI Overview and a featured snippet?",
        },
        answer: {
          tr: "Fark kaynak sayısında ve metnin üretilme biçiminde. Öne çıkan snippet (featured snippet) tek bir sayfadan bir pasajı olduğu gibi alıntılar; alıntılanan cümleleri sitenizde birebir bulabilirsiniz. AI Overview ise birkaç sayfayı okuyup sentezliyor ve yeni bir metin yazıyor, yanında da kısa bir kaynak listesi duruyor. Pratik sonuç şu: snippet'te tek bir yer vardır ve onu kazanırsınız, AI Overview'da üç dört yer vardır ve anılmak için o listeye girmeniz gerekir.",
          en: "The difference lies in the number of sources and in how the text is produced. A featured snippet quotes one passage from one page verbatim, and you can find those exact sentences on the site. An AI Overview reads several pages, synthesises them and writes new text, with a short source list beside it. The practical consequence: a snippet has one slot you either win or lose, while an AI Overview has three or four, and being named means getting onto that list.",
        },
      },
      {
        question: {
          tr: "AI Overviews Türkiye'de çalışıyor mu?",
          en: "Does AI Overviews work in Turkey?",
        },
        answer: {
          tr: "Evet, Türkçe sorgularda düzenli olarak çıkıyor. Google özelliği Mayıs 2024'te duyurdu, önce ABD'de açtı, sonra kapsamı yüzden fazla ülkeye ve çok sayıda dile genişlettiğini açıkladı. Türkçe tarafta kapsam İngilizceden dar: aynı soruyu iki dilde sorduğunuzda İngilizce sonuçlarda kutu daha sık çıkıyor ve daha fazla kaynak anıyor. Bu aynı zamanda geç kalmadığınız anlamına geliyor — Türkçe sonuç sayfasında bu soruların karşılığı hâlâ zayıf.",
          en: "Yes, it appears regularly on Turkish queries. Google announced the feature in May 2024, opened it in the United States first, then said it had extended coverage to more than a hundred countries and a long list of languages. Coverage on the Turkish side is narrower than in English: ask the same question in both and the English results produce a box more often, naming more sources. That also means you are not late — the Turkish results page still answers these questions poorly.",
        },
      },
      {
        question: {
          tr: "AI Overviews'da yer almak için ne yapmam gerekiyor?",
          en: "What do I need to do to appear in AI Overviews?",
        },
        answer: {
          tr: "Google'ın resmi konumu, ayrı bir optimizasyon yöntemi olmadığı ve aramanın temel kurallarının geçerli olduğu yönünde. Sahada kutuya giren sayfaların paylaştığı beş koşul var: Googlebot'un okuyabildiği indekslenebilir bir zemin, sayfadan kesilip alındığında anlamını koruyan paragraflar, müşterinin cümlesiyle yazılmış başlıklar ve altında ilk iki cümlede verilen net cevap, görünür bir güncellik sinyali, metnin içine yerleştirilmiş rakam, tarih ve ölçü. Hiçbiri tek başına garanti değil; hepsi olasılığı artırıyor.",
          en: "Google's official position is that there is no separate optimisation method and that the basic rules of Search apply. In the field, pages that make it into the box share five conditions: an indexable foundation Googlebot can read, paragraphs that keep their meaning when cut out of the page, headings written in the customer's own sentence with a plain answer in the first two sentences beneath, a visible freshness signal, and numbers, dates and measurements written into the text. None guarantees a place; each one raises the odds.",
        },
      },
      {
        question: {
          tr: "AI Overviews sitemin trafiğini düşürür mü?",
          en: "Will AI Overviews reduce my site's traffic?",
        },
        answer: {
          tr: "Bazı sorgularda düşürüyor. Kullanıcı cevabı kutunun içinde bulduğunda alta inmiyor; gösterim aynı kalırken tıklama oranı geriliyor — sıfır tıklama (zero-click) denen düzen bu. Kayıp sorgu tipine göre değişiyor: bilgi soruları en çok, satın alma ve marka soruları en az etkileniyor. Kaybı tamamen telafi eden bir taktik yok. Kutuya girerseniz tıklamayı değil ama anılmayı koruyorsunuz, ve markanın adının cevabın içinde geçmesi satın alma anına kadar taşınıyor.",
          en: "On some queries it does. When the user finds the answer inside the box they don't scroll further, so impressions hold while the click-through rate falls — the pattern the term zero-click describes. The loss varies by query type: informational questions lose the most, purchase and brand queries the least. No tactic replaces that loss entirely. Getting into the box preserves the mention rather than the click, and a brand name inside the answer travels all the way to the buying decision.",
        },
      },
      {
        question: {
          tr: "AI Overviews'da göründüğümü nasıl ölçerim?",
          en: "How do I measure whether I appear in AI Overviews?",
        },
        answer: {
          tr: "Doğrudan bir ölçüm ekranı yok. Google, AI Overviews'dan gelen gösterim ve tıklamaları Search Console'un genel arama raporuna katıyor ve ayrı bir kırılım vermiyor. Pratik yöntem iki adımlı: kutu ürettiğini elle doğruladığınız sorguları listeleyin, sonra o sorguların tıklama oranını önceki dönemle karşılaştırın. Pozisyonunuz sabitken oran düşüyorsa farkı büyük olasılıkla kutu yaratıyor. İkinci katman elle takip: aynı soruları düzenli aralıklarla sorup kimin anıldığını kaydedin.",
          en: "No direct reporting screen exists. Google folds AI Overview impressions and clicks into the general Search performance report in Search Console without a separate breakdown. The practical method has two steps: list the queries you have manually confirmed produce a box, then compare their click-through rate with the previous period. If your position holds while the rate drops, the box is the likely cause. The second layer is manual tracking: ask the same questions at regular intervals and record who gets named.",
        },
      },
      {
        question: {
          tr: "Yapısal veri AI Overviews için zorunlu mu?",
          en: "Is structured data required for AI Overviews?",
        },
        answer: {
          tr: "Zorunlu değil. Google, AI Overviews için ek bir yapısal veri şartı olmadığını açıkça söylüyor. Yine de Article ve FAQPage işaretlemesi metnin makine tarafından ayrıştırılmasını kolaylaştırıyor ve maliyeti neredeyse sıfır. Beklentiyi doğru kurun: Google 2023'te soru-cevap zengin sonuçlarını çoğu site için kapattı, dolayısıyla sonuç sayfasında görsel bir kazanç beklemeyin. İşaretlemeyi sayfanın yapısını makineye açık etmek için koyuyorsunuz, rozet için değil.",
          en: "It is not required. Google states plainly that AI Overviews demand no extra structured data. Article and FAQPage markup still make text easier for a machine to parse, and the cost is close to zero. Set the expectation correctly, though: Google restricted FAQ rich results for most sites in 2023, so expect no visual gain on the results page. You add the markup to declare the page's structure to a machine, not to win a badge.",
        },
      },
      {
        question: {
          tr: "Google-Extended'ı engellersem AI Overviews'dan çıkar mıyım?",
          en: "If I block Google-Extended, do I drop out of AI Overviews?",
        },
        answer: {
          tr: "Çıkmazsınız. Google, Google-Extended'ı Gemini uygulaması ve model eğitimi için tanımladı; aramanın içindeki AI Overviews bu kontrolün kapsamında değil. Kutudan gerçekten çıkmak isterseniz kullanılacak işaretler farklı: nosnippet, max-snippet ve data-nosnippet, arama snippet'lerini etkilediği gibi AI Overviews'u da etkiliyor. Googlebot'u tamamen engellemek ise hem organik aramayı hem kutuyu bitiriyor — bu genellikle istenen sonuç olmuyor.",
          en: "You won't. Google defined Google-Extended for the Gemini app and model training; AI Overviews inside Search sits outside that control. If you genuinely want out of the box, different directives do the job: nosnippet, max-snippet and data-nosnippet affect AI Overviews the same way they affect ordinary search snippets. Blocking Googlebot outright ends both your organic presence and the box, which is rarely the outcome anyone wants.",
        },
      },
      {
        question: {
          tr: "AI Overview'da yer almanın garantisi var mı?",
          en: "Is there any guarantee of appearing in an AI Overview?",
        },
        answer: {
          tr: "Garanti yok, olasılık var. Google hangi sayfanın neden seçildiğini açıklamıyor ve yayımlanmış ayrı bir AI Overviews sıralaması bulunmuyor. Gözlemlenen şu: aynı sorgu farklı günlerde farklı kaynaklar gösterebiliyor, kutu masaüstünde çıkıp mobilde çıkmayabiliyor, bazen tamamen kayboluyor. Kesin sonuç vaat eden herkese temkinli yaklaşın. Yapılabilecek iş, koşulları sistematik olarak kurup kutuya girme olasılığını yükseltmek.",
          en: "There is no guarantee, only probability. Google does not explain why a given page is chosen, and no separate AI Overviews ranking has been published. What we observe: the same query can show different sources on different days, the box can appear on desktop and not on mobile, and sometimes it vanishes altogether. Treat anyone promising a fixed outcome with caution. The work available is building the conditions systematically and raising the odds of being included.",
        },
      },
      {
        question: {
          tr: "Google yapay zeka optimizasyonu ile SEO aynı şey mi?",
          en: "Is optimising for Google's AI answers the same as SEO?",
        },
        answer: {
          tr: "Aynı değil, ama ayrı da değil. SEO sıralama için çalışır: amaç kullanıcının sonuç listesinde sizi görüp tıklamasıdır. Google yapay zeka optimizasyonu aynı sayfanın kutunun içinde kaynak olarak anılması için çalışır; kullanıcı hiç tıklamasa bile markanızın adı cevapta geçer. İkisi katmanlıdır: teknik sağlık, hız ve indekslenebilirlik olmadan kutuda zaten görünemezsiniz. Farklı olan, içeriğin biçimi ve neyin ölçüldüğü.",
          en: "Not the same, but not separate either. SEO works for ranking: the goal is that a user sees you in the list and clicks through. Optimising for Google's AI answers works for citation: the same page gets named inside the box, so your brand appears in the answer even when nobody clicks. The two are layered — without technical health, speed and indexability you cannot appear in the box at all. What differs is the shape of the content and what you measure.",
        },
      },
      {
        question: {
          tr: "AI Overview her sorguda çıkıyor mu?",
          en: "Does an AI Overview appear on every query?",
        },
        answer: {
          tr: "Her sorguda çıkmıyor ve bu, içerik planınızın en kullanışlı girdisi. Açıklama isteyen, karşılaştırma içeren ve birden çok adımı olan sorular kutuyu daha sık tetikliyor. Marka aramaları, gezinme sorguları ve tek kesin cevabı olan kısa sorgular çoğunlukla tetiklemiyor. Sağlık, finans ve hukuk gibi hassas alanlarda kutu daha seyrek çıkıyor; Google bu alanlarda daha temkinli davrandığını söylüyor. Ticari kelimeniz kutu üretmiyorsa çalışacağınız yer, o kelimenin etrafındaki sorulardır.",
          en: "It does not, and that is the most useful input to a content plan. Questions asking for an explanation, a comparison or several steps trigger the box far more often. Brand searches, navigational queries and short questions with one definite answer usually do not. In sensitive fields such as health, finance and law the box appears less often, and Google says it is deliberately more cautious there. If your commercial keyword produces no box, the work sits in the questions surrounding it.",
        },
      },
    ],
    category: "growth",
    topic: "geo",
    tags: ["geo", "ai-overviews", "ai-seo", "icerik-stratejisi"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-08-28",
    readingMinutes: 12,
    seo: {
      title: {
        tr: "Google AI Overviews'da yer almak: rehber",
        en: "How to appear in Google AI Overviews",
      },
      description: {
        tr: "AI Overview nedir, Google hangi sorgularda gösteriyor, tıklamaya ne oluyor? Yanıtın içine giren sayfaların beş ortak koşulu ve sahadan ölçülmüş rakamlar.",
        en: "What is an AI Overview, which queries trigger it, and what happens to your clicks? The five conditions shared by pages Google names inside the answer.",
      },
    },
  },
  {
    slug: {
      tr: "llms-txt-nedir",
      en: "what-is-llms-txt",
    },
    title: {
      tr: "llms.txt: henüz kimsenin okumadığı, yine de yazmaya değer dosya",
      en: "llms.txt: the file nobody reads yet, and still worth writing",
    },
    excerpt: {
      tr: "Sitenizin kökündeki /llms.txt adresi çoğu sitede 404 döner. Dosyanın ne yaptığını, hangi motorun okuyup okumadığını ve kendi sitemizde onu içerik katmanından nasıl türettiğimizi anlatıyorum — sıralama vaadi olmadan.",
      en: "On most sites, /llms.txt returns a 404. Here is what the file does, which engines actually read it, and how we generate ours straight from the content layer — with no ranking promises attached.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Sitenizin kökündeki /llms.txt adresini açmak on saniye sürüyor. Çoğu sitede o adres 404 döner. Ardından gelen soru hep aynı oluyor: bu dosyayı eklersek ChatGPT bizi anar mı? Dürüst cevap hayır. Ama sorunun nerede yanlış kurulduğunu göstermek, dosyayı tarif etmekten daha faydalı — çünkü llms.txt bir sıralama kaldıracı değil, bir okunabilirlik kararı.",
          en: "Opening /llms.txt on your own domain takes ten seconds. On most sites it returns a 404. The question that follows is always the same: if we add this file, will ChatGPT start citing us? The honest answer is no. But showing where the question goes wrong is more useful than describing the file — because llms.txt is not a ranking lever, it is a readability decision.",
        },
      },
      {
        type: "h2",
        id: "llms-txt-nedir",
        text: {
          tr: "llms.txt nedir?",
          en: "What is llms.txt?",
        },
      },
      {
        type: "p",
        text: {
          tr: "llms.txt, bir sitenin kökünde duran ve o sitenin içeriğini dil modellerine sade metinle haritalayan bir dosya önerisidir. Adresi sabittir: alanadiniz.com/llms.txt. Biçimi markdown'dır — tek bir H1 başlık, bir cümlelik tanım, sonra bölüm başlıkları altında bağlantı listeleri. Öneriyi Eylül 2024'te Jeremy Howard ortaya attı; teknik tanımı llmstxt.org'da duruyor ve bugüne kadar resmî bir standart kurumu tarafından onaylanmadı.",
          en: "llms.txt is a proposed file that sits at the root of a site and hands language models a plain-text map of its content. The address is fixed: yourdomain.com/llms.txt. The format is markdown — a single H1, a one-sentence definition, then lists of links under section headings. Jeremy Howard put the proposal forward in September 2024; the technical definition lives at llmstxt.org and no standards body has ratified it to date.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ne olmadığını söylemek daha kolay. robots.txt bir izin dosyasıdır: hangi yolun taranmayacağını söyler. sitemap.xml bir envanterdir: her URL'i sayar, hiçbirinin ne anlattığını söylemez. llms.txt üçüncü bir iş yapar — hangi sayfaların önemli olduğunu ve her birinin neyi cevapladığını tek satırda anlatır. Fark burada: makine için yazılmış bir içindekiler sayfası.",
          en: "It is easier to say what it is not. robots.txt is a permission file: it states which paths must not be crawled. sitemap.xml is an inventory: it lists every URL and says nothing about what any of them contain. llms.txt does a third job — it names the pages that matter and, in one line each, what question they answer. That is the difference: a table of contents written for a machine.",
        },
      },
      {
        type: "h2",
        id: "neden-ortaya-cikti",
        text: {
          tr: "Bu dosya neden ortaya çıktı?",
          en: "Why did this file appear?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İki teknik kısıt yüzünden. Birincisi: yapay zeka tarayıcılarının (AI crawler) çoğu JavaScript çalıştırmıyor; içeriği tarayıcı tarafında derlenen bir sayfa onlara boş bir kabuk olarak gidiyor. İkincisi: bir dil modelinin bağlam penceresi (context window) sınırlı; modelin sitenizi okumak için harcayacağı bütçe menülerle, çerez uyarılarıyla, footer bağlantılarıyla ve tekrarlanan şablon metinle eriyor.",
          en: "Two technical constraints. First: most AI crawlers do not execute JavaScript, so a page whose content is assembled in the browser arrives at them as an empty shell. Second: a language model's context window is finite, and the budget it can spend reading your site drains into menus, cookie notices, footer links and repeated boilerplate.",
        },
      },
      {
        type: "p",
        text: {
          tr: "llms.txt iki kısıtı da tek hamlede geçiyor. Dosya sade metin olduğu için JavaScript'e ihtiyaç duymuyor; kısa olduğu için bağlam penceresinde yer kaplamıyor. HTML tarayıcı için yazılır, markdown okumak için — ve bir modelin sayfanızda yaptığı iş, aslında okumaktan ibaret.",
          en: "llms.txt clears both in one move. Being plain text, it needs no JavaScript; being short, it barely dents the context window. HTML is written for a browser and markdown is written for reading — and reading is the only thing a model actually does on your page.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kısıtın kendisi yeni değil. Yeni olan, o kısıtla karşılaşan tarafın artık bir kullanıcı değil bir program olması. Bu yüzden yapay zeka arama optimizasyonu tartışması hız ve indekslenebilirlikten sonra üçüncü bir başlık açtı: makine sayfanızdan ne çıkarabiliyor?",
          en: "The constraint itself is not new. What is new is that the party running into it is a program rather than a person. That is why the AI search optimisation conversation opened a third front after speed and indexability: what can the machine actually extract from your page?",
        },
      },
      {
        type: "h2",
        id: "dosya-bicimi",
        text: {
          tr: "Dosyanın biçimi: markdown bağlantı listesi",
          en: "The format: a markdown list of links",
        },
      },
      {
        type: "p",
        text: {
          tr: "Biçim kasıtlı olarak dar tutulmuş. llmstxt.org tek bir düzen tarif ediyor ve dosyanın sırtını beş öğe taşıyor:",
          en: "The format is deliberately narrow. llmstxt.org describes a single layout, and five elements carry the whole file:",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Tek bir H1: sitenin veya kurumun adı. Belgede ikinci bir H1 bulunmaz.",
            en: "One H1: the name of the site or the organisation. No second H1 appears in the document.",
          },
          {
            tr: "H1'in altında, blok alıntı biçiminde tek cümlelik tanım: kurum ne yapar, kime çalışır.",
            en: "Directly beneath it, a one-sentence definition as a blockquote: what the organisation does and who it works for.",
          },
          {
            tr: "H2 başlıklarıyla bölümler: hizmetler, ürünler, dokümantasyon, vakalar, iletişim. Bölüm adları serbesttir.",
            en: "Sections marked by H2 headings: services, products, documentation, case studies, contact. Section names are free-form.",
          },
          {
            tr: "Her bölümün altında bağlantı satırları — köşeli parantezde sayfa adı, parantezde tam URL, iki noktadan sonra tek cümlelik açıklama. Açıklama isteğe bağlı, ama dosyanın asıl değeri orada.",
            en: "Link lines under each section — page name in square brackets, full URL in parentheses, a one-sentence description after a colon. The description is optional, and it is where the file's value actually sits.",
          },
          {
            tr: "İsteğe bağlı bir Optional bölümü: bağlam daraldığında modelin atlayabileceği ikincil bağlantılar.",
            en: "An optional Optional section: secondary links the model can skip when context runs short.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "URL'ler mutlak olmalı. Göreli yol veren bir dosya, kendi sitesinin dışına çıkarıldığı anda anlamını kaybediyor — ve bir modelin dosyayı okuduğu yer neredeyse hiçbir zaman sizin siteniz değil.",
          en: "URLs must be absolute. A file with relative paths loses its meaning the moment it leaves its own site — and the place a model reads your file is almost never your site.",
        },
      },
      {
        type: "h2",
        id: "llms-full-txt-farki",
        text: {
          tr: "llms.txt ile llms-full.txt farkı ne?",
          en: "What is the difference between llms.txt and llms-full.txt?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkisi arasındaki iş bölümü net: llms.txt bir harita, llms-full.txt bir döküm. Harita modeli doğru URL'e yollar ve birkaç kilobayt tutar. Döküm, sayfaların gövde metnini tek dosyada taşır ve yüz kilobaytları bulabilir; amacı, modelin siteyi hiç gezmeden sizi doğru anlatabilmesi.",
          en: "The division of labour is clear: llms.txt is a map, llms-full.txt is an export. The map routes the model to the right URL and weighs a few kilobytes. The export carries the body text of those pages in one file and can run into hundreds of kilobytes; its purpose is to let a model describe you accurately without crawling the site at all.",
        },
      },
      {
        type: "p",
        text: {
          tr: "llms-full.txt orijinal önerinin çekirdeğinde yoktu; dokümantasyon araçlarının pratiğinden çıkıp yaygınlaştı. Büyük olması otomatik olarak iyi değil: bağlam penceresini aşan bir dosya kırpılır ve hangi yarısının kırpıldığına siz karar veremezsiniz. Pratik kural, ikisini birlikte yayımlamak ve dökümü gerçekten alıntılanmasını istediğiniz içerikle sınırlamak.",
          en: "llms-full.txt was not part of the original proposal's core; it grew out of documentation tooling and spread from there. Bigger is not automatically better: a file that exceeds the context window gets truncated, and you do not get to choose which half survives. The practical rule is to publish both and to keep the export limited to content you genuinely want quoted.",
        },
      },
      {
        type: "h2",
        id: "motorlar-okuyor-mu",
        text: {
          tr: "Arama motorları bu dosyayı gerçekten okuyor mu?",
          en: "Do search engines actually read this file?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün itibarıyla hiçbir büyük arama motoru veya model sağlayıcısı llms.txt'i resmî olarak desteklediğini duyurmadı. Google tarafındaki açıklamalar dosyanın sıralamada kullanılmadığı yönünde; OpenAI, Anthropic ve Perplexity de bir destek beyanı yayımlamış değil. Size aksini söyleyen bir ajansa kaynağını sorun.",
          en: "As things stand, no major search engine or model provider has announced official support for llms.txt. Statements from Google's side indicate the file plays no part in ranking, and neither OpenAI, Anthropic nor Perplexity has published a declaration of support. If an agency tells you otherwise, ask them for the source.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yayımlayan taraf ise hızla büyüyor. Geliştirici dokümantasyonu yayımlayan şirketler dosyayı fiilen standart hâline getirdi, dokümantasyon platformlarının çoğu llms.txt ve llms-full.txt'i otomatik üretiyor. Dosya bu yüzden bir asimetride duruyor: yazan çok, resmen okuduğunu söyleyen yok. Asimetrinin kalıcı olacağını varsaymak için de bir sebep yok — bir motor desteği duyurduğu gün, dosyası hazır olan taraf hiçbir şey yapmak zorunda kalmaz.",
          en: "On the publishing side, though, adoption is moving fast. Companies that ship developer documentation have made the file a de facto standard, and most documentation platforms now generate llms.txt and llms-full.txt automatically. The file therefore sits in an asymmetry: plenty of sites write it, none of the engines admit to reading it. There is also no reason to assume the asymmetry is permanent — on the day an engine announces support, whoever already has the file does nothing at all.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dosyanın bugün karşılık bulduğu yer başka: kullanıcı isteğiyle canlı sayfa çeken ajanlar. ChatGPT-User, Claude-User ve Perplexity-User gibi tarayıcılar bir soruya cevap verirken URL'i o an çekiyor, ve kökte duran sade bir harita otuz sayfalık bir HTML'den daha hızlı işleniyor. Aynı dosya kod ve dokümantasyon asistanlarının, kendi kurduğunuz sohbet asistanının ve içeriğinizi besleyen her erişim tabanlı kurulumun da işine yarıyor.",
          en: "Where the file does land today is elsewhere: agents that fetch live pages on a user's request. Crawlers like ChatGPT-User, Claude-User and Perplexity-User pull the URL at the moment they answer, and a clean map at the root is processed faster than thirty pages of HTML. The same file serves coding and documentation assistants, the chat assistant you build yourself, and any retrieval setup feeding on your content.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Karar çerçevesi bu yüzden basit: maliyeti bir saat, riski neredeyse sıfır — dosya zaten herkese açık sayfaları listeliyor, yeni hiçbir şeyi ifşa etmiyor. Getirisi ise belirsiz ama pozitif. Bir çeyreklik yol haritasına konacak iş değil; bir öğleden sonra kapanacak iş.",
          en: "Which makes the decision frame simple: it costs an hour, the risk is close to zero — the file lists pages that are already public and exposes nothing new — and the return is uncertain but positive. This is not work for a quarterly roadmap. It is work for an afternoon.",
        },
      },
      {
        type: "h2",
        id: "nasil-hazirlanir",
        text: {
          tr: "llms txt dosyası adım adım nasıl hazırlanır?",
          en: "How do you write an llms txt file, step by step?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Altı adımlık bir iş. Dosyayı elle yazmak mümkün, ama ilk kararı doğru vermek sonrakileri kolaylaştırıyor: bu dosya kime, hangi soruyu cevaplasın diye yazılıyor?",
          en: "It is a six-step job. Writing the file by hand is possible, but getting the first decision right makes the rest easier: who is this file for, and which question should it answer?",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Alıcıyı tanımlayın. Model sizi neyle anmalı — hizmetlerinizle mi, teknik dokümantasyonunuzla mı, vakalarınızla mı? Dosyanın bölümleri bu cevaptan çıkar.",
            en: "Define the reader. What should a model name you for — your services, your technical documentation, your case studies? The file's sections follow from that answer.",
          },
          {
            tr: "Sayfaları seçin. Sitenizin tamamını değil, bir modelin sizi doğru anlatması için gereken yirmi-kırk sayfayı listeleyin. Envanteri sitemap zaten veriyor; burada seçim yapıyorsunuz.",
            en: "Choose the pages. Not the whole site — list the twenty to forty pages a model needs in order to describe you correctly. The sitemap already provides the inventory; here you are making a selection.",
          },
          {
            tr: "Her satıra bir cümlelik açıklama yazın. Sayfa başlığını tekrar etmeyin; sayfanın hangi soruyu cevapladığını yazın.",
            en: "Write a one-sentence description on every line. Do not repeat the page title; state which question the page answers.",
          },
          {
            tr: "Tanım cümlesini yazın. H1'in altındaki tek cümle, modelin sizi tarif ederken kullanacağı cümledir. Kendi hakkınızda okumak istediğiniz cümleyi yazın.",
            en: "Write the definition sentence. The single line under the H1 is the sentence a model will reach for when it describes you. Write the sentence you would want to read about yourself.",
          },
          {
            tr: "Dosyayı içerik kaynağından türetin. Elle yazılan bir liste ilk slug değişikliğinde eskir ve kimse fark etmez.",
            en: "Generate the file from your content source. A hand-written list goes stale at the first slug change, and nobody notices.",
          },
          {
            tr: "Yayımlayın ve doğrulayın. İçerik tipi text/markdown veya text/plain olmalı; tarayıcıda indirme başlatan bir dosya yanlış başlıkla sunuluyordur. Çok dilli bir siteniz varsa her dilin kendi sürümünü verin.",
            en: "Publish it and verify it. The content type should be text/markdown or text/plain; a file that triggers a download in the browser is being served with the wrong header. If your site is multilingual, give every language its own version.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Yedinci bir adım yok. Dosya yayına girdikten sonra kalan iş içeriğin kendisini alıntılanabilir hâle getirmek, ve llms.txt o işin yerine geçmiyor.",
          en: "There is no seventh step. Once the file is live, the remaining work is making the content itself quotable, and llms.txt does not stand in for that.",
        },
      },
      {
        type: "h2",
        id: "kendi-uygulamamiz",
        text: {
          tr: "Kendi sitemizde llms.txt'i nasıl kurduk?",
          en: "How did we build llms.txt on our own site?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu sitede dört dosya yayımlanıyor: /llms.txt, /tr/llms.txt, /en/llms.txt ve /llms-full.txt. Hiçbirinin içinde elle yazılmış bir bağlantı satırı yok. Hepsi içerik katmanından — hizmet, vaka, paket, yazı ve danışman kayıtlarından — derleniyor, derleme sırasında statik dosyaya dönüşüyor ve text/markdown içerik tipiyle sunuluyor. Hiçbiri istek anında hesaplanmıyor.",
          en: "Four files are published on this site: /llms.txt, /tr/llms.txt, /en/llms.txt and /llms-full.txt. None of them contains a hand-written link line. All four are assembled from the content layer — the service, case, package, article and consultant records — turned into static files at build time and served as text/markdown. None of them is computed per request.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kararın gerekçesi bakım. Bir slug değiştiğinde elle yazılmış bir llms.txt sessizce eskir: dosya hâlâ 200 döner, içindeki bağlantılar 404 verir ve bunu ilk fark eden taraf okurunuz olmaz. Bağlantı satırlarını içerik nesnelerinden ürettiğimiz için o senaryo mümkün değil — hizmet URL'i hizmetin kendi slug alanından, vaka URL'i vakanın slug alanından geliyor. Alan adı da sabit yazılmıyor, tek bir site adresi sabitinden okunuyor.",
          en: "The reason is maintenance. When a slug changes, a hand-written llms.txt goes stale silently: the file still returns 200, the links inside it return 404, and your reader is not the first to notice. Because the link lines are produced from the content objects, that scenario cannot occur — a service URL comes from the service's own slug field, a case URL from the case's. The domain is not hard-coded either; it is read from a single site-address constant.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dosyanın bugünkü içeriği: üç disiplin altında 12 hizmet, 9 vaka çalışması, yayındaki her yazı, iletişim ve beş kaynak sayfası — Türkçe sürümde kırkı aşan bağlantı, her biri tek cümlelik açıklamasıyla. Kök /llms.txt iki dili tek belgede birleştiriyor, Türkçe bölüm önde, bir ayırıcıdan sonra İngilizce bölüm geliyor. Tek dilli sürümler karşı dile hiçbir bağlantı taşımıyor, çünkü tek dilli bir dosyanın işi kendi dilinin haritasını vermek.",
          en: "What the file holds today: 12 services across three disciplines, 9 case studies, every published article, contact details and five resource pages — over forty links in the Turkish version, each with its own one-sentence description. The root /llms.txt merges both languages into one document, Turkish first, English after a separator. The single-language versions carry no links to the other language, because a single-language file's job is to map its own language.",
        },
      },
      {
        type: "p",
        text: {
          tr: "/llms-full.txt daha ileri gidiyor: her hizmetin kapsamı ve kapsam dışı maddeleri, dört paketin süresi ve üç para birimindeki sabit fiyatı, dokuz vakanın problem-yaklaşım-sonuç anlatısı ve metrikleri bağlamıyla birlikte. SIM Baskı Malzemeleri satırında 15 katlık organik trafik artışı, yanında \"6 ayda; yeniden platform ve içerik programıyla\" notuyla duruyor. Rakamı bağlamsız basmıyoruz — bir model onu alıntılayacaksa çerçevesiyle alıntılasın.",
          en: "/llms-full.txt goes further: the scope and out-of-scope lines of every service, the duration and fixed price in three currencies for four packages, and the problem-approach-outcome narrative of nine case studies with their metrics attached to context. On the SIM Printing Suppliers line, the 15× lift in organic traffic sits next to the note \"in 6 months; via replatforming and the content programme\". We never print a number without its frame — if a model is going to quote it, it should quote the frame too.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu dosyaların [SIM Baskı Malzemeleri vakasındaki](/vakalar/sim-baski-ihracat-icerigi) sonuçları ürettiğini iddia etmiyoruz. Orada organik trafiğin altı ayda 15 katına çıkması ve AI motorlarındaki görünürlüğün sıfırdan 40 bine ulaşması, sitenin beş dilli olarak yeniden kurulmasından ve içeriğin soru-cevap mimarisiyle yazılmasından geldi. llms.txt o işin dipnotu, kaldıracı değil. Sıralama bilinçli: önce içerik, sonra harita.",
          en: "We do not claim these files produced the results in the [SIM Printing Suppliers case](/vakalar/sim-baski-ihracat-icerigi). There, organic traffic growing 15× in six months and visibility in AI engines going from zero to 40,000 came from rebuilding the site in five languages and writing the content on a question-and-answer architecture. llms.txt is a footnote to that work, not its lever. The order is deliberate: content first, map second.",
        },
      },
      {
        type: "h2",
        id: "ai-crawler-robots",
        text: {
          tr: "AI crawler'lara robots.txt'te ne demeli?",
          en: "What should robots.txt say to AI crawlers?",
        },
      },
      {
        type: "p",
        text: {
          tr: "llms.txt'in okunabilmesi için sitenin o tarayıcıya açık olması gerekiyor, ve bu karar robots.txt'te veriliyor. Bizim robots dosyamız on AI crawler'ı adıyla listeliyor ve hepsine Allow veriyor: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended ve CCBot.",
          en: "For llms.txt to be read at all, the site has to be open to that crawler, and robots.txt is where the decision gets made. Our robots file names ten AI crawlers explicitly and allows every one of them: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended and CCBot.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Erişim zaten yıldız bloğunun altında açıktı; adları tek tek yazmanın sebebi niyeti okunur kılmak. Ama teknik bir tuzak var: robots.txt'te en özgül user-agent bloğu kazanır, yani adı geçen bir bot yıldız bloğunu hiç okumaz. Uygulama, yönetim ve API yollarını kapatan kısıt listesini her blokta tekrar etmezseniz, adını yazdığınız tarayıcılara herkesten geniş erişim vermiş olursunuz. Biz aynı kısıt listesini on bir bloğun hepsinde tekrar ediyoruz.",
          en: "Access was already open under the wildcard block; naming each crawler is about making the intent legible. There is a trap in the mechanics, though: in robots.txt the most specific user-agent block wins, so a named bot never reads the wildcard block at all. If you do not repeat the disallow list covering app, admin and API paths inside every block, the crawlers you named end up with broader access than everyone else. We repeat the same disallow list across all eleven blocks.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir ayrıntı daha: üretim dışı ortamlar tüm tarayıcılara Disallow: / döndürüyor. Ön izleme alan adının indekslenmesi kanonik sürümle çakışır, ve bu, iyi kurulmuş bir GEO çalışmasını sessizce bozan hatalardan biri.",
          en: "One more detail: non-production environments return Disallow: / to every crawler. An indexed preview domain competes with the canonical version, and that is one of the faults that quietly undoes an otherwise well-built GEO programme.",
        },
      },
      {
        type: "h2",
        id: "sik-hatalar",
        text: {
          tr: "En sık yapılan hatalar neler?",
          en: "What are the most common mistakes?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dosyayı yayımlamak kolay, yanlış yayımlamak da öyle. Sahada tekrarlayan beş hata var.",
          en: "Publishing the file is easy, and so is publishing it wrong. Five mistakes recur in the field.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Sitemap kopyası yayımlamak. Açıklamasız bir URL listesi zaten sitemap.xml'de duruyor; llms.txt'in tek katkısı o açıklamalar.",
            en: "Publishing a copy of the sitemap. A list of URLs without descriptions already exists in sitemap.xml; the descriptions are llms.txt's only contribution.",
          },
          {
            tr: "Elle yazıp unutmak. Altı ay sonra dosyada sitede olmayan sayfalar, sitede dosyada olmayan başlıklar kalır.",
            en: "Writing it by hand and forgetting it. Six months on, the file lists pages the site no longer has, and the site has pages the file never heard of.",
          },
          {
            tr: "Yanlış içerik tipiyle sunmak. text/html olarak dönen bir llms.txt, markdown bekleyen tarafta işlenmez.",
            en: "Serving it with the wrong content type. An llms.txt returned as text/html is not processed by anything expecting markdown.",
          },
          {
            tr: "Çok dilli sitede tek dil yayımlamak. İngilizce sayfalarınız modelin haritasında hiç görünmez.",
            en: "Publishing one language on a multilingual site. Your English pages simply never appear on the model's map.",
          },
          {
            tr: "Dosyayı sıralama vaadi sanmak. llms.txt kimseyi kaynak göstermeye ikna etmiyor; içeriğin kendisi ikna ediyor — [Google AI Overviews'da yer almak](/yazilar/google-ai-overviews-da-yer-almak) bunun kendi başına bir iş kalemi.",
            en: "Mistaking the file for a ranking promise. llms.txt persuades nobody to cite you; the content does that — and [appearing in Google AI Overviews](/yazilar/google-ai-overviews-da-yer-almak) is a line of work in its own right.",
          },
        ],
      },
      {
        type: "h2",
        id: "bu-hafta-hangi-test",
        text: {
          tr: "Bu hafta hangi testi yapabilirsiniz?",
          en: "Which test can you run this week?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Tez şu: llms.txt sıralama kazandırmaz, ama okunabilirlik borcunuzu görünür kılar. Dosyayı hazırlarken kendinize sorduğunuz \"bir model beni hangi kırk sayfayla doğru anlatır\" sorusu çoğu sitede yılda bir kez bile sorulmuyor, ve asıl kazanç o sorunun cevabında.",
          en: "The thesis: llms.txt wins you no ranking, but it makes your readability debt visible. The question you ask while assembling it — which forty pages would let a model describe me correctly — goes unasked for years on most sites, and the real gain is in the answer.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün yapabileceğiniz somut test iki dakika sürüyor. Tarayıcınıza kendi alan adınızı, sonuna da /llms.txt yazın. 404 alıyorsanız, dosyayı kurmadan önce ikinci soruyu sorun: kurulsaydı içine hangi sayfaları koyardınız ve her birinin yanına ne yazardınız? O listeyi çıkarmakta zorlanıyorsanız sorun dosyada değil, sitenin kendini anlatma biçiminde. Aynı testi bir de rakibinizin alan adında yapın; kimin ne kadar hazırlandığını on saniyede görürsünüz.",
          en: "The concrete test you can run today takes two minutes. Type your own domain into the address bar and add /llms.txt. If you get a 404, ask the second question before you build the file: which pages would you put in it, and what would you write beside each one? If that list is hard to produce, the problem is not the file — it is how the site explains itself. Then run the same test on a competitor's domain; ten seconds shows you who has done the work.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Listeyi çıkardıktan sonra sıradaki iş içeriğin kendisi. [Yapay zeka aramalarında öne çıkma rehberi](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) o kısmı adım adım anlatıyor; kurulmuş hâlinin rakamları da [vaka sayfalarımızda](/vakalar) duruyor.",
          en: "Once the list exists, the next job is the content itself. [Our guide to standing out in AI search](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz) walks through that part step by step, and the numbers from where it has been built sit on [our case pages](/vakalar).",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu iki dakikalık test yalnız llms.txt'in var olup olmadığını gösterir; [GEO Görünürlük Denetleyicisi](/araclar/geo-gorunurluk-denetleyicisi) aynı dosyayı biçim açısından da okur ve onu AI erişimi, yapısal veri, dil sinyalleri ve soru başlıklarıyla birlikte tek bir skora toplar.",
          en: "That two-minute test only shows whether llms.txt exists; the [GEO Visibility Checker](/araclar/geo-gorunurluk-denetleyicisi) also reads the file's format and rolls it into one score together with AI access, structured data, language signals and question headings.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "llms.txt en kısa tanımıyla nedir?",
          en: "What is llms.txt, in short?",
        },
        answer: {
          tr: "llms.txt, bir sitenin kök dizininde duran ve içeriğini dil modellerine sade metin biçiminde haritalayan bir dosya önerisidir. Markdown yazılır: tek bir H1 başlık, bir cümlelik kurum tanımı, sonra bölüm başlıkları altında sayfa adı, tam URL ve tek cümlelik açıklama taşıyan bağlantı satırları. Öneri Eylül 2024'te Jeremy Howard tarafından ortaya atıldı ve teknik tanımı llmstxt.org'da yayımlanıyor. Resmî bir standart değil, yaygınlaşmış bir sözleşme.",
          en: "llms.txt is a proposed file that sits in a site's root directory and maps its content for language models in plain text. It is written in markdown: a single H1, a one-sentence definition of the organisation, then link lines under section headings carrying a page name, a full URL and a one-sentence description. Jeremy Howard put the proposal forward in September 2024 and the technical definition is published at llmstxt.org. It is not an official standard but a convention that spread.",
        },
      },
      {
        question: {
          tr: "llms.txt nasıl hazırlanır?",
          en: "How do you prepare an llms.txt file?",
        },
        answer: {
          tr: "Altı adım var. Önce dosyanın kime yazıldığına karar verin: model sizi hizmetlerinizle mi, dokümantasyonunuzla mı, vakalarınızla mı anmalı. Sonra sitenizin tamamını değil, sizi doğru anlatan yirmi-kırk sayfayı seçin. Her bağlantıya sayfa başlığını tekrar etmeyen, sayfanın hangi soruyu cevapladığını söyleyen bir cümle yazın. H1 altındaki tanım cümlesini kendi hakkınızda okumak istediğiniz cümle olarak kurun. Dosyayı elle değil içerik kaynağınızdan türetin. Son adım yayın ve doğrulama: içerik tipi text/markdown olmalı.",
          en: "Six steps. Decide who the file is for: should a model name you for your services, your documentation or your case studies. Then select not the whole site but the twenty to forty pages that describe you correctly. Give every link a sentence that states which question the page answers rather than repeating its title. Compose the definition line under the H1 as the sentence you would want read about yourself. Generate the file from your content source rather than typing it. Finally publish and verify: the content type should be text/markdown.",
        },
      },
      {
        question: {
          tr: "llms.txt ile llms-full.txt arasındaki fark ne?",
          en: "How do llms.txt and llms-full.txt differ in practice?",
        },
        answer: {
          tr: "İş bölümü net: biri harita, diğeri döküm. llms.txt yalnızca bağlantı ve tek cümlelik açıklama taşır, birkaç kilobayttır ve modeli doğru URL'e yollar. llms-full.txt sayfaların gövde metnini tek dosyada toplar, yüz kilobaytları bulabilir ve amacı modelin siteyi hiç gezmeden sizi doğru anlatabilmesidir. Büyük dosya otomatik olarak iyi değil — bağlam penceresini aşan bir döküm kırpılır ve hangi bölümün düştüğüne siz karar veremezsiniz.",
          en: "The division of labour is clear: one is a map, the other an export. llms.txt carries only links and one-line descriptions, weighs a few kilobytes, and routes the model to the right URL. llms-full.txt gathers the body text of those pages into one file, can run into hundreds of kilobytes, and exists so a model can describe you accurately without crawling. A larger file is not automatically better — an export that exceeds the context window gets truncated, and you do not choose which part is dropped.",
        },
      },
      {
        question: {
          tr: "llms.txt SEO'ya yarar mı, sıralamayı etkiler mi?",
          en: "Does llms.txt help SEO or affect rankings?",
        },
        answer: {
          tr: "Doğrudan bir etkisi yok. Hiçbir büyük arama motoru dosyayı sıralama sinyali olarak kullandığını duyurmadı, Google tarafındaki açıklamalar da aksi yönde. Dosyayı eklemek klasik SEO metriklerinizde bir hareket yaratmaz. Buna rağmen eklemeye değer olmasının sebebi maliyet dengesi: bir saatlik iş, sıfıra yakın risk, belirsiz ama pozitif getiri. Sıralama beklentisiyle yaklaşan herkes hayal kırıklığına uğrar; okunabilirlik disiplini olarak yaklaşan kazanır.",
          en: "There is no direct effect. No major search engine has announced using the file as a ranking signal, and statements from Google point the other way. Adding it will not move your classic SEO metrics. What still makes it worth doing is the cost balance: an hour of work, near-zero risk, an uncertain but positive return. Anyone approaching it expecting rankings will be disappointed; anyone approaching it as a readability discipline gains something.",
        },
      },
      {
        question: {
          tr: "ChatGPT llms.txt dosyasını okuyor mu?",
          en: "Does ChatGPT read the llms.txt file?",
        },
        answer: {
          tr: "Kısmen, ve resmî bir taahhüt olmadan. OpenAI llms.txt desteğini duyurmuş değil; dolayısıyla eğitim veya indeksleme tarafında dosyanın işlendiğini varsaymak yanlış olur. Ama kullanıcı bir bağlantıyı sorduğunda sayfayı o an çeken ChatGPT-User gibi ajanlar kökteki sade metni işleyebiliyor, ve bu dosya otuz sayfalık bir HTML'den hızlı okunuyor. Pratikte kazanç, eğitim verisine girmekten çok canlı çekimlerde doğru anlaşılmak.",
          en: "Partly, and without any formal commitment. OpenAI has not announced support for llms.txt, so assuming the file is processed on the training or indexing side would be wrong. But agents such as ChatGPT-User, which fetch a page at the moment a user asks about it, can process plain text at the root, and that reads faster than thirty pages of HTML. In practice the gain lies in being understood correctly during live fetches rather than in entering training data.",
        },
      },
      {
        question: {
          tr: "llms.txt dosyası nereye konur?",
          en: "Where does the llms.txt file go?",
        },
        answer: {
          tr: "Sitenin kök dizinine, robots.txt ile aynı seviyeye: alanadiniz.com/llms.txt. Alt klasörde duran bir dosyayı kimse aramaz, çünkü öneri tek bir sabit adres tanımlıyor. Çok dilli bir sitede kökteki dosyayı ana dilinizle kurup her dile ayrıca kendi sürümünü verebilirsiniz; biz kökte iki dili birleştirip /tr/llms.txt ve /en/llms.txt adreslerinde tek dilli sürümleri ayrıca yayımlıyoruz. İçerik tipinin text/markdown veya text/plain olması gerekir.",
          en: "In the site's root directory, at the same level as robots.txt: yourdomain.com/llms.txt. Nobody looks for a file sitting in a subfolder, because the proposal defines one fixed address. On a multilingual site you can build the root file around your primary language and give each language its own version as well; we merge both languages at the root and publish single-language versions at /tr/llms.txt and /en/llms.txt. The content type must be text/markdown or text/plain.",
        },
      },
      {
        question: {
          tr: "llms.txt ile robots.txt aynı şey mi?",
          en: "Are llms.txt and robots.txt the same thing?",
        },
        answer: {
          tr: "Hayır, iki dosya farklı sorulara cevap veriyor. robots.txt bir izin belgesidir: hangi tarayıcının hangi yolu taramasına izin verildiğini söyler ve erişimi kontrol eder. llms.txt bir anlam belgesidir: erişimi hiç düzenlemez, yalnızca hangi sayfaların önemli olduğunu ve neyi anlattığını gösterir. İkisi birbirinin yerine geçmez — robots.txt'te kapalı bir siteyi llms.txt açamaz, llms.txt'i olmayan bir site robots.txt sayesinde daha iyi anlaşılmaz.",
          en: "No, the two files answer different questions. robots.txt is a permissions document: it states which crawler may fetch which paths and controls access. llms.txt is a meaning document: it regulates nothing about access and only indicates which pages matter and what they cover. Neither substitutes for the other — llms.txt cannot open a site that robots.txt has closed, and robots.txt will not make a site without llms.txt any better understood.",
        },
      },
      {
        question: {
          tr: "llms txt dosyasında kaç bağlantı olmalı?",
          en: "How many links should an llms txt file contain?",
        },
        answer: {
          tr: "Sabit bir sayı yok, ama seçicilik dosyanın işlevinin kendisi. Yirmi ile kırk bağlantı çoğu kurumsal site için işi görüyor; bizim Türkçe sürümümüzde 12 hizmet, 9 vaka ve yayındaki her yazıyla birlikte kırkın üzerinde satır var. Sınırı belirleyen soru şu: bir model bu listeyle sizi doğru anlatabilir mi? Yüzlerce bağlantı eklemek dosyayı sitemap kopyasına çevirir ve seçim yapmadığınız için modelin işini kolaylaştırmaz.",
          en: "No fixed number exists, but selectivity is the whole function of the file. Twenty to forty links serve most corporate sites; our Turkish version runs to over forty lines with 12 services, 9 case studies and every published article. The question that sets the limit is whether a model could describe you correctly from this list alone. Adding hundreds of links turns the file into a copy of the sitemap and, because you made no selection, does nothing to ease the model's work.",
        },
      },
      {
        question: {
          tr: "Çok dilli bir sitede llms.txt nasıl yönetilir?",
          en: "How is llms.txt handled on a multilingual site?",
        },
        answer: {
          tr: "Her dilin kendi sürümü olur, ve o sürüm yalnız kendi dilinin URL'lerini taşır. Tek dilde yayımlanan bir dosya diğer dildeki sayfalarınızı modelin haritasından siler; bu, ihracat yapan siteler için doğrudan bir görünürlük kaybı. Bizim düzenimizde kök /llms.txt iki dili tek belgede birleştiriyor, Türkçe bölüm önde geliyor; /tr/llms.txt ve /en/llms.txt ise tek dilli belgeler olarak duruyor ve karşı dile bağlantı vermiyor.",
          en: "Every language gets its own version, and that version carries only its own language's URLs. A file published in a single language erases your other-language pages from the model's map, which is a direct visibility loss for any site selling abroad. In our setup the root /llms.txt merges both languages into one document with the Turkish section first, while /tr/llms.txt and /en/llms.txt stand as single-language documents that link to nothing in the other language.",
        },
      },
      {
        question: {
          tr: "llms.txt olmadan yapay zeka motorlarında görünür olunur mu?",
          en: "Can you be visible in AI engines without llms.txt?",
        },
        answer: {
          tr: "Evet, hem de rahatlıkla. Bugün AI motorlarında kaynak gösterilen sitelerin büyük çoğunluğunda bu dosya yok; görünürlüğü sağlayan şey içeriğin yapısı. Soru biçiminde başlıklar, başlık altında net cevap veren ilk paragraf, kendi başına anlamlı pasajlar ve metnin içine yerleştirilmiş rakamlar. SIM Baskı Malzemeleri'nde organik trafiğin altı ayda 15 katına çıkması ve AI motorlarındaki görünürlüğün sıfırdan 40 bine ulaşması bu mimariden geldi, bir dosyadan değil.",
          en: "Yes, comfortably. The large majority of sites being cited in AI engines today have no such file; what produces the visibility is the structure of the content. Headings phrased as questions, a first paragraph that answers plainly beneath each one, passages that hold up on their own, and figures written into the sentences. At SIM Printing Suppliers, organic traffic growing 15× in six months and visibility in AI engines going from zero to 40,000 came from that architecture, not from a file.",
        },
      },
      {
        question: {
          tr: "llms.txt dosyasını kim güncelleyecek?",
          en: "Who is going to keep the llms.txt file updated?",
        },
        answer: {
          tr: "En iyi cevap: kimse. Dosya elle yazıldığında sahibi hızla belirsizleşir ve ilk slug değişikliğinde sessizce eskir — 200 dönmeye devam eder, içindeki bağlantılar 404 verir. Bu yüzden dosyayı içerik kaynağınızdan türetmek bir tercih değil, bakım kararıdır. Bizim dört llms dosyamızın içinde elle yazılmış tek bir bağlantı satırı yok; hepsi hizmet, vaka, paket ve yazı kayıtlarından derleme sırasında üretiliyor, dolayısıyla içerik değiştiğinde dosya kendiliğinden güncel kalıyor.",
          en: "The best answer is nobody. When the file is typed by hand its owner quickly becomes unclear and it goes stale at the first slug change — still returning 200 while the links inside it return 404. Generating it from your content source is therefore a maintenance decision rather than a preference. Not one link line in our four llms files is hand-written; all of them are produced from the service, case, package and article records at build time, so the files stay current when the content changes.",
        },
      },
    ],
    category: "growth",
    topic: "geo",
    tags: ["llms-txt", "geo", "ai-crawler", "teknik-seo"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-08-28",
    readingMinutes: 11,
    seo: {
      title: {
        tr: "llms.txt nedir ve nasıl hazırlanır?",
        en: "What is llms.txt and how to write one",
      },
      description: {
        tr: "llms.txt, sitenizin haritasını dil modellerine sade metinle veren bir dosya önerisi. Ne işe yarar, llms-full.txt'ten farkı ne, AI crawler'lar okuyor mu?",
        en: "llms.txt hands language models a plain-text map of your site. What it does, how it differs from llms-full.txt, whether AI crawlers read it, how to write one.",
      },
    },
  },
  {
    slug: {
      tr: "cro-nedir",
      en: "what-is-cro",
    },
    title: {
      tr: "CRO nedir? Aynı trafikten daha fazla satış",
      en: "What is CRO? Same traffic, more sales",
    },
    excerpt: {
      tr: "Reklam bütçesi ikiye katlandı, tıklama ikiye katlandı, satış aynı kaldı. CRO tam burada başlıyor: eldeki trafiği satın alan trafiğe çeviren ölçüm, hipotez ve test disiplini.",
      en: "The ad budget doubled, the clicks doubled, the sales curve stayed put. That is where CRO starts: the measurement, hypothesis and testing discipline that turns the traffic you already have into buying traffic.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Geçen sonbahar bir toplantıda bir e-ticaret müdürü dizüstünü bize çevirdi. Reklam panelinde bütçe altı ayda ikiye katlanmıştı, tıklama sayısı da öyle. Satış eğrisi ise tam olarak eskiden durduğu yerde duruyordu. Sorusu tek cümleydi: \"Daha ne kadar trafik almam gerekiyor?\"",
          en: "Last autumn, in a meeting, an e-commerce manager turned their laptop toward us. On the ad dashboard the budget had doubled in six months, and the clicks had doubled with it. The sales curve sat exactly where it had always sat. Their question was one sentence: \"How much more traffic do I need?\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yanlış soruydu. Doğru soru üç parçalıydı: gelen ziyaretçilerin yüzde kaçı satın alıyor, geri kalanı tam olarak nerede vazgeçiyor, bu vazgeçişlerden hangisi düzeltilebilir? Bu üç sorunun peşine düşen işin adı CRO. Toplantıyı bu yazı için kurguladım; soruyu kurgulamadım — aynı cümleyi son yıllarda farklı sektörlerden defalarca duyduk.",
          en: "It was the wrong question. The right one came in three parts: what share of arriving visitors buy, where exactly do the rest give up, and which of those give-ups can be fixed? The work that chases those three questions is called CRO. I invented the meeting for this article; I did not invent the question — we have heard that same sentence from different industries many times over the past few years.",
        },
      },
      {
        type: "h2",
        id: "cro-nedir",
        text: {
          tr: "CRO nedir?",
          en: "What is CRO?",
        },
      },
      {
        type: "p",
        text: {
          tr: "CRO (conversion rate optimization — dönüşüm oranı optimizasyonu), bir siteye gelen mevcut ziyaretçilerin daha büyük bir bölümünü müşteriye çeviren ölçüm, hipotez ve test disiplinidir. Trafik satın almaz; eldeki trafiğin verimini artırır. Yöntemi üç parçalıdır: ziyaretçinin nerede durduğunu veriyle tespit etmek, durmasının nedenine dair sınanabilir bir hipotez kurmak, o hipotezi kontrollü bir deneyle test etmek. Çıktısı yeni bir tasarım değil, doğrulanmış bir öğrenmedir.",
          en: "CRO — conversion rate optimisation — is the discipline of measurement, hypothesis and testing that turns a larger share of the visitors a site already has into customers. It does not buy traffic; it raises the yield of the traffic in hand. The method has three parts: find where the visitor stops using data, build a testable hypothesis about why they stopped, then examine that hypothesis with a controlled experiment. Its output is not a new design but a verified piece of knowledge.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu tanımın dışarıda bıraktıkları en az içerdikleri kadar önemli. CRO, sayfayı güzelleştirme işi değildir — estetik bir sonuç olabilir, hedef değildir. Bir kişinin \"bence şu buton daha iyi\" demesi de değildir; bir kişinin fikri hipotezdir, hipotez veriyle sınanana kadar bilgi sayılmaz. Ve tek seferlik bir proje hiç değildir: ziyaretçi davranışı, rekabet ve fiyat bandı değiştikçe geçerli olan cevap da değişir, dolayısıyla iş bir kez yapılıp bitmez.",
          en: "What this definition leaves out matters as much as what it includes. CRO is not the business of making a page prettier — aesthetics can be a by-product, never the goal. Nor is it one person saying \"I think that button is better\"; one person's opinion is a hypothesis, and a hypothesis is not knowledge until data tests it. And it is certainly not a one-off project: as visitor behaviour, competition and price bands shift, the answer that held last quarter stops holding, so the work never finishes.",
        },
      },
      {
        type: "h2",
        id: "donusum-orani-nedir",
        text: {
          tr: "Dönüşüm oranı nedir, nasıl hesaplanır?",
          en: "What is a conversion rate and how is it calculated?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dönüşüm oranı, belirli bir dönemde hedeflenen eylemi tamamlayan ziyaretçilerin toplam ziyaretçiye bölünmesidir. Formül sade: dönüşüm sayısı ÷ oturum sayısı × 100. Yüz oturumun üçü sipariş veriyorsa web sitesi dönüşüm oranınız yüzde üçtür. Zorluk formülde değil, formülün iki tarafını da dürüst doldurmakta.",
          en: "A conversion rate is the number of visitors who complete the targeted action in a given period, divided by the total number of visitors. The formula is plain: conversions ÷ sessions × 100. If three out of a hundred sessions place an order, your website conversion rate is three percent. The difficulty is not the formula but filling in both sides of it honestly.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Paydaya ne koyduğunuz cevabı değiştirir. Oturum yerine tekil kullanıcı sayarsanız oran yükselir; bot ve iç trafiği ayıklamazsanız düşer. Aynı sitede mobil ve masaüstü oranları birbirinden ayrı hesaplanmadığında, iyi çalışan bir masaüstü deneyimi bozuk bir mobil deneyimi haftalarca gizleyebilir. Bu yüzden tek bir e-ticaret dönüşüm oranı rakamı raporun başlığı olamaz; kırılımı olmayan oran, ortalamanın arkasına saklanmış bir sorundur.",
          en: "What you put in the denominator changes the answer. Count unique users instead of sessions and the rate climbs; leave bots and internal traffic in and it sinks. When mobile and desktop are not calculated separately on the same site, a healthy desktop experience can hide a broken mobile one for weeks. This is why a single e-commerce conversion rate cannot be the headline of a report; a rate without a breakdown is a problem hiding behind an average.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir de eylem seçimi var. Satın alma makro dönüşümdür, ama tek dönüşüm değildir: sepete ekleme, form gönderimi, teklif talebi, bültene kayıt ve hesap açma da ölçülür ve bunlara mikro dönüşüm denir. Uzun satış döngüsü olan işlerde mikro dönüşümler tek erken sinyaldir — üç aylık bir teklif sürecinde yalnız imzayı beklerseniz, aradaki hiçbir iyileştirmenin etkisini göremezsiniz.",
          en: "Then there is the choice of action. A purchase is the macro conversion, but not the only one: add-to-cart, form submissions, quote requests, newsletter sign-ups and account creation are all measured too, and these are called micro conversions. In businesses with long sales cycles, micro conversions are the only early signal — if you wait for the signature alone in a three-month quoting process, you will never see the effect of anything you improved in between.",
        },
      },
      {
        type: "h2",
        id: "iyi-donusum-orani-kac",
        text: {
          tr: "İyi bir dönüşüm oranı kaç olmalı?",
          en: "What counts as a good conversion rate?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dürüst cevap: sektöre, fiyat bandına, trafiğin kaynağına ve ölçümün nasıl kurulduğuna göre değişir; herkes için geçerli tek bir \"iyi\" rakam yok. İnternette dolaşan sektör ortalamalarını gördüğünüzde şunu sorun: bu rakam hangi ülkedeki, hangi fiyat bandındaki, hangi trafik karmasına sahip kaç mağazadan toplandı? Cevap yoksa rakam da yoktur.",
          en: "The honest answer: it depends on the sector, the price band, where the traffic comes from and how the measurement was set up; there is no single \"good\" number that holds for everyone. When you see an industry average circulating online, ask one thing: how many stores was it collected from, in which country, at which price band, with what traffic mix? If there is no answer, there is no number.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı kategoride iki mağaza düşünün. Biri trafiğinin çoğunu marka aramasından alıyor, diğeri geniş hedefli görüntülü reklamdan. İkincinin oranı yapısal olarak düşük çıkar ve bu bir başarısızlık değil, farklı bir niyet karmasıdır. Bin liralık ürün satan bir mağazayla yüz bin liralık makine satan bir üreticinin oranını yan yana koymak da aynı hatadır — karar süresi uzadıkça oran düşer, çünkü aynı kişi satın almadan önce siteye beş kez gelir.",
          en: "Picture two stores in the same category. One takes most of its traffic from brand searches, the other from broadly targeted display ads. The second one's rate comes out structurally lower, and that is not a failure but a different mix of intent. Putting a store selling thousand-lira items next to a manufacturer selling hundred-thousand-lira machines is the same error — the longer the decision takes, the lower the rate, because the same person visits five times before buying.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kullanılabilir tek kıyaslama kendi geçmişinizdir. Temel çizginizi doğru ölçün, kırılımlarını ayırın, sonra kendi rakamınızı yenmeye çalışın. Bunun ön koşulu ölçümün gerçekten çalışıyor olması: SOYLU AVM'de piksel kurulumları eksikti, trafiğin kaynağı ve dönüşümün yolu izlenemiyordu. Ekrandaki oran yanlış olduğu için, oranı iyileştirmeye çalışmanın da bir anlamı yoktu.",
          en: "The only usable benchmark is your own history. Measure your baseline properly, split it into its parts, then set out to beat your own number. That presumes the measurement actually works: at SOYLU AVM the pixel setup was incomplete, and neither the source of traffic nor the path to conversion could be traced. Because the rate on the screen was wrong, trying to improve it meant nothing.",
        },
      },
      {
        type: "h2",
        id: "trafik-mi-donusum-mu",
        text: {
          tr: "Trafiği artırmak mı, dönüşümü artırmak mı daha ucuz?",
          en: "Which is cheaper: more traffic or better conversion?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı satış artışını iki yoldan alabilirsiniz — trafiği ikiye katlayarak ya da dönüşüm oranını ikiye katlayarak. Aradaki fark maliyetin şeklidir: trafiğin faturası her ay yeniden gelir, dönüşüm iyileştirmesinin faturası bir kez ödenir ve etkisi sonraki bütün trafiğe uygulanır. Bu yüzden CRO'nun getirisi bileşiktir, reklamınkiyse doğrusal.",
          en: "You can get the same lift in sales two ways — by doubling traffic or by doubling the conversion rate. The difference lies in the shape of the cost: traffic bills you again every month, while a conversion improvement is paid for once and then applies to all the traffic that follows. That is why the return on CRO compounds while the return on ads stays linear.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İki metrik bu farkı görünür kılar. CAC (customer acquisition cost — müşteri edinme maliyeti), bir müşteriyi kazanmak için harcadığınız toplam tutardır ve dönüşüm oranı yükseldiğinde tek kuruş fazla harcamadan düşer. ROAS (return on ad spend — reklam harcamasının getirisi), harcanan her liraya karşılık gelen geliri gösterir ve aynı sebeple yukarı gider. Yani CRO bir pazarlama kalemi değil, bütün pazarlama kalemlerinin çarpanıdır.",
          en: "Two metrics make that difference visible. CAC — customer acquisition cost — is the total you spend to win one customer, and it falls when the conversion rate rises without a single extra lira of spend. ROAS — return on ad spend — shows the revenue earned for each unit spent, and it moves up for the same reason. CRO is therefore not one line in the marketing budget but the multiplier on all the others.",
        },
      },
      {
        type: "quote",
        text: {
          tr: "Trafiği artırmak kovaya daha hızlı su doldurmaktır. Dönüşümü artırmak, kovadaki delikleri kapatmaktır — ve delikler durduğu sürece hangi hızda doldurduğunuzun bir önemi yoktur.",
          en: "Raising traffic means pouring water into the bucket faster. Raising conversion means closing the holes in the bucket — and while the holes are open, the speed you pour at hardly matters.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Buradan çıkan sonuç \"reklam vermeyin\" değil. Çok düşük trafikli bir sitede test kuramazsınız, dolayısıyla bir eşiğe kadar trafik yatırımı zorunludur. Ama trafik zaten varken satış yerinde sayıyorsa, bir sonraki lirayı reklama koymak çoğu zaman en pahalı seçenektir.",
          en: "The conclusion is not \"stop advertising\". You cannot run tests on a site with very little traffic, so investing in traffic up to a threshold is unavoidable. But when traffic already exists and sales are standing still, putting the next lira into ads is usually the most expensive option available.",
        },
      },
      {
        type: "h2",
        id: "cro-sureci",
        text: {
          tr: "CRO süreci: ölçüm, hipotez, test, öğrenme",
          en: "The CRO process: measure, hypothesise, test, learn",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Dönüşüm oranı nasıl artırılır\" sorusunun cevabı bir taktik listesi değil, bir sıradır. CRO'yu taktik listesinden ayıran şey de tam olarak budur: sıra bozulduğunda — önce fikir, sonra veri — elinizde kalan şey bir tahmin koleksiyonu olur. Dört adım şöyle işler.",
          en: "The answer to \"how do you increase a conversion rate\" is not a list of tactics but an order. That is precisely what separates CRO from a list of tactics: when the order breaks — idea first, data later — what you are left with is a collection of guesses. The four steps run like this.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Ölçüm. Analitik kurulumunu doğrulayın, hedefleri tanımlayın, kırılımları ayırın. Bu adımda amaç iyileştirme değil, ekranda gördüğünüz sayının gerçek olduğundan emin olmaktır.",
            en: "Measurement. Verify the analytics setup, define the goals, split out the segments. The aim at this step is not improvement but certainty that the number on your screen is real.",
          },
          {
            tr: "Teşhis. Nicel veri nerede kaybettiğinizi söyler, nitel veri nedenini söyler. Oturum kayıtları, form terk analizleri, müşteri hizmetleri kayıtları ve beş kullanıcıyla yapılan kısa görüşmeler bu adımın hammaddesidir.",
            en: "Diagnosis. Quantitative data tells you where you lose people, qualitative data tells you why. Session recordings, form abandonment analysis, support tickets and short interviews with five users are the raw material of this step.",
          },
          {
            tr: "Hipotez. Her hipotez tek cümlede kurulur: şu değişikliği yaparsak, şu ölçüde, şu nedenle değişir. Nedeni yazamadığınız bir hipotez, sonucu ne olursa olsun size bir şey öğretmez.",
            en: "Hypothesis. Every hypothesis fits in one sentence: if we change this, that metric moves by this much, for this reason. A hypothesis whose reason you cannot write down teaches you nothing, whatever its result.",
          },
          {
            tr: "Test ve öğrenme. Deneyi kurun, önceden belirlenmiş süre boyunca çalıştırın, sonucu — kazandı, kaybetti veya fark yok — kayda geçirin. Kaybeden testler de bilgidir; yazılmayan bilgi altı ay sonra yeniden test edilir.",
            en: "Test and learn. Build the experiment, run it for the period agreed in advance, and record the outcome — won, lost or no difference. Losing tests are knowledge too; knowledge left unwritten gets retested six months later.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu döngünün her turu bir sonrakini ucuzlatır, çünkü teşhis birikir. Sayfa düzeyinde hangi öğenin nasıl kurulacağını merak ediyorsanız — başlık, eylem çağrısı, form uzunluğu, hız — [açılış sayfası optimizasyonu yazımız](/yazilar/donusum-optimizasyonu-yontemleri) o katmanı tek tek anlatıyor. Buradaki yazı kavramı, oradaki yazı elin altındaki kaldıraçları veriyor. Süreci bir ekip disiplinine çevirmenin nasıl göründüğünü ise [CRO hizmetimiz](/hizmetler/cro) tarif ediyor.",
          en: "Each turn of this loop makes the next one cheaper, because diagnosis accumulates. If you are wondering how each element on the page itself should be built — headline, call to action, form length, speed — [our landing page optimisation article](/yazilar/donusum-optimizasyonu-yontemleri) walks through that layer one item at a time. This article gives you the concept; that one gives you the levers within reach. What the process looks like once it becomes a team discipline is described on [our CRO service page](/hizmetler/cro).",
        },
      },
      {
        type: "h2",
        id: "ab-testi-nedir",
        text: {
          tr: "A/B testi nedir, ne zaman anlamlı sonuç verir?",
          en: "What is an A/B test, and when does it give a meaningful result?",
        },
      },
      {
        type: "p",
        text: {
          tr: "A/B testi, aynı trafiği iki sürüm arasında rastgele bölerek hangisinin daha çok dönüştürdüğünü ölçen kontrollü deneydir. Anlamlı sonuç verdiği an, farkın rastlantıyla açıklanamayacak kadar büyük olduğu ve testin önceden belirlenmiş süresini tamamladığı andır. Terimi ararken eğik çizgi çoğu zaman düşer; \"ab testi\" yazımı da tam olarak aynı yöntemi tarif eder.",
          en: "An A/B test is a controlled experiment that splits the same traffic randomly between two versions and measures which one converts more. It becomes meaningful at the moment the difference is too large to be explained by chance and the test has completed the duration agreed beforehand. The slash often drops away when people search for the term; \"ab testing\" describes exactly the same method.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Disiplinin üç kuralı var. Birincisi tek değişken: aynı anda başlığı, görseli ve buton rengini değiştirirseniz kazanan sürümü bilirsiniz ama nedenini bilemezsiniz — ve neden bilinmediğinde öğrenme bir sonraki teste taşınmaz. İkincisi önceden karar: testin süresi ve gereken örneklem, teste başlamadan yazılır. Üçüncüsü tam haftalar: salı günü davranan kullanıcıyla cumartesi davranan kullanıcı aynı kişi değildir, dolayısıyla test haftanın ortasında kesilmez.",
          en: "The discipline has three rules. First, one variable: change the headline, the image and the button colour at once and you will know which version won but not why — and without the why, the learning does not travel to the next test. Second, decide in advance: the duration and the sample size needed are written down before the test starts. Third, whole weeks: the user who behaves a certain way on Tuesday is not the user who behaves on Saturday, so a test is never cut off mid-week.",
        },
      },
      {
        type: "p",
        text: {
          tr: "En pahalı hata erken bakmaktır. Test üç gün sonra öndeyse durdurup kazananı ilan etmek insanı çeker; oysa küçük örneklemlerde fark gün gün yön değiştirir ve erken durdurulan testler yanlış kararı kalıcı hale getirir. Panele bakmak serbesttir, karar vermek değil.",
          en: "The most expensive mistake is looking early. When a test is ahead after three days it is tempting to stop it and declare a winner; yet at small sample sizes the gap changes direction day by day, and tests stopped early make the wrong decision permanent. Looking at the dashboard is free; deciding on it is not.",
        },
      },
      {
        type: "h2",
        id: "orneklem-gercegi",
        text: {
          tr: "Örneklem yetmediğinde test ne söyler?",
          en: "What does a test tell you when the sample is too small?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Neredeyse hiçbir şey. Aylık birkaç yüz dönüşümü olan bir sitede yüzde iki-üçlük bir farkı güvenilir biçimde ölçmek aylar sürer, dolayısıyla o testi kurmak zaman kaybıdır. Bu, düşük trafikli sitelerin CRO yapamayacağı anlamına gelmiyor; test edilecek şeyin büyüklüğünü değiştirmesi gerektiği anlamına geliyor.",
          en: "Almost nothing. On a site with a few hundred conversions a month, reliably measuring a two or three percent difference takes months, which makes running that test a waste of time. This does not mean low-traffic sites cannot do CRO; it means the size of what they test has to change.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Az trafikte üç yol işe yarar. Birincisi büyük değişiklikleri test etmek: buton rengi yerine teklifin kendisi, kargo politikası veya sayfanın tüm kurgusu. Büyük farklar küçük örneklemde de görünür. İkincisi mikro dönüşümleri ölçmek: satın alma seyrekse sepete ekleme ve ödeme adımına geçiş çok daha hızlı sinyal verir. Üçüncüsü nitel araştırmayı öne almak: beş kullanıcının sipariş formunu doldururken nerede duraksadığını izlemek, iki ay sürecek bir testin cevabını bir öğleden sonrada verebilir.",
          en: "Three routes work when traffic is thin. First, test big changes: not the button colour but the offer itself, the shipping policy or the entire structure of the page. Large differences show up even in small samples. Second, measure micro conversions: when purchases are rare, add-to-cart and reaching the payment step give a signal far sooner. Third, put qualitative research first: watching five users hesitate as they fill in the order form can answer in one afternoon what a two-month test would have answered.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir de dürüst bir sınır var: her kazanç testten çıkmaz. Bozuk bir mobil ödeme adımı, ekranda görünmeyen bir kargo ücreti veya beş saniyede açılan bir sayfa test edilmez, düzeltilir. Test, iki makul seçenek arasında karar veremediğinizde başvurulan araçtır; bariz hatayı test etmek onu haftalarca yaşatmaktan başka işe yaramaz.",
          en: "There is also an honest limit: not every gain comes out of a test. A broken mobile payment step, a shipping fee that never appears on screen or a page that takes five seconds to load is not tested, it is fixed. Testing is what you reach for when two reasonable options leave you undecided; testing an obvious defect only keeps it alive for another few weeks.",
        },
      },
      {
        type: "h2",
        id: "funnel-analizi",
        text: {
          tr: "Funnel analizi neyi gösterir?",
          en: "What does funnel analysis show?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Funnel analizi, ziyaretçinin ilk sayfadan siparişe kadar geçtiği adımları sırayla ölçer ve her adımda kaç kişinin düştüğünü gösterir. Değeri tek bir şeydedir: toplam dönüşüm oranı size bir sorun olduğunu söyler, funnel analizi sorunun hangi adımda olduğunu söyler. Dönüşüm hunisi olarak da anılan bu yapı, kategori sayfasından ürün sayfasına, sepetten ödeme adımına ve siparişe uzanan zinciri birbirinden ayırır.",
          en: "Funnel analysis measures, in order, the steps a visitor passes through from the first page to the order, and shows how many people drop at each one. Its value lies in one thing: the overall conversion rate tells you a problem exists, funnel analysis tells you which step it lives in. This structure separates the chain that runs from category page to product page, from basket to payment step and on to the order.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Analizin okunma biçimi de önemli. En büyük düşüş her zaman en büyük fırsat değildir — sepetten ödemeye geçişte yüzde yetmiş düşüş normaldir, ürün sayfasından sepete geçişte aynı oran değildir. Aranan şey mutlak düşüş değil, benzer adımlara veya kendi geçmişinize göre anormal olan düşüştür. Ve her adımın kendi kırılımı vardır: mobilde çöken bir ödeme adımı, masaüstü verisiyle birleştirildiğinde tamamen görünmez olabilir.",
          en: "How the analysis is read matters as much. The largest drop is not always the largest opportunity — a seventy percent drop between basket and payment is ordinary, the same figure between product page and basket is not. What you are looking for is not the absolute fall but the fall that is abnormal against comparable steps or against your own history. And every step has its own segments: a payment step collapsing on mobile can vanish entirely once merged with desktop data.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[SOYLU AVM'de](/vakalar/soylu-avm-e-ticaret-buyume) işe tam buradan başladık. Piksel ve dönüşüm izleme sıfırdan kuruldu, trafik kaynakları segmentlere ayrıldı; ancak ondan sonra kampanya açıldı. Kampanyanın altıncı gününde toplam gelir 1,5 milyon dolara ulaştı, toplam trafik yüzde 150 arttı. Buradaki ders sıralamadadır: ölçüm kurulmadan açılan kampanya, sonucu değil yalnız harcamayı raporlar.",
          en: "At [SOYLU AVM](/vakalar/soylu-avm-e-ticaret-buyume) we began at exactly this point. Pixel and conversion tracking were rebuilt from scratch and traffic sources were segmented; only then did the campaign go live. By the sixth day of the campaign total revenue reached $1.5 million and total traffic rose by 150 percent. The lesson is in the order: a campaign launched before measurement is in place reports spending, not results.",
        },
      },
      {
        type: "h2",
        id: "sepet-terk-orani",
        text: {
          tr: "Sepet terk oranı neden bu kadar yüksek?",
          en: "Why is the cart abandonment rate so high?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sepet terk oranı, sepete ürün ekleyip siparişi tamamlamayan ziyaretçilerin payıdır ve her mağazada yüksektir. Yüksekliğin bir kısmı davranışsaldır — insanlar sepeti bir alışveriş listesi, bir fiyat karşılaştırma aracı veya bir yer imi gibi kullanır — ve bu kısım kapatılamaz. Kapatılabilen kısım, alıcının ödeme adımında karşılaştığı sürprizlerdir.",
          en: "Cart abandonment is the share of visitors who add an item to the basket and never complete the order, and it runs high in every store. Part of that height is behavioural — people use the basket as a shopping list, a price comparison tool or a bookmark — and that part cannot be closed. The part that can be closed is the surprises the buyer meets at the payment step.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Geç görünen maliyet. Kargo ücreti, vergi veya hizmet bedeli ilk kez ödeme adımında çıkıyorsa, alıcı fiyat değiştiği için değil güveni sarsıldığı için çıkar.",
            en: "Cost that appears late. When the shipping fee, tax or service charge shows up for the first time at the payment step, the buyer leaves not because the price changed but because their trust did.",
          },
          {
            tr: "Zorunlu üyelik. Misafir olarak sipariş verememek, tek seferlik alıcı için gereksiz bir engeldir; hesap açma daveti siparişten sonra da yapılabilir.",
            en: "Forced registration. Being unable to order as a guest is a needless barrier for a one-time buyer; the invitation to create an account can wait until after the order.",
          },
          {
            tr: "Uzun form. Teslimat için gerekmeyen her alan bir vazgeçme ihtimalidir; sorulan her bilginin neden sorulduğu savunulabilmelidir.",
            en: "A long form. Every field not required for delivery is another chance to abandon; you should be able to defend why each piece of information is being asked for.",
          },
          {
            tr: "Eksik ödeme seçeneği. Alıcının alışkın olduğu yöntem listede yoksa, karar verilmiş bir satın alma teknik bir engelde ölür.",
            en: "A missing payment option. When the method the buyer is used to is not on the list, a purchase already decided on dies at a technical obstacle.",
          },
          {
            tr: "Belirsiz teslimat ve iade. \"Ne zaman elimde olur\" ve \"beğenmezsem ne olur\" sorularının cevabı sayfada yoksa, alıcı riski üstlenmek yerine erteler.",
            en: "Unclear delivery and returns. If \"when will it arrive\" and \"what if I don't like it\" go unanswered on the page, the buyer postpones rather than takes on the risk.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Bu maddelerin ortak yanı, hiçbirinin ikna işi olmaması. Ödeme adımında yapılan iş satmak değil, satın almaya karar vermiş insanın önündeki sürtünmeyi kaldırmaktır. Terk edilen sepetleri e-postayla hatırlatmak da işe yarar, ama sırası ikincidir: önce terkin nedenini ortadan kaldırın, sonra kalan terk için hatırlatma kurun.",
          en: "What these items share is that none of them is a persuasion problem. The job at the payment step is not to sell but to remove the friction in front of someone who has already decided to buy. Emailing reminders for abandoned baskets works too, but it comes second: remove the cause of the abandonment first, then set up reminders for what remains.",
        },
      },
      {
        type: "h2",
        id: "sosyal-kanit",
        text: {
          tr: "Sosyal kanıt dönüşümü nasıl etkiler?",
          en: "How does social proof affect conversion?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sosyal kanıt, alıcının kendi kararını başkalarının kararıyla doğrulamasını sağlayarak algılanan riski düşürür. Etkisi ikna değil güvence üzerinden çalışır: ürünün iyi olduğunu iddia eden marka taraftır, aynı şeyi söyleyen müşteri değildir. Bu yüzden yorum, kullanıcı fotoğrafı ve kısa deneyim videosu, aynı vaadi anlatan pazarlama metninden daha hızlı iş görür.",
          en: "Social proof lowers perceived risk by letting a buyer confirm their own decision against other people's. It works through reassurance rather than persuasion: a brand claiming its product is good is an interested party, a customer saying the same thing is not. This is why a review, a customer photo or a short experience video does the job faster than marketing copy making the same promise.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Yerleştirme, içerik kadar belirleyici. Ana sayfada toplanmış bir referans bölümü, kararın verildiği yerde — ürün sayfasında, fiyatın yanında, ödeme adımına geçmeden bir adım önce — duran tek bir yorumdan daha az iş yapar. Aynı şey biçim için de geçerli: yıldız ortalaması bir eşik bilgisidir, alıcının kendi kısıtını anlatan üç cümlelik bir yorum ise doğrudan itirazı karşılar.",
          en: "Placement decides as much as content. A testimonial section gathered on the homepage does less work than a single review sitting where the decision is made — on the product page, next to the price, immediately before the payment step. The same holds for form: an average rating is threshold information, while a three-sentence review describing the buyer's own constraint answers the objection directly.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[GYMWOLVES vakasında](/vakalar/gymwolves-12-kat-satis) sosyal kanıt kampanyanın taşıyıcı kaldıraçlarından biriydi. Veri akışı onarıldıktan ve dönüşüm hunisi yeniden kurulduktan sonra, sporcular ve influencer'larla video odaklı sosyal kanıt üretildi. Hedef 3 ayda satışı ikiye katlamaktı; üçüncü ayın sonunda satış 12 katına çıktı, oturum süresi 3, etkileşim 8 katına yükseldi. Etkileşim ve süre metriklerinin birlikte yükselmesi tesadüf değil: alıcı sayfada kalmak için bir sebep bulduğunda dönüşüm de arkasından geliyor.",
          en: "In [the GYMWOLVES case](/vakalar/gymwolves-12-kat-satis) social proof was one of the load-bearing levers of the campaign. After the data flow was repaired and the conversion funnel rebuilt, video-led social proof was produced with athletes and influencers. The target was to double sales in 3 months; by the end of month three sales were up 12×, session duration had tripled and engagement had risen 8×. Engagement and duration climbing together is no coincidence: when a buyer finds a reason to stay on the page, conversion follows behind.",
        },
      },
      {
        type: "h2",
        id: "sik-yapilan-hatalar",
        text: {
          tr: "CRO'da en sık yapılan altı hata",
          en: "The six most common mistakes in CRO",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sahada gördüğümüz hataların çoğu bilgi eksikliğinden değil, sabırsızlıktan çıkıyor. Altısı düzenli olarak tekrar ediyor.",
          en: "Most of the mistakes we see in the field come from impatience rather than a lack of knowledge. Six of them repeat with some regularity.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Ölçüm doğrulanmadan başlamak. Yanlış kurulmuş bir izleme, iyileştirmenin etkisini de hatanın etkisini de aynı şekilde gizler.",
            en: "Starting before the measurement is verified. A badly built tracking setup hides the effect of an improvement and the effect of a mistake in exactly the same way.",
          },
          {
            tr: "Rakibi kopyalamak. Rakibin sayfası onun trafiği, fiyatı ve kitlesi için çalışıyor; sizin sayfanızda aynı düzenlemenin neden çalışacağını açıklayan bir hipotez yoksa, kopya bir tahmindir.",
            en: "Copying a competitor. Their page works for their traffic, their pricing and their audience; without a hypothesis explaining why the same arrangement would work on yours, the copy is just a guess.",
          },
          {
            tr: "Testi erken durdurmak. Üçüncü günün önde olan sürümü, ikinci haftanın kaybedeni olabilir.",
            en: "Stopping a test early. The version leading on day three can be the loser by the second week.",
          },
          {
            tr: "Aynı anda çok şey değiştirmek. Kazanan sürümü bilmek, kazandıran nedeni bilmenin yerine geçmez.",
            en: "Changing too much at once. Knowing which version won is no substitute for knowing what made it win.",
          },
          {
            tr: "Yalnız makro dönüşüme bakmak. Uzun karar süresi olan işlerde sipariş sayısı geç sinyal verir; mikro dönüşümler olmadan aradaki her iyileştirme ölçüsüz kalır.",
            en: "Watching only the macro conversion. In businesses with long decision cycles the order count signals late; without micro conversions every improvement in between goes unmeasured.",
          },
          {
            tr: "Öğrenmeyi yazmamak. Kayıt tutulmayan bir test programı, iki yılda aynı hipotezi üç kez sınar ve her seferinde sıfırdan başlar.",
            en: "Not writing the learning down. A testing programme without records tests the same hypothesis three times in two years and starts from zero on each occasion.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Altısının ortak paydası zaman algısıdır. CRO'nun getirisi tek bir testten değil, üst üste binen küçük öğrenmelerden çıkar; bu yüzden program bir çeyrekte değil bir yılda okunur. Üç ayda dört test yapıp hiçbirini kaydetmeyen ekiple, üç ayda iki test yapıp ikisini de yazan ekip arasındaki fark ikinci yılda görünür — o noktada ikincisi neyin neden çalıştığını bilen taraf olur ve her yeni testi daha ucuza kurar.",
          en: "What all six share is a sense of time. The return on CRO comes not from one test but from small learnings stacking on each other, which is why a programme reads over a year rather than a quarter. The difference between a team running four tests in three months and recording none, and a team running two and writing both down, shows up in the second year — by then the second team knows what works and why, and builds every new test more cheaply.",
        },
      },
      {
        type: "h2",
        id: "nereden-baslanir",
        text: {
          tr: "Sonuç: bu hafta kurabileceğiniz tek test",
          en: "In closing: the one test you can run this week",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu yazının tezi tek cümlede duruyor: dönüşüm oranı bir pazarlama metriği değil, bütün pazarlama harcamalarınızın çarpanıdır — ve çarpanı büyütmek, çarpılan sayıyı büyütmekten neredeyse her zaman ucuzdur. Trafikten önce huniye bakmak bir tercih değil, sıralamanın kendisidir.",
          en: "This article's thesis fits in one sentence: the conversion rate is not a marketing metric but the multiplier on all your marketing spend — and raising the multiplier is almost always cheaper than raising the number being multiplied. Looking at the funnel before the traffic is not a preference; it is the order the work comes in.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün yapabileceğiniz somut bir şey var: kendi sitenizde bir siparişi baştan sona telefonunuzdan tamamlayın ve her adımda geçen süreyi yazın. Kargo ücretini ilk hangi ekranda gördünüz? Kaç alan doldurdunuz? Hangi adımda beklediniz? Bu listedeki en uzun bekleme, bu haftanın hipotezidir — ve onu sınamak için önce bir araç satın almanız gerekmiyor.",
          en: "There is something concrete you can do today: complete an order on your own site from start to finish on your phone, and write down how long each step takes. On which screen did the shipping fee first appear? How many fields did you fill in? Where did you wait? The longest wait on that list is this week's hypothesis — and testing it does not require buying a tool first.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu işi kendi ekibinizle mi yürüteceğinize yoksa dışarıdan destek mi alacağınıza karar veriyorsanız, [bir CRO ortağını değerlendirirken nelere bakılacağını](/yazilar/cro-ajansi-nasil-secilir) ayrı bir yazıda topladık.",
          en: "If you are deciding whether to run this with your own team or bring in outside support, we have gathered [what to look at when evaluating a CRO partner](/yazilar/cro-ajansi-nasil-secilir) in a separate article.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "CRO en kısa tanımıyla nedir?",
          en: "What is CRO, in short?",
        },
        answer: {
          tr: "CRO, conversion rate optimization ifadesinin kısaltmasıdır; Türkçesi dönüşüm oranı optimizasyonu. Bir siteye gelen mevcut ziyaretçilerin daha büyük bir bölümünü müşteriye çevirmek için yürütülen ölçüm, hipotez ve test disiplinini tanımlar. Yeni trafik satın almaz, eldeki trafiğin verimini artırır. Üç adımda işler: ziyaretçinin nerede vazgeçtiğini veriyle tespit etmek, nedenine dair sınanabilir bir hipotez kurmak ve o hipotezi kontrollü bir deneyle test etmek. Çıktısı yeni bir tasarım değil, doğrulanmış bir öğrenmedir.",
          en: "CRO stands for conversion rate optimisation. It names the discipline of measurement, hypothesis and testing used to turn a larger share of a site's existing visitors into customers. It buys no new traffic; it raises the yield of the traffic already arriving. The work runs in three steps: establish with data where the visitor gives up, build a testable hypothesis about why, and examine that hypothesis through a controlled experiment. What comes out of it is not a new design but a verified piece of knowledge.",
        },
      },
      {
        question: {
          tr: "Dönüşüm oranı nedir ve nasıl hesaplanır?",
          en: "What is a conversion rate and how do you calculate it?",
        },
        answer: {
          tr: "Belirli bir dönemde hedeflenen eylemi tamamlayan ziyaretçilerin toplam ziyaretçiye oranıdır. Formülü basittir: dönüşüm sayısı bölü oturum sayısı, çarpı yüz. Yüz oturumun üçü sipariş veriyorsa web sitesi dönüşüm oranı yüzde üçtür. Hesabın zor tarafı formül değil, iki tarafın da dürüst doldurulmasıdır: oturum yerine tekil kullanıcı sayılırsa oran yükselir, bot ve iç trafik ayıklanmazsa düşer. Mobil ve masaüstü ayrı hesaplanmadığında da bozuk bir mobil deneyim haftalarca ortalamanın arkasında saklanabilir.",
          en: "It is the share of visitors who complete the targeted action in a given period, out of all visitors. The formula is simple: conversions divided by sessions, multiplied by a hundred. If three sessions out of a hundred place an order, the website conversion rate is three percent. The hard part is not the formula but filling both sides in honestly: counting unique users instead of sessions pushes the rate up, and leaving bots and internal traffic in pulls it down. Without separating mobile from desktop, a broken mobile experience can hide behind the average for weeks.",
        },
      },
      {
        question: {
          tr: "İyi bir e-ticaret dönüşüm oranı kaçtır?",
          en: "What is a good e-commerce conversion rate?",
        },
        answer: {
          tr: "Tek bir doğru rakam yok — sektöre, fiyat bandına, trafiğin kaynağına ve ölçümün nasıl kurulduğuna göre değişir. Trafiğinin çoğunu marka aramasından alan bir mağazayla geniş hedefli görüntülü reklamdan alan bir mağazanın oranı yapısal olarak farklı çıkar ve bu bir başarı farkı değildir. Karar süresi uzadıkça oran da düşer, çünkü aynı alıcı satın almadan önce siteye birkaç kez gelir. Kullanılabilir tek kıyaslama kendi geçmişinizdir: temel çizgiyi doğru ölçün, kırılımlara ayırın, kendi rakamınızı yenmeye çalışın.",
          en: "There is no single correct figure — it shifts with the sector, the price band, where traffic comes from and how the measurement was built. A store taking most of its traffic from brand searches and one taking it from broad display ads land on structurally different rates, and that gap is not a gap in performance. The longer the decision takes, the lower the rate, because the same buyer returns several times before purchasing. The only usable benchmark is your own history: measure the baseline properly, break it into segments, then beat your own number.",
        },
      },
      {
        question: {
          tr: "Dönüşüm oranı nasıl artırılır?",
          en: "How do you increase a conversion rate?",
        },
        answer: {
          tr: "Sırayla. Önce ölçümü doğrulayın, sonra funnel analiziyle kaybın hangi adımda olduğunu bulun, sonra o adım için tek cümlelik bir hipotez kurun ve hipotezi kontrollü bir testle sınayın. Bariz hatalar — bozuk mobil ödeme adımı, geç görünen kargo ücreti, beş saniyede açılan sayfa — test edilmez, doğrudan düzeltilir. Test, iki makul seçenek arasında karar veremediğinizde devreye girer. Her turda öğrenmeyi yazmak da yöntemin parçasıdır; kaydı tutulmayan program aynı hipotezi yıllar içinde defalarca sınar.",
          en: "In order. Verify the measurement first, then use funnel analysis to find which step the loss lives in, write a one-sentence hypothesis for that step, and examine it with a controlled test. Obvious defects — a broken mobile payment step, a shipping fee that appears late, a page that takes five seconds to load — are not tested but fixed outright. Testing enters when two reasonable options leave you undecided. Recording the learning on each cycle belongs to the method as well; a programme without records re-examines the same hypothesis for years.",
        },
      },
      {
        question: {
          tr: "A/B testi nedir?",
          en: "What is an A/B test?",
        },
        answer: {
          tr: "Aynı trafiği iki sürüm arasında rastgele bölerek hangisinin daha çok dönüştürdüğünü ölçen kontrollü deneydir. Aramalarda eğik çizgi çoğu zaman düşer ve aynı yöntem \"ab testi\" olarak da yazılır. Disiplinin üç kuralı var: tek seferde tek değişken değiştirilir, testin süresi ve gereken örneklem başlamadan önce yazılır, test tam haftalar boyunca çalıştırılır çünkü salı günü davranan kullanıcıyla cumartesi davranan kullanıcı aynı kişi değildir. En pahalı hata erken bakıp erken karar vermektir.",
          en: "It is a controlled experiment that splits the same traffic randomly between two versions and measures which converts more. The slash tends to fall away in searches, and the same method gets written as \"ab testing\" too. The discipline holds three rules: change one variable at a time, write down the duration and required sample before starting, and run for whole weeks, because the user behaving a certain way on Tuesday is not the user behaving on Saturday. The costliest mistake is looking early and deciding early.",
        },
      },
      {
        question: {
          tr: "Az trafikli bir sitede A/B testi yapılabilir mi?",
          en: "Can you run A/B tests on a low-traffic site?",
        },
        answer: {
          tr: "Yapılabilir, ama test edilecek şeyin büyüklüğü değişmelidir. Aylık birkaç yüz dönüşümü olan bir sitede yüzde iki-üçlük farkı güvenilir ölçmek aylar sürer; o testi kurmak zaman kaybıdır. Üç yol işe yarar: büyük değişiklikleri test etmek (buton rengi yerine teklifin kendisi veya kargo politikası), mikro dönüşümleri ölçmek (sepete ekleme ve ödeme adımına geçiş satın almadan çok daha hızlı sinyal verir) ve nitel araştırmayı öne almak. Beş kullanıcının formu doldururken nerede duraksadığını izlemek, iki aylık bir testin cevabını bir öğleden sonrada verebilir.",
          en: "Yes, but the size of what you test has to change. On a site with a few hundred conversions a month, reliably measuring a two or three percent difference takes months, so building that test wastes time. Three routes work: test large changes (the offer itself or the shipping policy rather than a button colour), measure micro conversions (add-to-cart and reaching payment signal far sooner than purchases), and put qualitative research first. Watching five users hesitate over a form can deliver in an afternoon what a two-month test would have delivered.",
        },
      },
      {
        question: {
          tr: "Funnel analizi nedir, dönüşüm oranından farkı ne?",
          en: "What is funnel analysis and how does it differ from the conversion rate?",
        },
        answer: {
          tr: "Funnel analizi, ziyaretçinin ilk sayfadan siparişe kadar geçtiği adımları sırayla ölçer ve her adımda kaç kişinin düştüğünü gösterir. Fark şurada: toplam dönüşüm oranı bir sorun olduğunu söyler, funnel analizi sorunun hangi adımda yaşadığını söyler. Okurken en büyük düşüşü değil, benzer adımlara veya kendi geçmişinize göre anormal olan düşüşü arayın — sepetten ödemeye geçişteki büyük kayıp normaldir, ürün sayfasından sepete geçişteki aynı kayıp değildir. Her adımın kendi kırılımı vardır; mobilde çöken bir adım masaüstü verisiyle birleşince görünmez olabilir.",
          en: "Funnel analysis measures, step by step, the path a visitor takes from the first page to the order, and shows how many people fall away at each one. The difference is this: the overall conversion rate tells you a problem exists, funnel analysis tells you which step it lives in. Read it looking not for the largest drop but for the drop that is abnormal against comparable steps or against your own history — a heavy loss between basket and payment is ordinary, the same loss between product page and basket is not. Each step carries its own segments too.",
        },
      },
      {
        question: {
          tr: "Sepet terk oranı nasıl düşürülür?",
          en: "How do you reduce cart abandonment?",
        },
        answer: {
          tr: "Ödeme adımındaki sürprizleri kaldırarak. En sık beş neden şunlar: kargo ücreti veya vergi ilk kez ödeme ekranında görünüyor, misafir olarak sipariş verilemiyor, form teslimat için gereksiz alanlar soruyor, alıcının alışkın olduğu ödeme yöntemi listede yok, teslimat ve iade koşulları sayfada yazmıyor. Hiçbiri ikna sorunu değil; bu adımdaki iş satmak değil, karar vermiş insanın önündeki sürtünmeyi kaldırmaktır. Terk edilen sepet hatırlatma e-postaları da işe yarar ama sırası ikincidir — önce nedeni kaldırın, sonra kalan terk için hatırlatma kurun.",
          en: "By removing the surprises at the payment step. The five most frequent causes: the shipping fee or tax appears for the first time on the payment screen, guest ordering is unavailable, the form asks for fields delivery does not need, the buyer's usual payment method is missing, and delivery and return terms are nowhere on the page. None of these is a persuasion problem; the job at this step is not to sell but to clear the friction in front of someone who has already decided. Reminder emails help, but they come second — remove the cause first.",
        },
      },
      {
        question: {
          tr: "Aynı bütçeyle trafik mi satın almalı, dönüşüm mü iyileştirmeli?",
          en: "Is it cheaper to raise traffic or to raise conversion?",
        },
        answer: {
          tr: "Maliyetin şekli farklı. Trafiğin faturası her ay yeniden gelir; dönüşüm iyileştirmesinin faturası bir kez ödenir ve etkisi sonraki bütün trafiğe uygulanır, yani getirisi bileşiktir. Dönüşüm oranı yükseldiğinde CAC (müşteri edinme maliyeti) tek kuruş fazla harcamadan düşer, ROAS (reklam harcamasının getirisi) aynı sebeple yükselir. Bu, reklamı bırakın demek değil: çok düşük trafikte test kurulamaz, dolayısıyla bir eşiğe kadar trafik yatırımı zorunludur. Ama trafik varken satış yerinde sayıyorsa, bir sonraki lirayı reklama koymak genellikle en pahalı seçenektir.",
          en: "The shape of the cost differs. Traffic bills you again every month; a conversion improvement is paid for once and then applies to all the traffic that follows, so its return compounds. When the conversion rate rises, CAC — customer acquisition cost — falls without a single extra unit of spend, and ROAS — return on ad spend — rises for the same reason. This is not an argument against advertising: you cannot run tests on very thin traffic, so investment up to a threshold is unavoidable. But when traffic exists and sales stand still, the next unit spent on ads is usually the most expensive option.",
        },
      },
      {
        question: {
          tr: "CRO çalışması ne kadar sürede sonuç verir?",
          en: "How long does CRO work take to show results?",
        },
        answer: {
          tr: "Süre trafiğin hacmine, sitenin mevcut durumuna ve düzeltilecek hatanın büyüklüğüne göre değişir; sabit takvim veren herkese temkinli yaklaşın. İlk kazançlar genellikle testten değil düzeltmeden gelir — bozuk bir mobil ödeme adımı ya da geç görünen kargo ücreti günler içinde kapatılabilir. Test programının kendisi ise trafiğe bağlıdır: örneklem yeterliyse tek bir testin sonucu iki-dört hafta içinde okunur, düşük trafikte aynı test aylar sürer. Kendi ölçtüğümüz uçlardan biri GYMWOLVES: ölçüm onarımı, huni yeniden kurulumu ve sosyal kanıt birlikte yürüdüğünde satış üç ayda 12 katına çıktı.",
          en: "It depends on traffic volume, the site's current state and the size of the defect being fixed; treat anyone offering a fixed calendar with caution. The first gains usually come from repairs rather than tests — a broken mobile payment step or a late-appearing shipping fee can be closed within days. The testing programme itself depends on traffic: with a sufficient sample, a single test reads within two to four weeks, while on thin traffic the same test takes months. One end of our own measured range is GYMWOLVES: with measurement repair, funnel rebuild and social proof running together, sales rose 12× in three months.",
        },
      },
      {
        question: {
          tr: "CRO yalnız e-ticaret için mi geçerli?",
          en: "Does CRO only apply to e-commerce?",
        },
        answer: {
          tr: "Hayır. Sitesinde ölçülebilir bir eylem tanımlayan her iş CRO yapabilir: teklif talebi toplayan bir üretici, randevu alan bir klinik, demo isteyen bir yazılım şirketi. Değişen şey yöntem değil, ölçülen dönüşümdür. Uzun karar süresi olan işlerde makro dönüşüm seyrek olduğu için mikro dönüşümler öne çıkar — teknik doküman indirme, fiyat sayfası görüntüleme, form ilk adımının tamamlanması. Bu işlerde tek bir kazanılan müşterinin değeri yüksek olduğundan, küçük bir oran iyileşmesinin parasal karşılığı e-ticaretten daha büyük olabilir.",
          en: "No. Any business that defines a measurable action on its site can do CRO: a manufacturer collecting quote requests, a clinic booking appointments, a software company taking demo requests. What changes is not the method but the conversion being measured. Where decision cycles are long, macro conversions are rare, so micro conversions move to the front — technical document downloads, pricing page views, completing the first step of a form. Since one won customer is worth a great deal in those businesses, a small improvement in rate can be worth more in money than it would be in e-commerce.",
        },
      },
    ],
    category: "growth",
    topic: "cro",
    tags: ["cro", "donusum-optimizasyonu", "ab-testi", "funnel-analizi", "sepet-terk-orani"],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-08-28",
    readingMinutes: 14,
    seo: {
      title: {
        tr: "CRO nedir? Dönüşüm oranı optimizasyonu",
        en: "What is CRO? Conversion rate optimisation",
      },
      description: {
        tr: "Dönüşüm oranı nedir, CRO süreci nasıl işler? Ölçüm, funnel analizi, ab testi ve sepet terki disiplini — GYMWOLVES'te 3 ayda 12 kat satışa çıkan yöntem.",
        en: "What is a conversion rate and how does CRO work? Measurement, funnel analysis, A/B testing and cart abandonment — the method behind 12x sales in 3 months.",
      },
    },
  },
  {
    slug: {
      tr: "cro-ajansi-nasil-secilir",
      en: "how-to-choose-a-cro-agency",
    },
    title: {
      tr: "Garantili artış vaat eden teklif: CRO ajansı seçerken neye bakılır?",
      en: "The proposal that guarantees a lift: how to choose a CRO agency",
    },
    excerpt: {
      tr: "Sunum dosyaları birbirine benziyor, referans listeleri birbirine benziyor. Ayrım beş kriterde, sekiz soruda ve üç kırmızı bayrakta ortaya çıkıyor.",
      en: "The decks look alike and the client lists look alike. The difference shows up in five criteria, eight questions and three red flags.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Deniz'in masasında iki teklif vardı. Birincisi üç ayda dönüşüm oranında garantili yüzde otuz artış vaat ediyor, fiyatı diğerinin yarısı ediyordu. İkincisi hiçbir artış rakamı vermiyor, bunun yerine ilk altı haftada hangi ölçümlerin onarılacağını madde madde yazıyordu. Deniz birincisini seçti.",
          en: "Two proposals sat on Deniz's desk. The first guaranteed a thirty percent lift in conversion rate within three months, at half the price of the other. The second gave no lift figure at all; instead it listed, line by line, which measurements would be repaired in the first six weeks. Deniz picked the first.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dördüncü ayın sonunda elinde on dört slaytlık bir sunum, üç \"kazanan\" test ve neredeyse hiç kıpırdamamış bir dönüşüm oranı kaldı. Testlerin hiçbiri iki haftadan uzun sürmemişti. Hiçbirinin altında kaç ziyaretçiyle çalışıldığına dair bir hesap yoktu. Sözleşmedeki yüzde otuz ise hangi metriğin, hangi dönemde, hangi tabana göre ölçüleceğine bağlanmamıştı. Deniz'i bu yazı için kurguladım; yazıdaki tek kurgu da o.",
          en: "By the end of the fourth month what remained was a fourteen-slide deck, three \"winning\" tests and a conversion rate that had barely moved. None of the tests had run longer than two weeks. None came with a calculation of how many visitors they were based on. And the thirty percent in the contract was never tied to a metric, a period or a baseline. I invented Deniz for this article; that is the only invented thing in it.",
        },
      },
      {
        type: "p",
        text: {
          tr: "CRO ajansı seçmek bir tedarikçi seçimi değil, ölçüm ortağı seçimidir. Yanlış seçim yalnızca bütçeyi götürmez, sonraki bir yılın kararlarını da bozar — çünkü hatalı ölçülmüş bir test, yanlış bilgiyi doğru bilgi kılığında geride bırakır. Aşağıda beş değerlendirme kriteri, ilk görüşmede sorulacak sekiz soru ve masadan kalkmanız gereken üç vaat var. İşin kendisi nasıl yürür sorusunun cevabı [dönüşüm optimizasyonu hizmetimizde](/hizmetler/cro), kavramın tanımı ise [CRO nedir yazısında](/yazilar/cro-nedir) duruyor.",
          en: "Choosing a CRO agency is not choosing a supplier; it is choosing a measurement partner. A wrong choice costs more than the budget — it corrupts the next year of decisions, because a badly measured test leaves false information behind dressed as fact. Below are five evaluation criteria, eight questions for the first meeting and three promises that should end the conversation. How the work itself runs is set out on our [conversion optimisation service page](/hizmetler/cro), and the definition of the term sits in [what CRO is](/yazilar/cro-nedir).",
        },
      },
      {
        type: "h2",
        id: "cro-ajansi-ne-satar",
        text: {
          tr: "CRO ajansı ne satar, ne satmaz?",
          en: "What does a CRO agency sell, and what doesn't it?",
        },
      },
      {
        type: "p",
        text: {
          tr: "CRO ajansı size trafik satmaz; mevcut trafikten daha fazla satış ya da teklif talebi çıkarma yöntemini satar. Bu ayrım sözleşme imzalanmadan netleşmezse iki taraf da baştan yanlış işi bekler.",
          en: "A CRO agency does not sell traffic; it sells the method for pulling more sales or enquiries out of the traffic you already have. If that distinction isn't settled before signing, both sides spend the engagement waiting for the wrong work.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir dönüşüm optimizasyonu ajansı üç şeyi teslim eder: ziyaretçinin nerede vazgeçtiğinin sayısal dökümü, o noktaları düzeltmek için sıralanmış hipotezler ve her hipotezin testle doğrulanmış sonucu. Satmadığı şeyler ise reklam bütçesinin yönetimi, yeni ziyaretçi kaynağı ve ürünün pazara oturması.",
          en: "A conversion optimisation agency delivers three things: a numbered account of where visitors drop off, a prioritised set of hypotheses for fixing those points, and a tested result for each hypothesis. What it does not sell is media buying, a new source of visitors, or product-market fit.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu sınır önemli, çünkü CRO danışmanlığı yanlış soruna uygulandığında en pahalı hatayı üretir. Ayda birkaç yüz ziyaretçi alan bir sitede A/B testi rastlantıyı ölçer. Sayfaları saniyelerce açılmayan bir sitede sorun ikna değil altyapıdır. İyi ajans bunu ilk görüşmede söyler ve sizi başka bir işe yönlendirir; zayıf ajans sözleşmeyi imzalar.",
          en: "The boundary matters, because CRO consultancy applied to the wrong problem produces the most expensive mistake of all. On a site with a few hundred visitors a month, an A/B test measures noise. On a site whose pages take seconds to load, the problem is infrastructure rather than persuasion. A good agency says this in the first meeting and points you elsewhere; a weak one signs the contract.",
        },
      },
      {
        type: "h2",
        id: "olcum-altyapisi",
        text: {
          tr: "Ajans ölçüm altyapınıza nasıl bakıyor?",
          en: "How does the agency treat your measurement stack?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İlk kriter budur: ajans teste başlamadan önce mevcut ölçümü doğruluyor mu? Yanlış kurulmuş bir dönüşüm tanımı, üzerine kurulan her testi olduğu gibi geçersiz kılar — ve kimse fark etmez, çünkü rapor yine dolu gelir.",
          en: "This is the first criterion: does the agency validate your existing measurement before it runs a single test? A badly defined conversion event invalidates every test built on top of it — and nobody notices, because the report still arrives full.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Görüşmede şunu sorun: \"İlk iki haftada ölçüm tarafında ne yapacaksınız?\" İyi cevap somuttur — dönüşüm olaylarının yeniden tanımlanması, çift sayımın ayıklanması, kanal atıflarının kontrolü, mobil ve masaüstü akışların ayrı doğrulanması. Zayıf cevap tek cümledir: \"Mevcut kurulumunuzu kullanırız.\"",
          en: "Ask this in the meeting: \"What will you do on the measurement side in the first two weeks?\" A good answer is concrete — conversion events redefined, double counting removed, channel attribution checked, mobile and desktop flows verified separately. A weak answer is one sentence: \"We'll use your current setup.\"",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ölçümü önce onarmanın bedeli baştan görünür, getirisi geç görünür — ama görünür. [SOYLU AVM vakasında](/vakalar/soylu-avm-e-ticaret-buyume) piksel ve dönüşüm izleme kampanyadan önce sıfırdan kuruldu; ilk 6 günde kaydedilen 1,5 milyon dolarlık geliri ve toplam trafikteki %150 artışı okunabilir kılan şey tam olarak o sıraydı. Ölçüm sonradan eklenen bir madde değil, birinci maddedir.",
          en: "Repairing measurement first has a visible cost and a delayed return — but it does return. In [the SOYLU AVM case](/vakalar/soylu-avm-e-ticaret-buyume), pixels and conversion tracking were rebuilt from scratch before any campaign went live; what made the $1.5M recorded in the first 6 days and the 150% rise in total traffic readable at all was exactly that order. Measurement is not a later line item; it is the first one.",
        },
      },
      {
        type: "h2",
        id: "hipotez-disiplini",
        text: {
          tr: "Hipotez disiplini mi, uzun bir fikir listesi mi?",
          en: "Hypothesis discipline, or a long list of ideas?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkinci kriter, ajansın bir fikri hipoteze çevirip çeviremediğidir. Hipotez üç parçadan oluşur: neyi değiştiriyoruz, neden değiştiriyoruz, hangi metrikte ne kadarlık bir fark bekliyoruz.",
          en: "The second criterion is whether the agency turns ideas into hypotheses. A hypothesis has three parts: what we change, why we change it, and how much movement we expect in which metric.",
        },
      },
      {
        type: "p",
        text: {
          tr: "\"Butonu turuncu yapalım\" bir fikirdir. \"Sepete ekle butonu mobilde ilk ekranın altında kaldığı için tıklanma oranı düşük; butonu sabitlersek mobil sepete ekleme oranında en az %10 göreli artış bekliyoruz\" bir hipotezdir. Aradaki fark üslup değil: ikincisi yanlış çıkabilir, birincisi çıkamaz. Yanlış çıkabilen cümle ölçülebilir, çıkamayan cümle tartışılır.",
          en: "\"Let's make the button orange\" is an idea. \"The add-to-cart button falls below the fold on mobile, so its click rate is low; pinning it should lift mobile add-to-cart rate by at least 10% relative\" is a hypothesis. The difference isn't style: the second can be proven wrong, the first cannot. A sentence that can be wrong is measurable; one that cannot is only arguable.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ajanstan mevcut bir müşterisinin test listesinden anonimleştirilmiş beş satır isteyin. Her satırda beklenen etki ve uygulama eforu yazıyorsa sıralama disiplini vardır. Yalnızca değişiklik başlıkları duruyorsa, elinizde bir yöntem değil bir yapılacaklar listesi var demektir. Listede kaybeden testler de duruyorsa, doğru masadasınız.",
          en: "Ask the agency for five anonymised lines from a current client's test backlog. If each line carries an expected impact and an implementation effort, the prioritisation discipline exists. If all you see are change titles, what you have is a to-do list rather than a method. And if losing tests are still on the list, you are at the right table.",
        },
      },
      {
        type: "h2",
        id: "test-suresi-durustlugu",
        text: {
          tr: "Test süresi konusunda dürüst mü?",
          en: "Is the agency honest about test duration?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üçüncü kriter en çok atlanandır: ajans bir testin ne kadar süreceğini önceden hesaplıyor mu? Örneklem büyüklüğü hesabı yapmayan ajans, testi ne zaman durduracağına sonuca bakarak karar verir — bu da testi bir ölçüm aracı olmaktan çıkarır.",
          en: "The third criterion is the one most often skipped: does the agency calculate how long a test needs to run before it starts? An agency that skips the sample size calculation decides when to stop a test by looking at the result — which stops it from being a measurement at all.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Rakamla konuşalım. Aylık 20.000 ziyaretçi alan ve %2 dönüşen bir sayfada, %10'luk göreli bir artışı güvenle ayırt etmek için varyant başına on binlerce oturum gerekir; bu çoğu sitede hafta demektir, gün değil. Ajans bu hesabı görüşmede yapabiliyorsa bir yöntemi vardır. \"Birkaç güne sonuç alırız\" diyorsa size istatistik değil his satıyordur.",
          en: "Put numbers on it. On a page with 20,000 visitors a month converting at 2%, separating a 10% relative lift from noise takes tens of thousands of sessions per variant — on most sites, weeks rather than days. An agency that can run that calculation in the meeting has a method. One that says \"we'll have results in a few days\" is selling an impression, not a statistic.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dürüstlüğün ikinci göstergesi erken durdurma politikasıdır. İyi ajans karar eşiğini ve süreyi testten önce yazıya döker, sonra ona uyar. Test üçüncü günde iyi göründüğü için kapatılıyorsa, kazanan varyant çoğu zaman gürültüdür — ve o gürültü siteye kalıcı olarak yerleşir.",
          en: "The second marker of honesty is the early-stopping policy. A good agency writes down the decision threshold and the duration before the test starts, then holds to them. If a test is closed on day three because it looks good, the winning variant is usually noise — and that noise then ships to the live site permanently.",
        },
      },
      {
        type: "h2",
        id: "raporlama-seffafligi",
        text: {
          tr: "Raporlama ne kadar şeffaf?",
          en: "How transparent is the reporting?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dördüncü kriter tek soruya iner: raporda kaybeden testler var mı? Yalnızca kazananları taşıyan bir belge rapor değil, sunumdur.",
          en: "The fourth criterion reduces to one question: are the losing tests in the report? A document that carries only winners is a presentation, not a report.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Şeffaf bir CRO raporu dört şeyi taşır: her testin hipotezi, çalıştığı süre ve toplanan örneklem, sonucu (kazandı, kaybetti, fark yok) ve o sonucun hangi kararı değiştirdiği. \"Fark yok\" çıkan testler birer başarısızlık değil, envanterin parçasıdır; hangi fikrin işe yaramadığını bilmek bir sonraki çeyreğin bütçesini korur.",
          en: "A transparent CRO report carries four things: each test's hypothesis, the duration and sample collected, the outcome (won, lost, no difference), and the decision that outcome changed. Tests that come back \"no difference\" are not failures but inventory; knowing which idea didn't work protects next quarter's budget.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Raporun kim tarafından anlatıldığı da bir sinyaldir. Aylık toplantıda test sonuçlarını analist değil de satış temsilcisi anlatıyorsa, aradaki katman bilgiyi süzüyordur. Aynı toplantıda şunu da sorun: çalışma bittiğinde test kurulumu, dönüşüm tanımları ve geçmiş test kayıtları kimde kalıyor? Cevap \"bizde\" ise satın aldığınız şey optimizasyon değil bağımlılıktır.",
          en: "Who presents the report is a signal too. If the monthly meeting is run by an account manager rather than the analyst, a layer is filtering the information. Ask this in the same meeting: when the engagement ends, who keeps the testing setup, the conversion definitions and the archive of past tests? If the answer is \"we do\", what you bought is dependency rather than optimisation.",
        },
      },
      {
        type: "h2",
        id: "ucretlendirme-modelleri",
        text: {
          tr: "Hangi ücretlendirme modeli sizin için doğru?",
          en: "Which pricing model is right for you?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Beşinci kriter fiyatın kendisi değil, fiyatın yapısıdır. Dört model dolaşımda ve her biri ajansın farklı bir davranışını ödüllendirir.",
          en: "The fifth criterion is not the price but the shape of the price. Four models are in circulation, and each rewards a different agency behaviour.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Aylık retainer: sabit ücret, sürekli test döngüsü. Trafiği yüksek ve sık değişen sitelerde yerinde bir model; ancak aylık test sayısı ve ortalama test süresi sözleşmeye baştan yazılmalı.",
            en: "Monthly retainer: a fixed fee and a continuous testing cycle. Sound for high-traffic sites that change often — but the number of tests per month and the average test duration belong in the contract from day one.",
          },
          {
            tr: "Proje bazlı: sabit kapsam, sabit süre, sabit fiyat. İlk denetim ve ölçüm onarımı için doğru model; sürekli optimizasyonu tek başına taşımaz.",
            en: "Project-based: fixed scope, fixed duration, fixed price. The right model for a first audit and a measurement repair; on its own it does not carry continuous optimisation.",
          },
          {
            tr: "Sonuç bazlı: ücretin bir kısmı dönüşüm artışına bağlanır. Kulağa adil gelir ve tek koşulu vardır — artışın tanımı, ölçüm kaynağı ve baz dönem sözleşmede yazılı olmalı. Yazılı değilse model ajansın lehine çalışır.",
            en: "Performance-based: part of the fee is tied to the lift. It sounds fair and has exactly one condition — the definition of the lift, the source of measurement and the baseline period must be written into the contract. Unwritten, the model works in the agency's favour.",
          },
          {
            tr: "Araç lisansı artı kurulum: ajans esasen bir test aracının bayisidir. Lisans gerekli olabilir, ama tek başına satın aldığınız şey yazılımdır, yöntem değil.",
            en: "Tool licence plus setup: the agency is essentially a reseller for a testing tool. The licence may well be necessary, but on its own what you have bought is software, not method.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Model seçerken tek bir soru işi görür: bu ücretlendirme ajansın hangi davranışını ödüllendiriyor? Test sayısını ödüllendiren model çok ve kısa test üretir; öğrenmeyi ödüllendiren model az ve uzun test üretir. İkincisi daha yavaş görünür ve daha hızlı ilerler.",
          en: "One question settles the choice: which agency behaviour does this pricing reward? A model that rewards test volume produces many short tests; a model that rewards learning produces fewer long ones. The second looks slower and moves faster.",
        },
      },
      {
        type: "h2",
        id: "gorusmede-sekiz-soru",
        text: {
          tr: "İlk görüşmede hangi sekiz soruyu sorarsınız?",
          en: "Which eight questions do you ask in the first meeting?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Sekiz soru bir eleme aracı değil, bir dinleme aracıdır. Asıl bilgi verilen cevapta değil, ajansın nerede duraksadığında saklıdır.",
          en: "The eight questions are a listening device, not a filter. The real information isn't in the answer given — it is in where the agency hesitates.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "İlk iki haftada ölçüm tarafında tam olarak ne yapacaksınız?",
            en: "What exactly will you do on the measurement side in the first two weeks?",
          },
          {
            tr: "Bir test için gereken örneklemi nasıl hesaplıyorsunuz?",
            en: "How do you calculate the sample size a test needs?",
          },
          {
            tr: "Testi ne zaman durduracağınıza nasıl karar veriyorsunuz ve bu karar önceden yazılı mı?",
            en: "How do you decide when to stop a test, and is that decision written down in advance?",
          },
          {
            tr: "Son çeyrekte kaç testiniz kaybetti ve hangisinden ne öğrendiniz?",
            en: "How many of your tests lost last quarter, and what did you learn from which one?",
          },
          {
            tr: "Benim sektörümde benzer ölçekte hangi işi yaptınız, rakamlarını görebilir miyim?",
            en: "What have you done at a similar scale in my sector, and can I see the numbers?",
          },
          {
            tr: "Raporda kaybeden testler nasıl görünüyor?",
            en: "What do losing tests look like in the report?",
          },
          {
            tr: "Çalışma bittiğinde geriye ne kalıyor ve kurulum kimde duruyor?",
            en: "When the engagement ends, what is left behind and who holds the setup?",
          },
          {
            tr: "Bu işi almamanız gereken bir durum var mı?",
            en: "Is there a situation in which you should turn this work down?",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Sekizinci soru en çok bilgiyi verendir. \"Her sitede çalışırız\" cevabı çoğu zaman doğrudur ama tek başına söylendiğinde hiçbir şey ifade etmez. Hangi durumda sizi reddedeceğini söyleyebilen ajans kendi kapsamını biliyor demektir; bilmeyen ajans kapsamı sizin bütçenizle öğrenir.",
          en: "The eighth question yields the most. \"We work with any site\" is usually true and means nothing on its own. An agency that can name the case in which it would turn you away knows its own scope; one that cannot will learn that scope on your budget.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu sorular ajans seçiminin CRO'ya özgü katmanıdır. İlişkinin genel katmanı — veri kullanımı, kanal bütünlüğü, kriz refleksi — için [sözleşmeyi imzalamadan önce ajansa sorulacak 8 soru](/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru) yazısı aynı disiplini daha geniş bir çerçevede kuruyor.",
          en: "These cover the CRO-specific layer of the choice. For the general layer — how data is used, whether channels cohere, how the team reacts in a crisis — [the eight questions to ask an agency before you sign](/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru) applies the same discipline to a wider frame.",
        },
      },
      {
        type: "h2",
        id: "kirmizi-bayraklar",
        text: {
          tr: "Hangi üç vaat sizi masadan kaldırmalı?",
          en: "Which three promises should end the meeting?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üç vaat var ki, duyulduğu anda görüşmenin geri kalanı gereksizleşir. Üçü de aynı şeyi gizler: ölçmeden konuşma alışkanlığını.",
          en: "Three promises make the rest of the meeting unnecessary the moment you hear them. All three hide the same habit: talking without measuring.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Birincisi garantili artış vaadi. \"Üç ayda %30 dönüşüm artışı garanti ediyoruz\" cümlesi verilemez, çünkü sonuç mevcut sorunların büyüklüğüne, trafiğe ve kategoriye bağlıdır. Aralık vermek dürüstlüktür, garanti vermek satıştır — ve garantiyi veren teklifte artışın tanımı çoğu zaman boş bırakılmıştır.",
          en: "The first is the guaranteed lift. \"We guarantee a 30% conversion increase in three months\" cannot honestly be said: the outcome depends on the size of the existing problems, on traffic and on category. A range is honesty; a guarantee is a sale — and guaranteeing proposals usually leave the definition of the lift blank.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İkincisi örneklem hesabı yapmayan ajanstır. \"Testi ne kadar çalıştıracaksınız?\" sorusuna süre yerine \"sonuç netleşene kadar\" cevabı geliyorsa, ölçüm yerine izlenim satılıyordur. Üçüncüsü yalnızca araç lisansı satan modeldir: ısı haritası, oturum kaydı ve test aracı işin gereçleridir, hiçbiri işin kendisi değildir. Araç kurulumuyla biten bir teklifte eksik olan şey hipotez üretimi, sıralama ve karardır — yani ücretin karşılığı.",
          en: "The second is the agency that never calculates a sample size. If \"how long will you run the test?\" gets \"until the result is clear\" instead of a duration, you are buying an impression, not a measurement. The third is the licence-only model: heatmaps, session recordings and testing tools are instruments of the work, never the work. A proposal that ends at tool installation is missing hypothesis generation, prioritisation and decision — the things the fee is for.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dördüncü bir işaret daha var; sessiz olduğu için daha tehlikeli. Fiyatı planı görmeden veren ajans, kapsamı ya sonradan daraltır ya da sonradan büyütür. İkisi de aynı yere çıkar: pazarlığın merkezine işin değil, faturanın oturması.",
          en: "There is a fourth marker, more dangerous because it is quieter. An agency that prices before it has seen a plan will later either shrink the scope or grow it. Both lead to the same place: the invoice, rather than the work, sitting at the centre of the relationship.",
        },
      },
      {
        type: "h2",
        id: "rakamli-vaka-istemek",
        text: {
          tr: "Rakamlı vaka nasıl istenir?",
          en: "How do you ask for a case with numbers?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Vaka istemek kolaydır, doğru vakayı istemek değil. Sunumdaki logo duvarı bir kanıt değil, bir müşteri listesidir.",
          en: "Asking for a case study is easy; asking for the right one is not. The wall of logos is a client list, not evidence.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üç şeyi birlikte isteyin: başlangıç değeri, bitiş değeri ve arada geçen süre. \"Dönüşüm oranını artırdık\" bir cümledir; \"dönüşüm oranı %1,4'ten %2,1'e çıktı, dokuz haftada, şu sayfada\" bir kayıttır. Bağlamı olmayan yüzde, üretilmesi en kolay rakamdır.",
          en: "Ask for three things together: the starting value, the ending value and the time between them. \"We increased the conversion rate\" is a sentence; \"the conversion rate went from 1.4% to 2.1% in nine weeks, on this page\" is a record. A percentage without context is the easiest number in the world to produce.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kendi tarafımızdan aynı ölçüyle bir örnek: [GYMWOLVES'te hedef, satışı 3 ayda ikiye katlamaktı](/vakalar/gymwolves-12-kat-satis). Veri akışı onarıldı, dönüşüm hunisi yeniden kuruldu ve kampanya sporcularla çekilen sosyal kanıtla beslendi; üçüncü ayın sonunda satış 12 katına, oturum süresi 3 katına, etkileşim 8 katına çıktı. Buradaki asıl bilgi 12 katı değil, sıradır: önce ölçüm, sonra huni, sonra kampanya.",
          en: "Here is one from our own side, held to the same standard: [at GYMWOLVES the target was to double sales in 3 months](/vakalar/gymwolves-12-kat-satis). The data flow was repaired, the funnel rebuilt and the campaign fed with social proof shot with athletes; by the end of the third month sales were up 12×, session duration 3× and engagement 8×. The useful information there isn't the 12× — it is the order: measurement first, then the funnel, then the campaign.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir de şunu isteyin: işe yaramamış bir çalışma. Beklediği sonucu vermeyen bir projeyi anlatabilen ajans, size sonraki sekiz ay boyunca da doğruyu söyleyecek olan ajanstır.",
          en: "Then ask for one more thing: a piece of work that failed. An agency that can walk you through a project which missed its expected result is the one that will keep telling you the truth for the next eight months.",
        },
      },
      {
        type: "h2",
        id: "ajans-uzman-ic-ekip",
        text: {
          tr: "Ajans mı, CRO uzmanı mı, iç ekip mi?",
          en: "Agency, a CRO specialist, or an in-house team?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Karar, kaybın nerede durduğuna bağlıdır. Tek bir sayfada veya tek bir adımda kayıp varsa bir CRO uzmanı yeterlidir; kayıp ölçüm, arayüz, içerik ve teknik altyapı arasına dağılmışsa tek kişi bu katmanları aynı anda tutamaz.",
          en: "The decision depends on where the loss sits. If the loss is on one page or at one step, a CRO specialist is enough; if it is spread across measurement, interface, content and technical infrastructure, one person cannot hold those layers at the same time.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İç ekip kurmak üç koşulda mantıklıdır: aylık trafik sürekli test yürütmeye yetiyorsa, ürün ekibi kazanan testi iki hafta içinde yayına alabiliyorsa ve şirket kaybeden testi bir başarısızlık saymıyorsa. Üçüncüsü en zor koşuldur ve çoğu zaman bütçesel değil kültürel bir karardır.",
          en: "Building in-house makes sense under three conditions: monthly traffic sustains continuous testing, the product team can ship a winning variant within two weeks, and the company does not treat a losing test as a failure. The third is the hardest, and it is usually a cultural decision rather than a budgetary one.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Melez model orta ölçekli markaların çoğu için doğru cevaptır: ajans ilk altı ayda ölçümü kurar, ilk test dalgasını yürütür ve düzeni iç ekibe devreder; sonrasında dışarısı yalnızca hipotez üretimi ve denetim için kalır. Bu modelde ajansın başarısı kendini gereksizleştirmesiyle ölçülür, dolayısıyla devir oturumunu sözleşmeye yazdırın.",
          en: "For most mid-sized brands the hybrid model is the right answer: over six months the agency builds the measurement, runs the first wave of tests and hands the routine to the in-house team; the outside role then narrows to hypothesis generation and review. Here the agency's success is measured by how unnecessary it makes itself — so put the handover session in the contract.",
        },
      },
      {
        type: "h2",
        id: "sonuc-tek-test",
        text: {
          tr: "Sonuç: seçimden önce yapabileceğiniz tek test",
          en: "Conclusion: the one test to run before you choose",
        },
      },
      {
        type: "p",
        text: {
          tr: "CRO ajansı seçimi bir sunum karşılaştırması değil, bir yöntem denetimidir. Ölçümü önce onaran, fikri hipoteze çeviren, testin süresini önceden hesaplayan ve kaybettiği testi raporda gösteren ajans; garanti veren ajanstan her koşulda daha iyi bir yatırımdır. Çünkü birincisi size sonuç kadar gerekçe de bırakır.",
          en: "Choosing a CRO agency is an audit of method, not a comparison of decks. An agency that repairs measurement first, turns ideas into hypotheses, calculates test duration in advance and shows its losses in the report is a better investment than one offering guarantees, in every case. The first kind leaves you with the reasoning as well as the result.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bugün yapabileceğiniz somut test şu: kendi sitenizden tek bir sayfa seçin, o sayfanın mevcut dönüşüm oranını ve aylık ziyaretçi sayısını not edin, sonra görüştüğünüz her ajansa aynı soruyu sorun — \"Bu sayfada %10'luk göreli bir artışı ayırt etmek için kaç ziyaretçi ve kaç gün gerekir?\" Görüşmede bir aralık verebilen ajans hesabı biliyordur. \"Bakıp döneriz\" diyenle çalışmadan önce bir kez daha düşünün.",
          en: "Here is the concrete test you can run today: pick a single page on your own site, note its current conversion rate and monthly visitors, then ask every agency you meet the same question — \"How many visitors and how many days would it take to detect a 10% relative lift on this page?\" An agency that can give you a range in the meeting knows the calculation. Think twice before signing with one that says it will look into it and get back to you.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu soruları bize de sorun. Yöntemin adım sırası [dönüşüm optimizasyonu hizmet sayfamızda](/hizmetler/cro) açıkça yazılı; cevapları yan yana koyup karşılaştırın.",
          en: "Ask us the same questions. The sequence of our method is written out on [our conversion optimisation service page](/hizmetler/cro); put the answers side by side and compare them.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "CRO ajansı tam olarak ne yapar?",
          en: "What exactly does a CRO agency do?",
        },
        answer: {
          tr: "Mevcut trafikten daha fazla satış veya teklif talebi çıkarır. İş dört adımda yürür: ölçüm altyapısının doğrulanması, ziyaretçinin nerede vazgeçtiğinin analitik veri, oturum kaydı ve ısı haritasıyla saptanması, kayıp noktaları için hipotez üretilip sıralanması, her hipotezin A/B testiyle doğrulanması. Yeni ziyaretçi getirmek, reklam bütçesi yönetmek ve ürünü pazara oturtmak bu kapsamın dışındadır.",
          en: "It pulls more sales or enquiries out of the traffic you already have. The work runs in four steps: validating the measurement stack, locating where visitors drop off using analytics, session recordings and heatmaps, generating and prioritising hypotheses for those leaks, and validating each one with an A/B test. Bringing new visitors, running media budgets and finding product-market fit all sit outside that scope.",
        },
      },
      {
        question: {
          tr: "CRO ajansı ile CRO danışmanlığı arasındaki fark nedir?",
          en: "What's the difference between a CRO agency and CRO consultancy?",
        },
        answer: {
          tr: "Teslim edilen şeyde ayrışırlar. Ajans modeli çoğunlukla test kurar ve rapor teslim eder; CRO danışmanlığı kaybın nerede olduğunu bulup o noktanın düzeltilmesini üstlenir. Pratikte ayrımı anlamanın yolu sözleşmeye bakmaktır: teslimat listesinde yalnızca rapor ve gösterge paneli varsa birinci model, yayına alınmış düzeltmeler ve devredilen bir test düzeni varsa ikinci model konuşuluyordur.",
          en: "They part ways at what gets delivered. The agency model usually sets up tests and hands over reports; CRO consultancy takes responsibility for finding the leak and getting it fixed. In practice the contract tells you which one you are buying: if the deliverables list stops at reports and dashboards it is the first model, and if it includes shipped fixes plus a testing routine handed to your team it is the second.",
        },
      },
      {
        question: {
          tr: "Seçim görüşmesinde ilk hangi soruyu sormalıyım?",
          en: "What should the first question in a selection meeting be?",
        },
        answer: {
          tr: "\"İlk iki haftada ölçüm tarafında ne yapacaksınız?\" Bu soru diğerlerinden daha çok bilgi verir, çünkü yanlış kurulmuş bir dönüşüm tanımı üzerine kurulan her testi geçersiz kılar ve bu geçersizlik raporda görünmez. Cevap somut adımlar içeriyorsa yöntem vardır; \"mevcut kurulumunuzu kullanırız\" cevabı geliyorsa ajans altı ay boyunca hatalı veriyle karar alacak demektir.",
          en: "Start with: \"What will you do on the measurement side in the first two weeks?\" It yields more than any other question, because a badly defined conversion event invalidates every test built on it and that invalidity never shows up in the report. Concrete steps in the answer mean there is a method; \"we'll use your current setup\" means the agency will be making decisions on faulty data for six months.",
        },
      },
      {
        question: {
          tr: "\"Garantili dönüşüm artışı\" vaadi neden kırmızı bayrak?",
          en: "Why is a \"guaranteed conversion lift\" a red flag?",
        },
        answer: {
          tr: "Böyle bir garanti matematiksel olarak verilemez. Sonuç mevcut sorunların büyüklüğüne, trafik hacmine, kategoriye ve ürünün fiyat konumuna bağlıdır; bunların hiçbirini ajans görüşme anında bilmez. Dürüst yaklaşım aralık vermektir ve aralığın da bir gerekçesi olmalıdır. Ayrıca garanti veren tekliflerde artışın tanımı, ölçüm kaynağı ve baz dönemi genellikle yazılmaz — yani garanti edilen şeyin ne olduğu belirsiz kalır.",
          en: "No such guarantee can honestly be given. The outcome depends on the size of the existing problems, on traffic volume, on category and on the product's price position — none of which the agency knows during a first meeting. The honest approach is a range, with a stated reason behind it. Guaranteeing proposals also tend to leave the definition of the lift, its measurement source and its baseline period unwritten, so what is being guaranteed stays undefined.",
        },
      },
      {
        question: {
          tr: "Bir CRO ajansı ne kadar sürede sonuç verir?",
          en: "How long before a CRO agency produces results?",
        },
        answer: {
          tr: "Tek bir A/B testi güvenilir sonuç için genellikle iki ila dört hafta çalışır; süre trafiğe ve mevcut dönüşüm oranına bağlıdır. İlk iki haftası ölçüm onarımına gittiği için ilk yayına alınmış düzeltme çoğunlukla ikinci ayda görülür. Ölçülebilir bir birikimden söz edebilmek içinse bir çeyrek gerekir, çünkü tek test bir sonuç değil bir veri noktasıdır.",
          en: "A single A/B test usually needs two to four weeks to give a trustworthy answer, and the duration depends on traffic and on the current conversion rate. Since the first two weeks go to repairing measurement, the first shipped fix typically lands in the second month. Talking about a measurable accumulation takes a quarter, because one test is a data point rather than a result.",
        },
      },
      {
        question: {
          tr: "CRO ajansı ücretlendirmesi nasıl yapılandırılmalı?",
          en: "How should CRO agency pricing be structured?",
        },
        answer: {
          tr: "Modeli işin evresine göre seçin. İlk denetim ve ölçüm onarımı için proje bazlı sabit fiyat doğrudur; sürekli test döngüsü için aylık retainer uygundur ve aylık test sayısı ile ortalama test süresi sözleşmeye yazılmalıdır. Sonuç bazlı modelde artışın tanımı, ölçüm kaynağı ve baz dönem yazılı değilse model ajansın lehine çalışır. Yalnızca araç lisansı ve kurulum içeren teklifte satın alınan şey yazılımdır.",
          en: "Match the model to the phase of the work. A fixed-price project fits the first audit and measurement repair; a monthly retainer fits a continuous testing cycle, with the number of tests per month and the average test duration written into the contract. In a performance-based model, an unwritten definition of the lift, its measurement source and its baseline works in the agency's favour. A proposal covering only a tool licence and setup is a software purchase.",
        },
      },
      {
        question: {
          tr: "Az trafikli bir sitede CRO ajansıyla çalışmak mantıklı mı?",
          en: "Does hiring a CRO agency make sense on a low-traffic site?",
        },
        answer: {
          tr: "A/B testi için genellikle ayda birkaç bin ziyaretçi ve düzenli dönüşüm gerekir; bunun altında test rastlantıyı ölçer. Böyle bir sitede doğru yol doğrudan denetimdir: form, checkout ve mobil akıştaki bariz engeller ölçüm beklemeden düzeltilir, sonra trafik büyüdükçe test devreye girer. Trafik neredeyse hiç yoksa sıra yanlış başlamıştır ve önce talep yaratma işi gelir.",
          en: "Reliable A/B testing usually needs a few thousand visitors and a steady flow of conversions per month; below that, a test measures chance. On such a site the right route is a direct audit: obvious blockers in forms, checkout and the mobile flow get fixed without waiting for data, and testing enters once traffic grows. If there is almost no traffic at all, the order is wrong and demand generation comes first.",
        },
      },
      {
        question: {
          tr: "Sadece araç lisansı satan bir ajansı nasıl anlarım?",
          en: "How do I spot an agency that only sells a tool licence?",
        },
        answer: {
          tr: "Teklifin teslimat listesine bakın. Liste araç kurulumu, gösterge paneli ve eğitim ile bitiyorsa satılan şey yazılımdır. Yöntem satan bir teklifte hipotez üretimi, sıralama kriteri, test takvimi ve karar eşiği açıkça yer alır. Kontrol sorusu şudur: \"Aracı biz kendimiz lisanslasak, sizin işiniz ne olurdu?\" Cevabı zorlanarak veren ajansın katkısı gerçekten lisanstan ibarettir.",
          en: "Read the deliverables list. If it ends at tool installation, a dashboard and a training session, the product is software. A proposal that sells method names hypothesis generation, prioritisation criteria, a testing calendar and a decision threshold explicitly. The check question is: \"If we licensed the tool ourselves, what would your work be?\" An agency that struggles with that answer really is contributing the licence.",
        },
      },
      {
        question: {
          tr: "CRO uzmanı işe almak mı, ajansla çalışmak mı daha doğru?",
          en: "Is hiring a CRO specialist better than working with an agency?",
        },
        answer: {
          tr: "Kaybın dağılımına bakın. Sorun tek sayfada veya tek adımdaysa bir CRO uzmanı yeterlidir ve daha ucuza gelir. Kayıp ölçüm, arayüz, içerik ve teknik altyapı arasına dağılmışsa tek kişi bu katmanları aynı anda tutamaz; orada ekip gerekir. Orta ölçekli markalarda melez model işler: ajans ölçümü kurar ve ilk test dalgasını yürütür, düzeni iç ekibe devreder, dışarısı denetim için kalır.",
          en: "Look at how the loss is distributed. If the problem sits on one page or at one step, a CRO specialist is enough and costs less. If it is spread across measurement, interface, content and technical infrastructure, one person cannot hold those layers at once and a team is needed. For mid-sized brands the hybrid works: the agency builds measurement, runs the first wave of tests, hands the routine over, and stays on for review.",
        },
      },
      {
        question: {
          tr: "Bir dönüşüm optimizasyonu ajansının raporunda ne bulunmalı?",
          en: "What belongs in a conversion optimisation agency's report?",
        },
        answer: {
          tr: "Dört bileşen: her testin hipotezi, çalıştığı süre ve toplanan örneklem, sonucu (kazandı, kaybetti, fark yok) ve o sonucun hangi kararı değiştirdiği. Kaybeden ve fark üretmeyen testler raporda görünmüyorsa elinizdeki belge bir sunumdur. Toplantıyı analistin değil satış temsilcisinin yürütmesi de bir uyarıdır; aradaki katman bilgiyi süzer ve kötü haber en son duyulur.",
          en: "Four components: each test's hypothesis, the duration and sample collected, the outcome (won, lost, no difference), and the decision that outcome changed. If losing and inconclusive tests are missing, the document is a presentation. It is also a warning sign when the meeting is run by an account manager rather than the analyst; that layer filters the information, and bad news arrives last.",
        },
      },
      {
        question: {
          tr: "Ajans değiştirirken neyi devralmam gerekir?",
          en: "What should I take over when switching agencies?",
        },
        answer: {
          tr: "Beş şeyi isteyin ve sözleşmede adlarıyla yazsın: A/B test aracının hesabı ve kurulumu, doğrulanmış dönüşüm tanımları, geçmiş testlerin kaydı (hipotez, süre, örneklem, sonuç), sıraya dizilmiş test listesi ve analitik erişimleri. Geçmiş test kayıtları en çok atlanan kalemdir ve en pahalıya mal olandır: kaydı olmayan şirket aynı hipotezi ikinci kez test eder.",
          en: "Ask for five things, named in the contract: the A/B testing tool account and its setup, the validated conversion definitions, the archive of past tests (hypothesis, duration, sample, outcome), the prioritised test backlog and the analytics access. The archive is the item most often forgotten and the most expensive to lose: a company without it ends up testing the same hypothesis a second time.",
        },
      },
    ],
    category: "growth",
    topic: "cro",
    tags: ["cro", "cro-ajansi", "donusum-optimizasyonu", "ajans-secimi", "ab-testi"],
    authorSlug: "can-aydinlik",
    publishedAt: "2026-08-28",
    readingMinutes: 11,
    seo: {
      title: {
        tr: "CRO ajansı nasıl seçilir? Kontrol listesi",
        en: "How to choose a CRO agency: a checklist",
      },
      description: {
        tr: "CRO danışmanlığı satın alırken ölçüm, hipotez ve test süresi nasıl denetlenir? Beş kriter, sekiz soru, üç kırmızı bayrak ve rakamlı vaka isteme kültürü.",
        en: "Buying CRO consultancy? How to audit measurement, hypotheses and test duration before you sign: five criteria, eight questions, three red flags to walk from.",
      },
    },
  },
  {
    slug: {
      tr: "is-gelistirme-studyosu-nedir",
      en: "what-is-a-business-building-studio",
    },
    title: {
      tr: "İş geliştirme stüdyosu nedir? Kampanya satmakla iş inşa etmek arasındaki fark",
      en: "What is a business building studio? Selling campaigns versus building businesses",
    },
    excerpt: {
      tr: "İş geliştirme stüdyosu, bir şirketin büyüme problemini teşhisten ölçüme kadar tek çatı altında üstlenen yapıdır. Bu yazı modeli tanımlıyor: ajanstan ve danışmanlıktan nerede ayrıldığını, hangi şirkete hangisinin uyduğunu ve iş inşasının sahadaki karşılığını.",
      en: "A business building studio takes on a company's growth problem end to end — from diagnosis to measurement — under one roof. This piece defines the model: where it parts ways with agencies and consultancies, which company each one suits, and what business building looks like in the field.",
    },
    blocks: [
      {
        type: "p",
        text: {
          tr: "Türkiye'de büyümek isteyen bir şirketin önüne genellikle iki kapı çıkar: rapor yazan bir danışmanlık ya da kampanya çıkaran bir ajans. Üçüncü bir kapı daha var, ama Türkçede adı henüz oturmadı. Bu yazı o kapıyı tanımlıyor — iş geliştirme stüdyosu.",
          en: "A company looking to grow in Türkiye usually finds two doors in front of it: a consultancy that writes reports, or an agency that runs campaigns. There is a third door, but in Turkish it has no settled name yet. This piece defines that door — the business building studio.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Baştan bir netleştirme: burası \"iş geliştirme uzmanı nasıl olunur\" sorusunun cevabı değil. Bu metinde iş geliştirme bir kariyer pozisyonu değil, bir işletmenin gelirini ve yapısını büyütme disiplini olarak ele alınıyor. Kariyer tarafını arıyorsanız buradan geri dönmeniz vakit kazandırır.",
          en: "One clarification before anything else: this is not an answer to \"how do I become a business development manager\". Here, business development is not a job title but the discipline of growing a company's revenue and its structure. If you came for the career question, turning back now will save you time.",
        },
      },
      {
        type: "h2",
        id: "is-gelistirme-studyosu-nedir",
        text: {
          tr: "İş geliştirme stüdyosu nedir?",
          en: "What is a business building studio?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İş geliştirme stüdyosu, bir şirketin büyüme veya dönüşüm problemini teşhisten ölçüme kadar tek çatı altında üstlenen; strateji, mühendislik ve kreatif disiplinlerini aynı ekipte birleştiren yapıdır. Danışmanlıktan farkı, rapor teslim edip çekilmemesidir; ajanstan farkı, kampanya değil iş modelinin kendisini kurmasıdır. Çıktısı bir sunum değil, çalışan bir sistemdir: konumlandırma, ürün, kanal, altyapı ve ölçüm birlikte kurulur ve sonucun sorumluluğunu da aynı ekip taşır. İngilizce karşılığı business building studio; kavramın merkezindeki fiil danışmak değil, inşa etmektir.",
          en: "A business building studio is a structure that takes on a company's growth or transformation problem under one roof, from diagnosis through to measurement, holding strategy, engineering and creative inside the same team. It differs from consulting by not handing over a report and withdrawing, and from an agency by building the business model itself rather than a campaign. Its output is not a deck but a working system: positioning, product, channel, infrastructure and measurement are built together, and the same team carries responsibility for the result. The verb at the centre of the idea is building, not advising.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bu tanımın üç ayırt edici yeri var. Birincisi kapsam: stüdyo tek bir disipline değil, probleme sözleşme yapar — sorun fiyatlamadaysa fiyatlamaya, sitedeyse siteye, üretim hattındaysa oraya girer. İkincisi sahiplenme: çıktının sahibi yalnız müşteri değil, kuran ekiptir; \"biz önerdik, uygulanmadı\" cümlesi bu modelde geçerli bir savunma sayılmaz. Üçüncüsü süre: iş kampanya takvimiyle değil, sistemin çalışır hâle geldiği tarihle ölçülür.",
          en: "Three things set that definition apart. First, scope: the studio contracts on the problem rather than on a single discipline — if the trouble sits in pricing it goes to pricing, if it sits in the storefront it goes there, if it sits on the production line it goes to the floor. Second, ownership: the output belongs to the team that built it as much as to the client, and \"we recommended it, they didn't implement it\" is not an accepted defence in this model. Third, duration: the work is measured by the date the system starts running, not by a campaign calendar.",
        },
      },
      {
        type: "h2",
        id: "isletme-acisindan-is-gelistirme-nedir",
        text: {
          tr: "İşletme açısından iş geliştirme nedir?",
          en: "What is business development from a company's point of view?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İş geliştirme, bir işletmenin gelir üretme biçimini genişletme işidir: yeni pazar, yeni kanal, yeni ürün hattı, yeni fiyat mimarisi veya yeni müşteri segmenti. Satıştan ayrıldığı yer nettir — satış mevcut huniden daha çok kapatır, iş geliştirme huninin kendisini kurar veya değiştirir. Pazarlamadan ayrıldığı yer de aynı ölçüde net: pazarlama talebi çeker, iş geliştirme o talebin karşılanacağı yapıyı tasarlar.",
          en: "Business development is the work of widening how a company produces revenue: a new market, a new channel, a new product line, a new price architecture or a new customer segment. Where it parts from sales is clear — sales closes more from the funnel that exists, business development builds or rebuilds the funnel itself. Where it parts from marketing is just as clear: marketing pulls demand in, business development designs the structure that demand lands on.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Terim Türkçede iki ayrı anlam taşıdığı için kafa karıştırıyor. Bir yanda şirketlerdeki \"iş geliştirme uzmanı\" pozisyonu var; pratikte çoğunlukla satış ve ortaklık geliştirme işidir. Öte yanda bir disiplin var: şirketin nereden para kazandığını yeniden tasarlama işi. Bu yazı ikincisini konuşuyor, çünkü bir stüdyonun sözleşme yaptığı şey pozisyon değil, disiplindir.",
          en: "The term carries two separate meanings and that is where the confusion starts. On one side there is the job title inside companies, which in practice usually means sales and partnership work. On the other there is a discipline: redesigning where a company earns its money. This piece is about the second one, because what a studio signs a contract on is a discipline, not a job title.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İş modeli geliştirme bu disiplinin en ağır ucudur: şirketin kime, neyi, hangi fiyatla ve hangi kanaldan sattığı sorusunu yeniden açar. Çoğu şirket bu soruyu yalnızca kriz anında sorar; oysa doğru zaman, marjın erimeye başladığı ilk çeyrektir. Tek bir kanal ciroyu tek başına taşıyorsa, tek bir ürün cironun yarısından fazlasını üretiyorsa veya fiyat rekabeti marjı her yıl birkaç puan yiyorsa iş modeli tarafında bekleyen bir iş var demektir.",
          en: "Business model development is the heaviest end of this discipline: it reopens the question of who the company sells to, what it sells, at what price and through which channel. Most companies only ask that in a crisis, when the right moment is the first quarter margin starts thinning. If one channel carries revenue on its own, if one product makes more than half of it, or if price competition eats a few points of margin every year, there is work waiting on the business model side.",
        },
      },
      {
        type: "h2",
        id: "kampanya-ile-is-insasi-farki",
        text: {
          tr: "Kampanya satmakla iş inşa etmek arasındaki fark ne?",
          en: "What separates selling a campaign from building a business?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kampanya belirli bir zaman aralığında talebi hareketlendirir; iş inşası o talebi üretecek yapıyı kurar. Fark bütçenin büyüklüğünde değil, bütçe bittiğinde geriye ne kaldığındadır — kampanya durunca grafik eski seviyesine döner, kurulmuş bir yapı varsa dönmez.",
          en: "A campaign stirs demand inside a fixed window; business building constructs the structure that produces that demand. The difference is not the size of the budget but what remains once the budget stops — when a campaign ends the chart falls back to where it started, and where a structure was built it does not.",
        },
      },
      {
        type: "p",
        text: {
          tr: "İş inşası (business building), bir şirketin gelir motorunu parça parça kurma disiplinidir: konumlandırma, ürün mimarisi, kanal yapısı, dönüşüm altyapısı ve ölçüm çerçevesi. Reklam bu motorun yakıtıdır, motorun kendisi değil. Yakıtı olan ama motoru olmayan şirket harcadığı sürece büyür ve durduğu anda durur; bunu her yıl aynı bütçe tartışmasında yeniden yaşar.",
          en: "Business building is the discipline of assembling a company's revenue engine piece by piece: positioning, product architecture, channel structure, conversion infrastructure and a measurement frame. Advertising is the fuel for that engine, not the engine itself. A company with fuel and no engine grows while it spends and halts the moment it stops — and relives that fact in the same budget argument every year.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Kampanyayı önce almak mantıksız bir refleks değil: hızlı başlar, ölçmesi kolaydır, iç onayı çabuk alır. Maliyeti gecikmede ortaya çıkar. Üç yıl üst üste kampanya alan bir marka dördüncü yıl aynı satışı sürdürmek için daha yüksek bütçe konuşur, çünkü her yıl talebi sıfırdan satın almıştır.",
          en: "Buying the campaign first is not an irrational reflex: it starts fast, measures easily and clears internal approval quickly. The cost shows up later. A brand that buys campaigns three years running argues for a bigger budget in the fourth just to hold the same sales, because it has purchased its demand from zero every single year.",
        },
      },
      {
        type: "h2",
        id: "ajans-danismanlik-studyo",
        text: {
          tr: "Reklam ajansı, yönetim danışmanlığı ve stüdyo: hangisi neyi çözer?",
          en: "Ad agency, management consultancy, studio: which one solves what?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Üç model farklı problemler için var ve üçünün de yeri var. Ajans talebi hareketlendirir, danışmanlık kararı netleştirir, stüdyo ikisini kurup çalışır hâle getirir. Ayrım kalitede değil, kapsamda ve sahiplenmededir.",
          en: "The three models exist for different problems, and all three have their place. An agency moves demand, a consultancy sharpens the decision, a studio builds both and gets them running. The distinction is not one of quality but of scope and ownership.",
        },
      },
      {
        type: "list",
        items: [
          {
            tr: "Klasik reklam ajansı — kapsam: kampanya, mecra, kreatif. En güçlü olduğu yer, ürünün ve konumlandırmanın oturduğu, eksik olan tek şeyin görünürlük olduğu durumdur. Zayıf kaldığı yer, sorunun kampanyanın altında olmasıdır: fiyat mimarisi, sepet akışı veya ürün karması bozuksa daha çok reklam sonucu değiştirmez.",
            en: "The classic ad agency — scope: campaign, media, creative. It is strongest where product and positioning are settled and visibility is the only missing piece. It is weakest when the problem sits beneath the campaign: if price architecture, checkout flow or product mix is broken, more advertising will not move the result.",
          },
          {
            tr: "Yönetim danışmanlığı — kapsam: analiz, senaryo, karar. En güçlü olduğu yer, birden çok yolun rakamla karşılaştırılması gereken büyük kararlardır: yatırım, satın alma, yeni pazara giriş. Zayıf kaldığı yer uygulamadır — rapor doğru olsa bile uygulayacak kadro şirkette yoksa karar rafta bekler.",
            en: "Management consulting — scope: analysis, scenarios, decision. It is strongest on large decisions where several paths must be compared with numbers: investment, acquisition, entering a new market. It is weakest at execution — even a correct report waits on the shelf when the client has no bench to carry it out.",
          },
          {
            tr: "İş geliştirme stüdyosu — kapsam: problem ve sonuç. En güçlü olduğu yer, hem stratejinin hem uygulama kapasitesinin aynı anda eksik olduğu durumdur. Zayıf kaldığı yer dar işlerdir: yalnız medya alımı veya yalnız bir pazar araştırması gerekiyorsa stüdyo hem pahalı hem yavaş kalır.",
            en: "The business building studio — scope: the problem and the result. It is strongest where strategy and execution capacity are missing at the same time. It is weakest on narrow jobs: where only media buying or only a market study is needed, a studio is both expensive and slow.",
          },
        ],
      },
      {
        type: "p",
        text: {
          tr: "Üç modeli aynı işe koşmak yanlış sonuç verir. Bir stüdyoya tek bir reklam seti ısmarlamak, bir ajanstan iş modeli beklemek kadar hatalıdır. Doğru soru \"hangisi daha iyi\" değil, \"şu an eksik olan hangi katman\" sorusudur.",
          en: "Putting all three to the same task produces the wrong outcome. Ordering a single ad set from a studio is as mistaken as expecting a business model from an agency. The right question is not \"which one is better\" but \"which layer is missing right now\".",
        },
      },
      {
        type: "h2",
        id: "studyo-modeli-nasil-calisir",
        text: {
          tr: "Stüdyo modeli pratikte nasıl çalışır?",
          en: "How does the studio model work in practice?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Dört aşama var ve dördü de aynı ekipte kalır: teşhis, yol haritası, icra, ölçüm. Aşamaları farklı taraflara bölmek modelin kendisini bozar, çünkü bu modelin değeri devir noktalarının ortadan kalkmasından gelir.",
          en: "There are four stages and all four stay with the same team: diagnosis, roadmap, execution, measurement. Splitting the stages across different suppliers breaks the model itself, because its value comes precisely from removing the handover points.",
        },
      },
      {
        type: "list",
        ordered: true,
        items: [
          {
            tr: "Teşhis. Ciro, marj, kanal kırılımı, dönüşüm oranı ve operasyon verisi birlikte okunur. Amaç sorunu bulmak değil, sorunun hangi katmanda durduğunu bulmaktır: talep katmanında mı, dönüşüm katmanında mı, ürün ve fiyat katmanında mı.",
            en: "Diagnosis. Revenue, margin, channel split, conversion rate and operational data are read together. The aim is not to find the problem but to find which layer holds it: the demand layer, the conversion layer, or the product and price layer.",
          },
          {
            tr: "Yol haritası. Bulgular sıralı ve bütçeli bir plana çevrilir: ne yapılacak, hangi sırayla, hangi ölçütle. Sıra önemlidir — doğru kurulmamış bir sitenin üstüne reklam bindirmek, bu işin en pahalı hatasıdır.",
            en: "Roadmap. The findings turn into a sequenced, costed plan: what gets done, in what order, against which measure. Order matters — pouring media onto a storefront that was never built properly is the most expensive mistake in this work.",
          },
          {
            tr: "İcra. Plan aynı çatı altında uygulanır: konumlandırma yazılır, arayüz kurulur, içerik üretilir, kanal açılır, sistem canlıya alınır. Bu aşamada müşteriye teslim edilen şey doküman değil, çalışan bir yapıdır.",
            en: "Execution. The plan gets built under the same roof: positioning written, interface built, content produced, channels opened, system taken live. What the client receives at this stage is a working structure, not a document.",
          },
          {
            tr: "Ölçüm. Baştan tanımlanan ölçütler düzenli okunur ve plan onlara göre düzeltilir. Ölçülmeyen bir inşa, inşa değil tahmindir.",
            en: "Measurement. The measures defined at the start get read on a schedule and the plan is corrected against them. A build nobody measures is not a build, it is a guess.",
          },
        ],
      },
      {
        type: "h2",
        id: "neden-ayni-masada",
        text: {
          tr: "Strateji, mühendislik ve kreatif neden aynı masada olmalı?",
          en: "Why should strategy, engineering and creative sit at the same table?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Strateji, mühendislik ve kreatif ayrı şirketlerde durduğunda büyüme problemleri disiplin sınırlarında saklanır ve o sınırı kimse sahiplenmez. Reklam filmi kategoriyi anlatır ama site sepeti kaybediyorsa satış olmaz; site kusursuz çalışır ama kategori tüketiciye hiç anlatılmamışsa trafik gelmez.",
          en: "When strategy, engineering and creative sit in separate companies, growth problems hide along the boundaries between disciplines and nobody owns those boundaries. A film can explain the category perfectly, but if the storefront loses the cart there is no sale; a storefront can run flawlessly, but if the category was never explained to the consumer there is no traffic.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Ayrı tedarikçi modelinin görünmeyen maliyeti koordinasyondur. Ajans kreatifi savunur, yazılım firması teslim tarihini savunur, danışman raporu savunur; müşteri bu üç savunmanın hakemi olur. Tek çatı bu hakemliği yok etmez ama sahibini değiştirir: karar da sonuç da aynı masada kalır. Bunun bir bedeli de var — tek çatı, tek noktada bağımlılık demektir, dolayısıyla stüdyo seçimi referansla ve geçmiş işe bakılarak yapılır.",
          en: "The hidden cost of the multi-supplier model is coordination. The agency defends the creative, the software firm defends the delivery date, the consultant defends the report — and the client becomes referee between three defences. One roof does not abolish that refereeing; it moves who owns it, so that decision and result stay at the same table. There is a price for that too: one roof means dependence on a single point, which is why a studio is chosen on references and past work rather than on a pitch.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Aynı masanın pratik karşılığı basit bir kuraldır: bir kararın gelir, teknik ve algı tarafı aynı toplantıda konuşulur. Konumlandırma cümlesi yazılırken arayüzü kuracak kişi odadadır; arayüz kurulurken kanalı yönetecek kişi odadadır. Bu, toplantı sayısını artırmaz — devir sayısını azaltır.",
          en: "In practice, one table means one rule: the revenue, technical and perception sides of a decision get discussed in the same meeting. The person who will build the interface is in the room while the positioning line is written; the person who will run the channel is in the room while the interface is built. That does not add meetings — it removes handovers.",
        },
      },
      {
        type: "h2",
        id: "hangi-sirket-hangi-modele",
        text: {
          tr: "Hangi şirket hangi modele gitmeli?",
          en: "Which company should go to which model?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Karar üç soruyla verilir: strateji net mi, uygulama kapasitesi var mı, problem tek disiplinde mi duruyor. Üçüne de \"evet\" diyorsanız stüdyoya ihtiyacınız yok; eksik olan tek katmanı satın almak yeterli ve daha ucuz.",
          en: "Three questions settle it: is the strategy clear, does the execution capacity exist, does the problem sit inside a single discipline. If you answer yes to all three you do not need a studio — buying the one missing layer is enough, and cheaper.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Stratejisi net, uygulama ekibi güçlü, eksiği yalnız görünürlük olan şirket ajansla çalışsın. Büyük bir yatırım kararının önünde duran ve kendi uygulama kadrosu bulunan kurumsal şirket danışmanlıkla çalışsın. Tek bir teknik iş — bir modül, bir entegrasyon — gerekiyorsa doğru adres yazılım firmasıdır. Stüdyo, bu üçünün ortasında kalan şirket için var: stratejisi eksik, uygulama kadrosu yetersiz ve problemi tek disipline sığmayan şirket.",
          en: "A company with clear strategy, a strong execution team and only a visibility gap should work with an agency. A corporate standing in front of a large investment decision, with its own implementation bench, should work with a consultancy. Where a single technical job is needed — one module, one integration — the right address is a software firm. The studio exists for the company that falls between those three: incomplete strategy, thin execution bench, and a problem that will not fit inside one discipline.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Stüdyoya gitmemeniz gereken iki durumu da açıkça yazayım. Nakit akışınız üç aylık bir inşa süresini taşımıyorsa, önce nakit üreten en kısa hamleyi yapın; bu bir stüdyo işi değildir. Şirket içinde kimin karar verdiği belirsizse, dışarıdan gelen hiçbir yapı bu belirsizliği kapatmaz — iş ilk çatışmada durur ve fatura ödenmiş olur.",
          en: "Let me write out the two cases where you should not come to a studio. If your cash flow cannot carry a three-month build, make the shortest cash-generating move first; that is not studio work. If it is unclear who decides inside the company, no structure brought in from outside will close that gap — the work stops at the first disagreement and the invoice has already been paid.",
        },
      },
      {
        type: "h2",
        id: "bu-modeli-neden-kurdum",
        text: {
          tr: "Bu modeli neden kurduğumu anlatayım",
          en: "Let me explain why I built this model",
        },
      },
      {
        type: "p",
        text: {
          tr: "On yıla yakın süredir reklam, markalaşma ve büyüme tarafında çalışıyorum; arada bir AI SaaS şirketinin kurucu ortaklığını yaptım. İki taraf bana aynı şeyi farklı dillerde gösterdi: gelen brief neredeyse hep kampanya brief'iydi, problem ise neredeyse hiç kampanyada değildi.",
          en: "I have spent close to a decade on the advertising, branding and growth side, and along the way co-founded an AI SaaS company. Both sides showed me the same thing in different languages: the brief that arrived was almost always a campaign brief, and the problem was almost never in the campaign.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Bir marka \"reklamımız çalışmıyor\" diye gelirdi; ölçtüğümüzde reklam çalışıyor, ürün sayfası çalışmıyordu. Bir üretici \"bize site lazım\" derdi; asıl eksik olan, kırk yıllık teknik bilgisinin hiçbir yerde yazılı olmamasıydı. Her seferinde doğru işi yapabilmek için sözleşmenin dışına çıkmak gerekiyordu. Bir noktada şunu kabul ettim: sorun ekiplerde değil, sözleşmenin kapsamındaydı.",
          en: "A brand would arrive saying \"our advertising isn't working\"; we would measure, and the advertising was working while the product page was not. A manufacturer would say \"we need a website\"; the real gap was that forty years of technical knowledge existed nowhere in writing. Every time, doing the right work meant stepping outside the contract. At some point I accepted the obvious: the problem was not in the teams, it was in the scope of the contract.",
        },
      },
      {
        type: "p",
        text: {
          tr: "INDOLES'i bu yüzden kampanya sözleşmesi üzerine değil, problem sözleşmesi üzerine kurduk. Bu kibirli bir iddia değil; modelin kısıtlarını yukarıda tek tek yazdım ve hepsi geçerli. Ama bir şirketin büyüme problemi üç disipline birden yayıldığında, o üç disiplini aynı masaya oturtmaktan daha ucuz bir yol bulamadım. [Kadroyu ve nasıl çalıştığımızı](/hakkimizda) ayrı bir sayfada yazdık.",
          en: "That is why we set INDOLES up on a contract about the problem rather than a contract about a campaign. This is not a boast; I listed the model's limits above one by one and they all hold. But when a company's growth problem spreads across three disciplines at once, I have not found a cheaper route than seating those three disciplines at one table. [Who we are and how we work](/hakkimizda) is written out on its own page.",
        },
      },
      {
        type: "h2",
        id: "indoles-nasil-uyguluyor",
        text: {
          tr: "INDOLES stüdyo modelini nasıl uyguluyor?",
          en: "How does INDOLES apply the studio model?",
        },
      },
      {
        type: "p",
        text: {
          tr: "İki vaka bu modelin iki ucunu gösteriyor: sıfırdan kategori kurmak ve mevcut bilgiyi görünür kılmak. İkisinde de iş tek bir disiplinin içinde bitmedi, bitseydi sonuç da çıkmazdı.",
          en: "Two cases mark the two ends of this model: building a category from nothing, and making existing knowledge visible. In neither did the work finish inside a single discipline — and had it finished there, neither result would have come.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[OdorGo](/vakalar/odorgo-kategori-yaratma) bize elinde yalnızca ürünle geldi. Koku giderici, Türkiye'de tüketici farkındalığı sıfır olan bir kategoriydi; arama hacmi olmadığı için performans pazarlaması tek başına çalışmazdı. Önce kategoriyi anlattık, sonra talebi kurduk: konumlandırma, dört reklam filmi, dönüşüm odaklı e-ticaret ve çok kanallı satış aynı planın parçalarıydı. Sekiz ayda 10 milyon TL ciroya ulaşıldı, filmler 10 milyondan fazla izlendi, ürün MacroCenter, Migros ve Happy Center raflarına girdi. Ürün konumlandırmasından raf anlaşmasına kadar tek ekip taşıdı — iş inşasının somut hâli budur.",
          en: "[OdorGo](/vakalar/odorgo-kategori-yaratma) came to us with nothing but the product. Odor elimination was a category with zero consumer awareness in Türkiye, and with no search volume to capture, performance marketing alone could not work. We explained the category first, then built the demand: positioning, four commercials, conversion-led e-commerce and multichannel distribution were parts of one plan. Revenue reached ₺10M in eight months, the films were viewed more than 10 million times, and the product reached MacroCenter, Migros and Happy Center shelves. One team carried it from product positioning to the shelf agreement — that is business building in concrete form.",
        },
      },
      {
        type: "p",
        text: {
          tr: "[SIM Baskı Malzemeleri](/vakalar/sim-baski-ihracat-icerigi) 1983'ten beri matbaa sektörüne üretim yapıyor, ama kırk yıllık teknik bilgisinin hiçbir yerde yazılı karşılığı yoktu. İş iki katmanlıydı: siteyi beş dilli bir uygulama olarak yeniden kurmak ve ihracat alıcısının sorduğu soruları yanıtlayan içeriği yazmak. Teknik yeniden inşa ile içerik programı aynı ekipte yürüdüğü için altı ayda organik trafik 15 katına çıktı. Ajans içeriği yazabilirdi, yazılım firması siteyi kurabilirdi; ikisini aynı anda kuran taraf sonucu üretti.",
          en: "[SIM Printing Suppliers](/vakalar/sim-baski-ihracat-icerigi) has manufactured for the press industry since 1983, yet forty years of technical knowledge had no written form anywhere. The work had two layers: rebuilding the site as a five-language application, and writing the content that answers the questions an export buyer actually asks. Because the technical rebuild and the content programme ran inside the same team, organic traffic grew 15× in six months. An agency could have written the content and a software firm could have built the site; the party that built both at once produced the result.",
        },
      },
      {
        type: "h2",
        id: "bugun-yapabileceginiz-test",
        text: {
          tr: "Bugün yapabileceğiniz test nedir?",
          en: "What test can you run today?",
        },
      },
      {
        type: "p",
        text: {
          tr: "Model seçiminden önce yapabileceğiniz bir teşhis var ve kimseye danışmadan on beş dakikada biter. Son on iki ayda yaptığınız en büyük pazarlama veya teknoloji harcamasını seçin ve o harcamanın bugün sıfırlandığını varsayın.",
          en: "There is a diagnosis you can run before choosing any model, and it takes fifteen minutes without asking anyone. Take the largest marketing or technology spend of your last twelve months and assume it drops to zero today.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Şimdi geriye ne kaldığını sayın. Yazılmış bir konumlandırma cümlesi, bir raf veya kanal anlaşması, çalışan bir dönüşüm akışı, kalıcı bir bilgi varlığı, kurulmuş bir ölçüm düzeni — bunlardan kaçı ayakta? Sayı sıfıra yakınsa aldığınız şey kampanyaydı, iş inşası değil. Bu kötü bir haber değil, bir teşhis: eksik katmanı biliyorsanız bir sonraki bütçeyi doğru yere koyarsınız.",
          en: "Now count what is left. A written positioning line, a shelf or channel agreement, a working conversion flow, a durable knowledge asset, a measurement routine in place — how many of those are still standing? If the count is close to zero, what you bought was a campaign, not business building. That is not bad news but a diagnosis: once you know the missing layer, the next budget goes to the right place.",
        },
      },
      {
        type: "p",
        text: {
          tr: "Tez basit: kategori adı yeni ama iş eski. Bir şirketin büyüme problemi üç disipline birden yayıldığında, o disiplinleri aynı masada tutan taraf sonucu üretir; ayrı tutan taraf koordinasyon faturası keser. Bu ayrımın hizmet düzeyindeki karşılığını, hangi işin hangi başlığa girdiğiyle birlikte [iş geliştirme danışmanlığı](/hizmetler) sayfasında yazdık.",
          en: "The thesis is simple: the category name is new, the work is old. When a company's growth problem spreads across three disciplines, the party that keeps those disciplines at one table produces the result, and the party that keeps them apart bills for coordination. What that distinction looks like service by service — which job falls under which heading — is written out on the [business development services](/hizmetler) page.",
        },
      },
    ],
    faq: [
      {
        question: {
          tr: "İş geliştirme stüdyosu en kısa tanımıyla nedir?",
          en: "What is a business building studio, in short?",
        },
        answer: {
          tr: "Bir şirketin büyüme veya dönüşüm problemini teşhisten ölçüme kadar tek çatı altında üstlenen yapıya iş geliştirme stüdyosu denir. Strateji, mühendislik ve kreatif aynı ekipte durur; teslim edilen şey rapor veya kampanya değil, çalışan bir sistemdir. Danışmanlıktan farkı uygulamayı da üstlenmesi, ajanstan farkı kampanya yerine iş modelinin kendisini kurmasıdır. İngilizce karşılığı business building studio.",
          en: "The name describes a structure that takes on a company's growth or transformation problem end to end, from diagnosis through to measurement, under a single roof. Strategy, engineering and creative sit inside the same team, and what gets handed over is a working system rather than a report or a campaign. It differs from consulting by owning the execution too, and from an agency by building the business model itself instead of a campaign.",
        },
      },
      {
        question: {
          tr: "İş geliştirme stüdyosu ile reklam ajansı arasındaki fark nedir?",
          en: "What is the difference between a business building studio and an ad agency?",
        },
        answer: {
          tr: "Kapsam ve sahiplenme ayırıyor. Ajans kampanya, mecra ve kreatif üzerinden çalışır; ürün ile konumlandırma oturduğunda ve eksik olan tek şey görünürlük olduğunda en güçlü modeldir. Stüdyo ise probleme sözleşme yapar: sorun fiyat mimarisinde, sepet akışında veya ürün karmasındaysa oraya girer. Bir ajanstan iş modeli beklemek, bir stüdyoya tek reklam seti ısmarlamak kadar yanlıştır.",
          en: "Scope and ownership separate them. An agency works through campaigns, media and creative, and it is the strongest model when product and positioning are settled and visibility is the only gap. A studio contracts on the problem instead: if the trouble sits in price architecture, checkout flow or product mix, that is where it goes. Expecting a business model from an agency is as mistaken as ordering one ad set from a studio.",
        },
      },
      {
        question: {
          tr: "Yönetim danışmanlığı ile iş geliştirme stüdyosu arasındaki fark nedir?",
          en: "How does a management consultancy differ from a business building studio?",
        },
        answer: {
          tr: "Danışmanlık kararı netleştirir, stüdyo kararı kurar. Yatırım, satın alma veya yeni pazara giriş gibi birden çok yolun rakamla karşılaştırılması gereken büyük kararlarda danışmanlık modeli güçlüdür ve yerini kimse doldurmaz. Zayıf kaldığı yer uygulamadır: rapor doğru olsa bile uygulayacak kadro şirkette yoksa karar rafta bekler. Stüdyo tam bu boşlukta çalışır, çünkü uygulama kapasitesini kendi içinde taşır.",
          en: "Consulting sharpens the decision; a studio builds it. For large decisions where several paths must be compared with numbers — investment, acquisition, entering a new market — the consulting model is strong and nothing replaces it. Where it falls short is execution: even a correct report waits on the shelf when the client has no bench to carry it out. A studio works in exactly that gap, because it holds the execution capacity in-house.",
        },
      },
      {
        question: {
          tr: "İş inşası ne demek?",
          en: "What does business building mean?",
        },
        answer: {
          tr: "İş inşası, bir şirketin gelir motorunu parça parça kurma disiplinidir: konumlandırma, ürün mimarisi, kanal yapısı, dönüşüm altyapısı ve ölçüm çerçevesi. Reklam bu motorun yakıtıdır, motorun kendisi değil. Yakıtı olup motoru olmayan şirket harcadığı sürece büyür, durduğu anda durur. İngilizcesi business building; INDOLES'in iki ekseni — sanayide dönüşüm, ticarette büyüme — bu tek kavramda birleşir.",
          en: "Business building is the discipline of assembling a company's revenue engine piece by piece: positioning, product architecture, channel structure, conversion infrastructure and a measurement frame. Advertising is the fuel for that engine, not the engine. A company with fuel and no engine grows while it spends and stops the moment it stops spending. Our two axes — transformation in industry, growth in commerce — meet inside this single idea.",
        },
      },
      {
        question: {
          tr: "İşletmeler için iş geliştirme nedir?",
          en: "What is business development for a company?",
        },
        answer: {
          tr: "Gelir üretme biçimini genişletmek demektir: yeni pazar, yeni kanal, yeni ürün hattı, yeni fiyat mimarisi veya yeni müşteri segmenti. Satış mevcut huniden daha çok kapatır, iş geliştirme huninin kendisini kurar. Terim Türkçede bir de kariyer pozisyonunu anlatır; \"iş geliştirme uzmanı\" pratikte çoğunlukla satış ve ortaklık geliştirme işidir. Bu yazıda anlatılan disiplin o pozisyon değildir.",
          en: "For a company it means widening how revenue gets produced: a new market, a new channel, a new product line, a new price architecture or a new customer segment. Sales closes more from the funnel that already exists; business development builds the funnel. The Turkish term also names a job title, where in practice it usually means sales and partnership work. The discipline described here is not that job.",
        },
      },
      {
        question: {
          tr: "Hangi şirketler iş geliştirme stüdyosuyla çalışmalı?",
          en: "Which companies should work with a business building studio?",
        },
        answer: {
          tr: "Üç soruyla karar verilir: strateji net mi, uygulama kapasitesi var mı, problem tek disiplinde mi duruyor. Üçüne de evet diyen şirketin stüdyoya ihtiyacı yoktur; eksik olan tek katmanı satın alması hem yeterli hem daha ucuzdur. Model, stratejisi eksik, uygulama kadrosu yetersiz ve problemi tek disipline sığmayan şirket için doğrudur. Nakit akışı üç aylık bir inşa süresini taşımayan şirket ise önce nakit üreten hamleyi yapmalıdır.",
          en: "Three questions settle it: is the strategy clear, does the execution capacity exist, does the problem sit inside one discipline. A company answering yes to all three does not need a studio, and buying the single missing layer is both enough and cheaper. The model fits companies whose strategy is incomplete, whose execution bench is thin and whose problem crosses disciplines. Where cash flow cannot carry a three-month build, the cash-generating move comes first.",
        },
      },
      {
        question: {
          tr: "İş geliştirme stüdyosuyla çalışmak ne kadar sürer?",
          en: "How long does working with a business building studio take?",
        },
        answer: {
          tr: "Süre problemin durduğu katmana bağlıdır; kesin bir takvim veren herkese temkinli yaklaşın. Kendi ölçtüğümüz iki uç şöyle: OdorGo'da tüketici farkındalığı sıfır olan bir kategoride 10 milyon TL ciroya sekiz ayda ulaşıldı; SIM Baskı Malzemeleri'nde site yeniden kurulup içerik programı yürütüldükten sonra organik trafik altı ayda 15 katına çıktı. Teşhis ve yol haritası genellikle haftalarla, icra ve ölçüm aylarla konuşulur.",
          en: "Duration follows the layer the problem sits in, so treat any fixed calendar with caution. Two ends of our own measured range: OdorGo reached ₺10M in revenue within eight months in a category with zero consumer awareness, and SIM Printing Suppliers saw organic traffic grow 15× in six months once the site was rebuilt and the content programme ran. Diagnosis and roadmap are usually counted in weeks, execution and measurement in months.",
        },
      },
      {
        question: {
          tr: "Business building studio Türkçede ne demek?",
          en: "How do venture studios and company builders relate to this?",
        },
        answer: {
          tr: "Terimin Türkçe karşılığı iş geliştirme stüdyosudur ve kavramın merkezindeki fiil inşa etmektir. İngilizce kaynaklarda business building studio, venture studio ve company builder terimleri birbirine yakın kullanılır; ortak noktaları, bir işi yalnız önermek yerine kurmalarıdır. Venture studio genellikle kendi şirketlerini kurar, iş geliştirme stüdyosu ise mevcut bir şirketin gelir motorunu kurar. Bu ayrım, sözleşmenin kimin işi üzerine yapıldığını belirler.",
          en: "The three terms sit close to one another and share one thing: they construct a business rather than merely recommending one. A venture studio typically founds its own companies and holds equity in them. A business building studio builds the revenue engine of an existing company under a client contract. That distinction decides whose business the contract is written on, and it changes how risk, ownership and payment are structured.",
        },
      },
      {
        question: {
          tr: "İş modeli geliştirme nereden başlar?",
          en: "Where does business model development start?",
        },
        answer: {
          tr: "Teşhisle başlar, fikirle değil. Ciro, marj, kanal kırılımı, dönüşüm oranı ve operasyon verisi birlikte okunur; amaç sorunu bulmak değil, sorunun hangi katmanda durduğunu bulmaktır. Talep katmanı, dönüşüm katmanı ve ürün-fiyat katmanı birbirinden farklı müdahaleler ister. Sıra yanlış kurulursa bu işin en pahalı hatası yapılır: doğru kurulmamış bir sitenin üstüne reklam bindirmek.",
          en: "It starts with diagnosis, not with an idea. Revenue, margin, channel split, conversion rate and operational data get read together, and the aim is not to find the problem but to find which layer holds it. The demand layer, the conversion layer and the product-price layer each call for a different intervention. Get the order wrong and you make the most expensive mistake in this work: pouring media onto a storefront that was never built properly.",
        },
      },
      {
        question: {
          tr: "Stüdyo modeli küçük şirketler için de geçerli mi?",
          en: "Does the studio model apply to small companies too?",
        },
        answer: {
          tr: "Ölçek değil, problemin şekli belirler. OdorGo çalışmaya elinde yalnız ürünle başladı; kategori, marka, e-ticaret ve satış kanalları aynı planın parçası olarak kuruldu. Küçük şirkette avantaj karar hızıdır — tek karar verici varsa inşa çok daha çabuk ilerler. Kısıt nakittir: üç aylık bir inşa süresini taşıyamayan bir şirkette model doğru olsa bile zamanlama yanlıştır.",
          en: "Problem shape decides, not company size. OdorGo began with nothing but a product, and category, brand, storefront and sales channels were built as parts of one plan. In a small company the advantage is decision speed — with a single decision-maker the build moves considerably faster. The constraint is cash: where a three-month build cannot be carried, the model may be right while the timing is wrong.",
        },
      },
      {
        question: {
          tr: "İş geliştirme stüdyosunun çıktısı nedir?",
          en: "What does a business building studio actually deliver?",
        },
        answer: {
          tr: "Çıktı bir doküman değil, çalışan bir yapıdır: yazılmış bir konumlandırma, canlıya alınmış bir arayüz veya sistem, açılmış satış kanalları ve kurulmuş bir ölçüm düzeni. Rapor bu işin yan ürünüdür, ana teslimatı değil. Ölçütler baştan tanımlanır ve düzenli okunur; ölçülmeyen bir inşa, inşa değil tahmindir. OdorGo'da çıktı raf anlaşmasına kadar gitti, SIM Baskı'da beş dilli bir uygulamaya ve ihracat içeriğine.",
          en: "What gets handed over is a working structure rather than a document: a written positioning, a live interface or system, opened sales channels and a measurement routine in place. Reports are a by-product of the work, not the deliverable. Measures are defined at the start and read on a schedule, because a build nobody measures is a guess. At OdorGo the output reached shelf agreements; at SIM Printing it was a five-language application and export content.",
        },
      },
    ],
    category: "growth",
    topic: "is-gelistirme",
    tags: [
      "is-gelistirme-studyosu",
      "is-insasi",
      "is-modeli-gelistirme",
      "kategori-yaratma",
    ],
    authorSlug: "burak-ozgul",
    publishedAt: "2026-08-28",
    readingMinutes: 11,
    seo: {
      title: {
        tr: "İş geliştirme stüdyosu nedir?",
        en: "What is a business building studio?",
      },
      description: {
        tr: "İş geliştirme stüdyosu nedir, reklam ajansı ve yönetim danışmanlığından nerede ayrılır? Kanonik tanım, model karşılaştırması ve iş inşası sahadan iki vakayla.",
        en: "What is a business building studio and how does it differ from an ad agency or a consultancy? A canonical definition, an honest comparison, two field cases.",
      },
    },
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
