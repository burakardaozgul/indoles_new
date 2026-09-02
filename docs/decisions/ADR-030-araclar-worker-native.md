# ADR-030 — `/araclar` kapsam-dışından çıkışı ve Worker-native GEO motoru

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-01
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** `docs/superpowers/specs/2026-09-01-geo-gorunurluk-denetleyicisi-design.md` (tasarım onayı 2026-09-01) · `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md` §2 araç portföyü, sıra ④
- **İlgili:** ADR-021 (PostHog kaldırıldı, GA4 tek sağlayıcı) · ADR-025 (Cal.com kaldırıldı, kendi rezervasyon sistemi) · ADR-026 (Veridyen SMTP) · ADR-028 (Turnstile bayrağı) · CLAUDE.md §6 kapsam-dışı tablosu
- **Etkilenen dosyalar:** `CLAUDE.md` §6, `docs/02-information-architecture.md`, `docs/12-analytics-measurement.md`, `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md`, `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md`, `README.md`, `docs/runbooks/cutover-www-indoles.md`, `src/lib/tools/geo/*`, `src/app/api/tools/*`, `src/app/(marketing)/[locale]/araclar/*`, `migrations/0003_tool_scans.sql`

---

## Bağlam

CLAUDE.md §6 "İnteraktif teşhis araçları (`/araclar`)" satırını **Faz 2, launch
kapsamı dışı** ilan ediyordu. Bu karar, o zaman elde bir teşhis-araç ürün
yönü yokken alınmış genel bir disiplindi (agent, DB, auth gibi diğer
kapsam-dışı kalemlerle aynı sırada).

Off-Site Otorite ve Araç Planı (§2, sıra ④) durumu değiştirdi: **GEO
Görünürlük Denetleyicisi** portföyün amiral gemisi ilan edildi — "Türkiye'nin
ilk GEO denetim aracı" PR hikâyesi + GEO danışmanlığının canlı kanıtı + kendi
kelime kümesini (`GEO denetimi`, `AI görünürlük testi`, `llms.txt kontrolü`)
hedefleyen indexlenebilir bir sayfa. Aracın kendisi hem SEO/GEO otoritesi
üretiyor hem MOFU lead yakalıyor (detaylı rapor e-posta karşılığı) — plandaki
"development gücü → SEO/GEO varlığı" tezinin doğrudan uygulaması.

Planın orijinal taslağı (§2.1, v1.1) bu aracı ayrı bir "Diagnoo" modülü
(çok-modüllü site denetim sistemi: teknik SEO + CWV + UX + skorlama)
üzerinden kurmayı öngörüyordu. **Diagnoo hiç deploy edilmedi** — açık kaynak
çekirdeği, hosted sürümü, GitHub org'u yok; yalnızca iki tasarım/plan
dokümanı var (`docs: Diagnoo GAP analizi aracı tasarım spec'i`, `docs: Diagnoo
Faz 0+1 implementasyon planı`, main dalında). Var olmayan bir platforma
entegrasyon üzerinden amiral gemisi aracı kurmak, launch'ı belirsiz bir
bağımlılığa kilitlerdi.

Karar verilmezse: ya araç hiç yapılmaz (plan §2'nin "development gücü"
tezi boşta kalır, 0/30 GEO atıf baz çizgisi kapanmaz) ya da CLAUDE.md §6 ile
çelişen bir "gölge" implementasyon sessizce ilerler (dokümantasyon
disiplini ihlali — CLAUDE.md md kuralı: kapsam-dışı bir kalem yalnız ADR ile
yeniden açılır).

## Değerlendirilen seçenekler

### A) Worker-native motor — saf kural fonksiyonları (seçildi)

- Tarama, mevcut Worker'da bir API route (`/api/tools/geo-scan`,
  `/api/tools/geo-report`) olarak çalışır; yeni altyapı ve ek maliyet sıfır.
- Motor (`src/lib/tools/geo/`) fetch katmanından ayrık saf fonksiyonlar: tam
  DOM parse yok, hedefli regex/JSON çıkarımı (`ld+json` blokları, `link
  rel`/`canonical`/`html lang`, H2 metinleri). Ücretsiz Workers planının CPU
  bütçesine sığar.
- Kalıcılık D1'de (`indoles-bookings` veritabanındaki yeni tablolar — ayrı DB
  açılmaz), e-posta mevcut `worker-mailer` + React Email şablonuyla.
- Trade-off: Diagnoo'nun vaat ettiği çok-modüllü denetim (CWV, UX skoru)
  şimdilik yok — yalnız GEO/AI-görünürlük kalemleri.

### B) Diagnoo modülü olarak kurmak — ertelendi

