> **Kurtarma notu (2026-08-27):** Bu rapor 2026-08-24'te üretildi ama o gün repoya hiç yazılmadı — çıktı olarak kaldı ve dosyalaşması onaylanmadı. Strateji v1.4 changelog'u ona `docs/18` diye atıf yaptığı için numara boşta kalmıştı. Metin 2026-08-27'de oturum kaydından eksiksiz kurtarılıp buraya, **o günkü hâliyle** alındı; sonradan çözülen bulgular bilerek düzeltilmedi (tarihsel kayıt). Güncel durum için `docs/19-seo-geo-audit-2026-08-27.md`.
>
> **Sonradan kapanan kalemler:** S-03 (placeholder telefon), S-04 (teyitsiz Londra/Dubai), EN-03 (İngiliz imlası tekilleştirildi), EN-07 (Consent Mode v2 + banner uygulandı), §12'deki ölü olay taksonomisi (7/9 olay bağlandı). **Hâlâ açık ve docs/19'da tekrar görünenler:** İ-01/İ-02 (içerik motoru), G-04 (GEO ölçüm rutini), S-02 (Bing/IndexNow), §8 E-E-A-T (kadro LinkedIn'leri), §11 (lead magnet katmanı).

# INDOLES — SEO & GEO Denetim ve Puanlama Raporu

**Tarih:** 2026-08-24 · **Yöntem:** Bağımsız statik denetim (kaynak kod + içerik katmanı + strateji dokümanları) · **Otoriteler:** `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` v1.3, `Rakip-Analizi-P0-SERP.md`, `docs/08-seo-i18n-strategy.md`, ADR-018/019/020/021, CLAUDE.md

## 0. Kapsam sınırı — dürüst not

Build çalıştırılmadı (onay verilmedi). Bu yüzden **çalışma zamanı doğrulanmadı**: canlı `<head>` yerleşimi, gerçek `robots.txt`/`sitemap.xml` çıktısı, Lighthouse, Core Web Vitals ve production env değerleri bu raporun kanıtı değildir. Bunların dışındaki her bulgu kaynak koddan, içerik katmanından ve 429 geçen birim testinden doğrulandı. Ölçümlerimi kendi yazdığım geçici analiz scriptleriyle yaptım (Türkçe `toLocaleLowerCase` "I"→"ı" tuzağı dahil, normalizasyon iki kez düzeltildi).

---

## 1. Yönetici özeti

**Genel puan: 6.5 / 10**

Tek cümlede: **teknik altyapı sınıfının çok üstünde, ticari ve editoryal uygulama sınıfın altında.** Bu site "arama motoruna nasıl teslim edilir" sorusunu neredeyse kusursuz çözmüş; "aramada ne için görüneceğiz" sorusunu henüz çözmemiş.

| # | Alan | Puan | Ağırlık | Durum |
|---|---|---|---|---|
| 1 | Teknik SEO altyapısı | **8.5** | 14% | Çok iyi |
| 2 | Teknik GEO altyapısı | **8.0** | 11% | Çok iyi |
| 3 | Yapısal veri (JSON-LD) | **8.5** | 7% | Çok iyi |
| 4 | İçerik kalitesi ve derinliği | **7.5** | 11% | İyi |
| 5 | **Keyword mimarisi / niyet eşlemesi** | **4.5** | 12% | **Zayıf** |
| 6 | **İçerik motoru / stratejiye uygunluk** | **4.0** | 11% | **Zayıf** |
| 7 | İç link mimarisi | **7.0** | 5% | İyi |
| 8 | E-E-A-T / otorite sinyalleri | **5.5** | 6% | Orta |
| 9 | Çok dilli yapı (i18n teknik) | **9.0** | 5% | Mükemmel |
| 10 | **İngilizce SEO & GEO (pazar hazırlığı)** | **4.5** | 8% | **Zayıf** |
| 11 | Dönüşüm mimarisi | **4.0** | 4% | Zayıf |
| 12 | Ölçüm ve QA disiplini | **6.0** | 4% | Orta |
| 13 | Performans / erişilebilirlik | **6.5** | 2% | Orta (doğrulanmadı) |

Envanter: 12 hizmet · 3 pillar · 9 vaka · 16 makale · 4 paket · 10 danışman (9'u sayfalı) · **124 sitemap URL** · **429 test geçiyor**.

---

## 2. Teknik SEO — 8.5/10

### İyi olan

| Alan | Bulgu |
|---|---|
| Metadata teslimi | `htmlLimitedBots: /.*/` ile streaming metadata kapatılmış — Next 15'in Googlebot ve AI crawler'ları listeden dışlayan varsayılanı bilinçle iptal edilmiş. Kod yorumunda A/B build kanıtı duruyor. Bu, çoğu Next 15 sitesinde teşhis bile edilmemiş bir hata. |
| Metadata kapsamı | 15/15 sayfa tipinde `generateMetadata`; hepsi kendi canonical'ı. Tek merkez (`buildMetadata`) üzerinden geçiyor, OG/Twitter/hreflang tek yerde kuruluyor. |
| Başlık/açıklama disiplini | Ölçtüm: 12 hizmet `seo.description` **150-159**, 32 makale açıklaması **145-160**, 18 vaka **143-158**, statik sayfalar 143-160. Başlıklar ≤50 (+10 karakter şablon). Sınır dışına taşan tek bir yüzey yok. |
| Sitemap | 124 URL, her girdide hreflang üçlüsü, `lastmod` içerikten türüyor (vakada `period`, makalede `updatedAt`). "Her deploy'da her sayfa değişti" sinyali yok. |
| Redirect | 39 kural. Konu dışı yönlendirme bilinçle reddedilmiş (soft-404 gerekçesi kodda yazılı) — bu, ajansların %90'ının yaptığı hatayı yapmama kararı. |
| robots.txt | Production/preview ayrımı, 10 AI crawler açıkça `Allow`, kısıt listesi her blokta tekrar edilmiş (en özgül blok kazanır kuralı doğru uygulanmış). |
| CI | lint → typecheck → test → build → **robots smoke** → `seo:audit` (124 URL / 20 kural). robots smoke adımı tek satır ve en pahalı hatayı (`NEXT_PUBLIC_APP_STAGE` yanlışsa tüm site `Disallow: /`) yakalıyor. |

### Eksik olan

| Kod | Bulgu | Etki |
|---|---|---|
| S-01 | **Tek jenerik OG görseli** — 124 URL'in tamamı aynı "INDOLES" marka kartını paylaşıyor. `opengraph-image.tsx` yorumu "sayfa bazlı dinamik OG bu turda kapsam dışı" diyor. | Strateji §4 LinkedIn dağıtımını "bütçesiz dönemin tek bedava çarpanı" sayıyor. 16 makale + 9 vaka aynı kartla paylaşılıyor; CTR doğrudan düşüyor. **Görsel** olarak bu, en yüksek getirili tek düzeltme. |
| S-02 | **Doğrulama ve IndexNow yok** — repoda `google-site-verification`, Bing doğrulama dosyası, IndexNow anahtarı yok. | Strateji §3 kalem 6 Bing'i "ChatGPT'nin arama altyapısı, Google kadar kritik" diyor. Kod tarafı boş. |
| S-03 | **Placeholder telefon canlı** — `+90 212 111 22 33` her sayfanın topbar'ında, footer'da ve CTA bölümünde `tel:` linki olarak. `company.ts` TODO'su Nisan'dan beri açık. | Bir premium konumlandırmada sahte numara, güven sinyalini tersine çevirir. NAP tutarlılığı (lokal SEO) da bunun üstüne kurulamaz. |
| S-04 | **Doğrulanmamış lokasyonlar yayında** — `locations: ["Levent, İstanbul", "London", "Dubai"]`, kodda "TODO(burak): Londra/Dubai varlığını teyit et" notuyla. | Londra iddiası EN stratejisinin merkezinde (`ux agency london`). Teyitsizse hem yanlış veri hem GBP/NAP çelişkisi. |
| S-05 | **Sayısal tutarsızlık** — `/vakalar` açıklaması "**On** iş, rakamlarıyla" / "**Ten** engagements", gerçek vaka sayısı **9**. `/danismanlar` "**On** kişilik iç ekip" — 9 insan + 1 ofis köpeği (`hipnoz`). | SERP'e giden metinde doğrulanabilir yanlış. `docs/04 §10` içerik dürüstlüğü kuralının kendi ihlali. |
| S-06 | **Spec sapması** — `docs/08 §4.1` dil bazlı sitemap + index öngörüyor; uygulama tek düz dosya. | Fonksiyonel etki düşük, ama doküman-kod tutarsızlığı ADR disiplinine aykırı (ya doküman güncellenmeli ya uygulama). |

---

## 3. Teknik GEO — 8.0/10

### İyi olan

- **llms.txt** llmstxt.org biçiminde: 86 markdown bağlantı, çıplak URL yok, tüm host'lar `SITE_URL`'den. İçerik katmanından üretiliyor — slug değişince sessizce eskimiyor.
- **llms-full.txt** (~114 KB): hizmet kapsamları, vaka problem/çözüm/sonuç + metrikler, paket detayları, makale özetleri, kadro — TR+EN. Harita/döküm iş bölümü kodda gerekçelendirilmiş.
- **robots.txt'te 10 AI ajanı adıyla `Allow`** — `docs/08 §5`'in "opak değil, şeffaf" duruşu artık makine-okunur.
- **SSS disiplini**: 44 yüzeyde ~700 soru-cevap. Ölçtüm: **293 hizmet+makale cevabının hiçbiri 40 kelimenin altında değil**, hiçbiri anafora ile başlamıyor. Bu kural testte kodlanmış (`services-content.test.ts`). Alıntılanabilirlik açısından bu, sektörde nadir bir titizlik.
- **Native `<details>` kararı** doğru gerekçelendirilmiş: JS akordiyonu içeriği DOM'a hiç koymaz, `<details>` koyar — GPTBot/ClaudeBot metni okumaya devam eder.

### Eksik olan

| Kod | Bulgu | Etki |
|---|---|---|
| **G-01** | **Persona çift-render'ı ham HTML'i kirletiyor.** `PersonaText` iki varyantı da DOM'a basıyor, seçimi CSS yapıyor. Ölçtüm: persona-aware yüzeylerde **industrial 3.294 + commerce 3.065 TR kelime** (EN'de bir o kadar daha) yan yana duruyor. | İki yönlü zarar: (a) **CSS çalıştırmayan AI crawler'lar** — yani GEO stratejisinin tam hedef kitlesi — her cümlenin iki çelişen versiyonunu okuyor. `PersonaSeparator` yalnız kelimelerin birbirine yapışmasını çözüyor, **tekrarı çözmüyor**. (b) **Googlebot'ta cookie yok** → `commerce` varyantı `display:none` → ticaret persona'sının ~3.000 kelimelik kopyası (sepet terk, checkout, e-ticaret dili) Google'a hiç görünmüyor. Ticaret founder'ı stratejinin iki birincil SEO persona'sından biri. |
| G-02 | **Makale H2'leri Q&A formatında değil.** Ölçtüm: 108 makale H2'sinin **yalnız 16'sı (%15)** soru formunda. "Gerilha pazarlamanın evrimi", "Hikâye anlatımının gücü", "Sonuç: eskimeyen üçlü" gibi editoryal başlıklar. | Strateji §1 ilke 2 ve §4 açıkça "Q&A-formatlı H2/H3" şart koşuyor. SSS blokları bunu kısmen telafi ediyor ama gövde başlıkları cevap motorlarına pasaj sınırı vermiyor. |
| G-03 | robots.txt `llms.txt`'e işaret etmiyor (`MetadataRoute.Robots` serbest satır kabul etmiyor; raw route'a çevrilmemiş). | Küçük ama ucuz kazanç. |
| G-04 | **GEO ölçüm rutini kurulmamış.** Strateji §5 ayda 1, sabit 10 promptluk ChatGPT/Gemini/Perplexity turu ve sonuç tablosu öngörüyor. Repoda veya `docs/strateji/` altında böyle bir tablo yok. | "GEO'nun GSC'si yok, disiplinli manuel takip tek yöntem" diyen stratejinin kendi ölçüm aracı eksik. Baz çizgisi alınmadan geçen her ay geri gelmiyor. |
| G-05 | llms.txt tek dosyada iki dil; `/en/llms.txt` ayrı yayın yok. Paketler ve danışmanlar llms.txt'te (haritada) yok, yalnız llms-full'de. | Küçük. |

