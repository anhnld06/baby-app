import { describe, expect, it } from "vitest";
import { formatPolicyNumber, insuranceStatus, insuranceStatusLabel } from "./insurance-status";

describe("formatPolicyNumber", () => {
  it("groups plain codes in fours and keeps other formats as typed", () => {
    expect(formatPolicyNumber("TE1797931234567")).toBe("TE17 9793 1234 567");
    expect(formatPolicyNumber(" 0123456789 ")).toBe("0123 4567 89");
    expect(formatPolicyNumber("BVAG-2026-000123")).toBe("BVAG-2026-000123");
    expect(formatPolicyNumber("X-778")).toBe("X-778");
  });
});

const day = (value: string) => new Date(`${value}T00:00:00Z`);

describe("insuranceStatus", () => {
  it("stays valid through the whole expiry day", () => {
    const status = insuranceStatus(null, day("2026-11-15"), "2026-11-15");
    expect(status).toEqual({ kind: "expiring", daysLeft: 0 });
    expect(insuranceStatusLabel(status)).toBe("Hết hạn hôm nay");
  });

  it("expires the day after validUntil", () => {
    expect(insuranceStatus(null, day("2026-11-14"), "2026-11-15")).toEqual({ kind: "expired" });
  });

  it("warns within 30 days and is active beyond that", () => {
    expect(insuranceStatus(null, day("2026-12-15"), "2026-11-15")).toEqual({ kind: "expiring", daysLeft: 30 });
    expect(insuranceStatus(null, day("2026-12-16"), "2026-11-15")).toEqual({ kind: "active", daysLeft: 31 });
  });

  it("handles cards without an end date or not yet started", () => {
    expect(insuranceStatus(null, null, "2026-11-15")).toEqual({ kind: "active", daysLeft: null });
    expect(insuranceStatus(day("2027-01-01"), day("2027-12-31"), "2026-11-15")).toEqual({ kind: "upcoming" });
  });
});
