"use client";

import * as React from "react";
import { COMPANY } from "@/lib/content/company";

/**
 * Bülten kaydı — e-posta istemcisini önceden doldurup açar.
 *
 * Eski footer'daki form `action="mailto:" method="post"` kullanıyordu; bu
 * modern tarayıcılarda ya hiçbir şey yapmıyor ya da bozuk bir gövde üretiyor.
 * Kullanıcı adresini yazıp hiçbir şey olmaması, formu hiç koymamaktan kötü.
 *
 * TODO(burak): Kalıcı çözüm `/api/contact` üzerinden bir liste kaydı veya bir
 * e-posta sağlayıcısı entegrasyonu. Bu hâli çalışıyor ama manuel.
 */
export function V2Newsletter({ locale }: { locale: "tr" | "en" }) {
  const [email, setEmail] = React.useState("");
  const isTr = locale === "tr";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = isTr ? "Bülten aboneliği" : "Newsletter subscription";
    const body = isTr
      ? `Bültene abone olmak istiyorum: ${email}`
      : `I'd like to subscribe to the newsletter: ${email}`;
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="v2-sf-form" onSubmit={onSubmit}>
      <label htmlFor="v2-newsletter-email" className="sr-only">
        {isTr ? "E-posta adresiniz" : "Your email address"}
      </label>
      <input
        id="v2-newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={isTr ? "E-posta adresiniz" : "Your email address"}
        className="v2-sf-input"
      />
      <button
        type="submit"
        className="v2-sf-submit"
        aria-label={isTr ? "Bültene abone ol" : "Subscribe to newsletter"}
      >
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
          <path
            d="M3 11 L11 3 M5 3 H11 V9"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
