# CTR Revizyonu — Eylül 2026 (A-3 dalgası)

> **Tetikleyici:** `GSC-Data/haftalik-2026-09-18/` (18 Ağu - 15 Eyl, 28 gün, dataState `final`). Eşik A-3: pozisyon < 10, gösterim ≥ 20, CTR < %1. Bu üç koşulu aynı anda sağlayan 11 sayfa var ve hiçbirinin `seo.title`/`seo.description`'ı 28 Ağustos'tan beri değişmedi.
> **Değişiklik tipi:** Yalnız arama yüzeyi. H1 ve gövde metni hiçbir sayfada dokunulmadı; iki sayfada gövdeye **ek** yapıldı (§3), silme yok.
> **Görev tanımı:** `04-ctr-title-revizyonu.md` (prompt kümesi, 18 Eyl). Öneri tablosu Burak tarafından onaylandı; bu belge uygulanan hâli kaydeder.
> **Yeniden kontrol:** **2 Ekim 2026** (§4).

---

## 1. Neden bu 11 sayfa

Sorun görünürlük değil, tıklama. Sayfalar ilk sayfada duruyor ve gösterim alıyor; SERP'te okuyan kişi başlıkta aradığı şeyi görmediği için tıklamıyor. En keskin örnek `turkiyenin-ilk-geo-denetim-araci`: "yerli geo aracı" sorgusunda ortalama pozisyon **1,35**, "türkçe geo aracı var mı" sorgusunda **2,21** — ikisinde de sıfır tık. Arayan bir araç istiyor, başlık ise bir duyuru okutuyordu ("Türkiye'nin ilk GEO denetim aracı yayında").

Uygulanan üç kural (types.ts `seo` sözleşmesi + docs/03 ton rehberi):

- `seo.title` ≤50 karakter — layout'un `"%s — INDOLES"` şablonu 10 karakter ekler, denetim render edilmiş başlığı 15-60 bandında ister.
- `seo.description` 140-160 karakter; içindeki her rakamın yazının gövdesinde karşılığı olmak zorunda (`tests/unit/articles-content.test.ts`).
- Fiyat avcısını eleyen premium dil: "ücretsiz", "hemen", "en iyi" yok. Başlık gerçekten gösterim getiren sorgunun dilinde yazılır, tahmine göre değil.

Sorgular `GSC-Data/haftalik-2026-09-18/sorgu-sayfa.csv`'den çekildi; aşağıdaki tabloda her satırın "gösterim getiren sorgu" sütunu o sayfanın en yüklü sorgusudur.

## 2. Önce/sonra — 11 sayfa

Karakter sayıları ham `seo` değerinin uzunluğudur; başlıkta parantez içindeki sayı `— INDOLES` eklendikten sonraki render uzunluğudur.

