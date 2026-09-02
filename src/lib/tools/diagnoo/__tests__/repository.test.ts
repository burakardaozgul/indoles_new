import { describe, it, expect, beforeEach } from "vitest";
import {
  createDiagnostic, findFreshCompleted, setProgress, saveReport, getDiagnostic,
  createLead, hasLead, countDiagnosticsSince, markFailed, sqliteTimestamp,
  findLeadByToken, saveLeadRecompute, setLeadUnlockToken, countLeadsSince,
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

  it("lead: aynı e-posta ikinci kez duplicate döner, hasLead true olur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "cmo@firma.com", company: "Firma",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "t1" };
    expect(await createLead(db, input)).toEqual({ ok: true });
    expect(await createLead(db, { ...input, id: "l2", unlockToken: "t2" }))
      .toEqual({ ok: false, reason: "duplicate" });
    expect(await hasLead(db, "d1")).toBe(true);
  });

  it("lead: farklı e-posta aynı teşhiste kendi satırını ve token'ını alır", async () => {
    // 0005 sonrası benzersizlik (teşhis, e-posta) çifti — iki ayrı ziyaretçi
    // aynı teşhiste yan yana var olabilir, kilitleri birbirine karışmaz.
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "a@firma.com", company: "A",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "token-a" };
    expect(await createLead(db, input)).toEqual({ ok: true });
    expect(await createLead(db, { ...input, id: "l2", email: "b@firma.com", unlockToken: "token-b" }))
      .toEqual({ ok: true });

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

  it("setLeadUnlockToken: mevcut lead'e yeni token yazar ve kayıtlı raporu döner", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    await createLead(db, { id: "l1", diagnosticId: "d1", email: "a@firma.com", company: "A",
      fullName: null, knownMetrics: null, clientIpHash: "h1", unlockToken: "token-a" });
    await saveLeadRecompute(db, "l1", { ...sampleReport(), healthScore: 77 });

    const updated = await setLeadUnlockToken(db, "d1", "A@Firma.com", "token-yeni");
    expect(updated?.id).toBe("l1");
    expect(updated?.recomputedReport?.healthScore).toBe(77);
    expect(await findLeadByToken(db, "d1", "token-yeni")).not.toBeNull();
    expect(await findLeadByToken(db, "d1", "token-a")).toBeNull();
    expect(await setLeadUnlockToken(db, "d1", "yok@firma.com", "t")).toBeNull();
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
