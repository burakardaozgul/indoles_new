import { ImageResponse } from "next/og";
import { colors } from "@/lib/design/tokens";

/** iOS ana ekran ikonu. 180×180'de iki harf okunuyor, "IN" kullanılır. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: "-0.035em",
        }}
      >
        IN
        <div
          style={{
            position: "absolute",
            bottom: 28,
            width: 72,
            height: 6,
            background: colors.gold[500],
          }}
        />
      </div>
    ),
    size,
  );
}
