import { describe, expect, it } from "vitest";
import {
  buildRoutine,
  resolveRoutine,
  type RoutineActual,
  type RoutineSettings,
} from "./routine";
const settings: RoutineSettings = {
  method: "CUSTOM",
  dayStart: "06:30",
  dayEnd: "19:00",
  feedingMinutes: 25,
  awakeMinutes: 35,
  sleepMinutes: 120,
  adaptToLogs: true,
};
const date = (clock: string) => new Date(`2026-11-02T${clock}:00+07:00`);
const feed = (start: string, end: string): RoutineActual => ({
  id: "feed-1",
  kind: "feed",
  start: date(start),
  end: date(end),
  active: false,
  detail: "feed",
  href: "/tracking/feeding",
});
describe("EASY routine", () => {
  it("chooses an age template but preserves a family's custom durations", () => {
    expect(resolveRoutine(null, 30).method).toBe("EASY3");
    expect(resolveRoutine(null, 100).method).toBe("EASY35");
    expect(resolveRoutine(null, 180).method).toBe("EASY4");
    expect(
      resolveRoutine({ ...settings, feedingMinutes: 17 }, 180).settings
        .feedingMinutes,
    ).toBe(17);
    expect(
      resolveRoutine({ ...settings, method: "EASY4" }, 30).settings
        .feedingMinutes,
    ).toBe(30);
  });
  it("shifts later slots after the real feeding and never reuses that feeding", () => {
    const rows = buildRoutine("2026-11-02", "Asia/Ho_Chi_Minh", settings, [
      feed("06:45", "07:15"),
    ]);
    expect(rows.find((r) => r.kind === "play")?.planned).toEqual(date("07:15"));
    expect(rows.find((r) => r.kind === "sleep")?.planned).toEqual(
      date("07:50"),
    );
    expect(rows.filter((r) => r.actual?.id === "feed-1")).toHaveLength(1);
  });
  it("adapts earlier and can keep the original schedule when adaptation is off", () => {
    const earlier = buildRoutine("2026-11-02", "Asia/Ho_Chi_Minh", settings, [
      feed("06:20", "06:40"),
    ]);
    expect(earlier.find((r) => r.kind === "play")?.planned).toEqual(
      date("06:40"),
    );
    const fixed = buildRoutine(
      "2026-11-02",
      "Asia/Ho_Chi_Minh",
      { ...settings, adaptToLogs: false },
      [feed("06:45", "07:15")],
    );
    expect(fixed.find((r) => r.kind === "play")?.planned).toEqual(
      date("06:55"),
    );
  });
  it("shows unmatched real records instead of discarding them", () => {
    const actual = feed("03:00", "03:20");
    const rows = buildRoutine("2026-11-02", "Asia/Ho_Chi_Minh", settings, [
      actual,
    ]);
    expect(rows.find((r) => r.id === "actual-feed-feed-1")?.actual).toEqual(
      actual,
    );
  });
  it("uses a running sleep start to project the next wake without inventing completion", () => {
    const actual: RoutineActual = {
      id: "sleep-1",
      kind: "sleep",
      start: date("07:40"),
      end: null,
      active: true,
      detail: "sleeping",
      href: "/tracking/sleep",
    };
    const rows = buildRoutine("2026-11-02", "Asia/Ho_Chi_Minh", settings, [
      actual,
    ]);
    const row = rows.find((r) => r.actual?.id === "sleep-1")!;
    expect(row.expectedEnd).toEqual(date("09:40"));
    expect(row.actual?.end).toBeNull();
    expect(rows.filter((r) => r.actual?.id === "sleep-1")).toHaveLength(1);
  });
});
