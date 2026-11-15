import { describe, expect, it } from "vitest";
import { declaredBodyTooLarge, hasExpectedSignature, isImageMimeType, MAX_UPLOAD_BYTES } from "@/lib/upload";

describe("shared upload checks", () => {
  it("keeps uploads below the 4 MB Server Action body limit with room for multipart overhead", () => {
    expect(MAX_UPLOAD_BYTES).toBe(4_000_000);
    expect(MAX_UPLOAD_BYTES).toBeLessThan(4 * 1024 * 1024);
  });

  it("matches magic bytes to the declared type", () => {
    expect(hasExpectedSignature(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), "image/jpeg")).toBe(true);
    expect(hasExpectedSignature(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png")).toBe(true);
    expect(hasExpectedSignature(new TextEncoder().encode("RIFF\0\0\0\0WEBPVP8 "), "image/webp")).toBe(true);
    expect(hasExpectedSignature(new TextEncoder().encode("\0\0\0\x18ftypqt  "), "video/quicktime")).toBe(true);
    expect(hasExpectedSignature(new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]), "video/webm")).toBe(true);
  });

  it("rejects renamed, truncated and unknown files", () => {
    expect(hasExpectedSignature(new TextEncoder().encode("<svg onload=alert(1)>"), "image/png")).toBe(false);
    expect(hasExpectedSignature(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png")).toBe(false);
    expect(hasExpectedSignature(new Uint8Array([0xff, 0xd8]), "image/jpeg")).toBe(false);
    expect(hasExpectedSignature(new TextEncoder().encode("RIFF"), "image/webp")).toBe(false);
    expect(hasExpectedSignature(new Uint8Array([0xff, 0xd8, 0xff]), "image/svg+xml")).toBe(false);
    expect(isImageMimeType("image/svg+xml")).toBe(false);
    expect(isImageMimeType("image/webp")).toBe(true);
  });

  it("detects oversized declared bodies without trusting malformed headers", () => {
    const headers = (value?: string) => new Headers(value === undefined ? {} : { "content-length": value });
    expect(declaredBodyTooLarge(headers("5000001"), 5_000_000)).toBe(true);
    expect(declaredBodyTooLarge(headers("5000000"), 5_000_000)).toBe(false);
    expect(declaredBodyTooLarge(headers(), 5_000_000)).toBe(false);
    expect(declaredBodyTooLarge(headers("abc"), 5_000_000)).toBe(false);
  });
});
