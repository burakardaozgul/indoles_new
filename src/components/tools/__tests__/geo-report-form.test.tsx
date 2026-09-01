import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GeoReportForm } from "../geo-report-form";
import type { GeoCheckResult } from "@/lib/tools/geo/types";
import type { ToolSignal } from "@/lib/content/tools";

/**
 * Görev 12b: kilit açılınca `findings` BAŞLANGIÇ prop'undan değil, rapor
 * route'unun 200 yanıtından render edilir. Public yüzeyden gelen `checks`
 * prop'u artık findings TAŞIMAZ (route/sayfa strip eder) — form kendi
 * fetch'inin gövdesindeki `checks`i kullanmak ZORUNDA, yoksa kilit açılsa
 * bile bulgular boş görünür.
 *
 * `PopupCTAButton` context (`usePopup`) gerektirir — bu testte alakasız,
 * basit bir stub'a mock'lanıyor (SuccessState.test.tsx'in next-intl mock
 * deseniyle aynı gerekçe).
 */
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

const signals: ToolSignal[] = [
  {
    id: "ai-access",
    weight: 20,
    title: { tr: "AI erişimi", en: "AI access" },
    description: { tr: "açıklama", en: "description" },
  },
];

// Prop olarak gelen `checks` — public yüzeyin STRIP EDİLMİŞ hali (findings
// boş) — sonuç sayfasının artık göndereceği TAM olarak budur.
const strippedChecks: GeoCheckResult[] = [
  {
    id: "ai-access",
    score: 12,
    max: 20,
    status: "partial",
    summary: { tr: "özet", en: "summary" },
    findings: [],
  },
];

// Rapor route'unun 200 yanıtından gelecek TAM checks (findings dolu).
const fullChecks: GeoCheckResult[] = [
  {
    id: "ai-access",
    score: 12,
    max: 20,
    status: "partial",
    summary: { tr: "özet", en: "summary" },
    findings: [{ tr: "sunucu tarafından dönen bulgu cümlesi", en: "server-returned finding sentence" }],
  },
];

async function fillAndSubmit(): Promise<void> {
  fireEvent.change(screen.getByLabelText(/e-posta adresi/i), {
    target: { value: "ziyaretci@ornek.com.tr" },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: /raporu gönder/i }));
}

describe("GeoReportForm — kilit açılınca findings kaynağı", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("kilit açılınca findings RAPOR YANITINDAN render edilir (başlangıç prop'unda findings olmasa da)", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, checks: fullChecks }),
    } as Response);

    render(
      <GeoReportForm
        scanId="11111111-1111-4111-8111-111111111111"
        band="gelismeye-acik"
        locale="tr"
        checks={strippedChecks}
        signals={signals}
      />,
    );

    await fillAndSubmit();

    await waitFor(() => {
      expect(
        screen.getByText("sunucu tarafından dönen bulgu cümlesi"),
      ).toBeInTheDocument();
    });
  });

  it("rapor yanıtı checks içermezse (beklenmedik gövde) prop'taki (boş) findings render edilir, çökmez", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    render(
      <GeoReportForm
        scanId="11111111-1111-4111-8111-111111111111"
        band="gelismeye-acik"
        locale="tr"
        checks={strippedChecks}
        signals={signals}
      />,
    );

    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/ayrıntılı bulgular/i)).toBeInTheDocument();
    });
    // Çökmeden kilit açık ekranına geçti; findings prop'tan boş kaldı.
    expect(screen.queryByText(/sunucu tarafından dönen bulgu cümlesi/)).not.toBeInTheDocument();
  });
});
