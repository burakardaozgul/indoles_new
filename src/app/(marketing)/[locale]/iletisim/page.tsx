import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactForm } from "@/components/marketing/ContactForm";
import { ContactBookingScreen } from "@/components/marketing/ContactBookingScreen";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  breadcrumbLd,
  professionalServiceLd,
  webPageLd,
} from "@/lib/seo/json-ld";
import { COMPANY } from "@/lib/content/company";
import type { Locale } from "@/lib/content/types";

/**
 * Cal.com kaldırıldı (ADR-025): rezervasyon INDOLES'in kendi takvim
 * sistemine taşındı. Görev 10 (spec §5): popup'ta modal olarak kullanılan
 * AYNI `BookingScreen` bileşeni burada `ContactBookingScreen` sarmalayıcısı
 * üzerinden modalsız, doğrudan sayfada gömülü render ediliyor — iki yüzey
 * tek bileşeni paylaşıyor, ayrı bir takvim arayüzü yazılmadı. `ContactForm`
 * olduğu gibi kalıyor: ziyaretçi "randevu al" ile "mesaj bırak" arasında
 * seçim yapabilir.
 */

const PATHS = { tr: "/tr/iletisim", en: "/en/contact" };

const META = {
  tr: {
    title: "İletişim — 1 saatlik ön görüşme",
    description:
      "Formu doldurun, 1 iş günü içinde dönelim. 1 saatlik ön görüşme taahhütsüz: somut problem, somut yön. Satış sunumu değil, teşhis konuşması yapıyoruz.",
  },
  en: {
    title: "Contact — book a one-hour call",
    description:
      "Send the form and we reply within one business day. The one-hour intro call carries no commitment: a concrete problem, a concrete direction, a diagnosis.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return buildMetadata({
    title: META[loc].title,
    description: META[loc].description,
    paths: PATHS,
    locale: loc,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const mailLink = (
    <a
      href={`mailto:${COMPANY.email}`}
      className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
    >
      {COMPANY.email}
    </a>
  );

  return (
    <>
      {/* `professionalServiceLd` Organization'ın yerine geçer, yanına değil:
          aynı `@id`yi taşıyor ve adres/geo/çalışma saati alanlarıyla onu
          zenginleştiriyor (bkz. json-ld.ts gerekçesi). */}
      <JsonLd
        graph={[
          professionalServiceLd(),
          webPageLd({
            name: META[loc].title,
            description: META[loc].description,
            path: PATHS[loc],
            locale: loc,
            type: "ContactPage",
          }),
          breadcrumbLd([
            { name: "INDOLES", path: `/${loc}` },
            { name: tCommon("nav.contact") },
          ]),
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.contact") },
        ]}
        eyebrow={loc === "tr" ? "İletişim" : "Contact"}
        title={
          loc === "tr"
            ? "Bir saatte birlikte bir kağıda bakalım."
            : "One hour, one page, one clear next step."
        }
        lede={
          loc === "tr"
            ? "Ön görüşme, taahhütsüz. Somut problem, somut yön. Satış değil, teşhis."
            : "Intro call, no commitment. Concrete problem, concrete direction. Not a sales pitch — a diagnosis."
        }
      />

      {/* Randevu al — gömülü rezervasyon takvimi (Görev 10, spec §5): popup'taki
          AYNI `BookingScreen` bileşeni, modal olmadan doğrudan burada. Ana CTA
          "1 saatlik görüşme" bu yüzeyle karşılanıyor; mesaj bırakmayı tercih
          edenler için aşağıdaki form olduğu gibi duruyor. */}
      <section className="border-b border-surface-2" aria-labelledby="booking-heading">
        <div className="ds-container py-24 md:py-32">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            {loc === "tr" ? "Randevu al" : "Book a call"}
          </span>
          <h2 id="booking-heading" className="typography-h2 mt-4 text-ink-900">
            {loc === "tr" ? "Takvimden uygun bir saat seç." : "Pick a time that works."}
          </h2>
          <div className="mt-10 mx-auto max-w-popup-wide">
            <ContactBookingScreen locale={loc} />
          </div>
        </div>
      </section>

      <section className="border-b border-surface-2">
        <div className="ds-container py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Form — randevuyu tercih etmeyenler için alternatif yol */}
          <div className="md:col-span-7">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Mesaj gönder" : "Send a message"}
            </span>
            <h2 className="typography-h2 mt-4 text-ink-900">
              {loc === "tr"
                ? "Yaz, bir iş günü içinde dönelim."
                : "Write to us; we reply within a business day."}
            </h2>
            <div className="mt-10">
              <ContactForm locale={loc} />
            </div>
          </div>

          {/* Doğrudan iletişim + beklenti föyü */}
          <aside className="md:col-span-5">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Doğrudan" : "Direct"}
            </span>
            <dl className="mt-6 space-y-5 typography-body-md">
              <div>
                <dt className="typography-caption text-ink-500">E-posta</dt>
                <dd className="mt-1">{mailLink}</dd>
              </div>
              <div>
                <dt className="typography-caption text-ink-500">
                  {loc === "tr" ? "Telefon" : "Phone"}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                    className="text-ink-900 hover:text-brand-700"
                  >
                    {COMPANY.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="typography-caption text-ink-500">
                  {loc === "tr" ? "Çalışma saatleri" : "Working hours"}
                </dt>
                <dd className="mt-1 text-ink-900">
                  {loc === "tr" ? COMPANY.hours.tr : COMPANY.hours.en}
                </dd>
              </div>
              <div>
                <dt className="typography-caption text-ink-500">
                  {loc === "tr" ? "Konum" : "Location"}
                </dt>
                <dd className="mt-1 text-ink-900">
                  {loc === "tr" ? "Levent, İstanbul" : "Levent, Istanbul"}
                </dd>
              </div>
              <div>
                <dt className="typography-caption text-ink-500">
                  {loc === "tr" ? "Yanıt süresi" : "Response time"}
                </dt>
                <dd className="mt-1 text-ink-900">
                  {loc === "tr" ? "Ortalama 1 iş günü" : "Average 1 business day"}
                </dd>
              </div>
              <div>
                <dt className="typography-caption text-ink-500">
                  {loc === "tr" ? "Görüşme süresi" : "Call length"}
                </dt>
                <dd className="mt-1 text-ink-900">
                  {loc === "tr" ? "Ortalama 1 saat" : "About one hour"}
                </dd>
              </div>
            </dl>

            {/* Formun tıkanması hâlinde ziyaretçi çıkışsız kalmasın. */}
            <p className="typography-body-sm text-ink-500 mt-10 max-w-prose-editorial">
              {loc === "tr" ? (
                <>
                  Form gönderilemezse {mailLink} adresine yazabilir ya da mesai
                  saatlerinde arayabilirsiniz.
                </>
              ) : (
                <>
                  If the form fails to send, write to {mailLink} or call during
                  working hours.
                </>
              )}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
