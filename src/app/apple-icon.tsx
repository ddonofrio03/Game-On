import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Apple touch icon — same LED ball mark as the favicon, sized for iOS home
 *  screen pinning. Follows iOS rounded-square treatment. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 32%, #fff6d0 0%, #ffd766 28%, #ffb100 60%, #4a2a00 100%)",
            boxShadow: "0 0 32px rgba(255, 177, 0, 0.7)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
