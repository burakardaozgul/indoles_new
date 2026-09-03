-- IP başına saatlik unlock limiti (`countLeadsSince`, unlock rotası) bu
-- indeks olmadan her denetimde `diagnoo_leads` tablosunun tamamını taratıyordu
-- — 0004'te `diagnoo_diagnostics` için kurulan `idx_diagnoo_ip` kalıbı
-- `diagnoo_leads`e hiç taşınmamıştı. Yeni sütun eklenmiyor, yalnız GEO
-- `countScansSince` ile aynı (client_ip_hash, created_at) indeksi kuruluyor.
CREATE INDEX idx_diagnoo_leads_ip ON diagnoo_leads (client_ip_hash, created_at);
