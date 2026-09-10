# 12 — Analytics ve Ölçüm

> **Amaç:** INDOLES platformunun ürün analitiği, event taksonomisi, KPI tanımları ve dashboard stratejisini sabitlemek.
>
> **Bağlı belgeler:** `11-funnel-customer-flows.md`, `05-tech-architecture.md` §4.11.
> **Ana araç:** Google Analytics 4.

> **Doğrulama notu (2026-08-24, ADR-021):** PostHog **kaldırıldı**; site tek
> ölçüm sağlayıcıya (GA4) indi. Belgedeki **event taksonomisi ve KPI tanımları
> geçerlidir** — sağlayıcıdan bağımsızdır. Sağlayıcıya özgü bölümler (session
> replay, feature flag, `posthog-js` Web Vitals, `posthog-node` sunucu event'i)
> **uygulanmamıştır** ve yalnız tarihsel bağlam için duruyor. Uygulamadaki
> karşılıkları: `src/lib/analytics/ga.ts` (olay yazımı), `src/lib/analytics/events.ts`
> (tipli taksonomi), `src/app/layout.tsx` (gtag yüklemesi).
>
> **§9 (KVKK ve Veri Koruma) 2026-08-24'te yeniden yazıldı ve uygulamayla
> birebir günceldir.** §6 (dashboard), §7 (feature flag), §8 (A/B test) ve
> §10 (entegrasyonlar) hâlâ PostHog dönemine aittir — uygulanmamıştır.

---

## 1. Temel Kararlar

| Alan | Karar | Gerekçe |
|---|---|---|
| Ürün analitiği | **Google Analytics 4** | Tek sağlayıcı; ADR-021 |
| GA4 taşıyıcısı | **GTM** (`GTM-TFKLN9V`) | Sitedeki `gtag/js` etiketi bu ölçüm kimliği için 404 dönüyordu; GA4 fiilen zaten GTM üzerinden ölçüyordu. ADR-034 |
| PostHog | **Kullanılmayacak** | İki SDK paralel taşımanın bedeli (istemci bundle + ikinci veri işleyici) karşılığını vermedi; ADR-021 |
| Microsoft Clarity | **Kullanılmayacak** | Üçüncü bir ölçüm sağlayıcısı eklenmiyor |
| Session replay | **Yok** | Sağlayıcıyla birlikte kalktı; KVKK yüzeyi daraldı |
| Feature flags | **Yok** | İhtiyaç doğduğunda ayrı karar |
| Web Vitals | Vercel Speed Insights | Zaten kurulu; ayrı RUM SDK'sı eklenmiyor |
| Sunucu tarafı event | **Yok** | Dönüşüm olayları istemcide GA4'e yazılır (`ContactForm`, `EntryPopup`); lead detayı e-posta bildirimiyle taşınır |
| Identification | **Yok** | Clerk kaldırıldı (ADR-008); GA4 olayları kişi kimliği taşımaz (ADR-021) |
| Cookies | Bölgesel opt-in — EEA + UK'de onay, diğer bölgelerde varsayılan açık | Consent Mode v2 ile uygulandı; **güncel mimari §9'da** |

---

## 2. Event Taksonomisi

Event isimleri `snake_case`, **objeden fiile** formatında: `{object}_{verb}` (ör. `brief_submitted`, `chatbot_opened`). Properties camelCase.

> Bu kural artık teste bağlı: `EVENT_NAMES` çalışma zamanında bir değer
> olarak duruyor ve `src/lib/analytics/__tests__/events.test.ts` her adın
> snake_case, ≤40 karakter ve `{obje}_{fiil}` biçiminde olduğunu doğruluyor.
> Birleşim tipiyle listenin uyumunu derleyici kontrol ediyor.

### 2.0 Uygulanan olaylar (2026-08-24)

Aşağıdaki §2.1-2.5 tabloları **tasarım kapsamıdır**; bir kısmı hiç var olmayan
özelliklere (brief akışı, checkout, teşhis araçları) aitti ve olduğu gibi
duruyor. Bugün fiilen GA4'e yazılan olaylar bunlar:

| Olay | Nereden | Boyutlar |
|---|---|---|
| `page_view` | **GTM `GA4 - Sayfa Goruntuleme`** — All Pages + History Change (ADR-037) | Yol, başlık, dil (otomatik) |
| `service_viewed` | `service-detail.tsx` → `TrackView` | `slug` (TR), `pillar`, `locale` |
| `pillar_viewed` | `pillar-detail.tsx` → `TrackView` | `pillar`, `locale` |
| `package_viewed` | `paketler/[slug]` → `TrackView` | `packageSlug`, `pillar`, `price`, `currency` |
| `case_study_viewed` | `vakalar/[slug]` → `TrackView` | `slug`, `problemType`, `pillar` |
| `faq_opened` | `faq-accordion.tsx` | `surface`, `question` (≤100 kr.) |
| `persona_axis_clicked` | `persona-switch.tsx` | `axis` |
| `booking_cta_clicked` | `popup-context.tsx` → `openPopup` | `source`, `pillar?` |
| `contact_form_submitted` | `ContactForm.tsx` | `subject`, `budget_range`, `timeline`, `locale` |
| `contact_booking_submitted` | `ContactBookingScreen.tsx` | `briefId`, `locale`, `preferred_slot` — `/iletisim` randevusu (ADR-034) |
| 8 popup olayı | `entry-popup/EntryPopup.tsx` | `popup_shown`, `popup_stage1_selected`, `popup_stage2_submitted`, `popup_stage3_viewed`, `popup_booking_submitted`, `popup_contact_submitted`, `popup_kvkk_consent_given`, `popup_dismissed` |
| `tool_used` | `components/tools/geo-tool.tsx`, `components/tools/diagnoo-form.tsx` | `slug`, `locale` — tarama başlatıldı (yanıt beklenmeden) |
| `tool_scan_completed` | `components/tools/geo-tool.tsx`, `components/tools/diagnoo-snapshot.tsx` | `slug`, `band`, `locale` — tarama skorla tamamlandı |
| `tool_report_requested` | `components/tools/report-gate.tsx`, `components/tools/diagnoo-unlock-form.tsx` | `slug`, `band`, `locale` — detaylı rapor isteği (e-posta + KVKK rızası) başarıyla gönderildi |
| `tool_roadmap_item_expanded` | `components/tools/diagnoo-report.tsx` | `slug`, `category`, `locale` — yol haritasındaki bir başlık açıldı |
| `tool_service_cta_clicked` | `components/tools/diagnoo-report.tsx` | `slug`, `target_service`, `locale` — rapor içi hizmet linki tıklandı |

**İki tasarım kararı:**

1. **Kimlik her zaman TR slug'ı.** Hizmet ve paket slug'ları dile göre
   ayrışıyor; olayda `slug.en` gönderilseydi aynı varlık GA4'te iki satıra
   bölünür ve hizmet bazlı toplam okunamazdı. Dil ayrı boyut olarak taşınır.
   Eşleme `src/lib/analytics/view-events.ts`'te saf fonksiyonlarda ve testli
   — sayfalar RSC olduğu için JSX içinde test edilemezdi.
2. **CTA olayı tek noktadan.** Görüşme CTA'sını açan tek yol `openPopup`;
   olay orada yazılır, yani atlanması imkânsız. `source` zorunlu ve kapalı
   birleşim (`BookingCtaSource`) — yeni bir CTA adsız eklenemez, derlenmez.

**Gelişmiş ölçüm ÇALIŞMIYOR (ADR-037).** `scroll`, `click` (outbound),
`file_download`, `view_search_results` ve `form_start`/`form_submit` hiç
gelmiyor: hepsi Google etiketinin çekirdeğine bağlı ve
`gtag/js?id=G-HC44KJ9ZP4` **404 veriyor**, yani çekirdek hiç kurulmuyor.
Sayfa %100 kaydırılıp ölçüldü, `scroll` üretilmedi (2026-09-10).

`page_view` bu yüzden açık bir GTM olay etiketine alındı. Geri kalanı aynı
yolla çözülebilir ama her biri kendi GTM tetikleyicisini (Scroll Depth, Just
Links, Element Visibility) ister — ayrı bir iş olarak duruyor. Gerçek çözüm
404'ü kapatmak: yeni bir veri akışının ölçüm kimliği `gtag/js`ten servis
ediliyorsa mevcut akış bozuk demektir.

**Bilinçli eksik:** `article_viewed`. `page_view` yazının görüntülendiğini
zaten söylüyor; eklenecek tek boyut ADR-021 konu etiketi olurdu ve içerik
motoru (strateji §4) başlamadan okunacak veri üretmiyor. Dalga 8'de eklenir.

**Meta'ya hangi olay hangi yoldan gider** (ADR-036):

| Meta olayı | Kaynak olaylar | Yol |
|---|---|---|
| `ViewContent` | `service_viewed`, `package_viewed`, `case_study_viewed`, `tool_scan_completed` | Tarayıcı Pixel + sunucu kopyası |
| `Lead` | `contact_form_submitted`, `contact_booking_submitted`, `popup_booking_submitted`, `popup_contact_submitted`, `tool_report_requested` | **Yalnız sunucu** — form handler'ı (`meta-lead.ts`) |

Meta çağrısının tek kapısı `gaEvent` (ADR-036). Önceden `track()` içindeydi ve
`gaEvent` ile atılan üç dönüşüm Meta'ya **hiç ulaşmıyordu**. Yeni bir Meta
dönüşümü eklerken `LEAD_EVENTS` listesi tek başına yetmez — ilgili handler'a
`sendMetaLead` çağrısı da eklenmeli, yoksa olay yine kaybolur.

**GTM'e ait olanlar** (kodda olay tanımlanmaz, ADR-034):

| Olay | Tetikleyici | Boyutlar |
|---|---|---|
| `phone_clicked` | `Click - Telefon Baglantisi` (Click URL ⊃ `tel:`) | `source` = `tel-link` |
| `email_clicked` | `Click - E-posta Baglantisi` (Click URL ⊃ `mailto:`) | `source` = `mailto-link` |

Bu ikisi köprü tetikleyicisinin regex'ine **bilerek eklenmedi** — kendi GA4
etiketleri var, eklenirlerse çift sayılırlar.

### 2.1 Sayfa ve navigasyon

| Event | Properties | Ne zaman |
|---|---|---|
| `page_view` | GA4 Enhanced Measurement | Her sayfa yüklenmesinde |
| ~~`homepage_hero_viewed`~~ | — | **Taksonomiden çıkarıldı (2026-08-27).** Hiç çağrılmıyordu; ana sayfa görüntülemesi `page_view` ile zaten ölçülüyor, ayrı hero olayı yeni boyut üretmiyordu. Hero'nun viewport'a girme anı ölçülmek istenirse yeniden tanımlanır. |
| `persona_axis_clicked` | `axis: "industrial" \| "commerce"` | Anasayfada eksen CTA |
| `pillar_viewed` | `pillar`, `locale` | Pillar sayfası görüntülenince |
| `service_viewed` | `slug`, `pillar`, `locale` | Hizmet detay sayfası |
| `faq_opened` | `surface`, `question` | Bir SSS sorusu açılınca |
| `package_viewed` | `packageSlug`, `pillar`, `price`, `currency` | Paket detay |
| `case_study_viewed` | `slug`, `problemType`, `pillar` | Case study detay |
| `article_viewed` | `slug`, `category`, `readingTime` | Blog yazısı |
| `consultant_profile_viewed` | `slug` | Danışman profil |
| `locale_switched` | `from`, `to` | Dil değişimi |

### 2.2 Funnel event'leri

| Event | Properties | Ne zaman |
|---|---|---|
| `cta_clicked` | `ctaId`, `label`, `page`, `position` | Tüm önemli CTA'lar |
| `booking_cta_clicked` | `source`, `pillar` | Rezervasyon CTA |
| `booking_started` | `source`, `pillar` | Cal.com embed açılınca |
| `booking_slot_selected` | `consultantSlug`, `slotStart` | Slot seçimi |
| `booking_confirmed` | `bookingId`, `consultantSlug`, `packageId?` | Webhook sonrası |
| `booking_cancelled` | `bookingId`, `reason?` | İptal |
| `brief_started` | `source` | `/app/brief/yeni` açılışı |
| `brief_step_completed` | `step: 1\|2\|3\|4` | Her step submit |
| `brief_submitted` | `briefId`, `pillar`, `budget`, `timeline` | Final submit |
| `brief_abandoned` | `step`, `timeSpent` | Exit sırasında |
| `checkout_started` | `packageId`, `provider`, `currency` | Stripe/iyzico redirect öncesi |
| `checkout_completed` | `packageId`, `amount`, `currency`, `provider` | Webhook sonrası |
| `checkout_failed` | `packageId`, `error` | — |
| `diagnostic_started` | `tool: "readiness" \| "growth_opportunity"` | Teşhis aracı |
| `diagnostic_completed` | `tool`, `score`, `persona` | Teşhis sonucu |

### 2.3 AI agent event'leri

| Event | Properties | Ne zaman |
|---|---|---|
| `chatbot_opened` | `page`, `persona` | Widget açılışı |
| `chatbot_closed` | `messageCount`, `durationSec` | Kapanış |
| `chatbot_message_sent` | `role: "user"\|"assistant"`, `conversationId`, `persona` | Her mesaj |
| `chatbot_tool_invoked` | `toolName`, `durationMs`, `success` | Tool call |
| `chatbot_escalated` | `reason`, `conversationId` | Escalation |
| `chatbot_brief_draft_created` | `conversationId` | Draft oluşturma |
| `chatbot_booking_suggested` | `conversationId`, `consultantSlug` | Randevu önerisi |
| `chatbot_cta_clicked` | `ctaType`, `conversationId` | Chatbot içi CTA |
| `chatbot_feedback_given` | `rating: 1-5`, `conversationId` | Emoji rating |

### 2.4 Auth event'leri

| Event | Properties | Ne zaman |
|---|---|---|
| `auth_sign_up_started` | `method` | Signup başlangıç |
| `auth_sign_up_completed` | `method`, `userId` | Başarılı signup |
| `auth_sign_in_completed` | `method`, `userId` | Başarılı login |
| `auth_sign_out` | — | Logout |
| `auth_account_deleted` | — | Hesap silme |

### 2.5 Engagement ve retention

| Event | Properties | Ne zaman |
|---|---|---|
| `content_scrolled_75` | `page`, `contentType` | Scroll depth >= 75% |
| `content_scrolled_100` | `page`, `contentType` | Scroll depth = 100% |
| `external_link_clicked` | `href`, `source` | Dış linkler (LinkedIn, case study source) |
| `email_clicked` | `source` (transactional email içi link tracking) | Resend URL tagging |
| `newsletter_subscribed` | `locale` | Newsletter form (v2) |

### 2.6 Server-side event'ler

Kritik iş event'leri client tarafından tetiklenemez; tRPC procedure içinden `posthog-node` ile:

| Event | Properties | Nerede |
|---|---|---|
| `brief_created_server` | `briefId`, `userId`, `pillar` | `brief.create` procedure |
| `booking_created_server` | `bookingId`, `userId` | `/api/webhooks/cal` |
| `payment_succeeded_server` | `paymentId`, `amount`, `currency` | `/api/webhooks/stripe`, `/api/webhooks/iyzico` |
| `payment_failed_server` | `paymentId`, `error` | Webhook |

Client-side event'e denk server-side event var — discrepancy alarm (attribution doğrulama).

---

### 2.7 Parametre kaydı — `EVENT_PARAM_NAMES`

`dataLayer`a yazılabilen her parametre adı `src/lib/analytics/events.ts`
içindeki `EVENT_PARAM_NAMES` listesinde durur. Liste üç yeri birden bağlar:

1. **Sızıntı kalkanı.** `gaEvent` her olayda listedeki tüm adları önce
   `undefined` yazar. GTM'in Data Layer Variable'ları push'lar arası kalıcı
   olduğu için bu olmadan her olay öncekinin parametrelerini miras alıyordu
   (ADR-034; canlı doğrulamada `pillar_viewed` olayı `ep.slug=cro` taşıdı).
2. **Derleme kilidi.** `EventParams` tipi bu listeye bağlı; kayıtsız bir ad
   derleme hatası verir. `PopupEventMap` için ayrı bir derleme zamanı iddiası
   var (`lib/popup/analytics.ts`). Kayıtsız ad iki sessiz hata birden üretir:
   sızar **ve** GA4'te özel boyutu olmadığı için raporda hiç görünmez —
   `preferred_slot` tam olarak böyle kaçmıştı.
3. **GTM sözleşmesi.** Konteynerdeki `GA4 - Olay Koprusu` etiketinin parametre
   tablosu bu listeyle **birebir aynı** olmalı. Listede olup GTM'de olmayan
   parametre GA4'e hiç ulaşmaz.

Yeni parametre eklerken sıra: `EVENT_PARAM_NAMES` → GTM'de `dlv - <ad>`
değişkeni + köprü etiketine satır → GA4'te özel boyut.

### 2.8 Dönüşümler (GA4 anahtar olayları) ve Google Ads

Tek kaynak: `SITE_KEY_EVENTS` (`src/lib/analytics/ga4-admin.ts`). `pnpm ga4:setup`
listeyi idempotent uygular, Google Ads de bu listeyi GA4'ten içe aktarır — yani
liste hem GA4 hem Ads tarafını belirliyor.

| Dönüşüm | Yüzey | Sayım |
|---|---|---|
| `contact_form_submitted` | `/iletisim` formu | `ONCE_PER_SESSION` |
| `contact_booking_submitted` | `/iletisim` gömülü randevu | `ONCE_PER_SESSION` |
| `popup_booking_submitted` | Giriş popup'ı — randevu | `ONCE_PER_SESSION` |
| `popup_contact_submitted` | Giriş popup'ı — mesaj | `ONCE_PER_SESSION` |
| `tool_report_requested` | GEO + Diagnoo rapor kilidi | `ONCE_PER_SESSION` |
| `phone_clicked` | `tel:` tıklaması (GTM) | `ONCE_PER_SESSION` |
| `email_clicked` | `mailto:` tıklaması (GTM) | `ONCE_PER_SESSION` |

**KURAL: her lead yüzeyi tam olarak bir dönüşüm üretir.** Aynı eylemden iki
anahtar olay çıkarsa dönüşüm iki kez sayılır ve reklam teklifi bozulur. Bu
yüzden listede olmayan dördü bilinçli:

- `brief_submitted` — popup ve iletişim randevusu ikisi de yazıyor; yüzeye
  özgü dönüşümler zaten sayılıyor. Yüzeyler arası **huni adımı** olarak durur.
- `tool_used` / `tool_scan_completed` — araç **kullanımı** dönüşüm değil, huni
  adımı. Dönüşüm e-posta bırakıldığı an (Burak kararı, 2026-09-09).
- `diagnoo_report_requested` — `tool_report_requested`ten türetiliyor
  (`DIAGNOO_EVENT_CREATE_RULE_BASE`); ikisi de anahtar olsaydı bir Diagnoo
  raporu iki dönüşüm sayardı. Türetilmiş olay raporlamada durur, dönüşüm olarak
  sayılmaz.
- `purchase` — GA4'ün **silinemeyen** varsayılan anahtar olayı (Admin API
  `"The event cannot be deleted."` döner). Sitede e-ticaret yok, hiç emit
  edilmiyor, dolayısıyla 0 dönüşüm katkısı var. Görmezden gelin.

