-- Diagnoo GAP analizi aracı (spec: docs/superpowers/specs/2026-09-01-diagnoo-design.md §9.4)
-- Rapor tek JSON kolonda tutulur: pipeline çıktısı atomik yazılır, şema evrimi
-- uygulama katmanındaki Zod'da yönetilir (ayrı kolonlara normalize etmek YAGNI).
-- IP hash: tool_scans ile aynı kalıp (TOOL_IP_SALT ile SHA-256); ham IP asla yazılmaz (docs/14).

CREATE TABLE diagnoo_diagnostics (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'tr',
  status TEXT NOT NULL DEFAULT 'queued',       -- queued|running|completed|failed
  current_step TEXT,                            -- scraping|semantic|vision|funnel|financial|report
  progress_pct INTEGER NOT NULL DEFAULT 0,
  report_json TEXT,                             -- DiagnooReport (Zod ile doğrulanmış)
  fail_reason TEXT,
  client_ip_hash TEXT,
  demo_mode INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Aynı URL için 24 saat içinde tamamlanmış rapor varsa yeniden koşulmaz (maliyet koruması).
CREATE INDEX idx_diagnoo_url_completed
  ON diagnoo_diagnostics (url, created_at) WHERE status = 'completed';

-- IP başına günlük analiz limiti ve global günlük tavan bu indeksle sayılır.
CREATE INDEX idx_diagnoo_ip ON diagnoo_diagnostics (client_ip_hash, created_at);
CREATE INDEX idx_diagnoo_time ON diagnoo_diagnostics (created_at);

CREATE TABLE diagnoo_leads (
  id TEXT PRIMARY KEY,
  diagnostic_id TEXT NOT NULL REFERENCES diagnoo_diagnostics(id),
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  full_name TEXT,
  kvkk_consent INTEGER NOT NULL CHECK (kvkk_consent = 1),  -- tool_leads kalıbı: onaysız satır yazılamaz
  known_metrics_json TEXT,                      -- KnownMetrics (opsiyonel gerçek veriler)
  client_ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Bir teşhise en fazla bir lead: unlock idempotent olmalı.
CREATE UNIQUE INDEX idx_diagnoo_leads_diagnostic ON diagnoo_leads (diagnostic_id);
