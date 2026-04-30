import { ImageResponse } from "next/og"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0f0f0f",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "3px solid #00c27a",
            borderRadius: "32px",
            padding: "56px",
            background: "linear-gradient(135deg, rgba(0,194,122,0.15), rgba(15,15,15,0.95))",
          }}
        >
          <div style={{ display: "flex", fontSize: 86, fontWeight: 800, letterSpacing: 0 }}>
            J<span style={{ color: "#00c27a" }}>UNES</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#00c27a", fontSize: 34, letterSpacing: 8 }}>
              PROPIEDADES
            </div>
            <p style={{ maxWidth: 760, fontSize: 34, lineHeight: 1.25, marginTop: 30 }}>
              {SITE_DESCRIPTION}
            </p>
          </div>
          <div style={{ color: "#a0a0a0", fontSize: 26 }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    size
  )
}
