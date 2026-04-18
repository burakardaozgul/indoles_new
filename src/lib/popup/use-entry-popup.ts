import { readPopupCookie } from "./cookie";

export function readCurrentPersona() {
  return readPopupCookie()?.persona ?? null;
}
