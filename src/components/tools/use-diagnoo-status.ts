"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiagnooReport, SnapshotView } from "@/lib/tools/diagnoo/schema";

/**
 * Teşhis durumunun canlı yoklaması — `GET /api/tools/diagnoo-status/[id]`.
 *
 * Neden yoklama, neden akış (SSE/WebSocket) değil: teşhis Cloudflare
 * Workflows'ta koşuyor ve durumunu D1'e yazıyor; rota her istekte tek satır
 * okuyor. İki saniyede bir tek indeksli okuma, iki-dört dakikalık bir tarama
 * için en fazla ~120 sorgu demek — açık tutulan bir bağlantının Worker
 * bütçesinden ucuz.
 *
 * ÜÇ DURAK NOKTASI, hepsi kasıtlı:
 * - `completed` / `failed`: teşhis kapandı, yeni bilgi gelmeyecek.
 * - `404`: kayıt yok (silinmiş veya kimlik yanlış) — bir daha denemek
 *   aynı 404'ü döndürür, tekrar anlamsız.
 * - üç ARDIŞIK ağ hatası: tek bir kesinti akışı bitirmemeli, ama süresiz
 *   yeniden deneme de ziyaretçinin pilini boşaltır. Araya giren başarılı bir
 *   yanıt sayacı sıfırlar.
 *
 * Durdukta durum `failed`e çekilir ve `failReason` sebebi taşır — çağıran
 * bileşen "sürüyor" göstermeye devam edip ziyaretçiyi bekletmesin.
 *
 * `inFlight` BEKÇİSİ: bir yanıt 2 saniyeden uzun sürerse (yavaş ağ, soğuk
 * Workflow) araya giren tik yeni bir istek ATMAZ. Bekçi olmasaydı üst üste
 * binen iki `fetch` aynı satırı iki kez okur, hangi yanıtın önce döneceği
 * belirsizleşir ve daha ESKİ yanıt daha YENİsinin üzerine yazabilirdi.
 */

const POLL_MS = 2000;
const FAILURE_LIMIT = 3;

export type DiagnooStatusValue = "queued" | "running" | "completed" | "failed";

/** Rotanın 200 gövdesi (`StatusBody`, `diagnoo-status/[id]/route.ts`). */
type StatusBody = {
  status: DiagnooStatusValue;
  currentStep: string | null;
  progressPct: number;
  failReason: string | null;
  snapshot: SnapshotView | null;
  report: DiagnooReport | null;
  leadCaptured: boolean;
};

type StatusState = {
  /** Henüz ilk yanıt gelmediyse `null`. */
  status: DiagnooStatusValue | null;
  currentStep: string | null;
  progressPct: number;
  failReason: string | null;
  snapshot: SnapshotView | null;
  report: DiagnooReport | null;
  leadCaptured: boolean;
};

export type UseDiagnooStatus = StatusState & {
  /** Durmuş bir yoklamayı elle yeniden başlatır (ziyaretçi "tekrar dene" der). */
  refetch: () => void;
};

const INITIAL: StatusState = {
  status: null,
  currentStep: null,
  progressPct: 0,
  failReason: null,
  snapshot: null,
  report: null,
  leadCaptured: false,
};

export function useDiagnooStatus(id: string | null): UseDiagnooStatus {
  const [state, setState] = useState<StatusState>(INITIAL);
  // Yalnız `refetch` artırır; efekt bağımlılığı olarak yoklamayı yeniden kurar.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) return;

    // Yeni bir kimlik (veya elle yeniden deneme) ÖNCEKİ durumu devralmaz:
    // devralsaydı, başarısız bir taramadan sonra başlatılan yeni tarama ilk
    // yanıt gelene dek eski "failed" ekranını gösterirdi.
    setState(INITIAL);

    let cancelled = false;
    let failures = 0;
    let inFlight = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = (): void => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    /** Yoklamayı bitirir ve sebebi görünür kılar. */
    const giveUp = (reason: string): void => {
      stop();
      setState((cur) => ({ ...cur, status: "failed", failReason: reason }));
    };

    const poll = async (): Promise<void> => {
      // Önceki yoklama hâlâ sürüyorsa bu tik atlanır — üst üste binen iki
      // istek yerine bir sonraki tik yeni bir deneme başlatır.
      if (inFlight) return;
      inFlight = true;
      try {
        const res = await fetch(`/api/tools/diagnoo-status/${id}`);
        if (cancelled) return;

        if (res.status === 404) {
          giveUp("not_found");
          return;
        }
        if (!res.ok) {
          failures += 1;
          if (failures >= FAILURE_LIMIT) giveUp("network_error");
          return;
        }

        const body = (await res.json().catch(() => null)) as StatusBody | null;
        if (cancelled) return;
        if (!body) {
          // Gövdesiz/bozuk 200 de bir hatadır — sessizce "sürüyor" gösterip
          // ziyaretçiyi sonsuza dek bekletmek dürüst değil.
          failures += 1;
          if (failures >= FAILURE_LIMIT) giveUp("network_error");
          return;
        }

        failures = 0;
        setState({
          status: body.status,
          currentStep: body.currentStep,
          progressPct: body.progressPct,
          failReason: body.failReason,
          snapshot: body.snapshot,
          report: body.report,
          leadCaptured: body.leadCaptured,
        });
        if (body.status === "completed" || body.status === "failed") stop();
      } catch {
        if (cancelled) return;
        failures += 1;
        if (failures >= FAILURE_LIMIT) giveUp("network_error");
      } finally {
        inFlight = false;
      }
    };

    void poll();
    timer = setInterval(() => {
      void poll();
    }, POLL_MS);

    return () => {
      cancelled = true;
      stop();
    };
  }, [id, attempt]);

  // Durumu efekt kendisi sıfırlar; burada yalnız yeniden kurulum tetiklenir.
  const refetch = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, refetch };
}
