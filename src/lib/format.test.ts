import { describe, expect, it } from "vitest";
import { formatNumber, numberFormatter } from "@/lib/format";

describe("formatNumber", () => {
  it("formats with Vietnamese separators and two decimals by default", () => {
    expect(formatNumber(1234.567)).toBe(new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(1234.567));
    expect(formatNumber(1234.567)).toBe("1.234,57");
  });

  it("honours a custom maximum number of decimals", () => {
    expect(formatNumber(3.456, 1)).toBe("3,5");
    expect(formatNumber(3.456, 0)).toBe("3");
    expect(formatNumber(12, 1)).toBe("12");
  });

  it("reuses one formatter per precision", () => {
    expect(numberFormatter(1)).toBe(numberFormatter(1));
    expect(numberFormatter()).toBe(numberFormatter(2));
    expect(numberFormatter(1)).not.toBe(numberFormatter(2));
  });
});
