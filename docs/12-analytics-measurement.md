# 12 — Analytics ve Ölçüm

> **Amaç:** INDOLES platformunun ürün analitiği, event taksonomisi, KPI tanımları ve dashboard stratejisini sabitlemek.
>
> **Bağlı belgeler:** `11-funnel-customer-flows.md`, `05-tech-architecture.md` §4.11.
> **Ana araç:** PostHog (EU Cloud).

---

## 1. Temel Kararlar

| Alan | Karar | Gerekçe |
|---|---|---|
| Ürün analitiği | PostHog (EU Cloud) | Open source, self-serve, EU data residency, feature flags dahil |
| GA4 | **Kullanılmayacak** | PostHog yeter; veri saçılması istemiyoruz |
| Microsoft Clarity | **Kullanılmayacak** | PostHog session replay yeterli |
| Session replay | PostHog (opt-in, maskeli) | KVKK uyumu için sensitive mask |
| Feature flags | PostHog flags | Ayrı araç eklemeyiz |
| Web Vitals | PostHog `posthog-js/lib/web-vitals` | RUM native |
| Sunucu tarafı event | PostHog Node (`posthog-node`) | tRPC procedure'larında ölçüm |
| Identification | Clerk userId ile identify | Anonim → user birleşimi |
| Cookies | Opt-in (EEA için zorunlu) | KVKK compliance |

---

## 2. Event Taksonomisi

Event isimleri `snake_case`, **objeden fiile** formatında: `{object}_{verb}` (ör. `brief_submitted`, `chatbot_opened`). Properties camelCase.

### 2.1 Sayfa ve navigasyon

| Event | Properties | Ne zaman |
|---|---|---|
| `$pageview` | PostHog auto | Her sayfa yüklenmesinde |
| `homepage_hero_viewed` | `persona` | Hero görünür olunca |
| `persona_axis_clicked` | `axis: "industrial" \| "commerce"` | Anasayfada eksen CTA |
| `pillar_viewed` | `pillar`, `locale` | Pillar sayfası görüntülenince |
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

```typescript
// Simplified
export const events = {
  homepage_hero_viewed: (p: { persona: Persona }) => ({ name: "homepage_hero_viewed", properties: p }),
  brief_submitted: (p: { briefId: string; pillar: Pillar; budget: Budget; timeline: Timeline }) =>
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

### 9.1 Cookie banner
- İlk ziyarette (EEA origin tespit) → banner.
- Opt-in default `off` — kullanıcı "Kabul et" demeden PostHog çalışmaz.
- Alternatif: "Gerekli olanlar" (Clerk session cookie) + "Analitik" + "Session replay" ayrı checkbox'lar.
- Banner TR+EN.

### 9.2 Session replay masking
- `input[type="password"]`, `input[type="email"]`, `[data-sensitive]` — hepsi masklı.
- Brief form içeriği full mask.
- Ödeme formu Stripe/iyzico iframe'de — zaten PostHog erişemez.

### 9.3 Data retention
- Event data: 2 yıl (PostHog settings).
- Session replay: 30 gün.
- User deletion: `posthog.reset()` + `userId` delete request API'den.

### 9.4 IP anonymization
- PostHog IP anonymization on (last octet masked).

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