| #   | Sayfa                                                                                 | Gösterim getiren sorgu (göst · poz)                                                                             | Eski title                                               | Yeni title                                                     | Eski description                                                                                                 | Yeni description                                                                                             |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | `/tr/yazilar/google-ai-overviews-da-yer-almak`                                        | "google ai overview'da nasıl çıkılır" (9 · 9,11)                                                                | Google AI Overviews'da yer almak: rehber **40 (50)**     | Google AI Overview'da nasıl çıkılır: 5 koşul **44 (54)**       | değişmedi **153**                                                                                                | değişmedi **153**                                                                                            |
| 2   | `/en/articles/guerrilla-marketing-in-the-digital-age`                                 | "digital guerilla marketing" (1 · 1,00) · "digital guerrilla marketing" (2 · 17,00)                             | Guerrilla marketing in the digital age **38 (48)**       | Digital guerrilla marketing: what still works **45 (55)**      | değişmedi **154**                                                                                                | değişmedi **154**                                                                                            |
| 3   | `/tr/yazilar/cro-nedir`                                                               | "cro nedir" (3 · 13,33)                                                                                         | CRO nedir? Dönüşüm oranı optimizasyonu **38 (48)**       | CRO nedir? Aynı trafikten daha fazla satış **42 (52)**         | değişmedi **151**                                                                                                | değişmedi **151**                                                                                            |
| 4   | `/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru`                        | "hangi ajansla çalışmalıyım" (17 · 11,53)                                                                       | Pazarlama ajansı seçimi: sorulacak 8 soru **41 (51)**    | Hangi ajansla çalışmalıyım? İlk görüşmede 8 soru **48 (58)**   | Dijital reklam ajansı ile tedarikçi arasındaki fark ilk görüşmede duyulur… **149**                               | Hangi ajansla çalışmalıyım sorusunun cevabı ilk görüşmede belli olur… **154**                                |
| 5   | `/tr/danismanlar/mert-kaplan`                                                         | "mert kaplan" (32 · 8,19)                                                                                       | Mert Kaplan — Görüntü Yönetmeni **31 (41)** — değişmedi  | aynı **31 (41)**                                               | şablon türetmesi: "Mert Kaplan — Görüntü Yönetmeni. Sinematik bir gözle çalışan görüntü yönetmeni…" **156**      | Mert Kaplan, INDOLES görüntü yönetmeni: reklam filmi, kurumsal belgesel ve marka hikâyelerinde… **156**      |
| 6   | `/tr/yazilar/turkiyenin-ilk-geo-denetim-araci`                                        | "türkçe geo aracı var mı" (19 · 2,21) · "yerli geo aracı" (17 · 1,35)                                           | Türkiye'nin ilk GEO denetim aracı yayında **41 (51)**    | Türkçe GEO denetim aracı: siteyi 5 sinyalde ölçün **49 (59)**  | GEO artık ölçülebiliyor. Türkiye'nin ilk GEO denetim aracı… **155**                                              | Türkçe GEO aracı var mı? Var: Türkiye'nin ilk GEO denetim aracı… **158**                                     |
| 7   | `/tr/danismanlar/burak-ozgul`                                                         | "burak arda" (17 · 8,47) · "arda ozgul" (3 · 4,00)                                                              | Burak Arda Özgül — Kurucu **25 (35)**                    | Burak Arda Özgül — Kurucu · Marka Stratejisti **45 (55)**      | şablon türetmesi: "Burak Arda Özgül — Kurucu · Marka Stratejisti ve Kreatif Direktör. Marka stratejisi…" **145** | Burak Arda Özgül, INDOLES kurucusu; marka stratejisi ve performans pazarlamayı aynı masada tutar… **160**    |
| 8   | `/tr/yazilar/satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi` | "nitelik b2b" (7 · 6,86)                                                                                        | B2B lead kalitesi: ICP, lead scoring ve huni **44 (54)** | Nitelikli B2B lead nasıl toplanır: ICP ve puanlama **50 (60)** | değişmedi **157**                                                                                                | değişmedi **157**                                                                                            |
| 9   | `/dijital-cagda-gerilla-pazarlama-evrimi/` (eski URL, 301)                            | "dijital gerilla pazarlama" (7 · 7,00)                                                                          | Gerilla pazarlama: dijital çağda ne değişti **43 (53)**  | Dijital gerilla pazarlama: bugün ne işe yarar **45 (55)**      | değişmedi **154**                                                                                                | değişmedi **154**                                                                                            |
| 10  | `/en/consultants/burak-ozgul`                                                         | "burak arda" (4 · 8,75) · "arda ozgul" (4 · 4,75)                                                               | Burak Arda Özgül — Founder **26 (36)**                   | Burak Arda Özgül — Founder · Brand Strategist **45 (55)**      | şablon türetmesi: "Burak Arda Özgül — Founder · Brand Strategist & Creative Director…" **159**                   | Burak Arda Özgül, INDOLES founder; keeps brand strategy and performance marketing at the same table… **156** |
| 11  | `/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru`                                 | "şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin?" (10+4 · 6,70 / 7,25) | Yapay zeka danışmanı seçerken 12 soru **37 (47)**        | Yapay zeka danışmanı nasıl seçilir? 12 soru **43 (53)**        | değişmedi **154**                                                                                                | değişmedi **154**                                                                                            |

Satır 2 ve 9 aynı içerik kaydının (`dijital-cagda-gerilla-pazarlama-evrimi`) iki dilidir; EN title satır 2'yi, TR title satır 9'u karşılar.

`/en/danismanlar/mert-kaplan` ve `/en/consultants/mert-kaplan` tarafı da aynı kayıttan beslenir; EN description şablon türetmesinde 121 karakterde pillar adına ("Focus on the INDOLES team: Growth.") düşüyordu, artık **159** karakterlik yazılmış metin basılıyor.

### Tip değişikliği

