import type { CaseFlowIcon } from "@/lib/content/types";

/**
 * Yaklaşım mekanizma diyagramı (ADR-019).
 *
 * Her düğüm bir iş adımıdır: glyph mekanizmayı, numara sırayı, etiket adı
 * söyler. Glyph'ler dekoratif ikon seti değildir — her biri adımın ne
 * yaptığını çizer (docs/04 §1 "her görsel bir mekanizma anlatır"):
 *
 * - measure: merkez sinyal + halkalar — ölçüm/izleme kurulumu
 * - segment: tek girişin üç kola ayrılması — segmentasyon
 * - broadcast: kaynaktan yayılan dalgalar — kampanya/yayın
 * - grid: üç dolu + bir eklenen kutu — kategori/kapsam genişletme
 * - advise: sohbet balonu + kıvılcım — AI danışman / öneri motoru
 * - sync: dönen oklar — otomatik senkron; server: yığın — altyapı
 * - build / design / content / search: yazılım, arayüz, içerik, arama —
 *   kayıt defteri types.ts'teki union'la senkron
 *
 * Masaüstünde yatay akış (ok sağa), mobilde dikey (ok aşağı döner).
 */

const GLYPHS: Record<CaseFlowIcon, React.ReactNode> = {
  measure: (
    <>
      <circle cx="10" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="5" />
      <path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" />
    </>
  ),
  segment: (
    <>
      <path d="M2 10h5" />
      <path d="M7 10c3 0 3-5 6-5h5M7 10h11M7 10c3 0 3 5 6 5h5" />
    </>
  ),
  broadcast: (
    <>
      <circle cx="5" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <path d="M8.5 6.5a5 5 0 0 1 0 7M12 4a9 9 0 0 1 0 12M15.5 1.5a13.5 13.5 0 0 1 0 17" />
    </>
  ),
  grid: (
    <>
      <rect x="2" y="2" width="6.5" height="6.5" />
      <rect x="2" y="11.5" width="6.5" height="6.5" />
      <rect x="11.5" y="2" width="6.5" height="6.5" />
      <path d="M14.75 12.5v5M12.25 15h5" strokeDasharray="none" />
      <rect x="11.5" y="11.5" width="6.5" height="6.5" strokeDasharray="2 2" />
    </>
  ),
  build: (
    <>
      <path d="M7 6 3 10l4 4M13 6l4 4-4 4M11 4l-2 12" />
    </>
  ),
  design: (
    <>
      <rect x="2" y="3" width="16" height="14" />
      <path d="M2 7h16M7 7v10" />
    </>
  ),
  content: (
    <>
      <path d="M4 2.5h12v15H4z" />
      <path d="M7 7h6M7 10.5h6M7 14h4" />
    </>
  ),
  search: (
    <>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5 18 18" />
    </>
  ),
  sync: (
    <>
      <path d="M16.5 8.5a6.5 6.5 0 0 0-11.6-2.5M3.5 11.5a6.5 6.5 0 0 0 11.6 2.5" />
      <path d="M16.5 3.5v5h-5M3.5 16.5v-5h5" />
    </>
  ),
  advise: (
    <>
      <path d="M17 11.5a4 4 0 0 1-4 4H8l-4 3v-3H4a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h9a4 4 0 0 1 4 4Z" />
      <path d="M9 6.5l.8 1.9 1.9.8-1.9.8L9 11.9l-.8-1.9L6.3 9.2l1.9-.8Z" fill="currentColor" stroke="none" />
    </>
  ),
  film: (
    <>
      <rect x="2" y="4" width="16" height="12" rx="1" />
      <path d="M2 7.5h3M2 12.5h3M15 7.5h3M15 12.5h3" />
      <path d="M8.5 7.8v4.4l3.6-2.2Z" fill="currentColor" stroke="none" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="2.5" width="14" height="6" />
      <rect x="3" y="11.5" width="14" height="6" />
      <circle cx="6.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

export function CaseFlowDiagram({
  steps,
  icons,
  label,
}: {
  steps: string[];
  icons?: CaseFlowIcon[] | undefined;
  label: string;
}) {
  return (
    <div role="img" aria-label={`${label}: ${steps.join(" → ")}`}>
      <ol className="mt-12 flex flex-col gap-2 md:flex-row md:items-stretch" aria-hidden>
        {steps.map((step, i) => (
          <li key={step} className="contents">
            {i > 0 ? (
              <span className="flex items-center justify-center self-center px-1 py-1 text-ink-300 md:px-0 md:py-0">
                {/* Mobilde aşağı, masaüstünde sağa bakan ok */}
                <svg viewBox="0 0 20 20" width="18" height="18" className="rotate-90 md:rotate-0">
                  <path
                    d="M2 10h14M12 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    fill="none"
                  />
                </svg>
              </span>
            ) : null}
            <div className="flex flex-1 items-center gap-4 rounded-xl border border-surface-3 v2-surface p-4 md:flex-col md:items-start md:gap-5 md:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <svg
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  {icons?.[i] ? GLYPHS[icons[i]!] : <circle cx="10" cy="10" r="6" />}
                </svg>
              </span>
              <span className="flex flex-col gap-1">
                <span className="typography-caption mono tracking-widest text-ink-400">
                  0{i + 1}
                </span>
                <span className="typography-caption mono uppercase tracking-widest text-teal-800">
                  {step}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
