import { COMPANY } from "@/lib/content/company";

/**
 * Siyah bilgi şeridi — sayfanın en üstünde, sabit.
 *
 * v2'nin krem zemininde tek koyu yüzey budur; nav'ı bir üst sınırdan
 * ayırır ve iletişim bilgisini scroll'dan bağımsız olarak erişilebilir
 * tutar. Yükseklik `--v2-topbar-h` ile `v2.css`'te tanımlıdır — nav'ın
 * `top` değeri ve `.v2-root` üst boşluğu aynı değişkeni okur.
 *
 * Dil seçimi burada değil nav'dadır: v2'de dil, birincil aksiyonlarla
 * (rezervasyon) aynı kümede duruyor.
 */
export function V2TopBar({ locale }: { locale: "tr" | "en" }) {
  const isTr = locale === "tr";

  return (
    <div className="v2-topbar">
      <div className="v2-topbar-inner">
        <div className="v2-topbar-group">
          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
            className="v2-tb-item"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <path
                d="M3 2h2.5L7 5 5.5 6.5a9 9 0 0 0 4 4L11 9l3 1.5V13c0 .55-.45 1-1 1A11 11 0 0 1 2 3c0-.55.45-1 1-1z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span>{COMPANY.phone}</span>
          </a>
          <a href={`mailto:${COMPANY.email}`} className="v2-tb-item">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <rect x="1.5" y="3" width="13" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 4l6 4.5L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            </svg>
            <span>{COMPANY.email}</span>
          </a>
          <span className="v2-tb-item v2-tb-hide-md">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <path
                d="M8 14s5-4.5 5-8.5A5 5 0 0 0 3 5.5C3 9.5 8 14 8 14z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="5.5" r="1.6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>{COMPANY.locations.join(" · ")}</span>
          </span>
        </div>

        <div className="v2-topbar-group">
          <span className="v2-tb-item v2-tb-hide-md">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>{isTr ? COMPANY.hours.tr : COMPANY.hours.en}</span>
          </span>
          <span className="v2-tb-divider" aria-hidden="true">
            •
          </span>
          <a
            href={COMPANY.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-tb-item v2-tb-social"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path d="M3.5 6h2v7h-2V6zm1-3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM7 6h2v1c.3-.5 1-1.2 2.2-1.2 2 0 2.3 1.3 2.3 3V13h-2V9.2c0-.9 0-2-1.2-2s-1.3.9-1.3 1.9V13H7V6z" />
            </svg>
          </a>
          <a
            href={COMPANY.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-tb-item v2-tb-social"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="11.4" cy="4.6" r="0.7" fill="currentColor" />
            </svg>
          </a>
          <a
            href={COMPANY.social.x}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-tb-item v2-tb-social"
            aria-label="X"
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path d="M2.5 2.5h2.7L7.7 6l2.6-3.5h2.2l-3.7 4.9L13 13.5h-2.7L7.6 9.9 4.8 13.5H2.6l4-5.2L2.5 2.5zm2 .8L9.2 9.6l.8 1.1 2 2.3h1L6.6 3.3H4.5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
