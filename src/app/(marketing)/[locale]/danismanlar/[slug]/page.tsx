import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { getConsultantBySlug, BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import { getPillar } from "@/lib/content/pillars";
import { ARTICLES } from "@/lib/content/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  breadcrumbLd,
  organizationLd,
  personLd,
  webPageLd,
} from "@/lib/seo/json-ld";
import type { Metadata } from "next";
import type { Locale } from "@/lib/content/types";

/**
 * Yalnız `BOOKABLE_CONSULTANTS` için sayfa üretilir. Liste Chief Mood Officer'ı
 * (ofis köpeği) bilinçli olarak dışlıyor — bu kapı olmadan o slug on-demand
 * render edilip 200 dönüyor, sitemap dışı yetim bir sayfa oluşuyordu.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return BOOKABLE_CONSULTANTS.flatMap((c) =>
    (["tr", "en"] as const).map((locale) => ({ locale, slug: c.slug }))
  );
}


/**
 * `dynamicParams = false` bu rotada tek başına yetmiyor: bilinmeyen slug'ın
 * 404'ü aslında aşağıdaki `notFound()` çağrısından geliyor, framework
 * kapısından değil. Bu yüzden "kimin sayfası var" kararı burada, veriye
 * bakarak veriliyor — render moduna bağlı kalmıyor.
 */
function bookableOrNull(slug: string) {
  const c = getConsultantBySlug(slug);
  if (!c) return null;
  return BOOKABLE_CONSULTANTS.some((b) => b.slug === c.slug) ? c : null;
}

function consultantPaths(slug: string) {
  return { tr: `/tr/danismanlar/${slug}`, en: `/en/consultants/${slug}` };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const c = bookableOrNull(slug);
  if (!c) return {};

  // Biyografiler 60-230 karakter arası değişiyor: sabit bir şablon kimi
  // profilde 160'ı aşıyor, kimindeyse 90'da kalıyordu. Cümleler sığdıkça
  // eklenir — kesme yapılmadığı için açıklama hiçbir zaman yarım kalmaz.
  const pillars = c.pillars
    .map((k) => getPillar(k)?.name[loc])
    .filter(Boolean)
    .join(", ");
  const candidates = [
    ...c.shortBio[loc].split(/(?<=\.)\s+/).filter(Boolean),
    ...c.longBio[loc],
    loc === "tr"
      ? `INDOLES kadrosunda odak: ${pillars}.`
      : `Focus on the INDOLES team: ${pillars}.`,
  ];
  let description = `${c.name} — ${c.title[loc]}.`;
  for (const sentence of candidates) {
    if (`${description} ${sentence}`.length <= 160) {
      description = `${description} ${sentence}`;
    }
  }

  // Unvanın ilk parçası başlığa girer: "Kurucu · Marka Stratejisti ve
  // Kreatif Direktör" tam haliyle "%s — INDOLES" şablonuyla 60'ı aşıyor.
  const shortTitle = c.title[loc].split(" · ")[0];

  return buildMetadata({
    title: `${c.name} — ${shortTitle}`,
    description,
    paths: consultantPaths(c.slug),
    locale: loc,
  });
}

