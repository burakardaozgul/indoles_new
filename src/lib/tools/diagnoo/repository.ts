// SQL yalnız burada yaşar; rotalar ve pipeline bu fonksiyonları çağırır (booking/geo repository kalıbı).
import { DiagnooReportSchema, type DiagnooReport, type KnownMetrics } from "./schema";

export type DiagnosticRow = {
  id: string; url: string; locale: "tr" | "en";
  status: "queued" | "running" | "completed" | "failed";
  currentStep: string | null; progressPct: number;
  report: DiagnooReport | null; failReason: string | null;
};

type Raw = {
  id: string; url: string; locale: string; status: string; current_step: string | null;
  progress_pct: number; report_json: string | null; fail_reason: string | null;
};

function toRow(r: Raw): DiagnosticRow {
  let report: DiagnooReport | null = null;
  if (r.report_json) {
    const parsed = DiagnooReportSchema.safeParse(JSON.parse(r.report_json));
    report = parsed.success ? parsed.data : null;
  }
  return {
    id: r.id, url: r.url, locale: r.locale as "tr" | "en",
    status: r.status as DiagnosticRow["status"], currentStep: r.current_step,
    progressPct: r.progress_pct, report, failReason: r.fail_reason,
  };
}

// D1'de created_at datetime('now') ile "YYYY-MM-DD HH:MM:SS" (UTC, "T" yok) biçiminde yazılır;
// Date.prototype.toISOString()'in "T" ayracı bu biçimle sözlük sırasında YANLIŞ karşılaştırılır
// (' ' < 'T'), bu yüzden rotalar `since` değerini bu fonksiyonla üretmeli (GEO countScansSince ile aynı sözleşme).
export function sqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function createDiagnostic(
  db: D1Database, input: { id: string; url: string; locale: "tr" | "en"; clientIpHash: string },
): Promise<void> {
  await db.prepare("INSERT INTO diagnoo_diagnostics (id, url, locale, client_ip_hash) VALUES (?, ?, ?, ?)")
    .bind(input.id, input.url, input.locale, input.clientIpHash).run();
}

export async function findFreshCompleted(
  db: D1Database, url: string, maxAgeHours: number,
): Promise<DiagnosticRow | null> {
  const row = await db.prepare(
    `SELECT * FROM diagnoo_diagnostics
     WHERE url = ? AND status = 'completed' AND created_at >= datetime('now', ?)
     ORDER BY created_at DESC LIMIT 1`,
  ).bind(url, `-${maxAgeHours} hours`).first();
  return row ? toRow(row as Raw) : null;
}

export async function setProgress(db: D1Database, id: string, step: string, pct: number): Promise<void> {
  await db.prepare(
    "UPDATE diagnoo_diagnostics SET status='running', current_step=?, progress_pct=?, updated_at=datetime('now') WHERE id=?",
  ).bind(step, pct, id).run();
}

export async function markFailed(db: D1Database, id: string, reason: string): Promise<void> {
  await db.prepare(
    "UPDATE diagnoo_diagnostics SET status='failed', fail_reason=?, updated_at=datetime('now') WHERE id=?",
  ).bind(reason, id).run();
}

export async function saveReport(db: D1Database, id: string, report: DiagnooReport): Promise<void> {
  await db.prepare(
    "UPDATE diagnoo_diagnostics SET status='completed', progress_pct=100, report_json=?, updated_at=datetime('now') WHERE id=?",
  ).bind(JSON.stringify(report), id).run();
}

export async function getDiagnostic(db: D1Database, id: string): Promise<DiagnosticRow | null> {
  const row = await db.prepare("SELECT * FROM diagnoo_diagnostics WHERE id = ? LIMIT 1").bind(id).first();
  return row ? toRow(row as Raw) : null;
}

/**
 * HER kilit açma kendi satırını ve kendi token'ını alır (0006). E-posta bir
 * kimlik DEĞİL: aynı adresle gelen ikinci ziyaretçinin ilkinin token'ını
 * yeniden yazması, hem A'nın çerezini düşürür hem A'nın kendi rakamlarıyla
 * hesaplanmış raporunu B'ye açardı. Tekrar eden e-posta yalnızca satış
 * bildirimini bastırır (`hasLeadForEmail`), kilidi devretmez.
 */
export async function createLead(
  db: D1Database,
  input: { id: string; diagnosticId: string; email: string; company: string; fullName: string | null;
    knownMetrics: KnownMetrics | null; clientIpHash: string; unlockToken: string },
): Promise<void> {
  await db.prepare(
    `INSERT INTO diagnoo_leads (id, diagnostic_id, email, company, full_name, kvkk_consent, known_metrics_json, client_ip_hash, unlock_token)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)`,
  ).bind(
    input.id, input.diagnosticId, normalizeEmail(input.email), input.company,
    input.fullName, input.knownMetrics ? JSON.stringify(input.knownMetrics) : null,
    input.clientIpHash, input.unlockToken,
  ).run();
}

