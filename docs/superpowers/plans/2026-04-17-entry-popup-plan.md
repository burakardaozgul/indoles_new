# Entry Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Homepage girişinde tetiklenen 3 aşamalı entry popup'ı inşa et — persona seçimi, sorun seçimi, rezervasyon veya iletişim formu ile angajman kapısı + persona detection altyapısı.

**Architecture:** İzole popup component'i (`src/components/marketing/entry-popup/`), state machine ile 3 stage'i yönetir. Backend tRPC router (`src/server/routers/popup.ts`) submit'i alır, Cal.com quick-book'u (guest) tetikler, Inngest event'i atar, email template'lerini ve DB write'ı yürütür. Cookie state management client-side (`src/lib/popup/cookie.ts`). i18n single-file (tr.json + en.json) pattern'ine uyar. Homepage hero tek-versiyon refactor + `PersonaChip` ile popup'ı yeniden açabilir.

**Tech Stack:** Next.js 15 (App Router, RSC) · React 19 · Tailwind v4 · Radix UI Dialog · shadcn/ui · Framer Motion · tRPC v11 · Drizzle + Neon · next-intl · Resend + React Email · Inngest · Cal.com Cloud API v2 · PostHog · Vitest · Playwright

**Spec:** `docs/superpowers/specs/2026-04-17-entry-popup-design.md`

**Önkoşullar:**
- Proje henüz git repo'su değil. Task 1 ilk step'i git init + initial commit.
- Cal.com dashboard'unda `indoles-1saat-gorusme` event type manuel oluşturulmalı (Task 7 blocker).
- `lead@indoles.com.tr` inbox'ı hazır olmalı (Task 10 blocker).
- KVKK aydınlatma metni (`/tr/gizlilik-kvkk`, `/en/privacy-kvkk`) content team tarafında hazırlanmalı (Task 30 blocker — paralel).
- **Güvenlik:** Legal sayfalar HTML injection riski için Sanity PortableText veya güvenli markdown renderer ile yazılır; `dangerouslySetInnerHTML` kullanılmaz.

---

## Phase 1 — Foundation (Data, Types, i18n)

### Task 1: Git init + baseline commit

- [ ] **Step 1: Git repo başlat**

```bash
cd "indoles-web"
git init
git add .gitignore package.json tsconfig.json next.config.ts tailwind.config.ts drizzle.config.ts playwright.config.ts vitest.config.ts postcss.config.mjs sst.config.ts
git add src/ docs/ messages/ public/ tests/ sanity/
git commit -m "chore: initial commit before popup implementation"
```

- [ ] **Step 2: Verify**

Run: `git log --oneline`
Expected: tek commit görünür.

---

### Task 2: Popup shared types + persona config

**Files:**
- Create: `src/lib/popup/types.ts`
- Create: `src/lib/popup/personas.ts`
- Test: `src/lib/popup/__tests__/personas.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/popup/__tests__/personas.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { PERSONAS, isPersonaSlug, getPersonaLabel } from "../personas";

describe("personas", () => {
  it("tam olarak iki persona tanımlar", () => {
    expect(PERSONAS.length).toBe(2);
    expect(PERSONAS.map((p) => p.slug)).toEqual([
      "donusum-teknoloji",
      "buyume-pazarlar",
    ]);
  });

  it("her persona'nın pillar mapping'i vardır", () => {
    const donusum = PERSONAS.find((p) => p.slug === "donusum-teknoloji")!;
    expect(donusum.pillars).toEqual(["transform", "build"]);
    const buyume = PERSONAS.find((p) => p.slug === "buyume-pazarlar")!;
    expect(buyume.pillars).toEqual(["growth"]);
  });

  it("isPersonaSlug type guard gibi çalışır", () => {
    expect(isPersonaSlug("donusum-teknoloji")).toBe(true);
    expect(isPersonaSlug("buyume-pazarlar")).toBe(true);
    expect(isPersonaSlug("random")).toBe(false);
  });

  it("getPersonaLabel i18n key döner", () => {
    expect(getPersonaLabel("donusum-teknoloji")).toBe("popup.persona.donusum-teknoloji.label");
  });
});
```

- [ ] **Step 2: Run → FAIL**

Run: `pnpm vitest run src/lib/popup/__tests__/personas.test.ts`
Expected: modül yok hatası.

- [ ] **Step 3: types.ts yaz**

Dosya: `src/lib/popup/types.ts`

```typescript
export type PersonaSlug = "donusum-teknoloji" | "buyume-pazarlar";

export type Pillar = "growth" | "transform" | "build";

export type ServiceSlug =
  | "performance-marketing"
  | "cro"
  | "brand-strategy"
  | "ecommerce"
  | "uiux-design"
  | "ai-consulting"
  | "digital-transformation"
  | "business-automation"
  | "business-intelligence"
  | "business-engineering"
  | "custom-software"
  | "tech-infrastructure";

export type ProblemSlug = string;

export type ProblemDef = {
  slug: ProblemSlug;
  persona: PersonaSlug;
  i18nKey: string;
  services: ServiceSlug[];
  pillars: Pillar[];
  weight: number;
};

export type PopupStage =
  | "stage1"
  | "stage2"
  | "stage3"
  | "booking"
  | "contact"
  | "success-booking"
  | "success-contact";

export type PopupSubmissionType = "booking" | "contact" | "dismissed" | "skipped";

export type PopupLeadForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  kvkkConsent: boolean;
};

export type PopupState = {
  stage: PopupStage;
  persona: PersonaSlug | null;
  problems: ProblemSlug[];
  lead?: PopupLeadForm;
};

export type PopupCookieState = {
  version: 1;
  lastShownAt: string;
  outcome: "completed" | "skipped" | "dismissed";
  persona: PersonaSlug | null;
  problems: ProblemSlug[];
  expiresAt: string;
};
```

- [ ] **Step 4: personas.ts yaz**

Dosya: `src/lib/popup/personas.ts`

```typescript
import type { PersonaSlug, Pillar } from "./types";

export type PersonaDef = {
  slug: PersonaSlug;
  pillars: Pillar[];
  i18nKey: string;
  labelKey: string;
  descriptionKey: string;
};

export const PERSONAS: readonly PersonaDef[] = [
  {
    slug: "donusum-teknoloji",
    pillars: ["transform", "build"],
    i18nKey: "popup.persona.donusum-teknoloji",
    labelKey: "popup.persona.donusum-teknoloji.label",
    descriptionKey: "popup.persona.donusum-teknoloji.description",
  },
  {
    slug: "buyume-pazarlar",
    pillars: ["growth"],
    i18nKey: "popup.persona.buyume-pazarlar",
    labelKey: "popup.persona.buyume-pazarlar.label",
    descriptionKey: "popup.persona.buyume-pazarlar.description",
  },
] as const;

const PERSONA_SLUGS: PersonaSlug[] = PERSONAS.map((p) => p.slug);

export function isPersonaSlug(value: unknown): value is PersonaSlug {
  return typeof value === "string" && (PERSONA_SLUGS as string[]).includes(value);
}

export function getPersonaDef(slug: PersonaSlug): PersonaDef {
  const p = PERSONAS.find((p) => p.slug === slug);
  if (!p) throw new Error(`Unknown persona slug: ${slug}`);
  return p;
}

export function getPersonaLabel(slug: PersonaSlug): string {
  return getPersonaDef(slug).labelKey;
}
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/personas.test.ts`
Expected: 4 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/popup/types.ts src/lib/popup/personas.ts src/lib/popup/__tests__/personas.test.ts
git commit -m "feat(popup): add persona config and shared types"
```

---

### Task 3: Problem taxonomy (20 problem, persona-başına 10)

**Files:**
- Create: `src/lib/popup/problems.ts`
- Test: `src/lib/popup/__tests__/problems.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/popup/__tests__/problems.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { PROBLEMS, getProblemsForPersona, getProblemBySlug } from "../problems";

