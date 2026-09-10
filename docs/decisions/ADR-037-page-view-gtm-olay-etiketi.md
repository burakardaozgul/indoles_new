# ADR-037 — `page_view` açık bir GTM olay etiketinden gönderilir

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-10
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** ADR-034 sonrası `page_view` olaylarının durması
- **İlgili:** ADR-034 (ölçüm mimarisi — teşhisini düzeltir) · `docs/12` §2.0
- **Etkilenen:** GTM konteyneri `GTM-TFKLN9V` (sürüm 19). **Kod değişikliği yok.**

## Bağlam

ADR-034 ile `page_view` durdu. GA4 verisi:

| Tarih | `page_view` | `session_start` |
|---|---|---|
| 2026-09-08 16:00 UTC | 18 | 18 |
| 2026-09-08 17:00 UTC | 21 | 21 |
| 2026-09-09 12:00 UTC | 1 | 2 |
| 2026-09-09 14:00 UTC ve sonrası | **0** | 1 |

Kayıp bir gün fark edilmedi çünkü GA4'ün varsayılan raporu son 28 günü
gösteriyor: 8 Eylül'ün 39 kaydı toplamı dolu gösteriyordu. Yayın sonrası
doğrulamada olay sayılarına bakılmış, `page_view`'ın **yokluğu** kontrol
edilmemişti.

**ADR-034'ün teşhisi eksikti.** O ADR "GA4, `gtm.js`in sağladığı gtag çekirdeği
sayesinde ölçüyor" diyordu. Ölçümü sağlayan şey çekirdek değil, konteynerdeki
GA4 olay etiketi (tag 43). Bugün ölçüldü: `gtag('event','page_view')` —
köprü tetikleyicisinin regex'inde olmayan bir ad, dolayısıyla tag 43
ateşlenemez — hiçbir istek üretmiyor. Yani gtag çekirdeği bu ölçüm kimliği
için **hiçbir şey iletmiyor.**

Kök neden sanılan `gtag/js?id=G-HC44KJ9ZP4` 404'ü **sebep değil**: o 404
2026-09-08'de de vardı (önceki oturumun notunda "izlenecek" olarak kayıtlı) ve
o gün `page_view` kusursuz çalışıyordu.

## Elenen hipotez

`page_view`'ı gönderen şeyin, Google etiketinin **All Pages** tetikleyicisinde
olması sanıldı (8 Eylül'ün çalışan hâli öyleydi; ADR-034 onu Initialization'a
almıştı). Tek değişkenli test için sürüm 18 yayınlandı ve etiket All Pages'e
geri alındı — **`page_view` yine gelmedi.** Hipotez elendi, etiket standart
konumuna (Initialization) döndürüldü.

Kalan tek fark, ADR-034'ün koddan kaldırdığı `gtag('config','G-HC44KJ9ZP4')`
çağrısıydı: `gtm.js`in çekirdeği kuyruktaki o komutu işleyip hedefi
yapılandırıyor ve **ilk yapılandırma page_view'ini** gönderiyordu. Google
etiketi aynı hedefi yapılandırıyor ama page_view üretmiyor.

## Karar

`page_view` **açık bir GA4 olay etiketiyle** gönderilir: `GA4 - Sayfa
Goruntuleme`, tetikleyiciler **All Pages** (gerçek sayfa yüklemesi) ve
**History Change** (SPA gezinmesi).

Neden koddaki `gtag('config')`'i geri koymak değil:

1. Bu yol **çalıştığı kanıtlı** — tag 43 her gün aynı kanaldan olay taşıyor.
   `config` yolu ise 404'lü bir çekirdeğe bağlı ve neden page_view ürettiği
   tam olarak anlaşılmadı; anlaşılmayan bir mekanizmaya geri dönmek yerine
   çalıştığı ölçülen mekanizma kullanıldı.
2. Ölçüm sahipliği ADR-034'te GTM'e verildi; `page_view`'ı da oraya koymak
   tutarlı. Etiket eklemek deploy gerektirmiyor.
3. SPA gezinmelerini `config` zaten kapsamıyordu (gelişmiş ölçümün history
   dinleyicisi de aynı ölü çekirdeğe bağlı). History Change tetikleyicisi bunu
   açıkça çözüyor.

## Doğrulama (2026-09-10, sürüm 19)

Ağ seviyesinde ölçüldü:

- Tam sayfa yüklemesi → `en=page_view`, `dl=/tr/vakalar`, doğru başlık, **tek**
  istek (`popup_shown` ile aynı partide, ayrı satır).
- `history.pushState('/tr/paketler')` → **tek** `page_view`, `dl=/tr/paketler`.
  SPA gezinmesi doğru URL ile ölçülüyor.
- İlk yüklemede History Change ateşlenmiyor, yani çift sayım yok.

GA4 raporlarında görünmesi bu oturumda teyit edilemedi: mülk 2026-09-08'de
kurulduğu için işleme gecikmesi hâlâ yüksek — aynı anda gönderilen başka
olaylar da raporda yok. Yanıtlar 204, yani GA4 kayıtları kabul etti.

## Açık kalan: gelişmiş ölçüm

`scroll`, `click` (outbound), `file_download`, `view_search_results` ve
`form_start`/`form_submit` **hiç gelmiyor.** Sayfa %100 kaydırıldı, `scroll`
üretilmedi (2026-09-10 ölçümü). Hepsi Google etiketinin ölü çekirdeğine bağlı,
yani `page_view` ile aynı sebep — ama `page_view` gibi tek etiketle çözülmüyor:
her biri kendi GTM tetikleyicisini (Scroll Depth, Just Links, Element
Visibility) ve olay etiketini istiyor. Ayrı bir iş olarak duruyor.

Gerçek çözüm hâlâ `gtag/js?id=G-HC44KJ9ZP4` 404'ünü çözmek. Denenmeye değer:
yeni bir web veri akışı açıp yeni ölçüm kimliğinin `gtag/js`ten servis edilip
edilmediğine bakmak; ediliyorsa mevcut akış bozuk demektir ve değiştirilince
`page_view` etiketi de gelişmiş ölçüm de kendiliğinden düzelir.

## Sonuçlar

- Artı: `page_view` geri döndü, SPA gezinmeleri ilk kez ölçülüyor.
- Artı: Kod değişmedi, deploy gerekmedi.
- Eksi: **Google 404'ü düzeltirse tag 45 kendi `page_view`'ini göndermeye
  başlar ve çift sayım olur.** O an `GA4 - Sayfa Goruntuleme` duraklatılmalı;
  etiketin notunda yazılı.
- Eksi: 9 Eylül 12:00 UTC – 10 Eylül 13:00 UTC arası `page_view` verisi
  **kalıcı olarak eksik**. Sayfa ve açılış sayfası raporlarında o aralık boş.
- Ders: Yayın sonrası doğrulama "hangi olaylar geldi" ile yetinmemeli, **hangi
  olayların gelmediğini** de sormalı. ADR-034'ün doğrulaması olay sayılarına
  bakıp `page_view`'ın yokluğunu görmedi.
