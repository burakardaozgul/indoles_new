import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import {
  insertScan, getScan, insertLead, countScansSince, countLeadsSince, hashClientIp,
} from "@/lib/tools/geo/repository";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * D1 SQLite üzerine kurulu; rezervasyon deposunun test yardımcısıyla
 * (`src/lib/booking/__tests__/repository.test.ts`) BİREBİR aynı desen —
 * better-sqlite3'ü D1 arayüzüne saran ince bir adaptör. GEO araçları
 * rezervasyonun kurduğu AYNI D1 veritabanını kullanır (yeni migration
 * dosyası ekler, mevcutlara dokunmaz), bu yüzden test DB'si de gerçek
 * `wrangler d1 migrations apply` gibi ÜÇ dosyayı da SIRAYLA uygular.
 */
function makeDb() {
  const sqlite = new Database(":memory:");
  sqlite.exec(readFileSync("migrations/0001_bookings.sql", "utf-8"));
  sqlite.exec(readFileSync("migrations/0002_completed_status.sql", "utf-8"));
  sqlite.exec(readFileSync("migrations/0003_tool_scans.sql", "utf-8"));
  return {
    prepare(sql: string) {
      const stmt = sqlite.prepare(sql);
      let bound: unknown[] = [];
      const api = {
        bind: (...args: unknown[]) => { bound = args; return api; },
        run: async () => {
          const info = stmt.run(...bound);
          return { success: true, meta: { changes: info.changes } };
        },
        first: async () => stmt.get(...bound) ?? null,
        all: async () => ({ results: stmt.all(...bound) }),
      };
      return api;
    },
  } as unknown as D1Database;
}

const checks: GeoCheckResult[] = [
  {
    id: "ai-access",
    score: 20,
    max: 20,
    status: "pass",
    summary: { tr: "robots.txt AI botlarını engellemiyor", en: "robots.txt does not block AI bots" },
    findings: [],
  },
];

describe("insertScan / getScan", () => {
  let db: D1Database;
  beforeEach(() => { db = makeDb(); });

  it("gidiş-dönüş: checks JSON parse edilmiş şekilde döner", async () => {
    await insertScan(db, {
      id: "scan_1",
      url: "https://example.com",
      totalScore: 72,
      band: "iyi",
      checksJson: JSON.stringify(checks),
      clientIpHash: "hash_abc",
    });

    const scan = await getScan(db, "scan_1");
    expect(scan).not.toBeNull();
    expect(scan?.url).toBe("https://example.com");
    expect(scan?.totalScore).toBe(72);
    expect(scan?.band).toBe("iyi");
    expect(scan?.checks).toEqual(checks);
    expect(typeof scan?.scannedAt).toBe("string");
    expect(scan?.scannedAt.length).toBeGreaterThan(0);
  });

  it("bilinmeyen id için null döner", async () => {
    expect(await getScan(db, "yok-boyle-bir-id")).toBeNull();
  });
});

describe("insertLead", () => {
  let db: D1Database;
  beforeEach(() => { db = makeDb(); });

  it("lead ekler ve hız sayacına yansır", async () => {
    await insertScan(db, {
      id: "scan_lead_1",
      url: "https://example.com",
      totalScore: 40,
      band: "gelismeye-acik",
      checksJson: JSON.stringify(checks),
      clientIpHash: "hash_lead",
    });
    await insertLead(db, { scanId: "scan_lead_1", email: "aday@example.com", clientIpHash: "hash_lead" });

    const count = await countLeadsSince(db, "hash_lead", "2000-01-01T00:00:00.000Z");
    expect(count).toBe(1);
  });
});

