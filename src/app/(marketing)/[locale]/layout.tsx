import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { SiteTopNav } from "@/components/layout/site-top-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { PopupProvider } from "@/lib/popup/popup-context";
import { SectionNavigator } from "@/components/layout/section-navigator";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const META = {
  tr: {
    title: {
      default: "INDOLES — İş geliştirme danışmanlığı",
      template: "%s — INDOLES",
    },
    description:
      "Sanayiye teknoloji dönüşümü, ticarete agresif büyüme. Teşhis olmadan reçete yazmayız — iş önce anlaşılır, teknoloji sonra çağrılır.",
    ogTitle: "Sanayiye dönüşüm, ticarete büyüme — INDOLES",
    ogDescription: "İş geliştirme danışmanlığı. Teşhis önce, teknoloji sonra.",
    ogLocale: "tr_TR",
    altLocale: "en_US",
  },
  en: {
    title: {
      default: "INDOLES — Business growth consultancy",
      template: "%s — INDOLES",
    },
    description:
      "Technology transformation for industry, aggressive growth for commerce. No prescription without diagnosis — business first, technology second.",
    ogTitle: "Industry transformation, commerce growth — INDOLES",
    ogDescription: "Business growth consultancy. Diagnosis first, technology second.",
    ogLocale: "en_US",
    altLocale: "tr_TR",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (routing.locales as readonly string[]).includes(locale)
    ? (locale as "tr" | "en")
    : "tr";
  const m = META[loc];

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${loc}`,
      languages: {
        tr: "/tr",
        en: "/en",
        "x-default": "/tr",
      },
    },
    openGraph: {
      type: "website",
      siteName: "INDOLES",
      title: m.ogTitle,
      description: m.ogDescription,
      locale: m.ogLocale,
      alternateLocale: m.altLocale,
      url: `/${loc}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@indoles",
      title: m.ogTitle,
      description: m.ogDescription,
    },
  };
}

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const links = [
    { href: `/${locale}/hizmetler`, label: t("nav.services") },
    { href: `/${locale}/paketler`, label: t("nav.packages") },
    { href: `/${locale}/vakalar`, label: t("nav.caseStudies") },
    { href: `/${locale}/yazilar`, label: t("nav.articles") },
    { href: `/${locale}/iletisim`, label: t("nav.contact") },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PopupProvider>
        <div className="min-h-screen flex flex-col">
          <SiteTopNav
            locale={locale as "tr" | "en"}
            links={links}
            ctaLabel={t("cta.bookConsultation")}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale as "tr" | "en"} />
          <SectionNavigator />
        </div>
      </PopupProvider>
    </NextIntlClientProvider>
  );
}
