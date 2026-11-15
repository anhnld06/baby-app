// Shared, client-safe upload limits and file-signature checks.
// Keep this module free of Node-only imports: client components read the limits too.

/**
 * Largest single file accepted by any upload (decimal 4 MB = 4,000,000 bytes).
 * Server Actions accept bodies up to `serverActions.bodySizeLimit` ("4mb" = 4,194,304 bytes,
 * see next.config.ts) and Vercel rejects request bodies above 4.5 MB, so 4,000,000 bytes leaves
 * ~190 KB for multipart boundaries and the other form fields.
 */
export const MAX_UPLOAD_BYTES = 4_000_000;

/** Room allowed for multipart boundaries, part headers and small text fields. */
export const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

export const VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"] as const;
export type VideoMimeType = (typeof VIDEO_MIME_TYPES)[number];

export function isImageMimeType(mime: string): mime is ImageMimeType {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(mime);
}

function ascii(data: Uint8Array, start: number, end: number) {
  if (data.length < end) return "";
  return String.fromCharCode(...data.subarray(start, end));
}

function startsWith(data: Uint8Array, signature: readonly number[], offset = 0) {
  return data.length >= offset + signature.length
    && signature.every((byte, index) => data[offset + index] === byte);
}

/**
 * Verifies the file's magic bytes match its declared MIME type, so a renamed SVG/HTML file
 * cannot be stored or served as an image/video. Unknown types are rejected.
 */
export function hasExpectedSignature(data: Uint8Array, mime: string) {
  switch (mime) {
    case "image/jpeg":
      return startsWith(data, [0xff, 0xd8, 0xff]);
    case "image/png":
      return startsWith(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/webp":
      return ascii(data, 0, 4) === "RIFF" && ascii(data, 8, 12) === "WEBP";
    case "video/mp4":
    case "video/quicktime":
      return ascii(data, 4, 8) === "ftyp";
    case "video/webm":
      return startsWith(data, [0x1a, 0x45, 0xdf, 0xa3]);
    default:
      return false;
  }
}

/**
 * Returns true when the request declares a body larger than `maxBytes`, so the route can
 * answer 413 before buffering it. A missing/invalid header returns false (the caller must
 * still check the parsed file size).
 */
export function declaredBodyTooLarge(headers: Headers, maxBytes: number) {
  const value = headers.get("content-length");
  if (value === null || !/^\d+$/.test(value.trim())) return false;
  return Number(value) > maxBytes;
}
