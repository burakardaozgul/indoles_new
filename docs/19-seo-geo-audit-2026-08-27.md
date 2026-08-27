# SEO ve GEO Denetim Raporu — Re-Audit (Launch Öncesi 2. Tur)

> **Tarih:** 2026-08-27 · **Bağlam:** Site henüz yayında değil; canlıda eski WordPress duruyor, deploy hedefi Vercel'den Cloudflare Workers'a (OpenNext) değişti
> **Önceki denetim:** `docs/17-seo-geo-audit-2026-08.md` (23-24 Ağustos; P0-P1 dalgaları uygulanmış)
> **Otorite:** `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.6) · `docs/strateji/Rakip-Analizi-P0-SERP.md` · `docs/08-seo-i18n-strategy.md` · Keyword-Planner CSV'leri
> **Statü:** Denetim raporu + uygulama kaydı. Denetim sırasında kod değiştirilmedi; ardından Burak'ın kararlarıyla **on üç kalem** uygulandı ve her biri ilgili bulgunun altına "kapanış kaydı" olarak işlendi. Karar notları: persona görünürlüğü §9, `seo.entities` §9b. Kalan aksiyonlar §8'de.
> **Numara notu (güncellendi 2026-08-27):** Strateji v1.4'ün `docs/18` diye refere ettiği 24 Ağustos denetimi o gün repo'ya hiç yazılmamıştı. Rapor aynı gün oturum kaydından **eksiksiz kurtarıldı** ve `docs/18-seo-geo-puanlama-2026-08-24.md` olarak repoya alındı (o günkü hâliyle; tarihsel kayıt). Numara zinciri tamam: 17 → 18 → 19. docs/18'in bu denetimde yakalanmayan bulguları §9'da çapraz kontrol edildi.

---

## 0. Yönetici Özeti

Kod tabanı 23-24 Ağustos dalgalarının kazanımlarını korumuş durumda: önceki denetimin dokuz "çözüldü" kaydının tamamı regresyonsuz doğrulandı, `seo:audit` 124 URL'de 0 FAIL veriyor, TR/EN içerik paritesi alan düzeyinde eksiksiz. **Sorun kodun içinde değil, kodun dışında:** deploy zinciri ve cutover henüz kurulmadı, P0 kümelerini destekleyecek içerik motoru henüz çalışmıyor.

> **Aynı gün uygulananlar (2026-08-27):** Bu denetimin ardından Burak'ın kararlarıyla **on bir kalem** kapandı.
>
> *Karar gerektirenler:* **LG-03** (Cloudflare zone'unun AI bot engeli kaldırıldı, doğrulandı) · **C-05** (başlık çakışması: ana sayfa ve hakkımızda yeni başlıklara geçti, strateji §2 P1'deki çelişki de düzeltildi) · **C-12** (iki EN kelimesi yerleşti, oran 13/15) · **O-05** (`brief_submitted` bağlandı; `homepage_hero_viewed` taksonomiden çıkarıldı) · **G-12** (ADR-023 yazıldı).
>
> *Doğrudan uygulananlar:* **C-13** (EN hedefleri ilk kez regresyon testi altında — 9 kelime-sayfa çifti) · **C-03** (hizmet→vaka eşlemesi künye-öncelikli; 5 hizmetin vakası düzeldi) · **C-01** ("yapay zeka ajansı" kendi karşı-konumlandırma sorusunu aldı) · **C-07** (iki GSC yazım varyantı yerleşti) · **G-11** (per-locale `/tr/llms.txt` + `/en/llms.txt`) · **T-08b + T-15** (404 ilk HTML'i doğru dilde, canonical mirası kesildi).
>
> Ayrıca kayıp sanılan `docs/18` kurtarılıp repoya alındı ve bu denetimin yakalamadığı beş bulgusu §9'da çapraz kontrol edildi. Test süiti 602 → **634** (+3 e2e), unit 372 → **388**. `seo:audit` her turda 124 URL / 0 FAIL.

| Alan | Durum | Açık P0 | Not |
|---|---|---|---|
| Önceki denetim kazanımları | **İyi** | 0 | 9/9 "çözüldü" kaydı regresyonsuz; telefon placeholder'ı da kapandı |
| Canlı zone / AI erişimi | **Çözüldü** | 0 | LG-03 kapandı; cutover sonrası tekrar doğrulanacak |
| Deploy zinciri (Cloudflare) | **Kritik** | 1 | LG-04: Next sürümü adaptör aralığının dışında, wrangler config ve deploy yolu yok, env zinciri tanımsız (LG-02 canlı risk) |
| Host / cutover | **Karar verildi** | 0 | Kanonik host `www` (ADR-024); kod ve tüm SEO yüzeyleri doğrulandı. Cutover işlemi Burak'ta |
| Persona görünürlüğü | **Karar verildi** | 0 | Seçenek B (crawler'a nötr metin); uygulama ayrı oturumda — §9 |
| Metadata / indekslenebilirlik | **İyi** | 0 | T-01..T-06, T-10 sağlam; 404 yüzeyi de düzeldi |
| 404 yüzeyi | **İyi** | 0 | T-08b/T-15 çözüldü; kalan tek kalem `<html lang>` (Next 15.5 sınırı) |
| GEO on-site (llms, JSON-LD, SSS) | **İyi** | 0 | G-01..G-07 sağlam, G-12 karara bağlandı, G-11 çözüldü; kalan P2 cila paketi (G-14..17) |
| İçerik–keyword uyumu (TR) | **İyi** | 0 | 11/11 ticari kelime yerinde; çakışma, "yapay zeka ajansı" ve GSC yazım varyantları çözüldü |
| İçerik–keyword uyumu (EN) | **İyi** | 0 | 13/15 yerinde, 9 kelime test korumalı; kalan 3'ü bilinçli bırakılmış |
| İçerik motoru / takvim | **Zayıf** | 0 | 3/24 slot; `yapay-zeka` 0 makale, GEO kümesi 1 makale; 7/12 hizmette ilgili-yazı bloğu boş (C-02) |
| İç link mimarisi | **İyi/Kısmi** | 0 | Hizmet→vaka künye-öncelikli oldu (C-03); dört hizmet künyesiz, vaka→makale yönü yok |
| Ölçüm | **İyi/Kısmi** | 0 | GA4+Consent Mode kurulu, dönüşüm olayı bağlandı; Sentry init'siz (O-03) |
| E-E-A-T | Zayıf | 0 | G-01 (docs/18 §8): 10 danışmanın 1'inde LinkedIn — şema hazır, veri eksik |

**Tek cümlelik teşhis:** İçerideki ev ödevi büyük oranda bitti; launch'ı artık üç şey taşıyor — deploy zincirinin kurulması, cutover planı ve persona görünürlüğü kararı; onların arkasında da henüz başlamamış içerik üretimi.

---

## 1. Kapsam ve Yöntem

| Ortam | Ne için kullanıldı |
|---|---|
| **Lokal production build** — `NEXT_PUBLIC_APP_STAGE=production NEXT_PUBLIC_APP_URL=https://indoles.com.tr pnpm build` + `pnpm start -p 3100` (exit 0) | Tüm teknik ve GEO denetimlerinin kaynağı; canonical'lar production host ile üretildi |
| **Canlı site** — `https://indoles.com.tr` + `https://www.indoles.com.tr` | Zone davranışı, eski URL envanteri, WordPress durumu |
| **Repo statik analizi** | İçerik katmanı, strateji uyumu, analytics/consent kablolaması, deploy config |
| **`pnpm seo:audit --all --base http://localhost:3100`** | 124 URL × 20 kural |
| **Hedefli test koşuları** | keyword-coverage (16), en-spelling (20), i18n parity (1), SSS kalite testleri (71) — tümü PASS |

Denetim dört paralel iş paketi olarak yürütüldü: teknik SEO + altyapı, GEO hazırlığı, içerik–keyword uyumu (TR+EN), canlı site envanteri. Bulgu önekleri docs/17 ile uyumlu: LG launch-gate · T teknik · G GEO · C içerik-keyword (docs/17'deki K'nin devamı) · L iç link · O ölçüm.

---

## 2. Launch-Gate Durumu

### 2.1 Yeni ve süren launch-gate bulguları

**[LG-03] · P0 — ÇÖZÜLDÜ (2026-08-27, Burak) — Cloudflare zone'u AI botlarını engelliyor; GEO stratejisi zone ayarıyla çelişiyor.**

> **Kapanış kaydı:** Burak aynı gün Cloudflare'de hem AI bot engellemesini hem managed robots.txt özelliğini kapattı. Doğrulandı: `curl https://www.indoles.com.tr/robots.txt` çıktısında GPTBot / ClaudeBot / CCBot / Google-Extended / Content-Signal eşleşmesi **0**; apex de yönlendirme sonunda temiz. Artık WordPress'in kendi robots.txt'i servis ediliyor. **Cutover sonrası tekrar doğrulanmalı** — yeni site aynı zone'a çıkacağı için deploy sonrası ilk kontrol yine bu olmalı.

