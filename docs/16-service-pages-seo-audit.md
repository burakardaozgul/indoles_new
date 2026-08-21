# 16 — Hizmet Sayfaları SEO & GEO Audit Raporu

> **Amaç:** 12 hizmet detay sayfasının her birinin SEO ve GEO denetim sonucunu, uygulanan düzeltmeleri ve son durumunu tek yerde tutmak.
>
> **Bağlı belgeler:** `docs/08-seo-i18n-strategy.md`, `docs/superpowers/specs/2026-08-19-hizmet-detay-sayfalari-design.md`, `docs/decisions/ADR-018-service-detail-pages.md`

---

## 1. Denetim Yöntemi

Denetim iki katmanda çalışır:

| Katman | Nerede | Ne yapar |
|---|---|---|
| Kurallar | `src/lib/seo/audit.ts` | Saf fonksiyon: HTML girer, `Finding[]` çıkar. 19 fixture testiyle doğrulanır |
| CLI | `scripts/seo-audit.ts` | Sayfayı dev sunucudan çeker, kuralları uygular, PASS/FAIL basar |

```
pnpm seo:audit <tr-slug>          # tek hizmet, TR + EN
pnpm seo:audit --all              # yazılmış tüm hizmetler
```

Bir FAIL varsa çıkış kodu 1.

### 1.1 Kural listesi

| `rule` | Kontrol | Eşik |
|---|---|---|
| `h1-count` | Sayfadaki `h1` sayısı | tam 1 |
| `heading-order` | Başlık seviyesi atlaması | atlama yok |
| `title-length` | `<title>` uzunluğu | ≤60 karakter |
| `description-length` | `meta[name=description]` | 80-160 karakter |
| `canonical` | Self-canonical link | var |
| `hreflang` | tr + en + x-default | üçü de var |
| `json-ld-parse` | JSON-LD parse edilebilir | evet |
| `json-ld-types` | Zorunlu düğümler | `Service`, `BreadcrumbList`, `FAQPage` |
| `entities` | `seo.entities` maddeleri gövde metninde | hepsi geçiyor |
| `persona-leak` | `[data-persona-variant]` | hiç yok |
| `internal-links` | Site içi bağlantı sayısı | ≥6 |
| `sibling-links` | Komşu hizmet bağlantısı | yazılmış komşuların tamamı, en çok 3 |
| `img-alt` | `aria-hidden` olmayan görsellerde `alt` | hepsinde var |

`persona-leak` kuralı bir eşik değil, ihlal kontrolüdür: hizmet detay sayfaları orta tonda ve tek sesli yazılır (docs/03 §1, ADR-014). Bir bileşen ileride sessizce `PersonaText` kullanmaya başlarsa burada yakalanır.

---

## 2. Sayfa Sayfa Sonuçlar

### 2.1 Performans pazarlama (pilot)

| | |
|---|---|
| TR | `/tr/hizmetler/performans-pazarlama` |
| EN | `/en/services/performance-marketing` |
| Pillar | Growth |
| Denetim tarihi | 2026-08-19 |
| Sonuç | **PASS** (TR ve EN) |

**Ölçümler**

| Ölçü | TR | Hedef |
|---|---|---|
| Gövde kelime sayısı | 867 | 700-900 |
| `h1` / `h2` / `h3` | 1 / 11 / 14 | tek h1, atlama yok |
| `title` uzunluğu | 45 | ≤60 |
| `description` uzunluğu | 158 | 80-160 |
| JSON-LD düğümleri | `Organization`, `WebPage`, `BreadcrumbList`, `Service`, `OfferCatalog`, `Offer`, `FAQPage` (5 `Question`) | 3 zorunlu düğüm |
| Persona varyantı | 0 | 0 |
| Yatay taşma (1440 / 390) | yok / yok | yok |

**Bulunan ve düzeltilen sorunlar**

| # | Bulgu | Düzeltme |
|---|---|---|
| 1 | `metadataBase` `NEXT_PUBLIC_APP_URL` yokken `localhost:3000`e düşüyordu; `robots.ts` ve `sitemap.ts` ise production adresine. Tanımsız bir production build'de tüm canonical ve OG URL'leri localhost gösterirdi | `src/lib/seo/site.ts` tek kaynak oldu; üç tüketici de oradan okuyor |
| 2 | `JsonLd` çıktısında `</script>` dizisi script etiketinden çıkabiliyordu (`JSON.stringify` `/` karakterini escape etmez) | `<` karakteri `\u003c` olarak kaçırılıyor; kaçışın şema anlamını bozmadığı testle doğrulandı |
| 3 | `SERVICE_ORDER` yazılan içerikle birlikte büyüyen bir liste olarak kurulmuştu. Pilot sayfa marka stratejisinin diyagramını gösteriyor ve "Hizmet 01 / 1" yazıyordu | Sıra 12 hizmetin tamamını içeren sabit kanonik liste oldu; `SERVICES` onun alt kümesi |

