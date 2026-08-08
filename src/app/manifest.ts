import { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Free Instant Games`,
    short_name: SITE_NAME,
    description: "Play free HTML5 browser games instantly — no downloads, no installs. High-speed action, puzzle, racing & arcade games.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#09090b",
    theme_color: "#c3f400",
    categories: ["games", "entertainment", "arcade"],
    icons: [
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Action Games",
        url: "/category/action",
        description: "Play high-energy action games",
      },
      {
        name: "Racing Games",
        url: "/category/racing",
        description: "Fast-paced car and racing games",
      },
      {
        name: "Favorites",
        url: "/favorites",
        description: "Access your saved favorite games",
      },
    ],
  };
}
