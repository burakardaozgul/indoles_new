# Hedef Kelime ve Sorgu Önceliklendirmesi

> **Tarih:** 2026-08-27 · **Statü:** **Onaylı** — K-1, K-3, K-4, K-6 karara bağlandı (aşağıda); K-2, K-5, K-7, K-8 açık
> **Otoriteler:** `INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.6) · `Rakip-Analizi-P0-SERP.md` · `Keyword-Planner/*.csv` (245 kelime) · `docs/18` §6/§10 · `docs/19` §5/§9 · `tests/unit/keyword-coverage.test.ts`
> **Amaç:** Kelime evrenini, bugünkü sayfa envanterini ve rakip eşiklerini birleştirip "hangi kelime, hangi sırayla, hangi içerikle" sorusuna uygulanabilir cevap vermek.

---

## 1. Bugünkü Kapsama

### 1.1 Ölçüm yöntemi

Hedef, CSV'nin kendi `Hedef Sayfa` kolonudur. Taranan yüzey: `ServiceContent`'in HTML'e basılan **tüm** alanları (`name`, `seo.title`, `seo.description`, `lede`, `signals`, `scope.includes/excludes`, `method`, `deliverables`, `faq`). Normalizasyon `keyword-coverage.test.ts`'in `norm()` fonksiyonunun aynısı (İ/I/ı katlaması).

Bilinçli dışarıda: **`seo.entities`** (hiçbir bileşen render etmiyor — §9b) ve `slug` (URL, gövde değil). "Makale → X" hedefleri iki varyantla ölçüldü: geniş (16 makalenin tümü) ve katı (yalnız `topics.serviceSlug` eşleşen makaleler).

### 1.2 Sonuç ve Ağustos'a göre değişim

| Ölçüm | docs/18 (24 Ağu) | **Bugün** | Delta |
|---|---|---|---|
| Toplam kelime | 49/245 (%20) | **74/245 (%30)** | +25 |
| TR kelime | 44/214 (%21) | **59/214 (%28)** | +15 |
| TR hacim ağırlıklı | %49 | **%56** | +7 puan |
| EN kelime | 5/31 (%16) | **15/31 (%48)** | +10 |
| EN hacim ağırlıklı | %29 | **%79** | **+50 puan** |

EN'deki sıçrama tek başına C-12 (iki kelimenin yerleşmesi) + C-13 (regresyon testi) kalemlerinden geliyor.

> **Yöntem uyarısı:** docs/18 taradığı yüzeyi belgelemedi; iki ölçüm birebir aynı yöntemle üretilmedi. Geniş/katı varyantlar %26-30 aralığında çıkıyor — **yön ve büyüklük güvenilir, ondalık değil.**

### 1.3 En zayıf ve en güçlü kümeler

| Küme | Kelime kapsaması | Hacim kapsaması |
|---|---|---|
| **TR Lokal** | %0 | **%0** — tek 100-1B+Düşük kelime (`yazılım şirketi istanbul`) sahipsiz |
| **TR Dijital Dönüşüm** | %9 | **%22** |
| **TR Performans Pazarlama** | %32 | **%19** — 15.850/ay'lık en büyük havuz, en düşük kapsama |
| TR GEO Editoryal | %50 | %94 |
| EN-Yazılım | %75 | %97 |
| EN-AI | %71 | %94 |

### 1.4 Rakamın arkasındaki dört uyarı

| # | Bulgu |
|---|---|
| **U-1** | **Hacim kapsamasının yarısı dört kelimeden geliyor.** 36.600'ün 20.000'i `iş zekası`, `işletme mühendisliği`, `iş geliştirme`, `mobil uygulama geliştirme`'den. İlk ikisi §2.0 karar 5'in "öğrenci/kariyer niyeti" uyarısını taşıyor — **ticari niyetli gerçek kapsama, görünenden düşük** |
| **U-2** | **GEO kümesinin 7 yerleşmiş kelimesinin tamamı TEK makalede.** 2.700/ay'lık P0-trafik kümesi tek URL'de; Rakip §3 pencerenin daraldığını söylüyor |
| **U-3** | **Ticari niteleyici ailesi yalnız `faq[11]`'de yaşıyor.** Beş `ajansı` kelimesi de sayfanın son SSS'inde. Yerleşim kuralı gereği doğru, ama Poligon'un gücü "title birebir *CRO Ajansı*" — karşı-konumlandırma tek başına yetmez, **destek makalesi şart** |
| **U-4** | **`yapay-zeka` konusunda 0 makale.** 12 hizmetin 7'sinde "ilgili yazı" bloğu hiç render edilmiyor (C-02) |

### 1.5 Ucuz kazançlar — yazım/varyant boşlukları

Bunlar içerik üretimi değil, tek cümlelik eklemeler:

| Kelime | Hacim / Rekabet | Durum |
|---|---|---|
| **`yapay zeka optimizasyonu`** | 10-100 / Düşük — **GSC'de 136 gösterim** | Sitede **hiç yok**. Zaten gösterim alan sorgu karşılıksız |
| `ab testi nedir` | 100-1B / **Düşük** | Sitede "A/B testi nedir?" var; boşluksuz varyant eşleşmiyor |
| `e ticaret dönüşüm oranı artırma` | GSC'de var | C-07 kısa formu yerleştirdi; `e-ticaret` önekli tam form yok |
| `geo optimizasyonu` | veri yok | Makale "GEO" kısaltmasını kullanıyor, tam form yok |
| `ai overview nedir` | 10-100 / Düşük | `ai overviews` var, tekil "nedir" formu yok |
| `performance marketing` | 100-1B / Orta | Yalnız EN metinlerde; CSV bunu TR kelimesi olarak listeliyor |

---

## 2. Öncelik Matrisi — Üç Dalga

**Puanlama (0-11):** Hacim (1B-10B=3 / 100-1B=2 / 10-100=1) + Rekabet tersi (Düşük=2 / Orta=1 / Yüksek=0) + Gelir yakınlığı (P0-müşteri=3 / P0-trafik=2 / P1=1 / P2=0) + Tohum veya boş SERP (2/1/0) + Kariyer-niyet cezası (−2).

### Dalga 1 — Launch + ilk 30 gün

Ortak özellik: hepsinin ya GSC tohumu var, ya SERP'i boş, ya rekabeti Düşük. Hiçbiri sıfırdan otorite kurmayı gerektirmiyor.

| # | Kelime | Hacim / Rekabet | Hedef / üretilecek içerik | Durum | Neden şimdi |
|---|---|---|---|---|---|
| 1 | `dönüşüm optimizasyonu` | 100-1B / **Düşük** | `/hizmetler/cro` + **h.1-1 CRO rehberi** | VAR, test korumalı | GSC'nin en güçlü tohumu (192 gösterim, poz. 15); Poligon'un üstüne çıkma hedefi |
| 2 | `cro ajansı` | GSC: 80 gösterim, poz. 13 | `/hizmetler/cro` + **h.2-1 BOFU** | VAR ama yalnız `faq[11]` | "En hızlı kazanılabilir müşteri kelimesi"; tek yüzey yetmez |
| 3 | `yapay zeka ajansı` | 100-1B / **Düşük** | `/hizmetler/ai-danismanlik` + **h.2-2 BOFU** | VAR (C-01 ile kendi sorusunu aldı) | Rakip §4 eşiği **Top-5**; ajans katmanı ince içerikli |
| 4 | `yapay zeka danışmanlığı` | 100-1B / Orta | `/hizmetler/ai-danismanlik` | VAR — title+desc+lede+faq | P0-müşteri baş terimi |
| 5 | `google ai overviews` | 100-1B / **Düşük** | **h.7-2 — öne çekilir** | Yalnız GEO makalesinin SSS'inde | Kümenin en düşük rekabetli 100-1B kelimesi; pencere daralıyor |
| 6 | `llms.txt` | 100-1B / **Düşük** | **h.10-2 — öne çekilir** | Yalnız SSS'te | TR'de kanonik içerik yok. **Kendi uygulamamız vaka olur** (G-11) |
| 7 | `generative engine optimization` | 100-1B / Orta | GEO rehberi (makalenin bölünmesi) | VAR | Rakip §4 eşiği: "kanonik içerik olmak" |
| 8 | `ai seo` + `yapay zeka seo` | 100-1B ×2 / Orta | Aynı rehber | VAR (aynı tek makale) | 1.000/ay, boş TR SERP |
| 9 | `yapay zeka optimizasyonu` | 10-100 / Düşük — **GSC 136** | GEO rehberi | **YOK** | Zaten gösterim alan sorgu sitede hiç yok — en ucuz kazanç |
| 10 | `ab testi nedir` | 100-1B / **Düşük** | **h.5-1** | **YOK** (yazım varyantı) | §2.0 karar 3 bunu h.5'in ana kelimesi ilan etmişti |
| 11 | `e ticaret danışmanlığı/danışmanı/ajansı` | 100-1B ×3 / Orta | `/hizmetler/e-ticaret` | VAR, test korumalı | 1.500/ay üçlü; C-11 çakışması burada çözülmeli |
| 12 | `iş geliştirme` | **1B-10B** / **Düşük** | `/tr/hizmetler` | VAR (C-05 ile tek hedef) | En büyük alınabilir hacim; iş **izleme**, ekleme değil |

**Dışarıda:** `performans pazarlama ajansı` (tohum yok) · `mobil uygulama geliştirme` (en rekabetçi) · `iş zekası`/`işletme mühendisliği` (kariyer-çöp, zaten yerleşmiş).

### Dalga 2 — 30-90 gün

| # | Kelime | Hacim / Rekabet | Hedef / içerik | Durum |
|---|---|---|---|---|
| 1 | `iş geliştirme stüdyosu` + `iş inşası` | veri yok | **h.4-2 kategori manifestosu** | **YOK** — §5'in kanonik tanım kaldıracı |
| 2 | `google reklam ajansı` + `dijital reklam ajansı` | **1B-10B ×2** (10.000/ay) | **YENİ SLOT: reklam ajansı seçim rehberi (h.7)** | ✅ K-1 onaylandı — makale yüzeyi, hizmet sayfasına girmez |
| 3 | `yazılım danışmanlığı` | 100-1B / **Düşük** | `/hizmetler/teknoloji-ve-altyapi` + h.11-1 | **YOK** |
| 4 | `it danışmanlığı` | 100-1B / Orta | Aynı sayfa | **YOK** |
| 5 | `mvp nedir` | **1B-10B** / **Düşük** | **h.12-1** + MVP Build paketi | Hizmet SSS'inde var, kanonik hedefinde yok → **K-5** |
| 6 | `iş geliştirme nedir` | 100-1B / **Düşük** | **h.6-2** ("işletmeler için" açısıyla) | **YOK** — kariyer trafiği bilinçli dışlanır |
| 7 | `dijital dönüşüm nedir` | 100-1B / **Düşük** | Yeni makale → dijital-donusum | En zayıf küme (%9 / %22) |
| 8 | `shopify` + `trendyol danışmanlığı` | 100-1B ×2 / Orta | `/hizmetler/e-ticaret` + pazaryeri makalesi | Marka adları var, "danışmanlığı" formu yok |
| 9 | `cac nedir` | 100-1B / **Düşük** | **h.9-1** | **YOK** (`roas nedir`, `ltv nedir` yerleşmiş) |
| 10 | `performans pazarlama ajansı` | 100-1B / Orta | Mevcut sayfa + destek makalesi | VAR, test korumalı |
| 11 | `yönetim danışmanlığı` + `kurumsal danışmanlık` | 100-1B ×2 | h.6-2 karşılaştırma bölümü | **YOK** → **K-2** |

### Dalga 3 — 90 gün+ / EN

v1.6'nın üç EN kümesi korunuyor (AI + Yazılım + GEO, ~2.150/ay).

| # | Kelime | Hacim / Rekabet | Hedef | Durum |
|---|---|---|---|---|
| 1-3 | `ai consultancy` · `artificial intelligence consulting` · `digital transformation consultancy` | 100-1B ×3 / Orta | EN hizmet sayfaları | VAR, test korumalı |
| 4 | **`custom software development company`** | 100-1B / **Düşük** | `/en/services/custom-software-development` | VAR (`faq[11]`) — **`ux agency london` düştükten sonra EN'in tek 100-1B+Düşük kelimesi** |
| 5 | `software development agency` | 100-1B / Orta | Aynı sayfa | VAR |
| 6-7 | `generative engine optimization` · `ai search optimization` + `chatgpt seo` | 100-1B, 10-100 ×2 | EN GEO rehberi | VAR — §7 F3: "EN'de oyun GEO'dan açılır" |
| 8 | `geo optimization` | 10-100 / Orta | EN GEO rehberi | v1.5'te bilinçli bırakıldı; bölünmeyle doğal yeri açılır |
| 9 | `mvp development agency` | 10-100 / Orta | **MVP Build paketi (EN)** | Kanonik hedefinde yok (C-10'a bağlı) |
| 10 | `ai transformation consulting` + `ai implementation services` | 10-100 ×2 | EN makale dalgası (F2) | Bilinçli bırakılmış |
| 11 | `yazılım şirketi istanbul` | 100-1B / **Düşük** | Hizmet sayfası içi lokal bölüm + GBP | Lokal küme **%0** |

**Dışarıda:** `mobile app development company` (tek Yüksek rekabet) · **EN-UX — K-6 ile resmen kapatıldı** · EN-CRO · EN-Ticaret.

---

## 3. İçerik Takvimi — Yeniden Sıralama

### Üç yapısal hamle

| Hamle | Gerekçe |
|---|---|
| **A — AI slotları en öne** | `yapay-zeka` 0 makale; 12 hizmetin 7'sinde ilgili-yazı bloğu render edilmiyor. **h.1-2 ve h.2-2 → hafta 1-2** |
| **B — GEO slotları öne + tek makale bölünüyor** | Rakip §3 penceresi daralıyor; U-2: 2.700/ay tek URL'de. **h.7-2 → hafta 1, h.10-2 → hafta 2** |
| **C — Üç dolu slot yeniden atanıyor** | h.7-1 ve h.8-1 zaten yayında; h.9-2 tek başına 6 kelime taşıyor → bölme kendi slotunu hak ediyor |

### Yeni sıralama

| Hafta | İçerik 1 (ticari) | İçerik 2 (otorite/GEO) |
|---|---|---|
| **1** | AI dönüşümü nedir? Uçtan uca rehber ← h.1-2 | Google AI Overviews'da yer almak ← h.7-2 |
| **2** | AI danışmanı seçerken 12 soru ← h.2-2 | llms.txt nedir — **kendi uygulamamız vaka** ← h.10-2 |
| **3** | CRO nedir? Kapsamlı rehber ← h.1-1 | **YENİ:** GEO kanonik rehberi — mevcut makale **aynı slug'da kalır**, derinleştirilir (poz. 38 tohumu korunur) |
| **4** | CRO ajansı nasıl seçilir ← h.2-1 | İş inşası manifestosu ← h.4-2 |
| **5** | E-ticaret dönüşüm benchmark'ları ← h.4-1 | AI dönüşümüne nereden başlanır ← h.3-2 |
| **6** | Dönüşüm oranı nasıl artırılır: 21 taktik ← h.3-1 | AI dönüşümünde ROI ← h.5-2 |
| **7** | **YENİ:** Reklam ajansı seçim rehberi (K-1) | **YENİ:** Markanızın AI görünürlüğü nasıl ölçülür |
| **8** | A/B testi kurulumu ← h.5-1 | İş geliştirme danışmanlığı nedir? ← h.6-2 |
| **9** | ROAS + CAC ← h.6-1 | Türk sanayisinde AI ← h.8-2 |
| **10** | UX denetimi ← h.9-1 | İş otomasyonu nereden başlar ← h.11-2 |
| **11** | UI/UX ajansı seçim rehberi ← h.10-1 | Özel yazılım mı hazır çözüm mü ← h.11-1 |
| **12** | MVP nasıl kapsamlanır ← h.12-1 | Sepet terk oranı düşürme ← h.12-2 |

**Silinen (zaten yayında):** h.7-1 (landing page) · h.8-1 (CAC-LTV).
**Yeni slotlar:** reklam ajansı rehberi (10.000/ay havuz, makale yüzeyi olduğu için premium filtre delinmiyor) · AI görünürlük ölçümü (§5'in aylık rutininin kamuya açık versiyonu — zaten yapılacak iş, bedava içerik).
**Ertelendi (13+):** Shopify/Trendyol pazaryeri · lokal İstanbul bölümü · mobil uygulama fiyatları.

---

## 4. Ölçüm Çerçevesi

### Dalga bazında ara hedefler

| Dönem | Gösterim | CTR | Sıralama | Alt huni |
|---|---|---|---|---|
| **Dalga 1 · 0-30 gün** | 2K → **5-7K/ay** | ≥%1,2 | Tohumlar korunuyor (poz. 15±3, 38±5) | `brief_submitted` >0 |
| **Dalga 2 · 30-90 gün** | **8-15K/ay** | >%1,8 | `dönüşüm optimizasyonu` top-10 · GEO'da ≥3 kelime ilk 2 sayfa · **3+ kelime ilk sayfa** | 10-25 lead · 3-6 görüşme |
| **Dalga 3 · 90 gün+** | **15-25K/ay** | >%2 | **10+ kelime ilk sayfa** · EN payı >%10 · GEO prompt setinde ≥3/10 atıf | 800-1.500 oturum · **≥1 müşteri** |

### GSC'de izlenecek beş grup

| Grup | Filtre | Baz çizgisi |
|---|---|---|
| **G1 CRO** | `dönüşüm`, `cro`, `a/b test`, `sepet terk` | 192 gösterim/poz. 15 · 80/poz. 13 |
| **G2 AI** | `yapay zeka`, `ai ` | `ai dönüşümü` poz. 39 |
| **G3 GEO** | `geo`, `ai seo`, `ai overview`, `llms`, `arama optimizasyonu` | 99 + 136 + 32 gösterim · eski yazı 359/poz. 38 |
| **G4 Kategori** | `iş geliştirme`, `iş inşası`, `iş modeli` | 1B-10B |
| **G5 EN** | Ülke ≠ TR, EN sayfalar | Bugün "ABD gösterim çöpü" |

**Ayrı raporlanacak (KPI'dan düşülecek) — ✅ K-4 kararı:** `iş zekası` + `işletme mühendisliği` = 10.000/ay kariyer niyetli. Bu sorgular 15-25K gösterim hedefine **sayılmaz**, ayrı satırda izlenir. Aksi halde eşik yapay dolar ve A-4 alarmı hiç çalmaz.

### Alarm eşikleri

| # | Alarm | Eşik | Aksiyon |
|---|---|---|---|
| **A-1** | 301 bütünlüğü | Cutover +14 gün, G1 veya G3 gösterimi launch öncesinin **%50 altında** | Ek A haritasını satır satır doğrula |
| **A-2** | İndeksleme | 3. hafta, sitemap'in **<%80'i** indeksli | GSC URL denetimi + `seo:audit` |
| **A-3** | CTR | Bir sayfa **poz. <10 ve CTR <%1** | `seo.title`/`description` yeniden yazılır |
| **A-4** | Gösterim eğrisi | 3. ay **<8K/ay** | **Strateji revizyonu** (§9'un kendi eşiği) |
| **A-5** | GEO penceresi | Ay 2, 10 promptun **0'ında** geçmiyoruz | GEO kümesi yeniden yapılandırılır |
| **A-6** | Kanibalizasyon | Aynı sorguda iki INDOLES URL'i | Biri hedeften düşürülür (C-11 açık risk) |
| **A-7** | Yerleşim regresyonu | `keyword-coverage.test.ts` kırmızı | Merge bloklanır |

### Rutin

Haftalık: G1-G5 gösterim/pozisyon + A-3 taraması · İki haftada bir: yeni makalelerin indekslenmesi · Aylık: §5'in 10 promptluk GEO turu + Rakip §4'ün dört eşiği · 90. gün: tam rapor → strateji revizyonu.

---

## 5. Burak'ın Kararı Gereken Sekiz Nokta

| # | Karar | Gerilim | Öneri |
|---|---|---|---|
| **K-1** | Reklam havuzu (10.000/ay) | Premium filtre ↔ en büyük ticari havuz | ✅ **KARAR: makale yüzeyiyle hedeflenecek.** Hafta 7'deki "reklam ajansı seçim rehberi" slotu onaylandı. Hizmet sayfalarına girmez — §1 ilke 4 korunur, fiyat avcısını eleyen dille yazılır |
| **K-2** | `yönetim danışmanlığı` + `kurumsal danışmanlık` (1.000/ay) | Premium filtre ↔ hacim | Sayfaya değil, h.6-2'nin karşılaştırma bölümüne |
| **K-3** | GEO makalesi bölünsün mü? | Bölme kısa vadede sinyali seyreltir ↔ tek nokta arızası + daralan pencere | ✅ **KARAR: bölünecek — 3 ayrı yazı.** Kanonik GEO rehberi kalır; "AI Overviews'da yer almak" (h.7-2) ve "llms.txt nedir" (h.10-2) ayrı yazılar olur. **Uygulama notu:** mevcut URL poz. 38'de tohum taşıyor — kanonik rehber **aynı slug'da kalmalı**, iki yeni yazı yeni URL alır; eski sinyal korunur |
| **K-4** | Kariyer-niyetli hacim KPI'dan düşülsün mü? | Hedef kolaylaşır ↔ rakam anlamsızlaşır | ✅ **KARAR: KPI'dan düşülecek, ayrı raporlanacak.** `iş zekası` + `işletme mühendisliği` gösterimleri 15-25K hedefine sayılmaz. Aksi halde eşik yapay olarak dolar ve §9'un 3. ay alarmı (A-4) hiç çalmaz |
| **K-5** | Paketlere `seo` bloğu (C-10) | Küçük kod işi ↔ `mvp nedir` sahipsiz | *(Ayrı analizde bu öneri değişti — aşağıdaki nota bakınız)* |
| **K-6** | EN-UX kümesi kapatılsın mı? | Kalan 3 kelime 10-100, kapsama %8 | ✅ **KARAR: resmen kapatıldı.** EN odağı üç kümede yoğunlaşır (AI + Yazılım + GEO). Londra/UK varlığı teyit edilirse ADR ile yeniden açılır |
| **K-7** | Persona B zamanlaması | Cutover sonrası ↔ "Google ilk taramada ne görürse onu indeksler" | Dalga 1 baz çizgisi ticaret kopyası olmadan alınacak — **bu şartla kaydedilmeli** ki sonra kıyaslanabilsin |
| **K-8** | Silinen iki slot onayı (h.7-1, h.8-1) | — | İkisi de fiilen yayında; kapasite yeni slotlara aktarıldı |

> **K-5 hakkında düzeltme (2026-08-27):** Bu analiz `mvp nedir`i paket sayfasına bağlamayı önerdi, ancak CSV'nin kendi hedef kolonu o kelime için **"Makale → MVP Build paketi"** diyor — yani kanonik hedef makale, paket değil. Paket sayfasının kendi hedefleri (`mvp geliştirme`, `mvp development agency`) 50/ay bandında. Ayrıca paket başlıkları formülle üretiliyor (`descriptor` + süre + fiyat) ve bu formül fiyat değiştiğinde otomatik güncelleniyor — elle yazılan başlık eskir. **Sonuç: C-10 "açmayalım" olarak kapatılması önerilir**; `mvp nedir` h.12-1 makalesiyle alınır. Ayrıntı `docs/19` §5.

---

## 6. Ölçüm Yapılamayan / Veri Eksik Alanlar

| Alan | Durum |
|---|---|
| **"veri yok" bandı** | TR'de **85/214 kelime (%40)** — içinde `cro ajansı`, `iş geliştirme stüdyosu`, `sepet terk oranı düşürme` var. Hacim tahmini **üretilmedi**; GSC gösterimi tek gerçek sinyal olacak |
| **Bant genişliği** | CSV bantları 10 katlık aralıklar. Hacim ağırlıklı yüzdeler **sıralama içindir, mutlak öngörü değil** |
| **GSC verisi donmuş** | §0'daki 22 tıklama / 2.190 gösterim / poz. 17 ölçümü **2026-08-20** tarihli; o günden beri güncel çekim yok |
| **Rakip pozisyonları** | Rakip-Analizi'nin kendi notu: "yaklaşık temsil; launch sonrası GSC ile doğrulanır" |
| **Paket yüzeyi** | `packages.ts`'te `seo` bloğu yok → 4 paketin keyword yüzeyi ölçülemedi |
| **Bing / IndexNow / GBP** | Kurulum durumu bilinmiyor. GEO ölçümünün yarısı Bing'e bağlı (§3 madde 6) |
| **EN vaka yüzeyi** | 9 EN vaka URL'i Türkçe slug taşıyor (`types.ts:141`) — EN ölçümünde vaka yüzeyi güvenilir değil |
| **GEO'nun GSC'si yok** | Manuel prompt seti dışında yöntem yok; baz çizgisi alınmadı (G-10) |
| **Format riski (kelime değil)** | Makale H2'lerinin yalnız **%14,8'i** soru formunda. §1 ilke 2'nin "Q&A-formatlı H2" şartı karşılanmıyor — bu bir **alıntılanabilirlik** sorunu ve yukarıdaki hiçbir dalga bunu tek başına çözmez |
