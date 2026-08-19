# ADR-002: Stitch Tasarım Belgesinden Reddedilen Kararlar

> **Not (2026-04-16):** Bu ADR'deki red kararları **genel geçerli** kalmıştır. Anasayfa hero zone'u için sınırlı istisna `ADR-003-cinematic-hero-zone.md`'de tanımlandı — orası yalnızca ilk 100vh'lik cinematic alanı kapsar; geri kalan tüm sayfalar bu ADR'ye sadık kalır.

**Tarih:** 2026-04-16
**Durum:** Kısmen supersede edildi (2026-08-19, ADR-015)

> **Statü güncellemesi (2026-08-19, `ADR-015-design-system-v2.md`):**
> §1 (dark base surface), §3 (particle flow), §4 (glassmorphism) ve §5 (gradient)
> redleri **sınırlı kapsamda** kaldırıldı. §7 (üçüncül renk) redi `gold` accent
> lehine **tamamen** kaldırıldı. §2 (çoklu marka paleti), §6 (all-caps buton) ve
> §8 (overlapping negative-margin kart) redleri **aynen geçerlidir**.
> Red-red karşılaştırma tablosu: ADR-015 §"ADR-002 red kararlarının yeni durumu".
> ADR-003 istisnası artık geçersiz — o ADR de ADR-015 ile arşive alındı.
**Karar Vericiler:** Burak Arda Özgül (Kurucu/CTO)

## Bağlam

INDOLES'in önceki tasarım referansı olan Stitch belgesi, web platformunun ilk görsel dili olarak hazırlanmıştı. `docs/04-design-system-principles.md` yazılırken Stitch belgesi gözden geçirildi — bazı kararlar editorial-minimalist light diline uygun olarak taşındı, bazıları reddedildi.

Bu ADR, reddedilen kararları ve gerekçelerini kaydeder.

## Taşınan Kararlar (Referans)

Aşağıdaki kararlar Stitch'ten korunmuş ve `04-design-system-principles.md`'ye entegre edilmiştir:

