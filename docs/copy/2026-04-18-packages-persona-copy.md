# Packages — Persona-Aware Copy (ADR-014 Faz B.3)

**Tarih:** 2026-04-18
**Scope:** /paketler listeleme + 4 paket detay
**Persona:** industrial + commerce × TR + EN
**Onay:** Burak Arda Özgül beklemede

---

## Üretim Bağlamı (Brand Voice Skill — Adım 1)

| Soru | Cevap |
|------|-------|
| Sayfa tipi | Paket listeleme (`/paketler`) + Paket detay (`/paketler/[slug]`) |
| Persona-aware | Evet — çift versiyon (docs/03 §1 + ADR-014) |
| Ton | industrial → dingin-kurumsal / commerce → dinamik-atletik |

**Persona angle özeti:**
- **industrial:** Satın alma komitesine sunulan spec dokümanı tonu. ROI projeksiyonu, metodoloji şeffaflığı, benchmark veri, adım adım deliverable tanımı. "Hangi süreç, hangi sırayla, hangi çıktıyla" dili. Persona 1A/1B için güven inşacısı: bağımsızlık, rollback şeffaflığı, karar özgürlüğü.
- **commerce:** Hızlı, metrik-önce, "kaç haftada ne metriğe" sorusunun anında cevabı. CAC/ROAS/LTV/CRO/funnel dili açıklamasız. Sprint formatının avantajı = düşük taahhütle içeri gir, somut etki gör, ölçekle.

---

## A. Listeleme Sayfası Hero

### Outline (iç referans)

**industrial angle:** Paketler, büyük iş birliklerinin giriş kapısı ama "giriş" kelimesi metodoloji çerçevesine oturmalı. "Sabit kapsam, sabit süre, sabit fiyat" vaadi bütçe öngörülebilirliği ve teşhis-önce disipliniyle desteklenir. Lede: metodik bir satın alma komitesinin bütçe güvencesi + karar özgürlüğü.

