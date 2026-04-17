import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export async function SiteHeader({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 border-b border-surface-2">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="typography-h3 tracking-tight">
          {t("brand")}
        </Link>
        <nav className="hidden md:flex items-center gap-8 typography-body-sm text-ink-700">
          <Link href="/hizmetler" className="hover:text-ink-900">
            {t("nav.services")}
          </Link>
          <Link href="/paketler" className="hover:text-ink-900">
            {t("nav.packages")}
          </Link>
          <Link href="/vakalar" className="hover:text-ink-900">
            {t("nav.caseStudies")}
          </Link>
          <Link href="/yazilar" className="hover:text-ink-900">
            {t("nav.articles")}
          </Link>
          <Link href="/iletisim" className="hover:text-ink-900">
            {t("nav.contact")}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher currentLocale={locale} />
          <Link
            href="/iletisim"
            className="hidden md:inline-flex items-center h-9 px-4 rounded-full bg-ink-900 text-paper typography-body-sm hover:bg-ink-700 transition-colors"
          >
            {t("cta.bookConsultation")}
          </Link>
        </div>
      </div>
    </header>
  );
}

function LocaleSwitcher({ currentLocale }: { currentLocale: "tr" | "en" }) {
  const other = currentLocale === "tr" ? "en" : "tr";
  return (
    <a
      href={`/${other}`}
      className="typography-label uppercase text-ink-500 hover:text-ink-900"
      aria-label={`Switch to ${other.toUpperCase()}`}
    >
      {other}
    </a>
  );
}