describe("problems", () => {
  it("toplam 20 problem tanımlar", () => {
    expect(PROBLEMS.length).toBe(20);
  });

  it("her persona için tam 10 problem vardır", () => {
    expect(getProblemsForPersona("donusum-teknoloji").length).toBe(10);
    expect(getProblemsForPersona("buyume-pazarlar").length).toBe(10);
  });

  it("her problem unique slug'a sahiptir", () => {
    const slugs = PROBLEMS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("her problem en az bir service ve pillar taşır", () => {
    for (const p of PROBLEMS) {
      expect(p.services.length).toBeGreaterThanOrEqual(1);
      expect(p.pillars.length).toBeGreaterThanOrEqual(1);
      expect(p.i18nKey).toMatch(/^popup\.problems\./);
    }
  });

  it("slug ile problem bulunabilir", () => {
    const p = getProblemBySlug("reklam-maliyeti-artisi");
    expect(p?.persona).toBe("buyume-pazarlar");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: problems.ts yaz**

Dosya: `src/lib/popup/problems.ts`

```typescript
import type { ProblemDef, ProblemSlug, PersonaSlug } from "./types";

export const PROBLEMS: readonly ProblemDef[] = [
  // DÖNÜŞÜM VE TEKNOLOJİ (sanayici persona) — 10 problem
  { slug: "manuel-surec-yavaslatiyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.manuel-surec-yavaslatiyor", services: ["business-automation"], pillars: ["transform"], weight: 1.0 },
  { slug: "verimsizlik-goremiyorum", persona: "donusum-teknoloji", i18nKey: "popup.problems.verimsizlik-goremiyorum", services: ["business-engineering", "business-intelligence"], pillars: ["transform"], weight: 1.0 },
  { slug: "ai-uygulama-bilmiyorum", persona: "donusum-teknoloji", i18nKey: "popup.problems.ai-uygulama-bilmiyorum", services: ["ai-consulting"], pillars: ["transform"], weight: 1.0 },
  { slug: "veri-karar-verdirmiyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.veri-karar-verdirmiyor", services: ["business-intelligence"], pillars: ["transform"], weight: 1.0 },
  { slug: "dijitalesme-rafta", persona: "donusum-teknoloji", i18nKey: "popup.problems.dijitalesme-rafta", services: ["digital-transformation"], pillars: ["transform"], weight: 1.0 },
  { slug: "legacy-sistem-engelliyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.legacy-sistem-engelliyor", services: ["custom-software", "tech-infrastructure"], pillars: ["build"], weight: 1.0 },
  { slug: "ekip-teknoloji-takip-edemiyor", persona: "donusum-teknoloji", i18nKey: "popup.problems.ekip-teknoloji-takip-edemiyor", services: ["ai-consulting", "digital-transformation"], pillars: ["transform"], weight: 1.0 },
  { slug: "ihracat-hazirlik-eksik", persona: "donusum-teknoloji", i18nKey: "popup.problems.ihracat-hazirlik-eksik", services: ["business-engineering", "brand-strategy"], pillars: ["transform", "growth"], weight: 1.0 },
  { slug: "tedarik-uretim-veri-kopuk", persona: "donusum-teknoloji", i18nKey: "popup.problems.tedarik-uretim-veri-kopuk", services: ["business-intelligence", "custom-software"], pillars: ["transform", "build"], weight: 1.0 },
  { slug: "oncelik-karmasasi", persona: "donusum-teknoloji", i18nKey: "popup.problems.oncelik-karmasasi", services: ["business-engineering", "digital-transformation"], pillars: ["transform"], weight: 1.0 },

  // BÜYÜME VE YENİ PAZARLAR (ticaret persona) — 10 problem
  { slug: "reklam-maliyeti-artisi", persona: "buyume-pazarlar", i18nKey: "popup.problems.reklam-maliyeti-artisi", services: ["performance-marketing", "cro"], pillars: ["growth"], weight: 1.0 },
  { slug: "trafik-satisa-donmuyor", persona: "buyume-pazarlar", i18nKey: "popup.problems.trafik-satisa-donmuyor", services: ["cro", "uiux-design"], pillars: ["growth"], weight: 1.0 },
  { slug: "siparis-hacmi-platoda", persona: "buyume-pazarlar", i18nKey: "popup.problems.siparis-hacmi-platoda", services: ["performance-marketing", "brand-strategy"], pillars: ["growth"], weight: 1.0 },
  { slug: "yeni-pazar-kanal", persona: "buyume-pazarlar", i18nKey: "popup.problems.yeni-pazar-kanal", services: ["brand-strategy", "ecommerce"], pillars: ["growth"], weight: 1.0 },
  { slug: "marka-bilinirlik-yetersiz", persona: "buyume-pazarlar", i18nKey: "popup.problems.marka-bilinirlik-yetersiz", services: ["brand-strategy"], pillars: ["growth"], weight: 1.0 },
  { slug: "churn-yuksek", persona: "buyume-pazarlar", i18nKey: "popup.problems.churn-yuksek", services: ["cro", "business-intelligence"], pillars: ["growth", "transform"], weight: 1.0 },
  { slug: "cac-ltv-makas", persona: "buyume-pazarlar", i18nKey: "popup.problems.cac-ltv-makas", services: ["performance-marketing", "business-intelligence"], pillars: ["growth"], weight: 1.0 },
  { slug: "kanal-yonetim-eksik", persona: "buyume-pazarlar", i18nKey: "popup.problems.kanal-yonetim-eksik", services: ["brand-strategy", "performance-marketing"], pillars: ["growth"], weight: 1.0 },
  { slug: "altyapi-yuk-kaldirmiyor", persona: "buyume-pazarlar", i18nKey: "popup.problems.altyapi-yuk-kaldirmiyor", services: ["ecommerce", "tech-infrastructure"], pillars: ["growth", "build"], weight: 1.0 },
  { slug: "rekabet-geride-his", persona: "buyume-pazarlar", i18nKey: "popup.problems.rekabet-geride-his", services: ["brand-strategy", "cro"], pillars: ["growth"], weight: 1.0 },
] as const;

export function getProblemsForPersona(persona: PersonaSlug): readonly ProblemDef[] {
  return PROBLEMS.filter((p) => p.persona === persona);
}

export function getProblemBySlug(slug: ProblemSlug): ProblemDef | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}

export function getAllProblemSlugs(): ProblemSlug[] {
  return PROBLEMS.map((p) => p.slug);
}
```

- [ ] **Step 4: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/problems.test.ts`
Expected: 5 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/popup/problems.ts src/lib/popup/__tests__/problems.test.ts
git commit -m "feat(popup): add 20-problem taxonomy with service/pillar mapping"
```

---

### Task 4: i18n message'ları ekle (TR + EN)

**Files:**
- Modify: `messages/tr.json`
- Modify: `messages/en.json`
- Test: `src/lib/popup/__tests__/i18n-parity.test.ts`

- [ ] **Step 1: Test yaz (TR/EN parity guard)**

Dosya: `src/lib/popup/__tests__/i18n-parity.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import tr from "../../../../messages/tr.json";
import en from "../../../../messages/en.json";
import { PROBLEMS } from "../problems";
import { PERSONAS } from "../personas";

function flatKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === "object" && v !== null && !Array.isArray(v)
      ? flatKeys(v as Record<string, unknown>, key)
      : [key];
  });
}

describe("i18n parity — popup namespace", () => {
  it("TR ve EN aynı popup.* key setine sahip", () => {
    const trKeys = flatKeys(tr).filter((k) => k.startsWith("popup."));
    const enKeys = flatKeys(en).filter((k) => k.startsWith("popup."));
    expect(trKeys.sort()).toEqual(enKeys.sort());
  });

  it("her problem için TR ve EN metni var", () => {
    const trKeys = new Set(flatKeys(tr));
    for (const p of PROBLEMS) {
      expect(trKeys.has(p.i18nKey)).toBe(true);
    }
  });

  it("her persona için label + description var", () => {
    const trKeys = new Set(flatKeys(tr));
    for (const persona of PERSONAS) {
      expect(trKeys.has(persona.labelKey)).toBe(true);
      expect(trKeys.has(persona.descriptionKey)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: messages/tr.json'a popup namespace'i ekle**

Mevcut `messages/tr.json` root objesine `popup` node'u ekle:

```json
{
  "popup": {
    "meta": {
      "progress": "{current} / {total}",
      "kvkkConsent": "KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum.",
      "kvkkLink": "Aydınlatma metni",
      "kvkkLinkHref": "/tr/gizlilik-kvkk",
      "back": "Geri",
      "next": "Devam et",
      "close": "Kapat",
      "keepBrowsing": "Şimdilik gezinmeye devam et",
      "submit": "Gönder",
      "loading": "Gönderiliyor..."
    },
    "stage1": {
      "title": "Kimsin?",
      "subtitle": "Seni daha iyi tanıyalım ki doğru içerikleri gösterelim.",
      "helper": "Hangisi sana daha yakın? Sonra değiştirebilirsin."
    },
    "persona": {
      "donusum-teknoloji": {
        "label": "Dönüşüm ve Teknoloji",
        "description": "Sanayi, üretim veya kurumsal operasyonda verimi artırmak, süreçleri otomatize etmek, AI ile dönüşmek istiyorum."
      },
      "buyume-pazarlar": {
        "label": "Büyüme ve Yeni Pazarlar",
        "description": "Ticaret, e-ticaret veya perakendede satış hacmini büyütmek, yeni pazarlara açılmak, markayı güçlendirmek istiyorum."
      }
    },
    "stage2": {
      "title": "Hangi durumları sıklıkla yaşıyorsun?",
      "subtitle": "3 tanesini seç.",
      "fifoHint": "3 sorun seçebilirsin. İlk seçimin çıkarıldı."
    },
    "stage3": {
      "title": "Seçimini kaydettik. Sıradaki adım?",
      "subtitle": "Sana uygun bir danışmanla doğrudan konuşalım.",
      "bookingCta": "1 saatlik ücretsiz görüşme rezerve et",
      "bookingHelper": "Cal.com'da slot seç, takvimine eklensin.",
      "contactCta": "Bize anlatın, biz arayalım",
      "contactHelper": "1 iş günü içinde geri dönüş yapacağız."
    },
    "form": {
      "firstName": "Ad",
      "lastName": "Soyad",
      "phone": "Telefon",
      "email": "E-posta",
      "company": "Şirket",
      "title": "Unvan",
      "validation": {
        "required": "Bu alan zorunludur.",
        "email": "Geçerli bir e-posta girin.",
        "phone": "Geçerli bir telefon numarası girin.",
        "kvkk": "KVKK onayı zorunludur."
      }
    },
    "success": {
      "bookingTitle": "Takvime aldık.",
      "bookingBody": "Detayları e-postanda bulacaksın.",
      "contactTitle": "Teşekkürler.",
      "contactBody": "1 iş günü içinde ulaşacağız.",
      "close": "Kapat"
    },
    "chip": {
      "current": "Seçim: {personaLabel}",
      "change": "Değiştir"
    },
    "problems": {
      "manuel-surec-yavaslatiyor": "Manuel süreçler ekibimi yavaşlatıyor.",
      "verimsizlik-goremiyorum": "Verimsizlik nerede, kesin bilemiyorum.",
      "ai-uygulama-bilmiyorum": "AI'ın şirketime nasıl uygulanacağını göremiyorum.",
      "veri-karar-verdirmiyor": "Verim ölçümüm var ama karar verdirmiyor.",
      "dijitalesme-rafta": "Operasyonu dijitale taşımak birkaç yıldır rafta.",
      "legacy-sistem-engelliyor": "Legacy sistem yeni iş modellerimi engelliyor.",
      "ekip-teknoloji-takip-edemiyor": "Mevcut ekip teknolojiyi takip edemiyor.",
      "ihracat-hazirlik-eksik": "İhracat veya yeni pazar için hazırlık eksik.",
      "tedarik-uretim-veri-kopuk": "Tedarik ve üretim arasındaki veri kopuk.",
      "oncelik-karmasasi": "Önceliklendirme yapamıyorum, her şey acil.",
      "reklam-maliyeti-artisi": "Reklam maliyetim artıyor, ROAS düşüyor.",
      "trafik-satisa-donmuyor": "Siteye trafik var, satışa dönmüyor.",
      "siparis-hacmi-platoda": "Sipariş hacmim platoda, büyümüyor.",
      "yeni-pazar-kanal": "Yeni bir pazara veya kanala girmek istiyorum.",
      "marka-bilinirlik-yetersiz": "Marka bilinirliğim yetersiz.",
      "churn-yuksek": "Müşteri kaybı (churn) yüksek.",
      "cac-ltv-makas": "CAC artıyor, LTV düşüyor.",
      "kanal-yonetim-eksik": "Pazarlama kanallarını doğru yönetemiyorum.",
      "altyapi-yuk-kaldirmiyor": "E-ticaret altyapım satış yüküne dayanmıyor.",
      "rekabet-geride-his": "Rekabette geride kaldığımı hissediyorum."
    }
  }
}
```

- [ ] **Step 4: messages/en.json'a aynı yapı**

```json
{
  "popup": {
    "meta": {
      "progress": "{current} / {total}",
      "kvkkConsent": "I consent to the processing of my personal data under KVKK.",
      "kvkkLink": "Privacy notice",
      "kvkkLinkHref": "/en/privacy-kvkk",
      "back": "Back",
      "next": "Continue",
      "close": "Close",
      "keepBrowsing": "Keep browsing for now",
      "submit": "Submit",
      "loading": "Sending..."
    },
    "stage1": {
      "title": "Who are you?",
      "subtitle": "Tell us a bit so we can show you what's relevant.",
      "helper": "Pick what fits best — you can change it later."
    },
    "persona": {
      "donusum-teknoloji": {
        "label": "Transformation & Technology",
        "description": "I want to boost efficiency, automate processes, or transform with AI in industry, manufacturing, or corporate operations."
      },
      "buyume-pazarlar": {
        "label": "Growth & New Markets",
        "description": "I want to grow sales, enter new markets, or strengthen my brand in commerce, e-commerce, or retail."
      }
    },
    "stage2": {
      "title": "Which situations do you face often?",
      "subtitle": "Pick 3.",
      "fifoHint": "You can pick up to 3. Earliest selection was removed."
    },
    "stage3": {
      "title": "Got it. What's next?",
      "subtitle": "Talk directly with the right advisor.",
      "bookingCta": "Book a 1-hour free session",
      "bookingHelper": "Pick a slot on Cal.com — it goes on your calendar.",
      "contactCta": "Tell us, we'll reach out",
      "contactHelper": "We'll get back within 1 business day."
    },
    "form": {
      "firstName": "First name",
      "lastName": "Last name",
      "phone": "Phone",
      "email": "Email",
      "company": "Company",
      "title": "Title",
      "validation": {
        "required": "This field is required.",
        "email": "Enter a valid email.",
        "phone": "Enter a valid phone number.",
        "kvkk": "KVKK consent is required."
      }
    },
    "success": {
      "bookingTitle": "You're on the calendar.",
      "bookingBody": "Details are in your email.",
      "contactTitle": "Thanks.",
      "contactBody": "We'll be in touch within 1 business day.",
      "close": "Close"
    },
    "chip": {
      "current": "Selection: {personaLabel}",
      "change": "Change"
    },
    "problems": {
      "manuel-surec-yavaslatiyor": "Manual processes are slowing my team down.",
      "verimsizlik-goremiyorum": "I can't pinpoint where inefficiency happens.",
      "ai-uygulama-bilmiyorum": "I can't see how AI would apply to my company.",
      "veri-karar-verdirmiyor": "I have measurements, but they don't drive decisions.",
      "dijitalesme-rafta": "Digital transformation has been shelved for years.",
      "legacy-sistem-engelliyor": "Legacy systems block new business models.",
      "ekip-teknoloji-takip-edemiyor": "My team can't keep up with technology.",
      "ihracat-hazirlik-eksik": "Not ready for export or new markets.",
      "tedarik-uretim-veri-kopuk": "Data between supply and production is disconnected.",
      "oncelik-karmasasi": "I can't prioritize — everything feels urgent.",
      "reklam-maliyeti-artisi": "Ad costs are rising, ROAS is falling.",
      "trafik-satisa-donmuyor": "Traffic doesn't convert to sales.",
      "siparis-hacmi-platoda": "Order volume is plateauing.",
      "yeni-pazar-kanal": "I want to enter a new market or channel.",
      "marka-bilinirlik-yetersiz": "My brand awareness is insufficient.",
      "churn-yuksek": "Customer churn is high.",
      "cac-ltv-makas": "CAC is rising, LTV is falling.",
      "kanal-yonetim-eksik": "I can't manage marketing channels well.",
      "altyapi-yuk-kaldirmiyor": "My e-commerce stack can't handle the sales load.",
      "rekabet-geride-his": "I feel I'm falling behind competitors."
    }
  }
}
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/i18n-parity.test.ts`
Expected: 3 tests passed.

- [ ] **Step 6: Commit**

```bash
git add messages/tr.json messages/en.json src/lib/popup/__tests__/i18n-parity.test.ts
git commit -m "feat(popup): add TR+EN i18n strings and parity test"
```

---

### Task 5: Drizzle schema — popup_submissions tablosu

**Files:**
- Modify: `src/server/db/schema.ts`
- Create: migration (drizzle-kit generate ile)

- [ ] **Step 1: schema.ts'e popup_submissions ekle**

Mevcut `src/server/db/schema.ts` sonuna ekle (mevcut import ve tabloları koru):

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const popupSubmissions = pgTable("popup_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sessionId: text("session_id").notNull(),
  userId: uuid("user_id"),
  persona: text("persona").notNull(),
  problems: text("problems").array().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  email: text("email"),
  company: text("company"),
  title: text("title"),
  submissionType: text("submission_type").notNull(),
  kvkkConsentAt: timestamp("kvkk_consent_at", { withTimezone: true }),
  locale: text("locale").notNull(),
  calComBookingId: text("cal_com_booking_id"),
  emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
});

export type PopupSubmission = typeof popupSubmissions.$inferSelect;
export type NewPopupSubmission = typeof popupSubmissions.$inferInsert;
```

- [ ] **Step 2: Migration generate**

Run: `pnpm drizzle-kit generate`
Expected: yeni migration dosyası `drizzle/migrations/NNNN_popup_submissions.sql`.

- [ ] **Step 3: Index'leri ekle (migration dosyasına elle)**

Migration SQL dosyası sonuna ekle:

```sql
CREATE INDEX IF NOT EXISTS "idx_popup_submissions_email" ON "popup_submissions" ("email");
CREATE INDEX IF NOT EXISTS "idx_popup_submissions_persona" ON "popup_submissions" ("persona");
CREATE INDEX IF NOT EXISTS "idx_popup_submissions_created" ON "popup_submissions" ("created_at" DESC);
```

- [ ] **Step 4: Migration uygula**

Run: `pnpm drizzle-kit migrate`
Expected: migration uygulandı.

- [ ] **Step 5: Smoke test**

```bash
psql $DATABASE_URL -c "INSERT INTO popup_submissions (session_id, persona, problems, submission_type, locale) VALUES ('test', 'donusum-teknoloji', ARRAY['x','y','z'], 'skipped', 'tr') RETURNING id;"
psql $DATABASE_URL -c "DELETE FROM popup_submissions WHERE session_id='test';"
```

- [ ] **Step 6: Commit**

```bash
git add src/server/db/schema.ts drizzle/migrations/
git commit -m "feat(db): add popup_submissions table with indexes"
```

---

## Phase 2 — Backend Services

### Task 6: Zod schema + tRPC input validators

**Files:**
- Create: `src/lib/popup/schemas.ts`
- Test: `src/lib/popup/__tests__/schemas.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/popup/__tests__/schemas.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { popupSubmitSchema, leadFormSchema } from "../schemas";

describe("popupSubmitSchema", () => {
  const validPayload = {
    sessionId: "sess_abc123",
    persona: "donusum-teknoloji" as const,
    problems: ["manuel-surec-yavaslatiyor", "verimsizlik-goremiyorum", "ai-uygulama-bilmiyorum"],
    submissionType: "booking" as const,
    locale: "tr" as const,
    lead: {
      firstName: "Ali",
      lastName: "Veli",
      phone: "+905551234567",
      email: "ali@ornek.com",
      company: "Test AŞ",
      title: "CTO",
      kvkkConsent: true,
    },
  };

  it("geçerli payload'u kabul eder", () => {
    expect(() => popupSubmitSchema.parse(validPayload)).not.toThrow();
  });

  it("tam 3 problem zorunludur", () => {
    expect(() => popupSubmitSchema.parse({ ...validPayload, problems: ["a", "b"] })).toThrow();
    expect(() => popupSubmitSchema.parse({ ...validPayload, problems: ["a", "b", "c", "d"] })).toThrow();
  });

  it("booking/contact için lead zorunlu", () => {
    const { lead, ...withoutLead } = validPayload;
    expect(() => popupSubmitSchema.parse(withoutLead)).toThrow();
  });

  it("skipped için lead opsiyonel", () => {
    const { lead, ...withoutLead } = validPayload;
    expect(() => popupSubmitSchema.parse({ ...withoutLead, submissionType: "skipped" as const })).not.toThrow();
  });

  it("KVKK false reddeder", () => {
    expect(() =>
      popupSubmitSchema.parse({ ...validPayload, lead: { ...validPayload.lead, kvkkConsent: false } })
    ).toThrow();
  });

  it("invalid email reddeder", () => {
    expect(() => leadFormSchema.parse({ ...validPayload.lead, email: "not-email" })).toThrow();
  });

  it("invalid persona reddeder", () => {
    expect(() => popupSubmitSchema.parse({ ...validPayload, persona: "other" })).toThrow();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: schemas.ts yaz**

Dosya: `src/lib/popup/schemas.ts`

```typescript
import { z } from "zod";
import { PERSONAS } from "./personas";
import { getAllProblemSlugs } from "./problems";

const personaEnum = z.enum(PERSONAS.map((p) => p.slug) as [string, ...string[]]);
const problemEnum = z.enum(getAllProblemSlugs() as [string, ...string[]]);

export const leadFormSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phone: z.string().min(7).max(30).regex(/^[+0-9\s()-]+$/, "invalid phone"),
  email: z.string().email(),
  company: z.string().min(2).max(200),
  title: z.string().min(2).max(100),
  kvkkConsent: z.literal(true, {
    errorMap: () => ({ message: "KVKK consent is required" }),
  }),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

const baseSubmit = z.object({
  sessionId: z.string().min(1),
  persona: personaEnum,
  problems: z.array(problemEnum).length(3),
  locale: z.enum(["tr", "en"]),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export const popupSubmitSchema = z.discriminatedUnion("submissionType", [
  baseSubmit.extend({ submissionType: z.literal("booking"), lead: leadFormSchema }),
  baseSubmit.extend({ submissionType: z.literal("contact"), lead: leadFormSchema }),
  baseSubmit.extend({ submissionType: z.literal("dismissed"), lead: leadFormSchema.optional() }),
  baseSubmit.extend({ submissionType: z.literal("skipped"), lead: leadFormSchema.optional() }),
]);

export type PopupSubmitInput = z.infer<typeof popupSubmitSchema>;
```

- [ ] **Step 4: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/schemas.test.ts`
Expected: 7 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/popup/schemas.ts src/lib/popup/__tests__/schemas.test.ts
git commit -m "feat(popup): add Zod submission schema with discriminated union"
```

---

### Task 7: Cal.com quick-book servisi

**Files:**
- Create: `src/lib/cal-com/quick-book.ts`
- Create: `src/lib/cal-com/types.ts`
- Test: `src/lib/cal-com/__tests__/quick-book.test.ts`

**Env değişkenleri (`.env.local`'a ekle):**
```
CAL_COM_API_KEY=cal_live_xxx
CAL_COM_EVENT_TYPE_ID_1H=<Cal.com dashboard'dan alınan ID>
```

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/cal-com/__tests__/quick-book.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createQuickBooking } from "../quick-book";

const originalFetch = global.fetch;

describe("createQuickBooking", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    process.env.CAL_COM_API_KEY = "test_key";
    process.env.CAL_COM_EVENT_TYPE_ID_1H = "123";
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("Cal.com API'ye doğru payload gönderir", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "cal_123", bookingUrl: "https://cal.com/booking/abc" }),
    });

    const result = await createQuickBooking({
      firstName: "Ali",
      lastName: "Veli",
      email: "ali@ornek.com",
      phone: "+905551234567",
      company: "Test AŞ",
      title: "CTO",
      persona: "donusum-teknoloji",
      locale: "tr",
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, init] = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("api.cal.com");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string);
    expect(body.responses.name).toBe("Ali Veli");
    expect(result.bookingId).toBe("cal_123");
    expect(result.bookingUrl).toBe("https://cal.com/booking/abc");
  });

  it("5xx dönerse hata fırlatır", async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => "Service Unavailable",
    });
    await expect(
      createQuickBooking({
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        phone: "+905551234567",
        company: "X",
        title: "Y",
        persona: "buyume-pazarlar",
        locale: "en",
      })
    ).rejects.toThrow(/Cal.com/);
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: types.ts yaz**

Dosya: `src/lib/cal-com/types.ts`

```typescript
export type CalComBookingResponse = {
  id: string;
  bookingUrl?: string;
  [key: string]: unknown;
};

export type QuickBookingInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  persona: "donusum-teknoloji" | "buyume-pazarlar";
  locale: "tr" | "en";
};

export type QuickBookingResult = {
  bookingId: string;
  bookingUrl: string | null;
};
```

- [ ] **Step 4: quick-book.ts yaz**

Dosya: `src/lib/cal-com/quick-book.ts`

```typescript
import type { CalComBookingResponse, QuickBookingInput, QuickBookingResult } from "./types";

const CAL_COM_BASE = "https://api.cal.com/v2";

export async function createQuickBooking(input: QuickBookingInput): Promise<QuickBookingResult> {
  const apiKey = process.env.CAL_COM_API_KEY;
  const eventTypeId = process.env.CAL_COM_EVENT_TYPE_ID_1H;
  if (!apiKey || !eventTypeId) {
    throw new Error("Cal.com env vars missing (CAL_COM_API_KEY, CAL_COM_EVENT_TYPE_ID_1H)");
  }

  const payload = {
    eventTypeId: Number(eventTypeId),
    start: null,
    responses: {
      name: `${input.firstName} ${input.lastName}`,
      email: input.email,
      phone: input.phone,
      company: input.company,
      title: input.title,
    },
    metadata: {
      source: "indoles-popup",
      persona: input.persona,
      locale: input.locale,
    },
    language: input.locale,
  };

  const res = await fetch(`${CAL_COM_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cal.com booking failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as CalComBookingResponse;
  return {
    bookingId: String(data.id),
    bookingUrl: (data.bookingUrl as string | undefined) ?? null,
  };
}
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/lib/cal-com/__tests__/quick-book.test.ts`
Expected: 2 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cal-com/
git commit -m "feat(cal-com): quick-book service with guest booking"
```

---

### Task 8: React Email — lead notification template

**Files:**
- Create: `src/lib/email/templates/popup-lead-notification.tsx`
- Test: `src/lib/email/templates/__tests__/popup-lead-notification.test.tsx`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/email/templates/__tests__/popup-lead-notification.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadNotificationEmail } from "../popup-lead-notification";

describe("PopupLeadNotificationEmail", () => {
  const props = {
    firstName: "Ali",
    lastName: "Veli",
    email: "ali@ornek.com",
    phone: "+905551234567",
    company: "Test AŞ",
    title: "CTO",
    personaLabel: "Dönüşüm ve Teknoloji",
    problems: [
      "Manuel süreçler ekibimi yavaşlatıyor.",
      "Verimsizlik nerede, kesin bilemiyorum.",
      "AI'ın şirketime nasıl uygulanacağını göremiyorum.",
    ],
    submissionType: "booking" as const,
    calComBookingUrl: "https://cal.com/booking/abc",
    locale: "tr" as const,
    utm: { source: "google", medium: "cpc", campaign: "spring" },
    adminLink: "https://indoles.com.tr/admin/leads/xyz",
  };

  it("lead bilgilerini içerir", async () => {
    const html = await render(<PopupLeadNotificationEmail {...props} />);
    expect(html).toContain("Ali Veli");
    expect(html).toContain("ali@ornek.com");
    expect(html).toContain("Test AŞ");
    expect(html).toContain("Dönüşüm ve Teknoloji");
  });

  it("3 sorunu listeler", async () => {
    const html = await render(<PopupLeadNotificationEmail {...props} />);
    for (const p of props.problems) expect(html).toContain(p);
  });

  it("Cal.com linkini içerir (booking)", async () => {
    const html = await render(<PopupLeadNotificationEmail {...props} />);
    expect(html).toContain("cal.com/booking/abc");
  });

  it("contact path'te Cal.com bölümünü atlar", async () => {
    const html = await render(
      <PopupLeadNotificationEmail {...props} submissionType="contact" calComBookingUrl={null} />
    );
    expect(html).not.toContain("cal.com/booking");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Template yaz**

Dosya: `src/lib/email/templates/popup-lead-notification.tsx`

```tsx
import * as React from "react";
import { Html, Head, Body, Container, Section, Heading, Text, Link, Hr } from "@react-email/components";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  personaLabel: string;
  problems: string[];
  submissionType: "booking" | "contact";
  calComBookingUrl?: string | null;
  locale: "tr" | "en";
  utm?: { source?: string; medium?: string; campaign?: string };
  adminLink: string;
};

const row: React.CSSProperties = { margin: "4px 0" };
const label: React.CSSProperties = { color: "#666", display: "inline-block", width: 90 };

export function PopupLeadNotificationEmail(p: Props) {
  const subject = `Yeni lead: ${p.personaLabel} — ${p.firstName} ${p.lastName} (${p.company})`;

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "ui-sans-serif, system-ui", background: "#fafafa", padding: 24 }}>
        <Container style={{ background: "#fff", maxWidth: 600, padding: 24, borderRadius: 8 }}>
          <Heading style={{ fontSize: 18, marginBottom: 16 }}>{subject}</Heading>
          <Section>
            <Text style={row}><span style={label}>Kişi:</span> {p.firstName} {p.lastName}</Text>
            <Text style={row}><span style={label}>Unvan:</span> {p.title}</Text>
            <Text style={row}><span style={label}>Şirket:</span> {p.company}</Text>
            <Text style={row}><span style={label}>Telefon:</span> {p.phone}</Text>
            <Text style={row}><span style={label}>E-posta:</span> {p.email}</Text>
          </Section>
          <Hr />
          <Section>
            <Text style={row}><span style={label}>Persona:</span> {p.personaLabel}</Text>
            <Text style={row}><span style={label}>Sorunlar:</span></Text>
            <ol style={{ paddingLeft: 20, color: "#333" }}>
              {p.problems.map((pr, i) => (<li key={i}>{pr}</li>))}
            </ol>
          </Section>
          <Hr />
          <Section>
            <Text style={row}><span style={label}>Tür:</span> {p.submissionType}</Text>
            {p.submissionType === "booking" && p.calComBookingUrl ? (
              <Text style={row}>
                <span style={label}>Cal.com:</span> <Link href={p.calComBookingUrl}>{p.calComBookingUrl}</Link>
              </Text>
            ) : null}
            <Text style={row}><span style={label}>Locale:</span> {p.locale}</Text>
            {p.utm ? (
              <Text style={row}>
                <span style={label}>UTM:</span> {p.utm.source ?? "-"} / {p.utm.medium ?? "-"} / {p.utm.campaign ?? "-"}
              </Text>
            ) : null}
          </Section>
          <Hr />
          <Text><Link href={p.adminLink}>Admin'de aç</Link></Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 4: Run → PASS**

Run: `pnpm vitest run src/lib/email/templates/__tests__/popup-lead-notification.test.tsx`
Expected: 4 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/templates/popup-lead-notification.tsx src/lib/email/templates/__tests__/popup-lead-notification.test.tsx
git commit -m "feat(email): popup lead notification template"
```

---

### Task 9: React Email — lead confirmation (ziyaretçiye)

**Files:**
- Create: `src/lib/email/templates/popup-lead-confirmation.tsx`
- Test: `src/lib/email/templates/__tests__/popup-lead-confirmation.test.tsx`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/email/templates/__tests__/popup-lead-confirmation.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadConfirmationEmail } from "../popup-lead-confirmation";

describe("PopupLeadConfirmationEmail", () => {
  const base = { firstName: "Ali", locale: "tr" as const };

  it("booking variant Cal.com bilgisini içerir", async () => {
    const html = await render(
      <PopupLeadConfirmationEmail {...base} variant="booking" calComBookingUrl="https://cal.com/x" />
    );
    expect(html).toContain("cal.com/x");
    expect(html).toContain("Ali");
  });

  it("contact variant 1 iş günü mesajını içerir", async () => {
    const html = await render(<PopupLeadConfirmationEmail {...base} variant="contact" />);
    expect(html).toMatch(/1 iş günü/);
  });

  it("EN locale doğru string'leri kullanır", async () => {
    const html = await render(<PopupLeadConfirmationEmail {...base} variant="contact" locale="en" />);
    expect(html).toMatch(/business day/i);
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Template yaz**

Dosya: `src/lib/email/templates/popup-lead-confirmation.tsx`

```tsx
import * as React from "react";
import { Html, Head, Body, Container, Heading, Text, Link } from "@react-email/components";

type Props = {
  firstName: string;
  locale: "tr" | "en";
  variant: "booking" | "contact";
  calComBookingUrl?: string | null;
};

const copy = {
  tr: {
    greeting: (n: string) => `Merhaba ${n},`,
    booking: {
      title: "Görüşme için takvimindeyiz.",
      body: "Seçtiğin slot için davet e-postası ayrı gelecek. Görüşmeden önce bir not: 3 sorunun üzerinden konuşacağız.",
      link: "Seçim bağlantısı:",
    },
    contact: {
      title: "Teşekkürler.",
      body: "1 iş günü içinde telefon veya e-posta ile ulaşacağız.",
    },
    signoff: "INDOLES ekibi",
  },
  en: {
    greeting: (n: string) => `Hi ${n},`,
    booking: {
      title: "You're on our calendar.",
      body: "You'll receive a separate calendar invite. A quick note: we'll talk through the 3 topics you selected.",
      link: "Selection link:",
    },
    contact: {
      title: "Thanks.",
      body: "We'll reach out by phone or email within 1 business day.",
    },
    signoff: "The INDOLES team",
  },
} as const;

export function PopupLeadConfirmationEmail(p: Props) {
  const t = copy[p.locale];
  const v = t[p.variant];

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "ui-sans-serif, system-ui", background: "#fafafa", padding: 24 }}>
        <Container style={{ background: "#fff", maxWidth: 560, padding: 24, borderRadius: 8 }}>
          <Text>{t.greeting(p.firstName)}</Text>
          <Heading style={{ fontSize: 20, margin: "16px 0" }}>{v.title}</Heading>
          <Text>{v.body}</Text>
          {p.variant === "booking" && p.calComBookingUrl ? (
            <Text>
              {t.booking.link} <Link href={p.calComBookingUrl}>{p.calComBookingUrl}</Link>
            </Text>
          ) : null}
          <Text style={{ marginTop: 24, color: "#666" }}>{t.signoff}</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 4: Run → PASS**

Run: `pnpm vitest run src/lib/email/templates/__tests__/popup-lead-confirmation.test.tsx`
Expected: 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/templates/popup-lead-confirmation.tsx src/lib/email/templates/__tests__/popup-lead-confirmation.test.tsx
git commit -m "feat(email): popup lead confirmation template (TR/EN)"
```

---

### Task 10: Inngest function — popup/lead.created handler

**Files:**
- Create: `src/lib/inngest/functions/popup-lead.ts`
- Modify: `src/lib/inngest/functions/index.ts`
- Create: `src/server/db/mutations/popup.ts` (helper)
- Test: `src/lib/inngest/functions/__tests__/popup-lead.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/inngest/functions/__tests__/popup-lead.test.ts`

```typescript
import { describe, it, expect, vi } from "vitest";
import { handlePopupLeadCreated } from "../popup-lead";

const mockSendEmail = vi.fn().mockResolvedValue({ id: "email_abc" });
vi.mock("../../../email/client", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const mockDbUpdate = vi.fn().mockResolvedValue(undefined);
vi.mock("../../../../server/db/mutations/popup", () => ({
  markEmailSentForSubmission: (...args: unknown[]) => mockDbUpdate(...args),
}));

describe("handlePopupLeadCreated", () => {
  it("lead + confirmation email gönderir", async () => {
    await handlePopupLeadCreated({
      submissionId: "sub_123",
      firstName: "Ali",
      lastName: "Veli",
      email: "ali@ornek.com",
      phone: "+905551234567",
      company: "Test AŞ",
      title: "CTO",
      persona: "donusum-teknoloji",
      personaLabel: "Dönüşüm ve Teknoloji",
      problems: ["Manuel süreç.", "Verim yok.", "AI bilinmiyor."],
      submissionType: "booking",
      calComBookingUrl: "https://cal.com/booking/abc",
      locale: "tr",
      utm: { source: null, medium: null, campaign: null },
    });

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    const first = mockSendEmail.mock.calls[0][0] as { to: string };
    const second = mockSendEmail.mock.calls[1][0] as { to: string };
    expect(first.to).toBe("lead@indoles.com.tr");
    expect(second.to).toBe("ali@ornek.com");
    expect(mockDbUpdate).toHaveBeenCalledWith("sub_123");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: DB mutation helper yaz**

Dosya: `src/server/db/mutations/popup.ts`

```typescript
import { eq } from "drizzle-orm";
import { db } from "../index";
import { popupSubmissions } from "../schema";

export async function markEmailSentForSubmission(id: string): Promise<void> {
  await db
    .update(popupSubmissions)
    .set({ emailSentAt: new Date() })
    .where(eq(popupSubmissions.id, id));
}
```

- [ ] **Step 4: Inngest handler yaz**

Dosya: `src/lib/inngest/functions/popup-lead.ts`

```typescript
import { inngest } from "../client";
import { sendEmail } from "../../email/client";
import { PopupLeadNotificationEmail } from "../../email/templates/popup-lead-notification";
import { PopupLeadConfirmationEmail } from "../../email/templates/popup-lead-confirmation";
import { markEmailSentForSubmission } from "../../../server/db/mutations/popup";

type PayloadBase = {
  submissionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  persona: "donusum-teknoloji" | "buyume-pazarlar";
  personaLabel: string;
  problems: string[];
  submissionType: "booking" | "contact";
  calComBookingUrl?: string | null;
  locale: "tr" | "en";
  utm: { source?: string | null; medium?: string | null; campaign?: string | null };
};

export async function handlePopupLeadCreated(data: PayloadBase): Promise<void> {
  const adminLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://indoles.com.tr"}/admin/leads/${data.submissionId}`;

  await sendEmail({
    to: "lead@indoles.com.tr",
    subject: `Yeni lead: ${data.personaLabel} — ${data.firstName} ${data.lastName} (${data.company})`,
    react: PopupLeadNotificationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      title: data.title,
      personaLabel: data.personaLabel,
      problems: data.problems,
      submissionType: data.submissionType,
      calComBookingUrl: data.calComBookingUrl ?? null,
      locale: data.locale,
      utm: {
        source: data.utm.source ?? undefined,
        medium: data.utm.medium ?? undefined,
        campaign: data.utm.campaign ?? undefined,
      },
      adminLink,
    }),
  });

  await sendEmail({
    to: data.email,
    subject: data.locale === "tr" ? "INDOLES: İsteğini aldık" : "INDOLES: We've got your request",
    react: PopupLeadConfirmationEmail({
      firstName: data.firstName,
      locale: data.locale,
      variant: data.submissionType,
      calComBookingUrl: data.calComBookingUrl ?? null,
    }),
  });

  await markEmailSentForSubmission(data.submissionId);
}

export const popupLeadCreatedFn = inngest.createFunction(
  { id: "popup-lead-created", name: "Popup Lead Created" },
  { event: "popup/lead.created" },
  async ({ event, step }) => {
    await step.run("send-emails", async () => {
      await handlePopupLeadCreated(event.data as PayloadBase);
    });
  }
);
```

- [ ] **Step 5: Inngest functions index'ine ekle**

Modify: `src/lib/inngest/functions/index.ts` — `popupLeadCreatedFn` export listesine ekle.

- [ ] **Step 6: Run → PASS**

Run: `pnpm vitest run src/lib/inngest/functions/__tests__/popup-lead.test.ts`
Expected: 1 test passed.

- [ ] **Step 7: Commit**

```bash
git add src/lib/inngest/functions/popup-lead.ts src/lib/inngest/functions/index.ts src/lib/inngest/functions/__tests__/popup-lead.test.ts src/server/db/mutations/popup.ts
git commit -m "feat(inngest): popup/lead.created handler with dual email"
```

---

### Task 11: Problem text resolver (i18n → text)

**Files:**
- Modify: `src/lib/popup/problems.ts` (resolveProblemText helper ekle)
- Test: mevcut `src/lib/popup/__tests__/problems.test.ts`'e ekle

- [ ] **Step 1: Test ekle**

`problems.test.ts`'e ekle:

```typescript
import { resolveProblemText } from "../problems";
import tr from "../../../../messages/tr.json";
import en from "../../../../messages/en.json";

describe("resolveProblemText", () => {
  it("TR metni döner", () => {
    expect(resolveProblemText("manuel-surec-yavaslatiyor", "tr")).toBe(
      (tr as any).popup.problems["manuel-surec-yavaslatiyor"]
    );
  });

  it("EN metni döner", () => {
    expect(resolveProblemText("reklam-maliyeti-artisi", "en")).toBe(
      (en as any).popup.problems["reklam-maliyeti-artisi"]
    );
  });

  it("bilinmeyen slug için slug'ı döner (fallback)", () => {
    expect(resolveProblemText("unknown-xxx", "tr")).toBe("unknown-xxx");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: resolveProblemText implement et**

`src/lib/popup/problems.ts` sonuna ekle:

```typescript
import trMessages from "../../../messages/tr.json";
import enMessages from "../../../messages/en.json";

const TR_PROBLEMS = (trMessages as any).popup?.problems ?? {};
const EN_PROBLEMS = (enMessages as any).popup?.problems ?? {};

export function resolveProblemText(slug: ProblemSlug, locale: "tr" | "en"): string {
  const bundle = locale === "tr" ? TR_PROBLEMS : EN_PROBLEMS;
  return bundle[slug] ?? slug;
}
```

- [ ] **Step 4: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/problems.test.ts`
Expected: 8 tests passed (mevcut 5 + yeni 3).

- [ ] **Step 5: Commit**

```bash
git add src/lib/popup/problems.ts src/lib/popup/__tests__/problems.test.ts
git commit -m "feat(popup): resolveProblemText for server-side i18n"
```

---

### Task 12: tRPC popup router — popup.submit mutation

**Files:**
- Create: `src/server/routers/popup.ts`
- Modify: `src/server/routers/_app.ts`
- Test: `src/server/routers/__tests__/popup.test.ts`

- [ ] **Step 1: Test yaz (DB + Cal.com + Inngest mock)**

Dosya: `src/server/routers/__tests__/popup.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { popupRouter } from "../popup";
import type { PopupSubmitInput } from "../../lib/popup/schemas";

const mockReturning = vi.fn().mockResolvedValue([{ id: "sub_123" }]);
vi.mock("../../db", () => ({
  db: {
    insert: () => ({ values: () => ({ returning: mockReturning }) }),
  },
}));

const mockCalCom = vi.fn().mockResolvedValue({ bookingId: "cal_abc", bookingUrl: "https://cal.com/x" });
vi.mock("../../../lib/cal-com/quick-book", () => ({
  createQuickBooking: (...args: unknown[]) => mockCalCom(...args),
}));

const mockInngest = vi.fn().mockResolvedValue(undefined);
vi.mock("../../../lib/inngest/client", () => ({
  inngest: { send: (...args: unknown[]) => mockInngest(...args) },
}));

const bookingPayload: PopupSubmitInput = {
  sessionId: "sess_1",
  persona: "donusum-teknoloji",
  problems: ["manuel-surec-yavaslatiyor", "verimsizlik-goremiyorum", "ai-uygulama-bilmiyorum"],
  submissionType: "booking",
  locale: "tr",
  lead: {
    firstName: "Ali",
    lastName: "Veli",
    phone: "+905551234567",
    email: "ali@ornek.com",
    company: "Test AŞ",
    title: "CTO",
    kvkkConsent: true,
  },
};

const caller = popupRouter.createCaller({ locale: "tr", ip: "127.0.0.1" } as any);

describe("popupRouter.submit", () => {
  beforeEach(() => {
    mockReturning.mockClear();
    mockCalCom.mockClear();
    mockInngest.mockClear();
  });

  it("booking path — DB + Cal.com + Inngest", async () => {
    const res = await caller.submit(bookingPayload);
    expect(mockReturning).toHaveBeenCalled();
    expect(mockCalCom).toHaveBeenCalled();
    expect(mockInngest).toHaveBeenCalledWith(expect.objectContaining({ name: "popup/lead.created" }));
    expect(res.submissionId).toBe("sub_123");
    expect(res.bookingUrl).toBe("https://cal.com/x");
  });

  it("contact path — Cal.com'u atlar, Inngest'i tetikler", async () => {
    await caller.submit({ ...bookingPayload, submissionType: "contact" });
    expect(mockCalCom).not.toHaveBeenCalled();
    expect(mockInngest).toHaveBeenCalled();
  });

  it("skipped — DB write, Inngest yok", async () => {
    const { lead, ...rest } = bookingPayload;
    await caller.submit({ ...rest, submissionType: "skipped" } as PopupSubmitInput);
    expect(mockReturning).toHaveBeenCalled();
    expect(mockInngest).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: popup.ts router yaz**

Dosya: `src/server/routers/popup.ts`

```typescript
import { router, publicProcedure } from "../trpc";
import { popupSubmitSchema } from "../../lib/popup/schemas";
import { db } from "../db";
import { popupSubmissions } from "../db/schema";
import { createQuickBooking } from "../../lib/cal-com/quick-book";
import { inngest } from "../../lib/inngest/client";
import { resolveProblemText } from "../../lib/popup/problems";

function personaLabel(persona: "donusum-teknoloji" | "buyume-pazarlar", locale: "tr" | "en"): string {
  if (persona === "donusum-teknoloji") {
    return locale === "tr" ? "Dönüşüm ve Teknoloji" : "Transformation & Technology";
  }
  return locale === "tr" ? "Büyüme ve Yeni Pazarlar" : "Growth & New Markets";
}

export const popupRouter = router({
  submit: publicProcedure
    .input(popupSubmitSchema)
    .mutation(async ({ input }) => {
      const now = new Date();
      let calComBookingId: string | null = null;
      let bookingUrl: string | null = null;

      if (input.submissionType === "booking" && input.lead) {
        const result = await createQuickBooking({
          firstName: input.lead.firstName,
          lastName: input.lead.lastName,
          email: input.lead.email,
          phone: input.lead.phone,
          company: input.lead.company,
          title: input.lead.title,
          persona: input.persona,
          locale: input.locale,
        });
        calComBookingId = result.bookingId;
        bookingUrl = result.bookingUrl;
      }

      const [row] = await db
        .insert(popupSubmissions)
        .values({
          sessionId: input.sessionId,
          persona: input.persona,
          problems: input.problems,
          firstName: input.lead?.firstName ?? null,
          lastName: input.lead?.lastName ?? null,
          phone: input.lead?.phone ?? null,
          email: input.lead?.email ?? null,
          company: input.lead?.company ?? null,
          title: input.lead?.title ?? null,
          submissionType: input.submissionType,
          kvkkConsentAt: input.lead?.kvkkConsent ? now : null,
          locale: input.locale,
          calComBookingId,
          userAgent: input.userAgent ?? null,
          referrer: input.referrer ?? null,
          utmSource: input.utmSource ?? null,
          utmMedium: input.utmMedium ?? null,
          utmCampaign: input.utmCampaign ?? null,
        })
        .returning({ id: popupSubmissions.id });

      if ((input.submissionType === "booking" || input.submissionType === "contact") && input.lead) {
        const problemTexts = input.problems.map((slug) => resolveProblemText(slug, input.locale));

        await inngest.send({
          name: "popup/lead.created",
          data: {
            submissionId: row.id,
            firstName: input.lead.firstName,
            lastName: input.lead.lastName,
            email: input.lead.email,
            phone: input.lead.phone,
            company: input.lead.company,
            title: input.lead.title,
            persona: input.persona,
            personaLabel: personaLabel(input.persona, input.locale),
            problems: problemTexts,
            submissionType: input.submissionType,
            calComBookingUrl: bookingUrl,
            locale: input.locale,
            utm: {
              source: input.utmSource ?? null,
              medium: input.utmMedium ?? null,
              campaign: input.utmCampaign ?? null,
            },
          },
        });
      }

      return { submissionId: row.id, bookingUrl };
    }),
});
```

- [ ] **Step 4: _app.ts'e bağla**

Modify: `src/server/routers/_app.ts`

```typescript
import { popupRouter } from "./popup";

export const appRouter = router({
  // mevcut router'lar (booking, brief, consultant, package, tool, user) korunur
  popup: popupRouter,
});
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/server/routers/__tests__/popup.test.ts`
Expected: 3 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/server/routers/popup.ts src/server/routers/_app.ts src/server/routers/__tests__/popup.test.ts
git commit -m "feat(trpc): popup.submit mutation with Cal.com + Inngest orchestration"
```

---

## Phase 3 — Frontend Popup Components

### Task 13: Cookie state + useEntryPopup hook

**Files:**
- Create: `src/lib/popup/cookie.ts`
- Create: `src/lib/popup/use-entry-popup.ts`
- Test: `src/lib/popup/__tests__/cookie.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/popup/__tests__/cookie.test.ts`

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { readPopupCookie, writePopupCookie, shouldShowPopup } from "../cookie";

function clearCookies() {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
}

describe("cookie state", () => {
  beforeEach(clearCookies);

  it("yaz-oku döngüsü çalışır", () => {
    writePopupCookie({
      version: 1,
      lastShownAt: "2026-04-17T10:00:00Z",
      outcome: "completed",
      persona: "donusum-teknoloji",
      problems: ["a", "b", "c"],
      expiresAt: "2026-10-17T10:00:00Z",
    });
    const r = readPopupCookie();
    expect(r?.outcome).toBe("completed");
    expect(r?.persona).toBe("donusum-teknoloji");
  });

  it("cookie yoksa null döner", () => {
    expect(readPopupCookie()).toBeNull();
  });

  describe("shouldShowPopup", () => {
    it("cookie yoksa gösterir", () => {
      expect(shouldShowPopup(new Date())).toBe(true);
    });

    it("completed & geçerli → göstermez", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: "2026-04-17T00:00:00Z",
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: ["a", "b", "c"],
        expiresAt: "2026-10-17T00:00:00Z",
      });
      expect(shouldShowPopup(new Date("2026-04-20T00:00:00Z"))).toBe(false);
    });

    it("completed & süresi dolmuş → gösterir", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: "2025-10-17T00:00:00Z",
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: ["a", "b", "c"],
        expiresAt: "2026-04-17T00:00:00Z",
      });
      expect(shouldShowPopup(new Date("2026-04-18T00:00:00Z"))).toBe(true);
    });

    it("dismissed & geçerli → göstermez (30 gün)", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: "2026-04-17T00:00:00Z",
        outcome: "dismissed",
        persona: null,
        problems: [],
        expiresAt: "2026-05-17T00:00:00Z",
      });
      expect(shouldShowPopup(new Date("2026-04-25T00:00:00Z"))).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: cookie.ts yaz**

Dosya: `src/lib/popup/cookie.ts`

```typescript
import type { PopupCookieState } from "./types";

export const POPUP_COOKIE_NAME = "indoles_popup_state";
const COMPLETED_TTL_MS = 180 * 24 * 60 * 60 * 1000; // 6 ay
const DISMISSED_TTL_MS = 30 * 24 * 60 * 60 * 1000;  // 30 gün

export function readPopupCookie(): PopupCookieState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|; )${POPUP_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match[2]);
    const parsed = JSON.parse(decoded) as PopupCookieState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writePopupCookie(state: PopupCookieState): void {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(JSON.stringify(state));
  const expires = new Date(state.expiresAt).toUTCString();
  document.cookie = `${POPUP_COOKIE_NAME}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
}

export function computeExpiresAt(outcome: PopupCookieState["outcome"], now: Date = new Date()): string {
  const ttl = outcome === "completed" ? COMPLETED_TTL_MS : DISMISSED_TTL_MS;
  return new Date(now.getTime() + ttl).toISOString();
}

export function shouldShowPopup(now: Date = new Date()): boolean {
  const state = readPopupCookie();
  if (!state) return true;
  return new Date(state.expiresAt).getTime() < now.getTime();
}
```

- [ ] **Step 4: use-entry-popup.ts yaz**

Dosya: `src/lib/popup/use-entry-popup.ts`

```typescript
"use client";

import { useEffect, useState } from "react";
import { shouldShowPopup, readPopupCookie } from "./cookie";

const TRIGGER_DELAY_MS = 4000;

export function useEntryPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldShowPopup()) return;
    const t = setTimeout(() => setOpen(true), TRIGGER_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return {
    open,
    forceOpen: () => setOpen(true),
    close: () => setOpen(false),
  };
}

export function readCurrentPersona() {
  return readPopupCookie()?.persona ?? null;
}
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/cookie.test.ts --environment jsdom`
Expected: 5 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/popup/cookie.ts src/lib/popup/use-entry-popup.ts src/lib/popup/__tests__/cookie.test.ts
git commit -m "feat(popup): cookie state + useEntryPopup hook"
```

---

### Task 14: PostHog event helpers

**Files:**
- Create: `src/lib/popup/analytics.ts`
- Test: `src/lib/popup/__tests__/analytics.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/popup/__tests__/analytics.test.ts`

```typescript
import { describe, it, expect, vi } from "vitest";
import { trackPopupEvent } from "../analytics";

const mockCapture = vi.fn();
vi.mock("../../analytics/posthog", () => ({
  posthog: { capture: (...args: unknown[]) => mockCapture(...args) },
}));

describe("trackPopupEvent", () => {
  it("popup_shown event'i capture eder", () => {
    trackPopupEvent("popup_shown", { trigger_source: "initial" });
    expect(mockCapture).toHaveBeenCalledWith("popup_shown", { trigger_source: "initial" });
  });

  it("popup_stage1_selected event'i capture eder", () => {
    trackPopupEvent("popup_stage1_selected", { persona: "donusum-teknoloji", time_on_stage_ms: 5000 });
    expect(mockCapture).toHaveBeenCalledWith("popup_stage1_selected", {
      persona: "donusum-teknoloji",
      time_on_stage_ms: 5000,
    });
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: analytics.ts yaz**

Dosya: `src/lib/popup/analytics.ts`

```typescript
import { posthog } from "../analytics/posthog";

export type PopupEventMap = {
  popup_shown: { trigger_source: "initial" | "hero_chip" | "manual"; time_to_show_ms?: number };
  popup_stage1_selected: { persona: string; time_on_stage_ms: number };
  popup_stage2_submitted: { persona: string; problems: string[]; time_on_stage_ms: number };
  popup_stage3_viewed: { persona: string; problems: string[] };
  popup_booking_submitted: { persona: string; problems: string[]; lead_id: string; locale: string };
  popup_contact_submitted: { persona: string; problems: string[]; lead_id: string; locale: string };
  popup_dismissed: { at_stage: "stage1" | "stage2" | "stage3"; persona?: string; problems?: string[] };
  popup_reopened: { from: "hero_chip" | "footer" | "manual"; previous_persona?: string };
  popup_cal_com_redirect: { booking_id: string };
  popup_kvkk_consent_given: { stage: "booking" | "contact" };
};

export function trackPopupEvent<K extends keyof PopupEventMap>(
  event: K,
  payload: PopupEventMap[K]
): void {
  posthog.capture(event, payload as Record<string, unknown>);
}
```

- [ ] **Step 4: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/analytics.test.ts`
Expected: 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/popup/analytics.ts src/lib/popup/__tests__/analytics.test.ts
git commit -m "feat(analytics): typed popup event map for PostHog"
```

---

### Task 15: ProgressIndicator component

**Files:**
- Create: `src/components/marketing/entry-popup/ProgressIndicator.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/ProgressIndicator.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressIndicator } from "../ProgressIndicator";

describe("ProgressIndicator", () => {
  it("current/total'ı render eder", () => {
    render(<ProgressIndicator current={2} total={3} />);
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
  });

  it("doğru sayıda nokta render eder", () => {
    const { container } = render(<ProgressIndicator current={1} total={3} />);
    expect(container.querySelectorAll("[data-dot]").length).toBe(3);
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Component yaz**

```tsx
import * as React from "react";

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            data-dot
            className={`h-1.5 w-1.5 rounded-full ${i < current ? "bg-neutral-900" : "bg-neutral-300"}`}
          />
        ))}
      </div>
      <span className="text-xs text-neutral-500">{current} / {total}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/entry-popup/ProgressIndicator.tsx src/components/marketing/entry-popup/__tests__/ProgressIndicator.test.tsx
git commit -m "feat(popup): ProgressIndicator component"
```

---

### Task 16: Stage1Persona component

**Files:**
- Create: `src/components/marketing/entry-popup/Stage1Persona.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/Stage1Persona.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stage1Persona } from "../Stage1Persona";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("Stage1Persona", () => {
  it("iki persona kartı render eder", () => {
    render(<Stage1Persona onSelect={() => {}} />);
    const cards = screen.getAllByRole("button").filter((b) => b.getAttribute("data-persona"));
    expect(cards.length).toBe(2);
  });

  it("onSelect doğru slug ile çağrılır", () => {
    const onSelect = vi.fn();
    render(<Stage1Persona onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /donusum-teknoloji/i }));
    expect(onSelect).toHaveBeenCalledWith("donusum-teknoloji");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Component yaz**

```tsx
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PersonaSlug } from "../../../lib/popup/types";
import { PERSONAS } from "../../../lib/popup/personas";

export function Stage1Persona({ onSelect }: { onSelect: (p: PersonaSlug) => void }) {
  const t = useTranslations("popup");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{t("stage1.title")}</h2>
      <p className="text-sm text-neutral-600 mt-2">{t("stage1.subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {PERSONAS.map((p) => (
          <button
            type="button"
            key={p.slug}
            data-persona={p.slug}
            onClick={() => onSelect(p.slug)}
            aria-label={p.slug}
            className="text-left p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <div className="font-medium text-neutral-900">{t(`persona.${p.slug}.label`)}</div>
            <div className="text-xs text-neutral-600 mt-2 leading-relaxed">
              {t(`persona.${p.slug}.description`)}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-500 mt-4">{t("stage1.helper")}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/entry-popup/Stage1Persona.tsx src/components/marketing/entry-popup/__tests__/Stage1Persona.test.tsx
git commit -m "feat(popup): Stage1Persona compound-label cards"
```

---

### Task 17: Stage2Problems with FIFO 3-select

**Files:**
- Create: `src/components/marketing/entry-popup/Stage2Problems.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/Stage2Problems.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stage2Problems } from "../Stage2Problems";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("Stage2Problems", () => {
  it("persona için 10 problem render eder", () => {
    render(<Stage2Problems persona="donusum-teknoloji" onBack={() => {}} onSubmit={() => {}} />);
    expect(screen.getAllByRole("checkbox").length).toBe(10);
  });

  it("3 seçilene kadar Next disabled", () => {
    render(<Stage2Problems persona="buyume-pazarlar" onBack={() => {}} onSubmit={() => {}} />);
    const next = screen.getByRole("button", { name: /next/i });
    expect(next).toBeDisabled();
    const items = screen.getAllByRole("checkbox");
    fireEvent.click(items[0]);
    fireEvent.click(items[1]);
    expect(next).toBeDisabled();
    fireEvent.click(items[2]);
    expect(next).not.toBeDisabled();
  });

  it("4. seçim FIFO ile ilki düşürür", () => {
    const onSubmit = vi.fn();
    render(<Stage2Problems persona="donusum-teknoloji" onBack={() => {}} onSubmit={onSubmit} />);
    const items = screen.getAllByRole("checkbox");
    fireEvent.click(items[0]);
    fireEvent.click(items[1]);
    fireEvent.click(items[2]);
    fireEvent.click(items[3]);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    const payload = onSubmit.mock.calls[0][0] as string[];
    expect(payload.length).toBe(3);
    const slugs = items.map((el) => el.getAttribute("data-slug"));
    expect(payload).not.toContain(slugs[0]);
    expect(payload).toContain(slugs[1]);
    expect(payload).toContain(slugs[2]);
    expect(payload).toContain(slugs[3]);
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Component yaz**

Dosya: `src/components/marketing/entry-popup/Stage2Problems.tsx`

```tsx
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PersonaSlug, ProblemSlug } from "../../../lib/popup/types";
import { getProblemsForPersona } from "../../../lib/popup/problems";

type Props = {
  persona: PersonaSlug;
  onBack: () => void;
  onSubmit: (selected: ProblemSlug[]) => void;
};

export function Stage2Problems({ persona, onBack, onSubmit }: Props) {
  const t = useTranslations("popup");
  const problems = React.useMemo(() => getProblemsForPersona(persona), [persona]);
  const [selected, setSelected] = React.useState<ProblemSlug[]>([]);
  const [fifoHint, setFifoHint] = React.useState(false);

  const toggle = (slug: ProblemSlug) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length < 3) return [...prev, slug];
      setFifoHint(true);
      setTimeout(() => setFifoHint(false), 2000);
      return [...prev.slice(1), slug];
    });
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{t("stage2.title")}</h2>
      <p className="text-sm text-neutral-600 mt-2">{t("stage2.subtitle")}</p>

      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
        {problems.map((p) => {
          const checked = selected.includes(p.slug);
          return (
            <li key={p.slug}>
              <label
                className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition ${
                  checked ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <input
                  type="checkbox"
                  data-slug={p.slug}
                  checked={checked}
                  onChange={() => toggle(p.slug)}
                  className="mt-1"
                />
                <span className="text-sm text-neutral-800">{t(`problems.${p.slug}`)}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {fifoHint ? <p className="text-xs text-amber-700 mt-3">{t("stage2.fifoHint")}</p> : null}

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
        >
          ← {t("meta.back")}
        </button>
        <button
          type="button"
          disabled={selected.length !== 3}
          onClick={() => onSubmit(selected)}
          className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("meta.next")}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS (3 tests)**

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/entry-popup/Stage2Problems.tsx src/components/marketing/entry-popup/__tests__/Stage2Problems.test.tsx
git commit -m "feat(popup): Stage2Problems with FIFO 3-select logic"
```

---

### Task 18: Stage3Actions component

**Files:**
- Create: `src/components/marketing/entry-popup/Stage3Actions.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/Stage3Actions.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stage3Actions } from "../Stage3Actions";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("Stage3Actions", () => {
  it("üç CTA render eder", () => {
    render(
      <Stage3Actions
        onBack={() => {}}
        onBooking={() => {}}
        onContact={() => {}}
        onKeepBrowsing={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: /bookingCta/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contactCta/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /keepBrowsing/i })).toBeInTheDocument();
  });

  it("her CTA doğru callback'i çağırır", () => {
    const onBooking = vi.fn();
    const onContact = vi.fn();
    const onKeep = vi.fn();
    render(
      <Stage3Actions
        onBack={() => {}}
        onBooking={onBooking}
        onContact={onContact}
        onKeepBrowsing={onKeep}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /bookingCta/i }));
    fireEvent.click(screen.getByRole("button", { name: /contactCta/i }));
    fireEvent.click(screen.getByRole("button", { name: /keepBrowsing/i }));
    expect(onBooking).toHaveBeenCalled();
    expect(onContact).toHaveBeenCalled();
    expect(onKeep).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Component yaz**

```tsx
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

type Props = {
  onBack: () => void;
  onBooking: () => void;
  onContact: () => void;
  onKeepBrowsing: () => void;
};

export function Stage3Actions({ onBack, onBooking, onContact, onKeepBrowsing }: Props) {
  const t = useTranslations("popup");

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{t("stage3.title")}</h2>
      <p className="text-sm text-neutral-600 mt-2">{t("stage3.subtitle")}</p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onBooking}
          className="w-full text-left p-4 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition"
          aria-label={t("stage3.bookingCta")}
        >
          <div className="font-medium">{t("stage3.bookingCta")}</div>
          <div className="text-xs opacity-80 mt-1">{t("stage3.bookingHelper")}</div>
        </button>
        <button
          type="button"
          onClick={onContact}
          className="w-full text-left p-4 rounded-md border border-neutral-200 hover:border-neutral-900 transition"
          aria-label={t("stage3.contactCta")}
        >
          <div className="font-medium text-neutral-900">{t("stage3.contactCta")}</div>
          <div className="text-xs text-neutral-600 mt-1">{t("stage3.contactHelper")}</div>
        </button>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button type="button" onClick={onBack} className="text-sm text-neutral-600 hover:text-neutral-900 underline">
          ← {t("meta.back")}
        </button>
        <button
          type="button"
          onClick={onKeepBrowsing}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
          aria-label={t("meta.keepBrowsing")}
        >
          {t("meta.keepBrowsing")} →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/entry-popup/Stage3Actions.tsx src/components/marketing/entry-popup/__tests__/Stage3Actions.test.tsx
git commit -m "feat(popup): Stage3Actions with 3 exit paths"
```

---

### Task 19: LeadFieldsForm + QuickBookForm + ContactForm

**Files:**
- Create: `src/components/marketing/entry-popup/LeadFieldsForm.tsx`
- Create: `src/components/marketing/entry-popup/QuickBookForm.tsx`
- Create: `src/components/marketing/entry-popup/ContactForm.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/LeadFieldsForm.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LeadFieldsForm } from "../LeadFieldsForm";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("LeadFieldsForm", () => {
  it("6 alan + KVKK checkbox render eder", () => {
    render(<LeadFieldsForm onSubmit={() => {}} onBack={() => {}} loading={false} submitLabel="submit" />);
    expect(screen.getByLabelText(/firstName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lastName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /kvkk/i })).toBeInTheDocument();
  });

  it("KVKK işaretlenmeden submit çalışmaz", () => {
    const onSubmit = vi.fn();
    render(<LeadFieldsForm onSubmit={onSubmit} onBack={() => {}} loading={false} submitLabel="submit" />);
    fireEvent.change(screen.getByLabelText(/firstName/i), { target: { value: "Ali" } });
    fireEvent.change(screen.getByLabelText(/lastName/i), { target: { value: "Veli" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+905551234567" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "T" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "CTO" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("tüm alanlar + KVKK ile submit", () => {
    const onSubmit = vi.fn();
    render(<LeadFieldsForm onSubmit={onSubmit} onBack={() => {}} loading={false} submitLabel="submit" />);
    fireEvent.change(screen.getByLabelText(/firstName/i), { target: { value: "Ali" } });
    fireEvent.change(screen.getByLabelText(/lastName/i), { target: { value: "Veli" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+905551234567" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "Test AŞ" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "CTO" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /kvkk/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ kvkkConsent: true }));
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: LeadFieldsForm yaz**

Dosya: `src/components/marketing/entry-popup/LeadFieldsForm.tsx`

```tsx
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PopupLeadForm } from "../../../lib/popup/types";

type Props = {
  onBack: () => void;
  onSubmit: (form: PopupLeadForm) => void;
  loading: boolean;
  submitLabel: string;
};

export function LeadFieldsForm({ onBack, onSubmit, loading, submitLabel }: Props) {
  const t = useTranslations("popup");
  const [form, setForm] = React.useState<PopupLeadForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    kvkkConsent: false,
  });

  const update = (k: keyof PopupLeadForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: k === "kvkkConsent" ? e.target.checked : e.target.value }));

  const filled =
    form.firstName.length >= 2 &&
    form.lastName.length >= 2 &&
    form.phone.length >= 7 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.company.length >= 2 &&
    form.title.length >= 2 &&
    form.kvkkConsent;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!filled || loading) return;
        onSubmit(form);
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.firstName")} id="firstName" value={form.firstName} onChange={update("firstName")} />
        <Field label={t("form.lastName")} id="lastName" value={form.lastName} onChange={update("lastName")} />
      </div>
      <Field label={t("form.phone")} id="phone" type="tel" value={form.phone} onChange={update("phone")} />
      <Field label={t("form.email")} id="email" type="email" value={form.email} onChange={update("email")} />
      <Field label={t("form.company")} id="company" value={form.company} onChange={update("company")} />
      <Field label={t("form.title")} id="title" value={form.title} onChange={update("title")} />

      <label className="flex items-start gap-2 text-xs text-neutral-700 mt-4">
        <input
          type="checkbox"
          aria-label={t("meta.kvkkConsent")}
          checked={form.kvkkConsent}
          onChange={update("kvkkConsent")}
          className="mt-0.5"
        />
        <span>
          {t("meta.kvkkConsent")}{" "}
          <a
            href={t("meta.kvkkLinkHref")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t("meta.kvkkLink")}
          </a>
        </span>
      </label>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
        >
          ← {t("meta.back")}
        </button>
        <button
          type="submit"
          disabled={!filled || loading}
          className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-40"
        >
          {loading ? t("meta.loading") : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-neutral-700 block mb-1">
        {label}
      </label>
      <input
        id={id}
        aria-label={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-neutral-900"
      />
    </div>
  );
}
```

- [ ] **Step 4: QuickBookForm + ContactForm wrapper'ları**

Dosya: `src/components/marketing/entry-popup/QuickBookForm.tsx`

```tsx
"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import { LeadFieldsForm } from "./LeadFieldsForm";
import type { PopupLeadForm } from "../../../lib/popup/types";

export function QuickBookForm(props: {
  onBack: () => void;
  onSubmit: (form: PopupLeadForm) => void;
  loading: boolean;
}) {
  const t = useTranslations("popup");
  return <LeadFieldsForm {...props} submitLabel={t("stage3.bookingCta")} />;
}
```

Dosya: `src/components/marketing/entry-popup/ContactForm.tsx`

```tsx
"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import { LeadFieldsForm } from "./LeadFieldsForm";
import type { PopupLeadForm } from "../../../lib/popup/types";

export function ContactForm(props: {
  onBack: () => void;
  onSubmit: (form: PopupLeadForm) => void;
  loading: boolean;
}) {
  const t = useTranslations("popup");
  return <LeadFieldsForm {...props} submitLabel={t("stage3.contactCta")} />;
}
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/components/marketing/entry-popup/__tests__/LeadFieldsForm.test.tsx --environment jsdom`
Expected: 3 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/entry-popup/LeadFieldsForm.tsx src/components/marketing/entry-popup/QuickBookForm.tsx src/components/marketing/entry-popup/ContactForm.tsx src/components/marketing/entry-popup/__tests__/LeadFieldsForm.test.tsx
git commit -m "feat(popup): shared LeadFieldsForm + QuickBook/Contact wrappers"
```

---

### Task 20: SuccessState component

**Files:**
- Create: `src/components/marketing/entry-popup/SuccessState.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/SuccessState.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessState } from "../SuccessState";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("SuccessState", () => {
  it("booking variant Cal.com URL linkini gösterir", () => {
    render(<SuccessState variant="booking" bookingUrl="https://cal.com/x" onClose={() => {}} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://cal.com/x");
  });

  it("contact variant başlığı render eder", () => {
    render(<SuccessState variant="contact" bookingUrl={null} onClose={() => {}} />);
    expect(screen.getByText(/contactTitle/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Component yaz**

```tsx
"use client";
import * as React from "react";
import { useTranslations } from "next-intl";

type Props = {
  variant: "booking" | "contact";
  bookingUrl: string | null;
  onClose: () => void;
};

export function SuccessState({ variant, bookingUrl, onClose }: Props) {
  const t = useTranslations("popup");
  const title = variant === "booking" ? t("success.bookingTitle") : t("success.contactTitle");
  const body = variant === "booking" ? t("success.bookingBody") : t("success.contactBody");

  return (
    <div className="text-center py-6">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-600 mt-3">{body}</p>

      {variant === "booking" && bookingUrl ? (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm"
        >
          Cal.com
        </a>
      ) : null}

      <div className="mt-6">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
        >
          {t("success.close")}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/entry-popup/SuccessState.tsx src/components/marketing/entry-popup/__tests__/SuccessState.test.tsx
git commit -m "feat(popup): SuccessState for booking/contact completion"
```

---

### Task 21: EntryPopup container (state machine)

**Files:**
- Create: `src/components/marketing/entry-popup/EntryPopup.tsx`
- Create: `src/components/marketing/entry-popup/index.ts` (barrel)
- Test: `src/components/marketing/entry-popup/__tests__/EntryPopup.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EntryPopup } from "../EntryPopup";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => (k: string) => `${ns ?? ""}.${k}`,
  useLocale: () => "tr",
}));

const mockSubmit = vi.fn().mockResolvedValue({ submissionId: "sub_1", bookingUrl: null });
vi.mock("../../../../lib/trpc/client", () => ({
  api: { popup: { submit: { useMutation: () => ({ mutateAsync: mockSubmit, isPending: false }) } } },
}));

describe("EntryPopup", () => {
  it("open=true ise dialog render olur", () => {
    render(<EntryPopup open onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("× butonu onClose'u çağırır", () => {
    const onClose = vi.fn();
    render(<EntryPopup open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("Stage 1 başlangıç state'idir", () => {
    render(<EntryPopup open onClose={() => {}} />);
    expect(screen.getByText(/stage1\.title/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: EntryPopup.tsx yaz**

Dosya: `src/components/marketing/entry-popup/EntryPopup.tsx`

```tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import type { PersonaSlug, ProblemSlug, PopupLeadForm, PopupStage } from "../../../lib/popup/types";
import { Stage1Persona } from "./Stage1Persona";
import { Stage2Problems } from "./Stage2Problems";
import { Stage3Actions } from "./Stage3Actions";
import { QuickBookForm } from "./QuickBookForm";
import { ContactForm } from "./ContactForm";
import { SuccessState } from "./SuccessState";
import { ProgressIndicator } from "./ProgressIndicator";
import { writePopupCookie, computeExpiresAt } from "../../../lib/popup/cookie";
import { trackPopupEvent } from "../../../lib/popup/analytics";
import { api } from "../../../lib/trpc/client";

export type EntryPopupProps = {
  open: boolean;
  onClose: (outcome: "completed" | "skipped" | "dismissed") => void;
};

function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let v = window.sessionStorage.getItem("indoles_session_id");
  if (!v) {
    v = `sess_${crypto.randomUUID()}`;
    window.sessionStorage.setItem("indoles_session_id", v);
  }
  return v;
}

export function EntryPopup({ open, onClose }: EntryPopupProps) {
  const t = useTranslations("popup");
  const locale = useLocale() as "tr" | "en";
  const submit = api.popup.submit.useMutation();

  const [stage, setStage] = React.useState<PopupStage>("stage1");
  const [persona, setPersona] = React.useState<PersonaSlug | null>(null);
  const [problems, setProblems] = React.useState<ProblemSlug[]>([]);
  const [stageStart, setStageStart] = React.useState<number>(Date.now());
  const [bookingUrl, setBookingUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      trackPopupEvent("popup_shown", { trigger_source: "initial" });
      setStageStart(Date.now());
    }
  }, [open]);

  const handleDismiss = React.useCallback(
    (atStage: "stage1" | "stage2" | "stage3") => {
      trackPopupEvent("popup_dismissed", {
        at_stage: atStage,
        persona: persona ?? undefined,
        problems: problems.length ? problems : undefined,
      });
      const outcome: "skipped" | "dismissed" = persona ? "dismissed" : "skipped";
      writePopupCookie({
        version: 1,
        lastShownAt: new Date().toISOString(),
        outcome,
        persona,
        problems,
        expiresAt: computeExpiresAt(outcome),
      });
      if (persona && problems.length === 3) {
        submit
          .mutateAsync({
            sessionId: sessionId(),
            persona,
            problems: problems as [string, string, string],
            submissionType: outcome,
            locale,
          } as any)
          .catch(() => {});
      }
      onClose(outcome);
    },
    [persona, problems, onClose, submit, locale]
  );

  const handleStage1 = (p: PersonaSlug) => {
    trackPopupEvent("popup_stage1_selected", { persona: p, time_on_stage_ms: Date.now() - stageStart });
    setPersona(p);
    setStage("stage2");
    setStageStart(Date.now());
  };

  const handleStage2 = (selected: ProblemSlug[]) => {
    trackPopupEvent("popup_stage2_submitted", {
      persona: persona!,
      problems: selected,
      time_on_stage_ms: Date.now() - stageStart,
    });
    setProblems(selected);
    setStage("stage3");
    setStageStart(Date.now());
    trackPopupEvent("popup_stage3_viewed", { persona: persona!, problems: selected });
  };

  const handleBack = () => {
    if (stage === "stage2") setStage("stage1");
    if (stage === "stage3") setStage("stage2");
    if (stage === "booking" || stage === "contact") setStage("stage3");
  };

  const handleSubmitForm = async (form: PopupLeadForm, type: "booking" | "contact") => {
    if (!persona || problems.length !== 3) return;
    const res = await submit.mutateAsync({
      sessionId: sessionId(),
      persona,
      problems: problems as [string, string, string],
      submissionType: type,
      locale,
      lead: form,
    });
    trackPopupEvent(type === "booking" ? "popup_booking_submitted" : "popup_contact_submitted", {
      persona,
      problems,
      lead_id: res.submissionId,
      locale,
    });
    trackPopupEvent("popup_kvkk_consent_given", { stage: type });
    writePopupCookie({
      version: 1,
      lastShownAt: new Date().toISOString(),
      outcome: "completed",
      persona,
      problems,
      expiresAt: computeExpiresAt("completed"),
    });
    setBookingUrl(res.bookingUrl);
    setStage(type === "booking" ? "success-booking" : "success-contact");
  };

  const progress: Record<PopupStage, { current: number; total: number } | null> = {
    stage1: { current: 1, total: 3 },
    stage2: { current: 2, total: 3 },
    stage3: { current: 3, total: 3 },
    booking: null,
    contact: null,
    "success-booking": null,
    "success-contact": null,
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o && (stage === "success-booking" || stage === "success-contact")) {
          onClose("completed");
        } else if (!o) {
          const atStage = stage === "stage1" ? "stage1" : stage === "stage2" ? "stage2" : "stage3";
          handleDismiss(atStage);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-md z-50" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:inset-auto w-full md:max-w-[560px] bg-white rounded-t-2xl md:rounded-lg shadow-xl p-6 md:p-8 z-50 max-h-[90vh] overflow-y-auto focus:outline-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {progress[stage] ? <ProgressIndicator {...progress[stage]!} /> : null}

              {stage === "stage1" && <Stage1Persona onSelect={handleStage1} />}
              {stage === "stage2" && persona && (
                <Stage2Problems persona={persona} onBack={handleBack} onSubmit={handleStage2} />
              )}
              {stage === "stage3" && persona && (
                <Stage3Actions
                  onBack={handleBack}
                  onBooking={() => setStage("booking")}
                  onContact={() => setStage("contact")}
                  onKeepBrowsing={() => handleDismiss("stage3")}
                />
              )}
              {stage === "booking" && (
                <QuickBookForm
                  onBack={handleBack}
                  onSubmit={(form) => handleSubmitForm(form, "booking")}
                  loading={submit.isPending}
                />
              )}
              {stage === "contact" && (
                <ContactForm
                  onBack={handleBack}
                  onSubmit={(form) => handleSubmitForm(form, "contact")}
                  loading={submit.isPending}
                />
              )}
              {(stage === "success-booking" || stage === "success-contact") && (
                <SuccessState
                  variant={stage === "success-booking" ? "booking" : "contact"}
                  bookingUrl={bookingUrl}
                  onClose={() => onClose("completed")}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label={t("meta.close")}
              className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-900 text-xl leading-none"
            >
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- [ ] **Step 4: Barrel**

Dosya: `src/components/marketing/entry-popup/index.ts`

```typescript
export { EntryPopup } from "./EntryPopup";
export type { EntryPopupProps } from "./EntryPopup";
export { PersonaChip } from "./PersonaChip";
```

- [ ] **Step 5: Run → PASS (3 tests)**

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/entry-popup/EntryPopup.tsx src/components/marketing/entry-popup/index.ts src/components/marketing/entry-popup/__tests__/EntryPopup.test.tsx
git commit -m "feat(popup): EntryPopup container with state machine"
```

---

## Phase 4 — Integration

### Task 22: PersonaChip component

**Files:**
- Create: `src/components/marketing/entry-popup/PersonaChip.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/PersonaChip.test.tsx`

- [ ] **Step 1: Test yaz**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaChip } from "../PersonaChip";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("PersonaChip", () => {
  it("persona seçili ise etiket + değiştir", () => {
    render(<PersonaChip persona="buyume-pazarlar" onReopen={() => {}} />);
    expect(screen.getByText(/chip\.current/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /chip\.change/i })).toBeInTheDocument();
  });

  it("persona null → render etmez", () => {
    const { container } = render(<PersonaChip persona={null} onReopen={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("değiştir → onReopen", () => {
    const onReopen = vi.fn();
    render(<PersonaChip persona="donusum-teknoloji" onReopen={onReopen} />);
    fireEvent.click(screen.getByRole("button", { name: /chip\.change/i }));
    expect(onReopen).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Component yaz**

```tsx
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PersonaSlug } from "../../../lib/popup/types";

type Props = {
  persona: PersonaSlug | null;
  onReopen: () => void;
};

export function PersonaChip({ persona, onReopen }: Props) {
  const t = useTranslations("popup");
  if (!persona) return null;
  const label = t(`persona.${persona}.label`);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
      <span className="text-neutral-700">{t("chip.current", { personaLabel: label })}</span>
      <button
        type="button"
        onClick={onReopen}
        className="underline text-neutral-600 hover:text-neutral-900"
        aria-label={t("chip.change")}
      >
        {t("chip.change")}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/entry-popup/PersonaChip.tsx src/components/marketing/entry-popup/__tests__/PersonaChip.test.tsx
git commit -m "feat(popup): PersonaChip + reopen trigger"
```

---

### Task 23: Homepage hero refactor — single version + chip + popup mount

**Files:**
- Modify: mevcut homepage ve hero component'leri (src/app/(marketing)/[locale]/page.tsx + hero component)
- Modify: `messages/tr.json` + `messages/en.json` (homepage.hero keys)

- [ ] **Step 1: Mevcut hero dosyasını bul**

Run:
```bash
grep -rln "Sanayi" src/components/ src/app/ 2>/dev/null
```
Output: mevcut hero dosyaları.

- [ ] **Step 2: Hero component'ini persona-aware yap**

`src/components/marketing/HomepageHero.tsx` (eğer yoksa oluştur; varsa refactor):

```tsx
"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { readCurrentPersona, useEntryPopup } from "../../lib/popup/use-entry-popup";
import { EntryPopup, PersonaChip } from "./entry-popup";

export function HomepageHero() {
  const t = useTranslations("homepage.hero");
  const [persona, setPersona] = React.useState<"donusum-teknoloji" | "buyume-pazarlar" | null>(null);
  const popup = useEntryPopup();

  React.useEffect(() => {
    setPersona(readCurrentPersona());
  }, [popup.open]);

  const key = persona ?? "default";
  const headline = t(`headline.${key}`);
  const body = t(`body.${key}`);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <PersonaChip persona={persona} onReopen={popup.forceOpen} />
        <h1 className="mt-6 text-4xl md:text-6xl font-semibold text-neutral-900">{headline}</h1>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl">{body}</p>
        <div className="mt-8">
          <a href="/tr/paketler" className="px-5 py-3 bg-neutral-900 text-white rounded-md inline-block">
            {t("cta")}
          </a>
        </div>
      </div>
      <EntryPopup open={popup.open} onClose={popup.close} />
    </section>
  );
}
```

- [ ] **Step 3: i18n key'leri ekle**

`messages/tr.json` root'una (veya mevcut `homepage` node'una):

```json
"homepage": {
  "hero": {
    "headline": {
      "default": "Sanayi için teknoloji dönüşümü, ticaret için agresif büyüme.",
      "donusum-teknoloji": "Sanayi için teknoloji dönüşümü.",
      "buyume-pazarlar": "Ticaret için agresif büyüme."
    },
    "body": {
      "default": "İki disiplin, tek stüdyo. Vaadinizi seçin — dönüşüm veya büyüme.",
      "donusum-teknoloji": "Süreç dönüşümü, AI, iş zekası, otomasyon. Verim ve kurumsal olgunluk.",
      "buyume-pazarlar": "Performans pazarlama, marka, CRO, yeni pazar. Satış hacmi ve müşteri edinimi."
    },
    "cta": "Paketleri incele"
  }
}
```

`messages/en.json` parite:

```json
"homepage": {
  "hero": {
    "headline": {
      "default": "Technology transformation for industry, aggressive growth for commerce.",
      "donusum-teknoloji": "Technology transformation for industry.",
      "buyume-pazarlar": "Aggressive growth for commerce."
    },
    "body": {
      "default": "Two disciplines, one studio. Pick your promise — transformation or growth.",
      "donusum-teknoloji": "Process transformation, AI, BI, automation. Efficiency and corporate maturity.",
      "buyume-pazarlar": "Performance marketing, brand, CRO, new markets. Sales volume and acquisition."
    },
    "cta": "Browse packages"
  }
}
```

- [ ] **Step 4: Homepage page.tsx'te HomepageHero'yu render et**

Mevcut homepage dosyasını aç, hero component'ini `<HomepageHero />` ile değiştir.

- [ ] **Step 5: Smoke test**

Run: `pnpm dev` → `http://localhost:3000/tr`
Expected: 4 sn sonra popup açılır, Stage 1 görünür. Kapatınca hero görünür; persona seçildiyse chip üstte.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/HomepageHero.tsx src/app/ messages/tr.json messages/en.json
git commit -m "refactor(homepage): single-version hero with PersonaChip + popup trigger"
```

---

### Task 24: Chatbot context injection

**Files:**
- Modify: chatbot agent entry (locate: `grep -rln "agent" src/app/api/ src/lib/ai/`)
- Modify: `src/lib/ai/system-prompt.ts` (mevcut ya da oluştur)
- Test: `src/lib/ai/__tests__/popup-context.test.ts`

- [ ] **Step 1: Test yaz**

Dosya: `src/lib/ai/__tests__/popup-context.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { buildPopupContextBlock } from "../system-prompt";

describe("buildPopupContextBlock", () => {
  it("ctx null ise boş string", () => {
    expect(buildPopupContextBlock(null, "tr")).toBe("");
  });

  it("TR persona + problems bloğu üretir", () => {
    const block = buildPopupContextBlock(
      { persona: "donusum-teknoloji", problems: ["Manuel süreç.", "Verim ölçümü yok."] },
      "tr"
    );
    expect(block).toContain("Dönüşüm ve Teknoloji");
    expect(block).toContain("Manuel süreç.");
    expect(block).toContain("methodical");
  });

  it("EN ticaret persona dinamik ton", () => {
    const block = buildPopupContextBlock(
      { persona: "buyume-pazarlar", problems: ["ROAS down."] },
      "en"
    );
    expect(block).toContain("Growth & New Markets");
    expect(block).toContain("dynamic");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: system-prompt.ts builder yaz/genişlet**

Dosya: `src/lib/ai/system-prompt.ts` (mevcut builder varsa ek fonksiyon; yoksa yeni):

```typescript
export type PopupAgentContext = {
  persona: "donusum-teknoloji" | "buyume-pazarlar";
  problems: string[];
} | null;

export function buildPopupContextBlock(ctx: PopupAgentContext, locale: "tr" | "en"): string {
  if (!ctx) return "";
  const personaLabel =
    ctx.persona === "donusum-teknoloji"
      ? locale === "tr"
        ? "Dönüşüm ve Teknoloji"
        : "Transformation & Technology"
      : locale === "tr"
      ? "Büyüme ve Yeni Pazarlar"
      : "Growth & New Markets";
  const problems = ctx.problems.map((p) => `- ${p}`).join("\n");
  const tone = ctx.persona === "donusum-teknoloji" ? "calm, corporate, methodical" : "dynamic, results-oriented, concise";

  return `
[VISITOR CONTEXT FROM POPUP]
Persona: ${personaLabel}
Last 3 selected problems:
${problems}

Rules:
- Do not quote these verbatim in your first message.
- Use them to interpret questions and tailor recommendations.
- Tone: ${tone}.
`.trim();
}
```

- [ ] **Step 4: Agent route'ta cookie'yi oku + builder'ı kullan**

Agent route.ts (mevcut POST handler):

```typescript
import { cookies } from "next/headers";
import { POPUP_COOKIE_NAME } from "@/lib/popup/cookie";
import { resolveProblemText } from "@/lib/popup/problems";
import { buildPopupContextBlock, type PopupAgentContext } from "@/lib/ai/system-prompt";

async function readPopupContext(locale: "tr" | "en"): Promise<PopupAgentContext> {
  const c = cookies().get(POPUP_COOKIE_NAME);
  if (!c?.value) return null;
  try {
    const state = JSON.parse(decodeURIComponent(c.value));
    if (state.outcome !== "completed") return null;
    const problems = (state.problems as string[]).map((slug) => resolveProblemText(slug, locale));
    return { persona: state.persona, problems };
  } catch {
    return null;
  }
}

// POST handler içinde:
const popupCtx = await readPopupContext(locale);
const popupBlock = buildPopupContextBlock(popupCtx, locale);
const systemPrompt = `${baseSystemPrompt}\n\n${popupBlock}`.trim();
```

- [ ] **Step 5: Run → PASS**

Run: `pnpm vitest run src/lib/ai/__tests__/popup-context.test.ts`
Expected: 3 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/ai/system-prompt.ts src/app/api/agent/ src/lib/ai/__tests__/popup-context.test.ts
git commit -m "feat(agent): inject popup persona + problems into chatbot context"
```

---

## Phase 5 — E2E ve polish

### Task 25: Playwright E2E — happy path

**Files:**
- Create: `tests/e2e/entry-popup.spec.ts`

- [ ] **Step 1: E2E yaz**

```typescript
import { test, expect } from "@playwright/test";

test.describe("entry popup happy path", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("Stage 1 → 2 → 3 → contact submit", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /dönüşüm ve teknoloji/i }).click();

    const checkboxes = page.getByRole("checkbox");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await checkboxes.nth(2).check();
    await page.getByRole("button", { name: /devam/i }).click();

    await page.getByRole("button", { name: /bize anlatın/i }).click();

    await page.getByLabel(/ad/i).first().fill("Ali");
    await page.getByLabel(/soyad/i).fill("Veli");
    await page.getByLabel(/telefon/i).fill("+905551234567");
    await page.getByLabel(/e-posta/i).fill("ali@ornek.com");
    await page.getByLabel(/şirket/i).fill("Test AŞ");
    await page.getByLabel(/unvan/i).fill("CTO");
    await page.getByRole("checkbox", { name: /kvkk/i }).check();

    await page.getByRole("button", { name: /bize anlatın/i }).last().click();

    await expect(page.getByText(/teşekkürler/i)).toBeVisible();
  });

  test("skip → popup kapanır", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await page.getByRole("button", { name: /close/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("PersonaChip → popup yeniden açılır", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await page.getByRole("button", { name: /büyüme ve yeni pazarlar/i }).click();
    await page.getByRole("checkbox").nth(0).check();
    await page.getByRole("checkbox").nth(1).check();
    await page.getByRole("checkbox").nth(2).check();
    await page.getByRole("button", { name: /devam/i }).click();
    await page.getByRole("button", { name: /şimdilik gezinmeye/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page.getByRole("button", { name: /değiştir/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run E2E**

Terminal 1: `pnpm dev`
Terminal 2: `pnpm playwright test tests/e2e/entry-popup.spec.ts`
Expected: 3 tests passed.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/entry-popup.spec.ts
git commit -m "test(e2e): popup happy path + skip + reopen"
```

---

### Task 26: Accessibility testleri

**Files:**
- Create: `tests/e2e/entry-popup-a11y.spec.ts`

- [ ] **Step 1: @axe-core/playwright yüklü mü kontrol**

Run: `pnpm list @axe-core/playwright`
Yoksa: `pnpm add -D @axe-core/playwright`

- [ ] **Step 2: Test yaz**

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("popup accessibility", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("WCAG AA ihlali yok", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
    expect(results.violations).toEqual([]);
  });

  test("ESC popup'ı kapatır", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("Tab focus trap dialog içinde", async ({ page }) => {
    await page.goto("/tr");
    await page.waitForTimeout(4500);
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    expect(["BUTTON", "INPUT", "A"]).toContain(tag);
  });
});
```

- [ ] **Step 3: Run → PASS**

Run: `pnpm playwright test tests/e2e/entry-popup-a11y.spec.ts`
Expected: 3 tests passed.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/entry-popup-a11y.spec.ts package.json pnpm-lock.yaml
git commit -m "test(a11y): popup WCAG AA + keyboard nav"
```

---

## Phase 6 — Docs, ADR, Hardening

### Task 27: ADR-004 — booking duration (1 saat)

**Files:**
- Create: `docs/decisions/ADR-004-booking-duration.md`

- [ ] **Step 1: ADR yaz**

```markdown
# ADR-004: Entry Popup Booking Duration (30 dk → 1 saat)

**Durum:** Accepted
**Tarih:** 2026-04-17
**Bağlam:** `docs/11-funnel-customer-flows.md`, `docs/superpowers/specs/2026-04-17-entry-popup-design.md`

## Karar

Entry popup quick-book akışında ücretsiz görüşme süresi 1 saat olarak belirlenir.
`/app/rezervasyon` (auth'lu) akışında süre 30 dk olarak kalır.

## Gerekçe

- Popup quick-book yüksek niyetli ziyaretçiyi yakalıyor (persona + 3 sorun seçilmiş).
- 30 dk niyet-keşif; 1 saat derinlik-konuşma için uygun.
- "1 saat ücretsiz" CTA'sı daha güçlü promosyon.

## Sonuçlar

- Cal.com yeni event type: `indoles-1saat-gorusme` (round-robin, pillar'a göre).
- Danışman kapasitesi planlaması etkilenir; 3 ay sonra re-değerlendirilir.

## Re-evaluation

- No-show > %30 → süre 45 dk'ya düşür.
- Danışman kapasitesi kritik → popup path'i sadece senior consultants.
```

- [ ] **Step 2: Commit**

```bash
git add docs/decisions/ADR-004-booking-duration.md
git commit -m "docs(adr): ADR-004 booking duration 1 saat for popup"
```

---

### Task 28: ADR-005 — quick-book guest path

**Files:**
- Create: `docs/decisions/ADR-005-quickbook-guest-path.md`

- [ ] **Step 1: ADR yaz**

```markdown
# ADR-005: Popup Quick-Book — Guest Path (Auth Bypass)

**Durum:** Accepted
**Tarih:** 2026-04-17
**Bağlam:** `docs/11-funnel-customer-flows.md`, `docs/09-auth-roles-permissions.md`, `docs/superpowers/specs/2026-04-17-entry-popup-design.md`

## Karar

Entry popup içinden başlatılan rezervasyonda Clerk sign-up zorunlu DEĞİL. 6 alan (ad, soyad, telefon, email, şirket, unvan) + KVKK onayı yeterli. Cal.com booking guest olarak oluşturulur.

`/app/rezervasyon` (dashboard kullanıcıları için) akışında auth gereksinimi korunur.

## Gerekçe

- Friction düşürmek — popup hedefi hızlı lead capture.
- Email + telefon lead follow-up için yeterli.
- Clerk sign-up popup akışını kırıyor, conversion düşürüyor.

## Sonuçlar

- Yeni tablo: `popup_submissions` (bkz. spec §9.2).
- `cal_com_booking_id` guest olarak Cal.com'da kalır.
- Kullanıcı sonradan sign-up yaparsa email match ile bağlanabilir (opsiyonel background job).

## Güvenlik

- `popup.submit` mutation'ında rate limiting (IP, 5/dk) — bkz. Task 31.
- KVKK onayı `z.literal(true)` ile zorunlu.
- reCAPTCHA v2 (spam > %10 olursa eklenir).

## Re-evaluation

- Spam/fake lead > %10 → reCAPTCHA.
- Email doğrulama kritik olursa → opsiyonel magic link.
```

- [ ] **Step 2: Commit**

```bash
git add docs/decisions/ADR-005-quickbook-guest-path.md
git commit -m "docs(adr): ADR-005 quick-book guest path (no auth)"
```

---

### Task 29: Docs güncellemeleri (02, 06, 11, 12)

**Files:**
- Modify: `docs/02-information-architecture.md`
- Modify: `docs/06-data-model.md`
- Modify: `docs/11-funnel-customer-flows.md`
- Modify: `docs/12-analytics-measurement.md`

- [ ] **Step 1: docs/02 — hero değişikliği**

İlgili hero bölümüne not ekle:

```markdown
### Hero — single-version + PersonaChip (2026-04-17)

"İki eksen yan yana" hero switch kalkmıştır (bkz. ADR-005, spec §7).
Yeni davranış:
- Entry popup 4 sn sonra açılır.
- Seçim varsa hero tek versiyon (persona'ya göre copy).
- Seçim yoksa nötr default.
- Hero üstünde `PersonaChip`: seçimi gösterir + "değiştir" ile popup'ı yeniden açar.
```

- [ ] **Step 2: docs/06 — tablo ekle**

```markdown
### popup_submissions

Entry popup'tan gelen lead'ler. Schema: `src/server/db/schema.ts`.

Alanlar: id, created_at, session_id, user_id (nullable), persona, problems[], 
lead PII (ad, soyad, telefon, email, şirket, unvan), submission_type 
(booking/contact/dismissed/skipped), kvkk_consent_at, locale, cal_com_booking_id, 
email_sent_at, user_agent, referrer, utm_*.

İlişki: user_id → users.id (nullable; sign-up sonrası bağlanabilir).
Retention: 24 ay sonra PII anonymize (bkz. popup-retention Inngest cron).
```

- [ ] **Step 3: docs/11 — popup funnel section'ı**

```markdown
## 12. Entry Popup Funnel

Homepage ilk ziyaretçi deneyimi. Spec: `docs/superpowers/specs/2026-04-17-entry-popup-design.md`.

Akış:
1. Homepage yüklendikten 4 sn sonra popup (cookie state uygunsa).
2. Stage 1: Kimsin? (Dönüşüm+Teknoloji / Büyüme+Yeni pazarlar).
3. Stage 2: Persona'ya göre 10 sorun, 3 seç.
4. Stage 3: 1 saatlik rezervasyon / iletişim formu / gezinmeye devam.
5. Rezervasyon: 6 alan + KVKK → Cal.com guest + lead email.
6. İletişim: 6 alan + KVKK → lead email.

Persistence: 6 ay completed, 30 gün dismissed.
ADR'lar: ADR-004 (1 saat), ADR-005 (guest path).
```

- [ ] **Step 4: docs/12 — analytics events**

Mevcut event tablosuna ekle: `popup_shown`, `popup_stage1_selected`, `popup_stage2_submitted`, `popup_stage3_viewed`, `popup_booking_submitted`, `popup_contact_submitted`, `popup_dismissed`, `popup_reopened`, `popup_cal_com_redirect`, `popup_kvkk_consent_given`.

- [ ] **Step 5: Commit**

```bash
git add docs/02-information-architecture.md docs/06-data-model.md docs/11-funnel-customer-flows.md docs/12-analytics-measurement.md
git commit -m "docs: update IA, data model, funnel, analytics for entry popup"
```

---

### Task 30: KVKK aydınlatma sayfası stub (PortableText-safe)

**Files:**
- Create: `src/app/(marketing)/[locale]/gizlilik-kvkk/page.tsx`
- Modify: `sanity/schemas/` (yeni legalPage schema — opsiyonel)
- Modify: `messages/tr.json` + `messages/en.json` (legal.kvkk fallback)

> **Güvenlik:** `dangerouslySetInnerHTML` kullanılmaz. İçerik Sanity PortableText veya markdown-via-React ile render edilir.

- [ ] **Step 1: Sanity legalPage schema (öneri)**

Dosya: `sanity/schemas/legalPage.ts`

```typescript
import { defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    { name: "title", type: "internationalizedArrayString", title: "Başlık" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "body", type: "internationalizedArrayPortableText", title: "İçerik" },
    { name: "lastUpdated", type: "date", title: "Son güncelleme" },
  ],
});
```

Mevcut i18n Sanity pattern'ini projedeki diğer schema'lardan kopyala (adlandırma değişebilir).

- [ ] **Step 2: Page render with PortableText**

Dosya: `src/app/(marketing)/[locale]/gizlilik-kvkk/page.tsx`

```tsx
import * as React from "react";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import { sanityClient } from "../../../../lib/sanity/client";

export default async function KvkkPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "legal.kvkk" });

  // Sanity content query (legalPage with slug 'gizlilik-kvkk' or 'privacy-kvkk')
  const slug = params.locale === "tr" ? "gizlilik-kvkk" : "privacy-kvkk";
  const doc = await sanityClient.fetch(
    `*[_type == "legalPage" && slug.current == $slug][0]`,
    { slug }
  );

  return (
    <article className="prose max-w-3xl mx-auto py-16 px-6">
      <h1>{doc?.title?.[params.locale] ?? t("title")}</h1>
      <p className="text-sm text-neutral-500">{t("lastUpdated")}</p>
      {doc?.body?.[params.locale] ? (
        <PortableText value={doc.body[params.locale]} />
      ) : (
        <p>{t("fallback")}</p>
      )}
    </article>
  );
}
```

- [ ] **Step 3: i18n fallback metinleri ekle**

`messages/tr.json` root'una:

```json
"legal": {
  "kvkk": {
    "title": "KVKK Aydınlatma Metni",
    "lastUpdated": "Son güncelleme: 2026-04-17",
    "fallback": "Aydınlatma metni Sanity'de henüz yayınlanmadı. Content team doldurur."
  }
}
```

`messages/en.json` parite:

```json
"legal": {
  "kvkk": {
    "title": "Privacy Notice (KVKK)",
    "lastUpdated": "Last updated: 2026-04-17",
    "fallback": "Privacy notice not yet published in Sanity. Content team will fill it in."
  }
}
```

- [ ] **Step 4: Aynı pattern `/en/privacy-kvkk` için**

`src/app/(marketing)/[locale]/privacy-kvkk/page.tsx` — TR route'uyla aynı implementation (locale path'e göre çözer).

- [ ] **Step 5: Smoke test**

Run: `pnpm dev` → `http://localhost:3000/tr/gizlilik-kvkk`
Expected: başlık + fallback metin görünür (Sanity doc henüz yok).

- [ ] **Step 6: Commit**

```bash
git add src/app/\(marketing\)/\[locale\]/gizlilik-kvkk/ src/app/\(marketing\)/\[locale\]/privacy-kvkk/ sanity/ messages/tr.json messages/en.json
git commit -m "feat(legal): KVKK stub pages with Sanity PortableText (XSS-safe)"
```

> **Blocker:** Content team launch öncesi Sanity'de `legalPage` doc'unu TR+EN doldurur.

---

### Task 31: Rate limit + retention Inngest cron

**Files:**
- Create: `src/lib/popup/rate-limit.ts`
- Modify: `src/server/routers/popup.ts`
- Create: `src/lib/inngest/functions/popup-retention.ts`
- Modify: `src/lib/inngest/functions/index.ts`
- Test: `src/lib/popup/__tests__/rate-limit.test.ts`

- [ ] **Step 1: Rate limit helper test**

Dosya: `src/lib/popup/__tests__/rate-limit.test.ts`

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, __resetRateLimit } from "../rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("ilk 5 request geçer", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("ip-1").ok).toBe(true);
    }
  });

  it("6. request bloklanır", () => {
    for (let i = 0; i < 5; i++) checkRateLimit("ip-1");
    expect(checkRateLimit("ip-1").ok).toBe(false);
  });

  it("farklı IP'ler bağımsız", () => {
    for (let i = 0; i < 5; i++) checkRateLimit("ip-a");
    expect(checkRateLimit("ip-b").ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: rate-limit.ts yaz**

Dosya: `src/lib/popup/rate-limit.ts`

```typescript
const WINDOW_MS = 60_000;
const LIMIT = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: LIMIT - 1 };
  }
  if (b.count >= LIMIT) return { ok: false, remaining: 0 };
  b.count += 1;
  return { ok: true, remaining: LIMIT - b.count };
}

export function __resetRateLimit(): void {
  buckets.clear();
}
```

- [ ] **Step 4: popup.ts router'a entegre et**

`src/server/routers/popup.ts` submit mutation başına:

```typescript
import { checkRateLimit } from "../../lib/popup/rate-limit";
import { TRPCError } from "@trpc/server";

// mutation içinde, ilk satır olarak:
const ip = (ctx as any).ip ?? (ctx as any).headers?.["x-forwarded-for"] ?? "unknown";
const { ok } = checkRateLimit(`popup:${ip}`);
if (!ok) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
```

- [ ] **Step 5: Retention Inngest function**

Dosya: `src/lib/inngest/functions/popup-retention.ts`

```typescript
import { inngest } from "../client";
import { db } from "../../../server/db";
import { popupSubmissions } from "../../../server/db/schema";
import { and, lt, isNotNull } from "drizzle-orm";

export const popupRetentionFn = inngest.createFunction(
  { id: "popup-retention-anonymize", name: "Popup Retention (24mo PII anonymize)" },
  { cron: "0 3 1 * *" }, // her ayın 1'i, 03:00
  async ({ step }) => {
    await step.run("anonymize-stale-pii", async () => {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - 24);
      await db
        .update(popupSubmissions)
        .set({
          firstName: null,
          lastName: null,
          phone: null,
          email: null,
          company: null,
          title: null,
        })
        .where(and(lt(popupSubmissions.createdAt, cutoff), isNotNull(popupSubmissions.email)));
    });
  }
);
```

`src/lib/inngest/functions/index.ts` export'a ekle.

- [ ] **Step 6: Run → PASS**

Run: `pnpm vitest run src/lib/popup/__tests__/rate-limit.test.ts`
Expected: 3 tests passed.

- [ ] **Step 7: Smoke test retention (opsiyonel)**

```bash
psql $DATABASE_URL -c "INSERT INTO popup_submissions (created_at, session_id, persona, problems, email, submission_type, locale) VALUES (now() - interval '25 months', 'rtest', 'donusum-teknoloji', ARRAY['x','y','z'], 'old@test.com', 'contact', 'tr');"
# Inngest UI'den 'popup-retention-anonymize' trigger et
psql $DATABASE_URL -c "SELECT email FROM popup_submissions WHERE session_id='rtest';"
# Beklenen: null
psql $DATABASE_URL -c "DELETE FROM popup_submissions WHERE session_id='rtest';"
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/popup/rate-limit.ts src/server/routers/popup.ts src/lib/inngest/functions/popup-retention.ts src/lib/inngest/functions/index.ts src/lib/popup/__tests__/rate-limit.test.ts
git commit -m "feat(popup): rate limit submissions + monthly PII retention cron"
```

---

## Self-Review

**Spec coverage (bölüm → task):**

| Spec bölümü | Task'lar |
|---|---|
| §1 Amaç/Scope | Header, açıklama |
| §2 Üç aşamalı akış | Task 21 (EntryPopup) |
| §3 Tetikleme/persistence | Task 13 (cookie/hook) |
| §4 Stage 1 | Task 16 |
| §5 Stage 2 | Task 17 + Task 3 + Task 4 |
| §6 Stage 3 | Task 18, 19, 20 |
| §7 Hero entegrasyon | Task 22 + Task 23 |
| §8 Chatbot | Task 24 |
| §9 Data model | Task 5, 2 |
| §10 Cal.com | Task 7 |
| §11 Lead email | Task 8, 9, 10 |
| §12 KVKK | Task 19 (consent) + Task 30 (page) + Task 31 (retention) |
| §13 i18n | Task 4 |
| §14 Analytics | Task 14 |
| §15 Edge cases | Task 25, 26 + Task 31 (rate limit) |
| §16 ADR | Task 27, 28 |
| §17 Docs | Task 29 |

**Placeholder sweep:** "TODO"/"TBD" yok. Her test adımı concrete kod. Güvenlik: `dangerouslySetInnerHTML` kullanılmıyor (Task 30 PortableText).

**Type consistency:** `PersonaSlug`, `ProblemSlug`, `PopupLeadForm`, `PopupCookieState` her task'ta tutarlı. `submissionType` enum değerleri (booking/contact/dismissed/skipped) her yerde aynı. Cal.com `bookingId`/`bookingUrl` Task 7 ve 12'de aynı shape. `PopupAgentContext` Task 24'te tanımlandığı gibi kullanılıyor.

**Dependency order:** Phase 1 (foundation) → Phase 2 (backend) → Phase 3 (UI) → Phase 4 (integration) → Phase 5 (E2E) → Phase 6 (docs+hardening). Her task bir önceki type/module'ü varsayabilir.

**Implementation nüansları:**
- Cal.com v2 API gerçek response shape ile doğrulanmalı (Task 7). Şu an `id` + `bookingUrl` varsayımıyla yazıldı; Cal.com dashboard event type response schema farklıysa `types.ts` + `quick-book.ts` ayar.
- Task 23 (homepage hero refactor) mevcut hero component path'ine göre düzeltilebilir. Grep adımı bunu açar.
- `messages/*.json` TR copy'si başlangıç; `indoles-brand-voice` skill ile finalize edilir.
- KVKK sayfası Sanity'de content team tarafından doldurulur (launch blocker).

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-17-entry-popup-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Her task için fresh subagent dispatch, aralarda review, hızlı iterasyon.

**2. Inline Execution** — Task'ları bu session'da çalıştır (`executing-plans`), batch execution + checkpoint.

Hangi yaklaşım?