---

## 4. Yapısal veri (JSON-LD) — 8.5/10

| Sayfa tipi | Şemalar |
|---|---|
| Ana sayfa | Organization + **WebSite** + WebPage |
| Hizmetler indeksi / Vakalar / Yazılar / Paketler / Danışmanlar | Organization + WebPage + Breadcrumb + **ItemList** |
| Hizmet detay | + **Service** + OfferCatalog/PriceSpecification + **FAQPage** |
| Pillar detay | + Service + Offer + **FAQPage** |
| Vaka detay | + **Article** (`about`: müşteri + sektör) + **FAQPage** |
| Makale detay | + **Article** + **Person** + `articleSection` + `keywords` + **FAQPage** |
| Danışman detay | + **Person** (`worksFor`, `knowsAbout`) |
| İletişim | + **ProfessionalService** (geo, açılış saatleri) |
| KVKK | Organization + WebPage + Breadcrumb, `noindex` |

Kapsama **9/9 sayfa tipi**. Tek `@graph`, `@id` referansları çözülüyor, `ProfessionalService` Organization'ı aynı `@id` ile genişletiyor (varlığı ikiye bölmüyor) — bu ince ve doğru bir karar.

**Özellikle takdir edilesi dürüstlük kararları** (hepsi kodda gerekçeli): telefon placeholder olduğu için `telephone` basılmıyor; vaka tarihi ISO olarak yok diye `datePublished` basılmıyor; metrikler serbest metin olduğu için `Rating`/`QuantitativeValue` kılığına sokulmuyor; `SearchAction` yok çünkü site içi arama yok. **Şema alanı sayısını doğruluğa tercih etmemek**, bu sektörde nadir.

