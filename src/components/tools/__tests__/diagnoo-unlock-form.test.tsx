import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DiagnooUnlockForm } from "../diagnoo-unlock-form";
import { sampleReport } from "@/lib/tools/diagnoo/__tests__/fixtures";

/**
 * Kilit açma formunun üç sözleşmesi — Görev 15.
 *
 * 1. KVKK rızası olmadan hiçbir istek çıkmaz — rıza kapısının İSTEMCİ ayağı
 *    (sunucu ayağı `diagnooUnlockSchema`'daki `z.literal(true)`).
 * 2. Başarılı yanıtın raporu yukarı taşınır (`onUnlocked`) ve olay atılır.
 * 3. Opsiyonel metrikler ya doğru birimde gider (yüzde → 0-1 oranı) ya da
 *    HİÇ gitmez — boş alan `0`/`NaN` olarak gönderilirse finansal projeksiyon
 *    ölçülmüş bir sıfırmış gibi yeniden hesaplanır, bu da uydurma rakam olur.
 */
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));

const ID = "11111111-1111-4111-8111-111111111111";
const REPORT = sampleReport();

function fillRequired(): void {
  fireEvent.change(screen.getByLabelText("İş e-postanız"), {
    target: { value: "ziyaretci@ornek.com.tr" },
  });
  fireEvent.change(screen.getByLabelText("Şirket adı"), {
    target: { value: "Örnek Mağaza" },
  });
}

function submit(): void {
  fireEvent.click(screen.getByRole("button", { name: "Raporu açın" }));
}

function lastBody(fetchMock: ReturnType<typeof vi.fn>): Record<string, unknown> {
  const call = fetchMock.mock.calls.at(-1);
  return JSON.parse((call?.[1] as { body: string }).body) as Record<string, unknown>;
}

describe("DiagnooUnlockForm", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    trackMock.mockReset();
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ report: REPORT }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("KVKK onayı işaretlenmeden gönderim engellenir", () => {
    render(<DiagnooUnlockForm diagnosticId={ID} locale="tr" onUnlocked={vi.fn()} />);

    fillRequired();
    submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Devam etmek için KVKK onayını işaretleyin.",
    );
  });

  it("başarılı yanıtta raporu yukarı taşır ve tool_report_requested atar", async () => {
    const onUnlocked = vi.fn();
    render(<DiagnooUnlockForm diagnosticId={ID} locale="tr" onUnlocked={onUnlocked} />);

    fillRequired();
    fireEvent.click(screen.getByRole("checkbox"));
    submit();

    await waitFor(() => {
      expect(onUnlocked).toHaveBeenCalledWith(REPORT);
    });
    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_report_requested",
      properties: { slug: "diagnoo", band: "51-75", locale: "tr" },
    });

    const body = lastBody(fetchMock);
    expect(body.diagnosticId).toBe(ID);
    expect(body.email).toBe("ziyaretci@ornek.com.tr");
    expect(body.company).toBe("Örnek Mağaza");
    expect(body.kvkkConsent).toBe(true);
  });

  it("dönüşüm oranını yüzdeden 0-1 oranına çevirir", async () => {
    render(<DiagnooUnlockForm diagnosticId={ID} locale="tr" onUnlocked={vi.fn()} />);

    fillRequired();
    // `<input type="number">` normalize edilmiş değer verir (nokta ayırıcı);
    // tarayıcı yerel ayırıcıyı kendisi çevirir, `optionalNumber` virgülü de
    // savunma olarak kabul eder.
    fireEvent.change(screen.getByLabelText("Dönüşüm oranı (%)"), {
      target: { value: "1.5" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    submit();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    expect(lastBody(fetchMock).knownMetrics).toEqual({ conversionRate: 0.015 });
  });

  it("boş opsiyonel alanlar knownMetrics'e hiç girmez", async () => {
    render(<DiagnooUnlockForm diagnosticId={ID} locale="tr" onUnlocked={vi.fn()} />);

    fillRequired();
    fireEvent.click(screen.getByRole("checkbox"));
    submit();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    const body = lastBody(fetchMock);
    expect(body).not.toHaveProperty("knownMetrics");
    expect(body).not.toHaveProperty("fullName");
  });

  it("dolu opsiyonel alanlar doğru anahtarla gider", async () => {
    render(<DiagnooUnlockForm diagnosticId={ID} locale="tr" onUnlocked={vi.fn()} />);

    fillRequired();
    fireEvent.change(screen.getByLabelText("Ad soyad"), {
      target: { value: "Ayşe Yıldız" },
    });
    fireEvent.change(screen.getByLabelText("Aylık ziyaretçi sayısı"), {
      target: { value: "120000" },
    });
    fireEvent.change(screen.getByLabelText("Ortalama sepet tutarı (TL)"), {
      target: { value: "850" },
    });
    fireEvent.change(screen.getByLabelText("Aylık reklam bütçesi (TL)"), {
      target: { value: "300000" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    submit();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    const body = lastBody(fetchMock);
    expect(body.fullName).toBe("Ayşe Yıldız");
    expect(body.knownMetrics).toEqual({
      monthlyTraffic: 120000,
      aov: 850,
      monthlyAdSpend: 300000,
    });
  });

  it("rota hata kodunu kullanıcı mesajına çözer", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: "not-ready" }),
    });
    render(<DiagnooUnlockForm diagnosticId={ID} locale="tr" onUnlocked={vi.fn()} />);

    fillRequired();
    fireEvent.click(screen.getByRole("checkbox"));
    submit();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Tarama henüz bitmedi. Sonuç hazır olduğunda yeniden deneyin.",
      );
    });
  });
});
