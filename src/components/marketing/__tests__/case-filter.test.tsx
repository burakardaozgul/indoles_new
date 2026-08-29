import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { CaseFilter } from "../case-filter";
import type { CaseStudyContent } from "@/lib/content/types";

/**
 * Sabit fixture — üç vaka, iki problem tipi ("customer_acquisition" iki kez,
 * "efficiency_loss" bir kez). "market_expansion", "cost_optimization" ve
 * "digital_transformation" kasten yok: boş çip basılmadığını doğrulamak için.
 */
const CASES: CaseStudyContent[] = [
  {
    slug: { tr: "vaka-a", en: "case-a" },
    clientName: { tr: "A Şirketi", en: "Company A" },
    clientSector: { tr: "E-ticaret", en: "E-commerce" },
    problemType: "customer_acquisition",
    pillar: "growth",
    title: { tr: "A başlığı", en: "A title" },
    lead: { tr: "A giriş", en: "A lead" },
    challenge: { tr: ["x"], en: ["x"] },
    approach: { tr: ["x"], en: ["x"] },
    outcome: { tr: ["x"], en: ["x"] },
    metrics: [{ value: { tr: "2×", en: "2×" }, label: { tr: "Satış", en: "Sales" } }],
    durationWeeks: 4,
  },
  {
    slug: { tr: "vaka-b", en: "case-b" },
    clientName: { tr: "B Şirketi", en: "Company B" },
    clientSector: { tr: "Perakende", en: "Retail" },
    problemType: "customer_acquisition",
    pillar: "growth",
    title: { tr: "B başlığı", en: "B title" },
    lead: { tr: "B giriş", en: "B lead" },
    challenge: { tr: ["x"], en: ["x"] },
    approach: { tr: ["x"], en: ["x"] },
    outcome: { tr: ["x"], en: ["x"] },
    metrics: [{ value: { tr: "3×", en: "3×" }, label: { tr: "Satış", en: "Sales" } }],
    durationWeeks: 4,
  },
  {
    slug: { tr: "vaka-c", en: "case-c" },
    clientName: { tr: "C Şirketi", en: "Company C" },
    clientSector: { tr: "Üretim", en: "Manufacturing" },
    problemType: "efficiency_loss",
    pillar: "build",
    title: { tr: "C başlığı", en: "C title" },
    lead: { tr: "C giriş", en: "C lead" },
    challenge: { tr: ["x"], en: ["x"] },
    approach: { tr: ["x"], en: ["x"] },
    outcome: { tr: ["x"], en: ["x"] },
    metrics: [{ value: { tr: "5×", en: "5×" }, label: { tr: "Verim", en: "Efficiency" } }],
    durationWeeks: 4,
  },
];

const LABELS = {
  groupLabel: "Problem tipine göre süz",
  all: "Tümü",
  resultCount: "{count} vaka.",
};

describe("CaseFilter", () => {
  it("her üç vakayı da başlangıçta (JS'siz de erişilebilir olacak şekilde) DOM'a basar", () => {
    render(<CaseFilter cases={CASES} locale="tr" labels={LABELS} />);
    // Sunucu HTML'inde 3 vaka da bulunmalı — filtre yalnız görünürlüğü CSS ile yönetir.
    expect(screen.getByText("A başlığı")).toBeInTheDocument();
    expect(screen.getByText("B başlığı")).toBeInTheDocument();
    expect(screen.getByText("C başlığı")).toBeInTheDocument();
  });

  it("yalnızca veride karşılığı olan problem tiplerinin çipini basar", () => {
    render(<CaseFilter cases={CASES} locale="tr" labels={LABELS} />);
    const group = screen.getByRole("group", { name: LABELS.groupLabel });
    // Tümü + Müşteri edinimi + Verim kaybı = 3 çip. Pazara açılma vb. hiç yok.
    expect(within(group).getAllByRole("button")).toHaveLength(3);
    expect(within(group).getByRole("button", { name: /Tümü/ })).toBeInTheDocument();
    expect(
      within(group).getByRole("button", { name: /Müşteri edinimi/ })
    ).toBeInTheDocument();
    expect(
      within(group).getByRole("button", { name: /Verim kaybı/ })
    ).toBeInTheDocument();
    expect(
      within(group).queryByRole("button", { name: /Pazara açılma/ })
    ).not.toBeInTheDocument();
  });

  it("bir problem tipi seçilince eşleşmeyen kartlar `hidden` olur, DOM'dan çıkmaz", async () => {
    const { container } = render(
      <CaseFilter cases={CASES} locale="tr" labels={LABELS} />
    );
    const group = screen.getByRole("group", { name: LABELS.groupLabel });
    const efficiencyChip = within(group).getByRole("button", {
      name: /Verim kaybı/,
    });

    fireEvent.click(efficiencyChip);

    const linkA = container.querySelector('[data-problem-type="customer_acquisition"][href*="vaka-a"]');
    const linkC = container.querySelector('[data-problem-type="efficiency_loss"][href*="vaka-c"]');
    expect(linkA).toHaveAttribute("hidden");
    expect(linkC).not.toHaveAttribute("hidden");
    // İçerik hâlâ DOM'da — CSS/JS'siz crawler da okuyabilir.
    expect(screen.getByText("A başlığı")).toBeInTheDocument();
  });

  it("seçili çip `aria-pressed=true` taşır, diğerleri false", async () => {
    render(<CaseFilter cases={CASES} locale="tr" labels={LABELS} />);
    const group = screen.getByRole("group", { name: LABELS.groupLabel });
    const allChip = within(group).getByRole("button", { name: /Tümü/ });
    const efficiencyChip = within(group).getByRole("button", {
      name: /Verim kaybı/,
    });

    expect(allChip).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(efficiencyChip);
    expect(efficiencyChip).toHaveAttribute("aria-pressed", "true");
    expect(allChip).toHaveAttribute("aria-pressed", "false");
  });

  it("Tümü'ye dönünce tüm kartlar tekrar görünür olur", async () => {
    const { container } = render(
      <CaseFilter cases={CASES} locale="tr" labels={LABELS} />
    );
    const group = screen.getByRole("group", { name: LABELS.groupLabel });
    fireEvent.click(within(group).getByRole("button", { name: /Verim kaybı/ }));
    fireEvent.click(within(group).getByRole("button", { name: /Tümü/ }));

    const linkA = container.querySelector('[href*="vaka-a"]');
    expect(linkA).not.toHaveAttribute("hidden");
  });

  it("chip'ler klavye ile odaklanabilir buton semantiği taşır (min 44px dokunma hedefi)", () => {
    render(<CaseFilter cases={CASES} locale="tr" labels={LABELS} />);
    const group = screen.getByRole("group", { name: LABELS.groupLabel });
    for (const btn of within(group).getAllByRole("button")) {
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).toHaveAttribute("type", "button");
    }
  });

  it("TR ve EN'de aynı sayıda çip render eder, etiketler yerelleşir", () => {
    const enLabels = { groupLabel: "Filter by problem type", all: "All", resultCount: "{count} cases." };
    render(<CaseFilter cases={CASES} locale="en" labels={enLabels} />);
    const group = screen.getByRole("group", { name: enLabels.groupLabel });
    expect(within(group).getAllByRole("button")).toHaveLength(3);
    expect(within(group).getByRole("button", { name: /All/ })).toBeInTheDocument();
    expect(
      within(group).getByRole("button", { name: /Customer acquisition/ })
    ).toBeInTheDocument();
  });
});
