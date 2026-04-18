"use client";

import type React from "react";
import { usePopup } from "@/lib/popup/popup-context";

type Path = {
  commitment: string;
  label: string;
  description: React.ReactNode;
  meta: string;
  cta: React.ReactNode;
};

export function FinalCTABookingCard({ path }: { path: Path }) {
  const { openPopup } = usePopup();

  return (
    <button
      type="button"
      onClick={openPopup}
      className="group relative flex flex-col rounded-2xl p-10 md:p-12 min-h-[380px] border transition-colors bg-ink-900 text-paper border-ink-900 hover:bg-ink-700 text-left w-full"
    >
      <span className="typography-label uppercase tracking-widest text-brand-200">
        {path.commitment}
      </span>
      <div className="mt-10">
        <h3 className="typography-h1 text-paper">{path.label}</h3>
        <p className="typography-body-md mt-5 max-w-prose-editorial text-paper/75">
          {path.description}
        </p>
      </div>
      <div className="mt-auto pt-10 space-y-5">
        <div className="typography-caption text-brand-200">{path.meta}</div>
        <div className="inline-flex items-center gap-3 typography-body-md">
          <span className="inline-flex items-center h-10 px-5 rounded-md bg-paper text-ink-900 font-medium group-hover:bg-paper/90 transition-colors">
            {path.cta}
          </span>
        </div>
      </div>
    </button>
  );
}
