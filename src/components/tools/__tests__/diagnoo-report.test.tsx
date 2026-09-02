import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiagnooReport } from "../diagnoo-report";
import { sampleReport } from "@/lib/tools/diagnoo/__tests__/fixtures";

/**
 * Tam raporun sözleşmeleri — Görev 15.
 *
 * En sert kural aralık disiplini: para HER YERDE "düşük – yüksek" basılır,
 * nokta tahmin (`expected`) tek başına görünmez (spec §4). Bu, modelin
 * belirsizliğini gizlememe kararıdır ve testle korunmazsa sessizce kaybolur.
 *
 * Ölçüm ayağı: yol haritası satırının açılması ve hizmet linkine basılması
 * GA4'e yazılır; ikisi de raporun tek dönüşüm sinyali.
 */
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

const REPORT = sampleReport();

describe("DiagnooReport", () => {
  beforeEach(() => {
    trackMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("altı bölümü de etiketli section olarak basar", () => {
    const { container } = render(<DiagnooReport report={REPORT} locale="tr" />);
    const sections = container.querySelectorAll("section[aria-labelledby]");
    expect(sections).toHaveLength(6);

    for (const heading of [
      "Yönetici özeti",
      "Skor karnesi",
      "Kritik boşluklar",
      "Finansal projeksiyon",
      "Yol haritası",
      "Sonraki adım",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });

  it("para değerlerini aralık olarak basar; nokta tahmini hiç göstermez", () => {
    const { container } = render(<DiagnooReport report={REPORT} locale="tr" />);
    const text = container.textContent ?? "";

    expect(text).toContain("74.000");
    expect(text).toContain("154.000");
    // `expected` uçları: totalRecoverable 114000, impactMonthly 90000/18000/6000.
    // Para simgesiyle aranır — çıplak "6.000" zaten "₺26.000"un içinde geçer.
    for (const pointEstimate of ["₺114.000", "₺90.000", "₺18.000", "₺6.000"]) {
      expect(text).not.toContain(pointEstimate);
    }
  });

  it("etki verisi olmayan maddeyi 'veri yetersiz' olarak işaretler", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    // "Meta Pixel kur" maddesinin `impactMonthly` alanı null.
    expect(screen.getAllByText("Veri yetersiz").length).toBeGreaterThan(0);
  });

  it("finansal girdilerin kaynağını ölçüldü/tahmin rozetiyle ayırır", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    // Fixture'da dört `inputSources` alanı da "estimated".
    expect(screen.getAllByText("Tahmin")).toHaveLength(4);
    // `avgDelaySeconds` ve `messageCohesionScore` taramanın kendi ölçümleri.
    expect(screen.getAllByText("Ölçüldü")).toHaveLength(2);
  });

  it("reklam bütçesi girilmediğinde kalemi hesaplamadığını söyler", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    expect(
      screen.getByText("Reklam bütçesi girilmedi; bu kalem hesaplanmadı."),
    ).toBeInTheDocument();
  });

  it("veri kalitesi satırı ölçülen/tahmin sayısını dürüstçe söyler", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    expect(
      screen.getByText(/dört girdisi de sektör medyanından geldi/i),
    ).toBeInTheDocument();
  });

  it("metodoloji notunu katsayı, değer ve kaynağıyla listeler", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    expect(screen.getByText("SPEED_LOSS_PER_SECOND")).toBeInTheDocument();
    expect(
      screen.getByText(/Portent \(2019\), sayfa hızı-dönüşüm analizi/),
    ).toBeInTheDocument();
  });

  it("yol haritası satırı açıldığında tool_roadmap_item_expanded atar", () => {
    const { container } = render(<DiagnooReport report={REPORT} locale="tr" />);
    const roadmapDetails = container.querySelectorAll("details");
    // İlk `<details>` metodoloji eki; yol haritası satırları sonrasında gelir.
    const first = Array.from(roadmapDetails).find((d) =>
      d.textContent?.includes("LCP'yi 2,5 sn altına indir"),
    );
    expect(first).toBeDefined();

    first!.open = true;
    fireEvent(first!, new Event("toggle"));

    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_roadmap_item_expanded",
      properties: { slug: "diagnoo", category: "speed", locale: "tr" },
    });
  });

  it("hizmet linkine basıldığında tool_service_cta_clicked atar", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    const link = screen.getByRole("link", { name: /CRO — dönüşüm optimizasyonu/ });
    // jsdom gerçek gezinmeyi denemesin — olay yine de bileşenin eline geçer.
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);

    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_service_cta_clicked",
      properties: { slug: "diagnoo", target_service: "cro", locale: "tr" },
    });
  });

  it("EN locale'de hizmet linklerini çevrilmiş segment zinciriyle üretir", () => {
    render(<DiagnooReport report={REPORT} locale="en" />);
    expect(screen.getByRole("link", { name: /E-commerce/ })).toHaveAttribute(
      "href",
      "/en/services/e-commerce",
    );
  });
});
