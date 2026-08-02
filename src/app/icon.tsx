import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Matches the exact brand mark already used in Sidebar/Navbar: a lime rounded
// square with a dark "P" — no separate logo asset existed before this.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c3f400",
          borderRadius: 14,
          fontSize: 40,
          fontWeight: 900,
          color: "#131313",
          fontFamily: "sans-serif",
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}
