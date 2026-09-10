# ADR-038 — GA4 ölçüm kimliği yeni veri akışına taşındı

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-10
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** `gtag/js?id=G-HC44KJ9ZP4` 404'ünün kök nedeninin bulunması
- **İlgili:** ADR-034 · ADR-037 (uyguladığı telafiyi geri alır)
- **Etkilenen:** GA4 mülkü `553152492`, GTM konteyneri `GTM-TFKLN9V` (sürüm 20), `.env.local`. **Kod değişikliği yok, deploy gerekmedi.**

## Bağlam

`gtag/js?id=G-HC44KJ9ZP4` iki gün boyunca **HTTP 404 + text/html** döndürdü.
ADR-034 bunu "izlenecek" diye kaydetmiş, ADR-037 ise `page_view` kaybının
sebebi olmadığını (8 Eylül'de de vardı ve o gün `page_view` çalışıyordu)
göstermişti. Ama sonucu ağırdı: Google etiketinin çekirdeği hiç kurulamadığı
için `page_view` **ve** gelişmiş ölçümün tamamı (`scroll`, outbound `click`,
`file_download`, `view_search_results`, `form_start`/`form_submit`, SPA
sayfa görüntülemeleri) ölüydü. ADR-037 `page_view`'ı GTM olay etiketiyle
telafi etti; geri kalanı açık kaldı.

## Teşhis

Aynı mülk içinde yeni bir web veri akışı açılıp ölçüm kimliği test edildi:

| | `G-HC44KJ9ZP4` (eski akış) | `G-KWT8HCXJT6` (yeni akış) |
|---|---|---|
| `gtag/js` | **404** `text/html` | **200** `application/javascript` |
| `page_view` | Gelmiyor | Geliyor |
| Gelişmiş ölçüm bayrağı | Yok | **`_ee=1`** |
| Remarketing ping'i (`ga-audiences`) | Görülmedi | Görüldü |

Mülk, hesap ve bizim kurulumumuz sağlam. **Bozuk olan tek şey akışın
kendisiydi** — 2026-09-08'de kurulmuş ve o günden beri Google tarafında tag
servisi çözülmüyor. İki gün boyunca kök neden sanılan şey (yapılandırma
hatası, tetikleyici sırası, kaldırılan `gtag('config')`) hiçbiri değildi.

## Karar

Ölçüm kimliği **aynı mülk içindeki** yeni akışa taşındı: `G-KWT8HCXJT6`,
akış `15753884326`, `defaultUri` kanonik host (`https://www.indoles.com.tr`
— eski akış apex'i işaret ediyordu).

**Neden veri kaybı yok:** GA4'te bir mülkün birden çok veri akışı olabilir ve
raporlar akışların toplamını gösterir. Özel boyutlar (26), özel metrikler (3),
anahtar olaylar ve Google Ads bağlantısı **mülk seviyesinde** — hiçbiri
etkilenmedi. Akış seviyesinde olan tek şey Diagnoo'nun event-create rule'uydu,
yeni akışa kopyalandı.

**Konteyner kimliği değişmedi.** `GTM-TFKLN9V` aynı; yalnız beş etiketten
dördündeki `G-` kimliği güncellendi. GA4 ile GTM kimlikleri hiçbir noktada
karışmıyor — denetlendi: `G-` yalnız GA4 etiketlerinde, `GTM-` yalnız env'deki
konteyner yükleyicisinde, değişkenlerde kimlik yok, kodda sabit kimlik yok.

**ADR-037'nin telafisi geri alındı.** `GA4 - Sayfa Goruntuleme` etiketi ve
`History Change` tetikleyicisi silindi: çalışan Google etiketi `page_view`'ı
kendisi gönderiyor ve gelişmiş ölçüm SPA gezinmelerini yerel olarak yapıyor.
Kalsalardı çift sayım olurdu — ADR-037 bu riski etiketin notunda yazmıştı.

**Deploy gerekmedi.** `NEXT_PUBLIC_GA_ID` ADR-034'ten beri hiçbir kod yolunda
okunmuyor (yalnız `scripts/ga4-*.ts` ve dokümantasyon için env'de duruyor);
ölçüm tamamen GTM'den akıyor. Değişiklik GTM yayını + env kaydından ibaret.

## Doğrulama (2026-09-10, konteyner sürüm 20)

Canlı sitede, ağ seviyesinde, tek bir istek gövdesinde:

```
tid=G-KWT8HCXJT6
en=page_view
en=service_viewed&ep.locale=tr&ep.pillar=transform&ep.slug=is-zekasi
en=popup_shown&ep.trigger_source=initial
```

- Tek `page_view` — silinen telafi etiketinden çift sayım yok.
- Taksonomi olayı doğru parametrelerle, sızıntı yok.
- Eski kimliğe (`G-HC44KJ9ZP4`) **sıfır** istek.
- Servis edilen `gtm.js` sürüm 20; içinde eski kimlik hiç geçmiyor.

**Doğrulanamayan:** tek tek gelişmiş ölçüm olayları. `_ee=1` bayrağı
gelişmiş ölçümün etkin olduğunu gösteriyor ama otomatik tarayıcıda
programatik `window.scrollTo` ile `scroll` olayı üretilemedi — GA4'ün
dinleyicisi gerçek kaydırma jesti bekliyor olabilir, ayrıca sitede Lenis
smooth-scroll var. Gerçek trafikle teyit edilmeli.

## Sonuçlar

- Artı: `page_view` doğal yoldan, telafi etiketi olmadan. Bakılacak bir şey azaldı.
- Artı: Gelişmiş ölçüm etkin — scroll, outbound tıklama, dosya indirme, site içi
  arama, form etkileşimi ve SPA sayfa görüntülemeleri artık mümkün.
- Artı: Remarketing kitle sinyali (`ga-audiences`) çalışıyor; Google Ads
  yeniden pazarlama kitleleri beslenebilir.
- Artı: Yeni akışın `defaultUri`si kanonik host — eski akış apex'i gösteriyordu.
- Eksi: Oturum çerezi (`_ga_<kimlik>`) kimlik başına ayrı olduğu için geçiş
  gününde dönen ziyaretçilerde tek seferlik `session_start`/`first_visit`
  sıçraması bekleniyor. Kullanıcı kimliği (`_ga`) paylaşımlı, kullanıcı
  sayıları şişmiyor.
- Eksi: 09 Eylül 12:00 UTC – 10 Eylül 13:00 UTC arası `page_view` kalıcı olarak
  eksik (ADR-037'de kaydedildi); 08–10 Eylül arası gelişmiş ölçüm hiç yok.
- Eski akış **silinmedi**, adı `indoles.com.tr (KULLANILMIYOR — gtag/js 404,
  ADR-038)` olarak işaretlendi. Geçmiş verisi mülkte kalıyor; kimse ona geri
  dönmesin diye ad açık.
- Ders: İki gün boyunca bir Google tarafı arızası kendi yapılandırma hatamız
  sanıldı. "Aynı işlemi temiz bir kaynakla tekrarla" testi (yeni akış açıp
  kimliğini denemek) beş dakika sürüyordu ve doğrudan cevabı veriyordu.
