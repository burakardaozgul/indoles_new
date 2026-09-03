import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDiagnooStatus } from "../use-diagnoo-status";

/**
 * `useDiagnooStatus` yoklama sözleşmesi — Görev 15.
 *
 * Üç durak noktası ölçülür: uç durum (`completed`/`failed`), 404 ve ardışık
 * ağ hatası. Yoklamanın DURMASI davranışın kendisidir — durmayan bir hook
 * kapanmış bir teşhis için sonsuza dek istek atar, bu da hem D1 hem
 * ziyaretçinin pili üzerinde ölçülür bir maliyettir.
 *
 * Sahte zamanlayıcı: gerçek 2 saniye beklenmez, `advanceTimersByTimeAsync`
 * hem `setInterval` tikini hem araya giren `fetch` promise'ini akıtır.
 */

const ID = "11111111-1111-4111-8111-111111111111";

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function runningBody() {
  return {
    status: "running",
    currentStep: "vision",
    progressPct: 55,
    failReason: null,
    snapshot: null,
    report: null,
    leadCaptured: false,
  };
}

function completedBody() {
  return {
    status: "completed",
    currentStep: "report",
    progressPct: 100,
    failReason: null,
    snapshot: { healthScore: 54, topGaps: [], opportunityRange: { low: 1, expected: 2, high: 3 }, benchmarks: [] },
    report: null,
    leadCaptured: false,
  };
}

/** İlk (anında) yoklamanın promise'ini akıtır — tik beklemeden. */
async function flush(): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

/** Bir yoklama aralığı kadar ilerletir ve gelen promise'i akıtır. */
async function tick(times = 1): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(2000 * times);
  });
}

describe("useDiagnooStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("running iken 2 saniyede bir yoklar, completed gelince durur", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(runningBody()))
      .mockResolvedValueOnce(jsonResponse(completedBody()));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDiagnooStatus(ID));

    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`/api/tools/diagnoo-status/${ID}`);
    expect(result.current.status).toBe("running");
    expect(result.current.currentStep).toBe("vision");
    expect(result.current.progressPct).toBe(55);

    await tick();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("completed");
    expect(result.current.snapshot?.healthScore).toBe(54);

    // Uç durumdan sonra hiçbir istek daha atılmaz.
    await tick(3);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("önceki yoklama sürerken sonraki tik yeni istek atmaz (inFlight bekçisi)", async () => {
    // Yavaş bir yanıt (kesintili ağ, soğuk Workflow) 2 saniyeden uzun
    // sürebilir; bekçi olmadan araya giren tik ikinci bir `fetch` başlatır —
    // aynı satır için çakışan iki okuma, hangi yanıtın önce döneceği
    // belirsiz bir durum yaratır.
    let resolveFirst!: (res: Response) => void;
    const pending = new Promise<Response>((resolve) => {
      resolveFirst = resolve;
    });
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(pending)
      .mockResolvedValue(jsonResponse(runningBody()));
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useDiagnooStatus(ID));

    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Bir yoklama aralığı daha geçer, ilk istek HÂLÂ yanıtlanmadı.
    await tick();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // İlk istek nihayet döner.
    await act(async () => {
      resolveFirst(jsonResponse(runningBody()));
      await vi.advanceTimersByTimeAsync(0);
    });

    // Artık bekçi kapalı — bir sonraki tik yeni isteği atabilir.
    await tick();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("404 gelince tek denemede durur ve durumu failed'e çeker", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: "not-found" }, 404));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDiagnooStatus(ID));

    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("failed");
    expect(result.current.failReason).toBe("not_found");

    await tick(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("üç ardışık ağ hatasından sonra yoklamayı bırakır", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDiagnooStatus(ID));

    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // İlk iki hatada yoklama sürer — geçici bir kesinti akışı bitirmemeli.
    expect(result.current.status).toBeNull();

    await tick();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await tick();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.current.status).toBe("failed");
    expect(result.current.failReason).toBe("network_error");

    await tick(3);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("araya giren başarılı yanıt hata sayacını sıfırlar", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(jsonResponse(runningBody()))
      .mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useDiagnooStatus(ID));

    await flush();
    await tick(2);
    expect(result.current.status).toBe("running");

    // Sayaç sıfırlandığı için üç yeni hata daha gerekir.
    await tick(2);
    expect(result.current.status).toBe("running");
    await tick();
    expect(result.current.status).toBe("failed");
  });

  it("id null iken hiç istek atmaz", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useDiagnooStatus(null));

    await flush();
    await tick(3);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("kimlik değişince önceki teşhisin durumunu devralmaz", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "not-found" }, 404))
      .mockResolvedValue(jsonResponse(runningBody()));
    vi.stubGlobal("fetch", fetchMock);

    const { result, rerender } = renderHook(({ id }) => useDiagnooStatus(id), {
      initialProps: { id: ID },
    });

    await flush();
    expect(result.current.status).toBe("failed");

    // Yeni tarama: eski "failed" ekranı bir an bile görünmemeli.
    rerender({ id: "22222222-2222-4222-8222-222222222222" });
    expect(result.current.status).toBeNull();
    expect(result.current.failReason).toBeNull();

    await flush();
    expect(result.current.status).toBe("running");
  });

  it("unmount sonrası aralığı temizler", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(runningBody()));
    vi.stubGlobal("fetch", fetchMock);

    const { unmount } = renderHook(() => useDiagnooStatus(ID));
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    unmount();
    await tick(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
