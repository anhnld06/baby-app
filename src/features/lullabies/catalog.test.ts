import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  LULLABIES,
  LULLABY_AGES,
  lullabyAgeForBaby,
  lullabiesForAge,
} from "./catalog";

describe("lullaby age suggestions", () => {
  it.each([
    ["2026-11-02", "0-6"],
    ["2026-05-03", "0-6"],
    ["2026-05-02", "6-12"],
    ["2025-11-02", "1-3"],
    ["2023-11-02", "3-plus"],
  ])("uses completed calendar months for a baby born %s", (birth, group) => {
    expect(
      lullabyAgeForBaby(
        new Date(`${birth}T00:00:00Z`),
        new Date("2026-11-02T08:00:00Z"),
      ),
    ).toBe(group);
  });
  it("uses the family's local date around midnight", () => {
    const birth = new Date("2026-05-02T00:00:00Z");
    const now = new Date("2026-11-01T18:00:00Z");
    expect(lullabyAgeForBaby(birth, now, "Asia/Ho_Chi_Minh")).toBe("6-12");
    expect(lullabyAgeForBaby(birth, now, "America/Los_Angeles")).toBe("0-6");
  });
  it("handles end-of-month birthdays and future birth dates", () => {
    expect(
      lullabyAgeForBaby(
        new Date("2025-08-31T00:00:00Z"),
        new Date("2026-02-28T12:00:00Z"),
      ),
    ).toBe("6-12");
    expect(
      lullabyAgeForBaby(
        new Date("2027-01-01T00:00:00Z"),
        new Date("2026-11-02T12:00:00Z"),
      ),
    ).toBe("0-6");
  });
  it("offers both Vietnamese and international tracks, with choices in every group", () => {
    for (const age of LULLABY_AGES) {
      const tracks = lullabiesForAge(age.id);
      expect(tracks.length).toBeGreaterThanOrEqual(3);
      expect(tracks.some((track) => track.language === "Tiếng Việt")).toBe(
        true,
      );
      expect(tracks.some((track) => track.language !== "Tiếng Việt")).toBe(
        true,
      );
    }
    expect(lullabiesForAge("all")).toHaveLength(LULLABIES.length);
  });
  it("ships every recording locally with source and attribution", () => {
    expect(new Set(LULLABIES.map((track) => track.id)).size).toBe(LULLABIES.length);
    for (const track of LULLABIES) {
      expect(track.audioSrc).toMatch(/^\/audio\/lullabies\/(0-6-thang|6-12-thang|1-3-tuoi|3-tuoi-tro-len)\/[\w-]+\.mp3$/);
      expect(existsSync(join(process.cwd(), "public", track.audioSrc))).toBe(true);
      expect(statSync(join(process.cwd(), "public", track.audioSrc)).size).toBeGreaterThan(10000);
      expect(track.sourceUrl).toMatch(/^https:\/\//);
      expect(track.publisher.length).toBeGreaterThan(2);
      expect(track.license).toMatch(/CC BY|Public domain/);
    }
  });
});
