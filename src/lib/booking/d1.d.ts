/**
 * GEÇİCİ D1 tip tanımı — D1 binding'i eklenip gerçek tipler geldiğinde
 * BU DOSYANIN SİLİNMESİ ZORUNLUDUR.
 *
 * `@cloudflare/workers-types` henüz kurulu değil çünkü `wrangler.jsonc`'ye
 * D1 binding'i bu görevde eklenmedi (görev 2 kapsam kararı: veritabanı
 * henüz oluşturulamadı, bkz. gorev-2-report.md "ADIM 2 ATLANDI").
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
