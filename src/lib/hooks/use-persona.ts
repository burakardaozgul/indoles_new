"use client";

import { useState, useEffect } from "react";
import { readPopupCookie } from "@/lib/popup/cookie";
import type { Persona } from "@/lib/content/types";

export function usePersona(): Persona {
  const [persona, setPersona] = useState<Persona>("industrial");

  useEffect(() => {
    const state = readPopupCookie();
    if (state?.persona === "buyume-pazarlar") {
      setPersona("commerce");
    }
  }, []);

  return persona;
}
