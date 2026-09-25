# Niyetli Sorgu Seti — satın alma niyetli görünürlük (Faz 1)

> **Tarih:** 2026-09-25 · **Statü:** Faz 1 ölçüm işi — kural ve set Burak onayına açık
> **Karar dayanağı:** Burak, 2026-09-25 — SEO/GEO'nun ana amacı işin ve değerin farkında olan, doğrudan çalışmak isteyen alıcının önüne çıkmak; genel ve rekabetli kelimelerde güç harcanmaz. Yol haritası: `Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md`. Strateji: `INDOLES-Organik-Strateji-SEO-GEO-v1.md` v1.18 §1 ve §9.
> **Veri:** `Keyword-Planner/keyword-hacim-birlesik.csv` (GKP bandı ve rekabet) · GSC `haftalik-2026-09-22` (`sorgular.csv`, `sorgu-sayfa.csv`; pencere 22 Ağu–19 Eyl, `dataState=final`)
> **Kod:** `scripts/gsc-pull.mjs` N0 bloğu · regresyon: `scripts/gsc-kumeler.test.ts`

Bu doküman iki şey tanımlar: **hangi sorgunun satın alma niyetli sayıldığı** (N0 kuralı, §1) ve **hedef çekirdek olarak izlenen 43 sorgu** (§2). Haftalık ölçüm kurala göre yapılır, sete göre değil: set önceden tahmin edilebilen sorgulardır, alıcı ise GSC'de görüldüğü gibi her hafta yeni bir konuşma biçimiyle arıyor. Setteki her sorgunun N0'a ve doğru hizmete düştüğü testle sabitlenmiştir.

---

## 1. Kural — bir sorgu ne zaman niyetli sayılır

Bir sorgu **N0 satın alma niyeti** kümesine girer ⇔ üç koşul birlikte tutar:

