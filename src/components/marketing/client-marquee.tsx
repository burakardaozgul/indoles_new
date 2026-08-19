import Image from "next/image";

/**
 * Referans logo bandı — sonsuz yatay kayış.
 *
 * Tüm kaynak dosyalar 1000×500; görünen boyut `h` ile ayarlanır çünkü her
 * logonun tuval içindeki iç boşluğu farklıdır. Logolar gri-siluet olarak
 * durur, hover'da kendi rengine döner.
 */
const LOGOS = [
  { file: "Turkcell.png", name: "Turkcell", h: 72 },
  { file: "TurkTelekım-Logo.png", name: "Türk Telekom", h: 85 },
  { file: "Evyap_logo.png", name: "Evyap", h: 100 },
  { file: "Lalorraine.png", name: "La Lorraine", h: 85 },
  { file: "Komagene-logo.png", name: "Komagene", h: 100 },
  { file: "gloria.png", name: "Gloria Perfume", h: 65 },
  { file: "Feruza.png", name: "Feruza", h: 108 },
  { file: "Fyr.png", name: "Fyr Luxury", h: 78 },
  { file: "pavelsis.png", name: "Pavelsis", h: 100 },
  { file: "Kocabas.png", name: "Kocabaş Mandıra", h: 78 },
  { file: "Taç.png", name: "Taç", h: 78 },
  { file: "gymwolves-logo.png", name: "Gymwolves", h: 60 },
  { file: "MKC.png", name: "MK Computer", h: 72 },
  { file: "Sim.png", name: "Sim Baskı", h: 100 },
  { file: "meccanotecnica.png", name: "Meccanotecnica", h: 65 },
] as const;

export function ClientMarquee({ locale }: { locale: "tr" | "en" }) {
  const isTr = locale === "tr";

  return (
    <section
      className="marquee-sec"
      aria-label={isTr ? "Referanslarımız" : "Clients"}
    >
      <div className="mx-auto mb-6 flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-5 sm:px-8 lg:px-[72px]">
        <span className="eyebrow">
          {isTr ? "Güvenilen iş ortağı" : "Trusted partner"}
        </span>
        <span className="mono text-[11px] tracking-[0.1em] text-ink-500">
          {isTr
            ? `${LOGOS.length}+ ulusal ve global marka · Türkiye, Avrupa, MENA`
            : `${LOGOS.length}+ national and global brands · Turkey, Europe, MENA`}
        </span>
      </div>

      <div className="marquee-mask marquee-pause-on-hover">
        <div className="marquee-track">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={`${logo.file}-${i}`}
              className="marq-item"
              title={logo.name}
              aria-hidden={i >= LOGOS.length ? true : undefined}
            >
              <Image
                src={`/musteri_logolari/${logo.file}`}
                alt={i >= LOGOS.length ? "" : logo.name}
                width={1000}
                height={500}
                loading="lazy"
                sizes="300px"
                style={{ height: logo.h, width: "auto" }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