/** E-posta tek biçimde saklanır — arama da aynı biçimde yapılmak zorunda. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Bu teşhis için bu adrese daha önce bir lead yazıldı mı. TEK kullanımı satış
 * bildirimini tekrarlamamak; kilit kararı buradan ÇIKMAZ (kilit `unlock_token`
 * ile ziyaretçiye bağlı, bkz. `findLeadByToken`).
 */
export async function hasLeadForEmail(
  db: D1Database, diagnosticId: string, email: string,
): Promise<boolean> {
  const row = await db.prepare(
    "SELECT id FROM diagnoo_leads WHERE diagnostic_id = ? AND email = ? LIMIT 1",
  ).bind(diagnosticId, normalizeEmail(email)).first();
  return row != null;
}

/** Lead satırının kilit görünümü: kim olduğu ve varsa kendine özel raporu. */
export type LeadUnlock = {
  id: string;
  email: string;
  recomputedReport: DiagnooReport | null;
};

function toLeadUnlock(r: { id: string; email: string; recomputed_report_json: string | null }): LeadUnlock {
  let recomputedReport: DiagnooReport | null = null;
  if (r.recomputed_report_json) {
    const parsed = DiagnooReportSchema.safeParse(JSON.parse(r.recomputed_report_json));
    recomputedReport = parsed.success ? parsed.data : null;
  }
  return { id: r.id, email: r.email, recomputedReport };
}

/**
 * Kilidin TEK doğrulama noktası: ziyaretçinin çerezindeki token bu teşhisin
 * bir lead satırına aitse kilit açıktır. `hasLead` (teşhis bazlı) kapı olarak
 * KULLANILMAZ — bir ziyaretçinin açtığı kilit diğerine geçmemeli (C1).
 * Boş token hiçbir satırla eşleşmemeli: 0005 öncesi satırlarda `unlock_token`
 * NULL, `= ''` karşılaştırması onları da tutmaz ama erken dönüş daha açık.
 */
export async function findLeadByToken(
  db: D1Database, diagnosticId: string, token: string,
): Promise<LeadUnlock | null> {
  if (!token) return null;
  const row = await db.prepare(
    `SELECT id, email, recomputed_report_json FROM diagnoo_leads
     WHERE diagnostic_id = ? AND unlock_token = ? LIMIT 1`,
  ).bind(diagnosticId, token).first();
  return row ? toLeadUnlock(row as { id: string; email: string; recomputed_report_json: string | null }) : null;
}

/**
 * Ziyaretçinin kendi metrikleriyle yeniden hesaplanan rapor LEAD satırına
 * yazılır. Paylaşılan `diagnoo_diagnostics.report_json`a yazmak, aynı teşhisi
 * gören diğer ziyaretçilere bu kişinin ticari verilerini gösterirdi.
 */
export async function saveLeadRecompute(
  db: D1Database, leadId: string, report: DiagnooReport,
): Promise<void> {
  await db.prepare("UPDATE diagnoo_leads SET recomputed_report_json = ? WHERE id = ?")
    .bind(JSON.stringify(report), leadId).run();
}

export async function hasLead(db: D1Database, diagnosticId: string): Promise<boolean> {
  const row = await db.prepare("SELECT id FROM diagnoo_leads WHERE diagnostic_id = ? LIMIT 1")
    .bind(diagnosticId).first();
  return row != null;
}

/** Unlock rotasının saatlik IP limiti (GEO `countLeadsSince` paritesi). */
export async function countLeadsSince(
  db: D1Database, ipHash: string, sinceIso: string,
): Promise<number> {
  const row = (await db.prepare(
    "SELECT COUNT(*) AS n FROM diagnoo_leads WHERE client_ip_hash = ? AND created_at >= ?",
  ).bind(ipHash, sinceIso).first()) as { n: number } | null;
  return row?.n ?? 0;
}

export async function countDiagnosticsSince(
  db: D1Database, ipHash: string | null, sinceIso: string,
): Promise<number> {
  const stmt = ipHash === null
    ? db.prepare("SELECT COUNT(*) AS n FROM diagnoo_diagnostics WHERE created_at >= ?").bind(sinceIso)
    : db.prepare("SELECT COUNT(*) AS n FROM diagnoo_diagnostics WHERE client_ip_hash = ? AND created_at >= ?").bind(ipHash, sinceIso);
  const row = (await stmt.first()) as { n: number } | null;
  return row?.n ?? 0;
}