- Planın orijinal (v1.1) tercihiydi: GEO modülü Diagnoo'nun hosted
  sürümüne eklenecekti, `/araclar` ailesi Diagnoo'nun ön yüzü olacaktı.
- Diagnoo'nun kendisi henüz kod değil — yalnız iki tasarım dokümanı var,
  hiçbir satır implementasyon veya deploy yok.
- Reddedildi: var olmayan bir platforma bağımlılık, amiral gemisi aracın
  teslim tarihini Diagnoo'nun kendi teslim tarihine (belirsiz) kilitlerdi.
  Diagnoo canlıya çıktığında GEO motoru **taşınabilir sözleşme** sayesinde
  (aşağıda) oraya modül olarak taşınabilir; bu ADR o kapıyı kapatmıyor,
  yalnız launch'ı ona bağlamıyor.

### C) Workers Paid plana geçip cheerio ile tam DOM parse — reddedildi

- Cheerio + tam DOM parse, regex tabanlı hedefli çıkarımdan daha sağlam
  olurdu (edge case'lere karşı).
- Reddedildi: mevcut mimari kararı (`docs/05-tech-architecture.md`, ADR-024)
  Cloudflare Workers **ücretsiz plan** üzerine kurulu; bu araç için tek
  başına paid plana geçmek hem maliyet hem de "launch'ta DB/agent/payment
  yok" disiplinine (CLAUDE.md §6) aykırı bir altyapı genişlemesi olurdu.
  Cheerio zaten build-time `seo:audit`'te kullanılıyor (Node ortamı,
  Workers runtime'ı değil) — bu, runtime'a taşınmadan aynı aracın kalması
  gerektiğinin kanıtı. Hedefli regex çıkarımı, motorun beş kalemi (ai-access,
  llms-txt, json-ld, lang-signals, question-h2) için yeterli hassasiyeti
  veriyor; birim testleri bu yeterliliği fixture'larla doğruluyor.

## Karar

**Seçenek A seçildi: `/araclar` CLAUDE.md §6'nın kapsam-dışı tablosundan
çıkar, motor Worker-native kurulur.** GEO Görünürlük Denetleyicisi launch
sonrası ilk büyük özellik olarak canlıya alınır; Diagnoo'ya bağımlı değildir.

## Gerekçe

1. **Sıfır yeni altyapı.** Mevcut Worker, mevcut D1 (`indoles-bookings`),
   mevcut SMTP istemcisi — CLAUDE.md §4'ün "DB yok / auth yok / payment yok"
   disiplinini bozmadan yeni bir ürün yüzeyi eklendi. Tek yeni şey iki D1
   tablosu (`tool_scans`, `tool_leads`, `migrations/0003_tool_scans.sql`) ve
   bir sır (`TOOL_IP_SALT`).
2. **Diagnoo'ya bağımlılık launch'ı belirsiz bir tarihe kilitlerdi.** Var
   olmayan bir platformun üstüne amiral gemisi aracı kurmak, planın kendi
   "hızlı canlıya çıkma" öncelik sırasını (Off-Site plan §2 Dalga A/A-B)
   ihlal ederdi.
3. **Taşınabilirlik sözleşmesi geri dönüşü açık bırakıyor** (aşağıdaki
   Sonuçlar bölümü) — Diagnoo ileride canlıya çıkarsa motor bu sözleşmeyle
   oraya taşınır, sayfa/API sözleşmesi değişmez. Seçenek B'yi reddetmek,
   Diagnoo'yu sonsuza kadar reddetmek değildir.
4. **Reddedilen C**: paid plan geçişi, launch mimarisinin ("ücretsiz plan
   disiplini") kendisiyle çelişirdi; regex tabanlı hedefli çıkarım test
   edilebilir ve yeterli hassasiyette.

## Sonuçlar

### Pozitif

- **Taşınabilir `GeoScanInput`/`GeoScanResult` sözleşmesi**
  (`src/lib/tools/geo/types.ts`): motorun girdisi ham metinler (`pageHtml`,
  `robotsTxt`, `llmsTxt`), çıktısı tipli `GeoScanResult` JSON'u. Motor
  fetch katmanından (`safe-fetch.ts`) ayrık saf fonksiyonlar — Diagnoo ileride
  canlıya çıkarsa modül bu sözleşmeyle taşınır, sayfa/API değişmez.
- **D1 ortak veritabanı.** `tool_scans`/`tool_leads` rezervasyonun kurduğu
  AYNI D1'de (`BOOKINGS_DB` binding'i) yaşıyor — ayrı bir veritabanı açılıp
  ikinci bir bağlantı/migration zinciri kurulmadı.
- **Ücretsiz plan CPU disiplini korundu.** Tam DOM parse yerine hedefli
  regex/JSON çıkarımı; motor birim testinde (`tests/unit/tools-geo/
  engine.test.ts`) 500 KB'lık bir fixture ile çalışma süresi 50 ms altında
  kalacak şekilde asserte edilir (Workers ücretsiz planın ~10 ms CPU
  bütçesine karşı güvenlik payı bırakan bir Vitest-ortamı üst sınırı; gerçek
  Workers CPU-ms'i production'da izlenmeli, test bunun bir vekili).
- Araç ana alanda (`indoles.com.tr`) yaşıyor — kazanılan otorite ayrı bir
  domain'e değil ana varlığa akıyor (Off-Site plan §2 gerekçesi).

### Negatif / trade-off

- Diagnoo'nun vaat ettiği çok-modüllü denetim (CWV, UX skoru, genel SEO
  sağlığı) bu ADR'nin kapsamında **yok** — yalnız GEO/AI-görünürlük beş
  kalemi (§3, tasarım spec'i). Off-Site planı §2'deki diğer Dalga A araçları
  (A/B testi hesaplayıcısı, ROAS/CAC-LTV hesaplayıcısı) bu ADR'nin kapsamı
  dışında, ayrı kararlar gerektirir.
- Regex tabanlı çıkarım, cheerio'nun tam DOM parse'ına göre daha kırılgan
  edge case'lere sahip olabilir (ör. çok tuhaf iç içe `<script>` yapıları);
  motor birim testleri bilinen edge case'leri (bozuk JSON-LD, eksik
  `html lang`) kapsıyor ama evrensel bir DOM parser garantisi vermiyor.
