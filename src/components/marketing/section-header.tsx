import { cn } from "@/lib/utils/cn";

/**
 * Editorial section header — eyebrow (numbered) + display headline + optional lede.
 * Sağ hizalı veya sol hizalı varyantları. Tek kaynak.
 */
export function SectionHeader({
  eyebrow,
  headline,
  lede,
  align = "left",
  className,
}: {
  eyebrow: string;
  headline: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      <span className="typography-label uppercase tracking-widest text-ink-500">
        {eyebrow}
      </span>
      <h2 className="typography-display-lg mt-4 max-w-[26ch] text-ink-900 whitespace-pre-line">
        {headline}
      </h2>
      {lede ? (
        <p
          className={cn(
            "typography-body-lg text-ink-700 mt-6 max-w-prose-editorial",
            align === "center" && "mx-auto"
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
