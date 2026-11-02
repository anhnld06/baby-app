import { describe, expect, it } from "vitest";
import { developmentContext, stageContent } from "./development";
import { MILESTONES, milestoneCollection } from "./milestones";
import { validDay, monthDate } from "./dates";
describe("development and memories", () => {
  it("calculates calendar age in the account timezone and makes correction explicit", () => {
    const birth = new Date("2026-01-01T00:00Z");
    const now = new Date("2026-01-29T18:00Z");
    const actual = developmentContext(birth, now, "Asia/Ho_Chi_Minh", 36);
    const corrected = developmentContext(
      birth,
      now,
      "Asia/Ho_Chi_Minh",
      36,
      true,
    );
    expect(actual.ageDays).toBe(29);
    expect(actual.correction).toBe(0);
    expect(corrected.days).toBe(1);
    expect(corrected.correction).toBe(28);
    expect(actual).not.toHaveProperty("inCrisis");
  });
  it("does not predict symptom duration from a reference week", () => {
    const result = developmentContext(
      new Date("2026-01-01"),
      new Date("2026-05-14"),
      "UTC",
    );
    expect(result.nearest.value).toBe(19);
    expect(result.next).toBe(26);
    expect(result).not.toHaveProperty("episodeEnd");
    expect(stageContent(120).months).toBe(4);
  });
  it("has 47 unique badges in three groups and awards only date anniversaries automatically", () => {
    expect(MILESTONES).toHaveLength(47);
    expect(new Set(MILESTONES.map((m) => m.key)).size).toBe(47);
    const rows = milestoneCollection(new Date("2026-01-31"), "2026-02-28", []);
    expect(rows.filter((m) => m.achieved).map((m) => m.key)).toEqual([
      "born",
      "month-1",
    ]);
    expect(rows.find((m) => m.key === "smile")?.achieved).toBe(false);
    const logged = milestoneCollection(new Date("2026-01-31"), "2026-02-28", [
      {
        id: "memory",
        milestoneKey: "smile",
        occurredAt: new Date("2026-02-20"),
      },
    ]);
    expect(logged.find((m) => m.key === "smile")?.achieved).toBe(true);
  });
  it("handles month ends and invalid URL dates", () => {
    expect(
      monthDate(new Date("2024-01-31"), 1).toISOString().slice(0, 10),
    ).toBe("2024-02-29");
    expect(validDay("2026-02-31", "2026-01-01")).toBe("2026-01-01");
    expect(validDay("bad", "2026-01-01")).toBe("2026-01-01");
  });
});
