"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PILLARS } from "@/lib/content/pillars";
import { ServiceIllustration } from "./service-illustration";
import { usePersonaState } from "@/lib/hooks/use-persona";
import { usePopup } from "@/lib/popup/popup-context";

type Flat = {
  slug: string;
  pillarKey: string;
  pillarName: string;
  name: string;
  desc: string;
};

/**
 * Hizmet portföyü — sticky bölüm içinde scroll'a bağlı yatay track.
 *
 * Dikey scroll yatay ilerlemeye çevrilir; bölümün yüksekliği kart sayısına
 * göre hesaplanır. 900px altında bu mekanizma devre dışı kalır ve kartlar
 * dikey grid'e döner (bkz. `sections.css` → `.services-*` media query).
 */
export function ServicesScroll({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.pillars");
  const tCommon = useTranslations("common");
  const { persona } = usePersonaState();
  const { openPopup } = usePopup();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLUListElement | null>(null);
  const [progress, setProgress] = React.useState(0);
  const isTr = locale === "tr";

  const services: Flat[] = React.useMemo(
    () =>
      PILLARS.flatMap((p) =>
        p.services.map((s) => ({
          slug: s.slug,
          pillarKey: p.key,
          pillarName: p.name[locale],
          name: s.name[locale],
          desc: s.shortDescription[persona][locale],
        })),
      ),
    [locale, persona],
  );

  React.useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      const track = trackRef.current;
      if (!sec || !track) return;
      if (window.innerWidth <= 900) {
        track.style.transform = "";
        return;
      }
      const scrollable = sec.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, -sec.getBoundingClientRect().top);
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);
      const moveMax = track.scrollWidth - window.innerWidth + 48;
      track.style.transform = `translate3d(${-p * Math.max(0, moveMax)}px, 0, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [services.length]);

  const shown = Math.min(services.length, Math.floor(progress * services.length) + 1);

  return (
    <section
      id="services"
      className="services-sec"
      ref={sectionRef}
      style={{ height: `${100 + services.length * 40}vh` }}
      aria-labelledby="services-title"
    >
      <div className="services-sticky">
        <div className="ds-container-wide pb-4 pt-8">
          <div className="grid items-end gap-6 md:grid-cols-[1.3fr_1fr] md:gap-12">
            <div className="flex flex-col gap-4">
              <span className="eyebrow">
                {isTr
                  ? `Hizmet portföyü · ${services.length} disiplin`
                  : `Service portfolio · ${services.length} disciplines`}
              </span>
              <h2 id="services-title" className="typography-h2 max-w-[20ch]">
                {isTr ? "Bütüncül dönüşüm için " : "End-to-end expertise for "}
                <span className="accent-em">{isTr ? "uçtan uca" : "holistic"}</span>
                {isTr ? " uzmanlıklar." : " transformation."}
              </h2>
            </div>

            <div className="services-progress flex flex-col items-end gap-2.5">
              <div className="mono mb-2.5 flex w-full items-baseline justify-between text-[11px] tracking-[0.1em] text-ink-500">
                <span className="tabular text-sm font-semibold tracking-[0.08em] text-ink-900">
                  {String(shown).padStart(3, "0")} / {String(services.length).padStart(3, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-ink-400">
                  {isTr ? "Kaydırarak gezin →" : "Scroll to browse →"}
                </span>
              </div>
              <div className="prog-bar" role="presentation">
                <div className="prog-fill" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="services-track-wrap">
          <ul className="services-track" ref={trackRef}>
            {services.map((s, i) => (
              <li key={s.slug} className="svc-card">
                <div className="mono flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-ink-500">
                  <span className="text-teal-700">{String(i + 1).padStart(3, "0")}</span>
                  <span className="rounded-md border border-ink-200 px-2.5 py-1 text-[10px]">
                    {s.pillarName}
                  </span>
                </div>

                <div className="svc-illo">
                  <ServiceIllustration index={i} />
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                  <h3 className="text-lg font-medium leading-tight tracking-tight text-ink-900">
                    {s.name}
                  </h3>
                  <p className="svc-desc text-[12.5px] leading-snug text-ink-600">{s.desc}</p>
                </div>

                <Link
                  href={`/${locale}/hizmetler/${s.pillarKey}`}
                  className="mono flex items-center justify-between border-t border-ink-100 pt-2.5 text-[10.5px] uppercase tracking-[0.14em] text-ink-800 transition-colors hover:text-teal-700"
                >
                  {tCommon("cta.explore")}
                  <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                    <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </Link>
              </li>
            ))}

            <li className="services-end">
              <div className="flex max-w-[400px] flex-col gap-4 rounded-xl bg-ink-900 p-9 text-white">
                <span className="eyebrow eyebrow-gold">
                  {isTr ? "Aradığınızı bulamadınız mı?" : "Didn't find what you need?"}
                </span>
                <h3 className="typography-h2 text-white">
                  {isTr
                    ? "Özel bir dönüşüm kurgusu inşa edelim."
                    : "Let's build a bespoke transformation."}
                </h3>
                <button type="button" onClick={openPopup} className="btn btn-invert mt-3 self-start">
                  {tCommon("cta.bookConsultation")}
                  <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
