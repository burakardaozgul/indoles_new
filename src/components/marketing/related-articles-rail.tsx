"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

/** Kartın ihtiyacı olan alanlar — `ArticleContent`in tamamı değil. */
export type RailArticle = {
  href: string;
  title: string;
  excerpt: string;
  /** Mono altbilgi — okuma süresi ("6 dk okuma"). */
  meta: string;
};

type RailState = {
  overflow: boolean;
  atStart: boolean;
  atEnd: boolean;
  /** Görünür aralık, 0 tabanlı — sayaç için. */
  first: number;
  last: number;
};

const INITIAL: RailState = {
  overflow: false,
  atStart: true,
  atEnd: true,
  first: 0,
  last: 0,
};

const pad = (n: number) => String(n).padStart(2, "0");

/** JS'in açık `smooth` isteği CSS'in reduced-motion kuralını ezer; her
    kaydırmada ayrıca bakılır. */
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

/**
 * Hizmet detayının "İlgili yazılar" şeridi — konuya bağlı yazıların hepsi.
 *
 * Blok 2026-10-02'ye kadar en yeni üç yazıyla sınırlıydı; kümeler büyüyünce
 * eski karar yazıları bloktan düşüyordu (Burak: "İlgili yazılarda düşme
 * olmasın, gerekirse slider yapıya geçilsin"). Şerit sayıdan bağımsız:
 * her yazı DOM'da, yalnız görsel olarak kaydırılıyor.
 *
 * Mekanizma native: `overflow-x-auto` + `scroll-snap`. Kütüphane yok, JS
 * olmadan da parmakla / trackpad'le / kaydırma çubuğuyla gezilir. JS yalnız
 * üç şey yapar — düğmelerin görünürlüğü ve uç durumu, sayaç, düğmeyle adım.
 * Bu yüzden `"use client"`; kartlar ve bağlantıları yine sunucu HTML'inde
 * (SSG) basılır, iç bağlantı değeri korunur.
 *
 * Düğme sözleşmesi:
 * - Taşma yoksa (kartlar sığıyor, ya da JS hiç çalışmadı) düğmeler `hidden`
 *   — iki ucu da kapalı bir düğme çifti "ölü" görünürdü.
 * - Taşma varken uçtaki düğme `aria-disabled`, `disabled` değil: klavyeyle
 *   "sonraki"ye basa basa sona gelen kullanıcının odağı düğmeden düşmesin
 *   (`disabled` odağı `body`ye atar). Tıklama uçta yok sayılır.
 * - Adım, sığan tam kart sayısı kadardır — snap noktasıyla birebir örtüşür.
 * - `prefers-reduced-motion` altında adım anlık (`behavior: "auto"`); CSS
 *   tarafı zaten `scroll-behavior: auto` basıyor (globals.css), ama JS'in
 *   açık `smooth` isteği CSS'i ezdiği için burada da bakılır.
 * - Klavye: düğmeler tab sırasında kartlardan önce gelir; Tab ile kenardaki
 *   yarım karta gelinince şerit onu tam görünür alana alır (`onFocus`).
 *
 * Kart genişliği konteyner sorgusuyla (`@container`) ayarlanır, viewport'a
 * değil: şerit hangi sütuna konursa konsun bir sonraki kartın kenarı (peek)
 * görünür kalır ve kaydırılabilirlik kendini belli eder.
 *
 * Odak halkası (`.v2-root :focus-visible` — 2px + 3px offset) taşan
 * kapsayıcıda kırpılmasın diye iz `p-1.5` taşır; `-mx-1.5` ile kartların sol
 * kenarı başlıkla aynı hizada kalır, `scroll-px-1.5` snap noktasını bu
 * dolguya göre kaydırır.
 */
