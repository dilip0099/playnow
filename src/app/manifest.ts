import { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Free Online Games`,
    short_name: SITE_NAME,
    description: "Play 180+ free HTML5 browser games instantly — no downloads, no installs.",
    start_url: "/",
    display: "standalone",
    background_color: "#131313",
    theme_color: "#131313",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
