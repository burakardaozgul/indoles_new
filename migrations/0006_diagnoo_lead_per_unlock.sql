-- Her kilit açma kendi lead satırını ve kendi token'ını alır.
--
-- 0005, benzersizliği (diagnostic_id, email) çiftine taşımıştı; aynı e-posta
-- ikinci kez geldiğinde rota mevcut satırın token'ını YENİDEN YAZIYORDU. Bu,
-- iki kapıyı birden açık bırakıyordu:
--
--   1. Sızıntı: teşhis kimliği paylaşılabilen bir değerdir — 24 saatlik
--      yeniden kullanım yolu (`findFreshCompleted`) A'nın taramasının
--      kimliğini B'ye zaten veriyor. A'nın iş e-postasını da bilen biri
--      (rakip, eski çalışan) "A olarak" unlock edip A'nın kendi rakamlarıyla
--      yeniden hesaplanmış raporunu okuyabiliyordu.
--   2. Kilit düşürme: token yeniden yazıldığı için A'nın kendi çerezi
--      geçersizleşiyor ve A raporunu kaybediyordu.
--
-- Çözüm: satır başına bir kilit. E-posta artık bir kimlik değil, yalnızca
-- satış bildirimini tekrarlamamak için bakılan bir alan; indeks bu yüzden
-- benzersiz olmaktan çıkıp sıradan bir arama indeksine dönüyor.

DROP INDEX idx_diagnoo_leads_diag_email;
CREATE INDEX idx_diagnoo_leads_diag_email ON diagnoo_leads (diagnostic_id, email);
