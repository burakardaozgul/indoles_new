import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { CalcomEmbed } from "@/components/marketing/CalcomEmbed";
import { ContactForm } from "@/components/marketing/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.contact") },
        ]}
        eyebrow={loc === "tr" ? "İletişim" : "Contact"}
        title={
          loc === "tr"
            ? "30 dakikada birlikte bir kağıda bakalım."
            : "Thirty minutes, one page, one clear next step."
        }
        lede={
          loc === "tr"
            ? "Ön görüşme, taahhütsüz. Somut problem, somut yön. Satış değil, teşhis."
            : "Intro call, no commitment. Concrete problem, concrete direction. Not a sales pitch — a diagnosis."
        }
      />

      <section className="border-b border-surface-2">
        <div className="ds-container py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Cal.com embed */}
          <div className="md:col-span-7">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Takvim" : "Calendar"}
            </span>
            <h2 className="typography-h2 mt-4 text-ink-900">
              {loc === "tr" ? "Slot seç." : "Pick a slot."}
            </h2>
            <div className="mt-10">
              <CalcomEmbed />
            </div>
            {/* Takvim yüklenmezse ziyaretçi çıkışsız kalmasın: "Slot seç."
                başlığının altında her zaman iki alternatif duruyor. */}
            <p className="typography-body-sm text-ink-500 mt-6 max-w-prose-editorial">
              {loc === "tr" ? (
                <>
                  Takvim açılmıyorsa{" "}
                  <a
                    href="mailto:hello@indoles.com.tr"
                    className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                  >
                    hello@indoles.com.tr
                  </a>{" "}
                  adresine yazabilir veya yandaki formu doldurabilirsiniz.
                </>
              ) : (
                <>
                  If the calendar doesn&apos;t load, write to{" "}
                  <a
                    href="mailto:hello@indoles.com.tr"
                    className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                  >
                    hello@indoles.com.tr
                  </a>{" "}
                  or use the form alongside.
                </>
              )}
            </p>
          </div>

          {/* Contact info + form */}
          <aside className="md:col-span-5 space-y-10">
            <div>
              <span className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Doğrudan" : "Direct"}
              </span>
              <dl className="mt-6 space-y-5 typography-body-md">
                <div>
                  <dt className="typography-caption text-ink-500">E-posta</dt>
                  <dd className="mt-1">
                    <a
                      href="mailto:hello@indoles.com.tr"
                      className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
                    >
                      hello@indoles.com.tr
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="typography-caption text-ink-500">
                    {loc === "tr" ? "Konum" : "Location"}
                  </dt>
                  <dd className="mt-1 text-ink-900">
                    {loc === "tr" ? "İstanbul, Türkiye" : "Istanbul, Turkey"}
                  </dd>
                </div>
                <div>
                  <dt className="typography-caption text-ink-500">
                    {loc === "tr" ? "Yanıt süresi" : "Response time"}
                  </dt>
                  <dd className="mt-1 text-ink-900">
                    {loc === "tr"
                      ? "Ortalama 1 iş günü"
                      : "Average 1 business day"}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <span className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Mesaj gönder" : "Send a message"}
              </span>
              <div className="mt-6">
                <ContactForm locale={loc} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
