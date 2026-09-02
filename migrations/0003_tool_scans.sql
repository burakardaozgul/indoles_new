-- 0003: GEO araç taramaları ve lead'leri. Ham IP saklanmaz (KVKK) — SHA-256 + gizli tuz.
CREATE TABLE tool_scans (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  band TEXT NOT NULL,
  checks_json TEXT NOT NULL,
  client_ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_tool_scans_ip ON tool_scans (client_ip_hash, created_at);
CREATE INDEX idx_tool_scans_time ON tool_scans (created_at);
CREATE TABLE tool_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL REFERENCES tool_scans(id),
  email TEXT NOT NULL,
  kvkk_consent INTEGER NOT NULL CHECK (kvkk_consent = 1),
  client_ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_tool_leads_ip ON tool_leads (client_ip_hash, created_at);
