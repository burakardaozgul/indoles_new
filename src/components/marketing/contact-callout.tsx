import Link from "next/link";
import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PopupCTAButton } from "./PopupCTAButton";

/**
 * Ortak sayfa sonu CTA şeridi — her inner page'de tekrar etmesin diye tek
 * kaynak. Homepage'deki FinalCTASection'dan daha sakin.
 */
export async function ContactCallout({ locale }: { locale: "tr" | "en" }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const tCta = await getTranslations({ locale, namespace: "home.finalCta" });

  return (
    <section className="bg-ink-900 text-paper">
      <div className="ds-container py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <h2 className="typography-display-lg text-paper">
            {tCta("headline")}
          </h2>
          <p className="typography-body-lg text-paper/70 mt-6 max-w-prose-editorial">
            {tCta("lede")}
          </p>
        </div>
        <div className="md:col-span-5 flex flex-col gap-4 md:items-end">
          <PopupCTAButton className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-ink-900 hover:/90 transition-colors typography-body-md">
            <Phone size={16} aria-hidden />
            {t("cta.bookConsultation")}
          </PopupCTAButton>
          {/* `/app/brief/yeni` ADR-008 ile kaldırıldı ama link 13 sayfada
              duruyordu ve 404 veriyordu. Brief formu artık /iletisim içinde. */}
          <Link
            href={`/${locale}/iletisim`}
            className="inline-flex items-center gap-2 text-paper typography-body-sm"
          >
            <span className="underline underline-offset-4 decoration-paper/40 hover:decoration-paper">
              {t("cta.submitBrief")}
            </span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
