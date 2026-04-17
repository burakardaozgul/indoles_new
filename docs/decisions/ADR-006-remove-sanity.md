# ADR-006 — Sanity CMS kaldırılır, içerik statik olarak tutulur

**Statü:** Accepted
**Tarih:** 2026-04-17
**Karar veren:** Burak Arda Özgül (Kurucu / CTO)
**Etkilenen dosyalar:** `CLAUDE.md`, `docs/05-tech-architecture.md`, `docs/10-content-model-sanity.md` (silinir), `docs/02-information-architecture.md`, `docs/06-data-model.md`, `docs/07-ai-agent-spec.md`, `docs/08-seo-i18n-strategy.md`, `docs/09-auth-roles-permissions.md`, `docs/11-funnel-customer-flows.md`, `package.json`, `src/lib/sanity/*`, `src/app/studio/[[...tool]]/page.tsx`, `src/app/api/webhooks/sanity/route.ts`, `sanity/sanity.config.ts`, ilgili schema/seed dosyaları

---

## Bağlam

Orijinal mimari (ADR öncesi, pre-2026-04-17): Sanity Cloud, embedded Studio (`/studio`), doküman tipleri `page` / `caseStudy` / `consultant` / `package` / `article` / `persona`. `next-sanity` ile RSC içinde GROQ fetch, webhook ile ISR invalidation, `sanity typegen` ile TS tipleri.

Pratikte gözlenen durum:
- **İçerik hacmi düşük.** Launch için ~12 hizmet sayfası, 3 pillar, 5-10 paket, 5-10 case study, 5-10 danışman profili, belirsiz sayıda blog yazısı. Tamamı statik olarak tanımlanabilir ölçekte.
- **Editor persona yok.** Launch'a kadar Burak tek karar verici; ekip dışı içerik editörü senaryosu yok. "Headless CMS + pazarlama editörü" use case'i şu an geçerli değil.
- **İçerik değişim sıklığı düşük.** Hizmet/pillar/paket tanımları strateji seviyesinde; haftada birkaç kez değişecek tipte bir yapı değil. Blog/journal içerikleri ayda birkaç post tahmini.
- **Operasyonel maliyet.** Sanity Cloud'un ücretlendirme modeli, webhook + preview + typegen akışı, Studio'nun Next.js route olarak host'lanması (auth, CSP, bundle yükü) — az içerik için yüksek operasyonel yük.
- **Git-first içerik tercihi.** Kod-native tasarım workflow'una (bkz. `CLAUDE.md §8`) paralel olarak içerik de git'te yaşamalı: PR review, versiyon, rollback, branch per-feature.
- **AI-okunabilirlik.** Statik TS/MDX dosyaları `llms.txt` ve LLM crawler'lar için daha kolay sindirilir; GROQ fetch'e bağlı dinamik içerik AI SEO ekseninde belirsizlik yaratır.

**Karar verilmezse ne olur:** Sanity stack korunur, operasyonel yük devam eder, `10-content-model-sanity.md`'deki şema tanımları implement edilir, bundle'a `sanity` + `next-sanity` + `@sanity/*` paketleri dahil olur, `/studio` route'u launch'ta canlıdır. Launch sonrası pratikte editörsüz bir CMS'e sahip olunur.

## Değerlendirilen seçenekler

### A) Sanity Cloud ile devam (orijinal plan)
- **Artı:** Profesyonel editor UI, preview mode, image CDN, webhook ISR, resmi destek.
- **Artı:** Schema-first + typegen — runtime type safety.
- **Eksi:** Launch ölçeğinde aşırı. Tek editör için UI, gerçek görev yükünün çok üstünde.
- **Eksi:** Bundle ekler (`sanity@3.99`, `next-sanity@9.12`, `@sanity/image-url`, `@sanity/vision`, `@sanity/webhook` — yaklaşık toplam 200+ transitive dep).
- **Eksi:** İçerik iki otorite altında (kod + Sanity) → hangisinin güncel olduğu belirsizliği, migration maliyeti.
- **Eksi:** CSP, auth, preview cookie, webhook signature — ek security surface.

