"use client";

import * as React from "react";
import Image from "next/image";

/**
 * YouTube gömme facade'ı (ADR-019).
 *
 * Sayfa açılışında iframe yüklenmez: kapak karesi lokal bir görseldir ve
 * gömme yalnız kullanıcı oynat düğmesine bastığında `youtube-nocookie`
 * üzerinden mount edilir. İki gerekçe:
 *
 * 1. KVKK — izlenmeyen bir video için üçüncü taraf çerezi düşmemeli.
 * 2. Performans — bir vaka sayfasında dört film var; dört iframe sayfayı
 *    açılışta megabaytlarca script'e bağlar.
 *
 * Düğme gerçek bir `<button>`'dır: klavyeyle ulaşılır, focus halkası
 * primitive'den gelir.
 */
export function YouTubeFacade({
  videoId,
  poster,
  title,
  width,
  height,
}: {
  videoId: string;
  poster: string;
  title: string;
  width: number;
  height: number;
}) {
  const [active, setActive] = React.useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-surface-2 bg-ink-900"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* Dekoratif: düğmenin erişilebilir adını aşağıdaki `sr-only`
              başlık veriyor. Poster'a alt yazmak aynı adı iki kez okuturdu. */}
          <Image
            src={poster}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 972px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-ink-900/20 transition-colors group-hover:bg-ink-900/10" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-1/95 shadow-lg transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" width="26" height="26" className="ml-1 text-ink-900">
              <path d="M6 4.5v15l14-7.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="sr-only">{title}</span>
        </button>
      )}
    </div>
  );
}
