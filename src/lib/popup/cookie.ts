import type { PopupCookieState } from "./types";

export const POPUP_COOKIE_NAME = "indoles_popup_state";
const COMPLETED_TTL_MS = 180 * 24 * 60 * 60 * 1000; // 6 ay
const DISMISSED_TTL_MS = 30 * 24 * 60 * 60 * 1000;  // 30 gün

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
