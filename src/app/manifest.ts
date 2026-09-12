import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vani Family — Nhật ký mẹ và bé",
    short_name: "Vani Family",
    description: "Nhật ký riêng tư cho mẹ và bé",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fdf1f2",
    theme_color: "#e34d78",
    orientation: "portrait-primary",
    lang: "vi",
    icons: [
      { src: "/icons/vani-family-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/vani-family-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/vani-family-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
