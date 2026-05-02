import { ImageResponse } from "next/og";
import { fetchGoogleFont } from "@/lib/ogFonts";

export const revalidate = 86400;

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: serif ? "Instrument Serif" : "serif",
            fontStyle: "italic",
            fontSize: 28,
            color: "#FAFAF7",
            lineHeight: 1,
            marginTop: -2,
          }}
        >
          P
        </div>
        <div
          style={{
            position: "absolute",
            right: 4,
            bottom: 4,
            width: 5,
            height: 5,
            background: "#C5FF3D",
            borderRadius: 1,
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
