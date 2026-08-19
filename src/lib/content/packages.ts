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
        question: { tr: "4 hafta gerçekten yeterli mi?", en: "Is 4 weeks really enough?" },
        answer: {
          industrial: {
            tr: "Teşhis, strateji ve yol haritası için yeterli. Uygulamanın tamamı için değil — sprint sonunda karar sizin; proje veya aylık retainer formatına geçişe hazırız.",
            en: "For diagnosis, strategy and roadmap — yes. For full execution — no. The decision at the end of the sprint is yours; we are ready to move into a project or monthly retainer format.",
          },
          commerce: {
            tr: "Sprint boyunca bazı hızlı kazanımlar canlıya alınır — landing page testi veya bütçe yeniden dağılımı gibi. Büyük kanal etkisi 4-6 hafta içinde ölçülmeye başlar.",
            en: "Some quick wins go live during the sprint — landing page tests or budget reallocation. Larger channel impact starts to be measurable within 4-6 weeks.",
          },
        },
      },
      {
        question: {
          tr: "Sprint sonrası bağlayıcı bir taahhüt var mı?",
          en: "Is there any commitment after the sprint?",
        },
        answer: {
          industrial: {
            tr: "Hayır. Rapor teslim edildiğinde iş birliği tamamlanmış sayılır; devam edip etmeme kararı tamamen size kalır. Rollback veya duraklatma için ek süreç gerekmez.",
            en: "No. Once the report is delivered, the engagement is complete. Whether to continue is entirely your decision. No additional process is needed to pause or stop.",
          },
          commerce: {
            tr: "Test listesi ve medya planı iç ekibinize hazır devredilir. İstersen retainer'a geçeriz ve biz yürütürüz; istemezsen belgeler elinde — sen veya ajansın devam eder.",
            en: "The test backlog and media plan are handed over to your team, ready to use. If you want to continue with us on retainer, we execute. If not, the docs are yours — your team or agency takes it from there.",
          },
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
          industrial: {
            tr: "Hayır. Bağımsız danışmanlık. Hangi ERP, hangi modül, hangi sırayla — kararı siz verirsiniz; biz teşhis ve yol haritasını üretiriz. Belirli bir satıcıya yönlendirme yapmıyoruz.",
            en: "No. Independent consulting. Which ERP, which module, in which order — the decision is yours; we produce the diagnosis and roadmap. We do not direct to any specific vendor.",
          },
          commerce: {
            tr: "Evet, ama bağımsız olarak. Hangi OMS, hangi WMS, hangi entegrasyon — büyüme hedefinize ve mevcut stack'inize göre öneririz. Belirli satıcıyla bağımız yok.",
            en: "Yes, but independently. Which OMS, which WMS, which integration — recommended based on your growth target and existing stack. No vendor affiliation.",
          },
        },
      },
      {
        question: {
          tr: "AI veya dijital dönüşüm projesi için bu teşhis uygun mu?",
          en: "Is this diagnosis suitable for an AI or digital transformation project?",
        },
        answer: {
          industrial: {
            tr: "Evet. Teşhis kapsamı, AI dahil her dijital süreci değerlendirir. 'AI burada uygun değil' sonucu da değerli bir teşhistir — boşa yatırım yapmamış olursunuz.",
            en: "Yes. The audit scope covers every digital process, including AI. A finding of 'AI is not suitable here' is also a valuable diagnosis — it prevents a misplaced investment.",
          },
          commerce: {
            tr: "Evet. Her öneri için teknik şartname ve araç seçimi hazır teslim edilir. Kendi ekibinle başlayabilirsin ya da uygulama için devam paketine geçebiliriz.",
            en: "Yes. A spec document and tool selection are delivered ready to use for each recommendation. You can start with your own team, or move into an implementation package with us.",
          },
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
          industrial: {
            tr: "Pilot, üretim ortamına hazır bir ürün değildir — ama üretim ortamına hangi adımlarla, hangi maliyetle ve hangi sürede gidileceği net olarak belgelenir. Karar tamamen size kalır.",
            en: "The pilot is not a production-ready product — but how to get there, at what cost and on what timeline, is documented clearly. The decision to proceed stays with you.",
          },
          commerce: {
            tr: "Pilot, production değildir — ama production'a hangi adımlarla, ne maliyetle gittiğini gösterir. Sprint sonunda teknik yol haritası elinde; devam kararı senin.",
            en: "The pilot is not production — but it shows exactly how to get there and at what cost. At the end of the sprint the technical roadmap is in your hands; the decision to proceed is yours.",
          },
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
        question: { tr: "8 hafta gerçekçi mi?", en: "Is 8 weeks realistic?" },
        answer: {
          industrial: {
            tr: "Her özellik için değil — ilk değer getiren versiyon için evet. Kapsam sprint başında birlikte belirlenir ve haftalık olarak korunur; kapsam kayması için bir süreç işletiyoruz.",
            en: "Not for every feature — for the first value-delivering version, yes. Scope is defined together at the start of the sprint and protected weekly; we run a process to manage scope creep.",
          },
          commerce: {
            tr: "İlk değer getiren versiyon için evet. Her özellik için değil — kapsam sprint başında birlikte belirlenir ve haftalık korunur. Ne kapsam içinde ne kapsam dışında, net.",
            en: "For the first value-delivering version — yes. Not for every feature. Scope is defined together at the sprint start and protected weekly. What's in, what's out — made explicit.",
          },
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
