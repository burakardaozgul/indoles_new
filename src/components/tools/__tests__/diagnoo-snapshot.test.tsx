import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DiagnooSnapshot } from "../diagnoo-snapshot";
import { toSnapshot } from "@/lib/tools/diagnoo/schema";
import { DIAGNOO_TOOL } from "@/lib/content/tools";
import { sampleReport } from "@/lib/tools/diagnoo/__tests__/fixtures";

/**
 * Ücretsiz anlık görünümün kilit sözleşmesi — Görev 15.
 *
 * En sert kural: kilitli GAP kartlarında TL rakamı YOK. `SnapshotView` zaten
 * `impactMonthly` taşımıyor (`toSnapshot` onu düşürüyor), ama görünümün bu
 * boşluğu "tahmini bir rakamla" doldurmadığını test etmezsek bir sonraki
 * düzenleme sessizce doldurabilir.
 *
 * `expected` (nokta tahmin) hiçbir yerde tek başına basılmaz (spec §4): fırsat
 * aralığı yalnız "düşük – yüksek" olarak görünür.
 *
 * `PopupCTAButton` context (`usePopup`) ister — kilitli ekranda render
 * edilmiyor ama kilit açılınca gelen `DiagnooReport` içinden çağrılabiliyor;
 * GEO'nun `report-gate.test.tsx` desenindeki gibi basit bir stub'a
 * mock'lanıyor.
 */
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

const ID = "11111111-1111-4111-8111-111111111111";
const REPORT = sampleReport();
const SNAPSHOT = toSnapshot(REPORT);

/** Kilidi açar: zorunlu alanlar + KVKK + gönderim. */
async function unlock(): Promise<void> {
  fireEvent.change(screen.getByLabelText("İş e-postanız"), {
    target: { value: "ziyaretci@ornek.com.tr" },
  });
  fireEvent.change(screen.getByLabelText("Şirket adı"), {
    target: { value: "Örnek Mağaza" },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Raporu açın" }));
  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Yönetici özeti" })).toBeInTheDocument();
  });
}

describe("DiagnooSnapshot", () => {
  beforeEach(() => {
    trackMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sağlık skorunu ve en yüksek etkili üç boşluğun başlığını basar", () => {
    render(<DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />);

    expect(screen.getByText("54")).toBeInTheDocument();
    expect(screen.getByText("LCP'yi 2,5 sn altına indir")).toBeInTheDocument();
    expect(screen.getByText("Mobilde CTA'yı fold üstüne al")).toBeInTheDocument();
    expect(screen.getByText("Meta Pixel kur")).toBeInTheDocument();
  });

  it("kilitli kartlarda aylık etki tutarı hiçbir biçimde render edilmez", () => {
    const { container } = render(
      <DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />,
    );
    const text = container.textContent ?? "";

    // `impactMonthly` değerleri (60.000 / 90.000 / 120.000 / 18.000)
    for (const masked of ["60.000", "90.000", "120.000", "18.000", "26.000"]) {
      expect(text).not.toContain(masked);
    }
    // Nokta tahmin (`expected`) tek başına asla gösterilmez.
    expect(text).not.toContain("114.000");
  });

  it("fırsatı aralık olarak basar — düşük ve yüksek uç", () => {
    const { container } = render(
      <DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />,
    );
    const text = container.textContent ?? "";

    expect(text).toContain("74.000");
    expect(text).toContain("154.000");
  });

  it("mount'ta tool_scan_completed olayını sağlık kovasıyla bir kez atar", () => {
    render(<DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_scan_completed",
      properties: { slug: "diagnoo", band: "51-75", locale: "tr" },
    });
  });

  it("kilit açılınca geçişi canlı bölgeden duyurur (WCAG SC 4.1.3)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ report: REPORT }) }),
    );
    const { container } = render(
      <DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />,
    );

    const live = container.querySelector('[aria-live="polite"]');
    // Canlı bölge içeriğinden ÖNCE DOM'da — sonradan eklenirse kaçırılır.
    expect(live).not.toBeNull();
    expect(live?.textContent).toBe("");

    await unlock();
    // Duyuru bir state güncellemesi — odak taşıma gibi anlık değil, render bekler.
    await waitFor(() => {
      expect(live).toHaveTextContent("Rapor açıldı.");
    });
    vi.unstubAllGlobals();
  });

  it("kilit açılınca odağı rapor başlığına taşır (WCAG SC 2.4.3)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ report: REPORT }) }),
    );
    render(<DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />);

    await unlock();

    // Gönder düğmesi DOM'dan kalktı; odak <body>ye düşmemeli. `waitFor`:
    // odak, raporun göründüğü render'dan SONRAKİ efektte taşınır.
    const heading = screen.getByRole("heading", { name: "Tam rapor" });
    await waitFor(() => {
      expect(document.activeElement).toBe(heading);
    });
    expect(document.activeElement).not.toBe(document.body);
    vi.unstubAllGlobals();
  });

  it("kilit açma formunu altında render eder", () => {
    render(<DiagnooSnapshot snapshot={SNAPSHOT} bands={DIAGNOO_TOOL.bands} diagnosticId={ID} locale="tr" />);

    expect(screen.getByLabelText("İş e-postanız")).toBeInTheDocument();
    expect(screen.getByLabelText("Şirket adı")).toBeInTheDocument();
  });
});
