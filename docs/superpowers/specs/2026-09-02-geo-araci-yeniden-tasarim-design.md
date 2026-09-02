# GEO Görünürlük Denetleyicisi — UI/UX Yeniden Tasarım Spec'i

> **Tarih:** 2026-09-02 · **Statü:** Burak onaylı (yaklaşım 1 + üç tasarım bölümü, 2026-09-02)
> **Bağlam:** `2026-09-01-geo-gorunurluk-denetleyicisi-design.md` ile inşa edilen araç
> işlevsel olarak sağlam; 2026-09-02 ekran görüntüsü değerlendirmesi
> (`.superpowers/ux-review/`) görsel ve etkileşim katmanını yetersiz buldu:
> "blog sayfasına gömülü form". Bu spec yalnız o katmanı yeniden tasarlar.
> **Karar sahibi:** Burak. Onaylanan kararlar: Yaklaşım 1 (tek sayfa, üç durum) ·
> popup araç rotalarında bastırılır · OG kartları derleme zamanında üretilir.

## 1. Amaç ve kapsam

Araç sayfası bir *metin sayfası* olmaktan çıkıp bir *ürün* gibi davranır: giriş alanı
sayfanın en güçlü öğesidir, tarama anı görünür, skor tek bakışta okunur, detaylı bulgular
görünür bir kilidin arkasındadır ve paylaşılan bağlantı sosyal ağlarda skoru taşıyan bir
kart olarak görünür.

**Kapsam içi:** araç sayfası (`/tr/araclar/geo-gorunurluk-denetleyicisi`, EN eşi),
paylaşım sayfası (`.../sonuc/[id]`), araçlar dizini (`/tr/araclar`), OG kartı üretimi,
popup davranışı, dört davranış düzeltmesi (§7), motor metin sabitlerinin kullanıcı diline
çevrilmesi.

**Kapsam dışı:** puanlama modeli ve motor mantığı, D1 şeması, e-posta rapor şablonu,
Turnstile/anti-spam sözleşmesi (yalnız istemci tarafı bekleme eklenir), kendi sitemizin
skoru, ikinci araç.

**Değişmeyen sözleşmeler:** `POST /api/tools/geo-scan` ve `/api/tools/geo-report`
gövdeleri; `stripFindings` prensibi (bulgu metni mail kapısının arkasında); `noindex,
follow` paylaşım sayfası; `history.replaceState` ile paylaşım URL'i; GA4 olayları
(`tool_used`, `tool_scan_completed`, `tool_report_requested` — yeni olay yok).

## 2. Mimari — Yaklaşım 1: tek sayfa, üç durum (onaylı)

Sayfa üstü tek bir istemci adasıdır: `components/tools/geo-tool.tsx` (`GeoTool`).

```
durum:  idle ──submit──▶ scanning ──200──▶ result
          ▲                 │
          └──── error ◀─────┘ (4xx/5xx/ağ)

idle / error : ToolHero + ScanBar (+ hata satırı)
scanning     : ToolHero (kompakt) + ScanBar (kilitli) + ScanStage
result       : ScoreCard + SignalRows + ReportGate (kilitli → açık)
```

- `GeoTool` URL'i, tarama sonucunu ve durumu tutar; alt bileşenler prop-güdümlüdür.
  `BandScale`, `SignalRows`, `FindingsList` saf (hook yok, "use client" gerektirmez —
  çubuk dolgusu CSS geçişiyle büyür); `ScoreCard` (sayaç), `ScanBar`, `ScanStage`,
  `ReportGate` istemci bileşenidir.
- `page.tsx` (sunucu) JSON-LD grafını, `GeoTool`'u (`initialResult` yok) ve altındaki
  statik bölümleri basar. `h1` `GeoTool` içinde ama sunucu HTML'indedir (istemci
  bileşenleri SSR edilir); tam olarak bir `h1`.
- Paylaşım sayfası aynı `GeoTool`'u `initialResult` ile `result` durumunda açar
  (`stripFindings` uygulanmış D1 kaydı). "Yeni tarama" burada araç sayfasına gider.
