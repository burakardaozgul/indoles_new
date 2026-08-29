-- Görev 9, Ek 1 (denetimlerden gelen ek — plandaki ilk halinde yoktu):
-- CHECK kısıtına 'completed' eklenir.
--
-- SQLite bir CHECK kısıtını ALTER TABLE ile değiştiremiyor; tek yol tabloyu
-- yeniden kurmak. Sıra: yeni tablo -> veriyi kopyala -> eskisini düşür ->
-- yeniden adlandır -> DÖRT indeksi de yeniden kur. DROP TABLE eski tabloyla
-- birlikte üstündeki tüm indeksleri de düşürür; yeniden adlandırma bunları
-- GERİ GETİRMEZ. İkisi kısmi (partial) unique indeks — WHERE yüklemi
-- unutulursa çakışma kilidi (aynı slotun iki kez satılması) sessizce gider,
-- bu göçün en tehlikeli hata biçimi.
--
-- Neden 'completed' gerekiyor: idx_bookings_slot ve idx_bookings_active_email
-- yalnız status = 'confirmed' satırları kapsıyor. Başlangıcı geçmiş bir
-- 'confirmed' satır cron tarafından 'completed'e çekilmezse o e-postanın
-- "aktif randevu var" kilidi süresiz açık kalır: Eylül'de görüşen biri
-- Ekim'de randevu alamaz. Cron bu göçten sonra günlük olarak
-- `UPDATE bookings SET status = 'completed' WHERE status = 'confirmed'
-- AND starts_at_utc < şimdi` çalıştırıyor (src/lib/booking/cron-job.ts).
--
-- Zamanlama: 2026-08-29 itibarıyla `bookings` tablosu canlıda BOŞ
-- (doğrulandı) ve ilk rezervasyonlar 31 Ağustos'ta açılıyor — bu göç bugün
-- veri taşımadan uygulanabiliyor, bir hafta sonra canlı veri üstünde olurdu.

CREATE TABLE bookings_new (
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
  status            TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'failed', 'completed')),
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);

-- Sütunlar `SELECT *` yerine tek tek adlandırılıyor: tablo şeması ileride
-- sütun eklenerek değişirse (bu göçten bağımsız bir değişiklikle) `SELECT *`
-- sessizce yanlış sütuna yanlış değeri kopyalayabilirdi; açık liste bunu
-- derleme/çalışma anında görünür kılar.
INSERT INTO bookings_new (
  id, cancel_token, calendar_event_id, meet_url, consultant_id,
  starts_at_utc, ends_at_utc, visitor_timezone, name, email, locale,
  status, created_at, updated_at
)
SELECT
  id, cancel_token, calendar_event_id, meet_url, consultant_id,
  starts_at_utc, ends_at_utc, visitor_timezone, name, email, locale,
  status, created_at, updated_at
FROM bookings;

DROP TABLE bookings;
ALTER TABLE bookings_new RENAME TO bookings;

-- Dört indeks — 0001_bookings.sql'deki ile BİREBİR aynı tanım ve yorum.
CREATE UNIQUE INDEX idx_bookings_slot
  ON bookings (consultant_id, starts_at_utc)
  WHERE status = 'confirmed';

CREATE UNIQUE INDEX idx_bookings_active_email
  ON bookings (email)
  WHERE status = 'confirmed';

CREATE INDEX idx_bookings_email_status ON bookings (email, status);
CREATE INDEX idx_bookings_starts_at ON bookings (starts_at_utc);