export default async function ConsultantDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const c = bookableOrNull(slug);
  if (!c) notFound();

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const authoredArticles = ARTICLES.filter((a) => a.authorSlug === c.slug);

  const paths = consultantPaths(c.slug);

  return (
    <>
      {/* Kadro, E-E-A-T'nin taşıyıcısı: her danışman ayrı bir varlık olarak
          Organization'a bağlanır (docs/strateji §5). */}
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: `${c.name} — ${c.title[loc]}`,
            description: c.shortBio[loc],
            path: paths[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            {
              name: tCommon("nav.consultants"),
              path: loc === "tr" ? "/tr/danismanlar" : "/en/consultants",
            },
            { name: c.name },
          ]),
          personLd({
            name: c.name,
            jobTitle: c.title[loc],
            description: c.shortBio[loc],
            path: paths[loc],
            sameAs: c.linkedinUrl,
            knowsAbout: c.expertise,
          }),
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.consultants"), href: "/danismanlar" },
          { label: c.name },
        ]}
        eyebrow={c.title[loc]}
        title={c.name}
        lede={c.shortBio[loc]}
      />

      <section className="border-b border-ink-100 ">
        <div className="ds-container py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <aside className="md:col-span-4">
            <div className="v2-surface rounded-2xl p-8 sticky top-24">
              <div
                className="grid h-20 w-20 place-items-center rounded-lg font-display text-3xl font-light text-white"
                style={{
                  background: `linear-gradient(140deg, ${c.portraitTone}, var(--color-teal-900))`,
                }}
                aria-hidden="true"
              >
                {c.initials}
              </div>
              <h2 className="typography-h1 text-ink-900 mt-6">{c.name}</h2>
              <p className="typography-body-sm text-ink-500 mt-1">
                {c.title[loc]}
              </p>
              <dl className="mt-8 space-y-4">
                <div>
                  <dt className="typography-label uppercase tracking-widest text-ink-500">
                    {loc === "tr" ? "Disiplin" : "Pillar"}
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {c.pillars.map((p) => {
                      const pillar = getPillar(p);
                      return (
                        <span
                          key={p}
                          className="mono rounded-md border border-ink-200 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-teal-700"
                        >
                          {pillar?.name[loc]}
                        </span>
                      );
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="typography-label uppercase tracking-widest text-ink-500">
                    {loc === "tr" ? "Uzmanlık" : "Expertise"}
                  </dt>
                  <dd className="mt-2 typography-body-sm text-ink-700">
                    {c.expertise.join(" · ")}
                  </dd>
                </div>
                {c.linkedinUrl && (
                  <div>
                    <a
                      href={c.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="typography-body-sm text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                    >
                      LinkedIn →
                    </a>
                  </div>
                )}
              </dl>
              <PopupCTAButton
                source="consultant-detail"
                className="mt-8 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-sm w-full"
              >
                <Phone size={16} aria-hidden />
                {tCommon("cta.bookConsultation")}
              </PopupCTAButton>
            </div>
          </aside>

          <div className="md:col-span-8">
            <figure className="mb-14 border-l-2 border-teal-700 pl-8">
              <blockquote className="ts-quote max-w-none">
                {c.quote[loc]}
              </blockquote>
              <figcaption className="mono mt-5 text-[11px] uppercase tracking-[0.18em] text-ink-500">
                {c.name}
              </figcaption>
            </figure>

            <span className="eyebrow">
              {loc === "tr" ? "Biyografi" : "Biography"}
            </span>
            <div className="mt-6 space-y-6 max-w-prose-editorial">
              {c.longBio[loc].map((p, i) => (
                <p key={i} className="typography-body-lg text-ink-700">
                  {p}
                </p>
              ))}
            </div>

            {authoredArticles.length > 0 && (
              <div className="mt-16">
                <span className="typography-label uppercase tracking-widest text-ink-500">
                  {loc === "tr" ? "Yazıları" : "Articles"}
                </span>
                <ol className="mt-6 border-t border-surface-2">
                  {authoredArticles.map((a) => (
                    <li key={a.slug[loc]} className="border-b border-surface-2">
                      <Link
                        href={`/${locale}/yazilar/${a.slug[loc]}`}
                        className="group block py-6 hover:v2-surface transition-colors -mx-4 px-4 rounded-lg"
                      >
                        <h3 className="typography-h3 text-ink-900 group-hover:text-brand-800">
                          {a.title[loc]}
                        </h3>
                        <p className="typography-caption text-ink-500 mt-2">
                          {a.readingMinutes}{" "}
                          {loc === "tr" ? "dk okuma" : "min read"}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
