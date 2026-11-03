import { describe, expect, it } from "vitest";
import { memoryMonth, validMemoryMedia, memoryAge } from "./memories";
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
