# ADR-029 — Calendar kesintisinde satır `confirmed` kalır, `failed`e çekilmez

- **Durum:** Kabul edildi
- **Tarih:** 2026-08-29
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` §4 ("Calendar erişimi kesik") · çapraz görev denetimi
- **İlgili:** ADR-025 (kendi takvim sistemine geçiş), Görev 2 (kısmi unique indeksler), Görev 8 (iptal/erteleme uçları)
- **Etkilenen dosyalar:** `src/app/api/booking/route.ts`, `src/app/api/booking/__tests__/route.test.ts`, `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` §4

---

## Bağlam

Spec §4 şunu söylüyor: *"Calendar erişimi kesik → Satır `failed`, ziyaretçiye
dürüst mesaj, bildirim maili yine gider — lead kaybolmaz, manuel dönülebilir."*
Niyet açık: Calendar API'sine yazma başarısız olsa bile randevu **geçerli**
kalır, Burak takvim etkinliğini elle oluşturur, ziyaretçi mağdur olmaz.

Ama bu niyeti uygulayan mekanizma — satırı `status = 'failed'` yapmak — tam
tersini üretiyordu. Çakışma kilidi `migrations/0001_bookings.sql`'de KISMİ bir
indeks:

```sql
CREATE UNIQUE INDEX idx_bookings_slot
  ON bookings (consultant_id, starts_at_utc)
  WHERE status = 'confirmed';

CREATE UNIQUE INDEX idx_bookings_active_email
  ON bookings (email)
  WHERE status = 'confirmed';
