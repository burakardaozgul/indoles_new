# INDOLES Organik Durum Kesiti — 2026-10-09 (Launch +40 gün)

> Kopyalar: Marketing/ ve repo docs/strateji/ — iki dosya birebir aynıdır; biri değişirse öteki de eşitlenir.
> **Önceki kesitler:** `Durum-Tablosu-2026-09-10.md` (launch +11) · `Durum-Tablosu-2026-08-30.md` · ara kayıtlar `GSC-Data/haftalik-log.md`, `GSC-Data/denetim-2026-09-22.md`, `Plan-2026-09-18-Yapilan-Yapilacak.md` §7
> **Bağlam:** Cutover 29-30 Ağustos. 25 Eylül'de ana amaç satın alma niyetli görünürlük oldu (strateji v1.18); Faz 1 (25 Eyl) ve Faz 2'nin içerik ayağı (2 Eki) yayında. Bu kesit, 2 Ekim'den bu yana ilk tam haftalık veriyi okur.

---

## 0. Kaynaklar ve pencere

Göreli yollar Marketing klasörüne göredir; `repo` öneki `indoles-web` deposudur. Tablolarda kaynak kısa kodla verilir. **hesap** = bu kesitte kaynak dosyadan türetilen değer (formül yanında); her biri iki kez hesaplandı.

| Kod | Dosya | Pencere |
|---|---|---|
| Ö09 | `GSC-Data/haftalik-2026-10-09/ozet.txt` | 8 Eyl – 6 Eki (final) |
| Ö02 | `GSC-Data/haftalik-2026-10-02/ozet.txt` | 1 – 29 Eyl |
| Ö22 | `GSC-Data/haftalik-2026-09-22/ozet.txt` | 22 Ağu – 19 Eyl |
| G | `gunluk.csv` dosyaları (`haftalik-2026-10-09/` ana; eski günler `haftalik-2026-09-10/`, `-09-18/`, `-09-22/`, `-10-02/`, `oncesi/`, `sonrasi/`) — örtüşen günler birebir aynı, 0 çelişki | 1 Ağu – 6 Eki |
| P18 · P22 · P02 · P09 | ilgili çekimin `sayfalar.csv`'si | çekim penceresi |
| Q22 · Q02 · Q09 | ilgili çekimin `sorgular.csv`'si | çekim penceresi |
| QP02 · QP09 | ilgili çekimin `sorgu-sayfa.csv`'si | çekim penceresi |
| U22 · U02 · U09 | ilgili çekimin `ulkeler.csv`'si | çekim penceresi |
| L | `GSC-Data/haftalik-log.md` (10 ve 18 Eyl kayıtları) | — |
| D22 | `GSC-Data/denetim-2026-09-22.md` | — |
| İ09 | `GSC-Data/indeks-2026-10-09.csv` (kilit liste, **52 satır**) | tarama 9 Eki |
| İY09 | `GSC-Data/indeks-yeni-icerik-2026-10-09.csv` (Faz 1 + Faz 2, 18 URL) | tarama 9 Eki |
| İ25 | `GSC-Data/indeks-2026-09-25.csv` (sitemap, 150 URL) | tarama 25 Eyl |
| GEO | `GEO-Olcum/kayitlar.csv` + `GEO-Olcum/ozet.md` | Ay 0 – Ay 2 |
| GA4 | GA4 Data API test çekimi, 9 Eki (mülk 553152492). `Marketing/GA4-Data/` klasörü henüz yok; `scripts/ga4-pull.mjs` ayrı dalda yazılıyor | 9 Eyl – 8 Eki · AI yönlendirme 29 Ağu – 8 Eki |
| CF | Cloudflare Workers analitiği, 9 Eki çekimi (günlük istek / `exceededResources`), bu kesite elle aktarıldı | 25 Eyl – 8 Eki |
| PL | `Plan-2026-09-18-Yapilan-Yapilacak.md` §7 (deploy günlüğü) | — |
| NS | repo `docs/strateji/Niyetli-Sorgu-Seti-2026-09.md` §4 (N0 baz çizgisi) | 22 Ağu – 19 Eyl |
| YH | repo `docs/strateji/Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` | — |
| CTR | repo `docs/strateji/CTR-Revizyonu-2026-09.md` | — |
| ART | repo `src/lib/content/articles.ts` (`publishedAt`) | — |
| DT10 | `Durum-Tablosu-2026-09-10.md` §7 (launch öncesi küme günlük ortalamaları) | 1 – 28 Ağu |
| T | repo testi `pnpm vitest run tests/unit/keyword-coverage.test.ts scripts/gsc-kumeler.test.ts` | 9 Eki, main `49d948d` |

Pencere notu: GSC çekimleri uç günler dahil **29 gündür** (script dilinde "28 gün"). 9 Eki çekiminin son günü 6 Ekim; Faz 2 yazıları bu pencerede en fazla 5 gün (2–6 Eki), Faz 1 içerikleri 12 gün (25 Eyl–6 Eki) taşıyor. Sorgu ve sorgu×sayfa kırılımları anonimleştirilmiş sorguları içermez: 9 Eki'de görünen sorgu gösterimi 1.478 / 3.920 (%37,7), görünen sorgulardan gelen tık **4 / 52** (Q09, hesap).

---

## 1. Manşet

| Ölçü | 9 Eki çekimi | Önceki | Okuma | Kaynak |
|---|---|---|---|---|
| Haftalık gösterim (30 Eyl–6 Eki) | **1.522** | 1.113 (23–29 Eyl) · 491 (13–19 Eyl) | **+%36,7 h/h**; 13–19 Eyl'in **3,10 katı** (hesap: 1.522/1.113, 1.522/491) | Ö09, Ö22 |
| Haftalık tık | 14 | 14 | Yatay | Ö09 |
| Ort. pozisyon | 14,65 | 12,47 | Kötüleşme — EN yazılar düşük pozisyondan giriyor (§1.4) | Ö09 |
| CTR | %0,92 | %1,26 | Düşüş — gösterim tıktan hızlı büyüyor | Ö09 |
| Dönem (29 gün) | 3.920 göst / 52 tık / %1,33 | 3.158 / 53 / %1,68 (1–29 Eyl) | Gösterim +762, tık yatay | Ö09, Ö02 |
| İlk 10'daki niyetli sorgu | **18** | 13 (2 Eki) · 4 (baz) | **Hedef 12+ aşıldı** — ama 18'in 11'i ≤3 gösterim (§3) | Ö09, Ö02, NS |
| Niyetli sorgulardan tık | **1** | 1 · 0 | Hedef ayda 20+ — **en zayıf GSC ölçüsü** | Ö09 |
| Hizmet sayfası gösterim payı | **%9,58** | %6,55 · %2,94 | Hedef %15; payda EN yazılarla şişiyor (§5) | Ö09, Ö02, NS |
| Form / brief | **0 form · 3 lead olayı** (30 gün) | "GA4'te teyit edilecek" | Hedef ayda 5+ nitelikli → **kırmızı** | GA4 |
| GEO turu | Ay 2 **kısmi 0/20** | Ay 1 1/30 | Perplexity hâlâ yapılmadı; A-5 açık (§9) | GEO |
| AI yönlendirme oturumu | **14** (chatgpt.com 8 · gemini.google.com 6) | — | Elle tur 0/20 iken gerçek trafik var (§9) | GA4 |
| Eski URL payı | **%4,5** | %9,3 · %25,7 · %31,2 | Konsolidasyon bitti | Ö09, Ö02, Ö22, L |
| İndeks | Kilit **52/52** · yeni içerik **16/18** | — | 2 EN e-ticaret yazısı "bilinmiyor" | İ09, İY09 |
| Workers CPU aşımı | **0** (2–8 Eki) | 437 istek (25 Eyl–1 Eki) | Free plan sürüyor, yapısal risk kalıyor (§8) | CF |

### 1.1 Çekim bazlı "son 7 gün" serisi

| Çekim | Son 7 gün | Gösterim | Tık | Poz | CTR | Önceki 7 gün (göst / tık) | Δ gösterim | Kaynak |
|---|---|---|---|---|---|---|---|---|
| 18 Eyl | 8–14 Eyl | 517 | 10 | 8,4 | %1,9 | 1–7 Eyl: 760 / 15 | −243 (−%32) | L |
| 22 Eyl | 13–19 Eyl | 491 | 8 | 8,16 | %1,63 | 6–12 Eyl: 535 / 14 | −44 (−%8,2) | Ö22 |
| 2 Eki | 23–29 Eyl | 1.113 | 14 | 12,47 | %1,26 | 16–22 Eyl: 699 / 11 | +414 (+%59,2) | Ö02 |
| **9 Eki** | **30 Eyl–6 Eki** | **1.522** | **14** | **14,65** | **%0,92** | 23–29 Eyl: 1.113 / 14 | **+409 (+%36,7)** | Ö09 |

18 Eyl kaydı script öncesi elle yazıldı ve pencereyi önceki kayda hizaladı; script tanımıyla (çekimin son yedi günü, 9–15 Eyl) aynı çekim 500 / 13 verir (G, hesap). Yüzdeler hesap.

### 1.2 Örtüşmesiz haftalar (Çarşamba–Salı, launch'tan bugüne)

