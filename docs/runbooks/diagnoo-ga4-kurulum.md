# Runbook — Diagnoo için GA4 önemli etkinlik ve huni araştırması kurulumu

> **Kime:** Burak · **Süre:** ~10 dakika · **Sıklık:** bir kez (GA4 arayüzünden, koda dokunmadan)
> **Karar dayanağı:** `docs/superpowers/sdd/2026-09-01-diagnoo-faz1/task-16-brief.md` §8 · `docs/12-analytics-measurement.md` §2
> **Önkoşul:** Diagnoo canlıya alınmış ve en az birkaç gerçek tarama/rapor akışı GA4'e olay yazmış olmalı — GA4 arayüzü hiç veri görmediği bir olayı önemli etkinlik olarak işaretlemeyi ya da huniye eklemeyi reddedebilir veya boş gösterir.

Bu belge iki bağımsız GA4 arayüz işlemini anlatır: (1) `tool_report_requested` olayını Diagnoo'ya özgü filtreyle bir **önemli etkinlik** (key event / conversion) işaretlemek, (2) dört adımlı Diagnoo huninin bir **huni araştırması** (funnel exploration) olarak kurmak. İkisi de kod değişikliği gerektirmez — olaylar zaten `src/lib/analytics/ga.ts` üzerinden yazılıyor (bkz. `docs/12-analytics-measurement.md` §2.0 taksonomi tablosu).

---

## Arka plan — neden `slug` filtresi şart

GEO Görünürlük Denetleyicisi ve Diagnoo **aynı beş olay adını** paylaşıyor (`tool_used`, `tool_scan_completed`, `tool_report_requested`, `tool_roadmap_item_expanded`, `tool_service_cta_clicked`) — ikisi de `/araclar` ailesinin bir parçası ve taksonomi kasıtlı olarak tek bir "araç" şemasında tutuluyor (`docs/12-analytics-measurement.md` §2.0, iki tasarım kararı). Her olayın `slug` adlı bir boyutu var: GEO için `geo-gorunurluk-denetleyicisi`, Diagnoo için `diagnoo`.

Sonuç: **`slug` filtresi olmadan** kurduğun her önemli etkinlik veya huni adımı iki aracı birden sayar. Aşağıdaki her adımda filtre satırı bu yüzden var — atlanmaz.

---

## Adım 1 — Özel boyutu doğrula (`slug`)

GA4 → **Yönet** (sol alt dişli) → **Veri görüntüleme** → **Özel tanımlar**.

`slug` adında bir **özel boyut** (event-scoped, kaynak parametresi `slug`) listede olmalı. Yoksa **Özel boyut oluştur** ile ekle:

- **Boyut adı:** `slug`
- **Kapsam:** Etkinlik (Event)
- **Etkinlik parametresi:** `slug`

Yeni oluşturduysan GA4'ün geriye dönük veriyi işlemesi (genelde birkaç saat) beklenmeden bir sonraki adıma geçme — filtre boş görünür.

---

## Adım 2 — `tool_report_requested`'ı önemli etkinlik işaretle (Diagnoo'ya filtreli)

GA4'te önemli etkinlikler **olay adı bazında** açılır, filtre bazında değil — yani `tool_report_requested`'ı GA4'ün "Önemli etkinlik olarak işaretle" anahtarıyla açtığında GEO'nun raporları da sayılır. Diagnoo'yu ayırmak için **ikinci, filtrelenmiş bir olay** türetiliyor.

### 2a. Filtrelenmiş bir olay oluştur

**Yönet** → **Veri görüntüleme** → **Etkinlikler** → **Etkinlik oluştur**.

- **Özel etkinlik adı:** `diagnoo_report_requested`
- **Eşleşme koşulları:**
  - `event_name` **eşittir** `tool_report_requested`
  - `slug` **eşittir** `diagnoo`
- **Parametreleri kopyala:** açık bırak (varsayılan) — `band`, `locale` yeni olaya taşınır.

Kaydet.

### 2b. Önemli etkinlik olarak işaretle

Aynı **Etkinlikler** listesinde yeni satır `diagnoo_report_requested` göründüğünde (birkaç dakika sürebilir, sayfayı yenile), satırın sağındaki **"Önemli etkinlik olarak işaretle"** anahtarını aç.

**Doğrulama:** **Yönet** → **Önemli etkinlikler** listesinde `diagnoo_report_requested` görünmeli. GEO'nun kendi karşılığını istersen aynı desenle (`geo_report_requested`, `slug` **eşittir** `geo-gorunurluk-denetleyicisi`) ayrıca kurabilirsin — bu runbook'un kapsamı yalnız Diagnoo.

---

## Adım 3 — Huni araştırmasını kur

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
- **Açık huni** (open funnel) seç, **kapalı** değil: adım 1'i tamamlayan her ziyaretçi 2'ye giriş adayıdır, aradan girenleri de saymak istiyoruz — Diagnoo'ya doğrudan bir rapor bağlantısıyla gelen (bkz. aşağıdaki not) adım 1'i hiç görmez ama adım 3-4'ü tetikleyebilir.
- **Sonraki adım süresi:** varsayılan (sınırsız) kalsın — tarama 2-4 dakika sürüyor (`tools.ts` SSS metni), kısa bir pencere adım 1→2 geçişini eksik sayar.

Kaydet.

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

## Doğrulama

1. **Etkinlikler** raporunda `diagnoo_report_requested` satırını aç, **Etkinlik sayısı** grafiğinin veri gösterdiğini doğrula (gerçek zamanlı raporda önce görünür, standart raporda 24-48 saat gecikebilir).
2. **Keşfet** → **Diagnoo huni** araştırmasını aç, dört çubuğun (adım 1-4) azalan sırada göründüğünü ve her çubuğun altında `slug: diagnoo` filtresinin uygulandığını doğrula.
3. Gerçek zamanlı raporda (**Raporlar** → **Gerçek zamanlı**) yeni bir tarama başlatıp `tool_used` olayının `slug=diagnoo` ile göründüğünü canlı izle — filtre yanlış kurulduysa burada hemen fark edilir (GEO trafiğiyle karışmış sayaç).

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

   `migrations/0004_diagnoo.sql` (`diagnoo_diagnostics`, `diagnoo_leads` tabloları) bu ana kadar yalnız yerelde uygulandı.

3. **Anahtarları gerçek bir siteyle bir kez uçtan uca doğrula** — Gemini (semantik/vision analiz) ve Firecrawl (yedi sayfa taraması) akışının canlıda gerçekten çalıştığını görmeden sayfa hiçbir yerden linklenmemeli. Bilinen gerçek bir e-ticaret adresiyle (kendi mağazanız veya bir müşteri, izinle) `/tr/araclar/diagnoo`'da tam bir tarama + kilit açma denenir; rapor sayfasında dört boyutun da (mesaj, arayüz, hız, ölçüm) gerçek verilerle dolduğu kontrol edilir.
4. **Bu runbook'taki Adım 1-3'ü GA4 arayüzünde uygula** (özel boyut → önemli etkinlik → huni araştırması).
5. Yukarıdaki dördü tamamlanmadan **Diagnoo ana navigasyona veya başka bir sayfaya link verilmez** — sayfa şu an yalnız doğrudan URL ile erişilebilir durumda kalmalı (Faz 2 planı, ana navigasyon girişini ayrıca ele alacak).
