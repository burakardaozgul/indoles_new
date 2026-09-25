# ADR-040 — GEO danışmanlığı 13. hizmet olarak açıldı

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-25
- **Karar veren:** Burak Arda Özgül (yol haritası onayı, 2026-09-25)
- **Bağlam:** `Marketing/Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` — SEO/GEO'nun amacı satın alma niyetli alıcının önüne çıkmak
- **İlgili:** ADR-018 (hizmet detay sayfaları) · ADR-021 (yazı konuları ve konu → hizmet eşlemesi) · ADR-030 (GEO Görünürlük Denetleyicisi)
- **Etkilenen:** `src/lib/content/services/geo-danismanligi.ts` (yeni), `services/index.ts`, `types.ts`, `topics.ts`, `tools.ts`, `cases.ts`, `pillars.ts`, `articles.ts` (beş GEO yazısında satır içi bağlantı), `service-detail.tsx`, `service-illustration.tsx`, `ServicesScroll.tsx`, `hizmetler/page.tsx`, `araclar/geo-gorunurluk-denetleyicisi/page.tsx`, `not-found.tsx`, `messages/{tr,en}.json`, `CLAUDE.md` §5, `docs/02-information-architecture.md`

## Bağlam

GEO-editoryal küme sitenin en büyük gösterim kaynağı: kanonik rehber
(`yapay-zeka-aramalarinda-nasil-one-cikarsiniz`), AI Overviews, llms.txt,
ChatGPT reklamları ve GEO denetim aracı duyurusu. Ama kümenin ticari
karşılığı yoktu — `topics.ts`te `geo.serviceSlug: null`. GEO yazısını okuyan
alıcının gidebileceği bir hizmet sayfası yoktu; GEO aracının "devamı" kartı
bile AI danışmanlığına çıkıyordu.

GSC'de bu kümede gerçek alıcı sorguları var (22 Ağustos – 19 Eylül 2026):

