# Diagnoo — E-Ticaret GAP Analizi Aracı: Tasarım Spec'i

**Tarih:** 2026-09-01 · **Durum:** Onay bekliyor · **Kapsam:** Diagnoo v1 (Faz 0–2)

## 1. Özet ve Amaç

Diagnoo, INDOLES'in ücretsiz lead-gen aracıdır: kurumsal bir e-ticaret ekibi sitesinin
URL'sini girer; araç 7 kritik sayfayı (1 anasayfa, 2 kategori, 3 ürün, 1 checkout) tarar,
semantik + görsel/UX + funnel/hız + finansal projeksiyon analizini çalıştırır ve
"idealden ne kadar uzaksın, bu GAP'i kapatırsan ayda ne kazanırsın" sorusuna
kanıta dayalı, aralıklı (₺X–₺Y) cevap veren danışmanlık sınıfı bir rapor üretir.
Rapor, INDOLES'in CRO / performans pazarlama / e-ticaret hizmetlerine yönlendiren
huninin tepesidir.

Eski Python/FastAPI prototipinin çekirdek dosyaları Drive senkronizasyon arızasında
kaybedildi (58 dosya dataless). Bu spec, ürünü **TypeScript + Cloudflare** stack'inde
sıfırdan, daha yüksek kaliteyle inşa etmeyi tanımlar; kurtarılan Python dosyaları
port/referans kaynağıdır.

## 2. Kilitli Kararlar

| # | Karar | Gerekçe |
|---|-------|---------|
| 1 | İş modeli: ücretsiz lead-gen aracı | Amaç satış fırsatı; araç kendisi ürün değil |
| 2 | Hedef kitle: kurumsal/büyük e-ticaret ekipleri | Derin, veri-ağırlıklı, metodolojisi şeffaf rapor dili |
| 3 | Strateji: Kademeli Derinlik | Ücretsiz Health Snapshot → lead formu → tam rapor |
| 4 | Lead: D1 + satış ekibine e-posta bildirimi | Mevcut altyapı; CRM push Faz 3 |
| 5 | Gerçek metrik girişi: Faz 1 manuel form; GA4 OAuth Faz 3 | Düşük sürtünme, düşük efor |
| 6 | Konum: `indoles.com.tr/araclar/diagnoo` | Domain otoritesi mirası, iç link gücü |
| 7 | GA4: mevcut property, Diagnoo'ya özel event seti | Birleşik huni görünümü |
| 8 | Frontend: indoles-web içinde yeni route | i18n/GA4/JSON-LD/design-system mirası |
| 9 | Backend: TypeScript + Cloudflare Workers/Workflows | "Cloudflare ücretsiz" tercihi; Python çekirdeği zaten kayıp; D1 native, tek deploy zinciri |

## 3. Ürün Akışı (Kademeli Derinlik Hunisi)

```
URL girişi (kayıt yok, Turnstile korumalı)
  → Pipeline (Cloudflare Workflow): scrape → semantic → vision → funnel → financial → report
  → İlerleme D1'e yazılır; frontend 2 sn'de bir poll eder (status stepper)
  → HEALTH SNAPSHOT (ücretsiz, anında):
      · Genel Sağlık Skoru (0–100, gauge)
      · Benchmark rozeti ("hız skorunuz sektör medyanının gerisinde" vb.)
      · En kritik 3 GAP — başlık + tek cümle etki; ₺ rakamları kilitli/bulanık
      · Kaba fırsat ARALIĞI (nokta tahmin asla)
      · CTA: "Tam GAP Analizi Raporunu Gör"
  → UNLOCK FORMU: iş e-postası* + şirket adı* + ad-soyad
      + opsiyonel gerçek metrikler: aylık trafik, AOV, dönüşüm oranı
  → Lead D1'e yazılır + satış ekibine e-posta bildirimi
  → Gerçek metrik girildiyse finansal motor saklanan agent çıktılarıyla YENİDEN hesaplar
    (workflow tekrar koşmaz; motor saf fonksiyondur)
  → TAM RAPOR açılır; diagnostic_id ile kalıcı link (noindex)
```