Eksikler: `sameAs` yalnız 3 kurumsal profil; `Person` düğümlerinin 10'undan 9'unda `sameAs` yok (bkz. §8); paket detayında `Product`/`Offer` yerine `Service` kullanılmış (savunulabilir ama fiyat rich result'ı kaçırıyor).

---

## 5. İçerik kalitesi — 7.5/10

### Ölçümler

| Yüzey | TR kelime | EN kelime | SSS | Not |
|---|---|---|---|---|
| 12 hizmet | 903–990 (ort. 947) | 1.116–1.209 (ort. 1.178) | 11 | Homojen, hiçbiri ince değil |
| 16 makale | 660–1.538 (ort. 953) | 842–2.021 (ort. 1.184) | 10-11 | Alt sınır (660) biraz düşük |
| 9 vaka | 655–908 (ort. 747) | 813–1.183 | 10-12 | Metrik + `context` disiplini var |
| 4 paket | persona-aware | persona-aware | 11 | Soru başına 4 metin (2 persona × 2 dil) |
| 3 pillar | — | — | 11 | Katman ayrımı gerekçelendirilmiş |

**Güçlü yanlar:** Editoryal ses gerçekten INDOLES'e ait — boilerplate ajans dili yok. Vaka metrikleri `context` alanı taşıyor (ölçüm çerçevesi yazılı). `scope.excludes` ("neyi yapmayız") rakiplerde bulunmayan, AI motorlarının alıntılamaya yatkın olduğu ayrıştırıcı cümleler üretiyor. Açıklamalardaki her rakamın içerikte geçmesi **teste bağlanmış** — uydurma koruması yapısal.

**Zayıf yanlar:**

| Kod | Bulgu |
|---|---|
| **İ-01** | **İçerik motoru hiç çalışmadı.** 16 makalenin tamamı eski WordPress'ten taşınan revizyonlar. En son yayın tarihi **2026-01-15** — 7 aydır yeni yazı yok. Strateji §4'ün 12 haftalık takviminde **24 slot var, 0'ı üretilmiş.** |
| **İ-02** | **P0 kümelerinde editoryal boşluk.** Konu dağılımı: `marka-hikaye` 4, `performans-pazarlama` 3, `is-gelistirme` 2, `musteri-elde-tutma` 2, `e-ticaret` 1, `cro` 1, `ui-ux` 1, `geo` 1, `video-kreatif` 1, **`yapay-zeka` 0**. Yani P0-müşteri kümelerinden birinde (yapay zeka) sıfır, diğerinde (CRO) bir yazı; P0-trafik kümesinde (GEO) bir yazı. Rakip analizi §3 "GEO penceresi daralıyor, Poligon ve Adroket girdi" diyor. |
| İ-03 | Makale alt sınırı 660 kelime (LTV yazısı). Rakip analizi Poligon'un sayfasını "3 dk okuma, bizimki iki katı derinlikte olmalı" diyor — bu yazı o eşiğin altında. |
| İ-04 | 3 doğrulanabilir yanlış: "On iş" (9), "On kişilik ekip" (9 insan), teyitsiz Londra/Dubai. |

---

## 6. Keyword mimarisi ve niyet eşlemesi — 4.5/10 (en zayıf teknik alan)

245 kelimelik resmi keyword haritasını (`keyword-hacim-birlesik.csv`) her kelimenin **kendi hedef sayfasının gerçek metnine** karşı test ettim.

**Sonuç: 49/245 kelime (%20) hedef sayfasında birebir geçiyor.**

| Dil | Kelime kapsaması | Hacim kapsaması |
|---|---|---|
| TR | 44/214 (%21) | 32.000 / 65.400 (**%49**) |
| EN | 5/31 (%16) | 1.600 / 5.450 (**%29**) |

Hacim kapsamasının kelime kapsamasından yüksek olması iyi haber: en büyük hacimli terimler (`iş geliştirme`, `iş zekası`, `işletme mühendisliği`, `mvp`) karşılanmış.

### Kök neden tek bir örüntü: ticari niteleyici ailesi yok

Site "**ajansı / firması / şirketi / -agency / -company**" ekli hiçbir kelimeyi kullanmıyor:

| Kelime | Hacim | Rekabet | Durum |
|---|---|---|---|
| google reklam ajansı | 1B-10B | Orta | Sitede hiç yok |
| dijital reklam ajansı | 1B-10B | Orta | Sitede hiç yok |
| performans pazarlama ajansı | 100-1B | Orta | Sitede hiç yok |
| **cro ajansı** | 100-1B | — | **Sitede hiç yok** |
| e ticaret danışmanlığı / danışmanı / ajansı | 100-1B ×3 | Orta | Hedef sayfada yok |
| yazılım ajansı / yazılım firması | 100-1B ×2 | Orta | Sitede hiç yok |
| it danışmanlığı / yazılım danışmanlığı | 100-1B ×2 | Orta/Düşük | Sitede hiç yok |
| ux tasarımı / ui tasarımı | 100-1B ×2 | Düşük/Orta | Hedef sayfada yok |
| shopify / trendyol danışmanlığı | 100-1B ×2 | Orta | Sitede hiç yok |
| yönetim danışmanlığı / kurumsal danışmanlık | 100-1B ×2 | Orta | Sitede hiç yok |

**Bunun bir kısmı bilinçli.** Strateji §1 ilke 4 "premium filtre" diyor: "web tasarım gibi hacimli-ucuz kelimeler bilinçli dışarıda." Ton disiplini de (CLAUDE.md, "gereksiz anglicizm yok") aynı yöne çekiyor.

**Ama bir kısmı bilinçli değil ve strateji ile doğrudan çelişiyor.** Strateji `cro ajansı`nı "**en hızlı kazanılabilir müşteri kelimesi**" (80 gösterim, poz. 13), `yapay zeka ajansı`nı "kümenin en alınabilir ticari kelimesi", `e-ticaret danışmanlığı`nı P1 hedefi olarak adlandırıyor. Rakip analizi Poligon'un gücünü "**title birebir 'CRO Ajansı'**" diye tarif ediyor. `yapay zeka ajansı` sonradan eklenmiş (SSS'te geçiyor) — aynı işlem CRO ve e-ticaret için yapılmamış.