export function RelatedArticlesRail({
  heading,
  regionLabel,
  roleDescription,
  prevLabel,
  nextLabel,
  articles,
  className,
}: {
  /** Görünür blok başlığı (h3). */
  heading: string;
  /** Bölgenin erişilebilir adı — başlıktan daha açıklayıcı. */
  regionLabel: string;
  /** `aria-roledescription` — yerelleştirilmiş "carousel". */
  roleDescription: string;
  prevLabel: string;
  nextLabel: string;
  articles: RailArticle[];
  /** Yerleşim — çağıran ızgaradaki yeri verir (`md:col-span-2`). */
  className?: string;
}) {
  const uid = React.useId();
  const trackId = `${uid}-track`;
  const headingId = `${uid}-heading`;
  const trackRef = React.useRef<HTMLUListElement>(null);
  const [state, setState] = React.useState<RailState>(INITIAL);

  const measure = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    const right = left + el.clientWidth;

    /* Yarısından fazlası görünen kart "görünür" sayılır. `offsetLeft`
       `ul`ye göre ölçülür (`relative`). */
    let first = -1;
    let last = -1;
    Array.from(el.children).forEach((child, i) => {
      const li = child as HTMLElement;
      const center = li.offsetLeft + li.offsetWidth / 2;
      if (center >= left && center <= right) {
        if (first === -1) first = i;
        last = i;
      }
    });

    const next: RailState = {
      overflow: max > 1,
      atStart: left <= 1,
      atEnd: left >= max - 1,
      first: Math.max(first, 0),
      last: Math.max(last, first, 0),
    };
    setState((prev) =>
      prev.overflow === next.overflow &&
      prev.atStart === next.atStart &&
      prev.atEnd === next.atEnd &&
      prev.first === next.first &&
      prev.last === next.last
        ? prev
        : next,
    );
  }, []);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    measure();
    el.addEventListener("scroll", schedule, { passive: true });
    const ro =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    ro?.observe(el);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("scroll", schedule);
      ro?.disconnect();
    };
  }, [measure, articles.length]);

  const step = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    if ((dir < 0 && state.atStart) || (dir > 0 && state.atEnd)) return;

    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const stride = card.offsetWidth + gap;
    const perView = Math.max(1, Math.floor((el.clientWidth + gap) / stride));

    el.scrollBy({ left: dir * perView * stride, behavior: scrollBehavior() });
  };

  /**
   * Klavyeyle kenardaki (yarım görünen) karta gelindiğinde tarayıcı kartı
   * kendiliğinden tam görünür kılmıyor — Chromium'da odak halkası şeridin
   * kenarında bir şerit olarak kalıyordu. Odaklanan kart tam görünmüyorsa
   * şerit onu görünür alana alır; snap en yakın kart başına oturtur.
   */
  const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    const li = (e.target as HTMLElement).closest("li");
    if (!el || !li || li.parentElement !== el) return;
    const fullyVisible =
      li.offsetLeft >= el.scrollLeft &&
      li.offsetLeft + li.offsetWidth <= el.scrollLeft + el.clientWidth;
    if (fullyVisible) return;
    li.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: scrollBehavior(),
    });
  };

  const total = articles.length;
  const range =
    state.first === state.last
      ? pad(state.first + 1)
      : `${pad(state.first + 1)}–${pad(state.last + 1)}`;

  /* `.btn-ghost` dili: kenar + metin, hover'da teal-700. Uçta ink-300
     (docs/04 §3 — pasif/disabled için muaf kontrast basamağı). */
  const buttonClass =
    "inline-flex items-center justify-center size-11 rounded-full border transition-colors " +
    "border-surface-3 text-ink-900 hover:border-teal-700 hover:text-teal-700 " +
    "aria-disabled:cursor-not-allowed aria-disabled:border-surface-2 aria-disabled:text-ink-300 " +
    "aria-disabled:hover:border-surface-2 aria-disabled:hover:text-ink-300";

  return (
    <div
      role="region"
      aria-roledescription={roleDescription}
      aria-label={regionLabel}
      className={className ? `@container ${className}` : "@container"}
    >
      <div className="flex min-h-11 items-center justify-between gap-4">
        <h3
          id={headingId}
          className="typography-h3 text-ink-900 flex items-center gap-2.5"
        >
          <BookOpen
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className="text-brand-700 shrink-0"
          />
          {heading}
        </h3>

        <div
          hidden={!state.overflow}
          className="flex shrink-0 items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="typography-label tabular text-ink-500 hidden sm:inline"
          >
            {range} / {pad(total)}
          </span>
          <button
            type="button"
            aria-controls={trackId}
            aria-label={prevLabel}
            aria-disabled={state.atStart || undefined}
            onClick={() => step(-1)}
            className={buttonClass}
          >
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-controls={trackId}
            aria-label={nextLabel}
            aria-disabled={state.atEnd || undefined}
            onClick={() => step(1)}
            className={buttonClass}
          >
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <ul
        id={trackId}
        ref={trackRef}
        aria-labelledby={headingId}
        onFocus={onFocus}
        className="relative mt-6 -mx-1.5 flex gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-px-1.5 p-1.5 [scrollbar-width:thin] [scrollbar-color:var(--color-ink-200)_transparent]"
      >
        {articles.map((a) => (
          <li
            key={a.href}
            className="flex shrink-0 snap-start w-[85%] @xl:w-[46%] @4xl:w-[31%]"
          >
            <Link
              href={a.href}
              className="group flex w-full flex-col v2-surface border border-surface-2 rounded-2xl p-6 transition-colors hover:bg-surface-2/60"
            >
              <h4 className="font-display text-step-1 font-semibold leading-snug tracking-tight text-ink-900 line-clamp-3 group-hover:text-teal-800">
                {a.title}
              </h4>
              <p className="typography-body-sm text-ink-600 mt-3 line-clamp-3">
                {a.excerpt}
              </p>
              <span className="mt-auto pt-5 flex items-center justify-between gap-4 typography-label text-ink-500">
                <span>{a.meta}</span>
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.5}
                  className="text-teal-700 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