Gating **frontend görüntü seviyesindedir**: pipeline her şeyi üretir, tam rapor bölümleri
form gönderilene kadar kilitli gösterilir. Backend ikiye bölünmez.

## 4. Finansal Model v2 (Güvenilirlik Yükseltmesi)

Eski model: tek nokta tahmin + kaynağı belirsiz sabitler (`0.20`). Yeni model:

- **Aralık üçlüsü:** `lost_revenue_speed`, `ad_waste`, `total_recoverable_revenue`
  → `{ low, expected, high }`. Aralık genişliği veri kalitesine bağlı:
  tüm girdiler tahminiyken ±%35, tümü gerçekken ±%12 (girdi başına ağırlıklı karışım).
- **Girdi kaynağı rozeti:** `input_sources: Record<InputKey, "measured" | "estimated">`
  (`monthly_traffic`, `aov`, `conversion_rate`, `monthly_ad_spend`). Raporda her rakamın
  yanında rozet gösterilir.
- **Metodoloji şeffaflığı:** her formül sabiti adlandırılır, halka açık bir araştırmaya
  dayandırılır ve `methodology: MethodologyNote[]` (`{ constant, value, source, note }`)
  olarak raporla döner. Raporda katlanır "Metodoloji" bölümü. Sabit değerleri ve kaynak
  atıfları implementasyon sırasında güncel araştırmadan doğrulanarak yazılır
  (ör. sayfa hızı ↔ dönüşüm ilişkisi üzerine Google/Deloitte yayınları).
