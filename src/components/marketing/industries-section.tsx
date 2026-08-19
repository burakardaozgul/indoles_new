import Link from "next/link";
import { INDUSTRIES } from "@/lib/content/industries";

const GLYPH = ["◐", "◓", "◑", "◒"] as const;

/**
 * Sektörler — bento grid. Her hücre sektörün getirdiği tipik problemi taşır;
 * doğrulanmamış proje sayacı taşımaz (bkz. `industries.ts` notu).
 */
export function IndustriesSection({ locale }: { locale: "tr" | "en" }) {
  const isTr = locale === "tr";

  return (
    <section
      id="industries"
      className="border-y border-ink-100 py-[120px]"
      aria-labelledby="industries-title"
    >
      <div className="ds-container">
        <div className="mb-14 grid items-end gap-8 md:grid-cols-[1fr_2fr] md:gap-20">
          <span className="eyebrow">{isTr ? "Sektörler" : "Industries"}</span>
          <h2 id="industries-title" className="typography-h1">
            {isTr ? "Her sektörün kendi " : "Every industry speaks its own "}
            <span className="accent-em">{isTr ? "dönüşüm dili" : "language of change"}</span>
            {isTr ? " vardır." : "."}
          </h2>
        </div>

        <div className="ind-grid">
          {INDUSTRIES.map((it, i) => (
            <Link
              key={it.slug}
              href={`/${locale}/vakalar`}
              className="ind-item"
              aria-label={`${it.name[locale]} — ${isTr ? "ilgili vakalar" : "related cases"}`}
            >
              <span className="text-[28px] leading-none text-teal-700" aria-hidden="true">
                {GLYPH[i % GLYPH.length]}
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="font-display text-[17px] font-medium text-ink-900">
                  {it.name[locale]}
                </span>
                <span className="text-xs leading-snug text-ink-500">{it.problem[locale]}</span>
              </span>
              <svg className="ind-arrow shrink-0" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
