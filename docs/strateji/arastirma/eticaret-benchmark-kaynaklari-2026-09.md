# E-ticaret dönüşüm oranı benchmark'ları — kaynak dosyası (2026-09)

Yazı: `/yazilar/e-ticaret-donusum-orani-benchmark` (takvim h.5-1). Erişim tarihi: **25 Eylül 2026**.

**Kural:** Yazıya yalnız bu dosyada kaynağından okunmuş rakamlar girdi. Kaynağından doğrulanamayan
rakam kullanılmadı; aday ve gerekçesi §4'te. INDOLES'in paylaşılabilir müşteri verisi yok; yazıda
"orijinal veri" iddiası yok, yazı derleme ve yorumdur.

**Birincil / ikincil:** Birincil = rakamı üreten kuruluşun kendi sayfası, veri dosyası ya da PDF'i.
İkincil = başkasının aktardığı rakam. Yazıya yalnız birincil rakam girdi.

---

## 1. Kaynak künyesi

| # | Kaynak | Rapor / sayfa | Yayın / güncelleme | Ölçüm dönemi | Örneklem / kapsam | Dönüşüm tanımı | URL | Tür |
|---|--------|---------------|--------------------|--------------|-------------------|----------------|-----|-----|
| K1 | Dynamic Yield by Mastercard | eCommerce Benchmarks (Conversion Rate, Add-to-Cart, Cart Abandonment, Device Usage) | Kayan seri; son ay Temmuz 2026 | Ağustos 2025 – Temmuz 2026 (12 ay) | DY müşteri tabanı: aylık 200M tekil kullanıcı, 300M oturum; küresel, 8 sektör, 3 bölge | "% of completed purchases by visitors" — tamamlanan satın alma ÷ ziyaretçi (sayfa formülü: Completed Purchases ÷ Total Visitors × 100) | https://marketing.dynamicyield.com/benchmarks/conversion-rate/ · ham veri: `/benchmarks/data/generated.json` | Birincil (veri dosyası okundu) |
| K2 | Contentsquare | 2026 Digital Experience Benchmark (ana sayfa + conversions, engagement, retention, mobile stats rehberleri) | Rapor 25 Şubat 2026; rehberler 9 Mart / 11 Nisan / 14 Nisan 2026 | 2024 son çeyreği → 2025 son çeyreği (YoY) | 6.500+ site, 9 sektör, 99 milyar web + uygulama oturumu | "Share of visits that include a conversion event, like a purchase or form submission" — ziyaret bazlı, satın alma dışı dönüşümler dahil | https://contentsquare.com/guides/digital-experience-benchmark/ · /conversions/ · /engagement/ · /retention/ · https://contentsquare.com/guides/mobile-analytics/stats/ · https://go.contentsquare.com/en/digital-experience-benchmark | Birincil |
| K3 | IRP Commerce | eCommerce Market Data | Aylık; okunan ay Ağustos 2026 | Ağustos 2026 (karşılaştırma Ağustos 2025) | "Independent SME and mid-market merchants", Büyük Britanya, Kuzey İrlanda, İrlanda; IRP platformunun birinci taraf verisi; mağaza sayısı açıklanmıyor | "Transactions ÷ Sessions × 100 (Session Conversion Rate)" | https://www.irpcommerce.com/en/gb/ecommercemarketdata.aspx | Birincil |
| K4 | Triple Whale | Ecommerce Benchmarks 2026 | Son güncelleme 24 Ağustos 2026 | Ağustos 2025 – Temmuz 2026 | 53.000+ markanın ücretli reklam medyanları (veri seti 60.000+ marka; anonim, markalar arası medyan) | Ücretli reklam kanallarında CVR medyanı; payda sayfada açık tanımlanmıyor | https://www.triplewhale.com/blog/ecommerce-benchmarks (WebFetch/curl 403; tarayıcıyla okundu) · yöntem: https://www.triplewhale.com/blog/ads-benchmarks | Birincil (yalnız kendi verisi) |
| K5 | Littledata | Average ecommerce conversion rate (all devices) — Shopify | 2023 | 2023 | 2.800 Shopify mağazası | Sayfada açık tanım yok | https://www.littledata.io/average/ecommerce-conversion-rate-(all-devices) | Birincil |
| K6 | Baymard Institute | Cart Abandonment Rate Statistics (liste) | Son güncelleme 22 Eylül 2025 | 2006–2025 arası 50 çalışma; terk sebepleri "en son nicel çalışma", ABD'li çevrim içi alışverişçiler | 50 çalışmanın ortalaması; sebep anketinin örneklem sayısı sayfada verilmiyor | Sepet terki: çalışmaların kendi tanımları (ortalama) | https://baymard.com/lists/cart-abandonment-rate | Birincil (derleme; ortalama Baymard'ın kendi hesabı) |
| K7 | T.C. Ticaret Bakanlığı | Türkiye'de E-Ticaretin Görünümü Raporu 2025 (ETBİS) | 12 Mayıs 2026 | 2025 takvim yılı | ETBİS kayıtları, sanal POS; kanal sorusu 781 işletmelik Bakanlık anketi; bazı göstergeler yalnız pazar yerleri | Dönüşüm oranı **ölçülmüyor** | https://ticaret.gov.tr/duyurular/turkiyede-e-ticaretin-gorunumu-raporu-yayinlandi-12-05-2026 · PDF: https://ticaret.gov.tr/data/6a02f2c7269de183c0b98bc4/ | Birincil (PDF okundu) |
| K8 | TÜİK | Hanehalkı Bilişim Teknolojileri (BT) Kullanım Araştırması, 2026 (bülten 58006) | 5 Ağustos 2026 | 2026 (son 3 ay: 2026 ilk çeyreği) | 16-74 yaş bireyler | — | https://veriportali.tuik.gov.tr/tr/press/58006 (JS portal; tarayıcıyla okundu) | Birincil |
| K9 | iyzico · Dogma Alares · ETİD | Türkiye E-Ticaret Ekosistemi 2025 | 17 Haziran 2026 | 2025; satıcı anketi 2026 | iyzico işlem verisi + 108 satıcılık anket | Dönüşüm oranı ölçülmüyor | https://www.iyzico.com/assets/uploads/pdf/iyzico_ecommerce_report_2025.pdf | Birincil (PDF okundu) |

