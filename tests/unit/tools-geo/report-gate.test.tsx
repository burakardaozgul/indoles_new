import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReportGate } from "@/components/tools/report-gate";
import { TOOLS } from "@/lib/content/tools";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
}));
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));

const SIGNALS = TOOLS[0]!.signals;
const STRIPPED: GeoCheckResult[] = [
  { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "a", en: "a" }, findings: [], findingsCount: 0 },
  { id: "json-ld", score: 0, max: 20, status: "fail", summary: { tr: "c", en: "c" }, findings: [], findingsCount: 1 },
  { id: "question-h2", score: 0, max: 25, status: "fail", summary: { tr: "e", en: "e" }, findings: [], findingsCount: 2 },
];
const FULL: GeoCheckResult[] = STRIPPED.map((c) => ({
  ...c,
  findings: Array.from({ length: c.findingsCount ?? 0 }, (_, i) => ({ tr: `${c.id} bulgu ${i + 1}`, en: `${c.id} finding ${i + 1}` })),
}));

function renderGate() {
  return render(<ReportGate scanId="scan-1" band="zayif" locale="tr" checks={STRIPPED} signals={SIGNALS} />);
}

describe("ReportGate", () => {
  beforeEach(() => { trackMock.mockReset(); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("kilitli önizleme: kalan sinyaller bulgu sayısıyla, geçenler tek satırda", () => {
    renderGate();
    expect(screen.getByText("Soru başlıkları")).toBeInTheDocument();
    expect(screen.getByText("2 bulgu")).toBeInTheDocument();
    expect(screen.getByText("1 bulgu")).toBeInTheDocument();
    expect(screen.getByText("Geçen 1 sinyalin notları")).toBeInTheDocument();
    expect(screen.getByText("Kilitli")).toBeInTheDocument();

    // Ruling R7: önizleme orderForFixList'in tie-break'ini kullanır — eşit
    // kaybedilen puanda sıra `signals` dizisininkine göre belirlenir, girdi
    // dizisinin sırasına değil (girdi burada bilinçli olarak TERS verildi).
    const TIE: GeoCheckResult[] = [
      { id: "lang-signals", score: 5, max: 15, status: "partial", summary: { tr: "d", en: "d" }, findings: [], findingsCount: 1 },
      { id: "llms-txt", score: 5, max: 15, status: "partial", summary: { tr: "b", en: "b" }, findings: [], findingsCount: 1 },
    ];
    const { container } = render(<ReportGate scanId="scan-2" band="zayif" locale="tr" checks={TIE} signals={SIGNALS} />);
    const rows = within(container).getAllByRole("listitem").map((li) => li.textContent ?? "");
    const llmsIndex = rows.findIndex((t) => t.includes("llms.txt"));
    const langIndex = rows.findIndex((t) => t.includes("Dil sinyalleri"));
    expect(llmsIndex).toBeGreaterThanOrEqual(0);
    expect(llmsIndex).toBeLessThan(langIndex);
  });

  it("rızasız gönderim istek atmaz, uyarı basar", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderGate();
    fireEvent.change(screen.getByLabelText("E-posta adresi"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "Raporu gönder" }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("KVKK onayını işaretleyin");
  });

  it("rızalı gönderim: yanıttaki checks ile düzeltme listesi açılır, olay atılır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, checks: FULL }) }));
    const { container } = renderGate();
    fireEvent.change(screen.getByLabelText("E-posta adresi"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByLabelText(/KVKK kapsamında/));
    fireEvent.click(screen.getByRole("button", { name: "Raporu gönder" }));
    await waitFor(() => expect(screen.getByText("question-h2 bulgu 2")).toBeInTheDocument());
    // Görünür lede `FindingsList`te (`.text-success-700`); aynı metin ayrıca
    // kalıcı `sr-only` canlı bölgede de duyurulur — iki ayrı düğüm bilinçli
    // (spec §4, M8'in aksine burada tekrar İSTENİYOR).
    expect(screen.getByText("Raporun kopyası e-postanızda.", { selector: "p.text-success-700" })).toBeInTheDocument();
    const liveStatus = container.querySelector('p[role="status"].sr-only');
    expect(liveStatus).toHaveTextContent("Raporun kopyası e-postanızda.");
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Düzeltme listesi" }));
    expect(trackMock).toHaveBeenCalledWith({ name: "tool_report_requested", properties: { slug: "geo-gorunurluk-denetleyicisi", band: "zayif", locale: "tr" } });
    const body = JSON.parse((fetch as unknown as { mock: { calls: [unknown, { body: string }][] } }).mock.calls[0]![1].body);
    expect(body).toMatchObject({ scanId: "scan-1", email: "a@b.co", kvkkConsent: true, locale: "tr", website: "" });
  });

  it("mail-failed → hata satırı, kilit kapalı kalır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "mail-failed" }) }));
    renderGate();
    fireEvent.change(screen.getByLabelText("E-posta adresi"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByLabelText(/KVKK kapsamında/));
    fireEvent.click(screen.getByRole("button", { name: "Raporu gönder" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Rapor şu an gönderilemedi"));
    expect(screen.queryByText("json-ld bulgu 1")).not.toBeInTheDocument();
  });
});
