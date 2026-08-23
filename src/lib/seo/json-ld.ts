import type { Locale } from "@/lib/content/types";
import { SITE_URL, absoluteUrl } from "./site";

/**
 * Organization düğümünün sabit kimliği.
 *
 * `@id` sayesinde grafikteki diğer düğümler (WebPage.isPartOf,
 * Service.provider) organizasyonu tekrar yazmak yerine referans veriyor.
 */
const ORG_ID = `${SITE_URL}/#organization`;

const IN_LANGUAGE: Record<Locale, string> = { tr: "tr-TR", en: "en-US" };

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "INDOLES",
    legalName: "İndoles Yazılım A.Ş.",
    url: SITE_URL,
    logo: absoluteUrl("/brand/indoles-logo-dark.png"),
    address: { "@type": "PostalAddress", addressCountry: "TR" },
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
}: {
  headline: string;
  description: string;
  path: string;
  locale: string;
  datePublished: string;
  dateModified?: string | undefined;
  authorName?: string | undefined;
  authorPath?: string | undefined;
}) {
  return {
    "@type": "Article",
    headline,
    description,
    inLanguage: locale,
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
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
}: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
}) {
  return {
    "@type": "WebPage",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: IN_LANGUAGE[locale],
    isPartOf: { "@id": ORG_ID },
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
    durationWeeks: number;
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
              priceSpecification: {
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