Bulgunun orijinal kaydı (tarihsel bütünlük için):
Kanıt (canlı, 2026-08-27): hem `indoles.com.tr/robots.txt` hem `www.indoles.com.tr/robots.txt` çıktısının başına Cloudflare "Managed Content Signals" bloğu enjekte ediliyor:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: GPTBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: Google-Extended
Disallow: /
```

Tam engel listesi: Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, CloudflareBrowserRenderingCrawler, Google-Extended, GPTBot, meta-externalagent. robots.txt'te en özgül blok kazandığı için bot-özel `Disallow: /` blokları genel `Allow`'u eziyor — bu botlar siteye fiilen kapalı.

**Etki:** Uygulamanın kendi `robots.ts`'i 10 AI crawler'ını açıkça `Allow` ile listeliyor (docs/17 T-09 çözümü) ve strateji GEO kümesini P0 trafik motoru sayıyor (§2.0 karar 2, §5). Yeni site aynı zone'a (Cloudflare Workers) deploy edileceği için bu zone ayarı kapatılmazsa **uygulamanın robots.txt'i yayına hiç çıkamaz** — Cloudflare kendi yönettiği içeriği servis etmeye devam eder. GPTBot'un engellenmesi ChatGPT görünürlüğünü, ClaudeBot Claude'u, CCBot Common Crawl üzerinden beslenen tüm modelleri, Google-Extended ise Gemini/AI Overviews eğitim tarafını keser. GEO'yu ana kaldıraç sayan stratejide bu, launch'ta telafisi en pahalı tek ayardır.

**Öneri:** Cloudflare dashboard'da zone'un "Content Signals Policy" / "Block AI bots" / managed robots.txt özelliğini kapat (veya en azından engel listesini boşalt); deploy sonrası ilk kontrol `curl https://indoles.com.tr/robots.txt` çıktısının uygulamanın ürettiği içerikle birebir aynı olduğunu doğrulamak. **Sahip: Burak (Cloudflare erişimi).** **Strateji:** §2.0 karar 2, §5; docs/08 §5.

**[LG-04] · BÜYÜK ÖLÇÜDE ÇÖZÜLDÜ (2026-08-27) — Cloudflare Workers'a giden deploy yolu fiilen yok; LG-02 riski canlı.**

> **Kapanış kaydı.** Zincir kuruldu:
> - **Next 15.5.15 → 15.5.24** — adaptörün peer aralığına (`>=15.5.21`) girdi; typecheck temiz, 634 test geçti
> - **`open-next.config.ts`** — bilinçli olarak boş: site SSG, ISR yok, dolayısıyla R2/Durable Object katmanları kurulmadı (gerekçe dosyada; ISR gelirse genişletilecek)
> - **`wrangler.jsonc`** — `nodejs_compat` + `global_fetch_strictly_public`, assets binding (statik varlıklar Worker'a uğramadan servis edilir), `compatibility_date` kurulu workerd'a göre güncel, observability açık. **Custom domain bloğu bilinçli yorumda** — açıldığı an `www` WordPress'ten kopar, o yüzden cutover'a bırakıldı
> - **`.gitignore`** — `.open-next/`, `.wrangler/`, `.dev.vars`, `cloudflare-env.d.ts`
> - **LG-02 yapısal olarak çözüldü:** `NEXT_PUBLIC_APP_STAGE` ve `NEXT_PUBLIC_APP_URL` artık `package.json`'daki `cf:build` script'ine gömülü — deploy eden kişinin hatırlamasına bağlı değil. Ayrı bir `cf:build:preview` script'i `stage=preview` kullanıyor, böylece test dağıtımları `noindex` çıkıyor ve `workers.dev` adresi indekslenmiyor
> - **`opennextjs-cloudflare build` başarılı** (exit 0): worker üretildi, 25 MB asset paketlendi
>
> **Dağıtım yapıldı ve doğrulandı.** İki engel aşıldı: (a) ilk token geçersizdi (`code 9109`), yenisiyle çözüldü; (b) ilk dağıtım *"Worker exceeded size limits"* ile düştü — paket 3,65 MB, ücretsiz plan sınırı 3 MB. Ölçüm Sentry'nin suçlu olmadığını gösterdi (40 KB); ağırlık `@vercel/og` + `fontkit` (~2,2 MB) idi ve bu makine **tek, değişmeyen** bir marka kartı üretiyordu. Üç görsel üreticisi statik PNG'ye çevrildi (çıktı birebir aynı, SEO kaybı yok) → **2,98 MB**, sınırın altında.
>
> **Sonuç:** `indoles-web` Worker'ı yayında, açılış süresi **36 ms**. Doğrulama için `preview.indoles.com.tr` custom domain olarak bağlandı — `*.workers.dev` Türkiye'deki ağlardan HTTPS ile açılmıyor (SNI engellemesi), kendi alan adımız açılıyor. www'ye ve WordPress'e dokunulmadı.
>
> **`scripts/cf-smoke.sh` — 29/29 geçti.** Kritik doğrulamalar: metadata `<head>` içinde (T-01 OpenNext altında da sağlam) · canonical `www` · sitemap 124 URL, apex kalıntısı yok · per-locale llms.txt 200 · 404 kendi dilinde, karşı dil sızıntısı yok · 301'ler 308 ile doğru hedefte · preview adresi bilinçli olarak `noindex`.
>
> **Açık kalan:** (1) sunucu sırları (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `SENTRY_DSN`) `wrangler secret put` ile; `NEXT_PUBLIC_GA_ID` build değişkeni olarak; (2) cutover — `wrangler.jsonc` `routes` dizisine `www.indoles.com.tr` eklenir (satır hazır, yorumda), WordPress kapatılır, GSC'ye yeni sitemap verilir.
>
> **Boyut uyarısı:** kalan pay ~15 KB. Yeni sunucu bağımlılığı eklemeden önce `pnpm exec wrangler deploy --dry-run` ile ölçülmeli; sayfa başına dinamik OG istenirse Workers Paid planı gerekir.

Bulgunun orijinal kaydı:
Kanıt zinciri:
- Kurulu `next@15.5.15`; `@opennextjs/cloudflare@1.20.2` peer aralığı `>=15.5.21 <16 || >=16.2.11` — kurulu sürüm **aralık dışında** (commit `ae1b041` mesajı da kabul ediyor: "yükseltme ayrı adımda").
- `wrangler.jsonc/toml` ve `open-next.config.ts` yok; `package.json`'da deploy script'i yok; `.github/workflows/`'ta yalnız `checks.yml` var (deploy workflow'ları README'de "Yazılmadı").
- `NEXT_PUBLIC_APP_STAGE`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GA_ID` — üçü de `.env.example`'da satır olarak yok; Cloudflare tarafında nereden set edilecekleri tanımsız. `src/app/robots.ts` stage `production` değilse tüm siteyi `Disallow: /` yapıyor (LG-02) ve `layout.tsx` GA4'ü aynı koşula bağlıyor — yani env zinciri kurulmadan yapılacak ilk deploy, siteyi indeks dışı ve ölçümsüz çıkarır.
- `htmlLimitedBots: /.*/`, `MetadataRoute.Robots/Sitemap` ve OG görsel route'unun OpenNext adaptörü altında birebir aynı davranacağı henüz hiç doğrulanmadı (lokal doğrulamalar `next start` üzerinde).

**Öneri:** Sıra: Next yükseltmesi (≥15.5.21) → `open-next.config.ts` + wrangler config → env'lerin `[vars]`/secret olarak tanımı → preview deploy → `curl` ile robots/sitemap/OG/metadata smoke → DNS cutover. Bu zincir tamamlanmadan launch tarihi verilmemeli. **Strateji:** §3.

**[LG-01] · KARARA BAĞLANDI (2026-08-27, Burak) — Kanonik host kararı canlıya uygulanmadı.**

> **Kapanış kaydı:** Kanonik host **`www.indoles.com.tr`** olarak belirlendi (önceki apex varsayımı geçersiz) ve **ADR-024**'e yazıldı. Gerekçe: eski sitenin GSC geçmişi, backlink'leri ve GBP bağlantısı `www`'de; canlı DNS zaten apex→www yönünde 301'liyor — apex'e taşımak launch haftasında gereksiz bir sinyal kaybı riski olurdu. `src/lib/seo/site.ts`'teki tek sabit değiştirildi ve **tüm yüzeylere yayıldığı doğrulandı:** canonical `www`, sitemap 124 URL `www`, robots `Host:`/`Sitemap:` satırları `www`, llms.txt'te 90 `www` bağlantı ve **0 apex kalıntısı**. `llms.test.ts` sabit host yerine `SITE_URL`'e bağlandı — host kararı bir daha değişirse test kırılmaz.
>
> **Açık kalan:** DNS/cutover işleminin kendisi (WordPress kapanışı, GSC'ye yeni sitemap) hâlâ Burak'ta.

Bulgunun orijinal kaydı:
Kod apex varsayıyor (`https://indoles.com.tr`; canonical, sitemap, llms.txt tümü bu host'la üretiliyor); canlı DNS hâlâ `apex → 301 → www` yönünde ve www'de WordPress + LiteSpeed duruyor. Cutover planı (WP kapanışı, www→apex 301, Cloudflare SSL/redirect kuralı) yazılı değil. Yanlış yönlü launch, 124 URL'lik sitemap'in tamamını redirect arkasında bırakır. **Sahip: Burak (DNS/Cloudflare).**

**[LG-05] · ÇÖZÜLDÜ (2026-08-27) — Hosting kararının yazılı kaydı yok.**

> **Kapanış kaydı:** **ADR-024** yazıldı (Cloudflare Workers + OpenNext, kanonik host `www`); ADR-012 (Vercel) "Superseded by ADR-024" olarak işaretlendi. `.env.example`'a `NEXT_PUBLIC_APP_STAGE` ve `NEXT_PUBLIC_APP_URL` ilk kez belgelendi — LG-02 uyarısı (stage yanlışsa site komple indeks dışı) doğrudan dosyanın içine yazıldı; `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ZONE_ID` eklendi. API token'ı bilinçli olarak repoya alınmadı: `wrangler secret` veya CI secret'i olarak verilecek. **Açık kalan:** CLAUDE.md §4 hâlâ "Deploy: Vercel" diyor — o dosya yalnız Burak'ın onayıyla güncelleniyor.

Bulgunun orijinal kaydı:
Commit `ae1b041` "Dağıtım Cloudflare Workers'a taşınıyor (bkz. hosting kararı)" diyor; böyle bir doküman repo'da yok. ADR-012 hâlâ Vercel, CLAUDE.md §4 hâlâ "Deploy: Vercel (eu-central)". CLAUDE.md §3'ün kendi ADR disiplini ihlal ediliyor; ayrıca `active_context.md` 19 Ağustos'ta kalmış (yanlış branch bilgisi veriyor). **Öneri:** ADR-023 (Cloudflare Workers/OpenNext kararı, gerekçe, Vercel'den vazgeçme nedeni) + CLAUDE.md ve active_context güncellemesi.