---

## 2. Yazıda kullanılan rakamlar

### K1 — Dynamic Yield (12 aylık ortalama = sayfanın `overall_*` değişkenleri; aylık değerler veri dosyasından)

| Gösterge | Değer | Not |
|----------|-------|-----|
| Küresel dönüşüm oranı | %2,72 | Aylık seri: Kasım 2025 %3,34 · Aralık 2025 %3,30 · Nisan 2026 %2,33 (yılın en düşüğü) · Temmuz 2026 %2,55 |
| Sektör | Kozmetik ve kişisel bakım %5,39 · Gıda ve içecek %4,80 · Evcil hayvan bakımı %4,71 · Çok markalı perakende %3,01 · Moda, aksesuar ve giyim %2,77 · Tüketim ürünleri %2,47 · Ev ve mobilya %1,22 · Lüks ve mücevher %0,72 | Elektronik kırılımı yok. Evcil hayvan serisi oynak (aylık %2,24–%7,68) |
| Cihaz | Mobil %2,88 · Tablet %2,85 · Masaüstü %2,37 | Masaüstü 2026'da %1,75–%2,10 bandına indi (Kasım 2025 %3,35) |
| Bölge | EMEA %2,89 · Amerika %2,66 · APAC %1,51 | |
| Sepete ekleme | %6,08 (mobil %6,35 · masaüstü %5,21) · sektör: kozmetik %9,56 · moda %6,24 · ev ve mobilya %3,67 · lüks ve mücevher %1,76 | Tanım: ürün sayfası görüntülemesinden sonra sepete eklenen ürün oranı. Moda ve ev-mobilya değerleri aylık serilerin bizim hesapladığımız 12 ay ortalaması (kozmetik ve lüks sayfanın `overall_*` değişkeniyle aynı) |
| Sepet terki | %77,55 (mobil %79,84 · masaüstü %69,48) | Tanım: sepete eklenip satın alınmayan ürün oranı |
| Mobil trafik payı | %75,75 (12 ay ortalaması) | Sektör bazında bizim hesabımız (aylık payların ortalaması): kozmetik ~%91, ev ve mobilya ~%63 |

