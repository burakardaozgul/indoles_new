# Runbook — Diagnoo için GA4 önemli etkinlik ve huni araştırması kurulumu

> **Kime:** Burak · **Süre:** API yolu ~5 dakika (script) · UI yolu ~10 dakika · **Sıklık:** bir kez (yetki bozulursa tekrar)
> **Karar dayanağı:** `docs/superpowers/sdd/2026-09-01-diagnoo-faz1/task-16-brief.md` §8 · `docs/superpowers/sdd/2026-09-03-diagnoo-faz2/task-9-brief.md` · `docs/12-analytics-measurement.md` §2
> **Önkoşul:** Diagnoo canlıya alınmış ve en az birkaç gerçek tarama/rapor akışı GA4'e olay yazmış olmalı — GA4 hiç veri görmediği bir olayı önemli etkinlik olarak işaretlemeyi ya da huniye eklemeyi reddedebilir veya boş gösterir.

Bu belge tek bir sonucu iki yoldan anlatır: (1) `tool_report_requested` olayını Diagnoo'ya özgü filtreyle bir **önemli etkinlik** (key event / conversion) işaretlemek, (2) dört adımlı Diagnoo huninin bir **huni araştırması** (funnel exploration) olarak kurmak.

- **API yolu (önerilen)** — `pnpm ga4:setup` / `pnpm ga4:verify` script'leri Admin API + Data API üzerinden idempotent çalışır, elle tıklama hatasına açık değil, tekrar çalıştırılabilir. Huni araştırması (funnel exploration) hariç — GA4'ün Admin API'sinde bu kaynağı oluşturan bir endpoint yok, o adım her koşulda GA4 arayüzünden yapılır.
- **UI yolu (script çalışmazsa)** — tamamen GA4 arayüzünden, aşağıda **"API yolu çalışmazsa"** başlığı altında duruyor.

İkisi de kod değişikliği gerektirmez — olaylar zaten `src/lib/analytics/ga.ts` üzerinden yazılıyor (bkz. `docs/12-analytics-measurement.md` §2.0 taksonomi tablosu).

---

## Arka plan — neden `slug` filtresi şart

GEO Görünürlük Denetleyicisi ve Diagnoo **aynı olay taksonomisini** paylaşıyor (`tool_used`, `tool_scan_completed`, `tool_report_requested`, `tool_roadmap_item_expanded`, `tool_service_cta_clicked`; GEO ilk üçünü yayar, son ikisi Diagnoo raporuna özgü) — ikisi de `/araclar` ailesinin bir parçası ve taksonomi kasıtlı olarak tek bir "araç" şemasında tutuluyor (`docs/12-analytics-measurement.md` §2.0, iki tasarım kararı). Her olayın `slug` adlı bir boyutu var: GEO için `geo-gorunurluk-denetleyicisi`, Diagnoo için `diagnoo`.

Sonuç: **`slug` filtresi olmadan** kurduğun her önemli etkinlik veya huni adımı iki aracı birden sayar. Aşağıda hem script'in ürettiği `eventCreateRule` hem elle kurulan her adımda bu filtre bu yüzden var — atlanmaz.

---

## API yolu (önerilen)

### Adım 1 — Google Cloud'da iki API'yi etkinleştir (bir kez)