- Mevcut `geo-scan-form.tsx`, `geo-result.tsx`, `geo-report-form.tsx` silinir; Turnstile
  / bal küpü / süre tuzağı mantığı `ScanBar` ve `ReportGate`'e birebir taşınır (ADR-028
  deseni değişmez).

### Bileşen dosyaları

| Dosya | Sorumluluk |
|---|---|
| `components/tools/geo-tool.tsx` | Durum makinesi, API çağrısı, GA4 olayları, URL güncelleme, skor kartına kaydırma |
| `components/tools/tool-hero.tsx` | Eyebrow, `h1`, tek cümle lede, kanıt şeridi; `compact` prop'u (tarama sırasında) |
| `components/tools/scan-bar.tsx` | Dev giriş çubuğu; şema tamamlama; süre tuzağı beklemesi; hata satırı |
| `components/tools/scan-stage.tsx` | Beş satırlı tarama sahnesi, kadans `anim-config.TOOL_SCAN` |
| `components/tools/score-card.tsx` | Skor, bant, bant cümlesi, dört bantlı ölçek, sayaç |
| `components/tools/band-scale.tsx` | Ölçek (ScoreCard ve OG şablonu ortak kullanır) |
| `components/tools/signal-rows.tsx` | Ağırlıklı çubuk satırları + açılır özet |
| `components/tools/report-gate.tsx` | Kilit kartı (iskelet önizleme + form) → `FindingsList` |
| `components/tools/findings-list.tsx` | Sıralı düzeltme listesi + CTA altbilgisi |

## 3. Hero ve giriş çubuğu (idle)

