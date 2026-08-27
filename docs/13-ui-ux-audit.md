# UI/UX Denetimi — iç sayfalar

> **Tarih:** 2026-08-19 · **Kapsam:** 13 iç sayfa. **Anasayfa kapsam dışı** (Burak).
> **Statü:** Bulgu listesi — uygulama Burak'ın önceliklendirmesini bekliyor.

Denetim ekranda yapıldı: her sayfa 1440px ve 390px'te gezildi, ekran
görüntüsü alındı. Aşağıdaki bulguların hiçbiri genel tavsiye değil — hepsi
görülen bir duruma dayanıyor.

---

## Sistem kısıtı — okumadan öneri değerlendirilmemeli

Ayrıştırmanın en kolay yolu renk vermektir: Growth yeşil, Transform mavi,
Build turuncu. **Bu yol kapalı.** ADR-015 tek accent disiplinini koyuyor ve
CLAUDE.md §6 "ikinci marka accent rengi" kalemini açıkça kapsam dışı sayıyor.

Ayrım renkle değil **geometriyle** kurulur. Bunun altyapısı zaten var:
`service-illustration.tsx` — 12 hizmetin her biri için, hizmetin mekaniğini
anlatan tek bir diyagram. Yalnız teal + gold, stroke 1–1.5px sabit, tamamı
dekoratif. Şu an **yalnız anasayfanın hizmet portföyünde** kullanılıyor; iç
sayfaların hiçbirinde yok.

Aşağıdaki önerilerin çoğu bu ailenin genişletilmesidir, yeni bir dil değil.

---

## P1 — Paketler birbirinden ayrışmıyor  ✅ UYGULANDI (2026-08-19)

**Ne gördüm.** `/paketler`'de dört paket, birbirinin aynı dört satır: numara ·
ad · pillar etiketi + süre · açıklama · fiyat. Tek fark metin.

**Neden sorun.** Fiyat aralığı ₺180.000 – ₺720.000 — **4 kat** fark. Ama
satırların görsel ağırlığı birebir aynı. Sayfa "bunlar aynı türden dört şey"
diyor; oysa biri üç haftalık bir teşhis, diğeri sekiz haftalık canlıya alınan
bir yazılım. Alıcı taahhüt farkını okuyarak çıkarmak zorunda kalıyor.

Eksik olan üç şey:

| Eksik | Sonuç |
|---|---|
| Taahhüt ekseni | Teşhis → pilot → inşa sıralaması görünmüyor; liste rastgele duruyor |
| "Hangisi bana uygun?" | Dört paket arasında seçim yapacak hiçbir sinyal yok |
| Karşılaştırma | Neyin dahil olduğu yalnız detay sayfasında; yan yana kıyas imkânsız |

**Öneri.**

1. **Taahhüt ekseni görselleşsin.** Listeyi taahhüt sırasına diz ve solda
   ince bir ölçek göster (süre + kapsam). Dört satır aynı ağırlıkta değil,
   artan bir dizi hâline gelir.
2. **Her pakete bir şema.** `ServiceIllustration` ailesinden türetilmiş,
   paketin mekaniğini anlatan tek diyagram: teşhis = eş merkezli halkalar,
   pilot = tek daldan çıkan iki yol, inşa = kademeli grid. Satırın solundaki
   boş alan zaten var.
3. **Fiyat tipografisi taahhütle ölçeklensin.** Şu an üç fiyat da aynı punto.
   Adım adım büyüyen bir ölçek, farkı okumadan hissettirir.
4. **Karşılaştırma tablosu** — dört paket × (süre, çıktı, kim için, pillar).
   Sayfanın altına, tek ekranda.

**Not:** persona (`industrial` / `commerce`) zaten paket `outcome` metnini
değiştiriyor (ADR-014). Görsel ayrım bunun üstüne binmeli, onunla çelişmemeli.

### Ne yapıldı

| İş | Sonuç |
|---|---|
| Sıralama | Liste `durationWeeks`'e göre diziliyor: 3 · 4 · 6 · 8 hafta. Dosya sırası bunu izlemiyordu |
| Şemalar | `package-diagram.tsx` — dört diyagram, `service-illustration` diliyle aynı (teal + gold, stroke 1–1.5px, `aria-hidden`) |
| İçerik modeli | `PackageContent.kind` eklendi (`diagnose` · `sprint` · `pilot` · `build`). Süreden türetilmiyor, yazıyla belirtiliyor |
| Fiyat kademesi | Punto h3 → h2, ağırlık 400 → 600. h1 denendi: "₺ 720.000" kolona sığmıyordu |
| Süre ölçeği | Her satırda maksimuma oranlı çubuk. 1px + `v2-surface-3` denendi, ekranda görünmüyordu; 2px + `ink-100` ize çevrildi |
| "Kimin için" | `whoFor` içerikte zaten yazılıydı ama yalnız detay sayfasındaydı — listeye çıkarıldı |
| Karşılaştırma | Dört paket × (süre, pillar, ana çıktı, fiyat) tablosu. `min-w-720px` + `overflow-x-auto`, `<caption>` ile isimlendirilmiş |

