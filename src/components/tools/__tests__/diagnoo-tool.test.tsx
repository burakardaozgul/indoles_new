import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DiagnooTool } from "../diagnoo-tool";
import { getToolBySlug } from "@/lib/content/tools";
import { DIAGNOO_SLUG } from "@/lib/tools/diagnoo/signals";
import { toSnapshot } from "@/lib/tools/diagnoo/schema";
import { sampleReport } from "@/lib/tools/diagnoo/__tests__/fixtures";

/**
 * Durum makinesinin geçiş erişilebilirliği — Görev 15 düzeltme turu 1.
 *
 * Tarama bitince ekran tamamen değişiyor: ilerleme listesi (tek canlı bölge)
 * DOM'dan kalkıyor, yerine anlık görünüm geliyordu — ekran okuyucu bunu
 * SESSİZCE yaşıyordu (SC 4.1.3) ve odak `<body>`ye düşüyordu (SC 2.4.3).
 * İki mekanizma test ediliyor: kalıcı canlı bölgenin metni ve odağın yeni
 * başlığa taşınması.
 */
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

const TOOL = getToolBySlug(DIAGNOO_SLUG, "tr")!;
const ID = "11111111-1111-4111-8111-111111111111";
const REPORT = sampleReport();

function statusBody(over: Record<string, unknown> = {}) {
  return {
    status: "completed",
    currentStep: "report",
    progressPct: 100,
    failReason: null,
    snapshot: toSnapshot(REPORT),
    report: null,
    leadCaptured: false,
    ...over,
  };
}

/** Başlatma 202'si, ardından tek yoklama yanıtı. */
function mockFlow(status: Record<string, unknown>) {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, status: 202, json: async () => ({ id: ID, reused: false }) })
    .mockResolvedValue({ ok: true, status: 200, json: async () => status });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function startScan(): void {
  fireEvent.change(screen.getByLabelText("Mağazanızın adresi"), {
    target: { value: "https://ornek-magaza.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Taramayı başlat" }));
}

describe("DiagnooTool — geçişlerin erişilebilirliği", () => {
  beforeEach(() => {
    trackMock.mockReset();
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("kalıcı canlı bölge ilk render'da DOM'da ve sessiz", () => {
    mockFlow(statusBody());
    const { container } = render(<DiagnooTool locale="tr" tool={TOOL} />);

    const live = container.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live).toHaveTextContent("");
  });

  it("tarama tamamlanınca canlı bölge durumu duyurur (SC 4.1.3)", async () => {
    mockFlow(statusBody());
    const { container } = render(<DiagnooTool locale="tr" tool={TOOL} />);
    const live = container.querySelector('[aria-live="polite"]');

    startScan();

    await waitFor(() => {
      expect(live).toHaveTextContent("Tarama tamamlandı. Anlık görünüm hazır.");
    });
  });

  it("tarama tamamlanınca odağı yeni ekranın başlığına taşır (SC 2.4.3)", async () => {
    mockFlow(statusBody());
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /anlık görünüm/ })).toBeInTheDocument();
    });
    const heading = screen.getByRole("heading", { name: /anlık görünüm/ });
    expect(document.activeElement).toBe(heading);
    expect(document.activeElement).not.toBe(document.body);
  });

  it("odak başlığı araç adını taşır — `tool` prop'u gerçekten okunur", async () => {
    mockFlow(statusBody());
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    // Boştaki ekranda da başlık araç adını söyler.
    expect(
      screen.getByRole("heading", { name: `${TOOL.name.tr} — yeni tarama` }),
    ).toBeInTheDocument();

    startScan();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: `${TOOL.name.tr} — anlık görünüm` }),
      ).toBeInTheDocument();
    });
  });

  it("başarısız taramada hem canlı bölge hem role=alert konuşur", async () => {
    mockFlow(statusBody({ status: "failed", failReason: "scrape_failed", snapshot: null }));
    const { container } = render(<DiagnooTool locale="tr" tool={TOOL} />);
    const live = container.querySelector('[aria-live="polite"]');

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Bu adres taranamadı.");
    });
    // Duyuru bir state güncellemesi: görünür içerikten bir render sonra düşer.
    await waitFor(() => {
      expect(live).toHaveTextContent("Tarama tamamlanamadı.");
    });
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { name: `${TOOL.name.tr} — tarama tamamlanamadı` }),
    );
  });

  it("kilit zaten açıksa doğrudan raporu basar ve rapor aşamasını duyurur", async () => {
    mockFlow(statusBody({ report: REPORT, leadCaptured: true }));
    const { container } = render(<DiagnooTool locale="tr" tool={TOOL} />);
    const live = container.querySelector('[aria-live="polite"]');

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Yönetici özeti" })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(live).toHaveTextContent("Tarama tamamlandı. Rapor açık.");
    });
  });
});
