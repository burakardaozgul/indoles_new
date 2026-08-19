import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Link } from "@/lib/i18n/navigation";
import { COMPANY } from "@/lib/content/company";
import { V2Newsletter } from "./V2Newsletter";

const PILLAR_HREF = (slug: string) =>
  ({ pathname: "/hizmetler/[slug]", params: { slug } }) as const;

/**
 * Site footer'ı — ink blok, dev INDOLES filigranı.
 *
 * Krem gövdenin iki ucunda iki koyu yüzey var: tepede bilgi şeridi, altta bu
 * footer. Sayfa bir çerçevenin içinde duruyor gibi kapanıyor.
 *
 * Layout seviyesindedir; anasayfanın `Outro` bölümü yalnız CTA'yı taşır.
 * Danışmanlar burada duruyor — birincil nav'dan çıktı ama sayfa yaşıyor.
 */
export async function V2Footer({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const year = new Date().getFullYear();
  const isTr = locale === "tr";

  const columns = [
    {
      title: t("nav.services"),
      links: [
        // Dinamik segment `next-intl` Link'inde {pathname, params} ister;
        // düz string EN'de segment çevirisinden geçmiyor.
        { label: "Growth", href: PILLAR_HREF("growth") },
        { label: "Transform", href: PILLAR_HREF("transform") },
        { label: "Build", href: PILLAR_HREF("build") },
        { label: isTr ? "Tüm hizmetler" : "All services", href: "/hizmetler" },
        { label: t("nav.packages"), href: "/paketler" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("nav.about"), href: "/hakkimizda" },
        { label: t("nav.caseStudies"), href: "/vakalar" },
        { label: t("nav.consultants"), href: "/danismanlar" },
        { label: t("nav.contact"), href: "/iletisim" },
      ],
    },
    {
      title: isTr ? "Kaynaklar" : "Resources",
      links: [
        { label: t("nav.articles"), href: "/yazilar" },
        {
          label: isTr ? "Gizlilik ve KVKK" : "Privacy & GDPR",
          href: "/gizlilik-kvkk",
        },
      ],
    },
  ] as const;

  return (
    <footer className="v2-sitefooter">
      <div className="v2-sitefooter-inner">
        <div className="v2-sf-grid">
          <div className="v2-sf-brand">
            <Link href="/" className="inline-flex" aria-label="INDOLES">
              <BrandLogo variant="dark-bg" height={52} />
            </Link>
            <p className="v2-sf-signature mono">EVOLVE · BUILD · GROW</p>
            <p className="v2-sf-tagline">{t("tagline")}</p>

            <V2Newsletter locale={locale} />
            <p className="v2-sf-note">
              {isTr
                ? "Yeni bir yazı çıktığında haber verelim. Teşhis, metot, sonuç."
                : "We'll let you know when a new piece is out. Diagnosis, method, outcome."}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} className="v2-sf-col" aria-label={col.title}>
              <h2 className="v2-sf-col-title mono">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="v2-sf-legal">
          <p className="mono">
            © {year} {COMPANY.legalName} ·{" "}
            {isTr ? "İstanbul, Türkiye" : "Istanbul, Turkey"}
          </p>
          <nav className="mono v2-sf-legal-nav" aria-label={isTr ? "Yasal" : "Legal"}>
            <Link href="/gizlilik-kvkk">{isTr ? "Gizlilik" : "Privacy"}</Link>
            <Link href="/gizlilik-kvkk">KVKK</Link>
            <a
              href={COMPANY.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          </nav>
          <p className="mono v2-sf-rights">{t("footer.rights")}</p>
        </div>

        <div className="v2-sf-mega" aria-hidden="true">
          INDOLES
        </div>
      </div>
    </footer>
  );
}
