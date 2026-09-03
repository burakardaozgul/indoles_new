// better-sqlite3'ü D1Database arayüzüne saran test adaptörü (booking test kalıbından).
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";

export function d1(db: Database.Database): D1Database {
  return {
    prepare(query: string) {
      const stmt = db.prepare(query);
      let params: unknown[] = [];
      const api = {
        bind(...args: unknown[]) { params = args; return api; },
        async first() { return stmt.get(...params) ?? null; },
        async run() { stmt.run(...params); return { success: true }; },
        async all() { return { results: stmt.all(...params) }; },
      };
      return api;
    },
  } as unknown as D1Database;
}

export function freshDiagnooDb(): D1Database {
  const raw = new Database(":memory:");
  raw.exec(readFileSync("migrations/0003_tool_scans.sql", "utf8"));
  raw.exec(readFileSync("migrations/0004_diagnoo.sql", "utf8"));
  // 0005 kilidi ziyaretçiye bağlar (unlock_token, lead bazlı recompute) —
  // rota testleri kilit izolasyonunu ancak bu şemayla doğrulayabilir.
  raw.exec(readFileSync("migrations/0005_diagnoo_lead_scope.sql", "utf8"));
  // 0006 her unlock'a kendi lead satırını verir: e-posta benzersizliği kalkar,
  // token yeniden yazılmaz (kilit düşürme ve rapor sızıntısı kapanır).
  raw.exec(readFileSync("migrations/0006_diagnoo_lead_per_unlock.sql", "utf8"));
  return d1(raw);
}
