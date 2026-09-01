import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GeoScanForm } from "@/components/tools/geo-scan-form";
import { TOOLS } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

/**
 * `GeoScanForm` başarı yolu — Görev 11.
 *
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` bu test sürecinde tanımlı DEĞİL (yerel
 * geliştirme ortamının varsayılan hâli, bkz. `.env.example` — bu worktree'de
 * hiç `.env.local`/`.dev.vars` yok), bu yüzden `TURNSTILE_ENABLED` modül
 * yüklenirken `false` çözülür ve widget hiç render edilmez — `ContactForm`
 * testindeki gibi ayrı bir Turnstile stub'ına gerek kalmaz.
 */
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));

const SIGNALS = TOOLS[0]!.signals;

const RESULT: GeoScanResult = {
  id: "scan-abc123",
  url: "https://ornek.com.tr",
  totalScore: 72,
  band: "iyi",
  scannedAt: "2026-09-01T00:00:00.000Z",
  checks: [
    { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "Tüm botlar erişebiliyor.", en: "All crawlers can access." }, findings: [] },
    { id: "llms-txt", score: 0, max: 15, status: "fail", summary: { tr: "llms.txt yok.", en: "No llms.txt." }, findings: [] },
    { id: "json-ld", score: 12, max: 20, status: "partial", summary: { tr: "Kısmi yapısal veri.", en: "Partial structured data." }, findings: [] },
    { id: "lang-signals", score: 15, max: 15, status: "pass", summary: { tr: "Dil sinyalleri tam.", en: "Language signals complete." }, findings: [] },
    { id: "question-h2", score: 20, max: 25, status: "partial", summary: { tr: "Başlıklar kısmen soru.", en: "Headings partly questions." }, findings: [] },
  ],
};

const LABELS = {
  urlLabel: "Site adresi",
  urlPlaceholder: "https://ornek.com.tr",
  submit: "Denetle",
  submitting: "Taranıyor…",
  turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
  turnstileUnavailable: "Güvenlik doğrulaması yüklenemedi.",
  share: "Sonucu paylaş",
  shareCopied: "Bağlantı kopyalandı",
  errors: {
    invalidUrl: "Geçerli bir site adresi girin.",
    rateLimited: "Çok fazla tarama yapıldı.",
    unreachable: "Bu adrese ulaşılamadı.",
    turnstile: "Güvenlik doğrulaması geçmedi.",
    generic: "Bir sorun oluştu, tekrar deneyin.",
  },
};

function submitScan(): void {
  fireEvent.change(screen.getByLabelText("Site adresi"), {
    target: { value: "https://ornek.com.tr" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Denetle" }));
}

describe("GeoScanForm — başarı yolu", () => {
  beforeEach(() => {
    trackMock.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: RESULT.id, result: RESULT }),
      }),
    );
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    vi.spyOn(window.history, "replaceState");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("başarılı yanıtta GeoResult'ı AYNI sayfada basar — sayfa geçişi yok", async () => {
    render(<GeoScanForm locale="tr" labels={LABELS} signals={SIGNALS} />);
    submitScan();

    await waitFor(() => {
      expect(screen.getByText("72")).toBeInTheDocument();
    });
    expect(screen.getByText("İyi")).toBeInTheDocument();
    // Form artık DOM'da değil — sonuç ekranı form alanının yerini aldı.
    expect(screen.queryByLabelText("Site adresi")).toBeNull();
  });

  it("URL çubuğunu history.replaceState ile paylaşım linkine günceller", async () => {
    render(<GeoScanForm locale="tr" labels={LABELS} signals={SIGNALS} />);
    submitScan();

    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        "/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/scan-abc123",
      );
    });
  });

  it("EN locale'de paylaşım linkini doğru segment zinciriyle üretir", async () => {
    render(<GeoScanForm locale="en" labels={LABELS} signals={SIGNALS} />);
    submitScan();

    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        "/en/tools/geo-visibility-checker/result/scan-abc123",
      );
    });
  });

  it("tool_used gönderimde, tool_scan_completed bant ile yanıtta atılır", async () => {
    render(<GeoScanForm locale="tr" labels={LABELS} signals={SIGNALS} />);
    submitScan();

    expect(trackMock).toHaveBeenCalledWith({
      name: "tool_used",
      properties: { slug: "geo-gorunurluk-denetleyicisi", locale: "tr" },
    });

    await waitFor(() => {
      expect(trackMock).toHaveBeenCalledWith({
        name: "tool_scan_completed",
        properties: { slug: "geo-gorunurluk-denetleyicisi", band: "iyi", locale: "tr" },
      });
    });
  });

  it("'sonucu paylaş' düğmesi paylaşım linkini panoya kopyalar", async () => {
    render(<GeoScanForm locale="tr" labels={LABELS} signals={SIGNALS} />);
    submitScan();
    await screen.findByText("72");

    fireEvent.click(screen.getByRole("button", { name: "Sonucu paylaş" }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/scan-abc123`,
      );
    });
    expect(await screen.findByText("Bağlantı kopyalandı")).toBeInTheDocument();
  });
});
