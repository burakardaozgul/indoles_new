/**
 * Locale bazlı ödeme sağlayıcı yönlendirmesi.
 * TR kullanıcılar → iyzico (TRY), diğerleri → Stripe (EUR/USD).
 * Detay: docs/05-tech-architecture.md §4.9.
 */

export type Provider = "stripe" | "iyzico";

export function pickProvider(locale: "tr" | "en"): Provider {
  return locale === "tr" ? "iyzico" : "stripe";
}

export function pickCurrency(locale: "tr" | "en"): "TRY" | "EUR" {
  return locale === "tr" ? "TRY" : "EUR";
}