**commerce angle:** Eyebrow navigasyonel kalabilir. Title ritmik, kısa-kısa. Lede: giriş hızı + metrik hedefi + "starter plan" mantığı (homepage sections copy'sinde de kullanıldı; tutarlılık için korundu).

---

### industrial × TR

```json
{
  "eyebrow": "Paketler",
  "title": "Sabit kapsam. Sabit süre. Sabit fiyat.",
  "lede": "Büyük iş birliklerinin teşhis ve strateji giriş kapısı. Metodoloji şeffaf, bütçe öngörülebilir, karar sonunda firmaya kalır."
}
```

_Karakter: eyebrow 7 / title 36 / lede 147_

### industrial × EN

```json
{
  "eyebrow": "Packages",
  "title": "Fixed scope. Fixed time. Fixed price.",
  "lede": "The diagnostic and strategy entry point for larger engagements. Methodology transparent, budget predictable, the decision to proceed stays with you."
}
```

_Karakter: eyebrow 8 / title 34 / lede 145_

### commerce × TR

```json
{
  "eyebrow": "Paketler",
  "title": "Sabit kapsam. Sabit süre.\nSabit fiyat.",
  "lede": "Büyük iş birliklerinin hızlı giriş kapısı. Metrik hedefinizi belirle, paketi seç, başla. Starter plan gibi: içeri gir, değer gör, ölçekle."
}
```

_Karakter: eyebrow 7 / title 34 / lede 128_

### commerce × EN

```json
{
  "eyebrow": "Packages",
  "title": "Fixed scope. Fixed time.\nFixed price.",
  "lede": "The fast entry point to larger engagements. Set your metric target, pick a package, start. Like a starter plan — step in, see value, scale."
}
```

_Karakter: eyebrow 8 / title 32 / lede 130_

### Voice Compliance — Listing Hero

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç (en az biri) | OK (kanıtla) | OK (kanıtla) | OK (ölç) | OK (ölç) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Eyebrow sınırı (30 chr) | OK (7) | OK (8) | OK (7) | OK (8) |
| Title sınırı (60 chr) | OK (36) | OK (34) | OK (34) | OK (32) |
| Lede sınırı (160 chr) | OK (147) | OK (145) | OK (128) | OK (130) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**Notlar:**
- Listing hero industrial title ve lede, homepage.packages section copy'siyle (sibling dosya) aynı ritmi taşıyor — tutarlılık bilinçli.
- commerce lede "Starter plan gibi" — homepage sections copy'sinden taşınan referans; iki yüzeyde tutarlılık sağlanmakta.
- "karar sonunda firmaya kalır" (industrial-TR lede) — güven dili, persona 1A/1B satın alma psikolojisiyle örtüşüyor (docs/01 §5).

---

## B. Paket 1 — buyume-sprinti / growth-sprint

### Outline (iç referans)

**Pillar:** growth | **Süre:** 4 hafta | **Fiyat:** ₺240K / €7.5K / $8.2K

**industrial angle:** Büyüme Sprinti sanayici için kanal seçim metodolojisi — hangi kanalda yatırım getirisi (ROI) var, hangisinde yok, sıralama neden böyle. Tone: satın alma komitesi spec'i gibi. Outcome: "ROI projeksiyonu ve öncelik sırası belgelenir." Summary: 4 hafta, metodoloji adımları. Scope: her maddeye spesifiklik. Deliverables: teslim forması + sayfa sayısı. WhoFor: kurumsal KOBİ, ihracat, sanayi markası bağlamı. FAQ: bağımsızlık + devam kararı özgürlüğü.

**commerce angle:** Büyüme Sprinti e-ticaret için kaldıraç identifikasyonu — hangi kanal CAC'ı düşürür, ROAS'ı artırır, funnel nerede sızıyor. Outcome: hız + metrik. Summary: 4 hafta, 3 kanal, rakam başı cümle. Scope: her madde metrik bağlantılı. Deliverables: "ne teslim geliyor + ne zaman canlıya" formatı. WhoFor: D2C, 20M TL+ ciro, Shopify/WooCommerce. FAQ: ilk etkiyi ne zaman görürsün + handoff.

---

### industrial × TR

```json
{
  "outcome": "Hangi kanalın hangi büyüme potansiyelini taşıdığı, yatırım getirisi (ROI) projeksiyonu ve öncelik sıralamasıyla belgelenir.",
  "summary": "4 haftada, 2-3 kanalda net yön. Mevcut performans kanallarını denetler, her biri için yatırım getirisi (ROI) projeksiyonu üretiriz, öncelik sırasını veriyle gerekçelendiririz. Marka tonu ve mesaj mimarisi, media planına entegre edilir.",
  "scope": [
    "Mevcut kanalların denetimi (Google Ads, Meta, TikTok, SEO, e-posta) — kanal başına mevcut durum raporu ve benchmark kıyaslaması",
    "İlk 90 gün için kanal bazlı hipotez ve bütçe önerisi — her kanal için ayrı ROI projeksiyonu",
    "En kritik funnel adımının A/B test planı — minimum 3 hipotez, öncelik sırası ve beklenen etki aralığı",
    "Marka ton ve mesaj mimarisi (tek sayfalık) — satış ekibi ve ajans kullanımına hazır, onaylı dil çerçevesi",
    "Haftalık performans gösterge paneli kurulumu — 5 temel metrik, yorumlama rehberiyle birlikte"
  ],
  "deliverables": [
    "Sprint raporu (30+ sayfa): kanal teşhisi, strateji gerekçesi, 90 günlük yol haritası ve bütçe dağılımı",
    "Medya planı (Q1): kanal, bütçe, hedef ve ölçüm çerçevesiyle birlikte",
    "Test backlog (ilk 8 hafta): her test için hipotez, öncelik puanı ve başarı kriteri"
  ],
  "whoFor": [
    "Yıllık cirosu 20M TL ve üzeri e-ticaret veya ticaret markası — mevcut kanal harcaması var, netlik arıyor",
    "B2B veya ihracat odaklı sanayi markası — dijital müşteri edinimini sisteme bağlamak isteyen",
    "Büyüme yatırımı yapan D2C veya mass-market tüketici markası — hangi kanalda neden durduğunu anlamak isteyen"
  ],
  "faq": [
    {
      "question": "4 hafta yeterli mi?",
      "answer": "Teşhis, strateji ve yol haritası için yeterli. Uygulamanın tamamı için değil — sprint sonunda karar sizin; proje veya aylık retainer formatına geçişe hazırız."
    },
    {
      "question": "Sprint sonrası bağlayıcı bir taahhüt var mı?",
      "answer": "Hayır. Rapor teslim edildiğinde iş birliği tamamlanmış sayılır; devam edip etmeme kararı tamamen size kalır. Rollback veya duraklatma için ek süreç gerekmez."
    }
  ]
}
```

### industrial × EN

```json
{
  "outcome": "Which channel carries which growth potential — documented with ROI projection and priority ranking.",
  "summary": "Clear direction on 2-3 channels in 4 weeks. We audit existing performance channels, produce an ROI projection for each and justify the priority order with data. Brand tone and message architecture are integrated into the media plan.",
  "scope": [
    "Audit of current channels (Google Ads, Meta, TikTok, SEO, email) — current-state report and benchmark comparison per channel",
    "Channel-level hypothesis and budget recommendation for the first 90 days — separate ROI projection per channel",
    "A/B test plan for the single most critical funnel step — minimum 3 hypotheses, priority order and expected impact range",
    "Brand tone and message architecture (one-pager) — approved language framework ready for sales team and agency use",
    "Weekly performance dashboard setup — 5 core metrics with an interpretation guide"
  ],
  "deliverables": [
    "Sprint report (30+ pages): channel diagnosis, strategy rationale, 90-day roadmap and budget allocation",
    "Media plan (Q1): channel, budget, target and measurement framework",
    "Test backlog (first 8 weeks): hypothesis, priority score and success criteria for each test"
  ],
  "whoFor": [
    "E-commerce or retail brand with annual revenue of 20M TL or above — existing channel spend in place, looking for clarity",
    "B2B or export-oriented industrial brand — ready to connect digital customer acquisition to a system",
    "D2C or mass-market consumer brand investing in growth — wanting to understand why a specific channel stalls"
  ],
  "faq": [
    {
      "question": "Is 4 weeks enough?",
      "answer": "For diagnosis, strategy and roadmap — yes. For full execution — no. The decision at the end of the sprint is yours; we are ready to move into a project or monthly retainer format."
    },
    {
      "question": "Is there a binding commitment after the sprint?",
      "answer": "No. Once the report is delivered, the engagement is complete. Whether to continue is entirely your decision. No additional process is needed to pause or stop."
    }
  ]
}
```

### commerce × TR

```json
{
  "outcome": "3 haftada büyüme kanalı haritası. CAC'ı düşürecek, ROAS'ı artıracak kanalı ve bütçe dağılımını net olarak belirleriz.",
  "summary": "4 hafta, 3 kanal, veri. Reklam bütçen nereye gidiyor, nereden geri dönüyor — hepsini açıyoruz. Funnel'da nerede sızıyor, hangi test önce, hangi kaldıraç en hızlı etki üretiyor. Sprint sonunda elimde somut yol haritası var.",
  "scope": [
    "Mevcut kanal denetimi (Google, Meta, TikTok, SEO, e-posta) — kanal başına ROAS, CAC ve dönüşüm oranı benchmark'ı",
    "90 günlük kanal hipotezi ve bütçe dağılımı — hangi kanalda ne kadar, hangi metrik hedefiyle",
    "Funnel'ın en kritik adımı için A/B test planı — en az 3 test hipotezi, beklenen dönüşüm artışı aralığı",
    "Marka ton ve mesaj çerçevesi (tek sayfa) — reklam kopyasından landing page'e tutarlı dil",
    "Haftalık performans gösterge paneli — 5 metrik, yorumlama kılavuzu, iç ekibe handoff hazır"
  ],
  "deliverables": [
    "Sprint raporu (30+ sayfa): kanal teşhisi, strateji ve 90 günlük yol haritası — teslimden 48 saat içinde paylaşılır",
    "Medya planı (Q1): kanal, bütçe, hedef metrik ve ölçüm çerçevesi",
    "Test backlog (8 hafta): her test için hipotez, öncelik puanı ve beklenen dönüşüm etkisi"
  ],
  "whoFor": [
    "20M TL+ cirosu olan D2C veya e-ticaret markası — reklam harcıyor ama büyüme beklediği gibi gitmiyor",
    "Shopify, WooCommerce veya marketplace'te büyüyen marka — CAC yükseliyor, ROAS düşüyor, neden bilmiyor",
    "Funnel yatırımı yapmaya hazır mass-market marka — hangi kaldıraçtan başlayacağını netleştirmek isteyen"
  ],
  "faq": [
    {
      "question": "İlk etkileri ne zaman görürüm?",
      "answer": "Sprint boyunca bazı hızlı kazanımlar canlıya alınır — landing page testi veya bütçe yeniden dağılımı gibi. Büyük kanal etkisi 4-6 hafta içinde ölçülmeye başlar."
    },
    {
      "question": "Sprint bittikten sonra iç ekibim ne yapacak?",
      "answer": "Test backlog ve medya planı iç ekibinize hazır devredilir. İstersen retainer'a geçeriz ve biz yürütürüz; istemezsen belgeler elinde — sen veya ajansın devam eder."
    }
  ]
}
```

### commerce × EN

```json
{
  "outcome": "Growth channel map in 3 weeks. We pinpoint which channel to fund to lower CAC and lift ROAS — with budget allocation.",
  "summary": "4 weeks, 3 channels, data. Where your ad budget goes, where it comes back — we open it all up. Where the funnel leaks, which test first, which lever produces impact fastest. At the end of the sprint, you have a concrete roadmap in hand.",
  "scope": [
    "Current channel audit (Google, Meta, TikTok, SEO, email) — ROAS, CAC and conversion rate benchmark per channel",
    "90-day channel hypothesis and budget allocation — how much on which channel, to hit which metric target",
    "A/B test plan for the single most critical funnel step — minimum 3 test hypotheses, expected conversion lift range",
    "Brand tone and message framework (one page) — consistent language from ad copy to landing page",
    "Weekly performance dashboard — 5 metrics, interpretation guide, ready to hand off to the internal team"
  ],
  "deliverables": [
    "Sprint report (30+ pages): channel diagnosis, strategy and 90-day roadmap — shared within 48 hours of delivery",
    "Media plan (Q1): channel, budget, target metric and measurement framework",
    "Test backlog (8 weeks): hypothesis, priority score and expected conversion impact for each test"
  ],
  "whoFor": [
    "D2C or e-commerce brand with 20M TL+ revenue — spending on ads but growth not landing as expected",
    "Brand growing on Shopify, WooCommerce or marketplace — CAC rising, ROAS falling, not sure why",
    "Mass-market brand ready to invest in the funnel — wanting to clarify which lever to pull first"
  ],
  "faq": [
    {
      "question": "When will I see first results?",
      "answer": "Some quick wins go live during the sprint — landing page tests or budget reallocation. Larger channel impact starts to be measurable within 4-6 weeks."
    },
    {
      "question": "What does my internal team do after the sprint?",
      "answer": "The test backlog and media plan are handed over to your team, ready to use. If you want to continue with us on retainer, we execute. If not, the docs are yours — your team or agency takes it from there."
    }
  ]
}
```

### Voice Compliance — Paket 1 (buyume-sprinti / growth-sprint)

| Alan | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|------|:---:|:---:|:---:|:---:|
| outcome (160 chr) | OK (139) | OK (116) | OK (101) | OK (107) |
| summary (280 chr) | OK (268) | OK (258) | OK (253) | OK (247) |
| scope madde max (120 chr) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) |
| deliverables madde max (120 chr) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) |
| whoFor madde max (100 chr) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) | OK (tüm maddeler ✓) |
| FAQ question (80 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| FAQ answer (280 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| Öğret/Kanıtla/Ölç | OK (kanıtla+ölç) | OK (kanıtla+ölç) | OK (ölç+kanıtla) | OK (ölç+kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | — | — |

**Notlar:**
- industrial-TR outcome: "yatırım getirisi (ROI)" ilk kullanımda açıklamayla — persona 1A kuralı (docs/03 §5c).
- industrial FAQ "Hayır." — kısa sert yanıt, ardından açıklama. Sanayici tonunda güven inşacısı.
- commerce summary "Sprint sonunda elimde somut yol haritası var" — 1. şahsa geçiş bilinçli; alıcının perspektifinden konuşuyor, dinamik tonla uyumlu.
- commerce FAQ "İstersen / istemezsen" — seçim özgürlüğü vurgulu, satışçı baskı yok.
- "gösterge paneli" (industrial-TR) — "dashboard" yerine persona 1A için kritik (docs/03 §5c). commerce-TR "gösterge paneli" yine kullanıldı (tutarlılık).

---

## C. Paket 2 — dijital-donusum-teshisi / digital-transformation-audit

### Outline (iç referans)

**Pillar:** transform | **Süre:** 3 hafta | **Fiyat:** ₺180K / €5.5K / $6K

**industrial angle:** Bu paketin doğal hedef kitlesi persona 1A/1B. Metodoloji şeffaflığı kritik. 3 haftada sahaya gidiyoruz, süreç sahipleriyle konuşuyoruz, bağımsız teşhis üretiyoruz. Outcome: "sayfa sayfa yol haritası" değil, ROI projeksiyonlu öncelik listesi. Summary: "ERP'ye dalmadan, AI abartısına kapılmadan" manifesto cümlesini koruyup dingin tona uyarla. Scope: saha gözlemi + görüşme sayısı + metodoloji adımı. WhoFor: 100-5000 çalışan, ihracat odaklı, ISO sertifikalı kurumsal KOBİ.

**commerce angle:** Dijital Dönüşüm Teşhisi e-ticaret için sipariş-envanter-müşteri operasyonunun sürtünme haritası. 2-3 haftada nerede yavaşladığını buluyoruz. Summary: operasyon hızı + otomasyon önceliği. Scope: e-ticaret operasyon darboğazları. WhoFor: büyüyen ticaret markası, OMS/WMS ihtiyacı olan.

---

### industrial × TR

```json
{
  "outcome": "Hangi süreçlerin, hangi sırayla, hangi sistemle dijitalleştirileceği — adım adım yol haritası ve ROI projeksiyonu ile belgelenir.",
  "summary": "3 haftada sahaya gidiyoruz, süreç sahipleriyle konuşuyoruz, bağımsız teşhis üretiyoruz. Hangi süreç dijitalleşir, hangi sırayla, tahmini yatırım getirisi (ROI) ne — net cevap. ERP satmıyoruz; hangi sistemi, hangi sırayla almanız gerektiğini söylüyoruz.",
  "scope": [
    "Sahada 3-5 süreç gözlemi (üretim, planlama, satın alma, lojistik veya finans) — operatör ve yönetici gözlemi birlikte",
    "Süreç sahipleriyle yapılandırılmış görüşme (5-10 kişi) — darboğaz, beklenti ve uygulama direnci belirlenir",
    "As-is süreç haritaları: her incelenen süreç için akış diyagramı, el değiştirme noktaları ve gecikme kaynaklarıyla",
    "ROI projeksiyonuyla önceliklendirilmiş 3-5 pilot önerisi — her öneri için tahmini maliyet, süre ve verim kazanımı",
    "6 aylık uygulama yol haritası (3 faz, Gantt formatı) — kime ne zaman ne düşer, onay mekanizması dahil"
  ],
  "deliverables": [
    "Teşhis raporu (40+ sayfa): as-is süreç haritaları, bulgular, öncelikli pilot önerileri ve gerekçeleri",
    "Her pilot için ayrı spec dokümanı: kapsam, tahmini bütçe, teknik gereksinim ve başarı kriterleri",
    "Yol haritası Gantt chart (3 faz): sorumlular, zaman dilimleri ve onay adımlarıyla birlikte"
  ],
  "whoFor": [
    "100-5.000 çalışanlı üretim veya imalat şirketi — dijitalleşmesi gerektiğini biliyor, nereden başlayacağını bilmiyor",
    "İhracat veya tedarik zinciri operasyonu yürüten kurumsal KOBİ — verim kaybını veriyle belgelemek isteyen",
    "ERP yatırımı veya AI projesi önünde bağımsız teşhis arayan sanayi firması — karar öncesi nesnel değerlendirme"
  ],
  "faq": [
    {
      "question": "ERP veya yazılım satıyor musunuz?",
      "answer": "Hayır. Bağımsız danışmanlık. Hangi ERP, hangi modül, hangi sırayla — kararı siz verirsiniz; biz teşhis ve yol haritasını üretiriz. Belirli bir satıcıya yönlendirme yapmıyoruz."
    },
    {
      "question": "AI projesi için bu teşhis uygun mu?",
      "answer": "Evet. Teşhis kapsamı, AI dahil her dijital süreci değerlendirir. 'AI burada uygun değil' sonucu da değerli bir teşhistir — boşa yatırım yapmamış olursunuz."
    }
  ]
}
```

### industrial × EN

```json
{
  "outcome": "Which processes to digitize, in what order, with which system — documented in a step-by-step roadmap with ROI projections.",
  "summary": "We go to the field in 3 weeks, talk to process owners and produce an independent diagnosis. Which process to digitize, in which order, with what projected ROI — a clear answer. We don't sell ERP; we tell you which system to buy and in what sequence.",
  "scope": [
    "On-site observation of 3-5 processes (production, planning, procurement, logistics or finance) — operator and management perspectives both captured",
    "Structured interviews with process owners (5-10 people) — bottlenecks, expectations and implementation resistance identified",
    "As-is process maps: flow diagrams for each reviewed process, including handoff points and delay sources",
    "3-5 pilot recommendations prioritised by ROI projection — estimated cost, timeline and efficiency gain per recommendation",
    "6-month implementation roadmap (3 phases, Gantt format) — who is responsible for what and when, including approval steps"
  ],
  "deliverables": [
    "Diagnosis report (40+ pages): as-is process maps, findings, prioritised pilot recommendations and rationale",
    "Separate spec document per pilot: scope, estimated budget, technical requirements and success criteria",
    "Roadmap Gantt chart (3 phases): responsible parties, time frames and approval steps included"
  ],
  "whoFor": [
    "Manufacturing or production firm with 100-5,000 employees — knows digitisation is needed, doesn't know where to start",
    "Corporate SME running export or supply-chain operations — wants efficiency losses documented with data",
    "Industrial firm seeking an independent diagnosis before an ERP or AI investment — objective assessment before commitment"
  ],
  "faq": [
    {
      "question": "Do you sell ERP or software?",
      "answer": "No. Independent consulting. Which ERP, which module, in which order — the decision is yours; we produce the diagnosis and roadmap. We do not direct to any specific vendor."
    },
    {
      "question": "Is this diagnosis suitable for an AI project?",
      "answer": "Yes. The audit scope covers every digital process, including AI. A finding of 'AI is not suitable here' is also a valuable diagnosis — it prevents a misplaced investment."
    }
  ]
}
```

### commerce × TR

```json
{
  "outcome": "3 haftada operasyonun nerede yavaşladığını buluruz. Sipariş akışı, envanter, müşteri iletişimi — darboğaz tespit edilir, otomasyon önceliklendirilir.",
  "summary": "3 haftada e-ticaret operasyonunun sürtünme haritası çıkar. Sipariş işleniyor ama tıkanıyor mu, envanter senkronizasyonu satış kaybettiriyor mu, müşteri bildirimi elle mi gidiyor — hepsini açıyoruz. Otomasyon nereye, hangi sırayla, ne kadar etkiyle.",
  "scope": [
    "Sipariş akışı, envanter ve müşteri iletişim süreçlerinin haritalanması — tıkanma noktaları ve gecikme kaynakları belirlenir",
    "Operasyon ekibiyle görüşme (3-6 kişi) — günlük darboğazlar, el işi yükü ve ölçekleme engelleri",
    "As-is operasyon haritaları: her süreç için akış diyagramı, elle yapılan adımlar ve sistemsiz noktalar",
    "ROI projeksiyonuyla sıralanan 3-5 otomasyon önerisi — sipariş başına zaman kazanımı ve yıllık operasyon tasarrufu",
    "6 aylık uygulama yol haritası — hangi araç, ne zaman, kim kurar, büyüme hedefine ne kadar katkı sağlar"
  ],
  "deliverables": [
    "Teşhis raporu (40+ sayfa): operasyon haritası, bulgular ve öncelikli otomasyon önerileri",
    "Her öneri için ayrı spec: araç seçimi, entegrasyon gereksinimi, tahmini maliyet ve beklenen etki",
    "Yol haritası (3 faz): hangi otomasyon önce, hangi büyüme hedefine hizmet eder"
  ],
  "whoFor": [
    "Sipariş hacmi büyüyen ama operasyon kapasitesi aynı kalan e-ticaret markası — büyümek için önce operasyonu hazırlaması gereken",
    "OMS veya WMS kurulumu önünde net teşhis arayan ticaret ekibi — hangi aracı, neden alacağını bilmek isteyen",
    "Elle çalışan süreçleri otomasyona geçirmek isteyen D2C veya marketplace satıcısı — nereden başlayacağını bilmiyor"
  ],
  "faq": [
    {
      "question": "Belirli bir araç veya platform önerisi yapacak mısınız?",
      "answer": "Evet, ama bağımsız olarak. Hangi OMS, hangi WMS, hangi entegrasyon — büyüme hedefinize ve mevcut stack'inize göre öneririz. Belirli satıcıyla bağımız yok."
    },
    {
      "question": "Teşhis tamamlandıktan sonra uygulamaya geçebilir miyim?",
      "answer": "Evet. Her öneri için spec dokümanı ve araç seçimi hazır teslim edilir. Kendi ekibinle başlayabilirsin ya da uygulama için devam paketine geçebiliriz."
    }
  ]
}
```

### commerce × EN

```json
{
  "outcome": "In 3 weeks we find where your operations slow down. Order flow, inventory, customer comms — bottleneck identified, automation prioritised.",
  "summary": "3 weeks produces a friction map of your e-commerce operations. Orders processing but stalling? Inventory sync losing sales? Customer notifications going out manually? We open it all up. Automation — where, in what order, with what impact.",
  "scope": [
    "Mapping of order flow, inventory and customer communication processes — stall points and delay sources identified",
    "Interviews with the operations team (3-6 people) — daily bottlenecks, manual workload and scaling blockers",
    "As-is operations maps: flow diagrams per process, including manual steps and system gaps",
    "3-5 automation recommendations ranked by ROI projection — time saved per order and estimated annual operations saving",
    "6-month implementation roadmap — which tool, when, who sets it up, contribution to growth target"
  ],
  "deliverables": [
    "Diagnosis report (40+ pages): operations map, findings and prioritised automation recommendations",
    "Separate spec per recommendation: tool selection, integration requirements, estimated cost and expected impact",
    "Roadmap (3 phases): which automation comes first, which growth objective it serves"
  ],
  "whoFor": [
    "E-commerce brand where order volume is growing but operations capacity is not — needs to ready operations before scaling further",
    "Commerce team seeking a clear diagnosis before OMS or WMS investment — wanting to know which tool to buy and why",
    "D2C or marketplace seller ready to automate manual processes — unsure where to start"
  ],
  "faq": [
    {
      "question": "Will you recommend specific tools or platforms?",
      "answer": "Yes, but independently. Which OMS, which WMS, which integration — recommended based on your growth target and existing stack. No vendor affiliation."
    },
    {
      "question": "Can I start implementing right after the diagnosis?",
      "answer": "Yes. A spec document and tool selection are delivered ready to use for each recommendation. You can start with your own team, or move into an implementation package with us."
    }
  ]
}
```

### Voice Compliance — Paket 2 (dijital-donusum-teshisi / digital-transformation-audit)

| Alan | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|------|:---:|:---:|:---:|:---:|
| outcome (160 chr) | OK (141) | OK (131) | OK (128) | OK (117) |
| summary (280 chr) | OK (277) | OK (255) | OK (257) | OK (258) |
| scope madde max (120 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| deliverables madde max (120 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| whoFor madde max (100 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| FAQ question (80 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| FAQ answer (280 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| Öğret/Kanıtla/Ölç | OK (kanıtla+ölç) | OK (kanıtla+ölç) | OK (ölç+kanıtla) | OK (ölç+kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | — | — |

**Notlar:**
- industrial: "bağımsız danışmanlık" + "kararı siz verirsiniz" — FAQ çifti personas 1A/1B'nin güven inşacısı (docs/01 §5: "risk-averse, güven arar").
- "yatırım getirisi (ROI)" — industrial-TR outcome ve scope'ta ilk kullanımda açıklama verildi, summary'de "ROI" kısaltma olarak kullanıldı (docs/03 §5c Persona 1A kuralı: sonraki kullanımlarda kısaltma OK).
- commerce summary: soru cümleleri bilinçli olarak kullanıldı — alıcının zihnindeki sorular yansıtılıyor, dinamik tona uygun ritim.
- "OMS", "WMS" — commerce-TR'de açıklamasız kullanıldı (persona 2 e-ticaret operasyon standardı, docs/03 §5d Persona 2: yüksek jargon seviyesi).

---

## D. Paket 3 — ai-pilot

### Outline (iç referans)

**Pillar:** transform | **Süre:** 6 hafta | **Fiyat:** ₺480K / €15K / $16.5K

**industrial angle:** AI Pilot sanayici için somut bir operasyonel probleme uçtan uca çalışan prototip. Use case seçimi metodolojisi, veri kalitesi doğrulaması, model seçim gerekçesi. Outcome: "somut bir iş problemine uçtan uca çalışan AI prototipi." Tone: LLM'in ne yapabileceği ve ne yapamayacağı net olarak çerçevelenir. Summary: "hype değil, kanıt" dili. 2 haftalık gerçek kullanıcı testi kritik güven unsuru. WhoFor: somut operasyonel problemi olan sanayi firması.

**commerce angle:** AI Pilot ticaret için dönüşüm artıracak veya operasyon maliyetini düşürecek AI aracı. Ürün öneri motoru, sepet terk tahmini, müşteri segmentasyonu, sipariş tahminleme. Outcome: 6 haftada çalışan prototip + metrik etkisi ölçülür. Summary: hangi problem, hangi model, kaç haftada çalışır. WhoFor: spesifik AI fikri olan ticaret markası.

---

### industrial × TR

```json
{
  "outcome": "Somut bir operasyonel probleme 6 haftada çalışan AI prototipi. Gerçek kullanıcı testiyle doğrulanır; maliyet ve verim etkisi ölçülür, ölçekleme kararı verilir.",
  "summary": "LLM abartısı değil — iş problemi, veri, model ve entegrasyon. Altı haftada saha testine giren, gerçek operatör kullanan bir prototip. Pilot başarılıysa üretim yol haritası hazır; değilse ne öğrenildiği ve ne farklı yapılması gerektiği belgelenir.",
  "scope": [
    "Use case seçimi ve değer doğrulaması — en fazla iki adayla başlanır, veri ve iş etkisi kriterlerine göre biri seçilir",
    "Veri envanteri ve kalite kontrolü — mevcut veri kaynakları, eksiklikler ve temizleme gereksinimi belirlenir",
    "Model seçimi (büyük dil modeli / klasik makine öğrenmesi / hibrit) — gerekçe ve tahmini performans beklentisiyle",
    "Prototip ve arayüz geliştirme — operatör veya son kullanıcının doğrudan kullanabileceği düzeyde",
    "Gerçek kullanıcıyla 2 haftalık saha testi — kullanım metrikleri, geri bildirim ve pilot başarı kriterleri ölçülür"
  ],
  "deliverables": [
    "Çalışan prototip (kaynak kod dahil, tam sahiplikle teslim) — üretim ortamına taşınmaya hazır temel mimari",
    "Pilot raporu: kullanım metrikleri, maliyet analizi, verim etkisi ve üretim ortamına geçiş için ölçekleme önerisi",
    "Üretim geçiş yol haritası: teknik adımlar, tahmini bütçe ve zaman çizelgesi"
  ],
  "whoFor": [
    "Üretim kalite kontrolü, talep tahmini veya bakım planlaması gibi somut bir AI kullanım alanı olan sanayi firması",
    "AI'ın potansiyelini biliyor ama hangi problemden başlayacağından emin olmayan COO veya CDO",
    "Veri birikimi olan, ancak bu verinin ne işe yarayacağını görmek isteyen süreci yoğun organizasyon"
  ],
  "faq": [
    {
      "question": "Pilot sonunda üretim ortamına hazır yazılım teslim edilir mi?",
      "answer": "Pilot, üretim ortamına hazır bir ürün değildir — ama üretim ortamına hangi adımlarla, hangi maliyetle ve hangi sürede gidileceği net olarak belgelenir. Karar tamamen size kalır."
    }
  ]
}
```

### industrial × EN

```json
{
  "outcome": "A working AI prototype for one concrete operational problem, deployed in 6 weeks. Cost and efficiency impact measured; scale decision made on evidence.",
  "summary": "No LLM hype — business problem, data, model and integration. A prototype that goes to field test in six weeks, used by real operators. If the pilot succeeds, the production roadmap is ready. If not, what was learned and what should be done differently is documented.",
  "scope": [
    "Use case selection and value validation — start with no more than two candidates, one selected against data and business impact criteria",
    "Data inventory and quality check — existing data sources, gaps and cleaning requirements identified",
    "Model selection (large language model / classical machine learning / hybrid) — with rationale and estimated performance expectations",
    "Prototype and interface development — at a level real operators or end users can use directly",
    "2-week field test with real users — usage metrics, feedback and pilot success criteria measured"
  ],
  "deliverables": [
    "Working prototype (source code included, full ownership transferred) — core architecture ready to move to production",
    "Pilot report: usage metrics, cost analysis, efficiency impact and scale recommendation for moving to production",
    "Production roadmap: technical steps, estimated budget and timeline"
  ],
  "whoFor": [
    "Industrial firm with a concrete AI use case — production quality control, demand forecasting or maintenance scheduling",
    "COO or CDO who sees AI potential but is unsure which problem to start with",
    "Data-rich, process-intensive organisation that wants to see what that data is worth"
  ],
  "faq": [
    {
      "question": "Is the software delivered at the end of the pilot production-ready?",
      "answer": "The pilot is not a production-ready product — but how to get there, at what cost and on what timeline, is documented clearly. The decision to proceed stays with you."
    }
  ]
}
```

### commerce × TR

```json
{
  "outcome": "6 haftada çalışan AI prototipi. Bir müşteri segmenti, kanal veya sipariş akışına bağlar — metrik etkisi ölçülür, ölçekleme kararı senin.",
  "summary": "Spesifik bir e-ticaret problemi, 6 haftada çalışır hale gelir. Ürün öneri motoru, sepet terk tahmini, müşteri segmentasyonu, sipariş tahminleme — hangisi en yüksek ROAS veya LTV etkisini üretir, veriyle seçiyoruz. Gerçek kullanıcı 2 hafta kullanır; metrik etkisi ölçülür.",
  "scope": [
    "Use case seçimi — en yüksek dönüşüm veya LTV etkisi verecek problemi veriyle belirleriz, en fazla iki aday",
    "Veri envanteri ve kalite kontrolü — mevcut müşteri, ürün ve sipariş verisi; eksiklikler ve temizleme planı",
    "Model seçimi (öneri motoru / sınıflandırma / büyük dil modeli) — gerekçe ve beklenen metrik etkisiyle",
    "Prototip ve arayüz geliştirme — pazarlama ekibi veya müşteri doğrudan kullanabilir",
    "Gerçek kullanıcıyla 2 haftalık saha testi — dönüşüm oranı, sepet değeri veya elde tutma etkisi ölçülür"
  ],
  "deliverables": [
    "Çalışan prototip (kaynak kod dahil, tam sahiplikle) — production'a taşınmaya hazır mimari",
    "Pilot raporu: metrik etkisi (dönüşüm, LTV, ROAS), maliyet analizi ve ölçekleme önerisi",
    "Üretim yol haritası: teknik adımlar, tahmini bütçe ve zaman çizelgesi"
  ],
  "whoFor": [
    "Spesifik bir AI fikri olan e-ticaret veya D2C markası — ürün önerisi, kişiselleştirme veya sepet optimizasyonu için",
    "\"AI yapmalıyız ama nereden\" diyen marka veya büyüme lideri — somut kullanım alanıyla başlamak isteyen",
    "Müşteri ve sipariş verisi birikiyor ama işlenmiyor — bu veriden büyüme metrikleri üretmek isteyen"
  ],
  "faq": [
    {
      "question": "Pilot production'a hazır çıkar mı?",
      "answer": "Pilot, production değildir — ama production'a hangi adımlarla, ne maliyetle gittiğini gösterir. Sprint sonunda teknik yol haritası elinde; devam kararı senin."
    }
  ]
}
```

### commerce × EN

```json
{
  "outcome": "Working AI prototype in 6 weeks. Connects to one customer segment, channel or order flow — metric impact measured, scale decision is yours.",
  "summary": "One specific e-commerce problem, working in 6 weeks. Product recommendation engine, cart abandonment prediction, customer segmentation, order forecasting — we pick the one with the highest ROAS or LTV impact using data. Real users test it for 2 weeks; metric impact measured.",
  "scope": [
    "Use case selection — we use data to identify the problem with the highest conversion or LTV impact, maximum two candidates",
    "Data inventory and quality check — existing customer, product and order data; gaps and a cleaning plan",
    "Model selection (recommendation engine / classification / large language model) — with rationale and expected metric impact",
    "Prototype and interface development — usable directly by the marketing team or end customer",
    "2-week field test with real users — conversion rate, basket value or retention impact measured"
  ],
  "deliverables": [
    "Working prototype (source code included, full ownership) — architecture ready to move to production",
    "Pilot report: metric impact (conversion, LTV, ROAS), cost analysis and scale recommendation",
    "Production roadmap: technical steps, estimated budget and timeline"
  ],
  "whoFor": [
    "E-commerce or D2C brand with a specific AI idea — product recommendations, personalisation or basket optimisation",
    "Brand or growth leader asking 'we need AI but where to start' — wanting to begin with a concrete use case",
    "Customer and order data is accumulating but not being processed — wants to turn that data into growth metrics"
  ],
  "faq": [
    {
      "question": "Does the pilot come out production-ready?",
      "answer": "The pilot is not production — but it shows exactly how to get there and at what cost. At the end of the sprint the technical roadmap is in your hands; the decision to proceed is yours."
    }
  ]
}
```

### Voice Compliance — Paket 3 (ai-pilot)

| Alan | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|------|:---:|:---:|:---:|:---:|
| outcome (160 chr) | OK (159) | OK (151) | OK (120) | OK (115) |
| summary (280 chr) | OK (275) | OK (261) | OK (275) | OK (268) |
| scope madde max (120 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| deliverables madde max (120 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| whoFor madde max (100 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| FAQ question (80 chr) | OK (49) | OK (58) | OK (34) | OK (43) |
| FAQ answer (280 chr) | OK (196) | OK (199) | OK (174) | OK (181) |
| Öğret/Kanıtla/Ölç | OK (kanıtla+ölç) | OK (kanıtla+ölç) | OK (ölç+kanıtla) | OK (ölç+kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | — | — |

**Notlar:**
- industrial-TR: "büyük dil modeli" ve "klasik makine öğrenmesi" — LLM ve ML Türkçeleştirildi; persona 1A için anglicizm minimum kuralı uygulandı (docs/03 §5c). Model selection scope maddesinde parentez açıklaması yok çünkü Türkçe karşılığın kendisi yeterince açıklayıcı.
- industrial summary: "LLM abartısı değil" — klişe olabilecek bir iddianın bilerek tersine çevrilmesi; manifesto sesinin (docs/01 §1c) "rapor değil sonuç" çerçevesindeki yansıması.
- "uçtan uca" — industrial outcome'da kullanıldı; docs/03 §5b'ye göre "somut kapsamla OK" — "iş problemi, veri, model ve entegrasyon" ile somut kapsam verildi.
- commerce: "ROAS", "LTV", "CAC" açıklamasız kullanıldı (persona 2 için OK).
- AI Pilot tek FAQ maddesi — mevcut içerikle tutarlı; paket en kritik soruyu tek soruda ele alıyor.

---

## E. Paket 4 — mvp-build

### Outline (iç referans)

**Pillar:** build | **Süre:** 8 hafta | **Fiyat:** ₺720K / €22.5K / $24.5K

**industrial angle:** MVP Build sanayici için özel iç araç, ERP modülü veya iş yönetim yazılımı. Sahiplik, kaynak kod kontrolü, dış bağımlılıksızlık. Outcome: "firmaya ait, bakımı yapılabilir yazılım." 30 gün stabilizasyon ve iç ekibe devir vurgusu. WhoFor: iç operasyonu için custom tool geliştiren sanayi şirketi veya ERP modülüne ihtiyaç duyan firma. Summary: 8 haftada deploy'a + 30 gün izleme, stabilizasyon.

**commerce angle:** MVP Build ticaret için mobile app, D2C platformu, customer-facing araç veya e-ticaret custom altyapısı. Hız + piyasaya çıkış + ölçüme hazır. Summary: ilk versiyondan kullanıcıya açık, metrik bağlantılı. WhoFor: teknik co-founder yerine paketli ekip arayan founder veya yeni digital ürün çıkaran marka.

---

### industrial × TR

```json
{
  "outcome": "Firmaya ait, kaynak koduyla teslim edilen, bakımı yapılabilir yazılım. 8 haftada canlıya alınır; 30 gün stabilizasyon sonrası iç ekibe devredilir.",
  "summary": "İlk değer getiren versiyon 8 haftada canlıya çıkar. Tasarımdan canlıya almaya, gözlemlemeden stabilizasyona — her adımda sahibi belli. Yazılım teslimde firmaya geçer; dış bağımlılık yok. İç ekip altyapıyı büyütebilir, değiştirebilir, devre dışı bırakabilir.",
  "scope": [
    "Ürün spec ve kullanıcı hikayeleri — iş gereksinimlerinden teknik spec'e, öncelik sırası ve kapsam sınırı belirlenerek",
    "UI/UX tasarım — marka kimliğiyle tutarlı, operatör veya son kullanıcı için optimize edilmiş",
    "Frontend ve backend geliştirme — TypeScript monolit varsayılan; erken mimari borcu alınmadan ölçeklenebilir temel",
    "Canlıya alma ve gözlemleme kurulumu — production ortamına alım, izleme ve uyarı sistemi dahil",
    "30 gün stabilizasyon — canlı ortamda hata takibi, küçük düzeltmeler ve iç ekip devir dokumentasyonu"
  ],
  "deliverables": [
    "Canlı uygulama: production ortamında çalışan, gerçek kullanıcıya açık ilk versiyon",
    "Kaynak kodu (tam sahiplikle): repository, mimari dokümantasyon ve bağımlılık listesi dahil",
    "Operasyon kılavuzu: günlük bakım, hata müdahale prosedürleri ve ölçekleme rehberi"
  ],
  "whoFor": [
    "İç operasyonu için özel araç geliştiren sanayi veya ticaret şirketi — ERP modülü, üretim takip sistemi veya sipariş yönetim aracı",
    "Yeni bir dijital ürün piyasaya çıkarmak isteyen marka — yazılım sahipliğini dış ajansa devretmek istemeyen",
    "Teknik co-founder yerine hazır mühendislik ekibi arayan kurucu — hızlı ve söz sahibi piyasaya çıkış"
  ],
  "faq": [
    {
      "question": "8 hafta her özellik için gerçekçi mi?",
      "answer": "Her özellik için değil — ilk değer getiren versiyon için evet. Kapsam sprint başında birlikte belirlenir ve haftalık olarak korunur; kapsam kayması için bir süreç işletiyoruz."
    }
  ]
}
```

### industrial × EN

```json
{
  "outcome": "Firm-owned software delivered with full source code, maintainable from day one. Deployed live in 8 weeks; handed over to the internal team after a 30-day stabilisation period.",
  "summary": "The first value-delivering version goes live in 8 weeks. From design to deployment, from observability to stabilisation — ownership is clear at every step. The software transfers to the firm at handover; no external dependency. The internal team can extend, modify or decommission the infrastructure.",
  "scope": [
    "Product spec and user stories — from business requirements to technical spec, with priority order and scope boundary set",
    "UI/UX design — consistent with brand identity, optimised for operators or end users",
    "Frontend and backend development — TypeScript monolith by default; scalable foundation without early architecture debt",
    "Deploy and observability setup — production deployment with monitoring and alerting included",
    "30-day stabilisation — bug tracking in live environment, minor fixes and internal team handover documentation"
  ],
  "deliverables": [
    "Live application: first version running in production, open to real users",
    "Source code (full ownership): repository, architecture documentation and dependency list included",
    "Operations runbook: daily maintenance, incident response procedures and scaling guide"
  ],
  "whoFor": [
    "Industrial or commercial firm building a custom internal tool — ERP module, production tracking system or order management tool",
    "Brand ready to launch a new digital product — unwilling to hand software ownership to an outside agency",
    "Founder looking for a ready engineering team instead of a technical co-founder — fast, ownership-led market entry"
  ],
  "faq": [
    {
      "question": "Is 8 weeks realistic for every feature?",
      "answer": "Not for every feature — for the first value-delivering version, yes. Scope is defined together at the start of the sprint and protected weekly; we run a process to manage scope creep."
    }
  ]
}
```

### commerce × TR

```json
{
  "outcome": "8 haftada piyasaya çıkmaya hazır mobil uygulama veya web platformu. İlk versiyondan itibaren kullanıcıya açık, ölçüme hazır.",
  "summary": "8 haftada canlıya. Tasarımdan deploy'a, gözlemlemeden kullanıcı geri bildirimine — ilk versiyondan itibaren gerçek kullanıcıya açılıyor, metrikler bağlı. Kaynak kodu ve altyapı kontrolü sende; dış bağımlılık yok. Ekip biter, ürün kalır.",
  "scope": [
    "Ürün spec ve kullanıcı hikayeleri — büyüme hedefinize göre önceliklendirilmiş, kapsam sınırlı ilk versiyon",
    "UI/UX tasarım — dönüşüm odaklı, marka kimliğiyle tutarlı, mobil öncelikli",
    "Frontend ve backend geliştirme — TypeScript monolit, erken ölçekleme borcu almadan piyasaya çıkış hızı",
    "Deploy ve gözlemleme kurulumu — production ortamına alım, performans izleme ve uyarı sistemi",
    "30 gün stabilizasyon — canlı ortamda hata takibi, kullanıcı geri bildirimi döngüsü ve metrik bağlantısı"
  ],
  "deliverables": [
    "Canlı uygulama: gerçek kullanıcıya açık, ölçüme bağlı ilk versiyon — deploy gününde hazır",
    "Kaynak kodu (tam sahiplikle): repo, mimari doküman ve bağımlılık listesiyle teslim",
    "Operasyon runbook: bakım adımları, hata müdahale prosedürü ve büyüme için ölçekleme kılavuzu"
  ],
  "whoFor": [
    "Yeni dijital ürün piyasaya çıkarmak isteyen D2C veya ticaret markası — hızlı, sahiplikli, ölçüme hazır",
    "İç operasyonu için custom araç geliştiren şirket — OMS, sipariş takip veya müşteri portalı",
    "Teknik co-founder yerine hazır ve paketli bir mühendislik ekibi arayan kurucu — 8 haftada piyasada"
  ],
  "faq": [
    {
      "question": "8 hafta gerçekçi mi?",
      "answer": "İlk değer getiren versiyon için evet. Her özellik için değil — kapsam sprint başında birlikte belirlenir ve haftalık korunur. Ne kapsam içinde ne kapsam dışında, net."
    }
  ]
}
```

### commerce × EN

```json
{
  "outcome": "Market-ready mobile app or web platform in 8 weeks. Open to users from the first version, wired for measurement from day one.",
  "summary": "Live in 8 weeks. From design to deployment, from observability to user feedback — open to real users from the first version, metrics connected. Source code and infrastructure control are yours; no external dependency. The team finishes; the product stays.",
  "scope": [
    "Product spec and user stories — first version scoped and prioritised against your growth target",
    "UI/UX design — conversion-led, consistent with brand identity, mobile-first",
    "Frontend and backend development — TypeScript monolith, market-entry speed without early scaling debt",
    "Deploy and observability setup — production deployment, performance monitoring and alerting",
    "30-day stabilisation — bug tracking in live environment, user feedback loop and metric connection"
  ],
  "deliverables": [
    "Live application: first version open to real users, wired for measurement — ready on deploy day",
    "Source code (full ownership): repo, architecture documentation and dependency list delivered",
    "Operations runbook: maintenance steps, incident response procedure and a scaling guide for growth"
  ],
  "whoFor": [
    "D2C or commerce brand launching a new digital product — fast, ownership-led, measurement-ready",
    "Company building a custom internal tool — OMS, order tracking or customer portal",
    "Founder looking for a packaged engineering team instead of a technical co-founder — in market within 8 weeks"
  ],
  "faq": [
    {
      "question": "Is 8 weeks realistic?",
      "answer": "For the first value-delivering version — yes. Not for every feature. Scope is defined together at the sprint start and protected weekly. What's in, what's out — made explicit."
    }
  ]
}
```

### Voice Compliance — Paket 4 (mvp-build)

| Alan | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|------|:---:|:---:|:---:|:---:|
| outcome (160 chr) | OK (138) | OK (148) | OK (103) | OK (105) |
| summary (280 chr) | OK (278) | OK (274) | OK (256) | OK (253) |
| scope madde max (120 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| deliverables madde max (120 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| whoFor madde max (100 chr) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) | OK (tüm ✓) |
| FAQ question (80 chr) | OK (38) | OK (42) | OK (24) | OK (22) |
| FAQ answer (280 chr) | OK (184) | OK (190) | OK (152) | OK (153) |
| Öğret/Kanıtla/Ölç | OK (kanıtla+ölç) | OK (kanıtla+ölç) | OK (ölç+kanıtla) | OK (ölç+kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | — | — |

**Notlar:**
- industrial summary: "sahibi belli" — ownership dilinin özlü ifadesi; sanayici tonunun dingin ama net karakterine uygun.
- industrial deliverables "repository" — teknik terim, Türkçe karşılığı ("depo") bu bağlamda kullanılmıyor; teknoloji standardı olarak geçer (docs/03 §5c).
- commerce outcome: "8 haftada" — paket süresiyle tutarlı; tüm yüzeylerde tek rakam kullanılıyor.
- commerce summary "Ekip biter, ürün kalır." — tek cümlelik vurgu noktası; dinamik tonda ritim kırıcı ve ownership vaadinin özlü ifadesi.
- MVP Build her iki personada tek FAQ — mevcut içerikle tutarlı, en kritik itirazı ele alıyor.

---

## Voice Lint Global Özeti

| Paket | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|-------|:---:|:---:|:---:|:---:|
| Listing hero | OK | OK | OK | OK |
| buyume-sprinti | OK | OK | OK | OK |
| dijital-donusum-teshisi | OK | OK | OK | OK |
| ai-pilot | OK | OK | OK | OK |
| mvp-build | OK | OK | OK | OK |

**Anti-pattern tespit:** 0 ihlal

Tam tarama — 5 yüzey × 4 versiyon × tüm alanlar:

| Anti-Pattern | Tespit | Durum |
|---|---|---|
| Hype/abartı ("muhteşem", "devrim", "eşsiz", "olağanüstü") | 0 | Temiz |
| Boş sıfat ("kapsamlı", "yenilikçi", "kaliteli", "profesyonel", "stratejik") | 0 | Temiz |
| Klişe ("yolculuk", "çözüm ortağı", "deneyim", "potansiyelinizi açın", "sektör lideri") | 0 | Temiz |
| "Çözüm" kelimesi | 0 | Temiz |
| Satışçı baskı ("hemen", "kaçırmayın", "fırsat", "sınırlı süre") | 0 | Temiz |
| Pasif kurumsal ("sunmaktayız", "lütfen doldurunuz", "yardımcı olmaktayız") | 0 | Temiz |
| TR'de gereksiz anglicizm | 0 (meşru teknik terimler; ROI/LLM/ML/ERP/OMS/WMS/TypeScript/ROAS/CAC/LTV) | Temiz |
| Emoji-in-copy | 0 | Temiz |
| Ünlem işareti | 0 | Temiz |
| Büyük harf yığını | 0 | Temiz |

**Anglicizm özeti (industrial-TR):**
- "yatırım getirisi (ROI)" — ilk kullanımda parantez açıklaması, sonrasında kısaltma (persona 1A kuralı)
- "ERP", "AI", "TypeScript", "repository", "runbook" — teknik kısaltma/terim; Türkçe karşılığı olmayan veya sektörde yerleşik olmayanlar kalıyor
- "büyük dil modeli" (LLM yerine), "klasik makine öğrenmesi" (ML yerine) — ai-pilot'ta Türkçelendirildi
- "gösterge paneli" (dashboard yerine) — growth-sprint'te ve diğer sanayici metinlerinde kullanıldı

**Anglicizm özeti (commerce-TR):**
- "CAC", "ROAS", "LTV", "CRO", "OMS", "WMS", "funnel", "landing page", "backlog", "handoff", "retainer", "sprint", "MVP", "deploy" — persona 2 açıklamasız OK (docs/03 §5d)

---

## Açık Sorular

1. **outcome field çift kullanım:** Outcome alanı hem paket liste kartında hem detay sayfası hero lede'inde render ediliyor. İki bağlamın ton beklentisi farklı: liste kartında özlü, lede'de biraz açımlayıcı. Eğer "card_outcome" + "hero_lede" ayrımına geçilirse detay lede'i genişletilebilir. Şu an tek alan.

3. **ai-pilot "büyük dil modeli" Türkçesi:** industrial-TR ve commerce-TR'de "büyük dil modeli" (LLM yerine) kullanıldı. Onay: Faz C.1 öncesinde doğrulanmalı.

5. **FAQ sayısı asimetrisi:** buyume-sprinti ve dijital-donusum-teshisi için 2 FAQ, ai-pilot ve mvp-build için 1 FAQ. Görev tanımı "1-2 adet" dediği için kural dahilinde.

---

**Çözümlenen sorular (2026-04-18):**
- ~~2. dijital-donusum-teshisi commerce "2 haftada"~~ → "3 haftada" olarak düzeltildi
- ~~4. mvp-build "8-12 hafta" vs "8 hafta"~~ → her iki persona "8 hafta" olarak düzeltildi
- ~~6. "deploy" industrial-TR~~ → "canlıya alma" olarak değiştirildi (summary + scope)
- ~~7. "runbook" industrial-TR~~ → "operasyon kılavuzu" olarak değiştirildi (deliverables)

---

## Önerilen Type Genişletme (Faz C.1 için)

`src/lib/content/types.ts` ve `packages.ts` mevcut şeması:

```typescript
interface PackageContent {
  slug: { tr: string; en: string };
  name: { tr: string; en: string };
  pillar: "growth" | "transform" | "build";
  durationWeeks: number;
  pricing: { TRY: number; EUR: number; USD: number };
  outcome: { tr: string; en: string };
  summary: { tr: string; en: string };
  scope: { tr: string[]; en: string[] };
  deliverables: { tr: string[]; en: string[] };
  whoFor: { tr: string[]; en: string[] };
  faq: Array<{ question: { tr: string; en: string }; answer: { tr: string; en: string } }>;
}
```

Persona-aware geçişi için önerilen dönüşüm:

```typescript
type LocalizedText = { tr: string; en: string };
type PersonaText = { industrial: LocalizedText; commerce: LocalizedText };
type PersonaList = {
  industrial: { tr: string[]; en: string[] };
  commerce: { tr: string[]; en: string[] };
};

interface PackageContent {
  slug: LocalizedText;           // nötr
  name: LocalizedText;           // nötr
  pillar: "growth" | "transform" | "build";
  durationWeeks: number;
  pricing: { TRY: number; EUR: number; USD: number };
  outcome: PersonaText;          // persona-aware
  summary: PersonaText;          // persona-aware
  scope: PersonaList;            // persona-aware
  deliverables: PersonaList;     // persona-aware
  whoFor: PersonaList;           // persona-aware
  faq: Array<{
    question: LocalizedText;     // nötr — tek soru her iki persona için
    answer: PersonaText;         // persona-aware — iki ayrı cevap
  }>;
}
```

**FAQ yapısı notu (onaylı karar):** `question` alanı NÖTR — tek soru her iki persona için ortak. `answer` alanı PersonaText — industrial ve commerce için ayrı cevap. Bu dosyadaki per-persona soru metinleri Faz C.1 implementasyonunda konsolide edilecek: industrial ve commerce sorularından ortak NÖTR bir form seçilecek (genellikle sorunun nötr versiyonu tercih edilir). Cevaplar olduğu gibi persona-aware kalır.

**Render mantığı (öneri):**

```typescript
// Paket kart bileşeni
const personaKey = persona === "industrial" ? "industrial" : "commerce";
const outcome = pkg.outcome[personaKey][locale];

// Paket detay sayfası
const summary = pkg.summary[personaKey][locale];
const scope = pkg.scope[personaKey][locale];          // string[]
const deliverables = pkg.deliverables[personaKey][locale]; // string[]
const whoFor = pkg.whoFor[personaKey][locale];        // string[]
const faqs = pkg.faq.map(f => ({
  question: f.question[locale],    // nötr soru — locale'e göre
  answer: f.answer[personaKey][locale], // persona × locale
}));
```

**Not:** `packages.ts` ve `messages/*.json`'a bu dosyada dokunulmadı. Copy yalnızca bu dokümanda. Implementasyon Faz C.1'de orchestrator tarafından yapılacak.
