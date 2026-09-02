# ADR-031 — Diagnoo: Cloudflare Workflow ve dış API kararı

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-01
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** `docs/superpowers/specs/2026-09-01-diagnoo-design.md` (tasarım onayı Burak, 2026-09-01)
- **İlgili:** ADR-030 (`/araclar` kapsam-dışından çıkışı ve Worker-native GEO motoru) · ADR-024 (Cloudflare Workers deploy) · ADR-028 (Turnstile bayrağı)
- **Etkilenen dosyalar:** `custom-worker.ts`, `wrangler.jsonc`, `src/lib/tools/diagnoo/*`, `migrations/0004_diagnoo.sql`, `README.md`, `.dev.vars.example`

---

## Bağlam

ADR-030, GEO Görünürlük Denetleyicisi'ni kurarken Diagnoo'yu **"Seçenek
B — ertelendi"** saymıştı: Diagnoo'nun kendisi henüz kod değildi (yalnız iki
tasarım/plan dokümanı), var olmayan bir platforma bağımlılık amiral gemisi
aracın teslim tarihini kilitlerdi. O kararın gerekçesi hâlâ geçerli bir
disiplin bıraktı: **ücretsiz plan, sıfır yeni altyapı** (CLAUDE.md §6, ADR-030
Gerekçe §1). ADR-030 ayrıca "taşınabilir sözleşme" ile geri dönüş kapısını
açık bırakmıştı — Diagnoo gerçekten kod olarak kurulursa, bu ADR o kapıyı
kullanan karardır.

`docs/superpowers/specs/2026-09-01-diagnoo-design.md` (Burak onaylı) Diagnoo'yu
artık somut bir teşhis ürünü olarak tanımlıyor: site keşfi + scrape
(Firecrawl), semantik/vizyon/funnel analiz ajanları (Gemini), Core Web Vitals
(PageSpeed Insights), finansal projeksiyon ve yol haritası birleştirme —
altı adımlı, dakikalar süren, çok adımlı bir iş. Bu iş modeli iki şeyi
gerektiriyor: (1) tek bir HTTP isteğinin CPU/süre bütçesini aşan **çok adımlı,
dayanıklı bir çalıştırma modeli**, (2) INDOLES'in daha önce hiç
entegre etmediği **üç dış API** ve dolayısıyla üç yeni sır.

Karar verilmezse: ya Diagnoo'nun altı adımı tek bir route handler'a
sıkıştırılıp Workers'ın istek başına CPU/süre sınırlarında (scrape + üç LLM
çağrısı + PSI + finansal hesap tek istekte) kırılgan bir şekilde çalışır, ya
da ADR-030'un "ikinci platform açma" reddi sessizce ihlal edilip ayrı bir
servis (ör. bir Python worker) kurulur.

## Karar

**Diagnoo mevcut Worker içinde bir Cloudflare Workflow (ücretsiz plan) olarak
koşar; scrape/analiz/rapor adımları arası durum ve retry Workflows'un kendi
motoruna devredilir. Üç yeni dış API'ye (Gemini, Firecrawl, PageSpeed
Insights) bağlanılır, üç yeni sır eklenir. Kalıcılık aynı D1 veritabanında
(`indoles-bookings`, migrasyon 0004) — ayrı bir veritabanı açılmaz.**

- **Workflow, ayrı script değil.** `wrangler.jsonc`'nin `workflows` binding'i
  (`class_name: "DiagnooDiagnosticWorkflow"`) `custom-worker.ts` içindeki bir
  export'u gösteriyor — üç Durable Object sınıfıyla, `scheduled` ile aynı
  dosya, aynı `main`, aynı deploy. ADR-030'un "tek Worker, sıfır yeni
  altyapı" disiplini Workflow için de korunuyor: Workflows Cloudflare'in
  ücretsiz planında (Workers Free) kotalı ama ücretsiz sunuluyor, ikinci bir
  platform veya hesap açmıyor.