```

Bir satır `failed` olduğu an bu iki indeksten de düşer: slot **ve** o
ziyaretçinin "aktif randevu" kilidi aynı anda serbest kalır. `POST
/api/booking` bu esnada ziyaretçiye "Randevun onaylandı" mailini YİNE
gönderiyordu (route sırası: DB → Calendar → mailler). Sonuç: bir Calendar
kesintisi sırasında

1. Ziyaretçi A randevusunun onaylandığını sanıyor,
2. Aynı saat aynı anda ziyaretçi B'ye satılabiliyor,
3. İkisi de gelip aynı saatte karşılaşıyor.

Ayrıca `cancelBooking` ve `rescheduleBooking` (`src/lib/booking/repository.ts`)
her ikisi de `AND status = 'confirmed'` şartıyla yazıyor. Bir satır `failed`e
düştüğünde ziyaretçinin onay mailindeki iptal/erteleme bağlantısı artık hiçbir
satırı güncellemiyor — `res.meta.changes === 0` yolundan sessizce
"already_cancelled" / "not_found" dönüyor. Yani spec'in vaat ettiği "manuel
dönülebilir" durumu, ziyaretçi tarafında da kırık: kendi randevusunu iptal
edemiyor.

## Karar

**Mekanizma değişti, niyet aynı kaldı.**

Calendar çağrısı (`createEvent`/`attachCalendarResult`) başarısız olduğunda
satır **`confirmed` kalır**. `markFailed` bu yoldan artık çağrılmaz —
fonksiyon `src/lib/booking/repository.ts`'te siliniyor, yalnızca
`route.ts`'teki çağrı kaldırıldı.

Takvime yazılamadığının işareti zaten bedava ve şemaya uygun:
**`calendar_event_id IS NULL`** (sütun `NULL` kabul ediyor,
`attachCalendarResult` başarılı olduğunda doldurur). Bu, "Calendar'a hiç
yazılmadı" ile "yazıldı ama event silindi" arasındaki farkı da açık bırakır —
`failed` durumu bu ayrımı taşımıyordu.

Yanıt sözleşmesi değişmedi: `degraded: true` dönüyor, arayüz aynı dürüst
mesajı gösteriyor, iç bildirim maili aynı "takvime YAZILAMADI, elle oluştur"
uyarısını taşıyor (`emails/BookingNotification.tsx` props'una dokunulmadı).

## Gerekçe

1. **Kısmi indeks kısıtı `status = 'confirmed'` üzerinden çalışıyor** — bu
   INDOLES'in kendi tasarımı (Görev 2). `failed` bu kısıttan kaçan tek statü,
   dolayısıyla "confirmed dışı her şey slotu serbest bırakır" bilinen bir
   kural; `markFailed`'i bu yoldan çağırmak bu kuralı ihlal ediyordu.
2. **`calendar_event_id IS NULL` zaten var, ücretsiz.** Yeni bir sütun, yeni
   bir migration, yeni bir statü gerekmiyor.
3. **İptal/erteleme bağlantıları düzelmiş oluyor** — `AND status =
   'confirmed'` şartı hâlâ doğru guard (Görev 7'nin TOCTOU kapatması), ama
   artık bu görüşmenin bilinçli kapsamı dışında bıraktığı bir yan etki
   olmuyor; satır zaten `confirmed` kaldığı için bu yol çalışıyor.
4. **Reddedilen alternatif — yeni bir ara statü** (örn. `calendar_pending`):
   kapsamı gereksiz büyütüyor, kısmi indeksleri de güncellemeyi gerektirirdi.
   `NULL` sütun zaten bu bilgiyi taşıyor.

## Sonuçlar

### Pozitif
- Bir Calendar kesintisi artık slotu boşaltmıyor; aynı saate ikinci bir
  ziyaretçi rezervasyon YAPAMAZ (`idx_bookings_slot` hâlâ kapsıyor).
- Ziyaretçinin iptal/erteleme bağlantısı Calendar'a yazılamamış bir
  randevuda da çalışıyor.
- `calendar_event_id IS NULL` olan satırlar tek bir SQL sorgusuyla
  ("Calendar'a düşmemiş randevular") Burak'ın elle tamamlaması için
  listelenebilir — ayrı bir runbook/rapor ihtiyacı bu ADR'nin kapsamı dışında.

### Negatif / trade-off
- `status = 'failed'` artık `POST /api/booking` yolunda hiç üretilmiyor.
  Bu statünün ne zaman kullanılacağı (iptal edilmemiş ama hiçbir zaman
  Calendar'a yazılamamış eski satırların temizliği, manuel müdahale sonrası
  işaretleme vb.) **Görev 9'a açık soru olarak bırakıldı.**
- `markFailed` fonksiyonu `repository.ts`'te siliniyor değil; çağrılmayan
  ölü kod olarak duruyor, Görev 9 onu ya yeni bir çağrı yoluna bağlayacak ya
  da silecek.

### Yeniden değerlendirme tetikleyicileri
- Görev 9 `failed` statüsü için yeni bir kullanım yolu tanımlarsa.
- `calendar_event_id IS NULL` satırların takibi için ayrı bir admin görünümü
  veya rapor gerektiği ortaya çıkarsa.

### Sonuç (Görev 9 fix turu 1)
`markFailed` silindi — açık uç (a) değil (b) yönünde kapatıldı. Görev 9 boyunca
`failed`i üreten yeni bir çağrı yolu tanımlanmadı; ADR-029'un bıraktığı karara
göre çağrılmayan fonksiyonu tutmak var olmayan bir yeteneği vaat ediyordu.
`'failed'` CHECK kısıtında kalıyor (eski veri uyumu, zararsız).

## Implementasyon notları

- `src/app/api/booking/route.ts`: Calendar `catch` bloğundan `markFailed`
  çağrısı kaldırıldı, `degraded = true` korundu; yorum niçin'i açıklıyor.
- `src/app/api/booking/__tests__/route.test.ts`: "Calendar düşerse" testi
  `markFailed`'in ÇAĞRILMADIĞINI doğrulayacak şekilde güncellendi; Fix C
  testleri (aynı catch bloğu) aynı şekilde güncellendi; yeni bir test
  ("aynı slota ikinci POST 409 alır") stateful bir `createBooking`/
  `markFailed` sahte çifti kuruyor ve regresyonu doğrudan yakalıyor.
- Migration gerekmedi — şema zaten `calendar_event_id`'yi `NULL` kabul
  ediyordu.
- Rollback: `route.ts`'teki `catch` bloğuna `await markFailed(db, row.id);`
  satırını geri koymak yeterli — ama bu, bu ADR'nin tam olarak düzelttiği
  kusuru geri getirir.

## Referanslar

- `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` §4
- `migrations/0001_bookings.sql`
- ADR-025 (Cal.com kaldırıldı, kendi takvim sistemi)
