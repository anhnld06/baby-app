import { describe, expect, it } from "vitest";
import { ARCH_LAYOUT, ARCH_VIEWBOX, gumPath } from "./arch-layout";
import { LOWER_TOOTH_ORDER, monthsBetween, toothStatus, UPPER_TOOTH_ORDER } from "./teeth";

describe("mouth arch layout", () => {
  it("places all 20 teeth inside the drawing, upper above lower", () => {
    expect(ARCH_LAYOUT.map((tooth) => tooth.position)).toEqual([...UPPER_TOOTH_ORDER, ...LOWER_TOOTH_ORDER]);
    for (const tooth of ARCH_LAYOUT) {
      const reach = Math.max(tooth.width, tooth.depth) / 2;
      expect(tooth.x - reach).toBeGreaterThanOrEqual(0);
      expect(tooth.x + reach).toBeLessThanOrEqual(ARCH_VIEWBOX.width);
      expect(tooth.y - reach).toBeGreaterThanOrEqual(0);
      expect(tooth.y + reach).toBeLessThanOrEqual(ARCH_VIEWBOX.height);
    }
    const upper = ARCH_LAYOUT.filter((tooth) => tooth.jaw === "upper");
    const lower = ARCH_LAYOUT.filter((tooth) => tooth.jaw === "lower");
    expect(Math.max(...upper.map((tooth) => tooth.y))).toBeLessThan(Math.min(...lower.map((tooth) => tooth.y)));
  });

  it("runs from the baby's right on the viewer's left and mirrors both sides", () => {
    const upper = ARCH_LAYOUT.filter((tooth) => tooth.jaw === "upper");
    for (let index = 1; index < upper.length; index += 1) expect(upper[index].x).toBeGreaterThan(upper[index - 1].x);
    for (let index = 0; index < 5; index += 1) {
      const right = upper[index];
      const left = upper[upper.length - 1 - index];
      expect(right.x + left.x).toBeCloseTo(ARCH_VIEWBOX.width, 1);
      expect(right.y).toBeCloseTo(left.y, 1);
    }
  });

  it("keeps neighbouring teeth from overlapping along the arch", () => {
    for (const jaw of ["upper", "lower"] as const) {
      const teeth = ARCH_LAYOUT.filter((tooth) => tooth.jaw === jaw);
      for (let index = 1; index < teeth.length; index += 1) {
        const distance = Math.hypot(teeth[index].x - teeth[index - 1].x, teeth[index].y - teeth[index - 1].y);
        expect(distance).toBeGreaterThan((teeth[index].width + teeth[index - 1].width) / 2);
      }
    }
  });

  it("turns front teeth to face the tongue", () => {
    const upperFront = ARCH_LAYOUT.find((tooth) => tooth.position === "UPPER_RIGHT_CENTRAL_INCISOR")!;
    const lowerFront = ARCH_LAYOUT.find((tooth) => tooth.position === "LOWER_RIGHT_CENTRAL_INCISOR")!;
    expect(Math.abs(upperFront.angle)).toBeLessThan(20);
    expect(Math.abs(Math.abs(lowerFront.angle) - 180)).toBeLessThan(20);
    expect(gumPath("upper")).toMatch(/^M [\d.]+ [\d.]+ A /);
  });
});

describe("tooth status", () => {
  it("counts whole calendar months", () => {
    expect(monthsBetween("2025-01-31", "2025-02-28")).toBe(0);
    expect(monthsBetween("2025-01-15", "2025-07-15")).toBe(6);
    expect(monthsBetween("2025-01-15", "2026-01-14")).toBe(11);
    expect(monthsBetween("2025-05-01", "2025-04-01")).toBe(0);
  });

  it("marks a tooth due once the baby reaches its eruption window", () => {
    expect(toothStatus("LOWER_LEFT_CENTRAL_INCISOR", false, 5)).toBe("waiting");
    expect(toothStatus("LOWER_LEFT_CENTRAL_INCISOR", false, 6)).toBe("due");
    expect(toothStatus("LOWER_LEFT_CENTRAL_INCISOR", true, 2)).toBe("erupted");
  });
});
