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
        <div style={{ width: 260, height: 260, border: "24px solid white", borderRadius: 42, position: "relative", display: "flex" }}>
          <div style={{ position: "absolute", left: 64, top: 64, width: 90, height: 0, borderTop: "24px solid white" }} />
          <div style={{ position: "absolute", left: 64, top: 64, width: 0, height: 115, borderLeft: "24px solid white" }} />
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
