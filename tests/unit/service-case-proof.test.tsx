import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCaseProof } from "@/components/marketing/service-case-proof";

const props = {
  heading: "Bu işin sonucu",
  lead: "Ölçüm altyapısını yeniden kurduk, sonra kampanyayı açtık.",
  sourceLabel: "Kaynak",
  clientName: "SOYLU AVM",
  caseTitle: "E-ticarette 6 günde 1,5 milyon dolar gelir.",
  href: "/tr/vakalar/soylu-avm-e-ticaret-buyume",
  metrics: [
    {
      value: "1,5M $",
      label: "Gelir",
      context: "Kampanyanın ilk 6 günü",
    },
    { value: "~1:1000", label: "Reklam getirisi" },
  ],
};

describe("ServiceCaseProof", () => {
  it("metrik değerlerini gövdeye basar", () => {
    render(<ServiceCaseProof {...props} />);
    expect(screen.getByText("1,5M $")).toBeInTheDocument();
    expect(screen.getByText("~1:1000")).toBeInTheDocument();
  });

  it("her metriği etiketiyle birlikte verir", () => {
    render(<ServiceCaseProof {...props} />);
    expect(screen.getByText("Gelir")).toBeInTheDocument();
    expect(screen.getByText("Reklam getirisi")).toBeInTheDocument();
  });

  it("bağlam verilen metrikte ölçüm çerçevesini basar, verilmeyende basmaz", () => {
    const { container } = render(<ServiceCaseProof {...props} />);
    expect(screen.getByText("Kampanyanın ilk 6 günü")).toBeInTheDocument();
    // 2 değer + 1 bağlam = 3 dd; bağlamsız metrik fazladan dd üretmez.
    expect(container.querySelectorAll("dd")).toHaveLength(3);
  });

  it("rakamı müşteriye ve vakaya atfeder — kaynaksız metrik yok", () => {
    render(<ServiceCaseProof {...props} />);
    const link = screen.getByRole("link", {
      name: /SOYLU AVM — E-ticarette 6 günde 1,5 milyon dolar gelir\./,
    });
    expect(link).toHaveAttribute(
      "href",
      "/tr/vakalar/soylu-avm-e-ticaret-buyume",
    );
    expect(screen.getByText("Kaynak")).toBeInTheDocument();
  });

  it("başlığı h3 olarak basar — 'Devamı' bölümünün h2'sinden sonra seviye atlamaz", () => {
    render(<ServiceCaseProof {...props} />);
    expect(
      screen.getByRole("heading", { level: 3, name: /Bu işin sonucu/ }),
    ).toBeInTheDocument();
  });

  it("EN locale metinlerini olduğu gibi geçirir", () => {
    render(
      <ServiceCaseProof
        {...props}
        heading="What the work produced"
        sourceLabel="Source"
        caseTitle="$1.5M revenue in 6 days, e-commerce."
        metrics={[{ value: "1.5M $", label: "Revenue", context: "First 6 days" }]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "What the work produced" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("First 6 days")).toBeInTheDocument();
  });
});
