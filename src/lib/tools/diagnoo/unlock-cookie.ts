/**
 * Diagnoo kilit çerezi — ziyaretçiyi tanıyan tek yüzey.
 *
 * NEDEN ÇEREZ, NEDEN URL DEĞİL: teşhis kimliği paylaşılabilir bir adrestir
 * (rapor sayfası bağlantısı) ve maliyet koruması aynı URL'nin teşhisini 24
 * saat boyunca yeniden kullanır. Token adrese girseydi, bağlantıyı alan
 * herkes lead sahibinin ticari verilerini görürdü. `HttpOnly` çerez ise
 * yalnız kilidi açan tarayıcıda kalır ve JavaScript'ten okunamaz.
 *
 * Çerez adı teşhis başına ayrıdır: bir ziyaretçi birden çok mağaza taratmış
 * olabilir, tek bir "diagnoo_unlock" çerezi sonuncusu dışındaki kilitleri
 * sessizce kapatırdı.
 */

/** 30 gün — rapor bağlantısını sonradan açan ziyaretçi kilidini kaybetmesin. */
export const UNLOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function unlockCookieName(diagnosticId: string): string {
  return `diagnoo_unlock_${diagnosticId}`;
}

/**
 * Ham `Cookie` başlığından bu teşhisin token'ını okur. Regex kurmak yerine
 * elle ayrıştırılır: teşhis kimliği URL'den geliyor, regex'e gömülen bir
 * kimlik desen enjeksiyonuna açık olurdu. Token yoksa boş dize döner ve
 * çağıran kilidi kapalı sayar.
 *
 * `decodeURIComponent` tek başına yüzde işaretini (`%`) geçerli bir URI
 * kodlaması sayan her değerde `URIError` fırlatır — bozuk/kırpılmış bir çerez
 * (elle düzenleme, eski istemci sürümü) burada yakalanmazsa istek 500 ile
 * patlar. `null` dönüşü çağırana "kilit yok" ile "çerez bozuk" arasında ayrım
 * yapma imkânı bırakır; bugünkü tek çağıran (durum rotası) ikisini de aynı
 * şekilde ele alır (kilit kapalı sayılır).
 */
export function readUnlockToken(cookieHeader: string | null, diagnosticId: string): string | null {
  if (!cookieHeader) return "";
  const name = unlockCookieName(diagnosticId);
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(eq + 1).trim());
    } catch {
      return null;
    }
  }
  return "";
}
