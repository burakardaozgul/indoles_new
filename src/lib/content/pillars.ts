import type { PillarContent } from "./types";

export const PILLARS: PillarContent[] = [
  {
    key: "growth",
    name: { tr: "Growth", en: "Growth" },
    tagline: {
      industrial: {
        tr: "Sanayi markası için yapısal büyüme.",
        en: "Structural growth for industrial brands.",
      },
      commerce: {
        tr: "Büyümeyi sisteme bağlayan disiplin.",
        en: "The discipline that turns growth into a system.",
      },
    },
    heroLede: {
      tr: "Marka, performans ve deneyimi tek bir büyüme makinesinde birleştirir. Kampanya değil; sistem. Trafik değil; dönüşüm.",
      en: "Brand, performance and experience unified into one growth engine. Not a campaign — a system. Not traffic — conversion.",
    },
    description: {
      industrial: {
        tr: "Marka konumlandırması, B2B müşteri edinimi ve performans kanallarını tek bir büyüme sisteminde birleştirir. İhracat hedefi veya yurt içi pazar payı — strateji veriye dayanır, uygulama yanında durur.",
        en: "Brand positioning, B2B customer acquisition and performance channels unified in one growth system. Export target or domestic market share — strategy is grounded in data, execution stays alongside.",
      },
      commerce: {
        tr: "CAC düşer, ROAS yükselir, LTV uzar — marka, performans ve dönüşüm aynı anda çalışınca. Kampanya çıkarmıyoruz; büyüme motorunu birlikte inşa ediyoruz.",
        en: "CAC drops, ROAS lifts, LTV extends — when brand, performance and conversion work in sync. We don't run campaigns; we build the growth engine together.",
      },
    },
    methodology: [
      {
        step: "01",
        title: { tr: "Teşhis", en: "Diagnose" },
        description: {
          tr: "Funnel'ın neresinde kayıp var? Data + kullanıcı görüşmesi + kanal analitiği ile sızıntıyı bul.",
          en: "Where is the leak in the funnel? Find it with data, user interviews and channel analytics.",
        },
      },
      {
        step: "02",
        title: { tr: "Strateji", en: "Strategy" },
        description: {
          tr: "Hangi kanala ne kadar, hangi mesajla, hangi hedefle. Net önceliklendirme, net bütçe.",
          en: "How much to which channel, with what message, to what goal. Clear prioritization, clear budget.",
        },
      },
      {
        step: "03",
        title: { tr: "Uygulama", en: "Execute" },
        description: {
          tr: "Performance, CRO, e-ticaret ve UI/UX ekipleri tek sprint ritminde çalışır.",
          en: "Performance, CRO, e-commerce and UI/UX teams work in one sprint cadence.",
        },
      },
      {
        step: "04",
        title: { tr: "Ölçek", en: "Scale" },
        description: {
          tr: "Çalışan kanal ikiye katlanır, çalışmayan kapanır. Haftalık review, aylık karar.",
          en: "What works gets doubled, what doesn't gets cut. Weekly review, monthly decision.",
        },
      },
    ],
    metrics: [
      {
        value: "3.2×",
        label: { tr: "Ortalama ROAS artışı", en: "Average ROAS lift" },
      },
      {
        value: "-%34",
        label: { tr: "Müşteri edinim maliyeti", en: "Customer acquisition cost" },
      },
      {
        value: "12 hafta",
        label: { tr: "Ortalama etki süresi", en: "Average time to impact" },
      },
    ],
    faq: [
      {
        question: {
          tr: "Growth altında hangi hizmetler var?",
          en: "Which services sit under Growth?",
        },
        answer: {
          tr: "Growth beş hizmeti taşır: marka stratejisi ve pazarlama danışmanlığı, performans pazarlama, dönüşüm optimizasyonu, e-ticaret ve UI/UX tasarım. Beşi ayrı ekipler olarak değil, tek sprint ritminde çalışır. Ölçü de kanal başına değil huninin bütünü üzerinden alınır, çünkü reklamda kazanılan tıklama arayüzde kaybedilirse tablo yanıltıcı çıkar.",
          en: "Growth carries five services: brand strategy and marketing advisory, performance marketing, conversion optimisation, e-commerce, and UI/UX design. They run in one sprint cadence rather than as separate teams. Results are measured across the whole funnel rather than channel by channel, because a click won in advertising and lost in the interface makes any single-channel report misleading.",
        },
      },
      {
        question: {
          tr: "Growth mu Transform mı bize uygun?",
          en: "Growth or Transform — which one fits us?",
        },
        answer: {
          tr: "Sorun talep tarafındaysa Growth, verim tarafındaysa Transform doğru disiplindir. Satış geliyor ama edinim maliyeti yüksek veya dönüşüm düşükse Growth çalışır; iş akışı yavaşlıyorsa ve elle iş yığılıyorsa Transform. İki disiplin birbiriyle yarışmaz, sıraya girer — hangisinin önce geleceğini teşhis belirler, tahmin değil.",
          en: "Growth is the right discipline when the problem sits on the demand side, Transform when it sits on the efficiency side. Growth applies where sales come in but acquisition cost is high or conversion is low; Transform applies where workflows slow down and manual work piles up. The two don't compete, they queue — and diagnosis decides the order, not guesswork.",
        },
      },
      {
        question: {
          tr: "Nereden başlanır?",
          en: "Where does the work start?",
        },
        answer: {
          tr: "Her Growth çalışması teşhisle başlar. Veri, kullanıcı görüşmesi ve kanal analitiği birlikte okunur; huninin neresinde kayıp olduğu ölçüyle bulunur. Reçete bu adımdan önce yazılmaz. Hangi kanala ne kadar bütçe ayrılacağı, hangi mesajın deneneceği ve ilk hangi kaldıracın çekileceği de ancak teşhis tamamlandıktan sonra netleşir.",
          en: "Every Growth engagement starts with diagnosis. Data, user interviews and channel analytics are read together, and the leak in the funnel is located by measurement rather than assumption. No prescription is written before that step. How much budget goes to which channel, which message gets tested and which lever gets pulled first all become clear only once the diagnosis is complete.",
        },
      },
      {
        question: {
          tr: "İlk ölçülebilir sonucu ne zaman görürüz?",
          en: "When do we see the first measurable result?",
        },
        answer: {
          tr: "Growth çalışmalarında ortalama etki süresi 12 hafta. İlk haftalar teşhise ve ölçüm altyapısına gider, çünkü kampanya çıktısı ancak veri doğru aktığında yorumlanabilir. Sonrasında ritim sabittir: haftalık gözden geçirme, aylık karar. Bu ritim kurulmadan alınan erken sonuçlar tekrarlanamaz ve hangi kaldıracın işe yaradığı görünmez kalır.",
          en: "Across Growth engagements the average time to impact is 12 weeks. The first weeks go to diagnosis and measurement setup, because campaign output only means something once data flows correctly. After that the cadence is fixed: weekly review, monthly decision. Early results taken before that cadence exists cannot be repeated, and which lever actually worked stays invisible.",
        },
      },
      {
        question: {
          tr: "Hizmet mi paket mi seçmeliyiz?",
          en: "Should we pick a service or a package?",
        },
        answer: {
          tr: "Kapsam belirsizse paket, belirliyse hizmet uygun olur. Paketler sabit süreli ve sabit fiyatlıdır; ne yapılacağı henüz netleşmemişken teşhisi tanımlı bir çerçevede kapatır ve çıktısı bir yol haritasıdır. Kapsam zaten netse paket adımı atlanır ve doğrudan ilgili hizmetle başlanır. Karar bütçeye değil, sorunun ne kadar tanımlı olduğuna bağlıdır.",
          en: "A package suits an unclear scope, a service a clear one. Packages are fixed in duration and price; they close the diagnosis inside a defined frame while the work ahead is still undecided, and their output is a roadmap. Where scope is already clear the package step is skipped and the matching service starts directly. The choice depends on how well defined the problem is, not on budget.",
        },
      },
      {
        question: {
          tr: "Kampanya yürütmekle büyüme sistemi kurmak arasındaki fark ne?",
          en: "What separates running campaigns from building a growth system?",
        },
        answer: {
          tr: "Kampanya tek seferlik bir çıktı, sistem tekrarlanabilir bir karar mekanizmasıdır. Kampanya bittiğinde etkisi de biter ve bir sonraki dönem sıfırdan başlar. Sistemde ise çalışan kanal ikiye katlanır, çalışmayan kapanır ve aynı karar bir sonraki ay aynı ölçüyle yeniden alınır. Fark bütçede değil, kararın nasıl verildiğindedir.",
          en: "A campaign is a one-off output; a system is a repeatable decision mechanism. When a campaign ends its effect ends with it and the next period starts from zero. In a system what works gets doubled, what doesn't gets cut, and the same decision is taken again next month on the same measure. The difference is not in the budget but in how the decision is made.",
        },
      },
      {
        question: {
          tr: "Bütçe kanallara nasıl dağıtılır?",
          en: "How is budget split across channels?",
        },
        answer: {
          tr: "Dağılım teşhisten çıkan önceliğe göre kurulur. Hangi kanala ne kadar, hangi mesajla ve hangi hedefle sorusu strateji adımında yazıya döker. Dağılım sonra sabit kalmaz: haftalık gözden geçirmede veriye göre kayar, çalışmayan kanalın bütçesi kazanana geçer. Kanal listesi de sabit değildir — getirisi düşen kanal kapatılır, yenisi test bütçesiyle açılır.",
          en: "The split is built on the priority the diagnosis produces. The strategy step writes down how much goes to which channel, with what message and toward what goal. It then does not stay fixed: weekly review shifts it on the data, moving budget from what stalls to what performs. The channel list is not fixed either — a declining channel closes, a new one opens on test budget.",
        },
      },
      {
        question: {
          tr: "Growth yalnız e-ticaret markaları için mi?",
          en: "Is Growth only for e-commerce brands?",
        },
        answer: {
          tr: "Growth sanayi ve hizmet işletmelerinde de çalışır; değişen kanal değil, izlenen ölçüttür. E-ticarette dönüşüm oranı ve müşteri edinim maliyeti okunur; sanayide teklif talebi sayısı, nitelikli görüşme ve satış döngüsünün uzunluğu. Yöntem aynı kalır: teşhis, strateji, uygulama, ölçek. Değişen tek şey gösterge tablosunun hangi rakamları taşıdığıdır.",
          en: "Growth applies in industrial and service businesses too; what changes is the metric, not the channel. E-commerce reads conversion rate and customer acquisition cost, while industrial work reads quote requests, qualified meetings and sales cycle length. The method holds throughout: diagnose, strategise, execute, scale. The only thing that changes is which numbers the dashboard carries.",
        },
      },
      {
        question: {
          tr: "Ölçüm altyapımız eksikse ne olur?",
          en: "What if our measurement setup is broken?",
        },
        answer: {
          tr: "Eksik ölçüm önce onarılır, kampanya sonra açılır. Piksel eksikse ya da dönüşüm izleme yanlış kuruluysa reklam kararları eksik veriyle alınır ve bütçe hangi ürünün sattığını göstermeden harcanır. SOYLU AVM ve GYMWOLVES vakalarında ilk iş buydu: veri uçtan uca doğrulanana kadar hiçbir reklam seti açılmadı ve optimizasyon başlamadı.",
          en: "Broken measurement gets repaired first and the campaign opens afterwards. With missing pixels or misconfigured conversion tracking, ad decisions run on incomplete data and budget is spent without showing which product sold. In the SOYLU AVM and GYMWOLVES cases this was the first job: no ad set opened and no optimisation began until data was verified end to end.",
        },
      },
      {
        question: {
          tr: "Birden fazla disiplin aynı anda yürüyebilir mi?",
          en: "Can several disciplines run at once?",
        },
        answer: {
          tr: "Disiplinler çoğu işte birlikte yürür. Growth talebi büyütürken Build bu talebi taşıyacak altyapıyı kurar, Transform arka ofisin yükünü alır. Tek koşul ortak ölçüdür: üç disiplin de aynı gösterge tablosuna rapor eder. Aksi halde bir taraftaki kazanç diğer tarafta görünmeden erir ve hangi çalışmanın ne kattığı tartışmalı kalır.",
          en: "In most engagements the disciplines run together. Growth raises demand while Build puts up the infrastructure to carry it and Transform absorbs the back-office load. The one condition is a shared measure: all three report to the same dashboard. Otherwise a gain on one side quietly erodes on another, and what each stream contributed stays open to argument.",
        },
      },
      {
        question: {
          tr: "Çalışma bittiğinde kurulan sistem kimde kalır?",
          en: "Who keeps the system when the engagement ends?",
        },
        answer: {
          tr: "Kurulan sistem müşteride kalır. Ölçüm kurulumu, kanal yapılandırması ve raporlama çerçevesi markanın kendi hesaplarında durur; devirde iç ekip aynı ritmi sürdürecek dokümanı da alır. OdorGo çalışmasında operasyonun tamamı Şubat 2026'da markanın kendi ekibine geçti ve kurulan yapı sahibiyle çalışmaya devam etti.",
          en: "The system stays with the client. Measurement setup, channel configuration and the reporting frame live in the brand's own accounts, and handover includes the documentation the internal team needs to keep the cadence. In the OdorGo engagement the entire operation moved to the brand's own team in February 2026, and the structure kept running with its owner.",
        },
      },
    ],
    // Küme tepesi: alt hizmetlerin ana kelimelerini tekrarlamaz ("performans
    // pazarlama ajansı", "dönüşüm oranı optimizasyonu" onların sayfasında).
    // Buradaki hedef şemsiye niyet: "büyüme stratejisi", "pazarlama
    // danışmanlığı" (strateji §2, P1 kümeleri).
    seo: {
      title: {
        tr: "Büyüme stratejisi ve pazarlama danışmanlığı",
        en: "Growth strategy and marketing consultancy",
      },
      description: {
        tr: "Marka stratejisi, performans pazarlaması, dönüşüm optimizasyonu ve e-ticaret tek büyüme sisteminde çalışır. Kanal veriyle seçilir, satış ölçülerek artar.",
        en: "Brand strategy, performance marketing, conversion optimisation and e-commerce run as one growth system. Channels chosen on data, sales measured as they grow.",
      },
    },
  },
  {
    key: "transform",
    name: { tr: "Transform", en: "Transform" },
    tagline: {
      industrial: {
        tr: "Verimle büyüyen operasyonlar için dönüşüm.",
        en: "Transformation for operations that grow through efficiency.",
      },
      commerce: {
        tr: "E-ticaret operasyonu hızlanır, ölçeklenir.",
        en: "E-commerce operations, faster and ready to scale.",
      },
    },
    heroLede: {
      tr: "Süreç, veri ve otomasyonu işin hızına eşler. Verim ölçülebilir artar, maliyet görünür düşer.",
      en: "Process, data and automation matched to business speed. Efficiency rises measurably; cost drops visibly.",
    },
    description: {
      industrial: {
        tr: "Üretim hattından ERP'ye, tedarik zincirinden iş zekası sistemine — süreç analizi, otomasyon tasarımı ve uygulama tek elde. Her adımda yatırım getirisi (ROI) hesaplanır, maliyet düşüşü ölçülür.",
        en: "From production line to ERP, from supply chain to business intelligence — process analysis, automation design and implementation under one roof. ROI calculated at every step; cost reduction measured.",
      },
      commerce: {
        tr: "Sipariş akışı, envanter senkronizasyonu, müşteri segmentasyonu — operasyonel darboğazlar tespit edilir, otomasyon devreye alınır. Elle iş azalır, büyüme engeli kalkar.",
        en: "Order flow, inventory sync, customer segmentation — operational bottlenecks identified, automation deployed. Less manual work; growth blockers removed.",
      },
    },
    methodology: [
      {
        step: "01",
        title: { tr: "Süreç haritalama", en: "Process mapping" },
        description: {
          tr: "As-is durum. Sahada gözlem, süreç sahipleriyle görüşme, veri akış şeması.",
          en: "As-is state. On-site observation, process owner interviews, data flow map.",
        },
      },
      {
        step: "02",
        title: { tr: "Audit ve önceliklendirme", en: "Audit & prioritization" },
        description: {
          tr: "En yüksek getiri sağlayacak 3-5 süreç. Her biri için ROI projeksiyonu.",
          en: "The 3-5 processes with highest ROI potential. Projection for each.",
        },
      },
      {
        step: "03",
        title: { tr: "Pilot", en: "Pilot" },
        description: {
          tr: "Tek bir süreçte 4-8 haftalık pilot. Hipotezi gerçekle ölç.",
          en: "4-8 week pilot on a single process. Test the hypothesis against reality.",
        },
      },
      {
        step: "04",
        title: { tr: "Ölçek + bilgi aktarımı", en: "Scale + knowledge transfer" },
        description: {
          tr: "Pilot çalışırsa iç ekibe teslim. Danışmanın gitmesi başarının parçasıdır.",
          en: "If the pilot works, hand off to the internal team. The consultant leaving is part of success.",
        },
      },
    ],
    metrics: [
      {
        value: "-%42",
        label: { tr: "Ortalama süreç süresi", en: "Average process time" },
      },
      {
        value: "-%28",
        label: { tr: "Operasyonel maliyet", en: "Operational cost" },
      },
      {
        value: "6-12 hafta",
        label: { tr: "Pilot → ölçek süresi", en: "Pilot to scale" },
      },
    ],
    faq: [
      {
        question: {
          tr: "Transform altında hangi hizmetler var?",
          en: "Which services sit under Transform?",
        },
        answer: {
          tr: "Transform beş hizmeti taşır: dijital dönüşüm, yapay zeka danışmanlığı, iş zekası, iş otomasyonları ve işletme mühendisliği. Beşi aynı soruyu farklı katmanlarda cevaplar — iş nerede yavaşlıyor, bu yavaşlama neye mal oluyor ve hangi adım ölçülebilir biçimde hızlanabilir. Hangi hizmetin devreye gireceğini süreç haritası belirler.",
          en: "Transform carries five services: digital transformation, AI advisory, business intelligence, business automation and operations engineering. All five answer one question at different layers — where the work slows down, what that delay costs, and which step can measurably speed up. Which service comes into play is decided by the process map, not chosen up front.",
        },
      },
      {
        question: {
          tr: "Nereden başlanır?",
          en: "Where does the work start?",
        },
        answer: {
          tr: "Her Transform çalışması süreç haritalamayla başlar. Sahada gözlem yapılır, süreç sahipleriyle görüşülür ve veri akış şeması çıkarılır; mevcut durum yazıya dökülmeden hedef durum tartışılmaz. Otomasyon kararı bu haritadan sonra verilir, çünkü haritasız otomasyon var olan bir aksaklığı yalnız daha hızlı tekrarlar.",
          en: "Every Transform engagement starts with process mapping. We observe on site, interview process owners and draw the data flow; the target state is not discussed before the current state is written down. The automation decision comes after that map, because automating without one simply repeats an existing fault at higher speed.",
        },
      },
      {
        question: {
          tr: "Hangi süreç önce otomatikleştirilir?",
          en: "Which process gets automated first?",
        },
        answer: {
          tr: "Sıraya en yüksek getiriyi verecek 3-5 süreç girer. Denetim adımında her aday için ayrı bir yatırım getirisi projeksiyonu yazılır ve sıralamayı bu projeksiyon belirler. Teknolojiye en yatkın süreç değil, kaybın en büyük olduğu süreç öne alınır. Listenin dışında kalanlar silinmez; sonraki döngüde yeniden değerlendirilir.",
          en: "The queue holds the three to five processes with the highest return. The audit step writes a separate ROI projection for each candidate, and that projection sets the order. The process with the biggest loss goes first, not the one that happens to suit the technology. Candidates left off the list are not discarded; they get reassessed in the next cycle.",
        },
      },
      {
        question: {
          tr: "Pilot neden zorunlu?",
          en: "Why is a pilot mandatory?",
        },
        answer: {
          tr: "Pilot, projeksiyonu sahada doğrulamak için zorunludur. Tek bir süreçte 4-8 haftalık pilot yürür ve hipotez gerçekle ölçülmeden ölçek adımına geçilmez. Kuruma yayılmış bir otomasyon yanlış kurulmuşsa hatayı da aynı ölçekte büyütür; pilotun maliyeti, o hatanın kurum genelinde düzeltilmesinin maliyetinin yanında küçük kalır.",
          en: "The pilot exists to test the projection against reality. A four to eight week pilot runs on a single process, and no scaling happens before the hypothesis is measured. An automation rolled out across the organisation multiplies its own mistakes at the same scale; the cost of the pilot stays small next to the cost of correcting that mistake everywhere.",
        },
      },
      {
        question: {
          tr: "Pilot beklediğini vermezse ne olur?",
          en: "What happens if the pilot underdelivers?",
        },
        answer: {
          tr: "Beklentiyi karşılamayan pilot ölçeklenmez. Pilotun işlevi ölçek kararını küçük bir alanda sınamaktır; olumsuz sonuç da bir sonuçtur ve bütçenin kalanını korur. Bulgular yazıya geçirilir, süreç haritasına geri dönülür ve sıradaki aday değerlendirilir. Çoğu durumda pilot, sorunun otomasyonda değil sürecin kendisinde olduğunu gösterir.",
          en: "A pilot that misses its target does not scale. Its function is to test the scaling decision in a small area; a negative result is still a result, and it protects the rest of the budget. Findings get written up, the process map is revisited and the next candidate is assessed. In many cases the pilot shows the problem lies in the process itself rather than in automation.",
        },
      },
      {
        question: {
          tr: "Yatırım getirisi nasıl hesaplanır?",
          en: "How is ROI calculated?",
        },
        answer: {
          tr: "Hesap süreç süresi ve operasyonel maliyet üzerinden yapılır. Mevcut durum haritalanırken adım süreleri ve maliyet kalemleri ölçülür; pilot sonrası aynı kalemler aynı yöntemle yeniden ölçülür ve fark rapora girer. Transform çalışmalarında ortalama olarak süreç süresinde %42, operasyonel maliyette %28 düşüş kaydediyoruz.",
          en: "The calculation runs on process time and operational cost. Step durations and cost items are measured while the current state is mapped, then measured again after the pilot with the same method, and the delta goes into the report. Across Transform engagements we record an average 42% drop in process time and 28% in operational cost.",
        },
      },
      {
        question: {
          tr: "Yapay zeka bu disiplinin neresinde duruyor?",
          en: "Where does AI sit in this discipline?",
        },
        answer: {
          tr: "Yapay zeka, girdisi düzensiz olan adımlarda devreye girer. Kural tabanlı otomasyon tekrar eden ve biçimi sabit akışı taşır; teknik soru, belge okuma ve eşleştirme gibi adımlarda ise kural yazmak yerine model çalıştırmak gerekir. Meccanotecnica Umbra'da mühendis tesisini anlatıyor, sistem uygun donanımı tek formda çıkarıyor — teklif talebi 10 katına çıktı.",
          en: "AI comes in at the steps whose input has no fixed shape. Rule-based automation carries repeating flows with a stable format, while steps like technical questions, document reading and matching call for a model rather than a rule set. At Meccanotecnica Umbra an engineer describes their plant and the system lays out the right equipment in a single form — quote requests rose tenfold.",
        },
      },
      {
        question: {
          tr: "Transform mu Build mi bize uygun?",
          en: "Transform or Build — which one fits us?",
        },
        answer: {
          tr: "Mevcut sistem iyileştirilebiliyorsa Transform, iyileştirilemiyorsa Build uygundur. Transform var olan sistemleri birbirine bağlar, otomatikleştirir ve ölçer; Build ihtiyacı karşılayan bir sistem hiç yoksa onu sıfırdan yazar. Süreç haritalaması bu ayrımı çoğu zaman kendisi verir, çünkü harita hangi adımın sistemsiz yürüdüğünü açıkça gösterir.",
          en: "Transform fits when the existing system can be improved, Build when it cannot. Transform connects, automates and measures what already runs; Build writes the system from scratch when nothing covers the need. Process mapping usually settles the question on its own, because the map shows plainly which steps are running with no system behind them.",
        },
      },
      {
        question: {
          tr: "Pilottan ölçeğe geçiş ne kadar sürer?",
          en: "How long does pilot-to-scale take?",
        },
        answer: {
          tr: "Geçiş ortalama 6-12 hafta sürer. Süre, otomatikleştirilen sürecin kaç sistemle konuştuğuna ve mevcut verinin kalitesine bağlıdır; entegrasyon sayısı arttıkça takvim uzar. Pilot süresi bu aralığın içinde değil, öncesindedir. Veri kalitesi düşükse takvimin önemli bir bölümü temizliğe gider ve bu süre baştan yazılır.",
          en: "The move takes 6-12 weeks on average. The span depends on how many systems the automated process talks to and on the quality of existing data; more integrations mean a longer schedule. The pilot period sits before this window, not inside it. Where data quality is poor, a significant share of the schedule goes to cleaning, and that time is written into the plan up front.",
        },
      },
      {
        question: {
          tr: "İç ekibimiz sistemi devralabilir mi?",
          en: "Can our internal team take the system over?",
        },
        answer: {
          tr: "Devir hedefin kendisidir ve ölçek adımı bilgi aktarımıyla birlikte yürür: doküman, çalışma ritmi ve sistem erişimi iç ekibe geçer. Danışmanın gitmesi başarısızlık değil, başarının parçasıdır. Devredilemeyen bir otomasyon, kurumu bir sistemden kurtarırken bir danışmana bağlar; böyle bir değişim iyileşme sayılmaz, yalnız bağımlılığın adresini değiştirir.",
          en: "Handover is the goal itself. The scaling step runs alongside knowledge transfer: documentation, working cadence and system access move to the internal team. The consultant leaving is part of success, not a sign of failure. An automation that cannot be handed over frees the organisation from one system only to tie it to a consultant, and that trade is not an improvement.",
        },
      },
      {
        question: {
          tr: "Birden fazla disiplin aynı anda yürüyebilir mi?",
          en: "Can several disciplines run at once?",
        },
        answer: {
          tr: "Disiplinler aynı takvimde yürüyebilir. Transform operasyonun yükünü alırken Growth talebi büyütür, Build eksik sistemi yazar. Koşul ortak ölçüdür: üç disiplin de aynı gösterge tablosuna rapor etmezse bir taraftaki kazanç diğer tarafta görünmeden erir. Ortak tablo aynı zamanda hangi işin önce yapılacağını da tartışılır kılar.",
          en: "The disciplines can share a schedule. Transform lifts the operational load while Growth raises demand and Build writes the missing system. The condition is a shared measure: unless all three report to the same dashboard, a gain on one side quietly erodes on another. That shared view also makes the sequencing question something the team can argue about with evidence.",
        },
      },
    ],
    // "yapay zeka" şapkasız ve "AI" yerine tercihli: GKP verisinde hacmin
    // tamamı bu yazımda (strateji §2.0, kalibrasyon kararı 1). Hizmet
    // sayfasının tam eşleşmesi "dijital dönüşüm danışmanlığı" — burada
    // şemsiye biçimi kullanılır, iç rekabet açılmaz.
    seo: {
      title: {
        tr: "Dijital dönüşüm, otomasyon ve yapay zeka",
        en: "Digital transformation, automation and AI",
      },
      description: {
        tr: "Süreç analizi, iş otomasyonu, iş zekası ve yapay zeka pilotları tek programda. Önce darboğaz ölçülür, sonra yatırım getirisi hesaplanmış adım atılır.",
        en: "Process analysis, business automation, business intelligence and AI pilots in one programme. Bottlenecks measured first, ROI calculated before each step.",
      },
    },
  },
  {
    key: "build",
    name: { tr: "Build", en: "Build" },
    tagline: {
      industrial: {
        tr: "Firmaya ait yazılım ve altyapı inşası.",
        en: "Software and infrastructure the firm owns.",
      },
      commerce: {
        tr: "Hızlı, piyasaya hazır ürün inşası.",
        en: "Fast, market-ready product engineering.",
      },
    },
    heroLede: {
      tr: "Özel yazılım, mobil uygulama ve altyapı. Dış danışmanlığı değil — sahiplikli, kod teslimli yapım.",
      en: "Custom software, mobile apps and infrastructure. Not outside advisory — ownership-led, code-delivered construction.",
    },
    description: {
      industrial: {
        tr: "Akıllı ERP modülü, iş yönetim yazılımı veya iç araç — bağımlılıksız, sahiplikli mühendislik. Kaynak kodu ve altyapı kontrolü firmada kalır; sistem büyüdükçe genişler.",
        en: "Custom ERP module, business management system or internal tool — dependency-free, ownership-led engineering. Source code and infrastructure control stays with the firm; the system grows as the business does.",
      },
      commerce: {
        tr: "Mobile uygulama, headless storefront veya custom e-ticaret altyapısı — 8-12 haftada piyasaya açık. Dış bağımlılık yok; kod ve altyapı kontrolü sizde.",
        en: "Mobile app, headless storefront or custom e-commerce infrastructure — market-ready in 8-12 weeks. No external dependency; code and infrastructure control stays with you.",
      },
    },
    methodology: [
      {
        step: "01",
        title: { tr: "Scoping", en: "Scoping" },
        description: {
          tr: "Problem, kısıt ve başarı kriterleri. Teknoloji seçimi en sonda.",
          en: "Problem, constraints and success criteria. Tech choice comes last.",
        },
      },
      {
        step: "02",
        title: { tr: "Mimari", en: "Architecture" },
        description: {
          tr: "ADR disiplini ile her seçim yazılır. Kod başladığında kararlar şeffaf.",
          en: "Every choice written down via ADR. When code starts, decisions are transparent.",
        },
      },
      {
        step: "03",
        title: { tr: "Build", en: "Build" },
        description: {
          tr: "Haftalık demo. Küçük adımlar, görünür ilerleme, düzenli müşteri onayı.",
          en: "Weekly demos. Small steps, visible progress, regular customer sign-off.",
        },
      },
      {
        step: "04",
        title: { tr: "Go-live + devir", en: "Go-live + handover" },
        description: {
          tr: "Observability baştan bağlı. Deploy sonrası 30 gün stabilizasyon. Sonra ekibe teslim.",
          en: "Observability wired from day one. 30 days of post-deploy stabilization. Then handover.",
        },
      },
    ],
    metrics: [
      {
        value: "8 hafta",
        label: { tr: "Ortalama MVP süresi", en: "Average MVP time" },
      },
      {
        value: "30 gün",
        label: { tr: "Post-launch stabilizasyon", en: "Post-launch stabilization" },
      },
      {
        value: "%100",
        label: { tr: "Source code teslimi", en: "Source code handover" },
      },
    ],
    faq: [
      {
        question: {
          tr: "Build altında hangi hizmetler var?",
          en: "Which services sit under Build?",
        },
        answer: {
          tr: "Disiplinin altında iki hizmet duruyor: özel yazılım ve mobil uygulama ile teknoloji ve altyapı danışmanlığı. Biri ürünü yazar, diğeri ürünün üzerinde çalışacağı altyapıyı kurar. Çoğu işte ikisi aynı takvimde yürür, çünkü mimari kararı ile barındırma kararı birbirinden ayrı verildiğinde maliyet ilk sürümden sonra ortaya çıkar.",
          en: "Two services sit under this discipline: custom software and mobile apps, and technology and infrastructure advisory. One writes the product, the other builds the infrastructure it runs on. In most engagements they share a schedule, because when the architecture decision and the hosting decision are taken separately, the cost of that gap only surfaces after the first release.",
        },
      },
      {
        question: {
          tr: "Hazır ürün varken neden özel yazılım?",
          en: "Why build custom software when off-the-shelf exists?",
        },
        answer: {
          tr: "Hazır ürün her zaman önce elenir. Scoping adımında problem, kısıt ve başarı kriteri yazılır; piyasadaki bir ürün üçünü de karşılıyorsa özel yazılım önerilmez. Özel yazılım, süreç hiçbir hazır ürüne sığmadığında ya da bağımlılığın maliyeti sistemin kendisinden büyüdüğünde anlam kazanır. Karar bu iki eşiğe göre verilir.",
          en: "Off-the-shelf gets ruled out first, every time. Scoping writes down the problem, the constraints and the success criteria, and if a product on the market meets all three we do not propose custom work. Custom software earns its place when the process fits no existing product, or when the cost of the dependency outgrows the system itself. Those two thresholds decide it.",
        },
      },
      {
        question: {
          tr: "Kaynak kod kimde kalır?",
          en: "Who owns the source code?",
        },
        answer: {
          tr: "Kaynak kodun tamamı müşteride kalır. Kod, altyapı erişimi ve mimari dokümanı teslimin parçasıdır. Devir sonrası başka bir ekiple devam etmenin önünde teknik bir engel bırakılmaz. Sahiplik bir sözleşme maddesi değil çalışma biçimidir: kod okunabilir, kararlar yazılı ve altyapı müşterinin kendi hesaplarında kurulur.",
          en: "The source code stays with the client in full. Code, infrastructure access and the architecture documentation are all part of delivery. Nothing technical is left in the way of continuing with another team after handover. Ownership is a way of working rather than a contract clause: the code is readable, the decisions are written down, and infrastructure is set up in the client's own accounts.",
        },
      },
      {
        question: {
          tr: "Bir MVP ne kadar sürer?",
          en: "How long does an MVP take?",
        },
        answer: {
          tr: "Ortalama MVP süresi 8 hafta. Süre kapsama bağlıdır ve kapsamı scoping belirler: hangi başarı kriterinin ilk sürüme gireceği orada kararlaştırılır. Takvim büyüdüğünde çözüm ekip büyütmek değil, ilk sürümü daraltmaktır. Daraltılamayan bir ilk sürüm genellikle başarı kriterinin yeterince keskin yazılmadığını gösterir.",
          en: "The average MVP takes 8 weeks. The span depends on scope, and scoping sets the scope: which success criteria make the first release is decided there. When the schedule grows, the fix is narrowing the first release rather than adding people. A first release that cannot be narrowed usually means the success criteria were not written sharply enough.",
        },
      },
      {
        question: {
          tr: "Teknoloji seçimi ne zaman yapılır?",
          en: "When is the technology chosen?",
        },
        answer: {
          tr: "Teknoloji seçimi en sonda yapılır. Önce problem, kısıt ve başarı kriteri netleşir; araç bu üçüne göre seçilir. Ters sırada çalışmak problemin araca uydurulmasıyla biter ve bedeli ilk sürümden sonra ortaya çıkar. Seçim yapıldığında gerekçesi ve elenen alternatifler yazılır, böylece karar sonradan sorgulanabilir kalır.",
          en: "Technology is chosen last. The problem, the constraints and the success criteria come first, and the tool is picked against those three. Working in the reverse order bends the problem to fit the tool, and the price of that shows up after the first release. Once the choice is made, its rationale and the alternatives ruled out are written down so the decision stays open to review.",
        },
      },
      {
        question: {
          tr: "Mimari kararlar nasıl kayda geçiyor?",
          en: "How are architecture decisions recorded?",
        },
        answer: {
          tr: "Mimari kararlar ADR disiplini ile kayda geçer. Her önemli seçim gerekçesi, elenen alternatifleri ve sonucuyla birlikte yazılır; kod başladığında karar geçmişi okunabilir durumdadır. Bir yıl sonra bu neden böyle sorusunun yazılı bir cevabı olur ve sistemi devralan ekip aynı tartışmayı baştan yapmak zorunda kalmaz.",
          en: "Architecture decisions are recorded through ADR discipline. Every significant choice is written with its rationale, the alternatives ruled out and the consequence, so the decision history is readable by the time code starts. A year later the question of why something works this way has a written answer, and the team inheriting the system does not have to rerun the same debate.",
        },
      },
      {
        question: {
          tr: "İlerlemeyi nasıl görürüz?",
          en: "How do we see progress?",
        },
        answer: {
          tr: "İlerleme haftalık demoyla görünür. Her hafta çalışan bir parça gösterilir ve her demo bir onay noktasıdır; kapsam değişikliği de burada konuşulur. Sürpriz teslim yoktur, çünkü teslimden önce her adım görülmüştür. Demo ayrıca kapsamın nerede büyüdüğünü erken gösterir ve takvim tartışması sona değil ortaya taşınır.",
          en: "Progress shows through weekly demos. A working piece is shown every week and each demo is a sign-off point where scope changes get discussed too. There is no surprise delivery, because every step has been seen before the last one. Demos also reveal early where scope is expanding, moving the schedule conversation to the middle of the project instead of the end.",
        },
      },
      {
        question: {
          tr: "Yayına aldıktan sonra ne oluyor?",
          en: "What happens after go-live?",
        },
        answer: {
          tr: "Yayın sonrası 30 gün stabilizasyon yürür. Observability baştan bağlandığı için sorun kullanıcıdan değil ölçümden duyulur; bu süre içinde canlı davranış izlenir ve düzeltmeler yapılır. Sürenin sonunda sistem iç ekibe devredilir. Devir paketinde çalışma dokümanı, izleme panoları ve bilinen sınırların listesi birlikte verilir.",
          en: "Thirty days of stabilisation follow go-live. Observability is wired from day one, so problems surface in measurement rather than through users; live behaviour is watched and corrections are made during that window. At the end of it the system is handed to the internal team. The handover package includes the working documentation, the monitoring dashboards and a list of known limits.",
        },
      },
      {
        question: {
          tr: "Build mi Transform mı bize uygun?",
          en: "Build or Transform — which one fits us?",
        },
        answer: {
          tr: "İhtiyacı karşılayan bir sistem varsa Transform, yoksa Build uygundur. Transform mevcut sistemleri bağlar ve hızlandırır; Build eksik olanı yazar. Mevcut yazılım sürekli istisna üretiyor ve her yeni ihtiyaç elle iş açıyorsa ayrım genellikle Build tarafındadır. Emin olunamadığında süreç haritalaması kararı ucuz bir adımda verir.",
          en: "Transform fits when a system already covers the need, Build when none does. Transform connects and speeds up what exists; Build writes what is missing. When existing software keeps producing exceptions and every new requirement creates manual work, the answer usually sits on the Build side. Where the call is unclear, process mapping settles it in a single inexpensive step.",
        },
      },
      {
        question: {
          tr: "Entegrasyon ağırlıklı işler de Build kapsamında mı?",
          en: "Do integration-heavy projects count as Build?",
        },
        answer: {
          tr: "Entegrasyon ağırlıklı işler Build kapsamına girer. MKComputer'da işin büyük bölümü veri hattı ve sunucu mimarisiydi: 200.000'den fazla ürünün stok, fiyat ve tedarikçi verisi tedarikçinin XML akışından çekiliyor ve her 5 dakikada bir güncelleniyor. Ekranlar bu hattın üstüne oturdu; görünen arayüz işin küçük tarafıydı.",
          en: "Integration-heavy projects fall under Build. At MKComputer most of the work was the data pipeline and the server architecture: stock, price and supplier data for more than 200,000 products is pulled from the supplier's XML feed and refreshed every five minutes. The interface sits on top of that pipeline, and the visible part was the smaller half of the job.",
        },
      },
      {
        question: {
          tr: "Nereden başlanır?",
          en: "Where does the work start?",
        },
        answer: {
          tr: "Her Build çalışması scoping ile başlar. Problem, kısıt ve başarı kriteri tek bir sayfada yazılır; süre ve teklif bu sayfadan çıkar. Sayfa yazılamıyorsa iş henüz tanımlı değildir ve kod yazmak için erkendir. Tanımsız başlayan projelerde maliyet kod yazarken değil, kapsam sonradan değişirken oluşur.",
          en: "Every Build engagement starts with scoping. The problem, the constraints and the success criteria are written on a single page, and the timeline and the proposal come out of it. If that page cannot be written, the work is not defined yet and it is too early for code. On undefined projects the cost accrues not while writing code but while the scope shifts later.",
        },
      },
    ],
    // Hizmet sayfası "özel yazılım ve mobil uygulama geliştirme" tam
    // eşleşmesini tutuyor; pillar bir kademe geniş durur ve altyapı tarafını
    // da toplar (strateji §2, P2 Özel Yazılım + Mobil kümesi).
    seo: {
      title: {
        tr: "Yazılım geliştirme ve teknoloji altyapısı",
        en: "Custom software and infrastructure engineering",
      },
      description: {
        tr: "Özel yazılım, mobil uygulama ve altyapı kurulumu. Hazır çözüm önce elenir; kaynak kod, doküman ve altyapı kontrolü baştan firmaya devredilir.",
        en: "Custom software, mobile apps and infrastructure. Off-the-shelf options ruled out first; source code, documentation and infrastructure control handed over.",
      },
    },
  },
];

export function getPillar(key: string): PillarContent | null {
  return PILLARS.find((p) => p.key === key) ?? null;
}
