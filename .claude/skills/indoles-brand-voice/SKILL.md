---
name: indoles-brand-voice
description: >
  INDOLES marka sesi ve ton denetleyicisi. Kullanıcıya görünecek herhangi bir TR veya EN metin
  üretirken/güncellerken (hero, headline, body copy, CTA, e-mail, chatbot diyaloğu, OG/meta,
  sosyal post, error/empty/success state, form label/help, button, paket açıklaması, vaka
  özeti, danışman bio, journal yazısı, alt metin) bu skill ZORUNLU çağrılır. docs/03'teki
  voice (eğitici-somut-fiil-ağır-kanıt-odaklı) ve docs/01'deki iki persona (Sanayici dingin,
  Ticaret dinamik) kurallarını uygular, anti-pattern'leri (hype, ünlem, anglicism, klişe,
  "yolculuk/çözüm/eşsiz/kapsamlı", "lütfen doldurunuz", emoji-in-copy) reddeder. Persona-aware
  sayfalarda iki versiyon (sanayici + ticaret) birden üretir; statik sayfalarda orta ton.
  Tetikleyici cümleler: "copy yaz", "metin üret", "headline öner", "CTA yaz", "hero kopyası",
  "açıklama metni", "paket içeriği yaz", "vaka çalışması yaz", "blog yaz", "ton kontrol et",
  "bu metni gözden geçir", "TR/EN metin", veya bir component/sayfa içinde literal string yazımı.
---

# INDOLES Brand Voice & Tone Skill

INDOLES'in yazılı iletişimini docs/01-vision-positioning.md, docs/02-information-architecture.md ve docs/03-brand-voice-tone.md'ye sadık tutar. Her metin için önce bağlamı çöz, sonra kuralları uygula, sonra üret, sonra anti-pattern lint'inden geçir.

## Adım 0 — Otorite Kaynakları Yükle

Bu skill çağrıldığında HER ZAMAN şu üç dosya açılır ve aktif kullanılır:

1. `docs/01-vision-positioning.md` — Manifesto, iki eksen vaadi, persona profilleri, çatı hikayesi
2. `docs/02-information-architecture.md` — Sayfa tipolojisi, hangi sayfa hangi tonda
3. `docs/03-brand-voice-tone.md` — Voice tanımı, üç ton profili, kelime listesi, anti-pattern'ler

Hafızadan değil, dosyadan oku — değişmiş olabilir.

## Adım 1 — Bağlamı Çöz

Üç soruyu cevapla, sonra üretime geç:

| Soru | Olası Cevap | Sonuç |
|------|-------------|-------|
| Sayfa tipi? | Homepage / Pillar landing / Hizmet detay / Paket / Vaka / Journal / Araç / Danışman / Brief / Form / Footer / Modal / Email | Ton seçimini belirler |
| Persona-aware mi? | Çift versiyon (Homepage, Pillar, Vakalar) — Tek versiyon (diğerleri) | Çıktı sayısını belirler |
| Hangi ton? | Sanayici (dingin-kurumsal) / Ticaret (dinamik-atletik) / Orta | Kelime, ritim, sıfat oranı, metrik kullanımı |

`docs/03` Bölüm 1'deki sayfa-ton matrisini referans al — tahmin etme, oradan oku.

## Adım 2 — Voice Pusulası (Her Metin İçin)

Bir metin INDOLES sesindedir ancak ve ancak şu üç fiilden EN AZ BİRİNİ taşıyorsa:

- **Öğretiyor mu?** Okuyucuya bir bilgi, bir model, bir framework aktarıyor mu?
- **Kanıtlıyor mu?** Somut veri, vaka, metrik, süreç adımı sunuyor mu?
- **Ölçülebilir mi?** Sonucu sayısal/zamansal/yapısal olarak çerçeveliyor mu?

Üçü de yoksa metin sıfırdan yazılır. "Güzel cümle" değil, "öğreten, kanıtlayan veya ölçen cümle" hedeftir.

## Adım 3 — Ton Profilini Uygula

### 3a. Sanayici Tonu (Dingin-Kurumsal)