**Bu, tonu bozmadan çözülebilir bir sorun:** SSS sorusu ("CRO ajansı ile çalışmak ne zaman mantıklı olur?"), karşılaştırma bölümü, veya H2. Nitekim `yapay zeka ajansı` için tam olarak bu yapılmış.

**Doğru yapılanlar da var:** `dönüşüm oranı optimizasyonu`, `a/b testi`, `sepet terk`, `yapay zeka danışmanlığı`, `kurumsal yapay zeka`, `mobil uygulama geliştirme`, `kullanıcı deneyimi tasarımı`, `iş geliştirme` (hizmetler indeksi başlığında) hedef sayfalarında yerinde.

---

## 7. İç link mimarisi — 7.0/10

| Yön | Durum |
|---|---|
| Hizmet → vaka | **Çözüldü.** `ServiceCaseProof` ile 12 hizmetin hepsi ilgili vakadan 3 rakamlı sonucu atıflı gösteriyor. Rakip analizinin "kimsede yok" dediği fark. |
| Vaka → hizmet | **Çözüldü.** `serviceSlugs` ile 9 vakanın künyesi hizmet sayfalarına linkli (1-4 link/vaka). Karşılığı olmayan disiplinler bilinçle linklenmemiş. |
| Makale → vaka | **İyi.** 16 makalenin 13'ünde gövde içi link; 39 vaka linki. |
| Makale → hizmet | **Zayıf ve dengesiz.** Toplam 12 link, dağılım: performans-pazarlama 10, cro 6, ui-ux 2, e-ticaret 2, dijital-dönüşüm 2, **ai-danismanlik 2**. P0 para sayfalarına akış ince. |
| Hizmet → makale | Bilinçli boş bırakma: ADR-021 `topics.serviceSlug` eşlemesi yoksa blok hiç render edilmiyor. "Filler eklenmedi" kararı doğru — ama `yapay-zeka` konusunda 0 yazı olduğu için AI hizmet sayfasında bu blok hiç görünmüyor. |
| Orphan | Yok. `hipnoz` bilinçle 404. |