describe("countScansSince — hız sayacı penceresi", () => {
  let db: D1Database;
  beforeEach(() => {
    db = makeDb();
    vi.useFakeTimers();
  });
  afterEach(() => { vi.useRealTimers(); });

  it("pencere dışındaki taramayı saymaz", async () => {
    vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
    await insertScan(db, {
      id: "scan_eski", url: "https://a.com", totalScore: 10, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_x",
    });

    vi.setSystemTime(new Date("2026-09-01T10:00:00.000Z"));
    await insertScan(db, {
      id: "scan_yeni", url: "https://b.com", totalScore: 20, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_x",
    });

    // Pencere: son 30 dakika — yalnız "scan_yeni" bu pencerede.
    const count = await countScansSince(db, "hash_x", "2026-09-01T09:30:00.000Z");
    expect(count).toBe(1);
  });

  it("ipHash null → global sayım (tüm IP'ler)", async () => {
    vi.setSystemTime(new Date("2026-09-01T10:00:00.000Z"));
    await insertScan(db, {
      id: "scan_ip1", url: "https://a.com", totalScore: 10, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_ip1",
    });
    await insertScan(db, {
      id: "scan_ip2", url: "https://b.com", totalScore: 10, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_ip2",
    });

    const globalCount = await countScansSince(db, null, "2026-09-01T09:00:00.000Z");
    expect(globalCount).toBe(2);

    const perIpCount = await countScansSince(db, "hash_ip1", "2026-09-01T09:00:00.000Z");
    expect(perIpCount).toBe(1);
  });

  it("hiç tarama yoksa 0 döner", async () => {
    expect(await countScansSince(db, "hash_boş", "2000-01-01T00:00:00.000Z")).toBe(0);
    expect(await countScansSince(db, null, "2000-01-01T00:00:00.000Z")).toBe(0);
  });
});

describe("countLeadsSince — hız sayacı penceresi", () => {
  let db: D1Database;
  beforeEach(() => {
    db = makeDb();
    vi.useFakeTimers();
  });
  afterEach(() => { vi.useRealTimers(); });

  it("pencere dışındaki lead'i saymaz", async () => {
    vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
    await insertScan(db, {
      id: "scan_a", url: "https://a.com", totalScore: 10, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_lead2",
    });
    await insertLead(db, { scanId: "scan_a", email: "eski@example.com", clientIpHash: "hash_lead2" });

    vi.setSystemTime(new Date("2026-09-01T10:00:00.000Z"));
    await insertScan(db, {
      id: "scan_b", url: "https://b.com", totalScore: 10, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_lead2",
    });
    await insertLead(db, { scanId: "scan_b", email: "yeni@example.com", clientIpHash: "hash_lead2" });

    const count = await countLeadsSince(db, "hash_lead2", "2026-09-01T09:30:00.000Z");
    expect(count).toBe(1);
  });

  it("başka bir IP hash'in lead'ini saymaz", async () => {
    vi.setSystemTime(new Date("2026-09-01T10:00:00.000Z"));
    await insertScan(db, {
      id: "scan_c", url: "https://c.com", totalScore: 10, band: "zayif",
      checksJson: "[]", clientIpHash: "hash_c",
    });
    await insertLead(db, { scanId: "scan_c", email: "baska@example.com", clientIpHash: "hash_c" });

    expect(await countLeadsSince(db, "hash_baska_ip", "2026-09-01T09:00:00.000Z")).toBe(0);
  });
});

describe("hashClientIp", () => {
  it("aynı IP + tuz → deterministik aynı hash", async () => {
    const a = await hashClientIp("203.0.113.7", "gizli-tuz");
    const b = await hashClientIp("203.0.113.7", "gizli-tuz");
    expect(a).toBe(b);
  });

  it("tuz değişince hash değişir (tuz-duyarlı)", async () => {
    const a = await hashClientIp("203.0.113.7", "tuz-1");
    const b = await hashClientIp("203.0.113.7", "tuz-2");
    expect(a).not.toBe(b);
  });

  it("IP değişince hash değişir", async () => {
    const a = await hashClientIp("203.0.113.7", "gizli-tuz");
    const b = await hashClientIp("198.51.100.4", "gizli-tuz");
    expect(a).not.toBe(b);
  });

  it("SHA-256 hex çıktısı: 64 karakter, yalnız [0-9a-f]", async () => {
    const h = await hashClientIp("203.0.113.7", "gizli-tuz");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("KVKK: hash ham IP dizgesini alt dize olarak içermez", async () => {
    const ip = "203.0.113.7";
    const h = await hashClientIp(ip, "gizli-tuz");
    expect(h).not.toContain(ip);
  });
});
