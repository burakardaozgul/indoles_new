import type { PackageContent } from "./types";

export const PACKAGES: PackageContent[] = [
  {
    slug: { tr: "buyume-sprinti", en: "growth-sprint" },
    kind: "sprint",
    name: { tr: "Büyüme Sprinti", en: "Growth Sprint" },
    descriptor: {
      tr: "Kanal teşhisi ve 90 günlük büyüme planı",
      en: "Channel diagnosis and a 90-day growth plan",
    },
    pillar: "growth",
    durationWeeks: 4,
    pricing: { TRY: 240000, EUR: 7500, USD: 8200 },
    outcome: {
      industrial: {
        tr: "Hangi kanalın hangi büyüme potansiyelini taşıdığı, yatırım getirisi (ROI) projeksiyonu ve öncelik sıralamasıyla belgelenir.",
        en: "Which channel carries which growth potential — documented with ROI projection and priority ranking.",
      },
      commerce: {
        tr: "4 haftada büyüme kanalı haritası. CAC'ı düşürecek, ROAS'ı artıracak kanalı ve bütçe dağılımını net olarak belirleriz.",
        en: "Growth channel map in 4 weeks. We pinpoint which channel to fund to lower CAC and lift ROAS — with budget allocation.",
      },
    },
    summary: {
      industrial: {
        tr: "4 haftada, 2-3 kanalda net yön. Mevcut performans kanallarını denetler, her biri için yatırım getirisi (ROI) projeksiyonu üretiriz, öncelik sırasını veriyle gerekçelendiririz. Marka tonu ve mesaj mimarisi, media planına entegre edilir.",
        en: "Clear direction on 2-3 channels in 4 weeks. We audit existing performance channels, produce an ROI projection for each and justify the priority order with data. Brand tone and message architecture are integrated into the media plan.",
      },
      commerce: {
        tr: "4 hafta, 3 kanal, veri. Reklam bütçen nereye gidiyor, nereden geri dönüyor — hepsini açıyoruz. Funnel'da nerede sızıyor, hangi test önce, hangi kaldıraç en hızlı etki üretiyor. Sprint sonunda elimde somut yol haritası var.",
        en: "4 weeks, 3 channels, data. Where your ad budget goes, where it comes back — we open it all up. Where the funnel leaks, which test first, which lever produces impact fastest. At the end of the sprint, you have a concrete roadmap in hand.",
      },
    },
    scope: {
      industrial: {
        tr: [
          "Mevcut kanalların denetimi (Google Ads, Meta, TikTok, SEO, e-posta) — kanal başına mevcut durum raporu ve benchmark kıyaslaması",
          "İlk 90 gün için kanal bazlı hipotez ve bütçe önerisi — her kanal için ayrı ROI projeksiyonu",
          "En kritik funnel adımının A/B test planı — minimum 3 hipotez, öncelik sırası ve beklenen etki aralığı",
          "Marka ton ve mesaj mimarisi (tek sayfalık) — satış ekibi ve ajans kullanımına hazır, onaylı dil çerçevesi",
          "Haftalık performans gösterge paneli kurulumu — 5 temel metrik, yorumlama rehberiyle birlikte",
        ],
        en: [
          "Audit of current channels (Google Ads, Meta, TikTok, SEO, email) — current-state report and benchmark comparison per channel",
          "Channel-level hypothesis and budget recommendation for the first 90 days — separate ROI projection per channel",
          "A/B test plan for the single most critical funnel step — minimum 3 hypotheses, priority order and expected impact range",
          "Brand tone and message architecture (one-pager) — approved language framework ready for sales team and agency use",
          "Weekly performance dashboard setup — 5 core metrics with an interpretation guide",
        ],
      },
      commerce: {
        tr: [
          "Mevcut kanal denetimi (Google, Meta, TikTok, SEO, e-posta) — kanal başına ROAS, CAC ve dönüşüm oranı benchmark'ı",
          "90 günlük kanal hipotezi ve bütçe dağılımı — hangi kanalda ne kadar, hangi metrik hedefiyle",
          "Funnel'ın en kritik adımı için A/B test planı — en az 3 test hipotezi, beklenen dönüşüm artışı aralığı",
          "Marka ton ve mesaj çerçevesi (tek sayfa) — reklam kopyasından landing page'e tutarlı dil",
          "Haftalık performans gösterge paneli — 5 metrik, yorumlama kılavuzu, iç ekibe handoff hazır",
        ],
        en: [
          "Current channel audit (Google, Meta, TikTok, SEO, email) — ROAS, CAC and conversion rate benchmark per channel",
          "90-day channel hypothesis and budget allocation — how much on which channel, to hit which metric target",
          "A/B test plan for the single most critical funnel step — minimum 3 test hypotheses, expected conversion lift range",
          "Brand tone and message framework (one page) — consistent language from ad copy to landing page",
          "Weekly performance dashboard — 5 metrics, interpretation guide, ready to hand off to the internal team",
        ],
      },
    },
    deliverables: {
      industrial: {
        tr: [
          "Sprint raporu (30+ sayfa): kanal teşhisi, strateji gerekçesi, 90 günlük yol haritası ve bütçe dağılımı",
          "Medya planı (Q1): kanal, bütçe, hedef ve ölçüm çerçevesiyle birlikte",
          "Test listesi (ilk 8 hafta): her test için hipotez, öncelik puanı ve başarı kriteri",
        ],
        en: [
          "Sprint report (30+ pages): channel diagnosis, strategy rationale, 90-day roadmap and budget allocation",
          "Media plan (Q1): channel, budget, target and measurement framework",
          "Test backlog (first 8 weeks): hypothesis, priority score and success criteria for each test",
        ],
      },
      commerce: {
        tr: [
          "Sprint raporu (30+ sayfa): kanal teşhisi, strateji ve 90 günlük yol haritası — teslimden 48 saat içinde paylaşılır",
          "Medya planı (Q1): kanal, bütçe, hedef metrik ve ölçüm çerçevesi",
          "Test listesi (8 hafta): her test için hipotez, öncelik puanı ve beklenen dönüşüm etkisi",
        ],
        en: [
          "Sprint report (30+ pages): channel diagnosis, strategy and 90-day roadmap — shared within 48 hours of delivery",
          "Media plan (Q1): channel, budget, target metric and measurement framework",
          "Test backlog (8 weeks): hypothesis, priority score and expected conversion impact for each test",
        ],
      },
    },
    whoFor: {
      industrial: {
        tr: [
          "Yıllık cirosu 20M TL ve üzeri e-ticaret veya ticaret markası — mevcut kanal harcaması var, netlik arıyor",
          "B2B veya ihracat odaklı sanayi markası — dijital müşteri edinimini sisteme bağlamak isteyen",
          "Büyüme yatırımı yapan D2C veya mass-market tüketici markası — hangi kanalda neden durduğunu anlamak isteyen",
        ],
        en: [
          "E-commerce or retail brand with annual revenue of 20M TL or above — existing channel spend in place, looking for clarity",
          "B2B or export-oriented industrial brand — ready to connect digital customer acquisition to a system",
          "D2C or mass-market consumer brand investing in growth — wanting to understand why a specific channel stalls",
        ],
      },
      commerce: {
        tr: [
          "20M TL+ cirosu olan D2C veya e-ticaret markası — reklam harcıyor ama büyüme beklediği gibi gitmiyor",
          "Shopify, WooCommerce veya marketplace'te büyüyen marka — CAC yükseliyor, ROAS düşüyor, neden bilmiyor",
          "Funnel yatırımı yapmaya hazır mass-market marka — hangi kaldıraçtan başlayacağını netleştirmek isteyen",
        ],
        en: [
          "D2C or e-commerce brand with 20M TL+ revenue — spending on ads but growth not landing as expected",
          "Brand growing on Shopify, WooCommerce or marketplace — CAC rising, ROAS falling, not sure why",
          "Mass-market brand ready to invest in the funnel — wanting to clarify which lever to pull first",
        ],
      },
    },
    faq: [
      {
        question: {
          tr: "4 hafta gerçekten yeterli mi?",
          en: "Is 4 weeks really enough?",
        },
        answer: {
          tr: "Dört hafta teşhis, strateji ve yol haritası için yeterlidir; uygulamanın tamamı için değildir. Süre 2-3 kanalın denetimine, her kanal için ayrı ROI projeksiyonuna ve öncelik sırasının veriyle gerekçelendirilmesine ayrılır. Landing page testi ya da bütçe yeniden dağılımı gibi hızlı kazanımlar sprint içinde canlıya alınabilir; büyük kanal etkisi 4-6 hafta içinde ölçülmeye başlar. Dördüncü haftanın sonunda medya planı, test listesi ve haftalık panel teslim edilir — yürütmeyi iç ekip devralabilir ya da proje veya aylık retainer formatında INDOLES devam eder.",
          en: "Four weeks are enough for diagnosis, strategy and the roadmap, but not for full execution. The time goes to auditing 2-3 channels, producing a separate ROI projection for each and justifying the priority order with data. Quick wins such as a landing page test or budget reallocation can go live during the sprint; larger channel impact starts to be measurable within 4-6 weeks. By the end of week four the media plan, the test backlog and the weekly dashboard are delivered — the internal team can carry execution, or INDOLES continues in a project or monthly retainer format.",
        },
      },
      {
        question: {
          tr: "Sprint sonrası bağlayıcı bir taahhüt var mı?",
          en: "Is there any commitment after the sprint?",
        },
        answer: {
          tr: "Hayır. Rapor teslim edildiğinde iş birliği tamamlanmış sayılır ve devam kararı tamamen müşteriye aittir. Sprint raporu, Q1 medya planı ve ilk sekiz haftanın test listesi kurum içinde kalır; haftalık panelin yorumlama kılavuzu da onlarla birlikte devredilir. Belgeler iç ekiple ya da mevcut ajansla doğrudan yürütülebilir. Aylık retainer isteğe bağlı bir sonraki adımdır. Anlaşma dört haftalık kapsamla sınırlıdır; duraklatma veya sonlandırma için ek bir süreç işletilmez.",
          en: "No. Once the report is delivered the engagement is complete, and the decision to continue belongs entirely to the client. The sprint report, the Q1 media plan and the first eight weeks of tests stay inside the organisation, and the dashboard interpretation guide is handed over with them. The documents can be run by an internal team or an existing agency. A monthly retainer is an optional next step. The agreement is limited to the four-week scope; no additional process is needed to pause or stop.",
        },
      },
      {
        question: {
          tr: "Bu sprint kimler için uygun değil?",
          en: "Who is this sprint not for?",
        },
        answer: {
          tr: "Reklam harcaması henüz başlamamış markalar için uygun değildir. Sprint mevcut kanal verisini denetleyerek çalışır; ROAS, CAC ve dönüşüm oranı kaydı yoksa kanal sıralaması veriye değil hipoteze dayanır. Kısıt sipariş akışı, envanter ya da süreç tarafındaysa doğru başlangıç Dijital Dönüşüm Teşhisi'dir. Yıllık cirosu 20 milyon TL'nin altındaki markalarda kanal denetiminin açacağı fark da dar kalır.",
          en: "Not for brands that have not started spending on ads. The sprint works by auditing existing channel data; without ROAS, CAC and conversion records, channel ranking rests on assumption rather than evidence. Where the constraint sits in order flow, inventory or process, the right starting point is the Digital Transformation Audit. Below the 20M TL revenue mark, the gap a channel audit can open also stays narrow.",
        },
      },
      {
        question: {
          tr: "Sprint sırasında ekibimizden ne bekliyorsunuz?",
          en: "What do you need from our team during the sprint?",
        },
        answer: {
          tr: "Dört kalem beklenir: reklam ve analitik hesaplarına erişim, geçmiş kanal verisinin paylaşımı, marka ton ve mesaj mimarisinin onayı, test önceliklerinin birlikte kilitlenmesi. Kanal denetimi, ROAS ile CAC kıyaslaması, ROI projeksiyonları ve haftalık panelin kurulumu INDOLES'te kalır. Tam zamanlı bir kaynak ayrılması gerekmez; kararlar için tek bir muhatap dört haftayı yürütmeye yeter. Kreatif üretim ve reklam yönetimi bu dört haftanın kapsamı dışındadır.",
          en: "Four things are needed from the client team: access to ad and analytics accounts, past channel data, approval of the brand tone and message architecture, and locking the test order together. The channel audit, the ROAS and CAC benchmarking, the ROI projections and the weekly dashboard setup stay with INDOLES. No full-time resource is required; a single counterpart for decisions is enough to carry four weeks. Creative production and ad management sit outside this window.",
        },
      },
      {
        question: {
          tr: "Fiyata neler dahil değil?",
          en: "What is not included in the price?",
        },
        answer: {
          tr: "Reklam bütçesi, araç lisansları ve kreatif üretim paket fiyatının dışındadır. Fiyat kapsam listesindeki beş kalemi karşılar: kanal denetimi, 90 günlük kanal hipotezi ve bütçe dağılımı, A/B test planı, marka ton ve mesaj mimarisi, haftalık gösterge panelinin kurulumu. Medya planının uygulanması, reklam yönetimi ve görsel üretimi ayrı bir iş birliği konusudur; üçü de dört haftanın işi değildir.",
          en: "Media budget, tool licences and creative production sit outside the package price. The price covers the five items in the scope list: the channel audit, the 90-day channel hypothesis and budget allocation, the A/B test plan, the brand tone and message architecture, and the weekly dashboard setup. Executing the media plan, managing the channels and producing the creative are separate engagements — none of the three fits in four weeks.",
        },
      },
      {
        question: {
          tr: "Mevcut ajansımız veya iç pazarlama ekibimizle nasıl çalışıyorsunuz?",
          en: "How do you work with our existing agency or in-house marketing team?",
        },
        answer: {
          tr: "Mevcut ekibin yerine geçmeden. Denetim kanal kurulumunu okur ve bulguları gerekçesiyle yazar; medya planı ile test listesi doğrudan uygulanabilecek formatta teslim edilir — aynı belge ajansın da iç ekibin de eline geçer. Haftalık panel, yorumlama kılavuzuyla birlikte aynı ekibe devredilir. INDOLES ajans değişikliği önermez; mevcut kurulumun ROAS ve CAC tarafında ne ürettiğini ölçer.",
          en: "Without replacing the existing team. The audit reads the current channel setup and writes up findings with rationale; the media plan and test backlog are delivered in a directly executable format, and the agency and the internal team receive the same document. The weekly dashboard is handed to that team along with its interpretation guide. INDOLES does not propose changing agencies; it measures what the current setup produces on ROAS and CAC.",
        },
      },
      {
        question: {
          tr: "Hangi veri ve hesaplara erişmeniz gerekiyor?",
          en: "Which data and accounts do you need access to?",
        },
        answer: {
          tr: "Denetim kapsamındaki kanalların yönetim hesapları gerekir: Google Ads, Meta, TikTok, arama konsolu ve e-posta aracı. Bunlara analitik verisi ile geçmiş dönem harcama kayıtları eklenir; ROAS, CAC ve dönüşüm oranı kıyaslaması bu kayıtlardan çıkar. Erişim salt okunur düzeyde yeterlidir, hesaplarda değişiklik yapılmaz. Ölçüm altyapısı eksikse hangi kurulumun gerektiği raporda ayrıca yazılır.",
          en: "Management accounts for the channels in the audit scope are needed: Google Ads, Meta, TikTok, search console and the email tool. Analytics data and historical spend records are added to those; the ROAS, CAC and conversion rate benchmark comes out of them. Read-only access is sufficient and no changes are made inside the accounts. Where measurement is missing, the report also states which setup has to be put in place.",
        },
      },
      {
        question: {
          tr: "Sonuç garantisi veriyor musunuz?",
          en: "Do you guarantee results?",
        },
        answer: {
          tr: "Hayır — ve sonuç garantisi veren bir danışmanlığa temkinli yaklaşmakta fayda var. Taahhüt teslim listesidir: 30 sayfanın üzerinde sprint raporu, Q1 medya planı ve ilk sekiz haftanın test listesi. Her test için beklenen dönüşüm artışı aralığı yazılır, ama aralık tahmindir, taahhüt değildir. Kanal sonucunu bütçe, rekabet yoğunluğu ve uygulama disiplini birlikte belirler; üçü de tek başına INDOLES'in çevirdiği kollar değildir.",
          en: "No — and any consultancy that guarantees an outcome deserves caution. The commitment is the delivery list: a sprint report of 30-plus pages, the Q1 media plan and the first eight weeks of tests. Each test carries an expected conversion lift range, but a range is an estimate rather than a promise. Channel outcomes are set by budget, competitive intensity and execution discipline together, and none of the three is a lever INDOLES pulls alone.",
        },
      },
      {
        question: {
          tr: "Kapsam değişir veya kanal eklemek istersek ne oluyor?",
          en: "What happens if the scope changes or we want to add a channel?",
        },
        answer: {
          tr: "Kapsam listesi anlaşmanın parçasıdır ve yazılıdır. Dördüncü bir kanal ya da ikinci bir pazar eklenirse süre ve fiyat yazılı olarak yeniden hesaplanır; sessizce eklenmez. Dört hafta, 2-3 kanalın denetimine göre planlanmış bir süredir — sınır korunmazsa dört hafta dört hafta kalmaz. Kapsamı sessizce büyütmek teslim tarihini kaçırmanın en yaygın yoludur; değişiklik talebinde yeni süre ve fiyat paylaşılır, karar ondan sonra verilir.",
          en: "The scope list is part of the agreement and is written down. Adding a fourth channel or a second market means duration and price are recalculated in writing; nothing is slipped in quietly. Four weeks is a window planned around auditing 2-3 channels, and without that boundary four weeks does not stay four weeks. Quietly growing scope is the most common way to miss a delivery date, so the new timeline and price are shared before any decision follows.",
        },
      },
      {
        question: {
          tr: "Fiyat sabit mi, süreç içinde ek kalem çıkar mı?",
          en: "Is the price fixed, or do extra line items appear along the way?",
        },
        answer: {
          tr: "Fiyat sabittir ve kapsam listesine bağlıdır. Listedeki beş kalem değişmediği sürece faturaya ek kalem girmez; kapsam değişirse yeniden fiyatlama yazılı yapılır ve sürpriz kalem çıkmaz. Reklam bütçesi ile araç lisansları en baştan fiyatın dışında tutulur, çünkü ikisi de müşterinin kendi hesabından doğrudan harcanır. Sabit kapsam ve sabit fiyat, dört haftalık taahhüdün dayandığı iki koşuldur.",
          en: "The price is fixed and tied to the scope list. As long as the five items do not change, no extra line reaches the invoice; if scope changes, repricing is issued in writing and no surprise line appears. Media budget and tool licences are excluded from the outset, because both are spent directly from the client's own account. Fixed scope and fixed price are the two conditions the four-week commitment rests on.",
        },
      },
      {
        question: {
          tr: "Büyüme Sprinti mi, Dijital Dönüşüm Teşhisi mi bize uygun?",
          en: "Growth Sprint or Digital Transformation Audit — which one fits us?",
        },
        answer: {
          tr: "Kısıt müşteri edinme tarafındaysa Büyüme Sprinti, süreç ve operasyon tarafındaysa Dijital Dönüşüm Teşhisi. Reklam harcaması var ama geri dönüş düşükse kanal ve funnel okunmalıdır; sipariş geliyor ama operasyon yetişmiyorsa sipariş akışı ve envanter haritalanmalıdır. Sprint dört haftada kanal harcamasını, funnel adımlarını ve mesaj mimarisini denetler; Teşhis üç haftada sahaya iner, süreç sahipleriyle görüşür ve as-is haritalarını çıkarır. İkisi ayrı pillar altındadır — Growth ve Transform — ve aynı anda alınması gerekmez; hangisinin kısıt olduğunu son çeyrek verisi zaten söyler.",
          en: "Where the constraint sits in customer acquisition, the Growth Sprint; where it sits in process and operations, the Digital Transformation Audit. Ad spend with thin returns points to the channel and the funnel; orders landing faster than operations can absorb point to order flow and inventory. The sprint spends four weeks auditing channel spend, funnel steps and message architecture; the audit spends three weeks on site, interviewing process owners and drawing as-is maps. Growth and Transform are separate pillars and need not be bought together — last quarter's numbers usually name the constraint.",
        },
      },
    ],
  },
  {
    slug: {
      tr: "dijital-donusum-teshisi",
      en: "digital-transformation-audit",
    },
    kind: "diagnose",
    name: {
      tr: "Dijital Dönüşüm Teşhisi",
      en: "Digital Transformation Audit",
    },
    descriptor: {
      tr: "Sahada süreç incelemesi ve önceliklendirilmiş yol haritası",
      en: "On-site process review and a prioritised roadmap",
    },
    pillar: "transform",
    durationWeeks: 3,
    pricing: { TRY: 180000, EUR: 5500, USD: 6000 },
    outcome: {
      industrial: {
        tr: "Hangi süreçlerin, hangi sırayla, hangi sistemle dijitalleştirileceği — adım adım yol haritası ve ROI projeksiyonu ile belgelenir.",
        en: "Which processes to digitize, in what order, with which system — documented in a step-by-step roadmap with ROI projections.",
      },
      commerce: {
        tr: "3 haftada operasyonun nerede yavaşladığını buluruz. Sipariş akışı, envanter, müşteri iletişimi — darboğaz tespit edilir, otomasyon önceliklendirilir.",
        en: "In 3 weeks we find where your operations slow down. Order flow, inventory, customer comms — bottleneck identified, automation prioritised.",
      },
    },
    summary: {
      industrial: {
        tr: "3 haftada sahaya gidiyoruz, süreç sahipleriyle konuşuyoruz, bağımsız teşhis üretiyoruz. Hangi süreç dijitalleşir, hangi sırayla, tahmini yatırım getirisi (ROI) ne — net cevap. ERP satmıyoruz; hangi sistemi, hangi sırayla almanız gerektiğini söylüyoruz.",
        en: "We go to the field in 3 weeks, talk to process owners and produce an independent diagnosis. Which process to digitize, in which order, with what projected ROI — a clear answer. We don't sell ERP; we tell you which system to buy and in what sequence.",
      },
      commerce: {
        tr: "3 haftada e-ticaret operasyonunun sürtünme haritası çıkar. Sipariş işleniyor ama tıkanıyor mu, envanter senkronizasyonu satış kaybettiriyor mu, müşteri bildirimi elle mi gidiyor — hepsini açıyoruz. Otomasyon nereye, hangi sırayla, ne kadar etkiyle.",
        en: "3 weeks produces a friction map of your e-commerce operations. Orders processing but stalling? Inventory sync losing sales? Customer notifications going out manually? We open it all up. Automation — where, in what order, with what impact.",
      },
    },
    scope: {
      industrial: {
        tr: [
          "Sahada 3-5 süreç gözlemi (üretim, planlama, satın alma, lojistik veya finans) — operatör ve yönetici gözlemi birlikte",
          "Süreç sahipleriyle yapılandırılmış görüşme (5-10 kişi) — darboğaz, beklenti ve uygulama direnci belirlenir",
          "Mevcut durum (as-is) süreç haritaları: her incelenen süreç için akış diyagramı, el değiştirme noktaları ve gecikme kaynaklarıyla",
          "ROI projeksiyonuyla önceliklendirilmiş 3-5 pilot önerisi — her öneri için tahmini maliyet, süre ve verim kazanımı",
          "6 aylık uygulama yol haritası (3 faz, Gantt formatı) — kime ne zaman ne düşer, onay mekanizması dahil",
        ],
        en: [
          "On-site observation of 3-5 processes (production, planning, procurement, logistics or finance) — operator and management perspectives both captured",
          "Structured interviews with process owners (5-10 people) — bottlenecks, expectations and implementation resistance identified",
          "As-is process maps: flow diagrams for each reviewed process, including handoff points and delay sources",
          "3-5 pilot recommendations prioritised by ROI projection — estimated cost, timeline and efficiency gain per recommendation",
          "6-month implementation roadmap (3 phases, Gantt format) — who is responsible for what and when, including approval steps",
        ],
      },
      commerce: {
        tr: [
          "Sipariş akışı, envanter ve müşteri iletişim süreçlerinin haritalanması — tıkanma noktaları ve gecikme kaynakları belirlenir",
          "Operasyon ekibiyle görüşme (3-6 kişi) — günlük darboğazlar, el işi yükü ve ölçekleme engelleri",
          "Mevcut durum (as-is) operasyon haritaları: her süreç için akış diyagramı, elle yapılan adımlar ve sistemsiz noktalar",
          "ROI projeksiyonuyla sıralanan 3-5 otomasyon önerisi — sipariş başına zaman kazanımı ve yıllık operasyon tasarrufu",
          "6 aylık uygulama yol haritası — hangi araç, ne zaman, kim kurar, büyüme hedefine ne kadar katkı sağlar",
        ],
        en: [
          "Mapping of order flow, inventory and customer communication processes — stall points and delay sources identified",
          "Interviews with the operations team (3-6 people) — daily bottlenecks, manual workload and scaling blockers",
          "As-is operations maps: flow diagrams per process, including manual steps and system gaps",
          "3-5 automation recommendations ranked by ROI projection — time saved per order and estimated annual operations saving",
          "6-month implementation roadmap — which tool, when, who sets it up, contribution to growth target",
        ],
      },
    },
    deliverables: {
      industrial: {
        tr: [
          "Teşhis raporu (40+ sayfa): as-is süreç haritaları, bulgular, öncelikli pilot önerileri ve gerekçeleri",
          "Her pilot için ayrı teknik şartname (spec): kapsam, tahmini bütçe, teknik gereksinim ve başarı kriterleri",
          "Yol haritası Gantt chart (3 faz): sorumlular, zaman dilimleri ve onay adımlarıyla birlikte",
        ],
        en: [
          "Diagnosis report (40+ pages): as-is process maps, findings, prioritised pilot recommendations and rationale",
          "Separate spec document per pilot: scope, estimated budget, technical requirements and success criteria",
          "Roadmap Gantt chart (3 phases): responsible parties, time frames and approval steps included",
        ],
      },
      commerce: {
        tr: [
          "Teşhis raporu (40+ sayfa): operasyon haritası, bulgular ve öncelikli otomasyon önerileri",
          "Her öneri için ayrı teknik şartname: araç seçimi, entegrasyon gereksinimi, tahmini maliyet ve beklenen etki",
          "Yol haritası (3 faz): hangi otomasyon önce, hangi büyüme hedefine hizmet eder",
        ],
        en: [
          "Diagnosis report (40+ pages): operations map, findings and prioritised automation recommendations",
          "Separate spec per recommendation: tool selection, integration requirements, estimated cost and expected impact",
          "Roadmap (3 phases): which automation comes first, which growth objective it serves",
        ],
      },
    },
    whoFor: {
      industrial: {
        tr: [
          "100-5.000 çalışanlı üretim veya imalat şirketi — dijitalleşmesi gerektiğini biliyor, nereden başlayacağını bilmiyor",
          "İhracat veya tedarik zinciri operasyonu yürüten kurumsal KOBİ — verim kaybını veriyle belgelemek isteyen",
          "ERP yatırımı veya AI projesi önünde bağımsız teşhis arayan sanayi firması — karar öncesi nesnel değerlendirme",
        ],
        en: [
          "Manufacturing or production firm with 100-5,000 employees — knows digitisation is needed, doesn't know where to start",
          "Corporate SME running export or supply-chain operations — wants efficiency losses documented with data",
          "Industrial firm seeking an independent diagnosis before an ERP or AI investment — objective assessment before commitment",
        ],
      },
      commerce: {
        tr: [
          "Sipariş hacmi büyüyen ama operasyon kapasitesi aynı kalan e-ticaret markası — büyümek için önce operasyonu hazırlaması gereken",
          "OMS veya WMS kurulumu önünde net teşhis arayan ticaret ekibi — hangi aracı, neden alacağını bilmek isteyen",
          "Elle çalışan süreçleri otomasyona geçirmek isteyen D2C veya marketplace satıcısı — nereden başlayacağını bilmiyor",
        ],
        en: [
          "E-commerce brand where order volume is growing but operations capacity is not — needs to ready operations before scaling further",
          "Commerce team seeking a clear diagnosis before OMS or WMS investment — wanting to know which tool to buy and why",
          "D2C or marketplace seller ready to automate manual processes — unsure where to start",
        ],
      },
    },
    faq: [
      {
        question: {
          tr: "Belirli bir ERP veya araç önerisi yapıyor musunuz?",
          en: "Do you recommend a specific ERP or tool?",
        },
        answer: {
          tr: "Öneri yapılır, ama hiçbir satıcıya bağlı kalmadan. Hangi ERP, hangi OMS ya da WMS, hangi modül ve hangi sırayla — her öneri teknik şartname, tahmini maliyet ve beklenen etkiyle birlikte gelir; kararı müşteri verir. Şartname belirli bir satıcıya göre değil gereksinime göre kurulur. INDOLES'in hiçbir yazılım sağlayıcısıyla iş ortaklığı veya komisyon ilişkisi yoktur.",
          en: "Recommendations are made, but without any vendor tie. Which ERP, which OMS or WMS, which module and in what order — each recommendation arrives with a spec, an estimated cost and an expected impact, and the decision belongs to the client. The spec is built around the requirement rather than a named vendor. INDOLES holds no partnership or commission relationship with any software supplier.",
        },
      },
      {
        question: {
          tr: "AI veya dijital dönüşüm projesi için bu teşhis uygun mu?",
          en: "Is this audit suitable for an AI or digital transformation project?",
        },
        answer: {
          tr: "Evet. Teşhis kapsamı yapay zeka dahil her dijital süreci değerlendirir, pilot adaylarını ROI sırasına dizer ve hangilerinin gerçekten yapay zeka gerektirdiğini raporda ayırır. \"Yapay zeka burada uygun değil\" sonucu da değerli bir teşhistir; boşa yatırım engellenmiş olur. Her öneri teknik şartname, araç seçimi ve tahmini maliyetle teslim edilir. Yapay zeka tarafındaki bir öneri seçilirse AI Pilot paketi doğrudan o şartnameden başlar.",
          en: "Yes. The audit scope covers every digital process, including AI, ranks the pilot candidates by ROI and separates out which of them actually needs AI. A finding of \"AI is not suitable here\" is also a valuable diagnosis, because it prevents a misplaced investment. Each recommendation ships with a spec, a tool selection and an estimated cost. If an AI-side recommendation is chosen, the AI Pilot package starts directly from that spec.",
        },
      },
      {
        question: {
          tr: "Dijital dönüşüm nedir, bu teşhis onun neresinde duruyor?",
          en: "What is digital transformation, and where does this audit sit within it?",
        },
        answer: {
          tr: "Dijital dönüşüm, bir işletmenin süreçlerini veriyle yönetilebilir hâle getirmesidir — yazılım satın almak değil, akışı yeniden kurmaktır. Teşhis bu işin ilk adımıdır: sipariş, envanter, üretim ve müşteri iletişimi nerede tıkanıyor, hangi süreç hangi sırayla ve hangi sistemle dijitalleşecek, üç haftada belgelenir. Çıktı as-is haritalar, 3-5 pilot önerisi ve altı aylık yol haritasıdır. Kurulum sonraki fazın konusudur.",
          en: "Digital transformation means making a firm's processes manageable with data — rebuilding the flow rather than buying software. The audit is the first step of that work: in three weeks it documents where order, inventory, production and customer communication stall, and which process gets digitised in what order and with which system. The output is a set of as-is maps, 3-5 pilot recommendations and a six-month roadmap. Implementation belongs to the next phase.",
        },
      },
      {
        question: {
          tr: "KOBİ'lerde dijital dönüşüm için 3 hafta yeterli mi?",
          en: "Is 3 weeks enough for digital transformation in an SME?",
        },
        answer: {
          tr: "Teşhis için yeterli, uygulama için değil. Üç hafta sahada 3-5 süreç gözlemine, süreç sahipleriyle yapılandırılmış görüşmelere ve as-is haritalarının çıkarılmasına ayrılır; sipariş akışı, envanter ve müşteri iletişimi bu kapsamın içindedir. 100-5.000 çalışan aralığındaki firmalarda kapsam tek bir bölümü değil bir akış zincirini kapsar. Otomasyon kurulumu bu sürenin içinde değildir — yol haritası altı aya yayılır ve hangi aracın önce geleceğini sıraya koyar.",
          en: "Enough for the diagnosis, not for the implementation. The three weeks go to on-site observation of 3-5 processes, structured interviews with process owners and drawing the as-is maps; order flow, inventory and customer communication sit inside that scope. In firms between 100 and 5,000 employees, the scope covers a flow chain rather than a single department. Setting up automation is not inside the window — the roadmap spans six months and sequences which tool lands first.",
        },
      },
      {
        question: {
          tr: "Sahada kimlerle görüşüyorsunuz, ekibimizden ne bekliyorsunuz?",
          en: "Who do you interview on site, and what do you need from our team?",
        },
        answer: {
          tr: "Süreç sahipleriyle 5-10 yapılandırılmış görüşme yapılır ve 3-5 süreç yerinde gözlemlenir; operasyon ekibinden 3-6 kişi bu görüşmelerin çekirdeğini oluşturur. Ekipten beklenen görüşme takvimi, saha ve sistem erişimi ile mevcut süreç belgelerinin paylaşımıdır. Bir sipariş baştan sona izlenir — anlatılan akışla gerçek akış arasındaki fark orada görülür. Operatör ile yönetici bakışı ayrı ayrı alınır; ikisi çoğu firmada aynı akışı anlatmaz ve aradaki fark teşhisin en değerli kısmıdır.",
          en: "Five to ten structured interviews are run with process owners and 3-5 processes are observed on site; a 3-6 person operations team forms the core of those interviews. What is needed from the team is an interview schedule, site and system access, and the existing process documents. One order is traced end to end — that is where the described flow and the real flow part ways. The operator view and the management view are taken separately; in most firms the two do not describe the same flow, and that gap is the most valuable part of the diagnosis.",
        },
      },
      {
        question: {
          tr: "Teşhisten sonra uygulamayı da siz mi yapıyorsunuz?",
          en: "Do you also carry out the implementation after the audit?",
        },
        answer: {
          tr: "Teşhis kendi başına duran bir iştir ve raporla birlikte tamamlanır; uygulama kararı müşteriye aittir. Her pilot için ayrı teknik şartname teslim edilir — kapsam, araç seçimi, entegrasyon gereksinimi, tahmini bütçe ve başarı kriterleri yazılıdır. Uygulamayı iç ekip, mevcut tedarikçi ya da INDOLES yürütebilir. Şartname belirli bir uygulayıcıya göre değil gereksinime göre kurulur; hangi otomasyonun önce geleceği yol haritasında zaten sıralanmıştır.",
          en: "The audit stands on its own and completes with the report; the implementation decision belongs to the client. A separate spec is delivered per pilot, covering scope, tool selection, integration requirements, estimated budget and success criteria. Implementation can be run by an internal team, an existing vendor or INDOLES. The spec is built around the requirement rather than a particular implementer, and the roadmap already sequences which automation comes first.",
        },
      },
      {
        question: {
          tr: "Fiyata neler dahil değil?",
          en: "What is not included in the price?",
        },
        answer: {
          tr: "Yazılım lisansları, araç abonelikleri, donanım ve uygulama işçiliği fiyatın dışındadır. Fiyat kapsam listesindeki beş kalemi karşılar: saha gözlemi, süreç sahibi görüşmeleri, as-is haritalar, önceliklendirilmiş pilot önerileri ve altı aylık yol haritası. Önerilen araçların ve pilotların tahmini bütçesi raporda tahmin olarak durur, faturada değil. Uygulama fazına geçilirse o iş ayrı kapsam ve ayrı fiyatla tanımlanır.",
          en: "Software licences, tool subscriptions, hardware and implementation labour sit outside the price. The price covers the five scope items: on-site observation, process owner interviews, as-is maps, prioritised pilot recommendations and the six-month roadmap. The estimated budgets for the recommended tools and pilots sit in the report as estimates, not on the invoice. Moving into an implementation phase means that work is defined with its own scope and its own price.",
        },
      },
      {
        question: {
          tr: "Rapordaki ROI projeksiyonları ne kadar bağlayıcı?",
          en: "How binding are the ROI projections in the report?",
        },
        answer: {
          tr: "Projeksiyon bir tahmindir, taahhüt değil. Her pilot önerisi için tahmini maliyet, süre ve verim kazanımı yazılır; sipariş başına zaman kazanımı ile yıllık operasyon tasarrufu sahada ölçülen mevcut durumdan ve süreç sahiplerinin verdiği rakamlardan hesaplanır. Gerçekleşen sonucu uygulama kalitesi ve ekibin aracı benimseme hızı belirler. Hesabın varsayımları ve her rakamın hangi ölçümden geldiği raporda açık yazılır, böylece hesap farklı rakamlarla yeniden çalıştırılabilir.",
          en: "A projection is an estimate, not a commitment. Each pilot recommendation carries an estimated cost, timeline and efficiency gain; time saved per order and annual operations saving are calculated from the current state measured on site and from the figures process owners provide. The realised result is set by implementation quality and by how fast the team adopts the tool. Every assumption and the measurement behind each number are written out, so the calculation can be rerun with different figures.",
        },
      },
      {
        question: {
          tr: "Bu teşhis kimler için uygun değil?",
          en: "Who is this audit not for?",
        },
        answer: {
          tr: "Kararını çoktan vermiş firmalar için uygun değildir. Belirli bir ERP'yi ya da tek bir aracı almaya niyetlenmiş ve yalnızca onay arayan bir yönetim, bağımsız teşhisten rahatsız olur; tek bir aracın kurulması istendiğinde doğru iş zaten teşhis değil uygulamadır. Süreç sahiplerine ve operasyon ekibine erişim verilmeyen kurumlarda da rapor eksik kalır — haritayı ekibin anlattığı gerçek akış üretir, gözlem ve görüşme kapsamın çekirdeğidir.",
          en: "Not for firms that have already decided. A management team set on a particular ERP or on installing a single tool and looking only for endorsement will be uncomfortable with an independent diagnosis; where one tool simply needs installing, the right work is implementation rather than diagnosis. The report also falls short where access to process owners and the operations team is withheld — the map is produced by the real flow the team describes, and observation and interviews are the core of the scope.",
        },
      },
      {
        question: {
          tr: "Fiyat sabit mi, ek süreç incelemesi istersek ne oluyor?",
          en: "Is the price fixed, and what if we want an extra process reviewed?",
        },
        answer: {
          tr: "Fiyat sabittir ve 3-5 süreçlik kapsama bağlıdır; sipariş akışı, envanter ve müşteri iletişimi bu kapsamın içindedir. Altıncı bir süreç, dördüncü bir alan — iade yönetimi ya da tedarikçi entegrasyonu — veya ikinci bir tesis eklenirse süre ve fiyat yazılı olarak yeniden hesaplanır. Üç hafta bu sınır korunduğu sürece üç hafta kalır; gözlem ve görüşme sayısı sürenin doğrudan belirleyicisidir. Yazılım lisansı, araç aboneliği ve uygulama işçiliği hiçbir koşulda bu fiyatın içinde değildir.",
          en: "The price is fixed and tied to a scope of 3-5 processes, with order flow, inventory and customer communication inside that scope. Adding a sixth process, a fourth area — returns management or supplier integration — or a second site means duration and price are recalculated in writing. Three weeks stays three weeks while that boundary holds; the number of observations and interviews directly sets the timeline. Software licences, tool subscriptions and implementation labour are never inside this price.",
        },
      },
      {
        question: {
          tr: "Önce teşhis mi almalıyız, doğrudan AI Pilot'a mı geçmeliyiz?",
          en: "Should we take the audit first, or go straight to the AI Pilot?",
        },
        answer: {
          tr: "Çözülecek problem netse doğrudan AI Pilot uygundur; net değilse teşhis. Pilot altı haftayı tek bir kullanım senaryosuna yatırır — sepet terk tahmini mi, ürün önerisi mi — ve yanlış senaryo o altı haftayı harcar. Teşhis 3-5 pilot adayını üç haftada veriyle ROI sırasına dizer ve her biri için şartname bırakır; pilot bunlardan birini sahada çalıştırır. İki paket art arda da kullanılabilir.",
          en: "If the problem is clear, the AI Pilot fits directly; if it is not, the audit comes first. The pilot puts six weeks into a single use case — cart abandonment prediction or product recommendation — and the wrong one costs those six weeks. The audit ranks 3-5 pilot candidates by ROI from data in three weeks and leaves a spec for each; the pilot then runs one of them in the field. The two packages also work back to back.",
        },
      },
    ],
  },
  {
    slug: { tr: "ai-pilot", en: "ai-pilot" },
    kind: "pilot",
    name: { tr: "AI Pilot", en: "AI Pilot" },
    descriptor: {
      tr: "Tek kullanım senaryosunda, sahada test edilen AI prototipi",
      en: "An AI prototype for one use case, tested in the field",
    },
    pillar: "transform",
    durationWeeks: 6,
    pricing: { TRY: 480000, EUR: 15000, USD: 16500 },
    outcome: {
      industrial: {
        tr: "Somut bir operasyonel probleme 6 haftada çalışan AI prototipi. Gerçek kullanıcı testiyle doğrulanır; maliyet ve verim etkisi ölçülür, ölçekleme kararı verilir.",
        en: "A working AI prototype for one concrete operational problem, deployed in 6 weeks. Cost and efficiency impact measured; scale decision made on evidence.",
      },
      commerce: {
        tr: "6 haftada çalışan AI prototipi. Bir müşteri segmenti, kanal veya sipariş akışına bağlar — metrik etkisi ölçülür, ölçekleme kararı senin.",
        en: "Working AI prototype in 6 weeks. Connects to one customer segment, channel or order flow — metric impact measured, scale decision is yours.",
      },
    },
    summary: {
      industrial: {
        tr: "LLM abartısı değil — iş problemi, veri, model ve entegrasyon. Altı haftada saha testine giren, gerçek operatör kullanan bir prototip. Pilot başarılıysa üretim yol haritası hazır; değilse ne öğrenildiği ve ne farklı yapılması gerektiği belgelenir.",
        en: "No LLM hype — business problem, data, model and integration. A prototype that goes to field test in six weeks, used by real operators. If the pilot succeeds, the production roadmap is ready. If not, what was learned and what should be done differently is documented.",
      },
      commerce: {
        tr: "Spesifik bir e-ticaret problemi, 6 haftada çalışır hale gelir. Ürün öneri motoru, sepet terk tahmini, müşteri segmentasyonu, sipariş tahminleme — hangisi en yüksek ROAS veya LTV etkisini üretir, veriyle seçiyoruz. Gerçek kullanıcı 2 hafta kullanır; metrik etkisi ölçülür.",
        en: "One specific e-commerce problem, working in 6 weeks. Product recommendation engine, cart abandonment prediction, customer segmentation, order forecasting — we pick the one with the highest ROAS or LTV impact using data. Real users test it for 2 weeks; metric impact measured.",
      },
    },
    scope: {
      industrial: {
        tr: [
          "Kullanım senaryosu seçimi ve değer doğrulaması — en fazla iki adayla başlanır, veri ve iş etkisi kriterlerine göre biri seçilir",
          "Veri envanteri ve kalite kontrolü — mevcut veri kaynakları, eksiklikler ve temizleme gereksinimi belirlenir",
          "Model seçimi (büyük dil modeli / klasik makine öğrenmesi / hibrit) — gerekçe ve tahmini performans beklentisiyle",
          "Prototip ve arayüz geliştirme — operatör veya son kullanıcının doğrudan kullanabileceği düzeyde",
          "Gerçek kullanıcıyla 2 haftalık saha testi — kullanım metrikleri, geri bildirim ve pilot başarı kriterleri ölçülür",
        ],
        en: [
          "Use case selection and value validation — start with no more than two candidates, one selected against data and business impact criteria",
          "Data inventory and quality check — existing data sources, gaps and cleaning requirements identified",
          "Model selection (large language model / classical machine learning / hybrid) — with rationale and estimated performance expectations",
          "Prototype and interface development — at a level real operators or end users can use directly",
          "2-week field test with real users — usage metrics, feedback and pilot success criteria measured",
        ],
      },
      commerce: {
        tr: [
          "Kullanım senaryosu seçimi — en yüksek dönüşüm veya LTV etkisi verecek problemi veriyle belirleriz, en fazla iki aday",
          "Veri envanteri ve kalite kontrolü — mevcut müşteri, ürün ve sipariş verisi; eksiklikler ve temizleme planı",
          "Model seçimi (öneri motoru / sınıflandırma / büyük dil modeli) — gerekçe ve beklenen metrik etkisiyle",
          "Prototip ve arayüz geliştirme — pazarlama ekibi veya müşteri doğrudan kullanabilir",
          "Gerçek kullanıcıyla 2 haftalık saha testi — dönüşüm oranı, sepet değeri veya elde tutma etkisi ölçülür",
        ],
        en: [
          "Use case selection — we use data to identify the problem with the highest conversion or LTV impact, maximum two candidates",
          "Data inventory and quality check — existing customer, product and order data; gaps and a cleaning plan",
          "Model selection (recommendation engine / classification / large language model) — with rationale and expected metric impact",
          "Prototype and interface development — usable directly by the marketing team or end customer",
          "2-week field test with real users — conversion rate, basket value or retention impact measured",
        ],
      },
    },
    deliverables: {
      industrial: {
        tr: [
          "Çalışan prototip (kaynak kod dahil, tam sahiplikle teslim) — üretim ortamına taşınmaya hazır temel mimari",
          "Pilot raporu: kullanım metrikleri, maliyet analizi, verim etkisi ve üretim ortamına geçiş için ölçekleme önerisi",
          "Üretim geçiş yol haritası: teknik adımlar, tahmini bütçe ve zaman çizelgesi",
        ],
        en: [
          "Working prototype (source code included, full ownership transferred) — core architecture ready to move to production",
          "Pilot report: usage metrics, cost analysis, efficiency impact and scale recommendation for moving to production",
          "Production roadmap: technical steps, estimated budget and timeline",
        ],
      },
      commerce: {
        tr: [
          "Çalışan prototip (kaynak kod dahil, tam sahiplikle) — production'a taşınmaya hazır mimari",
          "Pilot raporu: metrik etkisi (dönüşüm, LTV, ROAS), maliyet analizi ve ölçekleme önerisi",
          "Üretim yol haritası: teknik adımlar, tahmini bütçe ve zaman çizelgesi",
        ],
        en: [
          "Working prototype (source code included, full ownership) — architecture ready to move to production",
          "Pilot report: metric impact (conversion, LTV, ROAS), cost analysis and scale recommendation",
          "Production roadmap: technical steps, estimated budget and timeline",
        ],
      },
    },
    whoFor: {
      industrial: {
        tr: [
          "Üretim kalite kontrolü, talep tahmini veya bakım planlaması gibi somut bir AI kullanım alanı olan sanayi firması",
          "AI'ın potansiyelini biliyor ama hangi problemden başlayacağından emin olmayan COO veya CDO",
          "Veri birikimi olan, ancak bu verinin ne işe yarayacağını görmek isteyen süreci yoğun organizasyon",
        ],
        en: [
          "Industrial firm with a concrete AI use case — production quality control, demand forecasting or maintenance scheduling",
          "COO or CDO who sees AI potential but is unsure which problem to start with",
          "Data-rich, process-intensive organisation that wants to see what that data is worth",
        ],
      },
      commerce: {
        tr: [
          "Spesifik bir AI fikri olan e-ticaret veya D2C markası — ürün önerisi, kişiselleştirme veya sepet optimizasyonu için",
          "\"AI yapmalıyız ama nereden\" diyen marka veya büyüme lideri — somut kullanım alanıyla başlamak isteyen",
          "Müşteri ve sipariş verisi birikiyor ama işlenmiyor — bu veriden büyüme metrikleri üretmek isteyen",
        ],
        en: [
          "E-commerce or D2C brand with a specific AI idea — product recommendations, personalisation or basket optimisation",
          "Brand or growth leader asking 'we need AI but where to start' — wanting to begin with a concrete use case",
          "Customer and order data is accumulating but not being processed — wants to turn that data into growth metrics",
        ],
      },
    },
    faq: [
      {
        question: {
          tr: "Pilot sonunda production'a hazır yazılım teslim edilir mi?",
          en: "Is the software delivered at the end of the pilot production-ready?",
        },
        answer: {
          tr: "Pilot, üretim ortamına hazır bir ürün değildir — ama üretim ortamına hangi adımlarla, hangi maliyetle ve hangi sürede gidileceği net olarak belgelenir. Altı haftanın çıktısı çalışan bir prototip, metrik etkisini ölçen pilot raporu ve üretim geçiş yol haritasıdır. Kaynak kod tam sahiplikle teslim edilir; temel mimari üretime taşınmaya uygun kurulur. Devam kararı müşteriye aittir ve ölçekleme önerisi raporda tahmini bütçesiyle yazılıdır.",
          en: "The pilot is not a production-ready product — but how to get to production, at what cost and on what timeline, is documented clearly. The six weeks produce a working prototype, a pilot report measuring the metric impact, and a production roadmap. Source code is handed over with full ownership, and the core architecture is built so it can move to production. The decision to proceed belongs to the client, and the scale recommendation sits in the report with its estimated budget.",
        },
      },
      {
        question: {
          tr: "Yapay zeka projesi için yeterli verimiz var mı, bunu nasıl anlarız?",
          en: "Do we have enough data for an AI project, and how do we find out?",
        },
        answer: {
          tr: "Veri envanteri ve kalite kontrolü ilk haftalarda yapılır; cevap oradan çıkar. Müşteri, ürün, sipariş ve süreç kaynakları incelenir; eksikler ile temizleme planı yazılı olarak belirlenir. Veri yetersizse bu, pilotun ortasında değil kullanım senaryosu seçilirken söylenir — en fazla iki adayla başlanmasının sebebi de budur, hangisinin verisi hazırsa o seçilir. Yetersizlik hâlinde ya senaryo değişir ya da önce ölçüm kurulumu önerilir.",
          en: "A data inventory and quality check run in the first weeks, and the answer comes from there. Customer, product, order and process sources are examined, and the gaps and a cleaning plan are documented in writing. Where the data is insufficient, that is said while the use case is still being chosen rather than halfway through the pilot — which is why at most two candidates are taken up, and whichever has ready data gets picked. If it falls short, either the use case changes or measurement is set up first.",
        },
      },
      {
        question: {
          tr: "Kullanım senaryosunu kim seçiyor?",
          en: "Who chooses the use case?",
        },
        answer: {
          tr: "Seçim birlikte yapılır, en fazla iki adayla başlanarak. Karar veri uygunluğu ve iş etkisi kriterlerine göre verilir, tercihe göre değil. Üretim kalite kontrolü, talep tahmini, bakım planlaması, ürün önerisi, sepet terk tahmini ya da segmentasyon gibi somut bir problem şarttır; \"yapay zeka deneyelim\" bir kullanım senaryosu değildir. Hepsi aday olabilir, hepsi aynı anda olamaz. Seçilen senaryonun başarı kriterleri ilk haftada yazıya geçer, sonunda değil.",
          en: "The choice is made together, starting with at most two candidates, and it rests on data suitability and business impact rather than preference. A concrete problem is required — production quality control, demand forecasting, maintenance scheduling, product recommendation, cart abandonment prediction or segmentation. \"Trying AI\" is not a use case on its own. Any of them can be the candidate; not all at once. The success criteria for the chosen scenario are written in week one, not at the end.",
        },
      },
      {
        question: {
          tr: "AI pilot projesi başarısız olursa ne oluyor?",
          en: "What happens if the AI pilot project fails?",
        },
        answer: {
          tr: "Sonuç belgelenir ve öğrenilen yazıya geçer. Pilot raporu ne denendiğini, metriğin ne yaptığını, neyin farklı yapılması gerektiğini ve maliyet analizini içerir; kaynak kod yine tam sahiplikle müşteride kalır. Bir kullanım senaryosunun altı haftada elenmesi, aynı yanlışa yıllık bütçe bağlamaktan ya da bir yıl boyunca ölçülmeden yürüyen bir projeden ucuzdur. Başarı kriterleri baştan yazıldığı için sonucun ne olduğu tartışmaya açık kalmaz.",
          en: "The outcome gets documented and the learning is written down. The pilot report covers what was tried, what the metric did, what should be done differently and the cost analysis; the source code still transfers in full ownership. Eliminating a use case in six weeks costs less than committing an annual budget to the same mistake, or than a project running unmeasured for a year. Because the success criteria were written up front, the result is not open to argument.",
        },
      },
      {
        question: {
          tr: "Yapay zeka maliyeti pilot sonrasında nasıl ilerliyor, fiyata neler dahil değil?",
          en: "How does the AI cost run after the pilot, and what is excluded from the price?",
        },
        answer: {
          tr: "Model kullanım ücretleri, bulut altyapısı ve araç lisansları paket fiyatının dışındadır. Fiyat kapsam listesindeki beş kalemi karşılar: senaryo seçimi, veri envanteri, model seçimi, prototip geliştirme ve iki haftalık saha testi. Pilot sonrası işletme maliyeti, üretim geçiş yol haritasında tahmini bütçe kalemi olarak yazılır. Tüketime bağlı kalemler sabit fiyata alınmaz; kullanım hacmi arttıkça o rakam da artar ve sabit göstermek yanıltıcı olur.",
          en: "Model usage fees, cloud infrastructure and tool licences sit outside the package price. The price covers the five scope items: use case selection, data inventory, model selection, prototype development and the two-week field test. Post-pilot running cost is written into the production roadmap as an estimated budget line. Consumption-based lines cannot go into a fixed price; that figure rises as usage rises, and presenting it as fixed would mislead.",
        },
      },
      {
        question: {
          tr: "Bir yapay zeka yol haritamız yok. Önce onu mu kurmalıyız?",
          en: "We have no AI roadmap. Should we build one first?",
        },
        answer: {
          tr: "Yol haritası şart değildir, ama problem tanımı şarttır. Pilot tek bir senaryoya kilitlenir; kurumsal bir yol haritası yerine somut bir operasyonel darboğaz yeterlidir. Pilotun kendisi üretim geçiş yol haritasını çıktı olarak üretir — teknik adımlar, tahmini bütçe ve zaman çizelgesiyle. Aday senaryolar bile belirsizse önce Dijital Dönüşüm Teşhisi gelir; üç haftada adayları ROI sırasına dizer ve pilot oradan başlar.",
          en: "A roadmap is not required, but a problem definition is. The pilot locks onto a single use case, and a concrete operational bottleneck is enough in place of a corporate roadmap. The pilot itself produces the production roadmap as an output — technical steps, estimated budget and timeline. If even the candidate use cases are unclear, the Digital Transformation Audit comes first; three weeks ranks the candidates by ROI and the pilot starts from there.",
        },
      },
      {
        question: {
          tr: "Ekibimizden kim dahil olmalı?",
          en: "Who from our team needs to be involved?",
        },
        answer: {
          tr: "Veriye erişimi olan bir teknik muhatap ve prototipi sahada iki hafta gerçekten kullanacak taraf gerekir — operatörler, pazarlama ekibi ya da son kullanıcı. Saha testi simüle edilmez; ölçülen şey gerçek kullanımdır. Süreç sahibinin pilot başarı kriterlerini onaylaması ilk haftanın adımıdır. Veri envanteri sırasında müşteri, ürün, sipariş ve kaynak sistemlere erişim açılması gerekir.",
          en: "A technical counterpart with data access is needed, along with the side that will genuinely use the prototype in the field for two weeks — operators, the marketing team or end customers. The field test is not simulated; real usage is what gets measured. The process owner signing off the pilot success criteria is a first-week step. Access to customer, product, order and source systems has to be opened during the data inventory.",
        },
      },
      {
        question: {
          tr: "6 hafta içinde kapsam değişirse ne oluyor?",
          en: "What happens if the scope changes within the 6 weeks?",
        },
        answer: {
          tr: "Kullanım senaryosu sabittir; saha testi başladıktan sonra senaryo değiştirmek pilotu sıfırlar. Prototip içindeki küçük düzeltmeler kapsam dahilidir, yeni bir problem tanımı değildir. İkinci bir senaryo istenirse ayrı bir pilot olarak fiyatlanır ve kendi altı haftasını ister — altı hafta tek problem içindir, ikiye bölünürse ikisi de yarım kalır. Sınırı korumanın karşılığı, altıncı haftanın sonunda ölçülmüş bir metrik etkisidir.",
          en: "The use case is fixed; switching it after the field test starts resets the pilot. Minor corrections inside the prototype are within scope, but a new problem definition is not. A second use case is priced as a separate pilot and needs its own six weeks — six weeks is for one problem, and split in two both come out half-finished. Holding that boundary is what buys a measured metric impact by the end of week six.",
        },
      },
      {
        question: {
          tr: "Bu paket kimler için uygun değil?",
          en: "Who is this package not for?",
        },
        answer: {
          tr: "Veri birikimi olmayan organizasyonlar için uygun değildir — model geçmiş veriden öğrenir ve müşteri, sipariş ya da süreç geçmişi yoksa pilot hipoteze döner. Doğrudan üretim ortamına hazır, canlıya alınacak bitmiş bir ürün bekleyen firmalar için de değil; o iş MVP Build'in kapsamıdır. Somut bir operasyonel problem adlandırılamıyorsa önce Dijital Dönüşüm Teşhisi gelir. Altı hafta, tanımlanmış tek bir soruya cevap vermek için planlanmıştır.",
          en: "Not for organisations with no accumulated data — a model learns from history, and without customer, order or process history the pilot turns into guesswork. Also not for firms expecting a finished, production-ready product to go live; that work belongs to MVP Build. Where no concrete operational problem can be named, the Digital Transformation Audit comes first. Six weeks is planned to answer one defined question.",
        },
      },
      {
        question: {
          tr: "Fiyat sabit mi, süreç içinde ek kalem çıkar mı?",
          en: "Is the price fixed, or do extra line items appear along the way?",
        },
        answer: {
          tr: "Fiyat sabittir ve kapsam listesine bağlıdır. Altı haftanın içinde ek kalem çıkmaz; kapsam değişirse yeniden fiyatlama yazılı olarak yapılır ve sürpriz kalem oluşmaz. Model kullanım ücretleri ile bulut altyapısı tüketime göre değiştiği için baştan fiyatın dışında tutulur ve yol haritasında tahmin olarak durur. Pilot sonrası işletme bütçesi raporla birlikte görülür, altıncı haftanın sonunda değil.",
          en: "The price is fixed and tied to the scope list. No extra line item appears inside the six weeks; if scope changes, repricing is put in writing and no surprise line emerges. Model usage fees and cloud infrastructure vary with consumption, so they are excluded from the outset and appear in the roadmap as estimates. The post-pilot running budget is visible with the report rather than after the fact.",
        },
      },
      {
        question: {
          tr: "AI Pilot mı, MVP Build mı bize uygun?",
          en: "AI Pilot or MVP Build — which one fits us?",
        },
        answer: {
          tr: "Aranan kanıtsa AI Pilot, ürünse MVP Build. Pilot bir fikri altı haftada ölçer, iki haftalık saha testiyle kapanır ve ölçekleme kararını veriye bağlar. MVP Build sekiz haftada üretim ortamına çıkar, gerçek kullanıcıya açılır, metriklere bağlanır ve 30 günlük stabilizasyonun ardından iç ekibe devredilir. Pilot ikisinden ucuz olanı ve kararı ucuzlatanıdır; iki paket art arda da kurgulanabilir.",
          en: "Evidence points to the AI Pilot; a product points to MVP Build. The pilot measures an idea in six weeks, closes with a two-week field test and ties the scale decision to data. MVP Build reaches production in eight weeks, opens to real users, wires up the metrics and hands over to the internal team after a 30-day stabilisation. The pilot is the cheaper of the two, and the one that makes the decision cheaper; the two can also run back to back.",
        },
      },
    ],
  },
  {
    slug: { tr: "mvp-build", en: "mvp-build" },
    kind: "build",
    name: { tr: "MVP Build", en: "MVP Build" },
    descriptor: {
      tr: "İlk değer getiren sürümün inşası ve canlıya alınması",
      en: "Building and deploying the first value-delivering version",
    },
    pillar: "build",
    durationWeeks: 8,
    pricing: { TRY: 720000, EUR: 22500, USD: 24500 },
    outcome: {
      industrial: {
        tr: "Firmaya ait, kaynak koduyla teslim edilen, bakımı yapılabilir yazılım. 8 haftada canlıya alınır; 30 gün stabilizasyon sonrası iç ekibe devredilir.",
        en: "Firm-owned software delivered with full source code, maintainable from day one. Deployed live in 8 weeks; handed over to the internal team after a 30-day stabilisation period.",
      },
      commerce: {
        tr: "8 haftada piyasaya çıkmaya hazır mobil uygulama veya web platformu. İlk versiyondan itibaren kullanıcıya açık, ölçüme hazır.",
        en: "Market-ready mobile app or web platform in 8 weeks. Open to users from the first version, wired for measurement from day one.",
      },
    },
    summary: {
      industrial: {
        tr: "İlk değer getiren versiyon 8 haftada canlıya çıkar. Tasarımdan canlıya almaya, gözlemlemeden stabilizasyona — her adımda sahibi belli. Yazılım teslimde firmaya geçer; dış bağımlılık yok. İç ekip altyapıyı büyütebilir, değiştirebilir, devre dışı bırakabilir.",
        en: "The first value-delivering version goes live in 8 weeks. From design to deployment, from observability to stabilisation — ownership is clear at every step. The software transfers to the firm at handover; no external dependency. The internal team can extend, modify or decommission the infrastructure.",
      },
      commerce: {
        tr: "8 haftada canlıya. Tasarımdan deploy'a, gözlemlemeden kullanıcı geri bildirimine — ilk versiyondan itibaren gerçek kullanıcıya açılıyor, metrikler bağlı. Kaynak kodu ve altyapı kontrolü sende; dış bağımlılık yok. Ekip biter, ürün kalır.",
        en: "Live in 8 weeks. From design to deployment, from observability to user feedback — open to real users from the first version, metrics connected. Source code and infrastructure control are yours; no external dependency. The team finishes; the product stays.",
      },
    },
    scope: {
      industrial: {
        tr: [
          "Ürün şartnamesi ve kullanıcı hikayeleri — iş gereksinimlerinden teknik spec'e, öncelik sırası ve kapsam sınırı belirlenerek",
          "UI/UX tasarım — marka kimliğiyle tutarlı, operatör veya son kullanıcı için optimize edilmiş",
          "Frontend ve backend geliştirme — TypeScript monolit varsayılan; erken mimari borcu alınmadan ölçeklenebilir temel",
          "Canlıya alma ve gözlemleme kurulumu — production ortamına alım, izleme ve uyarı sistemi dahil",
          "30 gün stabilizasyon — canlı ortamda hata takibi, küçük düzeltmeler ve iç ekip devir dokumentasyonu",
        ],
        en: [
          "Product spec and user stories — from business requirements to technical spec, with priority order and scope boundary set",
          "UI/UX design — consistent with brand identity, optimised for operators or end users",
          "Frontend and backend development — TypeScript monolith by default; scalable foundation without early architecture debt",
          "Deploy and observability setup — production deployment with monitoring and alerting included",
          "30-day stabilisation — bug tracking in live environment, minor fixes and internal team handover documentation",
        ],
      },
      commerce: {
        tr: [
          "Ürün şartnamesi ve kullanıcı hikayeleri — büyüme hedefinize göre önceliklendirilmiş, kapsam sınırlı ilk versiyon",
          "UI/UX tasarım — dönüşüm odaklı, marka kimliğiyle tutarlı, mobil öncelikli",
          "Frontend ve backend geliştirme — TypeScript monolit, erken ölçekleme borcu almadan piyasaya çıkış hızı",
          "Deploy ve gözlemleme kurulumu — production ortamına alım, performans izleme ve uyarı sistemi",
          "30 gün stabilizasyon — canlı ortamda hata takibi, kullanıcı geri bildirimi döngüsü ve metrik bağlantısı",
        ],
        en: [
          "Product spec and user stories — first version scoped and prioritised against your growth target",
          "UI/UX design — conversion-led, consistent with brand identity, mobile-first",
          "Frontend and backend development — TypeScript monolith, market-entry speed without early scaling debt",
          "Deploy and observability setup — production deployment, performance monitoring and alerting",
          "30-day stabilisation — bug tracking in live environment, user feedback loop and metric connection",
        ],
      },
    },
    deliverables: {
      industrial: {
        tr: [
          "Canlı uygulama: production ortamında çalışan, gerçek kullanıcıya açık ilk versiyon",
          "Kaynak kodu (tam sahiplikle): repository, mimari dokümantasyon ve bağımlılık listesi dahil",
          "Operasyon kılavuzu: günlük bakım, hata müdahale prosedürleri ve ölçekleme rehberi",
        ],
        en: [
          "Live application: first version running in production, open to real users",
          "Source code (full ownership): repository, architecture documentation and dependency list included",
          "Operations runbook: daily maintenance, incident response procedures and scaling guide",
        ],
      },
      commerce: {
        tr: [
          "Canlı uygulama: gerçek kullanıcıya açık, ölçüme bağlı ilk versiyon — deploy gününde hazır",
          "Kaynak kodu (tam sahiplikle): repo, mimari doküman ve bağımlılık listesiyle teslim",
          "Operasyon runbook: bakım adımları, hata müdahale prosedürü ve büyüme için ölçekleme kılavuzu",
        ],
        en: [
          "Live application: first version open to real users, wired for measurement — ready on deploy day",
          "Source code (full ownership): repo, architecture documentation and dependency list delivered",
          "Operations runbook: maintenance steps, incident response procedure and a scaling guide for growth",
        ],
      },
    },
    whoFor: {
      industrial: {
        tr: [
          "İç operasyonu için özel araç geliştiren sanayi veya ticaret şirketi — ERP modülü, üretim takip sistemi veya sipariş yönetim aracı",
          "Yeni bir dijital ürün piyasaya çıkarmak isteyen marka — yazılım sahipliğini dış ajansa devretmek istemeyen",
          "Teknik co-founder yerine hazır mühendislik ekibi arayan kurucu — hızlı ve söz sahibi piyasaya çıkış",
        ],
        en: [
          "Industrial or commercial firm building a custom internal tool — ERP module, production tracking system or order management tool",
          "Brand ready to launch a new digital product — unwilling to hand software ownership to an outside agency",
          "Founder looking for a ready engineering team instead of a technical co-founder — fast, ownership-led market entry",
        ],
      },
      commerce: {
        tr: [
          "Yeni dijital ürün piyasaya çıkarmak isteyen D2C veya ticaret markası — hızlı, sahiplikli, ölçüme hazır",
          "İç operasyonu için custom araç geliştiren şirket — OMS, sipariş takip veya müşteri portalı",
          "Teknik co-founder yerine hazır ve paketli bir mühendislik ekibi arayan kurucu — 8 haftada piyasada",
        ],
        en: [
          "D2C or commerce brand launching a new digital product — fast, ownership-led, measurement-ready",
          "Company building a custom internal tool — OMS, order tracking or customer portal",
          "Founder looking for a packaged engineering team instead of a technical co-founder — in market within 8 weeks",
        ],
      },
    },
    faq: [
      {
        question: {
          tr: "8 hafta gerçekçi mi?",
          en: "Is 8 weeks realistic?",
        },
        answer: {
          tr: "Her özellik için değil — ilk değer getiren versiyon için evet. Kapsam sprint başında birlikte belirlenir ve haftalık olarak korunur; ne kapsam içinde, ne kapsam dışında ilk hafta yazıya geçer ve sonradan pazarlık konusu olmaz. Sekiz hafta ürün şartnamesi, tasarım, geliştirme ve canlıya alma için planlanmıştır; 30 günlük stabilizasyon bunun ardından işler. Kapsam kayması için ayrı bir süreç işletilir.",
          en: "Not for every feature — for the first value-delivering version, yes. Scope is defined together at the start of the sprint and protected weekly: what is in and what is out gets written down in week one and is not renegotiated later. The eight weeks are planned for the product spec, design, development and deployment; the 30-day stabilisation runs after that. A separate process handles scope creep.",
        },
      },
      {
        question: {
          tr: "MVP nedir, sizin tanımınız ne?",
          en: "What is an MVP, and what is your definition of it?",
        },
        answer: {
          tr: "MVP, bir ürünün ilk değer getiren sürümüdür — kırpılmış bir özellik listesi değil, tek bir işi uçtan uca yapan çalışan yazılım. Bu pakette MVP üretim ortamında çalışır, gerçek kullanıcıya açılır, metriklere bağlanır ve 30 gün stabilize edilir. Prototip veya demo değil, piyasadaki ilk üretim sürümüdür. Gözlemleme ve uyarı sistemi ilk günden kurulur; ölçüm sonradan eklenmez.",
          en: "An MVP is a product's first value-delivering version — not a trimmed feature list, but working software that does one job end to end. In this package the MVP runs in production, opens to real users, is wired to metrics and is stabilised for 30 days. It is the first production release in market, not a prototype or a demo. Monitoring and alerting are set up from day one; measurement is not bolted on later.",
        },
      },
      {
        question: {
          tr: "Kaynak kodu gerçekten bize mi ait?",
          en: "Do we really own the source code?",
        },
        answer: {
          tr: "Evet, tam sahiplikle. Teslim paketinde depo, mimari dokümantasyon ve bağımlılık listesi bulunur; operasyon kılavuzu günlük bakımı, hata müdahale prosedürünü ve ölçekleme rehberini içerir. İç ekip altyapıyı büyütebilir, değiştirebilir ya da devre dışı bırakabilir — ekip biter, ürün kalır. Dış bağımlılık kurgulanmaz; TypeScript monolit varsayılanı da bu yüzden seçilir, devralan taraf dağınık servisler yerine tek bir kod tabanı yönetir.",
          en: "Yes, with full ownership. The handover includes the repository, architecture documentation and dependency list; the operations runbook covers daily maintenance, the incident response procedure and a scaling guide. The internal team can extend, modify or decommission the infrastructure — the team finishes, the product stays. No external dependency is engineered in, and the TypeScript monolith default serves the same end: whoever inherits it manages a single codebase rather than a scattered set of services.",
        },
      },
      {
        question: {
          tr: "30 günlük stabilizasyon bitince ne oluyor?",
          en: "What happens when the 30-day stabilisation ends?",
        },
        answer: {
          tr: "Ürün iç ekibe devredilir. Stabilizasyon süresince canlı ortamda hata takibi yapılır, küçük düzeltmeler girer, kullanıcı geri bildirimi döngüsü işler ve devir dokümantasyonu tamamlanır. Otuzuncu günden sonra bakımı iç ekip ya da mevcut tedarikçi yürütür; operasyon kılavuzu, mimari doküman ve metrik bağlantısı tam bu devir için hazırlanır. Sürdürülen bir iş birliği ayrı kapsam ve ayrı fiyatla tanımlanır — zorunlu bakım sözleşmesi yoktur.",
          en: "The product transfers to the internal team. During stabilisation bugs are tracked in the live environment, minor fixes ship, the user feedback loop runs and the handover documentation is completed. After day thirty, maintenance runs with the internal team or the existing vendor; the operations runbook, architecture docs and metric wiring are prepared for exactly that handover. A continuing engagement is defined with its own scope and its own price — there is no mandatory maintenance contract.",
        },
      },
      {
        question: {
          tr: "Fiyata neler dahil değil?",
          en: "What is not included in the price?",
        },
        answer: {
          tr: "Paket fiyatının dışında üç kalem vardır: bulut altyapısı, alan adı ve üçüncü taraf lisanslar. Fiyat kapsam listesindeki beş kalemi karşılar: ürün şartnamesi, UI/UX tasarım, geliştirme, canlıya alma ve 30 günlük stabilizasyon. Otuzuncu günden sonraki bakım da bu listede yer almaz, ayrı konuşulur. Tüketime bağlı giderler sabit fiyata alınmaz; kullanım arttıkça o rakam da artar.",
          en: "Three items sit outside the package price: cloud infrastructure, the domain and third-party licences. The price covers the five scope items: product spec, UI/UX design, development, deployment and the 30-day stabilisation. Maintenance after day thirty is not on that list either and is discussed separately. Consumption-based costs are never folded into a fixed price, because they rise as usage rises.",
        },
      },
      {
        question: {
          tr: "Mevcut yazılım ekibimiz MVP geliştirme sürecine nasıl dahil oluyor?",
          en: "How does our existing software team take part in the MVP development?",
        },
        answer: {
          tr: "Aynı depoda, aynı mimari kararlarla çalışılır. TypeScript monolit varsayılandır ve tercih gerekçesiyle yazılır; iç ekip mimari dokümantasyon üzerinden karara baştan ortak olur. Devir bir dosya aktarımı değil, kod tabanını sürdürebilecek bilginin aktarımıdır — operasyon kılavuzu, mimari doküman ve bağımlılık listesi bu amaçla hazırlanır. Sekizinci haftanın sonunda ekip kendi ürününü tanıyor olmalıdır, yeni bir kod tabanıyla tanışmamalıdır.",
          en: "Work runs in the same repository, under the same architecture decisions. A TypeScript monolith is the default and the rationale is written down; the internal team joins the decision through the architecture documentation from the start. Handover is a transfer of the knowledge needed to sustain the codebase rather than a file drop — the operations runbook, architecture docs and dependency list are written for that purpose. By the end of week eight the team should know its own product, not meet a new codebase.",
        },
      },
      {
        question: {
          tr: "8 hafta boyunca bizden ne bekliyorsunuz?",
          en: "What do you need from us across the 8 weeks?",
        },
        answer: {
          tr: "En yoğun katkı ilk aşamadadır: ürün şartnamesi ve kullanıcı hikâyeleri birlikte yazılır, öncelik sırası ve kapsam sınırı orada çizilir. Sonrasında tasarım ve geliştirme kararları onay ister, üretim değil; canlıya alma öncesi son kontrol de müşteri tarafındadır. Stabilizasyon döneminde hata bildirimlerinin tek bir muhataptan gelmesi süreci hızlandırır. Tam zamanlı kaynak ayrılması gerekmez; karar verecek bir muhatap yeterlidir.",
          en: "The heaviest input is at the front: the product spec and user stories are written together, and the priority order and scope boundary are drawn there. After that, design and development decisions need approval rather than production work, and the final check before deployment sits on the client side. During stabilisation, routing bug reports through one counterpart keeps the process fast. No full-time resource is required; a single counterpart for decisions is enough.",
        },
      },
      {
        question: {
          tr: "Kapsam değişirse ne oluyor?",
          en: "What happens if the scope changes?",
        },
        answer: {
          tr: "Kapsam sprint başında birlikte yazılır ve haftalık korunur. Yeni bir özellik talebi geldiğinde iki seçenek sunulur: mevcut listeden bir maddeyi çıkarmak ya da süreyi ve fiyatı yeniden hesaplamak. Üçüncü bir yol önerilmez — sessizce eklenen özellik, sekiz haftayı on iki haftaya çeviren şeydir ve taahhüdün en yaygın kırılma noktasıdır. Sabit fiyat ancak sabit kapsamla ayakta durur; o yüzden her değişiklik yazıya geçer.",
          en: "Scope is written together at the sprint start and protected weekly. When a new feature request arrives, two options are put on the table: drop an item from the current list, or recalculate duration and price. No third path is offered — a quietly added feature is what turns eight weeks into twelve, and it is the most common break point in the commitment. A fixed price only stands on a fixed scope, so every change goes on paper.",
        },
      },
      {
        question: {
          tr: "Bu paket kimler için uygun değil?",
          en: "Who is this package not for?",
        },
        answer: {
          tr: "Gereksinimleri henüz tanımlanmamış işler için uygun değildir. Şartname sekiz haftanın ilk adımıdır, bir keşif fazı değil; ne inşa edileceği belirsizse doğru başlangıç Dijital Dönüşüm Teşhisi'dir. Mevcut büyük bir sistemin yerine geçecek göç projeleri de bu kapsamın dışındadır. Bir fikrin tutup tutmayacağını sınamak yeterliyse AI Pilot daha ucuz ve daha hızlı yoldur.",
          en: "Not for work whose requirements are still undefined. The spec is the first step of the eight weeks, not a discovery phase; where what gets built is unclear, the right starting point is the Digital Transformation Audit. Migration projects replacing a large existing system also sit outside this scope. Where testing whether an idea holds is enough, the AI Pilot is the cheaper and faster route.",
        },
      },
      {
        question: {
          tr: "Fiyat sabit mi, süreç içinde ek kalem çıkar mı?",
          en: "Is the price fixed, or do extra line items appear along the way?",
        },
        answer: {
          tr: "Fiyat sabittir ve kapsam listesine bağlıdır. Sekiz haftanın içinde ek kalem çıkmaz; kapsam değişirse yeniden fiyatlama yazılı olarak yapılır. Bulut ve lisans giderleri tüketime göre değiştiği için baştan fiyatın dışında tutulur. Otuz günlük stabilizasyon fiyata dahildir, sonrasındaki bakım ayrı kapsam olarak tanımlanır. Kapsam listesi anlaşmanın parçasıdır ve sekiz hafta boyunca haftalık korunur.",
          en: "The price is fixed and tied to the scope list. No extra line item appears inside the eight weeks; if scope changes, repricing is put in writing. Cloud and licence costs vary with consumption, so they are excluded from the outset. The 30-day stabilisation is inside the price, and maintenance after that is defined as separate scope. The scope list is part of the agreement and is protected weekly across the eight weeks.",
        },
      },
      {
        question: {
          tr: "İhtiyacımız yeni bir yazılım mı, süreç düzeltmesi mi — nasıl karar veririz?",
          en: "Do we need new software or a process fix — how do we decide?",
        },
        answer: {
          tr: "Kısıt mevcut sistemlerin arasındaki boşluktaysa yeni yazılım gerekmeyebilir. MVP Build, bugün karşılığı olmayan bir işi inşa etmek içindir — OMS, sipariş takip ya da müşteri portalı gibi; hazır bir araç aynı işi görüyorsa yazılım yazmak pahalı yoldur. Mevcut akışın nerede tıkandığı belirsizse Dijital Dönüşüm Teşhisi bunu üç haftada haritalar ve gerektiği yerde şartnameyi de üretir. İki paket art arda kullanılabilir.",
          en: "If the constraint sits in the gap between existing systems, new software may not be needed. MVP Build exists to build work that has no counterpart today — an OMS, order tracking or a customer portal; where a ready tool does the same job, writing software is the expensive route. Where it is unclear how the current flow stalls, the Digital Transformation Audit maps it in three weeks and produces the spec where one is needed. The two packages can run back to back.",
        },
      },
    ],
  },
];

export function getPackageBySlug(
  slug: string,
  locale: "tr" | "en"
): PackageContent | null {
  return (
    PACKAGES.find((p) => p.slug[locale] === slug || p.slug.tr === slug) ?? null
  );
}