| Hafta | Gösterim | Tık | Poz (göst. ağırlıklı) | CTR | Günlük ort. | Not |
|---|---|---|---|---|---|---|
| 12–18 Ağu | 140 | 3 | 20,01 | %2,14 | 20,0 | Launch öncesi |
| 19–25 Ağu | 182 | 2 | 25,01 | %1,10 | 26,0 | Launch öncesi |
| 26 Ağu–1 Eyl | 645 | 8 | 16,14 | %1,24 | 92,1 | Cutover 29-30 Ağu |
| 2–8 Eyl | 700 | 14 | 11,10 | %2,00 | 100,0 | |
| 9–15 Eyl | 500 | 13 | 8,06 | %2,60 | 71,4 | Plato |
| 16–22 Eyl | 699 | 11 | 10,51 | %1,57 | 99,9 | 18 Eyl ChatGPT reklamları yazısı · 19 Eyl CTR revizyonu · 20 Eyl plato kırıldı · 22 Eyl Workers 503 |
| 23–29 Eyl | 1.113 | 14 | 12,47 | %1,26 | 159,0 | 25 Eyl Deploy 5 + 6 (Hafta A + Faz 1) |
| **30 Eyl–6 Eki** | **1.522** | **14** | **14,65** | **%0,92** | **217,4** | 2 Eki Deploy 7 (Faz 2) |