- 5. hata kodu, 3 güvenlik/gizlilik carry-note'u ve KVKK fail-closed davranışı
  brief'in orijinal dört-kod sözleşmesini genişletiyor — bkz. aşağıdaki
  "Denetleyici carry-note'ları" bölümü.

### Yeniden değerlendirme tetikleyicileri

- Diagnoo gerçekten deploy edilir ve hosted sürüm canlıya çıkarsa —
  taşınabilir sözleşme kullanılarak motorun Diagnoo'ya taşınması ayrı bir
  ADR/görev gerektirir (bu ADR o geçişi öngörür ama kendisi gerçekleştirmez).
- Workers ücretsiz plan CPU/istek kotası araç trafiği yüzünden gerçekten
  aşılırsa (hız sınırı D1 sayacı bunu önlemeyi hedefliyor — spec §5).
- `/araclar` ailesine yeni bir araç eklenip mevcut regex tabanlı motor
  yetersiz kalırsa (cheerio/Workers Paid yeniden değerlendirilir — Seçenek C).

## Denetleyici carry-note'ları (implementasyon denetiminden, 2026-09-01)

Görev 9-13 implementasyonu sırasında iki bağımsız güvenlik incelemesi ve bir
ürün-mekanizması notu, tasarım spec'inin orijinal metnini üç noktada
genişletti. Karar buradaki gibi kayda geçer çünkü spec'in kendisi
güncellenmedi — implementasyon spec'ten sapmadı, spec'in eksik bıraktığı
kısımları somutlaştırdı.

### 1. Beşinci hata kodu: `misconfigured` (fail-closed, KVKK)

