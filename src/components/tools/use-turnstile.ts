"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Görünmez Turnstile widget'ının paylaşılan yaşam döngüsü.
 *
 * Mantık `GeoScanForm`den ÇIKARILDI, değiştirilmedi (Görev 15): üçüncü araç
 * formu (`DiagnooForm`, `DiagnooUnlockForm`) aynı 90 satırı dördüncü kez
 * kopyalamak yerine buradan okur. Davranış sözleşmesi birebir korunur —
 * sabitler, yoklama sınırı, süre bekçisi ve token'ın tek kullanımlık oluşu
 * dahil.
 *
 * Neden yoklama: Turnstile betiği `next/script` ile geç yüklenir; bileşen
 * mount olduğunda `window.turnstile` henüz tanımlı olmayabilir. Kısa aralıkla
 * 60 kez denenir (18 saniye), sonra yüklenemedi kabul edilir.
 *
 * Neden süre bekçisi: widget render edildiği hâlde token üretmezse (ağ,
 * challenge sunucusu) ziyaretçi süresiz bekler. 25 saniyede durum
 * `unavailable`e döner, form bunu görünür bir açıklamaya çevirir.
 */

/**
 * Site anahtarı build'de yoksa widget hiç render edilmez (geliştirme ortamı).
 * Üretimde anahtar `wrangler secret` ile girilidir. Araç rotalarında Turnstile
 * KOŞULSUZ zorunludur (ADR-028 bayrağı bu rotaları kapsamaz) — bu bayrak
 * yalnız istemci tarafındaki render kararıdır.
 */
export const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

const TURNSTILE_POLL_MS = 300;
const TURNSTILE_POLL_LIMIT = 60;
const TURNSTILE_TOKEN_TIMEOUT_MS = 25_000;

type TurnstileApi = {
  render: (
    el: Element,
    opts: {
      sitekey: string | undefined;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string | undefined;
  reset?: (widgetId?: string) => void;
};

function turnstileApi(): TurnstileApi | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

export type TurnstileError = "loading" | "unavailable" | null;

export type UseTurnstileToken = {
  /** Tek kullanımlık token; boşken gönderim kilitlenmelidir. */
  token: string;
  /** Widget'ın basılacağı kap — `<div ref={containerRef} className="cf-turnstile" />`. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Başarısız denemeden sonra token'ı düşürüp yeni challenge ister. */
  reset: () => void;
  /**
   * `null` sorun yok demek. `loading` token henüz gelmedi, `unavailable`
   * widget yüklenemedi veya süre doldu — çağıran bunu kendi metnine çevirir.
   */
  error: TurnstileError;
};

export function useTurnstileToken({ enabled }: { enabled: boolean }): UseTurnstileToken {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"pending" | "ready" | "unavailable">(
    enabled ? "pending" : "ready",
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let attempts = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = (): void => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const tryRender = (): boolean => {
      if (renderedRef.current) return true;
      const api = turnstileApi();
      const el = containerRef.current;
      if (!api || !el) return false;
      renderedRef.current = true;
      widgetIdRef.current = api.render(el, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (next: string) => {
          setToken(next);
          setStatus("ready");
        },
        "expired-callback": () => {
          setToken("");
          setStatus("pending");
          try {
            turnstileApi()?.reset?.(widgetIdRef.current);
          } catch {
            /* widget kaldırılmış olabilir */
          }
        },
        "error-callback": () => {
          setToken("");
          setStatus("unavailable");
        },
      });
      return true;
    };

    if (!tryRender()) {
      timer = setInterval(() => {
        attempts += 1;
        if (tryRender()) {
          stop();
          return;
        }
        if (attempts >= TURNSTILE_POLL_LIMIT) {
          stop();
          setStatus("unavailable");
        }
      }, TURNSTILE_POLL_MS);
    }

    return stop;
  }, [enabled]);

  // Bekçi: token `pending`de takılırsa ziyaretçiyi süresiz bekletme.
  useEffect(() => {
    if (status !== "pending") return;
    const id = setTimeout(() => {
      setStatus((cur) => (cur === "pending" ? "unavailable" : cur));
    }, TURNSTILE_TOKEN_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [status]);

  function reset(): void {
    if (!enabled) return;
    setToken("");
    setStatus("pending");
    try {
      turnstileApi()?.reset?.(widgetIdRef.current);
    } catch {
      /* reset yoksa yeni token beklenir */
    }
  }

  let error: TurnstileError = null;
  if (enabled) {
    if (status === "unavailable") error = "unavailable";
    else if (token === "") error = "loading";
  }

  return { token, containerRef, reset, error };
}
