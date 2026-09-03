import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { DiagnooTool } from "../diagnoo-tool";
import { DIAGNOO_TOOL } from "@/lib/content/tools";
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

const TOOL = DIAGNOO_TOOL;
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
    expect(live?.textContent).toBe("");
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
    // Odak, ekranın göründüğü render'dan SONRAKİ efektte taşınır.
    await waitFor(() => {
      expect(document.activeElement).toBe(heading);
    });
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

  it("başarısız taramada YALNIZ role=alert konuşur, canlı bölge sessiz kalır", async () => {
    mockFlow(statusBody({ status: "failed", failReason: "scrape_failed", snapshot: null }));
    const { container } = render(<DiagnooTool locale="tr" tool={TOOL} />);
    const live = container.querySelector('[aria-live="polite"]');

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Bu adres taranamadı.");
    });

    // `role="alert"` zaten bir canlı bölge; kalıcı bölge de konuşsaydı ekran
    // okuyucu hatayı iki kez okurdu. `waitFor`: duyuru bir state güncellemesi,
    // görünür içerikten bir render sonra düşer — bir önceki aşamanın
    // ("Tarama başlatıldı.") temizlenmesini beklemek zorundayız.
    await waitFor(() => {
      expect(live?.textContent).toBe("");
    });

    // Odak taşıma bu aşamada da sürüyor — duyuruyu alert, yönlendirmeyi odak yapar.
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("heading", { name: `${TOOL.name.tr} — tarama tamamlanamadı` }),
      );
    });
  });

  it("ağ hatasında taramayı değil bağlantıyı suçlar", async () => {
    // `useDiagnooStatus` üç ardışık ağ hatasından sonra `network_error` yazıyor:
    // tarama başarısız olmadı, durumunu okuyamıyoruz. Genel "adresi kontrol
    // edin" cümlesi ziyaretçiyi yanlış yere yönlendiriyordu.
    mockFlow(statusBody({ status: "failed", failReason: "network_error", snapshot: null }));
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Tarama durumuna ulaşılamıyor.",
      );
    });
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

  // ---- Faz 2 madde 5: robots meta senkronu ----

  it("boşta robots meta etiketi YOK; snapshot/rapor/failed fazında noindex,follow olur", async () => {
    document.head.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove());
    mockFlow(statusBody());
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    expect(document.querySelector('meta[name="robots"]')).toBeNull();

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /anlık görünüm/ })).toBeInTheDocument();
    });
    // `RobotsMeta`nın DOM güncellemesi kendi (pasif) efektinde olur, başlığın
    // göründüğü commit'le AYNI anda değil — ayrı bir `waitFor` yarış
    // durumunu engeller.
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, follow",
      );
    });
  });

  it("başarısız taramada da robots noindex,follow olur; yeni taramaya dönünce eski değere döner", async () => {
    const existing = document.createElement("meta");
    existing.name = "robots";
    existing.content = "index, follow";
    document.head.appendChild(existing);

    mockFlow(statusBody({ status: "failed", failReason: "scrape_failed", snapshot: null }));
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    startScan();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, follow",
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Yeni tarama başlat" }));

    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "index, follow",
      );
    });
  });
});

/**
 * Landing paritesi (Faz 2 Görev 3) — araç adası artık kendi hero'sunu basıyor.
 *
 * GEO ile aynı kabuk: `ToolHero` boşta `full` (eyebrow + h1 + lede), tarama
 * başlar başlamaz `compact` (yalnız eyebrow + h1). Kanıt şeridi de GEO'daki
 * gibi yalnız boştaki ekranda durur — tarama sürerken ilerlemeyle yarışmaz.
 */
describe("DiagnooTool — GEO v2 hero paritesi", () => {
  beforeEach(() => {
    trackMock.mockReset();
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("boş ekranda ToolHero'yu tam varyantta ve dört kanıt öğesini basar", () => {
    mockFlow(statusBody());
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    expect(
      screen.getByRole("heading", { level: 1, name: TOOL.name.tr }),
    ).toBeInTheDocument();
    expect(screen.getByText(TOOL.eyebrow.tr)).toBeInTheDocument();
    expect(screen.getByText(TOOL.lede.tr)).toBeInTheDocument();

    const proof = screen.getByRole("list", { name: "Kanıt" });
    expect(within(proof).getAllByRole("listitem")).toHaveLength(4);
    expect(within(proof).getByText(TOOL.proof[0]!.tr)).toBeInTheDocument();
  });

  it("tarama başlayınca hero compact'e düşer: lede ve kanıt şeridi kalkar", async () => {
    mockFlow(statusBody());
    render(<DiagnooTool locale="tr" tool={TOOL} />);

    startScan();

    await waitFor(() => {
      expect(screen.queryByRole("list", { name: "Kanıt" })).toBeNull();
    });
    expect(screen.queryByText(TOOL.lede.tr)).toBeNull();
    // Başlık düzeni bozulmaz: h1 her fazda DOM'da ve tek.
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: TOOL.name.tr }),
    ).toBeInTheDocument();
  });
});