### B) Statik içerik (seçilen) — TS / JSON / MDX
- **Artı:** İçerik git'te yaşar; PR review + rollback + blame native.
- **Artı:** Bundle minimal; runtime dependency yok.
- **Artı:** Build-time type safety tam — tip tanımları `src/lib/content/types.ts`'te zaten var (bkz. mevcut `cases.ts`, `pillars.ts`).
- **Artı:** AI crawler dostu — `llms.txt`/`llms-full.txt` direkt dosyalardan üretilir.
- **Artı:** Preview / rollback / branch-per-feature native git mekanikleri ile çalışır.
- **Eksi:** Ekip dışı editor yok — her içerik değişikliği commit gerektirir. Launch'a kadar Burak tek editör olduğu için sorun değil.
- **Eksi:** Image upload native değil — her görsel `/public` altına konur veya AWS S3/Cloudflare R2 üzerinden manuel yüklenir.
- **Eksi:** Blog/journal için MDX infra gerekir (frontmatter parser, MDX compiler, syntax highlighting). Next.js yerli MDX desteği yeterli.

### C) Başka headless CMS (Payload, Contentful, Strapi)
- **Artı:** Sanity ile aynı editör deneyimi, bazılarında self-host seçeneği.
- **Eksi:** B ile aynı maliyet/overhead; sadece vendor değişimi, problem aynı.
- **Eksi:** Migration maliyeti (şema + içerik) — şimdi değişmek, ileride tekrar değişmek anlamına gelebilir.

## Karar

**Seçenek B (statik içerik) seçildi. Sanity stack'i tamamen kaldırılır.**

İçerik türleri ve tutulacakları yer:

| İçerik türü | Format | Konum |
|---|---|---|
| Hizmetler (12 adet) | `.ts` (typed const) | `src/lib/content/services.ts` |
| Pillar'lar (Growth / Transform / Build) | `.ts` | `src/lib/content/pillars.ts` (mevcut) |
| Paketler | `.ts` | `src/lib/content/packages.ts` |
| Vaka çalışmaları | `.ts` | `src/lib/content/cases.ts` (mevcut) |
| Danışmanlar (iç ekip) | `.ts` | `src/lib/content/consultants.ts` |
| Blog / journal yazıları | `.mdx` | `content/yazilar/{slug}.tr.mdx` + `.en.mdx` |
| Sayfa içerikleri (hakkımızda, manifesto) | i18n JSON | `messages/{tr,en}.json` |
| KVKK / yasal | Markdown veya inline | `content/hukuki/*.md` |
| Görseller | Statik | `public/images/` (veya ileride Cloudflare R2) |

## Gerekçe

1. **Ölçek uyumu.** Launch içerik hacmi ~50 doküman; statik dosya ile tamamen yönetilebilir. Sanity'nin doğal kullanım eşiği (~200+ doküman, çoklu editör) bu projede yok.
2. **Operasyonel sadeleşme.** 5 npm paketi + 1 SaaS bağımlılığı + webhook + preview + auth katmanı ortadan kalkıyor.
3. **Kod-native tutarlılık.** Design (`CLAUDE.md §8`), i18n (git'teki JSON), ve içerik — hepsi aynı branch/PR akışında. Üç farklı otorite yerine tek.
4. **AI SEO uyumu.** `docs/08-seo-i18n-strategy.md`'nin llms.txt odağı statik içerikle doğrudan çakışıyor; fetch'li CMS ekstra jsonld/fetch gerektiriyordu.
5. **Reddedilen:** (A) sadece editör ekibi büyüdüğünde mantıklı olurdu — 12+ aylık horizonda bile 1-2 kişilik ekip bekleniyor. (C) vendor değişimi problem değişimi değil.

## Sonuçlar

### Pozitif

- **Bundle:** `sanity@3.99`, `next-sanity@9.12`, `@sanity/image-url`, `@sanity/vision`, `@sanity/webhook` kaldırılıyor — production bundle küçülür, build süresi kısalır.
- **Build:** Runtime CMS fetch yok → cold start hızlanır, ISR revalidate mekanizması sadeleşir (webhook yok, sadece build-time veya `revalidatePath` manuel çağrı).
- **Security surface:** `/studio` route auth, webhook signature, preview cookie, Sanity-related CSP kaldırılır.
- **Tip güvenliği:** İçerik TS compiler tarafından doğrulanır; yanlış field kullanımı build'de yakalanır (GROQ'ta runtime hatası yerine).
- **Maliyet:** Sanity Cloud lisans ücreti sıfırlanır.

### Negatif / trade-off

