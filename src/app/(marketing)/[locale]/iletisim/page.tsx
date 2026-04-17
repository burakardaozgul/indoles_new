import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/marketing/page-header";

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
          {/* Cal.com embed placeholder */}
          <div className="md:col-span-7">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              {loc === "tr" ? "Takvim" : "Calendar"}
            </span>
            <h2 className="typography-display-lg mt-4 text-ink-900">
              {loc === "tr" ? "Slot seç." : "Pick a slot."}
            </h2>
            <div className="mt-10 bg-surface-1 border border-surface-2 rounded-2xl p-10 md:p-14 min-h-[420px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-2 grid place-items-center mb-6">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-ink-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
              </div>
              <p className="typography-body-md text-ink-700 max-w-prose-editorial">
                {loc === "tr"
                  ? "Cal.com takvim entegrasyonu burada açılacak."
                  : "Cal.com calendar embed will load here."}
              </p>
              <p className="typography-caption text-ink-500 mt-3">
                {loc === "tr"
                  ? "Geçici: launch'a kadar doğrudan e-postayla yazabilirsiniz."
                  : "Temporary: email us directly until launch."}
              </p>
              <a
                href="mailto:hello@indoles.com.tr"
                className="mt-8 inline-flex items-center h-11 px-5 rounded-full bg-ink-900 text-paper hover:bg-ink-700 transition-colors typography-body-sm"
              >
                hello@indoles.com.tr
              </a>
            </div>
          </div>

          {/* Channels + alternatives */}
          <aside className="md:col-span-5 space-y-8">
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

            <div className="bg-surface-1 rounded-2xl p-8">
              <span className="typography-label uppercase tracking-widest text-ink-500">
                {loc === "tr" ? "Alternatifler" : "Alternatives"}
              </span>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    href="/app/brief/yeni"
                    className="group block"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="typography-h3 text-ink-900 group-hover:text-brand-800">
                        {loc === "tr"
                          ? "Detaylı brief gönder"
                          : "Submit detailed brief"}
                      </h3>
                      <span aria-hidden className="text-ink-500">
                        →
                      </span>
                    </div>
                    <p className="typography-caption text-ink-500 mt-1">
                      {loc === "tr"
                        ? "Proje veya retainer için."
                        : "For project or retainer."}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}#chat`}
                    className="group block"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="typography-h3 text-ink-900 group-hover:text-brand-800">
                        {loc === "tr" ? "AI sohbet" : "AI chat"}
                      </h3>
                      <span aria-hidden className="text-ink-500">
                        →
                      </span>
                    </div>
                    <p className="typography-caption text-ink-500 mt-1">
                      {loc === "tr"
                        ? "İhtiyacını birkaç cümlede anlat."
                        : "Describe your need in a few sentences."}
                    </p>
                  </Link>
                </li>
              </ul>
            </div>

            <p className="typography-caption text-ink-500">
              {loc === "tr"
                ? "KVKK metni hukuki sayfalarda."
                : "KVKK / GDPR terms on the legal pages."}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
