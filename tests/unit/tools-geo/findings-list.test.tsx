import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FindingsList, orderForFixList } from "@/components/tools/findings-list";
import { TOOLS } from "@/lib/content/tools";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

const SIGNALS = TOOLS[0]!.signals;
const CHECKS: GeoCheckResult[] = [
  { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "a", en: "a" }, findings: [{ tr: "AI notu", en: "AI note" }] },
  { id: "llms-txt", score: 10, max: 15, status: "partial", summary: { tr: "b", en: "b" }, findings: [{ tr: "llms bulgusu", en: "llms finding" }] },
  { id: "json-ld", score: 0, max: 20, status: "fail", summary: { tr: "c", en: "c" }, findings: [{ tr: "JSON-LD bulgusu", en: "JSON-LD finding" }] },
  { id: "lang-signals", score: 15, max: 15, status: "pass", summary: { tr: "d", en: "d" }, findings: [] },
  { id: "question-h2", score: 0, max: 25, status: "fail", summary: { tr: "e", en: "e" }, findings: [{ tr: "Soru bulgusu 1", en: "Q1" }, { tr: "Soru bulgusu 2", en: "Q2" }] },
];

describe("orderForFixList", () => {
  it("kalan/kısmen önce, kaybedilen puan azalan; geçenler ayrı", () => {
    const { todo, passed } = orderForFixList(CHECKS, SIGNALS);
    expect(todo.map((c) => c.id)).toEqual(["question-h2", "json-ld", "llms-txt"]);
    expect(passed.map((c) => c.id)).toEqual(["ai-access", "lang-signals"]);
  });
});

describe("FindingsList", () => {
  it("numaralı düzeltme listesi, geçenler katlı grupta, CTA yuvası basılır", () => {
    render(<FindingsList checks={CHECKS} signals={SIGNALS} locale="tr" ctaSlot={<button type="button">Görüşme planlayın</button>} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("01");
    expect(items[0]).toHaveTextContent("Soru başlıkları");
    expect(items[0]).toHaveTextContent("0 / 25");
    expect(screen.getByText("Soru bulgusu 2")).toBeInTheDocument();
    expect(screen.getByText("Geçen sinyaller (2)")).toBeInTheDocument();
    expect(screen.getByText("AI notu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Görüşme planlayın" })).toBeInTheDocument();
  });
});
