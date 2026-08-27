## Durum: SEO/GEO denetimi + Cloudflare deploy zinciri kuruldu — 2026-08-27

- Branch: `main` (çalışma ağacında ~51 commit edilmemiş değişiklik)
- **Doğrulama adresi yayında: https://preview.indoles.com.tr** (Worker açılışı 36 ms)
- Canlı `www.indoles.com.tr` hâlâ **eski WordPress** — cutover yapılmadı, dokunulmadı
- Barındırma: **Cloudflare Workers + OpenNext** (ADR-024; ADR-012/Vercel superseded)
- Kanonik host: **`www.indoles.com.tr`** (ADR-024)
- Denetim raporları: `docs/17` (23-24 Ağu) · `docs/18` (24 Ağu, kurtarıldı) · **`docs/19` (27 Ağu, güncel)**
- Strateji: `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` **v1.7**
- **Kelime önceliklendirmesi:** `docs/strateji/Keyword-Onceliklendirme-2026-08-27.md` — üç dalga, takvim yeniden sıralaması, ölçüm çerçevesi + 7 alarm eşiği

### Deploy zinciri (LG-04 — kuruldu ve doğrulandı)

| Parça | Durum |
|---|---|
| Next 15.5.24 | Adaptör peer aralığında (`>=15.5.21`) |
| `open-next.config.ts` | Bilinçli boş — site SSG, ISR yok |
| `wrangler.jsonc` | assets binding, `nodejs_compat`, observability; `www` route'u **yorumda** (cutover'da açılacak) |
| Script'ler | `cf:build`, `cf:build:preview`, `cf:preview`, `cf:deploy`, `cf:deploy:preview`, `cf:typegen` |
| `scripts/cf-smoke.sh` | 29 kontrol · `CF_SMOKE_DOH=1` ile yerel DNS önbelleğini atlar |
| **Smoke sonucu** | **29/29 geçti** — metadata `<head>`'de, canonical `www`, sitemap 124 URL, 404 doğru dilde, 301'ler 308 |

**LG-02 yapısal olarak çözüldü:** aşama değişkenleri `package.json` script'lerine gömülü. `cf:build` production, `cf:build:preview` preview — doğrulama adresleri bu yüzden `noindex` çıkıyor.

**Worker boyutu kritik:** 2,98 MB / 3 MB (ücretsiz plan) — **pay ~15 KB**. Yeni sunucu bağımlılığından önce `pnpm exec wrangler deploy --dry-run`. OG/icon üreticileri bu yüzden statik PNG'ye çevrildi (`@vercel/og` + `fontkit` ~2,2 MB tutuyordu; çıktı birebir aynı, SEO kaybı yok). Sayfa başına dinamik OG istenirse **Workers Paid** gerekir.

**`*.workers.dev` bu ağdan HTTPS ile açılmıyor** (SNI engellemesi; Cloudflare'in kendi örneği de aynı). Doğrulama bu yüzden kendi alan adımızdaki `preview.` alt alanından yapılıyor.

### Bugün ne oldu

**Re-audit (docs/19).** Dört paralel iş paketi: teknik SEO + altyapı, GEO hazırlığı, içerik–keyword uyumu (TR+EN), canlı site envanteri. Önceki denetimin dokuz "çözüldü" kaydı regresyonsuz doğrulandı.

**`docs/18` kurtarıldı.** Strateji v1.4'ün refere ettiği 24 Ağustos denetimi repoya hiç yazılmamıştı; tam metni oturum kaydından çıkarılıp `docs/18-seo-geo-puanlama-2026-08-24.md` olarak eklendi. O raporun bu denetimde yakalanmayan beş bulgusu çapraz kontrol edildi (`docs/19` §9) — dördü hâlâ geçerli.

**On bir kalem uygulandı.**

| Bulgu | Ne yapıldı |
|---|---|
| LG-03 | Cloudflare zone'unun AI bot engeli + managed robots.txt kapatıldı (Burak); canlıda doğrulandı — GPTBot/ClaudeBot/CCBot/Google-Extended eşleşmesi 0 |
| G-12 | SSS'lerin native `<details>`'te kalması **ADR-023** olarak kayda geçti; `docs/17` §12'nin ters kaydına düzeltme notu |
| C-05 | Başlık çakışması bitti: ana sayfa "Dönüşüm ve büyüme stüdyosu, İstanbul", hakkımızda "iki eksen, bir disiplin"; `/tr/hizmetler` tek hedef. Strateji §2 P1'deki kaynak çelişki de düzeltildi |
| C-12 | İki beyansız EN kelimesi yerleşti → oran **13/15** |
| C-13 | EN hedefleri ilk kez regresyon testi altında (`searchSurfaceEn` + `TARGETS_EN`, 9 kelime-sayfa çifti + `agency` yerleşim kuralı) |
| C-03 | Hizmet→vaka eşlemesi künye-öncelikli (`relatedCaseForService`); 5 hizmetin vakası düzeldi (CRO → GYMWOLVES) |
| C-01 | "Yapay zeka ajansı" kendi karşı-konumlandırma sorusunu aldı (TR+EN) |
| C-07 | İki GSC yazım varyantı (`artırma`/`arttırma`) farklı yüzeylere dağıtıldı |
| G-11 | Per-locale `/tr/llms.txt` + `/en/llms.txt`; üretim mantığı `src/lib/seo/llms.ts`'e çıkarıldı, kök çıktı korundu |
| T-08b + T-15 | 404 ilk HTML'i artık doğru dilde başlık/gövde taşıyor, tek `noindex`, canonical mirası kesildi; 3 e2e testi (`request.get` ile ham HTML) |
| O-05 | `brief_submitted` GA4'e bağlandı (submit handler'ında, çift gönderim mimari olarak engelli); `homepage_hero_viewed` taksonomiden çıkarıldı |

