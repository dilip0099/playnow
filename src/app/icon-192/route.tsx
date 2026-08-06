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
          borderRadius: 40,
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
            borderRadius: 30,
            fontSize: 120,
            fontWeight: 900,
            color: "#131313",
            fontFamily: "sans-serif",
            boxShadow: "0 10px 30px rgba(195, 244, 0, 0.4)",
          }}
        >
          P
        </div>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
