# INDOLES Organik Büyüme Stratejisi — SEO + GEO v1.11

> **Statü:** Onaylı (v1.11 — 2026-09-01, araç ④ GEO Görünürlük Denetleyicisi canlıda — ADR-030)
> **Kanonik kopya:** 2026-08-23'ten itibaren bu dosya repo'da yaşar (`indoles-web/docs/strateji/`); güncellemeler burada changelog satırıyla yapılır. Desktop'taki kopya arşivdir.
> **Tarih:** 2026-08-20 · **Bağlam:** Yeni site launch'ına 3 gün
> **Veri tabanı:** GSC son 3 ay (22 tıklama / 2.190 gösterim / ort. poz. 17) + `indoles-web/docs/*` + Burak'ın strateji cevapları (2026-08-20)
> **Açık girdiler:** Rakip listesi · Keyword Planner hacim export'u · Launch içeriğinin final slug listesi · Eski slug'lar korunuyor mu?

### Değişiklik Günlüğü

| Sürüm | Tarih | Değişiklik |
|---|---|---|
| v1.11 | 2026-09-01 | **Araç ④ GEO Görünürlük Denetleyicisi canlıda** — Off-Site plan §2 Dalga A-B'nin amiral gemisi aracı, `ADR-030` ile CLAUDE.md §6 kapsam-dışı tablosundan çıktı. `/tr/araclar/geo-gorunurluk-denetleyicisi` + `/en/tools/geo-visibility-checker`: URL girer, 100 üzerinden GEO hazırlık skoru alır (beş kalem: AI erişimi/robots.txt, llms.txt, yapısal veri, hreflang/dil sinyalleri, soru-H2), detaylı rapor e-posta karşılığı (KVKK rızalı, MOFU lead). **Kelime hedefleri (kanibalizasyon disiplini, A-6):** araç sayfası ARAÇ niyetini hedefler — `GEO denetimi`, `GEO analiz aracı`, `AI görünürlük testi`, `llms.txt kontrolü`; bilgi niyeti (`geo optimizasyonu`, `yapay zeka arama optimizasyonu`) kanonik GEO rehberinde KALIR, araç H1'ine taşınmadı — `keyword-coverage.test.ts`'e araç sayfası çiftleri eklendi. **Diagnoo erteleme gerekçesi:** Off-Site planının v1.1 taslağı bu aracı Diagnoo'nun (çok-modüllü site denetim sistemi) bir GEO modülü olarak öngörüyordu; Diagnoo hiç deploy edilmedi (yalnız iki tasarım dokümanı var, main dalında). Var olmayan bir platforma bağımlılık launch'ı belirsiz bir tarihe kilitlerdi — ADR-030 motoru Worker-native kurdu (`src/lib/tools/geo/`, saf regex/JSON çıkarım fonksiyonları, ücretsiz Workers planının CPU bütçesine sığar) ve **taşınabilir `GeoScanInput`/`GeoScanResult` sözleşmesiyle** Diagnoo canlıya çıkarsa oraya taşınabilir bıraktı. GA4 taksonomisine `tool_used`/`tool_scan_completed`/`tool_report_requested` eklendi (`docs/12`). PostHog→GA4 ve Cal.com→kendi rezervasyon sistemi düzeltmeleri Off-Site planı §2/§4'e işlendi (bkz. o dosyanın kendi changelog'u). |
| v1.9 | 2026-08-28 | **Faz 2 yapısal içerik işleri (öğleden sonra partisi).** (1) **C-08 kapandı:** 3 marka-hikaye yazısına 4-5 iç link enjekte edildi (0→13 link, hepsi doğrulanmış hedef). (2) **C-09 kapandı:** makale→hizmet köprüsü artık yapısal — `topics.serviceSlug` yazı detayında köprü kartı olarak render ediliyor; vaka→makale yönü açıldı (`relatedArticlesForCase`, en yeni 3, `article-card.tsx` ortak bileşeni). (3) **Soru-H2 retrofiti:** eski 15 yazıda %12,7→%56,9 (külliyat geneli %69,7); 12 yazı `updatedAt: 2026-08-28` + updateNote aldı; numaralı seri ve editoryal sonuç başlıkları bilinçle korundu. (4) **İki GSC varyantı yerleşti:** `e ticaret dönüşüm oranı artırma` (e-ticaret scope) ve `performance marketing` (performans-pazarlama SSS, ilk-geçiş glosu) — `keyword-coverage` TARGETS +2 çift. (5) **G-10 şablonu kuruldu:** `GEO-Olcum-Rutini.md` — 10 sabit prompt (4/3/3), 3 motor, kayıt tablosu, A-5 bağlantısı; baz çizgisi cutover haftasını bekliyor, doküman Burak onayına açık. (6) Title Case düzeltmeleri (web-tasarım, RFM, video başlıkları cümle düzenine). **Ertelenen:** görsel katmanı — kök klasördeki blog-*.jpg dosyaları kapak değil sayfa ekran görüntüsü çıktı; kapak asset'i veya tipografik SVG kapak ADR'ı bekleniyor. Danışman LinkedIn URL'leri Burak'ın verisini bekliyor. |
| v1.8 | 2026-08-28 | **Dalga 1 içerik partisi yayına hazır — takvimin 1-4. hafta slotları dolduruldu.** 7 yeni yazı `articles.ts`'e girdi: h.1-2 `ai-donusumu-nedir` + h.2-2 `ai-danismani-secerken-sorulacak-12-soru` (**`yapay-zeka` konusu 0→2 makale**; 12 hizmetin 7'sindeki boş "ilgili yazı" bloğu açıldı) · h.7-2 `google-ai-overviews-da-yer-almak` + h.10-2 `llms-txt-nedir` (**K-3 uygulandı:** GEO kümesi tek makaleden üç makaleye bölündü, kanonik rehber aynı slug'da ~1.000→2.000+ kelimeye derinleştirildi ve `updatedAt` aldı) · h.1-1 `cro-nedir` + h.2-1 `cro-ajansi-nasil-secilir` (ticari niteleyici `cro ajansı` artık son SSS'e ek destek makalesi taşıyor) · h.4-2 `is-gelistirme-studyosu-nedir` (kanonik tanım). **Ucuz kazançlar kapandı:** `yapay zeka optimizasyonu` (GSC 136 gösterim) kendi H2'siyle kanonik rehbere, `ab testi` yazım varyantı ve `geo optimizasyonu` tam formu gövdelere yerleşti. Makale yüzeyi ilk kez regresyon altında: `keyword-coverage.test.ts`'e 16 kelime-yazı çifti eklendi (A-7 kapsamı genişledi). Teknik yan ürün: `resolveInlineHref` yazı slug'larını da locale'e çözüyor (yazıdan yazıya iç link EN'de artık 404 üretmez). Yazılar cutover ile yayına girer; GEO 10-prompt baz çizgisi yayın haftasında alınmalı (G-10 hâlâ açık). |
| v1.7 | 2026-08-27 | **Kelime önceliklendirmesi çıkarıldı** → `Keyword-Onceliklendirme-2026-08-27.md`. Kapsama Ağustos'tan bu yana 49/245 (%20) → **74/245 (%30)**; TR hacim %49→%56, EN %29→**%79**. Üç dalgalık hedef listesi, §4 takviminin yeniden sıralaması (AI ve GEO slotları öne, iki dolu slot yeniden atandı, iki yeni slot) ve dalga bazlı ölçüm çerçevesi + 7 alarm eşiği tanımlandı. **Dört uyarı:** hacim kapsamasının yarısı 4 kelimeden geliyor ve ikisi kariyer niyetli · GEO kümesinin 7 kelimesi tek makalede · ticari niteleyiciler yalnız son SSS'te · `yapay-zeka` konusunda 0 makale. Sekiz karar (K-1…K-8) Burak'ta. |
| v1.6 | 2026-08-27 | **Re-audit (`docs/19`) sonrası dört düzeltme.** **(1) EN payda düzeltildi:** v1.5'in "10/13" beyanı yanlış paydayı taşıyordu — korunan üç küme CSV'de 15 kelime içeriyor ve beyan edilmeyen iki kelime düşmüştü. İkisi de yerleştirildi: `business process automation consulting` → iş otomasyonu `seo.title.en`; `mvp development agency` → özel yazılım SSS cevabı (H1/title'a değil — yerleşim kuralı korundu). **Gerçek oran artık 13/15**; bilinçli bırakılan üç kelime (`ai transformation consulting`, `ai implementation services`, `geo optimization`) değişmedi. **(2) Cannibalization çözüldü:** §2 P1 satırının kendi çelişkisi giderildi (aşağıdaki düzeltme notu); "iş geliştirme danışmanlığı" artık yalnız `/tr/hizmetler` başlığında hedefleniyor — ana sayfa "Dönüşüm ve büyüme stüdyosu, İstanbul", hakkımızda "iki eksen, bir disiplin" başlıklarına geçti. Terim marka tanımı yüzeylerinde (llms.txt, manifest, OG, gövde metinleri) korundu. **(3) `docs/18` kurtarıldı:** v1.4'ün refere ettiği 24 Ağustos denetimi repoya hiç yazılmamıştı; oturum kaydından kurtarılıp `docs/18-seo-geo-puanlama-2026-08-24.md` olarak eklendi. **(4) SSS `<details>` kararı kayda geçti:** ADR-023 — okunabilirlik + native `<details>`'in ham HTML'de metin bırakması gerekçesiyle. **Yeni açık kalem:** EN hedefleri regresyon koruması altında değil (`keyword-coverage.test.ts` yalnız TR yüzeyini tarıyor). |
| v1.5 | 2026-08-24 | **Dalga 3-4 uygulandı.** TR: dar kapsamdaki 11 ticari kelimenin tamamı hedef sayfasında — `ajansı`/`firmaları` ailesi altı **karşı-konumlandırma SSS'i** yoluyla (Rakip-Analizi §1-2'nin önerdiği taktik), `danışmanlığı` ailesi başlık/açıklamada. `e-ticaret` başlığında iki kelimenin yeri değişerek tam eşleşme yakalandı. EN: hedef kelimelerin **10/13'ü** yerinde; üç 50/ay kelime (`ai transformation consulting`, `ai implementation services`, `geo optimization`) bilinçli bırakıldı — doğal yeri olmadan yerleştirmek kelime doldurma olurdu. İmla İngiliz biçiminde tekilleşti; kanonik terim adları (`generative engine optimization`, `answer engine optimization`, `LLM optimization`) ve marka adları (`Happy Center`) istisna. Paket SSS'leri ADR-022 ile tek sese indi (176 → 88 metin) ve `FAQPage` şeması artık görünen metnin aynısı. Yerleşim ve imla regresyon testlerine bağlandı (`keyword-coverage`, `en-spelling`). |
| v1.4 | 2026-08-24 | Bağımsız SEO/GEO denetimi (`docs/18`) sonrası dört karar işlendi. **(1) Londra varsayımı geçersiz:** §2.0 karar 6 `ux agency london`'ı "EN'in en alınabilir kelimesi" ilan etmişti; Londra ofisi teyit edilemedi (Burak) ve künyeden çıkarıldı. EN-UX kümesinin kalanı 50/ay bandında — küme fiilen değersizleşti. **(2) EN hedefi üç kümeye indi:** AI + Yazılım + GEO (~2.150/ay); EN-UX, EN-CRO ve EN-Ticaret bilinçli olarak bırakıldı. EN imla İngiliz İngilizcesinde tekilleşiyor. **(3) Ticari kelime politikası — dar kapsam:** yalnız stratejide adıyla geçen ~10 kelime (`cro ajansı`, `e-ticaret danışmanlığı` üçlüsü, `performans pazarlama ajansı`, `ui/ux ajansı`) sayfalara girer ve **H1'e değil, SSS ile `seo.description`'a**. Jenerik reklam havuzu (`google reklam ajansı` + `dijital reklam ajansı`, 10.000/ay) hizmet sayfalarının dışında; o niyet §4 takviminde bir makaleye bırakıldı. **(4) Ölçüm öne alındı:** Consent Mode v2 (EEA/UK opt-in, TR varsayılan açık) ve olay katmanı uygulandı — §9'un KPI'ları artık ölçülebilir. |
| v1.3 | 2026-08-22 | P0 SERP rakip analizi tamamlandı (`Rakip-Analizi-P0-SERP.md`): geçilecek rakipler ve eşikler tanımlandı, GEO penceresinin daraldığı tespitiyle GEO rehberi h.2'ye alındı. ADUARDO konumlandırması §8'e işlendi (AI-native pazarlama işletim sistemi, %10 INDOLES müşteri indirimi, "neden farklıyız" kanıt katmanı). 301 sahipliği Burak'a geçti. |
| v1.2 | 2026-08-22 | GKP hacim verisi işlendi (§2.0 kalibrasyon bölümü eklendi): AI kümesinde birincil terminoloji "yapay zeka danışmanlığı"na çevrildi, GEO-editoryal küme P0 trafik motoruna terfi etti, İş Otomasyonu bağımsız küme olmaktan çıktı, İş Zekası/İşletme Müh. hacmine niyet uyarısı düşüldü, EN önceliği AI + UX London olarak netleşti. Veri: `Keyword-Planner/keyword-hacim-birlesik.csv` |
| v1.1 | 2026-08-20 | Tüm revize içerik + vakalar launch'ta yayında olacağı bilgisiyle: içerik takvimi %100 yeni üretime döndü (yeniden-inşa ve vaka yayın slotları kaldırıldı, BOFU öne çekildi), sprint çıktıları vaka SEO derinleştirmesine çevrildi, 301 haritasına birebir eşleme notu eklendi, açık girdiler güncellendi |
| v1.0 | 2026-08-20 | İlk sürüm |

---

## 1. Stratejik Çerçeve

Tek cümlelik strateji:

> **İki gelir motoru (AI dönüşüm + CRO) dipten yukarı ticari kelimelerle, bir kategori (iş geliştirme) tepeden aşağı otorite içeriğiyle alınır; her içerik aynı anda Google'a ve AI cevap motorlarına yazılır.**

Dört ilke:

1. **Bottom-funnel önce.** 6 ayda müşteri hedefi varsa önce "cro ajansı", "ai danışmanlığı" gibi satın alma niyetli kelimeler alınır; "nedir" içerikleri onları destekler. Ters sıra (önce bilgi içeriği, sonra ticari) 6 ay hedefini kaçırır.
2. **Her içerik çift hedefli (SEO + GEO).** Q&A-formatlı H2/H3, ilk paragrafta net cevap, rakamlı iddia, yazar kimliği. Google sıralaması ve ChatGPT/Gemini atıfı aynı içerik disiplininden çıkar.
3. **Kanıt yayında — şimdi keskinleştirilir.** Tüm vakalar ve revize içerik launch'ta canlı olacak; iş, yayınlamak değil sıralatmak. Vaka sayfalarının SEO derinleştirmesi (FAQ, schema, iç link, title/meta) launch sonrası ilk teknik iştir.
4. **Premium filtre.** "Web tasarım" gibi hacimli-ucuz kelimeler bilinçli dışarıda. Trafik değil, nitelikli görüşme optimize edilir. Bu, meta description ve title'larda da fiyat avcısını eleyecek dil demektir.

### Persona → Kanal → Kelime hizası

| Persona | Organik rolü | Ana kelime kümeleri |
|---|---|---|
| 1B — Dönüşüm yöneticisi (COO/CDO) | **Birincil SEO hedefi.** Patron taşere eder, bu kişi Google'da arar | AI dönüşüm, iş otomasyonu, iş zekası |
| 2 — Ticaret founder/CMO | **Birincil SEO hedefi.** En hızlı karar veren | CRO, performans pazarlama, e-ticaret danışmanlığı |
| 1A — Sanayici patron | SEO'da ikincil; LinkedIn + referans + GBP (isim doğrulama araması) | Marka araması + "hakkımızda" güveni |
| 3 — Scale-up founder | Organik yan etki | UI/UX, özel yazılım/MVP, iş geliştirme |

---

## 2. Keyword Mimarisi

Kümeler niyet-bazlı kuruldu; her kümenin **tek bir hedef sayfası** var — iç rekabet (cannibalization) yasak.

### 2.0 Hacim Kalibrasyonu (v1.2 — GKP verisi, Ağu 2025-Tem 2026, Türkiye + Londra)

Kaynak: `Keyword-Planner/keyword-hacim-birlesik.csv` (245 kelime, hacim bantları: 1B-10B / 100-1B / 10-100 / veri yok). TR listesi toplam ~65.400 arama/ay, EN (Londra) ~4.600/ay potansiyel taşıyor.

**Veriden çıkan 6 kalibrasyon kararı:**

1. **Terminoloji düzeltmesi — "AI" değil "yapay zeka":** "ai danışmanlığı", "ai dönüşümü" GKP'de veri üretmiyor; hacmin tamamı "yapay zeka danışmanlığı / danışmanı / ajansı / otomasyonu / firmaları" (hepsi 100-1B) formunda. Hizmet sayfasının title/H1'i ve makale başlıkları **"yapay zeka" öncelikli** yazılır; "AI dönüşümü" marka-kategori terimi olarak metin içinde inşa edilir. "yapay zeka ajansı" 100-1B + **Düşük rekabet** = kümenin en alınabilir ticari kelimesi.
2. **GEO-editoryal küme P0 trafik motoruna terfi:** "generative engine optimization", "ai seo", "yapay zeka seo", "google ai overviews", "llms.txt" — beşi de 100-1B bandında ve rekabet Düşük/Orta. Küme, CRO kümesiyle aynı hacmi taşıyor ama SERP'i boş. INDOLES'in "AI çağının aklı" vitrini + en hızlı trafik kaynağı.
3. **CRO'nun rolü netleşti — hacim küçük, değer yüksek:** "dönüşüm optimizasyonu" ve "ab testi nedir" 100-1B (ikisi de Düşük rekabet); "cro", "cro ajansı" veri üretmeyecek kadar niş. CRO, trafik hedefi değil **müşteri hedefi**: az arayan ama tam isabetli alıcı. GSC'de poz. 13-15'teki mevcut tohumlarla en hızlı kapanacak kelime seti burası. "ab testi nedir" (100-1B, Düşük) takvimdeki h.5 içeriğinin ana kelimesi olur.
4. **En büyük ticari havuz Performans Pazarlama:** "google reklam ajansı" + "dijital reklam ajansı" 1B-10B, 9 kelime 100-1B (çoğu Orta rekabet). Küme P1'de kalır ama takvimdeki payı korunur — trafik havuzu olarak en büyük, rekabeti de en yüksek ticari alan.
5. **Hacim sürprizleri ve niyet uyarısı:** "iş geliştirme" (1B-10B, Düşük) kategori tezini doğruluyor; "mvp nedir" (1B-10B, Düşük) MVP Build paketi için altın TOFU kelimesi. Ancak "iş zekası" ve "işletme mühendisliği" (ikisi de 1B-10B) büyük oranda öğrenci/kariyer niyeti taşır — bu ikisine eğitici-otorite içerikle girilir (GEO değeri), ticari dönüşüm beklenmez.
6. **Küme budaması:** İş Otomasyonu bağımsız küme olmaktan çıkar (toplam ~100; "yapay zeka otomasyonu" 100-1B kelimesi AI kümesine taşınır, hizmet sayfası kalır). EN'de "cro agency" Londra'da veri üretmedi — **EN-CRO ertelenir**; EN önceliği: "ai consultancy / artificial intelligence consulting / digital transformation consultancy" (100-1B Orta) + ~~**"ux agency london" (100-1B, Düşük)**~~ — **GEÇERSİZ (v1.4):** Londra varlığı teyit edilemedi; lokasyon iddiası olmadan bu kelime hedeflenemez + "custom software development company" (100-1B, Düşük).

**Revize öncelik sıralaması:** P0-müşteri: CRO + Yapay Zeka Danışmanlığı · P0-trafik: GEO-editoryal · P1: Performans Pazarlama, E-Ticaret ("e ticaret danışmanlığı/danışmanı/ajansı" üçlüsü 100-1B), UI/UX ("ui ux tasarım", "ux tasarımı", "kullanıcı deneyimi tasarımı" 100-1B Düşük), İş Geliştirme (kategori) · P2: Özel Yazılım/MVP, Dijital Dönüşüm, İş Zekası + İşletme Müh. (eğitici açı), Marka Stratejisi, Lokal ("yazılım şirketi istanbul" 100-1B Düşük).

Aşağıdaki küme tabloları v1.0 yapısını korur; hacim detayı birleşik CSV'dedir.

### P0 — AI Dönüşüm Kümesi → `/tr/hizmetler/ai-danismanlik` (+ transform pillar)

| Kelime | Niyet | Not |
|---|---|---|
| ai danışmanlığı / yapay zeka danışmanlığı | Ticari | Hizmet sayfası ana hedefi |
| ai dönüşümü / yapay zeka dönüşümü | Ticari-bilgi karışık | GSC'de tohum var (poz. 39) — kategori terimi olarak sahiplenilecek |
| dijital dönüşüm danışmanlığı | Ticari | `/hizmetler/dijital-donusum` — 1B persona'nın kendi arama dili |
| yapay zeka entegrasyonu / kurumsal yapay zeka çözümleri | Ticari | Hizmet sayfası alt bölümleri |
| işletmelerde yapay zeka kullanımı / yapay zeka ile verimlilik | Bilgi | Destek makaleleri → hizmete iç link |
| iş otomasyonu / süreç otomasyonu | Ticari | `/hizmetler/is-otomasyonlari` |
| ai dönüşüm danışmanı seçimi, ai pilot projesi, ai roi hesaplama | Bilgi-BOFU | Makale + AI Pilot paketine link |

### P0 — CRO Kümesi → `/tr/hizmetler/cro`

| Kelime | Niyet | Not |
|---|---|---|
| dönüşüm optimizasyonu / dönüşüm oranı optimizasyonu | Ticari-bilgi | **En güçlü tohum:** 192 gösterim, poz. 15 → ilk sayfa 1 çeyrek mesafede |
| cro ajansı | Ticari-BOFU | 80 gösterim, poz. 13 → en hızlı kazanılabilir müşteri kelimesi |
| e-ticaret dönüşüm oranı artırma / arttırma | Ticari | GSC'de iki yazım varyantı da görünüyor — ikisi de sayfada geçmeli |
| dönüşüm oranı nasıl artırılır | Bilgi | Kapsamlı rehber makale |
| cro nedir / cro açılımı | Bilgi | Rehberin giriş bölümü + FAQ schema |
| a/b testi, landing page optimizasyonu, sepet terk oranı | Bilgi | Destek makaleleri |
| checkout optimizasyonu, mikro dönüşüm | Bilgi | Uzun kuyruk, Faz 2 |

### P1 — İş Geliştirme (Kategori Sahipliği) → `/tr/hizmetler` (tek hedef) + özel makale seti

> **Düzeltme (v1.6, 2026-08-27):** Bu satır önceden hedefi "`/tr/hizmetler` + hakkımızda" diye yazıyordu ve §2'nin kendi cannibalization yasağıyla çelişiyordu; kod da çelişkiyi birebir uygulamış, "iş geliştirme danışmanlığı" üç TR başlığında birden hedeflenmişti (`docs/19` bulgu C-05). Hedef artık **yalnız `/tr/hizmetler`**. Terim marka tanımı olarak (ana sayfa gövdesi, llms.txt, manifest, OG, hakkımızda gövdesi) yerinde kalır — kaldırılan yalnız **arama başlığı hedefi** olmasıdır.

Burada oyun farklı: hacim satın almak değil, **kategoriyi tanımlamak.** "AI ile jargon yayılacak, biz lider olacağız" tezi doğru — 2026'da "iş geliştirme stüdyosu / business building" terminolojisi Türkçede boş. Boş kategoride lider olmanın yolu, terimi tanımlayan kanonik içeriği ilk yazan olmak: AI modelleri bir terimi öğrenirken onu tanımlayan kaynağı atıf noktası yapar.

| Kelime | Niyet | Not |
|---|---|---|
| iş geliştirme danışmanlığı | Ticari | Düşük hacim, tam isabet — servis anlatısı `/hizmetler`'de |
| iş geliştirme stüdyosu / iş inşası | Kategori yaratma | Kanonik tanım makalesi — GEO'nun ana silahı |
| iş modeli geliştirme, işletme verimliliği artırma | Bilgi | Destek makaleleri |
| iş geliştirme nedir | Bilgi | **Dikkat:** kariyer niyeti baskın — makale "işletmeler için" açısıyla yazılır, kariyer trafiği bilinçli dışlanır |

### P1 — UI/UX Premium → `/tr/hizmetler/ui-ux-tasarim`

| Kelime | Niyet | Not |
|---|---|---|
| ui ux tasarım ajansı / ux ajansı | Ticari | Tohum var (poz. 23-32); eski sayfanın 310 gösterimi 301 ile buraya taşınacak |
| ux danışmanlığı / ux denetimi (audit) | Ticari | Premium dil — "tasarım yaptırma" değil "deneyim danışmanlığı" |
| kullanıcı deneyimi tasarımı, saas ux tasarımı | Bilgi-ticari | Alt bölümler |
| ankara/istanbul ui ux ajansı | Lokal | GSC'de Ankara sorguları görünüyor — lokal bölümle yakala |

### P1 — Performans Pazarlama → `/tr/hizmetler/performans-pazarlama`

| Kelime | Niyet | Not |
|---|---|---|
| performans pazarlama ajansı | Ticari | Ana hedef |
| roas nasıl artırılır, cac düşürme, ltv optimizasyonu | Bilgi | Eski LTV yazısı (34 gösterim, poz. 10.8) yeniden inşa edilip taşınacak |
| performans pazarlama nedir | Bilgi | Rehber |

### P2 — Özel Yazılım + Mobil → `/tr/hizmetler/ozel-yazilim-ve-mobil`

| Kelime | Niyet | Not |
|---|---|---|
| özel yazılım geliştirme | Ticari | Çok rekabetçi — yazılım evleriyle savaş; farklılaştırıcı açı: "iş problemi → yazılım" anlatısı |
| mobil uygulama geliştirme | Ticari | En rekabetçi kelime; kısa vadede top-10 beklenmez, MVP açısıyla girilir |
| mvp geliştirme, yazılım danışmanlığı | Ticari | Daha dar, daha alınabilir — MVP Build paketiyle direkt eşleşme |

### P2 — E-Ticaret Danışmanlığı → `/tr/hizmetler/e-ticaret`

| Kelime | Niyet | Not |
|---|---|---|
| e-ticaret danışmanlığı | Ticari | Eski sayfa poz. 22 — 301 + güçlü sayfa ile ilk sayfa hedefi |
| e-ticaret büyüme stratejisi, e-ticaret cirosu artırma | Bilgi | CRO kümesiyle köprü |

### GEO-Editoryal Küme (trafik + uzmanlık kanıtı aynı anda) → `/tr/yazilar/*`

GSC'nin en ilginç bulgusu: site zaten "yapay zeka arama optimizasyonu" (99 gösterim), "yapay zeka optimizasyonu" (136), "google yapay zeka optimizasyonu" (32) sorgularında görünüyor ve bu Türkçe SERP henüz boş. Bu küme hem trafik getirir hem "INDOLES = AI çağının pazarlama aklı" konumunu inşa eder — AI dönüşüm hizmetinin vitrini.

| Kelime | Not |
|---|---|
| yapay zeka arama optimizasyonu / geo optimizasyonu | Eski yazı (359 gösterim, poz. 38) yeni sitede kapsamlı rehber olarak yeniden inşa |
| chatgpt'de markam nasıl çıkar, ai overviews optimizasyonu | Boş SERP — ilk kanonik içerik avantajı |
| llms.txt nedir | Teknik-öncü içerik; EN versiyonu Avrupa için de çalışır |

---

## 3. Launch Haftası (3 Gün) — Pazarlık Edilemez Teknik Liste

| # | İş | Detay |
|---|---|---|
| 1 | **301 haritası deploy** | Ek A'daki tablo — `next.config.js` redirects. Bu yapılmazsa eldeki tüm tohum pozisyonlar yanar |
| 2 | Sitemap + GSC | Yeni sitemap'i GSC'ye submit; eski sitemap'i kaldır. Domain property zaten var — veri sürekliliği korunur |
| 3 | llms.txt canlı | `docs/08` şablonu hazır — production'da doğrula (TR+EN) |
| 4 | JSON-LD doğrulama | Organization + Service + Article şemaları Rich Results Test'ten geçmeli |
| 5 | Title/meta denetimi | Eski sitenin ölümcül zaafı CTR'dı. Her hizmet sayfası title'ı: kelime + değer vaadi + marka (≤60 char). "Poz. 3.9'da sıfır tıklama" bir daha yaşanmayacak |
| 6 | Bing Webmaster + IndexNow | Bing, ChatGPT'nin arama altyapısı — GEO için Google kadar kritik |
| 7 | GBP güncelle | Yeni site linki, hizmet listesi (AI danışmanlığı, CRO...), kategoriler |
| 8 | CWV kontrol | LCP <1.8s hedefi WebGL blob ile production'da test edilmeli — blob LCP'yi yerse hero'da fallback gerekir |

---

## 4. İçerik Motoru — Haftada 2, 12 Haftalık Takvim

> **Güncel sıralama (v1.7):** Aşağıdaki tablo özgün planı korur. Uygulanacak sıra **`Keyword-Onceliklendirme-2026-08-27.md` §3**'tedir — AI slotları (h.1-2, h.2-2) ve GEO slotları (h.7-2, h.10-2) ilk iki haftaya çekildi, yayında olan iki slot (h.7-1, h.8-1) silinip kapasitesi iki yeni slota aktarıldı.

Kadans: **her hafta 1 ticari-destek içerik + 1 otorite/GEO içeriği.** Tüm slotlar yeni üretim — revize eski yazılar ve vakalar launch'ta zaten yayında. Her makale: Q&A-formatlı H2'ler, ilk 2 cümlede net cevap, en az 1 orijinal rakam/çerçeve, danışman kadrosundan gerçek yazar (author schema), 3-5 iç link (en az 1'i ilgili vakaya), FAQ bloğu.

| Hafta | İçerik 1 (SEO-ticari) | İçerik 2 (otorite/GEO) |
|---|---|---|
| 1 | Dönüşüm oranı optimizasyonu (CRO) nedir? Kapsamlı rehber | AI dönüşümü nedir? İşletmeler için uçtan uca rehber |
| 2 | CRO ajansı nasıl seçilir: 10 kriter (BOFU) | AI danışmanı seçerken sorulacak 12 soru (BOFU) |
| 3 | Dönüşüm oranı nasıl artırılır: kanıtlanmış 21 taktik | AI dönüşümüne nereden başlanır: 90 günlük pilot çerçevesi |
| 4 | E-ticaret dönüşüm oranı benchmark'ları (orijinal veri = link mıknatısı) | İş inşası: bir işletme 3-6 ayda nasıl yeniden kurulur (kategori manifestosu) |
| 5 | A/B testi nasıl kurulur: istatistiksel anlamlılık rehberi | AI dönüşümünde ROI nasıl hesaplanır (1B'nin business case ihtiyacı) |
| 6 | ROAS düşerken büyüme: performans pazarlamada yapısal yaklaşım | İş geliştirme danışmanlığı nedir? Ajanstan ve yönetim danışmanlığından farkı |
| 7 | Landing page optimizasyonu: dönüşüm odaklı sayfa anatomisi | Google AI Overviews'da yer almak: 2026 kılavuzu |
| 8 | CAC-LTV dengesi: reklam bütçesi nasıl ölçeklenir | Türk sanayisinde AI: ERP gecikmesinin dersi (manifesto → makale) |
| 9 | UX denetimi nasıl yapılır: SaaS ve e-ticaret için çerçeve | ChatGPT ve Gemini'de markanız nasıl önerilir: GEO taktik rehberi |
| 10 | UI/UX ajansı seçim rehberi: portföyde neye bakılır (BOFU) | llms.txt nedir, nasıl hazırlanır (TR'de ilk kanonik içerik) |
| 11 | Özel yazılım mı hazır çözüm mü: karar çerçevesi | İş otomasyonu nereden başlar: önce hangi süreçler |
| 12 | MVP nasıl kapsamlanır: 6 haftada üretime çıkma | Sepet terk oranı düşürme: uçtan uca rehber |

Notlar:
- BOFU içerikleri (h.2) öne çekildi — 6 ay müşteri hedefinde en kısa yol satın alma niyetli sorgular.
- Her makale ilgili vakaya iç link verir; vakalar makale trafiğinin kanıt katmanıdır.
- Her yayın LinkedIn'de Burak + ilgili danışman hesabından dağıtılır — dijital PR bütçesi olmadan mention üretmenin tek bedava yolu.
- 13. haftadan itibaren video katmanı eklenir (makale → YouTube → embed = aynı içerikten 3 sinyal).

---

## 5. GEO Planı (Bütçesiz Dönem)

On-site temel `docs/08` ile zaten kurulu (llms.txt, JSON-LD, Q&A-formatı, AI crawler'a açık robots). Bütçesiz dönemde off-site için:

| Kaldıraç | Aksiyon | Neden |
|---|---|---|
| **Varlık tutarlılığı** | LinkedIn şirket sayfası, GBP, tüm ücretsiz dizinlerde (ör. sektör rehberleri, harita servisleri) aynı isim + tanım + hizmet listesi | AI modelleri entity'yi çapraz kaynak tutarlılığından öğrenir |
| **Kanonik tanımlar** | "İş geliştirme stüdyosu", "AI dönüşümü", "GEO" terimlerinin Türkçe tanım sayfaları | Terimi tanımlayan, atıfı alır |
| **Kadro = 10 entity** | Her danışman profili → kişisel LinkedIn ↔ site profili karşılıklı link, Person schema | Tüzel anonimlik yerine 10 isimli uzman ağı — E-E-A-T çarpanı |
| **Bing/IndexNow** | Launch'ta kurulum | ChatGPT arama katmanı Bing'den beslenir |
| **ADUARDO çapraz sinyali** | ADUARDO sitesinde partner sayfası ↔ INDOLES'te ortak teklif sayfası | İki entity birbirini doğrular; bedava, kontrolümüzde |
| **Ölçüm** | Ayda 1 kez aynı 10 soruluk prompt seti ChatGPT/Gemini/Perplexity'de manuel test ("Türkiye'de CRO ajansı öner", "AI dönüşüm danışmanlığı kim yapar" vb.) — sonuç tablosu tutulur | GEO'nun GSC'si yok; disiplinli manuel takip tek yöntem |

Bütçe geldiğinde: dijital PR (sektör medyası, podcast, veri raporu PR'ı) bu temelin üstüne oturur — plan hazır olur, sıfırdan başlanmaz.

## 6. Lokal SEO

GBP mevcut → geliştirme: kategori seti (danışmanlık + yazılım + pazarlama ajansı), hizmet listesi hedef kelimelerle, aylık 2 GBP post (yeni içeriklerin özeti), müşteri yorumu akışı (her kapanan projeden 1 yorum ritüeli), foto/ekip görselleri. Site tarafında: Organization schema'ya adres + `areaServed`, iletişim sayfasına NAP. Ayrı "istanbul-cro-ajansi" landing page'leri **açılmaz** — premium konumla çelişir; lokal niyet GBP + hizmet sayfası içi bölümlerle yakalanır.

## 7. EN / Londra-Avrupa Fazlaması

Gerçekçi sıralama: Londra SERP'inde "CRO agency" kelimesi Türkiye'den domain otoritesi sıfır bir siteyle alınamaz — **EN'de oyun GEO'dan açılır.**

| Faz | Zaman | Aksiyon |
|---|---|---|
| F1 | Launch | EN sayfa paritesi + hreflang bütünlüğü (docs/08 kuralı zaten böyle) — ABD gösterim çöpü EN sayfaların netleşmesiyle anlamlıya döner |
| F2 | Ay 2-4 | En güçlü 4-5 makale + 3 vakanın EN versiyonu; "AI transformation consulting", "business building studio" gibi kategori terimlerinde EN kanonik içerik |
| F3 | Ay 4-6 | GEO-first: llms.txt EN, Perplexity/ChatGPT'de "AI transformation partner Europe" tarzı sorgularda görünürlük testleri; Londra niyeti için "working with EU/UK clients from Istanbul" güven içeriği (saat dilimi, referans, İngilizce çalışma düzeni) |
| F4 | Bütçeyle | EN dijital PR + link |

## 8. Dönüşüm Mimarisi

Birincil dönüşüm: **Cal.com görüşmesi.** Organik ziyaretçinin %97'si görüşmeye hazır değil — orta katman şart:

| Katman | Varlık | Yerleşim |
|---|---|---|
| BOFU | Cal.com CTA ("Uzmanımızla 1 saatlik görüşme") | Hizmet + paket + vaka sayfaları |
| MOFU | Lead magnet'ler: ① CRO Denetim Kontrol Listesi (PDF) ② AI Dönüşüm Hazırlık Değerlendirmesi ③ E-ticaret Büyüme Denetimi | İlgili makale ve hizmet sayfalarında içerik-eşleşmeli |
| MOFU | **ADUARDO teklifi** — ortak landing page | ADUARDO, INDOLES'in kendi AI-native pazarlama işletim sistemi. İki rol: (1) **Kanıt:** "Kendi AI ürününü inşa etmiş ekip" — rakip analizindeki en net farklılaştırıcı; "neden INDOLES" anlatısı ADUARDO'dan güç alır, hizmet sayfalarında ve hakkımızda'da işlenir. (2) **Teklif:** INDOLES üzerinden gelen müşteriye ADUARDO'da %10 indirim — AI dönüşüm ve büyüme funnel'larında kapanış hızlandırıcı. |
| TOFU→MOFU | Bülten (footer'da var, pasifleştirilmemeli) + e-posta serisi: magnet indirene 4-5 mailde vaka + çerçeve + görüşme daveti | Resend altyapısı mevcut |
| Faz 2 | İnteraktif araçlar (`/araclar` — ADR ile yeniden açılır): ROI hesaplayıcı, dönüşüm benchmark aracı | Araçlar hem lead hem backlink üretir — bütçesiz dönemin en güçlü link varlığı |

PostHog funnel: organik giriş → magnet → e-posta → Cal.com → görüşme tamamlandı (Cal webhook zaten var: `/api/webhooks/cal`).

## 9. Ölçüm Çerçevesi ve 6 Ay Hedefinin Matematiği

| Dönem | KPI | Eşik |
|---|---|---|
| Ay 1 | Teknik: indeksleme oranı, 301 bütünlüğü, CWV yeşil | Tüm hizmet sayfaları indeksli |
| Ay 2-3 | Gösterim: 2K/ay → 15-25K/ay · CRO kümesinde ilk sayfa · CTR >%2 | "dönüşüm optimizasyonu" top-10 |
| Ay 4-6 | 10+ kelime ilk sayfa · 800-1.500 organik oturum/ay · 30-60 magnet lead · 10-20 Cal.com görüşmesi (kümülatif) | **≥1 yeni müşteri** |

Dürüst not: 6 ayda organikten müşteri **mümkün ama dar marj** — matematik şöyle çalışır: en hızlı kapanış BOFU kelimeler (cro ajansı, ai danışmanlığı) + GBP + vaka sayfaları üçgeninden gelir; hacim kelimeleri 6. aydan sonra ivmelenir. LinkedIn dağıtımı bu süreyi kısaltan tek bedava çarpan — içerik motoruyla aynı disiplinde yürütülmeli. 3. ay sonunda gösterim eğrisi yataysa strateji revize edilir (eşik: aylık gösterim <8K ise alarm).

---

## 10. 90 Günlük Sprint Planı

| Sprint | Odak | Çıktılar |
|---|---|---|
| **S0 (bu hafta)** | Launch güvenliği | 301 haritası deploy · GSC/Bing submit · llms.txt + JSON-LD doğrulama · title/meta denetimi · GBP güncelleme |
| **S1 (hafta 1-4)** | CRO + AI temeli | 8 içerik (takvim h.1-4) · **tüm vaka sayfalarının SEO derinleştirmesi** (FAQ bloğu, Article+about schema, hizmet sayfalarına çift yönlü iç link, title/meta) · CRO + AI hizmet sayfalarının derinleştirilmesi · ilk lead magnet (CRO checklist) + e-posta serisi |
| **S2 (hafta 5-8)** | Kategori + otorite | 8 içerik (h.5-8) · iş inşası manifestosu + iş geliştirme tanım içeriği · revize eski yazıların performans kontrolü (301 sonrası pozisyon takibi) · 2. magnet (AI hazırlık değerlendirmesi) · ADUARDO ortak sayfası · ilk GEO ölçüm turu |
| **S3 (hafta 9-12)** | Genişleme + EN | 8 içerik (h.9-12) · EN çeviri dalgası (en güçlü 5 içerik + 3 vaka) · GBP yorum ritüeli · 90 gün raporu → strateji revizyonu + rakip analizi entegrasyonu |

---

## 11. Ek A — 301 Redirect Haritası (Launch Öncesi)

Gösterim taşıyan tüm eski URL'ler. `next.config.js` `redirects()` içine, `permanent: true`:

| Eski URL | Yeni Hedef |
|---|---|
| `/web-tasarim-ui-ux-tasarimi/` | `/tr/hizmetler/ui-ux-tasarim` |
| `/cro-donusum-orani-optimizasyonu/` | `/tr/hizmetler/cro` |
| `/e-ticaret-danismanligi/` | `/tr/hizmetler/e-ticaret` |
| `/dijital-pazarlama-hizmetleri/` | `/tr/hizmetler/performans-pazarlama` |
| `/sosyal-medya-pazarlama/` | `/tr/hizmetler/marka-stratejisi` |
| `/kreatif-hizmetler/` | `/tr/hizmetler/growth` |
| `/mobil-uygulama-ve-yazilim-cozumleri/` | `/tr/hizmetler/ozel-yazilim-ve-mobil` |
| `/our-services/`, `/servisler/` | `/tr/hizmetler` |
| `/takimimiz/` | `/tr/hakkimizda` |
| `/referanslarimiz/`, `/musterilerimiz/` | `/tr/vakalar` |
| `/bilgi-kutuphanemiz/` | `/tr/yazilar` |
| `/iletisim/` | `/tr/iletisim` |
| `/yapay-zeka-aramalarinda-nasil-one-cikarsiniz/` | Revize yazının yeni slug'ı → `/tr/yazilar/[slug]` |
| `/2026-web-tasarim-trendleri/` | Revize yazının yeni slug'ı → `/tr/yazilar/[slug]` |
| `/dijital-cagda-gerilla-pazarlama-evrimi/` | Revize yazının yeni slug'ı → `/tr/yazilar/[slug]` |
| `/satis-ekibinizin-vaktini-harcamayin-...-lead-toplama-rehberi/` | Revize yazının yeni slug'ı → `/tr/yazilar/[slug]` |
| `/reklam-maliyetleri-artarken-...-ltv-optimizasyonu/` | Revize yazının yeni slug'ı → `/tr/yazilar/[slug]` |
| `/portfolyo/[eski-slug]/` (her biri) | Karşılık gelen vakanın yeni slug'ı → `/tr/vakalar/[slug]` |
| `/category/*` (wildcard) | `/tr/yazilar` |
| `/portfolyo-kategori/*` (wildcard) | `/tr/vakalar` |
| Karşılığı olmayan eski blog yazıları (catch-all) | `/tr/yazilar` |

**Birebir eşleme kuralı (v1.1):** Tüm revize yazılar ve vakalar launch'ta yayında olacağından, gösterim taşıyan her eski URL kendi yeni karşılığına 301'lenir — jenerik liste sayfasına değil. Bunun için launch içeriğinin **final slug listesi** gerekli (repo'da şu an 3 yazı + 4 vaka var; kalan dalga girince eşleme tamamlanır). Eski slug'lar korunursa eşleme mekanikleşir: `/:slug` → `/tr/yazilar/:slug`.

## 12. Ek B — Keyword Planner Şablonu

Keyword Planner'dan çekilecek kolonlar: kelime · aylık ort. hacim · rekabet · TBM aralığı. §2'deki her tabloya eklenecek. Export'u paylaştığında önceliklendirmeyi hacim gerçekleriyle kalibre ederim (sıra değişebilir; strateji değişmez).

## 13. Açık Girdiler

| Girdi | Sahibi | Ne için |
|---|---|---|
| ~~Rakip listesi~~ ✓ Kapandı (v1.3) | — | `Rakip-Analizi-P0-SERP.md` |
| ~~Keyword Planner export~~ ✓ Alındı (v1.2, 2026-08-22) | — | §2.0'da işlendi |
| ~~301 haritası~~ → Burak uyguluyor | Burak | Ek A referans |
| ~~ADUARDO teklif kapsamı~~ ✓ Kapandı (v1.3) | — | §8'de: %10 indirim + kanıt anlatısı |
| GBP erişimi/mevcut durum | Burak | Lokal sprint |

---

**Sürüm:** v1.11 · Değişiklikler bu dosyada changelog ile ilerler; büyük revizyon = v2 dosyası, üzerine yazılmaz.
