# ADR-018 — 12 Hizmet Detay Sayfası

> **Durum:** Kabul edildi
> **Tarih:** 2026-08-20
> **Karar sahibi:** Burak Arda Özgül
> **Bağlı belgeler:** `docs/superpowers/specs/2026-08-19-hizmet-detay-sayfalari-design.md`, `docs/08-seo-i18n-strategy.md`, `docs/03-brand-voice-tone.md`, `docs/16-service-pages-seo-audit.md`
> **İlişkili kararlar:** ADR-014 (persona adaptivitesi), ADR-015 (tasarım sistemi v2), ADR-017 (site geneli v2 migrasyonu)

---

## Bağlam

Anasayfadaki hizmet portföyü 12 uzmanlık gösteriyordu ama her kartın bağlantısı hizmete değil **pillar sayfasına** gidiyordu. Ziyaretçi "Performans pazarlama"ya tıklayıp beş hizmetin listelendiği bir disiplin sayfasına düşüyor, aradığı hizmetin tek cümlelik açıklamasını ikinci kez okuyordu.

Üç sonucu vardı:

1. **Dönüşüm** — satın alma niyeti hizmet düzeyinde oluşuyor, ziyaretçi niyetini ifade ettiği anda genelleştirilmiş sayfaya gönderiliyordu.
2. **SEO** — "performans pazarlama ajansı", "iş zekası danışmanlığı" gibi ticari niyetli sorguların ineceği sayfa yoktu; 12 uzmanlık tek `/hizmetler/{pillar}` sayfasında yarışıyordu.
3. **GEO** — AI motorları hizmet düzeyinde soru alıyor, alıntılayacak kendine yeten pasaj bulamıyordu.

---

## Kararlar

### 1. Düz URL, locale başına slug

`/tr/hizmetler/{slug}` ve `/en/services/{slug}`. Pillar sayfaları aynı route'ta kalır; slug önce pillar, sonra hizmet olarak çözülür.

Slug'lar locale başına ayrıdır (`performans-pazarlama` ↔ `performance-marketing`) — EN tarafında gerçek arama hacmi olan terim kullanılır. Çapraz locale slug'ı **404 döner**: iki URL'in aynı içeriği sunması canonical sinyalini bölerdi.

İç içe yapı (`/hizmetler/growth/performans-pazarlama`) reddedildi: hizmeti pillar'a kalıcı çiviler ve pillar değişiminde 301 gerektirir. Hiyerarşi breadcrumb ve `BreadcrumbList` JSON-LD'de ifade edilir.

### 2. Hizmet detay sayfaları tek sesli

Sayfalar baştan sona **orta tonda** yazılır; persona bileşenleri (`PersonaText`, `PersonaListItems`, `PersonaSwitch`) kullanılmaz.

Bu, `docs/03-brand-voice-tone.md` §1 ton tablosunun ve ADR-014 notunun zaten verdiği karardır. İlk tasarımda iki persona slotu öneriliyordu; belgeyle çeliştiği tespit edilince belgeyi değiştirmek yerine belgeye uyuldu.

Bağımsız ikinci gerekçe GEO tarafından geldi: `PersonaText` her iki varyantı da DOM'a basar (`globals.css` persona merceği). Persona-aware bir detay sayfası indekslenebilir metni şişirir, yan yana çelişen cümleler üretir ve `FAQPage` şemasının "görünen metinle eşleşme" kuralını ihlal eder.

`shortDescription` persona-aware **kalır** — ama detay sayfasında değil, `/hizmetler` listesinde ve anasayfa kartında render edilir.

**Uygulama:** audit script'i persona metnini eşik değil **ihlal** olarak ölçer; hizmet detayında `[data-persona-variant]` bulunması FAIL'dir. Bir bileşen ileride sessizce persona metni sızdırırsa yakalanır.

### 3. Uydurma metrik yok

Hizmet düzeyinde performans metriği (ROAS, CAC, yüzde artış) yazılmaz. Doğrulanamayan sayı GEO'da özel olarak riskli: AI motoru ya pasajı atar ya da iddiayı yanlış atfeder.

İlk tasarımda olgusal bir taahhüt şeridi (tipik süre · ekip şekli · giriş paketi) vardı; pilot gate'inde gereksiz bulunup kaldırıldı, `commitments` alanı tipten de silindi. Doğrulanabilir hizmet metriği geldiğinde metrik şeridi yeni bir alanla eklenebilir.

