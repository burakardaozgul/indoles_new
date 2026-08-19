"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { WaveCanvas } from "./wave-canvas";
import { PersonaChip } from "./entry-popup/PersonaChip";
import { usePersonaState } from "@/lib/hooks/use-persona";
import { usePopup } from "@/lib/popup/popup-context";
import { COMPANY } from "@/lib/content/company";

/**
 * Anasayfa hero — dalga zemin + ortalanmış devasa başlık.
 *
 * Persona bağlantısı (ADR-014): ziyaretçi entry popup'ta persona seçtiyse
 * başlık ve destek metni o persona'nın versiyonuna geçer. Cookie okunana
 * kadar nötr versiyon görünür; geçiş opaklıkla yumuşatılır (FOIC önlemi).
 */
export function Hero({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const { openPopup, open } = usePopup();
  const { slug, ready } = usePersonaState();
  const [personaSlug, setPersonaSlug] = React.useState(slug);
  const [time, setTime] = React.useState("");

  // Popup kapandığında persona değişmiş olabilir
  React.useEffect(() => {
    setPersonaSlug(slug);
  }, [slug]);
  React.useEffect(() => {
    if (!open) {
      import("@/lib/popup/use-entry-popup").then((m) => setPersonaSlug(m.readCurrentPersona()));
    }
  }, [open]);

  React.useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString(locale === "tr" ? "tr-TR" : "en-GB", {
          timeZone: COMPANY.geo.timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [locale]);

  const base = personaSlug ? `personas.${personaSlug}.` : "";
  const part = (key: string) => t(`${base}editorial.${key}` as never);
  const lead = t(`${base}support` as never);

  return (
    <section id="top" className="hero">
      <div className="hero-bg">
        <WaveCanvas intensity={1} tone="light" layers={6} />
      </div>

      <div className="hero-content">
        <div className="mb-10 flex flex-col items-center gap-4">
          <span className="eyebrow eyebrow-bare hero-chip mono">
            {t("eyebrow")}
          </span>
          {personaSlug && (
            <PersonaChip persona={personaSlug} onReopen={openPopup} />
          )}
        </div>

        <h1
          className="hero-title mb-8 transition-opacity duration-500"
          style={{ opacity: ready ? 1 : 0.92 }}
        >
          <span className="line">{part("before")}</span>
          <span className="line accent-em">{part("emphasisA")}</span>
          <span className="line">
            {part("middle").replace(/^[,\s]+/, "")}
            <span className="accent-em"> {part("emphasisB")}</span>
            {part("after")}
          </span>
        </h1>

        <p
          className="hero-lead mb-11 transition-opacity duration-500"
          style={{ opacity: ready ? 1 : 0.92 }}
        >
          {lead}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openPopup} className="btn btn-primary">
            {tCommon("cta.bookConsultation")}
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </button>
          <a href={`/${locale}/hizmetler`} className="btn btn-ghost">
            {tCommon("cta.viewServices")}
          </a>
        </div>

        <div className="hero-bottom mono">
          <span className="flex items-center gap-2.5">
            <span className="hero-status-dot" aria-hidden="true">
              ●
            </span>
            <span>
              İSTANBUL{time ? ` · ${time}` : ""}
            </span>
          </span>

          <span className="hidden flex-col items-center gap-2.5 text-[10px] uppercase tracking-[0.16em] text-ink-600 md:flex">
            <span>{locale === "tr" ? "Kaydır" : "Scroll"}</span>
            <svg width="18" height="28" viewBox="0 0 18 28" aria-hidden="true">
              <rect x="1" y="1" width="16" height="26" rx="8" stroke="currentColor" fill="none" strokeWidth="1" />
              <circle cx="9" cy="8" r="1.5" fill="currentColor" className="scroll-dot" />
            </svg>
          </span>

          <span className="hero-coords text-right">
            {COMPANY.geo.lat} &nbsp;·&nbsp; {COMPANY.geo.lon}
          </span>
        </div>
      </div>

      <div className="hero-edge-mono mono" aria-hidden="true">
        INDOLES / V.2026 / EVOLVE — BUILD — GROW
      </div>
    </section>
  );
}