### 2.2 Strateji §3 launch listesi — güncel durum

| # | Kalem | Durum | Not |
|---|---|---|---|
| 1 | 301 haritası | **Kod hazır** | 39 kural; 7/7 örneklenen eski URL 308 ile doğru hedefte. Canlıda eski URL'ler 200 dönüyor (12/13) — sinyal yerinde, cutover'da devralınacak |
| 2 | Sitemap + GSC | **Kod hazır / Burak** | 124 URL, 5 farklı lastmod, 372 hreflang bağı. GSC submit cutover sonrası; eski Yoast sitemap'i (67 URL) o gün kaldırılmalı |
| 3 | llms.txt | **Kısmi** | Kök llms.txt + llms-full.txt sağlam; per-locale sürümler yok (G-11). Eski WP sitesinde de bir `/llms.txt` 200 dönüyor — cutover'da yenisiyle değişecek |
| 4 | JSON-LD doğrulama | **İyi** | 19 sayfada parse hatası 0, duplicate yok; kalan kusurlar P2 (G-14, G-17) |
| 5 | Title/meta denetimi | **İyi** | Benzersiz title + self-canonical 10/10 örneklem; keyword-coverage testi 16/16 |
| 6 | Bing + IndexNow | **Eksik** | Repo'da doğrulama/anahtar/submit izi yok (T-11 sürüyor) |
| 7 | GBP | **Burak** | Kod dışı |
| 8 | CWV | **Önceki ölçüm geçerli** | Bu turda yeniden ölçülmedi; Workers'a geçişte production'da tekrar ölçülmeli |

---

## 3. Teknik SEO

### 3.1 Regresyon tablosu (docs/17 "çözüldü" kayıtları)

| Bulgu | Konu | Durum |
|---|---|---|
| T-01 | Metadata `<head>`'de | **Sağlam** — 10 sayfada byte-offset doğrulaması; `htmlLimitedBots: /.*/` yerinde |
| T-02 | Sayfa tipi metadata'ları | **Sağlam** — benzersiz title + self-canonical |
| T-03 | OG görseli | **Sağlam** — `/opengraph-image` 200, og/twitter etiketleri dolu |
| T-04 | Icon/manifest | **Sağlam** — icon, apple-icon, manifest 200 |
| T-05 | Sitemap | **Sağlam** — 124 URL, 5 lastmod, paket+danışman detayları içeride |
| T-06/06b | Redirect'ler | **Sağlam** — 7/7 örneklem 308 doğru hedef |
| T-08 | İki dilli 404 | **REGRESYON — bkz. T-08b** |
| T-09 | AI bot allow listesi | **Sağlam** (robots→llms referansı bilinen açık kalem olarak sürüyor) |
| T-10 | Pillar başlıkları | **Sağlam** — üçü de Türkçe SEO başlığı taşıyor |

`pnpm seo:audit`: 124 URL — **104 PASS / 20 WARN / 0 FAIL** (WARN'ların tamamı doğası kısa sayfalarda `word-count`). `pnpm test`: **602 geçti / 1 atlandı**. `pnpm typecheck`: temiz. docs/17'nin son kayıtlarıyla tutarlı.

### 3.2 Yeni teknik bulgular

**[T-08b] · BÜYÜK ÖLÇÜDE ÇÖZÜLDÜ (2026-08-27) — 404 sayfalarının ilk HTML'i kök not-found; JS'siz istemciler yanlış dilde, başlıksız, çift robots meta'lı sayfa görüyor.**

> **Kapanış kaydı.** Kök neden bulundu: `notFound()` fırlatıldığında Next 15.5 kök `layout.tsx`'i hiç render etmiyor, kendi sentetik `<html id="__next_error__">` kabuğunu kuruyor (`app-render.js` `getErrorRSCPayload`). Metadata da fırlatan sayfanın değil, `[locale]/not-found.tsx`'in `generateMetadata`'sından çözülüyor (`errorConvention` yolu) — bu yüzden `[...rest]/page.tsx`'teki metadata fiilen ölü koddu.
>
> Uygulananlar: başlık/açıklama/robots tanımı `[locale]/not-found.tsx`'e taşındı; kök `not-found.tsx` **iki dilli** yapıldı (sentetik kabuk onu her 404'e kattığı için tek dilli kalması EN adreslerde Türkçe gövde üretiyordu); `alternates: {}` ile canonical/hreflang mirası kesildi (**T-15 çözüldü**).
>
> Ham HTML doğrulaması (curl, JS'siz): `/tr/olmayan-sayfa` → 404 · "Sayfa bulunamadı — INDOLES" · `/en/does-not-exist` → 404 · "Page not found — INDOLES" · her ikisinde tek `robots: noindex`, canonical **yok**, karşı dilin gövdesi **yok**. Regresyon testi `tests/e2e/not-found.spec.ts` — `page.goto` değil `request.get` kullanıyor (JS çalıştırmadan ilk baytları denetliyor), 3 test geçiyor.
>
> **Kapanmayan tek kalem:** `<html lang>` ilk HTML'de hâlâ yok. Sentetik kabuğun özniteliğini Next belirliyor; deneysel `experimental.globalNotFound` bunu çözmüyor (denendi ve doğrulandı — o özellik yalnız yönlendirme düzeyinde eşleşmeyen URL'leri kapsıyor, `notFound()` çağrısını değil). Next sürümü yükseldiğinde yeniden bakılmalı.

Bulgunun orijinal kaydı:
Kanıt: `/tr/olmayan-sayfa`, `/en/does-not-exist`, `/tr/danismanlar/hipnoz` curl ile çekildiğinde ilk HTML `<html id="__next_error__">` imzalı, `lang` özniteliksiz; `<title>` ana sayfa başlığı; body'de **İngilizce URL'de bile Türkçe** "Aradığın sayfa burada değil." metni; aynı anda `noindex` ve `index, follow` olmak üzere iki çelişik robots meta. Locale-aware `[locale]/not-found.tsx` yalnız hidrasyon SONRASI devreye giriyor (tarayıcıda doğrulandı: başlık, dil ve chrome düzeliyor). docs/17'nin T-08 doğrulaması DOM üzerinden yapıldığı için bu fark o gün görünmemiş.
**Etki:** T-01 ile aynı risk sınıfı — GPTBot/ClaudeBot/PerplexityBot JS çalıştırmaz; sitedeki her kırık/bilinmeyen URL'de bu yüzeyi görürler. **Öneri:** 404'ün ilk HTML'ini locale-aware üretmek (catch-all rotada `notFound()` yerine doğrudan render veya root not-found'un iki dilli/`lang`'li yeniden yazımı); `fetch()` ile ham HTML'i doğrulayan regresyon testi. Canonical/hreflang'in 404'te ana sayfayı göstermesi de aynı işte temizlenmeli.

