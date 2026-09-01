# GEO Görünürlük Denetleyicisi — Tasarım Spec'i

> **Tarih:** 2026-09-01 · **Statü:** Burak onaylı (yaklaşım + 5 tasarım bölümü, 2026-09-01)
> **Bağlam:** `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md` §2 araç portföyü, sıra ④ — amiral gemisi.
> "Türkiye'nin ilk GEO denetim aracı" PR hikâyesi + GEO danışmanlığının canlı kanıtı.
> **Karar sahibi:** Burak. Onaylanan kararlar: Yaklaşım A (Worker-native motor) · lead akışı
> "mail'e rapor + inbox'a lead" · CLAUDE.md §6 kapsam-dışı satırının ADR-030'la güncellenmesi.

## 1. Amaç ve kapsam

Kullanıcı bir URL girer; araç sayfayı ve origin'i tarayıp 100 üzerinden bir **GEO hazırlık
skoru** üretir. Basit sonuç herkese açık; **detaylı rapor e-posta karşılığı** gönderilir
(MOFU lead yakalama). Araç `indoles.com.tr` üzerinde yaşar — otorite ana alanda birikir.

**Kapsam dışı:** Diagnoo entegrasyonu (Diagnoo deploy edilmedi; bu araç Worker-native —
bkz. §2 gerekçe). Basın pitch'i (plan §1'in işi; bu tasarım yalnız hammaddesi olan duyuru
yazısını üretir). Çok-URL'li site taraması (tek URL + origin kontrolleri; "süper araç"
yapılmaz — plan kapsam disiplini).

