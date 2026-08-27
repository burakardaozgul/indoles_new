"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Kök layout'un kendisi render edilemediğinde devreye giren tek ekran.
 *
 * Bu dosya yokken Next uyarı veriyordu ve o hata sınıfında ziyaretçi boş
 * beyaz sayfa görüyordu: `error.tsx` dosyaları kendi layout'larının içinde
 * render edildiği için kök layout çöktüğünde hiçbiri çalışmaz. Burası kendi
 * `<html>`/`<body>`sini basmak zorunda — çalışan bir layout kalmadı.
 *
 * Stil token'lara değil ham değerlere dayanıyor: globals.css bu noktada
 * yüklenmemiş olabilir, `@theme` değişkenleri güvenilir değil. Marka
 * renkleri (bg #FAFAF7, teal-700 #2C5566) bilinçli olarak sabit yazıldı —
 * design token kuralının kasıtlı ve dar bir istisnası.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAF7",
          color: "#1A1A1A",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: "34rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2C5566",
              margin: "0 0 1rem",
            }}
          >
            INDOLES
          </p>
          <h1
            style={{
              fontSize: "1.75rem",
              lineHeight: 1.25,
              fontWeight: 600,
              margin: "0 0 0.75rem",
            }}
          >
            Bir şeyler ters gitti.
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#4A4A4A",
              margin: "0 0 2rem",
            }}
          >
            Hata kaydedildi. Sayfayı yeniden deneyebilir ya da ana sayfaya
            dönebilirsin. Sorun sürerse{" "}
            <a href="mailto:digital@indoles.com.tr" style={{ color: "#2C5566" }}>
              digital@indoles.com.tr
            </a>{" "}
            adresine yazabilirsin.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "0.9375rem",
                color: "#FAFAF7",
                backgroundColor: "#2C5566",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              Yeniden dene
            </button>
            {/* `global-error` kök layout'un yerine geçer; `next/link` router
                bağlamı olmadan çalışmaz. Tam sayfa yenileme burada doğru. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/tr"
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "0.9375rem",
                color: "#2C5566",
                border: "1px solid #2C5566",
                borderRadius: "2px",
                textDecoration: "none",
              }}
            >
              Ana sayfa
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
