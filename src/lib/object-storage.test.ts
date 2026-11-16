import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { objectStorageConfig, objectStorageConfigured, presignDownload, presignUpload } from "./object-storage";

const ENDPOINT = "https://br-flat-star-12345.storage.c-2.ap-southeast-1.aws.neon.tech";
const ENV = {
  OBJECT_STORAGE_ENDPOINT: `${ENDPOINT}/`,
  OBJECT_STORAGE_REGION: "ap-southeast-1",
  OBJECT_STORAGE_BUCKET: "baby-memories",
  OBJECT_STORAGE_ACCESS_KEY_ID: "nak_live_test",
  OBJECT_STORAGE_SECRET_ACCESS_KEY: "nsk_live_secret",
};

beforeEach(() => {
  for (const [name, value] of Object.entries(ENV)) vi.stubEnv(name, value);
});
afterEach(() => vi.unstubAllEnvs());

describe("object storage configuration", () => {
  it("needs the endpoint, region, bucket and both keys", () => {
    expect(objectStorageConfig()).toEqual({ endpoint: ENDPOINT, region: "ap-southeast-1", bucket: "baby-memories", accessKeyId: "nak_live_test", secretAccessKey: "nsk_live_secret" });
    for (const name of Object.keys(ENV)) {
      vi.stubEnv(name, "");
      expect(objectStorageConfigured()).toBe(false);
      vi.stubEnv(name, ENV[name as keyof typeof ENV]);
    }
    expect(objectStorageConfigured()).toBe(true);
  });
});

describe("presigned links", () => {
  it("signs uploads for exactly one path-style key, type and size, valid for 10 minutes", async () => {
    const { url, headers } = await presignUpload("memories/baby-1/abc_DEF-123.mp4", "video/mp4", 30_000_000);
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe(`${ENDPOINT}/baby-memories/memories/baby-1/abc_DEF-123.mp4`);
    expect(parsed.searchParams.get("X-Amz-Expires")).toBe("600");
    expect(parsed.searchParams.get("X-Amz-SignedHeaders")).toBe("content-length;content-type;host");
    expect(parsed.searchParams.get("X-Amz-Credential")).toMatch(/^nak_live_test\/\d{8}\/ap-southeast-1\/s3\/aws4_request$/);
    expect(parsed.searchParams.get("X-Amz-Signature")).toMatch(/^[0-9a-f]{64}$/);
    expect(url).not.toContain("nsk_live_secret");
    expect(headers).toEqual({ "Content-Type": "video/mp4" });
    const other = new URL((await presignUpload("memories/baby-1/abc_DEF-123.mp4", "video/mp4", 30_000_001)).url);
    expect(other.searchParams.get("X-Amz-Signature")).not.toBe(parsed.searchParams.get("X-Amz-Signature"));
  });

  it("reuses the same download link within a 3-hour window so browsers can cache it", async () => {
    const a = await presignDownload("memories/baby-1/a.jpg", new Date("2026-11-16T03:10:00Z"));
    const b = await presignDownload("memories/baby-1/a.jpg", new Date("2026-11-16T05:59:00Z"));
    const c = await presignDownload("memories/baby-1/a.jpg", new Date("2026-11-16T06:00:00Z"));
    expect(a).toBe(b);
    expect(c).not.toBe(a);
    const parsed = new URL(a);
    expect(parsed.searchParams.get("X-Amz-Date")).toBe("20261116T030000Z");
    // 6 hours: well under Neon's 7-day maximum for presigned URLs.
    expect(parsed.searchParams.get("X-Amz-Expires")).toBe("21600");
    expect(parsed.searchParams.get("X-Amz-SignedHeaders")).toBe("host");
  });
});
