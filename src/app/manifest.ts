import type { MetadataRoute } from "next";
import { colors } from "@/lib/design/tokens";

/**
 * `/manifest.webmanifest` önceden 404'tü. `theme_color` root `viewport`
 * ile aynı zemin rengini kullanır — ikisi ayrıştığında mobil tarayıcı
 * chrome'u sayfa zemininden farklı bir renge boyanır.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "INDOLES — İş geliştirme danışmanlığı",
    short_name: "INDOLES",
    description:
      "Sanayi şirketlerine teknoloji dönüşümü, ticaret markalarına agresif büyüme danışmanlığı.",
    start_url: "/tr",
    display: "standalone",
    background_color: colors.bg,
    theme_color: colors.bg,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