Spec §5 ham IP'nin hiçbir yerde saklanmadığını, yalnız `SHA-256(ip + gizli
tuz)` hash'inin tutulduğunu söylüyordu ama tuzun **eksik olma** senaryosunu
tarif etmiyordu. Gerçek: `TOOL_IP_SALT` sırrı yoksa veya boşsa, tuzsuz
`SHA-256(IP)` 32-bit IPv4 adres uzayında rainbow-table ile **anında** geri
çevrilir — bu, ham IP saklamakla fiilen eşdeğerdir ve "ham IP hiç
saklanmaz" gereksinimini sessizce sıfırlar.

Karar: hem `POST /api/tools/geo-scan` hem `POST /api/tools/geo-report`,
`TOOL_IP_SALT` yoksa **fail-closed** olur — `500 {error:"misconfigured"}` +
`reportError` (kod tabanı emsali: `src/app/api/cron/route.ts`, `CRON_SECRET`
yoksa tüm istekler reddedilir — aynı duruş burada da izlendi). Brief'in
kapalı dört-kod sözleşmesi (`invalid-url` | `rate-limited` |
`target-unreachable` | `turnstile-failed`) bu yüzden **beşinci** bir koda
genişledi: `misconfigured`. Kod, D1 yazma hatalarını da aynı opak koda
toplar — istemciye sunucu-içi hata detayı sızdırılmaz.

**Üretim adımı:** sır `wrangler secret put TOOL_IP_SALT` ile girilir (bkz.
`README.md` ve `docs/runbooks/cutover-www-indoles.md`).

### 2. Per-hop redirect doğrulama (G7 güvenlik yükseltmesi)

Spec §5 SSRF savunmasını "redirect ≤3" olarak tarif ediyordu — örtük olarak
`fetch`'in kendi `redirect: "follow"` modunu ima ediyordu. İki bağımsız
güvenlik incelemesi (Görev 7 implementasyonu sırasında) bunun bir SSRF
bypass'ı bıraktığını yakaladı: **trailing-dot** host'lar (`evil.com.`)
`follow` modunda ara yönlendirme adımlarını doğrulamadan private/localhost
hedeflere sızabiliyordu.

Karar: `fetchScanTargets` (`src/lib/tools/geo/safe-fetch.ts`) `redirect:
"manual"` kullanır ve **her** yönlendirme hop'unu elle takip ederken taze bir
`validateTargetUrl` doğrulaması uygular — zincirin HİÇBİR adımı
doğrulanmadan geçmez. SSRF savunması artık per-hop'tur, yalnız ilk ve son
hedefte değil.

### 3. Findings sunucu-tarafı kapılama (G12b ürün mekanizması)

Spec §3 "basit sonuç" (herkese açık) ve "detaylı rapor" (e-posta karşılığı,
`findings` listesi dahil) ayrımını tanımlıyordu ama bu ayrımın **nerede**
uygulandığını belirtmiyordu. Karar: kapılama **sunucu tarafında**, yanıt
gövdesi seviyesinde uygulanır — `findings` hiçbir zaman istemciye
`insertLead`/KVKK rızası olmadan gönderilmez.

- `POST /api/tools/geo-scan` (public tarama) `stripFindings` ile boşaltılmış
  `checks` döner; D1'e yazılan TAM kayıt etkilenmez.
- Paylaşım sonuç sayfası (`/araclar/.../sonuc/[id]`, `noindex, follow`)
  D1'den okurken de findings'siz görünüm render eder — herkese açık bir
  URL, KVKK rızası vermemiş üçüncü bir ziyaretçiye asla detaylı bulgu
  sızdırmaz.
- `POST /api/tools/geo-report` (KVKK rızalı — `insertLead` başarılı olduktan
  SONRA) yanıt gövdesinde TAM `checks`i (findings dahil) taşır;
  `GeoReportForm` kilidi bu gövdeden açar, başlangıç prop'undan değil.

Bu, "findings yalnız rapor talebiyle açılır" vaadinin bir UI kuralı değil,
bir **sunucu sözleşmesi** olduğu anlamına gelir — istemci tarafı kod
atlanabilir olsaydı vaat bozulurdu.

## Implementasyon notları

- Motor: `src/lib/tools/geo/{types,engine,ai-access,llms-txt,json-ld,
  lang-signals,question-h2,safe-fetch,repository,findings}.ts`
- API: `src/app/api/tools/{geo-scan,geo-report}/route.ts`
- Sayfalar: `src/app/(marketing)/[locale]/araclar/{page.tsx,
  geo-gorunurluk-denetleyicisi/{page.tsx,sonuc/[id]/page.tsx}}`
- İçerik: `src/lib/content/tools.ts`
- D1: `migrations/0003_tool_scans.sql` (`tool_scans`, `tool_leads`,
  `indoles-bookings` veritabanı — `BOOKINGS_DB` binding'i, ayrı DB yok)
- Sır: `TOOL_IP_SALT` (yerelde `.dev.vars`, üretimde `wrangler secret put
  TOOL_IP_SALT`)
- **Geri alma yolu:** `/araclar` route grubu ve `/api/tools/*` route'ları
  Next.js'ten kaldırılır (dosya silme, kod başka hiçbir yeri etkilemez —
  motor izole modül), `migrations/0003_tool_scans.sql`'in tabloları D1'de
  kalabilir (kullanılmayan, zararsız) veya ayrı bir `down` migration'ıyla
  düşürülür, CLAUDE.md §6 satırı "Launch kapsamı dışı; Faz 2" olarak geri
  yazılır ve bu ADR'ye "Superseded" statüsü verilir. GA4 taksonomisindeki
  `tool_*` olayları (kapalı birleşim, `src/lib/analytics/events.ts`) sessizce
  ölü kalabilir; temizlik ayrı bir görev.

## Referanslar

- `docs/superpowers/specs/2026-09-01-geo-gorunurluk-denetleyicisi-design.md`
- `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md` §2, §4
- ADR-021 (PostHog kaldırıldı) · ADR-025 (Cal.com kaldırıldı) · ADR-026
  (Veridyen SMTP) · ADR-028 (Turnstile bayrağı)
- `src/lib/tools/geo/types.ts` (taşınabilir sözleşme)
- `migrations/0003_tool_scans.sql`
