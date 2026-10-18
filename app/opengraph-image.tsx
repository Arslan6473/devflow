import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DevFlow — Developer tools that flow · 100% client-side";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0a0a0f",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Gradient accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)",
          }}
        />
        {/* Icon badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 44,
              fontWeight: 700,
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            D
          </span>
        </div>
        {/* Wordmark */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "sans-serif",
            background: "linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          DevFlow
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontFamily: "sans-serif",
            color: "#a1a1aa",
            lineHeight: 1.4,
          }}
        >
          Developer tools that flow · 100% client-side
        </div>
      </div>
    ),
    { ...size }
  );
}
