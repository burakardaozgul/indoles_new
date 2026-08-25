import type { AnalyticsEvent } from "./events";

/**
 * GA4 olay katmanı (ADR-021).
 *
 * Site tek analitik sağlayıcıya indi: `gtag` betiği `app/layout.tsx`'te
 * yükleniyor, buradaki yardımcılar onun üzerine yazıyor. `NEXT_PUBLIC_GA_ID`
 * yoksa betik hiç basılmaz; o durumda bu çağrılar sessizce düşer.
 *
 * GA4 olay adı kuralı: snake_case, ≤40 karakter, parametre adları ≤40 karakter.
 * Mevcut taksonomi (`events.ts`) zaten snake_case olduğu için ad dönüşümü yok.
 */

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

/** Serbest biçimli GA4 olayı — taksonomi dışı, sayfa içi etkileşimler için. */
export function gaEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (typeof window === "undefined") return;
  const g = (window as GtagWindow).gtag;
  if (typeof g !== "function") return;
  g("event", name, params ?? {});
}

/** Tipli taksonomi olayı (`events.ts`). */
export function track<E extends AnalyticsEvent>(event: E): void {
  gaEvent(event.name, event.properties as Record<string, string | number | boolean | undefined>);
}
