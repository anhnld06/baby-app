import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Static CSP (no nonce): a nonce-based policy needs a proxy and forces every page to render
// dynamically (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
// 'unsafe-inline' is therefore required for Next's inline bootstrap scripts and the theme script
// in src/app/layout.tsx.
const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    // Local OCR (src/features/ocr/client.ts, tesseract.js 7 defaults): the blob: worker inherits
    // this policy and importScripts() the worker + tesseract-core from jsDelivr.
    "https://cdn.jsdelivr.net",
    // tesseract-core compiles WebAssembly; this does not allow JS eval.
    "'wasm-unsafe-eval'",
    // React dev tooling reconstructs server error stacks with eval (development only).
    isDev ? "'unsafe-eval'" : "",
  ].filter(Boolean).join(" "),
  "style-src 'self' 'unsafe-inline'",
  // blob: previews for memory photos/covers; data: for small inline images.
  "img-src 'self' data: blob:",
  // blob: previews for memory videos/Boomerang; lullabies and memory media are same-origin.
  "media-src 'self' blob:",
  [
    "connect-src 'self'",
    // Weather badge (src/components/weather-badge.tsx) calls Open-Meteo directly from the browser.
    "https://api.open-meteo.com",
    // tesseract.js downloads vie/eng traineddata from jsDelivr inside the OCR worker.
    "https://cdn.jsdelivr.net",
  ].join(" "),
  // tesseract.js spawns its worker from a blob: URL; /sw.js is same-origin.
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "manifest-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    useOffline: true,
    // Applies to every Server Action (including login). Vercel rejects bodies above 4.5 MB anyway;
    // the largest upload (memory media, src/lib/upload.ts MAX_UPLOAD_BYTES = 4,000,000 bytes)
    // fits with room for multipart overhead.
    serverActions: { bodySizeLimit: "4mb" },
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          // Two years, as recommended for HSTS preload eligibility (preload itself not requested).
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
