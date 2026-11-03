import { describe, expect, it } from "vitest";
import { assessCheckup } from "./checkup-assessment";

describe("prenatal assessment data coverage", () => {
  it("does not reassure when both measurements are missing or invalid", () => {
    expect(assessCheckup({}).level).toBe("UNKNOWN");
    expect(assessCheckup({ bloodPressure: "không đọc được" }).level).toBe("UNKNOWN");
  });
  it("retains alerts when a valid measurement is present", () => {
    expect(assessCheckup({ bloodPressure: "145/95" }).level).toBe("URGENT");
    expect(assessCheckup({ fetalHeartRate: 150 }).level).toBe("GOOD");
  });
});