- **Adım başına CPU bütçesi korunur.** Her Workflow adımı (`step.do(...)`)
  kendi CPU penceresinde çalışır; adımların kendisi I/O-bound (fetch
  çağrıları — Firecrawl, Gemini, PSI). Görsellerin base64'e çevrilmesi native
  `TextDecoder("latin1")` + `btoa` ile yapılır (`agents/vision.ts`) —
  karakter-döngüsü tabanlı bir kodlama tek adımın ücretsiz plan CPU
  bütçesini (~10 ms) aşardı.
- **Üç yeni sır:** `GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY`
  (ADR-030'daki `TOOL_IP_SALT` ile aynı disiplin: `wrangler secret put`,
  repoya yazılmaz, yerelde `.dev.vars`).
- **D1 aynı veritabanı.** `diagnoo_diagnostics`/`diagnoo_leads` tabloları
  `migrations/0004_diagnoo.sql` ile AYNI `indoles-bookings` D1'ine
  (`BOOKINGS_DB` binding'i) eklenir — ADR-030'un GEO tablolarıyla aynı
  desen, ikinci bir veritabanı/bağlantı açılmaz.

## Reddedilen seçenekler

### A) Ayrı bir Python servisi (veya başka bir platformda ikinci Worker)

Çok adımlı, uzun süren analiz işini ayrı bir backend'e (ör. bir Python
mikroservisi, ayrı bir Cloudflare hesabı/script'i) taşımak, Workers'ın
istek-süre sınırlarını doğrudan aşardı. Reddedildi: bu, **ikinci bir
platform** demek — CLAUDE.md §4/§6 disiplini ve ADR-024'ün "tek Worker"
mimarisiyle doğrudan çelişir, ayrıca deploy/observability/sır yönetimini
ikiye böler (ADR-030'un tam olarak kaçındığı şey).

### B) Cloudflare Workers Paid plana geçmek

Paid plana geçip adımları tek bir uzun-ömürlü istekte (`ctx.waitUntil` veya
daha yüksek CPU/süre limitleriyle) çalıştırmak teknik olarak mümkündü.
Reddedildi: ADR-030 Seçenek C'nin reddettiği gerekçenin aynısı — mevcut
mimari kararı (ADR-024) ücretsiz plan üzerine kurulu; Diagnoo için tek başına
paid plana geçmek hem maliyet hem "launch'ta yeni altyapı yok" disiplinine
aykırı bir genişleme olurdu. Workflows'un kendisi ücretsiz planda zaten
kotalı ama çalışıyor — paid plana ihtiyaç yok.

### C) Regex-only motor (GEO motoruyla aynı desen)

ADR-030'un GEO motoru saf regex/JSON çıkarımıyla çalışıyor, hiçbir LLM
çağrısı yapmıyor. Diagnoo için aynı desen denenebilirdi (semantik tutarlılık,
görsel bilişsel yük gibi kalemleri kural-tabanlı yaklaşıklamak). Reddedildi:
Diagnoo'nun vaat ettiği analiz türü (mesaj tutarlılığı, CTA görünürlüğü,
checkout sürtünmesi) doğası gereği **yargısal** — regex bir sayfanın "mesaj
tutarlılığı" veya "bilişsel yükü"nü ölçemez, bu spec'in temel değer önerisini
boşaltırdı. LLM analizi (Gemini) burada bir "best practice" tercihi değil,
ürünün var olma nedeni.

## Sonuçlar

### Pozitif

- `wrangler.jsonc`'ye eklenen `workflows` binding'i bu depodaki **ilk**
  Workflow kaydı — desen artık var, ileride başka çok-adımlı işler
  (varsa) aynı deseni izleyebilir.
- Dış API maliyeti IP başına 3/gün + global 100/gün sınırıyla
  (`countDiagnosticsSince`, spec §5 rate limit) kontrol altında — Gemini/
  Firecrawl/PSI çağrıları sınırsız büyüyemez.
- `pipeline.ts` `cloudflare:workers`'dan bağımsız (yalnız `custom-worker.ts`
  bu importu taşıyor) — pipeline mantığı tam birim test kapsamında
  (`pipeline.test.ts`), yalnız ince entrypoint testi mümkün olan alanın
  dışında kalıyor (`scheduled` ile aynı desen — bkz. `custom-worker.ts`
  başlık yorumu).