### 4. Tek kaynak: `content/services/`

`PillarContent.services` alanı kaldırıldı; hizmet listesi `getServicesByPillar()` ile türetilir. Kart metni iki yerde tutulursa detay sayfasıyla sessizce ayrışırdı.

`SERVICE_ORDER` **sabit ve tam** 12 elemanlı kanonik listedir — `SERVICES` onun alt kümesi. Sıra yazılan içerikle birlikte büyüseydi, `ServiceIllustration` diyagram indeksi ve "kaçıncı / kaç" göstergesi önceden yazılmış sayfalarda sessizce kayardı (pilot aşamasında bizzat yaşandı).

### 5. Üçüncü taraf marka logoları kendi renginde

Hizmet hero'sundaki mecra rozetleri (Google Ads, Meta, LinkedIn, TikTok…) **orijinal marka renkleriyle** basılır.

Bu, ADR-015'in tek accent disiplininin bilinçli ve tek istisnasıdır: üçüncü taraf marka işareti kendi rengiyle tanınır, monokrom hâli tanınırlığı öldürüyordu. Bu renkler INDOLES paletine girmez, yalnız `lib/design/platform-icons.tsx` kaydındaki rozetlerde yaşar.

İçerik katmanı yalnız mecra **adı** tutar; logo eşlemesi kayıtta çözülür. Kaydı olmayan isim logo yerine metin rozetine düşer — marka logosu elle çizilmez.

### 6. `SITE_URL` tek kaynağı

`robots.ts` ve `sitemap.ts` production adresine düşerken `layout.tsx` `metadataBase`i `localhost:3000`e düşürüyordu. `NEXT_PUBLIC_APP_URL` tanımsız bir production build'de sitemap doğru adresi, sayfaların canonical ve OG etiketleri `localhost`u gösterirdi.

Varsayılan artık `src/lib/seo/site.ts`te tek yerde; üç tüketici de oradan okur.

---

## Sonuçlar

**Kazanılan**

- 12 hizmetin her biri için ticari niyetli sorgunun inebileceği, tek başına ayakta duran sayfa (24 URL).
- Yeniden kullanılabilir SEO katmanı (`src/lib/seo/`): paket, vaka ve yazı sayfaları aynı kütüphaneyi kullanabilir.
- Topikal küme: `/hizmetler` → pillar → hizmet zinciri, her hizmetten üç komşuya bağlantı.
- `llms.txt` 24 hizmet URL'ini veriden türeterek yayınlar (önceden yalnız isim sayıyordu, link vermiyordu).
- Eski WordPress sayfalarından 7 kalıcı yönlendirme — link equity korunur.
- Polish turunda bulunan üç **site geneli** hata düzeldi: `<html lang>` eksikliği (Türkçe uppercase bozukluğu), blob kanvasının tüm tıklamaları yutması, popup açıkken imlecin kaybolması.

**Ödenen bedel**

- İki yeni bağımlılık: `simple-icons` (marka logoları — elle çizilemez), `cheerio` + `tsx` (audit script'i).
- 12 içerik dosyası bakım yükü: bir hizmetin kapsamı değişirse dosyası güncellenmeli.
- `PillarContent.services` kaldırıldığı için pillar verisini kullanan her yeni tüketici `getServicesByPillar()` çağırmalı.

**Kapsam dışı bırakılanlar**

- Paket, vaka, yazı ve danışman sayfalarının metadata'sı — `lib/seo` genel yazıldı, uygulanması ayrı iş.
- Dinamik OG görseli (`/api/og`) — docs/08 §7.2'de planlı.
- Hizmet düzeyinde performans metriği — veri geldiğinde (§3).

---

## Doğrulama

| Kontrol | Sonuç |
|---|---|
| `pnpm typecheck` | temiz |
| `pnpm test` | 206 test |
| `pnpm lint` | 0 hata |
| `pnpm test:e2e hizmet-detay` | 31 test |
| `pnpm build` | 98 statik sayfa |
| `pnpm seo:audit --all` | 24 sayfa PASS |
| Production sunucu | 27 URL 200, bilinmeyen slug 404 |
