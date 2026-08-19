# İçerik Denetimi — persona uyumu ve metin kalitesi

> **Tarih:** 2026-08-19 · **Kapsam:** yayındaki tüm metin yüzeyleri (anasayfa 7
> bölüm, 13 iç sayfa, chrome, entry popup, `messages/{tr,en}.json`,
> `src/lib/content/*`, `llms.txt`, yasal metin) · TR + EN.
> **Statü:** 27 bulgunun 19'u uygulandı (2026-08-19). Vaka, kurumsal bilgi ve
> kadro bulguları Burak'ın vereceği malzemeyi bekliyor — aşağıda **ERTELENDİ**
> olarak işaretli.

Ölçüt dokümanları: `01-vision-positioning.md` (persona tanımları, iki eksen,
kanonik konumlandırma), `03-brand-voice-tone.md` (ton matrisi, kelime rehberi,
mikro-copy), ADR-014 (persona-aware yüzey kümesi), ADR-016/017 (v2 sonrası
yüzey adları).

Her bulgu koda veya metne dayanıyor; genel tavsiye yok. `13-ui-ux-audit.md`
görsel/yerleşim denetimidir — bu doküman **yalnız metni** ele alır, örtüşme
kasıtlı olarak yoktur.

---

## Özet

Metnin kendisi iyi yazılmış: fiil-ağır, kanıt-odaklı, iki ton profili gerçekten
ayrışmış. Sorun yazımda değil, **bağlantıda**. Üç yapısal kırık var:

1. **Persona sistemi yarım bağlı.** Çift versiyon yazılmış metinlerin bir kısmı
   koda hiç bağlanmamış, bir kısmı `industrial`'a sabitlenmiş. Ticaret alıcısı
   sitenin birçok yerinde sanayi metnini okuyor.
2. **Kanıt katmanı vaadi taşımıyor.** Kadro, vaka anonimliği ve "ortalama"
   iddiaları, sanayi personasının (1A/1B) ilk baktığı yerlerde vaadi çürütüyor.
3. **En ikna edici metin yayında değil.** `home.unlockPotential` — iki persona
   için "Neden şimdi?" timing argümanları — hiçbir bileşen tarafından okunmuyor.

| Öncelik | Adet | Ne demek |
|---|---|---|
| **P0** | 5 | Yayın öncesi düzeltilmeli: yanlış kitleye konuşan metin, bozuk vaat, placeholder veri |
| **P1** | 8 | Persona vaadini kırıyor veya dönüşümü doğrudan etkiliyor |
| **P2** | 9 | Marka sesi ihlali / tutarlılık |
| **P3** | 5 | Derinlik ve kapsam boşluğu |

### Uygulama durumu — 2026-08-19

| Durum | Bulgular |
|---|---|
| **Uygulandı** | A1 · A2 · A3 · A5 · A6 · A7 (kısmi) · C1 · C2 · C3 · D1 · D2 · D3 · D4 · D5 · D6 · D8 · D9 · E1 · E2 · E3 · E4 · F1 · F2 · F3 · F4 |
| **Ertelendi — Burak** | A4 · B1 · B2 · B3 · B4 · B5 · B6 · G2 · G4 (vaka verisi, kurumsal künye ve kadro) |
| **Karar bekliyor** | G1 (içerik üretimi) · G3 (ADR konusu) |

Uygulama sırasında ortaya çıkan üç ek bulgu da düzeltildi:

| Ne | Nerede |
|---|---|
| Büyüme Sprinti 4 hafta ama ticaret `outcome`'u "3 haftada" vaat ediyordu | `packages.ts` |
| TR metinde `42%` yazımı (Türkçede `%42`) | `cases.ts`, `messages/tr.json` |
| `/paketler` taahhüt notu "siz" derken hemen üstündeki ticaret lede'i "sen" diyordu | `paketler/page.tsx` |

---

# A. Persona sistemi

Sorulan asıl soru burada. ADR-014 conversion-kritik yüzeylerin persona-aware
olmasını karara bağladı; kodun bugünkü hâli bu kararı kısmen uyguluyor.

## A1 — Persona hiç seçilmezse sessizce "sanayi" olunuyor · **P0** ✅ UYGULANDI

**Ne gördüm.** `use-persona.ts`:

```ts
export function toContentPersona(slug: PersonaSlug | null): Persona {
  return slug === "buyume-pazarlar" ? "commerce" : "industrial";
}
```

`null` → `industrial`. Persona yalnız entry popup'tan set ediliyor; popup
kapatılır, atlanır veya cookie silinirse tüm site sanayi tonunda kalır. Sayfada
görünür bir persona anahtarı **yok** — `PersonaChip` yalnız popup içinde.

**Neden sorun.** Vision doc'ta dört personadan ikisi (Persona 2 ticaret/perakende,
Persona 3 scale-up) ticaret tonuna bağlı. Bu iki persona popup'ı kapattığı anda
site onlara "fabrika, üretim hattı, ERP, operatör" dilinde konuşmaya başlıyor.
ADR-014'ün tüm copy yatırımı tek bir modal'ın kabul oranına bağlanmış durumda.

**Öneri.** İki katman: (1) popup'sız ziyaretçi için nötr varsayılan — `industrial`
değil, orta ton bir üçüncü değer (`neutral`), en azından pillar ve hizmet
metinlerinde; (2) sayfa içinde kalıcı, görünür bir anahtar. Pillar bölümü başlığının
yanında iki kelimelik bir toggle ("Sanayi / Ticaret") bu işi görür ve zaten var
olan copy'yi kullanır.

## A2 — Pillar landing sayfaları persona'ya `industrial` sabitliyor · **P0** ✅ UYGULANDI

**Ne gördüm.** `hizmetler/[slug]/page.tsx` üç yerde:

| Satır | Kod | Etkisi |
|---|---|---|
| 43 | `eyebrow={pillar.tagline.industrial[loc]}` | Sayfa üstü etiket |
| 92 | `{pillar.description.industrial[loc]}` | Yöntem bölümünün açılış paragrafı |
| 151 | `{s.shortDescription.industrial[loc]}` | 12 hizmetin tamamı |

**Neden sorun.** Ton matrisi (§3) pillar landing'i açıkça persona-aware sayıyor —
üç satırda ayrı ayrı. Bugün bir e-ticaret markası `/hizmetler/growth`'a girip
şunu okuyor: *"Sanayi markası için yapısal büyüme."* ve altında *"Marka
konumlandırması, B2B müşteri edinimi ve performans kanallarını… İhracat hedefi
veya yurt içi pazar payı."* Persona 2'nin ilk tıkladığı sayfalardan biri bu
(vision doc §5: "Paketler veya Growth pillar sayfası").

Metin eksik değil — `pillars.ts` içinde `commerce` varyantları eksiksiz yazılı.
Yalnız bağlanmamış.

