import { describe, expect, it } from "vitest";
import { safeCsvCell } from "@/lib/csv";

describe("CSV cells", () => {
  it("quotes values and doubles embedded quotes", () => {
    expect(safeCsvCell('Bé "Vani", 3 tháng')).toBe('"Bé ""Vani"", 3 tháng"');
    expect(safeCsvCell(null)).toBe('""');
    expect(safeCsvCell(37.5)).toBe('"37.5"');
  });

  it("neutralises formula prefixes including leading tab and carriage return", () => {
    for (const value of ["=1+1", "+SUM(A1)", "-2+3", "@cmd", "\t=1+1", "\r=1+1"]) {
      expect(safeCsvCell(value)).toBe(`"'${value}"`);
    }
    expect(safeCsvCell("Sữa mẹ =60 ml")).toBe('"Sữa mẹ =60 ml"');
  });
});
