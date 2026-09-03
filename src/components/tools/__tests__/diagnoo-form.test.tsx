import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DiagnooForm } from "../diagnoo-form";
import { DIAGNOO_TOOL } from "@/lib/content/tools";

/**
 * Teşhis başlatma formunun Görev 17.1 sözleşmesi.
 *
 * Bayrak (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) test ortamında VARSAYILAN
 * KAPALI — `TURNSTILE_ENABLED` build-time sabiti olduğu için burada
 * `vi.stubEnv` ile değiştirilemez (zaten `use-turnstile.ts` modülü import
 * anında sabitliyor); testler bu yüzden "bayrak kapalı" yolunu doğrular —
 * `diagnoo-routes.test.ts` sunucu tarafının bayrak açık/kapalı ikisini de
 * kapsar.
 */
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));

function lastBody(fetchMock: ReturnType<typeof vi.fn>): Record<string, unknown> {
  const call = fetchMock.mock.calls.at(-1);
  return JSON.parse((call?.[1] as { body: string }).body) as Record<string, unknown>;
}

describe("DiagnooForm", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    trackMock.mockReset();
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      json: async () => ({ id: "diag-1", reused: false }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("bal küpü alanı DOM'da ama görsel/klavye erişiminden çıkarılmış render edilir", () => {
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={vi.fn()} />);

    const honeypot = screen.getByRole("textbox", { name: "Web sitesi (boş bırak)", hidden: true });
    expect(honeypot).toHaveAttribute("name", "website");
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
    expect(honeypot).toHaveAttribute("autoComplete", "off");
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
    // Varsayılan (erişilebilirlik ağacı) sorgusunda HİÇ görünmez — ekran
    // okuyucudan gerçekten çıkarılmış olduğunun kanıtı.
    expect(
      screen.queryByRole("textbox", { name: "Web sitesi (boş bırak)" }),
    ).toBeNull();
  });

  it("gönderimde gövdeye website ('') ve sayısal elapsedMs eklenir", async () => {
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Mağazanızın adresi"), {
      target: { value: "https://magaza.example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Taramayı başlat" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    const body = lastBody(fetchMock);
    expect(body.website).toBe("");
    expect(typeof body.elapsedMs).toBe("number");
    expect(body.elapsedMs as number).toBeGreaterThanOrEqual(0);
  });

  it("bal küpü doldurulursa (bot) gövdeye AYNEN gider — istemci bunu gizlemez", async () => {
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Mağazanızın adresi"), {
      target: { value: "https://magaza.example.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Web sitesi (boş bırak)", hidden: true }), {
      target: { value: "https://spam.example" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Taramayı başlat" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    expect(lastBody(fetchMock).website).toBe("https://spam.example");
  });

  it("Turnstile bayrağı kapalıyken gövdede turnstileToken alanı HİÇ yok", async () => {
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Mağazanızın adresi"), {
      target: { value: "https://magaza.example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Taramayı başlat" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    expect(lastBody(fetchMock)).not.toHaveProperty("turnstileToken");
  });

  it("Turnstile bayrağı kapalıyken 'hazırlanıyor' gibi bir ipucu GÖSTERİLMEZ", () => {
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={vi.fn()} />);
    expect(screen.queryByText("Güvenlik doğrulaması yükleniyor…")).toBeNull();
    expect(screen.queryByText("Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.")).toBeNull();
  });

  it("başarılı 202 yanıtında onStarted teşhis kimliğiyle çağrılır", async () => {
    const onStarted = vi.fn();
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={onStarted} />);

    fireEvent.change(screen.getByLabelText("Mağazanızın adresi"), {
      target: { value: "https://magaza.example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Taramayı başlat" }));

    await waitFor(() => {
      expect(onStarted).toHaveBeenCalledWith("diag-1");
    });
    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_used",
      properties: { slug: "diagnoo", locale: "tr" },
    });
  });

  it("sahte başarı (spam trap 200, id yok) → genel hata mesajı gösterir", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });
    render(<DiagnooForm locale="tr" inputHelp={DIAGNOO_TOOL.inputHelp.tr} onStarted={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Mağazanızın adresi"), {
      target: { value: "https://magaza.example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Taramayı başlat" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Tarama başlatılamadı, birazdan tekrar deneyin.",
      );
    });
  });
});
