import Link from "next/link";
import { COMPANY } from "@/lib/content/company";

/**
 * Siyah bilgi şeridi — nav'ın üstünde sabit.
 * İçerik: telefon, e-posta, konum, çalışma saati, sosyal, dil.
 */
export function TopBar({ locale }: { locale: "tr" | "en" }) {
  const other = locale === "tr" ? "en" : "tr";
  const isTr = locale === "tr";

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-group">
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="tb-item">
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
          <a href={`mailto:${COMPANY.email}`} className="tb-item">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <rect x="1.5" y="3" width="13" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 4l6 4.5L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            </svg>
            <span>{COMPANY.email}</span>
          </a>
          <span className="tb-item tb-hide-md">
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

        <div className="topbar-group">
          <span className="tb-item tb-hide-md">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>{isTr ? COMPANY.hours.tr : COMPANY.hours.en}</span>
          </span>
          <span className="tb-divider" aria-hidden="true">
            •
          </span>
          <a
            href={COMPANY.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="tb-item tb-social"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M3.5 6h2v7h-2V6zm1-3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM7 6h2v1c.3-.5 1-1.2 2.2-1.2 2 0 2.3 1.3 2.3 3V13h-2V9.2c0-.9 0-2-1.2-2s-1.3.9-1.3 1.9V13H7V6z" />
            </svg>
          </a>
          <a
            href={COMPANY.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="tb-item tb-social"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="11.4" cy="4.6" r="0.7" fill="currentColor" />
            </svg>
          </a>
          <a
            href={COMPANY.social.x}
            target="_blank"
            rel="noopener noreferrer"
            className="tb-item tb-social"
            aria-label="X"
          >
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M2.5 2.5h2.7L7.7 6l2.6-3.5h2.2l-3.7 4.9L13 13.5h-2.7L7.6 9.9 4.8 13.5H2.6l4-5.2L2.5 2.5zm2 .8L9.2 9.6l.8 1.1 2 2.3h1L6.6 3.3H4.5z" />
            </svg>
          </a>
          <span className="tb-divider" aria-hidden="true">
            •
          </span>
          <Link href={`/${other}`} className="tb-locale mono" hrefLang={other}>
            {other.toUpperCase()}
          </Link>
        </div>
      </div>
    </div>
  );
}
