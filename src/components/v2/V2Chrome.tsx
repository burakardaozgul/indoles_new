"use client";

import dynamic from "next/dynamic";
import { usePathname } from "@/lib/i18n/navigation";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

/**
 * v2'nin client chrome'u: smooth scroll, kalıcı WebGL canvas ve custom cursor.
 *
 * `ssr: false` yalnız client component içinde kullanılabildiği için dynamic
 * import'lar layout'tan buraya taşındı (spec §10 SSR kuralı korunuyor).
 */
const BlobCanvas = dynamic(
  () => import("./webgl/BlobCanvas").then((m) => m.BlobCanvas),
  { ssr: false },
);
const CustomCursor = dynamic(
  () => import("./cursor/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

export function V2Chrome({
  children,
  chrome,
  footer,
  skipLabel,
  blobVariant,
}: {
  children: React.ReactNode;
  /** Sabit siyah şerit + nav. Layout'tan geçirilir ki sunucuda kalsınlar. */
  chrome?: React.ReactNode;
  /** Site footer'ı — aynı sebeple layout'tan geçer. */
  footer?: React.ReactNode;
  skipLabel: string;
  /**
   * Anasayfada koreografi, iç sayfada sessiz eşlikçi. Verilmezse route'tan
   * türetilir — layout hangi sayfada olduğunu bilmediği için karar burada.
   */
  blobVariant?: "home" | "page";
}) {
  const pathname = usePathname();
  const variant = blobVariant ?? (pathname === "/" ? "home" : "page");

  return (
    <SmoothScrollProvider>
      <a href="#v2-main" className="v2-skip-link">
        {skipLabel}
      </a>
      {chrome}
      <BlobCanvas variant={variant} />
      <CustomCursor />
      <main id="v2-main" className="relative">
        {children}
      </main>
      {footer}
    </SmoothScrollProvider>
  );
}
