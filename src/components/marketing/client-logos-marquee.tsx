import Image from "next/image";

/**
 * Müşteri logoları infinite marquee — A/B kartlarının hemen üstünde,
 * aynı container genişliğinde. Paper zemin, grayscale + opacity ile soft gri.
 *
 * Animasyon: globals.css `.marquee-track` + `@keyframes marquee-x`.
 * Seamless loop için listeyi iki kez render ederiz.
 *
 * Assetler: /public/musteri_logolari/*.png
 */

type ClientLogo = { file: string; alt: string };

const LOGOS: ClientLogo[] = [
  { file: "Evyap_logo.png", alt: "Evyap" },
  { file: "Turkcell.png", alt: "Turkcell" },
  { file: "TurkTelekım-Logo.png", alt: "Türk Telekom" },
  { file: "Komagene-logo.png", alt: "Komagene" },
  { file: "gloria.png", alt: "Gloria Jeans" },
  { file: "Lalorraine.png", alt: "La Lorraine" },
  { file: "Sim.png", alt: "Sim" },
  { file: "Kocabas.png", alt: "Kocabaş" },
  { file: "Taç.png", alt: "Taç" },
  { file: "MKC.png", alt: "MKC" },
  { file: "Fyr.png", alt: "Fyr" },
  { file: "Feruza.png", alt: "Feruza" },
  { file: "gymwolves-logo.png", alt: "Gym Wolves" },
  { file: "pavelsis-2048x1024.png", alt: "Pavelsis" },
  { file: "meccanotecnica.svg", alt: "Meccanotecnica" },
];

export function ClientLogosMarquee({ locale }: { locale: "tr" | "en" }) {
  return (
    <section
      aria-label={locale === "tr" ? "Müşteriler" : "Clients"}
      className="mx-auto max-w-[1120px] px-6 md:px-12 pt-14 md:pt-20 pb-2"
    >
      <div
        className="relative bg-paper border border-surface-2 rounded-2xl overflow-hidden marquee-pause-on-hover flex items-center"
        style={{ height: 128 }}
      >
        {/* Kenar fade maskeleri */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--color-paper), transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--color-paper), transparent)",
          }}
        />

        {/* Marquee track — dikeyde ortalı, yatayda sonsuz akış */}
        <ul
          className="marquee-track flex items-center gap-10 md:gap-12 w-max"
          aria-hidden
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <li
              key={`${logo.file}-${i}`}
              className="flex-none w-44 md:w-52 h-16 md:h-20 flex items-center justify-center"
            >
              <Image
                src={`/musteri_logolari/${logo.file}`}
                alt={logo.alt}
                width={260}
                height={96}
                className="max-h-full max-w-full object-contain"
                style={{
                  filter: "grayscale(1)",
                  opacity: 0.6,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
