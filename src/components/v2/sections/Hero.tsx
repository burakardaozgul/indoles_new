"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DashedCircles } from "@/components/v2/hero/DashedCircles";
import { HeroTitleLayer } from "@/components/v2/hero/HeroTitleLayer";
import { TITLE_ROWS, HERO_COPY, scatterFor } from "@/components/v2/hero/title-content";
import { HERO } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";

/**
 * Hero — iki katmanlı metin sistemi, dashed çemberler, harf saçılması.
 *
 * Katmanlar (spec §2):
 *   z-0  DashedCircles + renkli başlık kopyası     ← canvas'ın ALTINDA
 *   z-10 WebGL canvas (layout'ta mount)
 *   z-20 siyah başlık kopyası + scroll etiketi     ← canvas'ın ÜSTÜNDE
 *
 * Nav ve siyah bilgi şeridi artık hero'ya değil layout'a aittir (V2Chrome):
 * tüm sayfalarda aynı chrome görünüyor.
 */
export function Hero({ locale }: { locale: "tr" | "en" }) {
  const rootRef = React.useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const rows = TITLE_ROWS[locale];
  const copy = HERO_COPY[locale];

  // Satır başlarındaki kümülatif harf indeksi — iki katman aynı seed'i kullanır
  const indexOffsets = React.useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const r of rows) {
      out.push(acc);
      acc += r.text.length;
    }
    return out;
  }, [rows]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < HERO.scatter.disableBelow;

      // --- Giriş animasyonu (spec §4.4)
      if (!reduced) {
        // fromTo — StrictMode'da `from` gizli hâli kalıcı kılıyor (bkz. diğer bölümler)
        // Nav artık layout'ta (V2Nav); giriş animasyonu da orada.
        gsap.fromTo(
          root.querySelectorAll<HTMLElement>(".v2-title-row"),
          { ...HERO.titleFrom },
          {
            y: 0,
            opacity: 1,
            duration: HERO.titleDuration,
            stagger: HERO.titleStagger,
            ease: HERO.titleEase,
          },
        );
      }

      // --- Harf saçılması (spec §4.3)
      // İki katmandaki harfler aynı `data-i` seed'ini paylaşır, bu yüzden
      // fonksiyon-değerli tween ikisine de birebir aynı transform'u verir.
      const letters = root.querySelectorAll<HTMLElement>(".v2-letter");
      if (letters.length === 0) return;

      const trigger = {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: reduced ? false : (1 as const),
      };

      if (reduced || isMobile) {
        /**
         * Mobil ve reduced-motion: yalnız fade (spec §10). Hedef harfler değil
         * iki kopya kapsayıcısı (2026-08-28): fade zaten bütün harflere aynı
         * opaklığı veriyordu, ama harf başına tween scrub sırasında yüzlerce
         * elemana stil yazıp mobil scroll'u tıkıyordu. İki elemana yazmak
         * görsel olarak birebir aynı.
         */
        /**
         * Hedef `.v2-title-copy` DEĞİL, z-index'i zaten taşıyan iç katmanlar
         * (`[data-title-layer]` → .v2-layer-under/over). opacity < 1 hedefine
         * yeni bir stacking context açar; kapsayıcıda açılınca içindeki z-20
         * o bağlama hapsoluyor ve kopya z-10'daki sabit canvas'ın ALTINA
         * düşüyordu — mobilde ilk dokunuşta scrub başlar başlamaz "blob
         * yazıların önüne atladı" (2026-08-28, canlıda görüldü). İç katman
         * kendi z-20/z-0'ını taşıdığı için orada açılan bağlam sırayı korur.
         */
        gsap.to(root.querySelectorAll<HTMLElement>("[data-title-layer]"), {
          opacity: 0,
          ease: "none",
          scrollTrigger: trigger,
        });
        return;
      }

      gsap.to(letters, {
        x: (_i, t: Element) =>
          scatterFor(Number((t as HTMLElement).dataset.i ?? 0), HERO.scatter).x,
        y: (_i, t: Element) =>
          scatterFor(Number((t as HTMLElement).dataset.i ?? 0), HERO.scatter).y,
        rotate: (_i, t: Element) =>
          scatterFor(Number((t as HTMLElement).dataset.i ?? 0), HERO.scatter).rotate,
        opacity: 0,
        ease: "none",
        scrollTrigger: trigger,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, locale]);

  return (
    <section id="v2-hero" className="v2-hero" ref={rootRef}>
      <DashedCircles />

      {/* Başlık — iki kopya, piksel piksel aynı konumda */}
      <div className="v2-title-stack">
        {/* z-0 — blob'un arkasında, tüm harfler siyah */}
        <div className="v2-title-copy" data-copy="ink">
          <HeroTitleLayer rows={rows} variant="ink" indexOffsets={indexOffsets} />
        </div>
        {/* z-20 — blob'un önünde, yalnız vurgu harfleri */}
        <div className="v2-title-copy" data-copy="accent">
          <HeroTitleLayer rows={rows} variant="accent" indexOffsets={indexOffsets} />
        </div>
      </div>

      {/* z-20 — scroll etiketi */}
      <div className="v2-layer-over mt-16 flex justify-end px-5 sm:px-8 lg:px-[72px]">
        <span className="v2-scroll-hint">
          {copy.scroll}
          <span aria-hidden="true">↓</span>
        </span>
      </div>
    </section>
  );
}
