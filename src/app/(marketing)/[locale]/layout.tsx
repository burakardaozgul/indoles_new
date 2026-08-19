import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { PopupProvider } from "@/lib/popup/popup-context";
import { RevealObserver } from "@/components/marketing/reveal-observer";
import { V2Chrome } from "@/components/v2/V2Chrome";
import { V2TopBar } from "@/components/v2/chrome/V2TopBar";
import { V2Nav, type V2NavLink } from "@/components/v2/chrome/V2Nav";
import { V2Footer } from "@/components/v2/chrome/V2Footer";
import "@/styles/v2.css";

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
      default: "INDOLES — Business transformation studio, Istanbul",
      template: "%s — INDOLES",
    },
    // Çeviri değil, yeniden yazım: EN arama niyeti "transformation consultancy
    // Turkey" ve "manufacturing digital transformation" ekseninde (docs/03 §7).
    description:
      "Strategy, design and engineering under one roof: digital transformation for manufacturers, growth systems for commerce brands. Fixed-scope packages from 3 weeks.",
    ogTitle: "Transformation for industry, growth for commerce — INDOLES",
    ogDescription: "An Istanbul business-building studio. We diagnose before we prescribe, and we stay through implementation.",
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

  const loc = locale as "tr" | "en";

  // Danışmanlar bilinçli olarak yok: kadro Hakkımızda ile birleştirilecek
  // (Burak, 2026-08-19). `/danismanlar` duruyor, footer'dan erişilebilir.
  const links: V2NavLink[] = [
    { href: "/hakkimizda", label: t("nav.about") },
    { href: "/hizmetler", label: t("nav.services") },
    { href: "/paketler", label: t("nav.packages") },
    { href: "/vakalar", label: t("nav.caseStudies") },
    { href: "/yazilar", label: t("nav.articles") },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PopupProvider>
        <div className="v2-root">
          <V2Chrome
            skipLabel={loc === "tr" ? "İçeriğe geç" : "Skip to content"}
            chrome={
              <>
                <V2TopBar locale={loc} />
                <V2Nav
                  locale={loc}
                  links={links}
                  ctaLabel={t("cta.bookConsultation")}
                  menuLabel={loc === "tr" ? "Menü" : "Menu"}
                />
              </>
            }
            footer={<V2Footer locale={loc} />}
          >
            {children}
          </V2Chrome>
          <RevealObserver />
        </div>
      </PopupProvider>
    </NextIntlClientProvider>
  );
}
