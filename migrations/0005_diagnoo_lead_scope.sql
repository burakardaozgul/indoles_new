-- Diagnoo kilit kapsamı: teşhis bazlı kilitten ZİYARETÇİ bazlı kilide geçiş.
--
-- 0004'teki `idx_diagnoo_leads_diagnostic` bir teşhise tek lead izni veriyor,
-- durum rotası da kapıyı `hasLead(diagnostic_id)` ile açıyordu. Aynı URL için
-- 24 saat içinde tamamlanmış bir teşhis yeniden kullanıldığı için (maliyet
-- koruması) A'nın açtığı kilit B'ye de açılıyordu; üstelik unlock, A'nın
-- girdiği ticari verilerle yeniden hesaplanan raporu PAYLAŞILAN
-- `diagnoo_diagnostics.report_json` satırına yazıyordu — B, A'nın trafik,
-- sepet, dönüşüm ve reklam bütçesi rakamlarını "Ölçüldü" rozetiyle görüyordu.
--
-- Bu migration iki şeyi ayırır: (1) kilit artık ziyaretçiye bağlı bir
-- token'dır, (2) ziyaretçiye özel yeniden hesap lead satırında yaşar.

-- Teşhis başına tek lead kısıtı kalkar, benzersizlik (teşhis, e-posta)
-- çiftine taşınır: aynı e-posta ikinci kez gelirse hâlâ "duplicate" döner ve
-- unlock idempotent kalır; başka bir ziyaretçi ise kendi lead satırını alır.
DROP INDEX idx_diagnoo_leads_diagnostic;
CREATE UNIQUE INDEX idx_diagnoo_leads_diag_email ON diagnoo_leads (diagnostic_id, email);

-- Kilidi kanıtlayan rastgele değer. HttpOnly çerezde taşınır, URL'ye ASLA
-- girmez: adresi paylaşılan bir rapor bağlantısı kilidi açmamalı.
ALTER TABLE diagnoo_leads ADD COLUMN unlock_token TEXT;

-- Ziyaretçinin kendi metrikleriyle yeniden hesaplanmış raporu. Paylaşılan
-- teşhis satırı bu yüzden unlock'ta artık hiç değişmez.
ALTER TABLE diagnoo_leads ADD COLUMN recomputed_report_json TEXT;

-- Durum sorgusu ve rapor sayfası her istekte token ile lead arar.
CREATE INDEX idx_diagnoo_leads_token ON diagnoo_leads (unlock_token);