- Asimetrik layout prensibi (editorial section'larda)
- Logo mavisi (#567B97) birincil interaction anchor
- Pure black yasağı — ink-900 (#1A1F24) kullanımı
- Standart shadow yasağı — soft/tonal shadow
- Tutarlı icon stroke weight (Light, 1.5px)
- "Interface crowd etme" prensibi — spacing-2 (8px) normal birim
- Zero-divider policy (listelerde çizgi yok, spacing ile ayrıştırma)

## Reddedilen Kararlar

### 1. Dark Base Surface (#767779)

**Stitch kararı:** Koyu gri (#767779) base surface rengi.

**Ret gerekçesi:** WCAG AA kontrast oranlarını birçok metin kombinasyonunda karşılamıyor. Editorial-light (kağıt hissi, basılı yayın estetiği) dili ile doğrudan çelişiyor. Dark base, tech-SaaS estetiğine ait — INDOLES'in editorial konumlandırmasına değil.

**Yerine:** paper (#FBFAF7) sıcak kırık-beyaz base surface.

### 2. Deep Sea Blue + Industrial Slate Palette

**Stitch kararı:** Birden fazla marka rengi (Deep Sea Blue, Industrial Slate, vb.) içeren geniş palet.

**Ret gerekçesi:** Çoklu marka rengi tek renk disiplini kararıyla çelişiyor. INDOLES'in editorial dili tek accent renginden güç alır — çoklu renk dikkat dağıtır ve bakım maliyetini artırır. Tech-SaaS dark palette'i editorial-light dil için uygun değil.

**Yerine:** Brand mavisi (#567B97) tek marka rengi + nötrler + semantic renkler.

### 3. Particle Flow Animations

**Stitch kararı:** Arka planda particle flow animasyonları.

**Ret gerekçesi:** Yüksek performans maliyeti (GPU, battery drain). 2020-2022 trend'i olup 2026'da tarihli hisseder. Editorial tasarımla uyumsuz — dikkat çalar, içerikten uzaklaştırır. prefers-reduced-motion uyumu karmaşık.

**Yerine:** Scroll-linked revelation (fade-in + subtle translate, 800ms) — performans dostu, editorial uyumlu.

### 4. Glassmorphism (24px Backdrop Blur)

**Stitch kararı:** 24px backdrop-blur ile glassmorphism efektleri.

**Ret gerekçesi:** Safari ve iOS'ta ölçülebilir performans sorunları (jank, battery drain). 2020-2022 trend'i. Editorial-minimalist dille çelişir — glassmorphism "parlak" ve "gösterişli" hissi verir, editorial "sade" ve "zanaat" hissi taşır. Erişilebilirlik: düşük kontrastlı arka plan metin okunabilirliğini bozar.

**Yerine:** elevation-4'te maksimum 8px backdrop-blur, yalnızca sticky nav'da. Diğer yüzeylerde blur yok.

### 5. Gradient CTA (135 derece Linear Gradient)

**Stitch kararı:** CTA butonlarında ve arka planlarda linear gradient kullanımı.

**Ret gerekçesi:** Flat disiplin tercih edildi. Gradient buton 2015-2020 SaaS trendinin kalıntısı. Editorial tasarımda düz renk yüzeyleri daha prestijli hisseder — gradient "çıkma" çabası, düz renk "kendin olmak" güveni.

**Yerine:** brand-700 düz bg, hover'da brand-800. Hiçbir yüzeyde gradient yok.

### 6. All Caps Button + Letter-spacing

**Stitch kararı:** Buton metinlerinde ALL CAPS + artırılmış letter-spacing.

**Ret gerekçesi:** 2010'lar tech/SaaS UI dili. Editorial sentence-case, Fraunces/Inter'in doğal karakter setini koruyor. ALL CAPS okunabilirliği düşürür (kelime şekillerini kaybeder), agresif hissettirir — INDOLES'in "güvenilir ama mesafesiz" tonuyla çelişir.

**Yerine:** Sentence case, standart letter-spacing. `03-brand-voice-tone.md` Bölüm 6e ile uyumlu.

### 7. Tertiary Kahverengi (#57390c)

**Stitch kararı:** Üçüncü marka rengi olarak kahverengi (#57390c).

**Ret gerekçesi:** Tek renk disiplini kararıyla doğrudan çelişir. Paletin mantıksal tutarlılığını bozar — mavi + nötrler + semantik bir sistemde kahverengi kategorik olarak yersiz. Bakım maliyeti artırır (bir renk daha yönetilecek, dark mode'da bir renk daha dönüştürülecek).

**Yerine:** Üçüncü marka rengi yok. Brand mavisi skalası (50-900) ve semantic renkler yeterli.

### 8. Overlapping Negative Margin Cards

**Stitch kararı:** Kartların birbirinin üzerine bindiği negative margin layout.

**Ret gerekçesi:** Responsive tasarımda kırılma riski yüksek — farklı ekran boyutlarında örtüşme oranları tahmin edilemez hale gelir. Touch cihazlarda tap target sorunları yaratır. Bakım ve debugging maliyeti yüksek. Asimetrik grid sistemi (Bölüm 4) aynı "ilginç layout" ihtiyacını daha güvenilir şekilde karşılar.

**Yerine:** Asimetrik grid pattern'ları (8/4, 7/5) + elevation ile derinlik hissi.

## Sonuçlar

- `docs/04-design-system-principles.md` taşınan kararları entegre eder, reddedilenleri dışlar
- `lib/design/tokens.ts` yalnızca onaylanan değerleri içerir
- Bu ADR ileride Stitch referanslarına dönülmesi gerektiğinde bağlam sağlar
- Dark mode (ileride) tasarlanırken bu reddler yeniden değerlendirilmez — yeni ADR ile bağımsız değerlendirme yapılır
