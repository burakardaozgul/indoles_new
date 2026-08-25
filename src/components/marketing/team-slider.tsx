"use client";

import * as React from "react";
import Link from "next/link";
import { CONSULTANTS_ORDERED, BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import { COMPANY } from "@/lib/content/company";

const ROTATE_MS = 7000;

/**
 * Kadro slider'ı — solda portre bloğu, sağda alıntı + biyografi.
 *
 * Portre fotoğrafı yok: baş harfler `portraitTone` ile üretilen bir zemin
 * üstünde gösterilir. Fotoğraflar geldiğinde bu blok `<Image>` ile değişir,
 * layout aynı kalır.
 */
export function TeamSlider({ locale }: { locale: "tr" | "en" }) {
  const members = CONSULTANTS_ORDERED;
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const isTr = locale === "tr";

  React.useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % members.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, members.length]);

  const go = (n: number) => setIdx((n + members.length) % members.length);
  const current = members[idx]!;

  return (
    <section
      id="team"
      className="relative overflow-hidden border-t border-ink-100 py-[100px] md:py-[140px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 400px at 20% 10%, rgb(184 148 120 / 0.05), transparent 60%), radial-gradient(ellipse 700px 400px at 90% 90%, rgb(123 138 154 / 0.05), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-[72px]">
        <div className="reveal mb-16 max-w-[780px]">
          <div className="mb-4 flex items-center justify-between gap-6">
            <span className="eyebrow">{isTr ? "Takımımız" : "Our team"}</span>
            <span className="mono text-[11px] tracking-[0.18em] text-ink-500 tabular">
              {String(idx + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="typography-display-lg mb-7">
            {isTr ? "Yaratıcı zihinler," : "Creative minds,"}
            <br />
            <span className="accent-em">{isTr ? "ortak bir amaç" : "one shared purpose"}</span>
          </h2>
          <p className="max-w-[58ch] text-lg leading-relaxed text-ink-600">
            {isTr
              ? "Sanat, tasarım, müzik, felsefe, tarih ve bilimle sık sık etkileşim kuran dinamik bir ekip. Düşünce gücümüz yüksek; yeni fikirleri derinlemesine keşfetmekten keyif alırız."
              : "A dynamic team in constant conversation with art, design, music, philosophy, history and science. We think hard, and we enjoy exploring new ideas in depth."}
          </p>
        </div>

        <div className="reveal mb-16">
          <div className="ts-stage">
            <div className="flex flex-col gap-4">
              <div
                key={`portrait-${idx}`}
                className="ts-portrait-inner"
                style={{ ["--tone" as string]: current.portraitTone }}
              >
                <div className="ts-bg" aria-hidden="true" />
                <span className="ts-initials" aria-hidden="true">
                  {current.initials}
                </span>
                <span className="ts-corner ts-tl" aria-hidden="true" />
                <span className="ts-corner ts-tr" aria-hidden="true" />
                <span className="ts-corner ts-bl" aria-hidden="true" />
                <span className="ts-corner ts-br" aria-hidden="true" />
              </div>
              <div className="mono ts-portrait-caption flex justify-between text-[10.5px] tracking-[0.2em] text-ink-500">
                <span>N° {String(idx + 1).padStart(3, "0")}</span>
                <span>INDOLES · {new Date().getFullYear()}</span>
              </div>
            </div>

            <div key={`content-${idx}`} className="ts-content flex flex-col justify-center gap-6 py-2">
              <svg className="h-7 w-9 text-ink-200" viewBox="0 0 40 32" fill="none" aria-hidden="true">
                <path
                  d="M0 32V20C0 8.5 6 1 16 0l1 4C10 5.5 7 9 7 14h9v18H0zm24 0V20C24 8.5 30 1 40 0l1 4c-7 1.5-10 5-10 10h9v18H24z"
                  fill="currentColor"
                />
              </svg>

              <blockquote className="ts-quote">{current.quote[locale]}</blockquote>

              <div className="my-2 h-0.5 w-12 bg-ink-900" aria-hidden="true" />

              <div className="flex flex-col gap-2">
                <h3 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-ink-900">
                  {current.name}
                </h3>
                <p className="mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  {current.title[locale]}
                </p>
                <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-ink-600">
                  {current.shortBio[locale]}
                </p>
                {current.pillars.length > 0 && (
                  <Link
                    href={`/${locale}/danismanlar/${current.slug}`}
                    className="case-link mt-4 text-[13px]"
                  >
                    {isTr ? "Profili gör" : "View profile"}
                    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                      <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-5">
            <button
              type="button"
              className="ts-arrow"
              onClick={() => go(idx - 1)}
              aria-label={isTr ? "Önceki ekip üyesi" : "Previous team member"}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {members.map((m, i) => (
                <button
                  key={m.slug}
                  type="button"
                  className={`ts-dot${i === idx ? " is-active" : ""}`}
                  onClick={() => go(i)}
                  aria-label={m.name}
                  aria-current={i === idx ? "true" : undefined}
                >
                  <span className="ts-dot-fill" />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="ts-arrow"
              onClick={() => go(idx + 1)}
              aria-label={isTr ? "Sonraki ekip üyesi" : "Next team member"}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="reveal flex flex-wrap items-center justify-between gap-8 border-t border-ink-100 pt-12">
          <p className="mono text-[11px] tracking-[0.18em] text-ink-500">
            {/*
              `members` slider'da görüneni sayar ve ofis köpeğini (`hipnoz`)
              içerir; künyedeki sayı ise kurumsal bir iddiadır ve insanları
              saymalı. İkisi ayrı listeden beslenir.
            */}
            {BOOKABLE_CONSULTANTS.length} {isTr ? "kişi" : "people"} ·{" "}
            {COMPANY.locations.join(" · ")}
          </p>
          <a href={`mailto:${COMPANY.careersEmail}`} className="btn btn-primary">
            {isTr ? "Aramıza katıl" : "Join the team"}
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
