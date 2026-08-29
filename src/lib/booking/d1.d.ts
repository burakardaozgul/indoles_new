/**
 * GEÇİCİ D1 tip tanımı — gerçek Workers tipleri depoya girdiğinde
 * BU DOSYANIN SİLİNMESİ ZORUNLUDUR.
 *
 * D1 binding'i 2026-08-29'da `wrangler.jsonc`'ye eklendi, ama gerçek tipler
 * HÂLÂ YOK: `pnpm cf:typegen` üretilen `cloudflare-env.d.ts` mevcut dört test
 * dosyasında typecheck hatası doğurduğu için bilinçli çalıştırılmıyor (Görev 4
 * ruling'i). Yani silme koşulu artık "binding eklenince" değil,
 * "`@cloudflare/workers-types` kurulunca veya typegen çıktısı depoya girince".
 *
 * "Sessizce birleşir" varsayımı YANLIŞ: TypeScript arayüz birleştirmesi
 * (declaration merging) aynı adlı bir property'nin iki bildiriminin
 * TIPÇE BİREBİR aynı olmasını şart koşar — yalnız üye eklemeye izin veren
 * bir "genişletme" değildir. Örneğin buradaki `D1Result.success: boolean`
 * gerçek pakette `success: true` (literal tip) olarak tanımlıysa, paket
 * kurulduğunda bu iki bildirim ÇAKIŞIR ve derleme kırılır — sessiz bir
 * birleşme olmaz. Dolayısıyla binding eklendiği anda bu dosya kaldırılmalı,
 * "zamanla kendiliğinden uyumlu hale gelir" diye bırakılmamalı.
 *
 * Şekil, repository.ts ve testteki better-sqlite3 adaptörünün kullandığı
 * dört metotla sınırlı — D1'in gerçek arayüzünün tam kopyası değil.
 */
declare global {
  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    // `run()`'ın UPDATE/DELETE'te kaç satır etkilediğini görmek için şart:
    // SQLite eşleşme bulamayınca hata fırlatmaz, sessizce 0 satır günceller.
    meta?: { changes: number };
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run<T = unknown>(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }
}

export {};
