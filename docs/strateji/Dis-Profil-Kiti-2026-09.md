# Dış profil kiti — tutarlı ad, tanım ve hizmet listesi (Eylül 2026)

> **Statü:** Taslak — Burak onayı bekliyor · **Tarih:** 2026-09-25
> **Otoriteler:** `Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` §4 Faz 1 (GBP adı + yorum ritüeli, Clutch/GoodFirms/Sortlist profilleri) · `INDOLES-Organik-Strateji-SEO-GEO-v1.md` §5 (varlık tutarlılığı) ve §6 (lokal SEO) · `Off-Site-Otorite-ve-Arac-Plani.md` §1 (dizin katmanları)
> **Veri kaynakları:** künye `src/lib/content/company.ts` · kanıt rakamları yalnız `src/lib/content/cases.ts` · paket fiyatları `src/lib/content/packages.ts` · hizmet adları ve URL'ler `src/lib/content/services/*`
> **Dış kurallar 25 Eylül 2026'da okundu:** Google İşletme Profili yönergeleri (support.google.com/business/answer/3038177), profil düzenleme sınırları (answer/3039617), yasaklı ve kısıtlı içerik — yorum isteme (answer/7400114).

Bu dosya Burak'ın profillere **birebir yapıştıracağı** metinleri taşır. Bir metin değişecekse önce burada değişir, sonra bütün profillerde aynı gün değişir. AI modelleri bir varlığı çapraz kaynak tutarlılığından tanır: üç farklı tanım üç zayıf sinyal, tek tanım bir güçlü sinyal üretir (strateji §5).

---

## 1. Değişmezler

Her profilde, her dilde aynı kalır. Tablodaki değerin dışında bir yazım kullanılmaz.

