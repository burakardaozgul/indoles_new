/**
 * KVKK: ham IP asla saklanmaz. WebCrypto (`crypto.subtle.digest`) —
 * Cloudflare Workers runtime'ında yerleşik, ek bağımlılık gerektirmez
 * (global constraints: yeni npm bağımlılığı yok). Tuz olmadan hash'ten IP'ye
 * geri dönüş yok; aynı (ip, tuz) çifti her zaman aynı hash'i üretir
 * (deterministik) — hız sayacının aynı istemciyi tanıması bu özelliğe
 * dayanır.
 *
 * GEO ve Diagnoo araçlarının PAYLAŞTIĞI tek yardımcı — GEO `repository.ts`
 * bu dosyayı yeniden export eder, gövde burada tek yerde yaşar.
 *
 * `ip` ve `salt` bir ayraçla (`:`) birleştirilir (GEO final review
 * sertleştirmesi, entegrasyonda buraya taşındı): ayraçsız `ip + salt` iki
 * farklı girdinin aynı dizgeye daraldığı bir sınır belirsizliği bırakıyordu
 * (ör. ip `"1.2.3.4"` + salt `"5"` ile ip `"1.2.3.45"` + boş salt aynı bayt
 * dizisini üretirdi). NOT: bu mevcut hash'leri değiştirir — henüz gerçek
 * trafik yok, geri dönüşü olmayan pencere şimdi.
 */
export async function hashClientIp(ip: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip + ":" + salt);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
