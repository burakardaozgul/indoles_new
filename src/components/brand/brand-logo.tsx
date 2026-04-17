import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * INDOLES wordmark — kaynak PNG'ler 1280×420 (aspect ~3.05:1) kırpılmış.
 * `variant="light"` beyaz/paper zeminlerde (dark-inked logo),
 * `variant="dark"` siyah/ink-900 zeminlerde (beyaz logo) — isim tersine olabilir
 * bilinçli: "light" = light background için, "dark" = dark background için.
 *
 * Assetler: public/brand/indoles-logo-{dark,light}.png
 *   - indoles-logo-dark.png = lacivert (brand-700 civarı) — light bg için
 *   - indoles-logo-light.png = beyaz — dark bg için
 */

const ASPECT = 1280 / 420; // ≈ 3.05

export function BrandLogo({
  variant = "light-bg",
  height = 28,
  className,
  priority = false,
}: {
  /** light-bg: paper üstünde lacivert logo. dark-bg: ink-900 üstünde beyaz logo. */
  variant?: "light-bg" | "dark-bg";
  /** Piksel cinsinden yükseklik. Genişlik otomatik hesaplanır. */
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src =
    variant === "light-bg"
      ? "/brand/indoles-logo-dark.png"
      : "/brand/indoles-logo-light.png";
  const width = Math.round(height * ASPECT);

  return (
    <Image
      src={src}
      alt="INDOLES"
      width={1280}
      height={420}
      priority={priority}
      className={cn("block select-none", className)}
      style={{ height, width }}
    />
  );
}