**Öneri.** Üç satırı `PersonaText` ile sar. Bileşen zaten aynı dosyada import
edilmiş (satır 7) ve paket kartlarında kullanılıyor.

## A3 — Liste sayfalarının başlıkları persona-agnostik, kartları persona-aware · **P1** ✅ UYGULANDI

**Ne gördüm.**

| Sayfa | Başlık/lede | Kart içeriği |
|---|---|---|
| `/hizmetler` | Sabit: "Üç pillar, 12 hizmet." | Persona-aware |
| `/paketler` | Sabit: "Sabit kapsam. Sabit süre. Sabit fiyat." | Persona-aware (`outcome`, `whoFor`) |
| `/vakalar` | Sabit: "Problem tipine göre, sektöre değil." | Alt bölüm (`CasesSection`) persona-aware |

**Neden sorun.** ADR-014 Faz C'nin kapsamı buydu: *"`/hizmetler` ve `/paketler`
sayfaları persona-aware hero + kart copy'lerine geçirilir."* Hero kısmı
yapılmamış. Sonuç: aynı sayfada iki ton — başlık nötr, kart ticaret dilinde.
Persona switch'in "kimlik bildirimi" işlevi ADR'nin gerekçe bölümünde tarif
edildiği gibi kırılıyor.

`/vakalar` en görünür örnek: üstte sabit tonda bir başlık, sayfanın ortasında
persona-aware `CasesSection` başlığı ("Rakam olmadan sonuç sayılmaz." /
"Her proje ölçülebilir bir çıktıyla kapanır."). Aynı sayfa iki kez, iki farklı
sesle açılıyor.

**Öneri.** `/paketler` için copy zaten yazılı ve **kullanılmıyor** — bkz. C2.
`messages` içindeki `home.packages._personas.{industrial,commerce}`
`V2PageHeader`'a bağlanabilir. `/hizmetler` ve `/vakalar` için iki kısa çift
versiyon yazılması gerekiyor (4 cümle).

## A4 — Vaka çalışmaları hiç persona-aware değil · **P1** ⏸ ERTELENDİ (vaka verisi)

**Ne gördüm.** `cases.ts` içinde `Localized<>` var, `PersonaVariant<>` yok.
`/vakalar/[slug]` tek versiyon render ediyor.

**Neden sorun.** Ton matrisi vaka için en ayrıntılı ayrımı tanımlıyor:

| Persona | Beklenen sunum |
|---|---|
| 1A | Anlatı ağırlıklı, sonunda metrik, patron alıntısı |
| 1B | Metrik ağırlıklı, ROI vurgusu, pilot kapsamı |
| 2 | Metrik ağırlıklı, hız vurgusu |
| 3 | Kompakt, kaldıraç odaklı |

Bugün dört persona da aynı metni okuyor. Vaka, 1A'nın güven kazanma
tetikleyicileri listesinin ilk maddesi ("benzer sektörde vaka çalışması") ve
2'nin ("rakamsal vaka çalışması").

**Öneri.** Tam çift versiyon 4 vaka × 2 persona × 2 dil = 16 set demek, ADR-014'ün
bakım yükü sınırını zorlar. Daha ucuz ve neredeyse aynı etkiyi veren yol:
`lead` ve `outcome` alanlarını persona-aware yap (8 set), `challenge`/`approach`
ortak kalsın. Sunum sırası da persona'ya göre değişebilir — 1A için anlatı
önce, metrik sonra; 2 için tersi. Bu, mevcut bileşende iki `<section>`'ın
sırasını değiştirmek demek.

## A5 — Popup "ihtiyaç" soruyor, içerik "kitle" varsayıyor · **P0** ✅ UYGULANDI

**Ne gördüm.** İki taksonomi üst üste binmiş:

| Katman | Eksen | Değerler |
|---|---|---|
| Popup (`personas.ts`) | İhtiyaç | "AI, Otomasyon ve Teknoloji Dönüşümü Arıyorum" · "Büyüme, Marka Bilinirliği ve Yeni Pazarlar Arıyorum" |
| İçerik (`types.ts`) | Kitle | `industrial` · `commerce` |

Eşleme birebir: `donusum-teknoloji` → `industrial`, `buyume-pazarlar` → `commerce`.

**Neden sorun.** Bu iki eksen aynı şey değil. Otomasyon arayan bir e-ticaret
markası — vision doc'un Persona 2'sinin tipik ihtiyacı, popup'ın kendi problem
listesinde bile var (`altyapi-yuk-kaldirmiyor`, `churn-yuksek`) — "dönüşüm"ü
seçtiği anda tüm site ona sanayi dilinde konuşmaya başlıyor. Somut sonuç:
`/paketler`'de Dijital Dönüşüm Teşhisi'nin "kimin için" satırı ona şunu diyor:

> "100-5.000 çalışanlı üretim veya imalat şirketi — dijitalleşmesi gerektiğini
> biliyor, nereden başlayacağını bilmiyor"

Ters yön de geçerli: ihracat pazarına açılmak isteyen bir sanayici
`buyume-pazarlar`'ı seçer ve CAC/ROAS/sepet terk dili alır.

**Öneri.** Popup Stage 1'i ikiye böl veya soruyu değiştir. En ucuzu: soruyu
kitleye çevirmek — "Sanayi/üretim tarafındayız" vs "Ticaret/perakende
tarafındayız" — ihtiyaç zaten Stage 2'de (20 problem) soruluyor ve orada
`services`/`pillars` eşlemesi doğru çalışıyor. Böylece Stage 1 tonu, Stage 2
yönlendirmeyi belirler; bugün ikisi de tek soruya yüklenmiş durumda.

## A6 — Persona metinleri sıçrıyor (`ready` bayrağı kullanılmıyor) · **P2** ✅ UYGULANDI

**Ne gördüm.** `usePersonaState()` FOIC (Flash of Industrial Content) için bir
`ready` bayrağı döndürüyor ve yorumu bunu açıkça anlatıyor. Ama üç tüketici de
kısayolu kullanıyor: `Pillars.tsx:28`, `ServicesScroll.tsx:23`,
`persona-text.tsx:12` → hepsi `usePersona()`.

**Neden sorun.** Ticaret ziyaretçisi her sayfa yüklemesinde önce sanayi metnini
görüyor, sonra metin yerinde değişiyor. UX audit 2026-04-18 C3 bulgusu için
yazılmış çözüm bağlanmamış.

**Öneri.** `PersonaText` içinde `ready` false iken opaklık geçişi — çözüm zaten
tarif edilmiş, uygulanması tek bileşende.

## A7 — Bir dosyada iki isimlendirme sistemi · **P2** ◐ KISMEN

`messages/tr.json` içinde `home.hero.personas.donusum-teknoloji` ve
`home.pillars._personas.industrial` yan yana. ADR-014 "Negatif / trade-off"
bölümünde bu riski yazmış (*"key naming disiplini kırılırsa bakım karışır"*);
kırılmış. Hero anahtarları bugün ölü (bkz. C3), yani temizlik ucuz.

