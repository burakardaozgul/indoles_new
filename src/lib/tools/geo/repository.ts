/**
 * GEO araç veri erişimi — tek arayüz (rezervasyon deposuyla AYNI desen,
 * `src/lib/booking/repository.ts`).
 *
 * Rezervasyon sisteminin kurduğu AYNI D1 veritabanını kullanır — bu görev
 * yalnız YENİ tablolar ekler (`migrations/0003_tool_scans.sql`), mevcut
 * `bookings` tablosuna ve migration'larına dokunmaz.
 *
 * KVKK: ham istemci IP'si HİÇBİR YERDE saklanmaz. `hashClientIp` ile
 * SHA-256(ip + gizli tuz) hex'i hesaplanır, yalnız bu hash `client_ip_hash`
 * sütununa yazılır — tuz olmadan hash'ten IP'ye geri dönülemez, aynı IP'nin
 * hız sayacında/tekrarında tanınmasını sağlar (spec).
 *
 * `D1Database` global tip tanımı `src/lib/booking/d1.d.ts`'ten geliyor —
 * o dosya kaldırılana kadar (gerçek Workers tipleri depoya girene kadar,
 * bkz. dosyanın kendi başlık yorumu) burada AYNI global arayüz kullanılır,
 * ikinci bir bildirim EKLENMEZ.
 */

import type { GeoBand, GeoCheckResult } from "@/lib/tools/geo/types";

type Raw = Record<string, unknown>;

type InsertScanInput = {
  id: string;
  url: string;
  totalScore: number;
  band: string;
  checksJson: string;
  clientIpHash: string;
};

type ScanRecord = {
  url: string;
  totalScore: number;
  band: GeoBand;
  checks: GeoCheckResult[];
  scannedAt: string;
};

type InsertLeadInput = {
  scanId: string;
  email: string;
  clientIpHash: string;
};

export async function insertScan(db: D1Database, r: InsertScanInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tool_scans (id, url, total_score, band, checks_json, client_ip_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(r.id, r.url, r.totalScore, r.band, r.checksJson, r.clientIpHash, new Date().toISOString())
    .run();
}

export async function getScan(db: D1Database, id: string): Promise<ScanRecord | null> {
  const row = await db.prepare("SELECT * FROM tool_scans WHERE id = ?").bind(id).first();
  if (!row) return null;
  const r = row as Raw;
  return {
    url: String(r.url),
    totalScore: Number(r.total_score),
    band: r.band as GeoBand,
    checks: JSON.parse(String(r.checks_json)) as GeoCheckResult[],
    scannedAt: String(r.created_at),
  };
}

/**
 * Rıza doğrulaması BURADA yapılmaz — çağıran (route/schema katmanı,
 * `z.literal(true)`) rızayı zaten zorunlu kılmış olmalı (spec, global
 * constraints). Bu fonksiyon çağrıldığı an rıza VERİLMİŞ kabul edilir,
 * bu yüzden `kvkk_consent = 1` SABİT değeri yazılır — migration'daki
 * `CHECK (kvkk_consent = 1)` kısıtıyla tutarlı, ikinci bir değere hiç
 * izin verilmiyor.
 */
export async function insertLead(db: D1Database, r: InsertLeadInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tool_leads (scan_id, email, kvkk_consent, client_ip_hash, created_at)
       VALUES (?, ?, 1, ?, ?)`,
    )
    .bind(r.scanId, r.email, r.clientIpHash, new Date().toISOString())
    .run();
}

/**
 * Hız sayacı — GEO araç taramaları. `ipHash === null` iken IP'den bağımsız
 * GLOBAL sayım döner (ör. site genelinde CPU bütçesini korumak için toplam
 * tarama tavanı); dolu bir hash iken yalnız o istemcinin taramaları sayılır
 * (kişi başı limit). `sinceIso` sayaç PENCERESİNİN alt sınırı — daha eski
 * satırlar sayılmaz.
 */
export async function countScansSince(db: D1Database, ipHash: string | null, sinceIso: string): Promise<number> {
  const row =
    ipHash === null
      ? await db
          .prepare("SELECT COUNT(*) as count FROM tool_scans WHERE created_at >= ?")
          .bind(sinceIso)
          .first<{ count: number }>()
      : await db
          .prepare("SELECT COUNT(*) as count FROM tool_scans WHERE client_ip_hash = ? AND created_at >= ?")
          .bind(ipHash, sinceIso)
          .first<{ count: number }>();
  return row ? Number(row.count) : 0;
}

/** Hız sayacı — lead formu gönderimleri, yalnız IP başına (global varyantı gerekmiyor). */
export async function countLeadsSince(db: D1Database, ipHash: string, sinceIso: string): Promise<number> {
  const row = await db
    .prepare("SELECT COUNT(*) as count FROM tool_leads WHERE client_ip_hash = ? AND created_at >= ?")
    .bind(ipHash, sinceIso)
    .first<{ count: number }>();
  return row ? Number(row.count) : 0;
}

/**
 * KVKK: ham IP asla saklanmaz. Gövde artık Diagnoo ile PAYLAŞILAN tek
 * yerde yaşıyor (`src/lib/tools/shared/ip-hash.ts`) — burada yalnız
 * yeniden export edilir, GEO rotaları/testleri değişmeden çalışmaya
 * devam eder.
 */
export { hashClientIp } from "../shared/ip-hash";
