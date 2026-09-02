import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Attestly — EU AI Act evidence, generated from what your agents already do";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F6F7F5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #1F3A3D",
              borderRadius: 8,
              position: "relative",
              display: "flex",
            }}
          >
            <div style={{ position: "absolute", left: 8, top: 8, width: 16, height: 0, borderTop: "3px solid #1F3A3D" }} />
            <div style={{ position: "absolute", left: 8, top: 8, width: 0, height: 18, borderLeft: "3px solid #1F3A3D" }} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.05em", color: "#1F3A3D", textTransform: "uppercase" }}>
            Attestly
          </div>
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, color: "#14181C", lineHeight: 1.15, maxWidth: 980, display: "flex" }}>
          Stop manually reconstructing what your AI system did.
        </div>
        <div style={{ fontSize: 26, color: "#5B6470", marginTop: 32, maxWidth: 880, display: "flex" }}>
          EU AI Act technical documentation, generated from your agents&apos; own traces.
        </div>
      </div>
    ),
    { ...size }
  );
}