**Gate revizyonu (2026-08-20)**

Pilot ilk hâliyle gate'te reddedildi: fazla metin odaklı, ton fazla teknik (KOBİ alıcısına hitap etmiyor), hero orantısız, taahhüt bloğu gereksiz. Uygulanan revizyon:

| Eksen | Değişiklik |
|---|---|
| Ton | KOBİ diline sadeleşti — kısa cümle, para/satış somutluğu; "attribution" gibi jargon günlük dille açıklanıyor ("hangi satış hangi reklamdan geldi") |
| Yapı | Kapsam ve teslim maddeleri başlık + açıklama çiftine döndü; taahhüt bloğu ve `commitments` alanı kaldırıldı — sayfa 8 blok |
| Tasarım | Hero tek kolon okuma akışına geçti (`V2PageHeader` düzeni terk edildi); illüstrasyon "teşhis föyü" olarak çerçevelendi; sinyaller/kapsam/yöntem/teslimler kart gridlerine taşındı |

Revizyon sonrası audit yeniden koşuldu: TR ve EN **PASS**. Yatay taşma 1440/390 px'te yok. Mobil fullPage ekran görüntüsündeki karanlık zemin capture artefaktıdır (tam sayfa çekim scroll-bağlı ink koreografisini tetikliyor); viewport çekimi ve `getComputedStyle` doğrulaması zeminin krem kaldığını gösterdi.

**Polish turu (2026-08-20, canlı MCP incelemesi)**

Burak'ın bildirdiği beş sorunun canlı tarayıcıda kök analizi ve düzeltmeleri — üçü sayfa değil **site geneli** bug çıktı:

| # | Belirti | Kök neden | Düzeltme | Etki alanı |
|---|---|---|---|---|
| 1 | "HIZMET", "EĞITIM" — Türkçe İ/ı bozuk | `<html>` etiketinde `lang` hiç yoktu; CSS `text-transform: uppercase` Türkçe kural bilmeden çalışıyordu | Kök layout `getLocale()` ile `lang={locale}` basıyor | **Site geneli** |
| 2 | SSS akordeonu tıklamayla açılmıyor | R3F, blob kanvasının iç sarmalayıcısına inline `pointer-events:auto` basıp üstteki `pointer-events-none` katmanını geri açıyordu — tüm tıklamalar kanvasa gidiyordu (`elementFromPoint` → `CANVAS`) | `v2.css`: `[data-blob-canvas], [data-blob-canvas] * { pointer-events: none !important }` | **Site geneli** — blob'un bulunduğu her sayfada tıklamalar etkileniyordu |
| 3 | Popup açılınca fare görünmez | Özel imleç `z-50`, Radix dialog da `z-50`; portal DOM'da sonra geldiği için imlecin üstüne boyanıyordu — `cursor:none` global olduğundan fare tamamen kayboluyordu | İmleç `z-60`a alındı, v2.css katman sözleşmesi güncellendi | **Site geneli** |
| 4 | Breadcrumb nav'ın altında eziliyor | Hero'nun üst boşluğu (40px) sabit chrome'u (120px) hesaba katmıyordu | Hero `v2-pagehead` sınıfını kullanıyor (clamp 120-190px üst boşluk) | Hizmet sayfası |
| 5 | "Elinize geçen" rozetleri iki satıra kırılıyor | Chip'te `whitespace-nowrap` yoktu | Eklendi | Hizmet sayfası |

Canlı incelemenin bulduğu **altıncı** sorun (raporlanmamıştı): dil değiştirici dinamik sayfalarda `/en/services/[slug]` gibi ölü link üretiyordu — next-intl `usePathname` şablon döndürüyor ve slug'lar artık lokalize. Düzeltme: değiştirici önce sayfanın `hreflang` alternate link'ini okur (`useAlternateHref`), yoksa segment çevirisine düşer. Lokalize slug'lı diğer sayfa tipleri (paket, yazı) metadata kazandıkça aynı yoldan düzelecek.

Tüm düzeltmeler canlı tarayıcıda doğrulandı: `lang="tr"`, kanvas `pointer-events: none`, güvenilir tıklamayla SSS açılıyor, imleç `z-60` ve popup üstünde görünür, breadcrumb `y=226 > 120`, chip yüksekliği 24px (tek satır), değiştirici `/en/services/performance-marketing` üretiyor.

