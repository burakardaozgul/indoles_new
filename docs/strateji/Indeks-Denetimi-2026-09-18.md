# İndeks Denetimi — 2026-09-18 (Launch +20 gün)

> **Tetikleyici:** `GSC-Data/haftalik-log.md` 18 Eyl kaydı — 4 TR hizmet sayfası indekste yok, Strateji §9 "Ay 1: tüm hizmet sayfaları indeksli" eşiği tetiklendi.
> **Yöntem:** Canlı HTML (`curl`, JS sonrası eklenen link sayılmadı) · GSC URL Inspection API (`scripts/gsc-inspect.mjs`, 19:30) · GSC Sitemaps API · `pnpm build` çıktısı.
> **Görev tanımı:** `01-indeks-acil-hizmet-sayfalari.md` (prompt kümesi, 18 Eyl).
> **Yeniden kontrol:** **25 Eylül** (§5).

---

## 1. Fark analizi — indeksli ve indekssiz hizmet sayfaları

Her satır render edilmiş HTML'den sayıldı (`<a href>`); vaka ve yazı sütunları TR sayfaların tamamı taranarak çıkarıldı.

| Sayfa | Inspect (18 Eyl 19:30) | `/tr` | `/tr/hizmetler` | Pillar | Yazılardan (yazı / link) | Vakalardan | Sitemap | robots / CF özel kural | HTML / TTFB |
|---|---|---|---|---|---|---|---|---|---|
| `cro` | Bilinmiyor (15:51'de "keşfedildi") | 1 | 1 | growth 1 | **6 / 11** | 3 | 0.8 · monthly · build anı | yok | 198 KB / 0,33 s |
| `e-ticaret` | Bilinmiyor | 1 | 1 | growth 1 | 2 / 3 | 2 | aynı | yok | 199 KB / 0,33 s |
| `dijital-donusum` | Bilinmiyor | 1 | 1 | transform 1 | 2 / 2 | 0 | aynı | yok | 183 KB / 0,37 s |
| `marka-stratejisi` | Keşfedildi (15:51'de "bilinmiyor") | 1 | 1 | growth 1 | 4 / 7 | 3 | aynı | yok | 174 KB / 1,53 s (tek ölçüm) |
| `ai-danismanlik` — **indeksli**, tarama 16 Eyl | PASS | 1 | 1 | transform 1 | 3 / 5 | 1 | aynı | yok | 179 KB / 0,32 s |
| `ui-ux-tasarim` — **indeksli**, tarama 18 Eyl 14:10 | PASS | 1 | 1 | growth 1 | 1 / 2 | 3 | aynı | yok | 178 KB / 0,81 s |

Ek tarama (aynı saat): `is-zekasi` indeksli (tarama 28 Ağu); `isletme-muhendisligi` ve `teknoloji-ve-altyapi` **bilinmiyor**. Yani 12 TR hizmet sayfasının 6'sı hiç taranmamış.

**Okuma.** Hiçbir eksen indekssizleri indekslilerden ayırmıyor: `cro` sitenin en çok yazı linki alan hizmet sayfası, `ui-ux-tasarim` en az linki alan ama indeksli olanı. Sitemap değerleri, robots, Cloudflare kuralı, sayfa boyutu birebir aynı. Ayıran tek şey tarama zamanı: indeksliler ya **28 Ağustos'ta** (Burak'ın elle "dizine eklenmesini iste" turu) ya da **16-18 Eylül'de** (doğal tarama sırası) taranmış. Doğal tarama hızı düşük ve sıra bu altı sayfaya henüz gelmedi. "Keşfedildi/bilinmiyor" ayrımı iki çekim arasında yer değiştirdi — taranmamış URL için bu iki durum güvenilir bir sinyal değil.

## 2. Asıl bulgu — eski URL'ler cutover'dan beri yeniden taranmadı

| Eski URL | Inspect | Google canonical | Son tarama |
|---|---|---|---|
| `/cro-donusum-orani-optimizasyonu/` | Gönderildi ve dizine eklendi | eski URL'in kendisi | **21 Ağu** |
| `/e-ticaret-danismanligi/` | Gönderildi ve dizine eklendi | eski URL | **27 Ağu** |
| `/sosyal-medya-pazarlama/` | Gönderildi ve dizine eklendi | eski URL | **27 Ağu** |
| `/web-tasarim-ui-ux-tasarimi/` | Gönderildi ve dizine eklendi | eski URL | **30 Tem** |

Cutover 29-30 Ağustos. Google dört eski hizmet URL'inin hiçbirini o tarihten sonra taramadı; 301'leri görmedi, dolayısıyla yeni adresleri "eski sayfanın devamı" olarak da öğrenmedi. "cro ajansı"nda eski URL'in hâlâ poz. 12'de görünmesi, "dönüşüm optimizasyonu" tohumunun erimesi ve yeni sayfaların "bilinmiyor" çıkması aynı sebebin üç yüzü. `ui-ux-tasarim`in indekslenmesi 301 üzerinden değil, doğal tarama üzerinden oldu (eski URL 30 Temmuz'dan beri taranmamış).

Sitemaps API: `sitemap.xml` 3 Eyl gönderildi, **18 Eyl 15:04'te indirildi**, 146 URL, 0 hata / 0 uyarı, "indexed: 0" (GSC bu sayacı yeni mülklerde geç günceller; tek başına kanıt sayılmadı). Sitemap Google'a ulaşıyor; sorun sitemap'te değil, tarama önceliğinde.

Yan bulgu: her eski URL **iki atlamalı** zincir taşıyor (`/x/` → 308 `/x` → 308 yeni adres). Googlebot için eski URL başına üç istek. Tarama bütçesi kısıtlı bir sitede gereksiz maliyet — Görev 07'de (yönlendirme temizliği) düzleştirme değerlendirilecek.

## 3. Yapılanlar

| # | İş | Dosya | Not |
|---|---|---|---|
| 1 | **Eski URL sitemap'i** `/sitemap-eski.xml` (41 URL) | `src/app/sitemap-eski.xml/route.ts` · `src/lib/seo/legacy-redirects.ts` | Google site taşıma kılavuzunun önerisi: eski URL'leri ayrı sitemap'te sun, Googlebot yönlendirmeyi görsün. Yönlendirme listesi `next.config.ts`ten modüle taşındı — sitemap ve redirect tek kaynaktan. `robots.txt`e yazılmadı; GSC'de elle gönderilecek ve işlenince kaldırılacak. 5 birim testi (`tests/unit/legacy-sitemap.test.ts`). Görev tanımında yoktu; §2 bulgusunun doğrudan karşılığı olduğu için eklendi. |
| 2 | `ServiceContent.updatedAt` + sitemap `lastmod` | `types.ts` · `sitemap.ts` | Makaledeki sözleşmenin hizmet karşılığı. Yalnız gerçekten dokunulan sayfa tarih taşır. |
| 3 | `e-ticaret` sayfası: kanıt şeridi SOYLU AVM | `cases.ts` (SOYLU künyesi += `e-ticaret`) · `services/e-ticaret.ts` (`updatedAt: 2026-09-18`) | Eskiden MKComputer dropshipping gösteriyordu; SOYLU bir e-ticaret büyüme vakası (sektör, başlık, slug). SOYLU vaka sayfasından da e-ticaret hizmetine link doğdu. **Burak vetosuna açık:** vakanın görünür hizmet listesi "e-ticaret danışmanlığı" demiyor, editoryal karar. |
| 4 | Yazı → hizmet tam-çapa link | `articles.ts` | `cro-nedir` kapanışı → "dönüşüm oranı optimizasyonu hizmetimizin" (`/hizmetler/cro`); `e-ticaret-gap-analizi-cro-denetimi` kapanışı → "e-ticaret danışmanlığı hizmetimiz" (`/hizmetler/e-ticaret`). EN paritesi (`our conversion rate optimisation service`, `our e-commerce consultancy service`). |
| 5 | Ana sayfa 12 hizmet kartı | `ServicesScroll.tsx` | Link metni "Keşfet" ×12 idi; `aria-label="Keşfet: <hizmet adı>"` — ekran okuyucu için ayrıştırıcı, arama motoru için hizmet adını taşıyan çapa. Görünür metin adın içinde (WCAG 2.5.3). |
| 6 | IndexNow | — | `pnpm seo:indexnow` → 146 URL, HTTP 200 (18 Eyl, deploy öncesi; `cf:deploy` zinciri deploy sonunda tekrar atar). |
| 7 | Inspect baz çizgisi | — | §1-2 tabloları; 25 Eyl kıyası bunlarla yapılır. |

### Yapılmayanlar ve gerekçeleri

- **Hub kart çapası** "CRO — dönüşüm optimizasyonu" hizmet adının kendisi (H1). Adı değiştirmek H1'i değiştirir → Görev 06 madde 4, Burak kararı.
- **Sitemap priority:** hizmet 0.8, pillar 0.9 (test sabitliyor; görev tanımı 0.9 bekliyordu). Google priority'yi yok sayıyor; değiştirilmedi.
- **`cro`, `dijital-donusum`, `marka-stratejisi` için `updatedAt`:** bu görevde sayfaların içeriği değişmedi; tarih verilmedi. `cro` Görev 06'da (title/lede/SSS), `marka-stratejisi` Görev 05'te (yeni vakalar) gerçek değişiklikle alacak. Not: build-anı fallback'i deploy'da zaten bugünün tarihini basıyor — bu, lastmod'un güvenilirliğini düşüren mevcut davranış; hizmetlerde kalıcı tarih sözleşmesine geçiş (tüm hizmetlere `updatedAt`) ayrı bir iş olarak önerilir.
- **`dijital-donusum`a vaka künyesi:** mevcut 9 vakanın hiçbirinin anlatısı bu hizmeti karşılamıyor (en yakını Meccanotecnica teklif portalı, künyesi AI + otomasyon + yazılım). Uydurma eşleme yapılmadı; sayfa pillar fallback'iyle kalıyor. Yazı linki zaten 2 (`ai-donusumu-nedir`, KOBİ 5 adım).
- **SSS cevaplarına link:** `faqLd` cevabı ham alıyor, markdown JSON-LD'ye sızardı. Gövde paragrafları kullanıldı.

## 4. Burak'a devredilen adımlar (GSC arayüzü — API yapamıyor)

1. **Dizine eklenmesini iste** — sırayla, önce eskiler: `/cro-donusum-orani-optimizasyonu/`, `/e-ticaret-danismanligi/`, `/sosyal-medya-pazarlama/`, `/web-tasarim-ui-ux-tasarimi/`. Eski URL'de istek Googlebot'u 301'e götürür; sinyal aktarımı ancak böyle başlar. Sonra yeniler: `/tr/hizmetler/cro`, `/tr/hizmetler/e-ticaret`, `/tr/hizmetler/dijital-donusum`, `/tr/hizmetler/marka-stratejisi`. Kota günde ~10-12 istek; `isletme-muhendisligi` ve `teknoloji-ve-altyapi` ertesi güne.
2. **Deploy sonrası** `https://www.indoles.com.tr/sitemap-eski.xml` → GSC > Site Haritaları > Yeni site haritası ekle. Eski URL'ler Inspect'te "Yönlendirmeli sayfa"ya düşünce (beklenti: 2-6 hafta) GSC'den kaldır; route kalabilir.
3. Deploy: `pnpm cf:deploy` (IndexNow zincirde).

## 5. Yeniden kontrol — 25 Eylül

```
node scripts/gsc-inspect.mjs \
  https://www.indoles.com.tr/tr/hizmetler/cro https://www.indoles.com.tr/tr/hizmetler/e-ticaret \
  https://www.indoles.com.tr/tr/hizmetler/dijital-donusum https://www.indoles.com.tr/tr/hizmetler/marka-stratejisi \
  https://www.indoles.com.tr/cro-donusum-orani-optimizasyonu/ https://www.indoles.com.tr/e-ticaret-danismanligi/ \
  https://www.indoles.com.tr/sosyal-medya-pazarlama/ https://www.indoles.com.tr/web-tasarim-ui-ux-tasarimi/
```

Beklenen: eski dördü "Yönlendirmeli sayfa", yeni dördü en azından "Taranmış" (son tarama dolu). Hâlâ "bilinmiyor" ise plan §0.1 adım 5: dört sayfaya küçük içerik güncellemesi (`updatedAt` ile) + tekrar istek. 2 Ekim: `sitemap-eski.xml` işlenme durumu (Sitemaps API `lastDownloaded`).

## 6. Doğrulama (18 Eyl)

| Kapı | Sonuç |
|---|---|
| `pnpm typecheck` | temiz |
| `pnpm lint` | 0 hata (önceden var olan 4 unused-var uyarısı, ilgisiz dosyalar) |
| `pnpm test` | 156 dosya / 1674 test geçti, 1 atlandı |
| `pnpm build` | başarılı; `/sitemap-eski.xml` statik (○), `sitemap.xml`de `e-ticaret` lastmod `2026-09-18T00:00:00Z`, diğer hizmetler build anı |
| Prettier | yeni dosyalar temiz; dokunulan eski dosyalar repo'da zaten prettier-dışıydı, yeniden biçimlendirilmedi (diff şişmesin) |
