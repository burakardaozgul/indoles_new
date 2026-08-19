## Durum: v2 tüm siteye taşındı — 2026-08-19

- Branch: `feat/simplification-migration` (remote yok, local-only, commit atılmadı)
- Karar kayıtları: `ADR-015` (design system v2), `ADR-016` (v2 blob anasayfa yönü)
- Prototip: `/tr/v2` ve `/en/v2` — `noindex`

### Bugün ne oldu (üç aşama)

**1. Design System v2** (`ADR-015`)
Fraunces/serif → Lexend, `#567B97` → logo teal `#2C5566` + tek gold accent,
radius 4-24 → 2-10px, çok katmanlı teal-tonlu elevation. Ana anasayfa 11 bölüm
olarak yeniden kuruldu, 21 ölü component silindi, ADR-014 persona bağlantısı
onarıldı.

**2. v2 blob anasayfası** (`ADR-016`)
Burak'ın yazdığı 12 bölümlük etkileşim spec'i uygulandı: sayfa boyunca hiç
unmount edilmeyen fixed WebGL canvas, 7 duraklı koreografi, iki katmanlı hero
metni, custom cursor, Lenis + GSAP ScrollTrigger. Yedi bölüm:
Hero · Statement · About+Trusted · Pillars · Hizmet portföyü · Featured Work · Outro.

**3. Polish turu**
Mobil hero üç ayrı şekilde kırıktı (logo 0 genişlik, blob başlığı tamamen
örtüyor, satırlar kırılıyor); skip link ve odak halkası eksikti; dokunmatikte
kart etiketleri ulaşılamıyordu. Hepsi düzeltildi. Statement 5 → 3 satır,
hizmet portföyü mobilde snap slider'a çevrildi.

**4. v2 chrome'u** (ADR-016 §Chrome kararı)
Burak: "v2 tasarım onaylandı. Artık tüm sitemiz bu tasarımda olacak."
Nav hero'nun içinden layout'a taşındı; sayfanın en üstüne siyah bilgi şeridi
geldi. Logo 30 → 56px. Link seti: Hakkımızda · Hizmetler · Paketler · Vakalar ·
Bilgi Kütüphanesi. Danışmanlar nav'dan çıktı (Hakkımızda ile birleşecek).
"Yazılar" → "Bilgi Kütüphanesi" (slug aynı). Dil değiştirici artık bulunulan
sayfanın karşılığına gidiyor.

**5. Tüm sitenin v2'ye taşınması** (ADR-017)
`(v2)` prototip grubu kaldırıldı, v2 anasayfası `/{locale}` oldu. 14 sayfanın
tamamı tek chrome altında: siyah şerit + nav + blob + cursor + footer. Blob iki
modlu (anasayfa koreografili, iç sayfa sessiz). Bölüm seviyesindeki opak
zeminler kaldırıldı, kartlar yarı saydam beyaza geçti. Tipografi tek ağırlığa
indi (başlık 600), gövde satır aralığı açıldı; `h2`'lerin sayfa başlığından
büyük olduğu ters hiyerarşi düzeltildi (24 kullanım bir basamak indi). Eski anasayfanın beş
bölümü iç sayfalara dağıtıldı. Nav CTA'sı persona popup'ını açıyor.

### v2 mimarisinin özeti

| Katman | Dosya |
|---|---|
| Kalıcı canvas + koreografi | `components/v2/webgl/BlobCanvas.tsx` |
| Blob mesh + raycast + mouse | `components/v2/webgl/Blob.tsx` |
| Shader'lar | `webgl/shaders/{noise,blob.vert,blob.frag}.glsl.ts` |
| Koreografi config (7 keyframe) | `webgl/choreography.ts` |
| **Tüm süre/easing/threshold** | `lib/v2/anim-config.ts` |
| Lenis + GSAP senkronu | `lib/v2/use-lenis.ts` |
| Bölümler | `components/v2/sections/*` |
| Chrome (şerit + nav) | `components/v2/chrome/{V2TopBar,V2Nav}.tsx` |
| Dil değiştirici segment map'i | `lib/i18n/locale-href.ts` |
| Stil | `styles/v2.css` |

Chrome yükseklikleri `v2.css`'te `--v2-topbar-h` / `--v2-nav-h`. `.v2-root`
`padding-top`'u ve hero `min-height`'ı bu değişkenleri okur — üç yerde ayrı
sabit tutulmaz.

Bölüm id'leri (`v2-hero` … `v2-outro`) koreografinin çapalarıdır. Biri
değişirse `choreography.ts` de değişmelidir.

### Yol boyunca bulunan gerçek hatalar

Hepsi kodda gerekçesiyle birlikte yorumlanmıştır:

1. **R3F uniform klonlaması** — `<shaderMaterial uniforms={...}>` objeyi klonluyor;
   dışarıdan güncellemek GPU'ya ulaşmıyordu. Mouse etkileşimi, `noiseAmp` ve
   `opacity` keyframe'leri sessizce ölüydü. Materyal artık imperatif kuruluyor.
2. **Rotasyon raycast'i bozuyordu** — dünya→obje dönüşümünde rotasyon
   atlanıyordu; `worldToLocal()` ile düzeltildi.
3. **Kare-başına lerp** — 120Hz'de gerçek zamanda yarı hız. Saniye bazlı
   `1 − exp(−rate·delta)`'ya çevrildi, kare başına adım tavanlandı.
4. **Geometri maliyeti** — detail 96 → frame başına 5M simplex noise. detail 32
   + FBM 2 oktav + fragment noise'un vertex'e taşınması = 11× ucuz.
