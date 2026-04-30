import type { MetadataRoute } from "next"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Junes",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#00c27a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  }
}
