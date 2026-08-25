# ADR-021 — Yazı konu taksonomisi, filtre sistemi ve yazar çeşitlendirmesi

- **Durum:** Kabul edildi
- **Tarih:** 2026-08-24
- **Bağlam:** ADR-020 (blog migrasyonu) tamamlandıktan sonra yapılan bilgi kütüphanesi denetimi
- **İlgili:** ADR-018 (hizmet sayfaları), ADR-019 (vaka migrasyonu), ADR-020 (blog migrasyonu)

## Bağlam

ADR-020 ile 16 yazı yeni siteye taşındı. Taşıma bittikten sonra `/tr/yazilar`
liste sayfası denetlendi. Ölçülen durum:

| Ölçüm | Değer |
|---|---|
| Yazı sayısı | 16 |
| `category` dağılımı | **16/16 `growth`** |
| `tags` | 44 farklı etiket, 40'ı yalnız bir yazıda |
| `authorSlug` | 16/16 `burak-ozgul` |
| Filtre / arama / sıralama | yok |
| İlk ekranda görünen yazı | 1 |
| Mobil sayfa boyu | 11.805px (~15 ekran) |
| LCP / CLS | 142ms / 0.00 |

Sayfa hızlı ve erişilebilir; sorun **keşfedilebilirlikte**. Kullanıcı ilgilendiği
konudaki yazıya doğrudan ulaşamıyor, listeyi baştan sona taramak zorunda.

CLAUDE.md'nin "kapsam dışı" tablosunda şu satır vardı:

> Journal kategori taksonomisi | Yazı hacmi haklı çıkarmıyor; **15+ yazıda tekrar bakılır**

16 yazıyla bu eşik aşıldı; karar yeniden değerlendirmeye açıldı.

## Reddedilen seçenek: mevcut alanlardan filtre üretmek

En hızlı çözüm `category` ve `tags` alanlarını filtreye bağlamaktı. Veri bunu
çürütüyor:

- **`category` filtresi tek butona düşer.** 16 yazının 16'sı `growth`. Pillar
  taksonomisi hizmet/vaka tarafında anlamlı (üç sütunlu iş modeli), yazı
  tarafında değil — bir yazının hangi pillar'a hizmet ettiği okurun sorduğu
  soru değil.
- **`tags` filtresi uzun kuyruk üretir.** 44 etiketin 40'ı tek yazıda. Etiket
  bulutu 44 seçenek gösterip 40'ında tek sonuç döndürür — filtre değil gürültü.
- **`authorSlug` filtresi anlamsız.** Tek yazar var.

## Karar

### 1. Konu taksonomisi (`topic`) açılıyor

`ArticleContent` şemasına **zorunlu** `topic` alanı ekleniyor. Kapalı bir union;
değerler uydurulmuyor, `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md`
§2'deki **niyet-bazlı keyword kümelerinden** birebir türetiliyor:

| `topic` | TR | EN | Strateji kümesi | Hedef hizmet |
|---|---|---|---|---|
| `yapay-zeka` | Yapay Zeka ve Dijital Dönüşüm | AI & Digital Transformation | P0-müşteri | `/hizmetler/ai-danismanlik` |
| `geo` | Yapay Zeka Aramaları (GEO) | AI Search (GEO) | **P0-trafik** | — (kümenin hedefi yazıların kendisi) |
| `cro` | Dönüşüm Optimizasyonu | Conversion Optimisation | P0-müşteri | `/hizmetler/cro` |
| `performans-pazarlama` | Performans Pazarlama | Performance Marketing | P1 | `/hizmetler/performans-pazarlama` |
| `musteri-elde-tutma` | Müşteri Elde Tutma | Retention & LTV | P1 (performans alt kümesi) | `/hizmetler/performans-pazarlama` |
| `e-ticaret` | E-Ticaret | E-commerce | P2 | `/hizmetler/e-ticaret` |
| `ui-ux` | UI/UX ve Web Tasarım | UI/UX & Web Design | P1 | `/hizmetler/ui-ux-tasarim` |
| `is-gelistirme` | İş Geliştirme | Business Building | P1 (kategori sahipliği) | `/hizmetler` |
| `marka-hikaye` | Marka ve Hikâye | Brand & Storytelling | P2 | `/hizmetler/marka-stratejisi` |
| `video-kreatif` | Video ve Kreatif | Video & Creative | — | — (hizmet sayfası henüz yok) |

