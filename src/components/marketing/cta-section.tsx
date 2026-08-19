"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { WaveCanvas } from "./wave-canvas";
import { usePersonaState } from "@/lib/hooks/use-persona";
import { usePopup } from "@/lib/popup/popup-context";
import { COMPANY } from "@/lib/content/company";

/**
 * Kapanış CTA — üçlü taahhüt funnel'ının giriş kapısı.
 * Persona-aware başlık + iki somut aksiyon (görüşme, brief).
 */
export function CTASection({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.finalCta");
  const { persona } = usePersonaState();
  const { openPopup } = usePopup();
  const isTr = locale === "tr";

  const p = (key: string) => t(`_personas.${persona}.${key}` as never);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-bg to-teal-100 py-[140px] text-center md:py-[180px]"
      aria-labelledby="cta-title"
    >
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <WaveCanvas intensity={0.8} tone="light" layers={5} />
      </div>

      <div className="ds-container relative z-10 mx-auto flex max-w-[960px] flex-col items-center gap-6">
        <span className="eyebrow">{p("eyebrow")}</span>

        <h2 id="cta-title" className="typography-display-2xl">
          {isTr ? "Dönüşüm bir " : "Transformation is a "}
          <span className="accent-em">{isTr ? "karardır." : "decision."}</span>
          <br />
          {isTr ? "Birlikte verelim." : "Let's make it together."}
        </h2>

        <p className="max-w-[560px] text-step-1 leading-normal text-ink-600">
          {p("lede")}
        </p>

        <div className="mt-6 flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={openPopup} className="btn btn-primary btn-lg">
              {p("paths.booking.cta")}
              <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            </button>
            <Link href={`/${locale}/iletisim`} className="btn btn-ghost btn-lg">
              {p("paths.brief.cta")}
            </Link>
          </div>

          <p className="mono flex flex-wrap items-center justify-center gap-3.5 text-[13px] text-ink-600">
            <a
              href={`mailto:${COMPANY.email}`}
              className="border-b border-current pb-px transition-colors hover:text-teal-700"
            >
              {COMPANY.email}
            </a>
            <span className="text-ink-300" aria-hidden="true">
              ·
            </span>
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="border-b border-current pb-px transition-colors hover:text-teal-700"
            >
              {COMPANY.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
