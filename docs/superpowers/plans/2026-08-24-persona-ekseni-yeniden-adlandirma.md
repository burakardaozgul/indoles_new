# Persona Ekseni Yeniden Adlandırma — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persona ekseninin iki ucunu "Sanayi & Üretim" ve "Perakende & Marka" olarak yeniden adlandırmak, slug'ları anlamlı hale getirmek (`sanayi-uretim` / `perakende-marka`) ve denetimde çıkan persona içerik kusurlarını kapatmak.

**Architecture:** Persona sistemi beş katman: slug (kalıcılık) → içerik adı (`industrial`/`commerce`) → köprü fonksiyon → boyama-öncesi `data-persona` → CSS ile varyant seçimi. Yeniden adlandırma yalnız **slug ve etiket** katmanlarına dokunur; içerik katmanı adları (`industrial`/`commerce`) ve CSS mekanizması olduğu gibi kalır — böylece 30+ persona-aware render noktası hiç değişmez. Slug değişimi kalıcı veriyi (cookie, GA4, lead e-postası) etkilediği için okuma tarafına geriye-dönük eşleme (legacy map) konur; yazma tarafı yalnız yeni slug üretir.

**Tech Stack:** Next.js 15 (App Router, RSC), next-intl, Zod, Vitest, Playwright.

**Spec:** Bu plan bir brainstorming oturumundan değil, 2026-08-24 persona sistemi denetiminden türedi. Denetim bulguları bu dosyanın §Denetim Bulguları bölümünde; ilgili otoriteler `docs/01-vision-positioning.md` §3 (iki eksen), `docs/03-brand-voice-tone.md` §1–3 (ton matrisi), `docs/15-content-audit.md` §A1/A5.

## Global Constraints

- **İçerik katmanı adları değişmez:** `Persona = "industrial" | "commerce"` (`src/lib/content/types.ts`) sabittir. Yalnız `PersonaSlug` ve görünen etiketler değişir.
- **TR etiketler:** `Sanayi & Üretim` · `Perakende & Marka` (ampersan, ikinci kelime büyük harfle).
- **EN etiketler:** `Industry & Manufacturing` · `Retail & Commerce`.
- **Kısa etiketler (PersonaSwitch):** TR `Sanayi` / `Perakende`, EN `Industry` / `Retail`.
- **Yeni slug'lar:** `sanayi-uretim` · `perakende-marka`.
- **Eski slug'lar:** `donusum-teknoloji` · `buyume-pazarlar` — yalnız **okuma** tarafında kabul edilir, hiçbir yerde yeniden üretilmez.
- Renk, tipografi, spacing token'lardan okunur; literal hex/px yazılmaz (CLAUDE.md §8).
- Markdown ve kod yorumlarında emoji yok (CLAUDE.md §3).
- Türkçe metinlerde gereksiz anglicizm yok.
- Her task sonunda `pnpm test` ve `pnpm typecheck` yeşil olmalı.

---

## Denetim Bulguları (bu planın gerekçesi)

| # | Bulgu | Task |
|---|---|---|
| B1 | Persona etiketleri eski eksen adlarını taşıyor ("Ticaret ve perakende") | 2 |
| B2 | Slug'lar ihtiyaç ekseninden kalma, kitle eksenini yansıtmıyor | 1 |
| B3 | `hero.tsx`, `pillars-section.tsx`, `cta-section.tsx` hiçbir yerden import edilmiyor; `home.hero.personas.*` (12 anahtar × 2 dil) ölü | 4 |
| B4 | `home.proof.featured.*` — `cases.ts`'te karşılığı olmayan "%42 planlama süresi" vakası; doğrulanamayan metrik (docs/04 §10 ihlali) | 5 |
| B5 | `home.proof._personas.commerce.featured.summary` ticaret personasına üretim planlama vakası anlatıyor | 5 |
| B6 | `home.pillars._personas.commerce.transform` yalnız e-ticaret operasyonundan söz ediyor; perakende zinciri kapsam dışı | 6 |
| B7 | `docs/03` ton matrisi "Homepage hero: Persona-aware" ve "Vaka detay: Persona-aware" diyor; ikisi de uygulanmamış | 7 |
| B8 | `visitor-profile.ts` persona enum'unu `PERSONAS`tan türetmiyor, elle kopyalıyor — ikinci doğruluk kaynağı | 1 |
| B9 | `SERVICES[5]` (ai-danismanlik) `seo.entities` tr=6 / en=5; TR'deki "yapay zeka ajansı" varyantının EN karşılığı yok | 6 |

**Denetimde temiz çıkanlar (aksiyon gerekmez):**
- `messages/{tr,en}.json` — 247 anahtar, parite tam.
- Route segmentleri 9/9, hizmet slug'ları 12/12, paket 4/4, yazı 16/16 çevrili.
- EN makalelerdeki `/vakalar/...` linkleri kasıtlı: `resolveInlineHref` kanonik TR yolu EN slug'a çeviriyor.
- Vaka slug'larının lokalize olmaması ADR-019 kararı.

---

## File Structure

| Dosya | Sorumluluk | Task |
|---|---|---|
| `src/lib/popup/types.ts` | `PersonaSlug` union — yeni değerler | 1 |
| `src/lib/popup/personas.ts` | `PERSONAS` kaydı, `LEGACY_PERSONA_SLUGS`, `normalizePersonaSlug`, `PERSONA_LABELS` | 1, 2 |
| `src/lib/popup/cookie.ts` | Çerez okuma/yazma; okumada legacy normalizasyonu | 1 |
| `src/lib/popup/problems.ts` | 20 problem kaydının `persona` alanı | 1 |
| `src/lib/schemas/visitor-profile.ts` | Zod enum — `PERSONAS`tan türetilir, legacy kabul eder | 1 |
| `src/app/layout.tsx` | Boyama-öncesi bootstrap script — iki slug kuşağını da tanır | 1 |
| `src/components/marketing/entry-popup/Stage1Persona.tsx` | İkon kaydı slug anahtarlı | 1 |
| `src/components/marketing/persona-switch.tsx` | Anahtar slug'ları + kısa/uzun etiketler | 1, 2 |
| `messages/{tr,en}.json` | `popup.persona.<slug>.*` anahtarları + etiket metinleri | 1, 2 |
| `docs/decisions/ADR-022-persona-axis-rename.md` | Karar kaydı | 8 |

---

## Task 1: Slug migrasyonu

Slug değişimi tek atomik adımdır: union daralırsa typecheck tüm tüketicileri aynı anda kırar, yarım bırakılamaz.

**Files:**
- Modify: `src/lib/popup/types.ts:1`
- Modify: `src/lib/popup/personas.ts:12-64`
- Modify: `src/lib/popup/cookie.ts:19-30`
- Modify: `src/lib/popup/problems.ts:7-28`
- Modify: `src/lib/schemas/visitor-profile.ts:4`
- Modify: `src/app/layout.tsx:52-60`
- Modify: `src/components/marketing/entry-popup/Stage1Persona.tsx:9-12`
- Modify: `src/components/marketing/persona-switch.tsx:13,19`
- Modify: `messages/tr.json:350-368`, `messages/en.json:350-368`
- Test: `src/lib/popup/__tests__/personas.test.ts`, `src/lib/popup/__tests__/cookie.test.ts`

