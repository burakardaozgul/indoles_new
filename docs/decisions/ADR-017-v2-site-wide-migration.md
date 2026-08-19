# ADR-017 — v2 tasarımının tüm siteye taşınması

**Tarih:** 2026-08-19
**Statü:** Kabul edildi
**Karar veren:** Burak Arda Özgül
**İlgili:** ADR-014 (persona), ADR-015 (design system v2), ADR-016 (v2 blob yönü)

---

## Karar

Burak: *"v2 tasarım onaylandı. Artık tüm sitemiz bu tasarımda olacak."* ve
*"Tüm sitemizi, eski kurguladığımız her şeyi v2'ye geçirebiliriz."*

`(v2)` prototip route grubu kaldırıldı. v2 anasayfası `/{locale}` oldu, tüm iç
sayfalar aynı chrome'un ve aynı malzeme dilinin altına alındı.

ADR-016 §Migrasyon'daki sekiz maddenin altısı bu ADR ile kapandı; kalan ikisi
(orijinal görseller, Lighthouse/Safari ölçümü) §Açık işler'de.

---

## Ne değişti

### 1. Route

| Önce | Sonra |
|---|---|
| `(marketing)/[locale]/page.tsx` — 11 bölümlük eski anasayfa | v2'nin 7 bölümlük sürekli-sahne anasayfası |
| `(v2)/[locale]/v2/` — prototip, `noindex` | Silindi. `/tr/v2` artık 404 |
| `/gizlilik-kvkk` — `routing.pathnames`'te yok | Eklendi: `en: "/privacy"`, sitemap'e girdi |

`/gizlilik-kvkk` bir yan bulgudur: sayfa `pathnames` haritasında olmadığı için
EN'de `/en/gizlilik-kvkk` olarak yayınlanıyor ve sitemap'e hiç girmiyordu.
Typecheck, `V2Footer` bu route'a `next-intl` `Link`'iyle bağlanınca yakaladı.

### 2. Chrome

Tek chrome, tüm sayfalarda. `V2Chrome` layout seviyesinde mount edilir ve
şunları taşır:

| Katman | Bileşen |
|---|---|
| Siyah bilgi şeridi | `V2TopBar` — sayfanın en üstü, sabit |
| Navigasyon | `V2Nav` — şeridin altı, sabit |
| WebGL canvas | `BlobCanvas` — route'a göre iki mod |
| Custom cursor | `CustomCursor` |
| Footer | `V2Footer` — ink blok, filigran |
| Sayfa başlığı | `V2PageHeader` — iç sayfalarda hero'nun sakin karşılığı |

Eski chrome (`SiteNav` liquid-glass pill, `TopBar`, `SiteFooter`) kullanımdan
kalktı. Dosyalar **silinmedi** — bkz. §Açık işler.

### 3. Blob'un iki modu

Blob anasayfada anlatının kendisidir; iç sayfada okumanın arkasında durur.
`BlobCanvas` bunu `variant` ile ayırır ve varyantı `V2Chrome` route'tan türetir
(layout hangi sayfada olduğunu bilmiyor).

| | `home` | `page` |
|---|---|---|
| Koreografi | 7 duraklı | Yok — sabit konum |
| Hareket | Bölüm çapalarına bağlı | Scroll boyunca tek hafif dikey kayma |
| Ölçek / opaklık | 0.65 / 1.0 | 0.40 / 0.26 |

Konum iki turda ayarlandı ve ikisi de ölçümle bulundu:

1. `0.62 / 0.42` — sayfa başlığının lede kolonunu örtüyordu. Sessiz eşlikçi
   olması gereken katman sayfanın konusu hâline geliyordu.
2. `0.74 / 0.30` — paket sayfasında fiyat kolonunun üstüne biniyordu.
3. `0.88 / 0.26` — gövdenin çoğu ekranın dışına taşıyor, geriye köşede yumuşak
   bir ışık kalıyor. Okuma kolonlarına hiç girmiyor.

`prefers-reduced-motion` altında scrub anında oturur (ADR-016 §10 sözleşmesi
değişmedi).

### 4. Yüzey dili

Krem tuval tek tuvaldir. Bölüm seviyesindeki opak zeminler kaldırıldı, kart
seviyesindeki yüzeyler yarı saydam beyaza çevrildi.