5. **GSAP + React StrictMode** — `gsap.from` bitiş değerini o anki değerden
   okuyor; StrictMode ikinci geçişte gizli hâli "doğal hâl" sanıyordu. Tüm
   reveal'lar `fromTo`'ya çevrildi.
6. **Satır-içi stil sınıfı eziyordu** — GSAP'in bıraktığı `opacity: 1`,
   hover'daki `.is-dimmed`'i eziyordu. `clearProps` eklendi.
7. **Koreografi sayfa uzayınca duruyordu** — normalize konumlar mount anına
   bağlıydı. Fonksiyon start/end'e çevrildi.
8. **Son bölüm scroll'un dışında kalıyordu** — 827px'lik outro, 829px'lik
   viewport'ta `maxScroll`'un ötesine düşüyor, son keyframe'e yer kalmıyordu.

### Doğrulama

```
tsc --noEmit     temiz
vitest run       29 dosya / 123 test geçti, 1 skip
eslint (v2)      temiz
route smoke      /tr /en /tr/v2 /en/v2 /tr/hizmetler /tr/yazilar /en/articles
                 /tr/hakkimizda → 200
nav              1190px'te taşma yok; ≤1180px çekmece; TR/EN etiketleri doğru
dil değiştirici  /tr/v2 → /en/v2 · /hizmetler/[slug] → /services/[slug] (test'li)
koreografi       7 keyframe'in tamamı hedefine ulaşıyor, çift yönlü pürüzsüz
mouse            strength 0 → 1.0 → 0.8s'de sönüm; hızlı sweep'te adım tavanı 0.34
mobil            390px: logo görünür, satırlar sığıyor, hizmet slider'ı çalışıyor
```

---

## Bir sonraki adım — Burak'ın sinyalini bekliyor

### v2'yi canlı anasayfaya terfi (ADR-016 §Migrasyon)

| # | İş |
|---|---|
| 1 | `/tr/v2` içeriğini `(marketing)/[locale]/page.tsx`'e taşı, `(v2)` grubunu kaldır |
| 2 | ~~Chrome kararı~~ — kapandı: v2 chrome'u kalır, `SiteNav` terfiyle kalkar |
| 3 | Entry popup'ı v2 layout'una bağla — persona anasayfada seçilebilmeli |
| 4 | `noindex` kaldır, `sitemap.ts`'e ekle |
| 5 | İç sayfaları v2 chrome'una geçir (`(marketing)` layout'u `V2Chrome`'a) |
| 6 | Featured Work orijinal görselleri + gerçek alt metinler |
| 7 | Lighthouse + Safari/iOS testi |
| 8 | Eski 11 bölümlük anasayfa component'lerinin akıbeti |

### Burak'ın kararı gereken diğer başlıklar

| # | Konu |
|---|---|
| 1 | `COMPANY.phone` — `+90 212 111 22 33` placeholder |
| 2 | `COMPANY.locations` — Londra ve Dubai teyidi |
| 3 | Kadro portre fotoğrafları (şu an baş harf + tone bloğu) |
| 4 | Vercel proje setup + env migration (ADR-012) |
| 5 | Commit + remote push + PR (henüz hiçbiri yapılmadı) |

### Teknik borç

| # | İş |
|---|---|
| 1 | v2 bundle boyutu ölçümü (three + gsap + lenis) |
| 2 | Lighthouse Performance ≥ 85 doğrulaması |
| 3 | Safari / iOS: `backdrop-filter` + WebGL birlikte test edilmedi |
| 4 | `prefers-reduced-motion` canlı doğrulaması — kod yolu doğru, medya sorgusuyla test edilmedi |
| 5 | WebGL'siz fallback yok |
| 6 | Ana sitede Cal.com embed 404 (`app.cal.com/indoles/gorusme` yok) |
| 7 | Design token leak testi hâlâ `it.skip` |
| 8 | `SiteNav` bağlantıları `next-intl` `Link`'ine geçmeli (EN'de 307 atlaması). `V2Nav`'da çözüldü; terfiyle kendiliğinden kapanır |
| 12 | EN hero'da accent aralıkları blob'un yolunu tutmuyor: "RESULTS"ın "ULTS"ı blob'un altında kayboluyor. TR'de ölçülüp ayarlandı, EN ölçülmedi |
| 13 | `CLAUDE.md` klasör haritası `components/v2/chrome/` ve `lib/i18n/locale-href.ts`'i bilmiyor — o dosya Burak onayıyla güncelleniyor |
| 9 | `/api/upload` ve `/api/webhooks/cal` — TODO stub |
| 10 | `llms.txt` kaldırılmış `/app/brief/yeni`'yi gösteriyor |
| 11 | `@vitejs/plugin-react` kaldırılamadı |

---

## Git state

```
Branch: feat/simplification-migration
Remote: YOK
Commit edilmemiş: design system v2 + v2 blob anasayfası + doküman senkronu
Son commit: 657f554 (2026-04-18)
```

> Deploy gating: push/PR/prod adımları Burak'ın sinyali olmadan tetiklenmez.
> Commit için de aynı şekilde onay bekleniyor.

---

## Hızlı kontrol

```bash
cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
corepack pnpm dev            # /tr (ana site) · /tr/v2 (yeni yön)
corepack pnpm tsc --noEmit
corepack pnpm vitest run 2>&1 | tail -5
```

Dev'de tarayıcı konsolundan tune için: `__blobState` · `__blobMaterial` ·
`__blobMouse` · `__lenis` · `__ST`.

## Yeni session başlatma

"active_context.md'yi oku" — bu kadar yeterli.
