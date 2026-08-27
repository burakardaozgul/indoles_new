# ADR-024 — Cloudflare Workers'da barındırma ve kanonik host `www`

- **Durum:** Kabul edildi
- **Tarih:** 2026-08-27
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** Launch öncesi dağıtım kararı · `docs/19-seo-geo-audit-2026-08-27.md` bulguları LG-01, LG-04, LG-05
- **İlgili:** ADR-012 (Vercel deploy — **bu ADR ile geçersiz kılınıyor**)
- **Etkilenen dosyalar:** `src/lib/seo/site.ts`, `.env.example`, `CLAUDE.md` §4, `docs/05-tech-architecture.md`, `docs/08-seo-i18n-strategy.md`

---

## Bağlam

İki karar bugüne kadar askıdaydı ve ikisi de launch'ı blokluyordu:

**1. Nerede barındırılacak?** ADR-012 Vercel diyordu. 2026-08-25'te `@opennextjs/cloudflare` ve `wrangler` devDependency olarak eklendi (commit `ae1b041`, mesajında "Dağıtım Cloudflare Workers'a taşınıyor (bkz. hosting kararı)" yazıyor) — ama atıf yapılan "hosting kararı" belgesi repoda hiç yoktu. Karar yalnız commit mesajında yaşıyordu; CLAUDE.md §4 hâlâ "Deploy: Vercel (eu-central)" diyordu. Bu, CLAUDE.md §3'ün kendi ADR disiplinini ihlal ediyordu (denetim LG-05).

**2. Kanonik host apex mi www mi?** `docs/17` §11'de "apex" kaydedilmişti ve kod apex varsayıyordu (`site.ts` FALLBACK). Ama canlı DNS apex'i zaten `www`'ye 301'liyordu ve site (WordPress) `www`'de duruyordu. Yanlış yönde yapılacak bir launch, 124 URL'lik sitemap'in tamamını kalıcı bir yönlendirmenin arkasına koyar; eski sitenin biriktirdiği sinyal seyrelir ve her sayfa gereksiz bir sıçrama kazanırdı (denetim LG-01).

Karar verilmezse: deploy yolu tanımsız kalır (LG-04), env zinciri kurulamaz ve `NEXT_PUBLIC_APP_STAGE` yanlışsa site tamamen indeks dışı yayına çıkar (LG-02).

## Değerlendirilen seçenekler

### Barındırma

**A) Vercel'de kalmak (ADR-012).** Next.js'in referans platformu; sıfır adaptör riski, en olgun App Router desteği. Ama proje zaten Cloudflare'in arkasında (DNS, CDN, WAF, Turnstile) — ikinci bir platform ikinci bir fatura, ikinci bir panel ve iki ayrı yerde tanımlanan yönlendirme/başlık kuralları demek.

**B) Cloudflare Workers + OpenNext adaptörü.** Domain, DNS, CDN, WAF ve Turnstile zaten burada; tek panel, tek fatura, edge'e yakın çalışma. Bedeli: OpenNext bir uyarlama katmanı — Next sürümüyle uyum zorunluluğu getiriyor (`>=15.5.21`, projede 15.5.15 var) ve Node.js çalışma zamanı varsayan kütüphaneler (ör. Sentry'nin sunucu tarafı) ayrıca doğrulanmalı.

### Kanonik host

**A) apex (`indoles.com.tr`).** Kısa, temiz. Ama canlı yönlendirme apex→www yönünde; tersine çevirmek eski sinyali bir kez daha kırar.

**B) `www.indoles.com.tr`.** Eski sitenin indekslendiği host; GSC geçmişi, backlink'ler ve GBP bağlantısı burada. Cloudflare tarafında `www` bir CNAME olarak Workers'a bağlanabiliyor.

## Karar

**Barındırma: Cloudflare Workers (OpenNext adaptörü) — ADR-012 geçersiz.**
**Kanonik host: `https://www.indoles.com.tr`.**

## Gerekçe

1. **Altyapı zaten Cloudflare'de.** Domain, DNS, CDN, WAF ve Turnstile tek panelde; ikinci bir platform ikinci bir hata yüzeyi (denetim LG-03'te tam da bu oldu: Cloudflare'in yönettiği robots.txt, uygulamanın ürettiğini eziyordu — bunun tek panelden görülmesi kolaylaştı).
2. **`www` mevcut sinyali koruyor.** Eski sitenin gösterim geçmişi, GSC property'si ve dış bağlantıları `www`'ye ait. Apex'e taşınmak, 301'lerle taşınabilir ama gereksiz bir kayıp riski — üstelik launch haftasında.
3. **Yön zaten doğru kurulu.** Canlı DNS apex→www 301'liyor; kararı `www` yapmak mevcut davranışı korur, tersi ise hem DNS'i hem 39 redirect kuralının hedefini yeniden düşünmeyi gerektirirdi.
4. **A (Vercel) reddedildi** çünkü tek somut üstünlüğü (adaptör riski yok) sürüm yükseltmesiyle kapanabilir bir maliyet; buna karşılık iki platform kalıcı bir işletme yükü.

## Sonuçlar

### Pozitif
- Tek panel, tek fatura; yönlendirme/başlık/WAF kuralları tek yerde
- Eski sitenin arama sinyali korunuyor; cutover tek yönlü ve öngörülebilir
- Kanonik host tek sabitten (`src/lib/seo/site.ts`) türüyor: canonical, hreflang, sitemap (124 URL), robots `Host`/`Sitemap` satırları ve llms.txt birlikte değişti — doğrulandı, apex kalıntısı sıfır

