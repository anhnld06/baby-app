import { describe, expect, it } from "vitest";
import { journeyTasks, tasksForWeek, journeyTaskSchema, journeyTaskReminders } from "./journey-tasks";

describe("pregnancy care journey", () => {
  it("covers the whole journey including weeks beyond the due date", () => {
    for (let week = 1; week <= 41; week++) expect(tasksForWeek(week).length).toBeGreaterThan(0);
    expect(tasksForWeek(24).some((task) => task.key === "glucose")).toBe(true);
    expect(tasksForWeek(28).some((task) => task.key === "glucose")).toBe(true);
    expect(tasksForWeek(29).some((task) => task.key === "glucose")).toBe(false);
    expect(tasksForWeek(41).some((task) => task.key === "labour")).toBe(true);
    expect(new Set(journeyTasks.map((task) => task.key)).size).toBe(journeyTasks.length);
  });
  it("rejects invalid dates, forged task keys and long notes", () => {
    const row = { pregnancyId: "p", taskKey: "glucose", done: false, note: "", remindOn: "" };
    expect(journeyTaskSchema.safeParse(row).success).toBe(true);
    for (const change of [{ remindOn: "2026-02-30" }, { taskKey: "unknown" }, { note: "x".repeat(3001) }]) expect(journeyTaskSchema.safeParse({ ...row, ...change }).success).toBe(false);
  });
  it("reminds only explicit unfinished tasks and keeps private notes out of notifications", () => {
    const row = { pregnancyId: "p", taskKey: "glucose", done: false, remindOn: new Date("2026-11-08"), note: "private" };
    const result = journeyTaskReminders([row]);
    expect(result).toHaveLength(1);
    expect(result[0].pushOffsets).toEqual([0]);
    expect(result[0].description).not.toContain("private");
    expect(journeyTaskReminders([{ ...row, done: true }, { ...row, remindOn: null }, { ...row, taskKey: "unknown" }])).toEqual([]);
  });
});
