import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 typography-caption text-ink-500">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-ink-900">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "text-ink-700" : ""}>{c.label}</span>
              )}
              {!last && (
                <span aria-hidden className="text-ink-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
