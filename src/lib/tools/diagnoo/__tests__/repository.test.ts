import { describe, it, expect, beforeEach } from "vitest";
import {
  createDiagnostic, findFreshCompleted, setProgress, saveReport, getDiagnostic,
  createLead, countDiagnosticsSince, markFailed, sqliteTimestamp,
  findLeadByToken, saveLeadRecompute, hasLeadForEmail, countLeadsSince,
} from "../repository";
import { sampleReport } from "./fixtures";
import { freshDiagnooDb } from "./d1-helper";

let db: D1Database;
beforeEach(() => { db = freshDiagnooDb(); });
const base = { url: "https://a.com", locale: "tr" as const, clientIpHash: "h1" };

describe("diagnoo repository", () => {
  it("teşhis oluşturur ve okur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const row = await getDiagnostic(db, "d1");
    expect(row?.status).toBe("queued");
    expect(row?.report).toBeNull();
  });

  it("progress ve rapor yazımı", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await setProgress(db, "d1", "vision", 40);
    await saveReport(db, "d1", sampleReport());
    const row = await getDiagnostic(db, "d1");
    expect(row?.status).toBe("completed");
    expect(row?.progressPct).toBe(100);
    expect(row?.report?.healthScore).toBe(54);
  });

  it("markFailed durumu ve nedeni yazar", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await markFailed(db, "d1", "scrape_failed");
    const row = await getDiagnostic(db, "d1");
    expect(row?.status).toBe("failed");
    expect(row?.failReason).toBe("scrape_failed");
  });

  it("findFreshCompleted 24 saatlik tamamlanmış raporu bulur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await saveReport(db, "d1", sampleReport());
    expect(await findFreshCompleted(db, "https://a.com", 24)).not.toBeNull();
    expect(await findFreshCompleted(db, "https://baska.com", 24)).toBeNull();
  });

  it("lead: aynı e-posta ikinci kez de kendi satırını ve token'ını alır", async () => {
    // E-posta artık kimlik değil: iki ayrı kilit açma iki ayrı satır demek.
    // Token yeniden yazılsaydı ilk ziyaretçinin çerezi düşerdi (0006).
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "cmo@firma.com", company: "Firma",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "t1" };
    await createLead(db, input);
    await createLead(db, { ...input, id: "l2", unlockToken: "t2" });

    // İki token da AYRI AYRI geçerli — ilki düşmedi.
    expect((await findLeadByToken(db, "d1", "t1"))?.id).toBe("l1");
    expect((await findLeadByToken(db, "d1", "t2"))?.id).toBe("l2");
  });

  it("aynı e-posta için iki satır yan yana durur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "cmo@firma.com", company: "Firma",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "t1" };
    await createLead(db, input);
    await createLead(db, { ...input, id: "l2", unlockToken: "t2" });
    const rows = await db.prepare(
      "SELECT id FROM diagnoo_leads WHERE diagnostic_id = ? AND email = ?",
    ).bind("d1", "cmo@firma.com").all();
    expect(rows.results).toHaveLength(2);
  });

  it("hasLeadForEmail: e-postayı normalize ederek arar", async () => {
    // Satış bildiriminin tek kapısı bu: aynı adrese ikinci mail atılmamalı,
    // ama büyük harfli/boşluklu yazım aynı adresi farklı göstermemeli.
    await createDiagnostic(db, { id: "d1", ...base });
    expect(await hasLeadForEmail(db, "d1", "cmo@firma.com")).toBe(false);
    await createLead(db, { id: "l1", diagnosticId: "d1", email: "  CMO@Firma.com ",
      company: "Firma", fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "t1" });
    expect(await hasLeadForEmail(db, "d1", "cmo@firma.com")).toBe(true);
    expect(await hasLeadForEmail(db, "d1", "CMO@FIRMA.COM")).toBe(true);
    expect(await hasLeadForEmail(db, "d1", "baska@firma.com")).toBe(false);
    expect(await hasLeadForEmail(db, "d2", "cmo@firma.com")).toBe(false);
  });

  it("lead: farklı e-posta aynı teşhiste kendi satırını ve token'ını alır", async () => {
    // 0005 sonrası benzersizlik (teşhis, e-posta) çifti — iki ayrı ziyaretçi
    // aynı teşhiste yan yana var olabilir, kilitleri birbirine karışmaz.
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "a@firma.com", company: "A",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "token-a" };
    await createLead(db, input);
    await createLead(db, { ...input, id: "l2", email: "b@firma.com", unlockToken: "token-b" });

    const a = await findLeadByToken(db, "d1", "token-a");
    const b = await findLeadByToken(db, "d1", "token-b");
    expect(a?.email).toBe("a@firma.com");
    expect(b?.email).toBe("b@firma.com");
  });

  it("findLeadByToken: yanlış token, boş token ve başka teşhis null döner", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await createDiagnostic(db, { id: "d2", ...base, url: "https://b.com" });
    await createLead(db, { id: "l1", diagnosticId: "d1", email: "a@firma.com", company: "A",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "token-a" });

    expect(await findLeadByToken(db, "d1", "token-a")).not.toBeNull();
    expect(await findLeadByToken(db, "d1", "token-yanlis")).toBeNull();
    expect(await findLeadByToken(db, "d1", "")).toBeNull();
    expect(await findLeadByToken(db, "d2", "token-a")).toBeNull();
  });

  it("saveLeadRecompute: yeniden hesap lead satırında yaşar, teşhis satırı değişmez", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await saveReport(db, "d1", sampleReport());
    await createLead(db, { id: "l1", diagnosticId: "d1", email: "a@firma.com", company: "A",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "token-a" });

    const own = { ...sampleReport(), healthScore: 91 };
    await saveLeadRecompute(db, "l1", own);

    expect((await findLeadByToken(db, "d1", "token-a"))?.recomputedReport?.healthScore).toBe(91);
    // Paylaşılan satır dokunulmadan kalır — başka ziyaretçi 91'i görmez.
    expect((await getDiagnostic(db, "d1"))?.report?.healthScore).toBe(54);
  });

  it("ikinci lead'in recompute'u ilkininkini değiştirmez", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "a@firma.com", company: "A Firma",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "token-a" };
    await createLead(db, input);
    await saveLeadRecompute(db, "l1", { ...sampleReport(), healthScore: 77 });
    await createLead(db, { ...input, id: "l2", unlockToken: "token-b" });
    await saveLeadRecompute(db, "l2", { ...sampleReport(), healthScore: 12 });

    expect((await findLeadByToken(db, "d1", "token-a"))?.recomputedReport?.healthScore).toBe(77);
    expect((await findLeadByToken(db, "d1", "token-b"))?.recomputedReport?.healthScore).toBe(12);
  });

  it("countLeadsSince: IP bazlı saatlik sayım", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await createDiagnostic(db, { id: "d2", ...base, url: "https://b.com" });
    const mk = (id: string, diagnosticId: string, email: string, ipHash: string) =>
      createLead(db, { id, diagnosticId, email, company: "A", fullName: null,
        knownMetrics: null, clientIpHash: ipHash, unlockToken: `tok-${id}` });
    await mk("l1", "d1", "a@firma.com", "h1");
    await mk("l2", "d2", "a@firma.com", "h1");
    await mk("l3", "d1", "b@firma.com", "h2");

    const since = sqliteTimestamp(new Date(Date.now() - 3600 * 1000));
    expect(await countLeadsSince(db, "h1", since)).toBe(2);
    expect(await countLeadsSince(db, "h2", since)).toBe(1);
    expect(await countLeadsSince(db, "h1", sqliteTimestamp(new Date(Date.now() + 60_000)))).toBe(0);
  });

  it("countDiagnosticsSince: IP bazlı ve global sayım", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await createDiagnostic(db, { id: "d2", ...base, url: "https://b.com" });
    await createDiagnostic(db, { id: "d3", ...base, clientIpHash: "h2" });
    // D1'de created_at datetime('now') ile "YYYY-MM-DD HH:MM:SS" (UTC, "T" yok)
    // biçiminde yazılır; karşılaştırma değeri de aynı biçimde üretilmeli.
    const since = sqliteTimestamp(new Date(Date.now() - 24 * 3600 * 1000));
    expect(await countDiagnosticsSince(db, "h1", since)).toBe(2);
    expect(await countDiagnosticsSince(db, null, since)).toBe(3);
    expect(await countDiagnosticsSince(db, "h1", sqliteTimestamp(new Date(Date.now() + 60_000)))).toBe(0);
  });
});

describe("sqliteTimestamp", () => {
  it("ISO string'i D1'in datetime('now') biçimine çevirir", () => {
    expect(sqliteTimestamp(new Date("2026-09-01T20:14:05.123Z"))).toBe("2026-09-01 20:14:05");
  });
});

describe("0007 migration: idx_diagnoo_leads_ip", () => {
  it("client_ip_hash + created_at üzerinde indeks kurar (countLeadsSince tam tablo taraması yapmasın)", async () => {
    const row = await db.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_diagnoo_leads_ip'",
    ).first();
    expect(row).not.toBeNull();
  });
});