---

# B. Kanıt ve güvenilirlik

Bu bölümdeki bulgular Persona 1A ve 1B için belirleyici. Vision doc §5: 1A'nın
ilk tıkladığı sayfa **"Hakkımızda veya Uzmanlar"**.

## B1 — Kadro, sitenin teknik vaadini çürütüyor · **P0** ⏸ ERTELENDİ (kadro)

**Ne gördüm.** `consultants.ts`, 10 kişi:

| # | Rol |
|---|---|
| 1 | Kurucu · Marka Stratejisti ve Kreatif Direktör |
| 2 | Stratejik Danışman (dijital dönüşüm, organizasyonel gelişim) |
| 3 | Kreatif ve Strateji Uzmanı (marka dili, metin) |
| 4 | Proje Yöneticisi · Müşteri İlişkileri |
| 5 | Görüntü Yönetmeni |
| 6 | Video ve Fotoğraf |
| 7 | Sanat Yönetmeni · Görsel Tasarım |
| 8 | Grafik Tasarımcı |
| 9 | Kreatif Asistan · Web Tasarım |
| 10 | Chief Mood Officer (köpek) |

Kadroda **bir yazılım mühendisi, bir veri/AI uzmanı veya bir sanayi/üretim
uzmanı yok.** En yakın profil #9 (arayüz geliştirme). Kurucunun biyografisinde
bir AI SaaS ortaklığı geçiyor, ama unvanı marka stratejisti.

**Neden sorun.** Aynı sitede yazılı vaatler: ERP modernizasyonu, üretim hattı
otomasyonu, 6 haftada saha testine giren AI prototipi, 8 haftada canlıya alınan
MVP, "TypeScript monolit varsayılan", observability kurulumu, 30 gün
stabilizasyon, kaynak kod devri. Konumlandırmanın üçüncü ayağı zaten
"mühendislik stüdyosunun teknik derinliği".

1B (COO/CDO) kadroya bakıp IT direktörüne teknik uygunluk için götüreceği bir
isim aramıyor — bulamıyor. 1A ise referansla ikna olan bir profil; ekipte kendi
dünyasından (üretim, tedarik, kalite) kimseyi görmüyor.

Bu, sitedeki **en büyük içerik–vaat uçurumu** ve düzeltmesi metin işi değil.

**Öneri.** Üç seçenekten biri, sırayla tercih edilebilirlik:
1. Mühendislik/veri tarafındaki gerçek isimleri kadroya ekle (dış ortak/kontraktör
   ise bunu dürüstçe yaz — "Dürüst sınır çizme" brand voice'un güven kalıbı).
2. Kadro sayfasını "kurucu ekip + uygulama ortakları" olarak ikiye ayır ve
   mühendisliğin nasıl kurulduğunu açıkla.
3. Kısa vadede: Build pillar'ının ve MVP Build paketinin vaatlerini kadroyla
   uyumlu seviyeye çek.

Seçenek 3 en hızlısı ama konumlandırmayı daraltıyor; karar senin.

## B2 — Köpek, birincil güven yüzeyinde · **P1** ⏸ ERTELENDİ (kadro)

**Ne gördüm.** "Hipnoz The Wisedog · Big Boss · Chief Mood Officer" üç yerde:
`/danismanlar` kart listesinde, `/hakkimizda` ekip grid'inde ve `/hakkimizda`
kadro slider'ının rotasyonunda. `/danismanlar/hipnoz` statik üretilmiyor ama
`dynamicParams` açık olduğu için çalışma anında tam bir danışman profili
render ediyor.

**Neden sorun.** Brand voice §4A ironiyi kabul ediyor ama iki kuralla: hedefi
sektörel klişe veya INDOLES'in kendisi olacak, ve **sayfada en fazla 1-2 nokta**.
Burada ironi bir cümle değil, bir *kişi kartı* boyutunda ve kadro sayımına
giriyor ("10 kişi"). 50-65 yaş, risk-averse, 1-3 ay değerlendirme süresi olan
bir patron için ilk baktığı sayfada bu bir sinyal.

**Öneri.** Kaldırma; **taşı**. Kültür/ofis bölümü ya da `/hakkimizda`'nın en
altında tek bir satır olarak kalabilir — orada tam da istenen etkiyi yapar.
Danışman listesinden ve profil route'undan çıksın (`BOOKABLE_CONSULTANTS` filtresi
zaten var, listeleme sayfaları onu kullanmıyor).

## B3 — Kadro bölümü metni marka sesinin dışında · **P1** ⏸ ERTELENDİ (kadro)

**Ne gördüm.** `team-slider.tsx`:

> "Yaratıcı zihinler, ortak bir amaç"
> "Sanat, tasarım, müzik, felsefe, tarih ve bilimle sık sık etkileşim kuran
> dinamik bir ekip. Düşünce gücümüz yüksek; yeni fikirleri derinlemesine
> keşfetmekten keyif alırız."

