import { ImageResponse } from "next/og";
import { fetchGoogleFont } from "@/lib/ogFonts";

export const revalidate = 86400;

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  const serif = await fetchGoogleFont("Instrument+Serif", true, 400);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0A",
          position: "relative",
          borderRadius: 38,
          overflow: "hidden",
        }}
      >
        {/* Soft cream wash to give the monogram some atmosphere */}
        <div
          style={{
            position: "absolute",
            top: -40,
            left: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(250,250,247,0.06) 0%, rgba(250,250,247,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            fontFamily: serif ? "Instrument Serif" : "serif",
            fontStyle: "italic",
            fontSize: 156,
            color: "#FAFAF7",
            lineHeight: 1,
            marginTop: -10,
          }}
        >
          P
        </div>
        {/* Lime accent — bottom-right square, mirrors the lime-mark brand */}
        <div
          style={{
            position: "absolute",
            right: 22,
            bottom: 22,
            width: 24,
            height: 24,
            background: "#C5FF3D",
            borderRadius: 4,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: serif
        ? [
            {
              name: "Instrument Serif",
              data: serif,
              style: "italic",
              weight: 400,
            },
          ]
        : [],
    },
  );
}
