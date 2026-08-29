import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CaseCard } from "@/components/marketing/case-card";
import { CASES } from "@/lib/content/cases";
import { localeHref } from "@/lib/i18n/locale-href";

const LOCALES = ["tr", "en"] as const;

/**
 * Vaka iç bağlantılarının 307'siz olduğu kuralı (2026-08-29).
 *
 * Slug lokalizasyonundan önce vaka linkleri ham `/${locale}/vakalar/${slug}`
 * olarak basılıyordu. TR'de doğru, EN'de değil: next-intl middleware
 * `/en/vakalar/...` adresini `/en/case-studies/...`e 307 ile çeviriyordu, yani
 * sitedeki HER iç EN vaka bağlantısı bir yönlendirme atlaması yiyordu —
 * tarama bütçesi ve link equity'nin sessiz kaybı (docs/08 §1, segment
 * çevirisi disiplini).
 *
 * Kanonik çözüm `localeHref`tir (`article-card.tsx` ile aynı desen): segmenti
 * çevirir, locale'e uygun slug'ı olduğu gibi taşır. Bu dosya kuralı hem
 * gerçek render üzerinden (`CaseCard`) hem de sunucu bileşenlerinin
 * kullandığı çağrı şekli üzerinden kilitler.
 */
describe("vaka iç bağlantıları — middleware 307'si olmadan", () => {
  it("CaseCard her locale'de doğrudan nihai adrese link verir", () => {
    for (const c of CASES) {
      for (const loc of LOCALES) {
        const { container, unmount } = render(
          <CaseCard c={c} locale={loc} />,
        );
        const href = container.querySelector("a")?.getAttribute("href");
        const expected =
          loc === "tr"
            ? `/tr/vakalar/${c.slug.tr}`
            : `/en/case-studies/${c.slug.en}`;
        expect(href, `${c.slug.tr}/${loc}`).toBe(expected);
        unmount();
      }
    }
  });

  it("CaseCard EN'de ham TR segmentini (/en/vakalar) hiç basmaz", () => {
    for (const c of CASES) {
      const { container, unmount } = render(<CaseCard c={c} locale="en" />);
      const href = container.querySelector("a")?.getAttribute("href") ?? "";
      expect(href, c.slug.tr).not.toContain("/en/vakalar");
      unmount();
    }
  });

  /**
   * `cases-section.tsx`, `vakalar/page.tsx` (featured), `pillar-detail.tsx` ve
   * `paketler/[slug]/page.tsx` sunucu bileşeni olduğu için burada render
   * edilmiyor; hepsi aynı çağrı şeklini kullanıyor:
   * `localeHref(\`/vakalar/${slug[loc]}\`, loc)`. Şeklin çıktısı burada
   * doğrulanır — bileşenlerin o şekli kullandığını typecheck + build garanti
   * eder.
   */
  it("localeHref çağrı şekli 9 vakanın tamamında nihai adresi üretir", () => {
    for (const c of CASES) {
      expect(localeHref(`/vakalar/${c.slug.tr}`, "tr")).toBe(
        `/tr/vakalar/${c.slug.tr}`,
      );
      expect(localeHref(`/vakalar/${c.slug.en}`, "en")).toBe(
        `/en/case-studies/${c.slug.en}`,
      );
    }
  });

  it("liste bağlantısı da çevrilir — /en/vakalar üretilmez", () => {
    expect(localeHref("/vakalar", "tr")).toBe("/tr/vakalar");
    expect(localeHref("/vakalar", "en")).toBe("/en/case-studies");
  });
});