**Interfaces:**
- Produces: `PersonaSlug = "sanayi-uretim" | "perakende-marka"`; `normalizePersonaSlug(value: unknown): PersonaSlug | null` (eski ve yeni slug'ları kabul eder, bilinmeyeni `null` döner); `LEGACY_PERSONA_SLUGS: Readonly<Record<string, PersonaSlug>>`.
- Consumes: yok (ilk task).

- [ ] **Step 1: Legacy eşleme ve normalizasyon için failing test yaz**

`src/lib/popup/__tests__/personas.test.ts` sonuna ekle:

```ts
import { normalizePersonaSlug, LEGACY_PERSONA_SLUGS } from "../personas";

describe("normalizePersonaSlug", () => {
  it("yeni slug'ları olduğu gibi döndürür", () => {
    expect(normalizePersonaSlug("sanayi-uretim")).toBe("sanayi-uretim");
    expect(normalizePersonaSlug("perakende-marka")).toBe("perakende-marka");
  });

  it("eski slug'ları yeni karşılığına eşler", () => {
    expect(normalizePersonaSlug("donusum-teknoloji")).toBe("sanayi-uretim");
    expect(normalizePersonaSlug("buyume-pazarlar")).toBe("perakende-marka");
  });

  it("bilinmeyen değer için null döner", () => {
    expect(normalizePersonaSlug("sanayi")).toBeNull();
    expect(normalizePersonaSlug(undefined)).toBeNull();
    expect(normalizePersonaSlug(42)).toBeNull();
  });

  it("legacy tablo yalnız eski slug'ları içerir", () => {
    expect(Object.keys(LEGACY_PERSONA_SLUGS).sort()).toEqual([
      "buyume-pazarlar",
      "donusum-teknoloji",
    ]);
  });
});
```

- [ ] **Step 2: Testi çalıştır, kırmızı olduğunu doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/personas.test.ts`
Expected: FAIL — `normalizePersonaSlug is not exported`

- [ ] **Step 3: `PersonaSlug` union'ını değiştir**

`src/lib/popup/types.ts:1`:

```ts
export type PersonaSlug = "sanayi-uretim" | "perakende-marka";
```

- [ ] **Step 4: `personas.ts`'i yeni slug'lara ve legacy eşlemeye taşı**

`src/lib/popup/personas.ts` — dosya başındaki blok yorumu ve `PERSONAS` kaydını değiştir:

```ts
/**
 * İki persona — eksen **kitle**dir, ihtiyaç değil.
 *
 * Slug'lar 2026-08-24'te (ADR-022) kitle eksenine hizalandı. Önceki kuşak
 * ihtiyaç ekseninden gelmişti (`donusum-teknoloji` / `buyume-pazarlar`) ve
 * etiketler 2026-08-19'da kitleye çevrilince slug ile görünen ad iki farklı
 * şey söylemeye başlamıştı.
 *
 * Eski slug'lar ziyaretçi çerezlerinde ve gönderilmiş lead kayıtlarında
 * yaşamaya devam ediyor: `normalizePersonaSlug` okuma tarafında ikisini de
 * kabul eder, yazma tarafı yalnız yeni slug üretir.
 *
 * İçerik katmanındaki karşılıkları: `sanayi-uretim` → `industrial`,
 * `perakende-marka` → `commerce` (`lib/hooks/use-persona.ts`).
 */
export const PERSONAS: readonly PersonaDef[] = [
  {
    slug: "sanayi-uretim",
    pillars: ["transform", "build"],
    i18nKey: "popup.persona.sanayi-uretim",
    labelKey: "popup.persona.sanayi-uretim.label",
    descriptionKey: "popup.persona.sanayi-uretim.description",
  },
  {
    slug: "perakende-marka",
    pillars: ["growth"],
    i18nKey: "popup.persona.perakende-marka",
    labelKey: "popup.persona.perakende-marka.label",
    descriptionKey: "popup.persona.perakende-marka.description",
  },
] as const;

/**
 * Eski slug kuşağı → yeni slug. Yalnız okuma tarafında kullanılır.
 *
 * Silinemez: `indoles_persona` ve `indoles_popup_state` çerezlerinin ömrü
 * 6 ay, ve gönderilmiş lead e-postalarında eski değerler duruyor.
 */
export const LEGACY_PERSONA_SLUGS: Readonly<Record<string, PersonaSlug>> = {
  "donusum-teknoloji": "sanayi-uretim",
  "buyume-pazarlar": "perakende-marka",
};

/**
 * Herhangi bir kaynaktan (çerez, API gövdesi, query) gelen değeri geçerli bir
 * persona slug'ına indirger. Tanımadığı değerde `null` döner — çağıran taraf
 * varsayılana düşmeye kendi karar verir.
 */
export function normalizePersonaSlug(value: unknown): PersonaSlug | null {
  if (typeof value !== "string") return null;
  if ((PERSONA_SLUGS as string[]).includes(value)) return value as PersonaSlug;
  return LEGACY_PERSONA_SLUGS[value] ?? null;
}
```

`PERSONA_SLUGS` sabiti `PERSONAS` tanımından hemen sonra geldiği için `normalizePersonaSlug`'ı onun **altına** yerleştir.

- [ ] **Step 5: `PERSONA_LABELS` anahtarlarını yeni slug'lara taşı**

`src/lib/popup/personas.ts` — etiket **metinleri** Task 2'de değişecek, şimdilik yalnız anahtarlar:

```ts
const PERSONA_LABELS: Record<PersonaSlug, { tr: string; en: string }> = {
  "sanayi-uretim": {
    tr: "Sanayi ve üretim",
    en: "Industry & manufacturing",
  },
  "perakende-marka": {
    tr: "Ticaret ve perakende",
    en: "Commerce & retail",
  },
};
```

- [ ] **Step 6: Testi çalıştır, yeşil olduğunu doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/personas.test.ts`
Expected: PASS (yeni `describe` bloğu). Aynı dosyadaki eski `getPersonaLocalizedLabel` assertion'ları hâlâ geçer — metinler değişmedi.

- [ ] **Step 7: Çerez okumasının legacy değeri kabul ettiğine dair failing test yaz**

`src/lib/popup/__tests__/cookie.test.ts` sonuna ekle:

```ts
describe("readPersonaCookie legacy migration", () => {
  it("eski slug taşıyan çerezi yeni slug'a çevirir", () => {
    document.cookie = `${PERSONA_COOKIE_NAME}=donusum-teknoloji; path=/`;
    expect(readPersonaCookie()).toBe("sanayi-uretim");
  });

  it("eski popup çerezindeki persona'yı da çevirir", () => {
    document.cookie = `${POPUP_COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify({
        version: 1,
        lastShownAt: "2026-01-01T00:00:00.000Z",
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: [],
        expiresAt: "2027-01-01T00:00:00.000Z",
      }),
    )}; path=/`;
    expect(readPopupCookie()?.persona).toBe("perakende-marka");
  });
});
```

