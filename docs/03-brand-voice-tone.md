# Marka Sesi ve Ton Rehberi (Brand Voice & Tone)

Bu doküman INDOLES'in yazılı iletişiminin ses kimliğini, iki persona için ton profillerini, editorial dil mekaniklerini, kelime/ifade kurallarını ve kanal bazlı uyarlamaları tanımlar. Site copy'si, e-posta, chatbot diyaloğu, sosyal medya ve proposal dokümanları bu rehberden türer.

**Bağımlılıklar:**
- Upstream: `01-vision-positioning.md` (persona'lar, positioning statement, manifesto, ton gerilimi çerçevesi)
- Downstream: `07-ai-agent-spec.md` (chatbot teknik akışı — ses ve ton burada, tool'lar ve akış orada)
- İlişkili: `04-design-system-principles.md` (tipografi ve görsel dil, yazılı ses ile uyumlu olmalı)

---

## 1. Brand Voice Temeli

### Ses Tanımı

> INDOLES öğreterek güven inşa eden, sahada kanıtlayan ve sonucu ölçülebilir kılan bir sesle konuşur.

Bu cümle INDOLES'in tüm yazılı iletişiminin pusula cümlesidir. Bir metin bu üç fiilden en az birini taşımıyorsa — öğretmiyor, kanıtlamıyor, ölçmüyor — INDOLES sesinde yazılmamıştır.

### Köşe Taşı Cümle

> "Her sayfa ziyaretçiye bir şey öğretir — INDOLES'in uzmanlığını satmak için değil, güven inşa etmek için."

Bu cümle `01-vision-positioning.md` Bölüm 4'ten alınmıştır ve brand voice'un eğitici ekseninin referans noktasıdır.

### Voice vs. Tone

| Kavram | Tanım | Değişir mi? |
|--------|-------|-------------|
| **Voice** (ses) | INDOLES'in marka kimliği — kim olduğumuz | Hayır. Her zaman aynı: eğitici, somut, fiil-ağır, kanıt-odaklı |
| **Tone** (ton) | Sesin bağlama göre ayarlanması — kime konuştuğumuz | Evet. Persona'ya, kanala ve sayfa tipine göre adapte olur |

Voice tek, tone çift: sanayici alıcıya dingin-kurumsal, ticaret alıcısına dinamik-atletik. İkisi de aynı sesin iki farklı ifade biçimidir.

### İçerik Versiyonu Kararı

Aynı sayfa iki persona'ya aynı anda konuşabilir (orta ton, tek versiyon) veya persona switch'e göre farklı metinler gösterebilir (persona-aware, çift versiyon). Karar sayfa tipine göre değişir:

| Sayfa Tipi | Yaklaşım | Copy Üretimi | Gerekçe |
|------------|----------|--------------|---------|
| Homepage | Persona-aware | Çift versiyon | Persona switch'in en güçlü etkisi burada |
| Pillar landing | Persona-aware | Çift versiyon | Her iki persona da her pillar'a gelebilir |
| Vaka çalışmaları | Persona-aware | Çift versiyon | Metrik vurgusu vs. hikaye formatı persona'ya göre değişir |
| Hizmet detay | Orta ton | Tek versiyon | Her persona için erişilebilir orta nokta |
| Paket detay | Orta ton | Tek versiyon | Fiyat ve kapsam nötr dilde |
| Journal | Orta ton | Tek versiyon | Yazarın sesi ön planda |
| Araçlar | Orta ton | Tek versiyon | Teşhis dili nötr-analitik |
| Danışman profil | Orta ton | Tek versiyon | Profesyonel profil dili |
| Brief / Rezervasyon | Orta ton | Tek versiyon | Form dili nötr-yönlendirici |

Persona-aware sayfalarda copy iki versiyon olarak yazılır ve `messages/{tr,en}.json` içinde persona alanıyla etiketlenir. Frontend, cookie'deki persona seçimine göre doğru versiyonu render eder.

---

## 2. İki Ton Profili — Detaylı Rehber

### 2a. Sanayici Tonu (Dingin-Kurumsal)

**Karakter özeti:** Güvenilir bir meslektaşın konuşma tonu. Bilgiyi paylaşır ama dayatmaz, iddia eder ama kanıtla destekler, kısa ve net konuşur ama aceleye getirmez. McKinsey raporunun disiplinini, iyi bir mühendislik dokümanının netliğini taşır — ama ikisinin de soğukluğunu taşımaz.

**Yazı kuralları:**

| Kural | Açıklama |
|-------|----------|
| Cümle uzunluğu | Orta (15-25 kelime ağırlıklı). Çok kısa cümleler "slogan" hissi verir, çok uzunlar güven düşürür |
| Aktif/pasif ses | Aktif ağırlıklı (%70-80). Pasif ses yalnızca kurumsal resmiyet gerektiren yerlerde |
| Veri kullanımı | Her iddia somut veriyle desteklenir. "Verimlilik artışı sağlıyoruz" değil, "üretim hattı verimini ortalama %18 artırıyoruz" |
| Sıfat oranı | Düşük. Sıfat yerine fiil ve somut isim. "Yenilikçi çözüm" değil, "6 ayda 3 fabrikada uygulanan sistem" |
| Bağlaçlar | Mantıksal: "çünkü", "ancak", "dolayısıyla". Duygusal bağlaçlardan kaçın |
| Paragraf açılışı | Her paragraf bir gözlem, bir veri veya bir soru ile açılır — sıfatla veya genellemeyle değil |

**5 Karşılaştırmalı Cümle:**

| # | Bağlam | Yanlış | Hatanın Anatomisi | Doğru |
|---|--------|--------|-------------------|-------|
| 1 | Hizmet sayfası hero | "Yapay zeka ile fabrikanızı geleceğe taşıyın!" | Hype ("geleceğe taşıyın"), soyut vaat, ünlem işareti agresif | "AI destekli süreç analizi, üretim hattındaki verim kayıplarını gerçek zamanlı tespit eder. Müşterilerimizde ortalama %12-18 maliyet düşüşü gözlemliyoruz." |
| 2 | Paket tanımı | "Dijital dönüşüm yolculuğunuzda yanınızda olacak kapsamlı bir paket" | "Yolculuk" metaforu klişe, "kapsamlı" boş sıfat, kapsam belirsiz | "8 hafta, 3 aşama: mevcut altyapı analizi, dönüşüm yol haritası, pilot uygulama. Çıktı: ölçülebilir ROI hesaplaması ve 12 aylık uygulama planı." |
| 3 | Vaka çalışması özeti | "Müşterimiz bizimle çalıştıktan sonra büyük başarılar elde etti" | "Büyük başarılar" ölçülemez, "müşterimiz" anonim, kaçırılmış kanıt fırsatı | "120 çalışanlı otomotiv yan sanayi firması, 14 ayda üretim hattı verimliliğini %22 artırdı ve enerji maliyetini yıllık 1.8M TL düşürdü." |
| 4 | CTA butonu / çevresi | "Hemen bizimle iletişime geçin ve fırsatları kaçırmayın!" | Aciliyet baskısı ("hemen", "kaçırmayın"), satışçı agresiflik, güven düşürür | "Dönüşüm planınızı 45 dakikalık bir görüşmede birlikte değerlendirelim." |
| 5 | E-posta konu satırı | "Şirketinizi dijitalleştirmek için MUHTEŞEM bir teklif!" | Büyük harf, ünlem, abartı — spam hissi, prestij kaybı | "Üretim verimliliği analizi: ilk değerlendirme için kısa bir görüşme önerisi" |

### 2b. Ticaret Tonu (Dinamik-Atletik)

**Karakter özeti:** Hızlı düşünen, veriyle konuşan bir büyüme ortağının tonu. Enerji yüksek ama kontrolsüz değil, metrik-yoğun ama soğuk değil, doğrudan ama kaba değil. Shopify'ın erişilebilirliğini, Stripe'ın teknik netliğini ve a16z'nin cesur iddialarını birleştirir — ama hiçbirinin kibrine düşmez.

**Yazı kuralları:**

| Kural | Açıklama |
|-------|----------|
| Cümle uzunluğu | Kısa-orta (8-18 kelime ağırlıklı). Ritmik. Kısa cümleler art arda gelebilir |
| Aktif/pasif ses | Neredeyse tamamen aktif (%90+). Pasif ses bu tonda enerji düşürür |
| Veri kullanımı | Metrikler cümlenin ana öznesi olur. "CAC %47 düştü" — rakam öne, açıklama arkaya |
| Sıfat oranı | Çok düşük. Sıfat yerine metrik. "Harika sonuçlar" değil, "ROAS 4.2x" |
| Bağlaçlar | Kısa ve keskin: "ama", "ve", "çünkü". Uzun bağlaçlar ritmi bozar |
| Paragraf açılışı | Bir metrik, bir soru veya bir kısa gözlemle açılır. "Bildiklerinizi unutun" tarzı klişelerden kaçın |

**5 Karşılaştırmalı Cümle:**

| # | Bağlam | Yanlış | Hatanın Anatomisi | Doğru |
|---|--------|--------|-------------------|-------|
| 1 | Hizmet sayfası hero | "Markanızı büyütmenize yardımcı olan profesyonel danışmanlık hizmetleri sunmaktayız" | Pasif yapı ("sunmaktayız"), kurumsal ağdalık, enerji sıfır, "yardımcı olan" belirsiz | "Reklam bütçen aynı, dönüşüm oranın 2x. CRO + marka mimarisi birlikte çalışınca büyüme sistemik olur." |
| 2 | Paket tanımı | "E-ticaret markanız için özel olarak tasarlanmış kapsamlı bir büyüme çözümü" | "Özel olarak tasarlanmış" boş, "kapsamlı çözüm" klişe, somutluk yok | "4 hafta, sabit fiyat. Mevcut dönüşüm hunini analiz ediyoruz, 3 kritik kaldıracı tespit ediyoruz, ilk iyileştirmeleri canlıya alıyoruz. Ortalama etki: %30-50 dönüşüm artışı." |
| 3 | Vaka çalışması özeti | "Müşterimizin satışlarını önemli ölçüde artırmayı başardık" | "Önemli ölçüde" ölçülemez, "başardık" bize odaklı müşteriye değil, rakam yok | "D2C kozmetik markası, 90 günde CAC'ı %47 düşürdü, ROAS'ı 1.8x'den 4.2x'e çıkardı. Kaldıraç: landing page yeniden tasarımı + audience segmentasyonu." |
| 4 | CTA butonu / çevresi | "Detaylı bilgi almak için lütfen formumuzu doldurunuz" | Pasif, mesafeli, "lütfen" + "doldurunuz" kurumsal bariyer, enerji düşük | "Büyüme planını 30 dakikada birlikte çıkaralım." |
| 5 | E-posta konu satırı | "E-ticaret markanız için eşsiz fırsatlar sizi bekliyor!" | "Eşsiz" boş sıfat, "sizi bekliyor" klişe, ünlem spam hissi | "CAC yükseliyor mu? 3 kaldıraçla düşürmenin yol haritası" |

### 2c. Orta Ton (Statik Sayfalar İçin)

**Karakter özeti:** İki tonun kesişim noktası. Ne dingin tonun formalitesini ne dinamik tonun hızını tam taşır — ikisinin dengesini kurar. Hizmet detay, paket, journal, araç ve danışman sayfalarında kullanılır. Her iki persona'nın da "bu bana konuşuyor" hissetmesini sağlar.

**Kuralları:**

| Kural | Açıklama |
|-------|----------|
| Cümle uzunluğu | Orta (12-22 kelime). Ne sanayici tonunun resmi uzunluğu ne ticaret tonunun kısa ritmi |
| Aktif/pasif ses | Aktif ağırlıklı (%80). Sanayici tonundan daha aktif, ticaret tonundan daha esnek |
| Veri kullanımı | Veri destekli ama metrik cümlenin öznesi olmaz. "Bu paket ortalama %30 dönüşüm artışı sağlar" — veri var ama başlık değil |
| Hitap | "Siz" yerine dolaylı hitap tercih edilir. "Markanız için" değil, "Markalar için" veya "Bu pakette" |
| Enerji seviyesi | Orta. Ne uyuşuk ne heyecanlı — bilgilendirici, yardımcı |

**3 Karşılaştırmalı Cümle:**

| # | Bağlam | Yanlış (çok formal) | Yanlış (çok dinamik) | Doğru (orta ton) |
|---|--------|----------------------|----------------------|-------------------|
| 1 | Hizmet detay açılışı | "İşletme mühendisliği hizmetimiz, kurumsal süreçlerinizin sistematik olarak değerlendirilmesini sağlamaktadır" | "Süreçlerin yavaş mı? Biz hızlandırıyoruz. Nokta." | "İşletme mühendisliği, mevcut süreçlerdeki darboğazları tespit eder ve ölçülebilir iyileştirmeler tasarlar." |
| 2 | Journal yazı giriş | "Bu makalede, dijital dönüşüm konusundaki en güncel gelişmeleri sizlerle paylaşacağız" | "Dijital dönüşüm hakkında bilmen gereken 5 şey — hemen oku" | "Türk sanayisinde dijital dönüşüm projeleri 2025'te %34 arttı. Bu yazıda başarılı projelerin ortak kaldıraçlarını inceliyoruz." |
| 3 | Araç sonuç sayfası | "Değerlendirme sonuçlarınız aşağıda yer almaktadır" | "Sonuçların hazır! Hemen bak." | "Değerlendirme tamamlandı. Aşağıda skorunuz, sektör kıyaslaması ve önerilen ilk adımlar yer alıyor." |

---

## 3. Ton Matrisi: Sayfa Tipi x Persona x İçerik Versiyonu

| Sayfa Tipi | Versiyon | Persona 1A (Sanayici CEO) | Persona 1B (Sanayi Yöneticisi) | Persona 2 (Ticaret/Perakende) | Persona 3 (Scale-up) | Notlar |
|------------|----------|---------------------------|-------------------------------|-------------------------------|----------------------|--------|
| Homepage hero | Persona-aware | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik | Persona switch sonrası |
| Homepage section'ları | Persona-aware | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik | Referanslar, testimonial, vakalar adapte |
| Pillar landing (Growth) | Persona-aware | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik | Aynı pillar, farklı ton |
| Pillar landing (Transform) | Persona-aware | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik | |
| Pillar landing (Build) | Persona-aware | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik | |
| Vaka listeleme | Persona-aware | Dingin — hikaye formatı | Dingin — metrik formatı | Dinamik — metrik formatı | Dinamik — metrik formatı | Sunum biçimi değişir |
| Vaka detay | Persona-aware | Anlatı ağırlıklı, sonunda metrik | Metrik ağırlıklı, ROI vurgusu | Metrik ağırlıklı, hız vurgusu | Kompakt, kaldıraç odaklı | |
| Hizmet detay | Orta ton | Orta-formel | Orta-formel | Orta-formel | Orta-formel | Tek versiyon |
| Paket listeleme | Orta ton | Orta-formel | Orta-formel | Orta-formel | Orta-formel | Tek versiyon |
| Paket detay | Orta ton | Orta-formel | Orta-formel | Orta-formel | Orta-formel | Tek versiyon |
| Journal | Orta ton | Orta-editorial | Orta-editorial | Orta-editorial | Orta-editorial | Yazarın sesi katkıda bulunur |
| Araçlar | Orta ton | Orta-analitik | Orta-analitik | Orta-analitik | Orta-analitik | Teşhis dili nötr |
| Danışman profil | Orta ton | Orta-profesyonel | Orta-profesyonel | Orta-profesyonel | Orta-profesyonel | Tek versiyon |
| Brief / Rezervasyon | Orta ton | Orta-yönlendirici | Orta-yönlendirici | Orta-yönlendirici | Orta-yönlendirici | Form dili |
| Hakkımızda | Orta ton | Orta-editorial | Orta-editorial | Orta-editorial | Orta-editorial | Manifesto tonu |

**Kural:** Persona-aware sayfalarda persona 1A ve 1B her zaman aynı tonu alır (dingin-kurumsal). Persona 2 ve 3 her zaman aynı tonu alır (dinamik-atletik). Orta ton sayfalarda persona ayrımı yapılmaz.

---

## 4A. Editorial Dil Mekaniği

Bu bölüm INDOLES'in editorial-minimalist dilinin teknik kurallarını tanımlar. Kurallar her üç ton için geçerlidir (ton profilleri ağırlığı ayarlar, mekanik sabit kalır).

### Cümle Ritmi

Kısa-uzun-kısa dengeli örüntü. Monoton cümle uzunluğu okuyucuyu kaybettirir. Kısa cümle dikkat çeker, uzun cümle derinlik verir, kısa cümle noktayı koyar.

| Yanlış | Doğru |
|--------|-------|
| "AI ile üretim hatlarını optimize ediyoruz. AI ile maliyet düşürüyoruz. AI ile verimlilik artırıyoruz." (monoton kısa) | "AI üretim hatlarını dönüştürüyor. Ama dönüşüm sadece teknoloji kurmak değil — mevcut süreçleri anlamak, darboğazları tespit etmek ve doğru noktaya doğru teknolojiyi yerleştirmek. Fark burada." |
| "Şirketlerin dijital dönüşüm süreçlerinde karşılaştıkları en büyük zorluklardan biri de doğru teknoloji ortağını bulmak ve bu ortakla uzun vadeli ve sürdürülebilir bir iş birliği kurmaktır." (monoton uzun) | "Doğru teknoloji ortağını bulmak zor. Daha da zoru: bulduğunuzda uzun vadeli çalışabilmek. INDOLES bu yüzden rapor teslim edip çekilmiyor." |

### Paragraf Açılış Cümleleri

İlk cümle okuyucuyu tutar veya kaybeder. Açılış cümlesi bir gözlem, bir veri veya bir soru olmalı — genelleme veya sıfat yığını olmamalı.

| Yanlış açılış | Doğru açılış |
|---------------|--------------|
| "Günümüzde şirketler giderek artan bir şekilde dijital dönüşüme yatırım yapmaktadır." | "Türk sanayisinde dijital dönüşüm bütçeleri 2025'te %34 arttı — ama projelerin yarısı ilk 6 ayda durdu." |
| "INDOLES olarak müşterilerimize en kaliteli hizmeti sunmaktayız." | "120 çalışanlı bir otomotiv firması, 14 ayda enerji maliyetini 1.8M TL düşürdü. Süreç şöyle başladı." |

### Sıfat-Fiil Oranı

Editorial dil sıfat-hafif, fiil-ağırdır. Sıfatlar iddia eder; fiiller kanıtlar. INDOLES'in sesi kanıt-odaklıdır.

| Sıfat-ağır (yanlış) | Fiil-ağır (doğru) |
|----------------------|-------------------|
| "Yenilikçi ve kapsamlı dijital dönüşüm çözümlerimiz" | "Süreçleri analiz ediyoruz, darboğazları tespit ediyoruz, teknolojiyi kuruyoruz" |
| "Eşsiz ve benzersiz marka stratejisi yaklaşımımız" | "Markanın konumunu veriye dayalı olarak tanımlıyor, satış motoruna dönüştürüyoruz" |

### Aktif vs. Pasif Ses

Aktif ses varsayılan. Pasif ses yalnızca iki durumda:
1. Kurumsal/yasal bağlam ("Kişisel veriler KVKK kapsamında işlenmektedir")
2. Özne kasıtlı olarak gizlendiğinde ("Bu karar henüz verilmedi" — kim vereceği önemsiz)

| Pasif (yanlış) | Aktif (doğru) |
|----------------|---------------|
| "Analiz tarafımızca gerçekleştirilmektedir" | "Analizi biz yapıyoruz" |
| "Sonuçlar raporlanacaktır" | "Sonuçları raporluyoruz" |

### Liste vs. Prose Kararı

Editorial dil listeyi sık kullanmaz — liste bilgiyi düzleştirir, hiyerarşiyi kaybettirir. Liste yalnızca şu durumlarda:
- Teknik spesifikasyon (paket kapsamı, deliverable listesi)
- Karşılaştırmalı tablo (özellik matrisi, fiyat karşılaştırma)
- Adım adım süreç (3+ adımlı iş akışı)

Diğer durumlarda prose tercih edilir. "3 nedenimiz var" yerine, nedenleri bir paragrafta mantıksal akışla anlat.

### Başlık Hiyerarşisinin Anlamsal İşlevi

Başlıklar sadece boyut değil, anlam taşır:
- **H1:** Sayfanın tek vaadi (bir sayfada bir tane)
- **H2:** Vaadin alt-boyutları (sayfanın ana bölümleri)
- **H3:** Alt-boyutların detayları

Başlık kuralları:
- Fiil içermeli veya somut isim içermeli ("Hizmetlerimiz" değil, "12 Hizmet, 3 Pillar")
- Soru formatı kullanılabilir ("Neden şimdi?" — timing argümanı için doğal başlık)
- Sıfat-başlangıçlı başlıklardan kaçın ("Kapsamlı Dijital Dönüşüm" değil, "Dijital Dönüşüm: Analiz'den Uygulamaya")

### Mikro-İroni ve Zekice Gözlem

Editorial dili "kurumsal brosür"den ayıran ince dokunuş. INDOLES'in sesi ciddi ama sıkıcı değil — zaman zaman keskin bir gözlem veya nazik bir ironi okuyucuya "bu marka düşünüyor" hissi verir.

Kurallar:
- İroni asla müşteriye veya müşterinin sorununa yönelik değildir
- İroni sektörel klişelere, genel geçer kabullere veya INDOLES'in kendi pozisyonuna yönelik olabilir
- Dozaj: bir sayfada en fazla 1-2 nokta. Fazlası "şımarık" hissi verir

| Uygun ironi | Uygunsuz ironi |
|-------------|----------------|
| "Danışmanlık sektöründe 'stratejik rapor' genellikle 'rafa kaldırılacak PDF' anlamına gelir. Biz bu geleneği bozmak için buradayız." | "Fabrikanız hala Excel ile mi yönetiliyor? Ciddi olamaz." |
| "'Dijital dönüşüm' kelimesi o kadar çok kullanıldı ki anlamını kaybetti. Biz bu yüzden 'iş inşası' diyoruz — dönüşüm soyut, inşa somut." | "Rakipleriniz çoktan dönüştü, siz hala bekliyorsunuz." |

---

## 4B. Ortak Değer Kuralları

Bu kurallar her üç ton için geçerlidir (sanayici, ticaret, orta).

### Eğitici Yaklaşım

Her INDOLES içeriği okuyucuya bir şey öğretmelidir. "Bizi arayın" yerine, okuyucuya kendi başına uygulayabileceği bir bilgi ver, sonra "daha fazlası için birlikte çalışalım" de. Bu yaklaşım güven inşa eder ve INDOLES'i "satıcı" değil "uzman" konumuna taşır.

Uygulama kuralları:
- Blog yazıları en az bir uygulanabilir tavsiye içermeli
- Hizmet sayfaları "nasıl çalışırız" bölümünde süreç şeffaflığı vermeli
- Vaka çalışmaları "bunu biz yaptık" yerine "bu böyle yapılır" tonunda yazılmalı
- Araç sonuçları sadece skor değil, yorumlama rehberi de vermeli

### Güven İnşa Eden Dil Kalıpları

| Kalıp | Örnek | Neden İşler |
|-------|-------|-------------|
| Somut rakam | "14 ayda %22 verimlilik artışı" | Ölçülebilir, doğrulanabilir |
| Metodoloji şeffaflığı | "3 aşamada ilerliyoruz: analiz, strateji, uygulama" | Süreç görünür, belirsizlik azalır |
| Dürüst sınır çizme | "Bu paket mevcut altyapınızı değiştirmez; mevcut sisteminizi optimize eder" | "Her şeyi yaparız" demek güven düşürür |
| Referans verisi | "120 çalışanlı otomotiv yan sanayi firması" | Benzer profilde müşteri = empati |
| Koşullu vaat | "Mevcut dönüşüm oranınıza bağlı olarak %30-50 iyileşme beklenir" | Aralık vermek, "garantili" demekten daha güvenilir |

### Sayısal Veri Sunumu

| Kural | Doğru | Yanlış |
|-------|-------|--------|
| Aralık ver, tekil rakam verme (tahminlerde) | "%12-18 maliyet düşüşü" | "%15 maliyet düşüşü" (kesinlik yanılsaması) |
| Bağlam ver | "CAC %47 düştü (3 ay, 50K TL bütçe)" | "CAC %47 düştü" (bütçe ve süre belirsiz) |
| Büyük sayıları okunabilir yap | "1.8M TL" veya "1.8 milyon TL" | "1800000 TL" |
| Yüzde ve mutlak sayıyı birlikte ver | "%22 verimlilik artışı (yıllık 3.2M TL tasarruf)" | Sadece "%22" (etki belirsiz) |
| Karşılaştırma çerçevesi kur | "ROAS 1.8x'den 4.2x'e çıktı" | "ROAS 4.2x" (başlangıç noktası belirsiz) |

### CTA Yazım Prensipleri

| Seviye | Format | Ton | Örnek (Sanayici) | Örnek (Ticaret) |
|--------|--------|-----|-------------------|-----------------|
| Birincil CTA | Fiil + somut çıktı | Doğrudan, net | "Dönüşüm Planını Değerlendirelim" | "Büyüme Planını Çıkaralım" |
| İkincil CTA | Fiil + düşük taahhüt | Davetkar | "Basit Brief Gönderin" | "Hızlı Brief Gönderin" |
| Tersiyer CTA | Bilgi talebi | Düşük baskı | "Detayları İnceleyin" | "Detayları İnceleyin" |

CTA'larda kaçınılacaklar:
- "Hemen" — aciliyet baskısı
- "Ücretsiz" — değer algısını düşürür (bu prestij markası)
- "Kaçırmayın" — korku satışı
- Ünlem işareti — agresiflik

---

## 5. Kelime ve İfade Rehberi

### 5a. Tercih Edilen Kelimeler/İfadeler

| Durum | Kullan | Kullanma |
|-------|--------|----------|
| Hizmet tanımı | "İnşa ediyoruz", "kuruyoruz", "tasarlıyoruz" | "Sunuyoruz", "sağlıyoruz", "hizmet veriyoruz" |
| Müşteri ilişkisi | "Birlikte çalışıyoruz", "iş ortağı" | "Müşterilerimize hizmet veriyoruz" |
| Sonuç anlatımı | "Ölçtük", "gözlemledik", "kaydettik" | "Başardık", "elde ettik" |
| Problem tanımı | "Darboğaz", "asimetri", "verim kaybı" | "Sorun", "problem", "zorluk" (çok genel) |
| Süreç anlatımı | "Analiz → strateji → uygulama" | "Kapsamlı hizmet", "uçtan uca çözüm" |
| Değer ifadesi | "Ölçülebilir", "somut", "kanıtlanmış" | "Eşsiz", "benzersiz", "en iyi" |

### 5b. Kaçınılacak Kelimeler

| Kelime/İfade | Karar | Gerekçe |
|--------------|-------|---------|
| İnovasyon | Kaçın | Anlam kaybetmiş, her şirketten duyuluyor |
| Sinerji | Kaçın | Kurumsal jargonun en aşınmış kelimesi |
| Vizyoner | Kaçın | Kendini "vizyoner" ilan etmek prestij değil kibir |
| Lider / sektör lideri | Kaçın | Kanıtlanamayan boş sıfat |
| Devrim / devrimci | Kaçın | Hype, inandırıcılık düşürür |
| Eşsiz / benzersiz | Kaçın | Her marka söylüyor, anlam taşımıyor |
| Dijitalleşme | Dikkatli kullan | Tek başına banal; somut tanımla kullanılabilir ("üretim hattı dijitalleşmesi: sensör entegrasyonu + veri toplama") |
| Çözüm ortağı | Kaçın | Türk kurumsal iletişiminin en klişe ifadesi |
| Müşteri memnuniyeti | Kaçın | Ölçülemez, boş — yerine somut metrik |
| 360 derece | Kaçın | Anlamsız yuvarlak ifade |
| Uçtan uca | Dikkatli kullan | Somut kapsamla OK ("fabrikadan ERP'ye"), soyut kalırsa kaçın |
| Dünya standartlarında | Kaçın | Kanıtlanamaz |
| Entegre | Dikkatli kullan | Teknik bağlamda OK ("Clerk entegrasyonu"), pazarlama bağlamında kaçın |
| Proaktif | Kaçın | Kurumsal jargon |
| Katma değer | Kaçın | Spesifiklik yok |

### 5c. Anglicizm Kuralları

CLAUDE.md'deki kural: "Türkçe metinlerde gereksiz anglicizm kullanılmaz; yalnızca teknik terimler İngilizce kalır."

**İngilizce kalan terimler** (endüstri standardı, Türkçe karşılığı oturmamış):

| Terim | Gerekçe |
|-------|---------|
| ROI, ROAS, CAC, LTV, CRO | Metrik kısaltmaları |
| AI, ERP, CRM, SaaS | Teknoloji kısaltmaları |
| Sprint, MVP, POC | Proje yönetim terimleri |
| Funnel, pipeline | Satış/pazarlama terimleri |
| Retainer | Türkçe karşılığı yok |
| Landing page | Türkçe karşılığı kullanılmıyor |
| Breadcrumb, slug, widget | Teknik terimler |

**Türkçeleştirilen terimler:**

| İngilizce | Türkçe Karşılığı | Not |
|-----------|-------------------|-----|
| Dashboard | Gösterge paneli | Persona 1A için kritik |
| Campaign | Kampanya | Yerleşmiş Türkçe |
| Case study | Vaka çalışması | Yerleşmiş Türkçe |
| Feedback | Geri bildirim | Yerleşmiş Türkçe |
| Meeting | Görüşme | Yerleşmiş Türkçe |
| Deadline | Son tarih / teslim tarihi | Yerleşmiş Türkçe |
| Insight | İçgörü / bulgu | Yerleşmiş Türkçe |
| Benchmark | Kıyaslama | Yerleşmiş Türkçe |
| Workflow | İş akışı | Yerleşmiş Türkçe |
| Stakeholder | Paydaş | Yerleşmiş Türkçe |
| Scope | Kapsam | Yerleşmiş Türkçe |
| Deliverable | Çıktı / teslimat | Yerleşmiş Türkçe |
| Onboarding | Başlangıç süreci | Türkçe daha net |
| Scalability | Ölçeklenebilirlik | Yerleşmiş Türkçe |

**Persona-bağımlı istisnalar:**
- Persona 1A (geleneksel sanayici) metinlerinde anglicizm minimumda — "ROI" bile gerekirse parantez içinde "yatırım getirisi (ROI)" açıklamasıyla
- Persona 2 ve 3 metinlerinde sektör terimleri doğal akışta İngilizce kalabilir (CAC, ROAS, LTV çevrilmez)

### 5d. Sektörel Jargon Politikası

| Persona | Jargon Seviyesi | Kural |
|---------|-----------------|-------|
| 1A (Sanayici CEO) | Düşük | Teknik terimleri ilk kullanımda açıkla. "ERP (kurumsal kaynak planlama)" formatında |
| 1B (Sanayi Yöneticisi) | Orta | Kurumsal dönüşüm terminolojisi doğal kullanılabilir, AI/otomasyon terimleri kısa açıklamayla |
| 2 (Ticaret/Perakende) | Yüksek | Performans pazarlama ve e-ticaret terimleri açıklamasız kullanılabilir |
| 3 (Scale-up) | Yüksek | Startup/teknoloji ekosistemi terimleri doğal |
| Orta ton sayfaları | Orta-düşük | Jargon ilk kullanımda açıklanır veya kaçınılır |

---

## 6. Kanal Bazlı Ton Uyarlamaları

### 6a. Web Site Copy

Birincil kanal. Tüm kurallar bu kanal için yazılmıştır. Ton matrisi (Bölüm 3) doğrudan uygulanır.

Ek kurallar:
- Sayfa başlıkları (H1) 8 kelimeyi geçmez
- Meta description 155 karakter, bir değer vaadi + bir CTA içerir
- Alt text görsel tanımlar, SEO keyword stuffing değil

### 6b. E-posta

| E-posta Tipi | Ton | Özel Kural |
|--------------|-----|------------|
| Transactional (brief onayı, rezervasyon hatırlatma) | Orta-nötr | Kısa, net, aksiyonel. Marka sesi hafif |
| Brief yanıtı (kişiselleştirilmiş) | Persona-aware | Persona profiline göre sanayici veya ticaret tonu |
| Marketing (journal bülteni) | Orta-editorial | Eğitici açılış + değer + CTA. Satış tonu yok |
| Takip e-postası (görüşme sonrası) | Persona-aware | Görüşmede kullanılan tonun devamı |

Tüm e-postalarda:
- Konu satırı 60 karakter, ünlem yok, büyük harf yok
- İlk cümle değer verir (selamlama sonrası hemen konuya gir)
- "Saygılarımla" yerine "İyi çalışmalar" veya doğrudan kapanış

### 6c. Sosyal Medya

| Platform | Ton | Format |
|----------|-----|--------|
| LinkedIn | Orta-editorial, biraz daha kişisel | Kısa gözlem + veri + içgörü. Emojisiz. Hashtag sınırlı (2-3) |
| Twitter/X | Dinamik-atletik, kısa | Tek metrik veya tek gözlem. Thread formatında derinleşme. Emojisiz |

Sosyal medyada kaçınılacaklar:
- "Gurur duyuyoruz" tarzı self-congratulation
- Motivasyonel alıntılar
- Stok fotoğraf paylaşımı
- Hashtag spam

### 6d. AI Chatbot Ses ve Ton Rehberi (INDOLES Danışman)

**Kimlik:** Chatbot'un adı "INDOLES Danışman"dır. İlk mesajda bu isimle tanıtılır. İnsan gibi davranmaz, ama soğuk da değil — bilgili, yardımcı ve INDOLES'in sesini taşıyan bir dijital danışman.

**İlk karşılama:** Persona henüz belirsiz olduğu için orta ton kullanılır:
> "Merhaba, ben INDOLES Danışman. Size nasıl yardımcı olabilirim? Hizmetlerimiz, paketlerimiz veya mevcut bir projeniz hakkında konuşabiliriz."

**Persona tespit sonrası ton kalibrasyonu:**
- Kullanıcının soruları sanayiye yönelikse → dingin-kurumsal tona geç
- Kullanıcının soruları ticarete yönelikse → dinamik-atletik tona geç
- Belirsiz kalırsa → orta tonda devam et

**Belirsiz/muğlak sorulara yanıt:**
> "Sorunuzu daha iyi anlayabilmem için birkaç detay paylaşır mısınız? Örneğin, hangi sektörde faaliyet gösteriyorsunuz ve en çok hangi konuda destek arıyorsunuz?"

Netleştirme sorusu sorarken:
- Patronize etme
- Birden fazla soru sorma (bir seferde bir soru)
- "Anlayamadım" yerine "Daha iyi yardımcı olabilmem için" formatı

**Bilmediği konularda davranış:**
> "Bu konuda size doğru bilgi verebileceğimden emin değilim. Bir uzmanımızla görüşmenizi önerebilirim — isterseniz hemen bir görüşme ayarlayabilirim."

Asla uydurma bilgi verme. Emin olmadığında rezervasyon veya brief'e yönlendir.

**Kaba/saldırgan kullanıcıya tepki:**
> "Yardımcı olmaya devam etmek istiyorum. Size nasıl destek olabileceğimi anlamak için lütfen sorunuzu paylaşın."

Karşılık verme, tartışma, özür dileme. Nötr-profesyonel tonla devam et. Üçüncü tekrarda:
> "Görünüşe göre doğrudan bir uzmanımızla konuşmanız daha faydalı olabilir. Dilerseniz bir görüşme ayarlayabilirim."

**Brief toplama sırasında ses:**
- Yönlendirici ama sabırlı
- Her adımda neden sorulduğunu kısaca açıkla
- "Bu bilgi, size en uygun paketi veya uzmanı önermemize yardımcı olacak"
- Zorunlu alanları belirt, opsiyonelleri "isterseniz" ile sun

**Rezervasyon onayı:**
> "[Danışman adı] ile [tarih, saat] için görüşmeniz oluşturuldu. Takvim davetiniz e-posta adresinize gönderilecek. Görüşme öncesinde hazırlanmanız için birkaç öneri: [kısa liste]."

**Hata senaryoları:**
> "Şu an takvimde uygun slot bulamıyorum. Alternatif bir tarih önerebilirim veya farklı bir uzmanla eşleştirebilirim."

**Session kapanışı:**
> "Başka bir sorunuz olursa buradayım. İyi çalışmalar."

Kısa, net, editorial tondan düşmüyor. "Görüşmek üzere!" veya "İyi günler dilerim!" gibi klişelerden kaçın.

**Not:** Tool tanımları, akış diyagramları ve teknik fallback senaryoları `docs/07-ai-agent-spec.md`'de tanımlanır. Bu bölüm yalnızca ses ve ton rehberidir.

### 6e. Mikro-copy Rehberi

#### Buton Metinleri

| Seviye | Pattern | Örnek |
|--------|---------|-------|
| Birincil CTA | [Fiil] + [Somut çıktı] | "Görüşme Rezerve Et", "Brief Gönder" |
| İkincil CTA | [Fiil] + [Düşük taahhüt] | "Detayları İncele", "Paketi Keşfet" |
| Tersiyer CTA | [Fiil] | "Devam Et", "Geç", "Kapat" |

Kaçınılacaklar: "Hemen", "Ücretsiz", "Kaçırmayın", ünlem işareti.

#### Form Label'ları

| Tercih edilen | Kaçınılacak |
|---------------|-------------|
| "Adınız" | "Adınızı giriniz" (gereksiz tekrar) |
| "E-posta adresi" | "Lütfen e-posta adresinizi yazınız" (aşırı resmi) |
| "Şirket (opsiyonel)" | "Şirket adını buraya yazabilirsiniz" (uzun) |

Required alanlar yıldız (*) ile işaretlenir, "zorunlu alan" yazılmaz. Opsiyonel alanlar "(opsiyonel)" ile işaretlenir.

#### Error Mesajları

| Senaryo | Yanlış | Doğru |
|---------|--------|-------|
| Geçersiz e-posta | "Hata! Geçersiz e-posta adresi." | "E-posta adresi formatı doğru görünmüyor. Örnek: ad@sirket.com" |
| Boş zorunlu alan | "Bu alan zorunludur!" | "Bu alanı doldurmamız gerekiyor" |
| Sunucu hatası | "Bir hata oluştu." | "Bir şeyler ters gitti. Lütfen tekrar deneyin, sorun devam ederse bize ulaşın." |

Kurallar: empatik, çözüm odaklı, "hata" kelimesi yalnızca teknik bağlamda, ünlem yok.

#### Loading State'leri

| Bağlam | Yanlış | Doğru |
|--------|--------|-------|
| Genel | "Yükleniyor..." | "İçerik hazırlanıyor" |
| Brief gönderimi | "Gönderiliyor..." | "Brief'inizi kaydediyoruz" |
| Araç sonucu | "Hesaplanıyor..." | "Sonuçlarınızı derliyoruz" |
| Takvim yükleme | "Yükleniyor..." | "Müsait saatleri kontrol ediyoruz" |

#### Empty State'ler

| Bağlam | Yanlış | Doğru |
|--------|--------|-------|
| Filtrelenmiş sonuç yok | "Sonuç bulunamadı." | "Bu kriterlere uygun sonuç yok. Filtreleri genişletmeyi deneyin veya tüm vakaları görüntüleyin." |
| Brief geçmişi boş | "Henüz brief yok." | "Henüz bir brief göndermediniz. İlk brief'inizi göndererek başlayabilirsiniz." |
| Arama sonucu boş | "Sonuç yok." | "'[arama terimi]' ile eşleşen sonuç bulamadık. Farklı bir terim deneyin veya INDOLES Danışman'a sorun." |

#### Toast Bildirimleri

| Tip | Ton | Örnek |
|-----|-----|-------|
| Başarı | Olumlu, kısa | "Brief başarıyla gönderildi" |
| Uyarı | Bilgilendirici | "Takvim güncellemesi bekleniyor" |
| Bilgi | Nötr | "Profiliniz güncellendi" |
| Hata | Empatik, çözüm odaklı | "Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin." |

#### Tooltip'ler

Kısa (1-2 cümle), yardımcı, patronize etmeyen. Örnek:
- "Bu skor, sektörünüzdeki benzer şirketlerle kıyaslanarak hesaplanır."
- "Saatlik ücret, görüşme süresi bazında faturalandırılır."

#### Onay Diyalogları

Destructive action'lar (brief silme, hesap kapatma) için tonal dikkat:

| Yanlış | Doğru |
|--------|-------|
| "Silmek istediğinizden emin misiniz?" | "Bu brief'i silmek istiyorsanız 'Sil' butonuna tıklayın. Bu işlem geri alınamaz." |
| "Hesabınızı kapatmak üzeresiniz!" | "Hesabınızı kapatmak, tüm brief ve rezervasyon geçmişinizi silecektir. Devam etmek istiyor musunuz?" |

### 6f. Proposal/Teklif Dokümanları

| Bölüm | Ton | Kural |
|-------|-----|-------|
| Kapak sayfası | Orta, prestijli | Positioning statement + müşteri adı + tarih |
| Sorun analizi | Persona-aware | Müşterinin kendi dilinde, veriyle destekli |
| Önerilen yaklaşım | Orta-formel | Metodoloji şeffaflığı, adım adım |
| Fiyat ve kapsam | Nötr | Net, tablo formatında, gizli maliyet yok |
| Kapanış | Persona-aware | CTA: "Birlikte başlayalım" tonu |

---

## 7. i18n ve Çeviri Prensipleri

### TR → EN Çeviride Ton Korunması

| Kural | Açıklama |
|-------|----------|
| Ton önce, kelime sonra | Çeviri önce tonu yakalar, sonra kelimeleri seçer. Literal çeviri tonu öldürür |
| Cümle yapısı adapte olur | Türkçe'nin cümle sonu fiil yapısı İngilizce'ye taşınmaz. İngilizce doğal söz diziminde yazılır |
| Metrik formatı | Türkçe: "%18" / İngilizce: "18%" — noktalama farkları korunur |
| Hitap | Türkçe "siz" → İngilizce "you" (informal). Formal "you" kullanma |
| CTA | Anlam çevrilir, kelime çevrilmez. "Görüşme Rezerve Et" → "Book a Meeting" ("Reserve a Meeting" değil) |

### EN'de Farklılaşan Kelime Seçimleri

| TR | EN | Not |
|----|-----|-----|
| İş inşası | Business building | Üst-kavram, birebir çeviri uygun |
| Vaka çalışması | Case study | Standart karşılık |
| Gösterge paneli | Dashboard | EN'de "dashboard" standart |
| İş zekası | Business intelligence | Standart karşılık |
| Görüşme | Meeting / consultation | Bağlama göre |

### Çeviri Kalite Kontrol Checklist'i

Bir sayfa EN'ye çevrildiğinde kontrol edilecekler:

- Ton korunmuş mu? (sanayici tonu EN'de de dingin-kurumsal, ticaret tonu EN'de de dinamik-atletik)
- Metrikler doğru formatlanmış mı? (%, para birimi, tarih formatı)
- CTA'lar doğal İngilizce'de mi? ("Reserve" yerine "Book" vb.)
- Türkçe'ye özgü kültürel referanslar adapte edilmiş mi?
- SEO meta bilgileri EN için ayrıca yazılmış mı? (çeviri değil, yeniden yazım)
- Sektörel terimler EN endüstri standardına uygun mu?

---

## 8. Açık Sorular

- **Persona switch teknik implementasyonu:** Persona-aware sayfalarda çift copy `messages/{tr,en}.json` içinde nasıl yapılandırılacak?
- **Journal yazarları:** İç ekip mi yazacak, dış katkıcı da olacak mı? Dış katkıcının sesi brand voice'a nasıl uyumlanacak?
- **Video içerik tonu:** Homepage'deki video section için ses tonu rehberi bu dokümanın kapsamında mı, yoksa ayrı bir brief mi gerekiyor?
- **Chatbot kişilik derinliği:** "INDOLES Danışman" zamanla öğrenen/hatırlayan bir kişilik mi geliştirecek, yoksa her session sıfırdan mı başlayacak? (teknik karar `07-ai-agent-spec.md`'de)
- **Sosyal medya sıklığı ve içerik planı:** Ton rehberi verildi, ama yayın takvimi ve içerik miksi ayrı bir planlama gerektirir
