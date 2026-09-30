import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Attestly — EU AI Act evidence, generated from what your agents already do";
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
          justifyContent: "center",
          padding: "80px",
          background: "#F6F7F5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="18" height="18" rx="3" stroke="#1F3A3D" strokeWidth="2.4" />
            <path d="M10 10 L10 18 M10 10 L17 10" stroke="#1F3A3D" strokeWidth="2.4" strokeLinecap="round" />
            <path
              d="M23 15 L28 17 L28 21 C28 24 25.5 25.8 23.5 26.3 C21.5 25.8 19 24 19 21 L19 17 Z"
              fill="#1F3A3D"
            />
            <path d="M21.3 21 L22.8 22.6 L26 19.2" stroke="#F6F7F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.05em", color: "#1F3A3D", textTransform: "uppercase" }}>
            Attestly
          </div>
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, color: "#14181C", lineHeight: 1.15, maxWidth: 980, display: "flex" }}>
          Stop manually reconstructing what your AI system did.
        </div>
        <div style={{ fontSize: 26, color: "#5B6470", marginTop: 32, maxWidth: 880, display: "flex" }}>
          EU AI Act technical documentation, generated from your agents' own traces.
        </div>
      </div>
    ),
    { ...size }
  );
}
