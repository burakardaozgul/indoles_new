import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GeoResult } from "@/components/tools/geo-result";
import { TOOLS } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

/**
 * `GeoResult` sözleşmesi: skor + bant etiketi + 5 kalem rozeti + kalem
 * `summary` cümleleri render edilir. `findings` DETAYLI RAPORA aittir
 * (Görev 12) — bu bileşende hiçbir koşulda basılmaz; testler bunu doğrudan
 * doğrular (Adım 5).
 */

const SIGNALS = TOOLS[0]!.signals;

const RESULT: GeoScanResult = {
  id: "test-scan-id",
  url: "https://ornek.com.tr",
  totalScore: 72,
  band: "iyi",
  scannedAt: "2026-09-01T00:00:00.000Z",
  checks: [
    {
      id: "ai-access",
      score: 25,
      max: 25,
      status: "pass",
      summary: {
        tr: "Tüm cevap motoru botları sayfaya erişebiliyor.",
        en: "All answer-engine crawlers can access the page.",
      },
      findings: [{ tr: "GİZLİ BULGU — AI ERİŞİMİ", en: "HIDDEN FINDING — AI ACCESS" }],
    },
    {
      id: "llms-txt",
      score: 0,
      max: 15,
      status: "fail",
      summary: {
        tr: "Site kökünde bir llms.txt dosyası bulunamadı.",
        en: "No llms.txt file was found at the site root.",
      },
      findings: [{ tr: "GİZLİ BULGU — LLMS.TXT", en: "HIDDEN FINDING — LLMS.TXT" }],
    },
    {
      id: "json-ld",
      score: 12,
      max: 20,
      status: "partial",
      summary: {
        tr: "Sayfada yapısal veri var ama kapsam kısmi.",
        en: "The page has structured data but coverage is partial.",
      },
      findings: [{ tr: "GİZLİ BULGU — JSON-LD", en: "HIDDEN FINDING — JSON-LD" }],
    },
    {
      id: "lang-signals",
      score: 15,
      max: 15,
      status: "pass",
      summary: {
        tr: "Dil ve bölge sinyalleri eksiksiz.",
        en: "Language and region signals are complete.",
      },
      findings: [{ tr: "GİZLİ BULGU — DİL", en: "HIDDEN FINDING — LANGUAGE" }],
    },
    {
      id: "question-h2",
      score: 20,
      max: 25,
      status: "partial",
      summary: {
        tr: "Başlıkların çoğu soru biçiminde değil.",
        en: "Most headings are not phrased as questions.",
      },
      findings: [{ tr: "GİZLİ BULGU — H2", en: "HIDDEN FINDING — H2" }],
    },
  ],
};

describe("GeoResult", () => {
  it("toplam skoru basar", () => {
    render(<GeoResult result={RESULT} signals={SIGNALS} locale="tr" />);
    expect(screen.getByText("72")).toBeTruthy();
  });

  it("bant etiketini basar (TR)", () => {
    render(<GeoResult result={RESULT} signals={SIGNALS} locale="tr" />);
    expect(screen.getByText("İyi")).toBeTruthy();
  });

  it("bant etiketini doğru dile çevirir (EN)", () => {
    render(<GeoResult result={RESULT} signals={SIGNALS} locale="en" />);
    expect(screen.getByText("Good")).toBeTruthy();
  });

  it("5 kalemin rozetini (başlık + durum) basar", () => {
    render(<GeoResult result={RESULT} signals={SIGNALS} locale="tr" />);
    expect(SIGNALS).toHaveLength(5);
    for (const signal of SIGNALS) {
      expect(screen.getByText(signal.title.tr)).toBeTruthy();
    }
    // Durum etiketleri — motorun "pass"/"partial"/"fail" değerlerinin
    // TOOLS FAQ'ünde zaten kurulu TR karşılığı: geçti/kısmen/kaldı.
    expect(screen.getAllByText("Geçti").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kısmen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Kaldı").length).toBeGreaterThan(0);
  });

  it("her kalemin summary cümlesini basar", () => {
    render(<GeoResult result={RESULT} signals={SIGNALS} locale="tr" />);
    for (const check of RESULT.checks) {
      expect(screen.getByText(check.summary.tr)).toBeTruthy();
    }
  });

  it("findings HİÇBİR koşulda render edilmez", () => {
    render(<GeoResult result={RESULT} signals={SIGNALS} locale="tr" />);
    for (const check of RESULT.checks) {
      for (const finding of check.findings) {
        expect(screen.queryByText(finding.tr)).toBeNull();
        expect(screen.queryByText(finding.en)).toBeNull();
      }
    }
    expect(document.body.textContent).not.toContain("GİZLİ BULGU");
  });
});
