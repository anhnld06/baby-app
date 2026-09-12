import { describe, expect, it } from "vitest";
import { selectRelevantPregnancy } from "@/features/mother/pregnancy";

describe("selectRelevantPregnancy", () => {
  it("prefers an active pregnancy over a newer closed record", () => {
    const active = { id: "active", pregnancyStatus: "PREGNANT" as const, createdAt: new Date("2025-01-01") };
    const closed = { id: "closed", pregnancyStatus: "DELIVERED" as const, createdAt: new Date("2026-01-01") };
    expect(selectRelevantPregnancy([closed, active])?.id).toBe("active");
  });

  it("falls back to the newest record when none is active", () => {
    const old = { id: "old", pregnancyStatus: "ENDED" as const, createdAt: new Date("2025-01-01") };
    const recent = { id: "recent", pregnancyStatus: "DELIVERED" as const, createdAt: new Date("2026-01-01") };
    expect(selectRelevantPregnancy([old, recent])?.id).toBe("recent");
  });
});
