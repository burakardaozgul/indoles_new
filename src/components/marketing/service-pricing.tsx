import Link from "next/link";
import type { Locale, ServiceContent } from "@/lib/content/types";

type RetainerPlans = NonNullable<ServiceContent["retainerPlans"]>;

/**
 * Aylık yönetim planları — hizmet sayfası fiyat tablosu.
 *
 * Eski sitedeki serif/krem fiyat listesinin v2 (teknik-editorial) uyarlaması:
 * mono eyebrow, Lexend tabular fiyat, hairline kart, teal vurgu. Veri
 * `ServiceContent.retainerPlans`ten gelir; alan boş olan hizmette bölüm hiç
 * render edilmez (ServiceDetail koşullu çağırır). Fiyat/kapsam metni burada
 * tutulmaz — içerik dürüstlüğü kuralı gereği tamamı içerik katmanındadır.
 *
 * "Önerilen plan" kartı çerçeveyi teal'e çevirir; renk tek başına taşıyıcı
 * olmasın diye çip metni de yalnız o kartta basılır (WCAG 1.4.1).
 */
const COPY = {
  tr: {
    eyebrow: "Aylık yönetim planları",
    monthly: "Aylık",
    recommended: "Önerilen plan",
    cta: "Teklif al",
    contactPath: "/tr/iletisim",
  },
  en: {
    eyebrow: "Monthly management plans",
    monthly: "Monthly",
    recommended: "Recommended plan",
    cta: "Get a quote",
    contactPath: "/en/contact",
  },
} as const;

/** Paketler sayfalarıyla aynı biçim: "₺ 45.000" (tr-TR gruplama). */
function formatMonthlyTRY(value: number): string {
  return `₺ ${value.toLocaleString("tr-TR")}`;
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className={`mt-1 shrink-0 ${className}`}
    >
      <path
        d="M3 8.5 6.5 12 13 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** El çizimi kamera glifi — case-flow glif ailesiyle aynı hairline dil. */
function CameraIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
      className={`mt-0.5 shrink-0 ${className}`}
    >
      <rect
        x="2"
        y="6"
        width="16"
        height="10.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 6 8.4 3.8h3.2L13 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="11.2" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ServicePricing({
  retainerPlans,
  locale,
}: {
  retainerPlans: RetainerPlans;
  locale: Locale;
}) {
  const t = COPY[locale];

  return (
    <section
      aria-labelledby="pricing-heading"
      className="border-b border-surface-2"
    >
      <div className="ds-container py-20 md:py-28">
        <span className="typography-label uppercase tracking-widest text-ink-500">
          {t.eyebrow}
        </span>
        <h2
          id="pricing-heading"
          className="typography-h2 mt-4 max-w-[24ch] text-ink-900"
        >
          {retainerPlans.title[locale]}
        </h2>
        <p className="typography-body-lg text-ink-700 mt-5 max-w-prose-editorial">
          {retainerPlans.lede[locale]}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {retainerPlans.plans.map((plan) => {
            /* Önerilen kart: çerçeve değil zemin ayrıştırır — sitenin koyu
               ada kalıbı (vision, metrik bandı). Gold accent yalnız bu koyu
               yüzeyde kullanılır (ADR-015); çip metni renkten bağımsız
               ayrıca basılır (WCAG 1.4.1). */
            const dark = Boolean(plan.featured);
            return (
              <article
                key={plan.key}
                data-plan={plan.key}
                style={dark ? { colorScheme: "dark" } : undefined}
                className={`flex h-full flex-col rounded-2xl border p-7 md:p-8 ${
                  dark
                    ? "border-teal-950 bg-teal-950"
                    : "border-surface-2 v2-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className={`typography-h3 ${dark ? "text-paper" : "text-ink-900"}`}
                  >
                    {plan.name[locale]}
                  </h3>
                  {plan.featured ? (
                    <span className="typography-label uppercase tracking-widest whitespace-nowrap rounded-full bg-gold-500 px-3 py-1.5 text-ink-900">
                      {t.recommended}
                    </span>
                  ) : null}
                </div>

                <p
                  className={`typography-h1 tabular mt-6 ${dark ? "text-paper" : "text-ink-900"}`}
                >
                  {formatMonthlyTRY(plan.monthlyTRY)}
                </p>
                <span
                  className={`typography-label uppercase tracking-widest mt-1 ${
                    dark ? "text-paper/75" : "text-ink-500"
                  }`}
                >
                  {t.monthly}
                </span>

                <p
                  className={`typography-body-sm mt-5 ${dark ? "text-paper/90" : "text-ink-700"}`}
                >
                  {plan.summary[locale]}
                </p>
                <p
                  className={`typography-body-sm mt-3 ${dark ? "text-teal-300" : "text-teal-700"}`}
                >
                  {plan.audience[locale]}
                </p>

                <hr
                  className={`mt-6 ${dark ? "border-teal-800" : "border-surface-3"}`}
                  aria-hidden="true"
                />

                {plan.spotlight ? (
                  <div
                    className={`mt-6 rounded-lg border p-4 ${
                      dark
                        ? "border-teal-800 bg-teal-900"
                        : "border-teal-200 bg-teal-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CameraIcon
                        className={dark ? "text-gold-400" : "text-teal-700"}
                      />
                      <div>
                        <p
                          className={`typography-body-sm font-medium ${
                            dark ? "text-paper" : "text-ink-900"
                          }`}
                        >
                          {plan.spotlight.title[locale]}
                        </p>
                        <p
                          className={`typography-body-sm mt-1 ${
                            dark ? "text-paper/85" : "text-ink-700"
                          }`}
                        >
                          {plan.spotlight.description[locale]}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {plan.baseline ? (
                  <p
                    className={`typography-body-sm mt-6 font-medium ${
                      dark ? "text-paper" : "text-ink-900"
                    }`}
                  >
                    {plan.baseline[locale]}
                  </p>
                ) : null}
                <ul className={`space-y-3 ${plan.baseline ? "mt-4" : "mt-6"}`}>
                  {plan.features.map((f) => (
                    <li key={f.tr} className="flex items-start gap-3">
                      <CheckIcon
                        className={dark ? "text-gold-400" : "text-teal-700"}
                      />
                      <span
                        className={`typography-body-sm ${dark ? "text-paper/90" : "text-ink-700"}`}
                      >
                        {f[locale]}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href={t.contactPath}
                    className={`btn ${dark ? "btn-invert" : "btn-ghost"} w-full justify-center`}
                  >
                    {t.cta}
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="typography-caption mt-6 text-ink-600">
          {retainerPlans.note[locale]}
        </p>
      </div>
    </section>
  );
}
