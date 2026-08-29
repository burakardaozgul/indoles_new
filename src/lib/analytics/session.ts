/**
 * Ziyaretçi oturum kimliği — `brief_submitted` olayının `briefId`'si.
 *
 * Önceden `EntryPopup` içinde özel (private) bir fonksiyondu. Görev 10'da
 * `/iletisim`in gömülü rezervasyon yüzeyi (`ContactBookingScreen`) aynı
 * `brief_submitted` olayını aynı anlamla ateşlemesi gerekince buraya taşındı:
 * iki kopya aynı `sessionStorage` anahtarını farklı yerlerde üretirse ileride
 * biri değişip öbürü unutulabilir (spec'in "ayrı bir arayüz yazılmaz" ilkesiyle
 * aynı gerekçe — paylaşılan davranış tek yerde yaşar). Sunucu tarafında kalıcı
 * DB olmadığı için (ADR-010) bu, bir oturumu benzersiz etiketleyen tek kimlik.
 */
export function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let v = window.sessionStorage.getItem("indoles_session_id");
  if (!v) {
    v = typeof crypto !== "undefined" && crypto.randomUUID
      ? `sess_${crypto.randomUUID()}`
      : `sess_${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem("indoles_session_id", v);
  }
  return v;
}