Dosyanın başındaki import satırına `PERSONA_COOKIE_NAME`, `POPUP_COOKIE_NAME`, `readPersonaCookie`, `readPopupCookie` ekli değilse ekle. Her `it` öncesi çerezi temizleyen mevcut `beforeEach` varsa kullan; yoksa ekle:

```ts
beforeEach(() => {
  document.cookie = `${PERSONA_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  document.cookie = `${POPUP_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
});
```

- [ ] **Step 8: Testi çalıştır, kırmızı olduğunu doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/cookie.test.ts`
Expected: FAIL — `readPersonaCookie()` `null` dönüyor (eski değer `PERSONA_VALUES` listesinde yok)

- [ ] **Step 9: `cookie.ts` okumalarını normalizasyondan geçir**

`src/lib/popup/cookie.ts` — `PERSONA_VALUES` yerel dizisini kaldır, `personas.ts`'e delege et:

```ts
import type { PopupCookieState } from "./types";
import { normalizePersonaSlug } from "./personas";
import type { PersonaSlug } from "./types";
```

`readPersonaCookie` ve `writePersonaCookie`:

```ts
export function readPersonaCookie(): PersonaSlug | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^|; )${PERSONA_COOKIE_NAME}=([^;]+)`),
  );
  const raw = match?.[2] ? decodeURIComponent(match[2]) : null;
  return normalizePersonaSlug(raw);
}

export function writePersonaCookie(value: PersonaSlug): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + PERSONA_TTL_MS).toUTCString();
  document.cookie = `${PERSONA_COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
```

`readPopupCookie` içindeki `return parsed;` satırını persona alanını normalize eden hâliyle değiştir:

```ts
    if (parsed.version !== 1) return null;
    // Çerezdeki persona eski kuşaktan olabilir; okurken yeni slug'a çevrilir.
    // Çerez geri yazılmaz — yazma yalnız ziyaretçi yeni bir seçim yaptığında olur.
    return { ...parsed, persona: normalizePersonaSlug(parsed.persona) };
```

- [ ] **Step 10: Testi çalıştır, yeşil olduğunu doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/cookie.test.ts`
Expected: PASS

- [ ] **Step 11: `problems.ts`'teki 20 persona alanını taşı**

Run:

```bash
cd "indoles-web" && \
sed -i '' 's/persona: "donusum-teknoloji"/persona: "sanayi-uretim"/g; s/persona: "buyume-pazarlar"/persona: "perakende-marka"/g' src/lib/popup/problems.ts && \
grep -c 'sanayi-uretim\|perakende-marka' src/lib/popup/problems.ts
```

Expected çıktı: `20`

- [ ] **Step 12: Zod şemasını tek doğruluk kaynağına bağla**

`src/lib/schemas/visitor-profile.ts` — elle yazılmış enum'u kaldır (B8):

```ts
import { z } from 'zod';
import { PERSONAS, normalizePersonaSlug } from '@/lib/popup/personas';
import type { PersonaSlug } from '@/lib/popup/types';

const personaSlugs = PERSONAS.map((p) => p.slug) as [PersonaSlug, ...PersonaSlug[]];

/**
 * Persona alanı iki slug kuşağını da kabul eder ve yeniye indirger.
 *
 * Gerekçe: slug değişimi (ADR-022) yayına alındığında tarayıcısında eski
 * bundle açık duran ziyaretçinin gönderimi eski slug taşır. Reddetmek o lead'i
 * kaybetmek demek; `preprocess` sessizce çevirir.
 */
const personaEnum = z.preprocess(
  (v) => normalizePersonaSlug(v) ?? v,
  z.enum(personaSlugs),
);
```

Ardından şema gövdesindeki `persona:` satırını `persona: personaEnum,` yap.

- [ ] **Step 13: Boyama-öncesi bootstrap script'ini iki kuşağa da açık hale getir**

`src/app/layout.tsx:52-60` — `PERSONA_BOOTSTRAP` sabitini değiştir:

```ts
/**
 * Persona merceğini ilk boyamadan ÖNCE kök elemana yazar.
 * Persona-aware metinler iki varyantı da DOM'a basar ve doğrusunu CSS seçer
 * (bkz. globals.css `[data-persona-variant]`). React'in kendisi seçemez:
 * sunucu `industrial` render eder, istemci cookie'yi okuyup `commerce`
 * render ederse hydration uyuşmazlığı olur. Bu yüzden seçim CSS'e,
 * cookie okuma da bu senkron script'e ait.
 *
 * İki slug kuşağını da tanır (ADR-022): 6 aylık çerez ömrü boyunca eski
 * değerler dolaşımda kalacak. Script `personas.ts`'i import edemez — inline
 * çalışır, bundle'dan önce — bu yüzden eşleme burada elle tekrarlanır.
 */
const PERSONA_BOOTSTRAP =
  "try{var m=document.cookie.match(/(?:^|; )indoles_persona=([^;]+)/);" +
  "var v=m&&decodeURIComponent(m[1]);" +
  "if(!v){var p=document.cookie.match(/(?:^|; )indoles_popup_state=([^;]+)/);" +
  "if(p){v=(JSON.parse(decodeURIComponent(p[1]))||{}).persona}}" +
  "var C={'perakende-marka':'commerce','buyume-pazarlar':'commerce'," +
  "'sanayi-uretim':'industrial','donusum-teknoloji':'industrial'};" +
  "if(C[v]){document.documentElement.setAttribute('data-persona',C[v])}}catch(e){}";
```

- [ ] **Step 14: `use-persona.ts` köprüsünü yeni slug'a çevir**

`src/lib/hooks/use-persona.ts:11-13`:

```ts
/** Popup persona slug'ı → içerik katmanının persona adı. */
export function toContentPersona(slug: PersonaSlug | null): Persona {
  return slug === "perakende-marka" ? "commerce" : "industrial";
}
```

- [ ] **Step 15: İkon kaydını ve anahtar seçeneklerini yeni slug'a taşı**

`src/components/marketing/entry-popup/Stage1Persona.tsx:9-12`:

```ts
const PERSONA_ICONS: Record<PersonaSlug, React.ReactNode> = {
  "sanayi-uretim": <Cpu size={20} className="text-brand-600" aria-hidden />,
  "perakende-marka": <TrendingUp size={20} className="text-brand-600" aria-hidden />,
};
```

`src/components/marketing/persona-switch.tsx:13` ve `:19` — yalnız `slug` alanları (etiketler Task 2'de):

```ts
    slug: "sanayi-uretim",
```
```ts
    slug: "perakende-marka",
```

- [ ] **Step 16: i18n anahtarlarını yeniden adlandır**

Run:

```bash
cd "indoles-web" && \
sed -i '' 's/"donusum-teknoloji"/"sanayi-uretim"/g; s/"buyume-pazarlar"/"perakende-marka"/g' messages/tr.json messages/en.json && \
node -e "['tr','en'].forEach(l=>{const d=require('./messages/'+l+'.json');const k=Object.keys(d.popup.persona);console.log(l,k)})"
```

Expected çıktı:
```
tr [ 'sanayi-uretim', 'perakende-marka' ]
en [ 'sanayi-uretim', 'perakende-marka' ]
```

- [ ] **Step 17: Kalan test dosyalarındaki slug referanslarını taşı**

Run:

```bash
cd "indoles-web" && \
grep -rl 'donusum-teknoloji\|buyume-pazarlar' src --include='*.ts' --include='*.tsx' | \
grep -v 'src/lib/popup/personas.ts' | \
grep -v 'src/lib/popup/__tests__/cookie.test.ts' | \
grep -v 'src/lib/popup/__tests__/personas.test.ts' | \
grep -v 'src/app/layout.tsx' | \
xargs sed -i '' 's/donusum-teknoloji/sanayi-uretim/g; s/buyume-pazarlar/perakende-marka/g'
```

Dışlanan dört dosya bilinçli: `personas.ts` ile `layout.tsx` legacy eşlemeyi **taşımak zorunda**, iki test dosyası ise legacy davranışı **doğruluyor**.

- [ ] **Step 18: Tam test paketini ve typecheck'i çalıştır**

Run: `pnpm typecheck && pnpm test`
Expected: PASS. Kalan hata varsa kaynağı `grep -rn 'donusum-teknoloji\|buyume-pazarlar' src` ile bul; yalnız yukarıdaki dört dosyada geçmeli.

- [ ] **Step 19: Commit**

```bash
git add -A src messages
git commit -m "refactor: persona slug'larını kitle eksenine hizala

donusum-teknoloji -> sanayi-uretim, buyume-pazarlar -> perakende-marka.
Okuma tarafı iki kuşağı da kabul eder (normalizePersonaSlug); yazma yalnız
yeni slug üretir. visitor-profile şeması artık enum'u PERSONAS'tan türetiyor.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Etiket metinlerini yeniden adlandır

**Files:**
- Modify: `src/lib/popup/personas.ts:55-64`
- Modify: `src/components/marketing/persona-switch.tsx:11-24`
- Modify: `messages/tr.json` → `popup.persona.*.label`
- Modify: `messages/en.json` → `popup.persona.*.label`
- Test: `src/lib/popup/__tests__/personas.test.ts:48-64`

**Interfaces:**
- Consumes: Task 1'in `PersonaSlug` union'ı ve `PERSONA_LABELS` anahtarları.
- Produces: `getPersonaLocalizedLabel(slug, locale)` — yeni metinleri döner. Lead e-postası konu satırı ve `PersonaChip` bu fonksiyondan okur.

- [ ] **Step 1: Yeni etiketleri bekleyen failing test yaz**

`src/lib/popup/__tests__/personas.test.ts:48-64` aralığındaki dört assertion'ı değiştir:

```ts
    expect(getPersonaLocalizedLabel("sanayi-uretim", "tr")).toBe("Sanayi & Üretim");
```
```ts
    expect(getPersonaLocalizedLabel("sanayi-uretim", "en")).toBe("Industry & Manufacturing");
```
```ts
    expect(getPersonaLocalizedLabel("perakende-marka", "tr")).toBe("Perakende & Marka");
```
```ts
    expect(getPersonaLocalizedLabel("perakende-marka", "en")).toBe("Retail & Commerce");
```

- [ ] **Step 2: Testi çalıştır, kırmızı olduğunu doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/personas.test.ts`
Expected: FAIL — `expected 'Sanayi ve üretim' to be 'Sanayi & Üretim'`

- [ ] **Step 3: `PERSONA_LABELS` metinlerini değiştir**

`src/lib/popup/personas.ts`:

```ts
const PERSONA_LABELS: Record<PersonaSlug, { tr: string; en: string }> = {
  "sanayi-uretim": {
    tr: "Sanayi & Üretim",
    en: "Industry & Manufacturing",
  },
  "perakende-marka": {
    tr: "Perakende & Marka",
    en: "Retail & Commerce",
  },
};
```

- [ ] **Step 4: Testi çalıştır, yeşil olduğunu doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/personas.test.ts`
Expected: PASS

- [ ] **Step 5: `PersonaSwitch` etiketlerini değiştir**

`src/components/marketing/persona-switch.tsx:11-24` — `OPTIONS` dizisi:

```ts
const OPTIONS: Array<{
  slug: PersonaSlug;
  persona: "industrial" | "commerce";
  label: { tr: string; en: string };
  full: { tr: string; en: string };
}> = [
  {
    slug: "sanayi-uretim",
    persona: "industrial",
    label: { tr: "Sanayi", en: "Industry" },
    full: { tr: "Sanayi & Üretim", en: "Industry & Manufacturing" },
  },
  {
    slug: "perakende-marka",
    persona: "commerce",
    label: { tr: "Perakende", en: "Retail" },
    full: { tr: "Perakende & Marka", en: "Retail & Commerce" },
  },
];
```

- [ ] **Step 6: Popup etiketlerini ve açıklamalarını değiştir**

`messages/tr.json` → `popup.persona`:

```json
"sanayi-uretim": {
  "label": "Sanayi & Üretim",
  "description": "Süreç, veri ve AI ile operasyonel dönüşüm. Üretim, tedarik, planlama.",
  "descriptionPoints": [
    "Manuel operasyonları otomatikleştirmek",
    "AI'ı üretim ve iş süreçlerine uygulamak",
    "Veri altyapısı ve dijital dönüşüm kurmak"
  ]
},
"perakende-marka": {
  "label": "Perakende & Marka",
  "description": "Marka, kanal ve dönüşümün tek bir büyüme sistemine bağlanması.",
  "descriptionPoints": [
    "Pazar payını genişletmek, geliri büyütmek",
    "Marka bilinirliğini ve algısını güçlendirmek",
    "Yeni mağaza, pazar veya satış kanalına açılmak"
  ]
}
```

`messages/en.json` → `popup.persona`:

```json
"sanayi-uretim": {
  "label": "Industry & Manufacturing",
  "description": "Operational transformation through process, data and AI. Production, supply, planning.",
  "descriptionPoints": [
    "Automating manual operations",
    "Bringing AI into production and business processes",
    "Building data infrastructure and digital transformation"
  ]
},
"perakende-marka": {
  "label": "Retail & Commerce",
  "description": "Brand, channels and conversion connected into one growth system.",
  "descriptionPoints": [
    "Expanding market share, growing revenue",
    "Strengthening brand awareness and perception",
    "Opening new stores, markets or sales channels"
  ]
}
```

`descriptionPoints` üçüncü maddesi bilinçli değişti: eski metin ("Yeni coğrafya veya kanallara açılmak") yalnız dijital kanalı ima ediyordu; yeni eksen adı perakendeyi öne aldığı için fiziksel mağaza da anılır.

- [ ] **Step 7: i18n paritesini doğrula**

Run: `pnpm vitest run src/lib/popup/__tests__/i18n-parity.test.ts`
Expected: PASS

- [ ] **Step 8: Tam test paketini çalıştır**

Run: `pnpm typecheck && pnpm test`
Expected: PASS

- [ ] **Step 9: Etiketleri tarayıcıda doğrula**

Run: `pnpm dev`

Kontrol listesi:
1. `http://localhost:3000/tr/hizmetler` — sağdaki "Okuma açısı" anahtarında `Sanayi` / `Perakende` yazmalı; her düğmenin `aria-label`'ı uzun adı taşımalı.
2. `Perakende`ye bas, sayfa metninin ticaret varyantına döndüğünü gör.
3. `http://localhost:3000/en/services` — `Industry` / `Retail`.
4. Çerezleri temizle, `http://localhost:3000/tr` aç, popup Stage 1'de `Sanayi & Üretim` / `Perakende & Marka` başlıklarını gör.

- [ ] **Step 10: Commit**

```bash
git add -A src messages
git commit -m "feat: persona eksen adlarını Sanayi & Üretim / Perakende & Marka yap

Eksen ikinci ucu 'Ticaret ve perakende'den 'Perakende & Marka'ya geçti:
kitle tanımı ticaret genelinden perakende ve marka sahibine daraldı.
EN karşılıklar Industry & Manufacturing / Retail & Commerce.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: GA4 ve lead e-postası sürekliliğini belgele

Slug değişimi GA4'te tarihsel veriyi böler: `popup_stage1_selected` olayının `persona` parametresi 2026-08-24'ten önce `donusum-teknoloji`, sonra `sanayi-uretim` değerini taşır. Kod değişikliği gerekmez — kayıt gerekir, yoksa altı ay sonra raporu okuyan kişi olayın düştüğünü sanır.

**Files:**
- Modify: `docs/12-analytics-measurement.md`

**Interfaces:**
- Consumes: Task 1'in yeni slug değerleri.
- Produces: yok (dokümantasyon).

- [ ] **Step 1: Ölçüm dokümanına kesme notu ekle**

`docs/12-analytics-measurement.md` sonuna ekle:

```markdown
## Veri Kesmeleri (Data Discontinuities)

Bir olayın parametre değerleri değiştiğinde buraya satır eklenir. GA4'te
tarihsel karşılaştırma yapan herkes önce bu tabloya bakar.

| Tarih | Olay | Parametre | Eski değer | Yeni değer | Karar |
|-------|------|-----------|------------|------------|-------|
| 2026-08-24 | `popup_stage1_selected`, `popup_stage2_submitted`, `popup_stage3_viewed`, `popup_booking_submitted`, `popup_contact_submitted`, `popup_dismissed`, `popup_reopened` | `persona` / `previous_persona` | `donusum-teknoloji` | `sanayi-uretim` | ADR-022 |
| 2026-08-24 | (aynı olaylar) | `persona` / `previous_persona` | `buyume-pazarlar` | `perakende-marka` | ADR-022 |

**Rapor tarafında yapılacak:** GA4'te bu tarihe bir annotation düşülür.
Kesme öncesini de kapsayan bir persona raporu kurulacaksa, iki değeri tek
segmentte birleştiren bir "custom dimension" tanımı gerekir; kesmeden sonraki
dönemi tek başına okuyan raporlarda bu gerekmez.
```

- [ ] **Step 2: Lead e-postasının etkilenmediğini doğrula**

`src/lib/email/templates/popup-lead-notification.tsx` `personaLabel` adında hazır bir dizge alır, slug almaz; API route bu dizgeyi `getPersonaLocalizedLabel` ile üretir. Doğrula:

Run: `grep -rn "getPersonaLocalizedLabel" src/app/api src/lib/email`
Expected: API route'ta çağrı görünmeli; e-posta şablonunda slug'a doğrudan referans **olmamalı**.

Şablon slug'a doğrudan bakıyorsa Task 1 Step 17 onu zaten taşımıştır; bu adım yalnız doğrulamadır.

- [ ] **Step 3: Commit**

```bash
git add docs/12-analytics-measurement.md
git commit -m "docs: persona slug kesmesini ölçüm dokümanına işle

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: Ölü persona kodunu ve anahtarlarını kaldır (B3)

`hero.tsx`, `pillars-section.tsx`, `cta-section.tsx` v1 anasayfasından kalma; anasayfa ADR-017 ile v2 bölümlerine geçti ve bu üçü hiçbir yerden import edilmiyor. Onlarla birlikte `home.hero.personas.*` altındaki 12 anahtar (× 2 dil) da ölü.

**Files:**
- Delete: `src/components/marketing/hero.tsx`, `src/components/marketing/pillars-section.tsx`, `src/components/marketing/cta-section.tsx`
- Modify: `messages/tr.json`, `messages/en.json` → `home.hero.personas` alt ağacı

**Interfaces:**
- Consumes: yok.
- Produces: yok (silme).

- [ ] **Step 1: Üç dosyanın gerçekten yetim olduğunu doğrula**

Run:

```bash
cd "indoles-web" && for c in "marketing/hero" "pillars-section" "cta-section"; do
  echo "-- $c"
  grep -rn "$c" src tests --include='*.tsx' --include='*.ts' | grep -v "^src/components/marketing/"
done
```

Expected: üç başlığın altı da boş. Herhangi biri sonuç döndürürse **dur** ve o dosyayı silme listesinden çıkar.

- [ ] **Step 2: Dosyaları sil**

Run:

```bash
cd "indoles-web" && rm src/components/marketing/hero.tsx \
  src/components/marketing/pillars-section.tsx \
  src/components/marketing/cta-section.tsx
```

- [ ] **Step 3: `home.hero.personas` alt ağacını kaldır**

Run:

```bash
cd "indoles-web" && node -e "
const fs=require('fs');
for (const l of ['tr','en']) {
  const p='messages/'+l+'.json';
  const d=JSON.parse(fs.readFileSync(p,'utf8'));
  delete d.home.hero.personas;
  fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n');
  console.log(l, 'home.hero anahtarları:', Object.keys(d.home.hero));
}
"
```

Expected çıktı — iki dilde de `personas` listede olmamalı.

- [ ] **Step 4: Typecheck ve tam test paketi**

Run: `pnpm typecheck && pnpm test`
Expected: PASS. `home.hero.tagline1` / `tagline2` anahtarları da kullanılmıyor olabilir; testler yeşilse onlara bu task'ta dokunma — ayrı bir denetim konusu.

- [ ] **Step 5: Anasayfanın ve /vakalar'ın hâlâ render ettiğini doğrula**

Run: `pnpm build`
Expected: build başarılı, 24 statik URL üretilir.

- [ ] **Step 6: Commit**

```bash
git add -A src messages
git commit -m "chore: v1 anasayfasından kalan yetim persona bileşenlerini kaldır

hero.tsx, pillars-section.tsx, cta-section.tsx ADR-017 ile anasayfa v2
bölümlerine geçtiğinden beri hiçbir yerden import edilmiyordu. Yalnız bu
üçünün okuduğu home.hero.personas.* anahtarları da kaldırıldı.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Doğrulanamayan vaka metnini gerçek vakayla değiştir (B4, B5)

`home.proof.featured.*` altındaki "orta ölçekli sanayi firması, %42 planlama süresi, 2× sevkiyat güvenilirliği" anlatısının `cases.ts`'te karşılığı yok. docs/04 §10 doğrulanamayan metrik yasaklıyor. Ayrıca ticaret varyantı (`_personas.commerce.featured.summary`) aynı üretim planlama vakasını anlatıyor — persona değişiyor, konu değişmiyor.

Gerçek vaka karşılığı: `meccanotecnica-umbra-teklif-portali` (sanayi ekseni, teklif süreci dijitalleştirme) ve `soylu-avm-e-ticaret-buyume` (ticaret ekseni).

**Files:**
- Modify: `messages/tr.json`, `messages/en.json` → `home.proof`
- Test: `tests/unit/cases-content.test.ts`

**Interfaces:**
- Consumes: `CASES` kayıtlarındaki `metrics` alanı.
- Produces: yok.

- [ ] **Step 1: Metinde geçen her rakamın bir vakada bulunmasını şart koşan test yaz**

`tests/unit/cases-content.test.ts` sonuna ekle:

```ts
import trMessages from "../../messages/tr.json";
import { CASES } from "@/lib/content/cases";

describe("home.proof öne çıkan vaka metni", () => {
  it("kullanılan her sayısal iddia gerçek bir vakada geçer", () => {
    const featured = trMessages.home.proof.featured;
    const claims = [
      featured.summary,
      ...featured.metrics.map((m: { value: string }) => m.value),
    ].join(" ");

    const numbers = claims.match(/\d+/g) ?? [];
    const corpus = JSON.stringify(CASES);

    const orphans = numbers.filter((n) => !corpus.includes(n));
    expect(orphans).toEqual([]);
  });
});
```

- [ ] **Step 2: Testi çalıştır, kırmızı olduğunu doğrula**

Run: `pnpm vitest run tests/unit/cases-content.test.ts`
Expected: FAIL — `orphans` boş değil. Mevcut metindeki `42` (planlama süresi) `cases.ts`'te hiç geçmiyor; testin yakalaması gereken tam olarak budur.

- [ ] **Step 3: Seçilen vakaların gerçek verisini doğrula**

Run:

```bash
cd "indoles-web" && npx tsx -e "
import { CASES } from './src/lib/content/cases';
for (const s of ['meccanotecnica-umbra-teklif-portali','soylu-avm-e-ticaret-buyume']) {
  const c = CASES.find(x => x.slug === s)!;
  console.log(c.slug, '|', c.pillar, '|', c.title.tr);
  for (const m of c.metrics) console.log('  ', m.value.tr, '/', m.value.en, '|', m.label.tr);
}
"
```

Expected: aşağıdaki Step 4-5 metinlerinde kullanılan değerlerin aynısı. Ayrışma varsa vaka içeriği bu plan yazıldıktan sonra değişmiş demektir — Step 4-5 metinlerini çıktıya göre düzelt, uydurma.

Not: içerik modülünün export adı `CASES`tir, `CASE_STUDIES` değil.

- [ ] **Step 4: `home.proof.featured` bloğunu Meccanotecnica vakasıyla değiştir**

Öne çıkan vaka sanayi ekseninden seçilir: `/vakalar` varsayılan olarak `industrial` mercekle açılır.

`messages/tr.json` → `home.proof.featured`:

```json
"featured": {
  "clientLabel": "Seçilmiş vaka",
  "title": "AI teknik danışmanla teklif talebinde 10 kat artış.",
  "summary": "Meccanotecnica Umbra'nın ürün kataloğunu, fabrikasını anlatan mühendise uygun donanımı çıkaran bir AI danışmana ve teklif portalına bağladık. Teklif talebi 10 katına çıktı, yanıt süresi yüzde doksan kısaldı.",
  "metrics": [
    { "value": "10×", "label": "Teklif talebi" },
    { "value": "%90", "label": "Yanıt süresi kısalması" },
    { "value": "15.000", "label": "Aylık organik gösterim" }
  ],
  "pillar": "Transform"
}
```

`messages/en.json` → `home.proof.featured`:

```json
"featured": {
  "clientLabel": "Selected case",
  "title": "10× more quote requests, driven by an AI technical advisor.",
  "summary": "We connected Meccanotecnica Umbra's product catalog to an AI advisor that lays out the right equipment for an engineer describing their plant, and to a quote portal. Quote requests rose tenfold and response time dropped by ninety percent.",
  "metrics": [
    { "value": "10×", "label": "Quote requests" },
    { "value": "90%", "label": "Faster response" },
    { "value": "15,000", "label": "Monthly organic impressions" }
  ],
  "pillar": "Transform"
}
```

Metrik sırası vakadaki sırayı korur; dördüncü metrik ("İlk 5 / Google sıralaması") şeride sığmadığı için düşer — mevcut şablon üç metrik basıyor.

- [ ] **Step 5: Persona varyantlarını iki ayrı vakaya ayır**

Sanayi varyantı Meccanotecnica'yı dingin-kurumsal tonda anlatır (docs/03 §2a: mekanizma önce, rakam sonda). Perakende varyantı SOYLU AVM'yi dinamik-atletik tonda anlatır (docs/03 §2b: rakamla açılır, kısa ritim).

`messages/tr.json` → `home.proof._personas`:

```json
"industrial": {
  "eyebrow": "02 — Kanıt",
  "headline": "Her proje ölçülebilir bir çıktıyla kapanır.",
  "lede": "Problem tipine göre filtrele — sektöre göre değil. Benzer ölçekte, benzer darboğazda çalışan bir firmayı gör; kendi dönüşüm ihtimalini somut olarak değerlendir.",
  "featured": {
    "summary": "Mekanik salmastranın dünya ölçeğindeki üreticilerinden birinin Türkiye markası, yerel pazardaki teknik bilinirliğinde global konumunun gerisinde kalmıştı. Ürün kataloğunu, fabrikasını anlatan mühendise uygun donanımı çıkaran bir AI danışmana ve teklif portalına bağladık. Teklif talebi 10 katına çıktı, yanıt süresi yüzde doksan kısaldı, aylık organik gösterim 15.000'e ulaştı."
  }
},
"commerce": {
  "eyebrow": "02 — Kanıt",
  "headline": "Rakam olmadan sonuç sayılmaz.",
  "lede": "Problem tipine göre filtrele. Senin darboğazına en yakın vakayı bul — büyüme metriği, dönüşüm oranı veya operasyon hızı — kendi potansiyelini ölç.",
  "featured": {
    "summary": "İlk 6 günde 1,5 milyon dolar gelir. Toplam trafik %150, organik trafik %70 arttı. SOYLU AVM'nin trafiği ölçülemiyordu ve satış tek kategoriye sıkışmıştı: önce ölçüm altyapısını yeniden kurduk, sonra kampanyayı açtık."
  }
}
```

`messages/en.json` → `home.proof._personas`:

```json
"industrial": {
  "eyebrow": "02 — Proof",
  "headline": "Every engagement closes with a measurable outcome.",
  "lede": "Filter by problem type, not industry. Find a firm of similar scale with a similar bottleneck; evaluate your own transformation potential on concrete ground.",
  "featured": {
    "summary": "The Türkiye arm of one of the world's leading mechanical seal manufacturers had technical visibility that lagged behind its global standing. We connected the product catalog to an AI advisor that lays out the right equipment for an engineer describing their plant, and to a quote portal. Quote requests rose tenfold, response time dropped by ninety percent, and monthly organic impressions reached 15,000."
  }
},
"commerce": {
  "eyebrow": "02 — Proof",
  "headline": "If it isn't a number, it isn't a result.",
  "lede": "Filter by problem type. Find the case closest to your bottleneck — growth metric, conversion rate or operational speed — then measure your own potential.",
  "featured": {
    "summary": "$1.5M in revenue in the first 6 days. Total traffic up 150%, organic traffic up 70%. SOYLU AVM couldn't measure its traffic and sales were stuck in a single category: we rebuilt the measurement stack first, then launched the campaign."
  }
}
```

Ticaret varyantına üretim planlama vakası **yazılmaz** — bulgunun (B5) kendisi buydu.
- [ ] **Step 6: Testi çalıştır, yeşil olduğunu doğrula**

Run: `pnpm vitest run tests/unit/cases-content.test.ts`
Expected: PASS

- [ ] **Step 7: /vakalar sayfasını iki persona ile gözle doğrula**

Run: `pnpm dev`

1. `http://localhost:3000/tr/vakalar` — "Okuma açısı" `Sanayi`, öne çıkan vaka Meccanotecnica.
2. `Perakende`ye bas — anlatı SOYLU AVM'ye dönmeli, ton rakamla açılmalı.
3. Aynı kontrolü `/en/case-studies` üzerinde tekrarla.

- [ ] **Step 8: Commit**

```bash
git add -A messages tests
git commit -m "fix: öne çıkan vaka metnini gerçek vakalara bağla

home.proof.featured cases.ts'te karşılığı olmayan bir üretim planlama
vakası anlatıyordu; ticaret personası da aynı sanayi vakasını görüyordu.
Sanayi varyantı Meccanotecnica, ticaret varyantı SOYLU AVM oldu. Metindeki
her rakamın bir vakada geçtiğini doğrulayan test eklendi.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6: Perakende personasının kapsamını genişlet (B6, B9)

Eksenin ikinci ucu artık "Perakende & Marka" — ama `home.pillars._personas.commerce.transform` yalnız e-ticaret operasyonundan söz ediyor (sipariş akışı, envanter senkronizasyonu). Perakende zinciri alıcısı (mağaza, POS, raf) bu cümlede kendini bulamıyor. Aynı turda `SERVICES[5]` varlık listesindeki EN eksiği kapanır.

**Files:**
- Modify: `messages/tr.json`, `messages/en.json` → `home.pillars._personas.commerce`
- Modify: `src/lib/content/services/ai-danismanlik.ts` → `seo.entities.en`
- Test: `tests/unit/services-content.test.ts`

**Interfaces:**
- Consumes: Task 2'nin eksen adları.
- Produces: yok.

- [ ] **Step 1: `commerce.transform` metnini perakendeyi kapsayacak şekilde yeniden yaz**

`messages/tr.json` → `home.pillars._personas.commerce.transform`:

```json
"transform": {
  "tagline": "Perakende operasyonu hızlanır.",
  "description": "Sipariş akışı, envanter ve mağaza-kanal senkronizasyonu, müşteri segmentasyonu — çevrimiçi ve raf tarafındaki darboğazlar birlikte bulunur, otomasyonla çözülür. Daha az elle iş, daha fazla ölçeklenebilirlik."
}
```

`messages/en.json` → aynı yol:

```json
"transform": {
  "tagline": "Retail operations, accelerated.",
  "description": "Order flow, inventory and store-channel sync, customer segmentation — bottlenecks online and on the shelf are found together and resolved through automation. Less manual work, more scalability."
}
```

- [ ] **Step 2: i18n paritesini ve tam test paketini çalıştır**

Run: `pnpm vitest run src/lib/popup/__tests__/i18n-parity.test.ts && pnpm test`
Expected: PASS

- [ ] **Step 3: `seo.entities` paritesini şart koşan test yaz**

`tests/unit/services-content.test.ts` sonuna ekle:

```ts
describe("hizmet SEO varlık listeleri", () => {
  it("her hizmette TR ve EN varlık sayısı eşit", () => {
    const uneven = SERVICES.filter(
      (s) => s.seo.entities.tr.length !== s.seo.entities.en.length,
    ).map((s) => ({
      slug: s.slug.tr,
      tr: s.seo.entities.tr.length,
      en: s.seo.entities.en.length,
    }));
    expect(uneven).toEqual([]);
  });
});
```

`SERVICES` importu dosyada yoksa ekle: `import { SERVICES } from "@/lib/content/services";`

- [ ] **Step 4: Testi çalıştır, kırmızı olduğunu doğrula**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: FAIL — `[ { slug: 'ai-danismanlik', tr: 6, en: 5 } ]`

- [ ] **Step 5: Eksik EN varlığını ekle**

`src/lib/content/services/ai-danismanlik.ts` → `seo.entities.en` dizisine, TR'deki "yapay zeka ajansı" karşılığı olarak `"AI consultancy"` ekle. Sıra TR ile hizalı tutulur:

```ts
    entities: {
      tr: [
        "INDOLES",
        "yapay zeka danışmanlığı",
        "yapay zeka ajansı",
        "yapay zeka",
        "pilot",
        "veri hazırlığı",
      ],
      en: [
        "INDOLES",
        "AI advisory",
        "AI consultancy",
        "artificial intelligence",
        "pilot",
        "data readiness",
      ],
    },
```

- [ ] **Step 6: Testi çalıştır, yeşil olduğunu doğrula**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: PASS

- [ ] **Step 7: SEO denetimini çalıştır**

Run: `pnpm seo:audit`
Expected: 0 FAIL (mevcut taban 424 test / 0 FAIL)

- [ ] **Step 8: Commit**

```bash
git add -A messages src tests
git commit -m "content: perakende personasını mağaza tarafını kapsayacak şekilde genişlet

Eksen adı 'Perakende & Marka' olunca commerce.transform metni yalnız
e-ticaret operasyonundan söz eder kaldı; mağaza-kanal senkronizasyonu
eklendi. ai-danismanlik seo.entities EN eksiği (tr=6/en=5) kapatıldı ve
pariteyi koruyan test yazıldı.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7: Ton matrisini uygulamayla hizala (B7)

`docs/03-brand-voice-tone.md` §3 ana tablosu "Homepage hero: Persona-aware" ve "Vaka detay: Persona-aware" diyor. Hero ADR-016 ile orta tona geçti (tablonun üstündeki güncelleme notu bunu söylüyor ama tablo satırı düzeltilmedi), vaka detay ise hiç persona-aware olmadı. Tablo kod review'ün referansı; yanlış kaldığı sürece her denetimde aynı sahte bulgu çıkar.

**Files:**
- Modify: `docs/03-brand-voice-tone.md:168-186`
- Modify: `docs/01-vision-positioning.md` → eksen başlıkları
- Modify: `CLAUDE.md` §5 → Persona-Driven Homepage tablosu

**Interfaces:**
- Consumes: Task 2'nin eksen adları.
- Produces: yok.

- [ ] **Step 1: Ton matrisindeki iki satırı düzelt**

`docs/03-brand-voice-tone.md` §3 tablosunda:

`| Homepage hero | Persona-aware | ... |` satırını değiştir:

```markdown
| Homepage hero | Orta ton | Orta-editorial | Orta-editorial | Orta-editorial | Orta-editorial | ADR-016: hero copy'si kanonik konumlandırma cümlesidir, alıcıya göre değişmez |
```

`| Vaka detay | Persona-aware | ... |` satırını değiştir:

```markdown
| Vaka detay | Orta ton | Orta-editorial | Orta-editorial | Orta-editorial | Orta-editorial | Planlandı ama uygulanmadı; vaka anlatısı tek versiyondur. Persona ayrımı vaka **listesinde** yapılır |
```

- [ ] **Step 2: Eksen adlarını üç dokümanda güncelle**

`docs/01-vision-positioning.md`:
- §3 başlığı `### Eksen A — Sanayi için Teknoloji Dönüşümü` → `### Eksen A — Sanayi & Üretim`
- §3 başlığı `### Eksen B — Ticaret için Agresif Büyüme` → `### Eksen B — Perakende & Marka`
- §5 `### Persona 2 — Ticaret/Perakende Markası (Founder/CMO)` → `### Persona 2 — Perakende ve Marka Sahibi (Founder/CMO)`

Vaat paragrafları içeriğiyle doğru; yalnız başlıklar değişir.

`docs/03-brand-voice-tone.md`:
- §2b başlığı `### 2b. Ticaret Tonu (Dinamik-Atletik)` → `### 2b. Perakende ve Marka Tonu (Dinamik-Atletik)`
- §3 tablosunun `Persona 2 (Ticaret/Perakende)` sütun başlığı → `Persona 2 (Perakende ve Marka)`

`CLAUDE.md` §5 → Persona-Driven Homepage tablosu:

```markdown
| Eksen | Hedef Alıcı | Odak | Ton |
|-------|-------------|------|-----|
| (A) Sanayi & Üretim | Sanayici alıcı (büyük şirketler, kurumsal KOBİ'ler) | Dönüşüm, verim, ihracat | Dingin, kurumsal, metodik (McKinsey-benzeri) |
| (B) Perakende & Marka | Perakende zinciri, e-ticaret ve marka sahibi | Büyüme, pazar payı, hız | Dinamik, atletik, sonuç-odaklı (Shopify-benzeri) |
```

- [ ] **Step 3: Kalan eski eksen adlarını tara**

Run:

```bash
cd "indoles-web" && grep -rn "Ticaret ve perakende\|Commerce & retail\|Sanayi ve üretim\|Industry & manufacturing" src messages docs CLAUDE.md
```

Expected: yalnız `docs/15-content-audit.md` (geçmiş denetim kaydı — tarihsel belge, değiştirilmez) ve `docs/superpowers/` altındaki arşiv planlar dönmeli. `src` veya `messages` altından sonuç dönerse Task 2 eksik kalmış demektir.

- [ ] **Step 4: Commit**

```bash
git add docs CLAUDE.md
git commit -m "docs: ton matrisini uygulamayla hizala, eksen adlarını güncelle

Hero (ADR-016) ve vaka detay satırları 'persona-aware' diyordu; ikisi de
orta ton. Eksen adları Sanayi & Üretim / Perakende & Marka olarak
güncellendi (docs/01, docs/03, CLAUDE.md).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8: ADR-022 kaydı

**Files:**
- Create: `docs/decisions/ADR-022-persona-axis-rename.md`
- Modify: `CLAUDE.md` §9 → doküman tablosu satırı (gerekirse)

**Interfaces:**
- Consumes: Task 1-7'nin tamamı.
- Produces: yok.

- [ ] **Step 1: ADR şablonunu oku**

Run: `cat docs/decisions/ADR-template.md`

- [ ] **Step 2: ADR-022'yi yaz**

`docs/decisions/ADR-022-persona-axis-rename.md` — şablon yapısına uyarak şu içerikle:

**Bağlam:** Persona ekseni 2026-08-19'da ihtiyaç ekseninden kitle eksenine çevrildi (docs/15 §A5) ama yalnız etiketler değişti; slug'lar (`donusum-teknoloji` / `buyume-pazarlar`) ihtiyaç ekseninden kaldı. Kod okuyan kişi slug'a bakıp yanlış zihinsel model kuruyordu. Ayrıca ikinci ucun adı ("Ticaret ve perakende") hedef alıcıyı olduğundan geniş tanımlıyordu.

**Karar:**
1. Eksen adları: `Sanayi & Üretim` / `Perakende & Marka` (EN: `Industry & Manufacturing` / `Retail & Commerce`).
2. Slug'lar: `sanayi-uretim` / `perakende-marka`.
3. İçerik katmanı adları (`industrial` / `commerce`) **değişmez** — 30+ render noktasına dokunmamak için.
4. Okuma tarafı eski slug'ları kabul eder (`normalizePersonaSlug`), yazma tarafı yalnız yeni slug üretir.

**Sonuçlar:**
- GA4'te `persona` parametresinde veri kesmesi (docs/12 §Veri Kesmeleri).
- 6 aylık çerez ömrü boyunca legacy eşleme kodda kalır; 2027-03'ten sonra kaldırılabilir.
- Gönderilmiş lead e-postalarında eski etiketler durur — geriye dönük düzeltme yapılmaz.

**Reddedilen alternatifler:**
- *Slug'ları olduğu gibi bırakmak:* ad ile slug arasındaki uyumsuzluk kalıcı olurdu.
- *İçerik katmanı adlarını da değiştirmek:* `industrial`/`commerce` CSS seçicilerinde, 30+ bileşende ve `globals.css`'te geçiyor; kazanç yok, risk yüksek.
- *Legacy eşleme koymamak:* mevcut ziyaretçilerin persona seçimi sessizce sıfırlanırdı.

- [ ] **Step 3: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm build && pnpm seo:audit`
Expected: hepsi yeşil, `seo:audit` 0 FAIL

- [ ] **Step 4: Commit**

```bash
git add docs
git commit -m "docs: ADR-022 — persona ekseni yeniden adlandırma

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Kapsam Dışı

| Kalem | Neden |
|---|---|
| Vaka slug'larını lokalize etmek | ADR-019 kararı; değiştirmek 9 EN URL'i için 301 haritası ve sitemap revizyonu gerektirir — ayrı bir iş |
| `ArticleTopic` union'ını İngilizceleştirmek | ADR-021 kapalı union; filtre query değeri kullanıcıya görünüyor, değişimi 301 gerektirir |
| Vaka detay sayfasını persona-aware yapmak | docs/03 planlamıştı, uygulanmadı; Task 7 tabloyu gerçeğe hizalıyor. Uygulanacaksa kendi ADR'si ve planı olmalı |
| `home.hero.tagline1` / `tagline2` anahtarları | Ölü olabilir ama Task 4 kapsamı yalnız `personas` alt ağacı; ayrı bir ölü-anahtar denetimi konusu |
| Deploy / PR / Vercel | Burak'ın açık sinyali olmadan tetiklenmez |
