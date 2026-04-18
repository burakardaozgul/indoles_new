# ADR-014 — Conversion-Kritik Yüzeylerde Tam Persona Adaptivity

**Statü:** Accepted
**Tarih:** 2026-04-18
**Karar veren:** Burak Arda Özgül (Kurucu/CTO)
**Etkilenen dosyalar:** `docs/03-brand-voice-tone.md`, `docs/02-information-architecture.md`, `src/lib/content/packages.ts`, `src/lib/content/pillars.ts`, `src/components/marketing/*.tsx`, `messages/tr.json`, `messages/en.json`

---

## Bağlam

Mevcut brand-voice kararında (`docs/03-brand-voice-tone.md` §1 ve §3) persona-aware copy yalnızca homepage, pillar landing ve vaka sayfalarında uygulanıyor; hizmet listeleme, paket listeleme ve paket detay sayfaları "orta ton / tek versiyon" olarak tanımlandı. Homepage'de persona switch Task 23 kapsamında hero için uygulandı; kalan 4 section (Pillars, Proof, Packages, FinalCTA) hâlâ tek tonda çalışıyor.

İki gerilim ortaya çıktı:

1. **Brand diferansiasyon gücünün sayfa ömrü boyunca korunamaması.** Hero'da "Sanayi / Ticaret" switch'i yapan ziyaretçi, hemen altındaki section'larda orta tona düşünce persona vaadinin tutarlılığını kaybediyor. Hero'daki ayrıştırıcı enerji conversion'a kadar taşınmıyor.
2. **Paket satın alma psikolojisinin persona-spesifik ayrışması.** Sanayici alıcı paket kararında ROI projeksiyonu, benzer-ölçekli vaka benchmark'ı ve metodolojinin metodik şeffaflığını öncelikler; ticaret alıcısı hız, metrik ve "ne kadar sürede neyi göreceğim" netliğini öncelikler. Orta ton ikisine de "tam" konuşamıyor — paket gibi conversion-kritik yüzeylerde bu istenmiyor.

Karar verilmezse: homepage'deki persona switch yatırımı ROI üretmeden kalır (switch sonrası deneyim homojenleşir); paket sayfaları generic bir satış dili taşır; brand voice'un "iki alıcıyı iki farklı dille karşılama" vaadi yalnızca hero'ya sıkışır.

Kısıt olarak: 12 hizmetin her biri × 2 persona × 2 dil = 48 versiyon hizmet-detay copy'si yaratmak bakım yükü üretir ve hizmet-detay sayfaları orta kapsamlı bilgi sayfalarıdır (persona etkisi paket kadar conversion-kritik değildir).

## Değerlendirilen seçenekler

### A) Full persona adaptivity — conversion-kritik yüzeyler persona-aware (seçilen)

- Homepage'in tamamı (hero + 4 section) persona-aware.
- Hizmet listeleme (`/hizmetler`) hero + 3 pillar blok + 12 hizmet shortDescription persona-aware.
- Paket listeleme (`/paketler`) hero + 4 paket kartı outcome copy persona-aware.
- Paket detay (`/paketler/[slug]`) summary, scope, deliverables, whoFor, faq alanları persona-aware.
- Hizmet detay sayfaları orta ton kalır (12 × 2 × 2 bakım yükü ve ton tekrarı riski yüksek).
- Vaka, journal, araç, danışman, brief, yasal sayfalar mevcut kararına göre devam eder.
- Trade-off: conversion yüzeyinde copy hacmi yaklaşık 2x, bakım yükü artar ama kontrollü yüzey kümesinde kalır.

### B) Sadece hero/landing persona-aware (status quo) — reddedildi

- Mevcut durum: homepage hero + pillar landing + vaka persona-aware; hizmet listeleme, paket, kalan homepage section'ları orta ton.
- Artı: minimum bakım yükü, hızlı üretim.
- Eksi: persona switch'in etkisi sayfa ömrü boyunca taşınmıyor; paket konusyon yüzeyinde generic dil; Task 23 yatırımı yarı kullanılmış kalıyor.
- Reddedildi: brand diferansiasyon vaadi conversion noktasında kırılıyor.

