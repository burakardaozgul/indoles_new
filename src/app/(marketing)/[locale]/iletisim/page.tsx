import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";
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
      <PageHeader
        breadcrumbs={[
          { label: "INDOLES", href: `/${locale}` },
          { label: tCommon("nav.contact") },
        ]}
        eyebrow={loc === "tr" ? "İletişim" : "Contact"}
        title={
          loc === "tr"
            ? "30 dakikada birlikte bir kağıda bakalım."
            : "Let's look at a single page together, in 30 minutes."
        }
        lede={
          loc === "tr"
            ? "Ön görüşme, taahhütsüz. Somut problem, somut yön. Satış değil, teşhis."
            : "Intro call, no commitment. Concrete problem, concrete direction. Not a sales pitch — a diagnosis."
        }
      />

      <section className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Cal.com embed */}
          <div className="md:col-span-7">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Takvim" : "Calendar"}
            </span>
            <h2 className="typography-display-lg mt-4 text-ink-900">
              {loc === "tr" ? "Slot seç." : "Pick a slot."}
            </h2>
            <div className="mt-10">
              <CalcomEmbed />
            </div>
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
