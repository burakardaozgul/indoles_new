# İlk 3 Programı — satış niyetli sorgularda Google ilk 3 (13 Ekim – 9 Kasım 2026)

> **Tarih:** 2026-10-09 · **Statü:** Plan. Kod ve içerik değişmedi; uygulama sonraki turda, Burak onayıyla. **[B]** işaretli maddeler ayrıca açık onay ister.
> **Karar dayanağı (Burak, 9 Ekim 2026):** "Hedefin doğru, kaliteli lead getirecek, satış niyetli kelimelerde artık ilk 3 hedeflemek için her şeyi yapmamız lazım." Önceki ilke (25 Eylül): genel ve rekabetli kelimelerde ("dijital reklam ajansı") güç harcanmaz; işin değerini bilen, doğrudan çalışmak isteyen alıcının önüne çıkılır.
> **Kopyalar:** repo `docs/strateji/Ilk-3-Programi-2026-10.md` (kanonik) ve `Marketing/Ilk-3-Programi-2026-10.md` — birebir aynı; biri değişirse öteki aynı gün eşitlenir.
> **Bağlı belgeler:** `Durum-Tablosu-2026-10-09.md` (§3, §5-§7, §14) · `Niyetli-Sorgu-Seti-2026-09.md` · `Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` · `INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.20) · `CRO-Hedef-Netligi-2026-09-18.md` · `Dis-Profil-Kiti-2026-09.md` · `Off-Site-Otorite-ve-Arac-Plani.md` · ADR-018, ADR-021, ADR-039, ADR-040.
> **Onaydan sonra:** strateji v1.21 changelog satırı (keyword hedefi değişiyor — CLAUDE.md §9), ADR-040'a H1 notu (karar 2 onaylanırsa), `CRO-Hedef-Netligi`ne karar 3 kaydı.

---

## Özet ve ilk 5 karar

**Bugün (9 Eki çekimi, pencere 8 Eyl – 6 Eki):**

- 15 sorguluk para setinde **ilk 3'te 0**, 4-10'da 6, 11-20'de 5, 20+'da 4 sorgu var; setin toplamı 286 gösterim / 1 tık (Q09, QP09, hesap).
- Tık gelmemesi bu bantlarda beklenen sonuç. Sitenin sayfa CTR'ı 3-5 bandında %4,35, 5-10'da %1,59, 10-20'de %0,83 (P09); görünen sorgu düzeyinde daha da düşük: 3-5 %1,00, 5-10 %0,55, 10-20 %0,00 (Q09, hesap).
- Para sayfaları (6 hizmet sayfası, eski UX adresi ve 10 karar yazısı; 17 URL) 551 gösterim / 1 tık alıyor. Bulundukları bantların ortalamasıyla beklenen 4,85 tık; 1 tık bu beklentinin de altında (Poisson P(≤1) ≈ %4,6 — P09, hesap). Sıralamanın yanında snippet ve niyet de kontrol edilmeli (C.4).
- **Verideki en net desen:** "\<hizmet\> **ajansı**" sorgularında Google hizmet sayfasını değil seçim/kanıt yazısını sıralıyor; "\<hizmet\> **danışmanlığı**" sorgularında hizmet sayfasını.

| Sorgu tipi | 9 Eki: göst / poz, sıralanan sayfa (QP09) |
|---|---|
| "ajansı" → yazı | cro ajansı: seçim yazısı 15 / 6,80, hizmet 3 / 20,00 · geo ajansı: yalnız seçim yazısı 31 / 14,90 · e ticaret ajansı: yalnız 2024 kanıt yazısı 3 / 16,67 |
| "danışmanlığı" → hizmet | yapay zeka danışmanlığı 31 / 10,29 · ai danışmanlığı 26 / 7,00 · geo danışmanlığı 66 / 27,36 · yapay zeka görünürlük danışmanlığı 18 / 9,28 · e ticaret danışmanlığı 1 / 48,00 — hepsi hizmet sayfasında |
| İstisna | cro danışmanlığı 13 / 6,69 fiyat yazısında; CRO hizmet sayfası "CRO danışmanlığı" ifadesini hiçbir yüzeyde taşımıyor (SV) |

  CRO hizmet sayfasına 18 Eylül'de verilen "CRO ajansı" başlık istisnası, sayfayı bu sorguda öne almadı (22 Eyl: yok → 9 Eki: 3 / 20,00). Program bu desene göre kuruldu: **her para sorgusunun tek kazanan sayfası olur.** "ajansı" sorgusu seçim yazısıyla, "danışmanlığı" sorgusu hizmet sayfasıyla ilk 3'e taşınır; yazı alıcıyı hizmet sayfasına tam çapayla devreder.
- **Son haftanın yönü (türetilmiş, §0):** geo ajansı ≈5,7 (28 günlük 14,90'dan çok daha yakın) · ai danışmanlığı ≈9,9 (1–29 Eyl'de 4,08 idi; **kayıyor**) · yapay zeka danışmanlığı üç çekimdir 10,3-10,4'te sabit · geo danışmanlığı ≈27'de sabit.
- İlk 3'e en yakın beş sorgunun üçü karar yazısında: şirketimi … önerir misin 5,80 (12-soru), cro danışmanlığı 6,69 (fiyat yazısı), cro ajansı 6,80 (seçim yazısı); son haftada geo ajansı (≈5,7, seçim yazısı) da bunlara katılıyor. İlk 3'e giden en kısa yol karar yazılarından geçiyor; bu yazıların hizmet sayfasına tam çapayla bağlanması lead kalitesinin de koşulu.

**İlk 5 karar (Burak):**

| # | Karar | Öneri | Dayanak (veri) | Ne zaman |
|---|---|---|---|---|
| 1 | Para seti ve 30 Kasım hedefleri | 15 sorgu (§A). İlk 10'da **≥10** (bugün 6); ilk 3'te **≥4 hedef, ≥2 taban** (bugün 0). Tık ölçüsü görünen sorgudan **para sayfalarının sayfa düzeyi tıkına** geçer: hedef ≥10 / 29 gün (bugün 1) | §E.2-E.3 hesapları; görünen sorgulardaki tık tüm tıkların yalnız %8'i (4 / 52 — DT §14) | 13 Eki |
| 2 | GEO hizmet sayfasının H1'i **[B]** | "Yapay zeka arama optimizasyonu (GEO)" → **"GEO danışmanlığı"**; lede "GEO danışmanlığı, …" ile açılır | Setin en büyük sorgusu (66 göst / poz 27,36). İfade title'da var, H1'de ve ilk 100 kelimede yok. Bugünkü H1 rehberin bilgi sorgusunu taşıyor ve altı GEO yazısının köprü kartında başlık olarak basılıyor (SV, ART, yazı sayfası route'u) | 13 Eki |
| 3 | CRO kanibalizasyonu **[B]** | **Seçenek A:** "cro ajansı" seçim yazısının olur (6,80); hizmet sayfasının başlığı "CRO danışmanlığı: dönüşüm oranı optimizasyonu" olur, 18 Eyl başlık istisnası geri alınır. Karar 15 Eki'de, sayfanın dizinde olduğu günlerin temiz penceresiyle verilir | Yazı 15 / 6,80, hizmet 3 / 20,00 (QP09); "cro danışmanlığı" hizmet sayfasında 0 geçiş (SV); hizmet sayfası ancak ~18 Eyl'de dizine girdi (İD, İ25) | 15 Eki |
| 4 | AI hizmet sayfasının başlığı ve açıklaması **[B]** | title "Yapay zeka danışmanlığı (AI): teşhis ve pilot"; description açık fiyatla (teşhis 180.000 TL, pilot 480.000 TL); karşı-konumlandırma SSS'leri 11-12. sıradan 2-3. sıraya | "ai danışmanlığı" GKP'de "veri yok" ama 26 göst ile "yapay zeka danışmanlığı"na (31) yakın ve kayıyor; sayfa 136 göst / 0 tık / 0 GA4 açılışı (P09, GA-S) | 13 Eki |
| 5 | Dış sinyal ve kanıt sahipleri **[B]** | (a) Hangi müşteri sitesinden marka çapalı bağlantı istenecek; (b) Clutch / GoodFirms / Sortlist açıldı mı, URL'leri; (c) AI, GEO, CRO sayfalarını hangi danışman imzalayacak; (d) GEO için paket / fiyat bandı var mı | fyrluxury.com 9 oturum, meccanotecnica.com.tr 1 oturum yönlendirme (GA-K); Organization `sameAs`'ta yalnız LinkedIn, Instagram, GBP (CO); 6 hizmet sayfasının hiçbirinde danışman imzası yok (SD) | 19 Eki |

**Hafta 1 (13–19 Eki), beş iş:** (1) ölçüm tabanı, temiz pencere çekimi ve SERP kontrolü; (2) `ai-danismanlik` on-page paketi; (3) `geo-danismanligi` H1/lede ve üç iç bağlantı; (4) CRO kararı ve uygulaması; (5) Burak'ın GSC ve dış işleri. Ayrıntı §D.1.

---

## 0. Kaynaklar ve yöntem

Göreli yollar Marketing klasörüne göredir; `repo` öneki `indoles-web` deposudur (dal tabanı `1bedbe0`).

| Kod | Dosya | Pencere |
|---|---|---|
| Q22 · Q02 · Q09 | `GSC-Data/haftalik-2026-09-22/`, `-10-02/`, `-10-09/` → `sorgular.csv` | 22 Ağu–19 Eyl · 1–29 Eyl · 8 Eyl–6 Eki |
| QP22 · QP02 · QP09 | aynı klasörler → `sorgu-sayfa.csv` | aynı |
| P22 · P02 · P09 | aynı klasörler → `sayfalar.csv` | aynı |
| K09 | `GSC-Data/haftalik-2026-10-09/kumeler.csv` | 8 Eyl–6 Eki |
| İ09 · İY09 · İ25 | `GSC-Data/indeks-2026-10-09.csv` · `indeks-yeni-icerik-2026-10-09.csv` · `indeks-2026-09-25.csv` | tarama 9 Eki · 9 Eki · 25 Eyl |
| D22 | `GSC-Data/denetim-2026-09-22.md` | — |
| GA-S · GA-AI · GA-L · GA-K · GA-Ö | `GA4-Data/haftalik-2026-10-09/` → `sayfalar.csv` · `ai-yonlendirme.csv` · `lead.csv` · `kaynaklar.csv` · `ozet.txt` | 10 Eyl–7 Eki (AI serisi 29 Ağu–7 Eki) |
| KWP | `Keyword-Planner/keyword-hacim-birlesik.csv` | GKP, Ağu 2025–Tem 2026 |
| DT · NS · YH · ST · CH · RA · DPK · OSO · İD | repo `docs/strateji/`: Durum-Tablosu-2026-10-09 · Niyetli-Sorgu-Seti-2026-09 · Yol-Haritasi-Satin-Alma-Niyeti-2026-09 · INDOLES-Organik-Strateji-SEO-GEO-v1 (v1.20) · CRO-Hedef-Netligi-2026-09-18 · Rakip-Analizi-P0-SERP · Dis-Profil-Kiti-2026-09 · Off-Site-Otorite-ve-Arac-Plani · Indeks-Denetimi-2026-09-18 | — |
| SV | repo `src/lib/content/services/{ai-danismanlik,geo-danismanligi,cro,e-ticaret,ui-ux-tasarim,dijital-donusum}.ts` | — |
| ART · CS · PK · CN · CO | repo `src/lib/content/articles.ts` · `cases.ts` · `packages.ts` · `consultants.ts` · `company.ts` | — |
| SD · JL | repo `src/components/marketing/service-detail.tsx` · `src/lib/seo/json-ld.ts` | — |
| KC · SC | repo `tests/unit/keyword-coverage.test.ts` · `tests/unit/services-content.test.ts` | — |
| hesap | bu belgede kaynak dosyadan türetilen değer; her biri script ile iki kez çıkarıldı | — |

**Yöntem notları**

- **Pencere:** GSC çekimleri uç günler dahil 29 gündür. Ardışık iki çekim 22 gün örtüşür; çekimler arası "delta" bu yüzden yumuşaktır, bir değişikliğin etkisi tam olarak ~4 hafta sonra görünür.
- **Son hafta (türetilmiş):** GSC ortalama pozisyonu gösterim ağırlıklıdır, bu yüzden iki çekimin farkı ayrışır: `P_son = (G₉·P₉ − G₂·P₂) / (G₉ − G₂)`. Sonuç 30 Eyl–6 Eki penceresidir; **koşulu** o sorgunun 1–7 Eyl'de ~0 gösterim almış olmasıdır (sayfa 7 Eyl'den sonra yayımlandıysa ya da 22 Eyl çekiminde sorgu yoksa "temiz"). n = G₉ − G₂; n < 10 ise yalnız bağlam.
- **Bantlar:** ilk 3 = 28 günlük ağırlıklı ortalama pozisyon ≤ 3,0 · 4-10 = 3,0 < poz ≤ 10,0 · 11-20 · 20+. "İlk 3 mesafesi" = poz − 3.
- **Kelime sayısı:** hizmet sayfasının içerik alanları (ad, lede, sinyaller, kapsam, yöntem, çıktılar, SSS); sayfanın bastığı paket, vaka ve yazı kartları hariç (SV, hesap).
- **(hipotez)** etiketi: veriyle doğrulanmayan her çıkarımda.

---

## A. Para sorgu seti

### A.1 Seçim kuralı

- N0 kuralına (NS §1) düşen, altı hizmetten birinin satın alma niteleyicisini taşıyan TR sorgu; 9 Eki çekiminde en az 1 gösterim.
- **Veriyle çıkan adaylar** (2 Eki ve 9 Eki çekimlerinde 0 gösterim): yapay zeka danışmanlık firmaları · dijital dönüşüm danışmanlığı (KWP 100-1B / Orta, GSC'de hiç yok) · dönüşüm optimizasyonu (KWP 100-1B / Düşük; 22 Eyl'de 1 / 50,00, sonra yok — DT §2'deki A-1 kayıp tohumu). Ek gözlem: rakip analizinin "en alınabilir" dediği yapay zeka ajansı (KWP 100-1B / Düşük) da GSC'de hiç görünmüyor (Q09).
- Yazım varyantları ayrı puanlanmaz; A.4'te izlenir.
- Konuşma biçimli sorgular sette kalır, niyet katsayısı düşük tutulur (A.3).

### A.2 Para seti — 9 Eki durumu

| # | Sorgu | Hizmet | 9 Eki: göst / poz / tık | Sıralanan sayfa (göst / poz) | Doğru sayfa mı | Bant | İlk 3 mesafesi |
|---|---|---|---|---|---|---|---|
| 1 | geo danışmanlığı | GEO | 66 / 27,36 / 1 | `/tr/hizmetler/geo-danismanligi` (66 / 27,36) | Evet | 20+ | 24,4 |
| 2 | yapay zeka danışmanlığı | Yapay zeka | 31 / 10,29 / 0 | `/tr/hizmetler/ai-danismanlik` (31 / 10,29) | Evet | 11-20 | 7,3 |
| 3 | geo ajansı | GEO | 31 / 14,90 / 0 | `/tr/yazilar/geo-ajansi-nasil-secilir` (31 / 14,90) | Seçim yazısı — kazanan önerisi de bu (§B.3) | 11-20 | 11,9 |
| 4 | şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin (soru işaretli ve işaretsiz yazım birleşik) | GEO | 30 / 5,80 / 0 | `/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru` (21 / 5,14 + 9 / 7,33) | Hayır — GEO alıcısı bir AI yazısında; yazı GEO hizmet sayfasına bağlanmıyor (ART) | 4-10 | 2,8 |
| 5 | ux ajansı | UX | 28 / 10,46 / 0 | eski `/web-tasarim-ui-ux-tasarimi/` (28 / 10,46) | Hayır — yönlendirilmiş eski adres; son bilinen tarama 30 Tem (İD §2, 18 Eyl denetimi) | 11-20 | 7,5 |
| 6 | ai danışmanlığı | Yapay zeka | 26 / 7,00 / 0 | `/tr/hizmetler/ai-danismanlik` (26 / 7,00) | Evet | 4-10 | 4,0 |
| 7 | cro ajansı | CRO | 18 / 9,00 / 0 | `/tr/yazilar/cro-ajansi-nasil-secilir` (15 / 6,80) + `/tr/hizmetler/cro` (3 / 20,00) | Bölünmüş (A-6) | 4-10 | 6,0 (yazı: 3,8) |
| 8 | yapay zeka görünürlük danışmanlığı | GEO | 18 / 9,28 / 0 | `/tr/hizmetler/geo-danismanligi` (18 / 9,28) | Evet — ifade sayfada hiç geçmiyor (SV) | 4-10 | 6,3 |
| 9 | cro danışmanlığı | CRO | 13 / 6,69 / 0 | `/tr/yazilar/cro-danismanligi-fiyatlari` (13 / 6,69) | Kısmen — fiyat yazısı; hizmet sayfası ifadeyi taşımıyor | 4-10 | 3,7 |
| 10 | yapay zeka kullanılan danışmanlık paketleri ile klasik hizmetler arasında fiyat farkı var mı? | Yapay zeka | 5 / 8,00 / 0 | `/tr/hizmetler/ai-danismanlik` (5 / 8,00) | Evet (fiyat yazısı da aday) | 4-10 | 5,0 |
| 11 | yapay zeka danışmanı | Yapay zeka | 5 / 15,40 / 0 | hizmet (4 / 11,00) + 12-soru yazısı (1 / 33,00) | Evet — hizmet önde | 11-20 | 12,4 |
| 12 | dönüşüm oranlarını artırmak için türkiye'deki en iyi cro uzmanları kimlerdir? | CRO | 10 / 35,60 / 0 | `cro-ajansi-nasil-secilir` (6 / 46,67) + `donusum-orani-nasil-artirilir-21-taktik` (4 / 19,00) | Hayır — hizmet sayfası görünmüyor | 20+ | 32,6 |
| 13 | e ticaret ajansı | E-ticaret | 3 / 16,67 / 0 | `/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi` (3 / 16,67) | Kanıt yazısı (2024) | 11-20 | 13,7 |
| 14 | e ticaret danışmanlığı | E-ticaret | 1 / 48,00 / 0 | `/tr/hizmetler/e-ticaret` (1 / 48,00) | Evet | 20+ | 45,0 |
| 15 | dijital dönüşüm firmaları | Dijital dönüşüm | 1 / 61,00 / 0 | `/tr/hizmetler/dijital-donusum` (1 / 61,00) | Evet | 20+ | 58,0 |
| | **Toplam** | | **286 / — / 1** | | | **ilk 3: 0 · 4-10: 6 · 11-20: 5 · 20+: 4** | |

Kaynak: Q09, QP09, İD; birleşik pozisyon ve mesafe hesap.

**Eğilim ve hacim:**

| # | Sorgu | 2 Eki: göst / poz | 22 Eyl: göst / poz | Son hafta (türetilmiş; n) | KWP bandı / rekabet |
|---|---|---|---|---|---|
| 1 | geo danışmanlığı | 16 / 28,06 | — | ≈27,1 (n=50, temiz) | ölçülmedi |
| 2 | yapay zeka danışmanlığı | 14 / 10,43 | 5 / 10,40 | ≈10,2 (n=17) | 100-1B / Orta |
| 3 | geo ajansı | 18 / 21,56 | — | **≈5,7** (n=13, temiz) | ölçülmedi |
| 4 | şirketimi … önerir misin | 30 / 6,20 (21 / 5,71 + 9 / 7,33) | 21 / 6,38 (14 / 6,00 + 7 / 7,14) | türetilemez (n=0) | ölçülmedi |
| 5 | ux ajansı | 27 / 9,89 | 21 / 10,43 | türetilemez (n=1) | 10-100 / Orta |
| 6 | ai danışmanlığı | 13 / 4,08 | 1 / 26,00 | **≈9,9** (n=13, yaklaşık temiz) | veri yok |
| 7 | cro ajansı | 15 / 9,00 (yazı 12 / 6,50 · hizmet 2 / 17,00 · eski URL 1 / 23,00) | 14 / 9,14 (yazı 9 / 6,22 · eski URL 5 / 14,40) | n=3 | veri yok |
| 8 | yapay zeka görünürlük danışmanlığı | 3 / 7,67 | — | ≈9,6 (n=15, temiz) | ölçülmedi |
| 9 | cro danışmanlığı | 4 / 6,00 | — | ≈7,0 (n=9, temiz) | veri yok |
| 10 | … paketler … fiyat farkı var mı? | 4 / 9,50 | — | n=1 | ölçülmedi |
| 11 | yapay zeka danışmanı | 1 / 33,00 (12-soru) | 1 / 33,00 (12-soru) | ≈11,0 (n=4) | 100-1B / Orta |
| 12 | … en iyi cro uzmanları kimlerdir? | 10 / 35,60 | 6 / 46,67 | türetilemez (n=0) | ölçülmedi |
| 13 | e ticaret ajansı | — | — | yeni | 100-1B / Orta |
| 14 | e ticaret danışmanlığı | — | — | yeni | 100-1B / Orta |
| 15 | dijital dönüşüm firmaları | 1 / 61,00 | — | n=0 | ölçülmedi (ana terim "dijital dönüşüm danışmanlığı" 100-1B / Orta, GSC'de 0) |

Kaynak: Q02, Q22, QP02, QP22, KWP; son hafta hesap (§0).

### A.3 Öncelik puanı

**P = G × N × M**

- **G** — 9 Eki çekiminin 28 günlük gösterimi (Q09; iki yazımlı sorgu birleşik).
- **N — niyet (öznel):** 3 = sorgu doğrudan tedarikçi arıyor (hizmet + "ajansı / danışmanlığı", "önerir misin"); 2 = alıcı olabilir ama kapsam belirsiz ("yapay zeka danışmanı" kişi ya da kariyer araması da olabilir; "dijital dönüşüm firmaları" ERP satıcısı arayan da olabilir) **ya da** konuşma biçimli ve insan alıcı olduğu doğrulanamıyor (2 Eki ve 9 Eki pencerelerinde aynı sayı, 0 tık; site genelinde konuşma biçimli 82 sorgu / 201 göst / 0 tık — DT §14); 1 = ticari-bilgi (sette yok).
- **M — mesafe:** bugünkü en iyi INDOLES sonucunun pozisyonuna göre. ≤3 → 0 (zaten ilk 3, korunur) · 3-5 → 1,0 · 5-8 → 0,8 · 8-11 → 0,6 · 11-15 → 0,4 · 15-20 → 0,25 · 20-30 → 0,15 · >30 → 0,05. Gerekçe: sitenin tık değeri ilk beş sırada toplanıyor (bant CTR'ları); 5-10'daki sorgu on-page işle, 20+'daki sorgu ancak otoriteyle kapanır **(hipotez)**.
- **Öznel olanlar:** N'nin 2/3 ayrımı ve M'nin kademe sınırları yargıdır; sıra bunlara duyarlıdır. Örnek: geo ajansı'nın son hafta değeri (≈5,7) kullanılsaydı M = 0,8 olur ve P = 74,4 ile birinci sıraya çıkardı. Puan 28 günlük değerle hesaplanır (yeniden üretilebilir olsun diye); ivme yanına not edilir.

| Sıra | Sorgu | G | N | M (en iyi poz) | P | Kazanan sayfa (öneri) | Hafta |
|---|---|---|---|---|---|---|---|
| 1 | ai danışmanlığı | 26 | 3 | 0,8 (7,00) | 62,4 | `/tr/hizmetler/ai-danismanlik` | 1 |
| 2 | yapay zeka danışmanlığı | 31 | 3 | 0,6 (10,29) | 55,8 | `/tr/hizmetler/ai-danismanlik` | 1 |
| 3 | ux ajansı | 28 | 3 | 0,6 (10,46) | 50,4 | `/tr/hizmetler/ui-ux-tasarim` (konsolidasyonla) | 1 (GSC isteği), 3 |
| 4 | şirketimi … önerir misin | 30 | 2 | 0,8 (5,14) | 48,0 | 12-soru yazısı, GEO hizmet sayfasına köprüyle | 1 |
| 5 | cro ajansı | 18 | 3 | 0,8 (6,80) | 43,2 | `cro-ajansi-nasil-secilir` (Seçenek A) | 1 |
| 6 | geo ajansı | 31 | 3 | 0,4 (14,90) | 37,2 (son haftayla 74,4) | `geo-ajansi-nasil-secilir` | 1 |
| 7 | yapay zeka görünürlük danışmanlığı | 18 | 3 | 0,6 (9,28) | 32,4 | `/tr/hizmetler/geo-danismanligi` | 1 |
| 8 | cro danışmanlığı | 13 | 3 | 0,8 (6,69) | 31,2 | A: `/tr/hizmetler/cro` · B: fiyat yazısı | 1 |
| 9 | geo danışmanlığı | 66 | 3 | 0,15 (27,36) | 29,7 | `/tr/hizmetler/geo-danismanligi` | 1 (H1), 3 (otorite) |
| 10 | … paketler … fiyat farkı var mı? | 5 | 2 | 0,8 (8,00) | 8,0 | `/tr/hizmetler/ai-danismanlik` | 1 (dolaylı) |
| 11 | yapay zeka danışmanı | 5 | 2 | 0,6 (11,00) | 6,0 | `/tr/hizmetler/ai-danismanlik` | 1 (dolaylı) |
| 12 | … en iyi cro uzmanları kimlerdir? | 10 | 2 | 0,25 (19,00) | 5,0 | `cro-ajansi-nasil-secilir` | izle |
| 13 | e ticaret ajansı | 3 | 3 | 0,25 (16,67) | 2,2 | `gercek-e-ticaret-ajansinin-etkisi` | izle |
| 14 | e ticaret danışmanlığı | 1 | 3 | 0,05 (48,00) | 0,2 | `/tr/hizmetler/e-ticaret` | izle |
| 15 | dijital dönüşüm firmaları | 1 | 2 | 0,05 (61,00) | 0,1 | `/tr/hizmetler/dijital-donusum` | Faz 3 |

İlk dokuz sorgunun tamamı yapay zeka, GEO, CRO ve UX'te; Burak'ın Hafta 1 önceliğiyle örtüşüyor. "geo danışmanlığı" mesafe yüzünden dokuzuncu ama gösterimi en büyük sorgu: uzun vadede en büyük ödül o. H1 değişikliği ucuz olduğu için Hafta 1'e alındı.

### A.4 Varyantlar ve izleme satırları (puanlanmaz)

| Varyant | 9 Eki göst / poz | Sıralanan sayfa | Bağlı olduğu sorgu |
|---|---|---|---|
| geo danışmanlık | 12 / 41,25 | GEO hizmet | geo danışmanlığı |
| ai danışmanlık | 4 / 23,75 | AI hizmet | ai danışmanlığı |
| yapay zekâ danışmanlığı | 3 / 14,00 | AI hizmet | yapay zeka danışmanlığı |
| yapay zeka danışmanlık | 2 / 9,50 | AI hizmet | yapay zeka danışmanlığı |
| yapay zeka otomasyon danışmanlığı | 3 / 10,00 | AI hizmet | yapay zeka danışmanlığı |
| eticaret ajansı | 1 / 8,00 | 2024 e-ticaret kanıt yazısı | e ticaret ajansı |
| chatgpt gemini görünürlüğü ajans türkiye | 2 / 1,00 | GEO hizmet | zaten ilk 3 — korunur |
| ai görünürlük danışmanlığı paket fiyatları | 2 / 6,00 | **AI hizmet** — GEO sorgusu yanlış kümede | GEO fiyat halkası (§B.4) |
| dönüşüm danışmanlığı | 1 / 2,00 | dijital dönüşüm hizmet | belirsiz (CRO mu, dijital dönüşüm mü) |

Kaynak: QP09.

### A.5 Okuma

1. **Gösterim dört sorguda yoğun:** geo danışmanlığı, yapay zeka danışmanlığı, geo ajansı ve şirketimi … önerir misin setin %55'ini taşıyor (158 / 286, hesap).
2. **Altı hizmetin ikisinde para sorgusu fiilen yok.** E-ticaret ve dijital dönüşüm setin toplam 5 gösterimini taşıyor (hesap). E-ticaret karar kümesi 2 Eki'de yayımlandı, 9 Eki penceresinde en fazla 5 gün var; bu dört haftada bekleme kararı. Dijital dönüşüm Faz 3 işi (YH §4).
3. **geo danışmanlığı olağan dışı:** 66 gösterimin ≈50'si son haftada ve ≈27. sırada (türetilmiş). Üçüncü sayfada bu kadar gösterim olağan değil; ekip içi kontrol aramaları ya da mobil sürekli kaydırma olabilir **(hipotez)** — Burak'a soru (§G-8).
4. **Konuşma biçimli sorgular kırılgan:** #4 ve #12, 2 Eki ve 9 Eki pencerelerinde aynı ya da çok yakın sayılarla duruyor, altı haftada 0 tık. İnsan alıcı mı, AI Mode ya da bir izleme aracı mı, ayırt edilemiyor **(hipotez)** → N = 2; ilk 3 / ilk 10 sayımı bu ikisi olmadan da raporlanır.
5. **ai danışmanlığı kayıyor:** 4,08'den (1–29 Eyl) son hafta ≈9,9'a. Aynı dönemde hizmet sayfasında yalnız bir SSS cümlesi değişti (2 Eki İKAS hizalaması, SV `updatedAt`), aynı gün iki yeni AI karar yazısı yayımlandı. Neden ayırt edilemiyor **(hipotez: yeni yazılarla iç rekabet ya da rakip hareketi)**; 23 Eki çekiminde QP'de yazıların bu sorguya girip girmediğine bakılır.

---

## B. Sayfa bazlı teşhis

### B.1 Altı hizmet sayfası

| | AI `ai-danismanlik` | GEO `geo-danismanligi` | CRO `cro` | E-ticaret `e-ticaret` | UX `ui-ux-tasarim` | Dijital dönüşüm `dijital-donusum` |
|---|---|---|---|---|---|---|
| Para sorgusu (§A) | yapay zeka danışmanlığı · ai danışmanlığı · yapay zeka danışmanı | geo danışmanlığı · yapay zeka görünürlük danışmanlığı | cro danışmanlığı (A'da; cro ajansı yazıya) | e ticaret danışmanlığı | ux ajansı | dijital dönüşüm danışmanlığı (0 göst) |
| H1 (`name`) | Yapay zeka danışmanlığı | Yapay zeka arama optimizasyonu (GEO) | Dönüşüm oranı optimizasyonu (CRO) | E-ticaret danışmanlığı | UI/UX tasarım | Dijital dönüşüm |
| `seo.title` (SERP'te " — INDOLES" ile karakter) | Yapay zeka danışmanlığı ve pilot uygulama (51) | GEO danışmanlığı: yapay zekada görünürlük (51) | CRO ajansı: dönüşüm oranı optimizasyonu (49) | E-ticaret danışmanlığı: platform, kanal ve büyüme (59) | UI/UX tasarım hizmeti (31) | Dijital dönüşüm danışmanlığı (38) |
| Hedef ifade, kelimesi kelimesine — title / H1 / lede / description / SSS sorusu | "yapay zeka danışmanlığı": var / var / var / var / var (6 geçiş) · "ai danışmanlığı": hiçbir yüzeyde yok (0) | "geo danışmanlığı": var / **yok** / **yok** / var / var (4 geçiş: SSS 1, 4, 5) · "yapay zeka görünürlük danışmanlığı": 0 | "cro danışmanlığı": **hiçbir yüzeyde yok (0)** · "cro ajansı": var / yok / var / var / var (SSS 2) | "e-ticaret danışmanlığı": var / var / var / var / var (7 geçiş) | "ux ajansı": yalnız SSS 12 cevabında (1) | "dijital dönüşüm danışmanlığı": var / yok / yok / var / var (SSS 11) |
| İlk 100 kelime | "Yapay zeka danışmanlığı, …" ile açılıyor | "Yapay zeka arama optimizasyonu (GEO), …" — "GEO ajansı" var, "GEO danışmanlığı" yok | "Dönüşüm oranı optimizasyonu, …" — "CRO ajansı" var | "E-ticaret danışmanlığı, …" | "UI/UX tasarım, …" | "Dijital dönüşüm, …" |
| SSS (adet) ve alıcı sorusu | 12 · "ajans / firma farkı" 11. ve 12. sırada; "kimle çalışmalıyım" yok | 12 · "kimle çalışmalıyım" 2., garanti 3., fiyat 5. sırada | 12 · "CRO ajansı ile … farkı" 2. sırada | 12 · "ajans ile danışman farkı" 2., fiyat 3. sırada | 12 · "ajans mı danışmanlık mı" 12. sırada | 11 |
| Kanıt şeridi (sayfanın altındaki "İlgili" bölümü) | Meccanotecnica Umbra: 10× teklif talebi — **tek kart** (künyede başka AI vakası yok) | SIM Baskı: 15× organik trafik, 40.000 GEO görünürlüğü · İstanbul Ortez: Google ilk 3 | GYMWOLVES: 12× satış · OdorGo: 10M ₺ ciro | OdorGo · Meccanotecnica | İstanbul Ortez · FYR: 100.000 $ ciro | Meccanotecnica (pillar yedeği — anlatısı bu hizmetle eşleşmiyor, İD) |
| Fiyat / paket | AI Pilot 480.000 TL / 6 hafta | **yok** (`relatedPackages: null`; SSS "teşhisle başlar") | Büyüme Sprinti 240.000 TL / 4 hafta | Büyüme Sprinti · Dijital Dönüşüm Teşhisi 180.000 TL | Büyüme Sprinti | pillar paketleri (Teşhis 180.000 TL, AI Pilot) |
| Danışman imzası | yok | yok | yok | yok | yok | yok |
| Yazılardan satır içi bağlantı (TR; bağlantı / yazı) ve çapalar | 9 / 6 — "yapay zeka danışmanlığı …" ×8, "danışmanlık kapsamımızda" ×1 | 8 / 6 — "GEO danışmanlığı …" ×6, "GEO ajansı olarak nasıl çalıştığımız" ×1, "GEO hizmet sayfamızda" ×1 | **18 / 10** — "dönüşüm oranı optimizasyonu …" ×6, "CRO ajansı olarak …" ×4, "CRO hizmet…" ×4, "CRO danışmanlığı …" ×3, "dönüşüm optimizasyonu hizmetimizde" ×1 | 14 / 8 — "e-ticaret danışmanlığı …" ×13, "e-ticaret hizmetimizin" ×1 | **1 / 1** — "UI/UX tasarım hizmetimizle" | 3 / 3 — "dijital dönüşüm …" |
| Konu köprü kartı (yazı sonu; başlık = hizmetin H1'i, çapa "Hizmeti incele") | 5 yazı | 6 yazı — kart başlığı "Yapay zeka arama optimizasyonu (GEO)" | 7 yazı | 4 yazı | 1 yazı | 0 (konusu yok) |
| JSON-LD | Organization · WebPage (`dateModified`) · BreadcrumbList · Service (paket `offers`) · FAQPage — altı sayfada aynı şablon (SD) | aynı; `offers` boş | aynı | aynı | aynı; `dateModified` yok | aynı |
| `updatedAt` | 2026-10-02 | 2026-09-25 | 2026-09-25 | 2026-10-02 | **yok** (lastmod build anı) | 2026-10-02 |
| İçerik alanı kelime sayısı TR / EN | 1.110 / 1.387 | 1.331 / 1.755 | 1.042 / 1.278 | 1.362 / 1.729 | 970 / 1.201 | 987 / 1.189 |
| Dizin (son tarama) | var, 3 Eki (İ09) | var, 25 Eyl (İY09) | var, 25 Eyl; ilk tarama ~18 Eyl (İD, İ25) | var, 3 Eki | var, 18 Eyl | var, 18 Eyl |
| GSC sayfa: 22 Eyl → 2 Eki → 9 Eki (göst / poz) | 13 / 11,31 → 53 / 9,77 → 136 / 11,18 | — → 32 / 22,97 → 109 / 23,77 | 1 / 7,00 → 5 / 8,80 → 7 / 20,14 | 3 / 6,00 → 7 / 8,14 → 9 / 12,33 | hiç yok (eski URL 117 / 21,05 → 63 / 18,35 → 52 / 12,94) | — → 8 / 9,63 → 9 / 8,78 |
| GA4 açılış oturumu (GA-S) | **0** | 1 | 1 | 0 | 0 | 1 |
| EN karşılığı — H1 / title / GSC 9 Eki | AI advisory / Artificial intelligence consulting and pilots / 4 / 4,25 | Generative engine optimization (GEO) / GEO consulting: visibility in AI answers / 19 / 15,47 | Conversion rate optimisation (CRO) / CRO agency: conversion rate optimisation / 1 / 19,00 | E-commerce consulting / E-commerce consulting: platform, channels and growth / 3 / 24,00 | UI/UX design / UI/UX design service / — | Digital transformation / Digital transformation consulting / — |

Kaynak: SV, ART (bağlantılar `articles.ts` TR metinlerinde `](/hizmetler/<slug>)` taraması), CS, PK, SD, İ09, İY09, İD, P22, P02, P09, GA-S.

**Okuma:**

- **İç bağlantı tek başına belirleyici değil.** En çok iç bağlantıyı CRO alıyor (18 bağlantı / 10 yazı), ama altı sayfanın en zayıfı o (7 göst, poz 20,14). Fark, sorgu tipi ("ajansı" yazıya gidiyor) ve dizin yaşıyla açıklanıyor (CRO sayfası ~18 Eyl'de dizine girdi).
- **GEO sayfasının sorunu iki katmanlı.** H1 ve ilk 100 kelime para ifadesini taşımıyor (on-page). Sayfa 25 Eyl'de açıldı ve dış sinyali yok; poz 27 ancak otoriteyle kapanır **(hipotez)**.
- **AI sayfası ilk sayfanın alt sınırında takılı.** Para ifadesi her yüzeyde var. Eksikler "ai danışmanlığı" biçimi, alıcı sorusunun yeri, kanıtın derinliği (tek vaka kartı, sayfanın en altında) ve imza **(hipotez: Big4 ve exact-match alan adlarının olduğu SERP'te güven sinyali — RA §2)**.
- **Kanıt sayfanın sonunda.** Altı sayfada da rakamlı vaka yalnız SSS'ten sonraki "İlgili" bölümünde; ilk ekranda rakam yok.

### B.2 İlgili karar yazıları

| Yazı | `seo.title` | Para sorgusu (9 Eki göst / poz) | Hizmet sayfasına bağlantı | Not |
|---|---|---|---|---|
| `cro-ajansi-nasil-secilir` | CRO ajansı nasıl seçilir? Kontrol listesi | cro ajansı 15 / 6,80 · en iyi cro uzmanları 6 / 46,67 | 2 × "CRO ajansı olarak nasıl çalıştığımız" | yazar Can Aydınlık · 1.753 kelime · 29 Ağu'dan beri dizinde |
| `cro-danismanligi-fiyatlari` | CRO danışmanlığı fiyatları: bütçe nasıl oluşur | cro danışmanlığı 13 / 6,69 | 3 bağlantı | 2.585 kelime |
| `geo-ajansi-nasil-secilir` | GEO ajansı nasıl seçilir? Kontrol listesi | geo ajansı 31 / 14,90 (son hafta ≈5,7) | 3 bağlantı | 2.646 kelime · 25 Eyl |
| `ai-danismani-secerken-sorulacak-12-soru` | Yapay zeka danışmanı nasıl seçilir? 12 soru | şirketimi … 30 / 5,80 · yapay zeka danışmanı 1 / 33,00 | AI hizmete var; **GEO hizmete yok** (blok 3 GEO'yu anlatıyor, yalnız rehbere ve denetleyiciye bağlanıyor) | DT §6, §11 #4 |
| `yapay-zeka-danismanligi-fiyatlari` | Yapay zeka danışmanlığı fiyatları nasıl oluşur? | görünen sorgu yok (sayfa 11 / 30,36) | 2 bağlantı | 2 Eki, pencerede 5 gün |
| `buyuk-danismanlik-mi-butik-yapay-zeka-ajansi-mi` | Büyük danışmanlık mı, butik yapay zeka ajansı mı? | görünen sorgu yok; "büyük danışmanlık firması vs butik yapay zeka ajansı farkları" (2 / 3,50) hâlâ eski 8-soru yazısında | 2 bağlantı | 2 Eki |
| `gercek-e-ticaret-ajansinin-etkisi` | E-ticaret ajansı ne değiştirir? Üç aylık kanıt | e ticaret ajansı 3 / 16,67 · eticaret ajansı 1 / 8,00 | 1 bağlantı | 2024 yazısı, 886 kelime |
| `e-ticaret-danismani-nasil-secilir` | E-ticaret danışmanı nasıl seçilir? Kontrol listesi | görünen para sorgusu yok (sayfa 12 / 5,42) | 3 bağlantı | 2 Eki |
| `dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru` | Hangi ajansla çalışmalıyım? İlk görüşmede 8 soru | "hangi ajansla çalışmalıyım" 9 / 11,56 (N0 dışı, hizmet terimi yok) | CRO / GEO / AI'ya yok; yalnız performans pazarlama ve büyük-butik yazısı | hizmet terimi taşımayan alıcıyı para kümelerine yönlendirme yeri |

Kaynak: ART, QP09, P09.

### B.3 Kazanan sayfa ve kanibalizasyon

Kural: bir sorguya tek kazanan sayfa. Kanibalizasyon canonical ile değil, kaybeden sayfanın title / H1 hedefinden sorgunun çekilmesiyle çözülür (strateji §2, A-6, ADR-040 kanibalizasyon sınırı).

| Sorgu | Bugün (göst / poz) | Kazanan (öneri) | Öteki sayfada ne değişir | Karar |
|---|---|---|---|---|
| cro ajansı | yazı 15 / 6,80 · hizmet 3 / 20,00 | `cro-ajansi-nasil-secilir` (A) | Hizmet title'ından "CRO ajansı" çıkar. Lede ve karşı-konumlandırma SSS'inde üçüncü taraf tanımı olarak kalır; KC `["cro","cro ajansı"]` lede/SSS ile geçmeye devam eder | **[B]** 15 Eki |
| cro danışmanlığı | fiyat yazısı 13 / 6,69 | A: `/tr/hizmetler/cro` · B: fiyat yazısı | A: hizmet title / lede / SSS 2'ye "CRO danışmanlığı" girer; fiyat yazısı "fiyatları" niteleyicisiyle kalır, değişmez (AI kümesinde aynı düzen çalışıyor: hizmet "yapay zeka danışmanlığı"nda, fiyat yazısı "… fiyatları"nda) | **[B]** 15 Eki |
| geo ajansı | yazı 31 / 14,90 | `geo-ajansi-nasil-secilir` | Hizmet sayfası "GEO ajansı"nı lede ve SSS'te üçüncü taraf tanımı olarak korur; title'a girmez (bugün de girmiyor) | öneri, değişiklik yok |
| şirketimi … önerir misin | 12-soru 30 / 5,80 | 12-soru yazısı, GEO hizmetine köprüyle | 12-soru blok 3'e GEO hizmet bağlantısı; GEO hizmet sayfasına bu sorgu için yeni SSS **eklenmez** (ikinci sayfa açmak olur) | öneri |
| e ticaret ajansı | 2024 yazısı 3 / 16,67 | `gercek-e-ticaret-ajansinin-etkisi` | Hizmet SSS'i ve danışman-seçimi yazısı ifadeyi gövdede taşımaya devam eder (KC); title'a eklenmez | izle |
| yapay zeka danışmanı | hizmet 4 / 11,00 · 12-soru 1 / 33,00 | AI hizmet | — | aksiyon yok |
| türkçe geo aracı var mı · yerli geo aracı (para dışı) | yazı 39 / 2,67 + 38 / 1,32 · araç 1 / 1,00 + 2 / 1,00 | araç sayfası | Araç title'ı "Türkçe GEO aracı …" olur; yazının title'ı duyuru çerçevesine döner (H1 zaten "… yayına aldık"). 28 günün tek form/brief olayı araçtan geldi (GA-L, `tool_report_requested`) | **[B]** Hafta 2 (DT §11 #6) |
| yapay zeka arama optimizasyonu (bilgi) | rehber 16 / 5,88 | rehber | GEO hizmet H1'i bu ifadeyi bırakır (karar 2). Bugün bölünme yok; risk yapısal | karar 2 ile |
| … en iyi cro uzmanları kimlerdir? | seçim yazısı 6 / 46,67 · 21-taktik 4 / 19,00 | seçim yazısı | — | izle |
| ai görünürlük danışmanlığı paket fiyatları | AI hizmet 2 / 6,00 | GEO hizmet (GEO fiyat yazısı açılırsa o) | GEO fiyat halkası kararıyla | izle |

### B.4 Karar kümeleri (hub) — iç bağlantı bütünlüğü

Hizmet sayfası kendi konusundaki her yazıya "İlgili yazılar" şeridiyle zaten bağlı (SD `relatedArticlesForService`); aşağıdaki tablo yazılar arası ve yazı → vaka yönünü gösterir (ART, satır içi bağlantılar).

| Küme | Nasıl seçilir | Neye mal olur | Karşılaştırma | Nasıl işler / rehber | Vaka | Boşluk |
|---|---|---|---|---|---|---|
| Yapay zeka | 12-soru → hizmet, fiyat, karşılaştırma, Meccanotecnica: var · **90 günlük pilot: yok** | fiyat → hizmet, 12-soru, pilot, karşılaştırma: var · **Meccanotecnica: yok** | büyük-butik → hepsi var | 90 günlük pilot → hepsi var | Meccanotecnica → hizmet (künye) | 12-soru → pilot · fiyat → Meccanotecnica · ikinci AI vakası yok (şerit tek kart) |
| GEO | seçim yazısı → hizmet ×3, rehber, SIM, İstanbul Ortez: var | **yok** (paket yok) | yok | rehber → hizmet: var · **rehber → seçim yazısı: yok** | SIM, İstanbul Ortez → hizmet (künye) | GEO fiyat halkası (Burak'ın fiyat kararına bağlı) · rehber → seçim yazısı · 12-soru → hizmet |
| CRO | seçim yazısı → hizmet ×2, fiyat, GYMWOLVES: var · **OdorGo: yok** | fiyat → hizmet ×3, seçim yazısı, GYMWOLVES, paket: var · **OdorGo: yok** | yok (hizmet SSS 2 karşılıyor) | cro-nedir, 21-taktik, GAP analizi → hizmet: var | GYMWOLVES, OdorGo → hizmet (künye) | karar yazılarından OdorGo'ya · TR benchmark → seçim yazısı |
| E-ticaret | danışman-seçimi → hizmet, fiyat, platform, OdorGo, SOYLU, MKComputer: var | fiyat → hizmet, seçim, platform: var | 2024 kanıt yazısı → hizmet: var | platform → hizmet: var | OdorGo, Meccanotecnica | tam bağlı; içerik 5 günlük — bekle |
| UX | yok | yok | yok | 2026-web-tasarim-trendleri → hizmet: var | İstanbul Ortez, FYR | küme yok — Faz 3 |
| Dijital dönüşüm | yok | yok | yok | ai-donusumu-nedir, pilot, KOBİ 5 adım → hizmet: var | eşleşen vaka yok | küme yok — Faz 3 |

---

## C. Kaldıraçlar

### C.0 Özet

| # | Kaldıraç | Etki (ilk 3 için, 4 hafta) | Maliyet | Kanıt | Ana sorgular |
|---|---|---|---|---|---|
| 1 | On-page hizalama | **Yüksek** (GEO H1, CRO seçenek A) · Orta (AI) | Düşük — içerik dosyası + test | "danışmanlığı" sorgularında hizmet sayfası sıralanıyor; "cro danışmanlığı" ve "geo danışmanlığı" H1 / lede'de yok; CRO başlık istisnası hizmeti öne almadı | geo danışmanlığı, cro danışmanlığı, ai danışmanlığı |
| 2 | İç bağlantı | Orta | Düşük | CRO 18 bağlantıya rağmen 20. sırada → tek başına yetmiyor; ama boşluklar gerçek (12-soru → GEO, rehber → seçim yazısı, 8-soru → seçim yazıları) | şirketimi …, geo ajansı, cro ajansı |
| 3 | Kanıt ve E-E-A-T | Orta **(hipotez)** | Orta — tasarım | 6 sayfada imza yok; kanıt sayfanın sonunda; AI'da tek vaka | yapay zeka danışmanlığı, ai danışmanlığı |
| 4 | Snippet / CTR | Sıralamaya düşük, ilk 3'e girince tıka yüksek | Düşük | para sayfaları 551 göst / 1 tık, bant beklentisi 4,85 | tümü |
| 5 | Off-page | 4 haftada düşük, uzun vadede orta-yüksek | Orta — Burak'ın zamanı | `sameAs`'ta 3 profil; 2 müşteri sitesinden yönlendirme var | geo danışmanlığı (poz 27), yapay zeka danışmanlığı |
| 6 | GEO / AI atıfları | Düşük-orta (ölçülemiyor) | Düşük | 14 AI oturumu; açılış sayfaları hizmetlere zaten bağlı | — |
| 7 | Teknik | Genelde düşük (indeks temiz); UX için yüksek | Düşük | kilit liste 52/52; eski UX adresinin son bilinen taraması 30 Tem | ux ajansı |

### C.1 On-page hizalama

**Önerilen değişiklikler.** Her TR değişikliği aynı PR'da EN karşılığıyla gelir (docs/08 §12.1). SSS sınırı 10-12, her cevap ≥40 kelime ve anaforayla başlamaz (SC); AI, GEO, CRO sayfaları 12'de, yeni soru bir birleştirme ister.

| Sayfa | Alan | Bugün | Öneri | Onay |
|---|---|---|---|---|
| AI | `seo.title` | Yapay zeka danışmanlığı ve pilot uygulama (SERP 51) | **Yapay zeka danışmanlığı (AI): teşhis ve pilot** (SERP 55) — "yapay zeka danışmanlığı" bitişik kalır, "AI" belirteci girer | [B] |
| AI | `seo.description` | Kurumsal yapay zeka danışmanlığı, bu teknolojinin nerede kazandırdığını ölçer. … (150) | Taslak: "AI danışmanlığı: yapay zekanın hangi işte kazandırdığını ölçen teşhis (180.000 TL) ve gerçek veriyle pilot (480.000 TL). Getirmeyen iş listeden çıkar." (150). Fiyat snippet'te fiyat avcısını eler (strateji §1 premium filtre; PK) | [B] |
| AI | lede, 2. cümleden sonra | araçtan değil ölçümden başlar | `cases.ts` rakamıyla kanıt cümlesi: Meccanotecnica Umbra'da teklif talebi 10 katına çıktı, yanıt süresi %90 kısaldı (vaka atfıyla — ADR-018 §3 hizmet düzeyinde uydurma metriği yasaklıyor, vaka atıflı rakamı değil; GEO SSS'inde emsal var) | plan onayı |
| AI | SSS sırası | karşı-konumlandırma soruları 11. ve 12. sırada | 2. ve 3. sıraya (CRO 18 Eyl emsali: "ticari sorgunun hedef cevabı görünür yerde durmalı"); FAQPage sırası da değişir | plan onayı |
| AI | yeni alıcı sorusu | "kimle çalışmalıyım" yok | "Yapay zeka danışmanlığında büyük danışmanlık firmasıyla mı, butik bir ekiple mi çalışmalıyım?" — büyük-butik yazısının özü; 12 sınırı için birleştirme adayı SSS 1 (uygunluk) + SSS 9 (KOBİ ölçeği) | plan onayı |
| GEO | `name` (H1) | Yapay zeka arama optimizasyonu (GEO) | **GEO danışmanlığı**. Ad tek kaynaktan türüyor: breadcrumb, altı GEO yazısının köprü kartı başlığı, hub kartı, ana sayfa kart `aria-label`'ı, Service ve BreadcrumbList JSON-LD, `llms.txt` birlikte döner (CRO 19 Eyl emsali). Kodda elle tutulan başka kopya yok (`diagnoo-report.tsx` `RELATED_SERVICES`'te GEO yok — repo taraması). EN adı ("Generative engine optimization (GEO)") ayrı karar | **[B]** ADR-040 adı |
| GEO | lede | "Yapay zeka arama optimizasyonu (GEO), … yapılan iştir; bir GEO ajansından …" | "GEO danışmanlığı, … yapılan iştir; …" — "yapay zeka arama optimizasyonu" tam formu aynı cümlede açıklama olarak kalır, "GEO ajansı" üçüncü taraf tanımı olarak kalır. İlk 100 kelimede üç ifade de bulunur | H1 ile birlikte |
| GEO | `seo.title` | GEO danışmanlığı: yapay zekada görünürlük (51) | Korunur. İsteğe bağlı: "GEO danışmanlığı: yapay zeka görünürlüğü" (50) — "yapay zeka görünürlük danışmanlığı" (18 / 9,28) zaten bu sayfada | [B] isteğe bağlı |
| GEO | SSS 9 | 22 Ağu–19 Eyl rakamları ("yerli geo aracı" 1,2) | Tazelik: 9 Eki rakamlarıyla güncelleme ("yerli geo aracı" 38 göst / 1,16; "türkçe geo aracı var mı" 39 / 2,64 — Q09), tarih ve kaynakla | plan onayı |
| CRO (A) | `seo.title` | CRO ajansı: dönüşüm oranı optimizasyonu (49) | **CRO danışmanlığı: dönüşüm oranı optimizasyonu** (55) — 18 Eyl istisnası geri alınır | **[B]** |
| CRO (A ve B) | lede | "cro danışmanlığı" yok | ilk cümleye "CRO danışmanlığı" (ör. "Dönüşüm oranı optimizasyonu (CRO danışmanlığı), …"); "CRO ajansı" ikinci yarıda üçüncü taraf tanımı olarak kalır | plan onayı |
| CRO (A ve B) | SSS 2 | CRO ajansı ile dönüşüm optimizasyonu danışmanlığı arasındaki fark nedir? | **CRO ajansı ile CRO danışmanlığı arasındaki fark nedir?** — cevabın mantığı değişmez, INDOLES adı cevapta kalır (KC karşı-konumlandırma testi) | plan onayı |
| UX, E-ticaret, Dijital dönüşüm | — | — | Bu turda on-page yok: UX'te önce eski adresin konsolidasyonu, e-ticarette içeriğin yaşlanması, dijital dönüşüm Faz 3 | — |

**`keyword-coverage.test.ts` muafiyet mekanizması — bugün ve genişletme.**

- **Bugün:** "ajansı / firmaları H1'e ve `seo.title`a girmez" testinde istisna sabit kodlu: `const exemptTitle = s.slug.tr === "cro";` (TR testinde ve EN `agency` testinde, iki yerde). Ölü istisna kalmasın diye iki test daha var: "cro istisnası gerçekten kullanılıyor" (TR ve EN) — başlık "cro ajansı / cro agency" taşımak, H1 temiz kalmak zorunda. H1 (`name`) için muafiyet yok; yasak 13 hizmetin 13'ünde geçerli. `TARGETS` yalnız ifadenin arama yüzeyinin herhangi bir yerinde bulunmasını denetler, yerini ve sıklığını denetlemez.
- **Genişletme önerisi (kod değil, uygulama turunda):**
  1. Sabit kodu adlı bir haritaya taşı: `TITLE_AJANSI_ISTISNALARI = { cro: { tr: "cro ajansı", en: "cro agency", karar: "Burak, 2026-09-18" } }`. Yasak testi `slug in TITLE_AJANSI_ISTISNALARI` ile muaf tutar; "istisna kullanılıyor" testi `it.each(Object.entries(...))` ile her kayıt için çalışır. Böylece istisna eklemek ve kaldırmak tek satır olur ve her istisnanın karar sahibi testte görünür.
  2. **Seçenek A seçilirse** `cro` kaydı haritadan silinir; "kullanılıyor" testi kendiliğinden boş kümeye düşer, ölü istisna kalmaz. `TARGETS` `["cro","cro ajansı"]` lede ve SSS 2 ile geçmeye devam eder; `TARGETS_ARTICLES` `["cro-ajansi-nasil-secilir","cro ajansı"]` değişmez.
  3. **H1 kilidi** (yeni `NAME_TARGETS`): `["ai-danismanlik","yapay zeka danışmanlığı"]`, `["e-ticaret","e-ticaret danışmanlığı"]`, `["cro","dönüşüm oranı optimizasyonu"]` ve karar 2 onaylanırsa `["geo-danismanligi","geo danışmanlığı"]`. H1 kararları sessizce geri dönmesin (A-7).
  4. Yeni `TARGETS` satırları: `["ai-danismanlik","ai danışmanlığı"]`; A seçilirse `["cro","cro danışmanlığı"]`.
  5. **Genişletilmeyecek:** GEO ya da AI başlığına "ajansı" istisnası önerilmiyor. Veri, "ajansı" sorgusunun hizmet sayfasına değil yazıya gittiğini gösteriyor; CRO istisnası bunu değiştirmedi.
- **Ek bulgu:** SC `seo.title ≤ 60` denetliyor, ama layout şablonu " — INDOLES" (+10 karakter) ekliyor. SERP sınırı (docs/08 §7.3: 60) için gerçek sınır `seo.title ≤ 50`; e-ticaret başlığı şablonla 59'da, sınırda.

### C.2 İç bağlantı ağırlığı

Donör sayfalar P09 gösterimine göre sıralandı. "Var" = bugün mevcut, dokunulmaz.

| # | Kaynak (P09 göst / poz) | Hedef | Çapa (öneri) | Yer | Hedef sorgu | Durum |
|---|---|---|---|---|---|---|
| 1 | `/en/articles/ecommerce-conversion-rate-benchmarks` (696 / 16,29) | EN CRO ve e-commerce hizmetleri | var ("our CRO consultancy", "the conversion rate optimisation service page") | — | TR para setine doğrudan katkı yok; v1.18 EN yatırımı yok | değişiklik yok |
| 2 | `chatgpt-reklamlari-turkiye` (591 / 15,63; 6 tık; Gemini'den 4 AI oturumu — GA-AI) | GEO hizmet | var ("GEO danışmanlığı hizmetimizde") | — | geo danışmanlığı | değişiklik yok |
| 3 | `yapay-zeka-aramalarinda-nasil-one-cikarsiniz` — GEO rehberi (144 / 7,76) | `/yazilar/geo-ajansi-nasil-secilir` | "GEO ajansı nasıl seçilir" | ajans / ekip seçimini anan paragraf ya da kapanış | geo ajansı | **yeni** |
| 4 | `turkiyenin-ilk-geo-denetim-araci` (91 / 2,71) | GEO hizmet | var ("GEO danışmanlığı") | — | — | değişiklik yok |
| 5 | `google-ai-overviews-da-yer-almak` (81 / 9,38) | GEO hizmet | var ("GEO danışmanlığı hizmetimizde") | — | — | değişiklik yok |
| 6 | `e-ticaret-donusum-orani-benchmark` (75 / 3,75; 2 tık) | `/yazilar/cro-ajansi-nasil-secilir` | "CRO ajansı seçerken" | CRO hizmet bağlantısının olduğu kapanış | cro ajansı (A) | **yeni** |
| 7 | `2026-web-tasarim-trendleri` (74 / 4,91; 8 tık — sitenin en çok tık alan sayfası) | UX hizmet | "UX ajansı olarak nasıl çalıştığımızı" — CRO ve GEO yazılarındaki "… ajansı olarak nasıl çalıştığımız" çapasının emsali; ya da bugünkü çapa korunur | mevcut bağlantı cümlesi | ux ajansı | **[B]** çapa dili |
| 8 | `geo-ajansi-nasil-secilir` (70 / 11,36) | GEO hizmet | var (3 bağlantı) | — | — | değişiklik yok |
| 9 | `ai-danismani-secerken-sorulacak-12-soru` (60 / 7,23) | GEO hizmet | "GEO danışmanlığı" | blok 3 — GEO ayrımını anlatan köprü paragrafı | şirketimi …, geo danışmanlığı | **yeni** (DT §11 #4) |
| 10 | aynı yazı | `/yazilar/ai-donusumune-nereden-baslanir-90-gunluk-pilot` | "90 günlük pilot" | pilot süresi sorusu | hub boşluğu | **yeni** |
| 11 | `dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru` (30 / 9,50; "hangi ajansla çalışmalıyım" 9 / 11,56) | `cro-ajansi-nasil-secilir`, `geo-ajansi-nasil-secilir` | "CRO ajansı nasıl seçilir", "GEO ajansı nasıl seçilir" | sonuç bölümünde tek yönlendirme cümlesi | hizmet terimi taşımayan alıcıyı para kümelerine taşımak | **yeni** |
| 12 | `yapay-zeka-danismanligi-fiyatlari` (11 / 30,36) | `/vakalar/meccanotecnica-umbra-teklif-portali` | "Meccanotecnica Umbra" | getiri hesabı bölümü | kanıt halkası | **yeni** |
| 13 | `cro-ajansi-nasil-secilir` ve `cro-danismanligi-fiyatlari` | `/vakalar/odorgo-kategori-yaratma` | "OdorGo" | rakamlı vaka isteme bölümü | kanıt halkası | **yeni** |
| 14 | `/tr/danismanlar/burak-ozgul` (38 / 8,24) | AI, GEO, CRO hizmetleri | uzmanlık alanının adı | profilin "Uzmanlık" listesi → hizmet bağlantısı (kod: `expertise` → hizmet eşlemesi; danışman sayfaları bugün hizmetlere hiç bağlanmıyor — CN ve danışman route'u) | E-E-A-T + iç bağlantı | **yeni** (danışman eşlemesi [B]) |
| 15 | `/tr` ana sayfa (41 / 7,00; GA4'ün en büyük açılışı, 54 oturum) | 3 P0 hizmet | hizmet adı. Bugün kart çapası "Keşfet", ad yalnız `aria-label`'da (`ServicesScroll.tsx`) | — | genel | **[B]** tasarım |

Bilinçli olarak donör seçilmeyenler: `/tr/danismanlar/mert-kaplan` (73 göst) isim araması ve görüntü yönetmeni profili; konusal bağ yok. EN yazılar (`what-is-llms-txt` 202, `how-to-choose-a-geo-agency` 83) zaten EN GEO hizmetine bağlı; TR para setine katkıları dolaylı.

### C.3 Kanıt ve E-E-A-T

| Bileşen | Bugün (6 sayfa) | Eksik | Öneri | Onay |
|---|---|---|---|---|
| Rakamlı vaka | Altı sayfada var, sayfanın en altındaki "İlgili" bölümünde (SD; tablo B.1) | İlk ekranda rakam yok; AI'da tek vaka; dijital dönüşümde eşleşmeyen vaka | Lede'ye vaka atıflı tek kanıt cümlesi (AI, GEO, CRO); kanıt şeridini hero'nun altına almak tasarım kararı | lede: plan onayı · yer: **[B]** |
| Danışman imzası | Hiçbir hizmet sayfasında yok; yazılarda yazar var (Burak, Can Aydınlık) | Hizmeti kimin yürüttüğü görünmüyor. `consultants.ts`'te CRO ya da GEO uzmanlığı yazan danışman yok; Burak'ın uzmanlık listesinde "yapay zeka danışmanlığı" var (CN) | "Bu işi kim yürütüyor" bloğu: ad, unvan, profil bağlantısı (Person şeması profil sayfasında zaten var — JL `personLd`). Yalnız Burak'ın onayladığı eşleme; uzmanlık uydurulmaz | **[B]** |
| Fiyat şeffaflığı | AI, CRO, e-ticaret, UX, dijital dönüşümde paket fiyatı sayfada ve Service `offers`'ta (PK) | GEO'da paket ve fiyat yok | GEO paket / fiyat bandı kararı → GEO fiyat yazısı (Hafta 3) | **[B]** |
| Müşteri logosu | Kanıt kartı müşteri adını basıyor, logoyu basmıyor (SD `caseProofCards`) | — | Düşük öncelik; logolar ana sayfa ve vaka sayfalarında | — |
| Dış doğrulama | GBP `sameAs`'ta (CO); Clutch, GoodFirms, Sortlist yorumu yok | Üçüncü taraf yorumu | Dizin profilleri + yorum ritüeli (DPK §9) | **[B]** |

### C.4 Snippet / CTR

| Sayfa | SERP başlığı (şablonla) | Description (karakter) | Risk |
|---|---|---|---|
| AI | Yapay zeka danışmanlığı ve pilot uygulama — INDOLES | 150 | 136 göst / 0 tık; fark yaratan bilgi (açık fiyat, ölçülen pilot) snippet'te yok |
| GEO | GEO danışmanlığı: yapay zekada görünürlük — INDOLES | 150 | Poz 27'de snippet ikincil |
| CRO | CRO ajansı: dönüşüm oranı optimizasyonu — INDOLES | 157 | Aynı SERP'te yazının başlığı da "CRO ajansı …" ile başlıyor |
| Seçim yazıları | "CRO ajansı nasıl seçilir? Kontrol listesi — INDOLES" · "GEO ajansı nasıl seçilir? Kontrol listesi — INDOLES" | — | Sorguyla birebir; ilk 3'e en yakın sayfalar |

**Kontrol adımı (Hafta 1 ve Hafta 3; Burak ya da Burak'ın tarayıcı oturumuyla Claude yapar, bu belge yapmadı).** Gizli pencere, google.com.tr, dil TR, konum İstanbul; masaüstü ve mobil. Sorgular: ai danışmanlığı · yapay zeka danışmanlığı · geo danışmanlığı · geo ajansı · cro ajansı · cro danışmanlığı · ux ajansı · şirketimi … önerir misin. Her sorgu için kayıt:

1. INDOLES hangi URL ile, kaçıncı sırada.
2. Görünen başlık `seo.title + " — INDOLES"` mi, Google yeniden yazmış mı.
3. Açıklama bizim description mı.
4. AI Overview ya da AI Mode bloğu var mı; INDOLES kaynak gösteriliyor mu.
5. İlk 3'teki rakipler: alan adı ve sayfa türü (hizmet sayfası / liste / blog / dizin).

Kayıt `GSC-Data/serp-kontrol-2026-10-14.md`. 5. madde §B.3'teki **"ajansı = seçim niyeti"** hipotezinin testidir: "cro ajansı"nda ilk 3 liste ve rehber sayfalarıysa Seçenek A doğrulanır.

### C.5 Off-page

| Kanal | Bugün (veri) | Öneri | Sahibi | Etki / zaman |
|---|---|---|---|---|
| Google İşletme Profili | Ad ve kayıt tamam (DT §12.1); `kgmid` `sameAs`'ta (CO) | Yorum ritüeli: her kapanan projeye aynı şablon (DPK §9 — yalnız memnun müşteriye seçerek istenmez) | Burak | Orta; marka ve yerel |
| Clutch · GoodFirms · Sortlist | Kit hazır (DPK §6.3-6.5); DT §12.1'deki "dizin kayıtları tamam" satırının bunları kapsayıp kapsamadığı teyit edilmeli | Canlı olanlar `company.ts` `profiles` → Organization `sameAs` (Claude); Clutch yorum ritüeli | Burak → Claude | Orta (AI listelerine ve GEO'ya girdi); 4 haftada sıralamaya etkisi düşük |
| Müşteri siteleri | fyrluxury.com 9 oturum / 1 kullanıcı (footer bağlantısı); meccanotecnica.com.tr 1 oturum (GA-K) | Diğer vakalar için (OdorGo, GYMWOLVES, SIM Baskı, İstanbul Ortez, SOYLU AVM, MKComputer) "INDOLES ile çalıştık" / künye bağlantısı talebi: **marka çapası**, hedef ana sayfa ya da ilgili vaka. Site geneli, anahtar kelime çapalı footer bağlantısı **istenmez** (Google bağlantı şeması riski) | Burak (talep), Claude (metin taslağı) | Uzun vadede orta-yüksek; 4 haftada sınırlı |
| Dijital PR | Benchmark: EN 696 göst, TR 75 / 3,75; GEO ölçüm serisi Ay 0–2 kayıtlı | Hafta 4: basın notu taslağı ve hedef medya listesi (Webrazzi, Marketing Türkiye, Pazarlamasyon — OSO §1 PR-lite). Bağlantı istenmez, haber değeri verilir | Claude taslak · Burak gönderir | Faz 3 |
| LinkedIn şirket sayfası | linkedin.com'dan 28 günde 1 oturum (GA-K) | Haftada 1 gönderi, her biri bir para sayfasına ya da karar yazısına (4 haftada 4) | Burak | Doğrudan etkisi düşük; varlık sinyali |
| Bilinmeyen yönlendirmeler | sahce.com 1, bionluk.com 1 oturum (GA-K) | Kaynak teyidi (§G-9) | Burak | — |
| **Yapılmayacak** | — | Bağlantı satın alma, PBN, misafir yazı ağı, alakasız dizin (OSO ilkesi) | — | — |

### C.6 GEO / AI atıfları

- **AI Overviews ve AI Mode:** GSC ikisini ayırmıyor. Para sorgularında AIO çıkıp çıkmadığı C.4 kontrolünde kaydedilir. Konuşma biçimli sorguların bir kısmının AI Mode olması mümkün **(hipotez)**; bu, poz 1-10'da 0 tık desenini açıklayabilir.
- **On-page zemin hazır:** altı sayfada tanım-önce lede ("X, … işidir"), FAQPage JSON-LD, soru biçimli SSS; `llms.txt` hizmet URL'lerini veriden üretiyor (ADR-018). Eksik olan yer ve sıra: AI'da alıcı sorusu sonda, GEO'da H1 ve lede bilgi ifadesinde (C.1).
- **AI Assistant açılış sayfaları zaten hizmetlere bağlı** (GA-AI, ART): `chatgpt-reklamlari-turkiye` (4 oturum) → GEO, e-ticaret, performans pazarlama · OdorGo EN vakası (2) → künye üzerinden CRO, e-ticaret · benchmark TR/EN (1+1) → CRO, e-ticaret · `/tr`, `/en` (3) → hizmet kartları ("Keşfet" çapası). Yapısal boşluk yalnız ana sayfa çapası (C.2 #15).
- **GEO turu:** prompt setinde GEO hizmetini soran prompt yok (K1-K4, S1-S3, C1-C3 — `GEO-Olcum-Rutini.md`). Seri kırılmasın diye set değişmez; GEO hizmetinin AI tarafı GA4 AI yönlendirme satırıyla haftalık izlenir (DT §9 karar maddesi 2).

### C.7 Teknik (yalnız veriyle)

| Kalem | Veri | Durum | İş | Etki |
|---|---|---|---|---|
| Workers CPU | 2–8 Eki `exceededResources` 0; Workers Paid alındı (DT §8.1, §12.1) | Kapandı | — | — |
| İndeks | Kilit liste 52/52, yeni içerik 16/18 (İ09, İY09); altı TR hizmet sayfası dizinde | Temiz | Değişen URL'ler için deploy sonrası URL denetimi + dizine ekleme isteği | Yüksek (değişikliğin görünme hızı) |
| Eski UX adresi | `/web-tasarim-ui-ux-tasarimi/` son bilinen tarama 30 Tem (İD §2, 18 Eyl denetimi); "ux ajansı" 9 Eki'de hâlâ orada (QP09) | Açık | Burak'ın dizine ekleme isteği (DT §12.1 listesinde) — yapıldığının teyidi | ux ajansı için tek kaldıraç |
| İki atlamalı yönlendirme | 32 yönlendirmenin 25'i iki atlamalı (`/x/` → `/x` → hedef — D22 §5); GSC'deki eski UX adresi sondaki eğik çizgiyle bu gruptadır | Açık | Sondaki eğik çizgili kaynakları tek atlamaya indirmek (`legacy-redirects.ts` + `legacy-sitemap.test.ts`) | Düşük-orta **(hipotez)** |
| hreflang / karışık locale | `/en/danismanlar/mert-kaplan` 2, `/en/hizmetler/build` 2 göst (P09); 18 Eyl'den beri 308 (ADR-039) | Kalıntı | — | — |
| Core Web Vitals | Workers'a geçişten beri production ölçümü yok (docs/19 §8); hizmet sayfası yanıtı 0,32-0,81 sn, HTML ~180-200 KB (İD) | **Veri yok** | 6 hizmet sayfası için PSI (lab) + GSC CWV raporu (Burak); yalnız "Kötü" çıkarsa iş açılır | Bilinmiyor |
| Yapılandırılmış veri | 137 sayfada breadcrumb zengin sonucu, 0 sorun; FAQ zengin sonucu Google'da yalnız resmi ve sağlık sitelerine gösteriliyor (D22 §1) | Tamam | — | — |
| `seo.title` sınırı | SC ≤60 denetliyor, şablon +10 ekliyor (C.1) | Sınırda | Testi `≤50` yapmak ya da şablonla ölçmek | Düşük |
| `updatedAt` | UX'te yok → lastmod build anı (İD notları) | Açık | İçerik değiştiğinde tarih | Düşük |

---

## D. 4 haftalık sprint (13 Ekim – 9 Kasım)

Kurallar: hafta başına ≤5 iş. Kod ve içerik işleri opus ajanında, görev başına bir worktree; Fable review eder (çalışma biçimi). **[B]** = ayrıca açık Burak onayı. Haftalık GSC çekimi Perşembe (16, 23, 30 Eki, 6 Kas). Aynı sayfanın title'ına 2 Kas'tan önce ikinci kez dokunulmaz.

### D.1 Hafta 1 — 13–19 Ekim: AI, GEO, CRO

| # | İş | Sahibi | Çıktı | Kabul kriteri | Hedef sorgu | Onay |
|---|---|---|---|---|---|---|
| 1 | **Ölçüm tabanı ve SERP kontrolü:** (a) para seti 9 Eki baz tablosu haftalık log'a; (b) 15 Eki temiz pencere çekimi `node scripts/gsc-pull.mjs --start 2026-09-19 --end 2026-10-12 --out <geçici klasör>` (CRO kararı + CTR revizyonunun temiz okuması, DT §6); (c) C.4 protokolüyle 8 sorguluk SERP kontrolü | Claude (a, b) · Burak ya da Burak'ın oturumuyla Claude (c) | `haftalik-log.md` para seti satırı · geçici çekim · `GSC-Data/serp-kontrol-2026-10-14.md` | 15 sorgunun 9 Eki değeri kayıtlı; SERP kaydında her sorgu için ilk 3 rakip, başlık yeniden yazımı, AIO var / yok | tümü | (c) tarayıcı oturumu |
| 2 | **`ai-danismanlik` on-page paketi:** title ve description; karşı-konumlandırma SSS'leri 2-3. sıraya; büyük-butik alıcı sorusu (bir SSS birleşir); lede'ye Meccanotecnica kanıt cümlesi; EN paritesi; KC'ye `["ai-danismanlik","ai danışmanlığı"]` | opus ajan → Fable | PR + deploy | `pnpm vitest run tests/unit/keyword-coverage.test.ts tests/unit/services-content.test.ts` yeşil; `seo.title` ≤50; SSS 10-12, cevaplar ≥40 kelime; title / description Burak'ın seçtiği metin; `updatedAt` güncel | ai danışmanlığı, yapay zeka danışmanlığı, yapay zeka danışmanı, … fiyat farkı | **[B]** title + description |
| 3 | **`geo-danismanligi` hizalama + üç iç bağlantı:** H1 "GEO danışmanlığı"; lede "GEO danışmanlığı, …"; 12-soru blok 3 → GEO hizmet ("GEO danışmanlığı"); GEO rehberi → `geo-ajansi-nasil-secilir`; 8-soru sonucu → CRO ve GEO seçim yazıları | opus ajan → Fable | PR + deploy · ADR-040 notu · strateji changelog | KC'ye H1 kilidi (`name` "geo danışmanlığı" taşır); `service-detail` testleri yeni adı breadcrumb ve JSON-LD'de görüyor; yeni bağlantılar TR ve EN'de çözülüyor (`inline-markdown.test.tsx`: her satır içi slug geçerli) | geo danışmanlığı, yapay zeka görünürlük danışmanlığı, geo ajansı, şirketimi … | **[B]** H1 |
| 4 | **CRO kararı (15 Eki) ve uygulaması:** temiz pencereyle karar notu (DT §7'ye ek). A seçilirse: hizmet title "CRO danışmanlığı: dönüşüm oranı optimizasyonu", lede ve SSS 2'de "CRO danışmanlığı", KC'de `cro` istisnasının kaldırılması (C.1 madde 2), TR benchmark → seçim yazısı bağlantısı. B seçilirse: yalnız lede ve SSS 2 | Claude karar notu → Burak → opus ajan | Karar notu + PR | Karar kayıtlı; KC yeşil ve ölü istisna yok; `cro-ajansi-nasil-secilir` title'ı değişmiyor | cro ajansı, cro danışmanlığı | **[B]** seçenek + title |
| 5 | **Burak'ın GSC ve dış işleri:** (a) eski UX adresi ve iki EN e-ticaret yazısı için dizine ekleme isteğinin yapıldığının teyidi; (b) deploy sonrası değişen URL'ler için "dizine eklenmesini iste" (AI, GEO, CRO hizmetleri, 12-soru, GEO rehberi, 8-soru); (c) 9 Eki canlı form testinin sonucu (DT §12.1'e göre log'da olmalı, log'da görünmüyor); (d) §G sorularının cevabı | Burak | GSC istek kayıtları · cevaplar | 6 URL'nin istek tarihi log'da; form testi sonucu yazılı | tümü | **[B]** |

### D.2 Hafta 2 — 20–26 Ekim: kanıt ve bağlantı

| # | İş | Sahibi | Çıktı | Kabul kriteri | Hedef sorgu | Onay |
|---|---|---|---|---|---|---|
| 1 | Haftalık para seti tablosu (23 Eki) + Hafta 1 URL'lerinin `pnpm gsc:inspect` taraması; ai danışmanlığı'nda yeni AI yazılarının sorguya girip girmediği (A.5 madde 5) | Claude | log satırı | 15 sorgu güncel; değişen URL'lerin son tarama tarihi deploy sonrası | tümü | — |
| 2 | **E-E-A-T bloğu:** hizmet sayfasında "Bu işi kim yürütüyor" (ad, unvan, profil bağlantısı) ve kanıt cümlesinin üst bölüme alınması — önce AI, GEO, CRO | opus ajan (tasarım + içerik) → Fable → Burak | PR | Yalnız Burak'ın onayladığı danışman eşlemesi; rakam yalnız `cases.ts`'ten; `service-detail` ve `service-case-proof` testleri yeşil | ai, geo, cro sorguları | **[B]** tasarım + eşleme |
| 3 | **İç bağlantı dalgası 2:** C.2 #10, #12, #13, #14 (danışman "Uzmanlık" → hizmet, kod) ve #7 (UX çapası); A seçilmediyse de #6 | opus ajan | PR | Tüm bağlantılar TR ve EN'de çözülüyor; orphan sayfa yok | cro ajansı, ai, ux ajansı | **[B]** yalnız #7 çapa dili |
| 4 | **Araç ↔ yazı ayrımı (A-6):** araç sayfası title'ı "Türkçe GEO aracı …"; yazının title'ı duyuru çerçevesine | opus ajan | PR | `TARGETS_TOOLS` yeşil; sonraki iki çekimde "türkçe geo aracı var mı" / "yerli geo aracı" araç sayfasına kayıyor mu izlenir | para dışı (tek lead olayının kaynağı araç) | **[B]** title |
| 5 | **`gsc-pull.mjs` para seti bölümü (§E.5) + KC istisna haritası refaktörü (C.1)** | opus ajan | PR + test | `--from-dir` ile 9 Eki bazı 0 / 6 / 5 / 4 test fikstürüyle sabit; KC yeşil | ölçüm | — |

### D.3 Hafta 3 — 27 Ekim – 2 Kasım: ara değerlendirme ve otorite

| # | İş | Sahibi | Çıktı | Kabul kriteri | Hedef sorgu | Onay |
|---|---|---|---|---|---|---|
| 1 | Haftalık tablo (30 Eki) + **2 Kas ara değerlendirme:** Hafta 1 değişikliklerinden sonraki türetilmiş pozisyonlar; her sorgu "ilerliyor / sabit / geriliyor" ve sonraki kaldıraç | Claude | ara not (log) | Her sorguya tek satır karar | tümü | — |
| 2 | **GEO karar kümesinin eksik halkası:** Burak GEO paket / fiyat bandını verdiyse "GEO danışmanlığı fiyatları" yazısı (TR + EN; rehber ≥1.500 kelime kuralı, docs/03 §6a.1) | opus ajan → Fable → Burak | PR (yazı) | Fiyat yalnız Burak'ın verdiği; KC'ye yazı hedefi; hizmet SSS 5'in fiyat cevabıyla çelişmiyor | geo danışmanlığı, ai görünürlük danışmanlığı paket fiyatları | **[B]** fiyat |
| 3 | **Off-page:** canlı dizin profillerini `sameAs`'a ekleme; Burak'ın onayladığı müşterilere bağlantı talebi metni | Claude (kod + taslak) · Burak (gönderim) | PR + e-posta taslakları | `sameAs`'ta yalnız canlı ve doğrulanmış URL; taslakta anahtar kelime çapası yok | genel otorite | **[B]** dış talepler |
| 4 | GEO Ay 3 turu (1 Kas) + GA4 AI yönlendirme satırı | Claude (tarayıcı oturumu Burak) | `GEO-Olcum/kayitlar.csv` | 30 sorgu tamam ya da eksik motor gerekçeli | GEO | — |
| 5 | **Teknik:** 6 hizmet sayfası PSI ölçümü + GSC CWV raporu (Burak); iki atlamalı yönlendirmelerin tek atlamaya indirilmesi (UX eski adresi dahil) | Claude / opus ajan | ölçüm notu + PR (yalnız yönlendirme) | `legacy-sitemap.test.ts` yeşil; eski adres tek 308 ile hedefe gidiyor | ux ajansı | — |

### D.4 Hafta 4 — 3–9 Kasım: ikinci tur ve Faz 3 hazırlığı

| # | İş | Sahibi | Çıktı | Kabul kriteri | Hedef sorgu | Onay |
|---|---|---|---|---|---|---|
| 1 | Haftalık tablo (6 Kas) | Claude | log | — | tümü | — |
| 2 | **İkinci on-page turu** — yalnız 2 Kas ara notunun "ilerlemiyor" dediği 1-2 sayfada (ör. yapay zeka danışmanlığı 10'da kaldıysa AI sayfasına "nasıl işler" derinliği ve ikinci kanıt) | opus ajan → Fable | PR | Değişikliğin gerekçesi ara notta | ilerlemeyen sorgular | **[B]** title / H1 değişirse |
| 3 | **Dijital PR paketi:** benchmark ve GEO ölçüm serisi basın notu + hedef medya listesi | Claude taslak · Burak gönderir | basın notu taslağı | Bağlantı talebi içermiyor; her rakam kaynaklı | otorite (Faz 3) | **[B]** gönderim |
| 4 | **UX konsolidasyon kontrolü:** "ux ajansı" yeni hizmet sayfasına geçti mi; geçmediyse Faz 3 "UX ajansı itişi"nin kapsamı | Claude | not | — | ux ajansı | — |
| 5 | **30 Kasım raporu şablonu:** A-4 + para seti + sayfa düzeyi tık + GA4 form | Claude | şablon | §E.2 ölçülerinin hepsi şablonda | ölçüm | — |

LinkedIn ritmi (haftada 1 gönderi) dört hafta boyunca Burak'ta sürer; sprint slotu saymaz.

### D.5 Burak onayı gerektiren maddeler

| # | Madde | Hafta | Yer |
|---|---|---|---|
| 1 | 30 Kasım hedefleri ve tık ölçüsünün sayfa düzeyine geçmesi | 1 | §E.2 |
| 2 | GEO H1 "GEO danışmanlığı" (ADR-040'taki ad) ve EN adı | 1 | §C.1 |
| 3 | AI title ve description metni | 1 | §C.1 |
| 4 | CRO seçenek A / B ve hizmet title'ı | 1 (15 Eki) | §B.3, §C.1 |
| 5 | Dizin profilleri (Clutch, GoodFirms, Sortlist) durumu | 1-3 | §C.5 |
| 6 | "UX ajansı olarak" çapa dili | 2 | §C.2 #7 |
| 7 | Araç / yazı title değişimi | 2 | §B.3 |
| 8 | Danışman imzası eşlemesi ve kanıtın yeri (tasarım) | 2 | §C.3 |
| 9 | Ana sayfadan P0 hizmetlere metin bağlantısı (tasarım) | 2-3 | §C.2 #15 |
| 10 | GEO paket / fiyat bandı | 3 | §C.3 |
| 11 | Müşteri sitelerinden bağlantı talepleri (hangi müşteri, hangi metin) | 3 | §C.5 |
| 12 | Dijital PR gönderimi | 4 | §C.5 |

---

## E. Ölçüm

### E.1 Haftalık "para seti pozisyon tablosu"

Her Perşembe çekiminden sonra `haftalik-log.md`'ye, 9 Eki bazıyla:

```
### Para seti (İlk 3 programı) — çekim <tarih>, pencere <başlangıç–bitiş>
Bant: ilk 3 <n> · 4-10 <n> · 11-20 <n> · 20+ <n>   (9 Eki: 0 · 6 · 5 · 4)
Para seti: <göst> göst / <tık> tık                    (9 Eki: 286 / 1)
Para sayfaları sayfa düzeyi (17 URL): <göst> / <tık>  (9 Eki: 551 / 1)
Konuşma biçimli 2 sorgu hariç bant: ...