- ADR-030'un "yeniden değerlendirme tetikleyicisi" (Diagnoo gerçekten deploy
  edilirse) bu ADR ile **tüketildi**: Diagnoo artık kod, GEO motorunun
  taşınabilir sözleşmesi ileride bu modüle taşınabilir (ayrı bir karar/görev
  gerektirir, bu ADR o geçişi kendisi yapmıyor).

### Negatif / trade-off

- Üç yeni dış API bağımlılığı (Gemini, Firecrawl, PSI) — üçü de INDOLES'in
  kontrolü dışında, kota/kesinti riski taşıyor. `ScrapeError` (Firecrawl 500
  vb.) pipeline'da **dürüst hata** olarak ele alınıyor: `markFailed(...,
  "scrape_failed")` ve sessiz dönüş — retry anlamsız (site zaten erişilemez
  durumdaysa Workflows'un otomatik retry'ı bütçe israf eder).
- Workflows ücretsiz planda kotalı (adım sayısı, toplam süre); trafik
  büyürse bu kota aşılabilir (aşağıdaki tetikleyicilere bkz.).
- Adım başına ayrı `step.do(...)` sarmalaması, aynı mantığın düz bir
  `async function` olarak çağrılmasından daha fazla dolaylama katıyor —
  kabul edilebilir, çünkü karşılığında adım-bazlı retry/durability
  kazanılıyor.

### Yeniden değerlendirme tetikleyicileri

- Workflows'un ücretsiz plan kotası (adım sayısı/süre) Diagnoo trafiği
  yüzünden gerçekten aşılırsa — paid plan veya adım sayısını azaltma yeniden
  değerlendirilir (Reddedilen B).
- Gemini/Firecrawl/PSI'den biri kalıcı olarak erişilemez/maliyetli hale
  gelirse — alternatif sağlayıcı veya (kısmen) Reddedilen C'nin regex-tabanlı
  yaklaşımı belirli kalemler için yeniden değerlendirilir.
- GEO motorunun taşınabilir sözleşmesi bu modüle taşınırsa (ADR-030'un
  öngördüğü geçiş) — ayrı bir ADR/görev.

## Implementasyon notları

- Pipeline: `src/lib/tools/diagnoo/pipeline.ts` (`runDiagnosticPipeline`,
  `StepRunner`, `PipelineEnv`) — `cloudflare:workers` import ETMEZ, birim
  testli (`__tests__/pipeline.test.ts`).
- Entrypoint: `custom-worker.ts` → `DiagnooDiagnosticWorkflow` (üç DO
  sınıfının yanına eklendi, `scheduled` ile aynı ince-sarmalayıcı deseni).
- Binding: `wrangler.jsonc` → `workflows: [{ name: "diagnoo-diagnostic",
  binding: "DIAGNOO_WORKFLOW", class_name: "DiagnooDiagnosticWorkflow" }]`.
- D1: `migrations/0004_diagnoo.sql` (`diagnoo_diagnostics`, `diagnoo_leads`)
  — `indoles-bookings` veritabanı, `BOOKINGS_DB` binding'i, ayrı DB yok.
- Sırlar: `GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY` — yerelde
  `.dev.vars` (bkz. `.dev.vars.example`), üretimde `wrangler secret put`.

## Referanslar

- `docs/superpowers/specs/2026-09-01-diagnoo-design.md`
- ADR-030 (`/araclar` kapsam-dışından çıkışı ve Worker-native GEO motoru)
- ADR-024 (Cloudflare Workers deploy) · ADR-028 (Turnstile bayrağı)
- `src/lib/tools/diagnoo/pipeline.ts`
- `migrations/0004_diagnoo.sql`
