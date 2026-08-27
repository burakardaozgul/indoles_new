# INDOLES Web — Proje Bağlam Dosyası

Bu dosya Claude Code'un workspace memory'sidir. Her session başında otomatik okunur.
Güncellemeler yalnızca Burak'ın onayıyla yapılır.

---

## 1. Proje Misyonu

INDOLES (İndoles Yazılım A.Ş.), Türkiye merkezli bir iş geliştirme danışmanlık şirketi ve reklam ajansıdır. Sanayi şirketlerine teknoloji dönüşümü, AI danışmanlığı, otomasyon sistemleri, yazılım tasarımı, akıllı ERP ve İş yönetim yazılımları sunar. Ticaret ve perakende markalarına agresif büyüme, dijitalleşme, e-ticaret ve pazarlama danışmanlığı sunar. Bu repo, şirketin ana dijital varlık noktası olan kurumsal web platformunu barındırır — müşteri edinme, danışman vitrini, brief/rezervasyon funnel'ı ile deneyim sağlar.

**Ana vaat:** "Sanayi için Endüstri v5.0 -> 6.0 dönüşümü, Markalar için agresif büyüme ve net kâr."

---

## 2. Takım

| İsim | Rol | Sorumluluk |
|------|-----|------------|
| Burak Arda Özgül | Kurucu - Marka Stratejisti ve Kreatif Direktör| Vizyon, mimari, UX kararları, brand voice |

- **Background:** 8+ yıl dijital pazarlama/reklam/markalaşma + AI SaaS co-founder deneyimi (ADUARDO)
- **Ekip durumu:** Ürün/mimari kararlarında tek karar verici Burak'tır. Implementation desteği Claude Code üzerinden yürütülür.
- **Kadro:** 2026-08-19'da 10 kişilik kadro `src/lib/content/consultants.ts`'e alındı (kaynak: Claude Studio tasarım projesi). Site artık tek kişilik bir vitrin değildir; `/danismanlar` bu kadroyu listeler.
- **Önemli:** Hayali roller (designer onayı, teknik lead review, PM sign-off vb.) icat edilmez. Karar mekanizması Burak'tır.

---

## 3. Çalışma Prensipleri

### Temel Prensipler

| Prensip | Açıklama |
|---------|----------|
| Türkçe iletişim, İngilizce teknik terimler | Açıklama ve tartışma Türkçe; değişken, kavram, teknoloji isimleri İngilizce kalır |
| Yapılandırılmış output | Tablo, liste, mermaid diyagram agresif kullan. Wall-of-text üretme |
| ADR disiplini | Mimari karar değişirse ilgili `docs/*.md` güncelle ve `docs/decisions/ADR-XXX.md` oluştur |

### Yasaklı Davranışlar (Anti-patterns)

- **Boilerplate kod üretme** — her satır INDOLES'e özel olmalı
- **"Best practice olduğu için"** tek başına yeterli gerekçe değildir; karar `docs/*.md`'deki prensiplere uymalı
- **Sessizce varsayım yapma** — muğlak bir durumda dur, sor
- **Yeni dependency eklemeden önce gerekçelendir** — bundle size, maintenance, lock-in, alternatifler değerlendirilmeli
- **Türkçe metinlerde gereksiz anglicizm** — "campaign" değil "kampanya", "case study" değil "vaka çalışması"; yalnızca çok yerleşmiş sektörel teknik terimler İngilizce kalır.
- **Markdown/kod yorumlarında emoji yok** — editorial-minimalist dille bağdaşmıyor; emoji yalnızca UI component'inde işlevsel ikon olarak kullanılır (örn. gerçek anlam taşıyan bir ikon), dokümantasyon ve kod yorumlarında kullanılmaz

---

## 4. Tech Stack Özeti