| Önce | Sonra | Neden |
|---|---|---|
| `bg-paper` (#FAFAF7) | kaldırıldı | Sayfanın rengiyle **aynı** renkti; tek yaptığı blob'u örtmekti |
| `bg-bg` | kaldırıldı | Aynı sebep |
| `bg-surface-1` (opak beyaz) | `.v2-surface` | Yarı saydam beyaz + hairline |
| `bg-surface-2` | `.v2-surface-2` | Daha hafif |
| `bg-surface-3` | `.v2-surface-3` | Teal tonlu |
| `bg-ink-900` | değişmedi | Bilinçli kontrast blokları |

`.v2-surface*` sınıflarında `backdrop-filter` **bilerek yok**: bir sayfada
onlarca kart olabiliyor ve hepsini ayrı compositing katmanına promote etmek
ADR-016 §Bilinen sınırlar'daki Safari jank'ının bilinen kaynağı.

### 5. Eski anasayfa bölümlerinin dağıtımı

v2'nin 7 bölümünde karşılığı olmayan beş bölüm silinmedi, içerik olarak
yaşadıkları yere taşındı (Burak'ın kararı: *"İç sayfalara dağıt"*).

| Bölüm | Yeni yeri | Gerekçe |
|---|---|---|
| INDOLES Frame (yöntem) | `/hakkimizda` | Kurumsal anlatının parçası |
| Kadro slider | `/hakkimizda` | Danışmanlar nav'dan çıktı; kadro burada görünür |
| Vizyon | `/hakkimizda` | Aynı |
| Sektörler | `/hizmetler` | Hizmet listesinin hemen ardından okunması gereken bilgi |
| Vakalar (problem filtreli) | `/vakalar` | Üstteki liste kronolojik, bu bölüm problem odaklı |

v2'de zaten karşılığı olanlar taşınmadı: müşteri logoları → `TrustedGrid`,
manifesto → `Statement`, pillar'lar → `Pillars`, hizmet portföyü →
`ServicesScroll`, CTA → `Outro`.

### 6. Funnel davranışı korundu

Nav'daki "Görüşme rezerve et" sayfa değiştirmez, persona popup'ını açar. Bu
eski `SiteNav`'ın davranışıydı ve ADR-014 persona akışının giriş kapısıdır.
Chrome değişirken sessizce `/iletisim` linkine dönmüştü; geri alındı.

`PopupProvider` artık tüm sitede mount edilir, dolayısıyla ADR-016
§Migrasyon'daki 3. madde (persona anasayfada seçilebilmeli) kapandı.

### 7. Tipografi

İç sayfaların gövdesi ADR-015 ölçeğinde kalmıştı. Fark ölçüldü ve iki yerde
çıktı: **ağırlık** ve **satır aralığı**.

| | Önce | Sonra |
|---|---|---|
| Taban `h1–h6` ağırlığı | 700 | 600 |
| `typography-*` başlık ağırlığı | 500 | 600 |
| Display satır aralığı | 0.96 – 1.05 | 0.94 – 1.00 |
| Gövde satır aralığı | 1.50 – 1.55 | 1.60 – 1.68 |

Aynı sayfada iki farklı başlık ağırlığı vardı (taban kural 700, semantik sınıf
500). Tek değere indirildi: 600 — anasayfanın kullandığı ağırlık.

Değişiklik `globals.css`'te yapıldı, 149 çağrı yerinde değil: sayfalar zaten
`typography-*` primitive'lerini tutarlı kullanıyordu (ham `text-*` yalnız 2
yerde). Otorite zinciri korundu (docs/04 → globals.css → component).

**Yan bulgu — hiyerarşi tersti.** `h2` etiketli bölüm başlıkları `display-xl`
(step-7, 5.37rem) kullanıyordu; sayfanın kendi `h1`'i `V2PageHeader`'da 5.25rem.
Yani bölüm başlıkları sayfa başlığından büyüktü. Ağırlık 500'ken göze
batmıyordu, 600'e çıkınca hiyerarşi çöktü. Kural netleştirildi — *display
ölçeği sayfa başlığınındır* — ve 24 kullanım bir basamak indirildi
(`display-xl` → `h1`, `display-lg` → `h2`).

`/gizlilik-kvkk` ayrıca dokuz `<h1>` render ediyordu (her yasal bölüm için bir
tane) — `V2PageHeader`'ınkiyle birlikte on. `h2`'ye çevrildi.

---

## Bilinen sınırlar

- `sections.css` (940 satır) hâlâ yükleniyor. İçindeki liquid-glass nav ve
  page-hero kuralları artık ölü; ayıklanması ayrı bir iş.
- Footer bülten formu e-posta istemcisini açıyor (`V2Newsletter`). Çalışıyor
  ama manuel — kalıcı çözüm bir liste entegrasyonu.
- EN hero'da accent aralıkları blob'un yolunu tutmuyor (ADR-016'dan devam).

## Açık işler

| # | İş | Sahip |
|---|---|---|
| 1 | 12 ölü component'in silinmesi — **6'sı git'te yok**, commit atılmadan silmek geri dönüşsüz | Burak (önce commit) |
| 2 | `sections.css`'in ölü kurallarından ayıklanması | — |
| 3 | Featured Work orijinal görselleri + alt metinler | Burak |
| 4 | Lighthouse ölçümü, Safari/iOS testi | — |
| 5 | `COMPANY.phone` placeholder | Burak |
| 6 | Bülten formunun gerçek entegrasyonu | Burak |

### Silinmeyi bekleyen dosyalar

Hiçbiri artık referans almıyor; **git'te olmayanlar** işaretli.

```
src/components/layout/site-nav.tsx          GİT'TE YOK
src/components/layout/top-bar.tsx           GİT'TE YOK
src/components/layout/site-footer.tsx
src/components/marketing/hero.tsx           GİT'TE YOK
src/components/marketing/manifesto.tsx      GİT'TE YOK
src/components/marketing/client-marquee.tsx GİT'TE YOK
src/components/marketing/cta-section.tsx    GİT'TE YOK
src/components/marketing/services-scroll.tsx GİT'TE YOK
src/components/marketing/pillars-section.tsx
src/components/marketing/page-header.tsx
src/components/marketing/breadcrumbs.tsx
src/components/marketing/section-header.tsx
```

`wave-canvas.tsx` **silinmez**: `vision-section` ve `method-section` onu
kullanıyor ve ikisi de `/hakkimizda`'da yaşıyor.

---

## Doğrulama

```
tsc --noEmit     temiz
vitest run       29 dosya / 123 test geçti, 1 skip
route smoke      19 route (TR + EN, index + detay + yasal) → 200
                 /tr/v2 → 404 (beklenen)
blob             anasayfa home modu (0.65/1.0), iç sayfa page modu (0.40/0.26)
chrome           şerit + nav + footer tüm sayfalarda
```
