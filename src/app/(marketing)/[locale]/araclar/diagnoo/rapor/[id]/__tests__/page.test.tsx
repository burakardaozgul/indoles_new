import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

/**
 * Görev 17.3 — rapor sayfasının sunucu-render `failed` durumu `role="alert"`
 * taşır ve SPA (`diagnoo-tool.tsx`) ile AYNI `fail-copy.ts` eşlemesini
 * kullanır. Sayfa async bir Server Component (RSC); testte doğrudan
 * çağrılıp döndürdüğü JSX render edilir — `V2PageHeader` "use client" olsa
 * da (gsap, next-intl `Link`) burada sadece bir başlık dizgesi basan ince
 * bir sahte ile değiştirilir; asıl iddia (`role="alert"` + doğru metin)
 * bundan etkilenmez.
 */
vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next-intl/server", () => ({ setRequestLocale: vi.fn() }));
vi.mock("@/components/v2/chrome/V2PageHeader", () => ({
  V2PageHeader: ({ title }: { title: React.ReactNode }) => <h1>{title}</h1>,
}));
vi.mock("@/lib/tools/diagnoo/repository", () => ({
  getDiagnostic: vi.fn(),
  findLeadByToken: vi.fn(),
}));

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { getDiagnostic, findLeadByToken } from "@/lib/tools/diagnoo/repository";
import { DIAGNOO_FAIL_COPY } from "@/lib/tools/diagnoo/fail-copy";
import DiagnooReportPage from "../page";
import type { DiagnosticRow } from "@/lib/tools/diagnoo/repository";

const ID = "11111111-1111-4111-8111-111111111111";

function row(over: Partial<DiagnosticRow>): DiagnosticRow {
  return {
    id: ID, url: "https://a.com", locale: "tr", status: "failed",
    currentStep: null, progressPct: 0, report: null, failReason: null,
    ...over,
  };
}

beforeEach(() => {
  vi.mocked(getCloudflareContext).mockReturnValue({ env: { BOOKINGS_DB: {} } } as never);
  vi.mocked(cookies).mockResolvedValue({ get: () => undefined } as never);
  vi.mocked(findLeadByToken).mockResolvedValue(null);
});

describe("DiagnooReportPage — sunucu-render başarısız durum duyurusu (Görev 17.3)", () => {
  it("scrape_failed (TR) → role=alert ve paylaşılan 'site alınamadı' kopyası", async () => {
    vi.mocked(getDiagnostic).mockResolvedValue(row({ failReason: "scrape_failed" }));

    const jsx = await DiagnooReportPage({ params: Promise.resolve({ locale: "tr", id: ID }) });
    render(jsx);

    expect(screen.getByRole("alert")).toHaveTextContent(DIAGNOO_FAIL_COPY.tr.scrapeFailed);
  });

  it("pipeline_error (EN) → role=alert ve genel kopya", async () => {
    vi.mocked(getDiagnostic).mockResolvedValue(
      row({ locale: "en", failReason: "pipeline_error" }),
    );

    const jsx = await DiagnooReportPage({ params: Promise.resolve({ locale: "en", id: ID }) });
    render(jsx);

    expect(screen.getByRole("alert")).toHaveTextContent(DIAGNOO_FAIL_COPY.en.generic);
  });

  it("çalışan (running) durumda alert YOK, bekleme metni gösterilir", async () => {
    vi.mocked(getDiagnostic).mockResolvedValue(
      row({ status: "running", currentStep: "scraping", progressPct: 15 }),
    );

    const jsx = await DiagnooReportPage({ params: Promise.resolve({ locale: "tr", id: ID }) });
    render(jsx);

    expect(screen.queryByRole("alert")).toBeNull();
    expect(
      screen.getByText("Tarama sürüyor; sonuç hazır olduğunda sayfayı yenileyin."),
    ).toBeInTheDocument();
  });
});