**Mimari seçim:** Next.js 15 SSG + 2 REST API route. DB yok, auth yok, payment yok. Detay: `docs/05-tech-architecture.md` ve `docs/superpowers/specs/2026-04-17-simplification-design.md`.

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| Frontend | Next.js 15 (App Router, RSC, SSG) | React 19 |
| Styling | Tailwind v4 + Radix UI + cva | `src/lib/design/tokens.ts` → `src/styles/globals.css` |
| Tipografi | Lexend (display) + Inter (gövde) + JetBrains Mono (etiket) | `next/font/google`; ADR-015 |
| Marka rengi | teal-700 `#2C5566` + tek accent gold-500 `#B8956A` | ADR-015 |
| Motion (ana site) | Canvas 2D (dalga, ağ) + scroll-bağlı sticky mekanizmalar | Framer Motion kaldırıldı |
| Motion (v2) | Three.js + @react-three/fiber + custom GLSL · Lenis · GSAP ScrollTrigger | ADR-016 |
| Backend | Next.js Route Handlers (2 endpoint) | `/api/contact`, `/api/visitor-profile` |
| Database | **Yok** | Launch'ta DB yok; ADR-010 |
| Auth | **Yok** | Launch'ta auth yok; ADR-008 |
| İçerik | Statik TS + MDX | `src/lib/content/*.ts` + `content/yazilar/*.mdx`; ADR-006 |
| Booking | Kendi takvim sistemi — entegrasyon bekliyor; Cal.com kaldırıldı (ADR-025) | şimdilik form + e-posta |
| Ödeme | **Yok** | ADR-009 |
| AI Agent | **Yok** | Launch'ta agent yok; ADR-007 |
| i18n | next-intl | Path-based TR+EN |
| Background Jobs | **Yok** | ADR-011 |
| Email | **Veridyen SMTP** (`worker-mailer`) + React Email | Transactional; From `noreply@`, Reply-To `digital@` — ADR-026 |
| Spam koruma | Cloudflare Turnstile | Invisible |
| Analytics | Google Analytics 4 | Tek ölçüm sağlayıcı (ADR-021; PostHog kaldırıldı) |
| Observability | Cloudflare Workers observability + `lib/observability/report.ts` | Sentry kaldırıldı — init edilmiyordu, ~864 KiB ölü ağırlıktı (ADR-027) |
| Deploy | **Cloudflare Workers + OpenNext** · kanonik host `www.indoles.com.tr` | ADR-024 (ADR-012/Vercel superseded) |
| CI/CD | GitHub Actions + `pnpm cf:deploy:preview` → `preview.indoles.com.tr` | — |
| Test | Vitest + Playwright | — |

---

## 5. Temel Mimari Kararlar

### Üç Pillar Yapısı

| Pillar | Hizmetler | Nitel Odak |
|--------|-----------|------------|
| **Growth** | Marka Stratejisi ve Pazarlama Danışmanlığı, Performans Pazarlama, CRO, E-Ticaret Danışmanlığı, UI/UX Tasarım | Marka bilinirliği, gelir büyümesi, müşteri edinimi, dönüşüm |
| **Transform** | Endüstri v5 & v6 dönüşümü, AI Danışmanlığı, Dijital Dönüşüm, İş Otomasyonları, İş Zekası, İşletme Mühendisliği, Akıllı ERP ve İş Yönetim Yazılımları | Verim, maliyet optimizasyonu, dönüşüm |
| **Build** | Özel Yazılım ve Mobil Uygulama, Teknoloji ve Altyapı Danışmanlığı | Altyapı, ürün, teknik kapasite |

Üç pillar'a dağıtılmış.

> **Ton kuralı:** Ton persona ekseninden gelir (bkz. Persona-Driven Homepage alt-bölümü), pillar'dan değil. Aynı pillar içinde iki farklı persona farklı tonlarla konuşulur. Detaylı ton matrisi `docs/03-brand-voice-tone.md`'de tanımlanır.

### Ürünleşmiş Paketler

Funnel'ın birincil giriş kapısı. Sabit kapsam + sabit süre + sabit fiyat formatında, küçük-orta taahhüt gerektiren ürünler. İçerik olarak teşhis, strateji, hızlı audit, sprint-tarzı implementation veya bunların kombinasyonu olabilir — ama nihai amaç müşteri ile ilk angajmanı kurmak ve sonrasında proje bazlı iş veya aylık retainer'a dönüşüm sağlamaktır.

Mantık: Bir SaaS'ın "starter plan"ı gibi. Müşteri buradan içeri girer, değer görür, büyür.

Paketler navigasyonda pillar'larla eşit seviyede yer alır.

### Persona-Driven Homepage

Hero'da audience switch iki eksen üzerinden çalışır:

