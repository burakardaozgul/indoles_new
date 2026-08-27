import { describe, it, expect } from "vitest";
import {
  organizationLd,
  breadcrumbLd,
  caseStudyLd,
  faqLd,
  personLd,
  professionalServiceLd,
  webPageLd,
  webSiteLd,
  serviceLd,
} from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";
import { COMPANY } from "@/lib/content/company";

describe("organizationLd", () => {
  it("Organization tipinde ve yasal adı taşır", () => {
    const ld = organizationLd() as Record<string, unknown>;
    expect(ld["@type"]).toBe("Organization");
    expect(ld.legalName).toBe("İndoles Yazılım A.Ş.");
  });

  it("sameAs'i COMPANY.social'daki her profille doldurur", () => {
    const ld = organizationLd() as Record<string, any>;
    expect(ld.sameAs).toEqual(Object.values(COMPANY.social));
    expect(ld.sameAs).toContain(COMPANY.social.linkedin);
  });
});

describe("webSiteLd", () => {
  it("Organization'a publisher olarak @id ile bağlanır", () => {
    const ld = webSiteLd() as Record<string, any>;
    expect(ld["@type"]).toBe("WebSite");
    expect(ld["@id"]).toBe(`${SITE_URL}/#website`);
    expect(ld.publisher["@id"]).toBe(`${SITE_URL}/#organization`);
  });

  it("iki dili birden listeler — tek WebSite varlığı iki locale'de yayınlanıyor", () => {
    const ld = webSiteLd() as Record<string, any>;
    expect(ld.inLanguage).toEqual(["tr-TR", "en-US"]);
  });

  it("potentialAction basmaz — site içi arama yok, olmayan özellik iddia edilmez", () => {
    const ld = webSiteLd() as Record<string, any>;
    expect(ld.potentialAction).toBeUndefined();
  });
});