---

## 8. E-E-A-T ve otorite — 5.5/10

Strateji §5'in en net kaldıracı: "**Kadro = 10 entity** → her danışman profili ↔ kişisel LinkedIn karşılıklı link, Person schema. Tüzel anonimlik yerine 10 isimli uzman ağı — E-E-A-T çarpanı."

**Uygulama: 10 danışmandan 1'inde LinkedIn URL'i var (Burak).** Person şeması 9 kişide `sameAs` olmadan basılıyor — yani AI modellerinin entity'yi çapraz kaynaktan doğrulama imkânı yok. Kaldıraç kurulmuş ama kolu çekilmemiş.

| Sinyal | Durum |
|---|---|
| Yazar çeşitliliği | 5 yazar / 16 yazı (burak 8, cagri 3, can 3, sude 1, mert 1). Makul. |
| Author schema | Var, `url` ile danışman sayfasına bağlı. |
| Person `sameAs` | **1/10** |
| Organization `sameAs` | 3 profil (LinkedIn, Instagram, X) |
| Vaka müşteri sözü | 6/9 vakada `testimonial` |
| ADUARDO kanıtı | Rakip analizinin "en net farklılaştırıcı" dediği iddia (**kendi AI ürününü inşa etmiş ekip**) hâlâ yalnız iki danışman biyografisinde. Ana sayfa, hakkımızda ve yapay zeka hizmet sayfasında geçmiyor. |

---

## 9. Çok dilli yapı (i18n teknik) — 9.0/10

Bu, projenin en olgun katmanı.

