import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Attestly",
    short_name: "Attestly",
    description: "EU AI Act technical documentation generated from your AI agents' operational traces.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F7F5",
    theme_color: "#1F3A3D",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