### K2 — Contentsquare 2026

| Gösterge | Değer |
|----------|-------|
| Dönüşüm oranı değişimi | -%5,1 (YoY); AOV +%6; gelir +%1 |
| Cihaz | Masaüstü %3,4 · mobil %2 — masaüstü %74 yüksek (engagement sayfası "%75" yazıyor; yazıda %74 kullanıldı, iki sayfanın ortak değeri) · perakende: masaüstü %3,7, mobil %2 |
| Mobil trafik payı | %69,9 |
| Ziyaretçi tipi | Geri dönen %2,9 · yeni %1,7; geri dönenler trafiğin %52,8'i |
| Kanal | Ücretli arama %2,8 (ücretli kanallar içinde en yüksek; ücretli arama organik aramanın üstünde) · yapay zekâ yönlendirmeli trafik %1,3 (YoY +%55; trafik +%632) · organik sosyal %0,7 |

### K3 — IRP Commerce (Ağustos 2026)

Genel %2,23 (Ağustos 2025: %1,85) · Moda giyim ve aksesuar %1,86 · Sağlık ve zindelik %3,31 ·
Mutfak ve ev aletleri %2,98 · Yiyecek ve içecek %1,58 · Bebek ve çocuk %0,57 · Sanat ve el işi %5,81.
Aynı sayfada YoY iki farklı yazılmış (+%20,14 / +%20,49) — yazıda yüzde değişim kullanılmadı.

### K4 — Triple Whale (ücretli reklam medyanları, Ağustos 2025 – Temmuz 2026)

CVR %1,69 (önceki döneme göre -%4,63) · Gıda ve içecek %2,60 (AOV 63,32 $) · Evcil hayvan %2,39 ·
Güzellik %2,38 · Giyim ve aksesuar %1,80 · Ev ve bahçe %1,64 · Elektronik %1,49 (AOV 113,41 $).

### K5 — Littledata (2023, 2.800 Shopify mağazası)

Ortalama %1,4 · en iyi %20: %3,2 üstü · en iyi %10: %4,7 üstü · mobil %1,2 · masaüstü %1,9.

### K6 — Baymard Institute

Ortalama sepet terki %70,22 (50 çalışma, 2006–2025; en düşük %55,00 Forrester 2010, en yüksek %84,27
SaleCycle 2020) · "Yalnızca bakıyordum" %42 · Bu grup dışarıda bırakıldığında sebepler: ek maliyet %40,
yavaş teslimat %20, kart bilgisine güvenmeme %19, zorunlu hesap %18, uzun/karmaşık ödeme %17, site hatası
%17 · Ortalama ABD ödeme akışı 23,48 form öğesi; ideal 12-14 · Büyük ölçekli e-ticaret sitesi için daha
iyi ödeme tasarımıyla %35,26 dönüşüm artışı potansiyeli.

### K7 — Ticaret Bakanlığı, 2025 verisi

- Hacim 4,57 trilyon TL (+%52,2) · 5,94 milyar işlem · perakende 2,46 trilyon TL (+%51,8) · 634.611 işletme
- E-ticaret / genel ticaret %19,3 · Kasım %22,4 · yaz %17-18 bandı · Aralık %17,6
- Sektörde e-ticaretin genel ticarete oranı (yıl / Kasım): elektronik %38,6 / %49,4 · giyim %25,4 / %32,4 ·
  spor-outdoor %35,7 / %48,5 · beyaz eşya %35,3 / %61,4 · gıda ve süpermarket %5