| Eksen | Hedef Alıcı | Odak | Ton |
|-------|-------------|------|-----|
| (A) Sanayi için Teknoloji Dönüşümü | Sanayici alıcı (büyük şirketler, kurumsal KOBİ'ler) | Dönüşüm, verim, ihracat | Dingin, kurumsal, metodik (McKinsey-benzeri) |
| (B) Ticaret için Agresif Büyüme | E-ticaret + perakende + ticari marka | Büyüme, pazar payı, hız | Dinamik, atletik, sonuç-odaklı (Shopify-benzeri) |

**Bu ayrım B2B/B2C değildir, Enterprise/SMB değildir** — vaat tipi ve satın alma psikolojisi ayrımıdır. Site içi deneyim (suggested case studies, pillar highlights, CTA wording) bu seçime göre adaptif olur.

### Diğer Kararlar

- **i18n:** Path-based (`/tr/*`, `/en/*`), launch-day'de ikisi de hazır
- **Vaka çalışması filtreleme:** Sektör değil, problem-tipi bazlı (verim kaybı, maliyet optimizasyonu, pazara açılma, dijital dönüşüm, müşteri edinimi)
- **Ana CTA:** "Uzmanımızla 1 saatlik görüşme yap"
- **Üçlü funnel:** Düşük taahhüt (interaktif teşhis/araçlar) → Orta taahhüt (saatlik görüşme) → Yüksek taahhüt (brief ve proje)

---

## 6. Explicitly Out of Scope — Kararlı Kısıtlamalar

Aşağıdaki kalemler projenin kapsamı dışındadır. Gelecekte tekrar gündeme gelirse, ADR (Architecture Decision Record) ile açıkça yeniden değerlendirilir; ad-hoc eklenmez.

| Kapsam Dışı Kalem | Neden |
|--------------------|-------|
| Mobile native app | Web-only stratejisi, launch ve Faz 2 için geçerli |
| Danışman panelinde fatura / e-fatura / e-arşiv yönetimi | Muhasebe süreçleri INDOLES backoffice'te kalır |
| Açık marketplace / freelance modeli / self-signup consultant | Prestij konumlandırmasıyla çatışır |
| Müşteri portalı (proje takip, doküman paylaşımı, kanban) | Faz 2 kararı |
| Çoklu tenant / white-label | INDOLES tek markalı, tek tenant |
| Gamification, rozet/puanlama sistemleri | B2B prestij konumuyla uyumsuz |
| Auth / user accounts (launch) | Danışan vitrini iç ekip, self-signup yok; ADR-008 |
| Ödeme gateway'i (launch) | Teklifleşme süreci; ADR-009 |
| AI chatbot (launch) | Agent ROI belirsiz; ADR-007 |
| Kalıcı DB (launch) | Mail + GA4 yeterli; ADR-010 |
| İnteraktif teşhis araçları (`/araclar`) | Launch kapsamı dışı; Faz 2 |
| Yazılarda serbest metin arama / ⌘K | Filtre yeterli; ihtiyacı ileride sohbet asistanı karşılayacak (ADR-021) |
| İkinci marka accent rengi (gold dışında) | Tek accent disiplini; ADR-015 — v2 blob paleti de teal+gold'dan türetilir |
| WebGL'siz fallback (v2) | Şu an yok; destek oranı sorun olursa ADR ile değerlendirilir |

---

## 7. Klasör Haritası

```
indoles-web/
├── CLAUDE.md                          # Bu dosya — workspace memory
├── active_context.md                  # Oturumlar arası durum dökümü
├── README.md                          # Proje özeti (public-facing)
├── docs/
│   ├── 01-vision-positioning.md       # Vizyon, persona'lar, ton gerilimi
│   ├── 02-information-architecture.md # Route haritası, navigasyon (v2 ile hizalı)
│   ├── 03-brand-voice-tone.md         # İki alıcı profili için ton rehberi
│   ├── 04-design-system-principles.md # Design System v2 — estetik otorite
│   ├── 05-tech-architecture.md        # Stack detay, akış diyagramları
│   ├── 08-seo-i18n-strategy.md        # hreflang, sitemap, llms.txt
│   ├── 11-funnel-customer-flows.md    # Üçlü taahhüt funnel'ı
│   ├── 12-analytics-measurement.md    # GA4 events, KPI'lar
│   ├── 14-privacy-kvkk.md             # KVKK, veri saklama
│   ├── 06 / 07 / 09-*.md              # ARŞİV — uygulanmadı (ADR-010/007/008)
│   ├── copy/                          # Persona copy taslakları
│   ├── superpowers/                   # Spec ve plan arşivi
│   └── decisions/ADR-001…ADR-022      # Karar kayıtları
├── src/
│   ├── app/(marketing)/[locale]/      # Tüm public sayfalar
│   ├── app/(v2)/[locale]/v2/          # Yeni tasarım yönü — kendi chrome'u (ADR-016)
│   ├── app/api/                       # contact · visitor-profile · health
│   ├── components/analytics/          # track-view (görüntüleme olayı adası)
│   ├── components/marketing/          # Ana site bölümleri + entry-popup + paylaşılanlar
│   │                                  # (v1 chrome — layout/ — ADR-017 sonrası silindi)
│   ├── components/v2/                 # webgl/ · cursor/ · hero/ · sections/
│   ├── lib/v2/                        # anim-config · use-lenis · use-mouse · içerik
│   ├── lib/content/                   # pillars · packages · cases · consultants ·
│   │                                  # method · industries · company · clients · articles
│   ├── lib/design/tokens.ts           # Design token'lar
│   ├── lib/popup/                     # Entry popup domain (persona, problem, cookie)
│   ├── lib/consent/                   # Çerez onayı: bölge · çerez · gtag update · kapı
│   ├── lib/analytics/                 # events (taksonomi) · ga · ga-bootstrap · view-events
│   ├── lib/i18n/                      # next-intl routing + request
│   └── styles/                        # globals.css (@theme + primitives) · sections.css · v2.css
├── messages/{tr,en}.json              # i18n — persona alt ağaçları dahil
├── content/legal/                     # KVKK MDX
├── emails/                            # React Email şablonları
├── public/                            # brand/ · musteri_logolari/
└── .claude/                           # Custom skill ve agent tanımları
```

---

## 8. Design Workflow (Code-Native)
Tüm tasarım kararları repo içinde kodla alınır. Bu "design-as-code" yaklaşımdır (Stripe, Vercel, Linear'ın yolu).

### Authoritative Design Sources

Tasarım kararlarının otorite hiyerarşisi:

| Öncelik | Kaynak | İçerik |
|---------|--------|--------|
| 1 | `docs/04-design-system-principles.md` (v2) | Tasarım felsefesi, tipografi, renk, spacing, elevation, motion. Estetik kararların tek otoritesi. |
| 2 | `src/lib/design/tokens.ts` | Token'ların TypeScript tanımı. |
| 3 | `src/styles/globals.css` (`@theme`) | Token'ların Tailwind v4 karşılığı + primitive'ler (`.eyebrow`, `.btn`, `.ds-container`, `.reveal`, `typography-*`). |
| 4 | `src/styles/sections.css` | Tailwind ile temiz ifade edilemeyen yapılar: liquid-glass nav, sticky yatay track, timeline geometrisi, parallax kapları. |
| 5 | `src/components/marketing/*`, `src/components/layout/*` | Bölüm component'leri. |
| 6 | `docs/04` §12 + `src/lib/v2/anim-config.ts` + `src/styles/v2.css` | v2 motion ve etkileşim katmanı (ADR-016). Tüm süre/easing/threshold `anim-config.ts`'tedir; component'e gömülmez. |

**Değişiklik sırası zorunludur:** docs/04 → tokens.ts → globals.css → component. Ham hex/px/easing component dosyasına yazılmaz.

> **Önkoşul:** `docs/04-design-system-principles.md` ilk kod implementasyonundan önce tamamlanmış olmalıdır. Bu dosya eksikken veya placeholder halindeyken UI implementasyonu başlamaz. Başlarsa, Claude Code önce bu dosyanın yazılması için çalışmayı durdurur.

### UI Implementasyon Kuralları

- Yeni bir sayfa veya component implement edilirken önce `docs/04-design-system-principles.md` referans alınır
- Renk, tipografi, spacing, radius, shadow değerleri **token'lardan okunur**, literal olarak yazılmaz (`text-2xl` OK, `text-[23px]` değil)
- Yeni bir design token gerekirse önce `lib/design/tokens.ts` güncellenir, sonra kullanılır
- Design system'den herhangi bir sapma ADR entry gerektirir (`docs/decisions/ADR-XXX.md`)
- Yeni bir UI pattern (örn. yeni bir card varyantı) `components/ui/` altında **tek kaynak** olarak tanımlanır

### Inspiration vs. Authority

Referans alınabilecek siteler (Stripe, Linear, Vercel, Pentagram, Bureau Oberhaeuser, a16z Future, McKinsey Insights) **ilham kaynağı**dır, authority değil. Bir UI kararı için "Stripe böyle yapıyor" yetmez; karar `docs/04-design-system-principles.md`'ye uygun olmalıdır. Uyumsuzluk varsa ya prensip güncellenir (ADR ile) ya da karar reddedilir.

### Accessibility ve Responsive

- Tüm UI WCAG 2.2 AA uyumlu olmalı (detaylar `docs/04-design-system-principles.md`'de)
- Responsive breakpoint'ler: mobile 375, tablet 768, desktop 1280, wide 1536 (token'larda sabitlenir)
- Keyboard navigation, focus states, ARIA labels her interactive component için zorunlu

---

## 9. Dokümantasyon Rehberi

### Dosya Açıklamaları

| Dosya | Açıklama |
|-------|----------|
| `01-vision-positioning.md` | Şirket vizyonu, iki eksen mesajı, ton gerilimi ve hedef audience persona tanımları |
| `02-information-architecture.md` | Tüm sayfa haritası, URL yapısı, pillar hiyerarşisi ve navigasyon tasarımı |
| `03-brand-voice-tone.md` | Sanayici ve ticaret alıcısı için ayrı ton rehberi, örnek cümle çiftleri, kaçınılacak kelimeler |
| `04-design-system-principles.md` | Editorial-minimalist tasarım dilinin somutlaşması: tipografi, renk, grid, spacing, motion |
| `05-tech-architecture.md` | Stack detayları, servisler arası iletişim, mermaid diyagramları, environment stratejisi |
| `06-data-model.md` | PostgreSQL tablo yapıları (high-level) ve entity-relationship diyagramı |
| `07-ai-agent-spec.md` | AI agent'in amacı, tool tanımları, system prompt taslağı, fallback akışları |
| `08-seo-i18n-strategy.md` | hreflang, canonical, sitemap, llms.txt stratejisi |
| `09-auth-roles-permissions.md` | Clerk rolleri (guest/user/expert/admin) ve permission matrix |
| `11-funnel-customer-flows.md` | Üçlü funnel akışı, AI agent devreye giriş noktaları, brief-rezervasyon-proje akışı |
| `12-analytics-measurement.md` | GA4 event taksonomisi, KPI tanımları, dashboard fikirleri |
| `13-ui-ux-audit.md` | UI/UX denetim bulguları ve aksiyon listesi |
| `14-privacy-kvkk.md` | KVKK uyum, veri saklama, aydınlatma metni kararları |
| `15-content-audit.md` | İçerik envanteri denetimi (yazılar, vakalar, derinlik) |
| `16-service-pages-seo-audit.md` | Hizmet sayfaları SEO & GEO denetim raporu |
| `strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` | Organik büyüme otoritesi: keyword mimarisi, launch-gate, GEO planı, 301 haritası, içerik takvimi (+ Rakip-Analizi-P0-SERP.md, Keyword-Planner CSV'leri) |

### Kurallar

- Her yeni feature veya değişiklikte **ilgili `docs/*.md` dosyası referans alınmalıdır**.
- Bir mimari karar değişirse: (1) ilgili doc dosyası güncellenir, (2) `docs/decisions/ADR-XXX.md` oluşturulur.
- Doc dosyaları code review sırasında kontrol edilir — implementasyon doc ile tutarsızsa, biri güncellenmelidir.

### Doc Güncellenme Tetikleyicileri

| Değişiklik | Güncellenecek Dosya |
|------------|---------------------|
| Yeni bir DB tablosu veya entity | `06-data-model.md` |
| Yeni bir sayfa veya route | `02-information-architecture.md` |
| Yeni bir statik içerik türü (hizmet, paket, case vb.) | `src/lib/content/*.ts` + ilgili `docs/*.md` |
| Yeni bir auth rolü veya permission | `09-auth-roles-permissions.md` |
| Yeni bir AI agent tool'u | `07-ai-agent-spec.md` |
| Tonal veya brand kararı | `03-brand-voice-tone.md` |
| Yeni bir design token veya component pattern | `04-design-system-principles.md` |
| Yeni bir funnel adımı veya conversion point | `11-funnel-customer-flows.md` |
| Yeni bir event veya KPI | `12-analytics-measurement.md` |
| Keyword hedefi, SEO/GEO taktiği, 301 haritası veya içerik takvimi değişikliği | `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (changelog satırıyla) + teknik kural değiştiyse `08-seo-i18n-strategy.md` |
| Yukarıdaki kategorilerin hiçbirine uymayan mimari karar | `docs/decisions/ADR-XXX.md` |

---

## 10. Conventions

### Commit Messages

```
<type>: <kısa açıklama>

[opsiyonel detay paragrafı]

[opsiyonel footer: breaking changes, issue ref]
```

Type'lar: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

### Branch Naming

```
<type>/<kısa-kebab-case-açıklama>
```

Örnekler: `feat/ai-agent-booking`, `fix/clerk-sso-redirect`, `docs/data-model-update`

### PR Açıklama Şablonu

```markdown
## Ne değişti?
<1-3 madde>

## Neden?
<Motivasyon, bağlam>

## İlgili Dokümanlar
<Güncellenen docs/*.md dosyaları veya yeni ADR>

## Test
<Test stratejisi veya kontrol listesi>
```
