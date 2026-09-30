import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// New brand mark: rounded document/panel bracket, a circuit trace branching
// into three nodes (agent traces feeding in), and a compliance shield with
// checkmark overlapping the bottom-right corner.
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
        <svg width="132" height="132" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="18" width="50" height="54" rx="10" stroke="white" strokeWidth="7" />
          <path d="M26 30 L26 46 M26 30 L42 30" stroke="white" strokeWidth="7" strokeLinecap="round" />
          <path d="M66 28 L76 28 L88 16" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="89" cy="15" r="6.5" fill="white" />
          <path d="M66 46 L90 46" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <circle cx="90" cy="46" r="6.5" fill="white" />
          <path d="M66 64 L76 64 L88 76" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="89" cy="77" r="6.5" fill="white" />
          <path
            d="M65 58 L80 63 L80 74 C80 84 72 90 65 92 C58 90 50 84 50 74 L50 63 Z"
            fill="white"
          />
          <path d="M58 75 L63 80 L73 68" stroke="#1F3A3D" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