| Kontrol | Durum |
|---|---|
| Path-based `/tr` `/en`, `localePrefix: always` | Var |
| **Segment çevirisi** (`/hizmetler` ↔ `/services`, `/paketler` ↔ `/packages`, `/gizlilik-kvkk` ↔ `/privacy`) | Tam — 13 pathname eşlemesi |
| hreflang üçlüsü (tr + en + x-default→tr) | Her sayfada ve her sitemap girdisinde |
| Karşılıklılık (reciprocal) | `seo:audit`'te kural olarak kodlanmış (`hreflang-reciprocal`) |
| `<html lang>` | Kök layout'ta `getLocale()`'den — Türkçe `text-transform: uppercase` (İ/ı) hatasını çözen doğru sebep kodda yazılı |
| Mesaj paritesi | **285 / 285 anahtar, tek fark yok** (testle de korunuyor) |
| İçerik paritesi | `Localized<T>` tipi sayesinde eksik çeviri **typecheck'te** patlıyor — 16 makale, 12 hizmet, 9 vaka, 4 paket, 3 pillar %100 iki dilli |
| Locale-başına slug | Makale ve hizmetlerde var (`how-to-stand-out-in-ai-search`) |
| Metrik biçimi | Dile duyarlı: TR `1,5M $` / EN `$1.5M`, `%90` / `90%`, `5 dk` / `5 min` |
| Dil değiştirici | `localeHref()` ile 307 zincirsiz |

**Tek gerçek eksik:** vaka slug'ları locale'den bağımsız — `/en/case-studies/istanbul-ortez-protez-arama-gorunurlugu`, `/en/case-studies/sim-baski-ihracat-icerigi`. 9 EN vaka URL'inin tamamı Türkçe. EN okurun ve EN arama motorunun okuyamadığı URL'ler. (ADR-019'da bilinçli karar; EN eşit öncelikliyse yeniden değerlendirilmeli — 301 maliyeti şimdi düşük.)

---

## 10. İngilizce SEO & GEO — 4.5/10

Teknik parite mükemmel (§9), **pazar hazırlığı değil.** EN'i ayrı puanlıyorum çünkü "eşit önemde" dediniz ve teknik eşitlik ticari eşitlik değil.

### Bulgular

| Kod | Bulgu | Kanıt |
|---|---|---|
| **EN-01** | **EN keyword kapsaması %16 kelime / %29 hacim.** 31 EN kelimesinden 5'i hedef sayfasında geçiyor: `ai consultancy`, `digital transformation consultancy`, `business development consultancy`, `generative engine optimization`, `geo optimization`. | Ölçüldü |
| **EN-02** | **Stratejinin adlandırdığı EN önceliklerinin 3'ü de eksik.** §2.0 karar 6: "EN önceliği: ai consultancy / artificial intelligence consulting / digital transformation consultancy + **ux agency london** (EN'in en alınabilir kelimesi) + **custom software development company**". Bunlardan `artificial intelligence consulting`, `ux agency london`, `custom software development company` hedef sayfalarında **hiç geçmiyor**. `mobile app development company` (tek "Yüksek rekabet" kelimesi) de yok. | Ölçüldü |
| **EN-03** | **İngilizce imla tutarsız.** `optimisation` 27 / `optimization` 33; `behaviour` 17 / `behavior` 13; `optimise` 1 / `optimize` 19; `organisation` 5 / `organization` 0; `programme` 4, `catalogue` 4. Hatta aynı sayfada: CRO `name.en` = "conversion optim**iz**ation", `lede.en` = "conversion rate optim**is**ation". | Ölçüldü |
| **EN-04** | **Londra/UK güven katmanı yok.** Strateji F3 "working with EU/UK clients from Istanbul" içeriği (saat dilimi, referans, İngilizce çalışma düzeni) öngörüyor. Repoda UK/Europe geçen tek yer: bir danışman biyografisi ("Runs international project operations from the London office") ve `company.ts`'teki teyitsiz "London". | Doğrulandı |
| EN-05 | 9 EN vaka URL'i Türkçe slug taşıyor (§9). | Doğrulandı |
| EN-06 | OG görselinin `alt` metni her iki dilde Türkçe ("İş geliştirme danışmanlığı"). | Doğrulandı |
| EN-07 | **KVKK/GDPR uyumsuzluğu EN pazarını doğrudan vuruyor.** `docs/14 §3` "GA4 analitik cookie'leri **EEA ziyaretçileri için opt-in**" diyor; sitede consent banner'ı, Consent Mode v2 veya herhangi bir onay mekanizması **yok** — GA4 production'da koşulsuz yükleniyor. | Doğrulandı |

### EN içerik kalitesi — burada iyi haber

EN metinler **çeviri değil, yeniden yazım.** Örnek: `layout.tsx`'te EN description'ın kodda yazılı gerekçesi "Çeviri değil, yeniden yazım: EN arama niyeti 'transformation consultancy Turkey' ve 'manufacturing digital transformation' ekseninde." EN metinler TR'den sistematik olarak **%25 daha uzun** (hizmet: 947 → 1.178 kelime) — Türkçenin sondan eklemeli yapısı düşünüldüğünde bu doğru orandır, yani EN kısaltılmamış. EN SSS'ler de ≥40 kelime kuralına ayrı ayrı tabi.

