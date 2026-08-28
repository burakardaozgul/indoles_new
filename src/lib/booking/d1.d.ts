/**
 * Geçici D1 tip tanımı.
 *
 * `@cloudflare/workers-types` henüz kurulu değil çünkü `wrangler.jsonc`'ye
 * D1 binding'i bu görevde eklenmedi (görev 2 kapsam kararı: veritabanı
 * henüz oluşturulamadı, bkz. gorev-2-report.md "ADIM 2 ATLANDI"). Binding
 * gerçek veritabanıyla eklendiğinde bu paket kurulacak; TypeScript arayüz
 * birleştirmesi (declaration merging) sayesinde bu ambient tanım ile paketin
 * kendi tanımı çakışmaz, bu dosya o noktada kaldırılabilir.
 *
 * Şekil, repository.ts ve testteki better-sqlite3 adaptörünün kullandığı
 * dört metotla sınırlı — D1'in gerçek arayüzünün tam kopyası değil.
 */
declare global {
  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
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