**Bilinen sınır**

`sibling-links` kuralı pilot denetiminde boş geçti: komşu hizmetler (`cro`, `marka-stratejisi`, `e-ticaret`) henüz yazılmamıştı, beklenti 0'a düştü. Kural Task 6'dan itibaren anlamlı sonuç üretir; 12 hizmet tamamlandığında tüm sayfalar yeniden denetlenir (Task 12).

---

## 3. Kalan 11 Hizmet

Pilot onaylandıktan sonra 11 hizmet aynı kalıpla üretildi ve her biri tek tek denetlendi. Hepsi ilk denetimde veya tek düzeltmeden sonra PASS aldı.

| Pillar | Hizmet | TR + EN | Not |
|---|---|---|---|
| Growth | Marka stratejisi | PASS | `platforms` yok — bu hizmetin somut araç seti yok, uydurma logo şeridi konmadı |
| Growth | CRO | PASS | Slug iki dilde de `cro`; açık adı ilk paragrafta geçiyor |
| Growth | E-ticaret | PASS | Bir SSS cevabı 39 kelimeydi, zenginleştirildi |
| Growth | UI/UX tasarım | PASS | İki SSS cevabı kısaydı, zenginleştirildi |
| Transform | AI danışmanlığı | PASS | Hype karşıtı çerçeve: "nerede AI, nerede klasik otomasyon, nerede hiçbiri" |
| Transform | Dijital dönüşüm | PASS | EN slug `digital-transformation`, pillar anahtarı `transform` ile çakışmıyor |
| Transform | İş otomasyonları | PASS | `entities` düzeltmesi: "onay akışı" → "onay akışları" (metindeki çoğul biçim) |
| Transform | İş zekası | PASS | "raporlama" yalnız `<title>`daydı; gövdeye anlamlı yerde eklendi |
| Transform | İşletme mühendisliği | PASS | Bir SSS cevabı kısaydı, zenginleştirildi |
| Build | Özel yazılım ve mobil | PASS | — |
| Build | Teknoloji ve altyapı | PASS | Lock-in riski sayfanın ayrıştırıcı iddiası |

### 3.1 Denetimin yakaladıkları

Audit script'i ve içerik testleri toplam **yedi** gerçek sorun yakaladı; hiçbiri kural gevşetilerek değil, içerik veya beyan düzeltilerek çözüldü:

- Beş SSS cevabı 40 kelime eşiğinin altındaydı (37-39 kelime). GEO açısından önemli: kısa cevap bağlamından koparıldığında eksik kalıyor.
- İki `entities` beyanı sayfada birebir geçmiyordu. Biri Türkçe çekim farkıydı (tekil/çoğul), diğeri gerçek bir eksiklikti — terim yalnız `<title>`da vardı, gövdede yoktu.

`sibling-links` kuralı pilot denetiminde boş geçiyordu (komşular henüz yazılmamıştı); Task 6'dan itibaren gerçek sonuç üretmeye başladı ve 12 hizmet tamamlandığında tam güçte çalıştı.

---

## 4. Kapanış

### 4.1 Toplu sonuç

```
pnpm seo:audit --all
12 hizmet, 24 sayfa denetlendi — hepsi PASS
```

| Doğrulama | Sonuç |
|---|---|
| `pnpm typecheck` | temiz |
| `pnpm test` | 206 test geçti |
| `pnpm lint` | 0 hata |
| `pnpm test:e2e hizmet-detay` | 31 test geçti |
| `pnpm build` | 98 statik sayfa üretildi |
| Production sunucu (`pnpm start`) | 24 hizmet + 3 pillar URL'i 200; bilinmeyen slug 404 |
| `sitemap.xml` | 30 hizmet/pillar URL'i, hreflang üçlüsüyle |
| `llms.txt` | 24 hizmet URL'i, veriden türetilmiş |

### 4.2 Kümenin kapanması

Task 9 ile anasayfadaki 12 kart pillar sayfası yerine kendi hizmet sayfasına bağlandı — projenin çıkış noktası olan sorun burada kapandı. `/hizmetler` listesi ve pillar sayfalarındaki hizmet adları da link oldu; her hizmet sayfası üç komşusuna bağlanıyor.

`PillarContent.services` kaldırıldı, `pillars.ts` 437 satırdan 236 satıra indi. Refactor sırasında `typecheck` iki ölü tüketici yakaladı: v1'den kalma `marketing/services-scroll.tsx` (hiçbir yerden import edilmiyordu, silindi) ve `vision-section.tsx`'in hizmet sayımı (`SERVICE_ORDER.length`e bağlandı).