`ONCE_PER_SESSION` gerekçesi: aynı ziyaretçinin aynı oturumda formu iki kez
göndermesi iki lead değil. `tool_report_requested` iki farklı araç için
istenirse ayrımı `slug` boyutu zaten taşıyor.

**Google Ads.** GA4 mülkü Ads hesabı `3719440582` ile bağlı (2026-09-08).
Dönüşümler GTM'de etiketle değil, **GA4'ten içe aktarılarak** kurulur (Burak
kararı, 2026-09-09): Ads arayüzünde *Hedefler → Dönüşümler → Yeni → Google
Analytics 4* ile yukarıdaki yedi olay seçilir. Böylece dönüşüm tanımı tek yerde
kalır ve GTM'de `conversionId`/`conversionLabel` taşımak gerekmez. Konteynerde
`Dönüşüm Bağlayıcı` aktif; dört lead tetikleyicisi (`22`–`25`) ve pazarlama
rızası tetikleyicisi (`30`) ileride etiket gerekirse hazır bekliyor.

Eski `Ads - Dönüşüm - İletişim Formu` etiketi ADR-034 ile silindi: WordPress
CF7 tetikleyicisine bağlıydı **ve** yanlış Ads hesabına (`585141919`) yazıyordu.

---

## 3. Event Properties (Global)

