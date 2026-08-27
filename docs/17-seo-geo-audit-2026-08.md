# SEO ve GEO Denetim Raporu — Launch Öncesi

> **Tarih:** 2026-08-23 · **Bağlam:** Yeni site 2026-08-24'te yayına alınıyor
> **Kapsam:** Teknik SEO + GEO hazırlığı + içerik-küme uyumu + iç link + dönüşüm + ölçüm
> **Otorite:** `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.3) · `docs/strateji/Rakip-Analizi-P0-SERP.md` · `docs/08-seo-i18n-strategy.md`
> **Statü:** Denetim raporu. Bu belgede kod düzeltmesi yapılmamıştır; §9'daki aksiyon planı Burak onayıyla ayrı iş olarak yürütülür.

---

## 0. Yönetici Özeti

Site teknik olarak sağlam kurulmuş bir temele sahip: hizmet sayfaları kendi denetim aracımızdan 24/24 PASS alıyor, hreflang üçlüsü her sayfada eksiksiz, JSON-LD grafiği hizmet ve makale şablonlarında zengin, Core Web Vitals lokal ölçümde hedefin çok altında (LCP 168 ms). Sorun içerik kalitesinde değil, **bu iyi içeriğin arama motoruna ulaşmasını engelleyen üç yapısal hatada**.

> **Uygulama durumu (2026-08-23, 22:15):** P0 kalemlerinin kod tarafı bu denetimin ardından uygulandı ve doğrulandı. Bulgu kayıtları tarihsel bütünlük için orijinal hâliyle duruyor; her birinin güncel durumu §11'deki uygulama kaydındadır. T-01'in kök-neden teşhisi uygulama sırasında değişti — düzeltme §3.1'de.

**Launch'ı bloklayan tek kritik bulgu T-01'dir:** sayfa metadata'sının tamamı (title, description, canonical, hreflang, Open Graph) `<head>` yerine `<body>` içinde basılıyor. Google, `<body>` içindeki canonical ve hreflang etiketlerini yok sayar; JavaScript çalıştırmayan tarayıcılar (sosyal medya önizleme botları, birçok AI crawler'ı) hiçbirini görmez. Bu, GEO'yu ana kaldıraç sayan bir stratejide en pahalı hatadır ve tek dosyada çözülür.

| Alan | Durum | P0 | Not |
|---|---|---|---|
| Metadata teslimi | **Kritik** | 2 | T-01 head/body hatası · T-02 10 sayfa tipi metadata'sız |
| İndekslenebilirlik / canonical | **Kritik** | 2 | T-01'in doğrudan sonucu; 12 URL ana sayfayı kanonik gösteriyor |
| 301 haritası | İyi | 0 | 30 kural aktif; 7 eksik + 1 eşleme çelişkisi |
| Sitemap / robots | Kısmi | 0 | 98 URL, hreflang tam; paket+danışman detayları eksik, lastmod tek değer |
| Sosyal / marka varlıkları | **Kritik** | 2 | OG görseli yok · favicon/manifest yok |
| JSON-LD | Kısmi | 0 | Hizmet/makale zengin; ana sayfa dahil 10 sayfa tipinde hiç yok |
| GEO hazırlığı (llms.txt, AI erişimi) | Kısmi | 1 | llms.txt spec'e uymuyor (Lighthouse doğruladı), llms-full.txt yok |
| Terminoloji (keyword uyumu) | **Kritik** | 1 | Para sayfasının title ve H1'inde "yapay zeka" geçmiyor |
| İçerik-küme uyumu | Kısmi | 1 | AI sayfasında vaka yok; GEO-editoryal küme boş |
| İç link mimarisi | Zayıf | 0 | Vaka→hizmet bağı yok; hizmet→vaka pillar tahminiyle |
| Dönüşüm mimarisi | Zayıf | 0 | Lead magnet yok, bülten mailto, webhook stub |
| Ölçüm | **Kritik** | 1 | Sitede çalışan analytics yok — launch günü ölçümsüz |
| Core Web Vitals | İyi | 0 | LCP 168 ms · CLS 0.00 (lokal) |

**Bugün yapılmazsa yarın geri dönülmez maliyet üretenler:** T-01, T-02, T-07 (host kararı), O-01 (ölçüm), T-03/T-04 (OG + favicon).

---

## 1. Kapsam ve Yöntem

| Ortam | Ne için kullanıldı |
|---|---|
| **Lokal production build** — `NEXT_PUBLIC_APP_STAGE=production pnpm build` + `pnpm start -p 3100` (build exit 0) | Tüm teknik denetimlerin kaynağı. Preview değil production robots/metadata davranışı. |
| **Repo statik analizi** — grep/dosya okuma | İçerik katmanı, redirect haritası, entegrasyon kodları |
| **Canlı site** — `https://www.indoles.com.tr` (hâlâ eski WordPress) | Eski URL'lerin bugünkü durumu, apex/www davranışı |
| **Lighthouse (mobil, Chrome DevTools)** + performans trace | CWV ve dış doğrulama |
| **`pnpm seo:audit --all`** (repo'nun kendi aracı) | 12 hizmet × 2 dil |

Kanıt dosyaları oturum scratchpad'indedir (`statik-kanit.md`, ham curl/JSON-LD/redirect çıktıları, Lighthouse JSON raporları).

**Bulgu kaydı biçimi:** `[ID] · Önem — Bulgu. Kanıt. Öneri. Strateji referansı.`
Önek: LG launch-gate · T teknik · G GEO · K içerik-küme · L iç link · D dönüşüm · O ölçüm.

**Uyarılar:** Lighthouse ve CWV ölçümleri lokal makinede, ağ kısıtlaması olmadan alındı; gerçek CDN koşullarını birebir yansıtmaz, göreli karşılaştırma için geçerlidir. Lighthouse 5 sayfanın 2'sinde koşturulabildi (tarayıcı profili çakışması); kalan 3 sayfa launch sonrası ölçülmelidir.

---

## 2. Launch-Gate Durumu (Strateji §3)

| # | Kalem | Durum | Kanıt | Bulgu |
|---|---|---|---|---|
| 1 | 301 haritası deploy | **Kısmi** | `next.config.ts` 30 kural; test edilen 5 eski URL 308 ile doğru hedefe gidiyor | T-06 |
| 2 | Sitemap + GSC submit | **Kısmi** | `/sitemap.xml` 200, 98 URL, 294 hreflang bağlantısı; GSC hesabı Burak'ta | T-05 |
| 3 | llms.txt canlı | **Kısmi** | `/llms.txt` 200, 141 satır, TR+EN; ancak spec formatına uymuyor, `/llms-full.txt` 404 | G-01, G-02 |
| 4 | JSON-LD doğrulama | **Kısmi** | Hizmet/makale sayfalarında parse hatası 0; ana sayfa ve 9 sayfa tipinde blok sayısı 0 | G-03, G-04 |
| 5 | Title/meta denetimi | **Eksik** | İçerik doğru (24/24 PASS, title'lar ≤60) ama etiketler `<head>`'de değil | **T-01** |
| 6 | Bing Webmaster + IndexNow | **Eksik** | Repo'da IndexNow anahtarı, doğrulama meta'sı veya submit script'i yok | T-11 |
| 7 | GBP güncelle | **Burak** | Kod dışı | — |
| 8 | CWV kontrol (LCP <1.8s) | **Geçti** | Ana sayfa trace: LCP 168 ms (TTFB 36 + render 132), CLS 0.00 | — |

**Ek launch-gate kalemi (stratejide yok, denetimde çıktı):**

**[LG-01] · P0 — Kanonik host kararı verilmemiş.** Canlı DNS `indoles.com.tr` → `https://www.indoles.com.tr` 301'liyor; yeni kod tabanı ise apex varsayıyor (`src/lib/seo/site.ts:11` `FALLBACK = "https://indoles.com.tr"`) ve `src/` içinde tek bir `www` referansı yok. Karar verilmezse canonical, OG url, sitemap ve llms.txt gerçek trafiğin gittiği host'tan farklı bir adres gösterir. **Öneri:** launch'tan önce host kararını ver, `NEXT_PUBLIC_APP_URL`'i Vercel'de o host'a set et (şu an yalnız `.env.local:9`'da tanımlı) ve DNS yönünü ona göre ayarla. **Strateji:** §3.

---

## 3. Teknik SEO

### 3.1 Metadata teslimi

**[T-01] · P0 — Sayfa metadata'sının tamamı `<head>` yerine `<body>` içinde basılıyor.**

Kanıt (`http://localhost:3100/tr/hizmetler/cro`, lokal production build): `</head>` HTML'in 2803. karakterinde kapanıyor. `<head>` içinde yalnız charset, viewport, stylesheet/script preload'ları, `theme-color` ve persona script'i var. Şu etiketlerin tamamı 55.900+ indekste, yani `<body>` içinde:

| Etiket | Konum |
|---|---|
| `<title>` | BODY (idx 55.922) |
| `<meta name="description">` | BODY (idx 55.980) |
| `<link rel="canonical">` | BODY (idx 56.294) |
| `hreflang` üçlüsü (tr/en/x-default) | BODY (idx 56.550) |
| `og:*` / `twitter:*` | BODY (idx 56.618+) |
| `<meta name="robots">` (kök layout) | BODY (idx 56.249) |
| JSON-LD | BODY — `<main>` içinde |
| `theme-color` (`viewport` export'u) | HEAD (idx 2.259) |

Tarayıcıda hidrasyon sonrası da düzelmiyor: Chrome'da `document.head.querySelector('link[rel="canonical"]')` → `null`; canonical, description ve title elemanlarının `parentElement` değeri `BODY`, JSON-LD'ninki `MAIN`. Her sayfada aynı (`/tr`, `/tr/gizlilik-kvkk`, makale sayfası — hepsinde canonical BODY). Dış doğrulama: Lighthouse SEO kategorisi iki ayrı sayfada 92 puan ve tek düşen madde `meta-description: Document does not have a meta description` — etiket HTML'de olduğu hâlde head'de olmadığı için.

**Kök neden — DÜZELTME (2026-08-23 akşamı, A/B build ile ölçüldü):** İlk teşhis `src/app/layout.tsx`'teki manuel `<head>` elemanıydı. **Bu yanlıştı.** İki tam build ile kontrollü karşılaştırma yapıldı (`/tr/hizmetler/cro`):

| | normal tarayıcı UA | bot UA (Twitterbot) |
|---|---|---|
| Manuel `<head>` VAR (eski) | title/canonical/og → BODY | hepsi **HEAD** |
| Manuel `<head>` YOK (yeni) | title/canonical/og → BODY | hepsi **HEAD** |

Manuel `<head>` kaldırıldıktan sonra da normal UA'da davranış değişmedi. Gerçek sebep **Next.js 15'in varsayılan streaming metadata davranışı**: metadata shell akışından sonra basılır, React istemcide `document.head`'e taşır. Bloklayan (etiketleri ilk HTML'in `<head>`'ine yazan) sürüm yalnız `htmlLimitedBots` listesindeki user-agent'lara gider. Varsayılan liste Bingbot, Twitterbot, LinkedInBot, facebookexternalhit, Slackbot, WhatsApp, applebot gibi önizleme botlarını içerir — **Googlebot ve hiçbir AI crawler'ı bu listede yoktur.**

**Etki (düzeltilmiş):** Sosyal önizleme botları ve Bing zaten doğru metadata alıyordu; ilk raporun "sosyal paylaşım kırık" ifadesi hatalıydı. Googlebot JS çalıştırdığı ve Next bu davranışı Googlebot'un render yeteneğine güvenerek tasarladığı için Google tarafında da fiili kayıp beklenmez. **Asıl açık AI crawler'larındaydı:** GPTBot, ClaudeBot, PerplexityBot, CCBot varsayılan listede değil ve JS çalıştırmıyorlar — yani title, description, canonical ve hreflang'i hiç görmüyorlardı. GEO'yu ana kaldıraç sayan bir stratejide (§2.0 karar 2, §5) kabul edilemez bir açık.

**Uygulanan çözüm:** `next.config.ts` içinde `htmlLimitedBots: /.*/` — streaming metadata tüm user-agent'lar için kapatıldı. Sayfalar SSG olduğundan metadata build anında zaten çözülüyor, çalışma zamanı maliyeti yok. Manuel `<head>` yine de kaldırıldı (Next belgeleri App Router'da önermiyor) ve persona script'i `<body>`nin ilk çocuğuna taşındı — senkron çalışması korundu. Doğrulama: 12 sayfada normal tarayıcı UA'sıyla title + canonical + og:image artık `</head>` öncesinde. **Strateji:** §3 kalem 4-5, §5.

**[T-02] · P0 — On sayfa tipinde `generateMetadata` yok; hepsi ana sayfanın başlığını ve canonical'ını miras alıyor.**

Kanıt (rendered HTML, lokal production):

| URL | `<title>` | canonical |
|---|---|---|
| `/tr/vakalar` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/yazilar` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/paketler` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/paketler/buyume-sprinti` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/danismanlar` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/danismanlar/burak-ozgul` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/hakkimizda` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/iletisim` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/tr/gizlilik-kvkk` | INDOLES — İş geliştirme danışmanlığı | `…/tr` |
| `/en/contact`, `/en/about`, `/en/packages` | INDOLES — Business transformation studio, Istanbul | `…/en` |

Doğru metadata üretenler: ana sayfa, `/tr/hizmetler`, hizmet detay, pillar detay, vaka detay, makale detay.

**Etki:** T-01 çözüldüğünde bu bulgu tek başına aktif zarara döner: 4 paket detay ve 10 danışman detay sayfası dahil en az 24 URL kendini ana sayfa olarak kanonikleştirir; Google bu sayfaları indeksten düşürür. Ayrıca `/tr/hakkimizda` ve `/tr/danismanlar/*` — strateji §5'in "kadro = 10 entity, E-E-A-T çarpanı" kaldıracı — kendi başlığı olmadan yayına girer.

**Öneri:** Her sayfa tipine mevcut `buildMetadata` yardımcısıyla (`src/lib/seo/metadata.ts`) `generateMetadata` ekle; paket ve danışman detaylarında slug'a özel başlık/açıklama üret. `paketler`/`danismanlar` için `buildAlternates` çağrısında iki dilli path eşlemesi gerekir. **Strateji:** §3 kalem 5, §9.

### 3.2 Sosyal ve marka varlıkları

**[T-03] · P0 — Hiçbir sayfada OG/Twitter görseli yok.** Kanıt: `/tr`, `/tr/hizmetler/cro` ve makale sayfasında `og:image` ve `twitter:image` etiketi bulunmuyor; `twitter:card` ise `summary_large_image` olarak bildiriliyor — yani gösterilecek görseli olmayan büyük kart. `docs/08` §7.2 dinamik OG üretimi öngörüyor, uygulanmamış. **Etki:** LinkedIn dağıtımı stratejinin bedava çarpanı (§4); görselsiz paylaşım tıklama oranını doğrudan düşürür. **Öneri:** `opengraph-image.tsx` ile sayfa tipine göre dinamik OG üret (başlık + pillar + marka), en azından statik bir varsayılan görsel ekle. **Strateji:** §3 kalem 5, §4.

**[T-04] · P0 — Favicon, uygulama ikonları ve manifest yok.** Kanıt: `/favicon.ico` → 404, `/manifest.webmanifest` → 404; sayfalarda `<link rel="icon">`, `apple-touch-icon` veya `manifest` etiketi yok. **Etki:** Tarayıcı sekmesinde ve Google'ın mobil sonuçlarındaki favicon alanında boş/varsayılan ikon; premium konumlandırmayla çelişir. **Öneri:** `src/app/icon.png` + `apple-icon.png` + `manifest.ts` ekle.

### 3.3 Sitemap

**[T-05] · P1 — Sitemap üç noktada eksik.** Kanıt (`/sitemap.xml`, 98 URL): (a) paket detay sayfaları yok — yalnız `/tr/paketler` ve `/en/packages` indeksleri var, oysa 4 paketin tamamı `generateStaticParams` ile üretiliyor; (b) danışman detay sayfaları yok — 10 kişilik kadronun tamamı sitemap dışında; (c) `<lastmod>` değerlerinin tekil sayısı **1** — tüm URL'ler build anını taşıyor, oysa makaleler `publishedAt`/`updatedAt` alanlarına sahip. Ayrıca `docs/08` §4.1 dil bazlı sitemap + index öngörüyor, uygulama tek düz dosya. Olumlu: 98 URL'nin tamamında hreflang alternatifleri var (294 `xhtml:link`), silinen 3 demo makalenin izi yok. **Öneri:** paket ve danışman detaylarını ekle; `lastmod`'u içerik tarihinden türet (her deploy'da "tüm site değişti" sinyali vermeyi bırakır). **Strateji:** §3 kalem 2.

**[T-10] · P1 — Pillar sayfaları sitemap'te en yüksek önceliğe sahip ama başlıkları tek İngilizce kelime.** Kanıt: `src/lib/content/pillars.ts:6,82,158` → `name.tr` sırasıyla "Growth", "Transform", "Build"; rendered title `Growth — INDOLES`. Sitemap priority dağılımında 0.9 bandında 8 URL var (pillar'lar dahil), hizmet sayfaları 0.8'de. **Etki:** En yüksek öncelikli URL'ler hiçbir Türkçe arama kelimesi taşımıyor. **Öneri:** pillar SEO başlıklarını Türkçe niyet karşılayacak biçimde ayrıştır (görünen marka adı "Growth" kalabilir; `seo.title` "Büyüme sistemleri — …" gibi). **Strateji:** §2.

### 3.4 301 yönlendirmeleri

Genel durum stratejinin varsaydığından iyi: `next.config.ts` 30 kural içeriyor ve Ek A'daki "revize yazı" hedeflerinin tamamı artık gerçek içerikle eşleşiyor (16 makale + 9 vaka yayında).

Doğrulanan çalışan örnekler (lokal, 308 + zincir sonu 200): `/cro-donusum-orani-optimizasyonu` → `/tr/hizmetler/cro` · `/e-ticaret-danismanligi` → `/tr/hizmetler/e-ticaret` · `/our-services` → `/en/services` · `/portfolyo/buyume-stratejisi` → `/tr/vakalar/soylu-avm-e-ticaret-buyume` · `/yapay-zeka-aramalarinda-nasil-one-cikarsiniz` → ilgili yazı · `/2026-web-tasarim-trendleri` → ilgili yazı · `/reklam-maliyetleri-artarken-buyumenin-sirri-ltv-optimizasyonu` → ilgili yazı. Sondaki slash'lı hâller de iki sıçramayla doğru hedefe varıyor.

**[T-06] · P1 — Yedi eski URL karşılıksız; biri stratejinin en yüksek gösterimli sayfası.**

| Eski URL | Canlı durum | Yeni sitede | Ek A hedefi |
|---|---|---|---|
| `/web-tasarim-ui-ux-tasarimi/` | 200 (WordPress) | 404 | `/tr/hizmetler/ui-ux-tasarim` — **310 gösterim** |
| `/takimimiz/` | 200 | 404 | `/tr/hakkimizda` |
| `/bilgi-kutuphanemiz/` | 200 | 404 | `/tr/yazilar` |
| `/musterilerimiz/`, `/referanslarimiz/` | — | 404 | `/tr/vakalar` |
| `/sosyal-medya-pazarlama/` | — | 404 | `/tr/hizmetler/marka-stratejisi` |
| `/category/*` | — | 404 | `/tr/yazilar` (wildcard) |
| `/portfolyo-kategori/*` | — | 404 | `/tr/vakalar` (wildcard) |

`/iletisim/` kural olmadan çalışıyor: middleware `/tr/iletisim`'e 307'liyor ve 200 dönüyor — kalıcı yönlendirme olmadığı için yine de açık kural yazılması tercih edilir.

**[T-06b] · P1 — Eşleme çelişkisi.** `next.config.ts:27` `/kreatif-hizmetler` → `/tr/hizmetler/ui-ux-tasarim`; strateji Ek A ise `/tr/hizmetler/growth` diyor. İkisi de geçerli rota, ancak stratejik hedef farklı. **Öneri:** Burak kararı; UI/UX'in doğru eski URL'i zaten `/web-tasarim-ui-ux-tasarimi` olduğundan `/kreatif-hizmetler`'in Ek A'daki gibi growth'a gitmesi daha tutarlı görünüyor. **Strateji:** Ek A.

### 3.5 Diğer teknik bulgular

**[T-07] · P0 — Bkz. LG-01 (kanonik host + `NEXT_PUBLIC_APP_URL`).** Lokal build'de canonical'lar `http://localhost:3000` bastı; bu env değişkeninin doğru değerle production'a taşınması launch kontrol listesine alınmalı. Ayrıca `robots.txt` çıktısındaki `Host:` ve `Sitemap:` satırları da aynı değişkenden besleniyor.

**[T-08] · P1 — 404 sayfası dilden bağımsız ve başlıksız.** Kanıt: `/tr/olmayan-sayfa` ve `/en/does-not-exist` ikisi de doğru 404 kodu ve doğru `<html lang>` döndürüyor, ancak ikisinde de H1 Türkçe: "Aradığın sayfa burada değil."; sayfada `<title>` etiketi hiç yok. Kaynak: `src/app/not-found.tsx` (kök seviye, marka chrome'u dışında). **Öneri:** `[locale]/not-found.tsx` ekle, iki dilli metin ve başlık ver, nav/footer içine al — 404'e düşen backlink değeri en azından gezinmeye dönsün. **Strateji:** Ek A (karşılıksız eski URL'ler kasıtlı 404'e düşüyor; o hâlde 404 sayfası bir kurtarma yüzeyidir).

**[T-09] · P2 — `robots.txt` llms.txt'e işaret etmiyor.** Kanıt: robots çıktısında `Allow: /` ve sitemap satırı var, `llms.txt` referansı yok; hiçbir AI user-agent'ı açıkça adlandırılmamış (hepsi `*` altında izinli — `docs/08` §5'in bilinçli "şeffaf" duruşu). **Öneri:** llms.txt satırını ekle; AI crawler'larını açıkça `Allow` ile listelemek niyeti okunur kılar.

**[T-11] · P0 — Bing Webmaster doğrulaması ve IndexNow yok.** Kanıt: repo'da `google-site-verification` meta'sı, Bing/Yandex doğrulama dosyası, IndexNow anahtar dosyası veya submit script'i yok. **Etki:** Strateji §3 kalem 6 Bing'i "ChatGPT'nin arama altyapısı" olduğu için Google kadar kritik sayıyor. **Öneri:** GSC/Bing doğrulaması Burak'ta; kod tarafında `metadata.verification` alanı ve `public/<key>.txt` + deploy sonrası IndexNow ping'i eklenmeli.

### 3.6 Core Web Vitals ve erişilebilirlik

Ana sayfa performans trace'i (lokal production, mobil): **LCP 168 ms** (TTFB 36 ms + render gecikmesi 132 ms), **CLS 0.00**. WebGL blob'un LCP'yi yediğine dair bir bulgu yok — strateji §3 kalem 8'in endişesi lokal koşulda karşılanmış görünüyor. Trace "ForcedReflow" uyarısı veriyor (JS'in stil geçersizleştikten sonra geometri sorgulaması), performans bütçesini şu an zorlamıyor.

Lighthouse (mobil) sonuçları:

| Sayfa | Erişilebilirlik | Best Practices | SEO | Agentic Browsing |
|---|---|---|---|---|
| `/tr/hizmetler/cro` | 86 | 100 | 92 | 33 |
| `/tr/yazilar` | 93 | 100 | 92 | 33 |

**[T-12] · P1 — Erişilebilirlik bulguları.** Her iki sayfada `color-contrast` (yetersiz kontrast oranı) ve `link-name` (ayırt edilebilir adı olmayan bağlantı) düşüyor. CRO sayfasında ayrıca `definition-list` ve `dlitem` düşüyor: FAQ bloğu `<dl>` kullanıyor ama `<dt>/<dd>` çiftleri `<div>` sarmalayıcılar içinde (DOM kontrolü: `dl > DIV,DIV,…`, 6 dt / 6 dd). **Etki:** FAQ işaretlemesi ADR-018'de bilinçli olarak GEO sinyali için tutuluyor; sarmalayıcılar semantiği zayıflatıyor. **Öneri:** `<dl>` içinde doğrudan `<dt>/<dd>` sırası kullan (gerekiyorsa `display: contents` ile stil koru); kontrast ve bağlantı adı düzeltmelerini `docs/13` denetimiyle birlikte ele al.

---

## 4. GEO Hazırlığı

### 4.1 llms.txt

**[G-01] · P0 — llms.txt spec formatına uymuyor; Lighthouse "önerileri karşılamıyor" diyor.** Kanıt: `/llms.txt` 200 dönüyor, 141 satır, TR ve EN bölümleri, hizmet/vaka/makale listeleri dinamik olarak üretiliyor (silinen demo makaleler otomatik düştü — mimari doğru). Ancak dosyada **markdown bağlantı biçimi (`[Başlık](url)`) sıfır kez** geçiyor; tüm girdiler `- Ad: https://…` düz metin biçiminde (86 satırda çıplak URL). Lighthouse `agentic-browsing` kategorisinde `llms-txt` denetimi düşüyor, gerekçe: *"File does not appear to contain any links."* — bu iki sayfada da 33 puanın ana sebeplerinden biri. **Öneri:** listeleri `- [CRO — dönüşüm optimizasyonu](https://…/tr/hizmetler/cro): tek cümlelik açıklama` biçimine çevir. Üretim tek fonksiyonda (`src/app/llms.txt/route.ts`) olduğu için küçük bir değişiklik. **Strateji:** §2.0 karar 2 (GEO kümesi P0 trafik motoru), §3 kalem 3, §5.

**[G-02] · P1 — `llms-full.txt` yok** (`/llms-full.txt` → 404), oysa repo'nun kendi `indoles-i18n-seo` skill tanımı bunu bekliyor. **Öneri:** tam içerik dökümü üreten ikinci bir route ekle.

**[G-03] · P1 — llms.txt içinde host tutarsızlığı.** Kanıt: dosyadaki URL'lerin 74'ü `SITE_URL`'den (lokal build'de `localhost:3000`), 12'si sabit yazılmış `https://indoles.com.tr` — iletişim ve kaynaklar bölümleri. **Öneri:** tümünü `SITE_URL`/`absoluteUrl` üzerinden üret; host kararı (LG-01) tek yerden yayılsın.

**[G-04] · P1 — Agentic erişilebilirlik ağacı bozuk.** Lighthouse `agent-accessibility-tree: Accessibility tree is not well-formed` her iki sayfada düşüyor. AI ajanlarının sayfayı yorumlama kabiliyetini doğrudan ölçen bu yeni kategori 100 üzerinden 33. T-12'deki semantik düzeltmelerle birlikte ele alınmalı.

### 4.2 JSON-LD kapsama matrisi

| Sayfa tipi | Blok | Şemalar |
|---|---|---|
| Ana sayfa (`/tr`, `/en`) | **0** | — |
| Hizmetler indeksi | 1 | Organization, WebPage, BreadcrumbList, ItemList |
| Hizmet detay | 1 | Organization, WebPage, BreadcrumbList, Service, Offer/OfferCatalog/PriceSpecification, **FAQPage** |
| Pillar detay | 1 | Organization, WebPage, BreadcrumbList, Service, Offer — FAQPage yok |
| Vaka detay | 1 | Organization, BreadcrumbList — **Article/CaseStudy yok** |
| Makale detay | 1 | Organization, BreadcrumbList, **Article + Person**, FAQPage |
| Vakalar / Yazılar / Paketler indeksleri | **0** | — |
| Paket detay, Danışman indeksi/detayı | **0** | — |
| Hakkımızda, İletişim, KVKK | **0** | — |

Parse hatası: 0 (tüm bloklar geçerli JSON).

**[G-05] · P1 — Ana sayfa dahil on sayfa tipinde hiç yapılandırılmış veri yok.** En çok bağlantı alan sayfa (ana sayfa) Organization şeması bile taşımıyor; `WebSite` şeması hiçbir yerde tanımlı değil. **Etki:** AI modelleri entity'yi çapraz kaynak tutarlılığından öğrenir (strateji §5); marka entity'sinin ana sayfada tanımsız olması bu kaldıracı boşa çıkarır. **Öneri:** Organization + WebSite şemasını kök/locale layout'a taşı (her sayfada tek `@graph`), danışman sayfalarına `Person`, iletişim/hakkımızda'ya `LocalBusiness`/`ProfessionalService` ekle (`COMPANY.geo` ve adres verisi `src/lib/content/company.ts`'te mevcut).

**[G-06] · P1 — Organization şemasında `sameAs` yok.** LinkedIn/Instagram/X adresleri `src/lib/content/company.ts` içinde `COMPANY.social` olarak duruyor ama şemaya bağlanmamış. Strateji §5'in "varlık tutarlılığı" kaldıracının en ucuz adımı. 

**[G-07] · P1 — Vaka sayfalarında Article/CaseStudy şeması ve FAQ yok.** 9 vakanın 8'i sayısal metrik taşıyor (`1,5M $`, `12×`, `15×`, `10M ₺` gibi ~30 değer) ama bunlar yapılandırılmış veriye hiç girmiyor; `docs/08` §8.4 "CaseStudy → Article" öngörüyor. Vaka tipinde `faq` alanı bile tanımlı değil. **Strateji:** §1 ilke 3 ("kanıt yayında — şimdi keskinleştirilir"), S1 sprintinin ana işi.

### 4.3 Terminoloji ve entity görünürlüğü

**[G-08] · P0 — Yapay zeka para sayfasının başlığında ve H1'inde hedef kelime geçmiyor.** Kanıt: `src/lib/content/services/ai-danismanlik.ts:16` `name.tr = "AI danışmanlığı"` (H1 olarak render ediliyor), `seo.title.tr = "AI danışmanlığı ve pilot uygulama"` → rendered `<title>AI danışmanlığı ve pilot uygulama — INDOLES`. GKP verisine göre hacmin tamamı "yapay zeka danışmanlığı / danışmanı / ajansı" formunda; "ai danışmanlığı" veri üretmiyor (strateji §2.0 karar 1). Ek olarak içerik katmanında şapkalı **"yapay zekâ" 5 kez** geçiyor (hizmet metinleri) — arama sorgusuyla eşleşmeyen yazım; şapkasız "yapay zeka" ise 9 kez ama yalnız `articles.ts` ve `cases.ts` içinde, yani hizmet sayfasında hiç yok. **Öneri:** hizmet sayfasının title/H1/lede'sini "yapay zeka danışmanlığı" birincil olacak şekilde yeniden yaz ("AI" marka-kategori terimi olarak metin içinde kalsın), şapkalı kullanımı SEO yüzeylerinden çıkar. Küme içinde en alınabilir kelime olan "yapay zeka ajansı" (100-1B, düşük rekabet) için sayfada açık bir bölüm aç. **Strateji:** §2.0 karar 1, Rakip-Analizi §2.

**[G-09] · P1 — ADUARDO kanıtı para sayfalarında görünmüyor.** Kanıt: repo genelinde iki kullanıcıya görünür geçiş var, ikisi de danışman biyografisinde (`src/lib/content/consultants.ts:35` TR, `:40` EN). Ana sayfa, hakkımızda ve `/tr/hizmetler/ai-danismanlik` sayfasında ADUARDO geçmiyor. Rakip analizine göre "kendi AI ürününü inşa etmiş ekip" iddiası ajans katmanındaki hiçbir rakipte yok — en net farklılaştırıcı kullanılmıyor. **Strateji:** §8, Rakip-Analizi §2.3.

**[G-10] · P2 — GEO ölçüm rutini kurulmamış.** Strateji §5 ayda bir, 10 soruluk sabit prompt setiyle ChatGPT/Gemini/Perplexity üzerinde manuel görünürlük testi ve sonuç tablosu öngörüyor. Repo'da veya dokümanlarda böyle bir tablo yok. **Öneri:** `docs/strateji/` altına prompt seti + ölçüm tablosu şablonu; ilk tur launch haftasında (baz çizgisi).

---

## 5. İçerik–Küme Uyumu (Strateji §2)

| Küme | Öncelik | Hedef sayfa | Var mı | Derinlik | Bulgu |
|---|---|---|---|---|---|
| CRO | P0-müşteri | `/tr/hizmetler/cro` | Evet | ~760 kelime, 5 FAQ, 10 platform rozeti, 34 iç link | K-02 |
| Yapay zeka danışmanlığı | P0-müşteri | `/tr/hizmetler/ai-danismanlik` | Evet | ~730 kelime, 5 FAQ, platform şeridi yok, vaka linki yok | **K-01**, G-08 |
| GEO-editoryal | **P0-trafik** | `/tr/yazilar/*` | Kısmi | Yalnız "yapay zeka aramalarında nasıl öne çıkarsınız" mevcut | **K-03** |
| Performans pazarlama | P1 | `/tr/hizmetler/performans-pazarlama` | Evet | Standart iskelet, 5 FAQ | K-04 |
| E-ticaret | P1 | `/tr/hizmetler/e-ticaret` | Evet | Standart iskelet | K-04 |
| UI/UX | P1 | `/tr/hizmetler/ui-ux-tasarim` | Evet | Standart iskelet | T-06 (301) |
| İş geliştirme (kategori) | P1 | `/tr/hizmetler` + hakkımızda | Kısmi | Kanonik tanım içeriği yok | K-03 |
| Özel yazılım / MVP | P2 | `/tr/hizmetler/ozel-yazilim-ve-mobil` | Evet | Standart iskelet | — |
| Dijital dönüşüm | P2 | `/tr/hizmetler/dijital-donusum` | Evet | Standart iskelet | — |
| İş zekası / İşletme müh. | P2 | İlgili hizmet sayfaları | Evet | Standart iskelet | — |
| Lokal (İstanbul) | P2 | GBP + hizmet içi bölüm | Hayır | Sayfa içi lokal sinyal ve LocalBusiness şeması yok | G-05 |

**[K-01] · P0 — Yapay zeka hizmet sayfası hiçbir vakaya bağlanmıyor.** Kanıt: hizmet→vaka bağı pillar eşleşmesiyle türetiliyor (`src/components/marketing/service-detail.tsx`, `CASES.find(c => c.pillar === service.pillar)`); `cases.ts` içinde `pillar: "transform"` olan tek bir vaka yok (dağılım: growth 6, build 3). Oysa `meccanotecnica-umbra-teklif-portali` gerçek bir yapay zeka vakası ("AI teknik danışmanla teklif talebinde 10 kat artış", metrikler `10×`, `%90`) ve `pillar: "build"` etiketli. Sonuç: P0 para sayfası kanıtsız kalıyor, aynı zamanda 5 transform hizmetinin tamamı vakasız. **Öneri:** Meccanotecnica vakasını transform'a taşı veya hizmet başına açık `relatedCases` alanı tanımla (pillar tahminini bırak). Aynı kök neden 4 growth hizmetinin aynı vakaya bağlanmasına da yol açıyor. **Strateji:** Rakip-Analizi §2 ("kanıt farkı"), §1 ilke 3.

**[K-02] · P1 — Para sayfalarında rakamlı sonuç yok.** `cases.ts` içinde ~30 metrik değer var; hizmet sayfalarının gövdesinde hiçbiri geçmiyor, yalnız vaka kartına metin bağlantısı veriliyor. Rakip analizi Poligon'u geçme kriterini tam da buraya bağlıyor: "hizmet sayfasına gömülü rakamlı vaka — kimsede yok". **Öneri:** CRO ve yapay zeka sayfalarına 2-3 metrikli kanıt şeridi.

**[K-03] · P1 — P0-trafik kümesi (GEO-editoryal) için içerik neredeyse yok.** Strateji §2.0 karar 2 bu kümeyi "en hızlı trafik kaynağı, SERP'i boş" diye P0'a terfi ettirdi ve rakip analizi §3 pencerenin daraldığını (Poligon'un yeni sayfası, Adroket'in 2026 rehberi) tespit etti. Şu an yalnız bir eski yazının revizyonu mevcut; "GEO nedir / llms.txt nedir / AI Overviews'da yer almak" kanonik içerikleri yok. **Öneri:** takvimin h.7/h.9/h.10 içeriklerini öne al; llms.txt yazısı G-01 düzeltmesiyle aynı hafta yayımlanırsa kendi uygulamamız vaka olur.

**[K-04] · P2 — Meta açıklamaları kısa.** 12 hizmet sayfasının tamamında açıklama 118-143 karakter; SERP'te ~155 karaktere kadar alan var. Başlıklar şablonla birlikte 32-52 karakter — sınır içinde ve iyi.

**[K-05] · P2 — Pillar sayfalarında FAQ yok** (`pillar-detail.tsx`, Search Console uyarıları nedeniyle kaldırılmış). Hizmet sayfalarının tamamında 5 soruluk FAQ var ve FAQPage şemasına giriyor — pillar'lar bu GEO sinyalinden yoksun.

**Not:** 3 demo makale (82-137 kelime, H2 ve FAQ'sız) bu denetim sırasında Burak onayıyla kaldırıldı; makale sayısı 19 → 16. Kalan makaleler ~1.100 kelime, 4 soruluk SSS ve güncelleme rozeti taşıyor.

---

## 6. İç Link Mimarisi

**[L-01] · P1 — Vaka sayfalarından hizmet sayfalarına hiç bağlantı yok.** Kanıt: vakalar `services` alanını düz metin dizisi olarak taşıyor ("CRO ve arayüz iyileştirme" gibi) ve noktayla ayrılmış metin olarak render ediliyor; `cases.ts` içinde `/hizmetler` geçişi 0. **Etki:** Kanıt sayfalarından para sayfalarına otorite akmıyor; strateji §4'ün "her makale ilgili vakaya, vakalar kanıt katmanı" zinciri tek yönlü kalıyor.

**[L-02] · P1 — Hizmet→vaka bağı tahminle kuruluyor.** Bkz. K-01: pillar eşleşmesi 4 growth hizmetini aynı vakaya gönderiyor, 5 transform hizmetini vakasız bırakıyor.

**[L-03] · P2 — İlgili yazılar aynı kategoriye kilitli.** Makale şablonu 3 ilgili yazıyı yalnız aynı kategoriden seçiyor; kategori dağılımı ağırlıklı `growth` olduğu için kapalı bir küme oluşuyor ve transform tarafı zayıf kalıyor.

**[L-04] · P2 — Makale gövdelerinden P0 hizmet sayfalarına adlı bağlantı yok.** Hizmet sayfalarının kendi içindeki iç link disiplini iyi (CRO sayfasında 34 iç link, kardeş hizmetler + paket + vaka + iletişim); eksik olan makale→para sayfası yönü.

---

## 7. Dönüşüm Mimarisi (Strateji §8)

| Katman | Strateji öngörüsü | Gerçek durum | Bulgu |
|---|---|---|---|
| BOFU | Cal.com CTA hizmet/paket/vaka sayfalarında | Var — hizmet hero'su + sayfa sonu + nav; akış entry popup üzerinden Cal.com'a | — |
| MOFU | 3 lead magnet (CRO checklist, AI hazırlık değerlendirmesi, e-ticaret denetimi) | **Hiçbiri yok** | D-01 |
| MOFU | ADUARDO ortak teklif sayfası (%10 indirim) | Yok | D-02 |
| TOFU→MOFU | Bülten + e-posta serisi (Resend altyapısı mevcut) | Bülten formu yalnız `mailto:` bağlantısı açıyor (`V2Newsletter.tsx`, TODO notlu); liste kaydı yok | D-03 |
| Ölçüm | Cal webhook ile görüşme takibi | Route var, imza doğrulaması çalışıyor, **gövde TODO stub** | D-04 |
| Faz 2 | `/araclar` interaktif araçlar | Yok — CLAUDE.md §6'da bilinçli Faz 2 kararı | Karar, eksik değil |

**[D-01] · P1 — Lead magnet katmanı tamamen boş.** Strateji "organik ziyaretçinin %97'si görüşmeye hazır değil" tespitiyle orta katmanı şart koşuyor; site şu an yalnız yüksek taahhütlü CTA sunuyor. En hızlı kazanım: CRO denetim kontrol listesi (S1 sprintinde zaten planlı).

**[D-02] · P2 — ADUARDO ortak sayfası yok** (bkz. G-09 — kanıt anlatısı da eksik).

**[D-03] · P2 — Bülten fiilen çalışmıyor.** Resend altyapısı var ama yalnız transactional kullanımda.

**[D-04] · P2 — Cal webhook gövdesi boş.** Görüşme dönüşümleri kayıt altına alınamıyor; §9'daki "10-20 Cal.com görüşmesi" KPI'sı ölçülemez.

**[D-05] · P2 — Makale içi CTA yok.** ~1.100 kelimelik yazılarda tek CTA sayfa sonunda, araya giren dört bölümün ardında. Popup yalnız zaman gecikmesiyle tetikleniyor; scroll-derinliği veya çıkış niyeti tetikleyicisi yok.

---

## 8. Ölçüm Altyapısı (Strateji §9)

**[O-01] · P0 — Launch günü sitede çalışan analytics yok.** Kanıt: (a) Google Analytics/GTM entegrasyonu repo'da hiç yok — Burak'ın kararı GA yönünde, kurulum yapılmamış; (b) PostHog client'ı hiçbir yerden başlatılmıyor — `initPostHog()` yalnız tanımlandığı dosyada geçiyor, çağrısı yok; (c) `src/lib/analytics/events.ts` içindeki 7 tipli olayın hiçbiri `track()` ile tetiklenmiyor; (d) popup modülü doğrudan `posthog.capture()` çağırıyor ama başlatılmamış client üzerinden. Sunucu tarafı PostHog (`/api/contact`, `/api/visitor-profile`) çalışıyor. **Etki:** Strateji §9'un tüm KPI seti (gösterim, CTR, magnet lead, Cal.com görüşmesi) ve §8'in funnel'ı ölçülemez; 3. ay revizyon eşiği ("aylık gösterim <8K ise alarm") veri olmadan uygulanamaz. **Öneri:** GA4'ü launch öncesi kur (`@next/third-parties/google` ile tek satır), PostHog'a karar ver — kalacaksa `initPostHog()` bir provider'dan çağrılsın, kalmayacaksa ölü kod ve `.env` anahtarları temizlensin.

**[O-02] · P1 — GSC ve Bing doğrulaması (Sahip: Burak).** Kod tarafında `metadata.verification` alanı boş; doğrulama meta'sı eklenecekse T-01 çözülmeden head'e basılmayacağını unutma — dosya tabanlı doğrulama (`public/`) bu yüzden daha güvenli.

**[O-03] · P2 — Sentry yarım kurulum.** `next.config.ts` `withSentryConfig` ile sarılmış ve kodda 6 yerde `captureException` çağrısı var, ancak `sentry.*.config.ts` / `instrumentation.ts` yok ve hiçbir yerde `Sentry.init()` çağrılmıyor — hata izleme fiilen kapalı.

**[O-04] · P2 — GEO ölçüm turu (bkz. G-10).**

---

## 9. Önceliklendirilmiş Aksiyon Planı

### P0 — Launch öncesi (bugün/yarın sabah)

| # | Aksiyon | Bulgu | Efor | Sahip |
|---|---|---|---|---|
| 1 | Kök layout'tan manuel `<head>`'i kaldır, persona script'ini taşı; metadata'nın head'e bastığını doğrula + regresyon testi | T-01 | S | Kod |
| 2 | Kanonik host kararı (apex vs www) + `NEXT_PUBLIC_APP_URL` production değeri + DNS | LG-01, T-07 | S | Burak + Kod |
| 3 | Eksik `generateMetadata`'ları ekle — en azından hakkımızda, iletişim, üç indeks, paket ve danışman detayları | T-02 | M | Kod |
| 4 | Favicon/ikon/manifest + varsayılan OG görseli | T-03, T-04 | S | Kod |
| 5 | GA4 kurulumu (ya da PostHog'un fiilen başlatılması) — launch günü veri akmalı | O-01 | S | Kod |
| 6 | Eksik 7 redirect + `/kreatif-hizmetler` eşleme kararı | T-06, T-06b | S | Kod + Burak |
| 7 | Yapay zeka sayfası title/H1 terminolojisi | G-08 | S | İçerik |
| 8 | GSC + Bing doğrulama, sitemap submit | O-02, T-11 | S | Burak |

### P1 — Launch sonrası ilk hafta (S1)

| # | Aksiyon | Bulgu | Efor |
|---|---|---|---|
| 9 | llms.txt'i markdown bağlantı formatına çevir + llms-full.txt + robots referansı | G-01, G-02, G-03 | S |
| 10 | Organization+WebSite şemasını layout'a taşı, `sameAs` bağla, Person/LocalBusiness ekle | G-05, G-06 | M |
| 11 | Vaka sayfalarına Article şeması + FAQ + hizmet sayfalarına çift yönlü link | G-07, L-01 | M |
| 12 | Meccanotecnica'yı transform'a taşı veya `relatedCases` alanı ekle | K-01, L-02 | S |
| 13 | Para sayfalarına rakamlı kanıt şeridi | K-02 | M |
| 14 | Sitemap: paket+danışman detayları, içerik tarihli `lastmod` | T-05 | S |
| 15 | Pillar SEO başlıkları + pillar FAQ | T-10, K-05 | S |
| 16 | İki dilli 404 sayfası | T-08 | S |
| 17 | CRO denetim kontrol listesi (ilk lead magnet) + e-posta serisi | D-01 | M |
| 18 | Erişilebilirlik: kontrast, bağlantı adı, `<dl>` semantiği | T-12, G-04 | M |
| 19 | IndexNow kurulumu | T-11 | S |

### P2 — İlk 90 gün (S2-S3)

GEO-editoryal küme içeriklerini öne çekme (K-03) · ADUARDO kanıt anlatısı ve ortak sayfa (G-09, D-02) · bülten backend (D-03) · Cal webhook gövdesi (D-04) · makale içi CTA ve tetikleyiciler (D-05) · ilgili yazı algoritması (L-03) · meta açıklama uzunlukları (K-04) · Sentry init (O-03) · GEO ölçüm rutini (G-10) · `seo:audit`'i CI'a bağlama.

---

## 10. Ekler

**Kanıt komutları:** `NEXT_PUBLIC_APP_STAGE=production pnpm build && pnpm start -p 3100` · `pnpm seo:audit --all --base http://localhost:3100` (24/24 PASS, exit 0) · sayfa başına `curl` ile `<title>`/canonical/hreflang/JSON-LD çıkarımı · `curl` ile eski URL zincir takibi (`%{num_redirects}`, `%{url_effective}`) · Chrome DevTools MCP `lighthouse_audit` (mobil) ve `performance_start_trace` · `document.head.querySelector` ile DOM konum doğrulaması.

**Denetim aracının kapsam sınırı:** `scripts/seo-audit.ts` yalnız `SERVICES` üzerinden gider — pillar, vaka, makale ve statik sayfalar kapsam dışı; ayrıca kontrolleri ham HTML üzerinde yaptığı için T-01'i (etiketin head'de olup olmadığı) yakalayamıyor. Aracın `<head>` konum kontrolü ve diğer sayfa tiplerini kapsayacak şekilde genişletilmesi önerilir.

**Sayım özeti:** 12 hizmet · 3 pillar · 4 paket · 9 vaka · 16 makale · 10 danışman · sitemap 98 URL · 206 birim testi geçiyor.

---

## 11. Uygulama Kaydı (2026-08-23 akşamı)

Denetimin ardından, Burak onayıyla, launch kapısındaki P0 kalemlerinin kod tarafı uygulandı. Karar girdileri: kanonik host **apex** (`indoles.com.tr`), `/kreatif-hizmetler` → **growth**, analytics **GA4** (PostHog koduna dokunulmadı).

| Bulgu | Durum | Ne yapıldı |
|---|---|---|
| T-01 | **Çözüldü** | `htmlLimitedBots: /.*/` + manuel `<head>` kaldırıldı, persona script'i body başına taşındı. 12 sayfada normal UA ile doğrulandı |
| T-02 | **Çözüldü** | 9 sayfa tipine `generateMetadata` (indeksler, paket/danışman detayları, hakkımızda, iletişim, KVKK). Hepsi kendi canonical'ı + benzersiz başlık; KVKK `noindex, follow` |
| T-03 | **Çözüldü** | `opengraph-image.tsx` (1200×630, token renkleri) + `buildMetadata`'ya varsayılan `og:image`/`twitter:image`; locale layout'a da eklendi |
| T-04 | **Çözüldü** | `icon.tsx`, `apple-icon.tsx`, `manifest.ts`. `/favicon.ico` bilinçli 404 (`<link rel="icon">` basıldığı için tarayıcı ona düşmez) |
| T-06 / T-06b | **Çözüldü** | 9 yeni redirect (kural 30 → 39); `/kreatif-hizmetler` growth'a alındı |
| G-01 / G-03 | **Çözüldü** | llms.txt llmstxt.org biçimine çevrildi (86 markdown bağlantı, çıplak URL 0); sabit host'lar `SITE_URL`e bağlandı |
| G-08 | **Çözüldü** | AI sayfası title/H1 "Yapay zeka danışmanlığı"; 8 şapkalı kullanım düzeltildi; "yapay zeka ajansı" FAQ'ya doğal biçimde girdi; nav etiketi (`messages/tr.json`), danışman uzmanlığı ve hizmetler açıklaması da hizalandı |
| K-01 / L-02 (kısmi) | **Yara bandı** | `meccanotecnica-umbra-teklif-portali` `build` → `transform`; 5 transform hizmeti ilk kez vaka linki aldı. Kalıcı çözüm hizmet başına `relatedCases` (P1). Yan etki: bu vakanın "benzer vakalar" şeridi kayboldu (başka transform vakası yok) |
| O-01 | **Kısmen** | GA4 `next/script` ile eklendi (yeni bağımlılık yok); yalnız `NEXT_PUBLIC_GA_ID` tanımlı **ve** stage production ise yükleniyor. **Burak: Vercel'de `NEXT_PUBLIC_GA_ID` set edilmeli** |
| LG-01 / T-07 | **Burak'ta** | Kod apex varsayıyor; `NEXT_PUBLIC_APP_URL` production değeri ve DNS yönü Burak'ta |

### Uygulama sırasında bulunan yeni kusurlar (ikisi de launch-blocker'dı, düzeltildi)

**[T-13] — `/icon`, `/apple-icon`, `/opengraph-image` rotaları 404 dönüyordu.** `src/middleware.ts` matcher'ı yalnız uzantılı yolları (`.*\..*`) locale prefix'inden muaf tutuyordu; bu üç rota nokta içermediği için `/tr/icon`'a 307'lenip 404 oluyordu. Yani ikon ve OG görseli eklenmiş olsa bile hiç servis edilemezdi. Matcher lookahead'ine tam eşleşmeyle eklendi.

**[T-14] — Sayfa `openGraph` alanını tanımladığı anda kök `opengraph-image.tsx` devralınmıyor.** Dosyayı eklemek tek başına yetmiyordu; `buildMetadata` ve locale layout'a açık `images` alanı eklendi.

### Açık kalanlar (P1'e taşındı)

- `src/lib/content/articles.ts` içinde şapkalı/eski terminoloji artıkları (dosya başka bir oturumda aktif olarak düzenleniyordu, dokunulmadı)
- Sentry `global-error.js` yok — React render hataları Sentry'ye düşmüyor (build uyarısı)
- Vaka detay sayfasında Article/CaseStudy şeması, vaka FAQ'ları, vaka→hizmet linkleri (G-07, L-01)
- `llms-full.txt` (G-02), robots'tan llms.txt referansı (T-09 — `MetadataRoute.Robots` tipli API serbest satır kabul etmiyor, raw route gerekir)

### Doğrulama (uygulama sonrası)

`pnpm typecheck` temiz · `pnpm test` 245 geçti / 1 atlandı (denetim öncesi 206 idi; yeni regresyon testleri eklendi) · `NEXT_PUBLIC_APP_STAGE=production pnpm build` exit 0 · `pnpm seo:audit --all` 24/24 PASS · 11 eski URL 308 ile doğru hedefte · `/icon`, `/apple-icon`, `/opengraph-image`, `/manifest.webmanifest`, `/llms.txt`, `/robots.txt`, `/sitemap.xml` hepsi 200 · commit/push/deploy yapılmadı.

### P1 dalgası (aynı gece, Burak onayıyla)

| Bulgu | Durum | Ne yapıldı |
|---|---|---|
| G-05 / G-06 | **Çözüldü** | `WebSite` şeması + ana sayfaya ilk kez JSON-LD; `organizationLd`'ye `sameAs` (COMPANY.social); danışman sayfalarına `Person` (`worksFor`, `knowsAbout`); iletişime `ProfessionalService` (geo + çalışma saatleri); hakkımızda'ya Organization+WebPage+Breadcrumb. JSON-LD testleri 13 → 29 |
| G-07 | **Çözüldü** | Vaka detayına `Article` şeması (`about`: müşteri + sektör, `author`/`publisher` → ORG_ID). Doğrulanmamış alanlar (telefon, açık adres, vaka tarihi) bilinçli basılmadı |
| K-02 | **Çözüldü** | Yeni `ServiceCaseProof` komponenti: 12 hizmet sayfasının hepsi ilgili vakadan 3 rakamlı sonucu atıflı gösteriyor (kaynak künyesi + vakaya link). CRO → SOYLU AVM, yapay zeka → Meccanotecnica, build → MKComputer |
| T-05 | **Çözüldü** | Sitemap 98 → **124 URL** (paket ve danışman detayları eklendi); `lastmod` artık içerikten türüyor (tekil değer 1 → 5) |
| T-10 | **Çözüldü** | Pillar SEO başlıkları Türkçeleşti (ör. "Büyüme stratejisi ve pazarlama danışmanlığı"); görünen marka adı "Growth"/"Transform"/"Build" ve H1 korundu |
| T-08 | **Çözüldü** | `[locale]/not-found.tsx` + catch-all rota: TR/EN 404, marka chrome'u içinde, 4 kurtarma bağlantısı, `noindex` |
| G-02 | **Çözüldü** | `/llms-full.txt` (114 KB): hizmet kapsamları, vaka problem/çözüm/sonuç + metrikler, paket detayları, makale özetleri, kadro — TR+EN |
| L-01 (kısmi) | **İyileşti** | Vaka detayındaki "benzer vakalar" katı pillar filtresi yüzünden tek-vakalı disiplinde tamamen boşalıyordu; artık aynı pillar önce, kalan yer diğer vakalarla doluyor. Vaka → hizmet linki hâlâ yok (aşağıya bakınız) |

**Ek düzeltme:** `/tr/danismanlar/hipnoz` (ofis köpeği "Chief Mood Officer" kaydı) sitemap dışı olmasına rağmen 200 dönüyordu. `dynamicParams = false` bu rotada tek başına yetmedi — bilinmeyen slug'ın 404'ü component'in kendi `notFound()` çağrısından geliyordu. Karar veriye bağlandı: yalnız `BOOKABLE_CONSULTANTS` sayfa alıyor. Artık TR ve EN'de 404.

### P1 sonrası açık kalanlar

- **Vaka → hizmet linki (L-01):** vakalardaki `services` alanı hâlâ serbest metin, link değil. Sağlam çözüm vaka kayıtlarına açık `serviceSlugs` alanı eklemek; eşzamanlı ajan çakışması riski nedeniyle bu gece yapılmadı.
- **EN'de metrik biçimi:** `cases.ts` içindeki metrik `value` alanı `Localized` değil. EN sayfalarda `1,5M $`, `%90`, `5 dk` gibi TR biçimleri görünüyor (`$1.5M`, `90%`, `5 min` olmalı). Kanıt şeridi bunu 12 EN hizmet sayfasına taşıdığı için görünürlüğü arttı. EN önceliği stratejide F2-F3 (ay 2-6) olduğundan P1'e bırakıldı.
- **Vaka breadcrumb'ının son kırıntısı `item` taşıyor** — `breadcrumbLd` sözleşmesi "son öğe kendine link vermez" diyor; şema geçerli ama tutarsız.
- `articles.ts` içindeki terminoloji artıkları, Sentry `global-error`, robots'tan llms referansı (T-09).

### P1 sonrası doğrulama

`pnpm test` **279 geçti / 1 atlandı** (gün başında 206) · `pnpm typecheck` temiz · temiz `pnpm build` exit 0 · `pnpm seo:audit --all` 24/24 PASS · 12/12 hizmet sayfasında kanıt şeridi · 9/9 sayfa tipinde JSON-LD (ana sayfa dahil) · sitemap 124 URL / 5 farklı lastmod · `/icon`, `/apple-icon`, `/opengraph-image`, `/manifest.webmanifest`, `/llms.txt`, `/llms-full.txt`, `/robots.txt` hepsi 200 · commit/push/deploy yapılmadı.

### Toparlama dalgası (24 Ağustos, gece)

P1 sonrası bilinçli bırakılan kalemler kapatıldı.

| Bulgu | Durum | Ne yapıldı |
|---|---|---|
| L-01 | **Çözüldü** | `CaseStudyContent`e `serviceSlugs` eklendi; 9 vakanın künyesindeki disiplin etiketleri artık hizmet sayfalarına link (locale'e göre `SERVICES`ten çözülüyor). Hizmet karşılığı olmayan kalemler (SEO/GEO, marka kimliği, prodüksiyon) bilinçli linklenmedi — ilgili hizmetlerin `excludes` listelerinde yer alıyorlar |
| EN metrik biçimi | **Çözüldü** | `metrics[].value` `Localized<string>` oldu; 28 metrik iki dilli (`1,5M $` → `$1.5M`, `%90` → `90%`, `5 dk` → `5 min`). Doğrulandı: TR sayfada `1,5M $`, EN sayfada `$1.5M` |
| Vaka breadcrumb | **Çözüldü** | Son kırıntı artık `item` taşımıyor; `breadcrumbLd` sözleşmesine uydu |
| T-09 | **Çözüldü** | `robots.txt`'te 10 AI crawler (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot vb.) açıkça `Allow` ile listelendi — `docs/08` §5'in "şeffaf, opak değil" duruşu artık okunur. Kısıt listesi her blokta tekrarlandı: robots.txt'te en özgül blok kazanır |
| Sentry `global-error` | **Çözüldü** | `src/app/global-error.tsx` eklendi — kök layout çöktüğünde beyaz sayfa yerine marka ekranı, `Sentry.captureException` ve kurtarma bağlantıları |
| Makale terminolojisi | **Çözüldü** | Kalan tek "AI danışmanlığı" bağlantı metni hizmet adıyla eşitlendi |

**Not:** `llms.txt` referansı robots.txt'e eklenmedi — `MetadataRoute.Robots` tipli API serbest satır kabul etmiyor, raw route'a çevirmek launch gecesi gereksiz risk. Açık kalem olarak duruyor.

### Yeni launch-gate riski (uygulama sırasında ortaya çıktı)

**[LG-02] · P0 — `NEXT_PUBLIC_APP_STAGE` production değilse site komple indekslenmez.** Doğrulama sırasında bir build bu değişken olmadan alındı ve servis edilen `robots.txt` `User-Agent: * / Disallow: /` oldu; kök layout da aynı değişkene bağlı `noindex` basıyor. `.env.local` içindeki değer `development`, yani değişken production ortamında AÇIKÇA set edilmezse yayın gününde sitenin tamamı aramaya kapalı çıkar. **Bu, bu denetimdeki en yüksek maliyetli tek konfigürasyon hatasıdır.** Vercel'de `NEXT_PUBLIC_APP_STAGE=production` doğrulanmadan deploy edilmemeli; deploy sonrası ilk kontrol `curl https://<host>/robots.txt` olmalı.

### Toparlama sonrası doğrulama

`pnpm test` **287 geçti / 1 atlandı** (gün başında 206) · `pnpm typecheck` temiz · `NEXT_PUBLIC_APP_STAGE=production pnpm build` exit 0 · `pnpm seo:audit --all` 24/24 PASS · metadata `<head>`'de · sitemap 124 URL / 5 lastmod · JSON-LD 9/9 sayfa tipi · `/icon`, `/apple-icon`, `/opengraph-image`, `/manifest.webmanifest`, `/llms.txt`, `/llms-full.txt`, `/robots.txt` 200 · robots'ta 10 AI ajanı · vaka künyeleri hizmetlere linkli · EN metrikler EN biçiminde · `hipnoz` 404, bilinmeyen slug 404, eski URL 308 · commit/push/deploy yapılmadı.

**Bağlam notu:** Bu gece repoda paralel bir oturum da çalıştı ve ADR-021'i uyguladı (makale konu taksonomisi + PostHog kaldırılıp GA4'ün tek ölçüm sağlayıcısı olması). Bu denetimin O-01 bulgusu ve Burak'ın GA kararıyla örtüşüyor; `docs/12-analytics-measurement.md` ve CLAUDE.md o oturumda güncellendi.

---

## 12. SSS + Kalite Güvencesi Dalgası (24 Ağustos)

Burak'ın talimatı: **her SSS en az 10 soruya cevap versin**; performans/estetik dengesine dokunulmasın; Cal.com'a yatırım yapılmasın (kendi takvim sistemi gelecek); yeni sayfa/yazı girilmesin; başlık ve açıklamalar keyword verisiyle kalibre edilsin.

### SSS genişletmesi

| Yüzey | Önce | Sonra | Not |
|---|---|---|---|
| 12 hizmet | 5 | **11** | Uzun kuyruk kelimeler soru metnine yerleşti (`ab testi nedir`, `roas nedir`, `mvp nedir`, `iş zekası nedir`…) |
| 16 makale | 4 (ikisi 8) | **10-11** | GEO kümesinin hiç geçmeyen ifadeleri ilk kez içeriğe girdi: `llms.txt`, `yapay zeka seo`, `google ai overviews`, `answer engine optimization` |
| 4 paket | 1-2 | **11** | Persona-aware: soru başına 4 metin (industrial/commerce × tr/en) = 176 cevap |
| 9 vaka | **0** | **10-12** | `CaseStudyContent.faq?` alanı açıldı; render + `FAQPage` şeması |
| 3 pillar | **0** | **11** | `PillarContent.faq?` alanı açıldı; "pillar düzeyinde SSS verisi yok" yorumu kalktı |

Toplam ~700 yeni soru-cevap metni, tamamı iki dilli ve `FAQPage` şemasına basılıyor (canlı JSON-LD ile doğrulandı).

**Kalite kuralları gevşetilmedi.** Repoda zaten kodlanmış iki GEO kuralı (`services-content.test.ts:198-225`) tüm yüzeylere yayıldı: cevap **anafora ile başlayamaz** (alıntılandığında kendine yetmeli, docs/08 §8.1) ve **≥40 kelime** olmalı, her dilde ayrı. İhlaller kopyayı düzelterek çözüldü. Yalnız "en fazla 6 soru" sınırı Burak'ın talimatıyla ≥10'a çevrildi.

Paket SSS'leri `<details>` içinden çıkarılıp açık `<dl>`'ye alındı — makale şablonunun gerekçesiyle aynı: kapalı içeriği AI motorları ve ekran okuyucular atlayabiliyor. Aynı repodaki zıt karar giderildi.

> **Düzeltme (2026-08-27):** Bu kayıt artık geçerli değil. Değişiklik uygulandıktan kısa süre sonra, soru sayısı ≥10'a çıkıp sayfa okunabilirliği çöktüğü için karar tersine çevrildi: beş yüzeyin tamamı (hizmet, pillar, vaka, makale, paket) native `<details>`'e döndü. Gerekçe ve seçenek karşılaştırması **ADR-023**'te; bulgu kaydı `docs/19-seo-geo-audit-2026-08-27.md` G-12'de. Kararın dayandığı asıl ayrım: native `<details>` kapalıyken de cevap metnini ham HTML'de bırakır (JS akordiyonu bırakmaz), yani "kapalı içeriği AI motorları atlar" endişesi bu yapıda geçerli değil.

### Aktif zarar veren dört kusur

| Kusur | Düzeltme |
|---|---|
| CRO sayfası "İsa Peygamber: ilk pazarlama" yazısına link veriyordu | `service-detail.tsx:195` pillar filtresi ADR-021'in `topics.serviceSlug` eşlemesine bağlandı. **Filler eklenmedi:** hizmete ait konu yoksa blok hiç render edilmiyor — hizmet sayfasında ilgisiz yazı, bir yetkinlik iddiasını çürütüyor |
| EN ana sayfadaki vaka/pillar linkleri 307'den geçiyordu | `WorkCard`, `FeaturedWork`, `Pillars` mevcut `localeHref()` yardımcısına geçti |
| Ana sayfada iki `<h1>` | Accent katmanı `<div>`e çevrildi; GSAP koreografisi (`v2-letter[data-i]`) korundu |
| Persona metinleri ayırıcısız birleşiyordu (`…demek.Bedava…`) | Gizli varyantın içine, aynı CSS kuralıyla gizlenen bir ayırıcı kondu. Mimari değişmedi; `display:none` mekanizması bozulmadı |

### Metadata kalibrasyonu (keyword verisiyle)

- **`/tr/hizmetler` yeniden hedeflendi:** başlık "Hizmetler" → "İş geliştirme danışmanlığı — 12 uzmanlık". Gerekçe: `iş geliştirme` **1B-10B hacim, düşük rekabet** ve keyword haritasında hedefi bu sayfa — TR setindeki en büyük alınabilir hacim boştaydı. Sayfada görünen başlık "Hizmetler" olarak kaldı.
- **Makale ve vakalara `seo?: { title?, description? }` alanı açıldı.** Görünen editoryal başlıklar korunarak arama başlıkları kısaltıldı: 32 makale URL'i 61-109 → **46-58 karakter**; 18 vaka URL'i başlık ≤60, açıklama 185-399 → **143-158**. Her vaka açıklamasındaki rakam o vakanın kendi `metrics` verisinde geçiyor (test bunu doğruluyor).
- 4 indeks sayfasına (vakalar, yazılar, paketler, danışmanlar) JSON-LD eklendi: Organization + WebPage + BreadcrumbList + **ItemList**. Bu sayfalarda hiç yapısal veri yoktu.
- KVKK sayfasına JSON-LD eklendi; yazılar indeksindeki sabit yazı sayısı (`16 yazı`) `ARTICLES.length` ile dinamikleştirildi.

### Kalite güvencesi — yapısal boşluk kapandı

**CI kuruldu** (`.github/workflows/checks.yml`): lint → typecheck → test → build → **robots smoke** → `seo:audit`. Smoke adımı tek satır ama bu denetimin en pahalı hatasını yakalıyor: `NEXT_PUBLIC_APP_STAGE` yanlışsa `robots.txt` `Disallow: /` basar ve site komple indekslenmez (LG-02).

**`seo:audit` genişletildi:** 13 → **20 kural**, 24 → **124 URL**, 8 sayfa-tipi profili. Yeni kurallar bugüne kadar kaçan hata sınıflarını yakalıyor: `head-placement` (T-01'i yakalardı), `canonical-self` (T-02), `og-image` (T-03), `robots-meta` (LG-02), `hreflang-reciprocal`, `html-lang`, `word-count`. Kapsam sitemap'ten okunuyor; redirect zincirleri (`redirect: "manual"`) FAIL sayılıyor.

Üç kural fazla katıydı ve site doğruydu — kural kalibre edildi, gerekçeleri kodda: pillar persona kullanımı kasıtlı (seçim katmanı), `ProfessionalService` Organization'ı aynı `@id` ile genişletiyor, KVKK'nın `noindex`i bilinçli (ayrı `legal` profili açıldı).

### Sonuç

| Ölçüm | Denetim öncesi | Şimdi |
|---|---|---|
| `seo:audit` kapsamı | 24 URL / 13 kural | **124 URL / 20 kural** |
| Denetim sonucu | 24/24 PASS (dar kapsam) | **104 PASS · 20 WARN · 0 FAIL**, exit 0 |
| Birim testi | 206 | **424** |
| SSS taşıyan sayfa | 28 | **44** |
| FAQPage şeması | hizmet + makale | + vaka, pillar, paket |
| CI | yok | lint/typecheck/test/build/robots/audit |

Kalan 20 uyarı yalnız `word-count`: 16 danışman profili, 2 KVKK, 2 kısa statik sayfa — doğaları gereği kısa, çıkış kodunu etkilemiyor.

`pnpm typecheck` temiz · `pnpm test` 424 geçti / 1 atlandı · `NEXT_PUBLIC_APP_STAGE=production pnpm build` exit 0 · `pnpm seo:audit` 124/124, FAIL yok · commit/push/deploy yapılmadı.

### Açıklama katmanı tamamlandı (aynı gün, ek tur)

Kalan iki açıklama boşluğu da kapatıldı — ikisinde de mantık aynı: **başlık bir anahtar kelimeyi alır, açıklama ikincisini** — böylece her sayfa iki arama yüzeyi kazanır.

| Yüzey | Önce | Sonra |
|---|---|---|
| 16 makale `seo.description` | boş (metadata `excerpt`i 160'a kırpıyordu; 12 makalede SERP'e cümle ortasında kesilmiş metin gidiyordu) | **32/32 açıklama, 140-160 karakter**, hiçbiri kırpılmıyor |
| 12 hizmet `seo.description` | 118-143 (ort. 131) | **150-159**, hepsi ikincil kelime taşıyor |

Yerleşen ikincil kelimelerden örnekler: CRO açıklaması `sepet terk` + `a/b testi`; yapay zeka sayfası `kurumsal yapay zeka`; performans pazarlama `Google Ads danışmanlığı` (küme 1B-10B); özel yazılım `web uygulaması geliştirme`; GEO yazısı `google ai overviews` + `chatgpt`; ajans seçimi yazısı `dijital reklam ajansı` (1B-10B).

Uydurma koruması teste bağlandı: **açıklamada geçen her sayı, o içeriğin kendi gövdesinde geçmek zorunda** (makalelerde `blocks` metinleri + başlık + SSS üzerinden, iki dilin birleşimiyle; yıllar için gerekçeli muafiyet). Ayrıca açıklamanın `excerpt` veya `seo.title` kopyası (ya da excerpt'in kırpılmış hâli) olamayacağı test ediliyor.

Hizmet `seo.entities` alanına dokunulmadı — `seo:audit`'in "entity gövdede geçmeli" kuralı riske girmedi.

**Son durum:** `pnpm test` **427 geçti / 1 atlandı** · `pnpm typecheck` temiz · `NEXT_PUBLIC_APP_STAGE=production pnpm build` exit 0 · `pnpm seo:audit` **124 URL, 104 PASS / 20 WARN / 0 FAIL**, exit 0.

### Bu dalgada kapanmayanlar

- **Telefon numarası placeholder** (`company.ts:15`, `+90 212 111 22 33`) her sayfanın topbar'ında `tel:` linki olarak canlı — gerçek numara Burak'tan bekleniyor.
- **Ölçüm zinciri:** CTA tıklaması ölçülmüyor, UTM doldurulmuyor, cookie banner / Consent Mode yok (docs/12 §9.1 ve docs/14 §3 opt-in vaat ediyor). Cal.com webhook'u kapsam dışı bırakıldı — kendi takvim sistemi gelecek (Burak kararı).
- **İçerik motoru:** 12 haftalık takvimin 24 slotundan ~%10'u karşılanmış; `yapay-zeka` konusunda hâlâ 0 yazı, GEO kümesinde 1. Yeni yazı bu turda bilinçli olarak girilmedi.
- Per-locale sitemap index (docs/08 §4.1), robots'tan llms.txt referansı, EN keyword hedeflemesi (F2).
