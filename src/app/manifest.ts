import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mầm — Nhật ký mẹ và bé",
    short_name: "Mầm",
    description: "Nhật ký riêng tư cho mẹ và bé",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf1f2",
    theme_color: "#e34d78",
    orientation: "portrait-primary",
    lang: "vi",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
