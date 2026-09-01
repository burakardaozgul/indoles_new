import { describe, it, expect, beforeEach } from "vitest";
import {
  createDiagnostic, findFreshCompleted, setProgress, saveReport, getDiagnostic,
  createLead, hasLead, countDiagnosticsSince, markFailed, sqliteTimestamp,
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

  it("lead: ikinci kayıt duplicate döner, hasLead true olur", async () => {
    await createDiagnostic(db, { id: "d1", ...base });
    const input = { id: "l1", diagnosticId: "d1", email: "cmo@firma.com", company: "Firma",
      fullName: null, knownMetrics: null, clientIpHash: "h1" };
    expect(await createLead(db, input)).toEqual({ ok: true });
    expect(await createLead(db, { ...input, id: "l2" })).toEqual({ ok: false, reason: "duplicate" });
    expect(await hasLead(db, "d1")).toBe(true);
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
