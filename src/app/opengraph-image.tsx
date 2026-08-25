import { ImageResponse } from "next/og";
import { colors } from "@/lib/design/tokens";

/**
 * Varsayılan OG görseli — tüm rotalar bunu devralır.
 * `twitter:card` her sayfada `summary_large_image`; görsel olmadan kart
 * boş bir kutu olarak render ediliyordu. Sayfa bazlı dinamik OG bu turda
 * kapsam dışı, varsayılan marka kartı yeterli.
 */
export const alt = "INDOLES — İş geliştirme danışmanlığı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.teal[700],
          padding: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: colors.gold[300],
          }}
        >
          indoles.com.tr
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              color: colors.bgPure,
            }}
          >
            INDOLES
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 44,
              letterSpacing: "-0.02em",
              color: colors.teal[200],
            }}
          >
            İş geliştirme danışmanlığı
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 220,
            height: 8,
            background: colors.gold[500],
          }}
        />
      </div>
    ),
    size,
  );
}
