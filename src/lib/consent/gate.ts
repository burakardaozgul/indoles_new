import { readConsentCookie, readRegionCookie } from "./cookie";

/**
 * Çerez şeridi karar bekliyorken `window`a düşen olay.
 *
 * Sabit `lib` katmanında durur, şerit bileşeninde değil: onu bekleyen taraf
 * (`PopupProvider`) da, yayan taraf (`ConsentBanner`) da buradan okur.
 * Bileşende dursaydı `lib` → `components` bağımlılığı doğardı.
 */
export const CONSENT_RESOLVED_EVENT = "indoles:consent-resolved";

/** Şerit şu anda ekranda mı — yani ziyaretçi henüz karar vermedi mi? */
export function isConsentPending(): boolean {
  return readRegionCookie() === "eea" && readConsentCookie() === null;
}

/**
 * İşi çerez kararı verildikten sonra çalıştırır; karar gerekmiyorsa hemen.
 *
 * Giriş popup'ı ile çerez şeridi aynı anda görünürse ziyaretçi iki katmanlı
 * bir engelle karşılaşır ve ikisini birden kapatır — hem onay hem lead
 * kaybedilir. Sıra: önce şerit, karar verilince popup zamanlayıcısı başlar.
 *
 * Dönen fonksiyon dinleyiciyi söker; React effect temizliğinde çağrılmalı.
 */
export function whenConsentResolved(run: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (!isConsentPending()) {
    run();
    return () => {};
  }

  const handler = () => run();
  window.addEventListener(CONSENT_RESOLVED_EVENT, handler, { once: true });
  return () => window.removeEventListener(CONSENT_RESOLVED_EVENT, handler);
}