### Doğrulama

```
pnpm typecheck        temiz
pnpm test             634 geçti / 1 atlandı (68 dosya)
playwright not-found  3/3 geçti
pnpm build            exit 0 (NEXT_PUBLIC_APP_STAGE=production)
pnpm seo:audit        124 URL · 104 PASS / 20 WARN / 0 FAIL
pnpm cf:build         exit 0 · worker 2,98 MB gzip
cf-smoke.sh           29/29 (preview.indoles.com.tr)
404 ham HTML          /tr → "Sayfa bulunamadı", /en → "Page not found", karşı dil sızıntısı yok
canlı robots.txt      AI bot engeli yok (LG-03 kapandı)
```

**Commit/push yapılmadı.** Dağıtım yalnız doğrulama adresine yapıldı (`preview.indoles.com.tr`); canlı `www` ve WordPress'e dokunulmadı.

---

## Burak'ın kararını bekleyen üç başlık

| # | Konu | Neden bekliyor |
|---|---|---|
| 1 | **Persona görünürlüğü (G-01)** | `PersonaText` iki varyantı da DOM'a basıyor, seçimi CSS yapıyor; Googlebot'ta çerez olmadığı için ticaret persona'sının ~2.772 TR kelimesi (EN ~3.049) hiç indekslenmiyor, 22 canlı URL'de. ADR-022 kapsamı yarıya indirdi ama mekanizma duruyor. **Launch öncesi karar** — Google ilk taramada ne görürse onu indeksler. Dört seçenek `docs/19` §9'da |
| 2 | **`seo.entities` rolü** | Alan render edilmiyor, yalnız `seo:audit` okuyor (render doğrulaması yapıyor — `keyword-coverage`'ın yapamadığı şey). Öneri: rolü keskinleştir (hedef kelimeleri çıkar, somut varlıklar kalsın), sonra temizlenmiş listeyi JSON-LD `about`/`mentions`'a bas — `about` deseni vaka detayında zaten kullanılıyor |
| 3 | **CLAUDE.md §4 senkronu** | Dosya hâlâ "Deploy: Vercel (eu-central) · ADR-012" diyor; gerçek ADR-024 (Cloudflare Workers, host `www`). CLAUDE.md yalnız Burak onayıyla güncelleniyor — onay verilirse tek satırlık düzeltme |

Ek onay: ana sayfa başlığındaki "stüdyo" ve "İstanbul" ilk kez `<title>`'a girdi.

## Launch kapısı — açık P0'lar

| # | İş | Sahip |
|---|---|---|
| 1 | ~~Deploy zinciri~~ — **tamam**, smoke 29/29 | — |
| 2 | Sunucu sırları: `wrangler secret put RESEND_API_KEY` (+ `TURNSTILE_SECRET_KEY`, `SENTRY_DSN`); `NEXT_PUBLIC_GA_ID` build değişkeni — **GA4 bu olmadan hiç yüklenmiyor** | Burak |
| 3 | Cutover: `wrangler.jsonc` `routes`'a `www.indoles.com.tr` eklenir (satır hazır), WP kapatılır, GSC'ye yeni sitemap + eski Yoast sitemap'in kaldırılması, Bing/IndexNow | Burak |
| 4 | Persona görünürlüğü kararı (yukarıdaki tablo) | Burak |

> **LG-02 artık yapısal olarak kapalı:** aşama değişkenleri `package.json` script'lerine gömülü, deploy edenin hatırlamasına bağlı değil. Yine de cutover sonrası ilk kontrol: `curl https://www.indoles.com.tr/robots.txt` — hem aşamayı hem Cloudflare'in managed robots.txt'i yeniden devreye sokmadığını (LG-03) doğrular.

## İçerik: Dalga 1 (launch + ilk 30 gün)

Ayrıntı `Keyword-Onceliklendirme-2026-08-27.md` §2. Öne çıkanlar:

- **Hafta 1-2:** AI slotları (h.1-2 "AI dönüşümü nedir", h.2-2 "AI danışmanı seçerken 12 soru") + GEO slotları (h.7-2 "AI Overviews", h.10-2 "llms.txt nedir" — kendi uygulamamız vaka olarak)
- **En ucuz kazanç:** `yapay zeka optimizasyonu` GSC'de **136 gösterim** alıyor ama sitede hiç geçmiyor. Tek cümlelik ekleme
- **Yazım varyantı boşlukları:** `ab testi nedir` (site "A/B testi nedir?" diyor, boşluksuz varyant eşleşmiyor) · `e ticaret dönüşüm oranı artırma` (C-07 kısa formu koydu, önekli tam form yok)
- **Karar verildi:** GEO makalesi üçe bölünecek (kanonik rehber aynı slug'da kalır — poz. 38 tohumu korunsun) · reklam havuzu makalesi hafta 7'ye · kariyer-niyetli sorgular KPI'dan düşülecek · EN-UX kümesi kapatıldı

## Sıradaki iş kalemleri (P1)

- 10 danışmanın LinkedIn URL'i — şema hazır, veri Burak'ta (E-E-A-T'nin en ucuz çarpanı)
- `/vakalar` seçilmiş vakalar bloğundaki ikinci persona mekanizması (G-18): commerce metni SSG çıktısında hiç yok; `seo:audit`'in `persona-leak` kuralı bu deseni yakalayamıyor
- İçerik: takvim h.1-2 "AI dönüşümü nedir" + h.2-2 "AI danışmanı seçerken 12 soru" — `yapay-zeka` konusunda 0 makale olduğu için 12 hizmetin 7'sinde "ilgili yazı" bloğu hiç render edilmiyor
- Dört hizmetin (dijital-donusum, is-zekasi, isletme-muhendisligi, teknoloji-ve-altyapi) künyesinde vaka yok — pillar fallback'ine düşüyorlar
- CLAUDE.md §4 deploy satırı (ADR-024 yazıldı, CLAUDE.md senkronu Burak onayında)

## Hızlı kontrol

```bash
cd "/Users/burakardaozgul/Development/AA - Claude Code/INDOLES - Yeni/indoles-web"
pnpm typecheck && pnpm test
pnpm cf:build                      # host + aşama script'in içinde
pnpm exec wrangler deploy --dry-run # boyut ölçümü (sınıra ~15 KB pay var)
pnpm cf:deploy:preview             # doğrulama adresine dağıt (noindex)
CF_SMOKE_DOH=1 scripts/cf-smoke.sh https://preview.indoles.com.tr

# Lokal denetim (seo:audit çalışan sunucu ister)
NEXT_PUBLIC_APP_STAGE=production NEXT_PUBLIC_APP_URL=https://www.indoles.com.tr pnpm build
NEXT_PUBLIC_APP_STAGE=production NEXT_PUBLIC_APP_URL=https://www.indoles.com.tr pnpm start -p 3100
pnpm seo:audit --base http://localhost:3100
```

## Yeni session başlatma

"active_context.md'yi oku" — bu kadar yeterli. Denetim ayrıntısı için `docs/19-seo-geo-audit-2026-08-27.md`.
