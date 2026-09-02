/**
 * `findings` mail-kapısı ayrımı — TEK yerde tanımlı (Görev 12b brief).
 *
 * Ürün gereksinimi: ziyaretçi basit sonucu (skor + rozet + summary) mailsiz
 * görür; detaylı bulgular (`findings`) YALNIZ KVKK rızalı mail sonrası açılır.
 * D1'deki kayıt (ve `insertScan`'e giden `checksJson`) TAM findings taşımaya
 * devam eder — rapor maili onu kullanır. Bu fonksiyon yalnız İKİ HTTP/sayfa
 * yüzeyinin ("public" — geo-scan yanıtı, paylaşım sayfası prop'u) findings'i
 * asla sızdırmamasını garanti eder; katman burada AYRILDIĞI için iki route ve
 * bir sayfa bileşeni aynı stripleme mantığını tekrar yazmaz.
 *
 * Saf fonksiyon: girdiyi MUTASYONA UĞRATMAZ, her zaman yeni dizi/obje döner —
 * çağıranın elinde tuttuğu TAM kayıt (ör. rapor route'unun `getScan` sonucu)
 * bu çağrıdan etkilenmez.
 */
import type { GeoCheckResult } from "@/lib/tools/geo/types";

export function stripFindings(checks: GeoCheckResult[]): GeoCheckResult[] {
  return checks.map((check) => ({
    ...check,
    findings: [],
    findingsCount: check.findingsCount ?? check.findings.length,
  }));
}
