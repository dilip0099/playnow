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
          background: "#131313",
          borderRadius: 90,
        }}
      >
        <div
          style={{
            width: "80%",
            height: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#c3f400",
            borderRadius: 70,
            fontSize: 320,
            fontWeight: 900,
            color: "#131313",
            fontFamily: "sans-serif",
            boxShadow: "0 20px 60px rgba(195, 244, 0, 0.5)",
          }}
        >
          P
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
