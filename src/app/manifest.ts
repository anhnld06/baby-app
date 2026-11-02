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
    background_color: "#f6f8fb",
    theme_color: "#087c9c",
    orientation: "portrait-primary",
    lang: "vi",
    icons: [
      { src: "/icons/vani-photo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/vani-photo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/vani-photo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
