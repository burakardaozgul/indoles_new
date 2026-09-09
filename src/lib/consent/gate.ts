import { readConsentCookie } from "./cookie";

/**
 * Çerez şeridi karar bekliyorken `window`a düşen olay.
 *
 * Sabit `lib` katmanında durur, şerit bileşeninde değil: onu bekleyen taraf
 * (`PopupProvider`) da, yayan taraf (`ConsentBanner`) da buradan okur.
 * Bileşende dursaydı `lib` → `components` bağımlılığı doğardı.
 */
export const CONSENT_RESOLVED_EVENT = "indoles:consent-resolved";

/**
 * Şerit şu anda ekranda mı — yani ziyaretçi henüz karar vermedi mi?
 *
 * ADR-033: bölge koşulu kaldırıldı. Önceden şerit yalnız EEA'da çıkıyordu
 * çünkü sorulan tek şey analitikti ve o Türkiye'de varsayılan açıktı.
 * Pazarlama çerezleri her yerde açık rıza istiyor (KVKK m.5), dolayısıyla
 * karar verilmemiş her ziyaretçiye şerit gösterilir. Bölge artık şeridin
 * görünürlüğünü değil, ne sorduğunu belirliyor.
 */
export function isConsentPending(): boolean {
  return readConsentCookie() === null;
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
