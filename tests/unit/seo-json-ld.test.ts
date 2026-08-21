import { describe, it, expect } from "vitest";
import {
  organizationLd,
  breadcrumbLd,
  faqLd,
  webPageLd,
  serviceLd,
} from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

describe("organizationLd", () => {
  it("Organization tipinde ve yasal adı taşır", () => {
    const ld = organizationLd() as Record<string, unknown>;
    expect(ld["@type"]).toBe("Organization");
    expect(ld.legalName).toBe("İndoles Yazılım A.Ş.");
  });
});

describe("breadcrumbLd", () => {
  it("position'ları 1'den başlatır ve sırayla artırır", () => {
    const ld = breadcrumbLd([
      { name: "INDOLES", path: "/tr" },
      { name: "Hizmetler", path: "/tr/hizmetler" },
      { name: "CRO" },
    ]) as { itemListElement: Array<Record<string, unknown>> };
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
  });

  it("son öğeye item vermez — mevcut sayfa kendine link olmaz", () => {
    const ld = breadcrumbLd([
      { name: "INDOLES", path: "/tr" },
      { name: "CRO" },
    ]) as { itemListElement: Array<Record<string, unknown>> };
    const [first, last] = ld.itemListElement;
    expect(first!.item).toBe(`${SITE_URL}/tr`);
    expect(last!.item).toBeUndefined();
  });
});

describe("faqLd", () => {
  it("her soruyu Question, her cevabı Answer olarak sarar", () => {
    const ld = faqLd([
      { question: "Ne kadar sürer?", answer: "Dört hafta." },
    ]) as Record<string, any>;
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Dört hafta.");
  });

  it("soru yoksa null döner — boş FAQPage geçersiz şemadır", () => {
    expect(faqLd([])).toBeNull();
  });
});

describe("serviceLd", () => {
  const INPUT = {
    name: "CRO",
    description: "Dönüşüm oranı optimizasyonu.",
    serviceType: "Dönüşüm oranı optimizasyonu danışmanlığı",
    path: "/tr/hizmetler/cro",
    offers: [
      {
        name: "Büyüme Sprinti",
        priceTRY: 240000,
        durationWeeks: 4,
        path: "/tr/paketler/buyume-sprinti",
      },
    ],
  };

  it("Service tipinde ve sağlayıcıyı INDOLES'e bağlar", () => {
    const ld = serviceLd(INPUT) as Record<string, any>;
    expect(ld["@type"]).toBe("Service");
    expect(ld.provider["@type"]).toBe("Organization");
    expect(ld.areaServed).toBe("TR");
  });

  it("paketleri hasOfferCatalog altında gerçek fiyatla listeler", () => {
    const ld = serviceLd(INPUT) as Record<string, any>;
    const offer = ld.hasOfferCatalog.itemListElement[0];
    expect(offer.priceSpecification.price).toBe(240000);
    expect(offer.priceSpecification.priceCurrency).toBe("TRY");
  });

  it("paket yoksa hasOfferCatalog koymaz — boş katalog yanlış sinyal", () => {
    const ld = serviceLd({ ...INPUT, offers: [] }) as Record<string, any>;
    expect(ld.hasOfferCatalog).toBeUndefined();
  });

  it("iki dili birden availableLanguage'de listeler", () => {
    const ld = serviceLd(INPUT) as Record<string, any>;
    expect(ld.availableLanguage).toEqual(["tr", "en"]);
  });
});

describe("JsonLd script kaçışı", () => {
  it("`</script>` dizisini etiketten çıkamayacak hâle getirir", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { JsonLd } = await import("@/lib/seo/JsonLd");
    const { createElement } = await import("react");

    const html = renderToStaticMarkup(
      createElement(JsonLd, {
        graph: [faqLd([{ question: "S", answer: "</script><img onerror=x>" }])],
      }),
    );

    expect(html).not.toContain("</script><img");
    expect(html).toContain("\\u003c/script");
    // Kaçış JSON dizesi içinde geçerli — şema anlamı korunmalı.
    const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(JSON.parse(json)["@graph"][0].mainEntity[0].acceptedAnswer.text).toBe(
      "</script><img onerror=x>",
    );
  });

  it("tüm düğümler null ise hiç script basmaz", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { JsonLd } = await import("@/lib/seo/JsonLd");
    const { createElement } = await import("react");

    expect(renderToStaticMarkup(createElement(JsonLd, { graph: [null] }))).toBe(
      "",
    );
  });
});

describe("webPageLd", () => {
  it("inLanguage'ı locale'den alır", () => {
    const ld = webPageLd({
      name: "CRO",
      description: "x",
      path: "/tr/hizmetler/cro",
      locale: "tr",
    }) as Record<string, unknown>;
    expect(ld.inLanguage).toBe("tr-TR");
  });

  it("EN locale'de en-US verir", () => {
    const ld = webPageLd({
      name: "CRO",
      description: "x",
      path: "/en/services/cro",
      locale: "en",
    }) as Record<string, unknown>;
    expect(ld.inLanguage).toBe("en-US");
  });
});
