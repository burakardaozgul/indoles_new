-- Rezervasyon tablosu (spec §2.2).
-- KVKK minimizasyonu: yalnız ad ve e-posta saklanır. Telefon, şirket,
-- unvan, persona ve problemler BURAYA YAZILMAZ — yalnız maile ve Calendar
-- etkinlik açıklamasına gider (spec §2.2b).
CREATE TABLE bookings (
  id                TEXT PRIMARY KEY,
  cancel_token      TEXT NOT NULL UNIQUE,
  calendar_event_id TEXT,
  meet_url          TEXT,
  consultant_id     TEXT NOT NULL,
  starts_at_utc     TEXT NOT NULL,
  ends_at_utc       TEXT NOT NULL,
  visitor_timezone  TEXT NOT NULL,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  locale            TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'failed')),
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);

-- Çakışma kilidi. KISMİ indeks olması şart: iptal edilen bir slot yeniden
-- satılabilmeli, dolayısıyla kısıt yalnız 'confirmed' satırları kapsar.
-- Uygulama kodunda kilit alınmaz; "önce kontrol et sonra yaz" yarışa açıktır.
CREATE UNIQUE INDEX idx_bookings_slot
  ON bookings (consultant_id, starts_at_utc)
  WHERE status = 'confirmed';

-- Aynı e-postadan ikinci AKTİF randevu engellenir (spec §4). Kısıt burada
-- duruyor çünkü uygulama kodundaki ön kontrol eşzamanlı iki istekte yarışa
-- açıktı: ikisi de "aktif randevu yok" görüp ikisi de yazabiliyordu.
CREATE UNIQUE INDEX idx_bookings_active_email
  ON bookings (email)
  WHERE status = 'confirmed';

-- Aktif randevu kontrolü ve temizlik işi bu sütunlardan tarar.
CREATE INDEX idx_bookings_email_status ON bookings (email, status);
CREATE INDEX idx_bookings_starts_at ON bookings (starts_at_utc);
