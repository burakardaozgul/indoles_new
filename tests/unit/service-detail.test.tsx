import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScopeColumns } from "@/components/marketing/scope-columns";

describe("ScopeColumns", () => {
  const props = {
    includes: [
      { title: "Kanal denetimi", description: "Hesap yapısı incelenir." },
      { title: "Bütçe dağılımı", description: "Tavanlar kurala bağlanır." },
    ],
    excludes: ["İçerik üretimi"],
    locale: "tr" as const,
  };

  it("iki sütunu da başlıkla basar", () => {
    render(<ScopeColumns {...props} />);
    expect(screen.getByRole("heading", { name: /kapsar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /kapsamaz/i }),
    ).toBeInTheDocument();
  });

  it("her maddeyi liste öğesi olarak basar", () => {
    render(<ScopeColumns {...props} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("kapsar maddesini başlık + açıklama olarak basar", () => {
    render(<ScopeColumns {...props} />);
    expect(
      screen.getByRole("heading", { name: "Kanal denetimi" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hesap yapısı incelenir.")).toBeInTheDocument();
  });

  it("EN locale'de başlıkları İngilizce verir", () => {
    render(<ScopeColumns {...props} locale="en" />);
    expect(
      screen.getByRole("heading", { name: /what's included/i }),
    ).toBeInTheDocument();
  });

  it("kapsamaz boşsa o sütunu hiç basmaz", () => {
    render(<ScopeColumns {...props} excludes={[]} />);
    expect(
      screen.queryByRole("heading", { name: /kapsamaz/i }),
    ).not.toBeInTheDocument();
  });

  it("persona varyantı üretmez — hizmet detay tek sesli", () => {
    const { container } = render(<ScopeColumns {...props} />);
    expect(container.querySelectorAll("[data-persona-variant]")).toHaveLength(0);
  });
});
