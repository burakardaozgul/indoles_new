"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRUSTED } from "@/lib/v2/section-content";
import { GRID, BREAKPOINT } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";

/** Kaynak dosyalar 1000×500; görünen yükseklik hücre içinde sabit. */
const LOGOS = [
  // Burak'ın öne çıkardığı sekiz marka, onun verdiği sırayla: ilk satırlar
  // ızgarada en çok görülen yer.
  { file: "TurkTelekim-Logo.png", name: "Türk Telekom" },
  { file: "Turkcell.png", name: "Turkcell" },
  { file: "Evyap_logo.png", name: "Evyap" },
  { file: "Komagene-logo.png", name: "Komagene" },
  { file: "Lalorraine.png", name: "La Lorraine" },
  { file: "Odorgo.png", name: "OdorGo" },
  { file: "meccanotecnica.png", name: "Meccanotecnica" },
  { file: "gloria.png", name: "Gloria Perfume" },
  // Eski siteden geri alındı.
  { file: "Aslen.png", name: "Aslen" },
  { file: "MiniKebapciEtiler.png", name: "MiniKebapçı Etiler" },
  { file: "Feruza.png", name: "Feruza" },
  { file: "Fyr.png", name: "Fyr Luxury" },
  { file: "pavelsis.png", name: "Pavelsis" },
  { file: "Kocabas.png", name: "Kocabaş Mandıra" },
  { file: "gymwolves-logo.png", name: "Gymwolves" },
  { file: "MKC.png", name: "MK Computer" },
  { file: "Sim.png", name: "Sim Baskı" },
] as const;

/**
 * Grid çizgilerinin kesişimlerine oturan crosshair'ler.
 *
 * Hücre pseudo-element'i yerine ayrı bir overlay: kenar kesişimleri de
 * (son sütun ve son satır) işaretlenmeli, hücre bazlı çözüm onları atlıyor.
 */
function Crosshairs({ cols, rows }: { cols: number; rows: number }) {
  const marks: React.ReactElement[] = [];
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      marks.push(
        <span
          key={`${i}-${j}`}
          className="v2-crosshair"
          style={{ left: `${(i / cols) * 100}%`, top: `${(j / rows) * 100}%` }}
        />,
      );
    }
  }
  return (
    <div className="v2-crosshair-layer" aria-hidden="true">
      {marks}
    </div>
  );
}

/**
 * Referans logo grid'i.
 *
 * Hover'da üç şey aynı anda olur (0.3s):
 *   1. Hover'lanan logonun arkasında yumuşak köşeli zemin belirir, logo
 *      o zeminde beyaza döner
 *   2. Diğer tüm logolar 0.2 opaklığa düşer
 *   3. Soldaki pill etiket markanın adına döner — eski metin yukarı çıkar,
 *      yeni metin aşağıdan girer, pill genişliği içeriğe göre animate olur
 */
/** `.v2-pill-label` yatay padding'i — ölçümle senkron kalmalı. */
const PILL_PADDING_X = 16;

export function TrustedGrid({ locale }: { locale: "tr" | "en" }) {
  const copy = TRUSTED[locale];
  const rootRef = React.useRef<HTMLDivElement>(null);
  const sizerRef = React.useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const [hovered, setHovered] = React.useState<number | null>(null);
  const [cols, setCols] = React.useState(5);
  const [pillWidth, setPillWidth] = React.useState<number | undefined>(undefined);

  const label = hovered === null ? copy.defaultLabel : LOGOS[hovered]!.name;
  const rows = Math.ceil(LOGOS.length / cols);

  React.useEffect(() => {
    const check = () => setCols(window.innerWidth < BREAKPOINT.reducedLayout ? 2 : 5);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Pill genişliği: gizli bir ölçüm elemanından okunur, CSS transition
  // gerçek bir genişlik animasyonu yapabilsin diye piksel olarak yazılır.
  // Ölçüm yalnız metni verir; pill'in yatay padding'i (2 × 16px) eklenmeli,
  // yoksa etiket kırpılıyor.
  React.useLayoutEffect(() => {
    const el = sizerRef.current;
    if (el) setPillWidth(Math.ceil(el.getBoundingClientRect().width) + PILL_PADDING_X * 2);
  }, [label]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // gsap.from YERİNE fromTo: `from` bitiş değerini elemanın o anki
      // değerinden okur. React StrictMode efekti iki kez çalıştırdığı için
      // ikinci geçiş, birincinin bıraktığı gizli hâli "doğal hâl" sanıp
      // görünmez'den görünmez'e animasyon yapıyordu.
      gsap.fromTo(
        root.querySelectorAll<HTMLElement>(".v2-logo-cell"),
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: GRID.cellStagger,
          ease: "power2.out",
          // Animasyon bitince satır-içi stilleri temizle: GSAP'in bıraktığı
          // `opacity: 1`, hover'daki `.is-dimmed` kuralını eziyordu (satır-içi
          // stil sınıf kuralını yener).
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 80%" },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="v2-trusted" ref={rootRef}>
      <div className="v2-trusted-label">
        <span className="v2-eyebrow">{copy.eyebrow}</span>

        <span
          className="v2-pill-label"
          style={pillWidth ? { width: pillWidth } : undefined}
        >
          {/* Ölçüm elemanı — akış dışında, ekran okuyucudan gizli */}
          <span className="v2-pill-sizer" ref={sizerRef} aria-hidden="true">
            {label}
          </span>
          <span className="v2-pill-track">
            <span key={label} className="v2-pill-text">
              {label}
            </span>
          </span>
        </span>
      </div>

      <div
        className="v2-logo-grid"
        style={{ ["--cols" as string]: cols }}
        onMouseLeave={() => setHovered(null)}
      >
        <Crosshairs cols={cols} rows={rows} />

        {LOGOS.map((logo, i) => (
          <div
            key={logo.file}
            className={`v2-logo-cell${hovered === i ? " is-hovered" : ""}${
              hovered !== null && hovered !== i ? " is-dimmed" : ""
            }`}
            onMouseEnter={() => setHovered(i)}
            data-cursor="hover"
          >
            <span className="v2-logo-bg" aria-hidden="true" />
            <Image
              src={`/musteri_logolari/${logo.file}`}
              alt={logo.name}
              width={1000}
              height={500}
              sizes="220px"
              className="v2-logo-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
