"use client";

import * as React from "react";
import { WaveCanvas } from "./wave-canvas";
import { PILLARS } from "@/lib/content/pillars";
import { SERVICE_ORDER } from "@/lib/content/services";
import { PACKAGES } from "@/lib/content/packages";
import { CLIENT_LOGO_COUNT } from "@/lib/content/clients";

function Counter({ to, start, duration = 1600 }: { to: number; start: boolean; duration?: number }) {
  const [v, setV] = React.useState(0);

  React.useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);

  return <span className="tabular">{v}</span>;
}

/**
 * Vizyon — tek dark bölüm.
 *
 * Sayaçlar uydurma değil: hepsi içerik katmanından türetilir (pillar sayısı,
 * hizmet sayısı, paket sayısı, referans logosu sayısı). İçerik büyüdükçe
 * rakamlar kendiliğinden güncellenir; elle bakım gerektirmez.
 */
export function VisionSection({ locale }: { locale: "tr" | "en" }) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const isTr = locale === "tr";

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const serviceCount = SERVICE_ORDER.length;

  /**
   * `c` — sayının ölçüm çerçevesi.
   *
   * Etiket sayının ne olduğunu söylüyordu, neyi saydığını söylemiyordu; bir
   * ziyaretçi "12 uzmanlık"ı 12 kişilik ekip diye okuyabiliyordu. Vaka
   * metriklerindeki `context` kalıbı (docs/04 §10) burada da geçerli: her
   * satır sayının hangi listeden geldiğini yazar ve gerekiyorsa ne OLMADIĞINI
   * söyler.
   */
  const stats = [
    {
      n: PILLARS.length,
      suffix: "",
      l: isTr ? "disiplin, tek omurga" : "disciplines, one spine",
      c: isTr
        ? "Growth, Transform, Build — her hizmet bu üçünden birine bağlı."
        : "Growth, Transform, Build — every service attaches to one of the three.",
    },
    {
      n: serviceCount,
      suffix: "",
      l: isTr ? "uzmanlık, teşhisten uygulamaya" : "areas of expertise, diagnosis to delivery",
      c: isTr
        ? "Her birinin kendi hizmet sayfası var; kapsam sayısı, kişi sayısı değil."
        : "Each has its own service page; a count of scope, not of headcount.",
    },
    {
      n: PACKAGES.length,
      suffix: "",
      l: isTr ? "ürünleşmiş paket" : "productised packages",
      c: isTr
        ? "Sabit kapsam, sabit süre (3-8 hafta) ve sabit fiyatla yayında."
        : "Published with fixed scope, fixed duration (3-8 weeks) and fixed price.",
    },
    {
      n: CLIENT_LOGO_COUNT,
      suffix: "+",
      l: isTr ? "ulusal ve global marka" : "national and global brands",
      c: isTr
        ? "Referans duvarında logosu yayında olanlar; toplam müşteri sayısı değil."
        : "Those whose logo runs on the client wall; not the total client count.",
    },
  ];

  return (
    <section className="vision-sec" ref={ref} aria-labelledby="vision-title" style={{ colorScheme: "dark" }}>
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <WaveCanvas intensity={0.6} tone="dark" layers={4} />
      </div>

      <div className="ds-container relative z-10 grid items-end gap-12 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <div>
          <span className="eyebrow eyebrow-gold">
            {isTr ? "Vizyon · 2028" : "Vision · 2028"}
          </span>
          <h2 id="vision-title" className="typography-display-xl mb-8 mt-7 text-white">
            {isTr ? "Türkiye'nin " : "Turkey's most trusted "}
            <br className="hidden md:block" />
            {isTr ? "en çok güvenilen " : "independent "}
            <br className="hidden md:block" />
            <span className="accent-em accent-em-gold">
              {isTr ? "dönüşüm mimarı" : "transformation architect"}
            </span>
            {isTr ? " olmak." : "."}
          </h2>
          <p className="max-w-[560px] text-[17px] leading-relaxed text-white/70">
            {isTr
              ? "Büyük danışmanlık firmalarının metodolojisini, dijital ajansların hızını ve mühendislik stüdyolarının teknik derinliğini tek bir yapıda sunmak — 2028'e kadar \"iş dönüştürme\" dendiğinde ilk akla gelen bağımsız stüdyo olmak."
              : "Bringing the methodology of large consultancies, the speed of digital agencies and the technical depth of engineering studios into one structure — and being the first name that comes to mind for business transformation by 2028."}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/12 pt-10">
          {stats.map((s) => (
            <div key={s.l} className="flex flex-col gap-2">
              <dd className="font-display text-step-6 font-medium leading-none tracking-[-0.03em] text-white">
                <Counter to={s.n} start={visible} />
                {s.suffix}
              </dd>
              {/* Etiket 0.55 opaklıkta 4.8:1'deydi — dalga tuvali zemini
                  aydınlattığında AA'nın altına düşebiliyordu; 0.75 ile 7.5:1.
                  Bağlam satırı 0.60 (5.4:1) ve mono, böylece hiyerarşi
                  opaklıktan değil punto ve tipografiden okunuyor. */}
              <dt className="text-xs tracking-[0.06em] text-white/75">
                {s.l}
                <span className="mono typography-caption mt-2 block leading-snug text-white/60">
                  {s.c}
                </span>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