**Bayat altyapı düzeltmeleri** (plan dokümanındaki referanslar bu spec'te düzeltilmiştir):
PostHog → **GA4** (ADR-021) · Resend → **Veridyen SMTP** (ADR-026) · Cal.com →
**kendi rezervasyon sistemi** (ADR-025 + Görev 1-10 rezervasyon altyapısı).

## 2. Mimari — Yaklaşım A (onaylı)

Tarama, mevcut Worker'da bir API route olarak çalışır; yeni altyapı ve ek maliyet sıfır.

- **Motor:** fetch katmanından ayrık **saf kural fonksiyonları** (`src/lib/tools/geo/`).
  Tam DOM parse YOK — hedefli çıkarım: `ld+json` blokları regex + `JSON.parse`,
  `link rel="alternate"`/`canonical`/`html lang` regex, H2 metinleri regex. Ücretsiz
  Workers planının ~10 ms CPU sınırına sığar. (Cheerio yalnız build-time `seo:audit`'te
  kalır; runtime'a girmez.)
- **Taşınabilirlik sözleşmesi:** motorun girdisi ham metinler (`pageHtml`, `robotsTxt`,
  `llmsTxt`), çıktısı `GeoScanResult` JSON'u (aşağıda). Diagnoo ileride canlıya çıkarsa
  modül bu sözleşmeyle taşınır; sayfa/API değişmez.
- **Kalıcılık:** D1 (`indoles-bookings` veritabanındaki yeni tablolar — ayrı DB açılmaz).
- **E-posta:** mevcut `worker-mailer` SMTP istemcisi + React Email şablonu.

### Veri sözleşmesi

```ts
type GeoScanInput = { url: string; pageHtml: string; robotsTxt: string | null; llmsTxt: string | null };

type GeoCheckId = "ai-access" | "llms-txt" | "json-ld" | "lang-signals" | "question-h2";

type GeoCheckResult = {
  id: GeoCheckId;
  score: number;        // kazanılan puan
  max: number;          // kalemin tavanı (normalizasyon sonrası)
  status: "pass" | "partial" | "fail";
  summary: Localized<string>;      // basit sonuçtaki tek cümle
  findings: Array<Localized<string>>; // detaylı rapor maddeleri
};

type GeoScanResult = {
  id: string;           // paylaşım kimliği (nanoid benzeri, tahmin edilemez)
  url: string;
  totalScore: number;   // 0-100
  band: "zayif" | "gelismeye-acik" | "iyi" | "oncu";
  checks: GeoCheckResult[];
  scannedAt: string;    // ISO
};
```

## 3. Skorlama modeli (onaylı)

| id | Kalem | Puan | Kural |
|---|---|---|---|
| `ai-access` | AI erişimi (robots.txt) | 25 | Origin robots.txt'i; 10 bilinen AI crawler'ın (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot) verilen URL path'i için allow/disallow çözümü (en özgül UA bloğu kazanır). Hepsi engelli 0 · kısmî oransal · robots yok = tam puan + "izinli ama beyansız" bilgi notu |
| `llms-txt` | llms.txt | 15 | `/llms.txt` 200 + metin. Biçim kontrolü: en az bir markdown bağlantı satırı (`- [..](..)`). Var+biçimli 15 · var+biçimsiz 10 · yok 0 |
| `json-ld` | Yapısal veri | 20 | Sayfadaki `ld+json` blokları: geçerli JSON (12) + tanınan `@type` çeşitliliği (Organization/WebSite/Article/Service/Product/Breadcrumb… — 4'e kadar) + `FAQPage` varlığı ağırlıklı. Parse hatalı blok = kısmi |
| `lang-signals` | hreflang ve dil sinyalleri | 15 | `html lang` (5) + self-canonical (5) + hreflang seti tutarlılığı (5; self + karşılıklılık ipucu). **Tek dilli site cezalandırılmaz:** hreflang hiç yoksa kalem 10 üzerinden ölçülüp 15'e normalize edilir |
| `question-h2` | Soru-H2 ve cevap yapısı | 25 | H2 soru-formu oranı (15; ≥%50 tam, altı oransal; H2 yoksa 0 + bulgu) + sayfada görünür soru-cevap metni (10; `FAQPage` şeması VEYA ≥3 soru işaretli başlık/`<details>` deseni) |

Bantlar: 0-39 **zayıf** · 40-69 **gelişmeye açık** · 70-89 **iyi** · 90+ **öncü**.
Kalem etiketleri ve tüm kullanıcı metinleri `indoles-brand-voice` denetiminden geçer
(hype yok, ünlem yok; teşhis dili eğitici-somut).

**Basit sonuç:** toplam skor + bant + 5 kalem rozeti + kalem başına `summary` cümlesi.
**Detaylı rapor (e-posta):** kalem başına `findings` listesi (hangi bot engelli, hangi
şema eksik/bozuk, örnek soru-H2 önerileri) + öncelikli 3 aksiyon + ilgili rehber yazı
linkleri + rezervasyon CTA'sı.

## 4. Sayfalar ve akış

### Route'lar

| Yüzey | TR | EN |
|---|---|---|
| Araçlar indeksi | `/tr/araclar` | `/en/tools` |
| Araç sayfası | `/tr/araclar/geo-gorunurluk-denetleyicisi` | `/en/tools/geo-visibility-checker` |
| Paylaşım sonucu | `/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]` | `/en/tools/geo-visibility-checker/result/[id]` |
| API | `POST /api/tools/geo-scan` · `POST /api/tools/geo-report` | — |

`araclar ↔ tools`, `sonuc ↔ result` segment çevirileri `routing.ts`'e eklenir. Araç
sayfaları SSG + indekslenebilir (hreflang üçlüsü, self-canonical, `buildMetadata`).
**Sonuç sayfası `noindex, follow`** ve sunucuda D1'den okunur (ince içerik indekslenmez;
paylaşım linklerinden gelen otorite araca akar — sayfa araca güçlü link verir).

### Tarama akışı

1. Araç sayfası: URL girişi + görünmez Turnstile → `POST /api/tools/geo-scan`.
2. Route: Turnstile doğrulama → SSRF/limit korumaları (§5) → 3 fetch (sayfa, robots.txt,
   llms.txt) → motor → `GeoScanResult` → D1 `tool_scans` kaydı → `{ id, result }` döner.
3. İstemci sonucu gösterir; URL çubuğu paylaşım linkine güncellenir (`history.replaceState`)
   ve "sonucu paylaş" düğmesi kopyalar.
4. GA4: `tool_used` (tarama başlatıldı) · `tool_scan_completed` (skor bandıyla).

### Rapor akışı (lead — onaylı model: mail'e rapor + inbox'a lead)

1. Sonuç ekranında: e-posta + **KVKK açık rıza kutusu** (`z.literal(true)` — iletişim
   şeması deseni) + Turnstile → `POST /api/tools/geo-report`.
2. Route: doğrulama → D1 `tool_leads` kaydı → kullanıcıya HTML rapor (React Email +
   SMTP) → satışa lead bildirimi (iletişim formu alıcı listesi; bildirim düşerse 500,
   kullanıcı raporu düşerse yutulur + log — contact route'un kanıtlanmış davranışı) →
   sayfada detaylı rapor kilidi açılır.
3. GA4: `tool_report_requested`.

**Rapor CTA'sı:** kendi rezervasyon akışımız (BookingScreen/PopupCTA deseni; kapalı
`BookingCtaSource` union'ına `tool-geo-report` eklenir).

## 5. Koruma katmanı

- **SSRF:** yalnız `http/https` · IP-literal host, `localhost`, private-range ve `.local`
  reddi · redirect ≤3 · yanıt 2 MB'ta kesilir (stream) · 10 sn timeout · sayfa isteğinde
  yalnız `text/html` · aracın kendi endpoint'lerini taratma reddi. `indoles.com.tr`'yi
  taratmak serbest (canlı demo).
- **Hız sınırı:** IP başına saatte 10 tarama; günlük global tavan 500 tarama (D1 sayaç —
  Workers ücretsiz plan alt-istek kotasını korur). Rapor isteği: IP başına saatte 3.
- **Bot koruması:** iki formda da görünmez Turnstile.
- **CPU bütçesi:** hedefli regex çıkarımı; motor birim testlerinde 500 KB fixture ile
  süre sınırı asserte edilir.

## 6. SEO/GEO mekaniği ve konumlandırma

- **Kelime hedefi (kanibalizasyon disiplini, alarm A-6):** bilgi niyeti (`geo optimizasyonu`,
  `yapay zeka arama optimizasyonu`) kanonik rehber yazısında KALIR. Araç sayfası **araç
  niyetini** hedefler: `GEO denetimi`, `GEO analiz aracı`, `AI görünürlük testi`,
  `llms.txt kontrolü`. `keyword-coverage.test.ts`'e araç sayfası çiftleri eklenir.
- **Şema:** `SoftwareApplication` (ücretsiz teklif, `offers.price: 0`) + `FAQPage`
  (6-8 soru; cevap ≥40 kelime, anafora yasağı — mevcut test kuralları; `seo:audit`
  araç profili min 6 soru olarak tanımlanır) + Breadcrumb + WebPage.
- **llms.txt:** generator'a TOOLS kaynağı + "Araçlar" bölümü (TR+EN + kök).
- **Üçgen linkler (çift yönlü):** araç ↔ `/hizmetler/ai-danismanlik` ↔ üç GEO yazısı.
  Üç GEO yazısına "sitenizi şimdi test edin" araç kutusu eklenir (rehber trafiği → araç).
- **"Türkiye'nin ilk" iddiası:** sayfada kullanılır; tarih damgalı **duyuru yazısı**
  (kısa makale, `geo` topic) + sayfada dürüst dipnot: "Eylül 2026 itibarıyla Türkçe
  pazarda benzer kapsamda kamuya açık bir GEO denetim aracı tespit etmedik." Duyuru,
  basın pitch'inin hammaddesi.
- **OG:** araç sayfasına özel statik OG kartı (tek PNG, `public/` — asset Burak'tan
  veya tipografik üretim; yoksa site geneli kart kullanılır, bloklamaz).
- **GA4 taksonomisi:** `tool_used` · `tool_scan_completed` · `tool_report_requested`
  → `docs/12-analytics-measurement.md`'ye eklenir.

## 7. Karar kayıtları ve doküman senkronu

| İş | Detay |
|---|---|
| **ADR-030** | `/araclar`ın kapsam-dışı tablosundan çıkışı + Worker-native motor kararı (Diagnoo modülü ertelemesi, taşınabilir sözleşme şerhi) |
| **CLAUDE.md §6** | Kapsam-dışı satırı ADR-030 referansıyla güncellenir (Burak onayı bu tasarım onayıyla alındı — 2026-09-01) |
| **docs/02** | Route haritasına `/araclar` ailesi |
| **docs/12** | `tool_*` olayları |
| **Strateji changelog** | v1.11 satırı; Off-Site planı §4 açık-iş işaretleri güncellenir |

## 8. Test stratejisi

- **Motor birim testleri:** fixture HTML/robots/llms metinleriyle her kalemin puan
  kuralları (tam/kısmi/sıfır + normalizasyon + robots UA çözümü) — TDD ile yazılır.
- **Koruma testleri:** SSRF reddi matrisi, limit sayacı, Turnstile zorunluluğu.
- **API route testleri:** contact route test deseni (mock fetch + D1).
- **D1:** migration + repo testleri (booking `repository.test` deseni).
- **SEO regresyonu:** `seo:audit`'e araç sayfası profili (title/description/JSON-LD/persona
  yasağı kuralları) · keyword-coverage çiftleri · smoke'a araç URL'leri.
- **E2E:** tarama → sonuç → paylaşım linki → rapor formu akışı (Playwright).

## 9. Açık noktalar (bloklamaz)

- Araç OG kartı asset'i (yoksa site geneli kart ile çıkılır).
- Duyuru yazısının yayın anı (araçla aynı gün önerilir).
- EN pazarda "first in Türkiye" ifadesinin EN sayfadaki karşılığı ("the first Turkish
  GEO audit tool" — aynı dipnotla).