**Neden sorun.** Brand voice'un üç kuralını aynı anda çiğniyor: sıfat-ağır
(yaratıcı, dinamik, yüksek), kanıtsız, ve "gurur duyuyoruz" ailesinden bir
self-congratulation (§6c'de sosyal medya için açıkça yasaklanmış kalıp). Ayrıca
tematik olarak çelişiyor: anasayfanın manifestosu *"ajans kampanya bitince
çıkar"* diyor, kadro bölümü ajans diliyle konuşuyor.

Aynı sayfada üç farklı ses var: `/hakkimizda` ekip bölümü ("İç ekip.
Küratörlü. Açık marketplace değil…" — doğru ton), hemen altında slider
("Yaratıcı zihinler…" — yanlış ton), ve `/danismanlar` ("İç ekip. Küratörlü."
— aynı başlığın üçüncü kopyası).

**Öneri.** Slider başlığını ve lede'ini `/danismanlar` sesine çek. Ayrıca
`/hakkimizda`'da ekip iki kez görünüyor (grid + slider); biri yeter.

## B4 — Logolar isimli, vakalar anonim · **P1** ⏸ ERTELENDİ (vaka + kurumsal)

**Ne gördüm.** `TrustedGrid`: Turkcell, Türk Telekom, Evyap, La Lorraine,
Komagene, Gloria Perfume, Taç, Meccanotecnica… (15 marka).
`cases.ts`: "Sanayi Şirketi A", "D2C Markası B", "Perakende Zinciri C",
"Sanayi Şirketi D". Tek testimonial anonim: "Üretim Direktörü, sanayi şirketi".

**Neden sorun.** Anasayfa büyük markaları gösteriyor, vakalar hiçbirini
adlandıramıyor. Ziyaretçinin doğal sorusu — "Turkcell ile ne yaptınız?" —
cevapsız. Persona 1B için ikinci sorusu daha zor: bu logolar INDOLES'in mi,
kurucunun önceki ajans geçmişinin mi? Metinde bunu söyleyen bir satır yok.

**Öneri.** İki satırlık bir dürüstlük ifadesi bu gerilimin tamamını çözüyor.
Logo grid'inin altına: hangi kapsamda çalışıldığı (marka, kampanya, dönüşüm) ve
gerekiyorsa "kurucu ve ekip üyelerinin görev aldığı markalar" ayrımı. Brand
voice'un "Dürüst sınır çizme" kalıbı tam olarak bunu ödüllendiriyor. En az bir
vakada gerçek isim + izin alınmış alıntı, dört anonim vakadan daha çok iş görür.

## B5 — "Ortalama" iddiaları tek vakaya dayanıyor · **P1** ⏸ ERTELENDİ (vaka verisi)

**Ne gördüm.**

| Yer | İddia | Dayanak |
|---|---|---|
| Growth pillar | "3.2× **Ortalama** ROAS artışı" | Tek growth vakasında 3.2× **organik trafik** var; ROAS metriği hiçbir vakada yok |
| Growth pillar | "-%34 Müşteri edinim maliyeti" | Aynı tek vaka |
| Transform pillar | "-%42 **Ortalama** süreç süresi" | Tek vakanın planlama süresi |
| Transform pillar | "-%28 Operasyonel maliyet" | Tek vaka (gıda üretimi) |
| Build pillar | "8 hafta **Ortalama** MVP süresi", "%100 Source code teslimi" | Build pillar'ında yayında vaka yok |

**Neden sorun.** Brand voice §4B sayısal veri kuralları: *"Aralık ver, tekil
rakam verme (tahminlerde)"*, *"Bağlam ver"*, *"Karşılaştırma çerçevesi kur"*.
"Ortalama" kelimesi n=1'de yanlış bir kesinlik yanılsaması üretiyor — ve
metriğin adı da kayıyor (organik trafik → ROAS). 1B tam olarak bu tabloyu
sorgulamak için var: ROI hesabını iç paydaşa savunması gerekiyor.

Ayrıca `home.unlockPotential` (ölü metin) daha doğru bir dil kullanıyor:
"%12-18 Ortalama maliyet düşüşü / Müşteri projelerinde gözlemlenen". Aralık +
kaynak. Yayındaki tablolar bu disiplini takip etmiyor.

**Öneri.** Ya aralığa çevir ("%25-40", "3-4×") ve altına kaynak yaz ("n=1 vaka",
"iki projede gözlemlenen"), ya da pillar metriklerini kaldırıp doğrudan vaka
metriklerine bağla. `13-ui-ux-audit.md` P2 bulgusunun uyarısı burada da geçerli:
*"Grafik çizmeden önce sayıların kaynağı doğrulanmalı."*

## B6 — Doğrulanmamış kurumsal veri her sayfada canlı · **P0** ⏸ ERTELENDİ (kurumsal)

| Veri | Değer | Nerede görünüyor |
|---|---|---|
| Telefon | `+90 212 111 22 33` — placeholder deseni | Üst şerit (tüm sayfalar), anasayfa kapanışı, `tel:` linki |
| Konum | "Levent, İstanbul · London · Dubai" | Üst şerit (tüm sayfalar), kadro bölümü alt şeridi |

`company.ts` ikisini de TODO ile işaretlemiş, ama ikisi de render ediliyor.

**Neden sorun.** Tıklanabilir bir placeholder telefon, arayan biri için markanın
ilk ve son izlenimi. Üç ofis iddiası ise 10 kişilik bir kadro yanında ("10 kişi ·
Levent, İstanbul · London · Dubai" — aynı satırda) kendi kendini zayıflatıyor;
1A'nın referansla ikna olan psikolojisi bu tür asimetrileri yakalar.

**Öneri.** Telefon gerçekleşene kadar üst şeritten çıkar (e-posta yeterli).
Londra/Dubai varlığı teyit edilene kadar tek konum yaz — "İstanbul" tek başına
zayıf değil, doğrulanamayan üç şehirden güçlü.

---

# C. Yazılmış ama yayında olmayan metin

`messages/{tr,en}.json`'un yaklaşık üçte biri hiçbir bileşen tarafından
okunmuyor. Namespace kullanımı taranarak doğrulandı.

| Anahtar | Durum | İçerik |
|---|---|---|
| `home.unlockPotential` | **Ölü** | İki persona × "Neden şimdi?" başlık + argüman + 2 metrik + CTA |
| `home.packages` | **Ölü** | Persona-aware paket hero'ları + 4 paket kartı |
| `home.hero` (tamamı) | **Ölü** | Persona-aware hero (editorial + support), v2 `TITLE_ROWS` kullanıyor |
| `home.manifesto` | **Ölü** | Alıntı + atıf; v2 `STATEMENT` sabitini kullanıyor |
| `home.finalCta._personas.*.paths` | **Ölü** | Üç giriş kapısının persona metinleri |
| `home.proof.featured/others` | **Kısmen ölü** | `CasesSection` yalnız `_personas` eyebrow/headline/lede okuyor |
| `pillars.*` (kök) | **Ölü** | `home.pillars` kullanılıyor |

## C1 — Timing argümanları yayında değil · **P1** ✅ UYGULANDI

**Ne gördüm.** `home.unlockPotential`, iki persona için tam yazılmış:

> **industrial:** "Teknoloji dönüşümünü ertelemek, 2028'de rekabet edemez olmak
> demek. ERP'yi 5 yıl geç alan sanayi, ihracatta marj farkını hâlâ kapatamadı…"
>
> **commerce:** "Bedava büyüme dönemi bitti. Yapısal sistem olmadan büyüme
> duruyor. Organik erişim her yıl yarıya düşüyor…"

**Neden sorun.** Bunlar vision doc §2'deki timing argümanlarının tek uygulaması
ve sitedeki **en persona-spesifik, en ikna edici metin**. İkisi de aciliyeti
korku satmadan kuruyor — brand voice'un tam istediği şey. Ayrıca metrik
sunumları da doğru (aralık + kaynak, bkz. B5). Hiçbir yerde görünmüyor.

**Öneri.** Bu bölüm anasayfaya geri gelmeli. v2'nin 7 bölümlük kurgusunda
doğal yeri Statement ile Pillars arasıdır: manifesto "kim olduğumuz", timing
"neden şimdi", pillar "ne yaptığımız". Blob koreografisi 7 duraklı olduğu için
bir durak eklemek `choreography.ts` güncellemesi gerektirir — ADR-016 §Migrasyon
kapsamında değerlendirilmeli.

## C2 — Paket hero'ları için persona metni var, sayfa kullanmıyor · **P2** ✅ UYGULANDI

`home.packages._personas.industrial.lede` — *"Metodoloji şeffaf, kapsam sınırlı,
bütçe öngörülebilir. Sonuç görülür, ilerleme kararı firmaya kalır."* Sanayi
alıcısının satın alma psikolojisine birebir yazılmış. `/paketler` bunun yerine
sabit bir metin kullanıyor. A3 ile birlikte çözülür.

## C3 — Kaldırılmış özelliğin vaadi ölü metinde duruyor · **P2** ✅ UYGULANDI

`home.finalCta._personas.industrial.paths.chat`:

> "AI danışman ile probleminizi birkaç cümlede tanımlayın. Sektörünüze ve
> büyüklüğünüze göre ilk değerlendirme anında döner."

AI agent ADR-007 ile kaldırıldı. Metin bugün render edilmiyor, ama `messages`
dosyasında duran her satır bir gün render edilebilir. Aynı şekilde
`common.nav.signIn` / `common.nav.dashboard` — ADR-008 ile kaldırılan auth
alanına ait.

**Öneri.** Ölü anahtarları temizle veya `_deprecated` altına taşı. Silme kararı
C1'den sonra verilmeli — `unlockPotential` geri gelecekse silinmemeli.

---

# D. Ton ve dil

## D1 — Popup "sen" diyor, sitenin geri kalanı "siz" · **P0** ✅ UYGULANDI

**Ne gördüm.** Entry popup, her ziyaretçinin gördüğü **ilk** metin yüzeyi:

| Anahtar | Metin |
|---|---|
| `stage1.title` | "Kimsin?" |
| `stage1.subtitle` | "Seni daha iyi tanıyalım ki doğru içerikleri gösterelim." |
| `stage1.helper` | "Hangisi sana daha yakın? Sonra değiştirebilirsin." |
| `stage2.title` | "Hangi durumları sıklıkla yaşıyorsun?" |
| `stage2.fifoHint` | "3 sorun seçebilirsin. İlk seçimin çıkarıldı." |
| `stage3.subtitle` | "Sana uygun bir danışmanla doğrudan konuşalım." |
| `success.bookingBody` | "Detayları e-postanda bulacaksın." |

Sitenin geri kalanı "siz": Outro *"Gündeminizi dinler, ilk çerçeveyi birlikte
çizeriz."*, ServicesScroll *"Aradığınızı bulamadınız mı?"*,
`finalCta._personas.industrial` *"Nasıl başlamak istersiniz?"*.

Popup kendi içinde de tutarsız: `stage3.contactCta` = **"Biz sizinle iletişime
geçelim"** — aynı ekranda hem "sana" hem "sizinle".

**Neden sorun.** Türkçede sen/siz ayrımı ton değil, **hitap kararıdır**.
"Kimsin?" 50-65 yaş bir aile şirketi patronuna teklifsiz geliyor — ve bu, henüz
persona seçilmeden, yani sitenin ton sözleşmesinin devreye girmesinden önce
oluyor. Ton matrisi "Brief / Rezervasyon → orta-yönlendirici" diyor; orta ton
kuralı ise "'Siz' yerine dolaylı hitap tercih edilir", "sen" değil.

**Öneri.** Popup persona seçilene kadar dolaylı/siz hitabı kullansın:

| Şimdi | Öneri |
|---|---|
| "Kimsin?" | "Hangi taraftasınız?" veya "Nereden başlayalım?" |
| "Seni daha iyi tanıyalım ki doğru içerikleri gösterelim." | "Doğru içeriği gösterebilmemiz için kısa bir soru." |
| "Hangi durumları sıklıkla yaşıyorsun?" | "Hangi durumlar tanıdık geliyor?" |
| "Sana uygun bir danışmanla doğrudan konuşalım." | "Uygun bir danışmanla doğrudan konuşalım." |

Persona seçildikten **sonra** ticaret dalında "sen"e geçilmesi zaten iki ton
profilinin gerektirdiği şey — bugünkü sorun, ayrımın seçimden önce yapılması.

## D2 — "Ücretsiz" yasak listesinde ama birincil CTA'da · **P1** ✅ UYGULANDI

`popup.stage3.bookingCta` = **"1 saatlik ücretsiz görüşme rezerve et"**
(EN: "Book a 1-hour free session").

Brand voice §4B, CTA'da kaçınılacaklar: *"**Ücretsiz** — değer algısını düşürür
(bu prestij markası)"*. Bu, sitenin en yüksek niyetli tıklaması ve kuralın tam
karşısında duruyor.

**Öneri.** "1 saatlik keşif görüşmesi planla" + altında mikro-metin olarak
"Taahhütsüz". Bilgi korunur, değer algısı düşmez. `bookingHelper` alanı bunun
için zaten var.

## D3 — Hero, kanonik konumlandırmanın yarısını söylüyor · **P1** ✅ UYGULANDI

**Ne gördüm.** `title-content.ts`:

```
RAPOR DEĞİL
SONUÇ
İNŞA EDERİZ
```

Kanonik cümle (vision doc §3d) iki kollu: *"Rapor değil sonuç, **kampanya değil
sistem**."*

**Neden sorun.** İlk kol INDOLES'i **danışmanlıktan** ayırıyor — sanayi
alıcısının karşılaştırma kümesi. İkinci kol **ajanstan** ayırıyor — ticaret
alıcısının karşılaştırma kümesi. Hero yalnız birincisini söylüyor, dolayısıyla
sitenin açılış cümlesi iki eksenden birine konuşuyor.

ADR-016 hero'yu bilinçli olarak orta ton yaptı ve gerekçesi doğru ("kanonik
konumlandırma alıcıya göre değişmez"). Ama orta ton = **iki eksenin ikisi de**;
bugünkü hâli birinin yarısı. Statement bölümü bunu iki satır sonra düzeltiyor
("Danışmanlık rapor teslim eder, **ajans kampanya bitince çıkar**") — yani doğru
cümle sitede var, hero'da yok.

**Öneri.** Üçüncü satırı iki kolu birleştirecek şekilde değiştir. Aynı harf
sayısı düzeninde kalan bir seçenek: satır 3 → `SİSTEM İNŞA EDERİZ` ("sonuç" +
"sistem" iki kolu da taşır). Alternatif: dört satırlık bir kurgu
(`RAPOR DEĞİL / SONUÇ · KAMPANYA DEĞİL / SİSTEM / İNŞA EDERİZ`) — ama
`accentRange` değerleri blob yolu ölçülerek bulunduğu için bu, ölçüm gerektirir.

## D4 — "Disiplin" sayısı aynı ekranda çelişiyor · **P2** ✅ UYGULANDI

Pillars bölümü (industrial): **"Üç disiplin, tek omurga."**
Hemen altındaki ServicesScroll eyebrow'u: **"Hizmet portföyü · 12 disiplin"**

İki bölüm arka arkaya, disiplin sayısı hem 3 hem 12. "Uzmanlık" veya "hizmet"
ikincisi için doğru kelime.

## D5 — Soyut "uçtan uca" + "bütüncül" · **P2** ✅ UYGULANDI

ServicesScroll başlığı: **"Bütüncül dönüşüm için uçtan uca uzmanlıklar."**

Brand voice §5b: *"Uçtan uca — Dikkatli kullan. Somut kapsamla OK ('fabrikadan
ERP'ye'), soyut kalırsa kaçın."* Burada iki soyut sıfat yan yana, fiil yok,
sıfat-başlangıçlı başlık (§4A'da açıkça kaçınılacak denmiş). `vision-section`
sayacında da tekrar ediyor: "12 hizmet, uçtan uca".

**Öneri.** Fiil-ağır bir karşılık: "Teşhisten canlıya, on iki uzmanlık." veya
pillar başlığındaki disiplinle bağla: "Üç disiplin, on iki uzmanlık."

## D6 — "Pillar" Türkçe metinde çevrilmemiş · **P2** ✅ UYGULANDI

`/hizmetler` H1: **"Üç pillar, 12 hizmet."** Ayrıca `/paketler` karşılaştırma
tablosunda kolon başlığı olarak, homepage pillar linklerinde ve breadcrumb'larda.

Anglicizm listesi (§5c) "pillar"ı içermiyor. Persona 1A için jargon seviyesi
"düşük" olarak tanımlı ve *"İngilizce teknik terimlere mesafeli, Türkçe karşılık
tercih eder"*. Growth/Transform/Build marka terminolojisi olarak kalabilir —
IA doc bunu karara bağlamış — ama "pillar" kelimesinin kendisi kalmamalı.

Sitenin kendi içinde doğrusu zaten var: `home.pillars._personas.industrial.headline`
= **"Üç disiplin, tek omurga."** Aynı kelime `/hizmetler` başlığında kullanılmalı.

## D7 — Manifesto imzası anonim · **P3** ⏸ ERTELENDİ (kadro)

`home.manifesto.attribution` = "INDOLES Kurucusu". İsim kadro sayfasında zaten
yazılı. Kanıt-odaklı bir ses kendi imzasını saklamaz. (Bugün ölü metin; Statement
bölümüne atıf eklenirse geçerli olur.)

## D8 — Paket adları 1A için opak · **P3** ✅ UYGULANDI

"MVP Build" ve "AI Pilot" — "Büyüme Sprinti" ve "Dijital Dönüşüm Teşhisi"nin
yanında. MVP ve pilot §5c'de izinli terimler, ama **ürün adı** olarak geleneksel
sanayiciye doğrudan gösteriliyorlar. Paket detay metni açıklıyor; liste sayfası
açıklamıyor.

**Öneri.** Kart altında tek satırlık Türkçe alt başlık ("İlk sürüm inşası",
"Tek kullanım senaryosunda AI prototipi"). `outcome` alanı bunu zaten yapıyor,
yalnız adın hemen altında değil.

## D9 — Sanayi metinlerinde açıklanmamış anglicizm · **P3** ✅ UYGULANDI

§5d Persona 1A için kural: *"Teknik terimleri ilk kullanımda açıkla."*
Uygulama çoğunlukla doğru — "yatırım getirisi (ROI)", "büyük dil modeli",
"gösterge paneli". Ama `packages.ts` industrial varyantlarında açıklamasız
kalanlar var: "use case seçimi", "as-is süreç haritaları", "test backlog",
"spec dokümanı", "TypeScript monolit". İlk üçü kolayca Türkçeleşir
("kullanım senaryosu", "mevcut durum süreç haritaları", "test listesi").

---

# E. Funnel metinleri ve bozuk vaatler

## E1 — "Brief gönder" CTA'sı 404 · **P0** ✅ UYGULANDI

**Ne gördüm.** `/app/brief/yeni` route'u yok — `/app/*` ADR-008 ile kaldırıldı.
Bağlantı üç yerde duruyor:

| Dosya | Görünürlük |
|---|---|
| `contact-callout.tsx` | **13 iç sayfanın hepsinde** ("Brief gönder") |
| `paketler/[slug]/page.tsx` | 4 paket detay sayfasında, fiyatın yanında ikincil CTA |
| `llms.txt` | AI ajanlarına verilen iletişim yolu |

**Neden sorun.** İkincil CTA, brand voice'un "düşük taahhüt" kapısı — 1A'nın
uzun değerlendirme sürecinde görüşmeye hazır olmayan ziyaretçinin tek çıkışı.
Bugün o çıkış 404.

**Öneri.** Ya `/iletisim`'e yönlendir ve etiketi hedefle uyumla, ya da brief
formunu `/iletisim` içinde bir mod olarak aç. Anasayfa Outro'da aynı sorunun
hafif hâli var: "Brief gönder" etiketi `/iletisim`'e gidiyor — etiket bir form
vaat ediyor, hedef bir sayfa veriyor.

## E2 — Bülten vaadi beslenmiyor · **P2** ✅ UYGULANDI

Footer: **"Ayda bir — teşhis, metot, sonuç."** Bu bir yayın taahhüdü.
Arkasında: liste entegrasyonu yok (form `mailto:` açıyor), ve `/yazilar`'da 3
yazı var — en yenisi **2026-03-18**, yani beş ay önce.

**Neden sorun.** "Ayda bir" diyen bir markanın son yazısı beş ay önceyse, bu
metin güven düşürüyor. Persona 1B'nin giriş kanalı Google organik ve sektörel
içerik; 3 yazı ile o kanal yok sayılıyor.

**Öneri.** Ya vaadi kaldır ("Yeni yazı çıktığında haber verelim"), ya besle.
Aradaki üçüncü yol yok.

## E3 — `/iletisim` boş bir takvimin üstünde "Slot seç." diyor · **P2** ✅ UYGULANDI (fallback metni)

Cal.com embed 404 veriyor (`13-ui-ux-audit.md` P3'te kayıtlı). Nav CTA'sı artık
popup'a döndüğü için ikinci derece, ama sayfa hâlâ "Takvim / Slot seç." başlığını
render ediyor. Bağlantı düzelene kadar başlık boş alanı işaret ediyor.

## E4 — Yanıt süresi üç yerde iki farklı sayı · **P3** ✅ UYGULANDI

`/iletisim`: "Ortalama 1 iş günü" · popup success: "1 iş günü içinde ulaşacağız"
· `finalCta` (ölü): "48 saat içinde yaklaşım, uygun paket ve tahmini etki döner".
Bugün çelişki yok çünkü üçüncüsü ölü — ama C1 ile metin geri gelirse çelişir.

---

# F. İngilizce sürüm

Brand voice §7: *"Ton önce, kelime sonra. Literal çeviri tonu öldürür."*
EN'nin çoğu bu kurala uyuyor — "Growth is an engineering problem." (TR: "Büyüme
sistem işidir.") iyi bir yeniden yazım örneği. Üç yerde uymuyor.

## F1 — Anlamı bozan çeviri · **P1** ✅ UYGULANDI

`home.proof._personas.commerce.headline`:

| TR | EN (mevcut) | Sorun |
|---|---|---|
| "Rakam olmadan sonuç sayılmaz." | **"No outcome, no result."** | Totoloji — "sonuç yoksa sonuç yok". Anlamsız. |

**Öneri.** "If it isn't a number, it isn't a result." veya "No number, no result."

## F2 — Türkçe deyim İngilizceye taşınmış · **P2** ✅ UYGULANDI

| Sayfa | TR | EN (mevcut) |
|---|---|---|
| `/iletisim` H1 | "30 dakikada birlikte bir kağıda bakalım." | "Let's look at a single page together, in 30 minutes." |
| `/vakalar` lede | "Benzer senaryoyu gör, kendi ihtimalini değerlendir." | "See the similar scenario, evaluate your own odds." |

Birincisi Türkçede işleyen bir deyim ("bir kağıda bakmak"), İngilizcede tuhaf.
İkincisinde "odds" kumar çağrışımı taşıyor — kanıt-odaklı ses için yanlış
kelime. Öneriler: "Thirty minutes, one page, one clear next step." /
"Find the closest scenario and judge your own case."

## F3 — EN meta yeniden yazılmamış · **P3** ✅ UYGULANDI

`layout.tsx` `META.en.description` TR'nin doğrudan karşılığı. Brand voice çeviri
checklist'i: *"SEO meta bilgileri EN için ayrıca yazılmış mı? (çeviri değil,
yeniden yazım)"*. EN pazarında arama niyeti farklı — "business transformation
consultancy Turkey" gibi terimler TR metnin çevirisinden çıkmıyor.

## F4 — `llms.txt` yalnız Türkçe · **P3** ✅ UYGULANDI

Tek dilde, yalnız TR URL'lerini veriyor ve ölü brief linkini içeriyor. AI
ajanlarına EN sürüm görünmüyor.

---

# G. Persona bazlı kapsam boşlukları

## G1 — Persona 1B'nin ihtiyacı vaat ediliyor, içerik yok · **P2**

1B'nin ana acı noktası: *"bütçeyi haklı çıkaracak iş gerekçesi (business case)
lazım"*. `packages.ts` bunu karşılıyor (ROI projeksiyonu, pilot spec'leri, iç
paydaş yönetimi). Ama sitede tek bir "business case nasıl kurulur", "pilot ROI'si
nasıl hesaplanır" içeriği yok. 1B'nin giriş kanalı Google organik ve sektörel
içerik — o kanalda 3 yazı var, biri ona yakın ("AI pilotu neden başarısız olur?").

## G2 — Persona 2'nin "hız" vaadi kanıtsız · **P2** ⏸ ERTELENDİ (vaka verisi)

2'nin güven tetikleyicisi: *"hızlı başlangıç vaadi, benzer ölçekte marka
referansı"*. Yayındaki tek growth vakası **6 aylık** ve markası anonim. Paket
sayfası hız vaadini veriyor ("4 hafta"), vaka katmanı desteklemiyor.

## G3 — Persona 3 hiçbir yüzeyde yok · **P3**

Scale-up personası (Seed/Series A, 20-100 kişi) ton matrisinde commerce'e
bağlanmış ama `whoFor` eşikleri onu dışarıda bırakıyor: "20M TL+ ciro",
"100-5.000 çalışan". Tek dokunuş MVP Build'in `whoFor` maddesi ("teknik
co-founder yerine hazır mühendislik ekibi arayan kurucu"). Vision doc'un açık
sorusu — *"ayrı funnel mı, organik yan etki mi?"* — fiilen "dışarıda" olarak
cevaplanmış. Bilinçli bir karar olabilir; öyleyse ADR'ye yazılmalı.

## G4 — 1A için vaka formatı eşleşmiyor · **P2** ⏸ ERTELENDİ (vaka verisi)

Vision doc 1A için vaka tipini tanımlıyor: *"hikaye formatı, öncesi/sonrası
anlatımı, **patron'un kendi ağzından alıntı**, somut metrikler"*. Yayındaki dört
vakanın üçünde alıntı yok; olanı "Üretim Direktörü, sanayi şirketi" — patron
değil ve anonim. Format da metrik-önce, hikâye-sonra (yani 1B/2 formatı).
A4 ile birlikte çözülür.

---

# Ne yapıldı — 2026-08-19

## Persona altyapısı

Persona seçimi artık React state'inde değil, **kök elemandaki `data-persona`**
özniteliğinde yaşıyor. Üç parça:

| Parça | Dosya | İş |
|---|---|---|
| Senkron script | `app/layout.tsx` `<head>` | Çerezi ilk boyamadan **önce** okur, `data-persona`'yı yazar |
| CSS seçimi | `globals.css` | Persona-aware metinlerin iki varyantı da DOM'dadır; görünmeyeni gizler |
| Paylaşılan store | `lib/hooks/use-persona.ts` | `useSyncExternalStore` — anahtar çevrildiğinde sayfadaki tüm bölümler aynı anda güncellenir |

Neden React seçmiyor: sunucu persona'yı bilmiyor. React'e bıraksaydık ya
hydration uyuşmazlığı olurdu ya da seçim efekte ertelenip ticaret ziyaretçisi
sanayi metnini bir an görürdü (FOIC). Script + CSS ikisini birden çözüyor ve
**sayfalar statik üretilmeye devam ediyor** — `next build` çıktısında persona-aware
sayfaların hepsi hâlâ `●` (SSG).

`PersonaText` / `PersonaListItems` artık client component değil; hook
kullanmıyorlar. Gizlenen varyant `display:none` olduğu için erişilebilirlik
ağacına da girmiyor (ekran okuyucu iki kez okumuyor — `innerText` ile doğrulandı).

Yeni bileşen: **`PersonaSwitch`** — "Okuma açısı · Sanayi / Ticaret". Beş yerde:
anasayfada "Neden şimdi?" bölümü, `/hizmetler`, `/hizmetler/[slug]`, `/paketler`,
`/vakalar`. Popup çerezinden **ayrı** bir çerez (`indoles_persona`) yazar:
anahtarı popup çerezine yazsaydık merceği çeviren ziyaretçi için
`shouldShowPopup()` 30 gün false döner, lead yakalama akışı sessizce kapanırdı.

## Anasayfa

- **Yeni bölüm:** `WhyNow` (`#v2-whynow`), About ile Pillars arasında. Metin
  `home.unlockPotential`'dan geliyor — yazılmış ama hiç yayınlanmamış copy.
  Blob koreografisine sekizinci durak eklendi (`whynow`: sağ üste çekilip solar,
  iki okuma kolonunu da boş bırakır).
- **Hero dört satıra çıktı:** `RAPOR DEĞİL / SONUÇ / KAMPANYA DEĞİL / SİSTEM`.
  Kanonik cümlenin tamamı. Tek sayılı satırlar sola, çiftler sağa — "X değil / Y"
  paralelliği yerleşimde de duruyor.
  - Mobil punto 12vw → 10vw: en uzun satır 11'den 14 karaktere çıktı, 390px'de
    `white-space: nowrap` ile taşıyordu.
  - Satır 3'ün `accentRange`'i ölçümle bulundu: `[5,14]` blob gövdesinin altında
    "PA" hecesini siyah bırakıyor, satır "KAM…NYADEĞİL" diye okunuyordu → `[3,14]`.
- Hizmet portföyü başlığı: "Bütüncül dönüşüm için uçtan uca uzmanlıklar." →
  "Teşhisten **canlıya**, on iki uzmanlık." Eyebrow'daki "12 disiplin" →
  "12 uzmanlık" (üç satır yukarıda "üç disiplin" yazıyordu).

## Popup

| Ne | Önce | Sonra |
|---|---|---|
| Stage 1 ekseni | İhtiyaç ("AI, Otomasyon ve Teknoloji Dönüşümü Arıyorum") | Kitle ("Sanayi ve üretim" / "Ticaret ve perakende"), ihtiyaçlar madde olarak altta |
| Hitap | "Kimsin?", "seni", "sana", "seç" | "Önce sizi tanıyalım.", dolaylı/siz |
| Birincil CTA | "1 saatlik **ücretsiz** görüşme rezerve et" | "1 saatlik keşif görüşmesi planla" + "Taahhütsüz" |

Slug'lar (`donusum-teknoloji` / `buyume-pazarlar`) değişmedi — çerezde ve e-posta
bildirimlerinde yaşıyorlar. Stage 1'de seçilen persona artık mercek çerezini de
kuruyor, böylece popup kapandığında sayfa doğru tonda kalıyor.

## Sayfa metinleri

| Sayfa | Değişiklik |
|---|---|
| `/hizmetler` | Başlık + lede persona-aware (`pages.services`); "0X — Pillar" → "0X — Disiplin" |
| `/hizmetler/[slug]` | Üç `industrial` sabiti `PersonaText`'e çevrildi (etiket, yöntem paragrafı, 12 hizmet) |
| `/paketler` | Başlık + lede persona-aware (`pages.packages`, ölü `home.packages`'tan taşındı); paket adlarının altına Türkçe karşılık (`descriptor`); tablo kolonu "Pillar" → "Disiplin"; taahhüt notu kişisiz kuruldu |
| `/vakalar` | Başlık + lede persona-aware (`pages.cases`) — alt bölümdeki `CasesSection` başlığıyla çakışmayacak şekilde "nasıl okunur" düzeyinde yazıldı |
| `/iletisim` | Takvim yüklenmezse çıkış veren fallback satırı; EN başlık deyim çevirisi olmaktan çıktı |
| `/danismanlar/[slug]` | "Pillar" etiketi TR'de "Disiplin" |
| Tüm iç sayfalar | "Brief gönder" ikincil CTA'sı `/app/brief/yeni` (404) yerine `/iletisim` |
| Footer | "Ayda bir — teşhis, metot, sonuç." → yayın taahhüdü olmayan hâli |
| `llms.txt` | İki dilli oldu, EN URL'leri eklendi, ölü brief bağlantısı kaldırıldı |

`messages` tarafında: `pages.*` namespace'i eklendi, ölü `home.packages`
kaldırıldı, `finalCta`'daki "AI danışman" vaadi (ADR-007 ile kaldırılan özellik)
gerçek düşük-taahhüt kapısına çevrildi, brief yanıt süresi her yerde "1 iş günü"
oldu. TR sanayi metinlerindeki açıklanmamış anglicizmler Türkçeleştirildi
("use case" → "kullanım senaryosu", "test backlog" → "test listesi",
"spec dokümanı" → "teknik şartname", "as-is" → "mevcut durum (as-is)").

## Doğrulama

```
tsc --noEmit     temiz
vitest run       29 dosya / 123 test geçti, 1 skip
next build       tüm persona-aware sayfalar hâlâ SSG (●)
route smoke      16 route (TR + EN + llms.txt) → 200
tarayıcı         1440×900 ve 390×844; hero dört satır, mercek anahtarı iki yönde
                 çalışıyor (anasayfada çevrilen mercek Pillars'ı da anında
                 değiştiriyor), konsolda hydration hatası yok
```

**Dikkat:** `WhyNow` bölümündeki metrikler (`%12-18`, `8 hafta`, `%30-50`,
`4 hafta`) `home.unlockPotential`'dan geldiği gibi yayına girdi. Aralık + bağlam
formatında yazıldıkları için B5'teki "ortalama" sorunu yok, ama rakamların
kendisi hâlâ doğrulanmadı — vaka verisiyle birlikte teyit edilmeli.

---

# Uygulama sırası önerisi

Sıralama ölçütü: yanlış kitleye konuşan veya kırık olan metin önce, derinlik
sonra.

Aşağıdakilerin tamamı Burak'ın vereceği malzemeye bağlı. Sıralama, malzeme
geldiğinde hangisinin önce yapılacağını söyler.

| Sıra | İş | Bulgu | Neden bu sırada |
|---|---|---|---|
| 1 | Gerçek telefon + Londra/Dubai teyidi | B6 | Placeholder numara her sayfanın üst şeridinde ve tıklanabilir |
| 2 | Kadro: mühendislik/veri profilleri, slider metni, köpeğin yeri | B1, B2, B3, D7 | En büyük vaat uçurumu; 1A'nın ilk baktığı sayfa |
| 3 | Vaka metriklerinin doğrulanması + pillar iddialarının aralığa çevrilmesi | B5 | 1B'nin ilk sorgulayacağı tablo; grafik/vurgu bundan sonra |
| 4 | Logo–vaka ilişkisinin açıklanması, en az bir referanslı vaka izni | B4 | İsimli logo + anonim vaka gerilimini tek paragraf çözüyor |
| 5 | Vakaları persona-aware yap (`lead` + `outcome`) ve 1A için hikâye formatı | A4, G4, G2 | Yeni vaka metni yazılırken aynı anda yapılmalı, sonradan değil |
| 6 | Bülten: liste entegrasyonu veya vaadin tamamen kaldırılması | E2 | Şu an metin nötr; kalıcı karar senin |
| 7 | 1B için business-case içeriği, Persona 3 kararı | G1, G3 | İçerik üretimi ve ADR konusu |

**Ayrıca açık kalan iki teknik borç:** `/iletisim`'deki Cal.com bağlantısı hâlâ
404 (fallback metni eklendi ama embed çalışmıyor), ve `/vakalar` sayfası dört
vakayı iki kez listeliyor (üstte kronolojik, altta `CasesSection`) — ikincisi
ADR-017 kararının yan etkisi, yapısal bir düzeltme gerektiriyor.
