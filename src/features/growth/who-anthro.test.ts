import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: {} }));

import { growthAgeInDays, whoSex } from "@/features/growth/who-anthro";

describe("WHO Anthro input", () => {
  it("uses exact chronological age in complete days", () => {
    expect(
      growthAgeInDays(
        new Date("2026-01-01T00:00:00Z"),
        new Date("2026-01-11T23:59:00Z"),
      ),
    ).toBe(10);
  });

  it("maps only WHO-supported sex references", () => {
    expect(whoSex("MALE")).toBe("1");
    expect(whoSex("FEMALE")).toBe("2");
    expect(whoSex("UNDISCLOSED")).toBeNull();
  });
});

describe("WHO Anthro age in the account timezone", () => {
  it("uses the measurement's local calendar day", () => {
    // 2026-01-12 06:59 in Vietnam.
    expect(
      growthAgeInDays(
        new Date("2026-01-01T00:00:00Z"),
        new Date("2026-01-11T23:59:00Z"),
        "Asia/Ho_Chi_Minh",
      ),
    ).toBe(11);
  });
});
