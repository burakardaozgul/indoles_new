"use client";

import * as React from "react";
import Link from "next/link";
import { PILLARS } from "@/lib/content/pillars";
import { SERVICES, SERVICE_ORDER } from "@/lib/content/services";
import { ServiceIllustration } from "@/components/marketing/service-illustration";
import { PersonaText } from "@/components/marketing/persona-text";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { BREAKPOINT } from "@/lib/v2/anim-config";

/**
 * Hizmet portföyü — iki farklı gezinme mekanizması, tek kart dili.
 *
 * Geniş ekran: sticky bölüm içinde dikey scroll'a bağlı yatay track.
 * Dar ekran (≤900px): parmakla kaydırılan snap slider. Ortadaki kart net,
 * komşular hafif blurlu ve küçük. Dikey listeye düşmek bölümü 13 kart boyunca
 * uzatıyor ve "portföyü gezme" hissini tamamen kaybettiriyordu.
 *
 * Geometrik illüstrasyonlar `service-illustration.tsx`'ten geliyor — zaten
 * teal + gold paletinde çizildikleri için v2 diline uyuyorlar.
 */
export function ServicesScroll({ locale }: { locale: "tr" | "en" }) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLUListElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [slide, setSlide] = React.useState(0);
  const [isNarrow, setIsNarrow] = React.useState(false);

  const isTr = locale === "tr";

  /**
   * Kartlar `SERVICE_ORDER` sırasında dizilir ve artık pillar sayfasına
   * değil hizmet sayfasına gider. Kart metni hizmet içeriğinden okunur —
   * `pillars.ts` ile ikinci bir kopya tutulmuyor.
   */
  const services = React.useMemo(
    () =>
      SERVICE_ORDER.map((slug) => SERVICES.find((s) => s.slug.tr === slug))
        .filter((s): s is (typeof SERVICES)[number] => s !== undefined)
        .map((s) => {
          const pillar = PILLARS.find((p) => p.key === s.pillar)!;
          return {
            slug: s.slug[locale],
            pillarName: pillar.name[locale],
            name: s.name[locale],
            desc: {
              industrial: s.shortDescription.industrial[locale],
              commerce: s.shortDescription.commerce[locale],
            },
          };
        }),
    [locale],
  );

  /** Toplam slayt = hizmetler + kapanış kartı. */
  const slideCount = services.length + 1;

  /**
   * Slider moduna dar ekranda VE hareket kısıtlıyken geçilir.
   *
   * Yatay track dekorasyon değil, portföyün tek gezinme aracı: scroll'a bağlı
   * transform kapatılırsa kartların çoğuna hiç ulaşılamıyor. Reduced-motion
   * altında doğru davranış animasyonu kaldırmak değil, mekanizmayı native
   * scroll'a çeviren slider'a düşmek.
   */
  const useSlider = isNarrow || reduced;

  React.useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= BREAKPOINT.reducedLayout);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // --- Geniş ekran: dikey scroll → yatay translate
  React.useEffect(() => {
    if (useSlider) return;
    const onScroll = () => {
      const sec = sectionRef.current;
      const track = trackRef.current;
      if (!sec || !track) return;
      const scrollable = sec.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, -sec.getBoundingClientRect().top);
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);
      const moveMax = track.scrollWidth - window.innerWidth + 48;
      track.style.transform = `translate3d(${-p * Math.max(0, moveMax)}px, 0, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [useSlider, services.length]);

  // --- Slider: snap; merkeze en yakın kart "current" olur
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track || !useSlider) return;
    track.style.transform = "";

    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setSlide(best);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [useSlider, services.length]);

  const shown = useSlider
    ? Math.min(slideCount, slide + 1)
    : Math.min(slideCount, Math.floor(progress * slideCount) + 1);

  const sectionStyle = useSlider
    ? undefined
    : // 38vh → 34vh: bölüm ~700px kısaldı, kart geçişleri hâlâ rahat okunuyor
      { height: `${100 + services.length * 34}vh` };

  return (
    <section
      id="v2-services"
      className={`v2-section v2-services${useSlider ? " is-slider" : ""}`}
      ref={sectionRef}
      style={sectionStyle}
      aria-labelledby="v2-services-title"
    >
      <div className="v2-services-sticky">
        <div className="v2-services-head">
          <div>
            <span className="v2-eyebrow">
              {isTr
                ? `Hizmet portföyü · ${services.length} uzmanlık`
                : `Service portfolio · ${services.length} areas of expertise`}
            </span>
            <h2 id="v2-services-title" className="v2-services-title">
              {/* Eski başlık "Bütüncül dönüşüm için uçtan uca uzmanlıklar."ydı:
                  iki soyut sıfat yan yana, fiil yok. Somut uçlarla değişti. */}
              {isTr ? "Teşhisten " : "From diagnosis to "}
              <span className="v2-accent">{isTr ? "canlıya" : "deployment"}</span>
              {isTr ? ", on iki uzmanlık." : ", twelve areas of expertise."}
            </h2>
          </div>

          <div className="v2-services-progress">
            <div className="v2-services-count mono">
              <span className="tabular">
                {String(shown).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
              </span>
              <span>
                {useSlider
                  ? isTr
                    ? "Parmakla kaydır →"
                    : "Swipe to browse →"
                  : isTr
                    ? "Kaydırarak gezin →"
                    : "Scroll to browse →"}
              </span>
            </div>
            <div className="v2-progress-bar">
              <div
                className="v2-progress-fill"
                style={{
                  width: `${(useSlider ? shown / slideCount : progress) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="v2-services-track-wrap">
          <ul className="v2-services-track" ref={trackRef}>
            {services.map((s, i) => (
              <li
                key={s.slug}
                className={`v2-svc${useSlider && slide === i ? " is-current" : ""}`}
              >
                <div className="v2-svc-top mono">
                  <span className="v2-svc-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v2-svc-pillar">{s.pillarName}</span>
                </div>

                <div className="v2-svc-illo">
                  <ServiceIllustration index={i} />
                </div>

                <h3 className="v2-svc-title">{s.name}</h3>
                <p className="v2-svc-desc">
                  <PersonaText {...s.desc} />
                </p>

                <Link
                  href={`/${locale}/${locale === "tr" ? "hizmetler" : "services"}/${s.slug}`}
                  className="v2-svc-link mono"
                  data-cursor="hover"
                >
                  {isTr ? "Keşfet" : "Explore"}
                  <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true">
                    <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  </svg>
                </Link>
              </li>
            ))}

            <li
              className={`v2-svc v2-svc-end${
                useSlider && slide === services.length ? " is-current" : ""
              }`}
            >
              <span className="v2-eyebrow v2-eyebrow-gold">
                {isTr ? "Aradığınızı bulamadınız mı?" : "Didn't find what you need?"}
              </span>
              <h3 className="v2-svc-end-title">
                {isTr
                  ? "Özel bir dönüşüm kurgusu inşa edelim."
                  : "Let's build a bespoke transformation."}
              </h3>
              <Link href={`/${locale}/iletisim`} className="v2-btn v2-btn-invert">
                {isTr ? "Görüşme planla" : "Book a call"}
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                  <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