### Negatif / trade-off
- **OpenNext bir uyarlama katmanı.** `htmlLimitedBots`, `MetadataRoute` route handler'ları ve OG görsel üretimi Workers altında birebir aynı davranmak zorunda — lokal `next start` doğrulaması bunu garanti etmiyor, preview deploy'da yeniden ölçülmeli
- **Next sürümü yükseltilmeli** (15.5.15 → ≥15.5.21); adaptörün peer aralığı bunu şart koşuyor
- **Sentry'nin sunucu tarafı** Node.js çalışma zamanı varsayıyor; `@sentry/cloudflare` gerekebilir (O-03 kapatılırken gözetilecek)
- `www` dört karakter daha uzun — görsel/marka yüzeylerinde (OG görseli, künye) apex yazımı bilinçli olarak korundu; bu yalnız **teknik kanonik** karardır

### Yeniden değerlendirme tetikleyicileri
- OpenNext adaptörü Next sürümüyle kalıcı olarak uyumsuz kalırsa
- Workers çalışma zamanı SEO yüzeylerinden birini (robots, sitemap, OG, metadata) bozarsa
- Cloudflare'in yönettiği bir özellik uygulamanın çıktısını yeniden ezerse (LG-03'ün tekrarı)

## Implementasyon notları

**Yapıldı (2026-08-27):**
- `src/lib/seo/site.ts` — `FALLBACK` `https://www.indoles.com.tr`, gerekçesi kodda
- `.env.example` — `NEXT_PUBLIC_APP_STAGE` ve `NEXT_PUBLIC_APP_URL` ilk kez belgelendi (LG-02 uyarısıyla), `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ZONE_ID` eklendi
- `src/lib/seo/__tests__/llms.test.ts` — sabit host yerine `SITE_URL`'den türetiliyor (host kararı değişince test kırılmasın)

**Yapıldı (deploy zinciri, 2026-08-27):**
1. **Next 15.5.15 → 15.5.24** — adaptörün peer aralığına girdi; typecheck temiz, 634 test geçti
2. **`open-next.config.ts`** — bilinçli boş (site SSG, ISR yok; R2/DO katmanları kurulmadı)
3. **`wrangler.jsonc`** — `nodejs_compat` + `global_fetch_strictly_public`, assets binding, observability, `compatibility_date` kurulu workerd'a göre
4. **Aşama değişkenleri script'e gömüldü** — `cf:build` production, `cf:build:preview` preview. LG-02 artık deploy edenin hatırlamasına bağlı değil
5. **Dağıtım başarılı** — Worker açılış süresi 36 ms, `workers.dev` adresi yayında
6. **`preview.indoles.com.tr`** custom domain olarak bağlandı (aşağıdaki not)

**Worker boyut sınırı — OG görselleri statiğe çevrildi.**
İlk dağıtım denemesi *"Worker exceeded size limits"* ile düştü: paket 3,65 MB gzip, ücretsiz plan sınırı 3 MB. Ölçüm yapıldı — Sentry sarmalı yalnız 40 KB tutuyordu, asıl ağırlık `@vercel/og` + `fontkit` (~2,2 MB) idi ve bu makine **tek ve değişmeyen** bir marka kartı üretmek için çalışıyordu. Üç üretici (`opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`) bir kez render edilip statik PNG'ye çevrildi; çıktı birebir aynı, SEO kaybı yok (sayfa başına farklı görsel zaten üretilmiyordu). Sonuç: **3,65 MB → 2,98 MB**, sınırın altında.
**Uyarı:** kalan pay yalnız ~15 KB. Yeni bir sunucu bağımlılığı eklemeden önce `pnpm exec wrangler deploy --dry-run` ile boyut ölçülmeli. Sayfa başına dinamik OG (denetim `docs/18` S-01) istenirse üretici geri gelir ve **Workers Paid** planı gerekir.

**Yapılacak (cutover):**
1. Sunucu sırları: `wrangler secret put RESEND_API_KEY` (+ `TURNSTILE_SECRET_KEY`, `SENTRY_DSN`); `NEXT_PUBLIC_GA_ID` build değişkeni olarak
2. `preview.indoles.com.tr` üzerinde `scripts/cf-smoke.sh` — 27 kontrol
3. `wrangler.jsonc` `routes` dizisine `www.indoles.com.tr` eklenir (satır hazır, yorumda)
4. WordPress kapatılır, GSC'ye yeni sitemap verilir, eski Yoast sitemap'i kaldırılır, Bing/IndexNow kurulur

**Sırlar:** Cloudflare API token'ı repoya **yazılmaz**; `wrangler secret` veya CI secret'i olarak verilir. `.env.example` yalnız değişkenin adını taşır. Sohbet/issue/PR'a yapıştırılmış bir token açığa çıkmış sayılır ve iptal edilip yenilenmelidir.

**Rollback:** Kanonik host tek sabitte olduğu için geri dönüş `site.ts` + env değişikliğidir; ancak indeksleme başladıktan sonra host değiştirmek 124 URL'lik bir taşıma demektir — pratikte tek yönlü karar.

## Referanslar

- `docs/19-seo-geo-audit-2026-08-27.md` — LG-01 (host), LG-04 (deploy zinciri), LG-05 (kayıp ADR), LG-02 (env riski), LG-03 (zone'un robots.txt'i ezmesi)
- ADR-012 — Vercel deploy (bu ADR ile geçersiz)
- `src/lib/seo/site.ts` — kanonik host tek kaynağı