Bu eşleme taksonomiyi üç işe birden koşuyor:

1. **Filtre** — okur konusuna göre daraltır.
2. **İçerik boşluk haritası** — `yapay-zeka` kümesi P0-müşteri önceliğinde ama
   kütüphanede **sıfır yazı** var. Taksonomi bu boşluğu görünür kılıyor.
3. **İç link disiplini** — her konunun tek hedef hizmet sayfası var; ADR-018'in
   cannibalization yasağı yazı tarafında da uygulanabilir hale geliyor.

`category` alanı **silinmiyor**: JSON-LD ve mevcut sıralamalar ona bağlı, ve
pillar bilgisi hizmet/vaka çapraz linki için hâlâ doğru veri. Yalnız **listede
filtre ekseni olmaktan çıkıyor**; UI'da yerini `topic` alıyor.

`tags` de kalıyor — uzun kuyruk anahtar kelime sinyali olarak SEO değeri var,
sadece filtre olarak kullanılmıyor.

### 2. Filtre sistemi

- **Tek eksen: konu.** İkinci bir eksen (persona, yazar, yıl) 16 yazıda boş
  kesişim üretir. Kütüphane büyüdükçe yeniden değerlendirilir.
- **Sayaçlı çipler.** Her konu yanında yazı sayısı yazar. Sayısı sıfır olan
  konu **hiç render edilmez** — boş filtre gösterilmez.
- **URL'e yazar** (`?konu=cro` / `?topic=cro`). Paylaşılabilir, geri tuşu
  çalışır, GA4'te sorgu bazında ölçülebilir.
- **Kademeli gösterim (pagination) şimdilik yok.** Denemesi yapıldı ve
  reddedildi: ilk N yazıyı basıp kalanını gizlemek, JS'siz istemcide ve
  crawler'da kalan linkleri kaynaktan düşürüyor. 16 yazıda bunun bedeli
  kazancından büyük — mobil uzunluk sorununu asıl çözen zaten filtrenin
  kendisi (konu seçildiğinde liste 1-4 satıra iniyor). Kütüphane 30 yazıyı
  geçtiğinde tekrar bakılır; o noktada doğru çözüm gizleme değil gerçek
  sayfalama (`/tr/yazilar/2`) olur.
- **Eşleşmeyen satır DOM'dan çıkarılmaz, `hidden` ile gizlenir.** Bileşen
  istemci bileşeni ama sunucuda da render ediliyor; bu sayede filtre JS'i hiç
  çalışmasa bile 16 yazının tamamı kaynak HTML'de ve indekslenebilir kalıyor.
- **`useSearchParams` kullanılmıyor.** Sayfayı dinamik render'a düşürüp SSG'yi
  bozuyor. URL, hidrasyondan sonra `history` API'siyle okunup yazılıyor.

### 3. Yazar çeşitlendirmesi

16 yazının 16'sının tek isme yazılması hem gerçeğe aykırı hem E-E-A-T açısından
zayıf. `authorSlug` değerleri danışmanların **gerçek uzmanlık alanına** göre
dağıtıldı:

| Yazar | Yazı | Gerekçe |
|---|---|---|
| Burak Arda Özgül | 8 | Kurucu tezi taşıyan yazılar: CRO, GEO, ajans seçimi, performans, e-ticaret |
| Can Aydınlık | 3 | Dijital dönüşüm / veri: RFM, LTV, KOBİ dijitalleşme |
| Çağrı Erdoğan | 3 | Marka dili ve içerik stratejisi: gerilla, psikoloji, UGC |
| Sude Albayrak | 1 | Görsel tasarım: web tasarım trendleri |
| Mert Kaplan | 1 | Görüntü yönetmenliği: profesyonel video |