### 4.3 İçerik editörlüğü turu (2026-08-20)

12 sayfa yayın sonrası tek tek editoryal incelemeden geçirildi (Burak talebi). Nesnel tarama önce zayıflık haritası çıkardı: 7 sayfada süre/beklenti SSS'i yoktu ve 7 sayfa minimum 4 soruda kalmıştı — KOBİ alıcısının ilk sorusu "ne kadar sürer" cevapsızdı. Uygulanan düzeltmeler:

| Sayfa | Müdahale |
|---|---|
| marka-stratejisi | Yok — 5 SSS, süre cevabı mevcut, dengeli |
| performans-pazarlama | Yazım: "hisse göre" → "içgüdüye göre" |
| cro | 5. SSS: "Dönüşüm oranımız ne kadar artar?" — rakam sözü vermeyen dürüst cevap (uydurma metrik yasağıyla uyumlu) |
| e-ticaret | Yok — dengeli |
| ui-ux-tasarim | 5. SSS: süreç süresi (4-6 hafta, aşama kırılımıyla) |
| ai-danismanlik | Mikro: "duyguyla" → "hevesle" (EN "enthusiasm" ile hizalandı) |
| dijital-donusum | 5. SSS: teşhis süresi — "süre tahmini de teşhisin çıktısıdır" |
| is-otomasyonlari | 5. SSS: ilk otomasyonun devreye girme süresi; sayfa içi "yazılı olarak" tekrarı giderildi |
| is-zekasi | 5. SSS: panel kurulum süresi; komşu sayfayla ortak kapanış kalıbı varyasyonlandı |
| isletme-muhendisligi | 5. SSS: saha süresi ve işi aksatmama güvencesi |
| ozel-yazilim-ve-mobil | Yok — 5 SSS, süre+maliyet cevabı mevcut |
| teknoloji-ve-altyapi | 5. SSS: KVKK/veri konumu — "Verilerimizin Türkiye'de kalması gerekiyor, bulut olur mu?" |

Tur sonrası: SSS dağılımı 12 sayfada 5'er soru; 206 test ve 24 sayfalık audit PASS.

### 4.4 Eksik marka logoları

Rozet kaydı (`src/lib/design/platform-icons.tsx`) `simple-icons` kütüphanesine ve yerel varlıklara dayanıyor. Aşağıdaki markaların logosu **yok** ve elle çizilmiyor — yanlış logo, logosuz olmaktan kötü. Şu an metin rozetiyle görünüyorlar:

| Marka | Durum | Gereken |
|---|---|---|
| İKAS | **Çözüldü** | Eski site arşivinden (`indoles_eski/medya`) işaret kırpıldı → `public/brand/platforms/ikas.png` |
| Ticimax | Metin rozeti | Marka SVG/PNG dosyası |
| İdeaSoft | Metin rozeti | Marka SVG/PNG dosyası |
| Microsoft Clarity | Metin rozeti | `simple-icons`ta yok; marka dosyası gerekiyor |

Dosyalar geldiğinde `public/brand/platforms/` altına konur ve kayıtta `{ kind: "asset", src: "..." }` satırı eklenir — içerik dosyalarına dokunulmaz.

### 4.5 Sonraki iş için notlar

- **Paket, vaka, yazı, danışman sayfaları hâlâ metadata'sız.** `src/lib/seo/` genel yazıldı; bu sayfa tiplerine uygulanması ayrı bir iş. Uygulandıkça dil değiştirici de o sayfalarda doğru çalışmaya başlayacak (değiştirici sayfanın `hreflang` alternate link'ini okuyor).
- **Dinamik OG görseli yok.** `docs/08` §7.2'de planlı; şu an tüm sayfalar aynı statik OG'yi kullanıyor.
- **Hizmet düzeyinde metrik yok.** Burak metrikleri sonra verecek; geldiğinde `ServiceContent`e yeni alan ve sayfaya yeni blok eklenir (ADR-018 §3).
- **`pnpm build` ve `pnpm dev` aynı `.next` dizinini paylaşıyor.** Dev sunucu ayaktayken build almak çalışan sunucuyu bozuyor (tüm rotalar 500 döner). Denetim sırasında bir kez yaşandı; çözümü dev sunucuyu yeniden başlatmak. CI'da sorun değil, lokalde sıralama önemli.
- **`seo:audit` CI'a bağlanabilir.** Script bir FAIL'de çıkış kodu 1 döndürüyor; dev sunucu ayakta olan bir CI adımında doğrudan çalışır.