**[T-15] · P2 — 404'te canonical + hreflang ana sayfaya işaret ediyor** (hidrasyon sonrası bile). Kırık URL'lere gelen backlink sinyali yanlış hedefe "kanonikleşiyor"; pratik zarar düşük (sayfa noindex'e yakınsıyor) ama sözleşmeye aykırı.

**Kapanan kalemler (docs/17 "kapanmayanlar" listesinden):** Telefon numarası artık gerçek (`company.ts` — 2026-08-24 Burak teyitli) ve lokasyonlar teyit edilemeyen Londra/Dubai'den arındırılıp "Levent, İstanbul"a indirilmiş.

---

## 4. GEO Hazırlığı

### 4.1 llms katmanı

| Yüzey | Durum |
|---|---|
| `/llms.txt` | 141 satır, **86 markdown bağlantı, 0 çıplak URL**, host %100 apex; örneklenen 12 iç bağlantının 12'si 200 → G-01/G-03 sağlam |
| `/llms-full.txt` | 200, 115 KB, temiz H1→H4 hiyerarşi, TR+EN tam → G-02 sağlam |
| `/tr/llms.txt`, `/en/llms.txt` | **[G-11] · ÇÖZÜLDÜ (2026-08-27)** — docs/08 §6 ve `indoles-i18n-seo` skill'inin beklediği per-locale sürümler hiç yazılmamıştı (404). Üretim mantığı `src/lib/seo/llms.ts`'e çıkarıldı; iki route eklendi (her biri 69 satır, 43 markdown bağlantı, 0 çıplak URL, tek-dil izolasyonu testli). Kök `/llms.txt` çıktısı korundu — tek fark, her iki bölümün "Kaynaklar" listesine eklenen 4 satırlık per-locale işaretçi. Content-Type üç yüzeyde de `text/markdown`. Middleware T-13 tuzağına düşmedi (noktalı yol muafiyeti). 14 test |
| robots → llms.txt satırı | Yok (bilinen açık kalem; `MetadataRoute.Robots` kısıtı nedeniyle raw route gerekiyor) |

### 4.2 JSON-LD

19 sayfa tarandı: **parse hatası 0, duplicate blok 0**, Organization + `sameAs` 19/19, WebSite ana sayfada, Offer'lar bağlama uygun paketlere eşleniyor (CRO→Büyüme Sprinti, AI→AI Pilot). G-05/G-06/G-07 ve K-05 (pillar FAQ) kazanımları yerinde.

Kalan kusurlar:

- **[G-14] · P2 —** Makale ve paket şablonlarında BreadcrumbList'in son kırıntısı hâlâ kendine `item` linki taşıyor (vaka/hizmet/indekslerde doğru). docs/17 yalnız vaka breadcrumb'ını düzeltmiş.
- **[G-17] · P2 —** Makale `Article` şemasında `inLanguage` bölgesiz (`"tr"`); sitenin geri kalanı `tr-TR`/`en-US`. Tekilleştirilmeli.
- **[G-13] · P2 —** `WebSite` şemasında `SearchAction` yok. Site içi arama da olmadığı için (ADR-021 bilinçli kararı) düşük öncelik; arama gelirse birlikte eklenir.

### 4.3 SSS yüzeyi ve `<details>` geri dönüşü

SSS sayıları: hizmet 11-13 × 12, pillar 11 × 3, paket 11 × 4, vaka 10-12 × 9, makale 10-11 × 16 — **44/44 yüzey ≥10 kuralına uyuyor.** ADR-022 (paket cevapları tek ses) kod tarafında tam uygulanmış: görünen metin ile `FAQPage` şeması birebir aynı. Kalite kuralları (anafora yasağı + ≥40 kelime) 5 yüzeyde de test korumalı (71/71 PASS).

**[G-12] · P1 — KARARA BAĞLANDI (2026-08-27) — Dokümante edilmemiş mimari geri dönüş: tüm SSS yüzeyleri `<details>/<summary>`'ye dönmüş.**

> **Kapanış kaydı:** Burak kararı teyit etti; gerekçe iki katmanlı — (1) SSS sayısı ≥10'a çıkınca açık liste sayfayı okunamaz hâle getiriyordu, (2) native `<details>` seçildi çünkü JS akordiyonundan farklı olarak cevap metni kapalıyken de ham HTML'de duruyor ve crawler'lar okuyabiliyor. Karar **ADR-023**'te seçenek karşılaştırmasıyla kayda geçti; `docs/17` §12'nin ters yöndeki kaydına düzeltme notu eklendi. **Açık kalan tek kalem:** Lighthouse `agentic-browsing` / `agent-accessibility-tree` skorunun bu yapıyla bugünkü değeri hâlâ ölçülmedi (P2'ye taşındı).

Bulgunun orijinal kaydı:
docs/17 §12 "paket SSS'leri `<details>`'ten çıkarılıp açık `<dl>`'ye alındı; kapalı içeriği AI motorları atlayabiliyor" diye kayıt düşmüştü. Commit geçmişine göre bu karar aynı gün (25 Ağustos, `7548ce4` — docs/17'nin kendi commit'inden 1 dakika önce) tersine çevrilmiş: `faq-accordion.tsx` şimdi 5 yüzeyin tamamını native `<details>` ile render ediyor. Kod içi gerekçe teknik olarak sağlam — cevap metinleri ham HTML'de tam duruyor (curl ile doğrulandı; JS'siz crawler'lar metni görüyor) ve FAQPage şeması aynı metni ayrı kanaldan taşıyor. **Ama:** (1) CLAUDE.md'nin ADR kuralına rağmen karar kaydı yok ve docs/17 §12 artık gerçeği yanlış anlatıyor; (2) Lighthouse'un `agentic-browsing` / `agent-accessibility-tree` denetimleri (docs/17 G-04: 33/100) kapalı `<details>` içeriğini genişletmeden görmeyebilir — SSS hacmi üç katına çıktıktan sonra bu skor hiç yeniden ölçülmemiş. **Öneri:** Karar Burak onayından geçtiyse geriye dönük kısa bir ADR + docs/17'ye düzeltme notu; Lighthouse agentic kategorisinin yeniden ölçümü; ilk 2-3 kritik sorunun `open` attribute'la varsayılan açık gönderilmesinin değerlendirilmesi.

**[G-15] · P2 —** T-12'deki `dl > div > dt/dd` anti-pattern'i SSS'ten çıkmış ama hizmet sayfalarındaki "teslim edilenler" listesi ve `ServiceCaseProof` kanıt şeridinde aynen sürüyor (12 sayfada). `display: contents` ile stil bozulmadan düzeltilebilir; Lighthouse `definition-list`/`dlitem` muhtemelen hâlâ düşüyor.

**[G-16] · P2 —** Makale tarihleri düz `<span>` — `<time datetime="...">` kullanılmıyor; JSON-LD tarihleriyle birebir aynı değerler olduğundan dönüşüm mekanik.

**[G-10] · P2 — SÜRÜYOR —** GEO ölçüm rutini (ayda bir, 10 soruluk sabit prompt setiyle ChatGPT/Gemini/Perplexity görünürlük testi) hâlâ kurulmamış; `docs/strateji/` altında şablon yok. Launch haftası baz çizgisi alınamayacak.

---

## 5. İçerik–Keyword Uyumu (TR + EN)

### 5.1 TR — dar kapsam ticari kelimeler

Strateji v1.5'in "11 ticari kelimenin tamamı hedef sayfasında" iddiası **doğrulandı** (fiilen 16+ yerleşim; `keyword-coverage.test.ts` 16/16 PASS ve yerleşim kuralını — `ajansı` ailesi H1/title'a girmez — koruyor). Ancak üç nitel bulgu:

**[C-01] · ÇÖZÜLDÜ (2026-08-27) — "yapay zeka ajansı" kümenin en alınabilir kelimesi ama sayfadaki en zayıf yüzeyde.**

> **Kapanış kaydı:** Kelime kendi karşı-konumlandırma SSS'ini aldı ("Yapay zeka ajansı ile yapay zeka danışmanlığı arasındaki fark nedir?", TR+EN) — `firmaları` sorusuyla birleştirilmedi, ayrı SERP niyeti ayrı soru. Cevap kategori farkını anlatıyor (ajans katmanı hazır yetenek satar; danışmanlık önce nerede karşılık verdiğine karar verir) ve ADUARDO kanıtını ölçülü biçimde kullanıyor. Alakasız bir cevabın ortasındaki eski zayıf yerleşim kaldırıldı (TR'de vardı, EN karşılığı hiç yoktu — parite ihlaliydi). H1/`seo.title` temiz kaldı, test korumalı.
>
> **Kısıt notu:** `services-content.test.ts` SSS üst sınırını 12 koyuyor ve sayfa zaten 12'deydi; yer açmak için aynı niyetin iki yüzü olan iki soru ("işimize uyar mı" + "ne zaman yanlış tercih") tek soruda birleştirildi, içerik korunarak. **KARAR (Burak): sınır 12'de kalıyor** — birleştirme kalıcı. Yeni bir soru eklenecekse yine bir birleştirme veya çıkarma gerekecek; sayfa uzunluğu ile alıntılanabilir pasaj sayısı arasındaki denge bilinçli olarak 12'de sabitlendi.
>
> **[C-07] · ÇÖZÜLDÜ:** GSC'de gösterim alan iki yazım varyantı da yerleşti — `dönüşüm oranı arttırma` `cro.ts` scope metnine (checkout denetimi, e-ticaret bağlamıyla), `dönüşüm oranı artırma` "Dönüşüm oranımız ne kadar artar?" SSS cevabının açılışına. Yan yana yazılmadı; farklı yüzeylere dağıtıldı.