OAuth istemcisinin ait olduğu Cloud projesinde (rezervasyon sisteminin `GOOGLE_OAUTH_CLIENT_ID`/`GOOGLE_OAUTH_CLIENT_SECRET`'ının geldiği proje — bkz. `docs/runbooks/google-calendar-oauth-kurulumu.md`) iki API'yi aç:

- **https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com** → **Enable**
- **https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com** → **Enable**

Yeni bir OAuth istemcisi gerekmiyor — aynı istemci, GA4 kapsamı için tek seferlik ek bir consent isteyecek (Adım 2).

### Adım 2 — OAuth izni (tek seferlik consent)

```bash
pnpm ga4:setup --auth-url
```

Çıkan bağlantıyı tarayıcıda aç, `burak@indoles.com.tr` ile giriş yap, izin ver. Tarayıcı `http://localhost/?code=...` adresinde **"bağlanılamıyor"** hatası verecek — beklenen, orada sunucu yok. Adres çubuğundaki `code` değerini kopyala (`%2F` karakterlerini `/` yap, ADIM 6b'deki gibi), sonra:

```bash
pnpm ga4:setup --exchange <code>
```

> **Not (F9 final review):** `<code>` komut satırı argümanı olarak verildiği için kabuk geçmişine ve `ps` çıktısına düşer; işlem bittikten sonra `history -d <satır-no>` ile silinebilir — kod zaten tek kullanımlıktır, bir daha aynı `code` ile değişim yapılamaz.

Script yalnız refresh token'ı ekrana basar (client secret veya access token asla basılmaz). Basılan satırı `.env.local`'e ekle:

```
GOOGLE_ANALYTICS_REFRESH_TOKEN=...
GA4_PROPERTY_ID=...
```

`GA4_PROPERTY_ID` bilinmiyorsa:

```bash
pnpm ga4:setup --list-properties
```

erişilebilir tüm hesap/property çiftlerini listeler.

### Adım 3 — Kurulumu uygula

Önce planı gözden geçir — bu komut **hiçbir yazma çağrısı yapmaz**:

```bash
pnpm ga4:setup --dry-run
```

Plan doğruysa gerçek çalıştır:

```bash
pnpm ga4:setup
```

Script idempotent üç şeyi sırayla kurar (zaten varsa atlar):

1. **Dört özel boyut** (event-scoped): `slug`, `band`, `category`, `target_service` — UI yolundaki "Adım 1 — Özel boyutu doğrula" ile aynı sonuç, dördü birden.
2. **`diagnoo_report_requested` event create rule** — kaynak olay `tool_report_requested`, koşullar `event_name = tool_report_requested` **ve** `slug = diagnoo`, parametreler kopyalanır (`sourceCopyParameters: true`) — UI yolundaki Adım 2a'nın karşılığı.
3. **`diagnoo_report_requested` key event** (`countingMethod: ONCE_PER_EVENT`) — UI yolundaki Adım 2b'nin karşılığı.

Web veri akışı kimliği (`GA4_STREAM_ID`) ortam değişkeni verilmemişse script property altındaki tek web akışını otomatik bulur; birden fazla web akışı varsa açık hata verip `GA4_STREAM_ID`'yi ortam değişkeni olarak istemesini bekle.

> **Not (2026-09-03 doğrulaması):** `eventCreateRules` kaynağı GA4 Admin API'nin resmi REST referansında yalnızca **v1alpha** altında yayınlanıyor — `customDimensions`, `keyEvents` ve `dataStreams` gibi v1beta karşılığı yok. Script bu tek çağrı için `v1alpha` taban adresini kullanıyor, geri kalan tüm Admin API çağrıları `v1beta`. Google bunu ileride v1beta'ya taşırsa `src/lib/analytics/ga4-admin.ts`'teki `ADMIN_BASE_ALPHA` sabiti güncellenir.

### Adım 4 — Huni araştırmasını kur (yalnız GA4 arayüzünden — API karşılığı yok)

Admin API'de "exploration" (Keşfet raporu) oluşturan bir kaynak yok — bu adım her koşulda elle yapılır.

**Keşfet** (sol menü) → **Boş** şablon → sağ üstten adı **"Diagnoo huni"** yap.

Sol paneldeki **Değişkenler** → **Bölümler** yerine doğrudan **Sekme Ayarları**'nda **Görselleştirme: Huni araştırması** seç, sonra **Adımlar**'ı doldur:

| # | Adım adı | Etkinlik eşleşmesi | Ek koşul |
|---|---|---|---|
| 1 | Araç kullanıldı | `tool_used` | `slug` eşittir `diagnoo` |
| 2 | Tarama tamamlandı | `tool_scan_completed` | `slug` eşittir `diagnoo` |
| 3 | Rapor istendi | `tool_report_requested` | `slug` eşittir `diagnoo` |
| 4 | Hizmet CTA'sı tıklandı | `tool_service_cta_clicked` | `slug` eşittir `diagnoo` |

Her adımda **+ Koşul ekle** ile `slug` **eşittir** `diagnoo` satırını gir — adım adı GA4'ün kendi filtre kutusudur, `slug` yazmazsan adım GEO'yu da sayar (yukarıdaki "Arka plan" notu).

**Adım ayarları:**
- **Açık huni** (open funnel) seç, **kapalı** değil: adım 1'i tamamlayan her ziyaretçi 2'ye giriş adayıdır, aradan girenleri de saymak istiyoruz — Diagnoo'ya doğrudan bir rapor bağlantısıyla gelen (bkz. aşağıdaki "Bilinçli okuma notu") adım 1'i hiç görmez ama adım 3-4'ü tetikleyebilir.
- **Sonraki adım süresi:** varsayılan (sınırsız) kalsın — tarama 2-4 dakika sürüyor (`tools.ts` SSS metni), kısa bir pencere adım 1→2 geçişini eksik sayar.

Kaydet.

### Adım 5 — Doğrula (`pnpm ga4:verify`)

```bash
pnpm ga4:verify
```

Data API'den son 7 günün olay × slug sayım tablosunu okur (`tool_used`, `tool_scan_completed`, `tool_report_requested`, `tool_roadmap_item_expanded`, `tool_service_cta_clicked` — `customEvent:slug` boyutuyla kırılımlı). Gerçek zamanlı izlemek için:

```bash
pnpm ga4:verify --realtime
```

Yeni bir tarama başlatıp `tool_used` satırının anında sayıldığını görmek filtre ve kurulumun doğru çalıştığının en hızlı kanıtıdır.

Script yalnız okur — `analytics.readonly` kapsamı yeter; aynı refresh token `analytics.edit`'i de taşıdığı için ek bir yetkilendirmeye gerek yok.

---

## API yolu çalışmazsa

Script bir sebeple çalışmazsa (API kapalı, yetki sorunu, script hatası) aynı sonucu tamamen GA4 arayüzünden üretmenin yolu:

### Özel boyutları elle oluştur

GA4 → **Yönet** (sol alt dişli) → **Veri görüntüleme** → **Özel tanımlar** → **Özel boyut oluştur**. Dördü de **Kapsam: Etkinlik (Event)**:

| Boyut adı | Etkinlik parametresi |
|---|---|
| `slug` | `slug` |
| `band` | `band` |
| `category` | `category` |
| `target_service` | `target_service` |

Yeni oluşturduysan GA4'ün geriye dönük veriyi işlemesi (genelde birkaç saat) beklenmeden sonraki adıma geçme — filtre boş görünür.

### `tool_report_requested`'ı önemli etkinlik işaretle (Diagnoo'ya filtreli)

GA4'te önemli etkinlikler **olay adı bazında** açılır, filtre bazında değil — yani `tool_report_requested`'ı GA4'ün "Önemli etkinlik olarak işaretle" anahtarıyla açtığında GEO'nun raporları da sayılır. Diagnoo'yu ayırmak için **ikinci, filtrelenmiş bir olay** türetiliyor.

**1. Filtrelenmiş bir olay oluştur.** **Yönet** → **Veri görüntüleme** → **Etkinlikler** → **Etkinlik oluştur**.

- **Özel etkinlik adı:** `diagnoo_report_requested`
- **Eşleşme koşulları:**
  - `event_name` **eşittir** `tool_report_requested`
  - `slug` **eşittir** `diagnoo`
- **Parametreleri kopyala:** açık bırak (varsayılan) — `band`, `locale` yeni olaya taşınır.

Kaydet.

**2. Önemli etkinlik olarak işaretle.** Aynı **Etkinlikler** listesinde yeni satır `diagnoo_report_requested` göründüğünde (birkaç dakika sürebilir, sayfayı yenile), satırın sağındaki **"Önemli etkinlik olarak işaretle"** anahtarını aç.

**Doğrulama:** **Yönet** → **Önemli etkinlikler** listesinde `diagnoo_report_requested` görünmeli. GEO'nun kendi karşılığını istersen aynı desenle (`geo_report_requested`, `slug` **eşittir** `geo-gorunurluk-denetleyicisi`) ayrıca kurabilirsin — bu runbook'un kapsamı yalnız Diagnoo.

### Elle doğrulama (`pnpm ga4:verify` yerine)

1. **Etkinlikler** raporunda `diagnoo_report_requested` satırını aç, **Etkinlik sayısı** grafiğinin veri gösterdiğini doğrula (gerçek zamanlı raporda önce görünür, standart raporda 24-48 saat gecikebilir).
2. Gerçek zamanlı raporda (**Raporlar** → **Gerçek zamanlı**) yeni bir tarama başlatıp `tool_used` olayının `slug=diagnoo` ile göründüğünü canlı izle — filtre yanlış kurulduysa burada hemen fark edilir (GEO trafiğiyle karışmış sayaç).

Huni araştırması her koşulda yukarıdaki **Adım 4**'ten kurulur — orada API/UI ayrımı yok, doğrulaması da **Keşfet** → **Diagnoo huni** araştırmasını açıp dört çubuğun (adım 1-4) azalan sırada göründüğünü ve her çubuğun altında `slug: diagnoo` filtresinin uygulandığını kontrol etmektir.

---

## Bilinçli okuma notu — tamamlanma oranı gerçek kullanımı hafife gösterir

Bu huniyi okurken şunu hesaba kat: **`tool_scan_completed` HER ziyaretçide tetiklenmez.** `diagnoo-tool.tsx`nin durum makinesi bir teşhis kaydının kilidi zaten açıksa (`hasLead` — aynı tarayıcıdan veya doğrudan bağlantıyla ikinci ziyaret) `DiagnooSnapshot`i hiç render etmez, doğrudan `DiagnooReport`e geçer:

```
phase = status.report ? "unlocked" : status.snapshot ? "snapshot" : "failed"
```

`tool_scan_completed` yalnız `DiagnooSnapshot` mount olduğunda yazılıyor (`diagnoo-snapshot.tsx`) — `unlocked` dalı bu bileşene hiç uğramıyor. Aynı şey rapor sayfasının doğrudan ziyaretinde de geçerli (`rapor/[id]/page.tsx`, `unlocked` ise `DiagnooSnapshot` değil `DiagnooReport` render edilir).

Pratik sonucu: **e-postasındaki rapor bağlantısına geri dönen veya raporunu bir iş arkadaşıyla paylaşan bir lead, huninin 2. adımını hiç tetiklemeden 3. veya 4. adıma "sızabilir"** (adım 3-4 zaten tamamlanmış bir kayıtta yeniden tetiklenmez çünkü ilgili istemci event'leri de `unlocked` dalında değil `DiagnooSnapshot`/`DiagnooUnlockForm` akışında yaşıyor — ama doğrudan paylaşılan bağlantıdan gelen yeni bir ziyaretçi `tool_used`'ı hiç görmeden `tool_roadmap_item_expanded`/`tool_service_cta_clicked` üretebilir, çünkü o ikisi `DiagnooReport` içinde, kilit durumundan bağımsız çalışır).

Bu yüzden **1→2 geçiş oranı, gerçek "taramayı bitirenler" oranından düşük görünür** — payda (adım 1) her ziyaretçiyi sayar, ama pay (adım 2) yalnız o oturumda YENİ tamamlanan taramaları sayar; dönen ziyaretçiler ve paylaşılan bağlantı trafiği payda şişirir, payı şişirmez. Raporu okuyan biri "tamamlanma oranı düşük" derse ilk kontrol bu olmalı — motor hatası değil, ölçüm mimarisinin bilinçli bir sonucu (`docs/12-analytics-measurement.md` §2.0'daki `tool_scan_completed` tanımı: "tarama skorla tamamlandı", ilk tamamlanma; tekrar görüntüleme değil).

---

## Deploy öncesi Burak adımları

GA4 kurulumu koda bağımlı değil ama Diagnoo'nun gerçek veri üretmesi üç sırra ve bir uzak migration'a bağlı — bunlar bu görevin (Görev 16) kapsamı dışında bırakıldı çünkü üretim komutu çalıştırmak ajan işi değil. Deploy öncesi sırayla:

1. **Üç Diagnoo sırrını gir** (`TOOL_IP_SALT` GEO'dan zaten mevcut, tekrar girilmez):

   ```bash
   pnpm wrangler secret put GEMINI_API_KEY
   pnpm wrangler secret put FIRECRAWL_API_KEY
   pnpm wrangler secret put PSI_API_KEY
   ```

   Üçü de gerçek, çalışan anahtar olmalı — hiçbiri şu an `.dev.vars`'ta veya repoda yok (task-16 doğrulaması bilerek boş değerle koştu, bkz. task-16-report.md §"Lokal e2e duman testi").

2. **Uzak D1 migration'ını uygula:**

   ```bash
   pnpm wrangler d1 migrations apply indoles-bookings --remote
   ```

   Dört migration da bu ana kadar yalnız yerelde uygulandı: `migrations/0004_diagnoo.sql` (`diagnoo_diagnostics`, `diagnoo_leads` tabloları), `migrations/0005_diagnoo_lead_scope.sql` (kilit token'ı, lead bazlı yeniden hesap), `migrations/0006_diagnoo_lead_per_unlock.sql` (her kilit açmaya kendi lead satırı — e-posta benzersizliği kalkar) ve `migrations/0007_diagnoo_leads_ip_index.sql` (`diagnoo_leads` için IP bazlı hız sınırı indeksi). 0005 uygulanmadan unlock rotası `unlock_token` kolonunu bulamaz ve kilit açma 500 döner; 0006 uygulanmadan aynı e-postayla gelen ikinci ziyaretçi `UNIQUE` ihlaline düşer ve yine 500 alır; 0007 uygulanmadan IP başına saatlik unlock limiti (`countLeadsSince`) her denetimde tabloyu tam taratır — hata vermez ama D1 sorgu bütçesini gereksiz yakar. Dördü sırayla, tek komutla uygulanır.

3. **Anahtarları gerçek bir siteyle bir kez uçtan uca doğrula** — Gemini (semantik/vision analiz) ve Firecrawl (yedi sayfa taraması) akışının canlıda gerçekten çalıştığını görmeden sayfa hiçbir yerden linklenmemeli. Bilinen gerçek bir e-ticaret adresiyle (kendi mağazanız veya bir müşteri, izinle) `/tr/araclar/diagnoo`'da tam bir tarama + kilit açma denenir; rapor sayfasında dört boyutun da (mesaj, arayüz, hız, ölçüm) gerçek verilerle dolduğu kontrol edilir.
4. **Bu runbook'taki API yolunu uygula** (Adım 1-5 — Adım 4 huni araştırması her koşulda elle kalır) **veya API yolu çalışmazsa "API yolu çalışmazsa" bölümünü + Adım 4'ü uygula.**
5. Yukarıdaki dördü tamamlanmadan **Diagnoo ana navigasyona veya başka bir sayfaya link verilmez** — sayfa şu an yalnız doğrudan URL ile erişilebilir durumda kalmalı (Faz 2 planı, ana navigasyon girişini ayrıca ele alacak).
6. **Lansman kapısını aç:** GA4 kurulumu (Adım 1-5) doğrulandıktan sonra `src/lib/content/tools.ts` içindeki Diagnoo kaydında `published: false` → `published: true` yapılır ve deploy edilir.

   Bayrak `false` olduğu sürece araç sitemap'e, `/araclar` listesine ve `llms.txt`'e girmez; sayfası `noindex, nofollow` döner ve yalnız doğrudan URL ile açılır. Bu, kodun merge edilmesiyle aracın yayına alınmasını ayıran tek anahtardır — sırlar veya uzak migration eksikken bayrağı açmak, çalışmayan bir sayfayı Google'a ilan etmek olur.

   Bayrağı çevirdikten sonra iki test bilinçli olarak güncellenir: `tests/unit/tools-content.test.ts` ("lansman kapısı kapalı") ve `tests/unit/sitemap.test.ts` ("yayınlanmamış araç sitemap'e girmez"). Deploy sonrası `pnpm seo:audit` Diagnoo sayfasını da tarayacaktır.
