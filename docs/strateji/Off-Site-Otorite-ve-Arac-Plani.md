# Off-Site Otorite ve Araç Planı

> **Statü:** Onaylı (Burak, 2026-08-30) · **Sürüm:** v1.3
> **v1.3 (2026-09-03):** Faz 2 Görev 1-2 doküman senkronu. §4 açık-iş **8** — araç ↔ hizmet ↔ makale üçgeninin çift yönlü iç link şartı (§2 şart listesi) — **kapandı** işaretlendi: hizmet→araç ve araç→makale ayakları kod tarafında kuruldu, yayın kapısına bağlı (Diagnoo `published: false` sürdükçe görünmez, launch'ta görünür olur).
> **v1.2 (2026-09-01):** Görev 14 doküman senkronu (ADR-030). §4 açık-iş **1** (ADR + `docs/02` güncellemesi) ve **3** (Dalga A araçlarının spec'i — kapsam: araç ④) **kapandı** işaretlendi. Bayat altyapı referansları düzeltildi: **PostHog → GA4** (ADR-021, PostHog kaldırıldı) ve **Cal.com → kendi rezervasyon sistemi** (ADR-025, Cal.com kaldırıldı) — bu dosyanın kalan tüm PostHog/Cal.com anılışları bu düzeltmeyle güncel kabul edilir; §2 ve §3'teki satır içi düzeltmeler aşağıda işaretli.
> **v1.1 (2026-08-30):** Mevcut iki iç ürün plana entegre edildi — **Diagnoo** (çok modüllü site denetimi: teknik SEO + CWV + UX + skorlama) araç portföyünün motoru oldu, denetim araçları Dalga A'ya çekildi; **LeadLoad** (outbound lead çıkarma) için karar: **kamuya yayınlanmaz** — KVKK ve premium konum riski; iç kullanım + vaka anlatısı (bkz. §2.1).
> **Otoriteler:** `INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.11, §5 ve §8) · `Keyword-Onceliklendirme-2026-08-27.md` · `GEO-Olcum/` baz çizgisi (Ay 0: 0/30)
> **Teşhis:** On-site kapsama %30'a çıktı, teknik altyapı kuruldu; 0/30'un ana nedeni **web genelinde INDOLES'ten bahseden üçüncü taraf yokluğu**. Bu doküman o boşluğu iki kaldıraçla kapatır: kazanılan atıf (dizin/varlık/PR-lite) + link üreten interaktif araçlar (development gücü).

**İlke:** Link satın alma, PBN, alakasız dizin ve misafir yazı ağları **reddedilmiştir** — spam politikası riski + premium konum çelişkisi. Her link/mention ya kontrolümüzdeki meşru bir varlıktan ya da hak edilmiş bir atıftan gelir.

---

## 1. Dizin ve Varlık Katmanı

**Ortak kural:** Her profilde işletme adı, tanım (GBP açıklamasının aynısı — positioning statement'la açılır), hizmet listesi ve NAP birebir tutarlı. AI modelleri entity'yi çapraz kaynak tutarlılığından öğrenir; üç farklı tanım üç zayıf sinyal, tek tanım bir güçlü sinyal üretir.

### Katman 1 — Entity çekirdeği (1. hafta)

| Varlık | Not |
|---|---|
| LinkedIn şirket sayfası | Tanım + hizmet + kadro bağlantıları teyit; danışman profilleri ↔ site karşılıklı link (strateji §5 "kadro = 10 entity") |
| Crunchbase | İndoles Yazılım A.Ş. profili — AI modellerinin şirket verisi çektiği ana kaynaklardan; ADUARDO da ürün olarak eklenir |
| GitHub organizasyonu | Development gücünün kamuya açık kanıtı; AI crawler'lar tarafından yoğun taranır. **Diagnoo'nun açık kaynak çekirdeği buraya yayınlanır** (v1.1) — org boş vitrin değil gerçek ürünlü olur; README TR+EN, site ↔ repo çift yönlü link, topics/lisans/release disipliniyle |
| Bing Places | ChatGPT'nin yerel verisi Bing'den beslenir — GBP'nin Bing karşılığı, aynı metinlerle |
| Apple Business Connect | Ücretsiz; Siri/Apple ekosistem görünürlüğü |
| Yandex Business | TR kullanımı hâlâ anlamlı; aynı NAP |

### Katman 2 — Ajans/B2B dizinleri (1-3. hafta)

Baz çizgisinin dersi: Perplexity ve ChatGPT'nin döndürdüğü "firmalar" listeleri büyük oranda bu dizinlerden ve onlardan türeyen listicle'lardan besleniyor. Bu katman klasik SEO'dan çok **GEO altyapısıdır**.

| Dizin | Not |
|---|---|
| Clutch | En güçlü B2B dizin; vaka + müşteri yorumu ister — yayındaki vakalarla profil doldurulur, yorum ritüeli (GBP ile aynı) buraya da bağlanır |
| GoodFirms | Ücretsiz listeleme + kategori genişliği (AI danışmanlığı, yazılım, pazarlama ayrı kategoriler) |
| Sortlist | Avrupa ağırlıklı — EN/Avrupa hedefiyle hizalı |
| DesignRush | UI/UX + ajans kategorileri; "best agencies" listicle'ları AI cevaplarına sızıyor |
| TechBehemoths | Ücretsiz, TR sayfaları güçlü indeksleniyor |
| Semrush Agency Partners | Ücretsiz katman varsa açılır |

### Katman 3 — TR ekosistemi (2-4. hafta)

Startups.watch (ADUARDO üzerinden şirket kaydı), Webrazzi şirket profili, ticaret/sanayi odası dijital kayıtları, ilgili sektör dernekleri. ADUARDO ayrıca G2/Capterra'ya SaaS olarak eklenir — INDOLES entity'sini dolaylı güçlendirir ("maker" bağlantısı).

### PR-lite (bütçesiz, içerik çıktısına bağlı)

İki veri hikâyesi hazır olduğunda TR sektör medyasına (Webrazzi, Marketing Türkiye, Pazarlamasyon) pitch edilir: **(1)** e-ticaret dönüşüm benchmark verisi (h.5 + §2'deki benchmark aracı), **(2)** GEO görünürlük serisi ("AI aramalarında 6 ayda 0'dan X'e — gerçek ölçüm verisi", aylık turların kamu versiyonu). Link istenmez, haber değeri verilir — link kendiliğinden gelir.

---

## 2. Araç Portföyü (Development Gücü → SEO/GEO Varlığı)

**Neden araç:** Araç, makalenin yapamadığı üç şeyi yapar — kendiliğinden link alır (kaynak gösterilir), tekrar ziyaret üretir ve kullanım verisi biriktirir (özgün veri → PR → yine link). TR pazarında bu kelime kümelerinde çalışan yerli araç neredeyse yok.

**Her araç için şart listesi (SEO/GEO mekaniği):**
- Kendi indexlenebilir sayfası: `/araclar/[slug]` (TR) + `/en/tools/[slug]` — hedef kelime title/H1'de
- Kayıtsız, ücretsiz kullanım; **derin rapor e-posta ile** (MOFU yakalama — strateji §8 funnel'ına bağlanır)
- Paylaşılabilir sonuç URL'i (paylaşım = kazanılan link)
- `SoftwareApplication` + `FAQPage` JSON-LD; llms.txt'ye araç bölümü eklenir
- Araç ↔ ilgili hizmet sayfası ↔ ilgili makale üçgeni çift yönlü iç link
- **GA4 olayları:** `tool_used`, `tool_scan_completed`, `tool_report_requested` (`docs/12` taksonomisine eklendi — v1.2 düzeltmesi: bu satır orijinalde "PostHog olayları" diyordu, PostHog ADR-021 ile kaldırıldı)

### 2.1 Mevcut Ürünler — Diagnoo ve LeadLoad (v1.1)

**Diagnoo** çok modüllü site denetim sistemi (teknik SEO + Core Web Vitals + UX + genel skorlama) olarak portföyün **motoru** ilan edildi. Sonuçları:

- Sıfırdan araç yazılmaz; `/araclar` denetim ailesi Diagnoo'nun hosted versiyonudur. Modüller ayrı araç sayfaları olarak açılır (her biri kendi kelime kümesini taşır): "Web Sitesi SEO Denetimi", "Site Hızı / CWV Testi", "UX Denetimi".
- **GEO modülü Diagnoo'ya eklenir** (llms.txt, AI-crawler izinleri, JSON-LD, hreflang, soru-H2 skoru) → amiral gemisi "GEO Görünürlük Denetleyicisi" ayrı yapım değil, modül olur — Dalga B'den **Dalga A-B sınırına** çekildi.
- Çekirdek GitHub'da açık kaynak ("Diagnoo by INDOLES"), tam sürüm sitede hosted — open-core modeli: repo entity/link üretir, hosted sürüm lead üretir. Ayrı domain açılmaz; otorite `indoles.com.tr`'de birikir.

> **v1.2 güncellemesi (2026-09-01, ADR-030):** GEO Görünürlük Denetleyicisi
> Diagnoo'yu **beklemeden** canlıya alındı — Diagnoo hiç deploy edilmedi
> (yalnız iki tasarım dokümanı var). Motor Worker-native kuruldu
> (`src/lib/tools/geo/`), taşınabilir `GeoScanInput`/`GeoScanResult`
> sözleşmesiyle: Diagnoo ileride canlıya çıkarsa modül oraya taşınabilir,
> ama launch ona bağlı değildi. Detay: `docs/decisions/ADR-030-araclar-worker-native.md`.
> Diagnoo'nun geri kalan modülleri (SEO denetimi, CWV/UX skoru — Dalga A ①)
> bu güncellemenin kapsamı DIŞINDA, hâlâ tasarım aşamasında.

**LeadLoad** (outbound web veri çıkarma) için karar farklı: **INDOLES markasıyla kamuya yayınlanmaz.**

- **Gerekçe 1 — KVKK:** Otomatik kişi/iletişim verisi toplama aracının kamuya açık dağıtımı, aracı yayınlayana hukuki ve itibari sorumluluk bindirir; KVKK tarafında rıza temeli kurulamaz.
- **Gerekçe 2 — Premium konum:** "Scraping aracı dağıtan ajans" algısı, kurumsal sanayi persona'sının (1A/1B) güven eşiğiyle doğrudan çelişir; Big4 ile aynı masada oynayan bir marka bu riski taşımaz.
- **Kullanımı:** İçeride kalır — kendi müşteri edinme sistemimizin parçası olarak çalışır ve **anlatıya kanıt olarak girer**: "kendi büyüme sistemimizi kendi otomasyonlarımızla kurduk" (vaka/hakkımızda düzeyinde, araç adı ve yöntemi teşhir edilmeden). Firma-düzeyi (kişisel olmayan) veriyle sınırlı kullanım ve iletişimde ilk temas kurallarına uyum şarttır. İleride ayrı, INDOLES'ten bağımsız bir marka olarak ürünleştirilmek istenirse ayrı değerlendirme (ADR) yapılır.

### Yapım sırası (v1.1 — Diagnoo entegrasyonuyla revize)

| Dalga | Araç | Hedef kelimeler (hacim/rekabet) | Bağlandığı yüzey | Gerekçe |
|---|---|---|---|---|
| **A (0-30 gün)** | ① **Diagnoo hosted: Web Sitesi Denetim ailesi** (SEO sağlığı + CWV + UX skoru, modüler sayfalar) | `seo denetimi/analizi`, site hızı ailesi, `ux audit/denetimi` | seo/cro/ui-ux hizmet sayfaları + ilgili makaleler | Ürün hazır — efor entegrasyon + araç sayfası. Portföyün en hızlı canlıya çıkacak parçası. **v1.2: hâlâ açık** — bu güncellemenin kapsamı dışında |
| **A (0-30 gün)** | ② A/B Testi Anlamlılık Hesaplayıcısı | `a/b testi`, `ab testi nedir` (100-1B/Düşük) | cro + h.8 makalesi | Düşük efor; TR'de yerli anlamlılık hesaplayıcısı yok |
| **A (0-30 gün)** | ③ ROAS & CAC-LTV Hesaplayıcısı | `roas/cac/ltv` ailesi (100-1B/Düşük) | performans-pazarlama + h.9 | "ltv hesaplama" birebir araç niyeti |
| **A-B (30-45 gün)** | ④ **GEO Görünürlük Denetleyicisi** — Worker-native motor (ADR-030) | `geo optimizasyonu`, `yapay zeka arama optimizasyonu` kümesi | GEO kanonik rehber + ai-danismanlik | **Amiral gemisi. Canlıda (2026-09-01).** TR'de ilk; "Türkiye'nin ilk GEO denetim aracı" PR hikâyesi; Diagnoo'yu beklemeden Worker-native kuruldu — bkz. §2.1 v1.2 notu |
| **B (30-60 gün)** | ⑤ AI Dönüşüm Hazırlık Değerlendirmesi | `yapay zeka danışmanlığı` destek yüzeyi | ai-danismanlik + AI Pilot paketi | Lead magnet'in araçlaşması; 1B'nin business case aracı |
| **C (60-90 gün)** | ⑥ E-Ticaret Dönüşüm Benchmark Aracı | `e ticaret dönüşüm oranı` ailesi | e-ticaret + cro + h.5 | Anonim veri havuzu → özgün TR verisi → PR döngüsü — savunulabilir varlık |
| **C (60-90 gün)** | ⑦ MVP Kapsam ve Bütçe Tahmincisi | `mvp nedir` (**1B-10B/Düşük**) | h.12 + MVP Build paketi | Dev hacmi paket funnel'ına bağlar (K-5 uyumlu) |

**Kapsam disiplini:** Bir araç bir kelime kümesine hizmet eder; "her şeyi yapan süper araç" yapılmaz. Araç sayfaları premium filtreyi korur — ücretsiz araç, ücretsiz iş vaadi değildir; rapor sonu CTA'sı her zaman **kendi rezervasyon akışımızdır** (v1.2 düzeltmesi: bu satır orijinalde "Cal.com görüşmesi" diyordu — Cal.com ADR-025 ile kaldırıldı, kendi takvim sistemine geçildi).

---

## 3. Ölçüm

| Metrik | Hedef | Kaynak |
|---|---|---|
| Referring domain | 90 günde **+15-20 kaliteli RD** (dizinler + kazanılan) | GSC "Bağlantılar" raporu — aylık GEO turuyla aynı gün kesit alınır |
| Araç kullanımı | Dalga A araçları: yayın +30 günde ≥100 kullanım | **GA4** `tool_used` (v1.2 düzeltmesi: PostHog → GA4, ADR-021) |
| Araç → lead | `tool_report_requested` → e-posta serisi → görüşme | **GA4** funnel + **Veridyen SMTP** (v1.2 düzeltmesi: PostHog/Resend → GA4/Veridyen SMTP, ADR-021 + ADR-026) |
| GEO atıf | Aylık turda "Atıf verilen URL" kolonunda araç sayfalarının görünmesi | `GEO-Olcum/kayitlar.csv` |
| Dizin görünürlüğü | Clutch/GoodFirms profillerinin marka aramasında ilk sayfada çıkması | GSC + manuel |

## 4. Açık İşler ve Bağımlılıklar

| # | İş | Sahibi | Not |
|---|---|---|---|
| 1 | ~~`/araclar` route'u için **ADR** + `docs/02-information-architecture.md` güncellemesi~~ | Dev oturumu (Claude Code) | ✅ **Kapandı (2026-09-01)** — `docs/decisions/ADR-030-araclar-worker-native.md` + `docs/02` §2/§3a güncellendi |
| 2 | Katman 1-2 dizin başvuruları | Burak (hesap açılışları) + Claude (profil metinleri hazır: GBP açıklaması esas alınır) | Clutch yorum ritüeli müşteri onayı ister |
| 3 | ~~Dalga A araçlarının spec'i~~ | Claude Code | ✅ **Kısmen kapandı (2026-09-01)** — araç ④ (GEO Görünürlük Denetleyicisi, amiral gemisi) `docs/superpowers/specs/2026-09-01-geo-gorunurluk-denetleyicisi-design.md` ile spec'lendi ve canlıya alındı. Araç ①-③ (Diagnoo hosted denetim ailesi, A/B testi hesaplayıcısı, ROAS/CAC-LTV hesaplayıcısı) **hâlâ açık** — bu güncelleme yalnız ④'ü kapsıyor |
| 4 | PostHog olay taksonomisi güncellemesi | Dev | ✅ **Kapandı (2026-09-01) — sağlayıcı düzeltmesiyle:** `docs/12`'ye `tool_*` olayları eklendi ama sağlayıcı **GA4**'tür (PostHog ADR-021 ile kaldırıldı; bu satırın adı tarihsel referans olarak korunuyor) |
| 5 | ~~GitHub org kararı~~ → **Diagnoo open-core yayını:** org kurulumu, README (TR+EN, site linkli), lisans seçimi, hangi modüller açık/hangi modüller hosted-only | Burak + dev | v1.1 ile netleşti — org gerçek ürünle açılıyor. **Hâlâ açık** |
| 6 | Diagnoo GEO modülü spec'i (llms.txt, AI-crawler, JSON-LD, hreflang, soru-H2 skorlama kriterleri) | Claude | **Yön değişti (v1.2):** GEO modülü Diagnoo'yu beklemeden ayrı Worker-native araç olarak spec'lendi ve kuruldu (ADR-030) — bu madde artık yalnız Diagnoo canlıya çıktığında motorun oraya taşınması anlamına gelir, ilk kuruluş için Diagnoo'ya bağımlı DEĞİL |
| 7 | LeadLoad iç kullanım sınırları: firma-düzeyi veri, kişisel veri dışarıda, ilk temas kuralları | Burak | Kamuya yayın YOK (§2.1); ihlal premium konumu ve KVKK'yı aynı anda yakar |
| 8 | ~~Araç ↔ hizmet ↔ makale üçgeni çift yönlü iç link (§2 şart listesi)~~ | Dev oturumu (Claude Code) | ✅ **Kapandı (2026-09-03)** — Faz 2 Görev 1-2: hizmet→araç ayağı (`toolsForService`, `ToolServiceCallout`) ve araç→makale köprüleri (`bridgesForArticle`, `ArticleToolBridges`) kod tarafında kuruldu. Yayın kapısına bağlı — `published: false` sürdükçe (bugün Diagnoo) hiçbir yüzeyde görünmez, launch'ta görünür olur |