**Yani EN'in sorunu kalite değil, hedefleme.** İçerik iyi yazılmış ama hangi sorguya cevap verdiği kararlaştırılmamış.

---

## 11. Dönüşüm mimarisi — 4.0/10

| Katman | Strateji §8 öngörüsü | Gerçek |
|---|---|---|
| BOFU | Cal.com CTA | Var (hero + sayfa sonu + nav + popup) |
| MOFU | 3 lead magnet (CRO checklist, AI hazırlık, e-ticaret denetimi) | **0/3** |
| MOFU | ADUARDO ortak sayfası (%10 indirim) | Yok |
| TOFU→MOFU | Bülten + e-posta serisi (Resend altyapısı hazır) | Bülten `mailto:` açıyor, liste kaydı yok |
| Ölçüm | Cal webhook | Gövde TODO stub (Burak kararıyla kapsam dışı — kendi takvim sistemi gelecek) |
| Makale içi CTA | — | Tek CTA sayfa sonunda |

Strateji "organik ziyaretçinin %97'si görüşmeye hazır değil, orta katman şart" diyor. Orta katman tamamen boş. Site yalnız yüksek taahhütlü CTA sunuyor.

---

## 12. Ölçüm ve QA — 6.0/10

**QA tarafı çok iyi (9/10):** 429 test, CI'da 6 adım, `seo:audit` 124 URL / 20 kural (`head-placement`, `canonical-self`, `og-image`, `robots-meta`, `hreflang-reciprocal`, `html-lang`, `persona-leak`, `word-count`…). Bu araç setinin kendisi, denetimde bulunan hata sınıflarının tekrarını yapısal olarak engelliyor. Nadir bir olgunluk.

**Ölçüm tarafı zayıf (3/10):**

- GA4 yükleniyor (`NEXT_PUBLIC_GA_ID` + production koşuluyla) → `page_view` akıyor.
- Entry popup **8 olay** gönderiyor (`popup_shown`, `popup_stage1_selected`, `popup_booking_submitted`…) — bu iyi.
- İletişim formu **1 olay** (`contact_form_submitted`).
- **`src/lib/analytics/events.ts`'teki tipli taksonominin (7+ olay) hiçbir çağrı yeri yok** — `booking_cta_clicked`, `case_study_viewed`, `package_viewed`, `pillar_viewed` ölü kod.
- Consent Mode / cookie banner yok (EN-07).
- GSC/Bing doğrulaması kod tarafında yok.

Sonuç: strateji §9'un KPI setinden (gösterim, CTR, magnet lead, Cal görüşmesi) yalnız birincisi GSC'den, popup funnel'ı GA'dan izlenebilir. CTA tıklaması, UTM, sayfa tipi etkileşimi ölçülmüyor.

---

## 13. Stratejiye uygunluk — 4.0/10

Strateji dokümanını madde madde karşılaştırdım:

