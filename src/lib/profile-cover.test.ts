import { describe, expect, it } from "vitest";
import { parseProfileCoverUpdate, profileCoverUrl } from "@/lib/profile-cover";

describe("profile cover uploads", () => {
  it("keeps or removes the current image", () => {
    expect(parseProfileCoverUpdate(new FormData())).toBeUndefined();
    const remove = new FormData();
    remove.set("coverImageAction", "remove");
    expect(parseProfileCoverUpdate(remove)).toBeNull();
  });

  it("accepts a small JPEG data URL", () => {
    const formData = new FormData();
    formData.set("coverImageAction", "replace");
    formData.set("coverImageData", `data:image/jpeg;base64,${Buffer.from([0xff, 0xd8, 0xff, 0x00]).toString("base64")}`);
    const result = parseProfileCoverUpdate(formData);
    expect(result && result.data).toEqual(Buffer.from([0xff, 0xd8, 0xff, 0x00]));
    expect(result && result.mimeType).toBe("image/jpeg");
  });

  it("rejects content that does not match its declared type", () => {
    const formData = new FormData();
    formData.set("coverImageAction", "replace");
    formData.set("coverImageData", `data:image/png;base64,${Buffer.from("not a png").toString("base64")}`);
    expect(() => parseProfileCoverUpdate(formData)).toThrow("content is invalid");
  });

  it("versions private image URLs", () => {
    expect(profileCoverUrl("baby", "baby 1", new Date("2026-09-10T12:00:00Z")))
      .toBe("/api/profile-images/baby/baby%201?v=1789041600000");
  });
});
