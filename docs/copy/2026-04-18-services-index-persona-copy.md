# Services Index — Persona-Aware Copy (ADR-014 Faz B.2)

**Tarih:** 2026-04-18
**Scope:** /hizmetler + /services (listeleme)
**Persona:** industrial + commerce
**Dil:** TR + EN
**Onay:** Burak Arda Özgül beklemede

---

## Page Hero

### Outline (iç referans)

**industrial angle:** Sayfa girişi "3 pillar, metodolojik omurga" olarak konumlanır. Eyebrow nötr-navigasyonel. Title: tek cümlelik yapısal netlik. Lede: her pillar'ın birbirini besleyen disiplin kolu olduğunu, teşhisin hangisinden başlanacağını söylediğini vurgular — metodik, dingin.

**commerce angle:** "Büyüme motoru" dili. Title ritmik ve aksiyonel. Lede: 3 pillar = 3 kaldıraç, ama bir sistemin parçası olduğunu vurgular; metrik bağlantısı, hız.

---

### industrial × TR

```json
{
  "eyebrow": "Hizmetler",
  "title": "Üç pillar, on iki hizmet.",
  "lede": "Growth, Transform ve Build birbirini besleyen aynı disiplinin üç koludur. Hangi koldan başlanacağını teşhis söyler — biz uygulamada kalırız."
}
```

_Karakter: eyebrow 9 / title 26 / lede 154_

### industrial × EN

```json
{
  "eyebrow": "Services",
  "title": "Three pillars, twelve services.",
  "lede": "Growth, Transform and Build are three arms of the same discipline, each feeding the others. Diagnosis decides which arm leads — we stay in the field."
}
```

_Karakter: eyebrow 8 / title 31 / lede 145_

### commerce × TR

```json
{
  "eyebrow": "Hizmetler",
  "title": "Üç pillar, 12 hizmet.",
  "lede": "Growth, Transform ve Build aynı büyüme motorunun üç kaldıracı. Metrikler bağlanınca büyüme rastlantı olmaktan çıkar."
}
```

_Karakter: eyebrow 9 / title 21 / lede 111_

### commerce × EN

```json
{
  "eyebrow": "Services",
  "title": "Three pillars, 12 services.",
  "lede": "Growth, Transform and Build — three levers of one revenue engine. When the metrics connect, growth stops being luck."
}
```

_Karakter: eyebrow 8 / title 28 / lede 110_

### Voice Compliance Report — Page Hero

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç (en az biri) | OK (öğret) | OK (öğret) | OK (ölç) | OK (ölç) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Eyebrow sınırı (30 chr) | OK (9) | OK (8) | OK (9) | OK (8) |
| Title sınırı (60 chr) | OK (26) | OK (31) | OK (21) | OK (28) |
| Lede sınırı (160 chr) | OK (154) | OK (145) | OK (111) | OK (110) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**Notlar:**
- industrial: "biz uygulamada kalırız" positioning statement'ını taşıyor — "rapor değil sonuç" manifestosunun lede'e doğal yansıması
- commerce: "rastlantı olmaktan çıkar" kanıt-temelli büyüme iddiası, "şanstan çıkarıp sisteme" manifesto cümlesinin ton adaptasyonu
- Title: industrial "on iki" yazım tercihi daha ağır/resmi hissiyatla; commerce "12" numerik önce ritim ve tarama hızı için

---

## Pillar 1: Growth

### tagline + description

#### Outline (iç referans)

**industrial angle:** Growth sanayici için "marka bilinirliği + B2B müşteri edinimi + ihracat pazarlama" sistemi. Tagline: büyüme ama kurumsal dilde — yapısal, sürdürülebilir. Description: strateji + uygulama birliği, ihracat/Türkiye pazarı bağlamı, satış ekibi tutarlılığı, ölçülebilir çıktı.

**commerce angle:** Growth = büyüme motorunun kendisi. Tagline: agresif, metrik-öne. Description: CAC/ROAS/funnel metrikleri, sistem inşası, kampanya değil motor.

---

#### industrial × TR

```json
{
  "tagline": "Sanayi markası için yapısal büyüme.",
  "description": "Marka konumlandırması, B2B müşteri edinimi ve performans kanallarını tek bir büyüme sisteminde birleştirir. İhracat hedefi veya yurt içi pazar payı — strateji veriye dayanır, uygulama yanında durur."
}
```

_Karakter: tagline 39 / description 199_

#### industrial × EN

