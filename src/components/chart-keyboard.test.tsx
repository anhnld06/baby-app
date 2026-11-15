import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GrowthLineChart } from "@/components/growth-line-chart";
import { MetricBarChart } from "@/components/metric-bar-chart";

const tabStops = (html: string) => html.match(/tabindex="0"/gi)?.length ?? 0;
const focusable = (html: string) => html.match(/<g[^>]*tabindex="0"[^>]*>/)?.[0] ?? "";

describe("chart keyboard access", () => {
  it("exposes a bar chart as a single tab stop on the latest logged bar", () => {
    const rows = Array.from({ length: 30 }, (_, index) => ({
      key: `d${index}`,
      label: `${index + 1}/11`,
      value: index < 28 ? index : null,
    }));
    const html = renderToStaticMarkup(
      <MetricBarChart rows={rows} unit="ml" label="Biểu đồ thử" />,
    );
    expect(tabStops(html)).toBe(1);
    expect(html.match(/tabindex="-1"/gi)).toHaveLength(29);
    expect(focusable(html)).toContain('aria-label="28/11: 27 ml"');
    expect(html).toContain("aria-describedby");
  });

  it("exposes a growth chart as a single tab stop and a data table", () => {
    const points = [1, 2, 3].map((n) => ({
      key: `p${n}`,
      value: 3 + n,
      age: n * 30,
      label: `0${n}/01/2026`,
      ageLabel: `${n} tháng`,
    }));
    const html = renderToStaticMarkup(
      <GrowthLineChart points={points} unit="kg" label="Cân nặng" />,
    );
    expect(tabStops(html)).toBe(1);
    expect(focusable(html)).toContain('aria-label="03/01/2026: 6 kg"');
    expect(html).toContain("<table");
    expect(html.match(/<tr class="border-t">/g)).toHaveLength(3);
  });
});
