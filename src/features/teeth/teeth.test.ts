import { describe, expect, it } from "vitest";
import {
  LOWER_TOOTH_ORDER,
  TOOTH_ERUPTION_INFO,
  toothJaw,
  toothSide,
  UPPER_TOOTH_ORDER,
} from "./teeth";

describe("primary tooth eruption chart", () => {
  const positions = [...UPPER_TOOTH_ORDER, ...LOWER_TOOTH_ORDER];

  it("contains one entry and a unique FDI number for all 20 primary teeth", () => {
    expect(Object.keys(TOOTH_ERUPTION_INFO)).toHaveLength(20);
    expect(new Set(positions.map((position) => TOOTH_ERUPTION_INFO[position].fdiNumber)).size).toBe(20);
  });

  it("maps the visual chart order to the matching FDI quadrants", () => {
    expect(UPPER_TOOTH_ORDER.map((position) => TOOTH_ERUPTION_INFO[position].fdiNumber)).toEqual([
      "55", "54", "53", "52", "51", "61", "62", "63", "64", "65",
    ]);
    expect(LOWER_TOOTH_ORDER.map((position) => TOOTH_ERUPTION_INFO[position].fdiNumber)).toEqual([
      "85", "84", "83", "82", "81", "71", "72", "73", "74", "75",
    ]);
  });

  it("uses the ADA eruption ranges for the first and last tooth pairs", () => {
    expect(TOOTH_ERUPTION_INFO.LOWER_LEFT_CENTRAL_INCISOR).toMatchObject({
      eruptionOrder: 1,
      expectedMonths: [6, 10],
    });
    expect(TOOTH_ERUPTION_INFO.UPPER_RIGHT_SECOND_MOLAR).toMatchObject({
      eruptionOrder: 10,
      expectedMonths: [25, 33],
    });
  });

  it("derives the jaw and side from stored positions", () => {
    expect(toothJaw("UPPER_RIGHT_CANINE")).toBe("upper");
    expect(toothJaw("LOWER_LEFT_FIRST_MOLAR")).toBe("lower");
    expect(toothSide("UPPER_RIGHT_CANINE")).toBe("right");
    expect(toothSide("LOWER_LEFT_FIRST_MOLAR")).toBe("left");
  });
});