Bulgunun orijinal kaydı:
Rakip analizi bu kelimeye Top-5 eşiği koyuyor (100-1B hacim, Düşük rekabet, ince içerikli ajans katmanı); sayfadaki tek karşılığı alakasız bir SSS cevabının ortasındaki tek cümle + render edilmeyen `seo.entities` alanı. Karşılaştırma: Orta rekabetli "yapay zeka firmaları" kendi karşı-konumlandırma sorusunu almış, Düşük rekabetli "yapay zeka ajansı" almamış — öncelik tersine dönmüş. **Öneri:** `ai-danismanlik` SSS'ine "Yapay zeka ajansı ile yapay zeka danışmanlığı arasındaki fark nedir?" sorusu (ayrı SERP niyeti, ayrı soru).
**Yan bulgu:** `seo.entities` alanını hiçbir component render etmiyor; tek tüketicisi offline audit script'i. Alana kelime eklemek SEO yüzeyi üretmiyor — ya render edilmeli ya "kontrol listesi" rolü belgelenmeli.

**[C-04] · P1 —** UI/UX kümesinde dört ticari kelime (`ui/ux tasarım ajansı`, `ux ajansı`, `ui tasarımı`, `ux tasarımı`) tek SSS cevabına sıkışmış — v1.5'in kendi "kelime doldurma olurdu" gerekçesiyle çelişiyor. `ui tasarımı`/`ux tasarımı` scope/deliverables başlıklarına dağıtılmalı.

**[C-05] · P1 —** "iş geliştirme danışmanlığı" üç TR sayfasının title'ında (ana sayfa, `/tr/hizmetler`, `/tr/hakkimizda`) — §2'nin kendi cannibalization yasağının ihlali; kaynağı stratejinin kendi P1 tablosundaki çelişki ("hedef: /tr/hizmetler + hakkımızda"). EN tarafı temiz (üç farklı baş terim). **Öneri:** hakkımızda title'ı EN'deki gibi kimlik odaklı yazılsın; strateji §2 P1 satırı düzeltilsin.

**[C-07] · P2 —** GSC'de gösterim alan "e-ticaret dönüşüm oranı artırma/arttırma" varyantlarının ikisi de sitede geçmiyor (§2 tablosu "ikisi de sayfada geçmeli" diyordu).

**[C-11] · P2 —** Makale-4 (`e-ticaret ajansı ne değiştirir?`) title/description'da hizmet sayfasının birincil kelimelerini hedefliyor — küme içi rekabet + `ajansı` ailesinin makale title'ında baş terim olması yerleşim kuralına aykırı. Benzer hafif çakışma: transform pillar ↔ dijital-donusum başlıkları.

