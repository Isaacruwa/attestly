import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1F3A3D",
        }}
      >
        <div style={{ width: 100, height: 100, border: "9px solid white", borderRadius: 16, position: "relative", display: "flex" }}>
          <div style={{ position: "absolute", left: 24, top: 24, width: 34, height: 0, borderTop: "9px solid white" }} />
          <div style={{ position: "absolute", left: 24, top: 24, width: 0, height: 44, borderLeft: "9px solid white" }} />
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
