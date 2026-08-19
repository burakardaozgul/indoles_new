import type { PopupCookieState } from "./types";

export const POPUP_COOKIE_NAME = "indoles_popup_state";
const COMPLETED_TTL_MS = 180 * 24 * 60 * 60 * 1000; // 6 ay
const DISMISSED_TTL_MS = 30 * 24 * 60 * 60 * 1000;  // 30 gün

/**
 * Okuma merceği — sayfadaki persona anahtarının yazdığı çerez.
 *
 * Popup çerezinden **ayrı** tutulur çünkü ikisi farklı şeyi kaydeder:
 * popup çerezi funnel durumudur (gösterildi mi, tamamlandı mı), bu çerez
 * yalnız "metni hangi gözle okuyorum" tercihidir. Anahtarı popup çerezine
 * yazsaydık, merceği çeviren ziyaretçi için `shouldShowPopup()` 30 gün boyunca
 * false dönerdi ve lead yakalama akışı sessizce kapanırdı.
 */
export const PERSONA_COOKIE_NAME = "indoles_persona";
const PERSONA_TTL_MS = 180 * 24 * 60 * 60 * 1000; // 6 ay

const PERSONA_VALUES = ["donusum-teknoloji", "buyume-pazarlar"] as const;
type PersonaCookieValue = (typeof PERSONA_VALUES)[number];

export function readPersonaCookie(): PersonaCookieValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^|; )${PERSONA_COOKIE_NAME}=([^;]+)`),
  );
  const raw = match?.[2] ? decodeURIComponent(match[2]) : null;
  return (PERSONA_VALUES as readonly string[]).includes(raw ?? "")
    ? (raw as PersonaCookieValue)
    : null;
}

export function writePersonaCookie(value: PersonaCookieValue): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + PERSONA_TTL_MS).toUTCString();
  document.cookie = `${PERSONA_COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function readPopupCookie(): PopupCookieState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|; )${POPUP_COOKIE_NAME}=([^;]+)`));
  if (!match || !match[2]) return null;
  try {
    const decoded = decodeURIComponent(match[2]);
    const parsed = JSON.parse(decoded) as PopupCookieState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writePopupCookie(state: PopupCookieState): void {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(JSON.stringify(state));
  const expires = new Date(state.expiresAt).toUTCString();
  document.cookie = `${POPUP_COOKIE_NAME}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
}

export function computeExpiresAt(outcome: PopupCookieState["outcome"], now: Date = new Date()): string {
  const ttl = outcome === "completed" ? COMPLETED_TTL_MS : DISMISSED_TTL_MS;
  return new Date(now.getTime() + ttl).toISOString();
}

export function shouldShowPopup(now: Date = new Date()): boolean {
  const state = readPopupCookie();
  if (!state) return true;
  return new Date(state.expiresAt).getTime() < now.getTime();
}
