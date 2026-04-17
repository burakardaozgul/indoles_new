import { getTranslations } from "next-intl/server";

export async function ManifestoSection({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "home.manifesto" });

  return (
    <section
      aria-label="Manifesto"
      className="bg-ink-900"
      style={{ colorScheme: "dark" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-20 md:py-24">
        <figure className="max-w-[38ch] mx-auto text-center">
          {/* Quote marks — brand-300, göz alıcı boyut */}
          <svg
            aria-hidden
            viewBox="0 0 40 30"
            className="w-10 h-auto mx-auto"
            style={{ color: "var(--color-brand-300)" }}
            fill="currentColor"
          >
            <path d="M13.3 0C5.9 0 0 5.5 0 13v17h15V13h-7c0-4.1 3.3-7 7-7V0h-1.7zM38.3 0C30.9 0 25 5.5 25 13v17h15V13h-7c0-4.1 3.3-7 7-7V0h-1.7z" />
          </svg>

          <blockquote
            className="typography-display-lg text-paper mt-8 leading-[1.2]"
            style={{ fontWeight: 400 }}
          >
            {t("quote")}
          </blockquote>

          <figcaption
            className="typography-body-sm mt-6"
            style={{
              color: "var(--color-brand-200)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            — {t("attribution")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
