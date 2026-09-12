import { describe, expect, it } from "vitest";
import { nextHistoryLimit, parseHistoryLimit } from "@/lib/pagination";

describe("history pagination", () => {
  it("uses safe limits for missing or invalid input", () => {
    expect(parseHistoryLimit(undefined)).toBe(30);
    expect(parseHistoryLimit("nope")).toBe(30);
    expect(parseHistoryLimit("5")).toBe(30);
  });

  it("caps requests and increments predictably", () => {
    expect(parseHistoryLimit("500")).toBe(300);
    expect(nextHistoryLimit(30)).toBe(60);
    expect(nextHistoryLimit(290)).toBe(300);
  });
});

