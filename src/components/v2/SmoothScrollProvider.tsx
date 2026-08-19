"use client";

import * as React from "react";
import { useLenis } from "@/lib/v2/use-lenis";

/**
 * Lenis + ScrollTrigger'ı kurar ve alt ağaca hazır olduğunu bildirir.
 * Tek bir yerde mount edilir; bölümler kendi Lenis örneğini kurmaz.
 */
const Ctx = React.createContext<{ reduced: boolean; ready: boolean }>({
  reduced: false,
  ready: false,
});

export function useSmoothScroll() {
  return React.useContext(Ctx);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const value = useLenis();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