- **Editör UX yok.** Her içerik değişikliği commit + PR + deploy cycle gerektirir. Launch'a kadar sorun değil; büyüme ile yeniden değerlendirilir.
- **Image hosting manuel.** `/public` statik; CDN avantajı için gerekiyorsa Cloudflare R2/S3 entegrasyonu ayrı bir karar.
- **MDX infra gerekli.** Blog için frontmatter, reading time, code block syntax — Next.js kendi MDX desteği + `rehype-*` plugin'leri ile çözülür.
- **Mevcut kod temizliği borç.** `src/lib/sanity/`, `src/app/studio/`, `src/app/api/webhooks/sanity/`, schema referansları, `package.json` deps — bu ADR'nin implementasyon fazında veya takip task'ında temizlenecek.

### Yeniden değerlendirme tetikleyicileri

Aşağıdaki durumlardan biri gerçekleşirse bu ADR yeniden açılır:

- **Editör ekibi >2 kişi.** Pazarlama/içerik ekibi commit workflow'unu kullanamayacak kadar büyürse.
- **İçerik hacmi >200 doküman.** Statik dosyaların bakımı sürdürülemez hale gelirse.
- **Non-teknik editör gereksinimi.** Danışman/müşteri kendi profilini günceller hâle gelirse.
- **Real-time preview ihtiyacı.** Blog yazısı inceleme sürecinde staged preview kritik hale gelirse (git PR preview bu ihtiyacı zaten karşılıyor gibi duruyor).

## Implementasyon notları

### Şimdi (bu ADR ile birlikte, docs-only)

- Bu dosya yazılır.
- `CLAUDE.md §4` (tech stack) — CMS satırı güncellenir.
- `CLAUDE.md §7` (klasör haritası) — `10-content-model-sanity.md` satırı kaldırılır.
- `CLAUDE.md §9` (docs rehberi) — Sanity schema tetikleyicisi kaldırılır.
- `docs/10-content-model-sanity.md` silinir (git history'de korunur).
- `docs/05-tech-architecture.md` — CMS bölümü + Sanity diyagram akışları + webhook + deployment env var'ları güncellenir (Sanity çıkarılır).
- `docs/02-information-architecture.md`, `06-data-model.md`, `07-ai-agent-spec.md`, `08-seo-i18n-strategy.md`, `09-auth-roles-permissions.md`, `11-funnel-customer-flows.md` — Sanity referansları bu ADR'ye yönlendirilir veya statik alternatif ile değiştirilir.

### Follow-up (Phase 6 veya dedicated task)

- `package.json`'dan Sanity deps çıkarılır: `sanity`, `@sanity/image-url`, `@sanity/vision`, `@sanity/webhook`, `next-sanity`. `sanity:typegen` script silinir.
- `sanity/sanity.config.ts` dosyası silinir.
- `src/app/studio/[[...tool]]/page.tsx` silinir.
- `src/app/api/webhooks/sanity/route.ts` silinir.
- `src/lib/sanity/client.ts`, `src/lib/sanity/queries.ts` silinir.
- `src/lib/content/types.ts`'te Sanity-specific tipler temizlenir.
- `src/app/(admin)/admin/page.tsx` ve `src/app/(auth)/app/brief/yeni/page.tsx` — Sanity query referansları statik import'larla değiştirilir veya ilgili feature'lar sadeleştirilir.
- `src/server/db/schema.ts` + `seed.ts` + migration SQL'lerdeki Sanity doc id referansları kaldırılır.
- `.env` ve SST secret'lardan `SANITY_*` kaldırılır.
- CSP policy'den Sanity domain'leri kaldırılır.
- Launch içerik migration'ı: hizmet/pillar/paket/case/consultant için TS dosyaları yazılır; blog için MDX infra kurulur.

### Rollback planı

ADR-006 reddedilirse: bu dosya ve CLAUDE.md değişiklikleri revert edilir. `docs/10-content-model-sanity.md` git history'den restore edilir (`git show <sha>:docs/10-content-model-sanity.md`). Kod seviyesinde bu ADR henüz kod çıkarımı yapmadığı için rollback maliyeti yalnızca doc revert.

## Referanslar

- Önceki stack tanımı: `docs/05-tech-architecture.md §1` (bu ADR sonrası güncellendi)
- İçerik modeli önerisi (iptal edildi): `docs/10-content-model-sanity.md` (bu ADR ile silindi; git history'de korunur)
- İlgili kod-native tasarım ADR'si: `docs/decisions/ADR-002-stitch-design-reject.md`, ve `CLAUDE.md §8 Design Workflow (Code-Native)` — aynı felsefeyi içeriğe genişletiyor.
- İçerik/i18n parity kuralları: `docs/08-seo-i18n-strategy.md` (TR ↔ EN parite gereksinimleri artık git'te JSON/MDX parite ile karşılanır).