| Sorgu | Ort. pozisyon | Bugün düştüğü sayfa |
|---|---|---|
| şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin | 6,0–7,1 | AI danışmanı seçimi yazısı |
| yerli geo aracı | 1,2 | GEO aracı duyurusu |
| türkçe geo aracı var mı | 2,5 | GEO aracı duyurusu |
| geo optimizasyonu | 11,6 | kanonik rehber |
| ai arama optimizasyonu | 30,4 | kanonik rehber (çoğu eski URL'de) |

Burak'ın 25 Eylül kararı niyetli sorguyu ölçü yapıyor ve her P0 hizmet için
bir karar kümesi istiyor: hizmet sayfası, "nasıl seçilir", "neye mal olur",
"nasıl işler", kanıt. GEO'da bu kümenin ilk halkası olan hizmet sayfası
eksikti.

Karar verilmezse: en büyük gösterim kümesi bilgi niyetinde kalır, "ajans
önerir misin" diye soran alıcı bir AI danışmanlığı yazısına düşmeye devam
eder ve GEO'yu satın almak isteyenin sitede tıklayacağı bir yer olmaz.

## Değerlendirilen seçenekler

### A) GEO'yu AI danışmanlığı sayfasına bölüm olarak eklemek

- Artı: yeni route yok, sayı değişmez.
- Eksi: AI danışmanlığı Transform'da ve alıcısı süreç/otomasyon arayan
  sanayici; GEO alıcısı pazarlama ve büyüme tarafında. Tek sayfa iki niyeti
  taşıyınca ikisinde de zayıflar.
- Eksi: "GEO danışmanlığı" sorgusunun hedef sayfası yine olmaz.

### B) Growth altında 13. hizmet (seçilen)

- Artı: kümenin ticari hedefi netleşir; `topics.ts` eşlemesi, vaka künyeleri,
  araç ve yazılar tek sayfaya bağlanır.
- Artı: Growth'un vaadiyle (müşteri edinimi, marka görünürlüğü) aynı alıcı.
- Eksi: "12 hizmet" varsayımı sitede ve testlerde birkaç yerde yazılıydı;
  hepsi güncellenmek zorunda.
- Eksi: hizmet sırası `SERVICE_ORDER`a araya girince diyagram ve numara bağı
  kopar (bkz. Implementasyon notları).

### C) Yalnız bir "GEO ajansı nasıl seçilir" yazısı

- Artı: en ucuz adım.
- Eksi: yazı seçim niyetini karşılar, satın alma niyetini karşılamaz; yazının
  bağlanacağı bir para sayfası yine olmaz.

## Karar

**B seçildi.** `geo-danismanligi` (EN `geo-consulting`) Growth'un altıncı
hizmeti olarak açıldı. H1 "Yapay zeka arama optimizasyonu (GEO)", arama
başlığı "GEO danışmanlığı: yapay zekada görünürlük". "GEO ajansı nasıl
seçilir" yazısı aynı karar kümesinin ikinci halkası olarak ayrı commit'te
geldi.

## Gerekçe

1. **Kümenin ticari karşılığı.** En büyük gösterim kümesi artık bir para
   sayfasına akıyor; beş GEO yazısı gövdeden tek satır içi bağlantıyla,
   araç "devamı" kartıyla, üç vaka künyesiyle bağlanıyor.
2. **Kapsam gerçek.** Sayfadaki her kapsam maddesi INDOLES'in bugün yaptığı
   bir iş: beş sinyalli denetim (aracın çerçevesi), kendi sitemizde çalışan
   bot/llms.txt/şema kurgusu, soru-cevap mimarisi, aylık 10 prompt × 3 motor
   ölçüm turu (`docs/strateji/GEO-Olcum-Rutini.md`). Kanıt vakalardan
   (SIM Baskı "GEO görünürlüğü 40.000", İstanbul Ortez Protez) ve kendi
   sitemizin GSC/ölçüm kayıtlarından geliyor.
3. **Fiyat uydurulmadı.** Hizmetin paketi ve liste fiyatı yok. Pillar
   fallback'i Büyüme Sprinti'ni (GEO kapsamı taşımayan, 240.000 TL'lik
   paket) GEO'nun "giriş paketi" gibi gösterecekti; `relatedPackages: null`
   bu yüzden açıldı. Fiyat sorusu SSS'te "kapsama göre, teşhisle başlar"
   diye cevaplanıyor.
4. **Kanibalizasyon sınırı yazılı.** Bilgi niyeti ("yapay zeka arama
   optimizasyonu", "geo optimizasyonu") kanonik rehberde kalır; hizmet
   sayfası ticari niteleyicileri taşır. "ajansı" kelimesi `name` ve
   `seo.title`a girmez (yerleşim kuralı, `keyword-coverage.test.ts`).
5. **A reddedildi** çünkü iki alıcıyı tek sayfaya sıkıştırıyordu; **C**
   tek başına bağlanacak bir hedef bırakmıyordu.

## Sonuçlar

### Pozitif

- `topics.ts`te `geo` artık `geo-danismanligi`ne bağlı: hizmet sayfasının
  "İlgili yazılar" bloğu GEO yazılarını, GEO künyeli vakaların blokları da
  GEO yazılarını gösteriyor.
- GEO aracı ↔ hizmet ↔ yazılar erişim üçgeni GEO'nun kendi sayfasına
  taşındı; araç AI danışmanlığı callout'unda da kalıyor.
- Hub, Growth pillar sayfası, ana sayfa kaydırıcısı, llms.txt/llms-full.txt,
  sitemap ve JSON-LD `ItemList` yeni hizmeti içerikten türetiyor.

### Negatif / trade-off

- **Numara kayması:** GEO `SERVICE_ORDER`da Growth'un sonuna girdi; AI
  danışmanlığından altyapıya yedi hizmetin "Hizmet 06 / 12" göstergesi
  "07 / 13" oldu. Bilinçli: kaydırıcı ve hub pillar'a göre bitişik kalıyor.
- **Ters yön bağlantıları için iki komşu çıktı:** `ai-danismanlik`
  `dijital-donusum`u, `marka-stratejisi` `e-ticaret`i bıraktı (her hizmet
  tam üç komşu taşır). İkisi de dört hizmetten bağ almaya devam ediyor.
- **Meccanotecnica Umbra** künyesine GEO eklendi ama kanıt şeridine
  seçilmedi: ölçülmüş sonucu (teklif talebi, yanıt süresi) AI danışman ve
  portal işinin sonucu.

### Yeniden değerlendirme tetikleyicileri

- GEO için paket veya fiyat bandı belirlenirse: `relatedPackages: null`
  kaldırılır, SSS'teki fiyat cevabı güncellenir.
- 30 Kasım raporunda hizmet sayfası niyetli GEO sorgularında ilk 20'ye
  girmemişse title/H1 ayrımı yeniden değerlendirilir.
- Kanonik rehber ile hizmet sayfası aynı sorguda birbirini itiyorsa (GSC'de
  iki sayfa aynı sorguda gösterim paylaşıyorsa) kanibalizasyon sınırı
  yeniden çizilir.

## Implementasyon notları

- **Sıra ve diyagram ayrıldı.** `SERVICE_ORDER` artık yalnız numara ve kart
  sırası; diyagram `SERVICE_DIAGRAM_ORDER`dan (`serviceDiagramIndex`)
  gelir. İlk 12 kaydı eski sıranın kopyası — yeni hizmet listenin sonuna
  eklenir ve yeni varyantını alır (13. varyant: üç sayfanın tek cevaba
  aktığı, birinin alıntılandığı şema). Test: `services-content.test.ts`.
- **`relatedPackages: string[] | null`.** Boş dizi pillar fallback'i,
  `null` paketsiz hizmet. `service-detail.tsx` `null`da paket bloğu, hero
  "Paketi incele" düğmesi ve `Service` şemasındaki `Offer` basmaz.
- **Vaka künyeleri:** `geo-danismanligi` SIM Baskı, İstanbul Ortez Protez
  ve Meccanotecnica Umbra'ya eklendi — üçünün de künyesinde "SEO ve GEO"
  var ve anlatısı bunu taşıyor. Kanıt şeridi elle seçildi (SIM Baskı,
  İstanbul Ortez Protez).
- **Rollback:** `SERVICES` ve `SERVICE_ORDER`dan kaydı çıkarmak, `topics.ts`
  `geo.serviceSlug`u `null`a döndürmek ve beş yazıdaki satır içi bağlantıyı
  kaldırmak yeterli; diyagram ataması eski sayfaları zaten etkilemiyor.

## Referanslar

- `Marketing/Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` §2-4
- `Marketing/GSC-Data/haftalik-2026-09-22/sorgular.csv` (2026-08-22 → 2026-09-19)
- `Marketing/GEO-Olcum/ozet.md` (Ay 0: 0/30, Ay 1: 1/30)
- `docs/strateji/GEO-Olcum-Rutini.md`
- ADR-018, ADR-021, ADR-030
