"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readPersonaCookie, readPopupCookie, writePersonaCookie } from "@/lib/popup/cookie";
import type { Persona } from "@/lib/content/types";
import type { PersonaSlug } from "@/lib/popup/types";

/** Popup persona slug'ı → içerik katmanının persona adı. */
export function toContentPersona(slug: PersonaSlug | null): Persona {
  return slug === "buyume-pazarlar" ? "commerce" : "industrial";
}

/**
 * Persona seçimi — modül seviyesinde paylaşılan, abone olunabilir durum.
 *
 * Önceden her tüketici kendi `useState`'inde cookie'yi okuyordu; bu, seçim
 * değiştiğinde diğer bileşenlerin haberdar olmamasını da beraberinde
 * getiriyordu. Sayfa içi persona anahtarı (`PersonaSwitch`) bunu zorunlu
 * kıldı: bir yerde çevrilen mercek, sayfadaki tüm persona-aware metinleri
 * aynı anda güncellemeli.
 *
 * Kaynak sırası: önce sayfadaki anahtar çerezi, sonra popup'ta yapılan seçim.
 * Anahtar her zaman son sözü söyler — ziyaretçi açıkça "bu gözle oku" demiştir.
 */
type Snapshot = { slug: PersonaSlug | null; ready: boolean };

const SERVER_SNAPSHOT: Snapshot = { slug: null, ready: false };
let snapshot: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (snapshot.ready) return;
  const slug = readPersonaCookie() ?? readPopupCookie()?.persona ?? null;
  snapshot = { slug, ready: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

/**
 * Persona'yı değiştirir: çereze yazar, kök elemandaki `data-persona`'yı
 * günceller (metinlerin görünürlüğünü CSS bundan okur) ve aboneleri uyandırır.
 */
export function setPersonaSlug(slug: PersonaSlug): void {
  writePersonaCookie(slug);
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-persona", toContentPersona(slug));
  }
  snapshot = { slug, ready: true };
  emit();
}

/**
 * `ready`, çerezin okunup okunmadığını söyler. Metin görünürlüğü buna
 * bağlı DEĞİLDİR — onu CSS + ilk boyamadan önce çalışan script çözer
 * (bkz. `components/marketing/persona-text.tsx`). Bayrak yalnız persona'yı
 * bilmesi gereken etkileşimli parçalar içindir: `PersonaSwitch`'in
 * `aria-pressed` değeri gibi.
 */
export function usePersonaState(): { persona: Persona; ready: boolean; slug: PersonaSlug | null } {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(hydrate, []);
  return { persona: toContentPersona(state.slug), ready: state.ready, slug: state.slug };
}

/** Sadece persona değeri gerektiğinde kısayol. */
export function usePersona(): Persona {
  return usePersonaState().persona;
}