- Sektör hacmi: giyim, ayakkabı ve aksesuar 428,70 milyar TL · elektronik 304,34 milyar TL
- Ortalama sepet (TL): beyaz eşya ve küçük ev aletleri 10.513 · ev, bahçe, mobilya ve dekorasyon 9.388 ·
  medikal, kişisel bakım ve kozmetik 3.062 · giyim, ayakkabı ve aksesuar 2.910 · elektronik 1.894 ·
  gıda ve süpermarket 889
- İptal ve iade oranı: giyim %21,6 · elektronik %12,0 · spor-outdoor %11,4 · beyaz eşya %7,2 ·
  medikal, kişisel bakım ve kozmetik %3,2
- Ödeme: kart %62,5 · havale/EFT %29,2 · kapıda %3,5 · diğer %4,8
- Harcama tipi: diğer ülkelerin Türkiye'deki sitelerden alımları hacmin %3,7'si
- Satış kanalı (781 işletme anketi): %48,8 hem kendi site hem pazar yeri · %39,5 yalnız pazar yeri ·
  %11,7 yalnız kendi site
- Ortalama kargo teslim süresi 42,2 saat (2023: 46,2)
- **Mobil pay: raporda yok.** Dönüşüm oranı: raporda yok.

### K8 — TÜİK 2026

İnternetten mal/hizmet siparişi veren birey oranı %60,0 (2025: %55,7), 16-74 yaş.

### K9 — iyzico · Dogma Alares · ETİD (108 satıcılık anket)

Aktif yurt dışı satış yapan %35 · "yurt dışına satış, globalleşme zorlukları" %44 · "mobil uyum ve
optimizasyon zorlukları" %35.

---

## 3. Tanım farkları (yazının "neden tek oran yok" bölümünün dayanağı)

1. **Payda.** IRP oturum bazlı (işlem ÷ oturum). DY ziyaretçi bazlı (satın alma ÷ ziyaretçi).
   Contentsquare ziyaret bazlı ama payda "dönüşüm olayı içeren ziyaret" — satın alma dışı olayları da
   sayabilir. Aynı mağazada kullanıcı bazlı oran oturum bazlıdan yüksek çıkar.
2. **Pay.** Contentsquare form gönderimi gibi satın alma dışı dönüşümleri kapsayabilir; DY, IRP,
   Littledata satın almayı sayar. Triple Whale ücretli reklam kanalına atfedilen dönüşümü ölçer.
3. **Örneklem.** DY: kişiselleştirme yazılımı kullanan markalar (ölçek varsayımı INDOLES yorumudur).
   Contentsquare: 6.500+ site, 9 sektör (perakende dışı sektörler dahil). IRP: İngiltere/İrlanda
   bağımsız KOBİ ve orta ölçek. Littledata: Shopify. Triple Whale: reklam verisini bağlamış markalar.
4. **İstatistik.** DY 12 aylık ortalama; IRP tek ay; Triple Whale medyan; Littledata ortalama +
   yüzdelik; Contentsquare çeyrek karşılaştırması.
5. **Sepet terki.** Baymard 50 çalışmanın ortalaması (her çalışma kendi tanımıyla); DY ürün bazlı
   ("items left in carts"). İki rakam aynı şeyi ölçmüyor; yazıda yan yana ama ayrı adlandırıldı.

**Çelişki kaydı — cihaz:** Contentsquare (2025 son çeyreği) ve Littledata (2023) masaüstünü önde
ölçerken DY'nin 12 aylık serisi mobili önde gösteriyor. Yazıdaki açıklama INDOLES yorumudur ve öyle
işaretlidir: DY örnekleminde en yüksek dönüşen sektör (kozmetik) trafiğinin ~%91'ini mobilden alıyor,
en düşüklerden ev ve mobilya ~%63 — cihaz ortalaması sektör karmasını taşıyor. DY'de masaüstü oranı
2026'da belirgin düştü (Kasım 2025 %3,35 → Temmuz 2026 %1,76).

