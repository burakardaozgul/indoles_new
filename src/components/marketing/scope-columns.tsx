import * as React from "react";
import type { Locale } from "@/lib/content/types";

const LABELS = {
  tr: { includes: "Kapsar", excludes: "Kapsamaz" },
  en: { includes: "What's included", excludes: "What's not included" },
} as const;

export type ScopeItem = { title: string; description: string };

/**
 * Kapsam — başlık + açıklama kartları ve sessiz "Kapsamaz" sütunu.
 *
 * Kapsar maddeleri kart gridinde: başlık taranır, açıklama derinlik verir.
 * Tek cümlelik düz liste "metin duvarı" okunuyordu (Burak, 2026-08-20).
 *
 * "Kapsamaz" bilinçli olarak küçük ve kenarda: beklenti hizalar, GEO'da
 * ayrıştırıcı sinyal üretir (spec §5.3) ama sayfanın yıldızı değildir.
 */
export function ScopeColumns({
  includes,
  excludes,
  locale,
}: {
  includes: ScopeItem[];
  excludes: string[];
  locale: Locale;
}) {
  const t = LABELS[locale];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-8">
        <h3 className="typography-label uppercase tracking-widest text-ink-500">
          {t.includes}
        </h3>
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {includes.map((item) => (
            <li
              key={item.title}
              className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-7"
            >
              <h4 className="typography-h3 text-ink-900">{item.title}</h4>
              <p className="typography-body-sm text-ink-700 mt-3">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {excludes.length > 0 ? (
        <div className="lg:col-span-4">
          <h3 className="typography-label uppercase tracking-widest text-ink-500">
            {t.excludes}
          </h3>
          <ul className="mt-6 border-t border-surface-2">
            {excludes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 py-4 border-b border-surface-2 typography-body-sm text-ink-500"
              >
                <span aria-hidden="true" className="mt-1 shrink-0">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