| Boyut | Hedef |
|-------|-------|
| Cümle uzunluğu | 15-25 kelime ağırlıklı |
| Aktif/pasif ses | %70-80 aktif |
| Sıfat oranı | Düşük — sıfat yerine fiil + somut isim |
| Veri | Her iddia somut sayıyla destekli |
| Bağlaç | "çünkü", "ancak", "dolayısıyla" — duygusal bağlaç yok |
| Paragraf açılışı | Gözlem / veri / soru — sıfat veya genelleme yok |
| Karakter | McKinsey raporunun disiplini + iyi mühendislik dokümanının netliği, ikisinin de soğukluğu olmadan |

### 3b. Ticaret Tonu (Dinamik-Atletik)

| Boyut | Hedef |
|-------|-------|
| Cümle uzunluğu | 8-18 kelime, ritmik, kısa cümleler art arda olabilir |
| Aktif/pasif ses | %90+ aktif |
| Sıfat oranı | Çok düşük — sıfat yerine metrik |
| Veri | Metrik cümlenin öznesi olur ("CAC %47 düştü") |
| Bağlaç | "ama", "ve", "çünkü" — kısa keskin |
| Paragraf açılışı | Metrik / soru / kısa gözlem |
| Karakter | Shopify erişilebilirliği + Stripe netliği + a16z cesareti, hiçbirinin kibri olmadan |

### 3c. Orta Ton (Statik Sayfalar)

| Boyut | Hedef |
|-------|-------|
| Cümle uzunluğu | 12-22 kelime |
| Aktif/pasif ses | %80 aktif |
| Veri | Veri var ama cümlenin başlığı değil |
| Hitap | "Siz" yerine dolaylı ("Markanız için" değil "Markalar için") |
| Enerji | Orta — ne uyuşuk ne heyecanlı, bilgilendirici |

## Adım 4 — Anti-Pattern Lint (HER ÇIKTI ÜZERİNDE)

Üretilen metni şu listeden geçir. Bir tane bile yakalanırsa, o cümle yeniden yazılır.

### 4a. Yasaklı Kelimeler ve Kalıplar

| Kategori | Yasak | Yerine |
|----------|-------|--------|
| Hype/abartı | "muhteşem", "eşsiz", "harika", "olağanüstü", "devrim", "next-gen" | Somut iddia + veri |
| Boş sıfat | "kapsamlı", "yenilikçi", "kaliteli", "profesyonel", "özel olarak tasarlanmış", "stratejik" | Belirgin kapsam, ölçü, isim |
| Klişe | "geleceğe taşıyın", "yolculuk", "çözüm", "deneyim", "potansiyelinizi açın", "başarı hikayesi" | Somut fiil + isim |
| Satışçı baskı | "hemen", "kaçırmayın", "sınırlı süre", "fırsat", "MUHTEŞEM" | Davet eden net cümle |
| Pasif/kurumsal ağdalık | "sunmaktayız", "yardımcı olmaktayız", "lütfen ... doldurunuz", "iletişime geçiniz" | Aktif, doğrudan |
| Anglicism | "campaign", "case study", "deadline", "meeting", "performance" (TR metinde) | "kampanya", "vaka çalışması", "son tarih", "görüşme", "performans" |
| Emoji-in-copy | Markdown veya copy içinde emoji | Yok — emoji yalnızca işlevsel UI ikon olarak |
| Ünlem | "!" cümle sonu | Nokta. (Bilinçli istisna gerektirir, gerekçe yaz) |
| Büyük harf yığını | "MUHTEŞEM", "ŞİMDİ" | Sentence case |

### 4b. Cümle Yapısı Lint'i

| Kontrol | Geçer | Düşer |
|---------|-------|-------|
| Cümle bir gözlem/veri/soru ile mi açıyor? | Evet | Hayır → yeniden aç |
| Aktif ses mi? | %80+ | Pasif yığını → fiilleri aktif yap |
| Her iddianın bir kanıt cümlesi var mı? | Evet | Hayır → veri ekle veya iddiayı kaldır |
| Sıfat-yoğun mu? | Cümle başına 0-1 sıfat | 2+ sıfat → birini at, yerine fiil/metrik |
| Tekrar var mı? | Yok | Aynı kelime 2 cümlede tekrar → eşanlamlı veya yeniden yapılandır |

