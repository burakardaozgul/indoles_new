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

type BlobVariant = "home" | "page" | "tool-hero";

/**
 * Blob'un merkezî/belirgin hâlde durduğu sayfalar (docs/04 §12.10 istisnası).
 *
 * `usePathname` next-intl'in KANONİK yolunu döner (locale ön eki ve segment
 * çevirisi çözülmüş hâli), bu yüzden tek giriş TR ve EN adresinin ikisini de
 * kapsar. Araç ailesinin tamamı değil, yalnız giriş sayfası: sonuç sayfası
 * bir rapor, yani okuma sayfasıdır ve `page` kalır.
 */
const TOOL_HERO_ROUTES = new Set<string>([
  "/araclar/geo-gorunurluk-denetleyicisi",
]);

function resolveBlobVariant(pathname: string): BlobVariant {
  if (pathname === "/") return "home";
  if (TOOL_HERO_ROUTES.has(pathname)) return "tool-hero";
  return "page";
}

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
   * Anasayfada koreografi, araç hero'sunda merkezî/belirgin, diğer iç
   * sayfalarda sessiz eşlikçi. Verilmezse route'tan türetilir — layout hangi
   * sayfada olduğunu bilmediği için karar burada.
   */
  blobVariant?: BlobVariant;
}) {
  const pathname = usePathname();
  const variant = blobVariant ?? resolveBlobVariant(pathname);

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
