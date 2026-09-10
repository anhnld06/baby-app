import { describe, expect, it } from "vitest";
import { ageInDays, formatAge, formatDuration } from "@/lib/date";

describe("date presentation", () => {
  it("formats minutes for Vietnamese", () => expect(formatDuration(135, "vi")).toBe("2g 15p"));
  it("returns newborn age in days", () => expect(formatAge(new Date("2026-08-28T00:00:00Z"), new Date("2026-09-08T00:00:00Z"), "vi")).toBe("11 ngày tuổi"));
  it("does not return a negative baby age", () => expect(ageInDays(new Date("2027-01-01"), new Date("2026-01-01"))).toBe(0));
});