- **Formüller (v1'den taşınır, aralıklı hale gelir):**
  - A (hız kaynaklı kayıp): `traffic × AOV × CR × speed_loss_per_sec × delay_sec`
  - B (mesaj uyumsuzluğu israfı): `ad_spend × (1 − semantic_similarity) × waste_factor`
  - `speed_loss_per_sec` ve `waste_factor` metodoloji sabitleridir.
- Motor **saf TS fonksiyonudur** (`computeFinancialProjection(inputs) → projection`):
  hem Workflow adımında hem unlock-recompute'ta aynı fonksiyon kullanılır; birim testi kolaydır.

## 5. Benchmark Katmanı (Kanıt Derinliği)

- `benchmarks.ts`: canlı rakip scraping YOK. Halka açık CRO araştırmalarından
  (Baymard Institute, Google Core Web Vitals eşikleri, sektör raporları) derlenen,
  **versiyonlu statik persentil seti** (kaynak + tarih alanlarıyla).
- Her metrik üç değerle sunulur: **Siz — Sektör medyanı — En iyi %10.**
- Meta reklam bazlı rakip analizi ayrı "Stratejik Konumlandırma" bölümüdür;
  finansal itici güç olarak kullanılmaz.

## 6. Tam Rapor Anlatısı (Danışmanlık Sınıfı)

1. **Yönetici Özeti** — tek paragraf + toplam fırsat aralığı + genel skor + veri kalitesi durumu
2. **Skor Karnesi** — 4 boyut (Semantik / UX / Hız-Funnel / Ölçüm-Tracking), benchmark'a karşı
3. **Kritik GAP kartları** — öncelik sıralı: bulgu + kanıt (ekran görüntüsü kesiti,
   `data_reference` veri noktası) + aylık etki aralığı + efor + kategori
4. **Finansal Projeksiyon Detayı** — girdi tablosu (kaynak rozetli) + formüller + metodoloji dipnotları
5. **Rekabet / Mesaj Analizi** — Meta reklam karşılaştırması, konumlandırma önerileri
6. **Yol Haritası** — etki/efor matrisi + kategori filtreli tablo (roadmap şeması v1'den korunur)
7. **Sonraki Adım** — INDOLES CTA ("Bu GAP'leri 90 günde kapatalım") → iletişim/rezervasyon
   + ilgili hizmet sayfaları

Rapor dili kullanıcının locale'ini izler (agent prompt'ları locale parametresi alır).
Statik landing için TR/EN parite zorunludur; dinamik rapor sayfası locale'e göre üretilir.

## 7. SEO / GEO Mekaniği

Mevcut indoles-web altyapısına bağlanır (`docs/08`, `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` authoritative; implementasyonda `indoles-i18n-seo` skill'i zorunlu).

- **Route:** `(marketing)/[locale]/araclar/diagnoo` — TR `/araclar/diagnoo`,
  EN `/tools/diagnoo` (segment çevirisi). Hreflang triplet, self-canonical,
  per-locale sitemap kaydı. Yeni `araclar` segmenti IA dokümanına işlenir.
- **Landing statik ve zengin:** aracın ne yaptığı, örnek rapor kesitleri, metodoloji özeti,
  soru-H2'li citation-friendly bölümler, SSS → `faqLd`. Kopya `indoles-brand-voice`
  kurallarına tabidir.
- **JSON-LD:** `json-ld.ts`'e `webApplicationLd` eklenir
  (`SoftwareApplication`/`WebApplication`, `applicationCategory: BusinessApplication`,
  `offers.price: 0`) + `breadcrumbLd` + `faqLd`.
- **Kullanıcıya özel rapor URL'leri `noindex`** (kişisel/dinamik veri); yalnızca landing indekslenir.
- **Üç yönlü iç link ağı:**
  - Hizmet → Araç: `cro`, `performans-pazarlama`, `e-ticaret` hizmet sayfalarına
    "Ücretsiz GAP analizinizi alın" CTA bloğu
  - Makale → Araç: bu üç topic'teki mevcut 7 makaleye bağlamsal inline link;
    `resolveInlineHref`'e `/araclar/` yol tipi eklenir
  - Araç → İçerik: rapor kategorilerinden ilgili makale/vaka/hizmete bağlantı
- **llms.txt / llms-full.txt:** üretime "Araçlar" bölümü eklenir (TR+EN).
- **GEO ölçümü:** `GEO-Olcum-Rutini.md`'ye Diagnoo prompt seti eklenir
  (ör. "e-ticaret sitem için ücretsiz CRO analiz aracı", "dönüşüm oranı denetimi nasıl yapılır");
  3 motorda (ChatGPT, Gemini, Perplexity) takip.
- **Destek içeriği:** topic `cro` altında aracı merkeze alan 1 yeni kanonik makale
  ("E-ticaret sitesinde GAP analizi: adım adım CRO denetimi" çerçevesinde) +
  strateji dokümanına changelog satırı.

## 8. GA4 Ölçüm Planı

Mevcut `track()` wrapper + Consent Mode v2 otomatik miras (aynı Next.js uygulaması).
`src/lib/analytics/events.ts`'e tipli eventler:

| Event | Parametre | Not |
|-------|-----------|-----|
| `diagnostic_started` | — | URL gönderildiğinde |
| `diagnostic_snapshot_viewed` | `health_score_bucket` | 0–25/26–50/51–75/76–100 |
| `diagnostic_unlock_opened` | — | Form açıldığında |
| `diagnostic_unlock_submitted` | `has_real_metrics: boolean` | **Key event (conversion).** PII asla gönderilmez |
| `diagnostic_report_viewed` | — | Tam rapor render |
| `diagnostic_roadmap_item_expanded` | `category` | speed/semantic/ux/tracking/funnel/creative |
| `diagnostic_service_cta_clicked` | `target_service` | Atıf için kritik |

GA4 arayüz kurulumu (key event işareti + funnel exploration:
started → snapshot → unlock → report → service_cta) spec ekinde runbook olarak uygulanır.
GA4 `client_id` ↔ D1 lead eşlemesi Faz 3.

## 9. Teknik Mimari

### 9.1 Yerleşim

```
indoles-web/                          (mevcut repo, git burada)
├── src/app/(marketing)/[locale]/araclar/diagnoo  → landing + araç UI + rapor
├── src/app/api/diagnoo/              → route handler'lar (start, status, unlock)
├── src/components/diagnoo/           → taşınan+yenilenen UI bileşenleri
├── src/lib/diagnoo/                  → Zod şema, finansal motor, benchmark seti
└── workers/diagnoo-pipeline/         → ayrı Worker + Workflow (kendi wrangler.toml'u)
    └── src/{agents,services}/        → Gemini, Firecrawl, GSC, Meta Ads istemcileri
```

Şema ve finansal motor `src/lib/diagnoo/`'da yaşar; pipeline worker'ı aynı repodan
import eder (tek doğruluk kaynağı).

### 9.2 Pipeline: Cloudflare Workflow

- `DiagnooDiagnosticWorkflow` adımları: `scrape(7 sayfa)` → `semantic` → `vision` →
  `funnel` → `financial` → `report`. Her adım sonucu ve ilerleme yüzdesi D1'e yazılır;
  Workflows'un adım bazlı retry/dayanıklılık özelliği kullanılır.
- Frontend SSE yerine **2 sn aralıklı polling** yapar (`/api/diagnoo/[id]/status`).
  Basitlik ve Workers uyumu; eski `useSSE` hook'u zaten kayıp.
- CWV metrikleri **PageSpeed Insights API**'den (Workers'ta yerel tarayıcı yok);
  ekran görüntüleri Firecrawl'un screenshot çıktısından.

### 9.3 API Yüzeyi (Next.js route handler'ları)

| Endpoint | Görev |
|----------|-------|
| `POST /api/diagnoo/start` | Turnstile doğrula → rate-limit kontrol → D1 kaydı + Workflow instance başlat → `diagnostic_id` döndür |
| `GET /api/diagnoo/[id]/status` | D1'den adım/ilerleme + hazır bölümler |
| `POST /api/diagnoo/[id]/unlock` | Lead'i D1'e yaz + e-posta bildirimi (mevcut SMTP) + `known_metrics` varsa finansal recompute → tam rapor payload |

### 9.4 D1 Şeması

```sql
CREATE TABLE diagnoo_diagnostics (
  id TEXT PRIMARY KEY, url TEXT NOT NULL, locale TEXT NOT NULL,
  status TEXT NOT NULL,            -- queued|running|completed|failed
  current_step TEXT, progress_pct INTEGER DEFAULT 0,
  report_json TEXT,                -- agent çıktıları + rapor (tek JSON)
  demo_mode INTEGER DEFAULT 0,
  created_at TEXT, updated_at TEXT
);
CREATE TABLE diagnoo_leads (
  id TEXT PRIMARY KEY, diagnostic_id TEXT NOT NULL REFERENCES diagnoo_diagnostics(id),
  email TEXT NOT NULL, company TEXT NOT NULL, full_name TEXT,
  known_metrics_json TEXT, created_at TEXT
);
CREATE TABLE diagnoo_rate_limits (
  ip_hash TEXT PRIMARY KEY, day TEXT NOT NULL, count INTEGER DEFAULT 0
);
```

### 9.5 Python → TS Port Haritası

| Kurtarılan Python | TS hedefi | Not |
|---|---|---|
| `diagnostic_schema.py` | `src/lib/diagnoo/schema.ts` (Zod) | + finansal v2 alanları |
| `base_agent.py` | `workers/.../agents/base.ts` | Gemini REST; `gemini-3.5-flash`, fallback `gemini-3.1-flash-lite` |
| `scraper_service.py` | `services/scraper.ts` | Firecrawl REST; placeholder fallback KALDIRILIR |
| `gsc_service.py` | `services/gsc.ts` | JWT imzalama WebCrypto ile; YENİ service-account key (eskisi kayıp — GCP'de eski key iptal + yeni üretim) |
| `meta_ads_service.py` | `services/meta-ads.ts` | Graph API REST |
| `funnel_telemetry.py` | `agents/funnel-telemetry.ts` | + PageSpeed Insights API |
| Frontend 5 bileşen + `api.ts` | `src/components/diagnoo/` | Design token + marka sesi geçişi |
| KAYIP: financial_engine/orchestrator, semantic/vision analyst, main/config/diagnostic.py, page/layout/useSSE/types | — | Bu spec'e göre sıfırdan |

### 9.6 Sırlar ve Konfigürasyon

- Wrangler secrets: `GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `GSC_SERVICE_ACCOUNT_JSON`,
  `META_ACCESS_TOKEN`. Kod deposunda hiçbir anahtar dosyası tutulmaz.
- odorgo'ya özel sabit kodlu simülasyonlar **`demo_mode` bayrağı** arkasına alınır
  (satış demosu için korunur, gerçek akışta asla devreye girmez).
- Ücretsiz katman notu: Workers/Workflows/D1 ücretsiz kotaları MVP için yeterlidir;
  Gemini + Firecrawl + PageSpeed API maliyetleri Cloudflare'den bağımsızdır ve
  rate-limit ile sınırlanır.

### 9.7 Kötüye Kullanım Koruması

- URL girişinde **Turnstile** (sitede zaten kurulu).
- IP başına günlük analiz limiti (D1 sayaç; öneri: 3/gün) — her çalıştırmanın
  gerçek API maliyeti var.
- Aynı URL için tamamlanmış tazeliği ≤24 saat olan rapor varsa yeniden koşturmak yerine
  mevcut rapor sunulur.

## 10. Hata Yönetimi

- **Scrape başarısız:** dürüst hata ("siteye erişilemedi, robots/erişim engeli olabilir");
  placeholder sayfa üretimi yok.
- **Tek agent düşerse:** rapor o bölümü "veri yetersiz" rozetiyle üretir; finansal motor
  eksik girdiyle aralığı genişletir; Workflow adım retry'ları tükenirse bölüm atlanır.
- **Lead yazımı/e-posta hatası:** rapor yine gösterilir; hata loglanır
  (lead kaybı kullanıcı deneyimini rehin almaz).
- **LLM çıktı doğrulama:** her agent çıktısı Zod'dan geçer; geçmezse tek onarım denemesi,
  sonra "veri yetersiz".

## 11. Test Stratejisi

- Finansal motor birim testleri: formüller, aralık genişliği ↔ veri kalitesi ilişkisi,
  `input_sources` rozetleri, recompute determinizmi.
- Benchmark seti şema/versiyon testleri.
- Route handler testleri: start (Turnstile+rate-limit), status, unlock (lead + recompute).
- Zod şema round-trip testleri (agent çıktısı doğrulama).
- SEO: yeni URL'ler mevcut `seo:audit` setine eklenir (hreflang/canonical/sitemap/noindex).
- `events.ts` tip testleri (mevcut kalıba uygun).
- Mevcut 691+ test yeşil kalır.

## 12. Fazlama

- **Faz 0 — Hijyen:** Diagnoo klasöründe git init + kurtarılan dosyaların arşiv commit'i
  (referans olarak) · dataless dosyaların listesi kayda geçer · GCP'de eski service-account
  key iptali + yenisi · Firecrawl/Gemini anahtar envanteri.
- **Faz 1 — Çekirdek ürün:** Zod şema + finansal motor v2 + benchmark seti →
  pipeline worker (Workflow + agent'lar + servisler) → D1 tabloları →
  route handler'lar → UI (landing hariç: araç akışı, snapshot, unlock, tam rapor;
  bileşen taşıma + design token geçişi) → GA4 eventleri → testler.
- **Faz 2 — SEO/GEO katmanı:** landing içeriği (brand-voice) + `webApplicationLd` +
  hreflang/sitemap/llms.txt + üç yönlü iç link ağı + GEO ölçüm rutini güncellemesi +
  destek makalesi + strateji changelog.
- **Faz 3 — Kapsam dışı (gelecek):** GA4 OAuth ile gerçek veri çekimi · CRM push ·
  PDF export · GA4 client_id ↔ lead eşlemesi · rakip canlı taraması.

## 13. Açık Olmayan Noktalar

Tüm ana kararlar kilitlidir (§2). Implementasyon sırasında netleşecek taktik detaylar:
metodoloji sabitlerinin güncel kaynak değerleri (implementasyonda araştırılıp
dipnotlanır) ve benchmark setinin ilk sürüm içeriği.
