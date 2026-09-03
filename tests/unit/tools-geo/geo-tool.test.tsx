import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GeoTool } from "@/components/tools/geo-tool";
import { GEO_TOOL } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));
vi.mock("@/lib/v2/use-mouse", () => ({ usePrefersReducedMotion: () => true }));
vi.mock("@/lib/i18n/navigation", () => ({
  getPathname: ({ href, locale }: { href: string | { pathname: string; params: { id: string } }; locale: string }) =>
    typeof href === "string"
      ? `/${locale}/araclar/geo-gorunurluk-denetleyicisi`
      : `/${locale}/araclar/geo-gorunurluk-denetleyicisi/sonuc/${href.params.id}`,
}));
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
}));

const TOOL = GEO_TOOL;
const RESULT: GeoScanResult = {
  id: "scan-abc",
  url: "https://ornek.com.tr",
  totalScore: 72,
  band: "iyi",
  scannedAt: "2026-09-02T00:00:00.000Z",
  checks: TOOL.signals.map((s) => ({
    id: s.id, score: s.weight, max: s.weight, status: "pass" as const,
    summary: { tr: "özet", en: "summary" }, findings: [], findingsCount: 0,
  })),
};

async function submit(url = "https://ornek.com.tr") {
  fireEvent.change(screen.getByLabelText("Site adresi"), { target: { value: url } });
  // Süre tuzağı: ScanBar 2 sn'ye kadar bekler — sahte zamanlayıcı yok, mountedAt geri alınır
  await new Promise((r) => setTimeout(r, 0));
  fireEvent.submit(screen.getByRole("form"));
}

describe("GeoTool", () => {
  let replaceState: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    trackMock.mockReset();
    replaceState = vi.spyOn(window.history, "replaceState").mockImplementation(() => undefined);
    Element.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
  });
  afterEach(() => { vi.unstubAllGlobals(); replaceState.mockRestore(); });

  it("idle: tam olarak bir h1, kanıt şeridi ve giriş çubuğu", () => {
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("5 sinyal")).toBeInTheDocument();
    expect(screen.getByLabelText("Site adresi")).toBeInTheDocument();
    expect(screen.getByText(TOOL.inputHelp.tr)).toBeInTheDocument();
  });

  it("başarılı tarama: sahne → skor kartı, URL güncellenir, olaylar atılır, sayfa karta kayar", async () => {
    // `fetch` bilinçli olarak beklemede bırakılır: `phase` "scanning"de
    // asılı kalır, canlı bölgenin `stage.live` okuduğu an gözlemlenebilir
    // olur (spec §4 — aksi halde reduced-motion'da geçiş tek mikro-görevde
    // biter ve "Tarama sürüyor" hiç yakalanamaz).
    let resolveFetch!: (value: { ok: true; json: () => Promise<unknown> }) => void;
    const fetchPromise = new Promise<{ ok: true; json: () => Promise<unknown> }>((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(fetchPromise));
    const { container } = render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    const liveStatus = () => container.querySelector('p[role="status"].sr-only');
    // MIN_FILL_MS beklemesini atlamak için: gerçek zamanlayıcı ile 2 sn beklemek yerine
    // ScanBar'ın mountedAt'ı geçmişe alınamaz; bu yüzden waitFor uzun zaman aşımıyla bekler.
    await submit();
    await waitFor(() => expect(liveStatus()).toHaveTextContent("Tarama sürüyor"), { timeout: 4000 });
    resolveFetch({ ok: true, json: async () => ({ id: RESULT.id, result: RESULT }) });
    await waitFor(() => expect(screen.getByText("72", { selector: "[data-part='score']" })).toBeInTheDocument(), { timeout: 4000 });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(replaceState).toHaveBeenCalledWith(null, "", "/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/scan-abc");
    expect(trackMock).toHaveBeenCalledWith({ name: "tool_used", properties: { slug: "geo-gorunurluk-denetleyicisi", locale: "tr" } });
    expect(trackMock).toHaveBeenCalledWith({ name: "tool_scan_completed", properties: { slug: "geo-gorunurluk-denetleyicisi", band: "iyi", locale: "tr" } });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(screen.getByText("Düzeltme listesi")).toBeInTheDocument();
    expect(liveStatus()).toHaveTextContent("Tarama tamamlandı, skor 72");
    expect(document.activeElement).toBe(container.querySelector(".scroll-mt-36"));
  });

  it("target-blocked → engellenen site mesajı, giriş durumunda kalır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "target-blocked" }) }));
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    await submit();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("otomatik istekleri engelliyor"), { timeout: 4000 });
    expect(screen.getByLabelText("Site adresi")).toBeEnabled();
  });

  it("share modu: initialResult ile doğrudan skor kartı, 'Yeni tarama' araç sayfasına link", () => {
    render(<GeoTool locale="tr" tool={TOOL} mode="share" initialResult={RESULT} />);
    expect(screen.getByText("72", { selector: "[data-part='score']" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Yeni tarama" })).toHaveAttribute("href", "/tr/araclar/geo-gorunurluk-denetleyicisi");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("'Yeni tarama' düğmesi giriş durumuna döner ve URL'i araç sayfasına çeker", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: RESULT.id, result: RESULT }) }));
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    await submit();
    await waitFor(() => expect(screen.getByRole("button", { name: "Yeni tarama" })).toBeInTheDocument(), { timeout: 4000 });
    fireEvent.click(screen.getByRole("button", { name: "Yeni tarama" }));
    expect(screen.getByLabelText("Site adresi")).toHaveValue("");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/tr/araclar/geo-gorunurluk-denetleyicisi");
  });

  it("Faz 2 madde 5 — result fazında robots noindex,follow olur, 'Yeni tarama' ile eski değere döner", async () => {
    const existing = document.createElement("meta");
    existing.name = "robots";
    existing.content = "index, follow";
    document.head.appendChild(existing);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: RESULT.id, result: RESULT }) }));
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");

    await submit();
    await waitFor(() => expect(screen.getByText("72", { selector: "[data-part='score']" })).toBeInTheDocument(), { timeout: 4000 });
    // `RobotsMeta`nın DOM güncellemesi kendi (pasif) efektinde olur — skor
    // metninin göründüğü commit'le AYNI anda değil, hemen ardından flush
    // edilir; bu yüzden ayrı bir `waitFor` ile beklenir (yarış durumu).
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    });

    fireEvent.click(screen.getByRole("button", { name: "Yeni tarama" }));
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    });

    existing.remove();
  });

  it("Ruling R8 — StrictMode'da onResolved yan etkileri tam olarak bir kez tetiklenir", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: RESULT.id, result: RESULT }) }));
    render(
      <StrictMode>
        <GeoTool locale="tr" tool={TOOL} mode="tool" />
      </StrictMode>,
    );
    await submit();
    await waitFor(() => expect(screen.getByText("72", { selector: "[data-part='score']" })).toBeInTheDocument(), { timeout: 4000 });
    const completedCalls = trackMock.mock.calls.filter(([e]) => e.name === "tool_scan_completed");
    expect(completedCalls).toHaveLength(1);
    const sharePathCalls = replaceState.mock.calls.filter(
      ([, , url]) => url === "/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/scan-abc",
    );
    expect(sharePathCalls).toHaveLength(1);
  });
});