**Çelişki kaydı — gıda:** DY gıda ve içecek %4,80, IRP yiyecek ve içecek %1,58. Aynı sektör adı,
farklı mağaza tipi ve ülke; yazıda örneklem farkının örneği olarak kullanıldı.

---

## 4. Kullanılmayan / doğrulanamayan adaylar

| Aday | Durum | Gerekçe |
|------|-------|---------|
| Salesforce Shopping Index (dönüşüm, sepet terki, mobil pay) | Kullanılmadı | Sayfa yalnız etkileşimli pano; metinde rakam yok. Üçüncü taraf sitelerde geçen "Q2 2026 sepet terki %82" ve "trafik +%18" kaynağından doğrulanamadı |
| Statista (e-ticaret dönüşüm oranı özetleri) | Kullanılmadı | Açık özetler ikincil, tablo erişimi ücretli |
| Contentsquare alt sektör oranları (moda %1,5, elektronik %2,2, gıda %3,8, evcil hayvan %3,1) | Kullanılmadı | Yalnız üçüncü taraf özetlerde; Contentsquare sayfalarında bulunamadı (etkileşimli gezgin form arkasında) |
| Triple Whale sayfasındaki "küresel %2,66", "Shopify %1,40", "mobil %1,2 / masaüstü %1,9", "mobil trafik %73", "mobil sepet terki %73-75" | Kullanılmadı | Triple Whale'in kendi verisi değil, kaynaksız aktarım (ikincil). Shopify rakamı Littledata'dan birincil olarak alındı |
| Dynamic Yield ortalama sipariş değeri serisi | Kullanılmadı | Aylık seri tutarsız (12 ay ort. 192 $, Temmuz 2026 değeri 35 $); tanım metni ("unique purchases per visitor") başlıkla çelişiyor |
| Ticimax "mobil işlem payı %72" | Kullanılmadı | Mordor Intelligence / eMarketer aktarımı; birincil kaynak ücretli |
| Ticimax "ideal dönüşüm oranı %2-5" | Kullanılmadı | Kaynaksız ("e-ticaret uzmanları") |
| ikas, IdeaSoft, Ticimax'ın kendi mağaza verisinden dönüşüm oranı | Bulunamadı | Üç sağlayıcı da kendi toplu dönüşüm verisini yayımlamıyor; bloglar yabancı kaynak aktarıyor |
| TÜBİSAD e-ticaret raporu | Bulunamadı | 2025-2026 için açık, güncel bir rapor bulunamadı |
| ETİD | Ayrı kullanılmadı | Güncel veri yalnız iyzico raporunun ortak yazarı olarak (K9) |
| iyzico raporu ortalama sepet 1.278 TL ve satıcı segmenti sepetleri | Kullanılmadı | Doğrulandı ama yazıda Bakanlık sektör sepetleri daha kapsamlı; tekrar olmasın diye dışarıda |
| Baymard mobil sepet terki | Bulunamadı | Liste sayfasında cihaz kırılımı yok; cihaz kırılımı K1'den |
| Littledata sektör oranları (gıda %1,5, moda %1,9) | Kullanılmadı | 2023 verisi; sektör kırılımı için 2025-2026 serileri (K1, K3, K4) tercih edildi |
| Türkiye'ye özgü e-ticaret dönüşüm oranı | Bulunamadı | Kamuya açık, yöntemi açıklanmış seri yok — yazıda açıkça söylendi |
| Türkiye mobil alışveriş payı (resmi) | Bulunamadı | Bakanlık 2025 raporu mobil payı vermiyor; yazıda küresel mobil trafik payları (K1, K2) kullanıldı ve Türkiye verisi olmadığı belirtildi |
