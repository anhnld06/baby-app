import { describe, expect, it } from "vitest";
import references from "./pregnancy-week-reference.json";

describe("sourced weekly reference data", () => {
  it("keeps a source and measurement basis for each supported week", () => {
    expect(references.map((row) => row.week)).toEqual(Array.from({ length: 38 }, (_, i) => i + 4));
    for (const row of references) {
      expect(new URL(row.source).hostname).toBe("www.nhs.uk");
      expect(row.source).toContain(`/week-${row.week}/`);
      expect(row.comparison.length).toBeGreaterThan(2);
      if (row.length != null) expect(row.length).toBeGreaterThan(0);
      expect(row.basis).toBe(row.week >= 20 ? "headToHeel" : "headToBottom");
    }
  });
  it("does not turn the change of measurement basis at week 20 into a growth trend", () => {
    expect(references.find((row) => row.week === 19)?.basis).toBe("headToBottom");
    expect(references.find((row) => row.week === 20)?.basis).toBe("headToHeel");
    expect(references.find((row) => row.week === 41)?.length).toBeNull();
  });
});
