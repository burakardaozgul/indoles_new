import { ImageResponse } from "next/og";
import { colors } from "@/lib/design/tokens";

/**
 * Favicon programatik üretilir: repoda binary asset tutmadan marka teal'i ve
 * gold aksanı token'lardan okunur (ham hex yazılmaz, bkz. CLAUDE.md §8).
 * 32×32'de "IN" okunmaz kalıyor; tek harf "I" + gold taban çizgisi seçildi.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: colors.teal[700],
          color: colors.bgPure,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        I
        <div
          style={{
            position: "absolute",
            bottom: 4,
            width: 14,
            height: 2,
            background: colors.gold[500],
          }}
        />
      </div>
    ),
    size,
  );
}