Atama yayın kararıdır; metinler ekip adına üretilmiştir ve kurucu onayıyla
ilgili uzmana künyelenmiştir.

### 4. PostHog kaldırılıyor, ölçüm GA4'e toplanıyor

Denetimde liste sayfasında hiç olay ölçümü olmadığı görüldü. Olay eklemek yerine
ölçüm katmanı tekilleştirildi: **PostHog tamamen kaldırıldı**, tüm olaylar
`src/app/layout.tsx`'te zaten kurulu olan **GA4** üzerinden gidiyor.

Gerekçe: iki analitik SDK'sı paralel taşımak (posthog-js istemci bundle'ı +
posthog-node sunucu istemcisi) hem gereksiz JS ağırlığı hem ikinci bir KVKK
veri işleyicisi demekti. Ölçüm ihtiyacı GA4'ün karşılayamayacağı bir şey değil.

## Sonuçlar

**Olumlu**
- Okur konusuna göre daraltıyor; liste 15 ekrandan filtrelenebilir bir yüzeye dönüyor.
- İçerik planı ölçülebilir hale geliyor: hangi kümede kaç yazı var, nerede boşluk var.
- İkinci analitik SDK'sı ve ikinci veri işleyici ortadan kalkıyor.
- Yazar dağılımı gerçeğe ve E-E-A-T'ye uyuyor.

**Olumsuz / bedel**
- Her yeni yazı artık `topic` seçmek zorunda; kapalı union olduğu için yeni bir
  konu açmak tip değişikliği + bu ADR'nin güncellenmesi demek. Bu bilinçli
  sürtünme: taksonomi kontrolsüz büyürse `tags`'in başına geleni yaşar.
- Filtre `use client` sınırı ekliyor (liste gövdesi hâlâ sunucuda basılıyor).
- PostHog kaldırma, popup ve form olaylarının GA4 karşılıklarına yeniden
  bağlanmasını gerektirdi. Sunucu tarafı `identify()` çağrısıyla taşınan lead
  özellikleri (şirket, unvan, UTM) GA4'e taşınmıyor — GA4 CRM değil; o veri
  zaten e-posta bildirimiyle gidiyor.
- Kaldırma sırasında görüldü ki `initPostHog()` hiçbir yerden çağrılmıyordu:
  istemci tarafı PostHog olayları zaten hiç yazılmıyordu. Popup olayları GA4'e
  bağlanınca **ilk kez** gerçekten ölçülür hale geldi.

**Açık iş**
- `yapay-zeka` konusunda içerik yok — P0-müşteri kümesi. İlk yazılacak konu bu.
- Sanayici persona (1A/1B) için kütüphanede içerik yok; 16 yazının tamamı
  ticaret/büyüme ekseninde. Persona ekseni **bilinçli olarak filtreye
  konmuyor** (bkz. kapsam dışı), ama içerik planında açık kalıyor.

## Kapsam dışı

| Konu | Gerekçe |
|---|---|
| Serbest metin arama / ⌘K paleti | 16 yazıda filtre yeterli; ileride sohbet asistanı bu ihtiyacı karşılayacak |
| Yazılarda persona ekseni | Yazılar tek dille yazılıyor; persona uyarlaması yazı yüzeyine taşınmıyor |
| Konu arşiv sayfaları (`/tr/yazilar/konu/cro`) | Yazı hacmi henüz haklı çıkarmıyor; küme başına 5+ yazıda tekrar bakılır |
| Sayfalama | 16 yazıda gereksiz, SEO bedeli var (yukarı bkz.); 30+ yazıda tekrar bakılır |
| Çoklu konu seçimi (AND/OR) | Tek konu seçimi 16 yazıda yeterli; kesişimler boş döner |