describe("professionalServiceLd", () => {
  it("Organization ile aynı @id'yi taşır — tek varlık, daha özgül tip", () => {
    const ld = professionalServiceLd() as Record<string, any>;
    expect(ld["@type"]).toBe("ProfessionalService");
    expect(ld["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(ld.legalName).toBe("İndoles Yazılım A.Ş.");
  });

  it("geo'yu ondalık dereceye çevirir — COMPANY.geo insan-okur biçimde", () => {
    const ld = professionalServiceLd() as Record<string, any>;
    expect(ld.geo["@type"]).toBe("GeoCoordinates");
    expect(ld.geo.latitude).toBeCloseTo(41.0082, 4);
    expect(ld.geo.longitude).toBeCloseTo(28.9784, 4);
  });

  it("iletişim kanallarını künyeyle aynı kaynaktan basar", () => {
    // Bu test önce "telefon basılmaz"ı doğruluyordu: numara placeholder
    // desenindeydi ve doğrulanmamış numara şemaya girmez. Numara
    // 2026-08-24'te doğrulandı; kural değişmedi, verinin durumu değişti.
    const ld = professionalServiceLd() as Record<string, any>;
    expect(ld.email).toBe(COMPANY.email);
    expect(ld.telephone).toBe(COMPANY.phone);
  });

  it("teyit edilmemiş açık adresi hâlâ basmaz", () => {
    // Kural duruyor: eksik alan, uydurulmuş alandan iyidir.
    const ld = professionalServiceLd() as Record<string, any>;
    expect(ld.address.streetAddress).toBeUndefined();
    expect(ld.address.addressLocality).toBe("İstanbul");
  });

  it("çalışma saatleri görünen COMPANY.hours ile aynı aralığı söyler", () => {
    const ld = professionalServiceLd() as Record<string, any>;
    const spec = ld.openingHoursSpecification[0];
    expect(spec.dayOfWeek).toHaveLength(5);
    expect(COMPANY.hours.tr).toContain(spec.opens);
    expect(COMPANY.hours.tr).toContain(spec.closes);
  });
});

describe("caseStudyLd", () => {
  const INPUT = {
    headline: "E-ticarette 6 günde 1,5 milyon dolar gelir.",
    description: "Ölçüm altyapısı yeniden kuruldu, kampanya açıldı.",
    path: "/tr/vakalar/soylu-avm-e-ticaret-buyume",
    locale: "tr" as const,
    clientName: "SOYLU AVM",
    clientSector: "E-ticaret ve perakende",
  };

  it("Article tipinde ve yayıncı/yazar olarak INDOLES'e bağlanır", () => {
    const ld = caseStudyLd(INPUT) as Record<string, any>;
    expect(ld["@type"]).toBe("Article");
    expect(ld.author["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(ld.publisher["@id"]).toBe(`${SITE_URL}/#organization`);
  });

  it("müşteriyi Organization, sektörü Thing olarak about'a koyar", () => {
    const ld = caseStudyLd(INPUT) as Record<string, any>;
    expect(ld.about).toEqual([
      { "@type": "Organization", name: "SOYLU AVM" },
      { "@type": "Thing", name: "E-ticaret ve perakende" },
    ]);
  });

  it("tarih verilmezse datePublished basmaz — vaka verisinde ISO tarih yok", () => {
    const ld = caseStudyLd(INPUT) as Record<string, any>;
    expect(ld.datePublished).toBeUndefined();
    expect(ld.dateModified).toBeUndefined();
  });

  it("datePublished verilir dateModified verilmezse ikisini eşitler", () => {
    const ld = caseStudyLd({
      ...INPUT,
      datePublished: "2024-07-01",
    }) as Record<string, any>;
    expect(ld.dateModified).toBe("2024-07-01");
  });

  it("görseli mutlak URL'e çevirir, yoksa alanı hiç basmaz", () => {
    expect(
      (caseStudyLd(INPUT) as Record<string, any>).image,
    ).toBeUndefined();
    const withImage = caseStudyLd({
      ...INPUT,
      imagePath: "/work/soylu-avm/kapak.jpg",
    }) as Record<string, any>;
    expect(withImage.image).toBe(`${SITE_URL}/work/soylu-avm/kapak.jpg`);
  });
});

describe("personLd", () => {
  const INPUT = {
    name: "Burak Arda Özgül",
    jobTitle: "Kurucu · Marka Stratejisti ve Kreatif Direktör",
    description: "Marka stratejisi ve performans pazarlamayı aynı masada tutar.",
    path: "/tr/danismanlar/burak-ozgul",
    knowsAbout: ["Marka stratejisi", "Performans pazarlama"],
  };

  it("worksFor ile Organization'a bağlanır ve @id sayfaya çapalıdır", () => {
    const ld = personLd(INPUT) as Record<string, any>;
    expect(ld["@type"]).toBe("Person");
    expect(ld.worksFor["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(ld["@id"]).toBe(`${SITE_URL}/tr/danismanlar/burak-ozgul#person`);
    // WebPage düğümü aynı sayfa URL'ini @id olarak kullanıyor: çakışmamalı.
    expect(ld["@id"]).not.toBe(ld.url);
  });

  it("LinkedIn'i sameAs dizisine alır, yoksa alanı hiç basmaz", () => {
    expect((personLd(INPUT) as Record<string, any>).sameAs).toBeUndefined();
    const withLinkedin = personLd({
      ...INPUT,
      sameAs: "https://www.linkedin.com/in/burakardaozgul",
    }) as Record<string, any>;
    expect(withLinkedin.sameAs).toEqual([
      "https://www.linkedin.com/in/burakardaozgul",
    ]);
  });

  it("uzmanlık boşsa knowsAbout koymaz", () => {
    const ld = personLd({ ...INPUT, knowsAbout: [] }) as Record<string, any>;
    expect(ld.knowsAbout).toBeUndefined();
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

  it("aylık planı UnitPriceSpecification (MON) ile, paketi PriceSpecification ile yazar", () => {
    const ld = serviceLd({
      ...INPUT,
      offers: [
        ...INPUT.offers,
        {
          name: "Performans pazarlama — Standart",
          priceTRY: 75000,
          monthly: true,
          path: "/tr/hizmetler/performans-pazarlama",
        },
      ],
    }) as Record<string, any>;
    const items = ld.hasOfferCatalog.itemListElement;
    const pkg = items[0];
    const monthly = items[1];
    expect(pkg.priceSpecification["@type"]).toBe("PriceSpecification");
    expect(monthly.priceSpecification["@type"]).toBe("UnitPriceSpecification");
    expect(monthly.priceSpecification.unitCode).toBe("MON");
    expect(monthly.priceSpecification.price).toBe(75000);
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

describe("ProfessionalService — telefon", () => {
  it("doğrulanmış numarayı şemaya basar", () => {
    // Numara placeholder olduğu sürece bilinçli olarak basılmıyordu;
    // gerçek numara geldi (Burak, 2026-08-24).
    const ld = professionalServiceLd() as { telephone?: string };
    expect(ld.telephone).toBe(COMPANY.phone);
  });

  it("şemadaki numara künyedekiyle aynı kaynaktan gelir", () => {
    // NAP tutarlılığı (lokal SEO'nun temeli) ancak tek kaynakla korunur.
    const ld = professionalServiceLd() as { telephone?: string };
    expect(ld.telephone).not.toBeUndefined();
    expect(ld.telephone).toMatch(/^\+90/);
  });
});