Ortalı kompozisyon, 760 piksel okuma kolonu (`max-w-prose-editorial` yerine yeni
`--container-tool` token'ı, `tokens.ts` → `globals.css`).

```
              ── TÜRKİYE'NİN İLK GEO DENETİM ARACI
           GEO Görünürlük Denetleyicisi                 (h1, typography-h1)
   Cevap motorları sitenizi okuyabiliyor mu? Beş sinyalde ölçer,
        her sinyalde ne düzelteceğinizi söyler.          (lede, body-lg, tek cümle)

  ┌──────────────────────────────────────────────────────────────┐
  │  sirketiniz.com.tr                              ( Denetle → )│  ScanBar
  └──────────────────────────────────────────────────────────────┘
   Yalnız girdiğiniz sayfa denetlenir; başka bir sayfa için yeniden çalıştırın.

        5 SİNYAL   ·   100 PUAN   ·   ~5 SANİYE   ·   ÜCRETSİZ       (kanıt şeridi, mono)
```

**Kopya dağılımı** (2026-09-01'de istenen dört bilgi korunur): "yalnız girdiğiniz URL /
yeniden çalıştırın" → yardım satırı; "100 puan" ve "5 sinyal" → kanıt şeridi; "her
sinyalde ne düzeltebileceğinizi gösterir" → lede. `keyword-coverage.test.ts`
`TARGETS_TOOLS` çiftleri ("geo denetimi", "ai görünürlük testi", "llms txt kontrolü")
`toolSurface` yüzeyinde kalmalı; lede'de kalmıyorsa SSS/adım metinlerinde kalır, silinmez.
"Eylül 2026 itibarıyla … tespit etmedik" dipnotu formun altından kalkar, "Türkiye'nin ilk
GEO denetim aracı mı?" SSS maddesine taşınır.

**ScanBar**
- Beyaz pill (`bg-pure`, `border-ink-200`, `rounded-full`), yumuşak gölge (yeni
  `--shadow-float` token'ı; `docs/04 §5` elevation'a eklenir), yükseklik masaüstü 72 /
  mobil 60 piksel (`tokens.ts` → `--size-scanbar`), metin 18 piksel (`typography-body-lg`).
- Buton çubuğun içinde sağda: `.btn .btn-primary` (siyah pill — light zeminde birincil
  aksiyon siyahtır, docs/04 §3). Mobilde ikon-only 48 piksel daire (ok), `aria-label`.
- Buton pasif başlamaz. Boş gönderimde çubuk altında uyarı: "Denetlemek istediğiniz
  adresi yazın." Turnstile bayrağı açıksa (ADR-028) buton token gelene dek pasiftir
  (mevcut davranış).
- Şema tamamlama: girdi `http(s)://` ile başlamıyorsa istemci `https://` ekler; sunucu
  şeması değişmez.
- Hata satırı 14 piksel (`typography-body-sm`), `text-danger-700`, başında ikon, çubuk
  `aria-invalid` + `border-danger-500`.
- Süre tuzağı: `anti-spam.ts` `MIN_FILL_MS` dışa açılır; gönderim anında `Date.now() -
  mountedAt < MIN_FILL_MS` ise istemci kalan süreyi bekler (buton "Taranıyor…" durumunda),
  sonra POST eder. Sunucu tuzağı değişmez.

**Blob — "camın altındaki küre".** `BLOB_TOOL_HERO`: `opacity 0.55 → 0.85`, `y`
merkez ScanBar'ın arkasına gelecek şekilde ayarlanır (ölçümle; hedef: küre çekirdeği
çubuğun ve kanıt şeridinin arkasında, başlık ve lede yumuşak üst kenarın üstünde temiz
kremde). Scroll'da `BLOB_PAGE`'e çekilme davranışı ve mobil override'lar kalır. Kontrast
docs/04 §12.10 protokolüyle 4 viewport'ta yeniden ölçülür ve tabloya işlenir; ScanBar'ın
metni opak beyaz kuyuda olduğundan blob'dan etkilenmez.

## 4. Tarama sahnesi (scanning)

Gönderimde çubuk yerinde kalır (adres okunur, buton `aria-busy` ile döner, alan kilitli);
altında beş satır açılır:

```
 ●  AI erişimi · robots.txt          okunuyor…
 ○  llms.txt                          bekliyor
 ○  Yapısal veri                      bekliyor
 ○  Dil sinyalleri                    bekliyor
 ○  Soru başlıkları                   bekliyor
```

- Satır sırası `tools.ts` `signals` sırası; etiketler oradan okunur.
- Kadans `anim-config.ts` `TOOL_SCAN`: `enterStaggerMs: 400` (satırlar sırayla
  "okunuyor"), `resolveStaggerMs: 150` (yanıt gelince sırayla "25 / 25 · Geçti"),
  `morphMs: 500` (sahne → skor kartı). Yanıt tüm satırlar girmeden gelirse kalan
  satırlar doğrudan çözülür. **Yanıt gelmeden hiçbir satır sonuç göstermez.**
- `prefers-reduced-motion`: kadans yok; yanıtla birlikte skor kartı anında basılır.
- Sahne `role="status" aria-live="polite"`; ekran okuyucuya tek anons: "Tarama sürüyor",
  sonuçta "Tarama tamamlandı, skor 55".
- Hata: sahne kapanır, `ScanBar` hata satırı gösterir (§7 kopya).

## 5. Skor kartı ve sinyal satırları (result)

Sonuç geldiğinde hero + çubuk yerini skor kartına bırakır; `GeoTool` kartın üstüne kaydırır
(`scrollIntoView`, reduced-motion'da `behavior: "auto"`). Kart `.v2-surface`, `rounded-2xl`.

```
 ── SONUÇ · https://www.migros.com.tr          Yeni tarama ↻   Bağlantıyı kopyala ⧉

 55            GELİŞMEYE AÇIK
 /100          Cevap motorları sitenizi okuyor ama alıntılayacak yapı bulamıyor.

 [ zayıf ░░░░░░░░ | gelişmeye açık ▓▓▓▓▓●░░░░ | iyi ░░░░░░░ | öncü ░░░░ ]
    0            40                        70            90          100
```

- **Sayı:** `typography-display-xl`, Lexend, `tabular`. 0'dan skora sayar
  (`TOOL_SCORE.countMs: 800`, ease-out, reduced-motion'da anında). `aria-live` yalnız son
  değeri anons eder (ara değerler `aria-hidden`).
- **Bant pill:** mevcut `BAND_TONE` renkleri (`danger / warning / success / teal`).
- **Bant cümlesi:** `tools.ts` `ToolContent.bands: Record<GeoBand, Localized<string>>`
  (dört cümle × iki dil; içerik katmanı konuşur, motor değil). Taslak TR:
  zayıf "Cevap motorları sitenizi büyük ölçüde göremiyor." · gelişmeye açık "Cevap
  motorları sitenizi okuyor ama alıntılayacak yapı bulamıyor." · iyi "Temel yapı yerinde;
  birkaç sinyal sizi öne geçirir." · öncü "Cevap motorları için örnek bir yapı."
- **Ölçek (`BandScale`):** yatay, dört bölme eşik oranlarında (0-40-70-90-100 →
  %40 / %30 / %20 / %10), bölme renkleri bant tonlarının `50` varyantı, aktif bölme `500`,
  işaretçi skor konumunda; altta mono eşik etiketleri. Eşikler `bandFor` ile tek kaynaktan
  türetilir (`types.ts`'e `BAND_THRESHOLDS` sabiti eklenir, `bandFor` onu kullanır).
- **Başlık satırı:** "Yeni tarama" (`variant="ghost"`, `idle`'a döner; paylaşım sayfasında
  araç sayfasına link) · "Bağlantıyı kopyala" (mevcut pano davranışı, 2,5 sn "Kopyalandı").

**SignalRows** — tek sütun, ağırlığı görünür kılan rapor satırları:

```
 AI erişimi        ████████████████████████████   25 / 25   [Geçti]
 llms.txt          ████████████████                15 / 15   [Geçti]
 Yapısal veri      ░░░░░░░░░░░░░░░░░░░░░░           0 / 20   [Kaldı]
 Dil sinyalleri    ████████████████                15 / 15   [Geçti]
 Soru başlıkları   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░     0 / 25   [Kaldı]
```

- Çubuk genişliği `max / 25` oranında (en ağır sinyal tam genişlik), dolgu `score / max`.
  Dolgu rengi duruma göre `success-500 / warning-500 / danger-500`; boş kısım `ink-100`.
  Dolgu sayaçla birlikte büyür (`TOOL_SCORE.countMs`), reduced-motion'da anında.
- Durum pill'i (`typography-label`, `50` zemin + `700` metin); 10 piksel mono köşe etiketi
  kalkar. Sıra sabit (`signals` sırası).
- Satır `<details>`: açılınca motorun `summary` cümlesi (§8'de kullanıcı diline çevrilmiş).
- Mobil: ad üstte, çubuk + puan + pill altında; satır yüksekliği dokunma hedefi ≥ 44 piksel.

## 6. Kilit kartı ve düzeltme listesi

**ReportGate (kilitli)** — sinyallerin altında, iki sütun (`md:` üstü), mobilde alt alta:

```
 ┌──────────────────────────────────────────┬──────────────────────────────┐
 │ Düzeltme listesi                🔒       │ Raporu e-postayla alın        │
 │ Soru başlıkları · 2 bulgu ▒▒▒▒▒▒▒▒▒▒▒▒▒  │ [ siz@sirketiniz.com.tr    ]  │
 │ Yapısal veri · 1 bulgu    ▒▒▒▒▒▒▒▒▒▒▒    │ ☐ KVKK … Aydınlatma metni     │
 │ Geçen 3 sinyalin notları  ▒▒▒▒▒▒         │ ( Raporu gönder → )           │
 └──────────────────────────────────────────┴──────────────────────────────┘
```

- Sol sütun: önce değer, sonra istek. Kalan/kısmen sinyaller kaybedilen puana göre
  sıralı, her biri "n bulgu" + kilitli iskelet çizgi; geçenler tek satırda toplanır.
  Sayı sıfırsa satır gösterilmez.
- **Veri sözleşmesi eki (arka uç dokunuşu — §3 sabit ve §7 engellenen site ile birlikte
  toplam üç küçük dokunuş):** `GeoCheckResult.findingsCount: number`
  eklenir; `stripFindings` metni silerken sayıyı korur (`findingsCount = findings.length`),
  motor sonucu üretirken alanı doldurur. Sayı içerik sızdırmaz (Görev 12b ilkesi korunur).
  D1'deki `checks_json` kayıtları alanı taşımıyorsa okuma tarafı `findings.length`ten
  türetir (geriye uyum).
- Form: `Input type=email`, KVKK onay kutusu (mevcut kopya ve link), `.btn-primary`
  "Raporu gönder". Buton rıza işaretlenmeden pasif değildir; rızasız gönderimde satır-içi
  uyarı (mevcut `consentRequired`). Gönderirken buton `aria-busy`. Hata 14 piksel.
- Turnstile / bal küpü / süre tuzağı mevcut `geo-report-form.tsx` sözleşmesiyle birebir.

**FindingsList (kilit açık)** — kart tam genişliğe açılır:

```
 Düzeltme listesi                              Raporun kopyası e-postanızda ✓
 01  Soru başlıkları · 0 / 25 · Kaldı
     • H2 başlıklarının yarısından azı soru biçiminde; soru oranı düşük.
     • Görünür bir soru-cevap yapısı yok — FAQPage şeması, detay ögesi veya en az 3 soru başlığı bulunamadı.
 02  Yapısal veri · 0 / 20 · Kaldı
     • JSON-LD şeması yok: Organization, Article gibi tanınan @type değerleri makine tarafından okunamıyor.
 ✓  Geçen sinyaller (3)                                      ▸ notları göster
 ┌ Bu listeyi uzmanımızla önceliklendirin        ( Görüşme planlayın ) ┐
```

- Sıra: `status !== "pass"` olanlar `max - score` büyükten küçüğe; eşitlikte `signals`
  sırası. Geçenler altta `<details>` içinde (bulgusu olanlar notlarıyla).
- Bulgular rota yanıtından gelir (mevcut sözleşme). Numaralandırma mono `01`, `02`.
- CTA altbilgi: mevcut `PopupCTAButton source="tool-geo-report"` + `.btn-primary`.
- `mail-failed` davranışı değişmez (hata satırı; Burak 2026-09-01 "A" kararı).

## 7. Paylaşım sayfası, araçlar dizini, davranış düzeltmeleri

**Paylaşım sayfası (`sonuc/[id]`)**
- `V2PageHeader` kalkar. Üstte ince şerit (`.v2-surface-3`, `typography-body-sm`):
  "Paylaşılan sonuç · Kendi sitenizi tarayın →" (araç sayfasına link). Altında `GeoTool`
  `initialResult` ile; kilit kartı çalışır. Breadcrumb mevcut `v2-crumbs` deseniyle kalır.
- Metadata: `title` "GEO skoru 55/100 · migros.com.tr" (host, şema ve `www.` olmadan),
  `og:image` §9'daki skor kartı, `robots` `noindex, follow` (değişmez).

**Araçlar dizini (`/araclar`)**
- `TOOLS.length === 1` iken tam genişlikte öne çıkan kart: eyebrow, ad (`typography-h2`),
  tek cümle lede, kanıt şeridi, `.btn-primary` "Aracı aç". İki ve üstünde mevcut
  `md:grid-cols-2` ızgara. `V2PageHeader compact` kalır.

**Popup (onaylı: araç rotalarında bastır)**
- `popup-context.tsx`: `CONTACT_PATHNAMES` yanına `TOOL_PATHNAME_PREFIXES`
  (`routing.pathnames["/araclar"]`'dan iki locale için türetilir, `startsWith` eşleşmesi).
  `openPopup()` elle çağrıları (nav CTA'sı, `PopupCTAButton`) çalışmaya devam eder.

**Engellenen siteler**
- `safe-fetch.ts`: sayfa isteği (robots/llms değil, yalnız hedef sayfa) 401 / 403 / 429
  dönerse `TargetBlockedError`; `geo-scan/route.ts` bunu `{ error: "target-blocked" }`
  (400) olarak döner. Diğer erişim hataları `target-unreachable` olarak kalır.
- İstemci kopyası (TR): "Bu site otomatik istekleri engelliyor. Bu koruma büyük ihtimalle
  GPTBot ve ClaudeBot'u da engelliyor; başlı başına bir GEO bulgusu." EN: "This site blocks
  automated requests. That protection most likely blocks GPTBot and ClaudeBot too; a GEO
  finding in itself."
- `ERROR_MAP`'e `target-blocked → blocked` eklenir; testte iki dilde doğrulanır.

**Diğer**
- Sonuç geldiğinde kaydırma (§5). Hata satırları 14 piksel ve ikonlu (§3).
- `V2Chrome` `TOOL_HERO_ROUTES` davranışı (paylaşım sayfası hariç) değişmez.

## 8. Motor metin sabitleri — kullanıcı diline çeviri

Yalnız `src/lib/tools/geo/*` içindeki `summary` ve `findings` metin sabitleri değişir;
puan, eşik, durum mantığı değişmez. Kurallar:
- "Doküman:" / "Sayfa:" gibi kaynak önekleri kalkar.
- Puan parçaları cümleye girmez ("soru oranı puanı 0/15" → "H2 başlıklarının çoğu soru
  biçiminde değil ve görünür bir soru-cevap bloğu yok.").
- Her özet tek cümle, ≤ 22 kelime; her bulgu "ne eksik + neden önemli" biçiminde tek cümle.
- Kopya `indoles-copy-editor` ajanından geçer; `en-spelling` ve motor birim testleri
  (metin eşleşen assert'ler) güncellenir.

## 9. OG kartları — derleme zamanı üretim (ADR-031)

**Neden:** Worker'da istek başına üretim ADR-024'te kaldırıldı (`@vercel/og` + `fontkit`
~2,2 MB, 3 MB plan sınırı). Skor kartı PR hikâyesinin kendisi; skorun görselde olması
gerekir. Çözüm: **derleme zamanında statik üretim**, yeni bağımlılık yok.

- `scripts/generate-og-geo.ts`: Playwright (mevcut devDependency) ile
  `scripts/og/geo-card.tsx` şablonunu `renderToStaticMarkup` ile HTML'e çevirip 1200×630
  basar. Şablon `BandScale` bileşeninin kendisini kullanır (tek geometri kaynağı; oranlar
  `BAND_THRESHOLDS`'tan); fontlar `public/`'a konan woff dosyalarından yüklenir,
  `next/font` çıktısına bağımlı değildir.
- Çıktı: `public/og/geo/{tr,en}/{0..100}.png` (202 dosya, hedef ≤ 40 KB/dosya) +
  `public/og/geo/{tr,en}/tool.png` (araç sayfasının kendi kartı; bugün genel site kartı).
  Dosyalar repoya girer; şablon değişmedikçe script çalıştırılmaz. Statik varlıklar
  Worker paketine sayılmaz (ADR-024 notu).
- Kart içeriği: büyük skor + "/100", bant etiketi (bant renginde), dört bantlı ölçek ve
  işaretçi, araç adı, INDOLES imzası. Taranan adres kartta **yoktur** (`og:title` taşır) —
  böylece 101 kart yeter.
- `metadata.ts`: `ogImage(locale)` imzası korunur; paylaşım sayfası ve araç sayfası
  `buildMetadata`'ya `image` override'ı geçer (`OG_IMAGE` şeklinde `{url, width, height,
  alt}`; alt sayfa dilinde: "GEO hazırlık skoru 55/100").
- `pnpm og:geo` script'i `package.json`'a; `README`/`docs/08`'e tek satır.
- Test: `scripts/generate-og-geo.test.ts` üretim yapmadan şablon-veri eşlemesini
  doğrular (skor → bant → renk); `page-metadata` testi paylaşım sayfasının doğru dosyayı
  seçtiğini doğrular; `seo:audit` `og:image` varlığını zaten denetler.

## 10. Design token ve doküman senkronu

| Değişiklik | Dosya |
|---|---|
| `--container-tool` (760), `--size-scanbar` (72/60), `--shadow-float` | `tokens.ts` → `globals.css` |
| `TOOL_SCAN` (400/150/500), `TOOL_SCORE` (800), `BLOB_TOOL_HERO` (opacity 0.85, y yeniden) | `anim-config.ts` |
| `.tool-hero` ortalı düzen, `.scan-bar`, `.band-scale`, `.signal-row` | `v2.css` |
| §5 elevation'a `float`; §12.10 araç hero tablosu (opaklık 0.85, "camın altındaki küre", yeni kontrast tablosu); araç sayfası tipolojisine "sonuç durumu" | `docs/04` |
| ADR-031 "OG kartları derleme zamanında üretilir" | `docs/decisions/ADR-031-og-kartlari-derleme-zamani.md` |
| `tool_*` olay kaynağı dosya adları (`geo-tool.tsx`, `report-gate.tsx`) | `docs/12` §tablo |
| Strateji changelog satırı (araç UI v2, OG kartı) | `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` |
| `active_context.md` | durum |

Route haritası değişmez (`docs/02` dokunulmaz). CLAUDE.md §7 klasör haritasında
`components/tools/` satırı yeni dosya adlarıyla güncellenir.

## 11. Test stratejisi

- **Birim (Vitest):** `BandScale` işaretçi konumu ve bölme oranları (`BAND_THRESHOLDS`
  ile tutarlı); `SignalRows` çubuk genişliği/dolgu oranı; `FindingsList` sıralaması;
  `stripFindings` `findingsCount`; `ERROR_MAP` (`target-blocked` dahil, iki dil);
  `ScanStage` reduced-motion (kadans yok); `ScanBar` şema tamamlama ve süre tuzağı
  beklemesi (sahte zamanlayıcı); `GeoTool` durum geçişleri; `popup-context` araç rotasında
  zamanlayıcı başlatmaz; motor metin sabitleri (önek yok, uzunluk sınırı, `en-spelling`).
- **Uçtan uca (Playwright, `tests/e2e/geo-tool.spec.ts` güncellenir):** tarama rotası
  mock'lu — sahne satırları görünür, sonuçta sayfa skor kartına kayar, URL güncellenir,
  pano kopyalama; kilit kartında rızasız gönderim uyarısı, mock'lu 200 ile liste açılır ve
  kalanlar önce gelir; araç rotasında popup 6 sn içinde açılmaz; `target-blocked` mesajı.
- **Görsel:** `indoles-design-craftsman` protokolü — 375 / 768 / 1280 / 1536'da ekran
  görüntüsü turu (idle, scanning, result, unlocked, share, index); blob kontrast ölçümü
  docs/04 §12.10 yöntemiyle yinelenir, tablo güncellenir; hiçbir viewport'ta yatay taşma
  (`no-horizontal-overflow.spec.ts` araç sayfalarını kapsar).
- **Kapılar:** `pnpm typecheck` · `pnpm test` (keyword-coverage `TARGETS_TOOLS` yeşil) ·
  `pnpm build && pnpm seo:audit` 0 FAIL · worker gzip < 3 MB · `wrangler deploy --dry-run`.

## 12. Açık noktalar (bloklamaz)

- Kanıt şeridindeki "~5 saniye" gerçek ölçümle doğrulanır (büyük sayfalarda 8 sn'ye
  çıkıyorsa "saniyeler içinde" yazılır).
- OG PNG boyutu 40 KB'ı aşarsa JPEG (kalite 85) ile aynı yol; karar üretim sonucuna göre.
- Kendi anasayfamızın 64 puanı (canonical uyuşmazlığı + soru H2 yok) ayrı iş; yayın
  duyurusundan önce kapatılmalı.
