"use client";

import { usePersona } from "@/lib/hooks/use-persona";

export function PersonaText({
  industrial,
  commerce,
}: {
  industrial: string;
  commerce: string;
}) {
  const persona = usePersona();
  return <>{persona === "commerce" ? commerce : industrial}</>;
}

export function PersonaListItems({
  industrial,
  commerce,
  variant,
}: {
  industrial: string[];
  commerce: string[];
  variant: "scope" | "numbered" | "bullet";
}) {
  const persona = usePersona();
  const items = persona === "commerce" ? commerce : industrial;

  if (variant === "numbered") {
    return (
      <>
        {items.map((item, i) => (
          <li key={item} className="flex gap-4">
            <span className="typography-label text-ink-500 tracking-widest shrink-0">
              0{i + 1}
            </span>
            <span className="typography-body-md text-ink-700">{item}</span>
          </li>
        ))}
      </>
    );
  }

  if (variant === "scope") {
    return (
      <>
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-4 py-4 typography-body-md text-ink-700"
          >
            <span
              aria-hidden="true"
              className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"
            />
            <span>{item}</span>
          </li>
        ))}
      </>
    );
  }

  // bullet (whoFor)
  return (
    <>
      {items.map((item) => (
        <li
          key={item}
          className="typography-body-md text-ink-700 flex items-start gap-4"
        >
          <span
            aria-hidden="true"
            className="mt-2 w-1.5 h-1.5 rounded-full bg-ink-500 shrink-0"
          />
          <span>{item}</span>
        </li>
      ))}
    </>
  );
}
