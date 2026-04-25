import { ImageResponse } from "next/og";

export const alt = "Game On! — Live sports scores, schedules, and where to watch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static at build time — no runtime data needed
export const dynamic = "force-static";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,177,0,0.06) 1px, transparent 1.6px)",
          backgroundSize: "14px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Glow halo behind wordmark */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "10%",
            right: "10%",
            height: 320,
            background: "radial-gradient(ellipse, rgba(255,177,0,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Wordmark — solid amber bold text on the LED matrix surface */}
        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: "#ffe08a",
            letterSpacing: "-4px",
            fontFamily: "Impact, 'Arial Black', sans-serif",
            textShadow:
              "0 0 24px rgba(255, 177, 0, 0.6), 0 0 60px rgba(255, 177, 0, 0.35)",
            display: "flex",
            lineHeight: 1,
          }}
        >
          GAME ON!
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 48,
            fontSize: 30,
            color: "#cbc6b8",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
          }}
        >
          Live scores · Schedules · Where to watch
        </div>

        {/* Bottom band with leagues */}
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            color: "#ffb100",
            letterSpacing: "0.35em",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            display: "flex",
          }}
        >
          MLB · NFL · NBA · NHL · EPL · UCL · MLS
        </div>
      </div>
    ),
    { ...size },
  );
}
