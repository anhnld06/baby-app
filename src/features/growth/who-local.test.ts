import { describe, expect, it } from "vitest";
import { calculateWho, measurementAtZ, weightAgeRange, whoAgeSupported } from "./who-local";
import { interpretWho } from "./who-interpretation";
import golden from "./fixtures/anthro-golden.json";
import wei from "./data/wei.json";
import len from "./data/len.json";
import wfl from "./data/wfl.json";
import wfh from "./data/wfh.json";

describe("bundled WHO 2006 calculation", () => {
  it("matches 146 independent fixtures evaluated by the upstream WHO R routines", () => {
    const flags = ["WEIGHT_AGE_IMPLAUSIBLE", "HEIGHT_AGE_IMPLAUSIBLE", "WEIGHT_HEIGHT_IMPLAUSIBLE", "BMI_AGE_IMPLAUSIBLE", "HEAD_AGE_IMPLAUSIBLE", "MEASUREMENT_POSITION_IMPLAUSIBLE"];
    for (const fixture of golden) {
      const result = calculateWho({ ...fixture.input, measure: fixture.input.measure as "L" | "H" | null });
      expect([result.weightAgeZ, result.heightAgeZ, result.weightHeightZ, result.bmiAgeZ, result.headAgeZ], JSON.stringify(fixture.input)).toEqual(fixture.expected.slice(0, 5));
      for (let i = 0; i < flags.length; i++) expect(result.flags.includes(flags[i]), `${JSON.stringify(fixture.input)} ${flags[i]}`).toBe(fixture.expected[i + 5] === 1);
    }
  });
  // Golden values from the upstream WHO anthro tests and public example, not this implementation.
  it("matches WHO's published female weight-for-age example", () => {
    expect(calculateWho({ sex: "2", ageInDays: 304, weightKg: 10 }).weightAgeZ).toBe(1.33);
  });
  it("matches WHO's upstream 1522-day weight-for-age test", () => {
    expect(calculateWho({ sex: "2", ageInDays: 1522, weightKg: 17 }).weightAgeZ).toBe(0.24);
  });
  it("matches WHO's upstream adjusted height-for-age extreme test", () => {
    const result = calculateWho({ sex: "1", ageInDays: 987, lengthHeightCm: 72.86, measure: "L" });
    expect(result.heightAgeZ).toBe(-6.09);
    expect(result.flags).toContain("HEIGHT_AGE_IMPLAUSIBLE");
  });
  it("matches the known LMS fixture for a 44-day-old male", () => {
    expect(calculateWho({ sex: "1", ageInDays: 44, lengthHeightCm: 50 }).heightAgeZ).toBe(-3.29);
  });
  it("preserves table identity and matches medians and ±2 SD for both sexes across all valid days", () => {
    for (const sex of ["1", "2"] as const) {
      expect(wei[sex]).toHaveLength(1827);
      for (let day = 0; day <= 1826; day += 17) {
        expect(wei[sex][day][0]).toBe(day);
        const range = weightAgeRange(sex, day)!;
        for (const [value, z] of [[range.min, -2], [range.median, 0], [range.max, 2]]) {
          expect(calculateWho({ sex, ageInDays: day, weightKg: value }).weightAgeZ).toBe(z);
        }
      }
    }
  });
  it("handles the full length/height table endpoints and interpolation", () => {
    for (const sex of ["1", "2"] as const) {
      for (const [table, age] of [[wfl, 100], [wfh, 900]] as const) {
        for (const row of [table[sex][0], table[sex].at(-1)!]) {
          expect(calculateWho({ sex, ageInDays: age, weightKg: row[2], lengthHeightCm: row[0] }).weightHeightZ).toBe(0);
        }
        const a = table[sex][10]; const b = table[sex][11];
        expect(calculateWho({ sex, ageInDays: age, weightKg: (a[2] + b[2]) / 2, lengthHeightCm: (a[0] + b[0]) / 2 }).weightHeightZ).toBe(0);
      }
    }
  });
  it("applies the WHO linear tail extension beyond ±3 SD", () => {
    const row = wei["1"][100];
    const four = measurementAtZ(row, 3) + measurementAtZ(row, 3) - measurementAtZ(row, 2);
    const minusFour = measurementAtZ(row, -3) - (measurementAtZ(row, -2) - measurementAtZ(row, -3));
    expect(calculateWho({ sex: "1", ageInDays: 100, weightKg: four }).weightAgeZ).toBe(4);
    expect(calculateWho({ sex: "1", ageInDays: 100, weightKg: minusFour }).weightAgeZ).toBe(-4);
  });
  it("corrects standing/recumbent measures and flags standing under 9 months", () => {
    expect(calculateWho({ sex: "1", ageInDays: 730, lengthHeightCm: len["1"][730][2] - 0.7, measure: "H" }).heightAgeZ).toBe(0);
    expect(calculateWho({ sex: "1", ageInDays: 731, lengthHeightCm: len["1"][731][2] + 0.7, measure: "L" }).heightAgeZ).toBe(0);
    expect(calculateWho({ sex: "1", ageInDays: 100, lengthHeightCm: 60, measure: "H" }).flags).toContain("MEASUREMENT_POSITION_IMPLAUSIBLE");
  });
  it("rejects out-of-range ages, sex and invalid or missing measurements", () => {
    for (const day of [-1, 1827, 1856, 1.5]) expect(whoAgeSupported(day)).toBe(false);
    expect(whoAgeSupported(1826)).toBe(true);
    expect(calculateWho({ sex: "3", ageInDays: 0, weightKg: 3 }).weightAgeZ).toBeNull();
    expect(calculateWho({ sex: "1", ageInDays: 30, weightKg: -1, lengthHeightCm: NaN }).weightAgeZ).toBeNull();
    expect(calculateWho({ sex: "1", ageInDays: 30, weightKg: 5, lengthHeightCm: 44.9 }).weightHeightZ).toBeNull();
    expect(calculateWho({ sex: "1", ageInDays: 900, weightKg: 10, lengthHeightCm: 120.1 }).weightHeightZ).toBeNull();
    expect(calculateWho({ sex: "1", ageInDays: 30 }).weightAgeZ).toBeNull();
  });
});
describe("WHO interpretation", () => {
  it("does not label high weight-for-age as overweight", () => {
    expect(interpretWho(2.1, "weightAge", false).label).toContain("xem cùng chiều dài");
  });
  it("requires reviewing flagged measurements rather than interpreting their z-score", () => {
    expect(interpretWho(-7, "weightAge", true).label).toBe("Nên kiểm tra lại số đo");
    expect(interpretWho(null, "weightAge", false).label).toBe("Chưa đủ dữ liệu");
    expect(interpretWho(-2, "weightAge", false).tone).toBe("within");
    expect(interpretWho(-2.01, "weightAge", false).tone).toBe("review");
  });
});
