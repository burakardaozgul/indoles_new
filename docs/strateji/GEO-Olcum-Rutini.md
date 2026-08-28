# GEO Ölçüm Rutini

> **Statü:** İlk sürüm — G-10 bulgusunu kapatmak için hazırlandı, Burak onayına açık
> **Tarih:** 2026-08-28
> **Otoriteler:** `INDOLES-Organik-Strateji-SEO-GEO-v1.md` §5 (v1.8, "Ölçüm" satırı) · `Keyword-Onceliklendirme-2026-08-27.md` §4 (Alarm eşikleri, Rutin) ve §5 (K-7) · `Rakip-Analizi-P0-SERP.md` §4 · `src/lib/content/articles.ts` — "GEO çalışması nasıl ölçülür?" bölümü (`geo-nasil-olculur` id'li H2, yazı: `yapay-zeka-aramalarinda-nasil-one-cikarsiniz`)
> **Kapsam:** Bu doküman, sitede zaten yayımlanmış GEO (Generative Engine Optimization — üretken motor optimizasyonu) ölçüm metodunun iç yürütme rutinini tanımlar. Yöntemi **değiştirmez**, işletilebilir hâle getirir — sitenin okuyucuya anlattığı ile INDOLES'in kendi içinde yaptığı birebir aynı olmak zorundadır.

---

## 1. Amaç ve Bağlam

Denetim bulgusu G-10: GEO ölçüm rutini sitede **tanımlı** — kanonik GEO rehberi, yöntemi ayrıntılı biçimde açıklıyor ve iki SSS maddesinde ("Yapay zeka motorlarındaki görünürlüğüm nasıl ölçülür?") tekrar ediyor — ama şirket içinde hiç **kurulmamış**: ilk tur hiç atılmadı, hiçbir kayıt tutulmadı. Bu doküman o boşluğu kapatır.

Doğrudan bağ: `Keyword-Onceliklendirme-2026-08-27.md` §4'ün **A-5 alarmı** ("Ay 2, 10 promptun 0'ında geçmiyoruz → GEO kümesi yeniden yapılandırılır") yalnız bu rutin çalıştırıldığında ölçülebilir. GEO-editoryal küme bugün 2.700 arama/ay hacmi tek bir makalede taşıyor (U-2 bulgusu) — bu kümenin genişletilip genişletilmeyeceği kararı, doğrudan aşağıdaki turların verisine dayanacak.

---

## 2. 10 Sabit Prompt

Kaynak metodun (`geo-nasil-olculur`) birebir uygulaması: *"Promptlar bir kez yazılır ve değişmez; değişirse seri kırılır ve elinizde kıyaslayacak bir şey kalmaz."* Aşağıdaki 10 prompt ilk turdan itibaren **sabittir**. Değişiklik ihtiyacı doğarsa yeni bir seri başlatılır (bkz. §6) — eskisinin üzerine yazılmaz.

**Kural (site metniyle birebir):** Marka adı ("INDOLES") hiçbir promptta geçmez — *"Marka adını prompta koymuyoruz: koyarsanız model markayı zaten önünüze getirir, ölçtüğünüz şey kendi sorunuz olur."* Promptlar Türkçe, gerçek bir müşterinin yazacağı doğal cümlelerdir.

### 2.1 Kategori soruları (4)

| # | Prompt | İlgili küme |
|---|---|---|
| K1 | Türkiye'de yapay zeka danışmanlığı veren firmalar hangileri? | P0 — AI Dönüşüm |
| K2 | Türkiye'de dönüşüm oranı optimizasyonu (CRO) hizmeti veren ajanslar hangileri? | P0 — CRO |
| K3 | Türkiye'de e-ticaret danışmanlığı veren firmalar hangileri, kimi önerirsin? | P2 — E-Ticaret |
| K4 | Türkiye'de iş geliştirme danışmanlığı yapan firmalar hangileri? | P1 — İş Geliştirme (kategori sahipliği) |

### 2.2 Kısıt soruları (3)

| # | Prompt | Kısıt tipi |
|---|---|---|
| S1 | İstanbul'da hem strateji danışmanlığını hem yazılım geliştirmeyi aynı çatı altında yapan bir ajans var mı? | Konum + hizmet genişliği |
| S2 | Sanayi şirketlerine özel, B2B tarafında deneyimli yapay zeka ve dijital dönüşüm danışmanlığı veren firmalar hangileri? | Sektör (B2B/sanayi) |
| S3 | Somut vaka çalışması ve ölçülebilir sonuç (örneğin dönüşüm oranı ya da ciro artışı) paylaşan bir CRO veya büyüme ajansı önerir misin? | Kanıt/vaka |

### 2.3 Karşılaştırma soruları (3)

| # | Prompt | Karşılaştırma ekseni |
|---|---|---|
| C1 | Yapay zeka danışmanlığı ile geleneksel yönetim danışmanlığı arasındaki fark nedir, bir işletme hangi durumda hangisini seçmeli? | AI danışmanlığı vs yönetim danışmanlığı |
| C2 | Bir CRO ajansı seçerken hangi kriterlere bakılmalı, iyi bir ajansı kötüsünden nasıl ayırt ederim? | Ajans seçim kriterleri |
| C3 | İş geliştirme danışmanlığı, klasik yönetim danışmanlığından veya bir reklam ajansının işinden nasıl ayrılır? | İş geliştirme vs yönetim danışmanlığı/ajans |

**Not:** K4 ve C3 birlikte §2'nin İş Geliştirme tezini test eder — K4 terimin tanınıp tanınmadığını, C3 terimin doğru tanımlanıp tanımlanmadığını ölçer (kategori sahipliğinin GEO karşılığı).

---

## 3. Motorlar ve Yürütme

| Motor | Erişim | Not |
|---|---|---|
| ChatGPT | chatgpt.com | Hesapsız / gizli pencere (incognito — tarayıcının oturum ve geçmiş kaydetmeyen modu) |
| Gemini | gemini.google.com | Hesapsız / gizli pencere |
| Perplexity | perplexity.ai | Hesapsız / gizli pencere, varsayılan model — ücretli "Pro" arama açılmaz |

Yürütme kuralları:

- **Ayın aynı günü.** Sabit bir gün seçilir (örn. her ayın ilk iş günü). Gerekçe metnin kendisinde: *"aynı soru aynı gün iki farklı yanıt üretebiliyor... anlamlı olan aynı soruların aylarca aynı biçimde sorulması."*
- **Temiz oturum / hesapsız mod.** Her motor gizli pencerede veya oturum açılmadan sorgulanır — geçmiş konuşma, kişiselleştirme veya konum verisi yanıtı çarpıtmasın.
- **Dil: Türkçe.** Hem promptlar hem beklenen yanıtlar TR — INDOLES'in birincil pazarı.
- **Tek soru, tek oturum.** Her prompt kendi temiz sekmesinde sorulur; bir önceki promptun bağlamı bir sonrakine sızmaz.
- **Otomatik araç yok.** Kaynak metnin kuralı: elle sayım, elle kayıt.
- **Hacim:** 10 prompt × 3 motor = 30 sorgu/ay; tek oturumda yaklaşık 45-60 dakika.

---

## 4. Kayıt Tablosu Şablonu

Her tur bu şablona işlenir. Toplamda 30 satır üretilir (10 prompt × 3 motor); aşağıda başlık satırı ve ChatGPT için örnek boş satırlar gösterilmiştir — Gemini ve Perplexity için aynı 10 satır aynı kolonlarla tekrarlanır.

| Tarih | Motor | Prompt # | INDOLES geçiyor mu (E/H) | Anıldığımız cümle (birebir) | Atıf verilen URL | Rakip geçenler |
|---|---|---|---|---|---|---|
| | ChatGPT | K1 | | | | |
| | ChatGPT | K2 | | | | |
| | ChatGPT | K3 | | | | |
| | ChatGPT | K4 | | | | |
| | ChatGPT | S1 | | | | |
| | ChatGPT | S2 | | | | |
| | ChatGPT | S3 | | | | |
| | ChatGPT | C1 | | | | |
| | ChatGPT | C2 | | | | |
| | ChatGPT | C3 | | | | |
| | Gemini | K1…C3 | *(yukarıdaki 10 satır Gemini için tekrarlanır)* | | | |
| | Perplexity | K1…C3 | *(yukarıdaki 10 satır Perplexity için tekrarlanır)* | | | |

Alan tanımları (kaynak metnin kendi üç kayıt maddesi — *"markanın kaç yanıtta geçtiği, hangi cümleyle geçtiği ve hangi sayfanın kaynak gösterildiği"*):

- **INDOLES geçiyor mu (E/H):** geçiş sayısının ham girdisi; aylık özette (§5) toplanır.
- **Anıldığımız cümle (birebir):** yalnız geçti/geçmedi değil, *hangi* cümleyle anıldığımız. Kaynak metnin kendi örneği: *"matbaa malzemesi satan firmalardan biri"* (görünürlük var, konumlandırma yok) ile *"ihracat yapan matbaalara teknik malzeme üreten"* (cümlenin kendisi kazanç) arasındaki fark buradan okunur.
- **Atıf verilen URL:** hangi sayfamız kaynak gösterildi — *"kaynak gösterilen sayfa hangi yapıdaysa, bir sonraki yazıyı o yapıda kurarsınız."*
- **Rakip geçenler:** aynı yanıtta adı geçen diğer firmalar (serbest metin, virgülle ayrılmış) — §7'deki rakip eşiği kontrolünün ham verisi.

Tam 30 satırlık aylık dökümler bu dokümanın dışında (ayrı bir sayfa/sekme) tutulur; burada yalnız şablon ve alan tanımları sabittir.

---

## 5. Aylık Özet Satırı Şablonu

Her tur sonunda tek satırlık özet çıkarılır:

| Ay | Geçiş (X/30) | Önceki aya delta | A-5 kontrolü | Not |
|---|---|---|---|---|
| Ay 0 (baz çizgisi) | _/30 | — | Uygulanmaz | bkz. §6 |
| Ay 1 | _/30 | — | Uygulanmaz (ilk ay, delta yok) | |
| Ay 2 | _/30 | ±_ | 0/30 ise **A-5 ALARMI TETİKLENDİ** | |
| Ay 3 | _/30 | ±_ | | |
| … | | | | |

A-5 kuralı (`Keyword-Onceliklendirme-2026-08-27.md` §4): *"Ay 2, 10 promptun 0'ında geçmiyoruz → GEO kümesi yeniden yapılandırılır."* Eşik "10 prompt" bazında tanımlıdır; bu rutinde onun karşılığı **X/30 = 0**'dır (üç motorun hiçbirinde, hiçbir promptta geçiş yok). X/30 > 0 ise alarm tetiklenmez, ancak düşük sayı yine de aylık özet notunda işlenir.

**Erken tur yorumlama notu (site metniyle tutarlı):** Kaynak metnin kendi uyarısı, *"turun ilk aylarında sonuç genellikle sıfıra yakın okunur ve bu normaldir. İlk sinyal kategori sorularından değil kısıt sorularından gelir."* Ay 1'de düşük bir X/30 tek başına alarm değildir; Ay 1 özetinde S1-S3'ün K1-K4'e göre erken geçiş verip vermediğine bakılır. Gerçek alarm eşiği yalnız Ay 2'nin **tam sıfır** sonucudur (§5 tablosu) — SIM Baskı Malzemeleri vakasında (kaynak metin) görünürlük altı ayın sonunda sıfırdan 40 bine çıkmıştı; erken düşük sayı tek başına strateji değişikliği gerekçesi değildir.

---

## 6. Baz Çizgisi

*(Bu bölüm bilinçli olarak boş bırakılmıştır.)*

| Tarih | Motor | Prompt # | INDOLES geçiyor mu (E/H) | Anıldığımız cümle (birebir) | Atıf verilen URL | Rakip geçenler |
|---|---|---|---|---|---|---|
| | | | | | | |

**Talimat:** Cutover haftasında doldurulacak; K-7 şerhi buraya yazılır (baz çizgisi ticaret persona kopyası indekslenmeden alındı).

Gerekçe (`Keyword-Onceliklendirme-2026-08-27.md` K-7): Persona B (ticaret) kopyasının cutover sonrasına ertelenme ihtimali açık bir karar noktası. Baz çizgisi bu kopya indekslenmeden önce alınırsa, sonraki turlarla kıyaslanabilirliği bu şartla kayda geçmiş olur — aksi hâlde ilerleyen bir turda "GEO iyileşti" denildiğinde bunun içerik derinliğinden mi yoksa persona kopyasının sonradan eklenmesinden mi geldiği ayrışmaz.

---

## 7. Rakip Eşiği Bağlantısı

Aylık tur yalnız INDOLES'in kendi geçiş sayısını değil, `Rakip-Analizi-P0-SERP.md` §4'ün dört referans başarı kriterini de aynı turda besler — kayıt tablosunun "Rakip geçenler" kolonu bu kontrolün ham verisidir.

| Kelime/küme | Geçilecek rakip | Eşik | İlgili promptlar |
|---|---|---|---|
| dönüşüm optimizasyonu + cro ajansı | Poligon Interactive | İlk sayfada üstüne çıkmak | K2, S3, C2 |
| yapay zeka ajansı | Pare / AJANS YZ / ROIPublic katmanı | Top-5 | K1, S2 |
| yapay zeka danışmanlığı | Exact-match domainler (yapayzekadanismani.com vb.) | İlk sayfa (Big4 hariç) | K1, C1 |
| generative engine optimization / ai seo | Adroket, Wolfy, Poligon'un yeni sayfası | Kanonik içerik olmak (featured/AI atıfı) | Bu rutinin kapsamı dışı — bkz. not |

**Not:** GEO-editoryal kümenin kendi terimleri ("generative engine optimization", "ai seo") 10 promptun içine bilinçli olarak girmiyor — §2'nin marka adını dışarıda tutan aynı disipliniyle, INDOLES'in kendi hizmet kategorisini (GEO danışmanlığı) de doğrudan sormuyoruz; sorarsak kısıt sorusu cevabı zaten getirir, ölçtüğümüz kendi sorumuz olur. Bu dördüncü eşik GSC organik taramasıyla izlenir (`Keyword-Onceliklendirme-2026-08-27.md` §4, G3 grubu — GEO gösterim/pozisyon verisi), GEO promptluk turla değil.

---

**Sürüm:** v1.0 · 2026-08-28 · İlk sürüm — G-10 bulgusunu kapatır.