`ConsultantContent`'e opsiyonel `seo?: { title?; description? }` eklendi (`src/lib/content/types.ts`). `danismanlar/[slug]/page.tsx` `generateMetadata`'sı alanı **ezer, kırmaz**: doldurulmamış danışman eski şablon türetmesinde kalır (9 danışmandan 7'si bugün orada). İçerik alanı olduğu için ADR gerekmedi; şema notu `docs/05-tech-architecture.md` §4.7'ye yazıldı.

## 3. İki ek değişiklik (gövde)

Bu ikisi title/description dışındadır; sorgu niyeti ile sayfanın verdiği cevap arasındaki boşluğu kapatır.

**(a) `turkiyenin-ilk-geo-denetim-araci` — araç linki: değişiklik gerekmedi.** Yazının ilk paragrafı zaten `[GEO Görünürlük Denetleyicisi](/araclar/geo-gorunurluk-denetleyicisi)` linkini taşıyor (EN'de `[GEO Visibility Checker]`, aynı yol; çözücü `/en/tools/geo-visibility-checker` üretiyor). Görev tanımındaki "zaten ilk paragrafta link varsa dokunma" koşulu geçerli — ilk ekran sorunu yalnız SERP tarafındaydı, title ve description onu kapatıyor.

**(b) `ai-danismani-secerken-sorulacak-12-soru` — GEO köprü paragrafı: eklendi.** Sayfaya gelen en yüklü sorgu "şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin?" (14 gösterim, poz. ~6,7); niyet GEO, yazı ise AI dönüşüm danışmanlığını anlatıyor. Girişteki üçüncü paragrafın hemen ardına, ilk H2'den önce üç cümlelik bir köprü paragrafı kondu: ChatGPT/Gemini/Perplexity'de anılmanın ayrı bir iş olduğunu (GEO) söyler ve iki yere bağlar — `[yapay zeka aramalarında öne çıkma rehberi](/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz)` ve `[GEO Görünürlük Denetleyicisi](/araclar/geo-gorunurluk-denetleyicisi)`. EN paritesi İngiliz imlasıyla yazıldı (`tests/unit/en-spelling.test.ts`); kanonik `generative engine optimization` terimi korunan istisna listesinde. SSS'e ekleme yapılmadı — H2 tekrarı ve 40 kelime kuralları oraya ek yapmayı uygun kılmıyor.

## 4. Kontrol — 2 Ekim 2026

Ölçüm GSC'de yapılacak; değişiklik 18 Eylül'de dalda hazır, canlıya alındığı gün sayaç başlar.

| Ne ölçülür                                | Kaynak                                           | Eşik                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 11 sayfanın CTR'ı                         | GSC Performans, sayfa bazında, 14 günlük pencere | A-3 eşiğinden çıkmış olmak: CTR ≥ %1 (poz < 10, göst ≥ 20 koşulları sabit)                                                 |
| Pozisyon regresyonu                       | Aynı rapor                                       | Ortalama pozisyon en fazla 1 kademe gerilemiş olmalı — başlık değişimi sıralamayı düşürmemeli                              |
| Google'ın başlığı yeniden yazması         | SERP elle kontrol (11 sorgu)                     | Yeni `<title>` SERP'te aynen görünüyor mu; Google kendi başlığını basıyorsa o satır yeniden yazılır                        |
| `turkiyenin-ilk-geo-denetim-araci`        | "türkçe geo aracı var mı", "yerli geo aracı"     | Poz. 1-2'de sıfır tık devam ediyorsa sorun başlıkta değil, SERP özelliğindedir (AI Overview kutusu) — ayrı teşhis          |
| `ai-danismani-secerken-sorulacak-12-soru` | GEO sorgusu                                      | Köprü paragrafı tıklamayı açmazsa niyet bu sayfada karşılanamıyor demektir; GEO danışmanlığı için ayrı hedef sayfa gerekir |

Kontrol tarihinde CTR hâlâ %1'in altındaysa bir sonraki kaldıraç description değil, sayfanın kendisidir: sorgu niyetiyle sayfa türü eşleşmiyordur.

## 5. Doğrulama kaydı (18 Eylül 2026)

- `pnpm typecheck` · `pnpm lint` (hata yok; mevcut uyarılar korundu) · `pnpm test` (156 dosya, 1674 test geçti) · `pnpm build` — tamamı yeşil.
- `pnpm seo:audit --base http://localhost:3126 --allow-noindex`: 150 URL, **FAIL yok**. `title-length` ve `description-length` kurallarından hiçbir sayfa düşmedi. Kalan 19 `word-count` WARN'ı bu değişiklikten önce de vardı (13 danışman sayfası + index/legal/static) ve gövde uzunluğuyla ilgilidir.
- `--allow-noindex` bayrağı zorunluydu: yerel `pnpm build` production stage'i taşımadığı için tüm sayfalar `noindex, nofollow` basıyor (LG-04 ile aynı env davranışı). Bayraksız koşuda 148 sayfa yalnız `robots-meta` kuralından düşüyor, başlık/açıklama kuralları yine temiz.
- 11 sayfanın `<title>` ve `<meta name="description">` değerleri `curl` ile tek tek doğrulandı; tablodaki yeni değerler birebir basılıyor.
- Köprü paragrafının linkleri iki dilde de doğru çözülüyor: TR `/tr/araclar/geo-gorunurluk-denetleyicisi` + `/tr/yazilar/yapay-zeka-aramalarinda-nasil-one-cikarsiniz`, EN `/en/tools/geo-visibility-checker` + `/en/articles/how-to-stand-out-in-ai-search`.