**Hacimli ama hiç yerleşmemiş TR hedefleri (özet):** `google reklam ajansı` + `dijital reklam ajansı` (1B-10B havuz — **[C-06] · ÇÖZÜLDÜ:** Burak kararıyla makale yüzeyiyle hedeflenecek; hafta 7'ye slot açıldı, hizmet sayfalarına girmiyor, premium filtre korunuyor) · `yazılım ajansı/firması`, `it danışmanlığı`, `shopify/trendyol danışmanlığı`, `yazılım şirketi istanbul`, `kurumsal/yönetim danışmanlığı` (P2 — çoğu §4 takviminin işi).

### 5.2 EN — üç küme (AI + Yazılım + GEO)

Yerleşenler: 11 kelime (`artificial intelligence consulting` seo.title'da, `generative engine optimization` makale title'ında, `custom software development company` SSS'te vb.). **"10/13" beyanının paydası yanlıştı: korunan üç küme CSV'de 15 kelime taşıyor; bilinçli bırakılan 3'e ek iki kelime beyansız düşmüştü** — `business process automation consulting` ve `mvp development agency` **[C-12] · ÇÖZÜLDÜ (2026-08-27)**.

> **Kapanış kaydı:** Burak kararıyla ikisi de yerleştirildi. `business process automation consulting` → `is-otomasyonlari.ts:328` `seo.title.en` (48 karakter şablonla; `consulting` ailesi başlığa girebilir, yasak yalnız `agency` ailesinde). `mvp development agency` → `ozel-yazilim-ve-mobil.ts:286` "MVP nedir" SSS cevabı (H1/title'a girmedi — yerleşim kuralı korundu); TR karşılığı `mvp geliştirme` aynı cevaba işlendi. Paket sayfası hedef olarak seçilmedi çünkü `PackageContent` tipinde `seo` alanı yok (C-10 hâlâ açık). **Gerçek oran artık 13/15**; kalan 3'ü (`ai transformation consulting`, `ai implementation services`, `geo optimization`) bilinçli bırakılmış olanlar. Doğrulama: typecheck temiz, 372 unit testi PASS.
>
> **[C-13] · ÇÖZÜLDÜ (2026-08-27):** `keyword-coverage.test.ts` yalnız TR yüzeyini tarıyordu; yeni yerleşen iki EN kelimesi dahil hiçbir EN hedefi regresyon koruması altında değildi. `searchSurfaceEn()` (TR versiyonunun birebir EN aynası) ve `TARGETS_EN` eklendi: **9 EN kelime-sayfa çifti** artık test korumalı — `ai consultancy`, `artificial intelligence consulting`, `ai consulting firm`, `digital transformation consultancy`, `custom software development company`, `software development agency`, `mobile app development company`, `mvp development agency`, `business process automation consulting`. Ayrıca `agency` kelimesinin `name.en`/`seo.title.en`'e girmemesi (TR'deki `ajansı`/`firmaları` yasağının EN eşleniği) 12 hizmette test ediliyor — bugün ihlal yok. Unit süiti 372 → **382**.
>
> Kapsam dışı kalan iki nokta: (a) makale hedefleri (`generative engine optimization` vb.) `ArticleContent`'te yaşıyor, bu test yalnız `SERVICES` okuyor; (b) `mvp development agency`'nin CSV'deki kanonik hedefi MVP Build **paketi** — paket içeriği `PackageContent` tipinde ve testin mimarisi buna uygun değil. İkisi de C-10 ile birlikte ele alınmalı.

**[C-10] · KAPATILDI — "açmayalım" (2026-08-27):** `packages.ts`'te hiç `seo` bloğu yok; "mvp nedir" (1B-10B, Düşük) ve `mvp development agency` hedefleri sahipsiz. Paket metadata'sı kelime hedefi taşımıyor.

> **Gerekçe.** Bulgu araştırılınca öneri tersine döndü. CSV'nin kendi hedef kolonu `mvp nedir` için **"Makale → MVP Build paketi"** diyor — kanonik hedef makale, paket değil; mantığı da doğru, "mvp nedir" arayan kişi bilgi arıyor, fiyat listesi değil. Paket sayfasının kendi hedefleri (`mvp geliştirme`, `mvp development agency`) 50/ay bandında. Üstelik paket başlıkları formülle üretiliyor (`descriptor` + süre + fiyat) ve **fiyat değiştiğinde otomatik güncelleniyor**; elle yazılan bir başlık eskir ve SERP'te yanlış rakam gösterir. `mvp nedir`, takvimin h.12-1 makalesiyle alınacak.
>
> **Yan bulgu (yeni):** `MVP nedir` sorusu şu an **iki sayfada birden** SSS olarak duruyor — `packages.ts:830` ve `ozel-yazilim-ve-mobil.ts:281` — ve ikisi de `FAQPage` şemasına giriyor. Küçük bir iç rekabet; paket sayfasındakinin pakete özgü bir açıya çevrilmesi öneriliyor (ör. "Bu paket bittiğinde elimde ne olacak?").

### 5.3 İçerik takvimi (§4 — 24 slot)

**Kapsam: 3/24 dolu (%12,5), 1 kısmi.** Dolu olanlar: landing page optimizasyonu (h.7-1), CAC-LTV (h.8-1), ChatGPT/Gemini'de marka (h.9-2). Mevcut 16 makalenin tamamı eski WordPress korpusunun yeniden inşası (en yeni `publishedAt` 2026-01-15); takvim üretimi henüz başlamamış — launch olmadığı için beklenen, ama iki kritik boşluk launch'tan bağımsız:

- **[C-02] · P1 — `yapay-zeka` konu kümesinde 0 makale; P0-müşteri sayfası desteksiz.** 16 makalenin hiçbirinin konusu yapay-zeka değil; `relatedArticlesForService` eşleşme bulamayınca blok hiç render edilmiyor → **12 hizmet sayfasının 7'si "ilgili yazı" bloğu basmıyor**, aralarında `ai-danismanlik` de var. Strateji §1 ilke 1 ("bilgi içerikleri ticari sayfaları destekler") kod düzeyinde boş çalışıyor. Takvimin h.1-2/h.2-2/h.3-2 AI slotlarından en az ikisi launch penceresinde üretilmeli.
- **GEO kümesi 1 makalede toplanmış:** 4 hedef niyet (geo nedir, llms.txt nedir, AI Overviews, ChatGPT'de marka) tek makale + SSS'lerinde. Rakip analizi §3 pencerenin daraldığını söylüyor (Poligon'un yeni GEO sayfası, Adroket 2026 rehberi) — h.7-2 (AI Overviews) ve h.10-2 (llms.txt) öne alınmalı; llms.txt makalesi kendi uygulamamızı vaka olarak anlatabilir.

### 5.4 TR↔EN parite

Alan düzeyinde **tam parite**: 26 içerik dosyasında `tr:`/`en:` sayıları eşit, messages key paritesi test korumalı, EN imla tekilliği 20/20, llms katmanı iki dilli. Kusurlar niyet düzeyinde: EN doğru kelimeyi yakalayıp TR'nin kaçırdığı (`software development agency` ↔ "yazılım evi") veya tam tersinin olduğu üç yüzey §5.1-5.2'deki bulgulara dahil edildi.

---

## 6. İç Link Mimarisi

**[C-03] · ÇÖZÜLDÜ (2026-08-27) — Hizmet→vaka eşlemesi `serviceSlugs` verisini okumuyor; kanıt şeridi yanlış vakaları gösteriyor.**

> **Kapanış kaydı:** Eşleme `relatedCaseForService()` fonksiyonuna alındı — önce künye (`serviceSlugs`), bulunamazsa pillar fallback (12 hizmetin hiçbiri kanıt şeridini kaybetmedi). **5 hizmetin vakası düzeldi:** CRO → GYMWOLVES (künyesinde gerçekten `cro` var), marka-stratejisi → FYR Luxury, e-ticaret → MKComputer, ui-ux-tasarim → İstanbul Ortez Protez, is-otomasyonlari → MKComputer. İki eşleme pillar sınırını bilinçle aşıyor (künye pillar'dan bağımsız). 6 test eklendi; mevcut K-02 testleri de artık gerçek fonksiyonu çağırıyor (önceden mantığı taklit ediyorlardı).
>
> **Kalan açık nokta:** dört hizmet (`dijital-donusum`, `is-zekasi`, `isletme-muhendisligi`, `teknoloji-ve-altyapi`) hiçbir vakanın künyesinde geçmiyor ve fallback'e düşüyor — bu hizmetler için gerçek bir vaka künyesi işaretlenmeli (içerik verisi işi).

Bulgunun orijinal kaydı:
`service-detail.tsx:231` vakayı yalnız `pillar` eşleşmesiyle ve dizideki **ilk** kayıttan seçiyor. Sonuç: 5 growth hizmetinin tamamı SOYLU AVM'yi gösteriyor — CRO sayfası dahil, oysa `cases.ts`'te `cro` etiketli iki vaka var ve SOYLU AVM'nin künyesinde CRO yok. Rakip analizinin 1 numaralı farklılaştırıcısı ("hizmet sayfasına gömülü rakamlı vaka — kimsede yok") yanlış eşleşmeyle sulanıyor. docs/17'nin "kalıcı çözüm hizmet başına relatedCases (P1)" notu hiç uygulanmamış. **Öneri:** `CASES.find(c => c.serviceSlugs?.includes(service.slug.tr)) ?? pillar-fallback` — tek satırlık düzeltme, launch öncesi alınabilir.

**[C-09] · P2 —** Makale→hizmet yönü yapısal değil: `topics.serviceSlug` alanı yazı sayfasında okunmuyor, zincir yazarın gövdeye elle koyduğu linke bağlı. Üç `marka-hikaye` makalesi hiç iç link taşımıyor **[C-08] · P2**. Vaka→makale yönü hiç yok. Olumlu: gövde linkleri locale'e doğru çözülüyor (`resolveInlineHref` TR→EN slug çevirisi sağlam).

---

## 7. Dönüşüm ve Ölçüm

GA4 + Consent Mode v2 kurulu ve docs/17'nin O-01 tablosuna göre büyük ilerleme: 9 olaydan 7'si gerçekten bağlanmış (persona, pillar/service/package/case görüntüleme, faq_opened, booking_cta_clicked).

**[O-05] · P1 — Huninin gerçek dönüşüm anı ölçülmüyor: `brief_submitted` tanımlı ama hiç çağrılmıyor.** Popup yalnız açılış niyetini (`booking_cta_clicked`) track ediyor; başarı ekranı (`SuccessState`) hiçbir olay göndermiyor. §9 KPI seti alt huniyi göremiyor. `homepage_hero_viewed` da ölü tanım — ya bağlanmalı ya taksonomiden çıkmalı. **Öneri:** SuccessState'e `brief_submitted` — küçük iş, launch öncesi alınmalı.

**[O-03] · P2 — SÜRÜYOR —** Sentry hâlâ init'siz (`Sentry.init()` hiçbir yerde; config dosyaları yok) — `global-error.tsx`'teki `captureException` fiilen boşa düşüyor. Yeni katman: hedef runtime artık Cloudflare Workers — kurulum yapılırken `@sentry/nextjs`'in Workers uyumu doğrulanmalı (`@sentry/cloudflare` gerekebilir).

**[O-02] / [T-11] — Burak'ta:** GSC/Bing doğrulama + IndexNow kurulumsuz; cutover günü listesine bağlı.

---

## 8. Önceliklendirilmiş Aksiyon Planı

### P0 — Launch kapısı (yapılmadan cutover verilmez)

| # | Aksiyon | Bulgu | Sahip | Durum |
|---|---|---|---|---|
| 1 | ~~Cloudflare zone'unun AI bot bloğunu / managed robots.txt'ini kapat~~ | LG-03 | Burak | **Tamam (2026-08-27)** — doğrulandı; cutover sonrası tekrar bakılacak |
| 2 | Deploy zinciri: Next ≥15.5.21 yükseltmesi → `open-next.config.ts` + `wrangler.jsonc` → env'ler (`APP_STAGE=production`, `APP_URL=https://www.indoles.com.tr`, `GA_ID`) → preview deploy + smoke | LG-04, LG-02 | Kod + Burak | Açık — host ve platform kararı ADR-024 ile netleşti, zincirin kendisi kurulacak |
| 3 | Cutover: apex→www 301 korunur, WP kapatılır, GSC'ye yeni sitemap verilir + eski Yoast sitemap'i kaldırılır, Bing/IndexNow | LG-01 ✓karar · cutover açık | Burak | **Karar verildi** (host `www`, ADR-024); işlemin kendisi açık |
| 4 | ~~Persona görünürlüğü kararı~~ → **Seçenek B seçildi** (crawler'a nötr metin). Uygulama ayrı oturuma bırakıldı: 22 URL, ~2.772 TR + ~3.049 EN kelimelik nötr copy. Ayrım user-agent'a değil **çerez durumuna** göre kurulmalı (cloaking riskinden kaçınmanın yolu) | G-01 (docs/18) | Burak + Kod | **Karar verildi**, uygulama bekliyor |

### P1 — Launch'la birlikte çıkması ucuz kod/içerik düzeltmeleri

| # | Aksiyon | Bulgu | Efor | Durum |
|---|---|---|---|---|
| 4 | ~~Hizmet→vaka eşlemesini `serviceSlugs`-öncelikli yap~~ | C-03 | S | **Tamam (2026-08-27)** — `relatedCaseForService()` künye-öncelikli, pillar fallback korundu; 5 hizmetin vakası düzeldi (CRO → GYMWOLVES), 6 test eklendi |
| 5 | ~~404 ilk HTML'ini locale-aware üret + ham-HTML regresyon testi + canonical/hreflang temizliği~~ | T-08b, T-15 | M | **Tamam (2026-08-27)** — başlık/robots doğru dilde, kök 404 iki dilli, canonical/hreflang mirası kesildi, 3 e2e testi. Kalan: `<html lang>` (Next 15.5 sınırı, P2'ye) |
| 6 | ~~`brief_submitted` bağlantısı; `homepage_hero_viewed` kararı~~ | O-05 | S | **Tamam (2026-08-27)** — olay `EntryPopup` submit handler'ında (render'da değil — çift gönderim mimari olarak engelli), 2 test eklendi; `homepage_hero_viewed` taksonomiden çıkarıldı (Burak kararı), `docs/12` güncellendi |
| 7 | ~~Başlık düzeltmesi + "yapay zeka ajansı" SSS'i + "artırma/arttırma" varyantları~~ | C-05, C-01, C-07 | S | **Tamam (2026-08-27)** — C-05 başlıklar + strateji §2 P1 çelişkisi (v1.6); C-01 "yapay zeka ajansı" kendi karşı-konumlandırma sorusunu aldı (ADUARDO kanıtıyla, TR+EN); C-07 iki GSC yazım varyantı farklı yüzeylere dağıtıldı |
| 8 | ~~Per-locale `/tr/llms.txt` + `/en/llms.txt`~~ · açık kalan: robots'a llms satırı (raw route kararı) | G-11 ✓ · T-09 açık | S | **Kısmen** — G-11 tamam: üretim mantığı `src/lib/seo/llms.ts`'e çıkarıldı, iki route eklendi (her biri 69 satır / 43 markdown bağlantı / 0 çıplak URL), kök çıktı yalnız 4 satırlık bilinçli ekleme aldı, 14 test |
| 9 | ~~`<details>` kararına geriye dönük ADR + docs/17 §12 düzeltme notu~~ · açık kalan: Lighthouse agentic yeniden ölçümü | G-12 | S | **Kısmen** — ADR-023 yazıldı, docs/17 §12'ye düzeltme notu düşüldü; ölçüm P2'ye taşındı |
| 10 | ~~ADR-024 (Cloudflare hosting) + active_context tazeleme~~ · açık kalan: CLAUDE.md deploy satırı | LG-05 | S | **Tamam (2026-08-27)** — ADR-024 yazıldı (hosting + `www` host), ADR-012 superseded işaretlendi, `.env.example` env zincirini belgeledi, active_context yeniden yazıldı. CLAUDE.md Burak onayı bekliyor |
| 11 | İçerik: h.1-2 "AI dönüşümü nedir" + h.2-2 "AI danışmanı seçerken 12 soru" (yapay-zeka kümesini açar, 7 hizmetin ilgili-yazı bloğunu doldurmaya başlar) | C-02 | M-L | Açık |
| 12 | ~~EN hedefleri için regresyon testi~~ | C-13 | S | **Tamam (2026-08-27)** — `searchSurfaceEn` + `TARGETS_EN`, 9 kelime-sayfa çifti + `agency` yerleşim kuralı; süit 372 → 382 |

### P2 — İlk 30-90 gün

GEO polish paketi (G-14 breadcrumb, G-15 `display:contents`, G-16 `<time>`, G-17 inLanguage — tek PR) · **Lighthouse `agentic-browsing` / `agent-accessibility-tree` yeniden ölçümü** (ADR-023 sonrası, SSS hacmi 3 katına çıktığından beri hiç ölçülmedi) · GEO ölçüm rutini şablonu + launch haftası baz çizgisi (G-10) · reklam havuzu makalesinin yazılması (C-06 — karar verildi, hafta 7) · makale→hizmet yapısal CTA + vaka→makale yönü (C-08, C-09) · makale-4 hedef ayrıştırması (C-11) · Sentry init (Workers uyumlu, O-03) · GEO makalesinin üçe bölünmesi ve h.7-2/h.10-2'nin öne çekilmesi (K-3 kararı) · Lighthouse/CWV'nin Workers production'ında yeniden ölçümü · `docs/18`'in hâlâ açık bulguları (§10).

---

## 9. `docs/18` ile Çapraz Kontrol (2026-08-27, kurtarma sonrası)

`docs/18` kurtarıldığında, bu denetimin **yakalamadığı** beş bulgu ortaya çıktı. Beşinin bugünkü durumu kaynak koddan doğrulandı:

| docs/18 bulgusu | Bugünkü durum | Kanıt |
|---|---|---|
| **G-01 — Persona çift-render'ı** | **KISMEN GEÇERLİ** — mekanizma aynı, kapsam ADR-022 ile ~%56 küçüldü | `persona-text.tsx:15-76`, `globals.css:485-488`, `layout.tsx:64-71` |
| **G-02 — Makale H2'leri Q&A formatında değil** | **HÂLÂ GEÇERLİ, hiç değişmemiş** | 108 H2'nin 16'sı soru formunda = **%14,8** (docs/18'in ölçtüğü rakamla birebir aynı) |
| **§9 — EN vaka URL'leri Türkçe slug taşıyor** | **HÂLÂ GEÇERLİ** | `types.ts:141` `slug: string` (Localized değil); makale ve hizmette `Localized<string>` |
| **§8 — Kadro = 10 entity kaldıracı: 1/10 LinkedIn** | **HÂLÂ GEÇERLİ** | `consultants.ts` — yalnız `burak-ozgul`'da `linkedinUrl`; `personLd` `sameAs`'ı destekliyor ama veri yok |
| **S-05 — Sayısal tutarsızlık ("On iş" / 9 vaka)** | **ÇÖZÜLMÜŞ** | `vakalar/page.tsx:18-34` ve `danismanlar/page.tsx:15-28` artık `${CASES.length}` / `${BOOKABLE_CONSULTANTS.length}` |

### [G-01] · P0-karar — Persona çift-render'ı: ticaret persona'sının kopyası indekslenmiyor

**Mekanizma (bugün de aynı):** `PersonaText` iki varyantı da DOM'a basıyor, seçimi CSS yapıyor. `layout.tsx`'teki senkron script `data-persona`'yı **yalnız çerez varsa** yazıyor; çerez yoksa CSS kuralı `commerce` varyantını `display:none` bırakıyor. Googlebot'ta çerez yok — yani **ticaret persona'sı için yazılmış metnin tamamı indekslenmiyor.** CSS çalıştırmayan AI crawler'ları ise her cümlenin iki çelişen versiyonunu art arda okuyor.

**Bugünkü kapsam (ölçüldü):** 11 şablon × 2 dil = **22 canlı URL**; TR industrial 1.427 + commerce 1.345 ≈ **2.772 kelime** (EN'de ≈ 3.049). Dağılım: paket detayları ~1.632, ana sayfa ~499, `/hizmetler` ~365, pillar detayları ~171, indeksler ~104.

**Bu bilinçli bir karar mı?** İki katmanlı: ADR-014 hangi yüzeylerin persona-aware olacağını belirledi; ADR-022 (24 Ağustos) mekanizmanın *bir sonucunu* — paket SSS'lerindeki şema/görünen-metin uyuşmazlığını — çözdü ve o katmanı tek sese indirdi. Yani **mimari korundu, kapsamı bilinçle küçültüldü.** ADR-022'nin metni docs/18'in üç sonucunu zaten satır satır tanıyor.

**Neden launch öncesi karar gerektiriyor:** Google ilk taramada ne görürse onu indeksler; ticaret kopyası sonradan açılırsa yeniden indeksleme gerekir. Strateji ticaret founder'ını "iki birincil SEO persona'sından biri" sayıyor (§1) — bugünkü hâliyle o persona'nın metni arama sonucuna hiç girmiyor.

#### Dört seçenek — karşılaştırma

| # | Yaklaşım | Nasıl çalışır | Kazanç | Bedel / risk |
|---|---|---|---|---|
| **A** | **Kapsamı daralt** (ADR-022 mantığının devamı) | Düşük hacimli listeleme alanları tek sese iner: pillar tagline/description, servis `shortDescription`, indeks başlıkları. Persona-aware yalnız gerçekten satış-kritik yüzeyde kalır — paket `outcome/summary/scope/deliverables/whoFor` | Görünmeyen metnin büyük kısmı indekslenebilir hâle gelir; mimari değişmez, risk düşük; ADR-022'nin kurduğu emsali izler | ADR-014'ün "conversion yüzeyinde tam diferansiasyon" kararı bir adım daha geri alınır; paket detaylarındaki ~1.632 kelime hâlâ görünmez kalır; ek ADR gerekir |
| **B** | **Crawler'a nötr tek metin** | Sunucu, çerezi olmayan istemciye (Googlebot dahil) iki varyantı birleştirmek yerine **nötr/ortak** bir metin döndürür; kişiselleştirme çerez sonrası istemcide devreye girer | Tek bir kanonik metin indekslenir; AI crawler'ları çelişen iki versiyon okumaz — GEO tarafındaki asıl sorun kökten biter | **Cloaking sınırına yaklaşır.** Google, crawler ile kullanıcıya aynı içeriğin gösterilmesini şart koşuyor. "Varsayılan nötr, sonra kişiselleştirme" savunulabilir; ama nötr metnin yazılması gerekir (yeni copy işi, iki personaya da hitap etmeli) ve yanlış kurgulanırsa ceza riski taşır |
| **C** | **JSON + script** (ADR-022'de reddedilmişti) | Her iki varyant DOM'a basılmaz; commerce metni JSON olarak gömülür, senkron script çerez varsa DOM'u değiştirir | Ham HTML'de tek metin kalır — hem tekrar hem çelişki biter; SSG korunur | ADR-022 bunu "ölçülmemiş kazanç için karmaşıklık" diye elemişti. Kalan yüzey küçüldüğü için o gerekçe zayıfladı, ama commerce kopyası **yine indekslenmez** — yalnız kirlilik temizlenir, görünürlük sorunu çözülmez |
| **D** | **Statüko** | Değişiklik yok | Sıfır iş, sıfır risk | Ticaret persona'sının tüm kopyası aramada görünmemeye devam eder. Google ilk taramada ne görürse onu indeksler — launch sonrası düzeltmek yeniden indeksleme demek |

**Değerlendirme.** Sorun ikiye ayrılıyor: **(a) görünürlük** (commerce metni indekslenmiyor) ve **(b) kirlilik** (AI crawler'ı iki çelişen versiyon okuyor). C yalnız (b)'yi çözer, A ikisini de kısmen, B ikisini de tam ama en yüksek riskle.

> **KARAR (2026-08-27, Burak): Seçenek B — crawler'a nötr metin.** Uygulama ayrı bir oturumda, cutover sonrasına bırakıldı (kapsam: 22 URL, ~2.772 TR + ~3.049 EN kelimelik nötr copy üretimi).
>
> **Uygulama notu — cloaking sınırından uzak durmanın yolu:** ayrım *user-agent'a* göre değil **çerez durumuna** göre yapılmalı. Çerezi olmayan HERKES (Googlebot, AI crawler'ı ve ilk kez gelen insan ziyaretçi) aynı nötr metni görür; kişiselleştirme yalnız persona seçildikten sonra devreye girer. Bu, Google'ın "crawler ile kullanıcıya aynı içeriği göster" şartını bozmaz — çünkü aynı koşuldaki herkes aynı şeyi alır. User-agent'a bakan bir çözüm ise gerçek cloaking riski taşır ve seçilmemelidir.

**Öneri: A, launch öncesi.** Gerekçe: (b)'nin zararı ölçülebilir ve kesin, (a)'nın kazancı ise hangi metnin görüneceğine bağlı — A her iki cepheden de kazandırırken mimariye dokunmuyor ve zaten kurulmuş bir emsali (ADR-022) izliyor. B'yi launch öncesi denemek, cloaking değerlendirmesi ve yeni copy gerektirdiği için takvim riski taşır; launch sonrası ölçümle birlikte açılabilir. D yalnız "launch'ı geciktirmeyelim" kararı verilirse savunulabilir — o durumda bile G-18 (aşağıda) ayrıca düzeltilmeli, çünkü orada metin hiç üretilmiyor.

### [G-18] · KAPANDI — BİLİNÇLİ KARAR: `/vakalar` seçilmiş vakalar bloğunda commerce metni SSG çıktısında hiç yok

> **Karar (2026-08-27, Burak):** Bu mekanizma bilinçli. Bulgu "kusur" olmaktan çıkıp kayıtlı bir tercihe dönüştü.
>
> İki not: (1) Seçenek B (nötr metin) uygulandığında bu blok da aynı çerez-tabanlı mantığa hizalanmalı, yoksa sitede iki farklı persona davranışı kalır. (2) `seo:audit`'in `persona-leak` kuralı bu deseni (`usePersonaState`) hâlâ yakalayamıyor — kural genişletilecekse B uygulamasıyla birlikte ele alınmalı.

Orijinal bulgu kaydı:

Doğrulama sırasında **ikinci, dokümante edilmemiş bir persona mekanizması** bulundu: `cases-section.tsx:181-213` `PersonaText` kullanmıyor, `usePersonaState()` client hook'una bağlı. `getServerSnapshot()` her zaman `industrial` döndürdüğü için commerce metni **statik çıktıda hiç bulunmuyor** — çift render değil, tam kayıp. Üstelik `seo:audit`'in `persona-leak` kuralı bunu yakalayamıyor, çünkü yalnız `[data-persona-variant]` özniteliğini sayıyor ve bu blok o özniteliği hiç üretmiyor. **Öneri:** ya `PersonaText`'e taşınsın ya tek sese insin; `persona-leak` kuralı bu deseni de kapsayacak şekilde genişletilsin.

---

## 9b. Karar Notu — `seo.entities` alanının rolü

Bu bölüm C-01'in yan bulgusundan doğdu ve Burak'ın "derin düşünüp tartışalım" talebi üzerine ayrı bir karar notu olarak yazıldı.

### Alan bugün ne yapıyor

`ServiceContent.seo.entities` (`types.ts:455`) kendi tanımında zaten *"sayfada açık isimle geçmesi gereken varlıklar — audit kontrol listesi"* diyor. Tek tüketicisi `src/lib/seo/audit.ts:517`: denetim, **render edilmiş HTML'in gövde metnini** tarayıp listedeki her terimin geçtiğini doğruluyor, geçmeyeni FAIL sayıyor. Yani alan bir SEO *yüzeyi* değil, bir *sözleşme*.

12 hizmetin 11'inde dolu (indeks hariç), her birinde 5-7 terim. İçerik iki farklı türden oluşuyor:

| Tür | Örnek | Başka nerede korunuyor? |
|---|---|---|
| **Hedef kelime** | `yapay zeka danışmanlığı`, `dönüşüm oranı optimizasyonu`, `yapay zeka ajansı` | `keyword-coverage.test.ts` — ve orası daha güçlü: hangi kelimenin hangi **yüzeyde** (title/H1/SSS) geçeceğini ve `ajansı` ailesinin H1'e girmemesini de denetliyor |
| **Somut varlık** | `Figma`, `Shopify`, `Google Ads`, `ERP`, `A/B test`, `checkout` | **Hiçbir yerde.** Tek koruma burası |

### Sorun kavramsal, teknik değil

İki iş tek alanda karışmış. Hedef kelimeler için entities zayıf bir araç: yalnız "gövdede bir yerde geçiyor mu" diye bakıyor, *nerede* geçtiğini umursamıyor. C-01'in kökü tam buydu — "yapay zeka ajansı" entities'te vardı, audit PASS veriyordu, ama kelime alakasız bir SSS cevabının ortasında duruyordu. Alan, yerleşim yapılmış **hissi** üretiyordu.

Buna karşılık ikinci tür gerçekten değerli ve tek koruması bu: rakip analizi §1, Poligon'un gücünü *"somut araç isimleri (Hotjar, Clarity, VWO, Insider)"* diye tanımlıyor. Bir hizmet sayfası yeniden yazılırken `Figma` veya `Shopify` sessizce düşerse, bunu yakalayan başka bir test yok.

Ayrıca entities'in `keyword-coverage`'ın yapamadığı bir şeyi var: **render çıktısını** denetliyor. `keyword-coverage` içerik katmanına bakar; bir component metni basmayı bırakırsa onu göremez, entities görür.

### Üç seçenek

| # | Yaklaşım | Kazanç | Bedel |
|---|---|---|---|
| **1** | **Rolü keskinleştir.** `types.ts` yorumuna "bu alan kelime *yerleştirme* yüzeyi değildir; yerleşim `keyword-coverage`'ın işidir" eklenir; hedef kelimeler listeden çıkarılır, yalnız somut varlıklar kalır | İllüzyon biter; alan gerçek bir "kanıt ögesi düştü mü" ağına dönüşür; render doğrulaması korunur | 11 dosyada temizlik; hangi terimin "varlık" sayılacağına dair bir tanım gerekir |
| **2** | **JSON-LD'ye bas** (`about` / `mentions`) | LLM'ler entity ilişkilerini şemadan okur — strateji §5'in "varlık tutarlılığı" kaldıracı. **Yeni bir icat değil:** `about` deseni `json-ld.ts:239`'da vaka detayında (müşteri + sektör) zaten kullanılıyor; hizmet sayfasının `WebPage` düğümüne genişletmek aynı desenin devamı | Bugünkü liste buna **uygun değil**: `darboğaz`, `checkout`, `yol haritası` gibi jenerik kavramlar entity sayılmaz; onları `about`'a basmak spam sinyali olur ve docs/18'in övdüğü "şemaya doğrulanmamış veri basmama" ilkesini bozar. Google için zengin sonuç üretmez; fayda yalnız GEO tarafında ve ölçülmesi zor |
| **3** | **Kaldır** | Sadeleşme | Somut varlık koruması tamamen kaybolur; render doğrulaması da gider. En zayıf seçenek |

### Öneri

**1'i şimdi, 2'yi temizlenmiş listeyle sonra.** Sıra önemli: 2'yi kirli listeyle yapmak (bugünkü hâliyle) fayda değil risk üretir. 1 tamamlandığında entities listesi zaten `about`/`mentions` için doğru girdi hâline gelir — o noktada 2, düşük maliyetli bir GEO eklentisi olur.

2'ye geçilirse ayrıca netleşmesi gereken: `about` yalnız araç/platform adlarını mı taşıyacak (Figma, Shopify, Google Ads), yoksa hizmetin kendi kavramını da mı (`dönüşüm oranı optimizasyonu`). İlki daha güvenli; ikincisi kelime doldurmanın şema versiyonuna dönüşebilir.

---

## 10. Ekler

**Kanıt komutları:** `NEXT_PUBLIC_APP_STAGE=production NEXT_PUBLIC_APP_URL=https://indoles.com.tr pnpm build && pnpm start -p 3100` · `pnpm seo:audit --all --base http://localhost:3100` (124 URL, 104/20/0, exit 0) · `pnpm test` (602/1 skip) · `pnpm typecheck` · sayfa başına curl ile head-offset/canonical/hreflang/JSON-LD çıkarımı · canlı `curl https://{,www.}indoles.com.tr/robots.txt` · eski URL zincir takibi · hedefli vitest koşuları (keyword-coverage 16, en-spelling 20, parity 1, SSS kalite 71 — tümü PASS).

**Sayım özeti:** 12 hizmet · 3 pillar · 4 paket · 9 vaka · 16 makale · 10 danışman · sitemap 124 URL / 5 lastmod · SSS 44 yüzey, tümü ≥10 soru · robots'ta 10 AI botu Allow (uygulama) / 9 bot Disallow (canlı zone) · 39 redirect kuralı · 602 birim testi.

**Burak kararı bekleyen açık sorular:**
1. Cloudflare zone AI bot bloğu bilinçli bir tercih miydi (ör. WP dönemi için), yoksa varsayılan managed ayar mı? (LG-03'ün çözüm hızını belirler)
2. `<details>` geri dönüşü onaylı mı — geriye dönük ADR mi, geri alma mı? (G-12)
3. Strateji §2 P1 çelişkisi: "iş geliştirme danışmanlığı" tek hedef sayfa hangisi? (C-05)
4. EN'de beyansız düşen iki kelime bilinçli mi? (C-12)
5. `seo.entities` render edilecek mi, kontrol listesi olarak mı kalacak? (C-01 yan bulgusu)
6. `brief_submitted`'ın çağrılmaması kasıtlı mıydı (Cal.com webhook stub gerekçesiyle)? (O-05)
7. docs/18 raporu bir yerden kurtarılabilir mi, yoksa "kayıp" kaydı yeterli mi?