| # | Koşul | İçerik |
|---|---|---|
| 1 | **Niteleyici** taşır | ajans(ı) · danışman / danışmanı / danışmanlığı · firma(sı/ları) · şirketi / şirketleri · uzman(ı/ları) · hizmet(i/leri) · fiyat · ücret (ama "ücretsiz" değil) · maliyet · nasıl seçilir · önerir misin · tavsiye · kim yapar · en iyi / en başarılı … kimlerdir / hangisidir |
| 2 | **Hizmet terimi** taşır | GEO (geo, görünür/görünmek, yapay zeka motorları, ai/yapay zeka seo, llms, ChatGPT'de) · CRO (cro, dönüşüm oranı, dönüşüm optimizasyonu, a/b test, sepet terk) · Yapay zeka (yapay zeka, ai, llm) · UX (ux, ui, kullanıcı deneyimi, arayüz) · E-ticaret (e-ticaret, Shopify, Trendyol, ikas, pazaryeri, e-ihracat) · Dijital dönüşüm (dijital dönüşüm, dijitalleşme, endüstri 4.0/5.0) |
| 3 | **Dışlama** tutmaz | genel reklam/pazarlama ajansı (reklam, pazarlama ajansı, dijital ajans, performans ajansı, sosyal medya, google ads, growth hacking) · kariyer/öğrenci (maaş, ilan, kariyer, staj, nasıl olunur, kurs, sertifika, üniversite) · araç niyeti (araç/aracı, tool) |

**Alt kırılım — ilk eşleşen kazanır:** GEO → CRO → Yapay zeka → UX → E-ticaret → Dijital dönüşüm. İki hizmet terimi taşıyan sorgu P0'a yazılır; "yapay zeka motorlarında görünür kılacak ajans" GEO'dur (G3'ün G2'ye önceliğiyle aynı mantık), "e-ticaret dönüşüm oranı ajansı" CRO'dur.

**İlk 10:** ağırlıklı ortalama pozisyon ≤ 10,0. 10,4'teki "ux ajansı" ve "yapay zeka danışmanlığı" bugün sayılmıyor.

**Kelime sınırı:** Türkçe harflerde `\b` çalışmadığı için sınırlar Unicode harf sınıfıyla çizildi — "şirketimde" niteleyici değildir, "microsoft" CRO değildir.

**Kapsam TR'dir.** EN sorgular ("artificial intelligence consultant", "e-commerce consultancy") N0'a sayılmaz: EN'e F2 dalgasına kadar yatırım yok ve G5 TR dışını ayrıca izliyor. Hizmet sayfası gösterim payı ise sayfa ölçüsüdür ve `/en/services/*`'i içerir (§4).

---

## 2. Set — 43 hedef sorgu

Kolonlar: **GKP** = `keyword-hacim-birlesik.csv` bandı / rekabet ("veri yok" = GKP hacim üretmedi; "ölçülmedi" = listede yok). **GSC** = 22 Ağu–19 Eyl gösterim / ağırlıklı pozisyon. **Sıralanan sayfa** = bugün o sorguda görünen INDOLES URL'i (hedef sayfa değilse not düşüldü).

### 2.1 P0 — CRO → `/tr/hizmetler/cro`

| # | Sorgu | GKP | GSC | Sıralanan sayfa |
|---|---|---|---|---|
| 1 | cro ajansı | veri yok | **14 / 9,1** | `/tr/yazilar/cro-ajansi-nasil-secilir` (9 / 6,2) + eski `/cro-donusum-orani-optimizasyonu/` (5 / 14,4) — hizmet sayfası değil |
| 2 | cro danışmanlığı | veri yok | görünmüyor | — |
| 3 | cro uzmanı | veri yok | görünmüyor | — |
| 4 | cro ajansı istanbul | veri yok (Lokal) | görünmüyor | — |
| 5 | dönüşüm oranı optimizasyonu hizmeti | ölçülmedi (baz: "dönüşüm oranı optimizasyonu" 10-100 / Düşük) | görünmüyor | — |
| 6 | dönüşüm oranlarını artırmak için türkiye'deki en iyi cro uzmanları kimlerdir? | ölçülmedi (GSC konuşma biçimi) | 6 / 46,7 | `/tr/yazilar/cro-ajansi-nasil-secilir` |
| 7 | cro ajansı nasıl seçilir | ölçülmedi | görünmüyor | — (karşılık yazısı var: `cro-ajansi-nasil-secilir`) |
| 8 | cro ajansı fiyatları | ölçülmedi | görünmüyor | — (yol haritası Faz 1: "neye mal olur" yazısı) |

### 2.2 P0 — Yapay zeka danışmanlığı → `/tr/hizmetler/ai-danismanlik`

| # | Sorgu | GKP | GSC | Sıralanan sayfa |
|---|---|---|---|---|
| 9 | yapay zeka danışmanlığı | 100-1B / Orta | 5 / 10,4 | `/tr/hizmetler/ai-danismanlik` |
| 10 | yapay zeka danışmanı | 100-1B / Orta | 1 / 33,0 | `/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru` |
| 11 | yapay zeka ajansı | 100-1B / **Düşük** | görünmüyor | — |
| 12 | yapay zeka firmaları | 100-1B / Orta | görünmüyor | — |
| 13 | yapay zeka şirketleri türkiye | 10-100 / Düşük | görünmüyor | — |
| 14 | ai danışmanlığı | veri yok | 1 / 26,0 | `/tr/hizmetler/ai-danismanlik` |
| 15 | yapay zeka danışmanı nasıl seçilir | ölçülmedi | görünmüyor | — (karşılık yazısı var: `ai-danismani-secerken-sorulacak-12-soru`) |
| 16 | yapay zeka danışmanlığı fiyatları | ölçülmedi | görünmüyor | — (yol haritası Faz 2) |
| 17 | büyük danışmanlık firması vs butik yapay zeka ajansı farkları | ölçülmedi (GSC konuşma biçimi) | **1 / 7,0** | `/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru` (yol haritası Faz 2: "ajans mı danışmanlık mı") |

### 2.3 P0 — GEO / yapay zeka görünürlüğü → `/tr/hizmetler/geo-danismanligi` (paralel işte açılıyor)

GKP bu kümeyi ölçmedi; baz terimler "ai seo" ve "yapay zeka seo" 100-1B / Orta. Hizmet sayfası bugün yok — kümenin en güçlü niyetli sorgusu AI yazısında sıralanıyor.

| # | Sorgu | GKP | GSC | Sıralanan sayfa |
|---|---|---|---|---|
| 18 | geo ajansı | ölçülmedi | görünmüyor | — |
| 19 | geo danışmanlığı | ölçülmedi | görünmüyor | — |
| 20 | yapay zeka görünürlüğü danışmanlığı | ölçülmedi | görünmüyor | — |
| 21 | chatgpt'de görünmek için danışman | ölçülmedi | görünmüyor | — |
| 22 | şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin | ölçülmedi (GSC konuşma biçimi; "?"li ve "?"siz iki yazım) | **21 / 6,4** (14 / 6,0 + 7 / 7,1) | `/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru` — hizmet sayfası yok |
| 23 | yapay zeka motorlarında görünürlük kazandıran en başarılı geo hizmeti hangisidir? | ölçülmedi (GSC konuşma biçimi) | 1 / 23,0 | `/tr/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz` |
| 24 | geo ajansı nasıl seçilir | ölçülmedi | görünmüyor | — (yol haritası Faz 1 yazısı) |
| 25 | yapay zeka seo ajansı | ölçülmedi (baz: "yapay zeka seo" 100-1B / Orta) | görünmüyor | — |

### 2.4 P1 — E-ticaret danışmanlığı → `/tr/hizmetler/e-ticaret`

| # | Sorgu | GKP | GSC | Sıralanan sayfa |
|---|---|---|---|---|
| 26 | e ticaret danışmanlığı | 100-1B / Orta | görünmüyor | — |
| 27 | e ticaret danışmanı | 100-1B / Orta | görünmüyor | — |
| 28 | e ticaret ajansı | 100-1B / Orta | görünmüyor | — |
| 29 | shopify danışmanlığı | 100-1B / Orta | görünmüyor | — |
| 30 | trendyol danışmanlığı | 100-1B / Orta | görünmüyor | — |
| 31 | ikas danışmanlığı | veri yok | görünmüyor | — |
| 32 | pazaryeri danışmanlığı | 10-100 / Orta | görünmüyor | — |

### 2.5 P1 — Dijital dönüşüm danışmanlığı → `/tr/hizmetler/dijital-donusum`

| # | Sorgu | GKP | GSC | Sıralanan sayfa |
|---|---|---|---|---|
| 33 | dijital dönüşüm danışmanlığı | 100-1B / Orta | görünmüyor | — |
| 34 | dijital dönüşüm danışmanı | 100-1B / Orta | görünmüyor | — |
| 35 | dijital dönüşüm ajansı | 10-100 / Orta | görünmüyor | — |
| 36 | dijital dönüşüm hizmetleri | 10-100 / Orta | görünmüyor | — |
| 37 | endüstri 4.0 danışmanlığı | veri yok | görünmüyor | — |

### 2.6 P1 — UX → `/tr/hizmetler/ui-ux-tasarim`

| # | Sorgu | GKP | GSC | Sıralanan sayfa |
|---|---|---|---|---|
| 38 | ux ajansı | 10-100 / Orta | 21 / 10,4 | eski `/web-tasarim-ui-ux-tasarimi/` — yeni hizmet sayfası değil |
| 39 | ui ux ajansı | 10-100 / Düşük | görünmüyor (varyant "ankara ui ux ajansı" 3 / 36,3) | — |
| 40 | ui ux tasarım ajansı | veri yok | görünmüyor | — |
| 41 | ux danışmanlığı | veri yok | görünmüyor | — |
| 42 | ui ux tasarım firmaları | 10-100 / — | görünmüyor | — |
| 43 | web sitemin satış kaçıran noktalarını bulan en iyi ux analiz firması hangisidir? | ölçülmedi (GSC konuşma biçimi) | 3 / 28,0 | eski `/web-tasarim-ui-ux-tasarimi/` |

### 2.7 Özet

| Hizmet | Öncelik | Setteki sorgu | GSC'de görünen | İlk 10'da |
|---|---|---|---|---|
| CRO | P0 | 8 | 2 | 1 (cro ajansı) |
| Yapay zeka danışmanlığı | P0 | 9 | 4 | 1 (büyük danışmanlık firması vs butik yapay zeka ajansı) |
| GEO / yapay zeka görünürlüğü | P0 | 8 | 2 | 1 (şirketimi … önerir misin — iki yazımı da ilk 10'da) |
| E-ticaret danışmanlığı | P1 | 7 | 0 | 0 |
| Dijital dönüşüm danışmanlığı | P1 | 5 | 0 | 0 |
| UX | P1 | 6 | 2 | 0 (ux ajansı 10,4 — sınırda) |
| **Toplam** | | **43** | **10** | **3** |

Sınırdaki iki sorgu ("ux ajansı" 10,4 ve "yapay zeka danışmanlığı" 10,4) ilk 10'a girdiğinde set 5'e, N0 kümesi 6'ya çıkar.

---

## 3. Dışarıda bırakılanlar

| Grup | Örnekler (GKP bandı veya GSC gösterim / poz) | Gerekçe |
|---|---|---|
| **Genel reklam ve pazarlama ajansı** | dijital reklam ajansı (1B-10B / Orta) · google reklam ajansı (1B-10B / Orta) · google ads ajansı, meta / instagram reklam ajansı (100-1B / Orta) · performans pazarlama ajansı (100-1B / Orta) · GSC: dijital performans ajansı (3 / 20), growth hacking ajansı (2 / 14,5), entegre pazarlama ajansı (1 / 43), sosyal kanıt ajansı (3 / 23) | Burak kararı (2026-09-25). Rekabet ve teklif maliyeti en yüksek havuz, yeni alan adıyla ilk sayfa beklenmez; bu alıcı INDOLES'in P0 hizmetini değil genel bir ajansı arıyor. Kural bu kelimeleri hizmet terimi taşısalar bile dışlar ("yapay zeka destekli dijital reklam ajansı"). K-1 reklam ajansı rehberi öncelikten düştü (strateji v1.18) |
| **Baş kelimeler** | mvp nedir, iş geliştirme, mobil uygulama geliştirme (1B-10B) | Satın alma niyeti taşımıyor, 25 Eylül analizinde hepsi sıfır gösterim. "mvp nedir" slotu öncelikten düştü (strateji v1.18) |
| **Öğrenci / kariyer niyeti** | iş zekası, işletme mühendisliği (1B-10B; K-4 ile zaten KPI dışı) · "cro uzmanı maaş" türü iş unvanı sorguları | "uzmanı" bir iş unvanıdır da; kural maaş/ilan/kariyer/kurs sorgularını dışlar |
| **Bilgi niyeti (niteleyicisiz)** | cro nedir (7 / 25), geo optimizasyonu (22 / 11,6), yapay zeka arama optimizasyonu (72 / 32,8), teknik geo optimizasyonu nasıl yapılır (19 / 14,8) | Destek içeriğinin işi; G1-G3 kümelerinde izlenmeye devam eder, N0'a sayılmaz |
| **Hizmet terimi taşımayan karar sorguları** | hangi ajansla çalışmalıyım (19 / 11,5) · bunu yapan ajans hangisi (1 / 18) · ajansa sorulacak sorular (1 / 4) | Alıcı dili taşıyor ama hangi hizmeti aradığı belli değil; sıralanan sayfa genel "pazarlama ajansı seçmek" yazısı. Sayılırsa ölçü genel ajans havuzuna geri açılır. Bağlam olarak izlenir — bkz. §5 açık soru |
| **Araç niyeti** | türkçe geo aracı var mı (28 / 2,5), yerli geo aracı (27 / 1,2), ücretsiz geo aracı var mı (3 / 2,7), en iyi geo aracı hangisi (1 / 9) | Hizmet değil ücretsiz araç arıyor; araç sayfaları kendi kelimelerini taşır (v1.11, A-6). "ücretsiz" fiyat niteleyicisi sayılmaz |
| **EN sorgular** | artificial intelligence consultant (1 / 8) · e-commerce consultancy (1 / 58) · what questions should i ask an ai transformation consultant before signing (3 / 10,7) | EN'e F2'ye kadar yatırım yok; G5 ayrı izliyor |
| **P2 hizmetler** | yazılım danışmanlığı, bilişim danışmanlığı (100-1B / Düşük) · it danışmanlığı (100-1B / Orta) | Yol haritasında P2; set ve N0 alt kırılımı dışında |

---

## 4. Baz çizgisi (22 Ağu–19 Eyl)

Kaynak: `node scripts/gsc-pull.mjs --from-dir "<Marketing>/GSC-Data/haftalik-2026-09-22" --out /tmp/niyet-baz`. Gerçek `GSC-Data/` klasörüne yazılmadı.

| Ölçü | Baz | 30 Kasım hedefi |
|---|---|---|
| Niyetli sorgu (N0) | 15 sorgu / 84 gösterim / 0 tık / ort. poz 16,45 | — |
| Görünen sorgu gösterimindeki payı | %11,35 (84 / 740) | — |
| Toplam gösterimdeki payı (anonim dahil) | %3,75 (84 / 2.242) | — |
| **İlk 10'daki niyetli sorgu** | **4** | **12+** |
| **Niyetli sorgulardan tık** | **0** | **ayda 20+** |
| **Hizmet sayfalarının gösterim payı** (`/tr/hizmetler/*`, `/en/services/*`) | **%2,94** (69 / 2.346, 24 sayfa) | **%15** |
| Form / brief | GA4'te teyit edilecek | ayda 5+ nitelikli |
| GEO turu (10 prompt × 3 motor) | 1/30 (yol haritası §5) | 5/30 |

| Hizmet | Sorgu | Gösterim | Tık | Ort. poz | İlk 10 |
|---|---|---|---|---|---|
| GEO | 3 | 22 | 0 | 7,14 | 2 |
| CRO | 2 | 20 | 0 | 20,40 | 1 |
| Yapay zeka | 5 | 12 | 0 | 23,83 | 1 |
| UX | 5 | 30 | 0 | 17,70 | 0 |
| E-ticaret | 0 | 0 | 0 | — | 0 |
| Dijital dönüşüm | 0 | 0 | 0 | — | 0 |

İlk 10'daki dört niyetli sorgu: "şirketimi … önerir misin?" (14 / 6,0) · "cro ajansı" (14 / 9,1) · "şirketimi … önerir misin" (7 / 7,1) · "büyük danışmanlık firması vs butik yapay zeka ajansı farkları" (1 / 7,0).

**Baz çizgisinden çıkan üç okuma:**

1. **Niyetli gösterimin yalnız 6'sı (%7) hizmet sayfasında.** 84 gösterimin 39'u yazılarda, 35'i eski URL'lerde (`/web-tasarim-ui-ux-tasarimi/` 30, `/cro-donusum-orani-optimizasyonu/` 5), 4'ü ana sayfada. Hizmet sayfası payını %15'e taşımanın ilk kaldıracı yeni içerik değil, eski URL sinyalinin hizmet sayfalarına konsolide olması ve yazılardan hizmet sayfasına iç link.
2. **GEO'nun en güçlü niyetli sorgusu AI yazısında sıralanıyor** — hizmet sayfası olmadığı için. GEO hizmet sayfası (paralel iş) bu sorgunun doğal hedefi.
3. **E-ticaret ve dijital dönüşümde TR niyetli görünürlük sıfır.** GKP'de ~3.700/ay'lık niyetli talep var; iki hizmet de Faz 2-3'te karar kümesi alıyor.

**Yol haritasıyla fark:** Yol haritası §1'deki "görünen sorgu gösteriminin %23'ü satın alma niyetli" okuması farklı bir pencereden (29 Ağu–24 Eyl) ve bu kural yazılmadan önceki elle okumadan geliyor. N0 kuralıyla ölçülen baz %11,35'tir; haftalık kıyas bu kuralla yapılır.

---

## 5. Bakım ve açık sorular

- **Haftalık:** `pnpm gsc:weekly` → `ozet.txt`'in "Satın alma niyeti (N0)" bölümü ve `kumeler.csv`'nin `N0`, `N0-<hizmet>`, `HS` satırları. Kayıt biçimi `docs/runbooks/gsc-haftalik.md`'de.
- **Kural değişikliği:** `scripts/gsc-pull.mjs` N0 bloğu + `gsc-kumeler.test.ts`. Kural değişirse önceki haftalarla kıyas kırılır; değişiklik bu dokümana tarihle yazılır.
- **Set değişikliği:** bu doküman §2 + testteki set listesi birlikte güncellenir. GSC'de N0'a düşen ama sette olmayan konuşma biçimli sorgular ayda bir gözden geçirilir.
- **Açık soru (Burak):** Hizmet terimi taşımayan karar sorguları ("hangi ajansla çalışmalıyım", 19 gösterim) yol haritası §1'de alıcı örneği olarak geçiyor ama N0'a sayılmıyor. Ayrı bir bağlam satırı olarak mı izlenmeli, yoksa bu hâliyle mi kalmalı?
