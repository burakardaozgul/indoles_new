import { COMPANY } from "@/lib/content/company";
import type { Locale } from "@/lib/content/types";
import { SITE_URL, absoluteUrl } from "./site";

/**
 * Organization düğümünün sabit kimliği.
 *
 * `@id` sayesinde grafikteki diğer düğümler (WebPage.isPartOf,
 * Service.provider) organizasyonu tekrar yazmak yerine referans veriyor.
 */
const ORG_ID = `${SITE_URL}/#organization`;

/**
 * WebSite düğümünün sabit kimliği. Organization'dan ayrı bir varlıktır:
 * biri yayıncı tüzel kişi, diğeri yayının kendisi.
 */
const WEBSITE_ID = `${SITE_URL}/#website`;

const IN_LANGUAGE: Record<Locale, string> = { tr: "tr-TR", en: "en-US" };

/**
 * `sameAs`: markanın doğrulanabilir dış profilleri.
 *
 * AI motorları entity'yi çapraz kaynak tutarlılığından öğreniyor
 * (docs/strateji §5); LinkedIn/Instagram/X adresleri zaten `COMPANY.social`
 * içinde tek kaynakta duruyordu, şema onları yalnızca işaret ediyor.
 * Boş bir `sameAs` dizisi "profil yok" değil "bağ kurulamadı" okunduğu için
 * hiç basılmaz.
 */
export function organizationLd() {
  const sameAs: string[] = Object.values(COMPANY.social).filter(
    (url) => url.length > 0,
  );
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "INDOLES",
    legalName: "İndoles Yazılım A.Ş.",
    url: SITE_URL,
    logo: absoluteUrl("/brand/indoles-logo-dark.png"),
    address: { "@type": "PostalAddress", addressCountry: "TR" },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * WebSite — yayının kendisi.
 *
 * `locale` almaz: tek site iki dilde yayınlanıyor ve düğümün `@id`si her
 * sayfada aynı. Sayfa başına farklı `inLanguage` basmak aynı varlık hakkında
 * çelişen ifadeler üretirdi; `serviceLd` ile aynı gerekçe. Sayfanın kendi
 * dili `WebPage.inLanguage`de duruyor.
 *
 * `potentialAction`/`SearchAction` YOK: site içi arama yok, olmayan bir
 * özelliği şemada iddia etmek yanlış veridir.
 */
export function webSiteLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "INDOLES",
    url: SITE_URL,
    inLanguage: [IN_LANGUAGE.tr, IN_LANGUAGE.en],
    publisher: { "@id": ORG_ID },
  };
}

/**
 * ProfessionalService — iletişim sayfasının yerel işletme yüzü.
 *
 * `@id` bilerek `ORG_ID`: INDOLES tek lokasyonlu, ProfessionalService da
 * Organization'ın alt tipi. Ayrı bir `@id` açmak aynı şirketi iki varlığa
 * bölerdi. Bu yüzden iletişim sayfasında `organizationLd()` yerine bu
 * kullanılır — grafikte aynı `@id`den iki düğüm bulunmaz.
 *
 * `telephone` 2026-08-24'te eklendi: numara o tarihe kadar placeholder
 * desenindeydi ve doğrulanmamış numara şemaya girmez. Artık künyeyle aynı
 * kaynaktan geliyor — NAP tutarlılığı ancak böyle korunur.
 *
 * Basılmayan alan: `streetAddress`. Açık adres teyit edilmedi; adres
 * yalnız sayfada görünen şehir kırılımında kalır. Eksik alan, uydurulmuş
 * alandan iyidir.
 */
export function professionalServiceLd() {
  return {
    ...organizationLd(),
    "@type": "ProfessionalService",
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      // `COMPANY.geo` insan-okur biçimde ("41.0082° N"); şema ondalık
      // derece ister. Değer şehir kırılımında, adresle aynı hassasiyette.
      latitude: parseFloat(COMPANY.geo.lat),
      longitude: parseFloat(COMPANY.geo.lon),
    },
    areaServed: "TR",
    availableLanguage: ["tr", "en"],
    // `COMPANY.hours` ("Pzt–Cum 09:00–18:00") aynı bilginin görünen ikizi;
    // ikisi ayrışırsa test yakalar (tests/unit/seo-json-ld.test.ts).
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };
}

