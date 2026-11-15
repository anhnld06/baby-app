import { describe, expect, it } from "vitest";
import { memoryMonth, validMemoryMedia, memoryAge, MAX_MEMORY_MEDIA, MEMORY_MEDIA_TOO_LARGE, memoryMediaKind, memoryVideoType, sniffMemoryMediaType } from "./memories";
describe("memory envelopes and media", () => {
  it("groups by the family's local month across UTC boundaries", () => {
    expect(memoryMonth(new Date("2026-10-31T18:00:00Z"), "Asia/Ho_Chi_Minh")).toBe("2026-11");
    expect(memoryMonth(new Date("2026-11-01T02:00:00Z"), "America/Los_Angeles")).toBe("2026-10");
  });
  it("rejects a renamed executable or SVG and validates supported file signatures", () => {
    const text = new TextEncoder();
    expect(validMemoryMedia(text.encode("<svg></svg>"), "image/jpeg")).toBe(false);
    expect(validMemoryMedia(text.encode("<svg></svg>"), "image/svg+xml")).toBe(false);
    expect(validMemoryMedia(new Uint8Array([255,216,255,0]), "image/jpeg")).toBe(true);
    expect(validMemoryMedia(text.encode("\0\0\0\0ftypisom"), "video/mp4")).toBe(true);
    expect(validMemoryMedia(new Uint8Array([26,69,223,163,0]), "video/webm")).toBe(true);
    expect(validMemoryMedia(new Uint8Array([255,216,255,0]), "text/html")).toBe(false);
  });
  it("caps new media at 4 MB for both the composer and the server action", () => {
    expect(MAX_MEMORY_MEDIA).toBe(4_000_000);
    expect(MEMORY_MEDIA_TOO_LARGE).toContain("Tệp tối đa 4 MB");
  });
  it("recognises phone photos and videos even without a MIME type", () => {
    expect(memoryMediaKind({ type: "image/heic", name: "IMG_1.HEIC" })).toBe("image");
    expect(memoryMediaKind({ type: "", name: "IMG_1.heic" })).toBe("image");
    expect(memoryMediaKind({ type: "video/quicktime", name: "IMG_2.MOV" })).toBe("video");
    expect(memoryMediaKind({ type: "", name: "clip.mov" })).toBe("video");
    expect(memoryMediaKind({ type: "application/pdf", name: "a.pdf" })).toBeNull();
    expect(memoryMediaKind({ type: "", name: "notes" })).toBeNull();
    expect(memoryVideoType({ type: "", name: "clip.MOV" })).toBe("video/quicktime");
    expect(memoryVideoType({ type: "application/octet-stream", name: "clip.mp4" })).toBe("video/mp4");
    expect(memoryVideoType({ type: "video/webm;codecs=vp8", name: "boomerang.webm" })).toBe("video/webm");
  });
  it("sniffs the media type from file signatures", () => {
    const text = new TextEncoder();
    expect(sniffMemoryMediaType(new Uint8Array([255,216,255,224]))).toBe("image/jpeg");
    expect(sniffMemoryMediaType(new Uint8Array([137,80,78,71,13,10,26,10]))).toBe("image/png");
    expect(sniffMemoryMediaType(text.encode("RIFF\0\0\0\0WEBP"))).toBe("image/webp");
    expect(sniffMemoryMediaType(text.encode("\0\0\0\x14ftypqt  "))).toBe("video/quicktime");
    expect(sniffMemoryMediaType(text.encode("\0\0\0\x18ftypisom"))).toBe("video/mp4");
    expect(sniffMemoryMediaType(text.encode("<svg></svg>"))).toBeNull();
  });
});

describe("envelopes by baby age", () => {
  it("starts a new envelope on the monthly birth anniversary", () => {
    expect(memoryAge("2026-08-22", "2026-09-21").month).toBe(0);
    expect(memoryAge("2026-08-22", "2026-09-22")).toEqual({ month: 1, label: "1 tháng", range: "22/9/2026 – 21/10/2026" });
    expect(memoryAge("2026-08-22", "2026-10-15").label).toBe("1 tháng 23 ngày");
  });
  it("clamps anniversaries to the end of short months", () => {
    expect(memoryAge("2024-01-31", "2024-02-28").month).toBe(0);
    expect(memoryAge("2024-01-31", "2024-02-29").month).toBe(1);
    expect(memoryAge("2026-01-31", "2026-03-30").label).toBe("1 tháng 30 ngày");
    expect(memoryAge("2026-01-31", "2026-03-31").month).toBe(2);
  });
  it("keeps pregnancy memories separate and handles an empty date draft", () => {
    expect(memoryAge("2026-08-22", "2026-08-21").month).toBe(-1);
    expect(memoryAge("2026-08-22", "").label).toBe("Kỷ niệm của con");
  });
});