Kaynak: G (hesap: günlük satırların toplamı; pozisyon gösterim ağırlıklı ortalama — `ozet.txt`'in yöntemi, son üç hafta Ö09/Ö02 ile birebir). Deploy tarihleri PL.

### 1.3 Günlük seyir — 9 Eki çekimi (gösterim / tık)

| Hafta | Çar | Per | Cum | Cmt | Paz | Pzt | Sal | Toplam |
|---|---|---|---|---|---|---|---|---|
| 9–15 Eyl | 74 / 1 | 75 / 2 | 78 / 1 | 65 / 4 | 72 / 1 | 67 / 1 | 69 / 3 | 500 / 13 |
| 16–22 Eyl | 70 / 1 | 74 / 0 | 58 / 1 | 81 / 1 | 102 / 2 | 179 / 3 | 135 / 3 | 699 / 11 |
| 23–29 Eyl | 169 / 5 | 123 / 1 | 134 / 2 | 163 / 3 | 112 / 0 | 164 / 1 | 248 / 2 | 1.113 / 14 |
| 30 Eyl–6 Eki | 215 / 2 | 167 / 1 | 215 / 4 | 180 / 0 | 166 / 2 | **300 / 1** | **279 / 4** | 1.522 / 14 |

Pencerenin ilk günü 8 Eyl (Sal): 86 / 0. 29 günün toplamı 3.920 / 52 (Ö09 ile aynı). **5 Eki (300) ve 6 Eki (279)**, 1 Ağu'dan bu yana elimizdeki 67 günün en yüksek iki günü; önceki tepe 29 Eyl (248). Kaynak: G.

### 1.4 Büyümenin kaynağı — TR mi, TR dışı mı?

| Kırılım (29 gün) | 22 Eyl | 2 Eki | 9 Eki | Δ (2 → 9 Eki) | Kaynak |
|---|---|---|---|---|---|
| TR içi gösterim / tık | 1.497 / 34 | 2.070 / 46 | 2.238 / 40 | **+168 (+%8,1)** | U22, U02, U09 |
| TR dışı (G5) gösterim / tık | 745 / 4 | 1.088 / 7 | 1.682 / 12 | **+594 (+%54,6)** | U22, U02, U09 |
| TR dışı payı | %33,2 | %34,5 | **%42,9** | — | hesap |
| EN yazı sayfaları (`/en/articles/*`) | — | 628 (%19,0) | **1.302 (%31,9)** | +674 | P02, P09 (hesap: yol önekiyle gruplama) |
| TR yazı sayfaları (`/tr/yazilar/*`) | — | 1.560 (%47,3) | 1.642 (%40,2) | +82 | P02, P09 |
| Hizmet sayfaları | — | 216 (%6,5) | 391 (%9,6) | +175 | P02, P09 |
| `/en/articles/ecommerce-conversion-rate-benchmarks` tek başına | — | 114 / poz 9,89 | **696 / poz 16,29** | +582 | P02, P09 |

**Okuma (veri):** 29 günlük gösterim artışının (+762) %78'i TR dışından (+594) geliyor; sayfa düzeyindeki artışın (+783) %74'ü tek bir EN yazıdan (benchmark, +582). Bu yazının en yüklü sorguları 40-63. pozisyonda ("website ecommerce conversion rates" 14 / 63,1, "ecommerce conversion rate benchmark" 15 / 43,9 — QP09). Çerçevedeki "pozisyon kötüleşmesi = yeni sayfaların düşük pozisyondan girmesi" okumasını 29 günlük düzeyde veri destekliyor; haftalık pozisyon değişiminin ne kadarının bu sayfadan geldiği ülke×gün kırılımı olmadığı için **hipotez** kalır. TR içi gösterim +%8 — niyetli büyüme toplam gösterimin manşetinden çok daha yavaş.

---

## 2. Alarm kontrolleri (A-1 … A-7)

Tanımlar: repo `docs/strateji/Keyword-Onceliklendirme-2026-08-27.md` §4; A-4 strateji v1.18 §9.2.

| Alarm | Sonuç | Kanıt | Kaynak |
|---|---|---|---|
| **A-1 · 301 / tohum bütünlüğü** | **GEÇTİ** (eşik), bir tohum kayıp | G1 116 göst (4,0/gün) ve G3 426 göst (14,7/gün) — launch öncesi 3,4/gün ve 4,3/gün; %50 eşiğinin çok üstünde (hesap: göst/29). Eski URL payı **%4,5** (185 / 4.082, 29 sayfa). "yapay zeka arama optimizasyonu" yeni URL'de poz **5,88** (22 Eyl: 32,76 — eski URL'li karışım). **Kayıp:** "dönüşüm optimizasyonu" tohumu bu çekimde hiç görünmüyor (18 Eyl'de 1 göst / poz 50) | Ö09, Q09, Q22, DT10, L |
| **A-2 · İndeksleme** | **GEÇTİ** | Kilit liste **52/52** "Gönderildi ve dizine eklendi"; Faz 1+2'nin 18 URL'sinden **16** indeksli, 2 EN yazı "URL Google tarafından bilinmiyor". Son tam sitemap taraması 25 Eyl: 143/150 (%95,3; eşik %80). Sitemap bugün 170 URL — yeni tam tarama yapılmadı | İ09, İY09, İ25, PL |
| **A-3 · CTR** | **16 sayfa** eşikte | 2 Eki 17, 22 Eyl 12, 18 Eyl 11. 19 Eyl CTR revizyonunun 11 sayfasından **7'si** hâlâ listede; revizyon sonrası kesin tık: 2 (EN gerilla). Ayrıntı §6 | Ö09, Ö02, Ö22, L, P09 |
| **A-4 · Niyetli görünürlük (v1.18)** | **2/3 ölçü hedefin altında** | İlk 10'da 18/12 (üstünde) · hizmet sayfası payı %9,58/%15 (altında) · niyetli tık 1/20 (altında). Alarm 30 Kasım kaydında değerlendirilir; bugünkü değerlerle "üçten ikisi" eşiği tetiklenir. Eşik biçimi Burak teyidi bekliyor (strateji statü satırı) | Ö09 |
| **A-5 · GEO penceresi** | **KARAR VERİLEMEDİ** | Ay 2 (2 Eki): ChatGPT 0/10, Gemini 0/10; Perplexity 10 prompt işlenmedi (oturum duvarı) — 9 Eki itibarıyla hâlâ yapılmadı. A-5 "Ay 2 X/30 = 0" kuralı 30 sorgu tamamlanmadan uygulanamaz (§9) | GEO |
| **A-6 · Kanibalizasyon** | **14 sorgu** | 2 Eki 21, 22 Eyl 18. 4'ü TR/EN hreflang çifti (aksiyon yok); gerçek bölünme: "cro ajansı" (hizmet + yazı), "türkçe geo aracı var mı" / "yerli geo aracı" (araç + yazı). Ayrıntı §7 | Ö09, QP09 |
| **A-7 · Yerleşim regresyonu** | **YEŞİL** | `keyword-coverage.test.ts` 78 test geçti (+ `gsc-kumeler.test.ts` 24 test) | T |

---

## 3. Satın alma niyeti ölçüleri (v1.18)

N0 kuralı: TR niteleyici + altı hizmetten birinin terimi; genel reklam ajansı, kariyer ve araç niyeti hariç (NS §1).

### 3.1 Birincil ölçüler

| Ölçü | 25 Eyl baz (22 Ağu–19 Eyl) | 2 Eki (1–29 Eyl) | 9 Eki (8 Eyl–6 Eki) | 30 Kasım hedefi | Durum | Kaynak |
|---|---|---|---|---|---|---|
| Niyetli sorgu (N0) | 15 sorgu / 84 göst / 0 tık / poz 16,45 | 28 / 179 / 1 / 15,83 | **36 / 331 / 1 / 16,05** | — | Hacim 4 katına yakın | NS, Ö02, Ö09 |
| Görünen sorgu gösterimindeki payı | %11,35 (84 / 740) | %16,56 (179 / 1.081) | **%22,40** (331 / 1.478) | — | | NS, Ö02, Ö09 |
| Toplam gösterimdeki payı | %3,75 (84 / 2.242) | %5,67 (179 / 3.158) | **%8,44** (331 / 3.920) | — | | NS, Ö02, Ö09 |
| **İlk 10'daki niyetli sorgu** | 4 | 13 | **18** | **12+** | **Aşıldı** | NS, Ö02, Ö09 |
| **Hizmet sayfası gösterim payı** | %2,94 (69 / 2.346, 24 sayfa) | %6,55 (216 / 3.299, 31 sayfa) | **%9,58** (391 / 4.082, 26 sayfa) | **%15** | Altında | NS, Ö02, Ö09 |
| **Niyetli sorgulardan tık** | 0 | 1 | **1** | **ayda 20+** | **En zayıf** | NS, Ö02, Ö09 |
| **Form / brief** | GA4'te teyit edilecek | teyit yok | **3 lead olayı / 0 form** (9 Eyl–8 Eki) | **ayda 5+ nitelikli** | **Kırmızı** | NS, GA4 |
| GEO turu (30 sorgu) | 1/30 (Ay 1) | 0/20 kısmi (Ay 2) | 0/20 kısmi — Perplexity yapılmadı | 5/30 | Açık | GEO |

Form / brief satırının ayrıntısı (GA4, 9 Eyl–8 Eki): `contact_booking_submitted` 1 (anahtar olay), `phone_clicked` 1 (anahtar), `tool_report_requested` 1 (anahtar), `contact_form_submitted` **0** — 30 günde hiç. Strateji §9.1'in saydığı dört lead olayından `popup_booking_submitted` ve `popup_contact_submitted` çekimde listelenmedi (0). Kapsam notu: TR'de varsayılan onay (ADR-035) ve ölçüm mimarisi (ADR-034) nedeniyle GA4 sayıları **alt sınırdır**; 30 günde ~230 oturum küçük hacim, 10'un altındaki sayılardan trend çıkarılmaz (GA4).

### 3.2 Hizmet bazlı N0

| Hizmet | Baz: sorgu / göst / ilk 10 | 2 Eki: sorgu / göst / tık / poz / ilk 10 | 9 Eki: sorgu / göst / tık / poz / ilk 10 |
|---|---|---|---|
| GEO | 3 / 22 / 2 | 10 / 74 / 1 / 17,05 / 6 | **12 / 165 / 1 / 19,13 / 8** |
| CRO | 2 / 20 / 1 | 3 / 29 / 0 / 17,76 / 2 | 3 / 41 / 0 / 14,76 / 2 |
| Yapay zeka | 5 / 12 / 1 | 9 / 41 / 0 / 12,78 / 4 | **12 / 87 / 0 / 11,40 / 6** |
| UX | 5 / 30 / 0 | 5 / 34 / 0 / 13,88 / 1 | 4 / 31 / 0 / 12,48 / 0 |
| E-ticaret | 0 / 0 / 0 | 0 / 0 / 0 / — / 0 | **4 / 6 / 0 / 18,67 / 2** |
| Dijital dönüşüm | 0 / 0 / 0 | 1 / 1 / 0 / 61,00 / 0 | 1 / 1 / 0 / 61,00 / 0 |

Kaynak: NS §4, Ö02, Ö09 (`kumeler.csv`'nin N0 satırlarıyla aynı). E-ticaret 0 → 4 sorgu; dijital dönüşüm tek sorgu, poz 61 (Faz 3 işi).

### 3.3 İlk 10'daki 18 niyetli sorgu ve sıralanan sayfa

| # | Sorgu | Hizmet | Göst | Poz | Sıralanan sayfa (göst / poz) | 2 Eki'de ilk 10'da mı | Kaynak |
|---|---|---|---|---|---|---|---|
| 1 | ai danışmanlığı | Yapay zeka | 26 | 7,00 | `/tr/hizmetler/ai-danismanlik` | Evet (4,08) | Ö09, QP09, Ö02 |
| 2 | şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin? | GEO | 21 | 5,14 | `/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru` | Evet (5,71) | Ö09, QP09 |
| 3 | cro ajansı | CRO | 18 | 9,00 | `cro-ajansi-nasil-secilir` (15 / 6,80) + `/tr/hizmetler/cro` (3 / 20,00) | Evet (9,00) | Ö09, QP09 |
| 4 | yapay zeka görünürlük danışmanlığı | GEO | 18 | 9,28 | `/tr/hizmetler/geo-danismanligi` | Evet (7,67) | Ö09, QP09 |
| 5 | cro danışmanlığı | CRO | 13 | 6,69 | `/tr/yazilar/cro-danismanligi-fiyatlari` | Evet (6,00) | Ö09, QP09 |
| 6 | şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin | GEO | 9 | 7,33 | `ai-danismani-secerken-sorulacak-12-soru` | Evet (7,33) | Ö09, QP09 |
| 7 | yapay zeka kullanılan danışmanlık paketleri ile klasik hizmetler arasında fiyat farkı var mı? | Yapay zeka | 5 | 8,00 | `/tr/hizmetler/ai-danismanlik` | Evet (9,50) | Ö09, QP09 |
| 8 | yapay zeka otomasyon danışmanlığı | Yapay zeka | 3 | 10,00 | `/tr/hizmetler/ai-danismanlik` | **Yeni** | Ö09, QP09 |
| 9 | chatgpt gemini görünürlüğü ajans türkiye | GEO | 2 | 1,00 | `/tr/hizmetler/geo-danismanligi` | **Yeni** | Ö09, QP09 |
| 10 | büyük danışmanlık firması vs butik yapay zeka ajansı farkları | Yapay zeka | 2 | 3,50 | `/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru` | Evet (3,50) | Ö09, QP09, QP02 |
| 11 | ai görünürlük danışmanlığı paket fiyatları | GEO | 2 | 6,00 | `/tr/hizmetler/ai-danismanlik` | Evet (10,00) | Ö09, QP09 |
| 12 | yapay zeka danışmanlık | Yapay zeka | 2 | 9,50 | `/tr/hizmetler/ai-danismanlik` | **Yeni** | Ö09, QP09 |
| 13 | ai optimizasyonu diye bir şey duydum, bunu yapan ajans hangisi? | Yapay zeka | 1 | 1,00 | `/tr/yazilar/geo-ajansi-nasil-secilir` | Evet (1,00) | Ö09, QP09 |
| 14 | yapay zeka görünürlük platformları arasında nasıl seçim yaparım? | GEO | 1 | 1,00 | `/tr/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz` | Evet (1,00) | Ö09, QP09 |
| 15 | ajansım için müşteri markalarının ai görünürlüğünü izleyen platform | GEO | 1 | 6,00 | `/tr/yazilar/geo-ajansi-nasil-secilir` | **Yeni** | Ö09, QP09 |
| 16 | shopify seo ve organik büyüme için hangi ajansla çalışmalıyım? | E-ticaret | 1 | 6,00 | `/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi` | **Yeni** | Ö09, QP09 |
| 17 | eticaret ajansı | E-ticaret | 1 | 8,00 | `/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi` | **Yeni** | Ö09, QP09 |
| 18 | prompt başına geo platformu fiyatı | GEO | 1 | 9,00 | `/tr/yazilar/geo-ajansi-nasil-secilir` | Evet (9,00) | Ö09, QP09 |

**İlk 10'dan çıkan:** "ux ajansı" 9,89 → **10,46** (28 göst) — sıralanan sayfa hâlâ eski `/web-tasarim-ui-ux-tasarimi/` (QP09). Giren 6, çıkan 1: 13 − 1 + 6 = 18.

**Sayfa türüne göre (hesap, QP09):** hizmet sayfaları 7 sorgu (ai-danismanlik 5, geo-danismanligi 2; 58 göst) · Faz 1 yazıları 4 (geo-ajansi-nasil-secilir 3, cro-danismanligi-fiyatlari 1; 16 göst) · 28 Ağu launch yazıları 3 (12-soru 2, cro-ajansi-nasil-secilir 1; 48 göst) · eski yazılar 4 (2024-2026 Ocak; 5 göst) · **Faz 2 yazıları 0**.

**Kırılganlık:** 18 sorgunun 11'i ≤3 gösterim; ≥5 gösterimli olanlar 7 (#1-7). Üç sorgu (#14, #15, #18) platform/SaaS arayışı — N0'ın araç dışlaması "araç/tool" kelimelerini yakalıyor, "platform"u yakalamıyor (gözlem; kural değişikliği NS §5 bakım sürecinde Burak'a gider).

**9 Eki'de ilk kez görünen niyetli sorgular** (2 Eki `sorgular.csv`'sinde hiç yok — Q02, Q09; N0 sınıflaması `gsc-pull.mjs` `niyetHizmeti`): yapay zeka otomasyon danışmanlığı (3 / 10,00) · yapay zekâ danışmanlığı (3 / 14,00) · e ticaret ajansı (3 / 16,67) · chatgpt gemini görünürlüğü ajans türkiye (2 / 1,00) · yapay zeka danışmanlık (2 / 9,50) · ajansım için müşteri markalarının ai görünürlüğünü izleyen platform (1 / 6,00) · shopify seo ve organik büyüme için hangi ajansla çalışmalıyım? (1 / 6,00) · eticaret ajansı (1 / 8,00) · e ticaret danışmanlığı (1 / 48,00). Düşen: ankara ui ux ajansı. 28 + 9 − 1 = 36.

---

## 4. Faz 1 + Faz 2 içeriği — sayfa bazlı

Göst / tık / poz 29 günlük penceredir (P09); Faz 1 sayfaları 12, Faz 2 sayfaları 5 gün taşıyor. İndeks ve son tarama İY09 (UTC). "En iyi 3 sorgu" QP09'dan, görünen sorgularla sınırlı.

| URL | Yayın | İndeks (son tarama) | Göst / tık / poz | En iyi 3 sorgu (göst / poz) |
|---|---|---|---|---|
| **Deploy 5 — 25 Eyl (Hafta A)** | | | | |
| `/tr/yazilar/e-ticaret-donusum-orani-benchmark` | 25 Eyl | Dizinde (25 Eyl 12:51) | 75 / 2 / 3,75 | ankara mobil cihazlarda alışveriş oranı (1 / 16) — 74 göst anonim |
| `/en/articles/ecommerce-conversion-rate-benchmarks` | 25 Eyl | Taranmadı (İY09 listesinde yok); gösterim aldığı için dizinde | **696 / 5 / 16,29** | ecommerce conversion rate benchmark (15 / 43,9) · website ecommerce conversion rates (14 / 63,1) · conversion rate fashion ecommerce (11 / 48,0) |
| `/tr/yazilar/ai-donusumune-nereden-baslanir-90-gunluk-pilot` | 25 Eyl | Dizinde (25 Eyl 13:52) | 13 / 0 / 7,69 | pilot proje nedir (1 / 17) |
| `/en/articles/where-to-start-ai-transformation-90-day-pilot` | 25 Eyl | Taranmadı; gösterim var | 13 / 0 / 11,77 | "where should i start with ai transformation? …" (2 / 5) |
| **Deploy 6 — 25 Eyl (Faz 1)** | | | | |
| `/tr/hizmetler/geo-danismanligi` | 25 Eyl | Dizinde (25 Eyl 13:59) | **109 / 1 / 23,77** | geo danışmanlığı (66 / 27,4) · yapay zeka görünürlük danışmanlığı (18 / 9,3) · geo danışmanlık (12 / 41,2) |
| `/en/services/geo-consulting` | 25 Eyl | Dizinde (25 Eyl 15:20) | 19 / 0 / 15,47 | geo consulting (11 / 12,8) · b2b geo consulting (2 / 16) · geo consulting services (2 / 36) |
| `/tr/yazilar/geo-ajansi-nasil-secilir` | 25 Eyl | Dizinde (25 Eyl 16:58) | 70 / 0 / 11,36 | geo ajansı (31 / 14,9) · chatgpt'de marka varlığını doğru ölçmenin yolu (2 / 3,5) · küçük işletmeler için uygun geo aracı (2 / 16) |
| `/en/articles/how-to-choose-a-geo-agency` | 25 Eyl | Dizinde (28 Eyl 10:44) | 83 / 0 / 9,24 | which geo company would you choose? (14 / 2,0) · how to choose a geo agency (8 / 12,6) · how do i choose a geo agency? (4 / 6,5) |
| `/tr/yazilar/cro-danismanligi-fiyatlari` | 25 Eyl | Dizinde (25 Eyl 14:01) | 16 / 0 / 14,31 | cro danışmanlığı (13 / 6,7) · cro nedir (2 / 69,5) |
| `/en/articles/cro-consulting-pricing` | 25 Eyl | Dizinde (28 Eyl 10:44) | 68 / 1 / 11,88 | cro consultancy (15 / 4,4) · cro consultants (13 / 14,5) · cro consulting services (11 / 22,5) |
| **Deploy 7 — 2 Eki (Faz 2)** | | | | |
| `/tr/yazilar/yapay-zeka-danismanligi-fiyatlari` | 2 Eki | Dizinde (3 Eki 19:22) | 11 / 0 / 30,36 | görünen sorgu yok |
| `/en/articles/ai-consulting-pricing` | 2 Eki | Dizinde (4 Eki 08:46) | 18 / 0 / 12,28 | ai consulting pricing (2 / 16) · ai consultant london cost (2 / 59) |
| `/tr/yazilar/buyuk-danismanlik-mi-butik-yapay-zeka-ajansi-mi` | 2 Eki | Dizinde (4 Eki 10:51) | 2 / 0 / 7,50 | veri merkezi projelerinde marka bağımsız danışmanlık veren firmalar hangileri? (1 / 5) · şirketim için bir danışmanlık hizmeti satın almak istiyorum, … (1 / 10) |
| `/en/articles/big-consultancy-or-boutique-ai-agency` | 2 Eki | Dizinde (4 Eki 00:09) | 28 / 0 / 5,32 | what is the best consultancy for ai in procurement (2 / 9) · what distinguishes global hr consulting firms from boutique firms? (1 / 1) · consultancy vs boutique agency for an enterprise ai product build … (1 / 2) |
| `/tr/yazilar/e-ticaret-danismani-nasil-secilir` | 2 Eki | Dizinde (2 Eki 10:12) | 12 / 0 / 5,42 | bir ticaret medya ağı ortağı nasıl seçilir? (1 / 10) |
| `/en/articles/how-to-choose-an-ecommerce-consultant` | 2 Eki | **URL Google tarafından bilinmiyor** | 0 (P09'da satır yok) | — |
| `/tr/yazilar/e-ticaret-danismanligi-fiyatlari` | 2 Eki | Dizinde (2 Eki 10:06) | 0 (P09'da satır yok) | — |
| `/en/articles/ecommerce-consulting-pricing` | 2 Eki | Dizinde (3 Eki 03:41) | 8 / 0 / 8,38 | ecommerce consultant cost (2 / 22,5) · how much does a full-service ecommerce integration project cost … (1 / 6) · ecommerce consulting rates (1 / 7) |
| `/tr/yazilar/e-ticaret-platform-danismanligi` | 2 Eki | Dizinde (2 Eki 10:08) | 7 / 0 / 16,57 | web sitesi altyapı danışmanlığı (2 / 14,5) |
| `/en/articles/ecommerce-platform-consulting` | 2 Eki | **URL Google tarafından bilinmiyor** | 0 | — |
| `/tr/hizmetler/e-ticaret` (yeniden konumlandı) | 2 Eki | Dizinde (3 Eki 19:26 — İ09) | 9 / 0 / 12,33 | ticimax kvkk (1 / 15) · e ticaret danışmanlığı (1 / 48) |

Yayın tarihleri ART + PL; e-ticaret hizmet sayfası İ09'dan.

**Özet (hesap, P09):** 20 yeni URL 1.248 göst / 9 tık taşıyor (sayfa gösteriminin %30,6'sı); bunun 797'si Deploy 5 (benchmark EN 696), 365'i Faz 1, **86'sı Faz 2**. TR 315, EN 933. TR'nin 10 URL'si yayından **en geç 2 gün içinde** tarandı (son tarama yayın gününe en fazla 2 gün uzak; son tarama ilk taramadan önce olamaz) — IndexNow + sitemap hattı çalışıyor. EN'de 6/8 dizinde, 2 e-ticaret yazısı bilinmiyor.

**Erken sinyaller — veriyle düzeltme:**

- "büyük danışmanlık firması vs butik yapay zeka ajansı farkları" (2 / 3,50) **yeni yazının sinyali değil**: sıralanan sayfa eski `dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru`, ve 3,50 değeri yeni yazı yayımlanmadan önceki 2 Eki çekiminde (1–29 Eyl) zaten vardı (QP02, QP09).
- "yapay zeka kullanılan danışmanlık paketleri … fiyat farkı var mı?" (5 / 8,00) fiyat yazısının değil **hizmet sayfasının** (`/tr/hizmetler/ai-danismanlik`); 2 Eki'de 9,50 (QP02, QP09).
- EN `big-consultancy-or-boutique-ai-agency` 5 günde 28 göst / poz 5,32 — doğru; ama sorguları EN genel danışmanlık soruları (procurement, HR), N0 dışı (QP09).
- E-ticaret N0'ın 4 sorgusunun 3'ü 2024 tarihli eski yazıdan (`gercek-e-ticaret-ajansinin-etkisi`), 1'i hizmet sayfasından (poz 48). Faz 2 e-ticaret üçlüsü henüz hiçbir niyetli sorguda görünmüyor (QP09).
- **Gerçek erken sinyaller Faz 1'den:** "cro danışmanlığı" → `cro-danismanligi-fiyatlari` 13 / 6,69 · "yapay zeka görünürlük danışmanlığı" → GEO hizmet sayfası 18 / 9,28 · "geo ajansı" → `geo-ajansi-nasil-secilir` 31 / 14,90 (2 Eki: 18 / 21,56) · EN `how-to-choose-a-geo-agency` 83 / 9,24 (QP02, QP09).

---

## 5. Hizmet sayfaları (13 hizmet, TR + EN)

Göst / tık / poz P09; ilk sorgu QP09 (görünen sorgular). "—" = P09'da satır yok (29 günde 0 gösterim).

| Hizmet | TR göst / tık / poz | TR ilk sorgu (göst / poz) | EN göst / tık / poz | EN ilk sorgu |
|---|---|---|---|---|
| Yapay zeka danışmanlığı (`ai-danismanlik` / `ai-consulting`) | **136 / 0 / 11,18** | yapay zeka danışmanlığı (31 / 10,3) · ai danışmanlığı (26 / 7,0) | 4 / 0 / 4,25 | görünen sorgu yok |
| GEO danışmanlığı (`geo-danismanligi` / `geo-consulting`) | **109 / 1 / 23,77** | geo danışmanlığı (66 / 27,4) | 19 / 0 / 15,47 | geo consulting (11 / 12,8) |
| Marka stratejisi | 21 / 0 / 35,81 | marka stratejisi danışmanlığı (13 / 18,0) | 2 / 0 / 4,50 | — |
| Özel yazılım ve mobil | 10 / 0 / 4,70 | mobil uygulama hizmetleri (2 / 3,5) | — | — |
| E-ticaret danışmanlığı | 9 / 0 / 12,33 | ticimax kvkk (1 / 15) | 3 / 0 / 24,00 | orderflowmap (1 / 8) |
| Dijital dönüşüm | 9 / 0 / 8,78 | dönüşüm danışmanlığı (1 / 2) | — | — |
| CRO | **7 / 0 / 20,14** | cro ajansı (3 / 20,0) | 1 / 0 / 19,00 | conversion optimisation consulting (1 / 19) |
| İş otomasyonları | 6 / 0 / 17,33 | iş zekası danışmanlığı (1 / 67) | 2 / 0 / 5,50 | — |
| Teknoloji ve altyapı | 5 / 0 / 8,80 | türkiye genelinde profesyonel it altyapı ekipmanı satan yerler hangileri? (3 / 9,3) | 1 / 0 / 1,00 | — |
| İşletme mühendisliği | 4 / 0 / 3,25 | görünen sorgu yok | 3 / 0 / 3,33 | — |
| İş zekası | 3 / 0 / 7,00 | iş zekası giriş (1 / 2) | 1 / 0 / 8,00 | — |
| Performans pazarlama | 1 / 0 / 9,00 | görünen sorgu yok | — | — |
| UI/UX tasarım | **—** | "ux ajansı" eski `/web-tasarim-ui-ux-tasarimi/`'de (28 / 10,46) | — | — |
| **13 hizmet toplamı** | **320 / 1** | | **36 / 0** | |

Pillar sayfaları (HS ölçüsüne dahil): TR build 21 · transform 9 · growth 3; EN build 1 · growth 1 → 35. Hub'lar sayılmaz: `/tr/hizmetler` 14, `/en/services` 5. Toplam HS 320 + 36 + 35 = **391** (Ö09 ile aynı; hesap).

**Okuma:**

1. **Hizmet sayfası payının %63'ü iki sayfada** (245 / 391). İkisinin sorunu farklı: `ai-danismanlik` ilk sayfanın alt sınırında (para sorguları poz 7,0 ve 10,3) ve 136 gösterimde 0 tık — CTR sorunu; `geo-danismanligi`'nin ana sorgusu "geo danışmanlığı" poz 27 (3. sayfa) — sorun CTR değil **sıralama**.
2. **CRO para sayfası zayıf:** `/tr/hizmetler/cro` 29 günde 7 gösterim; "cro ajansı" yazıda (15 / 6,80), "cro danışmanlığı" fiyat yazısında (13 / 6,69). CRO niyeti yazılara gidiyor (§7).
3. **UI/UX hizmet sayfası üç çekimdir gösterim almıyor** (P22, P02, P09'da satır yok; İ25'te dizinde, son tarama 18 Eyl). "ux ajansı" ve 52 gösterim hâlâ eski `/web-tasarim-ui-ux-tasarimi/`'de; yönlendirme kodda doğru (`src/lib/seo/legacy-redirects.ts` → `/tr/hizmetler/ui-ux-tasarim`). Google eski URL'i yeniden taramadı (D22 §2 ile tutarlı) — GSC'de eski URL için dizine ekleme isteği gerekir (§11).
4. **Payda etkisi (hesap):** HS payı tüm sayfa gösterimine bölünüyor; EN benchmark yazısı (696) paydadan çıkarılırsa pay %11,5 (391 / 3.386). Yalnız TR sayfalarda TR hizmet sayfası payı **%14,9** (353 / 2.377). EN'e yatırım yokken (v1.18) EN yazıların büyümesi bu ölçüyü aşağı çekiyor — alt ölçü önerisi §12.
5. Title eşleşmesi: `ai-danismanlik` `seo.title` "Yapay zeka danışmanlığı ve pilot uygulama" — "yapay zeka danışmanlığı" (31 göst) eşleşiyor, "ai danışmanlığı" (26 göst, poz 7,0) eşleşmiyor; `geo-danismanligi` "GEO danışmanlığı: yapay zekada görünürlük" — eşleşiyor (repo `src/lib/content/services/*.ts`).

---

## 6. CTR revizyonu kontrolü (19 Eyl revizyonu)

Önce: P18 (18 Ağu–15 Eyl, revizyon öncesi). Sonra: P09 (8 Eyl–6 Eki). Revizyon 19 Eyl 13:25'te canlıya girdi (PL); "sonra" penceresinin 11 günü (8–18 Eyl) revizyon öncesidir. Bu yüzden: 29 günde 0 tık alan sayfanın revizyon sonrası tıkı da kesin 0'dır; tık alan sayfalarda tıkın tarihi P22 (22 Ağu–19 Eyl) ile ayrıştırıldı.

| # | Sayfa | Önce: göst / tık / poz / CTR | Sonra: göst / tık / poz / CTR | Revizyon sonrası kesin tık | A-3'te mi (9 Eki) | Poz değişimi |
|---|---|---|---|---|---|---|
| 1 | `/tr/yazilar/google-ai-overviews-da-yer-almak` | 110 / 0 / 7,23 / %0 | 81 / 0 / 9,38 / %0 | 0 | Evet | **−2,15 (regresyon)** |
| 2 | `/en/articles/guerrilla-marketing-in-the-digital-age` | 63 / 0 / 5,87 / %0 | 36 / 2 / 7,00 / **%5,56** | **2** (P22'de 0 tık) | Hayır — CTR ile çıktı | −1,13 (sınırda) |
| 3 | `/tr/yazilar/cro-nedir` | 62 / 0 / 8,21 / %0 | 58 / 0 / 8,47 / %0 | 0 | Evet | −0,26 |
| 4 | `/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru` | 48 / 0 / 8,92 / %0 | 30 / 0 / 9,50 / %0 | 0 | Evet | −0,58 |
| 5 | `/tr/danismanlar/mert-kaplan` | 45 / 0 / 7,69 / %0 | 73 / 1 / 7,37 / %1,37 | 0 (tek tık 16–19 Eyl'de: P18'de 0, P22'de 1) | Hayır — CTR ile, ama tık revizyon öncesi | +0,32 |
| 6 | `/tr/yazilar/turkiyenin-ilk-geo-denetim-araci` | 44 / 0 / 2,55 / %0 | **91 / 0 / 2,71 / %0** | 0 | Evet | −0,16 |
| 7 | `/tr/danismanlar/burak-ozgul` | 34 / 0 / 7,38 / %0 | 38 / 0 / 8,24 / %0 | 0 | Evet | −0,86 |
| 8 | `/tr/yazilar/satis-ekibinizin-…-lead-toplama-rehberi` | 30 / 0 / 6,53 / %0 | 36 / 0 / 7,22 / %0 | 0 | Evet | −0,69 |
| 9 | `/dijital-cagda-gerilla-pazarlama-evrimi/` (eski URL) | 28 / 0 / 7,46 / %0 | 18 / 0 / 16,50 / %0 | 0 | Hayır — poz ile (konsolidasyon) | −9,04 (beklenen) |
| 10 | `/en/consultants/burak-ozgul` | 23 / 0 / 6,43 / %0 | 10 / 0 / 7,00 / %0 | 0 | Hayır — gösterim < 20 | −0,57 |
| 11 | `/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru` | 20 / 0 / 8,50 / %0 | **60 / 0 / 7,23 / %0** | 0 | Evet | +1,27 |
| | **Toplam** | **507 / 0** | **531 / 3 / CTR %0,56** | **2** | **7 / 11** | |
| — | Kontrol (revize edilmedi): `/tr/yazilar/llms-txt-nedir` | 97 / 4 / 5,92 / %4,12 | 55 / 1 / 5,49 / %1,82 | — | Hayır | +0,43 |

Kaynak: P18, P22, P09, Ö09 (A-3 listesi); toplamlar ve poz farkları hesap.

**CTR §4 eşiklerine göre:**

| Eşik (CTR §4) | Sonuç |
|---|---|
| A-3'ten çıkmak (CTR ≥ %1) | **2 / 11** sayısal olarak çıktı; revizyona bağlanabilen yalnız EN gerilla (2 tık). Mert Kaplan'ın tek tıkı revizyon öncesi. 2 sayfa gösterim/pozisyon düşüşüyle eşik dışına çıktı (başarı değil) |
| Pozisyon regresyonu ≤ 1 kademe | 2 ihlal: `google-ai-overviews` −2,15, EN gerilla −1,13. Eski gerilla URL'inin düşüşü konsolidasyon |
| Google'ın başlığı yeniden yazması | **Elle SERP kontrolü yapılmadı** — açık iş |
| `turkiyenin-ilk-geo-denetim-araci` | Poz 2,71'de 91 gösterim, 0 tık → §4'ün öngördüğü teşhis tetiklendi: sorun başlıkta değil SERP özelliğinde ya da niyette (araç arayan yazıyı görüyor; A-6 §7) |
| `ai-danismani-secerken-sorulacak-12-soru` | GEO sorgusu (21 / 5,14 + 9 / 7,33) hâlâ bu sayfada, 0 tık → §4: "GEO danışmanlığı için ayrı hedef sayfa gerekir". Hedef sayfa 25 Eyl'de açıldı ama bu sorguda sıralanmıyor; 12-soru yazısının köprü paragrafı GEO hizmet sayfasına link vermiyor (yalnız GEO rehberi ve denetleyici — ART) |

**Karar (CTR §4 kuralının uygulanması):** CTR 11 sayfanın 7'sinde hâlâ %1'in altında → sonraki kaldıraç description değil, sayfanın kendisi. 11 sayfanın hiçbiri hizmet sayfası değil: 6'sı bilgi yazısı, 3'ü danışman profili, 2'sinin niyeti başka bir sayfaya ait (GEO aracı yazısı, 12-soru); bilgi niyeti v1.18'den beri ikincil. Bu yüzden: (1) bilgi yazılarına ikinci title dalgası yapılmaz; (2) niyet uyuşmazlığı olan iki sayfa sayfa düzeyinde düzeltilir — 12-soru köprü paragrafından GEO hizmet sayfasına link, GEO aracı yazısında araç sayfasının sorguyu taşıması (§7); (3) A-3 dikkati hizmet sayfalarına kayar: `ai-danismanlik` (136 / 0, poz 11,18 — mekanik A-3 eşiğinin dışında, çünkü poz ≥ 10; 2 Eki'de 9,77 ile listedeydi) ve `geo-danismanligi` (sıralama işi). Revizyon sonrası temiz pencere için 16 Eki civarı `node scripts/gsc-pull.mjs --start 2026-09-19 --end <bugün-3> --out <geçici klasör>` çekimi önerilir.

---

## 7. Kanibalizasyon (A-6) — 14 sorgu

| Sorgu | Göst | Sayfalar (göst / poz) | Tür | Öneri |
|---|---|---|---|---|
| mert kaplan | 57 | TR danışman 54 / 7,87 · EN 3 / 7,00 | hreflang çifti | Aksiyon yok |
| türkçe geo aracı var mı | 40 | araç `/tr/araclar/geo-gorunurluk-denetleyicisi` 1 / 1,00 · yazı `turkiyenin-ilk-geo-denetim-araci` 39 / 2,67 | **Gerçek** — araç niyeti yazıda | Araç sayfası sorguyu taşısın (title/description'da "Türkçe GEO aracı" — araç kelime disiplini v1.11), yazı ilk ekranda araca yönlendirsin (ilk paragraf linki zaten var). Karar Burak |
| yerli geo aracı | 40 | araç 2 / 1,00 · yazı 38 / 1,32 | **Gerçek** | Aynı |
| diagnoo | 25 | EN araç 20 / 4,10 · TR araç 5 / 9,60 | hreflang çifti | Aksiyon yok |
| burak arda | 23 | EN 1 / 8,00 · TR 22 / 8,05 | hreflang çifti | Aksiyon yok |
| cagri erdogan | 23 | EN 15 / 5,07 · TR 8 / 5,13 | hreflang çifti | Aksiyon yok |
| **cro ajansı** | 18 | **hizmet `/tr/hizmetler/cro` 3 / 20,00 · yazı `cro-ajansi-nasil-secilir` 15 / 6,80** | **Gerçek — para sorgusu bölünüyor** | Aşağıda |
| cro nedir | 10 | `cro-ajansi-nasil-secilir` 7 / 33,43 · `cro-danismanligi-fiyatlari` 2 / 69,50 · `cro-nedir` 1 / 28,00 | Bilgi sorgusu, hedef sayfa en az gösterimde | Düşük öncelik (hepsi 3. sayfa ve ötesi) |
| dönüşüm oranlarını artırmak için türkiye'deki en iyi cro uzmanları kimlerdir? | 10 | `cro-ajansi-nasil-secilir` 6 / 46,67 · `donusum-orani-nasil-artirilir-21-taktik` 4 / 19,00 | Niyetli, iki yazı | CRO hizmet sayfası görünmüyor; "cro ajansı" kararıyla birlikte |
| yapay zeka danışmanı | 5 | hizmet `ai-danismanlik` 4 / 11,00 · 12-soru 1 / 33,00 | Hizmet önde | Aksiyon yok |
| ai görünürlük aracı | 4 | araç 3 / 33,67 · GEO rehberi 1 / 2,00 | Düşük hacim | İzle |
| çarpan (dönüşüm oranı) nedir | 3 | hizmet `cro` 1 / 71 · `cro-nedir` 2 / 39,50 | Gürültü | — |
| iş zekası danışmanlığı | 2 | `is-otomasyonlari` 1 / 67 · `is-zekasi` 1 / 17 | Gürültü (K-4 alanı) | — |
| llms.txt nedir, sitemin buna ihtiyacı var mı? | 2 | `google-ai-overviews-da-yer-almak` 1 / 6 · `turkiyenin-ilk-geo-denetim-araci` 1 / 7 | Hedef `llms-txt-nedir` görünmüyor | Düşük hacim, izle |

Kaynak: Ö09 (liste), QP09 (sayfa çiftleri).

**"cro ajansı" önerisi (karar Burak):** Eski hizmet URL'i bu sorgudan düştü (22 Eyl: 5 / 14,40 → 9 Eki: yok); yerine yeni hizmet sayfası geldi ama 20. pozisyonda. Yazı "cro ajansı nasıl seçilir" setinin doğal sayfasıdır ve sorguyu ilk sayfada tutuyor; onu hedeften düşürmek bugün ilk sayfadaki tek yüzeyi kaybettirir. Öneri: yazıya dokunma; hizmet sayfasını kanıtla güçlendir (fiyat yazısından ve 21 taktikten exact-anchor, SSS'te "kimle çalışmalıyım") ve **15 Ekim kontrolünde** (PL §5) hizmet sayfası hâlâ ilk 10 dışındaysa iki seçenek: (a) yazıyı "cro ajansı"nın SERP sayfası kabul et, hizmet sayfası "cro danışmanlığı" / "dönüşüm oranı optimizasyonu"na odaklansın; (b) hizmet sayfası için ayrı otorite işi (vaka + dış bağlantı) ve bir çekim daha bekle. Hipotez: Google "cro ajansı"nı liste/karşılaştırma niyeti okuyor, bu yüzden yazıyı öne alıyor.

---

## 8. Teknik sağlık

### 8.1 Cloudflare Workers (Free plan, istek başına 10 ms CPU)

| Gün | İstek | exceededResources | Aşım oranı (hesap) | Not |
|---|---|---|---|---|
| 25 Eyl | 3.350 | 0 | %0 | Deploy 5 + 6, IndexNow, indeks taraması — en yüksek istekli gün |
| 26 Eyl | 1.412 | 16 | %1,13 | |
| 27 Eyl | 1.270 | 0 | %0 | |
| 28 Eyl | 1.235 | 0 | %0 | |
| 29 Eyl | 2.922 | **231** | **%7,91** | |
| 30 Eyl | 1.522 | 0 | %0 | |
| 1 Eki | 3.305 | **190** | **%5,75** | |
| 2 Eki | 2.333 | 0 | %0 | Deploy 7 |
| 3 Eki | 2.048 | 0 | %0 | clientDisconnected 75 |
| 4 Eki | 2.257 | 0 | %0 | |
| 5 Eki | 1.886 | 0 | %0 | clientDisconnected 65 |
| 6 Eki | 1.224 | 0 | %0 | |
| 7 Eki | 2.131 | 0 | %0 | |
| 8 Eki | 2.547 | 0 | %0 | |
| **25 Eyl–1 Eki** | **15.016** | **437** | **%2,91** | |
| **2–8 Eki** | **14.426** | **0** | **%0** | |

Kaynak: CF. **Okuma:** CPU aşımı 2 Ekim'den beri sıfır. 29 Eyl ve 1 Eki aşımları yüksek istekli günlere denk geliyor; ama en yüksek istekli gün (25 Eyl, 3.350) aşımsız geçti ve 8 Eki (2.547) de temiz — "yüksek istek = aşım" kuralı veride tam tutmuyor, aşımın istek türüne (önbelleksiz render, bot taraması) bağlı olması **hipotez**. 25 Eyl kaydındaki "24 Eyl'den beri sıfır" (PL) sonrasında 26 Eyl, 29 Eyl ve 1 Eki'de tekrarladı. Plan hâlâ Free; yapısal risk (D22 §0: başarılı sayfa isteği ~83 ms CPU) sürüyor. Çözüm Workers Paid ($5/ay) — karar Burak (§12).

### 8.2 Deploy ve indeks

| Kalem | Durum | Kaynak |
|---|---|---|
| Son deploy | 2 Eki (Deploy 7), CF Version `119e882d-f5d4-4734-8974-aed5f040fcd5`, main `49d948d` = origin/main. 3–9 Eki arası repo'da yeni commit yok | PL, repo `git log` |
| Sitemap | 170 URL (Deploy 7 IndexNow 170 URL — liste `sitemap.xml`'den okunur, `scripts/indexnow-ping.ts`) | PL |
| Kilit liste | 52/52 dizinde. Faz 1 + 2 URL'leri listede değildi → bu kesitle 72'ye genişletildi (repo `scripts/gsc-kilit-urller.txt`) | İ09 |
| Yeni içerik | 18 URL'den 16 dizinde; EN `how-to-choose-an-ecommerce-consultant` ve `ecommerce-platform-consulting` "URL Google tarafından bilinmiyor" → GSC dizine ekleme isteği (Burak) | İY09 |
| Son tam sitemap taraması | 25 Eyl: 143/150 (2 bilinçli noindex, 2 EN vaka "kopya", 2 eski yazı "keşfedildi", SOYLU TR "bilinmiyor"). 170 URL'lik güncel sitemap için tarama yok | İ25 |
| Eski URL'ler | Payı %4,5. Kalan en büyük: `/web-tasarim-ui-ux-tasarimi/` 52 göst (UX hizmet sayfası yerine) · Turkcell BiP 404 URL 5 göst, CaffeBO 404 URL 2 göst (sinyal sönüyor) | Ö09, P09 |
| A-7 | `keyword-coverage.test.ts` 78/78, `gsc-kumeler.test.ts` 24/24 | T |

---

## 9. GEO — Ay 2 durumu ve karar maddesi

| Ay | Tarih | Sonuç | Kaynak |
|---|---|---|---|
| Ay 0 | 30 Ağu | 0/30 | GEO |
| Ay 1 | 1 Eyl | 1/30 (Perplexity C2 — `cro-ajansi-nasil-secilir` sessiz atıf) | GEO |
| Ay 2 | 2 Eki | **Kısmi 0/20** — ChatGPT 0/10, Gemini 0/10; Perplexity 0/10 işlenmedi ("Kaydolun" duvarı). 9 Eki itibarıyla hâlâ yapılmadı | GEO |
| Ay 3 | 1 Kas | Planlı | GEO |

**AI yönlendirme trafiği (GA4, 29 Ağu–8 Eki) — elle tur 0/20 derken motorlardan gerçek oturum geliyor:**

| Kaynak | Açılış sayfası | Oturum |
|---|---|---|
| gemini.google.com | `/tr/yazilar/chatgpt-reklamlari-turkiye` | 4 |
| chatgpt.com | (not set) | 2 |
| chatgpt.com | `/en/case-studies/odorgo-category-creation` | 2 |
| chatgpt.com | `/tr` | 2 |
| chatgpt.com | `/en` | 1 |
| chatgpt.com | `/en/about` | 1 |
| gemini.google.com | `/en/articles/ecommerce-conversion-rate-benchmarks` | 1 |
| gemini.google.com | `/tr/yazilar/e-ticaret-donusum-orani-benchmark` | 1 |
| **Toplam** | | **14** |

Kaynak: GA4. Turun 10 sabit promptu bu sayfaları (ChatGPT reklamları yazısı, OdorGo vakası, benchmark) sormuyor; tur kategori ve kısıt sorularında markanın anılmasını, GA4 ise motorların kullanıcıyı siteye gönderip göndermediğini ölçer. İkisi farklı sinyal; hacim küçük (10'un altındaki sayılardan trend çıkarılmaz).

**Karar maddesi 1 — Ay 2'nin kapanışı (Burak; karar verilmedi):**

| Seçenek | Ne olur | Bedel |
|---|---|---|
| (a) Burak Perplexity'de oturum açar | 10 prompt ~15 dk; Ay 2 X/30 ile kapanır, A-5 kuralı uygulanır | Oturum açık hesap sapması (Ay 0 ve Ay 1'de de vardı, `ozet.md` şerhleri) |
| (b) Oturum açılmaz | Ay 2 "0/20 + Perplexity yapılmadı" olarak kapanır; A-5 değerlendirmesi Ay 3'e (1 Kas) ertelenir | Ay 1'in tek geçişi Perplexity'deydi — bu motor olmadan 0/20 A-5 için anlamlı bir sıfır değil |

**Karar maddesi 2 — GEO ölçümüne "AI yönlendirme oturumu" eklensin mi (Burak):** öneri, prompt seti değişmeden GA4'ten aylık AI-referral oturumu (chatgpt.com, perplexity.ai, gemini.google.com, copilot, claude.ai) ayrı satır olarak GEO özetine yazılsın; A-5 eşiği prompt turunda kalır.

---

## 10. Takvim ve fazlar — yapılan / kalan

| Faz | Tarih (YH §4) | Yapılan | Kalan |
|---|---|---|---|
| **1 — Ölçüm ve boşluklar** | 28 Eyl – 12 Eki | Niyetli sorgu seti + GSC N0 kümesi (25 Eyl) · strateji v1.18 ve A-4'ün yeni ölçüye çevrilmesi · GEO hizmet sayfası + "GEO ajansı nasıl seçilir" · CRO "neye mal olur" (Deploy 6, 25 Eyl) · GA4 erişimi (9 Eki) | 1 Ekim GEO turu **kısmi** (Perplexity) · GBP adı düzeltme + yorum ritüeli **teyit bekliyor** · Clutch, GoodFirms, Sortlist profilleri **teyit bekliyor** (kit hazır: repo `docs/strateji/Dis-Profil-Kiti-2026-09.md`) · A-4 "üçten ikisi" eşiği Burak teyidi |
| **2 — AI ve e-ticaret** | 13 Eki – 9 Kas | İçerik ayağı **erken bitti (2 Eki)**: yapay zeka danışmanlığı fiyatları · büyük danışmanlık mı butik ajans mı · e-ticaret üçlüsü (danışman nasıl seçilir, fiyatlar, platform danışmanlığı) · e-ticaret hizmet sayfası yeniden konumlandı, kanıt şeridi OdorGo + Meccanotecnica Umbra · İKAS bayiliği açıklaması | Turkcell/CaffeBO vakaları (**Burak**; hammadde `docs/strateji/Vaka-Hammadde-Turkcell-CaffeBO-2026-09-18.md`) · vakaların karar kümelerine iki yönlü bağlanması · 2 EN e-ticaret yazısının indekse girmesi |
| **3 — Kanıt ve otorite** | 10 Kas – 20 Ara | Benchmark yazısı kamuya açık veri derlemesi olarak 25 Eyl'de yayında (Deploy 5) | Dijital dönüşüm karar kümesi (N0'da tek sorgu, poz 61) · UX ajansı itişi (önce eski URL konsolidasyonu, §5) · benchmark + GEO ölçüm verisiyle dijital PR · 30 Kasım 90 gün raporu |

Kaynak: YH §4, PL, İY09, Ö09. **Ritim:** YH "haftada 1 karar içeriği + 1 destek" ister; 25 Eyl–2 Eki arasında 9 yazı + 1 yeni hizmet sayfası yayımlandı, 3–9 Eki arasında yeni içerik yok (repo `git log`).

---

## 11. İş listesi

| # | İş | Sahibi | Tarih | Neden |
|---|---|---|---|---|
| 1 | GSC'de dizine ekleme isteği: `/en/articles/how-to-choose-an-ecommerce-consultant`, `/en/articles/ecommerce-platform-consulting` | **Burak** | 10 Eki | 7 gündür "bilinmiyor" (İY09) |
| 2 | GSC'de eski `/web-tasarim-ui-ux-tasarimi/` için URL denetimi + dizine ekleme isteği | **Burak** | 10 Eki | UX hizmet sayfası üç çekimdir 0 gösterim; "ux ajansı" eski URL'de (§5) |
| 3 | Perplexity oturumu → Ay 2'yi kapat, ya da karar maddesi 1(b) | **Burak** | 12 Eki | A-5 açık (§9) |
| 4 | 12-soru yazısının köprü paragrafına `/hizmetler/geo-danismanligi` linki (TR + EN) | Claude (Burak onayıyla) | 13 Eki | CTR §4 kuralı; GEO niyetli sorgu 30 göst bu sayfada (§6) |
| 5 | `ai-danismanlik` için title/description önerisi ("ai danışmanlığı" eşleşmesi) — öneri tablosu, uygulama Burak onayıyla | Claude | 14 Eki | Hizmet sayfası payının en büyük kalemi, 136 göst / 0 tık (§5) |
| 6 | GEO aracı yazısı ↔ araç sayfası niyet ayrımı önerisi (A-6) | Claude | 14 Eki | 77 göst poz 1-3, 0 tık (§7) |
| 7 | "cro ajansı" kontrolü + A-6 seçeneği | Claude → Burak | 15 Eki | PL §5 kontrol noktası (§7) |
| 8 | Haftalık GSC çekimi (`pnpm gsc:weekly`, 72 URL'lik kilit listeyle ilk koşu) + `haftalik-log.md` kaydı + revizyon sonrası temiz CTR penceresi | Claude | 12–16 Eki | Runbook; §6 |
| 9 | Tam sitemap indeks taraması (170 URL) | Claude | 16 Eki | Son tam tarama 25 Eyl, 150 URL (A-2) |
| 10 | GA4 haftalık çekimini birleştir (`scripts/ga4-pull.mjs`, `pnpm ga4:pull` / `pnpm olcum:weekly`) ve log'un niyet bölümüne form/brief + AI-referral satırı | Claude | dal birleşince | §13 |
| 11 | Turkcell/CaffeBO anlatısı → vakalar + 2 redirect + ADR-019 notu | Burak → Claude | Faz 2 (9 Kas'a kadar) | 404 URL'ler hâlâ gösterim alıyor |
| 12 | Workers Paid kararı | **Burak** | açık | §8.1 |
| 13 | Off-site profiller + GBP adı teyidi | **Burak** | açık | Faz 1 kalanı |
| 14 | GEO Ay 3 turu | Claude (tarayıcı oturumu Burak) | 1 Kas | Rutin |
| 15 | Dijital dönüşüm karar kümesi taslağı | Claude | 10 Kas | Faz 3 |
| 16 | 30 Kasım 90 gün raporu (A-4 yeni tanımla) | Claude | 30 Kas | Strateji §9.2 |

---

## 12. Burak'ta bekleyen kararlar ve teyitler

| # | Konu | Durum | Nerede |
|---|---|---|---|
| 1 | **Perplexity / Ay 2 kapanışı** | Seçenek (a) veya (b) | §9 |
| 2 | **GEO'ya "AI yönlendirme oturumu" ölçüsü** | Öneri | §9 |
| 3 | **"İlk 10" hedefi yükseltilsin mi** — 12+ aşıldı (18); öneri seçeneği: hedefi koru ama "ilk 10'da ve ≥5 gösterimli" alt ölçüsünü ekle (bugün 7) | Açık | §3.3, strateji v1.20 |
| 4 | Hizmet sayfası payına TR alt ölçüsü (bugün %14,9) | Öneri | §5 |
| 5 | A-4 "üçten ikisi" eşiği | v1.18'den beri teyit bekliyor | strateji §9.2 |
| 6 | "cro ajansı" A-6 seçeneği (a) / (b) | 15 Eki kontrolünden sonra | §7 |
| 7 | **Workers Paid** ($5/ay) | Açık | §8.1, D22 §0 |
| 8 | **Diagnoo motor anahtarları** (`GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY` + uzak D1 migration) — üç e-ticaret yazısı Diagnoo'yu linkliyor | Açık | PL §7 (d) |
| 9 | **İKAS faturalama** — abonelik INDOLES üzerinden mi, mağaza hesabı firmanın adına mı | Teyit bekliyor | PL §7 (a) |
| 10 | **İKAS dışında başka bayilik / partnerlik** (Shopify, Ticimax, İdeaSoft, bulut, yapay zeka) | Teyit bekliyor | PL §7 (b) |
| 11 | **Site taşıma anlatısı** — platform yazısındaki 29-30 Ağu olayı kalsın mı | Açık | PL §7 (c) |
| 12 | **Turkcell / CaffeBO** anlatısı | Burak'ta | §10 |
| 13 | **Clutch, GoodFirms, Sortlist profilleri** | Teyit bekliyor | §10 |
| 14 | **GBP adı** ("INDOLES Creative & E-Commerce Agency" → sitedeki varlık adıyla hizalama) + yorum ritüeli | Teyit bekliyor | PL §7 (25 Eyl) |
| 15 | Hizmet terimi taşımayan karar sorguları ("hangi ajansla çalışmalıyım") ayrı bağlam satırı mı | Açık | NS §5 |
| 16 | İletişim sayfası H1'i randevu dilinde | Açık (22 Eyl'den beri) | PL §7 Deploy 4 |

---

### 12.1 Burak kararları (9 Ekim, öğleden sonra)

| Madde | Karar |
|---|---|
| Workers Paid | **Alındı** — CPU sınırı 30 sn; 1102/503 riski kapandı |
| GBP adı / dizin kayıtları | **Tamam** |
| Diagnoo motor anahtarları | Burak hallediyor |
| Turkcell / CaffeBO vakaları | Sonra |
| Perplexity (GEO Ay 2) | **Yapılmayacak**; Ay 2 kısmi kapandı, A-5 → Ay 3 (1 Kas) |
| GA4 istenmeyen yönlendirme + IP filtresi | İptal |
| Canlı form testi (`contact_form_submitted`) | **Onaylandı**, 9 Eki yapıldı — sonuç haftalık log'da |
| Dizine ekleme (2 EN e-ticaret yazısı + eski UX adresi) | Liste verildi |
| **Yön** | "Satış niyetli kelimelerde ilk 3" — İlk 3 programı: `docs/strateji/Ilk-3-Programi-2026-10.md` |

## 13. GA4 kuruldu — haftalık çekim `pnpm ga4:pull` / `pnpm olcum:weekly` (ayrı dalda yazılıyor, birleştirmede eklenecek)

**Burak'ın yaptıkları (9 Eki):** servis hesabı `indoles@indoles-web-calendar.iam.gserviceaccount.com` GA4 mülküne **Düzenleyici** olarak eklendi · GCP projesi `indoles-web-calendar`'da Analytics **Data API** ve **Admin API** açık · mülk **553152492** (ölçüm kimliği `G-KWT8HCXJT6`, repo `docs/12-analytics-measurement.md`). Erişim test çekimiyle doğrulandı.

**Kalan:** `scripts/ga4-pull.mjs` ayrı dalda; çıktı `Marketing/GA4-Data/haftalik-<tarih>/` olacak. Birleşince haftalık log'un niyet bölümüne form/brief ve AI-referral satırları GA4 çıktısından yazılır (runbook adım 4 zaten bunu öngörüyor). Repo'daki OAuth tabanlı `pnpm ga4:setup` / `pnpm ga4:verify` yolu ayrıdır ve değişmedi.

**Test çekiminin rakamları (GA4, 9 Eyl–8 Eki):**

| Oturum kaynağı | Oturum / kullanıcı |
|---|---|
| email | 72 / 72 |
| google | 61 / 54 |
| (direct) | 55 / 47 |
| fyrluxury.com | 10 / 1 |
| **chatgpt.com** | **8 / 4** |
| search.google.com | 7 / 1 |
| **gemini.google.com** | **6 / 3** |
| bionluk, facebook, ig, linkedin, meccanotecnica.com.tr | 1'er |

| Olay (eventCount) | Sayı |
|---|---|
| page_view | 247 |
| session_start | 224 |
| first_visit | 186 |
| user_engagement | 104 |
| popup_shown · popup_dismissed | 49 · 32 |
| service_viewed · pillar_viewed · case_study_viewed | 29 · 13 · 11 |
| faq_opened · persona_axis_clicked · tool_used | 5 · 4 · 4 |
| booking_cta_clicked · popup_stage1_selected · tool_scan_completed | 3 · 3 · 3 |
| popup_stage2_submitted · popup_stage3_viewed · tool_roadmap_item_expanded | 2 · 2 · 2 |
| **contact_booking_submitted (anahtar)** | **1** |
| package_viewed | 1 |
| **phone_clicked (anahtar)** | **1** |
| **tool_report_requested (anahtar)** | **1** |
| **contact_form_submitted** | **0** |

Kaynak: GA4. Kapsam: TR'de varsayılan onay (ADR-035) ve ölçüm mimarisi (ADR-034) yüzünden sayılar alt sınır; ~230 oturum küçük hacim. GSC'nin 29 günlük 52 tıkı ile GA4'ün 30 günlük 61 google oturumu aynı büyüklükte (pencereler bir gün kayık).

---

## 14. Kavramsal not — gösterim artıyor, tık artmıyor

Niyet kümesinde sıralama var (ilk 10'da 18 sorgu) ama tık yok (1). Olası nedenleri veriyle destekleneni ve hipotezi ayırarak:

| Neden | Veri ne diyor | Hüküm | Kaynak |
|---|---|---|---|
| **Hacim çok küçük** | İlk 10'daki 18 sorgunun toplamı 127 gösterim. Sitenin kendi 5-10 bandı sayfa CTR'ı %1,59 (21 / 1.322) → beklenen ~2 tık; 0 tık bu hacimde ayırt edilemez (Poisson, λ≈2,0: P(0)≈%13). Ayda 20 niyetli tık için bu CTR'la ~1.260 niyetli gösterim gerekir; bugün 29 günde 331 | **Destekleniyor** — hedef bugünkü hacimle matematiksel olarak uzak | Ö09, P09 (hesap) |
| **Ölçüm körlüğü** | 52 tıkın yalnız 4'ü görünen sorgularda; 48 tık (%92) anonim sorgulardan. N0 tık ölçüsü yapısal olarak alt sınır | **Destekleniyor** | Q09, Ö09 (hesap) |
| **Pozisyon 5-10 bandı** | Para sorguları 7-10 bandında: ai danışmanlığı 7,00 · cro ajansı 9,00 · yapay zeka görünürlük danışmanlığı 9,28 · yapay zeka danışmanlığı 10,29. Sayfa CTR'ı bantlara göre: 3-5 %4,35 · 5-10 %1,59 · 10-20 %0,83 | **Destekleniyor** — ilk 3'e çıkmadan tık beklenmez | Ö09, P09 (hesap) |
| **AI Overviews / AI Mode** | Poz 1-3 bandında görünen sorgular 143 göst / 0 tık; sayfa düzeyinde 106 göst / 0 tık (çoğu GEO aracı yazısı). Konuşma biçimli sorgular (≥6 kelime ya da "?") 82 sorgu / 201 göst / 0 tık / poz 14,39. GSC, AI Overview ya da AI Mode gösterimini ayırmıyor | **Hipotez** — elle SERP kontrolü gerekli | Q09, P09 (hesap) |
| **Title / sorgu eşleşmesi** | `ai-danismanlik` title'ı "ai danışmanlığı"nı (26 göst, poz 7,0) taşımıyor; `geo-danismanligi` eşleşiyor ama poz 27 | **Kısmen** — eşleşme eksikliği var, etkisi hipotez | §5 |
| **Hizmet sayfası snippet'i** | Description'ların SERP'te aynen basılıp basılmadığı kontrol edilmedi | **Hipotez** | — |

Sonuç: Bu fazın ilerlemesi gerçek ama tık ölçüsünün ulaşabileceği yerde değil. Sıralama ilk 10'a girdi, ilk 3'e girmedi; hacim tık üretmeyecek kadar küçük; tıkların %92'si zaten görünmüyor. Bir sonraki dört haftanın işi yeni bilgi yazısı değil: iki hizmet sayfasını ilk 3'e taşımak (`ai-danismanlik` için eşleşme ve kanıt, `geo-danismanligi` için sıralama), niyetin yanlış sayfaya gittiği üç yeri düzeltmek (12-soru → GEO hizmeti, GEO aracı yazısı → araç, UX eski URL → hizmet sayfası) ve sonucu GSC'nin değil GA4'ün form ve AI-referral satırlarında okumak. Toplam gösterim TR dışında büyüyor ve bu, v1.18'in bilerek ölçü dışında bıraktığı büyüme.

---
**Sonraki kesit:** 30 Kasım 90 gün raporu; ara kayıt haftalık log'da (12-16 Eki).
