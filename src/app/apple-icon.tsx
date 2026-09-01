import { ImageResponse } from "next/og";

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
          background: "#1F3A3D",
          borderRadius: 32,
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            border: "8px solid white",
            borderRadius: 14,
            position: "relative",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 22,
              width: 30,
              height: 0,
              borderTop: "8px solid white",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 22,
              width: 0,
              height: 40,
              borderLeft: "8px solid white",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