### C) Tüm sayfalar persona-aware (hizmet detayları dahil) — reddedildi

- Her sayfa tipi persona'ya göre çift versiyonda yazılır (hizmet detayları, journal, danışman, araç dahil).
- Artı: maksimum diferansiasyon, tüm site "aynı iki sesle" konuşur.
- Eksi: 12 hizmet × 2 persona × 2 dil × (hero + problem + yaklaşım + sonuç + FAQ ~5 blok) → yaklaşık 240 copy bloğu bakım yükü. Journal ve araçlar için "yazar sesi" ile "persona sesi" çatışır. Ton tekrarı riski yüksek (aynı hizmetin iki versiyonu çoğu bölümde birbirinin yakın kopyası olur, diferansiasyon kaybı).
- Reddedildi: bakım/değer oranı olumsuz, ton tekrarı brand'in "kanıt-odaklı" fiil diline zarar verir.

## Karar

**A seçildi.** Conversion-kritik yüzeyler (homepage tüm section'lar, hizmet listeleme, paket listeleme, paket detay) persona-aware çift versiyonla yazılır. Hizmet detay sayfaları orta ton / tek versiyon olarak korunur. Vaka, journal, araç, danışman, brief, hakkımızda, yasal sayfalar için mevcut ton matrisi kararı değişmez.

## Gerekçe

1. **Brand switch'in yaşatılması.** Persona switch homepage hero'da yapılan bir "kimlik bildirimi"dir. Altındaki Pillars/Proof/Packages/FinalCTA ile hizmet-listeleme ve paket yüzeyleri bu bildirimin tutarlı devamı olmadan switch yatırımı ROI üretmez.
2. **Conversion psikolojisi ayrışıyor.** Sanayici paket kararında ROI projeksiyonu + benzer-ölçek vaka + metodik süreç arıyor; ticaret hız + metrik + "kaç haftada etkisini göreceğim" arıyor. Orta ton iki tarafa da %70 konuşur, ikisine de tam konuşamaz. Conversion-kritik noktada bu kabul edilmiyor.
3. **Bakım yükü kontrollü yüzeyde tutuluyor.** Hizmet detay 12 × 2 × 2 = 48 versiyon bakımı yerine; paket detay 4 paket × 2 persona × 2 dil = 16 versiyon ve paket listeleme 4 kart × 2 persona × 2 dil = 16 versiyon gibi sınırlı bir kümeyle çalışılıyor. Paketler nispeten nadir değişir (yılda 1-2 revizyon), hizmetler daha stabil kalır.
4. **Ton tekrarı riski düşük tutuluyor.** Hizmet detay sayfalarında aynı "süreç + yaklaşım + çıktı" bloğunun iki persona versiyonu ton tekrarı üretir ve editorial dilin "fiil-ağır, sıfat-hafif" kuralına zarar verir. Orta ton bu riski sıfırlıyor.
5. **B reddedildi** çünkü homepage hero altındaki section'larda switch etkisinin kopması tasarım kararının kendisini yarıda bırakıyor. **C reddedildi** çünkü hizmet detay sayfalarında diferansiasyon değerine oranla bakım yükü orantısız ve ton kalitesi riski yüksek.

## Sonuçlar

### Pozitif

- Persona switch yatırımı conversion noktasına kadar tutarlı şekilde taşınıyor; switch'in ölçülebilir bir conversion etkisi olabilir (PostHog'ta persona × paket görüntüleme × CTA tıklama funnel'ı izlenebilir).
- Paket detay sayfalarında satın alma psikolojisine spesifik kopya; sanayiciye ROI + benchmark, ticarete hız + metrik dili.
- Homepage altındaki section'lar hero ile aynı "nefes"i alıyor (Pillars, Proof, Packages, FinalCTA persona-aware).
- Hizmet detay ve diğer stabil yüzeyler orta tonda kalarak bakım yükünden korunuyor.

### Negatif / trade-off

- Copy hacmi conversion yüzeyinde yaklaşık 2x — yazım, çeviri, QA maliyeti artıyor.
- `messages/{tr,en}.json` yapısında persona alanı (`industrial` / `commerce`) tutarlı şekilde ölçeklenmeli; key naming disiplini kırılırsa bakım karışır.
- Persona switch sonrası cookie-based state yönetiminin tüm conversion yüzeylerinde SSG + hydration ile tutarlı çalışması gerekiyor — yanlış hydration FOUC veya yanlış-persona-flash riski üretir.
- Paket sayfalarında ton farklılaşması vaka/hizmet referansları ile çeliştiğinde okuyucuda kesiklik oluşabilir; içerik editörünün bu yüzeylerde persona tutarlılığını elden düşürmemesi gerekir.

### Yeniden değerlendirme tetikleyicileri

Aşağıdaki durumlardan biri gerçekleşirse ADR yeniden açılır:

- İçerik bakım yükü ekip kapasitesini aşarsa (örn. paket sayısı 4'ten 10'a çıkarsa, her paket değişikliği 4 versiyon güncellemesi gerektirdiği için breaking point'e gelinir).
- 12+ ay sonra PostHog analytics'inde persona switch seçiminin paket conversion oranı, brief gönderimi veya rezervasyon oranı üzerinde ölçülebilir bir fark (örn. ≥%15 delta) yaratmadığı görülürse — yatırımın ROI'si kanıtlanamıyor demektir, C veya B'ye geri dönülebilir.
- Paket yüzeyinde persona-aware kopyanın marka sesinin tutarlılığını bozduğu (tone drift, ton tekrarı, persona çatışması) QA sürecinde tekrar tekrar tespit edilirse.
- Hizmet detay sayfalarının orta tonda kalması bu proje için kesin karardır; tekrar değerlendirme konusu değildir. Gelecek bir projede (ör. farklı kapsamlı yeni bir ürün sitesi) aynı soru ayrı bir ADR ile açılır.

## Implementasyon notları

Sıralama Burak'ın onayından sonra fazlar halinde:

- **Faz B — Homepage tamamlama:** Task 23'ün kapsamı Pillars, Proof, Packages, FinalCTA section'larını kapsayacak şekilde genişletilir. `messages/{tr,en}.json` içinde `home.pillars.industrial` / `home.pillars.commerce` gibi namespace ayrımı kurulur.
- **Faz C — Hizmet listeleme + Paket listeleme:** `/hizmetler` ve `/paketler` sayfaları persona-aware hero + kart copy'lerine geçirilir. `src/lib/content/pillars.ts` ve `src/lib/content/packages.ts` içeriklerinde `shortDescription` ve outcome alanları `{ industrial, commerce }` şekline dönüşür.
- **Faz D — Paket detay:** `/paketler/[slug]` sayfalarında `summary`, `scope`, `deliverables`, `whoFor`, `faq` alanları `{ industrial, commerce }` varyantlarıyla yazılır. 4 paket × 2 persona × 2 dil = 16 set paket detay copy'si üretilir.

Rollback: Persona-aware yapıyı bozmadan geri almak için `industrial` ve `commerce` alanlarının ikisi de aynı metinle doldurulabilir (tek versiyonlu davranışa düşer). `messages/*.json` şeması aynı kalır, yalnız içerik duplicate olur.

## Referanslar

- `CLAUDE.md` Bölüm 5 — Persona-Driven Homepage, iki eksen audience switch
- `docs/01-vision-positioning.md` — persona tanımları, ton gerilimi
- `docs/03-brand-voice-tone.md` §1 İçerik Versiyonu Kararı, §3 Ton Matrisi (bu ADR ile güncellenecek)
- `docs/02-information-architecture.md` — sayfa haritası, homepage section sırası, persona switch sonrası adaptif içerik
- ADR-003 — Cinematic Hero Zone (persona switch'in tasarım çerçevesi)
- Önceki persona-aware kapsam: Task 23 (homepage hero)
