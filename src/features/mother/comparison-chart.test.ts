import { describe, expect, it } from "vitest";
import { comparisonGeometry, comparisonStats, type ComparisonPoint } from "./comparison-chart";
const point = (key: string, day: string, value: number | null): ComparisonPoint => ({ key, day, value, dateLabel: day, sourceLabel: "Phiếu khám", sourceHref: `/mother/pregnancy/checkups?edit=${key}` });
describe("statistical comparison charts", () => {
  it("compares recorded endpoints without filling a missing reading", () => {
    const rows = [point("a", "2026-01-01", 330), point("b", "2026-01-02", null), point("c", "2026-01-03", 1100)];
    expect(comparisonStats(rows)).toMatchObject({ count: 2, difference: 770 });
    const chart = comparisonGeometry([{ key: "weight", label: "Weight", color: "red", points: rows }]);
    expect(chart.series[0].measured).toHaveLength(2);
    expect(chart.series[0].path).not.toContain("L");
    expect(chart.series[0].measured[0].sourceHref).toContain("edit=a");
  });
  it("uses actual day intervals rather than spacing every visit equally", () => {
    const rows = [point("a", "2026-01-01", 1), point("b", "2026-01-02", 2), point("c", "2026-01-11", 3)];
    const positions = comparisonGeometry([{ key: "v", label: "v", color: "red", points: rows }]).series[0].measured;
    expect(positions[1].x - positions[0].x).toBeCloseTo((positions[2].x - positions[0].x) / 10);
  });
  it("shares a unit scale between pressure series without combining their readings", () => {
    const chart = comparisonGeometry([{ key: "s", label: "s", color: "red", points: [point("a", "2026-01-01", 115)] }, { key: "d", label: "d", color: "blue", points: [point("a", "2026-01-01", 75)] }]);
    expect(chart.series[0].measured[0].y).toBeLessThan(chart.series[1].measured[0].y);
    expect(chart.low).toBeLessThan(75);
    expect(chart.high).toBeGreaterThan(115);
  });
  it("does not imply chronological change from same-day-only observations", () => {
    expect(comparisonStats([point("a", "2026-01-01", 60), point("b", "2026-01-01", 61)]).difference).toBeNull();
    expect(comparisonStats([point("a", "2026-01-01", 0)]).latest?.value).toBe(0);
    const chart = comparisonGeometry([]);
    expect(Number.isFinite(chart.low)).toBe(true);
    expect(Number.isFinite(chart.high)).toBe(true);
  });
});