/**
 * BreadcrumbList.
 *
 * Son öğe `item` almaz: mevcut sayfa kendine link vermez, Google bunu
 * "son kırıntı = bulunduğun yer" olarak okur.
 */
export function breadcrumbLd(items: Array<{ name: string; path?: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

/**
 * FAQPage.
 *
 * Boş listede `null` döner — soru içermeyen FAQPage geçersiz ve Search
 * Console'da uyarı üretir. `JsonLd` bileşeni null düğümleri eliyor.
 */
/**
 * Article (ADR-020). `dateModified` verilmezse `datePublished` kullanılır —
 * modified alanını boş bırakmak bazı araçlarda "hiç güncellenmedi" yerine
 * "bilinmiyor" okunuyor.
 */
export function articleLd({
  headline,
  description,
  path,
  locale,
  datePublished,
  dateModified,
  authorName,
  authorPath,
  articleSection,
  keywords,
}: {
  headline: string;
  description: string;
  path: string;
  locale: string;
  datePublished: string;
  dateModified?: string | undefined;
  authorName?: string | undefined;
  authorPath?: string | undefined;
  /** Yazının konu kümesi — insan-okur etiket (ADR-021). */
  articleSection?: string | undefined;
  /** Uzun kuyruk etiketler; virgülle birleşir (schema.org `keywords`). */
  keywords?: string[] | undefined;
}) {
  return {
    "@type": "Article",
    headline,
    description,
    inLanguage: locale,
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    // Konu ve etiketler cevap motorlarına yazının hangi kümeye ait olduğunu
    // söyler (ADR-021). Boşsa alan hiç basılmaz — boş dizi şema gürültüsü.
    ...(articleSection ? { articleSection } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    ...(authorName
      ? {
          author: {
            "@type": "Person",
            name: authorName,
            ...(authorPath ? { url: absoluteUrl(authorPath) } : {}),
          },
        }
      : {}),
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Vaka çalışması — `Article` olarak (docs/08 §8.4).
 *
 * schema.org'da CaseStudy yok; Google'ın tanıdığı en yakın tip `Article`.
 * `about` müşteriyi ve sektörü varlık olarak bağlar — vakanın kime ait
 * olduğu böyle makine-okunur hâle gelir.
 *
 * Tarih alanları opsiyonel ve verilmezse hiç basılmaz: vaka içeriğinde
 * (`CaseStudyContent`) ISO tarih yok, yalnız insan-okur `period` var.
 * Tarih uydurmak yanlış şemadır; eksik alan doğru şemadan iyidir.
 *
 * Metrikler (`1,5M $`, `+%150` gibi) bilerek dışarıda: `Article`ın bunları
 * doğru taşıyan bir alanı yok. Serbest metni `Rating`/`QuantitativeValue`
 * kılığına sokmak şema doğruluğunu alan sayısına feda etmek olurdu.
 */
export function caseStudyLd({
  headline,
  description,
  path,
  locale,
  clientName,
  clientSector,
  imagePath,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  locale: Locale;
  clientName: string;
  clientSector: string;
  imagePath?: string | undefined;
  datePublished?: string | undefined;
  dateModified?: string | undefined;
}) {
  return {
    "@type": "Article",
    headline,
    description,
    inLanguage: IN_LANGUAGE[locale],
    mainEntityOfPage: absoluteUrl(path),
    url: absoluteUrl(path),
    about: [
      { "@type": "Organization", name: clientName },
      { "@type": "Thing", name: clientSector },
    ],
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(imagePath ? { image: absoluteUrl(imagePath) } : {}),
    ...(datePublished
      ? { datePublished, dateModified: dateModified ?? datePublished }
      : {}),
  };
}

/**
 * Person — danışman detay sayfası.
 *
 * Kadro, E-E-A-T çarpanının taşıyıcısı (docs/strateji §5: "kadro = 10
 * entity"). `worksFor` her danışmanı aynı Organization düğümüne bağlar;
 * `sameAs` yalnız gerçekten LinkedIn profili olan isimde basılır.
 *
 * `@id` sayfa URL'ine çapalı (`#person`): WebPage düğümü sayfanın kendisi,
 * Person sayfanın konusu — ikisi aynı `@id`yi paylaşamaz.
 */
export function personLd({
  name,
  jobTitle,
  description,
  path,
  sameAs,
  knowsAbout,
}: {
  name: string;
  jobTitle: string;
  description: string;
  path: string;
  sameAs?: string | undefined;
  knowsAbout: string[];
}) {
  return {
    "@type": "Person",
    "@id": `${absoluteUrl(path)}#person`,
    name,
    jobTitle,
    description,
    url: absoluteUrl(path),
    worksFor: { "@id": ORG_ID },
    ...(sameAs ? { sameAs: [sameAs] } : {}),
    ...(knowsAbout.length > 0 ? { knowsAbout } : {}),
  };
}

export function faqLd(items: Array<{ question: string; answer: string }>) {
  if (items.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function webPageLd({
  name,
  description,
  path,
  locale,
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
  /** Alt tip gerektiren sayfalar için — örn. iletişimde "ContactPage". */
  type?: "WebPage" | "ContactPage";
}) {
  return {
    "@type": type,
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: IN_LANGUAGE[locale],
    isPartOf: { "@id": ORG_ID },
  };
}

/**
 * SoftwareApplication — interaktif araç sayfası (Görev 10).
 *
 * `@type` `SoftwareApplication`: araç tarayıcıda çalışan bir uygulama.
 * `applicationCategory` uydurma bir tür ("SEOApplication") DEĞİL,
 * schema.org'un tanıdığı `WebApplication` değeriyle basılır.
 *
 * `offers` price `"0"`: araç ücretsiz. Fiyat alanını hiç basmamak "fiyat
 * bilinmiyor" okunur; sıfır fiyatlı açık bir Offer "ücretsiz" der. Para birimi
 * TRY — kanonik pazar Türkiye.
 *
 * `provider` Organization düğümüne çapalı (`@id`): aracı yayınlayan tüzel kişi
 * grafikte tekrar yazılmaz.
 */
export function softwareApplicationLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@type": "SoftwareApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    provider: { "@id": ORG_ID },
    inLanguage: [IN_LANGUAGE.tr, IN_LANGUAGE.en],
  };
}

export type ServiceLdInput = {
  name: string;
  description: string;
  serviceType: string;
  path: string;
  offers: Array<{
    name: string;
    priceTRY: number;
    /** Sabit süreli paket teklifi — aylık planlarda kullanılmaz. */
    durationWeeks?: number;
    /**
     * Aylık yönetim planı (retainer): fiyat UnitPriceSpecification'a
     * `unitCode: "MON"` ile yazılır; sabit fiyatlı paketten böyle ayrışır.
     */
    monthly?: boolean;
    path: string;
  }>;
};

/**
 * Service.
 *
 * `locale` almaz: hizmet iki dilde de sunuluyor, `availableLanguage` her
 * zaman ikisini birden listeler. Sayfanın dili `WebPage.inLanguage`de.
 *
 * `hasOfferCatalog` yalnız gerçek paket varsa eklenir; fiyatlar
 * `packages.ts`ten birebir gelir. Boş katalog "hizmet var ama satın
 * alınamıyor" sinyali verir.
 */
export function serviceLd({
  name,
  description,
  serviceType,
  path,
  offers,
}: ServiceLdInput) {
  return {
    "@type": "Service",
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@type": "Organization", "@id": ORG_ID, name: "INDOLES" },
    areaServed: "TR",
    availableLanguage: ["tr", "en"],
    ...(offers.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name,
            itemListElement: offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              url: absoluteUrl(o.path),
              priceSpecification: o.monthly
                ? {
                    "@type": "UnitPriceSpecification",
                    price: o.priceTRY,
                    priceCurrency: "TRY",
                    unitCode: "MON",
                  }
                : {
                    "@type": "PriceSpecification",
                    price: o.priceTRY,
                    priceCurrency: "TRY",
                  },
            })),
          },
        }
      : {}),
  };
}
