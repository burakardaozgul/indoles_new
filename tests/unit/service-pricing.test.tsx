import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServicePricing } from "@/components/marketing/service-pricing";
import type { ServiceContent } from "@/lib/content/types";

type RetainerPlans = NonNullable<ServiceContent["retainerPlans"]>;

const retainerPlans: RetainerPlans = {
  title: {
    tr: "Performans pazarlama yönetiminde üç plan.",
    en: "Three plans for performance marketing management.",
  },
  lede: {
    tr: "Kapsam bütçeyle değil, kanal sayısı ve üretim derinliğiyle büyür.",
    en: "Scope grows with channel count and production depth, not with budget alone.",
  },
  note: {
    tr: "Fiyatlar aylıktır; KDV dahil değildir.",
    en: "Prices are monthly and exclude VAT.",
  },
  plans: [
    {
      key: "giris",
      name: { tr: "Giriş", en: "Starter" },
      monthlyTRY: 45000,
      summary: {
        tr: "Sosyal medya, temel içerik ve sınırlı SEO'yu tek ritimde toplar.",
        en: "Brings social media, core content and limited-scope SEO into one rhythm.",
      },
      audience: {
        tr: "Reklamı yeni sistemleştiren işletmeler için.",
        en: "For businesses systemising their advertising for the first time.",
      },
      spotlight: {
        title: { tr: "Ayda 1 gün çekim", en: "One shoot day a month" },
        description: {
          tr: "Kreatif ihtiyaçlar için aylık çekim planlaması.",
          en: "Monthly shoot planning for creative needs.",
        },
      },
      features: [
        { tr: "Sosyal medya yönetimi", en: "Social media management" },
        { tr: "Google Ads yönetimi", en: "Google Ads management" },
      ],
    },
    {
      key: "standart",
      name: { tr: "Standart", en: "Standard" },
      monthlyTRY: 75000,
      featured: true,
      summary: {
        tr: "İçerik üretimini üç reklam kanalıyla birleştirir.",
        en: "Combines content production with three ad channels.",
      },
      audience: {
        tr: "Birden fazla reklam kanalı çalışan işletmeler için.",
        en: "For businesses running more than one ad channel.",
      },
      baseline: {
        tr: "Giriş'teki her şey, artı:",
        en: "Everything in Starter, plus:",
      },
      features: [{ tr: "TikTok reklam yönetimi", en: "TikTok ad management" }],
    },
  ],
};

describe("ServicePricing", () => {
  it("başlığı, lede'yi ve iki plan adını basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(
      screen.getByRole("heading", { name: /üç plan/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/kanal sayısı ve üretim derinliğiyle/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Giriş" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Standart" }),
    ).toBeInTheDocument();
  });

  it("fiyatı tr-TR biçiminde aylık etiketiyle basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(screen.getByText("₺ 45.000")).toBeInTheDocument();
    expect(screen.getByText("₺ 75.000")).toBeInTheDocument();
    expect(screen.getAllByText(/aylık/i).length).toBeGreaterThanOrEqual(2);
  });

  it("öne çıkan planda 'Önerilen plan' çipini yalnız bir kez basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(screen.getAllByText("Önerilen plan")).toHaveLength(1);
  });

  it("çekim günü spotlight bloğunu başlık + açıklamayla basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(screen.getByText("Ayda 1 gün çekim")).toBeInTheDocument();
    expect(
      screen.getByText("Kreatif ihtiyaçlar için aylık çekim planlaması."),
    ).toBeInTheDocument();
  });

  it("merdiven satırını yalnız baseline'ı olan planda basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(screen.getByText("Giriş'teki her şey, artı:")).toBeInTheDocument();
  });

  it("özellikleri liste öğesi olarak basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("KDV notunu basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    expect(
      screen.getByText("Fiyatlar aylıktır; KDV dahil değildir."),
    ).toBeInTheDocument();
  });

  it("her plan için teklif CTA'sını iletişim sayfasına bağlar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="tr" />);
    const links = screen.getAllByRole("link", { name: /teklif al/i });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/tr/iletisim");
    }
  });

  it("EN locale'de adları, CTA'yı ve notu İngilizce basar", () => {
    render(<ServicePricing retainerPlans={retainerPlans} locale="en" />);
    expect(
      screen.getByRole("heading", { name: "Starter" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Everything in Starter, plus:")).toBeInTheDocument();
    expect(
      screen.getByText("Prices are monthly and exclude VAT."),
    ).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: /get a quote/i });
    expect(links[0]).toHaveAttribute("href", "/en/contact");
  });
});
