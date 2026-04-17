import * as React from "react";

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            data-dot
            className={`h-1.5 w-1.5 rounded-full ${i < current ? "bg-neutral-900" : "bg-neutral-300"}`}
          />
        ))}
      </div>
      <span className="text-xs text-neutral-500">{current} / {total}</span>
    </div>
  );
}
