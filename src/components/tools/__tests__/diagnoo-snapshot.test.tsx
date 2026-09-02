import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiagnooSnapshot } from "../diagnoo-snapshot";
import { toSnapshot } from "@/lib/tools/diagnoo/schema";
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
 * `geo-report-form.test.tsx` deseniyle basit bir stub'a mock'lanıyor.
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

describe("DiagnooSnapshot", () => {
  beforeEach(() => {
    trackMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sağlık skorunu ve en yüksek etkili üç boşluğun başlığını basar", () => {
    render(<DiagnooSnapshot snapshot={SNAPSHOT} diagnosticId={ID} locale="tr" />);

    expect(screen.getByText("54")).toBeInTheDocument();
    expect(screen.getByText("LCP'yi 2,5 sn altına indir")).toBeInTheDocument();
    expect(screen.getByText("Mobilde CTA'yı fold üstüne al")).toBeInTheDocument();
    expect(screen.getByText("Meta Pixel kur")).toBeInTheDocument();
  });

  it("kilitli kartlarda aylık etki tutarı hiçbir biçimde render edilmez", () => {
    const { container } = render(
      <DiagnooSnapshot snapshot={SNAPSHOT} diagnosticId={ID} locale="tr" />,
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
      <DiagnooSnapshot snapshot={SNAPSHOT} diagnosticId={ID} locale="tr" />,
    );
    const text = container.textContent ?? "";

    expect(text).toContain("74.000");
    expect(text).toContain("154.000");
  });

  it("mount'ta tool_scan_completed olayını sağlık kovasıyla bir kez atar", () => {
    render(<DiagnooSnapshot snapshot={SNAPSHOT} diagnosticId={ID} locale="tr" />);

    expect(trackMock).toHaveBeenCalledTimes(1);
    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_scan_completed",
      properties: { slug: "diagnoo", band: "51-75", locale: "tr" },
    });
  });

  it("kilit açma formunu altında render eder", () => {
    render(<DiagnooSnapshot snapshot={SNAPSHOT} diagnosticId={ID} locale="tr" />);

    expect(screen.getByLabelText("İş e-postanız")).toBeInTheDocument();
    expect(screen.getByLabelText("Şirket adı")).toBeInTheDocument();
  });
});
