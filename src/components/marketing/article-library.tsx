"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import type { ArticleTopic } from "@/lib/content/types";
import { gaEvent } from "@/lib/analytics/ga";

/**
 * Bilgi kütüphanesi listesi ve konu filtresi (ADR-021).
 *
 * Neden istemci bileşeni: filtre etkileşimi. Neden yine de her yazı HTML'de:
 * bu bileşen sunucuda da render ediliyor ve eşleşmeyen satırlar DOM'dan
 * çıkarılmıyor, `hidden` ile gizleniyor. Böylece JS çalışmasa da (ve tarayıcısı
 * olmayan crawler'lar için) 16 linkin tamamı kaynakta duruyor.
 *
 * Neden `useSearchParams` yok: bu sayfa SSG. `useSearchParams` sayfayı dinamik
 * render'a düşürüyor. Onun yerine URL, hidrasyondan sonra `history` API'siyle
 * okunup yazılıyor — sayfa statik kalıyor, paylaşılan `?konu=` linki hidrasyonda
 * uygulanıyor.
 */

export type ArticleRow = {
  key: string;
  href: string;
  title: string;
  excerpt: string;
  topic: ArticleTopic;
  topicLabel: string;
  publishedLabel: string;
  updatedLabel: string | null;
  readingMinutes: number;
  authorName: string | null;
};

export type TopicChip = {
  id: ArticleTopic;
  label: string;
  blurb: string;
  count: number;
};

export type LibraryLabels = {
  /** Filtre şeridinin ekran okuyucu adı. */
  groupLabel: string;
  all: string;
  allBlurb: string;
  minRead: string;
  updated: string;
  /** `{count}` yer tutucusu. */
  resultCount: string;
  empty: string;
  clear: string;
};

/** URL sorgu anahtarı locale'e göre değişir — TR okur `?konu=` görür. */
function queryKey(locale: "tr" | "en"): string {
  return locale === "tr" ? "konu" : "topic";
}

export function ArticleLibrary({
  rows,
  topics,
  labels,
  locale,
}: {
  rows: ArticleRow[];
  topics: TopicChip[];
  labels: LibraryLabels;
  locale: "tr" | "en";
}) {
  const [active, setActive] = React.useState<ArticleTopic | null>(null);
  const key = queryKey(locale);
  const valid = React.useMemo(() => new Set(topics.map((t) => t.id)), [topics]);

  // URL → durum. Hidrasyondan sonra bir kez, sonra geri/ileri tuşunda.
  React.useEffect(() => {
    const read = () => {
      const raw = new URLSearchParams(window.location.search).get(key);
      setActive(raw && valid.has(raw as ArticleTopic) ? (raw as ArticleTopic) : null);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [key, valid]);

  const select = React.useCallback(
    (topic: ArticleTopic | null) => {
      setActive(topic);
      const url = new URL(window.location.href);
      if (topic) url.searchParams.set(key, topic);
      else url.searchParams.delete(key);
      // pushState: geri tuşu bir önceki filtreye döner, link paylaşılabilir.
      window.history.pushState(null, "", url);
      gaEvent("article_filter", { topic: topic ?? "all", locale });
    },
    [key, locale],
  );

  const visible = active ? rows.filter((r) => r.topic === active) : rows;
  const leadKey = visible[0]?.key ?? null;
  const activeTopic = active ? topics.find((t) => t.id === active) : null;

  return (
    <>
      {/* Filtre şeridi */}
      <section className="border-b border-surface-2">
        <div className="ds-container py-8 md:py-10">
          <div
            role="group"
            aria-label={labels.groupLabel}
            className="flex flex-wrap gap-2"
          >
            <Chip
              label={labels.all}
              count={rows.length}
              pressed={active === null}
              onSelect={() => select(null)}
            />
            {topics.map((t) => (
              <Chip
                key={t.id}
                label={t.label}
                count={t.count}
                pressed={active === t.id}
                onSelect={() => select(t.id)}
              />
            ))}
          </div>

          <p
            className="typography-body-md text-ink-600 mt-6 max-w-prose-editorial"
            aria-live="polite"
          >
            <span className="text-ink-900">
              {labels.resultCount.replace("{count}", String(visible.length))}
            </span>{" "}
            {activeTopic ? activeTopic.blurb : labels.allBlurb}
          </p>
        </div>
      </section>

      <section className="v2-surface">
        <div className="ds-container py-14 md:py-20">
          {visible.length === 0 ? (
            <div className="py-16 text-center">
              <p className="typography-body-lg text-ink-700">{labels.empty}</p>
              <button
                type="button"
                onClick={() => select(null)}
                className="typography-label uppercase tracking-widest text-brand-700 mt-6 underline underline-offset-4 hover:text-brand-800"
              >
                {labels.clear}
              </button>
            </div>
          ) : null}

          <ol className={visible.length > 0 ? "border-t border-surface-2" : ""}>
            {rows.map((r) => {
              const shown = !active || r.topic === active;
              const isLead = r.key === leadKey;
              return (
                <li
                  key={r.key}
                  hidden={!shown}
                  className="border-b border-surface-2"
                >
                  <Link
                    href={r.href as Route}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-8 md:py-10 px-0 md:px-4 -mx-0 md:-mx-4 rounded-lg"
                  >
                    <div className="md:col-span-3 flex flex-row md:flex-col gap-x-4 gap-y-1 items-baseline md:items-start">
                      <span className="typography-label uppercase tracking-widest text-brand-700">
                        {r.topicLabel}
                      </span>
                      <span className="typography-caption text-ink-500 md:mt-3">
                        {r.publishedLabel}
                      </span>
                      <span className="typography-caption text-ink-500">
                        {r.readingMinutes} {labels.minRead}
                      </span>
                      {r.updatedLabel ? (
                        <span className="typography-caption text-gold-700 md:mt-2">
                          {labels.updated} · {r.updatedLabel}
                        </span>
                      ) : null}
                    </div>
                    <div className="md:col-span-9">
                      <h2
                        className={`text-ink-900 group-hover:text-brand-800 transition-colors ${
                          isLead ? "typography-h1 max-w-[24ch]" : "typography-h2"
                        }`}
                      >
                        {r.title}
                      </h2>
                      <p
                        className={`text-ink-700 mt-3 max-w-prose-editorial ${
                          isLead ? "typography-body-lg" : "typography-body-md"
                        }`}
                      >
                        {r.excerpt}
                      </p>
                      {r.authorName ? (
                        <p className="typography-caption text-ink-500 mt-4">
                          {r.authorName}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}

function Chip({
  label,
  count,
  pressed,
  onSelect,
}: {
  label: string;
  count: number;
  pressed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={[
        // 44px dokunma hedefi (WCAG 2.2 target size)
        "min-h-11 inline-flex items-center gap-2 rounded-full border px-4 py-2",
        "typography-body-sm transition-colors",
        pressed
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-ink-200 bg-surface-1 text-ink-700 hover:border-brand-400 hover:text-brand-800",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={pressed ? "text-brand-200" : "text-ink-400"}
        aria-hidden="true"
      >
        {count}
      </span>
    </button>
  );
}