| Alan | Değer | Kaynak / not |
|---|---|---|
| Marka adı | **INDOLES** | Tamamı büyük harf. "Indoles", "INDOLES Agency", "INDOLES Creative", "INDOLES Growth" yok. Sitedeki Organization `name` ile aynı (`json-ld.ts`) |
| Yasal unvan | **İndoles Yazılım A.Ş.** | `company.ts` `legalName`. Yalnız ayrı bir "yasal ad" alanı olan yerde (Crunchbase, Clutch şirket künyesi) |
| Kategori tanımı | TR **iş geliştirme stüdyosu** · EN **business building studio** | `is-gelistirme-studyosu-nedir` yazısının kanonik terimi; bkz. §10 soru 2 |
| Web sitesi | `https://www.indoles.com.tr` | Kanonik host `www` (ADR-024). EN profillerde `https://www.indoles.com.tr/en` |
| Telefon | +90 536 247 60 12 | `company.ts` `phone` |
| E-posta | digital@indoles.com.tr | `company.ts` `email` |
| Adres | Levent, İstanbul | Tek doğrulanmış lokasyon. Londra ve Dubai **yazılmaz** (`company.ts` notu: doğrulanmamış lokasyon Google'ın yerel spam politikasına aykırı) |
| Çalışma saatleri | Pzt–Cum 09:00–18:00 | `company.ts` `hours` |
| LinkedIn | `https://www.linkedin.com/company/indoles-growth/` | `company.ts` `social` (2026-09-25 düzeltmesi) |
| Instagram | `https://www.instagram.com/indolesgrowth/` | `company.ts` `social` |
| X / Twitter | **Yok** | Hesap yok; hiçbir profile eklenmez |
| Hizmet sırası | CRO → yapay zeka danışmanlığı → GEO → e-ticaret → dijital dönüşüm → UX | §4; her platformda aynı sıra |

**"Ajans" kuralı.** Sitede kendimizi "ajans" diye adlandırmayız (`keyword-coverage.test.ts`). Bu kural **bizim yazdığımız** alanlar içindir: ad, slogan, tanım, hizmet açıklaması. Platformun kendi taksonomisinde kategori adı "agency" içeriyorsa (Sortlist "Conversion Rate Optimization agencies", DesignRush `/agency/...` kategorileri, GBP "Marketing agency" kategorisi) o kategoriyi seçmek kurala aykırı değildir; kategori platformun dilidir, bizim tanımımız değil.

---

## 2. Ad

Her platformda ad alanına yalnız **INDOLES** yazılır. Google İşletme Profili'ndeki bugünkü ad ve öneri §7'de.

---

## 3. Tanımlar

### 3.1 Kısa tanım (≤160 karakter)

Kullanıldığı yer: Crunchbase kısa açıklama, dizinlerin "summary / short description" alanları, GoodFirms ve Sortlist kart metni. LinkedIn slogan alanında §3.3 kullanılır.

**TR (141 karakter)**

```
INDOLES, İstanbul merkezli iş geliştirme stüdyosu: dönüşüm oranı optimizasyonu (CRO), yapay zeka danışmanlığı, GEO ve e-ticaret danışmanlığı.
```

**EN (138 karakter)**

```
INDOLES is an Istanbul-based business building studio: conversion rate optimisation (CRO), AI consultancy, GEO and e-commerce consultancy.
```

### 3.2 Uzun tanım (≤750 karakter)

Kullanıldığı yer: GBP işletme açıklaması (sınır 750; link ve fiyat içermez — Google kuralı), LinkedIn "Genel bakış", Clutch/GoodFirms/Sortlist/DesignRush şirket özeti, Crunchbase tam açıklama.

**TR (729 karakter)**

```
INDOLES (İndoles Yazılım A.Ş.), İstanbul Levent merkezli bir iş geliştirme stüdyosudur: sanayiye teknoloji dönüşümü, ticarete büyüme inşa eder. Öncelikli hizmetleri dönüşüm oranı optimizasyonu (CRO), yapay zeka danışmanlığı, GEO danışmanlığı (yapay zeka aramalarında görünürlük), e-ticaret danışmanlığı, dijital dönüşüm danışmanlığı ve UX tasarımıdır. Her iş teşhisle başlar: önce ölçüm doğrulanır, sonra hipotez kurulur ve her değişiklik ölçülerek yayına alınır. Çalışma sabit kapsamlı paketlerle başlar, proje ya da aylık çalışmayla sürer; kurulan sistem ve bilgi müşteride kalır. Yayımlanmış vakalardan: GYMWOLVES'te 3 ayda 12 kat satış, Meccanotecnica Umbra'da 10 kat teklif talebi, SIM Baskı'da 6 ayda 15 kat organik trafik.
```

**EN (746 karakter — İngiliz imlası)**

```
INDOLES (İndoles Yazılım A.Ş.) is a business building studio in Levent, Istanbul: technology transformation for manufacturers, growth for commerce brands. Priority services: conversion rate optimisation (CRO), AI consultancy, GEO consultancy (visibility in AI search), e-commerce consultancy, digital transformation consultancy and UX design. Every engagement starts with a diagnosis: measurement first, then hypotheses, and every change measured as it ships. Work begins with fixed-scope packages and continues as a project or monthly engagement; systems and know-how stay with the client. Published cases: 12× sales in 3 months at GYMWOLVES, 10× quote requests at Meccanotecnica Umbra, 15× organic traffic in 6 months at SIM Printing Suppliers.
```

### 3.3 Slogan (≤120 karakter)

Kanonik konumlandırma cümlesinden (`INDOLES-Marka-Brief.md` §2.1). Kullanıldığı yer: LinkedIn "Slogan", Clutch/DesignRush tagline alanı.

| Dil | Metin | Karakter |
|---|---|---|
| TR | `Sanayiye dönüşüm, ticarete büyüme. Rapor değil sonuç, kampanya değil sistem.` | 76 |
| EN | `Transformation for manufacturers, growth for commerce brands. Results, not reports; systems, not campaigns.` | 107 |

---

## 4. Hizmet listesi — sıra sabit

Sıra satın alma niyetli öncelikten gelir (yol haritası §2: P0 CRO, yapay zeka danışmanlığı, GEO; P1 e-ticaret, dijital dönüşüm, UX). Platform hizmet sayısını sınırlıyorsa listenin **başından** kesilir, sırası değişmez. Açıklamaların hepsi 250 karakterin altında.

| # | TR ad | EN ad | URL (TR · EN) |
|---|---|---|---|
| 1 | Dönüşüm oranı optimizasyonu (CRO) | Conversion rate optimisation (CRO) | `/tr/hizmetler/cro` · `/en/services/cro` |
| 2 | Yapay zeka danışmanlığı | AI consultancy | `/tr/hizmetler/ai-danismanlik` · `/en/services/ai-consulting` |
| 3 | GEO danışmanlığı | GEO consultancy | **Hizmet sayfası henüz yok** (Faz 1 işi). Geçici: `/tr/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz` · `/en/articles/how-to-stand-out-in-ai-search`. Sayfa yayına girince bütün profillerde değiştir |
| 4 | E-ticaret danışmanlığı | E-commerce consultancy | `/tr/hizmetler/e-ticaret` · `/en/services/e-commerce` |
| 5 | Dijital dönüşüm danışmanlığı | Digital transformation consultancy | `/tr/hizmetler/dijital-donusum` · `/en/services/digital-transformation` |
| 6 | UX tasarımı | UX design | `/tr/hizmetler/ui-ux-tasarim` · `/en/services/ui-ux-design` |

Tüm URL'lerin önüne `https://www.indoles.com.tr` gelir.

### Hizmet açıklamaları

Hizmet sayfalarının lede'lerinden kısaltıldı; sayfa değişirse burası da değişir.

**1. Dönüşüm oranı optimizasyonu (CRO)**
- TR: `Mevcut ziyaretçiden daha fazla satış ya da teklif talebi çıkarma işi. Ölçüm doğrulanır, vazgeçme noktaları bulunur, her düzeltme A/B testiyle ölçülür; yeni trafik satın alınmaz.`
- EN: `Getting more sales or enquiries from the visitors you already have. Measurement is validated, drop-off points are found and every fix is measured with an A/B test; no new traffic is bought.`

**2. Yapay zeka danışmanlığı**
- TR: `Yapay zekanın nerede gerçekten para kazandırdığını, nerede pahalı bir oyuncak olduğunu ayırma işi. Araçtan değil, hangi işin ne kadar zaman ve para yediğini ölçmekten başlar.`
- EN: `Separating where AI genuinely pays off from where it is an expensive toy. The work starts not with the tool but by measuring which tasks consume how much time and money.`

**3. GEO danışmanlığı**
- TR: `ChatGPT, Gemini, Perplexity ve Google'ın yapay zeka yanıtlarında kaynak gösterilen marka olmak için içerik, yapı ve varlık tutarlılığı çalışması; görünürlük sabit bir soru setiyle düzenli ölçülür.`
- EN: `Content, structure and entity-consistency work to become a cited source in the AI answers of ChatGPT, Gemini, Perplexity and Google; visibility is measured regularly against a fixed set of questions.`
- Not: GEO hizmet sayfası yayına girince bu metni o sayfanın lede'iyle hizala.

**4. E-ticaret danışmanlığı**
- TR: `Siparişin ödemeden sevkiyata kendi kendine akması: mağaza, satış tarafıyla birlikte arkadaki stok ve muhasebe düzeniyle kurulur; dönüşüm ve operasyon aynı planda ele alınır.`
- EN: `An order flowing on its own from payment to dispatch: the store is built together with the stock and accounting behind it, and conversion and operations sit in one plan.`

**5. Dijital dönüşüm danışmanlığı**
- TR: `Hangi sistemin hangi sırayla kurulacağına karar vermek. En çok sıkışan yer bulunur ve oradan başlanır; bir sonraki adım ancak öncekinin karşılığı görülünce atılır.`
- EN: `Deciding which system to build in which order. The tightest bottleneck is found and the work starts there; the next step is taken only once the previous one has paid off.`

**6. UX tasarımı**
- TR: `Bir ekranın hem doğru görünmesi hem de kullanan kişiyi hedefine ulaştırması. Tasarım görsel tercih olarak değil, satın alma yolundaki engelleri kaldıran bir karar dizisi olarak ele alınır.`
- EN: `An interface that both looks right and gets people where they meant to go. Design is treated as a chain of decisions that remove obstacles on the path to purchase, not as visual preference.`

---

## 5. Kanıt satırları — yalnız `cases.ts` rakamları

Kural: rakam bağlamıyla (süre, metrik) birlikte yazılır; `cases.ts`te olmayan rakam hiçbir profile girmez (`docs/03` §6a.1 madde 4, sahipsiz rakam yasağı). Müşteri adları vaka sayfalarında zaten yayımlı; portföy öğesi olarak kullanılabilir. Feruza Elegance vakasında yayımlı rakam yok, bu yüzden listede değil.

| Vaka (`cases.ts` slug) | Hizmet eşleşmesi | TR satır | EN line |
|---|---|---|---|
| `gymwolves-12-kat-satis` | CRO | GYMWOLVES: hedef satışı 3 ayda ikiye katlamaktı; veri akışı onarıldı, huni yeniden kuruldu, 3 ayda satış 12 katına çıktı. | GYMWOLVES aimed to double sales in 3 months; the data flow was repaired and the funnel rebuilt, and sales rose 12× in 3 months. |
| `odorgo-kategori-yaratma` | CRO, e-ticaret | OdorGo: sıfırdan kurulan bir kategoride marka stratejisi ve CRO odaklı e-ticaretle 8 ayda 10 milyon TL ciro; MacroCenter, Migros ve Happy Center rafları. | OdorGo: brand strategy and CRO-led e-commerce in a category built from zero, ₺10M revenue in 8 months; on MacroCenter, Migros and Happy Center shelves. |
| `meccanotecnica-umbra-teklif-portali` | Yapay zeka danışmanlığı | Meccanotecnica Umbra Türkiye: AI teknik danışman ve teklif portalıyla teklif talebi 10 katına çıktı, yanıt süresi %90 kısaldı. | Meccanotecnica Umbra Türkiye: an AI technical advisor and a quote portal took quote requests up 10× and cut response time by 90%. |
| `sim-baski-ihracat-icerigi` | GEO | SIM Baskı Malzemeleri: beş dilli Next.js sitesi ve SEO ile GEO'yu birlikte gözeten içerik programı; 6 ayda organik trafik 15 kat, AI motorlarındaki görünürlük sıfırdan 40 bine. | SIM Printing Suppliers: a five-language Next.js site and a content programme built for SEO and GEO together; 15× organic traffic in 6 months, AI-engine visibility from zero to 40,000. |
| `istanbul-ortez-protez-arama-gorunurlugu` | GEO, UX | İstanbul Ortez Protez: mobil öncelikli site ve arama ile AI motorları için içerik; 15 ayda öncelikli kelimelerde ilk 3, 50'den fazla hasta. | İstanbul Ortez Protez: a mobile-first site and content for search and AI engines; top 3 for priority keywords and 50+ patients in 15 months. |
| `soylu-avm-e-ticaret-buyume` | E-ticaret | SOYLU AVM: ölçüm altyapısı kampanyadan önce yeniden kuruldu; kampanyanın ilk 6 gününde 1,5 milyon dolar gelir, toplam trafikte %150 artış. | SOYLU AVM: the measurement stack was rebuilt before the campaign; $1.5M revenue in the campaign's first 6 days and a 150% rise in total traffic. |
| `mkcomputer-dropshipping-otomasyonu` | Dijital dönüşüm | MKComputer: Magento 2 üzerinde 200.000'i aşkın ürünün stok, fiyat ve tedarikçisi 5 dakikada bir senkronlanıyor; manuel sipariş adımı sıfır. | MKComputer: stock, price and supplier for 200,000+ products synced every 5 minutes on Magento 2, with zero manual order steps. |
| `fyr-luks-dekorasyon-lansmani` | UX | FYR Luxury: marka konumu, arayüz ve kreatif üretim tek elden; 12 aylık ciro hedefi (100.000 dolar) ilk 3 ayda geçildi. | FYR Luxury: positioning, interface and creative production as one system; the 12-month revenue target ($100K) was passed in the first 3 months. |

Portföy alanı üç vakayla sınırlıysa sıra: GYMWOLVES (CRO) → Meccanotecnica Umbra (yapay zeka) → SIM Baskı (GEO). Vaka linkleri: `https://www.indoles.com.tr/tr/vakalar/<slug>` · EN `https://www.indoles.com.tr/en/case-studies/<en-slug>` (EN slug'lar `cases.ts`te).

---

## 6. Platform bazında alanlar ve kategori önerileri

Kategori adlarında **✓** = platformun kendi kategori sayfası 25 Eylül 2026'da bulundu (URL yanında); **?** = adı formda doğrula, listede birebir yoksa en yakınını seç.

### 6.1 Google İşletme Profili (TR)

| Alan | Değer |
|---|---|
| İşletme adı | **INDOLES** (gerekçe §7) |
| Birincil kategori | Pazarlama danışmanı — *Marketing consultant* ? |
| Ek kategoriler | İşletme yönetimi danışmanı — *Business management consultant* ? · İnternet pazarlama hizmeti — *Internet marketing service* ? · Yazılım şirketi — *Software company* ? |
| Açıklama | §3.2 TR uzun tanım (729/750) |
| Hizmetler | §4 sırası ve TR açıklamaları |
| Web sitesi | `https://www.indoles.com.tr` |
| Randevu / iletişim bağlantısı | `https://www.indoles.com.tr/tr/iletisim` (`/rezervasyon` token'lı bir akış, genel bağlantı olarak kullanılmaz) |
| Telefon, saatler, adres | §1 |
| Açılış tarihi | Burak — §10 soru 1 |

Kategori mantığı: Google "işletmenizi tarif eden en az sayıda kategori" ve "bu işletme **bir** … dır" testini ister; en fazla 1 birincil + 9 ek. P0 hizmetlerinin ikisi (CRO, GEO) pazarlama danışmanlığıdır, bu yüzden birincil kategori *Marketing consultant*; yapay zeka ve dijital dönüşüm *Business management consultant*, Build pillar'ı ve yasal unvan *Software company* ile taşınır. *Marketing agency* bilinçli olarak dışarıda: dört kategori çekirdeği anlatıyor, beşincisi sinyali inceltir. Strateji §6'daki "danışmanlık + yazılım + pazarlama" seti bununla karşılanıyor.

Gönderi taslakları §8, yorum isteme şablonu §9.

### 6.2 LinkedIn şirket sayfası (TR + EN)

LinkedIn sayfa bilgisini birden fazla dilde tutmaya izin verir; TR birincil, EN ikinci dil.

| Alan | TR | EN |
|---|---|---|
| Ad | INDOLES | INDOLES |
| Slogan | §3.3 TR | §3.3 EN |
| Genel bakış | §3.2 TR uzun tanım + alt satırda §4 hizmet adları, sırayla | §3.2 EN + §4 EN adları |
| Web sitesi | `https://www.indoles.com.tr` | `https://www.indoles.com.tr/en` |
| Sektör | *Business Consulting and Services* ? | aynı |
| Şirket büyüklüğü | Burak — §10 soru 3 (`consultants.ts`te 10 kişi → "2-10" kovası) | aynı |
| Merkez | Levent, İstanbul | Levent, Istanbul |
| Uzmanlık alanları | Dönüşüm oranı optimizasyonu (CRO) · Yapay zeka danışmanlığı · GEO · E-ticaret danışmanlığı · Dijital dönüşüm danışmanlığı · UX tasarımı | Conversion rate optimisation · AI consultancy · GEO · E-commerce consultancy · Digital transformation · UX design |

Danışman profilleri ↔ site karşılıklı linki (strateji §5 "kadro = 10 entity") bu kitin kapsamı dışında; ayrı iş.

### 6.3 Clutch (EN)

| Alan | Değer |
|---|---|
| Company name | INDOLES |
| Legal name | İndoles Yazılım A.Ş. |
| Tagline | §3.3 EN |
| Company summary | §3.2 EN (746) |
| Website · HQ | `https://www.indoles.com.tr/en` · Istanbul, Türkiye |
| Min. project size | En küçük yayımlı paket 6.000 USD (Dijital Dönüşüm Teşhisi, `packages.ts`) → formdaki en yakın alt kova, ör. **$5,000+** |
| Avg. hourly rate | Yayımlı değil — Burak §10 soru 4 (boş bırakılabilir) |
| Employees · Founded | Burak §10 soru 1 ve 3 |
| Service lines | Conversion Optimization ✓ (`clutch.co/agencies/conversion-optimization`) · AI Consulting ✓ (`clutch.co/consulting/ai`) · Generative Engine Optimization (GEO) ✓ (`clutch.co/seo-firms/generative-engine-optimization`) · eCommerce ? · Digital Strategy ? · UX/UI Design ? |
| Service focus (%) | Clutch yüzdelerin toplamının 100 olmasını ister. **Öneri** (gerçek iş dağılımına göre Burak ayarlar): CRO 30 · AI Consulting 20 · GEO 15 · eCommerce 15 · Digital Strategy 10 · UX/UI 10 |
| Portfolio | §5'teki ilk üç vaka, EN satırlarıyla |
| Reviews | Clutch yorumu müşteriyle kendi formu ya da görüşmesiyle toplar; §9 ritüeline bağlanır, müşteri onayı gerekir |

### 6.4 GoodFirms (EN)

| Alan | Değer |
|---|---|
| Company name | INDOLES |
| Summary | §3.1 EN kısa tanım (kart) + §3.2 EN (profil) |
| Categories | Conversion Rate Optimization ✓ (`goodfirms.co/directory/marketing-services/top-digital-marketing-companies/conversion-rate-optimization`) · AI Consulting ✓ (`goodfirms.co/artificial-intelligence/ai-consulting`) · E-commerce ? · Digital Transformation ? · UX Design ? · GEO: ayrı kategori yoksa SEO altında, adıyla açıklamada |
| Pricing | Min. project Clutch ile aynı; hourly rate §10 soru 4 |
| Portfolio | §5 ilk üç vaka |

### 6.5 Sortlist (EN — Avrupa ağırlıklı)

| Alan | Değer |
|---|---|
| Agency name alanı | INDOLES (alan adı platformun; bizim yazdığımız değer yalnız marka adı) |
| Description | §3.2 EN |
| Services | Conversion Rate Optimization ✓ (`sortlist.com/conversion-rate-optimization`) · eCommerce Marketing ✓ (`sortlist.com/s/ecommerce-marketing/turkey-tr`) · AI / GEO / UX ? |
| Minimum budget | En küçük yayımlı paket €5.500 (`packages.ts`) → en yakın alt kova |
| Languages | Turkish, English |
| Locations served | Türkiye merkez; Avrupa'ya uzaktan çalışma (strateji §7 EN fazı) — yalnız gerçekten çalışılıyorsa işaretle |

### 6.6 DesignRush (EN)

| Alan | Değer |
|---|---|
| Agency name alanı | INDOLES |
| Tagline · description | §3.3 EN · §3.2 EN |
| Categories | Conversion Rate Optimization ✓ (`designrush.com/agency/conversion-optimization`) · UX Design ? · eCommerce ? · AI ? |
| Portfolio | §5 ilk üç vaka |

### 6.7 Crunchbase (EN)

| Alan | Değer |
|---|---|
| Organization name | INDOLES |
| Legal name | İndoles Yazılım A.Ş. |
| Short description | §3.1 EN (138) |
| Full description | §3.2 EN |
| Industries | Consulting ? · Artificial Intelligence (AI) ? · E-Commerce ? · Marketing ? · Software ? — Crunchbase listesinden seç |
| Headquarters | Istanbul, Türkiye |
| Website · LinkedIn | §1 |
| Founded date · company type | Burak §10 soru 1 · Private |
| ADUARDO bağlantısı | Off-site plan Katman 1'e göre ürün olarak eklenir — Burak |

---

## 7. Google İşletme Profili adı — öneri ve gerekçe

**Bugün:** `INDOLES Creative & E-Commerce Agency`
**Öneri:** `INDOLES`

**Gerekçe**

1. **Google'ın ad kuralı.** Yönerge: ad, işletmenin gerçek dünyadaki adını — tabelada, web sitesinde, antetli kâğıtta ve müşterinin bildiği biçimde — yansıtmalıdır; pazarlama sloganı ve hizmet/ürün bilgisi ada eklenemez. "Creative & E-Commerce Agency" bir hizmet tanımıdır; ada eklenmiş hizmet bilgisi yönerge ihlalidir ve profil için askıya alma ya da Google'ın adı kendisinin düzeltmesi riskidir. Rakipler de "düzenleme öner" ile bunu bildirebilir.
2. **Varlık tutarlılığı.** Sitenin Organization şemasında `name: "INDOLES"`, `legalName: "İndoles Yazılım A.Ş."`; sayfa başlıkları "INDOLES — …". GBP kaydı (`kgmid=/g/11lfqvny97`) sitede `sameAs` olarak bağlı (`company.ts` `profiles`). Ad uyuşmazlığı, Google'ın ve AI motorlarının iki kaydı aynı varlık olarak eşleştirmesini zayıflatır.
3. **Konum.** "Creative & E-Commerce Agency" INDOLES'i tek eksene (ticaret) ve bir ajans kategorisine sıkıştırıyor; P0 hizmetleri (CRO, yapay zeka danışmanlığı, GEO) addan hiç okunmuyor. Hizmet bilgisinin doğru yeri ad değil, kategori ve hizmet alanlarıdır (§6.1).

**Neden yasal unvan değil:** `İndoles Yazılım A.Ş.` gerçek bir ad ama müşterinin ve sitenin kullandığı ad değil; Google, ada yasal ek konmasını tabela, kartvizit, fatura gibi gerçek dünya kanıtına bağlıyor. Marka adı her yüzeyde zaten tutarlı.

**Uygulama sırası**

1. Adı değiştir; aynı gün başka alana dokunma — ad değişikliği incelemeye alınabilir ve yeniden doğrulama isteyebilir.
2. İnceleme bittikten sonra kategorileri ve açıklamayı §6.1'e göre güncelle.
3. Aynı hafta Bing Places, Apple Business Connect ve Yandex Business'ta adı ve açıklamayı eşitle (off-site plan Katman 1).

---

## 8. GBP gönderileri — ilk iki taslak

Kurallar: telefon numarası ve fiyat metne yazılmaz; düğme **Daha fazla bilgi**, bağlantı yazının adresi; emoji ve ünlem yok (`docs/03` §6c). Birinci gönderi, CRO yazısı canlıya çıktıktan **sonra** yayımlanır (yazı bu dalda, henüz deploy edilmedi).

### Gönderi 1 — CRO danışmanlığı fiyatları

```
CRO danışmanlığı neye mal olur?

Masada üç teklif olduğunu düşünün: biri aylık sabit ücret, biri dönüşüm artışından pay, biri tek seferlik denetim. Üçü farklı birimde fiyatlandığı için hangisinin pahalı olduğunu söylemek bile zor.

Fiyatı beş değişken belirler: test yapılabilecek trafik, ölçüm altyapısının onarım ihtiyacı, kapsam (denetim, test programı, uygulama), kazanan değişikliği kimin geliştireceği ve raporlama.

Yeni yazımızda beşini tek tek açtık, kendi fiyat listemizde hangi kalemin CRO'ya denk geldiğini yazdık ve bir teklifin kendini ödemesi için gereken artışı kendi trafiğiniz ve sipariş değerinizle nasıl hesaplayacağınızı gösterdik.
```

- Düğme: Daha fazla bilgi → `https://www.indoles.com.tr/tr/yazilar/cro-danismanligi-fiyatlari`

### Gönderi 2 — Yapay zeka dönüşümüne nereden başlanır

```
Yapay zeka dönüşümüne nereden başlanır?

Bir strateji belgesiyle değil, tek bir süreçte doksan gün süren bir pilotla. Yeni rehberimiz pilotu bloklara ayırıyor: hangi süreç seçilir, taban ölçüm pilottan önce nasıl alınır, başarı ve durdurma kriterleri nasıl yazılır, bütçe hangi kalemlerden oluşur.

KOBİ, sanayi ve ihracatçı şirketler ile büyük şirketler için neyin değiştiğini ayrı ayrı yazdık; doksanıncı günde ölçekleme kararının nasıl verileceğini de.
```

- Düğme: Daha fazla bilgi → `https://www.indoles.com.tr/tr/yazilar/ai-donusumune-nereden-baslanir-90-gunluk-pilot`

Ritim: ayda 2 gönderi (strateji §6), her biri o ayın yeni karar içeriğinden.

---

## 9. Müşteri yorumu isteme şablonu (TR)

Google kuralları (yasaklı ve kısıtlı içerik sayfası): yorum karşılığında teşvik — ödeme, indirim, ücretsiz hizmet — verilmez; olumsuz yorum caydırılmaz ve **yalnız memnun müşteriden seçerek** yorum istenmez; yorumun içeriği yönlendirilmez. Bu yüzden şablon **her kapanan projeye** gider, yalnız iyi gidenlere değil.

```
Konu: [Proje adı] hakkında kısa bir rica

Merhaba [Ad],

[Proje adı] çalışmasını birlikte tamamladık. Deneyiminizi Google'da paylaşırsanız, bizimle çalışmayı düşünen başka şirketlerin karar vermesine yardımcı olur. Olumlu ya da olumsuz, gerçek görüşünüz bizim için değerli.

Yorum bağlantısı: [GBP yorum bağlantısı]

İyi çalışmalar,
[Ad Soyad] — INDOLES
```

- Konu satırı 60 karakteri geçmez (`docs/03` §6b).
- Zamanlama: teslimden bir hafta sonra; en fazla bir hatırlatma, ilk mesajdan bir hafta sonra.
- Clutch için aynı ritüel: GBP bağlantısının yerine Clutch'ın yorum formu bağlantısı; Clutch'ın kendi doğrulama görüşmesi olabileceği müşteriye önceden söylenir.

---

## 10. Burak'a açık sorular

1. **Kuruluş yılı / GBP açılış tarihi** — `company.ts`te yok; Clutch, GoodFirms, Crunchbase ve LinkedIn soruyor.
2. **EN kategori tanımı** — sitede iki biçim var: ana sayfa başlığı "Business transformation studio", kanonik terim yazısı "business building studio". Kit ikincisini kullanıyor; hangisi tek biçim olsun?
3. **Çalışan sayısı aralığı** — `consultants.ts`te 10 kişi (marka brief'inde "8 kişi, doğrulanacak" notu var). LinkedIn "2-10", Clutch "10-49" kovasına düşer; teyit.
4. **Saatlik ücret** — sitede yayımlı değil. Clutch/GoodFirms'te boş mu kalsın, bir aralık mı girilsin?
5. **Clutch hizmet odağı yüzdeleri** — §6.3'teki dağılım öneri; gerçek iş karmasına göre düzeltilmeli.
6. **Hizmet adlarının EN karşılığı** — sitedeki yapay zeka hizmetinin EN adı "AI advisory", kitte "AI consultancy" (EN hedef kelime ve Clutch/GoodFirms kategori dili). Site adı da "AI consultancy" olsun mu, yoksa kit "AI advisory"ye mi dönsün?
7. **GBP birincil kategori** — *Marketing consultant* önerisi P0'ın ikisini taşıyor; yapay zekayı öne almak istersen *Business management consultant* birincil olabilir.

---

## 11. Uygulama kontrol tablosu

| Platform | Ad | Kısa | Uzun | Hizmet sırası | Kategori | Kanıt | Tarih |
|---|---|---|---|---|---|---|---|
| Google İşletme Profili | | — | | | | — | |
| Bing Places / Apple / Yandex | | — | | | | — | |
| LinkedIn | | slogan | | | | — | |
| Clutch | | | | | | | |
| GoodFirms | | | | | | | |
| Sortlist | | | | | | | |
| DesignRush | | | | | | | |
| Crunchbase | | | | — | | — | |
