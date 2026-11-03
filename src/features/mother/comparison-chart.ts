export type ComparisonPoint = {
  key: string; day: string; dateLabel: string; value: number | null;
  sourceLabel: string; sourceHref: string; ageLabel?: string | null;
};
export type ComparisonSeries = { key: string; label: string; color: string; points: ComparisonPoint[] };
export function comparisonStats(points: ComparisonPoint[]) {
  const measured = points.filter((point) => point.value != null && Number.isFinite(point.value));
  const first = measured[0], latest = measured.at(-1);
  return { count: measured.length, first, latest, difference: first && latest && first.day !== latest.day ? latest.value! - first.value! : null };
}
export function comparisonGeometry(series: ComparisonSeries[]) {
  const points = series.flatMap((item) => item.points);
  const values = points.flatMap((point) => point.value != null && Number.isFinite(point.value) ? [point.value] : []);
  const dates = points.map((point) => Date.parse(point.day)).filter(Number.isFinite);
  const firstDay = dates.length ? Math.min(...dates) : 0, lastDay = dates.length ? Math.max(...dates) : 0;
  const min = values.length ? Math.min(...values) : 0, max = values.length ? Math.max(...values) : 1;
  const padding = Math.max((max - min) * .2, Math.abs(max) * .03, .5);
  const low = Math.max(0, min - padding), high = max + padding;
  return { firstDay, lastDay, low, high, series: series.map((item) => {
    const measured = item.points.flatMap((point, index) => point.value != null && Number.isFinite(point.value) ? [{ ...point, value: point.value, index,
      x: firstDay === lastDay ? 190 : 46 + (Date.parse(point.day) - firstDay) / (lastDay - firstDay) * 280,
      y: 166 - (point.value - low) / (high - low) * 128,
    }] : []);
    return { ...item, measured, path: measured.map((point, index) => `${index && measured[index - 1].index === point.index - 1 ? "L" : "M"}${point.x},${point.y}`).join(" ") };
  }) };
}