Her event'e otomatik eklenen properties (PostHog super properties):

```typescript
{
  locale: "tr" | "en",
  persona: "industrial" | "commerce" | "unknown",
  userRole: "guest" | "user" | "consultant" | "admin",
  appVersion: string,      // git SHA
  stage: "production" | "preview" | "development",
  device: "mobile" | "tablet" | "desktop",
  sessionId: string,
}
```

Identification: Kullanıcı login olunca `posthog.identify(userId, traits)`; traits: `email`, `role`, `locale`, `createdAt`.

---

## 4. Property Contract (`src/lib/analytics/events.ts`)

Typed event definitions — event adı ve properties TypeScript'te sabit, yanlış event gönderme imkansız.

> **Güncel durum (2026-08-27):** Bu bölüm özgün tasarım taslağıdır; uygulanan hâli `src/lib/analytics/events.ts`'tedir ve iki noktada ayrışır. (1) `homepage_hero_viewed` taksonomiden çıkarıldı. (2) `brief_submitted` **bağlandı** — `EntryPopup`'ta `/api/visitor-profile` başarıyla döndükten sonra tetikleniyor; payload yalnız `briefId` taşıyor. `pillar`/`budget`/`timeline` opsiyonele çevrildi çünkü launch kapsamındaki tek lead formu bu verileri sormuyor (§2.0'ın "brief wizard" notu — o akış hiç yapılmadı); uydurma değer basmak yerine alanlar boş bırakılıyor. Çift gönderim mimari olarak engelli: olay render'a değil, submit handler'ına bağlı — testle doğrulandı.

```typescript
// Simplified
export const events = {
  brief_submitted: (p: { briefId: string; pillar?: Pillar; budget?: Budget; timeline?: Timeline }) =>
    ({ name: "brief_submitted", properties: p }),
  chatbot_message_sent: (p: { role: "user" | "assistant"; conversationId: string; persona: Persona }) =>
    ({ name: "chatbot_message_sent", properties: p }),
  // ... diğer event'ler
} as const;

export function track<K extends keyof typeof events>(
  event: K,
  properties: Parameters<typeof events[K]>[0]
) {
  const { name, properties: props } = events[event](properties);
  posthog.capture(name, props);
}
```

Helper `src/lib/analytics/posthog.ts`: client + server initialize, `track()` wrapper.

---

## 5. KPI ve OKR

### 5.1 Kuzey Yıldız (North Star)

**Haftalık yeni qualified lead** = (yeni brief submitted) + (yeni booking confirmed) — yeni kullanıcıya bölünmüş.

Hedef: Launch sonrası 3. ay itibariyle haftada 15+ qualified lead.

### 5.2 Funnel KPI

| KPI | Tanım | Hedef |
|---|---|---|
| Homepage bounce rate | Sadece homepage, tek sayfa ziyaret | < %45 |
| Homepage → pillar conversion | `pillar_viewed` / `$pageview(homepage)` | > %35 |
| Pillar → paket conversion | `package_viewed` / `pillar_viewed` | > %25 |
| Paket → checkout | `checkout_started` / `package_viewed` | > %12 |
| Checkout completion | `checkout_completed` / `checkout_started` | > %75 |
| Chatbot engagement rate | `chatbot_opened` / `$pageview` | > %8 |
| Chatbot → qualified action | (`booking_started` \| `brief_started` chatbot origin) / `chatbot_opened` | > %20 |
| Brief form completion | `brief_submitted` / `brief_started` | > %55 |
| Booking completion | `booking_confirmed` / `booking_started` | > %70 |
| Persona identification rate | `persona ≠ unknown` at session end | > %60 |

### 5.3 Content KPI

| KPI | Tanım | Hedef |
|---|---|---|
| Case study avg reading time | Scroll + time on page | > 2 dk |
| Article completion rate | `content_scrolled_100` / `article_viewed` | > %30 |
| Case study → booking attribution | Session içinde case_study_viewed → booking_confirmed | > %5 |

### 5.4 AI agent KPI

| KPI | Tanım | Hedef |
|---|---|---|
| Mesaj/sohbet ortalaması | `chatbot_message_sent` / `chatbot_opened` | 4-8 (çok az → engagement yok, çok çok → agent yetersiz) |
| Tool success rate | tool_invoked success / total | > %98 |
| Escalation rate | `chatbot_escalated` / conversations | < %15 |
| Response time (p95) | Agent'ın ilk token'a gelişi | < 3s |
| Feedback score avg | `chatbot_feedback_given` ortalama | > 4.2/5 |
| Conversation → conversion | chatbot → (booking ∨ brief) | > %15 |

### 5.5 Performans KPI (Web Vitals)

| Metrik | Hedef p75 | Alarm |
|---|---|---|
| LCP | < 1.8s | > 2.5s |
| INP | < 150ms | > 200ms |
| CLS | < 0.05 | > 0.1 |
| TTFB | < 600ms | > 1s |

PostHog Web Vitals integration + Sentry Performance overlap.

---

## 6. Dashboard Stratejisi

### 6.1 PostHog Dashboard'ları (her biri ayrı tab)

**Dashboard 1: Overview**
- Daily active users (DAU), weekly active (WAU), monthly (MAU)
- Top 10 pages
- Device + locale breakdown
- Persona breakdown

**Dashboard 2: Acquisition Funnel**
- Homepage → pillar → paket → checkout completion funnel
- Traffic source breakdown (direct, organic, referral, social)
- Top landing pages
- SEO keyword landing (Search Console integration)

**Dashboard 3: Engagement**
- Scroll depth dağılımı
- Session duration dağılımı
- Content reading rates
- Chatbot engagement trends

**Dashboard 4: Conversion**
- Brief submission funnel (step by step)
- Booking funnel
- Payment funnel
- Chatbot → conversion attribution

**Dashboard 5: AI Agent**
- Conversations/day
- Messages/conversation dağılımı
- Tool usage breakdown
- Escalation reasons
- Response time trend
- Feedback score trend

**Dashboard 6: Product Health**
- Web Vitals (LCP, INP, CLS) p75
- Error rate (Sentry integration)
- 404 pages
- Failed payments
- Webhook failures

**Dashboard 7: Content Performance**
- Top case studies (views, conversion)
- Top articles
- Top pillars
- Problem-type conversion rates

### 6.2 Admin-facing dashboard (`/admin/analytics`)

PostHog ≠ internal dashboard. Admin panelde light-weight özet (Burak + future ops):
- Bu haftaki yeni brief'ler
- Bu haftaki yeni booking'ler
- Pending triage kuyruk uzunluğu
- Son 7 gün revenue (Stripe + iyzico)
- Chatbot bugünkü sohbet sayısı

Bu Neon query'leri ile direkt render edilir (PostHog embed değil, iç data).

---

## 7. Feature Flag Stratejisi

PostHog flags ile:

| Flag | Amaç | Default |
|---|---|---|
| `enable_chatbot` | Acil kill switch | `true` |
| `enable_diagnostic_tool` | Yeni teşhis aracı rollout | `false` (beta users) |
| `new_homepage_hero_variant` | A/B test | %50 rollout |
| `enable_iyzico_checkout` | iyzico güvenilirse açık kal | `true` |
| `enable_ai_brief_suggestion` | Agent'ın brief önerisi | `true` |
| `show_testimonials_on_pillar` | Pillar sayfasında testimonial section | `true` |

**Kural:** Her yeni kullanıcı-facing özellik feature flag arkasında çıkar; %100'e eriştikten 2 hafta sonra flag kaldırılır (code cleanup).

---

## 8. A/B Test Stratejisi

PostHog experiments ile. Launch sonrası 3 ay içinde minimum 5 A/B test:

1. **Hero copy — sanayi persona için:** "Dijital dönüşüm" vs "Teknoloji dönüşümü"
2. **Paket fiyat görünümü:** Net fiyat vs "Fiyat talep et"
3. **Chatbot açılış tonu:** "Size" vs "Sana" (persona öncesi)
4. **Booking CTA label:** "Görüşme rezerve et" vs "Ücretsiz danışmanlık al"
5. **Case study order:** Sektör-bazlı vs problem-tipi bazlı

Her test: minimum 2 hafta çalıştır, minimum 100 conversion/varyant, p-value < 0.05 kazanan.

---

## 9. KVKK ve Veri Koruma

> **Güncelleme (2026-08-24):** Bu bölüm PostHog dönemine ait yazılmıştı ve
> ADR-021'den (PostHog kaldırıldı, GA4 tek sağlayıcı) sonra geçersiz kalmıştı.
> Session replay, Clerk session cookie ve PostHog saklama ayarlarına yapılan
> atıflar kaldırıldı; yerine uygulanan Consent Mode v2 mimarisi yazıldı.

### 9.1 Onay mimarisi — bölgesel Consent Mode v2

> **Güncelleme (2026-09-08, ADR-033):** Google Ads ve Meta devreye girdi.
> Onay artık tek boyutlu değil, iki kategorili: `{ analytics, marketing }`.
> Üç reklam sinyali (`ad_storage`, `ad_user_data`, `ad_personalization`)
> tek `marketing` kararına bağlı ve varsayılanları `denied` — artık "hiç
> kullanılmıyor" olduğu için değil, opt-in olduğu için. Şerit her bölgede
> gösteriliyor; bölge yalnız neyin sorulduğunu belirliyor (EEA'da analitik
> de sorulur, diğer bölgelerde yalnız pazarlama). Aşağıdaki bölgesel karar
> analitik için geçerliliğini koruyor.
>
> GTM (`GTM-TFKLN9V`) yalnız Meta Pixel ve Google Ads etiketlerini taşır;
> GA4 doğrudan `gtag` ile ölçülmeye devam eder (ADR-021 ölçüm için korunur).
> GA4 özel boyutları GTM'den tanımlanamaz — mülk yetkisi gerektirir.

Karar bölgesel: analitik çerezleri **EEA + Birleşik Krallık** ziyaretçileri
için opt-in, diğer bölgelerde varsayılan açık (`docs/14` §3). Türkiye birincil
pazar; oradaki ölçümün tamamını görebilmek organik büyüme işlerinin etkisini
değerlendirmenin önkoşulu.

| Katman | Dosya | İş |
|---|---|---|
| Bölge listesi | `src/lib/consent/region.ts` | EEA 30 + GB = 31 ülke. Hem `gtag` `region` parametresini hem banner görünürlüğünü besleyen **tek kaynak** |
| Açılış script'i | `src/lib/analytics/ga-bootstrap.ts` | İki `consent default` (bölgesel `denied`, genel `granted`) → `js` → `config` |
| Bölge işareti | `src/lib/consent/middleware.ts` | `x-vercel-ip-country` → `indoles_region` çerezi |
| Şerit | `src/components/marketing/consent-banner.tsx` | TR/EN, `role="region"`, iki eşit düğme |
| Karar | `src/lib/consent/apply.ts` | `gtag('consent','update',{analytics_storage})` |
| Popup kapısı | `src/lib/consent/gate.ts` | Şerit açıkken giriş popup'ı tetiklenmez |

**Sıra kritik:** `consent default` komutları `gtag('config')`ten **önce**
basılmalı. Sıra bozulursa hata çıkmaz, yalnız EEA ziyaretçisinin ilk
`page_view`i onaysız gider — sessiz uyum hatası. Bu yüzden sıra testle
korunuyor (`src/lib/analytics/__tests__/ga-bootstrap.test.ts`): test script'i
gerçekten çalıştırıp `dataLayer` sırasını doğruluyor.

**Reklam sinyalleri her bölgede `denied`.** Consent Mode v2 dört sinyalin de
bildirilmesini istiyor, ama INDOLES bu site üzerinden Google reklam ürünü
kullanmıyor — `ad_storage`, `ad_user_data`, `ad_personalization` açılmıyor ve
onay da istenmiyor. Şeritteki "reklam takibi yapmıyoruz" cümlesi bu yüzden
kodla doğrulanabilir bir iddia (`docs/04` §10).

**Başarısızlık yönü güvenli.** Coğrafi başlık yoksa bölge `other` yazılır ve
şerit çıkmaz; ama `gtag`in kendi `region` varsayılanı Google tarafında IP'ye
baktığı için EEA ziyaretçisinin analitiği yine açılmaz. Yani hata durumunda
fazla değil, **az** ölçüyoruz.

### 9.2 Çerezler

| Çerez | Tür | Süre | Onay gerekir mi |
|---|---|---|---|
| `indoles_persona` | Functional — okuma merceği tercihi | 6 ay | Hayır |
| `indoles_popup_state` | Functional — giriş popup'ı funnel durumu | 30 gün / 6 ay | Hayır |
| `indoles_region` | Functional — onay şeridinin bölge işareti | Oturum | Hayır |
| `indoles_consent` | Functional — verilen kararın kaydı | 12 ay | Hayır (kararın kendisi) |
| `_ga`, `_ga_*` | Analitik — GA4 | GA4 varsayılanı | **Evet (EEA/UK)** |
| `_fbp`, `_fbc` | Pazarlama — Meta Pixel'in kendi çerezleri | 90 gün | **Evet** |
| `indoles_vid` | Pazarlama — kalıcı ziyaretçi kimliği, Meta'ya `external_id` (ADR-036) | 12 ay | **Evet** |
| `indoles_fbclid` | Pazarlama — reklam tıklama kimliği, `fbc` bundan kurulur (ADR-036) | 90 gün | **Evet** |

`indoles_vid` ve `indoles_fbclid` **yalnız pazarlama rızası varken** yazılır
(`loadMetaPixel` → `ensureMarketingIdentifiers`); ikisi de pseudonim
tanımlayıcı, yani kişisel veri. Gerekçeleri ve neden Meta'nın `_fbc` çerezine
yazmadığımız `docs/14` §3a'da.

Onay 12 ay sonra yeniden sorulur; EDPB rehberi süresiz onay beklemiyor.
Ret de kaydedilir — kaydedilmezse "hayır" demek her sayfada tekrar sorulmak
anlamına gelirdi.

### 9.3 Veri saklama

- Olay verisi: GA4 saklama ayarı 14 ay (veri sorumlusu Google Ireland Ltd.).
- Session replay **yok** — böyle bir araç kullanılmıyor.
- Kişiye bağlanabilir kayıt **yok**: ADR-021 ile sunucu tarafı `identify()`
  kaldırıldı, GA4 olayları kimlik taşımıyor. Silme talebi mail arşivinde
  karşılanır (`docs/14` §4).

### 9.4 IP anonimleştirme

GA4'te IP anonimleştirme varsayılan ve kapatılamaz; ayrıca ayar gerekmez.

---

## 10. Integrations

### 10.1 Sentry + PostHog
- Sentry error capture → PostHog event olarak da tetiklenir (`error_occurred` property: `errorType`, `page`).
- Session replay: bir hata olduğunda ilgili session replay link'i.

### 10.2 Search Console + PostHog
- GSC'den query data manuel çekilir (v1). v2: auto export S3 → PostHog import.

### 10.3 Resend → PostHog
- Email open, click tracking Resend tarafında; haftalık digest ile PostHog'a import (v2).

### 10.4 Inngest → PostHog
- Inngest fonksiyonlarında kritik event'ler server-side capture.

---

## 11. Launch Checklist (Analytics Hazırlık)

- [ ] PostHog project oluştur (EU cloud)
- [ ] Typed event contract (`lib/analytics/events.ts`) yaz
- [ ] Client wrapper (`lib/analytics/posthog.ts`) implement
- [ ] Server wrapper (tRPC middleware auto-track)
- [ ] Homepage → pillar → paket → checkout funnel PostHog'ta tanımla
- [ ] AI agent funnel tanımla
- [ ] Core Web Vitals tracking açık
- [ ] Cookie banner implement
- [ ] Dashboard 1-7 oluştur
- [ ] Kritik alarmlar (escalation rate, error rate, LCP) Slack/email hook
- [ ] Feature flag default'ları set
- [ ] Session replay masking test
- [ ] İlk A/B test launch gününde hazır (hero variant)

---

## 12. Açık Sorular

| # | Soru | Önerilen v1 cevabı | Ne zaman |
|---|---|---|---|
| 1 | Server-side analytics için ayrı PostHog project mi? | Hayır, tek project + `stage` property | — |
| 2 | Revenue attribution — first-touch mi last-touch mi? | Last-touch (v1), cohort için first-touch ayrı rapor | v2 |
| 3 | Chatbot conversation sentiment analysis | v2 — Gemini ile post-process | — |
| 4 | Mobile app analytics (v2 mobil'de) | Aynı PostHog, SDK farklı | — |
| 5 | Admin dashboard widget'ları live DB query mi PostHog mu? | DB query (tax-reported olan veriler), PostHog (engagement) | — |
| 6 | Export için raw data warehouse (BigQuery, Snowflake)? | Hayır (v1), sonra gerekirse PostHog export | Data hacmi 1M event/ay üstüne çıktığında |
