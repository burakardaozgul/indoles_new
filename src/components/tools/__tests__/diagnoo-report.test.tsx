import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiagnooReport } from "../diagnoo-report";
import { sampleReport } from "@/lib/tools/diagnoo/__tests__/fixtures";
import type { DiagnooReport as DiagnooReportData } from "@/lib/tools/diagnoo/schema";

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

  it("bölüm 3 YALNIZ kritik ve yüksek öncelikli maddeleri gösterir", () => {
    const { container } = render(<DiagnooReport report={REPORT} locale="tr" />);
    const gapsSection = Array.from(container.querySelectorAll("section")).find(
      (s) => s.querySelector("h2")?.textContent === "Kritik boşluklar",
    );
    expect(gapsSection).toBeDefined();

    // Fixture: 1 kritik + 2 yüksek + 1 orta → bölümde tam 3 kart.
    expect(gapsSection!.querySelectorAll("li")).toHaveLength(3);
    expect(gapsSection!.textContent).not.toContain("Checkout'ta misafir akışı");
    expect(gapsSection!.textContent).not.toContain("Orta");
  });

  it("orta öncelikli madde yalnız yol haritasında geçer — bölüm 3'te değil", () => {
    render(<DiagnooReport report={REPORT} locale="tr" />);
    // Tek kez: bölüm 5 (yol haritası). Bölüm 3 artık aynı maddeyi basmıyor.
    expect(screen.getAllByText("Checkout'ta misafir akışı")).toHaveLength(1);
  });

  it("kritik/yüksek madde yoksa dürüst bir boş durum cümlesi basar", () => {
    const onlyLow: DiagnooReportData = {
      ...REPORT,
      roadmap: REPORT.roadmap
        .filter((r) => r.priority === "medium")
        .map((r) => ({ ...r, priority: "medium" as const })),
    };
    const { container } = render(<DiagnooReport report={onlyLow} locale="tr" />);
    const gapsSection = Array.from(container.querySelectorAll("section")).find(
      (s) => s.querySelector("h2")?.textContent === "Kritik boşluklar",
    );

    expect(gapsSection!.textContent).toContain(
      "Bu taramada kritik veya yüksek öncelikli boşluk bulunmadı",
    );
    // Boş durumda TÜM maddelere düşülmez.
    expect(gapsSection!.querySelectorAll("li")).toHaveLength(0);
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

  it("kıyas satırının altında kaynağını ve tarihini yazar", () => {
    const { container } = render(<DiagnooReport report={REPORT} locale="tr" />);
    const text = container.textContent ?? "";
    const benchmark = REPORT.benchmarks[0]!;
    expect(text).toContain(benchmark.source);
    expect(text).toContain(benchmark.asOf);
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

/**
 * I2 — PSI ölçümü dönmediğinde rapor "0 ms" ve "₺0" basmaz.
 *
 * `avgLcpMs: 0` üç yerde yalan söylüyordu: hız satırı 100/100, kıyas "Siz
 * 0 ms", gecikme girdisi "0 sn — Ölçüldü". Ölçülmemiş bir değer, ölçülmüş bir
 * sıfır gibi görünmemeli.
 */
function reportWithoutSpeed(): DiagnooReportData {
  const base = sampleReport();
  const zero = { low: 0, expected: 0, high: 0 };
  return {
    ...base,
    funnel: { ...base.funnel, pageSpeeds: [], avgLcpMs: 0 },
    benchmarks: [],
    roadmap: base.roadmap.map((r) => ({ ...r, impactMonthly: null })),
    financial: {
      ...base.financial,
      inputs: { ...base.financial.inputs, avgDelaySeconds: 0 },
      dataQuality: { speed: "missing" },
      lostRevenueSpeed: zero,
      totalRecoverable: zero,
    },
  };
}

describe("DiagnooReport — PSI verisi yokken", () => {
  it("hız satırında 0 ms yerine ölçüm alınamadığını yazar", () => {
    const { container } = render(<DiagnooReport report={reportWithoutSpeed()} locale="tr" />);
    const text = container.textContent ?? "";
    expect(text).toContain("PageSpeed Insights bu adres için mobil ölçüm döndürmedi");
    expect(text).toContain("Veri yetersiz");
    // `\b` sınırı fixture'daki "4200 ms" dayanağını yakalamaz — aranan,
    // ölçülmemiş değerin "0 ms" diye basılması.
    expect(text).not.toMatch(/\b0 ms/);
    expect(text).not.toContain("Ortalama LCP");
  });

  it("gecikme girdisini 'Ölçülemedi' rozetiyle işaretler", () => {
    const { container } = render(<DiagnooReport report={reportWithoutSpeed()} locale="tr" />);
    expect(container.textContent ?? "").toContain("Ölçülemedi");
  });

  it("hiçbir yerde ₺0 basmaz", () => {
    const { container } = render(<DiagnooReport report={reportWithoutSpeed()} locale="tr" />);
    expect(container.textContent ?? "").not.toContain("₺0");
  });

  it("EN'de de ölçüm alınamadığını söyler", () => {
    const { container } = render(<DiagnooReport report={reportWithoutSpeed()} locale="en" />);
    const text = container.textContent ?? "";
    expect(text).toContain("PageSpeed Insights returned no mobile measurement");
    expect(text).toContain("Not enough data");
    expect(text).not.toMatch(/\b0 ms/);
    expect(text).not.toContain("Average LCP is");
  });
});