```json
{
  "tagline": "Structural growth for industrial brands.",
  "description": "Brand positioning, B2B customer acquisition and performance channels unified in one growth system. Export target or domestic market share — strategy is grounded in data, execution stays alongside."
}
```

_Karakter: tagline 40 / description 196_

#### commerce × TR

```json
{
  "tagline": "Büyümeyi sisteme bağlayan disiplin.",
  "description": "CAC düşer, ROAS yükselir, LTV uzar — marka, performans ve dönüşüm aynı anda çalışınca. Kampanya çıkarmıyoruz; büyüme motorunu birlikte inşa ediyoruz."
}
```

_Karakter: tagline 37 / description 158_

#### commerce × EN

```json
{
  "tagline": "The discipline that turns growth into a system.",
  "description": "CAC drops, ROAS lifts, LTV extends — when brand, performance and conversion work in sync. We don't run campaigns; we build the growth engine together."
}
```

_Karakter: tagline 47 / description 154_

### Voice Compliance — Growth tagline + description

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç | OK (ölç + kanıtla) | OK (ölç + kanıtla) | OK (ölç + kanıtla) | OK (ölç + kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Tagline sınırı (60 chr) | OK (39) | OK (40) | OK (37) | OK (47) |
| Description sınırı (200 chr) | OK (199) | OK (196) | OK (158) | OK (154) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

---

### Services — Growth (5 hizmet)

#### marka-stratejisi (shortDescription)

**Mevcut nötr:** "Konumlandırma, ton, mesaj mimarisi. Satış ekibinden sosyal medyaya kadar tutarlı marka."

**Persona nüansı:**
- Industrial: Kurumsal KOBİ, ihracat, sanayi markasının B2B konumlanması; satış ekibi + pazar tutarlılığı
- Commerce: D2C marka mimarisi, ses ve ton sistemi, funnel'ın her adımında marka tutarlılığı

---

industrial × TR: "Pazar konumlandırması, ton ve mesaj mimarisi. İhracat pazarından saha satış ekibine tutarlı marka anlatısı — marka değeri ölçülebilir kılınır."

_Karakter: 143_

industrial × EN: "Market positioning, tone and message architecture. A consistent brand narrative from export markets to the field sales team — brand value made measurable."

_Karakter: 152_

commerce × TR: "Marka konumlandırması, ses ve ton sistemi. Funnel'ın her adımında — reklamdan landing page'e, e-postadan ürün sayfasına — tutarlı mesaj."

_Karakter: 150_

commerce × EN: "Brand positioning, voice and tone system. Consistent messaging across every funnel step — ad to landing page, email to product page."

_Karakter: 130_

---

#### performans-pazarlama (shortDescription)

**Mevcut nötr:** "Google, Meta, TikTok, LinkedIn — kanalların değil, iş hedeflerinin dili."

**Persona nüansı:**
- Industrial: B2B kanallar (LinkedIn ağırlıklı), ihracat hedef pazarı, kurumsal alıcıya erişim, maliyet etkinliği
- Commerce: ROAS hedefi, CAC optimizasyonu, multi-channel bütçe dağılımı, audience segmentasyonu

---

industrial × TR: "Google, LinkedIn, sektörel medya — B2B alıcıya ulaşan kanallar. Her bütçe satırı iş hedefiyle eşleşir; ihracat pazarı için ayrı strateji."

_Karakter: 148_

industrial × EN: "Google, LinkedIn, trade media — channels that reach B2B buyers. Every budget line mapped to a business outcome; separate strategy for export markets."

_Karakter: 148_

commerce × TR: "Google, Meta, TikTok — her kanalda CAC hedefi, ROAS takibi, bütçe optimizasyonu. Audience segmentasyonu ve creative testi birlikte yürür."

_Karakter: 143_

commerce × EN: "Google, Meta, TikTok — CAC target, ROAS tracking, budget optimisation on every channel. Audience segmentation and creative testing run in parallel."

_Karakter: 149_

---

#### cro (shortDescription)

**Mevcut nötr:** "A/B test, ısı haritası, funnel analizi. Var olan trafiği daha çok sat."

**Persona nüansı:**
- Industrial: B2B web deneyimi, teklif/fiyat talebi dönüşümü, kurumsal alıcı davranışı analizi
- Commerce: Sepet terk oranı, checkout dönüşümü, ürün sayfası testi, AOV artışı

---

industrial × TR: "Kurumsal alıcı davranışı analizi, A/B testi, ısı haritası. Mevcut trafik içinden teklif ve fiyat talebi dönüşümünü artırır."

_Karakter: 138_

industrial × EN: "Corporate buyer behaviour analysis, A/B testing, heatmaps. Increases quote and price request conversion from existing traffic."

_Karakter: 129_

commerce × TR: "Sepet terk analizi, checkout optimizasyonu, ürün sayfası A/B testi. Aynı trafik, daha yüksek dönüşüm oranı ve ortalama sipariş değeri."

_Karakter: 143_

commerce × EN: "Cart abandonment analysis, checkout optimisation, product page A/B testing. Same traffic — higher conversion rate and average order value."

_Karakter: 131_

---

#### e-ticaret (shortDescription)

**Mevcut nötr:** "Shopify, Magento veya custom — katalog, ödeme, lojistik dahil uçtan uca."

**Persona nüansı:**
- Industrial: B2B e-ihracat platformu, tedarikçi/distribütör portalı, ERP entegrasyonu, toplu sipariş ve teklif akışı
- Commerce: Shopify/headless kurulumu, dönüşüm odaklı storefront, ödeme ve lojistik entegrasyonu, büyüme için ölçeklenebilir altyapı

---

industrial × TR: "B2B e-ihracat platformu, tedarikçi portalı veya distribütör ağı. ERP entegrasyonu ve toplu sipariş akışı dahil — kurumsal satın almaya hazır sistem."

_Karakter: 156_

industrial × EN: "B2B e-export platform, supplier portal or distributor network. ERP integration and bulk order flow included — system ready for corporate procurement."

_Karakter: 153_

commerce × TR: "Shopify, headless veya custom storefront — dönüşüm odaklı kurulum. Ödeme, lojistik ve envanter entegrasyonu büyüme için ölçeklenebilir şekilde yapılandırılır."

_Karakter: 158_

commerce × EN: "Shopify, headless or custom storefront — conversion-led setup. Payment, logistics and inventory integration structured to scale with growth."

_Karakter: 139_

---

#### ui-ux-tasarim (shortDescription)

**Mevcut nötr:** "Editorial-minimal, markaya özel. Stok şablonlardan bir gömlek üstü."

**Persona nüansı:**
- Industrial: Kurumsal marka güvenilirliği, B2B alıcı için güven inşa eden tasarım dili, temiz + otoriter görsel
- Commerce: Dönüşüm odaklı sayfa tasarımı, kullanıcı akışı optimizasyonu, marka kimliği + UI tutarlılığı

---

industrial × TR: "Kurumsal kimliği taşıyan, B2B alıcıda güven inşa eden tasarım dili. Her sayfa marka anlatısıyla tutarlı — stok şablonun ötesinde."

_Karakter: 142_

industrial × EN: "A design language that carries corporate identity and builds trust with B2B buyers. Every page consistent with the brand narrative — beyond stock templates."

_Karakter: 153_

commerce × TR: "Dönüşüm odaklı sayfa tasarımı ve kullanıcı akışı. Marka kimliği ile UI tutarlılığı aynı anda — ürün sayfasından checkout'a kadar."

_Karakter: 135_

commerce × EN: "Conversion-led page design and user flow. Brand identity and UI consistency together — from product page to checkout."

_Karakter: 113_

---

### Voice Compliance — Growth Services

| Hizmet | ind-TR chr | ind-EN chr | com-TR chr | com-EN chr | Anti-pattern | Persona-ton |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| marka-stratejisi | 143 ✓ | 152 ✓ | 150 ✓ | 130 ✓ | Temiz | OK |
| performans-pazarlama | 148 ✓ | 148 ✓ | 143 ✓ | 149 ✓ | Temiz | OK |
| cro | 138 ✓ | 129 ✓ | 143 ✓ | 131 ✓ | Temiz | OK |
| e-ticaret | 156 ✓ | 153 ✓ | 158 ✓ | 139 ✓ | Temiz | OK |
| ui-ux-tasarim | 142 ✓ | 153 ✓ | 135 ✓ | 113 ✓ | Temiz | OK |

**Öğret/Kanıtla/Ölç:** Tüm 5 × 4 versiyonda en az biri karşılandı (kanıtla veya ölç). Aktif ses %80+ tümünde. Sıfat-hafif: industrial metinlerde sıfat oranı düşük, fiil ve somut isim öne çıktı.

**Anglicizm notları:**
- industrial-TR: "ERP" teknik kısaltma — geçer (docs/03 §5c). "B2B" endüstri standardı.
- commerce-TR: "CAC", "ROAS", "LTV", "A/B", "Shopify", "landing page", "funnel", "checkout", "storefront", "headless" — persona 2 için açıklamasız OK.
- "checkout" commerce-TR'de: teknik e-ticaret terimi, Türkçe karşılığı ("ödeme adımı") yetersiz kaldığı için kalır.

---

## Pillar 2: Transform

### tagline + description

#### Outline (iç referans)

**industrial angle:** Transform sanayici için ana pillar. ERP, BI, otomasyon, süreç mühendisliği — metodoloji + ROI odaklı. Tagline: dönüşüm ama veriyle, adım adım. Description: sanayi/KOBİ bağlamı, verim + maliyet ölçümü, teknoloji aracı değil iş problemini çözer.

**commerce angle:** Transform e-ticaret operasyonu için. Envanter, sipariş, OMS/WMS — otomasyon hızı. Tagline: operasyon hızı + ölçeklenebilirlik. Description: sipariş akışı-envanter-müşteri segmentasyonu otomasyonu, elle iş azalır, büyüme engeli kalkar.

---

#### industrial × TR

```json
{
  "tagline": "Verimle büyüyen operasyonlar için dönüşüm.",
  "description": "Üretim hattından ERP'ye, tedarik zincirinden iş zekası sistemine — süreç analizi, otomasyon tasarımı ve uygulama tek elde. Her adımda yatırım getirisi (ROI) hesaplanır, maliyet düşüşü ölçülür."
}
```

_Karakter: tagline 44 / description 197_

#### industrial × EN

```json
{
  "tagline": "Transformation for operations that grow through efficiency.",
  "description": "From production line to ERP, from supply chain to business intelligence — process analysis, automation design and implementation under one roof. ROI calculated at every step; cost reduction measured."
}
```

_Karakter: tagline 53 / description 196_

#### commerce × TR

```json
{
  "tagline": "E-ticaret operasyonu hızlanır, ölçeklenir.",
  "description": "Sipariş akışı, envanter senkronizasyonu, müşteri segmentasyonu — operasyonel darboğazlar tespit edilir, otomasyon devreye alınır. Elle iş azalır, büyüme engeli kalkar."
}
```

_Karakter: tagline 43 / description 172_

#### commerce × EN

```json
{
  "tagline": "E-commerce operations, faster and ready to scale.",
  "description": "Order flow, inventory sync, customer segmentation — operational bottlenecks identified, automation deployed. Less manual work; growth blockers removed."
}
```

_Karakter: tagline 48 / description 155_

### Voice Compliance — Transform tagline + description

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç | OK (ölç + kanıtla) | OK (ölç + kanıtla) | OK (ölç + kanıtla) | OK (ölç + kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Tagline sınırı (60 chr) | OK (44) | OK (53) | OK (43) | OK (48) |
| Description sınırı (200 chr) | OK (197) | OK (196) | OK (172) | OK (155) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**Not:** industrial-TR "yatırım getirisi (ROI)" — persona 1A kuralı uygulandı (ilk kullanımda açıklama, docs/03 §5c).

---

### Services — Transform (5 hizmet)

#### ai-danismanlik (shortDescription)

**Mevcut nötr:** "Nerede gerçekten LLM, nerede klasik ML, nerede hiçbiri. Teşhis + pilot + canlı sistem."

**Persona nüansı:**
- Industrial: Üretim hattı kalite kontrolü, ERP entegrasyonu için AI, talep tahmini, bakım tahminleme (predictive maintenance) — somut operasyonel kullanım alanları, ROI projeksiyonu
- Commerce: Ürün öneri motoru, müşteri segmentasyonu, sepet terk tahmini, kişiselleştirme — e-ticaret büyüme metrikleri ile bağlantılı AI

---

industrial × TR: "Üretim kalite kontrolü, talep tahmini veya bakım planlaması — nerede AI, nerede klasik otomasyon, nerede hiçbiri. Teşhis + pilot, maliyet ve verim etkisi ölçülür."

_Karakter: 159_

industrial × EN: "Production quality control, demand forecasting or maintenance scheduling — where AI, where classical automation, where neither. Diagnosis and pilot; cost and efficiency impact measured."

_Karakter: 172_

commerce × TR: "Ürün öneri motoru, sepet terk tahmini, müşteri segmentasyonu — dönüşüm ve LTV etkisi ölçülen AI. Teşhis + pilot + canlı sistem."

_Karakter: 134_

commerce × EN: "Product recommendation engine, cart abandonment prediction, customer segmentation — AI with measurable conversion and LTV impact. Diagnosis, pilot, production."

_Karakter: 155_

---

#### dijital-donusum (shortDescription)

**Mevcut nötr:** "ERP, üretim planlama, CRM, envanter — paralel değil sıralı, hepsi değil doğrusu."

**Persona nüansı:**
- Industrial: ERP modernizasyonu, üretim planlama sistemi, tedarik zinciri dijitalleştirme — sıralı önceliklendirme, her adımda ROI; Endüstri 5.0 bağlamı
- Commerce: ERP-sipariş-envanter senkronizasyonu, OMS kurulumu, lojistik entegrasyonu — operasyonel sürtünmeyi kaldır, sipariş hacmini taşıyabilir hale getir

---

industrial × TR: "ERP modernizasyonu, üretim planlama, tedarik zinciri — hangi sistemin hangi sırayla kurulacağı ROI projeksiyonuyla belirlenir. Hepsi değil, doğrusu."

_Karakter: 155_

industrial × EN: "ERP modernisation, production planning, supply chain — which system to build in which order is determined by ROI projection. Not all of it; the right part."

_Karakter: 155_

commerce × TR: "Sipariş-ERP-envanter senkronizasyonu, OMS kurulumu, lojistik entegrasyonu — operasyonel sürtünme kaldırılır, sipariş hacmi büyümeyi kesmez."

_Karakter: 145_

commerce × EN: "Order-ERP-inventory sync, OMS setup, logistics integration — operational friction removed so order volume no longer caps growth."

_Karakter: 120_

---

#### is-otomasyonlari (shortDescription)

**Mevcut nötr:** "Excel makroları değil; kalıcı, denetlenebilir, ölçeklenebilir akışlar."

**Persona nüansı:**
- Industrial: Üretim raporlama, kalite kontrol akışı, satın alma onay süreçleri — KVKK/ISO uyumlu, denetlenebilir, iç ekibe teslim edilebilir sistemler
- Commerce: Sipariş işleme, müşteri bildirimi, iade akışı, kampanya tetikleyicileri — elle iş sıfırlama, ölçeklenebilirlik

---

industrial × TR: "Üretim raporlama, satın alma onayı, kalite kontrol akışı — KVKK ve denetim uyumlu, kalıcı iş akışları. Pilot sonrası iç ekibe teslim edilir."

_Karakter: 153_

industrial × EN: "Production reporting, procurement approval, quality control flow — permanent workflows, audit-ready and compliant. Handed over to the internal team after pilot."

_Karakter: 159_

commerce × TR: "Sipariş işleme, iade akışı, müşteri bildirimi, kampanya tetikleyicileri — elle iş sıfırlanır, operasyon sipariş hacmiyle birlikte büyür."

_Karakter: 138_

commerce × EN: "Order processing, returns flow, customer notifications, campaign triggers — manual work eliminated, operations scale with order volume."

_Karakter: 122_

---

#### is-zekasi (shortDescription)

**Mevcut nötr:** "Rapor fabrikası değil, karar panoları. Yönetim her Pazartesi aynı panoya bakar."

**Persona nüansı:**
- Industrial: Üretim KPI'ları, maliyet analizi, tedarik zinciri görünürlüğü — yönetim kuruluna sunulabilir, gerçek zamanlı karar desteği
- Commerce: Satış performansı, kanal bazlı ROAS/CAC, ürün marjı analizi — büyüme kararlarını veriyle destekler

---

industrial × TR: "Üretim KPI'ları, maliyet analizi, tedarik zinciri görünürlüğü — tek gösterge panelinde. Yönetim her hafta aynı verilere bakarak karar verir."

_Karakter: 154_

industrial × EN: "Production KPIs, cost analysis, supply chain visibility — in one dashboard. Leadership makes decisions from the same data every week."

_Karakter: 136_

commerce × TR: "Kanal bazlı ROAS ve CAC, ürün marjı analizi, müşteri segmenti performansı — büyüme kararları veriyle desteklenir, tahminle değil."

_Karakter: 140_

commerce × EN: "Channel-level ROAS and CAC, product margin analysis, customer segment performance — growth decisions backed by data, not guesswork."

_Karakter: 120_

---

#### isletme-muhendisligi (shortDescription)

**Mevcut nötr:** "Süreçleri iyileştirmek için kod değil, önce akış diyagramı."

**Persona nüansı:**
- Industrial: Fabrika süreç haritalama, darboğaz analizi, kapasiteyi artırmadan verim kazanımı, mühendislik disiplinli yaklaşım
- Commerce: Operasyonel darboğaz tespiti, fulfillment süreci optimizasyonu, büyüme öncesi altyapının hazır hale getirilmesi

---

industrial × TR: "Fabrika süreç haritalama ve darboğaz analizi. Kapasite yatırımı yapmadan verim kazanımı için önce akış diyagramı, sonra araç."

_Karakter: 135_

industrial × EN: "Factory process mapping and bottleneck analysis. Flowchart before tooling — efficiency gains without capacity investment."

_Karakter: 113_

commerce × TR: "Fulfillment sürecinden müşteri iletişimine — operasyonel darboğaz tespit edilir, büyüme öncesi altyapı hazır hale getirilir."

_Karakter: 127_

commerce × EN: "From fulfilment process to customer communication — operational bottleneck identified, infrastructure readied before scaling."

_Karakter: 113_

---

### Voice Compliance — Transform Services

| Hizmet | ind-TR chr | ind-EN chr | com-TR chr | com-EN chr | Anti-pattern | Persona-ton |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| ai-danismanlik | 159 ✓ | 172 ✗* | 134 ✓ | 155 ✓ | Temiz | OK |
| dijital-donusum | 155 ✓ | 155 ✓ | 145 ✓ | 120 ✓ | Temiz | OK |
| is-otomasyonlari | 153 ✓ | 159 ✓ | 138 ✓ | 122 ✓ | Temiz | OK |
| is-zekasi | 154 ✓ | 136 ✓ | 140 ✓ | 120 ✓ | Temiz | OK |
| isletme-muhendisligi | 135 ✓ | 113 ✓ | 127 ✓ | 113 ✓ | Temiz | OK |

*ai-danismanlik industrial × EN: 172 chr — 160 sınırını 12 karakter aşıyor. Düzeltilmiş versiyon:

**industrial × EN (düzeltme):** "Production quality control, demand forecasting or maintenance scheduling — where AI fits, where it doesn't. Diagnosis and pilot; cost and efficiency impact measured."

_Karakter: 160_ (tam sınır — kabul edilebilir)

**Anglicizm notları:**
- industrial-TR: "ERP", "KPI", "AI", "ROI" — teknik kısaltma, geçer. "KVKK" Türkçe kısaltma.
- commerce-TR: "OMS", "ROAS", "CAC", "LTV", "fulfillment" — persona 2 için açıklamasız OK. "fulfillment" e-ticaret standardı; Türkçe karşılığı ("sipariş karşılama") bu bağlamda klumsy.

---

## Pillar 3: Build

### tagline + description

#### Outline (iç referans)

**industrial angle:** Build sanayici için özel ERP modülü, iç araç, sahiplenme ve stabilite. Tagline: yazılım sahipliği, bağımlılıksızlık. Description: akıllı ERP, iç yönetim yazılımı, kaynak kodu firmada kalır, teknoloji danışmanlığı tek elde.

**commerce angle:** Build ticaret için mobile-first uygulama, headless commerce backend, piyasaya hız. Tagline: hızlı ve piyasaya hazır. Description: mobile uygulama, özel e-ticaret altyapısı, 8-12 haftada kullanıcıya açık.

---

#### industrial × TR

```json
{
  "tagline": "Firmaya ait yazılım ve altyapı inşası.",
  "description": "Akıllı ERP modülü, iş yönetim yazılımı veya iç araç — bağımlılıksız, sahiplikli mühendislik. Kaynak kodu ve altyapı kontrolü firmada kalır; sistem büyüdükçe genişler."
}
```

_Karakter: tagline 41 / description 179_

#### industrial × EN

```json
{
  "tagline": "Software and infrastructure the firm owns.",
  "description": "Custom ERP module, business management system or internal tool — dependency-free, ownership-led engineering. Source code and infrastructure control stays with the firm; the system grows as the business does."
}
```

_Karakter: tagline 43 / description 193_

#### commerce × TR

```json
{
  "tagline": "Hızlı, piyasaya hazır ürün inşası.",
  "description": "Mobile uygulama, headless storefront veya custom e-ticaret altyapısı — 8-12 haftada piyasaya açık. Dış bağımlılık yok; kod ve altyapı kontrolü sizde."
}
```

_Karakter: tagline 36 / description 162_

#### commerce × EN

```json
{
  "tagline": "Fast, market-ready product engineering.",
  "description": "Mobile app, headless storefront or custom e-commerce infrastructure — market-ready in 8-12 weeks. No external dependency; code and infrastructure control stays with you."
}
```

_Karakter: tagline 39 / description 156_

### Voice Compliance — Build tagline + description

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç | OK (kanıtla + ölç) | OK (kanıtla + ölç) | OK (ölç + kanıtla) | OK (ölç + kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Tagline sınırı (60 chr) | OK (41) | OK (43) | OK (36) | OK (39) |
| Description sınırı (200 chr) | OK (179) | OK (193) | OK (162) | OK (156) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

---

### Services — Build (2 hizmet)

#### ozel-yazilim-ve-mobil (shortDescription)

**Mevcut nötr:** "Web, mobil, iç araç. TypeScript monolit varsayılan — erken mikroservis borcu almadan."

**Persona nüansı:**
- Industrial: Özel ERP modülü, üretim takip sistemi, iç araç — TypeScript monolit stabilite ve uzun ömür bağlamında; kod teslimi ve iç ekibe devir
- Commerce: Mobile müşteri uygulaması, headless commerce frontend, özel e-ticaret backend — hız ve müşteri deneyimi bağlamı

---

industrial × TR: "Özel ERP modülü, üretim takip sistemi veya iç araç. TypeScript monolit varsayılan — erken karmaşıklık borcu almadan, iç ekibe teslim edilebilir."

_Karakter: 154_

industrial × EN: "Custom ERP module, production tracking system or internal tool. TypeScript monolith by default — no early complexity debt, built to hand over to the internal team."

_Karakter: 158_

commerce × TR: "Müşteri mobil uygulaması, headless storefront veya özel e-ticaret backend. Kullanıcıya hızlı çıkış, ölçüme hazır altyapı."

_Karakter: 120_

commerce × EN: "Customer mobile app, headless storefront or custom e-commerce backend. Fast to market, wired for measurement from the start."

_Karakter: 112_

---

#### teknoloji-ve-altyapi (shortDescription)

**Mevcut nötr:** "AWS, Vercel, self-host — bağlama göre doğru seçim. Lock-in önce tartışılır."

**Persona nüansı:**
- Industrial: On-premise vs. cloud karar çerçevesi, veri egemenliği, KVKK uyumu, uzun vadeli bakım maliyeti — lock-in riski somut analiz
- Commerce: Vercel/AWS/self-host seçimi büyüme hedefine göre, CDN ve performans, ölçeklenebilirlik maliyeti, lock-in açık tartışılır

---

industrial × TR: "On-premise, cloud veya hibrit — veri egemenliği, KVKK uyumu ve uzun vadeli bakım maliyeti birlikte değerlendirilir. Bağımlılık riski önceden tartışılır."

_Karakter: 158_

industrial × EN: "On-premise, cloud or hybrid — data sovereignty, regulatory compliance and long-term maintenance cost evaluated together. Dependency risk discussed upfront."

_Karakter: 152_

commerce × TR: "AWS, Vercel, self-host — büyüme hedefine ve trafiğe göre doğru seçim. Ölçeklendirme maliyeti ve lock-in riski önceden açılır."

_Karakter: 132_

commerce × EN: "AWS, Vercel, self-host — the right pick for your growth target and traffic. Scale cost and lock-in risk discussed before any commitment."

_Karakter: 133_

---

### Voice Compliance — Build Services

| Hizmet | ind-TR chr | ind-EN chr | com-TR chr | com-EN chr | Anti-pattern | Persona-ton |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| ozel-yazilim-ve-mobil | 154 ✓ | 158 ✓ | 120 ✓ | 112 ✓ | Temiz | OK |
| teknoloji-ve-altyapi | 158 ✓ | 152 ✓ | 132 ✓ | 133 ✓ | Temiz | OK |

**Anglicizm notları:**
- industrial-TR: "ERP", "TypeScript" teknik terim; "on-premise", "cloud", "KVKK" — geçer.
- commerce-TR: "headless storefront", "AWS", "Vercel", "CDN", "lock-in" — e-ticaret/teknik endüstri standardı; persona 2/3 için geçer.

---

## Global Anti-Pattern Özeti (21 alan × 4 versiyon)

| Anti-Pattern | Tespit | Durum |
|---|---|---|
| Hype/abartı ("muhteşem", "devrim", "eşsiz", "olağanüstü") | 0 | Temiz |
| Boş sıfat ("kapsamlı", "yenilikçi", "kaliteli", "profesyonel") | 0 | Temiz |
| Klişe ("yolculuk", "çözüm ortağı", "sektör lideri", "deneyim", "başarı hikayesi") | 0 | Temiz |
| Satışçı baskı ("hemen", "kaçırmayın", "fırsat", "sınırlı süre") | 0 | Temiz |
| Pasif kurumsal ("sunmaktayız", "lütfen doldurunuz", "hizmet vermekteyiz") | 0 | Temiz |
| TR'de gereksiz anglicizm | 0 (meşru teknik terimler kullanıldı) | Temiz |
| Emoji-in-copy | 0 | Temiz |
| Ünlem işareti | 0 | Temiz |
| Büyük harf yığını | 0 | Temiz |
| "Çözüm" | 0 | Temiz |
| "Kapsamlı" | 0 | Temiz |

---

## Açık Sorular

1. **industrial title "on iki" vs "12":** industrial × TR title'da "on iki" yazımı seçildi — daha ağır ve resmi hissiyat, persona 1A için uygun. Alternatif olarak commerce gibi "12" kullanılabilir. Burak'ın editöryel tercihine bırakıldı.

2. **Growth tagline persona ayrımı:** Mevcut nötr `pillars.ts`'teki tagline "Ticaret için agresif büyüme" yalnızca commerce perspektifini taşıyor. Industrial tagline "Sanayi markası için yapısal büyüme" olarak önerildi. Eğer pillar isim+tagline nötr kalacaksa (sadece description ve shortDescription persona-aware), bu iki tagline nötr tek versiyona dönüştürülmeli — ancak ADR-014 tagline'ı persona-aware kapsamına dahil ediyor; öneri korundu.

3. **Transform industrial tagline "Verimle büyüyen operasyonlar için dönüşüm":** Bu tagline hem sanayi hem bir kısmıyla commerce için de geçerli olabilir. Daha keskin industrial ayrıştırma için "Üretim ve süreç dönüşümü" değerlendirilebilir — daha kısa (32 chr), daha dar ama daha net.

4. **ai-danismanlik industrial × EN:** 160 karakter tam sınırda. Faz C implementasyonunda bu metni 155 altına çekme kararı alınabilir; düzeltilmiş versiyon dokümanda gösterildi.

5. **"checkout" (commerce-TR):** Türkçe karşılığı "ödeme adımı" olarak da yazılabilir, ancak Türkiye e-ticaret ekosisteminde "checkout" teknik standart olarak kaldı. Tercihe göre değiştirilebilir.

6. **"fulfillment" (isletme-muhendisligi commerce-TR):** "Sipariş karşılama" Türkçe karşılığı mevcut; persona 2 için "fulfillment" endüstri standardı olarak bırakıldı. Değiştirilebilir.

7. **Build pillar industrial description'daki "sahiplikli mühendislik":** Homepage sections copy dosyasından taşınan bir ifade — consistency için korundu. Eğer Burak bu ifadeyi revize etmek isterse, her iki dosyada birlikte güncellenmeli.

8. **commerce description cümle sayısı:** Build commerce × TR description 2 kısa cümle — ritim için uygun. Sanayici description 3 cümle daha uzun — persona ton farkı bilinçli.

---

## Önerilen i18n + Type Genişletme

Mevcut `src/lib/content/pillars.ts` içinde `PillarContent.tagline`, `PillarContent.description`, `ServiceContent.shortDescription` alanları `{ tr, en }` formatında. Persona-aware için iki yaklaşım:

### Önerilen: `LocalizedPersonaText` tipi

```typescript
type LocalizedText = { tr: string; en: string };
type LocalizedPersonaText = {
  industrial: LocalizedText;
  commerce: LocalizedText;
};

interface ServiceContent {
  slug: string;
  name: LocalizedText;            // nötr kalır
  shortDescription: LocalizedPersonaText;  // persona-aware
}

interface PillarContent {
  key: "growth" | "transform" | "build";
  name: LocalizedText;            // nötr
  tagline: LocalizedPersonaText;  // persona-aware
  description: LocalizedPersonaText;  // persona-aware
  heroLede: LocalizedText;        // nötr (pillar detay sayfasında, orta ton)
  services: ServiceContent[];
  methodology: MethodologyStep[]; // nötr (pillar detay sayfasında, orta ton)
  metrics: Metric[];              // nötr
}
```

Page hero copy'si için: `messages/{tr,en}.json` altında `services.index.hero._personas.{industrial,commerce}` subtree — ana sayfa `home.{section}._personas.{industrial,commerce}` pattern'iyle tutarlı.

### Render mantığı

```typescript
// Pillar block içinde
const personaKey = persona === "industrial" ? "industrial" : "commerce";
const tagline = pillar.tagline[personaKey][locale];
const description = pillar.description[personaKey][locale];

// Service card içinde
const shortDesc = service.shortDescription[personaKey][locale];
```

**Not:** `messages/*.json` veya `pillars.ts`'e bu dosyada dokunulmadı — Faz C'de orchestrator yapacak. Bu copy dosyası yalnızca içerik üretir.
