# ADR-003 — Cinematic Hero Zone

**Statü:** Superseded (2026-04-16 — Editorial hero'ya pivot edildi, dark cinematic kaldırıldı)
**Tarih:** 2026-04-16
**Karar veren:** Burak Arda Özgül
**Etkilenen belgeler:** `docs/04-design-system-principles.md`, `docs/decisions/ADR-002-stitch-design-reject.md`

> **Superseded note (aynı gün):** Cinematic dark hero ve floating glass nav kaldırıldı. Anasayfa Anthropic benzeri paper zemin + büyük Fraunces editorial headline'a geçti. Floating nav yerine `SiteTopNav` (sticky, paper zemin, sayfa akışının parçası) kullanılıyor. `ADR-002`'nin orijinal red kararları (dark base surface dahil) tam geçerli kaldı. `docs/04 §13 Cinematic Hero Zone` bölümü bilgi amaçlı duruyor ancak uygulama yok.

---

## Bağlam

INDOLES web anasayfası, ziyaretçiyi ilk saniyede iki persona ekseninden birine yöneltmek üzere tasarlandı. Mevcut light editorial-minimal hero güçlü ama "kurumsal prestij + teknolojik cesaret" ikilisini tek saniyede iletemiyor. Referans: TIWIS hero (dark metallic blue wave, floating glass nav, massive white wordmark, mouse-interactive motion).

**ADR-002 §1-§2**'de `dark base surface`, `particle/flow effect`, `glassmorphism`, `gradient CTA` **reddedilmişti**. Bu ADR, o reddi **yerine koymaz** — sadece **tek, sınırlı bir bölgede** istisna tanımlar.

## Karar

Anasayfanın ilk **100vh** bölgesi "Cinematic Hero Zone" olarak işaretlenir. Bu bölgede:

- **Background**: Dark metallic blue wave (canvas-based shader, mouse-interactive).
- **Nav**: Floating glass (backdrop-blur), beyaz/açık tipografi.
- **Wordmark**: Bottom-left, massive (Fraunces display), paper rengi.
- **Tagline + CTA**: Sağ-orta / sol-orta, beyaz üstünde beyaz outline.

Hero zone dışındaki **tüm alanlar** (pillars, paketler, vakalar, dashboard, admin, studio, auth) **light editorial-minimal** paletle devam eder — değişiklik yok.

## Gerekçe

1. **İlk saniye ağırlığı.** Marka izleniminin %60+'sı "above the fold" 3 saniyede oluşur. TIWIS benzeri cinematic hero, "teknoloji kasvetli değil, parlak ve özgüvenli" mesajını light alanda yapılacak detay çalışmasından önce taşır.
2. **Ton gerilimi olarak okunur.** "Dingin kurumsal (sanayi) + dinamik büyüme (ticaret)" ikilisi için hero zone, ikisinin ortak üst-kümesi olarak "cesur ve prestij" sunar; iki persona'nın bölünmesinden önce ortak bir çerçeve kurar.
3. **Kapsam dar.** Dark yalnızca 100vh'lik tek bölge. Scroll iniyor → ikinci section'da paper (#FBFAF7) geri gelir. Kullanıcı dark mode beklentisine girmez, marka kimliği karışmaz.
4. **Motion kalitesi.** Canvas 2D shader + mouse-tracked light spot; WebGL kütüphanesi eklenmez, mevcut stack'te doğar, performans kontrollü.

## Sonuçlar

### Pozitif
- Hero anında cinematic etki, persona switch'i daha iddialı bir sahnede yapılır.
- Nav floating glass, site içi gezinmede hafif ve modern görünür.
- Light editorial system'in zenginliği korunur; hero zone dışı hiçbir sayfa etkilenmez.

### Negatif / trade-off
- Light ↔ dark geçişi tasarım disiplini gerektirir — handoff section'ı net olmalı (ADR kapsamı: ilk hero zone biter, sonraki section tam light'a geçer, arada gri veya sepya geçiş yok).
- Canvas motion akıllı telefon batarya + reduced motion'a dikkat gerektirir (aşağıda implementation notları).
- `ADR-002` kararlarıyla kısmi çelişki; aşağıda istisna bloğu dokümante edildi.

### Yeniden değerlendirme tetikleyicileri
- Hero zone motion'ın LCP'yi > 2.5s'ye çıkarması (performans metriği).
- Kullanıcı araştırmasında "siteyi dark sanıyorum" sinyali alınırsa.
- Accessibility şikayeti (kontrast, vestibular rahatsızlık).

## ADR-002 ile ilişki

| ADR-002 red | Bu ADR'de istisna? | Açıklama |
|---|---|---|
| `Dark base surface` | **Sadece hero zone'da** | Geri kalan tüm sayfalar paper kalır |
| `Particle / flow effect` | **Evet, sadece hero bg** | Canvas wave; parçacık değil, mesh-gradient shader |
| `Glassmorphism` | **Sadece floating nav** | Başka yerde glass yok; kart/button/panel opak kalır |
| `Gradient CTA` | **Hayır** | CTA hero içinde de outline veya solid-fill; gradient yok |
| `All-caps buttons` | **Hayır** | Normal case kalır |
| `Deep Sea Blue palette` | **Hayır** | Hero palette ayrı tokens; brand-500 INDOLES blue değişmedi |

## Implementation notları

### Token eklemeleri
`src/lib/design/tokens.ts` → yeni `hero` namespace:
- `hero.void` — `#05080F` (en derin)
- `hero.deep` — `#0A1628`
- `hero.metal` — `#1B3A5C`
- `hero.light` — `#3B6FA0` (mouse-tracked light spot)
- `hero.paper` — `#F5F3EE` (text rengi)

### Motion
- Canvas element downsampled (0.5x render scale), CSS `filter: blur(40px)` ile metallic sızma.
- `requestAnimationFrame` loop, 3 gradient blob: 2 sine-based drift + 1 mouse-tracked.
- `prefers-reduced-motion: reduce` → drift + mouse track disable, statik mesh gradient.
- Mobile: motion disable (pil+perf), statik fallback.

### Handoff
Hero zone biter bitmez `<section class="bg-paper">` başlar. Arada decorative separator yok; "clean cut" editorial geçiş.

### Floating nav
- Desktop: center-pill + sol logo + sağ CTA/locale
- Mobile: floating pill alt ortada veya klasik burger
- Her zaman `position: fixed; backdrop-filter: blur(16px)`; hero'da beyaz border, scroll sonrası surface-2 border + paper/90 bg.

## Referanslar

- Örnek: TIWIS (tiwis.fr) — masaüstü/ornek.png
- Önceki ADR: `ADR-002-stitch-design-reject.md` (hâlâ genel geçerli, sadece bu ADR'deki istisnalar müstesna)
- İlgili belgeler: `docs/04-design-system-principles.md` §3.1 Cinematic Hero Zone
