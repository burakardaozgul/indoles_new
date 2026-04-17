import { cn } from "@/lib/utils/cn";

export function HomeHero({
  eyebrow,
  heading,
  subheading,
  className,
}: {
  eyebrow: string;
  heading: string;
  subheading: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1440px] px-6 md:px-12 pt-24 md:pt-36 pb-20",
        className
      )}
    >
      <p className="typography-label uppercase text-ink-500 tracking-widest">
        {eyebrow}
      </p>
      <h1 className="typography-display-2xl mt-6 max-w-[16ch] text-ink-900">
        {heading}
      </h1>
      <p className="typography-body-lg mt-8 max-w-prose-editorial text-ink-700">
        {subheading}
      </p>
    </section>
  );
}
