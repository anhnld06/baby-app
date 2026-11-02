import { describe, it, expect } from "vitest";
import { chartScale } from "./scale";
describe("chart axes", () => {
  it("handles missing values and real zeros without division by zero", () => {
    for (const values of [[], [null, null], [0, null, 0]]) {
      const scale = chartScale(values);
      expect(scale.upper).toBeGreaterThan(0);
      expect(scale.ticks[0]).toBe(0);
      expect(scale.ticks.at(-1)).toBe(scale.upper);
    }
  });
  it("keeps every measured value inside the scale", () => {
    for (const maximum of [0.1, 1, 7, 14.8, 127, 1999]) {
      const scale = chartScale([null, 0, maximum]);
      expect(scale.upper).toBeGreaterThanOrEqual(maximum);
      expect(scale.ticks.every(Number.isFinite)).toBe(true);
    }
  });
  it("uses integer ticks for counts and supports fractional hours", () => {
    for (const maximum of [1, 2, 7, 10, 31])
      expect(chartScale([maximum], true).ticks.every(Number.isInteger)).toBe(
        true,
      );
    expect(
      chartScale([1]).ticks.some((value) => !Number.isInteger(value)),
    ).toBe(true);
  });
});
