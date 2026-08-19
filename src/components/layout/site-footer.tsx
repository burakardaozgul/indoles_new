import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/brand-logo";
import { COMPANY } from "@/lib/content/company";

/**
 * Siyah footer + dev INDOLES filigranı.
 * Filigran dekoratif: `aria-hidden` ve seçilemez.
 */
export async function SiteFooter({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();
  const isTr = locale === "tr";

  const columns = [
    {
      title: t("nav.services"),
      links: [
        { label: "Growth", href: `/${locale}/hizmetler/growth` },
        { label: "Transform", href: `/${locale}/hizmetler/transform` },
        { label: "Build", href: `/${locale}/hizmetler/build` },
        { label: isTr ? "Tüm hizmetler" : "All services", href: `/${locale}/hizmetler` },
        { label: t("nav.packages"), href: `/${locale}/paketler` },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("nav.about"), href: `/${locale}/hakkimizda` },
        { label: t("nav.caseStudies"), href: `/${locale}/vakalar` },
        { label: t("nav.consultants"), href: `/${locale}/danismanlar` },
        { label: t("nav.contact"), href: `/${locale}/iletisim` },
      ],
    },
    {
      title: isTr ? "Kaynaklar" : "Resources",
      links: [
        { label: t("nav.articles"), href: `/${locale}/yazilar` },
        { label: isTr ? "Gizlilik ve KVKK" : "Privacy & GDPR", href: `/${locale}/gizlilik-kvkk` },
      ],
    },
  ];

  return (
    <footer className="footer-sec">
      <div className="ds-container">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-20 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-14">
          <div>
            <Link href={`/${locale}`} className="inline-flex" aria-label="INDOLES">
              <BrandLogo variant="dark-bg" height={48} />
            </Link>
            <p className="mono mt-4 mb-5 text-[10px] tracking-[0.2em] text-gold-400">
              EVOLVE · BUILD · GROW
            </p>
            <p className="mb-7 max-w-[38ch] text-sm leading-relaxed text-white/55">
              {t("tagline")}
            </p>

            <form className="f-form" action={`mailto:${COMPANY.email}`} method="post">
              <label htmlFor="footer-email" className="sr-only">
                {isTr ? "E-posta adresiniz" : "Your email address"}
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={isTr ? "E-posta adresiniz" : "Your email address"}
                className="f-input"
              />
              <button type="submit" className="f-btn" aria-label={isTr ? "Bültene abone ol" : "Subscribe to newsletter"}>
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                  <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </button>
            </form>
            <p className="mt-3 text-xs text-white/40">
              {isTr ? "Ayda bir — teşhis, metot, sonuç." : "Monthly — diagnosis, method, outcome."}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mono mb-6 text-[11px] font-medium tracking-[0.14em] text-white">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-center gap-6 pt-8 pb-10 md:grid-cols-[1fr_auto_1fr]">
          <p className="mono text-[11px] tracking-[0.1em] text-white/40">
            © {year} {COMPANY.legalName} · {isTr ? "İstanbul, Türkiye" : "Istanbul, Turkey"}
          </p>
          <nav className="mono flex justify-center gap-6 text-[11px] tracking-[0.1em]" aria-label={isTr ? "Yasal" : "Legal"}>
            <Link href={`/${locale}/gizlilik-kvkk`} className="text-white/50 transition-colors hover:text-white">
              {isTr ? "Gizlilik" : "Privacy"}
            </Link>
            <Link href={`/${locale}/gizlilik-kvkk`} className="text-white/50 transition-colors hover:text-white">
              KVKK
            </Link>
            <a
              href={COMPANY.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-colors hover:text-white"
            >
              LinkedIn ↗
            </a>
          </nav>
          <p className="mono text-[11px] tracking-[0.1em] text-white/40 md:text-right">
            {t("footer.rights")}
          </p>
        </div>

        <div className="f-mega" aria-hidden="true">
          INDOLES
        </div>
      </div>
    </footer>
  );
}
