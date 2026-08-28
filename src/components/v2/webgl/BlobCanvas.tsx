"use client";

import * as React from "react";
import { Canvas, advance } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Blob } from "./Blob";
import {
  BLOB_INITIAL,
  createBlobState,
  maxScroll,
  resolvedKeyframes,
  segmentRanges,
  type BlobState,
} from "./choreography";
import { BLOB, BLOB_PAGE, SCROLL, BREAKPOINT } from "@/lib/v2/anim-config";
import { useMouse, usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { useDebouncedResize } from "@/lib/v2/use-lenis";

/**
 * Sayfa boyunca ASLA unmount edilmeyen tek WebGL katmanı.
 *
 * `position: fixed; inset: 0; z-10; pointer-events: none` — hero'nun renkli
 * metin katmanının (z-0) üstünde, tüm normal içeriğin (z-20) altında durur.
 * "Topun içinden renkli metin görünüyor" efekti bu sandviçten doğar;
 * refraction veya post-processing yoktur (spec §2).
 *
 * İki mod:
 *   `variant="home"` — 7 duraklı koreografi, blob anlatının kendisidir.
 *   `variant="page"` — sabit konum, düşük opaklık, scroll'a bağlı hafif kayma.
 *     İç sayfada okumanın arkasında durur; canvas aynı canvas olduğu için
 *     sayfalar arası geçişte süreklilik korunur.
 */
export function BlobCanvas({
  variant = "home",
}: {
  variant?: "home" | "page";
} = {}) {
  const stateRef = React.useRef<BlobState>(createBlobState());
  const mouse = useMouse();
  const reduced = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth < BREAKPOINT.mobile,
  );
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT.mobile);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Dev'de koreografi doğrulaması için: konsoldan `__blobState`
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { __blobState?: BlobState }).__blobState =
      stateRef.current;
  }, []);

  // Sekme görünmezken render döngüsünü durdur (spec §3.4)
  React.useEffect(() => {
    const onVis = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /**
   * Kare yöneticisi (2026-08-28 performans çalışması).
   *
   * Önceki hâl `frameloop="always"` idi: sekme görünür olduğu sürece HER rAF
   * karesinde render — ProMotion cihazlarda saniyede 120 çizim, iç sayfalarda
   * süs olarak duran düşük opaklıklı blob için bile. Telefonda ısınmanın ve
   * boştaki GPU yükünün ana kaynağı buydu (ölçüldü: boşta 108-120 draw/s).
   *
   * Yeni hâl `frameloop="never"` + kendi sürücümüz: etkileşim veya koreografi
   * tween'i sürerken 60 fps tavan (ProMotion'da da 60), 2.5 sn hareketsizlikten
   * sonra 30 fps'e iner. `advance` gerçek zaman damgası aldığı için ambient
   * gürültünün HIZI değişmez — yalnız örnekleme sıklığı düşer.
   */
  React.useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = 0;
    let lastActivity = performance.now();
    const bump = () => {
      lastActivity = performance.now();
    };
    const events = ["wheel", "touchmove", "pointermove", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    // Etkileşim bitse de scrub tween'i sürüyor olabilir; state değişimi de
    // aktiflik sayılır (intro animasyonu dahil).
    const prev = { x: NaN, y: NaN, scale: NaN, opacity: NaN, noiseAmp: NaN };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const s = stateRef.current;
      if (
        s.x !== prev.x || s.y !== prev.y || s.scale !== prev.scale ||
        s.opacity !== prev.opacity || s.noiseAmp !== prev.noiseAmp
      ) {
        prev.x = s.x; prev.y = s.y; prev.scale = s.scale;
        prev.opacity = s.opacity; prev.noiseAmp = s.noiseAmp;
        lastActivity = t;
      }
      const fps = t - lastActivity < BLOB.governor.activeWindowMs
        ? BLOB.governor.activeFps
        : BLOB.governor.idleFps;
      if (t - last < 1000 / fps - 1) return;
      last = t;
      advance(t);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [running]);

  // --- Koreografi (spec §2.1) — yalnız anasayfada
  React.useEffect(() => {
    if (variant !== "home") return;
    gsap.registerPlugin(ScrollTrigger);
    const s = stateRef.current;

    const ctx = gsap.context(() => {
      const kfs = resolvedKeyframes();
      if (kfs.length === 0) return;

      Object.assign(s, BLOB_INITIAL);

      let prev: Record<string, number> = { ...BLOB_INITIAL };

      kfs.forEach((kf, i) => {
        const to = {
          x: kf.x,
          y: kf.y,
          scale: kf.scale,
          noiseAmp: kf.noiseAmp,
          opacity: kf.opacity,
        };

        // fromTo + immediateRender:false — her segment bir öncekinin bıraktığı
        // yerden başlar. Bağımsız `to` tween'leri başlangıç değerini kendi
        // oluşturulma anında yakalayacağı için zıplama üretirdi.
        gsap.fromTo(s, prev, {
          ...to,
          ease: SCROLL.ease,
          immediateRender: false,
          scrollTrigger: {
            trigger: document.documentElement,
            // Fonksiyon start/end: her refresh'te yeniden hesaplanır, böylece
            // sayfa uzadığında (bölüm eklenmesi, görsel yüklenmesi) aralıklar
            // kendiliğinden güncellenir.
            start: () => segmentRanges()[i]?.start ?? 0,
            end: () => segmentRanges()[i]?.end ?? maxScroll(),
            scrub: reduced ? true : SCROLL.scrub,
            invalidateOnRefresh: true,
          },
        });

        prev = { ...to };
      });
    });

    ScrollTrigger.refresh();

    // Görseller ve fontlar yerleşince sayfa yüksekliği değişir; aralıklar
    // fonksiyon olduğu için tek bir refresh onları tazelemeye yetiyor.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, [reduced, variant]);

  // --- İç sayfa modu: sabit konum + scroll'a bağlı hafif dikey kayma
  React.useEffect(() => {
    if (variant !== "page") return;
    gsap.registerPlugin(ScrollTrigger);
    const s = stateRef.current;

    const ctx = gsap.context(() => {
      const m = isMobile ? BLOB_PAGE.mobile : null;
      const base = {
        x: m?.x ?? BLOB_PAGE.x,
        y: BLOB_PAGE.y,
        scale: m?.scale ?? BLOB_PAGE.scale,
        noiseAmp: BLOB_PAGE.noiseAmp,
        opacity: m?.opacity ?? BLOB_PAGE.opacity,
      };
      Object.assign(s, base);

      // Tek tween, sayfa boyunca scrub. `y` düşer: sayfa aşağı kayarken blob
      // yukarı doğru süzülüyormuş gibi durur, sabit bir leke gibi durmaz.
      gsap.fromTo(s, base, {
        y: base.y - BLOB_PAGE.scrollDrift,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: () => maxScroll(),
          scrub: reduced ? true : SCROLL.scrub,
          invalidateOnRefresh: true,
        },
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced, variant, isMobile]);

  useDebouncedResize(() => ScrollTrigger.refresh(), SCROLL.resizeDebounce);

  // --- Giriş animasyonu
  // Hedef değerler varyanttan gelmeli: iç sayfada anasayfanın ölçeğine ve tam
  // opaklığına animasyon yapılırsa sayfa tween'iyle çakışıp blob önce büyüyüp
  // sonra geri düşüyor.
  React.useEffect(() => {
    if (reduced) return;
    const s = stateRef.current;
    const m = isMobile ? BLOB_PAGE.mobile : null;
    const target =
      variant === "page"
        ? {
            scale: m?.scale ?? BLOB_PAGE.scale,
            opacity: m?.opacity ?? BLOB_PAGE.opacity,
          }
        : { scale: BLOB_INITIAL.scale, opacity: BLOB_INITIAL.opacity };

    const tween = gsap.fromTo(
      s,
      { scale: target.scale * BLOB.intro.fromScale, opacity: 0 },
      {
        ...target,
        duration: BLOB.intro.duration,
        ease: BLOB.intro.ease,
      },
    );
    return () => {
      tween.kill();
    };
  }, [reduced, variant, isMobile]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10"
      aria-hidden="true"
      data-blob-canvas
    >
      <Canvas
        gl={{
          // Mobil GPU'da MSAA pahalı; blob'un silüeti shader'da zaten yumuşak.
          antialias: !isMobile,
          alpha: true,
          // Çift GPU'lu makinelerde ayrık GPU'yu uyandırma — ısı/pil.
          powerPreference: "low-power",
        }}
        dpr={isMobile ? BLOB.dprMobile : BLOB.dpr}
        camera={{ fov: BLOB.camera.fov, position: [0, 0, BLOB.camera.z] }}
        // Render'ı yukarıdaki kare yöneticisi sürüyor; sekme gizliyken
        // yönetici zaten kurulmuyor.
        frameloop="never"
      >
        <Blob
          state={stateRef}
          mouse={mouse}
          reducedMotion={reduced}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
