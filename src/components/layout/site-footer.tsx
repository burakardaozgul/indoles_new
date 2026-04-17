import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BrandWatermark } from "@/components/brand/brand-watermark";

export async function SiteFooter({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();

  const columns: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }> = [
    {
      title: t("nav.services"),
      links: [
        { label: "Growth", href: `/${locale}/hizmetler/growth` },
        { label: "Transform", href: `/${locale}/hizmetler/transform` },
        { label: "Build", href: `/${locale}/hizmetler/build` },
        {
          label: locale === "tr" ? "Tüm hizmetler" : "All services",
          href: `/${locale}/hizmetler`,
        },
      ],
    },
    {
      title: locale === "tr" ? "Keşfet" : "Discover",
      links: [
        { label: t("nav.packages"), href: `/${locale}/paketler` },
        { label: t("nav.caseStudies"), href: `/${locale}/vakalar` },
        { label: t("nav.articles"), href: `/${locale}/yazilar` },
        { label: t("nav.consultants"), href: `/${locale}/danismanlar` },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("nav.about"), href: `/${locale}/hakkimizda` },
        { label: t("nav.contact"), href: `/${locale}/iletisim` },
        { label: "Studio", href: `/studio` },
      ],
    },
  ];

  return (
    <footer
      className="relative bg-ink-900 text-paper border-t border-ink-700 overflow-hidden"
      style={{ colorScheme: "dark" }}
    >
      <BrandWatermark tone="dark" side="right" opacity={0.035} />

      {/* Top: logo + tagline + columns */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 pt-20 md:pt-24 pb-16 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
        {/* Brand + tagline */}
        <div className="md:col-span-5 lg:col-span-4">
          <BrandLogo variant="dark-bg" height={44} />
          <p className="typography-body-md text-paper/70 mt-8 max-w-[36ch]">
            {t("tagline")}
          </p>
          <div className="mt-10 space-y-3 typography-body-sm">
            <div>
              <span className="typography-label uppercase tracking-widest text-paper/40 block mb-1">
                {locale === "tr" ? "Yazışma" : "Correspondence"}
              </span>
              <a
                href="mailto:hello@indoles.com.tr"
                className="text-paper hover:text-paper/80 transition-colors"
              >
                hello@indoles.com.tr
              </a>
            </div>
            <div>
              <span className="typography-label uppercase tracking-widest text-paper/40 block mb-1">
                {locale === "tr" ? "Konum" : "Location"}
              </span>
              <span className="text-paper/80">
                {locale === "tr"
                  ? "İstanbul, Türkiye"
                  : "Istanbul, Turkey"}
              </span>
            </div>
          </div>
        </div>

        {/* Sitemap columns */}
        <div className="md:col-span-7 lg:col-span-5 grid grid-cols-3 gap-6 md:gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="typography-label uppercase tracking-widest text-paper/40">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3 typography-body-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-paper/80 hover:text-paper transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="md:col-span-12 lg:col-span-3">
          <h3 className="typography-label uppercase tracking-widest text-paper/40">
            {locale === "tr" ? "Bülten" : "Newsletter"}
          </h3>
          <p className="typography-body-sm text-paper/70 mt-4 max-w-[36ch]">
            {locale === "tr"
              ? "Ayda bir — teşhis, metot, sonuç."
              : "Monthly — diagnosis, method, outcome."}
          </p>
          <form className="mt-5 flex items-stretch gap-2">
            <input
              type="email"
              placeholder={
                locale === "tr" ? "E-posta adresi" : "Email address"
              }
              className="flex-1 min-w-0 h-11 bg-paper/[0.06] border border-paper/15 rounded-lg px-4 typography-body-sm text-paper placeholder:text-paper/40 focus-visible:outline-none focus-visible:border-paper/40"
            />
            <button
              type="button"
              className="shrink-0 h-11 px-5 rounded-lg bg-paper text-ink-900 hover:bg-paper/90 transition-colors typography-body-sm font-medium"
            >
              {locale === "tr" ? "Abone ol" : "Subscribe"}
            </button>
          </form>
          <p className="typography-caption text-paper/40 mt-3">
            {locale === "tr"
              ? "Spam yok. İstediğiniz zaman ayrılabilirsiniz."
              : "No spam. Unsubscribe anytime."}
          </p>
        </div>
      </div>

      {/* Bottom: copyright + legal */}
      <div className="relative z-10 border-t border-paper/10">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 typography-caption">
          <div className="text-paper/50">
            © {year} {t("footer.legalName")}. {t("footer.rights")}
          </div>
          <nav className="flex items-center gap-6 text-paper/50">
            <Link href="#" className="hover:text-paper transition-colors">
              KVKK
            </Link>
            <Link href="#" className="hover:text-paper transition-colors">
              {locale === "tr" ? "Gizlilik" : "Privacy"}
            </Link>
            <Link href="#" className="hover:text-paper transition-colors">
              {locale === "tr" ? "Çerezler" : "Cookies"}
            </Link>
            <a
              href="https://www.linkedin.com/company/indoles"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-paper transition-colors"
            >
              LinkedIn ↗
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
