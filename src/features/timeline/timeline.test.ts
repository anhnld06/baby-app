import { describe, expect, it } from "vitest";
import { todayTimeline, type TimelineItem } from "./timeline";
const row = (id: string, at: string, values: Partial<TimelineItem> = {}): TimelineItem => ({ id, kind: "feeding", at: new Date(at), title: id, detail: "", ...values });
describe("Today timeline", () => {
  const start = new Date("2026-11-03T17:00Z");
  const now = new Date("2026-11-03T19:00Z"); // Nov 4, 02:00 in Vietnam
  it("sorts all kinds by event time and excludes older days and future records", () => {
    const input = [row("old", "2026-11-02T20:00Z", { kind: "growth" }), row("later", "2026-11-03T18:45Z", { kind: "diaper" }), row("early", "2026-11-03T17:30Z"), row("future", "2026-11-03T21:00Z")];
    expect(todayTimeline(input, start, now, "Asia/Ho_Chi_Minh").map((item) => item.id)).toEqual(["later", "early"]);
    expect(input[0].id).toBe("old");
  });
  it("retains overnight sleep with its real start time rather than pinning it above newer records", () => {
    const input = [row("sleep", "2026-11-03T16:00Z", { kind: "sleep", active: true }), row("now", "2026-11-03T18:30Z"), row("finished", "2026-11-03T16:30Z", { kind: "sleep", endAt: new Date("2026-11-03T18:00Z") })];
    expect(todayTimeline(input, start, now, "Asia/Ho_Chi_Minh").map((item) => item.id)).toEqual(["now", "finished", "sleep"]);
  });
  it("keeps date-only entries on their calendar day without inventing a clock time", () => {
    const items = [row("tooth", "2026-11-04T00:00Z", { kind: "tooth", dateOnly: true }), row("now", "2026-11-03T18:30Z")];
    expect(todayTimeline(items, start, now, "Asia/Ho_Chi_Minh").map((item) => item.id)).toEqual(["now", "tooth"]);
    expect(todayTimeline(items, new Date("2026-11-03T00:00Z"), now, "UTC").map((item) => item.id)).toEqual(["now"]);
  });
});