Kolon dengesi şema 2 / ad 3 / açıklama 4 / fiyat 3 olarak yeniden kuruldu —
ilk deneme (4/5/2) fiyatı iki satıra kırıyordu.

---

## P1 — Üç pillar aynı görünüyor  ✅ UYGULANDI (2026-08-19)

**Ne gördüm.** `/hizmetler`'de Growth · Transform · Build alt alta, üçü de
aynı 12 kolonlu grid: numara + ad + açıklama + hizmet listesi. Detay
sayfalarında (`/hizmetler/growth` vb.) da şablon birebir aynı.

**Neden sorun.** Üç pillar INDOLES'in temel argümanı — "farklı ekipler değil,
birbirini besleyen aynı disiplin". Ama sayfa bunu göstermiyor, yalnız
söylüyor. Üç blok görsel olarak ayırt edilemediği için "aynı şeyin üç adı"
gibi okunuyor.

**Öneri.**

1. **Pillar başına imza geometrisi.** Üç diyagram, aynı stroke dilinde:
   Growth = dışa açılan yelpaze, Transform = iç içe geçen iki sistem,
   Build = katman katman yükselen yapı. Pillar detay sayfasının başlığında
   büyük, `/hizmetler` listesinde küçük.
2. **Teal tonal kademesi.** Renk eklemeden ayrım: `teal-700` / `teal-500` /
   `teal-300` üç pillar için. Tek accent disiplini bozulmaz — aynı skalanın
   içinde kalınır.
3. **12 hizmetin diyagramları iç sayfaya taşınsın.** Zaten yazılmışlar ve
   yalnız anasayfada görünüyorlar. `/hizmetler/[slug]`'daki hizmet listesi
   şu an düz metin; her satırın yanında kendi diyagramı olmalı.

### Ne yapıldı

| İş | Sonuç |
|---|---|
| İmzalar | `pillar-mark.tsx` — üç geometri. Growth: tek gövdeden açılan yelpaze. Transform: kenetlenen iki sistem. Build: katman katman yükselen yapı |
| Tonal kademe | `teal-700` · `teal-500` · `teal-400`. **Yalnız çizime** uygulanır; metin her zaman `ink` kalır, aksi hâlde açık ton kontrast eşiğini geçemezdi |
| Yerleşim | `/hizmetler`'de her pillar bloğunun solunda 132px; `/hizmetler/[slug]` başlığının sağ kolonunda 200px |
| 12 diyagram | `/hizmetler`'deki hizmet satırlarına yerleştirildi. Kod zaten yazılıydı — yapılan yalnız yerleştirme |
| İndeks kaynağı | `pillars.ts`'e `SERVICE_ORDER` + `serviceIndex()` eklendi |

`ServiceIllustration` `width/height="100%"` veriyor; ölçüsü olan bir kap
gerekiyor (`w-[92px] aspect-[200/140]`), aksi hâlde çöküyor.

> **Bilinen risk:** Anasayfanın `ServicesScroll` bölümü diyagram indeksini hâlâ
> kendi yerel `flatMap` sayacından alıyor. Şu an ikisi aynı sırayı üretiyor ama
> bir pillar'a hizmet eklenirse anasayfadaki diyagramlar sessizce kayar.
> `serviceIndex()`'e geçirilmesi gerekiyor — anasayfa kapsam dışı olduğu için
> bu turda yapılmadı (Burak, 2026-08-19).

---

## P2 — Vaka sonuçları sayı olarak duruyor, kanıt gibi durmuyor

**Ne gördüm.** `/vakalar`'da sonuçlar başlığın içinde düz metin: "E-ticarette
3.2× organik trafik, 6 ay.", "İşletme maliyetinde %28 tasarruf, 12 ay."

**Neden sorun.** Bunlar sitenin en güçlü kanıtı ve en zayıf sunulan verisi.
Rakam cümlenin içinde eriyor. Bir danışmanlık sitesinde sonuç metriği,
başlıktan bağımsız okunabilmeli.

