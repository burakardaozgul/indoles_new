import { cn } from "@/lib/utils/cn";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * Inner page hero — editorial, daha sakin. Homepage'deki cinematic'e karşılık.
 * Breadcrumbs + eyebrow + Fraunces display headline + optional lede.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  tone = "paper",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  breadcrumbs?: Crumb[];
  tone?: "paper" | "surface";
}) {
  return (
    <section
      className={cn(
        "border-b border-surface-2",
        tone === "surface" ? "bg-surface-1" : "bg-paper"
      )}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pt-14 md:pt-20 pb-16 md:pb-24">
        {breadcrumbs ? (
          <div className="mb-10">
            <Breadcrumbs crumbs={breadcrumbs} />
          </div>
        ) : null}
        {eyebrow ? (
          <p className="typography-label uppercase tracking-widest text-ink-500">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="typography-display-xl mt-6 max-w-[22ch] text-ink-900">
          {title}
        </h1>
        {lede ? (
          <p className="typography-body-lg mt-8 max-w-prose-editorial text-ink-700">
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  );
}
