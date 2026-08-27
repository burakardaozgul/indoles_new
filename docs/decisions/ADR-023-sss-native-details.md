# ADR-023 — SSS'ler native `<details>` ile açılır kapanır kalır

- **Durum:** Kabul edildi
- **Tarih:** 2026-08-25 (geriye dönük kayıt: 2026-08-27)
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** SSS genişletme dalgası (2026-08-24) sonrası · `docs/19-seo-geo-audit-2026-08-27.md` bulgu G-12
- **İlgili:** ADR-022 (paket SSS'leri tek ses), ADR-018 (hizmet sayfaları), `docs/08-seo-i18n-strategy.md` §8.1
- **Etkilenen dosyalar:** `src/components/marketing/faq-accordion.tsx`, `docs/17-seo-geo-audit-2026-08.md` §12 (düzeltme notu)

---

## Bağlam

2026-08-24 SSS dalgası her yüzeyin soru sayısını Burak'ın talimatıyla ≥10'a
çıkardı: hizmetlerde 5 → 11-13, makalelerde 4 → 10-11, paketlerde 1-2 → 11,
vakalarda 0 → 10-12, pillar'larda 0 → 11. Toplam 44 yüzey, ~700 soru-cevap
metni ve her cevap ≥40 kelime (kural `services-content.test.ts`'te kodlu).

Aynı dalga sırasında paket SSS'leri `<details>`'ten çıkarılıp açık `<dl>`'ye
alındı; gerekçe "kapalı içeriği AI motorları ve ekran okuyucular atlayabilir"
idi ve `docs/17` §12'ye böyle kaydedildi. Ancak bu değişiklik uygulandığında
soru sayısı henüz üç katına çıkmamıştı.

Sayı arttıktan sonra ortaya çıkan gerçek: **her cevap ≥40 kelime × 11 soru =
sayfa başına ~500-700 kelimelik kesintisiz açık metin bloğu.** Hizmet
sayfasının kendi gövdesi zaten ~950 kelime; SSS açık listeyken sayfanın yarıdan
fazlası tek bir soru-cevap duvarına dönüyordu. Ziyaretçi kendi sorusunu
tarayamıyor, sayfa sonundaki CTA'ya ulaşmak için uzun bir metin bloğunu
geçmek zorunda kalıyordu.

Karar verilmezse: ya SSS sayısı düşürülecekti (GEO kaybı — alıntılanabilir
pasaj sayısı azalır) ya da sayfa okunabilirliği feda edilecekti.

## Değerlendirilen seçenekler

### A) Açık `<dl>` — tüm cevaplar görünür
- Artı: içerik hem ham HTML'de hem görsel olarak açık; hiçbir crawler ve ekran okuyucu atlayamaz
- Artı: Lighthouse'un erişilebilirlik ağacı denetimlerinde belirsizlik yok
- Eksi: **sayfa başına 500-700 kelimelik açık blok** — 44 yüzeyin tamamında okunabilirlik çöküyor
- Eksi: ziyaretçi kendi sorusunu tarayamıyor; SSS bir referans yüzeyi olmaktan çıkıp dolgu metnine dönüşüyor

### B) JavaScript akordiyon (Radix Accordion vb.)
- Artı: en zengin etkileşim, animasyon kontrolü
- Eksi: **kapalı içerik DOM'a hiç girmez veya `aria-hidden` ile gizlenir** — JS çalıştırmayan crawler'lar (GPTBot, ClaudeBot, PerplexityBot, CCBot) cevap metnini hiç göremez
- Eksi: GEO stratejisinin hedef kitlesi tam olarak bu crawler'lar (`docs/08` §5, strateji §5)
- Eksi: ek bağımlılık ve hidrasyon maliyeti; sayfalar SSG kalmalı

### C) Native `<details>` / `<summary>`
- Artı: açılır kapanır — okunabilirlik sorunu çözülür
- Artı: **kapalıyken bile cevap metni ham HTML'de tam olarak durur** — JS çalıştırmayan crawler'lar okur (curl ile doğrulandı)
- Artı: klavye erişimi ve ekran okuyucu desteği tarayıcıda yerleşik, ek ARIA gerekmiyor
- Artı: sıfır JavaScript, sıfır bağımlılık, SSG uyumlu
- Eksi: Lighthouse'un `agentic-browsing` / `agent-accessibility-tree` denetimleri kapalı içeriği genişletmeden görmeyebilir — ölçülmedi
- Eksi: ekran okuyucu kullanıcısı içeriği görmek için açmak zorunda (ama içerik erişilebilir, gizli değil)

## Karar

**C seçildi — native `<details>` / `<summary>`, beş yüzeyin tamamında
(hizmet, pillar, vaka, makale, paket).**

`docs/17` §12'nin "paket SSS'leri `<dl>`'ye alındı" kaydı bu kararla geçersiz
kaldı; o kayıt değişiklik uygulandıktan bir dakika sonra commit edildiği için
ters yönü anlatıyor.

## Gerekçe

1. **Okunabilirlik, SSS sayısını düşürmeden korunuyor.** GEO değeri soru
   sayısında ve cevap kalitesindedir; ikisinden de ödün vermeden sayfa
   taranabilir kalıyor.
2. **Crawler erişimi kaybolmuyor.** Bu kararın tek gerçek riski "kapalı içerik
   okunmaz" idi; native `<details>` bu riski taşımıyor — B seçeneği taşıyor.
   Ham HTML çıktısında cevap metni `open` özniteliği olmadan da tam duruyor.
3. **İkinci güvence katmanı var.** Aynı metin `FAQPage` JSON-LD'sine de
   basılıyor (ADR-022 sonrası görünen metinle birebir aynı) — yani cevaplar
   makinelere iki bağımsız kanaldan ulaşıyor.
4. **A reddedildi** çünkü okunabilirlik maliyeti, çözdüğü belirsizlikten
   büyük. **B reddedildi** çünkü GEO stratejisinin can damarını kesiyor.

## Sonuçlar

### Pozitif
- 44 yüzeyde ≥10 soru, sayfa okunabilirliğini bozmadan taşınabiliyor
- Sıfır JS, sıfır bağımlılık; SSG ve Core Web Vitals etkilenmiyor
- Klavye ve ekran okuyucu desteği tarayıcıdan geliyor — kendi ARIA'mızı yazmıyoruz

### Negatif / trade-off
- Lighthouse `agentic-browsing` kategorisinin (2026-08-23 ölçümünde 33/100)
  bu yapıyla bugünkü değeri **bilinmiyor** — SSS hacmi üç katına çıktıktan
  sonra hiç yeniden ölçülmedi
- Ekran okuyucu kullanıcısı için cevaplar bir etkileşim adımı arkasında

### Yeniden değerlendirme tetikleyicileri
- Lighthouse `agentic-browsing` veya `agent-accessibility-tree` denetimi
  `<details>` yüzünden düşerse
- AI cevap motorlarında SSS pasajlarının atıf almadığı gözlenirse (GEO ölçüm
  rutini kurulunca — `docs/19` G-10)
- Bir sayfada soru sayısı okunabilirliği tehdit etmeyecek kadar azalırsa
  (o yüzeyde A seçeneği yeniden değerlendirilebilir)

## Implementasyon notları

- Tek kaynak: `src/components/marketing/faq-accordion.tsx`; beş yüzey de bu
  component'i kullanıyor.
- İlk 2-3 kritik sorunun `open` özniteliğiyle varsayılan açık gönderilmesi
  değerlendirilebilir — hem ilk izlenimde cevap görünür olur hem
  erişilebilirlik ağacı denetimi rahatlar. Uygulanmadı, açık öneri.
- Rollback: component'i `<dl>` render'ına döndürmek tek dosyalık iş; içerik
  katmanı ve şema üretimi etkilenmez.

## Referanslar

- `docs/17-seo-geo-audit-2026-08.md` §12 (ters yönü anlatan kayıt — düzeltme notu eklendi)
- `docs/19-seo-geo-audit-2026-08-27.md` bulgu G-12
- `docs/08-seo-i18n-strategy.md` §8.1 (alıntılanabilir pasaj kuralı)
- ADR-022 — paket SSS'leri tek ses (şema ↔ görünen metin eşleşmesi)