**Öneri.** Vaka kartına metrik bloğu: rakam (display ölçeği, tabular) + ne
olduğu (mono etiket) + süre. Üç metrikten fazlası olmasın. Detay sayfasında
önce/sonra çubuğu veya basit bir çizgi — Canvas değil, statik SVG; sayfa
zaten WebGL taşıyor.

**Uyarı:** Grafik çizmeden önce sayıların kaynağı doğrulanmalı. Uydurulmuş
bir eğri, düz metinden kötüdür.

---

## P2 — Kadro placeholder'da, on kişi neredeyse aynı görünüyor

**Ne gördüm.** `/danismanlar`'da her kişi: gradyan bir kare + baş harfler +
ad + rol + biyografi + pillar etiketleri. `portraitTone` alanı kareyi hafifçe
değiştiriyor ama on kart taranırken fark edilmiyor.

**Öneri.** Gerçek portreler senin elinde (ADR-016'dan beri açık). Ara çözüm
olarak baş harf karesini büyütmek yerine **pillar etiketini kartın kimliği
hâline getirmek** daha çok iş görür: kart kenarında pillar tonundan ince bir
şerit, kadro taranırken "kim ne yapıyor" bir bakışta okunur.

**Bu turda düzelttim:** Kadro kartlarındaki adlar `h1` ölçeğindeydi (3.43rem);
iki kolonlu bir kartta bir kişi adı için fazla. `h2`'ye indirildi. Bu, dünkü
tipografi turunda `display-xl → h1` eşlemesinin tek yanlış düştüğü yerdi.

---

## P3 — On üç sayfanın iskeleti birebir aynı

**Ne gördüm.** Her iç sayfa: `V2PageHeader` → içerik bölümleri →
`ContactCallout`. Liste sayfası da, detay sayfası da, yasal sayfa da.

**Neden sorun.** Tutarlılık iyi, tekdüzelik değil. Bir vaka detayı ile bir
paket detayı aynı ritimde açılıyor; oysa biri hikâye, diğeri teklif.

**Öneri.** Sayfa tipine göre açılış farklılaşsın:

| Tip | Açılış |
|---|---|
| Liste (`/hizmetler`, `/paketler`) | Başlık + sayaç ("12 hizmet · 3 pillar") |
| Detay (`/vakalar/[slug]`) | Başlık + metrik şeridi |
| Teklif (`/paketler/[slug]`) | Başlık + fiyat kartı yukarı (şu an aşağıda) |
| Yasal | Başlık + içindekiler (dokuz bölüm var, gezinme yok) |

---

## P3 — Küçük ama görünür eksikler

| Sayfa | Eksik |
|---|---|
| `/gizlilik-kvkk` | Dokuz bölüm, içindekiler yok, geri dönüş yok |
| `/iletisim` | Cal.com embed 404 veriyor (`app.cal.com/indoles/gorusme` yok) — bilinen borç ama artık nav CTA'sının hedefi |
| `/yazilar` | Kategori var (`growth` / `transform` / `build` / `industry`) ama filtre yok |
| `/vakalar` | ~~Problem tipi filtresi taşındı ama liste ile filtre arasında bağ görünmüyor~~ ✅ 2026-08-27: `CaseFilter` chip'leri eklendi |
| Tümü | ~~Boş durum tasarımı yok~~ ✅ 2026-08-27: sıfır vakalı problem tipi chip'i basılmıyor (ADR-021 emsali), boş durum oluşamıyor |

---

## Uygulama sırası önerisi

| Sıra | İş | Neden önce |
|---|---|---|
| ~~1~~ | ~~Paket taahhüt ekseni + şemalar~~ — **bitti** | Satın alma kararının merkezi |
| ~~2~~ | ~~Pillar imza geometrileri~~ — **bitti** | Temel argümanı görünür kılıyor |
| ~~3~~ | ~~12 hizmet diyagramının iç sayfaya taşınması~~ — **bitti** | Kod zaten yazılmış, yalnız yerleştirme |
| 4 | Vaka metrik blokları | Rakamların doğrulanmasına bağlı |
| 5 | Sayfa tipi ritimleri | Kozmetik, sonraya kalabilir |

Portre fotoğrafları ve Cal.com bağlantısı senin tarafında — kod işi değil.

---

# Ek denetim — hakkımızda + vakalar (2026-08-27)

> **Kapsam:** `/hakkimizda`, `/vakalar`, `/vakalar/[slug]` — canlı inceleme
> (preview, 1440 + 390) + kod analizi, `ux-audit-2026` çerçevesiyle.
> **Statü:** Bulguların tamamı aynı gün uygulandı (persona sistemi Burak'ın
> talimatıyla kapsam dışı). Skor: 70/100 (B) — düzeltmeler öncesi.

## Uygulanan bulgular

| Bulgu | Düzeltme |
|---|---|
| `ContactCallout` birincil CTA'sı koyu şeritte görünmezdi (`text-ink-900` + arka plansız + bozuk `hover:/90`) | `bg-paper text-ink-900 hover:bg-paper/90` |
| `max-w-prose-editorial` derlenmiyordu (token tanımsız) — paragraflar ~949px akıyordu | `@theme`'e `--container-prose-editorial: 680px` |
| 6 dosyada `hover:v2-surface*` geçersiz utility — hover geri bildirimi yoktu | `hover:bg-surface-1/60` · `hover:bg-surface-2/60` eşdeğerleri |
| `/vakalar`'da mükerrer listeleme (grid + `CasesSection`), kendine link veren "Tümünü gör", "02 — KANIT" eyebrow sızıntısı | `CasesSection` sayfadan çıkarıldı (dosya artık hiçbir yerden import edilmiyor — silme kararı bekliyor) |
| Lede "problem tipine göre filtrele" vaat ediyordu, filtre yoktu | `CaseFilter`: problem tipi chip'leri, progressive enhancement (9 vaka sunucu HTML'inde kalır), sıfır sonuçlu chip basılmaz |
| Featured vaka görselsizdi; sol/sağ kolon dengesizdi | `CASES[0].cover` + logo rozeti eklendi |
| Mobilde featured metrik dizilimi ekran başına ~1 metrik saçıyordu | Mobil `grid-cols-2` |
| 9 vakanın 5'inde `heroMedia` yok — sayfa başlıktan koyu banda düşüyordu | `resolveHeroMedia`: `cover` fallback'i |
| Hakkımızda'da ekip iki kez sunuluyordu (harf-avatar grid + `TeamSlider`) | Slider silindi; grid `portraitTone` avatar + alıntılarla zenginleşti, künye satırı grid altına taşındı |
| Değerlerdeki `01…04` indeksleri sıra bilgisi taşımıyordu | Mono anahtar etiketler: TEŞHİS / SAHİPLİK / SADELİK / EKSEN |
| Değer #04 başlığı H1'i birebir tekrar ediyordu | "Tek yöntem, iki dil." (EN: "One method, two languages.") |
| Vizyon istatistikleri ölçüm çerçevesiz çıplak sayılardı | docs/04 §10 kalıbıyla 4 bağlam satırı (TR+EN) |
| Topbar telefon/e-posta linkleri mobilde ikon kalınca erişilebilir adsız kalıyordu (Lighthouse `link-name`) | `aria-label` eklendi |