| Strateji maddesi | Durum |
|---|---|
| §3 Launch-gate (8 kalem) | **6/8 tamam** (301, sitemap, llms.txt, JSON-LD, title/meta, CWV). Eksik: Bing+IndexNow, GBP (Burak'ta) |
| §1 ilke 1 — Bottom-funnel önce | **Kısmen.** Para sayfaları derin ve kanıtlı; ama BOFU kelime dağarcığı (`ajansı` ailesi) yok |
| §1 ilke 2 — Her içerik çift hedefli (Q&A H2, rakamlı iddia, yazar kimliği) | **Kısmen.** SSS ve yazar var; **Q&A H2 %15** |
| §1 ilke 3 — Kanıt keskinleştirilir | **Tamam.** Vaka→hizmet, hizmet→vaka, kanıt şeridi, vaka Article şeması, vaka SSS |
| §1 ilke 4 — Premium filtre | **Tamam** (belki fazla tamam — §6) |
| §2 Küme→tek hedef sayfa, cannibalization yasak | **Tamam.** ADR-021 taksonomisi bunu yazı tarafında da uygulanabilir kılmış |
| §4 İçerik motoru (haftada 2, 12 hafta = 24 içerik) | **0/24** |
| §5 GEO planı (varlık tutarlılığı, kanonik tanımlar, kadro=10 entity, Bing, ADUARDO, ölçüm) | **1/6** (on-site temel). Kadro 1/10, ADUARDO yok, Bing yok, ölçüm yok, kanonik tanım içerikleri yok |
| §6 Lokal SEO | Organization'da adres var, `areaServed` var; NAP telefonu placeholder; `LocalBusiness` yalnız iletişimde |
| §7 EN fazlaması F1 (parite + hreflang) | **Tamam.** F2/F3 başlamadı |
| §8 Dönüşüm mimarisi | **1/5 katman** |
| §10 S0 sprinti | **Tamam.** S1'in içerik kalemleri başlamadı |

**Örüntü net: her "kod işi" yapılmış, her "içerik ve dağıtım işi" bekliyor.**

---

## 14. En kritik 10 bulgu (etki sırasına göre)

| # | Bulgu | Alan | Neden bu sırada |
|---|---|---|---|
| 1 | İçerik motoru 0/24 slot; `yapay-zeka` konusunda 0 yazı, GEO'da 1 | Strateji | 6 ay hedefinin matematiği içerik hacmine bağlı; 7 aydır üretim yok, GEO penceresi rakip analizine göre daralıyor |
| 2 | Persona çift-render'ı: ~3.000 kelime commerce kopyası Googlebot'a `display:none`, AI crawler'a çift metin | GEO/SEO | İki birincil persona'dan birinin tüm kopyası aramaya görünmüyor; GEO hedef kitlesi çelişen metin okuyor |
| 3 | Ticari niteliyici ailesi (`ajansı/firması/-agency`) hiçbir para sayfasında yok — `cro ajansı` dahil | Keyword | Stratejinin "en hızlı kazanılabilir müşteri kelimesi"; tonu bozmadan SSS ile çözülebilir |
| 4 | EN keyword hedeflemesi yapılmamış: `ux agency london`, `artificial intelligence consulting`, `custom software development company` sayfalarında yok | EN | "Eşit önemde" denen pazarın hedefi tanımsız; içerik iyi ama hangi sorguya cevap verdiği belirsiz |
| 5 | Kadro = 10 entity kaldıracı kurulmamış: 1/10 LinkedIn | E-E-A-T | Şema hazır, veri eksik; en ucuz E-E-A-T çarpanı |
| 6 | Tek jenerik OG görseli / 124 URL | Teknik SEO | LinkedIn dağıtımı stratejinin tek bedava çarpanı |
| 7 | Consent Mode / cookie banner yok — `docs/14` EEA opt-in vaat ediyor | Uyum/EN | EN pazarı GDPR bölgesi; ayrıca kendi dokümanının ihlali |
| 8 | Placeholder telefon + teyitsiz Londra/Dubai canlı | Güven/Lokal | Premium konumla doğrudan çelişiyor, NAP kurulamıyor |
| 9 | Makale H2'lerinin %85'i Q&A formatında değil | GEO | Stratejinin açık şartı; SSS kısmen telafi ediyor |
| 10 | Lead magnet katmanı 0/3, bülten `mailto:` | Dönüşüm | "%97 hazır değil" tespitinin karşılığı yok |

---

## 15. Kapanış değerlendirmesi

**İyi olana iyi demek gerekiyor:** Bu sitenin teknik SEO ve GEO altyapısı, Türkiye'deki ajans/danışmanlık siteleri arasında üst yüzdelik dilimde. Next 15 streaming metadata tuzağını teşhis edip A/B build ile doğrulamak, `<details>` kararını hem crawler hem a11y gerekçesiyle yeniden değerlendirmek, şemaya doğrulanmamış veri basmamayı ilke edinmek, SSS cevaplarına "anafora ile başlayamaz + ≥40 kelime" kuralını **teste bağlamak**, robots smoke testini CI'a koymak — bunların hiçbiri standart iş değil. Kod yorumlarındaki gerekçe disiplini ise ayrı bir kalite katmanı: bir karara neden varıldığı, neyin denenip elendiği yazılı. Bu 8.5'i hak ediyor.

**Kötü olana kötü demek de gerekiyor:** Strateji dokümanı 299 satır ve çok iyi yazılmış. Ama uygulanan kısmı §3 (launch-gate) ve §1 ilke 3 (kanıt). §4 (içerik motoru), §5 (GEO off-site), §8 (dönüşüm) hiç başlamadı. 245 kelimelik keyword haritası hazırlanmış, hacim verisiyle kalibre edilmiş, kümelere ayrılmış — ve sayfa metinlerinin %80'i o haritayla konuşmuyor. Bu, planlama ile uygulama arasında **bir strateji dokümanının değil, bir üretim takviminin** eksik olduğunu gösteriyor.

**Bir cümlelik teşhis:** Site aramaya hazır; INDOLES aramada ne için görünmek istediğine dair kararı sayfa metinlerine henüz yazmadı.

**En yüksek getirili ilk üç hamle** (hepsi kod değil, içerik/veri işi):
1. 12 para sayfasına + 4 EN öncelik sayfasına ticari niteliyici kelimeleri SSS/H2 yoluyla yerleştirmek (1-2 gün, tonu bozmadan)
2. Persona çift-render'ının SEO/GEO etkisine karar vermek — para sayfalarında persona-aware katmanı kaldırmak veya `noindex` yerine tek varyanta indirmek
3. 10 danışmanın LinkedIn URL'ini toplamak (yarım gün, E-E-A-T çarpanını açar)