| Sorgu | Kazanan sayfa | Göst | Poz | Tık | Bant | Δ poz (önceki) | Son hafta (türetilmiş) | Sıralanan sayfa(lar) | Not |
```

### E.2 30 Kasım hedefleri

30 Kasım çekiminin penceresi ≈29 Eki–27 Kas olur; Hafta 1-2 değişikliklerinin tamamen sonrasını ölçer.

| Ölçü | Bugün (9 Eki) | Taban (altı alarm) | Hedef | Gerekçe |
|---|---|---|---|---|
| İlk 3'te para sorgusu | 0 | ≥2 | **≥4** (iddialı) | En yakın adaylar: şirketimi … 5,80 · cro danışmanlığı 6,69 · cro ajansı (yazı) 6,80 · ai danışmanlığı 7,00 · geo ajansı son hafta ≈5,7. Son üç çekimde doğal hareket yavaş (şirketimi 6,38 → 5,80; seçim yazısı "cro ajansı"nda 6,22 → 6,80 geriledi; ai danışmanlığı 4,08 → ≈9,9 geriledi). Dört sorgunun 3-4 kademe kazanması on-page ve bağlantı işiyle mümkün ama garantili değil. Yapay zeka danışmanlığı (Big4 ve exact-match alan adlarının olduğu SERP — RA §2) ve geo danışmanlığı (poz 27) bu takvimde ilk 3 adayı değil **(hipotez)** |
| İlk 10'da para sorgusu | 6 | ≥8 | **≥10** | Eşikte iki sorgu (yapay zeka danışmanlığı 10,29; ux ajansı 10,46) + geo ajansı (son hafta ≈5,7) → 9; onuncu yapay zeka danışmanı (hizmette 11,00) ya da e ticaret ajansı |
| Para sayfaları sayfa düzeyi tık (anonim sorgular dahil) | 1 / 29 gün (551 göst) | ≥5 | **≥10** | Hesap E.3 |
| N0 niyetli tık (GSC'de görünen sorgu) | 1 | — (izleme) | ≥3 | Hesap E.3; ≥8 bu ölçüyle gerçekçi değil |
| Form / brief (GA4) | 1 (28 gün; `tool_report_requested`); `contact_form_submitted` 0 | — | ≥1 organik kaynaklı | Hesap E.4 |

Strateji §9'un birincil ölçüleri ve A-4 değişmez; bu tablo 30 Kasım raporuna ek satır olarak girer.

### E.3 Tık hesabı (DT §14 bantlarıyla)

İki mercek:

| Bant | Sayfa CTR'ı (P09; anonim dahil) | Görünen sorgu CTR'ı (Q09) |
|---|---|---|
| ≤3 | %0,00 (106 göst / 0 tık; çoğu GEO aracı yazısı — niyet uyuşmazlığı) | %0,00 (143 / 0) |
| 3-5 | **%4,35** (299 / 13) | %1,00 (100 / 1) |
| 5-10 | %1,59 (1.322 / 21) | %0,55 (361 / 2) |
| 10-20 | %0,83 (2.172 / 18) | %0,00 (292 / 0) |
| 20+ | %0,55 (183 / 1) | %0,17 (582 / 1) |

Kaynak: P09, Q09, hesap. Sitenin kendi ≤3 bandı veri olarak kirli olduğu için ilk 3'e 3-5 bandının CTR'ı **taban** olarak uygulandı; gerçek ilk 3 CTR'ı bunun üstünde olabilir **(hipotez)**.

**"Hedef" senaryosu (30 Kas):** ilk 3'te dört sorgu (geo ajansı 31, şirketimi 30, ai danışmanlığı 26, cro danışmanlığı 13 = 100 göst); 4-10'da altı sorgu (yapay zeka danışmanlığı 31, ux ajansı 28, cro ajansı 18, yapay zeka görünürlük danışmanlığı 18, … fiyat farkı 5, yapay zeka danışmanı 5 = 105 göst); kalan 81 göst 11-20'de.

- Görünen sorgu merceğiyle: 100 × %1,00 + 105 × %0,55 + 81 × %0,00 = **≈1,6 tık** / 29 gün.
- Sayfa merceğiyle: 100 × %4,35 + 105 × %1,59 + 81 × %0,83 = **≈6,7 tık**; set dışındaki N0 gösterimi (331 − 286 = 45) ile ≈7.
- Sonuç: "**≥8 niyetli tık / ay**" görünen sorgu ölçüsüyle gerçekçi değil (hedef senaryoda bile ≈1,6); sayfa merceğiyle sınırda. Gösterimin sayfa 2'den sayfa 1'e çıkınca artması (yapay zeka danışmanlığı KWP'de 100-1B) yukarı yönlü belirsizlik **(hipotez)**.

**Para sayfaları, sayfa düzeyi:** bugün 551 göst / 1 tık; bugünkü bantlarla beklenen 4,85. Hedef senaryoda AI hizmet (136) 4-10'a → 2,2 (3-5'e çıkarsa 5,9); geo seçim yazısı (70) 3-5'e → 3,0; 12-soru (60) 3-5'e → 2,6; GEO hizmet (109) 11-20'ye → 0,9; CRO seçim yazısı (39) 4-10'a → 0,6; eski UX adresi / UX hizmet (52) 4-10'a → 0,8; kalan 85 göst ~%1 → 0,85. Toplam **≈11-15** → hedef ≥10, taban ≥5.

### E.4 Form / brief (GA4)

- 28 günde (10 Eyl–7 Eki) form / brief toplamı 1: `tool_report_requested` (23 Eyl). `contact_form_submitted` 0, popup gönderimi 0; `booking_cta_clicked` 3, `phone_clicked` 1 (GA-L, GA-Ö).
- Organik arama 66 oturum (GA-K); hizmet ve karar sayfalarına açılış 18 oturum, `ai-danismanlik`e 0 (GA-S).
- Para sayfaları ayda 10-15 tıka çıksa, bu kadar ek oturum gelir. Sitenin bu sayfalardaki dönüşüm verisi 18 oturumda 0 form; %3-5 varsayımıyla (hipotez) ayda 0,3-0,75 form. **Strateji §9.1'in "ayda 5+ nitelikli form" hedefi bu takvimde organikten ulaşılabilir değil.** Bu fark 30 Kasım raporunda strateji revizyonunun girdisidir.
- Önkoşul: `contact_form_submitted` tüm kanallarda 28 günde 0 (71 e-posta oturumu dahil). 9 Eki canlı form testinin sonucu teyit edilmeden form ölçüsü okunmaz (D.1 #5c).

### E.5 `scripts/gsc-pull.mjs` — para seti bölümü (öneri, kod değil)

- **Veri:** `scripts/para-seti.mjs`te `PARA_SETI` dizisi — `{ sorgu, varyantlar[], hizmet, kazananSayfa, niyet }`, 15 kayıt. Liste mantıktan ayrı tutulur ki set değişikliği kodu değiştirmesin.
- **Fonksiyon:** `paraSeti(sorguRows, sorguSayfaRows, onceki?)` her kayıt için birleşik gösterim / tık / ağırlıklı pozisyonu, bandı, sıralanan sayfaları (göst / poz), kazanan sayfanın sıralanıp sıralanmadığını ve kendi pozisyonunu, `onceki` verilirse Δ ve türetilmiş son haftayı döner.
- **Çıktı:** `ozet.txt`'e "## Para seti (İlk 3 programı)" bölümü (E.1 biçimi) ve `para-seti.csv`; özet satırına bant sayıları ve para sayfalarının sayfa düzeyi göst / tık.
- **Bayraklar:** `--prev <dir>` (Δ ve son hafta için önceki çekim) · mevcut `--from-dir` ile 22 Eyl, 2 Eki, 9 Eki yeniden hesaplanır.
- **Test (`scripts/gsc-kumeler.test.ts`):** 9 Eki fikstürü 0 / 6 / 5 / 4 ve 286 / 1 verir; bant sınırları (≤3,0 / ≤10,0 / ≤20,0); varyant birleştirmede ağırlıklı pozisyon; kazanan sayfa dışındaki bir sayfa sıralanınca kanibalizasyon işareti.

### E.6 Okuma kuralları

- ≤5 gösterimli sorgudan karar çıkmaz; yalnız izlenir.
- Türetilmiş son hafta yalnız n ≥ 10 ve "temiz" iken karar girdisidir (§0).
- Konuşma biçimli iki sorgu (#4, #12) bant sayımında ayrıca raporlanır; hedef onlarsız da tutturulmalı.
- Toplam gösterim ve EN büyümesi bu programın ölçüsü değildir (strateji v1.18).

---

## F. Riskler ve yapmayacaklarımız

| Risk | Neden | Önlem |
|---|---|---|
| Title / H1 değişikliğinden sonra kısa süreli düşüş | Google sayfayı yeniden değerlendirir; CRO sayfası 18 ve 19 Eyl'de iki kez değişti | Sayfa başına tek değişiklik dalgası; 2 Kas'a kadar aynı sayfanın title'ına ikinci dokunuş yok |
| Kelime doldurma | "ai danışmanlığı / yapay zeka danışmanlığı / yapay zeka danışmanı" varyantlarını her yüzeye basma eğilimi | Her varyant en fazla bir yüzeyde; KC yalnız varlığı denetler, sıklığı denetlemez → Fable elle okur; SSS cevabı ≥40 kelime ve gerçekten bir şey söyler |
| Aynı sorguya iki sayfa | Seçenek A'da "cro danışmanlığı" hizmet + fiyat yazısı | Fiyat yazısı "fiyatları" niteleyicisini taşır; kazanan sayfa tablosu (§B.3) her hafta A-6 listesiyle karşılaştırılır |
| Konuşma biçimli sorgular gerçek alıcı değil | İki pencerede aynı sayılar, 0 tık | N = 2; hedefler onlarsız da raporlanır |
| Ekip içi kontrol aramaları gösterimi şişiriyor | "geo danışmanlığı" 66 göst, poz 27 | §G-8; kontroller arama yerine GSC URL denetimiyle yapılır |
| Pencere örtüşmesi ve küçük hacim | 29 günlük pencereler 22 gün örtüşüyor; set 286 göst | 2 Kas ara değerlendirmesi türetilmiş son haftayla; ≤5 gösterimden karar yok |
| İKAS bağımsızlık kuralının ihlali | Yeni hizmet ve yazı metinlerinde "bağımsız / komisyon yok" cümlesi | İddia her pasajda İKAS bayiliğiyle birlikte (`content-claims.test.ts`) |
| Genel kelimelere kayma | "chatgpt reklam ajansı" (14 göst / poz 61,29) gibi gösterim alan reklam sorguları | Para setine girmez (N0 dışlaması); bu program onlara iş açmaz |

**Yapmayacaklarımız:**

- Genel ve rekabetli kelimeler: dijital reklam ajansı, google reklam ajansı, performans ajansı, "chatgpt reklam ajansı" (strateji v1.18).
- Kelime doldurma; ifadeyi yalnız teste geçmek için yüzeye basmak.
- Aynı sorguya ikinci sayfa: yeni "X ajansı" landing'i yok; lokal "istanbul cro ajansı" sayfası açılmaz (strateji §6).
- Kanibalizasyonu canonical ile çözmek: title / H1 hedefi ayrıştırılır (A-6, ADR-040).
- "ajansı"yı H1'e almak (KC; 13 hizmette yasak sürer); GEO ya da AI başlığına "ajansı" istisnası.
- Bağlantı satın alma, PBN, misafir yazı ağı, dizin spamı; site geneli anahtar kelime çapalı müşteri footer'ı.
- AI üretimi ince içerik: rehber iddialı yazı ≥1.500 kelime, sahipsiz rakam yok (docs/03 §6a.1).
- Hizmet sayfasına uydurma metrik (ADR-018 §3); rakam yalnız `cases.ts`'ten.

---

## G. Burak'a açık sorular

1. GEO H1 "GEO danışmanlığı" olsun mu? EN adı "Generative engine optimization (GEO)" kalsın mı, "GEO consulting" mi olsun?
2. CRO: Seçenek A (yazı "cro ajansı"nı alır, hizmet "CRO danışmanlığı" başlığını) mı, B (başlık korunur, yalnız lede ve SSS) mi? 15 Eki temiz pencereyle birlikte.
3. AI title: "Yapay zeka danışmanlığı (AI): teşhis ve pilot" uygun mu? Description'da fiyat (180.000 / 480.000 TL) yazılsın mı?
4. Müşteri bağlantıları: OdorGo, GYMWOLVES, SIM Baskı, İstanbul Ortez, SOYLU AVM, MKComputer sitelerinden "INDOLES ile çalıştık" bağlantısı istenebilir mi? Meccanotecnica sitesinde bağlantı var mı (GA4'te 1 yönlendirme oturumu)?
5. Clutch / GoodFirms / Sortlist açıldı mı (DT §12.1'deki "dizin kayıtları tamam" bunları kapsıyor mu)? Profil URL'leri?
6. Danışman imzası: AI, GEO ve CRO sayfalarını kim imzalar? (`consultants.ts`'te CRO ya da GEO uzmanlığı yazan danışman yok.)
7. GEO için paket ya da fiyat bandı var mı? Yoksa GEO fiyat yazısı açılmaz; karar kümesi bu halka olmadan kalır.
8. Ekipte "geo danışmanlığı", "cro ajansı" gibi sorguları Google'da düzenli arayan var mı? (Gösterim sayısını etkiler.)
9. sahce.com ve bionluk.com yönlendirmeleri nedir (28 günde 1'er oturum)?
10. 30 Kasım hedefleri (§E.2) ve tık ölçüsünün sayfa düzeyine geçmesi onaylı mı?
11. 9 Eki canlı form testinin sonucu ne oldu?

---

## Ek — hesap notları

- **Para seti toplamı:** 66 + 31 + 31 + 30 + 28 + 26 + 18 + 18 + 13 + 5 + 5 + 10 + 3 + 1 + 1 = 286 göst; tık yalnız "geo danışmanlığı"nda 1 (Q09).
- **Türetilmiş son hafta örnekleri:** geo ajansı (31 × 14,90 − 18 × 21,56) / 13 = 5,68 · ai danışmanlığı (26 × 7,00 − 13 × 4,08) / 13 = 9,92 · geo danışmanlığı (66 × 27,36 − 16 × 28,06) / 50 = 27,14 · yapay zeka danışmanlığı (31 × 10,29 − 14 × 10,43) / 17 = 10,17 (Q09, Q02).
- **Şirketimi … birleşik pozisyon:** (21 × 5,14 + 9 × 7,33) / 30 = 5,80 (9 Eki) · (21 × 5,71 + 9 × 7,33) / 30 = 6,20 (2 Eki) · (14 × 6,00 + 7 × 7,14) / 21 = 6,38 (22 Eyl).
- **Para sayfaları (17 URL; UX hizmet ve e-ticaret fiyat yazısı P09'da satırsız):** 551 göst / 1 tık. Beklenen tık, her sayfanın gösterimi × P09 bant CTR'ı (3-5 %4,35 · 5-10 %1,59 · 10-20 %0,83 · 20+ %0,55) = 4,85; Poisson P(≤1 | 4,85) = e^−4,85 × 5,85 ≈ 0,046.
- **Lead olayı sayısında kaynak farkı:** DT §3.1 (GA4 test çekimi, 9 Eyl–8 Eki) `contact_booking_submitted` 1 gösteriyor; GA-L (10 Eyl–7 Eki) 0. Pencere farkı; bu belge GA-L'yi kullanır (form / brief = 1).