## Denetimde çürütülen bulgu

Vaka detayı breadcrumb'ının `href: "/vakalar"` biçimi hata sanılmıştı;
empirik testte `next-intl` `createNavigation` Link'i bunu `/tr/vakalar` ve
`/en/case-studies`e doğru çevirdi. `/${locale}/…` biçimi tam tersine çift
locale üretiyor. Kural: `V2PageHeader.crumbs` → çıplak kanonik path.

## Açık kalan izleme kalemleri

| Kalem | Not |
|---|---|
| `cases-section.tsx` orphan | Ana sayfa `FeaturedWork`e geçmiş; dosya hiçbir yerden import edilmiyor. Sil / referans olarak tut — Burak kararı |
| Muted mono etiket kontrastı | `ink-500` (#6B7880) krem üstünde ≈4.4:1 — küçük puntoda AA sınırının altında ("SEÇİLMİŞ VAKA", footer notları). Site geneli token kararı gerektiriyor |
| `/apple-icon` console hatası | Lighthouse `errors-in-console`; icon route'u ayrıca incelenmeli |
| `yazilar/[slug]` `max-w-170` | Token artık var; iki kullanım `max-w-prose-editorial`a çevrilebilir |
| Persona kapsamı | Persona switch dokunma hedefi (30px), giriş modal'ı, ikili persona mekanizması, detay sayfası persona varyantları — talimatla kapsam dışı bırakıldı |
| Lighthouse (localhost, mobil) | A11y 93 · Best Practices 96 · SEO 61 (noindex/canonical — preview ortamı gereği, prod'da geçersiz) |