### 4c. Ton-Persona Uyumu

Üretilen ton, sayfa için doğru ton mu? Sanayici sayfasına ticaret tonu, ticaret sayfasına sanayici tonu yazılırsa metin reddedilir. `docs/03` Bölüm 1'deki matristen kontrol et.

## Adım 5 — TR + EN Eşitliği

Hem TR hem EN üretilirken:

- **Anlam paritesi:** İki dildeki metin aynı vaadi, aynı veriyi, aynı ton'u taşımalı — birebir çeviri değil, eşdeğer üretim
- **Uzunluk paritesi:** EN versiyon TR'den ±20% sapabilir; daha fazla sapma yapısal yeniden düşünme gerektirir
- **Marka terimleri sabit:** "Growth", "Transform", "Build", "INDOLES" iki dilde de aynı yazılır
- **CTA paritesi:** "Görüşme rezerve et" ↔ "Book a meeting" gibi onaylı CTA çiftlerini kullan
- **Persona switch ifadeleri:** Aynı persona çapraz dilde aynı tonda

## Adım 6 — Persona-Aware Çift Versiyon Üretimi

Homepage, Pillar landing veya Vakalar sayfası için copy üretiliyorsa, çıktıda her iki versiyonu da ver:

```markdown
### Sanayici Versiyonu (TR)
{dingin-kurumsal ton}

### Ticaret Versiyonu (TR)
{dinamik-atletik ton}

### Industrial Version (EN)
{calm-corporate tone}

### Commerce Version (EN)
{dynamic-athletic tone}
```

Sanity'ye yazılacaksa schema'da `persona` alanı ile etiketle (bkz. `docs/10-content-model-sanity.md`).

## Adım 7 — Çıktı Formatı

Her copy çıktısı şu yapıda sunulur:

```markdown
## Bağlam
- Sayfa tipi: {tip}
- Persona-aware: {evet/hayır}
- Ton: {sanayici / ticaret / orta}

## Copy

### {Versiyon adı}
{metin}

## Voice Checklist
- [ ] Öğretiyor / Kanıtlıyor / Ölçüyor (en az biri)
- [ ] Anti-pattern lint geçti
- [ ] TR ↔ EN paritesi tamam (eğer iki dil de üretildiyse)
- [ ] Persona-ton uyumu doğru
- [ ] Cümle yapısı lint geçti
```

## Karakter Sınırları (Kanal Bazlı)

| Konum | Max Karakter | Not |
|-------|-------------|-----|
| `<title>` | 60 | Google SERP kesim |
| `<meta description>` | 160 | Google SERP kesim |
| OG title | 60 | Sosyal kart |
| OG description | 90-110 | LinkedIn/X'te kesilmesin |
| Hero headline | 60 (display-2xl scale ile 1-2 satır) | docs/04'teki tipografi scale referansı |
| Hero subhead | 140 | 2-3 satır |
| CTA button | 18-22 | Tek-iki kelime ideal |
| Section headline | 80 | 1-2 satır |
| Card title | 50 | 1 satır |
| Form label | 30 | Tek satır |
| Toast message | 100 | 1-2 satır |
| Email subject | 50 | Inbox preview |

## "Açık Sorular" Disiplini

Her copy çıktısının sonunda, kararlarda boşluk gördüğün yerleri "Açık Sorular" başlığı altında listele. Tahmin etme, sor (CLAUDE.md Bölüm 3 — "Tahmin etme, sor").

## Subagent Kullanımı

Bu skill `indoles-copy-editor` ajanı tarafından da çağrılır. Ajan dispatch edildiğinde, kendisi de bu SKILL.md'yi okur ve her copy çıktısı üzerinde uygular — skill'in disiplini "ajan davranışı" değil, "metin üretim protokolü"dür.
