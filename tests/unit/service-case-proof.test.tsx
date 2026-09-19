import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCaseProof } from "@/components/marketing/service-case-proof";

const soylu = {
  lead: "Ölçüm altyapısını yeniden kurduk, sonra kampanyayı açtık.",
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

const gymwolves = {
  lead: "Veri akışını onardık, dönüşüm hunisini yeniden kurduk.",
  clientName: "GYMWOLVES",
  caseTitle: "Spor giyimde 3 ayda 12 kat satış.",
  href: "/tr/vakalar/gymwolves-12-kat-satis",
  metrics: [
    { value: "12×", label: "Satış", context: "3 ayda" },
    { value: "8×", label: "Etkileşim" },
  ],
};

const props = {
  heading: "Bu işin sonucu",
  sourceLabel: "Kaynak",
  cases: [soylu],
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
        heading="What the work produced"
        sourceLabel="Source"
        cases={[
          {
            ...soylu,
            caseTitle: "$1.5M revenue in 6 days, e-commerce.",
            metrics: [
              { value: "1.5M $", label: "Revenue", context: "First 6 days" },
            ],
          },
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "What the work produced" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("First 6 days")).toBeInTheDocument();
  });
});

/**
 * Şerit 2026-09-18'de iki vakaya çıktı (Burak kararı). Tek başlık, iki
 * bağımsız künye; düzen tek kartta bölünmez.
 */
describe("ServiceCaseProof — iki vaka", () => {
  const twoUp = {
    heading: "Bu işlerin sonucu",
    sourceLabel: "Kaynak",
    cases: [gymwolves, soylu],
  };

  it("iki vakanın metriklerini de basar", () => {
    render(<ServiceCaseProof {...twoUp} />);
    expect(screen.getByText("12×")).toBeInTheDocument();
    expect(screen.getByText("1,5M $")).toBeInTheDocument();
  });

  it("her vakayı kendi künyesiyle atfeder — iki ayrı bağlantı", () => {
    render(<ServiceCaseProof {...twoUp} />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/tr/vakalar/gymwolves-12-kat-satis",
      "/tr/vakalar/soylu-avm-e-ticaret-buyume",
    ]);
  });

  it("künye sırası çağıran tarafın verdiği sıradır", () => {
    render(<ServiceCaseProof {...twoUp} />);
    const [first] = screen.getAllByRole("link");
    expect(first).toHaveTextContent("GYMWOLVES");
  });

  it("tek başlık basar — h3 tekrar etmez", () => {
    render(<ServiceCaseProof {...twoUp} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
  });

  it("iki kart masaüstünde yan yana, tek kartta ızgara bölünmez", () => {
    const { container: two } = render(<ServiceCaseProof {...twoUp} />);
    expect(two.querySelector(".lg\\:grid-cols-2")).not.toBeNull();

    const { container: one } = render(<ServiceCaseProof {...props} />);
    expect(one.querySelector(".lg\\:grid-cols-2")).toBeNull();
  });

  it("her vaka kendi dl'ini taşır — metrikler tek listeye karışmaz", () => {
    const { container } = render(<ServiceCaseProof {...twoUp} />);
    expect(container.querySelectorAll("dl")).toHaveLength(2);
  });
});
