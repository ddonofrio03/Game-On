import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Favicon — single amber LED ball on near-black with a subtle highlight,
 *  echoing the LogoMark component used in the mobile top bar. Reads cleanly
 *  at 16-32px in browser tabs. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 32%, #fff6d0 0%, #ffd766 28%, #ffb100 60%, #4a2a00 100%)",
            boxShadow: "0 0 14px rgba(255, 177, 0, 0.7)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
